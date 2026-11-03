import { comparableEqual } from './builtin.js'
import { runtimePanic } from './panic.js'
import {
  canonicalPointerIdentity,
  isStructObject,
  isStructTypeInfo,
  ownKeys,
  resolveTypeInfo,
  structFieldRuntimeKey,
  structValueMarker,
  TypeKind,
  type TypeInfo,
} from './type.js'

// GoMap indexes structs whose fields are all strings by their canonical field
// values; a string key, being canonical, is its own native Map key.
// Pointer-key maps use backing identity without inspecting their targets.
// Iteration retains the original key; object and struct equality stays in the
// shared comparison path below. Keys without an indexed representation
// allocate no secondary index and fall back to the shared comparison scan.
class GoMap<K, V> extends Map<K, V> {
  readonly pointerKeys: boolean
  private pointerIndex?: Map<object, K>
  // interfacePointers indexes each dynamic type separately at a shared address.
  private interfacePointers?: Map<string, Map<object, K>>
  private structKeys?: Map<string, K[]>
  // typedNilKeys holds the stored typed nil key of each Go type. All typed
  // nils of a type are equal, so the map holds at most one of them.
  private typedNilKeys?: Map<string, K>

  constructor(keyType?: TypeInfo | string) {
    super()
    const info = resolveTypeInfo(keyType)
    this.pointerKeys = info?.kind === TypeKind.Pointer
  }

  override set(key: K, value: V): this {
    if (this.pointerKeys) {
      key = this.storedKey(key)
      if (typeof key === 'object' && key !== null) {
        this.pointerIndex ??= new Map<object, K>()
        this.pointerIndex.set(canonicalPointerIdentity(key), key)
      }
    } else if (isInterfacePointerKey(key)) {
      // Equal backing of different dynamic types occupies different index slots.
      const stored = this.storedKey(key)
      this.interfacePointers ??= new Map<string, Map<object, K>>()
      let index = this.interfacePointers.get(key.__goType)
      if (index === undefined) {
        index = new Map<object, K>()
        this.interfacePointers.set(key.__goType, index)
      }
      index.set(canonicalPointerIdentity(key), stored)
      key = stored
    } else if (isTypedNilKey(key)) {
      const stored = this.storedKey(key)
      this.typedNilKeys ??= new Map<string, K>()
      this.typedNilKeys.set(key.__goType, stored)
      key = stored
    } else if (typeof key !== 'string') {
      const stored = this.structEntry(key)
      if (stored !== undefined) {
        key = stored
      } else {
        this.addStructKey(key)
      }
    }
    return super.set(key, value)
  }

  override get(key: K): V | undefined {
    return super.get(this.storedKey(key))
  }

  override has(key: K): boolean {
    return super.has(this.storedKey(key))
  }

  override delete(key: K): boolean {
    const stored = this.storedKey(key)
    if (this.pointerKeys) {
      if (typeof key === 'object' && key !== null)
        this.pointerIndex?.delete(canonicalPointerIdentity(key))
    } else if (isInterfacePointerKey(key)) {
      const index = this.interfacePointers?.get(key.__goType)
      index?.delete(canonicalPointerIdentity(key))
      if (index?.size === 0) this.interfacePointers?.delete(key.__goType)
    } else if (isTypedNilKey(key)) {
      if (stored === this.typedNilKeys?.get(key.__goType))
        this.typedNilKeys?.delete(key.__goType)
    } else if (typeof key !== 'string') this.removeStructKey(stored)
    return super.delete(stored)
  }

  override clear(): void {
    this.pointerIndex?.clear()
    this.interfacePointers?.clear()
    this.structKeys?.clear()
    this.typedNilKeys?.clear()
    super.clear()
  }

  // structEntry returns the stored key equal to key under Go struct
  // equality, or undefined when the index holds no matching candidate. The
  // bucket only narrows candidates; comparableEqual stays the equality
  // authority, so same-field structs of different types stay distinct.
  private structEntry(key: K): K | undefined {
    const canonical = structMapKey(key)
    if (canonical === undefined) return undefined
    return this.structLookup(key, canonical)
  }

  // structLookup returns the stored key equal to key, whose canonical index
  // key is given, or undefined if there is none.
  structLookup(key: K, canonical: string): K | undefined {
    const bucket = this.structKeys?.get(canonical)
    if (bucket === undefined) return undefined
    for (let i = 0; i < bucket.length; i++) {
      if (structKeysEqual(bucket[i], key)) return bucket[i]
    }
    return undefined
  }

  private storedKey(key: K): K {
    if (this.pointerKeys) {
      return typeof key === 'object' && key !== null ?
          (this.pointerIndex?.get(canonicalPointerIdentity(key)) ?? key)
        : key
    }

    // A pointer in an interface key is found by the storage it points to,
    // and is the stored key only if Go also compares them equal, which
    // takes the same dynamic type.
    if (isInterfacePointerKey(key)) {
      const stored = this.interfacePointers
        ?.get(key.__goType)
        ?.get(canonicalPointerIdentity(key))
      return (
          stored !== undefined &&
            (stored === key || comparableEqual(stored, key))
        ) ?
          stored
        : key
    }
    if (typeof key === 'string') {
      return key
    }

    // A typed nil key is the stored typed nil of its type, which Go also
    // compares equal to it.
    if (isTypedNilKey(key)) {
      const stored = this.typedNilKeys?.get(key.__goType)
      return stored !== undefined && comparableEqual(stored, key) ? stored : key
    }
    return this.structEntry(key) ?? key
  }

  private addStructKey(key: K): void {
    const canonical = structMapKey(key)
    if (canonical === undefined) return
    this.addStructKeyCanonical(key, canonical)
  }

  // setStruct sets the value of a struct key, whose canonical index key is
  // given, computing it only once for the whole operation.
  setStruct(key: K, canonical: string, value: V): void {
    const stored = this.structLookup(key, canonical)
    if (stored === undefined) {
      this.addStructKeyCanonical(key, canonical)
      super.set(key, value)
    } else {
      super.set(stored, value)
    }
  }

  private addStructKeyCanonical(key: K, canonical: string): void {
    this.structKeys ??= new Map<string, K[]>()
    const bucket = this.structKeys.get(canonical)
    if (bucket === undefined) {
      this.structKeys.set(canonical, [key])
    } else {
      bucket.push(key)
    }
  }

  private removeStructKey(stored: K): void {
    const canonical = structMapKey(stored)
    if (canonical === undefined) return
    const bucket = this.structKeys?.get(canonical)
    if (bucket === undefined) return
    const remaining = bucket.filter((member) => member !== stored)
    if (remaining.length === 0) {
      this.structKeys!.delete(canonical)
    } else {
      this.structKeys!.set(canonical, remaining)
    }
  }
}

// isInterfacePointerKey reports whether key is a pointer held in an
// interface, which comparableEqual finds equal only to the same pointer, or
// to a view of the same storage of the same type. GoMap indexes such keys by
// their storage, as it does the keys of pointer-key maps, instead of
// comparing them with every key of the map, and never by the fields they
// point to, which may change. A typed nil pointer equals any other of its
// type, so it is not one.
function isInterfacePointerKey(
  key: unknown,
): key is object & { __goType: string } {
  if (typeof key !== 'object' || key === null) return false
  const boxed = key as { __goType?: unknown; __isTypedNil?: unknown }
  return (
    typeof boxed.__goType === 'string' &&
    boxed.__goType.startsWith('*') &&
    boxed.__isTypedNil !== true
  )
}

// isTypedNilKey reports whether key is a typed nil, such as a nil pointer
// held in an interface, which comparableEqual finds equal only to the typed
// nils of its own type. GoMap indexes such keys by their type, instead of
// comparing them with every key of the map.
function isTypedNilKey(key: unknown): key is { __goType: string } {
  if (typeof key !== 'object' || key === null) return false
  const boxed = key as { __goType?: unknown; __isTypedNil?: unknown }
  return typeof boxed.__goType === 'string' && boxed.__isTypedNil === true
}

// makeMap receives pointer or generic key metadata from the compiler; other
// key types use Go value equality and the available value indexes.
export function makeMap<K, V>(
  entries?: Iterable<readonly [K, V]>,
  keyType?: TypeInfo | string,
): Map<K, V> {
  const map = new GoMap<K, V>(keyType)
  if (entries) for (const [key, value] of entries) mapSet(map, key, value)
  return map
}

// mapGet returns the value and presence without confusing stored undefined with a miss.
export function mapGet<K, V, D>(
  map: Map<K, V> | null,
  key: K,
  defaultValue: D,
): [V, true] | [D, false] {
  const entry = findMapEntry(map, key)
  if (entry.found) {
    return [entry.value, true]
  } else {
    return [defaultValue, false]
  }
}

// mapSet preserves the existing equal key when replacing its value.
export const mapSet = <K, V>(map: Map<K, V> | null, key: K, value: V): void => {
  if (!map) {
    runtimePanic('assignment to entry in nil map')
  }
  const canonical = goMapStructKey(map, key)
  if (canonical !== undefined) {
    ;(map as GoMap<K, V>).setStruct(key, canonical, value)
    return
  }
  const entry = findMapEntry(map, key)
  map.set(entry.found ? entry.key : key, value)
}

// goMapStructKey returns the canonical index key of a struct key of a GoMap,
// or undefined if the map or key is not of that kind.
function goMapStructKey<K, V>(map: Map<K, V>, key: K): string | undefined {
  if (
    !(map instanceof GoMap) ||
    map.pointerKeys ||
    typeof key !== 'object' ||
    key === null
  ) {
    return undefined
  }
  return structMapKey(key)
}

// deleteMapEntry removes a key using Go value equality.
export const deleteMapEntry = <K, V>(map: Map<K, V> | null, key: K): void => {
  const entry = findMapEntry(map, key)
  if (entry.found) {
    map!.delete(entry.key)
  }
}

// mapHas reports membership using Go value equality.
export const mapHas = <K, V>(map: Map<K, V> | null, key: K): boolean => {
  return findMapEntry(map, key).found
}

function findMapEntry<K, V>(
  map: Map<K, V> | null,
  key: K,
): { found: false } | { found: true; key: K; value: V } {
  if (!map) {
    return { found: false }
  }
  const canonical = goMapStructKey(map, key)
  if (canonical !== undefined) {
    const stored = (map as GoMap<K, V>).structLookup(key, canonical)
    if (stored === undefined) return { found: false }
    return {
      found: true,
      key: stored,
      value: Map.prototype.get.call(map, stored) as V,
    }
  }
  if (map.has(key)) {
    return { found: true, key, value: map.get(key)! }
  }
  if (
    map instanceof GoMap &&
    (map.pointerKeys || isInterfacePointerKey(key) || isTypedNilKey(key))
  ) {
    return { found: false }
  }
  if (typeof key === 'string') return { found: false }
  if (key === null || (typeof key !== 'object' && typeof key !== 'function')) {
    return { found: false }
  }
  if (map instanceof GoMap && structMapKey(key) !== undefined) {
    return { found: false }
  }
  for (const [candidate, value] of map.entries()) {
    if (candidate !== key && comparableEqual(candidate, key)) {
      return { found: true, key: candidate, value }
    }
  }
  return { found: false }
}

// structMapKey returns the canonical index key for a struct whose fields are
// all strings, numbers, booleans, pointers or such structs, or undefined for
// any other value. The canonical form narrows candidates by field values, in
// field name order, and pointers by their identity, since what they point to
// may change. Equal keys give equal text, which is all the index needs:
// structKeysEqual still decides identity, type, and field equality within a
// bucket, so the text names no fields and needs no delimiters that its
// values cannot contain, and stays short to build and hash. Keys with other
// fields, such as interfaces, remain on the comparison scan.
function structMapKey(key: unknown): string | undefined {
  // Only a struct object has a canonical key, built from its own fields; a
  // pointer in an interface is found by its storage instead.
  if (!isStructObject(key) || isInterfacePointerKey(key)) return undefined
  const plan = structKeyPlan(key)
  let text = ''
  for (let i = 0; i < plan.length; i++) {
    const field = plan[i]
    const value = structMapKeyField(key[field.name], field.kind)
    if (value === undefined) return undefined
    text += value + '|'
  }
  return text
}

// structKeysEqual reports whether two struct keys of the same index bucket
// are equal, as comparableEqual decides. Two values of the same class and
// dynamic type are equal when each field is identical, and not equal when a
// field holds two different numbers, strings, booleans or bigints, which Go
// compares as JavaScript does; any other difference, such as two objects
// that may be equal views, and any other pair of keys, is decided by
// comparableEqual.
function structKeysEqual(a: any, b: any): boolean {
  // Only values of one class and dynamic type compare field by field. A
  // struct object neither marked as a value nor boxed is a pointer, which
  // comparableEqual finds equal only to itself.
  const plan = cachedStructKeyPlan(a)
  if (
    plan === undefined ||
    a.constructor !== b.constructor ||
    a.__goType !== b.__goType ||
    (typeof a.__goType !== 'string' &&
      a[structValueMarker] !== true &&
      b[structValueMarker] !== true)
  ) {
    return comparableEqual(a, b)
  }

  // Identical fields are equal and different primitives are not.
  for (let i = 0; i < plan.length; i++) {
    const x = a[plan[i].name]
    const y = b[plan[i].name]
    if (x === y) continue
    if (typeof x === 'object' || typeof y === 'object') {
      return comparableEqual(a, b)
    }
    return false
  }
  return true
}

// StructKeyField is one field of the key plan of a struct type: its runtime
// name and its kind.
interface StructKeyField {
  name: string
  kind: TypeKind | undefined
}

// structKeyPlans caches the key plan of each struct class, so that
// structMapKey does not sort the field names and resolve their kinds for
// every map operation.
const structKeyPlans = new WeakMap<object, StructKeyField[]>()

// structKeyPlan returns the fields of a struct key in name order, with their
// kinds, cached for a struct of a registered class.
function structKeyPlan(key: object): StructKeyField[] {
  // A struct of a registered class shares one plan.
  const ctor = (key as { constructor?: { __typeInfo?: TypeInfo } }).constructor
  const cacheable = ctor !== undefined && ctor.__typeInfo !== undefined
  if (cacheable) {
    const cached = structKeyPlans.get(ctor)
    if (cached !== undefined) return cached
  }

  // The fields are sorted by name so equal keys give equal text.
  const kinds = structFieldKinds(key)
  const plan = ownKeys(key)
    .sort()
    .map((name) => ({ name, kind: kinds?.get(name) }))

  // A plan built without field kinds is not cached.
  if (cacheable && kinds !== undefined) {
    structKeyPlans.set(ctor, plan)
  }
  return plan
}

// cachedStructKeyPlan returns the key plan of a struct of a registered
// class that structKeyPlan cached, or undefined.
function cachedStructKeyPlan(key: object): StructKeyField[] | undefined {
  const ctor = (key as { constructor?: object }).constructor
  return ctor === undefined ? undefined : structKeyPlans.get(ctor)
}

// structFieldKinds returns the kind of each field of a struct value by its
// runtime key, from the type info of its class, or undefined without one.
function structFieldKinds(value: object): Map<string, TypeKind> | undefined {
  // The kinds come from the type info of the value's class.
  const ctor = (value as { constructor?: { __typeInfo?: TypeInfo } })
    .constructor
  const info = resolveTypeInfo(ctor?.__typeInfo)
  if (info === undefined || !isStructTypeInfo(info)) return undefined

  // The kinds of a class are computed once.
  let kinds = structFieldKindCache.get(info)
  if (kinds === undefined) {
    kinds = new Map()
    for (const field of info.fields) {
      const kind = resolveTypeInfo(field.type)?.kind
      if (kind !== undefined) kinds.set(structFieldRuntimeKey(field), kind)
    }
    structFieldKindCache.set(info, kinds)
  }
  return kinds
}

const structFieldKindCache = new WeakMap<object, Map<string, TypeKind>>()

// pointerKeyIDs numbers the pointers in struct map keys by identity.
const pointerKeyIDs = new WeakMap<object, number>()
let nextPointerKeyID = 1

// structMapKeyField returns the index text of a struct key field of the
// given kind: a string, number, boolean, pointer or nested struct, or
// undefined for any other field, which leaves the key unindexed.
function structMapKeyField(
  value: unknown,
  kind: TypeKind | undefined,
): string | undefined {
  // Strings and primitives are indexed by their value.
  if (typeof value === 'string') return 's' + value
  switch (typeof value) {
    case 'number':
      return 'n' + String(value)
    case 'bigint':
      return 'n' + value.toString()
    case 'boolean':
      return value ? 't' : 'f'
  }

  // A pointer is indexed by a number given to its identity.
  if (kind === TypeKind.Pointer) {
    if (value === null || value === undefined) return 'p0'
    if (typeof value !== 'object') return undefined
    const identity = canonicalPointerIdentity(value)
    let id = pointerKeyIDs.get(identity)
    if (id === undefined) {
      id = nextPointerKeyID++
      pointerKeyIDs.set(identity, id)
    }
    return 'p' + id
  }

  // A nested struct is indexed by its own key.
  if (kind !== TypeKind.Struct) return undefined
  const nested = structMapKey(value)
  return nested === undefined ? undefined : 'r' + nested
}

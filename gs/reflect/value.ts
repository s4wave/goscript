import * as $ from '@goscript/builtin/index.js'
import {
  Array,
  Bool,
  Float32,
  Float64,
  Int,
  Int16,
  Int32,
  Int64,
  Int8,
  Map,
  PointerTo,
  Ptr,
  Slice,
  SliceOf,
  Struct,
  String,
  Type,
  Uint,
  Uint16,
  Uint32,
  Uint64,
  Uint8,
  Uintptr,
  Value,
  Chan,
  structFieldStorageKey,
  sliceAppendHint,
  interfaceStoreValue,
  sliceTypeHint,
  TypeOf,
  typeIdentityKey,
  typeInfoFromReflectType,
  runtimeTypeString,
} from './type.js'
import {
  Pointer,
  ReflectValue,
  SelectCase,
  SelectDefault,
  SelectRecv,
  SelectSend,
} from './types.js'

// Zero returns a Value representing the zero value for the specified type.
export function Zero(typ: Type | null): Value {
  if (typ === null) {
    return new Value() // Return invalid value for null type
  }
  return new Value(zeroReflectValue(typ), typ)
}

function zeroReflectValue(typ: Type): ReflectValue {
  switch (typ.Kind()) {
    case Bool:
      return false
    case Int:
    case Int8:
    case Int16:
    case Int32:
    case Uint:
    case Uint8:
    case Uint16:
    case Uint32:
    case Float32:
    case Float64:
      return 0
    case Int64:
    case Uint64:
    case Uintptr:
      return 0n
    case String:
      return ''
    case Slice:
      return []
    case Array:
      return zeroArrayValue(typ)
    case Struct:
      return $.markAsStructValue(newStructPointer(typ))
    default:
      return null
  }
}

// zeroArrayValue returns a new zero array of the array type typ, holding its
// length of zero elements, as a byte array or a marked array value, as the
// compiler makes them.
function zeroArrayValue(typ: Type): ReflectValue {
  const length = typ.Len()
  const elem = typ.Elem()
  if (elem.Kind() === Uint8) {
    return $.arrayValue(new Uint8Array(length)) as ReflectValue
  }
  const values = globalThis.Array.from({ length }, () => zeroReflectValue(elem))
  return $.arrayValue(values, typeInfoFromReflectType(typ)) as ReflectValue
}

// newStructPointer returns a new zero struct of type typ in its pointer
// form: an instance not marked as a struct value.
function newStructPointer(typ: Type): ReflectValue {
  const typeInfo = $.getTypeByName(runtimeTypeString(typ))
  if (typeInfo && $.isStructTypeInfo(typeInfo) && typeInfo.ctor) {
    return new typeInfo.ctor() as ReflectValue
  }
  return newStructValue(typ)
}

// newStructValue returns a new zero struct of the type typ, which has no
// registered constructor, such as an anonymous struct type.
function newStructValue(typ: Type): ReflectValue {
  type StructValueInstance = Record<string, ReflectValue>

  // The fields are own properties of the struct object, starting at zero.
  const initFields = (value: StructValueInstance): void => {
    for (let i = 0; i < typ.NumField(); i++) {
      const field = typ.Field(i)
      const key = structFieldStorageKey(typ, i)
      value[key] = zeroReflectValue(field.Type!)
    }
  }

  // A clone copies each field.
  const StructValue = class {
    public clone(): unknown {
      const cloned = new StructValue() as unknown as StructValueInstance
      initFields(cloned)
      for (const key of Object.keys(this)) {
        cloned[key] = (this as unknown as StructValueInstance)[key]
      }
      return cloned
    }
  }
  Object.defineProperty(StructValue, '__reflectType', { value: typ })
  Object.defineProperty(StructValue, '__typeInfo', {
    value: typeInfoFromReflectType(typ),
  })

  const value = new StructValue() as unknown as StructValueInstance
  initFields(value)
  return value as ReflectValue
}

// Copy copies the contents of src to dst until either dst has been filled
// or src has been exhausted. It returns the number of elements copied. Like
// the copy builtin, it copies within the slices' lengths, and src may be a
// string when dst is a byte slice.
export function Copy(dst: Value, src: Value): number {
  return $.copy(dst.value as $.Slice<unknown>, src.value as $.Slice<unknown>)
}

// Indirect returns the value that v points to.
export function Indirect(v: Value): Value {
  if (v.Kind() === Ptr) {
    if (v.IsNil()) {
      return new Value()
    }
    return v.Elem()
  }
  return v
}

// New returns a Value representing a pointer to a new zero value for the specified type.
export function New(typ: Type | null): Value {
  if (typ === null) {
    return new Value() // Return invalid value for null type
  }
  const ptrType = PointerTo(typ)
  // A pointer to a struct is the struct object itself, as &T{} is.
  if (typ.Kind() === Struct) {
    return new Value(newStructPointer(typ), ptrType)
  }
  return new Value($.varRef(zeroReflectValue(typ)), ptrType)
}

// NewAt returns a Value representing a pointer to the value at p.
export function NewAt(typ: Type | null, p: Pointer | unknown): Value {
  if (typ === null) {
    return new Value()
  }
  const ptrType = PointerTo(typ)
  const pointer = ownedPointerHandleFromPointerArg(p)
  if (pointer !== undefined) {
    return new Value(
      $.ownedPointerRef(pointer) as $.VarRef<ReflectValue>,
      ptrType,
    )
  }
  // An address computed by unsafe pointer arithmetic resolves by offset.
  if (typeof p === 'number' || typeof p === 'bigint') {
    const value = pointerAtAddress(typ, Number(p))
    if (value !== undefined) {
      return value
    }
  }
  throw new Error('reflect.NewAt requires a GoScript-owned pointer')
}

// pointerAtAddress returns a pointer of type *typ to the value at a synthetic
// address: an object's address (from Value.Pointer) plus, for a struct, the
// offset of one of its fields, possibly nested, as unsafe pointer arithmetic
// computes it.
function pointerAtAddress(typ: Type, address: number): Value | undefined {
  // Split the address into the object it was assigned to and an offset.
  const base =
    Math.floor(address / $.pointerAddressStride) * $.pointerAddressStride
  const offset = address - base
  let target: unknown = $.objectAtAddress(base)
  if (target === undefined) {
    return undefined
  }
  // A variable's address is that of its value; a struct variable's fields
  // are found by offset in the struct it holds.
  if ($.isVarRef(target)) {
    const held = target.value
    const heldType =
      held === null || held === undefined ? null : TypeOf(held as ReflectValue)
    if (heldType === null || heldType.Kind() !== Struct) {
      return offset === 0 ?
          new Value(target as $.VarRef<ReflectValue>, PointerTo(typ))
        : undefined
    }
    target = held
  }
  if (target === null || typeof target !== 'object') {
    return undefined
  }
  // A struct object is also its own pointer, and may be tagged as one.
  let structType = TypeOf(target as ReflectValue)
  if (structType?.Kind() === Ptr) {
    structType = structType.Elem()
  }
  if (structType === null || structType.Kind() !== Struct) {
    return undefined
  }
  if (offset === 0 && typeIdentityKey(structType) === typeIdentityKey(typ)) {
    return new Value(target as ReflectValue, PointerTo(typ))
  }
  return fieldPointerAtOffset(
    new Value(target as ReflectValue, structType),
    typ,
    offset,
  )
}

// fieldPointerAtOffset returns a pointer to the field of struct value v, or
// of a struct nested in it, at offset with type typ.
function fieldPointerAtOffset(
  v: Value,
  typ: Type,
  offset: number,
): Value | undefined {
  const structType = v.Type()
  for (let i = 0; i < structType.NumField(); i++) {
    const field = structType.Field(i)
    const fieldType = field.Type!
    const start = field.Offset
    if (offset < start || offset >= start + Math.max(fieldType.Size(), 1)) {
      continue
    }
    const fieldValue = v.Field(i)
    if (
      offset === start &&
      typeIdentityKey(fieldType) === typeIdentityKey(typ)
    ) {
      return fieldValue.Addr()
    }
    if (fieldType.Kind() === Struct) {
      return fieldPointerAtOffset(fieldValue, typ, offset - start)
    }
  }
  return undefined
}

export function SliceAt(
  typ: Type | null,
  p: Pointer | unknown,
  n: number,
): Value {
  if (typ === null) {
    return new Value()
  }
  if (n < 0) {
    throw new Error('reflect.SliceAt: negative length')
  }
  if (p === null && n === 0) {
    return new Value(null, SliceOf(typ))
  }
  const pointer = ownedPointerHandleFromPointerArg(p)
  if (pointer === undefined) {
    throw new Error('reflect.SliceAt requires a GoScript-owned pointer')
  }
  const slice = $.sliceFromOwnedPointer(pointer, n)
  return new Value(slice as ReflectValue, SliceOf(typ))
}

function ownedPointerHandleFromPointerArg(
  p: unknown,
): $.OwnedPointerHandle<ReflectValue> | undefined {
  if ($.isOwnedPointerHandle(p)) {
    return p as $.OwnedPointerHandle<ReflectValue>
  }
  if ($.isVarRef(p)) {
    return $.ownedPointerFromRef(p as $.VarRef<ReflectValue>) as
      | $.OwnedPointerHandle<ReflectValue>
      | undefined
  }
  return undefined
}

// MakeSlice returns a Value representing a new slice with the specified type, length, and capacity.
export function MakeSlice(typ: Type | null, len: number, cap: number): Value {
  if (typ === null || typ.Kind() !== Slice) {
    throw new Error('reflect.MakeSlice of non-slice type')
  }
  if (len < 0) {
    throw new Error('reflect.MakeSlice: negative len')
  }
  if (cap < len) {
    throw new Error('reflect.MakeSlice: len > cap')
  }

  // Create a slice with the specified length and capacity, with each
  // element a distinct zero value, so struct elements are not shared.
  const elemType = typ.Elem()
  if (!elemType) {
    throw new Error('slice type missing element type')
  }
  const slice = $.makeSlice(len, cap, sliceTypeHint(elemType), () =>
    zeroReflectValue(elemType),
  )
  return new Value(slice, typ)
}

// MakeMap returns a Value representing a new map with the specified type.
export function MakeMap(typ: Type | null): Value {
  if (typ === null || typ.Kind() !== Map) {
    throw new Error('reflect.MakeMap of non-map type')
  }

  const map = new globalThis.Map()
  return new Value(map, typ)
}

export function MakeMapWithSize(typ: Type | null, _n: number): Value {
  return MakeMap(typ)
}

// Append appends the values x to a slice and returns the resulting slice.
export function Append(s: Value, x: Value): Value {
  if (s.Kind() !== Slice) {
    throw new Error('reflect.Append of non-slice')
  }
  // The hint keeps a slice of typed array elements in its typed array, and
  // an element of an interface type is boxed with its type.
  const hint = sliceAppendHint(s.Type().Elem())
  const elem = interfaceStoreValue(x, s.Type().Elem())
  const elements = hint === undefined ? [elem] : [elem, hint]
  return new Value(
    $.append(s.value as $.Slice<unknown>, ...elements) as ReflectValue,
    s.Type(),
  )
}

export function AppendSlice(s: Value, t: Value): Value {
  if (s.Kind() !== Slice || t.Kind() !== Slice) {
    throw new Error('reflect.AppendSlice of non-slice')
  }
  // The hint keeps a slice of typed array elements in its typed array.
  const right = $.asArray(t.value as $.Slice<unknown>)
  const hint = sliceAppendHint(s.Type().Elem())
  const elements = hint === undefined ? right : [...right, hint]
  return new Value(
    $.append(s.value as $.Slice<unknown>, ...elements) as ReflectValue,
    s.Type(),
  )
}

// MakeChan returns a Value representing a new channel with the specified type.
export function MakeChan(typ: Type, buffer: number): Value {
  // Only a channel type with an element type qualifies.
  if (typ.Kind() !== Chan) {
    throw new Error('reflect.MakeChan of non-chan type')
  }
  const elemType = typ.Elem()
  if (!elemType) {
    throw new Error('channel type missing element type')
  }

  // A receive from a closed channel yields the element's zero value.
  const channel = $.makeChannel(buffer, Zero(elemType).value)
  return new Value(channel, typ)
}

// Select executes a select operation described by the list of cases. Like
// the Go select statement, it blocks until at least one of the cases can
// proceed, makes a uniform pseudo-random choice, and then executes that case.
// It returns the index of the chosen case and, if that case was a receive,
// the value received and whether it was sent on the channel rather than being
// the zero value received because the channel is closed. A nil channel is
// never ready.
export async function Select(
  cases: $.Slice<SelectCase>,
): Promise<[number, Value, boolean]> {
  let chosen = -1
  let recv = new Value()
  let recvOK = false
  let hasDefault = false

  const selectCases: $.SelectCase<ReflectValue>[] = []
  for (const [i, c] of $.asArray(cases).entries()) {
    switch (c.Dir) {
      case SelectDefault:
        if (hasDefault) {
          throw new Error('reflect.Select: multiple default cases')
        }
        hasDefault = true
        selectCases.push({
          id: -1,
          isSend: false,
          channel: null,
          onSelected: async () => {
            chosen = i
          },
        })
        break
      case SelectSend:
        selectCases.push({
          id: i,
          isSend: true,
          channel: c.Chan!.sendChan(),
          value: c.Send!.currentValue(),
          onSelected: async () => {
            chosen = i
          },
        })
        break
      case SelectRecv: {
        const elem = c.Chan!.Type().Elem()
        selectCases.push({
          id: i,
          isSend: false,
          channel: c.Chan!.recvChan(),
          onSelected: async (result) => {
            chosen = i
            recvOK = result.ok
            recv = result.ok ? new Value(result.value, elem) : Zero(elem)
          },
        })
        break
      }
      default:
        throw new Error('reflect.Select: invalid Dir')
    }
  }

  await $.selectStatement(selectCases, hasDefault)
  return [chosen, recv, recvOK]
}

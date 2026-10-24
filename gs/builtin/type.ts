import {
  isArrayOrGoSlice,
  isTypedSlice,
  typedSliceHintOf,
  typedSliceHintOfBasic,
  type TypedSlice,
} from './slice.js'
import { isVarRef, pointerAddress, varRef, type VarRef } from './varRef.js'
import { runtimePanic } from './panic.js'

/**
 * TypeKind Represents the kinds of Go types that can be registered at runtime.
 */
export enum TypeKind {
  Basic = 'basic',
  Interface = 'interface',
  Struct = 'struct',
  Map = 'map',
  Slice = 'slice',
  Array = 'array',
  Pointer = 'pointer',
  Function = 'function',
  Channel = 'channel',
}

/**
 * BaseTypeInfo Base type information shared by all type kinds.
 */
export interface BaseTypeInfo {
  name?: string
  typeName?: string
  kind: TypeKind
  zeroValue?: any
}

/**
 * MethodArg Represents an argument or a return value of a method.
 */
export interface MethodArg {
  name?: string // Name of the argument/return value, if available
  type: TypeInfo | string // TypeInfo object or string name of the type
}

/**
 * MethodSignature Represents the signature of a method, including its name, arguments, and return types.
 */
export interface MethodSignature {
  name: string
  args: MethodArg[]
  returns: MethodArg[]
  // pointerReceiver is set for a method of a type's method set that is only
  // in the method set of a pointer to the type, such as a method with a
  // pointer receiver, so it is not called on a value that is not addressable.
  pointerReceiver?: boolean
  // variadic is set for a method whose final parameter is variadic.
  variadic?: boolean
}

/** MethodParameter encodes a type and an optional declared parameter name. */
export type MethodParameter =
  | TypeInfo
  | string
  | [name: string, type: TypeInfo | string]

/** methodSignature expands generated parameter tables for runtime reflection. */
export function methodSignature(
  name: string,
  args: readonly MethodParameter[] = [],
  returns: readonly MethodParameter[] = [],
  pointerReceiver = false,
  variadic = false,
): MethodSignature {
  const signature: MethodSignature = {
    name,
    args: methodParameters(args, '_p'),
    returns: methodParameters(returns, '_r'),
  }
  if (pointerReceiver) {
    signature.pointerReceiver = true
  }
  if (variadic) {
    signature.variadic = true
  }
  return signature
}

function methodParameters(
  parameters: readonly MethodParameter[],
  prefix: string,
): MethodArg[] {
  return parameters.map((parameter, index) =>
    isArrayOrGoSlice(parameter) ?
      { name: parameter[0], type: parameter[1] }
    : { name: prefix + index, type: parameter },
  )
}

/**
 * StructFieldInfo Information about a struct field including type and optional tag.
 */
export interface StructFieldInfo {
  type: TypeInfo | string // The field's type
  name: string // The Go field name.
  key?: string // The runtime storage key on generated or dynamic values.
  tag?: string // The struct field tag (e.g., `json:"name,omitempty"`)
  pkgPath?: string // Non-empty for unexported fields.
  anonymous?: boolean
  index?: number[]
  offset?: number
  exported?: boolean
}

/** Construct complete field metadata without repeating its common properties. */
export function structField(
  name: string,
  type: TypeInfo | string,
  index: number[],
  offset: number,
  exported: boolean,
  options?: Pick<StructFieldInfo, 'key' | 'tag' | 'pkgPath' | 'anonymous'>,
): StructFieldInfo {
  return { name, key: name, type, index, offset, exported, ...options }
}

/**
 * StructTypeInfo Type information for struct types.
 */
export interface StructTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Struct
  methods: MethodSignature[] // Array of method signatures
  ctor?: new (...args: any[]) => any
  fields: StructFieldInfo[] // Ordered field descriptors.
}

/**
 * InterfaceTypeInfo Type information for interface types.
 */
export interface InterfaceTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Interface
  methods: MethodSignature[] // Array of method signatures
}

/**
 * BasicTypeInfo Type information for basic types (string, number, boolean).
 */
export interface BasicTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Basic
}

/**
 * MapTypeInfo Type information for map types.
 */
export interface MapTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Map
  keyType?: string | TypeInfo
  elemType?: string | TypeInfo
}

/**
 * SliceTypeInfo Type information for slice types.
 */
export interface SliceTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Slice
  elemType?: string | TypeInfo
}

/**
 * ArrayTypeInfo Type information for array types.
 */
export interface ArrayTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Array
  elemType?: string | TypeInfo
  length: number
}

/**
 * PointerTypeInfo Type information for pointer types.
 */
export interface PointerTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Pointer
  elemType?: string | TypeInfo
}

/**
 * FunctionTypeInfo Type information for function types.
 */
export interface FunctionTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Function
  params?: (string | TypeInfo)[]
  results?: (string | TypeInfo)[]
  isVariadic?: boolean // True if the function is variadic (e.g., ...T)
}

/**
 * ChannelTypeInfo Type information for channel types.
 */
export interface ChannelTypeInfo extends BaseTypeInfo {
  kind: TypeKind.Channel
  elemType?: string | TypeInfo
  direction?: 'send' | 'receive' | 'both'
}

/**
 * TypeInfo is used for runtime type checking.
 * Can be a registered type (from typeRegistry) or an ad-hoc type description.
 * When used as input to typeAssert, it can be a string (type name) or a structured description.
 */
export type TypeInfo =
  | StructTypeInfo
  | InterfaceTypeInfo
  | BasicTypeInfo
  | MapTypeInfo
  | SliceTypeInfo
  | ArrayTypeInfo
  | PointerTypeInfo
  | FunctionTypeInfo
  | ChannelTypeInfo

/** Construct a fresh basic descriptor without repeating its shape in generated code. */
export function basicType(name: string, typeName?: string): BasicTypeInfo {
  const info: BasicTypeInfo = { kind: TypeKind.Basic, name }
  if (typeName !== undefined) info.typeName = typeName
  return info
}

/** Construct a fresh pointer descriptor for generated reflection metadata. */
export function pointerType(elemType: TypeInfo | string): PointerTypeInfo {
  return { kind: TypeKind.Pointer, elemType }
}

/** Construct a fresh slice descriptor, preserving an optional named type. */
export function sliceType(
  elemType: TypeInfo | string,
  typeName?: string,
): SliceTypeInfo {
  const info: SliceTypeInfo = { kind: TypeKind.Slice, elemType }
  if (typeName !== undefined) info.typeName = typeName
  return info
}

/** Construct a fresh array descriptor with its fixed length. */
export function arrayType(
  elemType: TypeInfo | string,
  length: number,
): ArrayTypeInfo {
  return { kind: TypeKind.Array, elemType, length }
}

/** Construct a fresh map descriptor with its key and element types. */
export function mapType(
  keyType: TypeInfo | string,
  elemType: TypeInfo | string,
): MapTypeInfo {
  return { kind: TypeKind.Map, keyType, elemType }
}

/** Construct a fresh channel descriptor with its declared direction. */
export function channelType(
  elemType: TypeInfo | string,
  direction: ChannelTypeInfo['direction'],
): ChannelTypeInfo {
  return { kind: TypeKind.Channel, direction, elemType }
}

// isStructTypeInfo Type guard functions for TypeInfo variants.
export function isStructTypeInfo(info: TypeInfo): info is StructTypeInfo {
  return info.kind === TypeKind.Struct
}

export function isInterfaceTypeInfo(info: TypeInfo): info is InterfaceTypeInfo {
  return info.kind === TypeKind.Interface
}

export function isBasicTypeInfo(info: TypeInfo): info is BasicTypeInfo {
  return info.kind === TypeKind.Basic
}

export function isMapTypeInfo(info: TypeInfo): info is MapTypeInfo {
  return info.kind === TypeKind.Map
}

export function isSliceTypeInfo(info: TypeInfo): info is SliceTypeInfo {
  return info.kind === TypeKind.Slice
}

export function isArrayTypeInfo(info: TypeInfo): info is ArrayTypeInfo {
  return info.kind === TypeKind.Array
}

export function isPointerTypeInfo(info: TypeInfo): info is PointerTypeInfo {
  return info.kind === TypeKind.Pointer
}

export function isFunctionTypeInfo(info: TypeInfo): info is FunctionTypeInfo {
  return info.kind === TypeKind.Function
}

export function isChannelTypeInfo(info: TypeInfo): info is ChannelTypeInfo {
  return info.kind === TypeKind.Channel
}

/**
 * isStructFieldInfo Type guard to check if a field value is a StructFieldInfo (has 'type' property)
 * vs a direct TypeInfo or string.
 */
export function isStructFieldInfo(
  fieldValue: unknown,
): fieldValue is StructFieldInfo {
  return (
    typeof fieldValue === 'object' &&
    fieldValue !== null &&
    'type' in fieldValue &&
    'name' in fieldValue &&
    !('kind' in fieldValue)
  )
}

/**
 * Comparable interface for Go's comparable constraint.
 * Types that implement this can be compared with == and !=.
 */
export interface Comparable {
  // This is a marker interface - any type that can be compared implements this
}

// Registry to store runtime type information
const typeRegistry = new Map<string, TypeInfo>()
const duplicateTypeRegistry = new Map<string, TypeInfo[]>()

// typeRegistryGeneration counts the registrations of types, so that cached
// results that depend on the registry can tell when it has changed.
let typeRegistryGeneration = 0

function registerTypeInfo(name: string, typeInfo: TypeInfo): void {
  typeRegistryGeneration++
  const existing = typeRegistry.get(name)
  if (existing && existing !== typeInfo) {
    const candidates = duplicateTypeRegistry.get(name) ?? [existing]
    if (!candidates.includes(typeInfo)) {
      candidates.push(typeInfo)
    }
    duplicateTypeRegistry.set(name, candidates)
  }
  typeRegistry.set(name, typeInfo)
}

// typePackagePaths maps a named type's runtime name, such as
// "testdata.Node", to its full package path, for packages whose path
// differs from their name.
const typePackagePaths = new Map<string, string>()

/**
 * registerTypePackagePath records the full package path of the named types
 * declared in a package whose path differs from its name.
 *
 * @param pkgPath The full package path, as reported by reflect PkgPath.
 * @param typeNames The runtime names of the types, such as "pkg.Type".
 */
export function registerTypePackagePath(
  pkgPath: string,
  typeNames: string[],
): void {
  for (const typeName of typeNames) {
    typePackagePaths.set(typeName, pkgPath)
  }
}

/**
 * typePackagePath returns the full package path of the named type with the
 * given runtime name, such as "pkg.Type" or "pkg.Generic[int]", or "" when
 * the name has no package qualifier.
 */
export function typePackagePath(typeName: string): string {
  // A registered package path wins, whatever the type arguments are.
  const bracket = typeName.indexOf('[')
  const baseName = bracket >= 0 ? typeName.substring(0, bracket) : typeName
  const registered = typePackagePaths.get(baseName)
  if (registered !== undefined) {
    return registered
  }

  // Otherwise the qualifier of the name is the path.
  const dotIndex = baseName.lastIndexOf('.')
  return dotIndex > 0 ? baseName.substring(0, dotIndex) : ''
}

/**
 * goTypeString returns the Go spelling of a runtime type string. The runtime
 * names the types of packages that share a name with another package of the
 * program by a name with a hash of the package path after a middle dot,
 * which the Go spelling leaves out.
 */
export function goTypeString(name: string): string {
  return name.includes('·') ? name.replace(/·[0-9a-z]+/g, '') : name
}

/**
 * registerNamedType registers the runtime type information of a named map,
 * slice or array type under its Go type string, so that code given only the
 * name, such as encoding/json, can resolve its key and element types.
 *
 * @param name The Go type string of the named type, e.g. "pkg.Style".
 * @param underlying The type information of its underlying type.
 * @returns The registered type information, which carries the name.
 */
export function registerNamedType(
  name: string,
  underlying: TypeInfo,
): TypeInfo {
  const typeInfo = { ...underlying, typeName: name } as TypeInfo
  registerTypeInfo(name, typeInfo)
  return typeInfo
}

/**
 * registerStructType Registers a struct type with the runtime type system.
 *
 * @param name The name of the type.
 * @param zeroValue The zero value for the type.
 * @param methods Method signatures, or a factory evaluated once on first inspection.
 * @param ctor Constructor for the struct.
 * @param fields Field descriptors, or a factory evaluated once on first inspection.
 * @returns The struct type information object.
 */
export const registerStructType = (
  name: string,
  zeroValue: any,
  methods: MethodSignature[] | (() => MethodSignature[]),
  ctor: new (...args: any[]) => any,
  fields: StructFieldInfo[] | (() => StructFieldInfo[]) = [],
): StructTypeInfo => {
  const typeInfo: StructTypeInfo = {
    name,
    kind: TypeKind.Struct,
    zeroValue,
    get methods() {
      if (typeof methods === 'function') methods = methods()
      return methods
    },
    set methods(value) {
      methods = value
    },
    ctor,
    get fields() {
      if (typeof fields === 'function') fields = fields()
      return fields
    },
    set fields(value) {
      fields = value
    },
  }
  registerTypeInfo(name, typeInfo)
  return typeInfo
}

/**
 * overrideTypeMethods gives the method signatures of the struct or interface
 * type name, which an override package registers by hand, possibly without
 * them or with inexact ones, so that reflection finds its methods. The Go
 * signatures replace the registered ones the first time they are given.
 *
 * @param typeInfo The type information of a value of the type or a pointer to it.
 * @param name The name of the type.
 * @param methods A factory of the method signatures of the type.
 * @returns typeInfo.
 */
export function overrideTypeMethods<T>(
  typeInfo: T,
  name: string,
  methods: () => MethodSignature[],
): T {
  // A registered struct or interface takes the signatures once.
  const registered = typeRegistry.get(name)
  if (
    registered === undefined ||
    overriddenMethodTypes.has(registered) ||
    !(isStructTypeInfo(registered) || isInterfaceTypeInfo(registered))
  ) {
    return typeInfo
  }
  overriddenMethodTypes.add(registered)
  registered.methods = methods()
  return typeInfo
}

// overriddenMethodTypes holds the registered types that overrideTypeMethods
// has given their Go method signatures.
const overriddenMethodTypes = new WeakSet<TypeInfo>()

function resolveZeroValue<T>(zeroValue: any): T {
  if (typeof zeroValue === 'function') {
    return zeroValue() as T
  }
  return zeroValue as T
}

/**
 * registerInterfaceType Registers an interface type with the runtime type system.
 *
 * @param name The name of the type.
 * @param zeroValue The zero value for the type (usually null).
 * @param methods Array of method signatures for the interface.
 * @returns The interface type information object.
 */
export const registerInterfaceType = (
  name: string,
  zeroValue: any,
  methods: MethodSignature[],
): InterfaceTypeInfo => {
  const typeInfo: InterfaceTypeInfo = {
    name,
    kind: TypeKind.Interface,
    zeroValue,
    methods,
  }
  registerTypeInfo(name, typeInfo)
  return typeInfo
}

// The builtin error interface is predeclared in Go. Register it so a bare
// "error" type assertion (x.(error)), which the compiler emits by the universe
// type name, resolves to its method set instead of an unmatched basic type. Any
// value with an Error() string method, including recovered runtime panics,
// then satisfies it.
registerInterfaceType('error', null, [
  {
    name: 'Error',
    args: [],
    returns: [{ type: { kind: TypeKind.Basic, name: 'string' } }],
  },
])

/**
 * getTypeByName Gets a registered type by name from the type registry.
 * Returns undefined if the type is not registered.
 */
export const getTypeByName = (name: string): TypeInfo | undefined => {
  return typeRegistry.get(name)
}

/**
 * resolveTypeInfo returns the type information that info describes, looking up
 * a type name in the type registry.
 */
export function resolveTypeInfo(
  info?: TypeInfo | string,
): TypeInfo | undefined {
  return typeof info === 'string' ? getTypeByName(info) : info
}

/**
 * TypeAssertResult Represents the result of a type assertion.
 */
export interface TypeAssertResult<T> {
  value: T
  ok: boolean
}

/**
 * Normalizes a type info to a structured TypeInfo object.
 *
 * @param info The type info or name.
 * @returns A normalized TypeInfo object.
 */
function normalizeTypeInfo(info: string | TypeInfo): TypeInfo {
  if (typeof info === 'string') {
    const typeInfo = typeRegistry.get(info)
    if (typeInfo) {
      return typeInfo
    }
    return {
      kind: TypeKind.Basic,
      name: info,
    }
  }

  return info
}

/**
 * isTypeInfoComparable reports whether a dynamic Go type supports equality.
 *
 * @param info The dynamic type descriptor.
 * @returns True when values of the type may be compared.
 */
export function isTypeInfoComparable(info: string | TypeInfo): boolean {
  const normalized = normalizeTypeInfo(info)
  switch (normalized.kind) {
    case TypeKind.Map:
    case TypeKind.Slice:
    case TypeKind.Function:
      return false
    case TypeKind.Array:
      return (
        normalized.elemType === undefined ||
        isTypeInfoComparable(normalized.elemType)
      )
    case TypeKind.Struct:
      return normalized.fields.every((field) =>
        isTypeInfoComparable(field.type),
      )
    default:
      return true
  }
}

function typeInfoRuntimeName(info: TypeInfo): string | undefined {
  return info.typeName || info.name
}

function goTypeMatchesTypeInfo(goType: string, info: TypeInfo): boolean {
  const runtimeName = typeInfoRuntimeName(info)
  if (runtimeName !== undefined && goType === runtimeName) {
    return true
  }

  // The comparison parses the type string, so its result is cached on the
  // type info, until more types are registered.
  let cache = (info as any)[goTypeMatchCacheKey] as
    | Map<string, number>
    | undefined
  if (cache === undefined) {
    cache = new globalThis.Map()
    ;(info as any)[goTypeMatchCacheKey] = cache
  }
  const cached = cache.get(goType)
  if (cached !== undefined && cached >> 1 === typeRegistryGeneration) {
    return (cached & 1) === 1
  }
  const ok = compareTypeStringWithTypeInfo(goType, info)
  cache.set(goType, (typeRegistryGeneration << 1) | (ok ? 1 : 0))
  return ok
}

// goTypeMatchCacheKey holds the cache of goTypeMatchesTypeInfo results on a
// type info, keyed by the Go type string, with the type registry generation
// in which each was computed.
const goTypeMatchCacheKey = Symbol('goTypeMatchCache')

interface TypeInfoComparisonState {
  seenPairs: Set<string>
  objectIDs: WeakMap<object, number>
  nextObjectID: number
}

function newTypeInfoComparisonState(): TypeInfoComparisonState {
  return {
    seenPairs: new Set(),
    objectIDs: new WeakMap(),
    nextObjectID: 0,
  }
}

function typeInfoComparisonID(
  raw: string | TypeInfo,
  normalized: TypeInfo,
  state: TypeInfoComparisonState,
): string {
  const runtimeName = typeInfoRuntimeName(normalized)
  if (runtimeName !== undefined) {
    return `${normalized.kind}:${runtimeName}`
  }
  if (typeof raw === 'string') {
    return `string:${raw}`
  }
  const existing = state.objectIDs.get(raw)
  if (existing !== undefined) {
    return `object:${existing}`
  }
  const id = state.nextObjectID
  state.nextObjectID += 1
  state.objectIDs.set(raw, id)
  return `object:${id}`
}

function compareOptionalTypeInfo(
  type1: string | TypeInfo | undefined,
  type2: string | TypeInfo | undefined,
  state: TypeInfoComparisonState,
): boolean {
  if (type1 === undefined && type2 === undefined) return true
  if (type1 === undefined || type2 === undefined) return false
  return areTypeInfosIdenticalWithSeen(type1, type2, state)
}

function areFuncParamOrResultArraysIdentical(
  arr1?: (string | TypeInfo)[],
  arr2?: (string | TypeInfo)[],
  state = newTypeInfoComparisonState(),
): boolean {
  if (arr1 === undefined && arr2 === undefined) return true
  if (arr1 === undefined || arr2 === undefined) return false
  if (arr1.length !== arr2.length) return false
  for (const [index, typeInfo] of arr1.entries()) {
    if (!areTypeInfosIdenticalWithSeen(typeInfo, arr2[index], state)) {
      return false
    }
  }
  return true
}

function areFuncSignaturesIdentical(
  func1: FunctionTypeInfo,
  func2: FunctionTypeInfo,
  state = newTypeInfoComparisonState(),
): boolean {
  if ((func1.isVariadic || false) !== (func2.isVariadic || false)) {
    return false
  }
  return (
    areFuncParamOrResultArraysIdentical(func1.params, func2.params, state) &&
    areFuncParamOrResultArraysIdentical(func1.results, func2.results, state)
  )
}

export function areTypeInfosIdentical(
  type1InfoOrName: string | TypeInfo,
  type2InfoOrName: string | TypeInfo,
): boolean {
  const simple = simpleTypeInfosIdentical(type1InfoOrName, type2InfoOrName)
  if (simple !== undefined) {
    return simple
  }
  return areTypeInfosIdenticalWithSeen(
    type1InfoOrName,
    type2InfoOrName,
    newTypeInfoComparisonState(),
  )
}

// simpleTypeInfosIdentical reports whether two type infos are trivially
// identical or not, or undefined if that takes the full comparison. They are
// identical when they have the same name, are the same basic type, or are
// pointers or slices to the same named element type, and not identical when
// two descriptors differ in their kind or name, as the full comparison finds.
// Generated code makes a new type info at each use, so these common cases are
// worth checking first.
function simpleTypeInfosIdentical(
  t1: string | TypeInfo,
  t2: string | TypeInfo,
): boolean | undefined {
  // The same object or name is the same type. A name is resolved as the
  // full comparison resolves it, to its registered type, or else to a basic
  // type of that name, which it then compares in the same way.
  if (t1 === t2) {
    return true
  }
  if (typeof t1 === 'string') {
    t1 = normalizeTypeInfo(t1)
  }
  if (typeof t2 === 'string') {
    t2 = normalizeTypeInfo(t2)
  }
  if (t1 === t2) {
    return true
  }

  // A different kind or name is a different type.
  if (
    t1.kind !== t2.kind ||
    t1.name !== t2.name ||
    (t1.typeName ?? '') !== (t2.typeName ?? '')
  ) {
    return false
  }

  // Only a basic type or an element named by a string is decided here. Two
  // element names are decided by the types registered under them, so that
  // asserting a pointer to one named type against another, as go/types does
  // in Unalias for every type, takes no full comparison.
  switch (t1.kind) {
    case TypeKind.Basic:
      return t1.name !== undefined ? true : undefined
    case TypeKind.Pointer:
    case TypeKind.Slice: {
      const e1 = (t1 as PointerTypeInfo | SliceTypeInfo).elemType
      const e2 = (t2 as PointerTypeInfo | SliceTypeInfo).elemType
      if (typeof e1 !== 'string' || typeof e2 !== 'string') {
        return undefined
      }
      if (e1 === e2) {
        return true
      }
      return simpleTypeInfosIdentical(
        normalizeTypeInfo(e1),
        normalizeTypeInfo(e2),
      )
    }
  }
  return undefined
}

function areTypeInfosIdenticalWithSeen(
  type1InfoOrName: string | TypeInfo,
  type2InfoOrName: string | TypeInfo,
  state: TypeInfoComparisonState,
): boolean {
  const t1Norm = normalizeTypeInfo(type1InfoOrName)
  const t2Norm = normalizeTypeInfo(type2InfoOrName)

  if (t1Norm === t2Norm) return true
  if (t1Norm.kind !== t2Norm.kind) return false

  if ((t1Norm.typeName ?? '') !== (t2Norm.typeName ?? '')) return false
  if (t1Norm.name !== t2Norm.name) return false

  if (
    t1Norm.name !== undefined &&
    (t1Norm.kind === TypeKind.Basic ||
      t1Norm.kind === TypeKind.Struct ||
      t1Norm.kind === TypeKind.Interface)
  ) {
    return true
  }

  const pairKey = `${typeInfoComparisonID(
    type1InfoOrName,
    t1Norm,
    state,
  )}|${typeInfoComparisonID(type2InfoOrName, t2Norm, state)}`
  if (state.seenPairs.has(pairKey)) {
    return true
  }
  state.seenPairs.add(pairKey)

  switch (t1Norm.kind) {
    case TypeKind.Basic:
      return true
    case TypeKind.Pointer:
      return compareOptionalTypeInfo(
        (t1Norm as PointerTypeInfo).elemType,
        (t2Norm as PointerTypeInfo).elemType,
        state,
      )
    case TypeKind.Slice:
      return compareOptionalTypeInfo(
        (t1Norm as SliceTypeInfo).elemType,
        (t2Norm as SliceTypeInfo).elemType,
        state,
      )
    case TypeKind.Array:
      return (
        (t1Norm as ArrayTypeInfo).length === (t2Norm as ArrayTypeInfo).length &&
        compareOptionalTypeInfo(
          (t1Norm as ArrayTypeInfo).elemType,
          (t2Norm as ArrayTypeInfo).elemType,
          state,
        )
      )
    case TypeKind.Map:
      return (
        compareOptionalTypeInfo(
          (t1Norm as MapTypeInfo).keyType,
          (t2Norm as MapTypeInfo).keyType,
          state,
        ) &&
        compareOptionalTypeInfo(
          (t1Norm as MapTypeInfo).elemType,
          (t2Norm as MapTypeInfo).elemType,
          state,
        )
      )
    case TypeKind.Channel:
      return (
        ((t1Norm as ChannelTypeInfo).direction || 'both') ===
          ((t2Norm as ChannelTypeInfo).direction || 'both') &&
        compareOptionalTypeInfo(
          (t1Norm as ChannelTypeInfo).elemType,
          (t2Norm as ChannelTypeInfo).elemType,
          state,
        )
      )
    case TypeKind.Function:
      return areFuncSignaturesIdentical(
        t1Norm as FunctionTypeInfo,
        t2Norm as FunctionTypeInfo,
        state,
      )
    case TypeKind.Struct:
      if (t2Norm.kind !== TypeKind.Struct) {
        return false
      }
      return areStructTypeInfosIdentical(t1Norm, t2Norm, state)
    case TypeKind.Interface:
      if (t2Norm.kind !== TypeKind.Interface) {
        return false
      }
      return areInterfaceTypeInfosIdentical(t1Norm, t2Norm, state)
    default:
      return false
  }
}

function areStructTypeInfosIdentical(
  struct1: StructTypeInfo,
  struct2: StructTypeInfo,
  state: TypeInfoComparisonState,
): boolean {
  if (struct1.fields.length !== struct2.fields.length) {
    return false
  }
  for (const [index, field1] of struct1.fields.entries()) {
    const field2 = struct2.fields[index]
    if (
      field2 === undefined ||
      field1.name !== field2.name ||
      (field1.pkgPath ?? '') !== (field2.pkgPath ?? '') ||
      (field1.tag ?? '') !== (field2.tag ?? '') ||
      (field1.anonymous ?? false) !== (field2.anonymous ?? false) ||
      !areTypeInfosIdenticalWithSeen(field1.type, field2.type, state)
    ) {
      return false
    }
  }
  return true
}

function areInterfaceTypeInfosIdentical(
  interface1: InterfaceTypeInfo,
  interface2: InterfaceTypeInfo,
  state: TypeInfoComparisonState,
): boolean {
  const methods1 = sortedMethodSignatures(interface1.methods)
  const methods2 = sortedMethodSignatures(interface2.methods)
  if (methods1.length !== methods2.length) {
    return false
  }
  for (const [index, method1] of methods1.entries()) {
    const method2 = methods2[index]
    if (
      method2 === undefined ||
      method1.name !== method2.name ||
      !areMethodArgArraysIdentical(method1.args, method2.args, state) ||
      !areMethodArgArraysIdentical(method1.returns, method2.returns, state)
    ) {
      return false
    }
  }
  return true
}

function sortedMethodSignatures(
  methods: MethodSignature[] = [],
): MethodSignature[] {
  return [...methods].sort((left, right) =>
    left.name < right.name ? -1
    : left.name > right.name ? 1
    : 0,
  )
}

function areMethodArgArraysIdentical(
  args1: MethodArg[],
  args2: MethodArg[],
  state: TypeInfoComparisonState,
): boolean {
  if (args1.length !== args2.length) {
    return false
  }
  for (const [index, arg1] of args1.entries()) {
    const arg2 = args2[index]
    if (
      arg2 === undefined ||
      !areTypeInfosIdenticalWithSeen(arg1.type, arg2.type, state)
    ) {
      return false
    }
  }
  return true
}

/**
 * Validates that a map key matches the expected type info.
 *
 * @param key The key to validate
 * @param keyTypeInfo The normalized type info for the key
 * @returns True if the key matches the type info, false otherwise
 */
function validateMapKey(key: any, keyTypeInfo: TypeInfo): boolean {
  if (keyTypeInfo.kind === TypeKind.Basic) {
    // For string keys
    if (keyTypeInfo.name === 'string') {
      return typeof key === 'string'
    } else if (
      keyTypeInfo.name === 'int' ||
      keyTypeInfo.name === 'float64' ||
      keyTypeInfo.name === 'number'
    ) {
      if (typeof key === 'string') {
        return /^-?\d+(\.\d+)?$/.test(key)
      } else {
        return typeof key === 'number'
      }
    }
  }
  return false
}

/**
 * Checks if a value matches a basic type info.
 *
 * @param value The value to check.
 * @param info The basic type info to match against.
 * @returns True if the value matches the basic type, false otherwise.
 */
function matchesBasicType(value: any, info: TypeInfo): boolean {
  if (info.name === 'string') return typeof value === 'string'
  if (info.name === 'int64' || info.name === 'uint64')
    return typeof value === 'bigint'
  if (
    info.name === 'number' ||
    info.name === 'int' ||
    info.name === 'int8' ||
    info.name === 'int16' ||
    info.name === 'int32' ||
    info.name === 'uint' ||
    info.name === 'uintptr' ||
    info.name === 'uint8' ||
    info.name === 'byte' ||
    info.name === 'uint16' ||
    info.name === 'uint32' ||
    info.name === 'float32' ||
    info.name === 'float64'
  )
    return typeof value === 'number'
  if (info.name === 'boolean' || info.name === 'bool')
    return typeof value === 'boolean'
  return false
}

/**
 * Checks if a value matches a struct type info.
 *
 * @param value The value to check.
 * @param info The struct type info to match against.
 * @returns True if the value matches the struct type, false otherwise.
 */
function matchesStructType(value: any, info: TypeInfo): boolean {
  if (!isStructTypeInfo(info)) return false

  // For named struct types with constructors, use instanceof (nominal matching)
  if (info.ctor && value instanceof info.ctor) {
    // With inversion: struct value assertions should ONLY match structs marked as values
    // In Go: j.(MyStruct) should only succeed if j contains a struct value (not pointer)
    return isMarkedAsStructValue(value)
  }

  // For named struct types with constructors, if instanceof fails, return false
  // This ensures named struct types use exact type matching
  if (info.ctor) {
    return false
  }

  // For anonymous struct types (no constructor), use structural matching
  if (typeof value === 'object' && value !== null && info.fields) {
    const fields = info.fields || []
    const fieldNames = fields.map((field) => structFieldRuntimeKey(field))
    const valueFields = Object.keys(value)

    const fieldsExist = fieldNames.every((field) => field in value)
    const sameFieldCount = valueFields.length === fieldNames.length
    const allFieldsInStruct = valueFields.every((field) =>
      fieldNames.includes(field),
    )

    if (fieldsExist && sameFieldCount && allFieldsInStruct) {
      return fields.every((field) => {
        const key = structFieldRuntimeKey(field)
        return matchesType(value[key], normalizeTypeInfo(field.type))
      })
    }

    return false
  }

  return false
}

export function structFieldRuntimeKey(field: StructFieldInfo): string {
  return field.key || field.name
}

/**
 * Checks if a value matches an interface type info by verifying it implements
 * all required methods with compatible signatures.
 *
 * @param value The value to check.
 * @param info The interface type info to match against.
 * @returns True if the value matches the interface type, false otherwise.
 */
function matchesInterfaceType(value: any, info: TypeInfo): boolean {
  // The result for a value of a registered struct type depends only on its
  // type, so it is cached on the interface type info for the type, as GopherJS
  // does, instead of checking the method set each time.
  const target =
    value?.__isVarRef === true && 'value' in value ? value.value : value
  const ctor = typeof target === 'object' ? target?.constructor : undefined
  if (ctor === undefined || ctor.__typeInfo === undefined) {
    return matchesInterfaceTypeUncached(value, info)
  }

  // The cache of the interface type is keyed by the class of the value, and
  // then by its Go type, which distinguishes a struct from a pointer to it.
  // Different classes can carry the same Go type name, as values boxed in
  // generic code do, so a cache keyed by the name alone thrashes.
  const goType: string = value.__goType ?? ''
  let cache = (info as any)[interfaceMatchCacheKey] as
    | Map<unknown, Map<string, boolean>>
    | undefined
  if (cache === undefined) {
    cache = new globalThis.Map()
    ;(info as any)[interfaceMatchCacheKey] = cache
  }
  let byType = cache.get(ctor)
  if (byType === undefined) {
    byType = new globalThis.Map()
    cache.set(ctor, byType)
  }

  // A result is computed once for each class and Go type.
  const cached = byType.get(goType)
  if (cached !== undefined) {
    return cached
  }
  const ok = matchesInterfaceTypeUncached(value, info)
  byType.set(goType, ok)
  return ok
}

// interfaceMatchCacheKey holds the cache of matchesInterfaceType results on
// an interface type info, keyed by the class and Go type of the value.
const interfaceMatchCacheKey = Symbol('interfaceMatchCache')

// pointerReceiverMethods returns the names of the methods that are only in
// the method set of a pointer to the dynamic type of value, when that type is
// a registered type that is not a pointer, or undefined otherwise.
function pointerReceiverMethods(value: any): Set<string> | undefined {
  // Only a value boxed with its Go type name can be told apart from a pointer.
  const goType = value.__goType
  if (typeof goType !== 'string' || goType.startsWith('*')) {
    return undefined
  }
  const methods = (typeRegistry.get(goType) as any)?.methods
  if (!globalThis.Array.isArray(methods)) {
    return undefined
  }

  // The registered method set marks the methods that need a pointer.
  let names: Set<string> | undefined
  for (const method of methods as MethodSignature[]) {
    if (method.pointerReceiver === true) {
      names ??= new globalThis.Set()
      names.add(method.name)
    }
  }
  return names
}

function matchesInterfaceTypeUncached(value: any, info: TypeInfo): boolean {
  // Check basic conditions first
  if (!isInterfaceTypeInfo(info) || value === null || value === undefined) {
    return false
  }
  if (info.methods.length === 0) {
    return true
  }
  if (typeof value !== 'object') {
    return false
  }

  const methodTarget =
    value.__isVarRef === true && 'value' in value ? value.value : value
  if (
    (typeof methodTarget !== 'object' && typeof methodTarget !== 'function') ||
    methodTarget === null
  ) {
    return false
  }

  // A value of a type that is not a pointer has only the methods with value
  // receivers, so a method that needs a pointer receiver does not count.
  const pointerOnly = pointerReceiverMethods(value)

  // For interfaces, check if the value has all the required methods with compatible signatures
  return info.methods.every((requiredMethodSig) => {
    if (pointerOnly?.has(requiredMethodSig.name)) {
      return false
    }
    const actualMethod = (methodTarget as any)[requiredMethodSig.name]

    // Method must exist and be a function
    if (typeof actualMethod !== 'function') {
      return false
    }

    // Check parameter count (basic arity check)
    // Note: This is a simplified check as JavaScript functions can have optional/rest parameters
    const declaredParamCount = actualMethod.length
    const requiredParamCount = requiredMethodSig.args.length

    // Strict arity checking can be problematic in JS, so we'll be lenient
    // A method with fewer params than required is definitely incompatible
    if (declaredParamCount < requiredParamCount) {
      if (!methodWrapperMatchesSignature(actualMethod, requiredMethodSig)) {
        return false
      }
    }

    const wrappedMethodSignature = methodWrapperSignature(actualMethod)
    if (
      wrappedMethodSignature &&
      !methodSignaturesMatch(wrappedMethodSignature, requiredMethodSig)
    ) {
      return false
    }

    // Check return types if we can determine them
    // This is challenging in JavaScript without runtime type information

    // If the value has a __goTypeName property, it might be a registered type
    // with more type information available
    if (methodTarget.__goTypeName) {
      const valueTypeInfo = typeRegistry.get(methodTarget.__goTypeName)
      if (valueTypeInfo && isStructTypeInfo(valueTypeInfo)) {
        // Find the matching method in the value's type info
        const valueMethodSig = valueTypeInfo.methods.find(
          (m) => m.name === requiredMethodSig.name,
        )

        if (valueMethodSig) {
          // Compare return types
          if (
            valueMethodSig.returns.length !== requiredMethodSig.returns.length
          ) {
            return false
          }

          // Compare each return type for compatibility
          for (let i = 0; i < requiredMethodSig.returns.length; i++) {
            const requiredReturnType = normalizeTypeInfo(
              requiredMethodSig.returns[i].type,
            )
            const valueReturnType = normalizeTypeInfo(
              valueMethodSig.returns[i].type,
            )

            // For interface return types, we need to check if the value's return type
            // implements the required interface
            if (isInterfaceTypeInfo(requiredReturnType)) {
              // This would be a recursive check, but we'll simplify for now
              // by just checking if the types are the same or if the value type
              // is registered as implementing the interface
              if (requiredReturnType.name !== valueReturnType.name) {
                // Check if valueReturnType implements requiredReturnType
                // This would require additional implementation tracking
                return false
              }
            }
            // For non-interface types, check direct type compatibility
            else if (requiredReturnType.name !== valueReturnType.name) {
              return false
            }
          }

          // Similarly, we could check parameter types for compatibility
          // but we'll skip that for brevity
        }
      }
    }

    // If we can't determine detailed type information, we'll accept the method
    // as long as it exists with a compatible arity
    return true
  })
}

function methodWrapperMatchesSignature(
  method: unknown,
  requiredMethodSig: MethodSignature,
): boolean {
  const signature = methodWrapperSignature(method)
  return (
    signature != null && methodSignaturesMatch(signature, requiredMethodSig)
  )
}

function methodWrapperSignature(method: unknown): MethodSignature | null {
  if (typeof method !== 'function') {
    return null
  }
  const wrapper = method as {
    __goscriptMethodWrapper?: boolean
    __goscriptMethodSignature?: MethodSignature
  }
  return wrapper.__goscriptMethodSignature ?? null
}

function methodSignaturesMatch(
  actual: MethodSignature,
  required: MethodSignature,
): boolean {
  return (
    actual.args.length === required.args.length &&
    actual.returns.length === required.returns.length
  )
}

/**
 * Checks if a value matches a map type info.
 *
 * @param value The value to check.
 * @param info The map type info to match against.
 * @returns True if the value matches the map type, false otherwise.
 */
function matchesMapType(value: any, info: TypeInfo): boolean {
  if (typeof value !== 'object' || value === null) return false
  // A Go slice/array is never a map, even though Object.entries() of a
  // plain JS array yields string-indexed pairs that would otherwise pass
  // the key/elem sampling below.
  if (isArrayOrGoSlice(value) || value instanceof Uint8Array) return false
  if (!isMapTypeInfo(info)) return false

  if (info.keyType || info.elemType) {
    const entries =
      value instanceof Map ? Array.from(value.entries()) : Object.entries(value)

    if (entries.length === 0) return true // Empty map matches any map type

    const sampleSize = Math.min(5, entries.length)
    for (let i = 0; i < sampleSize; i++) {
      const [k, v] = entries[i]

      if (info.keyType) {
        if (
          !validateMapKey(
            k,
            normalizeTypeInfo(info.keyType as string | TypeInfo),
          )
        ) {
          return false
        }
      }

      if (
        info.elemType &&
        !matchesType(v, normalizeTypeInfo(info.elemType as string | TypeInfo))
      ) {
        return false
      }
    }
  }

  return true
}

/**
 * Checks if a value matches an array or slice type info.
 *
 * @param value The value to check.
 * @param info The array or slice type info to match against.
 * @returns True if the value matches the array or slice type, false otherwise.
 */
function matchesArrayOrSliceType(value: any, info: TypeInfo): boolean {
  // For slices and arrays, check if the value is an array and sample element types
  if (!isArrayTypeInfo(info) && !isSliceTypeInfo(info)) return false

  if (isTypedSlice(value)) {
    if (isArrayTypeInfo(info) && value.length !== info.length) return false
    return typedElementMatches(value, info.elemType)
  }

  if (!isArrayOrGoSlice(value)) return false

  if (info.elemType) {
    const arr = value as any[]
    if (arr.length === 0) return true // Empty array matches any array type

    const sampleSize = Math.min(5, arr.length)
    for (let i = 0; i < sampleSize; i++) {
      if (
        !matchesType(
          arr[i],
          normalizeTypeInfo(info.elemType as string | TypeInfo),
        )
      ) {
        return false
      }
    }
  }

  return true
}

// predeclaredBasicNames holds the names of Go's predeclared basic types,
// with byte and rune as uint8 and int32.
const predeclaredBasicNames = new Set([
  'bool',
  'string',
  'int',
  'int8',
  'int16',
  'int32',
  'int64',
  'uint',
  'uint8',
  'uint16',
  'uint32',
  'uint64',
  'uintptr',
  'float32',
  'float64',
  'complex64',
  'complex128',
])

// typedElementMatches reports whether a typed slice holds elements of the
// given type: those of the kind of its typed array, or of a named type, whose
// underlying kind its type information does not give.
function typedElementMatches(
  value: TypedSlice,
  typeInfo: string | TypeInfo | undefined,
): boolean {
  // Elements of an unknown type, or of any number type, match.
  if (typeInfo === undefined) return true
  const info = normalizeTypeInfo(typeInfo)
  if (info.kind !== TypeKind.Basic) return false
  if (info.name === undefined || info.name === 'number') return true

  // A predeclared type must be that of the typed array.
  const name =
    info.name === 'byte' ? 'uint8'
    : info.name === 'rune' ? 'int32'
    : info.name
  const hint = typedSliceHintOf(value)
  return (
    !predeclaredBasicNames.has(name) ||
    name === (hint === 'byte' ? 'uint8' : hint)
  )
}

// structValueMarker is the property that marks a struct instance as a value,
// not a pointer. The constructors of generated struct classes set it
// themselves.
export const structValueMarker = Symbol('structValue')

// markAsStructValue Mark a struct instance as representing a value (not pointer).
export function markAsStructValue<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    ;(value as any)[structValueMarker] = true
  }
  return value
}

// Symbol that holds an anonymous struct value's type descriptor
const ANONYMOUS_STRUCT_TYPE = Symbol('anonymousStructType')

/**
 * anonymousStructValue gives an anonymous struct object the value semantics of
 * a named struct: it is marked as a struct value and clones by its fields.
 */
export function anonymousStructValue<T extends object>(
  value: T,
  typeInfo: string | TypeInfo,
): T {
  ;(value as any)[ANONYMOUS_STRUCT_TYPE] = typeInfo
  return markAsStructValue(value)
}

/**
 * isStructObject reports whether value is an object of a Go struct class,
 * whose fields are its own properties. Plain objects of anonymous struct
 * types are not struct class objects.
 */
export function isStructObject(
  value: unknown,
): value is Record<string, unknown> {
  // Only an object of a class with a type info can be one.
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const info = (value as any).constructor?.__typeInfo
  if (info === undefined) {
    return false
  }

  // The class is a struct class when its type info is a struct's.
  if (typeof info === 'object') {
    return info.kind === TypeKind.Struct
  }
  return resolveTypeInfo(info)?.kind === TypeKind.Struct
}

/** structValueTypeInfo returns the descriptor a struct value carries, if any. */
export function structValueTypeInfo(
  value: unknown,
): TypeInfo | string | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined
  }
  return (
    (value as any).constructor?.__typeInfo ??
    (value as any)[ANONYMOUS_STRUCT_TYPE]
  )
}

// cloneAnonymousStruct copies each field of an anonymous struct value, cloning
// the struct and array fields that Go copies by value.
function cloneAnonymousStruct(
  value: Record<string, unknown>,
  typeInfo: string | TypeInfo,
): Record<string, unknown> {
  const info = normalizeTypeInfo(typeInfo)
  const clone = { ...value }
  if (info.kind === TypeKind.Struct) {
    for (const field of info.fields) {
      const key = structFieldRuntimeKey(field)
      const fieldValue = clone[key]
      if (isMarkedAsStructValue(fieldValue)) {
        clone[key] = markAsStructValue(cloneStructValue(fieldValue))
        continue
      }
      if (normalizeTypeInfo(field.type).kind === TypeKind.Array) {
        clone[key] = cloneArrayValue(fieldValue, field.type)
      }
    }
  }
  return anonymousStructValue(clone, typeInfo)
}

export function cloneStructValue<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    const anonymousType = (value as any)[ANONYMOUS_STRUCT_TYPE]
    if (anonymousType !== undefined) {
      return cloneAnonymousStruct(value as any, anonymousType) as T
    }
  }
  const cloneable = value as T & {
    __goscriptClone?: () => T
    clone?: () => T
  }
  if (typeof cloneable.__goscriptClone === 'function') {
    return cloneable.__goscriptClone()
  }
  if (typeof cloneable.clone === 'function') {
    return cloneable.clone()
  }
  throw new Error('runtime error: value is not cloneable')
}

export function namedStructConversion<T>(value: unknown): T {
  return markAsStructValue(cloneStructValue(value)) as T
}

interface PointerCastTarget {
  prototype: object
}

interface PointerCastSource {
  identity: object
  object: object
  ref?: { value: unknown }
}

const pointerIdentities = new WeakMap<object, object>()
const pointerViews = new WeakMap<object, WeakMap<PointerCastTarget, object>>()

function pointerCastSource(value: unknown): PointerCastSource | null {
  if (isVarRef(value)) {
    const inner = value.value
    if (typeof inner !== 'object' || inner === null) {
      return null
    }
    return { identity: value, object: inner, ref: value }
  }
  if (typeof value !== 'object' || value === null) {
    return null
  }
  return { identity: value, object: value }
}

// ElementPointer is a reference to an element of a slice or array, made anew
// by each &s[i], which names the element by the storage that backs it and
// its index there: an array and an element index, or the ArrayBuffer of a
// typed array and a byte offset.
interface ElementPointer {
  readonly __goElementBacking: object
  readonly __goElementIndex: number
}

// elementPointer returns value as a reference to an element, or undefined if
// it is another pointer.
function elementPointer(value: object): ElementPointer | undefined {
  // Only references to elements name a backing storage.
  if ((value as Partial<ElementPointer>).__goElementBacking === undefined) {
    return undefined
  }
  return value as ElementPointer
}

// elementIdentities holds, for each backing storage, the first reference
// seen to each of its elements, which stands for that element.
const elementIdentities = new WeakMap<object, Map<number, object>>()

function elementIdentity(pointer: ElementPointer): object {
  // The references seen to the elements of the backing storage.
  const backing = pointer.__goElementBacking
  let identities = elementIdentities.get(backing)
  if (identities === undefined) {
    identities = new Map<number, object>()
    elementIdentities.set(backing, identities)
  }

  // The first reference seen to the element stands for it.
  const index = pointer.__goElementIndex
  const identity = identities.get(index)
  if (identity !== undefined) {
    return identity
  }
  identities.set(index, pointer)
  return pointer
}

// sameElement reports whether two references name the same element.
function sameElement(a: ElementPointer, b: ElementPointer): boolean {
  return (
    a.__goElementBacking === b.__goElementBacking &&
    a.__goElementIndex === b.__goElementIndex
  )
}

// canonicalPointerIdentity resolves the backing storage shared by pointer
// aliases and by the references to one element.
export function canonicalPointerIdentity(value: object): object {
  // A pointer seen before keeps its identity.
  const identity = pointerIdentities.get(value)
  if (identity !== undefined) {
    return identity
  }

  // A reference to an element is identified by the element, other pointers
  // by themselves.
  const element = elementPointer(value)
  const canonical = element === undefined ? value : elementIdentity(element)
  pointerIdentities.set(value, canonical)
  return canonical
}

// pointerAliasesMade records that a pointer view aliases another pointer's
// storage, before which pointers are equal only as the same object or as
// references to the same element. Compiled code compares pointers with ===
// and calls pointerEqual only if this is set or the left one is a reference
// to an element, which has a __goElementBacking.
export let pointerAliasesMade = false

function markPointerAlias(source: object, view: object): void {
  // The view shares the identity of the storage of its source.
  pointerAliasesMade = true
  pointerIdentities.set(view, canonicalPointerIdentity(source))
}

// aliasIdentity returns the storage that a pointer view or a reference to an
// element shares with other pointers, or undefined for another pointer.
function aliasIdentity(value: object): object | undefined {
  // A view has the identity of its source.
  const identity = pointerIdentities.get(value)
  if (identity !== undefined) {
    return identity
  }

  // A reference to an element has the identity of the element.
  const element = elementPointer(value)
  return element === undefined ? undefined : elementIdentity(element)
}

function pointerBackingIdentityEqual(a: object, b: object): boolean {
  // References to the same element are equal.
  const aElement = elementPointer(a)
  const bElement = elementPointer(b)
  if (
    aElement !== undefined &&
    bElement !== undefined &&
    sameElement(aElement, bElement)
  ) {
    return true
  }

  // Pointer views are equal to the pointers whose storage they share.
  if (!pointerAliasesMade) {
    return false
  }
  const aIdentity = aliasIdentity(a)
  return aIdentity !== undefined && aIdentity === aliasIdentity(b)
}

/** pointerIdentityEqual reports alias equality for interface pointer values. */
export function pointerIdentityEqual(a: object, b: object): boolean {
  if (!pointerBackingIdentityEqual(a, b)) {
    return false
  }
  if (
    '__goType' in a &&
    '__goType' in b &&
    typeof a.__goType === 'string' &&
    typeof b.__goType === 'string' &&
    a.__goType !== b.__goType
  ) {
    return false
  }
  return true
}

/** pointerEqual reports whether two Go pointers identify the same storage. */
export function pointerEqual(a: unknown, b: unknown): boolean {
  // The same pointer, or two nil pointers, are equal.
  if (a === b) {
    return true
  }
  if (a === null || a === undefined) {
    return b === null || b === undefined
  }

  // Other pointers are equal if they share storage.
  return (
    typeof a === 'object' &&
    a !== null &&
    typeof b === 'object' &&
    b !== null &&
    pointerBackingIdentityEqual(a, b)
  )
}

// forwardStructFields defines each field of the struct that read returns as
// a property of view that reads and writes that struct's field, so that a
// view of another type shares the struct's storage.
function forwardStructFields(view: object, read: () => unknown): void {
  const current = read()
  if (typeof current !== 'object' || current === null) {
    return
  }
  for (const key of Object.keys(current)) {
    Object.defineProperty(view, key, {
      configurable: true,
      enumerable: true,
      get: () => (read() as Record<string, unknown> | null)?.[key],
      set: (value: unknown) => {
        const target = read() as Record<string, unknown> | null
        if (target !== null && typeof target === 'object') {
          target[key] = value
        }
      },
    })
  }
}

function destinationPointerView(
  source: PointerCastSource,
  target: PointerCastTarget,
): object {
  let views = pointerViews.get(source.identity)
  if (views === undefined) {
    views = new WeakMap<PointerCastTarget, object>()
    pointerViews.set(source.identity, views)
  }
  const existing = views.get(target)
  if (existing !== undefined) {
    return existing
  }
  // The view shares the fields of the struct the pointer points to, or
  // copies the properties of other storage.
  const view = Object.create(target.prototype)
  const ref = source.ref
  if (ref !== undefined) {
    forwardStructFields(view, () => ref.value)
  } else if (isStructObject(source.object)) {
    const object = source.object
    forwardStructFields(view, () => object)
  } else {
    Object.assign(view, source.object)
  }
  views.set(target, view)
  markPointerAlias(source.identity, view)
  return view
}

/**
 * unsafePointerCast returns a destination method-set view over shared pointer
 * storage when target is present, or preserves the identity-only unsafe cast.
 */
export function unsafePointerCast<T>(
  value: unknown,
  target?: PointerCastTarget,
): T {
  const source = pointerCastSource(value)
  if (source === null || target === undefined) {
    return value as T
  }
  return destinationPointerView(source, target) as T
}

// Symbol that marks a JavaScript array as a Go array value. It holds the
// array's type descriptor when its elements are values that need cloning.
const ARRAY_VALUE_TYPE = Symbol('arrayValueType')

/**
 * arrayValue marks storage as a Go array value, so bulk slice copies clone it.
 * Arrays of composite elements pass their descriptor; scalar arrays omit it.
 */
export function arrayValue<T extends object>(
  value: T,
  typeInfo?: string | TypeInfo,
): T {
  ;(value as any)[ARRAY_VALUE_TYPE] = typeInfo ?? true
  return value
}

/** isArrayValue reports whether value is marked as a Go array value. */
export function isArrayValue(value: unknown): boolean {
  return (
    typeof value === 'object' && value !== null && ARRAY_VALUE_TYPE in value
  )
}

// arrayValueTypeInfo returns the descriptor a marked array value carries.
export function arrayValueTypeInfo(
  value: object,
): string | TypeInfo | undefined {
  const info = (value as any)[ARRAY_VALUE_TYPE]
  return info === true ? undefined : info
}

/**
 * cloneArrayValue copies array storage and its value-typed elements. Scalar
 * arrays can omit typeInfo; composite arrays require their descriptor unless
 * the value carries it. The copy is marked as an array value.
 */
export function cloneArrayValue<T>(value: T, typeInfo?: string | TypeInfo): T {
  if (isTypedSlice(value)) {
    return arrayValue(value.slice()) as T
  }
  if (!isArrayOrGoSlice(value)) {
    return value
  }

  typeInfo ??= arrayValueTypeInfo(value)
  const info = typeInfo === undefined ? undefined : normalizeTypeInfo(typeInfo)
  const element =
    info?.kind === TypeKind.Array && info.elemType !== undefined ?
      normalizeTypeInfo(info.elemType)
    : undefined
  if (element?.kind === TypeKind.Array) {
    return arrayValue(
      value.map((item) => cloneArrayValue(item, element)),
      typeInfo,
    ) as T
  }
  if (element?.kind === TypeKind.Struct) {
    return arrayValue(
      value.map((item) => markAsStructValue(cloneStructValue(item))),
      typeInfo,
    ) as T
  }
  return arrayValue(value.slice()) as T
}

// isMarkedAsStructValue reports whether value uses Go struct-value semantics.
export function isMarkedAsStructValue(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    structValueMarker in value &&
    value[structValueMarker] === true
  )
}

/**
 * generatedStructClass returns the class of value when it is a struct value
 * of a generated struct class, which copies itself with its clone method,
 * and undefined otherwise.
 */
export function generatedStructClass(value: unknown): object | undefined {
  // Only a struct value with a clone method of its own class qualifies.
  if (!isMarkedAsStructValue(value)) {
    return undefined
  }
  const cloneable = value as {
    __goscriptClone?: unknown
    clone?: unknown
    constructor: object
  }
  if (
    ANONYMOUS_STRUCT_TYPE in (value as object) ||
    typeof cloneable.__goscriptClone === 'function' ||
    typeof cloneable.clone !== 'function'
  ) {
    return undefined
  }
  return cloneable.constructor
}

// StructCopy copies a struct value.
type StructCopy = (value: any) => any

// structCopy keys the function that copies the struct values of a class on
// the class prototype (see structCopyOf).
const structCopy = Symbol('structCopy')

// structCopyOf returns the function that copies the struct values of the
// class of value, by its __goscriptClone or clone method, and records it on
// the class prototype, or null for a value that is not an instance of a
// class with such a method, such as an unnamed struct value.
function structCopyOf(value: object): StructCopy | null {
  // Only a class instance that is not an unnamed struct value has one.
  const proto: Record<PropertyKey, unknown> | null =
    Object.getPrototypeOf(value)
  if (
    proto === null ||
    proto === Object.prototype ||
    Array.isArray(value) ||
    ANONYMOUS_STRUCT_TYPE in value
  ) {
    return null
  }

  // The class copies by its clone method, whose result is a struct value.
  let copy: StructCopy
  if (typeof proto.__goscriptClone === 'function') {
    copy = (source) => markClonedStructValue(source.__goscriptClone())
  } else if (typeof proto.clone === 'function') {
    copy = (source) => markClonedStructValue(source.clone())
  } else {
    return null
  }
  Object.defineProperty(proto, structCopy, { value: copy, configurable: true })
  return copy
}

// markClonedStructValue marks a copy of a struct value as a struct value,
// unless its clone method did.
function markClonedStructValue<T>(copy: T): T {
  // The clone method of a generated class marks its copy already.
  if ((copy as any)[structValueMarker] !== true) {
    markAsStructValue(copy)
  }
  return copy
}

// copyElement clones a marked struct or array value and returns every other
// value unchanged. A marked struct with no clone method is returned unchanged
// rather than panicking.
export function copyElement<T>(value: T): T {
  // A value that is not an object is copied by value.
  if (typeof value !== 'object' || value === null) {
    return value
  }

  // A struct value of a class is copied as its class copies it.
  if ((value as any)[structValueMarker] === true) {
    let copy = (value as any)[structCopy] as StructCopy | null | undefined
    if (copy === undefined) {
      copy = structCopyOf(value)
    }
    if (copy !== null) {
      return copy(value) as T
    }
  }

  // An array value, or a struct value of another kind.
  if (ARRAY_VALUE_TYPE in value) {
    return cloneArrayValue(value, arrayValueTypeInfo(value))
  }
  if (!isMarkedAsStructValue(value)) {
    return value
  }
  const cloneable = value as T & {
    __goscriptClone?: () => T
    clone?: () => T
  }
  if (
    !(ANONYMOUS_STRUCT_TYPE in value) &&
    typeof cloneable.__goscriptClone !== 'function' &&
    typeof cloneable.clone !== 'function'
  ) {
    return value
  }
  return markAsStructValue(cloneStructValue(value))
}

/**
 * Checks if a value matches a pointer type info.
 *
 * @param value The value to check.
 * @param info The pointer type info to match against.
 * @returns True if the value matches the pointer type, false otherwise.
 */
function matchesPointerType(value: any, info: TypeInfo): boolean {
  // Allow null/undefined values to match pointer types to support nil pointer assertions
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value !== 'object' || value === null) {
    return false
  }

  if (!isPointerTypeInfo(info)) return false

  if (typeof value.__goType === 'string') {
    return compareTypeStringWithTypeInfo(value.__goType, info)
  }

  if (!info.elemType) return false

  let elem = info.elemType
  let elemName: string
  if (typeof elem === 'string') {
    elemName = elem
  } else if (elem.name) {
    elemName = elem.name
  } else {
    return false
  }

  // Check if this is a registered struct type
  const registered = typeRegistry.get(elemName)
  if (registered && registered.kind === TypeKind.Struct && registered.ctor) {
    // For struct types, check if the value is marked as a pointer or is a VarRef
    if ('value' in value) {
      // VarRef case - check the inner value
      let elemTypeInfo = normalizeTypeInfo(elem)
      return matchesType(value.value, elemTypeInfo)
    }

    // Direct struct instance - with inversion, only match if NOT marked as value (i.e., is a pointer)
    return value instanceof registered.ctor && !isMarkedAsStructValue(value)
  } else {
    // For non-struct types, only VarRef objects should match
    if (!('value' in value)) {
      return false
    }
    let elemTypeInfo = normalizeTypeInfo(elem)
    return matchesType(value.value, elemTypeInfo)
  }
}

/**
 * Checks if a value matches a function type info.
 *
 * @param value The value to check.
 * @param info The function type info to match against.
 * @returns True if the value matches the function type, false otherwise.
 */
function matchesFunctionType(value: any, info: FunctionTypeInfo): boolean {
  if (typeof value !== 'function') {
    return false
  }
  const valueInfo = functionValueTypeInfo(value)
  if (!valueInfo) {
    return false
  }
  return areTypeInfosIdentical(valueInfo, info)
}

function functionValueTypeInfo(value: any): FunctionTypeInfo | null {
  const typeInfo = value.__typeInfo
  if (!typeInfo || typeInfo.kind !== TypeKind.Function) {
    return null
  }
  const goTypeName =
    typeof value.__goTypeName === 'string' ? value.__goTypeName : undefined
  if (goTypeName && typeInfo.name && goTypeName !== typeInfo.name) {
    return null
  }
  if (goTypeName && !typeInfo.name) {
    return { ...typeInfo, name: goTypeName }
  }
  return typeInfo
}

/**
 * Checks if a value matches a channel type info.
 *
 * @param value The value to check.
 * @param info The channel type info to match against.
 * @returns True if the value matches the channel type, false otherwise.
 */
function matchesChannelType(value: any, info: ChannelTypeInfo): boolean {
  // First check if it's a channel or channel reference
  if (typeof value !== 'object' || value === null) {
    return false
  }

  // If it's a ChannelRef, get the underlying channel
  let channel = value
  let valueDirection = 'both'

  if ('channel' in value && 'direction' in value) {
    channel = value.channel
    valueDirection = value.direction
  }

  // Check if it has channel methods
  if (
    !('send' in channel) ||
    !('receive' in channel) ||
    !('close' in channel) ||
    typeof channel.send !== 'function' ||
    typeof channel.receive !== 'function' ||
    typeof channel.close !== 'function'
  ) {
    return false
  }

  if (info.elemType) {
    if (
      info.elemType === 'string' &&
      'zeroValue' in channel &&
      channel.zeroValue !== ''
    ) {
      return false
    }

    if (
      info.elemType === 'number' &&
      'zeroValue' in channel &&
      typeof channel.zeroValue !== 'number'
    ) {
      return false
    }
  }

  if (info.direction) {
    return valueDirection === info.direction
  }

  return true
}

/**
 * Checks if a value matches a type info.
 *
 * @param value The value to check.
 * @param info The type info to match against.
 * @returns True if the value matches the type info, false otherwise.
 */
function matchesType(value: any, info: TypeInfo): boolean {
  if (value === null || value === undefined) {
    return false
  }
  if (
    typeof value === 'object' &&
    typeof value.__goType === 'string' &&
    goTypeMatchesTypeInfo(value.__goType, info)
  ) {
    return true
  }

  switch (info.kind) {
    case TypeKind.Basic:
      return matchesBasicType(value, info)

    case TypeKind.Struct:
      return matchesStructType(value, info)

    case TypeKind.Interface:
      return matchesInterfaceType(value, info)

    case TypeKind.Map:
      return matchesMapType(value, info)

    case TypeKind.Slice:
    case TypeKind.Array:
      return matchesArrayOrSliceType(value, info)

    case TypeKind.Pointer:
      return matchesPointerType(value, info)

    case TypeKind.Function:
      return matchesFunctionType(value, info as FunctionTypeInfo)

    case TypeKind.Channel:
      return matchesChannelType(value, info)

    default:
      console.warn(
        `Type matching for kind '${(info as TypeInfo).kind}' not implemented.`,
      )
      return false
  }
}

/**
 * Compares a Go type string (from typedNil) with a TypeInfo object.
 * Used to check if a typed nil pointer matches a type assertion target.
 *
 * @param typeStr The Go type string (e.g., "*struct{Name string}")
 * @param typeInfo The normalized TypeInfo to compare against
 * @returns True if the types match, false otherwise
 */
function compareTypeStringWithTypeInfo(
  typeStr: string,
  typeInfo: string | TypeInfo,
): boolean {
  const normalized = normalizeTypeInfo(typeInfo)
  const runtimeName = typeInfoRuntimeName(normalized)
  if (runtimeName !== undefined && typeStr === runtimeName) {
    return true
  }

  // For pointer types, strip the leading * and compare element types
  if (isPointerTypeInfo(normalized)) {
    if (!typeStr.startsWith('*')) {
      return false
    }
    const elemStr = typeStr.slice(1)
    const elemType = normalized.elemType
    if (!elemType) {
      return false
    }

    // Handle struct types
    if (elemStr.startsWith('struct{')) {
      const elemTypeInfo = normalizeTypeInfo(elemType)
      if (!isStructTypeInfo(elemTypeInfo)) {
        return false
      }

      // For anonymous structs, compare the type string representation
      // Extract field definitions from the string
      const fieldsMatch = elemStr.match(/^struct{(.+)}$/)
      if (!fieldsMatch) {
        return false
      }

      const fieldStr = fieldsMatch[1]
      // Parse fields like "Name string" or "X int; Y string"
      const fieldParts = fieldStr.split(';').map((s) => s.trim())
      const parsedFields: Record<string, string> = {}

      for (const part of fieldParts) {
        // Handle "Name string" format
        const match = part.match(/^(\w+)\s+(.+)$/)
        if (match) {
          const [, fieldName, fieldType] = match
          parsedFields[fieldName] = fieldType.trim()
        }
      }

      // Compare fields
      const typeInfoFields = elemTypeInfo.fields || []
      const typeInfoFieldNames = typeInfoFields.map((field) => field.name)
      const parsedFieldNames = Object.keys(parsedFields)

      if (typeInfoFieldNames.length !== parsedFieldNames.length) {
        return false
      }

      // Check if all field names match and types are compatible
      for (const field of typeInfoFields) {
        const fieldName = field.name
        if (!(fieldName in parsedFields)) {
          return false
        }

        const typeInfoFieldType = normalizeTypeInfo(field.type)
        const parsedFieldType = parsedFields[fieldName]

        // Compare basic types
        if (isBasicTypeInfo(typeInfoFieldType)) {
          const expectedTypeName = typeInfoFieldType.name || ''
          // Map Go types to TypeScript/runtime types
          if (expectedTypeName === 'string' && parsedFieldType === 'string') {
            continue
          }
          if (
            (expectedTypeName === 'int' || expectedTypeName === 'number') &&
            (parsedFieldType === 'int' || parsedFieldType === 'number')
          ) {
            continue
          }
          return false
        }
      }

      return true
    }

    // Handle named types
    if (typeof elemType === 'string') {
      return elemStr === elemType
    }
    return compareTypeStringWithTypeInfo(elemStr, elemType)
  }

  if (isSliceTypeInfo(normalized)) {
    if (!typeStr.startsWith('[]') || !normalized.elemType) {
      return false
    }
    return compareTypeStringWithTypeInfo(typeStr.slice(2), normalized.elemType)
  }

  if (isArrayTypeInfo(normalized)) {
    const match = typeStr.match(/^\[(\d+)\](.+)$/)
    if (!match || !normalized.elemType) {
      return false
    }
    return (
      Number(match[1]) === normalized.length &&
      compareTypeStringWithTypeInfo(match[2], normalized.elemType)
    )
  }

  if (isBasicTypeInfo(normalized)) {
    const name = typeInfoRuntimeName(normalized)
    if (name === undefined) {
      return false
    }
    if (typeStr === name) {
      return true
    }
    if (name === 'uint8' && typeStr === 'byte') {
      return true
    }
    if (name === 'int32' && typeStr === 'rune') {
      return true
    }
    return (
      name === 'int' &&
      [
        'byte',
        'rune',
        'int8',
        'int16',
        'int32',
        'int64',
        'uint',
        'uint8',
        'uint16',
        'uint32',
        'uint64',
        'uintptr',
      ].includes(typeStr)
    )
  }

  return false
}

/**
 * typeAssert Performs a type assertion on a value against a specified type.
 * Returns an object containing the value (cast to type T) and a boolean indicating success.
 * This is used to implement Go's type assertion with comma-ok idiom: value, ok := x.(Type).
 *
 * @param value The value to check against the type
 * @param typeInfo The type information to check against (can be a string name or TypeInfo object)
 * @returns An object with the asserted value and a boolean indicating if the assertion succeeded
 */
export function typeAssert<T>(
  value: any,
  typeInfo: string | TypeInfo,
): TypeAssertResult<T> {
  // A value boxed with its dynamic type, asserted to a type named by a
  // string, gets the result that its type got before. (Type info objects of
  // other assertions are made for each call.)
  if (
    typeof value === 'object' &&
    value !== null &&
    value.__goTypeInfo !== undefined &&
    typeof value.__goType === 'string' &&
    value.__isTypedNil !== true
  ) {
    if (typeof typeInfo === 'string') {
      return typeAssertBoxed<T>(value, typeInfo)
    }

    // A pointer to a named type, as in a type switch on pointer types, is
    // the dynamic type exactly when its name is the dynamic type's name.
    if (
      typeInfo.kind === TypeKind.Pointer &&
      typeof typeInfo.elemType === 'string'
    ) {
      return typeAssertNamedPointer<T>(value, typeInfo.elemType)
    }
  }
  return typeAssertUncached<T>(value, typeInfo)
}

// typeAssertNamedPointer asserts a value that carries its dynamic type to
// the pointer type to the named type elemName.
function typeAssertNamedPointer<T>(
  value: any,
  elemName: string,
): TypeAssertResult<T> {
  // The dynamic type name is "*" followed by the named type's name.
  const name: string = value.__goType
  if (
    name.length !== elemName.length + 1 ||
    name.charCodeAt(0) !== 42 ||
    !name.endsWith(elemName)
  ) {
    return { value: null as T, ok: false }
  }
  return {
    value: ('__goValue' in value ? value.__goValue : value) as T,
    ok: true,
  }
}

// TypeAssertOutcome is how an assertion of a boxed value turns out: it
// fails, or it succeeds with the box itself or with the value in the box.
type TypeAssertOutcome = 0 | 1 | 2
const typeAssertFail: TypeAssertOutcome = 0
const typeAssertBox: TypeAssertOutcome = 1
const typeAssertContent: TypeAssertOutcome = 2

// TypeAssertCacheEntry records the outcome of asserting a box of a dynamic
// type, identified by its type name, type info and prototype, which hold
// its methods.
interface TypeAssertCacheEntry {
  typeInfo: TypeInfo | string
  proto: object | null
  assertedType: TypeInfo
  outcome: TypeAssertOutcome
}

// typeAssertCache maps the name of an asserted type to the outcomes for
// dynamic types, keyed by their type names. An outcome holds while the name
// is registered as the same type.
const typeAssertCache = new Map<string, Map<string, TypeAssertCacheEntry>>()

// typeAssertBoxed asserts a value that carries its dynamic type, which alone
// decides the outcome, except for map types, whose check samples entries.
function typeAssertBoxed<T>(value: any, typeInfo: string): TypeAssertResult<T> {
  // A cached outcome for the same dynamic type gives the result.
  const key = value.__goType as string
  const proto = Object.getPrototypeOf(value)
  let table = typeAssertCache.get(typeInfo)
  const entry = table?.get(key)
  if (
    entry !== undefined &&
    sameBoxTypeInfo(entry.typeInfo, value.__goTypeInfo) &&
    entry.proto === proto &&
    entry.assertedType === typeRegistry.get(typeInfo)
  ) {
    return typeAssertOutcomeResult<T>(entry.outcome, value, typeInfo)
  }

  // Otherwise the full assertion runs.
  const result = typeAssertUncached<T>(value, typeInfo)
  const assertedType = typeRegistry.get(typeInfo)
  if (assertedType === undefined || isMapTypeInfo(assertedType)) {
    return result
  }

  // Its outcome is recorded, unless the value came from elsewhere.
  let outcome = typeAssertFail
  if (result.ok) {
    outcome = result.value === value ? typeAssertBox : typeAssertContent
  }
  if (outcome !== typeAssertContent || result.value === value.__goValue) {
    if (table === undefined) {
      table = new Map()
      typeAssertCache.set(typeInfo, table)
    }
    table.set(key, {
      typeInfo: value.__goTypeInfo,
      proto,
      assertedType,
      outcome,
    })
  }
  return result
}

// TypeSwitchSite is the hoisted site of a type switch whose clauses each
// list one type: the case types in order, null for nil, and the case index
// that boxes of each dynamic type took, while no type is registered.
export interface TypeSwitchSite {
  cases: (string | TypeInfo | null)[]
  outcomes: Map<string, TypeSwitchOutcome>
  generation: number
}

// TypeSwitchOutcome is the case a box of a dynamic type, identified by its
// type name, type info and prototype, took at a type switch site.
interface TypeSwitchOutcome {
  typeInfo: TypeInfo | string
  proto: object | null
  index: number
}

/** typeSwitchSite makes the site of a type switch with the given case types. */
export function typeSwitchSite(
  cases: (string | TypeInfo | null)[],
): TypeSwitchSite {
  return { cases, outcomes: new Map(), generation: typeRegistryGeneration }
}

// typeSwitchCase returns the index of the first case of a type switch site
// that value matches, or -1 for none, asserting value to each case type as
// the clause would. The outcome for a box is remembered by its dynamic type,
// which alone decides each assertion of a box (see typeAssertBoxed), until
// another type is registered.
export function typeSwitchCase(value: any, site: TypeSwitchSite): number {
  // A box of a dynamic type seen before takes the case that type took.
  const boxed =
    typeof value === 'object' &&
    value !== null &&
    value.__goTypeInfo !== undefined &&
    typeof value.__goType === 'string' &&
    value.__isTypedNil !== true
  if (boxed) {
    if (site.generation !== typeRegistryGeneration) {
      site.outcomes.clear()
      site.generation = typeRegistryGeneration
    }
    const outcome = site.outcomes.get(value.__goType)
    if (
      outcome !== undefined &&
      outcome.proto === Object.getPrototypeOf(value) &&
      sameBoxTypeInfo(outcome.typeInfo, value.__goTypeInfo)
    ) {
      return outcome.index
    }
  }

  // Otherwise the cases are asserted in order, and the outcome of a box
  // recorded.
  const index = typeSwitchCaseUncached(value, site.cases)
  if (boxed) {
    site.outcomes.set(value.__goType, {
      typeInfo: value.__goTypeInfo,
      proto: Object.getPrototypeOf(value),
      index,
    })
  }
  return index
}

// typeSwitchCaseUncached returns the index of the first of cases that value
// matches, or -1 for none: nil matches only a nil interface.
function typeSwitchCaseUncached(
  value: any,
  cases: (string | TypeInfo | null)[],
): number {
  for (let i = 0; i < cases.length; i++) {
    const typeInfo = cases[i]
    if (typeInfo === null ? value == null : typeAssert(value, typeInfo).ok) {
      return i
    }
  }
  return -1
}

// sameBoxTypeInfo reports whether the type infos of two boxes of the same
// type name are the same: the same string or object, or pointer descriptors
// to the same named type, which boxing makes for each pointer.
function sameBoxTypeInfo(a: TypeInfo | string, b: TypeInfo | string): boolean {
  if (a === b) {
    return true
  }
  return (
    typeof a === 'object' &&
    typeof b === 'object' &&
    a.kind === TypeKind.Pointer &&
    b.kind === TypeKind.Pointer &&
    typeof a.elemType === 'string' &&
    a.elemType === b.elemType
  )
}

// typeAssertOutcomeResult returns the result of an assertion of value with
// a known outcome.
function typeAssertOutcomeResult<T>(
  outcome: TypeAssertOutcome,
  value: any,
  typeInfo: string,
): TypeAssertResult<T> {
  switch (outcome) {
    case typeAssertBox:
      return { value: value as T, ok: true }
    case typeAssertContent:
      return { value: value.__goValue as T, ok: true }
  }
  return failedTypeAssert<T>(typeInfo, normalizeTypeInfo(typeInfo))
}

// typeAssertUncached performs a type assertion by the types of value and
// typeInfo.
function typeAssertUncached<T>(
  value: any,
  typeInfo: string | TypeInfo,
): TypeAssertResult<T> {
  const normalizedType = normalizeTypeInfo(typeInfo)

  if (isTypedNilValue(value)) {
    if (
      isInterfaceTypeInfo(normalizedType) &&
      matchesInterfaceType(value, normalizedType)
    ) {
      return { value: value as T, ok: true }
    }

    const storedTypeInfo = value.__goTypeInfo as TypeInfo | string | undefined
    if (storedTypeInfo !== undefined) {
      return {
        value: null as T,
        ok:
          (typeof typeInfo === 'string' && value.__goType === typeInfo) ||
          areTypeInfosIdentical(storedTypeInfo, normalizedType),
      }
    }

    // Go permits asserting a typed-nil interface value to its identical
    // concrete type; the assertion succeeds and yields that type's nil.
    const storedTypeStr = value.__goType as string
    if (compareTypeStringWithTypeInfo(storedTypeStr, normalizedType)) {
      return { value: null as T, ok: true }
    }
    return { value: null as T, ok: false }
  }

  if (isPointerTypeInfo(normalizedType) && value === null) {
    return { value: null as T, ok: false }
  }
  // A boxed concrete value carries its exact dynamic Go type. Its contents
  // cannot establish identity, especially for pointers to nil named slices.
  if (
    typeof value === 'object' &&
    value !== null &&
    value.__goTypeInfo !== undefined &&
    !isInterfaceTypeInfo(normalizedType)
  ) {
    const ok =
      (typeof typeInfo === 'string' && value.__goType === typeInfo) ||
      areTypeInfosIdentical(value.__goTypeInfo, normalizedType)
    if (!ok) {
      return failedTypeAssert<T>(typeInfo, normalizedType)
    }
    return {
      value: ('__goValue' in value ? value.__goValue : value) as T,
      ok: true,
    }
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    typeof value.__goType === 'string' &&
    goTypeMatchesTypeInfo(value.__goType, normalizedType)
  ) {
    if ('__goValue' in value) {
      return { value: value.__goValue as T, ok: true }
    }
    return { value: value as T, ok: true }
  }

  // Check a sample of map entries against the key and element types.
  if (
    isMapTypeInfo(normalizedType) &&
    typeof value === 'object' &&
    value !== null &&
    // A Go slice/array is never a map; see matchesMapType above.
    !isArrayOrGoSlice(value) &&
    !(value instanceof Uint8Array)
  ) {
    if (normalizedType.keyType || normalizedType.elemType) {
      const entries =
        value instanceof Map ?
          Array.from(value.entries())
        : Object.entries(value)

      if (entries.length === 0) {
        return { value: value as T, ok: true }
      }

      const sampleSize = Math.min(5, entries.length)
      for (let i = 0; i < sampleSize; i++) {
        const [k, v] = entries[i]

        if (normalizedType.keyType) {
          if (
            !validateMapKey(
              k,
              normalizeTypeInfo(normalizedType.keyType as string | TypeInfo),
            )
          ) {
            return { value: null as T, ok: false }
          }
        }

        if (normalizedType.elemType) {
          const elemTypeInfo = normalizeTypeInfo(
            normalizedType.elemType as string | TypeInfo,
          )
          if (!matchesType(v, elemTypeInfo)) {
            return { value: null as T, ok: false }
          }
        }
      }

      // If we get here, the map type assertion passes
      return { value: value as T, ok: true }
    }
  }

  // Match the value against the type, then against registered duplicates of
  // a named type.
  if (isRawValueOfNamedBasicType(value, normalizedType)) {
    return failedTypeAssert<T>(typeInfo, normalizedType)
  }
  if (matchesType(value, normalizedType)) {
    return { value: value as T, ok: true }
  }
  if (typeof typeInfo === 'string') {
    for (const candidate of duplicateTypeRegistry.get(typeInfo) ?? []) {
      if (candidate !== normalizedType && matchesType(value, candidate)) {
        return { value: value as T, ok: true }
      }
    }
  }

  return failedTypeAssert<T>(typeInfo, normalizedType)
}

// failedTypeAssert returns the result of a failed type assertion, which has
// the zero value of a registered type, as in Go.
function failedTypeAssert<T>(
  typeInfo: string | TypeInfo,
  normalizedType: TypeInfo,
): TypeAssertResult<T> {
  if (typeof typeInfo === 'string') {
    const registeredType = typeRegistry.get(typeInfo)
    if (registeredType && registeredType.zeroValue !== undefined) {
      return { value: resolveZeroValue<T>(registeredType.zeroValue), ok: false }
    }
  } else if (normalizedType.zeroValue !== undefined) {
    return { value: resolveZeroValue<T>(normalizedType.zeroValue), ok: false }
  }
  return { value: null as T, ok: false }
}

export function typeAssertTuple<T>(
  value: any,
  typeInfo: string | TypeInfo,
): [T, boolean] {
  const { value: assertedValue, ok } = typeAssert<T>(value, typeInfo)
  return [assertedValue, ok]
}

/**
 * mustTypeAssert Performs a type assertion on a value against a specified type.
 * Returns the value (cast to type T) if the assertion is successful,
 * otherwise throws a runtime error.
 * This is used to implement Go's single-value type assertion: value := x.(Type).
 *
 * @param value The value to check against the type
 * @param typeInfo The type information to check against (can be a string name or TypeInfo object)
 * @returns The asserted value if the assertion succeeded
 * @throws Error if the type assertion fails
 */
export function mustTypeAssert<T>(value: any, typeInfo: string | TypeInfo): T {
  const { value: assertedValue, ok } = typeAssert<T>(value, typeInfo)
  if (!ok) {
    const targetTypeName =
      typeof typeInfo === 'string' ? typeInfo : (
        typeInfo.name || JSON.stringify(typeInfo)
      )
    let valueTypeName: string | 'nil' = typeof value
    if (value && value.constructor && value.constructor.name) {
      valueTypeName = value.constructor.name
    }
    if (value === null) {
      valueTypeName = 'nil'
    }
    throw new Error(
      `inline type conversion panic: value is ${valueTypeName}, not ${targetTypeName}`,
    )
  }
  return assertedValue
}

/**
 * is Checks if a value is of a specific type.
 * Similar to typeAssert but only returns a boolean without extracting the value.
 *
 * @param value The value to check
 * @param typeInfo The type information to check against
 * @returns True if the value matches the type, false otherwise
 */
export function is(value: any, typeInfo: string | TypeInfo): boolean {
  const normalizedType = normalizeTypeInfo(typeInfo)
  if (isRawValueOfNamedBasicType(value, normalizedType)) {
    return false
  }
  return matchesType(value, normalizedType)
}

// isRawValueOfNamedBasicType reports whether value is a raw primitive and
// info a named basic type, which never match as the dynamic type of an
// interface: an interface holds a value of a named basic type in a box (see
// namedValueInterfaceValue), so a raw primitive has an unnamed basic type.
function isRawValueOfNamedBasicType(value: unknown, info: TypeInfo): boolean {
  return (
    info.kind === TypeKind.Basic && !!info.typeName && isPrimitiveValue(value)
  )
}

// isPrimitiveValue reports whether value is a raw number, string, boolean, or
// bigint, the representations of basic Go types.
function isPrimitiveValue(value: unknown): boolean {
  const kind = typeof value
  return (
    kind === 'number' ||
    kind === 'string' ||
    kind === 'boolean' ||
    kind === 'bigint'
  )
}

/**
 * TypeSwitchCase Represents a case in a type switch statement.
 * Each case matches against one or more types and contains a body function to execute when matched.
 */
export interface TypeSwitchCase {
  types: (string | TypeInfo)[] // Array of types for this case (e.g., case int, string:)
  body: (value?: any) => any // Function representing the case body. 'value' is the asserted value if applicable.
}

/**
 * typeSwitch Helper for Go's type switch statement.
 * Executes the body of the first case whose type matches the value.
 *
 * @param value The value being switched upon.
 * @param cases An array of TypeSwitchCase objects.
 * @param defaultCase Optional function for the default case.
 */
export function typeSwitch(
  value: any,
  cases: TypeSwitchCase[],
  defaultCase?: () => any,
): any {
  for (const caseObj of cases) {
    // For cases with multiple types (case T1, T2:), use $.is
    if (caseObj.types.length > 1) {
      const matchesAny = caseObj.types.some((typeInfo) => is(value, typeInfo))
      if (matchesAny) {
        // For multi-type cases, the case variable (if any) gets the original value
        return caseObj.body(value)
      }
    } else if (caseObj.types.length === 1) {
      // For single-type cases (case T:), use $.typeAssert to get the typed value and ok status
      const typeInfo = caseObj.types[0]
      const { value: assertedValue, ok } = typeAssert(value, typeInfo)
      if (ok) {
        // Pass the asserted value to the case body function
        return caseObj.body(assertedValue)
      }
    }
    // Note: Cases with 0 types are not valid in Go type switches
  }

  // If no case matched and a default case exists, execute it
  if (defaultCase) {
    return defaultCase()
  }
}

/** TypedNilValue carries a nilable Go value's dynamic type metadata. */
export type TypedNilValue = {
  __goType: string
  __isTypedNil: true
  __goTypeInfo?: TypeInfo | string
} & Record<string, unknown>

/** isTypedNilValue reports whether a value carries the typed-nil marker. */
export function isTypedNilValue(value: unknown): value is TypedNilValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    '__isTypedNil' in value &&
    value.__isTypedNil === true &&
    '__goType' in value &&
    typeof value.__goType === 'string'
  )
}

/**
 * typedNil creates a typed nil value for interface and reflection operations.
 *
 * @param typeName The full Go type name.
 * @param typeInfo The structured dynamic type descriptor, when available.
 * @returns A typed nil marker that preserves dynamic type identity.
 */
export function typedNil(
  typeName: string,
  typeInfo?: TypeInfo | string,
): TypedNilValue {
  // A null prototype keeps Go method names separate from JavaScript built-ins.
  const value = Object.create(null) as TypedNilValue
  value.__goType = typeName
  value.__isTypedNil = true
  if (typeInfo !== undefined) {
    Object.defineProperty(value, '__goTypeInfo', {
      value: typeInfo,
      writable: true,
      configurable: true,
    })
  }
  return value
}

/**
 * typeInfoGoString returns the Go type string of info, such as *main.T or
 * []main.T, or undefined for a type it cannot spell, such as an unnamed
 * struct, interface or function type.
 */
export function typeInfoGoString(
  info: string | TypeInfo | undefined,
): string | undefined {
  // A registered type is spelled by its name, as is a named type.
  if (info === undefined || typeof info === 'string') {
    return info
  }
  const name = info.typeName || info.name
  if (name) {
    return name
  }

  // Composite types spell their element types.
  switch (info.kind) {
    case TypeKind.Pointer:
      return prefixTypeString('*', info.elemType)
    case TypeKind.Slice:
      return prefixTypeString('[]', info.elemType)
    case TypeKind.Array:
      return prefixTypeString(`[${info.length}]`, info.elemType)
    case TypeKind.Channel:
      return prefixTypeString('chan ', info.elemType)
    case TypeKind.Map: {
      const key = typeInfoGoString(info.keyType)
      return key === undefined ? undefined : (
          prefixTypeString(`map[${key}]`, info.elemType)
        )
    }
  }
  return undefined
}

// dynamicTypeName returns the Go type string of info as the dynamic type of
// a value, or undefined when info is an interface type, whose values have
// dynamic types of their own, or cannot be spelled.
function dynamicTypeName(
  info: string | TypeInfo | undefined,
): string | undefined {
  const resolved = info === undefined ? undefined : resolveTypeInfo(info)
  if (resolved === undefined || resolved.kind === TypeKind.Interface) {
    return undefined
  }
  return typeInfoGoString(info)
}

// prefixTypeString returns the Go type string of elem after prefix, or
// undefined if elem cannot be spelled.
function prefixTypeString(
  prefix: string,
  elem: string | TypeInfo | undefined,
): string | undefined {
  const text = typeInfoGoString(elem)
  return text === undefined ? undefined : prefix + text
}

/**
 * genericInterfaceValue converts a value whose static type contains type
 * parameters to an interface, naming its dynamic type by the instantiated
 * type info, which the compiler resolves from the type arguments at run
 * time, rather than by the static type name, which names the type
 * parameters.
 */
export function genericInterfaceValue<T = any>(
  value: unknown,
  staticName: string,
  typeInfo?: TypeInfo | string,
): T {
  return interfaceValue<T>(
    value,
    dynamicTypeName(typeInfo) ?? staticName,
    typeInfo,
  )
}

// structBoxClass keys, on the prototype of a struct class, the class of the
// boxes of its values (see structValueBox), or null if it has none.
const structBoxClass = Symbol('structBoxClass')

// StructBoxClass constructs the zero box of a struct class.
type StructBoxClass = new () => { __goscriptAssign(source: object): object }

// structValueBox returns a copy of a struct value, an instance of the class
// of value, made as the box of the value in an interface with the dynamic
// type typeName: an instance of a subclass whose prototype holds the type
// name and info that interfaceValue would define on the value, which it
// does much faster. Go copies a value into an interface, so the box need
// not be the value itself. It returns undefined for a value that is not of
// the struct class registered as typeName, or of a class that has nested
// struct or array fields, which the zero box would allocate, or no
// __goscriptAssign method to copy the fields.
function structValueBox(value: object, typeName: string): object | undefined {
  // The box class of the value's class is made once.
  const proto = Object.getPrototypeOf(value) as Record<PropertyKey, unknown>
  let boxClass =
    Object.prototype.hasOwnProperty.call(proto, structBoxClass) ?
      (proto[structBoxClass] as StructBoxClass | null)
    : undefined
  if (boxClass === undefined) {
    boxClass = makeStructBoxClass(proto)
    Object.defineProperty(proto, structBoxClass, {
      value: boxClass,
      configurable: true,
    })
  }

  // The box is a zero box of the class, marked as a value and assigned the
  // fields of value.
  if (boxClass === null || (boxClass as any).prototype.__goType !== typeName) {
    return undefined
  }
  const box = new boxClass()
  ;(box as any)[structValueMarker] = true
  box.__goscriptAssign(value)
  return box
}

// makeStructBoxClass returns the box class of the struct class with the
// given prototype (see structValueBox), or null if it can have none.
function makeStructBoxClass(
  proto: Record<PropertyKey, unknown>,
): StructBoxClass | null {
  // The class is a registered struct class, whose fields are neither
  // structs nor arrays, with a method to assign its fields.
  const ctor = proto.constructor as
    | (StructBoxClass & { __typeInfo?: TypeInfo | string })
    | undefined
  const info = resolveTypeInfo(ctor?.__typeInfo)
  if (
    ctor === undefined ||
    ctor.prototype !== proto ||
    info === undefined ||
    !isStructTypeInfo(info) ||
    info.name === undefined ||
    typeof proto.__goscriptAssign !== 'function' ||
    !info.fields.every((field) => isFlatStructFieldType(field.type))
  ) {
    return null
  }

  // The box class is a subclass that reports the class as its constructor
  // and holds the type of its boxes.
  const boxClass = class extends ctor {}
  for (const [key, value] of [
    ['constructor', ctor],
    ['__goType', info.name],
    ['__goTypeInfo', info.name],
  ] as const) {
    Object.defineProperty(boxClass.prototype, key, {
      value,
      writable: true,
      configurable: true,
    })
  }
  return boxClass
}

// isFlatStructFieldType reports whether a field of the given type is set by
// assignment alone: it is of a known kind other than a struct or an array.
function isFlatStructFieldType(type: TypeInfo | string): boolean {
  const kind = resolveTypeInfo(type)?.kind
  return (
    kind !== undefined && kind !== TypeKind.Struct && kind !== TypeKind.Array
  )
}

/**
 * structInterfaceValue converts a struct value that the compiler has copied
 * to an interface, as interfaceValue does, except that a value of a class
 * with a box class (see structValueBox), boxed as the type the class is
 * registered as, is copied into a box instead of having its type defined on
 * it.
 */
export function structInterfaceValue<T = any>(
  value: unknown,
  typeName: string,
  typeInfo?: TypeInfo | string,
): T {
  // Only a struct value boxed as its own registered type takes a box.
  if (
    typeInfo === typeName &&
    typeof value === 'object' &&
    value !== null &&
    (value as any)[structValueMarker] === true &&
    (value as any).__goType !== typeName
  ) {
    const box = structValueBox(value, typeName)
    if (box !== undefined) {
      return box as T
    }
  }
  return interfaceValue<T>(value, typeName, typeInfo)
}

export function interfaceValue<T = any>(
  value: unknown,
  typeName: string,
  typeInfo?: TypeInfo | string,
): T {
  if (value !== null && value !== undefined) {
    if (typeof value === 'function' && typeof typeInfo === 'object') {
      if (typeInfo.kind === TypeKind.Function) {
        return typedFunction(value as GoFunction, typeName, typeInfo) as T
      }
    }
    // A value already boxed as this type keeps its type info, which describes
    // the same type, so that boxing it again does not redefine its properties.
    if (
      typeof value === 'object' &&
      ((value as any).__goType !== typeName ||
        (typeInfo !== undefined && (value as any).__goTypeInfo === undefined))
    ) {
      Object.defineProperty(value, '__goType', {
        value: typeName,
        writable: true,
        configurable: true,
      })
      if (typeInfo !== undefined) {
        Object.defineProperty(value, '__goTypeInfo', {
          value: typeInfo,
          writable: true,
          configurable: true,
        })
      }
    }
    return value as T
  }

  const nilValue = typedNil(typeName, typeInfo)
  if (!typeName.startsWith('*')) {
    return nilValue as T
  }

  const dynamicType = typeRegistry.get(typeName.slice(1))
  if (!dynamicType || !isStructTypeInfo(dynamicType) || !dynamicType.ctor) {
    return nilValue as T
  }

  const prototype = dynamicType.ctor.prototype as Record<string, unknown>
  for (const method of dynamicType.methods) {
    const implementation = prototype[method.name]
    if (typeof implementation !== 'function') {
      continue
    }
    const wrapper: InterfaceMethod = (...args: unknown[]) =>
      implementation.call(null, ...args)
    wrapper.__goscriptMethodSignature = method
    Object.defineProperty(nilValue, method.name, {
      value: wrapper,
      enumerable: true,
    })
  }
  return nilValue as T
}

type InterfaceMethod = ((...args: unknown[]) => unknown) & {
  __goscriptMethodWrapper?: boolean
  __goscriptMethodSignature?: MethodSignature
}

function isInterfaceMethod(value: unknown): value is InterfaceMethod {
  return typeof value === 'function'
}

export function callInterfaceMethod(
  receiver: unknown,
  methodName: string,
  genericArgs: GenericTypeArgs | undefined,
  ...args: unknown[]
): any {
  if (
    receiver === null ||
    receiver === undefined ||
    (typeof receiver !== 'object' && typeof receiver !== 'function')
  ) {
    runtimePanic(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  }
  const methodValue = (receiver as Record<string, unknown>)[methodName]
  if (!isInterfaceMethod(methodValue)) {
    runtimePanic(`interface method ${methodName} is not callable`)
  }
  if (methodValue.__goscriptMethodWrapper === true) {
    return methodValue.call(receiver, genericArgs, ...args)
  }
  return methodValue.call(receiver, ...args)
}

export function basicInterfaceValue<T = any>(
  value: unknown,
  typeName: string,
  valueTypeName = typeName,
): T {
  // The type information of a basic type is made once.
  let typeInfo = basicBoxTypeInfos.get(valueTypeName)
  if (typeInfo === undefined) {
    typeInfo = { kind: TypeKind.Basic, name: valueTypeName }
    basicBoxTypeInfos.set(valueTypeName, typeInfo)
  }

  // The box has no methods, so its prototype is shared by all basic boxes.
  const box = Object.create(basicBoxPrototype)
  box.__goType = typeName
  box.__goValue = value
  box.__goTypeInfo = typeInfo
  return box as T
}

// basicBoxTypeInfos holds the type information of the boxes of basic values,
// such as numbers converted to an interface, by the name of their basic type.
const basicBoxTypeInfos = new Map<string, TypeInfo>()

// NamedValueMethods holds the method implementations and signatures of a
// named non-struct type, or a pointer to one, for boxing its values.
export interface NamedValueMethods {
  methods: Record<string, (receiver: any, ...args: any[]) => any>
  signatures: MethodSignature[]
}

const namedValueMethodRegistry = new Map<string, NamedValueMethods>()

/**
 * registerNamedValueType registers the method set of a named non-struct type
 * (or a pointer to one) under its Go type string, so that a value of the type
 * created at run time, as by reflect, can be boxed with its methods.
 */
export function registerNamedValueType(
  typeName: string,
  methods: NamedValueMethods['methods'],
  signatures: MethodSignature[],
): void {
  namedValueMethodRegistry.set(typeName, { methods, signatures })
}

/**
 * namedValueMethods returns the registered method set of the named
 * non-struct type (or pointer to one) with the given Go type string.
 */
export function namedValueMethods(
  typeName: string,
): NamedValueMethods | undefined {
  return namedValueMethodRegistry.get(typeName)
}

// genericInstanceKey is the property of an instance of a generic struct type
// that describes the methods of its instantiated type. The methods of a
// generic type take its type arguments, which compiled calls pass, but which
// reflect, calling the methods of a value it was given, cannot know.
export const genericInstanceKey = Symbol('genericInstance')

// GenericInstanceMethods returns the method table of a pointer to an
// instantiated generic struct type, as namedValueInterfaceValue takes it, and
// the signatures of its methods, marking those only in the pointer's method
// set. A table that does not depend on type parameters is created once.
export type GenericInstanceMethods = () => [
  Record<string, (receiver: any, ...args: any[]) => any>,
  MethodSignature[],
]

// genericInstance marks value, a new instance of a generic struct type, with
// the methods of its instantiated type, and returns it.
export function genericInstance<T>(
  value: T,
  methods: GenericInstanceMethods,
): T {
  ;(value as any)[genericInstanceKey] = methods
  return value
}

// copyGenericInstance gives target, a copy of source, the methods of the
// instantiated type of source, and returns it.
export function copyGenericInstance<T>(source: object, target: T): T {
  ;(target as any)[genericInstanceKey] = (source as any)[genericInstanceKey]
  return target
}

// genericStructType returns the type information of name, an instantiation
// of the generic struct type registered as baseName, with the given fields,
// whose types are those of its type arguments. The first use registers it
// under name with the constructor and methods of the generic type, so that
// reflect finds it by name as it finds other struct types.
export function genericStructType(
  baseName: string,
  name: string,
  fields: () => StructFieldInfo[],
): StructTypeInfo | string {
  // An instantiation that cannot be named is described by its generic type.
  if (name === baseName) {
    return baseName
  }

  // An instantiation is registered once.
  const registered = typeRegistry.get(name)
  if (registered !== undefined && isStructTypeInfo(registered)) {
    return registered
  }

  // It shares the constructor and methods of its generic type, if registered.
  const base = typeRegistry.get(baseName)
  if (base === undefined || !isStructTypeInfo(base) || !base.ctor) {
    return baseName
  }
  return registerStructType(
    name,
    base.zeroValue,
    () => base.methods,
    base.ctor,
    fields,
  )
}

// genericTypeName returns the name of the instantiation of the generic type
// baseName with type arguments of the given types, such as main.Pair[int,
// []main.Item], or baseName if one of them cannot be spelled.
export function genericTypeName(
  baseName: string,
  typeArgs: (TypeInfo | string)[],
): string {
  // The type arguments follow the name in brackets.
  const args: string[] = []
  for (const arg of typeArgs) {
    const text = typeArgGoString(arg)
    if (text === undefined) {
      return baseName
    }
    args.push(text)
  }
  return baseName + '[' + args.join(',') + ']'
}

// typeArgGoString returns the Go type string of info, a type argument, as
// the compiler spells the type arguments of an instantiation it names, or
// undefined for a type it leaves unnamed: an unnamed interface, struct or
// function type, or a channel type.
function typeArgGoString(
  info: string | TypeInfo | undefined,
): string | undefined {
  // A registered type is spelled by its name, as is a named type.
  if (info === undefined || typeof info === 'string') {
    return info
  }
  const name = info.typeName || info.name
  if (name) {
    return name
  }

  // Composite types spell their element types.
  switch (info.kind) {
    case TypeKind.Pointer:
      return prefixTypeArgString('*', info.elemType)
    case TypeKind.Slice:
      return prefixTypeArgString('[]', info.elemType)
    case TypeKind.Array:
      return prefixTypeArgString(`[${info.length}]`, info.elemType)
    case TypeKind.Map: {
      const key = typeArgGoString(info.keyType)
      return key === undefined ? undefined : (
          prefixTypeArgString(`map[${key}]`, info.elemType)
        )
    }
  }
  return undefined
}

// prefixTypeArgString returns the Go type string of elem after prefix, or
// undefined if elem cannot be spelled (see typeArgGoString).
function prefixTypeArgString(
  prefix: string,
  elem: string | TypeInfo | undefined,
): string | undefined {
  const text = typeArgGoString(elem)
  return text === undefined ? undefined : prefix + text
}

// GenericInstanceMethodSets are the method sets of an instantiated generic
// struct type, for boxing a pointer to it or a value of it.
export interface GenericInstanceMethodSets {
  pointer: NamedValueMethods
  value: NamedValueMethods
}

// genericInstanceMethodSets holds the method sets made from each method
// description, so that each box of an instance shares them.
const genericInstanceMethodSets = new WeakMap<
  GenericInstanceMethods,
  GenericInstanceMethodSets
>()

// genericInstanceMethods returns the method sets of the instantiated generic
// struct type of value, or undefined if value is not an instance of a generic
// struct type marked by genericInstance.
export function genericInstanceMethods(
  value: unknown,
): GenericInstanceMethodSets | undefined {
  // Only a marked instance has them.
  if (value === null || typeof value !== 'object') {
    return undefined
  }
  const describe = (value as any)[genericInstanceKey] as
    | GenericInstanceMethods
    | undefined
  if (describe === undefined) {
    return undefined
  }

  // The method sets of a description are made once.
  let sets = genericInstanceMethodSets.get(describe)
  if (sets === undefined) {
    const [methods, signatures] = describe()
    sets = {
      pointer: { methods, signatures },
      value: valueMethodSet(methods, signatures),
    }
    genericInstanceMethodSets.set(describe, sets)
  }
  return sets
}

// valueMethodSet returns the methods of methods and signatures, a pointer
// type's method set, that are in the method set of the type it points to.
function valueMethodSet(
  methods: Record<string, (receiver: any, ...args: any[]) => any>,
  signatures: MethodSignature[],
): NamedValueMethods {
  // Methods that only a pointer has are left out.
  const valueMethods: Record<string, (receiver: any, ...args: any[]) => any> =
    {}
  const valueSignatures = signatures.filter((sig) => !sig.pointerReceiver)
  for (const sig of valueSignatures) {
    if (methods[sig.name] !== undefined) {
      valueMethods[sig.name] = methods[sig.name]
    }
  }
  return { methods: valueMethods, signatures: valueSignatures }
}

/**
 * typeParamPointerInterfaceValue converts a pointer to a value of a type
 * parameter to an interface value. When the type argument is a named
 * non-struct type with a registered method set, the pointer is boxed with the
 * method set of a pointer to the type argument, as the compiler cannot know it
 * statically. Otherwise, the pointer is converted as any other pointer.
 */
export function typeParamPointerInterfaceValue<T>(
  value: unknown,
  typeArg: GenericTypeDescriptor | undefined,
  typeName: string,
  typeInfo?: TypeInfo | string,
): T {
  const argInfo = typeArg?.type
  const argName = typeof argInfo === 'string' ? argInfo : argInfo?.typeName
  if (argInfo !== undefined && argName !== undefined) {
    const registered = namedValueMethods('*' + argName)
    if (registered !== undefined) {
      return namedValueInterfaceValue<T>(
        value,
        '*' + argName,
        registered.methods,
        pointerType(argInfo),
        registered.signatures,
      )
    }
  }
  return interfaceValue<T>(
    value,
    dynamicTypeName(typeInfo) ?? typeName,
    typeInfo,
  )
}

export function namedValueInterfaceValue<T>(
  value: unknown,
  typeName: string,
  methods: Record<string, (receiver: any, ...args: any[]) => any>,
  typeInfo?: TypeInfo | string,
  methodSignatures?: MethodSignature[],
): T {
  // A method table that is cached, as the compiler creates one per type,
  // has a shared prototype holding its method wrappers, so that boxing a
  // value only creates the box.
  const proto =
    methodSignatures !== undefined ? namedValueBoxPrototype(methods) : undefined
  if (proto !== undefined) {
    const box = Object.create(proto)
    box.__goType = typeName
    box.__goValue = value
    box.__goTypeInfo = typeInfo
    return box as T
  }
  const boxed: any = {
    __goType: typeName,
    __goValue: value,
    __goTypeInfo: typeInfo,
    valueOf: () => value,
    toString: () => String(value),
    [Symbol.toPrimitive]: () => value as any,
  }
  for (const entry of namedValueMethodEntries(
    methods,
    typeInfo,
    methodSignatures,
  )) {
    const method = entry.method
    const wrapper: any = (...args: any[]) => method(value, ...args)
    wrapper.__goscriptMethodWrapper = true
    if (entry.signature) {
      wrapper.__goscriptMethodSignature = entry.signature
    }
    boxed[entry.name] = wrapper
  }
  return boxed as T
}

// namedValueBoxPrototypes holds the prototype of the boxes of each cached
// method table, made the first time a value is boxed with it.
const namedValueBoxPrototypes = new WeakMap<object, object>()

// namedValueBoxMarker marks a prototype of named value boxes, whose methods
// make up their Go method surface.
export const namedValueBoxMarker = Symbol('namedValueBox')

// basicBoxPrototype is the prototype of the boxes made by basicInterfaceValue,
// which have no methods.
const basicBoxPrototype: object = {
  valueOf(this: { __goValue: unknown }) {
    return this.__goValue
  },
  toString(this: { __goValue: unknown }) {
    return String(this.__goValue)
  },
  [Symbol.toPrimitive](this: { __goValue: unknown }) {
    return this.__goValue
  },
  [namedValueBoxMarker]: true,
}

// namedValueBoxMethod returns the method of a box prototype that calls the
// method of entry with the boxed value. A method without parameters passes
// no arguments, which avoids spreading them on every call.
function namedValueBoxMethod(
  entry: NamedValueMethodEntry,
): (this: any, ...args: any[]) => any {
  const method = entry.method
  if (entry.signature !== undefined && entry.signature.args.length === 0) {
    return function (this: any) {
      return method(this.__goValue)
    }
  }
  return function (this: any, ...args: any[]) {
    return method(this.__goValue, ...args)
  }
}

function namedValueBoxPrototype(
  methods: Record<string, (receiver: any, ...args: any[]) => any>,
): object | undefined {
  // A method table has one prototype.
  let proto = namedValueBoxPrototypes.get(methods)
  if (proto !== undefined) {
    return proto
  }

  // The methods are those cached by namedValueMethodEntries.
  const entries = namedValueMethodCache.get(methods)
  if (entries === undefined) {
    return undefined
  }
  const p: any = {
    valueOf(this: any) {
      return this.__goValue
    },
    toString(this: any) {
      return String(this.__goValue)
    },
    [Symbol.toPrimitive](this: any) {
      return this.__goValue
    },
    [namedValueBoxMarker]: true,
  }
  for (const entry of entries) {
    const wrapper: any = namedValueBoxMethod(entry)
    wrapper.__goscriptMethodWrapper = true
    if (entry.signature) {
      wrapper.__goscriptMethodSignature = entry.signature
    }
    p[entry.name] = wrapper
  }
  namedValueBoxPrototypes.set(methods, p)
  return p
}

interface NamedValueMethodEntry {
  name: string
  method: (receiver: any, ...args: any[]) => any
  signature: MethodSignature | undefined
}

// namedValueMethodEntries caches the methods of a method table, with their
// signatures, for a method table that generated code creates once for a type.
const namedValueMethodCache = new WeakMap<object, NamedValueMethodEntry[]>()

function namedValueMethodEntries(
  methods: Record<string, (receiver: any, ...args: any[]) => any>,
  typeInfo?: TypeInfo | string,
  methodSignatures?: MethodSignature[],
): NamedValueMethodEntry[] {
  // A method table with signatures has one list of entries.
  const cached = namedValueMethodCache.get(methods)
  if (cached !== undefined) {
    return cached
  }

  // Each method takes its signature from the given list or from the type info.
  const entries = Object.entries(methods).map(([name, method]) => ({
    name,
    method,
    signature:
      methodSignatures?.find((candidate) => candidate.name === name) ??
      wrapperMethodSignatureFromTypeInfo(name, typeInfo) ??
      undefined,
  }))

  // Only a method table that comes with its signatures is cached, since
  // its signatures do not depend on the type info given with it.
  if (methodSignatures !== undefined) {
    namedValueMethodCache.set(methods, entries)
  }
  return entries
}

/**
 * typeParamInterfaceValue converts a value of a type parameter to an
 * interface value. A primitive of a named basic type, or with methods, is
 * boxed with the methods of the type argument, as namedValueInterfaceValue
 * boxes a value of a concrete named basic type, and a number of an unnamed
 * numeric type is boxed with its type, as basicInterfaceValue boxes a
 * number converted to an interface. Other values are returned unchanged.
 */
export function typeParamInterfaceValue<T = any>(
  value: unknown,
  descriptor: GenericTypeDescriptor | undefined,
): T {
  // A struct value of a named type argument is named by it.
  if (
    descriptor?.type !== undefined &&
    typeof value === 'object' &&
    value !== null &&
    isMarkedAsStructValue(value)
  ) {
    const name = dynamicTypeName(descriptor.type)
    return name === undefined ?
        (value as T)
      : interfaceValue<T>(value, name, descriptor.type)
  }
  if (descriptor?.type === undefined || !isPrimitiveValue(value)) {
    return value as T
  }
  const info = normalizeTypeInfo(descriptor.type)
  const methods = descriptor.methods ?? {}
  if (info.kind !== TypeKind.Basic) {
    return value as T
  }
  if (!info.typeName && Object.keys(methods).length === 0) {
    // A number does not tell its type (float64 or int), so it is boxed
    // with the type argument, as a value of a numeric type converted to an
    // interface is.
    if (
      info.name !== undefined &&
      (typeof value === 'number' || typeof value === 'bigint')
    ) {
      return basicInterfaceValue<T>(value, info.name)
    }
    return value as T
  }
  return namedValueInterfaceValue<T>(
    value,
    info.typeName ?? info.name ?? '',
    methods,
    descriptor.type,
    descriptor.methodSignatures,
  )
}

/**
 * isNamedValueBox reports whether a value is a boxed named-type interface
 * value produced by namedValueInterfaceValue. Both markers are required: an
 * ordinary JS object that merely happens to have a `__goValue` property (legal
 * input elsewhere, e.g. through json.Marshal) is not a box.
 */
export function isNamedValueBox(
  v: unknown,
): v is { __goType: string; __goValue: unknown } {
  return (
    typeof v === 'object' &&
    v !== null &&
    '__goValue' in v &&
    typeof (v as { __goType?: unknown }).__goType === 'string'
  )
}

function wrapperMethodSignatureFromTypeInfo(
  name: string,
  typeInfo?: TypeInfo | string,
): MethodSignature | null {
  if (typeof typeInfo === 'string') {
    typeInfo = typeRegistry.get(typeInfo)
  }
  if (!typeInfo) {
    return null
  }
  if (isFunctionTypeInfo(typeInfo)) {
    return {
      name,
      args: (typeInfo.params ?? []).map((type) => ({ type })),
      returns: (typeInfo.results ?? []).map((type) => ({ type })),
    }
  }
  if (isStructTypeInfo(typeInfo) || isInterfaceTypeInfo(typeInfo)) {
    return typeInfo.methods.find((method) => method.name === name) ?? null
  }
  return null
}

export function namedFunction<T>(
  fn: T,
  typeName: string,
  typeInfo?: FunctionTypeInfo,
): T {
  if (typeof fn !== 'function') {
    return fn
  }
  return typedFunction(fn as GoFunction, typeName, typeInfo) as T
}

// GoFunction is the JavaScript form of a Go function value.
export type GoFunction = (...args: any[]) => any

// typedFunction returns fn carrying the Go function type typeName. One
// JavaScript function backs every Go value made from a declared function, so
// a function carrying another type is wrapped rather than retagged: retagging
// would change the dynamic type of every other value sharing it. Go function
// values have no identity, so the wrapper is indistinguishable from fn.
function typedFunction(
  fn: GoFunction,
  typeName: string,
  typeInfo?: FunctionTypeInfo,
): GoFunction {
  const name = typeInfo ? typeInfo.name : typeName
  const currentInfo: FunctionTypeInfo | undefined = Reflect.get(
    fn,
    '__typeInfo',
  )
  const currentName: string | undefined =
    Reflect.get(fn, '__goTypeName') ?? currentInfo?.name
  if (
    currentName === name &&
    (currentInfo !== undefined || typeInfo === undefined)
  ) {
    return fn
  }
  const wrapper = Object.assign(fn.bind(null), {
    __goTypeName: name,
    __typeInfo: typeInfo,
    __goTarget: Reflect.get(fn, '__goTarget') ?? fn,
  })

  // The wrapper keeps the Go name and the twin of fn.
  const goName: string | undefined = Reflect.get(fn, '__goFuncName')
  if (goName !== undefined) {
    Reflect.set(wrapper, '__goFuncName', goName)
  }
  const twin: unknown = Reflect.get(fn, '__goReflectTwin')
  if (typeof twin === 'function') {
    setReflectTwin(wrapper, twin as GoFunction)
  }
  return wrapper
}

// functionValue returns fn carrying its Go function type, and its Go
// function name when given, as runtime.FuncForPC reports it.
export function functionValue<T extends (...args: any[]) => any>(
  fn: T,
  typeInfo: FunctionTypeInfo,
  goName?: string,
): T {
  Object.assign(
    fn,
    typeInfo.name ?
      { __typeInfo: typeInfo, __goTypeName: typeInfo.name }
    : { __typeInfo: typeInfo },
  )
  if (goName !== undefined) {
    Reflect.set(fn, '__goFuncName', goName)
  }
  return fn
}

// goFunc records the Go name of a declared function used as a value, such
// as example.com/pkg.Func, so that runtime.FuncForPC reports it. A declared
// function always has the same name, so the name is recorded on the function
// itself, and fn is returned.
export function goFunc<T>(fn: T, goName: string): T {
  if (
    typeof fn === 'function' &&
    Reflect.get(fn, '__goFuncName') === undefined
  ) {
    Reflect.set(fn, '__goFuncName', goName)
  }
  return fn
}

// reflectTwinSuffix ends the member name of the twin of a method. A twin is
// an async copy of a function or method that reflect.Value.Call calls: it
// awaits the calls of the function values that reflection made and passed to
// it, which the function itself, called by compiled code with compiled
// functions, does not.
export const reflectTwinSuffix = '$reflect'

// setReflectTwin links fn, a package function or a bound method, to its twin.
export function setReflectTwin(fn: GoFunction, twin: GoFunction): void {
  Reflect.set(fn, '__goReflectTwin', twin)
}

// reflectTwin returns the twin of fn, or fn itself when it has none.
export function reflectTwin<F extends GoFunction>(fn: F): F {
  const twin: unknown = Reflect.get(fn, '__goReflectTwin')
  return typeof twin === 'function' ? (twin as F) : fn
}

// bindReflectMethod returns method, the method name of receiver, bound to
// receiver and linked to the twin of the method, bound too, if it has one.
export function bindReflectMethod(
  receiver: object,
  name: string,
  method: GoFunction,
): GoFunction {
  // The bound method is called as usual.
  const bound = method.bind(receiver)
  const twin: unknown = Reflect.get(receiver, name + reflectTwinSuffix)

  // Its twin, if any, is linked for reflect.Value.Call.
  if (typeof twin === 'function') {
    setReflectTwin(bound, twin.bind(receiver))
  }
  return bound
}

// callReflectTwin calls the method name of receiver with args through its
// twin, or the method itself when it has none. The twin of a method promoted
// from an embedded interface calls the twin of its dynamic value this way.
export function callReflectTwin(
  receiver: any,
  name: string,
  ...args: unknown[]
): unknown {
  const twin: unknown = receiver[name + reflectTwinSuffix]
  if (typeof twin === 'function') {
    return twin.apply(receiver, args)
  }
  return receiver[name](...args)
}

// functionAddress returns the address of the function value fn, which is that
// of the function it was made from, so that the wrappers that typedFunction
// makes when a function is converted have the address of the function, as a
// Go function has the address of its code however it is converted.
export function functionAddress(fn: object): number {
  const target: unknown = Reflect.get(fn, '__goTarget')
  return pointerAddress(typeof target === 'function' ? target : fn)
}

// goFunctionName returns the Go name of the function value fn: the name
// recorded by goFunc or functionValue, or else its JavaScript name without
// the prefix that binding adds.
export function goFunctionName(fn: unknown): string {
  if (typeof fn !== 'function') {
    return ''
  }
  const goName: string | undefined = Reflect.get(fn, '__goFuncName')
  if (goName !== undefined) {
    return goName
  }
  return fn.name.replace(/^(bound )+/, '')
}

// syncResult returns the result of a function value called where the caller
// cannot suspend, such as a callback that a synchronous runtime override
// invokes. A function value that suspends returns a promise, which that caller
// cannot wait for.
export function syncResult<T>(result: T | globalThis.Promise<T>): T {
  if (result instanceof Promise) {
    throw new Error('function value suspended in a synchronous context')
  }
  return result
}

// syncFunction adapts a function value passed to a synchronous callback
// parameter, which calls it without awaiting, so that each call returns its
// result synchronously through syncResult.
export function syncFunction<A extends unknown[], R>(
  fn: ((...args: A) => R | globalThis.Promise<R>) | null,
): ((...args: A) => R) | null {
  if (fn === null) {
    return null
  }
  return (...args: A): R => syncResult(fn(...args))
}

export interface GenericTypeDescriptor<T = any> {
  type?: TypeInfo | string
  zero?: () => T
  methods?: Record<string, (receiver: T, ...args: any[]) => any>
  methodSignatures?: MethodSignature[]
}

// genericTypeArgsMarker brands compiler-hidden descriptors. This is a string
// constant, not a Symbol: the compiler emits it as a computed property key,
// and a minifier that inlines the descriptor's (often no-op) consumer turns
// the object literal into a property-evaluation sequence that stringifies
// the key. A Symbol key throws "Cannot convert a Symbol value to a string"
// there; a string key survives minification and keeps the `in` check working.
export const genericTypeArgsMarker = 'goscript.genericTypeArgs' as const

// genericTypeArgsBrand is the value stored under the marker key. It is a
// GenericTypeDescriptor-shaped placeholder so the marker property satisfies
// the Record<string, GenericTypeDescriptor> index signature in
// GenericTypeArgs while staying recognizable via the marker key.
export const genericTypeArgsBrand: GenericTypeDescriptor = {}

export type GenericTypeArgs = Record<string, GenericTypeDescriptor> & {
  [genericTypeArgsMarker]?: GenericTypeDescriptor
}

// CallSite is the Go position of a call that the compiler passes to a
// function that //goscript:callsite marks, or to runtime.Caller: the file, as
// go build -trimpath names it, and the line. caller is the call site of the
// function that made the call, when the directive marks that function too.
export interface CallSite {
  file: string
  line: number
  caller?: CallSite
}

// stripGenericTypeArgs removes a hidden descriptor before interface dispatch.
export function stripGenericTypeArgs(args: unknown[]): unknown[] {
  const first = args[0]
  if (
    typeof first === 'object' &&
    first !== null &&
    genericTypeArgsMarker in first
  ) {
    args.shift()
  }
  return args
}

export function genericZero<T>(
  typeArgs: GenericTypeArgs | undefined,
  name: string,
  fallback: T,
): T {
  const zero = typeArgs?.[name]?.zero
  if (zero) {
    return zero() as T
  }
  return fallback
}

// genericSliceTypeHint returns the makeSlice type hint of the typed array
// that holds slices of the type argument of the type parameter name, so that
// make([]T, n) in generic code makes the slice that make of its type argument
// makes, or undefined for elements held in plain arrays.
export function genericSliceTypeHint(
  typeArgs: GenericTypeArgs | undefined,
  name: string,
): string | undefined {
  // A basic type argument, named or not, is described by its basic name.
  const info = typeArgs?.[name]?.type
  const basic =
    typeof info === 'string' ? info
    : info?.kind === TypeKind.Basic ? info.name
    : undefined
  return typedSliceHintOfBasic(basic)
}

// genericNew returns new(T) for the type parameter name. A pointer to a
// struct is the struct instance itself, as for new of a struct type in
// non-generic code, so a struct type argument returns its zero value
// without value semantics. Any other type argument returns a VarRef.
export function genericNew<T>(
  typeArgs: GenericTypeArgs | undefined,
  name: string,
  fallback: T,
): T | VarRef<T> {
  const zero = genericZero(typeArgs, name, fallback)
  if (isMarkedAsStructValue(zero)) {
    ;(zero as any)[structValueMarker] = false
    return zero
  }
  return varRef(zero)
}

export function callGenericMethod<T>(
  typeArgs: GenericTypeArgs | undefined,
  name: string,
  method: string,
  receiver: T,
  ...args: any[]
): any {
  const fn = typeArgs?.[name]?.methods?.[method]
  if (fn) {
    return fn(receiver, ...args)
  }
  return (receiver as any)[method](...args)
}

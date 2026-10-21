import {
  GoSlice,
  isArrayOrGoSlice,
  isTypedSlice,
  sliceElems,
  sliceSlot,
  type TypedSlice,
} from './slice.js'
import type { Slice, SliceProxy, StringHeaderData } from './slice.js'
import {
  arrayValueTypeInfo,
  cloneArrayValue,
  isArrayValue,
  isMarkedAsStructValue,
  isTypeInfoComparable,
  pointerIdentityEqual,
  resolveTypeInfo,
  structFieldRuntimeKey,
  structValueTypeInfo,
  isStructObject,
  TypeKind,
  type GenericTypeArgs,
  type TypeInfo,
  namedValueBoxMarker,
} from './type.js'
import { writeHostStdoutText } from './hostio.js'
import { notImplemented, runtimePanic } from './panic.js'
import { formatPrintedArgs } from './print.js'
import { isSliceProxy, runeToString, sliceRange, zeroLike } from './slice.js'
import { isVarRef, type VarRef } from './varRef.js'

/**
 * print writes formatted operands, awaiting asynchronous string methods.
 */
export async function print(...args: any[]): Promise<void> {
  writeHostStdoutText(args.length === 0 ? '' : await formatPrintedArgs(args))
}

/**
 * println writes formatted operands followed by a newline.
 */
export async function println(...args: any[]): Promise<void> {
  const message =
    (args.length === 0 ? '' : await formatPrintedArgs(args)) + '\n'
  writeHostStdoutText(message)
}

/**
 * clear zeroes slice elements or removes every map entry.
 */
export function clear<T>(
  v: Slice<T> | Map<unknown, unknown> | null,
  zeroFactory?: () => T,
): void {
  // A nil slice or map has nothing to clear.
  if (v === null || v === undefined) {
    return
  }

  // A map loses its entries, and a typed slice is zeroed in place.
  if (v instanceof Map) {
    v.clear()
    return
  }
  if (isTypedSlice(v)) {
    v.fill(0)
    return
  }

  // The factory knows the zero value of the element type. Elements that are
  // structs or arrays each get a zero value of their own.
  if (zeroFactory !== undefined) {
    const { backing, offset, length } = sliceRange(v as Slice<T>)
    const zero = zeroFactory()
    if (typeof zero !== 'object' || zero === null) {
      ;(backing as T[]).fill(zero, offset, offset + length)
      return
    }
    for (let i = 0; i < length; i++) {
      ;(backing as T[])[offset + i] = zeroFactory()
    }
    return
  }

  // Without a factory, each element gets the zero value of the type of a
  // sample element, so that a struct element is a new zero struct.
  if (isSliceProxy(v) || Array.isArray(v)) {
    const { backing, offset, length } = sliceRange(v as Slice<T>)
    const sample = clearSample(backing as T[], offset, length)
    for (let i = 0; i < length; i++) {
      ;(backing as T[])[offset + i] = zeroLike(sample) as T
    }
  }
}

// clearSample returns the first element of the window of backing that is
// not nil, which shows the element type, or null.
function clearSample<T>(backing: T[], offset: number, length: number): T | null {
  for (let i = 0; i < length; i++) {
    const item = backing[offset + i]
    if (item !== null && item !== undefined) {
      return item
    }
  }
  return null
}

/**
 * assignStruct copies a prepared struct value into existing storage. Nested
 * structs and arrays retain their addresses; pointer and slice fields receive
 * the source references. The compiler snapshots the right-hand side first.
 * It returns target, which the compiler assigns back to a local variable so
 * that TypeScript forgets what it narrowed about the old field values.
 */
export function assignStruct<T>(
  target: T,
  source: T,
  typeInfo?: TypeInfo | string,
): T {
  if (
    target === null ||
    target === undefined ||
    source === null ||
    source === undefined
  ) {
    return target
  }

  // A generated struct class copies the fields of a value of its own type
  // directly, which is much faster than copying them by their type info.
  if (
    (target as any).constructor === (source as any).constructor &&
    typeof (target as any).__goscriptAssign === 'function'
  ) {
    ;(target as any).__goscriptAssign(source)
    return target
  }

  // The value identifies its layout even when package names collide.
  const info = structValueTypeInfo(source) ?? typeInfo
  const resolved = resolveTypeInfo(info)

  // A struct with field descriptors is copied field by field; a registered
  // struct without them (such as time.Time) keeps its state in private
  // properties, copied by clone below.
  if (resolved?.kind === TypeKind.Struct && resolved.fields.length !== 0) {
    const destination = target as Record<string, unknown>
    const values = source as Record<string, unknown>
    for (const field of resolved.fields) {
      const key = structFieldRuntimeKey(field)
      destination[key] = assignFieldValue(
        destination[key],
        values[key],
        field.type,
      )
    }
    return target
  }

  // Other structs (e.g. bound protobuf messages) carry their data as plain
  // enumerable properties. Copy a clone when the value defines one,
  // otherwise copy the value's own properties directly.
  const cloneable = source as {
    __goscriptClone?: () => T
    clone?: () => T
  }
  const copied = cloneable.__goscriptClone?.() ?? cloneable.clone?.() ?? source
  Object.assign(target as object, copied as object)
  return target
}

/** assignFieldValue preserves aggregate storage while replacing reference values. */
export function assignFieldValue(
  target: any,
  source: any,
  typeInfo?: TypeInfo | string,
): any {
  const info = resolveTypeInfo(typeInfo)
  if (info?.kind === TypeKind.Struct) {
    assignStruct(target, source, info)
    return target
  }
  if (info?.kind === TypeKind.Array) {
    // An array is copied into the existing one in place, or copied anew
    // when there is none yet.
    if (target === null || target === undefined) {
      return cloneArrayValue(source, info)
    }
    for (let i = 0; i < info.length; i++) {
      target[i] = assignFieldValue(target[i], source[i], info.elemType)
    }
    return target
  }

  // An array whose type is not resolved is still copied.
  if (isArrayValue(source)) {
    return cloneArrayValue(source, arrayValueTypeInfo(source))
  }
  return source
}

/**
 * genericPointerRef returns the storage of a pointer to a type parameter, for
 * assignments through it such as *p = v. A pointer to a struct is the struct
 * instance itself, so storing a value copies its fields into the instance;
 * any other pointer is a VarRef.
 */
export function genericPointerRef<T>(
  pointer: T | VarRef<T> | null | undefined,
): VarRef<T> {
  if (pointer === null || pointer === undefined) {
    runtimePanic(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  }
  if (isVarRef(pointer)) {
    return pointer as VarRef<T>
  }
  const target = pointer as T
  return {
    get value(): T {
      return target
    },
    set value(source: T) {
      assignStruct(target, source)
    },
  }
}

/**
 * pointerValue unwraps a Go pointer value for generated field, method, and
 * dereference access. Struct pointers may be represented directly as class
 * instances or indirectly as VarRef values when the pointer came from taking a
 * variable's address.
 */
export function pointerValue<T>(value: T | VarRef<T> | null | undefined): T {
  if (value === null || value === undefined) {
    runtimePanic(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  }

  // A variable reference holds its value, and a struct that is not a boxed
  // pointer is its own target. These property reads are much faster than
  // the type and 'in' checks below, on the many kinds of objects seen here.
  if ((value as any).__isVarRef === true) {
    return (value as VarRef<T>).value
  }
  if ((value as any).__goValue === undefined) {
    return value as T
  }

  // A boxed pointer is unwrapped to its target.
  const boxed =
    typeof value === 'object' && value !== null && '__goValue' in value ?
      (value as { __goType?: unknown; __goValue: T | VarRef<T> })
    : null
  if (
    boxed !== null &&
    typeof boxed.__goType === 'string' &&
    boxed.__goType.startsWith('*') &&
    !hasGoMethodSurface(value)
  ) {
    return pointerValue(boxed.__goValue)
  }
  return value as T
}

// nilPointerTarget stands for the struct that a nil pointer points to: any
// property access panics as a nil pointer dereference does.
const nilPointerTarget: object = new Proxy(
  {},
  {
    get(): never {
      runtimePanic(
        'runtime error: invalid memory address or nil pointer dereference',
      )
    },
    set(): never {
      runtimePanic(
        'runtime error: invalid memory address or nil pointer dereference',
      )
    },
  },
)

// callOverrideMethod calls method on the value of an override class, for the
// method function Type_Method that the compiler declares when the override
// does not. A pointer receiver arrives as a reference to the value. A class
// without the method panics with name, its Go method.
export function callOverrideMethod(
  receiver: unknown,
  method: string,
  name: string,
  args: unknown[],
): unknown {
  // Find the method on the value the receiver holds.
  const target = pointerValue(receiver) as Record<string, unknown>
  const fn = target[method]
  if (typeof fn !== 'function') {
    notImplemented(name)
  }

  // Call it with the value as this.
  return fn.apply(target, args)
}

/**
 * pointerTarget returns the struct that a pointer points to, for a function
 * that reads it once and then accesses its fields: a nil pointer returns an
 * object whose field accesses panic, so that the panic happens at a field
 * access, as in Go, rather than here.
 */
export function pointerTarget<T>(value: T | VarRef<T> | null | undefined): T {
  if (value === null || value === undefined) {
    return nilPointerTarget as T
  }
  return pointerValue(value)
}

export function pointerValueOrNil<T>(
  value: T | VarRef<T> | null | undefined,
): T | null {
  if (value === null || value === undefined) {
    return null
  }
  if (isVarRef(value)) {
    return value.value as T
  }
  const boxed =
    typeof value === 'object' && value !== null && '__goValue' in value ?
      (value as { __goType?: unknown; __goValue: T | VarRef<T> })
    : null
  if (
    boxed !== null &&
    typeof boxed.__goType === 'string' &&
    boxed.__goType.startsWith('*') &&
    !hasGoMethodSurface(value)
  ) {
    return pointerValueOrNil(boxed.__goValue)
  }
  return value
}

const reflectTypeIdentities = new WeakMap<object, string>()

export function markReflectTypeIdentity(value: object, identity: string): void {
  reflectTypeIdentities.set(value, identity)
}

export function arrayEqual(a: unknown, b: unknown): boolean {
  return comparableEqual(a, b)
}

export function comparableEqual(a: unknown, b: unknown): boolean {
  if (
    hasGoType(a) &&
    hasGoType(b) &&
    a.__isTypedNil === true &&
    b.__isTypedNil === true &&
    a.__goType === b.__goType
  ) {
    const typeInfo = a.__goTypeInfo ?? b.__goTypeInfo
    if (typeInfo !== undefined && !isTypeInfoComparable(typeInfo)) {
      runtimePanic(`runtime error: comparing uncomparable type ${a.__goType}`)
    }
  }
  if (a === b) {
    return true
  }
  if (a === null || a === undefined || b === null || b === undefined) {
    return false
  }
  if (
    typeof a === 'object' &&
    typeof b === 'object' &&
    pointerIdentityEqual(a, b)
  ) {
    return true
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const aType = reflectTypeIdentities.get(a)
    const bType = reflectTypeIdentities.get(b)
    if (aType !== undefined || bType !== undefined) {
      return aType !== undefined && aType === bType
    }
  }
  // Arrays compare element by element, read through the window of a slice.
  if (isArrayLike(a) && isArrayLike(b)) {
    if (a.length !== b.length) {
      return false
    }
    const aElems = sliceElems(a)
    const bElems = sliceElems(b)
    for (let i = 0; i < a.length; i++) {
      if (!comparableEqual(aElems[sliceSlot(a, i)], bElems[sliceSlot(b, i)])) {
        return false
      }
    }
    return true
  }
  if (isComplexValue(a) || isComplexValue(b)) {
    return (
      isComplexValue(a) &&
      isComplexValue(b) &&
      a.real === b.real &&
      a.imag === b.imag
    )
  }
  if (hasGoType(a) || hasGoType(b)) {
    if (!hasGoType(a) || !hasGoType(b) || a.__goType !== b.__goType) {
      return false
    }
    if (a.__isTypedNil || b.__isTypedNil) {
      return a.__isTypedNil === true && b.__isTypedNil === true
    }
    if (a.__goType.startsWith('*')) {
      return false
    }
    if (hasGoValue(a) || hasGoValue(b)) {
      return (
        hasGoValue(a) &&
        hasGoValue(b) &&
        comparableEqual(a.__goValue, b.__goValue)
      )
    }
  }
  // A struct object that is neither marked as a value nor boxed with a value
  // type is a pointer to a struct, which is equal only to itself (checked
  // above), so only values compare by their fields.
  if (isStructObject(a) && isStructObject(b)) {
    if (
      !hasGoType(a) &&
      !isMarkedAsStructValue(a) &&
      !isMarkedAsStructValue(b)
    ) {
      return false
    }
    return fieldsEqual(a, b)
  }
  return false
}

/**
 * structEqual compares two values of the same struct type, as for == on
 * operands whose static type is that struct, by comparing their fields.
 * It ignores the dynamic type that interfaceValue records on a struct
 * object, since a pointer to a struct is the struct object itself, so a
 * struct that was passed as a pointer in an interface carries a pointer type.
 */
export function structEqual(
  a: unknown,
  b: unknown,
  typeInfo?: TypeInfo | string,
): boolean {
  // The same object is equal to itself.
  if (a === b) {
    return true
  }

  // The operands may be a named and an unnamed struct of the same underlying
  // type, and both hold their fields as own properties.
  if (!isStructOperand(a) || !isStructOperand(b)) {
    return comparableEqual(a, b)
  }

  // The fields are compared in the order of the struct type of either side.
  const info = structValueTypeInfo(a) ?? structValueTypeInfo(b) ?? typeInfo
  const resolved = resolveTypeInfo(info)
  if (resolved?.kind !== TypeKind.Struct) {
    return fieldsEqual(a, b)
  }
  for (const field of resolved.fields) {
    const key = structFieldRuntimeKey(field)
    const fieldType = resolveTypeInfo(field.type)
    const equal =
      fieldType?.kind === TypeKind.Struct ?
        structEqual(a[key], b[key], fieldType)
      : comparableEqual(a[key], b[key])
    if (!equal) {
      return false
    }
  }
  return true
}

// isArrayLike reports whether value represents a Go array or slice. A GoSlice
// has no index slots, so its elements are read through sliceElems.
function isArrayLike(
  value: unknown,
): value is unknown[] | GoSlice<unknown> | TypedSlice {
  return isArrayOrGoSlice(value) || isTypedSlice(value)
}

function hasGoType(value: unknown): value is {
  __goType: string
  __goTypeInfo?: TypeInfo | string
  __isTypedNil?: boolean
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { __goType?: unknown }).__goType === 'string'
  )
}

function hasGoValue(value: unknown): value is {
  __goValue: unknown
} {
  return typeof value === 'object' && value !== null && '__goValue' in value
}

function hasGoMethodSurface(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const proto = Object.getPrototypeOf(value)
  if (proto !== null && proto[namedValueBoxMarker] === true) {
    return Object.keys(proto).some(
      (key) =>
        key !== 'valueOf' &&
        key !== 'toString' &&
        typeof proto[key] === 'function',
    )
  }
  return Object.keys(value).some((key) => {
    return (
      key !== '__goType' &&
      key !== '__goValue' &&
      key !== 'valueOf' &&
      key !== 'toString' &&
      typeof (value as Record<string, unknown>)[key] === 'function'
    )
  })
}

// isStructOperand reports whether value is a struct value whose fields are
// its own properties: an object of a struct class, or an unnamed struct
// value, which is a plain object marked as a value or carrying its struct
// type.
function isStructOperand(value: unknown): value is Record<string, unknown> {
  return (
    isStructObject(value) ||
    (typeof value === 'object' &&
      value !== null &&
      !isArrayOrGoSlice(value) &&
      (isMarkedAsStructValue(value) ||
        structValueTypeInfo(value) !== undefined))
  )
}

function fieldsEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    return false
  }
  for (const key of aKeys) {
    if (!(key in b) || !comparableEqual(a[key], b[key])) {
      return false
    }
  }
  return true
}

export interface Complex {
  real: number
  imag: number
}

function isComplexValue(value: unknown): value is Complex {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { real?: unknown }).real === 'number' &&
    typeof (value as { imag?: unknown }).imag === 'number'
  )
}

export function complex(real: number, imag: number): Complex {
  return { real, imag }
}

export function float32(value: number | bigint): number {
  return Math.fround(Number(value))
}

export function complex64(value: Complex): Complex
export function complex64(real: number | bigint, imag: number | bigint): Complex
export function complex64(
  valueOrReal: Complex | number | bigint,
  imag: number | bigint = 0,
): Complex {
  if (typeof valueOrReal === 'object') {
    return { real: float32(valueOrReal.real), imag: float32(valueOrReal.imag) }
  }
  return { real: float32(valueOrReal), imag: float32(imag) }
}

export function real(value: number | Complex | null | undefined): number {
  value = unwrapGoValue(value)
  if (typeof value === 'number') {
    return value
  }
  return value?.real ?? 0
}

export function imag(value: number | Complex | null | undefined): number {
  value = unwrapGoValue(value)
  if (typeof value === 'number') {
    return 0
  }
  return value?.imag ?? 0
}

function unwrapGoValue<T>(value: T): T {
  if (
    value !== null &&
    value !== undefined &&
    typeof value === 'object' &&
    '__goValue' in value
  ) {
    return (value as { __goValue: T }).__goValue
  }
  return value
}

// Bytes represents Go byte slices, including nil and array-backed slices.
// Its TypeScript type is that of any slice of numbers, but at run time a
// byte slice held in a typed array is a Uint8Array, never another TypedSlice.
export type Bytes = Uint8Array | Slice<number>
type ByteData = TypedSlice | number[] | SliceProxy<number>

const maxUint64BigInt = 0xffffffffffffffffn

// maxSafeUintBigInt is the largest unsigned value JS number represents exactly.
// uint/uintptr are typed number but carry a runtime bigint above this bound so
// full 64-bit width (e.g. ^uint(0)) survives; see uint().
const maxSafeUintBigInt = BigInt(Number.MAX_SAFE_INTEGER)

// int truncates a numeric value, wrapping signed values at an explicit width.
export function int(value: number | bigint | string, bits = 0): number {
  // A finite number of a narrow width wraps with the bitwise operators.
  if (typeof value === 'number' && Number.isFinite(value)) {
    // The JavaScript bitwise operators truncate a finite number and wrap it to
    // 32 bits as Go's conversions do.
    if (bits === 32) {
      return value | 0
    }
    if (bits === 16) {
      return (value << 16) >> 16
    }
    if (bits === 8) {
      return (value << 24) >> 24
    }
  }
  if (typeof value === 'string') {
    value = BigInt(value)
  }
  if (typeof value === 'bigint') {
    if (bits > 0 && bits <= 64) {
      return Number(BigInt.asIntN(bits, value))
    }
    return Number(value)
  }
  if (bits > 0 && bits < 64) {
    const modulo = 2 ** bits
    const sign = 2 ** (bits - 1)
    let truncated = Math.trunc(value)
    if (!Number.isFinite(truncated)) {
      return truncated
    }
    truncated %= modulo
    if (truncated < 0) {
      truncated += modulo
    }
    if (truncated >= sign) {
      truncated -= modulo
    }
    return truncated
  }
  return Math.trunc(value)
}

// intFromWide converts an int64 or uint64 to a signed integer of fewer bits,
// as int32(x) does.
export function intFromWide(value: number | bigint, bits: number): number {
  // A bigint keeps the bits of its low word, read through the words of
  // wideValue, and a number converts as int does.
  if (typeof value === 'bigint' && bits <= 32) {
    wideValue[0] = value
    return (wideWords[0] << (32 - bits)) >> (32 - bits)
  }
  return typeof value === 'bigint' ?
      Number(BigInt.asIntN(bits, value))
    : int(value, bits)
}

// uintFromWide converts an int64 or uint64 to an unsigned integer of fewer
// bits, as uint32(x) does.
export function uintFromWide(value: number | bigint, bits: number): number {
  // A bigint keeps the bits of its low word, read through the words of
  // wideValue, and a number converts as uint does.
  if (typeof value === 'bigint' && bits <= 32) {
    wideValue[0] = value
    return (wideWords[0] << (32 - bits)) >>> (32 - bits)
  }
  return typeof value === 'bigint' ?
      Number(BigInt.asUintN(bits, value))
    : uint(value, bits)
}

// int64ToNumber converts an int64 to the nearest number, as float64(x) and
// int(x) do. It adds the two words of the value, which V8 compiles to
// machine operations, where it does not compile Number of a bigint. The sum
// of the exact high part and the low word is rounded once, so it is the
// nearest number, as Number gives.
export function int64ToNumber(value: number | bigint): number {
  // A number is already one.
  if (typeof value === 'number') {
    return value
  }

  // A bigint is read as its signed high word and unsigned low word.
  wideValue[0] = value
  return wideWords[1] * 4294967296 + (wideWords[0] >>> 0)
}

// uint64ToNumber converts a uint64 to the nearest number, as float64(x)
// does, through its words as int64ToNumber does.
export function uint64ToNumber(value: number | bigint): number {
  // A number is already one.
  if (typeof value === 'number') {
    return value
  }

  // A bigint is read as two unsigned words.
  wideValue[0] = value
  return (wideWords[1] >>> 0) * 4294967296 + (wideWords[0] >>> 0)
}

// wideValue holds a 64-bit value whose two 32-bit words, low word first on
// the little-endian hosts that run GoScript, are wideWords. Conversions
// between bigints and numbers through them avoid the BigInt and Number calls,
// which V8 does not compile to machine operations.
const wideValue = new BigInt64Array(1)
const wideWords = new Int32Array(wideValue.buffer)

// wideFromSafeInteger returns a safe integer as a bigint, through its words.
function wideFromSafeInteger(value: number): bigint {
  // The high word is the floor of the value over 2^32, and the low word the
  // rest, which the Int32Array wraps to its 32 bits.
  const high = Math.floor(value / 4294967296)
  wideWords[1] = high
  wideWords[0] = value - high * 4294967296
  return wideValue[0]
}

// uint converts a value to an unsigned Go integer width.
export function uint(value: number | bigint | string, bits?: number): number
export function uint(
  value: number | StringHeaderData,
  bits?: number,
): number | StringHeaderData
export function uint(
  value: number | bigint | string | StringHeaderData,
  bits?: number,
): number | bigint | StringHeaderData
export function uint(
  value: number | bigint | string | StringHeaderData,
  bits = 64,
): number | bigint | StringHeaderData {
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (bits === 8) {
      return value & 0xff
    }
    if (bits === 16) {
      return value & 0xffff
    }
    if (bits === 32) {
      return value >>> 0
    }
  }
  return uintGeneral(value, bits)
}

// uintGeneral normalizes values outside the common finite-number widths.
function uintGeneral(
  value: number | bigint | string | StringHeaderData,
  bits: number,
): number | bigint | StringHeaderData {
  if (typeof value === 'object') {
    return value
  }
  if (typeof value === 'string') {
    value = BigInt(value)
  }
  if (typeof value === 'bigint') {
    // A bigint that fits 32 bits is its number, as for uint32(x).
    if (bits === 32 && value >= 0n && value <= 0xffffffffn) {
      return Number(value)
    }
    const normalized = BigInt.asUintN(Math.min(bits, 64), value)
    // Above 2^53 the value cannot round-trip through number, so keep the bigint
    // to preserve full 64-bit width; uint arithmetic routes through the
    // int64*/uint64* helpers, which accept number | bigint.
    if (bits >= 64 && normalized > maxSafeUintBigInt) {
      return normalized
    }
    return Number(normalized)
  }
  if (!Number.isFinite(value)) {
    return value
  }
  if (bits >= 64) {
    const truncated = Math.trunc(value)
    if (truncated >= 0 && truncated <= Number.MAX_SAFE_INTEGER) {
      return truncated
    }
    // Out of safe range: normalize through bigint and keep full width.
    return uint(BigInt(truncated), 64)
  }
  const modulo = 2 ** bits
  let truncated = Math.trunc(value)
  truncated %= modulo
  if (truncated < 0) {
    truncated += modulo
  }
  return truncated
}

// genericConvert converts a value to the named type argument, as in the Go
// conversion T(x) where T is a type parameter. A numeric value takes the
// representation and width of the type argument's underlying basic type,
// such as a bigint for int64; any other value is unchanged.
export function genericConvert<T>(
  typeArgs: GenericTypeArgs | undefined,
  name: string,
  value: unknown,
): T {
  const type = typeArgs?.[name]?.type
  const info = resolveTypeInfo(type)
  if (
    info?.kind !== TypeKind.Basic ||
    (typeof value !== 'number' && typeof value !== 'bigint')
  ) {
    return value as T
  }
  switch (info.name) {
    case 'int64':
      return int64(value) as T
    case 'uint64':
    case 'uintptr':
      return uint64(value) as T
    case 'int8':
      return int(value, 8) as T
    case 'int16':
      return int(value, 16) as T
    case 'int32':
    case 'rune':
      return int(value, 32) as T
    case 'int':
      return int(value) as T
    case 'uint8':
    case 'byte':
      return uint(value, 8) as T
    case 'uint16':
      return uint(value, 16) as T
    case 'uint32':
      return uint(value, 32) as T
    case 'uint':
      return uint(value, 64) as T
    case 'float32':
      return float32(value) as T
    case 'float64':
      return Number(value) as T
    default:
      return value as T
  }
}

// int64 converts a value to a Go int64, preserving the full 64-bit range as a
// bigint with two's-complement wraparound. int64 and uint64 are the Go types
// GoScript represents as TypeScript bigint; narrower ints stay number.
export function int64(value: number | bigint | string): bigint {
  // A number whose integer part is safe converts through its words.
  if (typeof value === 'number' && isSafeNumber(value)) {
    return wideFromSafeInteger(Math.trunc(value))
  }
  if (typeof value === 'string') {
    value = BigInt(value)
  }
  return int64Result(int64Value(value))
}

// uint64 converts a value to a Go uint64, preserving the full 64-bit range as a
// bigint with modular wraparound.
export function uint64(value: number | bigint | string): bigint {
  // A non-negative number whose integer part is safe converts through its
  // words.
  if (typeof value === 'number' && value > -1 && isSafeNumber(value)) {
    return wideFromSafeInteger(Math.trunc(value))
  }
  if (typeof value === 'string') {
    value = BigInt(value)
  }
  return uint64Result(uint64Value(value))
}

// isSafeNumber reports whether the integer part of a number converts to a
// bigint exactly, which is false for NaN.
function isSafeNumber(value: number): boolean {
  return value > -9007199254740992 && value < 9007199254740992
}

// wideShiftAmount converts a Go shift count into the JavaScript bigint domain.
// Only counts below 64 can affect a 64-bit result, so Number preserves every
// behaviorally relevant count exactly before the bigint shift.
function wideShiftAmount(shift: number | bigint): bigint {
  // The counts that matter for a 64-bit value are shared bigints, and
  // other counts are converted.
  if (
    typeof shift === 'number' &&
    shift >= 0 &&
    shift <= 64 &&
    shift % 1 === 0
  ) {
    return wideShiftAmounts[shift]
  }

  // A larger count shifts every bit out as 64 does, without making the
  // bigint of a huge shift left.
  if (shift > 64) {
    return wideShiftAmounts[64]
  }
  return BigInt(Math.trunc(Number(shift)))
}

// wideShiftAmounts holds the shift counts 0 to 64 as bigints, so that a shift
// of a 64-bit value allocates no bigint for its count.
const wideShiftAmounts = Array.from({ length: 65 }, (_, idx) => BigInt(idx))

// wideShiftCount returns a shift count below 64 as a bigint, or undefined
// for other counts.
function wideShiftCount(shift: number | bigint): bigint | undefined {
  // A bigint count is its own bigint, and a number count indexes the table,
  // which has no entry for negative or fractional counts.
  if (typeof shift === 'bigint') {
    return shift >= 0n && shift < 64n ? shift : undefined
  }
  return shift < 64 ? wideShiftAmounts[shift] : undefined
}

export function uint64Shl(
  value: number | bigint,
  shift: number | bigint,
): bigint {
  // A bigint shifted by a count below 64 keeps 64 bits of the bigint shift.
  if (typeof value === 'bigint') {
    const amount = wideShiftCount(shift)
    if (amount !== undefined) {
      return BigInt.asUintN(64, value << amount)
    }
  }

  // Other operands are converted to their 64 bits first.
  return uint64Result(uint64Value(value) << wideShiftAmount(shift))
}

export function uint64Shr(
  value: number | bigint,
  shift: number | bigint,
): bigint {
  // A bigint shifted by a count below 64 shifts its 64 bits.
  if (typeof value === 'bigint') {
    const amount = wideShiftCount(shift)
    if (amount !== undefined) {
      return BigInt.asUintN(64, value) >> amount
    }
  }

  // Other operands are converted to their 64 bits first.
  return uint64Value(value) >> wideShiftAmount(shift)
}

export function int64Shl(
  value: number | bigint,
  shift: number | bigint,
): bigint {
  // A bigint shifted by a count below 64 keeps 64 bits of the bigint shift.
  if (typeof value === 'bigint') {
    const amount = wideShiftCount(shift)
    if (amount !== undefined) {
      return BigInt.asIntN(64, value << amount)
    }
  }

  // Other operands are converted to their 64 bits first.
  return int64Result(int64Value(value) << wideShiftAmount(shift))
}

export function int64Shr(
  value: number | bigint,
  shift: number | bigint,
): bigint {
  // A bigint shifted by a count below 64 shifts its 64 bits.
  if (typeof value === 'bigint') {
    const amount = wideShiftCount(shift)
    if (amount !== undefined) {
      return BigInt.asIntN(64, value) >> amount
    }
  }

  // Other operands are converted to their 64 bits first.
  return int64Result(int64Value(value) >> wideShiftAmount(shift))
}

// int64Bits and uint64Bits hold 1<<k for the counts k that keep the bit in
// 64 bits, the 64 masks of bit flags.
const int64Bits = Array.from({ length: 64 }, (_, k) =>
  BigInt.asIntN(64, 1n << BigInt(k)),
)
const uint64Bits = Array.from({ length: 64 }, (_, k) => 1n << BigInt(k))

// int64Bit returns int64(1) << shift, as for a bit flag mask 1<<f.
export function int64Bit(shift: number | bigint): bigint {
  // A count below 64 selects its bit, and other counts shift as usual.
  const bit = int64Bits[wideBitIndex(shift)]
  return bit !== undefined ? bit : int64Shl(1n, shift)
}

// uint64Bit returns uint64(1) << shift.
export function uint64Bit(shift: number | bigint): bigint {
  // A count below 64 selects its bit, and other counts shift as usual.
  const bit = uint64Bits[wideBitIndex(shift)]
  return bit !== undefined ? bit : uint64Shl(1n, shift)
}

// wideBitIndex returns the index of the bit table for a shift count, which
// is outside the table for counts of 64 or more and negative counts.
function wideBitIndex(shift: number | bigint): number {
  return (
    typeof shift === 'number' ? shift
    : shift >= 0n && shift < 64n ? Number(shift)
    : -1
  )
}

export function uintShr(
  value: number | bigint,
  shift: number | bigint,
  bits = 32,
): number {
  const width = Math.min(bits, 32)
  const amount = Math.trunc(Number(shift))
  if (amount < 0) {
    runtimePanic('runtime error: negative shift amount')
  }
  if (amount >= width) {
    return 0
  }
  return Number(uint(value, width)) >>> amount
}

// intAnd returns left & right for Go ints, which are numbers exact to 2^53.
// The JavaScript & keeps only 32 bits, so it applies only to two int32s.
export function intAnd(left: number, right: number): number {
  // Two int32s have the bits of the JavaScript operator.
  if ((left | 0) === left && (right | 0) === right) {
    return left & right
  }

  // Other ints combine their high and low words separately.
  const leftHigh = intHighWord(left)
  const rightHigh = intHighWord(right)
  const low = (left - leftHigh * 4294967296) & (right - rightHigh * 4294967296)
  return (leftHigh & rightHigh) * 4294967296 + (low >>> 0)
}

// intOr returns left | right for Go ints, as intAnd does for &.
export function intOr(left: number, right: number): number {
  // Two int32s have the bits of the JavaScript operator.
  if ((left | 0) === left && (right | 0) === right) {
    return left | right
  }

  // Other ints combine their high and low words separately.
  const leftHigh = intHighWord(left)
  const rightHigh = intHighWord(right)
  const low = (left - leftHigh * 4294967296) | (right - rightHigh * 4294967296)
  return (leftHigh | rightHigh) * 4294967296 + (low >>> 0)
}

// intXor returns left ^ right for Go ints, as intAnd does for &.
export function intXor(left: number, right: number): number {
  // Two int32s have the bits of the JavaScript operator.
  if ((left | 0) === left && (right | 0) === right) {
    return left ^ right
  }

  // Other ints combine their high and low words separately.
  const leftHigh = intHighWord(left)
  const rightHigh = intHighWord(right)
  const low = (left - leftHigh * 4294967296) ^ (right - rightHigh * 4294967296)
  return (leftHigh ^ rightHigh) * 4294967296 + (low >>> 0)
}

// intAndNot returns left &^ right for Go ints. The complement of an int is
// -right - 1, which is exact.
export function intAndNot(left: number, right: number): number {
  return intAnd(left, -right - 1)
}

// intHighWord returns the high 32-bit word of an int, the floor of the int
// over 2^32, whose low word is the int minus the high word times 2^32.
function intHighWord(value: number): number {
  return Math.floor(value / 4294967296)
}

// intShl returns value << count for Go ints. JavaScript's << keeps 32 bits and
// takes the count modulo 32, so it applies only to an int32 shifted by less
// than 32 that keeps all its bits.
export function intShl(value: number, count: number): number {
  // An int32 whose shift loses no bits is the JavaScript shift.
  if (count >= 0 && count < 32) {
    const shifted = value << count
    if (shifted >> count === value) {
      return shifted
    }
  }
  return intShlWide(value, count)
}

// intShlWide returns value << count for the ints and counts that intShl
// does not shift with the JavaScript operator.
function intShlWide(value: number, count: number): number {
  // A negative count panics, and a count of 64 or more shifts out all bits.
  if (count < 0) {
    runtimePanic('runtime error: negative shift amount')
  }
  if (count >= 64) {
    return 0
  }

  // The product is exact while it is a safe integer; past that the shift
  // wraps to 64 bits, as Go's does.
  const shifted = value * 2 ** count
  if (Number.isSafeInteger(shifted)) {
    return shifted
  }
  return Number(BigInt.asIntN(64, BigInt(value) << BigInt(count)))
}

// intShr returns value >> count for Go ints, as intShl does for <<.
export function intShr(value: number, count: number): number {
  // An int32 shifted by less than 32 is the JavaScript shift.
  if ((value | 0) === value && count >= 0 && count < 32) {
    return value >> count
  }

  // A negative count panics. Other shifts are the floor of the quotient by
  // 2^count, which is exact, and a count over 63 shifts as 63 does.
  if (count < 0) {
    runtimePanic('runtime error: negative shift amount')
  }
  return Math.floor(value / 2 ** Math.min(count, 63))
}

// narrowShl returns value << shift for Go integers of 32 bits or fewer, as
// an int32 that the caller wraps to the width of its type. Go shifts all bits
// out for a count of 32 or more, which the JavaScript operator takes modulo 32.
export function narrowShl(value: number, shift: number): number {
  return shift < 32 ? value << shift : 0
}

// narrowShr returns value >> shift for signed Go integers of 32 bits or
// fewer. A count of 32 or more fills the value with its sign bit, as a shift
// by 31 does, where the JavaScript operator takes the count modulo 32.
export function narrowShr(value: number, shift: number): number {
  return value >> (shift < 32 ? shift : 31)
}

export function uint64Mul(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // Two bigints keep 64 bits of the bigint result, which V8 compiles to a
  // 64-bit machine operation.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asUintN(64, left * right)
  }

  // Other operands are converted to their 64 bits first.
  return uint64Result(uint64Value(left) * uint64Value(right))
}

export function int64Mul(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // Two bigints keep 64 bits of the bigint result, which V8 compiles to a
  // 64-bit machine operation.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asIntN(64, left * right)
  }

  // Other operands are converted to their 64 bits first.
  return int64Result(int64Value(left) * int64Value(right))
}

export function uint64Div(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // Two bigints divide as their 64 bits, which V8 compiles to a 64-bit
  // machine operation.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    const divisor = BigInt.asUintN(64, right)
    if (divisor !== 0n) {
      return BigInt.asUintN(64, BigInt.asUintN(64, left) / divisor)
    }
  }

  // Other operands are converted to their 64 bits first.
  const divisor = uint64Value(right)
  if (divisor === 0n) {
    runtimePanic('runtime error: integer divide by zero')
  }
  return uint64Result(uint64Value(left) / divisor)
}

export function int64Div(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // Two bigints divide as their 64 bits, which V8 compiles to a 64-bit
  // machine operation.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    const divisor = BigInt.asIntN(64, right)
    if (divisor !== 0n) {
      return BigInt.asIntN(64, BigInt.asIntN(64, left) / divisor)
    }
  }

  // Other operands are converted to their 64 bits first.
  const divisor = int64Value(right)
  if (divisor === 0n) {
    runtimePanic('runtime error: integer divide by zero')
  }
  return int64Result(int64Value(left) / divisor)
}

export function uint64Mod(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // Two bigints divide as their 64 bits, which V8 compiles to a 64-bit
  // machine operation.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    const divisor = BigInt.asUintN(64, right)
    if (divisor !== 0n) {
      return BigInt.asUintN(64, BigInt.asUintN(64, left) % divisor)
    }
  }

  // Other operands are converted to their 64 bits first.
  const divisor = uint64Value(right)
  if (divisor === 0n) {
    runtimePanic('runtime error: integer divide by zero')
  }
  return uint64Result(uint64Value(left) % divisor)
}

export function int64Mod(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // Two bigints divide as their 64 bits, which V8 compiles to a 64-bit
  // machine operation.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    const divisor = BigInt.asIntN(64, right)
    if (divisor !== 0n) {
      return BigInt.asIntN(64, BigInt.asIntN(64, left) % divisor)
    }
  }

  // Other operands are converted to their 64 bits first.
  const divisor = int64Value(right)
  if (divisor === 0n) {
    runtimePanic('runtime error: integer divide by zero')
  }
  return int64Result(int64Value(left) % divisor)
}

export function uint64Add(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // Two bigints keep 64 bits of the bigint result, which V8 compiles to a
  // 64-bit machine operation.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asUintN(64, left + right)
  }

  // Other operands are converted to their 64 bits first.
  return uint64Result(uint64Value(left) + uint64Value(right))
}

export function int64Add(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // Two bigints keep 64 bits of the bigint result, which V8 compiles to a
  // 64-bit machine operation.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asIntN(64, left + right)
  }

  // Other operands are converted to their 64 bits first.
  return int64Result(int64Value(left) + int64Value(right))
}

export function uint64Sub(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // Two bigints keep 64 bits of the bigint result, which V8 compiles to a
  // 64-bit machine operation.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asUintN(64, left - right)
  }

  // Other operands are converted to their 64 bits first.
  return uint64Result(uint64Value(left) - uint64Value(right))
}

export function int64Sub(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // Two bigints keep 64 bits of the bigint result, which V8 compiles to a
  // 64-bit machine operation.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asIntN(64, left - right)
  }

  // Other operands are converted to their 64 bits first.
  return int64Result(int64Value(left) - int64Value(right))
}

export function uint64And(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // A bitwise operation of two bigints keeps 64 bits of the bigint result,
  // which are those of the operation of their 64 bits. BigInt.asIntN and
  // asUintN of 64 bits compile to 64-bit machine operations, unlike the
  // range checks of the results of other operations.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asUintN(64, left & right)
  }

  // Other operands are converted to their 64 bits first.
  return uint64Result(uint64Value(left) & uint64Value(right))
}

export function int64And(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // A bitwise operation of two bigints keeps 64 bits of the bigint result,
  // which are those of the operation of their 64 bits.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asIntN(64, left & right)
  }

  // Other operands are converted to their 64 bits first.
  return int64Result(int64Value(left) & int64Value(right))
}

export function uint64AndNot(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // A bitwise operation of two bigints keeps 64 bits of the bigint result,
  // which are those of the operation of their 64 bits.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asUintN(64, left & ~right)
  }

  // Other operands are converted to their 64 bits first.
  return uint64Result(uint64Value(left) & ~uint64Value(right))
}

export function int64AndNot(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // A bitwise operation of two bigints keeps 64 bits of the bigint result,
  // which are those of the operation of their 64 bits.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asIntN(64, left & ~right)
  }

  // Other operands are converted to their 64 bits first.
  return int64Result(int64Value(left) & ~int64Value(right))
}

export function uint64Or(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // A bitwise operation of two bigints keeps 64 bits of the bigint result,
  // which are those of the operation of their 64 bits.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asUintN(64, left | right)
  }

  // Other operands are converted to their 64 bits first.
  return uint64Result(uint64Value(left) | uint64Value(right))
}

export function int64Or(left: number | bigint, right: number | bigint): bigint {
  // A bitwise operation of two bigints keeps 64 bits of the bigint result,
  // which are those of the operation of their 64 bits.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asIntN(64, left | right)
  }

  // Other operands are converted to their 64 bits first.
  return int64Result(int64Value(left) | int64Value(right))
}

export function uint64Xor(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // A bitwise operation of two bigints keeps 64 bits of the bigint result,
  // which are those of the operation of their 64 bits.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asUintN(64, left ^ right)
  }

  // Other operands are converted to their 64 bits first.
  return uint64Result(uint64Value(left) ^ uint64Value(right))
}

export function int64Xor(
  left: number | bigint,
  right: number | bigint,
): bigint {
  // A bitwise operation of two bigints keeps 64 bits of the bigint result,
  // which are those of the operation of their 64 bits.
  if (typeof left === 'bigint' && typeof right === 'bigint') {
    return BigInt.asIntN(64, left ^ right)
  }

  // Other operands are converted to their 64 bits first.
  return int64Result(int64Value(left) ^ int64Value(right))
}

// The wideUint helpers compute the operations of uint and uintptr, which are
// numbers up to 2^53 - 1 and bigints above (see uint). Operands that are both
// numbers, with a result that is too, are computed as numbers, without
// converting them to bigints and back, which the uint64 helpers need.
const twoTo32 = 4294967296

export function wideUintAdd(left: number | bigint, right: number | bigint): number {
  // A sum of two numbers is exact up to 2^53 - 1, and a sum above rounds to at
  // least 2^53.
  if (typeof left === 'number' && typeof right === 'number') {
    const sum = left + right
    if (sum <= Number.MAX_SAFE_INTEGER) {
      return sum
    }
  }
  return uint(uint64Add(left, right), 64)
}

export function wideUintSub(left: number | bigint, right: number | bigint): number {
  // A difference of two numbers that is not negative is exact; a negative one
  // wraps around 2^64.
  if (typeof left === 'number' && typeof right === 'number' && left >= right) {
    return left - right
  }
  return uint(uint64Sub(left, right), 64)
}

export function wideUintMul(left: number | bigint, right: number | bigint): number {
  // A product of two numbers is exact up to 2^53 - 1, and a product above
  // rounds to at least 2^53.
  if (typeof left === 'number' && typeof right === 'number') {
    const product = left * right
    if (product <= Number.MAX_SAFE_INTEGER) {
      return product
    }
  }
  return uint(uint64Mul(left, right), 64)
}

export function wideUintDiv(left: number | bigint, right: number | bigint): number {
  // The remainder is exact, so left less it is a multiple of right whose
  // quotient is exact. Division by zero panics in uint64Div.
  if (typeof left === 'number' && typeof right === 'number' && right !== 0) {
    return (left - (left % right)) / right
  }
  return uint(uint64Div(left, right), 64)
}

export function wideUintMod(left: number | bigint, right: number | bigint): number {
  // The remainder of two numbers is exact.
  if (typeof left === 'number' && typeof right === 'number' && right !== 0) {
    return left % right
  }
  return uint(uint64Mod(left, right), 64)
}

export function wideUintAnd(left: number | bigint, right: number | bigint): number {
  // Numbers combine their low 32 bits with the bitwise operator, and their
  // high bits, below 2^21, by dividing.
  if (typeof left === 'number' && typeof right === 'number') {
    if (left <= 0xffffffff && right <= 0xffffffff) {
      return (left & right) >>> 0
    }
    const high = Math.floor(left / twoTo32) & Math.floor(right / twoTo32)
    return high * twoTo32 + ((left & right) >>> 0)
  }
  return uint(uint64And(left, right), 64)
}

export function wideUintAndNot(left: number | bigint, right: number | bigint): number {
  // Numbers combine their low and high bits as for wideUintAnd.
  if (typeof left === 'number' && typeof right === 'number') {
    if (left <= 0xffffffff && right <= 0xffffffff) {
      return (left & ~right) >>> 0
    }
    const high = Math.floor(left / twoTo32) & ~Math.floor(right / twoTo32)
    return high * twoTo32 + ((left & ~right) >>> 0)
  }
  return uint(uint64AndNot(left, right), 64)
}

export function wideUintOr(left: number | bigint, right: number | bigint): number {
  // Numbers combine their low and high bits as for wideUintAnd.
  if (typeof left === 'number' && typeof right === 'number') {
    if (left <= 0xffffffff && right <= 0xffffffff) {
      return (left | right) >>> 0
    }
    const high = Math.floor(left / twoTo32) | Math.floor(right / twoTo32)
    return high * twoTo32 + ((left | right) >>> 0)
  }
  return uint(uint64Or(left, right), 64)
}

export function wideUintXor(left: number | bigint, right: number | bigint): number {
  // Numbers combine their low and high bits as for wideUintAnd.
  if (typeof left === 'number' && typeof right === 'number') {
    if (left <= 0xffffffff && right <= 0xffffffff) {
      return (left ^ right) >>> 0
    }
    const high = Math.floor(left / twoTo32) ^ Math.floor(right / twoTo32)
    return high * twoTo32 + ((left ^ right) >>> 0)
  }
  return uint(uint64Xor(left, right), 64)
}

export function wideUintShl(value: number | bigint, shift: number | bigint): number {
  // A number shifted by a count below 53 multiplies by a power of two, which
  // is exact up to 2^53 - 1, and rounds to at least 2^53 above.
  if (typeof value === 'number' && typeof shift === 'number' && shift >= 0 && shift < 53) {
    const shifted = value * 2 ** shift
    if (shifted <= Number.MAX_SAFE_INTEGER) {
      return shifted
    }
  }
  return uint(uint64Shl(value, shift), 64)
}

export function wideUintShr(value: number | bigint, shift: number | bigint): number {
  // A number below 2^53 shifted right by 53 or more is zero, a 32-bit number
  // shifts with the operator, and a larger one divides by a power of two.
  if (typeof value === 'number' && typeof shift === 'number' && shift >= 0) {
    if (shift >= 53) {
      return 0
    }
    if (value <= 0xffffffff && shift < 32) {
      return value >>> shift
    }
    return Math.floor(value / 2 ** shift)
  }
  return uint(uint64Shr(value, shift), 64)
}

function int64Value(value: number | bigint): bigint {
  if (typeof value === 'bigint') {
    if (value >= -0x8000000000000000n && value <= 0x7fffffffffffffffn) {
      return value
    }
    return BigInt.asIntN(64, value)
  }
  if (Number.isFinite(value)) {
    const truncated = Math.trunc(value)
    if (
      truncated >= Number.MIN_SAFE_INTEGER &&
      truncated <= Number.MAX_SAFE_INTEGER
    ) {
      return BigInt(truncated)
    }
  }
  return BigInt.asIntN(64, BigInt(Math.trunc(value)))
}

function int64Result(value: bigint): bigint {
  if (value >= -0x8000000000000000n && value <= 0x7fffffffffffffffn) {
    return value
  }
  return BigInt.asIntN(64, value)
}

function uint64Value(value: number | bigint): bigint {
  if (typeof value === 'bigint') {
    if (value >= 0n && value <= maxUint64BigInt) {
      return value
    }
    return BigInt.asUintN(64, value)
  }
  if (Number.isFinite(value)) {
    const truncated = Math.trunc(value)
    if (truncated >= 0 && truncated <= Number.MAX_SAFE_INTEGER) {
      return BigInt(truncated)
    }
  }
  return BigInt.asUintN(64, BigInt(Math.trunc(value)))
}

function uint64Result(value: bigint): bigint {
  if (value >= 0n && value <= maxUint64BigInt) {
    return value
  }
  return BigInt.asUintN(64, value)
}

/**
 * normalizeBytes preserves byte arrays and converts number arrays or data fields.
 * Null inputs produce an empty byte array; unsupported inputs throw.
 */
export function normalizeBytes(
  bytes:
    | TypedSlice
    | number[]
    | SliceProxy<number>
    | null
    | undefined
    | { data: number[] },
): Uint8Array {
  // Nil is empty, and a byte array is kept as it is.
  if (bytes === null || bytes === undefined) {
    return new Uint8Array(0)
  }
  if (bytes instanceof Uint8Array) {
    return bytes
  }
  if (isTypedSlice(bytes)) {
    return new Uint8Array(bytes)
  }

  // An object with a data array copies the data.
  if (
    bytes &&
    typeof bytes === 'object' &&
    'data' in bytes &&
    isArrayOrGoSlice(bytes.data)
  ) {
    return new Uint8Array(bytes.data)
  }

  // An array or a window copies its elements.
  if (Array.isArray(bytes)) {
    return new Uint8Array(bytes)
  }
  if (bytes instanceof GoSlice) {
    return new Uint8Array(bytes.window())
  }

  // Nothing else holds bytes.
  throw new Error(`Cannot normalize bytes of type ${typeof bytes}: ${bytes}`)
}

/**
 * sortSlice sorts the current backing window in ascending order.
 */
export function sortSlice<T extends string | number | bigint>(
  s: Slice<T>,
): void {
  if (s === null || s === undefined) {
    return
  }

  // SliceProxy targets are arrays too, so handle metadata-backed slices before
  // the plain Array path. Sorting the sparse proxy target would leave backing
  // storage unchanged.
  if (isSliceProxy(s)) {
    const proxy = s as SliceProxy<T>
    const meta = proxy.__meta__
    const section = meta.backing.slice(meta.offset, meta.offset + meta.length)
    section.sort(ascendingOrdered)
    for (let i = 0; i < section.length; i++) {
      meta.backing[meta.offset + i] = section[i]
    }
    return
  }

  if (isArrayOrGoSlice(s)) {
    s.sort(ascendingOrdered)
    return
  }

  if (s instanceof Uint8Array) {
    s.sort()
    return
  }
}

// ascendingOrdered compares two ordered values for an ascending sort. Numbers
// and bigints order numerically (the default Array.sort would order them
// lexically by string form); strings order lexically.
function ascendingOrdered<T extends string | number | bigint>(
  a: T,
  b: T,
): number {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

/**
 * bytesEqual compares byte values across slice representations.
 */
export function bytesEqual(a: Bytes | null, b: Bytes | null): boolean {
  if (a === b) return true

  const aLen = a === null ? 0 : bytesLen(a)
  const bLen = b === null ? 0 : bytesLen(b)
  if (aLen !== bLen) return false
  if (aLen === 0) return true

  for (let i = 0; i < aLen; i++) {
    if (byteAt(a as ByteData, i) !== byteAt(b as ByteData, i)) return false
  }

  return true
}

/**
 * bytesCompare compares two byte slices lexicographically.
 * Returns -1 if a < b, 0 if a == b, +1 if a > b.
 */
export function bytesCompare(a: Bytes | null, b: Bytes | null): number {
  if (a === null && b === null) return 0
  if (a === null) return -1
  if (b === null) return 1

  const aLen = bytesLen(a)
  const bLen = bytesLen(b)
  const minLen = Math.min(aLen, bLen)

  for (let i = 0; i < minLen; i++) {
    const av = byteAt(a, i)
    const bv = byteAt(b, i)
    if (av < bv) return -1
    if (av > bv) return 1
  }

  if (aLen < bLen) return -1
  if (aLen > bLen) return 1
  return 0
}

function bytesLen(bytes: ByteData): number {
  if (isTypedSlice(bytes)) {
    return bytes.length
  }
  if (isSliceProxy(bytes)) {
    return (bytes as SliceProxy<number>).__meta__.length
  }
  return bytes.length
}

function byteAt(bytes: ByteData, index: number): number {
  if (isTypedSlice(bytes) || Array.isArray(bytes)) {
    return bytes[index] ?? 0
  }
  const meta = (bytes as SliceProxy<number>).__meta__
  return meta.backing[meta.offset + index] ?? 0
}

/**
 * bytesToArray converts any Bytes representation to a number array.
 */
export function bytesToArray(bytes: Bytes | null): number[] {
  bytes = bytesValue(bytes) as Bytes | null
  if (bytes === null) return []

  if (isTypedSlice(bytes)) {
    return Array.from(bytes)
  }

  if (isSliceProxy(bytes)) {
    const proxy = bytes as SliceProxy<number>
    const meta = proxy.__meta__
    return meta.backing.slice(meta.offset, meta.offset + meta.length)
  }

  if (isArrayOrGoSlice(bytes)) {
    return bytes
  }

  throw new Error(`Cannot convert bytes of type ${typeof bytes} to array`)
}

/**
 * bytesToUint8Array converts any Bytes representation to a Uint8Array.
 */
export function bytesToUint8Array(bytes: Bytes | null): Uint8Array {
  bytes = bytesValue(bytes) as Bytes | null
  if (bytes === null) return new Uint8Array(0)

  if (bytes instanceof Uint8Array) {
    if ((bytes as Uint8Array & { __meta__?: unknown }).__meta__ !== undefined) {
      return bytes.subarray(0)
    }
    return bytes
  }

  return new Uint8Array(bytesToArray(bytes))
}

function bytesValue(value: unknown): unknown {
  if (isVarRef(value)) {
    return bytesValue(value.value)
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { __goType?: unknown }).__goType === 'string' &&
    '__goValue' in value
  ) {
    return bytesValue((value as { __goValue: unknown }).__goValue)
  }
  return value
}

// ByteView is a window of bytes in a backing array, which the byte search
// functions read in place instead of copying the bytes to an array.
interface ByteView {
  data: ArrayLike<number>
  off: number
  len: number
}

const emptyByteView: ByteView = { data: [], off: 0, len: 0 }

// byteView returns the view of the given bytes, without copying them.
function byteView(bytes: Bytes | null): ByteView {
  // A slice of a named byte type is read as its bytes.
  bytes = bytesValue(bytes) as Bytes | null
  if (bytes === null) return emptyByteView
  if (bytes instanceof Uint8Array) {
    return { data: bytes, off: 0, len: bytes.length }
  }
  if (isSliceProxy(bytes)) {
    const meta = (bytes as SliceProxy<number>).__meta__
    return { data: meta.backing, off: meta.offset, len: meta.length }
  }
  if (Array.isArray(bytes)) {
    return { data: bytes, off: 0, len: bytes.length }
  }
  throw new Error(`Cannot convert bytes of type ${typeof bytes} to array`)
}

// byteViewMatches reports whether the needle occurs in the haystack at the
// given position, which must leave room for the whole needle.
function byteViewMatches(h: ByteView, pos: number, n: ByteView): boolean {
  // The backing arrays are read directly.
  const hd = h.data
  const nd = n.data
  const ho = h.off + pos
  for (let j = 0; j < n.len; j++) {
    if (hd[ho + j] !== nd[n.off + j]) {
      return false
    }
  }
  return true
}

/**
 * bytesIndexOf finds the first occurrence of subslice in bytes.
 * Returns -1 if not found.
 */
export function bytesIndexOf(
  bytes: Bytes | null,
  subslice: Bytes | null,
): number {
  if (bytes === null || subslice === null) return -1

  // The search reads both byte sequences in place.
  const haystack = byteView(bytes)
  const needle = byteView(subslice)

  // An empty needle matches at the start, and a single byte has a fast path.
  if (needle.len === 0) return 0
  if (needle.len > haystack.len) return -1
  if (needle.len === 1) {
    return bytesIndexByteView(haystack, needle.data[needle.off])
  }

  // A position is tried only when its first byte matches.
  const first = needle.data[needle.off]
  const hd = haystack.data
  for (let i = 0; i <= haystack.len - needle.len; i++) {
    if (
      hd[haystack.off + i] === first &&
      byteViewMatches(haystack, i, needle)
    ) {
      return i
    }
  }

  return -1
}

/**
 * bytesLastIndexOf finds the last occurrence of subslice in bytes.
 * Returns -1 if not found.
 */
export function bytesLastIndexOf(
  bytes: Bytes | null,
  subslice: Bytes | null,
): number {
  if (bytes === null || subslice === null) return -1

  // The search reads both byte sequences in place.
  const haystack = byteView(bytes)
  const needle = byteView(subslice)

  // An empty needle matches at the end.
  if (needle.len === 0) return haystack.len
  if (needle.len > haystack.len) return -1

  // The last match is the first one found scanning backwards.
  for (let i = haystack.len - needle.len; i >= 0; i--) {
    if (byteViewMatches(haystack, i, needle)) return i
  }

  return -1
}

// bytesIndexByteView returns the index of the first byte c in the view.
function bytesIndexByteView(v: ByteView, c: number): number {
  // A Uint8Array is searched natively.
  const d = v.data
  if (d instanceof Uint8Array) {
    return d.subarray(v.off, v.off + v.len).indexOf(c)
  }

  // Any other backing array is scanned.
  const end = v.off + v.len
  for (let i = v.off; i < end; i++) {
    if (d[i] === c) return i - v.off
  }
  return -1
}

/**
 * bytesIndexByte finds the first occurrence of byte c in bytes.
 * Returns -1 if not found.
 */
export function bytesIndexByte(bytes: Bytes | null, c: number): number {
  if (bytes === null) return -1
  return bytesIndexByteView(byteView(bytes), c)
}

/**
 * bytesLastIndexByte finds the last occurrence of byte c in bytes.
 * Returns -1 if not found.
 */
export function bytesLastIndexByte(bytes: Bytes | null, c: number): number {
  if (bytes === null) return -1

  // The backing array is scanned from the end of the window.
  const v = byteView(bytes)
  const d = v.data
  for (let i = v.off + v.len - 1; i >= v.off; i--) {
    if (d[i] === c) return i - v.off
  }
  return -1
}

/**
 * bytesCount counts non-overlapping instances of sep in bytes.
 */
export function bytesCount(bytes: Bytes | null, sep: Bytes | null): number {
  if (bytes === null || sep === null) return 0

  // The search reads both byte sequences in place.
  const haystack = byteView(bytes)
  const needle = byteView(sep)

  // An empty separator counts the positions between bytes.
  if (needle.len === 0) {
    // Empty separators count byte positions, including both ends.
    return haystack.len + 1
  }

  // Matches do not overlap, so the scan skips past each one.
  let count = 0
  let pos = 0
  while (pos <= haystack.len - needle.len) {
    if (byteViewMatches(haystack, pos, needle)) {
      count++
      pos += needle.len
    } else {
      pos++
    }
  }

  return count
}

// min Math functions needed by various packages. Generic over number and bigint so
// the Go builtins min/max work for int64/uint64 operands as well; number keeps
// Math.min/Math.max NaN semantics.
export function min<T extends number | bigint>(a: T, b: T): T {
  // Check both operands: Math.min throws on any bigint argument, so a mixed
  // number/bigint pair (from inconsistent int64/uint64 lowering of the same Go
  // type) must take the relational path. JS relational operators compare bigint
  // and number across types, and integers have no NaN to preserve.
  if (typeof a === 'bigint' || typeof b === 'bigint') {
    return (a as bigint) < (b as bigint) ? a : b
  }
  return Math.min(a as number, b as number) as T
}

export function max<T extends number | bigint>(a: T, b: T): T {
  // See min: route any bigint operand through relational comparison; keep
  // Math.max only for the pure-number case so Go float NaN semantics survive.
  if (typeof a === 'bigint' || typeof b === 'bigint') {
    return (a as bigint) > (b as bigint) ? a : b
  }
  return Math.max(a as number, b as number) as T
}

/**
 * runeOrStringToString preserves strings and encodes numeric Unicode scalars.
 */
export function runeOrStringToString(runeOrString: number | string): string {
  if (typeof runeOrString === 'string') {
    return runeOrString
  }
  return runeToString(runeOrString)
}

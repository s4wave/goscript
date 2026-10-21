import { Method, ReflectValue, StructField, ValueError } from './types.js'
export { StructField }
import { MapIter } from './map.js'
import {
  getTypeByName as builtinGetTypeByName,
  isStructTypeInfo,
  isInterfaceTypeInfo,
  structFieldRuntimeKey,
} from '../builtin/type.js'
import { Zero } from './value.js'
import { valueSeq, valueSeq2 } from './iter.js'
import type * as iter from '@goscript/iter/index.js'
import * as $ from '../builtin/index.js'

// rtype is the common implementation of most values.
export class rtype {
  constructor(public kind: Kind) {}

  Kind(): Kind {
    return this.kind
  }

  String(): string {
    return Kind_String(this.kind)
  }

  Pointers(): boolean {
    const k = this.kind
    return k === Ptr || k === Map || k === Slice || k === Interface
  }
}

// funcType represents a function type.
export class funcType extends rtype {
  constructor(
    kind: Kind,
    public inCount: number = 0,
    public outCount: number = 0,
  ) {
    super(kind)
  }
}

// flag type for internal use.
export class flag {
  constructor(private _value: number | Kind) {
    if (typeof _value === 'number') {
      this._value = _value
    } else {
      this._value = _value
    }
  }

  valueOf(): number {
    return typeof this._value === 'number' ? this._value : this._value
  }

  static from(value: number | Kind): flag {
    return new flag(value)
  }
}

// bitVector class for tracking pointers.
export class bitVector {
  private bits: number[] = []

  Set(index: number): void {
    const wordIndex = Math.floor(index / 32)
    const bitIndex = index % 32
    while (this.bits.length <= wordIndex) {
      this.bits.push(0)
    }
    this.bits[wordIndex] |= 1 << bitIndex
  }

  Get(index: number): boolean {
    const wordIndex = Math.floor(index / 32)
    const bitIndex = index % 32
    if (wordIndex >= this.bits.length) {
      return false
    }
    return (this.bits[wordIndex] & (1 << bitIndex)) !== 0
  }
}

// Kind represents the specific kind of type that a Type represents.
export type Kind = number

// Kind_String returns the string representation of a Kind (wrapper function naming).
export function Kind_String(k: Kind): string {
  const kindNames = [
    'invalid',
    'bool',
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
    'array',
    'chan',
    'func',
    'interface',
    'map',
    'ptr',
    'slice',
    'string',
    'struct',
    'unsafe.Pointer',
  ]
  if (k >= 0 && k < kindNames.length) {
    return kindNames[k]
  }
  return 'invalid'
}

// ChanDir Channel direction constants and type.
export type ChanDir = number

export const RecvDir: ChanDir = 1
export const SendDir: ChanDir = 2
export const BothDir: ChanDir = 3

export function ChanDir_String(d: ChanDir): string {
  switch (d) {
    case RecvDir:
      return '<-chan'
    case SendDir:
      return 'chan<-'
    case BothDir:
      return 'chan'
    default:
      return 'ChanDir' + d
  }
}

// Invalid Kind constants.
export const Invalid: Kind = 0
export const Bool: Kind = 1
export const Int: Kind = 2
export const Int8: Kind = 3
export const Int16: Kind = 4
export const Int32: Kind = 5
export const Int64: Kind = 6
export const Uint: Kind = 7
export const Uint8: Kind = 8
export const Uint16: Kind = 9
export const Uint32: Kind = 10
export const Uint64: Kind = 11
export const Uintptr: Kind = 12
export const Float32: Kind = 13
export const Float64: Kind = 14
export const Complex64: Kind = 15
export const Complex128: Kind = 16
export const Array: Kind = 17
export const Chan: Kind = 18
export const Func: Kind = 19
export const Interface: Kind = 20
export const Map: Kind = 21
export const Ptr: Kind = 22
export const Pointer: Kind = Ptr
export const Slice: Kind = 23
export const String: Kind = 24
export const Struct: Kind = 25
export const UnsafePointer: Kind = 26

// typedSliceHints names, by element kind, the typed arrays that hold slices
// of fixed-size numeric elements, with the type hints of the compiler.
const typedSliceHints: Partial<Record<Kind, string>> = {
  [Uint8]: 'byte',
  [Int8]: 'int8',
  [Int16]: 'int16',
  [Uint16]: 'uint16',
  [Int32]: 'int32',
  [Uint32]: 'uint32',
  [Float32]: 'float32',
  [Float64]: 'float64',
}

/**
 * sliceTypeHint returns the type hint of the typed array that holds slices of
 * elements of type elem, for $.makeSlice, or undefined for elements held in
 * plain arrays.
 */
export function sliceTypeHint(elem: Type): string | undefined {
  return typedSliceHints[elem.Kind()]
}

/**
 * sliceAppendHint returns the trailing hint of $.append and $.appendSlice
 * that keeps a slice of elements of type elem in its typed array, or
 * undefined for elements held in plain arrays.
 */
export function sliceAppendHint(
  elem: Type,
): typeof $.byteSliceHint | $.TypedSliceHint | undefined {
  const hint = sliceTypeHint(elem)
  if (hint === undefined) {
    return undefined
  }
  if (hint === 'byte') {
    return $.byteSliceHint
  }
  return $.typedSliceHints[hint as keyof typeof $.typedSliceHints]
}

const canonicalTypes = new globalThis.Map<string, Type>()
const constructingRegisteredTypes = new globalThis.Map<string, Type>()

// isIntegerKind reports whether k is a signed or unsigned integer kind.
function isIntegerKind(k: Kind): boolean {
  return k >= Int && k <= Uintptr
}

// isFloatKind reports whether k is a floating-point kind.
function isFloatKind(k: Kind): boolean {
  return k === Float32 || k === Float64
}

// convertInteger converts the numeric value x to integer kind k as a Go
// conversion does, truncating a float toward zero and wrapping to k's width.
function convertInteger(x: number | bigint, k: Kind): number | bigint {
  switch (k) {
    case Int8:
      return $.int(x, 8)
    case Int16:
      return $.int(x, 16)
    case Int32:
      return $.int(x, 32)
    case Int:
      return $.int(x, 64)
    case Int64:
      return $.int64(x)
    case Uint8:
      return $.uint(x, 8)
    case Uint16:
      return $.uint(x, 16)
    case Uint32:
      return $.uint(x, 32)
    case Uint64:
      return $.uint64(x)
    default:
      // Uint and Uintptr.
      return $.uint(x, 64)
  }
}

// convertValue converts the raw value x of type ft to the representation
// of type t, for Value.Convert.
function convertValue(x: ReflectValue, ft: Type, t: Type): ReflectValue {
  // Numbers change representation and width; an integer becomes a rune.
  const from = ft.Kind()
  const to = t.Kind()
  const numeric = typeof x === 'number' || typeof x === 'bigint'
  if (numeric && (isIntegerKind(from) || isFloatKind(from))) {
    if (isIntegerKind(to)) {
      return convertInteger(x, to)
    }
    if (to === Float32) {
      return $.float32(x)
    }
    if (to === Float64) {
      return Number(x)
    }
    if (to === String && isIntegerKind(from)) {
      return $.runeToString(x)
    }
  }

  // Strings convert to and from byte and rune slices.
  if (from === String && typeof x === 'string' && to === Slice) {
    if (t.Elem().Kind() === Uint8) {
      return $.stringToBytes(x)
    }
    if (t.Elem().Kind() === Int32) {
      return $.arrayToSlice($.stringToRunes(x))
    }
  }
  if (from === Slice && to === String) {
    if (x === null) {
      return ''
    }
    if (ft.Elem().Kind() === Int32) {
      return $.runesToString(x as $.Slice<number>)
    }
    return $.bytesToString(x as $.Slice<number>)
  }

  // Every other conversion keeps the representation.
  return x
}

function internType(t: Type): Type {
  const key = typeIdentityKey(t)
  $.markReflectTypeIdentity(t, key)
  const existing = canonicalTypes.get(key)
  if (existing) {
    $.markReflectTypeIdentity(existing, key)
    mergeTypeMetadata(existing, t)
    return existing
  }
  canonicalTypes.set(key, t)
  return t
}

function mergeTypeMetadata(target: Type, source: Type): void {
  if (target instanceof BasicType && source instanceof BasicType) {
    target.mergeMethodSignatures(source.methodSignatures())
    return
  }
  if (target instanceof PointerType && source instanceof PointerType) {
    target.mergeMethodSignatures(source.methodSignatures())
    return
  }
  if (target instanceof FunctionType && source instanceof FunctionType) {
    target.mergeSignature(source)
    target.mergeMethodSignatures(source.methodSignatures())
  }
}

// typeIdentityKey returns a key that two types share exactly when they are
// identical in Go.
export function typeIdentityKey(t: Type, seen = new Set<Type>()): string {
  if (seen.has(t)) {
    return `${t.Kind()}:${t.PkgPath()}:${t.Name()}:${runtimeTypeString(t)}`
  }
  seen.add(t)
  if (t instanceof StructType) {
    return t.identityKey(seen)
  }
  switch (t.Kind()) {
    case Array:
      return `${t.Kind()}:${t.Len()}:${typeIdentityKey(t.Elem(), seen)}`
    case Chan:
    case Ptr:
    case Slice:
      return `${t.Kind()}:${runtimeTypeString(t)}:${typeIdentityKey(t.Elem(), seen)}`
    case Map:
      return `${t.Kind()}:${typeIdentityKey(t.Key(), seen)}:${typeIdentityKey(t.Elem(), seen)}`
    case Func: {
      if (t.Name() !== '') {
        return `${t.Kind()}:named:${t.PkgPath()}:${t.Name()}`
      }
      const params = globalThis.Array.from(
        { length: t.NumIn() },
        (_unused, idx) => typeIdentityKey(t.In(idx), seen),
      )
      const results = globalThis.Array.from(
        { length: t.NumOut() },
        (_unused, idx) => typeIdentityKey(t.Out(idx), seen),
      )
      return `${t.Kind()}:${t.PkgPath()}:${t.Name()}:${runtimeTypeString(t)}:${t.IsVariadic()}:${params.join(',')}:${results.join(',')}`
    }
    default:
      return `${t.Kind()}:${t.PkgPath()}:${t.Name()}:${runtimeTypeString(t)}`
  }
}

function typeUnderlyingIdentityKey(t: Type, seen = new Set<Type>()): string {
  if (seen.has(t)) {
    return `${t.Kind()}:${t.PkgPath()}:${t.Name()}:${runtimeTypeString(t)}`
  }
  seen.add(t)
  if (t instanceof BasicType) {
    return `basic:${t.underlyingName()}`
  }
  if (t instanceof StructType) {
    return t.underlyingIdentityKey(seen)
  }
  switch (t.Kind()) {
    case Array:
      return `array:${t.Len()}:${typeIdentityKey(t.Elem(), seen)}`
    case Chan:
      return `chan:${runtimeTypeString(t)}:${typeIdentityKey(t.Elem(), seen)}`
    case Ptr:
      return `ptr:${typeIdentityKey(t.Elem(), seen)}`
    case Slice:
      return `slice:${typeIdentityKey(t.Elem(), seen)}`
    case Map:
      return `map:${typeIdentityKey(t.Key(), seen)}:${typeIdentityKey(
        t.Elem(),
        seen,
      )}`
    case Func: {
      const params = globalThis.Array.from(
        { length: t.NumIn() },
        (_unused, idx) => typeIdentityKey(t.In(idx), seen),
      )
      const results = globalThis.Array.from(
        { length: t.NumOut() },
        (_unused, idx) => typeIdentityKey(t.Out(idx), seen),
      )
      return `func:${t.IsVariadic()}:${params.join(',')}:${results.join(',')}`
    }
    case Interface:
      return `interface:${typeMethods(t).map(methodSignatureIdentityKey).join('|')}`
    default:
      return `${t.Kind()}:${t.PkgPath()}:${t.Name()}:${runtimeTypeString(t)}`
  }
}

// isInterfaceLiteral reports whether name spells an unnamed interface type.
function isInterfaceLiteral(name: string): boolean {
  return name === 'interface{}' || name.startsWith('interface {')
}

function typeIsNamed(t: Type): boolean {
  if (t.Kind() === Interface) {
    return !isInterfaceLiteral(runtimeTypeString(t))
  }
  if (t.Kind() === Struct || t.Kind() === Func) {
    return t.Name() !== ''
  }
  if (t instanceof BasicType) {
    return t.Kind() !== Invalid && t.Name() !== ''
  }
  return t.Name() !== ''
}

// Type is the representation of a Go type.
export interface Type {
  // String returns a string representation of the type.
  String(): string

  // Kind returns the specific kind of this type.
  Kind(): Kind

  // Size returns the number of bytes needed to store a value of the given type.
  Size(): number

  // Elem returns a type's element type.
  // Panics if the type's Kind is not Array, Chan, Map, Pointer, or Slice.
  Elem(): Type

  // NumField returns a struct type's field count.
  NumField(): number

  // NumIn returns a function type's input count.
  // Panics if the type's Kind is not Func.
  NumIn(): number

  // In returns a function type's i'th input type.
  // Panics if the type's Kind is not Func or i is out of range.
  In(i: number): Type

  // NumOut returns a function type's output count.
  // Panics if the type's Kind is not Func.
  NumOut(): number

  // Out returns a function type's i'th output type.
  // Panics if the type's Kind is not Func or i is out of range.
  Out(i: number): Type

  // IsVariadic reports whether a function type's final input is variadic.
  // Panics if the type's Kind is not Func.
  IsVariadic(): boolean

  // PkgPath returns the package path for named types, empty for unnamed types.
  PkgPath(): string

  // Field returns a struct type's i'th field.
  // Panics if the type's Kind is not Struct or i is out of range.
  Field(i: number): StructField

  // FieldByIndex returns the nested field corresponding to index.
  // Panics if the type's Kind is not Struct.
  FieldByIndex(index: $.Slice<number>): StructField

  // FieldByName returns the struct field with the given name.
  FieldByName(name: string): [StructField, boolean]

  // FieldByNameFunc returns the first struct field whose name satisfies match.
  FieldByNameFunc(match: (name: string) => boolean): [StructField, boolean]

  // Key returns a map type's key type.
  // Panics if the type's Kind is not Map.
  Key(): Type

  // Name returns the type's name within its package.
  Name(): string

  // Implements reports whether the type implements the interface type u.
  Implements(u: Type | null): boolean

  // AssignableTo reports whether a value of this type is assignable to u.
  AssignableTo(u: Type | null): boolean

  // ConvertibleTo reports whether the Go conversion rules permit conversion to u.
  ConvertibleTo(u: Type | null): boolean

  // common returns the common type implementation.
  common?(): rtype

  // OverflowInt reports whether the int64 x cannot be represented by the type
  // Panics if the type's Kind is not Int, Int8, Int16, Int32, or Int64.
  OverflowInt(x: bigint): boolean

  // OverflowUint reports whether the uint64 x cannot be represented by the type
  // Panics if the type's Kind is not Uint, Uint8, Uint16, Uint32, Uint64, or Uintptr.
  OverflowUint(x: bigint): boolean

  // OverflowFloat reports whether the float64 x cannot be represented by the type
  // Panics if the type's Kind is not Float32 or Float64.
  OverflowFloat(x: number): boolean

  // NumMethod returns the number of methods in the type's method set
  NumMethod(): number

  // Method returns the i'th method in the type's method set.
  Method(i: number): Method

  // MethodByName returns the method with that name in the type's method set.
  MethodByName(name: string): [Method, boolean]

  // Len returns an array type's length.
  // Panics if the type's Kind is not Array.
  Len(): number

  // Bits returns the size of the type in bits
  // Panics if the type's Kind is not a sized type.
  Bits(): number

  // Comparable reports whether values of this type are comparable.
  Comparable(): boolean

  // runtimeString returns the runtime type string (see runtimeTypeString).
  runtimeString?(): string

  // ChanDir returns a channel type's direction.
  // Panics if the type's Kind is not Chan.
  ChanDir(): ChanDir

  // CanSeq reports whether a Value with this type can be iterated over
  // using Value.Seq.
  CanSeq(): boolean

  // CanSeq2 reports whether a Value with this type can be iterated over
  // using Value.Seq2.
  CanSeq2(): boolean
}

// nonChanTypePanic panics for ChanDir on a type that is not a channel.
function nonChanTypePanic(t: Type): never {
  throw new Error(`reflect: ChanDir of non-chan type ${t.String()}`)
}

// canRangeFunc reports whether t is a func(yield func(...) bool) type
// whose yield function takes n arguments, as used by range over func.
function canRangeFunc(t: Type, n: number): boolean {
  if (t.Kind() !== Func || t.NumIn() !== 1 || t.NumOut() !== 0) {
    return false
  }
  const y = t.In(0)
  return (
    y.Kind() === Func &&
    y.NumIn() === n &&
    y.NumOut() === 1 &&
    y.Out(0).Kind() === Bool
  )
}

// typeCanSeq implements Type.CanSeq.
function typeCanSeq(t: Type): boolean {
  switch (t.Kind()) {
    case Int:
    case Int8:
    case Int16:
    case Int32:
    case Int64:
    case Uint:
    case Uint8:
    case Uint16:
    case Uint32:
    case Uint64:
    case Uintptr:
    case Array:
    case Slice:
    case Chan:
    case String:
    case Map:
      return true
    case Func:
      return canRangeFunc(t, 1)
    case Ptr:
      return t.Elem().Kind() === Array
  }
  return false
}

// typeCanSeq2 implements Type.CanSeq2.
function typeCanSeq2(t: Type): boolean {
  switch (t.Kind()) {
    case Array:
    case Slice:
    case String:
    case Map:
      return true
    case Func:
      return canRangeFunc(t, 2)
    case Ptr:
      return t.Elem().Kind() === Array
  }
  return false
}

function nonFunctionTypePanic(method: string, t: Type): never {
  throw new Error(`reflect: ${method} of non-func type ${t.String()}`)
}

// typeFieldByIndex implements Type.FieldByIndex as in Go: each index after
// the first selects a field of the previous field's type, following a
// pointer to a struct.
function typeFieldByIndex(t: Type, index: $.Slice<number>): StructField {
  let typ = t
  let field = new StructField({ Type: t })
  for (let i = 0; i < $.len(index); i++) {
    if (i > 0) {
      typ = field.Type!
      if (typ.Kind() === Ptr && typ.Elem().Kind() === Struct) {
        typ = typ.Elem()
      }
    }
    field = typ.Field($.index(index, i))
  }
  return field
}

// InvalidTypeClass is the type of an invalid, zero reflect.Value.
class InvalidTypeClass implements Type {
  Kind(): Kind {
    return Invalid
  }
  Comparable(): boolean {
    return false
  }
  String(): string {
    return '<invalid reflect.Value>'
  }
  Name(): string {
    return ''
  }
  PkgPath(): string {
    return ''
  }
  Size(): number {
    return 0
  }
  Elem(): Type {
    throw new Error('reflect: Elem of invalid type')
  }
  Key(): Type {
    throw new Error('reflect: Key of invalid type')
  }
  NumField(): number {
    return 0
  }
  NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }
  In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }
  NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }
  Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }
  IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }
  Field(_i: number): StructField {
    throw new Error('reflect: Field of invalid type')
  }
  FieldByIndex(index: $.Slice<number>): StructField {
    return typeFieldByIndex(this, index)
  }
  FieldByName(_name: string): [StructField, boolean] {
    return [new StructField(), false]
  }
  FieldByNameFunc(_match: (name: string) => boolean): [StructField, boolean] {
    return [new StructField(), false]
  }
  Implements(_u: Type | null): boolean {
    return false
  }
  ConvertibleTo(u: Type | null): boolean {
    return typeConvertibleTo(this, u)
  }

  AssignableTo(_u: Type | null): boolean {
    return false
  }
  OverflowInt(_x: bigint): boolean {
    throw new Error('reflect: OverflowInt of invalid type')
  }
  OverflowUint(_x: bigint): boolean {
    throw new Error('reflect: OverflowUint of invalid type')
  }
  OverflowFloat(_x: number): boolean {
    throw new Error('reflect: OverflowFloat of invalid type')
  }
  NumMethod(): number {
    return 0
  }
  Method(i: number): Method {
    return typeMethod(this, i)
  }
  MethodByName(_name: string): [Method, boolean] {
    return [zeroMethod(), false]
  }
  Len(): number {
    throw new Error('reflect: Len of invalid type')
  }
  Bits(): number {
    throw new Error('reflect: Bits of invalid type')
  }

  public ChanDir(): ChanDir {
    return nonChanTypePanic(this)
  }

  public CanSeq(): boolean {
    return typeCanSeq(this)
  }

  public CanSeq2(): boolean {
    return typeCanSeq2(this)
  }
}

// invalidTypeInstance is the singleton type of every invalid reflect.Value.
const invalidTypeInstance = new InvalidTypeClass()

// isEmptyObject reports whether value has no own enumerable properties,
// without listing them all as Object.keys would.
function isEmptyObject(value: object): boolean {
  for (const key in value) {
    if (globalThis.Object.hasOwn(value, key)) {
      return false
    }
  }
  return true
}

// Value is the reflection interface to a Go value.
export class Value {
  // __typeInfo is the runtime type of reflect.Value, registered after the
  // class is defined.
  static __typeInfo: $.StructTypeInfo

  private _value: ReflectValue
  private _type: Type
  // _parentVarRef tracks the VarRef this value was dereferenced from (for Set support)
  private _parentVarRef?: $.VarRef<ReflectValue>
  // _parentStruct and _fieldName track the parent struct and field name for struct field Set() support
  private _parentStruct?: Record<string, unknown>
  private _fieldName?: string
  private _interfaceValue?: ReflectValue
  // _addressable is whether the value is addressable, as in Go: an element
  // of a pointer or slice, or a field or array element of an addressable value.
  private _addressable = false

  constructor(
    value?: ReflectValue | Record<string, never>,
    type?: Type | null,
    parentVarRef?: $.VarRef<ReflectValue>,
    parentStruct?: Record<string, unknown>,
    fieldName?: string,
    interfaceValue?: ReflectValue,
  ) {
    // Handle zero-value initialization: new Value({}) or new Value()
    // This corresponds to reflect.Value{} in Go which is an invalid/zero value
    if (
      type === undefined ||
      type === null ||
      (typeof value === 'object' &&
        value !== null &&
        !(value instanceof globalThis.Array) &&
        !(value instanceof globalThis.Map) &&
        !globalThis.ArrayBuffer.isView(value) &&
        !$.isStructObject(value) &&
        isEmptyObject(value))
    ) {
      this._value = null
      this._type = invalidTypeInstance
    } else {
      this._value = value as ReflectValue
      this._type = type
    }
    this._parentVarRef = parentVarRef
    this._parentStruct = parentStruct
    this._fieldName = fieldName
    this._interfaceValue = interfaceValue
  }

  public clone(): Value {
    const cloned = new Value(
      this._value,
      this._type,
      this._parentVarRef,
      this._parentStruct,
      this._fieldName,
      this._interfaceValue,
    )
    cloned._addressable = this._addressable
    return cloned
  }

  // withAddressable sets whether v is addressable and returns v.
  private withAddressable(addressable: boolean): Value {
    this._addressable = addressable
    return this
  }

  // currentValue returns the value v refers to. Calling a method copies a
  // Value, as in Go, so a setter on a copy updates the shared parent VarRef or
  // struct field but not this Value's own _value; getters and Select read
  // through here.
  public currentValue(): ReflectValue {
    if (this._parentVarRef) {
      return this._parentVarRef.value
    }
    if (this._parentStruct && this._fieldName !== undefined) {
      const value = this._parentStruct[this._fieldName]
      return value === undefined ? null : (value as ReflectValue)
    }
    return this._value
  }

  private storeValue(value: ReflectValue): void {
    // A float32 holds a value rounded to float32 precision, as in Go.
    if (this.Kind() === Float32 && typeof value === 'number') {
      value = Math.fround(value)
    }

    // An array is copied, so it does not share storage with its source.
    if (this.Kind() === Array) {
      value = $.cloneArrayValue(
        value,
        typeInfoFromReflectType(this._type),
      ) as ReflectValue
    }

    // A struct is copied into its existing storage.
    if (this.Kind() === Struct) {
      const target = this.currentValue()
      $.assignStruct(target, value, typeInfoFromReflectType(this._type))
      this._value = target
      return
    }

    // Write the value and the storage it came from.
    this._value = value
    if (this._parentVarRef) {
      this._parentVarRef.value = value
    }
    if (this._parentStruct && this._fieldName !== undefined) {
      this._parentStruct[this._fieldName] = value
    }
  }

  // integerValue reads the underlying value as a bigint regardless of whether it
  // is stored as a number (int8..int32/uint8..uint32) or a bigint (int64/uint64).
  private integerValue(): bigint | null {
    // Return a stored bigint.
    const current = this.currentValue()
    if (typeof current === 'bigint') {
      return current
    }

    // Convert an integral number.
    const value = this.numericValue()
    if (value !== null && Number.isInteger(value)) {
      return BigInt(value)
    }
    return null
  }

  // Int returns v's underlying value as an int64, matching reflect.Value.Int.
  public Int(): bigint {
    const value = this.integerValue()
    if (value !== null) {
      return value
    }
    throw new Error(
      'reflect: call of reflect.Value.Int on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  // Uint returns v's underlying value as a uint64, matching reflect.Value.Uint.
  public Uint(): bigint {
    const value = this.integerValue()
    if (value !== null && value >= 0n) {
      return value
    }
    throw new Error(
      'reflect: call of reflect.Value.Uint on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  public Float(): number {
    const value = this.numericValue()
    if (value !== null) {
      return value
    }
    throw new Error(
      'reflect: call of reflect.Value.Float on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  public Bool(): boolean {
    const current = this.currentValue()
    if (typeof current === 'boolean') {
      return current
    }
    throw new Error(
      'reflect: call of reflect.Value.Bool on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  private numericValue(): number | null {
    const current = this.currentValue()
    if (typeof current === 'number') {
      return current
    }
    if (
      current !== null &&
      typeof current === 'object' &&
      typeof (current as { valueOf?: unknown }).valueOf === 'function'
    ) {
      const value = (current as { valueOf(): unknown }).valueOf()
      if (typeof value === 'number') {
        return value
      }
    }
    return null
  }

  public String(): string {
    const current = this.currentValue()
    if (typeof current === 'string') {
      return current
    }
    // Special case for bool values - display as <bool Value>
    if (this._type.Kind() === Bool) {
      return '<bool Value>'
    }
    return this._type.String()
  }

  public Len(): number {
    // Measure the collections whose kind is known.
    const value = this.currentValue()
    if (this.Kind() === Slice || this.Kind() === Array) {
      return $.len(value as any)
    }
    if (this.Kind() === Map) {
      if (value instanceof globalThis.Map) {
        return value.size
      }
      if (value !== null && value !== undefined) {
        throw new ValueError({ Kind: this.Kind(), Method: 'Len' })
      }
      return 0
    }

    // Check for slice objects created by $.arrayToSlice
    if (value && typeof value === 'object' && '__meta__' in value) {
      const meta = (value as { __meta__?: { length?: number } }).__meta__
      if (meta && typeof meta.length === 'number') {
        return meta.length
      }
    }

    // Check for typed arrays
    if (
      value instanceof Uint8Array ||
      value instanceof Int8Array ||
      value instanceof Uint16Array ||
      value instanceof Int16Array ||
      value instanceof Uint32Array ||
      value instanceof Int32Array ||
      value instanceof Float32Array ||
      value instanceof Float64Array
    ) {
      return value.length
    }

    // Check for regular arrays
    if (globalThis.Array.isArray(value)) {
      return value.length
    }

    // Check for strings, measured in bytes
    if (typeof value === 'string') {
      return $.len(value)
    }

    // Any other kind has no length.
    throw new Error(
      'reflect: call of reflect.Value.Len on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  public Kind(): Kind {
    return this._type.Kind()
  }

  public Type(): Type {
    return this._type
  }

  public IsValid(): boolean {
    // In Go, a Value is valid if it was properly constructed (not the zero Value{}).
    // A valid Value can have a nil underlying value (e.g., nil map, nil pointer).
    // We check if the type is valid (not the invalid type sentinel).
    return this._type !== invalidTypeInstance
  }

  public IsNil(): boolean {
    const value = this.currentValue()
    return value === null || value === undefined || $.isTypedNilValue(value)
  }

  public Index(i: number): Value {
    if (this.Kind() === Slice || this.Kind() === Array) {
      const ref = $.indexRef(
        this.currentValue() as any,
        i,
      ) as $.VarRef<ReflectValue>
      return new Value(ref.value, this._type.Elem(), ref).withAddressable(
        this.Kind() === Slice || this._addressable,
      )
    }
    throw new Error(
      'reflect: call of reflect.Value.Index on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  public Slice(i: number, j: number): Value {
    const length = this.Len()
    if (i < 0 || j < i || j > length) {
      throw new Error(
        `reflect.Value.Slice: slice index out of bounds [${i}:${j}] with length ${length}`,
      )
    }
    const value = this.currentValue()
    if (
      (value && typeof value === 'object' && '__meta__' in value) ||
      $.isTypedSlice(value)
    ) {
      return new Value($.goSlice(value as $.Slice<unknown>, i, j), this._type)
    }
    if (globalThis.Array.isArray(value)) {
      return new Value(value.slice(i, j), this._type)
    }
    if (typeof value === 'string') {
      return new Value(value.slice(i, j), this._type)
    }
    throw new ValueError({ Kind: this.Kind(), Method: 'Slice' })
  }

  // Slice3 is the 3-index form of the slice operation: it returns v[i:j:k].
  public Slice3(i: number, j: number, k: number): Value {
    // Only a slice or an array, with indexes within its capacity, slices.
    const value = this.currentValue()
    if (
      (this.Kind() !== Slice && this.Kind() !== Array) ||
      (value !== null && typeof value !== 'object')
    ) {
      throw new ValueError({ Kind: this.Kind(), Method: 'Slice3' })
    }
    const capacity = $.cap(value as $.Slice<unknown>)
    if (i < 0 || j < i || k < j || k > capacity) {
      throw new Error(
        `reflect.Value.Slice3: slice index out of bounds [${i}:${j}:${k}] with capacity ${capacity}`,
      )
    }

    // Slicing an array yields a slice of its element type.
    const typ = this.Kind() === Array ? SliceOf(this._type.Elem()) : this._type
    return new Value($.goSlice(value as $.Slice<unknown>, i, j, k), typ)
  }

  // Recv receives and returns a value from the channel v. It blocks until a
  // value is ready. The boolean is false if the value is the zero value
  // received because the channel is closed.
  public async Recv(): Promise<[Value, boolean]> {
    // A closed channel yields the zero value and false.
    const result = await $.chanRecvWithOk(this.recvChan())
    if (!result.ok) {
      return [Zero(this._type.Elem()), false]
    }
    return [new Value(result.value, this._type.Elem()), true]
  }

  // Seq returns an iter.Seq[Value] that loops over the elements of v, as a
  // range loop would.
  public Seq(): iter.Seq<Value> {
    return valueSeq(this)
  }

  // Seq2 returns an iter.Seq2[Value, Value] that loops over the elements of
  // v, as a range loop with two variables would.
  public Seq2(): iter.Seq2<Value, Value> {
    return valueSeq2(this)
  }

  public Bytes(): $.Slice<number> {
    const value = this.currentValue()
    if (
      this.Kind() === Slice &&
      this._type.Elem()?.Kind() === Uint8 &&
      (value === null ||
        value instanceof Uint8Array ||
        globalThis.Array.isArray(value) ||
        (typeof value === 'object' && '__meta__' in value))
    ) {
      return value as $.Slice<number>
    }
    if (this.Kind() === String && typeof value === 'string') {
      return $.stringToBytes(value)
    }
    throw new Error(
      'reflect: call of reflect.Value.Bytes on ' +
        Kind_String(this._type.Kind()) +
        ' Value',
    )
  }

  public Elem(): Value {
    // Read through to the parent, so the element sees values Set elsewhere.
    const value = this.currentValue()

    // For pointers, unwrap the VarRef and return the element, tracking the parent
    if (this._type.Kind() === Ptr && $.isVarRef(value)) {
      const varRef = value as $.VarRef<ReflectValue>
      const elemType = this._type.Elem()
      return new Value(varRef.value, elemType, varRef).withAddressable(true)
    }
    if (
      this._type.Kind() === Ptr &&
      value &&
      typeof value === 'object' &&
      '__goValue' in value &&
      $.isVarRef((value as { __goValue: unknown }).__goValue)
    ) {
      const varRef = (value as { __goValue: $.VarRef<ReflectValue> }).__goValue
      return new Value(varRef.value, this._type.Elem(), varRef).withAddressable(
        true,
      )
    }
    if (this._type.Kind() === Interface) {
      // The element of a nil interface is the zero Value, as in Go.
      const value = this.currentValue()
      if (value === null || value === undefined) {
        return new Value()
      }
      return ValueOf(value)
    }
    if (this._type.Kind() === Ptr) {
      // A pointer to a struct is the struct object itself.
      if (this.IsNil()) {
        return new Value()
      }
      return new Value(value, this._type.Elem()).withAddressable(true)
    }
    return new Value(value, this._type, this._parentVarRef)
  }

  public NumField(): number {
    return this._type.NumField()
  }

  public Field(i: number): Value {
    // Validate the kind and the field index.
    if (this.Kind() !== Struct) {
      throw new ValueError({ Kind: this.Kind(), Method: 'Field' })
    }
    const field = this.Type().Field(i)
    const fieldKey = structFieldStorageKey(this.Type(), i)
    if (!field) {
      throw new Error('reflect: struct field index out of range')
    }

    // Read the field from the struct's storage, where an unset field is nil.
    const structValue = this.currentValue() as Record<string, any>
    const parentObj = structValue
    const fieldVal = parentObj[fieldKey] ?? null

    // Pass parent struct and field name so Set() can update the struct
    return new Value(
      fieldVal,
      field.Type,
      undefined,
      parentObj,
      fieldKey,
    ).withAddressable(this._addressable)
  }

  public FieldByIndex(index: $.Slice<number>): Value {
    // Step through embedded struct pointers as Go does, panicking on a nil
    // one.
    const [field, err] = this.FieldByIndexErr(index)
    if (err !== null) {
      $.panic(err)
    }
    return field
  }

  // FieldByIndexErr returns the nested field corresponding to index, or an
  // error if evaluation requires stepping through a nil pointer to an
  // embedded struct.
  public FieldByIndexErr(index: $.Slice<number>): [Value, $.GoError] {
    let current: Value = this
    let i = 0
    for (const fieldIndex of $.asArray(index)) {
      if (
        i > 0 &&
        current.Kind() === Ptr &&
        current.Type().Elem().Kind() === Struct
      ) {
        if (current.IsNil()) {
          return [
            new Value(),
            $.newError(
              'reflect: indirection through nil pointer to embedded struct field ' +
                current.Type().Elem().Name(),
            ),
          ]
        }
        current = current.Elem()
      }
      current = current.Field(fieldIndex)
      i++
    }
    return [current, null]
  }

  public FieldByName(name: string): Value {
    const [field, ok] = this.Type().FieldByName(name)
    if (!ok) {
      return new Value(null, invalidTypeInstance)
    }
    return this.FieldByIndex(field.Index)
  }

  // FieldByNameFunc returns the struct field with a name that satisfies
  // the match function, or the zero Value if no field was found.
  public FieldByNameFunc(match: (name: string) => boolean): Value {
    const [field, ok] = this.Type().FieldByNameFunc(match)
    if (!ok) {
      return new Value(null, invalidTypeInstance)
    }
    return this.FieldByIndex(field.Index)
  }

  // Additional methods needed by various parts of the codebase
  public UnsafePointer(): unknown {
    return this._value
  }

  public Pointer(): number {
    const kind = this.Kind()
    if (
      kind !== Chan &&
      kind !== Func &&
      kind !== Map &&
      kind !== Ptr &&
      kind !== Slice &&
      kind !== UnsafePointer
    ) {
      throw new ValueError({ Kind: kind, Method: 'Pointer' })
    }
    const value = this.currentValue()
    if (value === null || value === undefined || $.isTypedNilValue(value)) {
      return 0
    }
    if ($.isOwnedPointerHandle(value)) {
      return $.ownedPointerAddress(value)
    }
    if ($.isVarRef(value)) {
      const address = value.__goAddress?.()
      if (address !== undefined) {
        return address
      }
      return $.pointerAddress(value)
    }
    if (kind === Slice) {
      const slice = value as $.Slice<unknown> | Uint8Array
      try {
        if ($.len(slice) === 0) {
          return 0
        }
        return $.indexAddress(slice, 0)
      } catch {
        return 0
      }
    }
    if (typeof value === 'object' || typeof value === 'function') {
      return $.pointerAddress(value)
    }
    return 0
  }

  public UnsafeAddr(): number | $.OwnedPointerHandle<ReflectValue> {
    if (!this.canTakeAddress()) {
      throw new ValueError({ Kind: this.Kind(), Method: 'UnsafeAddr' })
    }
    if (this._parentStruct && this._fieldName) {
      const target = this._parentStruct
      const key = this._fieldName
      const ref = $.fieldRef(
        target,
        key as keyof typeof target,
      ) as $.VarRef<ReflectValue>
      return $.ownedPointerFromRef(ref)!
    }
    if (this._parentVarRef?.__goPointer) {
      return this._parentVarRef
        .__goPointer as $.OwnedPointerHandle<ReflectValue>
    }
    return this.Pointer()
  }

  public pointer(): unknown {
    return this._value
  }

  public get ptr(): unknown {
    return this._value
  }

  // Internal method to access the underlying value
  public get value(): ReflectValue {
    return this.currentValue()
  }

  // Convert method needed by iter.ts
  // Convert returns the value v converted to type t, as a Go conversion
  // would: numeric values change their representation and width, and
  // strings convert to and from byte and rune slices.
  public Convert(t: Type): Value {
    if (!this.IsValid()) {
      throw new ValueError({ Kind: Invalid, Method: 'Convert' })
    }
    return new Value(convertValue(this.currentValue(), this.Type(), t), t)
  }

  // CanConvert reports whether the value is convertible to type t. The
  // interface dynamic-type case from Go does not arise here because values
  // are always built from their dynamic type.
  public CanConvert(t: Type | null): boolean {
    if (t === null) {
      return false
    }
    if (!this.IsValid()) {
      return false
    }
    return this.Type().ConvertibleTo(t)
  }

  // CanAddr reports whether v is addressable, as in Go.
  public CanAddr(): boolean {
    return this._addressable
  }

  // canTakeAddress reports whether Addr and UnsafeAddr can produce a pointer
  // to v. It is more permissive than CanAddr: any value with storage can be
  // referenced in GoScript, even one Go would not consider addressable.
  private canTakeAddress(): boolean {
    return (
      this._addressable ||
      (this.Kind() !== Ptr &&
        (this._parentVarRef !== undefined ||
          (this._parentStruct !== undefined && this._fieldName !== undefined) ||
          this._value !== null))
    )
  }

  public Addr(): Value {
    // Only a value with storage has an address.
    if (!this.canTakeAddress()) {
      throw new Error('reflect: call of reflect.Value.Addr on invalid Value')
    }

    // Point at the field or variable that holds the value, the struct object
    // itself, or else a new variable.
    const ptrType = PointerTo(this.Type())
    if (this._parentStruct && this._fieldName) {
      return new Value($.fieldRef(this._parentStruct, this._fieldName), ptrType)
    }
    if (this._parentVarRef) {
      return new Value(this._parentVarRef, ptrType)
    }
    if (this.Kind() === Struct) {
      return new Value(this._value, ptrType)
    }
    return new Value($.varRef(this._value), ptrType)
  }

  public CanSet(): boolean {
    // A value with storage can be set: an addressable value, such as the
    // element of a pointer or slice, or a variable or field. A value made by
    // ValueOf has none, so, as in Go, it cannot be set.
    return (
      this.IsValid() &&
      (this._addressable ||
        this._parentVarRef !== undefined ||
        this._parentStruct !== undefined)
    )
  }

  public Set(x: Value): void {
    if (!this.CanSet()) {
      throw new Error('reflect: assign to invalid value')
    }
    const thisType = this.Type()
    const xType = x.Type()
    if (!xType.AssignableTo(thisType)) {
      throw new Error('reflect: assign to wrong type')
    }
    this.storeValue(x.value)
  }

  // Interface returns v's current value as an interface value, boxed with its
  // named type.
  public Interface(): ReflectValue {
    // Return the interface value v was made from.
    if (this._interfaceValue !== undefined) {
      return this._interfaceValue
    }

    // An interface Value holds its dynamic value, which is already boxed with
    // its own type.
    const current = this.currentValue()
    if (this._type.Kind() === Interface) {
      return current
    }

    // Find whether the type or its pointer element is named.
    const typeInfo = typeInfoFromReflectType(this._type)
    const namedType =
      this._type.Name() !== '' &&
      (this._type.PkgPath() !== '' ||
        runtimeTypeString(this._type).includes('.'))
    const elemType = this._type.Kind() === Ptr ? this._type.Elem() : null
    const namedElemType =
      elemType !== null &&
      elemType.Name() !== '' &&
      (elemType.PkgPath() !== '' || runtimeTypeString(elemType).includes('.'))

    // A pointer to a struct is the struct object itself, whose methods
    // satisfy interfaces, so it is tagged with its type but not boxed.
    if (elemType !== null && elemType.Kind() === Struct) {
      let target = $.isVarRef(current) ? current.value : current
      // A pointer to a named struct converted to a pointer to an unnamed
      // struct type, such as one made by StructOf, has none of the methods
      // of the named type, so it is a view of the struct without them.
      if (elemType.Name() === '' && isNamedStructObject(target)) {
        target = unnamedStructView(target)
      }
      return $.interfaceValue<ReflectValue>(
        target ?? null,
        runtimeTypeString(this._type),
        typeInfo,
      )
    }

    // Box a named value with its type.
    if (this._type.Kind() === Struct && namedType) {
      return $.interfaceValue<ReflectValue>(
        current,
        runtimeTypeString(this._type),
        typeInfo,
      )
    }
    if (
      (namedType && this._type.Kind() !== Struct) ||
      (this._type.Kind() === Ptr && namedElemType)
    ) {
      // Use the registered method set, so the box satisfies interfaces.
      const registered = $.namedValueMethods(runtimeTypeString(this._type))
      return $.namedValueInterfaceValue<ReflectValue>(
        current,
        runtimeTypeString(this._type),
        registered?.methods ?? {},
        typeInfo,
        registered?.signatures,
      )
    }

    // A number of a sized kind, such as float32 or int8, is boxed with its
    // kind, as the compiler boxes it, so that it keeps its type; int and
    // float64 are the kinds of a raw number.
    const kind = this._type.Kind()
    if (
      kind >= Int8 &&
      kind <= Float32 &&
      kind !== Int64 &&
      kind !== Uint64 &&
      kind !== Uintptr
    ) {
      return $.basicInterfaceValue<ReflectValue>(
        current,
        runtimeTypeString(this._type),
      )
    }

    // Box an unnamed value with its type, as the compiler does when it
    // converts the value to an interface. A nil slice, map, func, chan or
    // pointer then keeps its type, so the interface is not nil, and a
    // pointer such as *[]T reports its type to reflect.ValueOf.
    return $.interfaceValue<ReflectValue>(
      current,
      runtimeTypeString(this._type),
      typeInfo,
    )
  }

  public MethodByName(name: string): Value {
    if (!this.IsValid()) {
      return new Value()
    }
    const bound = this.boundMethod(name)
    if (bound === undefined) {
      return new Value()
    }

    // The method value has the method's signature without the receiver.
    const [signature] = methodSignatureByName(this.Type(), name)
    const methodType =
      signature ?
        methodTypeFromSignature(signature, this.Type(), false)
      : new FunctionType('func')
    return new Value(bound, methodType)
  }

  // Method returns a function value for the i'th method of the method set of
  // v's type, with v bound as its receiver.
  public Method(i: number): Value {
    return this.MethodByName(this.Type().Method(i).Name)
  }

  // boundMethod returns the method called name bound to the value, or
  // undefined if the value has no such method.
  private boundMethod(name: string): ((...args: any[]) => any) | undefined {
    // A struct or other object receiver carries its methods.
    const current = this.currentValue()
    const receiver = $.isVarRef(current) ? current.value : current
    if (receiver === null || receiver === undefined) {
      return undefined
    }
    const method =
      typeof receiver === 'object' || typeof receiver === 'function' ?
        (receiver as Record<string, unknown>)[name]
      : undefined
    if (typeof method === 'function') {
      return method.bind(receiver)
    }

    // A named non-struct type, such as a named int or slice, has its methods
    // in the method table registered under its type string.
    const named = $.namedValueMethods(runtimeTypeString(this.Type()))?.methods[
      name
    ]
    if (named === undefined) {
      return undefined
    }
    return (...args: any[]) => named(current, ...args)
  }

  public async Call(inArgs: $.Slice<Value>): Promise<$.Slice<Value>> {
    // A settable func Value, such as an element of a slice, holds its
    // function in the variable or field it refers to.
    const fn = this.currentValue()
    if (this.Kind() !== Func || typeof fn !== 'function') {
      throw new ValueError({ Kind: this.Kind(), Method: 'Call' })
    }
    return await callReflectFunction(
      fn as (...args: unknown[]) => unknown,
      this._type,
      inArgs,
      'Call',
    )
  }

  public async CallSlice(inArgs: $.Slice<Value>): Promise<$.Slice<Value>> {
    // A settable func Value, such as an element of a slice, holds its
    // function in the variable or field it refers to.
    const fn = this.currentValue()
    if (this.Kind() !== Func || typeof fn !== 'function') {
      throw new ValueError({ Kind: this.Kind(), Method: 'CallSlice' })
    }
    return await callReflectFunction(
      fn as (...args: unknown[]) => unknown,
      this._type,
      inArgs,
      'CallSlice',
    )
  }

  // IsZero reports whether v is the zero value for its type, as in Go:
  // reference kinds are zero only when nil, floats only when +0, and arrays
  // and structs when all their elements and fields are zero.
  public IsZero(): boolean {
    const value = this.currentValue()
    switch (this.Kind()) {
      case Invalid:
        throw new ValueError({ Kind: Invalid, Method: 'IsZero' })
      case Bool:
        return value === false || value === null
      case String:
        return value === '' || value === null
      case Float32:
      case Float64:
        return value === null || Object.is(value, 0)
      case Complex64:
      case Complex128: {
        const c = value as $.Complex | null
        return c === null || (Object.is(c.real, 0) && Object.is(c.imag, 0))
      }
      case Chan:
      case Func:
      case Interface:
      case Map:
      case Ptr:
      case Slice:
      case UnsafePointer:
        return this.IsNil()
      case Array: {
        const n = this.Len()
        for (let i = 0; i < n; i++) {
          if (!this.Index(i).IsZero()) {
            return false
          }
        }
        return true
      }
      case Struct: {
        const n = this.NumField()
        for (let i = 0; i < n; i++) {
          if (!this.Field(i).IsZero()) {
            return false
          }
        }
        return true
      }
    }
    // Integer kinds, as number or bigint.
    return value === null || value === 0 || value === 0n
  }

  public typ(): rtype | null {
    return new rtype(this._type.Kind())
  }

  public get flag(): number {
    return 0
  }

  public MapRange(): MapIter<unknown, unknown> | null {
    if (this.Kind() !== Map) {
      throw new ValueError({ Kind: this.Kind(), Method: 'MapRange' })
    }
    const value = this.currentValue()
    if (value === null || value === undefined) {
      return new MapIter(new globalThis.Map(), this._type)
    }
    if (!(value instanceof globalThis.Map)) {
      throw new ValueError({ Kind: this.Kind(), Method: 'MapRange' })
    }
    return new MapIter(value, this._type)
  }

  public MapIndex(key: Value): Value {
    if (this.Kind() !== Map) {
      throw new ValueError({ Kind: this.Kind(), Method: 'MapIndex' })
    }
    const value = this.currentValue()
    if (!(value instanceof globalThis.Map)) {
      return new Value(null, new BasicType(Invalid, 'invalid'))
    }
    const rawKey = key.Interface()
    if (!value.has(rawKey)) {
      return new Value(null, new BasicType(Invalid, 'invalid'))
    }
    return new Value(value.get(rawKey) as ReflectValue, this.Type().Elem())
  }

  public MapKeys(): $.Slice<Value> {
    if (this.Kind() !== Map) {
      throw new ValueError({ Kind: this.Kind(), Method: 'MapKeys' })
    }
    const value = this.currentValue()
    if (value === null || value === undefined) {
      return $.makeSlice<Value>(0)
    }
    if (!(value instanceof globalThis.Map)) {
      throw new ValueError({ Kind: this.Kind(), Method: 'MapKeys' })
    }
    const keyType = this.Type().Key()
    const keys: Value[] = []
    for (const key of value.keys()) {
      keys.push(new Value(key as ReflectValue, keyType))
    }
    return $.arrayToSlice(keys)
  }

  public Complex(): $.Complex {
    const k = this.Kind()
    if (k !== Complex64 && k !== Complex128) {
      throw new Error(
        'reflect: call of reflect.Value.Complex on ' +
          Kind_String(k) +
          ' Value',
      )
    }
    const value = this._parentVarRef ? this._parentVarRef.value : this._value
    if (value === null || value === undefined) {
      return $.complex(0, 0)
    }
    if (typeof value === 'number') {
      return $.complex(value, 0)
    }
    return value as $.Complex
  }

  // Close closes the channel v. It panics if v is not a channel that can
  // send.
  public Close(): void {
    const ch = this.sendChan()
    if (ch === null) {
      throw new Error('close of nil channel')
    }
    ch.close()
  }

  // Send sends x on the channel v. It blocks until the value is sent.
  public async Send(x: Value): Promise<void> {
    await $.chanSend(this.sendChan(), x.currentValue())
  }

  // recvChan returns the channel v holds for a receive, or null for a nil
  // channel. It panics if v is not a channel that can receive.
  public recvChan(): $.Channel<ReflectValue> | null {
    if (this.Kind() !== Chan) {
      throw new ValueError({ Kind: this.Kind(), Method: 'Recv' })
    }
    if (this._type.ChanDir() === SendDir) {
      throw new Error('reflect: recv on send-only channel')
    }
    return this.chanValue()
  }

  // sendChan returns the channel v holds for a send, or null for a nil
  // channel. It panics if v is not a channel that can send.
  public sendChan(): $.Channel<ReflectValue> | null {
    if (this.Kind() !== Chan) {
      throw new ValueError({ Kind: this.Kind(), Method: 'Send' })
    }
    if (this._type.ChanDir() === RecvDir) {
      throw new Error('reflect: send on recv-only channel')
    }
    return this.chanValue()
  }

  // chanValue returns the channel v holds, or null for a nil channel,
  // including a typed nil boxed in an interface.
  private chanValue(): $.Channel<ReflectValue> | null {
    if (this.IsNil()) {
      return null
    }
    return this.currentValue() as $.Channel<ReflectValue>
  }

  // SetString sets v's underlying value to x
  public SetString(x: string): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetString on unaddressable value',
      )
    }
    if (this.Kind() !== String) {
      throw new Error(
        'reflect: call of reflect.Value.SetString on ' + this.Kind() + ' Value',
      )
    }
    this._value = x
    if (this._parentVarRef) {
      this._parentVarRef.value = x
    }
    if (this._parentStruct && this._fieldName) {
      this._parentStruct[this._fieldName] = x
    }
  }

  // SetInt sets v's underlying value to x. x is an int64 (bigint); the stored
  // value uses the field's representation: bigint for Int64, number otherwise.
  public SetInt(x: bigint): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetInt on unaddressable value',
      )
    }
    const k = this.Kind()
    if (k !== Int && k !== Int8 && k !== Int16 && k !== Int32 && k !== Int64) {
      throw new Error(
        'reflect: call of reflect.Value.SetInt on ' + k + ' Value',
      )
    }
    const stored: number | bigint = k === Int64 ? x : Number(x)
    this._value = stored
    if (this._parentVarRef) {
      this._parentVarRef.value = stored
    }
    if (this._parentStruct && this._fieldName) {
      this._parentStruct[this._fieldName] = stored
    }
  }

  // SetUint sets v's underlying value to x. x is a uint64 (bigint); the stored
  // value uses the field's representation: bigint for Uint64, number otherwise.
  public SetUint(x: bigint): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetUint on unaddressable value',
      )
    }
    const k = this.Kind()
    if (
      k !== Uint &&
      k !== Uint8 &&
      k !== Uint16 &&
      k !== Uint32 &&
      k !== Uint64 &&
      k !== Uintptr
    ) {
      throw new Error(
        'reflect: call of reflect.Value.SetUint on ' + k + ' Value',
      )
    }
    const stored: number | bigint = k === Uint64 ? x : Number(x)
    this._value = stored
    if (this._parentVarRef) {
      this._parentVarRef.value = stored
    }
    if (this._parentStruct && this._fieldName) {
      this._parentStruct[this._fieldName] = stored
    }
  }

  // SetBool sets v's underlying value to x
  public SetBool(x: boolean): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetBool on unaddressable value',
      )
    }
    if (this.Kind() !== Bool) {
      throw new Error(
        'reflect: call of reflect.Value.SetBool on ' + this.Kind() + ' Value',
      )
    }
    this._value = x
    if (this._parentVarRef) {
      this._parentVarRef.value = x
    }
    if (this._parentStruct && this._fieldName) {
      this._parentStruct[this._fieldName] = x
    }
  }

  // SetFloat sets v's underlying value to x
  public SetFloat(x: number): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetFloat on unaddressable value',
      )
    }
    const k = this.Kind()
    if (k !== Float32 && k !== Float64) {
      throw new Error(
        'reflect: call of reflect.Value.SetFloat on ' + k + ' Value',
      )
    }
    this.storeValue(x)
  }

  // SetComplex sets v's underlying value to x
  public SetComplex(x: number | $.Complex): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetComplex on unaddressable value',
      )
    }
    const k = this.Kind()
    if (k !== Complex64 && k !== Complex128) {
      throw new Error(
        'reflect: call of reflect.Value.SetComplex on ' + k + ' Value',
      )
    }
    this._value = x
    if (this._parentVarRef) {
      this._parentVarRef.value = x
    }
    if (this._parentStruct && this._fieldName) {
      this._parentStruct[this._fieldName] = x
    }
  }

  // SetBytes sets v's underlying value to x
  public SetBytes(x: $.Slice<number>): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetBytes on unaddressable value',
      )
    }
    if (this.Kind() !== Slice) {
      throw new Error(
        'reflect: call of reflect.Value.SetBytes on ' + this.Kind() + ' Value',
      )
    }
    // Convert Uint8Array or slice to array
    if (x instanceof Uint8Array) {
      this._value = globalThis.Array.from(x)
    } else if (globalThis.Array.isArray(x)) {
      this._value = x
    } else {
      this._value = x
    }
  }

  // SetZero sets v to be the zero value of v's type
  public SetZero(): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetZero on unaddressable value',
      )
    }
    const zeroVal = Zero(this.Type())
    this.storeValue((zeroVal as { value: ReflectValue }).value)
  }

  // SetLen sets v's length to n
  public SetLen(n: number): void {
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.SetLen on unaddressable value',
      )
    }
    if (this.Kind() !== Slice) {
      throw new Error(
        'reflect: call of reflect.Value.SetLen on ' + this.Kind() + ' Value',
      )
    }
    const value = this.currentValue() as $.Slice<unknown>
    if (n < 0 || n > $.cap(value)) {
      throw new Error('reflect: slice length out of range in SetLen')
    }
    this.storeValue($.goSlice(value, 0, n) as ReflectValue)
  }

  // SetMapIndex sets the element associated with key in the map v to elem
  public SetMapIndex(key: Value, elem: Value): void {
    // A map is changed in place, so, as in Go, it need not be settable.
    if (!this.IsValid()) {
      throw new ValueError({ Kind: Invalid, Method: 'SetMapIndex' })
    }
    if (this.Kind() !== Map) {
      throw new Error(
        'reflect: call of reflect.Value.SetMapIndex on ' +
          this.Kind() +
          ' Value',
      )
    }
    const mapObj = this.currentValue()
    if (!(mapObj instanceof globalThis.Map)) {
      throw new Error('reflect: assignment to entry in nil map')
    }
    const keyVal = (key as { value: ReflectValue }).value
    const elemVal = (elem as { value: ReflectValue }).value
    if (!elem.IsValid()) {
      mapObj.delete(keyVal)
      return
    }
    mapObj.set(keyVal, elemVal)
  }

  // Grow increases the slice's capacity, if necessary, to guarantee space
  // for another n elements, so that SetLen can extend the length after it.
  public Grow(n: number): void {
    if (this.Kind() !== Slice) {
      throw new Error(
        'reflect: call of reflect.Value.Grow on ' + this.Kind() + ' Value',
      )
    }
    if (n < 0) {
      throw new Error('reflect.Value.Grow: negative len')
    }
    if (!this.CanSet()) {
      throw new Error(
        'reflect: call of reflect.Value.Grow on unaddressable value',
      )
    }
    const value = this.currentValue() as $.Slice<ReflectValue>
    const len = $.len(value)
    const cap = $.cap(value)
    if (cap - len >= n) {
      return
    }
    // Grow to at least twice the capacity, as append does, with each new
    // element a distinct zero value of the element type.
    const elemType = this._type.Elem()
    const grown = $.makeSlice(
      len,
      Math.max(len + n, 2 * cap),
      sliceTypeHint(elemType),
      () => Zero(elemType).value,
    )
    $.copy(grown, value)
    this.storeValue(grown)
  }

  // Cap returns v's capacity
  public Cap(): number {
    const k = this.Kind()
    if (k === Slice || k === Array) {
      return $.cap(this._value as any)
    }
    if (k === Chan) {
      return 0 // Simplified
    }
    throw new Error('reflect: call of reflect.Value.Cap on ' + k + ' Value')
  }

  // NumMethod returns the number of methods in the value's method set
  public NumMethod(): number {
    if (!this.IsValid()) {
      return 0
    }
    return this.Type().NumMethod()
  }

  // Equal reports whether v is equal to u, as the == operator would report
  // for the values they hold: interfaces compare their dynamic values,
  // pointers and channels compare identity, and arrays and structs compare
  // their elements and fields.
  public Equal(u: Value): boolean {
    // Compare the dynamic values of interfaces.
    let v: Value = this
    if (v.Kind() === Interface) {
      v = v.Elem()
    }
    if (u.Kind() === Interface) {
      u = u.Elem()
    }

    // Values of different types are unequal, and two invalid values equal.
    if (!v.IsValid() || !u.IsValid()) {
      return v.IsValid() === u.IsValid()
    }
    if (
      v.Kind() !== u.Kind() ||
      typeIdentityKey(v.Type()) !== typeIdentityKey(u.Type())
    ) {
      return false
    }

    // Compare by kind, as == does.
    switch (v.Kind()) {
      case Chan:
      case Ptr:
      case UnsafePointer:
        if (v.IsNil() || u.IsNil()) {
          return v.IsNil() && u.IsNil()
        }
        return v.Pointer() === u.Pointer()
      case Array: {
        const n = v.Len()
        for (let i = 0; i < n; i++) {
          if (!v.Index(i).Equal(u.Index(i))) {
            return false
          }
        }
        return true
      }
      case Struct: {
        const n = v.NumField()
        for (let i = 0; i < n; i++) {
          if (!v.Field(i).Equal(u.Field(i))) {
            return false
          }
        }
        return true
      }
      case Complex64:
      case Complex128: {
        const a = v.currentValue() as $.Complex
        const b = u.currentValue() as $.Complex
        return a.real === b.real && a.imag === b.imag
      }
      case Func:
      case Map:
      case Slice:
        throw new Error(
          'reflect.Value.Equal: values of type ' +
            v.Type().String() +
            ' are not comparable',
        )
    }
    return v.currentValue() === u.currentValue()
  }

  // CanInterface reports whether Interface can be used without panicking
  public CanInterface(): boolean {
    return this.IsValid()
  }

  // OverflowInt reports whether the int64 x cannot be represented by v's type
  public OverflowInt(x: bigint): boolean {
    const k = this.Kind()
    switch (k) {
      case Int8:
        return x < -128n || x > 127n
      case Int16:
        return x < -32768n || x > 32767n
      case Int32:
        return x < -2147483648n || x > 2147483647n
      case Int:
      case Int64:
        return false
      default:
        throw new Error(
          'reflect: call of reflect.Value.OverflowInt on ' + k + ' Value',
        )
    }
  }

  // OverflowUint reports whether the uint64 x cannot be represented by v's type
  public OverflowUint(x: bigint): boolean {
    const k = this.Kind()
    switch (k) {
      case Uint8:
        return x < 0n || x > 255n
      case Uint16:
        return x < 0n || x > 65535n
      case Uint32:
        return x < 0n || x > 4294967295n
      case Uint:
      case Uint64:
      case Uintptr:
        return false
      default:
        throw new Error(
          'reflect: call of reflect.Value.OverflowUint on ' + k + ' Value',
        )
    }
  }

  // OverflowFloat reports whether the float64 x cannot be represented by v's type
  public OverflowFloat(x: number): boolean {
    const k = this.Kind()
    if (k === Float32) {
      const f32max = 3.4028234663852886e38
      return Math.abs(x) > f32max && !isNaN(x) && !!isFinite(x)
    }
    if (k === Float64) {
      return false // float64 can represent any JavaScript number
    }
    throw new Error(
      'reflect: call of reflect.Value.OverflowFloat on ' + k + ' Value',
    )
  }
}

// BasicType Basic type implementation - exported for compatibility.
export class BasicType implements Type {
  constructor(
    private _kind: Kind,
    private _name: string,
    private _size: number = 8,
    private _typeName: string = '',
    private _methods: $.MethodSignature[] = [],
  ) {}

  public String(): string {
    return $.goTypeString(this.runtimeString())
  }

  public runtimeString(): string {
    return this._typeName || this._name
  }

  public Kind(): Kind {
    return this._kind
  }

  public underlyingName(): string {
    return Kind_String(this._kind)
  }

  public Comparable(): boolean {
    return this._kind !== Func && this._kind !== Map && this._kind !== Slice
  }

  public Size(): number {
    return this._size
  }

  public Elem(): Type {
    throw new Error(`reflect: Elem of invalid type ${this._name}`)
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public PkgPath(): string {
    return this._typeName ? $.typePackagePath(this._typeName) : ''
  }

  public Name(): string {
    if (this._typeName) {
      return typeNameName(this._typeName)
    }
    // Basic types have names like 'int', 'string', etc.
    return this._name
  }

  public Field(_i: number): StructField {
    throw new Error(`reflect: Field of non-struct type ${this._name}`)
  }

  public FieldByIndex(index: $.Slice<number>): StructField {
    return typeFieldByIndex(this, index)
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error(`reflect: Key of non-map type ${this._name}`)
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public ConvertibleTo(u: Type | null): boolean {
    return typeConvertibleTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this._kind)
  }

  public OverflowInt(x: bigint): boolean {
    const k = this._kind
    switch (k) {
      case Int8:
        return x < -128n || x > 127n
      case Int16:
        return x < -32768n || x > 32767n
      case Int32:
        return x < -2147483648n || x > 2147483647n
      case Int:
      case Int64:
        return false
      default:
        throw new Error(
          'reflect: call of reflect.Type.OverflowInt on ' +
            Kind_String(k) +
            ' Type',
        )
    }
  }

  public OverflowUint(x: bigint): boolean {
    const k = this._kind
    switch (k) {
      case Uint8:
        return x < 0n || x > 255n
      case Uint16:
        return x < 0n || x > 65535n
      case Uint32:
        return x < 0n || x > 4294967295n
      case Uint:
      case Uint64:
      case Uintptr:
        return false
      default:
        throw new Error(
          'reflect: call of reflect.Type.OverflowUint on ' +
            Kind_String(k) +
            ' Type',
        )
    }
  }

  public OverflowFloat(x: number): boolean {
    const k = this._kind
    if (k === Float32) {
      const f32max = 3.4028234663852886e38
      return Math.abs(x) > f32max && !isNaN(x) && !!isFinite(x)
    }
    if (k === Float64) {
      return false
    }
    throw new Error(
      'reflect: call of reflect.Type.OverflowFloat on ' +
        Kind_String(k) +
        ' Type',
    )
  }

  public NumMethod(): number {
    return typeMethods(this).length
  }
  public Method(i: number): Method {
    return typeMethod(this, i)
  }
  public MethodByName(name: string): [Method, boolean] {
    return typeMethodByName(this, name)
  }

  public methodSignatures(): $.MethodSignature[] {
    return this._methods
  }

  public mergeMethodSignatures(methods: $.MethodSignature[]): void {
    this._methods = mergeMethodSignatureList(this._methods, methods)
  }

  public Len(): number {
    throw new Error(
      'reflect: call of reflect.Type.Len on ' +
        Kind_String(this._kind) +
        ' Type',
    )
  }

  public Bits(): number {
    const k = this._kind
    switch (k) {
      case Bool:
        return 1
      case Int8:
      case Uint8:
        return 8
      case Int16:
      case Uint16:
        return 16
      case Int32:
      case Uint32:
      case Float32:
        return 32
      case Int64:
      case Uint64:
      case Float64:
        return 64
      case Complex64:
        return 64
      case Complex128:
        return 128
      case Int:
      case Uint:
      case Uintptr:
        return 64 // Assuming 64-bit architecture
      default:
        throw new Error(
          'reflect: call of reflect.Type.Bits on ' + Kind_String(k) + ' Type',
        )
    }
  }

  public ChanDir(): ChanDir {
    return nonChanTypePanic(this)
  }

  public CanSeq(): boolean {
    return typeCanSeq(this)
  }

  public CanSeq2(): boolean {
    return typeCanSeq2(this)
  }
}

// Slice type implementation
class SliceType implements Type {
  constructor(
    private _elemType: Type,
    private _typeName: string = '',
  ) {}

  public String(): string {
    return $.goTypeString(this.runtimeString())
  }

  public runtimeString(): string {
    return this._typeName || '[]' + runtimeTypeString(this._elemType)
  }

  public Kind(): Kind {
    return Slice
  }

  public Comparable(): boolean {
    return false
  }

  public Size(): number {
    return 24 // slice header size
  }

  public Elem(): Type {
    return this._elemType
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public PkgPath(): string {
    return this._typeName ? $.typePackagePath(this._typeName) : ''
  }

  public Name(): string {
    if (!this._typeName) return ''
    return typeNameName(this._typeName)
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByIndex(index: $.Slice<number>): StructField {
    return typeFieldByIndex(this, index)
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public ConvertibleTo(u: Type | null): boolean {
    return typeConvertibleTo(this, u)
  }

  public OverflowInt(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on slice Type')
  }

  public OverflowUint(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowUint on slice Type')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowFloat on slice Type')
  }

  public NumMethod(): number {
    return typeMethods(this).length
  }
  public Method(i: number): Method {
    return typeMethod(this, i)
  }
  public MethodByName(name: string): [Method, boolean] {
    return typeMethodByName(this, name)
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on slice Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on slice Type')
  }

  public ChanDir(): ChanDir {
    return nonChanTypePanic(this)
  }

  public CanSeq(): boolean {
    return typeCanSeq(this)
  }

  public CanSeq2(): boolean {
    return typeCanSeq2(this)
  }
}

// Array type implementation
class ArrayType implements Type {
  constructor(
    private _elemType: Type,
    private _len: number,
    private _typeName: string = '',
  ) {}

  public String(): string {
    return $.goTypeString(this.runtimeString())
  }

  public runtimeString(): string {
    return (
      this._typeName || `[${this._len}]${runtimeTypeString(this._elemType)}`
    )
  }

  public Kind(): Kind {
    return Array
  }

  public Comparable(): boolean {
    return this._elemType.Comparable()
  }

  public Size(): number {
    return this._elemType.Size() * this._len
  }

  public Elem(): Type {
    return this._elemType
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public Len(): number {
    return this._len
  }

  public PkgPath(): string {
    return typeNamePkgPath(this._typeName)
  }

  public Name(): string {
    return typeNameName(this._typeName)
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByIndex(index: $.Slice<number>): StructField {
    return typeFieldByIndex(this, index)
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public ConvertibleTo(u: Type | null): boolean {
    return typeConvertibleTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public OverflowInt(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on array Type')
  }

  public OverflowUint(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowUint on array Type')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowFloat on array Type')
  }

  public NumMethod(): number {
    return typeMethods(this).length
  }
  public Method(i: number): Method {
    return typeMethod(this, i)
  }
  public MethodByName(name: string): [Method, boolean] {
    return typeMethodByName(this, name)
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on array Type')
  }

  public ChanDir(): ChanDir {
    return nonChanTypePanic(this)
  }

  public CanSeq(): boolean {
    return typeCanSeq(this)
  }

  public CanSeq2(): boolean {
    return typeCanSeq2(this)
  }
}

// Pointer type implementation
class PointerType implements Type {
  constructor(
    private _elemType: Type,
    private _methods: $.MethodSignature[] = [],
  ) {}

  public String(): string {
    return $.goTypeString(this.runtimeString())
  }

  public runtimeString(): string {
    return '*' + runtimeTypeString(this._elemType)
  }

  public Kind(): Kind {
    return Ptr
  }

  public Comparable(): boolean {
    return true
  }

  public Size(): number {
    return 8 // pointer size
  }

  public Elem(): Type {
    return this._elemType
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public PkgPath(): string {
    return ''
  }

  public Name(): string {
    // Pointer types are unnamed composite types
    return ''
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByIndex(index: $.Slice<number>): StructField {
    return typeFieldByIndex(this, index)
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public ConvertibleTo(u: Type | null): boolean {
    return typeConvertibleTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public OverflowInt(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on pointer Type')
  }

  public OverflowUint(_x: bigint): boolean {
    throw new Error(
      'reflect: call of reflect.Type.OverflowUint on pointer Type',
    )
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error(
      'reflect: call of reflect.Type.OverflowFloat on pointer Type',
    )
  }

  public NumMethod(): number {
    return typeMethods(this).length
  }
  public Method(i: number): Method {
    return typeMethod(this, i)
  }
  public MethodByName(name: string): [Method, boolean] {
    return typeMethodByName(this, name)
  }

  public methodSignatures(): $.MethodSignature[] {
    return this._methods
  }

  public mergeMethodSignatures(methods: $.MethodSignature[]): void {
    this._methods = mergeMethodSignatureList(this._methods, methods)
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on pointer Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on pointer Type')
  }

  public ChanDir(): ChanDir {
    return nonChanTypePanic(this)
  }

  public CanSeq(): boolean {
    return typeCanSeq(this)
  }

  public CanSeq2(): boolean {
    return typeCanSeq2(this)
  }
}

// Function type implementation
interface FunctionTypeDescriptor {
  name?: string
  signature?: string
  params?: Type[]
  results?: Type[]
  variadic?: boolean
  methods?: $.MethodSignature[]
}

class FunctionType implements Type {
  private _name: string
  private _signature: string
  private _params: Type[]
  private _results: Type[]
  private _variadic: boolean
  private _hasSignature: boolean
  private _methods: $.MethodSignature[]

  constructor(signatureOrDescriptor: string | FunctionTypeDescriptor) {
    if (typeof signatureOrDescriptor === 'string') {
      this._name = ''
      this._signature = signatureOrDescriptor
      this._params = []
      this._results = []
      this._variadic = false
      this._hasSignature = false
      this._methods = []
      return
    }

    this._name = signatureOrDescriptor.name ?? ''
    this._params = signatureOrDescriptor.params ?? []
    this._results = signatureOrDescriptor.results ?? []
    this._variadic = signatureOrDescriptor.variadic ?? false
    this._hasSignature =
      signatureOrDescriptor.signature !== undefined ||
      signatureOrDescriptor.params !== undefined ||
      signatureOrDescriptor.results !== undefined
    this._methods = signatureOrDescriptor.methods ?? []
    this._signature =
      signatureOrDescriptor.signature ??
      formatFunctionSignature(this._params, this._results, this._variadic)
  }

  public String(): string {
    return $.goTypeString(this.runtimeString())
  }

  public runtimeString(): string {
    return this._name !== '' ? this._name : this._signature
  }

  public Kind(): Kind {
    return Func
  }

  public Comparable(): boolean {
    return false
  }

  public Size(): number {
    return 8 // function pointer size
  }

  public Elem(): Type {
    throw new Error('reflect: Elem of invalid type')
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return this._params.length
  }

  public In(i: number): Type {
    if (i < 0 || i >= this._params.length) {
      throw new Error(
        `reflect: In index out of range [${i}] with length ${this._params.length}`,
      )
    }
    return this._params[i]
  }

  public NumOut(): number {
    return this._results.length
  }

  public Out(i: number): Type {
    if (i < 0 || i >= this._results.length) {
      throw new Error(
        `reflect: Out index out of range [${i}] with length ${this._results.length}`,
      )
    }
    return this._results[i]
  }

  public IsVariadic(): boolean {
    return this._variadic
  }

  public PkgPath(): string {
    return this._name !== '' ? $.typePackagePath(this._name) : ''
  }

  public Name(): string {
    if (this._name !== '') {
      return typeNameName(this._name)
    }
    return ''
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByIndex(index: $.Slice<number>): StructField {
    return typeFieldByIndex(this, index)
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public ConvertibleTo(u: Type | null): boolean {
    return typeConvertibleTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public OverflowInt(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on func Type')
  }

  public OverflowUint(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowUint on func Type')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowFloat on func Type')
  }

  public NumMethod(): number {
    return typeMethods(this).length
  }
  public Method(i: number): Method {
    return typeMethod(this, i)
  }
  public MethodByName(name: string): [Method, boolean] {
    return typeMethodByName(this, name)
  }

  public methodSignatures(): $.MethodSignature[] {
    return this._methods
  }

  public mergeMethodSignatures(methods: $.MethodSignature[]): void {
    this._methods = mergeMethodSignatureList(this._methods, methods)
  }

  public mergeSignature(source: FunctionType): void {
    if (!source._hasSignature || this._hasSignature) {
      return
    }
    this._params = source._params
    this._results = source._results
    this._variadic = source._variadic
    this._signature = source._signature
    this._hasSignature = true
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on func Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on func Type')
  }

  public ChanDir(): ChanDir {
    return nonChanTypePanic(this)
  }

  public CanSeq(): boolean {
    return typeCanSeq(this)
  }

  public CanSeq2(): boolean {
    return typeCanSeq2(this)
  }
}

function formatFunctionSignature(
  params: Type[],
  results: Type[],
  variadic: boolean,
): string {
  const paramStrings = params.map((param, index) => {
    const typeName = runtimeTypeString(param)
    if (!variadic || index !== params.length - 1) {
      return typeName
    }
    if (typeName.startsWith('[]')) {
      return '...' + typeName.slice(2)
    }
    return '...' + typeName
  })
  let signature = `func(${paramStrings.join(', ')})`
  if (results.length === 1) {
    signature += ` ${runtimeTypeString(results[0])}`
  } else if (results.length > 1) {
    signature += ` (${results.map((result) => runtimeTypeString(result)).join(', ')})`
  }
  return signature
}

async function callReflectFunction(
  fn: (...args: unknown[]) => unknown | Promise<unknown>,
  fnType: Type,
  inArgs: $.Slice<Value>,
  op: ReflectCallOp,
): Promise<$.Slice<Value>> {
  const args = $.asArray(inArgs)
  const rawArgs = reflectCallRawArgs(fnType, args, op)
  const result = await fn(...rawArgs)
  return normalizeReflectCallResults(fnType, result)
}

type ReflectCallOp = 'Call' | 'CallSlice'

function reflectCallRawArgs(
  fnType: Type,
  args: Value[],
  op: ReflectCallOp,
): unknown[] {
  if (op === 'CallSlice') {
    return reflectCallSliceRawArgs(fnType, args)
  }
  if (!fnType.IsVariadic()) {
    validateReflectCallInputCount(fnType, args.length)
    return args.map((arg, index) =>
      reflectCallValueInterface(op, arg, fnType.In(index), index),
    )
  }
  const fixedCount = fnType.NumIn() - 1
  if (args.length < fixedCount) {
    throw new Error('reflect: Call with too few input arguments')
  }
  const rawArgs: unknown[] = []
  for (let i = 0; i < fixedCount; i++) {
    rawArgs.push(reflectCallValueInterface(op, args[i], fnType.In(i), i))
  }
  const variadicElemType = fnType.In(fixedCount).Elem()
  const variadicValues = args.slice(fixedCount)
  for (let i = 0; i < variadicValues.length; i++) {
    const value = variadicValues[i]
    if (!value.IsValid()) {
      throw new Error(`reflect: ${op} using zero Value argument`)
    }
    if (!value.Type().AssignableTo(variadicElemType)) {
      throw new Error(
        `reflect: cannot use ${value.Type().String()} as type ${variadicElemType.String()} in ${op}`,
      )
    }
  }
  rawArgs.push(
    $.arrayToSlice(
      variadicValues.map((value) => valueForTarget(value, variadicElemType)),
    ),
  )
  return rawArgs
}

function reflectCallSliceRawArgs(fnType: Type, args: Value[]): unknown[] {
  if (!fnType.IsVariadic()) {
    throw new Error('reflect: CallSlice of non-variadic function')
  }
  const expected = fnType.NumIn()
  if (args.length < expected) {
    throw new Error('reflect: CallSlice with too few input arguments')
  }
  if (args.length > expected) {
    throw new Error('reflect: CallSlice with too many input arguments')
  }
  return args.map((arg, index) =>
    reflectCallValueInterface('CallSlice', arg, fnType.In(index), index),
  )
}

function reflectCallValueInterface(
  op: ReflectCallOp,
  value: Value,
  target: Type,
  _index: number,
): unknown {
  if (!value.IsValid()) {
    throw new Error(`reflect: ${op} using zero Value argument`)
  }
  if (!value.Type().AssignableTo(target)) {
    throw new Error(
      `reflect: ${op} using ${value.Type().String()} as type ${target.String()}`,
    )
  }
  return valueForTarget(value, target)
}

function validateReflectCallInputCount(fnType: Type, actual: number): void {
  const expected = fnType.NumIn()
  if (actual !== expected) {
    throw new Error(
      `reflect: Call with ${actual} input arguments for function with ${expected} inputs`,
    )
  }
}

function normalizeReflectCallResults(
  fnType: Type,
  result: unknown,
): $.Slice<Value> {
  const expected = fnType.NumOut()
  if (expected === 0) {
    if (result !== undefined) {
      throw new Error(
        'reflect: Call returned 1 results for function with 0 outputs',
      )
    }
    return $.makeSlice<Value>(0)
  }
  if (expected === 1) {
    return $.arrayToSlice([new Value(result as ReflectValue, fnType.Out(0))])
  }
  if (!globalThis.Array.isArray(result)) {
    throw new Error(
      `reflect: Call returned 1 results for function with ${expected} outputs`,
    )
  }
  if (result.length !== expected) {
    throw new Error(
      `reflect: Call returned ${result.length} results for function with ${expected} outputs`,
    )
  }
  return $.arrayToSlice(
    result.map(
      (value, index) => new Value(value as ReflectValue, fnType.Out(index)),
    ),
  )
}

export function MakeFunc(
  typ: Type | null,
  fn:
    | ((args: $.Slice<Value>) => $.Slice<Value> | Promise<$.Slice<Value>>)
    | null,
): Value {
  if (!typ || typ.Kind() !== Func) {
    throw new Error('reflect: call of MakeFunc with non-Func type')
  }
  if (typeof fn !== 'function') {
    throw new Error('reflect.MakeFunc: nil implementation')
  }
  const typeInfo = functionTypeInfoFromType(typ)
  const wrapper = $.functionValue(async (...rawArgs: unknown[]) => {
    const args = makeFuncArgs(typ, rawArgs)
    const resultValues = $.asArray(await fn($.arrayToSlice(args)))
    validateMakeFuncResults(typ, resultValues)
    if (typ.NumOut() === 0) {
      return undefined
    }
    if (typ.NumOut() === 1) {
      return valueForTarget(resultValues[0], typ.Out(0))
    }
    return resultValues.map((value, index) =>
      valueForTarget(value, typ.Out(index)),
    )
  }, typeInfo)
  return new Value(wrapper, typ)
}

function makeFuncArgs(typ: Type, rawArgs: unknown[]): Value[] {
  validateReflectCallInputCount(typ, rawArgs.length)
  return rawArgs.map((arg, index) => {
    // An argument of a concrete type is a value of the parameter's type, such
    // as a struct object for a pointer to a struct; an interface argument has
    // its dynamic type.
    const target = typ.In(index)
    if (target.Kind() !== Interface) {
      return new Value(arg as ReflectValue, target)
    }
    const value = ValueOf(arg as ReflectValue)
    if (!value.Type().AssignableTo(target)) {
      throw new Error(
        `reflect.MakeFunc: cannot use ${value.Type().String()} as type ${target.String()} in argument ${index}`,
      )
    }
    return value
  })
}

function validateMakeFuncResults(typ: Type, resultValues: Value[]): void {
  const expected = typ.NumOut()
  if (resultValues.length !== expected) {
    throw new Error(
      `reflect.MakeFunc: returned ${resultValues.length} results for function with ${expected} outputs`,
    )
  }
  for (let i = 0; i < resultValues.length; i++) {
    const result = resultValues[i]
    if (!result.IsValid()) {
      throw new Error(`reflect.MakeFunc: returned zero Value for result ${i}`)
    }
    const target = typ.Out(i)
    if (!result.Type().AssignableTo(target)) {
      throw new Error(
        `reflect.MakeFunc: cannot use ${result.Type().String()} as type ${target.String()} in result ${i}`,
      )
    }
  }
}

// valueForTarget returns the value v holds as passed to or returned from a
// function as the target type: boxed with its type for an interface target,
// and the raw value otherwise.
function valueForTarget(value: Value, target: Type): unknown {
  const raw = value.Interface()
  if (target.Kind() === Interface) {
    return raw
  }
  return unwrapGoInterfaceBox(raw)
}

function unwrapGoInterfaceBox(value: unknown): unknown {
  if (
    value !== null &&
    value !== undefined &&
    typeof value === 'object' &&
    '__goValue' in value
  ) {
    return (value as { __goValue: unknown }).__goValue
  }
  return value
}

// Map type implementation
class MapType implements Type {
  constructor(
    private _keyType: Type,
    private _elemType: Type,
    private _typeName: string = '',
  ) {}

  public String(): string {
    return $.goTypeString(this.runtimeString())
  }

  public runtimeString(): string {
    return (
      this._typeName ||
      `map[${runtimeTypeString(this._keyType)}]${runtimeTypeString(this._elemType)}`
    )
  }

  public Kind(): Kind {
    return Map
  }

  public Comparable(): boolean {
    return false
  }

  public Size(): number {
    return 8 // map header size
  }

  public Elem(): Type {
    return this._elemType
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public Key(): Type {
    return this._keyType
  }

  public PkgPath(): string {
    return typeNamePkgPath(this._typeName)
  }

  public Name(): string {
    return typeNameName(this._typeName)
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByIndex(index: $.Slice<number>): StructField {
    return typeFieldByIndex(this, index)
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public ConvertibleTo(u: Type | null): boolean {
    return typeConvertibleTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public OverflowInt(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on map Type')
  }

  public OverflowUint(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowUint on map Type')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowFloat on map Type')
  }

  public NumMethod(): number {
    return typeMethods(this).length
  }
  public Method(i: number): Method {
    return typeMethod(this, i)
  }
  public MethodByName(name: string): [Method, boolean] {
    return typeMethodByName(this, name)
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on map Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on map Type')
  }

  public ChanDir(): ChanDir {
    return nonChanTypePanic(this)
  }

  public CanSeq(): boolean {
    return typeCanSeq(this)
  }

  public CanSeq2(): boolean {
    return typeCanSeq2(this)
  }
}

// Struct type implementation
function typeImplementsInterface(t: Type, interfaceType: Type): boolean {
  if (interfaceType.Kind() !== Interface) {
    throw new Error('reflect: non-interface type passed to Type.Implements')
  }
  const requiredMethods = typeMethods(interfaceType)
  if (requiredMethods.length === 0) {
    return true
  }
  const methods = typeMethods(t)
  return requiredMethods.every((requiredMethod) => {
    const method = methods.find(
      (candidate) => candidate.name === requiredMethod.name,
    )
    return (
      method !== undefined && methodSignatureIdentical(method, requiredMethod)
    )
  })
}

function methodSignatureIdentical(
  actual: $.MethodSignature,
  required: $.MethodSignature,
): boolean {
  return (
    methodArgListIdentical(actual.args, required.args) &&
    methodArgListIdentical(actual.returns, required.returns)
  )
}

function methodArgListIdentical(
  actual: $.MethodArg[],
  required: $.MethodArg[],
): boolean {
  if (actual.length !== required.length) {
    return false
  }
  return actual.every(
    (arg, index) =>
      methodArgIdentityKey(arg) === methodArgIdentityKey(required[index]),
  )
}

function methodArgIdentityKey(arg: $.MethodArg): string {
  return typeInfoIdentityKey(arg.type, new Set())
}

function methodSignatureIdentityKey(method: $.MethodSignature): string {
  const args = method.args.map(methodArgIdentityKey).join(',')
  const returns = method.returns.map(methodArgIdentityKey).join(',')
  return `${method.name}(${args})(${returns})`
}

function mergeMethodSignatureList(
  existing: $.MethodSignature[],
  incoming: $.MethodSignature[],
): $.MethodSignature[] {
  if (incoming.length === 0) {
    return existing
  }
  const merged = [...existing]
  for (const method of incoming) {
    const existingIndex = merged.findIndex(
      (candidate) => candidate.name === method.name,
    )
    if (existingIndex === -1) {
      merged.push(method)
      continue
    }
    if (
      methodSignatureIdentityKey(merged[existingIndex]) !==
      methodSignatureIdentityKey(method)
    ) {
      merged[existingIndex] = method
    }
  }
  return merged.sort((left, right) => $.stringCompare(left.name, right.name))
}

function typeInfoIdentityKey(
  info: $.TypeInfo | string,
  seen: Set<string>,
): string {
  // GoError, the TypeScript name of the error interface, is error.
  if (isGoErrorTypeInfo(info)) {
    info = 'error'
  }
  if (typeof info === 'string') {
    const registered = builtinGetTypeByName(info)
    if (!registered) {
      return `named:${info}`
    }
    const registeredName = registered.name ?? info
    if (registeredName !== '') {
      return `named:${registeredName}`
    }
    if (seen.has(info)) {
      return `named:${info}`
    }
    seen.add(info)
    const key = typeInfoIdentityKey(registered, seen)
    seen.delete(info)
    return key
  }
  switch (info.kind) {
    case $.TypeKind.Basic:
      if (info.typeName) {
        return `named:${info.typeName}`
      }
      return `basic:${info.name ?? 'unknown'}`
    case $.TypeKind.Interface:
      if (info.name) {
        return `named:${info.name}`
      }
      return `interface:${(info.methods ?? [])
        .map(methodSignatureIdentityKey)
        .join('|')}`
    case $.TypeKind.Struct:
      if (info.name) {
        return `named:${info.name}`
      }
      return `struct:${(info.fields ?? [])
        .map((field) =>
          [
            field.name,
            field.pkgPath ?? '',
            field.tag ?? '',
            field.anonymous === true ? 'anonymous' : 'named',
            typeInfoIdentityKey(field.type, seen),
          ].join('\u0000'),
        )
        .join('\u0001')}`
    case $.TypeKind.Pointer:
      return `ptr:${typeInfoIdentityKey(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Slice:
      return `slice:${typeInfoIdentityKey(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Array:
      return `array:${info.length}:${typeInfoIdentityKey(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Map:
      return `map:${typeInfoIdentityKey(
        info.keyType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}:${typeInfoIdentityKey(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Function:
      if (info.name) {
        return `named:${info.name}`
      }
      return `func:${info.isVariadic === true}:${(info.params ?? [])
        .map((param) => typeInfoIdentityKey(param, seen))
        .join(',')}:${(info.results ?? [])
        .map((result) => typeInfoIdentityKey(result, seen))
        .join(',')}`
    case $.TypeKind.Channel:
      return `chan:${info.direction ?? 'both'}:${typeInfoIdentityKey(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    default:
      return 'unknown'
  }
}

function typeFieldByName(t: Type, name: string): [StructField, boolean] {
  return typeFieldByNameFunc(t, (fieldName) => fieldName === name)
}

function typeFieldByNameFunc(
  t: Type,
  match: (name: string) => boolean,
): [StructField, boolean] {
  if (t.Kind() !== Struct) {
    throw new Error('reflect: FieldByName of non-struct type')
  }
  for (const field of visibleStructFields(t)) {
    if (match(field.Name)) {
      return [field, true]
    }
  }
  return [new StructField(), false]
}

export function visibleStructFields(t: Type): StructField[] {
  const fields: StructField[] = []
  const byName = new globalThis.Map<string, number>()
  const visiting = new Set<Type>()
  const index: number[] = []

  const walk = (typ: Type): void => {
    if (visiting.has(typ)) {
      return
    }
    visiting.add(typ)
    for (let i = 0; i < typ.NumField(); i++) {
      const field = typ.Field(i).clone()
      index.push(i)

      let add = true
      const oldIndex = byName.get(field.Name)
      if (oldIndex !== undefined) {
        const old = fields[oldIndex]
        if (index.length === $.len(old.Index)) {
          old.Name = ''
          add = false
        } else if (index.length < $.len(old.Index)) {
          old.Name = ''
        } else {
          add = false
        }
      }
      if (add) {
        field.Index = $.arrayToSlice([...index])
        byName.set(field.Name, fields.length)
        fields.push(field)
      }

      if (field.Anonymous) {
        let fieldType = field.Type!
        if (fieldType.Kind() === Ptr) {
          fieldType = fieldType.Elem()
        }
        if (fieldType.Kind() === Struct) {
          walk(fieldType)
        }
      }

      index.pop()
    }
    visiting.delete(typ)
  }

  walk(t)
  return fields.filter((field) => field.Name !== '')
}

function zeroMethod(): Method {
  return new Method({
    Type: new BasicType(Invalid, '<invalid>'),
    Func: () => undefined,
  })
}

function methodFromSignature(
  signature: $.MethodSignature,
  index: number,
  receiver: Type,
): Method {
  return new Method({
    Name: signature.name,
    Type: methodTypeFromSignature(
      signature,
      receiver,
      receiver.Kind() !== Interface,
    ),
    Func: () => undefined,
    Index: index,
  })
}

function methodTypeFromSignature(
  signature: $.MethodSignature,
  receiver: Type,
  includeReceiver: boolean,
): Type {
  const params = signature.args.map(methodArgType)
  if (includeReceiver) {
    params.unshift(receiver)
  }
  return new FunctionType({
    params,
    results: signature.returns.map(methodArgType),
    variadic: signature.variadic === true,
  })
}

function methodArgType(arg: $.MethodArg): Type {
  return typeFromTypeInfoWithSeen(arg.type, new Set())
}

// runtimeTypeString returns the runtime type string of t, which names the
// types of packages that share a name with another package by the package's
// runtime name (see goTypeString), for looking up and identifying types.
export function runtimeTypeString(t: Type): string {
  return t.runtimeString !== undefined ? t.runtimeString() : t.String()
}

// typeNamePkgPath returns the package path of a qualified type name such as
// "pkg.Name", or '' for an unnamed type.
function typeNamePkgPath(typeName: string): string {
  const dotIndex = typeName.lastIndexOf('.')
  return dotIndex > 0 ? typeName.substring(0, dotIndex) : ''
}

// typeNameName returns the Go name of a named type from its runtime name:
// the part after the package qualifier, without the hash that the runtime
// name of a local type has when another type of its package has its name.
function typeNameName(typeName: string): string {
  const dotIndex = typeName.lastIndexOf('.')
  return $.goTypeString(dotIndex >= 0 ? typeName.substring(dotIndex + 1) : typeName)
}

// typeMethods returns the method set of t. A type that is not a pointer has
// only the methods with value receivers, as in Go, so the methods that need a
// pointer receiver are left out of its registered methods.
function typeMethods(t: Type): $.MethodSignature[] {
  const methods = registeredTypeMethods(t)
  if (t.Kind() === Ptr || !methods.some((m) => m.pointerReceiver === true)) {
    return methods
  }
  return methods.filter((method) => method.pointerReceiver !== true)
}

// registeredTypeMethods returns the methods registered for t, including those
// that are only in the method set of a pointer to it.
function registeredTypeMethods(t: Type): $.MethodSignature[] {
  // A named non-struct type, such as a named map, slice or basic type, or a
  // pointer to one, has its method set registered by its type string.
  const named = $.namedValueMethods(runtimeTypeString(t))
  if (named !== undefined) {
    return named.signatures
  }

  // Any other type is looked up by name: its own, its element's if it is a
  // pointer, or the registered name of an interface.
  let typeInfo = builtinGetTypeByName(runtimeTypeString(t))
  if (!typeInfo && t.Kind() === Ptr) {
    typeInfo = builtinGetTypeByName(runtimeTypeString(t.Elem()))
  }
  if (!typeInfo && t instanceof InterfaceType) {
    const registeredName = t.registeredName()
    if (registeredName) {
      typeInfo = builtinGetTypeByName(registeredName)
    }
  }

  // A type that is not registered carries its own method signatures.
  if (!typeInfo && t instanceof InterfaceType) {
    return t.methodSignatures()
  }
  if (!typeInfo && t instanceof PointerType) {
    return mergeMethodSignatureList(typeMethods(t.Elem()), t.methodSignatures())
  }
  if (!typeInfo && t instanceof BasicType) {
    return t.methodSignatures()
  }
  if (!typeInfo && t instanceof FunctionType) {
    return t.methodSignatures()
  }
  if (!typeInfo) {
    return []
  }

  // A registered interface, or a pointer to a registered struct, has all the
  // methods listed in its type info.
  if (isInterfaceTypeInfo(typeInfo)) {
    return typeInfo.methods || []
  }
  if (!isStructTypeInfo(typeInfo)) {
    return []
  }
  const methods = typeInfo.methods || []
  if (t.Kind() === Ptr) {
    return methods
  }

  // A struct value has only the methods with value receivers.
  return methods.filter((method) => !method.pointerReceiver)
}

function methodSignatureByName(
  t: Type,
  name: string,
): [$.MethodSignature | undefined, number] {
  const methods = typeMethods(t)
  const index = methods.findIndex((method) => method.name === name)
  if (index === -1) {
    return [undefined, -1]
  }
  return [methods[index], index]
}

// typeMethod returns the i'th method of the method set of t, and panics, as
// Go does, when i is out of range.
function typeMethod(t: Type, i: number): Method {
  const methods = typeMethods(t)
  if (i < 0 || i >= methods.length) {
    throw new Error('reflect: Method index out of range')
  }
  return methodFromSignature(methods[i], i, t)
}

function typeMethodByName(t: Type, name: string): [Method, boolean] {
  const [signature, index] = methodSignatureByName(t, name)
  if (!signature) {
    return [zeroMethod(), false]
  }
  return [methodFromSignature(signature, index, t), true]
}

function typeAssignableTo(t: Type, u: Type | null): boolean {
  if (u === null) {
    return false
  }
  if (typeIdentityKey(t) === typeIdentityKey(u)) {
    return true
  }
  if (
    (!typeIsNamed(t) || !typeIsNamed(u)) &&
    typeUnderlyingIdentityKey(t) === typeUnderlyingIdentityKey(u)
  ) {
    return true
  }
  if (u.Kind() !== Interface) {
    return false
  }
  return t.Implements(u)
}

// typeConvertibleTo follows reflect's type-level rules; slice length checks
// remain part of the value conversion to an array or array pointer.
function typeConvertibleTo(source: Type, target: Type | null): boolean {
  if (target === null) {
    throw new Error('reflect: nil type passed to Type.ConvertibleTo')
  }
  const from = source.Kind()
  const to = target.Kind()
  if (from >= Int && from <= Float64 && to >= Int && to <= Float64) return true
  if (from >= Int && from <= Uintptr && to === String) return true
  if (
    (from === Complex64 || from === Complex128) &&
    (to === Complex64 || to === Complex128)
  )
    return true
  if (
    from === String &&
    to === Slice &&
    (target.Elem().Kind() === Uint8 || target.Elem().Kind() === Int32)
  )
    return true
  if (from === Slice) {
    const element = source.Elem()
    if (to === String && (element.Kind() === Uint8 || element.Kind() === Int32))
      return true
    const array = to === Ptr ? target.Elem() : target
    if (
      array.Kind() === Array &&
      typeIdentityKey(element) === typeIdentityKey(array.Elem())
    )
      return true
  }
  if (
    from === Chan &&
    to === Chan &&
    channelDirectionFromString(source.String()) === 'both' &&
    (!typeIsNamed(source) || !typeIsNamed(target)) &&
    typeIdentityKey(source.Elem()) === typeIdentityKey(target.Elem())
  )
    return true
  if (conversionUnderlyingEqual(source, target, new globalThis.Map()))
    return true
  if (
    from === Ptr &&
    to === Ptr &&
    !typeIsNamed(source) &&
    !typeIsNamed(target) &&
    conversionUnderlyingEqual(
      source.Elem(),
      target.Elem(),
      new globalThis.Map(),
    )
  )
    return true
  return to === Interface && source.Implements(target)
}

// conversionTypeEqual preserves named member identities while ignoring tags.
function conversionTypeEqual(
  source: Type,
  target: Type,
  seen: Map<Type, Set<Type>>,
): boolean {
  return (
    source.Name() === target.Name() &&
    source.PkgPath() === target.PkgPath() &&
    conversionUnderlyingEqual(source, target, seen)
  )
}

// conversionUnderlyingEqual compares the underlying type without struct tags.
function conversionUnderlyingEqual(
  source: Type,
  target: Type,
  seen: Map<Type, Set<Type>>,
): boolean {
  if (source === target) return true
  const kind = source.Kind()
  if (kind !== target.Kind()) return false
  if (
    (kind >= Bool && kind <= Complex128) ||
    kind === String ||
    kind === UnsafePointer
  )
    return true
  if (seen.get(source)?.has(target)) return true
  const targets = seen.get(source) ?? new Set<Type>()
  targets.add(target)
  seen.set(source, targets)
  switch (kind) {
    case Array:
      return (
        source.Len() === target.Len() &&
        conversionTypeEqual(source.Elem(), target.Elem(), seen)
      )
    case Chan:
      return (
        channelDirectionFromString(source.String()) ===
          channelDirectionFromString(target.String()) &&
        conversionTypeEqual(source.Elem(), target.Elem(), seen)
      )
    case Ptr:
    case Slice:
      return conversionTypeEqual(source.Elem(), target.Elem(), seen)
    case Map:
      return (
        conversionTypeEqual(source.Key(), target.Key(), seen) &&
        conversionTypeEqual(source.Elem(), target.Elem(), seen)
      )
    case Func:
      if (
        source.NumIn() !== target.NumIn() ||
        source.NumOut() !== target.NumOut() ||
        source.IsVariadic() !== target.IsVariadic()
      )
        return false
      for (let index = 0; index < source.NumIn(); index++) {
        if (!conversionTypeEqual(source.In(index), target.In(index), seen))
          return false
      }
      for (let index = 0; index < source.NumOut(); index++) {
        if (!conversionTypeEqual(source.Out(index), target.Out(index), seen))
          return false
      }
      return true
    case Interface:
      return source.NumMethod() === 0 && target.NumMethod() === 0
    case Struct:
      if (source.NumField() !== target.NumField()) return false
      for (let index = 0; index < source.NumField(); index++) {
        const left = source.Field(index)
        const right = target.Field(index)
        if (
          left.Name !== right.Name ||
          left.PkgPath !== right.PkgPath ||
          left.Anonymous !== right.Anonymous ||
          !conversionTypeEqual(left.Type!, right.Type!, seen)
        )
          return false
      }
      return true
    default:
      return false
  }
}

export function structFieldStorageKey(t: Type, i: number): string {
  if (t instanceof StructType) {
    return t.fieldKey(i)
  }
  return t.Field(i).Name
}

interface StructFieldDescriptor {
  name: string
  key: string
  type: Type
  tag?: string
  pkgPath: string
  anonymous: boolean
  index: number[]
  offset: number
  exported: boolean
}

function typeAlignment(typ: Type): number {
  switch (typ.Kind()) {
    case Bool:
    case Int8:
    case Uint8:
      return 1
    case Int16:
    case Uint16:
      return 2
    case Int32:
    case Uint32:
    case Float32:
    case Complex64:
      return 4
    case Array:
      return typeAlignment(typ.Elem())
    case Struct: {
      let align = 1
      for (let i = 0; i < typ.NumField(); i++) {
        align = Math.max(align, typeAlignment(typ.Field(i).Type!))
      }
      return align
    }
    default:
      return 8
  }
}

function alignOffset(offset: number, alignment: number): number {
  if (alignment <= 1) {
    return offset
  }
  return Math.ceil(offset / alignment) * alignment
}

function structDescriptorSize(fields: StructFieldDescriptor[]): number {
  let size = 0
  let alignment = 1
  for (const field of fields) {
    alignment = Math.max(alignment, typeAlignment(field.type))
    size = Math.max(size, field.offset + field.type.Size())
  }
  return alignOffset(size, alignment)
}

class StructType implements Type {
  constructor(
    private _name: string,
    private _fields: StructFieldDescriptor[] = [],
    private _pkgPath = '',
    private _string = _name,
  ) {}

  public String(): string {
    return $.goTypeString(this.runtimeString())
  }

  public runtimeString(): string {
    return this._string
  }

  public Kind(): Kind {
    return Struct
  }

  public Comparable(): boolean {
    return this._fields.every((field) => field.type.Comparable())
  }

  public Size(): number {
    return structDescriptorSize(this._fields)
  }

  public Elem(): Type {
    throw new Error('reflect: Elem of invalid type')
  }

  public NumField(): number {
    return this._fields.length
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public PkgPath(): string {
    if (this._pkgPath !== '') {
      return this._pkgPath
    }
    if (this._name === '') {
      return ''
    }
    return $.typePackagePath(this._name)
  }

  public Name(): string {
    if (this._name === '') {
      return ''
    }
    // Extract type name from full type name (e.g., "main.Person" -> "Person")
    return typeNameName(this._name)
  }

  public Field(i: number): StructField {
    if (i < 0 || i >= this.NumField()) {
      throw new Error(
        `reflect: Field index out of range [${i}] with length ${this.NumField()}`,
      )
    }
    const f = this._fields[i]
    return new StructField({
      Name: f.name,
      PkgPath: f.pkgPath,
      Type: f.type,
      Tag: f.tag ?? '',
      Offset: f.offset,
      Index: [...f.index],
      Anonymous: f.anonymous,
    })
  }

  public fieldKey(i: number): string {
    if (i < 0 || i >= this.NumField()) {
      throw new Error(
        `reflect: Field index out of range [${i}] with length ${this.NumField()}`,
      )
    }
    return this._fields[i].key
  }

  public descriptors(): StructFieldDescriptor[] {
    return this._fields.map((field) => ({
      ...field,
      index: [...field.index],
    }))
  }

  public replaceDescriptors(fields: StructFieldDescriptor[]): void {
    this._fields = fields
  }

  public identityKey(seen: Set<Type>): string {
    if (this._name !== '') {
      return `struct:${this._name}`
    }
    const fields = this._fields
      .map((field) =>
        [
          field.name,
          field.pkgPath,
          field.tag ?? '',
          field.anonymous ? 'anonymous' : 'named',
          typeIdentityKey(field.type, seen),
        ].join('\u0000'),
      )
      .join('\u0001')
    return `struct:${this._pkgPath}:${this._name}:${fields}`
  }

  public underlyingIdentityKey(seen: Set<Type>): string {
    const fields = this._fields
      .map((field) =>
        [
          field.name,
          field.pkgPath,
          field.tag ?? '',
          field.anonymous ? 'anonymous' : 'named',
          typeIdentityKey(field.type, seen),
        ].join('\u0000'),
      )
      .join('\u0001')
    return `struct:${fields}`
  }

  public FieldByIndex(index: $.Slice<number>): StructField {
    return typeFieldByIndex(this, index)
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public ConvertibleTo(u: Type | null): boolean {
    return typeConvertibleTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public OverflowInt(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on struct Type')
  }

  public OverflowUint(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowUint on struct Type')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error(
      'reflect: call of reflect.Type.OverflowFloat on struct Type',
    )
  }

  public NumMethod(): number {
    return typeMethods(this).length
  }

  public Method(i: number): Method {
    return typeMethod(this, i)
  }
  public MethodByName(name: string): [Method, boolean] {
    return typeMethodByName(this, name)
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on struct Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on struct Type')
  }

  static createTypeFromFieldInfo(ti: any, seen = new Set<string>()): Type {
    if (typeof ti === 'string') {
      return basicTypeFromName(ti === 'number' ? 'int' : ti)
    } else if (ti && ti.kind) {
      // Handle TypeInfo objects from the builtin type system
      const name = ti.name || 'unknown'
      const typeName = ti.typeName || ''
      switch (ti.kind) {
        case 'basic':
          return basicTypeFromName(name === 'number' ? 'int' : name, typeName)
        case 'slice':
          if (ti.elemType) {
            return new SliceType(
              StructType.createTypeFromFieldInfo(ti.elemType, seen),
            )
          }
          return new SliceType(new BasicType(Invalid, 'unknown', 8))
        case 'pointer':
          if (ti.elemType) {
            return new PointerType(
              StructType.createTypeFromFieldInfo(ti.elemType, seen),
            )
          }
          return new PointerType(new BasicType(Invalid, 'unknown', 8))
        case 'interface':
          return interfaceTypeFromInfo(ti, seen)
        case 'struct': {
          const structName = ti.name ?? ''
          const fields = structFieldsFromTypeInfo(ti, seen)
          return new StructType(
            structName,
            fields,
            '',
            structName === '' ? structTypeString(fields) : structName,
          )
        }
        default:
          return new BasicType(Invalid, name, 8)
      }
    }
    return new BasicType(Invalid, 'unknown', 8)
  }

  public ChanDir(): ChanDir {
    return nonChanTypePanic(this)
  }

  public CanSeq(): boolean {
    return typeCanSeq(this)
  }

  public CanSeq2(): boolean {
    return typeCanSeq2(this)
  }
}

function basicTypeFromName(name: string, typeName = ''): BasicType {
  switch (name) {
    case 'string':
      return new BasicType(String, 'string', 16, typeName)
    case 'bool':
    case 'boolean':
      return new BasicType(Bool, 'bool', 1, typeName)
    case 'int':
      return new BasicType(Int, 'int', 8, typeName)
    case 'int8':
      return new BasicType(Int8, 'int8', 1, typeName)
    case 'int16':
      return new BasicType(Int16, 'int16', 2, typeName)
    case 'int32':
      return new BasicType(Int32, 'int32', 4, typeName)
    case 'int64':
      return new BasicType(Int64, 'int64', 8, typeName)
    case 'uint':
      return new BasicType(Uint, 'uint', 8, typeName)
    case 'uint8':
    case 'byte':
      return new BasicType(Uint8, name, 1, typeName)
    case 'uint16':
      return new BasicType(Uint16, 'uint16', 2, typeName)
    case 'uint32':
      return new BasicType(Uint32, 'uint32', 4, typeName)
    case 'uint64':
      return new BasicType(Uint64, 'uint64', 8, typeName)
    case 'uintptr':
      return new BasicType(Uintptr, 'uintptr', 8, typeName)
    case 'float32':
      return new BasicType(Float32, 'float32', 4, typeName)
    case 'float64':
      return new BasicType(Float64, 'float64', 8, typeName)
    case 'complex64':
      return new BasicType(Complex64, 'complex64', 8, typeName)
    case 'complex128':
      return new BasicType(Complex128, 'complex128', 16, typeName)
    default:
      return new BasicType(Invalid, name, 8, typeName)
  }
}

function typeFromGoTypeName(typeName: string): Type | null {
  const trimmed = typeName.trim()
  if (trimmed === '') return null

  if (trimmed.startsWith('<-chan ')) {
    return new ChannelType(
      typeFromGoTypeName(trimmed.slice(7)) ?? anyType(),
      RecvDir,
    )
  }
  if (trimmed.startsWith('chan<- ')) {
    return new ChannelType(
      typeFromGoTypeName(trimmed.slice(7)) ?? anyType(),
      SendDir,
    )
  }
  if (trimmed.startsWith('chan ')) {
    return new ChannelType(
      typeFromGoTypeName(trimmed.slice(5)) ?? anyType(),
      BothDir,
    )
  }
  if (trimmed.startsWith('[]')) {
    return new SliceType(typeFromGoTypeName(trimmed.slice(2)) ?? anyType())
  }
  if (trimmed.startsWith('*')) {
    return new PointerType(typeFromGoTypeName(trimmed.slice(1)) ?? anyType())
  }
  if (trimmed === 'struct{}' || trimmed === 'struct {}') {
    return new StructType('', [], '', 'struct {}')
  }
  if (trimmed === 'interface{}' || trimmed === 'any') {
    return anyType()
  }
  if (trimmed === 'error') {
    return new InterfaceType('error', 'error')
  }

  const registered = builtinGetTypeByName(trimmed)
  if (registered) {
    return typeFromTypeInfo(registered)
  }

  const basic = basicTypeFromName(trimmed)
  if (basic.Kind() !== Invalid) {
    return basic
  }

  return null
}

function channelTypeFromGoTypeName(typeName: string): Type | null {
  const typ = typeFromGoTypeName(typeName)
  if (typ?.Kind() === Chan) {
    return typ
  }
  return null
}

function anyType(): Type {
  return new BasicType(Interface, 'interface{}', 16)
}

function structFieldsFromTypeInfo(
  ti: $.StructTypeInfo,
  seen = new Set<string>(),
): StructFieldDescriptor[] {
  return (ti.fields || []).map((fieldInfo, index) => {
    return {
      name: fieldInfo.name,
      key: structFieldRuntimeKey(fieldInfo),
      type: typeFromTypeInfoWithSeen(fieldInfo.type, seen),
      tag: fieldInfo.tag,
      pkgPath: fieldInfo.pkgPath ?? '',
      anonymous: fieldInfo.anonymous ?? false,
      index: fieldInfo.index ? [...fieldInfo.index] : [index],
      offset: fieldInfo.offset ?? index * 8,
      exported: fieldInfo.exported ?? (fieldInfo.pkgPath ?? '') === '',
    }
  })
}

class ChannelType implements Type {
  constructor(
    private _elemType: Type,
    private _dir: ChanDir,
  ) {}

  public String(): string {
    return $.goTypeString(this.runtimeString())
  }

  public runtimeString(): string {
    // Format: chan T, <-chan T, or chan<- T
    const elem = runtimeTypeString(this._elemType)
    switch (this._dir) {
      case RecvDir:
        return `<-chan ${elem}`
      case SendDir:
        return `chan<- ${elem}`
      case BothDir:
      default:
        return `chan ${elem}`
    }
  }

  public Kind(): Kind {
    return Chan
  }

  public Comparable(): boolean {
    return true
  }

  public Size(): number {
    // Channels are represented as pointers, so pointer size
    return 8
  }

  public Elem(): Type {
    return this._elemType
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public PkgPath(): string {
    return ''
  }

  public Name(): string {
    // Channel types are unnamed composite types
    return ''
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByIndex(index: $.Slice<number>): StructField {
    return typeFieldByIndex(this, index)
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public ConvertibleTo(u: Type | null): boolean {
    return typeConvertibleTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public ChanDir(): ChanDir {
    return this._dir
  }

  public OverflowInt(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowInt on chan Type')
  }

  public OverflowUint(_x: bigint): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowUint on chan Type')
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error('reflect: call of reflect.Type.OverflowFloat on chan Type')
  }

  public NumMethod(): number {
    return 0
  }
  public Method(i: number): Method {
    return typeMethod(this, i)
  }
  public MethodByName(_name: string): [Method, boolean] {
    return [zeroMethod(), false]
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on chan Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on chan Type')
  }

  public CanSeq(): boolean {
    return typeCanSeq(this)
  }

  public CanSeq2(): boolean {
    return typeCanSeq2(this)
  }
}

// Interface type implementation
class InterfaceType implements Type {
  constructor(
    private _name: string = 'interface{}',
    private _registeredName?: string,
    private _methods: $.MethodSignature[] = [],
  ) {}

  public String(): string {
    // Go spells the empty interface type with a space.
    return $.goTypeString(this.runtimeString())
  }

  public runtimeString(): string {
    return this._name === 'interface{}' ? 'interface {}' : this._name
  }

  public Kind(): Kind {
    return Interface
  }

  public Comparable(): boolean {
    return true
  }

  public Size(): number {
    return 16
  }

  public Elem(): Type {
    throw new Error('reflect: Elem of invalid type')
  }

  public NumField(): number {
    return 0
  }

  public NumIn(): number {
    return nonFunctionTypePanic('NumIn', this)
  }

  public In(_i: number): Type {
    return nonFunctionTypePanic('In', this)
  }

  public NumOut(): number {
    return nonFunctionTypePanic('NumOut', this)
  }

  public Out(_i: number): Type {
    return nonFunctionTypePanic('Out', this)
  }

  public IsVariadic(): boolean {
    return nonFunctionTypePanic('IsVariadic', this)
  }

  public PkgPath(): string {
    if (isInterfaceLiteral(this._name)) {
      return ''
    }
    return $.typePackagePath(this._name)
  }

  public Name(): string {
    // An interface type literal is unnamed.
    if (isInterfaceLiteral(this._name)) {
      return ''
    }
    return typeNameName(this._name)
  }

  public Field(_i: number): StructField {
    throw new Error('reflect: Field of non-struct type')
  }

  public FieldByIndex(index: $.Slice<number>): StructField {
    return typeFieldByIndex(this, index)
  }

  public FieldByName(name: string): [StructField, boolean] {
    return typeFieldByName(this, name)
  }

  public FieldByNameFunc(
    match: (name: string) => boolean,
  ): [StructField, boolean] {
    return typeFieldByNameFunc(this, match)
  }

  public Key(): Type {
    throw new Error('reflect: Key of non-map type')
  }

  public Implements(u: Type | null): boolean {
    if (!u) {
      return false
    }
    if (u.Kind() !== Interface) {
      throw new Error('reflect: non-interface type passed to Type.Implements')
    }
    return typeImplementsInterface(this, u)
  }

  public AssignableTo(u: Type | null): boolean {
    return typeAssignableTo(this, u)
  }

  public ConvertibleTo(u: Type | null): boolean {
    return typeConvertibleTo(this, u)
  }

  public common?(): rtype {
    return new rtype(this.Kind())
  }

  public OverflowInt(_x: bigint): boolean {
    throw new Error(
      'reflect: call of reflect.Type.OverflowInt on interface Type',
    )
  }

  public OverflowUint(_x: bigint): boolean {
    throw new Error(
      'reflect: call of reflect.Type.OverflowUint on interface Type',
    )
  }

  public OverflowFloat(_x: number): boolean {
    throw new Error(
      'reflect: call of reflect.Type.OverflowFloat on interface Type',
    )
  }

  public NumMethod(): number {
    return typeMethods(this).length
  }

  public Method(i: number): Method {
    return typeMethod(this, i)
  }
  public MethodByName(name: string): [Method, boolean] {
    return typeMethodByName(this, name)
  }

  public Len(): number {
    throw new Error('reflect: call of reflect.Type.Len on interface Type')
  }

  public Bits(): number {
    throw new Error('reflect: call of reflect.Type.Bits on interface Type')
  }

  public registeredName(): string | undefined {
    return this._registeredName
  }

  public methodSignatures(): $.MethodSignature[] {
    return this._methods
  }

  public ChanDir(): ChanDir {
    return nonChanTypePanic(this)
  }

  public CanSeq(): boolean {
    return typeCanSeq(this)
  }

  public CanSeq2(): boolean {
    return typeCanSeq2(this)
  }
}

function getTypeOf(value: ReflectValue): Type {
  if ($.isTypedNilValue(value)) {
    const typedNil = value
    if (typedNil.__goTypeInfo !== undefined) {
      return typeFromTypeInfo(typedNil.__goTypeInfo)
    }
    if (typedNil.__goType.startsWith('*')) {
      const elemTypeName = typedNil.__goType.slice(1)
      return new PointerType(new InterfaceType(elemTypeName))
    }
  }

  if (value === null || value === undefined) {
    return new BasicType(Interface, 'interface{}', 16)
  }

  switch (typeof value) {
    case 'boolean':
      return new BasicType(Bool, 'bool', 1)
    case 'number':
      if (Number.isInteger(value)) {
        return new BasicType(Int, 'int', 8)
      }
      return new BasicType(Float64, 'float64', 8)
    case 'bigint':
      return new BasicType(Int64, 'int64', 8)
    case 'string':
      return new BasicType(String, 'string', 16)
    case 'function': {
      // Check if this function has GoScript type information attached
      const funcWithMeta = value as any

      // First check for __typeInfo which contains the function signature
      if (funcWithMeta.__typeInfo) {
        const typeInfo = funcWithMeta.__typeInfo
        if (
          (typeInfo.kind === 'function' || typeInfo.kind === 'Function') &&
          typeInfo.params &&
          typeInfo.results
        ) {
          const named = funcWithMeta.__goTypeName && !typeInfo.name
          const infoKey = typeInfoCacheKey(typeInfo)
          const cacheKey =
            infoKey === '' ? '' : (
              infoKey + (named ? '#' + funcWithMeta.__goTypeName : '')
            )
          if (cacheKey !== '') {
            const cached = functionValueTypes.get(cacheKey)
            if (cached !== undefined) {
              return cached
            }
          }
          const typ =
            named ?
              functionTypeFromInfo({
                ...typeInfo,
                name: funcWithMeta.__goTypeName,
              })
            : functionTypeFromInfo(typeInfo)
          if (cacheKey !== '') {
            functionValueTypes.set(cacheKey, typ)
          }
          return typ
        }
      }

      // Then check for __goTypeName which indicates a typed function
      if (funcWithMeta.__goTypeName) {
        const typeName = funcWithMeta.__goTypeName
        return new FunctionType({ name: typeName })
      }

      // For untyped functions, try to parse the signature
      const funcStr = value.toString()
      let signature = 'func'

      // Simple pattern matching for basic function signatures
      const match = funcStr.match(/function\s*\([^)]*\)/)
      if (match) {
        const params = match[0].replace('function', '').trim()
        // This is a simplified version - real implementation would need more sophisticated parsing
        if (params === '()') {
          signature = 'func()'
        } else if (params.includes(',')) {
          const paramCount = params.split(',').length
          signature = `func(${globalThis.Array(paramCount).fill('any').join(', ')})`
        } else if (params !== '()') {
          signature = 'func(any)'
        }
      }

      // Check if it looks like it returns something
      if (funcStr.includes('return ')) {
        signature += ' any'
      }

      return new FunctionType(signature)
    }
    case 'object': {
      if (value === null) {
        return new BasicType(Interface, 'interface{}', 16)
      }

      // Check for VarRef (pointer type in GoScript). Its static pointer type,
      // when the compiler tagged it, keeps an interface element type such as
      // *any, which the current element value does not show.
      if ($.isVarRef(value)) {
        const tagged = (value as { __goTypeInfo?: $.TypeInfo | string })
          .__goTypeInfo
        if (tagged !== undefined) {
          const taggedType = typeFromTypeInfo(tagged)
          if (taggedType.Kind() === Ptr) {
            return taggedType
          }
        }
        const elemType = getTypeOf(value.value as ReflectValue)
        return new PointerType(elemType)
      }

      if (
        '__goTypeInfo' in value &&
        (value as { __goTypeInfo?: $.TypeInfo | string }).__goTypeInfo
      ) {
        // A boxed named value carries the signatures of its methods.
        return typeWithMethodSignatures(
          typeFromTypeInfo(
            (value as { __goTypeInfo: $.TypeInfo | string }).__goTypeInfo,
          ),
          boxedMethodSignatures(value),
        )
      }

      if ('__goType' in value) {
        const goType = (value as { __goType?: unknown }).__goType
        if (typeof goType === 'string') {
          const channelType = channelTypeFromGoTypeName(goType)
          if (channelType) {
            return channelType
          }
        }
      }

      if (
        'real' in value &&
        'imag' in value &&
        typeof (value as $.Complex).real === 'number' &&
        typeof (value as $.Complex).imag === 'number'
      ) {
        return new BasicType(Complex128, 'complex128', 16)
      }

      // Check for arrays
      if (globalThis.Array.isArray(value)) {
        if (value.length === 0) {
          // Empty array, assume []interface{}
          return new SliceType(new BasicType(Interface, 'interface{}', 16))
        }
        // Determine element type from first element
        const elemType = getTypeOf(value[0])
        return new SliceType(elemType)
      }

      // Check for typed arrays
      if (value instanceof Uint8Array)
        return new SliceType(new BasicType(Uint8, 'uint8', 1))
      if (value instanceof Int8Array)
        return new SliceType(new BasicType(Int8, 'int8', 1))
      if (value instanceof Uint16Array)
        return new SliceType(new BasicType(Uint16, 'uint16', 2))
      if (value instanceof Int16Array)
        return new SliceType(new BasicType(Int16, 'int16', 2))
      if (value instanceof Uint32Array)
        return new SliceType(new BasicType(Uint32, 'uint32', 4))
      if (value instanceof Int32Array)
        return new SliceType(new BasicType(Int32, 'int32', 4))
      if (value instanceof Float32Array)
        return new SliceType(new BasicType(Float32, 'float32', 4))
      if (value instanceof Float64Array)
        return new SliceType(new BasicType(Float64, 'float64', 8))

      // Check for Maps
      if (value instanceof globalThis.Map) {
        if (value.size === 0) {
          // Empty map, assume map[interface{}]interface{}
          const anyType = new BasicType(Interface, 'interface{}', 16)
          return new MapType(anyType, anyType)
        }
        // Get types from first entry
        const firstEntry = value.entries().next().value
        if (firstEntry) {
          const keyType = getTypeOf(firstEntry[0] as ReflectValue)
          const valueType = getTypeOf(firstEntry[1] as ReflectValue)
          return new MapType(keyType, valueType)
        }
      }

      // Check for GoScript slice objects with proper __meta__ structure
      if (value && typeof value === 'object' && '__meta__' in value) {
        const meta = (
          value as {
            __meta__?: {
              backing?: unknown[]
              length?: number
              capacity?: number
              offset?: number
            }
          }
        ).__meta__
        if (
          meta &&
          typeof meta === 'object' &&
          'backing' in meta &&
          'length' in meta &&
          globalThis.Array.isArray(meta.backing)
        ) {
          // This is a GoScript slice - determine element type from backing array
          if (meta.backing.length === 0) {
            // Empty slice, assume []interface{}
            return new SliceType(new BasicType(Interface, 'interface{}', 16))
          }
          // Get element type from first element in backing array
          const elemType = getTypeOf(meta.backing[0] as ReflectValue)
          return new SliceType(elemType)
        }
      }

      // Check if it has a constructor with __typeInfo for proper struct names
      if (
        value &&
        typeof value === 'object' &&
        value.constructor &&
        '__reflectType' in value.constructor
      ) {
        const reflectType = (value.constructor as { __reflectType?: Type })
          .__reflectType
        if (reflectType) {
          return reflectType
        }
      }

      if (
        value &&
        typeof value === 'object' &&
        value.constructor &&
        '__typeInfo' in value.constructor
      ) {
        const typeInfo = (
          value.constructor as { __typeInfo?: $.StructTypeInfo }
        ).__typeInfo
        if (typeInfo && isStructTypeInfo(typeInfo)) {
          const ctor = value.constructor as object
          const cached = structConstructorTypes.get(ctor)
          if (cached !== undefined) {
            return cached
          }
          const typ = structTypeOfConstructor(typeInfo)
          structConstructorTypes.set(ctor, typ)
          return typ
        }
      }

      // Check if it has a constructor name we can use (fallback)
      const constructorName = (value as object).constructor?.name
      if (constructorName && constructorName !== 'Object') {
        return new StructType(constructorName, [])
      }

      // Default to struct type for plain objects
      return new StructType('struct', [])
    }
    default:
      return new BasicType(Interface, 'interface{}', 16)
  }
}

// structConstructorTypes caches the reflect type of the struct values of
// each generated struct class.
const structConstructorTypes = new WeakMap<object, Type>()

// structTypeOfConstructor returns the reflect type of the values of a
// struct class with the given type info.
function structTypeOfConstructor(typeInfo: $.StructTypeInfo): Type {
  // An anonymous struct has no registered type to consult.
  const name = typeInfo.name ?? ''
  if (name === '') {
    return new StructType('', structFieldsFromTypeInfo(typeInfo))
  }

  // A named struct takes its fields from the registered type, when there is one.
  const typeName = name.includes('.') ? name : `main.${name}`
  const regTypeInfo = builtinGetTypeByName(typeName)
  const fields =
    regTypeInfo && isStructTypeInfo(regTypeInfo) ?
      structFieldsFromTypeInfo(regTypeInfo)
    : structFieldsFromTypeInfo(typeInfo)
  return new StructType(typeName, fields)
}

// boxedMethodSignatures returns the method signatures of the methods of a
// boxed named value (see $.namedValueInterfaceValue).
function boxedMethodSignatures(value: object): $.MethodSignature[] {
  const signatures: $.MethodSignature[] = []
  for (const method of Object.values(value)) {
    const signature =
      typeof method === 'function' ?
        (method as { __goscriptMethodSignature?: $.MethodSignature })
          .__goscriptMethodSignature
      : undefined
    if (signature) {
      signatures.push(signature)
    }
  }
  return signatures
}

// TypeOf returns the dynamic type of i, or nil for a nil interface value.
export function TypeOf(i: ReflectValue): Type | null {
  if (i === null || i === undefined) {
    return null
  }
  return internType(getTypeOf(i))
}

// ValueOf returns a Value holding i, or the zero Value for a nil interface
// value.
export function ValueOf(i: ReflectValue): Value {
  if (i === null || i === undefined) {
    return new Value()
  }
  const typ = internType(getTypeOf(i))
  if ($.isNamedValueBox(i)) {
    // Named interface boxes contain Go values, which are all reflectable.
    return new Value(
      i.__goValue as ReflectValue,
      typ,
      undefined,
      undefined,
      undefined,
      i,
    )
  }
  return new Value(i, typ)
}

export function TypeAssert(
  typeArgs: $.GenericTypeArgs | undefined,
  v: Value,
): [any, boolean] {
  const descriptor = typeArgs?.T
  if (!descriptor?.type) {
    return [v.Interface(), true]
  }
  return $.typeAssertTuple<any>(v.Interface(), descriptor.type)
}

export function ArrayOf(length: number, elem: Type): Type {
  return internType(new ArrayType(elem, length))
}

export function SliceOf(t: Type): Type {
  return internType(new SliceType(t))
}

export function PointerTo(t: Type | null): Type | null {
  if (t === null) return null
  return internType(new PointerType(t))
}

export function PtrTo(t: Type | null): Type | null {
  return PointerTo(t) // PtrTo is an alias for PointerTo
}

export function MapOf(key: Type, elem: Type): Type {
  return internType(new MapType(key, elem))
}

export function ChanOf(dir: ChanDir, t: Type): Type {
  return internType(new ChannelType(t, dir))
}

export function StructOf(fields: $.Slice<StructField>): Type {
  const inputFields = $.asArray(fields)
  const descriptors: StructFieldDescriptor[] = []
  const names = new Set<string>()
  let pkgPath = ''
  let offset = 0
  for (const [idx, field] of inputFields.entries()) {
    validateStructOfField(field, idx, inputFields.length)
    if (field.PkgPath !== '') {
      if (pkgPath === '') {
        pkgPath = field.PkgPath
      } else if (pkgPath !== field.PkgPath) {
        throw new Error(
          `reflect.Struct: fields with different PkgPath ${pkgPath} and ${field.PkgPath}`,
        )
      }
    }
    if (names.has(field.Name) && field.Name !== '_') {
      throw new Error(`reflect.StructOf: duplicate field ${field.Name}`)
    }
    names.add(field.Name)

    const fieldOffset = alignOffset(offset, typeAlignment(field.Type!))
    const tag = field.Tag || undefined
    const descriptor: StructFieldDescriptor = {
      name: field.Name,
      key: field.Name === '_' ? `_${idx}` : field.Name,
      type: field.Type!,
      ...(tag ? { tag } : {}),
      pkgPath: field.PkgPath,
      anonymous: field.Anonymous,
      index: [idx],
      offset: fieldOffset,
      exported: field.IsExported(),
    }
    descriptors.push(descriptor)
    offset = fieldOffset + field.Type!.Size()
  }
  return internType(
    new StructType('', descriptors, '', structTypeString(descriptors)),
  )
}

function validateStructOfField(
  field: StructField,
  idx: number,
  count: number,
): void {
  if (field.Name === '') {
    throw new Error(`reflect.StructOf: field ${idx} has no name`)
  }
  if (!isValidStructFieldName(field.Name)) {
    throw new Error(`reflect.StructOf: field ${idx} has invalid name`)
  }
  if (!field.Type) {
    throw new Error(`reflect.StructOf: field ${idx} has no type`)
  }
  if (field.Anonymous && field.PkgPath !== '') {
    throw new Error(
      `reflect.StructOf: field "${field.Name}" is anonymous but has PkgPath set`,
    )
  }
  if (field.IsExported() && isUnexportedStructFieldName(field.Name)) {
    throw new Error(
      `reflect.StructOf: field "${field.Name}" is unexported but missing PkgPath`,
    )
  }
  validateAnonymousStructOfField(field, idx, count)
}

function isValidStructFieldName(name: string): boolean {
  return /^[\p{L}_][\p{L}\p{N}_]*$/u.test(name)
}

function isUnexportedStructFieldName(name: string): boolean {
  const first = name.charCodeAt(0)
  return name[0] === '_' || (first >= 97 && first <= 122)
}

// validateAnonymousStructOfField applies Go's StructOf limits on embedded
// fields with methods: such a field must be the first, and a pointer, or a
// type stored directly in an interface, must be the only field. As in Go,
// the methods of an embedded field are not promoted to the new type.
function validateAnonymousStructOfField(
  field: StructField,
  idx: number,
  count: number,
): void {
  if (!field.Anonymous) {
    return
  }
  const typ = field.Type!
  if (typ.Kind() === Interface) {
    return
  }
  if (typ.Kind() === Ptr) {
    const elem = typ.Elem()
    if (elem.Kind() === Ptr || elem.Kind() === Interface) {
      throw new Error(
        `reflect.StructOf: illegal embedded field type ${typ.String()}`,
      )
    }
  }
  if (embeddedMethodCount(typ) === 0) {
    return
  }
  if (idx > 0) {
    throw new Error(
      'reflect: embedded type with methods not implemented if type is not first field',
    )
  }
  if (count > 1 && typ.Kind() === Ptr) {
    throw new Error(
      'reflect: embedded type with methods not implemented if there is more than one field',
    )
  }
  if (count > 1 && isDirectInterfaceKind(typ.Kind())) {
    throw new Error(
      'reflect: embedded type with methods not implemented for non-pointer type',
    )
  }
}

// isDirectInterfaceKind reports whether values of kind k are stored directly
// in an interface in Go, being pointer-shaped.
function isDirectInterfaceKind(k: Kind): boolean {
  return k === Map || k === Chan || k === Func || k === UnsafePointer
}

function embeddedMethodCount(typ: Type): number {
  if (typ.Kind() === Ptr) {
    return Math.max(typ.NumMethod(), typ.Elem().NumMethod())
  }
  return typ.NumMethod()
}

function structTypeString(fields: StructFieldDescriptor[]): string {
  if (fields.length === 0) {
    return 'struct {}'
  }
  return `struct { ${fields.map(structFieldString).join('; ')} }`
}

function structFieldString(field: StructFieldDescriptor): string {
  const tag = field.tag ? ` ${JSON.stringify(field.tag)}` : ''
  const prefix = field.anonymous ? '' : `${field.name} `
  return `${prefix}${field.type.String()}${tag}`
}

export function FuncOf(
  inTypes: $.Slice<Type | null>,
  outTypes: $.Slice<Type | null>,
  variadic: boolean,
): Type {
  const params = $.asArray(inTypes).map(funcOfType)
  const results = $.asArray(outTypes).map(funcOfType)
  if (
    variadic &&
    (params.length === 0 || params[params.length - 1].Kind() !== Slice)
  ) {
    throw new Error('reflect.FuncOf: last arg of variadic func must be slice')
  }
  if (params.length + results.length > 128) {
    throw new Error('reflect.FuncOf: too many arguments')
  }
  return internType(new FunctionType({ params, results, variadic }))
}

function funcOfType(typ: Type | null | undefined): Type {
  if (!typ) {
    throw new Error('reflect.FuncOf: nil Type')
  }
  return typ
}

export function TypeFor(typeArgs?: $.GenericTypeArgs): Type {
  const descriptor = typeArgs?.T
  const methodSignatures = genericMethodSignatures(descriptor)
  if (descriptor?.type) {
    return internType(
      typeWithMethodSignatures(
        typeFromTypeInfo(descriptor.type),
        methodSignatures,
      ),
    )
  }
  if (methodSignatures.length !== 0) {
    return internType(
      new InterfaceType(
        interfaceTypeString(methodSignatures),
        undefined,
        methodSignatures,
      ),
    )
  }
  if (descriptor?.zero) {
    return internType(getTypeOf(descriptor.zero()))
  }
  return internType(new InterfaceType('interface{}'))
}

function genericMethodSignatures(
  descriptor: $.GenericTypeDescriptor | undefined,
): $.MethodSignature[] {
  if (!descriptor) {
    return []
  }
  if (descriptor.methodSignatures && descriptor.methodSignatures.length !== 0) {
    return descriptor.methodSignatures
  }
  if (!descriptor.methods) {
    return []
  }
  return Object.keys(descriptor.methods).map((method) => ({
    name: method,
    args: [],
    returns: [],
  }))
}

function typeWithMethodSignatures(
  typ: Type,
  methods: $.MethodSignature[],
): Type {
  if (methods.length === 0) {
    return typ
  }
  if (typ instanceof BasicType) {
    typ.mergeMethodSignatures(methods)
    return typ
  }
  if (typ instanceof PointerType) {
    typ.mergeMethodSignatures(methods)
    return typ
  }
  if (typ instanceof FunctionType) {
    typ.mergeMethodSignatures(methods)
    return typ
  }
  return typ
}

// typeInfoTypes and namedTypeInfoTypes cache the Type of a type info, since
// building it walks the whole type, and TypeOf and ValueOf need it for every
// value. Generated code makes a new info object for a pointer type at each
// use, so those are cached by the registered name they point to.
const typeInfoTypes = new WeakMap<object, Type>()
const namedTypeInfoTypes = new globalThis.Map<string, Type>()

// typeInfoCacheKey returns the key of a type info that names a registered
// type, by its name or as the registered type info itself, or that is built
// from such types and basic types, as pointer, slice, array, map and function
// types are, or '' for any other type info. Generated code and the runtime
// make new type info objects for the same type at each use, so they are
// cached by this key.
function typeInfoCacheKey(info: $.TypeInfo | string | undefined): string {
  // A string is a key when it names a registered type.
  if (info === undefined) {
    return ''
  }
  if (typeof info === 'string') {
    return builtinGetTypeByName(info) ? info : ''
  }

  // The registered type info is keyed by its name.
  if (info.name !== undefined && builtinGetTypeByName(info.name) === info) {
    return info.name
  }

  // Any other type info is keyed by the keys of the types it is built from.
  switch (info.kind) {
    case $.TypeKind.Basic: {
      if (info.name === undefined) {
        return ''
      }
      return 'b:' + info.name + '|' + (info.typeName ?? '')
    }
    case $.TypeKind.Pointer: {
      const elem = typeInfoCacheKey((info as $.PointerTypeInfo).elemType)
      return elem === '' ? '' : '*' + elem
    }
    case $.TypeKind.Slice: {
      const elem = typeInfoCacheKey((info as $.SliceTypeInfo).elemType)
      return elem === '' ? '' : '[]' + elem + '|' + (info.typeName ?? '')
    }
    case $.TypeKind.Array: {
      const array = info as $.ArrayTypeInfo
      const elem = typeInfoCacheKey(array.elemType)
      return elem === '' ? '' : (
          '[' + array.length + ']' + elem + '|' + (info.typeName ?? '')
        )
    }
    case $.TypeKind.Map: {
      const map = info as $.MapTypeInfo
      const key = typeInfoCacheKey(map.keyType)
      const elem = typeInfoCacheKey(map.elemType)
      return key === '' || elem === '' ?
          ''
        : 'map[' + key + ']' + elem + '|' + (info.typeName ?? '')
    }
    case $.TypeKind.Function: {
      const fn = info as $.FunctionTypeInfo
      const params = (fn.params ?? []).map(typeInfoCacheKey)
      const results = (fn.results ?? []).map(typeInfoCacheKey)
      if (params.includes('') || results.includes('')) {
        return ''
      }
      return (
        'func(' +
        params.join(',') +
        ')(' +
        results.join(',') +
        ')' +
        (fn.isVariadic ? '...' : '') +
        '|' +
        (fn.name ?? '') +
        '|' +
        (info.typeName ?? '')
      )
    }
    case $.TypeKind.Interface: {
      if (info.name !== undefined && info.name !== '') {
        return ''
      }
      const methods = (info as $.InterfaceTypeInfo).methods ?? []
      const keys = methods.map(methodSignatureCacheKey)
      if (keys.includes('')) {
        return ''
      }
      return 'interface{' + keys.join(';') + '}|' + (info.typeName ?? '')
    }
    case $.TypeKind.Struct: {
      if (info.name !== undefined && info.name !== '') {
        return ''
      }
      const fields = (info as $.StructTypeInfo).fields ?? []
      const keys = fields.map(structFieldCacheKey)
      if (keys.includes('')) {
        return ''
      }
      return 'struct{' + keys.join(';') + '}|' + (info.typeName ?? '')
    }
  }
  return ''
}

// methodSignatureCacheKey returns the cache key of a method signature, or ''
// if one of its types has none.
function methodSignatureCacheKey(method: $.MethodSignature): string {
  const args = method.args.map((arg) => typeInfoCacheKey(arg.type))
  const returns = method.returns.map((arg) => typeInfoCacheKey(arg.type))
  if (args.includes('') || returns.includes('')) {
    return ''
  }
  return method.name + '(' + args.join(',') + ')(' + returns.join(',') + ')'
}

// structFieldCacheKey returns the cache key of a struct field, or '' if its
// type has none.
function structFieldCacheKey(field: $.StructFieldInfo): string {
  const typ = typeInfoCacheKey(field.type)
  if (typ === '') {
    return ''
  }
  return (
    field.name +
    ' ' +
    (field.key ?? '') +
    ' ' +
    typ +
    ' ' +
    JSON.stringify(field.tag ?? '') +
    ' ' +
    (field.pkgPath ?? '') +
    (field.anonymous ? ' embedded' : '')
  )
}

// functionValueTypes caches the reflect types of function values by the key
// of their type info and Go type name.
const functionValueTypes = new globalThis.Map<string, Type>()

function typeFromTypeInfo(info: $.TypeInfo | string): Type {
  // Type info with a key shares one type, however many objects describe it.
  const key = typeInfoCacheKey(info)
  if (key !== '') {
    let typ = namedTypeInfoTypes.get(key)
    if (typ === undefined) {
      typ = typeFromTypeInfoWithSeen(info, new Set())
      namedTypeInfoTypes.set(key, typ)
    }
    return typ
  }
  if (typeof info === 'string') {
    return typeFromTypeInfoWithSeen(info, new Set())
  }

  // Any other type info object has its own type.
  let typ = typeInfoTypes.get(info)
  if (typ === undefined) {
    typ = typeFromTypeInfoWithSeen(info, new Set())
    typeInfoTypes.set(info, typ)
  }
  return typ
}

function typeFromTypeInfoWithSeen(
  info: $.TypeInfo | string,
  seen: Set<string>,
): Type {
  // The hand-written type information of override packages names the error
  // interface by its TypeScript name.
  if (isGoErrorTypeInfo(info)) {
    info = 'error'
  }

  // A type that typeFromTypeInfo already built is complete, so a nested use
  // of it, such as a field of another struct, takes it rather than building
  // it again.
  const key = typeInfoCacheKey(info)
  if (key !== '') {
    const cached = namedTypeInfoTypes.get(key)
    if (cached !== undefined) {
      return cached
    }
  }
  if (typeof info === 'string') {
    const registered = builtinGetTypeByName(info)
    if (registered) {
      const typ = typeFromTypeInfoWithSeen(registered, seen)
      return internType(typ)
    }
    return internType(StructType.createTypeFromFieldInfo(info, seen))
  }
  const recursiveName = recursiveTypeInfoName(info)
  if (recursiveName !== '') {
    const constructing = constructingRegisteredTypes.get(recursiveName)
    if (constructing) {
      return constructing
    }
    if (seen.has(recursiveName)) {
      return internType(shallowTypeFromRegisteredInfo(recursiveName, info))
    }
    if (info.kind === $.TypeKind.Struct) {
      const typ = new StructType(recursiveName, [])
      constructingRegisteredTypes.set(recursiveName, typ)
      seen.add(recursiveName)
      try {
        typ.replaceDescriptors(structFieldsFromTypeInfo(info, seen))
        const interned = internType(typ)
        if (key !== '') {
          namedTypeInfoTypes.set(key, interned)
        }
        return interned
      } finally {
        seen.delete(recursiveName)
        constructingRegisteredTypes.delete(recursiveName)
      }
    }
    seen.add(recursiveName)
    const typ = typeFromStructuredTypeInfoWithSeen(info, seen)
    seen.delete(recursiveName)
    return internType(typ)
  }
  return internType(typeFromStructuredTypeInfoWithSeen(info, seen))
}

// isGoErrorTypeInfo reports whether info names the error interface as GoError,
// the TypeScript type of Go errors.
function isGoErrorTypeInfo(info: $.TypeInfo | string): boolean {
  if (typeof info === 'string') {
    return info === 'GoError'
  }
  return info.kind === $.TypeKind.Interface && info.name === 'GoError'
}

function recursiveTypeInfoName(info: $.TypeInfo): string {
  if (info.kind === $.TypeKind.Basic) {
    return info.typeName ?? ''
  }
  return info.name ?? ''
}

function typeFromStructuredTypeInfoWithSeen(
  info: $.TypeInfo,
  seen: Set<string>,
): Type {
  switch (info.kind) {
    case $.TypeKind.Array:
      return new ArrayType(
        typeFromTypeInfoWithSeen(
          info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
          seen,
        ),
        info.length,
        info.typeName,
      )
    case $.TypeKind.Basic:
      return StructType.createTypeFromFieldInfo(info, seen)
    case $.TypeKind.Channel:
      return new ChannelType(
        typeFromTypeInfoWithSeen(
          info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
          seen,
        ),
        chanDirFromTypeInfo(info.direction),
      )
    case $.TypeKind.Function:
      return functionTypeFromInfo(info, seen)
    case $.TypeKind.Interface:
      return interfaceTypeFromInfo(info, seen)
    case $.TypeKind.Map:
      return new MapType(
        typeFromTypeInfoWithSeen(
          info.keyType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
          seen,
        ),
        typeFromTypeInfoWithSeen(
          info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
          seen,
        ),
        info.typeName,
      )
    case $.TypeKind.Slice:
      return new SliceType(
        typeFromTypeInfoWithSeen(
          info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
          seen,
        ),
        info.typeName,
      )
    case $.TypeKind.Struct:
      return StructType.createTypeFromFieldInfo(info, seen)
    case $.TypeKind.Pointer:
      return new PointerType(
        typeFromTypeInfoWithSeen(
          info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
          seen,
        ),
      )
    default:
      return StructType.createTypeFromFieldInfo(info, seen)
  }
}

function shallowTypeFromRegisteredInfo(name: string, info: $.TypeInfo): Type {
  switch (info.kind) {
    case $.TypeKind.Interface:
      return new InterfaceType(name, name, info.methods ?? [])
    case $.TypeKind.Struct:
      return new StructType(name, [])
    case $.TypeKind.Function:
      return new FunctionType({ name })
    case $.TypeKind.Basic:
      return StructType.createTypeFromFieldInfo({
        kind: $.TypeKind.Basic,
        name: info.name ?? 'unknown',
        typeName: info.typeName ?? name,
      })
    default:
      return StructType.createTypeFromFieldInfo(name)
  }
}

function functionTypeFromInfo(
  info: $.FunctionTypeInfo,
  seen = new Set<string>(),
): Type {
  const params = (info.params ?? []).map((param) =>
    typeFromTypeInfoWithSeen(param, seen),
  )
  const results = (info.results ?? []).map((result) =>
    typeFromTypeInfoWithSeen(result, seen),
  )
  return new FunctionType({
    name: info.name,
    params,
    results,
    variadic: info.isVariadic ?? false,
  })
}

function functionTypeInfoFromType(typ: Type): $.FunctionTypeInfo {
  const params: (string | $.TypeInfo)[] = []
  for (let i = 0; i < typ.NumIn(); i++) {
    params.push(typeInfoFromReflectType(typ.In(i)))
  }
  const results: (string | $.TypeInfo)[] = []
  for (let i = 0; i < typ.NumOut(); i++) {
    results.push(typeInfoFromReflectType(typ.Out(i)))
  }
  const info: $.FunctionTypeInfo = {
    kind: $.TypeKind.Function,
    params,
    results,
  }
  if (typ.Name() !== '') {
    info.name = runtimeTypeString(typ)
  }
  if (typ.IsVariadic()) {
    info.isVariadic = true
  }
  return info
}

export function typeInfoFromReflectType(typ: Type): string | $.TypeInfo {
  const typeName =
    typ.PkgPath() !== '' && typ.Name() !== '' ? runtimeTypeString(typ) : ''
  if (typeName !== '' && typ.Kind() === Struct) {
    return typeName
  }
  switch (typ.Kind()) {
    case Bool:
    case Int:
    case Int8:
    case Int16:
    case Int32:
    case Int64:
    case Uint:
    case Uint8:
    case Uint16:
    case Uint32:
    case Uint64:
    case Uintptr:
    case Float32:
    case Float64:
    case Complex64:
    case Complex128:
    case String:
    case UnsafePointer:
      return {
        kind: $.TypeKind.Basic,
        name: Kind_String(typ.Kind()),
        ...(typeName !== '' ? { typeName } : {}),
      }
    case Interface:
      return {
        kind: $.TypeKind.Interface,
        methods: typeMethods(typ).map((method) => ({
          name: method.name,
          args: method.args,
          returns: method.returns,
        })),
      }
    case Slice:
      return {
        kind: $.TypeKind.Slice,
        ...(typeName !== '' ? { typeName } : {}),
        elemType: typeInfoFromReflectType(typ.Elem()),
      }
    case Array:
      return {
        kind: $.TypeKind.Array,
        elemType: typeInfoFromReflectType(typ.Elem()),
        length: typ.Len(),
      }
    case Ptr:
      return {
        kind: $.TypeKind.Pointer,
        elemType: typeInfoFromReflectType(typ.Elem()),
      }
    case Map:
      return {
        kind: $.TypeKind.Map,
        keyType: typeInfoFromReflectType(typ.Key()),
        elemType: typeInfoFromReflectType(typ.Elem()),
      }
    case Chan:
      return {
        kind: $.TypeKind.Channel,
        elemType: typeInfoFromReflectType(typ.Elem()),
        direction: channelDirectionFromString(typ.String()),
      }
    case Func:
      return functionTypeInfoFromType(typ)
    case Struct: {
      const fields =
        typ instanceof StructType ?
          typ.descriptors()
        : globalThis.Array.from({ length: typ.NumField() }, (_unused, idx) => {
            const field = typ.Field(idx)
            return {
              name: field.Name,
              key: structFieldStorageKey(typ, idx),
              type: field.Type!,
              tag: field.Tag || undefined,
              pkgPath: field.PkgPath,
              anonymous: field.Anonymous,
              index: [...$.asArray(field.Index)],
              offset: field.Offset,
              exported: field.IsExported(),
            }
          })
      return {
        kind: $.TypeKind.Struct,
        name: typ.Name() === '' ? '' : runtimeTypeString(typ),
        methods: [],
        fields: fields.map((field) => ({
          name: field.name,
          key: field.key,
          type: typeInfoFromReflectType(field.type),
          ...(field.tag ? { tag: field.tag } : {}),
          ...(field.pkgPath ? { pkgPath: field.pkgPath } : {}),
          ...(field.anonymous ? { anonymous: true } : {}),
          index: [...field.index],
          offset: field.offset,
          exported: field.exported,
        })),
      }
    }
    default:
      return runtimeTypeString(typ)
  }
}

function channelDirectionFromString(
  typeName: string,
): 'send' | 'receive' | 'both' {
  if (typeName.startsWith('<-chan ')) {
    return 'receive'
  }
  if (typeName.startsWith('chan<- ')) {
    return 'send'
  }
  return 'both'
}

function interfaceTypeFromInfo(
  info: $.InterfaceTypeInfo,
  seen = new Set<string>(),
): Type {
  const methods = info.methods ?? []
  // A named interface, such as error or io.Reader, is known by its name.
  if (info.name && !isInterfaceLiteral(info.name)) {
    return new InterfaceType(info.name, info.name, methods)
  }
  if (methods.length === 0) {
    return new InterfaceType('interface{}', info.name, methods)
  }
  return new InterfaceType(
    interfaceTypeString(methods, seen),
    info.name,
    methods,
  )
}

function interfaceTypeString(
  methods: $.MethodSignature[],
  seen = new Set<string>(),
): string {
  return `interface { ${methods
    .map((method) => interfaceMethodString(method, seen))
    .join('; ')} }`
}

function interfaceMethodString(
  method: $.MethodSignature,
  seen: Set<string>,
): string {
  const args = method.args.map((arg) => methodArgString(arg, seen)).join(', ')
  const returns = method.returns.map((arg) => methodArgString(arg, seen))
  if (returns.length === 0) {
    return `${method.name}(${args})`
  }
  if (returns.length === 1) {
    return `${method.name}(${args}) ${returns[0]}`
  }
  return `${method.name}(${args}) (${returns.join(', ')})`
}

function structTypeInfoString(
  info: $.StructTypeInfo,
  seen: Set<string>,
): string {
  if (info.name) {
    return info.name
  }
  const fields = info.fields ?? []
  if (fields.length === 0) {
    return 'struct {}'
  }
  return `struct { ${fields
    .map((field) => structFieldInfoString(field, seen))
    .join('; ')} }`
}

function structFieldInfoString(
  field: $.StructFieldInfo,
  seen: Set<string>,
): string {
  const tag = field.tag ? ` ${JSON.stringify(field.tag)}` : ''
  const prefix = field.anonymous ? '' : `${field.name} `
  return `${prefix}${typeInfoString(field.type, seen)}${tag}`
}

function methodArgString(arg: $.MethodArg, seen: Set<string>): string {
  return typeInfoString(arg.type, seen)
}

function typeInfoString(info: $.TypeInfo | string, seen: Set<string>): string {
  if (typeof info === 'string') {
    return info
  }
  switch (info.kind) {
    case $.TypeKind.Basic:
      return info.typeName ?? info.name ?? 'unknown'
    case $.TypeKind.Interface: {
      const name = info.name ?? ''
      if (name !== '' && seen.has(name)) {
        return name
      }
      if (info.methods.length === 0) {
        return 'interface{}'
      }
      if (name !== '') {
        seen.add(name)
      }
      const text = interfaceTypeString(info.methods, seen)
      if (name !== '') {
        seen.delete(name)
      }
      return text
    }
    case $.TypeKind.Struct:
      return structTypeInfoString(info, seen)
    case $.TypeKind.Pointer:
      return `*${typeInfoString(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Slice:
      return `[]${typeInfoString(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Array:
      return `[${info.length}]${typeInfoString(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Map:
      return `map[${typeInfoString(
        info.keyType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}]${typeInfoString(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    case $.TypeKind.Function: {
      const params = (info.params ?? [])
        .map((param) => typeInfoString(param, seen))
        .join(', ')
      const results = (info.results ?? []).map((result) =>
        typeInfoString(result, seen),
      )
      if (results.length === 0) {
        return `func(${params})`
      }
      if (results.length === 1) {
        return `func(${params}) ${results[0]}`
      }
      return `func(${params}) (${results.join(', ')})`
    }
    case $.TypeKind.Channel:
      return `chan ${typeInfoString(
        info.elemType ?? { kind: $.TypeKind.Basic, name: 'unknown' },
        seen,
      )}`
    default:
      return 'unknown'
  }
}

function chanDirFromTypeInfo(direction?: 'send' | 'receive' | 'both'): ChanDir {
  switch (direction) {
    case 'send':
      return SendDir
    case 'receive':
      return RecvDir
    default:
      return BothDir
  }
}

/**
 * getInterfaceTypeByName looks up a registered interface type by name
 * and returns a Type for it. Returns an interface{} type if not found.
 */
export function getInterfaceTypeByName(name: string): Type {
  const typeInfo = builtinGetTypeByName(name)
  if (typeInfo && isInterfaceTypeInfo(typeInfo)) {
    return new InterfaceType(name, name, typeInfo.methods ?? [])
  }
  return new InterfaceType('interface{}')
}

export function getInterfaceLiteralTypeByName(name: string): Type {
  const typeInfo = builtinGetTypeByName(name)
  if (typeInfo && isInterfaceTypeInfo(typeInfo)) {
    return interfaceTypeFromInfo(typeInfo)
  }
  return new InterfaceType('interface{}')
}

export function funcLayout(
  _t: Type,
  _rcvr: Type | null,
): { Type: Type | null; InCount: number; OutCount: number } {
  return {
    Type: null,
    InCount: 0,
    OutCount: 0,
  }
}

// Register Value so a type assertion to reflect.Value matches a Value and
// yields the zero Value when it fails.
Value.__typeInfo = $.registerStructType(
  'reflect.Value',
  () => new Value(),
  [],
  Value,
)

// isNamedStructObject reports whether value is an instance of a generated
// struct class, which has the methods of its named type.
function isNamedStructObject(value: unknown): value is object {
  if (value === null || typeof value !== 'object') {
    return false
  }
  const ctor = (value as { constructor?: { __typeInfo?: unknown } }).constructor
  return ctor !== undefined && ctor !== Object && ctor.__typeInfo !== undefined
}

// unnamedStructViews keeps one view per struct object, so that pointers to
// the same struct through the view are equal.
const unnamedStructViews = new WeakMap<object, object>()

// unnamedStructView returns a view of a struct object that shares its fields
// but hides the methods of its named type, and has its own Go type tags.
function unnamedStructView(target: object): object {
  // A struct has one view.
  const existing = unnamedStructViews.get(target)
  if (existing !== undefined) {
    return existing
  }

  // The view has its own Go type tags and hides the methods of the named type.
  const tags: Record<PropertyKey, unknown> = {}
  const isTag = (prop: PropertyKey) =>
    prop === '__goType' || prop === '__goTypeInfo'
  const view = new Proxy(target, {
    get(obj, prop) {
      if (isTag(prop)) {
        return tags[prop]
      }
      const value = Reflect.get(obj, prop, obj)
      if (
        typeof value === 'function' &&
        typeof prop === 'string' &&
        prop !== 'constructor' &&
        prop !== 'clone' &&
        !prop.startsWith('_') &&
        !Object.prototype.hasOwnProperty.call(obj, prop)
      ) {
        return undefined
      }
      return value
    },
    set(obj, prop, value) {
      return Reflect.set(obj, prop, value, obj)
    },
    has(obj, prop) {
      if (isTag(prop)) {
        return prop in tags
      }
      return Reflect.has(obj, prop)
    },
    defineProperty(obj, prop, descriptor) {
      if (isTag(prop)) {
        tags[prop] = descriptor.value
        return true
      }
      return Reflect.defineProperty(obj, prop, descriptor)
    },
  })
  unnamedStructViews.set(target, view)
  return view
}

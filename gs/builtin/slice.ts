import {
  arrayValue,
  copyElement,
  generatedStructClass,
  isArrayValue,
  isMarkedAsStructValue,
  isTypedNilValue,
  markAsStructValue,
  resolveTypeInfo,
  structValueTypeInfo,
  TypeKind,
  type StructTypeInfo,
} from './type.js'
import { runtimePanic } from './panic.js'
import {
  isOwnedPointerHandle,
  isVarRef,
  varRef,
  type OwnedPointerHandle,
  type VarRef,
} from './varRef.js'

type GoStringBytes = string | Slice<number> | Uint8Array

// A Go string is represented by a JavaScript string with one character per
// UTF-8 byte, so that every character code is 0 to 255, as in GopherJS. Its
// length, indexing, slicing, comparison, concatenation and use as a map key
// are then those of the JavaScript string. It is only decoded to or encoded
// from UTF-16 text at the boundary with JavaScript APIs, by jsString and
// goString.

// asciiText matches JavaScript text whose UTF-16 code units are all ASCII,
// which is the same as a Go string and as JavaScript text.
// eslint-disable-next-line no-control-regex
const asciiText = /^[\x00-\x7f]*$/

// Non-streaming codecs retain no per-call state and can be shared.
const sharedTextEncoder = new TextEncoder()
const sharedTextDecoder = new TextDecoder('utf-8')

/**
 * jsString returns the JavaScript text of a Go string, decoding its UTF-8
 * bytes, with U+FFFD for invalid UTF-8, for passing it to a JavaScript API.
 */
export function jsString(str: string | null | undefined): string {
  // A missing string is empty.
  if (str === null || str === undefined) {
    return ''
  }

  // ASCII is the same in both, and text that is not bytes is left as it is.
  if (asciiText.test(str) || nonByteText.test(str)) {
    return str
  }

  // Other bytes are decoded as UTF-8.
  return sharedTextDecoder.decode(goStringBytes(str))
}

// nonByteText matches a string with a character that can not be a byte,
// which is therefore already JavaScript text rather than a Go string, such
// as a runtime message, and is left as it is by jsString.
// eslint-disable-next-line no-control-regex
const nonByteText = /[^\x00-\xff]/

/**
 * goString returns the Go string of JavaScript text, encoding it as UTF-8,
 * for text that comes from a JavaScript API.
 */
export function goString(text: string | null | undefined): string {
  // Missing text is empty.
  if (text === null || text === undefined) {
    return ''
  }

  // ASCII text is the same Go string, and other text is encoded as UTF-8.
  text = String(text)
  if (asciiText.test(text)) {
    return text
  }
  return goStringFromBytes(sharedTextEncoder.encode(text))
}

function goStringComparableBytes(value: GoStringBytes): Uint8Array {
  if (typeof value === 'string') {
    return goStringBytes(value)
  }
  if (value instanceof Uint8Array) {
    return value
  }
  if (value === null || value === undefined) {
    return new Uint8Array(0)
  }
  return Uint8Array.from(asArray(value))
}

// sliceMeta returns the window of a slice proxy, or of an array with one, or
// undefined for a plain array.
function sliceMeta(slice: object): GoSliceObject<any> | undefined {
  // The slice proxy handlers answer __meta__ before any other property.
  return (slice as { __meta__?: GoSliceObject<any> }).__meta__
}

// SliceRange is the window of a slice or array for a range loop over it.
export interface SliceRange<T> {
  backing: ArrayLike<T>
  offset: number
  length: number
}

const emptySliceRange: SliceRange<any> = { backing: [], offset: 0, length: 0 }

/**
 * sliceRange returns the backing array, offset and length of a slice or
 * array, so that a range loop over it reads its elements directly, with the
 * length fixed when the loop starts, as in Go.
 */
export function sliceRange<T>(
  slice: Slice<T> | T[] | null | undefined,
): SliceRange<T>
export function sliceRange(
  slice: TypedSlice | null | undefined,
): SliceRange<number>
export function sliceRange<T>(
  slice: Slice<T> | TypedSlice | null | undefined,
): SliceRange<T> | SliceRange<number> {
  // A window object is its own window, and a plain array is a window over
  // itself. They are handled here, in a function small enough for engines
  // to inline, which also lets them avoid allocating the window of an array.
  if (slice instanceof GoSlice) {
    return slice
  }
  if (Array.isArray(slice) && (slice as any).__meta__ === undefined) {
    return { backing: slice, offset: 0, length: slice.length }
  }
  return sliceRangeSlow(slice)
}

// sliceRangeSlow is sliceRange for nil, typed and proxied slices.
function sliceRangeSlow<T>(
  slice: Slice<T> | TypedSlice | null | undefined,
): SliceRange<T> | SliceRange<number> {
  // A nil slice has no elements.
  if (slice === null || slice === undefined) {
    return emptySliceRange
  }

  // A window object is its own window, tested first without reading
  // __meta__ (see sliceLen).
  if (slice instanceof GoSlice) {
    return slice
  }

  // A typed slice is a view of exactly its elements, and so a window over
  // itself, with or without spare capacity.
  if (isTypedSlice(slice)) {
    return { backing: slice, offset: 0, length: slice.length }
  }

  // A slice proxy has its window, and a plain array is a window over itself.
  const meta = sliceMeta(slice)
  if (meta !== undefined) {
    return meta
  }
  return { backing: slice, offset: 0, length: slice.length }
}

/**
 * GoSliceObject describes a slice window and its shared backing array.
 */
interface GoSliceObject<T> {
  backing: T[]
  offset: number
  length: number
  capacity: number
  target?: T[] // Materialized proxy target for JS array operations
}

const addressStride = 0x100000000
let nextAddressBase = 1
const addressBases = new WeakMap<object, number>()
const byteAddressBases = new WeakMap<object, number>()
const byteAddressSources = new globalThis.Map<number, ByteAddressSource>()

interface ByteAddressSource {
  byteLength: number
  getByte(offset: number): number
  setByte(offset: number, value: number): void
}

/**
 * GoSlice is a Go slice that does not cover its whole backing array: a window
 * of offset, length and capacity on it. It is its own slice metadata, so the
 * runtime reads the window as a plain property rather than through a proxy
 * trap. It is not a JavaScript array: code reads and writes its elements
 * through the runtime helpers, and its iterator and common array methods
 * read its window.
 */
export class GoSlice<T> {
  target?: T[]
  constructor(
    public backing: T[],
    public offset: number,
    public length: number,
    public capacity: number,
  ) {}

  get __meta__(): GoSliceObject<T> {
    return this
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this.length; i++) {
      yield this.backing[this.offset + i]
    }
  }

  // window returns a copy of the elements of the slice, as a plain array
  // also when its backing array is a typed array.
  window(): T[] {
    const end = this.offset + this.length
    return isTypedSlice(this.backing) ?
        (Array.from(this.backing.subarray(this.offset, end)) as T[])
      : this.backing.slice(this.offset, end)
  }

  slice(start?: number, end?: number): T[] {
    return this.window().slice(start, end)
  }
  map<U>(f: (value: T, index: number, array: T[]) => U): U[] {
    return this.window().map(f)
  }
  filter(f: (value: T, index: number, array: T[]) => unknown): T[] {
    return this.window().filter(f)
  }
  forEach(f: (value: T, index: number, array: T[]) => void): void {
    this.window().forEach(f)
  }
  reduce<U>(f: (acc: U, value: T, index: number, array: T[]) => U, init: U): U {
    return this.window().reduce(f, init)
  }
  indexOf(value: T): number {
    return this.window().indexOf(value)
  }
  includes(value: T): boolean {
    return this.window().includes(value)
  }
  join(sep?: string): string {
    return this.window().join(sep)
  }
  every(f: (value: T, index: number, array: T[]) => unknown): boolean {
    return this.window().every(f)
  }
  some(f: (value: T, index: number, array: T[]) => unknown): boolean {
    return this.window().some(f)
  }

  // sort sorts the window in place, as Array.prototype.sort does.
  sort(compare?: (a: T, b: T) => number): this {
    // The window is sorted as a copy and written back.
    const sorted = this.window().sort(compare)
    for (let i = 0; i < sorted.length; i++) {
      this.backing[this.offset + i] = sorted[i]
    }
    return this
  }
}

// sliceElems returns the array that holds the elements of a slice: the
// backing array of a window, or the slice itself.
export function sliceElems(slice: any): any[] {
  // A typed slice is a view of exactly its elements.
  if (isTypedSlice(slice)) {
    return slice as ArrayLike<number> as any[]
  }
  const meta = slice === null ? undefined : sliceMeta(slice)
  return meta !== undefined ? meta.backing : slice
}

// sliceSlot returns the index in sliceElems(slice) of element index of the
// slice, which it checks against the slice's length.
export function sliceSlot(slice: any, index: number): number {
  // A nil slice has no elements.
  if (slice === null || slice === undefined) {
    outOfRangeIndex(index, 0)
  }

  // A typed slice is a view of exactly its elements, and a window offsets
  // the index into its backing array.
  if (isTypedSlice(slice)) {
    if (index < 0 || index >= slice.length) {
      outOfRangeIndex(index, slice.length)
    }
    return index
  }
  const meta = sliceMeta(slice)
  const length = meta !== undefined ? meta.length : slice.length
  if (index < 0 || index >= length) {
    outOfRangeIndex(index, length)
  }
  return meta !== undefined ? meta.offset + index : index
}

// windowSlot returns the index in window.backing of element index of a slice
// whose window a loop read once (see sliceRange), which it checks against the
// window's length.
export function windowSlot(window: SliceRange<any>, index: number): number {
  // An index outside the window panics, as in Go.
  if (index < 0 || index >= window.length) {
    outOfRangeIndex(index, window.length)
  }
  return window.offset + index
}

// isArrayOrGoSlice reports whether value is a JavaScript array or a GoSlice,
// the values that slices and arrays are represented by.
export function isArrayOrGoSlice(
  value: unknown,
): value is any[] | SliceProxy<any> {
  return Array.isArray(value) || value instanceof GoSlice
}

/**
 * SliceProxy exposes a shared backing window through array operations.
 */
export type SliceProxy<T> = GoSlice<T>

/**
 * TypedSlice is the JavaScript typed array that holds a Go slice of
 * fixed-size numeric elements: Uint8Array for []byte, and Int8Array,
 * Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array or
 * Float64Array for []int8, []int16, []uint16, []int32, []uint32, []float32 or
 * []float64. Storing an element then wraps integers and rounds float32 as Go
 * does, and the slice's memory can be viewed as bytes without copying.
 * int, uint, uintptr, int64 and uint64 have no such array: int and uint hold
 * 53-bit numbers, and 64-bit values are bigints.
 *
 * Such slices follow the representation of other slices: a slice that
 * covers its whole backing array is the typed array, and any other is a
 * GoSlice window on it, which is cheap to make, as each append in place
 * makes one. A byte slice is instead always a view of exactly its elements,
 * a subarray of its backing array that carries its window as __meta__ when
 * it has spare capacity, since byte strings and I/O pass byte slices to
 * JavaScript APIs as they are.
 */
export type TypedSlice =
  | Uint8Array
  | Int8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array

// TypedSliceConstructor makes the typed arrays of one element kind.
export interface TypedSliceConstructor {
  new (length: number): TypedSlice
  new (buffer: ArrayBufferLike, byteOffset: number, length: number): TypedSlice
  from(values: ArrayLike<number>): TypedSlice
  readonly BYTES_PER_ELEMENT: number
}

// typedSliceConstructors maps the element type hints of the compiler to the
// typed arrays that hold slices of those elements.
const typedSliceConstructors: Record<string, TypedSliceConstructor> = {
  byte: Uint8Array,
  int8: Int8Array,
  int16: Int16Array,
  uint16: Uint16Array,
  int32: Int32Array,
  uint32: Uint32Array,
  float32: Float32Array,
  float64: Float64Array,
}

/**
 * typedSliceConstructor returns the typed array that holds slices of the
 * elements a compiler type hint names, or undefined for other elements.
 */
export function typedSliceConstructor(
  typeHint: string | undefined,
): TypedSliceConstructor | undefined {
  return typeHint === undefined ? undefined : typedSliceConstructors[typeHint]
}

// typedSliceHintNames maps each typed array to the type hint that names it.
const typedSliceHintNames = new globalThis.Map<unknown, string>(
  Object.entries(typedSliceConstructors).map(([hint, ctor]) => [ctor, hint]),
)

/**
 * typedSliceOf returns a typed array of ctor holding values, for a slice
 * literal or the packed arguments of a variadic call. Filling a typed array
 * of the length is about twice as fast as making it from an array.
 */
export function typedSliceOf(
  ctor: TypedSliceConstructor,
  values: number[],
): TypedSlice {
  const out = new ctor(values.length)
  for (let i = 0; i < values.length; i++) {
    out[i] = values[i]
  }
  return out
}

/**
 * typedSliceHintOf returns the type hint of the typed array that holds a
 * slice, for making another slice of its kind, or undefined for a slice held
 * otherwise.
 */
export function typedSliceHintOf(slice: unknown): string | undefined {
  const elements = typedElements(slice)
  return elements === undefined ? undefined : (
      typedSliceHintNames.get(elements.constructor)
    )
}

/**
 * typedElements returns the typed array that views exactly the elements of a
 * slice held in a typed array, whether it is the typed array or a window on
 * one, or undefined for a slice held otherwise.
 */
export function typedElements(slice: unknown): TypedSlice | undefined {
  if (slice instanceof GoSlice) {
    const backing: unknown = slice.backing
    return isTypedSlice(backing) ?
        backing.subarray(slice.offset, slice.offset + slice.length)
      : undefined
  }
  return isTypedSlice(slice) ? slice : undefined
}

/**
 * typedSliceHintOfBasic returns the type hint of the typed array that holds
 * slices of elements of the Go basic type of the given name, or undefined for
 * elements held in plain arrays.
 */
export function typedSliceHintOfBasic(
  name: string | undefined,
): string | undefined {
  switch (name) {
    case 'uint8':
    case 'byte':
      return 'byte'
    case 'rune':
      return 'int32'
    case undefined:
      return undefined
  }
  return name in typedSliceConstructors ? name : undefined
}

/**
 * isTypedSlice reports whether value is a slice held in a typed array. No
 * slice is a DataView, the only other view of an ArrayBuffer.
 */
export function isTypedSlice(value: unknown): value is TypedSlice {
  return ArrayBuffer.isView(value)
}

/**
 * TypedSliceHint marks an append whose result elements are held in typed
 * arrays of ctor, so that the result keeps that representation even when the
 * destination is nil or held in a plain array. The compiler passes it as a
 * trailing argument, as it does byteSliceHint for bytes; no Go value is one.
 */
export class TypedSliceHint {
  constructor(readonly ctor: TypedSliceConstructor) {}
}

/**
 * typedSliceHints holds the append hint of each typed element kind other than
 * bytes, by its compiler type hint.
 */
export const typedSliceHints = {
  int8: new TypedSliceHint(Int8Array),
  int16: new TypedSliceHint(Int16Array),
  uint16: new TypedSliceHint(Uint16Array),
  int32: new TypedSliceHint(Int32Array),
  uint32: new TypedSliceHint(Uint32Array),
  float32: new TypedSliceHint(Float32Array),
  float64: new TypedSliceHint(Float64Array),
} as const

type TypedSliceMeta = Omit<GoSliceObject<number>, 'backing'> & {
  backing: TypedSlice
}

type TypedSliceWindow = TypedSlice & {
  __meta__?: TypedSliceMeta
}

function sliceIndexProperty(prop: string | symbol): number {
  if (typeof prop !== 'string' || prop.length === 0) {
    return -1
  }
  let index = 0
  for (let i = 0; i < prop.length; i++) {
    const digit = prop.charCodeAt(i) - 48
    if (digit < 0 || digit > 9) {
      return -1
    }
    index = index * 10 + digit
  }
  return index
}

/**
 * Slice represents an array-backed or byte-backed Go slice; null is nil.
 */
export type Slice<T> =
  | T[]
  | SliceProxy<T>
  | null
  | (T extends number ? TypedSlice : never)

// outOfRangeIndex panics with Go's index-out-of-range runtime message. Go omits
// the "with length" suffix for negative indices and includes it otherwise, so
// callers route every element bounds failure through here to stay byte-faithful.
function outOfRangeIndex(index: number, length: number): never {
  if (index < 0) {
    runtimePanic(`runtime error: index out of range [${index}]`)
  }
  runtimePanic(
    `runtime error: index out of range [${index}] with length ${length}`,
  )
}

// ArrayViewTarget is the target of an array view proxy: an empty array that
// holds the window the view reads and writes.
type ArrayViewTarget<T> = T[] & { __meta__: GoSliceObject<T> }

// sliceProxyOwnTraps describe the elements of a slice proxy as own
// properties of it, read from its window, since its target holds none.
const sliceProxyOwnTraps = {
  getOwnPropertyDescriptor(
    target: ArrayViewTarget<any>,
    prop: string | symbol,
  ): PropertyDescriptor | undefined {
    const meta = target.__meta__
    const index = sliceIndexProperty(prop)
    if (index >= 0 && index < meta.length) {
      return {
        value: meta.backing[meta.offset + index],
        writable: true,
        enumerable: true,
        configurable: true,
      }
    }
    return Reflect.getOwnPropertyDescriptor(target, prop)
  },
  has(target: ArrayViewTarget<any>, prop: string | symbol): boolean {
    const index = sliceIndexProperty(prop)
    if (index >= 0) {
      return index < target.__meta__.length
    }
    return Reflect.has(target, prop)
  },
  ownKeys(target: ArrayViewTarget<any>): (string | symbol)[] {
    const keys: (string | symbol)[] = []
    for (let i = 0; i < target.__meta__.length; i++) {
      keys.push(String(i))
    }
    for (const key of Reflect.ownKeys(target)) {
      if (sliceIndexProperty(key) < 0) {
        keys.push(key)
      }
    }
    return keys
  },
}

// arrayViewProxyHandler is the handler of the array views that
// sliceToArrayPointer makes. Indexes read and write the window's part of its
// backing array.
const arrayViewProxyHandler: ProxyHandler<ArrayViewTarget<any>> = {
  ...sliceProxyOwnTraps,
  get(target, prop, receiver) {
    // The window answers for itself before any other property.
    const meta = target.__meta__
    if (prop === '__meta__') {
      return meta
    }

    // An index reads the backing array, inside the length only.
    const index = sliceIndexProperty(prop)
    if (index >= 0) {
      if (index < meta.length) {
        return meta.backing[meta.offset + index]
      }
      runtimePanic(`Slice index out of range: ${index} >= ${meta.length}`)
    }

    // The length is the window's.
    if (prop === 'length') {
      return meta.length
    }

    // Sorting works on the window, not the target.
    if (prop === 'sort') {
      return sliceProxySortMethod(meta, receiver as SliceProxy<any>)
    }

    // So do the methods that iterate.
    if (
      prop === 'slice' ||
      prop === 'map' ||
      prop === 'filter' ||
      prop === 'reduce' ||
      prop === 'forEach' ||
      prop === Symbol.iterator
    ) {
      return sliceProxyBackingMethod(meta, prop)
    }

    return Reflect.get(target, prop)
  },

  set(target, prop, value): boolean {
    // An index writes the backing array, inside the length or at the length
    // when the capacity has room.
    const meta = target.__meta__
    const index = sliceIndexProperty(prop)
    if (index >= 0) {
      if (index < meta.length) {
        meta.backing[meta.offset + index] = value
        return true
      }
      if (index === meta.length && meta.length < meta.capacity) {
        meta.backing[meta.offset + index] = value
        meta.length++
        return true
      }
      runtimePanic(`Slice index out of range: ${index} >= ${meta.length}`)
    }

    // The length and the window are not assignable.
    if (prop === 'length' || prop === '__meta__') {
      return false
    }

    return Reflect.set(target, prop, value)
  },
}

function sliceProxyBackingMethod<T>(
  meta: GoSliceObject<T>,
  prop: string | symbol,
): unknown {
  const backingSlice = meta.backing.slice(
    meta.offset,
    meta.offset + meta.length,
  )
  const method = Reflect.get(backingSlice, prop)
  if (typeof method === 'function') {
    return method.bind(backingSlice)
  }
  return method
}

// sliceProxySortMethod mutates only the backing window because sparse proxy targets
// have no numeric own properties for Array.prototype.sort to enumerate.
function sliceProxySortMethod<T>(
  meta: GoSliceObject<T>,
  receiver: SliceProxy<T>,
): (compareFn?: (left: T, right: T) => number) => SliceProxy<T> {
  return (compareFn) => {
    const values = meta.backing.slice(meta.offset, meta.offset + meta.length)
    values.sort(compareFn)
    for (let i = 0; i < values.length; i++) {
      meta.backing[meta.offset + i] = values[i]
    }
    return receiver
  }
}

function sliceProxyFromBacking<T>(
  backing: T[],
  offset: number,
  length: number,
  capacity: number,
): SliceProxy<T> {
  // Each slice is a window object of its own, even where it shares its
  // backing array with an earlier slice.
  return new GoSlice(backing, offset, length, capacity)
}

// asArray converts a slice to a JavaScript array.
export function asArray<T>(slice: Slice<T>): T[] {
  if (slice === null || slice === undefined) {
    return []
  }

  if (isTypedSlice(slice)) {
    return Array.from(slice) as T[]
  }

  if (isComplexSlice(slice)) {
    const result: T[] = []
    for (let i = 0; i < slice.__meta__.length; i++) {
      result.push(slice.__meta__.backing[slice.__meta__.offset + i])
    }
    return result
  }

  return slice
}

export function sliceToArray<T>(
  slice: Slice<T> | Uint8Array,
  length: number,
  typeHint?: string,
): T[] | Uint8Array {
  if (len(slice) < length) {
    runtimePanic(
      `runtime error: cannot convert slice with length ${len(slice)} to array or pointer to array with length ${length}`,
    )
  }
  if (typeHint === 'byte') {
    return arrayValue(
      new Uint8Array(asArray(slice as Slice<T>).slice(0, length) as number[]),
    )
  }
  return arrayValue(asArray(slice as Slice<T>).slice(0, length))
}

/**
 * sliceToArrayPointer keeps element and whole-array writes in the slice backing.
 */
export function sliceToArrayPointer<T>(
  slice: Slice<T> | Uint8Array,
  length: number,
  typeHint: 'byte',
): VarRef<Uint8Array>
export function sliceToArrayPointer<T>(
  slice: Slice<T> | Uint8Array,
  length: number,
): VarRef<T[]>
export function sliceToArrayPointer<T>(
  slice: Slice<T> | Uint8Array,
  length: number,
  _typeHint?: string,
): VarRef<T[] | Uint8Array> {
  // The slice holds the whole array.
  if (len(slice) < length) {
    runtimePanic(
      `runtime error: cannot convert slice with length ${len(slice)} to array or pointer to array with length ${length}`,
    )
  }

  // A Go array is a JavaScript array, so a window is seen through a proxy
  // that reads and writes its backing array.
  let view = goSlice(slice as Slice<T>, 0, length) as T[] | Uint8Array
  if (view instanceof GoSlice) {
    const target: ArrayViewTarget<T> = Object.assign([], { __meta__: view })
    view = new Proxy(target, arrayViewProxyHandler)
  }

  // The pointer reads the view, and storing an array copies into it.
  const ref = varRef(view)
  Object.defineProperty(ref, 'value', {
    get: () => view,
    set: (value: T[] | Uint8Array) => {
      copy(view as Slice<T>, value as Slice<T>)
    },
  })
  return ref
}

/**
 * isComplexSlice identifies slices with explicit backing-window metadata.
 */
function isComplexSlice<T>(slice: unknown): slice is SliceProxy<T> {
  // sliceMeta reads the window of a proxy without its has trap. Testing
  // instanceof GoSlice first would slow down every test of a plain array.
  return (
    slice !== null &&
    typeof slice === 'object' &&
    sliceMeta(slice) !== undefined
  )
}

function normalizeSliceIndex(value: number | undefined): number | undefined {
  if (value === undefined) {
    return undefined
  }
  return Number(value)
}

// typedSliceMeta returns the window of a typed slice with spare capacity.
function typedSliceMeta(slice: TypedSlice): TypedSliceMeta | undefined {
  return (slice as TypedSliceWindow).__meta__
}

/** checkTypedSliceBounds validates two-index slice bounds against capacity. */
function checkTypedSliceBounds(
  low: number,
  high: number,
  capacity: number,
): void {
  if (low < 0 || high < low || low > capacity || high > capacity) {
    runtimePanic(
      `runtime error: slice bounds out of range [${low}:${high}] with capacity ${capacity}`,
    )
  }
}

// typedSliceView returns the slice of length elements at offset of a typed
// backing array, with the given capacity. A byte slice is a subarray, which
// carries its window when it has spare capacity; another slice is its backing
// array when it covers all of it, and a GoSlice window on it otherwise.
function typedSliceView(
  backing: TypedSlice,
  offset: number,
  length: number,
  capacity: number,
): TypedSlice | GoSlice<number> {
  // A byte slice is a view of exactly its elements.
  if (backing instanceof Uint8Array) {
    return byteSliceView(backing, offset, length, capacity)
  }

  // Any other typed slice is held as a plain array is, by a window object
  // that reads and writes the typed array by index, as an array.
  if (offset === 0 && length === capacity && capacity === backing.length) {
    return backing
  }
  return new GoSlice(
    backing as ArrayLike<number> as number[],
    offset,
    length,
    capacity,
  )
}

// byteSliceView returns the byte slice of length bytes at offset of backing,
// with the given capacity, which a view with spare capacity carries as its
// window.
function byteSliceView(
  backing: Uint8Array,
  offset: number,
  length: number,
  capacity: number,
): Uint8Array {
  const view = backing.subarray(offset, offset + length) as TypedSliceWindow &
    Uint8Array
  if (capacity !== length) {
    view.__meta__ = {
      backing,
      offset,
      length,
      capacity,
    }
  }
  return view
}

/**
 * isSliceProxy narrows slices with explicit backing-window metadata.
 */
export function isSliceProxy<T>(slice: Slice<T>): slice is SliceProxy<T> {
  return isComplexSlice(slice)
}

/**
 * makeSlice allocates a zero-initialized backing array with the requested length and capacity.
 */
export const makeSlice = <T>(
  length: number,
  capacity?: number,
  typeHint?: string,
  zeroFactory?: () => T,
): Slice<T> => {
  // Fixed-size numeric elements are held in a typed array, which is zero.
  const typed = typedSliceConstructor(typeHint)
  if (typed !== undefined) {
    return makeTypedSlice(typed, length, capacity) as Slice<T>
  }

  const actualCapacity = capacity === undefined ? length : capacity
  if (length < 0 || actualCapacity < 0 || length > actualCapacity) {
    runtimePanic(
      actualCapacity < 0 ?
        'runtime error: makeslice: cap out of range'
      : 'runtime error: makeslice: len out of range',
    )
  }

  const zeroValue = (): T => {
    if (zeroFactory !== undefined) {
      return zeroFactory()
    }
    switch (typeHint) {
      case 'number':
        return 0 as T
      case 'boolean':
        return false as T
      case 'string':
        return '' as T
      default:
        return null as T // Default for objects, complex types, or unspecified
    }
  }

  const backingArr = new Array<T>(actualCapacity)
  // Go zero-initializes the whole backing array. Elements beyond len become
  // observable when a slice is resliced up to cap. The first struct prepares
  // the float fields of the structs made after it.
  for (let i = 0; i < actualCapacity; i++) {
    backingArr[i] = zeroValue()
    if (i === 0 && zeroFactory !== undefined) {
      prepareFloatFields(backingArr[0])
    }
  }

  // A slice that covers its whole backing array is the array; any other is a
  // window on it.
  if (length === actualCapacity) {
    return backingArr as Slice<T>
  }
  return new GoSlice(backingArr, 0, length, actualCapacity)
}

// preparedStructs holds the struct classes whose float fields
// prepareFloatFields has prepared.
const preparedStructs = new WeakSet<object>()

// prepareFloatFields stores a fraction, and then zero again, in each float
// field of zero, a zero struct, once per struct class. V8 then stores those
// fields of the structs of the class made later as doubles. Otherwise each
// of them holds the small integer 0, and the first fraction stored in a
// field changes the layout of the class, which moves every struct made
// before to the new layout when it is next used: about 200 ns per struct,
// seconds for the millions of structs of a GPU compute buffer.
function prepareFloatFields(zero: unknown): void {
  // Only a struct class not prepared before is prepared.
  const ctor = (zero as { constructor?: unknown } | null)?.constructor
  if (typeof ctor !== 'function' || preparedStructs.has(ctor)) {
    return
  }
  preparedStructs.add(ctor)
  const info = resolveTypeInfo(structValueTypeInfo(zero))
  if (info === undefined || info.kind !== TypeKind.Struct) {
    return
  }

  // Float fields hold a fraction for a moment and nested structs are
  // prepared in turn.
  const fields = zero as Record<string, unknown>
  for (const field of (info as StructTypeInfo).fields) {
    const key = field.key ?? field.name
    const type = resolveTypeInfo(field.type)
    if (type?.kind === TypeKind.Basic && isFloatName(type.name)) {
      fields[key] = 0.5
      fields[key] = 0
    } else if (type?.kind === TypeKind.Struct) {
      prepareFloatFields(fields[key])
    }
  }
}

// isFloatName reports whether name is that of a float type.
function isFloatName(name: string | undefined): boolean {
  return name === 'float32' || name === 'float64'
}

// makeTypedSlice makes a typed slice of length elements and the given
// capacity, held in a typed array of ctor.
function makeTypedSlice(
  ctor: TypedSliceConstructor,
  length: number,
  capacity: number | undefined,
): TypedSlice | GoSlice<number> {
  // The length must be in range of the capacity.
  const actualCapacity = capacity === undefined ? length : capacity
  if (length < 0 || actualCapacity < 0 || length > actualCapacity) {
    runtimePanic(
      actualCapacity < 0 ?
        'runtime error: makeslice: cap out of range'
      : 'runtime error: makeslice: len out of range',
    )
  }

  // The typed array of the capacity is zero, as Go zeroes it.
  return typedSliceView(new ctor(actualCapacity), 0, length, actualCapacity)
}

/**
 * goSlice returns a shared view for s[low:high:max]. Omitted bounds use zero, length, and capacity.
 */
export function goSlice(
  s: TypedSlice,
  low?: number,
  high?: number,
  max?: number,
): Slice<number>
export function goSlice<T>(
  s: Slice<T>,
  low?: number,
  high?: number,
  max?: number,
): Slice<T>
export function goSlice<T>(
  s: Slice<T> | TypedSlice,
  low?: number,
  high?: number,
  max?: number,
): Slice<T> {
  s = collectionValue(s) as Slice<T> | TypedSlice
  low = normalizeSliceIndex(low)
  high = normalizeSliceIndex(high)
  max = normalizeSliceIndex(max)

  // A window object and a plain array without a window, the common cases,
  // are sliced by their windows when the bounds are in range, tested first
  // without reading __meta__ (see sliceLen).
  if (s instanceof GoSlice) {
    const sliced = sliceOfWindow(
      s.backing,
      s.offset,
      s.length,
      s.capacity,
      low,
      high,
      max,
    )
    if (sliced !== undefined) {
      return sliced
    }
  } else if (Array.isArray(s) && (s as any).__meta__ === undefined) {
    const sliced = sliceOfWindow(
      s as T[],
      0,
      s.length,
      s.length,
      low,
      high,
      max,
    )
    if (sliced !== undefined) {
      return sliced
    }
  }

  // A typed slice is sliced as a window on its backing array.
  if (isTypedSlice(s)) {
    return sliceTyped(s, low, high, max) as Slice<T>
  }

  // Handle nil slices - in Go, slicing a nil slice with valid bounds returns nil
  if (s === null || s === undefined) {
    low = low ?? 0
    high = high ?? 0

    if (low < 0 || high < low) {
      runtimePanic(`runtime error: slice bounds out of range [${low}:${high}]`)
    }

    if (low !== 0 || high !== 0) {
      runtimePanic(
        `runtime error: slice bounds out of range [:${high}] with capacity 0`,
      )
    }

    if (max !== undefined && max !== 0) {
      runtimePanic(
        `runtime error: slice bounds out of range [::${max}] with capacity 0`,
      )
    }

    return null as Slice<T>
  }

  const slen = len(s)
  low = low ?? 0
  high = high ?? slen

  if (low < 0 || high < low) {
    runtimePanic(`runtime error: slice bounds out of range [${low}:${high}]`)
  }

  // In Go, high can be up to capacity, not just length
  const scap = cap(s)
  if (high > scap) {
    runtimePanic(`Slice index out of range: ${high} > ${scap}`)
  }

  // A slice of a whole array shares its storage, but an array value's marker
  // must not make the slice itself copy like an array, so it gets a view.
  if (
    isArrayOrGoSlice(s) &&
    !isComplexSlice(s) &&
    !isArrayValue(s) &&
    low === 0 &&
    high === s.length &&
    max === undefined
  ) {
    return s
  }

  let backing: T[]
  let oldOffset = 0
  let oldCap = scap

  if (isComplexSlice(s)) {
    backing = s.__meta__.backing
    oldOffset = s.__meta__.offset
    oldCap = s.__meta__.capacity
  } else {
    backing = s as T[]
  }

  let newCap
  if (max !== undefined) {
    if (max < high) {
      runtimePanic(`runtime error: slice bounds out of range [:${high}:${max}]`)
    }
    if (isComplexSlice(s) && max > oldOffset + oldCap) {
      runtimePanic(`Slice index out of range: ${max} > ${oldOffset + oldCap}`)
    }
    if (!isComplexSlice(s) && max > s.length) {
      runtimePanic(`Slice index out of range: ${max} > ${s.length}`)
    }
    newCap = max - low
  } else {
    if (isComplexSlice(s)) {
      newCap = oldCap - low
    } else {
      newCap = s.length - low
    }
  }

  // A slice that extends past the length of s reads spare capacity, whose
  // empty slots get their zero values now.
  if (high > slen) {
    fillSpareCapacity(backing, oldOffset + slen, oldOffset + high)
  }

  const newLength = high - low
  const newOffset = oldOffset + low

  if (
    !isArrayValue(backing) &&
    newOffset === 0 &&
    newLength === newCap &&
    backing.length === newLength
  ) {
    return backing as Slice<T>
  }

  return new GoSlice(backing as T[], newOffset, newLength, newCap)
}

// sliceOfWindow returns backing[offset:offset+length][low:high:max] for a
// window of offset, length and capacity on backing, or undefined when the
// bounds are out of range, which the general path of goSlice reports.
function sliceOfWindow<T>(
  backing: T[],
  offset: number,
  length: number,
  capacity: number,
  low: number | undefined,
  high: number | undefined,
  max: number | undefined,
): Slice<T> | undefined {
  // Omitted bounds are zero, the length and the capacity.
  const lo = low ?? 0
  const hi = high ?? length
  const mx = max ?? capacity
  if (lo < 0 || hi < lo || mx < hi || mx > capacity) {
    return undefined
  }

  // A slice that extends past the length reads spare capacity, whose empty
  // slots get their zero values now.
  if (hi > length) {
    fillSpareCapacity(backing, offset + length, offset + hi)
  }

  // A slice of a whole backing array is the array, unless the array is an
  // array value, whose marker must not make the slice copy like an array.
  const newOffset = offset + lo
  const newLength = hi - lo
  const newCap = mx - lo
  if (
    newOffset === 0 &&
    newLength === newCap &&
    backing.length === newLength &&
    !isArrayValue(backing)
  ) {
    return backing as Slice<T>
  }
  return new GoSlice(backing, newOffset, newLength, newCap)
}

// sliceTyped returns s[low:high:max] of a typed slice, a window on its
// backing array. Omitted bounds are zero, the length and the capacity.
function sliceTyped(
  s: TypedSlice,
  low: number | undefined,
  high: number | undefined,
  max: number | undefined,
): TypedSlice | GoSlice<number> {
  // A view with spare capacity carries its window on the backing array.
  const meta = typedSliceMeta(s)
  const backing = meta?.backing ?? s
  const baseOffset = meta?.offset ?? 0
  const baseCapacity = meta?.capacity ?? s.length
  const actualLow = low ?? 0
  const actualHigh = high ?? s.length
  checkTypedSliceBounds(actualLow, actualHigh, baseCapacity)

  // The capacity of the result runs to max, or to that of s.
  if (max !== undefined && (max < actualHigh || max > baseCapacity)) {
    runtimePanic(
      `runtime error: slice bounds out of range [:${actualHigh}:${max}] with capacity ${baseCapacity}`,
    )
  }
  const newCap = (max ?? baseCapacity) - actualLow
  return typedSliceView(
    backing,
    baseOffset + actualLow,
    actualHigh - actualLow,
    newCap,
  )
}

/**
 * arrayToSlice converts nested arrays to shared slice views up to depth; depth one preserves the array.
 */
export function arrayToSlice<T>(arr: T[] | null | undefined): T[]
export function arrayToSlice<T>(
  arr: T[] | null | undefined,
  depth: number,
): Slice<T>
export function arrayToSlice<T>(
  arr: T[] | null | undefined,
  depth: number = 1,
): Slice<T> {
  if (arr == null) return [] as T[]

  if (arr.length === 0) return arr

  if (depth === 1) {
    return arr
  }

  const target = {
    __meta__: {
      backing: arr,
      offset: 0,
      length: arr.length,
      capacity: arr.length,
    },
  }

  const handler = {
    get(target: any, prop: string | symbol): any {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < target.__meta__.length) {
          return target.__meta__.backing[target.__meta__.offset + index]
        }
        runtimePanic(
          `Slice index out of range: ${index} >= ${target.__meta__.length}`,
        )
      }

      if (prop === 'length') {
        return target.__meta__.length
      }

      if (prop === '__meta__') {
        return target.__meta__
      }

      if (
        prop === 'slice' ||
        prop === 'map' ||
        prop === 'filter' ||
        prop === 'reduce' ||
        prop === 'forEach' ||
        prop === Symbol.iterator
      ) {
        const backingSlice = target.__meta__.backing.slice(
          target.__meta__.offset,
          target.__meta__.offset + target.__meta__.length,
        )
        return backingSlice[prop].bind(backingSlice)
      }

      return Reflect.get(target, prop)
    },

    set(target: any, prop: string | symbol, value: any): boolean {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < target.__meta__.length) {
          target.__meta__.backing[target.__meta__.offset + index] = value
          return true
        }
        if (
          index === target.__meta__.length &&
          target.__meta__.length < target.__meta__.capacity
        ) {
          target.__meta__.backing[target.__meta__.offset + index] = value
          target.__meta__.length++
          return true
        }
        runtimePanic(
          `Slice index out of range: ${index} >= ${target.__meta__.length}`,
        )
      }

      if (prop === 'length' || prop === '__meta__') {
        return false
      }

      return Reflect.set(target, prop, value)
    },
  }

  if (depth > 1 && arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (!isComplexSlice(item as any) && isArrayOrGoSlice(item)) {
        arr[i] = arrayToSlice(item as any[], depth - 1) as any
      }
    }
  }

  return new Proxy(target, handler) as SliceProxy<T>
}

/**
 * sliceLen returns the length of a slice, for an expression whose static
 * type is a slice type.
 */
export function sliceLen(
  slice: Slice<unknown> | unknown[] | TypedSlice | null | undefined,
): number {
  // A window object, a plain array and a typed slice are the common cases,
  // tested here without reading __meta__, which is slow on the many kinds of
  // objects seen here, in a function small enough for engines to inline. An
  // array proxy (a window viewed as a Go array) has __meta__.
  if (slice instanceof GoSlice) {
    return slice.length
  }
  if (ArrayBuffer.isView(slice)) {
    return (slice as TypedSlice).length
  }
  if (Array.isArray(slice) && (slice as any).__meta__ === undefined) {
    return slice.length
  }
  return sliceLenSlow(slice)
}

// sliceLenSlow is sliceLen for nil slices, proxies and windowed arrays.
function sliceLenSlow(
  slice: Slice<unknown> | unknown[] | TypedSlice | null | undefined,
): number {
  // A nil slice has no elements.
  if (slice === null || slice === undefined) {
    return 0
  }

  // A slice proxy knows its length.
  const meta = sliceMeta(slice)
  if (meta !== undefined) {
    return meta.length
  }

  // A plain array may carry a window of its own.
  if (isArrayOrGoSlice(slice)) {
    const plainMeta = (slice as any).__meta__ as
      | GoSliceObject<unknown>
      | undefined
    return plainMeta !== undefined ? plainMeta.length : slice.length
  }
  return len(slice as any)
}

/**
 * len returns the Go length of a collection, counting string bytes.
 */
export const len = <T = unknown, V = unknown>(
  obj:
    | string
    | Array<T>
    | Slice<T>
    | Map<T, V>
    | Set<T>
    | TypedSlice
    | { len(): number }
    | null
    | undefined,
): number => {
  // An array with a window has the length of the window.
  if (typeof obj === 'object' && obj !== null && isArrayOrGoSlice(obj)) {
    const meta = sliceMeta(obj)
    if (meta !== undefined) {
      return meta.length
    }
  }

  // Any other value is measured by its kind.
  obj = collectionValue(obj) as typeof obj
  if (obj === null || obj === undefined) {
    return 0
  }

  if (typeof obj === 'string') {
    return stringLen(obj)
  }

  if (isTypedSlice(obj)) {
    return obj.length
  }

  if (isArrayOrGoSlice(obj)) {
    const meta = (obj as SliceProxy<T>).__meta__
    if (meta !== undefined) {
      return meta.length
    }
    return obj.length
  }

  if (obj instanceof Map || obj instanceof Set) {
    return obj.size
  }

  if (isComplexSlice<T>(obj)) {
    return obj.__meta__.length
  }

  if (typeof (obj as any).len === 'function') {
    return (obj as { len(): number }).len()
  }

  throw new Error('cannot determine len of this type')
}

/**
 * cap returns the available capacity of a slice.
 */
export const cap = <T>(
  obj: Slice<T> | TypedSlice | { cap(): number } | null | undefined,
): number => {
  obj = collectionValue(obj) as typeof obj
  if (obj === null || obj === undefined) {
    return 0
  }

  if (isComplexSlice(obj as any)) {
    return (obj as SliceProxy<T>).__meta__.capacity
  }

  if (isTypedSlice(obj)) {
    return obj.length // A typed array without a window is its capacity
  }

  if (isArrayOrGoSlice(obj)) {
    return obj.length
  }

  if (typeof (obj as any).cap === 'function') {
    return (obj as { cap(): number }).cap()
  }

  return 0
}

// byteSliceHint marks an append/appendSlice call whose result element type is
// Go byte (uint8). The compiler emits it as a trailing argument, mirroring the
// makeSlice byte hint, so the runtime can byte-specialize even when the
// destination carries no representation of its own. A unique Symbol, not the
// string "byte", is used because append's element list is variadic: a plain
// string would collide with a genuine string element (append([]string, "byte"))
// and be silently consumed, whereas no Go value ever produces this Symbol.
export const byteSliceHint: unique symbol = Symbol('goscript.byteSliceHint')

const appendZeroValueMarker: unique symbol = Symbol('goscript.appendZeroValue')

// appendZero carries a static slice-element zero factory through append's
// variadic runtime boundary when the appended value cannot reveal it.
export function appendZero<T>(factory: () => T): object {
  return { [appendZeroValueMarker]: factory }
}

// nilZero is the zero of the element types whose zero is nil: pointers,
// interfaces, maps, channels, functions and slices.
const nilZero = (): null => null

// appendZeros reuses immutable hints for static zeros that dynamic values
// cannot reveal.
export const appendZeros = Object.freeze({
  complex: appendZero(() => ({ real: 0, imag: 0 })),
  nil: appendZero(nilZero),
})

// keepReference returns an element of a type whose zero is nil as it is: it
// is a reference, even when its object is also a struct value, as the
// receiver of a pointer method called on a struct field is, which a copy
// would detach from the field it points to.
function keepReference<T>(value: T): T {
  return value
}

// elementCopy returns the function that copies the elements of a slice whose
// element zero factory is zeroFactory.
function elementCopy<T>(zeroFactory: (() => T) | undefined): (value: T) => T {
  return zeroFactory === nilZero ? keepReference : copyElement
}

function appendZeroValueFactory<T>(value: unknown): (() => T) | undefined {
  if (
    typeof value !== 'object' ||
    value === null ||
    !(appendZeroValueMarker in value)
  ) {
    return undefined
  }
  const factory = value[appendZeroValueMarker]
  return typeof factory === 'function' ? (factory as () => T) : undefined
}

function nextAppendCapacity(
  oldLength: number,
  oldCapacity: number,
  newLength: number,
): number {
  if (oldCapacity === 0) {
    return newLength
  }
  if (oldLength < 1024) {
    return Math.max(oldCapacity * 2, newLength)
  }
  return Math.max(oldCapacity + Math.floor(oldCapacity / 4), newLength)
}

// TypedWindow is the window of a typed slice on its typed backing array.
interface TypedWindow {
  backing: TypedSlice
  offset: number
  length: number
  capacity: number
}

// typedWindowFrom returns the window of a slice on a typed backing array of
// ctor, holding a copy of the slice's elements when it is not already held in
// one. The append hints route nil, empty, or generically-backed destinations
// through here so append keeps a typed representation regardless of how the
// destination happened to be stored.
function typedWindowFrom(
  slice: Slice<number> | null | undefined,
  ctor: TypedSliceConstructor,
): TypedWindow {
  // A window or a typed array of ctor is the window it has.
  if (slice instanceof GoSlice) {
    const backing: unknown = slice.backing
    if (isTypedSlice(backing) && backing instanceof ctor) {
      const { offset, length, capacity } = slice
      return { backing, offset, length, capacity }
    }
  }
  if (slice instanceof ctor) {
    const meta = typedSliceMeta(slice)
    return (
      meta ?? {
        backing: slice,
        offset: 0,
        length: slice.length,
        capacity: slice.length,
      }
    )
  }

  // Anything else is copied into a typed array.
  const backing =
    slice === null || slice === undefined ?
      new ctor(0)
    : ctor.from(asArray(slice) as number[])
  return {
    backing,
    offset: 0,
    length: backing.length,
    capacity: backing.length,
  }
}

// typedAppendConstructor returns the typed array that the result of an
// append to slice is held in: that of its hint, or of a typed destination,
// or undefined for a result held in a plain array.
function typedAppendConstructor(
  slice: unknown,
  hint: unknown,
): TypedSliceConstructor | undefined {
  if (hint === byteSliceHint) {
    return Uint8Array
  }
  if (hint instanceof TypedSliceHint) {
    return hint.ctor
  }
  const backing: unknown = slice instanceof GoSlice ? slice.backing : slice
  if (isTypedSlice(backing)) {
    return backing.constructor as TypedSliceConstructor
  }
  return undefined
}

/**
 * zeroLike returns the zero value of the type of sample, an element of a
 * slice whose element type is not known: a new struct of its class, an array
 * of zeros, or the zero of a basic value; any other value's zero is nil.
 */
export function zeroLike(sample: unknown): unknown {
  return appendZeroValue(sample)
}

function appendZeroValue(sample: unknown): unknown {
  switch (typeof sample) {
    case 'bigint':
      return 0n
    case 'boolean':
      return false
    case 'number':
      return 0
    case 'string':
      return ''
  }
  if (sample instanceof Uint8Array) {
    return new Uint8Array(sample.length)
  }
  if (isArrayOrGoSlice(sample)) {
    return sample.map(appendZeroValue)
  }
  if (
    typeof sample === 'object' &&
    sample !== null &&
    isMarkedAsStructValue(sample)
  ) {
    const ctor = sample.constructor
    if (typeof ctor === 'function') {
      return markAsStructValue(Reflect.construct(ctor, []))
    }
  }
  return null
}

/**
 * appendOne appends one value that the caller already copied, as Go copies
 * an appended struct or array, to a slice of non-byte elements. It writes into
 * spare capacity directly and leaves growth to append, with the optional
 * zero or typed slice hint the compiler passes for the new capacity.
 */
export function appendOne<T>(
  slice: Slice<T> | null,
  value: unknown,
  zeroHint?: unknown,
): Slice<T> {
  // A window object with spare capacity takes the value in place, tested
  // first without reading __meta__ (see sliceLen); a plain array has none.
  if (slice instanceof GoSlice) {
    if (slice.length < slice.capacity) {
      slice.backing[slice.offset + slice.length] = value as T
      return sliceProxyFromBacking(
        slice.backing,
        slice.offset,
        slice.length + 1,
        slice.capacity,
      )
    }
  } else if (
    slice !== null &&
    slice !== undefined &&
    !(Array.isArray(slice) && (slice as any).__meta__ === undefined)
  ) {
    // Another slice with a window, such as a slice proxy.
    const meta = sliceMeta(slice)
    if (meta !== undefined && meta.length < meta.capacity) {
      meta.backing[meta.offset + meta.length] = value as T
      return sliceProxyFromBacking(
        meta.backing as T[],
        meta.offset,
        meta.length + 1,
        meta.capacity,
      )
    }
  }

  // Otherwise append grows the slice.
  if (zeroHint === undefined) {
    return append(slice, value)
  }
  return append(slice, value, zeroHint)
}

// appendValues appends several values, which the compiler has copied, with
// the element hint that append takes after them, or undefined. A window
// object with room takes them in place, so that the common case makes no
// call of the general append.
export function appendValues<T>(
  slice: Slice<T> | TypedSlice | null,
  hint: unknown,
  ...values: unknown[]
): Slice<T> {
  // A window object with spare capacity takes the values in place.
  if (
    slice instanceof GoSlice &&
    slice.length + values.length <= slice.capacity
  ) {
    const { backing, offset, length, capacity } = slice
    for (let i = 0; i < values.length; i++) {
      backing[offset + length + i] = values[i] as T
    }
    return sliceProxyFromBacking(
      backing,
      offset,
      length + values.length,
      capacity,
    )
  }

  // Otherwise append grows the slice.
  if (hint === undefined) {
    return append(slice as Slice<T>, ...values)
  }
  return append(slice as Slice<T>, ...values, hint)
}

/**
 * append returns an extended slice, sharing its backing array when capacity permits.
 */
export function append(slice: TypedSlice, ...elements: unknown[]): TypedSlice
// append Null destinations carry no runtime element type, so compiler-only hint
// values are accepted alongside the elements.
export function append<T>(slice: null, ...elements: unknown[]): Slice<T>
export function append<T>(slice: Slice<T>, ...elements: unknown[]): Slice<T>
export function append<T>(
  slice: Slice<T> | TypedSlice | null,
  ...elements: unknown[]
): Slice<T> {
  // Typed specialization is destination-independent: a Go []byte or other
  // typed slice value keeps its typed array representation across append even
  // when the destination was nil, empty, or a generically-backed array. The
  // compiler signals the element type with a trailing byteSliceHint or
  // TypedSliceHint, which is stripped here, after any zero value hint, before
  // the remaining elements are appended.
  let zeroFactory = appendZeroValueFactory<T>(elements[elements.length - 1])
  if (zeroFactory !== undefined) {
    elements.pop()
  }
  const hint = elements[elements.length - 1]
  if (hint === byteSliceHint || hint instanceof TypedSliceHint) {
    elements.pop()
  }

  // Handle generic Slice<T> (non-Uint8Array result).
  // In this case, `elements` are treated as individual items to append,
  // as the Go transpiler is responsible for spreading (`...`) if needed.
  const numAdded = elements.length

  if (numAdded === 0) {
    return slice as any
  }

  // Produce a typed slice whenever the destination already is one, or a
  // hint is present and the destination has no room to keep its backing;
  // typedSliceFrom reallocates nil/empty/generic destinations into a typed
  // array before appending.
  const typed = typedAppendConstructor(slice, hint)
  if (typed !== undefined) {
    // A window object with room takes the numbers in place, typed or not.
    if (slice instanceof GoSlice && slice.length + numAdded <= slice.capacity) {
      return appendNumbersInPlace(slice, elements) as any
    }
    if (isTypedSlice(slice) || !appendFitsWindow(slice, numAdded)) {
      return appendTypedSlice(
        typedWindowFrom(slice as Slice<number>, typed),
        elements,
      ) as any
    }
  }

  let oldLength = 0
  let oldCapacity: number
  let isOriginalComplex = false
  let originalBacking: T[] | undefined = undefined
  let originalOffset = 0

  if (slice === null || slice === undefined) {
    oldCapacity = 0
  } else if (isComplexSlice(slice)) {
    const meta = slice.__meta__
    oldLength = meta.length
    oldCapacity = meta.capacity
    isOriginalComplex = true
    originalBacking = meta.backing
    originalOffset = meta.offset
  } else {
    oldLength = (slice as T[]).length
    oldCapacity = oldLength
  }
  const newLength = oldLength + numAdded

  // Spare capacity takes the elements in place, each copied as the slice
  // holds its elements: struct and array values copied, references kept.
  const copyValue = elementCopy(zeroFactory)
  if (isOriginalComplex && newLength <= oldCapacity && originalBacking) {
    for (let i = 0; i < numAdded; i++) {
      const value = copyValue(elements[i] as T)
      originalBacking[originalOffset + oldLength + i] = value
    }
    return sliceProxyFromBacking(
      originalBacking,
      originalOffset,
      newLength,
      oldCapacity,
    ) as any
  }

  const newCapacity = nextAppendCapacity(oldLength, oldCapacity, newLength)

  // The elements are copied into a new backing array, whose spare capacity
  // gets its zero values when a slice extends into it.
  const newBacking = new Array<T>(newCapacity)
  if (oldLength > 0) {
    copyGrownElements(newBacking, slice as Slice<T>, oldLength, zeroFactory)
  }
  for (let i = 0; i < numAdded; i++) {
    newBacking[oldLength + i] = copyValue(elements[i] as T)
  }
  const sample: unknown = elements[0]
  setSpareZero(
    newBacking,
    newLength,
    zeroFactory ?? (() => appendZeroValue(sample) as T),
  )
  return sliceProxyFromBacking(newBacking, 0, newLength, newCapacity) as any
}

// spareZero is the property of a grown backing array that holds the zero
// value factory of its spare capacity, which is left empty until a slice
// extends into it (see fillSpareCapacity). Most grown slices are only ever
// appended to, which writes each slot before any slice reads it, so making
// the zero values of a struct slice's spare capacity up front doubled the
// cost of appending.
const spareZero = Symbol('goscript.spareZero')

// setSpareZero records the zero value factory of the spare capacity of
// backing, past length, if it has any.
function setSpareZero<T>(backing: T[], length: number, zero: () => T): void {
  if (length < backing.length) {
    ;(backing as any)[spareZero] = zero
  }
}

// fillSpareCapacity gives the empty slots of backing from start to end their
// zero values, before a slice extends over them.
function fillSpareCapacity<T>(backing: T[], start: number, end: number): void {
  // Only a grown backing array has empty slots.
  const zero = (backing as any)[spareZero] as (() => T) | undefined
  if (zero === undefined) {
    return
  }
  for (let i = start; i < end; i++) {
    if (backing[i] === undefined && !(i in backing)) {
      backing[i] = zero()
    }
  }
}

// copyGrownElements copies the first count elements of slice into the new
// backing array of its grown copy. The elements of a slice of one generated
// struct type, the common case, are cloned directly, which is much faster
// than copyElement's checks for every kind of value.
function copyGrownElements<T>(
  dst: T[],
  slice: Slice<T>,
  count: number,
  zeroFactory?: () => T,
): void {
  // References are kept, and without a struct class, each element is copied
  // as copyElement copies it.
  const window = sliceRange(slice)
  const backing = window.backing as any[]
  const offset = window.offset
  const cls =
    zeroFactory === nilZero ? undefined : generatedStructClass(backing[offset])
  if (cls === undefined) {
    copySliceElements(dst, 0, slice, 0, count, false, elementCopy(zeroFactory))
    return
  }

  // Each element of the class is cloned, and any other copied.
  for (let i = 0; i < count; i++) {
    const value = backing[offset + i]
    dst[i] =
      (
        value !== null &&
        value !== undefined &&
        value.constructor === cls &&
        isMarkedAsStructValue(value)
      ) ?
        value.clone()
      : copyElement(value)
  }
}

export function appendSlice(
  slice: TypedSlice,
  elements: TypedSlice | Slice<number> | string | null | undefined,
  elementHint?: typeof byteSliceHint | TypedSliceHint | object,
): TypedSlice
export function appendSlice<T>(
  slice: null,
  elements: Slice<T> | null | undefined,
  elementHint?: typeof byteSliceHint | TypedSliceHint | object,
): Slice<T>
export function appendSlice<T>(
  slice: Slice<T>,
  elements: Slice<T> | null | undefined,
  elementHint?: typeof byteSliceHint | TypedSliceHint | object,
): Slice<T>
export function appendSlice<T>(
  slice: Slice<T> | TypedSlice | null,
  elements: Slice<T> | TypedSlice | string | null | undefined,
  elementHint?: typeof byteSliceHint | TypedSliceHint | object,
): Slice<T> | TypedSlice {
  if (elements == null) {
    return slice as any
  }
  const source =
    typeof elements === 'string' ? stringToBytes(elements) : elements

  // A typed destination, or a hinted one, gets a typed result, except that a
  // generically-backed slice with spare capacity keeps that backing so
  // aliases observe the append. Nothing appended to a slice of numbers other
  // than bytes leaves it as it is, nil included.
  const typed = typedAppendConstructor(slice, elementHint)
  if (
    typed !== undefined &&
    (isTypedSlice(slice) || !appendFitsWindow(slice, len(source as Slice<T>)))
  ) {
    if (typed !== Uint8Array && len(source as Slice<T>) === 0) {
      return slice as any
    }
    return appendTypedSlice(typedWindowFrom(slice as Slice<number>, typed), [
      source,
    ]) as any
  }
  const count = len(source as Slice<T>)
  if (count === 0) {
    return slice as any
  }

  // Elements are copied into spare capacity in place, keeping references.
  const elementZero = appendZeroValueFactory<T>(elementHint)
  const copyValue = elementCopy(elementZero)
  let result = append(slice as Slice<T> | null)
  if (isComplexSlice(result)) {
    const meta = result.__meta__
    const oldLength = meta.length
    const newLength = oldLength + count
    if (newLength <= meta.capacity) {
      copySliceElements(
        meta.backing,
        meta.offset + oldLength,
        source as Slice<T>,
        0,
        count,
        false,
        copyValue,
      )
      return sliceProxyFromBacking(
        meta.backing,
        meta.offset,
        newLength,
        meta.capacity,
      )
    }
  }

  const baseLen = len(result as Slice<T>)
  const newLength = baseLen + count
  const newCapacity = nextAppendCapacity(
    baseLen,
    cap(result as Slice<T>),
    newLength,
  )
  const next = new Array<T>(newCapacity)
  copySliceElements(next, 0, result as Slice<T>, 0, baseLen, false, copyValue)
  copySliceElements(
    next,
    baseLen,
    source as Slice<T>,
    0,
    count,
    false,
    copyValue,
  )
  const sample: unknown = arrayIndex(source as any, 0)
  const zeroFactory = elementZero ?? (() => appendZeroValue(sample) as T)
  setSpareZero(next, newLength, zeroFactory)
  return sliceProxyFromBacking(next, 0, newLength, newCapacity)
}

// appendNumbersInPlace appends numbers to a window object whose capacity has
// room for them, writing them into its backing array, which keeps its kind.
function appendNumbersInPlace(
  slice: GoSlice<unknown>,
  elements: unknown[],
): GoSlice<unknown> {
  const { backing, offset, length, capacity } = slice
  for (let i = 0; i < elements.length; i++) {
    backing[offset + length + i] = elements[i]
  }
  return new GoSlice(backing, offset, length + elements.length, capacity)
}

// appendFitsWindow reports whether a slice that is not typed has the spare
// capacity to append count elements in place, which a hinted append keeps so
// that other slices of its backing array see the new elements.
function appendFitsWindow(slice: unknown, count: number): boolean {
  return isComplexSlice(slice) && len(slice) + count <= cap(slice)
}

// appendTypedSlice appends elements, which are numbers or slices to spread, to
// the window of a typed slice: in place when its capacity has room, and
// otherwise into a grown typed array of its kind.
function appendTypedSlice(
  window: TypedWindow,
  elements: any[],
): TypedSlice | GoSlice<number> {
  // The elements are written in place when they fit.
  const { backing, offset, length, capacity } = window
  let added = 0
  for (const item of elements) {
    added += typedElementLength(item)
  }
  const newLength = length + added
  if (newLength <= capacity) {
    writeTypedElements(backing, offset + length, elements)
    return typedSliceView(backing, offset, newLength, capacity)
  }

  // Keep spare backing capacity so repeated appends copy only on growth.
  const newCapacity = nextAppendCapacity(length, capacity, newLength)
  const ctor = backing.constructor as TypedSliceConstructor
  const next = new ctor(newCapacity)
  next.set(backing.subarray(offset, offset + length))
  writeTypedElements(next, length, elements)
  return typedSliceView(next, 0, newLength, newCapacity)
}

function typedElementLength(item: any): number {
  const typed = typedElements(item)
  if (typed !== undefined) {
    return typed.length
  }
  if (isComplexSlice(item) || isArrayOrGoSlice(item)) {
    return len(item as Slice<any>)
  }
  if (typeof item !== 'number') {
    throw new Error(
      'Cannot produce a typed slice: appended elements contain non-numbers.',
    )
  }
  return 1
}

function writeTypedElements(
  dst: TypedSlice,
  offset: number,
  elements: any[],
): void {
  let cursor = offset
  for (const item of elements) {
    const typed = typedElements(item)
    if (typed !== undefined) {
      dst.set(typed, cursor)
      cursor += typed.length
      continue
    }
    if (isComplexSlice(item) || isArrayOrGoSlice(item)) {
      const itemLen = len(item as Slice<any>)
      for (let i = 0; i < itemLen; i++) {
        const value = arrayIndex(item as any, i)
        if (typeof value !== 'number') {
          throw new Error(
            'Cannot produce a typed slice: appended elements contain non-numbers.',
          )
        }
        dst[cursor] = value
        cursor++
      }
      continue
    }
    if (typeof item !== 'number') {
      throw new Error(
        'Cannot produce a typed slice: appended elements contain non-numbers.',
      )
    }
    dst[cursor] = item
    cursor++
  }
}

/**
 * copy copies the shared length of src and dst, preserving overlapping source values.
 * structs tells that the elements are struct values, which are copied into
 * the elements of dst in place, as Go copies memory: pointers to them, and
 * the struct objects the generated code holds for them, then see the copy.
 */
export function copy(dst: TypedSlice, src: TypedSlice | string): number
export function copy(dst: TypedSlice, src: Slice<number>): number
export function copy<T>(dst: Slice<T>, src: Slice<T>, structs?: boolean): number
export function copy<T>(dst: Slice<T>, src: string): number
export function copy<T>(
  dst: Slice<T> | TypedSlice,
  src: Slice<T> | TypedSlice | string,
  structs?: boolean,
): number {
  if (dst === null) {
    return 0
  }

  if (typeof src === 'string') {
    return copyFromString(dst, src)
  }

  if (src === null) {
    return 0
  }

  const dstLen = isTypedSlice(dst) ? dst.length : len(dst)
  const srcLen = isTypedSlice(src) ? src.length : len(src)
  const count = Math.min(dstLen, srcLen)

  if (count === 0) {
    return 0
  }

  // Typed slices copy their memory, overlapping or not.
  const dstElements = typedElements(dst)
  const srcElements = typedElements(src)
  if (dstElements !== undefined && srcElements !== undefined) {
    dstElements.set(srcElements.subarray(0, count))
    return count
  }
  copySliceElements(dst, 0, src, 0, count, structs)
  return count
}

/**
 * copyByteRanges copies two sliced byte ranges after validating destination
 * and source bounds in order. Callers evaluate only inert operands before entry.
 * Omitted high bounds use length; explicit high bounds may reach capacity.
 */
export function copyByteRanges(
  dst: Slice<number>,
  dstLow: number | undefined,
  dstHigh: number | undefined,
  src: Slice<number>,
  srcLow: number | undefined,
  srcHigh: number | undefined,
): number {
  if (!(dst instanceof Uint8Array) || !(src instanceof Uint8Array)) {
    return copy(goSlice(dst, dstLow, dstHigh), goSlice(src, srcLow, srcHigh))
  }

  const dstMeta = typedSliceMeta(dst)
  const dstBacking = dstMeta?.backing ?? dst
  const dstStart = normalizeSliceIndex(dstLow) ?? 0
  const dstEnd = normalizeSliceIndex(dstHigh) ?? dst.length
  checkTypedSliceBounds(dstStart, dstEnd, dstMeta?.capacity ?? dst.length)

  const srcMeta = typedSliceMeta(src)
  const srcBacking = srcMeta?.backing ?? src
  const srcStart = normalizeSliceIndex(srcLow) ?? 0
  const srcEnd = normalizeSliceIndex(srcHigh) ?? src.length
  checkTypedSliceBounds(srcStart, srcEnd, srcMeta?.capacity ?? src.length)

  const count = Math.min(dstEnd - dstStart, srcEnd - srcStart)
  if (count === 0) return 0

  const dstOffset = (dstMeta?.offset ?? 0) + dstStart
  const srcOffset = (srcMeta?.offset ?? 0) + srcStart
  if (dstBacking === srcBacking) {
    dstBacking.copyWithin(dstOffset, srcOffset, srcOffset + count)
  } else {
    dstBacking.set(srcBacking.subarray(srcOffset, srcOffset + count), dstOffset)
  }
  return count
}

function copyFromString<T>(dst: Slice<T> | TypedSlice, src: string): number {
  // Copy as many bytes as both hold.
  const dstLen = isTypedSlice(dst) ? dst.length : len(dst)
  const bytes = goStringBytes(src)
  const count = Math.min(dstLen, bytes.length)
  if (count === 0) {
    return 0
  }

  // A window writes its backing array; an array or byte array itself.
  if (isTypedSlice(dst)) {
    for (let i = 0; i < count; i++) {
      dst[i] = bytes[i]
    }
  } else if (isComplexSlice(dst)) {
    const dstMeta = dst.__meta__
    for (let i = 0; i < count; i++) {
      dstMeta.backing[dstMeta.offset + i] = bytes[i] as T
    }
  } else if (Array.isArray(dst)) {
    for (let i = 0; i < count; i++) {
      dst[i] = bytes[i] as T
    }
  }

  return count
}

/**
 * copySliceElements copies each value and traverses overlapping backing in
 * the safe direction. With structs, a struct value is assigned into the
 * destination element of its class in place, as Go copies memory; any other
 * element, such as a hole, is replaced by a copy, made by copyValue.
 */
export function copySliceElements<T>(
  dst: Slice<T> | TypedSlice | null,
  dstIndex: number,
  src: Slice<T> | TypedSlice | null | undefined,
  srcIndex: number,
  count: number,
  structs = false,
  copyValue: (value: T) => T = copyElement,
): void {
  if (dst == null || src == null || count <= 0) {
    return
  }
  const dstElements = typedElements(dst)
  const srcElements = typedElements(src)
  if (dstElements !== undefined && srcElements !== undefined) {
    dstElements.set(srcElements.subarray(srcIndex, srcIndex + count), dstIndex)
    return
  }
  const srcMeta = isComplexSlice(src) ? src.__meta__ : undefined
  const dstMeta = isComplexSlice(dst) ? dst.__meta__ : undefined
  const srcBacking = srcMeta?.backing ?? src
  const dstBacking = dstMeta?.backing ?? dst
  const srcStart = (srcMeta?.offset ?? 0) + srcIndex
  const dstStart = (dstMeta?.offset ?? 0) + dstIndex
  const backward =
    srcBacking === dstBacking &&
    dstStart > srcStart &&
    dstStart < srcStart + count
  for (let step = 0; step < count; step++) {
    const i = backward ? count - 1 - step : step
    const source = (srcBacking as T[])[srcStart + i]
    const target = (dstBacking as T[])[dstStart + i]
    if (structs && assignStructInPlace(target, source)) {
      continue
    }
    ;(dstBacking as T[])[dstStart + i] = copyValue(source)
  }
}

// assignStructInPlace assigns source into target when both are struct values
// of one class, and reports whether it did.
function assignStructInPlace(target: unknown, source: unknown): boolean {
  if (
    target === null ||
    typeof target !== 'object' ||
    source === null ||
    typeof source !== 'object' ||
    target.constructor !== source.constructor ||
    !('__goscriptAssign' in target) ||
    typeof target.__goscriptAssign !== 'function'
  ) {
    return false
  }
  target.__goscriptAssign(source)
  return true
}

/**
 * index reads a collection element or string byte with Go bounds checks.
 */
export function index<T>(
  collection: string | Slice<T> | T[],
  index: number,
): T | number {
  if (collection === null || collection === undefined) {
    runtimePanic('runtime error: index on nil or undefined collection')
  }

  if (isTypedSlice(collection)) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return collection[index] as T
  } else if (isComplexSlice(collection)) {
    if (index < 0 || index >= collection.__meta__.length) {
      outOfRangeIndex(index, collection.__meta__.length)
    }
    return collection.__meta__.backing[collection.__meta__.offset + index]
  } else if (isArrayOrGoSlice(collection)) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return collection[index]
  } else if (typeof collection === 'string') {
    return indexString(collection, index)
  }
  runtimePanic('runtime error: index on unsupported type')
}

type ArrayIndexValue<C> =
  C extends TypedSlice ? number
  : C extends readonly (infer T)[] ? T
  : C extends SliceProxy<infer T> ? T
  : C extends null | undefined ? never
  : C extends Slice<infer T> ? T
  : any

/**
 * checkArrayIndex returns the index of an element of an array of the given
 * length, panicking as Go does when it is out of range. The compiler reads
 * array elements by index with it, as every representation of an array
 * (a JS array, a typed array or an array view) indexes directly.
 */
export function checkArrayIndex(index: number, length: number): number {
  // An index in range is returned, and any other panics.
  if (index >= 0 && index < length) {
    return index
  }
  outOfRangeIndex(index, length)
}

/**
 * arrayIndex reads an array or slice element with Go bounds checks.
 */
export function arrayIndex<
  C extends
    | Slice<unknown>
    | SliceProxy<unknown>
    | unknown[]
    | TypedSlice
    | null
    | undefined,
>(collection: C, index: number): ArrayIndexValue<C> {
  // An index in range of a window object, a typed slice or a plain array is
  // read here, in a function small enough for engines to inline into hot
  // loops; arrayIndexSlow handles the other representations and panics.
  if (collection instanceof GoSlice) {
    if (index >= 0 && index < collection.length) {
      return collection.backing[collection.offset + index] as ArrayIndexValue<C>
    }
  } else if (ArrayBuffer.isView(collection)) {
    if (index >= 0 && index < (collection as TypedSlice).length) {
      return (collection as TypedSlice)[index] as ArrayIndexValue<C>
    }
  } else if (Array.isArray(collection) && (collection as any).__meta__ === undefined) {
    if (index >= 0 && index < collection.length) {
      return collection[index] as ArrayIndexValue<C>
    }
  }
  return arrayIndexSlow(collection, index)
}

// arrayIndexSlow is arrayIndex for the representations and indexes that its
// fast path does not handle.
function arrayIndexSlow<
  C extends
    | Slice<unknown>
    | SliceProxy<unknown>
    | unknown[]
    | TypedSlice
    | null
    | undefined,
>(collection: C, index: number): ArrayIndexValue<C> {
  if (collection === null || collection === undefined) {
    outOfRangeIndex(index, 0)
  }

  // A window object and a plain array are the common cases, tested first
  // without reading __meta__ (see sliceLen).
  if (collection instanceof GoSlice) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return collection.backing[collection.offset + index] as ArrayIndexValue<C>
  }
  if (Array.isArray(collection) && (collection as any).__meta__ === undefined) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return collection[index] as ArrayIndexValue<C>
  }

  // A typed slice is a view of exactly its elements, so it is indexed
  // directly, also when it has a window.
  if (isTypedSlice(collection)) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return collection[index] as ArrayIndexValue<C>
  }

  // A slice proxy reads its backing array.
  const meta = sliceMeta(collection)
  if (meta !== undefined) {
    if (index < 0 || index >= meta.length) {
      outOfRangeIndex(index, meta.length)
    }
    return meta.backing[meta.offset + index] as ArrayIndexValue<C>
  }
  if (isComplexSlice(collection)) {
    const length = collection.__meta__.length
    if (index < 0 || index >= length) {
      outOfRangeIndex(index, length)
    }
    return collection.__meta__.backing[
      collection.__meta__.offset + index
    ] as ArrayIndexValue<C>
  }
  if (isArrayOrGoSlice(collection)) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return collection[index] as ArrayIndexValue<C>
  }
  runtimePanic('runtime error: index on unsupported type')
}

/**
 * indexRef returns an addressable reference to a slice or array element.
 */
export function indexRef(collection: TypedSlice, index: number): VarRef<number>
export function indexRef<T>(
  collection: Slice<T> | T[],
  index: number,
): VarRef<T>
export function indexRef<T>(
  collection: Slice<T> | T[] | TypedSlice,
  index: number,
): VarRef<T> {
  if (collection === null || collection === undefined) {
    runtimePanic('runtime error: index on nil or undefined collection')
  }

  // A window object and a plain array are the common cases, tested first
  // without reading __meta__ (see sliceLen).
  if (collection instanceof GoSlice) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return new SliceIndexReference(
      collection,
      index,
      collection.backing,
      collection.offset + index,
    )
  }
  if (Array.isArray(collection) && (collection as any).__meta__ === undefined) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return new ArrayIndexReference(collection, index)
  }

  // A typed slice, a view of exactly its elements, a slice proxy or another
  // array.
  if (isTypedSlice(collection)) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return new ArrayIndexReference(collection as unknown as T[], index)
  }
  if (isComplexSlice<T>(collection)) {
    if (index < 0 || index >= collection.__meta__.length) {
      outOfRangeIndex(index, collection.__meta__.length)
    }
    const meta = collection.__meta__
    return new SliceIndexReference(
      collection,
      index,
      meta.backing,
      meta.offset + index,
    )
  }
  if (isArrayOrGoSlice(collection)) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return new ArrayIndexReference(collection, index)
  }
  runtimePanic('runtime error: index on unsupported type')
}

// ArrayIndexReference is the reference to an element of a JavaScript array or
// byte array, which allocates its pointer machinery only when its pointer or
// address is requested.
class ArrayIndexReference<T> implements VarRef<T> {
  readonly __isVarRef = true
  private pointer?: OwnedPointerHandle<T>

  constructor(
    readonly __goCollection: T[],
    readonly __goIndex: number,
  ) {}

  get value(): T {
    return this.__goCollection[this.__goIndex]
  }

  set value(value: T) {
    this.__goCollection[this.__goIndex] = value
  }

  // The element is identified by the storage of the array and its index
  // there (see elementBacking).
  get __goElementBacking(): object {
    return elementBacking(this.__goCollection)
  }

  get __goElementIndex(): number {
    return elementBackingIndex(this.__goCollection, this.__goIndex)
  }

  get __goPointer(): OwnedPointerHandle<T> {
    return (this.pointer ??= collectionPointer(
      this,
      this.__goCollection,
      this.__goIndex,
    ))
  }

  get __goAddress(): () => number {
    return this.__goPointer.__goAddress
  }
}

// SliceIndexReference is the reference to an element of a slice with slice
// metadata, at the given index of its backing array.
class SliceIndexReference<T> implements VarRef<T> {
  readonly __isVarRef = true
  private pointer?: OwnedPointerHandle<T>

  constructor(
    readonly __goCollection: SliceProxy<T>,
    readonly __goIndex: number,
    private readonly backing: T[],
    private readonly backingIndex: number,
  ) {}

  // A slice keeps its backing array, so the element is read from it directly
  // rather than through the slice proxy.
  get value(): T {
    return this.backing[this.backingIndex]
  }

  set value(value: T) {
    this.backing[this.backingIndex] = value
  }

  // The element is identified by the storage of the backing array and its
  // index there (see elementBacking).
  get __goElementBacking(): object {
    return elementBacking(this.backing)
  }

  get __goElementIndex(): number {
    return elementBackingIndex(this.backing, this.backingIndex)
  }

  get __goPointer(): OwnedPointerHandle<T> {
    return (this.pointer ??= collectionPointer(
      this,
      this.__goCollection,
      this.__goIndex,
    ))
  }

  get __goAddress(): () => number {
    return this.__goPointer.__goAddress
  }
}

// elementBacking returns the storage of an array that pointers to its
// elements share: the array itself, or the ArrayBuffer of a typed array,
// which typed slices of the same memory view.
function elementBacking(array: object): object {
  return ArrayBuffer.isView(array) ? array.buffer : array
}

// elementBackingIndex returns the index in elementBacking(array) of the
// element of array at index: the index itself, or the byte offset of a typed
// array element.
function elementBackingIndex(array: object, index: number): number {
  // An array element is at its own index.
  if (!ArrayBuffer.isView(array)) {
    return index
  }

  // A typed array element is at its byte offset in the buffer.
  const typed = array as TypedSlice
  return typed.byteOffset + index * typed.BYTES_PER_ELEMENT
}

function collectionPointer<T>(
  ref: VarRef<T>,
  collection: Slice<T> | T[] | Uint8Array,
  index: number,
): OwnedPointerHandle<T> {
  return {
    __goOwnedPointer: true,
    __goAddress: () => indexAddress(collection, index),
    __goRef: () => ref,
    __goSlice: (length: number) => {
      if (length < 0) {
        runtimePanic('runtime error: unsafe slice length out of range')
      }
      return goSlice(collection as any, index, index + length, index + length)
    },
  }
}

export function sliceFromOwnedPointer<T>(
  pointer: OwnedPointerHandle<T>,
  length: number,
): Slice<T> | Uint8Array {
  if (!isOwnedPointerHandle(pointer) || pointer.__goSlice === undefined) {
    throw new Error('reflect.SliceAt requires a GoScript-owned pointer')
  }
  return pointer.__goSlice(length) as Slice<T> | Uint8Array
}

/**
 * typedMemoryView returns length elements of ctor that view the memory of a
 * typed slice from its element index on, as unsafe.Slice and
 * (*[N]T)(unsafe.Pointer(&s[i])) do in Go, sharing it without copying.
 */
export function typedMemoryView(
  collection: TypedSlice,
  index: number,
  length: number,
  ctor: TypedSliceConstructor,
): TypedSlice {
  // The view starts at the element's byte and must be aligned for its own
  // elements and lie within the memory of the slice's backing array.
  const byteOffset =
    collection.byteOffset + index * collection.BYTES_PER_ELEMENT
  const byteEnd = byteOffset + length * ctor.BYTES_PER_ELEMENT
  if (
    length < 0 ||
    byteOffset % ctor.BYTES_PER_ELEMENT !== 0 ||
    byteEnd > collection.buffer.byteLength
  ) {
    runtimePanic('runtime error: unsafe slice outside of the memory it views')
  }
  return new ctor(collection.buffer, byteOffset, length)
}

/**
 * arrayPointerFromIndexRef turns &slice[i] into a pointer to an N-element array
 * view. This models unsafe conversions such as (*[64]byte)(unsafe.Pointer(&b[0]))
 * for packages that immediately slice or index the resulting array pointer.
 */
export function arrayPointerFromIndexRef<T>(
  ref: VarRef<T>,
  length: number,
  sourceElementByteSize = 1,
  targetElementByteSize = sourceElementByteSize,
): VarRef<Slice<T> | T[] | Uint8Array> {
  const collection = ref.__goCollection as
    | Slice<T>
    | T[]
    | Uint8Array
    | undefined
  if (collection === undefined) {
    throw new Error(
      'unsafe array pointer requires an indexed collection reference',
    )
  }
  const index = ref.__goIndex ?? 0
  const typed = typedElements(collection)
  const view =
    targetElementByteSize === 1 && typed !== undefined ?
      typedMemoryView(typed, index, length, Uint8Array)
    : targetElementByteSize === 1 && sourceElementByteSize > 1 ?
      byteArrayFromAddress(
        indexByteAddress(collection, index, sourceElementByteSize),
        length,
      )
    : (goSlice(collection as any, index, index + length) as
        | Slice<T>
        | T[]
        | Uint8Array)
  return {
    get value() {
      return view as Slice<T> | T[] | Uint8Array
    },
    set value(value: Slice<T> | T[] | Uint8Array) {
      copy(view as any, value as any)
    },
    __isVarRef: true,
  }
}

/**
 * indexAddress returns a stable synthetic address for an addressable slice or
 * array element.
 */
export function indexAddress<T>(
  collection: Slice<T> | T[] | Uint8Array,
  index: number,
): number {
  if (collection === null || collection === undefined) {
    runtimePanic('runtime error: index on nil or undefined collection')
  }

  let backing: object
  let backingIndex: number
  let length: number
  const typed = typedElements(collection)
  if (typed !== undefined) {
    backing = typed.buffer
    backingIndex = typed.byteOffset + index * typed.BYTES_PER_ELEMENT
    length = typed.length
  } else if (isComplexSlice(collection)) {
    backing = collection.__meta__.backing
    backingIndex = collection.__meta__.offset + index
    length = collection.__meta__.length
  } else if (isArrayOrGoSlice(collection)) {
    backing = collection
    backingIndex = index
    length = collection.length
  } else {
    runtimePanic('runtime error: index on unsupported type')
  }

  if (index < 0 || index >= length) {
    outOfRangeIndex(index, length)
  }

  let base = addressBases.get(backing)
  if (base === undefined) {
    base = nextAddressBase * addressStride
    nextAddressBase++
    addressBases.set(backing, base)
  }
  return base + backingIndex
}

function uintElementValue(value: unknown, byteSize: number): bigint {
  const bits = BigInt(byteSize * 8)
  if (typeof value === 'bigint') {
    return BigInt.asUintN(Number(bits), value)
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return BigInt.asUintN(Number(bits), BigInt(Math.trunc(value)))
  }
  return 0n
}

function uintElementResult(value: bigint, byteSize: number): number | bigint {
  const normalized = BigInt.asUintN(byteSize * 8, value)
  if (normalized <= BigInt(Number.MAX_SAFE_INTEGER)) {
    return Number(normalized)
  }
  return normalized
}

function byteAddressBase(backing: object, source: ByteAddressSource): number {
  let base = byteAddressBases.get(backing)
  if (base === undefined) {
    base = nextAddressBase * addressStride
    nextAddressBase++
    byteAddressBases.set(backing, base)
  }
  byteAddressSources.set(base, source)
  return base
}

function numericByteSource(
  backing: unknown[],
  elementByteSize: number,
): ByteAddressSource {
  const byteSize = Math.max(1, Math.trunc(elementByteSize))
  return {
    byteLength: backing.length * byteSize,
    getByte(offset: number): number {
      const elementIndex = Math.trunc(offset / byteSize)
      const byteOffset = offset % byteSize
      const value = uintElementValue(backing[elementIndex], byteSize)
      return Number((value >> BigInt(byteOffset * 8)) & 0xffn)
    },
    setByte(offset: number, value: number): void {
      const elementIndex = Math.trunc(offset / byteSize)
      const byteOffset = offset % byteSize
      const shift = BigInt(byteOffset * 8)
      const mask = 0xffn << shift
      const current = uintElementValue(backing[elementIndex], byteSize)
      const next = (current & ~mask) | ((BigInt(value) & 0xffn) << shift)
      backing[elementIndex] = uintElementResult(next, byteSize)
    },
  }
}

/**
 * indexByteAddress returns a byte-addressed synthetic address for unsafe
 * uintptr arithmetic rooted at a slice or array element.
 */
export function indexByteAddress<T>(
  collection: Slice<T> | T[] | Uint8Array,
  index: number,
  elementByteSize: number,
): number {
  if (collection === null || collection === undefined) {
    runtimePanic('runtime error: index on nil or undefined collection')
  }

  const typed = typedElements(collection)
  if (typed !== undefined) {
    if (index < 0 || index >= typed.length) {
      outOfRangeIndex(index, typed.length)
    }
    const view = new Uint8Array(typed.buffer)
    const base = byteAddressBase(typed.buffer, {
      byteLength: view.length,
      getByte(offset: number): number {
        return view[offset]
      },
      setByte(offset: number, value: number): void {
        view[offset] = value
      },
    })
    return base + typed.byteOffset + index * typed.BYTES_PER_ELEMENT
  }

  if (isComplexSlice(collection)) {
    if (index < 0 || index >= collection.__meta__.length) {
      outOfRangeIndex(index, collection.__meta__.length)
    }
    const backing = collection.__meta__.backing
    const byteSize = Math.max(1, Math.trunc(elementByteSize))
    const base = byteAddressBase(backing, numericByteSource(backing, byteSize))
    return base + (collection.__meta__.offset + index) * byteSize
  }

  if (isArrayOrGoSlice(collection)) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    const byteSize = Math.max(1, Math.trunc(elementByteSize))
    const base = byteAddressBase(
      collection,
      numericByteSource(collection, byteSize),
    )
    return base + index * byteSize
  }

  runtimePanic('runtime error: index on unsupported type')
}

/**
 * unsafePointerRef resolves a byte-addressed synthetic unsafe pointer created
 * by indexByteAddress back to an addressable byte reference.
 */
export function unsafePointerRef<T>(address: unknown): VarRef<T> {
  // A pointer converted to unsafe.Pointer, such as by reflect's
  // Value.UnsafePointer, is still the variable reference itself.
  if (isVarRef(address)) {
    return address as VarRef<T>
  }
  const numericAddress = Number(address as number | bigint)
  const base = Math.floor(numericAddress / addressStride) * addressStride
  const source = byteAddressSources.get(base)
  if (source === undefined) {
    throw new Error(
      'unsafe pointer dereference is not supported in JavaScript/TypeScript',
    )
  }
  const offset = numericAddress - base
  if (offset < 0 || offset >= source.byteLength) {
    runtimePanic('runtime error: unsafe pointer address out of range')
  }
  return {
    get value(): T {
      return source.getByte(offset) as T
    },
    set value(value: T) {
      source.setByte(offset, value as number)
    },
    __isVarRef: true,
  }
}

/** NumericKind is the Go name of a fixed-size integer or float kind. */
export type NumericKind =
  | 'int8'
  | 'int16'
  | 'int32'
  | 'int64'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'float32'
  | 'float64'

// numericBits holds the bits of one value being reinterpreted.
const numericBits = new DataView(new ArrayBuffer(8))

// storeNumericBits writes value of the given kind into numericBits.
function storeNumericBits(kind: NumericKind, value: unknown): void {
  switch (kind) {
    case 'int8':
      numericBits.setInt8(0, Number(value))
      break
    case 'uint8':
      numericBits.setUint8(0, Number(value))
      break
    case 'int16':
      numericBits.setInt16(0, Number(value))
      break
    case 'uint16':
      numericBits.setUint16(0, Number(value))
      break
    case 'int32':
      numericBits.setInt32(0, Number(value))
      break
    case 'uint32':
      numericBits.setUint32(0, Number(value))
      break
    case 'float32':
      numericBits.setFloat32(0, Number(value))
      break
    case 'int64':
      numericBits.setBigInt64(0, BigInt(value as bigint))
      break
    case 'uint64':
      numericBits.setBigUint64(0, BigInt(value as bigint))
      break
    case 'float64':
      numericBits.setFloat64(0, Number(value))
      break
  }
}

// loadNumericBits reads numericBits as a value of the given kind.
function loadNumericBits(kind: NumericKind): number | bigint {
  switch (kind) {
    case 'int8':
      return numericBits.getInt8(0)
    case 'uint8':
      return numericBits.getUint8(0)
    case 'int16':
      return numericBits.getInt16(0)
    case 'uint16':
      return numericBits.getUint16(0)
    case 'int32':
      return numericBits.getInt32(0)
    case 'uint32':
      return numericBits.getUint32(0)
    case 'float32':
      return numericBits.getFloat32(0)
    case 'int64':
      return numericBits.getBigInt64(0)
    case 'uint64':
      return numericBits.getBigUint64(0)
    case 'float64':
      return numericBits.getFloat64(0)
  }
}

/**
 * unsafeNumericRef returns a reference that reads and writes the variable
 * source, of numeric kind from, with its bits reinterpreted as the same-size
 * numeric kind to, as (*uint32)(unsafe.Pointer(&f)) does for a float32 f.
 */
export function unsafeNumericRef<T>(
  source: VarRef<unknown>,
  from: NumericKind,
  to: NumericKind,
): VarRef<T> {
  return {
    get value(): T {
      storeNumericBits(from, source.value)
      return loadNumericBits(to) as T
    },
    set value(value: T) {
      storeNumericBits(to, value)
      source.value = loadNumericBits(from)
    },
    __isVarRef: true,
  }
}

function byteArrayFromAddress(
  address: number | bigint,
  length: number,
): number[] {
  const start = Number(address)
  const target = new Array<number>(length)
  return new Proxy(target, {
    get(arrayTarget, prop, receiver) {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index >= length) {
          runtimePanic(`Slice index out of range: ${index} >= ${length}`)
        }
        return unsafePointerRef<number>(start + index).value
      }
      return Reflect.get(arrayTarget, prop, receiver)
    },
    set(arrayTarget, prop, value, receiver) {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index >= length) {
          runtimePanic(`Slice index out of range: ${index} >= ${length}`)
        }
        unsafePointerRef<number>(start + index).value = value
        return true
      }
      return Reflect.set(arrayTarget, prop, value, receiver)
    },
  })
}

/**
 * utf8SequenceShape returns the encoded size of the UTF-8 sequence that the
 * leading byte b0 starts and the accepted range of its second byte, as Go's
 * utf8 first and acceptRanges tables do. A byte that cannot lead a multibyte
 * sequence has size 1.
 */
export function utf8SequenceShape(
  b0: number,
): [size: number, lo: number, hi: number] {
  if (b0 >= 0xc2 && b0 <= 0xdf) {
    return [2, 0x80, 0xbf]
  }
  if (b0 >= 0xe0 && b0 <= 0xef) {
    return [3, b0 === 0xe0 ? 0xa0 : 0x80, b0 === 0xed ? 0x9f : 0xbf]
  }
  if (b0 >= 0xf0 && b0 <= 0xf4) {
    return [4, b0 === 0xf0 ? 0x90 : 0x80, b0 === 0xf4 ? 0x8f : 0xbf]
  }
  return [1, 0x80, 0xbf]
}

/**
 * decodeRune decodes the UTF-8 rune at offset i of p as Go's utf8.DecodeRune
 * does, returning the rune and its width in bytes. An invalid or incomplete
 * encoding is RuneError (U+FFFD) with width 1, and the end of p is RuneError
 * with width 0.
 */
export function decodeRune(p: Uint8Array, i: number = 0): [number, number] {
  const n = p.length - i
  if (n < 1) {
    return [0xfffd, 0]
  }
  const b0 = p[i]
  if (b0 < 0x80) {
    return [b0, 1]
  }
  const [size, lo, hi] = utf8SequenceShape(b0)
  if (size === 1 || n < size) {
    return [0xfffd, 1]
  }
  const b1 = p[i + 1]
  if (b1 < lo || b1 > hi) {
    return [0xfffd, 1]
  }
  // The leading byte carries 7 - size payload bits.
  let r = ((b0 & (0x7f >> size)) << 6) | (b1 & 0x3f)
  for (let k = 2; k < size; k++) {
    const b = p[i + k]
    if (b < 0x80 || b > 0xbf) {
      return [0xfffd, 1]
    }
    r = (r << 6) | (b & 0x3f)
  }
  return [r, size]
}

/**
 * decodeRuneInString decodes the UTF-8 rune at byte offset i of a Go string,
 * as utf8.DecodeRuneInString does, returning the rune and its width.
 */
export function decodeRuneInString(
  str: string,
  i: number = 0,
): [number, number] {
  // No bytes are an error of width zero, and an ASCII byte is its rune.
  const n = str.length - i
  if (n < 1) {
    return [0xfffd, 0]
  }
  const b0 = str.charCodeAt(i)
  if (b0 < 0x80) {
    return [b0, 1]
  }

  // The size of the sequence and the range of its second byte follow from
  // the leading byte, as in utf8SequenceShape, inlined to avoid allocating.
  let size: number
  let lo = 0x80
  let hi = 0xbf
  if (b0 >= 0xc2 && b0 <= 0xdf) {
    size = 2
  } else if (b0 >= 0xe0 && b0 <= 0xef) {
    size = 3
    if (b0 === 0xe0) lo = 0xa0
    else if (b0 === 0xed) hi = 0x9f
  } else if (b0 >= 0xf0 && b0 <= 0xf4) {
    size = 4
    if (b0 === 0xf0) lo = 0x90
    else if (b0 === 0xf4) hi = 0x8f
  } else {
    return [0xfffd, 1]
  }

  // A sequence cut short or with a second byte out of range is an error.
  if (n < size) {
    return [0xfffd, 1]
  }
  const b1 = str.charCodeAt(i + 1)
  if (b1 < lo || b1 > hi) {
    return [0xfffd, 1]
  }

  // The rest of the bytes must be continuation bytes.
  let r = ((b0 & (0x7f >> size)) << 6) | (b1 & 0x3f)
  for (let k = 2; k < size; k++) {
    const b = str.charCodeAt(i + k)
    if (b < 0x80 || b > 0xbf) {
      return [0xfffd, 1]
    }
    r = (r << 6) | (b & 0x3f)
  }
  return [r, size]
}

/**
 * stringToRunes returns the runes of a Go string, as []rune(s) does.
 */
export const stringToRunes = (str: string): number[] => {
  // ASCII bytes are their runes, and other runes are decoded.
  str = str.toString()
  const runes: number[] = []
  for (let i = 0; i < str.length; ) {
    const c = str.charCodeAt(i)
    if (c < 0x80) {
      runes.push(c)
      i++
      continue
    }
    const [r, size] = decodeRuneInString(str, i)
    runes.push(r)
    i += size
  }
  return runes
}

/**
 * rangeString returns UTF-8 byte offsets and rune values for string iteration.
 */
export const rangeString = (str: string): Array<[number, number]> => {
  const pairs: Array<[number, number]> = []
  for (const runes = new StringRunes(str.toString()); runes.next(); ) {
    pairs.push([runes.index, runes.rune])
  }
  return pairs
}

/**
 * StringRunes steps through the runes of a Go string as a range loop over the
 * string does: each call of next moves to the next rune, setting index to its
 * byte offset and rune to its value, and returns false at the end. An ASCII
 * byte, the common case, is its own rune, so stepping over it allocates
 * nothing; other runes are decoded from their bytes.
 */
export class StringRunes {
  index = 0
  rune = 0
  // pos is the byte offset of the next rune.
  private pos = 0

  constructor(private readonly str: string) {}

  next(): boolean {
    // The string ends after its last byte.
    const str = this.str
    const pos = this.pos
    if (pos >= str.length) {
      return false
    }
    this.index = pos

    // An ASCII byte is its own rune, and any other byte starts a sequence.
    const c = str.charCodeAt(pos)
    if (c < 0x80) {
      this.rune = c
      this.pos = pos + 1
      return true
    }
    const [r, size] = decodeRuneInString(str, pos)
    this.rune = r
    this.pos = pos + size
    return true
  }
}

/**
 * stringRunes returns a StringRunes for a range loop over str.
 */
export function stringRunes(str: string): StringRunes {
  return new StringRunes(str)
}

/**
 * stringToRune returns the first rune, or zero for an empty string.
 */
export const stringToRune = (str: string): number => {
  // An empty string has no rune.
  str = str.toString()
  if (str.length === 0) {
    return 0
  }
  return decodeRuneInString(str, 0)[0]
}

/**
 * runesToString encodes Unicode scalar values, replacing invalid runes with U+FFFD.
 */
export const runesToString = (runes: Slice<number>): string => {
  // A nil or empty slice is the empty string.
  if (!runes?.length) {
    return ''
  }

  // The runes are read from the window of the slice, without an iterator.
  const { backing, offset, length } = sliceRange(runes)
  let out = ''
  for (let i = 0; i < length; i++) {
    out += runeToString(backing[offset + i])
  }
  return out
}

// runeToString converts an integer to a string as Go's string(r) does: a
// Unicode scalar value becomes its UTF-8 encoding, and a negative,
// out-of-range, or surrogate value becomes U+FFFD (utf8.RuneError). r is a
// bigint for a 64-bit integer type.
export function runeToString(r: number | bigint): string {
  // A value that is not a Unicode scalar value becomes U+FFFD.
  let n = Number(r)
  if (
    n < 0 ||
    n > 0x10ffff ||
    (n >= 0xd800 && n <= 0xdfff) ||
    !Number.isFinite(n)
  ) {
    n = 0xfffd
  }

  // The rune is encoded as one to four UTF-8 bytes.
  if (n < 0x80) {
    return String.fromCharCode(n)
  }
  if (n < 0x800) {
    return String.fromCharCode(0xc0 | (n >> 6), 0x80 | (n & 0x3f))
  }
  if (n < 0x10000) {
    return String.fromCharCode(
      0xe0 | (n >> 12),
      0x80 | ((n >> 6) & 0x3f),
      0x80 | (n & 0x3f),
    )
  }
  return String.fromCharCode(
    0xf0 | (n >> 18),
    0x80 | ((n >> 12) & 0x3f),
    0x80 | ((n >> 6) & 0x3f),
    0x80 | (n & 0x3f),
  )
}

/**
 * byte truncates a number to its low eight bits.
 */
export const byte = (n: number): number => {
  return n & 0xff
}

/**
 * indexString reads a Go string byte with bounds checks.
 */
export const indexString = (
  str: string | import('./builtin.js').Bytes,
  index: number,
): number => {
  // A string's bytes are its character codes, and a fractional index reads
  // them as a byte slice does.
  if (typeof str === 'string') {
    if (index < 0 || index >= str.length) {
      outOfRangeIndex(index, str.length)
    }
    return Number.isInteger(index) ?
        str.charCodeAt(index)
      : goStringBytes(str)[index]
  }

  // A byte slice is read by its elements.
  if (str instanceof Uint8Array) {
    if (index < 0 || index >= str.length) {
      outOfRangeIndex(index, str.length)
    }
    return str[index]
  }

  // A nil value has no elements.
  if (str === null || str === undefined) {
    outOfRangeIndex(index, 0)
  }

  // An array is read directly, and a window through its backing array.
  if (index < 0 || index >= str.length) {
    outOfRangeIndex(index, str.length)
  }
  return str instanceof Uint8Array || Array.isArray(str) ?
      (str as ArrayLike<number>)[index]
    : (arrayIndex(str as any, index) as number)
}

/**
 * stringLen returns the Go byte length of a string.
 */
export const stringLen = (str: string): number => {
  return str.length
}

/**
 * sliceString slices a Go string by bytes.
 */
export const sliceString = (
  str: string,
  low?: number,
  high?: number,
): string => {
  // The bounds are in bytes, which are the string's characters.
  const text = str.toString()
  const length = text.length
  const actualLow = low === undefined ? 0 : low
  const actualHigh = high === undefined ? length : high

  // An empty window at a valid offset is allowed, and any other bound panics.
  if (actualLow < 0 || actualHigh < actualLow || actualHigh > length) {
    if (actualLow === actualHigh && actualLow >= 0 && actualLow <= length) {
      return ''
    }
    runtimePanic(
      `runtime error: slice bounds out of range [${actualLow}:${actualHigh}] with length ${length}`,
    )
  }
  return text.substring(actualLow, actualHigh)
}

// sliceStringEqual reports whether str[low:high] == other, as the compiler
// lowers that comparison, without making the substring. The bounds are
// checked as sliceString checks them.
export function sliceStringEqual(
  str: GoStringBytes,
  low: number | undefined,
  high: number | undefined,
  other: GoStringBytes,
): boolean {
  // A string held in bytes is sliced and compared as stringEqual compares it.
  if (typeof str !== 'string' || typeof other !== 'string') {
    return stringEqual(sliceStringOrBytes(str as string, low, high), other)
  }

  // The bounds are in bytes, which are the string's characters.
  const actualLow = low === undefined ? 0 : low
  const actualHigh = high === undefined ? str.length : high
  if (actualLow < 0 || actualHigh < actualLow || actualHigh > str.length) {
    runtimePanic(
      `runtime error: slice bounds out of range [${actualLow}:${actualHigh}] with length ${str.length}`,
    )
  }

  // The bytes are compared in place: one by one for a short string, as
  // that is faster than startsWith there.
  const length = other.length
  if (actualHigh - actualLow !== length) {
    return false
  }
  if (length > 16) {
    return str.startsWith(other, actualLow)
  }
  for (let i = 0; i < length; i++) {
    if (str.charCodeAt(actualLow + i) !== other.charCodeAt(i)) {
      return false
    }
  }
  return true
}

/** bytesFromHex decodes compiler-emitted constant byte arrays. */
export function bytesFromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let index = 0; index < bytes.length; index++) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16)
  }
  return bytes
}

// bytesFromBase64 decodes the base64 text of byte data compiled into the
// program, such as embedded files, which loads much faster than an array
// literal of the bytes and is about a third of its size.
export function bytesFromBase64(data: string): Uint8Array {
  // The native decoder is used where there is one.
  if (
    'fromBase64' in Uint8Array &&
    typeof Uint8Array.fromBase64 === 'function'
  ) {
    return Uint8Array.fromBase64(data) as Uint8Array
  }

  // Otherwise the data is decoded to a string with a character per byte.
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

// textBytesEncoder encodes the text of byte data compiled into the program.
let textBytesEncoder: TextEncoder | undefined

// bytesFromText returns the UTF-8 bytes of the text of byte data compiled into
// the program, such as embedded text files, which is smaller than base64 and
// compresses much better.
export function bytesFromText(text: string): Uint8Array {
  textBytesEncoder ??= new TextEncoder()
  return textBytesEncoder.encode(text)
}

/**
 * bytesToString encodes byte values as a Go string without losing invalid UTF-8.
 */
export const bytesToString = (
  bytes: Slice<number> | Uint8Array | string,
): string => {
  if (bytes === null) return ''
  if (typeof bytes === 'string') return bytes
  if (isTypedSlice(bytes)) return goStringFromBytes(bytes as Uint8Array)
  let byteArray: number[]
  if (isComplexSlice(bytes)) {
    byteArray = bytes.__meta__.backing.slice(
      bytes.__meta__.offset,
      bytes.__meta__.offset + bytes.__meta__.length,
    )
  } else {
    byteArray = bytes
  }
  return goStringFromBytes(Uint8Array.from(byteArray, (b) => b & 0xff))
}

export function stringEqual(
  left: GoStringBytes,
  right: GoStringBytes,
): boolean {
  // Two strings are equal when their bytes, their characters, are equal.
  if (typeof left === 'string' && typeof right === 'string') {
    return left === right
  }
  const leftBytes = goStringComparableBytes(left)
  const rightBytes = goStringComparableBytes(right)
  if (leftBytes.length !== rightBytes.length) {
    return false
  }
  for (let i = 0; i < leftBytes.length; i++) {
    if (leftBytes[i] !== rightBytes[i]) {
      return false
    }
  }
  return true
}

export function stringCompare(
  left: GoStringBytes,
  right: GoStringBytes,
): number {
  // Go strings compare by their bytes, which are their character codes.
  if (typeof left === 'string' && typeof right === 'string') {
    return (
      left < right ? -1
      : left > right ? 1
      : 0
    )
  }

  // Byte slices compare by the bytes of their windows.
  if (typeof left !== 'string' && typeof right !== 'string') {
    const leftBytes = byteStringView(left)
    const rightBytes = byteStringView(right)
    const leftLen = leftBytes.length
    const rightLen = rightBytes.length
    const sharedLen = Math.min(leftLen, rightLen)
    for (let i = 0; i < sharedLen; i++) {
      const diff =
        (leftBytes.backing[leftBytes.offset + i] ?? 0) -
        (rightBytes.backing[rightBytes.offset + i] ?? 0)
      if (diff !== 0) {
        return diff
      }
    }
    return leftLen - rightLen
  }

  // A mix of strings and byte slices compares by their bytes.
  const leftBytes = goStringComparableBytes(left)
  const rightBytes = goStringComparableBytes(right)
  const sharedLen = Math.min(leftBytes.length, rightBytes.length)
  for (let i = 0; i < sharedLen; i++) {
    const diff = leftBytes[i] - rightBytes[i]
    if (diff !== 0) {
      return diff
    }
  }
  return leftBytes.length - rightBytes.length
}

type ByteStringView = {
  backing: ArrayLike<number>
  offset: number
  length: number
}

function byteStringView(value: GoStringBytes): ByteStringView {
  value = collectionValue(value) as GoStringBytes
  if (value === null || value === undefined) {
    return { backing: [], offset: 0, length: 0 }
  }
  if (value instanceof Uint8Array) {
    return { backing: value, offset: 0, length: value.length }
  }
  if (isArrayOrGoSlice(value)) {
    const meta = (value as SliceProxy<number>).__meta__
    if (meta !== undefined) {
      return {
        backing: meta.backing,
        offset: meta.offset,
        length: meta.length,
      }
    }
    return {
      backing: value as number[],
      offset: 0,
      length: (value as number[]).length,
    }
  }
  if (typeof value === 'string') {
    const bytes = goStringBytes(value)
    return { backing: bytes, offset: 0, length: bytes.length }
  }
  return { backing: [], offset: 0, length: 0 }
}

function collectionValue(value: unknown): unknown {
  if (isVarRef(value)) {
    return collectionValue(value.value)
  }
  if (isTypedNilValue(value)) {
    return null
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { __goType?: unknown }).__goType === 'string' &&
    '__goValue' in value
  ) {
    return collectionValue((value as { __goValue: unknown }).__goValue)
  }
  return value
}

// goStringFromBytes returns the Go string of bytes, one character per
// byte. ASCII bytes, the usual case, are decoded natively, which is fastest;
// others are converted in chunks, as spreading a large array is very slow.
function goStringFromBytes(bytes: Uint8Array): string {
  // Longer ASCII bytes are decoded natively.
  let ascii = true
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] >= 0x80) {
      ascii = false
      break
    }
  }
  if (ascii && bytes.length > 16) {
    return sharedTextDecoder.decode(bytes)
  }

  // Other bytes are converted by character code, in one call if they fit.
  const chunkSize = 0x2000
  if (bytes.length <= chunkSize) {
    return Reflect.apply(String.fromCharCode, null, bytes) as string
  }

  // Many bytes are converted a chunk at a time.
  let out = ''
  for (let i = 0; i < bytes.length; i += chunkSize) {
    out += Reflect.apply(
      String.fromCharCode,
      null,
      bytes.subarray(i, i + chunkSize),
    ) as string
  }
  return out
}

function goStringBytes(value: string): Uint8Array {
  const out = new Uint8Array(value.length)
  for (let i = 0; i < value.length; i++) {
    out[i] = value.charCodeAt(i) & 0xff
  }
  return out
}

/**
 * stringToBytes copies Go string bytes and preserves existing byte-array inputs.
 */
export function stringToBytes(
  s: string | import('./builtin.js').Bytes,
): Uint8Array {
  if (typeof s === 'string') {
    return goStringBytes(s)
  }
  if (s instanceof Uint8Array) {
    return s
  }
  if (s === null || s === undefined) {
    return new Uint8Array(0)
  }
  return new Uint8Array(isArrayOrGoSlice(s) ? s : [])
}

export type StringHeaderData = {
  kind: 'string'
  value: string
}

export function stringHeaderRef(s: VarRef<string>): VarRef<{
  Data: StringHeaderData
  Len: number
}> {
  return varRef({
    get Data(): StringHeaderData {
      return { kind: 'string', value: s.value }
    },
    set Data(_value: StringHeaderData) {},
    get Len(): number {
      return stringToBytes(s.value).length
    },
    set Len(_value: number) {},
  })
}

export function sliceHeaderRef(b: VarRef<Slice<number>>): VarRef<{
  Data: StringHeaderData | null
  Len: number
  Cap: number
}> {
  let data: StringHeaderData | null = null
  let length = 0
  let capacity = 0
  const refresh = () => {
    if (data === null) {
      return
    }
    const bytes = stringToBytes(data.value)
    const out = makeSlice<number>(length, Math.max(capacity, length), 'byte')
    if (out !== null) {
      copy(out, goSlice(bytes, 0, Math.min(length, bytes.length)))
    }
    b.value = out
  }
  return varRef({
    get Data(): StringHeaderData | null {
      return data
    },
    set Data(value: StringHeaderData | null) {
      data = value
      refresh()
    },
    get Len(): number {
      return length
    },
    set Len(value: number) {
      length = value
      refresh()
    },
    get Cap(): number {
      return capacity
    },
    set Cap(value: number) {
      capacity = value
      refresh()
    },
  })
}

/**
 * genericBytesOrStringToString converts values with a string or byte-slice constraint.
 */
export function genericBytesOrStringToString(
  value: string | import('./builtin.js').Bytes | null | undefined,
): string {
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'string') {
    return value as string
  }
  return bytesToString(value)
}

// indexByteString indexes compiler-encoded byte constants without allocating a
// UTF-8 buffer. Each JavaScript code unit represents exactly one original byte.
export function indexByteString(value: string, index: number): number {
  if (index < 0 || index >= value.length) outOfRangeIndex(index, value.length)
  return value.charCodeAt(index)
}

/**
 * indexStringOrBytes reads one string or slice byte with Go bounds checks.
 */
export function indexStringOrBytes(
  value: string | import('./builtin.js').Bytes,
  index: number,
): number {
  if (typeof value === 'string') {
    return indexString(value, index)
  } else if (value instanceof Uint8Array) {
    if (index < 0 || index >= value.length) {
      outOfRangeIndex(index, value.length)
    }
    return value[index]
  } else if (value === null) {
    outOfRangeIndex(index, 0)
  } else {
    const length = len(value)
    if (index < 0 || index >= length) {
      outOfRangeIndex(index, length)
    }
    return arrayIndex(value as any, index) as number
  }
}

/**
 * sliceStringOrBytes slices strings by byte and slices by element; max applies only to slices.
 */
export function sliceStringOrBytes<
  T extends string | import('./builtin.js').Bytes,
>(value: T, low?: number, high?: number, max?: number): T {
  if (typeof value === 'string') {
    return sliceString(value, low, high) as T
  } else {
    return goSlice(value as Slice<number>, low, high, max) as T
  }
}

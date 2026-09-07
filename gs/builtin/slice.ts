import {
  isMarkedAsStructValue,
  isTypedNilValue,
  markAsStructValue,
} from './type.js'
import { runtimePanic } from './panic.js'
import {
  isOwnedPointerHandle,
  isVarRef,
  varRef,
  type OwnedPointerHandle,
  type VarRef,
} from './varRef.js'

export class GoBinaryString extends String {
  readonly bytes: Uint8Array

  constructor(bytes: Uint8Array) {
    super(bytesToBinaryString(bytes))
    this.bytes = bytes.slice()
  }

  toString(): string {
    return bytesToBinaryString(this.bytes)
  }

  valueOf(): string {
    return this.toString()
  }

  [Symbol.toPrimitive](): string {
    return this.toString()
  }
}

type GoStringValue = string | GoBinaryString
type GoStringBytes = GoStringValue | Slice<number> | Uint8Array
const goBinaryStringPrefix = '\uFDD0goscript-bytes:'

// asciiString matches strings whose UTF-16 code units are their Go bytes.
// eslint-disable-next-line no-control-regex
const asciiString = /^[\x00-\x7f]*$/

function isGoStringValue(value: unknown): value is GoStringValue {
  return typeof value === 'string' || value instanceof GoBinaryString
}

// Non-streaming codecs retain no per-call state and can be shared.
const sharedTextEncoder = new TextEncoder()
const sharedTextDecoder = new TextDecoder('utf-8', { fatal: true })

function goStringBytes(str: GoStringValue): Uint8Array {
  if (str instanceof GoBinaryString) {
    return str.bytes.slice()
  }
  if (str.startsWith(goBinaryStringPrefix)) {
    return binaryStringToBytes(str.slice(goBinaryStringPrefix.length))
  }
  return sharedTextEncoder.encode(str)
}

// stringMapKey gives every Go string representation the same native Map key.
// Ordinary JavaScript strings are already canonical and need no byte conversion.
export function stringMapKey(value: string | GoBinaryString): string {
  if (typeof value === 'string' && !value.startsWith(goBinaryStringPrefix)) {
    return value
  }
  return goStringFromBytes(goStringBytes(value))
}

function goStringComparableBytes(value: GoStringBytes): Uint8Array {
  if (isGoStringValue(value)) {
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

function goStringFromBytes(bytes: Uint8Array): string {
  try {
    return sharedTextDecoder.decode(bytes)
  } catch {
    return goBinaryStringPrefix + bytesToBinaryString(bytes)
  }
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
 * SliceProxy exposes a shared backing window through array operations.
 */
export type SliceProxy<T> = T[] & {
  __meta__: GoSliceObject<T>
}

type ByteSliceMeta = Omit<GoSliceObject<number>, 'backing'> & {
  backing: Uint8Array
}

type ByteSlice = Uint8Array & {
  __meta__?: ByteSliceMeta
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
  | (T extends number ? Uint8Array : never)

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

/**
 * wrapSliceProxy routes indexed reads and writes through the backing window.
 */
function wrapSliceProxy<T>(proxy: SliceProxy<T>): SliceProxy<T> {
  const meta = proxy.__meta__
  meta.target = proxy
  const handler: ProxyHandler<SliceProxy<T>> = {
    get(target, prop, receiver) {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < meta.length) {
          return meta.backing[meta.offset + index]
        }
        outOfRangeIndex(index, meta.length)
      }

      if (prop === 'length') {
        return meta.length
      }

      if (prop === '__meta__') {
        return meta
      }

      if (prop === 'sort') {
        return sliceProxySortMethod(meta, receiver as SliceProxy<T>)
      }

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
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < meta.length) {
          meta.backing[meta.offset + index] = value
          target[index] = value
          return true
        }
        outOfRangeIndex(index, meta.length)
      }

      if (prop === 'length' || prop === '__meta__') {
        return false
      }

      return Reflect.set(target, prop, value)
    },
  }

  return new Proxy(proxy, handler) as SliceProxy<T>
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
  target?: T[],
): SliceProxy<T> {
  const proxyTargetArray = (target ?? new Array<T>(length)) as SliceProxy<T>
  proxyTargetArray.length = length
  // The proxy handler reads indexes from the backing array, so a fresh target
  // stays sparse until writes create owned elements.
  proxyTargetArray.__meta__ = { backing, offset, length, capacity }
  return wrapSliceProxy(proxyTargetArray)
}

// asArray converts a slice to a JavaScript array.
export function asArray<T>(slice: Slice<T>): T[] {
  if (slice === null || slice === undefined) {
    return []
  }

  if (slice instanceof Uint8Array) {
    return Array.from(slice) as T[]
  }

  if (isComplexSlice(slice)) {
    const result: T[] = []
    for (let i = 0; i < slice.__meta__.length; i++) {
      result.push(slice.__meta__.backing[slice.__meta__.offset + i])
    }
    return result
  }

  if (Array.isArray(slice)) {
    return slice
  }

  return []
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
    return new Uint8Array(
      asArray(slice as Slice<T>).slice(0, length) as number[],
    )
  }
  return asArray(slice as Slice<T>).slice(0, length)
}

export function sliceToArrayPointer<T>(
  slice: Slice<T> | Uint8Array,
  length: number,
  typeHint?: string,
): VarRef<T[] | Uint8Array> {
  if (len(slice) < length) {
    runtimePanic(
      `runtime error: cannot convert slice with length ${len(slice)} to array or pointer to array with length ${length}`,
    )
  }
  if (typeHint === 'byte') {
    if (slice instanceof Uint8Array) {
      return varRef(goSlice(slice, 0, length) as Uint8Array)
    }
    return varRef(goSlice(slice as Slice<T>, 0, length) as Uint8Array)
  }
  if (slice instanceof Uint8Array) {
    return varRef(goSlice(slice, 0, length) as T[])
  }
  return varRef(goSlice(slice, 0, length) as T[])
}

/**
 * isComplexSlice identifies slices with explicit backing-window metadata.
 */
function isComplexSlice<T>(slice: unknown): slice is SliceProxy<T> {
  return (
    slice !== null &&
    slice !== undefined &&
    typeof slice === 'object' &&
    '__meta__' in slice &&
    slice.__meta__ !== undefined
  )
}

function normalizeSliceIndex(value: number | undefined): number | undefined {
  if (value === undefined) {
    return undefined
  }
  return Number(value)
}

function byteSliceMeta(slice: Uint8Array): ByteSliceMeta | undefined {
  return (slice as ByteSlice).__meta__
}

function byteSliceView(
  backing: Uint8Array,
  offset: number,
  length: number,
  capacity: number,
): Uint8Array {
  const view = backing.subarray(offset, offset + length) as ByteSlice
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
  if (typeHint === 'byte') {
    const actualCapacity = capacity === undefined ? length : capacity
    if (length < 0 || actualCapacity < 0 || length > actualCapacity) {
      runtimePanic(
        actualCapacity < 0 ?
          'runtime error: makeslice: cap out of range'
        : 'runtime error: makeslice: len out of range',
      )
    }

    if (actualCapacity === length) {
      return new Uint8Array(length) as Slice<T>
    }

    return byteSliceView(
      new Uint8Array(actualCapacity),
      0,
      length,
      actualCapacity,
    ) as Slice<T>
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
  // observable when a slice is resliced up to cap.
  for (let i = 0; i < actualCapacity; i++) {
    backingArr[i] = zeroValue()
  }

  if (length === actualCapacity) {
    return backingArr as Slice<T>
  }

  const proxyTargetArray = new Array<T>(length)
  for (let i = 0; i < length; i++) {
    proxyTargetArray[i] = backingArr[i]
  }

  const proxy = proxyTargetArray as SliceProxy<T>
  proxy.__meta__ = {
    backing: backingArr,
    offset: 0,
    length,
    capacity: actualCapacity,
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

      return Reflect.get(target, prop)
    },

    set(target: any, prop: string | symbol, value: any): boolean {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < target.__meta__.length) {
          target.__meta__.backing[target.__meta__.offset + index] = value
          target[index] = value
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

  return new Proxy(proxy, handler) as SliceProxy<T>
}

/**
 * goSlice returns a shared view for s[low:high:max]. Omitted bounds use zero, length, and capacity.
 */
export function goSlice(
  s: Uint8Array,
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
  s: Slice<T> | Uint8Array,
  low?: number,
  high?: number,
  max?: number,
): Slice<T> {
  s = collectionValue(s) as Slice<T> | Uint8Array
  low = normalizeSliceIndex(low)
  high = normalizeSliceIndex(high)
  max = normalizeSliceIndex(max)

  const handler: ProxyHandler<SliceProxy<T>> = {
    get(target, prop, receiver) {
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

      if (prop === 'sort') {
        return sliceProxySortMethod(target.__meta__, receiver as SliceProxy<T>)
      }

      if (
        prop === 'slice' ||
        prop === 'map' ||
        prop === 'filter' ||
        prop === 'reduce' ||
        prop === 'forEach' ||
        prop === Symbol.iterator
      ) {
        return sliceProxyBackingMethod(target.__meta__, prop)
      }

      return Reflect.get(target, prop)
    },

    set(target, prop, value): boolean {
      const index = sliceIndexProperty(prop)
      if (index >= 0) {
        if (index < target.__meta__.length) {
          target.__meta__.backing[target.__meta__.offset + index] = value
          target[index] = value
          return true
        }
        if (
          index === target.__meta__.length &&
          target.__meta__.length < target.__meta__.capacity
        ) {
          target.__meta__.backing[target.__meta__.offset + index] = value
          target[index] = value
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

  if (s instanceof Uint8Array) {
    const meta = byteSliceMeta(s)
    const metaBacking = meta?.backing as unknown
    const backing = metaBacking instanceof Uint8Array ? metaBacking : s
    const baseOffset = meta?.offset ?? 0
    const baseCapacity = meta?.capacity ?? s.length
    const actualLow = low ?? 0
    const actualHigh = high ?? s.length

    if (
      actualLow < 0 ||
      actualHigh < actualLow ||
      actualLow > baseCapacity ||
      actualHigh > baseCapacity
    ) {
      runtimePanic(
        `runtime error: slice bounds out of range [${actualLow}:${actualHigh}] with capacity ${baseCapacity}`,
      )
    }

    const newLength = actualHigh - actualLow

    if (max !== undefined) {
      if (max < actualHigh || max > baseCapacity) {
        runtimePanic(
          `runtime error: slice bounds out of range [:${actualHigh}:${max}] with capacity ${baseCapacity}`,
        )
      }

      const newCap = max - actualLow
      return byteSliceView(
        backing,
        baseOffset + actualLow,
        newLength,
        newCap,
      ) as Slice<T>
    }

    return byteSliceView(
      backing,
      baseOffset + actualLow,
      newLength,
      baseCapacity - actualLow,
    ) as Slice<T>
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

  if (
    Array.isArray(s) &&
    !isComplexSlice(s) &&
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

  const newLength = high - low
  const newOffset = oldOffset + low

  if (newOffset === 0 && newLength === newCap && backing.length === newLength) {
    return backing as Slice<T>
  }

  const proxyTargetArray = new Array<T>(newLength)

  const proxy = proxyTargetArray as SliceProxy<T>
  proxy.__meta__ = {
    backing,
    offset: newOffset,
    length: newLength,
    capacity: newCap,
  }

  return new Proxy(proxy, handler) as SliceProxy<T>
}

/**
 * arrayToSlice converts nested arrays to shared slice views up to depth; depth one preserves the array.
 */
export const arrayToSlice = <T>(
  arr: T[] | null | undefined,
  depth: number = 1,
): Slice<T> => {
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
      if (!isComplexSlice(item as any) && Array.isArray(item)) {
        arr[i] = arrayToSlice(item as any[], depth - 1) as any
      }
    }
  }

  return new Proxy(target, handler) as SliceProxy<T>
}

/**
 * len returns the Go length of a collection, counting string bytes.
 */
export const len = <T = unknown, V = unknown>(
  obj:
    | GoStringValue
    | Array<T>
    | Slice<T>
    | Map<T, V>
    | Set<T>
    | Uint8Array
    | { len(): number }
    | null
    | undefined,
): number => {
  obj = collectionValue(obj) as typeof obj
  if (obj === null || obj === undefined) {
    return 0
  }

  if (typeof obj === 'string') {
    return stringLen(obj)
  }

  if (obj instanceof Uint8Array) {
    return obj.length
  }

  if (Array.isArray(obj)) {
    const meta = (obj as SliceProxy<T>).__meta__
    if (meta !== undefined) {
      return meta.length
    }
    return obj.length
  }

  if (obj instanceof Map || obj instanceof Set) {
    return obj.size
  }

  if (obj instanceof GoBinaryString) {
    return stringLen(obj)
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
  obj: Slice<T> | Uint8Array | { cap(): number } | null | undefined,
): number => {
  obj = collectionValue(obj) as typeof obj
  if (obj === null || obj === undefined) {
    return 0
  }

  if (isComplexSlice(obj as any)) {
    return (obj as SliceProxy<T>).__meta__.capacity
  }

  if (obj instanceof Uint8Array) {
    return obj.length // Uint8Array capacity is its length
  }

  if (Array.isArray(obj)) {
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

// appendZeros reuses immutable hints for static zeros that dynamic values
// cannot reveal.
export const appendZeros = Object.freeze({
  complex: appendZero(() => ({ real: 0, imag: 0 })),
  nil: appendZero(() => null),
})

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

// byteSliceFromSlice materializes a Uint8Array holding a slice's current byte
// values. The byte hint routes nil, empty, or generically-backed []byte
// destinations through here so append keeps a Uint8Array representation
// regardless of how the destination happened to be stored.
function byteSliceFromSlice(
  slice: Slice<number> | null | undefined,
): Uint8Array {
  if (slice === null || slice === undefined) {
    return new Uint8Array(0)
  }
  if (slice instanceof Uint8Array) {
    return slice
  }
  return Uint8Array.from(asArray(slice) as number[])
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
  if (sample instanceof GoBinaryString) {
    return ''
  }
  if (sample instanceof Uint8Array) {
    return new Uint8Array(sample.length)
  }
  if (Array.isArray(sample)) {
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
 * append returns an extended slice, sharing its backing array when capacity permits.
 */
export function append(slice: Uint8Array, ...elements: unknown[]): Uint8Array
// append Null destinations carry no runtime element type, so compiler-only hint
// values are accepted alongside the elements.
export function append<T>(slice: null, ...elements: unknown[]): Slice<T>
export function append<T>(slice: Slice<T>, ...elements: unknown[]): Slice<T>
export function append<T>(
  slice: Slice<T> | Uint8Array | null,
  ...elements: unknown[]
): Slice<T> {
  // Byte specialization is destination-independent: a Go []byte value keeps a
  // Uint8Array representation across append even when the destination was nil,
  // empty, or a generically-backed array. The compiler signals byte element
  // type with a trailing byteSliceHint, which is stripped here before the
  // remaining elements are appended.
  let zeroFactory = appendZeroValueFactory<T>(elements[elements.length - 1])
  if (zeroFactory !== undefined) {
    elements.pop()
  }
  let byteHinted = false
  if (elements.length > 0 && elements[elements.length - 1] === byteSliceHint) {
    byteHinted = true
    elements.pop()
  }

  // Handle generic Slice<T> (non-Uint8Array result).
  // In this case, `elements` are treated as individual items to append,
  // as the Go transpiler is responsible for spreading (`...`) if needed.
  const numAdded = elements.length

  if (numAdded === 0) {
    return slice as any
  }

  // Produce a Uint8Array whenever the destination already is one or the byte
  // hint is present; byteSliceFromSlice reallocates nil/empty/generic
  // destinations into a Uint8Array before appending.
  if (slice instanceof Uint8Array || byteHinted) {
    return appendByteSlice(
      byteSliceFromSlice(slice as Slice<number>),
      elements,
    ) as any
  }

  let originalElements: T[] | undefined
  let oldLength = 0
  let oldCapacity: number
  let isOriginalComplex = false
  let originalBacking: T[] | undefined = undefined
  let originalTarget: T[] | undefined = undefined
  let originalOffset = 0

  if (slice === null || slice === undefined) {
    oldCapacity = 0
  } else if (isComplexSlice(slice)) {
    const meta = slice.__meta__
    oldLength = meta.length
    oldCapacity = meta.capacity
    isOriginalComplex = true
    originalBacking = meta.backing
    originalTarget = meta.target
    originalOffset = meta.offset
  } else {
    originalElements = (slice as T[]).slice()
    oldLength = originalElements.length
    oldCapacity = oldLength
  }
  const newLength = oldLength + numAdded

  if (isOriginalComplex && newLength <= oldCapacity && originalBacking) {
    for (let i = 0; i < numAdded; i++) {
      originalBacking[originalOffset + oldLength + i] = elements[i] as T
    }
    const target = originalTarget
    if (target !== undefined) {
      for (let i = 0; i < numAdded; i++) {
        target[oldLength + i] = elements[i] as T
      }
    }
    return sliceProxyFromBacking(
      originalBacking,
      originalOffset,
      newLength,
      oldCapacity,
      target,
    ) as any
  }

  const newCapacity = nextAppendCapacity(oldLength, oldCapacity, newLength)

  const newBacking = new Array<T>(newCapacity)
  if (isOriginalComplex && originalBacking) {
    for (let i = 0; i < oldLength; i++) {
      newBacking[i] = originalBacking[originalOffset + i]
    }
  } else if (originalElements !== undefined) {
    for (let i = 0; i < oldLength; i++) {
      newBacking[i] = originalElements[i]
    }
  }
  for (let i = 0; i < numAdded; i++) {
    newBacking[oldLength + i] = elements[i] as T
  }
  const sample: unknown = elements[0]
  zeroFactory ??= () => appendZeroValue(sample) as T
  for (let i = newLength; i < newCapacity; i++) {
    newBacking[i] = zeroFactory()
  }

  return sliceProxyFromBacking(newBacking, 0, newLength, newCapacity) as any
}

export function appendSlice(
  slice: Uint8Array,
  elements: Uint8Array | Slice<number> | string | null | undefined,
  elementHint?: typeof byteSliceHint | object,
): Uint8Array
export function appendSlice<T>(
  slice: null,
  elements: Slice<T> | null | undefined,
  elementHint?: typeof byteSliceHint | object,
): Slice<T>
export function appendSlice<T>(
  slice: Slice<T>,
  elements: Slice<T> | null | undefined,
  elementHint?: typeof byteSliceHint | object,
): Slice<T>
export function appendSlice<T>(
  slice: Slice<T> | Uint8Array | null,
  elements: Slice<T> | Uint8Array | string | null | undefined,
  elementHint?: typeof byteSliceHint | object,
): Slice<T> | Uint8Array {
  if (elements == null) {
    return slice as any
  }
  const source =
    typeof elements === 'string' ? stringToBytes(elements) : elements
  // A generically-backed byte slice with spare capacity must keep that
  // backing so aliases observe the append. Byte-specialize nil, Uint8Array,
  // and reallocating destinations.
  const hintedComplexWithCapacity =
    elementHint === byteSliceHint &&
    isComplexSlice(slice) &&
    len(slice) + len(source as Slice<T>) <= cap(slice)
  if (
    slice instanceof Uint8Array ||
    (elementHint === byteSliceHint && !hintedComplexWithCapacity)
  ) {
    return appendByteSlice(byteSliceFromSlice(slice as Slice<number>), [
      source,
    ]) as any
  }
  const count = len(source as Slice<T>)
  if (count === 0) {
    return slice as any
  }

  let result = append(slice as Slice<T> | null)
  if (isComplexSlice(result)) {
    const meta = result.__meta__
    const oldLength = meta.length
    const newLength = oldLength + count
    if (newLength <= meta.capacity) {
      for (let i = 0; i < count; i++) {
        meta.backing[meta.offset + oldLength + i] = (source as any)[i]
      }
      if (meta.target !== undefined) {
        for (let i = 0; i < count; i++) {
          meta.target[oldLength + i] = (source as any)[i]
        }
      }
      return sliceProxyFromBacking(
        meta.backing,
        meta.offset,
        newLength,
        meta.capacity,
        meta.target,
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
  for (let i = 0; i < baseLen; i++) {
    next[i] = (result as any)[i]
  }
  for (let i = 0; i < count; i++) {
    next[baseLen + i] = (source as any)[i]
  }
  const sample: unknown = (source as any)[0]
  const zeroFactory =
    appendZeroValueFactory<T>(elementHint) ??
    (() => appendZeroValue(sample) as T)
  for (let i = newLength; i < newCapacity; i++) {
    next[i] = zeroFactory()
  }
  return sliceProxyFromBacking(next, 0, newLength, newCapacity)
}

function appendByteSlice(slice: Uint8Array, elements: any[]): Uint8Array {
  const meta = byteSliceMeta(slice)
  const metaBacking = meta?.backing as unknown
  const backing = metaBacking instanceof Uint8Array ? metaBacking : slice
  const offset = meta?.offset ?? 0
  const oldLength = slice.length
  const oldCapacity = meta?.capacity ?? oldLength
  let added = 0
  for (const item of elements) {
    added += byteElementLength(item)
  }
  const newLength = oldLength + added
  if (newLength <= oldCapacity) {
    const view = byteSliceView(backing, offset, newLength, oldCapacity)
    writeByteElements(view, oldLength, elements)
    return view
  }
  const next = new Uint8Array(newLength)
  next.set(slice)
  writeByteElements(next, oldLength, elements)
  return next
}

function byteElementLength(item: any): number {
  if (item instanceof Uint8Array) {
    return item.length
  }
  if (isComplexSlice(item) || Array.isArray(item)) {
    return len(item as Slice<any>)
  }
  if (typeof item !== 'number') {
    throw new Error(
      'Cannot produce Uint8Array: appended elements contain non-numbers.',
    )
  }
  return 1
}

function writeByteElements(
  dst: Uint8Array,
  offset: number,
  elements: any[],
): void {
  let cursor = offset
  for (const item of elements) {
    if (item instanceof Uint8Array) {
      dst.set(item, cursor)
      cursor += item.length
      continue
    }
    if (isComplexSlice(item) || Array.isArray(item)) {
      const itemLen = len(item as Slice<any>)
      for (let i = 0; i < itemLen; i++) {
        const value = (item as any)[i]
        if (typeof value !== 'number') {
          throw new Error(
            'Cannot produce Uint8Array: appended elements contain non-numbers.',
          )
        }
        dst[cursor] = value
        cursor++
      }
      continue
    }
    if (typeof item !== 'number') {
      throw new Error(
        'Cannot produce Uint8Array: appended elements contain non-numbers.',
      )
    }
    dst[cursor] = item
    cursor++
  }
}

/**
 * copy copies the shared length of src and dst, preserving overlapping source values.
 */
export function copy(dst: Uint8Array, src: Uint8Array | string): number
export function copy(dst: Uint8Array, src: Slice<number>): number
export function copy<T>(dst: Slice<T>, src: Slice<T>): number
export function copy<T>(dst: Slice<T>, src: string): number
export function copy<T>(
  dst: Slice<T> | Uint8Array,
  src: Slice<T> | Uint8Array | GoStringValue,
): number {
  if (dst === null) {
    return 0
  }

  if (isGoStringValue(src)) {
    return copyFromString(dst, src)
  }

  if (src === null) {
    return 0
  }

  const dstLen = dst instanceof Uint8Array ? dst.length : len(dst)
  const srcLen = src instanceof Uint8Array ? src.length : len(src)
  const count = Math.min(dstLen, srcLen)

  if (count === 0) {
    return 0
  }

  if (dst instanceof Uint8Array && src instanceof Uint8Array) {
    dst.set(src.subarray(0, count))
    return count
  }

  if (dst instanceof Uint8Array) {
    return copyToUint8Array(dst, src as Slice<number>, count)
  }

  if (src instanceof Uint8Array) {
    return copyFromUint8Array(dst as Slice<T>, src, count)
  }

  return copyBetweenSlices(dst as Slice<T>, src as Slice<T>, count)
}

function copyFromString<T>(
  dst: Slice<T> | Uint8Array,
  src: GoStringValue,
): number {
  const dstLen = dst instanceof Uint8Array ? dst.length : len(dst)
  const bytes = goStringBytes(src)
  const count = Math.min(dstLen, bytes.length)

  if (count === 0) {
    return 0
  }

  if (dst instanceof Uint8Array) {
    for (let i = 0; i < count; i++) {
      dst[i] = bytes[i]
    }
  } else if (isComplexSlice(dst)) {
    const dstMeta = dst.__meta__
    for (let i = 0; i < count; i++) {
      const byteVal = bytes[i]
      dstMeta.backing[dstMeta.offset + i] = byteVal as T
      ;(dst as any)[i] = byteVal
    }
  } else if (Array.isArray(dst)) {
    for (let i = 0; i < count; i++) {
      dst[i] = bytes[i] as T
    }
  }

  return count
}

function copyToUint8Array(
  dst: Uint8Array,
  src: Slice<number>,
  count: number,
): number {
  const values = copySliceValues(src, count)
  for (let i = 0; i < count; i++) {
    dst[i] = values[i]
  }
  return count
}

function copyFromUint8Array<T>(
  dst: Slice<T>,
  src: Uint8Array,
  count: number,
): number {
  const values = Array.from(src.subarray(0, count))
  if (isComplexSlice(dst)) {
    const dstMeta = dst.__meta__
    for (let i = 0; i < count; i++) {
      dstMeta.backing[dstMeta.offset + i] = values[i] as T
      ;(dst as any)[i] = values[i]
    }
  } else if (Array.isArray(dst)) {
    for (let i = 0; i < count; i++) {
      dst[i] = values[i] as T
    }
  }
  return count
}

function copyBetweenSlices<T>(
  dst: Slice<T>,
  src: Slice<T>,
  count: number,
): number {
  const values = copySliceValues(src, count)
  if (isComplexSlice(dst)) {
    const dstMeta = dst.__meta__
    for (let i = 0; i < count; i++) {
      dstMeta.backing[dstMeta.offset + i] = values[i]
      ;(dst as any)[i] = values[i]
    }
  } else if (Array.isArray(dst)) {
    for (let i = 0; i < count; i++) {
      dst[i] = values[i]
    }
  }
  return count
}

// copySliceValues snapshots the source before writing so overlapping slices follow Go's
// memmove-style copy semantics.
function copySliceValues<T>(src: Slice<T>, count: number): T[] {
  const values = new Array<T>(count)
  if (isComplexSlice(src)) {
    const srcMeta = src.__meta__
    for (let i = 0; i < count; i++) {
      values[i] = srcMeta.backing[srcMeta.offset + i]
    }
  } else if (Array.isArray(src)) {
    for (let i = 0; i < count; i++) {
      values[i] = src[i]
    }
  }
  return values
}

/**
 * index reads a collection element or string byte with Go bounds checks.
 */
export function index<T>(
  collection: GoStringValue | Slice<T> | T[],
  index: number,
): T | number {
  if (collection === null || collection === undefined) {
    runtimePanic('runtime error: index on nil or undefined collection')
  }

  // Slice checks avoid a GoBinaryString prototype walk through slice proxies.
  if (collection instanceof Uint8Array) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return collection[index]
  } else if (isComplexSlice(collection)) {
    if (index < 0 || index >= collection.__meta__.length) {
      outOfRangeIndex(index, collection.__meta__.length)
    }
    return collection.__meta__.backing[collection.__meta__.offset + index]
  } else if (Array.isArray(collection)) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return collection[index]
  } else if (isGoStringValue(collection)) {
    return indexString(collection, index)
  }
  runtimePanic('runtime error: index on unsupported type')
}

type ArrayIndexValue<C> =
  C extends Uint8Array ? number
  : C extends readonly (infer T)[] ? T
  : C extends SliceProxy<infer T> ? T
  : C extends null | undefined ? never
  : C extends Slice<infer T> ? T
  : any

/**
 * arrayIndex reads an array or slice element with Go bounds checks.
 */
export function arrayIndex<
  C extends
    | Slice<unknown>
    | SliceProxy<unknown>
    | unknown[]
    | Uint8Array
    | null
    | undefined,
>(collection: C, index: number): ArrayIndexValue<C> {
  if (collection === null || collection === undefined) {
    outOfRangeIndex(index, 0)
  }
  if (collection instanceof Uint8Array) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    return collection[index] as ArrayIndexValue<C>
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
  if (Array.isArray(collection)) {
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
export function indexRef<T>(
  collection: Slice<T> | T[] | Uint8Array,
  index: number,
): VarRef<T> {
  if (collection === null || collection === undefined) {
    runtimePanic('runtime error: index on nil or undefined collection')
  }
  if (collection instanceof Uint8Array) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    const ref: VarRef<T> = {
      get value() {
        return collection[index] as T
      },
      set value(value: T) {
        collection[index] = value as number
      },
      __isVarRef: true,
      __goAddress: () => indexAddress(collection, index),
      __goCollection: collection,
      __goIndex: index,
    }
    ref.__goPointer = collectionPointer(ref, collection, index)
    return ref
  }
  if (isComplexSlice(collection)) {
    if (index < 0 || index >= collection.__meta__.length) {
      outOfRangeIndex(index, collection.__meta__.length)
    }
    const backingIndex = collection.__meta__.offset + index
    const ref: VarRef<T> = {
      get value() {
        return collection.__meta__.backing[backingIndex]
      },
      set value(value: T) {
        collection[index] = value
      },
      __isVarRef: true,
      __goAddress: () => indexAddress(collection, index),
      __goCollection: collection,
      __goIndex: index,
    }
    ref.__goPointer = collectionPointer(ref, collection, index)
    return ref
  }
  if (Array.isArray(collection)) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    const ref: VarRef<T> = {
      get value() {
        return collection[index]
      },
      set value(value: T) {
        collection[index] = value
      },
      __isVarRef: true,
      __goAddress: () => indexAddress(collection, index),
      __goCollection: collection,
      __goIndex: index,
    }
    ref.__goPointer = collectionPointer(ref, collection, index)
    return ref
  }
  runtimePanic('runtime error: index on unsupported type')
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
  const view =
    targetElementByteSize === 1 && sourceElementByteSize > 1 ?
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
  if (collection instanceof Uint8Array) {
    backing = collection.buffer
    backingIndex = collection.byteOffset + index
    length = collection.length
  } else if (isComplexSlice(collection)) {
    backing = collection.__meta__.backing
    backingIndex = collection.__meta__.offset + index
    length = collection.__meta__.length
  } else if (Array.isArray(collection)) {
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

  if (collection instanceof Uint8Array) {
    if (index < 0 || index >= collection.length) {
      outOfRangeIndex(index, collection.length)
    }
    const view = new Uint8Array(collection.buffer)
    const base = byteAddressBase(collection.buffer, {
      byteLength: view.length,
      getByte(offset: number): number {
        return view[offset]
      },
      setByte(offset: number, value: number): void {
        view[offset] = value
      },
    })
    return base + collection.byteOffset + index
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

  if (Array.isArray(collection)) {
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
export function unsafePointerRef<T>(address: number | bigint): VarRef<T> {
  const numericAddress = Number(address)
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
 * stringToRunes returns the Unicode code points of a JavaScript string.
 */
export const stringToRunes = (str: string): number[] => {
  return Array.from(str).map((c) => c.codePointAt(0) || 0)
}

/**
 * rangeString returns UTF-8 byte offsets and rune values for string iteration.
 */
export const rangeString = (str: string): Array<[number, number]> => {
  const pairs: Array<[number, number]> = []
  let offset = 0
  for (const char of str) {
    pairs.push([offset, char.codePointAt(0) || 0])
    offset += sharedTextEncoder.encode(char).length
  }
  return pairs
}

/**
 * stringToRune returns the first Unicode code point, or zero for an empty string.
 */
export const stringToRune = (str: string): number => {
  if (str.length === 0) {
    return 0
  }
  return str.codePointAt(0) || 0
}

/**
 * runesToString encodes Unicode scalar values, replacing invalid runes with U+FFFD.
 */
export const runesToString = (runes: Slice<number>): string => {
  if (!runes?.length) {
    return ''
  }
  let out = ''
  for (const r of runes) {
    out += runeToString(r)
  }
  return out
}

// runeToString encodes one rune as Go's string(rune) does: a valid Unicode
// scalar value becomes its character including code points above U+FFFF (astral
// planes), and a negative, out-of-range, or surrogate rune becomes U+FFFD
// (utf8.RuneError), never a throw. String.fromCharCode truncated astral runes to
// a single broken UTF-16 unit; String.fromCodePoint preserves the full rune.
export function runeToString(r: number): string {
  if (r < 0 || r > 0x10ffff || (r >= 0xd800 && r <= 0xdfff)) {
    return '�'
  }
  return String.fromCodePoint(r)
}

/**
 * byte truncates a number to its low eight bits.
 */
export const byte = (n: number): number => {
  return n & 0xff
}

/**
 * indexString reads a Go string byte with bounds checks; ASCII reads allocate no byte buffer.
 */
export const indexString = (
  str: GoStringValue | import('./builtin.js').Bytes,
  index: number,
): number => {
  if (
    typeof str === 'string' &&
    Number.isInteger(index) &&
    asciiString.test(str)
  ) {
    if (index < 0 || index >= str.length) {
      outOfRangeIndex(index, str.length)
    }
    return str.charCodeAt(index)
  }

  if (!isGoStringValue(str)) {
    if (str instanceof Uint8Array) {
      if (index < 0 || index >= str.length) {
        outOfRangeIndex(index, str.length)
      }
      return str[index]
    }
    if (str === null || str === undefined) {
      outOfRangeIndex(index, 0)
    }
    if (index < 0 || index >= str.length) {
      outOfRangeIndex(index, str.length)
    }
    return str[index]
  }
  const bytes = goStringBytes(str)
  if (index < 0 || index >= bytes.length) {
    outOfRangeIndex(index, bytes.length)
  }
  return bytes[index]
}

/**
 * stringLen returns the Go byte length; ASCII reads allocate no byte buffer.
 */
export const stringLen = (str: GoStringValue): number => {
  if (typeof str === 'string' && asciiString.test(str)) {
    return str.length
  }
  return goStringBytes(str).length
}

/**
 * sliceString slices Go bytes, preserving invalid UTF-8 in the binary-string representation.
 */
export const sliceString = (
  str: GoStringValue,
  low?: number,
  high?: number,
): string => {
  const bytes = goStringBytes(str)
  const actualLow = low === undefined ? 0 : low
  const actualHigh = high === undefined ? bytes.length : high

  if (actualLow < 0 || actualHigh < actualLow || actualHigh > bytes.length) {
    if (
      actualLow === actualHigh &&
      actualLow >= 0 &&
      actualLow <= bytes.length
    ) {
      return ''
    }
    runtimePanic(
      `runtime error: slice bounds out of range [${actualLow}:${actualHigh}] with length ${bytes.length}`,
    )
  }

  return goStringFromBytes(bytes.subarray(actualLow, actualHigh))
}

/** bytesFromHex decodes compiler-emitted constant byte arrays. */
export function bytesFromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let index = 0; index < bytes.length; index++) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16)
  }
  return bytes
}

/**
 * bytesToString encodes byte values as a Go string without losing invalid UTF-8.
 */
export const bytesToString = (
  bytes: Slice<number> | Uint8Array | string,
): string => {
  if (bytes === null) return ''
  if (typeof bytes === 'string') return bytes
  if (bytes instanceof Uint8Array) return goStringFromBytes(bytes)
  let byteArray: number[]
  if (isComplexSlice(bytes)) {
    byteArray = bytes.__meta__.backing.slice(
      bytes.__meta__.offset,
      bytes.__meta__.offset + bytes.__meta__.length,
    )
  } else {
    byteArray = bytes
  }
  return goStringFromBytes(Uint8Array.from(byteArray))
}

export function stringEqual(
  left: GoStringBytes,
  right: GoStringBytes,
): boolean {
  // Fast path: two plain JS strings compare correctly with `===` (the only
  // case where a JS string's "true" Go bytes diverge from its own encoding
  // is the GoBinaryString wrapper, which is excluded from this branch by
  // the typeof check), avoiding the byte round-trip below entirely.
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
  if (!isGoStringValue(left) && !isGoStringValue(right)) {
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
  if (Array.isArray(value)) {
    const meta = (value as SliceProxy<number>).__meta__
    if (meta !== undefined) {
      return {
        backing: meta.backing,
        offset: meta.offset,
        length: meta.length,
      }
    }
    return { backing: value, offset: 0, length: value.length }
  }
  if (isGoStringValue(value)) {
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

function bytesToBinaryString(bytes: Uint8Array): string {
  const chunkSize = 0x8000
  let out = ''
  for (let i = 0; i < bytes.length; i += chunkSize) {
    out += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return out
}

function binaryStringToBytes(value: string): Uint8Array {
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
  s: GoStringValue | import('./builtin.js').Bytes,
): Uint8Array {
  if (isGoStringValue(s)) {
    return goStringBytes(s)
  }
  if (s instanceof Uint8Array) {
    return s
  }
  if (s === null || s === undefined) {
    return new Uint8Array(0)
  }
  return new Uint8Array(Array.isArray(s) ? s : [])
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
  if (isGoStringValue(value)) {
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
  value: GoStringValue | import('./builtin.js').Bytes,
  index: number,
): number {
  if (isGoStringValue(value)) {
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
    return (value as any)[index] as number
  }
}

/**
 * sliceStringOrBytes slices strings by byte and slices by element; max applies only to slices.
 */
export function sliceStringOrBytes<
  T extends GoStringValue | import('./builtin.js').Bytes,
>(value: T, low?: number, high?: number, max?: number): T {
  if (isGoStringValue(value)) {
    return sliceString(value, low, high) as T
  } else {
    return goSlice(value as Slice<number>, low, high, max) as T
  }
}

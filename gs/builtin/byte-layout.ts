import { runtimePanic } from './panic.js'
import { isVarRef, type VarRef } from './varRef.js'
import {
  indexByteAddress,
  sliceLen,
  arrayIndex,
  indexRef,
  GoSlice,
  isSliceProxy,
  sliceRange,
  typedElements,
  unsafeNumericRef,
  arrayPointerFromIndexRef,
  type NumericKind,
} from './slice.js'
import { markPointerAlias } from './type.js'

/** ByteLayout describes the Go layout of data with no managed references. */
export type ByteLayout = { size: number; align: number } & (
  | { kind: 'scalar'; scalar: NumericKind | 'bool' }
  | { kind: 'array'; length: number; element: ByteLayout }
  | {
      kind: 'struct'
      create?: () => object
      fields: { key: string; offset: number; layout: ByteLayout }[]
    }
)

// ByteMemory keeps the original bytes; every view and pointer uses this storage.
interface ByteMemory {
  bytes: Uint8Array
  offset: number
  layout: ByteLayout
}

// byteViews keeps view metadata without retaining otherwise unreachable views.
const byteViews = new WeakMap<object, ByteMemory>()

// byteScratch holds a scalar's bytes only during a synchronous load or store.
const byteScratch = new DataView(new ArrayBuffer(8))

/** byteLayoutPointer resolves a view element or field to its original byte address. */
export function byteLayoutPointer(
  value: object,
  key: PropertyKey,
): { backing: object; index: number; address: number } | undefined {
  const memory = byteViews.get(value)
  if (memory === undefined) return undefined
  let offset: number
  if (memory.layout.kind === 'array') {
    const index = Number(key)
    if (!Number.isInteger(index) || index < 0 || index >= memory.layout.length)
      return undefined
    offset = memory.offset + index * memory.layout.element.size
  } else if (memory.layout.kind === 'struct') {
    const field = memory.layout.fields.find((field) => field.key === key)
    if (field === undefined) return undefined
    offset = memory.offset + field.offset
  } else return undefined
  const ref = indexRef(memory.bytes, offset) as VarRef<unknown> & {
    __goElementBacking: object
    __goElementIndex: number
  }
  return {
    backing: ref.__goElementBacking,
    index: ref.__goElementIndex,
    address: indexByteAddress(memory.bytes, offset, 1),
  }
}

/** byteLayoutFieldRef retains the byte origin of a view's addressable field. */
export function byteLayoutFieldRef(
  target: object,
  key: PropertyKey,
): VarRef<unknown> | undefined {
  const memory = byteViews.get(target)
  if (memory?.layout.kind !== 'struct') return undefined
  const field = memory.layout.fields.find((field) => field.key === key)
  if (field === undefined) return undefined
  return byteReference({
    bytes: memory.bytes,
    offset: memory.offset + field.offset,
    layout: field.layout,
  })
}

/** unsafeByteView reinterprets bytes while preserving their storage and aliases.
 * Array strides and field offsets come from the compiler's Go layout. Reads are
 * lazy and writes update the same bytes; a view never copies the backing table.
 * Non-byte pointers retain their existing numeric or identity conversion paths.
 */
export function unsafeByteView<T>(
  pointer: unknown,
  layout: ByteLayout | null,
  sourceScalar?: NumericKind,
  sourceElementByteSize?: number,
): T {
  // Resolve an erased pointer while retaining its element offset.
  if (pointer === null) return pointer as T
  const origin =
    typeof pointer === 'object' ? byteViews.get(pointer) : undefined
  let value: any = pointer
  let offset = 0
  if (isVarRef(value)) {
    if (value.__goCollection !== undefined) {
      offset = value.__goIndex ?? 0
      value = value.__goCollection
    } else value = value.value
  }

  // Slice element references keep a window; normalize its backing and offset.
  if (value instanceof GoSlice || isSliceProxy(value)) {
    const window = sliceRange(value)
    offset += window.offset
    value = window.backing
  }

  // A view of an existing view keeps the original bytes and scales its offset.
  const prior =
    origin ??
    (typeof value === 'object' && value !== null ?
      byteViews.get(value)
    : undefined)
  let bytes: any = value
  if (prior !== undefined) {
    bytes = prior.bytes
    offset =
      prior.offset +
      (origin === undefined && prior.layout.kind === 'array' ?
        offset * prior.layout.element.size
      : 0)
  } else {
    const typed = typedElements(value)
    if (typed instanceof Uint8Array) {
      bytes = new Uint8Array(typed.buffer)
      offset += typed.byteOffset
    } else {
      // Numeric arrays without byte origins retain their existing representation.
      if (
        sourceElementByteSize !== undefined &&
        layout?.kind === 'array' &&
        isVarRef(pointer)
      ) {
        const ref =
          pointer.__goCollection !== undefined ?
            pointer
          : indexRef([pointer.value], 0)
        return arrayPointerFromIndexRef(
          ref,
          layout.length,
          sourceElementByteSize,
          layout.element.size,
        ) as T
      }
      if (
        sourceScalar !== undefined &&
        layout?.kind === 'scalar' &&
        layout.scalar !== 'bool' &&
        isVarRef(pointer)
      ) {
        return unsafeNumericRef(pointer, sourceScalar, layout.scalar) as T
      }
      return pointer as T
    }
  }

  // Reference-bearing layouts cannot be manufactured from byte storage.
  if (layout === null)
    runtimePanic(
      'unsafe byte view contains a managed reference or unsupported scalar',
    )
  if (offset < 0 || offset + layout.size > sliceLen(bytes))
    runtimePanic('unsafe byte view exceeds backing storage')

  // Expose storage lazily and give its pointer aliases one byte address.
  const reference = byteReference({ bytes, offset, layout })
  if (typeof pointer === 'object' && pointer !== null)
    markPointerAlias(reference, pointer)
  return reference as T
}

// byteReference keeps pointer casts tied to their original bytes, even for scalars.
function byteReference(memory: ByteMemory): VarRef<unknown> {
  const { bytes, offset, layout } = memory
  const view =
    layout.kind === 'scalar' ? undefined : readByteValue(bytes, offset, layout)
  const base = indexRef(bytes, offset) as VarRef<unknown> & {
    __goElementBacking: object
    __goElementIndex: number
  }
  const reference = {
    __isVarRef: true as const,
    __goElementBacking: base.__goElementBacking,
    __goElementIndex: base.__goElementIndex,
    __goAddress: () => indexByteAddress(bytes, offset, 1),
    get value() {
      return layout.kind === 'scalar' ?
          readByteValue(bytes, offset, layout)
        : view
    },
    set value(value: unknown) {
      writeByteValue(bytes, offset, layout, value)
    },
  }
  byteViews.set(reference, memory)
  markPointerAlias(base, reference)
  return reference
}

// readByteValue returns a scalar or a lazy composite view at its byte offset.
function readByteValue(bytes: any, offset: number, layout: ByteLayout): any {
  // The js/wasm Go target stores fixed-width numeric values little endian.
  if (layout.kind === 'scalar') {
    for (let i = 0; i < layout.size; i++)
      byteScratch.setUint8(i, arrayIndex(bytes, offset + i))
    switch (layout.scalar) {
      case 'bool':
        return byteScratch.getUint8(0) !== 0
      case 'int8':
        return byteScratch.getInt8(0)
      case 'uint8':
        return byteScratch.getUint8(0)
      case 'int16':
        return byteScratch.getInt16(0, true)
      case 'uint16':
        return byteScratch.getUint16(0, true)
      case 'int32':
        return byteScratch.getInt32(0, true)
      case 'uint32':
        return byteScratch.getUint32(0, true)
      case 'int64':
        return byteScratch.getBigInt64(0, true)
      case 'uint64':
        return byteScratch.getBigUint64(0, true)
      case 'float32':
        return byteScratch.getFloat32(0, true)
      case 'float64':
        return byteScratch.getFloat64(0, true)
      default:
        runtimePanic('unsupported unsafe byte scalar')
    }
  }
  // Allocate composite children only when a field or index first reads them.
  const cache = new Map<PropertyKey, unknown>()
  const child = (key: PropertyKey, at: number, shape: ByteLayout): unknown => {
    if (shape.kind === 'scalar') return readByteValue(bytes, at, shape)
    if (!cache.has(key)) cache.set(key, readByteValue(bytes, at, shape))
    return cache.get(key)
  }
  // Keep array elements and struct fields as accessors on the original bytes.
  let view: object
  if (layout.kind === 'array') {
    view = new Proxy(new Array(layout.length), {
      has(target, key) {
        const index =
          typeof key === 'string' && /^(0|[1-9][0-9]*)$/.test(key) ?
            Number(key)
          : -1
        return (index >= 0 && index < layout.length) || Reflect.has(target, key)
      },
      get(target, key, receiver) {
        const index =
          typeof key === 'string' && /^(0|[1-9][0-9]*)$/.test(key) ?
            Number(key)
          : -1
        if (index >= 0 && index < layout.length)
          return child(
            key,
            offset + index * layout.element.size,
            layout.element,
          )
        return Reflect.get(target, key, receiver)
      },
      set(target, key, value, receiver) {
        const index =
          typeof key === 'string' && /^(0|[1-9][0-9]*)$/.test(key) ?
            Number(key)
          : -1
        if (index >= 0 && index < layout.length) {
          writeByteValue(
            bytes,
            offset + index * layout.element.size,
            layout.element,
            value,
          )
          return true
        }
        return Reflect.set(target, key, value, receiver)
      },
    })
  } else {
    view = layout.create?.() ?? {}
    for (const field of layout.fields)
      Object.defineProperty(view, field.key, {
        enumerable: true,
        configurable: true,
        get: () => child(field.key, offset + field.offset, field.layout),
        set: (value) =>
          writeByteValue(bytes, offset + field.offset, field.layout, value),
      })
  }
  // Fields and elements retain their canonical backing byte addresses.
  byteViews.set(view, { bytes, offset, layout })
  markPointerAlias(indexRef(bytes, offset), view)
  return view
}

// writeByteValue stores fields and elements without changing shared storage.
function writeByteValue(
  bytes: any,
  offset: number,
  layout: ByteLayout,
  value: any,
): void {
  // Composite assignments copy their values into the same field storage.
  if (layout.kind === 'array') {
    for (let i = 0; i < layout.length; i++)
      writeByteValue(
        bytes,
        offset + i * layout.element.size,
        layout.element,
        arrayIndex(value, i),
      )
    return
  }
  if (layout.kind === 'struct') {
    for (const field of layout.fields)
      writeByteValue(
        bytes,
        offset + field.offset,
        field.layout,
        value[field.key],
      )
    return
  }
  // Encode a scalar without allocating a temporary buffer for every field.
  switch (layout.scalar) {
    case 'bool':
      byteScratch.setUint8(0, value ? 1 : 0)
      break
    case 'int8':
      byteScratch.setInt8(0, value)
      break
    case 'uint8':
      byteScratch.setUint8(0, value)
      break
    case 'int16':
      byteScratch.setInt16(0, value, true)
      break
    case 'uint16':
      byteScratch.setUint16(0, value, true)
      break
    case 'int32':
      byteScratch.setInt32(0, value, true)
      break
    case 'uint32':
      byteScratch.setUint32(0, value, true)
      break
    case 'int64':
      byteScratch.setBigInt64(0, value, true)
      break
    case 'uint64':
      byteScratch.setBigUint64(0, value, true)
      break
    case 'float32':
      byteScratch.setFloat32(0, value, true)
      break
    case 'float64':
      byteScratch.setFloat64(0, value, true)
      break
    default:
      runtimePanic('unsupported unsafe byte scalar')
  }
  // Commit its bytes through the existing shared element references.
  for (let i = 0; i < layout.size; i++)
    indexRef(bytes, offset + i).value = byteScratch.getUint8(i)
}

import { describe, expect, it } from 'vitest'

import {
  basicType,
  registerStructType,
  type MethodSignature,
  type StructFieldInfo,
  is,
  type MapTypeInfo,
  type SliceTypeInfo,
  typeAssert,
  TypeKind,
  typeSwitch,
} from './type.js'

// map[string]any
const mapStringAny: MapTypeInfo = {
  kind: TypeKind.Map,
  keyType: { kind: TypeKind.Basic, name: 'string' },
  elemType: { kind: TypeKind.Interface, methods: [] },
}

// []any
const sliceAny: SliceTypeInfo = {
  kind: TypeKind.Slice,
  elemType: { kind: TypeKind.Interface, methods: [] },
}

describe('a Go slice is never a map (structural type matching)', () => {
  it('is(): a plain array does not match map[string]any', () => {
    expect(is([1, 2, 3], mapStringAny)).toBe(false)
  })

  it('is(): a plain array matches []any', () => {
    expect(is([1, 2, 3], sliceAny)).toBe(true)
  })

  it('typeAssert(): a plain array fails a map[string]any assertion', () => {
    const { ok } = typeAssert([1, 2, 3], mapStringAny)
    expect(ok).toBe(false)
  })

  it('typeAssert(): a plain array succeeds a []any assertion', () => {
    const { ok, value } = typeAssert<number[]>([1, 2, 3], sliceAny)
    expect(ok).toBe(true)
    expect(value).toEqual([1, 2, 3])
  })

  it('a Uint8Array (the runtime byte-slice representation) does not match map[string]any', () => {
    const bytes = new Uint8Array([1, 2, 3])
    expect(is(bytes, mapStringAny)).toBe(false)
    expect(typeAssert(bytes, mapStringAny).ok).toBe(false)
  })

  it('typeSwitch(): an []any value takes the slice case, not an earlier map[string]any case', () => {
    // Mirrors a Go type switch that lists `case map[string]any:` before
    // `case []any:` — the ordering that exposed the bug, since the map
    // case is tried first and must correctly reject the array.
    const result = typeSwitch(
      [1, 2, 3],
      [
        { types: [mapStringAny], body: () => 'map' },
        { types: [sliceAny], body: () => 'slice' },
      ],
      () => 'default',
    )
    expect(result).toBe('slice')
  })

  it('an empty array (or Uint8Array) does not vacuously match an empty-map fast path', () => {
    // matchesMapType/typeAssert's map branch special-cases zero entries as
    // "matches any map type"; an empty slice/byte-slice must not hit that
    // path either — Object.entries() of an empty Uint8Array is also empty.
    expect(is([], mapStringAny)).toBe(false)
    expect(is([], sliceAny)).toBe(true)
    expect(is(new Uint8Array(0), mapStringAny)).toBe(false)
  })
})

describe('compact basic descriptors', () => {
  it('preserves named type identity without sharing mutable descriptors', () => {
    const first = basicType('uint64', 'main.Counter')
    const second = basicType('uint64', 'main.Counter')
    expect(first).toEqual({
      kind: TypeKind.Basic,
      name: 'uint64',
      typeName: 'main.Counter',
    })
    first.name = 'changed'
    expect(second.name).toBe('uint64')
    expect(basicType('string')).toEqual({
      kind: TypeKind.Basic,
      name: 'string',
    })
  })
})

describe('deferred struct metadata', () => {
  it('initializes fields and methods independently once when inspected', () => {
    let methodReads = 0
    let fieldReads = 0
    class Sample {}
    const methods: MethodSignature[] = [{ name: 'Read', args: [], returns: [] }]
    const fields: StructFieldInfo[] = [
      { name: 'Value', type: basicType('int') },
    ]
    const info = registerStructType(
      'test.DeferredSample',
      () => new Sample(),
      () => {
        methodReads++
        return methods
      },
      Sample,
      () => {
        fieldReads++
        return fields
      },
    )
    expect([methodReads, fieldReads]).toEqual([0, 0])
    expect(info.methods).toBe(methods)
    expect(info.methods).toBe(methods)
    expect([methodReads, fieldReads]).toEqual([1, 0])
    expect(info.fields).toBe(fields)
    expect(info.fields).toBe(fields)
    expect([methodReads, fieldReads]).toEqual([1, 1])
    info.fields = []
    expect(info.fields).toEqual([])
    expect(fieldReads).toBe(1)
  })
})

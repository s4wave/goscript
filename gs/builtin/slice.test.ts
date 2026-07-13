import { describe, expect, it } from 'vitest'

import { makeMap, mapGet, mapSet } from './map.js'
import {
  append,
  appendSlice,
  arrayToSlice,
  byteSliceHint,
  bytesToString,
  copy,
  indexString,
  len,
  makeSlice,
  runeToString,
  runesToString,
  sliceString,
  stringCompare,
  stringEqual,
  stringToBytes,
} from './slice.js'

describe('rune to string encoding (Go string(rune) semantics)', () => {
  it('preserves astral-plane runes above U+FFFF', () => {
    // U+1F600 grinning face; fromCharCode would have truncated to a broken unit.
    expect(runeToString(0x1f600)).toBe('😀')
    expect(runeToString(0x1f600).codePointAt(0)).toBe(0x1f600)
    // CJU+597D '好'
    expect(runeToString(0x597d)).toBe('好')
  })

  it('maps invalid and surrogate runes to U+FFFD, never throwing', () => {
    expect(runeToString(-1)).toBe('�')
    expect(runeToString(0x110000)).toBe('�')
    expect(runeToString(0xd800)).toBe('�')
  })

  it('encodes a rune slice with astral planes intact', () => {
    expect(runesToString([0x48, 0x69, 0x1f600] as never)).toBe('Hi😀')
    expect(runesToString([] as never)).toBe('')
  })
})

describe('destination-independent byte specialization', () => {
  it('byte-specializes appendSlice onto a nil []byte via the hint', () => {
    const src = new Uint8Array([10, 20, 30])
    const out = appendSlice(null, src, byteSliceHint)
    expect(out).toBeInstanceOf(Uint8Array)
    expect(Array.from(out as Uint8Array)).toEqual([10, 20, 30])
  })

  it('byte-specializes a Slice<number> source appended onto nil', () => {
    const src = arrayToSlice<number>([1, 2, 3])
    const out = appendSlice(null, src, byteSliceHint)
    expect(out).toBeInstanceOf(Uint8Array)
    expect(Array.from(out as Uint8Array)).toEqual([1, 2, 3])
  })

  it('byte-specializes the dAtA[i:j] sub-slice idiom onto nil', () => {
    const dAtA = new Uint8Array([10, 20, 30, 40, 50])
    const out = appendSlice(null, dAtA.subarray(1, 4), byteSliceHint)
    expect(out).toBeInstanceOf(Uint8Array)
    expect(Array.from(out as Uint8Array)).toEqual([20, 30, 40])
  })

  it('byte-specializes the variadic append form onto nil', () => {
    const out = append(null, 65, 66, 67, byteSliceHint)
    expect(out).toBeInstanceOf(Uint8Array)
    expect(Array.from(out as Uint8Array)).toEqual([65, 66, 67])
  })

  it('reallocates an empty generic array destination into a Uint8Array', () => {
    const out = append([] as number[], 7, 8, byteSliceHint)
    expect(out).toBeInstanceOf(Uint8Array)
    expect(Array.from(out as Uint8Array)).toEqual([7, 8])
  })

  it('keeps a pre-made byte buffer specialized across [:0] reuse', () => {
    const buf = makeSlice<number>(0, 2, 'byte')
    const out = appendSlice(buf, new Uint8Array([1, 2, 3, 4]), byteSliceHint)
    expect(out).toBeInstanceOf(Uint8Array)
    expect(Array.from(out as Uint8Array)).toEqual([1, 2, 3, 4])
  })

  it('preserves spare generic byte backing across appendSlice', () => {
    const dst = makeSlice<number>(0, 64)
    const alias = append(dst, 0, 0, 0)
    const out = appendSlice(dst, new Uint8Array([11, 22, 33]), byteSliceHint)

    expect(Array.from(out as number[])).toEqual([11, 22, 33])
    expect(Array.from(alias as number[])).toEqual([11, 22, 33])
  })

  it('leaves non-byte appends generic and hint-free', () => {
    const out = append([] as string[], 'a', 'b')
    expect(out).not.toBeInstanceOf(Uint8Array)
    expect(Array.from(out as string[])).toEqual(['a', 'b'])
  })
})

describe('builtin string byte representation', () => {
  it('appends large byte slices without JavaScript argument spreading', () => {
    const dst = new Uint8Array(0)
    const src = new Uint8Array(200_000)
    src[0] = 7
    src[src.length - 1] = 9

    const out = appendSlice(dst, src)

    expect(out.length).toBe(src.length)
    expect(out[0]).toBe(7)
    expect(out[out.length - 1]).toBe(9)
  })

  it('round-trips non-UTF-8 byte strings without external provenance', () => {
    const original = new Uint8Array([0, 255, 128, 65, 66])
    const str = bytesToString(original)

    expect(Array.from(stringToBytes(str))).toEqual(Array.from(original))
    expect(len(str)).toBe(original.length)
    expect(indexString(str, 1)).toBe(255)
    expect(Array.from(stringToBytes(sliceString(str, 1, 4)))).toEqual([
      255, 128, 65,
    ])
  })

  it('copies UTF-8 strings by bytes', () => {
    const dst = new Uint8Array(3)

    expect(copy(dst, '你')).toBe(3)
    expect(Array.from(dst)).toEqual([0xe4, 0xbd, 0xa0])
  })

  it('compares byte-backed string aliases by bytes', () => {
    const peerID = new Uint8Array([0, 255, 65])

    expect(stringEqual(peerID, bytesToString(peerID))).toBe(true)
    expect(stringEqual(peerID, '')).toBe(false)
    expect(stringEqual(new Uint8Array(0), '')).toBe(true)
  })

  it('matches byte-backed strings as map keys', () => {
    const raw = new Uint8Array([10, 36, 8, 1, 18, 32, 222, 187])
    const key = bytesToString(raw)
    const m = makeMap<string, string>()

    mapSet(m, key, 'cached')

    expect(mapGet(m, bytesToString(raw), '')).toEqual(['cached', true])
  })

  it('orders byte-backed strings by Go string bytes', () => {
    expect(
      stringCompare(new Uint8Array([0, 255]), new Uint8Array([1])),
    ).toBeLessThan(0)
    expect(
      stringCompare(new Uint8Array([1]), new Uint8Array([0, 255])),
    ).toBeGreaterThan(0)
    expect(
      stringCompare(new Uint8Array([1, 2]), new Uint8Array([1, 2, 0])),
    ).toBeLessThan(0)
    expect(
      stringCompare(
        bytesToString(new Uint8Array([255])),
        new Uint8Array([255]),
      ),
    ).toBe(0)
  })
})

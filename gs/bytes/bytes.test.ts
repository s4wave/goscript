import { describe, expect, test } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { Clone, Count, Equal, IndexFunc, Replace } from './index.js'

const rep = (s: string, old: string, n: string, count: number): string =>
  $.bytesToString(
    Replace(
      $.stringToBytes(s),
      $.stringToBytes(old),
      $.stringToBytes(n),
      count,
    ),
  )

const byteArray = (value: $.Bytes): number[] =>
  value === null ? [] : Array.from($.normalizeBytes(value))

const runeWidth = (input: number[], offset: number): number => {
  const b0 = input[offset]
  if (b0 < 0x80) return 1
  const width =
    b0 >= 0xc2 && b0 <= 0xdf ? 2
    : b0 >= 0xe0 && b0 <= 0xef ? 3
    : b0 >= 0xf0 && b0 <= 0xf4 ? 4
    : 1
  if (width === 1 || offset + width > input.length) return 1
  const lower =
    b0 === 0xe0 ? 0xa0
    : b0 === 0xf0 ? 0x90
    : 0x80
  const upper =
    b0 === 0xed ? 0x9f
    : b0 === 0xf4 ? 0x8f
    : 0xbf
  if (input[offset + 1] < lower || input[offset + 1] > upper) return 1
  for (let i = 2; i < width; i++) {
    if (input[offset + i] < 0x80 || input[offset + i] > 0xbf) return 1
  }
  return width
}

const countReference = (source: number[], old: number[]): number => {
  if (old.length === 0) {
    let count = 1
    for (let i = 0; i < source.length; count++) i += runeWidth(source, i)
    return count
  }
  let count = 0
  for (let i = 0; i <= source.length - old.length; ) {
    const matches = old.every((value, offset) => source[i + offset] === value)
    if (matches) {
      count++
      i += old.length
    } else {
      i++
    }
  }
  return count
}

const replaceReference = (
  sourceBytes: $.Bytes,
  oldBytes: $.Bytes,
  newBytes: $.Bytes,
  n: number,
): $.Bytes => {
  const source = byteArray(sourceBytes)
  const old = byteArray(oldBytes)
  const replacement = byteArray(newBytes)
  let count = n === 0 ? 0 : countReference(source, old)
  if (count === 0) return source.length === 0 ? null : new Uint8Array(source)
  if (n >= 0) count = Math.min(count, n)

  const output: number[] = []
  let start = 0
  if (old.length === 0) {
    output.push(...replacement)
    for (let replaced = 1; replaced < count; replaced++) {
      const width = runeWidth(source, start)
      output.push(...source.slice(start, start + width), ...replacement)
      start += width
    }
  } else {
    for (let replaced = 0; replaced < count; replaced++) {
      let offset = 0
      while (
        !old.every((value, index) => source[start + offset + index] === value)
      ) {
        offset++
      }
      output.push(...source.slice(start, start + offset), ...replacement)
      start += offset + old.length
    }
  }
  output.push(...source.slice(start))
  return new Uint8Array(output)
}

describe('bytes', () => {
  test.each([
    ['nil', null, 1],
    ['empty', new Uint8Array(), 1],
    ['ASCII', new Uint8Array([0x61, 0x62]), 3],
    ['valid UTF-8', new Uint8Array([0xc3, 0xa9]), 2],
    ['encoded RuneError', new Uint8Array([0xef, 0xbf, 0xbd]), 2],
    ['malformed prefix', new Uint8Array([0xe2, 0x28]), 3],
    ['isolated continuation', new Uint8Array([0x80]), 2],
  ])(
    'Count matches Go at empty-pattern boundaries for %s',
    (_, input, count) => {
      expect(Count(input, null)).toBe(count)
      expect(Count(input, new Uint8Array())).toBe(count)
    },
  )

  test.each([
    ['nil/unbounded', null, -1, [0x2d]],
    ['nil/zero', null, 0, null],
    ['nil/bounded', null, 99, [0x2d]],
    ['empty/unbounded', [], -1, [0x2d]],
    ['empty/zero', [], 0, null],
    ['ASCII/unbounded', [0x61, 0x62], -1, [0x2d, 0x61, 0x2d, 0x62, 0x2d]],
    ['ASCII/one', [0x61, 0x62], 1, [0x2d, 0x61, 0x62]],
    ['ASCII/two', [0x61, 0x62], 2, [0x2d, 0x61, 0x2d, 0x62]],
    ['valid UTF-8/unbounded', [0xc3, 0xa9], -1, [0x2d, 0xc3, 0xa9, 0x2d]],
    ['valid UTF-8/one', [0xc3, 0xa9], 1, [0x2d, 0xc3, 0xa9]],
    [
      'RuneError/unbounded',
      [0xef, 0xbf, 0xbd],
      -1,
      [0x2d, 0xef, 0xbf, 0xbd, 0x2d],
    ],
    ['RuneError/one', [0xef, 0xbf, 0xbd], 1, [0x2d, 0xef, 0xbf, 0xbd]],
    ['malformed/unbounded', [0xe2, 0x28], -1, [0x2d, 0xe2, 0x2d, 0x28, 0x2d]],
    ['malformed/one', [0xe2, 0x28], 1, [0x2d, 0xe2, 0x28]],
    ['malformed/two', [0xe2, 0x28], 2, [0x2d, 0xe2, 0x2d, 0x28]],
    ['continuation/unbounded', [0x80], -1, [0x2d, 0x80, 0x2d]],
    ['continuation/large bound', [0x80], 99, [0x2d, 0x80, 0x2d]],
  ])('Replace matches Go for %s', (_, source, n, expected) => {
    const input = source === null ? null : new Uint8Array(source)
    const result = Replace(input, null, new Uint8Array([0x2d]), n)
    expect(result === null ? null : Array.from(result)).toEqual(expected)
  })

  test('Replace with an empty pattern and replacement preserves bytes without NULs', () => {
    expect(
      Array.from(Replace(new Uint8Array([0xe2, 0x28]), null, null, -1)!),
    ).toEqual([0xe2, 0x28])
    expect(Replace(null, null, null, -1)).not.toBeNull()
    expect($.len(Replace(null, null, null, -1))).toBe(0)
  })

  test('Replace still handles non-empty patterns', () => {
    expect(rep('aaa', 'a', 'b', -1)).toBe('bbb')
  })

  test('Count and Replace match Go across deterministic random byte matrices', () => {
    let state = 0x9e3779b9
    const random = (): number => {
      state ^= state << 13
      state ^= state >>> 17
      state ^= state << 5
      return state >>> 0
    }
    const randomBytes = (maximum: number): Uint8Array => {
      const result = new Uint8Array(random() % (maximum + 1))
      for (let i = 0; i < result.length; i++) result[i] = random() & 0xff
      return result
    }

    for (let sample = 0; sample < 4096; sample++) {
      const source = random() % 17 === 0 ? null : randomBytes(20)
      const old = random() % 5 === 0 ? null : randomBytes(5)
      const replacement = random() % 7 === 0 ? null : randomBytes(5)
      const n = (random() % 9) - 2
      const sourceArray = byteArray(source)
      const oldArray = byteArray(old)

      expect(Count(source, old)).toBe(countReference(sourceArray, oldArray))
      const actual = Replace(source, old, replacement, n)
      const expected = replaceReference(source, old, replacement, n)
      expect(actual === null).toBe(expected === null)
      expect(byteArray(actual)).toEqual(byteArray(expected))
    }
  })

  test('Equal treats nil and empty byte slices as equivalent', () => {
    expect(Equal(null, new Uint8Array(0))).toBe(true)
    expect(Equal(new Uint8Array(0), null)).toBe(true)
  })

  test('Clone preserves nil and gives non-nil bytes independent storage', () => {
    expect(Clone(null)).toBeNull()

    const empty = Clone(new Uint8Array(0))
    expect(empty).not.toBeNull()
    expect($.len(empty)).toBe(0)

    const source = $.stringToBytes('abc')
    const cloned = Clone(source)
    if (cloned === null) {
      throw new Error('Clone returned nil for non-nil input')
    }

    expect($.bytesToString(cloned)).toBe('abc')

    source[0] = 0x7a
    expect($.bytesToString(source)).toBe('zbc')
    expect($.bytesToString(cloned)).toBe('abc')

    cloned[1] = 0x79
    expect($.bytesToString(cloned)).toBe('ayc')
    expect($.bytesToString(source)).toBe('zbc')
  })

  test('IndexFunc accepts generated async-shaped callbacks', () => {
    const predicate: (r: number) => boolean | Promise<boolean> = (r) =>
      r === 0x62

    expect(IndexFunc($.stringToBytes('abc'), predicate)).toBe(1)
  })

  test('IndexFunc rejects actual async callback results', () => {
    expect(() =>
      IndexFunc($.stringToBytes('abc'), async (r) => r === 0x62),
    ).toThrow('bytes: asynchronous callback result is not supported')
  })
})

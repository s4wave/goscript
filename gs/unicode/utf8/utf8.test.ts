import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { DecodeLastRune, DecodeRune, FullRune, RuneError } from './utf8.js'

const bytes = (...values: number[]): Uint8Array => new Uint8Array(values)

const decodeReference = (input: Uint8Array): [number, number] => {
  if (input.length === 0) return [RuneError, 0]
  const b0 = input[0]
  if (b0 < 0x80) return [b0, 1]

  const sequences: ReadonlyArray<readonly [number, number, number, number]> = [
    [0xc2, 0xdf, 2, 0x80],
    [0xe0, 0xef, 3, 0x800],
    [0xf0, 0xf4, 4, 0x10000],
  ]
  for (const [first, last, width, minimum] of sequences) {
    if (b0 < first || b0 > last || input.length < width) continue
    let rune = b0 & (0x7f >> width)
    let valid = true
    for (let i = 1; i < width; i++) {
      if ((input[i] & 0xc0) !== 0x80) valid = false
      rune = (rune << 6) | (input[i] & 0x3f)
    }
    if (
      valid &&
      rune >= minimum &&
      rune <= 0x10ffff &&
      !(rune >= 0xd800 && rune <= 0xdfff)
    ) {
      return [rune, width]
    }
  }
  return [RuneError, 1]
}

const fullReference = (input: Uint8Array): boolean => {
  if (input.length === 0) return false
  const b0 = input[0]
  let width =
    b0 < 0x80 || b0 < 0xc2 || b0 > 0xf4 ? 1
    : b0 < 0xe0 ? 2
    : b0 < 0xf0 ? 3
    : 4
  if (input.length >= width) return true

  const lower =
    b0 === 0xe0 ? 0xa0
    : b0 === 0xf0 ? 0x90
    : 0x80
  const upper =
    b0 === 0xed ? 0x9f
    : b0 === 0xf4 ? 0x8f
    : 0xbf
  if (input.length > 1 && (input[1] < lower || input[1] > upper)) return true
  if (input.length > 2 && (input[2] < 0x80 || input[2] > 0xbf)) return true
  return false
}

const decodeLastReference = (input: Uint8Array): [number, number] => {
  if (input.length === 0) return [RuneError, 0]
  const limit = Math.max(0, input.length - 4)
  let start = input.length - 1
  while (start > limit && (input[start] & 0xc0) === 0x80) start--
  const decoded = decodeReference(input.slice(start))
  return start + decoded[1] === input.length ? decoded : [RuneError, 1]
}

describe('unicode/utf8 overrides', () => {
  it.each([
    [[], RuneError, 0, false, RuneError, 0],
    [[0x61], 0x61, 1, true, 0x61, 1],
    [[0x80], RuneError, 1, true, RuneError, 1],
    [[0xc0], RuneError, 1, true, RuneError, 1],
    [[0xc2], RuneError, 1, false, RuneError, 1],
    [[0xc2, 0x20], RuneError, 1, true, 0x20, 1],
    [[0xc2, 0x80], 0x80, 2, true, 0x80, 2],
    [[0xe0, 0x80], RuneError, 1, true, RuneError, 1],
    [[0xe0, 0xa0], RuneError, 1, false, RuneError, 1],
    [[0xe0, 0xa0, 0x80], 0x800, 3, true, 0x800, 3],
    [[0xe2, 0x28, 0xa1], RuneError, 1, true, RuneError, 1],
    [[0xed, 0xa0], RuneError, 1, true, RuneError, 1],
    [[0xef, 0xbf, 0xbd], RuneError, 3, true, RuneError, 3],
    [[0xf0, 0x8f], RuneError, 1, true, RuneError, 1],
    [[0xf0, 0x90, 0x80], RuneError, 1, false, RuneError, 1],
    [[0xf0, 0x90, 0x80, 0x80], 0x10000, 4, true, 0x10000, 4],
    [[0xf4, 0x8f, 0xbf, 0xbf], 0x10ffff, 4, true, 0x10ffff, 4],
    [[0xf4, 0x90], RuneError, 1, true, RuneError, 1],
    [[0xf5], RuneError, 1, true, RuneError, 1],
  ] as const)(
    'matches Go for bytes %j',
    (input, rune, width, full, lastRune, lastWidth) => {
      const value = bytes(...input)
      expect(DecodeRune(value)).toEqual([rune, width])
      expect(FullRune(value)).toBe(full)
      expect(DecodeLastRune(value)).toEqual([lastRune, lastWidth])
    },
  )

  it('matches Go for every one and two byte input', () => {
    for (let b0 = 0; b0 <= 0xff; b0++) {
      const one = bytes(b0)
      expect(DecodeRune(one)).toEqual(decodeReference(one))
      expect(FullRune(one)).toBe(fullReference(one))
      expect(DecodeLastRune(one)).toEqual(decodeLastReference(one))

      for (let b1 = 0; b1 <= 0xff; b1++) {
        const two = bytes(b0, b1)
        expect(DecodeRune(two)).toEqual(decodeReference(two))
        expect(FullRune(two)).toBe(fullReference(two))
        expect(DecodeLastRune(two)).toEqual(decodeLastReference(two))
      }
    }
  })

  it('matches Go across deterministic random byte sequences', () => {
    let state = 0x6d2b79f5
    const random = (): number => {
      state ^= state << 13
      state ^= state >>> 17
      state ^= state << 5
      return state >>> 0
    }

    for (let sample = 0; sample < 4096; sample++) {
      const input = new Uint8Array(random() % 13)
      for (let i = 0; i < input.length; i++) input[i] = random() & 0xff
      expect(DecodeRune(input)).toEqual(decodeReference(input))
      expect(FullRune(input)).toBe(fullReference(input))
      expect(DecodeLastRune(input)).toEqual(decodeLastReference(input))
    }
  })

  it('accepts GoScript byte slices', () => {
    expect(FullRune($.arrayToSlice<number>([0x61]))).toBe(true)
    expect(FullRune($.goSlice([0xe2, 0x82, 0xac], 0, 2))).toBe(false)
    expect(FullRune($.goSlice([0xe2, 0x82, 0xac], 0, 3))).toBe(true)
  })
})

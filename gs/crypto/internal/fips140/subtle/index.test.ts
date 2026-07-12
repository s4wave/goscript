import { describe, expect, test } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  ConstantTimeCompare,
  ConstantTimeCopy,
  ConstantTimeLessOrEqBytes,
  XORBytes,
} from './index.js'

describe('crypto/internal/fips140/subtle override', () => {
  test('preserves constant-time helper behavior', () => {
    expect(
      ConstantTimeCompare(new Uint8Array([1, 2]), new Uint8Array([1, 2])),
    ).toBe(1)
    expect(
      ConstantTimeCompare(new Uint8Array([1, 2]), new Uint8Array([1, 3])),
    ).toBe(0)
    expect(
      ConstantTimeCompare(new Uint8Array([1]), new Uint8Array([1, 0])),
    ).toBe(0)

    expect(
      ConstantTimeLessOrEqBytes(new Uint8Array([1, 2]), new Uint8Array([1, 2])),
    ).toBe(1)
    expect(
      ConstantTimeLessOrEqBytes(new Uint8Array([1, 2]), new Uint8Array([1, 3])),
    ).toBe(1)
    expect(
      ConstantTimeLessOrEqBytes(
        new Uint8Array([2, 0]),
        new Uint8Array([1, 255]),
      ),
    ).toBe(0)
    expect(
      ConstantTimeLessOrEqBytes(new Uint8Array([1]), new Uint8Array([1, 0])),
    ).toBe(0)

    const kept = new Uint8Array([1, 2])
    ConstantTimeCopy(0, kept, new Uint8Array([3, 4]))
    expect(kept).toEqual(new Uint8Array([1, 2]))
    ConstantTimeCopy(1, kept, new Uint8Array([3, 4]))
    expect(kept).toEqual(new Uint8Array([3, 4]))
    expect(() => ConstantTimeCopy(1, kept, new Uint8Array([3]))).toThrow()
  })

  test('XORs through indexed byte slices', () => {
    const dst = new Uint8Array(4)
    expect(
      XORBytes(
        dst,
        new Uint8Array([0x0f, 0xf0, 0x55, 0xaa]),
        new Uint8Array([0x33, 0x0f, 0xaa, 0x55]),
      ),
    ).toBe(4)
    expect(dst).toEqual(new Uint8Array([0x3c, 0xff, 0xff, 0xff]))

    const unequal = new Uint8Array([99, 99, 99, 99])
    expect(
      XORBytes(unequal, new Uint8Array([1, 2, 3, 4]), new Uint8Array([4, 6])),
    ).toBe(2)
    expect(unequal).toEqual(new Uint8Array([5, 4, 99, 99]))
  })

  test('panics before writing a short destination', () => {
    const dst = new Uint8Array([7])
    expect(() =>
      XORBytes(dst, new Uint8Array([1, 2]), new Uint8Array([3, 4])),
    ).toThrow()
    expect(dst).toEqual(new Uint8Array([7]))
  })

  test('allows exact overlap', () => {
    const dst = new Uint8Array([1, 2, 3, 4])
    expect(XORBytes(dst, dst, new Uint8Array([4, 3, 2, 1]))).toBe(4)
    expect(dst).toEqual(new Uint8Array([5, 1, 1, 5]))
  })

  test('rejects inexact overlap before writing', () => {
    const bytes = new Uint8Array([1, 2, 3, 4])
    const dst = $.goSlice(bytes, 1, 4)
    const x = $.goSlice(bytes, 0, 3)
    expect(() => XORBytes(dst, x, new Uint8Array([4, 5, 6]))).toThrow()
    expect(bytes).toEqual(new Uint8Array([1, 2, 3, 4]))
  })
})

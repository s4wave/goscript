import { describe, expect, it } from 'vitest'

import { uint, uint64, uint64Add, uint64Shr } from './builtin.js'
import type { StringHeaderData } from './slice.js'

// Go represents uint/uintptr as a TypeScript number until full-width values no
// longer round-trip through JS number. uint() returns bigint in that overflow
// range so Go semantics such as ^uint(0) == 2^64-1 survive. int64/uint64 stay
// bigint unconditionally.
describe('uint full 64-bit width (Go uint semantics)', () => {
  const maxUint = 18446744073709551615n // ^uint(0)

  it('preserves ^uint(0) without precision loss', () => {
    const v = uint(maxUint, 64)
    expect(v).toBe(maxUint)
  })

  it('keeps small uint values as plain numbers', () => {
    expect(uint(5n, 64)).toBe(5)
    expect(typeof uint(5n, 64)).toBe('number')
    expect(typeof uint(maxUint, 64)).toBe('bigint')
  })

  it('right-shifting ^uint(0) yields a 64-bit-wide result, not 0 or 1', () => {
    // uintBitLen-style loop: repeated >>1 from 2^64-1 must count 64 bits.
    let n: number | bigint = uint(maxUint, 64)
    let bits = 0
    while ((n as bigint) !== 0n && (n as number) !== 0) {
      bits++
      n = uint(uint64Shr(n, 1), 64)
    }
    expect(bits).toBe(64)
  })

  it('uint64 modular wraparound preserves full width', () => {
    // (2^64-1) + 1 wraps to 0 under uint64.
    expect(uint64Add(maxUint, 1n)).toBe(0n)
    // uint64 always yields bigint regardless of magnitude.
    expect(uint64(7)).toBe(7n)
    expect(typeof uint64(7)).toBe('bigint')
  })
})

describe('uint conversion widths', () => {
  it.each([8, 16, 32])('wraps finite numbers at %i bits', (bits) => {
    for (const value of [
      0,
      -0,
      1.75,
      -1.75,
      255,
      256,
      65535,
      65536,
      2 ** 31,
      2 ** 32,
      -(2 ** 32),
      Number.MAX_SAFE_INTEGER,
      2 ** 80,
    ]) {
      const expected = Number(BigInt.asUintN(bits, BigInt(Math.trunc(value))))
      expect(uint(value, bits)).toBe(expected)
    }
  })

  it('preserves uncommon widths, encoded integers, and non-finite values', () => {
    expect(uint(-1, 7)).toBe(127)
    expect(uint(-1n, 16)).toBe(65535)
    expect(uint('4294967296', 32)).toBe(0)
    expect(uint('18446744073709551615')).toBe(18446744073709551615n)
    expect(() => uint('invalid', 8)).toThrow(SyntaxError)
    for (const bits of [8, 16, 32, 64]) {
      expect(uint(NaN, bits)).toBeNaN()
      expect(uint(Infinity, bits)).toBe(Infinity)
      expect(uint(-Infinity, bits)).toBe(-Infinity)
    }
  })

  it('preserves string-header identity', () => {
    const header: StringHeaderData = { kind: 'string', value: 'abc' }
    expect(uint(header, 32)).toBe(header)
  })
})

import { describe, expect, it } from 'vitest'

import {
  int64,
  int64Add,
  int64And,
  int64AndNot,
  int64Div,
  int64Mod,
  int64Mul,
  int64Or,
  int64Shl,
  int64Shr,
  int64Sub,
  int64Xor,
  intFromWide,
  uint,
  uint64,
  uint64Add,
  uint64And,
  uint64AndNot,
  uint64Div,
  uint64Mod,
  uint64Mul,
  uint64Or,
  uint64Shl,
  uint64Shr,
  uint64Sub,
  uint64Xor,
  uintFromWide,
} from './builtin.js'
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

  it('preserves uncommon widths and encoded integers, and zeroes non-finite values', () => {
    expect(uint(-1, 7)).toBe(127)
    expect(uint(-1n, 16)).toBe(65535)
    expect(uint('4294967296', 32)).toBe(0)
    expect(uint('18446744073709551615')).toBe(18446744073709551615n)
    expect(() => uint('invalid', 8)).toThrow(SyntaxError)
    // NaN and the infinities have no integer value; they convert to 0, as
    // with Go on arm64 and wasm, so the result is a valid integer.
    for (const bits of [8, 16, 32, 64]) {
      expect(uint(NaN, bits)).toBe(0)
      expect(uint(Infinity, bits)).toBe(0)
      expect(uint(-Infinity, bits)).toBe(0)
    }
  })

  it('preserves string-header identity', () => {
    const header: StringHeaderData = { kind: 'string', value: 'abc' }
    expect(uint(header, 32)).toBe(header)
  })
})

describe('64-bit bitwise operations', () => {
  const big = 2n ** 64n
  const values = [0n, 1n, -1n, 5n, -0x8000000000000000n, 0x7fffffffffffffffn]

  it('match the operations of the 64-bit values of their operands', () => {
    // Out-of-range bigints and numbers act as their 64 bits.
    for (const a of values) {
      for (const b of values) {
        expect(int64And(a + big, b - big)).toBe(BigInt.asIntN(64, a & b))
        expect(int64Or(a, b)).toBe(BigInt.asIntN(64, a | b))
        expect(int64Xor(a, b + big)).toBe(BigInt.asIntN(64, a ^ b))
        expect(int64AndNot(a, b)).toBe(BigInt.asIntN(64, a & ~b))
        expect(uint64And(a, b)).toBe(BigInt.asUintN(64, a & b))
        expect(uint64Or(a - big, b)).toBe(BigInt.asUintN(64, a | b))
        expect(uint64Xor(a, b)).toBe(BigInt.asUintN(64, a ^ b))
        expect(uint64AndNot(a, b)).toBe(BigInt.asUintN(64, a & ~b))
      }
    }
    expect(int64And(6, 3n)).toBe(2n)
    expect(uint64Or(4, 1)).toBe(5n)
  })

  it('shift by every count', () => {
    // Counts past 63 shift every bit out.
    for (let count = 0; count < 70; count++) {
      expect(int64Shl(1n, count)).toBe(BigInt.asIntN(64, 1n << BigInt(count)))
      expect(uint64Shl(3n, count)).toBe(BigInt.asUintN(64, 3n << BigInt(count)))
      expect(int64Shr(-0x8000000000000000n, count)).toBe(
        -0x8000000000000000n >> BigInt(count),
      )
    }
    expect(int64Shl(1n, 2n)).toBe(4n)
    expect(int64Shl(1n, 2.0)).toBe(4n)
  })

  it('convert 32-bit bigints to numbers', () => {
    expect(uint(5n, 32)).toBe(5)
    expect(uint(0xffffffffn, 32)).toBe(0xffffffff)
    expect(uint(-1n, 32)).toBe(0xffffffff)
    expect(uint(0x100000001n, 32)).toBe(1)
  })
})

describe('64-bit arithmetic', () => {
  const big = 2n ** 64n
  const values = [
    0n,
    1n,
    -1n,
    7n,
    -3n,
    -0x8000000000000000n,
    0x7fffffffffffffffn,
  ]

  it('matches the operations of the 64-bit values of their operands', () => {
    // Out-of-range bigints act as their 64 bits.
    for (const a of values) {
      for (const b of values) {
        const sa = BigInt.asIntN(64, a)
        const ua = BigInt.asUintN(64, a)
        expect(int64Add(a + big, b)).toBe(BigInt.asIntN(64, a + b))
        expect(int64Sub(a, b - big)).toBe(BigInt.asIntN(64, a - b))
        expect(int64Mul(a, b + big)).toBe(BigInt.asIntN(64, a * b))
        expect(uint64Add(a, b)).toBe(BigInt.asUintN(64, a + b))
        expect(uint64Sub(a - big, b)).toBe(BigInt.asUintN(64, a - b))
        expect(uint64Mul(a, b)).toBe(BigInt.asUintN(64, a * b))
        if (b === 0n) {
          continue
        }
        const sb = BigInt.asIntN(64, b)
        const ub = BigInt.asUintN(64, b)
        expect(int64Div(ua, b + big)).toBe(BigInt.asIntN(64, sa / sb))
        expect(int64Mod(ua, b)).toBe(sa % sb)
        expect(uint64Div(a, b - big)).toBe(ua / ub)
        expect(uint64Mod(a, b)).toBe(ua % ub)
      }
    }
    expect(int64Add(6, 3n)).toBe(9n)
    expect(uint64Mul(4, 5)).toBe(20n)
  })

  it('panics when dividing by zero', () => {
    // A divisor whose 64 bits are zero divides by zero.
    expect(() => int64Div(5n, 0n)).toThrow('integer divide by zero')
    expect(() => int64Mod(5n, big)).toThrow('integer divide by zero')
    expect(() => uint64Div(5n, 0n)).toThrow('integer divide by zero')
    expect(() => uint64Mod(5n, -big)).toThrow('integer divide by zero')
  })

  it('shifts the 64 bits of out-of-range operands', () => {
    // Right shifts see the 64 bits, and huge counts shift every bit out.
    expect(int64Shr(0xffffffffffffffffn, 4n)).toBe(-1n)
    expect(uint64Shr(-1n, 60n)).toBe(15n)
    expect(uint64Shr(-1n, 60)).toBe(15n)
    expect(int64Shl(1n, 2n ** 40n)).toBe(0n)
    expect(uint64Shl(1n, 64n)).toBe(0n)
    expect(int64Shr(-5n, 1000n)).toBe(-1n)
  })
})

describe('64-bit conversions', () => {
  it('convert numbers to their 64 bits', () => {
    // Numbers truncate toward zero, and unsafe numbers wrap.
    expect(int64(-1)).toBe(-1n)
    expect(int64(-0)).toBe(0n)
    expect(int64(2.75)).toBe(2n)
    expect(int64(-2.75)).toBe(-2n)
    expect(int64(-4294967296)).toBe(-4294967296n)
    expect(int64(9007199254740991)).toBe(9007199254740991n)
    expect(int64(-9007199254740991)).toBe(-9007199254740991n)
    expect(int64(2 ** 63)).toBe(-0x8000000000000000n)
    expect(uint64(-0.5)).toBe(0n)
    expect(uint64(4294967295.5)).toBe(4294967295n)
    expect(uint64(-1)).toBe(0xffffffffffffffffn)
  })

  it('narrow bigints to their low bits', () => {
    // A narrow conversion keeps the low bits of the 64 bits.
    const v = 0x123456789abcdef0n
    expect(intFromWide(v, 32)).toBe(-1698898192)
    expect(uintFromWide(v, 32)).toBe(0x9abcdef0)
    expect(intFromWide(v, 16)).toBe(-8464)
    expect(uintFromWide(v, 16)).toBe(0xdef0)
    expect(intFromWide(v, 8)).toBe(-16)
    expect(uintFromWide(v, 8)).toBe(0xf0)
    expect(uintFromWide(-1n, 32)).toBe(0xffffffff)
    expect(intFromWide(2n ** 64n + 5n, 32)).toBe(5)
    expect(uintFromWide(-7, 32)).toBe(0xfffffff9)
  })
})

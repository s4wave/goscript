// Generated file based on nat.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import "@goscript/crypto/internal/fips140/check/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as errors from "@goscript/errors/index.js"

import * as bits from "@goscript/math/bits/index.js"

import * as __goscript_nat_wasm from "./nat_wasm.gs.ts"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/errors/index.js"
import "@goscript/math/bits/index.js"
import "./nat_wasm.gs.ts"

export type choice = number

export class Nat {
	// limbs is little-endian in base 2^W with W = bits.UintSize.
	public get limbs(): $.Slice<number> {
		return this._fields.limbs.value
	}
	public set limbs(value: $.Slice<number>) {
		this._fields.limbs.value = value
	}

	public _fields: {
		limbs: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{limbs?: $.Slice<number>}>) {
		this._fields = {
			limbs: $.varRef(init?.limbs ?? (null as $.Slice<number>))
		}
	}

	public clone(): Nat {
		const cloned = new Nat()
		cloned._fields = {
			limbs: $.varRef(this._fields.limbs.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Add(y: Nat | $.VarRef<Nat> | null, m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		let overflow = Nat.prototype.add.call(x, y)
		Nat.prototype.maybeSubtractModulus.call(x, $.uint(overflow, 64), m)
		return x
	}

	public BitLenVarTime(): number {
		const x: Nat | $.VarRef<Nat> | null = this
		// Eliminate bounds checks in the loop.
		let size = $.len($.pointerValue<Nat>(x).limbs)
		let xLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, size)

		for (let i = size - 1; i >= 0; i--) {
			if ($.arrayIndex(xLimbs!, i) != 0) {
				return (i * 64) + bitLen($.arrayIndex(xLimbs!, i))
			}
		}
		return 0
	}

	public Bits(): $.Slice<number> {
		const x: Nat | $.VarRef<Nat> | null = this
		return $.pointerValue<Nat>(x).limbs
	}

	public Bytes(m: Modulus | $.VarRef<Modulus> | null): $.Slice<number> {
		const x: Nat | $.VarRef<Nat> | null = this
		let i = Modulus.prototype.Size.call(m)
		let bytes: $.Slice<number> = $.makeSlice<number>(i, undefined, "byte")
		for (let __goscriptRangeTarget0 = $.pointerValue<Nat>(x).limbs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let limb = __goscriptRangeTarget0![__rangeIndex]
			for (let j = 0; j < 8; j++) {
				i--
				if (i < 0) {
					if (limb == 0) {
						break
					}
					$.panic("bigmod: modulus is smaller than nat")
				}
				bytes![i] = $.uint($.uint(limb, 8), 8)
				limb = $.uint($.uint64Shr(limb, 8), 64)
			}
		}
		return bytes
	}

	public DivShortVarTime(y: number): number {
		let x: Nat | $.VarRef<Nat> | null = this
		if (y == 0) {
			$.panic("bigmod: division by zero")
		}

		let r: number = 0
		for (let i = $.len($.pointerValue<Nat>(x).limbs) - 1; i >= 0; i--) {
			let __goscriptTuple0: any = bits.Div(r, $.arrayIndex($.pointerValue<Nat>(x).limbs!, i), y)
			$.pointerValue<Nat>(x).limbs![i] = __goscriptTuple0[0]
			r = __goscriptTuple0[1]
		}
		return r
	}

	public Equal(y: Nat | $.VarRef<Nat> | null): choice {
		const x: Nat | $.VarRef<Nat> | null = this
		// Eliminate bounds checks in the loop.
		let size = $.len($.pointerValue<Nat>(x).limbs)
		let xLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, size)
		let yLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(y).limbs, undefined, size)

		let equal = 1
		for (let i = 0; i < size; i++) {
			equal = $.uint($.uint64And(equal, ctEq($.arrayIndex(xLimbs!, i), $.arrayIndex(yLimbs!, i))), 64)
		}
		return equal
	}

	public Exp(x: Nat | $.VarRef<Nat> | null, e: $.Slice<number>, m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		let out: Nat | $.VarRef<Nat> | null = this
		if (!$.pointerValue<Modulus>(m).odd) {
			$.panic("bigmod: modulus for Exp must be odd")
		}

		// We use a 4 bit window. For our RSA workload, 4 bit windows are faster
		// than 2 bit windows, but use an extra 12 nats worth of scratch space.
		// Using bit sizes that don't divide 8 are more complex to implement, but
		// are likely to be more efficient if necessary.

		let table = [NewNat(), NewNat(), NewNat(), NewNat(), NewNat(), NewNat(), NewNat(), NewNat(), NewNat(), NewNat(), NewNat(), NewNat(), NewNat(), NewNat(), NewNat()]
		Nat.prototype.montgomeryRepresentation.call(Nat.prototype.set.call($.arrayIndex(table, 0), x), m)
		for (let i = 1; i < $.len(table); i++) {
			Nat.prototype.montgomeryMul.call($.arrayIndex(table, i), $.arrayIndex(table, i - 1), $.arrayIndex(table, 0), m)
		}

		Nat.prototype.resetFor.call(out, m)
		$.pointerValue<Nat>(out).limbs![0] = 1
		Nat.prototype.montgomeryRepresentation.call(out, m)
		let tmp: Nat | $.VarRef<Nat> | null = Nat.prototype.ExpandFor.call(NewNat(), m)
		for (let __goscriptRangeTarget3 = e, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
			let b = __goscriptRangeTarget3![__rangeIndex]
			for (let __goscriptRangeTarget2 = $.arrayToSlice<number>([4, 0]), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
				let j = __goscriptRangeTarget2![__rangeIndex]
				// Square four times. Optimization note: this can be implemented
				// more efficiently than with generic Montgomery multiplication.
				Nat.prototype.montgomeryMul.call(out, out, out, m)
				Nat.prototype.montgomeryMul.call(out, out, out, m)
				Nat.prototype.montgomeryMul.call(out, out, out, m)
				Nat.prototype.montgomeryMul.call(out, out, out, m)

				// Select x^k in constant time from the table.
				let k = $.uint(($.uintShr(b, j, 8)) & 0b1111, 64)
				for (let __goscriptRangeTarget1 = table, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
					Nat.prototype.assign.call(tmp, ctEq(k, $.uint(i + 1, 64)), $.arrayIndex(table, i))
				}

				// Multiply by x^k, discarding the result if k = 0.
				Nat.prototype.montgomeryMul.call(tmp, out, tmp, m)
				Nat.prototype.assign.call(out, not(ctEq(k, 0)), tmp)
			}
		}

		return Nat.prototype.montgomeryReduction.call(out, m)
	}

	public ExpShortVarTime(x: Nat | $.VarRef<Nat> | null, e: number, m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		const out: Nat | $.VarRef<Nat> | null = this
		if (!$.pointerValue<Modulus>(m).odd) {
			$.panic("bigmod: modulus for ExpShortVarTime must be odd")
		}
		// For short exponents, precomputing a table and using a window like in Exp
		// doesn't pay off. Instead, we do a simple conditional square-and-multiply
		// chain, skipping the initial run of zeroes.
		let xR: Nat | $.VarRef<Nat> | null = Nat.prototype.montgomeryRepresentation.call(Nat.prototype.set.call(NewNat(), x), m)
		Nat.prototype.set.call(out, xR)
		for (let i = (bits.UintSize - bits.Len(e)) + 1; i < bits.UintSize; i++) {
			Nat.prototype.montgomeryMul.call(out, out, out, m)
			{
				let k = $.uint($.uint64And(($.uint($.uint64Shr(e, ((bits.UintSize - i) - 1)), 64)), 1n), 64)
				if (k != 0) {
					Nat.prototype.montgomeryMul.call(out, out, xR, m)
				}
			}
		}
		return Nat.prototype.montgomeryReduction.call(out, m)
	}

	public ExpandFor(m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		return Nat.prototype.expand.call(x, $.len($.pointerValue<Nat>($.pointerValue<Modulus>(m).nat).limbs))
	}

	public GCDVarTime(a: Nat | $.VarRef<Nat> | null, b: Nat | $.VarRef<Nat> | null): [Nat | $.VarRef<Nat> | null, $.GoError] {
		const x: Nat | $.VarRef<Nat> | null = this
		let __goscriptTuple1: any = extendedGCD(a, b)
		let u: Nat | $.VarRef<Nat> | null = __goscriptTuple1[0]
		let err = __goscriptTuple1[2]
		if (err != null) {
			return [null, err]
		}
		return [Nat.prototype.set.call(x, u), null]
	}

	public InverseVarTime(a: Nat | $.VarRef<Nat> | null, m: Modulus | $.VarRef<Modulus> | null): [Nat | $.VarRef<Nat> | null, boolean] {
		const x: Nat | $.VarRef<Nat> | null = this
		let __goscriptTuple2: any = extendedGCD(a, $.pointerValue<Modulus>(m).nat)
		let u: Nat | $.VarRef<Nat> | null = __goscriptTuple2[0]
		let A: Nat | $.VarRef<Nat> | null = __goscriptTuple2[1]
		let err = __goscriptTuple2[2]
		if (err != null) {
			return [x, false]
		}
		if (Nat.prototype.IsOne.call(u) == 0) {
			return [x, false]
		}
		return [Nat.prototype.set.call(x, A), true]
	}

	public IsMinusOne(m: Modulus | $.VarRef<Modulus> | null): choice {
		const x: Nat | $.VarRef<Nat> | null = this
		let minusOne: Nat | $.VarRef<Nat> | null = Modulus.prototype.Nat.call(m)
		Nat.prototype.SubOne.call(minusOne, m)
		return Nat.prototype.Equal.call(x, minusOne)
	}

	public IsOdd(): choice {
		const x: Nat | $.VarRef<Nat> | null = this
		if ($.len($.pointerValue<Nat>(x).limbs) == 0) {
			return 0
		}
		return $.uint($.uint($.uint64And($.arrayIndex($.pointerValue<Nat>(x).limbs!, 0), 1n), 64), 64)
	}

	public IsOne(): choice {
		const x: Nat | $.VarRef<Nat> | null = this
		// Eliminate bounds checks in the loop.
		let size = $.len($.pointerValue<Nat>(x).limbs)
		let xLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, size)

		if ($.len(xLimbs) == 0) {
			return 0
		}

		let one = ctEq($.arrayIndex(xLimbs!, 0), 1)
		for (let i = 1; i < size; i++) {
			one = $.uint($.uint64And(one, ctEq($.arrayIndex(xLimbs!, i), 0)), 64)
		}
		return one
	}

	public IsZero(): choice {
		const x: Nat | $.VarRef<Nat> | null = this
		// Eliminate bounds checks in the loop.
		let size = $.len($.pointerValue<Nat>(x).limbs)
		let xLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, size)

		let zero = 1
		for (let i = 0; i < size; i++) {
			zero = $.uint($.uint64And(zero, ctEq($.arrayIndex(xLimbs!, i), 0)), 64)
		}
		return zero
	}

	public Mod(x: Nat | $.VarRef<Nat> | null, m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		let out: Nat | $.VarRef<Nat> | null = this
		Nat.prototype.resetFor.call(out, m)
		// Working our way from the most significant to the least significant limb,
		// we can insert each limb at the least significant position, shifting all
		// previous limbs left by _W. This way each limb will get shifted by the
		// correct number of bits. We can insert at least N - 1 limbs without
		// overflowing m. After that, we need to reduce every time we shift.
		let i = $.len($.pointerValue<Nat>(x).limbs) - 1
		// For the first N - 1 limbs we can skip the actual shifting and position
		// them at the shifted position, which starts at min(N - 2, i).
		let start = $.len($.pointerValue<Nat>($.pointerValue<Modulus>(m).nat).limbs) - 2
		if (i < start) {
			start = i
		}
		for (let j = start; j >= 0; j--) {
			$.pointerValue<Nat>(out).limbs![j] = $.arrayIndex($.pointerValue<Nat>(x).limbs!, i)
			i--
		}
		// We shift in the remaining limbs, reducing modulo m each time.
		while (i >= 0) {
			Nat.prototype.shiftIn.call(out, $.arrayIndex($.pointerValue<Nat>(x).limbs!, i), m)
			i--
		}
		return out
	}

	public Mul(y: Nat | $.VarRef<Nat> | null, m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		if ($.pointerValue<Modulus>(m).odd) {
			// A Montgomery multiplication by a value out of the Montgomery domain
			// takes the result out of Montgomery representation.
			let xR: Nat | $.VarRef<Nat> | null = Nat.prototype.montgomeryRepresentation.call(Nat.prototype.set.call(NewNat(), x), m)
			return Nat.prototype.montgomeryMul.call(x, xR, y, m)
		}

		let n = $.len($.pointerValue<Nat>($.pointerValue<Modulus>(m).nat).limbs)
		let xLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, n)
		let yLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(y).limbs, undefined, n)

		switch (n) {
			default:
			{
				let T: $.Slice<number> = $.makeSlice<number>(0, 32 * 2, "number")
				if ($.cap(T) < (n * 2)) {
					T = $.makeSlice<number>(0, n * 2, "number")
				}
				T = $.goSlice(T, undefined, n * 2)

				// T = x * y
				for (let i = 0; i < n; i++) {
					T![n + i] = addMulVVW($.goSlice(T, i, n + i), xLimbs, $.arrayIndex(yLimbs!, i))
				}

				// x = T mod m
				return Nat.prototype.Mod.call(x, new Nat({limbs: T}), m)
				break
			}
			case Math.trunc(1024 / 64):
			{
				const n: number = 16
				let T: $.Slice<number> = $.makeSlice<number>(16 * 2, undefined, "number")
				for (let i = 0; i < 16; i++) {
					T![16 + i] = __goscript_nat_wasm.addMulVVW1024($.indexRef(T!, i), $.indexRef(xLimbs!, 0), $.arrayIndex(yLimbs!, i))
				}
				return Nat.prototype.Mod.call(x, new Nat({limbs: T}), m)
				break
			}
			case Math.trunc(1536 / 64):
			{
				const n: number = 24
				let T: $.Slice<number> = $.makeSlice<number>(24 * 2, undefined, "number")
				for (let i = 0; i < 24; i++) {
					T![24 + i] = __goscript_nat_wasm.addMulVVW1536($.indexRef(T!, i), $.indexRef(xLimbs!, 0), $.arrayIndex(yLimbs!, i))
				}
				return Nat.prototype.Mod.call(x, new Nat({limbs: T}), m)
				break
			}
			case Math.trunc(2048 / 64):
			{
				const n: number = 32
				let T: $.Slice<number> = $.makeSlice<number>(32 * 2, undefined, "number")
				for (let i = 0; i < 32; i++) {
					T![32 + i] = __goscript_nat_wasm.addMulVVW2048($.indexRef(T!, i), $.indexRef(xLimbs!, 0), $.arrayIndex(yLimbs!, i))
				}
				return Nat.prototype.Mod.call(x, new Nat({limbs: T}), m)
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public SetBytes(b: $.Slice<number>, m: Modulus | $.VarRef<Modulus> | null): [Nat | $.VarRef<Nat> | null, $.GoError] {
		const x: Nat | $.VarRef<Nat> | null = this
		Nat.prototype.resetFor.call(x, m)
		{
			let err = Nat.prototype.setBytes.call(x, b)
			if (err != null) {
				return [null, err]
			}
		}
		if (Nat.prototype.cmpGeq.call(x, $.pointerValue<Modulus>(m).nat) == 1) {
			return [null, errors.New("input overflows the modulus")]
		}
		return [x, null]
	}

	public SetOverflowingBytes(b: $.Slice<number>, m: Modulus | $.VarRef<Modulus> | null): [Nat | $.VarRef<Nat> | null, $.GoError] {
		const x: Nat | $.VarRef<Nat> | null = this
		Nat.prototype.resetFor.call(x, m)
		{
			let err = Nat.prototype.setBytes.call(x, b)
			if (err != null) {
				return [null, err]
			}
		}
		// setBytes would have returned an error if the input overflowed the limb
		// size of the modulus, so now we only need to check if the most significant
		// limb of x has more bits than the most significant limb of the modulus.
		if (bitLen($.arrayIndex($.pointerValue<Nat>(x).limbs!, $.len($.pointerValue<Nat>(x).limbs) - 1)) > bitLen($.arrayIndex($.pointerValue<Nat>($.pointerValue<Modulus>(m).nat).limbs!, $.len($.pointerValue<Nat>($.pointerValue<Modulus>(m).nat).limbs) - 1))) {
			return [null, errors.New("input overflows the modulus size")]
		}
		Nat.prototype.maybeSubtractModulus.call(x, 0, m)
		return [x, null]
	}

	public SetUint(y: number): Nat | $.VarRef<Nat> | null {
		let x: Nat | $.VarRef<Nat> | null = this
		Nat.prototype.reset.call(x, 1)
		$.pointerValue<Nat>(x).limbs![0] = y
		return x
	}

	public ShiftRightVarTime(n: number): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		// Eliminate bounds checks in the loop.
		let size = $.len($.pointerValue<Nat>(x).limbs)
		let xLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, size)

		let shift = $.int($.uint($.uint64Mod(n, 64n), 64))
		let shiftLimbs = $.int($.uint($.uint64Div(n, 64n), 64))

		let shiftedLimbs: $.Slice<number> = null as $.Slice<number>
		if (shiftLimbs < size) {
			shiftedLimbs = $.goSlice(xLimbs, shiftLimbs, undefined)
		}

		for (let __goscriptRangeTarget4 = xLimbs, i = 0; i < $.len(__goscriptRangeTarget4); i++) {
			if (i >= $.len(shiftedLimbs)) {
				xLimbs![i] = 0
				continue
			}

			xLimbs![i] = $.uint($.uint64Shr($.arrayIndex(shiftedLimbs!, i), shift), 64)
			if ((i + 1) < $.len(shiftedLimbs)) {
				xLimbs![i] = $.uint($.uint64Or(xLimbs![i], $.uint($.uint64Shl($.arrayIndex(shiftedLimbs!, i + 1), (64 - shift)), 64)), 64)
			}
		}

		return x
	}

	public Sub(y: Nat | $.VarRef<Nat> | null, m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		let underflow = Nat.prototype.sub.call(x, y)
		// If the subtraction underflowed, add m.
		let t: Nat | $.VarRef<Nat> | null = Nat.prototype.set.call(NewNat(), x)
		Nat.prototype.add.call(t, $.pointerValue<Modulus>(m).nat)
		Nat.prototype.assign.call(x, $.uint(underflow, 64), t)
		return x
	}

	public SubOne(m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		let one: Nat | $.VarRef<Nat> | null = Nat.prototype.ExpandFor.call(NewNat(), m)
		$.pointerValue<Nat>(one).limbs![0] = 1
		// Sub asks for x to be reduced modulo m, while SubOne doesn't, but when
		// y = 1, it works, and this is an internal use.
		return Nat.prototype.Sub.call(x, one, m)
	}

	public TrailingZeroBitsVarTime(): number {
		const x: Nat | $.VarRef<Nat> | null = this
		let t: number = 0
		let limbs: $.Slice<number> = $.pointerValue<Nat>(x).limbs
		for (let __goscriptRangeTarget5 = limbs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
			let l = __goscriptRangeTarget5![__rangeIndex]
			if (l == 0) {
				t = $.uint($.uint64Add(t, 64), 64)
				continue
			}
			t = $.uint($.uint64Add(t, $.uint(bits.TrailingZeros(l), 64)), 64)
			break
		}
		return t
	}

	public add(y: Nat | $.VarRef<Nat> | null): number {
		const x: Nat | $.VarRef<Nat> | null = this
		let c: number = 0
		// Eliminate bounds checks in the loop.
		let size = $.len($.pointerValue<Nat>(x).limbs)
		let xLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, size)
		let yLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(y).limbs, undefined, size)

		for (let i = 0; i < size; i++) {
			let __goscriptTuple3: any = bits.Add($.arrayIndex(xLimbs!, i), $.arrayIndex(yLimbs!, i), c)
			xLimbs![i] = __goscriptTuple3[0]
			c = __goscriptTuple3[1]
		}
		return c
	}

	public assign(on: choice, y: Nat | $.VarRef<Nat> | null): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		// Eliminate bounds checks in the loop.
		let size = $.len($.pointerValue<Nat>(x).limbs)
		let xLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, size)
		let yLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(y).limbs, undefined, size)

		let mask = ctMask(on)
		for (let i = 0; i < size; i++) {
			xLimbs![i] = $.uint($.uint64Xor(xLimbs![i], $.uint($.uint64And(mask, ($.uint($.uint64Xor($.arrayIndex(xLimbs!, i), $.arrayIndex(yLimbs!, i)), 64))), 64)), 64)
		}
		return x
	}

	public cmpGeq(y: Nat | $.VarRef<Nat> | null): choice {
		const x: Nat | $.VarRef<Nat> | null = this
		// Eliminate bounds checks in the loop.
		let size = $.len($.pointerValue<Nat>(x).limbs)
		let xLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, size)
		let yLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(y).limbs, undefined, size)

		let c: number = 0
		for (let i = 0; i < size; i++) {
			let __goscriptTuple4: any = bits.Sub($.arrayIndex(xLimbs!, i), $.arrayIndex(yLimbs!, i), c)
			c = __goscriptTuple4[1]
		}
		// If there was a carry, then subtracting y underflowed, so
		// x is not greater than or equal to y.
		return not($.uint(c, 64))
	}

	public expand(n: number): Nat | $.VarRef<Nat> | null {
		let x: Nat | $.VarRef<Nat> | null = this
		if ($.len($.pointerValue<Nat>(x).limbs) > n) {
			$.panic("bigmod: internal error: shrinking nat")
		}
		if ($.cap($.pointerValue<Nat>(x).limbs) < n) {
			let newLimbs: $.Slice<number> = $.makeSlice<number>(n, undefined, "number")
			$.copy(newLimbs, $.pointerValue<Nat>(x).limbs)
			$.pointerValue<Nat>(x).limbs = newLimbs
			return x
		}
		let extraLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(x).limbs, $.len($.pointerValue<Nat>(x).limbs), n)
		$.clear(extraLimbs)
		$.pointerValue<Nat>(x).limbs = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, n)
		return x
	}

	public maybeSubtractModulus(always: choice, m: Modulus | $.VarRef<Modulus> | null): void {
		const x: Nat | $.VarRef<Nat> | null = this
		let t: Nat | $.VarRef<Nat> | null = Nat.prototype.set.call(NewNat(), x)
		let underflow = Nat.prototype.sub.call(t, $.pointerValue<Modulus>(m).nat)
		// We keep the result if x - m didn't underflow (meaning x >= m)
		// or if always was set.
		let keep = $.uint($.uint64Or(not($.uint(underflow, 64)), $.uint(always, 64)), 64)
		Nat.prototype.assign.call(x, keep, t)
	}

	public montgomeryMul(a: Nat | $.VarRef<Nat> | null, b: Nat | $.VarRef<Nat> | null, m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		let n = $.len($.pointerValue<Nat>($.pointerValue<Modulus>(m).nat).limbs)
		let mLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>($.pointerValue<Modulus>(m).nat).limbs, undefined, n)
		let aLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(a).limbs, undefined, n)
		let bLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(b).limbs, undefined, n)

		switch (n) {
			default:
			{
				let T: $.Slice<number> = $.makeSlice<number>(0, 32 * 2, "number")
				if ($.cap(T) < (n * 2)) {
					T = $.makeSlice<number>(0, n * 2, "number")
				}
				T = $.goSlice(T, undefined, n * 2)

				// This loop implements Word-by-Word Montgomery Multiplication, as
				// described in Algorithm 4 (Fig. 3) of "Efficient Software
				// Implementations of Modular Exponentiation" by Shay Gueron
				// [https://eprint.iacr.org/2011/239.pdf].
				let c: number = 0
				for (let i = 0; i < n; i++) {
					$.arrayIndex(T!, n + i)

					// Step 1 (T = a × b) is computed as a large pen-and-paper column
					// multiplication of two numbers with n base-2^_W digits. If we just
					// wanted to produce 2n-wide T, we would do
					//
					//   for i := 0; i < n; i++ {
					//       d := bLimbs[i]
					//       T[n+i] = addMulVVW(T[i:n+i], aLimbs, d)
					//   }
					//
					// where d is a digit of the multiplier, T[i:n+i] is the shifted
					// position of the product of that digit, and T[n+i] is the final carry.
					// Note that T[i] isn't modified after processing the i-th digit.
					//
					// Instead of running two loops, one for Step 1 and one for Steps 2–6,
					// the result of Step 1 is computed during the next loop. This is
					// possible because each iteration only uses T[i] in Step 2 and then
					// discards it in Step 6.
					let d = $.arrayIndex(bLimbs!, i)
					let c1 = addMulVVW($.goSlice(T, i, n + i), aLimbs, d)

					// Step 6 is replaced by shifting the virtual window we operate
					// over: T of the algorithm is T[i:] for us. That means that T1 in
					// Step 2 (T mod 2^_W) is simply T[i]. k0 in Step 3 is our m0inv.
					let Y = $.uint($.uint64Mul($.arrayIndex(T!, i), $.pointerValue<Modulus>(m).m0inv), 64)

					// Step 4 and 5 add Y × m to T, which as mentioned above is stored
					// at T[i:]. The two carries (from a × d and Y × m) are added up in
					// the next word T[n+i], and the carry bit from that addition is
					// brought forward to the next iteration.
					let c2 = addMulVVW($.goSlice(T, i, n + i), mLimbs, Y)
					let __goscriptTuple5: any = bits.Add(c1, c2, c)
					T![n + i] = __goscriptTuple5[0]
					c = __goscriptTuple5[1]
				}

				// Finally for Step 7 we copy the final T window into x, and subtract m
				// if necessary (which as explained in maybeSubtractModulus can be the
				// case both if x >= m, or if x overflowed).
				//
				// The paper suggests in Section 4 that we can do an "Almost Montgomery
				// Multiplication" by subtracting only in the overflow case, but the
				// cost is very similar since the constant time subtraction tells us if
				// x >= m as a side effect, and taking care of the broken invariant is
				// highly undesirable (see https://go.dev/issue/13907).
				$.copy($.pointerValue<Nat>(Nat.prototype.reset.call(x, n)).limbs, $.goSlice(T, n, undefined))
				Nat.prototype.maybeSubtractModulus.call(x, $.uint(c, 64), m)
				break
			}
			case Math.trunc(1024 / 64):
			{
				const n: number = 16
				let T: $.Slice<number> = $.makeSlice<number>(16 * 2, undefined, "number")
				let c: number = 0
				for (let i = 0; i < 16; i++) {
					let d = $.arrayIndex(bLimbs!, i)
					let c1 = __goscript_nat_wasm.addMulVVW1024($.indexRef(T!, i), $.indexRef(aLimbs!, 0), d)
					let Y = $.uint($.uint64Mul($.arrayIndex(T!, i), $.pointerValue<Modulus>(m).m0inv), 64)
					let c2 = __goscript_nat_wasm.addMulVVW1024($.indexRef(T!, i), $.indexRef(mLimbs!, 0), Y)
					let __goscriptTuple6: any = bits.Add(c1, c2, c)
					T![16 + i] = __goscriptTuple6[0]
					c = __goscriptTuple6[1]
				}
				$.copy($.pointerValue<Nat>(Nat.prototype.reset.call(x, 16)).limbs, $.goSlice(T, 16, undefined))
				Nat.prototype.maybeSubtractModulus.call(x, $.uint(c, 64), m)
				break
			}
			case Math.trunc(1536 / 64):
			{
				const n: number = 24
				let T: $.Slice<number> = $.makeSlice<number>(24 * 2, undefined, "number")
				let c: number = 0
				for (let i = 0; i < 24; i++) {
					let d = $.arrayIndex(bLimbs!, i)
					let c1 = __goscript_nat_wasm.addMulVVW1536($.indexRef(T!, i), $.indexRef(aLimbs!, 0), d)
					let Y = $.uint($.uint64Mul($.arrayIndex(T!, i), $.pointerValue<Modulus>(m).m0inv), 64)
					let c2 = __goscript_nat_wasm.addMulVVW1536($.indexRef(T!, i), $.indexRef(mLimbs!, 0), Y)
					let __goscriptTuple7: any = bits.Add(c1, c2, c)
					T![24 + i] = __goscriptTuple7[0]
					c = __goscriptTuple7[1]
				}
				$.copy($.pointerValue<Nat>(Nat.prototype.reset.call(x, 24)).limbs, $.goSlice(T, 24, undefined))
				Nat.prototype.maybeSubtractModulus.call(x, $.uint(c, 64), m)
				break
			}
			case Math.trunc(2048 / 64):
			{
				const n: number = 32
				let T: $.Slice<number> = $.makeSlice<number>(32 * 2, undefined, "number")
				let c: number = 0
				for (let i = 0; i < 32; i++) {
					let d = $.arrayIndex(bLimbs!, i)
					let c1 = __goscript_nat_wasm.addMulVVW2048($.indexRef(T!, i), $.indexRef(aLimbs!, 0), d)
					let Y = $.uint($.uint64Mul($.arrayIndex(T!, i), $.pointerValue<Modulus>(m).m0inv), 64)
					let c2 = __goscript_nat_wasm.addMulVVW2048($.indexRef(T!, i), $.indexRef(mLimbs!, 0), Y)
					let __goscriptTuple8: any = bits.Add(c1, c2, c)
					T![32 + i] = __goscriptTuple8[0]
					c = __goscriptTuple8[1]
				}
				$.copy($.pointerValue<Nat>(Nat.prototype.reset.call(x, 32)).limbs, $.goSlice(T, 32, undefined))
				Nat.prototype.maybeSubtractModulus.call(x, $.uint(c, 64), m)
				break
			}
		}

		return x
	}

	public montgomeryReduction(m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		// By Montgomery multiplying with 1 not in Montgomery representation, we
		// convert out back from Montgomery representation, because it works out to
		// dividing by R.
		let one: Nat | $.VarRef<Nat> | null = Nat.prototype.ExpandFor.call(NewNat(), m)
		$.pointerValue<Nat>(one).limbs![0] = 1
		return Nat.prototype.montgomeryMul.call(x, x, one, m)
	}

	public montgomeryRepresentation(m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		// A Montgomery multiplication (which computes a * b / R) by R * R works out
		// to a multiplication by R, which takes the value out of the Montgomery domain.
		return Nat.prototype.montgomeryMul.call(x, x, $.pointerValue<Modulus>(m).rr, m)
	}

	public reset(n: number): Nat | $.VarRef<Nat> | null {
		let x: Nat | $.VarRef<Nat> | null = this
		if ($.cap($.pointerValue<Nat>(x).limbs) < n) {
			$.pointerValue<Nat>(x).limbs = $.makeSlice<number>(n, undefined, "number")
			return x
		}
		// Clear both the returned limbs and the previously used ones.
		$.clear($.goSlice($.pointerValue<Nat>(x).limbs, undefined, $.max(n, $.len($.pointerValue<Nat>(x).limbs))))
		$.pointerValue<Nat>(x).limbs = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, n)
		return x
	}

	public resetFor(m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		const out: Nat | $.VarRef<Nat> | null = this
		return Nat.prototype.reset.call(out, $.len($.pointerValue<Nat>($.pointerValue<Modulus>(m).nat).limbs))
	}

	public resetToBytes(b: $.Slice<number>): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		Nat.prototype.reset.call(x, Math.trunc((($.len(b) + 8) - 1) / 8))
		{
			let err = Nat.prototype.setBytes.call(x, b)
			if (err != null) {
				$.panic("bigmod: internal error: bad arithmetic")
			}
		}
		return Nat.prototype.trim.call(x)
	}

	public ["set"](y: Nat | $.VarRef<Nat> | null): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		Nat.prototype.reset.call(x, $.len($.pointerValue<Nat>(y).limbs))
		$.copy($.pointerValue<Nat>(x).limbs, $.pointerValue<Nat>(y).limbs)
		return x
	}

	public setBytes(b: $.Slice<number>): $.GoError {
		let x: Nat | $.VarRef<Nat> | null = this
		let i = $.len(b)
		let k = 0
		while ((k < $.len($.pointerValue<Nat>(x).limbs)) && (i >= 8)) {
			$.pointerValue<Nat>(x).limbs![k] = bigEndianUint($.goSlice(b, i - 8, i))
			i = i - (8)
			k++
		}
		for (let s = 0; ((s < 64) && (k < $.len($.pointerValue<Nat>(x).limbs))) && (i > 0); s = s + (8)) {
			$.pointerValue<Nat>(x).limbs![k] = $.uint($.uint64Or($.pointerValue<Nat>(x).limbs![k], $.uint($.uint64Shl($.uint($.arrayIndex(b!, i - 1), 64), s), 64)), 64)
			i--
		}
		if (i > 0) {
			return errors.New("input overflows the modulus size")
		}
		return null
	}

	public shiftIn(y: number, m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
		const x: Nat | $.VarRef<Nat> | null = this
		let d: Nat | $.VarRef<Nat> | null = Nat.prototype.resetFor.call(NewNat(), m)

		// Eliminate bounds checks in the loop.
		let size = $.len($.pointerValue<Nat>($.pointerValue<Modulus>(m).nat).limbs)
		let xLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, size)
		let dLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(d).limbs, undefined, size)
		let mLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>($.pointerValue<Modulus>(m).nat).limbs, undefined, size)

		// Each iteration of this loop computes x = 2x + b mod m, where b is a bit
		// from y. Effectively, it left-shifts x and adds y one bit at a time,
		// reducing it every time.
		//
		// To do the reduction, each iteration computes both 2x + b and 2x + b - m.
		// The next iteration (and finally the return line) will use either result
		// based on whether 2x + b overflows m.
		let needSubtraction = 0
		for (let i = 64 - 1; i >= 0; i--) {
			let carry = $.uint($.uint64And(($.uint($.uint64Shr(y, i), 64)), 1n), 64)
			let borrow: number = 0
			let mask = ctMask(needSubtraction)
			for (let __goscriptShadow0 = 0; __goscriptShadow0 < size; __goscriptShadow0++) {
				let l = $.uint($.uint64Xor($.arrayIndex(xLimbs!, __goscriptShadow0), ($.uint($.uint64And(mask, ($.uint($.uint64Xor($.arrayIndex(xLimbs!, __goscriptShadow0), $.arrayIndex(dLimbs!, __goscriptShadow0)), 64))), 64))), 64)
				let __goscriptTuple9: any = bits.Add(l, l, carry)
				xLimbs![__goscriptShadow0] = __goscriptTuple9[0]
				carry = __goscriptTuple9[1]
				let __goscriptTuple10: any = bits.Sub($.arrayIndex(xLimbs!, __goscriptShadow0), $.arrayIndex(mLimbs!, __goscriptShadow0), borrow)
				dLimbs![__goscriptShadow0] = __goscriptTuple10[0]
				borrow = __goscriptTuple10[1]
			}
			// Like in maybeSubtractModulus, we need the subtraction if either it
			// didn't underflow (meaning 2x + b > m) or if computing 2x + b
			// overflowed (meaning 2x + b > 2^_W*n > m).
			needSubtraction = $.uint($.uint64Or(not($.uint(borrow, 64)), $.uint(carry, 64)), 64)
		}
		return Nat.prototype.assign.call(x, needSubtraction, d)
	}

	public sub(y: Nat | $.VarRef<Nat> | null): number {
		const x: Nat | $.VarRef<Nat> | null = this
		let c: number = 0
		// Eliminate bounds checks in the loop.
		let size = $.len($.pointerValue<Nat>(x).limbs)
		let xLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, size)
		let yLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(y).limbs, undefined, size)

		for (let i = 0; i < size; i++) {
			let __goscriptTuple11: any = bits.Sub($.arrayIndex(xLimbs!, i), $.arrayIndex(yLimbs!, i), c)
			xLimbs![i] = __goscriptTuple11[0]
			c = __goscriptTuple11[1]
		}
		return c
	}

	public trim(): Nat | $.VarRef<Nat> | null {
		let x: Nat | $.VarRef<Nat> | null = this
		// Trim most significant (trailing in little-endian) zero limbs.
		// We assume comparison with zero (but not the branch) is constant time.
		for (let i = $.len($.pointerValue<Nat>(x).limbs) - 1; i >= 0; i--) {
			if ($.arrayIndex($.pointerValue<Nat>(x).limbs!, i) != 0) {
				break
			}
			$.pointerValue<Nat>(x).limbs = $.goSlice($.pointerValue<Nat>(x).limbs, undefined, i)
		}
		return x
	}

	static __typeInfo = $.registerStructType(
		"bigmod.Nat",
		() => new Nat(),
		[{ name: "Add", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "BitLenVarTime", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Bits", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint" } } }] }, { name: "Bytes", args: [{ name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "DivShortVarTime", args: [{ name: "y", type: { kind: $.TypeKind.Basic, name: "uint" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint" } }] }, { name: "Equal", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "bigmod.choice" } }] }, { name: "Exp", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "e", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "ExpShortVarTime", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "e", type: { kind: $.TypeKind.Basic, name: "uint" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "ExpandFor", args: [{ name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "GCDVarTime", args: [{ name: "a", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "b", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "_r1", type: "error" }] }, { name: "InverseVarTime", args: [{ name: "a", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsMinusOne", args: [{ name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "bigmod.choice" } }] }, { name: "IsOdd", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "bigmod.choice" } }] }, { name: "IsOne", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "bigmod.choice" } }] }, { name: "IsZero", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "bigmod.choice" } }] }, { name: "Mod", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "Mul", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "SetBytes", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "_r1", type: "error" }] }, { name: "SetOverflowingBytes", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "_r1", type: "error" }] }, { name: "SetUint", args: [{ name: "y", type: { kind: $.TypeKind.Basic, name: "uint" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "ShiftRightVarTime", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "uint" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "Sub", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "SubOne", args: [{ name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "TrailingZeroBitsVarTime", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint" } }] }, { name: "add", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }], returns: [{ name: "c", type: { kind: $.TypeKind.Basic, name: "uint" } }] }, { name: "assign", args: [{ name: "on", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "bigmod.choice" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "cmpGeq", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "bigmod.choice" } }] }, { name: "expand", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "maybeSubtractModulus", args: [{ name: "always", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "bigmod.choice" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [] }, { name: "montgomeryMul", args: [{ name: "a", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "b", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "montgomeryReduction", args: [{ name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "montgomeryRepresentation", args: [{ name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "reset", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "resetFor", args: [{ name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "resetToBytes", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "set", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "setBytes", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "shiftIn", args: [{ name: "y", type: { kind: $.TypeKind.Basic, name: "uint" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "sub", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }], returns: [{ name: "c", type: { kind: $.TypeKind.Basic, name: "uint" } }] }, { name: "trim", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }],
		Nat,
		[{ name: "limbs", key: "limbs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint" } }, pkgPath: "crypto/internal/fips140/bigmod", index: [0], offset: 0, exported: false }]
	)
}

export class Modulus {
	// The underlying natural number for this modulus.
	//
	// This will be stored without any padding, and shouldn't alias with any
	// other natural number being used.
	public get nat(): Nat | $.VarRef<Nat> | null {
		return this._fields.nat.value
	}
	public set nat(value: Nat | $.VarRef<Nat> | null) {
		this._fields.nat.value = value
	}

	// If m is even, the following fields are not set.
	public get odd(): boolean {
		return this._fields.odd.value
	}
	public set odd(value: boolean) {
		this._fields.odd.value = value
	}

	public get m0inv(): number {
		return this._fields.m0inv.value
	}
	public set m0inv(value: number) {
		this._fields.m0inv.value = value
	}

	public get rr(): Nat | $.VarRef<Nat> | null {
		return this._fields.rr.value
	}
	public set rr(value: Nat | $.VarRef<Nat> | null) {
		this._fields.rr.value = value
	}

	public _fields: {
		nat: $.VarRef<Nat | $.VarRef<Nat> | null>
		odd: $.VarRef<boolean>
		m0inv: $.VarRef<number>
		rr: $.VarRef<Nat | $.VarRef<Nat> | null>
	}

	constructor(init?: Partial<{nat?: Nat | $.VarRef<Nat> | null, odd?: boolean, m0inv?: number, rr?: Nat | $.VarRef<Nat> | null}>) {
		this._fields = {
			nat: $.varRef(init?.nat ?? (null as Nat | $.VarRef<Nat> | null)),
			odd: $.varRef(init?.odd ?? (false as boolean)),
			m0inv: $.varRef(init?.m0inv ?? (0 as number)),
			rr: $.varRef(init?.rr ?? (null as Nat | $.VarRef<Nat> | null))
		}
	}

	public clone(): Modulus {
		const cloned = new Modulus()
		cloned._fields = {
			nat: $.varRef(this._fields.nat.value),
			odd: $.varRef(this._fields.odd.value),
			m0inv: $.varRef(this._fields.m0inv.value),
			rr: $.varRef(this._fields.rr.value)
		}
		return $.markAsStructValue(cloned)
	}

	public BitLen(): number {
		const m: Modulus | $.VarRef<Modulus> | null = this
		return Nat.prototype.BitLenVarTime.call($.pointerValue<Modulus>(m).nat)
	}

	public Nat(): Nat | $.VarRef<Nat> | null {
		const m: Modulus | $.VarRef<Modulus> | null = this
		// Make a copy so that the caller can't modify m.nat or alias it with
		// another Nat in a modulus operation.
		let n: Nat | $.VarRef<Nat> | null = NewNat()
		Nat.prototype.set.call(n, $.pointerValue<Modulus>(m).nat)
		return n
	}

	public Size(): number {
		const m: Modulus | $.VarRef<Modulus> | null = this
		return Math.trunc((Modulus.prototype.BitLen.call(m) + 7) / 8)
	}

	static __typeInfo = $.registerStructType(
		"bigmod.Modulus",
		() => new Modulus(),
		[{ name: "BitLen", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Nat", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" } }] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		Modulus,
		[{ name: "nat", key: "nat", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" }, pkgPath: "crypto/internal/fips140/bigmod", index: [0], offset: 0, exported: false }, { name: "odd", key: "odd", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/internal/fips140/bigmod", index: [1], offset: 8, exported: false }, { name: "m0inv", key: "m0inv", type: { kind: $.TypeKind.Basic, name: "uint" }, pkgPath: "crypto/internal/fips140/bigmod", index: [2], offset: 16, exported: false }, { name: "rr", key: "rr", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" }, pkgPath: "crypto/internal/fips140/bigmod", index: [3], offset: 24, exported: false }]
	)
}

export const _W: number = 64

export const _S: number = 8

export const yes: choice = 1

export const no: choice = 0

export const preallocTarget: number = 2048

export const preallocLimbs: number = 32

export function not(c: choice): choice {
	return $.uint($.uint64Xor(1n, c), 64)
}

export function ctMask(on: choice): number {
	return -$.uint(on, 64)
}

export function ctEq(x: number, y: number): choice {
	// If x != y, then either x - y or y - x will generate a carry.
	let [, c1] = bits.Sub(x, y, 0)
	let [, c2] = bits.Sub(y, x, 0)
	return not($.uint($.uint($.uint64Or(c1, c2), 64), 64))
}

export function NewNat(): Nat | $.VarRef<Nat> | null {
	let limbs: $.Slice<number> = $.makeSlice<number>(0, 32, "number")
	return new Nat({limbs: limbs})
}

export function bigEndianUint(buf: $.Slice<number>): number {
	if ((64 as number) == 64) {
		return $.uint(byteorder.BEUint64(buf), 64)
	}
	return $.uint(byteorder.BEUint32(buf), 64)
}

export function bitLen(n: number): number {
	let len = 0
	// We assume, here and elsewhere, that comparison to zero is constant time
	// with respect to different non-zero values.
	while (n != 0) {
		len++
		n = $.uint($.uint64Shr(n, 1), 64)
	}
	return len
}

export function rr(m: Modulus | $.VarRef<Modulus> | null): Nat | $.VarRef<Nat> | null {
	let __goscriptShadow1: Nat | $.VarRef<Nat> | null = Nat.prototype.ExpandFor.call(NewNat(), m)
	let n = $.uint($.len($.pointerValue<Nat>(__goscriptShadow1).limbs), 64)
	let mLen = $.uint(Modulus.prototype.BitLen.call(m), 64)
	let logR = $.uint($.uint64Mul(64n, n), 64)

	// We start by computing R = 2^(_W * n) mod m. We can get pretty close, to
	// 2^⌊log₂m⌋, by setting the highest bit we can without having to reduce.
	$.pointerValue<Nat>(__goscriptShadow1).limbs![$.uint($.uint64Sub(n, 1n), 64)] = $.uint($.uint64Shl(1n, ($.uint($.uint64Mod(($.uint($.uint64Sub(mLen, 1n), 64)), 64n), 64))), 64)
	// Then we double until we reach 2^(_W * n).
	for (let i = $.uint($.uint64Sub(mLen, 1n), 64); i < logR; i++) {
		Nat.prototype.Add.call(__goscriptShadow1, __goscriptShadow1, m)
	}

	// Next we need to get from R to 2^(_W * n) R mod m (aka from one to R in
	// the Montgomery domain, meaning we can use Montgomery multiplication now).
	// We could do that by doubling _W * n times, or with a square-and-double
	// chain log2(_W * n) long. Turns out the fastest thing is to start out with
	// doublings, and switch to square-and-double once the exponent is large
	// enough to justify the cost of the multiplications.

	// The threshold is selected experimentally as a linear function of n.
	let threshold = $.uint($.uint64Div(n, 4n), 64)

	// We calculate how many of the most-significant bits of the exponent we can
	// compute before crossing the threshold, and we do it with doublings.
	let i = bits.UintSize
	while (($.uint($.uint64Shr(logR, i), 64)) <= threshold) {
		i--
	}
	for (let k = $.uint(0, 64); k < ($.uint($.uint64Shr(logR, i), 64)); k++) {
		Nat.prototype.Add.call(__goscriptShadow1, __goscriptShadow1, m)
	}

	// Then we process the remaining bits of the exponent with a
	// square-and-double chain.
	while (i > 0) {
		Nat.prototype.montgomeryMul.call(__goscriptShadow1, __goscriptShadow1, __goscriptShadow1, m)
		i--
		if (($.uint($.uint64And(($.uint($.uint64Shr(logR, i), 64)), 1n), 64)) != 0) {
			Nat.prototype.Add.call(__goscriptShadow1, __goscriptShadow1, m)
		}
	}

	return __goscriptShadow1
}

export function minusInverseModW(x: number): number {
	// Every iteration of this loop doubles the least-significant bits of
	// correct inverse in y. The first three bits are already correct (1⁻¹ = 1,
	// 3⁻¹ = 3, 5⁻¹ = 5, and 7⁻¹ = 7 mod 8), so doubling five times is enough
	// for 64 bits (and wastes only one iteration for 32 bits).
	//
	// See https://crypto.stackexchange.com/a/47496.
	let y = x
	for (let i = 0; i < 5; i++) {
		y = $.uint($.uint64Mul(y, ($.uint($.uint64Sub(2n, ($.uint($.uint64Mul(x, y), 64))), 64))), 64)
	}
	return -y
}

export function NewModulus(b: $.Slice<number>): [Modulus | $.VarRef<Modulus> | null, $.GoError] {
	let n: Nat | $.VarRef<Nat> | null = Nat.prototype.resetToBytes.call(NewNat(), b)
	return newModulus(n)
}

export function NewModulusProduct(a: $.Slice<number>, b: $.Slice<number>): [Modulus | $.VarRef<Modulus> | null, $.GoError] {
	let x: Nat | $.VarRef<Nat> | null = Nat.prototype.resetToBytes.call(NewNat(), a)
	let y: Nat | $.VarRef<Nat> | null = Nat.prototype.resetToBytes.call(NewNat(), b)
	let n: Nat | $.VarRef<Nat> | null = Nat.prototype.reset.call(NewNat(), $.len($.pointerValue<Nat>(x).limbs) + $.len($.pointerValue<Nat>(y).limbs))
	for (let __goscriptRangeTarget6 = $.pointerValue<Nat>(y).limbs, i = 0; i < $.len(__goscriptRangeTarget6); i++) {
		$.pointerValue<Nat>(n).limbs![i + $.len($.pointerValue<Nat>(x).limbs)] = addMulVVW($.goSlice($.pointerValue<Nat>(n).limbs, i, i + $.len($.pointerValue<Nat>(x).limbs)), $.pointerValue<Nat>(x).limbs, $.arrayIndex($.pointerValue<Nat>(y).limbs!, i))
	}
	return newModulus(Nat.prototype.trim.call(n))
}

export function newModulus(n: Nat | $.VarRef<Nat> | null): [Modulus | $.VarRef<Modulus> | null, $.GoError] {
	let m: Modulus | $.VarRef<Modulus> | null = new Modulus({nat: n})
	if ((Nat.prototype.IsZero.call($.pointerValue<Modulus>(m).nat) == 1) || (Nat.prototype.IsOne.call($.pointerValue<Modulus>(m).nat) == 1)) {
		return [null, errors.New("modulus must be > 1")]
	}
	if (Nat.prototype.IsOdd.call($.pointerValue<Modulus>(m).nat) == 1) {
		$.pointerValue<Modulus>(m).odd = true
		$.pointerValue<Modulus>(m).m0inv = minusInverseModW($.arrayIndex($.pointerValue<Nat>($.pointerValue<Modulus>(m).nat).limbs!, 0))
		$.pointerValue<Modulus>(m).rr = rr(m)
	}
	return [m, null]
}

export function addMulVVW(z: $.Slice<number>, x: $.Slice<number>, y: number): number {
	let carry: number = 0
	$.arrayIndex(x!, $.len(z) - 1)
	for (let __goscriptRangeTarget7 = z, i = 0; i < $.len(__goscriptRangeTarget7); i++) {
		let [hi, lo] = bits.Mul($.arrayIndex(x!, i), y)
		let __goscriptTuple12: any = bits.Add(lo, $.arrayIndex(z!, i), 0)
		lo = __goscriptTuple12[0]
		let c = __goscriptTuple12[1]
		// We use bits.Add with zero to get an add-with-carry instruction that
		// absorbs the carry from the previous bits.Add.
		let __goscriptTuple13: any = bits.Add(hi, 0, c)
		hi = __goscriptTuple13[0]
		let __goscriptTuple14: any = bits.Add(lo, carry, 0)
		lo = __goscriptTuple14[0]
		c = __goscriptTuple14[1]
		let __goscriptTuple15: any = bits.Add(hi, 0, c)
		hi = __goscriptTuple15[0]
		carry = hi
		z![i] = lo
	}
	return carry
}

export function extendedGCD(a: Nat | $.VarRef<Nat> | null, m: Nat | $.VarRef<Nat> | null): [Nat | $.VarRef<Nat> | null, Nat | $.VarRef<Nat> | null, $.GoError] {
	let u: Nat | $.VarRef<Nat> | null = null as Nat | $.VarRef<Nat> | null
	let A: Nat | $.VarRef<Nat> | null = null as Nat | $.VarRef<Nat> | null
	let err: $.GoError = null as $.GoError
	// This is the extended binary GCD algorithm described in the Handbook of
	// Applied Cryptography, Algorithm 14.61, adapted by BoringSSL to bound
	// coefficients and avoid negative numbers. For more details and proof of
	// correctness, see https://github.com/mit-plv/fiat-crypto/pull/333/files.
	//
	// Following the proof linked in the PR above, the changes are:
	//
	// 1. Negate [B] and [C] so they are positive. The invariant now involves a
	//    subtraction.
	// 2. If step 2 (both [x] and [y] are even) runs, abort immediately. This
	//    case needs to be handled by the caller.
	// 3. Subtract copies of [x] and [y] as needed in step 6 (both [u] and [v]
	//    are odd) so coefficients stay in bounds.
	// 4. Replace the [u >= v] check with [u > v]. This changes the end
	//    condition to [v = 0] rather than [u = 0]. This saves an extra
	//    subtraction due to which coefficients were negated.
	// 5. Rename x and y to a and n, to capture that one is a modulus.
	// 6. Rearrange steps 4 through 6 slightly. Merge the loops in steps 4 and
	//    5 into the main loop (step 7's goto), and move step 6 to the start of
	//    the loop iteration, ensuring each loop iteration halves at least one
	//    value.
	//
	// Note this algorithm does not handle either input being zero.

	if ((Nat.prototype.IsZero.call(a) == 1) || (Nat.prototype.IsZero.call(m) == 1)) {
		return [null, null, errors.New("extendedGCD: a or m is zero")]
	}
	if ((Nat.prototype.IsOdd.call(a) == 0) && (Nat.prototype.IsOdd.call(m) == 0)) {
		return [null, null, errors.New("extendedGCD: both a and m are even")]
	}

	let size = $.max($.len($.pointerValue<Nat>(a).limbs), $.len($.pointerValue<Nat>(m).limbs))
	u = Nat.prototype.expand.call(Nat.prototype.set.call(NewNat(), a), size)
	let v: Nat | $.VarRef<Nat> | null = Nat.prototype.expand.call(Nat.prototype.set.call(NewNat(), m), size)

	A = Nat.prototype.reset.call(NewNat(), $.len($.pointerValue<Nat>(m).limbs))
	$.pointerValue<Nat>(A).limbs![0] = 1
	let B: Nat | $.VarRef<Nat> | null = Nat.prototype.reset.call(NewNat(), $.len($.pointerValue<Nat>(a).limbs))
	let C: Nat | $.VarRef<Nat> | null = Nat.prototype.reset.call(NewNat(), $.len($.pointerValue<Nat>(m).limbs))
	let D: Nat | $.VarRef<Nat> | null = Nat.prototype.reset.call(NewNat(), $.len($.pointerValue<Nat>(a).limbs))
	$.pointerValue<Nat>(D).limbs![0] = 1

	// Before and after each loop iteration, the following hold:
	//
	//   u = A*a - B*m
	//   v = D*m - C*a
	//   0 < u <= a
	//   0 <= v <= m
	//   0 <= A < m
	//   0 <= B <= a
	//   0 <= C < m
	//   0 <= D <= a
	//
	// After each loop iteration, u and v only get smaller, and at least one of
	// them shrinks by at least a factor of two.
	while (true) {
		// If both u and v are odd, subtract the smaller from the larger.
		// If u = v, we need to subtract from v to hit the modified exit condition.
		if ((Nat.prototype.IsOdd.call(u) == 1) && (Nat.prototype.IsOdd.call(v) == 1)) {
			if (Nat.prototype.cmpGeq.call(v, u) == 0) {
				Nat.prototype.sub.call(u, v)
				Nat.prototype.Add.call(A, C, new Modulus({nat: m}))
				Nat.prototype.Add.call(B, D, new Modulus({nat: a}))
			} else {
				Nat.prototype.sub.call(v, u)
				Nat.prototype.Add.call(C, A, new Modulus({nat: m}))
				Nat.prototype.Add.call(D, B, new Modulus({nat: a}))
			}
		}

		// Exactly one of u and v is now even.
		if (Nat.prototype.IsOdd.call(u) == Nat.prototype.IsOdd.call(v)) {
			$.panic("bigmod: internal error: u and v are not in the expected state")
		}

		// Halve the even one and adjust the corresponding coefficient.
		if (Nat.prototype.IsOdd.call(u) == 0) {
			rshift1(u, 0)
			if ((Nat.prototype.IsOdd.call(A) == 1) || (Nat.prototype.IsOdd.call(B) == 1)) {
				rshift1(A, Nat.prototype.add.call(A, m))
				rshift1(B, Nat.prototype.add.call(B, a))
			} else {
				rshift1(A, 0)
				rshift1(B, 0)
			}
		} else {
			rshift1(v, 0)
			if ((Nat.prototype.IsOdd.call(C) == 1) || (Nat.prototype.IsOdd.call(D) == 1)) {
				rshift1(C, Nat.prototype.add.call(C, m))
				rshift1(D, Nat.prototype.add.call(D, a))
			} else {
				rshift1(C, 0)
				rshift1(D, 0)
			}
		}

		if (Nat.prototype.IsZero.call(v) == 1) {
			return [u, A, null]
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function rshift1(a: Nat | $.VarRef<Nat> | null, carry: number): void {
	let size = $.len($.pointerValue<Nat>(a).limbs)
	let aLimbs: $.Slice<number> = $.goSlice($.pointerValue<Nat>(a).limbs, undefined, size)

	for (let i = 0; i < size; i++) {
		aLimbs![i] = $.uint($.uint64Shr(aLimbs![i], 1), 64)
		if ((i + 1) < size) {
			aLimbs![i] = $.uint($.uint64Or(aLimbs![i], $.uint($.uint64Mul($.arrayIndex(aLimbs!, i + 1), (2 ** 63)), 64)), 64)
		} else {
			aLimbs![i] = $.uint($.uint64Or(aLimbs![i], $.uint($.uint64Mul(carry, (2 ** 63)), 64)), 64)
		}
	}
}

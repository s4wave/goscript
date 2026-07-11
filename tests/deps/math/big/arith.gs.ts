// Generated file based on arith.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"

import "@goscript/unsafe/index.js"
import "@goscript/math/bits/index.js"

export type Word = number

export const _S: number = 8

export const _W: number = 64

export const _B: number = 18446744073709551616

export const _M: number = 18446744073709551615

export function mulWW(x: Word, y: Word): [Word, Word] {
	let z1: Word = 0
	let z0: Word = 0
	let [hi, lo] = bits.Mul($.uint(x, 64), $.uint(y, 64))
	return [$.uint(hi, 64), $.uint(lo, 64)]
}

export function mulAddWWW_g(x: Word, y: Word, c: Word): [Word, Word] {
	let z1: Word = 0
	let z0: Word = 0
	let [hi, lo] = bits.Mul($.uint(x, 64), $.uint(y, 64))
	let cc: number = 0
	let __goscriptTuple0: any = bits.Add(lo, $.uint(c, 64), 0)
	lo = __goscriptTuple0[0]
	cc = __goscriptTuple0[1]
	return [$.uint($.uint($.uint64Add(hi, cc), 64), 64), $.uint(lo, 64)]
}

export function nlz(x: Word): number {
	return $.uint(bits.LeadingZeros($.uint(x, 64)), 64)
}

export function addVV_g(z: $.Slice<Word>, x: $.Slice<Word>, y: $.Slice<Word>): Word {
	let c: Word = 0
	if (($.len(x) != $.len(z)) || ($.len(y) != $.len(z))) {
		$.panic("addVV len")
	}

	for (let __goscriptRangeTarget0 = z, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let [zi, cc] = bits.Add($.uint($.arrayIndex(x!, i), 64), $.uint($.arrayIndex(y!, i), 64), $.uint(c, 64))
		z![i] = $.uint(zi, 64)
		c = $.uint(cc, 64)
	}
	return c
}

export function subVV_g(z: $.Slice<Word>, x: $.Slice<Word>, y: $.Slice<Word>): Word {
	let c: Word = 0
	if (($.len(x) != $.len(z)) || ($.len(y) != $.len(z))) {
		$.panic("subVV len")
	}

	for (let __goscriptRangeTarget1 = z, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		let [zi, cc] = bits.Sub($.uint($.arrayIndex(x!, i), 64), $.uint($.arrayIndex(y!, i), 64), $.uint(c, 64))
		z![i] = $.uint(zi, 64)
		c = $.uint(cc, 64)
	}
	return c
}

export function addVW(z: $.Slice<Word>, x: $.Slice<Word>, y: Word): Word {
	let c: Word = 0
	if ($.len(x) != $.len(z)) {
		$.panic("addVW len")
	}

	if ($.len(z) == 0) {
		return y
	}
	let [zi, cc] = bits.Add($.uint($.arrayIndex(x!, 0), 64), $.uint(y, 64), 0)
	z![0] = $.uint(zi, 64)
	if (cc == 0) {
		if ($.indexAddress(z!, 0) != $.indexAddress(x!, 0)) {
			$.copy($.goSlice(z, 1, undefined), $.goSlice(x, 1, undefined))
		}
		return 0
	}
	for (let i = 1; i < $.len(z); i++) {
		let xi = $.arrayIndex(x!, i)
		if (xi != $.uint("18446744073709551615", 64)) {
			z![i] = $.uint($.uint64Add(xi, 1n), 64)
			if ($.indexAddress(z!, 0) != $.indexAddress(x!, 0)) {
				$.copy($.goSlice(z, i + 1, undefined), $.goSlice(x, i + 1, undefined))
			}
			return 0
		}
		z![i] = 0
	}
	return 1
}

export function addVW_ref(z: $.Slice<Word>, x: $.Slice<Word>, y: Word): Word {
	let c: Word = 0
	c = y
	for (let __goscriptRangeTarget2 = z, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
		let [zi, cc] = bits.Add($.uint($.arrayIndex(x!, i), 64), $.uint(c, 64), 0)
		z![i] = $.uint(zi, 64)
		c = $.uint(cc, 64)
	}
	return c
}

export function subVW(z: $.Slice<Word>, x: $.Slice<Word>, y: Word): Word {
	let c: Word = 0
	if ($.len(x) != $.len(z)) {
		$.panic("subVW len")
	}

	if ($.len(z) == 0) {
		return y
	}
	let [zi, cc] = bits.Sub($.uint($.arrayIndex(x!, 0), 64), $.uint(y, 64), 0)
	z![0] = $.uint(zi, 64)
	if (cc == 0) {
		if ($.indexAddress(z!, 0) != $.indexAddress(x!, 0)) {
			$.copy($.goSlice(z, 1, undefined), $.goSlice(x, 1, undefined))
		}
		return 0
	}
	for (let i = 1; i < $.len(z); i++) {
		let xi = $.arrayIndex(x!, i)
		if (xi != 0) {
			z![i] = $.uint($.uint64Sub(xi, 1n), 64)
			if ($.indexAddress(z!, 0) != $.indexAddress(x!, 0)) {
				$.copy($.goSlice(z, i + 1, undefined), $.goSlice(x, i + 1, undefined))
			}
			return 0
		}
		z![i] = $.uint("18446744073709551615", 64)
	}
	return 1
}

export function subVW_ref(z: $.Slice<Word>, x: $.Slice<Word>, y: Word): Word {
	let c: Word = 0
	c = y
	for (let __goscriptRangeTarget3 = z, i = 0; i < $.len(__goscriptRangeTarget3); i++) {
		let [zi, cc] = bits.Sub($.uint($.arrayIndex(x!, i), 64), $.uint(c, 64), 0)
		z![i] = $.uint(zi, 64)
		c = $.uint(cc, 64)
	}
	return c
}

export function lshVU_g(z: $.Slice<Word>, x: $.Slice<Word>, s: number): Word {
	let c: Word = 0
	if ($.len(x) != $.len(z)) {
		$.panic("lshVU len")
	}

	if (s == 0) {
		$.copy(z, x)
		return c
	}
	if ($.len(z) == 0) {
		return c
	}
	s = $.uint($.uint64And(s, $.uint($.uint64Sub(64n, 1n), 64)), 64)
	let _u15d = $.uint($.uint64Sub(64n, s), 64)
	_u15d = $.uint($.uint64And(_u15d, $.uint($.uint64Sub(64n, 1n), 64)), 64)
	c = $.uint($.uint64Shr($.arrayIndex(x!, $.len(z) - 1), _u15d), 64)
	for (let i = $.len(z) - 1; i > 0; i--) {
		z![i] = $.uint($.uint64Or(($.uint($.uint64Shl($.arrayIndex(x!, i), s), 64)), ($.uint($.uint64Shr($.arrayIndex(x!, i - 1), _u15d), 64))), 64)
	}
	z![0] = $.uint($.uint64Shl($.arrayIndex(x!, 0), s), 64)
	return c
}

export function rshVU_g(z: $.Slice<Word>, x: $.Slice<Word>, s: number): Word {
	let c: Word = 0
	if ($.len(x) != $.len(z)) {
		$.panic("rshVU len")
	}

	if (s == 0) {
		$.copy(z, x)
		return c
	}
	if ($.len(z) == 0) {
		return c
	}
	s = $.uint($.uint64And(s, $.uint($.uint64Sub(64n, 1n), 64)), 64)
	let _u15d = $.uint($.uint64Sub(64n, s), 64)
	_u15d = $.uint($.uint64And(_u15d, $.uint($.uint64Sub(64n, 1n), 64)), 64)
	c = $.uint($.uint64Shl($.arrayIndex(x!, 0), _u15d), 64)
	for (let i = 1; i < $.len(z); i++) {
		z![i - 1] = $.uint($.uint64Or(($.uint($.uint64Shr($.arrayIndex(x!, i - 1), s), 64)), ($.uint($.uint64Shl($.arrayIndex(x!, i), _u15d), 64))), 64)
	}
	z![$.len(z) - 1] = $.uint($.uint64Shr($.arrayIndex(x!, $.len(z) - 1), s), 64)
	return c
}

export function mulAddVWW_g(z: $.Slice<Word>, x: $.Slice<Word>, y: Word, r: Word): Word {
	let c: Word = 0
	if ($.len(x) != $.len(z)) {
		$.panic("mulAddVWW len")
	}
	c = r
	for (let __goscriptRangeTarget4 = z, i = 0; i < $.len(__goscriptRangeTarget4); i++) {
		let __goscriptTuple1: any = mulAddWWW_g($.arrayIndex(x!, i), y, c)
		c = __goscriptTuple1[0]
		z![i] = __goscriptTuple1[1]
	}
	return c
}

export function addMulVVWW_g(z: $.Slice<Word>, x: $.Slice<Word>, y: $.Slice<Word>, m: Word, a: Word): Word {
	let c: Word = 0
	if (($.len(x) != $.len(z)) || ($.len(y) != $.len(z))) {
		$.panic("rshVU len")
	}

	c = a
	for (let __goscriptRangeTarget5 = z, i = 0; i < $.len(__goscriptRangeTarget5); i++) {
		let [z1, z0] = mulAddWWW_g($.arrayIndex(y!, i), m, $.arrayIndex(x!, i))
		let [lo, cc] = bits.Add($.uint(z0, 64), $.uint(c, 64), 0)
		let __goscriptAssign0_0: Word = $.uint(cc, 64)
		let __goscriptAssign0_1: Word = $.uint(lo, 64)
		c = __goscriptAssign0_0
		z![i] = __goscriptAssign0_1
		c = $.uint($.uint64Add(c, z1), 64)
	}
	return c
}

export function divWW(x1: Word, x0: Word, y: Word, m: Word): [Word, Word] {
	let q: Word = 0
	let r: Word = 0
	let s = nlz(y)
	if (s != 0) {
		x1 = $.uint($.uint64Or(($.uint($.uint64Shl(x1, s), 64)), ($.uint($.uint64Shr(x0, ($.uint($.uint64Sub(64n, s), 64))), 64))), 64)
		x0 = $.uint($.uint64Shl(x0, s), 64)
		y = $.uint($.uint64Shl(y, s), 64)
	}
	let d = $.uint(y, 64)
	// We know that
	//   m = ⎣(B^2-1)/d⎦-B
	//   ⎣(B^2-1)/d⎦ = m+B
	//   (B^2-1)/d = m+B+delta1    0 <= delta1 <= (d-1)/d
	//   B^2/d = m+B+delta2        0 <= delta2 <= 1
	// The quotient we're trying to compute is
	//   quotient = ⎣(x1*B+x0)/d⎦
	//            = ⎣(x1*B*(B^2/d)+x0*(B^2/d))/B^2⎦
	//            = ⎣(x1*B*(m+B+delta2)+x0*(m+B+delta2))/B^2⎦
	//            = ⎣(x1*m+x1*B+x0)/B + x0*m/B^2 + delta2*(x1*B+x0)/B^2⎦
	// The latter two terms of this three-term sum are between 0 and 1.
	// So we can compute just the first term, and we will be low by at most 2.
	let [t1, t0] = bits.Mul($.uint(m, 64), $.uint(x1, 64))
	let [, c] = bits.Add(t0, $.uint(x0, 64), 0)
	let __goscriptTuple2: any = bits.Add(t1, $.uint(x1, 64), c)
	t1 = __goscriptTuple2[0]
	// The quotient is either t1, t1+1, or t1+2.
	// We'll try t1 and adjust if needed.
	let qq = t1
	// compute remainder r=x-d*q.
	let [dq1, dq0] = bits.Mul(d, qq)
	let [r0, b] = bits.Sub($.uint(x0, 64), dq0, 0)
	let [r1, ] = bits.Sub($.uint(x1, 64), dq1, b)
	// The remainder we just computed is bounded above by B+d:
	// r = x1*B + x0 - d*q.
	//   = x1*B + x0 - d*⎣(x1*m+x1*B+x0)/B⎦
	//   = x1*B + x0 - d*((x1*m+x1*B+x0)/B-alpha)                                   0 <= alpha < 1
	//   = x1*B + x0 - x1*d/B*m                         - x1*d - x0*d/B + d*alpha
	//   = x1*B + x0 - x1*d/B*⎣(B^2-1)/d-B⎦             - x1*d - x0*d/B + d*alpha
	//   = x1*B + x0 - x1*d/B*⎣(B^2-1)/d-B⎦             - x1*d - x0*d/B + d*alpha
	//   = x1*B + x0 - x1*d/B*((B^2-1)/d-B-beta)        - x1*d - x0*d/B + d*alpha   0 <= beta < 1
	//   = x1*B + x0 - x1*B + x1/B + x1*d + x1*d/B*beta - x1*d - x0*d/B + d*alpha
	//   =        x0        + x1/B        + x1*d/B*beta        - x0*d/B + d*alpha
	//   = x0*(1-d/B) + x1*(1+d*beta)/B + d*alpha
	//   <  B*(1-d/B) +  d*B/B          + d          because x0<B (and 1-d/B>0), x1<d, 1+d*beta<=B, alpha<1
	//   =  B - d     +  d              + d
	//   = B+d
	// So r1 can only be 0 or 1. If r1 is 1, then we know q was too small.
	// Add 1 to q and subtract d from r. That guarantees that r is <B, so
	// we no longer need to keep track of r1.
	if (r1 != 0) {
		qq++
		r0 = $.uint($.uint64Sub(r0, d), 64)
	}
	// If the remainder is still too large, increment q one more time.
	if (r0 >= d) {
		qq++
		r0 = $.uint($.uint64Sub(r0, d), 64)
	}
	return [$.uint(qq, 64), $.uint($.uint($.uint64Shr(r0, s), 64), 64)]
}

export function reciprocalWord(d1: Word): Word {
	let u = $.uint($.uint($.uint64Shl(d1, nlz(d1)), 64), 64)
	let x1 = $.uint($.uint64Xor(u, -1n), 64)
	let x0 = $.uint("18446744073709551615", 64)
	let [rec, ] = bits.Div(x1, x0, u)
	return $.uint(rec, 64)
}

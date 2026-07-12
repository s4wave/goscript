// Generated file based on field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sha3 from "@goscript/crypto/internal/fips140/sha3/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as errors from "@goscript/errors/index.js"

import * as __goscript_mlkem768 from "./mlkem768.gs.ts"
import "@goscript/crypto/internal/fips140/sha3/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/errors/index.js"
import "./mlkem768.gs.ts"

export type fieldElement = number

export type ringElement = fieldElement[]

export type nttElement = fieldElement[]

export const barrettMultiplier: number = 5039

export const barrettShift: number = 24

export function fieldCheckReduced(a: number): [fieldElement, $.GoError] {
	if ($.uint(a, 16) >= $.uint(3329, 16)) {
		return [$.uint(0, 16), errors.New("unreduced field element")]
	}
	return [$.uint($.uint(a, 16), 16), null]
}

export function fieldReduceOnce(a: number): fieldElement {
	let x = $.uint(a - 3329, 16)
	// If x underflowed, then x >= 2¹⁶ - q > 2¹⁵, so the top bit is set.
	x = x + ($.uint(($.uintShr(x, 15, 16)) * 3329, 16))
	return $.uint($.uint(x, 16), 16)
}

export function fieldAdd(a: fieldElement, b: fieldElement): fieldElement {
	let x = $.uint($.uint(a + b, 16), 16)
	return $.uint(fieldReduceOnce($.uint(x, 16)), 16)
}

export function fieldSub(a: fieldElement, b: fieldElement): fieldElement {
	let x = $.uint($.uint((a - b) + 3329, 16), 16)
	return $.uint(fieldReduceOnce($.uint(x, 16)), 16)
}

export function fieldReduce(a: number): fieldElement {
	let quotient = $.uint($.uint($.uint64Shr(($.uint64Mul($.uint64(a), 5039n)), 24n), 32), 32)
	return $.uint(fieldReduceOnce($.uint($.uint(a - (Math.imul(quotient, 3329) >>> 0), 16), 16)), 16)
}

export function fieldMul(a: fieldElement, b: fieldElement): fieldElement {
	let x = $.uint(Math.imul($.uint(a, 32), $.uint(b, 32)) >>> 0, 32)
	return $.uint(fieldReduce($.uint(x, 32)), 16)
}

export function fieldMulSub(a: fieldElement, b: fieldElement, c: fieldElement): fieldElement {
	let x = $.uint(Math.imul($.uint(a, 32), $.uint((b - c) + 3329, 32)) >>> 0, 32)
	return $.uint(fieldReduce($.uint(x, 32)), 16)
}

export function fieldAddMul(a: fieldElement, b: fieldElement, c: fieldElement, d: fieldElement): fieldElement {
	let x = $.uint(Math.imul($.uint(a, 32), $.uint(b, 32)) >>> 0, 32)
	x = x + ($.uint(Math.imul($.uint(c, 32), $.uint(d, 32)) >>> 0, 32))
	return $.uint(fieldReduce($.uint(x, 32)), 16)
}

export function compress(x: fieldElement, d: number): number {
	// We want to compute (x * 2ᵈ) / q, rounded to nearest integer, with 1/2
	// rounding up (see FIPS 203, Section 2.3).

	// Barrett reduction produces a quotient and a remainder in the range [0, 2q),
	// such that dividend = quotient * q + remainder.
	let dividend = $.uint($.uint(x, 32) << d, 32)
	let quotient = $.uint($.uint($.uint64Shr(($.uint64Mul($.uint64(dividend), 5039n)), 24n), 32), 32)
	let remainder = $.uint(dividend - (Math.imul(quotient, 3329) >>> 0), 32)

	// Since the remainder is in the range [0, 2q), not [0, q), we need to
	// portion it into three spans for rounding.
	//
	//     [ 0,       q/2     ) -> round to 0
	//     [ q/2,     q + q/2 ) -> round to 1
	//     [ q + q/2, 2q      ) -> round to 2
	//
	// We can convert that to the following logic: add 1 if remainder > q/2,
	// then add 1 again if remainder > q + q/2.
	//
	// Note that if remainder > x, then ⌊x⌋ - remainder underflows, and the top
	// bit of the difference will be set.
	quotient = quotient + ($.uint(($.uintShr(((Math.trunc(3329 / 2)) - remainder), 31, 32)) & 1, 32))
	quotient = quotient + ($.uint(($.uintShr(((3329 + (Math.trunc(3329 / 2))) - remainder), 31, 32)) & 1, 32))

	// quotient might have overflowed at this point, so reduce it by masking.
	let mask: number = $.uint((1 << d) - 1, 32)
	return $.uint($.uint(quotient & mask, 16), 16)
}

export function decompress(y: number, d: number): fieldElement {
	// We want to compute (y * q) / 2ᵈ, rounded to nearest integer, with 1/2
	// rounding up (see FIPS 203, Section 2.3).

	let dividend = $.uint(Math.imul($.uint(y, 32), 3329) >>> 0, 32)
	let quotient = $.uint($.uintShr(dividend, d, 32), 32)

	// The d'th least-significant bit of the dividend (the most significant bit
	// of the remainder) is 1 for the top half of the values that divide to the
	// same quotient, which are the ones that round up.
	quotient = quotient + ($.uint(($.uintShr(dividend, (d - 1), 32)) & 1, 32))

	// quotient is at most (2¹¹-1) * q / 2¹¹ + 1 = 3328, so it didn't overflow.
	return $.uint($.uint(quotient, 16), 16)
}

export function polyAdd(__typeArgs: $.GenericTypeArgs | undefined, a: any, b: any): any {
	let s: any = $.genericZero(__typeArgs, "T", null)
	for (let __goscriptRangeTarget0 = s, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		s![i] = $.uint(fieldAdd($.uint($.arrayIndex(a!, i), 16), $.uint($.arrayIndex(b!, i), 16)), 16)
	}
	return s
}

export function polySub(__typeArgs: $.GenericTypeArgs | undefined, a: any, b: any): any {
	let s: any = $.genericZero(__typeArgs, "T", null)
	for (let __goscriptRangeTarget1 = s, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		s![i] = $.uint(fieldSub($.uint($.arrayIndex(a!, i), 16), $.uint($.arrayIndex(b!, i), 16)), 16)
	}
	return s
}

export function polyByteEncode(__typeArgs: $.GenericTypeArgs | undefined, b: $.Slice<number>, f: any): $.Slice<number> {
	let __goscriptTuple0: any = sliceForAppend(b, 384)
	let out: $.Slice<number> = __goscriptTuple0[0]
	let B: $.Slice<number> = __goscriptTuple0[1]
	for (let i = 0; i < 256; i = i + (2)) {
		let x = $.uint($.uint($.arrayIndex(f!, i), 32) | ($.uint($.arrayIndex(f!, i + 1), 32) << 12), 32)
		B![0] = $.uint($.uint(x, 8), 8)
		B![1] = $.uint($.uint($.uintShr(x, 8, 32), 8), 8)
		B![2] = $.uint($.uint($.uintShr(x, 16, 32), 8), 8)
		B = $.goSlice(B, 3, undefined)
	}
	return out
}

export function polyByteDecode(__typeArgs: $.GenericTypeArgs | undefined, b: $.Slice<number>): [any, $.GoError] {
	if ($.len(b) != 384) {
		return [$.genericZero(__typeArgs, "T", null), errors.New("mlkem: invalid encoding length")]
	}
	let f: any = $.genericZero(__typeArgs, "T", null)
	for (let i = 0; i < 256; i = i + (2)) {
		let d = $.uint(($.uint($.arrayIndex(b!, 0), 32) | ($.uint($.arrayIndex(b!, 1), 32) << 8)) | ($.uint($.arrayIndex(b!, 2), 32) << 16), 32)
		const mask12: number = 4095
		let err: $.GoError = null as $.GoError
		{
			let __goscriptTuple1: any = fieldCheckReduced($.uint($.uint(d & 4095, 16), 16))
			f![i] = $.uint(__goscriptTuple1[0], 16)
			err = __goscriptTuple1[1]
			if (err != null) {
				return [$.genericZero(__typeArgs, "T", null), errors.New("mlkem: invalid polynomial encoding")]
			}
		}
		{
			let __goscriptTuple2: any = fieldCheckReduced($.uint($.uint($.uintShr(d, 12, 32), 16), 16))
			f![i + 1] = $.uint(__goscriptTuple2[0], 16)
			err = __goscriptTuple2[1]
			if (err != null) {
				return [$.genericZero(__typeArgs, "T", null), errors.New("mlkem: invalid polynomial encoding")]
			}
		}
		b = $.goSlice(b, 3, undefined)
	}
	return [f, null]
}

export function sliceForAppend(_in: $.Slice<number>, n: number): [$.Slice<number>, $.Slice<number>] {
	let head: $.Slice<number> = null as $.Slice<number>
	let tail: $.Slice<number> = null as $.Slice<number>
	{
		let total = $.len(_in) + n
		if ($.cap(_in) >= total) {
			head = $.goSlice(_in, undefined, total)
		} else {
			head = $.makeSlice<number>(total, undefined, "byte")
			$.copy(head, _in)
		}
	}
	tail = $.goSlice(head, $.len(_in), undefined)
	return [head, tail]
}

export function ringCompressAndEncode1(s: $.Slice<number>, f: ringElement): $.Slice<number> {
	let __goscriptTuple3: any = sliceForAppend(s, 32)
	s = __goscriptTuple3[0]
	let b: $.Slice<number> = __goscriptTuple3[1]
	$.clear(b)
	for (let __goscriptRangeTarget2 = f, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
		b![Math.trunc(i / 8)] = b![Math.trunc(i / 8)] | ($.uint($.uint(compress($.uint($.arrayIndex(f, i), 16), $.uint(1, 8)) << (i % 8), 8), 8))
	}
	return s
}

export function ringDecodeAndDecompress1(b: $.VarRef<Uint8Array> | null): ringElement {
	let f: ringElement = Array.from({ length: 256 }, () => 0)
	for (let __goscriptRangeTarget3 = f, i = 0; i < $.len(__goscriptRangeTarget3); i++) {
		let b_i = $.uint(($.uintShr($.arrayIndex($.pointerValue<Uint8Array>(b), Math.trunc(i / 8)), (i % 8), 8)) & 1, 8)
		const halfQ: number = 1665
		f[i] = $.uint($.uint(b_i, 16) * 1665, 16)
	}
	return f
}

export function ringCompressAndEncode4(s: $.Slice<number>, f: ringElement): $.Slice<number> {
	let __goscriptTuple4: any = sliceForAppend(s, 128)
	s = __goscriptTuple4[0]
	let b: $.Slice<number> = __goscriptTuple4[1]
	for (let i = 0; i < 256; i = i + (2)) {
		b![Math.trunc(i / 2)] = $.uint($.uint(compress($.uint($.arrayIndex(f, i), 16), $.uint(4, 8)) | (compress($.uint($.arrayIndex(f, i + 1), 16), $.uint(4, 8)) << 4), 8), 8)
	}
	return s
}

export function ringDecodeAndDecompress4(b: $.VarRef<Uint8Array> | null): ringElement {
	let f: ringElement = Array.from({ length: 256 }, () => 0)
	for (let i = 0; i < 256; i = i + (2)) {
		f[i] = $.uint($.uint(decompress($.uint($.uint($.arrayIndex($.pointerValue<Uint8Array>(b), Math.trunc(i / 2)) & 0b1111, 16), 16), $.uint(4, 8)), 16), 16)
		f[i + 1] = $.uint($.uint(decompress($.uint($.uint($.uintShr($.arrayIndex($.pointerValue<Uint8Array>(b), Math.trunc(i / 2)), 4, 8), 16), 16), $.uint(4, 8)), 16), 16)
	}
	return f
}

export function ringCompressAndEncode10(s: $.Slice<number>, f: ringElement): $.Slice<number> {
	let __goscriptTuple5: any = sliceForAppend(s, 320)
	s = __goscriptTuple5[0]
	let b: $.Slice<number> = __goscriptTuple5[1]
	for (let i = 0; i < 256; i = i + (4)) {
		let x: bigint = 0n
		x = $.uint64Or(x, $.uint64(compress($.uint($.arrayIndex(f, i), 16), $.uint(10, 8))))
		x = $.uint64Or(x, $.uint64Shl($.uint64(compress($.uint($.arrayIndex(f, i + 1), 16), $.uint(10, 8))), 10n))
		x = $.uint64Or(x, $.uint64Shl($.uint64(compress($.uint($.arrayIndex(f, i + 2), 16), $.uint(10, 8))), 20n))
		x = $.uint64Or(x, $.uint64Shl($.uint64(compress($.uint($.arrayIndex(f, i + 3), 16), $.uint(10, 8))), 30n))
		b![0] = $.uint($.uint(x, 8), 8)
		b![1] = $.uint($.uint($.uint64Shr(x, 8n), 8), 8)
		b![2] = $.uint($.uint($.uint64Shr(x, 16n), 8), 8)
		b![3] = $.uint($.uint($.uint64Shr(x, 24n), 8), 8)
		b![4] = $.uint($.uint($.uint64Shr(x, 32n), 8), 8)
		b = $.goSlice(b, 5, undefined)
	}
	return s
}

export function ringDecodeAndDecompress10(bb: $.VarRef<Uint8Array> | null): ringElement {
	let b: $.Slice<number> = $.goSlice($.pointerValue<Uint8Array>(bb), undefined, undefined)
	let f: ringElement = Array.from({ length: 256 }, () => 0)
	for (let i = 0; i < 256; i = i + (4)) {
		let x = $.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or($.uint64($.arrayIndex(b!, 0)), ($.uint64Shl($.uint64($.arrayIndex(b!, 1)), 8n)))), ($.uint64Shl($.uint64($.arrayIndex(b!, 2)), 16n)))), ($.uint64Shl($.uint64($.arrayIndex(b!, 3)), 24n)))), ($.uint64Mul($.uint64($.arrayIndex(b!, 4)), (2 ** 32))))
		b = $.goSlice(b, 5, undefined)
		f[i] = $.uint($.uint(decompress($.uint($.uint($.uint64And(($.uint64Shr(x, 0n)), 1023n), 16), 16), $.uint(10, 8)), 16), 16)
		f[i + 1] = $.uint($.uint(decompress($.uint($.uint($.uint64And(($.uint64Shr(x, 10n)), 1023n), 16), 16), $.uint(10, 8)), 16), 16)
		f[i + 2] = $.uint($.uint(decompress($.uint($.uint($.uint64And(($.uint64Shr(x, 20n)), 1023n), 16), 16), $.uint(10, 8)), 16), 16)
		f[i + 3] = $.uint($.uint(decompress($.uint($.uint($.uint64And(($.uint64Shr(x, 30n)), 1023n), 16), 16), $.uint(10, 8)), 16), 16)
	}
	return f
}

export function ringCompressAndEncode(s: $.Slice<number>, f: ringElement, d: number): $.Slice<number> {
	let b: number = 0
	let bIdx: number = 0
	for (let i = 0; i < 256; i++) {
		let c = $.uint(compress($.uint($.arrayIndex(f, i), 16), $.uint(d, 8)), 16)
		let cIdx: number = 0
		while ($.uint(cIdx, 8) < $.uint(d, 8)) {
			b = b | ($.uint($.uint($.uintShr(c, cIdx, 16), 8) << bIdx, 8))
			let bits = $.uint($.min($.uint(8 - bIdx, 8), $.uint(d - cIdx, 8)), 8)
			bIdx = bIdx + ($.uint(bits, 8))
			cIdx = cIdx + ($.uint(bits, 8))
			if ($.uint(bIdx, 8) == $.uint(8, 8)) {
				s = $.append(s, $.uint(b, 8), $.byteSliceHint)
				b = $.uint(0, 8)
				bIdx = $.uint(0, 8)
			}
		}
	}
	if ($.uint(bIdx, 8) != $.uint(0, 8)) {
		$.panic("mlkem: internal error: bitsFilled != 0")
	}
	return s
}

export function ringDecodeAndDecompress(b: $.Slice<number>, d: number): ringElement {
	let f: ringElement = Array.from({ length: 256 }, () => 0)
	let bIdx: number = 0
	for (let i = 0; i < 256; i++) {
		let c: number = 0
		let cIdx: number = 0
		while ($.uint(cIdx, 8) < $.uint(d, 8)) {
			c = c | ($.uint($.uint($.uintShr($.arrayIndex(b!, 0), bIdx, 8), 16) << cIdx, 16))
			c = c & ($.uint((1 << d) - 1, 16))
			let bits = $.uint($.min($.uint(8 - bIdx, 8), $.uint(d - cIdx, 8)), 8)
			bIdx = bIdx + ($.uint(bits, 8))
			cIdx = cIdx + ($.uint(bits, 8))
			if ($.uint(bIdx, 8) == $.uint(8, 8)) {
				b = $.goSlice(b, 1, undefined)
				bIdx = $.uint(0, 8)
			}
		}
		f[i] = $.uint($.uint(decompress($.uint(c, 16), $.uint(d, 8)), 16), 16)
	}
	if ($.len(b) != 0) {
		$.panic("mlkem: internal error: leftover bytes")
	}
	return f
}

export function ringCompressAndEncode5(s: $.Slice<number>, f: ringElement): $.Slice<number> {
	return ringCompressAndEncode(s, f, $.uint(5, 8))
}

export function ringDecodeAndDecompress5(bb: $.VarRef<Uint8Array> | null): ringElement {
	return ringDecodeAndDecompress($.goSlice($.pointerValue<Uint8Array>(bb), undefined, undefined), $.uint(5, 8))
}

export function ringCompressAndEncode11(s: $.Slice<number>, f: ringElement): $.Slice<number> {
	return ringCompressAndEncode(s, f, $.uint(11, 8))
}

export function ringDecodeAndDecompress11(bb: $.VarRef<Uint8Array> | null): ringElement {
	return ringDecodeAndDecompress($.goSlice($.pointerValue<Uint8Array>(bb), undefined, undefined), $.uint(11, 8))
}

export function samplePolyCBD(s: $.Slice<number>, b: number): ringElement {
	let prf: sha3.SHAKE | $.VarRef<sha3.SHAKE> | null = sha3.NewShake256()
	sha3.SHAKE.prototype.Write.call(prf, s)
	sha3.SHAKE.prototype.Write.call(prf, new Uint8Array([b]) as $.Slice<number>)
	let B: $.Slice<number> = $.makeSlice<number>(64 * 2, undefined, "byte")
	sha3.SHAKE.prototype.Read.call(prf, B)

	// SamplePolyCBD simply draws four (2η) bits for each coefficient, and adds
	// the first two and subtracts the last two.

	let f: ringElement = Array.from({ length: 256 }, () => 0)
	for (let i = 0; i < 256; i = i + (2)) {
		let __goscriptShadow0 = $.uint($.arrayIndex(B!, Math.trunc(i / 2)), 8)
		let b_7 = $.uint($.uintShr(__goscriptShadow0, 7, 8), 8)
		let b_6 = $.uint(($.uintShr(__goscriptShadow0, 6, 8)) & 1, 8)
		let b_5 = $.uint(($.uintShr(__goscriptShadow0, 5, 8)) & 1, 8)
		let b_4 = $.uint(($.uintShr(__goscriptShadow0, 4, 8)) & 1, 8)
		let b_3 = $.uint(($.uintShr(__goscriptShadow0, 3, 8)) & 1, 8)
		let b_2 = $.uint(($.uintShr(__goscriptShadow0, 2, 8)) & 1, 8)
		let b_1 = $.uint(($.uintShr(__goscriptShadow0, 1, 8)) & 1, 8)
		let b_0 = $.uint(__goscriptShadow0 & 1, 8)
		f[i] = $.uint(fieldSub($.uint($.uint(b_0 + b_1, 16), 16), $.uint($.uint(b_2 + b_3, 16), 16)), 16)
		f[i + 1] = $.uint(fieldSub($.uint($.uint(b_4 + b_5, 16), 16), $.uint($.uint(b_6 + b_7, 16), 16)), 16)
	}
	return f
}

export var gammas: fieldElement[]

export function __goscript_init_gammas(): void {
	if (((gammas) as any) === undefined) {
		gammas = [$.uint(17, 16), $.uint(3312, 16), $.uint(2761, 16), $.uint(568, 16), $.uint(583, 16), $.uint(2746, 16), $.uint(2649, 16), $.uint(680, 16), $.uint(1637, 16), $.uint(1692, 16), $.uint(723, 16), $.uint(2606, 16), $.uint(2288, 16), $.uint(1041, 16), $.uint(1100, 16), $.uint(2229, 16), $.uint(1409, 16), $.uint(1920, 16), $.uint(2662, 16), $.uint(667, 16), $.uint(3281, 16), $.uint(48, 16), $.uint(233, 16), $.uint(3096, 16), $.uint(756, 16), $.uint(2573, 16), $.uint(2156, 16), $.uint(1173, 16), $.uint(3015, 16), $.uint(314, 16), $.uint(3050, 16), $.uint(279, 16), $.uint(1703, 16), $.uint(1626, 16), $.uint(1651, 16), $.uint(1678, 16), $.uint(2789, 16), $.uint(540, 16), $.uint(1789, 16), $.uint(1540, 16), $.uint(1847, 16), $.uint(1482, 16), $.uint(952, 16), $.uint(2377, 16), $.uint(1461, 16), $.uint(1868, 16), $.uint(2687, 16), $.uint(642, 16), $.uint(939, 16), $.uint(2390, 16), $.uint(2308, 16), $.uint(1021, 16), $.uint(2437, 16), $.uint(892, 16), $.uint(2388, 16), $.uint(941, 16), $.uint(733, 16), $.uint(2596, 16), $.uint(2337, 16), $.uint(992, 16), $.uint(268, 16), $.uint(3061, 16), $.uint(641, 16), $.uint(2688, 16), $.uint(1584, 16), $.uint(1745, 16), $.uint(2298, 16), $.uint(1031, 16), $.uint(2037, 16), $.uint(1292, 16), $.uint(3220, 16), $.uint(109, 16), $.uint(375, 16), $.uint(2954, 16), $.uint(2549, 16), $.uint(780, 16), $.uint(2090, 16), $.uint(1239, 16), $.uint(1645, 16), $.uint(1684, 16), $.uint(1063, 16), $.uint(2266, 16), $.uint(319, 16), $.uint(3010, 16), $.uint(2773, 16), $.uint(556, 16), $.uint(757, 16), $.uint(2572, 16), $.uint(2099, 16), $.uint(1230, 16), $.uint(561, 16), $.uint(2768, 16), $.uint(2466, 16), $.uint(863, 16), $.uint(2594, 16), $.uint(735, 16), $.uint(2804, 16), $.uint(525, 16), $.uint(1092, 16), $.uint(2237, 16), $.uint(403, 16), $.uint(2926, 16), $.uint(1026, 16), $.uint(2303, 16), $.uint(1143, 16), $.uint(2186, 16), $.uint(2150, 16), $.uint(1179, 16), $.uint(2775, 16), $.uint(554, 16), $.uint(886, 16), $.uint(2443, 16), $.uint(1722, 16), $.uint(1607, 16), $.uint(1212, 16), $.uint(2117, 16), $.uint(1874, 16), $.uint(1455, 16), $.uint(1029, 16), $.uint(2300, 16), $.uint(2110, 16), $.uint(1219, 16), $.uint(2935, 16), $.uint(394, 16), $.uint(885, 16), $.uint(2444, 16), $.uint(2154, 16), $.uint(1175, 16)]
	}
}

export function __goscript_get_gammas(): fieldElement[] {
	if (((gammas) as any) === undefined) {
		__goscript_init_gammas()
	}
	return gammas
}

export function __goscript_set_gammas(__goscriptValue: fieldElement[]): void {
	gammas = __goscriptValue
}

export function nttMul(f: nttElement, g: nttElement): nttElement {
	let h: nttElement = Array.from({ length: 256 }, () => 0)
	// We use i += 2 for bounds check elimination. See https://go.dev/issue/66826.
	for (let i = 0; i < 256; i = i + (2)) {
		let a0 = $.uint($.arrayIndex(f, i), 16)
		let a1 = $.uint($.arrayIndex(f, i + 1), 16)
		let b0 = $.uint($.arrayIndex(g, i), 16)
		let b1 = $.uint($.arrayIndex(g, i + 1), 16)
		h[i] = $.uint(fieldAddMul($.uint(a0, 16), $.uint(b0, 16), $.uint(fieldMul($.uint(a1, 16), $.uint(b1, 16)), 16), $.uint($.arrayIndex(__goscript_get_gammas(), Math.trunc(i / 2)), 16)), 16)
		h[i + 1] = $.uint(fieldAddMul($.uint(a0, 16), $.uint(b1, 16), $.uint(a1, 16), $.uint(b0, 16)), 16)
	}
	return h
}

export var zetas: fieldElement[]

export function __goscript_init_zetas(): void {
	if (((zetas) as any) === undefined) {
		zetas = [$.uint(1, 16), $.uint(1729, 16), $.uint(2580, 16), $.uint(3289, 16), $.uint(2642, 16), $.uint(630, 16), $.uint(1897, 16), $.uint(848, 16), $.uint(1062, 16), $.uint(1919, 16), $.uint(193, 16), $.uint(797, 16), $.uint(2786, 16), $.uint(3260, 16), $.uint(569, 16), $.uint(1746, 16), $.uint(296, 16), $.uint(2447, 16), $.uint(1339, 16), $.uint(1476, 16), $.uint(3046, 16), $.uint(56, 16), $.uint(2240, 16), $.uint(1333, 16), $.uint(1426, 16), $.uint(2094, 16), $.uint(535, 16), $.uint(2882, 16), $.uint(2393, 16), $.uint(2879, 16), $.uint(1974, 16), $.uint(821, 16), $.uint(289, 16), $.uint(331, 16), $.uint(3253, 16), $.uint(1756, 16), $.uint(1197, 16), $.uint(2304, 16), $.uint(2277, 16), $.uint(2055, 16), $.uint(650, 16), $.uint(1977, 16), $.uint(2513, 16), $.uint(632, 16), $.uint(2865, 16), $.uint(33, 16), $.uint(1320, 16), $.uint(1915, 16), $.uint(2319, 16), $.uint(1435, 16), $.uint(807, 16), $.uint(452, 16), $.uint(1438, 16), $.uint(2868, 16), $.uint(1534, 16), $.uint(2402, 16), $.uint(2647, 16), $.uint(2617, 16), $.uint(1481, 16), $.uint(648, 16), $.uint(2474, 16), $.uint(3110, 16), $.uint(1227, 16), $.uint(910, 16), $.uint(17, 16), $.uint(2761, 16), $.uint(583, 16), $.uint(2649, 16), $.uint(1637, 16), $.uint(723, 16), $.uint(2288, 16), $.uint(1100, 16), $.uint(1409, 16), $.uint(2662, 16), $.uint(3281, 16), $.uint(233, 16), $.uint(756, 16), $.uint(2156, 16), $.uint(3015, 16), $.uint(3050, 16), $.uint(1703, 16), $.uint(1651, 16), $.uint(2789, 16), $.uint(1789, 16), $.uint(1847, 16), $.uint(952, 16), $.uint(1461, 16), $.uint(2687, 16), $.uint(939, 16), $.uint(2308, 16), $.uint(2437, 16), $.uint(2388, 16), $.uint(733, 16), $.uint(2337, 16), $.uint(268, 16), $.uint(641, 16), $.uint(1584, 16), $.uint(2298, 16), $.uint(2037, 16), $.uint(3220, 16), $.uint(375, 16), $.uint(2549, 16), $.uint(2090, 16), $.uint(1645, 16), $.uint(1063, 16), $.uint(319, 16), $.uint(2773, 16), $.uint(757, 16), $.uint(2099, 16), $.uint(561, 16), $.uint(2466, 16), $.uint(2594, 16), $.uint(2804, 16), $.uint(1092, 16), $.uint(403, 16), $.uint(1026, 16), $.uint(1143, 16), $.uint(2150, 16), $.uint(2775, 16), $.uint(886, 16), $.uint(1722, 16), $.uint(1212, 16), $.uint(1874, 16), $.uint(1029, 16), $.uint(2110, 16), $.uint(2935, 16), $.uint(885, 16), $.uint(2154, 16)]
	}
}

export function __goscript_get_zetas(): fieldElement[] {
	if (((zetas) as any) === undefined) {
		__goscript_init_zetas()
	}
	return zetas
}

export function __goscript_set_zetas(__goscriptValue: fieldElement[]): void {
	zetas = __goscriptValue
}

export function ntt(f: ringElement): nttElement {
	let k = 1
	for (let len = 128; len >= 2; len = Math.trunc(len / 2)) {
		for (let start = 0; start < 256; start = start + (2 * len)) {
			let zeta = $.uint($.arrayIndex(__goscript_get_zetas(), k), 16)
			k++
			// Bounds check elimination hint.
			let __goscriptShadow1 = f
			let __goscriptShadow2: $.Slice<fieldElement> = $.goSlice(__goscriptShadow1, start, start + len)
			let flen: $.Slice<fieldElement> = $.goSlice(__goscriptShadow1, start + len, (start + len) + len)
			for (let j = 0; j < len; j++) {
				let t = $.uint(fieldMul($.uint(zeta, 16), $.uint($.arrayIndex(flen!, j), 16)), 16)
				flen![j] = $.uint(fieldSub($.uint($.arrayIndex(__goscriptShadow2!, j), 16), $.uint(t, 16)), 16)
				__goscriptShadow2![j] = $.uint(fieldAdd($.uint($.arrayIndex(__goscriptShadow2!, j), 16), $.uint(t, 16)), 16)
			}
		}
	}
	return f
}

export function inverseNTT(f: nttElement): ringElement {
	let k = 127
	for (let len = 2; len <= 128; len = len * (2)) {
		for (let start = 0; start < 256; start = start + (2 * len)) {
			let zeta = $.uint($.arrayIndex(__goscript_get_zetas(), k), 16)
			k--
			// Bounds check elimination hint.
			let __goscriptShadow3 = f
			let __goscriptShadow4: $.Slice<fieldElement> = $.goSlice(__goscriptShadow3, start, start + len)
			let flen: $.Slice<fieldElement> = $.goSlice(__goscriptShadow3, start + len, (start + len) + len)
			for (let j = 0; j < len; j++) {
				let t = $.uint($.arrayIndex(__goscriptShadow4!, j), 16)
				__goscriptShadow4![j] = $.uint(fieldAdd($.uint(t, 16), $.uint($.arrayIndex(flen!, j), 16)), 16)
				flen![j] = $.uint(fieldMulSub($.uint(zeta, 16), $.uint($.arrayIndex(flen!, j), 16), $.uint(t, 16)), 16)
			}
		}
	}
	for (let __goscriptRangeTarget4 = f, i = 0; i < $.len(__goscriptRangeTarget4); i++) {
		f[i] = $.uint(fieldMul($.uint($.arrayIndex(f, i), 16), $.uint(3303, 16)), 16)
	}
	return f
}

export function sampleNTT(rho: $.Slice<number>, ii: number, jj: number): nttElement {
	let B: sha3.SHAKE | $.VarRef<sha3.SHAKE> | null = sha3.NewShake128()
	sha3.SHAKE.prototype.Write.call(B, rho)
	sha3.SHAKE.prototype.Write.call(B, new Uint8Array([ii, jj]) as $.Slice<number>)

	// SampleNTT essentially draws 12 bits at a time from r, interprets them in
	// little-endian, and rejects values higher than q, until it drew 256
	// values. (The rejection rate is approximately 19%.)
	//
	// To do this from a bytes stream, it draws three bytes at a time, and
	// splits them into two uint16 appropriately masked.
	//
	//               r₀              r₁              r₂
	//       |- - - - - - - -|- - - - - - - -|- - - - - - - -|
	//
	//               Uint16(r₀ || r₁)
	//       |- - - - - - - - - - - - - - - -|
	//       |- - - - - - - - - - - -|
	//                   d₁
	//
	//                                Uint16(r₁ || r₂)
	//                       |- - - - - - - - - - - - - - - -|
	//                               |- - - - - - - - - - - -|
	//                                           d₂
	//
	// Note that in little-endian, the rightmost bits are the most significant
	// bits (dropped with a mask) and the leftmost bits are the least
	// significant bits (dropped with a right shift).

	let a: nttElement = Array.from({ length: 256 }, () => 0)
	let j: number = 0
	let buf: Uint8Array = new Uint8Array(24)
	let off = $.len(buf)
	while (true) {
		if (off >= $.len(buf)) {
			sha3.SHAKE.prototype.Read.call(B, $.goSlice(buf, undefined, undefined))
			off = 0
		}
		let d1 = $.uint(byteorder.LEUint16($.goSlice(buf, off, undefined)) & 0b1111_1111_1111, 16)
		let d2 = $.uint($.uintShr(byteorder.LEUint16($.goSlice(buf, off + 1, undefined)), 4, 16), 16)
		off = off + (3)
		if ($.uint(d1, 16) < $.uint(3329, 16)) {
			a[j] = $.uint($.uint(d1, 16), 16)
			j++
		}
		if (j >= $.len(a)) {
			break
		}
		if ($.uint(d2, 16) < $.uint(3329, 16)) {
			a[j] = $.uint($.uint(d2, 16), 16)
			j++
		}
		if (j >= $.len(a)) {
			break
		}
	}
	return a
}

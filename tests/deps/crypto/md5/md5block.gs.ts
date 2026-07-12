// Generated file based on md5block.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as bits from "@goscript/math/bits/index.js"

import type * as hash from "@goscript/hash/index.js"

import * as __goscript_md5 from "./md5.gs.ts"
import "@goscript/internal/byteorder/index.js"
import "@goscript/math/bits/index.js"
import "./md5.gs.ts"

export function blockGeneric(dig: __goscript_md5.digest | $.VarRef<__goscript_md5.digest> | null, p: $.Slice<number>): void {
	// load state
	let a = $.uint($.arrayIndex($.pointerValue<__goscript_md5.digest>(dig).s, 0), 32)
	let b = $.uint($.arrayIndex($.pointerValue<__goscript_md5.digest>(dig).s, 1), 32)
	let c = $.uint($.arrayIndex($.pointerValue<__goscript_md5.digest>(dig).s, 2), 32)
	let d = $.uint($.arrayIndex($.pointerValue<__goscript_md5.digest>(dig).s, 3), 32)

	for (let i = 0; i <= ($.len(p) - 64); i = i + (64)) {
		// eliminate bounds checks on p
		let q: $.Slice<number> = $.goSlice(p, i, undefined)
		q = $.goSlice(q, undefined, 64, 64)

		// save current state
		let aa = $.uint(a, 32)
		let bb = $.uint(b, 32)
		let cc = $.uint(c, 32)
		let dd = $.uint(d, 32)

		// load input block
		let x0 = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0x0, undefined)), 32)
		let x1 = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0x1, undefined)), 32)
		let x2 = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0x2, undefined)), 32)
		let x3 = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0x3, undefined)), 32)
		let x4 = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0x4, undefined)), 32)
		let x5 = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0x5, undefined)), 32)
		let x6 = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0x6, undefined)), 32)
		let x7 = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0x7, undefined)), 32)
		let x8 = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0x8, undefined)), 32)
		let x9 = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0x9, undefined)), 32)
		let xa = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0xa, undefined)), 32)
		let xb = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0xb, undefined)), 32)
		let xc = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0xc, undefined)), 32)
		let xd = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0xd, undefined)), 32)
		let xe = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0xe, undefined)), 32)
		let xf = $.uint(byteorder.LEUint32($.goSlice(q, 4 * 0xf, undefined)), 32)

		// round 1
		a = $.uint(b + bits.RotateLeft32($.uint((((((c ^ d) & b) ^ d) + a) + x0) + 0xd76aa478, 32), 7), 32)
		d = $.uint(a + bits.RotateLeft32($.uint((((((b ^ c) & a) ^ c) + d) + x1) + 0xe8c7b756, 32), 12), 32)
		c = $.uint(d + bits.RotateLeft32($.uint((((((a ^ b) & d) ^ b) + c) + x2) + 0x242070db, 32), 17), 32)
		b = $.uint(c + bits.RotateLeft32($.uint((((((d ^ a) & c) ^ a) + b) + x3) + 0xc1bdceee, 32), 22), 32)
		a = $.uint(b + bits.RotateLeft32($.uint((((((c ^ d) & b) ^ d) + a) + x4) + 0xf57c0faf, 32), 7), 32)
		d = $.uint(a + bits.RotateLeft32($.uint((((((b ^ c) & a) ^ c) + d) + x5) + 0x4787c62a, 32), 12), 32)
		c = $.uint(d + bits.RotateLeft32($.uint((((((a ^ b) & d) ^ b) + c) + x6) + 0xa8304613, 32), 17), 32)
		b = $.uint(c + bits.RotateLeft32($.uint((((((d ^ a) & c) ^ a) + b) + x7) + 0xfd469501, 32), 22), 32)
		a = $.uint(b + bits.RotateLeft32($.uint((((((c ^ d) & b) ^ d) + a) + x8) + 0x698098d8, 32), 7), 32)
		d = $.uint(a + bits.RotateLeft32($.uint((((((b ^ c) & a) ^ c) + d) + x9) + 0x8b44f7af, 32), 12), 32)
		c = $.uint(d + bits.RotateLeft32($.uint((((((a ^ b) & d) ^ b) + c) + xa) + 0xffff5bb1, 32), 17), 32)
		b = $.uint(c + bits.RotateLeft32($.uint((((((d ^ a) & c) ^ a) + b) + xb) + 0x895cd7be, 32), 22), 32)
		a = $.uint(b + bits.RotateLeft32($.uint((((((c ^ d) & b) ^ d) + a) + xc) + 0x6b901122, 32), 7), 32)
		d = $.uint(a + bits.RotateLeft32($.uint((((((b ^ c) & a) ^ c) + d) + xd) + 0xfd987193, 32), 12), 32)
		c = $.uint(d + bits.RotateLeft32($.uint((((((a ^ b) & d) ^ b) + c) + xe) + 0xa679438e, 32), 17), 32)
		b = $.uint(c + bits.RotateLeft32($.uint((((((d ^ a) & c) ^ a) + b) + xf) + 0x49b40821, 32), 22), 32)

		// round 2
		a = $.uint(b + bits.RotateLeft32($.uint((((((b ^ c) & d) ^ c) + a) + x1) + 0xf61e2562, 32), 5), 32)
		d = $.uint(a + bits.RotateLeft32($.uint((((((a ^ b) & c) ^ b) + d) + x6) + 0xc040b340, 32), 9), 32)
		c = $.uint(d + bits.RotateLeft32($.uint((((((d ^ a) & b) ^ a) + c) + xb) + 0x265e5a51, 32), 14), 32)
		b = $.uint(c + bits.RotateLeft32($.uint((((((c ^ d) & a) ^ d) + b) + x0) + 0xe9b6c7aa, 32), 20), 32)
		a = $.uint(b + bits.RotateLeft32($.uint((((((b ^ c) & d) ^ c) + a) + x5) + 0xd62f105d, 32), 5), 32)
		d = $.uint(a + bits.RotateLeft32($.uint((((((a ^ b) & c) ^ b) + d) + xa) + 0x02441453, 32), 9), 32)
		c = $.uint(d + bits.RotateLeft32($.uint((((((d ^ a) & b) ^ a) + c) + xf) + 0xd8a1e681, 32), 14), 32)
		b = $.uint(c + bits.RotateLeft32($.uint((((((c ^ d) & a) ^ d) + b) + x4) + 0xe7d3fbc8, 32), 20), 32)
		a = $.uint(b + bits.RotateLeft32($.uint((((((b ^ c) & d) ^ c) + a) + x9) + 0x21e1cde6, 32), 5), 32)
		d = $.uint(a + bits.RotateLeft32($.uint((((((a ^ b) & c) ^ b) + d) + xe) + 0xc33707d6, 32), 9), 32)
		c = $.uint(d + bits.RotateLeft32($.uint((((((d ^ a) & b) ^ a) + c) + x3) + 0xf4d50d87, 32), 14), 32)
		b = $.uint(c + bits.RotateLeft32($.uint((((((c ^ d) & a) ^ d) + b) + x8) + 0x455a14ed, 32), 20), 32)
		a = $.uint(b + bits.RotateLeft32($.uint((((((b ^ c) & d) ^ c) + a) + xd) + 0xa9e3e905, 32), 5), 32)
		d = $.uint(a + bits.RotateLeft32($.uint((((((a ^ b) & c) ^ b) + d) + x2) + 0xfcefa3f8, 32), 9), 32)
		c = $.uint(d + bits.RotateLeft32($.uint((((((d ^ a) & b) ^ a) + c) + x7) + 0x676f02d9, 32), 14), 32)
		b = $.uint(c + bits.RotateLeft32($.uint((((((c ^ d) & a) ^ d) + b) + xc) + 0x8d2a4c8a, 32), 20), 32)

		// round 3
		a = $.uint(b + bits.RotateLeft32($.uint(((((b ^ c) ^ d) + a) + x5) + 0xfffa3942, 32), 4), 32)
		d = $.uint(a + bits.RotateLeft32($.uint(((((a ^ b) ^ c) + d) + x8) + 0x8771f681, 32), 11), 32)
		c = $.uint(d + bits.RotateLeft32($.uint(((((d ^ a) ^ b) + c) + xb) + 0x6d9d6122, 32), 16), 32)
		b = $.uint(c + bits.RotateLeft32($.uint(((((c ^ d) ^ a) + b) + xe) + 0xfde5380c, 32), 23), 32)
		a = $.uint(b + bits.RotateLeft32($.uint(((((b ^ c) ^ d) + a) + x1) + 0xa4beea44, 32), 4), 32)
		d = $.uint(a + bits.RotateLeft32($.uint(((((a ^ b) ^ c) + d) + x4) + 0x4bdecfa9, 32), 11), 32)
		c = $.uint(d + bits.RotateLeft32($.uint(((((d ^ a) ^ b) + c) + x7) + 0xf6bb4b60, 32), 16), 32)
		b = $.uint(c + bits.RotateLeft32($.uint(((((c ^ d) ^ a) + b) + xa) + 0xbebfbc70, 32), 23), 32)
		a = $.uint(b + bits.RotateLeft32($.uint(((((b ^ c) ^ d) + a) + xd) + 0x289b7ec6, 32), 4), 32)
		d = $.uint(a + bits.RotateLeft32($.uint(((((a ^ b) ^ c) + d) + x0) + 0xeaa127fa, 32), 11), 32)
		c = $.uint(d + bits.RotateLeft32($.uint(((((d ^ a) ^ b) + c) + x3) + 0xd4ef3085, 32), 16), 32)
		b = $.uint(c + bits.RotateLeft32($.uint(((((c ^ d) ^ a) + b) + x6) + 0x04881d05, 32), 23), 32)
		a = $.uint(b + bits.RotateLeft32($.uint(((((b ^ c) ^ d) + a) + x9) + 0xd9d4d039, 32), 4), 32)
		d = $.uint(a + bits.RotateLeft32($.uint(((((a ^ b) ^ c) + d) + xc) + 0xe6db99e5, 32), 11), 32)
		c = $.uint(d + bits.RotateLeft32($.uint(((((d ^ a) ^ b) + c) + xf) + 0x1fa27cf8, 32), 16), 32)
		b = $.uint(c + bits.RotateLeft32($.uint(((((c ^ d) ^ a) + b) + x2) + 0xc4ac5665, 32), 23), 32)

		// round 4
		a = $.uint(b + bits.RotateLeft32($.uint((((c ^ (b | $.uint(~d, 32))) + a) + x0) + 0xf4292244, 32), 6), 32)
		d = $.uint(a + bits.RotateLeft32($.uint((((b ^ (a | $.uint(~c, 32))) + d) + x7) + 0x432aff97, 32), 10), 32)
		c = $.uint(d + bits.RotateLeft32($.uint((((a ^ (d | $.uint(~b, 32))) + c) + xe) + 0xab9423a7, 32), 15), 32)
		b = $.uint(c + bits.RotateLeft32($.uint((((d ^ (c | $.uint(~a, 32))) + b) + x5) + 0xfc93a039, 32), 21), 32)
		a = $.uint(b + bits.RotateLeft32($.uint((((c ^ (b | $.uint(~d, 32))) + a) + xc) + 0x655b59c3, 32), 6), 32)
		d = $.uint(a + bits.RotateLeft32($.uint((((b ^ (a | $.uint(~c, 32))) + d) + x3) + 0x8f0ccc92, 32), 10), 32)
		c = $.uint(d + bits.RotateLeft32($.uint((((a ^ (d | $.uint(~b, 32))) + c) + xa) + 0xffeff47d, 32), 15), 32)
		b = $.uint(c + bits.RotateLeft32($.uint((((d ^ (c | $.uint(~a, 32))) + b) + x1) + 0x85845dd1, 32), 21), 32)
		a = $.uint(b + bits.RotateLeft32($.uint((((c ^ (b | $.uint(~d, 32))) + a) + x8) + 0x6fa87e4f, 32), 6), 32)
		d = $.uint(a + bits.RotateLeft32($.uint((((b ^ (a | $.uint(~c, 32))) + d) + xf) + 0xfe2ce6e0, 32), 10), 32)
		c = $.uint(d + bits.RotateLeft32($.uint((((a ^ (d | $.uint(~b, 32))) + c) + x6) + 0xa3014314, 32), 15), 32)
		b = $.uint(c + bits.RotateLeft32($.uint((((d ^ (c | $.uint(~a, 32))) + b) + xd) + 0x4e0811a1, 32), 21), 32)
		a = $.uint(b + bits.RotateLeft32($.uint((((c ^ (b | $.uint(~d, 32))) + a) + x4) + 0xf7537e82, 32), 6), 32)
		d = $.uint(a + bits.RotateLeft32($.uint((((b ^ (a | $.uint(~c, 32))) + d) + xb) + 0xbd3af235, 32), 10), 32)
		c = $.uint(d + bits.RotateLeft32($.uint((((a ^ (d | $.uint(~b, 32))) + c) + x2) + 0x2ad7d2bb, 32), 15), 32)
		b = $.uint(c + bits.RotateLeft32($.uint((((d ^ (c | $.uint(~a, 32))) + b) + x9) + 0xeb86d391, 32), 21), 32)

		// add saved state
		a = a + ($.uint(aa, 32))
		b = b + ($.uint(bb, 32))
		c = c + ($.uint(cc, 32))
		d = d + ($.uint(dd, 32))
	}

	// save state
	let __goscriptAssign0_0: number = $.uint(a, 32)
	let __goscriptAssign0_1: number = $.uint(b, 32)
	let __goscriptAssign0_2: number = $.uint(c, 32)
	let __goscriptAssign0_3: number = $.uint(d, 32)
	$.pointerValue<__goscript_md5.digest>(dig).s[0] = __goscriptAssign0_0
	$.pointerValue<__goscript_md5.digest>(dig).s[1] = __goscriptAssign0_1
	$.pointerValue<__goscript_md5.digest>(dig).s[2] = __goscriptAssign0_2
	$.pointerValue<__goscript_md5.digest>(dig).s[3] = __goscriptAssign0_3
}

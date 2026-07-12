// Generated file based on aes_generic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as __goscript__const from "./const.gs.ts"

import * as __goscript_aes from "./aes.gs.ts"

import * as __goscript_aes_noasm from "./aes_noasm.gs.ts"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "./const.gs.ts"
import "./aes.gs.ts"
import "./aes_noasm.gs.ts"

export function encryptBlockGeneric(c: __goscript_aes.blockExpanded | $.VarRef<__goscript_aes.blockExpanded> | null, dst: $.Slice<number>, src: $.Slice<number>): void {
	__goscript_aes_noasm.checkGenericIsExpected()
	let xk: $.Slice<number> = $.goSlice($.pointerValue<__goscript_aes.blockExpanded>(c).enc, undefined, undefined)

	$.arrayIndex(src!, 15)
	let s0 = $.uint(byteorder.BEUint32($.goSlice(src, 0, 4)), 32)
	let s1 = $.uint(byteorder.BEUint32($.goSlice(src, 4, 8)), 32)
	let s2 = $.uint(byteorder.BEUint32($.goSlice(src, 8, 12)), 32)
	let s3 = $.uint(byteorder.BEUint32($.goSlice(src, 12, 16)), 32)

	// First round just XORs input with key.
	s0 = s0 ^ ($.uint($.arrayIndex(xk!, 0), 32))
	s1 = s1 ^ ($.uint($.arrayIndex(xk!, 1), 32))
	s2 = s2 ^ ($.uint($.arrayIndex(xk!, 2), 32))
	s3 = s3 ^ ($.uint($.arrayIndex(xk!, 3), 32))

	// Middle rounds shuffle using tables.
	let k = 4
	let t0: number = 0
	let t1: number = 0
	let t2: number = 0
	let t3: number = 0
	for (let r = 0; r < ($.pointerValue<__goscript_aes.blockExpanded>(c).rounds - 1); r++) {
		t0 = $.uint(((($.arrayIndex(xk!, k + 0) ^ $.arrayIndex(__goscript__const.__goscript_get_te0(), $.uint($.uintShr(s0, 24, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_te1(), $.uint($.uintShr(s1, 16, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_te2(), $.uint($.uintShr(s2, 8, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_te3(), $.uint(s3, 8)), 32)
		t1 = $.uint(((($.arrayIndex(xk!, k + 1) ^ $.arrayIndex(__goscript__const.__goscript_get_te0(), $.uint($.uintShr(s1, 24, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_te1(), $.uint($.uintShr(s2, 16, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_te2(), $.uint($.uintShr(s3, 8, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_te3(), $.uint(s0, 8)), 32)
		t2 = $.uint(((($.arrayIndex(xk!, k + 2) ^ $.arrayIndex(__goscript__const.__goscript_get_te0(), $.uint($.uintShr(s2, 24, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_te1(), $.uint($.uintShr(s3, 16, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_te2(), $.uint($.uintShr(s0, 8, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_te3(), $.uint(s1, 8)), 32)
		t3 = $.uint(((($.arrayIndex(xk!, k + 3) ^ $.arrayIndex(__goscript__const.__goscript_get_te0(), $.uint($.uintShr(s3, 24, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_te1(), $.uint($.uintShr(s0, 16, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_te2(), $.uint($.uintShr(s1, 8, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_te3(), $.uint(s2, 8)), 32)
		k = k + (4)
		let __goscriptAssign0_0: number = $.uint(t0, 32)
		let __goscriptAssign0_1: number = $.uint(t1, 32)
		let __goscriptAssign0_2: number = $.uint(t2, 32)
		let __goscriptAssign0_3: number = $.uint(t3, 32)
		s0 = __goscriptAssign0_0
		s1 = __goscriptAssign0_1
		s2 = __goscriptAssign0_2
		s3 = __goscriptAssign0_3
	}

	// Last round uses s-box directly and XORs to produce output.
	s0 = $.uint(((($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), $.uintShr(t0, 24, 32)), 32) << 24) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), ($.uintShr(t1, 16, 32)) & 0xff), 32) << 16)) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), ($.uintShr(t2, 8, 32)) & 0xff), 32) << 8)) | $.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), t3 & 0xff), 32), 32)
	s1 = $.uint(((($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), $.uintShr(t1, 24, 32)), 32) << 24) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), ($.uintShr(t2, 16, 32)) & 0xff), 32) << 16)) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), ($.uintShr(t3, 8, 32)) & 0xff), 32) << 8)) | $.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), t0 & 0xff), 32), 32)
	s2 = $.uint(((($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), $.uintShr(t2, 24, 32)), 32) << 24) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), ($.uintShr(t3, 16, 32)) & 0xff), 32) << 16)) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), ($.uintShr(t0, 8, 32)) & 0xff), 32) << 8)) | $.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), t1 & 0xff), 32), 32)
	s3 = $.uint(((($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), $.uintShr(t3, 24, 32)), 32) << 24) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), ($.uintShr(t0, 16, 32)) & 0xff), 32) << 16)) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), ($.uintShr(t1, 8, 32)) & 0xff), 32) << 8)) | $.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), t2 & 0xff), 32), 32)

	s0 = s0 ^ ($.uint($.arrayIndex(xk!, k + 0), 32))
	s1 = s1 ^ ($.uint($.arrayIndex(xk!, k + 1), 32))
	s2 = s2 ^ ($.uint($.arrayIndex(xk!, k + 2), 32))
	s3 = s3 ^ ($.uint($.arrayIndex(xk!, k + 3), 32))

	$.arrayIndex(dst!, 15)
	byteorder.BEPutUint32($.goSlice(dst, 0, 4), $.uint(s0, 32))
	byteorder.BEPutUint32($.goSlice(dst, 4, 8), $.uint(s1, 32))
	byteorder.BEPutUint32($.goSlice(dst, 8, 12), $.uint(s2, 32))
	byteorder.BEPutUint32($.goSlice(dst, 12, 16), $.uint(s3, 32))
}

export function decryptBlockGeneric(c: __goscript_aes.blockExpanded | $.VarRef<__goscript_aes.blockExpanded> | null, dst: $.Slice<number>, src: $.Slice<number>): void {
	__goscript_aes_noasm.checkGenericIsExpected()
	let xk: $.Slice<number> = $.goSlice($.pointerValue<__goscript_aes.blockExpanded>(c).dec, undefined, undefined)

	$.arrayIndex(src!, 15)
	let s0 = $.uint(byteorder.BEUint32($.goSlice(src, 0, 4)), 32)
	let s1 = $.uint(byteorder.BEUint32($.goSlice(src, 4, 8)), 32)
	let s2 = $.uint(byteorder.BEUint32($.goSlice(src, 8, 12)), 32)
	let s3 = $.uint(byteorder.BEUint32($.goSlice(src, 12, 16)), 32)

	// First round just XORs input with key.
	s0 = s0 ^ ($.uint($.arrayIndex(xk!, 0), 32))
	s1 = s1 ^ ($.uint($.arrayIndex(xk!, 1), 32))
	s2 = s2 ^ ($.uint($.arrayIndex(xk!, 2), 32))
	s3 = s3 ^ ($.uint($.arrayIndex(xk!, 3), 32))

	// Middle rounds shuffle using tables.
	let k = 4
	let t0: number = 0
	let t1: number = 0
	let t2: number = 0
	let t3: number = 0
	for (let r = 0; r < ($.pointerValue<__goscript_aes.blockExpanded>(c).rounds - 1); r++) {
		t0 = $.uint(((($.arrayIndex(xk!, k + 0) ^ $.arrayIndex(__goscript__const.__goscript_get_td0(), $.uint($.uintShr(s0, 24, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_td1(), $.uint($.uintShr(s3, 16, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_td2(), $.uint($.uintShr(s2, 8, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_td3(), $.uint(s1, 8)), 32)
		t1 = $.uint(((($.arrayIndex(xk!, k + 1) ^ $.arrayIndex(__goscript__const.__goscript_get_td0(), $.uint($.uintShr(s1, 24, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_td1(), $.uint($.uintShr(s0, 16, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_td2(), $.uint($.uintShr(s3, 8, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_td3(), $.uint(s2, 8)), 32)
		t2 = $.uint(((($.arrayIndex(xk!, k + 2) ^ $.arrayIndex(__goscript__const.__goscript_get_td0(), $.uint($.uintShr(s2, 24, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_td1(), $.uint($.uintShr(s1, 16, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_td2(), $.uint($.uintShr(s0, 8, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_td3(), $.uint(s3, 8)), 32)
		t3 = $.uint(((($.arrayIndex(xk!, k + 3) ^ $.arrayIndex(__goscript__const.__goscript_get_td0(), $.uint($.uintShr(s3, 24, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_td1(), $.uint($.uintShr(s2, 16, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_td2(), $.uint($.uintShr(s1, 8, 32), 8))) ^ $.arrayIndex(__goscript__const.__goscript_get_td3(), $.uint(s0, 8)), 32)
		k = k + (4)
		let __goscriptAssign1_0: number = $.uint(t0, 32)
		let __goscriptAssign1_1: number = $.uint(t1, 32)
		let __goscriptAssign1_2: number = $.uint(t2, 32)
		let __goscriptAssign1_3: number = $.uint(t3, 32)
		s0 = __goscriptAssign1_0
		s1 = __goscriptAssign1_1
		s2 = __goscriptAssign1_2
		s3 = __goscriptAssign1_3
	}

	// Last round uses s-box directly and XORs to produce output.
	s0 = $.uint(((($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), $.uintShr(t0, 24, 32)), 32) << 24) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), ($.uintShr(t3, 16, 32)) & 0xff), 32) << 16)) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), ($.uintShr(t2, 8, 32)) & 0xff), 32) << 8)) | $.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), t1 & 0xff), 32), 32)
	s1 = $.uint(((($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), $.uintShr(t1, 24, 32)), 32) << 24) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), ($.uintShr(t0, 16, 32)) & 0xff), 32) << 16)) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), ($.uintShr(t3, 8, 32)) & 0xff), 32) << 8)) | $.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), t2 & 0xff), 32), 32)
	s2 = $.uint(((($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), $.uintShr(t2, 24, 32)), 32) << 24) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), ($.uintShr(t1, 16, 32)) & 0xff), 32) << 16)) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), ($.uintShr(t0, 8, 32)) & 0xff), 32) << 8)) | $.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), t3 & 0xff), 32), 32)
	s3 = $.uint(((($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), $.uintShr(t3, 24, 32)), 32) << 24) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), ($.uintShr(t2, 16, 32)) & 0xff), 32) << 16)) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), ($.uintShr(t1, 8, 32)) & 0xff), 32) << 8)) | $.uint($.arrayIndex(__goscript__const.__goscript_get_sbox1(), t0 & 0xff), 32), 32)

	s0 = s0 ^ ($.uint($.arrayIndex(xk!, k + 0), 32))
	s1 = s1 ^ ($.uint($.arrayIndex(xk!, k + 1), 32))
	s2 = s2 ^ ($.uint($.arrayIndex(xk!, k + 2), 32))
	s3 = s3 ^ ($.uint($.arrayIndex(xk!, k + 3), 32))

	$.arrayIndex(dst!, 15)
	byteorder.BEPutUint32($.goSlice(dst, 0, 4), $.uint(s0, 32))
	byteorder.BEPutUint32($.goSlice(dst, 4, 8), $.uint(s1, 32))
	byteorder.BEPutUint32($.goSlice(dst, 8, 12), $.uint(s2, 32))
	byteorder.BEPutUint32($.goSlice(dst, 12, 16), $.uint(s3, 32))
}

export function subw(w: number): number {
	return $.uint(((($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), $.uintShr(w, 24, 32)), 32) << 24) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), ($.uintShr(w, 16, 32)) & 0xff), 32) << 16)) | ($.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), ($.uintShr(w, 8, 32)) & 0xff), 32) << 8)) | $.uint($.arrayIndex(__goscript__const.__goscript_get_sbox0(), w & 0xff), 32), 32)
}

export function rotw(w: number): number {
	return $.uint((w << 8) | ($.uintShr(w, 24, 32)), 32)
}

export function expandKeyGeneric(c: __goscript_aes.blockExpanded | $.VarRef<__goscript_aes.blockExpanded> | null, key: $.Slice<number>): void {
	__goscript_aes_noasm.checkGenericIsExpected()

	// Encryption key setup.
	let i: number = 0
	let nk = Math.trunc($.len(key) / 4)
	for (i = 0; i < nk; i++) {
		$.pointerValue<__goscript_aes.blockExpanded>(c).enc[i] = $.uint(byteorder.BEUint32($.goSlice(key, 4 * i, undefined)), 32)
	}
	for (; i < __goscript_aes.blockExpanded.prototype.roundKeysSize.call(c); i++) {
		let t = $.uint($.arrayIndex($.pointerValue<__goscript_aes.blockExpanded>(c).enc, i - 1), 32)
		if ((i % nk) == 0) {
			t = $.uint(subw($.uint(rotw($.uint(t, 32)), 32)) ^ ($.uint($.arrayIndex(__goscript__const.__goscript_get_powx(), (Math.trunc(i / nk)) - 1), 32) << 24), 32)
		} else {
			if ((nk > 6) && ((i % nk) == 4)) {
				t = $.uint(subw($.uint(t, 32)), 32)
			}
		}
		$.pointerValue<__goscript_aes.blockExpanded>(c).enc[i] = $.uint($.arrayIndex($.pointerValue<__goscript_aes.blockExpanded>(c).enc, i - nk) ^ t, 32)
	}

	// Derive decryption key from encryption key.
	// Reverse the 4-word round key sets from enc to produce dec.
	// All sets but the first and last get the MixColumn transform applied.
	let n = __goscript_aes.blockExpanded.prototype.roundKeysSize.call(c)
	for (let __goscriptShadow0 = 0; __goscriptShadow0 < n; __goscriptShadow0 = __goscriptShadow0 + (4)) {
		let ei = (n - __goscriptShadow0) - 4
		for (let j = 0; j < 4; j++) {
			let x = $.uint($.arrayIndex($.pointerValue<__goscript_aes.blockExpanded>(c).enc, ei + j), 32)
			if ((__goscriptShadow0 > 0) && ((__goscriptShadow0 + 4) < n)) {
				x = $.uint((($.arrayIndex(__goscript__const.__goscript_get_td0(), $.arrayIndex(__goscript__const.__goscript_get_sbox0(), $.uintShr(x, 24, 32))) ^ $.arrayIndex(__goscript__const.__goscript_get_td1(), $.arrayIndex(__goscript__const.__goscript_get_sbox0(), ($.uintShr(x, 16, 32)) & 0xff))) ^ $.arrayIndex(__goscript__const.__goscript_get_td2(), $.arrayIndex(__goscript__const.__goscript_get_sbox0(), ($.uintShr(x, 8, 32)) & 0xff))) ^ $.arrayIndex(__goscript__const.__goscript_get_td3(), $.arrayIndex(__goscript__const.__goscript_get_sbox0(), x & 0xff)), 32)
			}
			$.pointerValue<__goscript_aes.blockExpanded>(c).dec[__goscriptShadow0 + j] = $.uint(x, 32)
		}
	}
}

// Generated file based on sha256block.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"

import type * as hash from "@goscript/hash/index.js"

import * as __goscript_sha256 from "./sha256.gs.ts"
import "@goscript/math/bits/index.js"
import "./sha256.gs.ts"

export var _K: number[]

export function __goscript_init__K(): void {
	if (((_K) as any) === undefined) {
		_K = [$.uint(0x428a2f98, 32), $.uint(0x71374491, 32), $.uint(0xb5c0fbcf, 32), $.uint(0xe9b5dba5, 32), $.uint(0x3956c25b, 32), $.uint(0x59f111f1, 32), $.uint(0x923f82a4, 32), $.uint(0xab1c5ed5, 32), $.uint(0xd807aa98, 32), $.uint(0x12835b01, 32), $.uint(0x243185be, 32), $.uint(0x550c7dc3, 32), $.uint(0x72be5d74, 32), $.uint(0x80deb1fe, 32), $.uint(0x9bdc06a7, 32), $.uint(0xc19bf174, 32), $.uint(0xe49b69c1, 32), $.uint(0xefbe4786, 32), $.uint(0x0fc19dc6, 32), $.uint(0x240ca1cc, 32), $.uint(0x2de92c6f, 32), $.uint(0x4a7484aa, 32), $.uint(0x5cb0a9dc, 32), $.uint(0x76f988da, 32), $.uint(0x983e5152, 32), $.uint(0xa831c66d, 32), $.uint(0xb00327c8, 32), $.uint(0xbf597fc7, 32), $.uint(0xc6e00bf3, 32), $.uint(0xd5a79147, 32), $.uint(0x06ca6351, 32), $.uint(0x14292967, 32), $.uint(0x27b70a85, 32), $.uint(0x2e1b2138, 32), $.uint(0x4d2c6dfc, 32), $.uint(0x53380d13, 32), $.uint(0x650a7354, 32), $.uint(0x766a0abb, 32), $.uint(0x81c2c92e, 32), $.uint(0x92722c85, 32), $.uint(0xa2bfe8a1, 32), $.uint(0xa81a664b, 32), $.uint(0xc24b8b70, 32), $.uint(0xc76c51a3, 32), $.uint(0xd192e819, 32), $.uint(0xd6990624, 32), $.uint(0xf40e3585, 32), $.uint(0x106aa070, 32), $.uint(0x19a4c116, 32), $.uint(0x1e376c08, 32), $.uint(0x2748774c, 32), $.uint(0x34b0bcb5, 32), $.uint(0x391c0cb3, 32), $.uint(0x4ed8aa4a, 32), $.uint(0x5b9cca4f, 32), $.uint(0x682e6ff3, 32), $.uint(0x748f82ee, 32), $.uint(0x78a5636f, 32), $.uint(0x84c87814, 32), $.uint(0x8cc70208, 32), $.uint(0x90befffa, 32), $.uint(0xa4506ceb, 32), $.uint(0xbef9a3f7, 32), $.uint(0xc67178f2, 32)]
	}
}

export function __goscript_get__K(): number[] {
	if (((_K) as any) === undefined) {
		__goscript_init__K()
	}
	return _K
}

export function __goscript_set__K(__goscriptValue: number[]): void {
	_K = __goscriptValue
}

export function blockGeneric(dig: __goscript_sha256.Digest | $.VarRef<__goscript_sha256.Digest> | null, p: $.Slice<number>): void {
	let w: number[] = Array.from({ length: 64 }, () => 0)
	let h0 = $.uint($.arrayIndex($.pointerValue<__goscript_sha256.Digest>(dig).h, 0), 32)
	let h1 = $.uint($.arrayIndex($.pointerValue<__goscript_sha256.Digest>(dig).h, 1), 32)
	let h2 = $.uint($.arrayIndex($.pointerValue<__goscript_sha256.Digest>(dig).h, 2), 32)
	let h3 = $.uint($.arrayIndex($.pointerValue<__goscript_sha256.Digest>(dig).h, 3), 32)
	let h4 = $.uint($.arrayIndex($.pointerValue<__goscript_sha256.Digest>(dig).h, 4), 32)
	let h5 = $.uint($.arrayIndex($.pointerValue<__goscript_sha256.Digest>(dig).h, 5), 32)
	let h6 = $.uint($.arrayIndex($.pointerValue<__goscript_sha256.Digest>(dig).h, 6), 32)
	let h7 = $.uint($.arrayIndex($.pointerValue<__goscript_sha256.Digest>(dig).h, 7), 32)
	while ($.len(p) >= 64) {
		let a = $.uint(h0, 32)
		let b = $.uint(h1, 32)
		let c = $.uint(h2, 32)
		let d = $.uint(h3, 32)
		let e = $.uint(h4, 32)
		let f = $.uint(h5, 32)
		let g = $.uint(h6, 32)
		let h = $.uint(h7, 32)

		for (let i = 0; i < 64; i++) {
			if (i < 16) {
				let j = i * 4
				w[i] = $.uint(((($.uint($.arrayIndex(p!, j), 32) << 24) | ($.uint($.arrayIndex(p!, j + 1), 32) << 16)) | ($.uint($.arrayIndex(p!, j + 2), 32) << 8)) | $.uint($.arrayIndex(p!, j + 3), 32), 32)
			} else {
				let v1 = $.uint($.arrayIndex(w, i - 2), 32)
				let t1 = $.uint(((bits.RotateLeft32($.uint(v1, 32), -17)) ^ (bits.RotateLeft32($.uint(v1, 32), -19))) ^ ($.uintShr(v1, 10, 32)), 32)
				let v2 = $.uint($.arrayIndex(w, i - 15), 32)
				let t2 = $.uint(((bits.RotateLeft32($.uint(v2, 32), -7)) ^ (bits.RotateLeft32($.uint(v2, 32), -18))) ^ ($.uintShr(v2, 3, 32)), 32)
				w[i] = $.uint(((t1 + $.arrayIndex(w, i - 7)) + t2) + $.arrayIndex(w, i - 16), 32)
			}

			let t1 = $.uint((((h + (((bits.RotateLeft32($.uint(e, 32), -6)) ^ (bits.RotateLeft32($.uint(e, 32), -11))) ^ (bits.RotateLeft32($.uint(e, 32), -25)))) + ((e & f) ^ ($.uint(~e, 32) & g))) + $.arrayIndex(__goscript_get__K(), i)) + $.arrayIndex(w, i), 32)

			let t2 = $.uint((((bits.RotateLeft32($.uint(a, 32), -2)) ^ (bits.RotateLeft32($.uint(a, 32), -13))) ^ (bits.RotateLeft32($.uint(a, 32), -22))) + (((a & b) ^ (a & c)) ^ (b & c)), 32)

			h = $.uint(g, 32)
			g = $.uint(f, 32)
			f = $.uint(e, 32)
			e = $.uint(d + t1, 32)
			d = $.uint(c, 32)
			c = $.uint(b, 32)
			b = $.uint(a, 32)
			a = $.uint(t1 + t2, 32)
		}

		h0 = h0 + ($.uint(a, 32))
		h1 = h1 + ($.uint(b, 32))
		h2 = h2 + ($.uint(c, 32))
		h3 = h3 + ($.uint(d, 32))
		h4 = h4 + ($.uint(e, 32))
		h5 = h5 + ($.uint(f, 32))
		h6 = h6 + ($.uint(g, 32))
		h7 = h7 + ($.uint(h, 32))

		p = $.goSlice(p, 64, undefined)
	}

	let __goscriptAssign0_0: number = $.uint(h0, 32)
	let __goscriptAssign0_1: number = $.uint(h1, 32)
	let __goscriptAssign0_2: number = $.uint(h2, 32)
	let __goscriptAssign0_3: number = $.uint(h3, 32)
	let __goscriptAssign0_4: number = $.uint(h4, 32)
	let __goscriptAssign0_5: number = $.uint(h5, 32)
	let __goscriptAssign0_6: number = $.uint(h6, 32)
	let __goscriptAssign0_7: number = $.uint(h7, 32)
	$.pointerValue<__goscript_sha256.Digest>(dig).h[0] = __goscriptAssign0_0
	$.pointerValue<__goscript_sha256.Digest>(dig).h[1] = __goscriptAssign0_1
	$.pointerValue<__goscript_sha256.Digest>(dig).h[2] = __goscriptAssign0_2
	$.pointerValue<__goscript_sha256.Digest>(dig).h[3] = __goscriptAssign0_3
	$.pointerValue<__goscript_sha256.Digest>(dig).h[4] = __goscriptAssign0_4
	$.pointerValue<__goscript_sha256.Digest>(dig).h[5] = __goscriptAssign0_5
	$.pointerValue<__goscript_sha256.Digest>(dig).h[6] = __goscriptAssign0_6
	$.pointerValue<__goscript_sha256.Digest>(dig).h[7] = __goscriptAssign0_7
}

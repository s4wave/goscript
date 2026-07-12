// Generated file based on constant_time.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as constanttime from "@goscript/crypto/internal/constanttime/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as bits from "@goscript/math/bits/index.js"
import "@goscript/crypto/internal/constanttime/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/math/bits/index.js"

export function ConstantTimeCompare(x: $.Slice<number>, y: $.Slice<number>): number {
	if ($.len(x) != $.len(y)) {
		return 0
	}

	let v: number = 0

	for (let i = 0; i < $.len(x); i++) {
		v = v | ($.uint($.arrayIndex(x!, i) ^ $.arrayIndex(y!, i), 8))
	}

	return constanttime.ByteEq($.uint(v, 8), $.uint(0, 8))
}

export function ConstantTimeLessOrEqBytes(x: $.Slice<number>, y: $.Slice<number>): number {
	if ($.len(x) != $.len(y)) {
		return 0
	}

	// Do a constant time subtraction chain y - x.
	// If there is no borrow at the end, then x <= y.
	let b: bigint = 0n
	while ($.len(x) > 8) {
		let x0 = byteorder.BEUint64($.goSlice(x, $.len(x) - 8, undefined))
		let y0 = byteorder.BEUint64($.goSlice(y, $.len(y) - 8, undefined))
		let __goscriptTuple0: any = bits.Sub64(y0, x0, b)
		b = __goscriptTuple0[1]
		x = $.goSlice(x, undefined, $.len(x) - 8)
		y = $.goSlice(y, undefined, $.len(y) - 8)
	}
	if ($.len(x) > 0) {
		let xb: $.Slice<number> = $.makeSlice<number>(8, undefined, "byte")
		let yb: $.Slice<number> = $.makeSlice<number>(8, undefined, "byte")
		$.copy($.goSlice(xb, 8 - $.len(x), undefined), x)
		$.copy($.goSlice(yb, 8 - $.len(y), undefined), y)
		let x0 = byteorder.BEUint64(xb)
		let y0 = byteorder.BEUint64(yb)
		let __goscriptTuple1: any = bits.Sub64(y0, x0, b)
		b = __goscriptTuple1[1]
	}
	return $.int($.uint64Xor(b, 1n))
}

export function ConstantTimeCopy(v: number, x: $.Slice<number>, y: $.Slice<number>): void {
	if ($.len(x) != $.len(y)) {
		$.panic("subtle: slices have different lengths")
	}

	let xmask = $.uint($.uint(v - 1, 8), 8)
	let ymask = $.uint($.uint(Number($.int64Xor((v - 1), -1n)), 8), 8)
	for (let i = 0; i < $.len(x); i++) {
		x![i] = $.uint(($.arrayIndex(x!, i) & xmask) | ($.arrayIndex(y!, i) & ymask), 8)
	}
}

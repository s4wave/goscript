// Generated file based on wide_int_shift_count.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let n = 3n
	let s = $.uint64Mul(($.uint64And(n, 1n)), 4n)

	let b = 1
	b = $.uint(b + ($.uint(((1 << globalThis.Number(s)) & 0xff), 8)), 8)
	await $.println("byte-shl-by-uint64", b)

	let v = $.uint(($.uintShr(b, s, 8)) & 0x0f, 8)
	await $.println("byte-shr-by-uint64", v)

	let w = 1
	w = $.uint(w << ($.uintFromWide(s, 16)), 16)
	await $.println("uint16-shlassign", w)

	// A compound shift of a number by a 64-bit count takes the count as a
	// number as well.
	let k = 2n
	let x = 5
	x <<= globalThis.Number(k)
	x >>= globalThis.Number(s)
	let u32: number = 0x80000000
	u32 = (u32 >>> (globalThis.Number($.uint(k, 32)))) >>> 0
	await $.println("number-shiftassign-by-int64", x, u32)

	// 64-bit values shift by constant counts.
	let wide = 18364758544493064720n
	let signed = -81985529216486895n
	await $.println("uint64-const", $.uint64Shr(wide, 1), $.uint64Shr(wide, 12), $.uint64Shr(wide, 63), $.uint64Shl(wide, 4), $.uint64Mul(wide, (2 ** 63)))
	await $.println("int64-const", $.int64Shr(signed, 1), $.int64Shr(signed, 12), $.int64Shr(signed, 63), $.int64Shl(signed, 4))
}

if ($.isMainScript(import.meta)) {
	await main()
}

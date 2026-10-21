// Generated file based on int_bitwise_wide.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function wide(): number {
	return 1099511627776
}

export async function main(): globalThis.Promise<void> {
	// Binary bitwise operators keep the bits above 32 of an int.
	let y = wide()
	let m = $.intOr(y, 0xff)
	await $.println($.intXor(y, 3), $.intAnd(y, m), $.intOr(y, 5), $.intAndNot(y, 1), $.intAndNot(m, 0xf0), (-(y) - 1))
	await $.println($.intAnd(-y, 0xffff_ffff_ffff), $.intOr(-y, 1), $.intXor(-y, -1), $.intAndNot((-y), y))

	// Shifts move bits across bit 32.
	let n = 3
	await $.println($.intShl(y, n), $.intShr(y, n), $.intShr((-y), n), 34359738368, $.intShr(($.intShl(m, 12)), n), $.intShr(m, 40))
	await $.println($.intShl(y, 12), $.intShl((-y), 12), $.intShr((-y), 45), $.intShr(y, 41))

	// Compound assignments keep the bits above 32 as well.
	let a = y
	a = $.intXor(a, 3)
	let b = y
	b = $.intAnd(b, m)
	let c = y
	c = $.intOr(c, 5)
	let d = m
	d = $.intAndNot(d, 0xf)
	let e = y
	e = $.intShl(e, n)
	let f = -y
	f = $.intShr(f, n)
	await $.println(a, b, c, d, e, f)

	// Values that fit 32 bits behave as before.
	let s = 0x7fff_ffff
	let t = -2147483648
	await $.println($.intOr(s, t), $.intAnd(s, t), $.intXor(s, t), $.intAndNot(s, t), (-(s) - 1), $.intShl(s, 1), $.intShr(t, 31), $.intShl(t, 1))

	// Bitwise results up to the edge of the safe integer range.
	let big = 9007199254740991
	await $.println($.intAnd(big, -2), $.intXor(big, 0x5555), $.intOr(big, (4503599627370496)), -big - 1, $.intAnd((big + 1), big))

	// Negative ints keep two's complement bits.
	let neg = -wide() - 7
	await $.println(neg & 0xff, $.intOr(neg, 0xf), $.intXor(neg, 0xff), $.intShr(neg, 1), (-(neg) - 1), $.intAndNot(neg, 0x7))
}

if ($.isMainScript(import.meta)) {
	await main()
}

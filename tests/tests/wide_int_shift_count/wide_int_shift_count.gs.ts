// Generated file based on wide_int_shift_count.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let n = 3n
	let s = $.uint64Mul(($.uint64And(n, 1n)), 4n)

	let b = 1
	b = $.uint(b + ($.uint((globalThis.Number(s) < 32 ? ((1 << globalThis.Number(s)) & 0xff) : 0), 8)), 8)
	await $.println("byte-shl-by-uint64", b)

	let v = $.uint(($.uintShr(b, s, 8)) & 0x0f, 8)
	await $.println("byte-shr-by-uint64", v)

	let w = 1
	w = $.uint($.narrowShl(w, ($.uintFromWide(s, 16))), 16)
	await $.println("uint16-shlassign", w)
}

if ($.isMainScript(import.meta)) {
	await main()
}

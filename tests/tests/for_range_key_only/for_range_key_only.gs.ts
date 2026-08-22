// Generated file based on for_range_key_only.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let s: $.Slice<number> = $.arrayToSlice<number>([10, 20, 30])
	await $.println("Looping over slice (key only):")
	for (let __goscriptRangeTarget0 = s, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		await $.println(i)
	}
	// Expected output:
	// 0
	// 1
	// 2

	let a = ["alpha", "beta"]
	await $.println("Looping over array (key only):")
	for (let __goscriptRangeTarget1 = a, k = 0; k < $.len(__goscriptRangeTarget1); k++) {
		await $.println(k)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

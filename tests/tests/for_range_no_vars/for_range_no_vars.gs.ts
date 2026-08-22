// Generated file based on for_range_no_vars.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let s: $.Slice<number> = $.arrayToSlice<number>([10, 20, 30])
	await $.println("Looping over slice (no vars):")
	let count = 0
	for (let __goscriptRangeTarget0 = s, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		count++
	}
	await $.println(count)

	let a = ["alpha", "beta"]
	await $.println("Looping over array (no vars):")
	let arrCount = 0
	for (let __goscriptRangeTarget1 = a, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		await $.println($.arrayIndex(a, arrCount))
		arrCount++
	}
	await $.println(arrCount)

	await $.println("Ranging over number (no vars):")
	let numCount = 0
	for (let __rangeIndex = 0; __rangeIndex < 5; __rangeIndex++) {
		numCount++
	}
	await $.println(numCount)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on float32_rounding.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let sum32: number = 0
	let sum64: number = 0
	for (let __rangeIndex = 0; __rangeIndex < 10; __rangeIndex++) {
		sum32 = $.float32(sum32 + (0.1))
		sum64 = sum64 + (0.1)
	}
	$.println("sum32:", sum32)
	$.println("sum64:", sum64)

	let onePointOne32 = $.float32(1.1)
	$.println("widened32:", onePointOne32)

	let max32: number = 3.4028234663852886e38
	let overflow32 = $.float32(max32 * 2)
	let finite64 = max32 * 2
	$.println("overflow32:", overflow32)
	$.println("finite64:", finite64)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on range_expr_evaluated_once.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let calls: number = 0

export function __goscript_set_calls(__goscriptValue: number): void {
	calls = __goscriptValue
}

export function values(): $.Slice<number> {
	calls++
	return new Uint8Array([1, 4, 5]) as $.Slice<number>
}

export async function main(): globalThis.Promise<void> {
	let sum = 0
	for (let __goscriptRangeTarget0 = $.goSlice(values(), 1, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let value = __goscriptRangeTarget0![__rangeIndex]
		sum = sum + ($.int(value))
	}
	$.println("calls:", calls)
	$.println("sum:", sum)
}

if ($.isMainScript(import.meta)) {
	await main()
}

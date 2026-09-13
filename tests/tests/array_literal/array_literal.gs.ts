// Generated file based on array_literal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// Test basic array literal
	let a: number[] = [1, 2, 3]
	await $.println($.arrayIndex(a, 0), $.arrayIndex(a, 1), $.arrayIndex(a, 2))

	// Test array literal with inferred length
	let b = ["hello", "world"]
	await $.println($.arrayIndex(b, 0), $.arrayIndex(b, 1))

	// Test array literal with specific element initialization
	let c = [0, 10, 0, 30, 0]
	await $.println($.arrayIndex(c, 0), $.arrayIndex(c, 1), $.arrayIndex(c, 2), $.arrayIndex(c, 3), $.arrayIndex(c, 4))

	// Test empty byte array literal
	let d = new Uint8Array(4)
	await $.println($.len(d), $.uint($.arrayIndex(d, 0), 8), $.uint($.arrayIndex(d, 3), 8))

	// Empty struct-array elements and repeated literals retain independent values.
	let e = Array.from({ length: 4096 }, () => ({"value": 0}))
	let f = Array.from({ length: 4096 }, () => ({"value": 0}))
	$.arrayIndex(e, 0).value = 7
	$.arrayIndex(e, 4095).value = 9
	await $.println($.len(e), $.arrayIndex(e, 0).value, $.arrayIndex(e, 1).value, $.arrayIndex(e, 4095).value, $.arrayIndex(f, 0).value)

	// Nested arrays allocate separate inner arrays for each element.
	let g = Array.from({ length: 2 }, () => Array.from({ length: 3 }, () => 0))
	$.arrayIndex(g, 0)[1] = 11
	await $.println($.arrayIndex($.arrayIndex(g, 0), 1), $.arrayIndex($.arrayIndex(g, 1), 1))
}

if ($.isMainScript(import.meta)) {
	await main()
}

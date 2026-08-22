// Generated file based on basic_arithmetic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// === Basic Arithmetic ===
	let add = 2 + 3
	let sub = 10 - 4
	let mul = 6 * 7
	let div = Math.trunc(20 / 5)
	let divTrunc = Math.trunc(5 / 2)
	let divNegative = Math.trunc(-5 / 2)
	let mod = 17 % 3
	await $.println("Addition: Expected: 5, Actual:", add)
	await $.println("Subtraction: Expected: 6, Actual:", sub)
	await $.println("Multiplication: Expected: 42, Actual:", mul)
	await $.println("Division: Expected: 4, Actual:", div)
	await $.println("Division truncates: Expected: 2, Actual:", divTrunc)
	await $.println("Division truncates negative: Expected: -2, Actual:", divNegative)
	await $.println("Modulus: Expected: 2, Actual:", mod)
}

if ($.isMainScript(import.meta)) {
	await main()
}

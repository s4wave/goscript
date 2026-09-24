// Generated file based on basic_arithmetic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// === Basic Arithmetic ===
	let add = 5
	let sub = 6
	let mul = 42
	let div = 4
	let divTrunc = 2
	let divNegative = -2
	let mod = 2
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

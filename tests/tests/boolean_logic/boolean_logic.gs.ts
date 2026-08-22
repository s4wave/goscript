// Generated file based on boolean_logic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// === Boolean Logic ===
	let a = true
	let b = false
	let and = a && b
	let or = a || b
	let notA = !a
	await $.println("AND: Expected: false, Actual:", and)
	await $.println("OR: Expected: true, Actual:", or)
	await $.println("NOT: Expected: false, Actual:", notA)
}

if ($.isMainScript(import.meta)) {
	await main()
}

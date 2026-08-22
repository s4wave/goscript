// Generated file based on for_loop_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	await $.println("Starting loop")
	for (let i = 0; i < 3; i++) {
		await $.println("Iteration:", i)
	}
	await $.println("Loop finished")

	await $.println("Starting loop")
	let x = 0
	for (let __rangeIndex = 0; __rangeIndex < 5; __rangeIndex++) {
		await $.println("Iteration:", x)
		x++
	}
	await $.println("Loop finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on for_loop_infinite.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let i = 0
	while (true) {
		await $.println("Looping forever...")
		i++
		if (i >= 3) {
			break
		}
	}
	await $.println("Loop finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}

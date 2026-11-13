// Generated file based on goroutines_anonymous.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// Start an anonymous function worker
	let msgs = $.makeChannel<string>(1, "", "both")
	$.go(async () => {
		await $.chanSend(msgs, "anonymous function worker")
	})
	await $.println(await $.chanRecv(msgs))
}

if ($.isMainScript(import.meta)) {
	await main()
}

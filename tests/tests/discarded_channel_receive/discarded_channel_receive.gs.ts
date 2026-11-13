// Generated file based on discarded_channel_receive.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let ch = $.makeChannel<number>(0, 0, "both")
	$.go(async () => {
		await $.chanSend(ch, 1)
		ch.close()
	})
	await $.chanRecv(ch)
	await $.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}

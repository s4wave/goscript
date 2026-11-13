// Generated file based on channel_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let messages = $.makeChannel<string>(0, "", "both")

	$.go(async () => {
		await $.chanSend(messages, "ping")
	})

	let msg: string = await $.chanRecv(messages)
	await $.println(msg)

	// A compound assignment keeps its operator when the operand is a receive.
	let numbers = $.makeChannel<number>(2, 0, "both")
	await $.chanSend(numbers, 3)
	await $.chanSend(numbers, 4)
	let sum = 10
	sum += await $.chanRecv(numbers)
	sum *= await $.chanRecv(numbers)
	await $.println("sum:", sum)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on for_range_channel.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let c: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(c, 0)
	c!.close()

	while (true) {
		let __goscriptRange0 = await $.chanRecvWithOk(c)
		if (!__goscriptRange0.ok) {
			break
		}
		let x = __goscriptRange0.value
		await $.println(x)
	}

	// test with = instead of := within the for range
	c = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(c, 1)
	c!.close()

	let y = 0
	while (true) {
		let __goscriptRange1 = await $.chanRecvWithOk(c)
		if (!__goscriptRange1.ok) {
			break
		}
		let __goscriptRangeKey0 = __goscriptRange1.value
		y = __goscriptRangeKey0
		await $.println(y)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

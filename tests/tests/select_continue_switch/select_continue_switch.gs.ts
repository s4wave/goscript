// Generated file based on select_continue_switch.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function run(frames: $.Channel<number> | null, done: $.Channel<string> | null): globalThis.Promise<string> {
	let command = true
	let out = ""
	while (true) {
		if (command) {
			const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, any>([
				{
					id: 0,
					isSend: false,
					channel: done,
					onSelected: async (__goscriptSelect0Result) => {
						return __goscriptSelect0Result
					}
				},
				{
					id: -1,
					isSend: false,
					channel: null,
					onSelected: async (__goscriptSelect0Result) => {
						return __goscriptSelect0Result
					}
				}
			], true)
			switch (__goscriptSelect0Value?.id) {
				case 0:
					{
						const __goscriptSelect0Result = __goscriptSelect0Value
						let result = __goscriptSelect0Result.value
						out = out + (result)
						command = false
						continue
						break
					}
				case -1:
					{
						const __goscriptSelect0Result = __goscriptSelect0Value
						break
					}
			}
		}
		const [__goscriptSelect1HasReturn, __goscriptSelect1Value] = await $.selectStatement<any, any>([
			{
				id: 0,
				isSend: false,
				channel: frames,
				onSelected: async (__goscriptSelect1Result) => {
					return __goscriptSelect1Result
				}
			},
			{
				id: 1,
				isSend: false,
				channel: done,
				onSelected: async (__goscriptSelect1Result) => {
					return __goscriptSelect1Result
				}
			}
		], false)
		switch (__goscriptSelect1Value?.id) {
			case 0:
				{
					const __goscriptSelect1Result = __goscriptSelect1Value
					let frame = __goscriptSelect1Result.value
					switch (frame) {
						case 1:
						{
							if (command) {
								out = out + ("busy ")
								continue
							}
							out = out + ("input ")
							break
						}
						case 2:
						{
							out = out + ("resize ")
							continue
							break
						}
						case 3:
						{
							return out + "close"
							break
						}
					}
					break
				}
			case 1:
				{
					const __goscriptSelect1Result = __goscriptSelect1Value
					let result = __goscriptSelect1Result.value
					out = out + (result)
					command = false
					break
				}
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function main(): globalThis.Promise<void> {
	let frames: $.Channel<number> | null = $.makeChannel<number>(3, 0, "both")
	let done: $.Channel<string> | null = $.makeChannel<string>(1, "", "both")
	await $.chanSend(frames, 2)
	await $.chanSend(frames, 1)
	await $.chanSend(frames, 3)
	await $.chanSend(done, "done ")
	$.println(await run(frames, done))
}

if ($.isMainScript(import.meta)) {
	await main()
}

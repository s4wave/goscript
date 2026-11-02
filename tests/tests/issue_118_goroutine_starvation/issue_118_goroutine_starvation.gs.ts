// Generated file based on issue_118_goroutine_starvation.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as runtime from "@goscript/runtime/index.js"
import * as time from "@goscript/time/index.js"

export async function main(): globalThis.Promise<void> {
	// A host timer must progress while another goroutine keeps yielding.
	let done = $.makeChannel<{}>(0, {}, "both")
	time.AfterFunc(1000000n, $.functionValue(() => {
		done.close()
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))

	// Gosched crosses a host task boundary rather than merely a microtask.
	while (true) {
		const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
			{
				id: 0,
				isSend: false,
				channel: done,
				onSelected: async (__goscriptSelect0Result) => {
					await $.println("host task ran")
					return $.selectVoidReturn()
				}
			},
			{
				id: -1,
				isSend: false,
				channel: null,
				onSelected: async (__goscriptSelect0Result) => {
					await runtime.Gosched()
				}
			}
		], true)
		if (__goscriptSelect0HasReturn) {
			return __goscriptSelect0Value
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

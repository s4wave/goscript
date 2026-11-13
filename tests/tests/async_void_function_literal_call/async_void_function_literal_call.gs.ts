// Generated file based on async_void_function_literal_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function wrap(fn: (() => void) | null): globalThis.Promise<(() => void) | null> {
	return $.functionValue(async () => {
		void (__goscriptAwait = fn!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		await $.println("wrapped")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
}

export async function main(): globalThis.Promise<void> {
	let ch = $.makeChannel<{}>(0, {}, "both")
	$.go(async () => {
		await $.chanSend(ch, {})
	})
	let wrapped: (() => void) | null = await wrap($.functionValue(async () => {
		await $.chanRecv(ch)
		await $.println("fn")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	void (__goscriptAwait = wrapped!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	await $.println("done")
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on defer_iife_func_literal_callee.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	let messages = $.makeChannel<string>(0, "", "both")
	$.go(async () => {
		await $.chanSend(messages, "go")
	})
	await $.println(await $.chanRecv(messages))

	await (async () => {
		await $.println("plain")
	})()

	__defer.defer(async () => { await (async () => {
		await $.println("defer")
	})() })

	let stored = $.functionValue(async () => {
		await $.println("value")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
	await stored()
}

if ($.isMainScript(import.meta)) {
	await main()
}

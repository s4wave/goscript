// Generated file based on defer_immediate_callee_eval.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function register(cb: (() => void) | null): globalThis.Promise<(() => void) | null> {
	await $.println("register")
	await cb!()
	return $.functionValue(async (): globalThis.Promise<void> => {
		await $.println("release")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
}

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	const __goscriptDeferCallee0 = await register($.functionValue(async (): globalThis.Promise<void> => {
		await $.println("callback")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	__defer.defer(async () => { await __goscriptDeferCallee0!() })
	await $.println("body")
}

if ($.isMainScript(import.meta)) {
	await main()
}

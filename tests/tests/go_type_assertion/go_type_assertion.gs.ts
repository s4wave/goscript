// Generated file based on go_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let x: any = $.interfaceValue($.functionValue(async () => {
		await $.println("goroutine executed")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)), "func()", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
	const __goscriptDeferCallee0 = $.mustTypeAssert<(() => void) | null>(x, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
	$.go(async () => { (__goscriptAwait = __goscriptDeferCallee0!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) })
	await $.println("main finished")
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on go_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let x: any = $.interfaceValue($.functionValue(async (): globalThis.Promise<void> => {
		await $.println("goroutine executed")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)), "func()", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
	queueMicrotask(async () => { await $.mustTypeAssert<(() => void) | null>(x, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))!() })
	await $.println("main finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}

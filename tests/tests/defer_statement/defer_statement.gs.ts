// Generated file based on defer_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	__defer.defer(async () => { await $.println("deferred") })
	let release: ((name: string) => void) | null = $.functionValue(async (name: string): globalThis.Promise<void> => {
		await using __defer = new $.AsyncDisposableStack()
		__defer.defer(async () => { await $.println("func deferred", name) })
		await $.println("func body", name)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] } as $.FunctionTypeInfo))
	await release!("first")
	await release!("second")
	await $.println("main")
}

if ($.isMainScript(import.meta)) {
	await main()
}

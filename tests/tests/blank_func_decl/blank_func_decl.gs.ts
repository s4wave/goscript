// Generated file based on blank_func_decl.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

function __goscriptBlankFunc0(): void {
	let x: {}[] = $.arrayValue(Array.from({ length: 1 }, () => ({})), /* @__PURE__ */ $.arrayType({ kind: $.TypeKind.Struct, methods: [], fields: [] }, 1))
	$.arrayIndex(x, 0)
}

function __goscriptBlankFunc1(): void {
	let x: {}[] = $.arrayValue(Array.from({ length: 1 }, () => ({})), /* @__PURE__ */ $.arrayType({ kind: $.TypeKind.Struct, methods: [], fields: [] }, 1))
	$.arrayIndex(x, 0)
}

export async function main(): globalThis.Promise<void> {
	await $.println("blank funcs ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}

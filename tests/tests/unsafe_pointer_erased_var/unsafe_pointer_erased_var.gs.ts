// Generated file based on unsafe_pointer_erased_var.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export let table: $.VarRef<Uint8Array> = $.varRef($.arrayValue(new Uint8Array([1, 2, 3, 4])))

export function __goscript_set_table(__goscriptValue: Uint8Array): void {
	table.value = $.assignFieldValue(table.value, __goscriptValue, __goscriptStatic0())
}

export function acceptMatrix(_p0: $.VarRef<Uint8Array[]> | null): void {
}

export async function main(): globalThis.Promise<void> {
	let ptr = (table as any)
	let bytes = ptr
	await $.println((($.pointerValue<Uint8Array>(bytes)))[2])

	ptr = (table as any)
	acceptMatrix(ptr)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4))
}

if ($.isMainScript(import.meta)) {
	await main()
}

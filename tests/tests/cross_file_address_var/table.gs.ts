// Generated file based on table.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let table: $.VarRef<number[]> = $.varRef($.arrayValue([3, 4]))

export function __goscript_set_table(__goscriptValue: number[]): void {
	table.value = $.assignFieldValue(table.value, __goscriptValue, __goscriptStatic0())
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
}

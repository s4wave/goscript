// Generated file based on q.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reg from "@goscript/github.com/s4wave/goscript/tests/tests/package_init_dependency_order/reg/index.js"

export let First: number = await reg.Add("q first")

export function __goscript_set_First(__goscriptValue: number): void {
	First = __goscriptValue
}

export let Second: number = await reg.Add("q second")

export function __goscript_set_Second(__goscriptValue: number): void {
	Second = __goscriptValue
}

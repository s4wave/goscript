// Generated file based on count.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reg from "@goscript/github.com/s4wave/goscript/tests/tests/package_init_dependency_order/reg/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_init_dependency_order/q/index.js"

export let Count: number = await reg.Add("lib count")

export function __goscript_set_Count(__goscriptValue: number): void {
	Count = __goscriptValue
}

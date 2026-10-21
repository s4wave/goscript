// Generated file based on other.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reg from "@goscript/github.com/s4wave/goscript/tests/tests/package_init_dependency_order/reg/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_init_dependency_order/lib/index.js"

export let Other: number = await reg.Add("main other")

export function __goscript_set_Other(__goscriptValue: number): void {
	Other = __goscriptValue
}

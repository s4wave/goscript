// Generated file based on package_init_dependency_order.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as lib from "@goscript/github.com/s4wave/goscript/tests/tests/package_init_dependency_order/lib/index.js"
import * as reg from "@goscript/github.com/s4wave/goscript/tests/tests/package_init_dependency_order/reg/index.js"
import * as __goscript_other from "./other.gs.ts"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_init_dependency_order/lib/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_init_dependency_order/reg/index.js"
import "./other.gs.ts"

export async function main(): globalThis.Promise<void> {
	await $.println("lib:", lib.Q, lib.Count, "main:", __goscript_other.Other)
	for (let __goscriptRangeTarget0 = reg.Names, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let name = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as string)
		await $.println("added:", name)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

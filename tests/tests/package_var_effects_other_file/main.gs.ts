// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as sort from "@goscript/sort/index.js"
import * as plugin from "@goscript/github.com/s4wave/goscript/tests/tests/package_var_effects_other_file/plugin/index.js"
import * as reg from "@goscript/github.com/s4wave/goscript/tests/tests/package_var_effects_other_file/reg/index.js"
import "./blocks.gs.ts"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_var_effects_other_file/reg/index.js"

export async function main(): globalThis.Promise<void> {
	plugin.Load()

	// The order of the registrations of different packages is not the point
	// here, so the names are sorted.
	let names = $.appendSlice<string>(null, reg.Names)
	sort.Strings(names)
	for (let __goscriptRangeTarget0 = names, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let name = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as string)
		await $.println("registered:", name)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

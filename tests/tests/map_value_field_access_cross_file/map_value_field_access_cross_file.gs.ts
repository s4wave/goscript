// Generated file based on map_value_field_access_cross_file.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as __goscript_allocate from "./allocate.gs.ts"
import * as __goscript_array from "./array.gs.ts"
import * as __goscript_literal from "./literal.gs.ts"
import * as __goscript_lookup from "./lookup.gs.ts"
import * as __goscript_read from "./read.gs.ts"
import * as __goscript_result from "./result.gs.ts"
import * as __goscript_types from "./types.gs.ts"
import * as __goscript_zero from "./zero.gs.ts"

export async function main(): globalThis.Promise<void> {
	// Read both present and absent map entries.
	await $.println(__goscript_read.ReadValue("foo"))
	let [missing, found] = __goscript_lookup.lookup($.makeMap<string, __goscript_types.Foo>([]), "missing")
	await $.println("missing:", $.stringEqual(missing.Value, ""), found)
	let __goscriptTuple0: any = __goscript_lookup.lookup($.makeMap<string, __goscript_types.Foo>([["present", new __goscript_types.Foo(true, "value")]]), "present")
	let present: __goscript_types.Foo = __goscriptTuple0[0]
	found = __goscriptTuple0[1]
	await $.println("present:", present.Value, found)

	// Exercise each constructor in a file whose only sibling reference is Foo.
	await $.println("constructors:", $.stringEqual(__goscript_zero.zero().Value, ""), __goscript_literal.literal().Value, $.stringEqual($.pointerValue<__goscript_types.Foo>(__goscript_allocate.allocate()).Value, ""))
	await $.println("zeros:", $.stringEqual(__goscript_result.result().Value, ""), $.stringEqual((__goscript_array.array())[1].Value, ""))
}

if ($.isMainScript(import.meta)) {
	await main()
}

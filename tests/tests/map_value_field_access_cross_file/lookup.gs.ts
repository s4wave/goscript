// Generated file based on lookup.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as __goscript_types from "./types.gs.ts"

export function lookup(values: globalThis.Map<string, __goscript_types.Foo> | null, key: string): [__goscript_types.Foo, boolean] {
	let [value, ok] = $.mapGet<string, __goscript_types.Foo, __goscript_types.Foo>(values, key, new __goscript_types.Foo(true))
	return [value, ok]
}

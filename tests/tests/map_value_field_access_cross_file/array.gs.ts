// Generated file based on array.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as __goscript_types from "./types.gs.ts"

export function array(): __goscript_types.Foo[] {
	let values: __goscript_types.Foo[] = $.arrayValue(globalThis.Array.from({ length: 2 }, () => new __goscript_types.Foo(true)), /* @__PURE__ */ $.arrayType("main.Foo", 2))
	return values
}

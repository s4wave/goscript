// Generated file based on read.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as __goscript_types from "./types.gs.ts"

export function ReadValue(key: string): string {
	return $.mapGet<string, __goscript_types.Foo, __goscript_types.Foo>(__goscript_types.Storage, key, new __goscript_types.Foo(true))[0].Value
}

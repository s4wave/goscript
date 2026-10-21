// Generated file based on reg.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let Names: $.Slice<string> = null! as $.Slice<string>

export function __goscript_set_Names(__goscriptValue: $.Slice<string>): void {
	Names = __goscriptValue
}

export function Add(name: string): number {
	Names = $.appendOne(Names, name)
	return $.sliceLen(Names)
}

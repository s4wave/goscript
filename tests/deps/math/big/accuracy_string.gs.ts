// Generated file based on accuracy_string.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as __goscript_float from "./float.gs.ts"
import "@goscript/strconv/index.js"
import "./float.gs.ts"

export const _Accuracy_name: string = "BelowExactAbove"

function __goscriptBlankFunc0(): void {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	$.arrayIndex(x, -1 - -1)
	$.arrayIndex(x, 0 - 0)
	$.arrayIndex(x, 1 - 1)
}

export let _Accuracy_index: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(5, 8), $.uint(10, 8), $.uint(15, 8)])

export function __goscript_set__Accuracy_index(__goscriptValue: Uint8Array): void {
	_Accuracy_index = __goscriptValue
}

export function Accuracy_String(i: __goscript_float.Accuracy): string {
	i = i - ($.int(-1, 8))
	if (($.int(i, 8) < $.int(0, 8)) || ($.int(i, 8) >= $.int($.len(_Accuracy_index) - 1, 8))) {
		return ("Accuracy(" + strconv.FormatInt($.int64(i + -1), 10)) + ")"
	}
	return $.sliceStringOrBytes("BelowExactAbove", $.arrayIndex(_Accuracy_index, i), $.arrayIndex(_Accuracy_index, i + 1))
}

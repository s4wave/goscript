// Generated file based on roundingmode_string.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as __goscript_float from "./float.gs.ts"
import "@goscript/strconv/index.js"
import "./float.gs.ts"

export const _RoundingMode_name: string = "ToNearestEvenToNearestAwayToZeroAwayFromZeroToNegativeInfToPositiveInf"

function __goscriptBlankFunc0(): void {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	$.arrayIndex(x, 0 - 0)
	$.arrayIndex(x, 1 - 1)
	$.arrayIndex(x, 2 - 2)
	$.arrayIndex(x, 3 - 3)
	$.arrayIndex(x, 4 - 4)
	$.arrayIndex(x, 5 - 5)
}

export let _RoundingMode_index: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(13, 8), $.uint(26, 8), $.uint(32, 8), $.uint(44, 8), $.uint(57, 8), $.uint(70, 8)])

export function __goscript_set__RoundingMode_index(__goscriptValue: Uint8Array): void {
	_RoundingMode_index = __goscriptValue
}

export function RoundingMode_String(i: __goscript_float.RoundingMode): string {
	if ($.uint(i, 8) >= $.uint($.len(_RoundingMode_index) - 1, 8)) {
		return ("RoundingMode(" + strconv.FormatInt($.int64(i), 10)) + ")"
	}
	return $.sliceStringOrBytes("ToNearestEvenToNearestAwayToZeroAwayFromZeroToNegativeInfToPositiveInf", $.arrayIndex(_RoundingMode_index, i), $.arrayIndex(_RoundingMode_index, i + 1))
}

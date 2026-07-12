// Generated file based on alias.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export function AnyOverlap(x: $.Slice<number>, y: $.Slice<number>): boolean {
	return ((($.len(x) > 0) && ($.len(y) > 0)) && ($.uint($.indexByteAddress(x!, 0, 1), 64) <= $.uint($.indexByteAddress(y!, $.len(y) - 1, 1), 64))) && ($.uint($.indexByteAddress(y!, 0, 1), 64) <= $.uint($.indexByteAddress(x!, $.len(x) - 1, 1), 64))
}

export function InexactOverlap(x: $.Slice<number>, y: $.Slice<number>): boolean {
	if ((($.len(x) == 0) || ($.len(y) == 0)) || ($.indexAddress(x!, 0) == $.indexAddress(y!, 0))) {
		return false
	}
	return AnyOverlap(x, y)
}

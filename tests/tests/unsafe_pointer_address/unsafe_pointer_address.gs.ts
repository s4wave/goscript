// Generated file based on unsafe_pointer_address.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export function anyOverlap(x: $.Slice<number>, y: $.Slice<number>): boolean {
	return ((($.len(x) > 0) && ($.len(y) > 0)) && ($.uint($.indexByteAddress(x!, 0, 1), 64) <= $.uint($.indexByteAddress(y!, $.len(y) - 1, 1), 64))) && ($.uint($.indexByteAddress(y!, 0, 1), 64) <= $.uint($.indexByteAddress(x!, $.len(x) - 1, 1), 64))
}

export function sameStart(x: $.Slice<number>, y: $.Slice<number>): boolean {
	return (($.len(x) > 0) && ($.len(y) > 0)) && ($.indexAddress(x!, 0) == $.indexAddress(y!, 0))
}

export function parenIndexValue(x: $.Slice<number>, i: number): number {
	return $.uint($.pointerValue<number>(($.indexRef(x!, i))), 8)
}

export async function main(): globalThis.Promise<void> {
	let buf: $.Slice<number> = new Uint8Array([1, 2, 3, 4]) as $.Slice<number>
	let left: $.Slice<number> = $.goSlice(buf, 1, 3)
	let right: $.Slice<number> = $.goSlice(buf, 2, 4)
	let other: $.Slice<number> = new Uint8Array([8, 9]) as $.Slice<number>

	$.println("overlap:", anyOverlap(left, right))
	$.println("separate:", anyOverlap(left, other))
	$.println("same:", sameStart(left, $.goSlice(buf, 1, undefined)))
	$.println("different:", sameStart(left, right))
	$.println("paren:", $.uint(parenIndexValue(buf, 2), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}

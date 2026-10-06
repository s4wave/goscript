// Generated file based on slices_grow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"
import "@goscript/slices/index.js"

export async function main(): globalThis.Promise<void> {
	let s: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3])
	await $.println("Before Grow: len=", $.len(s), "cap=", $.cap(s))
	s = (slices.Grow(s, 5) as $.Slice<number>)
	await $.println("After Grow: len=", $.len(s), "cap=", $.cap(s))

	// Growing a byte slice exposes zero bytes past its length.
	let b: $.Slice<number> = (slices.Grow(new Uint8Array([97, 98, 99]), 4) as $.Slice<number>)
	b = $.goSlice(b, undefined, $.cap(b))
	await $.println("byte Grow: zero tail=", $.uint($.arrayIndex(b!, $.len(b) - 1), 8) == 0, "kept=", $.bytesToString($.goSlice(b, undefined, 3)))
	await $.println("slices.Grow test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}

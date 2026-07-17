// Generated file based on byte_slice_equal_empty.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"
import "@goscript/bytes/index.js"

export async function main(): globalThis.Promise<void> {
	let nilBytes: $.Slice<number> = null! as $.Slice<number>
	let backing: $.Slice<number> = new Uint8Array([1]) as $.Slice<number>
	let emptyView: $.Slice<number> = $.goSlice(backing, undefined, 0)
	let otherBacking: $.Slice<number> = new Uint8Array([2]) as $.Slice<number>
	let otherEmptyView: $.Slice<number> = $.goSlice(otherBacking, undefined, 0)

	$.println("nil and view:", bytes.Equal(nilBytes, emptyView))
	$.println("views:", bytes.Equal(emptyView, otherEmptyView))
	$.println("strings:", $.stringEqual($.bytesToString(nilBytes), $.bytesToString(emptyView)))
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on nil_byte_slice_append.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let dAtA: $.Slice<number> = $.byteSliceLiteral([$.uint(10, 8), $.uint(20, 8), $.uint(30, 8), $.uint(40, 8), $.uint(50, 8)])

	// Protobuf idiom: append a sub-slice onto a truncated nil []byte. The
	// result must stay byte-specialized regardless of the nil destination.
	let dst: $.Slice<number> = null as $.Slice<number>
	dst = $.appendSlice($.goSlice(dst, undefined, 0), $.goSlice(dAtA, 1, 4), $.byteSliceHint)
	$.println("spread nil:", dst)
	$.println("spread len:", $.len(dst))

	// Individual-element append onto a nil []byte stays byte-specialized.
	let single: $.Slice<number> = null as $.Slice<number>
	single = $.append(single, $.uint(65, 8), $.uint(66, 8), $.uint(67, 8), $.byteSliceHint)
	$.println("single nil:", single)

	// Reusing a pre-made byte buffer with [:0] keeps specialization across
	// reallocation past its capacity.
	let buf: $.Slice<number> = $.makeSlice<number>(0, 2, "byte")
	buf = $.appendSlice($.goSlice(buf, undefined, 0), dAtA, $.byteSliceHint)
	$.println("reused:", buf)

	// Appending a string onto a nil []byte also stays byte-specialized.
	let text: $.Slice<number> = null as $.Slice<number>
	text = $.appendSlice(text, $.stringToBytes("Hi"), $.byteSliceHint)
	$.println("string nil:", text)
}

if ($.isMainScript(import.meta)) {
	await main()
}

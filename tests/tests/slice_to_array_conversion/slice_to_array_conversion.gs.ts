// Generated file based on slice_to_array_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let values: $.Slice<number> = new Uint8Array([1, 2, 3]) as $.Slice<number>
	let array = $.cloneArrayValue(($.sliceToArray<number>($.goSlice(values, 1, undefined), 2, "byte") as Uint8Array), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2))

	await $.println($.uint($.arrayIndex(array, 0), 8), $.uint($.arrayIndex(array, 1), 8))
	values![1] = $.uint(9, 8)
	await $.println($.uint($.arrayIndex(array, 0), 8), $.uint($.arrayIndex(values!, 1), 8))

	// Whole-array writes through converted pointers preserve the slice backing.
	let bytePointer: $.VarRef<Uint8Array> | null = ($.sliceToArrayPointer<number>($.goSlice(values, 1, undefined), 2, "byte") as $.VarRef<Uint8Array> | null)
	bytePointer!.value = new Uint8Array([7, 8])
	await $.println("byte write:", $.uint($.arrayIndex(values!, 0), 8), $.uint($.arrayIndex(values!, 1), 8), $.uint($.arrayIndex(values!, 2), 8))
	$.pointerValue<Uint8Array>(bytePointer)[0] = $.uint(6, 8)
	await $.println("byte alias:", $.uint($.arrayIndex(values!, 1), 8))

	let words: $.Slice<number> = $.arrayToSlice<number>([$.uint(1, 16), $.uint(2, 16), $.uint(3, 16), $.uint(4, 16)])
	let wordPointer: $.VarRef<number[]> | null = $.sliceToArrayPointer<number>($.goSlice(words, 1, undefined), 2)
	let replacement = [$.uint(20, 16), $.uint(30, 16)]
	wordPointer!.value = $.cloneArrayValue(replacement, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint16"), 2))
	replacement[0] = $.uint(99, 16)
	await $.println("word write:", $.uint($.arrayIndex(words!, 0), 16), $.uint($.arrayIndex(words!, 1), 16), $.uint($.arrayIndex(words!, 2), 16), $.uint($.arrayIndex(words!, 3), 16))
	$.pointerValue<number[]>(wordPointer)[1] = $.uint(40, 16)
	await $.println("word alias:", $.uint($.arrayIndex(words!, 2), 16))
}

if ($.isMainScript(import.meta)) {
	await main()
}

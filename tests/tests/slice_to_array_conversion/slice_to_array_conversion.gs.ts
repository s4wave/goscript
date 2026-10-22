// Generated file based on slice_to_array_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let values = new Uint8Array([1, 2, 3]) as $.Slice<number>
	let array = $.cloneArrayValue(($.sliceToArray<number>($.goSlice(values, 1, undefined), 2, "byte") as Uint8Array), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2))

	await $.println(array[0], array[1])
	$.sliceElems(values!)[$.sliceSlot(values!, 1)] = 9
	await $.println(array[0], $.arrayIndex(values!, 1))

	// Whole-array writes through converted pointers preserve the slice backing.
	let bytePointer = ($.sliceToArrayPointer<number>($.goSlice(values, 1, undefined), 2, "byte") as $.VarRef<Uint8Array> | null)
	$.assignFieldValue($.pointerValue<Uint8Array>(bytePointer), $.arrayValue(new Uint8Array([7, 8])), __goscriptStatic0())
	await $.println("byte write:", $.arrayIndex(values!, 0), $.arrayIndex(values!, 1), $.arrayIndex(values!, 2))
	$.pointerValue<Uint8Array>(bytePointer)[0] = 6
	await $.println("byte alias:", $.arrayIndex(values!, 1))

	let words = $.typedSliceOf(Uint16Array, [1, 2, 3, 4]) as $.Slice<number>
	let wordPointer = $.sliceToArrayPointer<number>($.goSlice(words, 1, undefined), 2)
	let replacement = $.arrayValue([20, 30])
	$.assignFieldValue($.pointerValue<number[]>(wordPointer), replacement, __goscriptStatic1())
	replacement[0] = 99
	await $.println("word write:", $.arrayIndex(words!, 0), $.arrayIndex(words!, 1), $.arrayIndex(words!, 2), $.arrayIndex(words!, 3))
	$.pointerValue<number[]>(wordPointer)[1] = 40
	await $.println("word alias:", $.arrayIndex(words!, 2))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint16"), 2))
}

if ($.isMainScript(import.meta)) {
	await main()
}

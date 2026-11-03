// Generated file based on unsafe_typed_slice_bytes.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export function floatBytes(s: $.Slice<number>): $.Slice<number> {
	if ($.sliceLen(s) == 0) {
		return null
	}
	return (unsafe.Slice!($.unsafeByteView<$.VarRef<number> | null>(($.indexRef(s!, 0) as any), __goscriptStatic0()), $.sliceLen(s) * $.int(4), "byte") as $.Slice<number>)
}

export function uintBytes(s: $.Slice<number>): $.Slice<number> {
	return (unsafe.Slice!($.unsafeByteView<$.VarRef<number> | null>((unsafe.SliceData!(s) as any), __goscriptStatic0()), $.sliceLen(s) * 4, "byte") as $.Slice<number>)
}

export async function main(): globalThis.Promise<void> {
	// The bytes are the little-endian encoding of the elements.
	let f = $.typedSliceOf(Float32Array, [1, -2, 0.5]) as $.Slice<number>
	let b = floatBytes(f)
	await $.println("float bytes:", $.sliceLen(b), $.typedSliceIndex(b!, 2), $.typedSliceIndex(b!, 3), $.typedSliceIndex(b!, 7), $.typedSliceIndex(b!, 11))

	// Writes through either side are seen by the other.
	$.sliceElems(b!)[$.sliceSlot(b!, 3)] = 0x40
	$.sliceElems(f!)[$.sliceSlot(f!, 2)] = 2
	await $.println("shared:", $.typedSliceIndex(f!, 0), $.typedSliceIndex(b!, 11))

	// A window views only its own elements.
	let u = $.typedSliceOf(Uint32Array, [0x01020304, 0x05060708, 0x090a0b0c]) as $.Slice<number>
	let w = uintBytes($.goSlice(u, 1, undefined))
	await $.println("window:", $.sliceLen(w), $.typedSliceIndex(w!, 0), $.typedSliceIndex(w!, 4))
	$.sliceElems(w!)[$.sliceSlot(w!, 0)] = 0xff
	await $.println("window write:", $.typedSliceIndex(u!, 1) == 0x050607ff)

	// The element pointer is that of the slice.
	let e = (unsafe.Slice!($.indexRef(u!, 1), 2, "uint32") as $.Slice<number>)
	$.sliceElems(e!)[$.sliceSlot(e!, 1)] = 7
	await $.println("same kind:", $.typedSliceIndex(u!, 2), $.sliceLen(e), $.cap(e))

	// The bytes of an int16 slice, and back from bytes to elements.
	let i = $.typedSliceOf(Int16Array, [-1, 256]) as $.Slice<number>
	let ib = (unsafe.Slice!($.unsafeByteView<$.VarRef<number> | null>(($.indexRef(i!, 0) as any), __goscriptStatic0()), 4, "byte") as $.Slice<number>)
	await $.println("int16 bytes:", $.typedSliceIndex(ib!, 0), $.typedSliceIndex(ib!, 1), $.typedSliceIndex(ib!, 2), $.typedSliceIndex(ib!, 3))
	await $.println("nil:", floatBytes(null) == null)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({ size: 1, align: 1, kind: "scalar", scalar: "uint8" })
}

if ($.isMainScript(import.meta)) {
	await main()
}

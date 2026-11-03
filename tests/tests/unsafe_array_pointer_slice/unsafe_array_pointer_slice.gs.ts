// Generated file based on unsafe_array_pointer_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export type shadow = Uint8Array

$.registerNamedType("main.shadow", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4));

export async function main(): globalThis.Promise<void> {
	let buf = new Uint8Array([9, 1, 2, 3, 4]) as $.Slice<number>
	let ptr = $.unsafeByteView<$.VarRef<Uint8Array> | null>(($.indexRef(buf!, 1) as any), __goscriptStatic0())
	let view = $.goSlice($.pointerValue<Uint8Array>(ptr), undefined, undefined)
	await $.println($.sliceLen(view), $.typedSliceIndex(view!, 0), $.typedSliceIndex(view!, 3))
	$.pointerValue<Uint8Array>(ptr)[2] = 7
	await $.println($.typedSliceIndex(buf!, 3))

	let __goscriptShadow0: $.VarRef<Uint8Array> = $.varRef($.arrayValue(new Uint8Array(4)))
	fill(__goscriptShadow0)
	let shadowView = $.goSlice(__goscriptShadow0.value, undefined, undefined)
	await $.println($.sliceLen(shadowView), $.typedSliceIndex(shadowView!, 0), $.typedSliceIndex(shadowView!, 3))
}

export function fill(out: $.VarRef<Uint8Array> | null): void {
	$.pointerValue<Uint8Array>(out)[0] = 5
	$.pointerValue<Uint8Array>(out)[3] = 8
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({ size: 4, align: 1, kind: "array", length: 4, element: { size: 1, align: 1, kind: "scalar", scalar: "uint8" } })
}

if ($.isMainScript(import.meta)) {
	await main()
}

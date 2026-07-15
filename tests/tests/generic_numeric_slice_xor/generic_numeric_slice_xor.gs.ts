// Generated file based on generic_numeric_slice_xor.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function xorLoop<T>(__typeArgs: $.GenericTypeArgs | undefined, dst: $.Slice<T>, x: $.Slice<T>, y: $.Slice<T>): void {
	x = $.goSlice(x, undefined, $.len(dst))
	y = $.goSlice(y, undefined, $.len(dst))
	for (let __goscriptRangeTarget0 = dst, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		dst![i] = ($.arrayIndex(x!, i) as any) ^ ($.arrayIndex(y!, i) as any)
	}
}

export async function main(): globalThis.Promise<void> {
	let dst: $.Slice<number> = new Uint8Array([0, 0]) as $.Slice<number>
	xorLoop({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "uint8" }, zero: () => 0 }}, dst, new Uint8Array([1, 3]) as $.Slice<number>, new Uint8Array([2, 1]) as $.Slice<number>)
	$.println($.uint($.arrayIndex(dst!, 0), 8), $.uint($.arrayIndex(dst!, 1), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}

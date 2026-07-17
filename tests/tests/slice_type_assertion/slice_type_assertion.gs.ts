// Generated file based on slice_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let v: any = $.interfaceValue(new Uint8Array([7, 8, 9]) as $.Slice<number>, "[]byte", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } })
	let b: $.Slice<number> = $.mustTypeAssert<$.Slice<number>>(v, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } })
	$.println("byte slice:", $.len(b), $.uint($.arrayIndex(b!, 0), 8), $.uint($.arrayIndex(b!, 2), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on named_nil_slice_interface_receiver.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type sizer = {
	Len(): number | globalThis.Promise<number>
}

$.registerInterfaceType(
	"main.sizer",
	null,
	[{ name: "Len", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export type bytesEncoder = $.Slice<number>

export function bytesEncoder_Len(b: bytesEncoder): number {
	return $.len((b as bytesEncoder))
}

export async function main(): globalThis.Promise<void> {
	let b: bytesEncoder = null! as bytesEncoder
	let s: sizer | null = $.namedValueInterfaceValue<sizer | null>(b, "main.bytesEncoder", {Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "main.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])
	$.println(await $.pointerValue<Exclude<sizer, null>>(s).Len())
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on generic_pointer_constraint_method_dispatch.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type localPairingMessage = {
	MarshalVT(__typeArgs: $.GenericTypeArgs | undefined): [$.Slice<number>, $.GoError]
	UnmarshalVT(__typeArgs: $.GenericTypeArgs | undefined, data: $.Slice<number>): $.GoError
}

$.registerInterfaceType(
	"main.localPairingMessage",
	null,
	[{ name: "MarshalVT", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "UnmarshalVT", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }]
);

export class pairingOffer {
	public get Note(): string {
		return this._fields.Note.value
	}
	public set Note(value: string) {
		this._fields.Note.value = value
	}

	public _fields: {
		Note: $.VarRef<string>
	}

	constructor(init?: Partial<{Note?: string}>) {
		this._fields = {
			Note: $.varRef(init?.Note ?? ("" as string))
		}
	}

	public clone(): pairingOffer {
		const cloned = new pairingOffer()
		cloned._fields = {
			Note: $.varRef(this._fields.Note.value)
		}
		return $.markAsStructValue(cloned)
	}

	public MarshalVT(): [$.Slice<number>, $.GoError] {
		const o: pairingOffer | $.VarRef<pairingOffer> | null = this
		return [$.stringToBytes($.pointerValue<pairingOffer>(o).Note), null]
	}

	public UnmarshalVT(data: $.Slice<number>): $.GoError {
		let o: pairingOffer | $.VarRef<pairingOffer> | null = this
		$.pointerValue<pairingOffer>(o).Note = "decoded:" + $.bytesToString(data)
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.pairingOffer",
		() => new pairingOffer(),
		[{ name: "MarshalVT", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "UnmarshalVT", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }],
		pairingOffer,
		[{ name: "Note", key: "Note", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export async function decodeLocalPairing(__typeArgs: $.GenericTypeArgs | undefined, data: $.Slice<number>): globalThis.Promise<[any, $.GoError]> {
	let msg: $.VarRef<any> = $.varRef($.genericZero(__typeArgs, "T", null))
	let err = await $.callGenericMethod(__typeArgs, "M", "UnmarshalVT", $.interfaceValue(msg, "*T", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } }), data)
	return [msg.value, err]
}

export async function encodeLocalPairing(__typeArgs: $.GenericTypeArgs | undefined, msg: any): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	return $.callGenericMethod(__typeArgs, "M", "MarshalVT", msg)
}

export async function main(): globalThis.Promise<void> {
	let __goscriptTuple0: any = await decodeLocalPairing({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, M: { type: { kind: $.TypeKind.Pointer, elemType: "main.pairingOffer" }, zero: () => null, methods: {MarshalVT: (receiver: any, ...args: any[]) => $.pointerValue(receiver).MarshalVT(...$.stripGenericTypeArgs(args)), UnmarshalVT: (receiver: any, ...args: any[]) => $.pointerValue(receiver).UnmarshalVT(...$.stripGenericTypeArgs(args))} }, T: { type: "main.pairingOffer", zero: () => $.markAsStructValue(new pairingOffer()) }}, new Uint8Array([104, 105]))
	let msg = (__goscriptTuple0[0] as pairingOffer)
	let err = __goscriptTuple0[1]
	if (err != null) {
		await $.println("decode error")
		return
	}
	await $.println(msg.Note)

	let __goscriptTuple1: any = await encodeLocalPairing({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, M: { type: { kind: $.TypeKind.Pointer, elemType: "main.pairingOffer" }, zero: () => null, methods: {MarshalVT: (receiver: any, ...args: any[]) => $.pointerValue(receiver).MarshalVT(...$.stripGenericTypeArgs(args)), UnmarshalVT: (receiver: any, ...args: any[]) => $.pointerValue(receiver).UnmarshalVT(...$.stripGenericTypeArgs(args))} }, T: { type: "main.pairingOffer", zero: () => $.markAsStructValue(new pairingOffer()) }}, new pairingOffer({Note: "note"}))
	let encoded: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		await $.println("encode error")
		return
	}
	await $.println("encoded:", $.bytesToString(encoded))
}

if ($.isMainScript(import.meta)) {
	await main()
}

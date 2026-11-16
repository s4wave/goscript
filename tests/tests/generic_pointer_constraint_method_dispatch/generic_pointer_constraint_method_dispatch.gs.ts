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
	[{ name: "MarshalVT", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "UnmarshalVT", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }]
);

export type setter = {
	Has(v: bigint): boolean
	Set(v: bigint): void
}

$.registerInterfaceType(
	"main.setter",
	null,
	[{ name: "Has", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Set", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }]
);

export type flag = bigint

$.registerNamedValueType(
	"*main.flag",
	{Has: (receiver: any, ...args: any[]) => (flag_Has as any)(receiver, ...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => (flag_Set as any)(receiver, ...$.stripGenericTypeArgs(args))},
	[$.methodSignature("Has", [["v", /* @__PURE__ */ $.basicType("int64")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Set", [["v", /* @__PURE__ */ $.basicType("int64")]])]
);

export type flagConstraint = any

$.registerInterfaceType(
	"main.flagConstraint",
	null,
	[]
);

export class pairingOffer {
	public declare Note: string

	constructor(__goscriptValue?: boolean, Note$?: string) {
		this.Note = Note$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): pairingOffer {
		return new pairingOffer(true, this.Note)
	}

	public __goscriptAssign(source: pairingOffer): this {
		this.Note = source.Note
		return this
	}

	public MarshalVT(): [$.Slice<number>, $.GoError] {
		const o: pairingOffer | $.VarRef<pairingOffer> | null = this;
		return [$.stringToBytes($.pointerValue<pairingOffer>(o).Note), null]
	}

	public UnmarshalVT(data: $.Slice<number>): $.GoError {
		const o: pairingOffer | $.VarRef<pairingOffer> | null = this;
		$.pointerValue<pairingOffer>(o).Note = "decoded:" + $.bytesToString(data)
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.pairingOffer",
		() => new pairingOffer(),
		() => [{ name: "MarshalVT", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }], pointerReceiver: true }, { name: "UnmarshalVT", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }], pointerReceiver: true }],
		pairingOffer,
		() => [{ name: "Note", key: "Note", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function decodeLocalPairing(__typeArgs: $.GenericTypeArgs | undefined, data: $.Slice<number>): globalThis.Promise<[any, $.GoError]> {
	let msg: $.VarRef<any> = $.varRef($.genericZero(__typeArgs, "T", null))
	let err = (__goscriptAwait = $.callGenericMethod(__typeArgs, "M", "UnmarshalVT", $.genericInterfaceValue(msg, "*T", /* @__PURE__ */ $.pointerType(__typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] })), data), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	return [$.copyElement(msg.value), err]
}

export async function encodeLocalPairing(__typeArgs: $.GenericTypeArgs | undefined, msg: any): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	return $.callGenericMethod(__typeArgs, "M", "MarshalVT", msg)
}

export function flag_Has(f: $.VarRef<flag> | null, v: bigint): boolean {
	return ($.int64And($.pointerValue<flag>(f), v)) != 0n
}

export function flag_Set(f: $.VarRef<flag> | null, v: bigint): void {
	f!.value = ($.int64Or($.pointerValue<flag>(f), v))
}

export function countFlags(__typeArgs: $.GenericTypeArgs | undefined, __goscriptParam0: any, values: $.Slice<bigint>): bigint {
	let i: $.VarRef<any> = $.varRef(__goscriptParam0)
	let p = $.mustTypeAssert<setter | null>($.typeParamPointerInterfaceValue(i, __typeArgs?.["T"], "*T", /* @__PURE__ */ $.pointerType(__typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] })), "main.setter")
	let n = 0n
	for (let __goscriptRangeTarget0 = values, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let v = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as bigint)
		if ((p !== null && (p as any).__isVarRef !== true && ((p as any).__goValue === undefined || (p as any).__goType?.charCodeAt(0) !== 42) ? (p as Exclude<setter, null>) : $.pointerValue<Exclude<setter, null>>(p)).Has(v)) {
			n = $.int64Add(n, 1n)
		}
	}
	void (p !== null && (p as any).__isVarRef !== true && ((p as any).__goValue === undefined || (p as any).__goType?.charCodeAt(0) !== 42) ? (p as Exclude<setter, null>) : $.pointerValue<Exclude<setter, null>>(p)).Set(8n)
	return $.int64Add(n, $.int64(i.value))
}

export async function main(): globalThis.Promise<void> {
	let __goscriptTuple0: any = await decodeLocalPairing(__goscriptStatic0(), new Uint8Array([104, 105]))
	let msg: pairingOffer = (__goscriptTuple0[0] as pairingOffer)
	let err: $.GoError = __goscriptTuple0[1]
	if (err != null) {
		await $.println("decode error")
		return
	}
	await $.println(msg.Note)

	let __goscriptTuple1: any = await encodeLocalPairing(__goscriptStatic0(), new pairingOffer(false, "note"))
	let encoded: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		await $.println("encode error")
		return
	}
	await $.println("encoded:", $.bytesToString(encoded))

	await $.println("count:", countFlags(__goscriptStatic1(), 3n, $.arrayToSlice<bigint>([1n, 2n, 4n])))
	let fl: $.VarRef<flag> = $.varRef(1n)
	{
		let [s, ok] = $.typeAssertTuple<setter | null>($.namedValueInterfaceValue<any>(fl, "*main.flag", __goscriptStatic2(), __goscriptStatic3(), __goscriptStatic4()), "main.setter")
		if (ok) {
			void (__goscriptAwait = (s !== null && (s as any).__isVarRef !== true && ((s as any).__goValue === undefined || (s as any).__goType?.charCodeAt(0) !== 42) ? (s as Exclude<setter, null>) : $.pointerValue<Exclude<setter, null>>(s)).Set(2n), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		}
	}
	await $.println("flag:", fl.value)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, M: { type: /* @__PURE__ */ $.pointerType("main.pairingOffer"), zero: () => null, methods: {MarshalVT: (receiver: any) => $.pointerValue(receiver).MarshalVT(), UnmarshalVT: (receiver: any, ...args: any[]) => $.pointerValue(receiver).UnmarshalVT(...$.stripGenericTypeArgs(args))} }, T: { type: "main.pairingOffer", zero: () => new pairingOffer(true) }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64", "main.flag"), zero: () => 0n }})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({Has: (receiver: any, ...args: any[]) => (flag_Has as any)(receiver, ...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => (flag_Set as any)(receiver, ...$.stripGenericTypeArgs(args))})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= (/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int64", "main.flag")))
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ([$.methodSignature("Has", [["v", /* @__PURE__ */ $.basicType("int64")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Set", [["v", /* @__PURE__ */ $.basicType("int64")]])])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

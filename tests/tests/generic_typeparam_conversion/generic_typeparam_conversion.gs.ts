// Generated file based on generic_typeparam_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Signed = any

$.registerInterfaceType(
	"main.Signed",
	null,
	[]
);

export type Unsigned = any

$.registerInterfaceType(
	"main.Unsigned",
	null,
	[]
);

export type Integer = any

$.registerInterfaceType(
	"main.Integer",
	null,
	[]
);

export type Enum = {
	String(): string
}

$.registerInterfaceType(
	"main.Enum",
	null,
	[{ name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export type EnumConstraint = {
	String(): string
}

$.registerInterfaceType(
	"main.EnumConstraint",
	null,
	[{ name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export type Base = number

$.registerNamedValueType(
	"main.Base",
	{String: (receiver: any) => (Base_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

$.registerNamedValueType(
	"*main.Base",
	{String: (receiver: any) => (Base_String as any)($.pointerValue(receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

export type Extended = number

$.registerNamedValueType(
	"main.Extended",
	{String: (receiver: any) => (Extended_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

$.registerNamedValueType(
	"*main.Extended",
	{String: (receiver: any) => (Extended_String as any)($.pointerValue(receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

export type Wide = bigint

$.registerNamedValueType(
	"main.Wide",
	{String: (receiver: any) => (Wide_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

$.registerNamedValueType(
	"*main.Wide",
	{String: (receiver: any) => (Wide_String as any)($.pointerValue(receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

export function Base_String(b: Base): string {
	return "base"
}

export function Extended_String(e: Extended): string {
	return "extended"
}

export function valuesExtended<T, E>(__typeArgs: $.GenericTypeArgs | undefined, values: $.Slice<T>, extended: $.Slice<E>): $.Slice<T> {
	let res: $.Slice<T> = $.makeSlice<T>($.sliceLen(extended), undefined, $.genericSliceTypeHint(__typeArgs, "T"), () => ($.genericZero(__typeArgs, "T", null) as T))
	for (let __goscriptRangeTarget0 = extended, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __goscriptSliceWindow0 = $.sliceRange(res), i = 0; i < __goscriptRangeWindow0.length; i++) {
		let e = $.copyElement((__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + i] as any));
		;(__goscriptSliceWindow0.backing as any[])[$.windowSlot(__goscriptSliceWindow0, i)] = $.genericConvert<T>(__typeArgs, "T", e)
	}
	res = $.appendSlice(res, values, $.appendZero(() => ($.genericZero(__typeArgs, "T", null) as T)))
	return res
}

export function Wide_String(w: Wide): string {
	return "wide"
}

export function toWide(__typeArgs: $.GenericTypeArgs | undefined, e: any): any {
	return $.genericConvert<any>(__typeArgs, "T", e)
}

export function fromUint64(__typeArgs: $.GenericTypeArgs | undefined, u: bigint): any {
	return $.genericConvert<any>(__typeArgs, "T", u)
}

export function fromConst(__typeArgs: $.GenericTypeArgs | undefined, i: number): [any, any] {
	return [$.genericConvert<any>(__typeArgs, "T", 7), $.genericConvert<any>(__typeArgs, "T", i)]
}

export async function main(): globalThis.Promise<void> {
	let res = (valuesExtended(__goscriptStatic0(), ($.typedSliceOf(Int32Array, [0, 1]) as $.Slice<Base>), ($.typedSliceOf(Int32Array, [2, 3, 4]) as $.Slice<Extended>)) as $.Slice<Base>)
	for (let __goscriptRangeTarget1 = res, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let v = $.int((__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as Base), 32)
		await $.println(v, Base_String(v))
	}
	let w = (toWide(__goscriptStatic1(), 5) as Wide)
	await $.println($.int64Mul(w, 2n), Wide_String(w))
	let __goscriptTuple0: any = fromConst(__goscriptStatic2(), 9)
	let a: Wide = (__goscriptTuple0[0] as Wide)
	let b: Wide = (__goscriptTuple0[1] as Wide)
	await $.println($.int64Add(a, b))
	let __goscriptTuple1: any = fromConst(__goscriptStatic3(), 300)
	let c: number = (__goscriptTuple1[0] as number)
	let d: number = (__goscriptTuple1[1] as number)
	await $.println(c, d)
	let u = 18446744073709551609n
	await $.println(fromUint64(__goscriptStatic4(), u), fromUint64(__goscriptStatic5(), u), fromUint64(__goscriptStatic6(), u))
	await $.println(fromUint64(__goscriptStatic4(), u) % 3)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int32", "main.Base"), zero: () => 0, methods: {String: (receiver: any) => (Base_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))}, methodSignatures: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }, E: { type: /* @__PURE__ */ $.basicType("int32", "main.Extended"), zero: () => 0, methods: {String: (receiver: any) => (Extended_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))}, methodSignatures: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64", "main.Wide"), zero: () => 0n, methods: {String: (receiver: any) => (Wide_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))}, methodSignatures: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }, E: { type: /* @__PURE__ */ $.basicType("int32", "main.Extended"), zero: () => 0, methods: {String: (receiver: any) => (Extended_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))}, methodSignatures: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64", "main.Wide"), zero: () => 0n, methods: {String: (receiver: any) => (Wide_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))}, methodSignatures: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("uint8"), zero: () => 0 }})
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int64"), zero: () => 0n }})
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int32"), zero: () => 0 }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

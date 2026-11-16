// Generated file based on named_basic_interface_assert.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as json from "@goscript/encoding/json/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as reflect from "@goscript/reflect/index.js"
import * as strings from "@goscript/strings/index.js"
import type * as io from "@goscript/io/index.js"

export type MyInt = number

export type Name = string

export type Stringy = string

$.registerNamedValueType(
	"main.Stringy",
	{String: (receiver: any) => (Stringy_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

$.registerNamedValueType(
	"*main.Stringy",
	{String: (receiver: any) => (Stringy_String as any)($.pointerValue(receiver))},
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

export type stringer = {
	String(): string
}

$.registerInterfaceType(
	"main.stringer",
	null,
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

export type FormatError = string

$.registerNamedValueType(
	"main.FormatError",
	{Error: (receiver: any) => (FormatError_Error as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("Error", [], [/* @__PURE__ */ $.basicType("string")])]
);

$.registerNamedValueType(
	"*main.FormatError",
	{Error: (receiver: any) => (FormatError_Error as any)($.pointerValue(receiver))},
	[$.methodSignature("Error", [], [/* @__PURE__ */ $.basicType("string")])]
);

export type Code = number

$.registerNamedValueType(
	"main.Code",
	{Error: (receiver: any) => (Code_Error as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("Error", [], [/* @__PURE__ */ $.basicType("string")])]
);

$.registerNamedValueType(
	"*main.Code",
	{Error: (receiver: any) => (Code_Error as any)($.pointerValue(receiver))},
	[$.methodSignature("Error", [], [/* @__PURE__ */ $.basicType("string")])]
);

export const errConst: FormatError = "const"

export function Stringy_String(s: Stringy): string {
	return "S:" + s
}

export function FormatError_Error(e: FormatError): string {
	return "format: " + e
}

export function Code_Error(c: Code): string {
	return "code"
}

export let errMissing: FormatError = "missing"

export function __goscript_set_errMissing(__goscriptValue: FormatError): void {
	errMissing = __goscriptValue
}

export function _get(i: number): $.GoError {
	switch (i) {
		case 0:
		{
			return $.namedValueInterfaceValue<$.GoError>(errMissing, "main.FormatError", {"Error": FormatError_Error}, /* @__PURE__ */ $.basicType("string", "main.FormatError"))
			break
		}
		case 1:
		{
			return $.namedValueInterfaceValue<$.GoError>("const", "main.FormatError", {"Error": FormatError_Error}, /* @__PURE__ */ $.basicType("string", "main.FormatError"))
			break
		}
		case 2:
		{
			return $.namedValueInterfaceValue<$.GoError>(3, "main.Code", {"Error": Code_Error}, /* @__PURE__ */ $.basicType("int", "main.Code"))
			break
		}
	}
	return null
}

export function toAny(__typeArgs: $.GenericTypeArgs | undefined, v: any): any {
	return $.typeParamInterfaceValue<any>(v, __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null })
}

export function toStringer(__typeArgs: $.GenericTypeArgs | undefined, v: any): stringer | null {
	return $.typeParamInterfaceValue<stringer | null>(v, __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }, zero: () => null })
}

export function kind(v: any): string {
	{
		const __goscriptTypeSwitchValue = v
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic0())) {
			case 0:
				{
					return "json.Number"
				}
				break
			case 1:
				{
					return "Name"
				}
				break
			case 2:
				{
					return "MyInt"
				}
				break
			case 3:
				{
					return "string"
				}
				break
			case 4:
				{
					return "int32"
				}
				break
			case 5:
				{
					return "int"
				}
				break
		}
	}
	return "other"
}

export async function main(): globalThis.Promise<void> {
	let a: any = $.namedValueInterfaceValue<any>(5, "main.MyInt", {}, /* @__PURE__ */ $.basicType("int32", "main.MyInt"))
	let [, ok] = $.typeAssertTuple<MyInt>(a, /* @__PURE__ */ $.basicType("int32", "main.MyInt"))
	await $.println("MyInt as MyInt:", ok)
	let __goscriptTuple0: any = $.typeAssertTuple<number>(a, /* @__PURE__ */ $.basicType("int32"))
	ok = __goscriptTuple0[1]
	await $.println("MyInt as int32:", ok)
	let b: any = $.basicInterfaceValue(5, "int32")
	let __goscriptTuple1: any = $.typeAssertTuple<MyInt>(b, /* @__PURE__ */ $.basicType("int32", "main.MyInt"))
	ok = __goscriptTuple1[1]
	await $.println("int32 as MyInt:", ok)

	for (let __goscriptRangeTarget0 = $.arrayToSlice<any>(["s", $.namedValueInterfaceValue<any>("n", "main.Name", {}, /* @__PURE__ */ $.basicType("string", "main.Name")), $.namedValueInterfaceValue<any>(globalThis.String("1"), "json.Number", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3()), $.namedValueInterfaceValue<any>(1, "main.MyInt", {}, /* @__PURE__ */ $.basicType("int32", "main.MyInt")), $.basicInterfaceValue(2, "int32"), $.basicInterfaceValue(3, "int")]), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let v = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as any)
		await $.println("switch:", kind(v))
	}

	await $.println("generic:", kind(toAny(__goscriptStatic4(), 6)), kind(toAny(__goscriptStatic5(), "g")), kind(toAny(__goscriptStatic6(), "raw")))
	await $.println("generic stringer:", (__goscriptAwait = $.pointerValue<Exclude<stringer, null>>(toStringer(__goscriptStatic7(), "q")).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	let __goscriptTuple2: any = $.typeAssertTuple<stringer | null>(toAny(__goscriptStatic7(), "r"), "main.stringer")
	ok = __goscriptTuple2[1]
	await $.println("generic any stringer:", ok)

	await $.println("reflect:", kind(reflect.ValueOf($.namedValueInterfaceValue<any>(7, "main.MyInt", {}, /* @__PURE__ */ $.basicType("int32", "main.MyInt"))).Interface()), (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf(a)).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	class holder {
		public declare N: Name

		public declare Is: $.Slice<MyInt>

		constructor(init?: Partial<{N?: Name, Is?: $.Slice<MyInt>}>, __goscriptValue?: boolean) {
			this.N = init?.N ?? ("" as Name)
			this.Is = init?.Is ?? (null! as $.Slice<MyInt>)
			;(this as any).__goStructValue = __goscriptValue === true
		}

		public clone(): holder {
			return new holder(this, true)
		}

		public __goscriptAssign(source: holder): this {
			this.N = source.N
			this.Is = source.Is
			return this
		}

		static __typeInfo = $.registerStructType(
			"main.holder",
			() => new holder(),
			() => [],
			holder,
			() => [/* @__PURE__ */ $.structField("N", /* @__PURE__ */ $.basicType("string", "main.Name"), [0], 0, true), /* @__PURE__ */ $.structField("Is", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32", "main.MyInt")), [1], 16, true)]
		)
	}
	let hv = reflect.ValueOf($.structInterfaceValue($.markAsStructValue(new holder({N: "h", Is: ($.typedSliceOf(Int32Array, [9]) as $.Slice<MyInt>)})), "main.holder", "main.holder"))
	await $.println("reflect field:", kind(hv.Field(0).Interface()), kind(hv.Field(1).Index(0).Interface()))

	await $.println("equal:", $.comparableEqual(a, $.namedValueInterfaceValue<any>(5, "main.MyInt", {}, /* @__PURE__ */ $.basicType("int32", "main.MyInt"))), $.comparableEqual(a, b), $.comparableEqual(a, $.namedValueInterfaceValue<any>(6, "main.MyInt", {}, /* @__PURE__ */ $.basicType("int32", "main.MyInt"))))

	let m = $.makeMap<string, Name>([["k", "v"]])
	let am: any = $.interfaceValue(m, "map[string]main.Name", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string", "main.Name")))
	let __goscriptTuple3: any = $.typeAssertTuple<globalThis.Map<string, Name> | null>(am, /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string", "main.Name")))
	ok = __goscriptTuple3[1]
	await $.println("map:", ok)

	let d = json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(strings.NewReader("{\"n\": 12}"), "*strings.Reader", __goscriptStatic8()))!)
	void (d !== null && (d as any).__isVarRef !== true && (d as any).__goValue === undefined ? ((d as any) as json.Decoder).UseNumber() : json.Decoder.prototype.UseNumber.call($.pointerValue<json.Decoder>(d)))
	let obj: $.VarRef<globalThis.Map<string, any> | null> = $.varRef(null! as globalThis.Map<string, any> | null)
	{
		let err = await json.Decoder.prototype.Decode.call($.pointerValue<json.Decoder>(d), $.interfaceValue(obj, "*map[string]interface{}", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] }))))
		if (err != null) {
			await $.println((__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		}
	}
	await $.println("json UseNumber:", kind($.mapGet<string, any, any>(obj.value, "n", null)[0]))

	await $.println("fmt:", (fmt.Sprint($.namedValueInterfaceValue<any>(8, "main.MyInt", {}, /* @__PURE__ */ $.basicType("int32", "main.MyInt")), " ", $.namedValueInterfaceValue<any>("p", "main.Name", {}, /* @__PURE__ */ $.basicType("string", "main.Name")), " ", a) as string))

	// A named basic value equals an interface holding it.
	let err = _get(0)
	await $.println("var eq:", $.comparableEqual(err, $.namedValueInterfaceValue<$.GoError>(errMissing, "main.FormatError", {"Error": FormatError_Error}, /* @__PURE__ */ $.basicType("string", "main.FormatError"))), !$.comparableEqual(err, $.namedValueInterfaceValue<$.GoError>(errMissing, "main.FormatError", {"Error": FormatError_Error}, /* @__PURE__ */ $.basicType("string", "main.FormatError"))), $.comparableEqual($.namedValueInterfaceValue<$.GoError>(errMissing, "main.FormatError", {"Error": FormatError_Error}, /* @__PURE__ */ $.basicType("string", "main.FormatError")), err))
	await $.println("const eq:", $.comparableEqual(_get(1), $.namedValueInterfaceValue<$.GoError>("const", "main.FormatError", {"Error": FormatError_Error}, /* @__PURE__ */ $.basicType("string", "main.FormatError"))), !$.comparableEqual(_get(1), $.namedValueInterfaceValue<$.GoError>("const", "main.FormatError", {"Error": FormatError_Error}, /* @__PURE__ */ $.basicType("string", "main.FormatError"))))
	await $.println("other:", $.comparableEqual(_get(1), $.namedValueInterfaceValue<$.GoError>(errMissing, "main.FormatError", {"Error": FormatError_Error}, /* @__PURE__ */ $.basicType("string", "main.FormatError"))), $.comparableEqual(_get(2), $.namedValueInterfaceValue<$.GoError>(3, "main.Code", {"Error": Code_Error}, /* @__PURE__ */ $.basicType("int", "main.Code"))), $.comparableEqual(_get(2), $.namedValueInterfaceValue<$.GoError>(4, "main.Code", {"Error": Code_Error}, /* @__PURE__ */ $.basicType("int", "main.Code"))))
	let e2: $.GoError = $.namedValueInterfaceValue<$.GoError>("missing", "main.FormatError", {"Error": FormatError_Error}, /* @__PURE__ */ $.basicType("string", "main.FormatError"))
	await $.println("boxed eq:", $.comparableEqual(err, e2))
	let ae: any = $.namedValueInterfaceValue<any>(errMissing, "main.FormatError", __goscriptStatic9(), __goscriptStatic10(), __goscriptStatic11())
	await $.println("any eq:", $.comparableEqual(ae, $.namedValueInterfaceValue<any>(errMissing, "main.FormatError", __goscriptStatic9(), __goscriptStatic10(), __goscriptStatic11())), $.comparableEqual(ae, "missing"))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.basicType("string", "json.Number"), /* @__PURE__ */ $.basicType("string", "main.Name"), /* @__PURE__ */ $.basicType("int32", "main.MyInt"), /* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int32"), /* @__PURE__ */ $.basicType("int")]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({Float64: (receiver: any) => (json.Number_Float64 as any)(($.isVarRef(receiver) ? receiver.value : receiver)), Int64: (receiver: any) => (json.Number_Int64 as any)(($.isVarRef(receiver) ? receiver.value : receiver)), MarshalJSONTo: (receiver: any, ...args: any[]) => (json.Number_MarshalJSONTo as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), String: (receiver: any) => (json.Number_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (/* @__PURE__ */ $.basicType("string", "json.Number"))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([$.methodSignature("Float64", [], [/* @__PURE__ */ $.basicType("float64"), "error"]), $.methodSignature("Int64", [], [/* @__PURE__ */ $.basicType("int64"), "error"]), $.methodSignature("MarshalJSONTo", [["enc", /* @__PURE__ */ $.pointerType("jsontext.Encoder")]], ["error"]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])])
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int32", "main.MyInt"), zero: () => 0 }})
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string", "main.Name"), zero: () => "" }})
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }})
}

var __goscriptStatic7$value: any
function __goscriptStatic7(): any {
	return __goscriptStatic7$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string", "main.Stringy"), zero: () => "", methods: {String: (receiver: any) => (Stringy_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))}, methodSignatures: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }})
}

var __goscriptStatic8$value: any
function __goscriptStatic8(): any {
	return __goscriptStatic8$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("strings.Reader"), "strings.Reader", () => [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Read", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadAt", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["off", /* @__PURE__ */ $.basicType("int64")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadRune", [], [["ch", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("Reset", [["s", /* @__PURE__ */ $.basicType("string")]], [], true), $.methodSignature("Seek", [["offset", /* @__PURE__ */ $.basicType("int64")], ["whence", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int64"), "error"], true), $.methodSignature("Size", [], [/* @__PURE__ */ $.basicType("int64")], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

var __goscriptStatic9$value: any
function __goscriptStatic9(): any {
	return __goscriptStatic9$value ??= ({Error: (receiver: any) => (FormatError_Error as any)(($.isVarRef(receiver) ? receiver.value : receiver))})
}

var __goscriptStatic10$value: any
function __goscriptStatic10(): any {
	return __goscriptStatic10$value ??= (/* @__PURE__ */ $.basicType("string", "main.FormatError"))
}

var __goscriptStatic11$value: any
function __goscriptStatic11(): any {
	return __goscriptStatic11$value ??= ([$.methodSignature("Error", [], [/* @__PURE__ */ $.basicType("string")])])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on reflect_make_func.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export async function main(): globalThis.Promise<void> {
	let intType = reflect.TypeFor(__goscriptStatic0())
	let stringType = reflect.TypeFor(__goscriptStatic1())
	let boolType = reflect.TypeFor(__goscriptStatic2())

	let unaryType = reflect.FuncOf($.arrayToSlice<reflect.Type | null>([intType]), $.arrayToSlice<reflect.Type | null>([stringType]), false)
	let unaryValue = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(unaryType)!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		return $.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf("value-" + $.runeToString($.intFromWide($.int64Add(48n, $.markAsStructValue($.cloneStructValue($.arrayIndex(args!, 0))).Int()), 32)))))])
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType("reflect.Value")], results: [/* @__PURE__ */ $.sliceType("reflect.Value")] } as $.FunctionTypeInfo)))))
	let unary: ((_p0: number) => string | globalThis.Promise<string>) | null = $.mustTypeAssert<((_p0: number) => string | globalThis.Promise<string>) | null>($.markAsStructValue($.cloneStructValue(unaryValue)).Interface(), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("string")] } as $.FunctionTypeInfo))
	await $.println("direct:", (__goscriptAwait = unary!(7), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	let reflectedUnary = await $.markAsStructValue($.cloneStructValue(unaryValue)).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(8, "int"))))]))
	await $.println("reflected:", $.markAsStructValue($.cloneStructValue($.arrayIndex(reflectedUnary!, 0))).String())
	let [, wrong] = $.typeAssertTuple<((_p0: string) => string | globalThis.Promise<string>) | null>($.markAsStructValue($.cloneStructValue(unaryValue)).Interface(), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("string")] } as $.FunctionTypeInfo))
	await $.println("wrong assertion:", wrong)

	let zeroType = reflect.FuncOf(null, null, false)
	let zeroCalled = false
	let zeroValue = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(zeroType)!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		zeroCalled = true
		return null
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType("reflect.Value")], results: [/* @__PURE__ */ $.sliceType("reflect.Value")] } as $.FunctionTypeInfo)))))
	void (__goscriptAwait = $.mustTypeAssert<(() => void) | null>($.markAsStructValue($.cloneStructValue(zeroValue)).Interface(), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	await $.println("zero:", zeroCalled)

	let tupleType = reflect.FuncOf(null, $.arrayToSlice<reflect.Type | null>([intType, boolType]), false)
	let tupleValue = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(tupleType)!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		return $.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(3, "int")))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf(true)))])
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType("reflect.Value")], results: [/* @__PURE__ */ $.sliceType("reflect.Value")] } as $.FunctionTypeInfo)))))
	let tuple: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null = $.mustTypeAssert<(() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null>($.markAsStructValue($.cloneStructValue(tupleValue)).Interface(), ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))
	let [_number, ok] = await tuple!()
	await $.println("tuple direct:", _number, ok)
	let reflectedTuple = await $.markAsStructValue($.cloneStructValue(tupleValue)).Call(null)
	await $.println("tuple reflected:", $.markAsStructValue($.cloneStructValue($.arrayIndex(reflectedTuple!, 0))).Int(), $.markAsStructValue($.cloneStructValue($.arrayIndex(reflectedTuple!, 1))).Bool())

	let variadicType = reflect.FuncOf($.arrayToSlice<reflect.Type | null>([intType, reflect.SliceOf($.pointerValueOrNil(stringType)!)]), $.arrayToSlice<reflect.Type | null>([intType]), true)
	let variadicValue = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(variadicType)!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		return $.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue($.int64ToNumber($.markAsStructValue($.cloneStructValue($.arrayIndex(args!, 0))).Int()) + $.markAsStructValue($.cloneStructValue($.arrayIndex(args!, 1))).Len(), "int"))))])
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType("reflect.Value")], results: [/* @__PURE__ */ $.sliceType("reflect.Value")] } as $.FunctionTypeInfo)))))
	let variadic: ((_p0: number, _p1: $.Slice<string>) => number | globalThis.Promise<number>) | null = $.mustTypeAssert<((_p0: number, _p1: $.Slice<string>) => number | globalThis.Promise<number>) | null>($.markAsStructValue($.cloneStructValue(variadicValue)).Interface(), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))], results: [/* @__PURE__ */ $.basicType("int")], isVariadic: true } as $.FunctionTypeInfo))
	await $.println("variadic direct:", (__goscriptAwait = variadic!(10, $.arrayToSlice<string>(["a", "b"])), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	let reflectedVariadic = await $.markAsStructValue($.cloneStructValue(variadicValue)).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(20, "int")))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf("a"))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf("b"))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf("c")))]))
	await $.println("variadic reflected:", $.markAsStructValue($.cloneStructValue($.arrayIndex(reflectedVariadic!, 0))).Int())
	let reflectedSlice = await $.markAsStructValue($.cloneStructValue(variadicValue)).CallSlice($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(30, "int")))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.arrayToSlice<string>(["a", "b"]), "[]string", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))))))]))
	await $.println("variadic callslice:", $.markAsStructValue($.cloneStructValue($.arrayIndex(reflectedSlice!, 0))).Int())

	await $.println("reflect_make_func test finished")
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("bool"), zero: () => false }})
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

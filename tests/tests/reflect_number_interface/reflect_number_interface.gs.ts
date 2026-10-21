// Generated file based on reflect_number_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export function kind(v: any): string {
	{
		const __goscriptTypeSwitchValue = v
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic0())) {
			case 0:
				{
					return "float32"
				}
				break
			case 1:
				{
					return "float64"
				}
				break
			case 2:
				{
					return "int"
				}
				break
		}
	}
	return "other"
}

export function kinds(vals: $.Slice<any>): string {
	let s = ""
	for (let __goscriptRangeTarget0 = vals, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let v = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as any)
		s += kind(v) + " "
	}
	return s
}

export async function main(): globalThis.Promise<void> {
	// A float64 with an integer value keeps its type through Interface, as
	// interpreters such as yaegi make their constants and variables.
	let v = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic1()))!))).Elem()))
	$.markAsStructValue($.cloneStructValue(v)).SetFloat(3)
	await $.println(kind($.markAsStructValue($.cloneStructValue(v)).Interface()))
	await $.println(kind($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(2, "int")))).Convert($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic1()))!))).Interface()))

	// An int keeps its type too: a type switch with a float32 case before
	// the int case takes it for an int.
	let i = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic2()))!))).Elem()))
	$.markAsStructValue($.cloneStructValue(i)).SetInt(3n)
	let [, isFloat32] = $.typeAssertTuple<number>($.markAsStructValue($.cloneStructValue(i)).Interface(), /* @__PURE__ */ $.basicType("float32"))
	await $.println(kind($.markAsStructValue($.cloneStructValue(i)).Interface()), isFloat32)

	// The same for arguments of interface type passed by Call.
	await $.println($.markAsStructValue($.cloneStructValue($.arrayIndex((await $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.goFunc(kind, "main.kind"), "func(v any) string", ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }], results: [/* @__PURE__ */ $.basicType("string")] } as $.FunctionTypeInfo))))).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(v))])))!, 0))).String())
	await $.println($.markAsStructValue($.cloneStructValue($.arrayIndex((await $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.goFunc(kinds, "main.kinds"), "func(vals ...any) string", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] })], results: [/* @__PURE__ */ $.basicType("string")], isVariadic: true } as $.FunctionTypeInfo))))).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(v)), $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(1, "int"))))])))!, 0))).String())

	// And for values stored in interface elements, fields and map values.
	let s = $.markAsStructValue($.cloneStructValue(reflect.MakeSlice($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic3()))!, 1, 1)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(s)).Index(0))).Set($.markAsStructValue($.cloneStructValue(v)))
	s = $.assignStruct(s, reflect.Append($.markAsStructValue($.cloneStructValue(s)), $.markAsStructValue($.cloneStructValue(v))))
	await $.println(kinds($.mustTypeAssert<$.Slice<any>>($.markAsStructValue($.cloneStructValue(s)).Interface(), /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }))))
	let m = $.markAsStructValue($.cloneStructValue(reflect.MakeMap($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic4()))!)))
	$.markAsStructValue($.cloneStructValue(m)).SetMapIndex($.markAsStructValue($.cloneStructValue(reflect.ValueOf("k"))), $.markAsStructValue($.cloneStructValue(v)))
	await $.println(kind($.mapGet<string, any, any>($.mustTypeAssert<globalThis.Map<string, any> | null>($.markAsStructValue($.cloneStructValue(m)).Interface(), /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] })), "k", null)[0]))
	let x: $.VarRef<{"F": any}> = $.varRef($.anonymousStructValue({"F": null}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("F", { kind: $.TypeKind.Interface, methods: [] }, [0], 0, true)] }))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(x, "*struct{F any}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("F", { kind: $.TypeKind.Interface, methods: [] }, [0], 0, true)] }))))).Elem())).Field(0))).Set(v)
	await $.println(kind(x.value.F))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.basicType("float32"), /* @__PURE__ */ $.basicType("float64"), /* @__PURE__ */ $.basicType("int")]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("float64"), zero: () => 0 }})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }), zero: () => null }})
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] }), zero: () => null }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

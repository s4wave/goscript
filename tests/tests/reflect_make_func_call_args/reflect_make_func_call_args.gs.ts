// Generated file based on reflect_make_func_call_args.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export class Values {
	public declare vals: $.Slice<number>

	constructor(__goscriptValue?: boolean, vals$?: $.Slice<number>) {
		this.vals = vals$ ?? (null! as $.Slice<number>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Values {
		return new Values(true, this.vals)
	}

	public __goscriptAssign(source: Values): this {
		this.vals = source.vals
		return this
	}

	public async Count(keep: ((v: number) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<number> {
		const v: Values | $.VarRef<Values> | null = this;
		let n = 0
		for (let __goscriptRangeTarget0 = $.pointerValue<Values>(v).vals, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
			let x = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as number)
			if ((__goscriptAwait = keep!(x), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)) {
				n++
			}
		}
		return n
	}

	static __typeInfo = $.registerStructType(
		"main.Values",
		() => new Values(),
		() => [$.methodSignature("Count", [["keep", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)]], [/* @__PURE__ */ $.basicType("int")], true)],
		Values,
		() => [/* @__PURE__ */ $.structField("vals", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/reflect_make_func_call_args" })]
	)
}

export async function Sum(vals: $.Slice<number>, f: ((v: number) => number | globalThis.Promise<number>) | null): globalThis.Promise<number> {
	let s = 0
	for (let __goscriptRangeTarget1 = vals, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let x = (__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as number)
		s += (__goscriptAwait = f!(x), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	}
	return s
}

export async function main(): globalThis.Promise<void> {
	// A function that reflection made, as an interpreter such as yaegi
	// makes the function literals of its code, passed by reflect.Value.Call
	// to an exported method and function, which call it.
	let keep = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic0()))!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		return $.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.markAsStructValue($.cloneStructValue($.arrayIndex(args!, 0))).Int() > 4n)))])
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType("reflect.Value")], results: [/* @__PURE__ */ $.sliceType("reflect.Value")] } as $.FunctionTypeInfo)))))
	let values = new Values(false, $.arrayToSlice<number>([1, 5, 7, 2]))
	let values$: Values = values == null ? $.pointerTarget<Values>(values) : (values as any).__isVarRef === true ? (values as any).value : (values as any).__goValue === undefined ? (values as any) : $.pointerTarget<Values>(values)
	await $.println($.markAsStructValue($.cloneStructValue($.arrayIndex((await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(values, "*main.Values", /* @__PURE__ */ $.pointerType("main.Values"))))).MethodByName("Count"))).Call($.arrayToSlice<reflect.Value>([keep])))!, 0))).Int())
	let double = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic1()))!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		return $.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(2 * $.int($.markAsStructValue($.cloneStructValue($.arrayIndex(args!, 0))).Int()), "int"))))])
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType("reflect.Value")], results: [/* @__PURE__ */ $.sliceType("reflect.Value")] } as $.FunctionTypeInfo)))))
	await $.println($.markAsStructValue($.cloneStructValue($.arrayIndex((await $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.goFunc(Sum, "main.Sum"), "func(vals []int, f func(v int) int) int", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))))).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue((values$ as Values).vals, "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")))))), double])))!, 0))).Int())

	// Compiled calls are unchanged.
	await $.println(await Values.prototype.Count.call(values, $.functionValue((v: number): boolean => {
		return v < 4
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))), await Sum((values$ as Values).vals, $.functionValue((v: number): number => {
		return v
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo), zero: () => null }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), zero: () => null }})
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

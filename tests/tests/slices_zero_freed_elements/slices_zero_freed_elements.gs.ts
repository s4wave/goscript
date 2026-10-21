// Generated file based on slices_zero_freed_elements.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as slices from "@goscript/slices/index.js"

export class T {
	public declare v: number

	public declare a: number[]

	constructor(__goscriptValue?: boolean, v$?: number, a$?: number[]) {
		this.v = v$ ?? 0
		this.a = a$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): T {
		return new T(true, this.v, $.cloneArrayValue(this.a, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)))
	}

	public __goscriptAssign(source: T): this {
		this.v = source.v
		this.a = $.assignFieldValue(this.a, source.a, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.T",
		() => new T(),
		() => [],
		T,
		() => [{ name: "v", key: "v", type: /* @__PURE__ */ $.basicType("int") }, { name: "a", key: "a", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2) }]
	)
}

export function make4(): $.Slice<T> {
	return $.arrayToSlice<T>([new T(true, 1), new T(true, 2), new T(true, 2), new T(true, 3, $.arrayValue([0, 4]))])
}

export async function show(name: string, s: $.Slice<T>, n: number): globalThis.Promise<void> {
	let out = name + ":"
	for (let __goscriptRangeTarget0 = $.goSlice(s, undefined, n), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let e = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as T)
		out += " " + $.runeToString($.int(48 + e.v, 32)) + $.runeToString($.int(48 + e.a[1], 32))
	}
	await $.println(out)
}

export function clearAll<E>(__typeArgs: $.GenericTypeArgs | undefined, s: $.Slice<E>): void {
	$.clear(s)
}

export function deleteFirst(__typeArgs: $.GenericTypeArgs | undefined, s: any): any {
	return (slices.Delete(s, 0, 1) as any)
}

export async function main(): globalThis.Promise<void> {
	// The elements that these functions free are zeroed.
	await show("Delete", slices.Delete(make4(), 0, 1, () => (new T(true) as T)), 4)
	await show("DeleteFunc", slices.DeleteFunc(make4(), $.functionValue((t: T): boolean => {
		return t.v == 2
	}, ({ kind: $.TypeKind.Function, params: ["main.T"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)), () => (new T(true) as T)), 4)
	await show("Compact", slices.Compact(make4(), () => (new T(true) as T)), 4)
	await show("CompactFunc", slices.CompactFunc(make4(), $.functionValue((a: T, b: T): boolean => {
		return a.v == b.v
	}, ({ kind: $.TypeKind.Function, params: ["main.T", "main.T"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)), () => (new T(true) as T)), 4)
	await show("generic Delete", deleteFirst(__goscriptStatic0(), make4()), 4)

	// Replace works in place when the result fits.
	let s: $.Slice<T> = make4()
	await show("Replace", slices.Replace(s, 0, 3, new T(true, 9)), 2)
	await show("Replace source", s, 4)

	// clear zeroes struct elements in generic code and in a window.
	s = make4()
	clearAll(__goscriptStatic1(), s)
	await show("clear generic", s, 4)
	s = make4()
	$.clear($.goSlice(s, 1, 3), () => new T(true))
	await show("clear window", s, 4)

	// Other element types get their own zero values.
	let words = (slices.Delete($.arrayToSlice<string>(["a", "b"]), 0, 1, () => ("" as string)) as $.Slice<string>)
	let values = (slices.Delete($.arrayToSlice<any>([$.basicInterfaceValue(1, "int"), $.structInterfaceValue(new T(true), "main.T", "main.T")]), 0, 1, () => (null! as any as any)) as $.Slice<any>)
	let arrays = (slices.Delete($.arrayToSlice<number[]>([$.arrayValue([1, 2]), $.arrayValue([3, 4])]), 0, 1, () => ($.arrayValue(globalThis.Array.from({ length: 2 }, () => 0)) as number[])) as $.Slice<number[]>)
	await $.println("others:", $.stringEqual($.arrayIndex($.goSlice(words, undefined, 2)!, 1), ""), $.arrayIndex($.goSlice(values, undefined, 2)!, 1) == null, ($.arrayIndex($.goSlice(arrays, undefined, 2)!, 1))[0])
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, S: { type: /* @__PURE__ */ $.sliceType("main.T"), zero: () => null }, E: { type: "main.T", zero: () => new T(true) }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, E: { type: "main.T", zero: () => new T(true) }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

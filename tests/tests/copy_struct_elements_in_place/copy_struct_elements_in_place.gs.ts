// Generated file based on copy_struct_elements_in_place.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as fmt from "@goscript/fmt/index.js"

export type items = $.Slice<item>

$.registerNamedType("main.items", /* @__PURE__ */ $.sliceType("main.item"));

export class inner {
	public declare N: number[]

	constructor(__goscriptValue?: boolean, N$?: number[]) {
		this.N = N$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): inner {
		return new inner(true, $.cloneArrayValue(this.N, __goscriptStatic0()))
	}

	public __goscriptAssign(source: inner): this {
		this.N = $.assignFieldValue(this.N, source.N, __goscriptStatic0())
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.inner",
		() => new inner(),
		() => [],
		inner,
		() => [{ name: "N", key: "N", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2) }]
	)
}

export class item {
	public declare X: number

	public declare Y: number

	public declare In: inner

	constructor(__goscriptValue?: boolean, X$?: number, Y$?: number, In$?: inner) {
		this.X = X$ ?? 0
		this.Y = Y$ ?? 0
		this.In = In$ ?? new inner(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): item {
		return new item(true, this.X, this.Y, this.In.clone())
	}

	public __goscriptAssign(source: item): this {
		this.X = source.X
		this.Y = source.Y
		this.In.__goscriptAssign(source.In)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		() => [],
		item,
		() => [{ name: "X", key: "X", type: /* @__PURE__ */ $.basicType("int") }, { name: "Y", key: "Y", type: /* @__PURE__ */ $.basicType("int") }, { name: "In", key: "In", type: "main.inner" }]
	)
}

export async function main(): globalThis.Promise<void> {
	// A pointer to an element sees the values copied into it.
	let dst = $.makeSlice<item>(3, undefined, undefined, () => new item(true))
	let p = $.indexRef(dst!, 1)
	let p$: item = p == null ? $.pointerTarget<item>(p) : (p as any).__isVarRef === true ? (p as any).value : (p as any).__goValue === undefined ? (p as any) : $.pointerTarget<item>(p)
	let src = $.arrayToSlice<item>([new item(true, 1, 2, new inner(true, $.arrayValue([3, 4]))), new item(true, 5, 6, new inner(true, $.arrayValue([7, 8]))), new item(true, 9, 10, new inner(true))])
	let n = $.copy(dst, src, true)
	fmt.Println($.basicInterfaceValue(n, "int"), $.basicInterfaceValue((p$ as item).X, "int"), $.basicInterfaceValue((p$ as item).Y, "int"), $.interfaceValue($.cloneArrayValue((p$ as item).In.N, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)), "[2]int", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)))

	// The copies are values: changing the source leaves dst alone.
	$.arrayIndex(src!, 1).X = 50
	$.arrayIndex(src!, 1).In.N[0] = 70
	fmt.Println($.basicInterfaceValue($.arrayIndex(dst!, 1).X, "int"), $.interfaceValue($.cloneArrayValue($.arrayIndex(dst!, 1).In.N, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)), "[2]int", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)), $.basicInterfaceValue((p$ as item).X, "int"))

	// Overlapping copies within one backing array, forward and backward.
	let all = $.arrayToSlice<item>([new item(true, 1), new item(true, 2), new item(true, 3), new item(true, 4)])
	let q = $.indexRef(all!, 3)
	let q$: item = q == null ? $.pointerTarget<item>(q) : (q as any).__isVarRef === true ? (q as any).value : (q as any).__goValue === undefined ? (q as any) : $.pointerTarget<item>(q)
	$.copy($.goSlice(all, 1, undefined), all, true)
	fmt.Println($.basicInterfaceValue($.arrayIndex(all!, 0).X, "int"), $.basicInterfaceValue($.arrayIndex(all!, 1).X, "int"), $.basicInterfaceValue($.arrayIndex(all!, 2).X, "int"), $.basicInterfaceValue($.arrayIndex(all!, 3).X, "int"), $.basicInterfaceValue((q$ as item).X, "int"))
	$.copy(all, $.goSlice(all, 2, undefined), true)
	fmt.Println($.basicInterfaceValue($.arrayIndex(all!, 0).X, "int"), $.basicInterfaceValue($.arrayIndex(all!, 1).X, "int"), $.basicInterfaceValue($.arrayIndex(all!, 2).X, "int"), $.basicInterfaceValue($.arrayIndex(all!, 3).X, "int"), $.basicInterfaceValue((q$ as item).X, "int"))

	// A named slice type, an array window and a shorter source.
	let named: items = ($.makeSlice<item>(2, undefined, undefined, () => new item(true)) as items)
	let r = $.indexRef(named!, 0)
	$.copy((named as items), $.goSlice(src, 2, undefined), true)
	let arr: item[] = $.arrayValue(globalThis.Array.from({ length: 3 }, () => new item(true)), /* @__PURE__ */ $.arrayType("main.item", 3))
	let s = $.indexRef(arr, 2)
	$.copy($.goSlice(arr, 1, undefined), src, true)
	fmt.Println($.basicInterfaceValue($.pointerValue<item>(r).X, "int"), $.basicInterfaceValue($.arrayIndex(named!, 1).X, "int"), $.basicInterfaceValue($.pointerValue<item>(s).X, "int"), $.basicInterfaceValue(arr[0].X, "int"))

	// Slices of pointers still copy the pointers.
	let a = new item(false, 1)
	let b = new item(false, 2)
	let ptrs = $.arrayToSlice<item | $.VarRef<item> | null>([a])
	let others = $.arrayToSlice<item | $.VarRef<item> | null>([b])
	$.copy(others, ptrs)
	$.pointerValue<item>($.arrayIndex(others!, 0)).Y = 8
	fmt.Println($.basicInterfaceValue($.pointerValue<item>(a).Y, "int"), $.basicInterfaceValue($.pointerValue<item>(b).Y, "int"), ($.arrayIndex(others!, 0) === a || ($.pointerAliasesMade || ($.arrayIndex(others!, 0) as any)?.__goElementBacking !== undefined) && $.pointerEqual($.arrayIndex(others!, 0), a)))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
}

if ($.isMainScript(import.meta)) {
	await main()
}

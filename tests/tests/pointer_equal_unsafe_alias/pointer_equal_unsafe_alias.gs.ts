// Generated file based on pointer_equal_unsafe_alias.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export type count = number

$.registerNamedValueType(
	"*main.count",
	{Value: (receiver: any) => (count_Value as any)(receiver)},
	[$.methodSignature("Value", [], [/* @__PURE__ */ $.basicType("int32")])]
);

export type otherCount = number

$.registerNamedValueType(
	"*main.otherCount",
	{Value: (receiver: any) => (otherCount_Value as any)(receiver)},
	[$.methodSignature("Value", [], [/* @__PURE__ */ $.basicType("int32")])]
);

export class first {
	// X is shared through the unsafe pointer view.
	public declare X: number

	constructor(__goscriptValue?: boolean, X$?: number) {
		this.X = X$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): first {
		return new first(true, this.X)
	}

	public __goscriptAssign(source: first): this {
		this.X = source.X
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.first",
		() => new first(),
		() => [],
		first,
		() => [{ name: "X", key: "X", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class second {
	// X has the same offset as first.X.
	public declare X: number

	constructor(__goscriptValue?: boolean, X$?: number) {
		this.X = X$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): second {
		return new second(true, this.X)
	}

	public __goscriptAssign(source: second): this {
		this.X = source.X
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.second",
		() => new second(),
		() => [],
		second,
		() => [{ name: "X", key: "X", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function count_Value(p: $.VarRef<count> | null): number {
	return $.pointerValue<count>(p)
}

export function otherCount_Value(p: $.VarRef<otherCount> | null): number {
	return $.pointerValue<otherCount>(p)
}

export async function main(): globalThis.Promise<void> {
	// Distinct pointers before and after an unsafe view is made.
	let a = new first(false, 1)
	let other = new first(false, 1)
	await $.println("same:", (a === a || ($.pointerAliasesMade || (a as any)?.__goElementBacking !== undefined) && $.pointerEqual(a, a)), (a !== a && !(($.pointerAliasesMade || (a as any)?.__goElementBacking !== undefined) && $.pointerEqual(a, a))))
	await $.println("distinct:", (a === other || ($.pointerAliasesMade || (a as any)?.__goElementBacking !== undefined) && $.pointerEqual(a, other)), (a !== other && !(($.pointerAliasesMade || (a as any)?.__goElementBacking !== undefined) && $.pointerEqual(a, other))))

	// A view of another type, converted back, is the same pointer.
	let view = $.unsafeByteView<second | $.VarRef<second> | null>((a as any), null)
	let back = $.unsafeByteView<first | $.VarRef<first> | null>((view as any), null)
	await $.println("back:", (a === back || ($.pointerAliasesMade || (a as any)?.__goElementBacking !== undefined) && $.pointerEqual(a, back)), (a !== back && !(($.pointerAliasesMade || (a as any)?.__goElementBacking !== undefined) && $.pointerEqual(a, back))), (back === a || ($.pointerAliasesMade || (back as any)?.__goElementBacking !== undefined) && $.pointerEqual(back, a)))
	await $.println("still distinct:", (a === other || ($.pointerAliasesMade || (a as any)?.__goElementBacking !== undefined) && $.pointerEqual(a, other)), (back !== other && !(($.pointerAliasesMade || (back as any)?.__goElementBacking !== undefined) && $.pointerEqual(back, other))))

	// Fields and elements reached through the pointers agree.
	$.pointerValue<second>(view).X = 7
	await $.println("shared:", $.pointerValue<first>(a).X, $.pointerValue<first>(back).X)
	let items = $.arrayToSlice<first | $.VarRef<first> | null>([other, a])
	let found = -1
	for (let __goscriptRangeTarget0 = items, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
		let item = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + i] as first | $.VarRef<first> | null)
		if ((item === back || ($.pointerAliasesMade || (item as any)?.__goElementBacking !== undefined) && $.pointerEqual(item, back))) {
			found = i
		}
	}
	await $.println("found:", found)

	// Interface pointer keys include both the address and the dynamic type.
	let n = $.varRef(3)
	let alias = n
	let keys = $.makeMap<any, string>([[$.namedValueInterfaceValue<any>(n, "*main.count", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()), "first"], [$.namedValueInterfaceValue<any>(alias, "*main.otherCount", __goscriptStatic3(), __goscriptStatic4(), __goscriptStatic2()), "second"]])
	await $.println("typed keys:", $.len(keys), $.mapGet<any, string, string>(keys, $.namedValueInterfaceValue<any>(n, "*main.count", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()), "")[0], $.mapGet<any, string, string>(keys, $.namedValueInterfaceValue<any>(alias, "*main.otherCount", __goscriptStatic3(), __goscriptStatic4(), __goscriptStatic2()), "")[0], $.comparableEqual($.namedValueInterfaceValue<any>(n, "*main.count", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()), $.namedValueInterfaceValue<any>(alias, "*main.otherCount", __goscriptStatic3(), __goscriptStatic4(), __goscriptStatic2())))

	// Overwriting one dynamic type keeps the other key's entry.
	$.mapSet(keys, $.namedValueInterfaceValue<any>(n, "*main.count", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()), "updated")
	await $.println("overwrite:", $.len(keys), $.mapGet<any, string, string>(keys, $.namedValueInterfaceValue<any>(n, "*main.count", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()), "")[0], $.mapGet<any, string, string>(keys, $.namedValueInterfaceValue<any>(alias, "*main.otherCount", __goscriptStatic3(), __goscriptStatic4(), __goscriptStatic2()), "")[0])

	// Iteration preserves the actual interface keys of both types.
	let firstSeen = false
	let secondSeen = false
	for (const [key, __rangeValue] of keys?.entries() ?? []) {
		firstSeen = firstSeen || ($.comparableEqual(key, $.namedValueInterfaceValue<any>(n, "*main.count", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2())))
		secondSeen = secondSeen || ($.comparableEqual(key, $.namedValueInterfaceValue<any>(alias, "*main.otherCount", __goscriptStatic3(), __goscriptStatic4(), __goscriptStatic2())))
	}
	await $.println("iteration:", firstSeen, secondSeen)

	// Deleting one dynamic type leaves the other address match intact.
	$.deleteMapEntry(keys, $.namedValueInterfaceValue<any>(n, "*main.count", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()))
	await $.println("delete:", $.len(keys), $.mapGet<any, string, string>(keys, $.namedValueInterfaceValue<any>(alias, "*main.otherCount", __goscriptStatic3(), __goscriptStatic4(), __goscriptStatic2()), "")[0])
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({Value: (receiver: any) => (count_Value as any)(receiver)})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int32", "main.count")))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ([$.methodSignature("Value", [], [/* @__PURE__ */ $.basicType("int32")])])
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ({Value: (receiver: any) => (otherCount_Value as any)(receiver)})
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= (/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int32", "main.otherCount")))
}

if ($.isMainScript(import.meta)) {
	await main()
}

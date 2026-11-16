// Generated file based on range_expr_evaluated_once.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class pt {
	public declare x: number

	constructor(__goscriptValue?: boolean, x$?: number) {
		this.x = x$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): pt {
		return new pt(true, this.x)
	}

	public __goscriptAssign(source: pt): this {
		this.x = source.x
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.pt",
		() => new pt(),
		() => [],
		pt,
		() => [{ name: "x", key: "x", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export let calls = 0

export function __goscript_set_calls(__goscriptValue: number): void {
	calls = __goscriptValue
}

export function values(): $.Slice<number> {
	calls++
	return new Uint8Array([1, 4, 5]) as $.Slice<number>
}

export let table: $.VarRef<number[]> = $.varRef($.arrayValue([1, 2, 3]))

export function __goscript_set_table(__goscriptValue: number[]): void {
	table.value = $.assignFieldValue(table.value, __goscriptValue, __goscriptStatic0())
}

export function bump(a: $.VarRef<number[]> | null): void {
	$.pointerValue<number[]>(a)[2]++
}

export async function main(): globalThis.Promise<void> {
	let sum = 0
	for (let __goscriptRangeTarget0 = $.goSlice(values(), 1, undefined), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let value = $.uint((__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as number), 8)
		sum += value
	}
	await $.println("calls:", calls)
	await $.println("sum:", sum)

	// An array range expression is a copy, so stores into the array during
	// the loop do not reach the values it reads.
	let arr = $.arrayValue([1, 2, 3])
	let ranged = 0
	for (let __goscriptRangeTarget1 = $.cloneArrayValue(arr, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3)), __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let v = (__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as number)
		arr[2] = 9
		ranged = (ranged * 10) + v
	}
	await $.println("array:", ranged, arr[2])

	let sa = $.arrayValue([new pt(true, 1), new pt(true, 2)], __goscriptStatic1())
	ranged = 0
	for (let __goscriptRangeTarget2 = $.cloneArrayValue(sa, /* @__PURE__ */ $.arrayType("main.pt", 2)), __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow2.length; __rangeIndex++) {
		let v = ((__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + __rangeIndex] as pt)).clone()
		sa[1].x = 9
		ranged = (ranged * 10) + v.x
	}
	await $.println("struct array:", ranged, sa[1].x)

	ranged = 0
	for (let __goscriptRangeTarget3 = $.cloneArrayValue(table.value, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3)), __goscriptRangeWindow3 = $.sliceRange(__goscriptRangeTarget3), i = 0; i < __goscriptRangeWindow3.length; i++) {
		let v = (__goscriptRangeWindow3.backing[__goscriptRangeWindow3.offset + i] as number)
		if (i == 0) {
			bump(table)
		}
		ranged = (ranged * 10) + v
	}
	await $.println("package array:", ranged, table.value[2])

	// Ranging through a pointer to an array reads the array itself.
	let ptr = $.varRef($.arrayValue([1, 2, 3]))
	ranged = 0
	for (let __goscriptRangeTarget4 = $.pointerValue<number[]>(ptr), __goscriptRangeWindow4 = $.sliceRange(__goscriptRangeTarget4), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow4.length; __rangeIndex++) {
		let v = (__goscriptRangeWindow4.backing[__goscriptRangeWindow4.offset + __rangeIndex] as number)
		$.pointerValue<number[]>(ptr)[2] = 9
		ranged = (ranged * 10) + v
	}
	await $.println("array pointer:", ranged)

	// The value is assigned to an element of the ranged array.
	let dst = $.arrayValue([1, 2, 3])
	for (let __goscriptRangeTarget5 = $.cloneArrayValue(dst, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3)), __goscriptRangeWindow5 = $.sliceRange(__goscriptRangeTarget5), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow5.length; __rangeIndex++) {
		let __goscriptRangeValue0 = (__goscriptRangeWindow5.backing[__goscriptRangeWindow5.offset + __rangeIndex] as number)
		dst[2] = __goscriptRangeValue0
	}
	await $.println("assigned:", dst[0], dst[1], dst[2])

	// Loops whose arrays cannot change read them in place.
	let ro = $.arrayValue([4, 5, 6])
	ranged = 0
	for (let __goscriptRangeTarget6 = ro, __goscriptRangeWindow6 = $.sliceRange(__goscriptRangeTarget6), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow6.length; __rangeIndex++) {
		let v = (__goscriptRangeWindow6.backing[__goscriptRangeWindow6.offset + __rangeIndex] as number)
		ranged = (ranged * 10) + v
	}
	await $.println("read only:", ranged)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.arrayType("main.pt", 2))
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on array_pointer_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public declare value: number

	constructor(__goscriptValue?: boolean, value$?: number) {
		this.value = value$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): item {
		return new item(true, this.value)
	}

	public __goscriptAssign(source: item): this {
		this.value = source.value
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		() => [],
		item,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class arrays {
	public declare slices: $.Slice<number>[]

	public declare items: item[]

	constructor(__goscriptValue?: boolean, slices$?: $.Slice<number>[], items$?: item[]) {
		this.slices = slices$ ?? $.arrayValue(globalThis.Array.from({ length: 1 }, () => null))
		this.items = items$ ?? $.arrayValue(globalThis.Array.from({ length: 1 }, () => new item(true)), /* @__PURE__ */ $.arrayType("main.item", 1))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): arrays {
		return new arrays(true, $.cloneArrayValue(this.slices, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), 1)), $.cloneArrayValue(this.items, /* @__PURE__ */ $.arrayType("main.item", 1)))
	}

	public __goscriptAssign(source: arrays): this {
		this.slices = $.assignFieldValue(this.slices, source.slices, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), 1))
		this.items = $.assignFieldValue(this.items, source.items, /* @__PURE__ */ $.arrayType("main.item", 1))
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.arrays",
		() => new arrays(),
		() => [],
		arrays,
		() => [{ name: "slices", key: "slices", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), 1) }, { name: "items", key: "items", type: /* @__PURE__ */ $.arrayType("main.item", 1) }]
	)
}

export function fillArray(dst: $.VarRef<Uint8Array> | null): void {
	for (let __goscriptRangeTarget0 = $.pointerValue<Uint8Array>(dst), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
		$.pointerValue<Uint8Array>(dst)[i] = $.uint(i + 1, 8)
	}
}

export function sumArray(src: $.VarRef<Uint8Array> | null): number {
	let sum = 0
	for (let __goscriptRangeTarget1 = $.pointerValue<Uint8Array>(src), __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let v = $.uint((__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as number), 8)
		sum += v
	}
	return sum
}

export function closureArrayAddress(): number {
	let result = 0
	void (() => {
		let table = $.varRef($.arrayValue(new Uint8Array([6, 7, 8, 9])))
		let ptr = table
		result = $.arrayIndex($.pointerValue<Uint8Array>(ptr), 2)
	})()
	return result
}

export async function main(): globalThis.Promise<void> {
	let slices = $.arrayValue([$.arrayToSlice<number>([1])])
	let slicesCopy = $.cloneArrayValue(slices, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), 1))
	$.sliceElems(slicesCopy[0]!)[$.sliceSlot(slicesCopy[0]!, 0)] = 7
	await $.println("slice sharing:", $.arrayIndex(slices[0]!, 0))

	let structs = $.arrayValue([new item(true, 1)], /* @__PURE__ */ $.arrayType("main.item", 1))
	let structsCopy = $.cloneArrayValue(structs, /* @__PURE__ */ $.arrayType("main.item", 1))
	structsCopy[0].value = 7
	await $.println("struct copy:", structs[0].value, structsCopy[0].value)

	let pointers = $.arrayValue([new item(false, 1)])
	let pointersCopy = $.cloneArrayValue(pointers, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.pointerType("main.item"), 1))
	$.pointerValue<item>(pointersCopy[0]).value = 7
	await $.println("pointer sharing:", $.pointerValue<item>(pointers[0]).value, (pointers[0] === pointersCopy[0] || ($.pointerAliasesMade || (pointers[0] as any)?.__goElementBacking !== undefined) && $.pointerEqual(pointers[0], pointersCopy[0])))

	let original = new arrays(true, slices, structs)
	let copied = (original).clone()
	$.sliceElems(copied.slices[0]!)[$.sliceSlot(copied.slices[0]!, 0)] = 8
	copied.items[0].value = 8
	await $.println("array fields:", $.arrayIndex(original.slices[0]!, 0), original.items[0].value, copied.items[0].value)

	// Assigning an array element copies its value instead of aliasing the row.
	let rows = $.arrayValue([$.arrayValue([1, 2]), $.arrayValue([3, 4])], /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int32"), 2), 2))
	$.assignFieldValue(rows[1], rows[0], /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int32"), 2))
	rows[1][0] = 9
	await $.println("row copy:", (rows[0])[0], (rows[0])[1], (rows[1])[0], (rows[1])[1])

	let buckets: bigint[][] = $.arrayValue(globalThis.Array.from({ length: 2 }, () => $.arrayValue(globalThis.Array.from({ length: 3 }, () => 0n))), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint64"), 3), 2))
	let cache = $.indexRef(buckets, 1)

	await $.println("len:", 3)

	$.pointerValue<bigint[]>(cache)[0] = 5n
	$.pointerValue<bigint[]>(cache)[1] = 7n
	await $.println("index:", $.arrayIndex($.pointerValue<bigint[]>(cache), 0), $.arrayIndex($.pointerValue<bigint[]>(cache), 1))

	for (let __goscriptRangeTarget2 = $.pointerValue<bigint[]>(cache), __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), i = 0; i < __goscriptRangeWindow2.length; i++) {
		let x = (__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + i] as bigint)
		await $.println("range:", i, x)
	}

	let view = $.goSlice($.pointerValue<bigint[]>(cache), undefined, undefined)
	await $.println("slice:", $.sliceLen(view), $.arrayIndex(view!, 2))

	let buf = new Uint8Array([9, 0, 0, 0, 0]) as $.Slice<number>
	fillArray(($.sliceToArrayPointer<number>($.goSlice(buf, 1, undefined), 4, "byte") as $.VarRef<Uint8Array> | null))
	await $.println("converted:", $.arrayIndex(buf!, 0), $.arrayIndex(buf!, 1), $.arrayIndex(buf!, 2), $.arrayIndex(buf!, 3), $.arrayIndex(buf!, 4))
	await $.println("converted sum:", sumArray(($.sliceToArrayPointer<number>($.goSlice(buf, 1, undefined), 4, "byte") as $.VarRef<Uint8Array> | null)))

	let literal = $.varRef($.arrayValue(new Uint8Array([4, 3, 2, 1])))
	await $.println("literal sum:", sumArray(literal))
	fillArray(literal)
	await $.println("literal filled:", $.arrayIndex($.pointerValue<Uint8Array>(literal), 0), $.arrayIndex($.pointerValue<Uint8Array>(literal), 1), $.arrayIndex($.pointerValue<Uint8Array>(literal), 2), $.arrayIndex($.pointerValue<Uint8Array>(literal), 3))
	await $.println("closure ptr:", closureArrayAddress())
}

if ($.isMainScript(import.meta)) {
	await main()
}

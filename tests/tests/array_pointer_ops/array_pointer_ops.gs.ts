// Generated file based on array_pointer_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<number>
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? (0 as number))
		}
	}

	public clone(): item {
		const cloned = new item()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
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
	public get slices(): $.Slice<number>[] {
		return this._fields.slices.value
	}
	public set slices(value: $.Slice<number>[]) {
		this._fields.slices.value = value
	}

	public get items(): item[] {
		return this._fields.items.value
	}
	public set items(value: item[]) {
		this._fields.items.value = value
	}

	public _fields: {
		slices: $.VarRef<$.Slice<number>[]>
		items: $.VarRef<item[]>
	}

	constructor(init?: Partial<{slices?: $.Slice<number>[], items?: item[]}>) {
		this._fields = {
			slices: $.varRef(init?.slices !== undefined ? $.cloneArrayValue(init.slices, { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Slice, elemType: /* @__PURE__ */ $.basicType("int") }, length: 1 }) : Array.from({ length: 1 }, () => null)),
			items: $.varRef(init?.items !== undefined ? $.cloneArrayValue(init.items, { kind: $.TypeKind.Array, elemType: "main.item", length: 1 }) : Array.from({ length: 1 }, () => $.markAsStructValue(new item())))
		}
	}

	public clone(): arrays {
		const cloned = new arrays()
		cloned._fields = {
			slices: $.varRef($.cloneArrayValue(this._fields.slices.value, { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Slice, elemType: /* @__PURE__ */ $.basicType("int") }, length: 1 })),
			items: $.varRef($.cloneArrayValue(this._fields.items.value, { kind: $.TypeKind.Array, elemType: "main.item", length: 1 }))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.arrays",
		() => new arrays(),
		() => [],
		arrays,
		() => [{ name: "slices", key: "slices", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Slice, elemType: /* @__PURE__ */ $.basicType("int") }, length: 1 } }, { name: "items", key: "items", type: { kind: $.TypeKind.Array, elemType: "main.item", length: 1 } }]
	)
}

export function fillArray(dst: $.VarRef<Uint8Array> | null): void {
	for (let __goscriptRangeTarget0 = $.pointerValue<Uint8Array>(dst), i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		$.pointerValue<Uint8Array>(dst)[i] = $.uint($.uint(i + 1, 8), 8)
	}
}

export function sumArray(src: $.VarRef<Uint8Array> | null): number {
	let sum = 0
	for (let __goscriptRangeTarget1 = $.pointerValue<Uint8Array>(src), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let v = __goscriptRangeTarget1![__rangeIndex]
		sum = sum + ($.int(v))
	}
	return sum
}

export function closureArrayAddress(): number {
	let result = 0
	void ((): void => {
		let table = $.varRef(new Uint8Array([6, 7, 8, 9]))
		let ptr: $.VarRef<Uint8Array> | null = table
		result = $.int($.arrayIndex($.pointerValue<Uint8Array>(ptr), 2))
	})()
	return result
}

export async function main(): globalThis.Promise<void> {
	let slices = [$.arrayToSlice<number>([1])]
	let slicesCopy = $.cloneArrayValue(slices, { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Slice, elemType: /* @__PURE__ */ $.basicType("int") }, length: 1 })
	$.arrayIndex(slicesCopy, 0)![0] = 7
	await $.println("slice sharing:", $.arrayIndex($.arrayIndex(slices, 0)!, 0))

	let structs = [$.markAsStructValue(new item({value: 1}))]
	let structsCopy = $.cloneArrayValue(structs, { kind: $.TypeKind.Array, elemType: "main.item", length: 1 })
	$.arrayIndex(structsCopy, 0).value = 7
	await $.println("struct copy:", $.arrayIndex(structs, 0).value, $.arrayIndex(structsCopy, 0).value)

	let pointers = [new item({value: 1})]
	let pointersCopy = $.cloneArrayValue(pointers, { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Pointer, elemType: "main.item" }, length: 1 })
	$.pointerValue<item>($.arrayIndex(pointersCopy, 0)).value = 7
	await $.println("pointer sharing:", $.pointerValue<item>($.arrayIndex(pointers, 0)).value, $.pointerEqual($.arrayIndex(pointers, 0), $.arrayIndex(pointersCopy, 0)))

	let original = $.markAsStructValue(new arrays({slices: $.cloneArrayValue(slices, { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Slice, elemType: /* @__PURE__ */ $.basicType("int") }, length: 1 }), items: $.cloneArrayValue(structs, { kind: $.TypeKind.Array, elemType: "main.item", length: 1 })}))
	let copied = $.markAsStructValue($.cloneStructValue(original))
	$.arrayIndex(copied.slices, 0)![0] = 8
	$.arrayIndex(copied.items, 0).value = 8
	await $.println("array fields:", $.arrayIndex($.arrayIndex(original.slices, 0)!, 0), $.arrayIndex(original.items, 0).value, $.arrayIndex(copied.items, 0).value)

	// Assigning an array element copies its value instead of aliasing the row.
	let rows = [[$.int(1, 32), $.int(2, 32)], [$.int(3, 32), $.int(4, 32)]]
	rows[1] = $.cloneArrayValue($.arrayIndex(rows, 0), { kind: $.TypeKind.Array, elemType: /* @__PURE__ */ $.basicType("int32"), length: 2 })
	$.arrayIndex(rows, 1)[0] = $.int(9, 32)
	await $.println("row copy:", $.int($.arrayIndex($.arrayIndex(rows, 0), 0), 32), $.int($.arrayIndex($.arrayIndex(rows, 0), 1), 32), $.int($.arrayIndex($.arrayIndex(rows, 1), 0), 32), $.int($.arrayIndex($.arrayIndex(rows, 1), 1), 32))

	let buckets: bigint[][] = Array.from({ length: 2 }, () => Array.from({ length: 3 }, () => 0n))
	let cache: $.VarRef<bigint[]> | null = $.indexRef(buckets, 1)

	await $.println("len:", $.len($.pointerValue<bigint[]>(cache)))

	$.pointerValue<bigint[]>(cache)[0] = 5n
	$.pointerValue<bigint[]>(cache)[1] = 7n
	await $.println("index:", $.arrayIndex($.pointerValue<bigint[]>(cache), 0), $.arrayIndex($.pointerValue<bigint[]>(cache), 1))

	for (let __goscriptRangeTarget2 = $.pointerValue<bigint[]>(cache), i = 0; i < $.len(__goscriptRangeTarget2); i++) {
		let x = __goscriptRangeTarget2![i]
		await $.println("range:", i, x)
	}

	let view: $.Slice<bigint> = $.goSlice($.pointerValue<bigint[]>(cache), undefined, undefined)
	await $.println("slice:", $.len(view), $.arrayIndex(view!, 2))

	let buf: $.Slice<number> = new Uint8Array([9, 0, 0, 0, 0]) as $.Slice<number>
	fillArray(($.sliceToArrayPointer<number>($.goSlice(buf, 1, undefined), 4, "byte") as $.VarRef<Uint8Array> | null))
	await $.println("converted:", $.uint($.arrayIndex(buf!, 0), 8), $.uint($.arrayIndex(buf!, 1), 8), $.uint($.arrayIndex(buf!, 2), 8), $.uint($.arrayIndex(buf!, 3), 8), $.uint($.arrayIndex(buf!, 4), 8))
	await $.println("converted sum:", sumArray(($.sliceToArrayPointer<number>($.goSlice(buf, 1, undefined), 4, "byte") as $.VarRef<Uint8Array> | null)))

	let literal: $.VarRef<Uint8Array> | null = $.varRef(new Uint8Array([4, 3, 2, 1]))
	await $.println("literal sum:", sumArray(literal))
	fillArray(literal)
	await $.println("literal filled:", $.uint($.arrayIndex($.pointerValue<Uint8Array>(literal), 0), 8), $.uint($.arrayIndex($.pointerValue<Uint8Array>(literal), 1), 8), $.uint($.arrayIndex($.pointerValue<Uint8Array>(literal), 2), 8), $.uint($.arrayIndex($.pointerValue<Uint8Array>(literal), 3), 8))
	await $.println("closure ptr:", closureArrayAddress())
}

if ($.isMainScript(import.meta)) {
	await main()
}

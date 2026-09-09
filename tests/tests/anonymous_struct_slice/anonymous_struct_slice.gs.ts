// Generated file based on anonymous_struct_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class namedItem {
	public declare key: string

	public declare data: $.Slice<number>

	public _fields: {
		key: string
		data: $.Slice<number>
	}

	constructor(init?: Partial<{key?: string, data?: $.Slice<number>}>) {
		this._fields = {
			key: init?.key ?? ("" as string),
			data: init?.data ?? (null! as $.Slice<number>)
		}
	}

	public clone(): namedItem {
		return $.markAsStructValue(new namedItem(this))
	}

	static {
		$.bindStructFields(this.prototype, ["key", "data"])
	}

	static __typeInfo = $.registerStructType(
		"main.namedItem",
		() => new namedItem(),
		() => [],
		namedItem,
		() => [{ name: "key", key: "key", type: /* @__PURE__ */ $.basicType("string") }, { name: "data", key: "data", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }]
	)
}

export async function main(): globalThis.Promise<void> {
	for (let __goscriptRangeTarget0 = $.arrayToSlice<{"name": string, "input": string, "count": number}>([{name: "first", input: "alpha", count: 1}, {name: "second", input: "beta", count: 2}]), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let tt = __goscriptRangeTarget0![__rangeIndex]
		await $.println(tt.name, tt.input, tt.count)
	}

	let x = {Name: "third", Offsets: (null as $.Slice<number>), Count: 3}
	x.Offsets = $.append(x.Offsets, 5)
	await $.println(x.Name, $.arrayIndex(x.Offsets!, 0), x.Count)

	let __goscriptTuple0: any = buildNamedItems()
	let items: $.Slice<namedItem> = __goscriptTuple0[0]
	for (let __goscriptRangeTarget1 = $.goSlice(items, 1, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let item = __goscriptRangeTarget1![__rangeIndex]
		await $.println(item.key, $.len(item.data))
	}
}

export function buildNamedItems(): [$.Slice<namedItem>, boolean] {
	return [$.arrayToSlice<namedItem>([$.markAsStructValue(new namedItem({key: "skip", data: new Uint8Array([0]) as $.Slice<number>})), $.markAsStructValue(new namedItem({key: "keep", data: new Uint8Array([1, 2, 3]) as $.Slice<number>}))]), true]
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on range_shadow_rhs.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class holder {
	public declare values: globalThis.Map<string, number> | null

	public declare items: $.Slice<item>

	public _fields: {
		values: globalThis.Map<string, number> | null
		items: $.Slice<item>
	}

	constructor(init?: Partial<{values?: globalThis.Map<string, number> | null, items?: $.Slice<item>}>) {
		this._fields = {
			values: init?.values ?? (null! as globalThis.Map<string, number> | null),
			items: init?.items ?? (null! as $.Slice<item>)
		}
	}

	public clone(): holder {
		return $.markAsStructValue(new holder(this))
	}

	static {
		$.bindStructFields(this.prototype, ["values", "items"])
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		() => [],
		holder,
		() => [{ name: "values", key: "values", type: /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")) }, { name: "items", key: "items", type: /* @__PURE__ */ $.sliceType("main.item") }]
	)
}

export class item {
	public declare value: number

	public _fields: {
		value: number
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: init?.value ?? (0 as number)
		}
	}

	public clone(): item {
		return $.markAsStructValue(new item(this))
	}

	public increment(): number {
		let i: item | $.VarRef<item> | null = this;
		$.pointerValue<item>(i).value++
		return $.pointerValue<item>(i).value
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		() => [{ name: "increment", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		item,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let k = $.markAsStructValue(new holder({values: $.makeMap<string, number>([["a", 1], ["b", 2]])}))
	let sum = 0
	for (const [__goscriptRangeShadow0, v] of k.values?.entries() ?? []) {
		sum = sum + ($.len(__goscriptRangeShadow0) + v)
	}
	await $.println(sum)
	let items = $.markAsStructValue(new holder({items: $.arrayToSlice<item>([$.markAsStructValue(new item({value: 3})), $.markAsStructValue(new item({value: 7}))])}))
	for (let __goscriptRangeTarget0 = items.items, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let __goscriptRangeShadow1 = $.varRef($.markAsStructValue($.cloneStructValue(__goscriptRangeTarget0![__rangeIndex])))
		await $.println(__goscriptRangeShadow1.value.increment())
	}
	await $.println($.arrayIndex(items.items!, 0).value, $.arrayIndex(items.items!, 1).value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

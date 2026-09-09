// Generated file based on range_value_pointer_receiver.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public declare name: string

	public _fields: {
		name: string
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: init?.name ?? ("" as string)
		}
	}

	public clone(): item {
		return $.markAsStructValue(new item(this))
	}

	public Name(): string {
		const i: item | $.VarRef<item> | null = this
		if (i == null) {
			return ""
		}
		return $.pointerValue<item>(i).name
	}

	static {
		$.bindStructFields(this.prototype, ["name"])
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		() => [{ name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		item,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let items: $.Slice<item> = $.arrayToSlice<item>([$.markAsStructValue(new item({name: "alpha"})), $.markAsStructValue(new item({name: "beta"}))])
	for (let __goscriptRangeTarget0 = items, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let item = $.varRef(__goscriptRangeTarget0![__rangeIndex])
		await $.println(item.value.Name())
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

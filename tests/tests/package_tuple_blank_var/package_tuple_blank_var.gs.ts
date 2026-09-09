// Generated file based on package_tuple_blank_var.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

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

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		() => [],
		item,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function newItem(value: number): [item | $.VarRef<item> | null, $.GoError] {
	return [new item({value: value}), null]
}

const __goscriptTuple0 = newItem(11)

export let first: item | $.VarRef<item> | null = __goscriptTuple0[0]

const __goscriptTuple1 = newItem(13)

export let second: item | $.VarRef<item> | null = __goscriptTuple1[0]

export async function main(): globalThis.Promise<void> {
	await $.println($.pointerValue<item>(first).value + $.pointerValue<item>(second).value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

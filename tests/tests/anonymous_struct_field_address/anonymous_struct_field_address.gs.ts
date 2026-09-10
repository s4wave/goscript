// Generated file based on anonymous_struct_field_address.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class entry {
	public declare value: number

	public _fields: {
		value: number
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: init?.value ?? (0 as number)
		}
	}

	public clone(): entry {
		return $.markAsStructValue(new entry(this))
	}

	public add(value: number): void {
		let e: entry | $.VarRef<entry> | null = this;
		$.pointerValue<entry>(e).value = $.pointerValue<entry>(e).value + (value)
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.entry",
		() => new entry(),
		() => [{ name: "add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		entry,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export let box: {"table": entry[]} = {"table": Array.from({ length: 2 }, () => $.markAsStructValue(new entry()))}

export function __goscript_set_box(__goscriptValue: {"table": entry[]}): void {
	box = __goscriptValue
}

export function entries(): $.VarRef<entry[]> | null {
	return $.fieldRef(box, "table")
}

export async function main(): globalThis.Promise<void> {
	let table: $.VarRef<entry[]> | null = entries()
	$.arrayIndex($.pointerValue<entry[]>(table), 0).add(5)
	await $.println($.arrayIndex($.pointerValue<entry[]>(table), 0).value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

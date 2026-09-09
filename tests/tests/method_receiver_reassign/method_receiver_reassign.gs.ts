// Generated file based on method_receiver_reassign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public declare n: number

	public _fields: {
		n: number
	}

	constructor(init?: Partial<{n?: number}>) {
		this._fields = {
			n: init?.n ?? (0 as number)
		}
	}

	public clone(): item {
		return $.markAsStructValue(new item(this))
	}

	public dec(): item {
		let s: item = this
		if (s.n > 0) {
			$.assignStruct(s, $.markAsStructValue(new item({n: s.n - 1})))
		}
		return $.markAsStructValue($.cloneStructValue(s))
	}

	static {
		$.bindStructFields(this.prototype, ["n"])
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		() => [{ name: "dec", args: [], returns: [{ type: "main.item" }] }],
		item,
		() => [{ name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let original = $.markAsStructValue(new item({n: 2}))
	let out = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(original)).dec()))
	await $.println("original:", original.n)
	await $.println("out:", out.n)
}

if ($.isMainScript(import.meta)) {
	await main()
}

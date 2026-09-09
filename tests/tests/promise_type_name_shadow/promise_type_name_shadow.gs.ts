// Generated file based on promise_type_name_shadow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Promise {
	public declare value: string

	public _fields: {
		value: string
	}

	constructor(init?: Partial<{value?: string}>) {
		this._fields = {
			value: init?.value ?? ("" as string)
		}
	}

	public clone(): Promise {
		return $.markAsStructValue(new Promise(this))
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.Promise",
		() => new Promise(),
		() => [],
		Promise,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let p = $.markAsStructValue(new Promise({value: "ok"}))
	await $.println(p.value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

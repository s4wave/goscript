// Generated file based on type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strings from "@goscript/strings/index.js"

import * as __goscript_helper from "./helper.gs.ts"

import * as __goscript_method from "./method.gs.ts"
import "@goscript/strings/index.js"
import "./helper.gs.ts"
import "./method.gs.ts"

export class label {
	public declare value: string

	public _fields: {
		value: string
	}

	constructor(init?: Partial<{value?: string}>) {
		this._fields = {
			value: init?.value ?? ("" as string)
		}
	}

	public clone(): label {
		return $.markAsStructValue(new label(this))
	}

	public Format(): string {
		const l = this
		let state: __goscript_helper.helperState | $.VarRef<__goscript_helper.helperState> | null = __goscript_helper.newHelperState()
		return strings.ToUpper(l.value) + $.pointerValue<__goscript_helper.helperState>(state).text
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.label",
		() => new label(),
		() => [{ name: "Format", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		label,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let item = $.markAsStructValue(new label({value: "go"}))
	await $.println($.markAsStructValue($.cloneStructValue(item)).Format())
}

if ($.isMainScript(import.meta)) {
	await main()
}

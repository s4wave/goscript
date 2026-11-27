// Generated file based on type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as strings from "@goscript/strings/index.js"
import * as __goscript_helper from "./helper.gs.ts"
import type * as __goscript_method from "./method.gs.ts"

export class label {
	public declare value: string

	constructor(__goscriptValue?: boolean, value$?: string) {
		this.value = value$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): label {
		return new label(true, this.value)
	}

	public __goscriptAssign(source: label): this {
		this.value = source.value
		return this
	}

	public Format(): string {
		const l = this;
		let state = __goscript_helper.newHelperState()
		return strings.ToUpper(l.value) + $.pointerValue<__goscript_helper.helperState>(state).text
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
	let item = new label(true, "go")
	await $.println(item.Format())
}

if ($.isMainScript(import.meta)) {
	await main()
}

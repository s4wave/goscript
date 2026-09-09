// Generated file based on struct_field_declaration_order.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class inner {
	public declare value: number

	public _fields: {
		value: number
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: init?.value ?? (0 as number)
		}
	}

	public clone(): inner {
		return $.markAsStructValue(new inner(this))
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.inner",
		() => new inner(),
		() => [],
		inner,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class outer {
	public declare inner: inner

	public _fields: {
		inner: inner
	}

	constructor(init?: Partial<{inner?: inner}>) {
		this._fields = {
			inner: init?.inner ? $.markAsStructValue($.cloneStructValue(init.inner)) : $.markAsStructValue(new inner())
		}
	}

	public clone(): outer {
		return $.markAsStructValue(new outer(this))
	}

	static {
		$.bindStructFields(this.prototype, ["inner"])
	}

	static __typeInfo = $.registerStructType(
		"main.outer",
		() => new outer(),
		() => [],
		outer,
		() => [{ name: "inner", key: "inner", type: "main.inner" }]
	)
}

export let defaultOuter: outer = $.markAsStructValue(new outer())

export function __goscript_set_defaultOuter(__goscriptValue: outer): void {
	$.assignStruct(defaultOuter, __goscriptValue)
}

export async function main(): globalThis.Promise<void> {
	defaultOuter.inner.value = 7
	await $.println(defaultOuter.inner.value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

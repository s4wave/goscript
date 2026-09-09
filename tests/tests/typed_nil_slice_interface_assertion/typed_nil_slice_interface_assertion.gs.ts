// Generated file based on typed_nil_slice_interface_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public declare value: string

	public _fields: {
		value: string
	}

	constructor(init?: Partial<{value?: string}>) {
		this._fields = {
			value: init?.value ?? ("" as string)
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
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let boxed: any = $.interfaceValue(null, "[]*main.item", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.item")))
	let asserted: $.Slice<item | $.VarRef<item> | null> = $.mustTypeAssert<$.Slice<item | $.VarRef<item> | null>>(boxed, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.item")))
	await $.println(asserted == null)

	let __goscriptTuple0: any = $.typeAssertTuple<$.Slice<item | $.VarRef<item> | null>>(boxed, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.item")))
	let commaOK: $.Slice<item | $.VarRef<item> | null> = __goscriptTuple0[0]
	let ok = __goscriptTuple0[1]
	await $.println(ok, commaOK == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}

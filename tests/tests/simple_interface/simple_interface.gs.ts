// Generated file based on simple_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public declare Value: number

	public _fields: {
		Value: number
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: init?.Value ?? (0 as number)
		}
	}

	public clone(): MyStruct {
		return $.markAsStructValue(new MyStruct(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Value"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		() => [],
		MyStruct,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let original = $.varRef($.markAsStructValue(new MyStruct({Value: 30})))
	let pAlias: MyStruct | $.VarRef<MyStruct> | null = original

	let jAlias: any = $.interfaceValue(pAlias, "*main.MyStruct", /* @__PURE__ */ $.pointerType("main.MyStruct"))

	let [, ok] = $.typeAssertTuple<MyStruct | $.VarRef<MyStruct> | null>(jAlias, /* @__PURE__ */ $.pointerType("main.MyStruct"))
	await $.println("pointer assertion result:", ok)
}

if ($.isMainScript(import.meta)) {
	await main()
}

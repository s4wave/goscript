// Generated file based on interface_to_interface_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInterface = {
	Method1(): number
}

$.registerInterfaceType(
	"main.MyInterface",
	null,
	[{ name: "Method1", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export type MyOtherInterface = {
	Method1(): number
}

$.registerInterfaceType(
	"main.MyOtherInterface",
	null,
	[{ name: "Method1", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

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

	public Method1(): number {
		const m = this
		return m.Value
	}

	static {
		$.bindStructFields(this.prototype, ["Value"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		() => [{ name: "Method1", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		MyStruct,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let i: MyInterface | null = null! as MyInterface | null
	let s = $.markAsStructValue(new MyStruct({Value: 10}))
	i = $.interfaceValue<MyInterface | null>($.markAsStructValue($.cloneStructValue(s)), "main.MyStruct", "main.MyStruct")

	let [, ok] = $.typeAssertTuple<MyOtherInterface | null>(i, "main.MyOtherInterface")
	if (ok) {
		await $.println("Type assertion successful")
	} else {
		await $.println("Type assertion failed")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

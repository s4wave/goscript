// Generated file based on interface_subset_cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInterface1 = {
	MyString1(): string
	MyString2(): string
}

$.registerInterfaceType(
	"main.MyInterface1",
	null,
	[{ name: "MyString1", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "MyString2", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export type MyInterface2 = {
	MyString1(): string
}

$.registerInterfaceType(
	"main.MyInterface2",
	null,
	[{ name: "MyString1", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export class MyStruct {
	public declare Value1: string

	public declare Value2: string

	public _fields: {
		Value1: string
		Value2: string
	}

	constructor(init?: Partial<{Value1?: string, Value2?: string}>) {
		this._fields = {
			Value1: init?.Value1 ?? ("" as string),
			Value2: init?.Value2 ?? ("" as string)
		}
	}

	public clone(): MyStruct {
		return $.markAsStructValue(new MyStruct(this))
	}

	public MyString1(): string {
		const m = this
		return m.Value1
	}

	public MyString2(): string {
		const m = this
		return m.Value2
	}

	static {
		$.bindStructFields(this.prototype, ["Value1", "Value2"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		() => [{ name: "MyString1", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "MyString2", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		MyStruct,
		() => [{ name: "Value1", key: "Value1", type: /* @__PURE__ */ $.basicType("string") }, { name: "Value2", key: "Value2", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let s = $.markAsStructValue(new MyStruct({Value1: "hello", Value2: "world"}))
	let i1: MyInterface1 | null = $.interfaceValue<MyInterface1 | null>($.markAsStructValue($.cloneStructValue(s)), "main.MyStruct", "main.MyStruct")

	// Cast from larger interface to smaller interface (subset)
	let i2: MyInterface2 | null = (i1 as MyInterface2 | null)

	await $.println("i1.MyString1():", await $.pointerValue<Exclude<MyInterface1, null>>(i1).MyString1())
	await $.println("i1.MyString2():", await $.pointerValue<Exclude<MyInterface1, null>>(i1).MyString2())
	await $.println("i2.MyString1():", await $.pointerValue<Exclude<MyInterface2, null>>(i2).MyString1())

	// Type assertion from larger to smaller interface
	let [i3, ok] = $.typeAssertTuple<MyInterface2 | null>(i1, "main.MyInterface2")
	if (ok) {
		await $.println("Type assertion successful")
		await $.println("i3.MyString1():", await $.pointerValue<Exclude<MyInterface2, null>>(i3).MyString1())
	} else {
		await $.println("Type assertion failed")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on composite_literal_assignment.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public declare MyInt: number

	public declare MyString: string

	public declare myBool: boolean

	public _fields: {
		MyInt: number
		MyString: string
		myBool: boolean
	}

	constructor(init?: Partial<{MyInt?: number, MyString?: string, myBool?: boolean}>) {
		this._fields = {
			MyInt: init?.MyInt ?? (0 as number),
			MyString: init?.MyString ?? ("" as string),
			myBool: init?.myBool ?? (false as boolean)
		}
	}

	public clone(): MyStruct {
		return $.markAsStructValue(new MyStruct(this))
	}

	static {
		$.bindStructFields(this.prototype, ["MyInt", "MyString", "myBool"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		() => [],
		MyStruct,
		() => [{ name: "MyInt", key: "MyInt", type: /* @__PURE__ */ $.basicType("int") }, { name: "MyString", key: "MyString", type: /* @__PURE__ */ $.basicType("string") }, { name: "myBool", key: "myBool", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export async function main(): globalThis.Promise<void> {
	// === Composite Literal Assignment (Value Copy) ===
	// Creating a struct directly using a composite literal.
	let structLiteral = $.markAsStructValue(new MyStruct({MyString: "composite literal"}))
	// Assigning it creates another independent copy.
	let structLiteralCopy = $.markAsStructValue($.cloneStructValue(structLiteral))
	structLiteralCopy.MyString = "modified composite literal copy"
	// Expected: "composite literal"
	await $.println("Original struct literal: Expected: composite literal, Actual: " + structLiteral.MyString)
	// Expected: "modified composite literal copy"
	await $.println("Modified struct literal copy: Expected: modified composite literal copy, Actual: " + structLiteralCopy.MyString)
}

if ($.isMainScript(import.meta)) {
	await main()
}

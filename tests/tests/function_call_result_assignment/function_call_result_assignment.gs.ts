// Generated file based on function_call_result_assignment.go
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

export function NewMyStruct(s: string): MyStruct {
	return $.markAsStructValue(new MyStruct({MyString: s}))
}

export async function main(): globalThis.Promise<void> {
	// === Function Call Result Assignment (Value Copy) ===
	// Assigning the result of a function that returns a struct creates a copy.
	let structFromFunc = $.markAsStructValue($.cloneStructValue(NewMyStruct("function result")))
	let structFromFuncCopy = $.markAsStructValue($.cloneStructValue(structFromFunc))
	structFromFuncCopy.MyString = "modified function result copy"
	// Expected: "function result"
	await $.println("Original struct from function: Expected: function result, Actual: " + structFromFunc.MyString)
	// Expected: "modified function result copy"
	await $.println("Modified struct from function copy: Expected: modified function result copy, Actual: " + structFromFuncCopy.MyString)
}

if ($.isMainScript(import.meta)) {
	await main()
}

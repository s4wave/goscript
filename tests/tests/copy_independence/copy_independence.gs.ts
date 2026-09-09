// Generated file based on copy_independence.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public declare MyInt: number

	public declare MyString: string

	public _fields: {
		MyInt: number
		MyString: string
	}

	constructor(init?: Partial<{MyInt?: number, MyString?: string}>) {
		this._fields = {
			MyInt: init?.MyInt ?? (0 as number),
			MyString: init?.MyString ?? ("" as string)
		}
	}

	public clone(): MyStruct {
		return $.markAsStructValue(new MyStruct(this))
	}

	static {
		$.bindStructFields(this.prototype, ["MyInt", "MyString"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		() => [],
		MyStruct,
		() => [{ name: "MyInt", key: "MyInt", type: /* @__PURE__ */ $.basicType("int") }, { name: "MyString", key: "MyString", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let structPointer: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({MyInt: 4, MyString: "hello world"})
	let dereferencedStructCopy = $.markAsStructValue($.cloneStructValue($.pointerValue<MyStruct>(structPointer)))
	dereferencedStructCopy.MyString = "original dereferenced copy modified"
	let valueCopy1 = $.markAsStructValue($.cloneStructValue(dereferencedStructCopy))
	valueCopy1.MyString = "value copy 1"
	let valueCopy2 = $.markAsStructValue($.cloneStructValue(dereferencedStructCopy))
	valueCopy2.MyString = "value copy 2"
	let pointerCopy: MyStruct | $.VarRef<MyStruct> | null = structPointer

	// === Verifying Copy Independence ===
	// Expected: "hello world"
	await $.println("pointerCopy (points to original structPointer): Expected: hello world, Actual: " + $.pointerValue<MyStruct>(pointerCopy).MyString)
	// Expected: "original dereferenced copy modified"
	await $.println("dereferencedStructCopy (modified after copies were made): Expected: original dereferenced copy modified, Actual: " + dereferencedStructCopy.MyString)
	// Expected: "value copy 1"
	await $.println("valueCopy1: Expected: value copy 1, Actual: " + valueCopy1.MyString)
	// Expected: "value copy 2"
	await $.println("valueCopy2: Expected: value copy 2, Actual: " + valueCopy2.MyString)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on pointer_assignment_no_copy.go
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
	let original: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({MyInt: 10, MyString: "original"})

	// === Pointer Assignment (No Copy) ===
	// Assigning a pointer variable to another pointer variable.
	let pointerCopy: MyStruct | $.VarRef<MyStruct> | null = original

	// Modify the struct through the original pointer.
	$.pointerValue<MyStruct>(original).MyString = "modified original"

	// The change should be reflected when accessing through the copied pointer.
	// Expected: "modified original"
	await $.println("Pointer copy value: Expected: modified original, Actual: " + $.pointerValue<MyStruct>(pointerCopy).MyString)

	// Modify the struct through the copied pointer.
	$.pointerValue<MyStruct>(pointerCopy).MyInt = 20

	// The change should be reflected when accessing through the original pointer.
	// Expected: 20
	await $.println("Original value after pointer copy modification: Expected: 20, Actual:", $.pointerValue<MyStruct>(original).MyInt)
}

if ($.isMainScript(import.meta)) {
	await main()
}

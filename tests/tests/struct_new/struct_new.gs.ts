// Generated file based on struct_new.go
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
	// Test new(MyStruct)
	let ptr: MyStruct | $.VarRef<MyStruct> | null = new MyStruct()
	await $.println("ptr.MyInt (default):", $.pointerValue<MyStruct>(ptr).MyInt)
	await $.println("ptr.MyString (default):", $.pointerValue<MyStruct>(ptr).MyString)
	await $.println("ptr.myBool (default):", $.pointerValue<MyStruct>(ptr).myBool)

	$.pointerValue<MyStruct>(ptr).MyInt = 42
	$.pointerValue<MyStruct>(ptr).MyString = "hello"
	$.pointerValue<MyStruct>(ptr).myBool = true

	await $.println("ptr.MyInt (assigned):", $.pointerValue<MyStruct>(ptr).MyInt)
	await $.println("ptr.MyString (assigned):", $.pointerValue<MyStruct>(ptr).MyString)
	await $.println("ptr.myBool (assigned):", $.pointerValue<MyStruct>(ptr).myBool)

	// Test assignment to a dereferenced new struct
	let s: MyStruct = $.markAsStructValue($.cloneStructValue($.pointerValue<MyStruct>(new MyStruct())))
	await $.println("s.MyInt (default):", s.MyInt)
	await $.println("s.MyString (default):", s.MyString)
	await $.println("s.myBool (default):", s.myBool)

	s.MyInt = 100
	s.MyString = "world"
	s.myBool = false

	await $.println("s.MyInt (assigned):", s.MyInt)
	await $.println("s.MyString (assigned):", s.MyString)
	await $.println("s.myBool (assigned):", s.myBool)
}

if ($.isMainScript(import.meta)) {
	await main()
}

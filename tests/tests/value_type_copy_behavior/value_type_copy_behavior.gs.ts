// Generated file based on value_type_copy_behavior.go
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

export class NestedStruct {
	public declare Value: number

	public declare InnerStruct: MyStruct

	public _fields: {
		Value: number
		InnerStruct: MyStruct
	}

	constructor(init?: Partial<{Value?: number, InnerStruct?: MyStruct}>) {
		this._fields = {
			Value: init?.Value ?? (0 as number),
			InnerStruct: init?.InnerStruct ? $.markAsStructValue($.cloneStructValue(init.InnerStruct)) : $.markAsStructValue(new MyStruct())
		}
	}

	public clone(): NestedStruct {
		return $.markAsStructValue(new NestedStruct(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Value", "InnerStruct"])
	}

	static __typeInfo = $.registerStructType(
		"main.NestedStruct",
		() => new NestedStruct(),
		() => [],
		NestedStruct,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("int") }, { name: "InnerStruct", key: "InnerStruct", type: "main.MyStruct" }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Horizontal line for output clarity
	await $.println("----------------------------------------------------------")
	await $.println("VALUE TYPE COPY BEHAVIOR TEST")
	await $.println("----------------------------------------------------------")

	// original is the starting struct instance.
	// We take its address later for pointerCopy, so it might be allocated on the heap (varrefed).
	let original = $.varRef($.markAsStructValue(new MyStruct({MyInt: 42, MyString: "original"})))

	// === Value-Type Copy Behavior ===
	// Assigning a struct (value type) creates independent copies.
	// valueCopy1 and valueCopy2 get their own copies of 'original's data.
	let valueCopy1 = $.markAsStructValue($.cloneStructValue(original.value))
	let valueCopy2 = $.markAsStructValue($.cloneStructValue(original.value))
	// pointerCopy holds the memory address of 'original'.
	let pointerCopy: MyStruct | $.VarRef<MyStruct> | null = original

	// Modifications to value copies do not affect the original or other copies.
	valueCopy1.MyString = "value copy 1"
	// Modify the original struct *after* the value copies were made.
	original.value.MyString = "original modified"
	valueCopy2.MyString = "value copy 2"

	await $.println("Value Copy Test:")
	// valueCopy1 was modified independently.
	await $.println("  valueCopy1.MyString: " + valueCopy1.MyString)
	// original was modified after copies, showing its current state.
	await $.println("  original.MyString: " + original.value.MyString)
	// valueCopy2 was modified independently.
	await $.println("  valueCopy2.MyString: " + valueCopy2.MyString)

	// === Pointer Behavior ===
	// Demonstrate how modifications via a pointer affect the original struct.
	await $.println("\nPointer Behavior Test:")
	// Show the state of 'original' before modification via the pointer.
	await $.println("  Before pointer modification - original.MyString: " + original.value.MyString)

	// Modify the struct 'original' *through* the pointerCopy.
	$.pointerValue<MyStruct>(pointerCopy).MyString = "modified through pointer"
	$.pointerValue<MyStruct>(pointerCopy).MyInt = 100

	// Show the state of 'original' *after* modification via the pointer.
	// Both fields reflect the changes made through pointerCopy.
	await $.println("  After pointer modification - original.MyString:", original.value.MyString)
	await $.println("  After pointer modification - original.MyInt:", original.value.MyInt)

	// === Nested Struct Behavior ===
	// Demonstrate copy behavior with structs containing other structs.
	await $.println("\nNested Struct Test:")
	let nestedOriginal = $.markAsStructValue(new NestedStruct({Value: 10, InnerStruct: $.markAsStructValue(new MyStruct({MyInt: 20, MyString: "inner original"}))}))

	// Create a value copy of the nested struct. This copies both the outer
	// struct's fields (Value) and the inner struct (InnerStruct) by value.
	let nestedCopy = $.markAsStructValue($.cloneStructValue(nestedOriginal))

	// Modify the copy's fields, including fields within the nested InnerStruct.
	nestedCopy.InnerStruct.MyString = "inner modified"
	nestedCopy.Value = 30

	// Show that modifications to nestedCopy did not affect nestedOriginal.
	await $.println("  nestedCopy.Value: ", nestedCopy.Value)
	await $.println("  nestedOriginal.Value: ", nestedOriginal.Value)
	await $.println("  nestedCopy.InnerStruct.MyString: " + nestedCopy.InnerStruct.MyString)
	await $.println("  nestedOriginal.InnerStruct.MyString: " + nestedOriginal.InnerStruct.MyString)

	await $.println("----------------------------------------------------------")
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on varref_struct.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"
import "@goscript/reflect/index.js"

export class MyStruct {
	// MyInt is shared through pointers to this storage.
	public declare MyInt: number

	public _fields: {
		MyInt: number
	}

	constructor(init?: Partial<{MyInt?: number}>) {
		this._fields = {
			MyInt: init?.MyInt ?? (0 as number)
		}
	}

	public clone(): MyStruct {
		return $.markAsStructValue(new MyStruct(this))
	}

	static {
		$.bindStructFields(this.prototype, ["MyInt"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		() => [],
		MyStruct,
		() => [/* @__PURE__ */ $.structField("MyInt", /* @__PURE__ */ $.basicType("int"), [0], 0, true)]
	)
}

export class Outer {
	// Child is copied in place during assignment.
	public declare Child: MyStruct

	// Items retains the addresses of array elements.
	public declare Items: MyStruct[]

	// Ptr is replaced rather than copied through its pointee.
	public declare Ptr: MyStruct | $.VarRef<MyStruct> | null

	public _fields: {
		Child: MyStruct
		Items: MyStruct[]
		Ptr: MyStruct | $.VarRef<MyStruct> | null
	}

	constructor(init?: Partial<{Child?: MyStruct, Items?: MyStruct[], Ptr?: MyStruct | $.VarRef<MyStruct> | null}>) {
		this._fields = {
			Child: init?.Child ? $.markAsStructValue($.cloneStructValue(init.Child)) : $.markAsStructValue(new MyStruct()),
			Items: init?.Items !== undefined ? $.cloneArrayValue(init.Items, /* @__PURE__ */ $.arrayType("main.MyStruct", 2)) : Array.from({ length: 2 }, () => $.markAsStructValue(new MyStruct())),
			Ptr: init?.Ptr ?? (null! as MyStruct | $.VarRef<MyStruct> | null)
		}
	}

	public clone(): Outer {
		return $.markAsStructValue(new Outer(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Child", "Items", "Ptr"])
	}

	static __typeInfo = $.registerStructType(
		"main.Outer",
		() => new Outer(),
		() => [],
		Outer,
		() => [/* @__PURE__ */ $.structField("Child", "main.MyStruct", [0], 0, true), /* @__PURE__ */ $.structField("Items", /* @__PURE__ */ $.arrayType("main.MyStruct", 2), [1], 8, true), /* @__PURE__ */ $.structField("Ptr", /* @__PURE__ */ $.pointerType("main.MyStruct"), [2], 24, true)]
	)
}

export let global: MyStruct = $.markAsStructValue(new MyStruct())

export function __goscript_set_global(__goscriptValue: MyStruct): void {
	$.assignStruct(global, __goscriptValue)
}

export function pair(): [MyStruct, MyStruct] {
	return [$.markAsStructValue(new MyStruct({MyInt: 70})), $.markAsStructValue(new MyStruct({MyInt: 80}))]
}

export async function main(): globalThis.Promise<void> {
	// 'val' is a value type, but its address is taken, so it should be varrefed in TS.
	let val = $.varRef($.markAsStructValue(new MyStruct({MyInt: 10})))
	let ptrToVal: MyStruct | $.VarRef<MyStruct> | null = val

	// Accessing pointer value, should use .value
	await $.println("ptrToVal.MyInt:", $.pointerValue<MyStruct>(ptrToVal).MyInt)

	// Accessing pointer value, should use .value
	let myIntVal = $.pointerValue<MyStruct>(ptrToVal).MyInt
	await $.println("myIntVal:", myIntVal)

	// Field pointers retain their storage identity across whole-value assignment.
	let field = $.fieldRef(val.value._fields, "MyInt")
	$.assignStruct(val.value, $.markAsStructValue(new MyStruct({MyInt: 30})))
	await $.println("field after assignment:", $.pointerValue<number>(field), $.pointerEqual(field, $.fieldRef(val.value._fields, "MyInt")))
	field!.value = 40
	await $.println("write through field:", val.value.MyInt, $.pointerValue<MyStruct>(ptrToVal).MyInt)

	// TypeScript keywords use the same storage key for reads and addresses.
	let keywords = {_catch: 5}
	let keyword = $.fieldRef(keywords, "_catch")
	keyword!.value = 6
	await $.println("keyword field:", keywords._catch, $.pointerEqual(keyword, $.fieldRef(keywords, "_catch")))

	// Nested values keep their storage while pointer fields change referents.
	let first: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({MyInt: 1})
	let second: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({MyInt: 2})
	let outer = $.markAsStructValue(new Outer({Ptr: first}))
	let child = $.fieldRef(outer.Child._fields, "MyInt")
	let item = $.fieldRef($.arrayIndex(outer.Items, 0)._fields, "MyInt")
	let ptrField = $.fieldRef(outer._fields, "Ptr")
	$.assignStruct(outer, $.markAsStructValue(new Outer({Child: $.markAsStructValue(new MyStruct({MyInt: 50})), Items: [$.markAsStructValue(new MyStruct({MyInt: 60})), $.markAsStructValue(new MyStruct())], Ptr: second})))
	await $.println("nested:", $.pointerValue<number>(child), $.pointerValue<number>(item), $.pointerEqual($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(ptrField), second), $.pointerValue<MyStruct>(first).MyInt)
	await $.println("nested identity:", $.pointerEqual(child, $.fieldRef(outer.Child._fields, "MyInt")), $.pointerEqual(item, $.fieldRef($.arrayIndex(outer.Items, 0)._fields, "MyInt")), $.pointerEqual(ptrField, $.fieldRef(outer._fields, "Ptr")))

	// Both tuple and parallel assignments update existing variable storage.
	let __goscriptTuple0: any = pair()
	$.assignStruct(val.value, __goscriptTuple0[0])
	$.assignStruct(global, __goscriptTuple0[1])
	await $.println("tuple:", $.pointerValue<number>(field), global.MyInt)
	let globalField = $.fieldRef(global._fields, "MyInt")
	let __goscriptAssign0_0: MyStruct = $.markAsStructValue($.cloneStructValue(global))
	let __goscriptAssign0_1: MyStruct = $.markAsStructValue($.cloneStructValue(val.value))
	$.assignStruct(val.value, __goscriptAssign0_0)
	$.assignStruct(global, __goscriptAssign0_1)
	await $.println("parallel:", $.pointerValue<number>(field), $.pointerValue<number>(globalField))
	$.assignStruct(global, $.markAsStructValue(new MyStruct({MyInt: 90})))
	await $.println("global:", $.pointerValue<number>(globalField))

	// Reflection writes through the same aggregate storage as generated assignment.
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(val, "*main.MyStruct", /* @__PURE__ */ $.pointerType("main.MyStruct"))))).Elem())).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.markAsStructValue(new MyStruct({MyInt: 100})), "main.MyStruct", "main.MyStruct")))))
	await $.println("reflect:", $.pointerValue<number>(field), $.pointerEqual(field, $.fieldRef(val.value._fields, "MyInt")))
	let reflected = $.mustTypeAssert<$.VarRef<number> | null>($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(val, "*main.MyStruct", /* @__PURE__ */ $.pointerType("main.MyStruct"))))).Elem())).FieldByName("MyInt"))).Addr())).Interface(), /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))
	await $.println("reflect address:", $.pointerEqual(reflected, field))
}

if ($.isMainScript(import.meta)) {
	await main()
}

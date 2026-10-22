// Generated file based on varref_struct.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export class MyStruct {
	// MyInt is shared through pointers to this storage.
	public declare MyInt: number

	constructor(__goscriptValue?: boolean, MyInt$?: number) {
		this.MyInt = MyInt$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): MyStruct {
		return new MyStruct(true, this.MyInt)
	}

	public __goscriptAssign(source: MyStruct): this {
		this.MyInt = source.MyInt
		return this
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

	constructor(__goscriptValue?: boolean, Child$?: MyStruct, Items$?: MyStruct[], Ptr$?: MyStruct | $.VarRef<MyStruct> | null) {
		this.Child = Child$ ?? new MyStruct(true)
		this.Items = Items$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => new MyStruct(true)), /* @__PURE__ */ $.arrayType("main.MyStruct", 2))
		this.Ptr = Ptr$ ?? (null! as MyStruct | $.VarRef<MyStruct> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Outer {
		return new Outer(true, this.Child.clone(), $.cloneArrayValue(this.Items, __goscriptStatic0()), this.Ptr)
	}

	public __goscriptAssign(source: Outer): this {
		this.Child.__goscriptAssign(source.Child)
		this.Items = $.assignFieldValue(this.Items, source.Items, __goscriptStatic0())
		this.Ptr = source.Ptr
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Outer",
		() => new Outer(),
		() => [],
		Outer,
		() => [/* @__PURE__ */ $.structField("Child", "main.MyStruct", [0], 0, true), /* @__PURE__ */ $.structField("Items", /* @__PURE__ */ $.arrayType("main.MyStruct", 2), [1], 8, true), /* @__PURE__ */ $.structField("Ptr", /* @__PURE__ */ $.pointerType("main.MyStruct"), [2], 24, true)]
	)
}

export let global: MyStruct = new MyStruct(true)

export function __goscript_set_global(__goscriptValue: MyStruct): void {
	$.assignStruct(global, __goscriptValue)
}

export function pair(): [MyStruct, MyStruct] {
	return [new MyStruct(true, 70), new MyStruct(true, 80)]
}

export async function main(): globalThis.Promise<void> {
	// 'val' is a value type, but its address is taken, so it should be varrefed in TS.
	let val = $.varRef(new MyStruct(true, 10))
	let ptrToVal = val
	let ptrToVal$: MyStruct = ptrToVal == null ? $.pointerTarget<MyStruct>(ptrToVal) : (ptrToVal as any).__isVarRef === true ? (ptrToVal as any).value : (ptrToVal as any).__goValue === undefined ? (ptrToVal as any) : $.pointerTarget<MyStruct>(ptrToVal)

	// Accessing pointer value, should use .value
	await $.println("ptrToVal.MyInt:", (ptrToVal$ as MyStruct).MyInt)

	// Accessing pointer value, should use .value
	let myIntVal = (ptrToVal$ as MyStruct).MyInt
	await $.println("myIntVal:", myIntVal)

	// Field pointers retain their storage identity across whole-value assignment.
	let field = $.fieldRef(val.value, "MyInt")
	val.value = val.value.__goscriptAssign(new MyStruct(true, 30))
	await $.println("field after assignment:", $.pointerValue<number>(field), $.pointerEqual(field, $.fieldRef(val.value, "MyInt")))
	field!.value = 40
	await $.println("write through field:", val.value.MyInt, (ptrToVal$ as MyStruct).MyInt)

	// TypeScript keywords use the same storage key for reads and addresses.
	let keywords = $.anonymousStructValue({_catch: 5}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("catch", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { key: "_catch", pkgPath: "github.com/s4wave/goscript/tests/tests/varref_struct" })] })
	let keyword = $.fieldRef(keywords, "_catch")
	keyword!.value = 6
	await $.println("keyword field:", keywords._catch, $.pointerEqual(keyword, $.fieldRef(keywords, "_catch")))

	// Nested values keep their storage while pointer fields change referents.
	let first = new MyStruct(false, 1)
	let second = new MyStruct(false, 2)
	let outer = new Outer(true, undefined, undefined, first)
	let child = $.fieldRef(outer.Child, "MyInt")
	let item = $.fieldRef(outer.Items[0], "MyInt")
	let ptrField = $.fieldRef(outer, "Ptr")
	outer = outer.__goscriptAssign(new Outer(true, new MyStruct(true, 50), $.arrayValue([new MyStruct(true, 60), new MyStruct(true)], __goscriptStatic0()), second))
	await $.println("nested:", $.pointerValue<number>(child), $.pointerValue<number>(item), ($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(ptrField) === second || ($.pointerAliasesMade || ($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(ptrField) as any)?.__goElementBacking !== undefined) && $.pointerEqual($.pointerValue<MyStruct | $.VarRef<MyStruct> | null>(ptrField), second)), $.pointerValue<MyStruct>(first).MyInt)
	await $.println("nested identity:", $.pointerEqual(child, $.fieldRef(outer.Child, "MyInt")), $.pointerEqual(item, $.fieldRef(outer.Items[0], "MyInt")), $.pointerEqual(ptrField, $.fieldRef(outer, "Ptr")))

	// Both tuple and parallel assignments update existing variable storage.
	let __goscriptTuple0: any = pair()
	val.value = val.value.__goscriptAssign(__goscriptTuple0[0])
	global.__goscriptAssign(__goscriptTuple0[1])
	await $.println("tuple:", $.pointerValue<number>(field), global.MyInt)
	let globalField = $.fieldRef(global, "MyInt")
	let __goscriptAssign0_0: MyStruct = (global).clone()
	let __goscriptAssign0_1: MyStruct = (val.value).clone()
	val.value = val.value.__goscriptAssign(__goscriptAssign0_0)
	global.__goscriptAssign(__goscriptAssign0_1)
	await $.println("parallel:", $.pointerValue<number>(field), $.pointerValue<number>(globalField))
	global.__goscriptAssign(new MyStruct(true, 90))
	await $.println("global:", $.pointerValue<number>(globalField))

	// Reflection writes through the same aggregate storage as generated assignment.
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(val, "*main.MyStruct", /* @__PURE__ */ $.pointerType("main.MyStruct"))))).Elem())).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.structInterfaceValue(new MyStruct(true, 100), "main.MyStruct", "main.MyStruct")))))
	await $.println("reflect:", $.pointerValue<number>(field), $.pointerEqual(field, $.fieldRef(val.value, "MyInt")))
	let reflected = $.mustTypeAssert<$.VarRef<number> | null>($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(val, "*main.MyStruct", /* @__PURE__ */ $.pointerType("main.MyStruct"))))).Elem())).FieldByName("MyInt"))).Addr())).Interface(), /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))
	await $.println("reflect address:", (reflected === field || ($.pointerAliasesMade || (reflected as any)?.__goElementBacking !== undefined) && $.pointerEqual(reflected, field)))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType("main.MyStruct", 2))
}

if ($.isMainScript(import.meta)) {
	await main()
}

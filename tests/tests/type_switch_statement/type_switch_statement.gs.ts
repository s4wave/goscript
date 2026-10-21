// Generated file based on type_switch_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type ObjectIdentifier = $.Slice<number>

$.registerNamedType("main.ObjectIdentifier", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")));

export class RawValue {
	public declare Tag: number

	constructor(__goscriptValue?: boolean, Tag$?: number) {
		this.Tag = Tag$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): RawValue {
		return new RawValue(true, this.Tag)
	}

	public __goscriptAssign(source: RawValue): this {
		this.Tag = source.Tag
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.RawValue",
		() => new RawValue(),
		() => [],
		RawValue,
		() => [{ name: "Tag", key: "Tag", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Basic type switch with variable and default case
	let i: any = "hello"
	{
		const __goscriptTypeSwitchValue = i
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic0())) {
			case 0:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int")).value
					await $.println("int", v)
				}
				break
			case 1:
				{
					let v: string = $.typeAssert<string>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("string")).value
					await $.println("string", v)
				}
				break
			default:
				{
					let v: any = __goscriptTypeSwitchValue
					await $.println("unknown")
				}
				break
		}
	}

	// Type switch without variable
	let x: any = $.basicInterfaceValue(123, "int")
	{
		const __goscriptTypeSwitchValue = x
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic1())) {
			case 0:
				{
					await $.println("bool")
				}
				break
			case 1:
				{
					await $.println("int")
				}
				break
		}
	}

	// Type switch with multiple types in a case
	let y: any = true
	{
		const __goscriptTypeSwitchValue = y
		switch (true) {
			case $.is(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int")) || $.is(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("float64")):
				{
					let v = __goscriptTypeSwitchValue
					await $.println("number", v)
				}
				break
			case $.is(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("string")) || $.is(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("bool")):
				{
					let v = __goscriptTypeSwitchValue
					await $.println("string or bool", v)
				}
				break
		}
	}

	// Type switch with initialization statement
	let z = getInterface()
	{
		const __goscriptTypeSwitchValue = z
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic2())) {
			case 0:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int")).value
					await $.println("z is int", v)
				}
				break
		}
	}

	// Default-only type switch
	let w: any = "test"
	{
		const __goscriptTypeSwitchValue = w
		switch (true) {
			default:
				{
					await $.println("default only")
				}
				break
		}
	}
	{
		const __goscriptTypeSwitchValue = w
		switch (true) {
			default:
				{
					await $.println("default only, value is", $.mustTypeAssert<string>(w, /* @__PURE__ */ $.basicType("string")))
				}
				break
		}
	}

	for (let __goscriptRangeTarget0 = $.arrayToSlice<any>([$.basicInterfaceValue(7, "int32")]), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let v = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as any)
		{
			const __goscriptTypeSwitchValue = v
			switch (true) {
				default:
					{
						let v: any = __goscriptTypeSwitchValue
						await $.println("shadow default", $.int($.mustTypeAssert<number>(v, /* @__PURE__ */ $.basicType("int32")), 32))
					}
					break
			}
		}
	}

	let count = 0
	for (let __goscriptRangeTarget1 = $.arrayToSlice<any>([$.basicInterfaceValue(1, "int"), "skip", $.basicInterfaceValue(2, "int")]), __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let v = (__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as any)
		{
			const __goscriptTypeSwitchValue = v
			switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic3())) {
				case 0:
					{
						let v: string = $.typeAssert<string>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("string")).value
						await $.println("continue", v)
						continue
					}
					break
				case 1:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int")).value
						count += v
					}
					break
			}
		}
		await $.println("after switch")
	}
	await $.println("type switch count", count)

	let oid: $.VarRef<ObjectIdentifier> = $.varRef(null! as ObjectIdentifier)
	let ok = false
	let oidValue: any = $.interfaceValue(oid, "*main.ObjectIdentifier", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"), "main.ObjectIdentifier")))
	{
		const __goscriptTypeSwitchValue = oidValue
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic4())) {
			case 0:
				{
					let v: $.VarRef<ObjectIdentifier> | null = $.typeAssert<$.VarRef<ObjectIdentifier> | null>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"), "main.ObjectIdentifier"))).value
					let __goscriptTuple0: any = parseObjectIdentifier()
					v!.value = (__goscriptTuple0[0] as ObjectIdentifier)
					ok = __goscriptTuple0[1]
				}
				break
		}
	}
	await $.println("oid", $.sliceLen((oid.value as ObjectIdentifier)), $.arrayIndex(oid.value!, 0), ok)

	let raw: $.VarRef<RawValue> = $.varRef(new RawValue(true))
	let rawValue: any = $.interfaceValue(raw, "*main.RawValue", /* @__PURE__ */ $.pointerType("main.RawValue"))
	{
		const __goscriptTypeSwitchValue = rawValue
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic5())) {
			case 0:
				{
					let v: RawValue | $.VarRef<RawValue> | null = $.typeAssert<RawValue | $.VarRef<RawValue> | null>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.pointerType("main.RawValue")).value
					let __goscriptTuple1: any = parseRawValue()
					$.assignStruct($.pointerValue<RawValue>(v), __goscriptTuple1[0])
					ok = __goscriptTuple1[1]
				}
				break
		}
	}
	await $.println("raw", raw.value.Tag, ok)

	// A case variable holds a copy of a struct or array dynamic value.
	let boxed: any = $.structInterfaceValue(new RawValue(true, 1), "main.RawValue", "main.RawValue")
	{
		const __goscriptTypeSwitchValue = boxed
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic6())) {
			case 0:
				{
					let v: RawValue = $.markAsStructValue($.cloneStructValue($.typeAssert<RawValue>(__goscriptTypeSwitchValue, "main.RawValue").value))
					v.Tag = 2
				}
				break
		}
	}
	await $.println("struct copy", $.mustTypeAssert<RawValue>(boxed, "main.RawValue").Tag)

	let boxedArray: any = $.interfaceValue($.arrayValue([1, 2]), "[2]int", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
	{
		const __goscriptTypeSwitchValue = boxedArray
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic7())) {
			case 0:
				{
					let v: number[] = $.cloneArrayValue($.typeAssert<number[]>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)).value, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
					v[0] = 9
				}
				break
		}
	}
	await $.println("array copy", ($.mustTypeAssert<number[]>(boxedArray, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)))[0])

	// A nil case matches only a nil interface, not a typed nil.
	let nilPtr: RawValue | $.VarRef<RawValue> | null = null! as RawValue | $.VarRef<RawValue> | null
	for (let __goscriptRangeTarget2 = $.arrayToSlice<any>([null, $.interfaceValue(nilPtr, "*main.RawValue", /* @__PURE__ */ $.pointerType("main.RawValue")), $.basicInterfaceValue(5, "int")]), __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow2.length; __rangeIndex++) {
		let v = (__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + __rangeIndex] as any)
		{
			const __goscriptTypeSwitchValue = v
			switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic8())) {
				case 0:
					{
						await $.println("nil case")
					}
					break
				case 1:
					{
						await $.println("typed nil case")
					}
					break
				default:
					{
						await $.println("non-nil case")
					}
					break
			}
		}
		{
			const __goscriptTypeSwitchValue = v
			switch (true) {
				case __goscriptTypeSwitchValue == null || $.is(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int")):
					{
						let v = __goscriptTypeSwitchValue
						await $.println("nil or int", v == null)
					}
					break
			}
		}
	}
}

export function getInterface(): any {
	return $.basicInterfaceValue(42, "int")
}

export function parseObjectIdentifier(): [ObjectIdentifier, boolean] {
	return [($.arrayToSlice<number>([1, 2, 3]) as ObjectIdentifier), true]
}

export function parseRawValue(): [RawValue, boolean] {
	return [new RawValue(true, 9), true]
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("string")]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.basicType("bool"), /* @__PURE__ */ $.basicType("int")]))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.basicType("int")]))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")]))
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"), "main.ObjectIdentifier"))]))
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.pointerType("main.RawValue")]))
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ($.typeSwitchSite(["main.RawValue"]))
}

var __goscriptStatic7$value: any
function __goscriptStatic7(): any {
	return __goscriptStatic7$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)]))
}

var __goscriptStatic8$value: any
function __goscriptStatic8(): any {
	return __goscriptStatic8$value ??= ($.typeSwitchSite([null, /* @__PURE__ */ $.pointerType("main.RawValue")]))
}

if ($.isMainScript(import.meta)) {
	await main()
}

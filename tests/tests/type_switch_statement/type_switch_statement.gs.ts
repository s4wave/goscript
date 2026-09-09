// Generated file based on type_switch_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type ObjectIdentifier = $.Slice<number>

export class RawValue {
	public declare Tag: number

	public _fields: {
		Tag: number
	}

	constructor(init?: Partial<{Tag?: number}>) {
		this._fields = {
			Tag: init?.Tag ?? (0 as number)
		}
	}

	public clone(): RawValue {
		return $.markAsStructValue(new RawValue(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Tag"])
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
		switch (true) {
			case $.typeAssert<number>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int")).ok:
				{
					let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int")).value
					await $.println("int", v)
				}
				break
			case $.typeAssert<string>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("string")).ok:
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
		switch (true) {
			case $.typeAssert<boolean>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("bool")).ok:
				{
					await $.println("bool")
				}
				break
			case $.typeAssert<number>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int")).ok:
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
		switch (true) {
			case $.typeAssert<number>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int")).ok:
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

	for (let __goscriptRangeTarget0 = $.arrayToSlice<any>([$.basicInterfaceValue($.int(7, 32), "int32")]), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let v = __goscriptRangeTarget0![__rangeIndex]
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
	for (let __goscriptRangeTarget1 = $.arrayToSlice<any>([$.basicInterfaceValue(1, "int"), "skip", $.basicInterfaceValue(2, "int")]), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let v = __goscriptRangeTarget1![__rangeIndex]
		{
			const __goscriptTypeSwitchValue = v
			switch (true) {
				case $.typeAssert<string>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("string")).ok:
					{
						let v: string = $.typeAssert<string>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("string")).value
						await $.println("continue", v)
						continue
					}
					break
				case $.typeAssert<number>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int")).ok:
					{
						let v: number = $.typeAssert<number>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int")).value
						count = count + (v)
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
		switch (true) {
			case $.typeAssert<$.VarRef<ObjectIdentifier> | null>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"), "main.ObjectIdentifier"))).ok:
				{
					let v: $.VarRef<ObjectIdentifier> | null = $.typeAssert<$.VarRef<ObjectIdentifier> | null>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"), "main.ObjectIdentifier"))).value
					let __goscriptTuple0: any = parseObjectIdentifier()
					v!.value = (__goscriptTuple0[0] as ObjectIdentifier)
					ok = __goscriptTuple0[1]
				}
				break
		}
	}
	await $.println("oid", $.len((oid.value as ObjectIdentifier)), $.arrayIndex(oid.value!, 0), ok)

	let raw: $.VarRef<RawValue> = $.varRef($.markAsStructValue(new RawValue()))
	let rawValue: any = $.interfaceValue(raw, "*main.RawValue", /* @__PURE__ */ $.pointerType("main.RawValue"))
	{
		const __goscriptTypeSwitchValue = rawValue
		switch (true) {
			case $.typeAssert<RawValue | $.VarRef<RawValue> | null>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.pointerType("main.RawValue")).ok:
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
}

export function getInterface(): any {
	return $.basicInterfaceValue(42, "int")
}

export function parseObjectIdentifier(): [ObjectIdentifier, boolean] {
	return [($.arrayToSlice<number>([1, 2, 3]) as ObjectIdentifier), true]
}

export function parseRawValue(): [RawValue, boolean] {
	return [$.markAsStructValue(new RawValue({Tag: 9})), true]
}

if ($.isMainScript(import.meta)) {
	await main()
}

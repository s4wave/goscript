// Generated file based on json_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"
import "@goscript/reflect/index.js"

export class Person {
	public declare Name: string

	public declare Age: number

	public declare Active: boolean

	public _fields: {
		Name: string
		Age: number
		Active: boolean
	}

	constructor(init?: Partial<{Name?: string, Age?: number, Active?: boolean}>) {
		this._fields = {
			Name: init?.Name ?? ("" as string),
			Age: init?.Age ?? (0 as number),
			Active: init?.Active ?? (false as boolean)
		}
	}

	public clone(): Person {
		return $.markAsStructValue(new Person(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Name", "Age", "Active"])
	}

	static __typeInfo = $.registerStructType(
		"main.Person",
		() => new Person(),
		() => [],
		Person,
		() => [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true, { tag: "json:\"name\"" }), /* @__PURE__ */ $.structField("Age", /* @__PURE__ */ $.basicType("int"), [1], 16, true, { tag: "json:\"age\"" }), /* @__PURE__ */ $.structField("Active", /* @__PURE__ */ $.basicType("bool"), [2], 24, true, { tag: "json:\"active\"" })]
	)
}

export async function main(): globalThis.Promise<void> {
	let p = $.markAsStructValue(new Person({Name: "Alice", Age: 30, Active: true}))
	let v = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.markAsStructValue($.cloneStructValue(p)), "main.Person", "main.Person"))))
	let t = $.markAsStructValue($.cloneStructValue(v)).Type()

	await $.println("Type:", await $.pointerValue<Exclude<reflect.Type, null>>(t).Name())
	await $.println("Kind:", reflect.Kind_String((await $.pointerValue<Exclude<reflect.Type, null>>(t).Kind())))
	await $.println("NumField:", await $.pointerValue<Exclude<reflect.Type, null>>(t).NumField())

	for (let i = 0; i < await $.pointerValue<Exclude<reflect.Type, null>>(t).NumField(); i++) {
		let sf = $.markAsStructValue($.cloneStructValue(await $.pointerValue<Exclude<reflect.Type, null>>(t).Field(i)))
		let fv = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Field(i)))

		await $.println("Field", i, ":", sf.Name)
		await $.println("  FieldValue Kind:", reflect.Kind_String($.markAsStructValue($.cloneStructValue(fv)).Kind()))
		await $.println("  FieldValue CanInterface:", $.markAsStructValue($.cloneStructValue(fv)).CanInterface())

		switch ($.markAsStructValue($.cloneStructValue(fv)).Kind()) {
			case reflect.String:
			{
				await $.println("  Value:", $.markAsStructValue($.cloneStructValue(fv)).String())
				break
			}
			case reflect.Int:
			case reflect.Int8:
			case reflect.Int16:
			case reflect.Int32:
			case reflect.Int64:
			{
				await $.println("  Value:", $.markAsStructValue($.cloneStructValue(fv)).Int())
				break
			}
			case reflect.Bool:
			{
				await $.println("  Value:", $.markAsStructValue($.cloneStructValue(fv)).Bool())
				break
			}
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on package_import_encoding_json.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"
import "@goscript/encoding/json/index.js"
import "@goscript/slices/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"

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
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string"), tag: "json:\"name\"" }, { name: "Age", key: "Age", type: /* @__PURE__ */ $.basicType("int"), tag: "json:\"age\"" }, { name: "Active", key: "Active", type: /* @__PURE__ */ $.basicType("bool"), tag: "json:\"active\"" }]
	)
}

export async function main(): globalThis.Promise<void> {
	let results: $.Slice<string> = null! as $.Slice<string>

	// Marshal a simple struct
	let p = $.markAsStructValue(new Person({Name: "Alice", Age: 30, Active: true}))
	let __goscriptTuple0: any = json.Marshal($.interfaceValue($.markAsStructValue($.cloneStructValue(p)), "main.Person", "main.Person"))
	let b: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		results = $.append(results, "Marshal error: " + await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	} else {
		results = $.append(results, "Marshal: " + $.bytesToString(b))
	}
	let __goscriptTuple1: any = json.MarshalIndent($.interfaceValue($.markAsStructValue($.cloneStructValue(p)), "main.Person", "main.Person"), "", "  ")
	let indented: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		results = $.append(results, "MarshalIndent error: " + await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	} else {
		results = $.append(results, "MarshalIndent: " + strings.ReplaceAll($.bytesToString(indented), "\n", "|"))
	}

	// Unmarshal into a struct
	let q: $.VarRef<Person> = $.varRef($.markAsStructValue(new Person()))
	{
		let __goscriptShadow0 = json.Unmarshal(new Uint8Array([123, 34, 110, 97, 109, 101, 34, 58, 34, 66, 111, 98, 34, 44, 34, 97, 103, 101, 34, 58, 50, 53, 44, 34, 97, 99, 116, 105, 118, 101, 34, 58, 102, 97, 108, 115, 101, 125]), $.interfaceValue(q, "*main.Person", /* @__PURE__ */ $.pointerType("main.Person")))
		if (__goscriptShadow0 != null) {
			results = $.append(results, "Unmarshal struct error: " + await $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0).Error())
		} else {
			results = $.append(results, (((("Unmarshal struct: Name=" + q.value.Name) + ", Age=") + strconv.Itoa(q.value.Age)) + ", Active=") + strconv.FormatBool(q.value.Active))
		}
	}

	// Unmarshal into a map[string]any
	let m: $.VarRef<globalThis.Map<string, any> | null> = $.varRef(null! as globalThis.Map<string, any> | null)
	{
		let __goscriptShadow1 = json.Unmarshal(new Uint8Array([123, 34, 110, 97, 109, 101, 34, 58, 34, 67, 97, 114, 111, 108, 34, 44, 34, 97, 103, 101, 34, 58, 50, 50, 44, 34, 97, 99, 116, 105, 118, 101, 34, 58, 116, 114, 117, 101, 125]), $.interfaceValue(m, "*map[string]any", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] }))))
		if (__goscriptShadow1 != null) {
			results = $.append(results, "Unmarshal map error: " + await $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow1).Error())
		} else {
			let name = $.mustTypeAssert<string>($.mapGet<string, any, any>(m.value, "name", null)[0], /* @__PURE__ */ $.basicType("string"))
			let age = $.int($.mustTypeAssert<number>($.mapGet<string, any, any>(m.value, "age", null)[0], /* @__PURE__ */ $.basicType("float64")))
			let active = $.mustTypeAssert<boolean>($.mapGet<string, any, any>(m.value, "active", null)[0], /* @__PURE__ */ $.basicType("bool"))
			results = $.append(results, (((("Unmarshal map: name=" + name) + ", age=") + strconv.Itoa(age)) + ", active=") + strconv.FormatBool(active))
		}
	}

	// Sort results for deterministic output
	slices.Sort(results)

	for (let __goscriptRangeTarget0 = results, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let r = __goscriptRangeTarget0![__rangeIndex]
		await $.println("JSON result:", r)
	}

	await $.println("encoding/json test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on json_marshal_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"
import "@goscript/encoding/json/index.js"

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
	let p = $.markAsStructValue(new Person({Name: "Alice", Age: 30, Active: true}))
	let __goscriptTuple0: any = json.Marshal($.interfaceValue($.markAsStructValue($.cloneStructValue(p)), "main.Person", "main.Person"))
	let b: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		await $.println("Marshal error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	} else {
		await $.println("Marshal:", $.bytesToString(b))
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

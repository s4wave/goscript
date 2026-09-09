// Generated file based on private_field_access.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public declare publicField: string

	public declare privateField: number

	public _fields: {
		publicField: string
		privateField: number
	}

	constructor(init?: Partial<{publicField?: string, privateField?: number}>) {
		this._fields = {
			publicField: init?.publicField ?? ("" as string),
			privateField: init?.privateField ?? (0 as number)
		}
	}

	public clone(): MyStruct {
		return $.markAsStructValue(new MyStruct(this))
	}

	static {
		$.bindStructFields(this.prototype, ["publicField", "privateField"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		() => [],
		MyStruct,
		() => [{ name: "publicField", key: "publicField", type: /* @__PURE__ */ $.basicType("string") }, { name: "privateField", key: "privateField", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function NewMyStruct(pub: string, priv: number): MyStruct {
	return $.markAsStructValue(new MyStruct({publicField: pub, privateField: priv}))
}

export async function accessPrivateField(s: MyStruct): globalThis.Promise<void> {
	// Accessing privateField directly from a function in the same package
	// This should trigger the generation of the _private field
	await $.println("Accessing privateField:", s.privateField)
}

export async function main(): globalThis.Promise<void> {
	let s = $.markAsStructValue($.cloneStructValue(NewMyStruct("hello", 123)))
	await accessPrivateField($.markAsStructValue($.cloneStructValue(s)))
}

if ($.isMainScript(import.meta)) {
	await main()
}

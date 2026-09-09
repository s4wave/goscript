// Generated file based on struct_private_field_ptr.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public declare myPrivate: $.VarRef<number> | null

	public _fields: {
		myPrivate: $.VarRef<number> | null
	}

	constructor(init?: Partial<{myPrivate?: $.VarRef<number> | null}>) {
		this._fields = {
			myPrivate: init?.myPrivate ?? (null! as $.VarRef<number> | null)
		}
	}

	public clone(): MyStruct {
		return $.markAsStructValue(new MyStruct(this))
	}

	static {
		$.bindStructFields(this.prototype, ["myPrivate"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		() => [],
		MyStruct,
		() => [{ name: "myPrivate", key: "myPrivate", type: /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")) }]
	)
}

export async function main(): globalThis.Promise<void> {
	let myStruct: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({myPrivate: null})
	let intVar: $.VarRef<number> = $.varRef(10)
	$.pointerValue<MyStruct>(myStruct).myPrivate = intVar
	intVar.value = 15
	await $.println($.pointerValue<number>($.pointerValue<MyStruct>(myStruct).myPrivate))
}

if ($.isMainScript(import.meta)) {
	await main()
}

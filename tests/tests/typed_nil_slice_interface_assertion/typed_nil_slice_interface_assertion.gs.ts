// Generated file based on typed_nil_slice_interface_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public get value(): string {
		return this._fields.value.value
	}
	public set value(value: string) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<string>
	}

	constructor(init?: Partial<{value?: string}>) {
		this._fields = {
			value: $.varRef(init?.value ?? ("" as string))
		}
	}

	public clone(): item {
		const cloned = new item()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		[],
		item,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let boxed: any = $.interfaceValue<any>(null, "[]*main.item")
	let asserted: $.Slice<item | $.VarRef<item> | null> = $.mustTypeAssert<$.Slice<item | $.VarRef<item> | null>>(boxed, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "main.item" } })
	$.println(asserted == null)

	let __goscriptTuple0: any = $.typeAssertTuple<$.Slice<item | $.VarRef<item> | null>>(boxed, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "main.item" } })
	let commaOK: $.Slice<item | $.VarRef<item> | null> = __goscriptTuple0[0]
	let ok = __goscriptTuple0[1]
	$.println(ok, commaOK == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}

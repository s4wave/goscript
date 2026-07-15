// Generated file based on generic_interface_embedded_method_calls.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type base = {
	Value(__typeArgs: $.GenericTypeArgs | undefined): any | globalThis.Promise<any>
}

$.registerInterfaceType(
	"main.base",
	null,
	[{ name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export type derived = {
	Other(__typeArgs: $.GenericTypeArgs | undefined): any
	Value(__typeArgs: $.GenericTypeArgs | undefined): any | globalThis.Promise<any>
}

$.registerInterfaceType(
	"main.derived",
	null,
	[{ name: "Other", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export class impl {
	public get value(): any {
		return this._fields.value.value
	}
	public set value(value: any) {
		this._fields.value.value = value
	}

	public get other(): any {
		return this._fields.other.value
	}
	public set other(value: any) {
		this._fields.other.value = value
	}

	public _fields: {
		value: $.VarRef<any>
		other: $.VarRef<any>
	}

	constructor(init?: Partial<{value?: any, other?: any}>) {
		this._fields = {
			value: $.varRef(init?.value ?? (null as any)),
			other: $.varRef(init?.other ?? (null as any))
		}
	}

	public clone(): impl {
		const cloned = new impl()
		cloned._fields = {
			value: $.varRef(this._fields.value.value),
			other: $.varRef(this._fields.other.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Other(__typeArgs: $.GenericTypeArgs | undefined): any {
		const i: impl | $.VarRef<impl> | null = this
		return $.pointerValue<impl>(i).other
	}

	public Value(__typeArgs: $.GenericTypeArgs | undefined): any {
		const i: impl | $.VarRef<impl> | null = this
		return $.pointerValue<impl>(i).value
	}

	static __typeInfo = $.registerStructType(
		"main.impl",
		() => new impl(),
		[{ name: "Other", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		impl,
		[{ name: "value", key: "value", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "other", key: "other", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export async function read(__typeArgs: $.GenericTypeArgs | undefined, d: derived | null): globalThis.Promise<any> {
	return (await $.pointerValue<Exclude<derived, null>>(d).Value({T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}) as any)
}

export async function main(): globalThis.Promise<void> {
	let i: impl | $.VarRef<impl> | null = new impl({value: 7, other: "ok"})
	$.println(await read({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }, E: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, $.interfaceValue<derived | null>(i, "*main.impl", { kind: $.TypeKind.Pointer, elemType: "main.impl" })))
}

if ($.isMainScript(import.meta)) {
	await main()
}

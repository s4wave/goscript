// Generated file based on generic_cross_package_receiver_args.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/generic_cross_package_receiver_args/dep/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/generic_cross_package_receiver_args/dep/index.js"

export type Derived = {
	Other(__typeArgs: $.GenericTypeArgs | undefined): any
	Value(__typeArgs: $.GenericTypeArgs | undefined): any | globalThis.Promise<any>
}

$.registerInterfaceType(
	"main.Derived",
	null,
	[{ name: "Other", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export class wrapper {
	public get Impl(): dep.Impl | $.VarRef<dep.Impl> | null {
		return this._fields.Impl.value
	}
	public set Impl(value: dep.Impl | $.VarRef<dep.Impl> | null) {
		this._fields.Impl.value = value
	}

	public _fields: {
		Impl: $.VarRef<dep.Impl | $.VarRef<dep.Impl> | null>
	}

	constructor(init?: Partial<{Impl?: dep.Impl | $.VarRef<dep.Impl> | null}>) {
		this._fields = {
			Impl: $.varRef(init?.Impl ?? (null as dep.Impl | $.VarRef<dep.Impl> | null))
		}
	}

	public clone(): wrapper {
		const cloned = new wrapper()
		cloned._fields = {
			Impl: $.varRef(this._fields.Impl.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Other(__typeArgs: $.GenericTypeArgs | undefined): any {
		const w: wrapper | $.VarRef<wrapper> | null = this
		let zero: any = $.genericZero(__typeArgs, "E", null)
		return zero
	}

	public Value(__typeArgs: $.GenericTypeArgs | undefined): any {
		return $.pointerValue<dep.Impl>(this.Impl).Value({T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
	}

	static __typeInfo = $.registerStructType(
		"main.wrapper",
		() => new wrapper(),
		[{ name: "Other", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		wrapper,
		[{ name: "Impl", key: "Impl", type: { kind: $.TypeKind.Pointer, elemType: "dep.Impl" }, anonymous: true }]
	)
}

export async function read(__typeArgs: $.GenericTypeArgs | undefined, d: Derived | null): globalThis.Promise<any> {
	return (await $.pointerValue<Exclude<Derived, null>>(d).Value({T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}) as any)
}

export function setGeneric(__typeArgs: $.GenericTypeArgs | undefined, w: dep.Wrapper | $.VarRef<dep.Wrapper> | null, value: any): any {
	return (dep.Keyed.prototype.SetValues.call($.pointerValue<dep.Wrapper>(w).Keyed, {T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }, U: __typeArgs?.["U"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, value) as any)
}

export function setConcrete(w: dep.Wrapper | $.VarRef<dep.Wrapper> | null): string {
	return (dep.Keyed.prototype.SetValues.call($.pointerValue<dep.Wrapper>(w).Keyed, {T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }, U: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, 7) as string)
}

export async function main(): globalThis.Promise<void> {
	let impl: wrapper | $.VarRef<wrapper> | null = new wrapper({Impl: new dep.Impl({Item: 7})})
	$.println("interface:", await read({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }, E: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, $.interfaceValue<Derived | null>(impl, "*main.wrapper", { kind: $.TypeKind.Pointer, elemType: "main.wrapper" })))
	let keyed: dep.Wrapper | $.VarRef<dep.Wrapper> | null = new dep.Wrapper({Keyed: new dep.Keyed()})
	$.println("generic empty:", $.stringEqual(setGeneric({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }, U: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, keyed, 7), ""))
	$.println("concrete empty:", $.stringEqual(setConcrete(keyed), ""))
}

if ($.isMainScript(import.meta)) {
	await main()
}

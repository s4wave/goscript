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
			Impl: $.varRef(init?.Impl ?? (null! as dep.Impl | $.VarRef<dep.Impl> | null))
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
		return $.pointerValue<dep.Impl>(this.Impl).Value({[$.genericTypeArgsMarker]: true, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
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
	return (await $.callInterfaceMethod($.pointerValue<Exclude<Derived, null>>(d), "Value", {[$.genericTypeArgsMarker]: true, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}) as any)
}

export function setGeneric(__typeArgs: $.GenericTypeArgs | undefined, w: dep.Wrapper | $.VarRef<dep.Wrapper> | null, value: any): any {
	return (dep.Keyed.prototype.SetValues.call($.pointerValue<dep.Wrapper>(w).Keyed, {[$.genericTypeArgsMarker]: true, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }, U: __typeArgs?.["U"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, value) as any)
}

export function setConcrete(w: dep.Wrapper | $.VarRef<dep.Wrapper> | null): string {
	return (dep.Keyed.prototype.SetValues.call($.pointerValue<dep.Wrapper>(w).Keyed, {[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }, U: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, 7) as string)
}

export async function main(): globalThis.Promise<void> {
	let impl: wrapper | $.VarRef<wrapper> | null = new wrapper({Impl: new dep.Impl({Item: 7})})
	$.println("interface:", await read({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }, E: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, $.namedValueInterfaceValue<Derived | null>(impl, "*main.wrapper", {Other: (receiver: any, ...args: any[]) => receiver.Other({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }, E: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, ...$.stripGenericTypeArgs(args)), Value: (receiver: any, ...args: any[]) => receiver.Value({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Pointer, elemType: "main.wrapper" }, [{ name: "Other", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])))
	let keyed: dep.Wrapper | $.VarRef<dep.Wrapper> | null = new dep.Wrapper({Keyed: new dep.Keyed()})
	$.println("generic empty:", $.stringEqual(setGeneric({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }, U: { type: { kind: $.TypeKind.Basic, name: "string" }, zero: () => "" }}, keyed, 7), ""))
	$.println("concrete empty:", $.stringEqual(setConcrete(keyed), ""))
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Provider = {
	Value(__typeArgs: $.GenericTypeArgs | undefined): any | globalThis.Promise<any>
}

$.registerInterfaceType(
	"dep.Provider",
	null,
	[{ name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export class Impl {
	public get Item(): any {
		return this._fields.Item.value
	}
	public set Item(value: any) {
		this._fields.Item.value = value
	}

	public _fields: {
		Item: $.VarRef<any>
	}

	constructor(init?: Partial<{Item?: any}>) {
		this._fields = {
			Item: $.varRef(init?.Item ?? (null as any))
		}
	}

	public clone(): Impl {
		const cloned = new Impl()
		cloned._fields = {
			Item: $.varRef(this._fields.Item.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Value(__typeArgs: $.GenericTypeArgs | undefined): any {
		const i: Impl | $.VarRef<Impl> | null = this
		return $.pointerValue<Impl>(i).Item
	}

	static __typeInfo = $.registerStructType(
		"dep.Impl",
		() => new Impl(),
		[{ name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		Impl,
		[{ name: "Item", key: "Item", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class Keyed {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Keyed {
		const cloned = new Keyed()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public SetValues(__typeArgs: $.GenericTypeArgs | undefined, value: any): any {
		const k: Keyed | $.VarRef<Keyed> | null = this
		let zero: any = $.genericZero(__typeArgs, "U", null)
		return zero
	}

	static __typeInfo = $.registerStructType(
		"dep.Keyed",
		() => new Keyed(),
		[{ name: "SetValues", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		Keyed,
		[]
	)
}

export class Wrapper {
	public get Keyed(): Keyed | $.VarRef<Keyed> | null {
		return this._fields.Keyed.value
	}
	public set Keyed(value: Keyed | $.VarRef<Keyed> | null) {
		this._fields.Keyed.value = value
	}

	public _fields: {
		Keyed: $.VarRef<Keyed | $.VarRef<Keyed> | null>
	}

	constructor(init?: Partial<{Keyed?: Keyed | $.VarRef<Keyed> | null}>) {
		this._fields = {
			Keyed: $.varRef(init?.Keyed ?? (null as Keyed | $.VarRef<Keyed> | null))
		}
	}

	public clone(): Wrapper {
		const cloned = new Wrapper()
		cloned._fields = {
			Keyed: $.varRef(this._fields.Keyed.value)
		}
		return $.markAsStructValue(cloned)
	}

	public SetValues(__typeArgs: $.GenericTypeArgs | undefined, value: any): any {
		return $.pointerValue<Keyed>(this.Keyed).SetValues({T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }, U: __typeArgs?.["U"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, value)
	}

	static __typeInfo = $.registerStructType(
		"dep.Wrapper",
		() => new Wrapper(),
		[{ name: "SetValues", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		Wrapper,
		[{ name: "Keyed", key: "Keyed", type: { kind: $.TypeKind.Pointer, elemType: "dep.Keyed" }, anonymous: true }]
	)
}

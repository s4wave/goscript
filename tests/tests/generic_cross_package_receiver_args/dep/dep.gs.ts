// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Provider = {
	Value(__typeArgs: $.GenericTypeArgs | undefined): any
}

$.registerInterfaceType(
	"dep.Provider",
	null,
	[{ name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export class Impl {
	public declare Item: any

	public _fields: {
		Item: any
	}

	constructor(init?: Partial<{Item?: any}>) {
		this._fields = {
			Item: init?.Item ?? (null! as any)
		}
	}

	public clone(): Impl {
		return $.markAsStructValue(new Impl(this))
	}

	public Value(__typeArgs: $.GenericTypeArgs | undefined): any {
		const i: Impl | $.VarRef<Impl> | null = this;
		return $.pointerValue<Impl>(i).Item
	}

	static {
		$.bindStructFields(this.prototype, ["Item"])
	}

	static __typeInfo = $.registerStructType(
		"dep.Impl",
		() => new Impl(),
		() => [{ name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		Impl,
		() => [{ name: "Item", key: "Item", type: { kind: $.TypeKind.Interface, methods: [] } }]
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
		return $.markAsStructValue(new Keyed(this))
	}

	public SetValues(__typeArgs: $.GenericTypeArgs | undefined, value: any): any {
		const k: Keyed | $.VarRef<Keyed> | null = this;
		let zero: any = $.genericZero(__typeArgs, "U", null)
		return zero
	}

	static __typeInfo = $.registerStructType(
		"dep.Keyed",
		() => new Keyed(),
		() => [{ name: "SetValues", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		Keyed,
		() => []
	)
}

export class Wrapper {
	public declare Keyed: Keyed | $.VarRef<Keyed> | null

	public _fields: {
		Keyed: Keyed | $.VarRef<Keyed> | null
	}

	constructor(init?: Partial<{Keyed?: Keyed | $.VarRef<Keyed> | null}>) {
		this._fields = {
			Keyed: init?.Keyed ?? (null! as Keyed | $.VarRef<Keyed> | null)
		}
	}

	public clone(): Wrapper {
		return $.markAsStructValue(new Wrapper(this))
	}

	public SetValues(__typeArgs: $.GenericTypeArgs | undefined, value: any): any {
		return $.pointerValue<Keyed>(this.Keyed).SetValues({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }, U: __typeArgs?.["U"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, value)
	}

	static {
		$.bindStructFields(this.prototype, ["Keyed"])
	}

	static __typeInfo = $.registerStructType(
		"dep.Wrapper",
		() => new Wrapper(),
		() => [{ name: "SetValues", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		Wrapper,
		() => [{ name: "Keyed", key: "Keyed", type: /* @__PURE__ */ $.pointerType("dep.Keyed"), anonymous: true }]
	)
}

// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

$.registerTypePackagePath("github.com/s4wave/goscript/tests/tests/generic_cross_package_receiver_args/dep", ["dep.Provider", "dep.Impl", "dep.Keyed", "dep.Wrapper"])

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

	constructor(__goscriptValue?: boolean, Item$?: any) {
		this.Item = Item$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Impl {
		return $.copyGenericInstance(this, new Impl(true, $.copyElement(this.Item)))
	}

	public __goscriptAssign(source: Impl): this {
		this.Item = $.assignFieldValue(this.Item, source.Item)
		return this
	}

	public Value(__typeArgs: $.GenericTypeArgs | undefined): any {
		const i: Impl | $.VarRef<Impl> | null = this;
		return $.copyElement($.pointerValue<Impl>(i).Item)
	}

	static __typeInfo = $.registerStructType(
		"dep.Impl",
		() => new Impl(),
		() => [{ name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }], pointerReceiver: true }],
		Impl,
		() => [{ name: "Item", key: "Item", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class Keyed {
	constructor(__goscriptValue?: boolean) {
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Keyed {
		return $.copyGenericInstance(this, new Keyed(true))
	}

	public __goscriptAssign(source: Keyed): this {
		return this
	}

	public SetValues(__typeArgs: $.GenericTypeArgs | undefined, value: any): any {
		const k: Keyed | $.VarRef<Keyed> | null = this;
		let zero: any = $.genericZero(__typeArgs, "U", null)
		return $.copyElement(zero)
	}

	static __typeInfo = $.registerStructType(
		"dep.Keyed",
		() => new Keyed(),
		() => [{ name: "SetValues", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }], pointerReceiver: true }],
		Keyed,
		() => []
	)
}

export class Wrapper {
	public declare Keyed: Keyed | $.VarRef<Keyed> | null

	constructor(__goscriptValue?: boolean, Keyed$?: Keyed | $.VarRef<Keyed> | null) {
		this.Keyed = Keyed$ ?? (null! as Keyed | $.VarRef<Keyed> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Wrapper {
		return $.copyGenericInstance(this, new Wrapper(true, this.Keyed))
	}

	public __goscriptAssign(source: Wrapper): this {
		this.Keyed = source.Keyed
		return this
	}

	public SetValues(__typeArgs: $.GenericTypeArgs | undefined, value: any): any {
		return $.pointerValue<Keyed>(this.Keyed).SetValues({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }, U: __typeArgs?.["U"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, value)
	}

	static __typeInfo = $.registerStructType(
		"dep.Wrapper",
		() => new Wrapper(),
		() => [{ name: "SetValues", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		Wrapper,
		() => [{ name: "Keyed", key: "Keyed", type: /* @__PURE__ */ $.pointerType("dep.Keyed"), anonymous: true }]
	)
}

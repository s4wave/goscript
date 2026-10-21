// Generated file based on generic_cross_package_receiver_args.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/generic_cross_package_receiver_args/dep/index.js"

export type Derived = {
	Other(__typeArgs: $.GenericTypeArgs | undefined): any
	Value(__typeArgs: $.GenericTypeArgs | undefined): any
}

$.registerInterfaceType(
	"main.Derived",
	null,
	[{ name: "Other", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export class wrapper {
	public declare Impl: dep.Impl | $.VarRef<dep.Impl> | null

	constructor(__goscriptValue?: boolean, Impl$?: dep.Impl | $.VarRef<dep.Impl> | null) {
		this.Impl = Impl$ ?? (null! as dep.Impl | $.VarRef<dep.Impl> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): wrapper {
		return $.copyGenericInstance(this, new wrapper(true, this.Impl))
	}

	public __goscriptAssign(source: wrapper): this {
		this.Impl = source.Impl
		return this
	}

	public Other(__typeArgs: $.GenericTypeArgs | undefined): any {
		const w: wrapper | $.VarRef<wrapper> | null = this;
		let zero: any = $.genericZero(__typeArgs, "E", null)
		return $.copyElement(zero)
	}

	public Value(__typeArgs: $.GenericTypeArgs | undefined): any {
		return $.pointerValue<dep.Impl>(this.Impl).Value({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
	}

	static __typeInfo = $.registerStructType(
		"main.wrapper",
		() => new wrapper(),
		() => [{ name: "Other", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }], pointerReceiver: true }, { name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		wrapper,
		() => [{ name: "Impl", key: "Impl", type: /* @__PURE__ */ $.pointerType("dep.Impl"), anonymous: true }]
	)
}

export async function read(__typeArgs: $.GenericTypeArgs | undefined, d: Derived | null): globalThis.Promise<any> {
	return $.callInterfaceMethod((d !== null && (d as any).__isVarRef !== true && ((d as any).__goValue === undefined || (d as any).__goType?.charCodeAt(0) !== 42) ? (d as Exclude<Derived, null>) : $.pointerValue<Exclude<Derived, null>>(d)), "Value", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
}

export function setGeneric(__typeArgs: $.GenericTypeArgs | undefined, w: dep.Wrapper | $.VarRef<dep.Wrapper> | null, value: any): any {
	return (dep.Keyed.prototype.SetValues.call($.pointerValue<dep.Wrapper>(w).Keyed, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }, U: __typeArgs?.["U"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, $.copyElement(value)) as any)
}

export function setConcrete(w: dep.Wrapper | $.VarRef<dep.Wrapper> | null): string {
	return (dep.Keyed.prototype.SetValues.call($.pointerValue<dep.Wrapper>(w).Keyed, __goscriptStatic0(), 7) as string)
}

export async function main(): globalThis.Promise<void> {
	let impl = $.genericInstance(new wrapper(false, $.genericInstance(new dep.Impl(false, 7), __goscriptStatic2)), __goscriptStatic4)
	await $.println("interface:", await read(__goscriptStatic3(), $.namedValueInterfaceValue<Derived | null>(impl, "*main.wrapper", __goscriptStatic5(), __goscriptStatic6(), __goscriptStatic7())))
	let keyed = $.genericInstance(new dep.Wrapper(false, $.genericInstance(new dep.Keyed(), __goscriptStatic8)), __goscriptStatic9)
	await $.println("generic empty:", $.stringEqual(setGeneric(__goscriptStatic0(), keyed, 7), ""))
	await $.println("concrete empty:", $.stringEqual(setConcrete(keyed), ""))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }, U: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ([{Value: (receiver: any) => $.pointerValue(receiver).Value(__goscriptStatic1())}, [$.methodSignature("Value", [], [/* @__PURE__ */ $.basicType("int")], true, false)]])
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }, E: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }})
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ([{Other: (receiver: any) => $.pointerValue(receiver).Other(__goscriptStatic3()), Value: (receiver: any) => $.pointerValue(receiver).Value(__goscriptStatic3())}, [$.methodSignature("Other", [], [/* @__PURE__ */ $.basicType("string")], true, false), $.methodSignature("Value", [], [/* @__PURE__ */ $.basicType("int")], false, false)]])
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ({Other: (receiver: any) => $.pointerValue(receiver).Other(__goscriptStatic3()), Value: (receiver: any) => $.pointerValue(receiver).Value(__goscriptStatic3())})
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= (/* @__PURE__ */ $.pointerType("main.wrapper"))
}

var __goscriptStatic7$value: any
function __goscriptStatic7(): any {
	return __goscriptStatic7$value ??= ([$.methodSignature("Other", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Value", [], [/* @__PURE__ */ $.basicType("int")])])
}

var __goscriptStatic8$value: any
function __goscriptStatic8(): any {
	return __goscriptStatic8$value ??= ([{SetValues: (receiver: any, ...args: any[]) => $.pointerValue(receiver).SetValues(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("SetValues", [/* @__PURE__ */ $.basicType("int")], [/* @__PURE__ */ $.basicType("string")], true, false)]])
}

var __goscriptStatic9$value: any
function __goscriptStatic9(): any {
	return __goscriptStatic9$value ??= ([{SetValues: (receiver: any, ...args: any[]) => $.pointerValue(receiver).SetValues(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("SetValues", [/* @__PURE__ */ $.basicType("int")], [/* @__PURE__ */ $.basicType("string")], false, false)]])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

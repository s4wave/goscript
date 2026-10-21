// Generated file based on generic_receiver_method_calls.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type reader = {
	Value(__typeArgs: $.GenericTypeArgs | undefined): any
}

$.registerInterfaceType(
	"main.reader",
	null,
	[{ name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export class box {
	public declare value: any

	constructor(__goscriptValue?: boolean, value$?: any) {
		this.value = value$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): box {
		return $.copyGenericInstance(this, new box(true, $.copyElement(this.value)))
	}

	public __goscriptAssign(source: box): this {
		this.value = $.assignFieldValue(this.value, source.value)
		return this
	}

	public Value(__typeArgs: $.GenericTypeArgs | undefined): any {
		const b: box | $.VarRef<box> | null = this;
		return $.copyElement($.pointerValue<box>(b).value)
	}

	static __typeInfo = $.registerStructType(
		"main.box",
		() => new box(),
		() => [{ name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }], pointerReceiver: true }],
		box,
		() => [{ name: "value", key: "value", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class holder {
	public declare box: box

	constructor(__goscriptValue?: boolean, box$?: box) {
		this.box = box$ ?? $.genericInstance(new box(true, null), () => [{Value: (receiver: any) => $.pointerValue(receiver).Value({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})}, [$.methodSignature("Value", [], [{ kind: $.TypeKind.Interface, methods: [] }], true, false)]])
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): holder {
		return $.copyGenericInstance(this, new holder(true, this.box.clone()))
	}

	public __goscriptAssign(source: holder): this {
		this.box.__goscriptAssign(source.box)
		return this
	}

	public Value(__typeArgs: $.GenericTypeArgs | undefined): any {
		return $.pointerValue<box>(this.box).Value({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		() => [{ name: "Value", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }], pointerReceiver: true }],
		holder,
		() => [{ name: "box", key: "box", type: "main.box", anonymous: true }]
	)
}

export function direct(__typeArgs: $.GenericTypeArgs | undefined, b: box | $.VarRef<box> | null): any {
	return (box.prototype.Value.call(b, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}) as any)
}

export async function throughInterface(__typeArgs: $.GenericTypeArgs | undefined, r: reader | null): globalThis.Promise<any> {
	return $.callInterfaceMethod((r !== null && (r as any).__isVarRef !== true && ((r as any).__goValue === undefined || (r as any).__goType?.charCodeAt(0) !== 42) ? (r as Exclude<reader, null>) : $.pointerValue<Exclude<reader, null>>(r)), "Value", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
}

export function promoted(__typeArgs: $.GenericTypeArgs | undefined, h: holder | $.VarRef<holder> | null): any {
	return ($.pointerValue<holder>(h).box.Value({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}) as any)
}

export function methodExpression(__typeArgs: $.GenericTypeArgs | undefined, b: box | $.VarRef<box> | null): any {
	let value: ((_p0: box | $.VarRef<box> | null) => any | globalThis.Promise<any>) | null = $.functionValue((b: box | $.VarRef<box> | null): any => $.pointerValue<box>(b).Value({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.box")], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))
	return (value!(b) as any)
}

export async function main(): globalThis.Promise<void> {
	let b = $.genericInstance(new box(false, 7), __goscriptStatic1)
	await $.println("direct:", direct(__goscriptStatic0(), b))
	await $.println("interface:", await throughInterface(__goscriptStatic0(), $.namedValueInterfaceValue<reader | null>(b, "*main.box", __goscriptStatic2(), __goscriptStatic3(), __goscriptStatic4())))
	await $.println("promoted:", promoted(__goscriptStatic0(), $.genericInstance(new holder(false, ($.pointerValue<box>(b)).clone()), __goscriptStatic1)))
	await $.println("expression:", methodExpression(__goscriptStatic0(), b))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{Value: (receiver: any) => $.pointerValue(receiver).Value(__goscriptStatic0())}, [$.methodSignature("Value", [], [/* @__PURE__ */ $.basicType("int")], true, false)]])
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({Value: (receiver: any) => $.pointerValue(receiver).Value(__goscriptStatic0())})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= (/* @__PURE__ */ $.pointerType("main.box"))
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ([$.methodSignature("Value", [], [/* @__PURE__ */ $.basicType("int")])])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

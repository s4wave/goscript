// Generated file based on generic_interface_context_parent.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as context from "@goscript/context/index.js"

export type Resolver = {
	Resolve(ctx: context.Context | null, handler: Handler | null): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"main.Resolver",
	null,
	[{ name: "Resolve", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }]
);

export type Handler = {
	Mark(): void
}

$.registerInterfaceType(
	"main.Handler",
	null,
	[{ name: "Mark", args: [], returns: [] }]
);

export type ValueReader = {
	Get(): number
}

$.registerInterfaceType(
	"main.ValueReader",
	null,
	[{ name: "Get", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export class handler {
	constructor(__goscriptValue?: boolean) {
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): handler {
		return new handler(true)
	}

	public __goscriptAssign(source: handler): this {
		return this
	}

	public Mark(): void {
	}

	static __typeInfo = $.registerStructType(
		"main.handler",
		() => new handler(),
		() => [{ name: "Mark", args: [], returns: [] }],
		handler,
		() => []
	)
}

export class genericResolver {
	constructor(__goscriptValue?: boolean) {
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): genericResolver {
		return $.copyGenericInstance(this, new genericResolver(true))
	}

	public __goscriptAssign(source: genericResolver): this {
		return this
	}

	public async Resolve(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, handler: Handler | null): globalThis.Promise<$.GoError> {
		let [child, cancel] = context.WithCancel($.pointerValueOrNil(ctx)!)
		cancel!()
		await $.chanRecv(((__goscriptAwait = (child !== null && (child as any).__isVarRef !== true && ((child as any).__goValue === undefined || (child as any).__goType?.charCodeAt(0) !== 42) ? (child as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(child)).Done(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Channel<{}> | null))
		void (__goscriptAwait = (handler !== null && (handler as any).__isVarRef !== true && ((handler as any).__goValue === undefined || (handler as any).__goType?.charCodeAt(0) !== 42) ? (handler as Exclude<Handler, null>) : $.pointerValue<Exclude<Handler, null>>(handler)).Mark(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.genericResolver",
		() => new genericResolver(),
		() => [{ name: "Resolve", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }], pointerReceiver: true }],
		genericResolver,
		() => []
	)
}

export class genericValue {
	public declare value: number

	constructor(__goscriptValue?: boolean, value$?: number) {
		this.value = value$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): genericValue {
		return $.copyGenericInstance(this, new genericValue(true, this.value))
	}

	public __goscriptAssign(source: genericValue): this {
		this.value = source.value
		return this
	}

	public Get(__typeArgs: $.GenericTypeArgs | undefined): number {
		const v = this;
		return v.value
	}

	static __typeInfo = $.registerStructType(
		"main.genericValue",
		() => new genericValue(),
		() => [{ name: "Get", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		genericValue,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let resolver: Resolver | null = $.namedValueInterfaceValue<Resolver | null>($.genericInstance(new genericResolver(), __goscriptStatic1), "*main.genericResolver", __goscriptStatic2(), __goscriptStatic3(), __goscriptStatic4())
	{
		let err = (__goscriptAwait = (resolver !== null && (resolver as any).__isVarRef !== true && ((resolver as any).__goValue === undefined || (resolver as any).__goType?.charCodeAt(0) !== 42) ? (resolver as Exclude<Resolver, null>) : $.pointerValue<Exclude<Resolver, null>>(resolver)).Resolve(context.Background(), $.structInterfaceValue<Handler | null>(new handler(true), "main.handler", "main.handler")), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		if (err != null) {
			await $.println("resolve failed")
			return
		}
	}
	await $.println("resolve ok")
	let g = $.genericInstance(new genericValue(true, 7), __goscriptStatic5)
	let reader: ValueReader | null = $.namedValueInterfaceValue<ValueReader | null>((g).clone(), "main.genericValue", __goscriptStatic6(), __goscriptStatic7(), __goscriptStatic8())
	g.value = 9
	if ((__goscriptAwait = (reader !== null && (reader as any).__isVarRef !== true && ((reader as any).__goValue === undefined || (reader as any).__goType?.charCodeAt(0) !== 42) ? (reader as Exclude<ValueReader, null>) : $.pointerValue<Exclude<ValueReader, null>>(reader)).Get(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) != 7) {
		await $.println("value copy failed")
		return
	}
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{Resolve: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Resolve(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("Resolve", ["context.Context", "main.Handler"], ["error"], true, false)]])
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({Resolve: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Resolve(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= (/* @__PURE__ */ $.pointerType("main.genericResolver"))
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ([$.methodSignature("Resolve", [["ctx", "context.Context"], ["handler", "main.Handler"]], ["error"])])
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ([{Get: (receiver: any) => $.pointerValue(receiver).Get(__goscriptStatic0())}, [$.methodSignature("Get", [], [/* @__PURE__ */ $.basicType("int")], false, false)]])
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ({Get: (receiver: any) => $.pointerValue(receiver).Get(__goscriptStatic0())})
}

var __goscriptStatic7$value: any
function __goscriptStatic7(): any {
	return __goscriptStatic7$value ??= ("main.genericValue")
}

var __goscriptStatic8$value: any
function __goscriptStatic8(): any {
	return __goscriptStatic8$value ??= ([$.methodSignature("Get", [], [/* @__PURE__ */ $.basicType("int")])])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

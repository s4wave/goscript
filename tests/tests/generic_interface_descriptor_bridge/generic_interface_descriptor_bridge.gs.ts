// Generated file based on generic_interface_descriptor_bridge.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as context from "@goscript/context/index.js"

export type GenericWaiter = {
	Count(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, values: $.Slice<any>): number | globalThis.Promise<number>
	Wait(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, old: any): any | globalThis.Promise<any>
}

$.registerInterfaceType(
	"main.GenericWaiter",
	null,
	[{ name: "Count", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], variadic: true }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export type IntWaiter = {
	Count(ctx: context.Context | null, values: $.Slice<number>): number | globalThis.Promise<number>
	Wait(ctx: context.Context | null, old: number): number | globalThis.Promise<number>
}

$.registerInterfaceType(
	"main.IntWaiter",
	null,
	[{ name: "Count", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], variadic: true }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export class genericBox {
	constructor(__goscriptValue?: boolean) {
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): genericBox {
		return $.copyGenericInstance(this, new genericBox(true))
	}

	public __goscriptAssign(source: genericBox): this {
		return this
	}

	public async Count(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, values: $.Slice<any>): globalThis.Promise<number> {
		await $.chanRecv(((__goscriptAwait = (ctx !== null && (ctx as any).__isVarRef !== true && ((ctx as any).__goValue === undefined || (ctx as any).__goType?.charCodeAt(0) !== 42) ? (ctx as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(ctx)).Done(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Channel<{}> | null))
		return $.sliceLen(values)
	}

	public async Wait(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, old: any): globalThis.Promise<any> {
		await $.chanRecv(((__goscriptAwait = (ctx !== null && (ctx as any).__isVarRef !== true && ((ctx as any).__goValue === undefined || (ctx as any).__goType?.charCodeAt(0) !== 42) ? (ctx as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(ctx)).Done(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Channel<{}> | null))
		return $.copyElement(old)
	}

	static __typeInfo = $.registerStructType(
		"main.genericBox",
		() => new genericBox(),
		() => [{ name: "Count", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true, variadic: true }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }], pointerReceiver: true }],
		genericBox,
		() => []
	)
}

export class intBox {
	public declare id: number

	constructor(__goscriptValue?: boolean, id$?: number) {
		this.id = id$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): intBox {
		return new intBox(true, this.id)
	}

	public __goscriptAssign(source: intBox): this {
		this.id = source.id
		return this
	}

	public async Count(ctx: context.Context | null, values: $.Slice<number>): globalThis.Promise<number> {
		await $.chanRecv(((__goscriptAwait = (ctx !== null && (ctx as any).__isVarRef !== true && ((ctx as any).__goValue === undefined || (ctx as any).__goType?.charCodeAt(0) !== 42) ? (ctx as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(ctx)).Done(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Channel<{}> | null))
		return $.sliceLen(values)
	}

	public async Wait(ctx: context.Context | null, old: number): globalThis.Promise<number> {
		await $.chanRecv(((__goscriptAwait = (ctx !== null && (ctx as any).__isVarRef !== true && ((ctx as any).__goValue === undefined || (ctx as any).__goType?.charCodeAt(0) !== 42) ? (ctx as Exclude<context.Context, null>) : $.pointerValue<Exclude<context.Context, null>>(ctx)).Done(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as $.Channel<{}> | null))
		return old
	}

	static __typeInfo = $.registerStructType(
		"main.intBox",
		() => new intBox(),
		() => [{ name: "Count", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true, variadic: true }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		intBox,
		() => [{ name: "id", key: "id", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let [ctx, cancel] = context.WithCancel($.pointerValueOrNil(context.Background())!)
	cancel!()

	let genericGeneric: GenericWaiter | null = $.namedValueInterfaceValue<GenericWaiter | null>($.genericInstance(new genericBox(), __goscriptStatic1), "*main.genericBox", __goscriptStatic2(), __goscriptStatic3(), __goscriptStatic4())
	await $.println("generic-generic", (__goscriptAwait = $.callInterfaceMethod((genericGeneric !== null && (genericGeneric as any).__isVarRef !== true && ((genericGeneric as any).__goValue === undefined || (genericGeneric as any).__goType?.charCodeAt(0) !== 42) ? (genericGeneric as Exclude<GenericWaiter, null>) : $.pointerValue<Exclude<GenericWaiter, null>>(genericGeneric)), "Wait", __goscriptStatic0(), ctx, 7), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.callInterfaceMethod((genericGeneric !== null && (genericGeneric as any).__isVarRef !== true && ((genericGeneric as any).__goValue === undefined || (genericGeneric as any).__goType?.charCodeAt(0) !== 42) ? (genericGeneric as Exclude<GenericWaiter, null>) : $.pointerValue<Exclude<GenericWaiter, null>>(genericGeneric)), "Count", __goscriptStatic0(), ctx, $.arrayToSlice<number>([1, 2])), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	let genericPlain: IntWaiter | null = $.namedValueInterfaceValue<IntWaiter | null>($.genericInstance(new genericBox(), __goscriptStatic1), "*main.genericBox", __goscriptStatic2(), __goscriptStatic3(), __goscriptStatic4())
	await $.println("generic-plain", (__goscriptAwait = (genericPlain !== null && (genericPlain as any).__isVarRef !== true && ((genericPlain as any).__goValue === undefined || (genericPlain as any).__goType?.charCodeAt(0) !== 42) ? (genericPlain as Exclude<IntWaiter, null>) : $.pointerValue<Exclude<IntWaiter, null>>(genericPlain)).Wait(ctx, 8), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = (genericPlain !== null && (genericPlain as any).__isVarRef !== true && ((genericPlain as any).__goValue === undefined || (genericPlain as any).__goType?.charCodeAt(0) !== 42) ? (genericPlain as Exclude<IntWaiter, null>) : $.pointerValue<Exclude<IntWaiter, null>>(genericPlain)).Count(ctx, $.arrayToSlice<number>([1, 2, 3])), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	let plainGeneric: GenericWaiter | null = $.namedValueInterfaceValue<GenericWaiter | null>(new intBox(), "*main.intBox", __goscriptStatic5(), __goscriptStatic6(), __goscriptStatic4())
	await $.println("plain-generic", (__goscriptAwait = $.callInterfaceMethod((plainGeneric !== null && (plainGeneric as any).__isVarRef !== true && ((plainGeneric as any).__goValue === undefined || (plainGeneric as any).__goType?.charCodeAt(0) !== 42) ? (plainGeneric as Exclude<GenericWaiter, null>) : $.pointerValue<Exclude<GenericWaiter, null>>(plainGeneric)), "Wait", __goscriptStatic0(), ctx, 9), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.callInterfaceMethod((plainGeneric !== null && (plainGeneric as any).__isVarRef !== true && ((plainGeneric as any).__goValue === undefined || (plainGeneric as any).__goType?.charCodeAt(0) !== 42) ? (plainGeneric as Exclude<GenericWaiter, null>) : $.pointerValue<Exclude<GenericWaiter, null>>(plainGeneric)), "Count", __goscriptStatic0(), ctx, $.arrayToSlice<number>([1, 2, 3, 4])), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	let plainPlain: IntWaiter | null = $.interfaceValue<IntWaiter | null>(new intBox(), "*main.intBox", /* @__PURE__ */ $.pointerType("main.intBox"))
	let retypedPlainGeneric: GenericWaiter | null = (plainPlain as GenericWaiter | null)
	await $.println("retyped-plain-generic", (__goscriptAwait = $.callInterfaceMethod((retypedPlainGeneric !== null && (retypedPlainGeneric as any).__isVarRef !== true && ((retypedPlainGeneric as any).__goValue === undefined || (retypedPlainGeneric as any).__goType?.charCodeAt(0) !== 42) ? (retypedPlainGeneric as Exclude<GenericWaiter, null>) : $.pointerValue<Exclude<GenericWaiter, null>>(retypedPlainGeneric)), "Wait", __goscriptStatic0(), ctx, 12), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.callInterfaceMethod((retypedPlainGeneric !== null && (retypedPlainGeneric as any).__isVarRef !== true && ((retypedPlainGeneric as any).__goValue === undefined || (retypedPlainGeneric as any).__goType?.charCodeAt(0) !== 42) ? (retypedPlainGeneric as Exclude<GenericWaiter, null>) : $.pointerValue<Exclude<GenericWaiter, null>>(retypedPlainGeneric)), "Count", __goscriptStatic0(), ctx, $.arrayToSlice<number>([1, 2, 3, 4, 5, 6, 7])), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	let methodValue: ((ctx: context.Context | null, old: number) => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => (ctx: context.Context | null, old: number) => $.callInterfaceMethod(__receiver, "Wait", __goscriptStatic0(), ctx, old))((retypedPlainGeneric !== null && (retypedPlainGeneric as any).__isVarRef !== true && ((retypedPlainGeneric as any).__goValue === undefined || (retypedPlainGeneric as any).__goType?.charCodeAt(0) !== 42) ? (retypedPlainGeneric as Exclude<GenericWaiter, null>) : $.pointerValue<Exclude<GenericWaiter, null>>(retypedPlainGeneric))), ({ kind: $.TypeKind.Function, params: ["context.Context", /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.GenericWaiter[...].Wait-fm")
	await $.println("method-value", (__goscriptAwait = methodValue!(ctx, 14), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	let methodExpression: ((_p0: GenericWaiter | null, ctx: context.Context | null, old: number) => number | globalThis.Promise<number>) | null = $.functionValue(async (_p0: GenericWaiter | null, ctx: context.Context | null, old: number): globalThis.Promise<number> => await $.callInterfaceMethod(_p0, "Wait", __goscriptStatic0(), ctx, old), ({ kind: $.TypeKind.Function, params: ["main.GenericWaiter", "context.Context", /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	await $.println("method-expression", (__goscriptAwait = methodExpression!(retypedPlainGeneric, ctx, 15), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	let samePointer: intBox | $.VarRef<intBox> | null = new intBox()
	let samePointerA: IntWaiter | null = $.interfaceValue<IntWaiter | null>(samePointer, "*main.intBox", /* @__PURE__ */ $.pointerType("main.intBox"))
	let samePointerB: IntWaiter | null = $.interfaceValue<IntWaiter | null>(samePointer, "*main.intBox", /* @__PURE__ */ $.pointerType("main.intBox"))
	let differentPointer: IntWaiter | null = $.interfaceValue<IntWaiter | null>(new intBox(), "*main.intBox", /* @__PURE__ */ $.pointerType("main.intBox"))
	await $.println("pointer-equal", $.comparableEqual(samePointerA, samePointerB), $.comparableEqual(samePointerA, differentPointer))
	let nilPointer: intBox | $.VarRef<intBox> | null = null! as intBox | $.VarRef<intBox> | null
	let nilInterface: IntWaiter | null = $.interfaceValue<IntWaiter | null>(nilPointer, "*main.intBox", /* @__PURE__ */ $.pointerType("main.intBox"))
	let __goscriptTuple0: any = $.typeAssertTuple<intBox | $.VarRef<intBox> | null>(nilInterface, /* @__PURE__ */ $.pointerType("main.intBox"))
	let assertedPointer: intBox | $.VarRef<intBox> | null = __goscriptTuple0[0]
	let assertedOK: boolean = __goscriptTuple0[1]
	await $.println("typed-nil", nilInterface == null, assertedPointer == null, assertedOK, (__goscriptAwait = (nilInterface !== null && (nilInterface as any).__isVarRef !== true && ((nilInterface as any).__goValue === undefined || (nilInterface as any).__goType?.charCodeAt(0) !== 42) ? (nilInterface as Exclude<IntWaiter, null>) : $.pointerValue<Exclude<IntWaiter, null>>(nilInterface)).Wait(ctx, 13), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	let retypedGeneric: GenericWaiter | null = (genericPlain as GenericWaiter | null)
	await $.println("retyped-generic", (__goscriptAwait = $.callInterfaceMethod((retypedGeneric !== null && (retypedGeneric as any).__isVarRef !== true && ((retypedGeneric as any).__goValue === undefined || (retypedGeneric as any).__goType?.charCodeAt(0) !== 42) ? (retypedGeneric as Exclude<GenericWaiter, null>) : $.pointerValue<Exclude<GenericWaiter, null>>(retypedGeneric)), "Wait", __goscriptStatic0(), ctx, 10), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.callInterfaceMethod((retypedGeneric !== null && (retypedGeneric as any).__isVarRef !== true && ((retypedGeneric as any).__goValue === undefined || (retypedGeneric as any).__goType?.charCodeAt(0) !== 42) ? (retypedGeneric as Exclude<GenericWaiter, null>) : $.pointerValue<Exclude<GenericWaiter, null>>(retypedGeneric)), "Count", __goscriptStatic0(), ctx, $.arrayToSlice<number>([1, 2, 3, 4, 5])), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	let retypedPlain: IntWaiter | null = (genericGeneric as IntWaiter | null)
	await $.println("retyped-plain", (__goscriptAwait = (retypedPlain !== null && (retypedPlain as any).__isVarRef !== true && ((retypedPlain as any).__goValue === undefined || (retypedPlain as any).__goType?.charCodeAt(0) !== 42) ? (retypedPlain as Exclude<IntWaiter, null>) : $.pointerValue<Exclude<IntWaiter, null>>(retypedPlain)).Wait(ctx, 11), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = (retypedPlain !== null && (retypedPlain as any).__isVarRef !== true && ((retypedPlain as any).__goValue === undefined || (retypedPlain as any).__goType?.charCodeAt(0) !== 42) ? (retypedPlain as Exclude<IntWaiter, null>) : $.pointerValue<Exclude<IntWaiter, null>>(retypedPlain)).Count(ctx, $.arrayToSlice<number>([1, 2, 3, 4, 5, 6])), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{Count: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Count(__goscriptStatic0(), ...$.stripGenericTypeArgs(args)), Wait: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Wait(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("Count", ["context.Context", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))], [/* @__PURE__ */ $.basicType("int")], true, true), $.methodSignature("Wait", ["context.Context", /* @__PURE__ */ $.basicType("int")], [/* @__PURE__ */ $.basicType("int")], true, false)]])
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({Count: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Count(__goscriptStatic0(), ...$.stripGenericTypeArgs(args)), Wait: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Wait(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= (/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.genericBox", "main.genericBox[int]", () => [])))
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ([$.methodSignature("Count", [["ctx", "context.Context"], ["values", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))]], [/* @__PURE__ */ $.basicType("int")], false, true), $.methodSignature("Wait", [["ctx", "context.Context"], ["old", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int")])])
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ({Count: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Count(...$.stripGenericTypeArgs(args)), Wait: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Wait(...$.stripGenericTypeArgs(args))})
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= (/* @__PURE__ */ $.pointerType("main.intBox"))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

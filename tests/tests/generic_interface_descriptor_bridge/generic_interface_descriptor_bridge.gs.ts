// Generated file based on generic_interface_descriptor_bridge.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"
import "@goscript/context/index.js"

export type GenericWaiter = {
	Count(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, values: $.Slice<any>): number | globalThis.Promise<number>
	Wait(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, old: any): any | globalThis.Promise<any>
}

$.registerInterfaceType(
	"main.GenericWaiter",
	null,
	[{ name: "Count", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export type IntWaiter = {
	Count(ctx: context.Context | null, values: $.Slice<number>): number | globalThis.Promise<number>
	Wait(ctx: context.Context | null, old: number): number | globalThis.Promise<number>
}

$.registerInterfaceType(
	"main.IntWaiter",
	null,
	[{ name: "Count", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export class genericBox {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): genericBox {
		return $.markAsStructValue(new genericBox(this))
	}

	public async Count(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, values: $.Slice<any>): globalThis.Promise<number> {
		await $.chanRecv(await $.pointerValue<Exclude<context.Context, null>>(ctx).Done())
		return $.len(values)
	}

	public async Wait(__typeArgs: $.GenericTypeArgs | undefined, ctx: context.Context | null, old: any): globalThis.Promise<any> {
		await $.chanRecv(await $.pointerValue<Exclude<context.Context, null>>(ctx).Done())
		return old
	}

	static __typeInfo = $.registerStructType(
		"main.genericBox",
		() => new genericBox(),
		() => [{ name: "Count", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		genericBox,
		() => []
	)
}

export class intBox {
	public declare id: number

	public _fields: {
		id: number
	}

	constructor(init?: Partial<{id?: number}>) {
		this._fields = {
			id: init?.id ?? (0 as number)
		}
	}

	public clone(): intBox {
		return $.markAsStructValue(new intBox(this))
	}

	public async Count(ctx: context.Context | null, values: $.Slice<number>): globalThis.Promise<number> {
		await $.chanRecv(await $.pointerValue<Exclude<context.Context, null>>(ctx).Done())
		return $.len(values)
	}

	public async Wait(ctx: context.Context | null, old: number): globalThis.Promise<number> {
		await $.chanRecv(await $.pointerValue<Exclude<context.Context, null>>(ctx).Done())
		return old
	}

	static {
		$.bindStructFields(this.prototype, ["id"])
	}

	static __typeInfo = $.registerStructType(
		"main.intBox",
		() => new intBox(),
		() => [{ name: "Count", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		intBox,
		() => [{ name: "id", key: "id", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let [ctx, cancel] = context.WithCancel($.pointerValueOrNil(context.Background())!)
	await cancel!()

	let genericGeneric: GenericWaiter | null = $.namedValueInterfaceValue<GenericWaiter | null>(new genericBox(), "*main.genericBox", {Count: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Count({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ...$.stripGenericTypeArgs(args)), Wait: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Wait({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.pointerType("main.genericBox"), [$.methodSignature("Count", [["ctx", "context.Context"], ["values", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))]], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Wait", [["ctx", "context.Context"], ["old", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int")])])
	await $.println("generic-generic", await $.callInterfaceMethod($.pointerValue<Exclude<GenericWaiter, null>>(genericGeneric), "Wait", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ctx, 7), await $.callInterfaceMethod($.pointerValue<Exclude<GenericWaiter, null>>(genericGeneric), "Count", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ctx, $.arrayToSlice<number>([1, 2])))

	let genericPlain: IntWaiter | null = $.namedValueInterfaceValue<IntWaiter | null>(new genericBox(), "*main.genericBox", {Count: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Count({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ...$.stripGenericTypeArgs(args)), Wait: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Wait({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.pointerType("main.genericBox"), [$.methodSignature("Count", [["ctx", "context.Context"], ["values", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))]], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Wait", [["ctx", "context.Context"], ["old", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int")])])
	await $.println("generic-plain", await $.pointerValue<Exclude<IntWaiter, null>>(genericPlain).Wait(ctx, 8), await $.pointerValue<Exclude<IntWaiter, null>>(genericPlain).Count(ctx, $.arrayToSlice<number>([1, 2, 3])))

	let plainGeneric: GenericWaiter | null = $.namedValueInterfaceValue<GenericWaiter | null>(new intBox(), "*main.intBox", {Count: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Count(...$.stripGenericTypeArgs(args)), Wait: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Wait(...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.pointerType("main.intBox"), [$.methodSignature("Count", [["ctx", "context.Context"], ["values", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))]], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Wait", [["ctx", "context.Context"], ["old", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int")])])
	await $.println("plain-generic", await $.callInterfaceMethod($.pointerValue<Exclude<GenericWaiter, null>>(plainGeneric), "Wait", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ctx, 9), await $.callInterfaceMethod($.pointerValue<Exclude<GenericWaiter, null>>(plainGeneric), "Count", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ctx, $.arrayToSlice<number>([1, 2, 3, 4])))
	let plainPlain: IntWaiter | null = $.interfaceValue<IntWaiter | null>(new intBox(), "*main.intBox", /* @__PURE__ */ $.pointerType("main.intBox"))
	let retypedPlainGeneric: GenericWaiter | null = (plainPlain as GenericWaiter | null)
	await $.println("retyped-plain-generic", await $.callInterfaceMethod($.pointerValue<Exclude<GenericWaiter, null>>(retypedPlainGeneric), "Wait", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ctx, 12), await $.callInterfaceMethod($.pointerValue<Exclude<GenericWaiter, null>>(retypedPlainGeneric), "Count", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ctx, $.arrayToSlice<number>([1, 2, 3, 4, 5, 6, 7])))
	let methodValue: ((ctx: context.Context | null, old: number) => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => (ctx: context.Context | null, old: number) => $.callInterfaceMethod(__receiver, "Wait", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ctx, old))($.pointerValue<Exclude<GenericWaiter, null>>(retypedPlainGeneric)), ({ kind: $.TypeKind.Function, params: ["context.Context", /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	await $.println("method-value", await methodValue!(ctx, 14))
	let methodExpression: ((_p0: GenericWaiter | null, ctx: context.Context | null, old: number) => number | globalThis.Promise<number>) | null = $.functionValue(async (_p0: GenericWaiter | null, ctx: context.Context | null, old: number): globalThis.Promise<number> => await $.callInterfaceMethod(_p0, "Wait", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ctx, old), ({ kind: $.TypeKind.Function, params: ["main.GenericWaiter", "context.Context", /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	await $.println("method-expression", await methodExpression!(retypedPlainGeneric, ctx, 15))
	let samePointer: intBox | $.VarRef<intBox> | null = new intBox()
	let samePointerA: IntWaiter | null = $.interfaceValue<IntWaiter | null>(samePointer, "*main.intBox", /* @__PURE__ */ $.pointerType("main.intBox"))
	let samePointerB: IntWaiter | null = $.interfaceValue<IntWaiter | null>(samePointer, "*main.intBox", /* @__PURE__ */ $.pointerType("main.intBox"))
	let differentPointer: IntWaiter | null = $.interfaceValue<IntWaiter | null>(new intBox(), "*main.intBox", /* @__PURE__ */ $.pointerType("main.intBox"))
	await $.println("pointer-equal", $.comparableEqual(samePointerA, samePointerB), $.comparableEqual(samePointerA, differentPointer))
	let nilPointer: intBox | $.VarRef<intBox> | null = null! as intBox | $.VarRef<intBox> | null
	let nilInterface: IntWaiter | null = $.interfaceValue<IntWaiter | null>(nilPointer, "*main.intBox", /* @__PURE__ */ $.pointerType("main.intBox"))
	let __goscriptTuple0: any = $.typeAssertTuple<intBox | $.VarRef<intBox> | null>(nilInterface, /* @__PURE__ */ $.pointerType("main.intBox"))
	let assertedPointer: intBox | $.VarRef<intBox> | null = __goscriptTuple0[0]
	let assertedOK = __goscriptTuple0[1]
	await $.println("typed-nil", nilInterface == null, assertedPointer == null, assertedOK, await $.pointerValue<Exclude<IntWaiter, null>>(nilInterface).Wait(ctx, 13))

	let retypedGeneric: GenericWaiter | null = (genericPlain as GenericWaiter | null)
	await $.println("retyped-generic", await $.callInterfaceMethod($.pointerValue<Exclude<GenericWaiter, null>>(retypedGeneric), "Wait", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ctx, 10), await $.callInterfaceMethod($.pointerValue<Exclude<GenericWaiter, null>>(retypedGeneric), "Count", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, ctx, $.arrayToSlice<number>([1, 2, 3, 4, 5])))

	let retypedPlain: IntWaiter | null = (genericGeneric as IntWaiter | null)
	await $.println("retyped-plain", await $.pointerValue<Exclude<IntWaiter, null>>(retypedPlain).Wait(ctx, 11), await $.pointerValue<Exclude<IntWaiter, null>>(retypedPlain).Count(ctx, $.arrayToSlice<number>([1, 2, 3, 4, 5, 6])))
}

if ($.isMainScript(import.meta)) {
	await main()
}

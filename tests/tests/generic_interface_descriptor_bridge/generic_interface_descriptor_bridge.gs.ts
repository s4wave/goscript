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
	[{ name: "Count", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export type IntWaiter = {
	Count(ctx: context.Context | null, values: $.Slice<number>): number | globalThis.Promise<number>
	Wait(ctx: context.Context | null, old: number): number | globalThis.Promise<number>
}

$.registerInterfaceType(
	"main.IntWaiter",
	null,
	[{ name: "Count", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export class genericBox {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): genericBox {
		const cloned = new genericBox()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
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
		[{ name: "Count", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		genericBox,
		[]
	)
}

export class intBox {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): intBox {
		const cloned = new intBox()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public async Count(ctx: context.Context | null, values: $.Slice<number>): globalThis.Promise<number> {
		await $.chanRecv(await $.pointerValue<Exclude<context.Context, null>>(ctx).Done())
		return $.len(values)
	}

	public async Wait(ctx: context.Context | null, old: number): globalThis.Promise<number> {
		await $.chanRecv(await $.pointerValue<Exclude<context.Context, null>>(ctx).Done())
		return old
	}

	static __typeInfo = $.registerStructType(
		"main.intBox",
		() => new intBox(),
		[{ name: "Count", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		intBox,
		[]
	)
}

export async function main(): globalThis.Promise<void> {
	let [ctx, cancel] = context.WithCancel($.pointerValueOrNil(context.Background())!)
	await cancel!()

	let genericGeneric: GenericWaiter | null = $.namedValueInterfaceValue<GenericWaiter | null>(new genericBox(), "*main.genericBox", {Count: (receiver: any, ...args: any[]) => receiver.Count({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ...$.stripGenericTypeArgs(args)), Wait: (receiver: any, ...args: any[]) => receiver.Wait({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Pointer, elemType: "main.genericBox" }, [{ name: "Count", args: [{ name: "ctx", type: "context.Context" }, { name: "values", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Wait", args: [{ name: "ctx", type: "context.Context" }, { name: "old", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])
	$.println("generic-generic", await $.pointerValue<Exclude<GenericWaiter, null>>(genericGeneric).Wait({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ctx, 7), await $.pointerValue<Exclude<GenericWaiter, null>>(genericGeneric).Count({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ctx, $.arrayToSlice<number>([1, 2])))

	let genericPlain: IntWaiter | null = $.namedValueInterfaceValue<IntWaiter | null>(new genericBox(), "*main.genericBox", {Count: (receiver: any, ...args: any[]) => receiver.Count({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ...$.stripGenericTypeArgs(args)), Wait: (receiver: any, ...args: any[]) => receiver.Wait({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Pointer, elemType: "main.genericBox" }, [{ name: "Count", args: [{ name: "ctx", type: "context.Context" }, { name: "values", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Wait", args: [{ name: "ctx", type: "context.Context" }, { name: "old", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])
	$.println("generic-plain", await $.pointerValue<Exclude<IntWaiter, null>>(genericPlain).Wait(ctx, 8), await $.pointerValue<Exclude<IntWaiter, null>>(genericPlain).Count(ctx, $.arrayToSlice<number>([1, 2, 3])))

	let plainGeneric: GenericWaiter | null = $.namedValueInterfaceValue<GenericWaiter | null>(new intBox(), "*main.intBox", {Count: (receiver: any, ...args: any[]) => receiver.Count(...$.stripGenericTypeArgs(args)), Wait: (receiver: any, ...args: any[]) => receiver.Wait(...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Pointer, elemType: "main.intBox" }, [{ name: "Count", args: [{ name: "ctx", type: "context.Context" }, { name: "values", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Wait", args: [{ name: "ctx", type: "context.Context" }, { name: "old", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])
	$.println("plain-generic", await $.pointerValue<Exclude<GenericWaiter, null>>(plainGeneric).Wait({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ctx, 9), await $.pointerValue<Exclude<GenericWaiter, null>>(plainGeneric).Count({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ctx, $.arrayToSlice<number>([1, 2, 3, 4])))

	let retypedGeneric: GenericWaiter | null = (genericPlain as GenericWaiter | null)
	$.println("retyped-generic", await $.pointerValue<Exclude<GenericWaiter, null>>(retypedGeneric).Wait({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ctx, 10), await $.pointerValue<Exclude<GenericWaiter, null>>(retypedGeneric).Count({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, ctx, $.arrayToSlice<number>([1, 2, 3, 4, 5])))

	let retypedPlain: IntWaiter | null = (genericGeneric as IntWaiter | null)
	$.println("retyped-plain", await $.pointerValue<Exclude<IntWaiter, null>>(retypedPlain).Wait(ctx, 11), await $.pointerValue<Exclude<IntWaiter, null>>(retypedPlain).Count(ctx, $.arrayToSlice<number>([1, 2, 3, 4, 5, 6])))
}

if ($.isMainScript(import.meta)) {
	await main()
}

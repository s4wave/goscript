// Generated file based on interface_async_method_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type AsyncProcessor = {
	GetResult(): number
	Process(data: number): number | globalThis.Promise<number>
}

$.registerInterfaceType(
	"main.AsyncProcessor",
	null,
	[{ name: "GetResult", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Process", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export type GenericStore = {
	Load(__typeArgs: $.GenericTypeArgs | undefined): any | globalThis.Promise<any>
}

$.registerInterfaceType(
	"main.GenericStore",
	null,
	[{ name: "Load", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export class ChannelProcessor {
	public declare ch: $.Channel<number> | null

	public _fields: {
		ch: $.Channel<number> | null
	}

	constructor(init?: Partial<{ch?: $.Channel<number> | null}>) {
		this._fields = {
			ch: init?.ch ?? (null! as $.Channel<number> | null)
		}
	}

	public clone(): ChannelProcessor {
		return $.markAsStructValue(new ChannelProcessor(this))
	}

	public GetResult(): number {
		const p: ChannelProcessor | $.VarRef<ChannelProcessor> | null = this;
		// This method is sync
		return 42
	}

	public async Process(data: number): globalThis.Promise<number> {
		const p: ChannelProcessor | $.VarRef<ChannelProcessor> | null = this;
		// Channel operation makes this function async
		await $.chanSend($.pointerValue<ChannelProcessor>(p).ch, data)
		let result = await $.chanRecv($.pointerValue<ChannelProcessor>(p).ch)
		return result * 2
	}

	static {
		$.bindStructFields(this.prototype, ["ch"])
	}

	static __typeInfo = $.registerStructType(
		"main.ChannelProcessor",
		() => new ChannelProcessor(),
		() => [{ name: "GetResult", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Process", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		ChannelProcessor,
		() => [{ name: "ch", key: "ch", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }]
	)
}

export class SimpleProcessor {
	public declare value: number

	public _fields: {
		value: number
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: init?.value ?? (0 as number)
		}
	}

	public clone(): SimpleProcessor {
		return $.markAsStructValue(new SimpleProcessor(this))
	}

	public GetResult(): number {
		const p: SimpleProcessor | $.VarRef<SimpleProcessor> | null = this;
		return $.pointerValue<SimpleProcessor>(p).value
	}

	public Process(data: number): number {
		const p: SimpleProcessor | $.VarRef<SimpleProcessor> | null = this;
		// Simple operation, but must be async due to interface constraint
		return data + 10
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.SimpleProcessor",
		() => new SimpleProcessor(),
		() => [{ name: "GetResult", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Process", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		SimpleProcessor,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class GenericChannelStore {
	public declare ch: $.Channel<any> | null

	public declare value: any

	public _fields: {
		ch: $.Channel<any> | null
		value: any
	}

	constructor(init?: Partial<{ch?: $.Channel<any> | null, value?: any}>) {
		this._fields = {
			ch: init?.ch ?? (null! as $.Channel<any> | null),
			value: init?.value ?? (null! as any)
		}
	}

	public clone(): GenericChannelStore {
		return $.markAsStructValue(new GenericChannelStore(this))
	}

	public async Load(__typeArgs: $.GenericTypeArgs | undefined): globalThis.Promise<any> {
		const s: GenericChannelStore | $.VarRef<GenericChannelStore> | null = this;
		await $.chanSend($.pointerValue<GenericChannelStore>(s).ch, $.pointerValue<GenericChannelStore>(s).value)
		return await $.chanRecv($.pointerValue<GenericChannelStore>(s).ch)
	}

	static {
		$.bindStructFields(this.prototype, ["ch", "value"])
	}

	static __typeInfo = $.registerStructType(
		"main.GenericChannelStore",
		() => new GenericChannelStore(),
		() => [{ name: "Load", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
		GenericChannelStore,
		() => [{ name: "ch", key: "ch", type: /* @__PURE__ */ $.channelType({ kind: $.TypeKind.Interface, methods: [] }, "both") }, { name: "value", key: "value", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export async function processViaInterface(processor: AsyncProcessor | null, input: number): globalThis.Promise<number> {
	// This call should be awaited in TypeScript since Process is async
	let result = await $.pointerValue<Exclude<AsyncProcessor, null>>(processor).Process(input)

	// This call should NOT be awaited since GetResult is sync
	let baseResult = await $.pointerValue<Exclude<AsyncProcessor, null>>(processor).GetResult()

	return result + baseResult
}

export function newGenericStore(__typeArgs: $.GenericTypeArgs | undefined, value: any): GenericStore | null {
	return $.namedValueInterfaceValue<GenericStore | null>(new GenericChannelStore({ch: $.makeChannel<any>(1, $.genericZero(__typeArgs, "V", null), "both"), value: value}), "*main.GenericChannelStore", {Load: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Load({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, V: __typeArgs?.["V"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.pointerType("main.GenericChannelStore"), [$.methodSignature("Load", [], [{ kind: $.TypeKind.Interface, methods: [] }])])
}

export async function loadGenericStore(store: GenericStore | null): globalThis.Promise<number> {
	return (await $.callInterfaceMethod($.pointerValue<Exclude<GenericStore, null>>(store), "Load", {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, V: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}) as number)
}

export async function main(): globalThis.Promise<void> {
	// Create a buffered channel
	let ch: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")

	// Test with ChannelProcessor (naturally async)
	let channelProc: ChannelProcessor | $.VarRef<ChannelProcessor> | null = new ChannelProcessor({ch: ch})
	let result1 = await processViaInterface($.interfaceValue<AsyncProcessor | null>(channelProc, "*main.ChannelProcessor", /* @__PURE__ */ $.pointerType("main.ChannelProcessor")), 5)
	await $.println("ChannelProcessor result:", result1)

	// Test with SimpleProcessor (forced async for compatibility)
	let simpleProc: SimpleProcessor | $.VarRef<SimpleProcessor> | null = new SimpleProcessor({value: 100})
	let result2 = await processViaInterface($.interfaceValue<AsyncProcessor | null>(simpleProc, "*main.SimpleProcessor", /* @__PURE__ */ $.pointerType("main.SimpleProcessor")), 5)
	await $.println("SimpleProcessor result:", result2)

	let genericStore = (newGenericStore({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, V: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, 7) as GenericStore | null)
	await $.println("GenericStore result:", await loadGenericStore(genericStore))

	ch!.close()
}

if ($.isMainScript(import.meta)) {
	await main()
}

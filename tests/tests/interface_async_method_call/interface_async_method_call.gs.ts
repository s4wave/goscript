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

	constructor(__goscriptValue?: boolean, ch$?: $.Channel<number> | null) {
		this.ch = ch$ ?? (null! as $.Channel<number> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): ChannelProcessor {
		return new ChannelProcessor(true, this.ch)
	}

	public __goscriptAssign(source: ChannelProcessor): this {
		this.ch = source.ch
		return this
	}

	public GetResult(): number {
		const p: ChannelProcessor | $.VarRef<ChannelProcessor> | null = this;
		// This method is sync
		return 42
	}

	public async Process(data: number): globalThis.Promise<number> {
		const p: ChannelProcessor | $.VarRef<ChannelProcessor> | null = this;
		const p$: ChannelProcessor = p == null ? $.pointerTarget<ChannelProcessor>(p) : (p as any).__isVarRef === true ? (p as any).value : (p as any).__goValue === undefined ? (p as any) : $.pointerTarget<ChannelProcessor>(p)
		// Channel operation makes this function async
		await $.chanSend((p$ as ChannelProcessor).ch, data)
		let result: number = await $.chanRecv((p$ as ChannelProcessor).ch)
		return result * 2
	}

	static __typeInfo = $.registerStructType(
		"main.ChannelProcessor",
		() => new ChannelProcessor(),
		() => [{ name: "GetResult", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }, { name: "Process", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		ChannelProcessor,
		() => [{ name: "ch", key: "ch", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }]
	)
}

export class SimpleProcessor {
	public declare value: number

	constructor(__goscriptValue?: boolean, value$?: number) {
		this.value = value$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): SimpleProcessor {
		return new SimpleProcessor(true, this.value)
	}

	public __goscriptAssign(source: SimpleProcessor): this {
		this.value = source.value
		return this
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

	static __typeInfo = $.registerStructType(
		"main.SimpleProcessor",
		() => new SimpleProcessor(),
		() => [{ name: "GetResult", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }, { name: "Process", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		SimpleProcessor,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class GenericChannelStore {
	public declare ch: $.Channel<any> | null

	public declare value: any

	constructor(__goscriptValue?: boolean, ch$?: $.Channel<any> | null, value$?: any) {
		this.ch = ch$ ?? (null! as $.Channel<any> | null)
		this.value = value$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): GenericChannelStore {
		return $.copyGenericInstance(this, new GenericChannelStore(true, this.ch, $.copyElement(this.value)))
	}

	public __goscriptAssign(source: GenericChannelStore): this {
		this.ch = source.ch
		this.value = $.assignFieldValue(this.value, source.value)
		return this
	}

	public async Load(__typeArgs: $.GenericTypeArgs | undefined): globalThis.Promise<any> {
		const s: GenericChannelStore | $.VarRef<GenericChannelStore> | null = this;
		const s$: GenericChannelStore = s == null ? $.pointerTarget<GenericChannelStore>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<GenericChannelStore>(s)
		await $.chanSend((s$ as GenericChannelStore).ch, $.copyElement((s$ as GenericChannelStore).value))
		return await $.chanRecv((s$ as GenericChannelStore).ch)
	}

	static __typeInfo = $.registerStructType(
		"main.GenericChannelStore",
		() => new GenericChannelStore(),
		() => [{ name: "Load", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }], pointerReceiver: true }],
		GenericChannelStore,
		() => [{ name: "ch", key: "ch", type: /* @__PURE__ */ $.channelType({ kind: $.TypeKind.Interface, methods: [] }, "both") }, { name: "value", key: "value", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export async function processViaInterface(processor: AsyncProcessor | null, input: number): globalThis.Promise<number> {
	// This call should be awaited in TypeScript since Process is async
	let result = (__goscriptAwait = (processor !== null && (processor as any).__isVarRef !== true && ((processor as any).__goValue === undefined || (processor as any).__goType?.charCodeAt(0) !== 42) ? (processor as Exclude<AsyncProcessor, null>) : $.pointerValue<Exclude<AsyncProcessor, null>>(processor)).Process(input), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)

	// This call should NOT be awaited since GetResult is sync
	let baseResult = (__goscriptAwait = (processor !== null && (processor as any).__isVarRef !== true && ((processor as any).__goValue === undefined || (processor as any).__goType?.charCodeAt(0) !== 42) ? (processor as Exclude<AsyncProcessor, null>) : $.pointerValue<Exclude<AsyncProcessor, null>>(processor)).GetResult(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)

	return result + baseResult
}

export function newGenericStore(__typeArgs: $.GenericTypeArgs | undefined, value: any): GenericStore | null {
	return $.namedValueInterfaceValue<GenericStore | null>($.genericInstance(new GenericChannelStore(false, $.makeChannel<any>(1, $.genericZero(__typeArgs, "V", null), "both"), $.copyElement(value)), () => [{Load: (receiver: any) => $.pointerValue(receiver).Load({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, V: __typeArgs?.["V"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})}, [$.methodSignature("Load", [], [__typeArgs?.["V"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }], true, false)]]), "*main.GenericChannelStore", {Load: (receiver: any) => $.pointerValue(receiver).Load({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, V: __typeArgs?.["V"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})}, /* @__PURE__ */ $.pointerType("main.GenericChannelStore"), [$.methodSignature("Load", [], [{ kind: $.TypeKind.Interface, methods: [] }])])
}

export async function loadGenericStore(store: GenericStore | null): globalThis.Promise<number> {
	return $.callInterfaceMethod((store !== null && (store as any).__isVarRef !== true && ((store as any).__goValue === undefined || (store as any).__goType?.charCodeAt(0) !== 42) ? (store as Exclude<GenericStore, null>) : $.pointerValue<Exclude<GenericStore, null>>(store)), "Load", __goscriptStatic0())
}

export async function main(): globalThis.Promise<void> {
	// Create a buffered channel
	let ch = $.makeChannel<number>(1, 0, "both")

	// Test with ChannelProcessor (naturally async)
	let channelProc = new ChannelProcessor(false, ch)
	let result1 = await processViaInterface($.interfaceValue<AsyncProcessor | null>(channelProc, "*main.ChannelProcessor", /* @__PURE__ */ $.pointerType("main.ChannelProcessor")), 5)
	await $.println("ChannelProcessor result:", result1)

	// Test with SimpleProcessor (forced async for compatibility)
	let simpleProc = new SimpleProcessor(false, 100)
	let result2 = await processViaInterface($.interfaceValue<AsyncProcessor | null>(simpleProc, "*main.SimpleProcessor", /* @__PURE__ */ $.pointerType("main.SimpleProcessor")), 5)
	await $.println("SimpleProcessor result:", result2)

	let genericStore = (newGenericStore(__goscriptStatic0(), 7) as GenericStore | null)
	await $.println("GenericStore result:", await loadGenericStore(genericStore))

	ch.close()
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, V: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

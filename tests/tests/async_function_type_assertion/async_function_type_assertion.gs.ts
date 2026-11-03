// Generated file based on async_function_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Worker {
	public declare ch: $.Channel<number> | null

	constructor(__goscriptValue?: boolean, ch$?: $.Channel<number> | null) {
		this.ch = ch$ ?? (null! as $.Channel<number> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Worker {
		return new Worker(true, this.ch)
	}

	public __goscriptAssign(source: Worker): this {
		this.ch = source.ch
		return this
	}

	public async lookup(network: string): globalThis.Promise<number> {
		const w: Worker | $.VarRef<Worker> | null = this;
		const w$: Worker = w == null ? $.pointerTarget<Worker>(w) : (w as any).__isVarRef === true ? (w as any).value : (w as any).__goValue === undefined ? (w as any) : $.pointerTarget<Worker>(w)
		await $.chanSend((w$ as Worker).ch, $.stringLen(network))
		return await $.chanRecv((w$ as Worker).ch)
	}

	static __typeInfo = $.registerStructType(
		"main.Worker",
		() => new Worker(),
		() => [{ name: "lookup", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		Worker,
		() => [{ name: "ch", key: "ch", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }]
	)
}

export async function callLookup(fn: ((_p0: string) => number | globalThis.Promise<number>) | null, network: string): globalThis.Promise<number> {
	return fn!(network)
}

export function syncLookup(network: string): number {
	return $.stringLen(network)
}

export function chooseLookup(value: any, worker: Worker | $.VarRef<Worker> | null): number {
	let resolver: ((network: string) => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => (network: string) => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as Worker).lookup(network) : Worker.prototype.lookup.call(__receiver, network)))(worker), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.(*Worker).lookup-fm")
	{
		let [alt, ] = $.typeAssertTuple<((_p0: string) => number | globalThis.Promise<number>) | null>(value, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
		if (alt != null) {
			resolver = alt
		}
	}
	resolver
	return 2
}

export async function main(): globalThis.Promise<void> {
	let worker = new Worker(false, $.makeChannel<number>(1, 0, "both"))
	let worker$: Worker = worker == null ? $.pointerTarget<Worker>(worker) : (worker as any).__isVarRef === true ? (worker as any).value : (worker as any).__goValue === undefined ? (worker as any) : $.pointerTarget<Worker>(worker)
	await $.println("lookup:", chooseLookup(null, worker))

	await $.chanSend((worker$ as Worker).ch, 1)
	await $.chanRecv((worker$ as Worker).ch)
	await $.println("call:", await callLookup($.functionValue(((__receiver) => (network: string) => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as Worker).lookup(network) : Worker.prototype.lookup.call(__receiver, network)))(worker), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.(*Worker).lookup-fm"), "tcp"))

	let hook = $.functionValue(async (fn: ((_p0: string) => number | globalThis.Promise<number>) | null, network: string): globalThis.Promise<number> => {
		return fn!(network)
	}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), /* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	await $.println("hook:", await hook(syncLookup, "ip"))
	void (worker$ as Worker).ch!.close()
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

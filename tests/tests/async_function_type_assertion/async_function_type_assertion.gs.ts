// Generated file based on async_function_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Worker {
	public declare ch: $.Channel<number> | null

	public _fields: {
		ch: $.Channel<number> | null
	}

	constructor(init?: Partial<{ch?: $.Channel<number> | null}>) {
		this._fields = {
			ch: init?.ch ?? (null! as $.Channel<number> | null)
		}
	}

	public clone(): Worker {
		return $.markAsStructValue(new Worker(this))
	}

	public async lookup(network: string): globalThis.Promise<number> {
		const w: Worker | $.VarRef<Worker> | null = this
		await $.chanSend($.pointerValue<Worker>(w).ch, $.len(network))
		return await $.chanRecv($.pointerValue<Worker>(w).ch)
	}

	static {
		$.bindStructFields(this.prototype, ["ch"])
	}

	static __typeInfo = $.registerStructType(
		"main.Worker",
		() => new Worker(),
		() => [{ name: "lookup", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		Worker,
		() => [{ name: "ch", key: "ch", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }]
	)
}

export async function callLookup(fn: ((_p0: string) => number | globalThis.Promise<number>) | null, network: string): globalThis.Promise<number> {
	return fn!(network)
}

export function syncLookup(network: string): number {
	return $.len(network)
}

export function chooseLookup(value: any, worker: Worker | $.VarRef<Worker> | null): number {
	let resolver: ((network: string) => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => (network: string) => __receiver.lookup(network))($.pointerValue<Worker>(worker)), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
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
	let worker: Worker | $.VarRef<Worker> | null = new Worker({ch: $.makeChannel<number>(1, 0, "both")})
	await $.println("lookup:", chooseLookup(null, worker))

	await $.chanSend($.pointerValue<Worker>(worker).ch, 1)
	await $.chanRecv($.pointerValue<Worker>(worker).ch)
	await $.println("call:", await callLookup($.functionValue(((__receiver) => (network: string) => __receiver.lookup(network))($.pointerValue<Worker>(worker)), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)), "tcp"))

	let hook: ((fn: ((_p0: string) => number | globalThis.Promise<number>) | null, network: string) => number | globalThis.Promise<number>) | null = $.functionValue(async (fn: ((_p0: string) => number | globalThis.Promise<number>) | null, network: string): globalThis.Promise<number> => {
		return fn!(network)
	}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), /* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	await $.println("hook:", await hook!(syncLookup, "ip"))
	$.pointerValue<Worker>(worker).ch!.close()
}

if ($.isMainScript(import.meta)) {
	await main()
}

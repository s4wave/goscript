// Generated file based on nested_async_method_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Spawner = {
	Spawn(): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"main.Spawner",
	null,
	[{ name: "Spawn", args: [], returns: [{ type: "error" }] }]
);

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

	public async Spawn(): globalThis.Promise<$.GoError> {
		const w: Worker | $.VarRef<Worker> | null = this;
		$.go(async () => {
			await $.chanRecv($.pointerValue<Worker>(w).ch)
		})
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.Worker",
		() => new Worker(),
		() => [{ name: "Spawn", args: [], returns: [{ type: "error" }], pointerReceiver: true }],
		Worker,
		() => [{ name: "ch", key: "ch", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }]
	)
}

export async function run(fn: (() => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<void> {
	let err = (__goscriptAwait = fn!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	if (err == null) {
		await $.println("func value err: nil")
	} else {
		await $.println("func value err: non-nil")
	}
}

export async function main(): globalThis.Promise<void> {
	let w = new Worker(false, $.makeChannel<number>(1, 0, "both"))
	await run($.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as Worker).Spawn() : Worker.prototype.Spawn.call(__receiver)))(w), ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo), "main.(*Worker).Spawn-fm"))

	let s: Spawner | null = $.interfaceValue<Spawner | null>(w, "*main.Worker", /* @__PURE__ */ $.pointerType("main.Worker"))
	let err = (__goscriptAwait = (s !== null && (s as any).__isVarRef !== true && ((s as any).__goValue === undefined || (s as any).__goType?.charCodeAt(0) !== 42) ? (s as Exclude<Spawner, null>) : $.pointerValue<Exclude<Spawner, null>>(s)).Spawn(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	if (err == null) {
		await $.println("iface err: nil")
	} else {
		await $.println("iface err: non-nil")
	}
	await $.chanSend($.pointerValue<Worker>(w).ch, 1)
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

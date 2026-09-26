// Generated file based on async_function_pointer_callback.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"
import "@goscript/sync/atomic/index.js"

export type Process = ((snap: Snapshot | $.VarRef<Snapshot> | null, n: number) => [$.VarRef<number> | null, $.Slice<number>, $.GoError] | globalThis.Promise<[$.VarRef<number> | null, $.Slice<number>, $.GoError]>) | null

export type SnapFunc = ((n: number) => [$.VarRef<number> | null, $.Slice<number>, $.GoError] | globalThis.Promise<[$.VarRef<number> | null, $.Slice<number>, $.GoError]>) | null

export class Snapshot {
	public declare base: number

	public _fields: {
		base: number
	}

	constructor(init?: Partial<{base?: number}>) {
		this._fields = {
			base: init?.base ?? (0 as number)
		}
	}

	public clone(): Snapshot {
		return $.markAsStructValue(new Snapshot(this))
	}

	public async Apply(n: number, cb: ((n: number) => [$.VarRef<number> | null, $.Slice<number>, $.GoError] | globalThis.Promise<[$.VarRef<number> | null, $.Slice<number>, $.GoError]>) | null): globalThis.Promise<[number, $.GoError]> {
		const s: Snapshot | $.VarRef<Snapshot> | null = this;
		let __goscriptTuple0: any = await cb!($.pointerValue<Snapshot>(s).base + n)
		let next = __goscriptTuple0[0]
		let results: $.Slice<number> = __goscriptTuple0[1]
		let err = __goscriptTuple0[2]
		if (err != null) {
			return [0, err]
		}
		return [$.pointerValue<number>(next) + $.len(results), null]
	}

	static {
		$.bindStructFields(this.prototype, ["base"])
	}

	static __typeInfo = $.registerStructType(
		"main.Snapshot",
		() => new Snapshot(),
		() => [{ name: "Apply", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }],
		Snapshot,
		() => [{ name: "base", key: "base", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Host {
	public declare process: atomic.Pointer<Process>

	public _fields: {
		process: atomic.Pointer<Process>
	}

	constructor(init?: Partial<{process?: atomic.Pointer<Process>}>) {
		this._fields = {
			process: init?.process ? $.markAsStructValue($.cloneStructValue(init.process)) : $.markAsStructValue(new atomic.Pointer<Process>())
		}
	}

	public clone(): Host {
		return $.markAsStructValue(new Host(this))
	}

	public processor(): ((n: number) => [number, $.GoError] | globalThis.Promise<[number, $.GoError]>) | null {
		const h: Host | $.VarRef<Host> | null = this;
		let cb = ($.pointerValue<Host>(h).process.Load() as $.VarRef<Process> | null)
		if (cb == null) {
			return (null as ((n: number) => [number, $.GoError] | globalThis.Promise<[number, $.GoError]>) | null)
		}
		return $.functionValue(async (n: number): globalThis.Promise<[number, $.GoError]> => {
			let snap: Snapshot | $.VarRef<Snapshot> | null = new Snapshot({base: 10})
			return await Snapshot.prototype.Apply.call(snap, n, $.functionValue(async (n: number): globalThis.Promise<[$.VarRef<number> | null, $.Slice<number>, $.GoError]> => {
				return await ($.pointerValue<Process>(cb))!(snap, n)
			}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), "error"] } as $.FunctionTypeInfo)))
		}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int"), "error"] } as $.FunctionTypeInfo))
	}

	static {
		$.bindStructFields(this.prototype, ["process"])
	}

	static __typeInfo = $.registerStructType(
		"main.Host",
		() => new Host(),
		() => [{ name: "processor", args: [], returns: [{ type: ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int"), "error"] } as $.FunctionTypeInfo) }] }],
		Host,
		() => [{ name: "process", key: "process", type: "atomic.Pointer" }]
	)
}

export async function main(): globalThis.Promise<void> {
	let ch: $.Channel<number> | null = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 5)
	let process: $.VarRef<((snap: Snapshot | $.VarRef<Snapshot> | null, n: number) => [$.VarRef<number> | null, $.Slice<number>, $.GoError] | globalThis.Promise<[$.VarRef<number> | null, $.Slice<number>, $.GoError]>) | null> = $.varRef($.functionValue(async (snap: Snapshot | $.VarRef<Snapshot> | null, n: number): globalThis.Promise<[$.VarRef<number> | null, $.Slice<number>, $.GoError]> => {
		let next = $.varRef(n + await $.chanRecv(ch))
		return [next, $.arrayToSlice<number>([$.pointerValue<Snapshot>(snap).base]), null]
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Snapshot"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), "error"] } as $.FunctionTypeInfo)))

	let h: Host | $.VarRef<Host> | null = new Host()
	$.pointerValue<Host>(h).process.Store(process)
	let [got, err] = await Host.prototype.processor.call(h)!(1)
	await $.println("pointer callback", got, err == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}

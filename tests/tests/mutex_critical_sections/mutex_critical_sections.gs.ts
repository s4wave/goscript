// Generated file based on mutex_critical_sections.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as sync from "@goscript/sync/index.js"

export class counter {
	public declare mu: sync.Mutex

	public declare n: number

	constructor(__goscriptValue?: boolean, mu$?: sync.Mutex, n$?: number) {
		this.mu = mu$ ?? $.markAsStructValue(new sync.Mutex())
		this.n = n$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): counter {
		return new counter(true, $.markAsStructValue($.cloneStructValue(this.mu)), this.n)
	}

	public __goscriptAssign(source: counter): this {
		$.assignStruct(this.mu, source.mu)
		this.n = source.n
		return this
	}

	public add(k: number): void {
		const c: counter | $.VarRef<counter> | null = this;
		const c$: counter = c == null ? $.pointerTarget<counter>(c) : (c as any).__isVarRef === true ? (c as any).value : (c as any).__goValue === undefined ? (c as any) : $.pointerTarget<counter>(c)
		void (c$ as counter).mu.Lock();
		;(c$ as counter).n += k
		void (c$ as counter).mu.Unlock()
	}

	public ["get"](): number {
		const c: counter | $.VarRef<counter> | null = this;
		using __defer = new $.DisposableStack()
		const c$: counter = c == null ? $.pointerTarget<counter>(c) : (c as any).__isVarRef === true ? (c as any).value : (c as any).__goValue === undefined ? (c as any) : $.pointerTarget<counter>(c)
		void (c$ as counter).mu.Lock()
		const __goscriptDeferCallee0 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as sync.Mutex).Unlock() : sync.Mutex.prototype.Unlock.call($.pointerValue<sync.Mutex>(__receiver))))($.fieldRef((c$ as counter), "mu")), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "sync.(*Mutex).Unlock-fm")
		__defer.defer(() => { __goscriptDeferCallee0() })
		return (c$ as counter).n
	}

	static __typeInfo = $.registerStructType(
		"main.counter",
		() => new counter(),
		() => [{ name: "add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }, { name: "get", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		counter,
		() => [{ name: "mu", key: "mu", type: "sync.Mutex" }, { name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class queue {
	public declare mu: sync.Mutex

	public declare items: $.Slice<number>

	public declare ready: $.Channel<number> | null

	constructor(__goscriptValue?: boolean, mu$?: sync.Mutex, items$?: $.Slice<number>, ready$?: $.Channel<number> | null) {
		this.mu = mu$ ?? $.markAsStructValue(new sync.Mutex())
		this.items = items$ ?? (null! as $.Slice<number>)
		this.ready = ready$ ?? (null! as $.Channel<number> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): queue {
		return new queue(true, $.markAsStructValue($.cloneStructValue(this.mu)), this.items, this.ready)
	}

	public __goscriptAssign(source: queue): this {
		$.assignStruct(this.mu, source.mu)
		this.items = source.items
		this.ready = source.ready
		return this
	}

	public async push(v: number): globalThis.Promise<void> {
		const q: queue | $.VarRef<queue> | null = this;
		const q$: queue = q == null ? $.pointerTarget<queue>(q) : (q as any).__isVarRef === true ? (q as any).value : (q as any).__goValue === undefined ? (q as any) : $.pointerTarget<queue>(q)
		await (q$ as queue).mu.Lock();
		;(q$ as queue).items = $.appendOne((q$ as queue).items, v)
		await $.chanSend((q$ as queue).ready, v)
		void (q$ as queue).mu.Unlock()
	}

	public async size(): globalThis.Promise<number> {
		const q: queue | $.VarRef<queue> | null = this;
		using __defer = new $.DisposableStack()
		const q$: queue = q == null ? $.pointerTarget<queue>(q) : (q as any).__isVarRef === true ? (q as any).value : (q as any).__goValue === undefined ? (q as any) : $.pointerTarget<queue>(q)
		await (q$ as queue).mu.Lock()
		const __goscriptDeferCallee1 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as sync.Mutex).Unlock() : sync.Mutex.prototype.Unlock.call($.pointerValue<sync.Mutex>(__receiver))))($.fieldRef((q$ as queue), "mu")), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "sync.(*Mutex).Unlock-fm")
		__defer.defer(() => { __goscriptDeferCallee1() })
		return $.sliceLen((q$ as queue).items)
	}

	static __typeInfo = $.registerStructType(
		"main.queue",
		() => new queue(),
		() => [{ name: "push", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }, { name: "size", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		queue,
		() => [{ name: "mu", key: "mu", type: "sync.Mutex" }, { name: "items", key: "items", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")) }, { name: "ready", key: "ready", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }]
	)
}

export class shared {
	public declare mu: sync.Mutex

	public declare n: number

	constructor(__goscriptValue?: boolean, mu$?: sync.Mutex, n$?: number) {
		this.mu = mu$ ?? $.markAsStructValue(new sync.Mutex())
		this.n = n$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): shared {
		return new shared(true, $.markAsStructValue($.cloneStructValue(this.mu)), this.n)
	}

	public __goscriptAssign(source: shared): this {
		$.assignStruct(this.mu, source.mu)
		this.n = source.n
		return this
	}

	public async inc(): globalThis.Promise<void> {
		const s: shared | $.VarRef<shared> | null = this;
		const s$: shared = s == null ? $.pointerTarget<shared>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<shared>(s)
		await (s$ as shared).mu.Lock();
		;(s$ as shared).n++
		void (s$ as shared).mu.Unlock()
	}

	static __typeInfo = $.registerStructType(
		"main.shared",
		() => new shared(),
		() => [{ name: "inc", args: [], returns: [], pointerReceiver: true }],
		shared,
		() => [{ name: "mu", key: "mu", type: "sync.Mutex" }, { name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class gate {
	public declare mu: sync.Mutex

	public declare started: $.Channel<number> | null

	public declare wake: $.Channel<number> | null

	public declare log: $.Slice<string>

	constructor(__goscriptValue?: boolean, mu$?: sync.Mutex, started$?: $.Channel<number> | null, wake$?: $.Channel<number> | null, log$?: $.Slice<string>) {
		this.mu = mu$ ?? $.markAsStructValue(new sync.Mutex())
		this.started = started$ ?? (null! as $.Channel<number> | null)
		this.wake = wake$ ?? (null! as $.Channel<number> | null)
		this.log = log$ ?? (null! as $.Slice<string>)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): gate {
		return new gate(true, $.markAsStructValue($.cloneStructValue(this.mu)), this.started, this.wake, this.log)
	}

	public __goscriptAssign(source: gate): this {
		$.assignStruct(this.mu, source.mu)
		this.started = source.started
		this.wake = source.wake
		this.log = source.log
		return this
	}

	public async open(): globalThis.Promise<void> {
		const g: gate | $.VarRef<gate> | null = this;
		const g$: gate = g == null ? $.pointerTarget<gate>(g) : (g as any).__isVarRef === true ? (g as any).value : (g as any).__goValue === undefined ? (g as any) : $.pointerTarget<gate>(g)
		await (g$ as gate).mu.Lock();
		;(g$ as gate).log = $.appendOne((g$ as gate).log, "open")
		void (g$ as gate).mu.Unlock()
	}

	public async poll(): globalThis.Promise<void> {
		const g: gate | $.VarRef<gate> | null = this;
		const g$: gate = g == null ? $.pointerTarget<gate>(g) : (g as any).__isVarRef === true ? (g as any).value : (g as any).__goValue === undefined ? (g as any) : $.pointerTarget<gate>(g)
		if ((g$ as gate).mu.TryLock()) {
			;(g$ as gate).log = $.appendOne((g$ as gate).log, "poll start")
			await $.chanSend((g$ as gate).started, 1)
			await $.chanRecv((g$ as gate).wake);
			;(g$ as gate).log = $.appendOne((g$ as gate).log, "poll end")
			void (g$ as gate).mu.Unlock()
		}
	}

	static __typeInfo = $.registerStructType(
		"main.gate",
		() => new gate(),
		() => [{ name: "open", args: [], returns: [], pointerReceiver: true }, { name: "poll", args: [], returns: [], pointerReceiver: true }],
		gate,
		() => [{ name: "mu", key: "mu", type: "sync.Mutex" }, { name: "started", key: "started", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }, { name: "wake", key: "wake", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }, { name: "log", key: "log", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string")) }]
	)
}

export class relay {
	public declare mu: sync.Mutex

	public declare started: $.Channel<number> | null

	public declare wake: $.Channel<number> | null

	public declare log: $.Slice<string>

	constructor(__goscriptValue?: boolean, mu$?: sync.Mutex, started$?: $.Channel<number> | null, wake$?: $.Channel<number> | null, log$?: $.Slice<string>) {
		this.mu = mu$ ?? $.markAsStructValue(new sync.Mutex())
		this.started = started$ ?? (null! as $.Channel<number> | null)
		this.wake = wake$ ?? (null! as $.Channel<number> | null)
		this.log = log$ ?? (null! as $.Slice<string>)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): relay {
		return new relay(true, $.markAsStructValue($.cloneStructValue(this.mu)), this.started, this.wake, this.log)
	}

	public __goscriptAssign(source: relay): this {
		$.assignStruct(this.mu, source.mu)
		this.started = source.started
		this.wake = source.wake
		this.log = source.log
		return this
	}

	public async begin(hold: boolean): globalThis.Promise<boolean> {
		const r: relay | $.VarRef<relay> | null = this;
		const r$: relay = r == null ? $.pointerTarget<relay>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<relay>(r)
		await (r$ as relay).mu.Lock()
		if (!hold) {
			void (r$ as relay).mu.Unlock()
			return false
		}
		;(r$ as relay).log = $.appendOne((r$ as relay).log, "begin")
		return true
	}

	public end(): void {
		const r: relay | $.VarRef<relay> | null = this;
		const r$: relay = r == null ? $.pointerTarget<relay>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<relay>(r);
		;(r$ as relay).log = $.appendOne((r$ as relay).log, "end")
		void (r$ as relay).mu.Unlock()
	}

	public async open(): globalThis.Promise<void> {
		const r: relay | $.VarRef<relay> | null = this;
		const r$: relay = r == null ? $.pointerTarget<relay>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<relay>(r)
		await (r$ as relay).mu.Lock();
		;(r$ as relay).log = $.appendOne((r$ as relay).log, "open")
		void (r$ as relay).mu.Unlock()
	}

	public async run(): globalThis.Promise<void> {
		const r: relay | $.VarRef<relay> | null = this;
		const r$: relay = r == null ? $.pointerTarget<relay>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<relay>(r)
		if (await (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as relay).begin(true) : relay.prototype.begin.call(r, true))) {
			await $.chanSend((r$ as relay).started, 1)
			await $.chanRecv((r$ as relay).wake)
			void (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as relay).end() : relay.prototype.end.call(r))
		}
	}

	static __typeInfo = $.registerStructType(
		"main.relay",
		() => new relay(),
		() => [{ name: "begin", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "end", args: [], returns: [], pointerReceiver: true }, { name: "open", args: [], returns: [], pointerReceiver: true }, { name: "run", args: [], returns: [], pointerReceiver: true }],
		relay,
		() => [{ name: "mu", key: "mu", type: "sync.Mutex" }, { name: "started", key: "started", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }, { name: "wake", key: "wake", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }, { name: "log", key: "log", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string")) }]
	)
}

export let registryMu = $.varRef($.markAsStructValue(new sync.RWMutex()))

export function __goscript_set_registryMu(__goscriptValue: sync.RWMutex): void {
	$.assignStruct(registryMu.value, __goscriptValue)
}

export let registry: globalThis.Map<string, number> | null = $.makeMap<string, number>([])

export function __goscript_set_registry(__goscriptValue: globalThis.Map<string, number> | null): void {
	registry = __goscriptValue
}

export function register(name: string, v: number): void {
	using __defer = new $.DisposableStack()
	registryMu.value.Lock()
	const __goscriptDeferCallee2 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as sync.RWMutex).Unlock() : sync.RWMutex.prototype.Unlock.call($.pointerValue<sync.RWMutex>(__receiver))))(registryMu), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "sync.(*RWMutex).Unlock-fm")
	__defer.defer(() => { __goscriptDeferCallee2() })
	$.mapSet(registry, name, v)
}

export function lookup(name: string): number {
	registryMu.value.RLock()
	let v = $.mapGet<string, number, number>(registry, name, 0)[0]
	registryMu.value.RUnlock()
	return v
}

export async function lockWith(mu: sync.Mutex | $.VarRef<sync.Mutex> | null, f: (() => void) | null): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	await (mu !== null && (mu as any).__isVarRef !== true && (mu as any).__goValue === undefined ? ((mu as any) as sync.Mutex).Lock() : sync.Mutex.prototype.Lock.call($.pointerValue<sync.Mutex>(mu)))
	const __goscriptDeferCallee3 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as sync.Mutex).Unlock() : sync.Mutex.prototype.Unlock.call($.pointerValue<sync.Mutex>(__receiver))))(mu), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "sync.(*Mutex).Unlock-fm")
	__defer.defer(() => { __goscriptDeferCallee3() })
	f!()
}

export let setupOnce = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set_setupOnce(__goscriptValue: sync.Once): void {
	$.assignStruct(setupOnce.value, __goscriptValue)
}

export let setupDone = 0

export function __goscript_set_setupDone(__goscriptValue: number): void {
	setupDone = __goscriptValue
}

export let cache = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_cache(__goscriptValue: sync.Map): void {
	$.assignStruct(cache.value, __goscriptValue)
}

export function setup(): number {
	setupOnce.value.Do($.functionValue(() => {
		setupDone++
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	return setupDone
}

export function cached(k: string): number {
	{
		let [v, ok] = cache.value.Load(k)
		if (ok) {
			return $.mustTypeAssert<number>(v, /* @__PURE__ */ $.basicType("int"))
		}
	}
	cache.value.Store(k, $.basicInterfaceValue($.stringLen(k), "int"))
	return $.stringLen(k)
}

export function cacheSize(): number {
	let n = 0
	cache.value.Range($.functionValue((k: any, v: any): boolean => {
		n++
		return true
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)))
	return n
}

export let total = 0

export function __goscript_set_total(__goscriptValue: number): void {
	total = __goscriptValue
}

export async function sumAll(ch: $.Channel<number> | null, wg: sync.WaitGroup | $.VarRef<sync.WaitGroup> | null): globalThis.Promise<void> {
	$.go(async () => {
		using __defer = new $.DisposableStack()
		const __goscriptDeferCallee4 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as sync.WaitGroup).Done() : sync.WaitGroup.prototype.Done.call($.pointerValue<sync.WaitGroup>(__receiver))))(wg), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "sync.(*WaitGroup).Done-fm")
		__defer.defer(() => { __goscriptDeferCallee4() })
		while (true) {
			let __goscriptRange0 = await $.chanRecvWithOk(ch)
			if (!__goscriptRange0.ok) {
				break
			}
			let v = __goscriptRange0.value
			total += v
		}
	})
}

export async function main(): globalThis.Promise<void> {
	let c = new counter()
	void (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as counter).add(2) : counter.prototype.add.call(c, 2))
	void (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as counter).add(3) : counter.prototype.add.call(c, 3))
	await $.println("counter:", (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as counter)["get"]() : counter.prototype.get.call(c)))

	let q = new queue(false, undefined, undefined, $.makeChannel<number>(1, 0, "both"))
	let wg = $.varRef($.markAsStructValue(new sync.WaitGroup()))
	wg.value.Add(1)
	$.go(async () => {
		await using __defer = new $.AsyncDisposableStack()
		__defer.defer(() => { wg.value.Done() })
		await $.println("received:", await $.chanRecv($.pointerValue<queue>(q).ready))
	})
	await (q !== null && (q as any).__isVarRef !== true && (q as any).__goValue === undefined ? ((q as any) as queue).push(7) : queue.prototype.push.call(q, 7))
	await wg.value.Wait()
	await $.println("queue:", await (q !== null && (q as any).__isVarRef !== true && (q as any).__goValue === undefined ? ((q as any) as queue).size() : queue.prototype.size.call(q)))

	register("a", 1)
	register("b", 2)
	await $.println("lookup:", lookup("a") + lookup("b"))

	let s = new shared()
	let s$: shared = s == null ? $.pointerTarget<shared>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<shared>(s)
	await (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as shared).inc() : shared.prototype.inc.call(s))
	await lockWith($.fieldRef((s$ as shared), "mu"), $.functionValue(() => {
		;(s$ as shared).n += 10
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await $.println("shared:", (s$ as shared).n)

	let g = new gate(false, undefined, $.makeChannel<number>(0, 0, "both"), $.makeChannel<number>(0, 0, "both"))
	let g$: gate = g == null ? $.pointerTarget<gate>(g) : (g as any).__isVarRef === true ? (g as any).value : (g as any).__goValue === undefined ? (g as any) : $.pointerTarget<gate>(g)
	$.go(async () => { await (g !== null && (g as any).__isVarRef !== true && (g as any).__goValue === undefined ? ((g as any) as gate).poll() : gate.prototype.poll.call(g)) })
	await $.chanRecv((g$ as gate).started)
	$.go(async () => {
		await $.chanSend((g$ as gate).wake, 1)
	})
	await (g !== null && (g as any).__isVarRef !== true && (g as any).__goValue === undefined ? ((g as any) as gate).open() : gate.prototype.open.call(g))
	for (let __goscriptRangeTarget0 = (g$ as gate).log, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let entry = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as string)
		await $.println("gate:", entry)
	}

	let r = new relay(false, undefined, $.makeChannel<number>(0, 0, "both"), $.makeChannel<number>(0, 0, "both"))
	let r$: relay = r == null ? $.pointerTarget<relay>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<relay>(r)
	$.go(async () => { await (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as relay).run() : relay.prototype.run.call(r)) })
	await $.chanRecv((r$ as relay).started)
	$.go(async () => {
		await $.chanSend((r$ as relay).wake, 1)
	})
	await (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as relay).open() : relay.prototype.open.call(r))
	for (let __goscriptRangeTarget1 = (r$ as relay).log, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let entry = (__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as string)
		await $.println("relay:", entry)
	}

	await $.println("setup:", setup(), setup())
	await $.println("cached:", cached("abc"), cached("abc"), cacheSize())

	let ch = $.makeChannel<number>(0, 0, "both")
	let sums = $.varRef($.markAsStructValue(new sync.WaitGroup()))
	sums.value.Add(1)
	await sumAll(ch, sums)
	await $.chanSend(ch, 1)
	await $.chanSend(ch, 2)
	ch.close()
	await sums.value.Wait()
	await $.println("total:", total)
}

if ($.isMainScript(import.meta)) {
	await main()
}

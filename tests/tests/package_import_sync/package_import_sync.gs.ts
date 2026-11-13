// Generated file based on package_import_sync.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as sync from "@goscript/sync/index.js"

export class embeddedMutex {
	public declare Mutex: sync.Mutex

	public declare value: number

	constructor(__goscriptValue?: boolean, Mutex$?: sync.Mutex, value$?: number) {
		this.Mutex = Mutex$ ?? $.markAsStructValue(new sync.Mutex())
		this.value = value$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): embeddedMutex {
		return new embeddedMutex(true, $.markAsStructValue($.cloneStructValue(this.Mutex)), this.value)
	}

	public __goscriptAssign(source: embeddedMutex): this {
		$.assignStruct(this.Mutex, source.Mutex)
		this.value = source.value
		return this
	}

	public Lock(): any {
		return $.pointerValue<sync.Mutex>(this.Mutex).Lock()
	}

	public TryLock(): any {
		return $.pointerValue<sync.Mutex>(this.Mutex).TryLock()
	}

	public Unlock(): any {
		return $.pointerValue<sync.Mutex>(this.Mutex).Unlock()
	}

	static __typeInfo = $.registerStructType(
		"main.embeddedMutex",
		() => new embeddedMutex(),
		() => [{ name: "Lock", args: [], returns: [], pointerReceiver: true }, { name: "TryLock", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Unlock", args: [], returns: [], pointerReceiver: true }],
		embeddedMutex,
		() => [{ name: "Mutex", key: "Mutex", type: "sync.Mutex", anonymous: true }, { name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class embeddedRWMutex {
	public declare RWMutex: sync.RWMutex

	public declare value: number

	constructor(__goscriptValue?: boolean, RWMutex$?: sync.RWMutex, value$?: number) {
		this.RWMutex = RWMutex$ ?? $.markAsStructValue(new sync.RWMutex())
		this.value = value$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): embeddedRWMutex {
		return new embeddedRWMutex(true, $.markAsStructValue($.cloneStructValue(this.RWMutex)), this.value)
	}

	public __goscriptAssign(source: embeddedRWMutex): this {
		$.assignStruct(this.RWMutex, source.RWMutex)
		this.value = source.value
		return this
	}

	public Lock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).Lock()
	}

	public RLock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).RLock()
	}

	public RLocker(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).RLocker()
	}

	public RUnlock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).RUnlock()
	}

	public TryLock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).TryLock()
	}

	public TryRLock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).TryRLock()
	}

	public Unlock(): any {
		return $.pointerValue<sync.RWMutex>(this.RWMutex).Unlock()
	}

	static __typeInfo = $.registerStructType(
		"main.embeddedRWMutex",
		() => new embeddedRWMutex(),
		() => [{ name: "Lock", args: [], returns: [], pointerReceiver: true }, { name: "RLock", args: [], returns: [], pointerReceiver: true }, { name: "RLocker", args: [], returns: [{ type: "sync.Locker" }], pointerReceiver: true }, { name: "RUnlock", args: [], returns: [], pointerReceiver: true }, { name: "TryLock", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "TryRLock", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Unlock", args: [], returns: [], pointerReceiver: true }],
		embeddedRWMutex,
		() => [{ name: "RWMutex", key: "RWMutex", type: "sync.RWMutex", anonymous: true }, { name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class queue {
	public declare Mu: sync.Mutex

	public declare Cond: sync.Cond

	public declare items: $.Slice<number>

	constructor(__goscriptValue?: boolean, Mu$?: sync.Mutex, Cond$?: sync.Cond, items$?: $.Slice<number>) {
		this.Mu = Mu$ ?? $.markAsStructValue(new sync.Mutex())
		this.Cond = Cond$ ?? $.markAsStructValue(new sync.Cond())
		this.items = items$ ?? (null! as $.Slice<number>)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): queue {
		return new queue(true, $.markAsStructValue($.cloneStructValue(this.Mu)), $.markAsStructValue($.cloneStructValue(this.Cond)), this.items)
	}

	public __goscriptAssign(source: queue): this {
		$.assignStruct(this.Mu, source.Mu)
		$.assignStruct(this.Cond, source.Cond)
		this.items = source.items
		return this
	}

	public async lockAndInit(): globalThis.Promise<void> {
		const q: queue | $.VarRef<queue> | null = this;
		const q$: queue = q == null ? $.pointerTarget<queue>(q) : (q as any).__isVarRef === true ? (q as any).value : (q as any).__goValue === undefined ? (q as any) : $.pointerTarget<queue>(q)
		await (q$ as queue).Mu.Lock()
		if ((q$ as queue).Cond.L == null) {
			;(q$ as queue).Cond.L = $.interfaceValue<sync.Locker | null>($.fieldRef((q$ as queue), "Mu"), "*sync.Mutex", __goscriptStatic0())
		}
	}

	public async pop(): globalThis.Promise<number> {
		const q: queue | $.VarRef<queue> | null = this;
		using __defer = new $.DisposableStack()
		const q$: queue = q == null ? $.pointerTarget<queue>(q) : (q as any).__isVarRef === true ? (q as any).value : (q as any).__goValue === undefined ? (q as any) : $.pointerTarget<queue>(q)
		await (q !== null && (q as any).__isVarRef !== true && (q as any).__goValue === undefined ? ((q as any) as queue).lockAndInit() : queue.prototype.lockAndInit.call(q))
		const __goscriptDeferCallee0 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as sync.Mutex).Unlock() : sync.Mutex.prototype.Unlock.call($.pointerValue<sync.Mutex>(__receiver))))($.fieldRef((q$ as queue), "Mu")), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "sync.(*Mutex).Unlock-fm")
		__defer.defer(() => { __goscriptDeferCallee0() })
		while ($.sliceLen((q$ as queue).items) == 0) {
			await (q$ as queue).Cond.Wait()
		}
		let v = $.plainSliceIndex((q$ as queue).items!, 0);
		;(q$ as queue).items = $.goSlice((q$ as queue).items, 1, undefined)
		return v
	}

	public async push(v: number): globalThis.Promise<void> {
		const q: queue | $.VarRef<queue> | null = this;
		const q$: queue = q == null ? $.pointerTarget<queue>(q) : (q as any).__isVarRef === true ? (q as any).value : (q as any).__goValue === undefined ? (q as any) : $.pointerTarget<queue>(q)
		await (q !== null && (q as any).__isVarRef !== true && (q as any).__goValue === undefined ? ((q as any) as queue).lockAndInit() : queue.prototype.lockAndInit.call(q));
		;(q$ as queue).items = $.appendOne((q$ as queue).items, v)
		void (q$ as queue).Cond.Signal()
		void (q$ as queue).Mu.Unlock()
	}

	static __typeInfo = $.registerStructType(
		"main.queue",
		() => new queue(),
		() => [{ name: "lockAndInit", args: [], returns: [], pointerReceiver: true }, { name: "pop", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }, { name: "push", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		queue,
		() => [{ name: "Mu", key: "Mu", type: "sync.Mutex" }, { name: "Cond", key: "Cond", type: "sync.Cond" }, { name: "items", key: "items", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")) }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Test Mutex
	let mu = $.varRef($.markAsStructValue(new sync.Mutex()))
	await mu.value.Lock()
	await $.println("Mutex locked")
	mu.value.Unlock()
	await $.println("Mutex unlocked")

	let embedded: $.VarRef<embeddedMutex> = $.varRef(new embeddedMutex(true))
	await embedded.value.Mutex.Lock()
	embedded.value.value = 7
	embedded.value.Mutex.Unlock()
	await $.println("Embedded Mutex value:", embedded.value.value)

	let embeddedRW: $.VarRef<embeddedRWMutex> = $.varRef(new embeddedRWMutex(true))
	await embeddedRW.value.RWMutex.RLock()
	await $.println("Embedded RWMutex read lock")
	embeddedRW.value.RWMutex.RUnlock()
	await embeddedRW.value.RWMutex.Lock()
	embeddedRW.value.value = 9
	embeddedRW.value.RWMutex.Unlock()
	await $.println("Embedded RWMutex value:", embeddedRW.value.value)

	// Test TryLock
	if (mu.value.TryLock()) {
		await $.println("TryLock succeeded")
		mu.value.Unlock()
	} else {
		await $.println("TryLock failed")
	}

	// Test WaitGroup
	let wg = $.varRef($.markAsStructValue(new sync.WaitGroup()))
	wg.value.Add(1)
	await $.println("WaitGroup counter set to 1")
	wg.value.Done()
	await $.println("WaitGroup counter decremented")
	await wg.value.Wait()
	await $.println("WaitGroup wait completed")

	// Test Once
	let once = $.varRef($.markAsStructValue(new sync.Once()))
	let counter = 0
	await once.value.Do($.functionValue(async () => {
		counter++
		await $.println("Once function executed, counter:", counter)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await once.value.Do($.functionValue(async () => {
		counter++
		await $.println("This should not execute")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await $.println("Final counter:", counter)

	// Test OnceFunc
	let onceFunc: (() => void) | null = sync.OnceFunc($.functionValue(async () => {
		await $.println("OnceFunc executed")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	void (__goscriptAwait = onceFunc!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	void (__goscriptAwait = onceFunc!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)

	// Test OnceValue
	let onceValue: (() => number | globalThis.Promise<number>) | null = (sync.OnceValue($.functionValue(async (): globalThis.Promise<number> => {
		await $.println("OnceValue function executed")
		return 42
	}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))) as (() => number | globalThis.Promise<number>) | null)
	let val1 = (__goscriptAwait = onceValue!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	let val2 = (__goscriptAwait = onceValue!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	await $.println("OnceValue results:", val1, val2)

	// Test sync.Map
	let m = $.varRef($.markAsStructValue(new sync.Map()))
	m.value.Store("key1", "value1")
	await $.println("Stored key1")

	{
		let [val, ok] = m.value.Load("key1")
		if (ok) {
			await $.println("Loaded key1:", val)
		}
	}

	{
		let [val, loaded] = m.value.LoadOrStore("key2", "value2")
		if (!loaded) {
			await $.println("Stored key2:", val)
		}
	}

	{
		let [val, loaded] = m.value.Swap("key2", "value3")
		if (loaded) {
			await $.println("Swapped key2 previous:", val)
		}
	}
	{
		let [val, ok] = m.value.Load("key2")
		if (ok) {
			await $.println("Loaded key2 after swap:", val)
		}
	}
	if (!m.value.CompareAndDelete("key2", "other")) {
		await $.println("CompareAndDelete mismatch preserved key2")
	}
	if (m.value.CompareAndDelete("key2", "value3")) {
		await $.println("CompareAndDelete removed key2")
	}
	{
		let [, ok] = m.value.Load("key2")
		if (!ok) {
			await $.println("key2 compare deleted successfully")
		}
	}

	await m.value.Range($.functionValue(async (key: any, value: any): globalThis.Promise<boolean> => {
		await $.println("Range:", key, "->", value)
		return true
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)))

	m.value.Delete("key1")
	{
		let [, ok] = m.value.Load("key1")
		if (!ok) {
			await $.println("key1 deleted successfully")
		}
	}

	// Test Pool
	let pool = new sync.Pool({New: $.functionValue(async (): globalThis.Promise<any> => {
		await $.println("Pool creating new object")
		return "new object"
	}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))})

	let obj1 = await (pool !== null && (pool as any).__isVarRef !== true && (pool as any).__goValue === undefined ? ((pool as any) as sync.Pool).Get() : sync.Pool.prototype.Get.call($.pointerValue<sync.Pool>(pool)))
	await $.println("Got from pool:", obj1)
	void (pool !== null && (pool as any).__isVarRef !== true && (pool as any).__goValue === undefined ? ((pool as any) as sync.Pool).Put("reused object") : sync.Pool.prototype.Put.call($.pointerValue<sync.Pool>(pool), "reused object"))
	let obj2 = await (pool !== null && (pool as any).__isVarRef !== true && (pool as any).__goValue === undefined ? ((pool as any) as sync.Pool).Get() : sync.Pool.prototype.Get.call($.pointerValue<sync.Pool>(pool)))
	await $.println("Got from pool:", obj2)

	await condZeroValue()

	await $.println("test finished")
}

export async function condZeroValue(): globalThis.Promise<void> {
	let zero = $.markAsStructValue(new sync.Cond())
	await $.println("zero L is nil:", zero.L == null)

	// The consumer starts first and each push waits for its pop to print,
	// so that the consumer waits on the Cond for every value.
	let q = new queue()
	let started = $.makeChannel<boolean>(0, false, "both")
	let results = $.makeChannel<number>(0, 0, "both")
	$.go(async () => {
		await $.chanSend(started, true)
		for (let __rangeIndex = 0; __rangeIndex < 3; __rangeIndex++) {
			await $.chanSend(results, await (q !== null && (q as any).__isVarRef !== true && (q as any).__goValue === undefined ? ((q as any) as queue).pop() : queue.prototype.pop.call(q)))
		}
	})
	await $.chanRecv(started)
	for (let i = 1; i <= 3; i++) {
		await (q !== null && (q as any).__isVarRef !== true && (q as any).__goValue === undefined ? ((q as any) as queue).push(i * 10) : queue.prototype.push.call(q, i * 10))
		await $.println("got:", await $.chanRecv(results))
	}

	let c = sync.NewCond($.pointerValueOrNil($.interfaceValue<sync.Locker | null>(new sync.Mutex(), "*sync.Mutex", __goscriptStatic0()))!)
	await $.println("NewCond L is nil:", $.pointerValue<sync.Cond>(c).L == null)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("sync.Mutex"), "sync.Mutex", () => [$.methodSignature("Lock", [], [], true), $.methodSignature("TryLock", [], [/* @__PURE__ */ $.basicType("bool")], true), $.methodSignature("Unlock", [], [], true)]))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

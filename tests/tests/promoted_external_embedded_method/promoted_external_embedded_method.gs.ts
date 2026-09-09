// Generated file based on promoted_external_embedded_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/sync/index.js"

export type runner = {
	Run(): string
}

$.registerInterfaceType(
	"main.runner",
	null,
	[{ name: "Run", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export class raw {
	public declare Mutex: sync.Mutex

	public _fields: {
		Mutex: sync.Mutex
	}

	constructor(init?: Partial<{Mutex?: sync.Mutex}>) {
		this._fields = {
			Mutex: init?.Mutex ? $.markAsStructValue($.cloneStructValue(init.Mutex)) : $.markAsStructValue(new sync.Mutex())
		}
	}

	public clone(): raw {
		return $.markAsStructValue(new raw(this))
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

	static {
		$.bindStructFields(this.prototype, ["Mutex"])
	}

	static __typeInfo = $.registerStructType(
		"main.raw",
		() => new raw(),
		() => [{ name: "Lock", args: [], returns: [] }, { name: "TryLock", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Unlock", args: [], returns: [] }],
		raw,
		() => [{ name: "Mutex", key: "Mutex", type: "sync.Mutex", anonymous: true }]
	)
}

export class outer {
	public declare raw: raw

	public _fields: {
		raw: raw
	}

	constructor(init?: Partial<{raw?: raw}>) {
		this._fields = {
			raw: init?.raw ? $.markAsStructValue($.cloneStructValue(init.raw)) : $.markAsStructValue(new raw())
		}
	}

	public clone(): outer {
		return $.markAsStructValue(new outer(this))
	}

	public Lock(): any {
		return $.pointerValue<raw>(this.raw).Mutex.Lock()
	}

	public TryLock(): any {
		return $.pointerValue<raw>(this.raw).Mutex.TryLock()
	}

	public Unlock(): any {
		return $.pointerValue<raw>(this.raw).Mutex.Unlock()
	}

	static {
		$.bindStructFields(this.prototype, ["raw"])
	}

	static __typeInfo = $.registerStructType(
		"main.outer",
		() => new outer(),
		() => [{ name: "Lock", args: [], returns: [] }, { name: "TryLock", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Unlock", args: [], returns: [] }],
		outer,
		() => [{ name: "raw", key: "raw", type: "main.raw", anonymous: true }]
	)
}

export class rawRW {
	public declare RWMutex: sync.RWMutex

	public _fields: {
		RWMutex: sync.RWMutex
	}

	constructor(init?: Partial<{RWMutex?: sync.RWMutex}>) {
		this._fields = {
			RWMutex: init?.RWMutex ? $.markAsStructValue($.cloneStructValue(init.RWMutex)) : $.markAsStructValue(new sync.RWMutex())
		}
	}

	public clone(): rawRW {
		return $.markAsStructValue(new rawRW(this))
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

	static {
		$.bindStructFields(this.prototype, ["RWMutex"])
	}

	static __typeInfo = $.registerStructType(
		"main.rawRW",
		() => new rawRW(),
		() => [{ name: "Lock", args: [], returns: [] }, { name: "RLock", args: [], returns: [] }, { name: "RLocker", args: [], returns: [{ type: "sync.Locker" }] }, { name: "RUnlock", args: [], returns: [] }, { name: "TryLock", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "TryRLock", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Unlock", args: [], returns: [] }],
		rawRW,
		() => [{ name: "RWMutex", key: "RWMutex", type: "sync.RWMutex", anonymous: true }]
	)
}

export class outerRW {
	public declare rawRW: rawRW

	public _fields: {
		rawRW: rawRW
	}

	constructor(init?: Partial<{rawRW?: rawRW}>) {
		this._fields = {
			rawRW: init?.rawRW ? $.markAsStructValue($.cloneStructValue(init.rawRW)) : $.markAsStructValue(new rawRW())
		}
	}

	public clone(): outerRW {
		return $.markAsStructValue(new outerRW(this))
	}

	public Lock(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.Lock()
	}

	public RLock(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.RLock()
	}

	public RLocker(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.RLocker()
	}

	public RUnlock(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.RUnlock()
	}

	public TryLock(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.TryLock()
	}

	public TryRLock(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.TryRLock()
	}

	public Unlock(): any {
		return $.pointerValue<rawRW>(this.rawRW).RWMutex.Unlock()
	}

	static {
		$.bindStructFields(this.prototype, ["rawRW"])
	}

	static __typeInfo = $.registerStructType(
		"main.outerRW",
		() => new outerRW(),
		() => [{ name: "Lock", args: [], returns: [] }, { name: "RLock", args: [], returns: [] }, { name: "RLocker", args: [], returns: [{ type: "sync.Locker" }] }, { name: "RUnlock", args: [], returns: [] }, { name: "TryLock", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "TryRLock", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Unlock", args: [], returns: [] }],
		outerRW,
		() => [{ name: "rawRW", key: "rawRW", type: "main.rawRW", anonymous: true }]
	)
}

export class rawRunner {
	public declare runner: runner | null

	public _fields: {
		runner: runner | null
	}

	constructor(init?: Partial<{runner?: runner | null}>) {
		this._fields = {
			runner: init?.runner ?? (null! as runner | null)
		}
	}

	public clone(): rawRunner {
		return $.markAsStructValue(new rawRunner(this))
	}

	public Run(): any {
		return $.pointerValue<Exclude<runner | null, null>>(this.runner).Run()
	}

	static {
		$.bindStructFields(this.prototype, ["runner"])
	}

	static __typeInfo = $.registerStructType(
		"main.rawRunner",
		() => new rawRunner(),
		() => [{ name: "Run", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		rawRunner,
		() => [{ name: "runner", key: "runner", type: "main.runner", anonymous: true }]
	)
}

export class outerRunner {
	public declare rawRunner: rawRunner

	public _fields: {
		rawRunner: rawRunner
	}

	constructor(init?: Partial<{rawRunner?: rawRunner}>) {
		this._fields = {
			rawRunner: init?.rawRunner ? $.markAsStructValue($.cloneStructValue(init.rawRunner)) : $.markAsStructValue(new rawRunner())
		}
	}

	public clone(): outerRunner {
		return $.markAsStructValue(new outerRunner(this))
	}

	public Run(): any {
		return $.pointerValue<any>($.pointerValue<rawRunner>(this.rawRunner).runner).Run()
	}

	static {
		$.bindStructFields(this.prototype, ["rawRunner"])
	}

	static __typeInfo = $.registerStructType(
		"main.outerRunner",
		() => new outerRunner(),
		() => [{ name: "Run", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		outerRunner,
		() => [{ name: "rawRunner", key: "rawRunner", type: "main.rawRunner", anonymous: true }]
	)
}

export class runnable {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): runnable {
		return $.markAsStructValue(new runnable(this))
	}

	public Run(): string {
		return "runner"
	}

	static __typeInfo = $.registerStructType(
		"main.runnable",
		() => new runnable(),
		() => [{ name: "Run", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		runnable,
		() => []
	)
}

export async function main(): globalThis.Promise<void> {
	let o: $.VarRef<outer> = $.varRef($.markAsStructValue(new outer()))
	await o.value.raw.Mutex.Lock()
	o.value.raw.Mutex.Unlock()

	let rw: $.VarRef<outerRW> = $.varRef($.markAsStructValue(new outerRW()))
	await rw.value.rawRW.RWMutex.RLock()
	rw.value.rawRW.RWMutex.RUnlock()
	let locker = rw.value.rawRW.RWMutex.RLocker()
	await $.pointerValue<Exclude<sync.Locker, null>>(locker).Lock()
	await $.pointerValue<Exclude<sync.Locker, null>>(locker).Unlock()

	let or = $.markAsStructValue(new outerRunner({rawRunner: $.markAsStructValue(new rawRunner({runner: $.interfaceValue<runner | null>($.markAsStructValue(new runnable()), "main.runnable", "main.runnable")}))}))
	await $.println($.pointerValue<Exclude<runner, null>>(or.rawRunner.runner).Run())
	await $.println("ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}

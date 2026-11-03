// Generated file based on shadowed_struct_varref_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as sync from "@goscript/sync/index.js"

export class table {
	public declare Mutex: sync.Mutex

	public declare byAddr: globalThis.Map<string, $.Slice<string>> | null

	constructor(__goscriptValue?: boolean, Mutex$?: sync.Mutex, byAddr$?: globalThis.Map<string, $.Slice<string>> | null) {
		this.Mutex = Mutex$ ?? $.markAsStructValue(new sync.Mutex())
		this.byAddr = byAddr$ ?? (null! as globalThis.Map<string, $.Slice<string>> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): table {
		return new table(true, $.markAsStructValue($.cloneStructValue(this.Mutex)), this.byAddr)
	}

	public __goscriptAssign(source: table): this {
		$.assignStruct(this.Mutex, source.Mutex)
		this.byAddr = source.byAddr
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
		"main.table",
		() => new table(),
		() => [{ name: "Lock", args: [], returns: [], pointerReceiver: true }, { name: "TryLock", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Unlock", args: [], returns: [], pointerReceiver: true }],
		table,
		() => [{ name: "Mutex", key: "Mutex", type: "sync.Mutex", anonymous: true }, { name: "byAddr", key: "byAddr", type: /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))) }]
	)
}

export let hosts: $.VarRef<{"Mutex": sync.Mutex, "byAddr": globalThis.Map<string, $.Slice<string>> | null}> = $.varRef($.anonymousStructValue({"Mutex": $.markAsStructValue(new sync.Mutex()), "byAddr": null}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Mutex", "sync.Mutex", [0], 0, true, { anonymous: true }), /* @__PURE__ */ $.structField("byAddr", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))), [1], 8, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/shadowed_struct_varref_field" })] }))

export function __goscript_set_hosts(__goscriptValue: {"Mutex": sync.Mutex, "byAddr": globalThis.Map<string, $.Slice<string>> | null}): void {
	$.assignStruct(hosts.value, __goscriptValue)
}

export let named: $.VarRef<table> = $.varRef(new table(true))

export function __goscript_set_named(__goscriptValue: table): void {
	$.assignStruct(named.value, __goscriptValue)
}

export function lookup(addr: string): $.Slice<string> {
	using __defer = new $.DisposableStack()
	hosts.value.Mutex.Lock()
	const __goscriptDeferCallee0 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as sync.Mutex).Unlock() : sync.Mutex.prototype.Unlock.call($.pointerValue<sync.Mutex>(__receiver))))($.fieldRef(hosts.value, "Mutex")), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "sync.(*Mutex).Unlock-fm")
	__defer.defer(() => { __goscriptDeferCallee0() })
	if ($.len(hosts.value.byAddr) != 0) {
		let __goscriptShadow0 = hosts.value
		{
			let __goscriptTuple0: any = $.mapGet<string, $.Slice<string>, $.Slice<string>>(__goscriptShadow0.byAddr, addr, null)
			let __goscriptShadow1: $.Slice<string> = __goscriptTuple0[0]
			let ok: boolean = __goscriptTuple0[1]
			if (ok) {
				return __goscriptShadow1
			}
		}
	}
	return null
}

export function lookupNamed(addr: string): $.Slice<string> {
	using __defer = new $.DisposableStack()
	named.value.Mutex.Lock()
	const __goscriptDeferCallee1 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as sync.Mutex).Unlock() : sync.Mutex.prototype.Unlock.call($.pointerValue<sync.Mutex>(__receiver))))($.fieldRef(named.value, "Mutex")), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "sync.(*Mutex).Unlock-fm")
	__defer.defer(() => { __goscriptDeferCallee1() })
	if ($.len(named.value.byAddr) != 0) {
		let __goscriptShadow2 = named.value
		{
			let __goscriptTuple1: any = $.mapGet<string, $.Slice<string>, $.Slice<string>>(__goscriptShadow2.byAddr, addr, null)
			let __goscriptShadow3: $.Slice<string> = __goscriptTuple1[0]
			let ok: boolean = __goscriptTuple1[1]
			if (ok) {
				return __goscriptShadow3
			}
		}
	}
	return null
}

export function lookupLocal(addr: string): $.Slice<string> {
	using __defer = new $.DisposableStack()
	let local: $.VarRef<table> = $.varRef(new table(true))
	local.value.byAddr = $.makeMap<string, $.Slice<string>>([[addr, $.arrayToSlice<string>(["local"])]])
	let ptr = local
	$.pointerValue<table>(ptr).Mutex.Lock()
	const __goscriptDeferCallee2 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as sync.Mutex).Unlock() : sync.Mutex.prototype.Unlock.call($.pointerValue<sync.Mutex>(__receiver))))($.fieldRef($.pointerValue<table>(ptr), "Mutex")), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "sync.(*Mutex).Unlock-fm")
	__defer.defer(() => { __goscriptDeferCallee2() })
	let __goscriptShadow4 = local.value
	{
		let __goscriptTuple2: any = $.mapGet<string, $.Slice<string>, $.Slice<string>>(__goscriptShadow4.byAddr, addr, null)
		let __goscriptShadow5: $.Slice<string> = __goscriptTuple2[0]
		let ok: boolean = __goscriptTuple2[1]
		if (ok) {
			return __goscriptShadow5
		}
	}
	return null
}

export async function main(): globalThis.Promise<void> {
	await $.println($.plainSliceIndex(lookupLocal("127.0.0.1")!, 0))
	hosts.value.byAddr = $.makeMap<string, $.Slice<string>>([["127.0.0.1", $.arrayToSlice<string>(["localhost"])]])
	named.value.byAddr = hosts.value.byAddr
	await $.println($.plainSliceIndex(lookup("127.0.0.1")!, 0))
	await $.println($.plainSliceIndex(lookupNamed("127.0.0.1")!, 0))
	await $.println($.sliceLen(lookup("::1")))
}

if ($.isMainScript(import.meta)) {
	await main()
}

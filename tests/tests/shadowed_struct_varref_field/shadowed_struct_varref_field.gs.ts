// Generated file based on shadowed_struct_varref_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/sync/index.js"

export class table {
	public declare Mutex: sync.Mutex

	public declare byAddr: globalThis.Map<string, $.Slice<string>> | null

	public _fields: {
		Mutex: sync.Mutex
		byAddr: globalThis.Map<string, $.Slice<string>> | null
	}

	constructor(init?: Partial<{Mutex?: sync.Mutex, byAddr?: globalThis.Map<string, $.Slice<string>> | null}>) {
		this._fields = {
			Mutex: init?.Mutex ? $.markAsStructValue($.cloneStructValue(init.Mutex)) : $.markAsStructValue(new sync.Mutex()),
			byAddr: init?.byAddr ?? (null! as globalThis.Map<string, $.Slice<string>> | null)
		}
	}

	public clone(): table {
		return $.markAsStructValue(new table(this))
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
		$.bindStructFields(this.prototype, ["Mutex", "byAddr"])
	}

	static __typeInfo = $.registerStructType(
		"main.table",
		() => new table(),
		() => [{ name: "Lock", args: [], returns: [] }, { name: "TryLock", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Unlock", args: [], returns: [] }],
		table,
		() => [{ name: "Mutex", key: "Mutex", type: "sync.Mutex", anonymous: true }, { name: "byAddr", key: "byAddr", type: /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))) }]
	)
}

export let hosts: $.VarRef<{"Mutex": sync.Mutex, "byAddr": globalThis.Map<string, $.Slice<string>> | null}> = $.varRef($.anonymousStructValue({"Mutex": $.markAsStructValue(new sync.Mutex()), "byAddr": null}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Mutex", "sync.Mutex", [0], 0, true, { anonymous: true }), /* @__PURE__ */ $.structField("byAddr", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))), [1], 8, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/shadowed_struct_varref_field" })] }))

export function __goscript_set_hosts(__goscriptValue: {"Mutex": sync.Mutex, "byAddr": globalThis.Map<string, $.Slice<string>> | null}): void {
	$.assignStruct(hosts.value, __goscriptValue)
}

export let named: $.VarRef<table> = $.varRef($.markAsStructValue(new table()))

export function __goscript_set_named(__goscriptValue: table): void {
	$.assignStruct(named.value, __goscriptValue)
}

export async function lookup(addr: string): globalThis.Promise<$.Slice<string>> {
	using __defer = new $.DisposableStack()
	await hosts.value.Mutex.Lock()
	__defer.defer(() => { hosts.value.Mutex.Unlock() })
	if ($.len(hosts.value.byAddr) != 0) {
		let __goscriptShadow0 = hosts.value
		{
			let __goscriptTuple0: any = $.mapGet<string, $.Slice<string>, $.Slice<string>>(__goscriptShadow0.byAddr, addr, null)
			let __goscriptShadow1: $.Slice<string> = __goscriptTuple0[0]
			let ok = __goscriptTuple0[1]
			if (ok) {
				return __goscriptShadow1
			}
		}
	}
	return null
}

export async function lookupNamed(addr: string): globalThis.Promise<$.Slice<string>> {
	using __defer = new $.DisposableStack()
	await named.value.Mutex.Lock()
	__defer.defer(() => { named.value.Mutex.Unlock() })
	if ($.len(named.value.byAddr) != 0) {
		let __goscriptShadow2 = named.value
		{
			let __goscriptTuple1: any = $.mapGet<string, $.Slice<string>, $.Slice<string>>(__goscriptShadow2.byAddr, addr, null)
			let __goscriptShadow3: $.Slice<string> = __goscriptTuple1[0]
			let ok = __goscriptTuple1[1]
			if (ok) {
				return __goscriptShadow3
			}
		}
	}
	return null
}

export async function lookupLocal(addr: string): globalThis.Promise<$.Slice<string>> {
	using __defer = new $.DisposableStack()
	let local: $.VarRef<table> = $.varRef($.markAsStructValue(new table()))
	local.value.byAddr = $.makeMap<string, $.Slice<string>>([[addr, $.arrayToSlice<string>(["local"])]])
	let ptr: table | $.VarRef<table> | null = local
	await $.pointerValue<table>(ptr).Mutex.Lock()
	__defer.defer(() => { $.pointerValue<table>(ptr).Mutex.Unlock() })
	let __goscriptShadow4 = local.value
	{
		let __goscriptTuple2: any = $.mapGet<string, $.Slice<string>, $.Slice<string>>(__goscriptShadow4.byAddr, addr, null)
		let __goscriptShadow5: $.Slice<string> = __goscriptTuple2[0]
		let ok = __goscriptTuple2[1]
		if (ok) {
			return __goscriptShadow5
		}
	}
	return null
}

export async function main(): globalThis.Promise<void> {
	await $.println($.arrayIndex((await lookupLocal("127.0.0.1"))!, 0))
	hosts.value.byAddr = $.makeMap<string, $.Slice<string>>([["127.0.0.1", $.arrayToSlice<string>(["localhost"])]])
	named.value.byAddr = hosts.value.byAddr
	await $.println($.arrayIndex((await lookup("127.0.0.1"))!, 0))
	await $.println($.arrayIndex((await lookupNamed("127.0.0.1"))!, 0))
	await $.println($.len(await lookup("::1")))
}

if ($.isMainScript(import.meta)) {
	await main()
}

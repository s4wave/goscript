// Generated file based on cache.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as sync from "@goscript/sync/index.js"

import * as weak from "@goscript/weak/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/runtime/index.js"
import "@goscript/sync/index.js"
import "@goscript/weak/index.js"

export class weakCertCache {
	public get Map(): sync.Map {
		return this._fields.Map.value
	}
	public set Map(value: sync.Map) {
		this._fields.Map.value = value
	}

	public _fields: {
		Map: $.VarRef<sync.Map>
	}

	constructor(init?: Partial<{Map?: sync.Map}>) {
		this._fields = {
			Map: $.varRef(init?.Map ? $.markAsStructValue($.cloneStructValue(init.Map)) : $.markAsStructValue(new sync.Map()))
		}
	}

	public clone(): weakCertCache {
		const cloned = new weakCertCache()
		cloned._fields = {
			Map: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Map.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async newCert(der: $.Slice<number>): globalThis.Promise<[x509.Certificate | $.VarRef<x509.Certificate> | null, $.GoError]> {
		const wcc: weakCertCache | $.VarRef<weakCertCache> | null = this
		{
			let [entry, ok] = await $.pointerValue<weakCertCache>(wcc).Map.Load($.bytesToString(der))
			if (ok) {
				{
					let v: x509.Certificate | $.VarRef<x509.Certificate> | null = ($.markAsStructValue($.cloneStructValue($.mustTypeAssert<weak.Pointer>(entry, "weak.Pointer"))).Value() as x509.Certificate | $.VarRef<x509.Certificate> | null)
					if (v != null) {
						return [v, null]
					}
				}
			}
		}

		let __goscriptTuple0: any = await x509.ParseCertificate(der)
		let cert: x509.Certificate | $.VarRef<x509.Certificate> | null = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}

		let wp = ($.markAsStructValue($.cloneStructValue(weak.Make({T: { type: "x509.Certificate", zero: () => $.markAsStructValue(new x509.Certificate()) }}, cert))) as weak.Pointer)
		{
			let [entry, loaded] = await $.pointerValue<weakCertCache>(wcc).Map.LoadOrStore($.bytesToString(der), $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(wp)), "weak.Pointer[x509.Certificate]", "weak.Pointer"))
			if (!loaded) {
				runtime.AddCleanup(cert, $.functionValue(async (_p0: any): globalThis.Promise<void> => {
					await $.pointerValue<weakCertCache>(wcc).Map.CompareAndDelete($.bytesToString(der), entry)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }], results: [] } as $.FunctionTypeInfo)), $.bytesToString(der))
			} else {
				{
					let v: x509.Certificate | $.VarRef<x509.Certificate> | null = ($.markAsStructValue($.cloneStructValue($.mustTypeAssert<weak.Pointer>(entry, "weak.Pointer"))).Value() as x509.Certificate | $.VarRef<x509.Certificate> | null)
					if (v != null) {
						return [v, null]
					} else {
						if ($.pointerValue<weakCertCache>(wcc).Map.CompareAndSwap($.bytesToString(der), entry, $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(wp)), "weak.Pointer[x509.Certificate]", "weak.Pointer"))) {
							runtime.AddCleanup(cert, $.functionValue(async (_p0: any): globalThis.Promise<void> => {
								await $.pointerValue<weakCertCache>(wcc).Map.CompareAndDelete($.bytesToString(der), $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(wp)), "weak.Pointer[x509.Certificate]", "weak.Pointer"))
							}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }], results: [] } as $.FunctionTypeInfo)), $.bytesToString(der))
						}
					}
				}
			}
		}
		return [cert, null]
	}

	public Clear(): any {
		return $.pointerValue<sync.Map>(this.Map).Clear()
	}

	public CompareAndDelete(key: any, old: any): any {
		return $.pointerValue<sync.Map>(this.Map).CompareAndDelete(key, old)
	}

	public CompareAndSwap(key: any, old: any, _new: any): any {
		return $.pointerValue<sync.Map>(this.Map).CompareAndSwap(key, old, _new)
	}

	public Delete(key: any): any {
		return $.pointerValue<sync.Map>(this.Map).Delete(key)
	}

	public Load(key: any): any {
		return $.pointerValue<sync.Map>(this.Map).Load(key)
	}

	public LoadAndDelete(key: any): any {
		return $.pointerValue<sync.Map>(this.Map).LoadAndDelete(key)
	}

	public LoadOrStore(key: any, value: any): any {
		return $.pointerValue<sync.Map>(this.Map).LoadOrStore(key, value)
	}

	public Range(f: any): any {
		return $.pointerValue<sync.Map>(this.Map).Range(f)
	}

	public Store(key: any, value: any): any {
		return $.pointerValue<sync.Map>(this.Map).Store(key, value)
	}

	public Swap(key: any, value: any): any {
		return $.pointerValue<sync.Map>(this.Map).Swap(key, value)
	}

	static __typeInfo = $.registerStructType(
		"tls.weakCertCache",
		() => new weakCertCache(),
		[{ name: "newCert", args: [{ name: "der", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }, { name: "_r1", type: "error" }] }, { name: "Clear", args: [], returns: [] }, { name: "CompareAndDelete", args: [{ name: "key", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "old", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "deleted", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "CompareAndSwap", args: [{ name: "key", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "old", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "new", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "swapped", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Delete", args: [{ name: "key", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [] }, { name: "Load", args: [{ name: "key", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "value", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "ok", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "LoadAndDelete", args: [{ name: "key", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "value", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "loaded", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "LoadOrStore", args: [{ name: "key", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "value", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "actual", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "loaded", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Range", args: [{ name: "f", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo) }], returns: [] }, { name: "Store", args: [{ name: "key", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "value", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [] }, { name: "Swap", args: [{ name: "key", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "value", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "previous", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "loaded", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		weakCertCache,
		[{ name: "Map", key: "Map", type: "sync.Map", anonymous: true, index: [0], offset: 0, exported: true }]
	)
}

export let globalCertCache: weakCertCache | $.VarRef<weakCertCache> | null = new weakCertCache()

export function __goscript_set_globalCertCache(__goscriptValue: weakCertCache | $.VarRef<weakCertCache> | null): void {
	globalCertCache = __goscriptValue
}

// Generated file based on cache.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as sync from "@goscript/sync/index.js"

import * as weak from "@goscript/weak/index.js"
import "@goscript/runtime/index.js"
import "@goscript/sync/index.js"
import "@goscript/weak/index.js"

export class Cache {
	public get m(): sync.Map {
		return this._fields.m.value
	}
	public set m(value: sync.Map) {
		this._fields.m.value = value
	}

	public _fields: {
		m: $.VarRef<sync.Map>
	}

	constructor(init?: Partial<{m?: sync.Map}>) {
		this._fields = {
			m: $.varRef(init?.m ? $.markAsStructValue($.cloneStructValue(init.m)) : $.markAsStructValue(new sync.Map()))
		}
	}

	public clone(): Cache {
		const cloned = new Cache()
		cloned._fields = {
			m: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.m.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Get(__typeArgs: $.GenericTypeArgs | undefined, k: any, _new: (() => [any, $.GoError] | globalThis.Promise<[any, $.GoError]>) | null, check: ((_p0: any) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<[any, $.GoError]> {
		const c: Cache | $.VarRef<Cache> | null = this
		let p = ($.markAsStructValue($.cloneStructValue(weak.Make({[$.genericTypeArgsMarker]: true, T: __typeArgs?.["K"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, k))) as weak.Pointer)
		{
			let [cached, ok] = await $.pointerValue<Cache>(c).m.Load($.namedValueInterfaceValue<any>($.markAsStructValue($.cloneStructValue(p)), "weak.Pointer", {Value: (receiver: any, ...args: any[]) => receiver.Value({[$.genericTypeArgsMarker]: true, T: __typeArgs?.["K"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ...$.stripGenericTypeArgs(args))}, "weak.Pointer", [{ name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } } }] }]))
			if (ok) {
				let v = $.mustTypeAssert<any>(cached, { kind: $.TypeKind.Pointer, elemType: __typeArgs?.["V"]?.type ?? { kind: $.TypeKind.Interface, methods: [] } })
				if (await check!(v)) {
					return [v, null]
				}
			}
		}
		let [v, err] = await _new!()
		if (err != null) {
			return [null, err]
		}
		{
			let [, present] = await $.pointerValue<Cache>(c).m.Swap($.namedValueInterfaceValue<any>($.markAsStructValue($.cloneStructValue(p)), "weak.Pointer", {Value: (receiver: any, ...args: any[]) => receiver.Value({[$.genericTypeArgsMarker]: true, T: __typeArgs?.["K"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ...$.stripGenericTypeArgs(args))}, "weak.Pointer", [{ name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } } }] }]), $.interfaceValue<any>(v, "*V", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } }))
			if (!present) {
				runtime.AddCleanup(k, $.functionValue(((__receiver) => (p: weak.Pointer) => __receiver.evict({[$.genericTypeArgsMarker]: true, K: __typeArgs?.["K"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }, V: __typeArgs?.["V"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, p))($.pointerValue<Cache>(c)), ({ kind: $.TypeKind.Function, params: ["weak.Pointer"], results: [] } as $.FunctionTypeInfo)), $.markAsStructValue($.cloneStructValue(p)))
			}
		}
		return [v, null]
	}

	public async evict(__typeArgs: $.GenericTypeArgs | undefined, p: weak.Pointer): globalThis.Promise<void> {
		const c: Cache | $.VarRef<Cache> | null = this
		await $.pointerValue<Cache>(c).m.Delete($.namedValueInterfaceValue<any>($.markAsStructValue($.cloneStructValue(p)), "weak.Pointer", {Value: (receiver: any, ...args: any[]) => receiver.Value({[$.genericTypeArgsMarker]: true, T: __typeArgs?.["K"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ...$.stripGenericTypeArgs(args))}, "weak.Pointer", [{ name: "Value", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } } }] }]))
	}

	static __typeInfo = $.registerStructType(
		"fips140cache.Cache",
		() => new Cache(),
		[{ name: "Get", args: [{ name: "k", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } } }, { name: "new", type: ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } }, "error"] } as $.FunctionTypeInfo) }, { name: "check", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo) }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } } }, { name: "_r1", type: "error" }] }, { name: "evict", args: [{ name: "p", type: "weak.Pointer" }], returns: [] }],
		Cache,
		[{ name: "m", key: "m", type: "sync.Map", pkgPath: "crypto/internal/fips140cache", index: [0], offset: 0, exported: false }]
	)
}

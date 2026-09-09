// Generated file based on generic_cache_pointer_callbacks.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class cache {
	public declare stored: any

	public _fields: {
		stored: any
	}

	constructor(init?: Partial<{stored?: any}>) {
		this._fields = {
			stored: init?.stored ?? (null! as any)
		}
	}

	public clone(): cache {
		return $.markAsStructValue(new cache(this))
	}

	public async Get(__typeArgs: $.GenericTypeArgs | undefined, k: any, _new: (() => [any, $.GoError] | globalThis.Promise<[any, $.GoError]>) | null, check: ((_p0: any) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<[any, $.GoError]> {
		let c: cache | $.VarRef<cache> | null = this
		if (($.pointerValue<cache>(c).stored != null) && await check!($.pointerValue<cache>(c).stored)) {
			return [$.pointerValue<cache>(c).stored, null]
		}
		let [v, err] = await _new!()
		if (err != null) {
			return [null, err]
		}
		$.pointerValue<cache>(c).stored = v
		return [v, null]
	}

	static {
		$.bindStructFields(this.prototype, ["stored"])
	}

	static __typeInfo = $.registerStructType(
		"main.cache",
		() => new cache(),
		() => [{ name: "Get", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Interface, methods: [] }) }, { type: "error" }] }],
		cache,
		() => [{ name: "stored", key: "stored", type: /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Interface, methods: [] }) }]
	)
}

export class key {
	public declare N: number

	public _fields: {
		N: number
	}

	constructor(init?: Partial<{N?: number}>) {
		this._fields = {
			N: init?.N ?? (0 as number)
		}
	}

	public clone(): key {
		return $.markAsStructValue(new key(this))
	}

	static {
		$.bindStructFields(this.prototype, ["N"])
	}

	static __typeInfo = $.registerStructType(
		"main.key",
		() => new key(),
		() => [],
		key,
		() => [{ name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class privateKey {
	public declare D: number

	public _fields: {
		D: number
	}

	constructor(init?: Partial<{D?: number}>) {
		this._fields = {
			D: init?.D ?? (0 as number)
		}
	}

	public clone(): privateKey {
		return $.markAsStructValue(new privateKey(this))
	}

	static {
		$.bindStructFields(this.prototype, ["D"])
	}

	static __typeInfo = $.registerStructType(
		"main.privateKey",
		() => new privateKey(),
		() => [],
		privateKey,
		() => [{ name: "D", key: "D", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export let privateKeyCache: $.VarRef<cache> = $.varRef($.markAsStructValue(new cache()))

export function __goscript_set_privateKeyCache(__goscriptValue: cache): void {
	$.assignStruct(privateKeyCache.value, __goscriptValue)
}

export async function privateKeyToCache(k: key | $.VarRef<key> | null): globalThis.Promise<[privateKey | $.VarRef<privateKey> | null, $.GoError]> {
	const __goscriptReturn0 = await privateKeyCache.value.Get({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, K: { type: "main.key", zero: () => $.markAsStructValue(new key()) }, V: { type: "main.privateKey", zero: () => $.markAsStructValue(new privateKey()) }}, k, $.functionValue((): [privateKey | $.VarRef<privateKey> | null, $.GoError] => {
		return [new privateKey({D: $.pointerValue<key>(k).N}), null]
	}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.pointerType("main.privateKey"), "error"] } as $.FunctionTypeInfo)), $.functionValue((v: privateKey | $.VarRef<privateKey> | null): boolean => {
		return $.pointerValue<privateKey>(v).D == $.pointerValue<key>(k).N
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.privateKey")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)))
	return [(__goscriptReturn0[0] as privateKey | $.VarRef<privateKey> | null), __goscriptReturn0[1]]
	throw new globalThis.Error("goscript: unreachable return")
}

export async function main(): globalThis.Promise<void> {
	let k: key | $.VarRef<key> | null = new key({N: 7})
	let __goscriptTuple0: any = await privateKeyToCache(k)
	let v: privateKey | $.VarRef<privateKey> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		$.panic((err as any))
	}
	await $.println("cached:", $.pointerValue<privateKey>(v).D)
}

if ($.isMainScript(import.meta)) {
	await main()
}

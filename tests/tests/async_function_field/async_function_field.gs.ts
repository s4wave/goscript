// Generated file based on async_function_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/sync/index.js"

export class loader {
	public declare load: ((_p0: string) => [any, boolean] | globalThis.Promise<[any, boolean]>) | null

	public _fields: {
		load: ((_p0: string) => [any, boolean] | globalThis.Promise<[any, boolean]>) | null
	}

	constructor(init?: Partial<{load?: ((_p0: string) => [any, boolean] | globalThis.Promise<[any, boolean]>) | null}>) {
		this._fields = {
			load: init?.load ?? (null! as ((_p0: string) => [any, boolean] | globalThis.Promise<[any, boolean]>) | null)
		}
	}

	public clone(): loader {
		return $.markAsStructValue(new loader(this))
	}

	public getLoad(): ((_p0: string) => [any, boolean] | globalThis.Promise<[any, boolean]>) | null {
		const l: loader | $.VarRef<loader> | null = this
		return $.pointerValue<loader>(l).load
	}

	static {
		$.bindStructFields(this.prototype, ["load"])
	}

	static __typeInfo = $.registerStructType(
		"main.loader",
		() => new loader(),
		() => [{ name: "getLoad", args: [], returns: [{ type: ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [{ kind: $.TypeKind.Interface, methods: [] }, /* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo) }] }],
		loader,
		() => [{ name: "load", key: "load", type: ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [{ kind: $.TypeKind.Interface, methods: [] }, /* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo) }]
	)
}

export let cache: $.VarRef<sync.Map> = $.varRef($.markAsStructValue(new sync.Map()))

export function __goscript_set_cache(__goscriptValue: sync.Map): void {
	$.assignStruct(cache.value, __goscriptValue)
}

export let defaultLoader: loader | $.VarRef<loader> | null = new loader({load: $.functionValue(async (key: string): globalThis.Promise<[any, boolean]> => {
	return await cache.value.Load(key)
}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [{ kind: $.TypeKind.Interface, methods: [] }, /* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))})

export function __goscript_set_defaultLoader(__goscriptValue: loader | $.VarRef<loader> | null): void {
	defaultLoader = __goscriptValue
}

export async function lookup(key: string): globalThis.Promise<[any, boolean]> {
	return $.pointerValue<loader>(defaultLoader).load!(key)
}

export async function lookupViaGetter(key: string): globalThis.Promise<[any, boolean]> {
	return loader.prototype.getLoad.call(defaultLoader)!(key)
}

export async function main(): globalThis.Promise<void> {
	await cache.value.Store("answer", $.basicInterfaceValue(42, "int"))
	let [value, ok] = await lookup("answer")
	if (ok) {
		await $.println("value:", $.mustTypeAssert<number>(value, /* @__PURE__ */ $.basicType("int")))
	}
	let [getterValue, getterOk] = await lookupViaGetter("answer")
	if (getterOk) {
		await $.println("getter value:", $.mustTypeAssert<number>(getterValue, /* @__PURE__ */ $.basicType("int")))
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

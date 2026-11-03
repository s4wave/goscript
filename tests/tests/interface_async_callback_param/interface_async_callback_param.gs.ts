// Generated file based on interface_async_callback_param.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as errors from "@goscript/errors/index.js"
import * as runtime from "@goscript/runtime/index.js"
import * as sync from "@goscript/sync/index.js"

export type scanner = {
	Scan(_p0: ((_p0: number) => $.GoError | globalThis.Promise<$.GoError>) | null): $.GoError
}

$.registerInterfaceType(
	"main.scanner",
	null,
	[{ name: "Scan", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }]
);

export type stageOpener = {
	Open(): [number, (() => void) | null, $.GoError] | globalThis.Promise<[number, (() => void) | null, $.GoError]>
}

$.registerInterfaceType(
	"main.stageOpener",
	null,
	[{ name: "Open", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }, { type: "error" }] }]
);

export class listScanner {
	constructor(__goscriptValue?: boolean) {
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): listScanner {
		return new listScanner(true)
	}

	public __goscriptAssign(source: listScanner): this {
		return this
	}

	public Scan(fn: ((_p0: number) => $.GoError | globalThis.Promise<$.GoError>) | null): $.GoError {
		return (fn!(7) as $.GoError)
	}

	static __typeInfo = $.registerStructType(
		"main.listScanner",
		() => new listScanner(),
		() => [{ name: "Scan", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }],
		listScanner,
		() => []
	)
}

export class stageStore {
	constructor(__goscriptValue?: boolean) {
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): stageStore {
		return new stageStore(true)
	}

	public __goscriptAssign(source: stageStore): this {
		return this
	}

	public async Open(): globalThis.Promise<[number, (() => void) | null, $.GoError]> {
		await runtime.Gosched()
		return [9, $.functionValue(() => {
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)), null]
	}

	static __typeInfo = $.registerStructType(
		"main.stageStore",
		() => new stageStore(),
		() => [{ name: "Open", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }, { type: "error" }] }],
		stageStore,
		() => []
	)
}

export function run(s: scanner | null): $.GoError {
	return (s !== null && (s as any).__isVarRef !== true && ((s as any).__goValue === undefined || (s as any).__goType?.charCodeAt(0) !== 42) ? (s as Exclude<scanner, null>) : $.pointerValue<Exclude<scanner, null>>(s)).Scan($.functionValue((v: number): $.GoError => {
		if (v != 7) {
			return errors.New("wrong value")
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: ["error"] } as $.FunctionTypeInfo)))
}

export async function openStage(store: any): globalThis.Promise<[number, (() => void) | null, $.GoError]> {
	return $.pointerValue<Exclude<stageOpener, null>>($.mustTypeAssert<stageOpener | null>(store, "main.stageOpener")).Open()
}

export async function resolve(__typeArgs: $.GenericTypeArgs | undefined, callback: (() => [any, (() => void) | null, $.GoError] | globalThis.Promise<[any, (() => void) | null, $.GoError]>) | null): globalThis.Promise<any> {
	let [value, release, err] = await callback!()
	if (err != null) {
		$.panic((err as any))
	}
	release!()
	return $.copyElement(value)
}

export async function main(): globalThis.Promise<void> {
	// Await an interface tuple through a generic resolver callback.
	await $.println("stage:", await resolve(__goscriptStatic0(), $.functionValue(async (): globalThis.Promise<[number, (() => void) | null, $.GoError]> => {
		let [value, release, err] = await openStage($.structInterfaceValue(new stageStore(true), "main.stageStore", "main.stageStore"))
		return [value, release, err]
	}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int"), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "error"] } as $.FunctionTypeInfo))))

	// Pass a synchronous callback through the scanner interface.
	await $.println(run($.structInterfaceValue<scanner | null>(new listScanner(true), "main.listScanner", "main.listScanner")) == null)

	// Call a stored callback that invokes a runtime override.
	let m = $.varRef($.markAsStructValue(new sync.Map()))
	let callbacks = $.arrayValue([$.functionValue((v: number): $.GoError => {
		m.value.Load($.basicInterfaceValue(v, "int"))
		return null
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: ["error"] } as $.FunctionTypeInfo))])
	await $.println((callbacks[0]!(1) as $.GoError) == null)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

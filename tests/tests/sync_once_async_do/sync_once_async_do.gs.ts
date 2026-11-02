// Generated file based on sync_once_async_do.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as sync from "@goscript/sync/index.js"

export async function wrapRelease(release: (() => void) | null): globalThis.Promise<(() => void) | null> {
	return sync.OnceFunc($.functionValue(async () => {
		void (__goscriptAwait = release!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
}

export async function invokePanic(f: (() => void) | null): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		__defer.defer(async () => { await (async () => {
			await $.println("panic", $.mustTypeAssert<string>($.recover(), /* @__PURE__ */ $.basicType("string")))
		})() })
		void (__goscriptAwait = f!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export async function main(): globalThis.Promise<void> {
	// Once.Do waits for a callback that receives from a channel.
	let once = $.varRef($.markAsStructValue(new sync.Once()))
	let ch = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 17)
	let value = 0
	await once.value.Do($.functionValue(async () => {
		value = await $.chanRecv(ch)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	once.value.Do($.functionValue(() => {
		value = 99
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await $.println("once", value)

	// A retained wrapper waits for its async callback exactly once.
	await $.chanSend(ch, 23)
	let release: (() => void) | null = await wrapRelease($.functionValue(async () => {
		value = await $.chanRecv(ch)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	void (__goscriptAwait = release!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	void (__goscriptAwait = release!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	await $.println("release", value)

	// Cached values wait for their first result and never receive again.
	await $.chanSend(ch, 31)
	let _get: (() => number | globalThis.Promise<number>) | null = (sync.OnceValue($.functionValue(async (): globalThis.Promise<number> => {
		return await $.chanRecv(ch)
	}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))) as (() => number | globalThis.Promise<number>) | null)
	await $.println("value", (__goscriptAwait = _get!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = _get!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.chanSend(ch, 37)
	let pair: (() => [number, number] | globalThis.Promise<[number, number]>) | null = (sync.OnceValues($.functionValue(async (): globalThis.Promise<[number, number]> => {
		let n: number = await $.chanRecv(ch)
		return [n, n + 1]
	}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))) as (() => [number, number] | globalThis.Promise<[number, number]>) | null)
	let [a, b] = await pair!()
	let [c, d] = await pair!()
	await $.println("values", a, b, c, d)

	// An async panic is cached and replayed without another channel receive.
	await $.chanSend(ch, 41)
	let panicking: (() => void) | null = sync.OnceFunc($.functionValue(async () => {
		await $.chanRecv(ch)
		$.panic("retained panic")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await invokePanic(panicking)
	await invokePanic(panicking)
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

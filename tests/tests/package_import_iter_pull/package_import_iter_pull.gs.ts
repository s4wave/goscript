// Generated file based on package_import_iter_pull.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as iter from "@goscript/iter/index.js"

export class pullIterator {
	public declare next: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null

	public declare stop: (() => void) | null

	constructor(__goscriptValue?: boolean, next$?: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null, stop$?: (() => void) | null) {
		this.next = next$ ?? (null! as (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null)
		this.stop = stop$ ?? (null! as (() => void) | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): pullIterator {
		return new pullIterator(true, this.next, this.stop)
	}

	public __goscriptAssign(source: pullIterator): this {
		this.next = source.next
		this.stop = source.stop
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.pullIterator",
		() => new pullIterator(),
		() => [],
		pullIterator,
		() => [{ name: "next", key: "next", type: ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo) }, { name: "stop", key: "stop", type: ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo) }]
	)
}

export class lexer {
	public declare stack: $.Slice<pullIterator>

	constructor(__goscriptValue?: boolean, stack$?: $.Slice<pullIterator>) {
		this.stack = stack$ ?? (null! as $.Slice<pullIterator>)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): lexer {
		return new lexer(true, this.stack)
	}

	public __goscriptAssign(source: lexer): this {
		this.stack = source.stack
		return this
	}

	public async drain(_yield: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<boolean> {
		const l: lexer | $.VarRef<lexer> | null = this;
		const l$: lexer = l == null ? $.pointerTarget<lexer>(l) : (l as any).__isVarRef === true ? (l as any).value : (l as any).__goValue === undefined ? (l as any) : $.pointerTarget<lexer>(l)
		while ($.sliceLen((l$ as lexer).stack) > 0) {
			let n = $.sliceLen((l$ as lexer).stack) - 1
			let [v, ok] = await $.plainSliceIndex((l$ as lexer).stack!, n).next!()
			if (!ok) {
				void (__goscriptAwait = $.plainSliceIndex((l$ as lexer).stack!, n).stop!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait);
				;(l$ as lexer).stack = $.goSlice((l$ as lexer).stack, undefined, n)
				continue
			}
			// A value of 10 pushes a nested sequence, as a delegating rule does.
			if (v == 10) {
				await (l !== null && (l as any).__isVarRef !== true && (l as any).__goValue === undefined ? ((l as any) as lexer).push(count(3, $.varRef<$.Slice<string>>(null! as $.Slice<string>))) : lexer.prototype.push.call(l, count(3, $.varRef<$.Slice<string>>(null! as $.Slice<string>))))
			}
			if (!(__goscriptAwait = _yield!(v), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)) {
				return false
			}
		}
		return true
	}

	public async push(seq: ((_yield: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null) => void) | null): globalThis.Promise<void> {
		const l: lexer | $.VarRef<lexer> | null = this;
		const l$: lexer = l == null ? $.pointerTarget<lexer>(l) : (l as any).__isVarRef === true ? (l as any).value : (l as any).__goValue === undefined ? (l as any) : $.pointerTarget<lexer>(l)
		let __goscriptTuple0: any = iter.Pull(__goscriptStatic0(), seq)
		let next: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null = (__goscriptTuple0[0] as (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null)
		let stop: (() => void) | null = __goscriptTuple0[1];
		;(l$ as lexer).stack = $.appendOne((l$ as lexer).stack, new pullIterator(true, next, stop))
	}

	public async stopAll(): globalThis.Promise<void> {
		const l: lexer | $.VarRef<lexer> | null = this;
		const l$: lexer = l == null ? $.pointerTarget<lexer>(l) : (l as any).__isVarRef === true ? (l as any).value : (l as any).__goValue === undefined ? (l as any) : $.pointerTarget<lexer>(l)
		for (let __goscriptRangeTarget0 = (l$ as lexer).stack, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
			let entry = ((__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as pullIterator)).clone()
			void (__goscriptAwait = entry.stop!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		}
		;(l$ as lexer).stack = null
	}

	public tokens(): iter.Seq<number> | null {
		const l: lexer | $.VarRef<lexer> | null = this;
		return $.functionValue(async (_yield: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null) => {
			await using __defer = new $.AsyncDisposableStack()
			const __goscriptDeferCallee0 = $.functionValue(((__receiver) => () => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as lexer).stopAll() : lexer.prototype.stopAll.call(__receiver)))(l), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "main.(*lexer).stopAll-fm")
			__defer.defer(async () => { await __goscriptDeferCallee0() })
			await lexer.prototype.push.call(l, $.functionValue(async (_yield: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null) => {
				for (let __goscriptRangeTarget1 = $.arrayToSlice<number>([1, 10, 2]), __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
					let v = (__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as number)
					if (!(__goscriptAwait = _yield!(v), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)) {
						return
					}
				}
			}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))
			await (l !== null && (l as any).__isVarRef !== true && (l as any).__goValue === undefined ? ((l as any) as lexer).drain(_yield) : lexer.prototype.drain.call(l, _yield))
		}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo))
	}

	static __typeInfo = $.registerStructType(
		"main.lexer",
		() => new lexer(),
		() => [{ name: "drain", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "push", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }, { name: "stopAll", args: [], returns: [], pointerReceiver: true }, { name: "tokens", args: [], returns: [{ type: ({ kind: $.TypeKind.Function, name: "iter.Seq", params: [({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo) }], pointerReceiver: true }],
		lexer,
		() => [{ name: "stack", key: "stack", type: /* @__PURE__ */ $.sliceType("main.pullIterator") }]
	)
}

export function count(n: number, log: $.VarRef<$.Slice<string>> | null): iter.Seq<number> | null {
	return $.functionValue(async (_yield: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null) => {
		using __defer = new $.DisposableStack()
		__defer.defer(() => { (() => {
			log!.value = $.appendOne($.pointerValue<$.Slice<string>>(log), "count done")
		})() })
		for (let __goscriptRangeCount0 = n, i = 0; i < __goscriptRangeCount0; i++) {
			if (!(__goscriptAwait = _yield!(i), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)) {
				log!.value = $.appendOne($.pointerValue<$.Slice<string>>(log), "yield false")
				return
			}
		}
	}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo))
}

export async function naturals(_yield: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<void> {
	for (let i = 0; ; i++) {
		if (!(__goscriptAwait = _yield!(i), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)) {
			return
		}
	}
}

export function pairs(n: number): iter.Seq2<number, number> | null {
	return $.functionValue(async (_yield: ((_p0: number, _p1: number) => boolean | globalThis.Promise<boolean>) | null) => {
		for (let __goscriptRangeCount1 = n, i = 0; i < __goscriptRangeCount1; i++) {
			if (!(__goscriptAwait = _yield!(i, i * i), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)) {
				return
			}
		}
	}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo))
}

export async function doubled(seq: ((_yield: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null) => void) | null): globalThis.Promise<iter.Seq<number> | null> {
	return $.functionValue(async (_yield: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null) => {
		let __goscriptRangeReturn0 = false
		;await (async () => {
			await seq!(async (v) => {
				if (!(__goscriptAwait = _yield!(v * 2), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)) {
					__goscriptRangeReturn0 = true
					return false
				}
				return true
			})
		})()
		if (__goscriptRangeReturn0) {
			return
		}
	}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo))
}

export async function finite(): globalThis.Promise<void> {
	// Every value comes in order, then the end is reported twice.
	let log: $.VarRef<$.Slice<string>> = $.varRef(null! as $.Slice<string>)
	let __goscriptTuple1: any = iter.Pull(__goscriptStatic0(), count(3, log))
	let next: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null = (__goscriptTuple1[0] as (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null)
	let stop: (() => void) | null = __goscriptTuple1[1]
	while (true) {
		let [v, ok] = await next!()
		await $.println("next:", v, ok)
		if (!ok) {
			break
		}
	}
	let [v, ok] = await next!()
	await $.println("after end:", v, ok)
	void (__goscriptAwait = stop!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	let __goscriptTuple2: any = await next!()
	v = __goscriptTuple2[0]
	ok = __goscriptTuple2[1]
	await $.println("after stop:", v, ok)
	for (let __goscriptRangeTarget2 = log.value, __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow2.length; __rangeIndex++) {
		let line = (__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + __rangeIndex] as string)
		await $.println("log:", line)
	}
}

export async function stopEarly(): globalThis.Promise<void> {
	// Stopping runs the sequence's defers before stop returns.
	let log: $.VarRef<$.Slice<string>> = $.varRef(null! as $.Slice<string>)
	let __goscriptTuple3: any = iter.Pull(__goscriptStatic0(), count(5, log))
	let next: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null = (__goscriptTuple3[0] as (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null)
	let stop: (() => void) | null = __goscriptTuple3[1]
	let [v, ok] = await next!()
	await $.println("first:", v, ok)
	await $.println("log before stop:", $.sliceLen(log.value))
	void (__goscriptAwait = stop!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	for (let __goscriptRangeTarget3 = log.value, __goscriptRangeWindow3 = $.sliceRange(__goscriptRangeTarget3), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow3.length; __rangeIndex++) {
		let line = (__goscriptRangeWindow3.backing[__goscriptRangeWindow3.offset + __rangeIndex] as string)
		await $.println("log:", line)
	}
	let __goscriptTuple4: any = await next!()
	v = __goscriptTuple4[0]
	ok = __goscriptTuple4[1]
	await $.println("after stop:", v, ok)
	void (__goscriptAwait = stop!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)

	// Stopping before the first next never runs the sequence.
	let unused: $.VarRef<$.Slice<string>> = $.varRef(null! as $.Slice<string>)
	let __goscriptTuple5: any = iter.Pull(__goscriptStatic0(), count(5, unused))
	stop = __goscriptTuple5[1]
	void (__goscriptAwait = stop!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	await $.println("unstarted log:", $.sliceLen(unused.value))
}

export async function infinite(): globalThis.Promise<void> {
	// An endless sequence runs only as far as next asks.
	let __goscriptTuple6: any = iter.Pull(__goscriptStatic0(), naturals)
	let next: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null = (__goscriptTuple6[0] as (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null)
	let stop: (() => void) | null = __goscriptTuple6[1]
	let sum = 0
	for (let __rangeIndex = 0; __rangeIndex < 5; __rangeIndex++) {
		let [v, ] = await next!()
		sum += v
	}
	void (__goscriptAwait = stop!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	await $.println("infinite sum:", sum)
}

export async function pull2(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	// Pull2 returns pairs and then zero values.
	let __goscriptTuple7: any = iter.Pull2(__goscriptStatic1(), pairs(3))
	let next: (() => [number, number, boolean] | globalThis.Promise<[number, number, boolean]>) | null = (__goscriptTuple7[0] as (() => [number, number, boolean] | globalThis.Promise<[number, number, boolean]>) | null)
	let stop: (() => void) | null = __goscriptTuple7[1]
	const __goscriptDeferCallee1 = stop
	__defer.defer(async () => { (__goscriptAwait = __goscriptDeferCallee1!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) })
	while (true) {
		let [k, v, ok] = await next!()
		await $.println("pair:", k, v, ok)
		if (!ok) {
			break
		}
	}
}

export async function nilSeq(): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		// A nil sequence panics on the first next.
		__defer.defer(async () => { await (async () => {
			await $.println("nil seq recovered:", $.recover() != null)
		})() })
		let seq: iter.Seq<number> | null = null! as iter.Seq<number> | null
		let __goscriptTuple8: any = iter.Pull(__goscriptStatic0(), seq)
		let next: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null = (__goscriptTuple8[0] as (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null)
		await next!()
		await $.println("not reached")
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export async function panicking(): globalThis.Promise<void> {
	// A panic in the sequence propagates out of next, and the iterator ends.
	let next: $.VarRef<(() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null> = $.varRef(null! as (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null)
	await (async () => {
		const __defer = new $.AsyncDisposableStack()
		try {
			__defer.defer(async () => { await (async () => {
				await $.println("recovered:", $.mustTypeAssert<string>($.recover(), /* @__PURE__ */ $.basicType("string")))
			})() })
			let stop: (() => void) | null = null! as (() => void) | null
			let __goscriptTuple9: any = iter.Pull(__goscriptStatic0(), $.functionValue(async (_yield: ((_p0: number) => boolean | globalThis.Promise<boolean>) | null) => {
				void (__goscriptAwait = _yield!(1), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
				$.panic("seq failed")
			}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)))
			next.value = (__goscriptTuple9[0] as (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null)
			stop = __goscriptTuple9[1]
			const __goscriptDeferCallee2 = stop
			__defer.defer(async () => { (__goscriptAwait = __goscriptDeferCallee2!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) })
			let [v, ok] = await next.value!()
			await $.println("before panic:", v, ok)
			await next.value!()
			await __defer.dispose()
		} catch (e) {
			await __defer.disposePanic(e)
			if (!$.recovered(e)) {
				throw e
			}
		}
	})()
	let [v, ok] = await next.value!()
	await $.println("after panic:", v, ok)
}

export async function nested(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	// A sequence that ranges over another one suspends inside the range.
	let __goscriptTuple10: any = iter.Pull(__goscriptStatic0(), await doubled(count(4, $.varRef<$.Slice<string>>(null! as $.Slice<string>))))
	let next: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null = (__goscriptTuple10[0] as (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null)
	let stop: (() => void) | null = __goscriptTuple10[1]
	const __goscriptDeferCallee3 = stop
	__defer.defer(async () => { (__goscriptAwait = __goscriptDeferCallee3!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) })
	while (true) {
		let [v, ok] = await next!()
		if (!ok) {
			break
		}
		await $.println("doubled:", v)
	}
}

export async function interleaved(): globalThis.Promise<void> {
	await using __defer = new $.AsyncDisposableStack()
	// Two pulled sequences advance independently.
	let __goscriptTuple11: any = iter.Pull(__goscriptStatic0(), count(3, $.varRef<$.Slice<string>>(null! as $.Slice<string>)))
	let nextA: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null = (__goscriptTuple11[0] as (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null)
	let stopA: (() => void) | null = __goscriptTuple11[1]
	let __goscriptTuple12: any = iter.Pull(__goscriptStatic0(), naturals)
	let nextB: (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null = (__goscriptTuple12[0] as (() => [number, boolean] | globalThis.Promise<[number, boolean]>) | null)
	let stopB: (() => void) | null = __goscriptTuple12[1]
	const __goscriptDeferCallee4 = stopA
	__defer.defer(async () => { (__goscriptAwait = __goscriptDeferCallee4!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) })
	const __goscriptDeferCallee5 = stopB
	__defer.defer(async () => { (__goscriptAwait = __goscriptDeferCallee5!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) })
	while (true) {
		let [a, okA] = await nextA!()
		let [b, okB] = await nextB!()
		await $.println("interleaved:", a, okA, b, okB)
		if (!okA) {
			break
		}
	}
}

export async function lexerStack(): globalThis.Promise<void> {
	// A stack of pulled sequences grows and shrinks while it is drained.
	let l = new lexer()
	let __goscriptRangeReturn1 = false
	;await (async () => {
		await (l !== null && (l as any).__isVarRef !== true && (l as any).__goValue === undefined ? ((l as any) as lexer).tokens() : lexer.prototype.tokens.call(l))!(async (v) => {
			await $.println("token:", v)
			if (v == 2) {
				return false
			}
			return true
		})
	})()
	if (__goscriptRangeReturn1) {
		return
	}
	await $.println("stack after break:", $.sliceLen($.pointerValue<lexer>(l).stack))
}

export async function main(): globalThis.Promise<void> {
	await finite()
	await stopEarly()
	await infinite()
	await pull2()
	await nilSeq()
	await panicking()
	await nested()
	await interleaved()
	await lexerStack()
	await $.println("done")
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, V: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, K: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }, V: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

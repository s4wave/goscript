// Generated file based on async_directives.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Logger = {
	Log(msg: string): string | globalThis.Promise<string>
}

$.registerInterfaceType(
	"main.Logger",
	null,
	[{ name: "Log", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export type Sink = {
	Put(n: number): number | globalThis.Promise<number>
}

$.registerInterfaceType(
	"main.Sink",
	null,
	[{ name: "Put", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export type Transform = ((_p0: number) => number | globalThis.Promise<number>) | null

export class prefixLogger {
	public declare prefix: string

	constructor(__goscriptValue?: boolean, prefix$?: string) {
		this.prefix = prefix$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): prefixLogger {
		return new prefixLogger(true, this.prefix)
	}

	public __goscriptAssign(source: prefixLogger): this {
		this.prefix = source.prefix
		return this
	}

	public Log(msg: string): string {
		const l = this;
		return l.prefix + msg
	}

	static __typeInfo = $.registerStructType(
		"main.prefixLogger",
		() => new prefixLogger(),
		() => [{ name: "Log", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		prefixLogger,
		() => [{ name: "prefix", key: "prefix", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class addSink {
	public declare total: number

	constructor(__goscriptValue?: boolean, total$?: number) {
		this.total = total$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): addSink {
		return new addSink(true, this.total)
	}

	public __goscriptAssign(source: addSink): this {
		this.total = source.total
		return this
	}

	public Put(n: number): number {
		const s: addSink | $.VarRef<addSink> | null = this;
		const s$: addSink = s == null ? $.pointerTarget<addSink>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<addSink>(s);
		;(s$ as addSink).total += n
		return (s$ as addSink).total
	}

	static __typeInfo = $.registerStructType(
		"main.addSink",
		() => new addSink(),
		() => [{ name: "Put", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		addSink,
		() => [{ name: "total", key: "total", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class chanSink {
	public declare ch: $.Channel<number> | null

	constructor(__goscriptValue?: boolean, ch$?: $.Channel<number> | null) {
		this.ch = ch$ ?? (null! as $.Channel<number> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): chanSink {
		return new chanSink(true, this.ch)
	}

	public __goscriptAssign(source: chanSink): this {
		this.ch = source.ch
		return this
	}

	public async Put(n: number): globalThis.Promise<number> {
		const s: chanSink | $.VarRef<chanSink> | null = this;
		const s$: chanSink = s == null ? $.pointerTarget<chanSink>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<chanSink>(s)
		await $.chanSend((s$ as chanSink).ch, n)
		return await $.chanRecv((s$ as chanSink).ch)
	}

	static __typeInfo = $.registerStructType(
		"main.chanSink",
		() => new chanSink(),
		() => [{ name: "Put", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		chanSink,
		() => [{ name: "ch", key: "ch", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }]
	)
}

export class Button {
	public declare OnClick: ((clicks: number) => number | globalThis.Promise<number>) | null

	// OnHover keeps the shape's coloring.
	public declare OnHover: ((clicks: number) => number | globalThis.Promise<number>) | null

	constructor(__goscriptValue?: boolean, OnClick$?: ((clicks: number) => number | globalThis.Promise<number>) | null, OnHover$?: ((clicks: number) => number | globalThis.Promise<number>) | null) {
		this.OnClick = OnClick$ ?? (null! as ((clicks: number) => number | globalThis.Promise<number>) | null)
		this.OnHover = OnHover$ ?? (null! as ((clicks: number) => number | globalThis.Promise<number>) | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Button {
		return new Button(true, this.OnClick, this.OnHover)
	}

	public __goscriptAssign(source: Button): this {
		this.OnClick = source.OnClick
		this.OnHover = source.OnHover
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Button",
		() => new Button(),
		() => [],
		Button,
		() => [{ name: "OnClick", key: "OnClick", type: ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo) }, { name: "OnHover", key: "OnHover", type: ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo) }]
	)
}

export class summer {
	public declare n: number

	constructor(__goscriptValue?: boolean, n$?: number) {
		this.n = n$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): summer {
		return new summer(true, this.n)
	}

	public __goscriptAssign(source: summer): this {
		this.n = source.n
		return this
	}

	public sum(fs: $.Slice<((_p0: number) => number | globalThis.Promise<number>) | null>): number {
		const s: summer | $.VarRef<summer> | null = this;
		let total = 0
		for (let __goscriptRangeTarget2 = fs, __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow2.length; __rangeIndex++) {
			let f = (__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + __rangeIndex] as ((_p0: number) => number | globalThis.Promise<number>) | null)
			total += $.syncResult(f!($.pointerValue<summer>(s).n))
		}
		return total
	}

	static __typeInfo = $.registerStructType(
		"main.summer",
		() => new summer(),
		() => [{ name: "sum", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		summer,
		() => [{ name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function logAll(l: Logger | null, msgs: $.Slice<string>): globalThis.Promise<string> {
	let out = ""
	for (let __goscriptRangeTarget0 = msgs, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let msg = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as string)
		out += (__goscriptAwait = (l !== null && (l as any).__isVarRef !== true && ((l as any).__goValue === undefined || (l as any).__goType?.charCodeAt(0) !== 42) ? (l as Exclude<Logger, null>) : $.pointerValue<Exclude<Logger, null>>(l)).Log(msg), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	}
	return out
}

export function fill(s: Sink | null, n: number): number {
	let last = 0
	for (let __goscriptRangeCount0 = n, i = 0; i < __goscriptRangeCount0; i++) {
		last = ((s !== null && (s as any).__isVarRef !== true && ((s as any).__goValue === undefined || (s as any).__goType?.charCodeAt(0) !== 42) ? (s as Exclude<Sink, null>) : $.pointerValue<Exclude<Sink, null>>(s)).Put(i) as number)
	}
	return last
}

export function applyAll(fs: $.Slice<Transform | null>, n: number): number {
	for (let __goscriptRangeTarget1 = fs, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let f = (__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as Transform | null)
		n = (f!(n) as number)
	}
	return n
}

export async function click(b: Button | $.VarRef<Button> | null, n: number): globalThis.Promise<number> {
	const b$: Button = b == null ? $.pointerTarget<Button>(b) : (b as any).__isVarRef === true ? (b as any).value : (b as any).__goValue === undefined ? (b as any) : $.pointerTarget<Button>(b)
	return (__goscriptAwait = (b$ as Button).OnClick!(n), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) + (__goscriptAwait = (b$ as Button).OnHover!(n), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
}

export function countAll(f: ((_p0: number) => number | globalThis.Promise<number>) | null, n: number): number {
	return $.syncResult(f!(n)) + 1
}

export async function main(): globalThis.Promise<void> {
	await $.println("log:", await logAll($.structInterfaceValue<Logger | null>(new prefixLogger(true, "> "), "main.prefixLogger", "main.prefixLogger"), $.arrayToSlice<string>(["a", "b"])))

	let sink = new addSink()
	await $.println("fill:", fill($.interfaceValue<Sink | null>(sink, "*main.addSink", /* @__PURE__ */ $.pointerType("main.addSink")), 4))

	let ch = $.makeChannel<number>(0, 0, "both")
	$.go(async () => {
		let n: number = await $.chanRecv(ch)
		await $.chanSend(ch, n * 10)
	})
	await $.println("chan put:", await chanSink.prototype.Put.call((new chanSink(false, ch)), 3))

	// An async literal of Transform's shape.
	let recv = $.functionValue(async (n: number): globalThis.Promise<number> => {
		let c = $.makeChannel<number>(1, 0, "both")
		await $.chanSend(c, n)
		return await $.chanRecv(c)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	await $.println("recv:", await recv(5))
	let double = $.functionValue((n: number): number => {
		return n * 2
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	await $.println("apply:", applyAll($.arrayToSlice<Transform | null>([double, $.namedFunction(double, "main.Transform", ({ kind: $.TypeKind.Function, name: "main.Transform", params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))]), 3))

	let b = new Button(false, $.functionValue((clicks: number): number => {
		return clicks + 1
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)), $.functionValue((clicks: number): number => {
		return clicks + 2
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)))
	await $.println("click:", await click(b, 1))

	await $.println("count:", countAll(double, 4))
	let s = new summer(false, 2)
	await $.println("sum:", (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as summer).sum($.arrayToSlice<((_p0: number) => number | globalThis.Promise<number>) | null>([double, double])) : summer.prototype.sum.call(s, $.arrayToSlice<((_p0: number) => number | globalThis.Promise<number>) | null>([double, double]))))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

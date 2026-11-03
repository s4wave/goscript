// Generated file based on func_value_whole_program.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Action = ((r: Rule | $.VarRef<Rule> | null, n: number) => number | globalThis.Promise<number>) | null

export type Source = {
	Next(): number | globalThis.Promise<number>
}

$.registerInterfaceType(
	"main.Source",
	null,
	[{ name: "Next", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export type labeler = ((_p0: number) => string | globalThis.Promise<string>) | null

export class Rule {
	public declare name: string

	public declare act: ((r: Rule | $.VarRef<Rule> | null, n: number) => number | globalThis.Promise<number>) | null

	constructor(__goscriptValue?: boolean, name$?: string, act$?: ((r: Rule | $.VarRef<Rule> | null, n: number) => number | globalThis.Promise<number>) | null) {
		this.name = name$ ?? ""
		this.act = act$ ?? (null! as ((r: Rule | $.VarRef<Rule> | null, n: number) => number | globalThis.Promise<number>) | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Rule {
		return new Rule(true, this.name, this.act)
	}

	public __goscriptAssign(source: Rule): this {
		this.name = source.name
		this.act = source.act
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Rule",
		() => new Rule(),
		() => [],
		Rule,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }, { name: "act", key: "act", type: ({ kind: $.TypeKind.Function, name: "main.Action", params: [/* @__PURE__ */ $.pointerType("main.Rule"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo) }]
	)
}

export class counter {
	public declare total: number

	constructor(__goscriptValue?: boolean, total$?: number) {
		this.total = total$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): counter {
		return new counter(true, this.total)
	}

	public __goscriptAssign(source: counter): this {
		this.total = source.total
		return this
	}

	public add(k: number): void {
		const c: counter | $.VarRef<counter> | null = this;
		const c$: counter = c == null ? $.pointerTarget<counter>(c) : (c as any).__isVarRef === true ? (c as any).value : (c as any).__goValue === undefined ? (c as any) : $.pointerTarget<counter>(c);
		;(c$ as counter).total += k
	}

	static __typeInfo = $.registerStructType(
		"main.counter",
		() => new counter(),
		() => [{ name: "add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		counter,
		() => [{ name: "total", key: "total", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class chanSource {
	public declare ch: $.Channel<number> | null

	constructor(__goscriptValue?: boolean, ch$?: $.Channel<number> | null) {
		this.ch = ch$ ?? (null! as $.Channel<number> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): chanSource {
		return new chanSource(true, this.ch)
	}

	public __goscriptAssign(source: chanSource): this {
		this.ch = source.ch
		return this
	}

	public async Next(): globalThis.Promise<number> {
		const s: chanSource | $.VarRef<chanSource> | null = this;
		const s$: chanSource = s == null ? $.pointerTarget<chanSource>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<chanSource>(s)
		await $.chanSend((s$ as chanSource).ch, 1)
		return await $.chanRecv((s$ as chanSource).ch) + 1
	}

	static __typeInfo = $.registerStructType(
		"main.chanSource",
		() => new chanSource(),
		() => [{ name: "Next", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		chanSource,
		() => [{ name: "ch", key: "ch", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }]
	)
}

export class fnSource {
	public declare f: (() => number | globalThis.Promise<number>) | null

	constructor(__goscriptValue?: boolean, f$?: (() => number | globalThis.Promise<number>) | null) {
		this.f = f$ ?? (null! as (() => number | globalThis.Promise<number>) | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): fnSource {
		return new fnSource(true, this.f)
	}

	public __goscriptAssign(source: fnSource): this {
		this.f = source.f
		return this
	}

	public async Next(): globalThis.Promise<number> {
		const s: fnSource | $.VarRef<fnSource> | null = this;
		return $.pointerValue<fnSource>(s).f!()
	}

	static __typeInfo = $.registerStructType(
		"main.fnSource",
		() => new fnSource(),
		() => [{ name: "Next", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		fnSource,
		() => [{ name: "f", key: "f", type: ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo) }]
	)
}

export function double(r: Rule | $.VarRef<Rule> | null, n: number): number {
	return n * 2
}

export function applyRules(rules: $.Slice<Rule | $.VarRef<Rule> | null>, n: number): number {
	for (let __goscriptRangeTarget0 = rules, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let r = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as Rule | $.VarRef<Rule> | null)
		n = ($.pointerValue<Rule>(r).act!(r, n) as number)
	}
	return n
}

export function each(xs: $.Slice<number>, f: ((_p0: number) => void) | null): void {
	for (let __goscriptRangeTarget1 = xs, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let x = (__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as number)
		f!(x)
	}
}

export function addTo(c: counter | $.VarRef<counter> | null, f: ((_p0: counter | $.VarRef<counter> | null, _p1: number) => void) | null): void {
	f!(c, 4)
}

export async function receive(ch: $.Channel<number> | null): globalThis.Promise<number> {
	return await $.chanRecv(ch)
}

export function plain(ch: $.Channel<number> | null): number {
	return $.cap(ch)
}

export async function callWith(f: ((_p0: $.Channel<number> | null) => number | globalThis.Promise<number>) | null, ch: $.Channel<number> | null): globalThis.Promise<number> {
	return f!(ch)
}

export async function sum(src: Source | null, n: number): globalThis.Promise<number> {
	let total = 0
	for (let __goscriptRangeCount0 = n, __rangeIndex = 0; __rangeIndex < __goscriptRangeCount0; __rangeIndex++) {
		total += (__goscriptAwait = (src !== null && (src as any).__isVarRef !== true && ((src as any).__goValue === undefined || (src as any).__goType?.charCodeAt(0) !== 42) ? (src as Exclude<Source, null>) : $.pointerValue<Exclude<Source, null>>(src)).Next(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	}
	return total
}

export function label(k: number): string {
	return "item"
}

export function labelAll(n: number, l: labeler | null): number {
	let count = 0
	for (let __goscriptRangeCount1 = n, i = 0; i < __goscriptRangeCount1; i++) {
		count += $.stringLen((l!(i) as string))
	}
	return count
}

export async function main(): globalThis.Promise<void> {
	let rules = $.arrayToSlice<Rule | $.VarRef<Rule> | null>([new Rule(false, "double", double), new Rule(false, "inc", $.functionValue((r: Rule | $.VarRef<Rule> | null, n: number): number => {
		return n + $.stringLen($.pointerValue<Rule>(r).name)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Rule"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)))])
	await $.println("rules:", applyRules(rules, 1))

	let c = new counter()
	each($.arrayToSlice<number>([1, 2, 3]), $.functionValue(((__receiver) => (k: number) => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as counter).add(k) : counter.prototype.add.call(__receiver, k)))(c), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [] } as $.FunctionTypeInfo), "main.(*counter).add-fm"))
	addTo(c, $.functionValue((c: counter | $.VarRef<counter> | null, k: number): void => (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as counter).add(k) : counter.prototype.add.call(c, k)), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.counter"), /* @__PURE__ */ $.basicType("int")], results: [] } as $.FunctionTypeInfo)))
	await $.println("counter:", $.pointerValue<counter>(c).total)

	let ch = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 7)
	await $.println("receive:", await callWith(receive, ch))
	await $.println("plain:", await callWith(plain, ch))

	let inner = new chanSource(false, $.makeChannel<number>(1, 0, "both"))
	let src: Source | null = $.interfaceValue<Source | null>(inner, "*main.chanSource", /* @__PURE__ */ $.pointerType("main.chanSource"))
	let outer = new fnSource(false, $.functionValue(async (): globalThis.Promise<number> => {
		return (__goscriptAwait = (src !== null && (src as any).__isVarRef !== true && ((src as any).__goValue === undefined || (src as any).__goType?.charCodeAt(0) !== 42) ? (src as Exclude<Source, null>) : $.pointerValue<Exclude<Source, null>>(src)).Next(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) * 10
	}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)))
	await $.println("sum:", await sum($.interfaceValue<Source | null>(outer, "*main.fnSource", /* @__PURE__ */ $.pointerType("main.fnSource")), 2), await sum($.interfaceValue<Source | null>(inner, "*main.chanSource", /* @__PURE__ */ $.pointerType("main.chanSource")), 1))

	await $.println("labels:", labelAll(3, label), labelAll(2, $.functionValue((_p0: number): string => {
		return "xy"
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("string")] } as $.FunctionTypeInfo))))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

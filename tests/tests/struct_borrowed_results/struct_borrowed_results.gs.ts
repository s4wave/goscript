// Generated file based on struct_borrowed_results.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type matcher = {
	match(scope: Region, depth: number): [boolean, Region, number]
}

$.registerInterfaceType(
	"main.matcher",
	null,
	[{ name: "match", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }, { type: "main.Region" }, { type: /* @__PURE__ */ $.basicType("int") }] }]
);

export type Lines = $.Slice<Region>

$.registerNamedType("main.Lines", /* @__PURE__ */ $.sliceType("main.Region"));

$.registerNamedValueType(
	"main.Lines",
	{at: (receiver: any, ...args: any[]) => (Lines_at as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))},
	[$.methodSignature("at", [["reg", "main.Region"]], ["main.Region"])]
);

$.registerNamedValueType(
	"*main.Lines",
	{at: (receiver: any, ...args: any[]) => (Lines_at as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args))},
	[$.methodSignature("at", [["reg", "main.Region"]], ["main.Region"])]
);

export class Pos {
	public declare Line: number

	public declare Char: number

	constructor(__goscriptValue?: boolean, Line$?: number, Char$?: number) {
		this.Line = Line$ ?? 0
		this.Char = Char$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Pos {
		return new Pos(true, this.Line, this.Char)
	}

	public __goscriptAssign(source: Pos): this {
		this.Line = source.Line
		this.Char = source.Char
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Pos",
		() => new Pos(),
		() => [],
		Pos,
		() => [{ name: "Line", key: "Line", type: /* @__PURE__ */ $.basicType("int") }, { name: "Char", key: "Char", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Region {
	public declare Start: Pos

	public declare End: Pos

	constructor(__goscriptValue?: boolean, Start$?: Pos, End$?: Pos) {
		this.Start = Start$ ?? new Pos(true)
		this.End = End$ ?? new Pos(true)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Region {
		return new Region(true, this.Start.clone(), this.End.clone())
	}

	public __goscriptAssign(source: Region): this {
		this.Start.__goscriptAssign(source.Start)
		this.End.__goscriptAssign(source.End)
		return this
	}

	public bump(): void {
		const r: Region | $.VarRef<Region> | null = this;
		$.pointerValue<Region>(r).Start.Line++
	}

	public span(other: Region, __goscriptBorrow?: boolean): Region {
		const r = this;
		if (other.Start.Line > r.End.Line) {
			return (r).clone()
		}
		return (__goscriptBorrow === true ? other : (other).clone())
	}

	static __typeInfo = $.registerStructType(
		"main.Region",
		() => new Region(),
		() => [{ name: "bump", args: [], returns: [], pointerReceiver: true }, { name: "span", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "main.Region" }] }],
		Region,
		() => [{ name: "Start", key: "Start", type: "main.Pos" }, { name: "End", key: "End", type: "main.Pos" }]
	)
}

export class rule {
	public declare off: boolean

	public declare name: string

	constructor(__goscriptValue?: boolean, off$?: boolean, name$?: string) {
		this.off = off$ ?? false
		this.name = name$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): rule {
		return new rule(true, this.off, this.name)
	}

	public __goscriptAssign(source: rule): this {
		this.off = source.off
		this.name = source.name
		return this
	}

	public group(scope: Region, depth: number, __goscriptBorrow?: boolean): [boolean, Region, number] {
		const r: rule | $.VarRef<rule> | null = this;
		if (depth > 10) {
			return [false, (__goscriptBorrow === true ? scope : (scope).clone()), 0]
		}
		return (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).match(scope, depth + 1, __goscriptBorrow) : rule.prototype.match.call(r, scope, depth + 1, __goscriptBorrow))
	}

	public keep(scope: Region, __goscriptBorrow?: boolean): Region {
		const r: rule | $.VarRef<rule> | null = this;
		let [ok, nscope, ] = (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).match(scope, 0, true) : rule.prototype.match.call(r, scope, 0, true))
		if (!ok) {
			return (__goscriptBorrow === true ? scope : (scope).clone())
		}
		return (nscope).clone()
	}

	public match(scope: Region, depth: number, __goscriptBorrow?: boolean): [boolean, Region, number] {
		const r: rule | $.VarRef<rule> | null = this;
		calls++
		if ($.pointerValue<rule>(r).off) {
			return [false, (__goscriptBorrow === true ? scope : (scope).clone()), 0]
		}
		if (depth > 3) {
			return [false, (__goscriptBorrow === true ? scope : (scope).clone()), depth]
		}
		if (scope.Start.Line == scope.End.Line) {
			return [true, new Region(true, (scope.Start).clone(), new Pos(true, scope.End.Line, scope.End.Char + 1)), depth]
		}
		return [true, (__goscriptBorrow === true ? scope : (scope).clone()), depth]
	}

	static __typeInfo = $.registerStructType(
		"main.rule",
		() => new rule(),
		() => [{ name: "group", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }, { type: "main.Region" }, { type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }, { name: "keep", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "main.Region" }], pointerReceiver: true }, { name: "match", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }, { type: "main.Region" }, { type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		rule,
		() => [{ name: "off", key: "off", type: /* @__PURE__ */ $.basicType("bool") }, { name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class outer {
	public declare rule: rule | $.VarRef<rule> | null

	public declare Region: Region

	constructor(__goscriptValue?: boolean, rule$?: rule | $.VarRef<rule> | null, Region$?: Region) {
		this.rule = rule$ ?? (null! as rule | $.VarRef<rule> | null)
		this.Region = Region$ ?? new Region(true)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): outer {
		return new outer(true, this.rule, this.Region.clone())
	}

	public __goscriptAssign(source: outer): this {
		this.rule = source.rule
		this.Region.__goscriptAssign(source.Region)
		return this
	}

	public group(scope: any, depth: any): any {
		return $.pointerValue<rule>(this.rule).group(scope, depth)
	}

	public keep(scope: any): any {
		return $.pointerValue<rule>(this.rule).keep(scope)
	}

	public match(scope: any, depth: any): any {
		return $.pointerValue<rule>(this.rule).match(scope, depth)
	}

	public bump(): any {
		return $.pointerValue<Region>(this.Region).bump()
	}

	public span(other: any): any {
		return $.pointerValue<Region>(this.Region).span(other)
	}

	static __typeInfo = $.registerStructType(
		"main.outer",
		() => new outer(),
		() => [{ name: "group", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }, { type: "main.Region" }, { type: /* @__PURE__ */ $.basicType("int") }] }, { name: "keep", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "main.Region" }] }, { name: "match", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }, { type: "main.Region" }, { type: /* @__PURE__ */ $.basicType("int") }] }, { name: "bump", args: [], returns: [], pointerReceiver: true }, { name: "span", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "main.Region" }] }],
		outer,
		() => [{ name: "rule", key: "rule", type: /* @__PURE__ */ $.pointerType("main.rule"), anonymous: true }, { name: "Region", key: "Region", type: "main.Region", anonymous: true }]
	)
}

export let calls = 0

export function __goscript_set_calls(__goscriptValue: number): void {
	calls = __goscriptValue
}

export function first(a: Region, __goscriptBorrow?: boolean): Region {
	if (a.Start.Line < 0) {
		return new Region(true)
	}
	return (__goscriptBorrow === true ? a : (a).clone())
}

export function Lines_at(l: Lines, reg: Region, __goscriptBorrow?: boolean): Region {
	if ($.sliceLen((l as Lines)) == 0) {
		return (__goscriptBorrow === true ? reg : (reg).clone())
	}
	return ($.plainSliceIndex(l!, 0)).clone()
}

export function reads(r: rule | $.VarRef<rule> | null, scope: Region): number {
	let [ok, nscope, depth] = (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).match(scope, 0, true) : rule.prototype.match.call(r, scope, 0, true))
	let sum = (nscope.Start.Line + nscope.End.Char) + depth
	if (ok) {
		let [, again, ] = (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).match(nscope, 1, true) : rule.prototype.match.call(r, nscope, 1, true))
		sum += again.End.Line
	}
	let [, changed, ] = (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).match(scope, 0) : rule.prototype.match.call(r, scope, 0))
	changed.Start.Line = 99
	sum += changed.Start.Line + scope.Start.Line
	for (let i = 0; i < 2; i++) {
		let [, inLoop, ] = (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).match(scope, i, true) : rule.prototype.match.call(r, scope, i, true))
		sum += inLoop.Start.Char
	}
	return sum
}

export function grow(scope: Region): Region {
	let n = (scope).clone()
	n.End.Line++
	return n
}

export function twice(scope: Region): [Region, Region] {
	let n = (scope).clone()
	n.Start.Char++
	return [(n).clone(), (n).clone()]
}

export function withStart(scope: Region): [Region, Pos] {
	let n = (scope).clone()
	return [(n).clone(), (n.Start).clone()]
}

export function captured(scope: Region): [Region, (() => void) | null] {
	let n = (scope).clone()
	return [(n).clone(), $.functionValue(() => {
		n.Start.Line = 42
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))]
}

export function deferred(scope: Region): Region {
	let r: Region = new Region(true)
	using __defer = new $.DisposableStack()
	let n = (scope).clone()
	__defer.defer(() => { (() => {
		r.End.Char = 43
	})() })
	const __goscriptReturn1: Region = (n).clone()
	r = __goscriptReturn1
	__defer.dispose()
	return (r).clone()
	throw new globalThis.Error("goscript: unreachable return")
}

export function changedParam(scope: Region): Region {
	scope.Start.Line += 100
	return scope
}

export function pick(a: Region, n: number, __goscriptBorrow?: boolean): Region {
	if (n > 0) {
		return (__goscriptBorrow === true ? a : (a).clone())
	}
	return new Region(true)
}

export function aliasArg(__goscriptParam0: Region): number {
	let scope: $.VarRef<Region> = $.varRef(__goscriptParam0)
	let p = scope
	let got = pick(scope.value, 1)
	$.pointerValue<Region>(p).Start.Line = 77
	return got.Start.Line
}

export function methodArg(__goscriptParam1: Region): number {
	let scope: $.VarRef<Region> = $.varRef(__goscriptParam1)
	let got = pick(scope.value, 1)
	scope.value.bump()
	return got.Start.Line
}

export function aliasField(scope: Region): number {
	let x = (scope).clone()
	let p = $.fieldRef(x, "Start")
	let got = pick(x, 1)
	$.pointerValue<Pos>(p).Line = 78
	return got.Start.Line
}

export function promoted(__goscriptParam2: outer, scope: Region): number {
	let o: $.VarRef<outer> = $.varRef(__goscriptParam2)
	let [, got, ] = $.pointerValue<rule>(o.value.rule).match(scope, 0, true)
	let sp = o.value.Region.span(scope, true)
	return got.Start.Line + sp.End.Line
}

export async function main(): globalThis.Promise<void> {
	let r = new rule(false, undefined, "r")
	let scope = new Region(true, new Pos(true, 1, 2), new Pos(true, 3, 4))

	// a result that is only read shares nothing that changes
	let [ok, nscope, depth] = (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).match(scope, 0) : rule.prototype.match.call(r, scope, 0))
	await $.println("read:", ok, nscope.Start.Line, nscope.End.Char, depth)

	// a result that is changed must not change the argument
	let [, changed, ] = (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).match(scope, 0) : rule.prototype.match.call(r, scope, 0))
	changed.Start.Line = 99
	await $.println("changed result, scope:", scope.Start.Line, changed.Start.Line)

	// an argument that changes after the call must not change the result
	let arg = (scope).clone()
	let [, held, ] = (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).match(arg, 0) : rule.prototype.match.call(r, arg, 0))
	arg.End.Char = 77
	await $.println("changed argument, result:", held.End.Char, arg.End.Char)

	// an argument changed in a loop around the call
	let loopArg = (scope).clone()
	let last: Region = new Region(true)
	for (let i = 0; i < 3; i++) {
		let [, got, ] = (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).match(loopArg, 0) : rule.prototype.match.call(r, loopArg, 0))
		if (i == 0) {
			last = last.__goscriptAssign(got)
		}
		loopArg.Start.Char += 10
		await $.println("loop:", got.Start.Char, loopArg.Start.Char)
	}
	await $.println("loop last:", last.Start.Char)

	// discarded results
	void (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).match(scope, 0, true) : rule.prototype.match.call(r, scope, 0, true));
	;(r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).match(scope, 0, true) : rule.prototype.match.call(r, scope, 0, true))

	// a returned call passes the request on
	let [gok, gscope, ] = (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).group(scope, 0) : rule.prototype.group.call(r, scope, 0))
	await $.println("group:", gok, gscope.Start.Line, gscope.End.Line)
	let [, gchanged, ] = (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).group(scope, 0) : rule.prototype.group.call(r, scope, 0))
	gchanged.End.Line = 55
	await $.println("group changed, scope:", scope.End.Line, gchanged.End.Line)

	// a returned local copies
	let kept = (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rule).keep(scope) : rule.prototype.keep.call(r, scope))
	kept.Start.Char = 66
	await $.println("keep:", scope.Start.Char, kept.Start.Char)

	// interface and method value calls get copies
	let m: matcher | null = $.interfaceValue<matcher | null>(r, "*main.rule", /* @__PURE__ */ $.pointerType("main.rule"))
	let [, viaIface, ] = await (m !== null && (m as any).__isVarRef !== true && ((m as any).__goValue === undefined || (m as any).__goType?.charCodeAt(0) !== 42) ? (m as Exclude<matcher, null>) : $.pointerValue<Exclude<matcher, null>>(m)).match((scope).clone(), 0)
	viaIface.Start.Line = 11
	let fn: ((scope: Region, depth: number) => [boolean, Region, number] | globalThis.Promise<[boolean, Region, number]>) | null = $.functionValue(((__receiver) => (scope: Region, depth: number) => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as rule).match(scope, depth) : rule.prototype.match.call(__receiver, scope, depth)))(r), ({ kind: $.TypeKind.Function, params: ["main.Region", /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool"), "main.Region", /* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.(*rule).match-fm")
	let [, viaValue, ] = (fn!((scope).clone(), 0) as [boolean, Region, number])
	viaValue.Start.Line = 12
	await $.println("indirect:", scope.Start.Line, viaIface.Start.Line, viaValue.Start.Line)

	// functions and methods of named non-struct types
	let f = first(scope)
	await $.println("first:", f.Start.Line)
	let cp = first(scope)
	cp.Start.Line = 13
	await $.println("first changed:", scope.Start.Line, cp.Start.Line)
	let lines: Lines = null! as Lines
	let at = Lines_at(lines, scope)
	at.End.Char = 14
	await $.println("at:", scope.End.Char, at.End.Char)

	// the same region read through a result of an off rule
	let off = new rule(false, true)
	let [, offScope, ] = (off !== null && (off as any).__isVarRef !== true && (off as any).__goValue === undefined ? ((off as any) as rule).match(scope, 0) : rule.prototype.match.call(off, scope, 0))
	await $.println("off:", (offScope.Start.Line === scope.Start.Line && offScope.Start.Char === scope.Start.Char && offScope.End.Line === scope.End.Line && offScope.End.Char === scope.End.Char))
	scope.Start.Line = 21
	await $.println("off after change:", offScope.Start.Line, scope.Start.Line)
	let base = new Region(true, new Pos(true, 1, 2), new Pos(true, 3, 4))
	let g = grow(base)
	g.Start.Line = 7
	await $.println("grow:", base.End.Line, g.End.Line, g.Start.Line)
	let [t1, t2] = twice(base)
	t1.End.Char = 50
	await $.println("twice:", t1.Start.Char, t2.Start.Char, t1.End.Char, t2.End.Char)
	let [ws, st] = withStart(base)
	ws.Start.Line = 60
	await $.println("withStart:", ws.Start.Line, st.Line)
	let [cr, _set] = captured(base)
	_set!()
	await $.println("captured:", cr.Start.Line)
	await $.println("deferred:", deferred(base).End.Char, base.End.Char)
	let cp1 = changedParam((base).clone())
	let cp2 = changedParam((cp1).clone())
	await $.println("changedParam:", base.Start.Line, cp1.Start.Line, cp2.Start.Line)
	await $.println("aliasArg:", aliasArg((base).clone()), "methodArg:", methodArg((base).clone()), "aliasField:", aliasField(base))
	await $.println("promoted:", promoted(new outer(true, r, (base).clone()), base))
	await $.println("reads:", reads(r, new Region(true, new Pos(true, 1, 2), new Pos(true, 3, 4))))
	await $.println("calls:", calls)
}

if ($.isMainScript(import.meta)) {
	await main()
}

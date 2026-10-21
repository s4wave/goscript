// Generated file based on struct_assign_in_place.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Kind = number

export class Inner {
	public declare X: number

	public declare Y: number

	constructor(__goscriptValue?: boolean, X$?: number, Y$?: number) {
		this.X = X$ ?? 0
		this.Y = Y$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Inner {
		return new Inner(true, this.X, this.Y)
	}

	public __goscriptAssign(source: Inner): this {
		this.X = source.X
		this.Y = source.Y
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Inner",
		() => new Inner(),
		() => [],
		Inner,
		() => [{ name: "X", key: "X", type: /* @__PURE__ */ $.basicType("int") }, { name: "Y", key: "Y", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Outer {
	public declare In: Inner

	public declare Arr: number[]

	public declare Ptr: Inner | $.VarRef<Inner> | null

	public declare N: number

	constructor(__goscriptValue?: boolean, In$?: Inner, Arr$?: number[], Ptr$?: Inner | $.VarRef<Inner> | null, N$?: number) {
		this.In = In$ ?? new Inner(true)
		this.Arr = Arr$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0))
		this.Ptr = Ptr$ ?? (null! as Inner | $.VarRef<Inner> | null)
		this.N = N$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Outer {
		return new Outer(true, this.In.clone(), $.cloneArrayValue(this.Arr, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)), this.Ptr, this.N)
	}

	public __goscriptAssign(source: Outer): this {
		this.In.__goscriptAssign(source.In)
		this.Arr = $.assignFieldValue(this.Arr, source.Arr, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
		this.Ptr = source.Ptr
		this.N = source.N
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Outer",
		() => new Outer(),
		() => [],
		Outer,
		() => [{ name: "In", key: "In", type: "main.Inner" }, { name: "Arr", key: "Arr", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2) }, { name: "Ptr", key: "Ptr", type: /* @__PURE__ */ $.pointerType("main.Inner") }, { name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Pair {
	public declare Key: string

	public declare Val: any

	constructor(__goscriptValue?: boolean, Key$?: string, Val$?: any) {
		this.Key = Key$ ?? ""
		this.Val = Val$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Pair {
		return $.copyGenericInstance(this, new Pair(true, this.Key, $.copyElement(this.Val)))
	}

	public __goscriptAssign(source: Pair): this {
		this.Key = source.Key
		this.Val = $.assignFieldValue(this.Val, source.Val)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Pair",
		() => new Pair(),
		() => [],
		Pair,
		() => [{ name: "Key", key: "Key", type: /* @__PURE__ */ $.basicType("string") }, { name: "Val", key: "Val", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class Holder {
	public declare P: Pair

	constructor(__goscriptValue?: boolean, P$?: Pair) {
		this.P = P$ ?? new Pair(true, undefined, null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Holder {
		return $.copyGenericInstance(this, new Holder(true, this.P.clone()))
	}

	public __goscriptAssign(source: Holder): this {
		this.P.__goscriptAssign(source.P)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Holder",
		() => new Holder(),
		() => [],
		Holder,
		() => [{ name: "P", key: "P", type: "main.Pair" }]
	)
}

export class Event {
	public declare Kind: Kind

	constructor(__goscriptValue?: boolean, Kind$?: Kind) {
		this.Kind = Kind$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Event {
		return new Event(true, this.Kind)
	}

	public __goscriptAssign(source: Event): this {
		this.Kind = source.Kind
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Event",
		() => new Event(),
		() => [],
		Event,
		() => [{ name: "Kind", key: "Kind", type: /* @__PURE__ */ $.basicType("int", "main.Kind") }]
	)
}

export const KindStart: Kind = 1

export const KindValue: Kind = 2

export const KindEnd: Kind = 3

export let global: Outer = new Outer(true)

export function __goscript_set_global(__goscriptValue: Outer): void {
	$.assignStruct(global, __goscriptValue)
}

export function assignGeneric(__typeArgs: $.GenericTypeArgs | undefined, dst: Pair | $.VarRef<Pair> | null, src: Pair): void {
	$.assignStruct($.pointerValue<Pair>(dst), (src).clone())
}

export function make1(): Outer {
	return new Outer(true, new Inner(true, 1, 2), $.arrayValue([3, 4]), undefined, 5)
}

export function nextEvent(k: Kind): [Event, $.GoError] {
	return [new Event(true, k), null]
}

export async function main(): globalThis.Promise<void> {
	let a = $.varRef(make1())
	let b = new Outer(true)
	b = b.__goscriptAssign(a.value)
	a.value.In.X = 10
	a.value.Arr[0] = 30
	await $.println(b.In.X, b.Arr[0], a.value.In.X, a.value.Arr[0])

	let p: Outer | $.VarRef<Outer> | null = a
	a.value = a.value.__goscriptAssign($.pointerValue<Outer>(p))
	await $.println(a.value.In.X, a.value.N)

	let s = $.arrayToSlice<Outer>([make1(), make1()])
	$.sliceElems(s!)[$.sliceSlot(s!, 0)].__goscriptAssign($.arrayIndex(s!, 1))
	$.arrayIndex(s!, 1).In.Y = 20
	await $.println($.arrayIndex(s!, 0).In.Y, $.arrayIndex(s!, 1).In.Y)

	let sh = new Inner(false, 7, 8)
	a.value.Ptr = sh
	b = b.__goscriptAssign(a.value)
	$.pointerValue<Inner>(b.Ptr).X = 70
	await $.println($.pointerValue<Inner>(a.value.Ptr).X, $.pointerValue<Inner>(sh).X)

	global.__goscriptAssign(b)
	b.N = 50
	await $.println(global.N, b.N)

	let _in: Inner = new Inner(true)
	_in = _in.__goscriptAssign(a.value.In)
	a.value.In.Y = 99
	await $.println(_in.Y, a.value.In.Y)
	let g1 = new Pair(true, "a", new Inner(true, 1, 2))
	let g2: Pair = new Pair(true, undefined, new Inner(true))
	g2 = $.assignStruct(g2, (g1).clone())
	g1.Val.X = 11
	await $.println(g2.Val.X, g1.Val.X)
	let g3: $.VarRef<Pair> = $.varRef(new Pair(true, undefined, new Inner(true)))
	assignGeneric(__goscriptStatic0(), g3, g1)
	g1.Val.Y = 22
	await $.println(g3.value.Val.Y, g1.Val.Y)
	let h1 = new Holder(true, g1)
	let h2: Holder = new Holder(true)
	h2 = $.assignStruct(h2, (h1).clone())
	h1.P.Val.X = 33
	await $.println(h2.P.Val.X, h1.P.Val.X)
	let m = $.makeMap<string, Outer>([["k", (a.value).clone()]])
	let c = new Outer(true)
	c = c.__goscriptAssign($.mapGet<string, Outer, Outer>(m, "k", new Outer(true))[0])
	c.N = 77
	await $.println($.mapGet<string, Outer, Outer>(m, "k", new Outer(true))[0].N, c.N)

	// The kind tested before the loop does not decide the kind inside it.
	let [ev, err] = nextEvent(1)
	if (ev.Kind != 1) {
		return
	}
	for (let __goscriptRangeTarget0 = $.arrayToSlice<Kind>([2, 3]), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let k = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as Kind)
		let __goscriptTuple0: any = nextEvent(k)
		ev = ev.__goscriptAssign(__goscriptTuple0[0])
		err = __goscriptTuple0[1]
		switch (ev.Kind) {
			case 2:
			{
				await $.println("value", err == null)
				break
			}
			case 3:
			{
				await $.println("end")
				break
			}
		}
	}
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.Inner", zero: () => new Inner(true) }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

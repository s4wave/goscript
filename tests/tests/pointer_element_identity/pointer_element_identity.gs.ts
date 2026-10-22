// Generated file based on pointer_element_identity.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"
import * as slices from "@goscript/slices/index.js"
import * as atomic from "@goscript/sync/atomic/index.js"
import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/unsafe/index.js"

export class T {
	public declare A: number

	public declare B: number

	constructor(__goscriptValue?: boolean, A$?: number, B$?: number) {
		this.A = A$ ?? 0
		this.B = B$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): T {
		return new T(true, this.A, this.B)
	}

	public __goscriptAssign(source: T): this {
		this.A = source.A
		this.B = source.B
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.T",
		() => new T(),
		() => [],
		T,
		() => [/* @__PURE__ */ $.structField("A", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("B", /* @__PURE__ */ $.basicType("int"), [1], 8, true)]
	)
}

export class Inner {
	public declare X: number

	constructor(__goscriptValue?: boolean, X$?: number) {
		this.X = X$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Inner {
		return new Inner(true, this.X)
	}

	public __goscriptAssign(source: Inner): this {
		this.X = source.X
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Inner",
		() => new Inner(),
		() => [],
		Inner,
		() => [/* @__PURE__ */ $.structField("X", /* @__PURE__ */ $.basicType("float32"), [0], 0, true)]
	)
}

export class Outer {
	public declare N: number

	public declare In: Inner

	public declare Ts: T[]

	constructor(__goscriptValue?: boolean, N$?: number, In$?: Inner, Ts$?: T[]) {
		this.N = N$ ?? 0
		this.In = In$ ?? new Inner(true)
		this.Ts = Ts$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => new T(true)), /* @__PURE__ */ $.arrayType("main.T", 2))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Outer {
		return new Outer(true, this.N, this.In.clone(), $.cloneArrayValue(this.Ts, __goscriptStatic0()))
	}

	public __goscriptAssign(source: Outer): this {
		this.N = source.N
		this.In.__goscriptAssign(source.In)
		this.Ts = $.assignFieldValue(this.Ts, source.Ts, __goscriptStatic0())
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Outer",
		() => new Outer(),
		() => [],
		Outer,
		() => [/* @__PURE__ */ $.structField("N", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("In", "main.Inner", [1], 8, true), /* @__PURE__ */ $.structField("Ts", /* @__PURE__ */ $.arrayType("main.T", 2), [2], 16, true)]
	)
}

export class holder {
	public declare p: T | $.VarRef<T> | null

	constructor(__goscriptValue?: boolean, p$?: T | $.VarRef<T> | null) {
		this.p = p$ ?? (null! as T | $.VarRef<T> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): holder {
		return new holder(true, this.p)
	}

	public __goscriptAssign(source: holder): this {
		this.p = source.p
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		() => [],
		holder,
		() => [/* @__PURE__ */ $.structField("p", /* @__PURE__ */ $.pointerType("main.T"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/pointer_element_identity" })]
	)
}

export function elemPtr(s: $.Slice<T>, i: number): T | $.VarRef<T> | null {
	return $.indexRef(s!, i)
}

export function intPtr(s: $.Slice<number>, i: number): $.VarRef<number> | null {
	return $.indexRef(s!, i)
}

export function same(__typeArgs: $.GenericTypeArgs | undefined, a: any, b: any): boolean {
	return $.comparableEqual(a, b)
}

export function index<P>(__typeArgs: $.GenericTypeArgs | undefined, s: $.Slice<P>, v: any): number {
	for (let __goscriptRangeTarget0 = s, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
		let e = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + i] as any)
		if ($.comparableEqual(e, v)) {
			return i
		}
	}
	return -1
}

export function which(p: T | $.VarRef<T> | null, _in: $.Slice<T>): string {
	{
		let __goscriptSwitch0 = p
		switch ((true as boolean)) {
			case $.pointerEqual(__goscriptSwitch0, $.indexRef(_in!, 0)):
			{
				return "first"
				break
			}
			case $.pointerEqual(__goscriptSwitch0, $.indexRef(_in!, 1)):
			{
				return "second"
				break
			}
		}
	}
	return "none"
}

export async function main(): globalThis.Promise<void> {
	// Pointers to struct elements of a slice.
	let _in = $.arrayToSlice<T>([new T(true, 1, 2), new T(true, 3, 4)])
	let p = $.indexRef(_in!, 0)
	await $.println("struct direct", $.indexAddress(_in!, 0) == $.indexAddress(_in!, 0), $.pointerEqual(p, $.indexRef(_in!, 0)), $.indexAddress(_in!, 0) != $.indexAddress(_in!, 1))
	let dst = $.makeSlice<T | $.VarRef<T> | null>(2)
	$.sliceElems(dst!)[$.sliceSlot(dst!, 0)] = p
	await $.println("struct slice", $.pointerEqual($.arrayIndex(dst!, 0), $.indexRef(_in!, 0)), ($.arrayIndex(dst!, 0) === p || ($.pointerAliasesMade || ($.arrayIndex(dst!, 0) as any)?.__goElementBacking !== undefined) && $.pointerEqual($.arrayIndex(dst!, 0), p)))
	$.copy(dst, $.arrayToSlice<T | $.VarRef<T> | null>([$.indexRef(_in!, 0), $.indexRef(_in!, 1)]))
	await $.println("struct copy", $.pointerEqual($.arrayIndex(dst!, 0), $.indexRef(_in!, 0)), $.pointerEqual($.arrayIndex(dst!, 1), $.indexRef(_in!, 1)), ($.arrayIndex(dst!, 0) === $.arrayIndex(dst!, 1) || ($.pointerAliasesMade || ($.arrayIndex(dst!, 0) as any)?.__goElementBacking !== undefined) && $.pointerEqual($.arrayIndex(dst!, 0), $.arrayIndex(dst!, 1))))
	let m = $.makeMap<string, T | $.VarRef<T> | null>([["a", $.indexRef(_in!, 0)]])
	await $.println("struct map", $.pointerEqual($.mapGet<string, T | $.VarRef<T> | null, T | $.VarRef<T> | null>(m, "a", null)[0], $.indexRef(_in!, 0)), $.pointerEqual($.mapGet<string, T | $.VarRef<T> | null, T | $.VarRef<T> | null>(m, "a", null)[0], $.indexRef(_in!, 1)))
	let e1: any = $.interfaceValue($.indexRef(_in!, 0), "*main.T", /* @__PURE__ */ $.pointerType("main.T"))
	let e2: any = $.interfaceValue($.indexRef(_in!, 0), "*main.T", /* @__PURE__ */ $.pointerType("main.T"))
	await $.println("struct iface", $.comparableEqual(e1, e2), $.comparableEqual(e1, $.interfaceValue($.indexRef(_in!, 1), "*main.T", /* @__PURE__ */ $.pointerType("main.T"))))
	let h = new holder(true, $.indexRef(_in!, 1))
	await $.println("struct field", $.pointerEqual(h.p, $.indexRef(_in!, 1)), $.pointerEqual(h.p, elemPtr(_in, 1)), $.pointerEqual(elemPtr(_in, 0), elemPtr(_in, 0)))
	let sub = $.goSlice(_in, 1, undefined)
	await $.println("struct subslice", $.indexAddress(sub!, 0) == $.indexAddress(_in!, 1), $.indexAddress(sub!, 0) == $.indexAddress(_in!, 0))
	await $.println("struct generic", same(__goscriptStatic1(), $.arrayIndex(dst!, 1), $.indexRef(_in!, 1)), index(__goscriptStatic1(), dst, $.indexRef(_in!, 1)), which($.arrayIndex(dst!, 1), _in), which($.indexRef(_in!, 1), $.goSlice(_in, 1, undefined)), which($.indexRef(_in!, 0), _in))
	let keys = $.makeMap<T | $.VarRef<T> | null, number>([[$.indexRef(_in!, 0), 10]], /* @__PURE__ */ $.pointerType("main.T"))
	$.mapSet(keys, $.indexRef(_in!, 1), 11)
	await $.println("struct key", $.mapGet<T | $.VarRef<T> | null, number, number>(keys, $.indexRef(_in!, 0), 0)[0], $.mapGet<T | $.VarRef<T> | null, number, number>(keys, elemPtr(_in, 1), 0)[0], $.len(keys))
	class pair {
		public declare p: T | $.VarRef<T> | null

		constructor(init?: Partial<{p?: T | $.VarRef<T> | null}>, __goscriptValue?: boolean) {
			this.p = init?.p ?? (null! as T | $.VarRef<T> | null)
			;(this as any)[$.structValueMarker] = __goscriptValue === true
		}

		public clone(): pair {
			return new pair(this, true)
		}

		public __goscriptAssign(source: pair): this {
			this.p = source.p
			return this
		}

		static __typeInfo = $.registerStructType(
			"main.pair",
			() => new pair(),
			() => [],
			pair,
			() => [/* @__PURE__ */ $.structField("p", /* @__PURE__ */ $.pointerType("main.T"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/pointer_element_identity" })]
		)
	}
	let pairs = $.makeMap<pair, number>([[$.markAsStructValue(new pair({p: $.indexRef(_in!, 0)})), 1]])
	const __goscriptMap0 = pairs
	const __goscriptMapKey0 = $.markAsStructValue(new pair({p: $.indexRef(_in!, 0)}))
	$.mapSet(__goscriptMap0, __goscriptMapKey0, $.mapGet<pair, number, number>(__goscriptMap0, __goscriptMapKey0, 0)[0] + (1))
	await $.println("struct pair key", $.mapGet<pair, number, number>(pairs, (() => { const __goscriptLiteralField0 = elemPtr(_in, 0); return $.markAsStructValue(new pair({p: __goscriptLiteralField0})) })(), 0)[0], $.len(pairs), $.arrayEqual($.arrayValue([$.indexRef(_in!, 0)]), $.arrayValue([p])))

	// Pointers to numeric elements of slices, also typed slices.
	let ints = $.arrayToSlice<number>([5, 6, 7])
	let ip = $.indexRef(ints!, 1)
	await $.println("int", $.pointerEqual(ip, $.indexRef(ints!, 1)), $.pointerEqual(intPtr(ints, 2), $.indexRef(ints!, 2)), $.pointerEqual($.indexRef($.goSlice(ints, 1, undefined)!, 0), ip), $.pointerEqual(ip, $.indexRef(ints!, 0)))
	let fs = $.typedSliceOf(Float32Array, [1, 2, 3, 4]) as $.Slice<number>
	let fp = $.indexRef(fs!, 2)
	let fsub = $.goSlice(fs, 1, 3)
	await $.println("float32", $.pointerEqual(fp, $.indexRef(fs!, 2)), $.pointerEqual($.indexRef(fsub!, 1), fp), $.pointerEqual($.indexRef(fsub!, 0), fp))
	let ips = $.arrayToSlice<$.VarRef<number> | null>([$.indexRef(ints!, 0)])
	await $.println("int slice", $.pointerEqual($.arrayIndex(ips!, 0), $.indexRef(ints!, 0)))

	// Pointers to array elements.
	let arr = $.arrayValue([new T(true, 1, 1), new T(true, 2, 2), new T(true, 3, 3)], __goscriptStatic2())
	let ap = $.indexRef(arr, 1)
	let aps = $.arrayToSlice<T | $.VarRef<T> | null>([$.indexRef(arr, 1)])
	await $.println("array struct", $.pointerEqual(ap, $.indexRef(arr, 1)), ($.arrayIndex(aps!, 0) === ap || ($.pointerAliasesMade || ($.arrayIndex(aps!, 0) as any)?.__goElementBacking !== undefined) && $.pointerEqual($.arrayIndex(aps!, 0), ap)), $.pointerEqual($.indexRef(arr, 0), ap))
	let nums = $.arrayValue([1, 2, 3])
	let np = $.indexRef(nums, 2)
	let ne: any = $.interfaceValue(np, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))
	await $.println("array int", $.pointerEqual(np, $.indexRef(nums, 2)), $.comparableEqual(ne, $.interfaceValue($.indexRef(nums, 2), "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))), $.indexAddress(nums, 2) == $.indexAddress(nums, 1))

	// Pointers to struct fields.
	let o = new Outer(false, 1)
	let o$: Outer = o == null ? $.pointerTarget<Outer>(o) : (o as any).__isVarRef === true ? (o as any).value : (o as any).__goValue === undefined ? (o as any) : $.pointerTarget<Outer>(o)
	let fn = $.fieldRef((o$ as Outer), "N")
	let fi = $.fieldRef((o$ as Outer), "In")
	let fx = $.fieldRef((o$ as Outer).In, "X")
	let ptrs = $.makeMap<number, $.VarRef<number> | null>([[0, $.fieldRef((o$ as Outer), "N")]])
	await $.println("field", $.pointerEqual(fn, $.fieldRef((o$ as Outer), "N")), $.pointerEqual(fi, $.fieldRef((o$ as Outer), "In")), $.pointerEqual(fx, $.fieldRef((o$ as Outer).In, "X")), $.pointerEqual($.mapGet<number, $.VarRef<number> | null, $.VarRef<number> | null>(ptrs, 0, null)[0], fn), $.indexAddress((o$ as Outer).Ts, 1) == $.indexAddress((o$ as Outer).Ts, 1))
	let ov: Outer = new Outer(true)
	let ovp = $.fieldRef(ov, "N")
	await $.println("field local", $.pointerEqual(ovp, $.fieldRef(ov, "N")), $.pointerEqual($.fieldRef(ov, "In"), $.fieldRef(ov, "In")), $.indexAddress(ov.Ts, 0) != $.indexAddress(ov.Ts, 1))

	// Pointers through unsafe.Pointer and reflect.
	await $.println("unsafe", $.pointerEqual((p as any), ($.indexRef(_in!, 0) as any)), $.pointerEqual((ip as any), ($.indexRef(ints!, 1) as any)))
	await $.println("reflect", $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(p, "*main.T", /* @__PURE__ */ $.pointerType("main.T"))))).Pointer() == $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.indexRef(_in!, 0), "*main.T", /* @__PURE__ */ $.pointerType("main.T"))))).Pointer(), $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(ip, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))))).Pointer() == $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.indexRef(ints!, 0), "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))))).Pointer())

	// Pointers compared by the standard library.
	await $.println("slices", slices.Index(dst, $.indexRef(_in!, 1)), slices.Contains(ips, $.indexRef(ints!, 0)), $.sliceLen(slices.Compact($.arrayToSlice<T | $.VarRef<T> | null>([$.indexRef(_in!, 0), $.indexRef(_in!, 0), $.indexRef(_in!, 1)]), () => (null! as T | $.VarRef<T> | null as T | $.VarRef<T> | null))))
	let atom: $.VarRef<atomic.Pointer<T>> = $.varRef($.markAsStructValue(new atomic.Pointer<T>()))
	atom.value.Store($.indexRef(_in!, 0))
	await $.println("atomic", atom.value.CompareAndSwap($.indexRef(_in!, 0), $.indexRef(_in!, 1)), $.pointerEqual(atom.value.Load(), $.indexRef(_in!, 1)))
	let ch = $.makeChannel<T | $.VarRef<T> | null>(1, null! as T | $.VarRef<T> | null, "both")
	await $.chanSend(ch, $.indexRef(_in!, 0))
	await $.println("chan", $.pointerEqual(await $.chanRecv(ch), $.indexRef(_in!, 0)))

	// Writes through one pointer are seen through an equal one.
	$.pointerValue<T>($.arrayIndex(dst!, 0)).A = 99
	$.arrayIndex(ips!, 0)!.value = 55
	await $.println("writes", $.arrayIndex(_in!, 0).A, $.arrayIndex(ints!, 0))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType("main.T", 2))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, P: { type: /* @__PURE__ */ $.pointerType("main.T"), zero: () => null }})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (/* @__PURE__ */ $.arrayType("main.T", 3))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.T", zero: () => new T(true) }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on array_assign_in_place.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class T {
	public declare v: number

	constructor(__goscriptValue?: boolean, v$?: number) {
		this.v = v$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): T {
		return new T(true, this.v)
	}

	public __goscriptAssign(source: T): this {
		this.v = source.v
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.T",
		() => new T(),
		() => [],
		T,
		() => [{ name: "v", key: "v", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class S {
	public declare A: T[]

	public declare N: number[]

	constructor(__goscriptValue?: boolean, A$?: T[], N$?: number[]) {
		this.A = A$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => new T(true)), /* @__PURE__ */ $.arrayType("main.T", 2))
		this.N = N$ ?? $.arrayValue(globalThis.Array.from({ length: 3 }, () => 0))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): S {
		return new S(true, $.cloneArrayValue(this.A, /* @__PURE__ */ $.arrayType("main.T", 2)), $.cloneArrayValue(this.N, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3)))
	}

	public __goscriptAssign(source: S): this {
		this.A = $.assignFieldValue(this.A, source.A, /* @__PURE__ */ $.arrayType("main.T", 2))
		this.N = $.assignFieldValue(this.N, source.N, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3))
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.S",
		() => new S(),
		() => [],
		S,
		() => [{ name: "A", key: "A", type: /* @__PURE__ */ $.arrayType("main.T", 2) }, { name: "N", key: "N", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3) }]
	)
}

export let global: T[] = $.arrayValue(globalThis.Array.from({ length: 2 }, () => new T(true)), /* @__PURE__ */ $.arrayType("main.T", 2))

export function __goscript_set_global(__goscriptValue: T[]): void {
	global = $.assignFieldValue(global, __goscriptValue, /* @__PURE__ */ $.arrayType("main.T", 2))
}

export function pair(a: number, b: number): T[] {
	return $.arrayValue([new T(true, a), new T(true, b)], /* @__PURE__ */ $.arrayType("main.T", 2))
}

export async function main(): globalThis.Promise<void> {
	// A local array keeps its elements when assigned.
	let arr: $.VarRef<T[]> = $.varRef($.arrayValue(globalThis.Array.from({ length: 2 }, () => new T(true)), /* @__PURE__ */ $.arrayType("main.T", 2)))
	let p = $.indexRef(arr.value, 0)
	let p$: T = p == null ? $.pointerTarget<T>(p) : (p as any).__isVarRef === true ? (p as any).value : (p as any).__goValue === undefined ? (p as any) : $.pointerTarget<T>(p)
	arr.value = $.assignFieldValue(arr.value, $.arrayValue([new T(true, 1), new T(true, 2)], /* @__PURE__ */ $.arrayType("main.T", 2)), /* @__PURE__ */ $.arrayType("main.T", 2))
	await $.println("local:", (p$ as T).v)
	let other = pair(3, 4)
	arr.value = $.assignFieldValue(arr.value, other, /* @__PURE__ */ $.arrayType("main.T", 2))
	other[0].v = 99
	await $.println("copy:", (p$ as T).v, arr.value[0].v)
	arr.value = $.assignFieldValue(arr.value, $.arrayValue([(arr.value[1]).clone(), (arr.value[0]).clone()], /* @__PURE__ */ $.arrayType("main.T", 2)), /* @__PURE__ */ $.arrayType("main.T", 2))
	await $.println("swap:", arr.value[0].v, arr.value[1].v, (p$ as T).v)

	// Fields, through pointers too, and package variables.
	let s: $.VarRef<S> = $.varRef(new S(true))
	let q = $.indexRef(s.value.A, 1)
	let q$: T = q == null ? $.pointerTarget<T>(q) : (q as any).__isVarRef === true ? (q as any).value : (q as any).__goValue === undefined ? (q as any) : $.pointerTarget<T>(q)
	$.assignFieldValue(s.value.A, pair(5, 6), /* @__PURE__ */ $.arrayType("main.T", 2))
	let n = $.indexRef(s.value.N, 2)
	$.assignFieldValue(s.value.N, $.arrayValue([7, 8, 9]), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3))
	await $.println("field:", (q$ as T).v, $.pointerValue<number>(n))
	let ps = s
	$.assignFieldValue($.pointerValue<S>(ps).A, pair(10, 11), /* @__PURE__ */ $.arrayType("main.T", 2))
	await $.println("through pointer:", (q$ as T).v)
	let g = $.indexRef(global, 0)
	$.assignFieldValue(global, pair(12, 13), /* @__PURE__ */ $.arrayType("main.T", 2))
	await $.println("global:", $.pointerValue<T>(g).v)

	// Assignment through a pointer to the array, and to elements of slices
	// and arrays of arrays.
	let pa = arr
	let e = $.indexRef($.pointerValue<T[]>(pa), 1)
	$.assignFieldValue($.pointerValue<T[]>(pa), pair(14, 15), /* @__PURE__ */ $.arrayType("main.T", 2))
	await $.println("deref:", $.pointerValue<T>(e).v)
	let slice = $.arrayToSlice<T[]>([$.arrayValue(globalThis.Array.from({ length: 2 }, () => new T(true)), /* @__PURE__ */ $.arrayType("main.T", 2))])
	let f = $.indexRef($.arrayIndex(slice!, 0), 0)
	$.assignFieldValue($.sliceElems(slice!)[$.sliceSlot(slice!, 0)], pair(16, 17), /* @__PURE__ */ $.arrayType("main.T", 2))
	await $.println("slice element:", $.pointerValue<T>(f).v)
	let nested = $.arrayValue(globalThis.Array.from({ length: 2 }, () => $.arrayValue(globalThis.Array.from({ length: 2 }, () => new T(true)), /* @__PURE__ */ $.arrayType("main.T", 2))), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType("main.T", 2), 2))
	let h = $.indexRef(nested[1], 1)
	let h$: T = h == null ? $.pointerTarget<T>(h) : (h as any).__isVarRef === true ? (h as any).value : (h as any).__goValue === undefined ? (h as any) : $.pointerTarget<T>(h)
	$.assignFieldValue(nested[1], pair(0, 18), /* @__PURE__ */ $.arrayType("main.T", 2))
	await $.println("nested:", (h$ as T).v)
	nested = $.assignFieldValue(nested, $.arrayValue([$.arrayValue(globalThis.Array.from({ length: 2 }, () => new T(true)), /* @__PURE__ */ $.arrayType("main.T", 2)), pair(0, 19)], /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType("main.T", 2), 2)), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType("main.T", 2), 2))
	await $.println("nested whole:", (h$ as T).v)

	// Tuple assignment, receives, map reads and basic element types.
	let x: T[] = $.arrayValue(globalThis.Array.from({ length: 2 }, () => new T(true)), /* @__PURE__ */ $.arrayType("main.T", 2))
	let y: T[] = $.arrayValue(globalThis.Array.from({ length: 2 }, () => new T(true)), /* @__PURE__ */ $.arrayType("main.T", 2))
	let r = $.indexRef(x, 0)
	let r$: T = r == null ? $.pointerTarget<T>(r) : (r as any).__isVarRef === true ? (r as any).value : (r as any).__goValue === undefined ? (r as any) : $.pointerTarget<T>(r)
	y[0].v = 20
	let __goscriptAssign0_0: T[] = $.cloneArrayValue(y, /* @__PURE__ */ $.arrayType("main.T", 2))
	let __goscriptAssign0_1: T[] = $.cloneArrayValue(x, /* @__PURE__ */ $.arrayType("main.T", 2))
	x = $.assignFieldValue(x, __goscriptAssign0_0, /* @__PURE__ */ $.arrayType("main.T", 2))
	y = $.assignFieldValue(y, __goscriptAssign0_1, /* @__PURE__ */ $.arrayType("main.T", 2))
	await $.println("tuple:", (r$ as T).v)
	let ch = $.makeChannel<T[]>(1, $.arrayValue(globalThis.Array.from({ length: 2 }, () => new T(true)), /* @__PURE__ */ $.arrayType("main.T", 2)), "both")
	await $.chanSend(ch, pair(21, 22))
	x = $.assignFieldValue(x, await $.chanRecv(ch), /* @__PURE__ */ $.arrayType("main.T", 2))
	await $.println("receive:", (r$ as T).v)
	let m = $.makeMap<number, T[]>([[1, pair(23, 24)]])
	let __goscriptTuple0: any = $.mapGet<number, T[], T[]>(m, 1, $.arrayValue(globalThis.Array.from({ length: 2 }, () => new T(true)), /* @__PURE__ */ $.arrayType("main.T", 2)))
	x = $.assignFieldValue(x, __goscriptTuple0[0], /* @__PURE__ */ $.arrayType("main.T", 2))
	x[0].v++
	await $.println("map:", (r$ as T).v, ($.mapGet<number, T[], T[]>(m, 1, $.arrayValue(globalThis.Array.from({ length: 2 }, () => new T(true)), /* @__PURE__ */ $.arrayType("main.T", 2)))[0])[0].v)
	let floats = $.arrayValue(globalThis.Array.from({ length: 3 }, () => 0), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 3))
	let fp = $.indexRef(floats, 1)
	floats = $.assignFieldValue(floats, $.arrayValue([1, 2.5, 3], /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 3)), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 3))
	let words = $.arrayValue(globalThis.Array.from({ length: 2 }, () => ""))
	let wp = $.indexRef(words, 1)
	words = $.assignFieldValue(words, $.arrayValue(["a", "b"]), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("string"), 2))
	await $.println("basic:", $.pointerValue<number>(fp), $.pointerValue<string>(wp))
}

if ($.isMainScript(import.meta)) {
	await main()
}

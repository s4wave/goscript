// Generated file based on append_field_pointers.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Getter = {
	Get(): number
}

$.registerInterfaceType(
	"main.Getter",
	null,
	[{ name: "Get", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export class T {
	public declare N: number

	constructor(__goscriptValue?: boolean, N$?: number) {
		this.N = N$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): T {
		return new T(true, this.N)
	}

	public __goscriptAssign(source: T): this {
		this.N = source.N
		return this
	}

	public Get(): number {
		const t: T | $.VarRef<T> | null = this;
		return $.pointerValue<T>(t).N
	}

	public Register(): void {
		const t: T | $.VarRef<T> | null = this;
		registry = $.appendOne(registry, $.interfaceValue<Getter | null>(t, "*main.T", /* @__PURE__ */ $.pointerType("main.T")), $.appendZeros.nil)
		ptrs = $.appendOne(ptrs, t, $.appendZeros.nil)
	}

	static __typeInfo = $.registerStructType(
		"main.T",
		() => new T(),
		() => [{ name: "Get", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }, { name: "Register", args: [], returns: [], pointerReceiver: true }],
		T,
		() => [{ name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Outer {
	public declare T: T

	public declare X: number

	constructor(__goscriptValue?: boolean, T$?: T, X$?: number) {
		this.T = T$ ?? new T(true)
		this.X = X$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Outer {
		return new Outer(true, this.T.clone(), this.X)
	}

	public __goscriptAssign(source: Outer): this {
		this.T.__goscriptAssign(source.T)
		this.X = source.X
		return this
	}

	public Get(): any {
		return $.pointerValue<T>(this.T).Get()
	}

	public Register(): any {
		return T.prototype.Register.call($.fieldRef(this, "T"))
	}

	static __typeInfo = $.registerStructType(
		"main.Outer",
		() => new Outer(),
		() => [{ name: "Get", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }, { name: "Register", args: [], returns: [], pointerReceiver: true }],
		Outer,
		() => [{ name: "T", key: "T", type: "main.T", anonymous: true }, { name: "X", key: "X", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Pair {
	public declare A: T

	public declare B: T

	constructor(__goscriptValue?: boolean, A$?: T, B$?: T) {
		this.A = A$ ?? new T(true)
		this.B = B$ ?? new T(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Pair {
		return new Pair(true, this.A.clone(), this.B.clone())
	}

	public __goscriptAssign(source: Pair): this {
		this.A.__goscriptAssign(source.A)
		this.B.__goscriptAssign(source.B)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Pair",
		() => new Pair(),
		() => [],
		Pair,
		() => [{ name: "A", key: "A", type: "main.T" }, { name: "B", key: "B", type: "main.T" }]
	)
}

export let registry: $.Slice<Getter | null> = null! as $.Slice<Getter | null>

export function __goscript_set_registry(__goscriptValue: $.Slice<Getter | null>): void {
	registry = __goscriptValue
}

export let ptrs: $.Slice<T | $.VarRef<T> | null> = null! as $.Slice<T | $.VarRef<T> | null>

export function __goscript_set_ptrs(__goscriptValue: $.Slice<T | $.VarRef<T> | null>): void {
	ptrs = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	// Appends that grow the slices keep the pointers to the fields.
	let out = new Outer()
	T.prototype.Register.call($.fieldRef($.pointerValue<Outer>(out), "T"))
	let p = new Pair()
	let p$: Pair = p == null ? $.pointerTarget<Pair>(p) : (p as any).__isVarRef === true ? (p as any).value : (p as any).__goValue === undefined ? (p as any) : $.pointerTarget<Pair>(p)
	T.prototype.Register.call($.fieldRef((p$ as Pair), "A"))
	T.prototype.Register.call($.fieldRef((p$ as Pair), "B"))
	let local: $.VarRef<Outer> = $.varRef(new Outer(true))
	T.prototype.Register.call($.fieldRef(local.value, "T"))

	// Appending the slices to others keeps them too.
	let all = $.appendSlice<Getter | null>(null, registry, $.appendZeros.nil)
	let allPtrs = $.appendSlice($.goSlice(ptrs, undefined, 0, 0), ptrs, $.appendZeros.nil)

	// The fields that change are the ones the slices point to.
	$.pointerValue<Outer>(out).T.N = 1;
	;(p$ as Pair).A.N = 2;
	;(p$ as Pair).B.N = 3
	local.value.T.N = 4
	for (let __goscriptRangeTarget0 = registry, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __goscriptSliceWindow0 = $.sliceRange(all), __goscriptSliceWindow1 = $.sliceRange(allPtrs), i = 0; i < __goscriptRangeWindow0.length; i++) {
		let g = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + i] as Getter | null)
		await $.println(i, (__goscriptAwait = (g !== null && (g as any).__isVarRef !== true && ((g as any).__goValue === undefined || (g as any).__goType?.charCodeAt(0) !== 42) ? (g as Exclude<Getter, null>) : $.pointerValue<Exclude<Getter, null>>(g)).Get(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), $.pointerValue<T>($.arrayIndex(ptrs!, i)).N, (__goscriptAwait = $.pointerValue<Exclude<Getter, null>>(((__goscriptSliceWindow0.backing as any[])[$.windowSlot(__goscriptSliceWindow0, i)] as Getter | null)).Get(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), $.pointerValue<T>(((__goscriptSliceWindow1.backing as any[])[$.windowSlot(__goscriptSliceWindow1, i)] as T | $.VarRef<T> | null)).N)
	}
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on incdec_wrap_round.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class counters {
	public declare I8: number

	public declare U16: number

	public declare F: number

	constructor(__goscriptValue?: boolean, I8$?: number, U16$?: number, F$?: number) {
		this.I8 = I8$ ?? 0
		this.U16 = U16$ ?? 0
		this.F = F$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): counters {
		return new counters(true, this.I8, this.U16, this.F)
	}

	public __goscriptAssign(source: counters): this {
		this.I8 = source.I8
		this.U16 = source.U16
		this.F = source.F
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.counters",
		() => new counters(),
		() => [],
		counters,
		() => [{ name: "I8", key: "I8", type: /* @__PURE__ */ $.basicType("int8") }, { name: "U16", key: "U16", type: /* @__PURE__ */ $.basicType("uint16") }, { name: "F", key: "F", type: /* @__PURE__ */ $.basicType("float32") }]
	)
}

export function appendOf<T>(__typeArgs: $.GenericTypeArgs | undefined, s: $.Slice<T>, v: $.Slice<T>): $.Slice<T> {
	return $.appendSlice(s, v, $.appendZero(() => ($.genericZero(__typeArgs, "T", null) as T)))
}

export async function index(): globalThis.Promise<number> {
	await $.println("index evaluated")
	return 0
}

export async function main(): globalThis.Promise<void> {
	// Variables and struct fields.
	let vf = $.varRef(1.6777216e+07)
	vf.value = globalThis.Math.fround(vf.value + 1)
	let vu = 0
	vu = ((vu - 1) & 0xffff)
	let vi = -2147483648
	vi = ((vi - 1) | 0)
	let c = new counters(true, 127, undefined, 1.6777216e+07)
	c.I8 = ((c.I8 + 1) << 24 >> 24)
	c.U16 = ((c.U16 - 1) & 0xffff)
	c.F = globalThis.Math.fround(c.F + 1)
	await $.println("vars:", vf.value == 1.6777216e+07, vu, vi, c.I8, c.U16, c.F == 1.6777216e+07)

	// 64-bit integers, which are bigints or wide numbers.
	let i64 = 9223372036854775807n
	i64 = $.int64Add(i64, 1n)
	let u64 = 0n
	u64 = $.uint64Sub(u64, 1n)
	let u = 0
	u = $.wideUintSub(u, 1)
	await $.println("wide:", i64, u64, u)

	// Elements of slices held in plain and in typed arrays, and of arrays.
	let gi = (appendOf(__goscriptStatic0(), null, ($.typedSliceOf(Int32Array, [2147483647]) as $.Slice<number>)) as $.Slice<number>)
	$.sliceElems(gi!)[$.sliceSlot(gi!, 0)] = (($.sliceElems(gi!)[$.sliceSlot(gi!, 0)] + 1) | 0)
	let gb = (appendOf(__goscriptStatic1(), null, $.arrayToSlice<number>([255, 0])) as $.Slice<number>)
	$.sliceElems(gb!)[$.sliceSlot(gb!, 0)] = (($.sliceElems(gb!)[$.sliceSlot(gb!, 0)] + 1) & 0xff)
	$.sliceElems(gb!)[$.sliceSlot(gb!, 1)] = (($.sliceElems(gb!)[$.sliceSlot(gb!, 1)] - 1) & 0xff)
	let gf = (appendOf(__goscriptStatic2(), null, ($.typedSliceOf(Float32Array, [1.6777216e+07]) as $.Slice<number>)) as $.Slice<number>)
	$.sliceElems(gf!)[$.sliceSlot(gf!, 0)] = globalThis.Math.fround($.sliceElems(gf!)[$.sliceSlot(gf!, 0)] + 1)
	let ti = $.arrayToSlice<number>([32767])
	$.sliceElems(ti!)[$.sliceSlot(ti!, 0)] = (($.sliceElems(ti!)[$.sliceSlot(ti!, 0)] + 1) << 16 >> 16)
	let arr = $.arrayValue(new Uint8Array([255, 0]))
	arr[0] = ((arr[0] + 1) & 0xff)
	arr[1] = ((arr[1] - 1) & 0xff)
	await $.println("elements:", $.typedSliceIndex(gi!, 0), $.typedSliceIndex(gb!, 0), $.typedSliceIndex(gb!, 1), $.typedSliceIndex(gf!, 0) == 1.6777216e+07, $.typedSliceIndex(ti!, 0), arr[0], arr[1])

	// Through pointers, with the target evaluated once.
	let pi = $.indexRef(gi!, 0)
	pi!.value = ((pi!.value - 1) | 0)
	let pf = vf
	pf!.value = globalThis.Math.fround(pf!.value + 1)
	let pu = $.fieldRef(c, "U16")
	pu!.value = ((pu!.value + 1) & 0xffff)
	let gu = (appendOf(__goscriptStatic3(), null, ($.typedSliceOf(Uint32Array, [0]) as $.Slice<number>)) as $.Slice<number>)
	const __goscriptOperand0 = await index()
	$.sliceElems(gu!)[$.sliceSlot(gu!, __goscriptOperand0)] = (($.sliceElems(gu!)[$.sliceSlot(gu!, __goscriptOperand0)] - 1) >>> 0)
	await $.println("pointers:", $.typedSliceIndex(gi!, 0), vf.value == 1.6777216e+07, c.U16, $.typedSliceIndex(gu!, 0))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int32"), zero: () => 0 }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("uint8"), zero: () => 0 }})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("float32"), zero: () => 0 }})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("uint32"), zero: () => 0 }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

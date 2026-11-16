// Generated file based on range_index_window_access.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class P {
	public declare X: number

	public declare Y: number

	constructor(__goscriptValue?: boolean, X$?: number, Y$?: number) {
		this.X = X$ ?? 0
		this.Y = Y$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): P {
		return new P(true, this.X, this.Y)
	}

	public __goscriptAssign(source: P): this {
		this.X = source.X
		this.Y = source.Y
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.P",
		() => new P(),
		() => [],
		P,
		() => [{ name: "X", key: "X", type: /* @__PURE__ */ $.basicType("float32") }, { name: "Y", key: "Y", type: /* @__PURE__ */ $.basicType("float32") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let xs = ($.typedSliceOf(Float64Array, [1, 2, 3, 4]) as $.Slice<number>)
	for (let __goscriptRangeTarget0 = xs, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
		;(__goscriptRangeWindow0.backing as any[])[__goscriptRangeWindow0.offset + i] = (((__goscriptRangeWindow0.backing as any[])[__goscriptRangeWindow0.offset + i] as number) * 2) + 1
	}
	await $.println($.typedSliceIndex(xs!, 0), $.typedSliceIndex(xs!, 3))

	let sub = $.goSlice(xs, 1, 3)
	for (let __goscriptRangeTarget1 = sub, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), i = 0; i < __goscriptRangeWindow1.length; i++) {
		;(__goscriptRangeWindow1.backing as any[])[__goscriptRangeWindow1.offset + i] += 100
	}
	await $.println($.typedSliceIndex(xs!, 1), $.typedSliceIndex(xs!, 2), $.sliceLen(sub))

	let ps = $.arrayToSlice<P>([new P(true, 1, 2), new P(true, 3, 4)])
	for (let __goscriptRangeTarget2 = ps, __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), i = 0; i < __goscriptRangeWindow2.length; i++) {
		let p = ((__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + i] as P)).clone();
		;((__goscriptRangeWindow2.backing as any[])[__goscriptRangeWindow2.offset + i] as P).X = globalThis.Math.fround(p.Y * 2)
		let q = (((__goscriptRangeWindow2.backing as any[])[__goscriptRangeWindow2.offset + i] as P)).clone()
		q.Y = 99
	}
	await $.println($.plainSliceIndex(ps!, 0).X, $.plainSliceIndex(ps!, 0).Y, $.plainSliceIndex(ps!, 1).X)

	let m = $.arrayToSlice<$.Slice<number>>([$.arrayToSlice<number>([1, 2]), $.arrayToSlice<number>([3, 4])])
	for (let __goscriptRangeTarget4 = m, __goscriptRangeWindow3 = $.sliceRange(__goscriptRangeTarget4), i = 0; i < __goscriptRangeWindow3.length; i++) {
		for (let __goscriptRangeTarget3 = ((__goscriptRangeWindow3.backing as any[])[__goscriptRangeWindow3.offset + i] as $.Slice<number>), __goscriptRangeWindow4 = $.sliceRange(__goscriptRangeTarget3), j = 0; j < __goscriptRangeWindow4.length; j++) {
			$.indexRef(((__goscriptRangeWindow3.backing as any[])[__goscriptRangeWindow3.offset + i] as $.Slice<number>)!, j).value *= 10
		}
	}
	await $.println($.plainSliceIndex($.plainSliceIndex(m!, 0)!, 1), $.plainSliceIndex($.plainSliceIndex(m!, 1)!, 0))

	let ys: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3])
	let grow = $.functionValue(() => {
		ys = $.appendOne(ys, 9)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
	for (let __goscriptRangeTarget5 = ys, __goscriptRangeWindow5 = $.sliceRange(__goscriptRangeTarget5), i = 0; i < __goscriptRangeWindow5.length; i++) {
		if (i == 0) {
			grow()
		}
		$.sliceElems(ys!)[$.sliceSlot(ys!, i)] += 1
	}
	await $.println($.sliceLen(ys), $.plainSliceIndex(ys!, 0), $.plainSliceIndex(ys!, 2), $.plainSliceIndex(ys!, 3))

	let bs = new Uint8Array([250, 251]) as $.Slice<number>
	for (let __goscriptRangeTarget6 = bs, __goscriptRangeWindow6 = $.sliceRange(__goscriptRangeTarget6), i = 0; i < __goscriptRangeWindow6.length; i++) {
		;(__goscriptRangeWindow6.backing as any[])[__goscriptRangeWindow6.offset + i] = $.uint((__goscriptRangeWindow6.backing as any[])[__goscriptRangeWindow6.offset + i] + (10), 8)
	}
	await $.println($.typedSliceIndex(bs!, 0), $.typedSliceIndex(bs!, 1))

	let f32 = 1
	for (let i = 0; i < 3; i++) {
		f32 = globalThis.Math.fround((globalThis.Math.fround(f32 * 1.100000023841858)) + (globalThis.Math.fround(globalThis.Math.fround(i) / 3)))
	}
	await $.println($.int(globalThis.Math.fround(f32 * 1e+06)))
}

if ($.isMainScript(import.meta)) {
	await main()
}

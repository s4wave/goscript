// Generated file based on nil_elem_array_typed_slice_index.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type K = number

export class R {
	public declare N: number

	constructor(__goscriptValue?: boolean, N$?: number) {
		this.N = N$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): R {
		return new R(true, this.N)
	}

	public __goscriptAssign(source: R): this {
		this.N = source.N
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.R",
		() => new R(),
		() => [],
		R,
		() => [{ name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function _get(i: number): R | $.VarRef<R> | null {
	if (i == 0) {
		return null
	}
	return new R(false, i)
}

export async function main(): globalThis.Promise<void> {
	let res = $.arrayValue(globalThis.Array.from({ length: 2 }, (): R | $.VarRef<R> | null => null))
	for (let __goscriptRangeTarget0 = res, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
		res[i] = _get(i)
	}
	await $.println(res[0] == null, $.pointerValue<R>(res[1]).N)

	let values = $.arrayToSlice<$.Slice<number>>([new Uint8Array([1]) as $.Slice<number>, new Uint8Array([2, 3]) as $.Slice<number>])
	let hashes = $.makeSlice<$.Slice<number>>($.sliceLen(values))
	for (let __goscriptRangeTarget1 = values, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __goscriptSliceWindow0 = $.sliceRange(hashes), i = 0; i < __goscriptRangeWindow1.length; i++) {
		let v = (__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + i] as $.Slice<number>);
		;(__goscriptSliceWindow0.backing as any[])[$.windowSlot(__goscriptSliceWindow0, i)] = v
	}
	await $.println($.sliceLen($.plainSliceIndex(hashes!, 1)))

	let k = $.typedSliceIndex(($.typedSliceOf(Int32Array, [2, 3, 4]) as $.Slice<K>)!, 1 + ($.sliceLen(hashes) % 2))
	await $.println(k)
}

if ($.isMainScript(import.meta)) {
	await main()
}

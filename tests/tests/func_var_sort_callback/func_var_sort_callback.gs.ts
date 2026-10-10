// Generated file based on func_var_sort_callback.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as cmp from "@goscript/cmp/index.js"

import * as slices from "@goscript/slices/index.js"
import "@goscript/cmp/index.js"
import "@goscript/slices/index.js"

export function order(prev: $.Slice<string>, hosts: $.Slice<string>): $.Slice<string> {
	let ranks: globalThis.Map<string, number> | null = $.makeMap<string, number>([])
	for (let i = $.len(prev) - 1; i >= 0; i--) {
		$.mapSet(ranks, $.arrayIndex(prev!, i), i)
	}
	let known = $.len(prev)

	let rank: ((host: string) => number | globalThis.Promise<number>) | null = $.functionValue((host: string): number => {
		{
			let [__goscriptShadow0, ok] = $.mapGet<string, number, number>(ranks, host, 0)
			if (ok) {
				return __goscriptShadow0
			}
		}
		return known
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	let ordered: $.Slice<string> = (slices.Clone(hosts) as $.Slice<string>)
	slices.SortStableFunc(ordered, $.functionValue((a: string, b: string): number => {
		return cmp.Compare($.syncResult(rank!(a)), $.syncResult(rank!(b)))
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)))
	return ordered
}

export async function main(): globalThis.Promise<void> {
	for (let __goscriptRangeTarget0 = order($.arrayToSlice<string>(["c", "a"]), $.arrayToSlice<string>(["x", "a", "y", "c"])), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let host = __goscriptRangeTarget0![__rangeIndex]
		await $.println(host)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on package_import_slices.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as maps from "@goscript/maps/index.js"

import * as slices from "@goscript/slices/index.js"

import type * as iter from "@goscript/iter/index.js"
import "@goscript/maps/index.js"
import "@goscript/slices/index.js"

export async function main(): globalThis.Promise<void> {
	let s: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3, 4, 5])

	// This should trigger the interface range issue
	// slices.All returns an iterator interface that can be ranged over
	let __goscriptRangeReturn0 = false
	;await (async () => {
		await slices.All(s)!(async (i, v) => {
			await $.println("index:", i, "value:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn0) {
		return
	}
	let __goscriptRangeReturn1 = false
	;await (async () => {
		await slices.Backward(s)!(async (i, v) => {
			if (i < 3) {
				return false
			}
			await $.println("backward:", i, v)
			return true
		})
	})()
	if (__goscriptRangeReturn1) {
		return
	}

	let cloned: $.Slice<number> = (slices.Clone(s) as $.Slice<number>)
	cloned![0] = 99
	await $.println("clone first:", $.arrayIndex(cloned!, 0), "original first:", $.arrayIndex(s!, 0), "same len:", $.len(cloned) == $.len(s))
	let nilSlice: $.Slice<number> = null! as $.Slice<number>
	await $.println("nil clone:", slices.Clone(nilSlice) == null)

	await $.println("equal:", slices.Equal($.arrayToSlice<number>([1, 2]), $.arrayToSlice<number>([1, 2])), slices.Equal($.arrayToSlice<number>([1]), $.arrayToSlice<number>([2])))
	await $.println("equal func:", slices.EqualFunc($.arrayToSlice<number>([1, 3]), $.arrayToSlice<number>([5, 7]), $.functionValue((a: number, b: number): boolean => {
		return (a % 2) == (b % 2)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))))
	await $.println("contains:", slices.Contains(s, 3), slices.ContainsFunc(s, $.functionValue((v: number): boolean => {
		return v > 4
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))))
	let inserted: $.Slice<number> = (slices.Insert($.arrayToSlice<number>([1, 4]), 1, 2, 3) as $.Slice<number>)
	await $.println("insert:", $.arrayIndex(inserted!, 0), $.arrayIndex(inserted!, 1), $.arrayIndex(inserted!, 2), $.arrayIndex(inserted!, 3))
	slices.Reverse(inserted)
	await $.println("reverse:", $.arrayIndex(inserted!, 0), $.arrayIndex(inserted!, 1), $.arrayIndex(inserted!, 2), $.arrayIndex(inserted!, 3))
	await $.println("is sorted:", slices.IsSorted($.arrayToSlice<number>([1, 2, 3])), slices.IsSorted($.arrayToSlice<number>([1, 3, 2])))

	class item {
		public declare group: number

		public declare label: string

		public _fields: {
			group: number
			label: string
		}

		constructor(init?: Partial<{group?: number, label?: string}>) {
			this._fields = {
				group: init?.group ?? (0 as number),
				label: init?.label ?? ("" as string)
			}
		}

		public clone(): item {
			return $.markAsStructValue(new item(this))
		}

		static {
			$.bindStructFields(this.prototype, ["group", "label"])
		}

		static __typeInfo = $.registerStructType(
			"main.item",
			() => new item(),
			() => [],
			item,
			() => [{ name: "group", key: "group", type: /* @__PURE__ */ $.basicType("int") }, { name: "label", key: "label", type: /* @__PURE__ */ $.basicType("string") }]
		)
	}
	let stable: $.Slice<item> = $.arrayToSlice<item>([$.markAsStructValue(new item({group: 2, label: "a"})), $.markAsStructValue(new item({group: 1, label: "b"})), $.markAsStructValue(new item({group: 2, label: "c"})), $.markAsStructValue(new item({group: 1, label: "d"}))])
	slices.SortStableFunc(stable, $.functionValue((a: item, b: item): number => {
		return a.group - b.group
	}, ({ kind: $.TypeKind.Function, params: ["main.item", "main.item"], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)))
	await $.println("stable:", $.arrayIndex(stable!, 0).label, $.arrayIndex(stable!, 1).label, $.arrayIndex(stable!, 2).label, $.arrayIndex(stable!, 3).label)
	await $.println("is sorted func:", slices.IsSortedFunc(stable, $.functionValue((a: item, b: item): number => {
		return a.group - b.group
	}, ({ kind: $.TypeKind.Function, params: ["main.item", "main.item"], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))))

	let filtered: $.Slice<number> = (await slices.DeleteFunc($.arrayToSlice<number>([1, 2, 3, 4, 5]), $.functionValue((v: number): boolean => {
		return (v % 2) == 0
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))) as $.Slice<number>)
	await $.println("delete func:", $.arrayIndex(filtered!, 0), $.arrayIndex(filtered!, 1), $.arrayIndex(filtered!, 2), $.len(filtered))

	let sortedKeys: $.Slice<string> = (slices.Sorted(maps.Keys($.makeMap<string, number>([["c", 3], ["a", 1], ["b", 2]]))) as $.Slice<string>)
	await $.println("sorted:", $.arrayIndex(sortedKeys!, 0), $.arrayIndex(sortedKeys!, 1), $.arrayIndex(sortedKeys!, 2))

	let __goscriptRangeReturn2 = false
	;await (async () => {
		await slices.Values(s)!(async (v) => {
			await $.println("value:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn2) {
		return
	}
	let __goscriptRangeReturn3 = false
	;await (async () => {
		await slices.Values(s)!(async (v) => {
			if (v > 2) {
				return false
			}
			await $.println("value stop:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn3) {
		return
	}
	let valueCount = 0
	let __goscriptRangeReturn4 = false
	;await (async () => {
		await slices.Values(nilSlice)!(async (__goscriptRange4_0) => {
			valueCount++
			return true
		})
	})()
	if (__goscriptRangeReturn4) {
		return
	}
	await $.println("nil values:", valueCount)
	let sortedValues: $.Slice<string> = (slices.Sorted(slices.Values($.arrayToSlice<string>(["c", "a", "b"]))) as $.Slice<string>)
	await $.println("sorted values:", $.arrayIndex(sortedValues!, 0), $.arrayIndex(sortedValues!, 1), $.arrayIndex(sortedValues!, 2))

	let repeated: $.Slice<number> = (slices.Repeat($.arrayToSlice<number>([7, 8]), 3) as $.Slice<number>)
	await $.println("repeat:", $.len(repeated), $.cap(repeated), $.arrayIndex(repeated!, 0), $.arrayIndex(repeated!, 5), slices.Repeat(null, 2) == null, $.len(slices.Repeat($.arrayToSlice<number>([1]), 0)))

	let sortedFunc: $.Slice<number> = (await slices.SortedFunc(slices.Values($.arrayToSlice<number>([1, 3, 2])), $.functionValue((a: number, b: number): number => {
		return b - a
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))) as $.Slice<number>)
	await $.println("sorted func:", $.arrayIndex(sortedFunc!, 0), $.arrayIndex(sortedFunc!, 1), $.arrayIndex(sortedFunc!, 2), await slices.SortedFunc(slices.Values($.arrayToSlice<number>([])), $.functionValue((a: number, b: number): number => {
		return a - b
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))) == null)

	let stableSeq: $.Slice<item> = (await slices.SortedStableFunc(slices.Values($.arrayToSlice<item>([$.markAsStructValue(new item({group: 2, label: "a"})), $.markAsStructValue(new item({group: 1, label: "b"})), $.markAsStructValue(new item({group: 2, label: "c"})), $.markAsStructValue(new item({group: 1, label: "d"}))])), $.functionValue((a: item, b: item): number => {
		return a.group - b.group
	}, ({ kind: $.TypeKind.Function, params: ["main.item", "main.item"], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))) as $.Slice<item>)
	await $.println("sorted stable func:", $.arrayIndex(stableSeq!, 0).label, $.arrayIndex(stableSeq!, 1).label, $.arrayIndex(stableSeq!, 2).label, $.arrayIndex(stableSeq!, 3).label)

	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}

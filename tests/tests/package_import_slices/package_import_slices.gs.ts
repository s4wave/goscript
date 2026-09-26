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

	// Struct elements are values. Mutating a copy or a yielded loop value
	// must leave the original slice unchanged.
	class cell {
		public declare n: number

		public _fields: {
			n: number
		}

		constructor(init?: Partial<{n?: number}>) {
			this._fields = {
				n: init?.n ?? (0 as number)
			}
		}

		public clone(): cell {
			return $.markAsStructValue(new cell(this))
		}

		static {
			$.bindStructFields(this.prototype, ["n"])
		}

		static __typeInfo = $.registerStructType(
			"main.cell",
			() => new cell(),
			() => [],
			cell,
			() => [{ name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
		)
	}
	let copySrc: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1})), $.markAsStructValue(new cell({n: 2}))])
	let copyDst: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 0})), $.markAsStructValue(new cell({n: 0}))])
	$.copy(copyDst, copySrc)
	$.arrayIndex(copyDst!, 0).n = 9
	await $.println("copy struct:", $.arrayIndex(copySrc!, 0).n, $.arrayIndex(copySrc!, 1).n, $.arrayIndex(copyDst!, 0).n, $.arrayIndex(copyDst!, 1).n)

	let cloneSrc: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1})), $.markAsStructValue(new cell({n: 2}))])
	let clonedCells: $.Slice<cell> = (slices.Clone(cloneSrc) as $.Slice<cell>)
	$.arrayIndex(clonedCells!, 0).n = 8
	await $.println("clone struct:", $.arrayIndex(cloneSrc!, 0).n, $.arrayIndex(cloneSrc!, 1).n, $.arrayIndex(clonedCells!, 0).n, $.arrayIndex(clonedCells!, 1).n)

	let repeatSrc: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1})), $.markAsStructValue(new cell({n: 2}))])
	let repeatedCells: $.Slice<cell> = (slices.Repeat(repeatSrc, 2) as $.Slice<cell>)
	$.arrayIndex(repeatedCells!, 0).n = 7
	$.arrayIndex(repeatedCells!, 2).n = 6
	await $.println("repeat struct:", $.arrayIndex(repeatSrc!, 0).n, $.arrayIndex(repeatSrc!, 1).n, $.arrayIndex(repeatedCells!, 0).n, $.arrayIndex(repeatedCells!, 1).n, $.arrayIndex(repeatedCells!, 2).n, $.arrayIndex(repeatedCells!, 3).n)

	let concatSrc: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1})), $.markAsStructValue(new cell({n: 2}))])
	let concated: $.Slice<cell> = (slices.Concat(concatSrc, $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 3}))])) as $.Slice<cell>)
	$.arrayIndex(concated!, 0).n = 5
	$.arrayIndex(concated!, 2).n = 4
	await $.println("concat struct:", $.arrayIndex(concatSrc!, 0).n, $.arrayIndex(concatSrc!, 1).n, $.arrayIndex(concated!, 0).n, $.arrayIndex(concated!, 1).n, $.arrayIndex(concated!, 2).n)

	let valuesSrc: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1})), $.markAsStructValue(new cell({n: 2}))])
	let __goscriptRangeReturn5 = false
	;await (async () => {
		await slices.Values(valuesSrc)!(async (v) => {
			v.n = 100
			return true
		})
	})()
	if (__goscriptRangeReturn5) {
		return
	}
	await $.println("values struct:", $.arrayIndex(valuesSrc!, 0).n, $.arrayIndex(valuesSrc!, 1).n)

	let allSrc: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1})), $.markAsStructValue(new cell({n: 2}))])
	let __goscriptRangeReturn6 = false
	;await (async () => {
		await slices.All(allSrc)!(async (__goscriptRange6_0, v) => {
			v.n = 200
			return true
		})
	})()
	if (__goscriptRangeReturn6) {
		return
	}
	await $.println("all struct:", $.arrayIndex(allSrc!, 0).n, $.arrayIndex(allSrc!, 1).n)

	// append copies struct elements into new backing, including variadic sources.
	let appendSrc: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1}))])
	let appended: $.Slice<cell> = $.append(appendSrc, $.markAsStructValue(new cell({n: 2})))
	$.arrayIndex(appended!, 0).n = 9
	await $.println("append realloc:", $.arrayIndex(appendSrc!, 0).n)
	let appendSpread: $.Slice<cell> = $.appendSlice<cell>(null, appendSrc)
	$.arrayIndex(appendSpread!, 0).n = 8
	await $.println("append slice:", $.arrayIndex(appendSrc!, 0).n)

	// Overlapping append reads a snapshot, so later source elements stay intact.
	let overlap: $.Slice<number> = $.makeSlice<number>(2, 4, "number")
	let __goscriptAssign0_0: number = 1
	let __goscriptAssign0_1: number = 2
	overlap![0] = __goscriptAssign0_0
	overlap![1] = __goscriptAssign0_1
	let overlapped: $.Slice<number> = $.appendSlice($.goSlice(overlap, undefined, 1), overlap)
	await $.println("append overlap:", $.arrayIndex(overlapped!, 0), $.arrayIndex(overlapped!, 1), $.arrayIndex(overlapped!, 2))

	let backwardSrc: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1}))])
	let __goscriptRangeReturn7 = false
	;await (async () => {
		await slices.Backward(backwardSrc)!(async (__goscriptRange7_0, v) => {
			v.n = 9
			return true
		})
	})()
	if (__goscriptRangeReturn7) {
		return
	}
	await $.println("backward struct:", $.arrayIndex(backwardSrc!, 0).n)

	let insertSrc: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1}))])
	let insertedCells: $.Slice<cell> = (slices.Insert(insertSrc, 0, $.markAsStructValue(new cell())) as $.Slice<cell>)
	$.arrayIndex(insertedCells!, 1).n = 7
	await $.println("insert struct:", $.arrayIndex(insertSrc!, 0).n)

	let replaceSrc: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1}))])
	let replaced: $.Slice<cell> = (slices.Replace(replaceSrc, 0, 0, $.markAsStructValue(new cell())) as $.Slice<cell>)
	$.arrayIndex(replaced!, 1).n = 8
	await $.println("replace struct:", $.arrayIndex(replaceSrc!, 0).n)

	let growSrc: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1}))])
	let grown: $.Slice<cell> = (slices.Grow(growSrc, 1) as $.Slice<cell>)
	$.arrayIndex(grown!, 0).n = 9
	await $.println("grow struct:", $.arrayIndex(growSrc!, 0).n)

	let collectedMap: globalThis.Map<number, cell> | null = $.makeMap<number, cell>([[0, $.markAsStructValue(new cell({n: 1}))]])
	let collected: $.Slice<cell> = (slices.Collect(maps.Values(collectedMap)) as $.Slice<cell>)
	$.arrayIndex(collected!, 0).n = 9
	await $.println("collect struct:", $.mapGet<number, cell, cell>(collectedMap, 0, $.markAsStructValue(new cell()))[0].n)

	// Interface slices can hold a struct after nil or a pointer.
	let mutateSecond: ((values: $.Slice<any>) => void) | null = $.functionValue((values: $.Slice<any>): void => {
		{
			const __goscriptTypeSwitchValue = $.arrayIndex(values!, 1)
			switch (true) {
				case $.typeAssert<cell>(__goscriptTypeSwitchValue, "main.cell").ok:
					{
						let value: cell = $.markAsStructValue($.cloneStructValue($.typeAssert<cell>(__goscriptTypeSwitchValue, "main.cell").value))
						value.n = 9
					}
					break
			}
		}
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] })], results: [] } as $.FunctionTypeInfo))
	for (let __goscriptRangeTarget0 = $.arrayToSlice<$.Slice<any>>([$.arrayToSlice<any>([null, $.interfaceValue($.markAsStructValue(new cell({n: 1})), "main.cell", "main.cell")]), $.arrayToSlice<any>([$.interfaceValue(new cell(), "*main.cell", /* @__PURE__ */ $.pointerType("main.cell")), $.interfaceValue($.markAsStructValue(new cell({n: 2})), "main.cell", "main.cell")])]), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let source = __goscriptRangeTarget0![__rangeIndex]
		let __goscriptShadow0: $.Slice<any> = (slices.Clone(source) as $.Slice<any>)
		await mutateSecond!(__goscriptShadow0)
		let copied: $.Slice<any> = $.makeSlice<any>($.len(source))
		$.copy(copied, source)
		await mutateSecond!(copied)
		let __goscriptShadow1: $.Slice<any> = $.appendSlice<any>(null, source, $.appendZeros.nil)
		await mutateSecond!(__goscriptShadow1)
		await $.println("interface struct:", $.mustTypeAssert<cell>($.arrayIndex(source!, 1), "main.cell").n, $.mustTypeAssert<cell>($.arrayIndex(__goscriptShadow0!, 1), "main.cell").n, $.mustTypeAssert<cell>($.arrayIndex(copied!, 1), "main.cell").n, $.mustTypeAssert<cell>($.arrayIndex(__goscriptShadow1!, 1), "main.cell").n)
	}

	let appendSeqSource: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1}))])
	let appendSeq: ((_yield: ((_p0: cell) => boolean | globalThis.Promise<boolean>) | null) => void) | null = $.functionValue(async (_yield: ((_p0: cell) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<void> => {
		await _yield!($.markAsStructValue($.cloneStructValue($.arrayIndex(appendSeqSource!, 0))))
	}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: ["main.cell"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo))
	let appendSeqResult: $.Slice<cell> = (slices.AppendSeq(null, appendSeq) as $.Slice<cell>)
	$.arrayIndex(appendSeqResult!, 0).n = 9
	await $.println("append seq struct:", $.arrayIndex(appendSeqSource!, 0).n, $.arrayIndex(appendSeqResult!, 0).n)

	let sortedFuncSource: $.Slice<cell> = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 2})), $.markAsStructValue(new cell({n: 1}))])
	let sortedFuncResult: $.Slice<cell> = (await slices.SortedFunc(slices.Values(sortedFuncSource), $.functionValue((a: cell, b: cell): number => {
		return a.n - b.n
	}, ({ kind: $.TypeKind.Function, params: ["main.cell", "main.cell"], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))) as $.Slice<cell>)
	$.arrayIndex(sortedFuncResult!, 0).n = 9
	await $.println("sorted func struct:", $.arrayIndex(sortedFuncSource!, 0).n, $.arrayIndex(sortedFuncSource!, 1).n, $.arrayIndex(sortedFuncResult!, 0).n, $.arrayIndex(sortedFuncResult!, 1).n)

	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}

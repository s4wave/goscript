// Generated file based on package_import_slices.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as maps from "@goscript/maps/index.js"
import * as slices from "@goscript/slices/index.js"
import type * as iter from "@goscript/iter/index.js"

export async function main(): globalThis.Promise<void> {
	// Use one source for ordered traversal and iterator composition.
	let s = $.arrayToSlice<number>([1, 2, 3, 4, 5])

	// Traverse forward, then stop a backward traversal before the prefix.
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

	// Iterator producers compose with consumers of the shared Seq types.
	let chunks = (slices.Collect(slices.Chunk(s, 2)) as $.Slice<$.Slice<number>>)
	await $.println("collected chunks:", $.sliceLen(chunks), $.plainSliceIndex($.plainSliceIndex(chunks!, 0)!, 0), $.plainSliceIndex($.plainSliceIndex(chunks!, 2)!, 0))
	let pairs = (maps.Collect(slices.Backward(s)) as globalThis.Map<number, number> | null)
	await $.println("collected backward:", $.len(pairs), $.mapGet<number, number, number>(pairs, 0, 0)[0], $.mapGet<number, number, number>(pairs, 4, 0)[0])
	let all = (maps.Collect(slices.All(s)) as globalThis.Map<number, number> | null)
	await $.println("collected all:", $.len(all), $.mapGet<number, number, number>(all, 0, 0)[0], $.mapGet<number, number, number>(all, 4, 0)[0])
	let __goscriptRangeReturn2 = false
	;await (async () => {
		await slices.Chunk(s, 2)!(async (chunk) => {
			await $.println("chunk:", $.sliceLen(chunk), $.cap(chunk), $.plainSliceIndex(chunk!, 0))
			return true
		})
	})()
	if (__goscriptRangeReturn2) {
		return
	}

	// Clones own their backing storage and preserve a nil slice.
	let cloned = (slices.Clone(s) as $.Slice<number>)
	$.sliceElems(cloned!)[$.sliceSlot(cloned!, 0)] = 99
	await $.println("clone first:", $.plainSliceIndex(cloned!, 0), "original first:", $.plainSliceIndex(s!, 0), "same len:", $.sliceLen(cloned) == $.sliceLen(s))
	let nilSlice: $.Slice<number> = null! as $.Slice<number>
	await $.println("nil clone:", slices.Clone(nilSlice) == null)

	// Equality, membership and edits preserve the slice values.
	await $.println("equal:", slices.Equal($.arrayToSlice<number>([1, 2]), $.arrayToSlice<number>([1, 2])), slices.Equal($.arrayToSlice<number>([1]), $.arrayToSlice<number>([2])))
	await $.println("equal func:", slices.EqualFunc($.arrayToSlice<number>([1, 3]), $.arrayToSlice<number>([5, 7]), $.functionValue((a: number, b: number): boolean => {
		return (a % 2) == (b % 2)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))))
	await $.println("contains:", slices.Contains(s, 3), slices.ContainsFunc(s, $.functionValue((v: number): boolean => {
		return v > 4
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))))
	let inserted = (slices.Insert($.arrayToSlice<number>([1, 4]), 1, 2, 3) as $.Slice<number>)
	await $.println("insert:", $.plainSliceIndex(inserted!, 0), $.plainSliceIndex(inserted!, 1), $.plainSliceIndex(inserted!, 2), $.plainSliceIndex(inserted!, 3))
	slices.Reverse(inserted)
	await $.println("reverse:", $.plainSliceIndex(inserted!, 0), $.plainSliceIndex(inserted!, 1), $.plainSliceIndex(inserted!, 2), $.plainSliceIndex(inserted!, 3))
	await $.println("is sorted:", slices.IsSorted($.arrayToSlice<number>([1, 2, 3])), slices.IsSorted($.arrayToSlice<number>([1, 3, 2])))

	// Stable sorts preserve the original order within each group.
	class item {
		public declare group: number

		public declare label: string

		constructor(init?: Partial<{group?: number, label?: string}>, __goscriptValue?: boolean) {
			this.group = init?.group ?? (0 as number)
			this.label = init?.label ?? ("" as string)
			;(this as any).__goStructValue = __goscriptValue === true
		}

		public clone(): item {
			return new item(this, true)
		}

		public __goscriptAssign(source: item): this {
			this.group = source.group
			this.label = source.label
			return this
		}

		static __typeInfo = $.registerStructType(
			"main.item",
			() => new item(),
			() => [],
			item,
			() => [{ name: "group", key: "group", type: /* @__PURE__ */ $.basicType("int") }, { name: "label", key: "label", type: /* @__PURE__ */ $.basicType("string") }]
		)
	}
	let stable = $.arrayToSlice<item>([$.markAsStructValue(new item({group: 2, label: "a"})), $.markAsStructValue(new item({group: 1, label: "b"})), $.markAsStructValue(new item({group: 2, label: "c"})), $.markAsStructValue(new item({group: 1, label: "d"}))])
	slices.SortStableFunc(stable, $.functionValue((a: item, b: item): number => {
		return a.group - b.group
	}, ({ kind: $.TypeKind.Function, params: ["main.item", "main.item"], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)))
	await $.println("stable:", $.plainSliceIndex(stable!, 0).label, $.plainSliceIndex(stable!, 1).label, $.plainSliceIndex(stable!, 2).label, $.plainSliceIndex(stable!, 3).label)
	await $.println("is sorted func:", slices.IsSortedFunc(stable, $.functionValue((a: item, b: item): number => {
		return a.group - b.group
	}, ({ kind: $.TypeKind.Function, params: ["main.item", "main.item"], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))))

	// Delete only the elements the predicate selects.
	let filtered = (slices.DeleteFunc($.arrayToSlice<number>([1, 2, 3, 4, 5]), $.functionValue((v: number): boolean => {
		return (v % 2) == 0
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)), () => (0 as number)) as $.Slice<number>)
	await $.println("delete func:", $.plainSliceIndex(filtered!, 0), $.plainSliceIndex(filtered!, 1), $.plainSliceIndex(filtered!, 2), $.sliceLen(filtered))

	// Collect map keys into a sorted slice.
	let sortedKeys = (slices.Sorted(maps.Keys($.makeMap<string, number>([["c", 3], ["a", 1], ["b", 2]]))) as $.Slice<string>)
	await $.println("sorted:", $.plainSliceIndex(sortedKeys!, 0), $.plainSliceIndex(sortedKeys!, 1), $.plainSliceIndex(sortedKeys!, 2))

	// Values traverses in order, stops early and accepts a nil slice.
	let __goscriptRangeReturn3 = false
	;await (async () => {
		await slices.Values(s)!(async (v) => {
			await $.println("value:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn3) {
		return
	}
	let __goscriptRangeReturn4 = false
	;await (async () => {
		await slices.Values(s)!(async (v) => {
			if (v > 2) {
				return false
			}
			await $.println("value stop:", v)
			return true
		})
	})()
	if (__goscriptRangeReturn4) {
		return
	}
	let valueCount = 0
	let __goscriptRangeReturn5 = false
	;await (async () => {
		await slices.Values(nilSlice)!(async (__goscriptRange5_0) => {
			valueCount++
			return true
		})
	})()
	if (__goscriptRangeReturn5) {
		return
	}
	await $.println("nil values:", valueCount)
	let sortedValues = (slices.Sorted(slices.Values($.arrayToSlice<string>(["c", "a", "b"]))) as $.Slice<string>)
	await $.println("sorted values:", $.plainSliceIndex(sortedValues!, 0), $.plainSliceIndex(sortedValues!, 1), $.plainSliceIndex(sortedValues!, 2))

	// Repeat allocates independent repeated backing and preserves empty cases.
	let repeated = (slices.Repeat($.arrayToSlice<number>([7, 8]), 3) as $.Slice<number>)
	await $.println("repeat:", $.sliceLen(repeated), $.cap(repeated), $.plainSliceIndex(repeated!, 0), $.plainSliceIndex(repeated!, 5), slices.Repeat(null, 2) == null, $.sliceLen(slices.Repeat($.arrayToSlice<number>([1]), 0)))

	// Sort a value sequence using its comparison function.
	let sortedFunc = (await slices.SortedFunc(slices.Values($.arrayToSlice<number>([1, 3, 2])), $.functionValue((a: number, b: number): number => {
		return b - a
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))) as $.Slice<number>)
	await $.println("sorted func:", $.plainSliceIndex(sortedFunc!, 0), $.plainSliceIndex(sortedFunc!, 1), $.plainSliceIndex(sortedFunc!, 2), await slices.SortedFunc(slices.Values($.arrayToSlice<number>([])), $.functionValue((a: number, b: number): number => {
		return a - b
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))) == null)

	// Stable sequence sorting keeps equal elements in their input order.
	let stableSeq = (await slices.SortedStableFunc(slices.Values($.arrayToSlice<item>([$.markAsStructValue(new item({group: 2, label: "a"})), $.markAsStructValue(new item({group: 1, label: "b"})), $.markAsStructValue(new item({group: 2, label: "c"})), $.markAsStructValue(new item({group: 1, label: "d"}))])), $.functionValue((a: item, b: item): number => {
		return a.group - b.group
	}, ({ kind: $.TypeKind.Function, params: ["main.item", "main.item"], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))) as $.Slice<item>)
	await $.println("sorted stable func:", $.plainSliceIndex(stableSeq!, 0).label, $.plainSliceIndex(stableSeq!, 1).label, $.plainSliceIndex(stableSeq!, 2).label, $.plainSliceIndex(stableSeq!, 3).label)

	// Struct elements are values. Mutating a copy or a yielded loop value
	// must leave the original slice unchanged.
	class cell {
		public declare n: number

		constructor(init?: Partial<{n?: number}>, __goscriptValue?: boolean) {
			this.n = init?.n ?? (0 as number)
			;(this as any).__goStructValue = __goscriptValue === true
		}

		public clone(): cell {
			return new cell(this, true)
		}

		public __goscriptAssign(source: cell): this {
			this.n = source.n
			return this
		}

		static __typeInfo = $.registerStructType(
			"main.cell",
			() => new cell(),
			() => [],
			cell,
			() => [{ name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
		)
	}
	let copySrc = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1})), $.markAsStructValue(new cell({n: 2}))])
	let copyDst = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 0})), $.markAsStructValue(new cell({n: 0}))])
	$.copy(copyDst, copySrc, true)
	$.plainSliceIndex(copyDst!, 0).n = 9
	await $.println("copy struct:", $.plainSliceIndex(copySrc!, 0).n, $.plainSliceIndex(copySrc!, 1).n, $.plainSliceIndex(copyDst!, 0).n, $.plainSliceIndex(copyDst!, 1).n)

	// Cloning copies each struct rather than sharing its fields.
	let cloneSrc = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1})), $.markAsStructValue(new cell({n: 2}))])
	let clonedCells = (slices.Clone(cloneSrc) as $.Slice<cell>)
	$.plainSliceIndex(clonedCells!, 0).n = 8
	await $.println("clone struct:", $.plainSliceIndex(cloneSrc!, 0).n, $.plainSliceIndex(cloneSrc!, 1).n, $.plainSliceIndex(clonedCells!, 0).n, $.plainSliceIndex(clonedCells!, 1).n)

	// Repeated struct values are independent of the source and each other.
	let repeatSrc = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1})), $.markAsStructValue(new cell({n: 2}))])
	let repeatedCells = (slices.Repeat(repeatSrc, 2) as $.Slice<cell>)
	$.plainSliceIndex(repeatedCells!, 0).n = 7
	$.plainSliceIndex(repeatedCells!, 2).n = 6
	await $.println("repeat struct:", $.plainSliceIndex(repeatSrc!, 0).n, $.plainSliceIndex(repeatSrc!, 1).n, $.plainSliceIndex(repeatedCells!, 0).n, $.plainSliceIndex(repeatedCells!, 1).n, $.plainSliceIndex(repeatedCells!, 2).n, $.plainSliceIndex(repeatedCells!, 3).n)

	// Concatenation copies structs from every input.
	let concatSrc = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1})), $.markAsStructValue(new cell({n: 2}))])
	let concated = (slices.Concat(concatSrc, $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 3}))])) as $.Slice<cell>)
	$.plainSliceIndex(concated!, 0).n = 5
	$.plainSliceIndex(concated!, 2).n = 4
	await $.println("concat struct:", $.plainSliceIndex(concatSrc!, 0).n, $.plainSliceIndex(concatSrc!, 1).n, $.plainSliceIndex(concated!, 0).n, $.plainSliceIndex(concated!, 1).n, $.plainSliceIndex(concated!, 2).n)

	// Values yields copies of struct elements.
	let valuesSrc = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1})), $.markAsStructValue(new cell({n: 2}))])
	let __goscriptRangeReturn6 = false
	;await (async () => {
		await slices.Values(valuesSrc)!(async (v) => {
			v.n = 100
			return true
		})
	})()
	if (__goscriptRangeReturn6) {
		return
	}
	await $.println("values struct:", $.plainSliceIndex(valuesSrc!, 0).n, $.plainSliceIndex(valuesSrc!, 1).n)

	// All yields copies of struct elements along with their indices.
	let allSrc = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1})), $.markAsStructValue(new cell({n: 2}))])
	let __goscriptRangeReturn7 = false
	;await (async () => {
		await slices.All(allSrc)!(async (__goscriptRange7_0, v) => {
			v.n = 200
			return true
		})
	})()
	if (__goscriptRangeReturn7) {
		return
	}
	await $.println("all struct:", $.plainSliceIndex(allSrc!, 0).n, $.plainSliceIndex(allSrc!, 1).n)

	// append copies struct elements into new backing, including variadic sources.
	let appendSrc = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1}))])
	let appended = $.appendOne(appendSrc, $.markAsStructValue(new cell({n: 2})))
	$.plainSliceIndex(appended!, 0).n = 9
	await $.println("append realloc:", $.plainSliceIndex(appendSrc!, 0).n)
	let appendSpread = $.appendSlice<cell>(null, appendSrc)
	$.plainSliceIndex(appendSpread!, 0).n = 8
	await $.println("append slice:", $.plainSliceIndex(appendSrc!, 0).n)

	// Overlapping append reads a snapshot, so later source elements stay intact.
	let overlap = $.makeSlice<number>(2, 4, "number")
	let __goscriptAssign0_0: number = 1
	let __goscriptAssign0_1: number = 2
	$.sliceElems(overlap!)[$.sliceSlot(overlap!, 0)] = __goscriptAssign0_0
	$.sliceElems(overlap!)[$.sliceSlot(overlap!, 1)] = __goscriptAssign0_1
	let overlapped = $.appendSlice($.goSlice(overlap, undefined, 1), overlap)
	await $.println("append overlap:", $.plainSliceIndex(overlapped!, 0), $.plainSliceIndex(overlapped!, 1), $.plainSliceIndex(overlapped!, 2))

	// Backward yields struct values rather than references into its source.
	let backwardSrc = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1}))])
	let __goscriptRangeReturn8 = false
	;await (async () => {
		await slices.Backward(backwardSrc)!(async (__goscriptRange8_0, v) => {
			v.n = 9
			return true
		})
	})()
	if (__goscriptRangeReturn8) {
		return
	}
	await $.println("backward struct:", $.plainSliceIndex(backwardSrc!, 0).n)

	// Insertion copies the source structs into the result.
	let insertSrc = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1}))])
	let insertedCells = (slices.Insert(insertSrc, 0, $.markAsStructValue(new cell())) as $.Slice<cell>)
	$.plainSliceIndex(insertedCells!, 1).n = 7
	await $.println("insert struct:", $.plainSliceIndex(insertSrc!, 0).n)

	// Replacement copies the remaining source structs.
	let replaceSrc = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1}))])
	let replaced = (slices.Replace(replaceSrc, 0, 0, $.markAsStructValue(new cell())) as $.Slice<cell>)
	$.plainSliceIndex(replaced!, 1).n = 8
	await $.println("replace struct:", $.plainSliceIndex(replaceSrc!, 0).n)

	// Growing past capacity copies struct values into the new backing.
	let growSrc = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1}))])
	let grown = (slices.Grow(growSrc, 1, () => ($.markAsStructValue(new cell()) as cell)) as $.Slice<cell>)
	$.plainSliceIndex(grown!, 0).n = 9
	await $.println("grow struct:", $.plainSliceIndex(growSrc!, 0).n)

	// Collect copies the struct values a map iterator yields.
	let collectedMap = $.makeMap<number, cell>([[0, $.markAsStructValue(new cell({n: 1}))]])
	let collected = (slices.Collect(maps.Values(collectedMap)) as $.Slice<cell>)
	$.plainSliceIndex(collected!, 0).n = 9
	await $.println("collect struct:", $.mapGet<number, cell, cell>(collectedMap, 0, $.markAsStructValue(new cell()))[0].n)

	// Interface slices can hold a struct after nil or a pointer.
	let mutateSecond = $.functionValue((values: $.Slice<any>) => {
		{
			const __goscriptTypeSwitchValue = $.plainSliceIndex(values!, 1)
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
	for (let __goscriptRangeTarget0 = $.arrayToSlice<$.Slice<any>>([$.arrayToSlice<any>([null, $.structInterfaceValue($.markAsStructValue(new cell({n: 1})), "main.cell", "main.cell")]), $.arrayToSlice<any>([$.interfaceValue(new cell(), "*main.cell", /* @__PURE__ */ $.pointerType("main.cell")), $.structInterfaceValue($.markAsStructValue(new cell({n: 2})), "main.cell", "main.cell")])]), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let source = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as $.Slice<any>)
		let __goscriptShadow0 = (slices.Clone(source) as $.Slice<any>)
		mutateSecond(__goscriptShadow0)
		let copied = $.makeSlice<any>($.sliceLen(source))
		$.copy(copied, source)
		mutateSecond(copied)
		let __goscriptShadow1 = $.appendSlice<any>(null, source, $.appendZeros.nil)
		mutateSecond(__goscriptShadow1)
		await $.println("interface struct:", $.mustTypeAssert<cell>($.plainSliceIndex(source!, 1), "main.cell").n, $.mustTypeAssert<cell>($.plainSliceIndex(__goscriptShadow0!, 1), "main.cell").n, $.mustTypeAssert<cell>($.plainSliceIndex(copied!, 1), "main.cell").n, $.mustTypeAssert<cell>($.plainSliceIndex(__goscriptShadow1!, 1), "main.cell").n)
	}

	// AppendSeq copies yielded structs into its result.
	let appendSeqSource = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 1}))])
	let appendSeq = $.functionValue(async (_yield: ((_p0: cell) => boolean | globalThis.Promise<boolean>) | null) => {
		void (__goscriptAwait = _yield!($.markAsStructValue($.cloneStructValue($.plainSliceIndex(appendSeqSource!, 0)))), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	}, ({ kind: $.TypeKind.Function, params: [({ kind: $.TypeKind.Function, params: ["main.cell"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo))
	let appendSeqResult = (await slices.AppendSeq(null, appendSeq) as $.Slice<cell>)
	$.plainSliceIndex(appendSeqResult!, 0).n = 9
	await $.println("append seq struct:", $.plainSliceIndex(appendSeqSource!, 0).n, $.plainSliceIndex(appendSeqResult!, 0).n)

	// SortedFunc returns struct values independent of the source.
	let sortedFuncSource = $.arrayToSlice<cell>([$.markAsStructValue(new cell({n: 2})), $.markAsStructValue(new cell({n: 1}))])
	let sortedFuncResult = (await slices.SortedFunc(slices.Values(sortedFuncSource), $.functionValue((a: cell, b: cell): number => {
		return a.n - b.n
	}, ({ kind: $.TypeKind.Function, params: ["main.cell", "main.cell"], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))) as $.Slice<cell>)
	$.plainSliceIndex(sortedFuncResult!, 0).n = 9
	await $.println("sorted func struct:", $.plainSliceIndex(sortedFuncSource!, 0).n, $.plainSliceIndex(sortedFuncSource!, 1).n, $.plainSliceIndex(sortedFuncResult!, 0).n, $.plainSliceIndex(sortedFuncResult!, 1).n)

	// Byte slice results hold bytes and feed byte operations.
	let src = new Uint8Array([97, 98, 99])
	let byteClone = (slices.Clone(src) as $.Slice<number>)
	$.sliceElems(byteClone!)[$.sliceSlot(byteClone!, 0)] = 120
	$.sliceElems(byteClone!)[$.sliceSlot(byteClone!, 1)] = $.uint($.sliceElems(byteClone!)[$.sliceSlot(byteClone!, 1)] + (255), 8)
	await $.println("byte clone:", $.bytesToString(byteClone), $.bytesToString(src), $.typedSliceIndex(byteClone!, 1))
	await $.println("byte results:", $.bytesToString(slices.Clip($.goSlice(src, undefined, 2))), $.bytesToString(slices.Insert(src, 1, 121)), $.bytesToString(slices.Replace(slices.Clone(src), 0, 2, 113)), $.bytesToString(slices.Repeat(src, 2)), $.bytesToString(slices.Concat(src, new Uint8Array([100, 101]))))

	// Report that every comparison reached the end.
	await $.println("test finished")
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

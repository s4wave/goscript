// Generated file based on package_import_sort.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"

import * as sort2 from "@goscript/sort/index.js"
import "@goscript/slices/index.js"
import "@goscript/sort/index.js"

export type byFreq = $.Slice<number>

export class descending {
	public declare values: $.Slice<number>

	public _fields: {
		values: $.Slice<number>
	}

	constructor(init?: Partial<{values?: $.Slice<number>}>) {
		this._fields = {
			values: init?.values ?? (null! as $.Slice<number>)
		}
	}

	public clone(): descending {
		return $.markAsStructValue(new descending(this))
	}

	public Len(): number {
		const d = this;
		return $.len(d.values)
	}

	public Less(i: number, j: number): boolean {
		const d = this;
		return $.arrayIndex(d.values!, i) > $.arrayIndex(d.values!, j)
	}

	public Swap(i: number, j: number): void {
		let d: descending = this;
		let __goscriptAssign0_0: number = $.arrayIndex(d.values!, j)
		let __goscriptAssign0_1: number = $.arrayIndex(d.values!, i)
		d.values![i] = __goscriptAssign0_0
		d.values![j] = __goscriptAssign0_1
	}

	static {
		$.bindStructFields(this.prototype, ["values"])
	}

	static __typeInfo = $.registerStructType(
		"main.descending",
		() => new descending(),
		() => [{ name: "Len", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Less", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Swap", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		descending,
		() => [{ name: "values", key: "values", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")) }]
	)
}

export async function byFreq_sort(s: $.VarRef<byFreq> | null, a: $.Slice<number>): globalThis.Promise<void> {
	s!.value = ((a as byFreq) as byFreq)
	await sort2.Sort($.pointerValueOrNil($.namedValueInterfaceValue<sort2.Interface | null>(s, "*main.byFreq", {Len: (receiver: any, ...args: any[]) => (byFreq_Len as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args)), Less: (receiver: any, ...args: any[]) => (byFreq_Less as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args)), Swap: (receiver: any, ...args: any[]) => (byFreq_Swap as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args)), sort: (receiver: any, ...args: any[]) => (byFreq_sort as any)(receiver, ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"), "main.byFreq")), [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Less", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Swap", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("sort", [["a", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))]])]))!)
}

export function byFreq_Len(s: byFreq): number {
	return $.len((s as byFreq))
}

export function byFreq_Less(s: byFreq, i: number, j: number): boolean {
	return $.arrayIndex(s!, i) < $.arrayIndex(s!, j)
}

export function byFreq_Swap(s: byFreq, i: number, j: number): void {
	let __goscriptAssign1_0: number = $.arrayIndex(s!, j)
	let __goscriptAssign1_1: number = $.arrayIndex(s!, i)
	s![i] = __goscriptAssign1_0
	s![j] = __goscriptAssign1_1
}

export async function main(): globalThis.Promise<void> {
	// Test basic slice sorting
	let ints: $.Slice<number> = $.arrayToSlice<number>([3, 1, 4, 1, 5, 9])
	await $.println("Original ints:", $.arrayIndex(ints!, 0), $.arrayIndex(ints!, 1), $.arrayIndex(ints!, 2), $.arrayIndex(ints!, 3), $.arrayIndex(ints!, 4), $.arrayIndex(ints!, 5))
	sort2.Ints(ints)
	await $.println("Sorted ints:", $.arrayIndex(ints!, 0), $.arrayIndex(ints!, 1), $.arrayIndex(ints!, 2), $.arrayIndex(ints!, 3), $.arrayIndex(ints!, 4), $.arrayIndex(ints!, 5))

	// Test if sorted
	let isSorted = sort2.IntsAreSorted(ints)
	await $.println("Ints are sorted:", isSorted)

	// Test string sorting
	let strings: $.Slice<string> = $.arrayToSlice<string>(["banana", "apple", "cherry"])
	await $.println("Original strings:", $.arrayIndex(strings!, 0), $.arrayIndex(strings!, 1), $.arrayIndex(strings!, 2))
	sort2.Strings(strings)
	await $.println("Sorted strings:", $.arrayIndex(strings!, 0), $.arrayIndex(strings!, 1), $.arrayIndex(strings!, 2))

	// Test if strings are sorted
	let stringSorted = sort2.StringsAreSorted(strings)
	await $.println("Strings are sorted:", stringSorted)

	// Test float64 sorting
	let floats: $.Slice<number> = $.arrayToSlice<number>([3.14, 2.71, 1.41])
	await $.println("Original floats:", $.arrayIndex(floats!, 0), $.arrayIndex(floats!, 1), $.arrayIndex(floats!, 2))
	sort2.Float64s(floats)
	await $.println("Sorted floats:", $.arrayIndex(floats!, 0), $.arrayIndex(floats!, 1), $.arrayIndex(floats!, 2))

	// Test if floats are sorted
	let floatSorted = sort2.Float64sAreSorted(floats)
	await $.println("Floats are sorted:", floatSorted)

	// Test search functions
	let intIndex = sort2.SearchInts(ints, 4)
	await $.println("Index of 4 in sorted ints:", intIndex)

	let stringIndex = sort2.SearchStrings(strings, "banana")
	await $.println("Index of 'banana' in sorted strings:", stringIndex)

	let floatIndex = sort2.SearchFloat64s(floats, 2.71)
	await $.println("Index of 2.71 in sorted floats:", floatIndex)

	// Test generic Search function
	let searchResult = await sort2.Search($.len(ints), $.functionValue((i: number): boolean => {
		return $.arrayIndex(ints!, i) >= 5
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)))
	await $.println("First index where value >= 5:", searchResult)

	// Test Slice function with custom comparator
	let testSlice: $.Slice<number> = $.arrayToSlice<number>([5, 2, 8, 1, 9])
	slices.Sort(testSlice)
	await $.println("Custom sorted slice:", $.arrayIndex(testSlice!, 0), $.arrayIndex(testSlice!, 1), $.arrayIndex(testSlice!, 2), $.arrayIndex(testSlice!, 3), $.arrayIndex(testSlice!, 4))

	let asyncSlice: $.Slice<number> = $.arrayToSlice<number>([2, 1])
	let ready: $.Channel<boolean> | null = $.makeChannel<boolean>(1, false, "both")
	await $.chanSend(ready, true)
	await sort2.Slice($.interfaceValue(asyncSlice, "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))), $.functionValue(async (i: number, j: number): globalThis.Promise<boolean> => {
		await $.chanRecv(ready)
		return $.arrayIndex(asyncSlice!, i) < $.arrayIndex(asyncSlice!, j)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)))
	await $.println("Async sorted slice:", $.arrayIndex(asyncSlice!, 0), $.arrayIndex(asyncSlice!, 1))

	// Test SliceIsSorted
	let isSliceSorted = await sort2.SliceIsSorted($.interfaceValue(testSlice, "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))), $.functionValue((i: number, j: number): boolean => {
		return $.arrayIndex(testSlice!, i) < $.arrayIndex(testSlice!, j)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)))
	await $.println("Custom slice is sorted:", isSliceSorted)

	// Test custom sort.Interface values.
	let custom = $.markAsStructValue(new descending({values: $.arrayToSlice<number>([1, 3, 2])}))
	await sort2.Sort($.interfaceValue<sort2.Interface | null>($.markAsStructValue($.cloneStructValue(custom)), "main.descending", "main.descending")!)
	await $.println("Custom interface sort:", $.arrayIndex(custom.values!, 0), $.arrayIndex(custom.values!, 1), $.arrayIndex(custom.values!, 2))

	let namedSlice: $.Slice<number> = $.arrayToSlice<number>([4, 1, 3])
	let namedSliceSorter: $.VarRef<byFreq> = $.varRef(null! as byFreq)
	await byFreq_sort(namedSliceSorter, namedSlice)
	await $.println("Named slice pointer sort:", $.arrayIndex(namedSlice!, 0), $.arrayIndex(namedSlice!, 1), $.arrayIndex(namedSlice!, 2))

	// Test the named slice types and their methods.
	let wordSlice: $.Slice<string> = $.arrayToSlice<string>(["c", "a", "b"])
	await sort2.StringSlice_Sort((wordSlice as sort2.StringSlice))
	await $.println("StringSlice sort:", $.arrayIndex(wordSlice!, 0), $.arrayIndex(wordSlice!, 1), $.arrayIndex(wordSlice!, 2), await sort2.StringSlice_Search((wordSlice as sort2.StringSlice), "b"))
	let floatSlice: sort2.Float64Slice = ($.arrayToSlice<number>([2.5, 1.5]) as sort2.Float64Slice)
	await sort2.Float64Slice_Sort(floatSlice)
	await $.println("Float64Slice sort:", sort2.Float64Slice_Len(floatSlice), sort2.Float64Slice_Less(floatSlice, 0, 1), await sort2.Float64Slice_Search(floatSlice, 2.5))
	let sorter: sort2.Interface | null = $.namedValueInterfaceValue<sort2.Interface | null>(($.arrayToSlice<number>([3, 1, 2]) as sort2.IntSlice), "sort.IntSlice", {Len: (receiver: any, ...args: any[]) => (sort2.IntSlice_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Less: (receiver: any, ...args: any[]) => (sort2.IntSlice_Less as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Search: (receiver: any, ...args: any[]) => (sort2.IntSlice_Search as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Sort: (receiver: any, ...args: any[]) => (sort2.IntSlice_Sort as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Swap: (receiver: any, ...args: any[]) => (sort2.IntSlice_Swap as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"), "sort.IntSlice"), [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Less", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Search", [["x", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Sort"), $.methodSignature("Swap", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]])])
	await sort2.Sort($.pointerValueOrNil(sorter)!)
	let intSlice: sort2.IntSlice = ($.mustTypeAssert<sort2.IntSlice>(sorter, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"), "sort.IntSlice")) as sort2.IntSlice)
	await $.println("IntSlice interface sort:", $.arrayIndex(intSlice!, 0), $.arrayIndex(intSlice!, 1), $.arrayIndex(intSlice!, 2), await $.pointerValue<Exclude<sort2.Interface, null>>(sorter).Len())
	await sort2.Sort($.pointerValueOrNil(sort2.Reverse($.pointerValueOrNil($.namedValueInterfaceValue<sort2.Interface | null>(intSlice, "sort.IntSlice", {Len: (receiver: any, ...args: any[]) => (sort2.IntSlice_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Less: (receiver: any, ...args: any[]) => (sort2.IntSlice_Less as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Search: (receiver: any, ...args: any[]) => (sort2.IntSlice_Search as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Sort: (receiver: any, ...args: any[]) => (sort2.IntSlice_Sort as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Swap: (receiver: any, ...args: any[]) => (sort2.IntSlice_Swap as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"), "sort.IntSlice"), [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Less", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Search", [["x", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Sort"), $.methodSignature("Swap", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]])]))!))!)
	sort2.IntSlice_Swap(intSlice, 0, 2)
	await $.println("IntSlice reverse and swap:", $.arrayIndex(intSlice!, 0), $.arrayIndex(intSlice!, 1), $.arrayIndex(intSlice!, 2))

	// The slice passed to sort.Slice is a Go any, as from reflect.
	let anySlice: any = $.interfaceValue($.arrayToSlice<number>([5, 4, 6]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")))
	let anyInts: $.Slice<number> = $.mustTypeAssert<$.Slice<number>>(anySlice, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")))
	await sort2.Slice(anySlice, $.functionValue((i: number, j: number): boolean => {
		return $.arrayIndex(anyInts!, i) < $.arrayIndex(anyInts!, j)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)))
	await $.println("any slice sort:", $.arrayIndex(anyInts!, 0), $.arrayIndex(anyInts!, 1), $.arrayIndex(anyInts!, 2), await sort2.SliceIsSorted(anySlice, $.functionValue((i: number, j: number): boolean => {
		return $.arrayIndex(anyInts!, i) < $.arrayIndex(anyInts!, j)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))))

	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}

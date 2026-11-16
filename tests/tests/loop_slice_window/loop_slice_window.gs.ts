// Generated file based on loop_slice_window.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class pos {
	public declare Line: number

	public declare Char: number

	constructor(__goscriptValue?: boolean, Line$?: number, Char$?: number) {
		this.Line = Line$ ?? 0
		this.Char = Char$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): pos {
		return new pos(true, this.Line, this.Char)
	}

	public __goscriptAssign(source: pos): this {
		this.Line = source.Line
		this.Char = source.Char
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.pos",
		() => new pos(),
		() => [],
		pos,
		() => [{ name: "Line", key: "Line", type: /* @__PURE__ */ $.basicType("int") }, { name: "Char", key: "Char", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export let calls = 0

export function __goscript_set_calls(__goscriptValue: number): void {
	calls = __goscriptValue
}

export function next(): number {
	calls++
	return calls % 3
}

export function sum(s: $.Slice<number>): number {
	let t = 0
	for (let __goscriptSliceWindow0 = $.sliceRange(s), i = 0; i < __goscriptSliceWindow0.length; i++) {
		t += ((__goscriptSliceWindow0.backing as any[])[$.windowSlot(__goscriptSliceWindow0, i)] as number)
	}
	return t
}

export async function main(): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		// A slice of structs indexed in a range loop over an integer.
		let ps = $.makeSlice<pos>(4, undefined, undefined, () => new pos(true))
		for (let __goscriptSliceWindow1 = $.sliceRange(ps), i = 0; i < 10; i++) {
			let j = $.intRem(i, __goscriptSliceWindow1.length);
			;((__goscriptSliceWindow1.backing as any[])[$.windowSlot(__goscriptSliceWindow1, j)] as pos).Line += i;
			;((__goscriptSliceWindow1.backing as any[])[$.windowSlot(__goscriptSliceWindow1, j)] as pos).Char = ((__goscriptSliceWindow1.backing as any[])[$.windowSlot(__goscriptSliceWindow1, j)] as pos).Line * 2
		}
		await $.println($.plainSliceIndex(ps!, 0).Line, $.plainSliceIndex(ps!, 1).Char, $.plainSliceIndex(ps!, 3).Line)

		// A compound assignment reads and writes the same element.
		let counts = $.arrayToSlice<number>([0, 0, 0])
		for (let __goscriptSliceWindow2 = $.sliceRange(counts), __rangeIndex = 0; __rangeIndex < 6; __rangeIndex++) {
			let k = next();
			;(__goscriptSliceWindow2.backing as any[])[$.windowSlot(__goscriptSliceWindow2, k)] += 10
		}
		await $.println($.plainSliceIndex(counts!, 0), $.plainSliceIndex(counts!, 1), $.plainSliceIndex(counts!, 2), calls)

		// A slice window offsets into its backing array, and a nil slice has none.
		let base = $.arrayToSlice<number>([1, 2, 3, 4, 5, 6])
		let sub = $.goSlice(base, 2, 5)
		await $.println(sum(sub), sum(null), sum(base))

		// Writing elements of a sub-slice writes the shared backing array.
		for (let __goscriptSliceWindow3 = $.sliceRange(sub), i = 0; i < __goscriptSliceWindow3.length; i++) {
			;(__goscriptSliceWindow3.backing as any[])[$.windowSlot(__goscriptSliceWindow3, i)] *= 10
		}
		await $.println($.plainSliceIndex(base!, 1), $.plainSliceIndex(base!, 2), $.plainSliceIndex(base!, 4), $.plainSliceIndex(base!, 5))

		// A slice assigned in the loop is read through the slice each time.
		let grow: $.Slice<number> = $.arrayToSlice<number>([1])
		for (let i = 0; i < 4; i++) {
			grow = $.appendOne(grow, $.plainSliceIndex(grow!, i) * 2)
		}
		await $.println($.sliceLen(grow), $.plainSliceIndex(grow!, 4))

		// A slice that a closure assigns is not windowed.
		let shrink: $.Slice<number> = $.arrayToSlice<number>([5, 6, 7])
		let cut = $.functionValue(() => {
			shrink = $.goSlice(shrink, 1, undefined)
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
		let n = 0
		while ($.sliceLen(shrink) > 0) {
			n += $.plainSliceIndex(shrink!, 0)
			cut()
		}
		await $.println(n)

		// Bytes are read and written in place.
		let b = new Uint8Array([104, 101, 108, 108, 111])
		for (let __goscriptSliceWindow4 = $.sliceRange(b), __goscriptRangeCount0 = $.sliceLen(b), i = 0; i < __goscriptRangeCount0; i++) {
			;(__goscriptSliceWindow4.backing as any[])[$.windowSlot(__goscriptSliceWindow4, i)] = (((__goscriptSliceWindow4.backing as any[])[$.windowSlot(__goscriptSliceWindow4, i)] - 32) & 0xff)
		}
		await $.println($.bytesToString(b))

		// A range loop over one slice indexes another.
		let keys = $.arrayToSlice<number>([2, 0, 1])
		let vals = $.arrayToSlice<string>(["a", "b", "c"])
		let out = ""
		for (let __goscriptRangeTarget0 = keys, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __goscriptSliceWindow5 = $.sliceRange(vals), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
			let k = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as number)
			out += ((__goscriptSliceWindow5.backing as any[])[$.windowSlot(__goscriptSliceWindow5, k)] as string)
		}
		await $.println(out)

		// Nested loops and labeled continue.
		let grid = $.arrayToSlice<$.Slice<number>>([$.arrayToSlice<number>([1, 2]), $.arrayToSlice<number>([3, 4]), $.arrayToSlice<number>([5, 6])])
		let total = 0
		outer: for (let __goscriptSliceWindow6 = $.sliceRange(grid), i = 0; i < __goscriptSliceWindow6.length; i++) {
			let row = ((__goscriptSliceWindow6.backing as any[])[$.windowSlot(__goscriptSliceWindow6, i)] as $.Slice<number>)
			for (let __goscriptSliceWindow7 = $.sliceRange(row), j = 0; j < __goscriptSliceWindow7.length; j++) {
				if (((__goscriptSliceWindow7.backing as any[])[$.windowSlot(__goscriptSliceWindow7, j)] as number) == 4) {
					continue outer
				}
				total += ((__goscriptSliceWindow7.backing as any[])[$.windowSlot(__goscriptSliceWindow7, j)] as number)
			}
		}
		await $.println(total)

		// A slice declared in the loop body is read through itself.
		let acc = 0
		for (let __goscriptSliceWindow8 = $.sliceRange(grid), i = 0; i < __goscriptSliceWindow8.length; i++) {
			let r: $.Slice<number> = ((__goscriptSliceWindow8.backing as any[])[$.windowSlot(__goscriptSliceWindow8, i)] as $.Slice<number>)
			acc += $.plainSliceIndex(r!, 1)
		}
		await $.println(acc)

		// A loop in a function literal reads a slice that its function assigns
		// through the slice.
		let shared: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3])
		let read = $.functionValue((): number => {
			let t = 0
			for (let i = 0; i < 3; i++) {
				t += $.plainSliceIndex(shared!, i)
			}
			return t
		}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
		let first = read()
		shared = $.arrayToSlice<number>([10, 20, 30])
		await $.println(first, read())

		// An index out of range panics.
		__defer.defer(async () => { await (async () => {
			let r = $.recover()
			await $.println("recovered:", r != null)
		})() })
		let short = $.arrayToSlice<number>([1, 2])
		for (let __goscriptSliceWindow9 = $.sliceRange(short), i = 0; i < 3; i++) {
			await $.println(((__goscriptSliceWindow9.backing as any[])[$.windowSlot(__goscriptSliceWindow9, i)] as number))
		}
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

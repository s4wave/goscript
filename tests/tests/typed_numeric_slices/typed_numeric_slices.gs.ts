// Generated file based on typed_numeric_slices.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type celsius = number

export function sum(xs: $.Slice<number>): number {
	let t = 0
	for (let __goscriptRangeTarget0 = xs, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let x = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as number)
		t = globalThis.Math.fround(t + (x))
	}
	return t
}

export function makeOf<T>(__typeArgs: $.GenericTypeArgs | undefined, n: number): $.Slice<T> {
	return $.makeSlice<T>(n, undefined, $.genericSliceTypeHint(__typeArgs, "T"), () => ($.genericZero(__typeArgs, "T", null) as T))
}

export function appendOf<T>(__typeArgs: $.GenericTypeArgs | undefined, s: $.Slice<T>, v: $.Slice<T>): $.Slice<T> {
	return $.appendSlice(s, v, $.appendZero(() => ($.genericZero(__typeArgs, "T", null) as T)))
}

export function kind(v: any): string {
	{
		const __goscriptTypeSwitchValue = v
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic0())) {
			case 0:
				{
					return "[]float32"
				}
				break
			case 1:
				{
					return "[]float64"
				}
				break
			case 2:
				{
					return "[]int32"
				}
				break
			case 3:
				{
					return "[]uint32"
				}
				break
			case 4:
				{
					return "[]int16"
				}
				break
			case 5:
				{
					return "[]uint16"
				}
				break
			case 6:
				{
					return "[]int8"
				}
				break
			case 7:
				{
					return "[]byte"
				}
				break
			case 8:
				{
					return "[]celsius"
				}
				break
		}
	}
	return "other"
}

export async function localLiterals(): globalThis.Promise<void> {
	let big = 2147483647
	let i32 = $.arrayToSlice<number>([big, $.int(((-big - 1) | 0), 32), 7])
	$.sliceElems(i32!)[$.sliceSlot(i32!, 0)] = (($.sliceElems(i32!)[$.sliceSlot(i32!, 0)] + 1) | 0)
	$.sliceElems(i32!)[$.sliceSlot(i32!, 1)] = (($.sliceElems(i32!)[$.sliceSlot(i32!, 1)] - 1) | 0)
	$.sliceElems(i32!)[$.sliceSlot(i32!, 2)] = globalThis.Math.imul($.sliceElems(i32!)[$.sliceSlot(i32!, 2)], 1073741824)
	let u8s = $.arrayToSlice<number>([127, -128])
	$.sliceElems(u8s!)[$.sliceSlot(u8s!, 0)] = $.int($.sliceElems(u8s!)[$.sliceSlot(u8s!, 0)] + (2), 8)
	let u16 = $.arrayToSlice<number>([65535, 3])
	$.sliceElems(u16!)[$.sliceSlot(u16!, 0)] = (($.sliceElems(u16!)[$.sliceSlot(u16!, 0)] + 1) & 0xffff)
	$.sliceElems(u16!)[$.sliceSlot(u16!, 1)] = $.uint($.sliceElems(u16!)[$.sliceSlot(u16!, 1)] - (4), 16)
	await $.println("local wrap:", $.arrayIndex(i32!, 0), $.arrayIndex(i32!, 1), $.arrayIndex(i32!, 2), $.arrayIndex(u8s!, 0), $.arrayIndex(u16!, 0), $.arrayIndex(u16!, 1))
	let f = $.arrayToSlice<number>([0.10000000149011612, 1.6777216e+07])
	$.sliceElems(f!)[$.sliceSlot(f!, 0)] = globalThis.Math.fround($.sliceElems(f!)[$.sliceSlot(f!, 0)] * (3))
	$.sliceElems(f!)[$.sliceSlot(f!, 1)] = globalThis.Math.fround($.sliceElems(f!)[$.sliceSlot(f!, 1)] + 1)
	let x = 0.1
	$.sliceElems(f!)[$.sliceSlot(f!, 0)] = globalThis.Math.fround($.arrayIndex(f!, 0) + globalThis.Math.fround(x))
	await $.println("local float32:", $.arrayIndex(f!, 0) == (0.4000000059604645), $.arrayIndex(f!, 1) == 1.6777216e+07, $.sliceLen(f), $.cap(f))
	let t = 0
	for (let i = 0; i < 100; i++) {
		let v = $.arrayToSlice<number>([globalThis.Math.fround(globalThis.Math.fround(i) / 3), 1, 2])
		t = globalThis.Math.fround(t + (globalThis.Math.fround($.arrayIndex(v!, 0) + $.arrayIndex(v!, 2))))
	}
	let acc = $.arrayToSlice<number>([0, 0])
	let add = $.functionValue((n: number) => {
		$.sliceElems(acc!)[$.sliceSlot(acc!, 0)] = $.uint($.sliceElems(acc!)[$.sliceSlot(acc!, 0)] + (n), 32)
		$.sliceElems(acc!)[$.sliceSlot(acc!, 1)] = $.uint(globalThis.Math.imul($.arrayIndex(acc!, 0), 3) >>> 0, 32)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("uint32")], results: [] } as $.FunctionTypeInfo))
	add(0x80000000)
	add(0x80000001)
	await $.println("local loop:", t, $.arrayIndex(acc!, 0), $.arrayIndex(acc!, 1))
	let __goscriptShadow0 = 0.0
	for (let __goscriptRangeTarget1 = $.typedSliceOf(Float64Array, [0.5, 0.25]) as $.Slice<number>, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), i = 0; i < __goscriptRangeWindow1.length; i++) {
		let e = (__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + i] as number)
		__goscriptShadow0 += i + e
	}
	let w: $.Slice<number> = $.arrayToSlice<number>([1, 2])
	w = $.typedSliceOf(Int16Array, [32767]) as $.Slice<number>
	$.sliceElems(w!)[$.sliceSlot(w!, 0)] = (($.sliceElems(w!)[$.sliceSlot(w!, 0)] + 1) << 16 >> 16)
	await $.println("local range:", __goscriptShadow0, $.arrayIndex(w!, 0), $.sliceLen(w))
}

export async function main(): globalThis.Promise<void> {
	await localLiterals()
	// Integer elements wrap around, as Go stores them.
	let i32 = $.typedSliceOf(Int32Array, [2147483647]) as $.Slice<number>
	$.sliceElems(i32!)[$.sliceSlot(i32!, 0)] = (($.sliceElems(i32!)[$.sliceSlot(i32!, 0)] + 1) | 0)
	await $.println("int32 wrap:", $.arrayIndex(i32!, 0))
	let u32 = $.makeSlice<number>(2, undefined, "uint32")
	$.sliceElems(u32!)[$.sliceSlot(u32!, 0)] = (($.sliceElems(u32!)[$.sliceSlot(u32!, 0)] - 1) >>> 0)
	$.sliceElems(u32!)[$.sliceSlot(u32!, 1)] = 2147483648
	$.sliceElems(u32!)[$.sliceSlot(u32!, 1)] = globalThis.Math.imul($.sliceElems(u32!)[$.sliceSlot(u32!, 1)], 2) >>> 0
	await $.println("uint32 wrap:", $.arrayIndex(u32!, 0), $.arrayIndex(u32!, 1))
	let i16 = $.typedSliceOf(Int16Array, [32767, -32768]) as $.Slice<number>
	$.sliceElems(i16!)[$.sliceSlot(i16!, 0)] = (($.sliceElems(i16!)[$.sliceSlot(i16!, 0)] + 1) << 16 >> 16)
	$.sliceElems(i16!)[$.sliceSlot(i16!, 1)] = (($.sliceElems(i16!)[$.sliceSlot(i16!, 1)] - 1) << 16 >> 16)
	let u16 = $.typedSliceOf(Uint16Array, [65535]) as $.Slice<number>
	$.sliceElems(u16!)[$.sliceSlot(u16!, 0)] = $.uint($.sliceElems(u16!)[$.sliceSlot(u16!, 0)] + (2), 16)
	let i8 = $.typedSliceOf(Int8Array, [127]) as $.Slice<number>
	$.sliceElems(i8!)[$.sliceSlot(i8!, 0)] = (($.sliceElems(i8!)[$.sliceSlot(i8!, 0)] + 1) << 24 >> 24)
	await $.println("small wrap:", $.arrayIndex(i16!, 0), $.arrayIndex(i16!, 1), $.arrayIndex(u16!, 0), $.arrayIndex(i8!, 0))

	// float32 elements round to float32, float64 elements do not.
	let f32 = $.makeSlice<number>(3, undefined, "float32")
	$.sliceElems(f32!)[$.sliceSlot(f32!, 0)] = 0.10000000149011612
	$.sliceElems(f32!)[$.sliceSlot(f32!, 1)] = globalThis.Math.fround($.arrayIndex(f32!, 0) * 3)
	let x = 16777216.0
	$.sliceElems(f32!)[$.sliceSlot(f32!, 2)] = globalThis.Math.fround((x + 1))
	await $.println("float32:", $.arrayIndex(f32!, 0) == 0.10000000149011612, $.arrayIndex(f32!, 0) == 0.1, $.arrayIndex(f32!, 1) == 0.30000001192092896, $.arrayIndex(f32!, 1) == 0.3, $.arrayIndex(f32!, 2) == 1.6777216e+07)
	let f64 = $.typedSliceOf(Float64Array, [0.1]) as $.Slice<number>
	$.sliceElems(f64!)[$.sliceSlot(f64!, 0)] *= 3
	await $.println("float64:", $.arrayIndex(f64!, 0) == 0.3, $.arrayIndex(f64!, 0))
	await $.println("variadic:", sum($.typedSliceOf(Float32Array, [1.5, 2.25, 0.125]) as $.Slice<number>), sum($.goSlice(f32, undefined, 2)) == (globalThis.Math.fround($.arrayIndex(f32!, 0) + $.arrayIndex(f32!, 1))))

	// Nil and empty slices differ, and nil appends as empty.
	let nilF: $.Slice<number> = null! as $.Slice<number>
	let empty = $.typedSliceOf(Float32Array, []) as $.Slice<number>
	await $.println("nil:", nilF == null, empty == null, $.sliceLen(nilF), $.sliceLen(empty), $.cap(empty))
	nilF = $.appendValues(nilF, $.typedSliceHints.float32, 1, 2)
	await $.println("append nil:", $.sliceLen(nilF), $.arrayIndex(nilF!, 0), $.arrayIndex(nilF!, 1))
	let nilU: $.Slice<number> = null! as $.Slice<number>
	nilU = $.appendSlice(nilU, $.typedSliceOf(Uint16Array, []) as $.Slice<number>, $.typedSliceHints.uint16)
	await $.println("append none to nil:", nilU == null)

	// Appending within capacity shares the backing array, and growing it does
	// not.
	let base = $.makeSlice<number>(2, 4, "float32")
	let a = $.appendOne(base, 3, $.typedSliceHints.float32)
	let b = $.appendOne(base, 4, $.typedSliceHints.float32)
	await $.println("shared:", $.arrayIndex(a!, 2), $.arrayIndex(b!, 2), $.sliceLen(a), $.cap(a))
	let c = $.appendValues(a, $.typedSliceHints.float32, 5, 6)
	$.sliceElems(c!)[$.sliceSlot(c!, 0)] = 9
	await $.println("grown:", $.sliceLen(c), $.cap(c) >= 5, $.arrayIndex(a!, 0), $.arrayIndex(c!, 0), $.arrayIndex(c!, 4))
	let grow: $.Slice<number> = null! as $.Slice<number>
	for (let i = 0; i < 1000; i++) {
		grow = $.appendOne(grow, $.int(globalThis.Math.imul($.int(i, 32), 3000000), 32), $.typedSliceHints.int32)
	}
	await $.println("many appends:", $.sliceLen(grow), $.arrayIndex(grow!, 999), $.arrayIndex(grow!, 500))

	// Slicing windows share elements, reslice into spare capacity, and keep
	// the capacity of their window.
	let w = $.typedSliceOf(Uint32Array, [1, 2, 3, 4, 5, 6]) as $.Slice<number>
	let mid = $.goSlice(w, 2, 4)
	$.sliceElems(mid!)[$.sliceSlot(mid!, 0)] = 30
	await $.println("window:", $.arrayIndex(w!, 2), $.sliceLen(mid), $.cap(mid), $.arrayIndex(mid!, 1))
	let ext = $.goSlice(mid, undefined, 4)
	$.sliceElems(ext!)[$.sliceSlot(ext!, 3)] = 60
	await $.println("extended:", $.sliceLen(ext), $.arrayIndex(w!, 5))
	let clipped: $.Slice<number> = $.goSlice(w, 1, 3, 3)
	clipped = $.appendOne(clipped, $.uint(99, 32), $.typedSliceHints.uint32)
	await $.println("clipped:", $.arrayIndex(w!, 3), $.arrayIndex(clipped!, 2), $.cap(clipped) >= 3)
	for (let __goscriptRangeTarget2 = $.goSlice(w, 4, undefined), __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), i = 0; i < __goscriptRangeWindow2.length; i++) {
		let v = $.uint((__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + i] as number), 32)
		await $.println("range:", i, v)
	}

	// copy moves elements between typed slices, overlapping ones too, and
	// between typed and generic slices.
	let src = $.typedSliceOf(Float64Array, [1, 2, 3, 4, 5]) as $.Slice<number>
	let n = $.copy($.goSlice(src, 1, undefined), src)
	await $.println("overlap copy:", n, $.arrayIndex(src!, 0), $.arrayIndex(src!, 1), $.arrayIndex(src!, 4))
	let gen: $.Slice<number> = (makeOf(__goscriptStatic1(), 3) as $.Slice<number>)
	$.sliceElems(gen!)[$.sliceSlot(gen!, 0)] = 0.10000000149011612
	n = $.copy(f32, gen)
	await $.println("copy from generic:", n, $.arrayIndex(f32!, 0) == 0.10000000149011612, $.arrayIndex(f32!, 2))
	n = $.copy(gen, $.typedSliceOf(Float32Array, [7, 8]) as $.Slice<number>)
	await $.println("copy to generic:", n, $.arrayIndex(gen!, 0), $.arrayIndex(gen!, 1))
	gen = $.appendOne(gen, 1.5, $.typedSliceHints.float32)
	await $.println("append generic:", $.sliceLen(gen), $.arrayIndex(gen!, 3))
	let plain: $.Slice<number> = (appendOf(__goscriptStatic1(), null, $.typedSliceOf(Float32Array, [0.10000000149011612, 2]) as $.Slice<number>) as $.Slice<number>)
	n = $.copy(f32, plain)
	await $.println("copy from plain:", n, $.arrayIndex(f32!, 0) == 0.10000000149011612, $.arrayIndex(f32!, 1))
	n = $.copy(plain, $.typedSliceOf(Float32Array, [7]) as $.Slice<number>)
	plain = $.appendOne(plain, 3, $.typedSliceHints.float32)
	$.sliceElems(plain!)[$.sliceSlot(plain!, 1)] = globalThis.Math.fround($.sliceElems(plain!)[$.sliceSlot(plain!, 1)] + (0.10000000149011612))
	await $.println("copy to plain:", n, $.arrayIndex(plain!, 0), $.sliceLen(plain), $.arrayIndex(plain!, 1) == 2.0999999046325684)

	// Arrays stay arrays, and a slice of an array shares its elements.
	let arr = $.arrayValue([1, 2, 3, 4], __goscriptStatic2())
	let _as: $.Slice<number> = $.goSlice(arr, 1, 3)
	$.sliceElems(_as!)[$.sliceSlot(_as!, 0)] = 20
	await $.println("array slice:", arr[1], $.sliceLen(_as), $.cap(_as))
	_as = $.appendOne(_as, 30, $.typedSliceHints.float32)
	await $.println("array append:", arr[3])
	let arr2 = $.cloneArrayValue($.sliceToArray<number>($.goSlice(w, undefined, 3), 3), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint32"), 3))
	arr2[0] = 100
	await $.println("slice to array:", arr2[0], $.arrayIndex(w!, 0), 3)
	let ap = $.sliceToArrayPointer<number>($.goSlice(w, 1, undefined), 2)
	$.pointerValue<number[]>(ap)[0] = 200
	await $.println("array pointer:", $.arrayIndex(w!, 1))

	// clear zeroes the window only.
	let z = $.typedSliceOf(Int16Array, [1, 2, 3, 4]) as $.Slice<number>
	$.clear($.goSlice(z, 1, 3), () => 0)
	await $.println("clear:", $.arrayIndex(z!, 0), $.arrayIndex(z!, 1), $.arrayIndex(z!, 2), $.arrayIndex(z!, 3))

	// Pointers to elements read and write the element.
	let p = $.indexRef(f64!, 0)
	p!.value = 2.5
	let q = $.indexRef(w!, 2)
	q!.value = $.uint(q!.value + (1), 32)
	await $.println("pointer:", $.arrayIndex(f64!, 0), $.arrayIndex(w!, 2), $.indexAddress(w!, 2) == $.indexAddress(mid!, 0))

	// Named element types and type switches tell typed slices apart.
	let temps: $.Slice<celsius> = $.typedSliceOf(Float32Array, [36.599998474121094, 37.20000076293945]) as $.Slice<celsius>
	temps = $.appendOne(temps, 38, $.typedSliceHints.float32)
	await $.println("named:", $.sliceLen(temps), $.arrayIndex(temps!, 2), kind($.interfaceValue(temps, "[]main.celsius", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32", "main.celsius")))))
	await $.println("kinds:", kind($.interfaceValue(f32, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32")))), kind($.interfaceValue(f64, "[]float64", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float64")))), kind($.interfaceValue(i32, "[]int32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32")))), kind($.interfaceValue(u32, "[]uint32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint32")))), kind($.interfaceValue(i16, "[]int16", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int16")))), kind($.interfaceValue(u16, "[]uint16", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint16")))), kind($.interfaceValue(i8, "[]int8", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int8")))), kind($.interfaceValue(new Uint8Array([1]) as $.Slice<number>, "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")))))
	let anyRunes: any = $.interfaceValue($.stringToRunes("h\xc3\xa9"), "[]rune", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32")))
	let [, isRunes] = $.typeAssertTuple<$.Slice<number>>(anyRunes, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32")))
	await $.println("runes:", isRunes, $.sliceLen($.mustTypeAssert<$.Slice<number>>(anyRunes, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32")))), $.runesToString($.mustTypeAssert<$.Slice<number>>(anyRunes, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32")))))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32")), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float64")), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32")), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint32")), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int16")), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint16")), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int8")), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32", "main.celsius"))]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("float32"), zero: () => 0 }})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 4))
}

if ($.isMainScript(import.meta)) {
	await main()
}

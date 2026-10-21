// Generated file based on package_table_constant_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export var nibbles: Uint8Array

export function __goscript_init_nibbles(): void {
	if (((nibbles) as any) === undefined) {
		nibbles = $.arrayValue(new Uint8Array([11, 48, 85, 122, 159, 196, 233, 14, 51, 88, 125, 162, 199, 236, 17, 54, 91, 128, 165, 202, 239, 20, 57, 94, 131, 168, 205, 242, 23, 60, 97, 134, 171, 208, 245, 26, 63, 100, 137, 174, 211, 248, 29, 66, 103, 140, 177, 214, 251, 32, 69, 106, 143, 180, 217, 254, 35, 72, 109, 146, 183, 220, 1, 38, 75, 112, 149, 186, 223, 4, 41, 78, 115, 152, 189, 226, 7, 44, 81, 118, 155, 192, 229, 10, 47, 84, 121, 158, 195, 232, 13, 50, 87, 124, 161, 198, 235, 16, 53, 90, 127, 164, 201, 238, 19, 56, 93, 130, 167, 204, 241, 22, 59, 96, 133, 170, 207, 244, 25, 62, 99, 136, 173, 210, 247, 28, 65, 102, 139, 176, 213, 250, 31, 68, 105, 142, 179, 216, 253, 34, 71, 108, 145, 182, 219, 0, 37, 74, 111, 148, 185, 222, 3, 40, 77, 114, 151, 188, 225, 6, 43, 80, 117, 154, 191, 228, 9, 46, 83, 120, 157, 194, 231, 12, 49, 86, 123, 160, 197, 234, 15, 52, 89, 126, 163, 200, 237, 18, 55, 92, 129, 166, 203, 240, 21, 58, 95, 132, 169, 206, 243, 24, 61, 98, 135, 172, 209, 246, 27, 64, 101, 138, 175, 212, 249, 30, 67, 104, 141, 178, 215, 252, 33, 70, 107, 144, 181, 218, 255, 36, 73, 110, 147, 184, 221, 2, 39, 76, 113, 150, 187, 224, 5, 42, 79, 116, 153, 190, 227, 8, 45, 82, 119, 156, 193, 230, 11, 48, 85, 122, 159, 196, 233, 14, 51, 88, 125, 162, 199, 236, 17, 54, 91, 128, 165, 202, 239, 20, 57, 94, 131, 168, 205, 242, 23, 60, 97, 134, 171, 208, 245, 26, 63, 100, 137, 174, 211, 248, 29, 66]))
	}
}

export function __goscript_get_nibbles(): Uint8Array {
	if (((nibbles) as any) === undefined) {
		__goscript_init_nibbles()
	}
	return nibbles
}

export function __goscript_set_nibbles(__goscriptValue: Uint8Array): void {
	nibbles = $.assignFieldValue(nibbles, __goscriptValue, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 300))
}

export function bits4(a: $.Slice<number>, i: number): number {
	return $.uint(($.uintShr($.arrayIndex(a!, $.intShr(i, 1)), ($.intShl((i & 1), 2)), 8)) & 0b1111, 8)
}

export function lookup(u: number): number {
	return bits4(__goscriptStatic0(), ($.intShl(bits4(__goscriptStatic1(), u & 63), 2)) + (u & 3))
}

export let small: number[] = $.arrayValue([10, 20, 30, 40, 50, 60])

export function __goscript_set_small(__goscriptValue: number[]): void {
	small = $.assignFieldValue(small, __goscriptValue, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 6))
}

export function sum(a: $.Slice<number>): number {
	let total = 0
	for (let __goscriptRangeTarget0 = a, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let v = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as number)
		total += v
	}
	return total
}

export function first(a: $.Slice<number>): number {
	return $.arrayIndex(a!, 0) + sum($.goSlice(a, 1, undefined))
}

export let word: $.Slice<number> = new Uint8Array([103, 111, 115, 99, 114, 105, 112, 116, 32, 116, 97, 98, 108, 101, 115])

export function __goscript_set_word(__goscriptValue: $.Slice<number>): void {
	word = __goscriptValue
}

export let computed: $.Slice<number> = makeTable()

export function __goscript_set_computed(__goscriptValue: $.Slice<number>): void {
	computed = __goscriptValue
}

export let derived: number = sum(__goscriptStatic2())

export function __goscript_set_derived(__goscriptValue: number): void {
	derived = __goscriptValue
}

export function makeTable(): $.Slice<number> {
	let t = $.makeSlice<number>(4, undefined, "number")
	for (let __goscriptRangeTarget1 = t, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), i = 0; i < __goscriptRangeWindow1.length; i++) {
		;(__goscriptRangeWindow1.backing as any[])[__goscriptRangeWindow1.offset + i] = i * 100
	}
	return t
}

export let replaced: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3])

export function __goscript_set_replaced(__goscriptValue: $.Slice<number>): void {
	replaced = __goscriptValue
}

export function replace(): void {
	replaced = $.arrayToSlice<number>([7, 8, 9])
}

export let written: number[] = $.arrayValue([1, 2, 3, 4])

export function __goscript_set_written(__goscriptValue: number[]): void {
	written = $.assignFieldValue(written, __goscriptValue, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 4))
}

export function clobber(a: $.Slice<number>): void {
	$.sliceElems(a!)[$.sliceSlot(a!, 0)] = 99
}

export let short: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3])

export function __goscript_set_short(__goscriptValue: $.Slice<number>): void {
	short = __goscriptValue
}

export function shortLen(): number {
	return $.sliceLen(__goscriptStatic3())
}

export function neverCalled(): number {
	return $.sliceLen(__goscriptStatic4())
}

export async function tryShortLen(): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		__defer.defer(async () => { await (async () => {
			let [, isError] = $.typeAssertTuple<$.GoError>($.recover(), "error")
			await $.println("recovered:", isError)
		})() })
		await $.println("short len:", shortLen())
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export async function main(): globalThis.Promise<void> {
	// The two-level lookup gives the same values on every call.
	let total = 0
	for (let u = 0; u < 512; u++) {
		total += lookup(u)
	}
	await $.println("lookup total:", total, lookup(5), lookup(5))

	// The [lo:hi], [:hi], [lo:] and [:] forms of a table that is not
	// deferred.
	await $.println("small:", sum(__goscriptStatic5()), sum(__goscriptStatic6()), sum(__goscriptStatic7()), sum(__goscriptStatic8()))
	await $.println("small len/cap:", $.sliceLen(__goscriptStatic9()), $.cap(__goscriptStatic9()), $.sliceLen(__goscriptStatic10()), $.cap(__goscriptStatic10()))
	await $.println("small first:", first(__goscriptStatic11()), $.arrayIndex(__goscriptStatic12()!, 2))
	await $.println("word:", $.bytesToString(__goscriptStatic13()), $.bytesToString(__goscriptStatic14()))

	// A table read during initialization.
	await $.println("derived:", derived, sum(__goscriptStatic2()), $.arrayIndex(__goscriptStatic15()!, 2))

	// A reassigned table gives the new elements.
	await $.println("replaced before:", sum($.goSlice(replaced, 1, undefined)))
	replace()
	await $.println("replaced after:", sum($.goSlice(replaced, 1, undefined)))

	// A table changed through a slice gives the changed elements.
	await $.println("written before:", sum($.goSlice(written, 1, undefined)))
	clobber($.goSlice(written, 1, undefined))
	await $.println("written after:", sum($.goSlice(written, 1, undefined)), written[1])

	// Out of range bounds panic each time the slice is taken, not before.
	await tryShortLen()
	await tryShortLen()
	if (total < 0) {
		await $.println(neverCalled())
	}
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.goSlice(__goscript_get_nibbles(), 200, undefined))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ($.goSlice(__goscript_get_nibbles(), undefined, undefined))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ($.goSlice(computed, 1, 3))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ($.goSlice(short, 1, 5))
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ($.goSlice(short, undefined, 9))
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ($.goSlice(small, 1, 4))
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ($.goSlice(small, undefined, 2))
}

var __goscriptStatic7$value: any
function __goscriptStatic7(): any {
	return __goscriptStatic7$value ??= ($.goSlice(small, 3, undefined))
}

var __goscriptStatic8$value: any
function __goscriptStatic8(): any {
	return __goscriptStatic8$value ??= ($.goSlice(small, undefined, undefined))
}

var __goscriptStatic9$value: any
function __goscriptStatic9(): any {
	return __goscriptStatic9$value ??= ($.goSlice(small, 2, 4))
}

var __goscriptStatic10$value: any
function __goscriptStatic10(): any {
	return __goscriptStatic10$value ??= ($.goSlice(small, undefined, 3, 4))
}

var __goscriptStatic11$value: any
function __goscriptStatic11(): any {
	return __goscriptStatic11$value ??= ($.goSlice(small, 2, undefined))
}

var __goscriptStatic12$value: any
function __goscriptStatic12(): any {
	return __goscriptStatic12$value ??= ($.goSlice(small, 1, 5))
}

var __goscriptStatic13$value: any
function __goscriptStatic13(): any {
	return __goscriptStatic13$value ??= ($.goSlice(word, undefined, 8))
}

var __goscriptStatic14$value: any
function __goscriptStatic14(): any {
	return __goscriptStatic14$value ??= ($.goSlice(word, 9, undefined))
}

var __goscriptStatic15$value: any
function __goscriptStatic15(): any {
	return __goscriptStatic15$value ??= ($.goSlice(computed, 1, undefined))
}

if ($.isMainScript(import.meta)) {
	await main()
}

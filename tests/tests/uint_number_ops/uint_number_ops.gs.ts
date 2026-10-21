// Generated file based on uint_number_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let values: $.Slice<number> = $.arrayToSlice<number>([0, 1, 7, 31, 32, 1000003, 4294967295, 4294967296, 4294967301, 9007199254740991, $.uint("9007199254740992", 64), $.uint("9007199254740993", 64), $.uint("9223372036854788153", 64), $.uint("18446744073709551615", 64)])

export function __goscript_set_values(__goscriptValue: $.Slice<number>): void {
	values = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	// Each operation is checked on every pair of values.
	for (let __goscriptRangeTarget1 = values, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let a = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as number)
		for (let __goscriptRangeTarget0 = values, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
			let b = (__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as number)
			await $.println(a, b, $.wideUintAdd(a, b), $.wideUintSub(a, b), $.wideUintMul(a, b), $.wideUintAnd(a, b), $.wideUintOr(a, b), $.wideUintXor(a, b), $.wideUintAndNot(a, b))
			if (b != 0) {
				await $.println(" ", $.wideUintDiv(a, b), $.wideUintMod(a, b))
			}
		}
	}

	// Shifts by constants and variables.
	for (let __goscriptRangeTarget3 = values, __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget3), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow2.length; __rangeIndex++) {
		let a = (__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + __rangeIndex] as number)
		for (let __goscriptRangeTarget2 = $.arrayToSlice<number>([0, 1, 5, 31, 32, 33, 52, 53, 63, 64, 70]), __goscriptRangeWindow3 = $.sliceRange(__goscriptRangeTarget2), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow3.length; __rangeIndex++) {
			let s = (__goscriptRangeWindow3.backing[__goscriptRangeWindow3.offset + __rangeIndex] as number)
			await $.println(a, s, $.wideUintShl(a, s), $.wideUintShr(a, s), $.wideUintShl(a, 3), $.wideUintShr(a, 3), $.uint($.uint64Mul(a, (2 ** 40)), 64), $.wideUintShr(a, 40))
		}
	}

	// Compound assignments and the bit vector arithmetic of regexp's
	// backtracker, with constant operands.
	let visited: number[] = $.arrayValue(globalThis.Array.from({ length: 8 }, () => 0))
	for (let pc = 0; pc < 5; pc = ((pc + 1) >>> 0)) {
		for (let pos = 0; pos < 7; pos++) {
			let n = $.uint((pc * (7 + 1)) + pos, 64)
			visited[$.wideUintDiv(n, 32)] = (visited[$.wideUintDiv(n, 32)] | ($.uint(((1 << ($.wideUintAnd(n, 31))) >>> 0), 32))) >>> 0
		}
	}
	await $.println(visited[0], visited[1])
	let u = 9007199254740989
	u = $.wideUintAdd(u, 5)
	u = $.wideUintMul(u, 3)
	u = $.wideUintSub(u, $.uint("1152921504606846976", 64))
	u = $.wideUintDiv(u, 7)
	u = $.wideUintMod(u, 1000000007)
	u = $.wideUintShl(u, 20)
	u = $.wideUintShr(u, 3)
	u = $.wideUintAnd(u, 35184372088831)
	u = $.wideUintOr(u, 1125899906842624)
	u = $.wideUintXor(u, 12345)
	u = $.wideUintAndNot(u, 255)
	await $.println(u)

	// uintptr shares the representation.
	let p = 1099511627785
	await $.println($.uint($.wideUintMul(p, p), 64), $.uint($.wideUintDiv(p, 3), 64), $.uint($.wideUintShr(p, 7), 64), $.uint($.wideUintAnd(p, 255), 64))
}

if ($.isMainScript(import.meta)) {
	await main()
}

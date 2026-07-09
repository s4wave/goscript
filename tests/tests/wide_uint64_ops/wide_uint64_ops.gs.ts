// Generated file based on wide_uint64_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"
import "@goscript/math/index.js"

export function hash6(u: bigint, h: number): number {
	const prime6bytes: number = 227718039650203
	return $.uint($.uint($.uint64Shr(($.uint64Mul(($.uint64Shl(u, 16n)), 227718039650203n)), ($.uint($.uint64And(($.uint($.uint64Sub(64n, h), 64)), 63n), 64))), 32), 32)
}

export function mix(a: bigint, b: bigint): bigint {
	return $.uint64Shr(($.uint64Xor(($.uint64And(a, b)), ($.uint64Or(a, 1n)))), 60n)
}

export function highAfterMask(v: bigint): bigint {
	return $.uint64Mul(($.uint64And(v, 65535n)), (2 ** 48))
}

export function combineHighLow(v: bigint, low: bigint): bigint {
	return $.uint64Add(($.uint64Mul(($.uint64And(v, 65535n)), (2 ** 48))), $.uint64($.uint(low, 16)))
}

export function maxUint64Divisor(d: bigint): bigint {
	return $.uint64Div(18446744073709551615n, d)
}

export function maxUint64Remainder(d: bigint): bigint {
	return $.uint64Mod(18446744073709551615n, d)
}

export function setHighBit(idx: bigint): boolean {
	let words: $.Slice<bigint> = $.arrayToSlice<bigint>([0n, 0n])
	words![Number($.uint64Div(idx, 64n))] = $.uint64Or(words![Number($.uint64Div(idx, 64n))], $.uint64Shl(1n, ($.uint64Mod(idx, 64n))))
	return $.arrayIndex(words!, 1) != 0n
}

export function uintBitLen(n: number): number {
	let len = 0
	while (n != 0) {
		len++
		n = $.uint($.uint64Shr(n, 1n), 64)
	}
	return len
}

export function uintShiftAssign(n: number): number {
	n = $.uint($.uint64Shr(n, 40), 64)
	return n
}

export async function main(): globalThis.Promise<void> {
	$.println($.uint(hash6(4328719365n, 14), 32))
	$.println(mix(17361641481138401520n, 1085102592571150095n))
	$.println($.uint($.uint($.uint64Shr(highAfterMask(4660n), 48n), 32), 32))
	$.println($.uint($.uint($.uint64Shr(combineHighLow(4660n, 48879n), 48n), 32), 32))
	$.println($.uint($.uint($.uint64And(combineHighLow(4660n, 48879n), 65535n), 32), 32))
	$.println(maxUint64Divisor(4114n))
	$.println(maxUint64Remainder(4114n))
	$.println(setHighBit(maxUint64Remainder(128n)))
	$.println(uintBitLen($.uint("18446744073709551615", 64)))
	$.println(uintShiftAssign($.uint("18446744073709551615", 64)))
}

if ($.isMainScript(import.meta)) {
	await main()
}

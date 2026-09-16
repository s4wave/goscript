// Generated file based on uint32_wrap_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function checksum(c: number): number {
	return $.uint(c + 2, 32)
}

export async function main(): globalThis.Promise<void> {
	let c: number = $.uint(4294967295, 32)
	let v = $.uint(checksum($.uint(c, 32)), 32)
	await $.println($.uint(v, 32) == $.uint(1, 32))
	await $.println($.uint($.uint(v, 8), 8) == $.uint(1, 8))
	let high: number = $.uint(0x80000000, 32)
	await $.println($.uint(($.uintShr(high, 31, 32)), 32) == $.uint(1, 32))
	high = (high >>> ($.uint(1, 32))) >>> 0
	await $.println($.uint(high, 32) == $.uint(0x40000000, 32))
	await $.println($.uint(($.uint(~$.uint(0, 16), 16) as number), 16) == $.uint(0xffff, 16))
	await $.println($.uint(($.uintShr(high, 32, 32)), 32) == $.uint(0, 32))
	let count: number = 0
	for (let mask = $.uint($.uint(8, 8), 8); $.uint(mask, 8) <= $.uint(24, 8); [mask, count] = [$.uint(mask - 8, 8), count + 1]) {
		await $.println($.uint(mask, 8))
	}
	await $.println(count)

	// Compound assignment must wrap like plain assignment on narrow integers.
	let sum: number = $.uint(4294967294, 32)
	sum = $.uint(sum + ($.uint(7, 32)), 32)
	await $.println($.uint(sum, 32))
	sum = $.uint(sum - ($.uint(9, 32)), 32)
	await $.println($.uint(sum, 32))
	let prod: number = $.uint(0x10000, 32)
	prod = Math.imul(prod, $.uint(0x10000, 32)) >>> 0
	await $.println($.uint(prod, 32) == $.uint(0, 32))
	let shifted: number = $.uint(0x40000000, 32)
	shifted = $.uint(shifted << ($.uint(1, 32)), 32)
	await $.println($.uint(shifted, 32) == $.uint(0x80000000, 32))
	shifted = $.uint(shifted << ($.uint(1, 32)), 32)
	await $.println($.uint(shifted, 32))
	let small: number = $.uint(65535, 16)
	small = $.uint(small + ($.uint(2, 16)), 16)
	await $.println($.uint(small, 16))
	small = $.uint(small - ($.uint(4, 16)), 16)
	await $.println($.uint(small, 16))
	let half: number = $.uint(0x8000, 16)
	half = $.uint(half << ($.uint(1, 16)), 16)
	await $.println($.uint(half, 16) == $.uint(0, 16))
	let down: number = $.int(-128, 8)
	down = $.int(down - ($.int(1, 8)), 8)
	await $.println($.int(down, 8) == $.int(127, 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}

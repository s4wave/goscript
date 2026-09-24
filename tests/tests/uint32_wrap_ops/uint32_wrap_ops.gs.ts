// Generated file based on uint32_wrap_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function checksum(c: number): number {
	return $.uint(c + 2, 32)
}

export async function main(): globalThis.Promise<void> {
	let c: number = 4294967295
	let v = $.uint(checksum($.uint(c, 32)), 32)
	await $.println($.uint(v, 32) == 1)
	await $.println($.uint($.uint(v, 8), 8) == 1)
	let high: number = 0x80000000
	await $.println($.uint(($.uintShr(high, 31, 32)), 32) == 1)
	high = (high >>> (1)) >>> 0
	await $.println($.uint(high, 32) == 0x40000000)
	await $.println((65535 as number) == 0xffff)
	await $.println($.uint(($.uintShr(high, 32, 32)), 32) == 0)
	let count: number = 0
	for (let mask = 8; $.uint(mask, 8) <= 24; [mask, count] = [$.uint(mask - 8, 8), count + 1]) {
		await $.println($.uint(mask, 8))
	}
	await $.println(count)

	// Compound assignment must wrap like plain assignment on narrow integers.
	let sum: number = 4294967294
	sum = $.uint(sum + (7), 32)
	await $.println($.uint(sum, 32))
	sum = $.uint(sum - (9), 32)
	await $.println($.uint(sum, 32))
	let prod: number = 0x10000
	prod = Math.imul(prod, 0x10000) >>> 0
	await $.println($.uint(prod, 32) == 0)
	let shifted: number = 0x40000000
	shifted = $.uint(shifted << (1), 32)
	await $.println($.uint(shifted, 32) == 0x80000000)
	shifted = $.uint(shifted << (1), 32)
	await $.println($.uint(shifted, 32))
	let small: number = 65535
	small = $.uint(small + (2), 16)
	await $.println($.uint(small, 16))
	small = $.uint(small - (4), 16)
	await $.println($.uint(small, 16))
	let half: number = 0x8000
	half = $.uint(half << (1), 16)
	await $.println($.uint(half, 16) == 0)
	let down: number = -128
	down = $.int(down - (1), 8)
	await $.println($.int(down, 8) == 127)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on uint32_wrap_ops.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function checksum(c: number): number {
	return $.uint(((c + 2) >>> 0), 32)
}

export async function main(): globalThis.Promise<void> {
	let c = 4294967295
	let v = checksum(c)
	await $.println(v == 1)
	await $.println($.uint(v, 8) == 1)
	let high: number = 0x80000000
	await $.println($.uint(($.uintShr(high, 31, 32)), 32) == 1)
	high = (high >>> 1) >>> 0
	await $.println(high == 0x40000000)
	await $.println((65535 as number) == 0xffff)
	await $.println($.uint(($.uintShr(high, 32, 32)), 32) == 0)
	let count = 0
	for (let mask = 8; mask <= 24; [mask, count] = [$.uint(((mask - 8) & 0xff), 8), count + 1]) {
		await $.println(mask)
	}
	await $.println(count)

	// Compound assignment must wrap like plain assignment on narrow integers.
	let sum = 4294967294
	sum = ((sum + 7) >>> 0)
	await $.println(sum)
	sum = ((sum - 9) >>> 0)
	await $.println(sum)
	let prod: number = 0x10000
	prod = globalThis.Math.imul(prod, 0x10000) >>> 0
	await $.println(prod == 0)
	let shifted: number = 0x40000000
	shifted = ((shifted << 1) >>> 0)
	await $.println(shifted == 0x80000000)
	shifted = ((shifted << 1) >>> 0)
	await $.println(shifted)
	let small = 65535
	small = ((small + 2) & 0xffff)
	await $.println(small)
	small = ((small - 4) & 0xffff)
	await $.println(small)
	let half: number = 0x8000
	half = ((half << 1) & 0xffff)
	await $.println(half == 0)
	let down = -128
	down = ((down - 1) << 24 >> 24)
	await $.println(down == 127)
}

if ($.isMainScript(import.meta)) {
	await main()
}

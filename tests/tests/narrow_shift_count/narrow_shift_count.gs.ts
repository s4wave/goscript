// Generated file based on narrow_shift_count.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function mask(start: number, end: number): number {
	return $.uint((start < 32 ? (((((((((((((end - start) & 0xff)) + 1) & 0xff)) < 32 ? ((1 << ((((((end - start) & 0xff)) + 1) & 0xff))) >>> 0) : 0)) - 1) >>> 0)) << start) >>> 0) : 0), 32)
}

export function count(): number {
	return 33
}

export async function main(): globalThis.Promise<void> {
	await $.println("mask 0..31", mask(0, 31))
	await $.println("mask 4..31", mask(4, 31))
	await $.println("mask 0..3", mask(0, 3))

	let n = 32
	let u32 = 1
	let i32 = 1
	let neg = -8
	let u16 = 1
	let i8 = -1
	let u8 = 1
	await $.println("uint32 << 32", $.uint((n < 32 ? ((u32 << n) >>> 0) : 0), 32), "int32 << 32", $.int((n < 32 ? (i32 << n) : 0), 32), "uint16 << 32", $.uint((n < 32 ? ((u16 << n) & 0xffff) : 0), 16), "uint8 << 32", $.uint((n < 32 ? ((u8 << n) & 0xff) : 0), 8))
	await $.println("int32 >> 32", $.int((i32 >> (n < 32 ? n : 31)), 32), "negative int32 >> 32", $.int((neg >> (n < 32 ? n : 31)), 32), "int8 >> 32", $.int((i8 >> (n < 32 ? n : 31)), 8))
	await $.println("uint32 << 31", $.uint((($.uint($.uint64Sub(n, 1n), 64)) < 32 ? ((u32 << ($.uint($.uint64Sub(n, 1n), 64))) >>> 0) : 0), 32), "int32 << 31", $.int((($.uint($.uint64Sub(n, 1n), 64)) < 32 ? (i32 << ($.uint($.uint64Sub(n, 1n), 64))) : 0), 32))
	await $.println("uint32 << call", $.uint((($.narrowShl(u32, count())) >>> 0), 32), "int32 >> call", $.int((($.narrowShr(neg, count())) | 0), 32))

	// Compound assignments shift the same way.
	let a = u32
	let b = i32
	let c = neg
	let d = u16
	a = $.uint($.narrowShl(a, ($.uint(n, 32))), 32)
	b = $.int($.narrowShl(b, ($.int(n, 32))), 32)
	c = $.narrowShr(c, ($.int(n, 32)))
	d = $.uint($.narrowShl(d, ($.uint(n, 16))), 16)
	await $.println("assign", a, b, c, d)
	let e = u32
	let f = neg
	e = $.uint($.narrowShl(e, ($.uint(count(), 32))), 32)
	f = $.narrowShr(f, ($.int(count(), 32)))
	await $.println("assign call", e, f)
	await $.println("bit", bit(32), bit(97), bit(0x3f))
}

export function bit(r: number): number {
	return $.uint(((1 << (r & 0x1f)) >>> 0), 32)
}

if ($.isMainScript(import.meta)) {
	await main()
}

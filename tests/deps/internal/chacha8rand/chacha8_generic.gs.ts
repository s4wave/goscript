// Generated file based on chacha8_generic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as goarch from "@goscript/internal/goarch/index.js"

import * as unsafe from "@goscript/unsafe/index.js"

import * as __goscript_chacha8 from "./chacha8.gs.ts"
import "@goscript/internal/goarch/index.js"
import "@goscript/unsafe/index.js"
import "./chacha8.gs.ts"

export function setup(seed: $.VarRef<bigint[]> | null, b32: $.VarRef<number[][]> | null, counter: number): void {
	// Convert to uint64 to do half as many stores to memory.
	let b: $.VarRef<bigint[][]> | null = (b32 as any)

	// Constants; same as in ChaCha20: "expand 32-byte k"
	$.arrayIndex($.pointerValue<bigint[][]>(b), 0)[0] = 7021244195892394085n
	$.arrayIndex($.pointerValue<bigint[][]>(b), 0)[1] = 7021244195892394085n

	$.arrayIndex($.pointerValue<bigint[][]>(b), 1)[0] = 3684054919656006766n
	$.arrayIndex($.pointerValue<bigint[][]>(b), 1)[1] = 3684054919656006766n

	$.arrayIndex($.pointerValue<bigint[][]>(b), 2)[0] = 8746603121115016498n
	$.arrayIndex($.pointerValue<bigint[][]>(b), 2)[1] = 8746603121115016498n

	$.arrayIndex($.pointerValue<bigint[][]>(b), 3)[0] = 7719281312000927092n
	$.arrayIndex($.pointerValue<bigint[][]>(b), 3)[1] = 7719281312000927092n

	// Seed values.
	let x64: bigint = 0n
	let x: number = 0

	x = $.uint($.uint($.arrayIndex($.pointerValue<bigint[]>(seed), 0), 32), 32)
	x64 = $.uint64Add(($.uint64Mul($.uint64(x), (2 ** 32))), $.uint64(x))
	$.arrayIndex($.pointerValue<bigint[][]>(b), 4)[0] = x64
	$.arrayIndex($.pointerValue<bigint[][]>(b), 4)[1] = x64

	x = $.uint($.uint($.uint64Shr($.arrayIndex($.pointerValue<bigint[]>(seed), 0), 32n), 32), 32)
	x64 = $.uint64Add(($.uint64Mul($.uint64(x), (2 ** 32))), $.uint64(x))
	$.arrayIndex($.pointerValue<bigint[][]>(b), 5)[0] = x64
	$.arrayIndex($.pointerValue<bigint[][]>(b), 5)[1] = x64

	x = $.uint($.uint($.arrayIndex($.pointerValue<bigint[]>(seed), 1), 32), 32)
	x64 = $.uint64Add(($.uint64Mul($.uint64(x), (2 ** 32))), $.uint64(x))
	$.arrayIndex($.pointerValue<bigint[][]>(b), 6)[0] = x64
	$.arrayIndex($.pointerValue<bigint[][]>(b), 6)[1] = x64

	x = $.uint($.uint($.uint64Shr($.arrayIndex($.pointerValue<bigint[]>(seed), 1), 32n), 32), 32)
	x64 = $.uint64Add(($.uint64Mul($.uint64(x), (2 ** 32))), $.uint64(x))
	$.arrayIndex($.pointerValue<bigint[][]>(b), 7)[0] = x64
	$.arrayIndex($.pointerValue<bigint[][]>(b), 7)[1] = x64

	x = $.uint($.uint($.arrayIndex($.pointerValue<bigint[]>(seed), 2), 32), 32)
	x64 = $.uint64Add(($.uint64Mul($.uint64(x), (2 ** 32))), $.uint64(x))
	$.arrayIndex($.pointerValue<bigint[][]>(b), 8)[0] = x64
	$.arrayIndex($.pointerValue<bigint[][]>(b), 8)[1] = x64

	x = $.uint($.uint($.uint64Shr($.arrayIndex($.pointerValue<bigint[]>(seed), 2), 32n), 32), 32)
	x64 = $.uint64Add(($.uint64Mul($.uint64(x), (2 ** 32))), $.uint64(x))
	$.arrayIndex($.pointerValue<bigint[][]>(b), 9)[0] = x64
	$.arrayIndex($.pointerValue<bigint[][]>(b), 9)[1] = x64

	x = $.uint($.uint($.arrayIndex($.pointerValue<bigint[]>(seed), 3), 32), 32)
	x64 = $.uint64Add(($.uint64Mul($.uint64(x), (2 ** 32))), $.uint64(x))
	$.arrayIndex($.pointerValue<bigint[][]>(b), 10)[0] = x64
	$.arrayIndex($.pointerValue<bigint[][]>(b), 10)[1] = x64

	x = $.uint($.uint($.uint64Shr($.arrayIndex($.pointerValue<bigint[]>(seed), 3), 32n), 32), 32)
	x64 = $.uint64Add(($.uint64Mul($.uint64(x), (2 ** 32))), $.uint64(x))
	$.arrayIndex($.pointerValue<bigint[][]>(b), 11)[0] = x64
	$.arrayIndex($.pointerValue<bigint[][]>(b), 11)[1] = x64

	// Counters.
	if (goarch.BigEndian) {
		$.arrayIndex($.pointerValue<bigint[][]>(b), 12)[0] = $.uint64Add(($.uint64Mul($.uint64(counter + 0), (2 ** 32))), $.uint64(counter + 1))
		$.arrayIndex($.pointerValue<bigint[][]>(b), 12)[1] = $.uint64Add(($.uint64Mul($.uint64(counter + 2), (2 ** 32))), $.uint64(counter + 3))
	} else {
		$.arrayIndex($.pointerValue<bigint[][]>(b), 12)[0] = $.uint64Or($.uint64(counter + 0), ($.uint64Mul($.uint64(counter + 1), (2 ** 32))))
		$.arrayIndex($.pointerValue<bigint[][]>(b), 12)[1] = $.uint64Or($.uint64(counter + 2), ($.uint64Mul($.uint64(counter + 3), (2 ** 32))))
	}

	// Zeros.
	$.arrayIndex($.pointerValue<bigint[][]>(b), 13)[0] = 0n
	$.arrayIndex($.pointerValue<bigint[][]>(b), 13)[1] = 0n
	$.arrayIndex($.pointerValue<bigint[][]>(b), 14)[0] = 0n
	$.arrayIndex($.pointerValue<bigint[][]>(b), 14)[1] = 0n

	$.arrayIndex($.pointerValue<bigint[][]>(b), 15)[0] = 0n
	$.arrayIndex($.pointerValue<bigint[][]>(b), 15)[1] = 0n
}

function __goscriptBlankFunc0(): void {
	// block and block_generic must have same type
	let x: ((seed: $.VarRef<bigint[]> | null, blocks: $.VarRef<bigint[]> | null, counter: number) => void) | null = __goscript_chacha8.block
	x = block_generic
	x
}

export function block_generic(seed: $.VarRef<bigint[]> | null, buf: $.VarRef<bigint[]> | null, counter: number): void {
	let b: $.VarRef<number[][]> | null = (buf as any)

	setup(seed, b, $.uint(counter, 32))

	for (let __goscriptRangeTarget0 = $.arrayIndex($.pointerValue<number[][]>(b), 0), i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		// Load block i from b[*][i] into local variables.
		let b0 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 0), i), 32)
		let b1 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 1), i), 32)
		let b2 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 2), i), 32)
		let b3 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 3), i), 32)
		let b4 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 4), i), 32)
		let b5 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 5), i), 32)
		let b6 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 6), i), 32)
		let b7 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 7), i), 32)
		let b8 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 8), i), 32)
		let b9 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 9), i), 32)
		let b10 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 10), i), 32)
		let b11 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 11), i), 32)
		let b12 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 12), i), 32)
		let b13 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 13), i), 32)
		let b14 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 14), i), 32)
		let b15 = $.uint($.arrayIndex($.arrayIndex($.pointerValue<number[][]>(b), 15), i), 32)

		// 4 iterations of eight quarter-rounds each is 8 rounds
		for (let round = 0; round < 4; round++) {
			let __goscriptTuple0: any = qr($.uint(b0, 32), $.uint(b4, 32), $.uint(b8, 32), $.uint(b12, 32))
			b0 = $.uint(__goscriptTuple0[0], 32)
			b4 = $.uint(__goscriptTuple0[1], 32)
			b8 = $.uint(__goscriptTuple0[2], 32)
			b12 = $.uint(__goscriptTuple0[3], 32)
			let __goscriptTuple1: any = qr($.uint(b1, 32), $.uint(b5, 32), $.uint(b9, 32), $.uint(b13, 32))
			b1 = $.uint(__goscriptTuple1[0], 32)
			b5 = $.uint(__goscriptTuple1[1], 32)
			b9 = $.uint(__goscriptTuple1[2], 32)
			b13 = $.uint(__goscriptTuple1[3], 32)
			let __goscriptTuple2: any = qr($.uint(b2, 32), $.uint(b6, 32), $.uint(b10, 32), $.uint(b14, 32))
			b2 = $.uint(__goscriptTuple2[0], 32)
			b6 = $.uint(__goscriptTuple2[1], 32)
			b10 = $.uint(__goscriptTuple2[2], 32)
			b14 = $.uint(__goscriptTuple2[3], 32)
			let __goscriptTuple3: any = qr($.uint(b3, 32), $.uint(b7, 32), $.uint(b11, 32), $.uint(b15, 32))
			b3 = $.uint(__goscriptTuple3[0], 32)
			b7 = $.uint(__goscriptTuple3[1], 32)
			b11 = $.uint(__goscriptTuple3[2], 32)
			b15 = $.uint(__goscriptTuple3[3], 32)

			let __goscriptTuple4: any = qr($.uint(b0, 32), $.uint(b5, 32), $.uint(b10, 32), $.uint(b15, 32))
			b0 = $.uint(__goscriptTuple4[0], 32)
			b5 = $.uint(__goscriptTuple4[1], 32)
			b10 = $.uint(__goscriptTuple4[2], 32)
			b15 = $.uint(__goscriptTuple4[3], 32)
			let __goscriptTuple5: any = qr($.uint(b1, 32), $.uint(b6, 32), $.uint(b11, 32), $.uint(b12, 32))
			b1 = $.uint(__goscriptTuple5[0], 32)
			b6 = $.uint(__goscriptTuple5[1], 32)
			b11 = $.uint(__goscriptTuple5[2], 32)
			b12 = $.uint(__goscriptTuple5[3], 32)
			let __goscriptTuple6: any = qr($.uint(b2, 32), $.uint(b7, 32), $.uint(b8, 32), $.uint(b13, 32))
			b2 = $.uint(__goscriptTuple6[0], 32)
			b7 = $.uint(__goscriptTuple6[1], 32)
			b8 = $.uint(__goscriptTuple6[2], 32)
			b13 = $.uint(__goscriptTuple6[3], 32)
			let __goscriptTuple7: any = qr($.uint(b3, 32), $.uint(b4, 32), $.uint(b9, 32), $.uint(b14, 32))
			b3 = $.uint(__goscriptTuple7[0], 32)
			b4 = $.uint(__goscriptTuple7[1], 32)
			b9 = $.uint(__goscriptTuple7[2], 32)
			b14 = $.uint(__goscriptTuple7[3], 32)
		}

		// Store block i back into b[*][i].
		// Add b4..b11 back to the original key material,
		// like in ChaCha20, to avoid trivial invertibility.
		// There is no entropy in b0..b3 and b12..b15
		// so we can skip the additions and save some time.
		$.arrayIndex($.pointerValue<number[][]>(b), 0)[i] = $.uint(b0, 32)
		$.arrayIndex($.pointerValue<number[][]>(b), 1)[i] = $.uint(b1, 32)
		$.arrayIndex($.pointerValue<number[][]>(b), 2)[i] = $.uint(b2, 32)
		$.arrayIndex($.pointerValue<number[][]>(b), 3)[i] = $.uint(b3, 32)
		$.arrayIndex($.pointerValue<number[][]>(b), 4)[i] = $.arrayIndex($.pointerValue<number[][]>(b), 4)[i] + ($.uint(b4, 32))
		$.arrayIndex($.pointerValue<number[][]>(b), 5)[i] = $.arrayIndex($.pointerValue<number[][]>(b), 5)[i] + ($.uint(b5, 32))
		$.arrayIndex($.pointerValue<number[][]>(b), 6)[i] = $.arrayIndex($.pointerValue<number[][]>(b), 6)[i] + ($.uint(b6, 32))
		$.arrayIndex($.pointerValue<number[][]>(b), 7)[i] = $.arrayIndex($.pointerValue<number[][]>(b), 7)[i] + ($.uint(b7, 32))
		$.arrayIndex($.pointerValue<number[][]>(b), 8)[i] = $.arrayIndex($.pointerValue<number[][]>(b), 8)[i] + ($.uint(b8, 32))
		$.arrayIndex($.pointerValue<number[][]>(b), 9)[i] = $.arrayIndex($.pointerValue<number[][]>(b), 9)[i] + ($.uint(b9, 32))
		$.arrayIndex($.pointerValue<number[][]>(b), 10)[i] = $.arrayIndex($.pointerValue<number[][]>(b), 10)[i] + ($.uint(b10, 32))
		$.arrayIndex($.pointerValue<number[][]>(b), 11)[i] = $.arrayIndex($.pointerValue<number[][]>(b), 11)[i] + ($.uint(b11, 32))
		$.arrayIndex($.pointerValue<number[][]>(b), 12)[i] = $.uint(b12, 32)
		$.arrayIndex($.pointerValue<number[][]>(b), 13)[i] = $.uint(b13, 32)
		$.arrayIndex($.pointerValue<number[][]>(b), 14)[i] = $.uint(b14, 32)
		$.arrayIndex($.pointerValue<number[][]>(b), 15)[i] = $.uint(b15, 32)
	}

	if (goarch.BigEndian) {
		// On a big-endian system, reading the uint32 pairs as uint64s
		// will word-swap them compared to little-endian, so we word-swap
		// them here first to make the next swap get the right answer.
		for (let __goscriptRangeTarget1 = $.pointerValue<bigint[]>(buf), i = 0; i < $.len(__goscriptRangeTarget1); i++) {
			let x = __goscriptRangeTarget1![i]
			$.pointerValue<bigint[]>(buf)[i] = $.uint64Or(($.uint64Shr(x, 32n)), ($.uint64Mul(x, (2 ** 32))))
		}
	}
}

export function qr(a: number, b: number, c: number, d: number): [number, number, number, number] {
	let _a: number = 0
	let _b: number = 0
	let _c: number = 0
	let _d: number = 0
	a = a + ($.uint(b, 32))
	d = d ^ ($.uint(a, 32))
	d = $.uint((d << 16) | ($.uintShr(d, 16, 32)), 32)
	c = c + ($.uint(d, 32))
	b = b ^ ($.uint(c, 32))
	b = $.uint((b << 12) | ($.uintShr(b, 20, 32)), 32)
	a = a + ($.uint(b, 32))
	d = d ^ ($.uint(a, 32))
	d = $.uint((d << 8) | ($.uintShr(d, 24, 32)), 32)
	c = c + ($.uint(d, 32))
	b = b ^ ($.uint(c, 32))
	b = $.uint((b << 7) | ($.uintShr(b, 25, 32)), 32)
	return [$.uint(a, 32), $.uint(b, 32), $.uint(c, 32), $.uint(d, 32)]
}

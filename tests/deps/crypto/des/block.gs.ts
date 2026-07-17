// Generated file based on block.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript__const from "./const.gs.ts"

import type * as __goscript_cipher from "./cipher.gs.ts"
import "@goscript/internal/byteorder/index.js"
import "@goscript/sync/index.js"
import "./const.gs.ts"

export function cryptBlock(subkeys: $.Slice<bigint>, dst: $.Slice<number>, src: $.Slice<number>, decrypt: boolean): void {
	let b = byteorder.BEUint64(src)
	b = permuteInitialBlock(b)
	let left = $.uint($.uint($.uint64Shr(b, 32n), 32), 32)
	let right = $.uint($.uint(b, 32), 32)

	left = $.uint((left << 1) | ($.uintShr(left, 31, 32)), 32)
	right = $.uint((right << 1) | ($.uintShr(right, 31, 32)), 32)

	if (decrypt) {
		for (let i = 0; i < 8; i++) {
			let __goscriptTuple0: any = feistel($.uint(left, 32), $.uint(right, 32), $.arrayIndex(subkeys!, 15 - (2 * i)), $.arrayIndex(subkeys!, 15 - ((2 * i) + 1)))
			left = $.uint(__goscriptTuple0[0], 32)
			right = $.uint(__goscriptTuple0[1], 32)
		}
	} else {
		for (let i = 0; i < 8; i++) {
			let __goscriptTuple1: any = feistel($.uint(left, 32), $.uint(right, 32), $.arrayIndex(subkeys!, 2 * i), $.arrayIndex(subkeys!, (2 * i) + 1))
			left = $.uint(__goscriptTuple1[0], 32)
			right = $.uint(__goscriptTuple1[1], 32)
		}
	}

	left = $.uint((left << 31) | ($.uintShr(left, 1, 32)), 32)
	right = $.uint((right << 31) | ($.uintShr(right, 1, 32)), 32)

	// switch left & right and perform final permutation
	let preOutput = $.uint64Add(($.uint64Mul($.uint64(right), (2 ** 32))), $.uint64(left))
	byteorder.BEPutUint64(dst, permuteFinalBlock(preOutput))
}

export function feistel(l: number, r: number, k0: bigint, k1: bigint): [number, number] {
	let lout: number = 0
	let rout: number = 0
	let t: number = 0

	t = $.uint(r ^ $.uint($.uint64Shr(k0, 32n), 32), 32)
	l = l ^ ($.uint((($.arrayIndex($.arrayIndex(feistelBox, 7), t & 0x3f) ^ $.arrayIndex($.arrayIndex(feistelBox, 5), ($.uintShr(t, 8, 32)) & 0x3f)) ^ $.arrayIndex($.arrayIndex(feistelBox, 3), ($.uintShr(t, 16, 32)) & 0x3f)) ^ $.arrayIndex($.arrayIndex(feistelBox, 1), ($.uintShr(t, 24, 32)) & 0x3f), 32))

	t = $.uint(((r << 28) | ($.uintShr(r, 4, 32))) ^ $.uint(k0, 32), 32)
	l = l ^ ($.uint((($.arrayIndex($.arrayIndex(feistelBox, 6), (t) & 0x3f) ^ $.arrayIndex($.arrayIndex(feistelBox, 4), ($.uintShr(t, 8, 32)) & 0x3f)) ^ $.arrayIndex($.arrayIndex(feistelBox, 2), ($.uintShr(t, 16, 32)) & 0x3f)) ^ $.arrayIndex($.arrayIndex(feistelBox, 0), ($.uintShr(t, 24, 32)) & 0x3f), 32))

	t = $.uint(l ^ $.uint($.uint64Shr(k1, 32n), 32), 32)
	r = r ^ ($.uint((($.arrayIndex($.arrayIndex(feistelBox, 7), t & 0x3f) ^ $.arrayIndex($.arrayIndex(feistelBox, 5), ($.uintShr(t, 8, 32)) & 0x3f)) ^ $.arrayIndex($.arrayIndex(feistelBox, 3), ($.uintShr(t, 16, 32)) & 0x3f)) ^ $.arrayIndex($.arrayIndex(feistelBox, 1), ($.uintShr(t, 24, 32)) & 0x3f), 32))

	t = $.uint(((l << 28) | ($.uintShr(l, 4, 32))) ^ $.uint(k1, 32), 32)
	r = r ^ ($.uint((($.arrayIndex($.arrayIndex(feistelBox, 6), (t) & 0x3f) ^ $.arrayIndex($.arrayIndex(feistelBox, 4), ($.uintShr(t, 8, 32)) & 0x3f)) ^ $.arrayIndex($.arrayIndex(feistelBox, 2), ($.uintShr(t, 16, 32)) & 0x3f)) ^ $.arrayIndex($.arrayIndex(feistelBox, 0), ($.uintShr(t, 24, 32)) & 0x3f), 32))

	return [$.uint(l, 32), $.uint(r, 32)]
}

export let feistelBox: number[][] = Array.from({ length: 8 }, () => Array.from({ length: 64 }, () => 0))

export function __goscript_set_feistelBox(__goscriptValue: number[][]): void {
	feistelBox = __goscriptValue
}

export let feistelBoxOnce: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set_feistelBoxOnce(__goscriptValue: sync.Once): void {
	feistelBoxOnce.value = __goscriptValue
}

export function permuteBlock(src: bigint, permutation: $.Slice<number>): bigint {
	let block: bigint = 0n
	for (let __goscriptRangeTarget0 = permutation, position = 0; position < $.len(__goscriptRangeTarget0); position++) {
		let n = __goscriptRangeTarget0![position]
		let bit = $.uint64And(($.uint64Shr(src, n)), 1n)
		block = $.uint64Or(block, $.uint64Shl(bit, $.uint(($.len(permutation) - 1) - position, 64)))
	}
	return block
}

export function initFeistelBox(): void {
	for (let __goscriptRangeTarget1 = __goscript__const.sBoxes, s = 0; s < $.len(__goscriptRangeTarget1); s++) {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 16; j++) {
				let f = $.uint64Shl($.uint64($.arrayIndex($.arrayIndex($.arrayIndex(__goscript__const.sBoxes, s), i), j)), ($.uint($.uint64Mul(4n, ($.uint($.uint64Sub(7n, $.uint(s, 64)), 64))), 64)))
				f = permuteBlock(f, $.goSlice(__goscript__const.permutationFunction, undefined, undefined))

				// Row is determined by the 1st and 6th bit.
				// Column is the middle four bits.
				let row = $.uint($.uint(((i & 2) << 4) | (i & 1), 8), 8)
				let col = $.uint($.uint(j << 1, 8), 8)
				let t = $.uint(row | col, 8)

				// The rotation was performed in the feistel rounds, being factored out and now mixed into the feistelBox.
				f = $.uint64Or(($.uint64Shl(f, 1n)), ($.uint64Shr(f, 31n)))

				$.arrayIndex(feistelBox, s)[t] = $.uint($.uint(f, 32), 32)
			}
		}
	}
}

export function permuteInitialBlock(block: bigint): bigint {
	// block = b7 b6 b5 b4 b3 b2 b1 b0 (8 bytes)
	let b1 = $.uint64Shr(block, 48n)
	let b2 = $.uint64Mul(block, (2 ** 48))
	block = $.uint64Xor(block, $.uint64Xor(($.uint64Xor(($.uint64Xor(b1, b2)), ($.uint64Mul(b1, (2 ** 48))))), ($.uint64Shr(b2, 48n))))

	// block = b1 b0 b5 b4 b3 b2 b7 b6
	b1 = $.uint64And(($.uint64Shr(block, 32n)), 16711935n)
	b2 = ($.uint64And(block, 4278255360n))
	block = $.uint64Xor(block, $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Mul(b1, (2 ** 32))), b2)), ($.uint64Shl(b1, 8n)))), ($.uint64Shl(b2, 24n))))

	// block is now b1 b3 b5 b7 b0 b2 b4 b6, the permutation:
	//                  ...  8
	//                  ... 24
	//                  ... 40
	//                  ... 56
	//  7  6  5  4  3  2  1  0
	// 23 22 21 20 19 18 17 16
	//                  ... 32
	//                  ... 48

	// exchange 4,5,6,7 with 32,33,34,35 etc.
	b1 = $.uint64And(block, 1085086035472220160n)
	b2 = $.uint64And(block, 264913582878960n)
	block = $.uint64Xor(block, $.uint64Xor(($.uint64Xor(($.uint64Xor(b1, b2)), ($.uint64Shr(b1, 12n)))), ($.uint64Shl(b2, 12n))))

	// block is the permutation:
	//
	//   [+8]         [+40]
	//
	//  7  6  5  4
	// 23 22 21 20
	//  3  2  1  0
	// 19 18 17 16    [+32]

	// exchange 0,1,4,5 with 18,19,22,23
	b1 = $.uint64And(block, 3674993371882992384n)
	b2 = $.uint64And(block, 57421771435671756n)
	block = $.uint64Xor(block, $.uint64Xor(($.uint64Xor(($.uint64Xor(b1, b2)), ($.uint64Shr(b1, 6n)))), ($.uint64Shl(b2, 6n))))

	// block is the permutation:
	// 15 14
	// 13 12
	// 11 10
	//  9  8
	//  7  6
	//  5  4
	//  3  2
	//  1  0 [+16] [+32] [+64]

	// exchange 0,2,4,6 with 9,11,13,15:
	b1 = $.uint64And(block, 12297829381041378645n)
	block = $.uint64Xor(block, $.uint64Xor(($.uint64Xor(b1, ($.uint64Shr(b1, 33n)))), ($.uint64Mul(b1, (2 ** 33)))))

	// block is the permutation:
	// 6 14 22 30 38 46 54 62
	// 4 12 20 28 36 44 52 60
	// 2 10 18 26 34 42 50 58
	// 0  8 16 24 32 40 48 56
	// 7 15 23 31 39 47 55 63
	// 5 13 21 29 37 45 53 61
	// 3 11 19 27 35 43 51 59
	// 1  9 17 25 33 41 49 57
	return block
}

export function permuteFinalBlock(block: bigint): bigint {
	// Perform the same bit exchanges as permuteInitialBlock
	// but in reverse order.
	let b1 = $.uint64And(block, 12297829381041378645n)
	block = $.uint64Xor(block, $.uint64Xor(($.uint64Xor(b1, ($.uint64Shr(b1, 33n)))), ($.uint64Mul(b1, (2 ** 33)))))

	b1 = $.uint64And(block, 3674993371882992384n)
	let b2 = $.uint64And(block, 57421771435671756n)
	block = $.uint64Xor(block, $.uint64Xor(($.uint64Xor(($.uint64Xor(b1, b2)), ($.uint64Shr(b1, 6n)))), ($.uint64Shl(b2, 6n))))

	b1 = $.uint64And(block, 1085086035472220160n)
	b2 = $.uint64And(block, 264913582878960n)
	block = $.uint64Xor(block, $.uint64Xor(($.uint64Xor(($.uint64Xor(b1, b2)), ($.uint64Shr(b1, 12n)))), ($.uint64Shl(b2, 12n))))

	b1 = $.uint64And(($.uint64Shr(block, 32n)), 16711935n)
	b2 = ($.uint64And(block, 4278255360n))
	block = $.uint64Xor(block, $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Mul(b1, (2 ** 32))), b2)), ($.uint64Shl(b1, 8n)))), ($.uint64Shl(b2, 24n))))

	b1 = $.uint64Shr(block, 48n)
	b2 = $.uint64Mul(block, (2 ** 48))
	block = $.uint64Xor(block, $.uint64Xor(($.uint64Xor(($.uint64Xor(b1, b2)), ($.uint64Mul(b1, (2 ** 48))))), ($.uint64Shr(b2, 48n))))
	return block
}

export function ksRotate(_in: number): $.Slice<number> {
	let out: $.Slice<number> = null! as $.Slice<number>
	out = $.makeSlice<number>(16, undefined, "number")
	let last = $.uint(_in, 32)
	for (let i = 0; i < 16; i++) {
		// 28-bit circular left shift
		let left = $.uint($.uintShr((last << (4 + $.arrayIndex(__goscript__const.ksRotations, i))), 4, 32), 32)
		let right = $.uint($.uintShr((last << 4), (32 - $.arrayIndex(__goscript__const.ksRotations, i)), 32), 32)
		out![i] = $.uint(left | right, 32)
		last = $.uint($.arrayIndex(out!, i), 32)
	}
	return out
}

export function unpack(x: bigint): bigint {
	return $.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(($.uint64Shl(($.uint64And(($.uint64Shr(x, 6n)), 255n)), 0n)), ($.uint64Shl(($.uint64And(($.uint64Shr(x, 18n)), 255n)), 8n)))), ($.uint64Shl(($.uint64And(($.uint64Shr(x, 30n)), 255n)), 16n)))), ($.uint64Shl(($.uint64And(($.uint64Shr(x, 42n)), 255n)), 24n)))), ($.uint64Mul(($.uint64And(($.uint64Shr(x, 0n)), 255n)), (2 ** 32))))), ($.uint64Mul(($.uint64And(($.uint64Shr(x, 12n)), 255n)), (2 ** 40))))), ($.uint64Mul(($.uint64And(($.uint64Shr(x, 24n)), 255n)), (2 ** 48))))), ($.uint64Mul(($.uint64And(($.uint64Shr(x, 36n)), 255n)), (2 ** 56))))
}

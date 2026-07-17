// Generated file based on keccakf.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as cpu from "@goscript/crypto/internal/fips140deps/cpu/index.js"

import * as bits from "@goscript/math/bits/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/crypto/internal/fips140deps/cpu/index.js"
import "@goscript/math/bits/index.js"
import "@goscript/unsafe/index.js"

export var rc: bigint[]

export function __goscript_init_rc(): void {
	if (((rc) as any) === undefined) {
		rc = [1n, 32898n, 9223372036854808714n, 9223372039002292224n, 32907n, 2147483649n, 9223372039002292353n, 9223372036854808585n, 138n, 136n, 2147516425n, 2147483658n, 2147516555n, 9223372036854775947n, 9223372036854808713n, 9223372036854808579n, 9223372036854808578n, 9223372036854775936n, 32778n, 9223372039002259466n, 9223372039002292353n, 9223372036854808704n, 2147483649n, 9223372039002292232n]
	}
}

export function __goscript_get_rc(): bigint[] {
	if (((rc) as any) === undefined) {
		__goscript_init_rc()
	}
	return rc
}

export function __goscript_set_rc(__goscriptValue: bigint[]): void {
	rc = __goscriptValue
}

export function keccakF1600Generic(da: $.VarRef<Uint8Array> | null): void {
	using __defer = new $.DisposableStack()
	let a: $.VarRef<bigint[]> | null = null! as $.VarRef<bigint[]> | null
	if (cpu.BigEndian) {
		a = $.varRef<bigint[]>(Array.from({ length: 25 }, () => 0n))
		for (let __goscriptRangeTarget0 = $.pointerValue<bigint[]>(a), i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			$.pointerValue<bigint[]>(a)[i] = byteorder.LEUint64($.goSlice($.pointerValue<Uint8Array>(da), i * 8, undefined))
		}
		__defer.defer(() => { ((): void => {
			for (let __goscriptRangeTarget1 = $.pointerValue<bigint[]>(a), i = 0; i < $.len(__goscriptRangeTarget1); i++) {
				byteorder.LEPutUint64($.goSlice($.pointerValue<Uint8Array>(da), i * 8, undefined), $.arrayIndex($.pointerValue<bigint[]>(a), i))
			}
		})() })
	} else {
		a = (da as any)
	}

	// Implementation translated from Keccak-inplace.c
	// in the keccak reference code.
	let t: bigint = 0n
	let bc0: bigint = 0n
	let bc1: bigint = 0n
	let bc2: bigint = 0n
	let bc3: bigint = 0n
	let bc4: bigint = 0n
	let d0: bigint = 0n
	let d1: bigint = 0n
	let d2: bigint = 0n
	let d3: bigint = 0n
	let d4: bigint = 0n

	for (let i = 0; i < 24; i = i + (4)) {
		// Combines the 5 steps in each round into 2 steps.
		// Unrolls 4 rounds per loop and spreads some steps across rounds.

		// Round 1
		bc0 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 0), $.arrayIndex($.pointerValue<bigint[]>(a), 5))), $.arrayIndex($.pointerValue<bigint[]>(a), 10))), $.arrayIndex($.pointerValue<bigint[]>(a), 15))), $.arrayIndex($.pointerValue<bigint[]>(a), 20))
		bc1 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 1), $.arrayIndex($.pointerValue<bigint[]>(a), 6))), $.arrayIndex($.pointerValue<bigint[]>(a), 11))), $.arrayIndex($.pointerValue<bigint[]>(a), 16))), $.arrayIndex($.pointerValue<bigint[]>(a), 21))
		bc2 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 2), $.arrayIndex($.pointerValue<bigint[]>(a), 7))), $.arrayIndex($.pointerValue<bigint[]>(a), 12))), $.arrayIndex($.pointerValue<bigint[]>(a), 17))), $.arrayIndex($.pointerValue<bigint[]>(a), 22))
		bc3 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 3), $.arrayIndex($.pointerValue<bigint[]>(a), 8))), $.arrayIndex($.pointerValue<bigint[]>(a), 13))), $.arrayIndex($.pointerValue<bigint[]>(a), 18))), $.arrayIndex($.pointerValue<bigint[]>(a), 23))
		bc4 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 4), $.arrayIndex($.pointerValue<bigint[]>(a), 9))), $.arrayIndex($.pointerValue<bigint[]>(a), 14))), $.arrayIndex($.pointerValue<bigint[]>(a), 19))), $.arrayIndex($.pointerValue<bigint[]>(a), 24))
		d0 = $.uint64Xor(bc4, ($.uint64Or(($.uint64Shl(bc1, 1n)), ($.uint64Shr(bc1, 63n)))))
		d1 = $.uint64Xor(bc0, ($.uint64Or(($.uint64Shl(bc2, 1n)), ($.uint64Shr(bc2, 63n)))))
		d2 = $.uint64Xor(bc1, ($.uint64Or(($.uint64Shl(bc3, 1n)), ($.uint64Shr(bc3, 63n)))))
		d3 = $.uint64Xor(bc2, ($.uint64Or(($.uint64Shl(bc4, 1n)), ($.uint64Shr(bc4, 63n)))))
		d4 = $.uint64Xor(bc3, ($.uint64Or(($.uint64Shl(bc0, 1n)), ($.uint64Shr(bc0, 63n)))))

		bc0 = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 0), d0)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 6), d1)
		bc1 = bits.RotateLeft64(t, 44)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 12), d2)
		bc2 = bits.RotateLeft64(t, 43)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 18), d3)
		bc3 = bits.RotateLeft64(t, 21)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 24), d4)
		bc4 = bits.RotateLeft64(t, 14)
		$.pointerValue<bigint[]>(a)[0] = $.uint64Xor(($.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))), $.arrayIndex(__goscript_get_rc(), i))
		$.pointerValue<bigint[]>(a)[6] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[12] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[18] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[24] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 10), d0)
		bc2 = bits.RotateLeft64(t, 3)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 16), d1)
		bc3 = bits.RotateLeft64(t, 45)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 22), d2)
		bc4 = bits.RotateLeft64(t, 61)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 3), d3)
		bc0 = bits.RotateLeft64(t, 28)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 9), d4)
		bc1 = bits.RotateLeft64(t, 20)
		$.pointerValue<bigint[]>(a)[10] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[16] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[22] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[3] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[9] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 20), d0)
		bc4 = bits.RotateLeft64(t, 18)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 1), d1)
		bc0 = bits.RotateLeft64(t, 1)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 7), d2)
		bc1 = bits.RotateLeft64(t, 6)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 13), d3)
		bc2 = bits.RotateLeft64(t, 25)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 19), d4)
		bc3 = bits.RotateLeft64(t, 8)
		$.pointerValue<bigint[]>(a)[20] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[1] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[7] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[13] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[19] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 5), d0)
		bc1 = bits.RotateLeft64(t, 36)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 11), d1)
		bc2 = bits.RotateLeft64(t, 10)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 17), d2)
		bc3 = bits.RotateLeft64(t, 15)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 23), d3)
		bc4 = bits.RotateLeft64(t, 56)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 4), d4)
		bc0 = bits.RotateLeft64(t, 27)
		$.pointerValue<bigint[]>(a)[5] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[11] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[17] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[23] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[4] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 15), d0)
		bc3 = bits.RotateLeft64(t, 41)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 21), d1)
		bc4 = bits.RotateLeft64(t, 2)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 2), d2)
		bc0 = bits.RotateLeft64(t, 62)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 8), d3)
		bc1 = bits.RotateLeft64(t, 55)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 14), d4)
		bc2 = bits.RotateLeft64(t, 39)
		$.pointerValue<bigint[]>(a)[15] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[21] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[2] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[8] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[14] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		// Round 2
		bc0 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 0), $.arrayIndex($.pointerValue<bigint[]>(a), 5))), $.arrayIndex($.pointerValue<bigint[]>(a), 10))), $.arrayIndex($.pointerValue<bigint[]>(a), 15))), $.arrayIndex($.pointerValue<bigint[]>(a), 20))
		bc1 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 1), $.arrayIndex($.pointerValue<bigint[]>(a), 6))), $.arrayIndex($.pointerValue<bigint[]>(a), 11))), $.arrayIndex($.pointerValue<bigint[]>(a), 16))), $.arrayIndex($.pointerValue<bigint[]>(a), 21))
		bc2 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 2), $.arrayIndex($.pointerValue<bigint[]>(a), 7))), $.arrayIndex($.pointerValue<bigint[]>(a), 12))), $.arrayIndex($.pointerValue<bigint[]>(a), 17))), $.arrayIndex($.pointerValue<bigint[]>(a), 22))
		bc3 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 3), $.arrayIndex($.pointerValue<bigint[]>(a), 8))), $.arrayIndex($.pointerValue<bigint[]>(a), 13))), $.arrayIndex($.pointerValue<bigint[]>(a), 18))), $.arrayIndex($.pointerValue<bigint[]>(a), 23))
		bc4 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 4), $.arrayIndex($.pointerValue<bigint[]>(a), 9))), $.arrayIndex($.pointerValue<bigint[]>(a), 14))), $.arrayIndex($.pointerValue<bigint[]>(a), 19))), $.arrayIndex($.pointerValue<bigint[]>(a), 24))
		d0 = $.uint64Xor(bc4, ($.uint64Or(($.uint64Shl(bc1, 1n)), ($.uint64Shr(bc1, 63n)))))
		d1 = $.uint64Xor(bc0, ($.uint64Or(($.uint64Shl(bc2, 1n)), ($.uint64Shr(bc2, 63n)))))
		d2 = $.uint64Xor(bc1, ($.uint64Or(($.uint64Shl(bc3, 1n)), ($.uint64Shr(bc3, 63n)))))
		d3 = $.uint64Xor(bc2, ($.uint64Or(($.uint64Shl(bc4, 1n)), ($.uint64Shr(bc4, 63n)))))
		d4 = $.uint64Xor(bc3, ($.uint64Or(($.uint64Shl(bc0, 1n)), ($.uint64Shr(bc0, 63n)))))

		bc0 = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 0), d0)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 16), d1)
		bc1 = bits.RotateLeft64(t, 44)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 7), d2)
		bc2 = bits.RotateLeft64(t, 43)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 23), d3)
		bc3 = bits.RotateLeft64(t, 21)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 14), d4)
		bc4 = bits.RotateLeft64(t, 14)
		$.pointerValue<bigint[]>(a)[0] = $.uint64Xor(($.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))), $.arrayIndex(__goscript_get_rc(), i + 1))
		$.pointerValue<bigint[]>(a)[16] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[7] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[23] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[14] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 20), d0)
		bc2 = bits.RotateLeft64(t, 3)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 11), d1)
		bc3 = bits.RotateLeft64(t, 45)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 2), d2)
		bc4 = bits.RotateLeft64(t, 61)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 18), d3)
		bc0 = bits.RotateLeft64(t, 28)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 9), d4)
		bc1 = bits.RotateLeft64(t, 20)
		$.pointerValue<bigint[]>(a)[20] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[11] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[2] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[18] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[9] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 15), d0)
		bc4 = bits.RotateLeft64(t, 18)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 6), d1)
		bc0 = bits.RotateLeft64(t, 1)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 22), d2)
		bc1 = bits.RotateLeft64(t, 6)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 13), d3)
		bc2 = bits.RotateLeft64(t, 25)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 4), d4)
		bc3 = bits.RotateLeft64(t, 8)
		$.pointerValue<bigint[]>(a)[15] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[6] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[22] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[13] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[4] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 10), d0)
		bc1 = bits.RotateLeft64(t, 36)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 1), d1)
		bc2 = bits.RotateLeft64(t, 10)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 17), d2)
		bc3 = bits.RotateLeft64(t, 15)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 8), d3)
		bc4 = bits.RotateLeft64(t, 56)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 24), d4)
		bc0 = bits.RotateLeft64(t, 27)
		$.pointerValue<bigint[]>(a)[10] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[1] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[17] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[8] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[24] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 5), d0)
		bc3 = bits.RotateLeft64(t, 41)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 21), d1)
		bc4 = bits.RotateLeft64(t, 2)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 12), d2)
		bc0 = bits.RotateLeft64(t, 62)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 3), d3)
		bc1 = bits.RotateLeft64(t, 55)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 19), d4)
		bc2 = bits.RotateLeft64(t, 39)
		$.pointerValue<bigint[]>(a)[5] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[21] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[12] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[3] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[19] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		// Round 3
		bc0 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 0), $.arrayIndex($.pointerValue<bigint[]>(a), 5))), $.arrayIndex($.pointerValue<bigint[]>(a), 10))), $.arrayIndex($.pointerValue<bigint[]>(a), 15))), $.arrayIndex($.pointerValue<bigint[]>(a), 20))
		bc1 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 1), $.arrayIndex($.pointerValue<bigint[]>(a), 6))), $.arrayIndex($.pointerValue<bigint[]>(a), 11))), $.arrayIndex($.pointerValue<bigint[]>(a), 16))), $.arrayIndex($.pointerValue<bigint[]>(a), 21))
		bc2 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 2), $.arrayIndex($.pointerValue<bigint[]>(a), 7))), $.arrayIndex($.pointerValue<bigint[]>(a), 12))), $.arrayIndex($.pointerValue<bigint[]>(a), 17))), $.arrayIndex($.pointerValue<bigint[]>(a), 22))
		bc3 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 3), $.arrayIndex($.pointerValue<bigint[]>(a), 8))), $.arrayIndex($.pointerValue<bigint[]>(a), 13))), $.arrayIndex($.pointerValue<bigint[]>(a), 18))), $.arrayIndex($.pointerValue<bigint[]>(a), 23))
		bc4 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 4), $.arrayIndex($.pointerValue<bigint[]>(a), 9))), $.arrayIndex($.pointerValue<bigint[]>(a), 14))), $.arrayIndex($.pointerValue<bigint[]>(a), 19))), $.arrayIndex($.pointerValue<bigint[]>(a), 24))
		d0 = $.uint64Xor(bc4, ($.uint64Or(($.uint64Shl(bc1, 1n)), ($.uint64Shr(bc1, 63n)))))
		d1 = $.uint64Xor(bc0, ($.uint64Or(($.uint64Shl(bc2, 1n)), ($.uint64Shr(bc2, 63n)))))
		d2 = $.uint64Xor(bc1, ($.uint64Or(($.uint64Shl(bc3, 1n)), ($.uint64Shr(bc3, 63n)))))
		d3 = $.uint64Xor(bc2, ($.uint64Or(($.uint64Shl(bc4, 1n)), ($.uint64Shr(bc4, 63n)))))
		d4 = $.uint64Xor(bc3, ($.uint64Or(($.uint64Shl(bc0, 1n)), ($.uint64Shr(bc0, 63n)))))

		bc0 = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 0), d0)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 11), d1)
		bc1 = bits.RotateLeft64(t, 44)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 22), d2)
		bc2 = bits.RotateLeft64(t, 43)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 8), d3)
		bc3 = bits.RotateLeft64(t, 21)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 19), d4)
		bc4 = bits.RotateLeft64(t, 14)
		$.pointerValue<bigint[]>(a)[0] = $.uint64Xor(($.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))), $.arrayIndex(__goscript_get_rc(), i + 2))
		$.pointerValue<bigint[]>(a)[11] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[22] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[8] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[19] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 15), d0)
		bc2 = bits.RotateLeft64(t, 3)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 1), d1)
		bc3 = bits.RotateLeft64(t, 45)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 12), d2)
		bc4 = bits.RotateLeft64(t, 61)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 23), d3)
		bc0 = bits.RotateLeft64(t, 28)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 9), d4)
		bc1 = bits.RotateLeft64(t, 20)
		$.pointerValue<bigint[]>(a)[15] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[1] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[12] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[23] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[9] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 5), d0)
		bc4 = bits.RotateLeft64(t, 18)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 16), d1)
		bc0 = bits.RotateLeft64(t, 1)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 2), d2)
		bc1 = bits.RotateLeft64(t, 6)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 13), d3)
		bc2 = bits.RotateLeft64(t, 25)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 24), d4)
		bc3 = bits.RotateLeft64(t, 8)
		$.pointerValue<bigint[]>(a)[5] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[16] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[2] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[13] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[24] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 20), d0)
		bc1 = bits.RotateLeft64(t, 36)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 6), d1)
		bc2 = bits.RotateLeft64(t, 10)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 17), d2)
		bc3 = bits.RotateLeft64(t, 15)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 3), d3)
		bc4 = bits.RotateLeft64(t, 56)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 14), d4)
		bc0 = bits.RotateLeft64(t, 27)
		$.pointerValue<bigint[]>(a)[20] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[6] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[17] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[3] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[14] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 10), d0)
		bc3 = bits.RotateLeft64(t, 41)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 21), d1)
		bc4 = bits.RotateLeft64(t, 2)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 7), d2)
		bc0 = bits.RotateLeft64(t, 62)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 18), d3)
		bc1 = bits.RotateLeft64(t, 55)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 4), d4)
		bc2 = bits.RotateLeft64(t, 39)
		$.pointerValue<bigint[]>(a)[10] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[21] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[7] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[18] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[4] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		// Round 4
		bc0 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 0), $.arrayIndex($.pointerValue<bigint[]>(a), 5))), $.arrayIndex($.pointerValue<bigint[]>(a), 10))), $.arrayIndex($.pointerValue<bigint[]>(a), 15))), $.arrayIndex($.pointerValue<bigint[]>(a), 20))
		bc1 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 1), $.arrayIndex($.pointerValue<bigint[]>(a), 6))), $.arrayIndex($.pointerValue<bigint[]>(a), 11))), $.arrayIndex($.pointerValue<bigint[]>(a), 16))), $.arrayIndex($.pointerValue<bigint[]>(a), 21))
		bc2 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 2), $.arrayIndex($.pointerValue<bigint[]>(a), 7))), $.arrayIndex($.pointerValue<bigint[]>(a), 12))), $.arrayIndex($.pointerValue<bigint[]>(a), 17))), $.arrayIndex($.pointerValue<bigint[]>(a), 22))
		bc3 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 3), $.arrayIndex($.pointerValue<bigint[]>(a), 8))), $.arrayIndex($.pointerValue<bigint[]>(a), 13))), $.arrayIndex($.pointerValue<bigint[]>(a), 18))), $.arrayIndex($.pointerValue<bigint[]>(a), 23))
		bc4 = $.uint64Xor(($.uint64Xor(($.uint64Xor(($.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 4), $.arrayIndex($.pointerValue<bigint[]>(a), 9))), $.arrayIndex($.pointerValue<bigint[]>(a), 14))), $.arrayIndex($.pointerValue<bigint[]>(a), 19))), $.arrayIndex($.pointerValue<bigint[]>(a), 24))
		d0 = $.uint64Xor(bc4, ($.uint64Or(($.uint64Shl(bc1, 1n)), ($.uint64Shr(bc1, 63n)))))
		d1 = $.uint64Xor(bc0, ($.uint64Or(($.uint64Shl(bc2, 1n)), ($.uint64Shr(bc2, 63n)))))
		d2 = $.uint64Xor(bc1, ($.uint64Or(($.uint64Shl(bc3, 1n)), ($.uint64Shr(bc3, 63n)))))
		d3 = $.uint64Xor(bc2, ($.uint64Or(($.uint64Shl(bc4, 1n)), ($.uint64Shr(bc4, 63n)))))
		d4 = $.uint64Xor(bc3, ($.uint64Or(($.uint64Shl(bc0, 1n)), ($.uint64Shr(bc0, 63n)))))

		bc0 = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 0), d0)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 1), d1)
		bc1 = bits.RotateLeft64(t, 44)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 2), d2)
		bc2 = bits.RotateLeft64(t, 43)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 3), d3)
		bc3 = bits.RotateLeft64(t, 21)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 4), d4)
		bc4 = bits.RotateLeft64(t, 14)
		$.pointerValue<bigint[]>(a)[0] = $.uint64Xor(($.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))), $.arrayIndex(__goscript_get_rc(), i + 3))
		$.pointerValue<bigint[]>(a)[1] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[2] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[3] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[4] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 5), d0)
		bc2 = bits.RotateLeft64(t, 3)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 6), d1)
		bc3 = bits.RotateLeft64(t, 45)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 7), d2)
		bc4 = bits.RotateLeft64(t, 61)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 8), d3)
		bc0 = bits.RotateLeft64(t, 28)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 9), d4)
		bc1 = bits.RotateLeft64(t, 20)
		$.pointerValue<bigint[]>(a)[5] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[6] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[7] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[8] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[9] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 10), d0)
		bc4 = bits.RotateLeft64(t, 18)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 11), d1)
		bc0 = bits.RotateLeft64(t, 1)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 12), d2)
		bc1 = bits.RotateLeft64(t, 6)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 13), d3)
		bc2 = bits.RotateLeft64(t, 25)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 14), d4)
		bc3 = bits.RotateLeft64(t, 8)
		$.pointerValue<bigint[]>(a)[10] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[11] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[12] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[13] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[14] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 15), d0)
		bc1 = bits.RotateLeft64(t, 36)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 16), d1)
		bc2 = bits.RotateLeft64(t, 10)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 17), d2)
		bc3 = bits.RotateLeft64(t, 15)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 18), d3)
		bc4 = bits.RotateLeft64(t, 56)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 19), d4)
		bc0 = bits.RotateLeft64(t, 27)
		$.pointerValue<bigint[]>(a)[15] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[16] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[17] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[18] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[19] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))

		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 20), d0)
		bc3 = bits.RotateLeft64(t, 41)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 21), d1)
		bc4 = bits.RotateLeft64(t, 2)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 22), d2)
		bc0 = bits.RotateLeft64(t, 62)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 23), d3)
		bc1 = bits.RotateLeft64(t, 55)
		t = $.uint64Xor($.arrayIndex($.pointerValue<bigint[]>(a), 24), d4)
		bc2 = bits.RotateLeft64(t, 39)
		$.pointerValue<bigint[]>(a)[20] = $.uint64Xor(bc0, ($.uint64AndNot(bc2, bc1)))
		$.pointerValue<bigint[]>(a)[21] = $.uint64Xor(bc1, ($.uint64AndNot(bc3, bc2)))
		$.pointerValue<bigint[]>(a)[22] = $.uint64Xor(bc2, ($.uint64AndNot(bc4, bc3)))
		$.pointerValue<bigint[]>(a)[23] = $.uint64Xor(bc3, ($.uint64AndNot(bc0, bc4)))
		$.pointerValue<bigint[]>(a)[24] = $.uint64Xor(bc4, ($.uint64AndNot(bc1, bc0)))
	}
}

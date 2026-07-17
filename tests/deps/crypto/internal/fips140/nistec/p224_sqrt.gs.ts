// Generated file based on p224_sqrt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fiat from "@goscript/crypto/internal/fips140/nistec/fiat/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/crypto/internal/fips140/nistec/fiat/index.js"
import "@goscript/sync/index.js"

export let p224GG: $.VarRef<fiat.P224Element[]> | null = null! as $.VarRef<fiat.P224Element[]> | null

export function __goscript_set_p224GG(__goscriptValue: $.VarRef<fiat.P224Element[]> | null): void {
	p224GG = __goscriptValue
}

export let p224GGOnce: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set_p224GGOnce(__goscriptValue: sync.Once): void {
	p224GGOnce.value = __goscriptValue
}

export async function p224SqrtCandidate(r: fiat.P224Element | $.VarRef<fiat.P224Element> | null, x: fiat.P224Element | $.VarRef<fiat.P224Element> | null): globalThis.Promise<void> {
	// Since p = 1 mod 4, we can't use the exponentiation by (p + 1) / 4 like
	// for the other primes. Instead, implement a variation of Tonelli–Shanks.
	// The constant-time implementation is adapted from Thomas Pornin's ecGFp5.
	//
	// https://github.com/pornin/ecgfp5/blob/82325b965/rust/src/field.rs#L337-L385

	// p = q*2^n + 1 with q odd -> q = 2^128 - 1 and n = 96
	// g^(2^n) = 1 -> g = 11 ^ q (where 11 is the smallest non-square)
	// GG[j] = g^(2^j) for j = 0 to n-1

	await p224GGOnce.value.Do($.functionValue((): void => {
		p224GG = $.varRef<fiat.P224Element[]>(Array.from({ length: 96 }, () => $.markAsStructValue(new fiat.P224Element())))
		for (let __goscriptRangeTarget0 = $.pointerValue<fiat.P224Element[]>(p224GG), i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			if (i == 0) {
				$.arrayIndex($.pointerValue<fiat.P224Element[]>(p224GG), i).SetBytes(new Uint8Array([106, 15, 236, 103, 133, 152, 167, 146, 12, 85, 178, 212, 11, 45, 111, 251, 190, 163, 216, 206, 243, 251, 54, 50, 220, 105, 27, 116]) as $.Slice<number>)
			} else {
				$.arrayIndex($.pointerValue<fiat.P224Element[]>(p224GG), i).Square($.indexRef($.pointerValue<fiat.P224Element[]>(p224GG), i - 1))
			}
		}
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))

	// r <- x^((q+1)/2) = x^(2^127)
	// v <- x^q = x^(2^128-1)

	// Compute x^(2^127-1) first.
	//
	// The sequence of 10 multiplications and 126 squarings is derived from the
	// following addition chain generated with github.com/mmcloughlin/addchain v0.4.0.
	//
	//	_10      = 2*1
	//	_11      = 1 + _10
	//	_110     = 2*_11
	//	_111     = 1 + _110
	//	_111000  = _111 << 3
	//	_111111  = _111 + _111000
	//	_1111110 = 2*_111111
	//	_1111111 = 1 + _1111110
	//	x12      = _1111110 << 5 + _111111
	//	x24      = x12 << 12 + x12
	//	i36      = x24 << 7
	//	x31      = _1111111 + i36
	//	x48      = i36 << 17 + x24
	//	x96      = x48 << 48 + x48
	//	return     x96 << 31 + x31
	//
	let t0: fiat.P224Element | $.VarRef<fiat.P224Element> | null = new fiat.P224Element()
	let t1: fiat.P224Element | $.VarRef<fiat.P224Element> | null = new fiat.P224Element()

	fiat.P224Element.prototype.Square.call(r, x)
	fiat.P224Element.prototype.Mul.call(r, x, r)
	fiat.P224Element.prototype.Square.call(r, r)
	fiat.P224Element.prototype.Mul.call(r, x, r)
	fiat.P224Element.prototype.Square.call(t0, r)
	for (let s = 1; s < 3; s++) {
		fiat.P224Element.prototype.Square.call(t0, t0)
	}
	fiat.P224Element.prototype.Mul.call(t0, r, t0)
	fiat.P224Element.prototype.Square.call(t1, t0)
	fiat.P224Element.prototype.Mul.call(r, x, t1)
	for (let s = 0; s < 5; s++) {
		fiat.P224Element.prototype.Square.call(t1, t1)
	}
	fiat.P224Element.prototype.Mul.call(t0, t0, t1)
	fiat.P224Element.prototype.Square.call(t1, t0)
	for (let s = 1; s < 12; s++) {
		fiat.P224Element.prototype.Square.call(t1, t1)
	}
	fiat.P224Element.prototype.Mul.call(t0, t0, t1)
	fiat.P224Element.prototype.Square.call(t1, t0)
	for (let s = 1; s < 7; s++) {
		fiat.P224Element.prototype.Square.call(t1, t1)
	}
	fiat.P224Element.prototype.Mul.call(r, r, t1)
	for (let s = 0; s < 17; s++) {
		fiat.P224Element.prototype.Square.call(t1, t1)
	}
	fiat.P224Element.prototype.Mul.call(t0, t0, t1)
	fiat.P224Element.prototype.Square.call(t1, t0)
	for (let s = 1; s < 48; s++) {
		fiat.P224Element.prototype.Square.call(t1, t1)
	}
	fiat.P224Element.prototype.Mul.call(t0, t0, t1)
	for (let s = 0; s < 31; s++) {
		fiat.P224Element.prototype.Square.call(t0, t0)
	}
	fiat.P224Element.prototype.Mul.call(r, r, t0)

	// v = x^(2^127-1)^2 * x
	let v: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Square.call(new fiat.P224Element(), r)
	fiat.P224Element.prototype.Mul.call(v, v, x)

	// r = x^(2^127-1) * x
	fiat.P224Element.prototype.Mul.call(r, r, x)

	// for i = n-1 down to 1:
	//     w = v^(2^(i-1))
	//     if w == -1 then:
	//         v <- v*GG[n-i]
	//         r <- r*GG[n-i-1]

	let p224MinusOne: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Sub.call(new fiat.P224Element(), new fiat.P224Element(), fiat.P224Element.prototype.One.call(new fiat.P224Element()))

	for (let i = 96 - 1; i >= 1; i--) {
		let w: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Set.call(new fiat.P224Element(), v)
		for (let j = 0; j < (i - 1); j++) {
			fiat.P224Element.prototype.Square.call(w, w)
		}
		let cond = fiat.P224Element.prototype.Equal.call(w, p224MinusOne)
		fiat.P224Element.prototype.Select.call(v, fiat.P224Element.prototype.Mul.call(t0, v, $.indexRef($.pointerValue<fiat.P224Element[]>(p224GG), 96 - i)), v, cond)
		fiat.P224Element.prototype.Select.call(r, fiat.P224Element.prototype.Mul.call(t0, r, $.indexRef($.pointerValue<fiat.P224Element[]>(p224GG), (96 - i) - 1)), r, cond)
	}
}

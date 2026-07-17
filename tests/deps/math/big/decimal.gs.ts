// Generated file based on decimal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as io from "@goscript/io/index.js"

import type * as rand from "@goscript/math/rand/index.js"

import * as __goscript_arith from "./arith.gs.ts"

import * as __goscript_int from "./int.gs.ts"

import * as __goscript_nat from "./nat.gs.ts"

import * as __goscript_natconv from "./natconv.gs.ts"

import * as __goscript_natdiv from "./natdiv.gs.ts"

import * as __goscript_natmul from "./natmul.gs.ts"

import * as __goscript_prime from "./prime.gs.ts"
import "./arith.gs.ts"
import "./int.gs.ts"
import "./nat.gs.ts"
import "./natconv.gs.ts"
import "./natdiv.gs.ts"
import "./natmul.gs.ts"
import "./prime.gs.ts"

export class decimal {
	public get mant(): $.Slice<number> {
		return this._fields.mant.value
	}
	public set mant(value: $.Slice<number>) {
		this._fields.mant.value = value
	}

	public get exp(): number {
		return this._fields.exp.value
	}
	public set exp(value: number) {
		this._fields.exp.value = value
	}

	public _fields: {
		mant: $.VarRef<$.Slice<number>>
		exp: $.VarRef<number>
	}

	constructor(init?: Partial<{mant?: $.Slice<number>, exp?: number}>) {
		this._fields = {
			mant: $.varRef(init?.mant ?? (null! as $.Slice<number>)),
			exp: $.varRef(init?.exp ?? (0 as number))
		}
	}

	public clone(): decimal {
		const cloned = new decimal()
		cloned._fields = {
			mant: $.varRef(this._fields.mant.value),
			exp: $.varRef(this._fields.exp.value)
		}
		return $.markAsStructValue(cloned)
	}

	public String(): string {
		const x: decimal | $.VarRef<decimal> | null = this
		if ($.len($.pointerValue<decimal>(x).mant) == 0) {
			return "0"
		}

		let buf: $.Slice<number> = null! as $.Slice<number>
		switch (true) {
			case $.pointerValue<decimal>(x).exp <= 0:
			{
				buf = $.makeSlice<number>(0, (2 + (-$.pointerValue<decimal>(x).exp)) + $.len($.pointerValue<decimal>(x).mant), "byte")
				buf = $.appendSlice(buf, $.stringToBytes("0."), $.byteSliceHint)
				buf = appendZeros(buf, -$.pointerValue<decimal>(x).exp)
				buf = $.appendSlice(buf, $.pointerValue<decimal>(x).mant, $.byteSliceHint)
				break
			}
			case $.pointerValue<decimal>(x).exp < $.len($.pointerValue<decimal>(x).mant):
			{
				buf = $.makeSlice<number>(0, 1 + $.len($.pointerValue<decimal>(x).mant), "byte")
				buf = $.appendSlice(buf, $.goSlice($.pointerValue<decimal>(x).mant, undefined, $.pointerValue<decimal>(x).exp), $.byteSliceHint)
				buf = $.append(buf, $.uint(46, 8), $.byteSliceHint)
				buf = $.appendSlice(buf, $.goSlice($.pointerValue<decimal>(x).mant, $.pointerValue<decimal>(x).exp, undefined), $.byteSliceHint)
				break
			}
			default:
			{
				buf = $.makeSlice<number>(0, $.pointerValue<decimal>(x).exp, "byte")
				buf = $.appendSlice(buf, $.pointerValue<decimal>(x).mant, $.byteSliceHint)
				buf = appendZeros(buf, $.pointerValue<decimal>(x).exp - $.len($.pointerValue<decimal>(x).mant))
				break
			}
		}

		return $.bytesToString(buf)
	}

	public at(i: number): number {
		const d: decimal | $.VarRef<decimal> | null = this
		if ((0 <= i) && (i < $.len($.pointerValue<decimal>(d).mant))) {
			return $.uint($.arrayIndex($.pointerValue<decimal>(d).mant!, i), 8)
		}
		return $.uint(48, 8)
	}

	public async init(m: __goscript_nat.nat, shift: number): globalThis.Promise<void> {
		let x: decimal | $.VarRef<decimal> | null = this
		// special case 0
		if ($.len((m as __goscript_nat.nat)) == 0) {
			$.pointerValue<decimal>(x).mant = $.goSlice($.pointerValue<decimal>(x).mant, undefined, 0)
			$.pointerValue<decimal>(x).exp = 0
			return
		}

		// Optimization: If we need to shift right, first remove any trailing
		// zero bits from m to reduce shift amount that needs to be done in
		// decimal format (since that is likely slower).
		if (shift < 0) {
			let ntz = __goscript_nat.nat_trailingZeroBits(m)
			let s = $.uint(-shift, 64)
			if (s >= ntz) {
				s = ntz
			}
			m = (__goscript_nat.nat_rsh((null as __goscript_nat.nat), (m as __goscript_nat.nat), s) as __goscript_nat.nat)
			shift = shift + ($.int(s))
		}

		// Do any shift left in binary representation.
		if (shift > 0) {
			m = (__goscript_nat.nat_lsh((null as __goscript_nat.nat), (m as __goscript_nat.nat), $.uint(shift, 64)) as __goscript_nat.nat)
			shift = 0
		}

		// Convert mantissa into decimal representation.
		let s: $.Slice<number> = await __goscript_natconv.nat_utoa(m, 10)
		let n = $.len(s)
		$.pointerValue<decimal>(x).exp = n
		// Trim trailing zeros; instead the exponent is tracking
		// the decimal point independent of the number of digits.
		while ((n > 0) && ($.uint($.arrayIndex(s!, n - 1), 8) == $.uint(48, 8))) {
			n--
		}
		$.pointerValue<decimal>(x).mant = $.appendSlice($.goSlice($.pointerValue<decimal>(x).mant, undefined, 0), $.goSlice(s, undefined, n), $.byteSliceHint)

		// Do any (remaining) shift right in decimal representation.
		if (shift < 0) {
			while (shift < -60) {
				rsh(x, 60)
				shift = shift + (60)
			}
			rsh(x, $.uint(-shift, 64))
		}
	}

	public round(n: number): void {
		const x: decimal | $.VarRef<decimal> | null = this
		if ((n < 0) || (n >= $.len($.pointerValue<decimal>(x).mant))) {
			return
		}

		if (shouldRoundUp(x, n)) {
			decimal.prototype.roundUp.call(x, n)
		} else {
			decimal.prototype.roundDown.call(x, n)
		}
	}

	public roundDown(n: number): void {
		let x: decimal | $.VarRef<decimal> | null = this
		if ((n < 0) || (n >= $.len($.pointerValue<decimal>(x).mant))) {
			return
		}
		$.pointerValue<decimal>(x).mant = $.goSlice($.pointerValue<decimal>(x).mant, undefined, n)
		trim(x)
	}

	public roundUp(n: number): void {
		let x: decimal | $.VarRef<decimal> | null = this
		if ((n < 0) || (n >= $.len($.pointerValue<decimal>(x).mant))) {
			return
		}
		// 0 <= n < len(x.mant)

		// find first digit < '9'
		while ((n > 0) && ($.uint($.arrayIndex($.pointerValue<decimal>(x).mant!, n - 1), 8) >= $.uint(57, 8))) {
			n--
		}

		if (n == 0) {
			// all digits are '9's => round up to '1' and update exponent
			$.pointerValue<decimal>(x).mant![0] = $.uint(49, 8)
			$.pointerValue<decimal>(x).mant = $.goSlice($.pointerValue<decimal>(x).mant, undefined, 1)
			$.pointerValue<decimal>(x).exp++
			return
		}

		// n > 0 && x.mant[n-1] < '9'
		$.pointerValue<decimal>(x).mant![n - 1]++
		$.pointerValue<decimal>(x).mant = $.goSlice($.pointerValue<decimal>(x).mant, undefined, n)
	}

	static __typeInfo = $.registerStructType(
		"big.decimal",
		() => new decimal(),
		[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "at", args: [{ name: "i", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint8" } }] }, { name: "init", args: [{ name: "m", type: { kind: $.TypeKind.Slice, typeName: "big.nat", elemType: { kind: $.TypeKind.Basic, name: "uint", typeName: "big.Word" } } }, { name: "shift", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "round", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "roundDown", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "roundUp", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }],
		decimal,
		[{ name: "mant", key: "mant", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "math/big", index: [0], offset: 0, exported: false }, { name: "exp", key: "exp", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "math/big", index: [1], offset: 24, exported: false }]
	)
}

export const maxShift: number = 60

export function rsh(x: decimal | $.VarRef<decimal> | null, s: number): void {
	// Division by 1<<s using shift-and-subtract algorithm.

	// pick up enough leading digits to cover first shift
	let r = 0
	let n: __goscript_arith.Word = 0
	while ((($.uint($.uint64Shr(n, s), 64)) == 0) && (r < $.len($.pointerValue<decimal>(x).mant))) {
		let ch = $.uint($.arrayIndex($.pointerValue<decimal>(x).mant!, r), 64)
		r++
		n = $.uint($.uint64Sub(($.uint($.uint64Add(($.uint($.uint64Mul(n, 10n), 64)), ch), 64)), 48n), 64)
	}
	if (n == 0) {
		// x == 0; shouldn't get here, but handle anyway
		$.pointerValue<decimal>(x).mant = $.goSlice($.pointerValue<decimal>(x).mant, undefined, 0)
		return
	}
	while (($.uint($.uint64Shr(n, s), 64)) == 0) {
		r++
		n = $.uint($.uint64Mul(n, 10), 64)
	}
	$.pointerValue<decimal>(x).exp = $.pointerValue<decimal>(x).exp + (1 - r)

	// read a digit, write a digit
	let w = 0
	let mask = $.uint($.uint64Sub(($.uint($.uint64Shl(1n, s), 64)), 1n), 64)
	while (r < $.len($.pointerValue<decimal>(x).mant)) {
		let ch = $.uint($.arrayIndex($.pointerValue<decimal>(x).mant!, r), 64)
		r++
		let d = $.uint($.uint64Shr(n, s), 64)
		n = $.uint($.uint64And(n, mask), 64)
		$.pointerValue<decimal>(x).mant![w] = $.uint($.uint($.uint($.uint64Add(d, 48n), 64), 8), 8)
		w++
		n = $.uint($.uint64Sub(($.uint($.uint64Add(($.uint($.uint64Mul(n, 10n), 64)), ch), 64)), 48n), 64)
	}

	// write extra digits that still fit
	while ((n > 0) && (w < $.len($.pointerValue<decimal>(x).mant))) {
		let d = $.uint($.uint64Shr(n, s), 64)
		n = $.uint($.uint64And(n, mask), 64)
		$.pointerValue<decimal>(x).mant![w] = $.uint($.uint($.uint($.uint64Add(d, 48n), 64), 8), 8)
		w++
		n = $.uint($.uint64Mul(n, 10n), 64)
	}
	$.pointerValue<decimal>(x).mant = $.goSlice($.pointerValue<decimal>(x).mant, undefined, w)

	// append additional digits that didn't fit
	while (n > 0) {
		let d = $.uint($.uint64Shr(n, s), 64)
		n = $.uint($.uint64And(n, mask), 64)
		$.pointerValue<decimal>(x).mant = $.append($.pointerValue<decimal>(x).mant, $.uint($.uint($.uint($.uint64Add(d, 48n), 64), 8), 8), $.byteSliceHint)
		n = $.uint($.uint64Mul(n, 10n), 64)
	}

	trim(x)
}

export function appendZeros(buf: $.Slice<number>, n: number): $.Slice<number> {
	for (; n > 0; n--) {
		buf = $.append(buf, $.uint(48, 8), $.byteSliceHint)
	}
	return buf
}

export function shouldRoundUp(x: decimal | $.VarRef<decimal> | null, n: number): boolean {
	if (($.uint($.arrayIndex($.pointerValue<decimal>(x).mant!, n), 8) == $.uint(53, 8)) && ((n + 1) == $.len($.pointerValue<decimal>(x).mant))) {
		// exactly halfway - round to even
		return (n > 0) && ($.uint((($.arrayIndex($.pointerValue<decimal>(x).mant!, n - 1) - 48) & 1), 8) != $.uint(0, 8))
	}
	// not halfway - digit tells all (x.mant has no trailing zeros)
	return $.uint($.arrayIndex($.pointerValue<decimal>(x).mant!, n), 8) >= $.uint(53, 8)
}

export function trim(x: decimal | $.VarRef<decimal> | null): void {
	let i = $.len($.pointerValue<decimal>(x).mant)
	while ((i > 0) && ($.uint($.arrayIndex($.pointerValue<decimal>(x).mant!, i - 1), 8) == $.uint(48, 8))) {
		i--
	}
	$.pointerValue<decimal>(x).mant = $.goSlice($.pointerValue<decimal>(x).mant, undefined, i)
	if (i == 0) {
		$.pointerValue<decimal>(x).exp = 0
	}
}

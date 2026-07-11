// Generated file based on ftoa.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fmt2 from "@goscript/fmt/index.js"

import * as strconv from "@goscript/strconv/index.js"

import type * as io from "@goscript/io/index.js"

import type * as rand from "@goscript/math/rand/index.js"

import * as __goscript_accuracy_string from "./accuracy_string.gs.ts"

import * as __goscript_arith from "./arith.gs.ts"

import * as __goscript_decimal from "./decimal.gs.ts"

import * as __goscript_float from "./float.gs.ts"

import * as __goscript_floatconv from "./floatconv.gs.ts"

import * as __goscript_floatmarsh from "./floatmarsh.gs.ts"

import * as __goscript_int from "./int.gs.ts"

import * as __goscript_intconv from "./intconv.gs.ts"

import * as __goscript_intmarsh from "./intmarsh.gs.ts"

import * as __goscript_nat from "./nat.gs.ts"

import * as __goscript_natconv from "./natconv.gs.ts"

import * as __goscript_natdiv from "./natdiv.gs.ts"

import * as __goscript_natmul from "./natmul.gs.ts"

import * as __goscript_prime from "./prime.gs.ts"

import * as __goscript_rat from "./rat.gs.ts"

import type * as __goscript_ratconv from "./ratconv.gs.ts"

import type * as __goscript_ratmarsh from "./ratmarsh.gs.ts"

import * as __goscript_roundingmode_string from "./roundingmode_string.gs.ts"

import * as __goscript_sqrt from "./sqrt.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/fmt/index.js"
import "@goscript/strconv/index.js"
import "./accuracy_string.gs.ts"
import "./arith.gs.ts"
import "./decimal.gs.ts"
import "./float.gs.ts"
import "./floatconv.gs.ts"
import "./floatmarsh.gs.ts"
import "./int.gs.ts"
import "./intconv.gs.ts"
import "./intmarsh.gs.ts"
import "./nat.gs.ts"
import "./natconv.gs.ts"
import "./natdiv.gs.ts"
import "./natmul.gs.ts"
import "./prime.gs.ts"
import "./rat.gs.ts"
import "./roundingmode_string.gs.ts"
import "./sqrt.gs.ts"

export async function roundShortest(d: __goscript_decimal.decimal | $.VarRef<__goscript_decimal.decimal> | null, x: __goscript_float.Float | $.VarRef<__goscript_float.Float> | null): globalThis.Promise<void> {
	// if the mantissa is zero, the number is zero - stop now
	if ($.len($.pointerValue<__goscript_decimal.decimal>(d).mant) == 0) {
		return
	}

	// Approach: All numbers in the interval [x - 1/2ulp, x + 1/2ulp]
	// (possibly exclusive) round to x for the given precision of x.
	// Compute the lower and upper bound in decimal form and find the
	// shortest decimal number d such that lower <= d <= upper.

	// TODO(gri) strconv/ftoa.do describes a shortcut in some cases.
	// See if we can use it (in adjusted form) here as well.

	// 1) Compute normalized mantissa mant and exponent exp for x such
	// that the lsb of mant corresponds to 1/2 ulp for the precision of
	// x (i.e., for mant we want x.prec + 1 bits).
	let mant: __goscript_nat.nat = (__goscript_nat.nat__set((null as __goscript_nat.nat), ($.pointerValue<__goscript_float.Float>(x).mant as __goscript_nat.nat)) as __goscript_nat.nat)
	let exp = $.int($.pointerValue<__goscript_float.Float>(x).exp) - __goscript_nat.nat_bitLen(mant)
	let s = __goscript_nat.nat_bitLen(mant) - $.int($.pointerValue<__goscript_float.Float>(x).prec + 1)
	switch (true) {
		case s < 0:
		{
			mant = (__goscript_nat.nat_lsh(mant, (mant as __goscript_nat.nat), $.uint(-s, 64)) as __goscript_nat.nat)
			break
		}
		case s > 0:
		{
			mant = (__goscript_nat.nat_rsh(mant, (mant as __goscript_nat.nat), $.uint(+s, 64)) as __goscript_nat.nat)
			break
		}
	}
	exp = exp + (s)
	// x = mant * 2**exp with lsb(mant) == 1/2 ulp of x.prec

	// 2) Compute lower bound by subtracting 1/2 ulp.
	let lower: $.VarRef<__goscript_decimal.decimal> = $.varRef($.markAsStructValue(new __goscript_decimal.decimal()))
	let tmp: __goscript_nat.nat = null as __goscript_nat.nat
	await lower.value.init((__goscript_nat.nat_sub(tmp, (mant as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat), exp)

	// 3) Compute upper bound by adding 1/2 ulp.
	let upper: $.VarRef<__goscript_decimal.decimal> = $.varRef($.markAsStructValue(new __goscript_decimal.decimal()))
	await upper.value.init((__goscript_nat.nat_add(tmp, (mant as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat), exp)

	// The upper and lower bounds are possible outputs only if
	// the original mantissa is even, so that ToNearestEven rounding
	// would round to the original mantissa and not the neighbors.
	let inclusive = ($.uint($.uint64And($.arrayIndex(mant!, 0), 2n), 64)) == 0

	// Now we can figure out the minimum number of digits required.
	// Walk along until d has distinguished itself from upper and lower.
	for (let __goscriptRangeTarget0 = $.pointerValue<__goscript_decimal.decimal>(d).mant, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let m = __goscriptRangeTarget0![i]
		let l = $.uint(lower.value.at(i), 8)
		let u = $.uint(upper.value.at(i), 8)

		// Okay to round down (truncate) if lower has a different digit
		// or if lower is inclusive and is exactly the result of rounding
		// down (i.e., and we have reached the final digit of lower).
		let okdown = ($.uint(l, 8) != $.uint(m, 8)) || (inclusive && ((i + 1) == $.len(lower.value.mant)))

		// Okay to round up if upper has a different digit and either upper
		// is inclusive or upper is bigger than the result of rounding up.
		let okup = ($.uint(m, 8) != $.uint(u, 8)) && ((inclusive || ($.uint((m + 1), 8) < $.uint(u, 8))) || ((i + 1) < $.len(upper.value.mant)))

		// If it's okay to do either, then round to the nearest one.
		// If it's okay to do only one, do it.
		switch (true) {
			case okdown && okup:
			{
				__goscript_decimal.decimal.prototype.round.call(d, i + 1)
				return
				break
			}
			case okdown:
			{
				__goscript_decimal.decimal.prototype.roundDown.call(d, i + 1)
				return
				break
			}
			case okup:
			{
				__goscript_decimal.decimal.prototype.roundUp.call(d, i + 1)
				return
				break
			}
		}
	}
}

export function fmtE(buf: $.Slice<number>, fmt: number, prec: number, d: __goscript_decimal.decimal): $.Slice<number> {
	// first digit
	let ch = $.uint($.uint(48, 8), 8)
	if ($.len(d.mant) > 0) {
		ch = $.uint($.arrayIndex(d.mant!, 0), 8)
	}
	buf = $.append(buf, $.uint(ch, 8), $.byteSliceHint)

	// .moredigits
	if (prec > 0) {
		buf = $.append(buf, $.uint(46, 8), $.byteSliceHint)
		let i = 1
		let m = $.min($.len(d.mant), prec + 1)
		if (i < m) {
			buf = $.appendSlice(buf, $.goSlice(d.mant, i, m), $.byteSliceHint)
			i = m
		}
		for (; i <= prec; i++) {
			buf = $.append(buf, $.uint(48, 8), $.byteSliceHint)
		}
	}

	// e±
	buf = $.append(buf, $.uint(fmt, 8), $.byteSliceHint)
	let exp: bigint = 0n
	if ($.len(d.mant) > 0) {
		exp = $.int64Sub($.int64(d.exp), 1n)
	}
	if (exp < 0n) {
		ch = $.uint(45, 8)
		exp = -exp
	} else {
		ch = $.uint(43, 8)
	}
	buf = $.append(buf, $.uint(ch, 8), $.byteSliceHint)

	// dd...d
	if (exp < 10n) {
		buf = $.append(buf, $.uint(48, 8), $.byteSliceHint)
	}
	return strconv.AppendInt(buf, exp, 10)
}

export function fmtF(buf: $.Slice<number>, prec: number, __goscriptParam0: __goscript_decimal.decimal): $.Slice<number> {
	let d: $.VarRef<__goscript_decimal.decimal> = $.varRef(__goscriptParam0)
	// integer, padded with zeros as needed
	if (d.value.exp > 0) {
		let m = $.min($.len(d.value.mant), d.value.exp)
		buf = $.appendSlice(buf, $.goSlice(d.value.mant, undefined, m), $.byteSliceHint)
		for (; m < d.value.exp; m++) {
			buf = $.append(buf, $.uint(48, 8), $.byteSliceHint)
		}
	} else {
		buf = $.append(buf, $.uint(48, 8), $.byteSliceHint)
	}

	// fraction
	if (prec > 0) {
		buf = $.append(buf, $.uint(46, 8), $.byteSliceHint)
		for (let i = 0; i < prec; i++) {
			buf = $.append(buf, $.uint(d.value.at(d.value.exp + i), 8), $.byteSliceHint)
		}
	}

	return buf
}

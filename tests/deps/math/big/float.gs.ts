// Generated file based on float.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as fmt2 from "@goscript/fmt/index.js"

import * as math from "@goscript/math/index.js"

import * as bits2 from "@goscript/math/bits/index.js"

import * as io from "@goscript/io/index.js"

import * as strings from "@goscript/strings/index.js"

import * as errors from "@goscript/errors/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as sync from "@goscript/sync/index.js"

import type * as rand from "@goscript/math/rand/index.js"

import * as __goscript_accuracy_string from "./accuracy_string.gs.ts"

import * as __goscript_arith from "./arith.gs.ts"

import * as __goscript_arith_decl from "./arith_decl.gs.ts"

import * as __goscript_decimal from "./decimal.gs.ts"

import * as __goscript_floatconv from "./floatconv.gs.ts"

import * as __goscript_floatmarsh from "./floatmarsh.gs.ts"

import * as __goscript_ftoa from "./ftoa.gs.ts"

import * as __goscript_int from "./int.gs.ts"

import * as __goscript_intconv from "./intconv.gs.ts"

import * as __goscript_intmarsh from "./intmarsh.gs.ts"

import * as __goscript_nat from "./nat.gs.ts"

import * as __goscript_natconv from "./natconv.gs.ts"

import * as __goscript_natdiv from "./natdiv.gs.ts"

import * as __goscript_natmul from "./natmul.gs.ts"

import * as __goscript_prime from "./prime.gs.ts"

import * as __goscript_rat from "./rat.gs.ts"

import * as __goscript_ratconv from "./ratconv.gs.ts"

import * as __goscript_ratmarsh from "./ratmarsh.gs.ts"

import * as __goscript_roundingmode_string from "./roundingmode_string.gs.ts"

import * as __goscript_sqrt from "./sqrt.gs.ts"
import "@goscript/strconv/index.js"
import "@goscript/fmt/index.js"
import "@goscript/math/index.js"
import "@goscript/math/bits/index.js"
import "@goscript/io/index.js"
import "@goscript/strings/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/byteorder/index.js"
import "@goscript/bytes/index.js"
import "@goscript/sync/index.js"
import "./accuracy_string.gs.ts"
import "./arith.gs.ts"
import "./arith_decl.gs.ts"
import "./decimal.gs.ts"
import "./floatconv.gs.ts"
import "./floatmarsh.gs.ts"
import "./ftoa.gs.ts"
import "./int.gs.ts"
import "./intconv.gs.ts"
import "./intmarsh.gs.ts"
import "./nat.gs.ts"
import "./natconv.gs.ts"
import "./natdiv.gs.ts"
import "./natmul.gs.ts"
import "./prime.gs.ts"
import "./rat.gs.ts"
import "./ratconv.gs.ts"
import "./ratmarsh.gs.ts"
import "./roundingmode_string.gs.ts"
import "./sqrt.gs.ts"

export type form = number

export type RoundingMode = number

export type Accuracy = number

export class Float {
	public get prec(): number {
		return this._fields.prec.value
	}
	public set prec(value: number) {
		this._fields.prec.value = value
	}

	public get mode(): RoundingMode {
		return this._fields.mode.value
	}
	public set mode(value: RoundingMode) {
		this._fields.mode.value = value
	}

	public get acc(): Accuracy {
		return this._fields.acc.value
	}
	public set acc(value: Accuracy) {
		this._fields.acc.value = value
	}

	public get form(): form {
		return this._fields.form.value
	}
	public set form(value: form) {
		this._fields.form.value = value
	}

	public get neg(): boolean {
		return this._fields.neg.value
	}
	public set neg(value: boolean) {
		this._fields.neg.value = value
	}

	public get mant(): __goscript_nat.nat {
		return this._fields.mant.value
	}
	public set mant(value: __goscript_nat.nat) {
		this._fields.mant.value = value
	}

	public get exp(): number {
		return this._fields.exp.value
	}
	public set exp(value: number) {
		this._fields.exp.value = value
	}

	public _fields: {
		prec: $.VarRef<number>
		mode: $.VarRef<RoundingMode>
		acc: $.VarRef<Accuracy>
		form: $.VarRef<form>
		neg: $.VarRef<boolean>
		mant: $.VarRef<__goscript_nat.nat>
		exp: $.VarRef<number>
	}

	constructor(init?: Partial<{prec?: number, mode?: RoundingMode, acc?: Accuracy, form?: form, neg?: boolean, mant?: __goscript_nat.nat, exp?: number}>) {
		this._fields = {
			prec: $.varRef(init?.prec ?? (0 as number)),
			mode: $.varRef(init?.mode ?? (0 as RoundingMode)),
			acc: $.varRef(init?.acc ?? (0 as Accuracy)),
			form: $.varRef(init?.form ?? (0 as form)),
			neg: $.varRef(init?.neg ?? (false as boolean)),
			mant: $.varRef(init?.mant ?? (null! as __goscript_nat.nat)),
			exp: $.varRef(init?.exp ?? (0 as number))
		}
	}

	public clone(): Float {
		const cloned = new Float()
		cloned._fields = {
			prec: $.varRef(this._fields.prec.value),
			mode: $.varRef(this._fields.mode.value),
			acc: $.varRef(this._fields.acc.value),
			form: $.varRef(this._fields.form.value),
			neg: $.varRef(this._fields.neg.value),
			mant: $.varRef(this._fields.mant.value),
			exp: $.varRef(this._fields.exp.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Abs(x: Float | $.VarRef<Float> | null): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		await Float.prototype.Set.call(z, x)
		$.pointerValue<Float>(z).neg = false
		return z
	}

	public Acc(): Accuracy {
		const x: Float | $.VarRef<Float> | null = this
		return $.int($.pointerValue<Float>(x).acc, 8)
	}

	public async Add(x: Float | $.VarRef<Float> | null, y: Float | $.VarRef<Float> | null): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
			await Float.prototype.validate.call(y)
		}

		if ($.uint($.pointerValue<Float>(z).prec, 32) == $.uint(0, 32)) {
			$.pointerValue<Float>(z).prec = $.uint($.max($.uint($.pointerValue<Float>(x).prec, 32), $.uint($.pointerValue<Float>(y).prec, 32)), 32)
		}

		if (($.uint($.pointerValue<Float>(x).form, 8) == $.uint(1, 8)) && ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(1, 8))) {
			// x + y (common case)

			// Below we set z.neg = x.neg, and when z aliases y this will
			// change the y operand's sign. This is fine, because if an
			// operand aliases the receiver it'll be overwritten, but we still
			// want the original x.neg and y.neg values when we evaluate
			// x.neg != y.neg, so we need to save y.neg before setting z.neg.
			let yneg = $.pointerValue<Float>(y).neg

			$.pointerValue<Float>(z).neg = $.pointerValue<Float>(x).neg
			if ($.pointerValue<Float>(x).neg == yneg) {
				// x + y == x + y
				// (-x) + (-y) == -(x + y)
				await Float.prototype.uadd.call(z, x, y)
			} else {
				// x + (-y) == x - y == -(y - x)
				// (-x) + y == y - x == -(x - y)
				if (Float.prototype.ucmp.call(x, y) > 0) {
					await Float.prototype.usub.call(z, x, y)
				} else {
					$.pointerValue<Float>(z).neg = !$.pointerValue<Float>(z).neg
					await Float.prototype.usub.call(z, y, x)
				}
			}
			if ((($.uint($.pointerValue<Float>(z).form, 8) == $.uint(0, 8)) && ($.uint($.pointerValue<Float>(z).mode, 8) == $.uint(4, 8))) && ($.int($.pointerValue<Float>(z).acc, 8) == $.int(0, 8))) {
				$.pointerValue<Float>(z).neg = true
			}
			return z
		}

		if ((($.uint($.pointerValue<Float>(x).form, 8) == $.uint(2, 8)) && ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(2, 8))) && ($.pointerValue<Float>(x).neg != $.pointerValue<Float>(y).neg)) {
			// +Inf + -Inf
			// -Inf + +Inf
			// value of z is undefined but make sure it's valid
			$.pointerValue<Float>(z).acc = $.int(0, 8)
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			$.pointerValue<Float>(z).neg = false
			$.panic($.interfaceValue<any>($.markAsStructValue(new ErrNaN({msg: "addition of infinities with opposite signs"})), "big.ErrNaN", "big.ErrNaN"))
		}

		if (($.uint($.pointerValue<Float>(x).form, 8) == $.uint(0, 8)) && ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(0, 8))) {
			// ±0 + ±0
			$.pointerValue<Float>(z).acc = $.int(0, 8)
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			$.pointerValue<Float>(z).neg = $.pointerValue<Float>(x).neg && $.pointerValue<Float>(y).neg
			return z
		}

		if (($.uint($.pointerValue<Float>(x).form, 8) == $.uint(2, 8)) || ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(0, 8))) {
			// ±Inf + y
			// x + ±0
			return Float.prototype.Set.call(z, x)
		}

		// ±0 + y
		// x + ±Inf
		return Float.prototype.Set.call(z, y)
	}

	public async Append(buf: $.Slice<number>, fmt: number, prec: number): globalThis.Promise<$.Slice<number>> {
		const x: Float | $.VarRef<Float> | null = this

		if ($.pointerValue<Float>(x).neg) {
			buf = $.append(buf, $.uint(45, 8), $.byteSliceHint)
		}

		if ($.uint($.pointerValue<Float>(x).form, 8) == $.uint(2, 8)) {
			if (!$.pointerValue<Float>(x).neg) {
				buf = $.append(buf, $.uint(43, 8), $.byteSliceHint)
			}
			return $.appendSlice(buf, $.stringToBytes("Inf"), $.byteSliceHint)
		}

		switch (fmt) {
			case 98:
			{
				return Float.prototype.fmtB.call(x, buf)
				break
			}
			case 112:
			{
				return Float.prototype.fmtP.call(x, buf)
				break
			}
			case 120:
			{
				return Float.prototype.fmtX.call(x, buf, prec)
				break
			}
		}

		let d: $.VarRef<__goscript_decimal.decimal> = $.varRef($.markAsStructValue(new __goscript_decimal.decimal()))
		if ($.uint($.pointerValue<Float>(x).form, 8) == $.uint(1, 8)) {
			// Exponent and precision limits.
			await d.value.init(($.pointerValue<Float>(x).mant as __goscript_nat.nat), $.int($.pointerValue<Float>(x).exp) - __goscript_nat.nat_bitLen($.pointerValue<Float>(x).mant))
		}
		// smallest supported exponent
		// largest (theoretically) supported precision; likely memory-limited
		let shortest = false
		if (prec < 0) {
			shortest = true
			await __goscript_ftoa.roundShortest(d, x)

			switch (fmt) {
				case 101:
				case 69:
				{
					prec = $.len(d.value.mant) - 1
					break
				}
				case 102:
				{
					prec = $.max($.len(d.value.mant) - d.value.exp, 0)
					break
				}
				case 103:
				case 71:
				{
					prec = $.len(d.value.mant)
					break
				}
			}
		} else {

			switch (fmt) {
				case 101:
				case 69:
				{
					d.value.round(1 + prec)
					break
				}
				case 102:
				{
					d.value.round(d.value.exp + prec)
					break
				}
				case 103:
				case 71:
				{
					if (prec == 0) {
						prec = 1
					}
					d.value.round(prec)
					break
				}
			}
		}

		switch (fmt) {
			case 101:
			case 69:
			{
				return __goscript_ftoa.fmtE(buf, $.uint(fmt, 8), prec, $.markAsStructValue($.cloneStructValue(d.value)))
				break
			}
			case 102:
			{
				return __goscript_ftoa.fmtF(buf, prec, $.markAsStructValue($.cloneStructValue(d.value)))
				break
			}
			case 103:
			case 71:
			{
				let eprec = prec
				if ((eprec > $.len(d.value.mant)) && ($.len(d.value.mant) >= d.value.exp)) {
					eprec = $.len(d.value.mant)
				}

				//go:generate stringer -type=RoundingMode

				if (shortest) {
					eprec = 6
				}
				let exp = d.value.exp - 1
				if ((exp < -4) || (exp >= eprec)) {
					if (prec > $.len(d.value.mant)) {
						prec = $.len(d.value.mant)
					}
					return __goscript_ftoa.fmtE(buf, $.uint((fmt + 101) - 103, 8), prec - 1, $.markAsStructValue($.cloneStructValue(d.value)))
				}
				if (prec > d.value.exp) {
					prec = $.len(d.value.mant)
				}
				return __goscript_ftoa.fmtF(buf, $.max(prec - d.value.exp, 0), $.markAsStructValue($.cloneStructValue(d.value)))
				break
			}
		}

		if ($.pointerValue<Float>(x).neg) {
			buf = $.goSlice(buf, undefined, $.len(buf) - 1)
		}
		return $.append(buf, $.uint(37, 8), $.uint(fmt, 8), $.byteSliceHint)
	}

	public async AppendText(b: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const x: Float | $.VarRef<Float> | null = this
		if (x == null) {
			return [$.appendSlice(b, $.stringToBytes("<nil>"), $.byteSliceHint), null]
		}
		return [await Float.prototype.Append.call(x, b, $.uint(103, 8), -1), null]
	}

	public async Cmp(y: Float | $.VarRef<Float> | null): globalThis.Promise<number> {
		const x: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
			await Float.prototype.validate.call(y)
		}

		let mx = Float.prototype.ord.call(x)
		let my = Float.prototype.ord.call(y)
		switch (true) {
			case mx < my:
			{
				return -1
				break
			}
			case mx > my:
			{
				return +1
				break
			}
		}
		// mx == my

		// only if |mx| == 1 we have to compare the mantissae
		switch (mx) {
			case -1:
			{
				return Float.prototype.ucmp.call(y, x)
				break
			}
			case +1:
			{
				return Float.prototype.ucmp.call(x, y)
				break
			}
		}

		return 0
	}

	public async Copy(x: Float | $.VarRef<Float> | null): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
		}
		if (!$.pointerEqual(z, x)) {
			$.pointerValue<Float>(z).prec = $.uint($.pointerValue<Float>(x).prec, 32)
			$.pointerValue<Float>(z).mode = $.uint($.pointerValue<Float>(x).mode, 8)
			$.pointerValue<Float>(z).acc = $.int($.pointerValue<Float>(x).acc, 8)
			$.pointerValue<Float>(z).form = $.uint($.pointerValue<Float>(x).form, 8)
			$.pointerValue<Float>(z).neg = $.pointerValue<Float>(x).neg
			if ($.uint($.pointerValue<Float>(z).form, 8) == $.uint(1, 8)) {
				$.pointerValue<Float>(z).mant = (__goscript_nat.nat__set($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(x).mant as __goscript_nat.nat)) as __goscript_nat.nat)
				$.pointerValue<Float>(z).exp = $.int($.pointerValue<Float>(x).exp, 32)
			}
		}
		return z
	}

	public async Float32(): globalThis.Promise<[number, Accuracy]> {
		const x: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
		}

		switch ($.pointerValue<Float>(x).form) {
			case 1:
			{
				const fbits: number = 32
				const mbits: number = 23
				const ebits: number = 8
				const bias: number = 127
				const dmin: number = -149
				const emin: number = -126
				const emax: number = 127

				// Float mantissa m is 0.5 <= m < 1.0; compute exponent e for float32 mantissa.
				let e = $.int($.pointerValue<Float>(x).exp - 1, 32)

				// Compute precision p for float32 mantissa.
				// If the exponent is too small, we have a denormal number before
				// rounding and fewer than p mantissa bits of precision available
				// (the exponent remains fixed but the mantissa gets shifted right).
				let p = 23 + 1
				if ($.int(e, 32) < $.int(-126, 32)) {
					// recompute precision
					p = ((23 + 1) - -126) + $.int(e)
					// If p == 0, the mantissa of x is shifted so much to the right
					// that its msb falls immediately to the right of the float32
					// mantissa space. In other words, if the smallest denormal is
					// considered "1.0", for p == 0, the mantissa value m is >= 0.5.
					// If m > 0.5, it is rounded up to 1.0; i.e., the smallest denormal.
					// If m == 0.5, it is rounded down to even, i.e., 0.0.
					// If p < 0, the mantissa value m is <= "0.25" which is never rounded up.
					if ((p < 0) || ((p == 0) && (__goscript_nat.nat_sticky($.pointerValue<Float>(x).mant, $.uint($.uint64Sub(($.uint($.uint64Mul($.uint($.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat)), 64), 64n), 64)), 1n), 64)) == 0))) {
						// underflow to ±0
						if ($.pointerValue<Float>(x).neg) {
							let z: number = 0
							return [-z, $.int(1, 8)]
						}
						return [0.0, $.int(-1, 8)]
					}
					// otherwise, round up
					// We handle p == 0 explicitly because it's easy and because
					// Float.round doesn't support rounding to 0 bits of precision.
					if (p == 0) {
						if ($.pointerValue<Float>(x).neg) {
							return [-math.SmallestNonzeroFloat32, $.int(-1, 8)]
						}
						return [math.SmallestNonzeroFloat32, $.int(1, 8)]
					}
				}
				// p > 0

				// round
				let r: $.VarRef<Float> = $.varRef($.markAsStructValue(new Float()))
				r.value.prec = $.uint($.uint(p, 32), 32)
				await r.value.Set(x)
				e = $.int(r.value.exp - 1, 32)

				// Rounding may have caused r to overflow to ±Inf
				// (rounding never causes underflows to 0).
				// If the exponent is too large, also overflow to ±Inf.
				if (($.uint(r.value.form, 8) == $.uint(2, 8)) || ($.int(e, 32) > $.int(127, 32))) {
					// overflow
					if ($.pointerValue<Float>(x).neg) {
						return [$.float32(math.Inf(-1)), $.int(-1, 8)]
					}
					return [$.float32(math.Inf(+1)), $.int(1, 8)]
				}
				// e <= emax

				// Determine sign, biased exponent, and mantissa.
				let sign: number = 0
				let bexp: number = 0
				let mant: number = 0
				if ($.pointerValue<Float>(x).neg) {
					sign = $.uint(2147483648, 32)
				}

				// Rounding may have caused a denormal number to
				// become normal. Check again.
				if ($.int(e, 32) < $.int(-126, 32)) {
					// denormal number: recompute precision
					// Since rounding may have at best increased precision
					// and we have eliminated p <= 0 early, we know p > 0.
					// bexp == 0 for denormals
					p = ((23 + 1) - -126) + $.int(e)
					mant = $.uint($.uintShr(msb32((r.value.mant as __goscript_nat.nat)), $.uint(32 - p, 64), 32), 32)
				} else {
					// normal number: emin <= e <= emax
					bexp = $.uint($.uint(e + 127, 32) << 23, 32)
					mant = $.uint(($.uintShr(msb32((r.value.mant as __goscript_nat.nat)), 8, 32)) & ((8388608) - 1), 32)
				}

				return [math.Float32frombits($.uint((sign | bexp) | mant, 32)), $.int(r.value.acc, 8)]
				break
			}
			case 0:
			{
				if ($.pointerValue<Float>(x).neg) {
					let z: number = 0
					return [-z, $.int(0, 8)]
				}
				return [0.0, $.int(0, 8)]
				break
			}
			case 2:
			{
				if ($.pointerValue<Float>(x).neg) {
					return [$.float32(math.Inf(-1)), $.int(0, 8)]
				}
				return [$.float32(math.Inf(+1)), $.int(0, 8)]
				break
			}
		}

		$.panic("unreachable")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Float64(): globalThis.Promise<[number, Accuracy]> {
		const x: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
		}

		switch ($.pointerValue<Float>(x).form) {
			case 1:
			{
				const fbits: number = 64
				const mbits: number = 52
				const ebits: number = 11
				const bias: number = 1023
				const dmin: number = -1074
				const emin: number = -1022
				const emax: number = 1023

				// Float mantissa m is 0.5 <= m < 1.0; compute exponent e for float64 mantissa.
				let e = $.int($.pointerValue<Float>(x).exp - 1, 32)

				// Compute precision p for float64 mantissa.
				// If the exponent is too small, we have a denormal number before
				// rounding and fewer than p mantissa bits of precision available
				// (the exponent remains fixed but the mantissa gets shifted right).
				let p = 52 + 1
				if ($.int(e, 32) < $.int(-1022, 32)) {
					// recompute precision
					p = ((52 + 1) - -1022) + $.int(e)
					// If p == 0, the mantissa of x is shifted so much to the right
					// that its msb falls immediately to the right of the float64
					// mantissa space. In other words, if the smallest denormal is
					// considered "1.0", for p == 0, the mantissa value m is >= 0.5.
					// If m > 0.5, it is rounded up to 1.0; i.e., the smallest denormal.
					// If m == 0.5, it is rounded down to even, i.e., 0.0.
					// If p < 0, the mantissa value m is <= "0.25" which is never rounded up.
					if ((p < 0) || ((p == 0) && (__goscript_nat.nat_sticky($.pointerValue<Float>(x).mant, $.uint($.uint64Sub(($.uint($.uint64Mul($.uint($.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat)), 64), 64n), 64)), 1n), 64)) == 0))) {
						// underflow to ±0
						if ($.pointerValue<Float>(x).neg) {
							let z: number = 0
							return [-z, $.int(1, 8)]
						}
						return [0.0, $.int(-1, 8)]
					}
					// otherwise, round up
					// We handle p == 0 explicitly because it's easy and because
					// Float.round doesn't support rounding to 0 bits of precision.
					if (p == 0) {
						if ($.pointerValue<Float>(x).neg) {
							return [-math.SmallestNonzeroFloat64, $.int(-1, 8)]
						}
						return [math.SmallestNonzeroFloat64, $.int(1, 8)]
					}
				}
				// p > 0

				// round
				let r: $.VarRef<Float> = $.varRef($.markAsStructValue(new Float()))
				r.value.prec = $.uint($.uint(p, 32), 32)
				await r.value.Set(x)
				e = $.int(r.value.exp - 1, 32)

				// Rounding may have caused r to overflow to ±Inf
				// (rounding never causes underflows to 0).
				// If the exponent is too large, also overflow to ±Inf.
				if (($.uint(r.value.form, 8) == $.uint(2, 8)) || ($.int(e, 32) > $.int(1023, 32))) {
					// overflow
					if ($.pointerValue<Float>(x).neg) {
						return [math.Inf(-1), $.int(-1, 8)]
					}
					return [math.Inf(+1), $.int(1, 8)]
				}
				// e <= emax

				// Determine sign, biased exponent, and mantissa.
				let sign: bigint = 0n
				let bexp: bigint = 0n
				let mant: bigint = 0n
				if ($.pointerValue<Float>(x).neg) {
					sign = 9223372036854775808n
				}

				// Rounding may have caused a denormal number to
				// become normal. Check again.
				if ($.int(e, 32) < $.int(-1022, 32)) {
					// denormal number: recompute precision
					// Since rounding may have at best increased precision
					// and we have eliminated p <= 0 early, we know p > 0.
					// bexp == 0 for denormals
					p = ((52 + 1) - -1022) + $.int(e)
					mant = $.uint64Shr(msb64((r.value.mant as __goscript_nat.nat)), $.uint(64 - p, 64))
				} else {
					// normal number: emin <= e <= emax
					bexp = $.uint64Mul(e + 1023, (2 ** 52))
					mant = $.uint64And(($.uint64Shr(msb64((r.value.mant as __goscript_nat.nat)), 11n)), 4503599627370495n)
				}

				return [math.Float64frombits($.uint64Or(($.uint64Or(sign, bexp)), mant)), $.int(r.value.acc, 8)]
				break
			}
			case 0:
			{
				if ($.pointerValue<Float>(x).neg) {
					let z: number = 0
					return [-z, $.int(0, 8)]
				}
				return [0.0, $.int(0, 8)]
				break
			}
			case 2:
			{
				if ($.pointerValue<Float>(x).neg) {
					return [math.Inf(-1), $.int(0, 8)]
				}
				return [math.Inf(+1), $.int(0, 8)]
				break
			}
		}

		$.panic("unreachable")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Format(s: fmt2.State | null, format: number): globalThis.Promise<void> {
		const x: Float | $.VarRef<Float> | null = this
		let [prec, hasPrec] = await $.pointerValue<Exclude<fmt2.State, null>>(s).Precision()
		if (!hasPrec) {
			prec = 6
		}

		switch (format) {
			case 101:
			case 69:
			case 102:
			case 98:
			case 112:
			case 120:
			{
				break
			}
			case 70:
			{
				format = $.int(102, 32)
				break
			}
			case 118:
			{
				format = $.int(103, 32)
			}
			case 103:
			case 71:
			{
				if (!hasPrec) {
					prec = -1
				}
				break
			}
			default:
			{
				await fmt2.Fprintf($.pointerValueOrNil((s as io.Writer | null))!, "%%!%c(*big.Float=%s)", $.basicInterfaceValue(format, "rune", "int32"), await Float.prototype.String.call(x))
				return
				break
			}
		}
		let buf: $.Slice<number> = null! as $.Slice<number>
		buf = await Float.prototype.Append.call(x, buf, $.uint($.uint(format, 8), 8), prec)
		if ($.len(buf) == 0) {
			buf = new Uint8Array([63])
		}

		let sign: string = ""
		switch (true) {
			case $.uint($.arrayIndex(buf!, 0), 8) == $.uint(45, 8):
			{
				sign = "-"
				buf = $.goSlice(buf, 1, undefined)
				break
			}
			case $.uint($.arrayIndex(buf!, 0), 8) == $.uint(43, 8):
			{
				sign = "+"
				if (await $.pointerValue<Exclude<fmt2.State, null>>(s).Flag(32)) {
					sign = " "
				}
				buf = $.goSlice(buf, 1, undefined)
				break
			}
			case await $.pointerValue<Exclude<fmt2.State, null>>(s).Flag(43):
			{
				sign = "+"
				break
			}
			case await $.pointerValue<Exclude<fmt2.State, null>>(s).Flag(32):
			{
				sign = " "
				break
			}
		}

		let padding: number = 0
		{
			let [width, hasWidth] = await $.pointerValue<Exclude<fmt2.State, null>>(s).Width()
			if (hasWidth && (width > ($.len(sign) + $.len(buf)))) {
				padding = (width - $.len(sign)) - $.len(buf)
			}
		}

		switch (true) {
			case await $.pointerValue<Exclude<fmt2.State, null>>(s).Flag(48) && !Float.prototype.IsInf.call(x):
			{
				await __goscript_intconv.writeMultiple(s, sign, 1)
				await __goscript_intconv.writeMultiple(s, "0", padding)
				await $.pointerValue<Exclude<fmt2.State, null>>(s).Write(buf)
				break
			}
			case await $.pointerValue<Exclude<fmt2.State, null>>(s).Flag(45):
			{
				await __goscript_intconv.writeMultiple(s, sign, 1)
				await $.pointerValue<Exclude<fmt2.State, null>>(s).Write(buf)
				await __goscript_intconv.writeMultiple(s, " ", padding)
				break
			}
			default:
			{
				await __goscript_intconv.writeMultiple(s, " ", padding)
				await __goscript_intconv.writeMultiple(s, sign, 1)
				await $.pointerValue<Exclude<fmt2.State, null>>(s).Write(buf)
				break
			}
		}
	}

	public async GobDecode(buf: $.Slice<number>): globalThis.Promise<$.GoError> {
		let z: Float | $.VarRef<Float> | null = this
		if ($.len(buf) == 0) {

			$.assignStruct($.pointerValue<Float>(z), $.markAsStructValue(new Float()))
			return null
		}
		if ($.len(buf) < 6) {
			return errors.New("Float.GobDecode: buffer too small")
		}

		if ($.uint($.arrayIndex(buf!, 0), 8) != $.uint(1, 8)) {
			return fmt2.Errorf("Float.GobDecode: encoding version %d not supported", $.basicInterfaceValue($.arrayIndex(buf!, 0), "byte", "uint8"))
		}

		let oldPrec = $.uint($.pointerValue<Float>(z).prec, 32)
		let oldMode = $.uint($.pointerValue<Float>(z).mode, 8)

		let b = $.uint($.arrayIndex(buf!, 1), 8)
		$.pointerValue<Float>(z).mode = $.uint($.uint(($.uintShr(b, 5, 8)) & 7, 8), 8)
		$.pointerValue<Float>(z).acc = $.int($.int(($.uintShr(b, 3, 8)) & 3, 8) - 1, 8)
		$.pointerValue<Float>(z).form = $.uint($.uint(($.uintShr(b, 1, 8)) & 3, 8), 8)
		$.pointerValue<Float>(z).neg = $.uint((b & 1), 8) != $.uint(0, 8)
		$.pointerValue<Float>(z).prec = $.uint(byteorder.BEUint32($.goSlice(buf, 2, undefined)), 32)

		if ($.uint($.pointerValue<Float>(z).form, 8) == $.uint(1, 8)) {
			if ($.len(buf) < 10) {
				return errors.New("Float.GobDecode: buffer too small for finite form float")
			}
			$.pointerValue<Float>(z).exp = $.int($.int(byteorder.BEUint32($.goSlice(buf, 6, undefined)), 32), 32)
			$.pointerValue<Float>(z).mant = (__goscript_nat.nat_setBytes($.pointerValue<Float>(z).mant, $.goSlice(buf, 10, undefined)) as __goscript_nat.nat)
		}

		if ($.uint(oldPrec, 32) != $.uint(0, 32)) {
			$.pointerValue<Float>(z).mode = $.uint(oldMode, 8)
			await Float.prototype.SetPrec.call(z, $.uint(oldPrec, 64))
		}

		{
			let msg = await Float.prototype.validate0.call(z)
			if (!$.stringEqual(msg, "")) {
				return errors.New("Float.GobDecode: " + msg)
			}
		}

		return null
	}

	public GobEncode(): [$.Slice<number>, $.GoError] {
		const x: Float | $.VarRef<Float> | null = this
		if (x == null) {
			return [null, null]
		}

		let sz = (1 + 1) + 4
		let n = 0
		if ($.uint($.pointerValue<Float>(x).form, 8) == $.uint(1, 8)) {

			n = $.int(Math.trunc(($.pointerValue<Float>(x).prec + (64 - 1)) / 64))

			if ($.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat)) < n) {
				n = $.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat))
			}

			sz = sz + (4 + (n * 8))
		}
		let buf: $.Slice<number> = $.makeSlice<number>(sz, undefined, "byte")

		buf![0] = $.uint(1, 8)
		let b = $.uint((($.uint($.pointerValue<Float>(x).mode & 7, 8) << 5) | ($.uint(($.pointerValue<Float>(x).acc + 1) & 3, 8) << 3)) | ($.uint($.pointerValue<Float>(x).form & 3, 8) << 1), 8)
		if ($.pointerValue<Float>(x).neg) {
			b = b | ($.uint(1, 8))
		}
		buf![1] = $.uint(b, 8)
		byteorder.BEPutUint32($.goSlice(buf, 2, undefined), $.uint($.pointerValue<Float>(x).prec, 32))

		if ($.uint($.pointerValue<Float>(x).form, 8) == $.uint(1, 8)) {
			byteorder.BEPutUint32($.goSlice(buf, 6, undefined), $.uint($.uint($.pointerValue<Float>(x).exp, 32), 32))
			__goscript_nat.nat_bytes($.goSlice($.pointerValue<Float>(x).mant, $.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat)) - n, undefined), $.goSlice(buf, 10, undefined))
		}

		return [buf, null]
	}

	public async Int(z: __goscript_int.Int | $.VarRef<__goscript_int.Int> | null): globalThis.Promise<[__goscript_int.Int | $.VarRef<__goscript_int.Int> | null, Accuracy]> {
		const x: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
		}

		if ((z == null) && ($.uint($.pointerValue<Float>(x).form, 8) <= $.uint(1, 8))) {
			z = new __goscript_int.Int()
		}

		switch ($.pointerValue<Float>(x).form) {
			case 1:
			{
				let acc = $.int(makeAcc($.pointerValue<Float>(x).neg), 8)
				if ($.int($.pointerValue<Float>(x).exp, 32) <= $.int(0, 32)) {
					// 0 < |x| < 1
					return [__goscript_int.Int.prototype.SetInt64.call(z, 0n), $.int(acc, 8)]
				}
				// x.exp > 0

				// 1 <= |x| < +Inf
				// determine minimum required precision for x
				let allBits = $.uint($.uint64Mul($.uint($.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat)), 64), 64n), 64)
				let exp = $.uint($.pointerValue<Float>(x).exp, 64)
				if (Float.prototype.MinPrec.call(x) <= exp) {
					acc = $.int(0, 8)
				}
				// shift mantissa as needed
				if (z == null) {
					z = new __goscript_int.Int()
				}
				$.pointerValue<__goscript_int.Int>(z).neg = $.pointerValue<Float>(x).neg
				switch (true) {
					case exp > allBits:
					{
						$.pointerValue<__goscript_int.Int>(z).abs = (__goscript_nat.nat_lsh($.pointerValue<__goscript_int.Int>(z).abs, ($.pointerValue<Float>(x).mant as __goscript_nat.nat), $.uint($.uint64Sub(exp, allBits), 64)) as __goscript_nat.nat)
						break
					}
					default:
					{
						$.pointerValue<__goscript_int.Int>(z).abs = (__goscript_nat.nat__set($.pointerValue<__goscript_int.Int>(z).abs, ($.pointerValue<Float>(x).mant as __goscript_nat.nat)) as __goscript_nat.nat)
						break
					}
					case exp < allBits:
					{
						$.pointerValue<__goscript_int.Int>(z).abs = (__goscript_nat.nat_rsh($.pointerValue<__goscript_int.Int>(z).abs, ($.pointerValue<Float>(x).mant as __goscript_nat.nat), $.uint($.uint64Sub(allBits, exp), 64)) as __goscript_nat.nat)
						break
					}
				}
				return [z, $.int(acc, 8)]
				break
			}
			case 0:
			{
				return [__goscript_int.Int.prototype.SetInt64.call(z, 0n), $.int(0, 8)]
				break
			}
			case 2:
			{
				return [null, $.int(makeAcc($.pointerValue<Float>(x).neg), 8)]
				break
			}
		}

		$.panic("unreachable")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Int64(): globalThis.Promise<[bigint, Accuracy]> {
		const x: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
		}

		switch ($.pointerValue<Float>(x).form) {
			case 1:
			{
				let acc = $.int(makeAcc($.pointerValue<Float>(x).neg), 8)
				if ($.int($.pointerValue<Float>(x).exp, 32) <= $.int(0, 32)) {
					// 0 < |x| < 1
					return [0n, $.int(acc, 8)]
				}
				// x.exp > 0

				// 1 <= |x| < +Inf
				if ($.int($.pointerValue<Float>(x).exp, 32) <= $.int(63, 32)) {
					// i = trunc(x) fits into an int64 (excluding math.MinInt64)
					let i = $.int64($.uint64Shr(msb64(($.pointerValue<Float>(x).mant as __goscript_nat.nat)), (64 - $.uint($.pointerValue<Float>(x).exp, 32))))
					if ($.pointerValue<Float>(x).neg) {
						i = -i
					}
					if (Float.prototype.MinPrec.call(x) <= $.uint($.pointerValue<Float>(x).exp, 64)) {
						return [i, $.int(0, 8)]
					}
					return [i, $.int(acc, 8)]
				}
				if ($.pointerValue<Float>(x).neg) {
					// check for special case x == math.MinInt64 (i.e., x == -(0.5 << 64))
					if (($.int($.pointerValue<Float>(x).exp, 32) == $.int(64, 32)) && (Float.prototype.MinPrec.call(x) == 1)) {
						acc = $.int(0, 8)
					}
					return [-9223372036854775808n, $.int(acc, 8)]
				}
				// x too large
				return [9223372036854775807n, $.int(-1, 8)]
				break
			}
			case 0:
			{
				return [0n, $.int(0, 8)]
				break
			}
			case 2:
			{
				if ($.pointerValue<Float>(x).neg) {
					return [-9223372036854775808n, $.int(1, 8)]
				}
				return [9223372036854775807n, $.int(-1, 8)]
				break
			}
		}

		$.panic("unreachable")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public IsInf(): boolean {
		const x: Float | $.VarRef<Float> | null = this
		return $.uint($.pointerValue<Float>(x).form, 8) == $.uint(2, 8)
	}

	public async IsInt(): globalThis.Promise<boolean> {
		const x: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
		}
		// special cases
		if ($.uint($.pointerValue<Float>(x).form, 8) != $.uint(1, 8)) {
			return $.uint($.pointerValue<Float>(x).form, 8) == $.uint(0, 8)
		}
		// x.form == finite
		if ($.int($.pointerValue<Float>(x).exp, 32) <= $.int(0, 32)) {
			return false
		}
		// x.exp > 0
		return ($.uint($.pointerValue<Float>(x).prec, 32) <= $.uint($.uint($.pointerValue<Float>(x).exp, 32), 32)) || (Float.prototype.MinPrec.call(x) <= $.uint($.pointerValue<Float>(x).exp, 64))
	}

	public async MantExp(mant: Float | $.VarRef<Float> | null): globalThis.Promise<number> {
		const x: Float | $.VarRef<Float> | null = this
		let exp: number = 0
		if (false) {
			await Float.prototype.validate.call(x)
		}
		if ($.uint($.pointerValue<Float>(x).form, 8) == $.uint(1, 8)) {
			exp = $.int($.pointerValue<Float>(x).exp)
		}
		if (mant != null) {
			await Float.prototype.Copy.call(mant, x)
			if ($.uint($.pointerValue<Float>(mant).form, 8) == $.uint(1, 8)) {
				$.pointerValue<Float>(mant).exp = $.int(0, 32)
			}
		}
		return exp
	}

	public async MarshalText(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const x: Float | $.VarRef<Float> | null = this
		let text: $.Slice<number> = null! as $.Slice<number>
		let err: $.GoError = null! as $.GoError
		return Float.prototype.AppendText.call(x, null)
	}

	public MinPrec(): number {
		const x: Float | $.VarRef<Float> | null = this
		if ($.uint($.pointerValue<Float>(x).form, 8) != $.uint(1, 8)) {
			return 0
		}
		return $.uint($.uint64Sub(($.uint($.uint64Mul($.uint($.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat)), 64), 64n), 64)), __goscript_nat.nat_trailingZeroBits($.pointerValue<Float>(x).mant)), 64)
	}

	public Mode(): RoundingMode {
		const x: Float | $.VarRef<Float> | null = this
		return $.uint($.pointerValue<Float>(x).mode, 8)
	}

	public async Mul(x: Float | $.VarRef<Float> | null, y: Float | $.VarRef<Float> | null): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
			await Float.prototype.validate.call(y)
		}

		if ($.uint($.pointerValue<Float>(z).prec, 32) == $.uint(0, 32)) {
			$.pointerValue<Float>(z).prec = $.uint($.max($.uint($.pointerValue<Float>(x).prec, 32), $.uint($.pointerValue<Float>(y).prec, 32)), 32)
		}

		$.pointerValue<Float>(z).neg = $.pointerValue<Float>(x).neg != $.pointerValue<Float>(y).neg

		if (($.uint($.pointerValue<Float>(x).form, 8) == $.uint(1, 8)) && ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(1, 8))) {
			// x * y (common case)
			await Float.prototype.umul.call(z, x, y)
			return z
		}

		$.pointerValue<Float>(z).acc = $.int(0, 8)
		if ((($.uint($.pointerValue<Float>(x).form, 8) == $.uint(0, 8)) && ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(2, 8))) || (($.uint($.pointerValue<Float>(x).form, 8) == $.uint(2, 8)) && ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(0, 8)))) {
			// ±0 * ±Inf
			// ±Inf * ±0
			// value of z is undefined but make sure it's valid
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			$.pointerValue<Float>(z).neg = false
			$.panic($.interfaceValue<any>($.markAsStructValue(new ErrNaN({msg: "multiplication of zero with infinity"})), "big.ErrNaN", "big.ErrNaN"))
		}

		if (($.uint($.pointerValue<Float>(x).form, 8) == $.uint(2, 8)) || ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(2, 8))) {
			// ±Inf * y
			// x * ±Inf
			$.pointerValue<Float>(z).form = $.uint(2, 8)
			return z
		}

		// ±0 * y
		// x * ±0
		$.pointerValue<Float>(z).form = $.uint(0, 8)
		return z
	}

	public async Neg(x: Float | $.VarRef<Float> | null): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		await Float.prototype.Set.call(z, x)
		$.pointerValue<Float>(z).neg = !$.pointerValue<Float>(z).neg
		return z
	}

	public async Parse(s: string, base: number): globalThis.Promise<[Float | $.VarRef<Float> | null, number, $.GoError]> {
		const z: Float | $.VarRef<Float> | null = this
		let f: Float | $.VarRef<Float> | null = null! as Float | $.VarRef<Float> | null
		let b: number = 0
		let err: $.GoError = null! as $.GoError

		if (($.len(s) == 3) && (($.stringEqual(s, "Inf")) || ($.stringEqual(s, "inf")))) {
			f = Float.prototype.SetInf.call(z, false)
			return [f, b, err]
		}
		if ((($.len(s) == 4) && (($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(43, 8)) || ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(45, 8)))) && (($.stringEqual($.sliceStringOrBytes(s, 1, undefined), "Inf")) || ($.stringEqual($.sliceStringOrBytes(s, 1, undefined), "inf")))) {
			f = Float.prototype.SetInf.call(z, $.uint($.indexStringOrBytes(s, 0), 8) == $.uint(45, 8))
			return [f, b, err]
		}

		let r: strings.Reader | $.VarRef<strings.Reader> | null = strings.NewReader(s)
		{
			let __goscriptTuple0: any = await Float.prototype.scan.call(z, $.interfaceValue<io.ByteScanner | null>(r, "*strings.Reader", { kind: $.TypeKind.Pointer, elemType: "strings.Reader" }), base)
			f = __goscriptTuple0[0]
			b = __goscriptTuple0[1]
			err = __goscriptTuple0[2]
			if (err != null) {
				return [f, b, err]
			}
		}

		{
			let __goscriptTuple1: any = strings.Reader.prototype.ReadByte.call($.pointerValue<strings.Reader>(r))
			let ch = $.uint(__goscriptTuple1[0], 8)
			let err2 = __goscriptTuple1[1]
			if (err2 == null) {
				err = fmt2.Errorf("expected end of string, found %q", $.basicInterfaceValue(ch, "byte", "uint8"))
			} else {
				if (!$.comparableEqual(err2, io.EOF)) {
					err = err2
				}
			}
		}

		return [f, b, err]
	}

	public Prec(): number {
		const x: Float | $.VarRef<Float> | null = this
		return $.uint($.pointerValue<Float>(x).prec, 64)
	}

	public async Quo(x: Float | $.VarRef<Float> | null, y: Float | $.VarRef<Float> | null): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
			await Float.prototype.validate.call(y)
		}

		if ($.uint($.pointerValue<Float>(z).prec, 32) == $.uint(0, 32)) {
			$.pointerValue<Float>(z).prec = $.uint($.max($.uint($.pointerValue<Float>(x).prec, 32), $.uint($.pointerValue<Float>(y).prec, 32)), 32)
		}

		$.pointerValue<Float>(z).neg = $.pointerValue<Float>(x).neg != $.pointerValue<Float>(y).neg

		if (($.uint($.pointerValue<Float>(x).form, 8) == $.uint(1, 8)) && ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(1, 8))) {
			// x / y (common case)
			await Float.prototype.uquo.call(z, x, y)
			return z
		}

		$.pointerValue<Float>(z).acc = $.int(0, 8)
		if ((($.uint($.pointerValue<Float>(x).form, 8) == $.uint(0, 8)) && ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(0, 8))) || (($.uint($.pointerValue<Float>(x).form, 8) == $.uint(2, 8)) && ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(2, 8)))) {
			// ±0 / ±0
			// ±Inf / ±Inf
			// value of z is undefined but make sure it's valid
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			$.pointerValue<Float>(z).neg = false
			$.panic($.interfaceValue<any>($.markAsStructValue(new ErrNaN({msg: "division of zero by zero or infinity by infinity"})), "big.ErrNaN", "big.ErrNaN"))
		}

		if (($.uint($.pointerValue<Float>(x).form, 8) == $.uint(0, 8)) || ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(2, 8))) {
			// ±0 / y
			// x / ±Inf
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			return z
		}

		// x / ±0
		// ±Inf / y
		$.pointerValue<Float>(z).form = $.uint(2, 8)
		return z
	}

	public async Rat(z: __goscript_rat.Rat | $.VarRef<__goscript_rat.Rat> | null): globalThis.Promise<[__goscript_rat.Rat | $.VarRef<__goscript_rat.Rat> | null, Accuracy]> {
		const x: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
		}

		if ((z == null) && ($.uint($.pointerValue<Float>(x).form, 8) <= $.uint(1, 8))) {
			z = new __goscript_rat.Rat()
		}

		switch ($.pointerValue<Float>(x).form) {
			case 1:
			{
				let allBits = $.int(Math.imul($.int($.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat)), 32), 64), 32)
				// build up numerator and denominator
				$.pointerValue<__goscript_rat.Rat>(z).a.neg = $.pointerValue<Float>(x).neg
				switch (true) {
					case $.int($.pointerValue<Float>(x).exp, 32) > $.int(allBits, 32):
					{
						$.pointerValue<__goscript_rat.Rat>(z).a.abs = (__goscript_nat.nat_lsh($.pointerValue<__goscript_rat.Rat>(z).a.abs, ($.pointerValue<Float>(x).mant as __goscript_nat.nat), $.uint($.pointerValue<Float>(x).exp - allBits, 64)) as __goscript_nat.nat)
						$.pointerValue<__goscript_rat.Rat>(z).b.abs = ($.goSlice($.pointerValue<__goscript_rat.Rat>(z).b.abs, undefined, 0) as __goscript_nat.nat)
						break
					}
					default:
					{
						$.pointerValue<__goscript_rat.Rat>(z).a.abs = (__goscript_nat.nat__set($.pointerValue<__goscript_rat.Rat>(z).a.abs, ($.pointerValue<Float>(x).mant as __goscript_nat.nat)) as __goscript_nat.nat)
						$.pointerValue<__goscript_rat.Rat>(z).b.abs = ($.goSlice($.pointerValue<__goscript_rat.Rat>(z).b.abs, undefined, 0) as __goscript_nat.nat)
						break
					}
					case $.int($.pointerValue<Float>(x).exp, 32) < $.int(allBits, 32):
					{
						$.pointerValue<__goscript_rat.Rat>(z).a.abs = (__goscript_nat.nat__set($.pointerValue<__goscript_rat.Rat>(z).a.abs, ($.pointerValue<Float>(x).mant as __goscript_nat.nat)) as __goscript_nat.nat)
						let t: __goscript_nat.nat = (__goscript_nat.nat_setUint64($.pointerValue<__goscript_rat.Rat>(z).b.abs, 1n) as __goscript_nat.nat)
						$.pointerValue<__goscript_rat.Rat>(z).b.abs = (__goscript_nat.nat_lsh(t, (t as __goscript_nat.nat), $.uint(allBits - $.pointerValue<Float>(x).exp, 64)) as __goscript_nat.nat)
						await __goscript_rat.Rat.prototype.norm.call(z)
						break
					}
				}
				return [z, $.int(0, 8)]
				break
			}
			case 0:
			{
				return [__goscript_rat.Rat.prototype.SetInt64.call(z, 0n), $.int(0, 8)]
				break
			}
			case 2:
			{
				return [null, $.int(makeAcc($.pointerValue<Float>(x).neg), 8)]
				break
			}
		}

		$.panic("unreachable")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Scan(s: fmt2.ScanState | null, ch: number): globalThis.Promise<$.GoError> {
		const z: Float | $.VarRef<Float> | null = this
		await $.pointerValue<Exclude<fmt2.ScanState, null>>(s).SkipSpace()
		let [, , err] = await Float.prototype.scan.call(z, $.interfaceValue<io.ByteScanner | null>($.markAsStructValue(new __goscript_intconv.byteReader({ScanState: s})), "big.byteReader", "big.byteReader"), 0)
		return err
	}

	public async Set(x: Float | $.VarRef<Float> | null): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
		}
		$.pointerValue<Float>(z).acc = $.int(0, 8)
		if (!$.pointerEqual(z, x)) {
			$.pointerValue<Float>(z).form = $.uint($.pointerValue<Float>(x).form, 8)
			$.pointerValue<Float>(z).neg = $.pointerValue<Float>(x).neg
			if ($.uint($.pointerValue<Float>(x).form, 8) == $.uint(1, 8)) {
				$.pointerValue<Float>(z).exp = $.int($.pointerValue<Float>(x).exp, 32)
				$.pointerValue<Float>(z).mant = (__goscript_nat.nat__set($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(x).mant as __goscript_nat.nat)) as __goscript_nat.nat)
			}
			if ($.uint($.pointerValue<Float>(z).prec, 32) == $.uint(0, 32)) {
				$.pointerValue<Float>(z).prec = $.uint($.pointerValue<Float>(x).prec, 32)
			} else {
				if ($.uint($.pointerValue<Float>(z).prec, 32) < $.uint($.pointerValue<Float>(x).prec, 32)) {
					await Float.prototype.round.call(z, 0)
				}
			}
		}
		return z
	}

	public async SetFloat64(x: number): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		if ($.uint($.pointerValue<Float>(z).prec, 32) == $.uint(0, 32)) {
			$.pointerValue<Float>(z).prec = $.uint(53, 32)
		}
		if (math.IsNaN(x)) {
			$.panic($.interfaceValue<any>($.markAsStructValue(new ErrNaN({msg: "Float.SetFloat64(NaN)"})), "big.ErrNaN", "big.ErrNaN"))
		}
		$.pointerValue<Float>(z).acc = $.int(0, 8)
		$.pointerValue<Float>(z).neg = math.Signbit(x)
		if (x == 0) {
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			return z
		}
		if (math.IsInf(x, 0)) {
			$.pointerValue<Float>(z).form = $.uint(2, 8)
			return z
		}
		// normalized x != 0
		$.pointerValue<Float>(z).form = $.uint(1, 8)
		let [fmant, exp] = math.Frexp(x)
		$.pointerValue<Float>(z).mant = (__goscript_nat.nat_setUint64($.pointerValue<Float>(z).mant, $.uint64Or(9223372036854775808n, ($.uint64Shl(math.Float64bits(fmant), 11n)))) as __goscript_nat.nat)
		$.pointerValue<Float>(z).exp = $.int($.int(exp, 32), 32)
		if ($.uint($.pointerValue<Float>(z).prec, 32) < $.uint(53, 32)) {
			await Float.prototype.round.call(z, 0)
		}
		return z
	}

	public SetInf(signbit: boolean): Float | $.VarRef<Float> | null {
		let z: Float | $.VarRef<Float> | null = this
		$.pointerValue<Float>(z).acc = $.int(0, 8)
		$.pointerValue<Float>(z).form = $.uint(2, 8)
		$.pointerValue<Float>(z).neg = signbit
		return z
	}

	public async SetInt(x: __goscript_int.Int | $.VarRef<__goscript_int.Int> | null): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		// TODO(gri) can be more efficient if z.prec > 0
		// but small compared to the size of x, or if there
		// are many trailing 0's.
		let __goscriptShadow0 = $.uint($.uint(__goscript_int.Int.prototype.BitLen.call(x), 32), 32)
		if ($.uint($.pointerValue<Float>(z).prec, 32) == $.uint(0, 32)) {
			$.pointerValue<Float>(z).prec = $.uint($.max($.uint(__goscriptShadow0, 32), $.uint(64, 32)), 32)
		}
		$.pointerValue<Float>(z).acc = $.int(0, 8)
		$.pointerValue<Float>(z).neg = $.pointerValue<__goscript_int.Int>(x).neg
		if ($.len(($.pointerValue<__goscript_int.Int>(x).abs as __goscript_nat.nat)) == 0) {
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			return z
		}
		// x != 0
		$.pointerValue<Float>(z).mant = (__goscript_nat.nat__set($.pointerValue<Float>(z).mant, ($.pointerValue<__goscript_int.Int>(x).abs as __goscript_nat.nat)) as __goscript_nat.nat)
		fnorm(($.pointerValue<Float>(z).mant as __goscript_nat.nat))
		await Float.prototype.setExpAndRound.call(z, $.int64(__goscriptShadow0), 0)
		return z
	}

	public async SetInt64(x: bigint): globalThis.Promise<Float | $.VarRef<Float> | null> {
		const z: Float | $.VarRef<Float> | null = this
		let u = x
		if (u < 0n) {
			u = -u
		}
		// We cannot simply call z.SetUint64(uint64(u)) and change
		// the sign afterwards because the sign affects rounding.
		return Float.prototype.setBits64.call(z, x < 0n, $.uint64(u))
	}

	public async SetMantExp(mant: Float | $.VarRef<Float> | null, exp: number): globalThis.Promise<Float | $.VarRef<Float> | null> {
		const z: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(z)
			await Float.prototype.validate.call(mant)
		}
		await Float.prototype.Copy.call(z, mant)

		if ($.uint($.pointerValue<Float>(z).form, 8) == $.uint(1, 8)) {
			// 0 < |mant| < +Inf
			await Float.prototype.setExpAndRound.call(z, $.int64Add($.int64($.pointerValue<Float>(z).exp), $.int64(exp)), 0)
		}
		return z
	}

	public SetMode(mode: RoundingMode): Float | $.VarRef<Float> | null {
		let z: Float | $.VarRef<Float> | null = this
		$.pointerValue<Float>(z).mode = $.uint(mode, 8)
		$.pointerValue<Float>(z).acc = $.int(0, 8)
		return z
	}

	public async SetPrec(prec: number): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		$.pointerValue<Float>(z).acc = $.int(0, 8)

		// special case
		if (prec == 0) {
			$.pointerValue<Float>(z).prec = $.uint(0, 32)
			if ($.uint($.pointerValue<Float>(z).form, 8) == $.uint(1, 8)) {
				// truncate z to 0
				$.pointerValue<Float>(z).acc = $.int(makeAcc($.pointerValue<Float>(z).neg), 8)
				$.pointerValue<Float>(z).form = $.uint(0, 8)
			}
			return z
		}

		// general case
		if (prec > 4294967295) {
			prec = 4294967295
		}
		let old = $.uint($.pointerValue<Float>(z).prec, 32)
		$.pointerValue<Float>(z).prec = $.uint($.uint(prec, 32), 32)
		if ($.uint($.pointerValue<Float>(z).prec, 32) < $.uint(old, 32)) {
			await Float.prototype.round.call(z, 0)
		}
		return z
	}

	public async SetRat(x: __goscript_rat.Rat | $.VarRef<__goscript_rat.Rat> | null): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		if (__goscript_rat.Rat.prototype.IsInt.call(x)) {
			return Float.prototype.SetInt.call(z, __goscript_rat.Rat.prototype.Num.call(x))
		}
		let a: $.VarRef<Float> = $.varRef($.markAsStructValue(new Float()))
		let b: $.VarRef<Float> = $.varRef($.markAsStructValue(new Float()))
		await a.value.SetInt(__goscript_rat.Rat.prototype.Num.call(x))
		await b.value.SetInt(__goscript_rat.Rat.prototype.Denom.call(x))
		if ($.uint($.pointerValue<Float>(z).prec, 32) == $.uint(0, 32)) {
			$.pointerValue<Float>(z).prec = $.uint($.max($.uint(a.value.prec, 32), $.uint(b.value.prec, 32)), 32)
		}
		return Float.prototype.Quo.call(z, a, b)
	}

	public async SetString(s: string): globalThis.Promise<[Float | $.VarRef<Float> | null, boolean]> {
		const z: Float | $.VarRef<Float> | null = this
		{
			let __goscriptTuple2: any = await Float.prototype.Parse.call(z, s, 0)
			let f: Float | $.VarRef<Float> | null = __goscriptTuple2[0]
			let err = __goscriptTuple2[2]
			if (err == null) {
				return [f, true]
			}
		}
		return [null, false]
	}

	public async SetUint64(x: bigint): globalThis.Promise<Float | $.VarRef<Float> | null> {
		const z: Float | $.VarRef<Float> | null = this
		return Float.prototype.setBits64.call(z, false, x)
	}

	public async Sign(): globalThis.Promise<number> {
		const x: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
		}
		if ($.uint($.pointerValue<Float>(x).form, 8) == $.uint(0, 8)) {
			return 0
		}
		if ($.pointerValue<Float>(x).neg) {
			return -1
		}
		return 1
	}

	public Signbit(): boolean {
		const x: Float | $.VarRef<Float> | null = this
		return $.pointerValue<Float>(x).neg
	}

	public async Sqrt(x: Float | $.VarRef<Float> | null): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
		}

		if ($.uint($.pointerValue<Float>(z).prec, 32) == $.uint(0, 32)) {
			$.pointerValue<Float>(z).prec = $.uint($.pointerValue<Float>(x).prec, 32)
		}

		if (await Float.prototype.Sign.call(x) == -1) {

			$.panic($.interfaceValue<any>($.markAsStructValue(new ErrNaN({msg: "square root of negative operand"})), "big.ErrNaN", "big.ErrNaN"))
		}

		if ($.uint($.pointerValue<Float>(x).form, 8) != $.uint(1, 8)) {
			$.pointerValue<Float>(z).acc = $.int(0, 8)
			$.pointerValue<Float>(z).form = $.uint($.pointerValue<Float>(x).form, 8)
			$.pointerValue<Float>(z).neg = $.pointerValue<Float>(x).neg
			return z
		}

		let prec = $.uint($.pointerValue<Float>(z).prec, 32)
		let b = await Float.prototype.MantExp.call(x, z)
		$.pointerValue<Float>(z).prec = $.uint(prec, 32)

		switch (b % 2) {
			case 0:
			{
				break
			}
			case 1:
			{
				$.pointerValue<Float>(z).exp++
				break
			}
			case -1:
			{
				$.pointerValue<Float>(z).exp--
				break
			}
		}

		// An ErrNaN panic is raised by a [Float] operation that would lead to
		// a NaN under IEEE 754 rules. An ErrNaN implements the error interface.

		await Float.prototype.sqrtInverse.call(z, z)

		return Float.prototype.SetMantExp.call(z, z, Math.trunc(b / 2))
	}

	public async String(): globalThis.Promise<string> {
		const x: Float | $.VarRef<Float> | null = this
		return Float.prototype.Text.call(x, $.uint(103, 8), 10)
	}

	public async Sub(x: Float | $.VarRef<Float> | null, y: Float | $.VarRef<Float> | null): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
			await Float.prototype.validate.call(y)
		}

		if ($.uint($.pointerValue<Float>(z).prec, 32) == $.uint(0, 32)) {
			$.pointerValue<Float>(z).prec = $.uint($.max($.uint($.pointerValue<Float>(x).prec, 32), $.uint($.pointerValue<Float>(y).prec, 32)), 32)
		}

		if (($.uint($.pointerValue<Float>(x).form, 8) == $.uint(1, 8)) && ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(1, 8))) {
			// x - y (common case)
			let yneg = $.pointerValue<Float>(y).neg
			$.pointerValue<Float>(z).neg = $.pointerValue<Float>(x).neg
			if ($.pointerValue<Float>(x).neg != yneg) {
				// x - (-y) == x + y
				// (-x) - y == -(x + y)
				await Float.prototype.uadd.call(z, x, y)
			} else {
				// x - y == x - y == -(y - x)
				// (-x) - (-y) == y - x == -(x - y)
				if (Float.prototype.ucmp.call(x, y) > 0) {
					await Float.prototype.usub.call(z, x, y)
				} else {
					$.pointerValue<Float>(z).neg = !$.pointerValue<Float>(z).neg
					await Float.prototype.usub.call(z, y, x)
				}
			}
			if ((($.uint($.pointerValue<Float>(z).form, 8) == $.uint(0, 8)) && ($.uint($.pointerValue<Float>(z).mode, 8) == $.uint(4, 8))) && ($.int($.pointerValue<Float>(z).acc, 8) == $.int(0, 8))) {
				$.pointerValue<Float>(z).neg = true
			}
			return z
		}

		if ((($.uint($.pointerValue<Float>(x).form, 8) == $.uint(2, 8)) && ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(2, 8))) && ($.pointerValue<Float>(x).neg == $.pointerValue<Float>(y).neg)) {
			// +Inf - +Inf
			// -Inf - -Inf
			// value of z is undefined but make sure it's valid
			$.pointerValue<Float>(z).acc = $.int(0, 8)
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			$.pointerValue<Float>(z).neg = false
			$.panic($.interfaceValue<any>($.markAsStructValue(new ErrNaN({msg: "subtraction of infinities with equal signs"})), "big.ErrNaN", "big.ErrNaN"))
		}

		if (($.uint($.pointerValue<Float>(x).form, 8) == $.uint(0, 8)) && ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(0, 8))) {
			// ±0 - ±0
			$.pointerValue<Float>(z).acc = $.int(0, 8)
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			$.pointerValue<Float>(z).neg = $.pointerValue<Float>(x).neg && !$.pointerValue<Float>(y).neg
			return z
		}

		if (($.uint($.pointerValue<Float>(x).form, 8) == $.uint(2, 8)) || ($.uint($.pointerValue<Float>(y).form, 8) == $.uint(0, 8))) {
			// ±Inf - y
			// x - ±0
			return Float.prototype.Set.call(z, x)
		}

		// ±0 - y
		// x - ±Inf
		return Float.prototype.Neg.call(z, y)
	}

	public async Text(format: number, prec: number): globalThis.Promise<string> {
		const x: Float | $.VarRef<Float> | null = this
		let cap = 10
		if (prec > 0) {
			cap = cap + (prec)
		}
		return $.bytesToString(await Float.prototype.Append.call(x, $.makeSlice<number>(0, cap, "byte"), $.uint(format, 8), prec))
	}

	public async Uint64(): globalThis.Promise<[bigint, Accuracy]> {
		const x: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(x)
		}

		switch ($.pointerValue<Float>(x).form) {
			case 1:
			{
				if ($.pointerValue<Float>(x).neg) {
					return [0n, $.int(1, 8)]
				}
				// 0 < x < +Inf
				if ($.int($.pointerValue<Float>(x).exp, 32) <= $.int(0, 32)) {
					// 0 < x < 1
					return [0n, $.int(-1, 8)]
				}
				// 1 <= x < Inf
				if ($.int($.pointerValue<Float>(x).exp, 32) <= $.int(64, 32)) {
					// u = trunc(x) fits into a uint64
					let u = $.uint64Shr(msb64(($.pointerValue<Float>(x).mant as __goscript_nat.nat)), (64 - $.uint($.pointerValue<Float>(x).exp, 32)))
					if (Float.prototype.MinPrec.call(x) <= 64) {
						return [u, $.int(0, 8)]
					}
					return [u, $.int(-1, 8)]
				}
				// x too large
				return [18446744073709551615n, $.int(-1, 8)]
				break
			}
			case 0:
			{
				return [0n, $.int(0, 8)]
				break
			}
			case 2:
			{
				if ($.pointerValue<Float>(x).neg) {
					return [0n, $.int(1, 8)]
				}
				return [18446744073709551615n, $.int(-1, 8)]
				break
			}
		}

		$.panic("unreachable")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async UnmarshalText(text: $.Slice<number>): globalThis.Promise<$.GoError> {
		const z: Float | $.VarRef<Float> | null = this

		let [, , err] = await Float.prototype.Parse.call(z, $.bytesToString(text), 0)
		if (err != null) {
			err = fmt2.Errorf("math/big: cannot unmarshal %q into a *big.Float (%v)", $.interfaceValue<any>(text, "[]byte", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }), (err as any))
		}
		return err
	}

	public async fmtB(buf: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const x: Float | $.VarRef<Float> | null = this
		if ($.uint($.pointerValue<Float>(x).form, 8) == $.uint(0, 8)) {
			return $.append(buf, $.uint(48, 8), $.byteSliceHint)
		}

		if (false && ($.uint($.pointerValue<Float>(x).form, 8) != $.uint(1, 8))) {
			$.panic("non-finite float")
		}

		// 0 < |mant| < +Inf

		let m: __goscript_nat.nat = ($.pointerValue<Float>(x).mant as __goscript_nat.nat)
		{
			let w = $.uint(Math.imul($.uint($.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat)), 32), 64) >>> 0, 32)
			switch (true) {
				case $.uint(w, 32) < $.uint($.pointerValue<Float>(x).prec, 32):
				{
					m = (__goscript_nat.nat_lsh((null as __goscript_nat.nat), (m as __goscript_nat.nat), $.uint($.pointerValue<Float>(x).prec - w, 64)) as __goscript_nat.nat)
					break
				}
				case $.uint(w, 32) > $.uint($.pointerValue<Float>(x).prec, 32):
				{
					m = (__goscript_nat.nat_rsh((null as __goscript_nat.nat), (m as __goscript_nat.nat), $.uint(w - $.pointerValue<Float>(x).prec, 64)) as __goscript_nat.nat)
					break
				}
			}
		}

		buf = $.appendSlice(buf, await __goscript_natconv.nat_utoa(m, 10), $.byteSliceHint)
		buf = $.append(buf, $.uint(112, 8), $.byteSliceHint)
		let e = $.int64Sub($.int64($.pointerValue<Float>(x).exp), $.int64($.pointerValue<Float>(x).prec))
		if (e >= 0n) {
			buf = $.append(buf, $.uint(43, 8), $.byteSliceHint)
		}
		return strconv.AppendInt(buf, e, 10)
	}

	public async fmtP(buf: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const x: Float | $.VarRef<Float> | null = this
		if ($.uint($.pointerValue<Float>(x).form, 8) == $.uint(0, 8)) {
			return $.append(buf, $.uint(48, 8), $.byteSliceHint)
		}

		if (false && ($.uint($.pointerValue<Float>(x).form, 8) != $.uint(1, 8))) {
			$.panic("non-finite float")
		}

		let m: __goscript_nat.nat = ($.pointerValue<Float>(x).mant as __goscript_nat.nat)
		let i = 0
		while ((i < $.len((m as __goscript_nat.nat))) && ($.arrayIndex(m!, i) == 0)) {
			i++
		}
		m = ($.goSlice(m, i, undefined) as __goscript_nat.nat)

		buf = $.appendSlice(buf, $.stringToBytes("0x."), $.byteSliceHint)
		buf = $.appendSlice(buf, bytes.TrimRight(await __goscript_natconv.nat_utoa(m, 16), "0"), $.byteSliceHint)
		buf = $.append(buf, $.uint(112, 8), $.byteSliceHint)
		if ($.int($.pointerValue<Float>(x).exp, 32) >= $.int(0, 32)) {
			buf = $.append(buf, $.uint(43, 8), $.byteSliceHint)
		}
		return strconv.AppendInt(buf, $.int64($.pointerValue<Float>(x).exp), 10)
	}

	public async fmtX(buf: $.Slice<number>, prec: number): globalThis.Promise<$.Slice<number>> {
		let x: Float | $.VarRef<Float> | null = this
		if ($.uint($.pointerValue<Float>(x).form, 8) == $.uint(0, 8)) {
			buf = $.appendSlice(buf, $.stringToBytes("0x0"), $.byteSliceHint)
			if (prec > 0) {
				buf = $.append(buf, $.uint(46, 8), $.byteSliceHint)
				for (let i = 0; i < prec; i++) {
					buf = $.append(buf, $.uint(48, 8), $.byteSliceHint)
				}
			}
			buf = $.appendSlice(buf, $.stringToBytes("p+00"), $.byteSliceHint)
			return buf
		}
		// avoid performance bugs
		if (false && ($.uint($.pointerValue<Float>(x).form, 8) != $.uint(1, 8))) {
			$.panic("non-finite float")
		}

		let n: number = 0
		if (prec < 0) {
			n = $.uint($.uint64Add(1n, ($.uint($.uint64Mul(($.uint($.uint64Div(($.uint($.uint64Add(($.uint($.uint64Sub(Float.prototype.MinPrec.call(x), 1n), 64)), 3n), 64)), 4n), 64)), 4n), 64))), 64)
		} else {
			n = $.uint($.uint64Add(1n, ($.uint($.uint64Mul(4n, $.uint(prec, 64)), 64))), 64)
		}

		x = await Float.prototype.Set.call(Float.prototype.SetMode.call(await Float.prototype.SetPrec.call(new Float(), n), $.uint($.pointerValue<Float>(x).mode, 8)), x)

		let m: __goscript_nat.nat = ($.pointerValue<Float>(x).mant as __goscript_nat.nat)
		{
			let w = $.uint($.uint64Mul($.uint($.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat)), 64), 64n), 64)
			switch (true) {
				case w < n:
				{
					m = (__goscript_nat.nat_lsh((null as __goscript_nat.nat), (m as __goscript_nat.nat), $.uint($.uint64Sub(n, w), 64)) as __goscript_nat.nat)
					break
				}
				case w > n:
				{
					m = (__goscript_nat.nat_rsh((null as __goscript_nat.nat), (m as __goscript_nat.nat), $.uint($.uint64Sub(w, n), 64)) as __goscript_nat.nat)
					break
				}
			}
		}
		let exp64 = $.int64Sub($.int64($.pointerValue<Float>(x).exp), 1n)

		let hm: $.Slice<number> = await __goscript_natconv.nat_utoa(m, 16)
		if (false && ($.uint($.arrayIndex(hm!, 0), 8) != $.uint(49, 8))) {
			$.panic("incorrect mantissa: " + $.bytesToString(hm))
		}
		buf = $.appendSlice(buf, $.stringToBytes("0x1"), $.byteSliceHint)
		if ($.len(hm) > 1) {
			buf = $.append(buf, $.uint(46, 8), $.byteSliceHint)
			buf = $.appendSlice(buf, $.goSlice(hm, 1, undefined), $.byteSliceHint)
		}

		buf = $.append(buf, $.uint(112, 8), $.byteSliceHint)
		if (exp64 >= 0n) {
			buf = $.append(buf, $.uint(43, 8), $.byteSliceHint)
		} else {
			exp64 = -exp64
			buf = $.append(buf, $.uint(45, 8), $.byteSliceHint)
		}

		if (exp64 < 10n) {
			buf = $.append(buf, $.uint(48, 8), $.byteSliceHint)
		}
		return strconv.AppendInt(buf, exp64, 10)
	}

	public ord(): number {
		const x: Float | $.VarRef<Float> | null = this
		let m: number = 0
		switch ($.pointerValue<Float>(x).form) {
			case 1:
			{
				m = 1
				break
			}
			case 0:
			{
				return 0
				break
			}
			case 2:
			{
				m = 2
				break
			}
		}
		if ($.pointerValue<Float>(x).neg) {
			m = -m
		}
		return m
	}

	public async pow5(n: bigint): globalThis.Promise<Float | $.VarRef<Float> | null> {
		const z: Float | $.VarRef<Float> | null = this
		const m: bigint = 27n
		if (n <= 27n) {
			return Float.prototype.SetUint64.call(z, $.arrayIndex(__goscript_floatconv.pow5tab, Number(n)))
		}

		await Float.prototype.SetUint64.call(z, $.arrayIndex(__goscript_floatconv.pow5tab, Number(27n)))
		n = $.uint64Sub(n, 27n)

		let f: Float | $.VarRef<Float> | null = await Float.prototype.SetUint64.call(await Float.prototype.SetPrec.call(new Float(), $.uint($.uint64Add(Float.prototype.Prec.call(z), 64n), 64)), 5n)

		while (n > 0n) {
			if (($.uint64And(n, 1n)) != 0n) {
				await Float.prototype.Mul.call(z, z, f)
			}
			await Float.prototype.Mul.call(f, f, f)
			n = $.uint64Shr(n, 1n)
		}

		return z
	}

	public async round(sbit: number): globalThis.Promise<void> {
		let z: Float | $.VarRef<Float> | null = this
		if (false) {
			await Float.prototype.validate.call(z)
		}

		$.pointerValue<Float>(z).acc = $.int(0, 8)
		if ($.uint($.pointerValue<Float>(z).form, 8) != $.uint(1, 8)) {
			// ±0 or ±Inf => nothing left to do
			return
		}
		// z.form == finite && len(z.mant) > 0
		// m > 0 implies z.prec > 0 (checked by validate)

		let m = $.uint($.uint($.len(($.pointerValue<Float>(z).mant as __goscript_nat.nat)), 32), 32)
		let __goscriptShadow1 = $.uint(Math.imul(m, 64) >>> 0, 32)
		if ($.uint(__goscriptShadow1, 32) <= $.uint($.pointerValue<Float>(z).prec, 32)) {
			// mantissa fits => nothing to do
			return
		}
		// bits > z.prec

		// Rounding is based on two bits: the rounding bit (rbit) and the
		// sticky bit (sbit). The rbit is the bit immediately before the
		// z.prec leading mantissa bits (the "0.5"). The sbit is set if any
		// of the bits before the rbit are set (the "0.25", "0.125", etc.):
		//
		//   rbit  sbit  => "fractional part"
		//
		//   0     0        == 0
		//   0     1        >  0  , < 0.5
		//   1     0        == 0.5
		//   1     1        >  0.5, < 1.0

		// bits > z.prec: mantissa too large => round
		let r = $.uint((__goscriptShadow1 - $.pointerValue<Float>(z).prec) - 1, 64)
		let rbit = $.uint($.uint64And(__goscript_nat.nat_bit($.pointerValue<Float>(z).mant, r), 1n), 64)
		// The sticky bit is only needed for rounding ToNearestEven
		// or when the rounding bit is zero. Avoid computation otherwise.
		if ((sbit == 0) && ((rbit == 0) || ($.uint($.pointerValue<Float>(z).mode, 8) == $.uint(0, 8)))) {
			sbit = __goscript_nat.nat_sticky($.pointerValue<Float>(z).mant, r)
		}
		sbit = $.uint($.uint64And(sbit, 1), 64)

		// cut off extra words
		let n = $.uint(Math.trunc(($.pointerValue<Float>(z).prec + (64 - 1)) / 64), 32)
		if ($.uint(m, 32) > $.uint(n, 32)) {
			$.copy(($.pointerValue<Float>(z).mant as __goscript_nat.nat), ($.goSlice($.pointerValue<Float>(z).mant, m - n, undefined) as __goscript_nat.nat))
			$.pointerValue<Float>(z).mant = ($.goSlice($.pointerValue<Float>(z).mant, undefined, n) as __goscript_nat.nat)
		}

		// determine number of trailing zero bits (ntz) and compute lsb mask of mantissa's least-significant word
		let ntz = $.uint((Math.imul(n, 64) >>> 0) - $.pointerValue<Float>(z).prec, 32)
		let lsb = $.uint($.uint64Shl(1n, ntz), 64)

		// round if result is inexact
		if (($.uint($.uint64Or(rbit, sbit), 64)) != 0) {
			// Make rounding decision: The result mantissa is truncated ("rounded down")
			// by default. Decide if we need to increment, or "round up", the (unsigned)
			// mantissa.
			let inc = false
			switch ($.pointerValue<Float>(z).mode) {
				case 4:
				{
					inc = $.pointerValue<Float>(z).neg
					break
				}
				case 2:
				{
					break
				}
				case 0:
				{
					inc = (rbit != 0) && ((sbit != 0) || (($.uint($.uint64And($.arrayIndex($.pointerValue<Float>(z).mant!, 0), lsb), 64)) != 0))
					break
				}
				case 1:
				{
					inc = rbit != 0
					break
				}
				case 3:
				{
					inc = true
					break
				}
				case 5:
				{
					inc = !$.pointerValue<Float>(z).neg
					break
				}
				default:
				{
					$.panic("unreachable")
					break
				}
			}

			// A positive result (!z.neg) is Above the exact result if we increment,
			// and it's Below if we truncate (Exact results require no rounding).
			// For a negative result (z.neg) it is exactly the opposite.
			$.pointerValue<Float>(z).acc = $.int(makeAcc(inc != $.pointerValue<Float>(z).neg), 8)

			if (inc) {
				// add 1 to mantissa
				if (__goscript_arith.addVW($.pointerValue<Float>(z).mant, $.pointerValue<Float>(z).mant, lsb) != 0) {
					// mantissa overflow => adjust exponent
					if ($.int($.pointerValue<Float>(z).exp, 32) >= $.int(2147483647, 32)) {
						// exponent overflow
						$.pointerValue<Float>(z).form = $.uint(2, 8)
						return
					}
					$.pointerValue<Float>(z).exp++
					// adjust mantissa: divide by 2 to compensate for exponent adjustment
					__goscript_arith_decl.rshVU($.pointerValue<Float>(z).mant, $.pointerValue<Float>(z).mant, 1)
					// set msb == carry == 1 from the mantissa overflow above
					const msb: number = 9223372036854775808
					$.pointerValue<Float>(z).mant![n - 1] = $.uint($.uint64Or($.pointerValue<Float>(z).mant![n - 1], $.uint("9223372036854775808", 64)), 64)
				}
			}
		}

		// zero out trailing bits in least-significant word
		$.pointerValue<Float>(z).mant![0] = $.uint($.uint64AndNot($.pointerValue<Float>(z).mant![0], $.uint($.uint64Sub(lsb, 1n), 64)), 64)

		if (false) {
			await Float.prototype.validate.call(z)
		}
	}

	public async scan(r: io.ByteScanner | null, base: number): globalThis.Promise<[Float | $.VarRef<Float> | null, number, $.GoError]> {
		let z: Float | $.VarRef<Float> | null = this
		let f: Float | $.VarRef<Float> | null = null! as Float | $.VarRef<Float> | null
		let b: number = 0
		let err: $.GoError = null! as $.GoError
		let prec = $.uint($.pointerValue<Float>(z).prec, 32)
		if ($.uint(prec, 32) == $.uint(0, 32)) {
			prec = $.uint(64, 32)
		}

		$.pointerValue<Float>(z).form = $.uint(0, 8)

		let __goscriptTuple3: any = await __goscript_intconv.scanSign(r)
		$.pointerValue<Float>(z).neg = __goscriptTuple3[0]
		err = __goscriptTuple3[1]
		if (err != null) {
			return [f, b, err]
		}

		let fcount: number = 0
		let __goscriptTuple4: any = await __goscript_natconv.nat_scan($.pointerValue<Float>(z).mant, r, base, true)
		$.pointerValue<Float>(z).mant = (__goscriptTuple4[0] as __goscript_nat.nat)
		b = __goscriptTuple4[1]
		fcount = __goscriptTuple4[2]
		err = __goscriptTuple4[3]
		if (err != null) {
			return [f, b, err]
		}

		let exp: bigint = 0n
		let ebase: number = 0
		let __goscriptTuple5: any = await __goscript_ratconv.scanExponent(r, true, base == 0)
		exp = __goscriptTuple5[0]
		ebase = __goscriptTuple5[1]
		err = __goscriptTuple5[2]
		if (err != null) {
			return [f, b, err]
		}

		if ($.len(($.pointerValue<Float>(z).mant as __goscript_nat.nat)) == 0) {
			$.pointerValue<Float>(z).prec = $.uint(prec, 32)
			$.pointerValue<Float>(z).acc = $.int(0, 8)
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			f = z
			return [f, b, err]
		}

		// An ErrNaN panic is raised by a [Float] operation that would lead to
		// a NaN under IEEE 754 rules. An ErrNaN implements the error interface.

		let exp2 = $.int64Sub(($.int64Mul($.int64($.len(($.pointerValue<Float>(z).mant as __goscript_nat.nat))), 64n)), fnorm(($.pointerValue<Float>(z).mant as __goscript_nat.nat)))
		let exp5 = 0n

		if (fcount < 0) {

			let d = $.int64(fcount)
			switch (b) {
				case 10:
				{
					exp5 = d
				}
				case 2:
				{
					exp2 = $.int64Add(exp2, d)
					break
				}
				case 8:
				{
					exp2 = $.int64Add(exp2, $.int64Mul(d, 3n))
					break
				}
				case 16:
				{
					exp2 = $.int64Add(exp2, $.int64Mul(d, 4n))
					break
				}
				default:
				{
					$.panic("unexpected mantissa base")
					break
				}
			}
		}

		switch (ebase) {
			case 10:
			{
				exp5 = $.int64Add(exp5, exp)
			}
			case 2:
			{
				exp2 = $.int64Add(exp2, exp)
				break
			}
			default:
			{
				$.panic("unexpected exponent base")
				break
			}
		}

		// The form value order is relevant - do not change!
		if ((-2147483648n <= exp2) && (exp2 <= 2147483647n)) {
			$.pointerValue<Float>(z).prec = $.uint(prec, 32)
			$.pointerValue<Float>(z).form = $.uint(1, 8)
			$.pointerValue<Float>(z).exp = $.int($.int(exp2, 32), 32)
			f = z
		} else {
			err = fmt2.Errorf("exponent overflow")
			return [f, b, err]
		}

		if (exp5 == 0n) {
			// These constants define supported rounding modes.
			await Float.prototype.round.call(z, 0)
			return [f, b, err]
		}
		// == IEEE 754-2008 roundTowardZero
		// no IEEE 754-2008 equivalent
		// == IEEE 754-2008 roundTowardNegative
		let p: Float | $.VarRef<Float> | null = await Float.prototype.SetPrec.call(new Float(), $.uint($.uint64Add(Float.prototype.Prec.call(z), 64n), 64))
		if (exp5 < 0n) {
			await Float.prototype.Quo.call(z, z, await Float.prototype.pow5.call(p, $.uint64(-exp5)))
		} else {
			await Float.prototype.Mul.call(z, z, await Float.prototype.pow5.call(p, $.uint64(exp5)))
		}

		return [f, b, err]
	}

	public async setBits64(neg: boolean, x: bigint): globalThis.Promise<Float | $.VarRef<Float> | null> {
		let z: Float | $.VarRef<Float> | null = this
		if ($.uint($.pointerValue<Float>(z).prec, 32) == $.uint(0, 32)) {
			$.pointerValue<Float>(z).prec = $.uint(64, 32)
		}
		$.pointerValue<Float>(z).acc = $.int(0, 8)
		$.pointerValue<Float>(z).neg = neg
		if (x == 0n) {
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			return z
		}
		// x != 0
		$.pointerValue<Float>(z).form = $.uint(1, 8)
		let s = bits2.LeadingZeros64(x)
		$.pointerValue<Float>(z).mant = (__goscript_nat.nat_setUint64($.pointerValue<Float>(z).mant, $.uint64Shl(x, $.uint(s, 64))) as __goscript_nat.nat)
		$.pointerValue<Float>(z).exp = $.int($.int(64 - s, 32), 32)
		if ($.uint($.pointerValue<Float>(z).prec, 32) < $.uint(64, 32)) {
			await Float.prototype.round.call(z, 0)
		}
		return z
	}

	public async setExpAndRound(exp: bigint, sbit: number): globalThis.Promise<void> {
		let z: Float | $.VarRef<Float> | null = this
		if (exp < -2147483648n) {
			// underflow
			$.pointerValue<Float>(z).acc = $.int(makeAcc($.pointerValue<Float>(z).neg), 8)
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			return
		}

		if (exp > 2147483647n) {
			// overflow
			$.pointerValue<Float>(z).acc = $.int(makeAcc(!$.pointerValue<Float>(z).neg), 8)
			$.pointerValue<Float>(z).form = $.uint(2, 8)
			return
		}

		$.pointerValue<Float>(z).form = $.uint(1, 8)
		$.pointerValue<Float>(z).exp = $.int($.int(exp, 32), 32)
		await Float.prototype.round.call(z, sbit)
	}

	public async sqrtInverse(x: Float | $.VarRef<Float> | null): globalThis.Promise<void> {
		const z: Float | $.VarRef<Float> | null = this

		// Exponent and precision limits.
		let u: Float | $.VarRef<Float> | null = __goscript_sqrt.newFloat($.uint($.pointerValue<Float>(z).prec, 32))
		let v: Float | $.VarRef<Float> | null = __goscript_sqrt.newFloat($.uint($.pointerValue<Float>(z).prec, 32))
		let __goscriptShadow2 = __goscript_sqrt.three
		let __goscriptShadow3: Float | $.VarRef<Float> | null = await __goscriptShadow2()
		let ng: ((t: Float | $.VarRef<Float> | null) => Float | $.VarRef<Float> | null | globalThis.Promise<Float | $.VarRef<Float> | null>) | null = $.functionValue(async (t: Float | $.VarRef<Float> | null): globalThis.Promise<Float | $.VarRef<Float> | null> => {
			$.pointerValue<Float>(u).prec = $.uint($.pointerValue<Float>(t).prec, 32)
			$.pointerValue<Float>(v).prec = $.uint($.pointerValue<Float>(t).prec, 32)
			await Float.prototype.Mul.call(u, t, t)
			await Float.prototype.Mul.call(u, x, u)
			await Float.prototype.Sub.call(v, __goscriptShadow3, u)
			await Float.prototype.Mul.call(u, t, v)
			$.pointerValue<Float>(u).exp--
			return await Float.prototype.Set.call(t, u)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "big.Float" }], results: [{ kind: $.TypeKind.Pointer, elemType: "big.Float" }] } as $.FunctionTypeInfo))

		let [xf, ] = await Float.prototype.Float64.call(x)
		let sqi: Float | $.VarRef<Float> | null = __goscript_sqrt.newFloat($.uint($.pointerValue<Float>(z).prec, 32))
		await Float.prototype.SetFloat64.call(sqi, 1 / math.Sqrt(xf))
		for (let prec = $.uint($.pointerValue<Float>(z).prec + 32, 32); $.uint($.pointerValue<Float>(sqi).prec, 32) < $.uint(prec, 32); ) {
			$.pointerValue<Float>(sqi).prec = Math.imul($.pointerValue<Float>(sqi).prec, $.uint(2, 32)) >>> 0
			sqi = await ng!(sqi)
		}

		// A form value describes the internal representation.
		await Float.prototype.Mul.call(z, x, sqi)
	}

	public async uadd(x: Float | $.VarRef<Float> | null, y: Float | $.VarRef<Float> | null): globalThis.Promise<void> {
		let z: Float | $.VarRef<Float> | null = this
		// Note: This implementation requires 2 shifts most of the
		// time. It is also inefficient if exponents or precisions
		// differ by wide margins. The following article describes
		// an efficient (but much more complicated) implementation
		// compatible with the internal representation used here:
		//
		// Vincent Lefèvre: "The Generic Multiple-Precision Floating-
		// Point Addition With Exact Rounding (as in the MPFR Library)"
		// http://www.vinc17.net/research/papers/rnc6.pdf

		if (false) {
			validateBinaryOperands(x, y)
		}

		// compute exponents ex, ey for mantissa with "binary point"
		// on the right (mantissa.0) - use int64 to avoid overflow
		let ex = $.int64Sub($.int64($.pointerValue<Float>(x).exp), ($.int64Mul($.int64($.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat))), 64n)))
		let ey = $.int64Sub($.int64($.pointerValue<Float>(y).exp), ($.int64Mul($.int64($.len(($.pointerValue<Float>(y).mant as __goscript_nat.nat))), 64n)))

		let al = __goscript_nat.alias(($.pointerValue<Float>(z).mant as __goscript_nat.nat), ($.pointerValue<Float>(x).mant as __goscript_nat.nat)) || __goscript_nat.alias(($.pointerValue<Float>(z).mant as __goscript_nat.nat), ($.pointerValue<Float>(y).mant as __goscript_nat.nat))

		// TODO(gri) having a combined add-and-shift primitive
		//           could make this code significantly faster
		switch (true) {
			case ex < ey:
			{
				if (al) {
					let t: __goscript_nat.nat = (__goscript_nat.nat_lsh((null as __goscript_nat.nat), ($.pointerValue<Float>(y).mant as __goscript_nat.nat), $.uint($.int64Sub(ey, ex), 64)) as __goscript_nat.nat)
					$.pointerValue<Float>(z).mant = (__goscript_nat.nat_add($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(x).mant as __goscript_nat.nat), (t as __goscript_nat.nat)) as __goscript_nat.nat)
				} else {
					$.pointerValue<Float>(z).mant = (__goscript_nat.nat_lsh($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(y).mant as __goscript_nat.nat), $.uint($.int64Sub(ey, ex), 64)) as __goscript_nat.nat)
					$.pointerValue<Float>(z).mant = (__goscript_nat.nat_add($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(x).mant as __goscript_nat.nat), ($.pointerValue<Float>(z).mant as __goscript_nat.nat)) as __goscript_nat.nat)
				}
				break
			}
			default:
			{
				$.pointerValue<Float>(z).mant = (__goscript_nat.nat_add($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(x).mant as __goscript_nat.nat), ($.pointerValue<Float>(y).mant as __goscript_nat.nat)) as __goscript_nat.nat)
				break
			}
			case ex > ey:
			{
				if (al) {
					let t: __goscript_nat.nat = (__goscript_nat.nat_lsh((null as __goscript_nat.nat), ($.pointerValue<Float>(x).mant as __goscript_nat.nat), $.uint($.int64Sub(ex, ey), 64)) as __goscript_nat.nat)
					$.pointerValue<Float>(z).mant = (__goscript_nat.nat_add($.pointerValue<Float>(z).mant, (t as __goscript_nat.nat), ($.pointerValue<Float>(y).mant as __goscript_nat.nat)) as __goscript_nat.nat)
				} else {
					$.pointerValue<Float>(z).mant = (__goscript_nat.nat_lsh($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(x).mant as __goscript_nat.nat), $.uint($.int64Sub(ex, ey), 64)) as __goscript_nat.nat)
					$.pointerValue<Float>(z).mant = (__goscript_nat.nat_add($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(z).mant as __goscript_nat.nat), ($.pointerValue<Float>(y).mant as __goscript_nat.nat)) as __goscript_nat.nat)
				}
				ex = ey
				break
			}
		}
		// len(z.mant) > 0

		await Float.prototype.setExpAndRound.call(z, $.int64Sub(($.int64Add(ex, ($.int64Mul($.int64($.len(($.pointerValue<Float>(z).mant as __goscript_nat.nat))), 64n)))), fnorm(($.pointerValue<Float>(z).mant as __goscript_nat.nat))), 0)
	}

	public ucmp(y: Float | $.VarRef<Float> | null): number {
		const x: Float | $.VarRef<Float> | null = this
		if (false) {
			validateBinaryOperands(x, y)
		}

		switch (true) {
			case $.int($.pointerValue<Float>(x).exp, 32) < $.int($.pointerValue<Float>(y).exp, 32):
			{
				return -1
				break
			}
			case $.int($.pointerValue<Float>(x).exp, 32) > $.int($.pointerValue<Float>(y).exp, 32):
			{
				return +1
				break
			}
		}
		// x.exp == y.exp

		// compare mantissas
		let i = $.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat))
		let j = $.len(($.pointerValue<Float>(y).mant as __goscript_nat.nat))
		while ((i > 0) || (j > 0)) {
			let xm: __goscript_arith.Word = 0
			let ym: __goscript_arith.Word = 0
			if (i > 0) {
				i--
				xm = $.arrayIndex($.pointerValue<Float>(x).mant!, i)
			}
			if (j > 0) {
				j--
				ym = $.arrayIndex($.pointerValue<Float>(y).mant!, j)
			}
			switch (true) {
				case xm < ym:
				{
					return -1
					break
				}
				case xm > ym:
				{
					return +1
					break
				}
			}
		}

		return 0
	}

	public async umul(x: Float | $.VarRef<Float> | null, y: Float | $.VarRef<Float> | null): globalThis.Promise<void> {
		let z: Float | $.VarRef<Float> | null = this
		if (false) {
			validateBinaryOperands(x, y)
		}

		// Note: This is doing too much work if the precision
		// of z is less than the sum of the precisions of x
		// and y which is often the case (e.g., if all floats
		// have the same precision).
		// TODO(gri) Optimize this for the common case.

		let e = $.int64Add($.int64($.pointerValue<Float>(x).exp), $.int64($.pointerValue<Float>(y).exp))
		if ($.pointerEqual(x, y)) {
			$.pointerValue<Float>(z).mant = (await __goscript_natmul.nat_sqr($.pointerValue<Float>(z).mant, null, ($.pointerValue<Float>(x).mant as __goscript_nat.nat)) as __goscript_nat.nat)
		} else {
			$.pointerValue<Float>(z).mant = (await __goscript_natmul.nat_mul($.pointerValue<Float>(z).mant, null, ($.pointerValue<Float>(x).mant as __goscript_nat.nat), ($.pointerValue<Float>(y).mant as __goscript_nat.nat)) as __goscript_nat.nat)
		}
		await Float.prototype.setExpAndRound.call(z, $.int64Sub(e, fnorm(($.pointerValue<Float>(z).mant as __goscript_nat.nat))), 0)
	}

	public async uquo(x: Float | $.VarRef<Float> | null, y: Float | $.VarRef<Float> | null): globalThis.Promise<void> {
		let z: Float | $.VarRef<Float> | null = this
		using __defer = new $.DisposableStack()
		if (false) {
			validateBinaryOperands(x, y)
		}

		// mantissa length in words for desired result precision + 1
		// (at least one extra bit so we get the rounding bit after
		// the division)
		let n = $.int(Math.trunc($.pointerValue<Float>(z).prec / 64)) + 1

		// compute adjusted x.mant such that we get enough result precision
		let xadj: __goscript_nat.nat = ($.pointerValue<Float>(x).mant as __goscript_nat.nat)
		{
			let d = (n - $.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat))) + $.len(($.pointerValue<Float>(y).mant as __goscript_nat.nat))
			if (d > 0) {
				// d extra words needed => add d "0 digits" to x
				xadj = ($.makeSlice<__goscript_arith.Word>($.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat)) + d, undefined, "number") as __goscript_nat.nat)
				$.copy(($.goSlice(xadj, d, undefined) as __goscript_nat.nat), ($.pointerValue<Float>(x).mant as __goscript_nat.nat))
			}
		}
		// TODO(gri): If we have too many digits (d < 0), we should be able
		// to shorten x for faster division. But we must be extra careful
		// with rounding in that case.

		// Compute d before division since there may be aliasing of x.mant
		// (via xadj) or y.mant with z.mant.
		let d = $.len((xadj as __goscript_nat.nat)) - $.len(($.pointerValue<Float>(y).mant as __goscript_nat.nat))

		// divide
		let stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null = await __goscript_nat.getStack()
		__defer.defer(() => { __goscript_nat.stack.prototype.free.call(stk) })
		let r: __goscript_nat.nat = null! as __goscript_nat.nat
		let __goscriptTuple6: any = await __goscript_natdiv.nat_div($.pointerValue<Float>(z).mant, stk, (null as __goscript_nat.nat), (xadj as __goscript_nat.nat), ($.pointerValue<Float>(y).mant as __goscript_nat.nat))
		$.pointerValue<Float>(z).mant = (__goscriptTuple6[0] as __goscript_nat.nat)
		r = (__goscriptTuple6[1] as __goscript_nat.nat)
		let e = $.int64Sub(($.int64Sub($.int64($.pointerValue<Float>(x).exp), $.int64($.pointerValue<Float>(y).exp))), ($.int64Mul($.int64(d - $.len(($.pointerValue<Float>(z).mant as __goscript_nat.nat))), 64n)))

		// The result is long enough to include (at least) the rounding bit.
		// If there's a non-zero remainder, the corresponding fractional part
		// (if it were computed), would have a non-zero sticky bit (if it were
		// zero, it couldn't have a non-zero remainder).
		let sbit: number = 0
		if ($.len((r as __goscript_nat.nat)) > 0) {
			sbit = 1
		}

		await Float.prototype.setExpAndRound.call(z, $.int64Sub(e, fnorm(($.pointerValue<Float>(z).mant as __goscript_nat.nat))), sbit)
	}

	public async usub(x: Float | $.VarRef<Float> | null, y: Float | $.VarRef<Float> | null): globalThis.Promise<void> {
		let z: Float | $.VarRef<Float> | null = this
		// This code is symmetric to uadd.
		// We have not factored the common code out because
		// eventually uadd (and usub) should be optimized
		// by special-casing, and the code will diverge.

		if (false) {
			validateBinaryOperands(x, y)
		}

		let ex = $.int64Sub($.int64($.pointerValue<Float>(x).exp), ($.int64Mul($.int64($.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat))), 64n)))
		let ey = $.int64Sub($.int64($.pointerValue<Float>(y).exp), ($.int64Mul($.int64($.len(($.pointerValue<Float>(y).mant as __goscript_nat.nat))), 64n)))

		let al = __goscript_nat.alias(($.pointerValue<Float>(z).mant as __goscript_nat.nat), ($.pointerValue<Float>(x).mant as __goscript_nat.nat)) || __goscript_nat.alias(($.pointerValue<Float>(z).mant as __goscript_nat.nat), ($.pointerValue<Float>(y).mant as __goscript_nat.nat))

		switch (true) {
			case ex < ey:
			{
				if (al) {
					let t: __goscript_nat.nat = (__goscript_nat.nat_lsh((null as __goscript_nat.nat), ($.pointerValue<Float>(y).mant as __goscript_nat.nat), $.uint($.int64Sub(ey, ex), 64)) as __goscript_nat.nat)
					$.pointerValue<Float>(z).mant = (__goscript_nat.nat_sub(t, ($.pointerValue<Float>(x).mant as __goscript_nat.nat), (t as __goscript_nat.nat)) as __goscript_nat.nat)
				} else {
					$.pointerValue<Float>(z).mant = (__goscript_nat.nat_lsh($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(y).mant as __goscript_nat.nat), $.uint($.int64Sub(ey, ex), 64)) as __goscript_nat.nat)
					$.pointerValue<Float>(z).mant = (__goscript_nat.nat_sub($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(x).mant as __goscript_nat.nat), ($.pointerValue<Float>(z).mant as __goscript_nat.nat)) as __goscript_nat.nat)
				}
				break
			}
			default:
			{
				$.pointerValue<Float>(z).mant = (__goscript_nat.nat_sub($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(x).mant as __goscript_nat.nat), ($.pointerValue<Float>(y).mant as __goscript_nat.nat)) as __goscript_nat.nat)
				break
			}
			case ex > ey:
			{
				if (al) {
					let t: __goscript_nat.nat = (__goscript_nat.nat_lsh((null as __goscript_nat.nat), ($.pointerValue<Float>(x).mant as __goscript_nat.nat), $.uint($.int64Sub(ex, ey), 64)) as __goscript_nat.nat)
					$.pointerValue<Float>(z).mant = (__goscript_nat.nat_sub(t, (t as __goscript_nat.nat), ($.pointerValue<Float>(y).mant as __goscript_nat.nat)) as __goscript_nat.nat)
				} else {
					$.pointerValue<Float>(z).mant = (__goscript_nat.nat_lsh($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(x).mant as __goscript_nat.nat), $.uint($.int64Sub(ex, ey), 64)) as __goscript_nat.nat)
					$.pointerValue<Float>(z).mant = (__goscript_nat.nat_sub($.pointerValue<Float>(z).mant, ($.pointerValue<Float>(z).mant as __goscript_nat.nat), ($.pointerValue<Float>(y).mant as __goscript_nat.nat)) as __goscript_nat.nat)
				}
				ex = ey
				break
			}
		}

		// operands may have canceled each other out
		if ($.len(($.pointerValue<Float>(z).mant as __goscript_nat.nat)) == 0) {
			$.pointerValue<Float>(z).acc = $.int(0, 8)
			$.pointerValue<Float>(z).form = $.uint(0, 8)
			$.pointerValue<Float>(z).neg = false
			return
		}
		// len(z.mant) > 0

		await Float.prototype.setExpAndRound.call(z, $.int64Sub(($.int64Add(ex, ($.int64Mul($.int64($.len(($.pointerValue<Float>(z).mant as __goscript_nat.nat))), 64n)))), fnorm(($.pointerValue<Float>(z).mant as __goscript_nat.nat))), 0)
	}

	public async validate(): globalThis.Promise<void> {
		const x: Float | $.VarRef<Float> | null = this
		if (!false) {
			// avoid performance bugs
			$.panic("validate called but debugFloat is not set")
		}
		{
			let msg = await Float.prototype.validate0.call(x)
			if (!$.stringEqual(msg, "")) {
				$.panic(msg)
			}
		}
	}

	public async validate0(): globalThis.Promise<string> {
		const x: Float | $.VarRef<Float> | null = this
		if ($.uint($.pointerValue<Float>(x).form, 8) != $.uint(1, 8)) {
			return ""
		}
		let m = $.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat))
		if (m == 0) {
			return "nonzero finite number with empty mantissa"
		}
		const msb: number = 9223372036854775808
		if (($.uint($.uint64And($.arrayIndex($.pointerValue<Float>(x).mant!, m - 1), 9223372036854775808n), 64)) == 0) {
			return fmt2.Sprintf("msb not set in last word %#x of %s", $.arrayIndex($.pointerValue<Float>(x).mant!, m - 1), await Float.prototype.Text.call(x, $.uint(112, 8), 0))
		}
		if ($.uint($.pointerValue<Float>(x).prec, 32) == $.uint(0, 32)) {
			return "zero precision finite number"
		}
		return ""
	}

	static __typeInfo = $.registerStructType(
		"big.Float",
		() => new Float(),
		[{ name: "Abs", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "Acc", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int8", typeName: "big.Accuracy" } }] }, { name: "Add", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "Append", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "fmt", type: { kind: $.TypeKind.Basic, name: "uint8" } }, { name: "prec", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "AppendText", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Cmp", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Copy", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "Float32", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float32" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "int8", typeName: "big.Accuracy" } }] }, { name: "Float64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float64" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "int8", typeName: "big.Accuracy" } }] }, { name: "Format", args: [{ name: "s", type: "fmt.State" }, { name: "format", type: { kind: $.TypeKind.Basic, name: "int32" } }], returns: [] }, { name: "GobDecode", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "GobEncode", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Int", args: [{ name: "z", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "int8", typeName: "big.Accuracy" } }] }, { name: "Int64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "int8", typeName: "big.Accuracy" } }] }, { name: "IsInf", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsInt", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MantExp", args: [{ name: "mant", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [{ name: "exp", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "MarshalText", args: [], returns: [{ name: "text", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "MinPrec", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint" } }] }, { name: "Mode", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "big.RoundingMode" } }] }, { name: "Mul", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "Neg", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "Parse", args: [{ name: "s", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "base", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "f", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }, { name: "b", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "Prec", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint" } }] }, { name: "Quo", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "Rat", args: [{ name: "z", type: { kind: $.TypeKind.Pointer, elemType: "big.Rat" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Rat" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "int8", typeName: "big.Accuracy" } }] }, { name: "Scan", args: [{ name: "s", type: "fmt.ScanState" }, { name: "ch", type: { kind: $.TypeKind.Basic, name: "int32" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Set", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "SetFloat64", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "float64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "SetInf", args: [{ name: "signbit", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "SetInt", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "SetInt64", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "SetMantExp", args: [{ name: "mant", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }, { name: "exp", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "SetMode", args: [{ name: "mode", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "big.RoundingMode" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "SetPrec", args: [{ name: "prec", type: { kind: $.TypeKind.Basic, name: "uint" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "SetRat", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Rat" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "SetString", args: [{ name: "s", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "SetUint64", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "Sign", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Signbit", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Sqrt", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Sub", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "Text", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "uint8" } }, { name: "prec", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Uint64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "int8", typeName: "big.Accuracy" } }] }, { name: "UnmarshalText", args: [{ name: "text", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "fmtB", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "fmtP", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "fmtX", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "prec", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "ord", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "pow5", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "round", args: [{ name: "sbit", type: { kind: $.TypeKind.Basic, name: "uint" } }], returns: [] }, { name: "scan", args: [{ name: "r", type: "io.ByteScanner" }, { name: "base", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "f", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }, { name: "b", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "setBits64", args: [{ name: "neg", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "x", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }] }, { name: "setExpAndRound", args: [{ name: "exp", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "sbit", type: { kind: $.TypeKind.Basic, name: "uint" } }], returns: [] }, { name: "sqrtInverse", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [] }, { name: "uadd", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [] }, { name: "ucmp", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "umul", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [] }, { name: "uquo", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [] }, { name: "usub", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Float" } }], returns: [] }, { name: "validate", args: [], returns: [] }, { name: "validate0", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		Float,
		[{ name: "prec", key: "prec", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "math/big", index: [0], offset: 0, exported: false }, { name: "mode", key: "mode", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "big.RoundingMode" }, pkgPath: "math/big", index: [1], offset: 4, exported: false }, { name: "acc", key: "acc", type: { kind: $.TypeKind.Basic, name: "int8", typeName: "big.Accuracy" }, pkgPath: "math/big", index: [2], offset: 5, exported: false }, { name: "form", key: "form", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "big.form" }, pkgPath: "math/big", index: [3], offset: 6, exported: false }, { name: "neg", key: "neg", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "math/big", index: [4], offset: 7, exported: false }, { name: "mant", key: "mant", type: { kind: $.TypeKind.Slice, typeName: "big.nat", elemType: { kind: $.TypeKind.Basic, name: "uint", typeName: "big.Word" } }, pkgPath: "math/big", index: [5], offset: 8, exported: false }, { name: "exp", key: "exp", type: { kind: $.TypeKind.Basic, name: "int32" }, pkgPath: "math/big", index: [6], offset: 32, exported: false }]
	)
}

export class ErrNaN {
	public get msg(): string {
		return this._fields.msg.value
	}
	public set msg(value: string) {
		this._fields.msg.value = value
	}

	public _fields: {
		msg: $.VarRef<string>
	}

	constructor(init?: Partial<{msg?: string}>) {
		this._fields = {
			msg: $.varRef(init?.msg ?? ("" as string))
		}
	}

	public clone(): ErrNaN {
		const cloned = new ErrNaN()
		cloned._fields = {
			msg: $.varRef(this._fields.msg.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const err = this
		return err.msg
	}

	static __typeInfo = $.registerStructType(
		"big.ErrNaN",
		() => new ErrNaN(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		ErrNaN,
		[{ name: "msg", key: "msg", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "math/big", index: [0], offset: 0, exported: false }]
	)
}

export const debugFloat: boolean = false

export const MaxExp: number = 2147483647

export const MinExp: number = -2147483648

export const MaxPrec: number = 4294967295

export const zero: form = 0

export const finite: form = 1

export const inf: form = 2

export const ToNearestEven: RoundingMode = 0

export const ToNearestAway: RoundingMode = 1

export const ToZero: RoundingMode = 2

export const AwayFromZero: RoundingMode = 3

export const ToNegativeInf: RoundingMode = 4

export const ToPositiveInf: RoundingMode = 5

export const Below: Accuracy = -1

export const Exact: Accuracy = 0

export const Above: Accuracy = 1

export async function NewFloat(x: number): globalThis.Promise<Float | $.VarRef<Float> | null> {
	if (math.IsNaN(x)) {
		$.panic($.interfaceValue<any>($.markAsStructValue(new ErrNaN({msg: "NewFloat(NaN)"})), "big.ErrNaN", "big.ErrNaN"))
	}
	return Float.prototype.SetFloat64.call(new Float(), x)
}

export function makeAcc(above: boolean): Accuracy {
	if (above) {
		return $.int(1, 8)
	}
	return $.int(-1, 8)
}

export function fnorm(m: __goscript_nat.nat): bigint {
	if (false && (($.len((m as __goscript_nat.nat)) == 0) || ($.arrayIndex(m!, $.len((m as __goscript_nat.nat)) - 1) == 0))) {
		$.panic("msw of mantissa is 0")
	}
	let s = __goscript_arith.nlz($.arrayIndex(m!, $.len((m as __goscript_nat.nat)) - 1))
	if (s > 0) {
		let c = __goscript_arith_decl.lshVU(m, m, s)
		if (false && (c != 0)) {
			$.panic("nlz or lshVU incorrect")
		}
	}
	return $.int64(s)
}

export function msb32(x: __goscript_nat.nat): number {
	let i = $.len((x as __goscript_nat.nat)) - 1
	if (i < 0) {
		return $.uint(0, 32)
	}
	if (false && (($.uint($.uint64And($.arrayIndex(x!, i), 9223372036854775808n), 64)) == 0)) {
		$.panic("x not normalized")
	}
	switch ((64 as number)) {
		case 32:
		{
			return $.uint($.uint($.arrayIndex(x!, i), 32), 32)
			break
		}
		case 64:
		{
			return $.uint($.uint($.uint($.uint64Shr($.arrayIndex(x!, i), 32n), 64), 32), 32)
			break
		}
	}
	$.panic("unreachable")
	throw new globalThis.Error("goscript: unreachable return")
}

export function msb64(x: __goscript_nat.nat): bigint {
	let i = $.len((x as __goscript_nat.nat)) - 1
	if (i < 0) {
		return 0n
	}
	if (false && (($.uint($.uint64And($.arrayIndex(x!, i), 9223372036854775808n), 64)) == 0)) {
		$.panic("x not normalized")
	}
	switch ((64 as number)) {
		case 32:
		{
			let v = $.uint64Mul($.uint64($.arrayIndex(x!, i)), (2 ** 32))
			if (i > 0) {
				v = $.uint64Or(v, $.uint64($.arrayIndex(x!, i - 1)))
			}
			return v
			break
		}
		case 64:
		{
			return $.uint64($.arrayIndex(x!, i))
			break
		}
	}
	$.panic("unreachable")
	throw new globalThis.Error("goscript: unreachable return")
}

export function validateBinaryOperands(x: Float | $.VarRef<Float> | null, y: Float | $.VarRef<Float> | null): void {
	if (!false) {
		// avoid performance bugs
		$.panic("validateBinaryOperands called but debugFloat is not set")
	}
	if ($.len(($.pointerValue<Float>(x).mant as __goscript_nat.nat)) == 0) {
		$.panic("empty mantissa for x")
	}
	if ($.len(($.pointerValue<Float>(y).mant as __goscript_nat.nat)) == 0) {
		$.panic("empty mantissa for y")
	}
}

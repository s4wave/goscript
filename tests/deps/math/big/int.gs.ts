// Generated file based on int.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as rand from "@goscript/math/rand/index.js"

import * as strings from "@goscript/strings/index.js"

import * as errors from "@goscript/errors/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as math from "@goscript/math/index.js"

import * as __goscript_accuracy_string from "./accuracy_string.gs.ts"

import * as __goscript_arith from "./arith.gs.ts"

import * as __goscript_float from "./float.gs.ts"

import * as __goscript_floatconv from "./floatconv.gs.ts"

import * as __goscript_floatmarsh from "./floatmarsh.gs.ts"

import * as __goscript_ftoa from "./ftoa.gs.ts"

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
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/math/rand/index.js"
import "@goscript/strings/index.js"
import "@goscript/errors/index.js"
import "@goscript/bytes/index.js"
import "@goscript/math/index.js"
import "./accuracy_string.gs.ts"
import "./arith.gs.ts"
import "./float.gs.ts"
import "./floatconv.gs.ts"
import "./floatmarsh.gs.ts"
import "./ftoa.gs.ts"
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

export class Int {
	public get neg(): boolean {
		return this._fields.neg.value
	}
	public set neg(value: boolean) {
		this._fields.neg.value = value
	}

	public get abs(): __goscript_nat.nat {
		return this._fields.abs.value
	}
	public set abs(value: __goscript_nat.nat) {
		this._fields.abs.value = value
	}

	public _fields: {
		neg: $.VarRef<boolean>
		abs: $.VarRef<__goscript_nat.nat>
	}

	constructor(init?: Partial<{neg?: boolean, abs?: __goscript_nat.nat}>) {
		this._fields = {
			neg: $.varRef(init?.neg ?? (false as boolean)),
			abs: $.varRef(init?.abs ?? (null! as __goscript_nat.nat))
		}
	}

	public clone(): Int {
		const cloned = new Int()
		cloned._fields = {
			neg: $.varRef(this._fields.neg.value),
			abs: $.varRef(this._fields.abs.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Abs(x: Int | $.VarRef<Int> | null): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		Int.prototype.Set.call(z, x)
		$.pointerValue<Int>(z).neg = false
		return z
	}

	public Add(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		let neg = $.pointerValue<Int>(x).neg
		if ($.pointerValue<Int>(x).neg == $.pointerValue<Int>(y).neg) {
			// x + y == x + y
			// (-x) + (-y) == -(x + y)
			$.pointerValue<Int>(z).abs = (__goscript_nat.nat_add($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat)) as __goscript_nat.nat)
		} else {
			// x + (-y) == x - y == -(y - x)
			// (-x) + y == y - x == -(x - y)
			if (__goscript_nat.nat_cmp($.pointerValue<Int>(x).abs, ($.pointerValue<Int>(y).abs as __goscript_nat.nat)) >= 0) {
				$.pointerValue<Int>(z).abs = (__goscript_nat.nat_sub($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat)) as __goscript_nat.nat)
			} else {
				neg = !neg
				$.pointerValue<Int>(z).abs = (__goscript_nat.nat_sub($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(y).abs as __goscript_nat.nat), ($.pointerValue<Int>(x).abs as __goscript_nat.nat)) as __goscript_nat.nat)
			}
		}
		$.pointerValue<Int>(z).neg = ($.len(($.pointerValue<Int>(z).abs as __goscript_nat.nat)) > 0) && neg
		return z
	}

	public And(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		if ($.pointerValue<Int>(x).neg == $.pointerValue<Int>(y).neg) {
			if ($.pointerValue<Int>(x).neg) {
				// (-x) & (-y) == ^(x-1) & ^(y-1) == ^((x-1) | (y-1)) == -(((x-1) | (y-1)) + 1)
				let x1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
				let y1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
				$.pointerValue<Int>(z).abs = (__goscript_nat.nat_add($.pointerValue<Int>(z).abs, (__goscript_nat.nat_or($.pointerValue<Int>(z).abs, (x1 as __goscript_nat.nat), (y1 as __goscript_nat.nat)) as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
				$.pointerValue<Int>(z).neg = true
				return z
			}

			// x & y == x & y
			$.pointerValue<Int>(z).abs = (__goscript_nat.nat_and($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).neg = false
			return z
		}

		// x.neg != y.neg
		if ($.pointerValue<Int>(x).neg) {
			let __goscriptAssign0_0: Int | $.VarRef<Int> | null = y
			let __goscriptAssign0_1: Int | $.VarRef<Int> | null = x
			x = __goscriptAssign0_0
			y = __goscriptAssign0_1
		}

		// x & (-y) == x & ^(y-1) == x &^ (y-1)
		let y1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_andNot($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (y1 as __goscript_nat.nat)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = false
		return z
	}

	public AndNot(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		if ($.pointerValue<Int>(x).neg == $.pointerValue<Int>(y).neg) {
			if ($.pointerValue<Int>(x).neg) {
				// (-x) &^ (-y) == ^(x-1) &^ ^(y-1) == ^(x-1) & (y-1) == (y-1) &^ (x-1)
				let x1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
				let y1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
				$.pointerValue<Int>(z).abs = (__goscript_nat.nat_andNot($.pointerValue<Int>(z).abs, (y1 as __goscript_nat.nat), (x1 as __goscript_nat.nat)) as __goscript_nat.nat)
				$.pointerValue<Int>(z).neg = false
				return z
			}

			// x &^ y == x &^ y
			$.pointerValue<Int>(z).abs = (__goscript_nat.nat_andNot($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).neg = false
			return z
		}

		if ($.pointerValue<Int>(x).neg) {
			// (-x) &^ y == ^(x-1) &^ y == ^(x-1) & ^y == ^((x-1) | y) == -(((x-1) | y) + 1)
			let x1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).abs = (__goscript_nat.nat_add($.pointerValue<Int>(z).abs, (__goscript_nat.nat_or($.pointerValue<Int>(z).abs, (x1 as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat)) as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).neg = true
			return z
		}

		// x &^ (-y) == x &^ ^(y-1) == x & (y-1)
		let y1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_and($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (y1 as __goscript_nat.nat)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = false
		return z
	}

	public async Append(buf: $.Slice<number>, base: number): globalThis.Promise<$.Slice<number>> {
		const x: Int | $.VarRef<Int> | null = this
		if (x == null) {
			return $.appendSlice(buf, $.stringToBytes("<nil>"), $.byteSliceHint)
		}
		return $.appendSlice(buf, await __goscript_natconv.nat_itoa($.pointerValue<Int>(x).abs, $.pointerValue<Int>(x).neg, base), $.byteSliceHint)
	}

	public async AppendText(b: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const x: Int | $.VarRef<Int> | null = this
		let text: $.Slice<number> = null! as $.Slice<number>
		let err: $.GoError = null! as $.GoError
		return [await Int.prototype.Append.call(x, b, 10), null]
	}

	public async Binomial(n: bigint, k: bigint): globalThis.Promise<Int | $.VarRef<Int> | null> {
		const z: Int | $.VarRef<Int> | null = this
		if (k > n) {
			return Int.prototype.SetInt64.call(z, 0n)
		}
		// reduce the number of multiplications by reducing k
		if (k > ($.int64Sub(n, k))) {
			k = $.int64Sub(n, k)
		}
		// C(n, k) == n * (n-1) * ... * (n-k+1) / k * (k-1) * ... * 1
		//         == n * (n-1) * ... * (n-k+1) / 1 * (1+1) * ... * k
		//
		// Using the multiplicative formula produces smaller values
		// at each step, requiring fewer allocations and computations:
		//
		// z = 1
		// for i := 0; i < k; i = i+1 {
		//     z *= n-i
		//     z /= i+1
		// }
		//
		// finally to avoid computing i+1 twice per loop:
		//
		// z = 1
		// i := 0
		// for i < k {
		//     z *= n-i
		//     i++
		//     z /= i
		// }
		let N: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		let K: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		let i: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		let t: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		N.value.SetInt64(n)
		K.value.SetInt64(k)
		Int.prototype.Set.call(z, __goscript_get_intOne())
		while (i.value.Cmp(K) < 0) {
			await Int.prototype.Mul.call(z, z, t.value.Sub(N, i))
			i.value.Add(i, __goscript_get_intOne())
			await Int.prototype.Quo.call(z, z, i)
		}
		return z
	}

	public Bit(i: number): number {
		const x: Int | $.VarRef<Int> | null = this
		if (i == 0) {
			// optimization for common case: odd/even test of x
			if ($.len(($.pointerValue<Int>(x).abs as __goscript_nat.nat)) > 0) {
				return $.uint($.uint($.uint64And($.arrayIndex($.pointerValue<Int>(x).abs!, 0), 1n), 64), 64)
			}
			return 0
		}
		if (i < 0) {
			$.panic("negative bit index")
		}
		if ($.pointerValue<Int>(x).neg) {
			let t: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
			return $.uint($.uint64Xor(__goscript_nat.nat_bit(t, $.uint(i, 64)), 1n), 64)
		}

		return __goscript_nat.nat_bit($.pointerValue<Int>(x).abs, $.uint(i, 64))
	}

	public BitLen(): number {
		const x: Int | $.VarRef<Int> | null = this
		// This function is used in cryptographic operations. It must not leak
		// anything but the Int's sign and bit size through side-channels. Any
		// changes must be reviewed by a security expert.
		return __goscript_nat.nat_bitLen($.pointerValue<Int>(x).abs)
	}

	public Bits(): $.Slice<__goscript_arith.Word> {
		const x: Int | $.VarRef<Int> | null = this
		// This function is used in cryptographic operations. It must not leak
		// anything but the Int's sign and bit size through side-channels. Any
		// changes must be reviewed by a security expert.
		return $.pointerValue<Int>(x).abs
	}

	public Bytes(): $.Slice<number> {
		const x: Int | $.VarRef<Int> | null = this
		// This function is used in cryptographic operations. It must not leak
		// anything but the Int's sign and bit size through side-channels. Any
		// changes must be reviewed by a security expert.
		let buf: $.Slice<number> = $.makeSlice<number>($.len(($.pointerValue<Int>(x).abs as __goscript_nat.nat)) * 8, undefined, "byte")
		return $.goSlice(buf, __goscript_nat.nat_bytes($.pointerValue<Int>(x).abs, buf), undefined)
	}

	public Cmp(y: Int | $.VarRef<Int> | null): number {
		const x: Int | $.VarRef<Int> | null = this
		let r: number = 0
		// x cmp y == x cmp y
		// x cmp (-y) == x
		// (-x) cmp y == y
		// (-x) cmp (-y) == -(x cmp y)
		switch (true) {
			case $.pointerEqual(x, y):
			{
				break
			}
			case $.pointerValue<Int>(x).neg == $.pointerValue<Int>(y).neg:
			{
				r = __goscript_nat.nat_cmp($.pointerValue<Int>(x).abs, ($.pointerValue<Int>(y).abs as __goscript_nat.nat))
				if ($.pointerValue<Int>(x).neg) {
					r = -r
				}
				break
			}
			case $.pointerValue<Int>(x).neg:
			{
				r = -1
				break
			}
			default:
			{
				r = 1
				break
			}
		}
		return r
	}

	public CmpAbs(y: Int | $.VarRef<Int> | null): number {
		const x: Int | $.VarRef<Int> | null = this
		return __goscript_nat.nat_cmp($.pointerValue<Int>(x).abs, ($.pointerValue<Int>(y).abs as __goscript_nat.nat))
	}

	public async Div(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		const z: Int | $.VarRef<Int> | null = this
		let y_neg = $.pointerValue<Int>(y).neg
		let r: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		await Int.prototype.QuoRem.call(z, x, y, r)
		if (r.value.neg) {
			if (y_neg) {
				Int.prototype.Add.call(z, z, __goscript_get_intOne())
			} else {
				Int.prototype.Sub.call(z, z, __goscript_get_intOne())
			}
		}
		return z
	}

	public async DivMod(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null, m: Int | $.VarRef<Int> | null): globalThis.Promise<[Int | $.VarRef<Int> | null, Int | $.VarRef<Int> | null]> {
		const z: Int | $.VarRef<Int> | null = this
		let y0: Int | $.VarRef<Int> | null = y
		if (($.pointerEqual(z, y)) || __goscript_nat.alias(($.pointerValue<Int>(z).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat))) {
			y0 = Int.prototype.Set.call(new Int(), y)
		}
		await Int.prototype.QuoRem.call(z, x, y, m)
		if ($.pointerValue<Int>(m).neg) {
			if ($.pointerValue<Int>(y0).neg) {
				Int.prototype.Add.call(z, z, __goscript_get_intOne())
				Int.prototype.Sub.call(m, m, y0)
			} else {
				Int.prototype.Sub.call(z, z, __goscript_get_intOne())
				Int.prototype.Add.call(m, m, y0)
			}
		}
		return [z, m]
	}

	public async Exp(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null, m: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		const z: Int | $.VarRef<Int> | null = this
		return Int.prototype.exp.call(z, x, y, m, false)
	}

	public FillBytes(buf: $.Slice<number>): $.Slice<number> {
		const x: Int | $.VarRef<Int> | null = this
		// Clear whole buffer.
		$.clear(buf)
		__goscript_nat.nat_bytes($.pointerValue<Int>(x).abs, buf)
		return buf
	}

	public async Float64(): globalThis.Promise<[number, __goscript_float.Accuracy]> {
		const x: Int | $.VarRef<Int> | null = this
		let n = __goscript_nat.nat_bitLen($.pointerValue<Int>(x).abs)
		if (n == 0) {
			return [0.0, $.int(0, 8)]
		}

		// Fast path: no more than 53 significant bits.
		if ((n <= 53) || ((n < 64) && ((n - $.int(__goscript_nat.nat_trailingZeroBits($.pointerValue<Int>(x).abs))) <= 53))) {
			let f = Number(low64(($.pointerValue<Int>(x).abs as __goscript_nat.nat)))
			if ($.pointerValue<Int>(x).neg) {
				f = -f
			}
			return [f, $.int(0, 8)]
		}

		const __goscriptReturn0 = await __goscript_float.Float.prototype.Float64.call(await __goscript_float.Float.prototype.SetInt.call(new __goscript_float.Float(), x))
		return [__goscriptReturn0[0], $.int(__goscriptReturn0[1], 8)]
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Format(s: fmt.State | null, ch: number): globalThis.Promise<void> {
		const x: Int | $.VarRef<Int> | null = this

		let base: number = 0
		switch (ch) {
			case 98:
			{
				base = 2
				break
			}
			case 111:
			case 79:
			{
				base = 8
				break
			}
			case 100:
			case 115:
			case 118:
			{
				base = 10
				break
			}
			case 120:
			case 88:
			{
				base = 16
				break
			}
			default:
			{
				await fmt.Fprintf($.pointerValueOrNil((s as io.Writer | null))!, "%%!%c(big.Int=%s)", $.basicInterfaceValue(ch, "rune", "int32"), await Int.prototype.String.call(x))
				return
				break
			}
		}

		if (x == null) {
			await fmt.Fprint($.pointerValueOrNil((s as io.Writer | null))!, "<nil>")
			return
		}

		let sign = ""
		switch (true) {
			case $.pointerValue<Int>(x).neg:
			{
				sign = "-"
				break
			}
			case await $.pointerValue<Exclude<fmt.State, null>>(s).Flag(43):
			{
				sign = "+"
				break
			}
			case await $.pointerValue<Exclude<fmt.State, null>>(s).Flag(32):
			{
				sign = " "
				break
			}
		}

		let prefix = ""
		if (await $.pointerValue<Exclude<fmt.State, null>>(s).Flag(35)) {
			switch (ch) {
				case 98:
				{
					prefix = "0b"
					break
				}
				case 111:
				{
					prefix = "0"
					break
				}
				case 120:
				{
					prefix = "0x"
					break
				}
				case 88:
				{
					prefix = "0X"
					break
				}
			}
		}
		if ($.int(ch, 32) == $.int(79, 32)) {
			prefix = "0o"
		}

		let digits: $.Slice<number> = await __goscript_natconv.nat_utoa($.pointerValue<Int>(x).abs, base)
		if ($.int(ch, 32) == $.int(88, 32)) {

			for (let __goscriptRangeTarget0 = digits, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
				let d = __goscriptRangeTarget0![i]
				if (($.uint(97, 8) <= $.uint(d, 8)) && ($.uint(d, 8) <= $.uint(122, 8))) {
					digits![i] = $.uint(65 + (d - 97), 8)
				}
			}
		}

		let left: number = 0
		let zeros: number = 0
		let right: number = 0

		// Neg sets z to -x and returns z.
		let [precision, precisionSet] = await $.pointerValue<Exclude<fmt.State, null>>(s).Precision()
		if (precisionSet) {
			switch (true) {
				case $.len(digits) < precision:
				{
					zeros = precision - $.len(digits)
					break
				}
				case (($.len(digits) == 1) && ($.uint($.arrayIndex(digits!, 0), 8) == $.uint(48, 8))) && (precision == 0):
				{
					return
					break
				}
			}
		}

		let length = (($.len(sign) + $.len(prefix)) + zeros) + $.len(digits)
		{
			let [width, widthSet] = await $.pointerValue<Exclude<fmt.State, null>>(s).Width()
			if (widthSet && (length < width)) {
				{
					let d = width - length
					switch (true) {
						case await $.pointerValue<Exclude<fmt.State, null>>(s).Flag(45):
						{
							right = d
							break
						}
						case await $.pointerValue<Exclude<fmt.State, null>>(s).Flag(48) && !precisionSet:
						{
							zeros = d
							break
						}
						default:
						{
							left = d
							break
						}
					}
				}
			}
		}

		await __goscript_intconv.writeMultiple(s, " ", left)
		await __goscript_intconv.writeMultiple(s, sign, 1)
		await __goscript_intconv.writeMultiple(s, prefix, 1)
		await __goscript_intconv.writeMultiple(s, "0", zeros)
		await $.pointerValue<Exclude<fmt.State, null>>(s).Write(digits)
		await __goscript_intconv.writeMultiple(s, " ", right)
	}

	public async GCD(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null, a: Int | $.VarRef<Int> | null, b: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		let z: Int | $.VarRef<Int> | null = this
		if (($.len(($.pointerValue<Int>(a).abs as __goscript_nat.nat)) == 0) || ($.len(($.pointerValue<Int>(b).abs as __goscript_nat.nat)) == 0)) {
			let lenA = $.len(($.pointerValue<Int>(a).abs as __goscript_nat.nat))
			let lenB = $.len(($.pointerValue<Int>(b).abs as __goscript_nat.nat))
			let negA = $.pointerValue<Int>(a).neg
			let negB = $.pointerValue<Int>(b).neg
			if (lenA == 0) {
				Int.prototype.Set.call(z, b)
			} else {
				Int.prototype.Set.call(z, a)
			}
			$.pointerValue<Int>(z).neg = false
			if (x != null) {
				if (lenA == 0) {
					Int.prototype.SetUint64.call(x, 0n)
				} else {
					Int.prototype.SetUint64.call(x, 1n)
					$.pointerValue<Int>(x).neg = negA
				}
			}
			if (y != null) {
				if (lenB == 0) {
					Int.prototype.SetUint64.call(y, 0n)
				} else {
					Int.prototype.SetUint64.call(y, 1n)
					$.pointerValue<Int>(y).neg = negB
				}
			}
			return z
		}

		return Int.prototype.lehmerGCD.call(z, x, y, a, b)
	}

	public GobDecode(buf: $.Slice<number>): $.GoError {
		let z: Int | $.VarRef<Int> | null = this
		if ($.len(buf) == 0) {
			// absolute value of the integer
			$.assignStruct($.pointerValue<Int>(z), $.markAsStructValue(new Int()))
			return null
		}
		let b = $.uint($.arrayIndex(buf!, 0), 8)
		if ($.uint(($.uintShr(b, 1, 8)), 8) != $.uint(1, 8)) {
			return fmt.Errorf("Int.GobDecode: encoding version %d not supported", $.basicInterfaceValue($.uintShr(b, 1, 8), "byte", "uint8"))
		}
		$.pointerValue<Int>(z).neg = $.uint((b & 1), 8) != $.uint(0, 8)
		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_setBytes($.pointerValue<Int>(z).abs, $.goSlice(buf, 1, undefined)) as __goscript_nat.nat)
		return null
	}

	public GobEncode(): [$.Slice<number>, $.GoError] {
		const x: Int | $.VarRef<Int> | null = this
		if (x == null) {
			return [null, null]
		}
		let buf: $.Slice<number> = $.makeSlice<number>(1 + ($.len(($.pointerValue<Int>(x).abs as __goscript_nat.nat)) * 8), undefined, "byte")
		let i = __goscript_nat.nat_bytes($.pointerValue<Int>(x).abs, buf) - 1
		let b = $.uint(2, 8)
		if ($.pointerValue<Int>(x).neg) {
			b = b | ($.uint(1, 8))
		}
		buf![i] = $.uint(b, 8)
		return [$.goSlice(buf, i, undefined), null]
	}

	public Int64(): bigint {
		const x: Int | $.VarRef<Int> | null = this
		let v = $.int64(low64(($.pointerValue<Int>(x).abs as __goscript_nat.nat)))
		if ($.pointerValue<Int>(x).neg) {
			v = -v
		}
		return v
	}

	public IsInt64(): boolean {
		const x: Int | $.VarRef<Int> | null = this
		if ($.len(($.pointerValue<Int>(x).abs as __goscript_nat.nat)) <= (Math.trunc(64 / 64))) {
			let w = $.int64(low64(($.pointerValue<Int>(x).abs as __goscript_nat.nat)))
			return (w >= 0n) || ($.pointerValue<Int>(x).neg && (w == -w))
		}
		return false
	}

	public IsUint64(): boolean {
		const x: Int | $.VarRef<Int> | null = this
		return !$.pointerValue<Int>(x).neg && ($.len(($.pointerValue<Int>(x).abs as __goscript_nat.nat)) <= (Math.trunc(64 / 64)))
	}

	public Lsh(x: Int | $.VarRef<Int> | null, n: number): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_lsh($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), n) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = $.pointerValue<Int>(x).neg
		return z
	}

	public async MarshalJSON(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const x: Int | $.VarRef<Int> | null = this
		if (x == null) {
			return [new Uint8Array([110, 117, 108, 108]), null]
		}
		return [await __goscript_natconv.nat_itoa($.pointerValue<Int>(x).abs, $.pointerValue<Int>(x).neg, 10), null]
	}

	public async MarshalText(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const x: Int | $.VarRef<Int> | null = this
		let text: $.Slice<number> = null! as $.Slice<number>
		let err: $.GoError = null! as $.GoError
		return Int.prototype.AppendText.call(x, null)
	}

	public async Mod(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		const z: Int | $.VarRef<Int> | null = this
		let y0: Int | $.VarRef<Int> | null = y
		if (($.pointerEqual(z, y)) || __goscript_nat.alias(($.pointerValue<Int>(z).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat))) {
			y0 = Int.prototype.Set.call(new Int(), y)
		}
		let q: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		await q.value.QuoRem(x, y, z)
		if ($.pointerValue<Int>(z).neg) {
			if ($.pointerValue<Int>(y0).neg) {
				Int.prototype.Sub.call(z, z, y0)
			} else {
				Int.prototype.Add.call(z, z, y0)
			}
		}
		return z
	}

	public async ModInverse(g: Int | $.VarRef<Int> | null, n: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		const z: Int | $.VarRef<Int> | null = this
		// GCD expects parameters a and b to be > 0.
		if ($.pointerValue<Int>(n).neg) {
			let n2: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
			n = n2.value.Neg(n)
		}
		if ($.pointerValue<Int>(g).neg) {
			let g2: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
			g = await g2.value.Mod(g, n)
		}
		let d: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		let x: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		await d.value.GCD(x, null, g, n)

		// if and only if d==1, g and n are relatively prime
		if (d.value.Cmp(__goscript_get_intOne()) != 0) {
			return null
		}

		// x and y are such that g*x + n*y = 1, therefore x is the inverse element,
		// but it may be negative, so convert to the range 0 <= z < |n|
		if (x.value.neg) {
			Int.prototype.Add.call(z, x, n)
		} else {
			Int.prototype.Set.call(z, x)
		}
		return z
	}

	public async ModSqrt(x: Int | $.VarRef<Int> | null, p: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		const z: Int | $.VarRef<Int> | null = this
		switch (await Jacobi(x, p)) {
			case -1:
			{
				return null
				break
			}
			case 0:
			{
				return Int.prototype.SetInt64.call(z, 0n)
				break
			}
			case 1:
			{
				break
				break
			}
		}
		if ($.pointerValue<Int>(x).neg || (Int.prototype.Cmp.call(x, p) >= 0)) {
			x = await Int.prototype.Mod.call(new Int(), x, p)
		}

		switch (true) {
			case ($.uint($.uint64Mod($.arrayIndex($.pointerValue<Int>(p).abs!, 0), 4n), 64)) == 3:
			{
				return Int.prototype.modSqrt3Mod4Prime.call(z, x, p)
				break
			}
			case ($.uint($.uint64Mod($.arrayIndex($.pointerValue<Int>(p).abs!, 0), 8n), 64)) == 5:
			{
				return Int.prototype.modSqrt5Mod8Prime.call(z, x, p)
				break
			}
			default:
			{
				return Int.prototype.modSqrtTonelliShanks.call(z, x, p)
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Mul(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		const z: Int | $.VarRef<Int> | null = this
		await Int.prototype.mul.call(z, null, x, y)
		return z
	}

	public async MulRange(a: bigint, b: bigint): globalThis.Promise<Int | $.VarRef<Int> | null> {
		let z: Int | $.VarRef<Int> | null = this
		switch (true) {
			case a > b:
			{
				return Int.prototype.SetInt64.call(z, 1n)
				break
			}
			case (a <= 0n) && (b >= 0n):
			{
				return Int.prototype.SetInt64.call(z, 0n)
				break
			}
		}
		// a <= b && (b < 0 || a > 0)

		let neg = false
		if (a < 0n) {
			neg = ($.int64And(($.int64Sub(b, a)), 1n)) == 0n
			let __goscriptAssign1_0: bigint = -b
			let __goscriptAssign1_1: bigint = -a
			a = __goscriptAssign1_0
			b = __goscriptAssign1_1
		}

		$.pointerValue<Int>(z).abs = (await __goscript_nat.nat_mulRange($.pointerValue<Int>(z).abs, null, $.uint64(a), $.uint64(b)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = neg
		return z
	}

	public Neg(x: Int | $.VarRef<Int> | null): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		Int.prototype.Set.call(z, x)
		$.pointerValue<Int>(z).neg = ($.len(($.pointerValue<Int>(z).abs as __goscript_nat.nat)) > 0) && !$.pointerValue<Int>(z).neg
		return z
	}

	public Not(x: Int | $.VarRef<Int> | null): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		if ($.pointerValue<Int>(x).neg) {
			// ^(-x) == ^(^(x-1)) == x-1
			$.pointerValue<Int>(z).abs = (__goscript_nat.nat_sub($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).neg = false
			return z
		}

		// ^x == -x-1 == -(x+1)
		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_add($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = true
		return z
	}

	public Or(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		if ($.pointerValue<Int>(x).neg == $.pointerValue<Int>(y).neg) {
			if ($.pointerValue<Int>(x).neg) {
				// (-x) | (-y) == ^(x-1) | ^(y-1) == ^((x-1) & (y-1)) == -(((x-1) & (y-1)) + 1)
				let x1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
				let y1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
				$.pointerValue<Int>(z).abs = (__goscript_nat.nat_add($.pointerValue<Int>(z).abs, (__goscript_nat.nat_and($.pointerValue<Int>(z).abs, (x1 as __goscript_nat.nat), (y1 as __goscript_nat.nat)) as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
				$.pointerValue<Int>(z).neg = true
				return z
			}

			// x | y == x | y
			$.pointerValue<Int>(z).abs = (__goscript_nat.nat_or($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).neg = false
			return z
		}

		// x.neg != y.neg
		if ($.pointerValue<Int>(x).neg) {
			let __goscriptAssign2_0: Int | $.VarRef<Int> | null = y
			let __goscriptAssign2_1: Int | $.VarRef<Int> | null = x
			x = __goscriptAssign2_0
			y = __goscriptAssign2_1
		}

		// x | (-y) == x | ^(y-1) == ^((y-1) &^ x) == -(^((y-1) &^ x) + 1)
		let y1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_add($.pointerValue<Int>(z).abs, (__goscript_nat.nat_andNot($.pointerValue<Int>(z).abs, (y1 as __goscript_nat.nat), ($.pointerValue<Int>(x).abs as __goscript_nat.nat)) as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = true
		return z
	}

	public async ProbablyPrime(n: number): globalThis.Promise<boolean> {
		const x: Int | $.VarRef<Int> | null = this
		using __defer = new $.DisposableStack()

		// sign
		// absolute value of the integer
		if (n < 0) {
			$.panic("negative n for ProbablyPrime")
		}
		if ($.pointerValue<Int>(x).neg || ($.len(($.pointerValue<Int>(x).abs as __goscript_nat.nat)) == 0)) {
			return false
		}

		const primeBitMask: bigint = 2891462833508853932n

		let w = $.arrayIndex($.pointerValue<Int>(x).abs!, 0)
		if (($.len(($.pointerValue<Int>(x).abs as __goscript_nat.nat)) == 1) && (w < 64)) {
			return ($.uint64And(2891462833508853932n, ($.uint64Shl(1n, w)))) != 0n
		}

		if (($.uint($.uint64And(w, 1n), 64)) == 0) {
			return false
		}

		const primesA: number = 4127218095
		const primesB: number = 3948078067

		let rA: number = 0
		let rB: number = 0
		switch ((64 as number)) {
			case 32:
			{
				rA = $.uint($.uint(__goscript_natdiv.nat_modW($.pointerValue<Int>(x).abs, 4127218095), 32), 32)
				rB = $.uint($.uint(__goscript_natdiv.nat_modW($.pointerValue<Int>(x).abs, 3948078067), 32), 32)
				break
			}
			case 64:
			{
				let r = __goscript_natdiv.nat_modW($.pointerValue<Int>(x).abs, $.uint("16294579238595022365", 64))
				rA = $.uint($.uint($.uint($.uint64Mod(r, 4127218095n), 64), 32), 32)
				rB = $.uint($.uint($.uint($.uint64Mod(r, 3948078067n), 64), 32), 32)
				break
			}
			default:
			{
				$.panic("math/big: invalid word size")
				break
			}
		}

		if ((((((((((((((($.uint((rA % 3), 32) == $.uint(0, 32)) || ($.uint((rA % 5), 32) == $.uint(0, 32))) || ($.uint((rA % 7), 32) == $.uint(0, 32))) || ($.uint((rA % 11), 32) == $.uint(0, 32))) || ($.uint((rA % 13), 32) == $.uint(0, 32))) || ($.uint((rA % 17), 32) == $.uint(0, 32))) || ($.uint((rA % 19), 32) == $.uint(0, 32))) || ($.uint((rA % 23), 32) == $.uint(0, 32))) || ($.uint((rA % 37), 32) == $.uint(0, 32))) || ($.uint((rB % 29), 32) == $.uint(0, 32))) || ($.uint((rB % 31), 32) == $.uint(0, 32))) || ($.uint((rB % 41), 32) == $.uint(0, 32))) || ($.uint((rB % 43), 32) == $.uint(0, 32))) || ($.uint((rB % 47), 32) == $.uint(0, 32))) || ($.uint((rB % 53), 32) == $.uint(0, 32))) {
			return false
		}

		let stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null = await __goscript_nat.getStack()
		__defer.defer(() => { __goscript_nat.stack.prototype.free.call(stk) })
		return await __goscript_prime.nat_probablyPrimeMillerRabin($.pointerValue<Int>(x).abs, stk, n + 1, true) && await __goscript_prime.nat_probablyPrimeLucas($.pointerValue<Int>(x).abs, stk)
	}

	public async Quo(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		let z: Int | $.VarRef<Int> | null = this
		let __goscriptTuple0: any = await __goscript_natdiv.nat_div($.pointerValue<Int>(z).abs, null, (null as __goscript_nat.nat), ($.pointerValue<Int>(x).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat))
		$.pointerValue<Int>(z).abs = (__goscriptTuple0[0] as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = ($.len(($.pointerValue<Int>(z).abs as __goscript_nat.nat)) > 0) && ($.pointerValue<Int>(x).neg != $.pointerValue<Int>(y).neg)
		return z
	}

	public async QuoRem(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null, r: Int | $.VarRef<Int> | null): globalThis.Promise<[Int | $.VarRef<Int> | null, Int | $.VarRef<Int> | null]> {
		let z: Int | $.VarRef<Int> | null = this
		let __goscriptTuple1: any = await __goscript_natdiv.nat_div($.pointerValue<Int>(z).abs, null, ($.pointerValue<Int>(r).abs as __goscript_nat.nat), ($.pointerValue<Int>(x).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat))
		$.pointerValue<Int>(z).abs = (__goscriptTuple1[0] as __goscript_nat.nat)
		$.pointerValue<Int>(r).abs = (__goscriptTuple1[1] as __goscript_nat.nat)
		let __goscriptAssign3_0: boolean = ($.len(($.pointerValue<Int>(z).abs as __goscript_nat.nat)) > 0) && ($.pointerValue<Int>(x).neg != $.pointerValue<Int>(y).neg)
		let __goscriptAssign3_1: boolean = ($.len(($.pointerValue<Int>(r).abs as __goscript_nat.nat)) > 0) && $.pointerValue<Int>(x).neg
		$.pointerValue<Int>(z).neg = __goscriptAssign3_0
		$.pointerValue<Int>(r).neg = __goscriptAssign3_1
		return [z, r]
	}

	public async Rand(rnd: rand.Rand | $.VarRef<rand.Rand> | null, n: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		let z: Int | $.VarRef<Int> | null = this
		// z.neg is not modified before the if check, because z and n might alias.
		if ($.pointerValue<Int>(n).neg || ($.len(($.pointerValue<Int>(n).abs as __goscript_nat.nat)) == 0)) {
			$.pointerValue<Int>(z).neg = false
			$.pointerValue<Int>(z).abs = (null as __goscript_nat.nat)
			return z
		}
		$.pointerValue<Int>(z).neg = false
		$.pointerValue<Int>(z).abs = (await __goscript_nat.nat_random($.pointerValue<Int>(z).abs, rnd, ($.pointerValue<Int>(n).abs as __goscript_nat.nat), __goscript_nat.nat_bitLen($.pointerValue<Int>(n).abs)) as __goscript_nat.nat)
		return z
	}

	public async Rem(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		let z: Int | $.VarRef<Int> | null = this
		let __goscriptTuple2: any = await __goscript_natdiv.nat_div((null as __goscript_nat.nat), null, ($.pointerValue<Int>(z).abs as __goscript_nat.nat), ($.pointerValue<Int>(x).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat))
		$.pointerValue<Int>(z).abs = (__goscriptTuple2[1] as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = ($.len(($.pointerValue<Int>(z).abs as __goscript_nat.nat)) > 0) && $.pointerValue<Int>(x).neg
		return z
	}

	public Rsh(x: Int | $.VarRef<Int> | null, n: number): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		if ($.pointerValue<Int>(x).neg) {
			// (-x) >> s == ^(x-1) >> s == ^((x-1) >> s) == -(((x-1) >> s) + 1)
			let t: __goscript_nat.nat = (__goscript_nat.nat_sub($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
			t = (__goscript_nat.nat_rsh(t, (t as __goscript_nat.nat), n) as __goscript_nat.nat)
			$.pointerValue<Int>(z).abs = (__goscript_nat.nat_add(t, (t as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).neg = true
			return z
		}

		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_rsh($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), n) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = false
		return z
	}

	public async Scan(s: fmt.ScanState | null, ch: number): globalThis.Promise<$.GoError> {
		const z: Int | $.VarRef<Int> | null = this
		await $.pointerValue<Exclude<fmt.ScanState, null>>(s).SkipSpace()
		let base = 0
		switch (ch) {
			case 98:
			{
				base = 2
				break
			}
			case 111:
			{
				base = 8
				break
			}
			case 100:
			{
				base = 10
				break
			}
			case 120:
			case 88:
			{
				base = 16
				break
			}
			case 115:
			case 118:
			{
				break
			}
			default:
			{
				return errors.New("Int.Scan: invalid verb")
				break
			}
		}
		let [, , err] = await Int.prototype.scan.call(z, $.interfaceValue<io.ByteScanner | null>($.markAsStructValue(new __goscript_intconv.byteReader({ScanState: s})), "big.byteReader", "big.byteReader"), base)
		return err
	}

	public Set(x: Int | $.VarRef<Int> | null): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		if (!$.pointerEqual(z, x)) {
			$.pointerValue<Int>(z).abs = (__goscript_nat.nat__set($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).neg = $.pointerValue<Int>(x).neg
		}
		return z
	}

	public SetBit(x: Int | $.VarRef<Int> | null, i: number, b: number): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		if (i < 0) {
			$.panic("negative bit index")
		}
		if ($.pointerValue<Int>(x).neg) {
			let t: __goscript_nat.nat = (__goscript_nat.nat_sub($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
			t = (__goscript_nat.nat_setBit(t, (t as __goscript_nat.nat), $.uint(i, 64), $.uint($.uint64Xor(b, 1n), 64)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).abs = (__goscript_nat.nat_add(t, (t as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).neg = $.len(($.pointerValue<Int>(z).abs as __goscript_nat.nat)) > 0
			return z
		}
		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_setBit($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), $.uint(i, 64), b) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = false
		return z
	}

	public SetBits(abs: $.Slice<__goscript_arith.Word>): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_norm((abs as __goscript_nat.nat)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = false
		return z
	}

	public SetBytes(buf: $.Slice<number>): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_setBytes($.pointerValue<Int>(z).abs, buf) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = false
		return z
	}

	public SetInt64(x: bigint): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		let neg = false
		if (x < 0n) {
			neg = true
			x = -x
		}
		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_setUint64($.pointerValue<Int>(z).abs, $.uint64(x)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = neg
		return z
	}

	public async SetString(s: string, base: number): globalThis.Promise<[Int | $.VarRef<Int> | null, boolean]> {
		const z: Int | $.VarRef<Int> | null = this
		return Int.prototype.setFromScanner.call(z, $.interfaceValue<io.ByteScanner | null>(strings.NewReader(s), "*strings.Reader", { kind: $.TypeKind.Pointer, elemType: "strings.Reader" }), base)
	}

	public SetUint64(x: bigint): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_setUint64($.pointerValue<Int>(z).abs, x) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = false
		return z
	}

	public Sign(): number {
		const x: Int | $.VarRef<Int> | null = this
		// This function is used in cryptographic operations. It must not leak
		// anything but the Int's sign and bit size through side-channels. Any
		// changes must be reviewed by a security expert.
		if ($.len(($.pointerValue<Int>(x).abs as __goscript_nat.nat)) == 0) {
			return 0
		}
		if ($.pointerValue<Int>(x).neg) {
			return -1
		}
		return 1
	}

	public async Sqrt(x: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		let z: Int | $.VarRef<Int> | null = this
		if ($.pointerValue<Int>(x).neg) {
			$.panic("square root of negative number")
		}
		$.pointerValue<Int>(z).neg = false
		$.pointerValue<Int>(z).abs = (await __goscript_nat.nat_sqrt($.pointerValue<Int>(z).abs, null, ($.pointerValue<Int>(x).abs as __goscript_nat.nat)) as __goscript_nat.nat)
		return z
	}

	public async String(): globalThis.Promise<string> {
		const x: Int | $.VarRef<Int> | null = this
		return Int.prototype.Text.call(x, 10)
	}

	public Sub(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		let neg = $.pointerValue<Int>(x).neg
		if ($.pointerValue<Int>(x).neg != $.pointerValue<Int>(y).neg) {
			// x - (-y) == x + y
			// (-x) - y == -(x + y)
			$.pointerValue<Int>(z).abs = (__goscript_nat.nat_add($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat)) as __goscript_nat.nat)
		} else {
			// x - y == x - y == -(y - x)
			// (-x) - (-y) == y - x == -(x - y)
			if (__goscript_nat.nat_cmp($.pointerValue<Int>(x).abs, ($.pointerValue<Int>(y).abs as __goscript_nat.nat)) >= 0) {
				$.pointerValue<Int>(z).abs = (__goscript_nat.nat_sub($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat)) as __goscript_nat.nat)
			} else {
				neg = !neg
				$.pointerValue<Int>(z).abs = (__goscript_nat.nat_sub($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(y).abs as __goscript_nat.nat), ($.pointerValue<Int>(x).abs as __goscript_nat.nat)) as __goscript_nat.nat)
			}
		}
		$.pointerValue<Int>(z).neg = ($.len(($.pointerValue<Int>(z).abs as __goscript_nat.nat)) > 0) && neg
		return z
	}

	public async Text(base: number): globalThis.Promise<string> {
		const x: Int | $.VarRef<Int> | null = this
		if (x == null) {
			return "<nil>"
		}
		return $.bytesToString(await __goscript_natconv.nat_itoa($.pointerValue<Int>(x).abs, $.pointerValue<Int>(x).neg, base))
	}

	public TrailingZeroBits(): number {
		const x: Int | $.VarRef<Int> | null = this
		return __goscript_nat.nat_trailingZeroBits($.pointerValue<Int>(x).abs)
	}

	public Uint64(): bigint {
		const x: Int | $.VarRef<Int> | null = this
		return low64(($.pointerValue<Int>(x).abs as __goscript_nat.nat))
	}

	public async UnmarshalJSON(text: $.Slice<number>): globalThis.Promise<$.GoError> {
		const z: Int | $.VarRef<Int> | null = this

		if ($.stringEqual($.bytesToString(text), "null")) {
			return null
		}
		return Int.prototype.UnmarshalText.call(z, text)
	}

	public async UnmarshalText(text: $.Slice<number>): globalThis.Promise<$.GoError> {
		const z: Int | $.VarRef<Int> | null = this
		{
			let [, ok] = await Int.prototype.setFromScanner.call(z, $.interfaceValue<io.ByteScanner | null>(bytes.NewReader(text), "*bytes.Reader", { kind: $.TypeKind.Pointer, elemType: "bytes.Reader" }), 0)
			if (!ok) {
				return fmt.Errorf("math/big: cannot unmarshal %q into a *big.Int", $.interfaceValue<any>(text, "[]byte", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }))
			}
		}
		return null
	}

	public Xor(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): Int | $.VarRef<Int> | null {
		let z: Int | $.VarRef<Int> | null = this
		if ($.pointerValue<Int>(x).neg == $.pointerValue<Int>(y).neg) {
			if ($.pointerValue<Int>(x).neg) {
				// (-x) ^ (-y) == ^(x-1) ^ ^(y-1) == (x-1) ^ (y-1)
				let x1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
				let y1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
				$.pointerValue<Int>(z).abs = (__goscript_nat.nat_xor($.pointerValue<Int>(z).abs, (x1 as __goscript_nat.nat), (y1 as __goscript_nat.nat)) as __goscript_nat.nat)
				$.pointerValue<Int>(z).neg = false
				return z
			}

			// x ^ y == x ^ y
			$.pointerValue<Int>(z).abs = (__goscript_nat.nat_xor($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).neg = false
			return z
		}

		// x.neg != y.neg
		if ($.pointerValue<Int>(x).neg) {
			let __goscriptAssign4_0: Int | $.VarRef<Int> | null = y
			let __goscriptAssign4_1: Int | $.VarRef<Int> | null = x
			x = __goscriptAssign4_0
			y = __goscriptAssign4_1
		}

		// x ^ (-y) == x ^ ^(y-1) == ^(x ^ (y-1)) == -((x ^ (y-1)) + 1)
		let y1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).abs = (__goscript_nat.nat_add($.pointerValue<Int>(z).abs, (__goscript_nat.nat_xor($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (y1 as __goscript_nat.nat)) as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = true
		return z
	}

	public async exp(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null, m: Int | $.VarRef<Int> | null, slow: boolean): globalThis.Promise<Int | $.VarRef<Int> | null> {
		let z: Int | $.VarRef<Int> | null = this
		// See Knuth, volume 2, section 4.6.3.
		let xWords: __goscript_nat.nat = ($.pointerValue<Int>(x).abs as __goscript_nat.nat)
		if ($.pointerValue<Int>(y).neg) {
			if ((m == null) || ($.len(($.pointerValue<Int>(m).abs as __goscript_nat.nat)) == 0)) {
				return Int.prototype.SetInt64.call(z, 1n)
			}
			// for y < 0: x**y mod m == (x**(-1))**|y| mod m
			let inverse: Int | $.VarRef<Int> | null = await Int.prototype.ModInverse.call(new Int(), x, m)
			if (inverse == null) {
				return null
			}
			xWords = ($.pointerValue<Int>(inverse).abs as __goscript_nat.nat)
		}
		let yWords: __goscript_nat.nat = ($.pointerValue<Int>(y).abs as __goscript_nat.nat)

		let mWords: __goscript_nat.nat = null! as __goscript_nat.nat
		if (m != null) {
			if (($.pointerEqual(z, m)) || __goscript_nat.alias(($.pointerValue<Int>(z).abs as __goscript_nat.nat), ($.pointerValue<Int>(m).abs as __goscript_nat.nat))) {
				m = Int.prototype.Set.call(new Int(), m)
			}
			mWords = ($.pointerValue<Int>(m).abs as __goscript_nat.nat)
		}

		$.pointerValue<Int>(z).abs = (await __goscript_nat.nat_expNN($.pointerValue<Int>(z).abs, null, (xWords as __goscript_nat.nat), (yWords as __goscript_nat.nat), (mWords as __goscript_nat.nat), slow) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = ((($.len(($.pointerValue<Int>(z).abs as __goscript_nat.nat)) > 0) && $.pointerValue<Int>(x).neg) && ($.len((yWords as __goscript_nat.nat)) > 0)) && (($.uint($.uint64And($.arrayIndex(yWords!, 0), 1n), 64)) == 1)
		if ($.pointerValue<Int>(z).neg && ($.len((mWords as __goscript_nat.nat)) > 0)) {
			// make modulus result positive
			$.pointerValue<Int>(z).abs = (__goscript_nat.nat_sub($.pointerValue<Int>(z).abs, (mWords as __goscript_nat.nat), ($.pointerValue<Int>(z).abs as __goscript_nat.nat)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).neg = false
		}

		return z
	}

	public async expSlow(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null, m: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		const z: Int | $.VarRef<Int> | null = this
		return Int.prototype.exp.call(z, x, y, m, true)
	}

	public async lehmerGCD(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null, a: Int | $.VarRef<Int> | null, b: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		const z: Int | $.VarRef<Int> | null = this
		let A: Int | $.VarRef<Int> | null = null! as Int | $.VarRef<Int> | null
		let B: Int | $.VarRef<Int> | null = null! as Int | $.VarRef<Int> | null
		let Ua: Int | $.VarRef<Int> | null = null! as Int | $.VarRef<Int> | null
		let Ub: Int | $.VarRef<Int> | null = null! as Int | $.VarRef<Int> | null

		A = Int.prototype.Abs.call(new Int(), a)
		B = Int.prototype.Abs.call(new Int(), b)

		let extended = (x != null) || (y != null)

		if (extended) {
			// Ua (Ub) tracks how many times input a has been accumulated into A (B).
			Ua = Int.prototype.SetInt64.call(new Int(), 1n)
			Ub = new Int()
		}

		// temp variables for multiprecision update
		let q: Int | $.VarRef<Int> | null = new Int()
		let r: Int | $.VarRef<Int> | null = new Int()

		// ensure A >= B
		if (__goscript_nat.nat_cmp($.pointerValue<Int>(A).abs, ($.pointerValue<Int>(B).abs as __goscript_nat.nat)) < 0) {
			let __goscriptAssign5_0: Int | $.VarRef<Int> | null = B
			let __goscriptAssign5_1: Int | $.VarRef<Int> | null = A
			A = __goscriptAssign5_0
			B = __goscriptAssign5_1
			let __goscriptAssign6_0: Int | $.VarRef<Int> | null = Ua
			let __goscriptAssign6_1: Int | $.VarRef<Int> | null = Ub
			Ub = __goscriptAssign6_0
			Ua = __goscriptAssign6_1
		}

		// loop invariant A >= B
		while ($.len(($.pointerValue<Int>(B).abs as __goscript_nat.nat)) > 1) {
			// Attempt to calculate in single-precision using leading words of A and B.
			let [u0, u1, v0, v1, even] = lehmerSimulate(A, B)

			// multiprecision Step
			if (v0 != 0) {
				// Simulate the effect of the single-precision steps using the cosequences.
				// A = u0*A + v0*B
				// B = u1*A + v1*B
				lehmerUpdate(A, B, q, r, u0, u1, v0, v1, even)

				if (extended) {
					// Ua = u0*Ua + v0*Ub
					// Ub = u1*Ua + v1*Ub
					lehmerUpdate(Ua, Ub, q, r, u0, u1, v0, v1, even)
				}
			} else {
				// Single-digit calculations failed to simulate any quotients.
				// Do a standard Euclidean step.
				let __goscriptTuple3: any = await euclidUpdate(A, B, Ua, Ub, q, r, extended)
				A = __goscriptTuple3[0]
				B = __goscriptTuple3[1]
				r = __goscriptTuple3[2]
				Ua = __goscriptTuple3[3]
				Ub = __goscriptTuple3[4]
			}
		}

		if ($.len(($.pointerValue<Int>(B).abs as __goscript_nat.nat)) > 0) {
			// extended Euclidean algorithm base case if B is a single Word
			if ($.len(($.pointerValue<Int>(A).abs as __goscript_nat.nat)) > 1) {
				// A is longer than a single Word, so one update is needed.
				let __goscriptTuple4: any = await euclidUpdate(A, B, Ua, Ub, q, r, extended)
				A = __goscriptTuple4[0]
				B = __goscriptTuple4[1]
				r = __goscriptTuple4[2]
				Ua = __goscriptTuple4[3]
				Ub = __goscriptTuple4[4]
			}
			if ($.len(($.pointerValue<Int>(B).abs as __goscript_nat.nat)) > 0) {
				// A and B are both a single Word.
				let aWord = $.arrayIndex($.pointerValue<Int>(A).abs!, 0)
				let bWord = $.arrayIndex($.pointerValue<Int>(B).abs!, 0)
				if (extended) {
					let ua: __goscript_arith.Word = 0
					let ub: __goscript_arith.Word = 0
					let va: __goscript_arith.Word = 0
					let vb: __goscript_arith.Word = 0
					let __goscriptAssign7_0: __goscript_arith.Word = 1
					let __goscriptAssign7_1: __goscript_arith.Word = 0
					ua = __goscriptAssign7_0
					ub = __goscriptAssign7_1
					let __goscriptAssign8_0: __goscript_arith.Word = 0
					let __goscriptAssign8_1: __goscript_arith.Word = 1
					va = __goscriptAssign8_0
					vb = __goscriptAssign8_1
					let even = true
					while (bWord != 0) {
						let __goscriptShadow0 = $.uint($.uint64Div(aWord, bWord), 64)
						let __goscriptShadow1 = $.uint($.uint64Mod(aWord, bWord), 64)
						let __goscriptAssign9_0: __goscript_arith.Word = bWord
						let __goscriptAssign9_1: __goscript_arith.Word = __goscriptShadow1
						aWord = __goscriptAssign9_0
						bWord = __goscriptAssign9_1
						let __goscriptAssign10_0: __goscript_arith.Word = ub
						let __goscriptAssign10_1: __goscript_arith.Word = $.uint($.uint64Add(ua, ($.uint($.uint64Mul(__goscriptShadow0, ub), 64))), 64)
						ua = __goscriptAssign10_0
						ub = __goscriptAssign10_1
						let __goscriptAssign11_0: __goscript_arith.Word = vb
						let __goscriptAssign11_1: __goscript_arith.Word = $.uint($.uint64Add(va, ($.uint($.uint64Mul(__goscriptShadow0, vb), 64))), 64)
						va = __goscriptAssign11_0
						vb = __goscriptAssign11_1
						even = !even
					}

					mulW(Ua, Ua, !even, ua)
					mulW(Ub, Ub, even, va)
					Int.prototype.Add.call(Ua, Ua, Ub)
				} else {
					while (bWord != 0) {
						let __goscriptAssign12_0: __goscript_arith.Word = bWord
						let __goscriptAssign12_1: __goscript_arith.Word = $.uint($.uint64Mod(aWord, bWord), 64)
						aWord = __goscriptAssign12_0
						bWord = __goscriptAssign12_1
					}
				}
				$.pointerValue<Int>(A).abs![0] = aWord
			}
		}
		let negA = $.pointerValue<Int>(a).neg
		if (y != null) {
			// avoid aliasing b needed in the division below
			if ($.pointerEqual(y, b)) {
				Int.prototype.Set.call(B, b)
			} else {
				B = b
			}
			// y = (z - a*x)/b
			await Int.prototype.Mul.call(y, a, Ua)
			if (negA) {
				$.pointerValue<Int>(y).neg = !$.pointerValue<Int>(y).neg
			}
			Int.prototype.Sub.call(y, A, y)
			await Int.prototype.Div.call(y, y, B)
		}

		if (x != null) {
			Int.prototype.Set.call(x, Ua)
			if (negA) {
				$.pointerValue<Int>(x).neg = !$.pointerValue<Int>(x).neg
			}
		}

		Int.prototype.Set.call(z, A)

		return z
	}

	public async modSqrt3Mod4Prime(x: Int | $.VarRef<Int> | null, p: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		const z: Int | $.VarRef<Int> | null = this
		let e: Int | $.VarRef<Int> | null = Int.prototype.Add.call(new Int(), p, __goscript_get_intOne())
		Int.prototype.Rsh.call(e, e, 2)
		await Int.prototype.Exp.call(z, x, e, p)
		return z
	}

	public async modSqrt5Mod8Prime(x: Int | $.VarRef<Int> | null, p: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		const z: Int | $.VarRef<Int> | null = this
		// p == 5 mod 8 implies p = e*8 + 5
		// e is the quotient and 5 the remainder on division by 8
		let e: Int | $.VarRef<Int> | null = Int.prototype.Rsh.call(new Int(), p, 3)
		let tx: Int | $.VarRef<Int> | null = Int.prototype.Lsh.call(new Int(), x, 1)
		let alpha: Int | $.VarRef<Int> | null = await Int.prototype.Exp.call(new Int(), tx, e, p)
		let beta: Int | $.VarRef<Int> | null = await Int.prototype.Mul.call(new Int(), alpha, alpha)
		await Int.prototype.Mod.call(beta, beta, p)
		await Int.prototype.Mul.call(beta, beta, tx)
		await Int.prototype.Mod.call(beta, beta, p)
		Int.prototype.Sub.call(beta, beta, __goscript_get_intOne())
		await Int.prototype.Mul.call(beta, beta, x)
		await Int.prototype.Mod.call(beta, beta, p)
		await Int.prototype.Mul.call(beta, beta, alpha)
		await Int.prototype.Mod.call(z, beta, p)
		return z
	}

	public async modSqrtTonelliShanks(x: Int | $.VarRef<Int> | null, p: Int | $.VarRef<Int> | null): globalThis.Promise<Int | $.VarRef<Int> | null> {
		const z: Int | $.VarRef<Int> | null = this
		// Break p-1 into s*2^e such that s is odd.
		let s: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		s.value.Sub(p, __goscript_get_intOne())
		let e = __goscript_nat.nat_trailingZeroBits(s.value.abs)
		s.value.Rsh(s, e)

		// find some non-square n
		let n: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		n.value.SetInt64(2n)
		while (await Jacobi(n, p) != -1) {
			n.value.Add(n, __goscript_get_intOne())
		}

		// Core of the Tonelli-Shanks algorithm. Follows the description in
		// section 6 of "Square roots from 1; 24, 51, 10 to Dan Shanks" by Ezra
		// Brown:
		// https://www.maa.org/sites/default/files/pdf/upload_library/22/Polya/07468342.di020786.02p0470a.pdf
		let y: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		let b: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		let g: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		let t: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
		y.value.Add(s, __goscript_get_intOne())
		y.value.Rsh(y, 1)
		await y.value.Exp(x, y, p)
		await b.value.Exp(x, s, p)
		await g.value.Exp(n, s, p)
		let r = e
		while (true) {
			// find the least m such that ord_p(b) = 2^m
			let m: number = 0
			t.value.Set(b)
			while (t.value.Cmp(__goscript_get_intOne()) != 0) {
				await Int.prototype.Mod.call(await t.value.Mul(t, t), t, p)
				m++
			}

			if (m == 0) {
				return Int.prototype.Set.call(z, y)
			}

			await Int.prototype.Exp.call(Int.prototype.SetBit.call(t.value.SetInt64(0n), t, $.int($.uint($.uint64Sub(($.uint($.uint64Sub(r, m), 64)), 1n), 64)), 1), g, t, p)
			// t = g^(2^(r-m-1)) mod p
			await Int.prototype.Mod.call(await g.value.Mul(t, t), g, p)
			await Int.prototype.Mod.call(await y.value.Mul(y, t), y, p)
			await Int.prototype.Mod.call(await b.value.Mul(b, g), b, p)
			r = m
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async mul(stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null, x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): globalThis.Promise<void> {
		let z: Int | $.VarRef<Int> | null = this
		// x * y == x * y
		// x * (-y) == -(x * y)
		// (-x) * y == -(x * y)
		// (-x) * (-y) == x * y
		if ($.pointerEqual(x, y)) {
			$.pointerValue<Int>(z).abs = (await __goscript_natmul.nat_sqr($.pointerValue<Int>(z).abs, stk, ($.pointerValue<Int>(x).abs as __goscript_nat.nat)) as __goscript_nat.nat)
			$.pointerValue<Int>(z).neg = false
			return
		}
		$.pointerValue<Int>(z).abs = (await __goscript_natmul.nat_mul($.pointerValue<Int>(z).abs, stk, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), ($.pointerValue<Int>(y).abs as __goscript_nat.nat)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = ($.len(($.pointerValue<Int>(z).abs as __goscript_nat.nat)) > 0) && ($.pointerValue<Int>(x).neg != $.pointerValue<Int>(y).neg)
	}

	public async scaleDenom(stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null, x: Int | $.VarRef<Int> | null, f: __goscript_nat.nat): globalThis.Promise<void> {
		let z: Int | $.VarRef<Int> | null = this
		if ($.len((f as __goscript_nat.nat)) == 0) {
			Int.prototype.Set.call(z, x)
			return
		}
		$.pointerValue<Int>(z).abs = (await __goscript_natmul.nat_mul($.pointerValue<Int>(z).abs, stk, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), (f as __goscript_nat.nat)) as __goscript_nat.nat)
		$.pointerValue<Int>(z).neg = $.pointerValue<Int>(x).neg
	}

	public async scan(r: io.ByteScanner | null, base: number): globalThis.Promise<[Int | $.VarRef<Int> | null, number, $.GoError]> {
		let z: Int | $.VarRef<Int> | null = this

		let [neg, err] = await __goscript_intconv.scanSign(r)
		if (err != null) {
			return [null, 0, err]
		}

		let __goscriptTuple5: any = await __goscript_natconv.nat_scan($.pointerValue<Int>(z).abs, r, base, false)
		$.pointerValue<Int>(z).abs = (__goscriptTuple5[0] as __goscript_nat.nat)
		base = __goscriptTuple5[1]
		err = __goscriptTuple5[3]
		if (err != null) {
			return [null, base, err]
		}
		$.pointerValue<Int>(z).neg = ($.len(($.pointerValue<Int>(z).abs as __goscript_nat.nat)) > 0) && neg

		return [z, base, null]
	}

	public async setFromScanner(r: io.ByteScanner | null, base: number): globalThis.Promise<[Int | $.VarRef<Int> | null, boolean]> {
		const z: Int | $.VarRef<Int> | null = this
		{
			let [, , err] = await Int.prototype.scan.call(z, r, base)
			if (err != null) {
				return [null, false]
			}
		}
		// entire content must have been consumed
		{
			let [, err] = await $.pointerValue<Exclude<io.ByteScanner, null>>(r).ReadByte()
			if (!$.comparableEqual(err, io.EOF)) {
				return [null, false]
			}
		}
		return [z, true]
	}

	static __typeInfo = $.registerStructType(
		"big.Int",
		() => new Int(),
		[{ name: "Abs", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Add", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "And", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "AndNot", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Append", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "base", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "AppendText", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "text", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "Binomial", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "k", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Bit", args: [{ name: "i", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint" } }] }, { name: "BitLen", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Bits", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint", typeName: "big.Word" } } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Cmp", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "r", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "CmpAbs", args: [{ name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Div", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "DivMod", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Exp", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "FillBytes", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Float64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float64" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "int8", typeName: "big.Accuracy" } }] }, { name: "Format", args: [{ name: "s", type: "fmt.State" }, { name: "ch", type: { kind: $.TypeKind.Basic, name: "int32" } }], returns: [] }, { name: "GCD", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "a", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "b", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "GobDecode", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "GobEncode", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Int64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "IsInt64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "IsUint64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Lsh", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "n", type: { kind: $.TypeKind.Basic, name: "uint" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "MarshalJSON", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "MarshalText", args: [], returns: [{ name: "text", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "Mod", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "ModInverse", args: [{ name: "g", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "n", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "ModSqrt", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "p", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Mul", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "MulRange", args: [{ name: "a", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "b", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Neg", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Not", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Or", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "ProbablyPrime", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Quo", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "QuoRem", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "r", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "_r1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Rand", args: [{ name: "rnd", type: { kind: $.TypeKind.Pointer, elemType: "rand.Rand" } }, { name: "n", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Rem", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Rsh", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "n", type: { kind: $.TypeKind.Basic, name: "uint" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Scan", args: [{ name: "s", type: "fmt.ScanState" }, { name: "ch", type: { kind: $.TypeKind.Basic, name: "int32" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Set", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "SetBit", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "i", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "b", type: { kind: $.TypeKind.Basic, name: "uint" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "SetBits", args: [{ name: "abs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint", typeName: "big.Word" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "SetBytes", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "SetInt64", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "SetString", args: [{ name: "s", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "base", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "SetUint64", args: [{ name: "x", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Sign", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Sqrt", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Sub", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Text", args: [{ name: "base", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "TrailingZeroBits", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint" } }] }, { name: "Uint64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }, { name: "UnmarshalJSON", args: [{ name: "text", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "UnmarshalText", args: [{ name: "text", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Xor", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "exp", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "slow", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "expSlow", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "m", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "lehmerGCD", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "a", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "b", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "modSqrt3Mod4Prime", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "p", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "modSqrt5Mod8Prime", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "p", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "modSqrtTonelliShanks", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "p", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "mul", args: [{ name: "stk", type: { kind: $.TypeKind.Pointer, elemType: "big.stack" } }, { name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [] }, { name: "scaleDenom", args: [{ name: "stk", type: { kind: $.TypeKind.Pointer, elemType: "big.stack" } }, { name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "f", type: { kind: $.TypeKind.Slice, typeName: "big.nat", elemType: { kind: $.TypeKind.Basic, name: "uint", typeName: "big.Word" } } }], returns: [] }, { name: "scan", args: [{ name: "r", type: "io.ByteScanner" }, { name: "base", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r2", type: "error" }] }, { name: "setFromScanner", args: [{ name: "r", type: "io.ByteScanner" }, { name: "base", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		Int,
		[{ name: "neg", key: "neg", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "math/big", index: [0], offset: 0, exported: false }, { name: "abs", key: "abs", type: { kind: $.TypeKind.Slice, typeName: "big.nat", elemType: { kind: $.TypeKind.Basic, name: "uint", typeName: "big.Word" } }, pkgPath: "math/big", index: [1], offset: 8, exported: false }]
	)
}

export var intOne: Int | $.VarRef<Int> | null

export function __goscript_init_intOne(): void {
	if (((intOne) as any) === undefined) {
		intOne = new Int({neg: false, abs: (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)})
	}
}

export function __goscript_get_intOne(): Int | $.VarRef<Int> | null {
	if (((intOne) as any) === undefined) {
		__goscript_init_intOne()
	}
	return intOne
}

export function __goscript_set_intOne(__goscriptValue: Int | $.VarRef<Int> | null): void {
	intOne = __goscriptValue
}

export function NewInt(x: bigint): Int | $.VarRef<Int> | null {
	// This code is arranged to be inlineable and produce
	// zero allocations when inlined. See issue 29951.
	let u = $.uint64(x)
	if (x < 0n) {
		u = -u
	}
	let abs: $.Slice<__goscript_arith.Word> = null! as $.Slice<__goscript_arith.Word>
	if (x == 0n) {
	} else {
		if (((64 as number) == 32) && (($.uint64Shr(u, 32n)) != 0n)) {
			abs = $.arrayToSlice<__goscript_arith.Word>([$.uint(u, 64), $.uint($.uint64Shr(u, 32n), 64)])
		} else {
			abs = $.arrayToSlice<__goscript_arith.Word>([$.uint(u, 64)])
		}
	}
	return new Int({neg: x < 0n, abs: (abs as __goscript_nat.nat)})
}

export function low32(x: __goscript_nat.nat): number {
	if ($.len((x as __goscript_nat.nat)) == 0) {
		return $.uint(0, 32)
	}
	return $.uint($.uint($.arrayIndex(x!, 0), 32), 32)
}

export function low64(x: __goscript_nat.nat): bigint {
	if ($.len((x as __goscript_nat.nat)) == 0) {
		return 0n
	}
	let v = $.uint64($.arrayIndex(x!, 0))
	if (((64 as number) == 32) && ($.len((x as __goscript_nat.nat)) > 1)) {
		return $.uint64Or(($.uint64Mul($.uint64($.arrayIndex(x!, 1)), (2 ** 32))), v)
	}
	return v
}

export function lehmerSimulate(A: Int | $.VarRef<Int> | null, B: Int | $.VarRef<Int> | null): [__goscript_arith.Word, __goscript_arith.Word, __goscript_arith.Word, __goscript_arith.Word, boolean] {
	let u0: __goscript_arith.Word = 0
	let u1: __goscript_arith.Word = 0
	let v0: __goscript_arith.Word = 0
	let v1: __goscript_arith.Word = 0
	let even: boolean = false
	// initialize the digits
	let a1: __goscript_arith.Word = 0
	let a2: __goscript_arith.Word = 0
	let u2: __goscript_arith.Word = 0
	let v2: __goscript_arith.Word = 0

	let m = $.len(($.pointerValue<Int>(B).abs as __goscript_nat.nat))
	let n = $.len(($.pointerValue<Int>(A).abs as __goscript_nat.nat))

	// extract the top Word of bits from A and B
	let h = __goscript_arith.nlz($.arrayIndex($.pointerValue<Int>(A).abs!, n - 1))
	a1 = $.uint($.uint64Or(($.uint($.uint64Shl($.arrayIndex($.pointerValue<Int>(A).abs!, n - 1), h), 64)), ($.uint($.uint64Shr($.arrayIndex($.pointerValue<Int>(A).abs!, n - 2), ($.uint($.uint64Sub(64n, h), 64))), 64))), 64)
	// B may have implicit zero words in the high bits if the lengths differ
	switch (true) {
		case n == m:
		{
			a2 = $.uint($.uint64Or(($.uint($.uint64Shl($.arrayIndex($.pointerValue<Int>(B).abs!, n - 1), h), 64)), ($.uint($.uint64Shr($.arrayIndex($.pointerValue<Int>(B).abs!, n - 2), ($.uint($.uint64Sub(64n, h), 64))), 64))), 64)
			break
		}
		case n == (m + 1):
		{
			a2 = $.uint($.uint64Shr($.arrayIndex($.pointerValue<Int>(B).abs!, n - 2), ($.uint($.uint64Sub(64n, h), 64))), 64)
			break
		}
		default:
		{
			a2 = 0
			break
		}
	}

	// Since we are calculating with full words to avoid overflow,
	// we use 'even' to track the sign of the cosequences.
	// For even iterations: u0, v1 >= 0 && u1, v0 <= 0
	// For odd  iterations: u0, v1 <= 0 && u1, v0 >= 0
	// The first iteration starts with k=1 (odd).
	even = false
	// variables to track the cosequences
	let __goscriptAssign13_0: __goscript_arith.Word = 0
	let __goscriptAssign13_1: __goscript_arith.Word = 1
	let __goscriptAssign13_2: __goscript_arith.Word = 0
	u0 = __goscriptAssign13_0
	u1 = __goscriptAssign13_1
	u2 = __goscriptAssign13_2
	let __goscriptAssign14_0: __goscript_arith.Word = 0
	let __goscriptAssign14_1: __goscript_arith.Word = 0
	let __goscriptAssign14_2: __goscript_arith.Word = 1
	v0 = __goscriptAssign14_0
	v1 = __goscriptAssign14_1
	v2 = __goscriptAssign14_2

	// Calculate the quotient and cosequences using Collins' stopping condition.
	// Note that overflow of a Word is not possible when computing the remainder
	// sequence and cosequences since the cosequence size is bounded by the input size.
	// See section 4.2 of Jebelean for details.
	while ((a2 >= v2) && (($.uint($.uint64Sub(a1, a2), 64)) >= ($.uint($.uint64Add(v1, v2), 64)))) {
		let q = $.uint($.uint64Div(a1, a2), 64)
		let r = $.uint($.uint64Mod(a1, a2), 64)
		let __goscriptAssign15_0: __goscript_arith.Word = a2
		let __goscriptAssign15_1: __goscript_arith.Word = r
		a1 = __goscriptAssign15_0
		a2 = __goscriptAssign15_1
		let __goscriptAssign16_0: __goscript_arith.Word = u1
		let __goscriptAssign16_1: __goscript_arith.Word = u2
		let __goscriptAssign16_2: __goscript_arith.Word = $.uint($.uint64Add(u1, ($.uint($.uint64Mul(q, u2), 64))), 64)
		u0 = __goscriptAssign16_0
		u1 = __goscriptAssign16_1
		u2 = __goscriptAssign16_2
		let __goscriptAssign17_0: __goscript_arith.Word = v1
		let __goscriptAssign17_1: __goscript_arith.Word = v2
		let __goscriptAssign17_2: __goscript_arith.Word = $.uint($.uint64Add(v1, ($.uint($.uint64Mul(q, v2), 64))), 64)
		v0 = __goscriptAssign17_0
		v1 = __goscriptAssign17_1
		v2 = __goscriptAssign17_2
		even = !even
	}
	return [u0, u1, v0, v1, even]
}

export function lehmerUpdate(A: Int | $.VarRef<Int> | null, B: Int | $.VarRef<Int> | null, q: Int | $.VarRef<Int> | null, r: Int | $.VarRef<Int> | null, u0: __goscript_arith.Word, u1: __goscript_arith.Word, v0: __goscript_arith.Word, v1: __goscript_arith.Word, even: boolean): void {
	mulW(q, B, even, v0)
	mulW(r, A, even, u1)
	mulW(A, A, !even, u0)
	mulW(B, B, !even, v1)
	Int.prototype.Add.call(A, A, q)
	Int.prototype.Add.call(B, B, r)
}

export function mulW(z: Int | $.VarRef<Int> | null, x: Int | $.VarRef<Int> | null, neg: boolean, w: __goscript_arith.Word): void {
	$.pointerValue<Int>(z).abs = (__goscript_natmul.nat_mulAddWW($.pointerValue<Int>(z).abs, ($.pointerValue<Int>(x).abs as __goscript_nat.nat), w, 0) as __goscript_nat.nat)
	$.pointerValue<Int>(z).neg = $.pointerValue<Int>(x).neg != neg
}

export async function euclidUpdate(A: Int | $.VarRef<Int> | null, B: Int | $.VarRef<Int> | null, Ua: Int | $.VarRef<Int> | null, Ub: Int | $.VarRef<Int> | null, q: Int | $.VarRef<Int> | null, r: Int | $.VarRef<Int> | null, extended: boolean): globalThis.Promise<[Int | $.VarRef<Int> | null, Int | $.VarRef<Int> | null, Int | $.VarRef<Int> | null, Int | $.VarRef<Int> | null, Int | $.VarRef<Int> | null]> {
	let nA: Int | $.VarRef<Int> | null = null! as Int | $.VarRef<Int> | null
	let nB: Int | $.VarRef<Int> | null = null! as Int | $.VarRef<Int> | null
	let nr: Int | $.VarRef<Int> | null = null! as Int | $.VarRef<Int> | null
	let nUa: Int | $.VarRef<Int> | null = null! as Int | $.VarRef<Int> | null
	let nUb: Int | $.VarRef<Int> | null = null! as Int | $.VarRef<Int> | null
	await Int.prototype.QuoRem.call(q, A, B, r)

	if (extended) {
		// Ua, Ub = Ub, Ua-q*Ub
		await Int.prototype.Mul.call(q, q, Ub)
		let __goscriptAssign18_0: Int | $.VarRef<Int> | null = Ub
		let __goscriptAssign18_1: Int | $.VarRef<Int> | null = Ua
		Ua = __goscriptAssign18_0
		Ub = __goscriptAssign18_1
		Int.prototype.Sub.call(Ub, Ub, q)
	}

	return [B, r, A, Ua, Ub]
}

export async function nat_modInverse(z: __goscript_nat.nat, g: __goscript_nat.nat, n: __goscript_nat.nat): globalThis.Promise<__goscript_nat.nat> {
	// TODO(rsc): ModInverse should be implemented in terms of this function.
	return ($.pointerValue<Int>(await Int.prototype.ModInverse.call((new Int({abs: (z as __goscript_nat.nat)})), new Int({abs: (g as __goscript_nat.nat)}), new Int({abs: (n as __goscript_nat.nat)}))).abs as __goscript_nat.nat)
}

export async function Jacobi(x: Int | $.VarRef<Int> | null, y: Int | $.VarRef<Int> | null): globalThis.Promise<number> {
	if (($.len(($.pointerValue<Int>(y).abs as __goscript_nat.nat)) == 0) || (($.uint($.uint64And($.arrayIndex($.pointerValue<Int>(y).abs!, 0), 1n), 64)) == 0)) {
		$.panic(await fmt.Sprintf("big: invalid 2nd argument to Int.Jacobi: need odd integer but got %s", await Int.prototype.String.call(y)))
	}

	// We use the formulation described in chapter 2, section 2.4,
	// "The Yacas Book of Algorithms":
	// http://yacas.sourceforge.net/Algo.book.pdf

	let a: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
	let b: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
	let c: $.VarRef<Int> = $.varRef($.markAsStructValue(new Int()))
	a.value.Set(x)
	b.value.Set(y)
	let j = 1

	if (b.value.neg) {
		if (a.value.neg) {
			j = -1
		}
		b.value.neg = false
	}

	while (true) {
		if (b.value.Cmp(__goscript_get_intOne()) == 0) {
			return j
		}
		if ($.len((a.value.abs as __goscript_nat.nat)) == 0) {
			return 0
		}
		await a.value.Mod(a, b)
		if ($.len((a.value.abs as __goscript_nat.nat)) == 0) {
			return 0
		}
		// a > 0

		// handle factors of 2 in 'a'
		let s = __goscript_nat.nat_trailingZeroBits(a.value.abs)
		if (($.uint($.uint64And(s, 1n), 64)) != 0) {
			let bmod8 = $.uint($.uint64And($.arrayIndex(b.value.abs!, 0), 7n), 64)
			if ((bmod8 == 3) || (bmod8 == 5)) {
				j = -j
			}
		}
		c.value.Rsh(a, s)

		// swap numerator and denominator
		if ((($.uint($.uint64And($.arrayIndex(b.value.abs!, 0), 3n), 64)) == 3) && (($.uint($.uint64And($.arrayIndex(c.value.abs!, 0), 3n), 64)) == 3)) {
			j = -j
		}
		a.value.Set(b)
		b.value.Set(c)
	}
	throw new globalThis.Error("goscript: unreachable return")
}

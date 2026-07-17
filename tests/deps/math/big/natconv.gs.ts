// Generated file based on natconv.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as math from "@goscript/math/index.js"

import * as bits from "@goscript/math/bits/index.js"

import * as slices from "@goscript/slices/index.js"

import * as sync from "@goscript/sync/index.js"

import type * as rand from "@goscript/math/rand/index.js"

import * as __goscript_arith from "./arith.gs.ts"

import * as __goscript_arith_decl from "./arith_decl.gs.ts"

import * as __goscript_int from "./int.gs.ts"

import * as __goscript_nat from "./nat.gs.ts"

import * as __goscript_natdiv from "./natdiv.gs.ts"

import * as __goscript_natmul from "./natmul.gs.ts"

import * as __goscript_prime from "./prime.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/math/index.js"
import "@goscript/math/bits/index.js"
import "@goscript/slices/index.js"
import "@goscript/sync/index.js"
import "./arith.gs.ts"
import "./arith_decl.gs.ts"
import "./int.gs.ts"
import "./nat.gs.ts"
import "./natdiv.gs.ts"
import "./natmul.gs.ts"
import "./prime.gs.ts"

export class divisor {
	public get bbb(): __goscript_nat.nat {
		return this._fields.bbb.value
	}
	public set bbb(value: __goscript_nat.nat) {
		this._fields.bbb.value = value
	}

	public get nbits(): number {
		return this._fields.nbits.value
	}
	public set nbits(value: number) {
		this._fields.nbits.value = value
	}

	public get ndigits(): number {
		return this._fields.ndigits.value
	}
	public set ndigits(value: number) {
		this._fields.ndigits.value = value
	}

	public _fields: {
		bbb: $.VarRef<__goscript_nat.nat>
		nbits: $.VarRef<number>
		ndigits: $.VarRef<number>
	}

	constructor(init?: Partial<{bbb?: __goscript_nat.nat, nbits?: number, ndigits?: number}>) {
		this._fields = {
			bbb: $.varRef(init?.bbb ?? (null as __goscript_nat.nat)),
			nbits: $.varRef(init?.nbits ?? (0 as number)),
			ndigits: $.varRef(init?.ndigits ?? (0 as number))
		}
	}

	public clone(): divisor {
		const cloned = new divisor()
		cloned._fields = {
			bbb: $.varRef(this._fields.bbb.value),
			nbits: $.varRef(this._fields.nbits.value),
			ndigits: $.varRef(this._fields.ndigits.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"big.divisor",
		() => new divisor(),
		[],
		divisor,
		[{ name: "bbb", key: "bbb", type: { kind: $.TypeKind.Slice, typeName: "big.nat", elemType: { kind: $.TypeKind.Basic, name: "uint", typeName: "big.Word" } }, pkgPath: "math/big", index: [0], offset: 0, exported: false }, { name: "nbits", key: "nbits", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "math/big", index: [1], offset: 24, exported: false }, { name: "ndigits", key: "ndigits", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "math/big", index: [2], offset: 32, exported: false }]
	)
}

export const digits: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

export const MaxBase: number = 62

export const maxBaseSmall: number = 36

export function maxPow(b: __goscript_arith.Word): [__goscript_arith.Word, number] {
	let p: __goscript_arith.Word = 0
	let n: number = 0
	let __goscriptAssign0_0: __goscript_arith.Word = b
	let __goscriptAssign0_1: number = 1
	p = __goscriptAssign0_0
	n = __goscriptAssign0_1
	for (let max = $.uint($.uint64Div(18446744073709551615n, b), 64); p <= max; ) {
		// p == b**n && p <= max
		p = $.uint($.uint64Mul(p, b), 64)
		n++
	}
	// p == b**n && p <= _M
	return [p, n]
}

export function pow(x: __goscript_arith.Word, n: number): __goscript_arith.Word {
	let p: __goscript_arith.Word = 0
	// n == sum of bi * 2**i, for 0 <= i < imax, and bi is 0 or 1
	// thus x**n == product of x**(2**i) for all i where bi == 1
	// (Russian Peasant Method for exponentiation)
	p = 1
	while (n > 0) {
		if ((n & 1) != 0) {
			p = $.uint($.uint64Mul(p, x), 64)
		}
		x = $.uint($.uint64Mul(x, x), 64)
		n = n >> (1)
	}
	return p
}

export let errNoDigits: $.GoError = errors.New("number has no digits")

export function __goscript_set_errNoDigits(__goscriptValue: $.GoError): void {
	errNoDigits = __goscriptValue
}

export let errInvalSep: $.GoError = errors.New("'_' must separate successive digits")

export function __goscript_set_errInvalSep(__goscriptValue: $.GoError): void {
	errInvalSep = __goscriptValue
}

export async function nat_scan(z: __goscript_nat.nat, r: io.ByteScanner | null, base: number, fracOk: boolean): globalThis.Promise<[__goscript_nat.nat, number, number, $.GoError]> {
	let res: __goscript_nat.nat = null as __goscript_nat.nat
	let b: number = 0
	let count: number = 0
	let err: $.GoError = null as $.GoError
	// Reject invalid bases.
	let baseOk = ((base == 0) || ((!fracOk && (2 <= base)) && (base <= 62))) || (fracOk && ((((base == 2) || (base == 8)) || (base == 10)) || (base == 16)))
	if (!baseOk) {
		$.panic(await fmt.Sprintf("invalid number base %d", $.basicInterfaceValue(base, "int")))
	}

	// prev encodes the previously seen char: it is one
	// of '_', '0' (a digit), or '.' (anything else). A
	// valid separator '_' may only occur after a digit
	// and if base == 0.
	let prev = $.int(46, 32)
	let invalSep = false

	// one char look-ahead
	let __goscriptTuple0: any = await $.pointerValue<Exclude<io.ByteScanner, null>>(r).ReadByte()
	let ch = $.uint(__goscriptTuple0[0], 8)
	err = __goscriptTuple0[1]

	// Determine actual base.
	b = base
	let prefix = 0
	if (base == 0) {
		// Actual base is 10 unless there's a base prefix.
		b = 10
		if ((err == null) && ($.uint(ch, 8) == $.uint(48, 8))) {
			prev = $.int(48, 32)
			count = 1
			let __goscriptTuple1: any = await $.pointerValue<Exclude<io.ByteScanner, null>>(r).ReadByte()
			ch = $.uint(__goscriptTuple1[0], 8)
			err = __goscriptTuple1[1]
			if (err == null) {
				// possibly one of 0b, 0B, 0o, 0O, 0x, 0X
				switch (ch) {
					case 98:
					case 66:
					{
						let __goscriptAssign1_0: number = 2
						let __goscriptAssign1_1: number = 98
						b = __goscriptAssign1_0
						prefix = __goscriptAssign1_1
						break
					}
					case 111:
					case 79:
					{
						let __goscriptAssign2_0: number = 8
						let __goscriptAssign2_1: number = 111
						b = __goscriptAssign2_0
						prefix = __goscriptAssign2_1
						break
					}
					case 120:
					case 88:
					{
						let __goscriptAssign3_0: number = 16
						let __goscriptAssign3_1: number = 120
						b = __goscriptAssign3_0
						prefix = __goscriptAssign3_1
						break
					}
					default:
					{
						if (!fracOk) {
							let __goscriptAssign4_0: number = 8
							let __goscriptAssign4_1: number = 48
							b = __goscriptAssign4_0
							prefix = __goscriptAssign4_1
						}
						break
					}
				}
				if (prefix != 0) {
					count = 0
					if (prefix != 48) {
						let __goscriptTuple2: any = await $.pointerValue<Exclude<io.ByteScanner, null>>(r).ReadByte()
						ch = $.uint(__goscriptTuple2[0], 8)
						err = __goscriptTuple2[1]
					}
				}
			}
		}
	}

	// Convert string.
	// Algorithm: Collect digits in groups of at most n digits in di.
	// For bases that pack exactly into words (2, 4, 16), append di's
	// directly to the int representation and then reverse at the end (bn==0 marks this case).
	// For other bases, use mulAddWW for every such group to shift
	// z up one group and add di to the result.
	// With more cleverness we could also handle binary bases like 8 and 32
	// (corresponding to 3-bit and 5-bit chunks) that don't pack nicely into
	// words, but those are not too important.
	z = ($.goSlice(z, undefined, 0) as __goscript_nat.nat)
	let b1 = $.uint(b, 64)
	let bn: __goscript_arith.Word = 0
	let n: number = 0
	switch (b) {
		case 2:
		{
			n = 64
			break
		}
		case 4:
		{
			n = Math.trunc(64 / 2)
			break
		}
		case 16:
		{
			n = Math.trunc(64 / 4)
			break
		}
		default:
		{
			let __goscriptTuple3: any = maxPow(b1)
			bn = __goscriptTuple3[0]
			n = __goscriptTuple3[1]
			break
		}
	}
	let di = 0
	let i = 0
	let dp = -1
	while (err == null) {
		if (($.uint(ch, 8) == $.uint(46, 8)) && fracOk) {
			fracOk = false
			if ($.int(prev, 32) == $.int(95, 32)) {
				invalSep = true
			}
			prev = $.int(46, 32)
			dp = count
		} else {
			if (($.uint(ch, 8) == $.uint(95, 8)) && (base == 0)) {
				if ($.int(prev, 32) != $.int(48, 32)) {
					invalSep = true
				}
				prev = $.int(95, 32)
			} else {
				// convert rune into digit value d1
				let d1: __goscript_arith.Word = 0
				switch (true) {
					case ($.uint(48, 8) <= $.uint(ch, 8)) && ($.uint(ch, 8) <= $.uint(57, 8)):
					{
						d1 = $.uint(ch - 48, 64)
						break
					}
					case ($.uint(97, 8) <= $.uint(ch, 8)) && ($.uint(ch, 8) <= $.uint(122, 8)):
					{
						d1 = $.uint((ch - 97) + 10, 64)
						break
					}
					case ($.uint(65, 8) <= $.uint(ch, 8)) && ($.uint(ch, 8) <= $.uint(90, 8)):
					{
						if (b <= 36) {
							d1 = $.uint((ch - 65) + 10, 64)
						} else {
							d1 = $.uint((ch - 65) + 36, 64)
						}
						break
					}
					default:
					{
						d1 = $.uint($.uint64Add(62n, 1n), 64)
						break
					}
				}
				if (d1 >= b1) {
					await $.pointerValue<Exclude<io.ByteScanner, null>>(r).UnreadByte()
					break
				}
				prev = $.int(48, 32)
				count++

				// collect d1 in di
				di = $.uint($.uint64Add(($.uint($.uint64Mul(di, b1), 64)), d1), 64)
				i++

				// if di is "full", add it to the result
				if (i == n) {
					if (bn == 0) {
						z = ($.append((z as __goscript_nat.nat), di) as __goscript_nat.nat)
					} else {
						z = (__goscript_natmul.nat_mulAddWW(z, (z as __goscript_nat.nat), bn, di) as __goscript_nat.nat)
					}
					di = 0
					i = 0
				}
			}
		}

		let __goscriptTuple4: any = await $.pointerValue<Exclude<io.ByteScanner, null>>(r).ReadByte()
		ch = $.uint(__goscriptTuple4[0], 8)
		err = __goscriptTuple4[1]
	}

	if ($.comparableEqual(err, io.EOF)) {
		err = null
	}

	// other errors take precedence over invalid separators
	if ((err == null) && (invalSep || ($.int(prev, 32) == $.int(95, 32)))) {
		err = errInvalSep
	}

	if (count == 0) {
		// no digits found
		if (prefix == 48) {
			// there was only the octal prefix 0 (possibly followed by separators and digits > 7);
			// interpret as decimal 0
			return [($.goSlice(z, undefined, 0) as __goscript_nat.nat), 10, 1, err]
		}
		err = errNoDigits
	}

	if (bn == 0) {
		if (i > 0) {
			// Add remaining digit chunk to result.
			// Left-justify group's digits; will shift back down after reverse.
			z = ($.append((z as __goscript_nat.nat), $.uint($.uint64Mul(di, pow(b1, n - i)), 64)) as __goscript_nat.nat)
		}
		slices.Reverse((z as __goscript_nat.nat))
		z = (__goscript_nat.nat_norm(z) as __goscript_nat.nat)
		if (i > 0) {
			z = (__goscript_nat.nat_rsh(z, (z as __goscript_nat.nat), $.uint($.uint64Mul($.uint(n - i, 64), $.uint(Math.trunc(64 / n), 64)), 64)) as __goscript_nat.nat)
		}
	} else {
		if (i > 0) {
			// Add remaining digit chunk to result.
			z = (__goscript_natmul.nat_mulAddWW(z, (z as __goscript_nat.nat), pow(b1, i), di) as __goscript_nat.nat)
		}
	}
	res = (z as __goscript_nat.nat)

	// adjust count for fraction, if any
	if (dp >= 0) {
		// 0 <= dp <= count
		count = dp - count
	}

	return [res, b, count, err]
}

export async function nat_utoa(x: __goscript_nat.nat, base: number): globalThis.Promise<$.Slice<number>> {
	return nat_itoa(x, false, base)
}

export async function nat_itoa(x: __goscript_nat.nat, neg: boolean, base: number): globalThis.Promise<$.Slice<number>> {
	using __defer = new $.DisposableStack()
	if ((base < 2) || (base > 62)) {
		$.panic("invalid base")
	}

	// x == 0
	if ($.len((x as __goscript_nat.nat)) == 0) {
		return new Uint8Array([48])
	}
	// len(x) > 0

	// allocate buffer for conversion
	let i = $.int(__goscript_nat.nat_bitLen(x) / math.Log2(base)) + 1
	if (neg) {
		i++
	}
	let s: $.Slice<number> = $.makeSlice<number>(i, undefined, "byte")

	// convert power of two and non power of two bases separately
	{
		let b = $.uint(base, 64)
		if (b == ($.uint($.uint64And(b, -b), 64))) {
			// shift is base b digit size in bits
			let shift = $.uint(bits.TrailingZeros($.uint(b, 64)), 64)
			let mask = $.uint($.uint($.uint64Sub(($.uint($.uint64Shl(1n, shift), 64)), 1n), 64), 64)
			let w = $.arrayIndex(x!, 0)
			let nbits = $.uint(64, 64)

			// convert less-significant words (include leading zeros)
			for (let k = 1; k < $.len((x as __goscript_nat.nat)); k++) {
				// convert full digits
				while (nbits >= shift) {
					i--
					s![i] = $.uint($.indexStringOrBytes("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", $.uint($.uint64And(w, mask), 64)), 8)
					w = $.uint($.uint64Shr(w, shift), 64)
					nbits = $.uint($.uint64Sub(nbits, shift), 64)
				}

				// convert any partial leading digit and advance to next word
				if (nbits == 0) {
					// no partial digit remaining, just advance
					w = $.arrayIndex(x!, k)
					nbits = 64
				} else {
					// partial digit in current word w (== x[k-1]) and next word x[k]
					w = $.uint($.uint64Or(w, $.uint($.uint64Shl($.arrayIndex(x!, k), nbits), 64)), 64)
					i--
					s![i] = $.uint($.indexStringOrBytes("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", $.uint($.uint64And(w, mask), 64)), 8)

					// advance
					w = $.uint($.uint64Shr($.arrayIndex(x!, k), ($.uint($.uint64Sub(shift, nbits), 64))), 64)
					nbits = $.uint($.uint64Sub(64n, ($.uint($.uint64Sub(shift, nbits), 64))), 64)
				}
			}

			// convert digits of most-significant word w (omit leading zeros)
			while (w != 0) {
				i--
				s![i] = $.uint($.indexStringOrBytes("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", $.uint($.uint64And(w, mask), 64)), 8)
				w = $.uint($.uint64Shr(w, shift), 64)
			}
		} else {
			let stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null = await __goscript_nat.getStack()
			__defer.defer(() => { __goscript_nat.stack.prototype.free.call(stk) })

			let [bb, ndigits] = maxPow(b)

			// construct table of successive squares of bb*leafSize to use in subdivisions
			// result (table != nil) <=> (len(x) > leafSize > 0)
			let table: $.Slice<divisor> = await divisors(stk, $.len((x as __goscript_nat.nat)), b, ndigits, bb)

			// preserve x, create local copy for use by convertWords
			let q: __goscript_nat.nat = (__goscript_nat.nat__set((null as __goscript_nat.nat), (x as __goscript_nat.nat)) as __goscript_nat.nat)

			// convert q to string s in base b
			await nat_convertWords(q, stk, s, b, ndigits, bb, table)

			// strip leading zeros
			// (x != 0; thus s must contain at least one non-zero digit
			// and the loop will terminate)
			i = 0
			while ($.uint($.arrayIndex(s!, i), 8) == $.uint(48, 8)) {
				i++
			}
		}
	}

	if (neg) {
		i--
		s![i] = $.uint(45, 8)
	}

	return $.goSlice(s, i, undefined)
}

export async function nat_convertWords(q: __goscript_nat.nat, stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null, s: $.Slice<number>, b: __goscript_arith.Word, ndigits: number, bb: __goscript_arith.Word, table: $.Slice<divisor>): globalThis.Promise<void> {
	// split larger blocks recursively
	if (table != null) {
		// len(q) > leafSize > 0
		let r: __goscript_nat.nat = null as __goscript_nat.nat
		let index = $.len(table) - 1
		while ($.len((q as __goscript_nat.nat)) > __goscript_get_leafSize()) {
			// find divisor close to sqrt(q) if possible, but in any case < q
			let maxLength = __goscript_nat.nat_bitLen(q)
			let minLength = maxLength >> 1
			while ((index > 0) && ($.arrayIndex(table!, index - 1).nbits > minLength)) {
				index--
			}
			if (($.arrayIndex(table!, index).nbits >= maxLength) && (__goscript_nat.nat_cmp($.arrayIndex(table!, index).bbb, (q as __goscript_nat.nat)) >= 0)) {
				index--
				if (index < 0) {
					$.panic("internal inconsistency")
				}
			}

			// split q into the two digit number (q'*bbb + r) to form independent subblocks
			let __goscriptTuple5: any = await __goscript_natdiv.nat_div(q, stk, (r as __goscript_nat.nat), (q as __goscript_nat.nat), ($.arrayIndex(table!, index).bbb as __goscript_nat.nat))
			q = (__goscriptTuple5[0] as __goscript_nat.nat)
			r = (__goscriptTuple5[1] as __goscript_nat.nat)

			// convert subblocks and collect results in s[:h] and s[h:]
			let h = $.len(s) - $.arrayIndex(table!, index).ndigits
			await nat_convertWords(r, stk, $.goSlice(s, h, undefined), b, ndigits, bb, $.goSlice(table, 0, index))
			s = $.goSlice(s, undefined, h)
		}
	}

	// having split any large blocks now process the remaining (small) block iteratively
	let i = $.len(s)
	let r: __goscript_arith.Word = 0
	if (b == 10) {
		// hard-coding for 10 here speeds this up by 1.25x (allows for / and % by constants)
		while ($.len((q as __goscript_nat.nat)) > 0) {
			// extract least significant, base bb "digit"
			let __goscriptTuple6: any = __goscript_natdiv.nat_divW(q, (q as __goscript_nat.nat), bb)
			q = (__goscriptTuple6[0] as __goscript_nat.nat)
			r = __goscriptTuple6[1]
			for (let j = 0; (j < ndigits) && (i > 0); j++) {
				i--
				// avoid % computation since r%10 == r - int(r/10)*10;
				// this appears to be faster for BenchmarkString10000Base10
				// and smaller strings (but a bit slower for larger ones)
				let t = $.uint($.uint64Div(r, 10n), 64)
				s![i] = $.uint(48 + $.uint($.uint($.uint64Sub(r, ($.uint($.uint64Mul(t, 10n), 64))), 64), 8), 8)
				r = t
			}
		}
	} else {
		while ($.len((q as __goscript_nat.nat)) > 0) {
			// extract least significant, base bb "digit"
			let __goscriptTuple7: any = __goscript_natdiv.nat_divW(q, (q as __goscript_nat.nat), bb)
			q = (__goscriptTuple7[0] as __goscript_nat.nat)
			r = __goscriptTuple7[1]
			for (let j = 0; (j < ndigits) && (i > 0); j++) {
				i--
				s![i] = $.uint($.indexStringOrBytes("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", $.uint($.uint64Mod(r, b), 64)), 8)
				r = $.uint($.uint64Div(r, b), 64)
			}
		}
	}

	// prepend high-order zeros
	while (i > 0) {
		i--
		s![i] = $.uint(48, 8)
	}
}

export var leafSize: number

export function __goscript_init_leafSize(): void {
	if (((leafSize) as any) === undefined) {
		leafSize = 8
	}
}

export function __goscript_get_leafSize(): number {
	if (((leafSize) as any) === undefined) {
		__goscript_init_leafSize()
	}
	return leafSize
}

export function __goscript_set_leafSize(__goscriptValue: number): void {
	leafSize = __goscriptValue
}

export var cacheBase10: $.VarRef<{"Mutex": sync.Mutex, "table": divisor[]}>

export function __goscript_init_cacheBase10(): void {
	if (((cacheBase10) as any) === undefined) {
		cacheBase10 = $.varRef({"Mutex": $.markAsStructValue(new sync.Mutex()), "table": Array.from({ length: 64 }, () => $.markAsStructValue(new divisor()))})
	}
}

export function __goscript_get_cacheBase10(): $.VarRef<{"Mutex": sync.Mutex, "table": divisor[]}> {
	if (((cacheBase10) as any) === undefined) {
		__goscript_init_cacheBase10()
	}
	return cacheBase10
}

export function __goscript_set_cacheBase10(__goscriptValue: {"Mutex": sync.Mutex, "table": divisor[]}): void {
	__goscript_get_cacheBase10().value = __goscriptValue
}

export async function nat_expWW(z: __goscript_nat.nat, stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null, x: __goscript_arith.Word, y: __goscript_arith.Word): globalThis.Promise<__goscript_nat.nat> {
	return (await __goscript_nat.nat_expNN(z, stk, (__goscript_nat.nat_setWord((null as __goscript_nat.nat), x) as __goscript_nat.nat), (__goscript_nat.nat_setWord((null as __goscript_nat.nat), y) as __goscript_nat.nat), (null as __goscript_nat.nat), false) as __goscript_nat.nat)
}

export async function divisors(stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null, m: number, b: __goscript_arith.Word, ndigits: number, bb: __goscript_arith.Word): globalThis.Promise<$.Slice<divisor>> {
	// only compute table when recursive conversion is enabled and x is large
	if ((__goscript_get_leafSize() == 0) || (m <= __goscript_get_leafSize())) {
		return null
	}

	// determine k where (bb**leafSize)**(2**k) >= sqrt(x)
	let k = 1
	for (let words = __goscript_get_leafSize(); (words < (m >> 1)) && (k < $.len(__goscript_get_cacheBase10().value.table)); words = words << (1)) {
		k++
	}

	// reuse and extend existing table of divisors or create new table as appropriate
	let table: $.Slice<divisor> = null as $.Slice<divisor>
	if (b == 10) {
		await __goscript_get_cacheBase10().value.Mutex.Lock()
		table = $.goSlice(__goscript_get_cacheBase10().value.table, 0, k)
	} else {
		table = $.makeSlice<divisor>(k, undefined, undefined, () => $.markAsStructValue(new divisor()))
	}

	// extend table
	if ($.arrayIndex(table!, k - 1).ndigits == 0) {
		// add new entries as needed
		let larger: __goscript_nat.nat = null as __goscript_nat.nat
		for (let i = 0; i < k; i++) {
			if ($.arrayIndex(table!, i).ndigits == 0) {
				if (i == 0) {
					$.arrayIndex(table!, 0).bbb = (await nat_expWW((null as __goscript_nat.nat), stk, bb, $.uint(__goscript_get_leafSize(), 64)) as __goscript_nat.nat)
					$.arrayIndex(table!, 0).ndigits = ndigits * __goscript_get_leafSize()
				} else {
					$.arrayIndex(table!, i).bbb = (await __goscript_natmul.nat_sqr((null as __goscript_nat.nat), stk, ($.arrayIndex(table!, i - 1).bbb as __goscript_nat.nat)) as __goscript_nat.nat)
					$.arrayIndex(table!, i).ndigits = 2 * $.arrayIndex(table!, i - 1).ndigits
				}

				// optimization: exploit aggregated extra bits in macro blocks
				larger = (__goscript_nat.nat__set((null as __goscript_nat.nat), ($.arrayIndex(table!, i).bbb as __goscript_nat.nat)) as __goscript_nat.nat)
				while (__goscript_arith_decl.mulAddVWW(larger, larger, b, 0) == 0) {
					$.arrayIndex(table!, i).bbb = (__goscript_nat.nat__set($.arrayIndex(table!, i).bbb, (larger as __goscript_nat.nat)) as __goscript_nat.nat)
					$.arrayIndex(table!, i).ndigits++
				}

				$.arrayIndex(table!, i).nbits = __goscript_nat.nat_bitLen($.arrayIndex(table!, i).bbb)
			}
		}
	}

	if (b == 10) {
		__goscript_get_cacheBase10().value.Mutex.Unlock()
	}

	return table
}

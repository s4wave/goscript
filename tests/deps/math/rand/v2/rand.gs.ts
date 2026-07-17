// Generated file based on rand.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"

import * as bits from "@goscript/math/bits/index.js"

import "@goscript/unsafe/index.js"

import * as __goscript_exp from "./exp.gs.ts"

import * as __goscript_normal from "./normal.gs.ts"
import "@goscript/math/index.js"
import "@goscript/math/bits/index.js"
import "./exp.gs.ts"
import "./normal.gs.ts"

export type Source = {
	Uint64(): bigint | globalThis.Promise<bigint>
}

$.registerInterfaceType(
	"rand.Source",
	null,
	[{ name: "Uint64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }]
);

export type intType = any

$.registerInterfaceType(
	"rand.intType",
	null,
	[]
);

export class Rand {
	public get src(): Source | null {
		return this._fields.src.value
	}
	public set src(value: Source | null) {
		this._fields.src.value = value
	}

	public _fields: {
		src: $.VarRef<Source | null>
	}

	constructor(init?: Partial<{src?: Source | null}>) {
		this._fields = {
			src: $.varRef(init?.src ?? (null as Source | null))
		}
	}

	public clone(): Rand {
		const cloned = new Rand()
		cloned._fields = {
			src: $.varRef(this._fields.src.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ExpFloat64(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		while (true) {
			let u = await Rand.prototype.Uint64.call(r)
			let j = $.uint($.uint(u, 32), 32)
			let i = $.uint($.uint($.uint64Shr(u, 32n), 8), 8)
			let x = j * $.arrayIndex(__goscript_exp.we, i)
			if ($.uint(j, 32) < $.uint($.arrayIndex(__goscript_exp.ke, i), 32)) {
				return x
			}
			if ($.uint(i, 8) == $.uint(0, 8)) {
				return 192427936753276243/25000000000000000 - math.Log(await Rand.prototype.Float64.call(r))
			}
			if (($.float32($.arrayIndex(__goscript_exp.fe, i) + ($.float32($.float32(await Rand.prototype.Float64.call(r)) * ($.float32($.arrayIndex(__goscript_exp.fe, i - 1) - $.arrayIndex(__goscript_exp.fe, i))))))) < $.float32(math.Exp(-x))) {
				return x
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Float32(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		// There are exactly 1<<24 float32s in [0,1). Use Intn(1<<24) / (1<<24).
		return $.float32($.float32($.uintShr((await Rand.prototype.Uint32.call(r) << 8), 8, 32)) / (16777216))
	}

	public async Float64(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		// There are exactly 1<<53 float64s in [0,1). Use Intn(1<<53) / (1<<53).
		return Number($.uint64Shr(($.uint64Shl(await Rand.prototype.Uint64.call(r), 11n)), 11n)) / (9007199254740992)
	}

	public async Int(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		return $.int($.uint($.uint64Shr(($.uint($.uint64Shl($.uint(await $.pointerValue<Exclude<Source, null>>($.pointerValue<Rand>(r).src).Uint64(), 64), 1n), 64)), 1n), 64))
	}

	public async Int32(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		return $.int($.int($.uint64Shr(await $.pointerValue<Exclude<Source, null>>($.pointerValue<Rand>(r).src).Uint64(), 33n), 32), 32)
	}

	public async Int32N(n: number): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		if ($.int(n, 32) <= $.int(0, 32)) {
			$.panic("invalid argument to Int32N")
		}
		return $.int($.int(await Rand.prototype.uint64n.call(r, $.uint64(n)), 32), 32)
	}

	public async Int64(): globalThis.Promise<bigint> {
		const r: Rand | $.VarRef<Rand> | null = this
		return $.int64($.uint64AndNot(await $.pointerValue<Exclude<Source, null>>($.pointerValue<Rand>(r).src).Uint64(), 9223372036854775808n))
	}

	public async Int64N(n: bigint): globalThis.Promise<bigint> {
		const r: Rand | $.VarRef<Rand> | null = this
		if (n <= 0n) {
			$.panic("invalid argument to Int64N")
		}
		return $.int64(await Rand.prototype.uint64n.call(r, $.uint64(n)))
	}

	public async IntN(n: number): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		if (n <= 0) {
			$.panic("invalid argument to IntN")
		}
		return $.int(await Rand.prototype.uint64n.call(r, $.uint64(n)))
	}

	public async NormFloat64(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		while (true) {
			let u = await Rand.prototype.Uint64.call(r)
			let j = $.int($.int(u, 32), 32)
			let i = $.uint64And(($.uint64Shr(u, 32n)), 127n)
			let x = j * $.arrayIndex(__goscript_normal.wn, Number(i))
			if ($.uint(__goscript_normal.absInt32($.int(j, 32)), 32) < $.uint($.arrayIndex(__goscript_normal.kn, Number(i)), 32)) {
				// Int64 returns a non-negative pseudo-random 63-bit integer as an int64.
				return x
			}
			// Uint32 returns a pseudo-random 32-bit value as a uint32.
			if (i == 0n) {

				while (true) {
					x = -math.Log(await Rand.prototype.Float64.call(r)) * (1.0 / 3442619855899/1000000000000)
					let y = -math.Log(await Rand.prototype.Float64.call(r))
					if ((y + y) >= (x * x)) {
						break
					}
				}
				if ($.int(j, 32) > $.int(0, 32)) {
					return 3442619855899/1000000000000 + x
				}
				return -3442619855899/1000000000000 - x
			}
			if (($.float32($.arrayIndex(__goscript_normal.fn, Number(i)) + ($.float32($.float32(await Rand.prototype.Float64.call(r)) * ($.float32($.arrayIndex(__goscript_normal.fn, Number($.uint64Sub(i, 1n))) - $.arrayIndex(__goscript_normal.fn, Number(i)))))))) < $.float32(math.Exp((-.5 * x) * x))) {
				return x
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Perm(n: number): globalThis.Promise<$.Slice<number>> {
		const r: Rand | $.VarRef<Rand> | null = this
		let p: $.Slice<number> = $.makeSlice<number>(n, undefined, "number")
		for (let __goscriptRangeTarget0 = p, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			p![i] = i
		}
		await Rand.prototype.Shuffle.call(r, $.len(p), $.functionValue((i: number, j: number): void => {
			let __goscriptAssign0_0: number = $.arrayIndex(p!, j)
			let __goscriptAssign0_1: number = $.arrayIndex(p!, i)
			p![i] = __goscriptAssign0_0
			p![j] = __goscriptAssign0_1
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [] } as $.FunctionTypeInfo)))
		return p
	}

	public async Shuffle(n: number, swap: ((i: number, j: number) => void) | null): globalThis.Promise<void> {
		const r: Rand | $.VarRef<Rand> | null = this
		if (n < 0) {
			$.panic("invalid argument to Shuffle")
		}

		// Fisher-Yates shuffle: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
		// Shuffle really ought not be called with n that doesn't fit in 32 bits.
		// Not only will it take a very long time, but with 2³¹! possible permutations,
		// there's no way that any PRNG can have a big enough internal state to
		// generate even a minuscule percentage of the possible permutations.
		// Nevertheless, the right API signature accepts an int n, so handle it as best we can.
		for (let i = n - 1; i > 0; i--) {
			let j = $.int(await Rand.prototype.uint64n.call(r, $.uint64(i + 1)))
			await swap!(i, j)
		}
	}

	public async Uint(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		return $.uint(await $.pointerValue<Exclude<Source, null>>($.pointerValue<Rand>(r).src).Uint64(), 64)
	}

	public async Uint32(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		return $.uint($.uint($.uint64Shr(await $.pointerValue<Exclude<Source, null>>($.pointerValue<Rand>(r).src).Uint64(), 32n), 32), 32)
	}

	public async Uint32N(n: number): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		if ($.uint(n, 32) == $.uint(0, 32)) {
			$.panic("invalid argument to Uint32N")
		}
		return $.uint($.uint(await Rand.prototype.uint64n.call(r, $.uint64(n)), 32), 32)
	}

	public async Uint64(): globalThis.Promise<bigint> {
		const r: Rand | $.VarRef<Rand> | null = this
		return $.pointerValue<Exclude<Source, null>>($.pointerValue<Rand>(r).src).Uint64()
	}

	public async Uint64N(n: bigint): globalThis.Promise<bigint> {
		const r: Rand | $.VarRef<Rand> | null = this
		if (n == 0n) {
			$.panic("invalid argument to Uint64N")
		}
		return Rand.prototype.uint64n.call(r, n)
	}

	public async UintN(n: number): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		if (n == 0) {
			$.panic("invalid argument to UintN")
		}
		return $.uint(await Rand.prototype.uint64n.call(r, $.uint64(n)), 64)
	}

	public async uint32n(n: number): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		if ($.uint((n & (n - 1)), 32) == $.uint(0, 32)) {
			return $.uint($.uint(await Rand.prototype.Uint64.call(r), 32) & (n - 1), 32)
		}
		// On 64-bit systems we still use the uint64 code below because
		// the probability of a random uint64 lo being < a uint32 n is near zero,
		// meaning the unbiasing loop almost never runs.
		// On 32-bit systems, here we need to implement that same logic in 32-bit math,
		// both to preserve the exact output sequence observed on 64-bit machines
		// and to preserve the optimization that the unbiasing loop almost never runs.
		//
		// We want to compute
		// 	hi, lo := bits.Mul64(r.Uint64(), n)
		// In terms of 32-bit halves, this is:
		// 	x1:x0 := r.Uint64()
		// 	0:hi, lo1:lo0 := bits.Mul64(x1:x0, 0:n)
		// Writing out the multiplication in terms of bits.Mul32 allows
		// using direct hardware instructions and avoiding
		// the computations involving these zeros.
		let x = await Rand.prototype.Uint64.call(r)
		let __goscriptTuple0: any = bits.Mul32($.uint($.uint(x, 32), 32), $.uint(n, 32))
		let lo1a = $.uint(__goscriptTuple0[0], 32)
		let lo0 = $.uint(__goscriptTuple0[1], 32)
		let __goscriptTuple1: any = bits.Mul32($.uint($.uint($.uint64Shr(x, 32n), 32), 32), $.uint(n, 32))
		let hi = $.uint(__goscriptTuple1[0], 32)
		let lo1b = $.uint(__goscriptTuple1[1], 32)
		let __goscriptTuple2: any = bits.Add32($.uint(lo1a, 32), $.uint(lo1b, 32), $.uint(0, 32))
		let lo1 = $.uint(__goscriptTuple2[0], 32)
		let c = $.uint(__goscriptTuple2[1], 32)
		hi = hi + ($.uint(c, 32))
		if (($.uint(lo1, 32) == $.uint(0, 32)) && ($.uint(lo0, 32) < $.uint($.uint(n, 32), 32))) {
			let n64 = $.uint64(n)
			let thresh = $.uint($.uint($.uint64Mod(-n64, n64), 32), 32)
			while (($.uint(lo1, 32) == $.uint(0, 32)) && ($.uint(lo0, 32) < $.uint(thresh, 32))) {
				let __goscriptShadow0 = await Rand.prototype.Uint64.call(r)
				let __goscriptTuple3: any = bits.Mul32($.uint($.uint(__goscriptShadow0, 32), 32), $.uint(n, 32))
				lo1a = $.uint(__goscriptTuple3[0], 32)
				lo0 = $.uint(__goscriptTuple3[1], 32)
				let __goscriptTuple4: any = bits.Mul32($.uint($.uint($.uint64Shr(__goscriptShadow0, 32n), 32), 32), $.uint(n, 32))
				hi = $.uint(__goscriptTuple4[0], 32)
				lo1b = $.uint(__goscriptTuple4[1], 32)
				let __goscriptTuple5: any = bits.Add32($.uint(lo1a, 32), $.uint(lo1b, 32), $.uint(0, 32))
				lo1 = $.uint(__goscriptTuple5[0], 32)
				c = $.uint(__goscriptTuple5[1], 32)
				hi = hi + ($.uint(c, 32))
			}
		}
		return $.uint(hi, 32)
	}

	public async uint64n(n: bigint): globalThis.Promise<bigint> {
		const r: Rand | $.VarRef<Rand> | null = this
		if (false && ($.uint64($.uint(n, 32)) == n)) {
			return $.uint64(await Rand.prototype.uint32n.call(r, $.uint($.uint(n, 32), 32)))
		}
		if (($.uint64And(n, ($.uint64Sub(n, 1n)))) == 0n) {
			return $.uint64And(await Rand.prototype.Uint64.call(r), ($.uint64Sub(n, 1n)))
		}

		// Suppose we have a uint64 x uniform in the range [0,2⁶⁴)
		// and want to reduce it to the range [0,n) preserving exact uniformity.
		// We can simulate a scaling arbitrary precision x * (n/2⁶⁴) by
		// the high bits of a double-width multiply of x*n, meaning (x*n)/2⁶⁴.
		// Since there are 2⁶⁴ possible inputs x and only n possible outputs,
		// the output is necessarily biased if n does not divide 2⁶⁴.
		// In general (x*n)/2⁶⁴ = k for x*n in [k*2⁶⁴,(k+1)*2⁶⁴).
		// There are either floor(2⁶⁴/n) or ceil(2⁶⁴/n) possible products
		// in that range, depending on k.
		// But suppose we reject the sample and try again when
		// x*n is in [k*2⁶⁴, k*2⁶⁴+(2⁶⁴%n)), meaning rejecting fewer than n possible
		// outcomes out of the 2⁶⁴.
		// Now there are exactly floor(2⁶⁴/n) possible ways to produce
		// each output value k, so we've restored uniformity.
		// To get valid uint64 math, 2⁶⁴ % n = (2⁶⁴ - n) % n = -n % n,
		// so the direct implementation of this algorithm would be:
		//
		//	hi, lo := bits.Mul64(r.Uint64(), n)
		//	thresh := -n % n
		//	for lo < thresh {
		//		hi, lo = bits.Mul64(r.Uint64(), n)
		//	}
		//
		// That still leaves an expensive 64-bit division that we would rather avoid.
		// We know that thresh < n, and n is usually much less than 2⁶⁴, so we can
		// avoid the last four lines unless lo < n.
		//
		// See also:
		// https://lemire.me/blog/2016/06/27/a-fast-alternative-to-the-modulo-reduction
		// https://lemire.me/blog/2016/06/30/fast-random-shuffling
		let [hi, lo] = bits.Mul64(await Rand.prototype.Uint64.call(r), n)
		if (lo < n) {
			let thresh = $.uint64Mod(-n, n)
			while (lo < thresh) {
				let __goscriptTuple6: any = bits.Mul64(await Rand.prototype.Uint64.call(r), n)
				hi = __goscriptTuple6[0]
				lo = __goscriptTuple6[1]
			}
		}
		return hi
	}

	static __typeInfo = $.registerStructType(
		"rand.Rand",
		() => new Rand(),
		[{ name: "ExpFloat64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float64" } }] }, { name: "Float32", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float32" } }] }, { name: "Float64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float64" } }] }, { name: "Int", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Int32", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int32" } }] }, { name: "Int32N", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int32" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int32" } }] }, { name: "Int64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "Int64N", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "IntN", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "NormFloat64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float64" } }] }, { name: "Perm", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "Shuffle", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "swap", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [] } as $.FunctionTypeInfo) }], returns: [] }, { name: "Uint", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint" } }] }, { name: "Uint32", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }, { name: "Uint32N", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }, { name: "Uint64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }, { name: "Uint64N", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }, { name: "UintN", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "uint" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint" } }] }, { name: "uint32n", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "uint32" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }, { name: "uint64n", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }],
		Rand,
		[{ name: "src", key: "src", type: "rand.Source", pkgPath: "math/rand/v2", index: [0], offset: 0, exported: false }]
	)
}

export class runtimeSource {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): runtimeSource {
		const cloned = new runtimeSource()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Uint64(): bigint {
		return runtime_rand()
	}

	static __typeInfo = $.registerStructType(
		"rand.runtimeSource",
		() => new runtimeSource(),
		[{ name: "Uint64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }],
		runtimeSource,
		[]
	)
}

export const is32bit: boolean = false

export function New(src: Source | null): Rand | $.VarRef<Rand> | null {
	return new Rand({src: src})
}

export let globalRand: Rand | $.VarRef<Rand> | null = new Rand({src: $.interfaceValue<Source | null>($.markAsStructValue(new runtimeSource()), "rand.runtimeSource", "rand.runtimeSource")})

export function __goscript_set_globalRand(__goscriptValue: Rand | $.VarRef<Rand> | null): void {
	globalRand = __goscriptValue
}

export function runtime_rand(): bigint {
	return 0n
}

export async function Int64(): globalThis.Promise<bigint> {
	return Rand.prototype.Int64.call(globalRand)
}

export async function Uint32(): globalThis.Promise<number> {
	return $.uint(await Rand.prototype.Uint32.call(globalRand), 32)
}

export async function Uint64N(n: bigint): globalThis.Promise<bigint> {
	return Rand.prototype.Uint64N.call(globalRand, n)
}

export async function Uint32N(n: number): globalThis.Promise<number> {
	return $.uint(await Rand.prototype.Uint32N.call(globalRand, $.uint(n, 32)), 32)
}

export async function Uint64(): globalThis.Promise<bigint> {
	return Rand.prototype.Uint64.call(globalRand)
}

export async function Int32(): globalThis.Promise<number> {
	return $.int(await Rand.prototype.Int32.call(globalRand), 32)
}

export async function Int(): globalThis.Promise<number> {
	return Rand.prototype.Int.call(globalRand)
}

export async function Uint(): globalThis.Promise<number> {
	return Rand.prototype.Uint.call(globalRand)
}

export async function Int64N(n: bigint): globalThis.Promise<bigint> {
	return Rand.prototype.Int64N.call(globalRand, n)
}

export async function Int32N(n: number): globalThis.Promise<number> {
	return $.int(await Rand.prototype.Int32N.call(globalRand, $.int(n, 32)), 32)
}

export async function IntN(n: number): globalThis.Promise<number> {
	return Rand.prototype.IntN.call(globalRand, n)
}

export async function UintN(n: number): globalThis.Promise<number> {
	return Rand.prototype.UintN.call(globalRand, n)
}

export async function N(__typeArgs: $.GenericTypeArgs | undefined, n: any): globalThis.Promise<any> {
	if ((n as any) <= (0 as any)) {
		$.panic("invalid argument to N")
	}
	return $.basicInterfaceValue(await Rand.prototype.uint64n.call(globalRand, $.uint64(n)), "uint64")
}

export async function Float64(): globalThis.Promise<number> {
	return Rand.prototype.Float64.call(globalRand)
}

export async function Float32(): globalThis.Promise<number> {
	return Rand.prototype.Float32.call(globalRand)
}

export async function Perm(n: number): globalThis.Promise<$.Slice<number>> {
	return Rand.prototype.Perm.call(globalRand, n)
}

export async function Shuffle(n: number, swap: ((i: number, j: number) => void) | null): globalThis.Promise<void> {
	await Rand.prototype.Shuffle.call(globalRand, n, swap)
}

export async function NormFloat64(): globalThis.Promise<number> {
	return Rand.prototype.NormFloat64.call(globalRand)
}

export async function ExpFloat64(): globalThis.Promise<number> {
	return Rand.prototype.ExpFloat64.call(globalRand)
}

// Generated file based on pcg.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as bits from "@goscript/math/bits/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/byteorder/index.js"
import "@goscript/math/bits/index.js"

export class PCG {
	public get hi(): bigint {
		return this._fields.hi.value
	}
	public set hi(value: bigint) {
		this._fields.hi.value = value
	}

	public get lo(): bigint {
		return this._fields.lo.value
	}
	public set lo(value: bigint) {
		this._fields.lo.value = value
	}

	public _fields: {
		hi: $.VarRef<bigint>
		lo: $.VarRef<bigint>
	}

	constructor(init?: Partial<{hi?: bigint, lo?: bigint}>) {
		this._fields = {
			hi: $.varRef(init?.hi ?? (0n as bigint)),
			lo: $.varRef(init?.lo ?? (0n as bigint))
		}
	}

	public clone(): PCG {
		const cloned = new PCG()
		cloned._fields = {
			hi: $.varRef(this._fields.hi.value),
			lo: $.varRef(this._fields.lo.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const p: PCG | $.VarRef<PCG> | null = this
		b = $.appendSlice(b, $.stringToBytes("pcg:"), $.byteSliceHint)
		b = byteorder.BEAppendUint64(b, $.pointerValue<PCG>(p).hi)
		b = byteorder.BEAppendUint64(b, $.pointerValue<PCG>(p).lo)
		return [b, null]
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const p: PCG | $.VarRef<PCG> | null = this
		return PCG.prototype.AppendBinary.call(p, $.makeSlice<number>(0, 20, "byte"))
	}

	public Seed(seed1: bigint, seed2: bigint): void {
		let p: PCG | $.VarRef<PCG> | null = this
		$.pointerValue<PCG>(p).hi = seed1
		$.pointerValue<PCG>(p).lo = seed2
	}

	public Uint64(): bigint {
		const p: PCG | $.VarRef<PCG> | null = this
		let [hi, lo] = PCG.prototype.next.call(p)

		// XSL-RR would be
		//	hi, lo := p.next()
		//	return bits.RotateLeft64(lo^hi, -int(hi>>58))
		// but Numpy uses DXSM and O'Neill suggests doing the same.
		// See https://github.com/golang/go/issues/21835#issuecomment-739065688
		// and following comments.

		// DXSM "double xorshift multiply"
		// https://github.com/imneme/pcg-cpp/blob/428802d1a5/include/pcg_random.hpp#L1015

		// https://github.com/imneme/pcg-cpp/blob/428802d1a5/include/pcg_random.hpp#L176
		const cheapMul: number = 15750249268501108917
		hi = $.uint64Xor(hi, $.uint64Shr(hi, 32n))
		hi = $.uint64Mul(hi, 15750249268501108917n)
		hi = $.uint64Xor(hi, $.uint64Shr(hi, 48n))
		hi = $.uint64Mul(hi, ($.uint64Or(lo, 1n)))
		return hi
	}

	public UnmarshalBinary(data: $.Slice<number>): $.GoError {
		let p: PCG | $.VarRef<PCG> | null = this
		if (($.len(data) != 20) || (!$.stringEqual($.bytesToString($.goSlice(data, undefined, 4)), "pcg:"))) {
			return errUnmarshalPCG
		}
		$.pointerValue<PCG>(p).hi = byteorder.BEUint64($.goSlice(data, 4, undefined))
		$.pointerValue<PCG>(p).lo = byteorder.BEUint64($.goSlice(data, 4 + 8, undefined))
		return null
	}

	public next(): [bigint, bigint] {
		let p: PCG | $.VarRef<PCG> | null = this
		let hi: bigint = 0n
		let lo: bigint = 0n
		// https://github.com/imneme/pcg-cpp/blob/428802d1a5/include/pcg_random.hpp#L161
		//
		// Numpy's PCG multiplies by the 64-bit value cheapMul
		// instead of the 128-bit value used here and in the official PCG code.
		// This does not seem worthwhile, at least for Go: not having any high
		// bits in the multiplier reduces the effect of low bits on the highest bits,
		// and it only saves 1 multiply out of 3.
		// (On 32-bit systems, it saves 1 out of 6, since Mul64 is doing 4.)
		const mulHi: number = 2549297995355413924
		const mulLo: number = 4865540595714422341
		const incHi: number = 6364136223846793005
		const incLo: number = 1442695040888963407

		// state = state * mul + inc
		let __goscriptTuple0: any = bits.Mul64($.pointerValue<PCG>(p).lo, 4865540595714422341n)
		hi = __goscriptTuple0[0]
		lo = __goscriptTuple0[1]
		hi = $.uint64Add(hi, $.uint64Add(($.uint64Mul($.pointerValue<PCG>(p).hi, 4865540595714422341n)), ($.uint64Mul($.pointerValue<PCG>(p).lo, 2549297995355413924n))))
		let __goscriptTuple1: any = bits.Add64(lo, 1442695040888963407n, 0n)
		lo = __goscriptTuple1[0]
		let c = __goscriptTuple1[1]
		let __goscriptTuple2: any = bits.Add64(hi, 6364136223846793005n, c)
		hi = __goscriptTuple2[0]
		$.pointerValue<PCG>(p).lo = lo
		$.pointerValue<PCG>(p).hi = hi
		return [hi, lo]
	}

	static __typeInfo = $.registerStructType(
		"rand.PCG",
		() => new PCG(),
		[{ name: "AppendBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "MarshalBinary", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { type: "error" }] }, { name: "Seed", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "Uint64", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint64" } }] }, { name: "UnmarshalBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "next", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint64" } }, { type: { kind: $.TypeKind.Basic, name: "uint64" } }] }],
		PCG,
		[{ name: "hi", key: "hi", type: { kind: $.TypeKind.Basic, name: "uint64" } }, { name: "lo", key: "lo", type: { kind: $.TypeKind.Basic, name: "uint64" } }]
	)
}

export function NewPCG(seed1: bigint, seed2: bigint): PCG | $.VarRef<PCG> | null {
	return new PCG({hi: seed1, lo: seed2})
}

export let errUnmarshalPCG: $.GoError = errors.New("invalid PCG encoding")

export function __goscript_set_errUnmarshalPCG(__goscriptValue: $.GoError): void {
	errUnmarshalPCG = __goscriptValue
}

// Generated file based on uint128.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"
import "@goscript/math/bits/index.js"

export class uint128 {
	public declare hi: bigint

	public declare lo: bigint

	public _fields: {
		hi: bigint
		lo: bigint
	}

	constructor(init?: Partial<{hi?: bigint, lo?: bigint}>) {
		this._fields = {
			hi: init?.hi ?? (0n as bigint),
			lo: init?.lo ?? (0n as bigint)
		}
	}

	public clone(): uint128 {
		return $.markAsStructValue(new uint128(this))
	}

	public addOne(): uint128 {
		const u = this;
		let __goscriptTuple0: any = bits.Add64(u.lo, 1n, 0n)
		let lo = __goscriptTuple0[0]
		let carry = __goscriptTuple0[1]
		return $.markAsStructValue(new uint128({hi: $.uint64Add(u.hi, carry), lo: lo}))
	}

	public and(m: uint128): uint128 {
		const u = this;
		return $.markAsStructValue(new uint128({hi: $.uint64And(u.hi, m.hi), lo: $.uint64And(u.lo, m.lo)}))
	}

	public bitsClearedFrom(bit: number): uint128 {
		const u = this;
		return $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(u)).and($.markAsStructValue($.cloneStructValue(mask6($.int(bit)))))))
	}

	public bitsSetFrom(bit: number): uint128 {
		const u = this;
		return $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(u)).or($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(mask6($.int(bit)))).not())))))
	}

	public halves(): ($.VarRef<bigint> | null)[] {
		const u: uint128 | $.VarRef<uint128> | null = this;
		return $.arrayValue([$.fieldRef($.pointerValue<uint128>(u)._fields, "hi"), $.fieldRef($.pointerValue<uint128>(u)._fields, "lo")])
	}

	public isZero(): boolean {
		const u = this;
		return ($.uint64Or(u.hi, u.lo)) == 0n
	}

	public not(): uint128 {
		const u = this;
		return $.markAsStructValue(new uint128({hi: $.uint64Xor(u.hi, -1n), lo: $.uint64Xor(u.lo, -1n)}))
	}

	public or(m: uint128): uint128 {
		const u = this;
		return $.markAsStructValue(new uint128({hi: $.uint64Or(u.hi, m.hi), lo: $.uint64Or(u.lo, m.lo)}))
	}

	public subOne(): uint128 {
		const u = this;
		let __goscriptTuple1: any = bits.Sub64(u.lo, 1n, 0n)
		let lo = __goscriptTuple1[0]
		let borrow = __goscriptTuple1[1]
		return $.markAsStructValue(new uint128({hi: $.uint64Sub(u.hi, borrow), lo: lo}))
	}

	public xor(m: uint128): uint128 {
		const u = this;
		return $.markAsStructValue(new uint128({hi: $.uint64Xor(u.hi, m.hi), lo: $.uint64Xor(u.lo, m.lo)}))
	}

	static {
		$.bindStructFields(this.prototype, ["hi", "lo"])
	}

	static __typeInfo = $.registerStructType(
		"netip.uint128",
		() => new uint128(),
		() => [{ name: "addOne", args: [], returns: [{ type: "netip.uint128" }] }, { name: "and", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "netip.uint128" }] }, { name: "bitsClearedFrom", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "netip.uint128" }] }, { name: "bitsSetFrom", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "netip.uint128" }] }, { name: "halves", args: [], returns: [{ type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("uint64")), 2) }] }, { name: "isZero", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "not", args: [], returns: [{ type: "netip.uint128" }] }, { name: "or", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "netip.uint128" }] }, { name: "subOne", args: [], returns: [{ type: "netip.uint128" }] }, { name: "xor", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "netip.uint128" }] }],
		uint128,
		() => [{ name: "hi", key: "hi", type: /* @__PURE__ */ $.basicType("uint64") }, { name: "lo", key: "lo", type: /* @__PURE__ */ $.basicType("uint64") }]
	)
}

export function mask6(n: number): uint128 {
	return $.markAsStructValue(new uint128({hi: $.uint64Xor(($.uint64Shr(18446744073709551615n, n)), -1n), lo: $.uint64Shl(18446744073709551615n, (128 - n))}))
}

// Generated file based on p256.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subtle from "@goscript/crypto/internal/fips140/subtle/index.js"

import * as errors from "@goscript/errors/index.js"

import * as __goscript_p256_fiat64 from "./p256_fiat64.gs.ts"

import * as __goscript_p256_invert from "./p256_invert.gs.ts"
import "@goscript/crypto/internal/fips140/subtle/index.js"
import "@goscript/errors/index.js"
import "./p256_fiat64.gs.ts"
import "./p256_invert.gs.ts"

export type p256UntypedFieldElement = bigint[]

export class P256Element {
	// Values are represented internally always in the Montgomery domain, and
	// converted in Bytes and SetBytes.
	public get x(): __goscript_p256_fiat64.p256MontgomeryDomainFieldElement {
		return this._fields.x.value
	}
	public set x(value: __goscript_p256_fiat64.p256MontgomeryDomainFieldElement) {
		this._fields.x.value = value
	}

	public _fields: {
		x: $.VarRef<__goscript_p256_fiat64.p256MontgomeryDomainFieldElement>
	}

	constructor(init?: Partial<{x?: __goscript_p256_fiat64.p256MontgomeryDomainFieldElement}>) {
		this._fields = {
			x: $.varRef(init?.x !== undefined ? $.cloneArrayValue(init.x) : Array.from({ length: 4 }, () => 0n))
		}
	}

	public clone(): P256Element {
		const cloned = new P256Element()
		cloned._fields = {
			x: $.varRef($.cloneArrayValue(this._fields.x.value))
		}
		return $.markAsStructValue(cloned)
	}

	public Add(t1: P256Element | $.VarRef<P256Element> | null, t2: P256Element | $.VarRef<P256Element> | null): P256Element | $.VarRef<P256Element> | null {
		const e: P256Element | $.VarRef<P256Element> | null = this
		__goscript_p256_fiat64.p256Add($.pointerValue<P256Element>(e)._fields.x, $.pointerValue<P256Element>(t1)._fields.x, $.pointerValue<P256Element>(t2)._fields.x)
		return e
	}

	public Bytes(): $.Slice<number> {
		const e: P256Element | $.VarRef<P256Element> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(32))
		return P256Element.prototype.bytes.call(e, out)
	}

	public Equal(t: P256Element | $.VarRef<P256Element> | null): number {
		const e: P256Element | $.VarRef<P256Element> | null = this
		let eBytes: $.Slice<number> = P256Element.prototype.Bytes.call(e)
		let tBytes: $.Slice<number> = P256Element.prototype.Bytes.call(t)
		return subtle.ConstantTimeCompare(eBytes, tBytes)
	}

	public Invert(x: P256Element | $.VarRef<P256Element> | null): P256Element | $.VarRef<P256Element> | null {
		const e: P256Element | $.VarRef<P256Element> | null = this

		// P256Element is an integer modulo 2^256 - 2^224 + 2^192 + 2^96 - 1.
		//
		// The zero value is a valid zero element.

		// Values are represented internally always in the Montgomery domain, and
		// converted in Bytes and SetBytes.

		// One sets e = 1, and returns e.

		let z: P256Element | $.VarRef<P256Element> | null = P256Element.prototype.Set.call(new P256Element(), e)
		let t0: P256Element | $.VarRef<P256Element> | null = new P256Element()
		let t1: P256Element | $.VarRef<P256Element> | null = new P256Element()

		P256Element.prototype.Square.call(z, x)
		P256Element.prototype.Mul.call(z, x, z)
		P256Element.prototype.Square.call(z, z)
		P256Element.prototype.Mul.call(z, x, z)
		P256Element.prototype.Square.call(t0, z)
		for (let s = 1; s < 3; s++) {
			P256Element.prototype.Square.call(t0, t0)
		}
		P256Element.prototype.Mul.call(t0, z, t0)
		P256Element.prototype.Square.call(t1, t0)
		for (let s = 1; s < 6; s++) {
			P256Element.prototype.Square.call(t1, t1)
		}
		P256Element.prototype.Mul.call(t0, t0, t1)
		for (let s = 0; s < 3; s++) {
			P256Element.prototype.Square.call(t0, t0)
		}
		P256Element.prototype.Mul.call(z, z, t0)
		P256Element.prototype.Square.call(t0, z)
		P256Element.prototype.Mul.call(t0, x, t0)
		P256Element.prototype.Square.call(t1, t0)
		for (let s = 1; s < 16; s++) {
			P256Element.prototype.Square.call(t1, t1)
		}
		P256Element.prototype.Mul.call(t0, t0, t1)
		for (let s = 0; s < 15; s++) {
			P256Element.prototype.Square.call(t0, t0)
		}
		P256Element.prototype.Mul.call(z, z, t0)
		for (let s = 0; s < 17; s++) {
			P256Element.prototype.Square.call(t0, t0)
		}
		P256Element.prototype.Mul.call(t0, x, t0)
		for (let s = 0; s < 143; s++) {
			P256Element.prototype.Square.call(t0, t0)
		}
		P256Element.prototype.Mul.call(t0, z, t0)
		for (let s = 0; s < 47; s++) {
			P256Element.prototype.Square.call(t0, t0)
		}
		P256Element.prototype.Mul.call(z, z, t0)
		for (let s = 0; s < 2; s++) {
			P256Element.prototype.Square.call(z, z)
		}
		P256Element.prototype.Mul.call(z, x, z)

		return P256Element.prototype.Set.call(e, z)
	}

	public IsZero(): number {
		const e: P256Element | $.VarRef<P256Element> | null = this
		let zero: $.Slice<number> = $.makeSlice<number>(32, undefined, "byte")
		let eBytes: $.Slice<number> = P256Element.prototype.Bytes.call(e)
		return subtle.ConstantTimeCompare(eBytes, zero)
	}

	public Mul(t1: P256Element | $.VarRef<P256Element> | null, t2: P256Element | $.VarRef<P256Element> | null): P256Element | $.VarRef<P256Element> | null {
		const e: P256Element | $.VarRef<P256Element> | null = this
		__goscript_p256_fiat64.p256Mul($.pointerValue<P256Element>(e)._fields.x, $.pointerValue<P256Element>(t1)._fields.x, $.pointerValue<P256Element>(t2)._fields.x)
		return e
	}

	public One(): P256Element | $.VarRef<P256Element> | null {
		const e: P256Element | $.VarRef<P256Element> | null = this
		__goscript_p256_fiat64.p256SetOne($.pointerValue<P256Element>(e)._fields.x)
		return e
	}

	public Select(a: P256Element | $.VarRef<P256Element> | null, b: P256Element | $.VarRef<P256Element> | null, cond: number): P256Element | $.VarRef<P256Element> | null {
		const v: P256Element | $.VarRef<P256Element> | null = this
		__goscript_p256_fiat64.p256Selectznz($.unsafePointerCast<$.VarRef<p256UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p256_fiat64.p256MontgomeryDomainFieldElement>($.pointerValue<P256Element>(v)._fields.x, 4, 32, 8)), $.uint64(cond), $.unsafePointerCast<$.VarRef<p256UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p256_fiat64.p256MontgomeryDomainFieldElement>($.pointerValue<P256Element>(b)._fields.x, 4, 32, 8)), $.unsafePointerCast<$.VarRef<p256UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p256_fiat64.p256MontgomeryDomainFieldElement>($.pointerValue<P256Element>(a)._fields.x, 4, 32, 8)))
		return v
	}

	public Set(t: P256Element | $.VarRef<P256Element> | null): P256Element | $.VarRef<P256Element> | null {
		let e: P256Element | $.VarRef<P256Element> | null = this
		$.pointerValue<P256Element>(e).x = $.pointerValue<P256Element>(t).x
		return e
	}

	public SetBytes(v: $.Slice<number>): [P256Element | $.VarRef<P256Element> | null, $.GoError] {
		const e: P256Element | $.VarRef<P256Element> | null = this
		if ($.len(v) != 32) {
			return [null, errors.New("invalid P256Element encoding")]
		}

		// Check for non-canonical encodings (p + k, 2p + k, etc.) by comparing to
		// the encoding of -1 mod p, so p - 1, the highest canonical encoding.
		let minusOneEncoding: $.Slice<number> = P256Element.prototype.Bytes.call(P256Element.prototype.Sub.call(new P256Element(), new P256Element(), P256Element.prototype.One.call(new P256Element())))
		if (subtle.ConstantTimeLessOrEqBytes(v, minusOneEncoding) == 0) {
			return [null, errors.New("invalid P256Element encoding")]
		}

		let _in: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(32))
		$.copy($.goSlice(_in.value, undefined, undefined), v)
		p256InvertEndianness($.goSlice(_in.value, undefined, undefined))
		let tmp: $.VarRef<__goscript_p256_fiat64.p256NonMontgomeryDomainFieldElement> = $.varRef(Array.from({ length: 4 }, () => 0n))
		__goscript_p256_fiat64.p256FromBytes($.unsafePointerCast<$.VarRef<p256UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p256_fiat64.p256NonMontgomeryDomainFieldElement>(tmp, 4, 32, 8)), _in)
		__goscript_p256_fiat64.p256ToMontgomery($.pointerValue<P256Element>(e)._fields.x, tmp)
		return [e, null]
	}

	public Square(t: P256Element | $.VarRef<P256Element> | null): P256Element | $.VarRef<P256Element> | null {
		const e: P256Element | $.VarRef<P256Element> | null = this
		__goscript_p256_fiat64.p256Square($.pointerValue<P256Element>(e)._fields.x, $.pointerValue<P256Element>(t)._fields.x)
		return e
	}

	public Sub(t1: P256Element | $.VarRef<P256Element> | null, t2: P256Element | $.VarRef<P256Element> | null): P256Element | $.VarRef<P256Element> | null {
		const e: P256Element | $.VarRef<P256Element> | null = this
		__goscript_p256_fiat64.p256Sub($.pointerValue<P256Element>(e)._fields.x, $.pointerValue<P256Element>(t1)._fields.x, $.pointerValue<P256Element>(t2)._fields.x)
		return e
	}

	public bytes(out: $.VarRef<Uint8Array> | null): $.Slice<number> {
		const e: P256Element | $.VarRef<P256Element> | null = this
		let tmp: $.VarRef<__goscript_p256_fiat64.p256NonMontgomeryDomainFieldElement> = $.varRef(Array.from({ length: 4 }, () => 0n))
		__goscript_p256_fiat64.p256FromMontgomery(tmp, $.pointerValue<P256Element>(e)._fields.x)
		__goscript_p256_fiat64.p256ToBytes(out, $.unsafePointerCast<$.VarRef<p256UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p256_fiat64.p256NonMontgomeryDomainFieldElement>(tmp, 4, 32, 8)))
		p256InvertEndianness($.goSlice($.pointerValue<Uint8Array>(out), undefined, undefined))
		return $.goSlice($.pointerValue<Uint8Array>(out), undefined, undefined)
	}

	static __typeInfo = $.registerStructType(
		"fiat.P256Element",
		() => new P256Element(),
		[{ name: "Add", args: [{ name: "t1", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }, { name: "t2", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Equal", args: [{ name: "t", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Invert", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }] }, { name: "IsZero", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Mul", args: [{ name: "t1", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }, { name: "t2", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }] }, { name: "One", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }] }, { name: "Select", args: [{ name: "a", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }, { name: "b", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }, { name: "cond", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }] }, { name: "Set", args: [{ name: "t", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }] }, { name: "SetBytes", args: [{ name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }, { name: "_r1", type: "error" }] }, { name: "Square", args: [{ name: "t", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }] }, { name: "Sub", args: [{ name: "t1", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }, { name: "t2", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P256Element" } }] }, { name: "bytes", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		P256Element,
		[{ name: "x", key: "x", type: "fiat.p256MontgomeryDomainFieldElement", pkgPath: "crypto/internal/fips140/nistec/fiat", index: [0], offset: 0, exported: false }]
	)
}

export const p256ElementLen: number = 32

export function p256InvertEndianness(v: $.Slice<number>): void {
	for (let i = 0; i < (Math.trunc($.len(v) / 2)); i++) {
		let __goscriptAssign0_0: number = $.uint($.arrayIndex(v!, ($.len(v) - 1) - i), 8)
		let __goscriptAssign0_1: number = $.uint($.arrayIndex(v!, i), 8)
		v![i] = __goscriptAssign0_0
		v![($.len(v) - 1) - i] = __goscriptAssign0_1
	}
}

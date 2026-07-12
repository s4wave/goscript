// Generated file based on p384.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subtle from "@goscript/crypto/internal/fips140/subtle/index.js"

import * as errors from "@goscript/errors/index.js"

import * as __goscript_p384_fiat64 from "./p384_fiat64.gs.ts"

import * as __goscript_p384_invert from "./p384_invert.gs.ts"
import "@goscript/crypto/internal/fips140/subtle/index.js"
import "@goscript/errors/index.js"
import "./p384_fiat64.gs.ts"
import "./p384_invert.gs.ts"

export type p384UntypedFieldElement = bigint[]

export class P384Element {
	// Values are represented internally always in the Montgomery domain, and
	// converted in Bytes and SetBytes.
	public get x(): __goscript_p384_fiat64.p384MontgomeryDomainFieldElement {
		return this._fields.x.value
	}
	public set x(value: __goscript_p384_fiat64.p384MontgomeryDomainFieldElement) {
		this._fields.x.value = value
	}

	public _fields: {
		x: $.VarRef<__goscript_p384_fiat64.p384MontgomeryDomainFieldElement>
	}

	constructor(init?: Partial<{x?: __goscript_p384_fiat64.p384MontgomeryDomainFieldElement}>) {
		this._fields = {
			x: $.varRef(init?.x !== undefined ? $.cloneArrayValue(init.x) : Array.from({ length: 6 }, () => 0n))
		}
	}

	public clone(): P384Element {
		const cloned = new P384Element()
		cloned._fields = {
			x: $.varRef($.cloneArrayValue(this._fields.x.value))
		}
		return $.markAsStructValue(cloned)
	}

	public Add(t1: P384Element | $.VarRef<P384Element> | null, t2: P384Element | $.VarRef<P384Element> | null): P384Element | $.VarRef<P384Element> | null {
		const e: P384Element | $.VarRef<P384Element> | null = this
		__goscript_p384_fiat64.p384Add($.pointerValue<P384Element>(e)._fields.x, $.pointerValue<P384Element>(t1)._fields.x, $.pointerValue<P384Element>(t2)._fields.x)
		return e
	}

	public Bytes(): $.Slice<number> {
		const e: P384Element | $.VarRef<P384Element> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(48))
		return P384Element.prototype.bytes.call(e, out)
	}

	public Equal(t: P384Element | $.VarRef<P384Element> | null): number {
		const e: P384Element | $.VarRef<P384Element> | null = this
		let eBytes: $.Slice<number> = P384Element.prototype.Bytes.call(e)
		let tBytes: $.Slice<number> = P384Element.prototype.Bytes.call(t)
		return subtle.ConstantTimeCompare(eBytes, tBytes)
	}

	public Invert(x: P384Element | $.VarRef<P384Element> | null): P384Element | $.VarRef<P384Element> | null {
		const e: P384Element | $.VarRef<P384Element> | null = this

		// P384Element is an integer modulo 2^384 - 2^128 - 2^96 + 2^32 - 1.
		//
		// The zero value is a valid zero element.

		// Values are represented internally always in the Montgomery domain, and
		// converted in Bytes and SetBytes.

		// One sets e = 1, and returns e.

		// Equal returns 1 if e == t, and zero otherwise.

		let z: P384Element | $.VarRef<P384Element> | null = P384Element.prototype.Set.call(new P384Element(), e)
		let t0: P384Element | $.VarRef<P384Element> | null = new P384Element()
		let t1: P384Element | $.VarRef<P384Element> | null = new P384Element()
		let t2: P384Element | $.VarRef<P384Element> | null = new P384Element()
		let t3: P384Element | $.VarRef<P384Element> | null = new P384Element()

		P384Element.prototype.Square.call(z, x)
		P384Element.prototype.Mul.call(z, x, z)
		P384Element.prototype.Square.call(z, z)
		P384Element.prototype.Mul.call(t1, x, z)
		P384Element.prototype.Square.call(z, t1)
		for (let s = 1; s < 3; s++) {
			P384Element.prototype.Square.call(z, z)
		}
		P384Element.prototype.Mul.call(z, t1, z)
		P384Element.prototype.Square.call(t0, z)
		for (let s = 1; s < 6; s++) {
			P384Element.prototype.Square.call(t0, t0)
		}
		P384Element.prototype.Mul.call(t0, z, t0)
		P384Element.prototype.Square.call(t2, t0)
		for (let s = 1; s < 12; s++) {
			P384Element.prototype.Square.call(t2, t2)
		}
		P384Element.prototype.Mul.call(t0, t0, t2)
		for (let s = 0; s < 6; s++) {
			P384Element.prototype.Square.call(t0, t0)
		}
		P384Element.prototype.Mul.call(z, z, t0)
		P384Element.prototype.Square.call(t0, z)
		P384Element.prototype.Mul.call(t2, x, t0)
		P384Element.prototype.Square.call(t0, t2)
		P384Element.prototype.Mul.call(t0, x, t0)
		P384Element.prototype.Square.call(t3, t0)
		for (let s = 1; s < 31; s++) {
			P384Element.prototype.Square.call(t3, t3)
		}
		P384Element.prototype.Mul.call(t2, t2, t3)
		P384Element.prototype.Square.call(t3, t2)
		for (let s = 1; s < 63; s++) {
			P384Element.prototype.Square.call(t3, t3)
		}
		P384Element.prototype.Mul.call(t2, t2, t3)
		P384Element.prototype.Square.call(t3, t2)
		for (let s = 1; s < 126; s++) {
			P384Element.prototype.Square.call(t3, t3)
		}
		P384Element.prototype.Mul.call(t2, t2, t3)
		for (let s = 0; s < 3; s++) {
			P384Element.prototype.Square.call(t2, t2)
		}
		P384Element.prototype.Mul.call(t1, t1, t2)
		for (let s = 0; s < 33; s++) {
			P384Element.prototype.Square.call(t1, t1)
		}
		P384Element.prototype.Mul.call(t0, t0, t1)
		for (let s = 0; s < 94; s++) {
			P384Element.prototype.Square.call(t0, t0)
		}
		P384Element.prototype.Mul.call(z, z, t0)
		for (let s = 0; s < 2; s++) {
			P384Element.prototype.Square.call(z, z)
		}
		P384Element.prototype.Mul.call(z, x, z)
		// Sub sets e = t1 - t2, and returns e.
		return P384Element.prototype.Set.call(e, z)
	}

	public IsZero(): number {
		const e: P384Element | $.VarRef<P384Element> | null = this
		let zero: $.Slice<number> = $.makeSlice<number>(48, undefined, "byte")
		let eBytes: $.Slice<number> = P384Element.prototype.Bytes.call(e)
		return subtle.ConstantTimeCompare(eBytes, zero)
	}

	public Mul(t1: P384Element | $.VarRef<P384Element> | null, t2: P384Element | $.VarRef<P384Element> | null): P384Element | $.VarRef<P384Element> | null {
		const e: P384Element | $.VarRef<P384Element> | null = this
		__goscript_p384_fiat64.p384Mul($.pointerValue<P384Element>(e)._fields.x, $.pointerValue<P384Element>(t1)._fields.x, $.pointerValue<P384Element>(t2)._fields.x)
		return e
	}

	public One(): P384Element | $.VarRef<P384Element> | null {
		const e: P384Element | $.VarRef<P384Element> | null = this
		__goscript_p384_fiat64.p384SetOne($.pointerValue<P384Element>(e)._fields.x)
		return e
	}

	public Select(a: P384Element | $.VarRef<P384Element> | null, b: P384Element | $.VarRef<P384Element> | null, cond: number): P384Element | $.VarRef<P384Element> | null {
		const v: P384Element | $.VarRef<P384Element> | null = this
		__goscript_p384_fiat64.p384Selectznz($.unsafePointerCast<$.VarRef<p384UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p384_fiat64.p384MontgomeryDomainFieldElement>($.pointerValue<P384Element>(v)._fields.x, 6, 48, 8)), $.uint64(cond), $.unsafePointerCast<$.VarRef<p384UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p384_fiat64.p384MontgomeryDomainFieldElement>($.pointerValue<P384Element>(b)._fields.x, 6, 48, 8)), $.unsafePointerCast<$.VarRef<p384UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p384_fiat64.p384MontgomeryDomainFieldElement>($.pointerValue<P384Element>(a)._fields.x, 6, 48, 8)))
		return v
	}

	public Set(t: P384Element | $.VarRef<P384Element> | null): P384Element | $.VarRef<P384Element> | null {
		let e: P384Element | $.VarRef<P384Element> | null = this
		$.pointerValue<P384Element>(e).x = $.pointerValue<P384Element>(t).x
		return e
	}

	public SetBytes(v: $.Slice<number>): [P384Element | $.VarRef<P384Element> | null, $.GoError] {
		const e: P384Element | $.VarRef<P384Element> | null = this
		if ($.len(v) != 48) {
			return [null, errors.New("invalid P384Element encoding")]
		}

		// Check for non-canonical encodings (p + k, 2p + k, etc.) by comparing to
		// the encoding of -1 mod p, so p - 1, the highest canonical encoding.
		let minusOneEncoding: $.Slice<number> = P384Element.prototype.Bytes.call(P384Element.prototype.Sub.call(new P384Element(), new P384Element(), P384Element.prototype.One.call(new P384Element())))
		if (subtle.ConstantTimeLessOrEqBytes(v, minusOneEncoding) == 0) {
			return [null, errors.New("invalid P384Element encoding")]
		}

		let _in: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(48))
		$.copy($.goSlice(_in.value, undefined, undefined), v)
		p384InvertEndianness($.goSlice(_in.value, undefined, undefined))
		let tmp: $.VarRef<__goscript_p384_fiat64.p384NonMontgomeryDomainFieldElement> = $.varRef(Array.from({ length: 6 }, () => 0n))
		__goscript_p384_fiat64.p384FromBytes($.unsafePointerCast<$.VarRef<p384UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p384_fiat64.p384NonMontgomeryDomainFieldElement>(tmp, 6, 48, 8)), _in)
		__goscript_p384_fiat64.p384ToMontgomery($.pointerValue<P384Element>(e)._fields.x, tmp)
		return [e, null]
	}

	public Square(t: P384Element | $.VarRef<P384Element> | null): P384Element | $.VarRef<P384Element> | null {
		const e: P384Element | $.VarRef<P384Element> | null = this
		__goscript_p384_fiat64.p384Square($.pointerValue<P384Element>(e)._fields.x, $.pointerValue<P384Element>(t)._fields.x)
		return e
	}

	public Sub(t1: P384Element | $.VarRef<P384Element> | null, t2: P384Element | $.VarRef<P384Element> | null): P384Element | $.VarRef<P384Element> | null {
		const e: P384Element | $.VarRef<P384Element> | null = this
		__goscript_p384_fiat64.p384Sub($.pointerValue<P384Element>(e)._fields.x, $.pointerValue<P384Element>(t1)._fields.x, $.pointerValue<P384Element>(t2)._fields.x)
		return e
	}

	public bytes(out: $.VarRef<Uint8Array> | null): $.Slice<number> {
		const e: P384Element | $.VarRef<P384Element> | null = this
		let tmp: $.VarRef<__goscript_p384_fiat64.p384NonMontgomeryDomainFieldElement> = $.varRef(Array.from({ length: 6 }, () => 0n))
		__goscript_p384_fiat64.p384FromMontgomery(tmp, $.pointerValue<P384Element>(e)._fields.x)
		__goscript_p384_fiat64.p384ToBytes(out, $.unsafePointerCast<$.VarRef<p384UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p384_fiat64.p384NonMontgomeryDomainFieldElement>(tmp, 6, 48, 8)))
		p384InvertEndianness($.goSlice($.pointerValue<Uint8Array>(out), undefined, undefined))
		return $.goSlice($.pointerValue<Uint8Array>(out), undefined, undefined)
	}

	static __typeInfo = $.registerStructType(
		"fiat.P384Element",
		() => new P384Element(),
		[{ name: "Add", args: [{ name: "t1", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }, { name: "t2", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Equal", args: [{ name: "t", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Invert", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }] }, { name: "IsZero", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Mul", args: [{ name: "t1", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }, { name: "t2", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }] }, { name: "One", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }] }, { name: "Select", args: [{ name: "a", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }, { name: "b", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }, { name: "cond", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }] }, { name: "Set", args: [{ name: "t", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }] }, { name: "SetBytes", args: [{ name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }, { name: "_r1", type: "error" }] }, { name: "Square", args: [{ name: "t", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }] }, { name: "Sub", args: [{ name: "t1", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }, { name: "t2", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P384Element" } }] }, { name: "bytes", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 48 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		P384Element,
		[{ name: "x", key: "x", type: "fiat.p384MontgomeryDomainFieldElement", pkgPath: "crypto/internal/fips140/nistec/fiat", index: [0], offset: 0, exported: false }]
	)
}

export const p384ElementLen: number = 48

export function p384InvertEndianness(v: $.Slice<number>): void {
	for (let i = 0; i < (Math.trunc($.len(v) / 2)); i++) {
		let __goscriptAssign0_0: number = $.uint($.arrayIndex(v!, ($.len(v) - 1) - i), 8)
		let __goscriptAssign0_1: number = $.uint($.arrayIndex(v!, i), 8)
		v![i] = __goscriptAssign0_0
		v![($.len(v) - 1) - i] = __goscriptAssign0_1
	}
}

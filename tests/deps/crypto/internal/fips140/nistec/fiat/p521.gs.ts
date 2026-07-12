// Generated file based on p521.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subtle from "@goscript/crypto/internal/fips140/subtle/index.js"

import * as errors from "@goscript/errors/index.js"

import * as __goscript_p521_fiat64 from "./p521_fiat64.gs.ts"

import * as __goscript_p521_invert from "./p521_invert.gs.ts"
import "@goscript/crypto/internal/fips140/subtle/index.js"
import "@goscript/errors/index.js"
import "./p521_fiat64.gs.ts"
import "./p521_invert.gs.ts"

export type p521UntypedFieldElement = bigint[]

export class P521Element {
	// Values are represented internally always in the Montgomery domain, and
	// converted in Bytes and SetBytes.
	public get x(): __goscript_p521_fiat64.p521MontgomeryDomainFieldElement {
		return this._fields.x.value
	}
	public set x(value: __goscript_p521_fiat64.p521MontgomeryDomainFieldElement) {
		this._fields.x.value = value
	}

	public _fields: {
		x: $.VarRef<__goscript_p521_fiat64.p521MontgomeryDomainFieldElement>
	}

	constructor(init?: Partial<{x?: __goscript_p521_fiat64.p521MontgomeryDomainFieldElement}>) {
		this._fields = {
			x: $.varRef(init?.x !== undefined ? $.cloneArrayValue(init.x) : Array.from({ length: 9 }, () => 0n))
		}
	}

	public clone(): P521Element {
		const cloned = new P521Element()
		cloned._fields = {
			x: $.varRef($.cloneArrayValue(this._fields.x.value))
		}
		return $.markAsStructValue(cloned)
	}

	public Add(t1: P521Element | $.VarRef<P521Element> | null, t2: P521Element | $.VarRef<P521Element> | null): P521Element | $.VarRef<P521Element> | null {
		const e: P521Element | $.VarRef<P521Element> | null = this
		__goscript_p521_fiat64.p521Add($.pointerValue<P521Element>(e)._fields.x, $.pointerValue<P521Element>(t1)._fields.x, $.pointerValue<P521Element>(t2)._fields.x)
		return e
	}

	public Bytes(): $.Slice<number> {
		const e: P521Element | $.VarRef<P521Element> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(66))
		return P521Element.prototype.bytes.call(e, out)
	}

	public Equal(t: P521Element | $.VarRef<P521Element> | null): number {
		const e: P521Element | $.VarRef<P521Element> | null = this
		let eBytes: $.Slice<number> = P521Element.prototype.Bytes.call(e)
		let tBytes: $.Slice<number> = P521Element.prototype.Bytes.call(t)
		return subtle.ConstantTimeCompare(eBytes, tBytes)
	}

	public Invert(x: P521Element | $.VarRef<P521Element> | null): P521Element | $.VarRef<P521Element> | null {
		const e: P521Element | $.VarRef<P521Element> | null = this

		// P521Element is an integer modulo 2^521 - 1.
		//
		// The zero value is a valid zero element.

		// Values are represented internally always in the Montgomery domain, and
		// converted in Bytes and SetBytes.

		// One sets e = 1, and returns e.

		// Equal returns 1 if e == t, and zero otherwise.

		let z: P521Element | $.VarRef<P521Element> | null = P521Element.prototype.Set.call(new P521Element(), e)
		let t0: P521Element | $.VarRef<P521Element> | null = new P521Element()

		P521Element.prototype.Square.call(z, x)
		P521Element.prototype.Mul.call(z, x, z)
		P521Element.prototype.Square.call(t0, z)
		for (let s = 1; s < 2; s++) {
			P521Element.prototype.Square.call(t0, t0)
		}
		P521Element.prototype.Mul.call(z, z, t0)
		P521Element.prototype.Square.call(t0, z)
		for (let s = 1; s < 4; s++) {
			P521Element.prototype.Square.call(t0, t0)
		}
		P521Element.prototype.Mul.call(z, z, t0)
		P521Element.prototype.Square.call(t0, z)
		for (let s = 1; s < 8; s++) {
			P521Element.prototype.Square.call(t0, t0)
		}
		P521Element.prototype.Mul.call(z, z, t0)
		P521Element.prototype.Square.call(t0, z)
		for (let s = 1; s < 16; s++) {
			P521Element.prototype.Square.call(t0, t0)
		}
		P521Element.prototype.Mul.call(z, z, t0)
		P521Element.prototype.Square.call(t0, z)
		for (let s = 1; s < 32; s++) {
			P521Element.prototype.Square.call(t0, t0)
		}
		P521Element.prototype.Mul.call(z, z, t0)
		P521Element.prototype.Square.call(t0, z)
		P521Element.prototype.Mul.call(t0, x, t0)
		for (let s = 0; s < 64; s++) {
			P521Element.prototype.Square.call(t0, t0)
		}
		P521Element.prototype.Mul.call(z, z, t0)
		P521Element.prototype.Square.call(t0, z)
		P521Element.prototype.Mul.call(t0, x, t0)
		for (let s = 0; s < 129; s++) {
			P521Element.prototype.Square.call(t0, t0)
		}
		P521Element.prototype.Mul.call(z, z, t0)
		P521Element.prototype.Square.call(t0, z)
		P521Element.prototype.Mul.call(t0, x, t0)
		for (let s = 0; s < 259; s++) {
			P521Element.prototype.Square.call(t0, t0)
		}
		P521Element.prototype.Mul.call(z, z, t0)
		for (let s = 0; s < 2; s++) {
			P521Element.prototype.Square.call(z, z)
		}
		P521Element.prototype.Mul.call(z, x, z)

		return P521Element.prototype.Set.call(e, z)
	}

	public IsZero(): number {
		const e: P521Element | $.VarRef<P521Element> | null = this
		let zero: $.Slice<number> = $.makeSlice<number>(66, undefined, "byte")
		let eBytes: $.Slice<number> = P521Element.prototype.Bytes.call(e)
		return subtle.ConstantTimeCompare(eBytes, zero)
	}

	public Mul(t1: P521Element | $.VarRef<P521Element> | null, t2: P521Element | $.VarRef<P521Element> | null): P521Element | $.VarRef<P521Element> | null {
		const e: P521Element | $.VarRef<P521Element> | null = this
		__goscript_p521_fiat64.p521Mul($.pointerValue<P521Element>(e)._fields.x, $.pointerValue<P521Element>(t1)._fields.x, $.pointerValue<P521Element>(t2)._fields.x)
		return e
	}

	public One(): P521Element | $.VarRef<P521Element> | null {
		const e: P521Element | $.VarRef<P521Element> | null = this
		__goscript_p521_fiat64.p521SetOne($.pointerValue<P521Element>(e)._fields.x)
		return e
	}

	public Select(a: P521Element | $.VarRef<P521Element> | null, b: P521Element | $.VarRef<P521Element> | null, cond: number): P521Element | $.VarRef<P521Element> | null {
		const v: P521Element | $.VarRef<P521Element> | null = this
		__goscript_p521_fiat64.p521Selectznz($.unsafePointerCast<$.VarRef<p521UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p521_fiat64.p521MontgomeryDomainFieldElement>($.pointerValue<P521Element>(v)._fields.x, 9, 72, 8)), $.uint64(cond), $.unsafePointerCast<$.VarRef<p521UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p521_fiat64.p521MontgomeryDomainFieldElement>($.pointerValue<P521Element>(b)._fields.x, 9, 72, 8)), $.unsafePointerCast<$.VarRef<p521UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p521_fiat64.p521MontgomeryDomainFieldElement>($.pointerValue<P521Element>(a)._fields.x, 9, 72, 8)))
		return v
	}

	public Set(t: P521Element | $.VarRef<P521Element> | null): P521Element | $.VarRef<P521Element> | null {
		let e: P521Element | $.VarRef<P521Element> | null = this
		$.pointerValue<P521Element>(e).x = $.pointerValue<P521Element>(t).x
		return e
	}

	public SetBytes(v: $.Slice<number>): [P521Element | $.VarRef<P521Element> | null, $.GoError] {
		const e: P521Element | $.VarRef<P521Element> | null = this
		if ($.len(v) != 66) {
			return [null, errors.New("invalid P521Element encoding")]
		}

		// Check for non-canonical encodings (p + k, 2p + k, etc.) by comparing to
		// the encoding of -1 mod p, so p - 1, the highest canonical encoding.
		let minusOneEncoding: $.Slice<number> = P521Element.prototype.Bytes.call(P521Element.prototype.Sub.call(new P521Element(), new P521Element(), P521Element.prototype.One.call(new P521Element())))
		if (subtle.ConstantTimeLessOrEqBytes(v, minusOneEncoding) == 0) {
			return [null, errors.New("invalid P521Element encoding")]
		}

		let _in: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(66))
		$.copy($.goSlice(_in.value, undefined, undefined), v)
		p521InvertEndianness($.goSlice(_in.value, undefined, undefined))
		let tmp: $.VarRef<__goscript_p521_fiat64.p521NonMontgomeryDomainFieldElement> = $.varRef(Array.from({ length: 9 }, () => 0n))
		__goscript_p521_fiat64.p521FromBytes($.unsafePointerCast<$.VarRef<p521UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p521_fiat64.p521NonMontgomeryDomainFieldElement>(tmp, 9, 72, 8)), _in)
		__goscript_p521_fiat64.p521ToMontgomery($.pointerValue<P521Element>(e)._fields.x, tmp)
		return [e, null]
	}

	public Square(t: P521Element | $.VarRef<P521Element> | null): P521Element | $.VarRef<P521Element> | null {
		const e: P521Element | $.VarRef<P521Element> | null = this
		__goscript_p521_fiat64.p521Square($.pointerValue<P521Element>(e)._fields.x, $.pointerValue<P521Element>(t)._fields.x)
		return e
	}

	public Sub(t1: P521Element | $.VarRef<P521Element> | null, t2: P521Element | $.VarRef<P521Element> | null): P521Element | $.VarRef<P521Element> | null {
		const e: P521Element | $.VarRef<P521Element> | null = this
		__goscript_p521_fiat64.p521Sub($.pointerValue<P521Element>(e)._fields.x, $.pointerValue<P521Element>(t1)._fields.x, $.pointerValue<P521Element>(t2)._fields.x)
		return e
	}

	public bytes(out: $.VarRef<Uint8Array> | null): $.Slice<number> {
		const e: P521Element | $.VarRef<P521Element> | null = this
		let tmp: $.VarRef<__goscript_p521_fiat64.p521NonMontgomeryDomainFieldElement> = $.varRef(Array.from({ length: 9 }, () => 0n))
		__goscript_p521_fiat64.p521FromMontgomery(tmp, $.pointerValue<P521Element>(e)._fields.x)
		__goscript_p521_fiat64.p521ToBytes(out, $.unsafePointerCast<$.VarRef<p521UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p521_fiat64.p521NonMontgomeryDomainFieldElement>(tmp, 9, 72, 8)))
		p521InvertEndianness($.goSlice($.pointerValue<Uint8Array>(out), undefined, undefined))
		return $.goSlice($.pointerValue<Uint8Array>(out), undefined, undefined)
	}

	static __typeInfo = $.registerStructType(
		"fiat.P521Element",
		() => new P521Element(),
		[{ name: "Add", args: [{ name: "t1", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }, { name: "t2", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Equal", args: [{ name: "t", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Invert", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }] }, { name: "IsZero", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Mul", args: [{ name: "t1", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }, { name: "t2", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }] }, { name: "One", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }] }, { name: "Select", args: [{ name: "a", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }, { name: "b", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }, { name: "cond", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }] }, { name: "Set", args: [{ name: "t", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }] }, { name: "SetBytes", args: [{ name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }, { name: "_r1", type: "error" }] }, { name: "Square", args: [{ name: "t", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }] }, { name: "Sub", args: [{ name: "t1", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }, { name: "t2", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" } }] }, { name: "bytes", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 66 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		P521Element,
		[{ name: "x", key: "x", type: "fiat.p521MontgomeryDomainFieldElement", pkgPath: "crypto/internal/fips140/nistec/fiat", index: [0], offset: 0, exported: false }]
	)
}

export const p521ElementLen: number = 66

export function p521InvertEndianness(v: $.Slice<number>): void {
	for (let i = 0; i < (Math.trunc($.len(v) / 2)); i++) {
		let __goscriptAssign0_0: number = $.uint($.arrayIndex(v!, ($.len(v) - 1) - i), 8)
		let __goscriptAssign0_1: number = $.uint($.arrayIndex(v!, i), 8)
		v![i] = __goscriptAssign0_0
		v![($.len(v) - 1) - i] = __goscriptAssign0_1
	}
}

// Generated file based on p224.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subtle from "@goscript/crypto/internal/fips140/subtle/index.js"

import * as errors from "@goscript/errors/index.js"

import * as __goscript_p224_fiat64 from "./p224_fiat64.gs.ts"

import * as __goscript_p224_invert from "./p224_invert.gs.ts"
import "@goscript/crypto/internal/fips140/subtle/index.js"
import "@goscript/errors/index.js"
import "./p224_fiat64.gs.ts"
import "./p224_invert.gs.ts"

export type p224UntypedFieldElement = bigint[]

export class P224Element {
	// Values are represented internally always in the Montgomery domain, and
	// converted in Bytes and SetBytes.
	public get x(): __goscript_p224_fiat64.p224MontgomeryDomainFieldElement {
		return this._fields.x.value
	}
	public set x(value: __goscript_p224_fiat64.p224MontgomeryDomainFieldElement) {
		this._fields.x.value = value
	}

	public _fields: {
		x: $.VarRef<__goscript_p224_fiat64.p224MontgomeryDomainFieldElement>
	}

	constructor(init?: Partial<{x?: __goscript_p224_fiat64.p224MontgomeryDomainFieldElement}>) {
		this._fields = {
			x: $.varRef(init?.x !== undefined ? $.cloneArrayValue(init.x) : Array.from({ length: 4 }, () => 0n))
		}
	}

	public clone(): P224Element {
		const cloned = new P224Element()
		cloned._fields = {
			x: $.varRef($.cloneArrayValue(this._fields.x.value))
		}
		return $.markAsStructValue(cloned)
	}

	public Add(t1: P224Element | $.VarRef<P224Element> | null, t2: P224Element | $.VarRef<P224Element> | null): P224Element | $.VarRef<P224Element> | null {
		const e: P224Element | $.VarRef<P224Element> | null = this
		__goscript_p224_fiat64.p224Add($.pointerValue<P224Element>(e)._fields.x, $.pointerValue<P224Element>(t1)._fields.x, $.pointerValue<P224Element>(t2)._fields.x)
		return e
	}

	public Bytes(): $.Slice<number> {
		const e: P224Element | $.VarRef<P224Element> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(28))
		return P224Element.prototype.bytes.call(e, out)
	}

	public Equal(t: P224Element | $.VarRef<P224Element> | null): number {
		const e: P224Element | $.VarRef<P224Element> | null = this
		let eBytes: $.Slice<number> = P224Element.prototype.Bytes.call(e)
		let tBytes: $.Slice<number> = P224Element.prototype.Bytes.call(t)
		return subtle.ConstantTimeCompare(eBytes, tBytes)
	}

	public Invert(x: P224Element | $.VarRef<P224Element> | null): P224Element | $.VarRef<P224Element> | null {
		const e: P224Element | $.VarRef<P224Element> | null = this

		// P224Element is an integer modulo 2^224 - 2^96 + 1.
		//
		// The zero value is a valid zero element.

		// Values are represented internally always in the Montgomery domain, and
		// converted in Bytes and SetBytes.

		// One sets e = 1, and returns e.

		let z: P224Element | $.VarRef<P224Element> | null = P224Element.prototype.Set.call(new P224Element(), e)
		let t0: P224Element | $.VarRef<P224Element> | null = new P224Element()
		let t1: P224Element | $.VarRef<P224Element> | null = new P224Element()
		let t2: P224Element | $.VarRef<P224Element> | null = new P224Element()

		P224Element.prototype.Square.call(z, x)
		P224Element.prototype.Mul.call(t0, x, z)
		P224Element.prototype.Square.call(z, t0)
		P224Element.prototype.Mul.call(z, x, z)
		P224Element.prototype.Square.call(t1, z)
		for (let s = 1; s < 3; s++) {
			P224Element.prototype.Square.call(t1, t1)
		}
		P224Element.prototype.Mul.call(t1, z, t1)
		P224Element.prototype.Square.call(t2, t1)
		for (let s = 1; s < 6; s++) {
			P224Element.prototype.Square.call(t2, t2)
		}
		P224Element.prototype.Mul.call(t1, t1, t2)
		for (let s = 0; s < 2; s++) {
			P224Element.prototype.Square.call(t1, t1)
		}
		P224Element.prototype.Mul.call(t0, t0, t1)
		P224Element.prototype.Square.call(t1, t0)
		for (let s = 1; s < 3; s++) {
			P224Element.prototype.Square.call(t1, t1)
		}
		P224Element.prototype.Mul.call(z, z, t1)
		P224Element.prototype.Square.call(t1, z)
		for (let s = 1; s < 14; s++) {
			P224Element.prototype.Square.call(t1, t1)
		}
		P224Element.prototype.Mul.call(t0, t0, t1)
		P224Element.prototype.Square.call(t1, t0)
		for (let s = 1; s < 17; s++) {
			P224Element.prototype.Square.call(t1, t1)
		}
		P224Element.prototype.Mul.call(z, z, t1)
		P224Element.prototype.Square.call(t1, z)
		for (let s = 1; s < 48; s++) {
			P224Element.prototype.Square.call(t1, t1)
		}
		P224Element.prototype.Mul.call(z, z, t1)
		P224Element.prototype.Square.call(t1, z)
		for (let s = 1; s < 31; s++) {
			P224Element.prototype.Square.call(t1, t1)
		}
		P224Element.prototype.Mul.call(t0, t0, t1)
		for (let s = 0; s < 97; s++) {
			P224Element.prototype.Square.call(t0, t0)
		}
		P224Element.prototype.Mul.call(z, z, t0)

		return P224Element.prototype.Set.call(e, z)
	}

	public IsZero(): number {
		const e: P224Element | $.VarRef<P224Element> | null = this
		let zero: $.Slice<number> = $.makeSlice<number>(28, undefined, "byte")
		let eBytes: $.Slice<number> = P224Element.prototype.Bytes.call(e)
		return subtle.ConstantTimeCompare(eBytes, zero)
	}

	public Mul(t1: P224Element | $.VarRef<P224Element> | null, t2: P224Element | $.VarRef<P224Element> | null): P224Element | $.VarRef<P224Element> | null {
		const e: P224Element | $.VarRef<P224Element> | null = this
		__goscript_p224_fiat64.p224Mul($.pointerValue<P224Element>(e)._fields.x, $.pointerValue<P224Element>(t1)._fields.x, $.pointerValue<P224Element>(t2)._fields.x)
		return e
	}

	public One(): P224Element | $.VarRef<P224Element> | null {
		const e: P224Element | $.VarRef<P224Element> | null = this
		__goscript_p224_fiat64.p224SetOne($.pointerValue<P224Element>(e)._fields.x)
		return e
	}

	public Select(a: P224Element | $.VarRef<P224Element> | null, b: P224Element | $.VarRef<P224Element> | null, cond: number): P224Element | $.VarRef<P224Element> | null {
		const v: P224Element | $.VarRef<P224Element> | null = this
		__goscript_p224_fiat64.p224Selectznz($.unsafePointerCast<$.VarRef<p224UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p224_fiat64.p224MontgomeryDomainFieldElement>($.pointerValue<P224Element>(v)._fields.x, 4, 32, 8)), $.uint64(cond), $.unsafePointerCast<$.VarRef<p224UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p224_fiat64.p224MontgomeryDomainFieldElement>($.pointerValue<P224Element>(b)._fields.x, 4, 32, 8)), $.unsafePointerCast<$.VarRef<p224UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p224_fiat64.p224MontgomeryDomainFieldElement>($.pointerValue<P224Element>(a)._fields.x, 4, 32, 8)))
		return v
	}

	public Set(t: P224Element | $.VarRef<P224Element> | null): P224Element | $.VarRef<P224Element> | null {
		let e: P224Element | $.VarRef<P224Element> | null = this
		$.pointerValue<P224Element>(e).x = $.pointerValue<P224Element>(t).x
		return e
	}

	public SetBytes(v: $.Slice<number>): [P224Element | $.VarRef<P224Element> | null, $.GoError] {
		const e: P224Element | $.VarRef<P224Element> | null = this
		if ($.len(v) != 28) {
			return [null, errors.New("invalid P224Element encoding")]
		}

		// Check for non-canonical encodings (p + k, 2p + k, etc.) by comparing to
		// the encoding of -1 mod p, so p - 1, the highest canonical encoding.
		let minusOneEncoding: $.Slice<number> = P224Element.prototype.Bytes.call(P224Element.prototype.Sub.call(new P224Element(), new P224Element(), P224Element.prototype.One.call(new P224Element())))
		if (subtle.ConstantTimeLessOrEqBytes(v, minusOneEncoding) == 0) {
			return [null, errors.New("invalid P224Element encoding")]
		}

		let _in: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(28))
		$.copy($.goSlice(_in.value, undefined, undefined), v)
		p224InvertEndianness($.goSlice(_in.value, undefined, undefined))
		let tmp: $.VarRef<__goscript_p224_fiat64.p224NonMontgomeryDomainFieldElement> = $.varRef(Array.from({ length: 4 }, () => 0n))
		__goscript_p224_fiat64.p224FromBytes($.unsafePointerCast<$.VarRef<p224UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p224_fiat64.p224NonMontgomeryDomainFieldElement>(tmp, 4, 32, 8)), _in)
		__goscript_p224_fiat64.p224ToMontgomery($.pointerValue<P224Element>(e)._fields.x, tmp)
		return [e, null]
	}

	public Square(t: P224Element | $.VarRef<P224Element> | null): P224Element | $.VarRef<P224Element> | null {
		const e: P224Element | $.VarRef<P224Element> | null = this
		__goscript_p224_fiat64.p224Square($.pointerValue<P224Element>(e)._fields.x, $.pointerValue<P224Element>(t)._fields.x)
		return e
	}

	public Sub(t1: P224Element | $.VarRef<P224Element> | null, t2: P224Element | $.VarRef<P224Element> | null): P224Element | $.VarRef<P224Element> | null {
		const e: P224Element | $.VarRef<P224Element> | null = this
		__goscript_p224_fiat64.p224Sub($.pointerValue<P224Element>(e)._fields.x, $.pointerValue<P224Element>(t1)._fields.x, $.pointerValue<P224Element>(t2)._fields.x)
		return e
	}

	public bytes(out: $.VarRef<Uint8Array> | null): $.Slice<number> {
		const e: P224Element | $.VarRef<P224Element> | null = this
		let tmp: $.VarRef<__goscript_p224_fiat64.p224NonMontgomeryDomainFieldElement> = $.varRef(Array.from({ length: 4 }, () => 0n))
		__goscript_p224_fiat64.p224FromMontgomery(tmp, $.pointerValue<P224Element>(e)._fields.x)
		__goscript_p224_fiat64.p224ToBytes(out, $.unsafePointerCast<$.VarRef<p224UntypedFieldElement> | null>($.arrayPointerFromIndexRef<__goscript_p224_fiat64.p224NonMontgomeryDomainFieldElement>(tmp, 4, 32, 8)))
		p224InvertEndianness($.goSlice($.pointerValue<Uint8Array>(out), undefined, undefined))
		return $.goSlice($.pointerValue<Uint8Array>(out), undefined, undefined)
	}

	static __typeInfo = $.registerStructType(
		"fiat.P224Element",
		() => new P224Element(),
		[{ name: "Add", args: [{ name: "t1", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }, { name: "t2", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Equal", args: [{ name: "t", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Invert", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }] }, { name: "IsZero", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Mul", args: [{ name: "t1", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }, { name: "t2", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }] }, { name: "One", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }] }, { name: "Select", args: [{ name: "a", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }, { name: "b", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }, { name: "cond", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }] }, { name: "Set", args: [{ name: "t", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }] }, { name: "SetBytes", args: [{ name: "v", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }, { name: "_r1", type: "error" }] }, { name: "Square", args: [{ name: "t", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }] }, { name: "Sub", args: [{ name: "t1", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }, { name: "t2", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" } }] }, { name: "bytes", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 28 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		P224Element,
		[{ name: "x", key: "x", type: "fiat.p224MontgomeryDomainFieldElement", pkgPath: "crypto/internal/fips140/nistec/fiat", index: [0], offset: 0, exported: false }]
	)
}

export const p224ElementLen: number = 28

export function p224InvertEndianness(v: $.Slice<number>): void {
	for (let i = 0; i < (Math.trunc($.len(v) / 2)); i++) {
		let __goscriptAssign0_0: number = $.uint($.arrayIndex(v!, ($.len(v) - 1) - i), 8)
		let __goscriptAssign0_1: number = $.uint($.arrayIndex(v!, i), 8)
		v![i] = __goscriptAssign0_0
		v![($.len(v) - 1) - i] = __goscriptAssign0_1
	}
}

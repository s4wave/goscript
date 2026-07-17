// Generated file based on p256.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as constanttime from "@goscript/crypto/internal/constanttime/index.js"

import * as fiat from "@goscript/crypto/internal/fips140/nistec/fiat/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as cpu from "@goscript/crypto/internal/fips140deps/cpu/index.js"

import * as errors from "@goscript/errors/index.js"

import * as bits from "@goscript/math/bits/index.js"

import * as sync from "@goscript/sync/index.js"

import * as unsafe from "@goscript/unsafe/index.js"

import * as __goscript_p256_table from "./p256_table.gs.ts"
import "@goscript/crypto/internal/constanttime/index.js"
import "@goscript/crypto/internal/fips140/nistec/fiat/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/crypto/internal/fips140deps/cpu/index.js"
import "@goscript/errors/index.js"
import "@goscript/math/bits/index.js"
import "@goscript/sync/index.js"
import "@goscript/unsafe/index.js"
import "./p256_table.gs.ts"

export type p256OrdElement = bigint[]

export type p256Table = P256Point[]

export type p256AffineTable = p256AffinePoint[]

export class P256Point {
	// The point is represented in projective coordinates (X:Y:Z), where x = X/Z
	// and y = Y/Z. Infinity is (0:1:0).
	//
	// fiat.P256Element is a base field element in [0, P-1] in the Montgomery
	// domain (with R 2²⁵⁶ and P 2²⁵⁶ - 2²²⁴ + 2¹⁹² + 2⁹⁶ - 1) as four limbs in
	// little-endian order value.
	public get x(): fiat.P256Element {
		return this._fields.x.value
	}
	public set x(value: fiat.P256Element) {
		this._fields.x.value = value
	}

	// The point is represented in projective coordinates (X:Y:Z), where x = X/Z
	// and y = Y/Z. Infinity is (0:1:0).
	//
	// fiat.P256Element is a base field element in [0, P-1] in the Montgomery
	// domain (with R 2²⁵⁶ and P 2²⁵⁶ - 2²²⁴ + 2¹⁹² + 2⁹⁶ - 1) as four limbs in
	// little-endian order value.
	public get y(): fiat.P256Element {
		return this._fields.y.value
	}
	public set y(value: fiat.P256Element) {
		this._fields.y.value = value
	}

	// The point is represented in projective coordinates (X:Y:Z), where x = X/Z
	// and y = Y/Z. Infinity is (0:1:0).
	//
	// fiat.P256Element is a base field element in [0, P-1] in the Montgomery
	// domain (with R 2²⁵⁶ and P 2²⁵⁶ - 2²²⁴ + 2¹⁹² + 2⁹⁶ - 1) as four limbs in
	// little-endian order value.
	public get z(): fiat.P256Element {
		return this._fields.z.value
	}
	public set z(value: fiat.P256Element) {
		this._fields.z.value = value
	}

	public _fields: {
		x: $.VarRef<fiat.P256Element>
		y: $.VarRef<fiat.P256Element>
		z: $.VarRef<fiat.P256Element>
	}

	constructor(init?: Partial<{x?: fiat.P256Element, y?: fiat.P256Element, z?: fiat.P256Element}>) {
		this._fields = {
			x: $.varRef(init?.x ? $.markAsStructValue($.cloneStructValue(init.x)) : $.markAsStructValue(new fiat.P256Element())),
			y: $.varRef(init?.y ? $.markAsStructValue($.cloneStructValue(init.y)) : $.markAsStructValue(new fiat.P256Element())),
			z: $.varRef(init?.z ? $.markAsStructValue($.cloneStructValue(init.z)) : $.markAsStructValue(new fiat.P256Element()))
		}
	}

	public clone(): P256Point {
		const cloned = new P256Point()
		cloned._fields = {
			x: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.x.value))),
			y: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.y.value))),
			z: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.z.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Add(p1: P256Point | $.VarRef<P256Point> | null, p2: P256Point | $.VarRef<P256Point> | null): globalThis.Promise<P256Point | $.VarRef<P256Point> | null> {
		const q: P256Point | $.VarRef<P256Point> | null = this
		// Complete addition formula for a = -3 from "Complete addition formulas for
		// prime order elliptic curves" (https://eprint.iacr.org/2015/1060), §A.2.

		let t0: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<P256Point>(p1)._fields.x, $.pointerValue<P256Point>(p2)._fields.x)
		let t1: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<P256Point>(p1)._fields.y, $.pointerValue<P256Point>(p2)._fields.y)
		let t2: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<P256Point>(p1)._fields.z, $.pointerValue<P256Point>(p2)._fields.z)
		let t3: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Add.call(new fiat.P256Element(), $.pointerValue<P256Point>(p1)._fields.x, $.pointerValue<P256Point>(p1)._fields.y)
		let t4: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Add.call(new fiat.P256Element(), $.pointerValue<P256Point>(p2)._fields.x, $.pointerValue<P256Point>(p2)._fields.y)
		fiat.P256Element.prototype.Mul.call(t3, t3, t4)
		fiat.P256Element.prototype.Add.call(t4, t0, t1)
		fiat.P256Element.prototype.Sub.call(t3, t3, t4)
		fiat.P256Element.prototype.Add.call(t4, $.pointerValue<P256Point>(p1)._fields.y, $.pointerValue<P256Point>(p1)._fields.z)
		let x3: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Add.call(new fiat.P256Element(), $.pointerValue<P256Point>(p2)._fields.y, $.pointerValue<P256Point>(p2)._fields.z)
		fiat.P256Element.prototype.Mul.call(t4, t4, x3)
		fiat.P256Element.prototype.Add.call(x3, t1, t2)
		fiat.P256Element.prototype.Sub.call(t4, t4, x3)
		fiat.P256Element.prototype.Add.call(x3, $.pointerValue<P256Point>(p1)._fields.x, $.pointerValue<P256Point>(p1)._fields.z)
		let y3: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Add.call(new fiat.P256Element(), $.pointerValue<P256Point>(p2)._fields.x, $.pointerValue<P256Point>(p2)._fields.z)
		fiat.P256Element.prototype.Mul.call(x3, x3, y3)
		fiat.P256Element.prototype.Add.call(y3, t0, t2)
		fiat.P256Element.prototype.Sub.call(y3, x3, y3)
		let z3: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), await p256B(), t2)
		fiat.P256Element.prototype.Sub.call(x3, y3, z3)
		fiat.P256Element.prototype.Add.call(z3, x3, x3)
		fiat.P256Element.prototype.Add.call(x3, x3, z3)
		fiat.P256Element.prototype.Sub.call(z3, t1, x3)
		fiat.P256Element.prototype.Add.call(x3, t1, x3)
		fiat.P256Element.prototype.Mul.call(y3, await p256B(), y3)
		fiat.P256Element.prototype.Add.call(t1, t2, t2)
		fiat.P256Element.prototype.Add.call(t2, t1, t2)
		fiat.P256Element.prototype.Sub.call(y3, y3, t2)
		fiat.P256Element.prototype.Sub.call(y3, y3, t0)
		fiat.P256Element.prototype.Add.call(t1, y3, y3)
		fiat.P256Element.prototype.Add.call(y3, t1, y3)
		fiat.P256Element.prototype.Add.call(t1, t0, t0)
		fiat.P256Element.prototype.Add.call(t0, t1, t0)
		fiat.P256Element.prototype.Sub.call(t0, t0, t2)
		fiat.P256Element.prototype.Mul.call(t1, t4, y3)
		fiat.P256Element.prototype.Mul.call(t2, t0, y3)
		fiat.P256Element.prototype.Mul.call(y3, x3, z3)
		fiat.P256Element.prototype.Add.call(y3, y3, t2)
		fiat.P256Element.prototype.Mul.call(x3, t3, x3)
		fiat.P256Element.prototype.Sub.call(x3, x3, t1)
		fiat.P256Element.prototype.Mul.call(z3, t4, z3)
		fiat.P256Element.prototype.Mul.call(t1, t3, t0)
		fiat.P256Element.prototype.Add.call(z3, z3, t1)

		$.pointerValue<P256Point>(q).x.Set(x3)
		$.pointerValue<P256Point>(q).y.Set(y3)
		$.pointerValue<P256Point>(q).z.Set(z3)
		return q
	}

	public async AddAffine(p1: P256Point | $.VarRef<P256Point> | null, p2: p256AffinePoint | $.VarRef<p256AffinePoint> | null, infinity: number): globalThis.Promise<P256Point | $.VarRef<P256Point> | null> {
		const q: P256Point | $.VarRef<P256Point> | null = this
		// Complete mixed addition formula for a = -3 from "Complete addition
		// formulas for prime order elliptic curves"
		// (https://eprint.iacr.org/2015/1060), Algorithm 5.

		let t0: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<P256Point>(p1)._fields.x, $.pointerValue<p256AffinePoint>(p2)._fields.x)
		let t1: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<P256Point>(p1)._fields.y, $.pointerValue<p256AffinePoint>(p2)._fields.y)
		let t3: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Add.call(new fiat.P256Element(), $.pointerValue<p256AffinePoint>(p2)._fields.x, $.pointerValue<p256AffinePoint>(p2)._fields.y)
		let t4: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Add.call(new fiat.P256Element(), $.pointerValue<P256Point>(p1)._fields.x, $.pointerValue<P256Point>(p1)._fields.y)
		fiat.P256Element.prototype.Mul.call(t3, t3, t4)
		fiat.P256Element.prototype.Add.call(t4, t0, t1)
		fiat.P256Element.prototype.Sub.call(t3, t3, t4)
		fiat.P256Element.prototype.Mul.call(t4, $.pointerValue<p256AffinePoint>(p2)._fields.y, $.pointerValue<P256Point>(p1)._fields.z)
		fiat.P256Element.prototype.Add.call(t4, t4, $.pointerValue<P256Point>(p1)._fields.y)
		let y3: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<p256AffinePoint>(p2)._fields.x, $.pointerValue<P256Point>(p1)._fields.z)
		fiat.P256Element.prototype.Add.call(y3, y3, $.pointerValue<P256Point>(p1)._fields.x)
		let z3: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), await p256B(), $.pointerValue<P256Point>(p1)._fields.z)
		let x3: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Sub.call(new fiat.P256Element(), y3, z3)
		fiat.P256Element.prototype.Add.call(z3, x3, x3)
		fiat.P256Element.prototype.Add.call(x3, x3, z3)
		fiat.P256Element.prototype.Sub.call(z3, t1, x3)
		fiat.P256Element.prototype.Add.call(x3, t1, x3)
		fiat.P256Element.prototype.Mul.call(y3, await p256B(), y3)
		fiat.P256Element.prototype.Add.call(t1, $.pointerValue<P256Point>(p1)._fields.z, $.pointerValue<P256Point>(p1)._fields.z)
		let t2: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Add.call(new fiat.P256Element(), t1, $.pointerValue<P256Point>(p1)._fields.z)
		fiat.P256Element.prototype.Sub.call(y3, y3, t2)
		fiat.P256Element.prototype.Sub.call(y3, y3, t0)
		fiat.P256Element.prototype.Add.call(t1, y3, y3)
		fiat.P256Element.prototype.Add.call(y3, t1, y3)
		fiat.P256Element.prototype.Add.call(t1, t0, t0)
		fiat.P256Element.prototype.Add.call(t0, t1, t0)
		fiat.P256Element.prototype.Sub.call(t0, t0, t2)
		fiat.P256Element.prototype.Mul.call(t1, t4, y3)
		fiat.P256Element.prototype.Mul.call(t2, t0, y3)
		fiat.P256Element.prototype.Mul.call(y3, x3, z3)
		fiat.P256Element.prototype.Add.call(y3, y3, t2)
		fiat.P256Element.prototype.Mul.call(x3, t3, x3)
		fiat.P256Element.prototype.Sub.call(x3, x3, t1)
		fiat.P256Element.prototype.Mul.call(z3, t4, z3)
		fiat.P256Element.prototype.Mul.call(t1, t3, t0)
		fiat.P256Element.prototype.Add.call(z3, z3, t1)

		$.pointerValue<P256Point>(q).x.Select($.pointerValue<P256Point>(p1)._fields.x, x3, infinity)
		$.pointerValue<P256Point>(q).y.Select($.pointerValue<P256Point>(p1)._fields.y, y3, infinity)
		$.pointerValue<P256Point>(q).z.Select($.pointerValue<P256Point>(p1)._fields.z, z3, infinity)
		return q
	}

	public Bytes(): $.Slice<number> {
		const p: P256Point | $.VarRef<P256Point> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(65))
		return P256Point.prototype.bytes.call(p, out)
	}

	public BytesCompressed(): $.Slice<number> {
		const p: P256Point | $.VarRef<P256Point> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(33))
		return P256Point.prototype.bytesCompressed.call(p, out)
	}

	public BytesX(): [$.Slice<number>, $.GoError] {
		const p: P256Point | $.VarRef<P256Point> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(32))
		return P256Point.prototype.bytesX.call(p, out)
	}

	public async Double(p: P256Point | $.VarRef<P256Point> | null): globalThis.Promise<P256Point | $.VarRef<P256Point> | null> {
		const q: P256Point | $.VarRef<P256Point> | null = this
		// Complete addition formula for a = -3 from "Complete addition formulas for
		// prime order elliptic curves" (https://eprint.iacr.org/2015/1060), §A.2.

		let t0: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Square.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.x)
		let t1: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Square.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.y)
		let t2: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Square.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.z)
		let t3: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.x, $.pointerValue<P256Point>(p)._fields.y)
		fiat.P256Element.prototype.Add.call(t3, t3, t3)
		let z3: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.x, $.pointerValue<P256Point>(p)._fields.z)
		fiat.P256Element.prototype.Add.call(z3, z3, z3)
		let y3: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), await p256B(), t2)
		fiat.P256Element.prototype.Sub.call(y3, y3, z3)
		let x3: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Add.call(new fiat.P256Element(), y3, y3)
		fiat.P256Element.prototype.Add.call(y3, x3, y3)
		fiat.P256Element.prototype.Sub.call(x3, t1, y3)
		fiat.P256Element.prototype.Add.call(y3, t1, y3)
		fiat.P256Element.prototype.Mul.call(y3, x3, y3)
		fiat.P256Element.prototype.Mul.call(x3, x3, t3)
		fiat.P256Element.prototype.Add.call(t3, t2, t2)
		fiat.P256Element.prototype.Add.call(t2, t2, t3)
		fiat.P256Element.prototype.Mul.call(z3, await p256B(), z3)
		fiat.P256Element.prototype.Sub.call(z3, z3, t2)
		fiat.P256Element.prototype.Sub.call(z3, z3, t0)
		fiat.P256Element.prototype.Add.call(t3, z3, z3)
		fiat.P256Element.prototype.Add.call(z3, z3, t3)
		fiat.P256Element.prototype.Add.call(t3, t0, t0)
		fiat.P256Element.prototype.Add.call(t0, t3, t0)
		fiat.P256Element.prototype.Sub.call(t0, t0, t2)
		fiat.P256Element.prototype.Mul.call(t0, t0, z3)
		fiat.P256Element.prototype.Add.call(y3, y3, t0)
		fiat.P256Element.prototype.Mul.call(t0, $.pointerValue<P256Point>(p)._fields.y, $.pointerValue<P256Point>(p)._fields.z)
		fiat.P256Element.prototype.Add.call(t0, t0, t0)
		fiat.P256Element.prototype.Mul.call(z3, t0, z3)
		fiat.P256Element.prototype.Sub.call(x3, x3, z3)
		fiat.P256Element.prototype.Mul.call(z3, t0, t1)
		fiat.P256Element.prototype.Add.call(z3, z3, z3)
		fiat.P256Element.prototype.Add.call(z3, z3, z3)

		$.pointerValue<P256Point>(q).x.Set(x3)
		$.pointerValue<P256Point>(q).y.Set(y3)
		$.pointerValue<P256Point>(q).z.Set(z3)
		return q
	}

	public Negate(cond: number): P256Point | $.VarRef<P256Point> | null {
		const p: P256Point | $.VarRef<P256Point> | null = this
		let negY: fiat.P256Element | $.VarRef<fiat.P256Element> | null = new fiat.P256Element()
		fiat.P256Element.prototype.Sub.call(negY, negY, $.pointerValue<P256Point>(p)._fields.y)
		$.pointerValue<P256Point>(p).y.Select(negY, $.pointerValue<P256Point>(p)._fields.y, cond)
		return p
	}

	public async ScalarBaseMult(scalar: $.Slice<number>): globalThis.Promise<[P256Point | $.VarRef<P256Point> | null, $.GoError]> {
		const p: P256Point | $.VarRef<P256Point> | null = this
		// This function works like ScalarMult above, but the table is fixed and
		// "pre-doubled" for each iteration, so instead of doubling we move to the
		// next table at each iteration.

		let __goscriptTuple0: any = p256OrdElement_SetBytes($.varRef<p256OrdElement>(Array.from({ length: 4 }, () => 0n)), scalar)
		let s: $.VarRef<p256OrdElement> | null = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}

		// Start scanning the window from the most significant bits. We move by
		// 6 bits at a time and need to finish at -1, so -1 + 6 * 42 = 251.
		let index = 251

		let __goscriptTuple1: any = boothW6(p256OrdElement_Rsh(s, index))
		let sel = $.uint(__goscriptTuple1[0], 8)
		let sign = __goscriptTuple1[1]
		// sign is always zero because the boothW6 input here is at
		// most five bits long, so the top bit is never set.
		sign

		let t: p256AffinePoint | $.VarRef<p256AffinePoint> | null = new p256AffinePoint()
		let table: $.VarRef<p256AffineTable> | null = $.indexRef($.pointerValue<p256AffineTable[]>(p256GeneratorTables), Math.trunc((index + 1) / 6))
		p256AffineTable_Select(table, t, $.uint(sel, 8))

		// Select's output is undefined if the selector is zero, when it should be
		// the point at infinity (because infinity can't be represented in affine
		// coordinates). Here we conditionally set p to the infinity if sel is zero.
		// In the loop, that's handled by AddAffine.
		let selIsZero = constanttime.ByteEq($.uint(sel, 8), $.uint(0, 8))
		P256Point.prototype.Select.call(p, NewP256Point(), p256AffinePoint.prototype.Projective.call(t), selIsZero)

		while (index >= 5) {
			index = index - (6)

			if (index >= 0) {
				let __goscriptTuple2: any = boothW6($.uint64And(p256OrdElement_Rsh(s, index), 127n))
				sel = $.uint(__goscriptTuple2[0], 8)
				sign = __goscriptTuple2[1]
			} else {
				// Booth encoding considers a virtual zero bit at index -1,
				// so we shift left the least significant limb.
				let wvalue = $.uint64And(($.uint64Shl($.arrayIndex($.pointerValue<bigint[]>(s), 0), 1n)), 127n)
				let __goscriptTuple3: any = boothW6(wvalue)
				sel = $.uint(__goscriptTuple3[0], 8)
				sign = __goscriptTuple3[1]
			}

			let __goscriptShadow0: $.VarRef<p256AffineTable> | null = $.indexRef($.pointerValue<p256AffineTable[]>(p256GeneratorTables), Math.trunc((index + 1) / 6))
			p256AffineTable_Select(__goscriptShadow0, t, $.uint(sel, 8))
			p256AffinePoint.prototype.Negate.call(t, sign)
			let __goscriptShadow1 = constanttime.ByteEq($.uint(sel, 8), $.uint(0, 8))
			await P256Point.prototype.AddAffine.call(p, p, t, __goscriptShadow1)
		}

		return [p, null]
	}

	public async ScalarMult(q: P256Point | $.VarRef<P256Point> | null, scalar: $.Slice<number>): globalThis.Promise<[P256Point | $.VarRef<P256Point> | null, $.GoError]> {
		const p: P256Point | $.VarRef<P256Point> | null = this
		let __goscriptTuple4: any = p256OrdElement_SetBytes($.varRef<p256OrdElement>(Array.from({ length: 4 }, () => 0n)), scalar)
		let s: $.VarRef<p256OrdElement> | null = __goscriptTuple4[0]
		let err = __goscriptTuple4[1]
		if (err != null) {
			return [null, err]
		}

		// Start scanning the window from the most significant bits. We move by
		// 5 bits at a time and need to finish at -1, so -1 + 5 * 51 = 254.
		let index = 254

		let __goscriptTuple5: any = boothW5(p256OrdElement_Rsh(s, index))
		let sel = $.uint(__goscriptTuple5[0], 8)
		let sign = __goscriptTuple5[1]
		// sign is always zero because the boothW5 input here is at
		// most two bits long, so the top bit is never set.
		sign

		// Neither Select nor Add have exceptions for the point at infinity /
		// selector zero, so we don't need to check for it here or in the loop.
		let table: $.VarRef<p256Table> | null = await p256Table_Compute($.varRef<p256Table>(Array.from({ length: 16 }, () => $.markAsStructValue(new P256Point()))), q)
		p256Table_Select(table, p, $.uint(sel, 8))

		let t: P256Point | $.VarRef<P256Point> | null = NewP256Point()
		while (index >= 4) {
			index = index - (5)

			await P256Point.prototype.Double.call(p, p)
			await P256Point.prototype.Double.call(p, p)
			await P256Point.prototype.Double.call(p, p)
			await P256Point.prototype.Double.call(p, p)
			await P256Point.prototype.Double.call(p, p)

			if (index >= 0) {
				let __goscriptTuple6: any = boothW5($.uint64And(p256OrdElement_Rsh(s, index), 63n))
				sel = $.uint(__goscriptTuple6[0], 8)
				sign = __goscriptTuple6[1]
			} else {
				// Booth encoding considers a virtual zero bit at index -1,
				// so we shift left the least significant limb.
				let wvalue = $.uint64And(($.uint64Shl($.arrayIndex($.pointerValue<bigint[]>(s), 0), 1n)), 63n)
				let __goscriptTuple7: any = boothW5(wvalue)
				sel = $.uint(__goscriptTuple7[0], 8)
				sign = __goscriptTuple7[1]
			}

			p256Table_Select(table, t, $.uint(sel, 8))
			P256Point.prototype.Negate.call(t, sign)
			await P256Point.prototype.Add.call(p, p, t)
		}

		return [p, null]
	}

	public Select(p1: P256Point | $.VarRef<P256Point> | null, p2: P256Point | $.VarRef<P256Point> | null, cond: number): P256Point | $.VarRef<P256Point> | null {
		const q: P256Point | $.VarRef<P256Point> | null = this
		$.pointerValue<P256Point>(q).x.Select($.pointerValue<P256Point>(p1)._fields.x, $.pointerValue<P256Point>(p2)._fields.x, cond)
		$.pointerValue<P256Point>(q).y.Select($.pointerValue<P256Point>(p1)._fields.y, $.pointerValue<P256Point>(p2)._fields.y, cond)
		$.pointerValue<P256Point>(q).z.Select($.pointerValue<P256Point>(p1)._fields.z, $.pointerValue<P256Point>(p2)._fields.z, cond)
		return q
	}

	public Set(q: P256Point | $.VarRef<P256Point> | null): P256Point | $.VarRef<P256Point> | null {
		const p: P256Point | $.VarRef<P256Point> | null = this
		$.pointerValue<P256Point>(p).x.Set($.pointerValue<P256Point>(q)._fields.x)
		$.pointerValue<P256Point>(p).y.Set($.pointerValue<P256Point>(q)._fields.y)
		$.pointerValue<P256Point>(p).z.Set($.pointerValue<P256Point>(q)._fields.z)
		return p
	}

	public async SetBytes(b: $.Slice<number>): globalThis.Promise<[P256Point | $.VarRef<P256Point> | null, $.GoError]> {
		const p: P256Point | $.VarRef<P256Point> | null = this
		switch (true) {
			case ($.len(b) == 1) && ($.uint($.arrayIndex(b!, 0), 8) == $.uint(0, 8)):
			{
				return [P256Point.prototype.Set.call(p, NewP256Point()), null]
				break
			}
			case ($.len(b) == 65) && ($.uint($.arrayIndex(b!, 0), 8) == $.uint(4, 8)):
			{
				let __goscriptTuple8: any = fiat.P256Element.prototype.SetBytes.call(new fiat.P256Element(), $.goSlice(b, 1, 1 + 32))
				let x: fiat.P256Element | $.VarRef<fiat.P256Element> | null = __goscriptTuple8[0]
				let err = __goscriptTuple8[1]
				if (err != null) {
					return [null, err]
				}
				let __goscriptTuple9: any = fiat.P256Element.prototype.SetBytes.call(new fiat.P256Element(), $.goSlice(b, 1 + 32, undefined))
				let y: fiat.P256Element | $.VarRef<fiat.P256Element> | null = __goscriptTuple9[0]
				err = __goscriptTuple9[1]
				if (err != null) {
					return [null, err]
				}
				{
					let __goscriptShadow2 = await p256CheckOnCurve(x, y)
					if (__goscriptShadow2 != null) {
						return [null, __goscriptShadow2]
					}
				}
				$.pointerValue<P256Point>(p).x.Set(x)
				$.pointerValue<P256Point>(p).y.Set(y)
				$.pointerValue<P256Point>(p).z.One()
				return [p, null]
				break
			}
			case ($.len(b) == 33) && (($.uint($.arrayIndex(b!, 0), 8) == $.uint(2, 8)) || ($.uint($.arrayIndex(b!, 0), 8) == $.uint(3, 8))):
			{
				let __goscriptTuple10: any = fiat.P256Element.prototype.SetBytes.call(new fiat.P256Element(), $.goSlice(b, 1, undefined))
				let x: fiat.P256Element | $.VarRef<fiat.P256Element> | null = __goscriptTuple10[0]
				let err = __goscriptTuple10[1]
				if (err != null) {
					return [null, err]
				}

				// y² = x³ - 3x + b
				let y: fiat.P256Element | $.VarRef<fiat.P256Element> | null = await p256Polynomial(new fiat.P256Element(), x)
				if (!p256Sqrt(y, y)) {
					return [null, errors.New("invalid P256 compressed point encoding")]
				}

				// Select the positive or negative root, as indicated by the least
				// significant bit, based on the encoding type byte.
				let otherRoot: fiat.P256Element | $.VarRef<fiat.P256Element> | null = new fiat.P256Element()
				fiat.P256Element.prototype.Sub.call(otherRoot, otherRoot, y)
				let cond = $.uint(($.arrayIndex(fiat.P256Element.prototype.Bytes.call(y)!, 32 - 1) & 1) ^ ($.arrayIndex(b!, 0) & 1), 8)
				fiat.P256Element.prototype.Select.call(y, otherRoot, y, $.int(cond))

				$.pointerValue<P256Point>(p).x.Set(x)
				$.pointerValue<P256Point>(p).y.Set(y)
				$.pointerValue<P256Point>(p).z.One()
				return [p, null]
				break
			}
			default:
			{
				return [null, errors.New("invalid P256 point encoding")]
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public SetGenerator(): P256Point | $.VarRef<P256Point> | null {
		const p: P256Point | $.VarRef<P256Point> | null = this
		$.pointerValue<P256Point>(p).x.SetBytes(new Uint8Array([107, 23, 209, 242, 225, 44, 66, 71, 248, 188, 230, 229, 99, 164, 64, 242, 119, 3, 125, 129, 45, 235, 51, 160, 244, 161, 57, 69, 216, 152, 194, 150]) as $.Slice<number>)
		$.pointerValue<P256Point>(p).y.SetBytes(new Uint8Array([79, 227, 66, 226, 254, 26, 127, 155, 142, 231, 235, 74, 124, 15, 158, 22, 43, 206, 51, 87, 107, 49, 94, 206, 203, 182, 64, 104, 55, 191, 81, 245]) as $.Slice<number>)
		$.pointerValue<P256Point>(p).z.One()
		return p
	}

	public bytes(out: $.VarRef<Uint8Array> | null): $.Slice<number> {
		const p: P256Point | $.VarRef<P256Point> | null = this
		// The SEC 1 representation of the point at infinity is a single zero byte,
		// and only infinity has z = 0.
		if ($.pointerValue<P256Point>(p).z.IsZero() == 1) {
			return $.append($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), $.uint(0, 8), $.byteSliceHint)
		}

		let zinv: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Invert.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.z)
		let x: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.x, zinv)
		let y: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.y, zinv)

		let buf: $.Slice<number> = $.append($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), $.uint(4, 8), $.byteSliceHint)
		buf = $.appendSlice(buf, fiat.P256Element.prototype.Bytes.call(x), $.byteSliceHint)
		buf = $.appendSlice(buf, fiat.P256Element.prototype.Bytes.call(y), $.byteSliceHint)
		return buf
	}

	public bytesCompressed(out: $.VarRef<Uint8Array> | null): $.Slice<number> {
		const p: P256Point | $.VarRef<P256Point> | null = this
		if ($.pointerValue<P256Point>(p).z.IsZero() == 1) {
			return $.append($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), $.uint(0, 8), $.byteSliceHint)
		}

		let zinv: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Invert.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.z)
		let x: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.x, zinv)
		let y: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.y, zinv)

		// Encode the sign of the y coordinate (indicated by the least significant
		// bit) as the encoding type (2 or 3).
		let buf: $.Slice<number> = $.append($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), $.uint(2, 8), $.byteSliceHint)
		buf![0] = buf![0] | ($.uint($.arrayIndex(fiat.P256Element.prototype.Bytes.call(y)!, 32 - 1) & 1, 8))
		buf = $.appendSlice(buf, fiat.P256Element.prototype.Bytes.call(x), $.byteSliceHint)
		return buf
	}

	public bytesX(out: $.VarRef<Uint8Array> | null): [$.Slice<number>, $.GoError] {
		const p: P256Point | $.VarRef<P256Point> | null = this
		if ($.pointerValue<P256Point>(p).z.IsZero() == 1) {
			return [null, errors.New("P256 point is the point at infinity")]
		}

		let zinv: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Invert.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.z)
		let x: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Mul.call(new fiat.P256Element(), $.pointerValue<P256Point>(p)._fields.x, zinv)

		return [$.appendSlice($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), fiat.P256Element.prototype.Bytes.call(x), $.byteSliceHint), null]
	}

	static __typeInfo = $.registerStructType(
		"nistec.P256Point",
		() => new P256Point(),
		[{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }, { name: "p2", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }] }, { name: "AddAffine", args: [{ name: "p1", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }, { name: "p2", type: { kind: $.TypeKind.Pointer, elemType: "nistec.p256AffinePoint" } }, { name: "infinity", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesCompressed", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Double", args: [{ name: "p", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }] }, { name: "Negate", args: [{ name: "cond", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }] }, { name: "ScalarBaseMult", args: [{ name: "scalar", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "q", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }, { name: "scalar", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }, { name: "_r1", type: "error" }] }, { name: "Select", args: [{ name: "p1", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }, { name: "p2", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }, { name: "cond", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }] }, { name: "Set", args: [{ name: "q", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }] }, { name: "SetBytes", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }, { name: "_r1", type: "error" }] }, { name: "SetGenerator", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }] }, { name: "bytes", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 65 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "bytesCompressed", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 33 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "bytesX", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }],
		P256Point,
		[{ name: "x", key: "x", type: "fiat.P256Element", pkgPath: "crypto/internal/fips140/nistec", index: [0], offset: 0, exported: false }, { name: "y", key: "y", type: "fiat.P256Element", pkgPath: "crypto/internal/fips140/nistec", index: [1], offset: 32, exported: false }, { name: "z", key: "z", type: "fiat.P256Element", pkgPath: "crypto/internal/fips140/nistec", index: [2], offset: 64, exported: false }]
	)
}

export class p256AffinePoint {
	public get x(): fiat.P256Element {
		return this._fields.x.value
	}
	public set x(value: fiat.P256Element) {
		this._fields.x.value = value
	}

	public get y(): fiat.P256Element {
		return this._fields.y.value
	}
	public set y(value: fiat.P256Element) {
		this._fields.y.value = value
	}

	public _fields: {
		x: $.VarRef<fiat.P256Element>
		y: $.VarRef<fiat.P256Element>
	}

	constructor(init?: Partial<{x?: fiat.P256Element, y?: fiat.P256Element}>) {
		this._fields = {
			x: $.varRef(init?.x ? $.markAsStructValue($.cloneStructValue(init.x)) : $.markAsStructValue(new fiat.P256Element())),
			y: $.varRef(init?.y ? $.markAsStructValue($.cloneStructValue(init.y)) : $.markAsStructValue(new fiat.P256Element()))
		}
	}

	public clone(): p256AffinePoint {
		const cloned = new p256AffinePoint()
		cloned._fields = {
			x: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.x.value))),
			y: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.y.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Negate(cond: number): p256AffinePoint | $.VarRef<p256AffinePoint> | null {
		const p: p256AffinePoint | $.VarRef<p256AffinePoint> | null = this
		let negY: fiat.P256Element | $.VarRef<fiat.P256Element> | null = new fiat.P256Element()
		fiat.P256Element.prototype.Sub.call(negY, negY, $.pointerValue<p256AffinePoint>(p)._fields.y)
		$.pointerValue<p256AffinePoint>(p).y.Select(negY, $.pointerValue<p256AffinePoint>(p)._fields.y, cond)
		return p
	}

	public Projective(): P256Point | $.VarRef<P256Point> | null {
		const p: p256AffinePoint | $.VarRef<p256AffinePoint> | null = this
		let pp: P256Point | $.VarRef<P256Point> | null = new P256Point({x: $.markAsStructValue($.cloneStructValue($.pointerValue<p256AffinePoint>(p).x)), y: $.markAsStructValue($.cloneStructValue($.pointerValue<p256AffinePoint>(p).y))})
		$.pointerValue<P256Point>(pp).z.One()
		return pp
	}

	static __typeInfo = $.registerStructType(
		"nistec.p256AffinePoint",
		() => new p256AffinePoint(),
		[{ name: "Negate", args: [{ name: "cond", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.p256AffinePoint" } }] }, { name: "Projective", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" } }] }],
		p256AffinePoint,
		[{ name: "x", key: "x", type: "fiat.P256Element", pkgPath: "crypto/internal/fips140/nistec", index: [0], offset: 0, exported: false }, { name: "y", key: "y", type: "fiat.P256Element", pkgPath: "crypto/internal/fips140/nistec", index: [1], offset: 32, exported: false }]
	)
}

export const p256ElementLength: number = 32

export const p256UncompressedLength: number = 65

export const p256CompressedLength: number = 33

export function NewP256Point(): P256Point | $.VarRef<P256Point> | null {
	let p: P256Point | $.VarRef<P256Point> | null = new P256Point()
	$.pointerValue<P256Point>(p).y.One()
	return p
}

export let _p256B: fiat.P256Element | $.VarRef<fiat.P256Element> | null = null! as fiat.P256Element | $.VarRef<fiat.P256Element> | null

export function __goscript_set__p256B(__goscriptValue: fiat.P256Element | $.VarRef<fiat.P256Element> | null): void {
	_p256B = __goscriptValue
}

export let _p256BOnce: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set__p256BOnce(__goscriptValue: sync.Once): void {
	_p256BOnce.value = __goscriptValue
}

export async function p256B(): globalThis.Promise<fiat.P256Element | $.VarRef<fiat.P256Element> | null> {
	await _p256BOnce.value.Do($.functionValue((): void => {
		let __goscriptTuple11: any = fiat.P256Element.prototype.SetBytes.call(new fiat.P256Element(), new Uint8Array([90, 198, 53, 216, 170, 58, 147, 231, 179, 235, 189, 85, 118, 152, 134, 188, 101, 29, 6, 176, 204, 83, 176, 246, 59, 206, 60, 62, 39, 210, 96, 75]) as $.Slice<number>)
		_p256B = __goscriptTuple11[0]
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	return _p256B
}

export async function p256Polynomial(y2: fiat.P256Element | $.VarRef<fiat.P256Element> | null, x: fiat.P256Element | $.VarRef<fiat.P256Element> | null): globalThis.Promise<fiat.P256Element | $.VarRef<fiat.P256Element> | null> {
	fiat.P256Element.prototype.Square.call(y2, x)
	fiat.P256Element.prototype.Mul.call(y2, y2, x)

	let threeX: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Add.call(new fiat.P256Element(), x, x)
	fiat.P256Element.prototype.Add.call(threeX, threeX, x)
	fiat.P256Element.prototype.Sub.call(y2, y2, threeX)

	return fiat.P256Element.prototype.Add.call(y2, y2, await p256B())
}

export async function p256CheckOnCurve(x: fiat.P256Element | $.VarRef<fiat.P256Element> | null, y: fiat.P256Element | $.VarRef<fiat.P256Element> | null): globalThis.Promise<$.GoError> {
	// y² = x³ - 3x + b
	let rhs: fiat.P256Element | $.VarRef<fiat.P256Element> | null = await p256Polynomial(new fiat.P256Element(), x)
	let lhs: fiat.P256Element | $.VarRef<fiat.P256Element> | null = fiat.P256Element.prototype.Square.call(new fiat.P256Element(), y)
	if (fiat.P256Element.prototype.Equal.call(rhs, lhs) != 1) {
		return errors.New("P256 point not on curve")
	}
	return null
}

export function p256OrdElement_SetBytes(s: $.VarRef<p256OrdElement> | null, x: $.Slice<number>): [$.VarRef<p256OrdElement> | null, $.GoError] {
	if ($.len(x) != 32) {
		return [null, errors.New("invalid scalar length")]
	}

	$.pointerValue<bigint[]>(s)[0] = byteorder.BEUint64($.goSlice(x, 24, undefined))
	$.pointerValue<bigint[]>(s)[1] = byteorder.BEUint64($.goSlice(x, 16, undefined))
	$.pointerValue<bigint[]>(s)[2] = byteorder.BEUint64($.goSlice(x, 8, undefined))
	$.pointerValue<bigint[]>(s)[3] = byteorder.BEUint64($.goSlice(x, undefined, undefined))

	// Ensure s is in the range [0, ord(G)-1]. Since 2 * ord(G) > 2²⁵⁶, we can
	// just conditionally subtract ord(G), keeping the result if it doesn't
	// underflow.
	let [t0, b] = bits.Sub64($.arrayIndex($.pointerValue<bigint[]>(s), 0), 17562291160714782033n, 0n)
	let __goscriptTuple12: any = bits.Sub64($.arrayIndex($.pointerValue<bigint[]>(s), 1), 13611842547513532036n, b)
	let t1 = __goscriptTuple12[0]
	b = __goscriptTuple12[1]
	let __goscriptTuple13: any = bits.Sub64($.arrayIndex($.pointerValue<bigint[]>(s), 2), 18446744073709551615n, b)
	let t2 = __goscriptTuple13[0]
	b = __goscriptTuple13[1]
	let __goscriptTuple14: any = bits.Sub64($.arrayIndex($.pointerValue<bigint[]>(s), 3), 18446744069414584320n, b)
	let t3 = __goscriptTuple14[0]
	b = __goscriptTuple14[1]
	let tMask = $.uint64Sub(b, 1n)
	$.pointerValue<bigint[]>(s)[0] = $.uint64Xor($.pointerValue<bigint[]>(s)[0], $.uint64And(($.uint64Xor(t0, $.arrayIndex($.pointerValue<bigint[]>(s), 0))), tMask))
	$.pointerValue<bigint[]>(s)[1] = $.uint64Xor($.pointerValue<bigint[]>(s)[1], $.uint64And(($.uint64Xor(t1, $.arrayIndex($.pointerValue<bigint[]>(s), 1))), tMask))
	$.pointerValue<bigint[]>(s)[2] = $.uint64Xor($.pointerValue<bigint[]>(s)[2], $.uint64And(($.uint64Xor(t2, $.arrayIndex($.pointerValue<bigint[]>(s), 2))), tMask))
	$.pointerValue<bigint[]>(s)[3] = $.uint64Xor($.pointerValue<bigint[]>(s)[3], $.uint64And(($.uint64Xor(t3, $.arrayIndex($.pointerValue<bigint[]>(s), 3))), tMask))

	return [s, null]
}

export function p256OrdElement_Bytes(s: $.VarRef<p256OrdElement> | null): $.Slice<number> {
	let out: Uint8Array = new Uint8Array(32)
	byteorder.BEPutUint64($.goSlice(out, 24, undefined), $.arrayIndex($.pointerValue<bigint[]>(s), 0))
	byteorder.BEPutUint64($.goSlice(out, 16, undefined), $.arrayIndex($.pointerValue<bigint[]>(s), 1))
	byteorder.BEPutUint64($.goSlice(out, 8, undefined), $.arrayIndex($.pointerValue<bigint[]>(s), 2))
	byteorder.BEPutUint64($.goSlice(out, undefined, undefined), $.arrayIndex($.pointerValue<bigint[]>(s), 3))
	return $.goSlice(out, undefined, undefined)
}

export function p256OrdElement_Rsh(s: $.VarRef<p256OrdElement> | null, n: number): bigint {
	let i = Math.trunc(n / 64)
	n = n % 64
	let res = $.uint64Shr($.arrayIndex($.pointerValue<bigint[]>(s), i), n)
	// Shift in the more significant limb, if present.
	let __goscriptShadow3 = i
	{
		let __goscriptShadow4 = __goscriptShadow3 + 1
		if (__goscriptShadow4 < $.len($.pointerValue<bigint[]>(s))) {
			res = $.uint64Or(res, $.uint64Shl($.arrayIndex($.pointerValue<bigint[]>(s), __goscriptShadow4), (64 - n)))
		}
	}
	return res
}

export function p256Table_Select(table: $.VarRef<p256Table> | null, p: P256Point | $.VarRef<P256Point> | null, n: number): void {
	if ($.uint(n, 8) > $.uint(16, 8)) {
		$.panic("nistec: internal error: p256Table called with out-of-bounds value")
	}
	P256Point.prototype.Set.call(p, NewP256Point())
	for (let i = $.uint($.uint(1, 8), 8); $.uint(i, 8) <= $.uint(16, 8); i++) {
		let cond = constanttime.ByteEq($.uint(i, 8), $.uint(n, 8))
		P256Point.prototype.Select.call(p, $.indexRef($.pointerValue<P256Point[]>(table), i - 1), p, cond)
	}
}

export async function p256Table_Compute(table: $.VarRef<p256Table> | null, q: P256Point | $.VarRef<P256Point> | null): globalThis.Promise<$.VarRef<p256Table> | null> {
	$.arrayIndex($.pointerValue<P256Point[]>(table), 0).Set(q)
	for (let i = 1; i < 16; i = i + (2)) {
		await $.arrayIndex($.pointerValue<P256Point[]>(table), i).Double($.indexRef($.pointerValue<P256Point[]>(table), Math.trunc(i / 2)))
		if ((i + 1) < 16) {
			await $.arrayIndex($.pointerValue<P256Point[]>(table), i + 1).Add($.indexRef($.pointerValue<P256Point[]>(table), i), q)
		}
	}
	return table
}

export function boothW5(_in: bigint): [number, number] {
	let s = $.uint64Xor(($.uint64Sub(($.uint64Shr(_in, 5n)), 1n)), -1n)
	let d = $.uint64Sub(($.uint64Sub(64n, _in)), 1n)
	d = $.uint64Or(($.uint64And(d, s)), ($.uint64And(_in, ($.uint64Xor(s, -1n)))))
	d = $.uint64Add(($.uint64Shr(d, 1n)), ($.uint64And(d, 1n)))
	return [$.uint($.uint(d, 8), 8), $.int($.uint64And(s, 1n))]
}

export function p256AffineTable_Select(table: $.VarRef<p256AffineTable> | null, p: p256AffinePoint | $.VarRef<p256AffinePoint> | null, n: number): void {
	if ($.uint(n, 8) > $.uint(32, 8)) {
		$.panic("nistec: internal error: p256AffineTable.Select called with out-of-bounds value")
	}
	for (let i = $.uint($.uint(1, 8), 8); $.uint(i, 8) <= $.uint(32, 8); i++) {
		let cond = constanttime.ByteEq($.uint(i, 8), $.uint(n, 8))
		$.pointerValue<p256AffinePoint>(p).x.Select($.arrayIndex($.pointerValue<p256AffinePoint[]>(table), i - 1)._fields.x, $.pointerValue<p256AffinePoint>(p)._fields.x, cond)
		$.pointerValue<p256AffinePoint>(p).y.Select($.arrayIndex($.pointerValue<p256AffinePoint[]>(table), i - 1)._fields.y, $.pointerValue<p256AffinePoint>(p)._fields.y, cond)
	}
}

export let p256GeneratorTables: $.VarRef<p256AffineTable[]> | null = null! as $.VarRef<p256AffineTable[]> | null

export function __goscript_set_p256GeneratorTables(__goscriptValue: $.VarRef<p256AffineTable[]> | null): void {
	p256GeneratorTables = __goscriptValue
}

function __goscriptInit0(): void {
	let p256GeneratorTablesPtr = (__goscript_p256_table.__goscript_get_p256PrecomputedEmbed() as any)
	if (cpu.BigEndian) {
		let newTable: $.VarRef<bigint[]> = $.varRef(Array.from({ length: 11008 }, () => 0n))
		for (let __goscriptRangeTarget0 = $.pointerValue<Uint8Array[]>(p256GeneratorTablesPtr), i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			let x = __goscriptRangeTarget0![i]
			newTable.value[i] = byteorder.LEUint64($.goSlice(x, undefined, undefined))
		}
		p256GeneratorTablesPtr = (newTable as any)
	}
	p256GeneratorTables = p256GeneratorTablesPtr
}

export function boothW6(_in: bigint): [number, number] {
	let s = $.uint64Xor(($.uint64Sub(($.uint64Shr(_in, 6n)), 1n)), -1n)
	let d = $.uint64Sub(($.uint64Sub(128n, _in)), 1n)
	d = $.uint64Or(($.uint64And(d, s)), ($.uint64And(_in, ($.uint64Xor(s, -1n)))))
	d = $.uint64Add(($.uint64Shr(d, 1n)), ($.uint64And(d, 1n)))
	return [$.uint($.uint(d, 8), 8), $.int($.uint64And(s, 1n))]
}

export function p256Sqrt(e: fiat.P256Element | $.VarRef<fiat.P256Element> | null, x: fiat.P256Element | $.VarRef<fiat.P256Element> | null): boolean {
	let isSquare: boolean = false
	let t0: fiat.P256Element | $.VarRef<fiat.P256Element> | null = new fiat.P256Element()
	let t1: fiat.P256Element | $.VarRef<fiat.P256Element> | null = new fiat.P256Element()

	// Since p = 3 mod 4, exponentiation by (p + 1) / 4 yields a square root candidate.
	//
	// The sequence of 7 multiplications and 253 squarings is derived from the
	// following addition chain generated with github.com/mmcloughlin/addchain v0.4.0.
	//
	//	_10       = 2*1
	//	_11       = 1 + _10
	//	_1100     = _11 << 2
	//	_1111     = _11 + _1100
	//	_11110000 = _1111 << 4
	//	_11111111 = _1111 + _11110000
	//	x16       = _11111111 << 8 + _11111111
	//	x32       = x16 << 16 + x16
	//	return      ((x32 << 32 + 1) << 96 + 1) << 94
	//
	p256Square(t0, x, 1)
	fiat.P256Element.prototype.Mul.call(t0, x, t0)
	p256Square(t1, t0, 2)
	fiat.P256Element.prototype.Mul.call(t0, t0, t1)
	p256Square(t1, t0, 4)
	fiat.P256Element.prototype.Mul.call(t0, t0, t1)
	p256Square(t1, t0, 8)
	fiat.P256Element.prototype.Mul.call(t0, t0, t1)
	p256Square(t1, t0, 16)
	fiat.P256Element.prototype.Mul.call(t0, t0, t1)
	p256Square(t0, t0, 32)
	fiat.P256Element.prototype.Mul.call(t0, x, t0)
	p256Square(t0, t0, 96)
	fiat.P256Element.prototype.Mul.call(t0, x, t0)
	p256Square(t0, t0, 94)

	// Check if the candidate t0 is indeed a square root of x.
	fiat.P256Element.prototype.Square.call(t1, t0)
	if (fiat.P256Element.prototype.Equal.call(t1, x) != 1) {
		return false
	}
	fiat.P256Element.prototype.Set.call(e, t0)
	return true
}

export function p256Square(e: fiat.P256Element | $.VarRef<fiat.P256Element> | null, x: fiat.P256Element | $.VarRef<fiat.P256Element> | null, n: number): void {
	fiat.P256Element.prototype.Square.call(e, x)
	for (let i = 1; i < n; i++) {
		fiat.P256Element.prototype.Square.call(e, e)
	}
}

__goscriptInit0()

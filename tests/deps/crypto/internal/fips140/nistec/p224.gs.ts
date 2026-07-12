// Generated file based on p224.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as constanttime from "@goscript/crypto/internal/constanttime/index.js"

import * as fiat from "@goscript/crypto/internal/fips140/nistec/fiat/index.js"

import * as errors from "@goscript/errors/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_p224_sqrt from "./p224_sqrt.gs.ts"
import "@goscript/crypto/internal/constanttime/index.js"
import "@goscript/crypto/internal/fips140/nistec/fiat/index.js"
import "@goscript/errors/index.js"
import "@goscript/sync/index.js"
import "./p224_sqrt.gs.ts"

export type p224Table = (P224Point | $.VarRef<P224Point> | null)[]

export class P224Point {
	// The point is represented in projective coordinates (X:Y:Z),
	// where x = X/Z and y = Y/Z.
	public get x(): fiat.P224Element | $.VarRef<fiat.P224Element> | null {
		return this._fields.x.value
	}
	public set x(value: fiat.P224Element | $.VarRef<fiat.P224Element> | null) {
		this._fields.x.value = value
	}

	// The point is represented in projective coordinates (X:Y:Z),
	// where x = X/Z and y = Y/Z.
	public get y(): fiat.P224Element | $.VarRef<fiat.P224Element> | null {
		return this._fields.y.value
	}
	public set y(value: fiat.P224Element | $.VarRef<fiat.P224Element> | null) {
		this._fields.y.value = value
	}

	// The point is represented in projective coordinates (X:Y:Z),
	// where x = X/Z and y = Y/Z.
	public get z(): fiat.P224Element | $.VarRef<fiat.P224Element> | null {
		return this._fields.z.value
	}
	public set z(value: fiat.P224Element | $.VarRef<fiat.P224Element> | null) {
		this._fields.z.value = value
	}

	public _fields: {
		x: $.VarRef<fiat.P224Element | $.VarRef<fiat.P224Element> | null>
		y: $.VarRef<fiat.P224Element | $.VarRef<fiat.P224Element> | null>
		z: $.VarRef<fiat.P224Element | $.VarRef<fiat.P224Element> | null>
	}

	constructor(init?: Partial<{x?: fiat.P224Element | $.VarRef<fiat.P224Element> | null, y?: fiat.P224Element | $.VarRef<fiat.P224Element> | null, z?: fiat.P224Element | $.VarRef<fiat.P224Element> | null}>) {
		this._fields = {
			x: $.varRef(init?.x ?? (null as fiat.P224Element | $.VarRef<fiat.P224Element> | null)),
			y: $.varRef(init?.y ?? (null as fiat.P224Element | $.VarRef<fiat.P224Element> | null)),
			z: $.varRef(init?.z ?? (null as fiat.P224Element | $.VarRef<fiat.P224Element> | null))
		}
	}

	public clone(): P224Point {
		const cloned = new P224Point()
		cloned._fields = {
			x: $.varRef(this._fields.x.value),
			y: $.varRef(this._fields.y.value),
			z: $.varRef(this._fields.z.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Add(p1: P224Point | $.VarRef<P224Point> | null, p2: P224Point | $.VarRef<P224Point> | null): globalThis.Promise<P224Point | $.VarRef<P224Point> | null> {
		const q: P224Point | $.VarRef<P224Point> | null = this
		// Complete addition formula for a = -3 from "Complete addition formulas for
		// prime order elliptic curves" (https://eprint.iacr.org/2015/1060), §A.2.

		let t0: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Mul.call(new fiat.P224Element(), $.pointerValue<P224Point>(p1).x, $.pointerValue<P224Point>(p2).x)
		let t1: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Mul.call(new fiat.P224Element(), $.pointerValue<P224Point>(p1).y, $.pointerValue<P224Point>(p2).y)
		let t2: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Mul.call(new fiat.P224Element(), $.pointerValue<P224Point>(p1).z, $.pointerValue<P224Point>(p2).z)
		let t3: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Add.call(new fiat.P224Element(), $.pointerValue<P224Point>(p1).x, $.pointerValue<P224Point>(p1).y)
		let t4: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Add.call(new fiat.P224Element(), $.pointerValue<P224Point>(p2).x, $.pointerValue<P224Point>(p2).y)
		fiat.P224Element.prototype.Mul.call(t3, t3, t4)
		fiat.P224Element.prototype.Add.call(t4, t0, t1)
		fiat.P224Element.prototype.Sub.call(t3, t3, t4)
		fiat.P224Element.prototype.Add.call(t4, $.pointerValue<P224Point>(p1).y, $.pointerValue<P224Point>(p1).z)
		let x3: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Add.call(new fiat.P224Element(), $.pointerValue<P224Point>(p2).y, $.pointerValue<P224Point>(p2).z)
		fiat.P224Element.prototype.Mul.call(t4, t4, x3)
		fiat.P224Element.prototype.Add.call(x3, t1, t2)
		fiat.P224Element.prototype.Sub.call(t4, t4, x3)
		fiat.P224Element.prototype.Add.call(x3, $.pointerValue<P224Point>(p1).x, $.pointerValue<P224Point>(p1).z)
		let y3: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Add.call(new fiat.P224Element(), $.pointerValue<P224Point>(p2).x, $.pointerValue<P224Point>(p2).z)
		fiat.P224Element.prototype.Mul.call(x3, x3, y3)
		fiat.P224Element.prototype.Add.call(y3, t0, t2)
		fiat.P224Element.prototype.Sub.call(y3, x3, y3)
		let z3: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Mul.call(new fiat.P224Element(), await p224B(), t2)
		fiat.P224Element.prototype.Sub.call(x3, y3, z3)
		fiat.P224Element.prototype.Add.call(z3, x3, x3)
		fiat.P224Element.prototype.Add.call(x3, x3, z3)
		fiat.P224Element.prototype.Sub.call(z3, t1, x3)
		fiat.P224Element.prototype.Add.call(x3, t1, x3)
		fiat.P224Element.prototype.Mul.call(y3, await p224B(), y3)
		fiat.P224Element.prototype.Add.call(t1, t2, t2)
		fiat.P224Element.prototype.Add.call(t2, t1, t2)
		fiat.P224Element.prototype.Sub.call(y3, y3, t2)
		fiat.P224Element.prototype.Sub.call(y3, y3, t0)
		fiat.P224Element.prototype.Add.call(t1, y3, y3)
		fiat.P224Element.prototype.Add.call(y3, t1, y3)
		fiat.P224Element.prototype.Add.call(t1, t0, t0)
		fiat.P224Element.prototype.Add.call(t0, t1, t0)
		fiat.P224Element.prototype.Sub.call(t0, t0, t2)
		fiat.P224Element.prototype.Mul.call(t1, t4, y3)
		fiat.P224Element.prototype.Mul.call(t2, t0, y3)
		fiat.P224Element.prototype.Mul.call(y3, x3, z3)
		fiat.P224Element.prototype.Add.call(y3, y3, t2)
		fiat.P224Element.prototype.Mul.call(x3, t3, x3)
		fiat.P224Element.prototype.Sub.call(x3, x3, t1)
		fiat.P224Element.prototype.Mul.call(z3, t4, z3)
		fiat.P224Element.prototype.Mul.call(t1, t3, t0)
		fiat.P224Element.prototype.Add.call(z3, z3, t1)

		fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(q).x, x3)
		fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(q).y, y3)
		fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(q).z, z3)
		return q
	}

	public Bytes(): $.Slice<number> {
		const p: P224Point | $.VarRef<P224Point> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(57))
		return P224Point.prototype.bytes.call(p, out)
	}

	public BytesCompressed(): $.Slice<number> {
		const p: P224Point | $.VarRef<P224Point> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(29))
		return P224Point.prototype.bytesCompressed.call(p, out)
	}

	public BytesX(): [$.Slice<number>, $.GoError] {
		const p: P224Point | $.VarRef<P224Point> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(28))
		return P224Point.prototype.bytesX.call(p, out)
	}

	public async Double(p: P224Point | $.VarRef<P224Point> | null): globalThis.Promise<P224Point | $.VarRef<P224Point> | null> {
		const q: P224Point | $.VarRef<P224Point> | null = this
		// Complete addition formula for a = -3 from "Complete addition formulas for
		// prime order elliptic curves" (https://eprint.iacr.org/2015/1060), §A.2.

		let t0: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Square.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).x)
		let t1: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Square.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).y)
		let t2: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Square.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).z)
		let t3: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Mul.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).x, $.pointerValue<P224Point>(p).y)
		fiat.P224Element.prototype.Add.call(t3, t3, t3)
		let z3: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Mul.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).x, $.pointerValue<P224Point>(p).z)
		fiat.P224Element.prototype.Add.call(z3, z3, z3)
		let y3: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Mul.call(new fiat.P224Element(), await p224B(), t2)
		fiat.P224Element.prototype.Sub.call(y3, y3, z3)
		let x3: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Add.call(new fiat.P224Element(), y3, y3)
		fiat.P224Element.prototype.Add.call(y3, x3, y3)
		fiat.P224Element.prototype.Sub.call(x3, t1, y3)
		fiat.P224Element.prototype.Add.call(y3, t1, y3)
		fiat.P224Element.prototype.Mul.call(y3, x3, y3)
		fiat.P224Element.prototype.Mul.call(x3, x3, t3)
		fiat.P224Element.prototype.Add.call(t3, t2, t2)
		fiat.P224Element.prototype.Add.call(t2, t2, t3)
		fiat.P224Element.prototype.Mul.call(z3, await p224B(), z3)
		fiat.P224Element.prototype.Sub.call(z3, z3, t2)
		fiat.P224Element.prototype.Sub.call(z3, z3, t0)
		fiat.P224Element.prototype.Add.call(t3, z3, z3)
		fiat.P224Element.prototype.Add.call(z3, z3, t3)
		fiat.P224Element.prototype.Add.call(t3, t0, t0)
		fiat.P224Element.prototype.Add.call(t0, t3, t0)
		fiat.P224Element.prototype.Sub.call(t0, t0, t2)
		fiat.P224Element.prototype.Mul.call(t0, t0, z3)
		fiat.P224Element.prototype.Add.call(y3, y3, t0)
		fiat.P224Element.prototype.Mul.call(t0, $.pointerValue<P224Point>(p).y, $.pointerValue<P224Point>(p).z)
		fiat.P224Element.prototype.Add.call(t0, t0, t0)
		fiat.P224Element.prototype.Mul.call(z3, t0, z3)
		fiat.P224Element.prototype.Sub.call(x3, x3, z3)
		fiat.P224Element.prototype.Mul.call(z3, t0, t1)
		fiat.P224Element.prototype.Add.call(z3, z3, z3)
		fiat.P224Element.prototype.Add.call(z3, z3, z3)

		fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(q).x, x3)
		fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(q).y, y3)
		fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(q).z, z3)
		return q
	}

	public async ScalarBaseMult(scalar: $.Slice<number>): globalThis.Promise<[P224Point | $.VarRef<P224Point> | null, $.GoError]> {
		const p: P224Point | $.VarRef<P224Point> | null = this
		if ($.len(scalar) != 28) {
			return [null, errors.New("invalid scalar length")]
		}
		let tables: $.VarRef<p224Table[]> | null = await P224Point.prototype.generatorTable.call(p)

		// This is also a scalar multiplication with a four-bit window like in
		// ScalarMult, but in this case the doublings are precomputed. The value
		// [windowValue]G added at iteration k would normally get doubled
		// (totIterations-k)×4 times, but with a larger precomputation we can
		// instead add [2^((totIterations-k)×4)][windowValue]G and avoid the
		// doublings between iterations.
		let t: P224Point | $.VarRef<P224Point> | null = NewP224Point()
		P224Point.prototype.Set.call(p, NewP224Point())
		let tableIndex = $.len($.pointerValue<p224Table[]>(tables)) - 1
		for (let __goscriptRangeTarget0 = scalar, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let byte = __goscriptRangeTarget0![__rangeIndex]
			let windowValue = $.uint($.uintShr(byte, 4, 8), 8)
			p224Table_Select($.indexRef($.pointerValue<p224Table[]>(tables), tableIndex), t, $.uint(windowValue, 8))
			await P224Point.prototype.Add.call(p, p, t)
			tableIndex--

			windowValue = $.uint(byte & 0b1111, 8)
			p224Table_Select($.indexRef($.pointerValue<p224Table[]>(tables), tableIndex), t, $.uint(windowValue, 8))
			await P224Point.prototype.Add.call(p, p, t)
			tableIndex--
		}

		return [p, null]
	}

	public async ScalarMult(q: P224Point | $.VarRef<P224Point> | null, scalar: $.Slice<number>): globalThis.Promise<[P224Point | $.VarRef<P224Point> | null, $.GoError]> {
		const p: P224Point | $.VarRef<P224Point> | null = this
		// Compute a p224Table for the base point q. The explicit NewP224Point
		// calls get inlined, letting the allocations live on the stack.
		let table: $.VarRef<p224Table> = $.varRef([NewP224Point(), NewP224Point(), NewP224Point(), NewP224Point(), NewP224Point(), NewP224Point(), NewP224Point(), NewP224Point(), NewP224Point(), NewP224Point(), NewP224Point(), NewP224Point(), NewP224Point(), NewP224Point(), NewP224Point()])
		P224Point.prototype.Set.call($.arrayIndex(table.value, 0), q)
		for (let i = 1; i < 15; i = i + (2)) {
			await P224Point.prototype.Double.call($.arrayIndex(table.value, i), $.arrayIndex(table.value, Math.trunc(i / 2)))
			await P224Point.prototype.Add.call($.arrayIndex(table.value, i + 1), $.arrayIndex(table.value, i), q)
		}

		// Instead of doing the classic double-and-add chain, we do it with a
		// four-bit window: we double four times, and then add [0-15]P.
		let t: P224Point | $.VarRef<P224Point> | null = NewP224Point()
		P224Point.prototype.Set.call(p, NewP224Point())
		for (let __goscriptRangeTarget1 = scalar, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
			let byte = __goscriptRangeTarget1![i]
			// No need to double on the first iteration, as p is the identity at
			// this point, and [N]∞ = ∞.
			if (i != 0) {
				await P224Point.prototype.Double.call(p, p)
				await P224Point.prototype.Double.call(p, p)
				await P224Point.prototype.Double.call(p, p)
				await P224Point.prototype.Double.call(p, p)
			}

			let windowValue = $.uint($.uintShr(byte, 4, 8), 8)
			p224Table_Select(table, t, $.uint(windowValue, 8))
			await P224Point.prototype.Add.call(p, p, t)

			await P224Point.prototype.Double.call(p, p)
			await P224Point.prototype.Double.call(p, p)
			await P224Point.prototype.Double.call(p, p)
			await P224Point.prototype.Double.call(p, p)

			windowValue = $.uint(byte & 0b1111, 8)
			p224Table_Select(table, t, $.uint(windowValue, 8))
			await P224Point.prototype.Add.call(p, p, t)
		}

		return [p, null]
	}

	public Select(p1: P224Point | $.VarRef<P224Point> | null, p2: P224Point | $.VarRef<P224Point> | null, cond: number): P224Point | $.VarRef<P224Point> | null {
		const q: P224Point | $.VarRef<P224Point> | null = this
		fiat.P224Element.prototype.Select.call($.pointerValue<P224Point>(q).x, $.pointerValue<P224Point>(p1).x, $.pointerValue<P224Point>(p2).x, cond)
		fiat.P224Element.prototype.Select.call($.pointerValue<P224Point>(q).y, $.pointerValue<P224Point>(p1).y, $.pointerValue<P224Point>(p2).y, cond)
		fiat.P224Element.prototype.Select.call($.pointerValue<P224Point>(q).z, $.pointerValue<P224Point>(p1).z, $.pointerValue<P224Point>(p2).z, cond)
		return q
	}

	public Set(q: P224Point | $.VarRef<P224Point> | null): P224Point | $.VarRef<P224Point> | null {
		const p: P224Point | $.VarRef<P224Point> | null = this
		fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(p).x, $.pointerValue<P224Point>(q).x)
		fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(p).y, $.pointerValue<P224Point>(q).y)
		fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(p).z, $.pointerValue<P224Point>(q).z)
		return p
	}

	public async SetBytes(b: $.Slice<number>): globalThis.Promise<[P224Point | $.VarRef<P224Point> | null, $.GoError]> {
		const p: P224Point | $.VarRef<P224Point> | null = this
		switch (true) {
			case ($.len(b) == 1) && ($.uint($.arrayIndex(b!, 0), 8) == $.uint(0, 8)):
			{
				return [P224Point.prototype.Set.call(p, NewP224Point()), null]
				break
			}
			case ($.len(b) == (1 + (2 * 28))) && ($.uint($.arrayIndex(b!, 0), 8) == $.uint(4, 8)):
			{
				let __goscriptTuple0: any = fiat.P224Element.prototype.SetBytes.call(new fiat.P224Element(), $.goSlice(b, 1, 1 + 28))
				let x: fiat.P224Element | $.VarRef<fiat.P224Element> | null = __goscriptTuple0[0]
				let err = __goscriptTuple0[1]
				if (err != null) {
					return [null, err]
				}
				let __goscriptTuple1: any = fiat.P224Element.prototype.SetBytes.call(new fiat.P224Element(), $.goSlice(b, 1 + 28, undefined))
				let y: fiat.P224Element | $.VarRef<fiat.P224Element> | null = __goscriptTuple1[0]
				err = __goscriptTuple1[1]
				if (err != null) {
					return [null, err]
				}
				{
					let __goscriptShadow0 = await p224CheckOnCurve(x, y)
					if (__goscriptShadow0 != null) {
						return [null, __goscriptShadow0]
					}
				}
				fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(p).x, x)
				fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(p).y, y)
				fiat.P224Element.prototype.One.call($.pointerValue<P224Point>(p).z)
				return [p, null]
				break
			}
			case ($.len(b) == (1 + 28)) && (($.uint($.arrayIndex(b!, 0), 8) == $.uint(2, 8)) || ($.uint($.arrayIndex(b!, 0), 8) == $.uint(3, 8))):
			{
				let __goscriptTuple2: any = fiat.P224Element.prototype.SetBytes.call(new fiat.P224Element(), $.goSlice(b, 1, undefined))
				let x: fiat.P224Element | $.VarRef<fiat.P224Element> | null = __goscriptTuple2[0]
				let err = __goscriptTuple2[1]
				if (err != null) {
					return [null, err]
				}

				// y² = x³ - 3x + b
				let y: fiat.P224Element | $.VarRef<fiat.P224Element> | null = await p224Polynomial(new fiat.P224Element(), x)
				if (!await p224Sqrt(y, y)) {
					return [null, errors.New("invalid P224 compressed point encoding")]
				}

				// Select the positive or negative root, as indicated by the least
				// significant bit, based on the encoding type byte.
				let otherRoot: fiat.P224Element | $.VarRef<fiat.P224Element> | null = new fiat.P224Element()
				fiat.P224Element.prototype.Sub.call(otherRoot, otherRoot, y)
				let cond = $.uint(($.arrayIndex(fiat.P224Element.prototype.Bytes.call(y)!, 28 - 1) & 1) ^ ($.arrayIndex(b!, 0) & 1), 8)
				fiat.P224Element.prototype.Select.call(y, otherRoot, y, $.int(cond))

				fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(p).x, x)
				fiat.P224Element.prototype.Set.call($.pointerValue<P224Point>(p).y, y)
				fiat.P224Element.prototype.One.call($.pointerValue<P224Point>(p).z)
				return [p, null]
				break
			}
			default:
			{
				return [null, errors.New("invalid P224 point encoding")]
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public SetGenerator(): P224Point | $.VarRef<P224Point> | null {
		const p: P224Point | $.VarRef<P224Point> | null = this
		fiat.P224Element.prototype.SetBytes.call($.pointerValue<P224Point>(p).x, new Uint8Array([183, 14, 12, 189, 107, 180, 191, 127, 50, 19, 144, 185, 74, 3, 193, 211, 86, 194, 17, 34, 52, 50, 128, 214, 17, 92, 29, 33]) as $.Slice<number>)
		fiat.P224Element.prototype.SetBytes.call($.pointerValue<P224Point>(p).y, new Uint8Array([189, 55, 99, 136, 181, 247, 35, 251, 76, 34, 223, 230, 205, 67, 117, 160, 90, 7, 71, 100, 68, 213, 129, 153, 133, 0, 126, 52]) as $.Slice<number>)
		fiat.P224Element.prototype.One.call($.pointerValue<P224Point>(p).z)
		return p
	}

	public bytes(out: $.VarRef<Uint8Array> | null): $.Slice<number> {
		const p: P224Point | $.VarRef<P224Point> | null = this
		if (fiat.P224Element.prototype.IsZero.call($.pointerValue<P224Point>(p).z) == 1) {
			return $.append($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), $.uint(0, 8), $.byteSliceHint)
		}

		let zinv: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Invert.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).z)
		let x: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Mul.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).x, zinv)
		let y: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Mul.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).y, zinv)

		let buf: $.Slice<number> = $.append($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), $.uint(4, 8), $.byteSliceHint)
		buf = $.appendSlice(buf, fiat.P224Element.prototype.Bytes.call(x), $.byteSliceHint)
		buf = $.appendSlice(buf, fiat.P224Element.prototype.Bytes.call(y), $.byteSliceHint)
		return buf
	}

	public bytesCompressed(out: $.VarRef<Uint8Array> | null): $.Slice<number> {
		const p: P224Point | $.VarRef<P224Point> | null = this
		if (fiat.P224Element.prototype.IsZero.call($.pointerValue<P224Point>(p).z) == 1) {
			return $.append($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), $.uint(0, 8), $.byteSliceHint)
		}

		let zinv: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Invert.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).z)
		let x: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Mul.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).x, zinv)
		let y: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Mul.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).y, zinv)

		// Encode the sign of the y coordinate (indicated by the least significant
		// bit) as the encoding type (2 or 3).
		let buf: $.Slice<number> = $.append($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), $.uint(2, 8), $.byteSliceHint)
		buf![0] = buf![0] | ($.uint($.arrayIndex(fiat.P224Element.prototype.Bytes.call(y)!, 28 - 1) & 1, 8))
		buf = $.appendSlice(buf, fiat.P224Element.prototype.Bytes.call(x), $.byteSliceHint)
		return buf
	}

	public bytesX(out: $.VarRef<Uint8Array> | null): [$.Slice<number>, $.GoError] {
		const p: P224Point | $.VarRef<P224Point> | null = this
		if (fiat.P224Element.prototype.IsZero.call($.pointerValue<P224Point>(p).z) == 1) {
			return [null, errors.New("P224 point is the point at infinity")]
		}

		let zinv: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Invert.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).z)
		let x: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Mul.call(new fiat.P224Element(), $.pointerValue<P224Point>(p).x, zinv)

		return [$.appendSlice($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), fiat.P224Element.prototype.Bytes.call(x), $.byteSliceHint), null]
	}

	public async generatorTable(): globalThis.Promise<$.VarRef<p224Table[]> | null> {
		const p: P224Point | $.VarRef<P224Point> | null = this
		await p224GeneratorTableOnce.value.Do($.functionValue(async (): globalThis.Promise<void> => {
			p224GeneratorTable = $.varRef<p224Table[]>(Array.from({ length: 56 }, () => Array.from({ length: 15 }, () => null)))
			let base: P224Point | $.VarRef<P224Point> | null = P224Point.prototype.SetGenerator.call(NewP224Point())
			for (let i = 0; i < (28 * 2); i++) {
				$.arrayIndex($.pointerValue<p224Table[]>(p224GeneratorTable), i)[0] = P224Point.prototype.Set.call(NewP224Point(), base)
				for (let j = 1; j < 15; j++) {
					$.arrayIndex($.pointerValue<p224Table[]>(p224GeneratorTable), i)[j] = await P224Point.prototype.Add.call(NewP224Point(), $.arrayIndex($.arrayIndex($.pointerValue<p224Table[]>(p224GeneratorTable), i), j - 1), base)
				}
				await P224Point.prototype.Double.call(base, base)
				await P224Point.prototype.Double.call(base, base)
				await P224Point.prototype.Double.call(base, base)
				await P224Point.prototype.Double.call(base, base)
			}
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		return p224GeneratorTable
	}

	static __typeInfo = $.registerStructType(
		"nistec.P224Point",
		() => new P224Point(),
		[{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }, { name: "p2", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesCompressed", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Double", args: [{ name: "p", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }] }, { name: "ScalarBaseMult", args: [{ name: "scalar", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "q", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }, { name: "scalar", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }, { name: "_r1", type: "error" }] }, { name: "Select", args: [{ name: "p1", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }, { name: "p2", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }, { name: "cond", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }] }, { name: "Set", args: [{ name: "q", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }] }, { name: "SetBytes", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }, { name: "_r1", type: "error" }] }, { name: "SetGenerator", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" } }] }, { name: "bytes", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 57 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "bytesCompressed", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 29 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "bytesX", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 28 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "generatorTable", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: "nistec.p224Table", length: 56 } } }] }],
		P224Point,
		[{ name: "x", key: "x", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" }, pkgPath: "crypto/internal/fips140/nistec", index: [0], offset: 0, exported: false }, { name: "y", key: "y", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" }, pkgPath: "crypto/internal/fips140/nistec", index: [1], offset: 8, exported: false }, { name: "z", key: "z", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P224Element" }, pkgPath: "crypto/internal/fips140/nistec", index: [2], offset: 16, exported: false }]
	)
}

export const p224ElementLength: number = 28

export function NewP224Point(): P224Point | $.VarRef<P224Point> | null {
	return (() => { const __goscriptLiteralField0 = fiat.P224Element.prototype.One.call(new fiat.P224Element()); return new P224Point({x: new fiat.P224Element(), y: __goscriptLiteralField0, z: new fiat.P224Element()}) })()
}

export let _p224B: fiat.P224Element | $.VarRef<fiat.P224Element> | null = null as fiat.P224Element | $.VarRef<fiat.P224Element> | null

export function __goscript_set__p224B(__goscriptValue: fiat.P224Element | $.VarRef<fiat.P224Element> | null): void {
	_p224B = __goscriptValue
}

export let _p224BOnce: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set__p224BOnce(__goscriptValue: sync.Once): void {
	_p224BOnce.value = __goscriptValue
}

export async function p224B(): globalThis.Promise<fiat.P224Element | $.VarRef<fiat.P224Element> | null> {
	await _p224BOnce.value.Do($.functionValue((): void => {
		let __goscriptTuple3: any = fiat.P224Element.prototype.SetBytes.call(new fiat.P224Element(), new Uint8Array([180, 5, 10, 133, 12, 4, 179, 171, 245, 65, 50, 86, 80, 68, 176, 183, 215, 191, 216, 186, 39, 11, 57, 67, 35, 85, 255, 180]) as $.Slice<number>)
		_p224B = __goscriptTuple3[0]
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	return _p224B
}

export async function p224Polynomial(y2: fiat.P224Element | $.VarRef<fiat.P224Element> | null, x: fiat.P224Element | $.VarRef<fiat.P224Element> | null): globalThis.Promise<fiat.P224Element | $.VarRef<fiat.P224Element> | null> {
	fiat.P224Element.prototype.Square.call(y2, x)
	fiat.P224Element.prototype.Mul.call(y2, y2, x)

	let threeX: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Add.call(new fiat.P224Element(), x, x)
	fiat.P224Element.prototype.Add.call(threeX, threeX, x)
	fiat.P224Element.prototype.Sub.call(y2, y2, threeX)

	return fiat.P224Element.prototype.Add.call(y2, y2, await p224B())
}

export async function p224CheckOnCurve(x: fiat.P224Element | $.VarRef<fiat.P224Element> | null, y: fiat.P224Element | $.VarRef<fiat.P224Element> | null): globalThis.Promise<$.GoError> {
	// y² = x³ - 3x + b
	let rhs: fiat.P224Element | $.VarRef<fiat.P224Element> | null = await p224Polynomial(new fiat.P224Element(), x)
	let lhs: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Square.call(new fiat.P224Element(), y)
	if (fiat.P224Element.prototype.Equal.call(rhs, lhs) != 1) {
		return errors.New("P224 point not on curve")
	}
	return null
}

export function p224Table_Select(table: $.VarRef<p224Table> | null, p: P224Point | $.VarRef<P224Point> | null, n: number): void {
	if ($.uint(n, 8) >= $.uint(16, 8)) {
		$.panic("nistec: internal error: p224Table called with out-of-bounds value")
	}
	P224Point.prototype.Set.call(p, NewP224Point())
	for (let i = $.uint($.uint(1, 8), 8); $.uint(i, 8) < $.uint(16, 8); i++) {
		let cond = constanttime.ByteEq($.uint(i, 8), $.uint(n, 8))
		P224Point.prototype.Select.call(p, $.arrayIndex($.pointerValue<(P224Point | $.VarRef<P224Point> | null)[]>(table), i - 1), p, cond)
	}
}

export let p224GeneratorTable: $.VarRef<p224Table[]> | null = null as $.VarRef<p224Table[]> | null

export function __goscript_set_p224GeneratorTable(__goscriptValue: $.VarRef<p224Table[]> | null): void {
	p224GeneratorTable = __goscriptValue
}

export let p224GeneratorTableOnce: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set_p224GeneratorTableOnce(__goscriptValue: sync.Once): void {
	p224GeneratorTableOnce.value = __goscriptValue
}

export async function p224Sqrt(e: fiat.P224Element | $.VarRef<fiat.P224Element> | null, x: fiat.P224Element | $.VarRef<fiat.P224Element> | null): globalThis.Promise<boolean> {
	let isSquare: boolean = false
	let candidate: fiat.P224Element | $.VarRef<fiat.P224Element> | null = new fiat.P224Element()
	await __goscript_p224_sqrt.p224SqrtCandidate(candidate, x)
	let square: fiat.P224Element | $.VarRef<fiat.P224Element> | null = fiat.P224Element.prototype.Square.call(new fiat.P224Element(), candidate)
	if (fiat.P224Element.prototype.Equal.call(square, x) != 1) {
		return false
	}
	fiat.P224Element.prototype.Set.call(e, candidate)
	return true
}

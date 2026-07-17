// Generated file based on p521.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as constanttime from "@goscript/crypto/internal/constanttime/index.js"

import * as fiat from "@goscript/crypto/internal/fips140/nistec/fiat/index.js"

import * as errors from "@goscript/errors/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/crypto/internal/constanttime/index.js"
import "@goscript/crypto/internal/fips140/nistec/fiat/index.js"
import "@goscript/errors/index.js"
import "@goscript/sync/index.js"

export type p521Table = (P521Point | $.VarRef<P521Point> | null)[]

export class P521Point {
	// The point is represented in projective coordinates (X:Y:Z),
	// where x = X/Z and y = Y/Z.
	public get x(): fiat.P521Element | $.VarRef<fiat.P521Element> | null {
		return this._fields.x.value
	}
	public set x(value: fiat.P521Element | $.VarRef<fiat.P521Element> | null) {
		this._fields.x.value = value
	}

	// The point is represented in projective coordinates (X:Y:Z),
	// where x = X/Z and y = Y/Z.
	public get y(): fiat.P521Element | $.VarRef<fiat.P521Element> | null {
		return this._fields.y.value
	}
	public set y(value: fiat.P521Element | $.VarRef<fiat.P521Element> | null) {
		this._fields.y.value = value
	}

	// The point is represented in projective coordinates (X:Y:Z),
	// where x = X/Z and y = Y/Z.
	public get z(): fiat.P521Element | $.VarRef<fiat.P521Element> | null {
		return this._fields.z.value
	}
	public set z(value: fiat.P521Element | $.VarRef<fiat.P521Element> | null) {
		this._fields.z.value = value
	}

	public _fields: {
		x: $.VarRef<fiat.P521Element | $.VarRef<fiat.P521Element> | null>
		y: $.VarRef<fiat.P521Element | $.VarRef<fiat.P521Element> | null>
		z: $.VarRef<fiat.P521Element | $.VarRef<fiat.P521Element> | null>
	}

	constructor(init?: Partial<{x?: fiat.P521Element | $.VarRef<fiat.P521Element> | null, y?: fiat.P521Element | $.VarRef<fiat.P521Element> | null, z?: fiat.P521Element | $.VarRef<fiat.P521Element> | null}>) {
		this._fields = {
			x: $.varRef(init?.x ?? (null! as fiat.P521Element | $.VarRef<fiat.P521Element> | null)),
			y: $.varRef(init?.y ?? (null! as fiat.P521Element | $.VarRef<fiat.P521Element> | null)),
			z: $.varRef(init?.z ?? (null! as fiat.P521Element | $.VarRef<fiat.P521Element> | null))
		}
	}

	public clone(): P521Point {
		const cloned = new P521Point()
		cloned._fields = {
			x: $.varRef(this._fields.x.value),
			y: $.varRef(this._fields.y.value),
			z: $.varRef(this._fields.z.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Add(p1: P521Point | $.VarRef<P521Point> | null, p2: P521Point | $.VarRef<P521Point> | null): globalThis.Promise<P521Point | $.VarRef<P521Point> | null> {
		const q: P521Point | $.VarRef<P521Point> | null = this
		// Complete addition formula for a = -3 from "Complete addition formulas for
		// prime order elliptic curves" (https://eprint.iacr.org/2015/1060), §A.2.

		let t0: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Mul.call(new fiat.P521Element(), $.pointerValue<P521Point>(p1).x, $.pointerValue<P521Point>(p2).x)
		let t1: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Mul.call(new fiat.P521Element(), $.pointerValue<P521Point>(p1).y, $.pointerValue<P521Point>(p2).y)
		let t2: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Mul.call(new fiat.P521Element(), $.pointerValue<P521Point>(p1).z, $.pointerValue<P521Point>(p2).z)
		let t3: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Add.call(new fiat.P521Element(), $.pointerValue<P521Point>(p1).x, $.pointerValue<P521Point>(p1).y)
		let t4: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Add.call(new fiat.P521Element(), $.pointerValue<P521Point>(p2).x, $.pointerValue<P521Point>(p2).y)
		fiat.P521Element.prototype.Mul.call(t3, t3, t4)
		fiat.P521Element.prototype.Add.call(t4, t0, t1)
		fiat.P521Element.prototype.Sub.call(t3, t3, t4)
		fiat.P521Element.prototype.Add.call(t4, $.pointerValue<P521Point>(p1).y, $.pointerValue<P521Point>(p1).z)
		let x3: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Add.call(new fiat.P521Element(), $.pointerValue<P521Point>(p2).y, $.pointerValue<P521Point>(p2).z)
		fiat.P521Element.prototype.Mul.call(t4, t4, x3)
		fiat.P521Element.prototype.Add.call(x3, t1, t2)
		fiat.P521Element.prototype.Sub.call(t4, t4, x3)
		fiat.P521Element.prototype.Add.call(x3, $.pointerValue<P521Point>(p1).x, $.pointerValue<P521Point>(p1).z)
		let y3: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Add.call(new fiat.P521Element(), $.pointerValue<P521Point>(p2).x, $.pointerValue<P521Point>(p2).z)
		fiat.P521Element.prototype.Mul.call(x3, x3, y3)
		fiat.P521Element.prototype.Add.call(y3, t0, t2)
		fiat.P521Element.prototype.Sub.call(y3, x3, y3)
		let z3: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Mul.call(new fiat.P521Element(), await p521B(), t2)
		fiat.P521Element.prototype.Sub.call(x3, y3, z3)
		fiat.P521Element.prototype.Add.call(z3, x3, x3)
		fiat.P521Element.prototype.Add.call(x3, x3, z3)
		fiat.P521Element.prototype.Sub.call(z3, t1, x3)
		fiat.P521Element.prototype.Add.call(x3, t1, x3)
		fiat.P521Element.prototype.Mul.call(y3, await p521B(), y3)
		fiat.P521Element.prototype.Add.call(t1, t2, t2)
		fiat.P521Element.prototype.Add.call(t2, t1, t2)
		fiat.P521Element.prototype.Sub.call(y3, y3, t2)
		fiat.P521Element.prototype.Sub.call(y3, y3, t0)
		fiat.P521Element.prototype.Add.call(t1, y3, y3)
		fiat.P521Element.prototype.Add.call(y3, t1, y3)
		fiat.P521Element.prototype.Add.call(t1, t0, t0)
		fiat.P521Element.prototype.Add.call(t0, t1, t0)
		fiat.P521Element.prototype.Sub.call(t0, t0, t2)
		fiat.P521Element.prototype.Mul.call(t1, t4, y3)
		fiat.P521Element.prototype.Mul.call(t2, t0, y3)
		fiat.P521Element.prototype.Mul.call(y3, x3, z3)
		fiat.P521Element.prototype.Add.call(y3, y3, t2)
		fiat.P521Element.prototype.Mul.call(x3, t3, x3)
		fiat.P521Element.prototype.Sub.call(x3, x3, t1)
		fiat.P521Element.prototype.Mul.call(z3, t4, z3)
		fiat.P521Element.prototype.Mul.call(t1, t3, t0)
		fiat.P521Element.prototype.Add.call(z3, z3, t1)

		fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(q).x, x3)
		fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(q).y, y3)
		fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(q).z, z3)
		return q
	}

	public Bytes(): $.Slice<number> {
		const p: P521Point | $.VarRef<P521Point> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(133))
		return P521Point.prototype.bytes.call(p, out)
	}

	public BytesCompressed(): $.Slice<number> {
		const p: P521Point | $.VarRef<P521Point> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(67))
		return P521Point.prototype.bytesCompressed.call(p, out)
	}

	public BytesX(): [$.Slice<number>, $.GoError] {
		const p: P521Point | $.VarRef<P521Point> | null = this
		// This function is outlined to make the allocations inline in the caller
		// rather than happen on the heap.
		let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(66))
		return P521Point.prototype.bytesX.call(p, out)
	}

	public async Double(p: P521Point | $.VarRef<P521Point> | null): globalThis.Promise<P521Point | $.VarRef<P521Point> | null> {
		const q: P521Point | $.VarRef<P521Point> | null = this
		// Complete addition formula for a = -3 from "Complete addition formulas for
		// prime order elliptic curves" (https://eprint.iacr.org/2015/1060), §A.2.

		let t0: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Square.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).x)
		let t1: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Square.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).y)
		let t2: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Square.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).z)
		let t3: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Mul.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).x, $.pointerValue<P521Point>(p).y)
		fiat.P521Element.prototype.Add.call(t3, t3, t3)
		let z3: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Mul.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).x, $.pointerValue<P521Point>(p).z)
		fiat.P521Element.prototype.Add.call(z3, z3, z3)
		let y3: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Mul.call(new fiat.P521Element(), await p521B(), t2)
		fiat.P521Element.prototype.Sub.call(y3, y3, z3)
		let x3: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Add.call(new fiat.P521Element(), y3, y3)
		fiat.P521Element.prototype.Add.call(y3, x3, y3)
		fiat.P521Element.prototype.Sub.call(x3, t1, y3)
		fiat.P521Element.prototype.Add.call(y3, t1, y3)
		fiat.P521Element.prototype.Mul.call(y3, x3, y3)
		fiat.P521Element.prototype.Mul.call(x3, x3, t3)
		fiat.P521Element.prototype.Add.call(t3, t2, t2)
		fiat.P521Element.prototype.Add.call(t2, t2, t3)
		fiat.P521Element.prototype.Mul.call(z3, await p521B(), z3)
		fiat.P521Element.prototype.Sub.call(z3, z3, t2)
		fiat.P521Element.prototype.Sub.call(z3, z3, t0)
		fiat.P521Element.prototype.Add.call(t3, z3, z3)
		fiat.P521Element.prototype.Add.call(z3, z3, t3)
		fiat.P521Element.prototype.Add.call(t3, t0, t0)
		fiat.P521Element.prototype.Add.call(t0, t3, t0)
		fiat.P521Element.prototype.Sub.call(t0, t0, t2)
		fiat.P521Element.prototype.Mul.call(t0, t0, z3)
		fiat.P521Element.prototype.Add.call(y3, y3, t0)
		fiat.P521Element.prototype.Mul.call(t0, $.pointerValue<P521Point>(p).y, $.pointerValue<P521Point>(p).z)
		fiat.P521Element.prototype.Add.call(t0, t0, t0)
		fiat.P521Element.prototype.Mul.call(z3, t0, z3)
		fiat.P521Element.prototype.Sub.call(x3, x3, z3)
		fiat.P521Element.prototype.Mul.call(z3, t0, t1)
		fiat.P521Element.prototype.Add.call(z3, z3, z3)
		fiat.P521Element.prototype.Add.call(z3, z3, z3)

		fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(q).x, x3)
		fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(q).y, y3)
		fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(q).z, z3)
		return q
	}

	public async ScalarBaseMult(scalar: $.Slice<number>): globalThis.Promise<[P521Point | $.VarRef<P521Point> | null, $.GoError]> {
		const p: P521Point | $.VarRef<P521Point> | null = this
		if ($.len(scalar) != 66) {
			return [null, errors.New("invalid scalar length")]
		}
		let tables: $.VarRef<p521Table[]> | null = await P521Point.prototype.generatorTable.call(p)

		// This is also a scalar multiplication with a four-bit window like in
		// ScalarMult, but in this case the doublings are precomputed. The value
		// [windowValue]G added at iteration k would normally get doubled
		// (totIterations-k)×4 times, but with a larger precomputation we can
		// instead add [2^((totIterations-k)×4)][windowValue]G and avoid the
		// doublings between iterations.
		let t: P521Point | $.VarRef<P521Point> | null = NewP521Point()
		P521Point.prototype.Set.call(p, NewP521Point())
		let tableIndex = $.len($.pointerValue<p521Table[]>(tables)) - 1
		for (let __goscriptRangeTarget0 = scalar, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let byte = __goscriptRangeTarget0![__rangeIndex]
			let windowValue = $.uint($.uintShr(byte, 4, 8), 8)
			p521Table_Select($.indexRef($.pointerValue<p521Table[]>(tables), tableIndex), t, $.uint(windowValue, 8))
			await P521Point.prototype.Add.call(p, p, t)
			tableIndex--

			windowValue = $.uint(byte & 0b1111, 8)
			p521Table_Select($.indexRef($.pointerValue<p521Table[]>(tables), tableIndex), t, $.uint(windowValue, 8))
			await P521Point.prototype.Add.call(p, p, t)
			tableIndex--
		}

		return [p, null]
	}

	public async ScalarMult(q: P521Point | $.VarRef<P521Point> | null, scalar: $.Slice<number>): globalThis.Promise<[P521Point | $.VarRef<P521Point> | null, $.GoError]> {
		const p: P521Point | $.VarRef<P521Point> | null = this
		// Compute a p521Table for the base point q. The explicit NewP521Point
		// calls get inlined, letting the allocations live on the stack.
		let table: $.VarRef<p521Table> = $.varRef([NewP521Point(), NewP521Point(), NewP521Point(), NewP521Point(), NewP521Point(), NewP521Point(), NewP521Point(), NewP521Point(), NewP521Point(), NewP521Point(), NewP521Point(), NewP521Point(), NewP521Point(), NewP521Point(), NewP521Point()])
		P521Point.prototype.Set.call($.arrayIndex(table.value, 0), q)
		for (let i = 1; i < 15; i = i + (2)) {
			await P521Point.prototype.Double.call($.arrayIndex(table.value, i), $.arrayIndex(table.value, Math.trunc(i / 2)))
			await P521Point.prototype.Add.call($.arrayIndex(table.value, i + 1), $.arrayIndex(table.value, i), q)
		}

		// Instead of doing the classic double-and-add chain, we do it with a
		// four-bit window: we double four times, and then add [0-15]P.
		let t: P521Point | $.VarRef<P521Point> | null = NewP521Point()
		P521Point.prototype.Set.call(p, NewP521Point())
		for (let __goscriptRangeTarget1 = scalar, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
			let byte = __goscriptRangeTarget1![i]
			// No need to double on the first iteration, as p is the identity at
			// this point, and [N]∞ = ∞.
			if (i != 0) {
				await P521Point.prototype.Double.call(p, p)
				await P521Point.prototype.Double.call(p, p)
				await P521Point.prototype.Double.call(p, p)
				await P521Point.prototype.Double.call(p, p)
			}

			let windowValue = $.uint($.uintShr(byte, 4, 8), 8)
			p521Table_Select(table, t, $.uint(windowValue, 8))
			await P521Point.prototype.Add.call(p, p, t)

			await P521Point.prototype.Double.call(p, p)
			await P521Point.prototype.Double.call(p, p)
			await P521Point.prototype.Double.call(p, p)
			await P521Point.prototype.Double.call(p, p)

			windowValue = $.uint(byte & 0b1111, 8)
			p521Table_Select(table, t, $.uint(windowValue, 8))
			await P521Point.prototype.Add.call(p, p, t)
		}

		return [p, null]
	}

	public Select(p1: P521Point | $.VarRef<P521Point> | null, p2: P521Point | $.VarRef<P521Point> | null, cond: number): P521Point | $.VarRef<P521Point> | null {
		const q: P521Point | $.VarRef<P521Point> | null = this
		fiat.P521Element.prototype.Select.call($.pointerValue<P521Point>(q).x, $.pointerValue<P521Point>(p1).x, $.pointerValue<P521Point>(p2).x, cond)
		fiat.P521Element.prototype.Select.call($.pointerValue<P521Point>(q).y, $.pointerValue<P521Point>(p1).y, $.pointerValue<P521Point>(p2).y, cond)
		fiat.P521Element.prototype.Select.call($.pointerValue<P521Point>(q).z, $.pointerValue<P521Point>(p1).z, $.pointerValue<P521Point>(p2).z, cond)
		return q
	}

	public Set(q: P521Point | $.VarRef<P521Point> | null): P521Point | $.VarRef<P521Point> | null {
		const p: P521Point | $.VarRef<P521Point> | null = this
		fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(p).x, $.pointerValue<P521Point>(q).x)
		fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(p).y, $.pointerValue<P521Point>(q).y)
		fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(p).z, $.pointerValue<P521Point>(q).z)
		return p
	}

	public async SetBytes(b: $.Slice<number>): globalThis.Promise<[P521Point | $.VarRef<P521Point> | null, $.GoError]> {
		const p: P521Point | $.VarRef<P521Point> | null = this
		switch (true) {
			case ($.len(b) == 1) && ($.uint($.arrayIndex(b!, 0), 8) == $.uint(0, 8)):
			{
				return [P521Point.prototype.Set.call(p, NewP521Point()), null]
				break
			}
			case ($.len(b) == (1 + (2 * 66))) && ($.uint($.arrayIndex(b!, 0), 8) == $.uint(4, 8)):
			{
				let __goscriptTuple0: any = fiat.P521Element.prototype.SetBytes.call(new fiat.P521Element(), $.goSlice(b, 1, 1 + 66))
				let x: fiat.P521Element | $.VarRef<fiat.P521Element> | null = __goscriptTuple0[0]
				let err = __goscriptTuple0[1]
				if (err != null) {
					return [null, err]
				}
				let __goscriptTuple1: any = fiat.P521Element.prototype.SetBytes.call(new fiat.P521Element(), $.goSlice(b, 1 + 66, undefined))
				let y: fiat.P521Element | $.VarRef<fiat.P521Element> | null = __goscriptTuple1[0]
				err = __goscriptTuple1[1]
				if (err != null) {
					return [null, err]
				}
				{
					let __goscriptShadow0 = await p521CheckOnCurve(x, y)
					if (__goscriptShadow0 != null) {
						return [null, __goscriptShadow0]
					}
				}
				fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(p).x, x)
				fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(p).y, y)
				fiat.P521Element.prototype.One.call($.pointerValue<P521Point>(p).z)
				return [p, null]
				break
			}
			case ($.len(b) == (1 + 66)) && (($.uint($.arrayIndex(b!, 0), 8) == $.uint(2, 8)) || ($.uint($.arrayIndex(b!, 0), 8) == $.uint(3, 8))):
			{
				let __goscriptTuple2: any = fiat.P521Element.prototype.SetBytes.call(new fiat.P521Element(), $.goSlice(b, 1, undefined))
				let x: fiat.P521Element | $.VarRef<fiat.P521Element> | null = __goscriptTuple2[0]
				let err = __goscriptTuple2[1]
				if (err != null) {
					return [null, err]
				}

				// y² = x³ - 3x + b
				let y: fiat.P521Element | $.VarRef<fiat.P521Element> | null = await p521Polynomial(new fiat.P521Element(), x)
				if (!p521Sqrt(y, y)) {
					return [null, errors.New("invalid P521 compressed point encoding")]
				}

				// Select the positive or negative root, as indicated by the least
				// significant bit, based on the encoding type byte.
				let otherRoot: fiat.P521Element | $.VarRef<fiat.P521Element> | null = new fiat.P521Element()
				fiat.P521Element.prototype.Sub.call(otherRoot, otherRoot, y)
				let cond = $.uint(($.arrayIndex(fiat.P521Element.prototype.Bytes.call(y)!, 66 - 1) & 1) ^ ($.arrayIndex(b!, 0) & 1), 8)
				fiat.P521Element.prototype.Select.call(y, otherRoot, y, $.int(cond))

				fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(p).x, x)
				fiat.P521Element.prototype.Set.call($.pointerValue<P521Point>(p).y, y)
				fiat.P521Element.prototype.One.call($.pointerValue<P521Point>(p).z)
				return [p, null]
				break
			}
			default:
			{
				return [null, errors.New("invalid P521 point encoding")]
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public SetGenerator(): P521Point | $.VarRef<P521Point> | null {
		const p: P521Point | $.VarRef<P521Point> | null = this
		fiat.P521Element.prototype.SetBytes.call($.pointerValue<P521Point>(p).x, new Uint8Array([0, 198, 133, 142, 6, 183, 4, 4, 233, 205, 158, 62, 203, 102, 35, 149, 180, 66, 156, 100, 129, 57, 5, 63, 181, 33, 248, 40, 175, 96, 107, 77, 61, 186, 161, 75, 94, 119, 239, 231, 89, 40, 254, 29, 193, 39, 162, 255, 168, 222, 51, 72, 179, 193, 133, 106, 66, 155, 249, 126, 126, 49, 194, 229, 189, 102]) as $.Slice<number>)
		fiat.P521Element.prototype.SetBytes.call($.pointerValue<P521Point>(p).y, new Uint8Array([1, 24, 57, 41, 106, 120, 154, 59, 192, 4, 92, 138, 95, 180, 44, 125, 27, 217, 152, 245, 68, 73, 87, 155, 68, 104, 23, 175, 189, 23, 39, 62, 102, 44, 151, 238, 114, 153, 94, 244, 38, 64, 197, 80, 185, 1, 63, 173, 7, 97, 53, 60, 112, 134, 162, 114, 194, 64, 136, 190, 148, 118, 159, 209, 102, 80]) as $.Slice<number>)
		fiat.P521Element.prototype.One.call($.pointerValue<P521Point>(p).z)
		return p
	}

	public bytes(out: $.VarRef<Uint8Array> | null): $.Slice<number> {
		const p: P521Point | $.VarRef<P521Point> | null = this
		if (fiat.P521Element.prototype.IsZero.call($.pointerValue<P521Point>(p).z) == 1) {
			return $.append($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), $.uint(0, 8), $.byteSliceHint)
		}

		let zinv: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Invert.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).z)
		let x: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Mul.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).x, zinv)
		let y: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Mul.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).y, zinv)

		let buf: $.Slice<number> = $.append($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), $.uint(4, 8), $.byteSliceHint)
		buf = $.appendSlice(buf, fiat.P521Element.prototype.Bytes.call(x), $.byteSliceHint)
		buf = $.appendSlice(buf, fiat.P521Element.prototype.Bytes.call(y), $.byteSliceHint)
		return buf
	}

	public bytesCompressed(out: $.VarRef<Uint8Array> | null): $.Slice<number> {
		const p: P521Point | $.VarRef<P521Point> | null = this
		if (fiat.P521Element.prototype.IsZero.call($.pointerValue<P521Point>(p).z) == 1) {
			return $.append($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), $.uint(0, 8), $.byteSliceHint)
		}

		let zinv: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Invert.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).z)
		let x: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Mul.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).x, zinv)
		let y: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Mul.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).y, zinv)

		// Encode the sign of the y coordinate (indicated by the least significant
		// bit) as the encoding type (2 or 3).
		let buf: $.Slice<number> = $.append($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), $.uint(2, 8), $.byteSliceHint)
		buf![0] = buf![0] | ($.uint($.arrayIndex(fiat.P521Element.prototype.Bytes.call(y)!, 66 - 1) & 1, 8))
		buf = $.appendSlice(buf, fiat.P521Element.prototype.Bytes.call(x), $.byteSliceHint)
		return buf
	}

	public bytesX(out: $.VarRef<Uint8Array> | null): [$.Slice<number>, $.GoError] {
		const p: P521Point | $.VarRef<P521Point> | null = this
		if (fiat.P521Element.prototype.IsZero.call($.pointerValue<P521Point>(p).z) == 1) {
			return [null, errors.New("P521 point is the point at infinity")]
		}

		let zinv: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Invert.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).z)
		let x: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Mul.call(new fiat.P521Element(), $.pointerValue<P521Point>(p).x, zinv)

		return [$.appendSlice($.goSlice($.pointerValue<Uint8Array>(out), undefined, 0), fiat.P521Element.prototype.Bytes.call(x), $.byteSliceHint), null]
	}

	public async generatorTable(): globalThis.Promise<$.VarRef<p521Table[]> | null> {
		const p: P521Point | $.VarRef<P521Point> | null = this
		await p521GeneratorTableOnce.value.Do($.functionValue(async (): globalThis.Promise<void> => {
			p521GeneratorTable = $.varRef<p521Table[]>(Array.from({ length: 132 }, () => Array.from({ length: 15 }, () => null)))
			let base: P521Point | $.VarRef<P521Point> | null = P521Point.prototype.SetGenerator.call(NewP521Point())
			for (let i = 0; i < (66 * 2); i++) {
				$.arrayIndex($.pointerValue<p521Table[]>(p521GeneratorTable), i)[0] = P521Point.prototype.Set.call(NewP521Point(), base)
				for (let j = 1; j < 15; j++) {
					$.arrayIndex($.pointerValue<p521Table[]>(p521GeneratorTable), i)[j] = await P521Point.prototype.Add.call(NewP521Point(), $.arrayIndex($.arrayIndex($.pointerValue<p521Table[]>(p521GeneratorTable), i), j - 1), base)
				}
				await P521Point.prototype.Double.call(base, base)
				await P521Point.prototype.Double.call(base, base)
				await P521Point.prototype.Double.call(base, base)
				await P521Point.prototype.Double.call(base, base)
			}
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		return p521GeneratorTable
	}

	static __typeInfo = $.registerStructType(
		"nistec.P521Point",
		() => new P521Point(),
		[{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }, { name: "p2", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesCompressed", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Double", args: [{ name: "p", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }] }, { name: "ScalarBaseMult", args: [{ name: "scalar", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "q", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }, { name: "scalar", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }, { name: "_r1", type: "error" }] }, { name: "Select", args: [{ name: "p1", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }, { name: "p2", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }, { name: "cond", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }] }, { name: "Set", args: [{ name: "q", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }] }, { name: "SetBytes", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }, { name: "_r1", type: "error" }] }, { name: "SetGenerator", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" } }] }, { name: "bytes", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 133 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "bytesCompressed", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 67 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "bytesX", args: [{ name: "out", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 66 } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "generatorTable", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: "nistec.p521Table", length: 132 } } }] }],
		P521Point,
		[{ name: "x", key: "x", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" }, pkgPath: "crypto/internal/fips140/nistec", index: [0], offset: 0, exported: false }, { name: "y", key: "y", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" }, pkgPath: "crypto/internal/fips140/nistec", index: [1], offset: 8, exported: false }, { name: "z", key: "z", type: { kind: $.TypeKind.Pointer, elemType: "fiat.P521Element" }, pkgPath: "crypto/internal/fips140/nistec", index: [2], offset: 16, exported: false }]
	)
}

export const p521ElementLength: number = 66

export function NewP521Point(): P521Point | $.VarRef<P521Point> | null {
	return (() => { const __goscriptLiteralField0 = fiat.P521Element.prototype.One.call(new fiat.P521Element()); return new P521Point({x: new fiat.P521Element(), y: __goscriptLiteralField0, z: new fiat.P521Element()}) })()
}

export let _p521B: fiat.P521Element | $.VarRef<fiat.P521Element> | null = null! as fiat.P521Element | $.VarRef<fiat.P521Element> | null

export function __goscript_set__p521B(__goscriptValue: fiat.P521Element | $.VarRef<fiat.P521Element> | null): void {
	_p521B = __goscriptValue
}

export let _p521BOnce: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set__p521BOnce(__goscriptValue: sync.Once): void {
	_p521BOnce.value = __goscriptValue
}

export async function p521B(): globalThis.Promise<fiat.P521Element | $.VarRef<fiat.P521Element> | null> {
	await _p521BOnce.value.Do($.functionValue((): void => {
		let __goscriptTuple3: any = fiat.P521Element.prototype.SetBytes.call(new fiat.P521Element(), new Uint8Array([0, 81, 149, 62, 185, 97, 142, 28, 154, 31, 146, 154, 33, 160, 182, 133, 64, 238, 162, 218, 114, 91, 153, 179, 21, 243, 184, 180, 137, 145, 142, 241, 9, 225, 86, 25, 57, 81, 236, 126, 147, 123, 22, 82, 192, 189, 59, 177, 191, 7, 53, 115, 223, 136, 61, 44, 52, 241, 239, 69, 31, 212, 107, 80, 63, 0]) as $.Slice<number>)
		_p521B = __goscriptTuple3[0]
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	return _p521B
}

export async function p521Polynomial(y2: fiat.P521Element | $.VarRef<fiat.P521Element> | null, x: fiat.P521Element | $.VarRef<fiat.P521Element> | null): globalThis.Promise<fiat.P521Element | $.VarRef<fiat.P521Element> | null> {
	fiat.P521Element.prototype.Square.call(y2, x)
	fiat.P521Element.prototype.Mul.call(y2, y2, x)

	let threeX: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Add.call(new fiat.P521Element(), x, x)
	fiat.P521Element.prototype.Add.call(threeX, threeX, x)
	fiat.P521Element.prototype.Sub.call(y2, y2, threeX)

	return fiat.P521Element.prototype.Add.call(y2, y2, await p521B())
}

export async function p521CheckOnCurve(x: fiat.P521Element | $.VarRef<fiat.P521Element> | null, y: fiat.P521Element | $.VarRef<fiat.P521Element> | null): globalThis.Promise<$.GoError> {
	// y² = x³ - 3x + b
	let rhs: fiat.P521Element | $.VarRef<fiat.P521Element> | null = await p521Polynomial(new fiat.P521Element(), x)
	let lhs: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Square.call(new fiat.P521Element(), y)
	if (fiat.P521Element.prototype.Equal.call(rhs, lhs) != 1) {
		return errors.New("P521 point not on curve")
	}
	return null
}

export function p521Table_Select(table: $.VarRef<p521Table> | null, p: P521Point | $.VarRef<P521Point> | null, n: number): void {
	if ($.uint(n, 8) >= $.uint(16, 8)) {
		$.panic("nistec: internal error: p521Table called with out-of-bounds value")
	}
	P521Point.prototype.Set.call(p, NewP521Point())
	for (let i = $.uint($.uint(1, 8), 8); $.uint(i, 8) < $.uint(16, 8); i++) {
		let cond = constanttime.ByteEq($.uint(i, 8), $.uint(n, 8))
		P521Point.prototype.Select.call(p, $.arrayIndex($.pointerValue<(P521Point | $.VarRef<P521Point> | null)[]>(table), i - 1), p, cond)
	}
}

export let p521GeneratorTable: $.VarRef<p521Table[]> | null = null! as $.VarRef<p521Table[]> | null

export function __goscript_set_p521GeneratorTable(__goscriptValue: $.VarRef<p521Table[]> | null): void {
	p521GeneratorTable = __goscriptValue
}

export let p521GeneratorTableOnce: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set_p521GeneratorTableOnce(__goscriptValue: sync.Once): void {
	p521GeneratorTableOnce.value = __goscriptValue
}

export function p521Sqrt(e: fiat.P521Element | $.VarRef<fiat.P521Element> | null, x: fiat.P521Element | $.VarRef<fiat.P521Element> | null): boolean {
	let isSquare: boolean = false
	let candidate: fiat.P521Element | $.VarRef<fiat.P521Element> | null = new fiat.P521Element()
	p521SqrtCandidate(candidate, x)
	let square: fiat.P521Element | $.VarRef<fiat.P521Element> | null = fiat.P521Element.prototype.Square.call(new fiat.P521Element(), candidate)
	if (fiat.P521Element.prototype.Equal.call(square, x) != 1) {
		return false
	}
	fiat.P521Element.prototype.Set.call(e, candidate)
	return true
}

export function p521SqrtCandidate(z: fiat.P521Element | $.VarRef<fiat.P521Element> | null, x: fiat.P521Element | $.VarRef<fiat.P521Element> | null): void {
	// Since p = 3 mod 4, exponentiation by (p + 1) / 4 yields a square root candidate.
	//
	// The sequence of 0 multiplications and 519 squarings is derived from the
	// following addition chain generated with github.com/mmcloughlin/addchain v0.4.0.
	//
	//	return  1 << 519
	//

	fiat.P521Element.prototype.Square.call(z, x)
	for (let s = 1; s < 519; s++) {
		fiat.P521Element.prototype.Square.call(z, z)
	}
}

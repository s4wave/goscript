// Generated file based on natdiv.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"

import type * as io from "@goscript/io/index.js"

import type * as rand from "@goscript/math/rand/index.js"

import * as __goscript_arith from "./arith.gs.ts"

import * as __goscript_arith_decl from "./arith_decl.gs.ts"

import * as __goscript_int from "./int.gs.ts"

import * as __goscript_nat from "./nat.gs.ts"

import * as __goscript_natconv from "./natconv.gs.ts"

import * as __goscript_natmul from "./natmul.gs.ts"

import * as __goscript_prime from "./prime.gs.ts"
import "@goscript/math/bits/index.js"
import "./arith.gs.ts"
import "./arith_decl.gs.ts"
import "./int.gs.ts"
import "./nat.gs.ts"
import "./natconv.gs.ts"
import "./natmul.gs.ts"
import "./prime.gs.ts"

export async function nat_rem(z: __goscript_nat.nat, stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null, u: __goscript_nat.nat, v: __goscript_nat.nat): globalThis.Promise<__goscript_nat.nat> {
	let r: __goscript_nat.nat = null as __goscript_nat.nat
	using __defer = new $.DisposableStack()
	if (__goscript_nat.alias((z as __goscript_nat.nat), (u as __goscript_nat.nat))) {
		z = (null as __goscript_nat.nat)
	}
	__defer.defer(() => { __goscript_nat.stack.prototype.restore.call(stk, __goscript_nat.stack.prototype.save.call(stk)) })
	let q: __goscript_nat.nat = (__goscript_nat.stack.prototype.nat.call(stk, $.max(1, $.len((u as __goscript_nat.nat)) - ($.len((v as __goscript_nat.nat)) - 1))) as __goscript_nat.nat)
	let __goscriptTuple0: any = await nat_div(q, stk, (z as __goscript_nat.nat), (u as __goscript_nat.nat), (v as __goscript_nat.nat))
	r = (__goscriptTuple0[1] as __goscript_nat.nat)
	const __goscriptReturn0: __goscript_nat.nat = (r as __goscript_nat.nat)
	r = __goscriptReturn0
	__defer.dispose()
	return r
	throw new globalThis.Error("goscript: unreachable return")
}

export async function nat_div(z: __goscript_nat.nat, stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null, z2: __goscript_nat.nat, u: __goscript_nat.nat, v: __goscript_nat.nat): globalThis.Promise<[__goscript_nat.nat, __goscript_nat.nat]> {
	let q: __goscript_nat.nat = null as __goscript_nat.nat
	let r: __goscript_nat.nat = null as __goscript_nat.nat
	using __defer = new $.DisposableStack()
	if ($.len((v as __goscript_nat.nat)) == 0) {
		$.panic("division by zero")
	}

	if ($.len((v as __goscript_nat.nat)) == 1) {
		// Short division: long optimized for a single-word divisor.
		// In that case, the 2-by-1 guess is all we need at each step.
		let r2: __goscript_arith.Word = 0
		let __goscriptTuple1: any = nat_divW(z, (u as __goscript_nat.nat), $.arrayIndex(v!, 0))
		q = (__goscriptTuple1[0] as __goscript_nat.nat)
		r2 = __goscriptTuple1[1]
		r = (__goscript_nat.nat_setWord(z2, r2) as __goscript_nat.nat)
		return [q, r]
	}

	if (__goscript_nat.nat_cmp(u, (v as __goscript_nat.nat)) < 0) {
		q = ($.goSlice(z, undefined, 0) as __goscript_nat.nat)
		r = (__goscript_nat.nat__set(z2, (u as __goscript_nat.nat)) as __goscript_nat.nat)
		return [q, r]
	}

	if (stk == null) {
		stk = await __goscript_nat.getStack()
		__defer.defer(() => { __goscript_nat.stack.prototype.free.call(stk) })
	}

	let __goscriptTuple2: any = await nat_divLarge(z, stk, (z2 as __goscript_nat.nat), (u as __goscript_nat.nat), (v as __goscript_nat.nat))
	q = (__goscriptTuple2[0] as __goscript_nat.nat)
	r = (__goscriptTuple2[1] as __goscript_nat.nat)
	__defer.dispose()
	return [q, r]
	throw new globalThis.Error("goscript: unreachable return")
}

export function nat_divW(z: __goscript_nat.nat, x: __goscript_nat.nat, y: __goscript_arith.Word): [__goscript_nat.nat, __goscript_arith.Word] {
	let q: __goscript_nat.nat = null as __goscript_nat.nat
	let r: __goscript_arith.Word = 0
	let m = $.len((x as __goscript_nat.nat))
	switch (true) {
		case y == 0:
		{
			$.panic("division by zero")
			break
		}
		case y == 1:
		{
			q = (__goscript_nat.nat__set(z, (x as __goscript_nat.nat)) as __goscript_nat.nat)
			return [q, r]
			break
		}
		case m == 0:
		{
			q = ($.goSlice(z, undefined, 0) as __goscript_nat.nat)
			return [q, r]
			break
		}
	}
	// m > 0
	z = (__goscript_nat.nat_make(z, m) as __goscript_nat.nat)
	r = divWVW(z, 0, x, y)
	q = (__goscript_nat.nat_norm(z) as __goscript_nat.nat)
	return [q, r]
}

export function nat_modW(x: __goscript_nat.nat, d: __goscript_arith.Word): __goscript_arith.Word {
	let r: __goscript_arith.Word = 0
	// TODO(agl): we don't actually need to store the q value.
	let q: __goscript_nat.nat = null as __goscript_nat.nat
	q = (__goscript_nat.nat_make(q, $.len((x as __goscript_nat.nat))) as __goscript_nat.nat)
	return divWVW(q, 0, x, d)
}

export function divWVW(z: $.Slice<__goscript_arith.Word>, xn: __goscript_arith.Word, x: $.Slice<__goscript_arith.Word>, y: __goscript_arith.Word): __goscript_arith.Word {
	let r: __goscript_arith.Word = 0
	r = xn
	if ($.len(x) == 1) {
		let [qq, rr] = bits.Div($.uint(r, 64), $.uint($.arrayIndex(x!, 0), 64), $.uint(y, 64))
		z![0] = $.uint(qq, 64)
		return $.uint(rr, 64)
	}
	let rec = __goscript_arith.reciprocalWord(y)
	for (let i = $.len(z) - 1; i >= 0; i--) {
		let __goscriptTuple3: any = __goscript_arith.divWW(r, $.arrayIndex(x!, i), y, rec)
		z![i] = __goscriptTuple3[0]
		r = __goscriptTuple3[1]
	}
	return r
}

export async function nat_divLarge(z: __goscript_nat.nat, stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null, u: __goscript_nat.nat, uIn: __goscript_nat.nat, vIn: __goscript_nat.nat): globalThis.Promise<[__goscript_nat.nat, __goscript_nat.nat]> {
	let q: __goscript_nat.nat = null as __goscript_nat.nat
	let r: __goscript_nat.nat = null as __goscript_nat.nat
	using __defer = new $.DisposableStack()
	let n = $.len((vIn as __goscript_nat.nat))
	let m = $.len((uIn as __goscript_nat.nat)) - n

	// Scale the inputs so vIn's top bit is 1 (see “Scaling Inputs” above).
	// vIn is treated as a read-only input (it may be in use by another
	// goroutine), so we must make a copy.
	// uIn is copied to u.
	__defer.defer(() => { __goscript_nat.stack.prototype.restore.call(stk, __goscript_nat.stack.prototype.save.call(stk)) })
	let shift = __goscript_arith.nlz($.arrayIndex(vIn!, n - 1))
	let v: __goscript_nat.nat = (__goscript_nat.stack.prototype.nat.call(stk, n) as __goscript_nat.nat)
	u = (__goscript_nat.nat_make(u, $.len((uIn as __goscript_nat.nat)) + 1) as __goscript_nat.nat)
	if (shift == 0) {
		$.copy((v as __goscript_nat.nat), (vIn as __goscript_nat.nat))
		$.copy(($.goSlice(u, undefined, $.len((uIn as __goscript_nat.nat))) as __goscript_nat.nat), (uIn as __goscript_nat.nat))
		u![$.len((uIn as __goscript_nat.nat))] = 0
	} else {
		__goscript_arith_decl.lshVU(v, vIn, shift)
		u![$.len((uIn as __goscript_nat.nat))] = __goscript_arith_decl.lshVU($.goSlice(u, undefined, $.len((uIn as __goscript_nat.nat))), uIn, shift)
	}

	// The caller should not pass aliased z and u, since those are
	// the two different outputs, but correct just in case.
	if (__goscript_nat.alias((z as __goscript_nat.nat), (u as __goscript_nat.nat))) {
		z = (null as __goscript_nat.nat)
	}
	q = (__goscript_nat.nat_make(z, m + 1) as __goscript_nat.nat)

	// Use basic or recursive long division depending on size.
	if (n < __goscript_get_divRecursiveThreshold()) {
		nat_divBasic(q, stk, (u as __goscript_nat.nat), (v as __goscript_nat.nat))
	} else {
		await nat_divRecursive(q, stk, (u as __goscript_nat.nat), (v as __goscript_nat.nat))
	}

	q = (__goscript_nat.nat_norm(q) as __goscript_nat.nat)

	// Undo scaling of remainder.
	if (shift != 0) {
		__goscript_arith_decl.rshVU(u, u, shift)
	}
	r = (__goscript_nat.nat_norm(u) as __goscript_nat.nat)

	const __goscriptReturn1: [__goscript_nat.nat, __goscript_nat.nat] = [(q as __goscript_nat.nat), (r as __goscript_nat.nat)]
	q = __goscriptReturn1[0]
	r = __goscriptReturn1[1]
	__defer.dispose()
	return [q, r]
	throw new globalThis.Error("goscript: unreachable return")
}

export function nat_divBasic(q: __goscript_nat.nat, stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null, u: __goscript_nat.nat, v: __goscript_nat.nat): void {
	using __defer = new $.DisposableStack()
	let n = $.len((v as __goscript_nat.nat))
	let m = $.len((u as __goscript_nat.nat)) - n

	__defer.defer(() => { __goscript_nat.stack.prototype.restore.call(stk, __goscript_nat.stack.prototype.save.call(stk)) })
	let qhatv: __goscript_nat.nat = (__goscript_nat.stack.prototype.nat.call(stk, n + 1) as __goscript_nat.nat)

	// Set up for divWW below, precomputing reciprocal argument.
	let vn1 = $.arrayIndex(v!, n - 1)
	let rec = __goscript_arith.reciprocalWord(vn1)

	// Invent a leading 0 for u, for the first iteration.
	// Invariant: ujn == u[j+n] in each iteration.
	let ujn = 0

	// Compute each digit of quotient.
	for (let j = m; j >= 0; j--) {
		// Compute the 2-by-1 guess q̂.
		let qhat = $.uint("18446744073709551615", 64)

		// ujn ≤ vn1, or else q̂ would be more than one digit.
		// For ujn == vn1, we set q̂ to the max digit M above.
		// Otherwise, we compute the 2-by-1 guess.
		if (ujn != vn1) {
			let rhat: __goscript_arith.Word = 0
			let __goscriptTuple4: any = __goscript_arith.divWW(ujn, $.arrayIndex(u!, (j + n) - 1), vn1, rec)
			qhat = __goscriptTuple4[0]
			rhat = __goscriptTuple4[1]

			// Refine q̂ to a 3-by-2 guess. See “Refining Guesses” above.
			let vn2 = $.arrayIndex(v!, n - 2)
			let [x1, x2] = __goscript_arith.mulWW(qhat, vn2)
			let ujn2 = $.arrayIndex(u!, (j + n) - 2)
			while (greaterThan(x1, x2, rhat, ujn2)) {
				qhat--
				let prevRhat = rhat
				rhat = $.uint($.uint64Add(rhat, vn1), 64)
				// If r̂  overflows, then
				// r̂ u[j+n-2]v[n-1] is now definitely > x1 x2.
				if (rhat < prevRhat) {
					break
				}
				// TODO(rsc): No need for a full mulWW.
				// x2 += vn2; if x2 overflows, x1++
				let __goscriptTuple5: any = __goscript_arith.mulWW(qhat, vn2)
				x1 = __goscriptTuple5[0]
				x2 = __goscriptTuple5[1]
			}
		}

		// Compute q̂·v.
		qhatv![n] = __goscript_arith_decl.mulAddVWW($.goSlice(qhatv, 0, n), v, qhat, 0)
		let qhl = $.len((qhatv as __goscript_nat.nat))
		if (((j + qhl) > $.len((u as __goscript_nat.nat))) && ($.arrayIndex(qhatv!, n) == 0)) {
			qhl--
		}

		// Subtract q̂·v from the current section of u.
		// If it underflows, q̂·v > u, which we fix up
		// by decrementing q̂ and adding v back.
		let c = __goscript_arith_decl.subVV($.goSlice(u, j, j + qhl), $.goSlice(u, j, j + qhl), $.goSlice(qhatv, undefined, qhl))
		if (c != 0) {
			let __goscriptShadow0 = __goscript_arith_decl.addVV($.goSlice(u, j, j + n), $.goSlice(u, j, j + n), v)
			// If n == qhl, the carry from subVV and the carry from addVV
			// cancel out and don't affect u[j+n].
			if (n < qhl) {
				u![j + n] = $.uint($.uint64Add(u![j + n], __goscriptShadow0), 64)
			}
			qhat--
		}

		ujn = $.arrayIndex(u!, (j + n) - 1)

		// Save quotient digit.
		// Caller may know the top digit is zero and not leave room for it.
		if (((j == m) && (m == $.len((q as __goscript_nat.nat)))) && (qhat == 0)) {
			continue
		}
		q![j] = qhat
	}
}

export function greaterThan(x1: __goscript_arith.Word, x2: __goscript_arith.Word, y1: __goscript_arith.Word, y2: __goscript_arith.Word): boolean {
	return (x1 > y1) || ((x1 == y1) && (x2 > y2))
}

export var divRecursiveThreshold: number

export function __goscript_init_divRecursiveThreshold(): void {
	if (((divRecursiveThreshold) as any) === undefined) {
		divRecursiveThreshold = 40
	}
}

export function __goscript_get_divRecursiveThreshold(): number {
	if (((divRecursiveThreshold) as any) === undefined) {
		__goscript_init_divRecursiveThreshold()
	}
	return divRecursiveThreshold
}

export function __goscript_set_divRecursiveThreshold(__goscriptValue: number): void {
	divRecursiveThreshold = __goscriptValue
}

export async function nat_divRecursive(z: __goscript_nat.nat, stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null, u: __goscript_nat.nat, v: __goscript_nat.nat): globalThis.Promise<void> {
	$.clear((z as __goscript_nat.nat))
	await nat_divRecursiveStep(z, stk, (u as __goscript_nat.nat), (v as __goscript_nat.nat), 0)
}

export async function nat_divRecursiveStep(z: __goscript_nat.nat, stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null, u: __goscript_nat.nat, v: __goscript_nat.nat, depth: number): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	// u is a subsection of the original and may have leading zeros.
	// TODO(rsc): The v = v.norm() is useless and should be removed.
	// We know (and require) that v's top digit is ≥ B/2.
	u = (__goscript_nat.nat_norm(u) as __goscript_nat.nat)
	v = (__goscript_nat.nat_norm(v) as __goscript_nat.nat)
	if ($.len((u as __goscript_nat.nat)) == 0) {
		$.clear((z as __goscript_nat.nat))
		return
	}

	// Fall back to basic division if the problem is now small enough.
	let n = $.len((v as __goscript_nat.nat))
	if (n < __goscript_get_divRecursiveThreshold()) {
		nat_divBasic(z, stk, (u as __goscript_nat.nat), (v as __goscript_nat.nat))
		return
	}

	// Nothing to do if u is shorter than v (implies u < v).
	let m = $.len((u as __goscript_nat.nat)) - n
	if (m < 0) {
		return
	}

	// We consider B digits in a row as a single wide digit.
	// (See “Recursive Division” above.)
	//
	// TODO(rsc): rename B to Wide, to avoid confusion with _B,
	// which is something entirely different.
	// TODO(rsc): Look into whether using ⌈n/2⌉ is better than ⌊n/2⌋.
	let B = Math.trunc(n / 2)

	// Allocate a nat for qhat below.
	__defer.defer(() => { __goscript_nat.stack.prototype.restore.call(stk, __goscript_nat.stack.prototype.save.call(stk)) })
	let qhat0: __goscript_nat.nat = (__goscript_nat.stack.prototype.nat.call(stk, B + 1) as __goscript_nat.nat)

	// Compute each wide digit of the quotient.
	//
	// TODO(rsc): Change the loop to be
	//	for j := (m+B-1)/B*B; j > 0; j -= B {
	// which will make the final step a regular step, letting us
	// delete what amounts to an extra copy of the loop body below.
	let j = m
	while (j > B) {
		// Divide u[j-B:j+n] (3 wide digits) by v (2 wide digits).
		// First make the 2-by-1-wide-digit guess using a recursive call.
		// Then extend the guess to the full 3-by-2 (see “Refining Guesses”).
		//
		// For the 2-by-1-wide-digit guess, instead of doing 2B-by-B-digit,
		// we use a (2B+1)-by-(B+1) digit, which handles the possibility that
		// the result has an extra leading 1 digit as well as guaranteeing
		// that the computed q̂ will be off by at most 1 instead of 2.

		// s is the number of digits to drop from the 3B- and 2B-digit chunks.
		// We drop B-1 to be left with 2B+1 and B+1.
		let s = (B - 1)

		// uu is the up-to-3B-digit section of u we are working on.
		let uu: __goscript_nat.nat = ($.goSlice(u, j - B, undefined) as __goscript_nat.nat)

		// Compute the 2-by-1 guess q̂, leaving r̂ in uu[s:B+n].
		let qhat: __goscript_nat.nat = (qhat0 as __goscript_nat.nat)
		$.clear((qhat as __goscript_nat.nat))
		await nat_divRecursiveStep(qhat, stk, ($.goSlice(uu, s, B + n) as __goscript_nat.nat), ($.goSlice(v, s, undefined) as __goscript_nat.nat), depth + 1)
		qhat = (__goscript_nat.nat_norm(qhat) as __goscript_nat.nat)

		// Extend to a 3-by-2 quotient and remainder.
		// Because divRecursiveStep overwrote the top part of uu with
		// the remainder r̂, the full uu already contains the equivalent
		// of r̂·B + uₙ₋₂ from the “Refining Guesses” discussion.
		// Subtracting q̂·vₙ₋₂ from it will compute the full-length remainder.
		// If that subtraction underflows, q̂·v > u, which we fix up
		// by decrementing q̂ and adding v back, same as in long division.

		// TODO(rsc): Instead of subtract and fix-up, this code is computing
		// q̂·vₙ₋₂ and decrementing q̂ until that product is ≤ u.
		// But we can do the subtraction directly, as in the comment above
		// and in long division, because we know that q̂ is wrong by at most one.
		let mark = __goscript_nat.stack.prototype.save.call(stk)
		let qhatv: __goscript_nat.nat = (__goscript_nat.stack.prototype.nat.call(stk, 3 * n) as __goscript_nat.nat)
		$.clear((qhatv as __goscript_nat.nat))
		qhatv = (await __goscript_natmul.nat_mul(qhatv, stk, (qhat as __goscript_nat.nat), ($.goSlice(v, undefined, s) as __goscript_nat.nat)) as __goscript_nat.nat)
		for (let i = 0; i < 2; i++) {
			let e = __goscript_nat.nat_cmp(qhatv, (__goscript_nat.nat_norm(uu) as __goscript_nat.nat))
			if (e <= 0) {
				break
			}
			__goscript_arith.subVW(qhat, qhat, 1)
			let c = __goscript_arith_decl.subVV($.goSlice(qhatv, undefined, s), $.goSlice(qhatv, undefined, s), $.goSlice(v, undefined, s))
			if ($.len((qhatv as __goscript_nat.nat)) > s) {
				__goscript_arith.subVW($.goSlice(qhatv, s, undefined), $.goSlice(qhatv, s, undefined), c)
			}
			__goscript_nat.addTo(($.goSlice(uu, s, undefined) as __goscript_nat.nat), ($.goSlice(v, s, undefined) as __goscript_nat.nat))
		}
		if (__goscript_nat.nat_cmp(qhatv, (__goscript_nat.nat_norm(uu) as __goscript_nat.nat)) > 0) {
			$.panic("impossible")
		}
		let c = __goscript_arith_decl.subVV($.goSlice(uu, undefined, $.len((qhatv as __goscript_nat.nat))), $.goSlice(uu, undefined, $.len((qhatv as __goscript_nat.nat))), qhatv)
		if (c > 0) {
			__goscript_arith.subVW($.goSlice(uu, $.len((qhatv as __goscript_nat.nat)), undefined), $.goSlice(uu, $.len((qhatv as __goscript_nat.nat)), undefined), c)
		}
		__goscript_nat.addTo(($.goSlice(z, j - B, undefined) as __goscript_nat.nat), (qhat as __goscript_nat.nat))
		j = j - (B)
		__goscript_nat.stack.prototype.restore.call(stk, mark)
	}

	// TODO(rsc): Rewrite loop as described above and delete all this code.

	// Now u < (v<<B), compute lower bits in the same way.
	// Choose shift = B-1 again.
	let s = B - 1
	let qhat: __goscript_nat.nat = (qhat0 as __goscript_nat.nat)
	$.clear((qhat as __goscript_nat.nat))
	await nat_divRecursiveStep(qhat, stk, (__goscript_nat.nat_norm($.goSlice(u, s, undefined)) as __goscript_nat.nat), ($.goSlice(v, s, undefined) as __goscript_nat.nat), depth + 1)
	qhat = (__goscript_nat.nat_norm(qhat) as __goscript_nat.nat)
	let qhatv: __goscript_nat.nat = (__goscript_nat.stack.prototype.nat.call(stk, 3 * n) as __goscript_nat.nat)
	$.clear((qhatv as __goscript_nat.nat))
	qhatv = (await __goscript_natmul.nat_mul(qhatv, stk, (qhat as __goscript_nat.nat), ($.goSlice(v, undefined, s) as __goscript_nat.nat)) as __goscript_nat.nat)
	// Set the correct remainder as before.
	for (let i = 0; i < 2; i++) {
		{
			let e = __goscript_nat.nat_cmp(qhatv, (__goscript_nat.nat_norm(u) as __goscript_nat.nat))
			if (e > 0) {
				__goscript_arith.subVW(qhat, qhat, 1)
				let c = __goscript_arith_decl.subVV($.goSlice(qhatv, undefined, s), $.goSlice(qhatv, undefined, s), $.goSlice(v, undefined, s))
				if ($.len((qhatv as __goscript_nat.nat)) > s) {
					__goscript_arith.subVW($.goSlice(qhatv, s, undefined), $.goSlice(qhatv, s, undefined), c)
				}
				__goscript_nat.addTo(($.goSlice(u, s, undefined) as __goscript_nat.nat), ($.goSlice(v, s, undefined) as __goscript_nat.nat))
			}
		}
	}
	if (__goscript_nat.nat_cmp(qhatv, (__goscript_nat.nat_norm(u) as __goscript_nat.nat)) > 0) {
		$.panic("impossible")
	}
	let c = __goscript_arith_decl.subVV($.goSlice(u, undefined, $.len((qhatv as __goscript_nat.nat))), $.goSlice(u, undefined, $.len((qhatv as __goscript_nat.nat))), qhatv)
	if (c > 0) {
		c = __goscript_arith.subVW($.goSlice(u, $.len((qhatv as __goscript_nat.nat)), undefined), $.goSlice(u, $.len((qhatv as __goscript_nat.nat)), undefined), c)
	}
	if (c > 0) {
		$.panic("impossible")
	}

	// Done!
	__goscript_nat.addTo((z as __goscript_nat.nat), (__goscript_nat.nat_norm(qhat) as __goscript_nat.nat))
}

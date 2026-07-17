// Generated file based on prime.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as rand2 from "@goscript/math/rand/index.js"

import type * as fmt from "@goscript/fmt/index.js"

import type * as io from "@goscript/io/index.js"

import type * as __goscript_accuracy_string from "./accuracy_string.gs.ts"

import * as __goscript_arith from "./arith.gs.ts"

import type * as __goscript_float from "./float.gs.ts"

import * as __goscript_int from "./int.gs.ts"

import * as __goscript_intconv from "./intconv.gs.ts"

import * as __goscript_intmarsh from "./intmarsh.gs.ts"

import * as __goscript_nat from "./nat.gs.ts"

import * as __goscript_natconv from "./natconv.gs.ts"

import * as __goscript_natdiv from "./natdiv.gs.ts"

import * as __goscript_natmul from "./natmul.gs.ts"

import * as __goscript_rat from "./rat.gs.ts"
import "@goscript/math/rand/index.js"
import "./arith.gs.ts"
import "./int.gs.ts"
import "./intconv.gs.ts"
import "./intmarsh.gs.ts"
import "./nat.gs.ts"
import "./natconv.gs.ts"
import "./natdiv.gs.ts"
import "./natmul.gs.ts"
import "./rat.gs.ts"

export async function nat_probablyPrimeMillerRabin(n: __goscript_nat.nat, stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null, reps: number, force2: boolean): globalThis.Promise<boolean> {
	let nm1: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), (n as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
	// determine q, k such that nm1 = q << k
	let k = __goscript_nat.nat_trailingZeroBits(nm1)
	let q: __goscript_nat.nat = (__goscript_nat.nat_rsh((null as __goscript_nat.nat), (nm1 as __goscript_nat.nat), k) as __goscript_nat.nat)

	let nm3: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), (nm1 as __goscript_nat.nat), (__goscript_nat.natTwo as __goscript_nat.nat)) as __goscript_nat.nat)
	let __goscriptShadow0: rand2.Rand | $.VarRef<rand2.Rand> | null = rand2.New(rand2.NewSource($.int64($.arrayIndex(n!, 0))))

	let x: __goscript_nat.nat = null! as __goscript_nat.nat
	let y: __goscript_nat.nat = null! as __goscript_nat.nat
	let quotient: __goscript_nat.nat = null! as __goscript_nat.nat
	let nm3Len = __goscript_nat.nat_bitLen(nm3)

	NextRandom: for (let i = 0; i < reps; i++) {
		if ((i == (reps - 1)) && force2) {
			x = (__goscript_nat.nat__set(x, (__goscript_nat.natTwo as __goscript_nat.nat)) as __goscript_nat.nat)
		} else {
			x = (await __goscript_nat.nat_random(x, __goscriptShadow0, (nm3 as __goscript_nat.nat), nm3Len) as __goscript_nat.nat)
			x = (__goscript_nat.nat_add(x, (x as __goscript_nat.nat), (__goscript_nat.natTwo as __goscript_nat.nat)) as __goscript_nat.nat)
		}
		y = (await __goscript_nat.nat_expNN(y, stk, (x as __goscript_nat.nat), (q as __goscript_nat.nat), (n as __goscript_nat.nat), false) as __goscript_nat.nat)
		if ((__goscript_nat.nat_cmp(y, (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) == 0) || (__goscript_nat.nat_cmp(y, (nm1 as __goscript_nat.nat)) == 0)) {
			continue
		}
		for (let j = $.uint(1, 64); j < k; j++) {
			y = (await __goscript_natmul.nat_sqr(y, stk, (y as __goscript_nat.nat)) as __goscript_nat.nat)
			let __goscriptTuple0: any = await __goscript_natdiv.nat_div(quotient, stk, (y as __goscript_nat.nat), (y as __goscript_nat.nat), (n as __goscript_nat.nat))
			quotient = (__goscriptTuple0[0] as __goscript_nat.nat)
			y = (__goscriptTuple0[1] as __goscript_nat.nat)
			if (__goscript_nat.nat_cmp(y, (nm1 as __goscript_nat.nat)) == 0) {
				continue NextRandom
			}
			if (__goscript_nat.nat_cmp(y, (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) == 0) {
				return false
			}
		}
		return false
	}

	return true
}

export async function nat_probablyPrimeLucas(n: __goscript_nat.nat, stk: __goscript_nat.stack | $.VarRef<__goscript_nat.stack> | null): globalThis.Promise<boolean> {
	// Discard 0, 1.
	if (($.len((n as __goscript_nat.nat)) == 0) || (__goscript_nat.nat_cmp(n, (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) == 0)) {
		return false
	}
	// Two is the only even prime.
	// Already checked by caller, but here to allow testing in isolation.
	if (($.uint($.uint64And($.arrayIndex(n!, 0), 1n), 64)) == 0) {
		return __goscript_nat.nat_cmp(n, (__goscript_nat.natTwo as __goscript_nat.nat)) == 0
	}

	// Baillie-OEIS "method C" for choosing D, P, Q,
	// as in https://oeis.org/A217719/a217719.txt:
	// try increasing P ≥ 3 such that D = P² - 4 (so Q = 1)
	// until Jacobi(D, n) = -1.
	// The search is expected to succeed for non-square n after just a few trials.
	// After more than expected failures, check whether n is square
	// (which would cause Jacobi(D, n) = 1 for all D not dividing n).
	let p = 3
	let d: __goscript_nat.nat = ($.arrayToSlice<__goscript_arith.Word>([1]) as __goscript_nat.nat)
	let t1: __goscript_nat.nat = ((null as __goscript_nat.nat) as __goscript_nat.nat)
	let intD: __goscript_int.Int | $.VarRef<__goscript_int.Int> | null = new __goscript_int.Int({abs: (d as __goscript_nat.nat)})
	let intN: __goscript_int.Int | $.VarRef<__goscript_int.Int> | null = new __goscript_int.Int({abs: (n as __goscript_nat.nat)})
	for (; ; p++) {
		if (p > 10000) {
			// This is widely believed to be impossible.
			// If we get a report, we'll want the exact number n.
			$.panic("math/big: internal error: cannot find (D/n) = -1 for " + await __goscript_int.Int.prototype.String.call(intN))
		}
		d![0] = $.uint($.uint64Sub(($.uint($.uint64Mul(p, p), 64)), 4n), 64)
		let j = await __goscript_int.Jacobi(intD, intN)
		if (j == -1) {
			break
		}
		if (j == 0) {
			// d = p²-4 = (p-2)(p+2).
			// If (d/n) == 0 then d shares a prime factor with n.
			// Since the loop proceeds in increasing p and starts with p-2==1,
			// the shared prime factor must be p+2.
			// If p+2 == n, then n is prime; otherwise p+2 is a proper factor of n.
			return ($.len((n as __goscript_nat.nat)) == 1) && ($.arrayIndex(n!, 0) == ($.uint($.uint64Add(p, 2n), 64)))
		}
		if (p == 40) {
			// We'll never find (d/n) = -1 if n is a square.
			// If n is a non-square we expect to find a d in just a few attempts on average.
			// After 40 attempts, take a moment to check if n is indeed a square.
			t1 = (await __goscript_nat.nat_sqrt(t1, stk, (n as __goscript_nat.nat)) as __goscript_nat.nat)
			t1 = (await __goscript_natmul.nat_sqr(t1, stk, (t1 as __goscript_nat.nat)) as __goscript_nat.nat)
			if (__goscript_nat.nat_cmp(t1, (n as __goscript_nat.nat)) == 0) {
				return false
			}
		}
	}

	// Grantham definition of "extra strong Lucas pseudoprime", after Thm 2.3 on p. 876
	// (D, P, Q above have become Δ, b, 1):
	//
	// Let U_n = U_n(b, 1), V_n = V_n(b, 1), and Δ = b²-4.
	// An extra strong Lucas pseudoprime to base b is a composite n = 2^r s + Jacobi(Δ, n),
	// where s is odd and gcd(n, 2*Δ) = 1, such that either (i) U_s ≡ 0 mod n and V_s ≡ ±2 mod n,
	// or (ii) V_{2^t s} ≡ 0 mod n for some 0 ≤ t < r-1.
	//
	// We know gcd(n, Δ) = 1 or else we'd have found Jacobi(d, n) == 0 above.
	// We know gcd(n, 2) = 1 because n is odd.
	//
	// Arrange s = (n - Jacobi(Δ, n)) / 2^r = (n+1) / 2^r.
	let s: __goscript_nat.nat = (__goscript_nat.nat_add((null as __goscript_nat.nat), (n as __goscript_nat.nat), (__goscript_nat.__goscript_get_natOne() as __goscript_nat.nat)) as __goscript_nat.nat)
	let r = $.int(__goscript_nat.nat_trailingZeroBits(s))
	s = (__goscript_nat.nat_rsh(s, (s as __goscript_nat.nat), $.uint(r, 64)) as __goscript_nat.nat)
	let nm2: __goscript_nat.nat = (__goscript_nat.nat_sub((null as __goscript_nat.nat), (n as __goscript_nat.nat), (__goscript_nat.natTwo as __goscript_nat.nat)) as __goscript_nat.nat)

	// We apply the "almost extra strong" test, which checks the above conditions
	// except for U_s ≡ 0 mod n, which allows us to avoid computing any U_k values.
	// Jacobsen points out that maybe we should just do the full extra strong test:
	// "It is also possible to recover U_n using Crandall and Pomerance equation 3.13:
	// U_n = D^-1 (2V_{n+1} - PV_n) allowing us to run the full extra-strong test
	// at the cost of a single modular inversion. This computation is easy and fast in GMP,
	// so we can get the full extra-strong test at essentially the same performance as the
	// almost extra strong test."

	// Compute Lucas sequence V_s(b, 1), where:
	//
	//	V(0) = 2
	//	V(1) = P
	//	V(k) = P V(k-1) - Q V(k-2).
	//
	// (Remember that due to method C above, P = b, Q = 1.)
	//
	// In general V(k) = α^k + β^k, where α and β are roots of x² - Px + Q.
	// Crandall and Pomerance (p.147) observe that for 0 ≤ j ≤ k,
	//
	//	V(j+k) = V(j)V(k) - V(k-j).
	//
	// So in particular, to quickly double the subscript:
	//
	//	V(2k) = V(k)² - 2
	//	V(2k+1) = V(k) V(k+1) - P
	//
	// We can therefore start with k=0 and build up to k=s in log₂(s) steps.
	let natP: __goscript_nat.nat = (__goscript_nat.nat_setWord((null as __goscript_nat.nat), p) as __goscript_nat.nat)
	let vk: __goscript_nat.nat = (__goscript_nat.nat_setWord((null as __goscript_nat.nat), 2) as __goscript_nat.nat)
	let vk1: __goscript_nat.nat = (__goscript_nat.nat_setWord((null as __goscript_nat.nat), p) as __goscript_nat.nat)
	let t2: __goscript_nat.nat = ((null as __goscript_nat.nat) as __goscript_nat.nat)
	for (let i = $.int(__goscript_nat.nat_bitLen(s)); i >= 0; i--) {
		if (__goscript_nat.nat_bit(s, $.uint(i, 64)) != 0) {
			// k' = 2k+1
			// V(k') = V(2k+1) = V(k) V(k+1) - P.
			t1 = (await __goscript_natmul.nat_mul(t1, stk, (vk as __goscript_nat.nat), (vk1 as __goscript_nat.nat)) as __goscript_nat.nat)
			t1 = (__goscript_nat.nat_add(t1, (t1 as __goscript_nat.nat), (n as __goscript_nat.nat)) as __goscript_nat.nat)
			t1 = (__goscript_nat.nat_sub(t1, (t1 as __goscript_nat.nat), (natP as __goscript_nat.nat)) as __goscript_nat.nat)
			let __goscriptTuple1: any = await __goscript_natdiv.nat_div(t2, stk, (vk as __goscript_nat.nat), (t1 as __goscript_nat.nat), (n as __goscript_nat.nat))
			t2 = (__goscriptTuple1[0] as __goscript_nat.nat)
			vk = (__goscriptTuple1[1] as __goscript_nat.nat)
			// V(k'+1) = V(2k+2) = V(k+1)² - 2.
			t1 = (await __goscript_natmul.nat_sqr(t1, stk, (vk1 as __goscript_nat.nat)) as __goscript_nat.nat)
			t1 = (__goscript_nat.nat_add(t1, (t1 as __goscript_nat.nat), (nm2 as __goscript_nat.nat)) as __goscript_nat.nat)
			let __goscriptTuple2: any = await __goscript_natdiv.nat_div(t2, stk, (vk1 as __goscript_nat.nat), (t1 as __goscript_nat.nat), (n as __goscript_nat.nat))
			t2 = (__goscriptTuple2[0] as __goscript_nat.nat)
			vk1 = (__goscriptTuple2[1] as __goscript_nat.nat)
		} else {
			// k' = 2k
			// V(k'+1) = V(2k+1) = V(k) V(k+1) - P.
			t1 = (await __goscript_natmul.nat_mul(t1, stk, (vk as __goscript_nat.nat), (vk1 as __goscript_nat.nat)) as __goscript_nat.nat)
			t1 = (__goscript_nat.nat_add(t1, (t1 as __goscript_nat.nat), (n as __goscript_nat.nat)) as __goscript_nat.nat)
			t1 = (__goscript_nat.nat_sub(t1, (t1 as __goscript_nat.nat), (natP as __goscript_nat.nat)) as __goscript_nat.nat)
			let __goscriptTuple3: any = await __goscript_natdiv.nat_div(t2, stk, (vk1 as __goscript_nat.nat), (t1 as __goscript_nat.nat), (n as __goscript_nat.nat))
			t2 = (__goscriptTuple3[0] as __goscript_nat.nat)
			vk1 = (__goscriptTuple3[1] as __goscript_nat.nat)
			// V(k') = V(2k) = V(k)² - 2
			t1 = (await __goscript_natmul.nat_sqr(t1, stk, (vk as __goscript_nat.nat)) as __goscript_nat.nat)
			t1 = (__goscript_nat.nat_add(t1, (t1 as __goscript_nat.nat), (nm2 as __goscript_nat.nat)) as __goscript_nat.nat)
			let __goscriptTuple4: any = await __goscript_natdiv.nat_div(t2, stk, (vk as __goscript_nat.nat), (t1 as __goscript_nat.nat), (n as __goscript_nat.nat))
			t2 = (__goscriptTuple4[0] as __goscript_nat.nat)
			vk = (__goscriptTuple4[1] as __goscript_nat.nat)
		}
	}

	// Now k=s, so vk = V(s). Check V(s) ≡ ±2 (mod n).
	if ((__goscript_nat.nat_cmp(vk, (__goscript_nat.natTwo as __goscript_nat.nat)) == 0) || (__goscript_nat.nat_cmp(vk, (nm2 as __goscript_nat.nat)) == 0)) {
		// Check U(s) ≡ 0.
		// As suggested by Jacobsen, apply Crandall and Pomerance equation 3.13:
		//
		//	U(k) = D⁻¹ (2 V(k+1) - P V(k))
		//
		// Since we are checking for U(k) == 0 it suffices to check 2 V(k+1) == P V(k) mod n,
		// or P V(k) - 2 V(k+1) == 0 mod n.
		let __goscriptShadow1 = t1
		let __goscriptShadow2: __goscript_nat.nat = (await __goscript_natmul.nat_mul(__goscriptShadow1, stk, (vk as __goscript_nat.nat), (natP as __goscript_nat.nat)) as __goscript_nat.nat)
		let __goscriptShadow3 = t2
		let __goscriptShadow4: __goscript_nat.nat = (__goscript_nat.nat_lsh(__goscriptShadow3, (vk1 as __goscript_nat.nat), 1) as __goscript_nat.nat)
		if (__goscript_nat.nat_cmp(__goscriptShadow2, (__goscriptShadow4 as __goscript_nat.nat)) < 0) {
			let __goscriptAssign0_0: __goscript_nat.nat = (__goscriptShadow4 as __goscript_nat.nat)
			let __goscriptAssign0_1: __goscript_nat.nat = (__goscriptShadow2 as __goscript_nat.nat)
			__goscriptShadow2 = __goscriptAssign0_0
			__goscriptShadow4 = __goscriptAssign0_1
		}
		__goscriptShadow2 = (__goscript_nat.nat_sub(__goscriptShadow2, (__goscriptShadow2 as __goscript_nat.nat), (__goscriptShadow4 as __goscript_nat.nat)) as __goscript_nat.nat)
		let t3: __goscript_nat.nat = (vk1 as __goscript_nat.nat)
		vk1 = (null as __goscript_nat.nat)
		vk1
		let __goscriptTuple5: any = await __goscript_natdiv.nat_div(__goscriptShadow4, stk, (t3 as __goscript_nat.nat), (__goscriptShadow2 as __goscript_nat.nat), (n as __goscript_nat.nat))
		__goscriptShadow4 = (__goscriptTuple5[0] as __goscript_nat.nat)
		t3 = (__goscriptTuple5[1] as __goscript_nat.nat)
		if ($.len((t3 as __goscript_nat.nat)) == 0) {
			return true
		}
	}

	// Check V(2^t s) ≡ 0 mod n for some 0 ≤ t < r-1.
	for (let t = 0; t < (r - 1); t++) {
		if ($.len((vk as __goscript_nat.nat)) == 0) {
			return true
		}
		// Optimization: V(k) = 2 is a fixed point for V(k') = V(k)² - 2,
		// so if V(k) = 2, we can stop: we will never find a future V(k) == 0.
		if (($.len((vk as __goscript_nat.nat)) == 1) && ($.arrayIndex(vk!, 0) == 2)) {
			return false
		}
		// k' = 2k
		// V(k') = V(2k) = V(k)² - 2
		t1 = (await __goscript_natmul.nat_sqr(t1, stk, (vk as __goscript_nat.nat)) as __goscript_nat.nat)
		t1 = (__goscript_nat.nat_sub(t1, (t1 as __goscript_nat.nat), (__goscript_nat.natTwo as __goscript_nat.nat)) as __goscript_nat.nat)
		let __goscriptTuple6: any = await __goscript_natdiv.nat_div(t2, stk, (vk as __goscript_nat.nat), (t1 as __goscript_nat.nat), (n as __goscript_nat.nat))
		t2 = (__goscriptTuple6[0] as __goscript_nat.nat)
		vk = (__goscriptTuple6[1] as __goscript_nat.nat)
	}
	return false
}

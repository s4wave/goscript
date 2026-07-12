// Generated file based on keygen.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as bigmod from "@goscript/crypto/internal/fips140/bigmod/index.js"

import * as drbg from "@goscript/crypto/internal/fips140/drbg/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as __goscript_pkcs1v15 from "./pkcs1v15.gs.ts"

import * as __goscript_rsa from "./rsa.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/bigmod/index.js"
import "@goscript/crypto/internal/fips140/drbg/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "./pkcs1v15.gs.ts"
import "./rsa.gs.ts"

export class millerRabin {
	public get w(): bigmod.Modulus | $.VarRef<bigmod.Modulus> | null {
		return this._fields.w.value
	}
	public set w(value: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null) {
		this._fields.w.value = value
	}

	public get a(): number {
		return this._fields.a.value
	}
	public set a(value: number) {
		this._fields.a.value = value
	}

	public get m(): $.Slice<number> {
		return this._fields.m.value
	}
	public set m(value: $.Slice<number>) {
		this._fields.m.value = value
	}

	public _fields: {
		w: $.VarRef<bigmod.Modulus | $.VarRef<bigmod.Modulus> | null>
		a: $.VarRef<number>
		m: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{w?: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null, a?: number, m?: $.Slice<number>}>) {
		this._fields = {
			w: $.varRef(init?.w ?? (null as bigmod.Modulus | $.VarRef<bigmod.Modulus> | null)),
			a: $.varRef(init?.a ?? (0 as number)),
			m: $.varRef(init?.m ?? (null as $.Slice<number>))
		}
	}

	public clone(): millerRabin {
		const cloned = new millerRabin()
		cloned._fields = {
			w: $.varRef(this._fields.w.value),
			a: $.varRef(this._fields.a.value),
			m: $.varRef(this._fields.m.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"rsa.millerRabin",
		() => new millerRabin(),
		[],
		millerRabin,
		[{ name: "w", key: "w", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" }, pkgPath: "crypto/internal/fips140/rsa", index: [0], offset: 0, exported: false }, { name: "a", key: "a", type: { kind: $.TypeKind.Basic, name: "uint" }, pkgPath: "crypto/internal/fips140/rsa", index: [1], offset: 8, exported: false }, { name: "m", key: "m", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/rsa", index: [2], offset: 16, exported: false }]
	)
}

export const millerRabinCOMPOSITE: boolean = false

export const millerRabinPOSSIBLYPRIME: boolean = true

export async function GenerateKey(rand: io.Reader | null, bits: number): globalThis.Promise<[__goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null, $.GoError]> {
	if (bits < 32) {
		return [null, errors.New("rsa: key too small")]
	}
	fips140.RecordApproved()
	if ((bits < 2048) || ((bits % 2) == 1)) {
		fips140.RecordNonApproved()
	}

	while (true) {
		let __goscriptTuple0: any = await randomPrime(rand, Math.trunc((bits + 1) / 2))
		let p: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}
		let __goscriptTuple1: any = await randomPrime(rand, Math.trunc(bits / 2))
		let q: $.Slice<number> = __goscriptTuple1[0]
		err = __goscriptTuple1[1]
		if (err != null) {
			return [null, err]
		}

		let __goscriptTuple2: any = bigmod.NewModulus(p)
		let P: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple2[0]
		err = __goscriptTuple2[1]
		if (err != null) {
			return [null, err]
		}
		let __goscriptTuple3: any = bigmod.NewModulus(q)
		let Q: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple3[0]
		err = __goscriptTuple3[1]
		if (err != null) {
			return [null, err]
		}

		if (bigmod.Nat.prototype.Equal.call(bigmod.Nat.prototype.ExpandFor.call(bigmod.Modulus.prototype.Nat.call(Q), P), bigmod.Modulus.prototype.Nat.call(P)) == 1) {
			return [null, errors.New("rsa: generated p == q, random source is broken")]
		}

		let __goscriptTuple4: any = bigmod.NewModulusProduct(p, q)
		let N: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple4[0]
		err = __goscriptTuple4[1]
		if (err != null) {
			return [null, err]
		}
		if (bigmod.Modulus.prototype.BitLen.call(N) != bits) {
			return [null, errors.New("rsa: internal error: modulus size incorrect")]
		}

		// d can be safely computed as e⁻¹ mod φ(N) where φ(N) = (p-1)(q-1), and
		// indeed that's what both the original RSA paper and the pre-FIPS
		// crypto/rsa implementation did.
		//
		// However, FIPS 186-5, A.1.1(3) requires computing it as e⁻¹ mod λ(N)
		// where λ(N) = lcm(p-1, q-1).
		//
		// This makes d smaller by 1.5 bits on average, which is irrelevant both
		// because we exclusively use the CRT for private operations and because
		// we use constant time windowed exponentiation. On the other hand, it
		// requires computing a GCD of two values that are not coprime, and then
		// a division, both complex variable-time operations.
		let __goscriptTuple5: any = totient(P, Q)
		let _u3bb: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple5[0]
		err = __goscriptTuple5[1]
		if ($.comparableEqual(err, errDivisorTooLarge)) {
			// The divisor is too large, try again with different primes.
			continue
		}
		if (err != null) {
			return [null, err]
		}

		let e: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.SetUint.call(bigmod.NewNat(), 65537)
		let __goscriptTuple6: any = bigmod.Nat.prototype.InverseVarTime.call(bigmod.NewNat(), e, _u3bb)
		let d: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple6[0]
		let ok = __goscriptTuple6[1]
		if (!ok) {
			// This checks that GCD(e, lcm(p-1, q-1)) = 1, which is equivalent
			// to checking GCD(e, p-1) = 1 and GCD(e, q-1) = 1 separately in
			// FIPS 186-5, Appendix A.1.3, steps 4.5 and 5.6.
			//
			// We waste a prime by retrying the whole process, since 65537 is
			// probably only a factor of one of p-1 or q-1, but the probability
			// of this check failing is only 1/65537, so it doesn't matter.
			continue
		}

		if (bigmod.Nat.prototype.IsOne.call(bigmod.Nat.prototype.Mul.call(bigmod.Nat.prototype.ExpandFor.call(e, _u3bb), d, _u3bb)) == 0) {
			return [null, errors.New("rsa: internal error: e*d != 1 mod λ(N)")]
		}

		// FIPS 186-5, A.1.1(3) requires checking that d > 2^(nlen / 2).
		//
		// The probability of this check failing when d is derived from
		// (e, p, q) is roughly
		//
		//   2^(nlen/2) / 2^nlen = 2^(-nlen/2)
		//
		// so less than 2⁻¹²⁸ for keys larger than 256 bits.
		//
		// We still need to check to comply with FIPS 186-5, but knowing it has
		// negligible chance of failure we can defer the check to the end of key
		// generation and return an error if it fails. See [checkPrivateKey].

		let __goscriptTuple7: any = __goscript_rsa.newPrivateKey(N, 65537, d, P, Q)
		let k: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null = __goscriptTuple7[0]
		err = __goscriptTuple7[1]
		if (err != null) {
			return [null, err]
		}

		if ($.pointerValue<__goscript_rsa.PrivateKey>(k).fipsApproved) {
			await fips140.PCT("RSA sign and verify PCT", $.functionValue((): $.GoError => {
				let hash: $.Slice<number> = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]) as $.Slice<number>
				let __goscriptTuple8: any = __goscript_pkcs1v15.signPKCS1v15(k, "SHA-256", hash)
				let sig: $.Slice<number> = __goscriptTuple8[0]
				let __goscriptShadow0 = __goscriptTuple8[1]
				if (__goscriptShadow0 != null) {
					return __goscriptShadow0
				}
				return __goscript_pkcs1v15.verifyPKCS1v15(__goscript_rsa.PrivateKey.prototype.PublicKey.call(k), "SHA-256", hash, sig)
			}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
		}

		return [k, null]
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export let errDivisorTooLarge: $.GoError = errors.New("divisor too large")

export function __goscript_set_errDivisorTooLarge(__goscriptValue: $.GoError): void {
	errDivisorTooLarge = __goscriptValue
}

export function totient(p: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null, q: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null): [bigmod.Modulus | $.VarRef<bigmod.Modulus> | null, $.GoError] {
	let a: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.SubOne.call(bigmod.Modulus.prototype.Nat.call(p), p)
	let b: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.SubOne.call(bigmod.Modulus.prototype.Nat.call(q), q)

	// lcm(a, b) = a×b / gcd(a, b) = a × (b / gcd(a, b))

	// Our GCD requires at least one of the numbers to be odd. For LCM we only
	// need to preserve the larger prime power of each prime factor, so we can
	// right-shift the number with the fewest trailing zeros until it's odd.
	// For odd a, b and m >= n, lcm(a×2ᵐ, b×2ⁿ) = lcm(a×2ᵐ, b).
	let az = bigmod.Nat.prototype.TrailingZeroBitsVarTime.call(a)
	let bz = bigmod.Nat.prototype.TrailingZeroBitsVarTime.call(b)
	if (az < bz) {
		a = bigmod.Nat.prototype.ShiftRightVarTime.call(a, az)
	} else {
		b = bigmod.Nat.prototype.ShiftRightVarTime.call(b, bz)
	}

	let __goscriptTuple9: any = bigmod.Nat.prototype.GCDVarTime.call(bigmod.NewNat(), a, b)
	let gcd: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple9[0]
	let err = __goscriptTuple9[1]
	if (err != null) {
		return [null, err]
	}
	if (bigmod.Nat.prototype.IsOdd.call(gcd) == 0) {
		return [null, errors.New("rsa: internal error: gcd(a, b) is even")]
	}

	// To avoid implementing multiple-precision division, we just try again if
	// the divisor doesn't fit in a single word. This would have a chance of
	// 2⁻⁶⁴ on 64-bit platforms, and 2⁻³² on 32-bit platforms, but testing 2⁻⁶⁴
	// edge cases is impractical, and we'd rather not behave differently on
	// different platforms, so we reject divisors above 2³²-1.
	if (bigmod.Nat.prototype.BitLenVarTime.call(gcd) > 32) {
		return [null, errDivisorTooLarge]
	}
	if ((bigmod.Nat.prototype.IsZero.call(gcd) == 1) || ($.arrayIndex(bigmod.Nat.prototype.Bits.call(gcd)!, 0) == 0)) {
		return [null, errors.New("rsa: internal error: gcd(a, b) is zero")]
	}
	{
		let rem = bigmod.Nat.prototype.DivShortVarTime.call(b, $.arrayIndex(bigmod.Nat.prototype.Bits.call(gcd)!, 0))
		if (rem != 0) {
			return [null, errors.New("rsa: internal error: b is not divisible by gcd(a, b)")]
		}
	}

	return bigmod.NewModulusProduct(bigmod.Nat.prototype.Bytes.call(a, p), bigmod.Nat.prototype.Bytes.call(b, q))
}

export async function randomPrime(rand: io.Reader | null, bits: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	if (bits < 16) {
		return [null, errors.New("rsa: prime size must be at least 16 bits")]
	}

	let b: $.Slice<number> = $.makeSlice<number>(Math.trunc((bits + 7) / 8), undefined, "byte")
	while (true) {
		{
			let err = await drbg.ReadWithReader(rand, b)
			if (err != null) {
				return [null, err]
			}
		}
		// Clear the most significant bits to reach the desired size. We use a
		// mask rather than right-shifting b[0] to make it easier to inject test
		// candidates, which can be represented as simple big-endian integers.
		let excess = ($.len(b) * 8) - bits
		b![0] = b![0] & ($.uint($.uintShr(0b1111_1111, excess, 8), 8))

		// Don't let the value be too small: set the most significant two bits.
		// Setting the top two bits, rather than just the top bit, means that
		// when two of these values are multiplied together, the result isn't
		// ever one bit short.
		if (excess < 7) {
			b![0] = b![0] | ($.uint($.uintShr(0b1100_0000, excess, 8), 8))
		} else {
			b![0] = b![0] | ($.uint(0b0000_0001, 8))
			b![1] = b![1] | ($.uint(0b1000_0000, 8))
		}

		// Make the value odd since an even number certainly isn't prime.
		b![$.len(b) - 1] = b![$.len(b) - 1] | ($.uint(1, 8))

		// We don't need to check for p >= √2 × 2^(bits-1) (steps 4.4 and 5.4)
		// because we set the top two bits above, so
		//
		//   p > 2^(bits-1) + 2^(bits-2) = 3⁄2 × 2^(bits-1) > √2 × 2^(bits-1)
		//

		// Step 5.5 requires checking that |p - q| > 2^(nlen/2 - 100).
		//
		// The probability of |p - q| ≤ k where p and q are uniformly random in
		// the range (a, b) is 1 - (b-a-k)^2 / (b-a)^2, so the probability of
		// this check failing during key generation is 2⁻⁹⁷.
		//
		// We still need to check to comply with FIPS 186-5, but knowing it has
		// negligible chance of failure we can defer the check to the end of key
		// generation and return an error if it fails. See [checkPrivateKey].

		if (await isPrime(b)) {
			return [b, null]
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function isPrime(w: $.Slice<number>): globalThis.Promise<boolean> {
	let __goscriptTuple10: any = millerRabinSetup(w)
	let mr: millerRabin | $.VarRef<millerRabin> | null = __goscriptTuple10[0]
	let err = __goscriptTuple10[1]
	if (err != null) {
		// w is zero, one, or even.
		return false
	}

	// Before Miller-Rabin, rule out most composites with trial divisions.
	for (let i = 0; i < $.len(primes); i = i + (3)) {
		let p1 = $.arrayIndex(primes!, i)
		let p2 = $.arrayIndex(primes!, i + 1)
		let p3 = $.arrayIndex(primes!, i + 2)
		let r = bigmod.Nat.prototype.DivShortVarTime.call(bigmod.Modulus.prototype.Nat.call($.pointerValue<millerRabin>(mr).w), $.uint($.uint64Mul(($.uint($.uint64Mul(p1, p2), 64)), p3), 64))
		if (((($.uint($.uint64Mod(r, p1), 64)) == 0) || (($.uint($.uint64Mod(r, p2), 64)) == 0)) || (($.uint($.uint64Mod(r, p3), 64)) == 0)) {
			return false
		}
	}

	// iterations is the number of Miller-Rabin rounds, each with a
	// randomly-selected base.
	//
	// The worst case false positive rate for a single iteration is 1/4 per
	// https://eprint.iacr.org/2018/749, so if w were selected adversarially, we
	// would need up to 64 iterations to get to a negligible (2⁻¹²⁸) chance of
	// false positive.
	//
	// However, since this function is only used for randomly-selected w in the
	// context of RSA key generation, we can use a smaller number of iterations.
	// The exact number depends on the size of the prime (and the implied
	// security level). See BoringSSL for the full formula.
	// https://cs.opensource.google/boringssl/boringssl/+/master:crypto/fipsmodule/bn/prime.c.inc;l=208-283;drc=3a138e43
	let bits = bigmod.Modulus.prototype.BitLen.call($.pointerValue<millerRabin>(mr).w)
	let iterations: number = 0
	switch (true) {
		case bits >= 3747:
		{
			iterations = 3
			break
		}
		case bits >= 1345:
		{
			iterations = 4
			break
		}
		case bits >= 476:
		{
			iterations = 5
			break
		}
		case bits >= 400:
		{
			iterations = 6
			break
		}
		case bits >= 347:
		{
			iterations = 7
			break
		}
		case bits >= 308:
		{
			iterations = 8
			break
		}
		case bits >= 55:
		{
			iterations = 27
			break
		}
		default:
		{
			iterations = 34
			break
		}
	}

	let b: $.Slice<number> = $.makeSlice<number>(Math.trunc((bits + 7) / 8), undefined, "byte")
	while (true) {
		await drbg.Read(b)
		let excess = ($.len(b) * 8) - bits
		b![0] = b![0] & ($.uint($.uintShr(0b1111_1111, excess, 8), 8))
		let [result, __goscriptShadow1] = millerRabinIteration(mr, b)
		if (__goscriptShadow1 != null) {
			// b was rejected.
			continue
		}
		if (result == false) {
			return false
		}
		iterations--
		if (iterations == 0) {
			return true
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export let primes: $.Slice<number> = $.arrayToSlice<number>([3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223, 1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511, 1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619])

export function __goscript_set_primes(__goscriptValue: $.Slice<number>): void {
	primes = __goscriptValue
}

export function millerRabinSetup(w: $.Slice<number>): [millerRabin | $.VarRef<millerRabin> | null, $.GoError] {
	let mr: millerRabin | $.VarRef<millerRabin> | null = new millerRabin()

	// Check that w is odd, and precompute Montgomery parameters.
	let __goscriptTuple11: any = bigmod.NewModulus(w)
	let wm: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple11[0]
	let err = __goscriptTuple11[1]
	if (err != null) {
		return [null, err]
	}
	if (bigmod.Nat.prototype.IsOdd.call(bigmod.Modulus.prototype.Nat.call(wm)) == 0) {
		return [null, errors.New("candidate is even")]
	}
	$.pointerValue<millerRabin>(mr).w = wm

	// Compute m = (w-1)/2^a, where m is odd.
	let wMinus1: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.SubOne.call(bigmod.Modulus.prototype.Nat.call($.pointerValue<millerRabin>(mr).w), $.pointerValue<millerRabin>(mr).w)
	if (bigmod.Nat.prototype.IsZero.call(wMinus1) == 1) {
		return [null, errors.New("candidate is one")]
	}
	$.pointerValue<millerRabin>(mr).a = bigmod.Nat.prototype.TrailingZeroBitsVarTime.call(wMinus1)

	// Store mr.m as a big-endian byte slice with leading zero bytes removed,
	// for use with [bigmod.Nat.Exp].
	let m: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.ShiftRightVarTime.call(wMinus1, $.pointerValue<millerRabin>(mr).a)
	$.pointerValue<millerRabin>(mr).m = bigmod.Nat.prototype.Bytes.call(m, $.pointerValue<millerRabin>(mr).w)
	while ($.uint($.arrayIndex($.pointerValue<millerRabin>(mr).m!, 0), 8) == $.uint(0, 8)) {
		$.pointerValue<millerRabin>(mr).m = $.goSlice($.pointerValue<millerRabin>(mr).m, 1, undefined)
	}

	return [mr, null]
}

export function millerRabinIteration(mr: millerRabin | $.VarRef<millerRabin> | null, bb: $.Slice<number>): [boolean, $.GoError] {
	// Reject b ≤ 1 or b ≥ w − 1.
	if ($.len(bb) != (Math.trunc((bigmod.Modulus.prototype.BitLen.call($.pointerValue<millerRabin>(mr).w) + 7) / 8))) {
		return [false, errors.New("incorrect length")]
	}
	let b: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.NewNat()
	{
		let [, err] = bigmod.Nat.prototype.SetBytes.call(b, bb, $.pointerValue<millerRabin>(mr).w)
		if (err != null) {
			return [false, err]
		}
	}
	if (((bigmod.Nat.prototype.IsZero.call(b) == 1) || (bigmod.Nat.prototype.IsOne.call(b) == 1)) || (bigmod.Nat.prototype.IsMinusOne.call(b, $.pointerValue<millerRabin>(mr).w) == 1)) {
		return [false, errors.New("out-of-range candidate")]
	}

	// Compute b^(m*2^i) mod w for successive i.
	// If b^m mod w = 1, b is a possible prime.
	// If b^(m*2^i) mod w = -1 for some 0 <= i < a, b is a possible prime.
	// Otherwise b is composite.

	// Start by computing and checking b^m mod w (also the i = 0 case).
	let z: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.Exp.call(bigmod.NewNat(), b, $.pointerValue<millerRabin>(mr).m, $.pointerValue<millerRabin>(mr).w)
	if ((bigmod.Nat.prototype.IsOne.call(z) == 1) || (bigmod.Nat.prototype.IsMinusOne.call(z, $.pointerValue<millerRabin>(mr).w) == 1)) {
		return [true, null]
	}

	// Check b^(m*2^i) mod w = -1 for 0 < i < a.
	for (let __rangeIndex = 0; __rangeIndex < $.uint($.uint64Sub($.pointerValue<millerRabin>(mr).a, 1n), 64); __rangeIndex++) {
		bigmod.Nat.prototype.Mul.call(z, z, $.pointerValue<millerRabin>(mr).w)
		if (bigmod.Nat.prototype.IsMinusOne.call(z, $.pointerValue<millerRabin>(mr).w) == 1) {
			return [true, null]
		}
		if (bigmod.Nat.prototype.IsOne.call(z) == 1) {
			// Future squaring will not turn z == 1 into -1.
			break
		}
	}

	return [false, null]
}

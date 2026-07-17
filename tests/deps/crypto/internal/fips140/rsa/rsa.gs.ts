// Generated file based on rsa.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as bigmod from "@goscript/crypto/internal/fips140/bigmod/index.js"

import * as errors from "@goscript/errors/index.js"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/bigmod/index.js"
import "@goscript/errors/index.js"

export class PublicKey {
	public get N(): bigmod.Modulus | $.VarRef<bigmod.Modulus> | null {
		return this._fields.N.value
	}
	public set N(value: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null) {
		this._fields.N.value = value
	}

	public get E(): number {
		return this._fields.E.value
	}
	public set E(value: number) {
		this._fields.E.value = value
	}

	public _fields: {
		N: $.VarRef<bigmod.Modulus | $.VarRef<bigmod.Modulus> | null>
		E: $.VarRef<number>
	}

	constructor(init?: Partial<{N?: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null, E?: number}>) {
		this._fields = {
			N: $.varRef(init?.N ?? (null! as bigmod.Modulus | $.VarRef<bigmod.Modulus> | null)),
			E: $.varRef(init?.E ?? (0 as number))
		}
	}

	public clone(): PublicKey {
		const cloned = new PublicKey()
		cloned._fields = {
			N: $.varRef(this._fields.N.value),
			E: $.varRef(this._fields.E.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Size(): number {
		const pub: PublicKey | $.VarRef<PublicKey> | null = this
		return Math.trunc((bigmod.Modulus.prototype.BitLen.call($.pointerValue<PublicKey>(pub).N) + 7) / 8)
	}

	static __typeInfo = $.registerStructType(
		"rsa.PublicKey",
		() => new PublicKey(),
		[{ name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		PublicKey,
		[{ name: "N", key: "N", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" }, index: [0], offset: 0, exported: true }, { name: "E", key: "E", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 8, exported: true }]
	)
}

export class PrivateKey {
	// pub has already been checked with checkPublicKey.
	public get pub(): PublicKey {
		return this._fields.pub.value
	}
	public set pub(value: PublicKey) {
		this._fields.pub.value = value
	}

	public get d(): bigmod.Nat | $.VarRef<bigmod.Nat> | null {
		return this._fields.d.value
	}
	public set d(value: bigmod.Nat | $.VarRef<bigmod.Nat> | null) {
		this._fields.d.value = value
	}

	// The following values are not set for deprecated multi-prime keys.
	//
	// Since they are always set for keys in FIPS mode, for SP 800-56B Rev. 2
	// purposes we always use the Chinese Remainder Theorem (CRT) format.
	public get p(): bigmod.Modulus | $.VarRef<bigmod.Modulus> | null {
		return this._fields.p.value
	}
	public set p(value: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null) {
		this._fields.p.value = value
	}

	// The following values are not set for deprecated multi-prime keys.
	//
	// Since they are always set for keys in FIPS mode, for SP 800-56B Rev. 2
	// purposes we always use the Chinese Remainder Theorem (CRT) format.
	public get q(): bigmod.Modulus | $.VarRef<bigmod.Modulus> | null {
		return this._fields.q.value
	}
	public set q(value: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null) {
		this._fields.q.value = value
	}

	// dP and dQ are used as exponents, so we store them as big-endian byte
	// slices to be passed to [bigmod.Nat.Exp].
	public get dP(): $.Slice<number> {
		return this._fields.dP.value
	}
	public set dP(value: $.Slice<number>) {
		this._fields.dP.value = value
	}

	public get dQ(): $.Slice<number> {
		return this._fields.dQ.value
	}
	public set dQ(value: $.Slice<number>) {
		this._fields.dQ.value = value
	}

	public get qInv(): bigmod.Nat | $.VarRef<bigmod.Nat> | null {
		return this._fields.qInv.value
	}
	public set qInv(value: bigmod.Nat | $.VarRef<bigmod.Nat> | null) {
		this._fields.qInv.value = value
	}

	// fipsApproved is false if this key does not comply with FIPS 186-5 or
	// SP 800-56B Rev. 2.
	public get fipsApproved(): boolean {
		return this._fields.fipsApproved.value
	}
	public set fipsApproved(value: boolean) {
		this._fields.fipsApproved.value = value
	}

	public _fields: {
		pub: $.VarRef<PublicKey>
		d: $.VarRef<bigmod.Nat | $.VarRef<bigmod.Nat> | null>
		p: $.VarRef<bigmod.Modulus | $.VarRef<bigmod.Modulus> | null>
		q: $.VarRef<bigmod.Modulus | $.VarRef<bigmod.Modulus> | null>
		dP: $.VarRef<$.Slice<number>>
		dQ: $.VarRef<$.Slice<number>>
		qInv: $.VarRef<bigmod.Nat | $.VarRef<bigmod.Nat> | null>
		fipsApproved: $.VarRef<boolean>
	}

	constructor(init?: Partial<{pub?: PublicKey, d?: bigmod.Nat | $.VarRef<bigmod.Nat> | null, p?: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null, q?: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null, dP?: $.Slice<number>, dQ?: $.Slice<number>, qInv?: bigmod.Nat | $.VarRef<bigmod.Nat> | null, fipsApproved?: boolean}>) {
		this._fields = {
			pub: $.varRef(init?.pub ? $.markAsStructValue($.cloneStructValue(init.pub)) : $.markAsStructValue(new PublicKey())),
			d: $.varRef(init?.d ?? (null! as bigmod.Nat | $.VarRef<bigmod.Nat> | null)),
			p: $.varRef(init?.p ?? (null! as bigmod.Modulus | $.VarRef<bigmod.Modulus> | null)),
			q: $.varRef(init?.q ?? (null! as bigmod.Modulus | $.VarRef<bigmod.Modulus> | null)),
			dP: $.varRef(init?.dP ?? (null! as $.Slice<number>)),
			dQ: $.varRef(init?.dQ ?? (null! as $.Slice<number>)),
			qInv: $.varRef(init?.qInv ?? (null! as bigmod.Nat | $.VarRef<bigmod.Nat> | null)),
			fipsApproved: $.varRef(init?.fipsApproved ?? (false as boolean))
		}
	}

	public clone(): PrivateKey {
		const cloned = new PrivateKey()
		cloned._fields = {
			pub: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.pub.value))),
			d: $.varRef(this._fields.d.value),
			p: $.varRef(this._fields.p.value),
			q: $.varRef(this._fields.q.value),
			dP: $.varRef(this._fields.dP.value),
			dQ: $.varRef(this._fields.dQ.value),
			qInv: $.varRef(this._fields.qInv.value),
			fipsApproved: $.varRef(this._fields.fipsApproved.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Export(): [$.Slice<number>, number, $.Slice<number>, $.Slice<number>, $.Slice<number>, $.Slice<number>, $.Slice<number>, $.Slice<number>] {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		let N: $.Slice<number> = null! as $.Slice<number>
		let e: number = 0
		let d: $.Slice<number> = null! as $.Slice<number>
		let P: $.Slice<number> = null! as $.Slice<number>
		let Q: $.Slice<number> = null! as $.Slice<number>
		let dP: $.Slice<number> = null! as $.Slice<number>
		let dQ: $.Slice<number> = null! as $.Slice<number>
		let qInv: $.Slice<number> = null! as $.Slice<number>
		N = bigmod.Nat.prototype.Bytes.call(bigmod.Modulus.prototype.Nat.call($.pointerValue<PrivateKey>(priv).pub.N), $.pointerValue<PrivateKey>(priv).pub.N)
		e = $.pointerValue<PrivateKey>(priv).pub.E
		d = bigmod.Nat.prototype.Bytes.call($.pointerValue<PrivateKey>(priv).d, $.pointerValue<PrivateKey>(priv).pub.N)
		if ($.pointerValue<PrivateKey>(priv).dP == null) {
			return [N, e, d, P, Q, dP, dQ, qInv]
		}
		P = bigmod.Nat.prototype.Bytes.call(bigmod.Modulus.prototype.Nat.call($.pointerValue<PrivateKey>(priv).p), $.pointerValue<PrivateKey>(priv).p)
		Q = bigmod.Nat.prototype.Bytes.call(bigmod.Modulus.prototype.Nat.call($.pointerValue<PrivateKey>(priv).q), $.pointerValue<PrivateKey>(priv).q)
		dP = bytes.Clone($.pointerValue<PrivateKey>(priv).dP)
		dQ = bytes.Clone($.pointerValue<PrivateKey>(priv).dQ)
		qInv = bigmod.Nat.prototype.Bytes.call($.pointerValue<PrivateKey>(priv).qInv, $.pointerValue<PrivateKey>(priv).p)
		return [N, e, d, P, Q, dP, dQ, qInv]
	}

	public PublicKey(): PublicKey | $.VarRef<PublicKey> | null {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		return $.pointerValue<PrivateKey>(priv)._fields.pub
	}

	static __typeInfo = $.registerStructType(
		"rsa.PrivateKey",
		() => new PrivateKey(),
		[{ name: "Export", args: [], returns: [{ name: "N", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "e", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "d", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "P", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "Q", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "dP", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "dQ", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "qInv", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "PublicKey", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" } }] }],
		PrivateKey,
		[{ name: "pub", key: "pub", type: "rsa.PublicKey", pkgPath: "crypto/internal/fips140/rsa", index: [0], offset: 0, exported: false }, { name: "d", key: "d", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" }, pkgPath: "crypto/internal/fips140/rsa", index: [1], offset: 16, exported: false }, { name: "p", key: "p", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" }, pkgPath: "crypto/internal/fips140/rsa", index: [2], offset: 24, exported: false }, { name: "q", key: "q", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Modulus" }, pkgPath: "crypto/internal/fips140/rsa", index: [3], offset: 32, exported: false }, { name: "dP", key: "dP", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/rsa", index: [4], offset: 40, exported: false }, { name: "dQ", key: "dQ", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/rsa", index: [5], offset: 64, exported: false }, { name: "qInv", key: "qInv", type: { kind: $.TypeKind.Pointer, elemType: "bigmod.Nat" }, pkgPath: "crypto/internal/fips140/rsa", index: [6], offset: 88, exported: false }, { name: "fipsApproved", key: "fipsApproved", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/internal/fips140/rsa", index: [7], offset: 96, exported: false }]
	)
}

export const withCheck: boolean = true

export const noCheck: boolean = false

export function NewPrivateKey(N: $.Slice<number>, e: number, d: $.Slice<number>, P: $.Slice<number>, Q: $.Slice<number>): [PrivateKey | $.VarRef<PrivateKey> | null, $.GoError] {
	let __goscriptTuple0: any = bigmod.NewModulus(N)
	let n: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple1: any = bigmod.NewModulus(P)
	let p: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple2: any = bigmod.NewModulus(Q)
	let q: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple3: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), d, n)
	let dN: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	if (err != null) {
		return [null, err]
	}
	return newPrivateKey(n, e, dN, p, q)
}

export function newPrivateKey(n: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null, e: number, d: bigmod.Nat | $.VarRef<bigmod.Nat> | null, p: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null, q: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null): [PrivateKey | $.VarRef<PrivateKey> | null, $.GoError] {
	let pMinusOne: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.SubOne.call(bigmod.Modulus.prototype.Nat.call(p), p)
	let __goscriptTuple4: any = bigmod.NewModulus(bigmod.Nat.prototype.Bytes.call(pMinusOne, p))
	let pMinusOneMod: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple4[0]
	let err = __goscriptTuple4[1]
	if (err != null) {
		return [null, err]
	}
	let dP: $.Slice<number> = bigmod.Nat.prototype.Bytes.call(bigmod.Nat.prototype.Mod.call(bigmod.NewNat(), d, pMinusOneMod), pMinusOneMod)

	let qMinusOne: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.SubOne.call(bigmod.Modulus.prototype.Nat.call(q), q)
	let __goscriptTuple5: any = bigmod.NewModulus(bigmod.Nat.prototype.Bytes.call(qMinusOne, q))
	let qMinusOneMod: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple5[0]
	err = __goscriptTuple5[1]
	if (err != null) {
		return [null, err]
	}
	let dQ: $.Slice<number> = bigmod.Nat.prototype.Bytes.call(bigmod.Nat.prototype.Mod.call(bigmod.NewNat(), d, qMinusOneMod), qMinusOneMod)

	// Constant-time modular inversion with prime modulus by Fermat's Little
	// Theorem: qInv = q⁻¹ mod p = q^(p-2) mod p.
	if (bigmod.Nat.prototype.IsOdd.call(bigmod.Modulus.prototype.Nat.call(p)) == 0) {
		// [bigmod.Nat.Exp] requires an odd modulus.
		return [null, errors.New("crypto/rsa: p is even")]
	}
	let pMinusTwo: $.Slice<number> = bigmod.Nat.prototype.Bytes.call(bigmod.Nat.prototype.SubOne.call(bigmod.Nat.prototype.SubOne.call(bigmod.Modulus.prototype.Nat.call(p), p), p), p)
	let qInv: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.Mod.call(bigmod.NewNat(), bigmod.Modulus.prototype.Nat.call(q), p)
	bigmod.Nat.prototype.Exp.call(qInv, qInv, pMinusTwo, p)

	let pk: PrivateKey | $.VarRef<PrivateKey> | null = new PrivateKey({pub: $.markAsStructValue(new PublicKey({N: n, E: e})), d: d, p: p, q: q, dP: dP, dQ: dQ, qInv: qInv})
	{
		let __goscriptShadow0 = checkPrivateKey(pk)
		if (__goscriptShadow0 != null) {
			return [null, __goscriptShadow0]
		}
	}
	return [pk, null]
}

export function NewPrivateKeyWithPrecomputation(N: $.Slice<number>, e: number, d: $.Slice<number>, P: $.Slice<number>, Q: $.Slice<number>, dP: $.Slice<number>, dQ: $.Slice<number>, qInv: $.Slice<number>): [PrivateKey | $.VarRef<PrivateKey> | null, $.GoError] {
	let __goscriptTuple6: any = bigmod.NewModulus(N)
	let n: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple6[0]
	let err = __goscriptTuple6[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple7: any = bigmod.NewModulus(P)
	let p: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple7[0]
	err = __goscriptTuple7[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple8: any = bigmod.NewModulus(Q)
	let q: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple8[0]
	err = __goscriptTuple8[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple9: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), d, n)
	let dN: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple9[0]
	err = __goscriptTuple9[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple10: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), qInv, p)
	let qInvNat: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple10[0]
	err = __goscriptTuple10[1]
	if (err != null) {
		return [null, err]
	}

	let pk: PrivateKey | $.VarRef<PrivateKey> | null = new PrivateKey({pub: $.markAsStructValue(new PublicKey({N: n, E: e})), d: dN, p: p, q: q, dP: dP, dQ: dQ, qInv: qInvNat})
	{
		let __goscriptShadow1 = checkPrivateKey(pk)
		if (__goscriptShadow1 != null) {
			return [null, __goscriptShadow1]
		}
	}
	return [pk, null]
}

export function NewPrivateKeyWithoutCRT(N: $.Slice<number>, e: number, d: $.Slice<number>): [PrivateKey | $.VarRef<PrivateKey> | null, $.GoError] {
	let __goscriptTuple11: any = bigmod.NewModulus(N)
	let n: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple11[0]
	let err = __goscriptTuple11[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple12: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), d, n)
	let dN: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple12[0]
	err = __goscriptTuple12[1]
	if (err != null) {
		return [null, err]
	}
	let pk: PrivateKey | $.VarRef<PrivateKey> | null = new PrivateKey({pub: $.markAsStructValue(new PublicKey({N: n, E: e})), d: dN})
	{
		let __goscriptShadow2 = checkPrivateKey(pk)
		if (__goscriptShadow2 != null) {
			return [null, __goscriptShadow2]
		}
	}
	return [pk, null]
}

export function checkPrivateKey(priv: PrivateKey | $.VarRef<PrivateKey> | null): $.GoError {
	$.pointerValue<PrivateKey>(priv).fipsApproved = true

	{
		let [fipsApproved, err] = checkPublicKey($.pointerValue<PrivateKey>(priv)._fields.pub)
		if (err != null) {
			return err
		} else {
			if (!fipsApproved) {
				$.pointerValue<PrivateKey>(priv).fipsApproved = false
			}
		}
	}

	if ($.pointerValue<PrivateKey>(priv).dP == null) {
		// Legacy and deprecated multi-prime keys.
		$.pointerValue<PrivateKey>(priv).fipsApproved = false
		return null
	}

	let N: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = $.pointerValue<PrivateKey>(priv).pub.N
	let p: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = $.pointerValue<PrivateKey>(priv).p
	let q: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = $.pointerValue<PrivateKey>(priv).q

	// FIPS 186-5, Section 5.1 requires "that p and q be of the same bit length."
	if (bigmod.Modulus.prototype.BitLen.call(p) != bigmod.Modulus.prototype.BitLen.call(q)) {
		$.pointerValue<PrivateKey>(priv).fipsApproved = false
	}

	// Check that pq ≡ 1 mod N (and that p < N and q < N).
	let pN: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.ExpandFor.call(bigmod.NewNat(), N)
	{
		let [, err] = bigmod.Nat.prototype.SetBytes.call(pN, bigmod.Nat.prototype.Bytes.call(bigmod.Modulus.prototype.Nat.call(p), p), N)
		if (err != null) {
			return errors.New("crypto/rsa: invalid prime")
		}
	}
	let qN: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.ExpandFor.call(bigmod.NewNat(), N)
	{
		let [, err] = bigmod.Nat.prototype.SetBytes.call(qN, bigmod.Nat.prototype.Bytes.call(bigmod.Modulus.prototype.Nat.call(q), q), N)
		if (err != null) {
			return errors.New("crypto/rsa: invalid prime")
		}
	}
	if (bigmod.Nat.prototype.IsZero.call(bigmod.Nat.prototype.Mul.call(pN, qN, N)) != 1) {
		return errors.New("crypto/rsa: p * q != n")
	}

	// Check that de ≡ 1 mod p-1, and de ≡ 1 mod q-1.
	//
	// This implies that e is coprime to each p-1 as e has a multiplicative
	// inverse. Therefore e is coprime to lcm(p-1,q-1) = λ(N).
	// It also implies that a^de ≡ a mod p as a^(p-1) ≡ 1 mod p. Thus a^de ≡ a
	// mod n for all a coprime to n, as required.
	//
	// This checks dP, dQ, and e.
	let __goscriptTuple13: any = bigmod.NewModulus(bigmod.Nat.prototype.Bytes.call(bigmod.Nat.prototype.SubOne.call(bigmod.Modulus.prototype.Nat.call(p), p), p))
	let pMinus1: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple13[0]
	let err = __goscriptTuple13[1]
	if (err != null) {
		return errors.New("crypto/rsa: invalid prime")
	}
	let __goscriptTuple14: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), $.pointerValue<PrivateKey>(priv).dP, pMinus1)
	let dP: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple14[0]
	err = __goscriptTuple14[1]
	if (err != null) {
		return errors.New("crypto/rsa: invalid CRT exponent")
	}
	let de: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.NewNat()
	bigmod.Nat.prototype.ExpandFor.call(bigmod.Nat.prototype.SetUint.call(de, $.uint($.pointerValue<PrivateKey>(priv).pub.E, 64)), pMinus1)
	bigmod.Nat.prototype.Mul.call(de, dP, pMinus1)
	if (bigmod.Nat.prototype.IsOne.call(de) != 1) {
		return errors.New("crypto/rsa: invalid CRT exponent")
	}

	let __goscriptTuple15: any = bigmod.NewModulus(bigmod.Nat.prototype.Bytes.call(bigmod.Nat.prototype.SubOne.call(bigmod.Modulus.prototype.Nat.call(q), q), q))
	let qMinus1: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple15[0]
	err = __goscriptTuple15[1]
	if (err != null) {
		return errors.New("crypto/rsa: invalid prime")
	}
	let __goscriptTuple16: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), $.pointerValue<PrivateKey>(priv).dQ, qMinus1)
	let dQ: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple16[0]
	err = __goscriptTuple16[1]
	if (err != null) {
		return errors.New("crypto/rsa: invalid CRT exponent")
	}
	bigmod.Nat.prototype.ExpandFor.call(bigmod.Nat.prototype.SetUint.call(de, $.uint($.pointerValue<PrivateKey>(priv).pub.E, 64)), qMinus1)
	bigmod.Nat.prototype.Mul.call(de, dQ, qMinus1)
	if (bigmod.Nat.prototype.IsOne.call(de) != 1) {
		return errors.New("crypto/rsa: invalid CRT exponent")
	}

	// Check that qInv * q ≡ 1 mod p.
	let __goscriptTuple17: any = bigmod.Nat.prototype.SetOverflowingBytes.call(bigmod.NewNat(), bigmod.Nat.prototype.Bytes.call(bigmod.Modulus.prototype.Nat.call(q), q), p)
	let qP: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple17[0]
	err = __goscriptTuple17[1]
	if (err != null) {
		// q >= 2^⌈log2(p)⌉
		qP = bigmod.Nat.prototype.Mod.call(bigmod.NewNat(), bigmod.Modulus.prototype.Nat.call(q), p)
	}
	if (bigmod.Nat.prototype.IsOne.call(bigmod.Nat.prototype.Mul.call(qP, $.pointerValue<PrivateKey>(priv).qInv, p)) != 1) {
		return errors.New("crypto/rsa: invalid CRT coefficient")
	}

	// Check d against dP and dQ, even though we never actually use d,
	// to make sure the key is consistent.
	let dP1: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.Mod.call(bigmod.NewNat(), $.pointerValue<PrivateKey>(priv).d, pMinus1)
	if (bigmod.Nat.prototype.Equal.call(dP1, dP) != 1) {
		return errors.New("crypto/rsa: d does not match dP")
	}
	let dQ1: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.Mod.call(bigmod.NewNat(), $.pointerValue<PrivateKey>(priv).d, qMinus1)
	if (bigmod.Nat.prototype.Equal.call(dQ1, dQ) != 1) {
		return errors.New("crypto/rsa: d does not match dQ")
	}

	// Check that |p - q| > 2^(nlen/2 - 100).
	//
	// If p and q are very close to each other, then N=pq can be trivially
	// factored using Fermat's factorization method. Broken RSA implementations
	// do generate such keys. See Hanno Böck, Fermat Factorization in the Wild,
	// https://eprint.iacr.org/2023/026.pdf.
	let diff: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.NewNat()
	{
		let __goscriptTuple18: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), bigmod.Nat.prototype.Bytes.call(bigmod.Modulus.prototype.Nat.call(q), q), p)
		let __goscriptShadow3: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple18[0]
		let __goscriptShadow4 = __goscriptTuple18[1]
		if (__goscriptShadow4 != null) {
			// q > p
			let __goscriptTuple19: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), bigmod.Nat.prototype.Bytes.call(bigmod.Modulus.prototype.Nat.call(p), p), q)
			let pQ: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple19[0]
			let __goscriptShadow5 = __goscriptTuple19[1]
			if (__goscriptShadow5 != null) {
				return errors.New("crypto/rsa: p == q")
			}
			// diff = 0 - p mod q = q - p
			bigmod.Nat.prototype.Sub.call(bigmod.Nat.prototype.ExpandFor.call(diff, q), pQ, q)
		} else {
			// p > q
			// diff = 0 - q mod p = p - q
			bigmod.Nat.prototype.Sub.call(bigmod.Nat.prototype.ExpandFor.call(diff, p), __goscriptShadow3, p)
		}
	}
	// A tiny bit of leakage is acceptable because it's not adaptive, an
	// attacker only learns the magnitude of p - q.
	if (bigmod.Nat.prototype.BitLenVarTime.call(diff) <= ((Math.trunc(bigmod.Modulus.prototype.BitLen.call(N) / 2)) - 100)) {
		return errors.New("crypto/rsa: |p - q| too small")
	}

	// Check that d > 2^(nlen/2).
	//
	// See section 3 of https://crypto.stanford.edu/~dabo/papers/RSA-survey.pdf
	// for more details about attacks on small d values.
	//
	// Likewise, the leakage of the magnitude of d is not adaptive.
	if (bigmod.Nat.prototype.BitLenVarTime.call($.pointerValue<PrivateKey>(priv).d) <= (Math.trunc(bigmod.Modulus.prototype.BitLen.call(N) / 2))) {
		return errors.New("crypto/rsa: d too small")
	}

	return null
}

export function checkPublicKey(pub: PublicKey | $.VarRef<PublicKey> | null): [boolean, $.GoError] {
	let fipsApproved: boolean = false
	let err: $.GoError = null! as $.GoError
	fipsApproved = true
	if ($.pointerValue<PublicKey>(pub).N == null) {
		return [false, errors.New("crypto/rsa: missing public modulus")]
	}
	if (bigmod.Nat.prototype.IsOdd.call(bigmod.Modulus.prototype.Nat.call($.pointerValue<PublicKey>(pub).N)) == 0) {
		return [false, errors.New("crypto/rsa: public modulus is even")]
	}
	// FIPS 186-5, Section 5.1: "This standard specifies the use of a modulus
	// whose bit length is an even integer and greater than or equal to 2048
	// bits."
	if (bigmod.Modulus.prototype.BitLen.call($.pointerValue<PublicKey>(pub).N) < 2048) {
		fipsApproved = false
	}
	if ((bigmod.Modulus.prototype.BitLen.call($.pointerValue<PublicKey>(pub).N) % 2) == 1) {
		fipsApproved = false
	}
	if ($.pointerValue<PublicKey>(pub).E < 2) {
		return [false, errors.New("crypto/rsa: public exponent too small or negative")]
	}
	// e needs to be coprime with p-1 and q-1, since it must be invertible
	// modulo λ(pq). Since p and q are prime, this means e needs to be odd.
	if (($.pointerValue<PublicKey>(pub).E & 1) == 0) {
		return [false, errors.New("crypto/rsa: public exponent is even")]
	}
	// FIPS 186-5, Section 5.5(e): "The exponent e shall be an odd, positive
	// integer such that 2¹⁶ < e < 2²⁵⁶."
	if ($.pointerValue<PublicKey>(pub).E <= (65536)) {
		fipsApproved = false
	}
	// We require pub.E to fit into a 32-bit integer so that we
	// do not have different behavior depending on whether
	// int is 32 or 64 bits. See also
	// https://www.imperialviolet.org/2012/03/16/rsae.html.
	if ($.pointerValue<PublicKey>(pub).E > ((2147483648) - 1)) {
		return [false, errors.New("crypto/rsa: public exponent too large")]
	}
	return [fipsApproved, null]
}

export function Encrypt(pub: PublicKey | $.VarRef<PublicKey> | null, plaintext: $.Slice<number>): [$.Slice<number>, $.GoError] {
	fips140.RecordNonApproved()
	{
		let [, err] = checkPublicKey(pub)
		if (err != null) {
			return [null, err]
		}
	}
	return encrypt(pub, plaintext)
}

export function encrypt(pub: PublicKey | $.VarRef<PublicKey> | null, plaintext: $.Slice<number>): [$.Slice<number>, $.GoError] {
	let __goscriptTuple20: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), plaintext, $.pointerValue<PublicKey>(pub).N)
	let m: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple20[0]
	let err = __goscriptTuple20[1]
	if (err != null) {
		return [null, err]
	}
	return [bigmod.Nat.prototype.Bytes.call(bigmod.Nat.prototype.ExpShortVarTime.call(bigmod.NewNat(), m, $.uint($.pointerValue<PublicKey>(pub).E, 64), $.pointerValue<PublicKey>(pub).N), $.pointerValue<PublicKey>(pub).N), null]
}

export let ErrMessageTooLong: $.GoError = errors.New("crypto/rsa: message too long for RSA key size")

export function __goscript_set_ErrMessageTooLong(__goscriptValue: $.GoError): void {
	ErrMessageTooLong = __goscriptValue
}

export let ErrDecryption: $.GoError = errors.New("crypto/rsa: decryption error")

export function __goscript_set_ErrDecryption(__goscriptValue: $.GoError): void {
	ErrDecryption = __goscriptValue
}

export let ErrVerification: $.GoError = errors.New("crypto/rsa: verification error")

export function __goscript_set_ErrVerification(__goscriptValue: $.GoError): void {
	ErrVerification = __goscriptValue
}

export function DecryptWithoutCheck(priv: PrivateKey | $.VarRef<PrivateKey> | null, ciphertext: $.Slice<number>): [$.Slice<number>, $.GoError] {
	fips140.RecordNonApproved()
	return decrypt(priv, ciphertext, false)
}

export function DecryptWithCheck(priv: PrivateKey | $.VarRef<PrivateKey> | null, ciphertext: $.Slice<number>): [$.Slice<number>, $.GoError] {
	fips140.RecordNonApproved()
	return decrypt(priv, ciphertext, true)
}

export function decrypt(priv: PrivateKey | $.VarRef<PrivateKey> | null, ciphertext: $.Slice<number>, check: boolean): [$.Slice<number>, $.GoError] {
	if (!$.pointerValue<PrivateKey>(priv).fipsApproved) {
		fips140.RecordNonApproved()
	}

	let m: bigmod.Nat | $.VarRef<bigmod.Nat> | null = null! as bigmod.Nat | $.VarRef<bigmod.Nat> | null
	let N: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = $.pointerValue<PrivateKey>(priv).pub.N
	let E = $.pointerValue<PrivateKey>(priv).pub.E

	let __goscriptTuple21: any = bigmod.Nat.prototype.SetBytes.call(bigmod.NewNat(), ciphertext, N)
	let c: bigmod.Nat | $.VarRef<bigmod.Nat> | null = __goscriptTuple21[0]
	let err = __goscriptTuple21[1]
	if (err != null) {
		return [null, ErrDecryption]
	}

	if ($.pointerValue<PrivateKey>(priv).dP == null) {
		// Legacy codepath for deprecated multi-prime keys.
		fips140.RecordNonApproved()
		m = bigmod.Nat.prototype.Exp.call(bigmod.NewNat(), c, bigmod.Nat.prototype.Bytes.call($.pointerValue<PrivateKey>(priv).d, N), N)
	} else {
		let P: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = $.pointerValue<PrivateKey>(priv).p
		let Q: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = $.pointerValue<PrivateKey>(priv).q
		let t0: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.NewNat()
		// m = c ^ Dp mod p
		m = bigmod.Nat.prototype.Exp.call(bigmod.NewNat(), bigmod.Nat.prototype.Mod.call(t0, c, P), $.pointerValue<PrivateKey>(priv).dP, P)
		// m2 = c ^ Dq mod q
		let m2: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.Exp.call(bigmod.NewNat(), bigmod.Nat.prototype.Mod.call(t0, c, Q), $.pointerValue<PrivateKey>(priv).dQ, Q)
		// m = m - m2 mod p
		bigmod.Nat.prototype.Sub.call(m, bigmod.Nat.prototype.Mod.call(t0, m2, P), P)
		// m = m * Qinv mod p
		bigmod.Nat.prototype.Mul.call(m, $.pointerValue<PrivateKey>(priv).qInv, P)
		// m = m * q mod N
		bigmod.Nat.prototype.Mul.call(bigmod.Nat.prototype.ExpandFor.call(m, N), bigmod.Nat.prototype.Mod.call(t0, bigmod.Modulus.prototype.Nat.call(Q), N), N)
		// m = m + m2 mod N
		bigmod.Nat.prototype.Add.call(m, bigmod.Nat.prototype.ExpandFor.call(m2, N), N)
	}

	if (check) {
		let c1: bigmod.Nat | $.VarRef<bigmod.Nat> | null = bigmod.Nat.prototype.ExpShortVarTime.call(bigmod.NewNat(), m, $.uint(E, 64), N)
		if (bigmod.Nat.prototype.Equal.call(c1, c) != 1) {
			return [null, ErrDecryption]
		}
	}

	return [bigmod.Nat.prototype.Bytes.call(m, N), null]
}

// Generated file based on dsa.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as big from "@goscript/math/big/index.js"

import * as fips140only from "@goscript/crypto/internal/fips140only/index.js"

import * as rand2 from "@goscript/crypto/internal/rand/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/math/big/index.js"
import "@goscript/crypto/internal/fips140only/index.js"
import "@goscript/crypto/internal/rand/index.js"

export type ParameterSizes = number

export class Parameters {
	public get P(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.P.value
	}
	public set P(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.P.value = value
	}

	public get Q(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Q.value
	}
	public set Q(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Q.value = value
	}

	public get G(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.G.value
	}
	public set G(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.G.value = value
	}

	public _fields: {
		P: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Q: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		G: $.VarRef<big.Int | $.VarRef<big.Int> | null>
	}

	constructor(init?: Partial<{P?: big.Int | $.VarRef<big.Int> | null, Q?: big.Int | $.VarRef<big.Int> | null, G?: big.Int | $.VarRef<big.Int> | null}>) {
		this._fields = {
			P: $.varRef(init?.P ?? (null! as big.Int | $.VarRef<big.Int> | null)),
			Q: $.varRef(init?.Q ?? (null! as big.Int | $.VarRef<big.Int> | null)),
			G: $.varRef(init?.G ?? (null! as big.Int | $.VarRef<big.Int> | null))
		}
	}

	public clone(): Parameters {
		const cloned = new Parameters()
		cloned._fields = {
			P: $.varRef(this._fields.P.value),
			Q: $.varRef(this._fields.Q.value),
			G: $.varRef(this._fields.G.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"dsa.Parameters",
		() => new Parameters(),
		[],
		Parameters,
		[{ name: "P", key: "P", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [0], offset: 0, exported: true }, { name: "Q", key: "Q", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [1], offset: 8, exported: true }, { name: "G", key: "G", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [2], offset: 16, exported: true }]
	)
}

export class PublicKey {
	public get Parameters(): Parameters {
		return this._fields.Parameters.value
	}
	public set Parameters(value: Parameters) {
		this._fields.Parameters.value = value
	}

	public get Y(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Y.value
	}
	public set Y(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Y.value = value
	}

	public _fields: {
		Parameters: $.VarRef<Parameters>
		Y: $.VarRef<big.Int | $.VarRef<big.Int> | null>
	}

	constructor(init?: Partial<{Parameters?: Parameters, Y?: big.Int | $.VarRef<big.Int> | null}>) {
		this._fields = {
			Parameters: $.varRef(init?.Parameters ? $.markAsStructValue($.cloneStructValue(init.Parameters)) : $.markAsStructValue(new Parameters())),
			Y: $.varRef(init?.Y ?? (null! as big.Int | $.VarRef<big.Int> | null))
		}
	}

	public clone(): PublicKey {
		const cloned = new PublicKey()
		cloned._fields = {
			Parameters: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Parameters.value))),
			Y: $.varRef(this._fields.Y.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"dsa.PublicKey",
		() => new PublicKey(),
		[],
		PublicKey,
		[{ name: "Parameters", key: "Parameters", type: "dsa.Parameters", anonymous: true, index: [0], offset: 0, exported: true }, { name: "Y", key: "Y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [1], offset: 24, exported: true }]
	)
}

export class PrivateKey {
	public get PublicKey(): PublicKey {
		return this._fields.PublicKey.value
	}
	public set PublicKey(value: PublicKey) {
		this._fields.PublicKey.value = value
	}

	public get X(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.X.value
	}
	public set X(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.X.value = value
	}

	public _fields: {
		PublicKey: $.VarRef<PublicKey>
		X: $.VarRef<big.Int | $.VarRef<big.Int> | null>
	}

	constructor(init?: Partial<{PublicKey?: PublicKey, X?: big.Int | $.VarRef<big.Int> | null}>) {
		this._fields = {
			PublicKey: $.varRef(init?.PublicKey ? $.markAsStructValue($.cloneStructValue(init.PublicKey)) : $.markAsStructValue(new PublicKey())),
			X: $.varRef(init?.X ?? (null! as big.Int | $.VarRef<big.Int> | null))
		}
	}

	public clone(): PrivateKey {
		const cloned = new PrivateKey()
		cloned._fields = {
			PublicKey: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.PublicKey.value))),
			X: $.varRef(this._fields.X.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"dsa.PrivateKey",
		() => new PrivateKey(),
		[],
		PrivateKey,
		[{ name: "PublicKey", key: "PublicKey", type: "dsa.PublicKey", anonymous: true, index: [0], offset: 0, exported: true }, { name: "X", key: "X", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [1], offset: 32, exported: true }]
	)
}

export const L1024N160: ParameterSizes = 0

export const L2048N224: ParameterSizes = 1

export const L2048N256: ParameterSizes = 2

export const L3072N256: ParameterSizes = 3

export const numMRTests: number = 64

export let ErrInvalidPublicKey: $.GoError = errors.New("crypto/dsa: invalid public key")

export function __goscript_set_ErrInvalidPublicKey(__goscriptValue: $.GoError): void {
	ErrInvalidPublicKey = __goscriptValue
}

export async function GenerateParameters(params: Parameters | $.VarRef<Parameters> | null, rand: io.Reader | null, sizes: ParameterSizes): globalThis.Promise<$.GoError> {
	if (fips140only.Enforced()) {
		return errors.New("crypto/dsa: use of DSA is not allowed in FIPS 140-only mode")
	}

	// This function doesn't follow FIPS 186-3 exactly in that it doesn't
	// use a verification seed to generate the primes. The verification
	// seed doesn't appear to be exported or used by other code and
	// omitting it makes the code cleaner.

	let L: number = 0
	let N: number = 0
	switch (sizes) {
		case 0:
		{
			L = 1024
			N = 160
			break
		}
		case 1:
		{
			L = 2048
			N = 224
			break
		}
		case 2:
		{
			L = 2048
			N = 256
			break
		}
		case 3:
		{
			L = 3072
			N = 256
			break
		}
		default:
		{
			return errors.New("crypto/dsa: invalid ParameterSizes")
			break
		}
	}

	let qBytes: $.Slice<number> = $.makeSlice<number>(Math.trunc(N / 8), undefined, "byte")
	let pBytes: $.Slice<number> = $.makeSlice<number>(Math.trunc(L / 8), undefined, "byte")

	let q: big.Int | $.VarRef<big.Int> | null = new big.Int()
	let p: big.Int | $.VarRef<big.Int> | null = new big.Int()
	let rem: big.Int | $.VarRef<big.Int> | null = new big.Int()
	let one: big.Int | $.VarRef<big.Int> | null = new big.Int()
	big.Int.prototype.SetInt64.call(one, 1n)

	GeneratePrimes: while (true) {
		{
			let [, err] = await io.ReadFull($.pointerValueOrNil(rand)!, qBytes)
			if (err != null) {
				return err
			}
		}

		qBytes![$.len(qBytes) - 1] = qBytes![$.len(qBytes) - 1] | ($.uint(1, 8))
		qBytes![0] = qBytes![0] | ($.uint(0x80, 8))
		big.Int.prototype.SetBytes.call(q, qBytes)

		if (!await big.Int.prototype.ProbablyPrime.call(q, 64)) {
			continue
		}

		for (let i = 0; i < (4 * L); i++) {
			{
				let [, err] = await io.ReadFull($.pointerValueOrNil(rand)!, pBytes)
				if (err != null) {
					return err
				}
			}

			pBytes![$.len(pBytes) - 1] = pBytes![$.len(pBytes) - 1] | ($.uint(1, 8))
			pBytes![0] = pBytes![0] | ($.uint(0x80, 8))

			big.Int.prototype.SetBytes.call(p, pBytes)
			await big.Int.prototype.Mod.call(rem, p, q)
			big.Int.prototype.Sub.call(rem, rem, one)
			big.Int.prototype.Sub.call(p, p, rem)
			if (big.Int.prototype.BitLen.call(p) < L) {
				continue
			}

			if (!await big.Int.prototype.ProbablyPrime.call(p, 64)) {
				continue
			}

			$.pointerValue<Parameters>(params).P = p
			$.pointerValue<Parameters>(params).Q = q
			break GeneratePrimes
		}
	}

	let h: big.Int | $.VarRef<big.Int> | null = new big.Int()
	big.Int.prototype.SetInt64.call(h, 2n)
	let g: big.Int | $.VarRef<big.Int> | null = new big.Int()

	let pm1: big.Int | $.VarRef<big.Int> | null = big.Int.prototype.Sub.call(new big.Int(), p, one)
	let e: big.Int | $.VarRef<big.Int> | null = await big.Int.prototype.Div.call(new big.Int(), pm1, q)

	while (true) {
		await big.Int.prototype.Exp.call(g, h, e, p)
		if (big.Int.prototype.Cmp.call(g, one) == 0) {
			big.Int.prototype.Add.call(h, h, one)
			continue
		}

		$.pointerValue<Parameters>(params).G = g
		return null
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function GenerateKey(priv: PrivateKey | $.VarRef<PrivateKey> | null, rand: io.Reader | null): globalThis.Promise<$.GoError> {
	if (fips140only.Enforced()) {
		return errors.New("crypto/dsa: use of DSA is not allowed in FIPS 140-only mode")
	}

	if ((($.pointerValue<PrivateKey>(priv).PublicKey.Parameters.P == null) || ($.pointerValue<PrivateKey>(priv).PublicKey.Parameters.Q == null)) || ($.pointerValue<PrivateKey>(priv).PublicKey.Parameters.G == null)) {
		return errors.New("crypto/dsa: parameters not set up before generating key")
	}

	let x: big.Int | $.VarRef<big.Int> | null = new big.Int()
	let xBytes: $.Slice<number> = $.makeSlice<number>(Math.trunc(big.Int.prototype.BitLen.call($.pointerValue<PrivateKey>(priv).PublicKey.Parameters.Q) / 8), undefined, "byte")

	while (true) {
		let [, err] = await io.ReadFull($.pointerValueOrNil(rand)!, xBytes)
		if (err != null) {
			return err
		}
		big.Int.prototype.SetBytes.call(x, xBytes)
		if ((big.Int.prototype.Sign.call(x) != 0) && (big.Int.prototype.Cmp.call(x, $.pointerValue<PrivateKey>(priv).PublicKey.Parameters.Q) < 0)) {
			break
		}
	}

	$.pointerValue<PrivateKey>(priv).X = x
	$.pointerValue<PrivateKey>(priv).PublicKey.Y = new big.Int()
	await big.Int.prototype.Exp.call($.pointerValue<PrivateKey>(priv).PublicKey.Y, $.pointerValue<PrivateKey>(priv).PublicKey.Parameters.G, x, $.pointerValue<PrivateKey>(priv).PublicKey.Parameters.P)
	return null
}

export async function fermatInverse(k: big.Int | $.VarRef<big.Int> | null, P: big.Int | $.VarRef<big.Int> | null): globalThis.Promise<big.Int | $.VarRef<big.Int> | null> {
	let two: big.Int | $.VarRef<big.Int> | null = big.NewInt(2n)
	let pMinus2: big.Int | $.VarRef<big.Int> | null = big.Int.prototype.Sub.call(new big.Int(), P, two)
	return big.Int.prototype.Exp.call(new big.Int(), k, pMinus2, P)
}

export async function Sign(random: io.Reader | null, priv: PrivateKey | $.VarRef<PrivateKey> | null, hash: $.Slice<number>): globalThis.Promise<[big.Int | $.VarRef<big.Int> | null, big.Int | $.VarRef<big.Int> | null, $.GoError]> {
	let r: big.Int | $.VarRef<big.Int> | null = null! as big.Int | $.VarRef<big.Int> | null
	let s: big.Int | $.VarRef<big.Int> | null = null! as big.Int | $.VarRef<big.Int> | null
	let err: $.GoError = null! as $.GoError
	if (fips140only.Enforced()) {
		return [null, null, errors.New("crypto/dsa: use of DSA is not allowed in FIPS 140-only mode")]
	}

	random = await rand2.CustomReader(random)

	// FIPS 186-3, section 4.6

	let n = big.Int.prototype.BitLen.call($.pointerValue<PrivateKey>(priv).PublicKey.Parameters.Q)
	if (((((big.Int.prototype.Sign.call($.pointerValue<PrivateKey>(priv).PublicKey.Parameters.Q) <= 0) || (big.Int.prototype.Sign.call($.pointerValue<PrivateKey>(priv).PublicKey.Parameters.P) <= 0)) || (big.Int.prototype.Sign.call($.pointerValue<PrivateKey>(priv).PublicKey.Parameters.G) <= 0)) || (big.Int.prototype.Sign.call($.pointerValue<PrivateKey>(priv).X) <= 0)) || ((n % 8) != 0)) {
		err = ErrInvalidPublicKey
		return [r, s, err]
	}
	n = n >> (3)

	let attempts: number = 0
	for (attempts = 10; attempts > 0; attempts--) {
		let k: big.Int | $.VarRef<big.Int> | null = new big.Int()
		let buf: $.Slice<number> = $.makeSlice<number>(n, undefined, "byte")
		while (true) {
			let __goscriptTuple0: any = await io.ReadFull($.pointerValueOrNil(random)!, buf)
			err = __goscriptTuple0[1]
			if (err != null) {
				return [r, s, err]
			}
			big.Int.prototype.SetBytes.call(k, buf)
			// priv.Q must be >= 128 because the test above
			// requires it to be > 0 and that
			//    ceil(log_2(Q)) mod 8 = 0
			// Thus this loop will quickly terminate.
			if ((big.Int.prototype.Sign.call(k) > 0) && (big.Int.prototype.Cmp.call(k, $.pointerValue<PrivateKey>(priv).PublicKey.Parameters.Q) < 0)) {
				break
			}
		}

		let kInv: big.Int | $.VarRef<big.Int> | null = await fermatInverse(k, $.pointerValue<PrivateKey>(priv).PublicKey.Parameters.Q)

		r = await big.Int.prototype.Exp.call(new big.Int(), $.pointerValue<PrivateKey>(priv).PublicKey.Parameters.G, k, $.pointerValue<PrivateKey>(priv).PublicKey.Parameters.P)
		await big.Int.prototype.Mod.call(r, r, $.pointerValue<PrivateKey>(priv).PublicKey.Parameters.Q)

		if (big.Int.prototype.Sign.call(r) == 0) {
			continue
		}

		let z: big.Int | $.VarRef<big.Int> | null = big.Int.prototype.SetBytes.call(k, hash)

		s = await big.Int.prototype.Mul.call(new big.Int(), $.pointerValue<PrivateKey>(priv).X, r)
		big.Int.prototype.Add.call(s, s, z)
		await big.Int.prototype.Mod.call(s, s, $.pointerValue<PrivateKey>(priv).PublicKey.Parameters.Q)
		await big.Int.prototype.Mul.call(s, s, kInv)
		await big.Int.prototype.Mod.call(s, s, $.pointerValue<PrivateKey>(priv).PublicKey.Parameters.Q)

		if (big.Int.prototype.Sign.call(s) != 0) {
			break
		}
	}

	// Only degenerate private keys will require more than a handful of
	// attempts.
	if (attempts == 0) {
		return [null, null, ErrInvalidPublicKey]
	}

	return [r, s, err]
}

export async function Verify(pub: PublicKey | $.VarRef<PublicKey> | null, hash: $.Slice<number>, r: big.Int | $.VarRef<big.Int> | null, s: big.Int | $.VarRef<big.Int> | null): globalThis.Promise<boolean> {
	if (fips140only.Enforced()) {
		$.panic("crypto/dsa: use of DSA is not allowed in FIPS 140-only mode")
	}

	// FIPS 186-3, section 4.7

	if (big.Int.prototype.Sign.call($.pointerValue<PublicKey>(pub).Parameters.P) == 0) {
		return false
	}

	if ((big.Int.prototype.Sign.call(r) < 1) || (big.Int.prototype.Cmp.call(r, $.pointerValue<PublicKey>(pub).Parameters.Q) >= 0)) {
		return false
	}
	if ((big.Int.prototype.Sign.call(s) < 1) || (big.Int.prototype.Cmp.call(s, $.pointerValue<PublicKey>(pub).Parameters.Q) >= 0)) {
		return false
	}

	let w: big.Int | $.VarRef<big.Int> | null = await big.Int.prototype.ModInverse.call(new big.Int(), s, $.pointerValue<PublicKey>(pub).Parameters.Q)
	if (w == null) {
		return false
	}

	let n = big.Int.prototype.BitLen.call($.pointerValue<PublicKey>(pub).Parameters.Q)
	if ((n % 8) != 0) {
		return false
	}
	let z: big.Int | $.VarRef<big.Int> | null = big.Int.prototype.SetBytes.call(new big.Int(), hash)

	let u1: big.Int | $.VarRef<big.Int> | null = await big.Int.prototype.Mul.call(new big.Int(), z, w)
	await big.Int.prototype.Mod.call(u1, u1, $.pointerValue<PublicKey>(pub).Parameters.Q)
	let u2: big.Int | $.VarRef<big.Int> | null = await big.Int.prototype.Mul.call(w, r, w)
	await big.Int.prototype.Mod.call(u2, u2, $.pointerValue<PublicKey>(pub).Parameters.Q)
	let v: big.Int | $.VarRef<big.Int> | null = await big.Int.prototype.Exp.call(u1, $.pointerValue<PublicKey>(pub).Parameters.G, u1, $.pointerValue<PublicKey>(pub).Parameters.P)
	await big.Int.prototype.Exp.call(u2, $.pointerValue<PublicKey>(pub).Y, u2, $.pointerValue<PublicKey>(pub).Parameters.P)
	await big.Int.prototype.Mul.call(v, v, u2)
	await big.Int.prototype.Mod.call(v, v, $.pointerValue<PublicKey>(pub).Parameters.P)
	await big.Int.prototype.Mod.call(v, v, $.pointerValue<PublicKey>(pub).Parameters.Q)

	return big.Int.prototype.Cmp.call(v, r) == 0
}

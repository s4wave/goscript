// Generated file based on fips.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as boring from "@goscript/crypto/internal/boring/index.js"

import * as rsa from "@goscript/crypto/internal/fips140/rsa/index.js"

import * as fips140hash from "@goscript/crypto/internal/fips140hash/index.js"

import * as fips140only from "@goscript/crypto/internal/fips140only/index.js"

import * as rand from "@goscript/crypto/internal/rand/index.js"

import * as errors from "@goscript/errors/index.js"

import * as hash2 from "@goscript/hash/index.js"

import * as io from "@goscript/io/index.js"

import * as big from "@goscript/math/big/index.js"

import * as __goscript_notboring from "./notboring.gs.ts"

import * as __goscript_rsa from "./rsa.gs.ts"
import "@goscript/crypto/index.js"
import "@goscript/crypto/internal/boring/index.js"
import "@goscript/crypto/internal/fips140/rsa/index.js"
import "@goscript/crypto/internal/fips140hash/index.js"
import "@goscript/crypto/internal/fips140only/index.js"
import "@goscript/crypto/internal/rand/index.js"
import "@goscript/errors/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"
import "@goscript/math/big/index.js"
import "./notboring.gs.ts"
import "./rsa.gs.ts"

export class PSSOptions {
	// SaltLength controls the length of the salt used in the PSS signature. It
	// can either be a positive number of bytes, or one of the special
	// PSSSaltLength constants.
	public get SaltLength(): number {
		return this._fields.SaltLength.value
	}
	public set SaltLength(value: number) {
		this._fields.SaltLength.value = value
	}

	// Hash is the hash function used to generate the message digest. If not
	// zero, it overrides the hash function passed to SignPSS. It's required
	// when using PrivateKey.Sign.
	public get Hash(): crypto.Hash {
		return this._fields.Hash.value
	}
	public set Hash(value: crypto.Hash) {
		this._fields.Hash.value = value
	}

	public _fields: {
		SaltLength: $.VarRef<number>
		Hash: $.VarRef<crypto.Hash>
	}

	constructor(init?: Partial<{SaltLength?: number, Hash?: crypto.Hash}>) {
		this._fields = {
			SaltLength: $.varRef(init?.SaltLength ?? (0 as number)),
			Hash: $.varRef(init?.Hash ?? (0 as crypto.Hash))
		}
	}

	public clone(): PSSOptions {
		const cloned = new PSSOptions()
		cloned._fields = {
			SaltLength: $.varRef(this._fields.SaltLength.value),
			Hash: $.varRef(this._fields.Hash.value)
		}
		return $.markAsStructValue(cloned)
	}

	public HashFunc(): crypto.Hash {
		const opts: PSSOptions | $.VarRef<PSSOptions> | null = this
		return $.pointerValue<PSSOptions>(opts).Hash
	}

	public saltLength(): number {
		const opts: PSSOptions | $.VarRef<PSSOptions> | null = this
		if (opts == null) {
			return 0
		}
		return $.pointerValue<PSSOptions>(opts).SaltLength
	}

	static __typeInfo = $.registerStructType(
		"rsa.PSSOptions",
		() => new PSSOptions(),
		[{ name: "HashFunc", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" } }] }, { name: "saltLength", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		PSSOptions,
		[{ name: "SaltLength", key: "SaltLength", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }, { name: "Hash", key: "Hash", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" }, index: [1], offset: 8, exported: true }]
	)
}

export const PSSSaltLengthAuto: number = 0

export const PSSSaltLengthEqualsHash: number = -1

export async function SignPSS(random: io.Reader | null, priv: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null, hash: crypto.Hash, digest: $.Slice<number>, opts: PSSOptions | $.VarRef<PSSOptions> | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	{
		let err = __goscript_rsa.checkPublicKeySize($.pointerValue<__goscript_rsa.PrivateKey>(priv)._fields.PublicKey)
		if (err != null) {
			return [null, err]
		}
	}

	if ((opts != null) && ($.pointerValue<PSSOptions>(opts).Hash != 0)) {
		hash = $.pointerValue<PSSOptions>(opts).Hash
	}

	if (boring.Enabled && rand.IsDefaultReader(random)) {
		let __goscriptTuple0: any = __goscript_notboring.boringPrivateKey(priv)
		let bkey: boring.PrivateKeyRSA | $.VarRef<boring.PrivateKeyRSA> | null = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}
		return boring.SignRSAPSS(bkey, hash, digest, PSSOptions.prototype.saltLength.call(opts))
	}
	boring.UnreachableExceptTests()

	let h = fips140hash.Unwrap(await crypto.Hash_New(hash))

	{
		let err = checkFIPS140OnlyPrivateKey(priv)
		if (err != null) {
			return [null, err]
		}
	}
	if (fips140only.Enforced() && !fips140only.ApprovedHash(h)) {
		return [null, errors.New("crypto/rsa: use of hash functions other than SHA-2 or SHA-3 is not allowed in FIPS 140-only mode")]
	}
	if (fips140only.Enforced() && !fips140only.ApprovedRandomReader(random)) {
		return [null, errors.New("crypto/rsa: only crypto/rand.Reader is allowed in FIPS 140-only mode")]
	}

	let __goscriptTuple1: any = await __goscript_rsa.fipsPrivateKey(priv)
	let k: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	if (err != null) {
		return [null, err]
	}

	let saltLength = PSSOptions.prototype.saltLength.call(opts)
	if (fips140only.Enforced() && (saltLength > await $.pointerValue<Exclude<hash2.Hash, null>>(h).Size())) {
		return [null, errors.New("crypto/rsa: use of PSS salt longer than the hash is not allowed in FIPS 140-only mode")]
	}
	switch (saltLength) {
		case 0:
		{
			let __goscriptTuple2: any = await rsa.PSSMaxSaltLength(rsa.PrivateKey.prototype.PublicKey.call(k), h)
			saltLength = __goscriptTuple2[0]
			err = __goscriptTuple2[1]
			if (err != null) {
				return [null, fipsError(err)]
			}
			break
		}
		case -1:
		{
			saltLength = await $.pointerValue<Exclude<hash2.Hash, null>>(h).Size()
			break
		}
		default:
		{
			if (saltLength <= 0) {
				return [null, errors.New("crypto/rsa: invalid PSS salt length")]
			}
			break
		}
	}

	const __goscriptReturn1 = fipsError2({T: { type: { kind: $.TypeKind.Basic, name: "unknown" }, zero: () => null }}, ...((await rsa.SignPSS(random, k, h, digest, saltLength)) as [$.Slice<number>, $.GoError]))
	return [(__goscriptReturn1[0] as $.Slice<number>), __goscriptReturn1[1]]
	throw new globalThis.Error("goscript: unreachable return")
}

export async function VerifyPSS(pub: __goscript_rsa.PublicKey | $.VarRef<__goscript_rsa.PublicKey> | null, hash: crypto.Hash, digest: $.Slice<number>, sig: $.Slice<number>, opts: PSSOptions | $.VarRef<PSSOptions> | null): globalThis.Promise<$.GoError> {
	{
		let err = __goscript_rsa.checkPublicKeySize(pub)
		if (err != null) {
			return err
		}
	}

	if (boring.Enabled) {
		let __goscriptTuple3: any = __goscript_notboring.boringPublicKey(pub)
		let bkey: boring.PublicKeyRSA | $.VarRef<boring.PublicKeyRSA> | null = __goscriptTuple3[0]
		let err = __goscriptTuple3[1]
		if (err != null) {
			return err
		}
		{
			let __goscriptShadow0 = boring.VerifyRSAPSS(bkey, hash, digest, sig, PSSOptions.prototype.saltLength.call(opts))
			if (__goscriptShadow0 != null) {
				return __goscript_rsa.ErrVerification
			}
		}
		return null
	}

	let h = fips140hash.Unwrap(await crypto.Hash_New(hash))

	{
		let err = checkFIPS140OnlyPublicKey(pub)
		if (err != null) {
			return err
		}
	}
	if (fips140only.Enforced() && !fips140only.ApprovedHash(h)) {
		return errors.New("crypto/rsa: use of hash functions other than SHA-2 or SHA-3 is not allowed in FIPS 140-only mode")
	}

	let __goscriptTuple4: any = __goscript_rsa.fipsPublicKey(pub)
	let k: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = __goscriptTuple4[0]
	let err = __goscriptTuple4[1]
	if (err != null) {
		return err
	}

	let saltLength = PSSOptions.prototype.saltLength.call(opts)
	if (fips140only.Enforced() && (saltLength > await $.pointerValue<Exclude<hash2.Hash, null>>(h).Size())) {
		return errors.New("crypto/rsa: use of PSS salt longer than the hash is not allowed in FIPS 140-only mode")
	}
	switch (saltLength) {
		case 0:
		{
			return fipsError(await rsa.VerifyPSS(k, h, digest, sig))
			break
		}
		case -1:
		{
			return fipsError(await rsa.VerifyPSSWithSaltLength(k, h, digest, sig, await $.pointerValue<Exclude<hash2.Hash, null>>(h).Size()))
			break
		}
		default:
		{
			return fipsError(await rsa.VerifyPSSWithSaltLength(k, h, digest, sig, saltLength))
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function EncryptOAEP(hash: hash2.Hash | null, random: io.Reader | null, pub: __goscript_rsa.PublicKey | $.VarRef<__goscript_rsa.PublicKey> | null, msg: $.Slice<number>, label: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	return encryptOAEP(hash, hash, random, pub, msg, label)
}

export async function EncryptOAEPWithOptions(random: io.Reader | null, pub: __goscript_rsa.PublicKey | $.VarRef<__goscript_rsa.PublicKey> | null, msg: $.Slice<number>, opts: __goscript_rsa.OAEPOptions | $.VarRef<__goscript_rsa.OAEPOptions> | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	if ($.pointerValue<__goscript_rsa.OAEPOptions>(opts).MGFHash == 0) {
		return encryptOAEP(await crypto.Hash_New($.pointerValue<__goscript_rsa.OAEPOptions>(opts).Hash), await crypto.Hash_New($.pointerValue<__goscript_rsa.OAEPOptions>(opts).Hash), random, pub, msg, $.pointerValue<__goscript_rsa.OAEPOptions>(opts).Label)
	}
	return encryptOAEP(await crypto.Hash_New($.pointerValue<__goscript_rsa.OAEPOptions>(opts).Hash), await crypto.Hash_New($.pointerValue<__goscript_rsa.OAEPOptions>(opts).MGFHash), random, pub, msg, $.pointerValue<__goscript_rsa.OAEPOptions>(opts).Label)
}

export async function encryptOAEP(hash: hash2.Hash | null, mgfHash: hash2.Hash | null, random: io.Reader | null, pub: __goscript_rsa.PublicKey | $.VarRef<__goscript_rsa.PublicKey> | null, msg: $.Slice<number>, label: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	await using __defer = new $.AsyncDisposableStack()
	{
		let err = __goscript_rsa.checkPublicKeySize(pub)
		if (err != null) {
			return [null, err]
		}
	}

	__defer.defer(async () => { await $.pointerValue<Exclude<hash2.Hash, null>>(hash).Reset() })
	__defer.defer(async () => { await $.pointerValue<Exclude<hash2.Hash, null>>(mgfHash).Reset() })

	if (boring.Enabled && rand.IsDefaultReader(random)) {
		let k = __goscript_rsa.PublicKey.prototype.Size.call(pub)
		if ($.len(msg) > ((k - (2 * await $.pointerValue<Exclude<hash2.Hash, null>>(hash).Size())) - 2)) {
			return [null, __goscript_rsa.ErrMessageTooLong]
		}
		let __goscriptTuple5: any = __goscript_notboring.boringPublicKey(pub)
		let bkey: boring.PublicKeyRSA | $.VarRef<boring.PublicKeyRSA> | null = __goscriptTuple5[0]
		let err = __goscriptTuple5[1]
		if (err != null) {
			return [null, err]
		}
		return boring.EncryptRSAOAEP(hash, mgfHash, bkey, msg, label)
	}
	boring.UnreachableExceptTests()

	hash = fips140hash.Unwrap(hash)

	{
		let err = checkFIPS140OnlyPublicKey(pub)
		if (err != null) {
			return [null, err]
		}
	}
	if (fips140only.Enforced() && !fips140only.ApprovedHash(hash)) {
		return [null, errors.New("crypto/rsa: use of hash functions other than SHA-2 or SHA-3 is not allowed in FIPS 140-only mode")]
	}
	if (fips140only.Enforced() && !fips140only.ApprovedRandomReader(random)) {
		return [null, errors.New("crypto/rsa: only crypto/rand.Reader is allowed in FIPS 140-only mode")]
	}

	let __goscriptTuple6: any = __goscript_rsa.fipsPublicKey(pub)
	let k: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = __goscriptTuple6[0]
	let err = __goscriptTuple6[1]
	if (err != null) {
		return [null, err]
	}
	const __goscriptReturn6 = fipsError2({T: { type: { kind: $.TypeKind.Basic, name: "unknown" }, zero: () => null }}, ...((await rsa.EncryptOAEP(hash, mgfHash, random, k, msg, label)) as [$.Slice<number>, $.GoError]))
	return [(__goscriptReturn6[0] as $.Slice<number>), __goscriptReturn6[1]]
	throw new globalThis.Error("goscript: unreachable return")
}

export async function DecryptOAEP(hash: hash2.Hash | null, random: io.Reader | null, priv: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null, ciphertext: $.Slice<number>, label: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	await using __defer = new $.AsyncDisposableStack()
	__defer.defer(async () => { await $.pointerValue<Exclude<hash2.Hash, null>>(hash).Reset() })
	return await decryptOAEP(hash, hash, priv, ciphertext, label)
}

export async function decryptOAEP(hash: hash2.Hash | null, mgfHash: hash2.Hash | null, priv: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null, ciphertext: $.Slice<number>, label: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	{
		let err = __goscript_rsa.checkPublicKeySize($.pointerValue<__goscript_rsa.PrivateKey>(priv)._fields.PublicKey)
		if (err != null) {
			return [null, err]
		}
	}

	if (boring.Enabled) {
		let k = $.pointerValue<__goscript_rsa.PrivateKey>(priv).PublicKey.Size()
		if (($.len(ciphertext) > k) || (k < ((await $.pointerValue<Exclude<hash2.Hash, null>>(hash).Size() * 2) + 2))) {
			return [null, __goscript_rsa.ErrDecryption]
		}
		let __goscriptTuple7: any = __goscript_notboring.boringPrivateKey(priv)
		let bkey: boring.PrivateKeyRSA | $.VarRef<boring.PrivateKeyRSA> | null = __goscriptTuple7[0]
		let err = __goscriptTuple7[1]
		if (err != null) {
			return [null, err]
		}
		let __goscriptTuple8: any = boring.DecryptRSAOAEP(hash, mgfHash, bkey, ciphertext, label)
		let out: $.Slice<number> = __goscriptTuple8[0]
		err = __goscriptTuple8[1]
		if (err != null) {
			return [null, __goscript_rsa.ErrDecryption]
		}
		return [out, null]
	}

	hash = fips140hash.Unwrap(hash)
	mgfHash = fips140hash.Unwrap(mgfHash)

	{
		let err = checkFIPS140OnlyPrivateKey(priv)
		if (err != null) {
			return [null, err]
		}
	}
	if (fips140only.Enforced()) {
		if (!fips140only.ApprovedHash(hash) || !fips140only.ApprovedHash(mgfHash)) {
			return [null, errors.New("crypto/rsa: use of hash functions other than SHA-2 or SHA-3 is not allowed in FIPS 140-only mode")]
		}
	}

	let __goscriptTuple9: any = await __goscript_rsa.fipsPrivateKey(priv)
	let k: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null = __goscriptTuple9[0]
	let err = __goscriptTuple9[1]
	if (err != null) {
		return [null, err]
	}

	const __goscriptReturn8 = fipsError2({T: { type: { kind: $.TypeKind.Basic, name: "unknown" }, zero: () => null }}, ...((await rsa.DecryptOAEP(hash, mgfHash, k, ciphertext, label)) as [$.Slice<number>, $.GoError]))
	return [(__goscriptReturn8[0] as $.Slice<number>), __goscriptReturn8[1]]
	throw new globalThis.Error("goscript: unreachable return")
}

export async function SignPKCS1v15(random: io.Reader | null, priv: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null, hash: crypto.Hash, hashed: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let hashName: string = ""
	if (hash != 0) {
		if ($.len(hashed) != crypto.Hash_Size(hash)) {
			return [null, errors.New("crypto/rsa: input must be hashed message")]
		}
		hashName = crypto.Hash_String(hash)
	}

	{
		let err = __goscript_rsa.checkPublicKeySize($.pointerValue<__goscript_rsa.PrivateKey>(priv)._fields.PublicKey)
		if (err != null) {
			return [null, err]
		}
	}

	if (boring.Enabled) {
		let __goscriptTuple10: any = __goscript_notboring.boringPrivateKey(priv)
		let bkey: boring.PrivateKeyRSA | $.VarRef<boring.PrivateKeyRSA> | null = __goscriptTuple10[0]
		let err = __goscriptTuple10[1]
		if (err != null) {
			return [null, err]
		}
		return boring.SignRSAPKCS1v15(bkey, hash, hashed)
	}

	{
		let err = checkFIPS140OnlyPrivateKey(priv)
		if (err != null) {
			return [null, err]
		}
	}
	if (fips140only.Enforced() && !fips140only.ApprovedHash(fips140hash.Unwrap(await crypto.Hash_New(hash)))) {
		return [null, errors.New("crypto/rsa: use of hash functions other than SHA-2 or SHA-3 is not allowed in FIPS 140-only mode")]
	}

	let __goscriptTuple11: any = await __goscript_rsa.fipsPrivateKey(priv)
	let k: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null = __goscriptTuple11[0]
	let err = __goscriptTuple11[1]
	if (err != null) {
		return [null, err]
	}
	const __goscriptReturn10 = fipsError2({T: { type: { kind: $.TypeKind.Basic, name: "unknown" }, zero: () => null }}, ...((await rsa.SignPKCS1v15(k, hashName, hashed)) as [$.Slice<number>, $.GoError]))
	return [(__goscriptReturn10[0] as $.Slice<number>), __goscriptReturn10[1]]
	throw new globalThis.Error("goscript: unreachable return")
}

export async function VerifyPKCS1v15(pub: __goscript_rsa.PublicKey | $.VarRef<__goscript_rsa.PublicKey> | null, hash: crypto.Hash, hashed: $.Slice<number>, sig: $.Slice<number>): globalThis.Promise<$.GoError> {
	let hashName: string = ""
	if (hash != 0) {
		if ($.len(hashed) != crypto.Hash_Size(hash)) {
			return errors.New("crypto/rsa: input must be hashed message")
		}
		hashName = crypto.Hash_String(hash)
	}

	{
		let err = __goscript_rsa.checkPublicKeySize(pub)
		if (err != null) {
			return err
		}
	}

	if (boring.Enabled) {
		let __goscriptTuple12: any = __goscript_notboring.boringPublicKey(pub)
		let bkey: boring.PublicKeyRSA | $.VarRef<boring.PublicKeyRSA> | null = __goscriptTuple12[0]
		let err = __goscriptTuple12[1]
		if (err != null) {
			return err
		}
		{
			let __goscriptShadow1 = boring.VerifyRSAPKCS1v15(bkey, hash, hashed, sig)
			if (__goscriptShadow1 != null) {
				return __goscript_rsa.ErrVerification
			}
		}
		return null
	}

	{
		let err = checkFIPS140OnlyPublicKey(pub)
		if (err != null) {
			return err
		}
	}
	if (fips140only.Enforced() && !fips140only.ApprovedHash(fips140hash.Unwrap(await crypto.Hash_New(hash)))) {
		return errors.New("crypto/rsa: use of hash functions other than SHA-2 or SHA-3 is not allowed in FIPS 140-only mode")
	}

	let __goscriptTuple13: any = __goscript_rsa.fipsPublicKey(pub)
	let k: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = __goscriptTuple13[0]
	let err = __goscriptTuple13[1]
	if (err != null) {
		return err
	}
	return fipsError(await rsa.VerifyPKCS1v15(k, hashName, hashed, sig))
}

export function fipsError(err: $.GoError): $.GoError {
	{
		let __goscriptSwitch0 = err
		switch (true) {
			case $.comparableEqual(__goscriptSwitch0, rsa.ErrDecryption):
			{
				return __goscript_rsa.ErrDecryption
				break
			}
			case $.comparableEqual(__goscriptSwitch0, rsa.ErrVerification):
			{
				return __goscript_rsa.ErrVerification
				break
			}
			case $.comparableEqual(__goscriptSwitch0, rsa.ErrMessageTooLong):
			{
				return __goscript_rsa.ErrMessageTooLong
				break
			}
		}
	}
	return err
}

export function fipsError2(__typeArgs: $.GenericTypeArgs | undefined, x: any, err: $.GoError): [any, $.GoError] {
	return [x, fipsError(err)]
}

export function checkFIPS140OnlyPublicKey(pub: __goscript_rsa.PublicKey | $.VarRef<__goscript_rsa.PublicKey> | null): $.GoError {
	if (!fips140only.Enforced()) {
		return null
	}
	if ($.pointerValue<__goscript_rsa.PublicKey>(pub).N == null) {
		return errors.New("crypto/rsa: public key missing N")
	}
	if (big.Int.prototype.BitLen.call($.pointerValue<__goscript_rsa.PublicKey>(pub).N) < 2048) {
		return errors.New("crypto/rsa: use of keys smaller than 2048 bits is not allowed in FIPS 140-only mode")
	}
	if ((big.Int.prototype.BitLen.call($.pointerValue<__goscript_rsa.PublicKey>(pub).N) % 2) == 1) {
		return errors.New("crypto/rsa: use of keys with odd size is not allowed in FIPS 140-only mode")
	}
	if ($.pointerValue<__goscript_rsa.PublicKey>(pub).E <= (65536)) {
		return errors.New("crypto/rsa: use of public exponent <= 2¹⁶ is not allowed in FIPS 140-only mode")
	}
	if (($.pointerValue<__goscript_rsa.PublicKey>(pub).E & 1) == 0) {
		return errors.New("crypto/rsa: use of even public exponent is not allowed in FIPS 140-only mode")
	}
	return null
}

export function checkFIPS140OnlyPrivateKey(priv: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null): $.GoError {
	if (!fips140only.Enforced()) {
		return null
	}
	{
		let err = checkFIPS140OnlyPublicKey($.pointerValue<__goscript_rsa.PrivateKey>(priv)._fields.PublicKey)
		if (err != null) {
			return err
		}
	}
	if ($.len($.pointerValue<__goscript_rsa.PrivateKey>(priv).Primes) != 2) {
		return errors.New("crypto/rsa: use of multi-prime keys is not allowed in FIPS 140-only mode")
	}
	if ((($.arrayIndex($.pointerValue<__goscript_rsa.PrivateKey>(priv).Primes!, 0) == null) || ($.arrayIndex($.pointerValue<__goscript_rsa.PrivateKey>(priv).Primes!, 1) == null)) || (big.Int.prototype.BitLen.call($.arrayIndex($.pointerValue<__goscript_rsa.PrivateKey>(priv).Primes!, 0)) != big.Int.prototype.BitLen.call($.arrayIndex($.pointerValue<__goscript_rsa.PrivateKey>(priv).Primes!, 1)))) {
		return errors.New("crypto/rsa: use of primes of different sizes is not allowed in FIPS 140-only mode")
	}
	return null
}

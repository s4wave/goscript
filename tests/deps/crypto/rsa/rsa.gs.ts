// Generated file based on rsa.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as boring from "@goscript/crypto/internal/boring/index.js"

import * as bbig from "@goscript/crypto/internal/boring/bbig/index.js"

import * as bigmod from "@goscript/crypto/internal/fips140/bigmod/index.js"

import * as rsa from "@goscript/crypto/internal/fips140/rsa/index.js"

import * as fips140only from "@goscript/crypto/internal/fips140only/index.js"

import * as rand2 from "@goscript/crypto/internal/rand/index.js"

import * as cryptorand from "@goscript/crypto/rand/index.js"

import * as subtle from "@goscript/crypto/subtle/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as io from "@goscript/io/index.js"

import * as math from "@goscript/math/index.js"

import * as big from "@goscript/math/big/index.js"

import * as hash from "@goscript/hash/index.js"

import * as __goscript_fips from "./fips.gs.ts"

import * as __goscript_pkcs1v15 from "./pkcs1v15.gs.ts"
import "@goscript/crypto/index.js"
import "@goscript/crypto/internal/boring/index.js"
import "@goscript/crypto/internal/boring/bbig/index.js"
import "@goscript/crypto/internal/fips140/bigmod/index.js"
import "@goscript/crypto/internal/fips140/rsa/index.js"
import "@goscript/crypto/internal/fips140only/index.js"
import "@goscript/crypto/internal/rand/index.js"
import "@goscript/crypto/rand/index.js"
import "@goscript/crypto/subtle/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/io/index.js"
import "@goscript/math/index.js"
import "@goscript/math/big/index.js"
import "@goscript/hash/index.js"
import "./fips.gs.ts"
import "./pkcs1v15.gs.ts"

export class PublicKey {
	public get N(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.N.value
	}
	public set N(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.N.value = value
	}

	public get E(): number {
		return this._fields.E.value
	}
	public set E(value: number) {
		this._fields.E.value = value
	}

	public _fields: {
		N: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		E: $.VarRef<number>
	}

	constructor(init?: Partial<{N?: big.Int | $.VarRef<big.Int> | null, E?: number}>) {
		this._fields = {
			N: $.varRef(init?.N ?? (null! as big.Int | $.VarRef<big.Int> | null)),
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

	public Equal(x: crypto.PublicKey | null): boolean {
		const pub: PublicKey | $.VarRef<PublicKey> | null = this
		let __goscriptTuple0: any = $.typeAssertTuple<PublicKey | $.VarRef<PublicKey> | null>(x, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" })
		let xx: PublicKey | $.VarRef<PublicKey> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (!ok) {
			return false
		}
		return bigIntEqual($.pointerValue<PublicKey>(pub).N, $.pointerValue<PublicKey>(xx).N) && ($.pointerValue<PublicKey>(pub).E == $.pointerValue<PublicKey>(xx).E)
	}

	public Size(): number {
		const pub: PublicKey | $.VarRef<PublicKey> | null = this
		return Math.trunc((big.Int.prototype.BitLen.call($.pointerValue<PublicKey>(pub).N) + 7) / 8)
	}

	static __typeInfo = $.registerStructType(
		"rsa.PublicKey",
		() => new PublicKey(),
		[{ name: "Equal", args: [{ name: "x", type: "crypto.PublicKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		PublicKey,
		[{ name: "N", key: "N", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [0], offset: 0, exported: true }, { name: "E", key: "E", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 8, exported: true }]
	)
}

export class OAEPOptions {
	// Hash is the hash function that will be used when generating the mask.
	public get Hash(): crypto.Hash {
		return this._fields.Hash.value
	}
	public set Hash(value: crypto.Hash) {
		this._fields.Hash.value = value
	}

	// MGFHash is the hash function used for MGF1.
	// If zero, Hash is used instead.
	public get MGFHash(): crypto.Hash {
		return this._fields.MGFHash.value
	}
	public set MGFHash(value: crypto.Hash) {
		this._fields.MGFHash.value = value
	}

	// Label is an arbitrary byte string that must be equal to the value
	// used when encrypting.
	public get Label(): $.Slice<number> {
		return this._fields.Label.value
	}
	public set Label(value: $.Slice<number>) {
		this._fields.Label.value = value
	}

	public _fields: {
		Hash: $.VarRef<crypto.Hash>
		MGFHash: $.VarRef<crypto.Hash>
		Label: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{Hash?: crypto.Hash, MGFHash?: crypto.Hash, Label?: $.Slice<number>}>) {
		this._fields = {
			Hash: $.varRef(init?.Hash ?? (0 as crypto.Hash)),
			MGFHash: $.varRef(init?.MGFHash ?? (0 as crypto.Hash)),
			Label: $.varRef(init?.Label ?? (null! as $.Slice<number>))
		}
	}

	public clone(): OAEPOptions {
		const cloned = new OAEPOptions()
		cloned._fields = {
			Hash: $.varRef(this._fields.Hash.value),
			MGFHash: $.varRef(this._fields.MGFHash.value),
			Label: $.varRef(this._fields.Label.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"rsa.OAEPOptions",
		() => new OAEPOptions(),
		[],
		OAEPOptions,
		[{ name: "Hash", key: "Hash", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" }, index: [0], offset: 0, exported: true }, { name: "MGFHash", key: "MGFHash", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" }, index: [1], offset: 8, exported: true }, { name: "Label", key: "Label", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [2], offset: 16, exported: true }]
	)
}

export class PrecomputedValues {
	public get Dp(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Dp.value
	}
	public set Dp(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Dp.value = value
	}

	public get Dq(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Dq.value
	}
	public set Dq(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Dq.value = value
	}

	public get Qinv(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Qinv.value
	}
	public set Qinv(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Qinv.value = value
	}

	// CRTValues is used for the 3rd and subsequent primes. Due to a
	// historical accident, the CRT for the first two primes is handled
	// differently in PKCS #1 and interoperability is sufficiently
	// important that we mirror this.
	//
	// Deprecated: These values are still filled in by Precompute for
	// backwards compatibility but are not used. Multi-prime RSA is very rare,
	// and is implemented by this package without CRT optimizations to limit
	// complexity.
	public get CRTValues(): $.Slice<CRTValue> {
		return this._fields.CRTValues.value
	}
	public set CRTValues(value: $.Slice<CRTValue>) {
		this._fields.CRTValues.value = value
	}

	public get fips(): rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null {
		return this._fields.fips.value
	}
	public set fips(value: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null) {
		this._fields.fips.value = value
	}

	public _fields: {
		Dp: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Dq: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Qinv: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		CRTValues: $.VarRef<$.Slice<CRTValue>>
		fips: $.VarRef<rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null>
	}

	constructor(init?: Partial<{Dp?: big.Int | $.VarRef<big.Int> | null, Dq?: big.Int | $.VarRef<big.Int> | null, Qinv?: big.Int | $.VarRef<big.Int> | null, CRTValues?: $.Slice<CRTValue>, fips?: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null}>) {
		this._fields = {
			Dp: $.varRef(init?.Dp ?? (null! as big.Int | $.VarRef<big.Int> | null)),
			Dq: $.varRef(init?.Dq ?? (null! as big.Int | $.VarRef<big.Int> | null)),
			Qinv: $.varRef(init?.Qinv ?? (null! as big.Int | $.VarRef<big.Int> | null)),
			CRTValues: $.varRef(init?.CRTValues ?? (null! as $.Slice<CRTValue>)),
			fips: $.varRef(init?.fips ?? (null! as rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null))
		}
	}

	public clone(): PrecomputedValues {
		const cloned = new PrecomputedValues()
		cloned._fields = {
			Dp: $.varRef(this._fields.Dp.value),
			Dq: $.varRef(this._fields.Dq.value),
			Qinv: $.varRef(this._fields.Qinv.value),
			CRTValues: $.varRef(this._fields.CRTValues.value),
			fips: $.varRef(this._fields.fips.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"rsa.PrecomputedValues",
		() => new PrecomputedValues(),
		[],
		PrecomputedValues,
		[{ name: "Dp", key: "Dp", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [0], offset: 0, exported: true }, { name: "Dq", key: "Dq", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [1], offset: 8, exported: true }, { name: "Qinv", key: "Qinv", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [2], offset: 16, exported: true }, { name: "CRTValues", key: "CRTValues", type: { kind: $.TypeKind.Slice, elemType: "rsa.CRTValue" }, index: [3], offset: 24, exported: true }, { name: "fips", key: "fips", type: { kind: $.TypeKind.Pointer, elemType: "rsa.PrivateKey" }, pkgPath: "crypto/rsa", index: [4], offset: 48, exported: false }]
	)
}

export class PrivateKey {
	public get PublicKey(): PublicKey {
		return this._fields.PublicKey.value
	}
	public set PublicKey(value: PublicKey) {
		this._fields.PublicKey.value = value
	}

	public get D(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.D.value
	}
	public set D(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.D.value = value
	}

	public get Primes(): $.Slice<big.Int | $.VarRef<big.Int> | null> {
		return this._fields.Primes.value
	}
	public set Primes(value: $.Slice<big.Int | $.VarRef<big.Int> | null>) {
		this._fields.Primes.value = value
	}

	// Precomputed contains precomputed values that speed up RSA operations,
	// if available. It must be generated by calling PrivateKey.Precompute and
	// must not be modified afterwards.
	public get Precomputed(): PrecomputedValues {
		return this._fields.Precomputed.value
	}
	public set Precomputed(value: PrecomputedValues) {
		this._fields.Precomputed.value = value
	}

	public _fields: {
		PublicKey: $.VarRef<PublicKey>
		D: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Primes: $.VarRef<$.Slice<big.Int | $.VarRef<big.Int> | null>>
		Precomputed: $.VarRef<PrecomputedValues>
	}

	constructor(init?: Partial<{PublicKey?: PublicKey, D?: big.Int | $.VarRef<big.Int> | null, Primes?: $.Slice<big.Int | $.VarRef<big.Int> | null>, Precomputed?: PrecomputedValues}>) {
		this._fields = {
			PublicKey: $.varRef(init?.PublicKey ? $.markAsStructValue($.cloneStructValue(init.PublicKey)) : $.markAsStructValue(new PublicKey())),
			D: $.varRef(init?.D ?? (null! as big.Int | $.VarRef<big.Int> | null)),
			Primes: $.varRef(init?.Primes ?? (null! as $.Slice<big.Int | $.VarRef<big.Int> | null>)),
			Precomputed: $.varRef(init?.Precomputed ? $.markAsStructValue($.cloneStructValue(init.Precomputed)) : $.markAsStructValue(new PrecomputedValues()))
		}
	}

	public clone(): PrivateKey {
		const cloned = new PrivateKey()
		cloned._fields = {
			PublicKey: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.PublicKey.value))),
			D: $.varRef(this._fields.D.value),
			Primes: $.varRef(this._fields.Primes.value),
			Precomputed: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Precomputed.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public async Decrypt(rand: io.Reader | null, ciphertext: $.Slice<number>, opts: crypto.DecrypterOpts | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		let plaintext: $.Slice<number> = null! as $.Slice<number>
		let err: $.GoError = null! as $.GoError
		if (opts == null) {
			return __goscript_pkcs1v15.DecryptPKCS1v15(rand, priv, ciphertext)
		}

		{
			const __goscriptTypeSwitchValue = opts
			switch (true) {
				case $.typeAssert<OAEPOptions | $.VarRef<OAEPOptions> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.OAEPOptions" }).ok:
					{
						let opts: OAEPOptions | $.VarRef<OAEPOptions> | null = $.typeAssert<OAEPOptions | $.VarRef<OAEPOptions> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.OAEPOptions" }).value
						if ($.pointerValue<OAEPOptions>(opts).MGFHash == 0) {
							return __goscript_fips.decryptOAEP(await crypto.Hash_New($.pointerValue<OAEPOptions>(opts).Hash), await crypto.Hash_New($.pointerValue<OAEPOptions>(opts).Hash), priv, ciphertext, $.pointerValue<OAEPOptions>(opts).Label)
						} else {
							return __goscript_fips.decryptOAEP(await crypto.Hash_New($.pointerValue<OAEPOptions>(opts).Hash), await crypto.Hash_New($.pointerValue<OAEPOptions>(opts).MGFHash), priv, ciphertext, $.pointerValue<OAEPOptions>(opts).Label)
						}
					}
					break
				case $.typeAssert<__goscript_pkcs1v15.PKCS1v15DecryptOptions | $.VarRef<__goscript_pkcs1v15.PKCS1v15DecryptOptions> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PKCS1v15DecryptOptions" }).ok:
					{
						let opts: __goscript_pkcs1v15.PKCS1v15DecryptOptions | $.VarRef<__goscript_pkcs1v15.PKCS1v15DecryptOptions> | null = $.typeAssert<__goscript_pkcs1v15.PKCS1v15DecryptOptions | $.VarRef<__goscript_pkcs1v15.PKCS1v15DecryptOptions> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PKCS1v15DecryptOptions" }).value
						{
							let l = $.pointerValue<__goscript_pkcs1v15.PKCS1v15DecryptOptions>(opts).SessionKeyLen
							if (l > 0) {
								plaintext = $.makeSlice<number>(l, undefined, "byte")
								{
									let [, __goscriptShadow0] = await io.ReadFull($.pointerValueOrNil(rand)!, plaintext)
									if (__goscriptShadow0 != null) {
										return [null, __goscriptShadow0]
									}
								}
								{
									let __goscriptShadow1 = await __goscript_pkcs1v15.DecryptPKCS1v15SessionKey(rand, priv, ciphertext, plaintext)
									if (__goscriptShadow1 != null) {
										return [null, __goscriptShadow1]
									}
								}
								return [plaintext, null]
							} else {
								return __goscript_pkcs1v15.DecryptPKCS1v15(rand, priv, ciphertext)
							}
						}
					}
					break
				default:
					{
						let opts: any = __goscriptTypeSwitchValue
						return [null, errors.New("crypto/rsa: invalid options for Decrypt")]
					}
					break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public Equal(x: crypto.PrivateKey | null): boolean {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		let __goscriptTuple1: any = $.typeAssertTuple<PrivateKey | $.VarRef<PrivateKey> | null>(x, { kind: $.TypeKind.Pointer, elemType: "rsa.PrivateKey" })
		let xx: PrivateKey | $.VarRef<PrivateKey> | null = __goscriptTuple1[0]
		let ok = __goscriptTuple1[1]
		if (!ok) {
			return false
		}
		if (!$.pointerValue<PrivateKey>(priv).PublicKey.Equal($.interfaceValue<crypto.PublicKey | null>($.pointerValue<PrivateKey>(xx)._fields.PublicKey, "*rsa.PublicKey", { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" })) || !bigIntEqual($.pointerValue<PrivateKey>(priv).D, $.pointerValue<PrivateKey>(xx).D)) {
			return false
		}
		if ($.len($.pointerValue<PrivateKey>(priv).Primes) != $.len($.pointerValue<PrivateKey>(xx).Primes)) {
			return false
		}
		for (let __goscriptRangeTarget0 = $.pointerValue<PrivateKey>(priv).Primes, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			if (!bigIntEqual($.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, i), $.arrayIndex($.pointerValue<PrivateKey>(xx).Primes!, i))) {
				return false
			}
		}
		return true
	}

	public async Precompute(): globalThis.Promise<void> {
		let priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		if (PrivateKey.prototype.precomputedIsConsistent.call(priv)) {
			return
		}

		let [precomputed, err] = await PrivateKey.prototype.precompute.call(priv)
		if (err != null) {
			// We don't have a way to report errors, so just leave Precomputed.fips
			// nil. Validate will re-run precompute and report its error.
			$.pointerValue<PrivateKey>(priv).Precomputed.fips = null
			return
		}
		$.pointerValue<PrivateKey>(priv).Precomputed = $.markAsStructValue($.cloneStructValue(precomputed))
	}

	public Public(): crypto.PublicKey | null {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		return $.interfaceValue<crypto.PublicKey | null>($.pointerValue<PrivateKey>(priv)._fields.PublicKey, "*rsa.PublicKey", { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" })
	}

	public async Sign(rand: io.Reader | null, digest: $.Slice<number>, opts: crypto.SignerOpts | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		{
			let __goscriptTuple2: any = $.typeAssertTuple<__goscript_fips.PSSOptions | $.VarRef<__goscript_fips.PSSOptions> | null>(opts, { kind: $.TypeKind.Pointer, elemType: "rsa.PSSOptions" })
			let pssOpts: __goscript_fips.PSSOptions | $.VarRef<__goscript_fips.PSSOptions> | null = __goscriptTuple2[0]
			let ok = __goscriptTuple2[1]
			if (ok) {
				return __goscript_fips.SignPSS(rand, priv, $.pointerValue<__goscript_fips.PSSOptions>(pssOpts).Hash, digest, pssOpts)
			}
		}

		return __goscript_fips.SignPKCS1v15(rand, priv, await $.pointerValue<Exclude<crypto.SignerOpts, null>>(opts).HashFunc(), digest)
	}

	public async Validate(): globalThis.Promise<$.GoError> {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		// We can operate on keys based on d alone, but they can't be encoded with
		// [crypto/x509.MarshalPKCS1PrivateKey], which unfortunately doesn't return
		// an error, so we need to reject them here.
		if ($.len($.pointerValue<PrivateKey>(priv).Primes) < 2) {
			return errors.New("crypto/rsa: missing primes")
		}
		// If Precomputed.fips is set and consistent, then the key has been
		// validated by [rsa.NewPrivateKey] or [rsa.NewPrivateKeyWithoutCRT].
		if (PrivateKey.prototype.precomputedIsConsistent.call(priv)) {
			return null
		}
		if ($.pointerValue<PrivateKey>(priv).Precomputed.fips != null) {
			return errors.New("crypto/rsa: precomputed values are inconsistent with the key")
		}
		let [, err] = await PrivateKey.prototype.precompute.call(priv)
		return err
	}

	public async precompute(): globalThis.Promise<[PrecomputedValues, $.GoError]> {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		let precomputed: PrecomputedValues = $.markAsStructValue(new PrecomputedValues())

		if ($.pointerValue<PrivateKey>(priv).PublicKey.N == null) {
			return [$.markAsStructValue($.cloneStructValue(precomputed)), errors.New("crypto/rsa: missing public modulus")]
		}
		if ($.pointerValue<PrivateKey>(priv).D == null) {
			return [$.markAsStructValue($.cloneStructValue(precomputed)), errors.New("crypto/rsa: missing private exponent")]
		}
		if ($.len($.pointerValue<PrivateKey>(priv).Primes) != 2) {
			return PrivateKey.prototype.precomputeLegacy.call(priv)
		}
		if ($.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 0) == null) {
			return [$.markAsStructValue($.cloneStructValue(precomputed)), errors.New("crypto/rsa: prime P is nil")]
		}
		if ($.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 1) == null) {
			return [$.markAsStructValue($.cloneStructValue(precomputed)), errors.New("crypto/rsa: prime Q is nil")]
		}

		// If the CRT values are already set, use them.
		if ((($.pointerValue<PrivateKey>(priv).Precomputed.Dp != null) && ($.pointerValue<PrivateKey>(priv).Precomputed.Dq != null)) && ($.pointerValue<PrivateKey>(priv).Precomputed.Qinv != null)) {
			let __goscriptTuple3: any = rsa.NewPrivateKeyWithPrecomputation(big.Int.prototype.Bytes.call($.pointerValue<PrivateKey>(priv).PublicKey.N), $.pointerValue<PrivateKey>(priv).PublicKey.E, big.Int.prototype.Bytes.call($.pointerValue<PrivateKey>(priv).D), big.Int.prototype.Bytes.call($.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 0)), big.Int.prototype.Bytes.call($.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 1)), big.Int.prototype.Bytes.call($.pointerValue<PrivateKey>(priv).Precomputed.Dp), big.Int.prototype.Bytes.call($.pointerValue<PrivateKey>(priv).Precomputed.Dq), big.Int.prototype.Bytes.call($.pointerValue<PrivateKey>(priv).Precomputed.Qinv))
			let k: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null = __goscriptTuple3[0]
			let err = __goscriptTuple3[1]
			if (err != null) {
				return [$.markAsStructValue($.cloneStructValue(precomputed)), err]
			}
			precomputed = $.markAsStructValue($.cloneStructValue($.pointerValue<PrivateKey>(priv).Precomputed))
			precomputed.fips = k
			precomputed.CRTValues = $.makeSlice<CRTValue>(0, undefined, undefined, () => $.markAsStructValue(new CRTValue()))
			return [$.markAsStructValue($.cloneStructValue(precomputed)), null]
		}

		let __goscriptTuple4: any = rsa.NewPrivateKey(big.Int.prototype.Bytes.call($.pointerValue<PrivateKey>(priv).PublicKey.N), $.pointerValue<PrivateKey>(priv).PublicKey.E, big.Int.prototype.Bytes.call($.pointerValue<PrivateKey>(priv).D), big.Int.prototype.Bytes.call($.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 0)), big.Int.prototype.Bytes.call($.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 1)))
		let k: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null = __goscriptTuple4[0]
		let err = __goscriptTuple4[1]
		if (err != null) {
			return [$.markAsStructValue($.cloneStructValue(precomputed)), err]
		}

		precomputed.fips = k
		let __goscriptTuple5: any = rsa.PrivateKey.prototype.Export.call(k)
		let dP: $.Slice<number> = __goscriptTuple5[5]
		let dQ: $.Slice<number> = __goscriptTuple5[6]
		let qInv: $.Slice<number> = __goscriptTuple5[7]
		precomputed.Dp = big.Int.prototype.SetBytes.call(new big.Int(), dP)
		precomputed.Dq = big.Int.prototype.SetBytes.call(new big.Int(), dQ)
		precomputed.Qinv = big.Int.prototype.SetBytes.call(new big.Int(), qInv)
		precomputed.CRTValues = $.makeSlice<CRTValue>(0, undefined, undefined, () => $.markAsStructValue(new CRTValue()))
		return [$.markAsStructValue($.cloneStructValue(precomputed)), null]
	}

	public async precomputeLegacy(): globalThis.Promise<[PrecomputedValues, $.GoError]> {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		let precomputed: PrecomputedValues = $.markAsStructValue(new PrecomputedValues())

		let __goscriptTuple6: any = rsa.NewPrivateKeyWithoutCRT(big.Int.prototype.Bytes.call($.pointerValue<PrivateKey>(priv).PublicKey.N), $.pointerValue<PrivateKey>(priv).PublicKey.E, big.Int.prototype.Bytes.call($.pointerValue<PrivateKey>(priv).D))
		let k: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null = __goscriptTuple6[0]
		let err = __goscriptTuple6[1]
		if (err != null) {
			return [$.markAsStructValue($.cloneStructValue(precomputed)), err]
		}
		precomputed.fips = k

		if ($.len($.pointerValue<PrivateKey>(priv).Primes) < 2) {
			return [$.markAsStructValue($.cloneStructValue(precomputed)), null]
		}

		// Ensure the Mod and ModInverse calls below don't panic.
		for (let __goscriptRangeTarget1 = $.pointerValue<PrivateKey>(priv).Primes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let prime = __goscriptRangeTarget1![__rangeIndex]
			if (prime == null) {
				return [$.markAsStructValue($.cloneStructValue(precomputed)), errors.New("crypto/rsa: prime factor is nil")]
			}
			if (big.Int.prototype.Cmp.call(prime, bigOne) <= 0) {
				return [$.markAsStructValue($.cloneStructValue(precomputed)), errors.New("crypto/rsa: prime factor is <= 1")]
			}
		}

		precomputed.Dp = big.Int.prototype.Sub.call(new big.Int(), $.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 0), bigOne)
		await big.Int.prototype.Mod.call(precomputed.Dp, $.pointerValue<PrivateKey>(priv).D, precomputed.Dp)

		precomputed.Dq = big.Int.prototype.Sub.call(new big.Int(), $.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 1), bigOne)
		await big.Int.prototype.Mod.call(precomputed.Dq, $.pointerValue<PrivateKey>(priv).D, precomputed.Dq)

		precomputed.Qinv = await big.Int.prototype.ModInverse.call(new big.Int(), $.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 1), $.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 0))
		if (precomputed.Qinv == null) {
			return [$.markAsStructValue($.cloneStructValue(precomputed)), errors.New("crypto/rsa: prime factors are not relatively prime")]
		}

		let r: big.Int | $.VarRef<big.Int> | null = await big.Int.prototype.Mul.call(new big.Int(), $.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 0), $.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 1))
		precomputed.CRTValues = $.makeSlice<CRTValue>($.len($.pointerValue<PrivateKey>(priv).Primes) - 2, undefined, undefined, () => $.markAsStructValue(new CRTValue()))
		for (let i = 2; i < $.len($.pointerValue<PrivateKey>(priv).Primes); i++) {
			let prime: big.Int | $.VarRef<big.Int> | null = $.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, i)
			let values: CRTValue | $.VarRef<CRTValue> | null = $.indexRef(precomputed.CRTValues!, i - 2)

			$.pointerValue<CRTValue>(values).Exp = big.Int.prototype.Sub.call(new big.Int(), prime, bigOne)
			await big.Int.prototype.Mod.call($.pointerValue<CRTValue>(values).Exp, $.pointerValue<PrivateKey>(priv).D, $.pointerValue<CRTValue>(values).Exp)

			$.pointerValue<CRTValue>(values).R = big.Int.prototype.Set.call(new big.Int(), r)
			$.pointerValue<CRTValue>(values).Coeff = await big.Int.prototype.ModInverse.call(new big.Int(), r, prime)
			if ($.pointerValue<CRTValue>(values).Coeff == null) {
				return [$.markAsStructValue($.cloneStructValue(precomputed)), errors.New("crypto/rsa: prime factors are not relatively prime")]
			}

			await big.Int.prototype.Mul.call(r, r, prime)
		}

		return [$.markAsStructValue($.cloneStructValue(precomputed)), null]
	}

	public precomputedIsConsistent(): boolean {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		if ($.pointerValue<PrivateKey>(priv).Precomputed.fips == null) {
			return false
		}
		let __goscriptTuple7: any = rsa.PrivateKey.prototype.Export.call($.pointerValue<PrivateKey>(priv).Precomputed.fips)
		let N: $.Slice<number> = __goscriptTuple7[0]
		let e = __goscriptTuple7[1]
		let d: $.Slice<number> = __goscriptTuple7[2]
		let P: $.Slice<number> = __goscriptTuple7[3]
		let Q: $.Slice<number> = __goscriptTuple7[4]
		let dP: $.Slice<number> = __goscriptTuple7[5]
		let dQ: $.Slice<number> = __goscriptTuple7[6]
		let qInv: $.Slice<number> = __goscriptTuple7[7]
		if ((!bigIntEqualToBytes($.pointerValue<PrivateKey>(priv).PublicKey.N, N) || ($.pointerValue<PrivateKey>(priv).PublicKey.E != e)) || !bigIntEqualToBytes($.pointerValue<PrivateKey>(priv).D, d)) {
			return false
		}
		if ($.len($.pointerValue<PrivateKey>(priv).Primes) != 2) {
			return ((((P == null) && (Q == null)) && (dP == null)) && (dQ == null)) && (qInv == null)
		}
		return (((bigIntEqualToBytes($.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 0), P) && bigIntEqualToBytes($.arrayIndex($.pointerValue<PrivateKey>(priv).Primes!, 1), Q)) && bigIntEqualToBytes($.pointerValue<PrivateKey>(priv).Precomputed.Dp, dP)) && bigIntEqualToBytes($.pointerValue<PrivateKey>(priv).Precomputed.Dq, dQ)) && bigIntEqualToBytes($.pointerValue<PrivateKey>(priv).Precomputed.Qinv, qInv)
	}

	public Size(): any {
		return $.pointerValue<PublicKey>(this.PublicKey).Size()
	}

	static __typeInfo = $.registerStructType(
		"rsa.PrivateKey",
		() => new PrivateKey(),
		[{ name: "Decrypt", args: [{ name: "rand", type: "io.Reader" }, { name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "opts", type: "crypto.DecrypterOpts" }], returns: [{ name: "plaintext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "Equal", args: [{ name: "x", type: "crypto.PrivateKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Precompute", args: [], returns: [] }, { name: "Public", args: [], returns: [{ name: "_r0", type: "crypto.PublicKey" }] }, { name: "Sign", args: [{ name: "rand", type: "io.Reader" }, { name: "digest", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "opts", type: "crypto.SignerOpts" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Validate", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "precompute", args: [], returns: [{ name: "_r0", type: "rsa.PrecomputedValues" }, { name: "_r1", type: "error" }] }, { name: "precomputeLegacy", args: [], returns: [{ name: "_r0", type: "rsa.PrecomputedValues" }, { name: "_r1", type: "error" }] }, { name: "precomputedIsConsistent", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		PrivateKey,
		[{ name: "PublicKey", key: "PublicKey", type: "rsa.PublicKey", anonymous: true, index: [0], offset: 0, exported: true }, { name: "D", key: "D", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [1], offset: 16, exported: true }, { name: "Primes", key: "Primes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, index: [2], offset: 24, exported: true }, { name: "Precomputed", key: "Precomputed", type: "rsa.PrecomputedValues", index: [3], offset: 48, exported: true }]
	)
}

export class CRTValue {
	public get Exp(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Exp.value
	}
	public set Exp(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Exp.value = value
	}

	public get Coeff(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Coeff.value
	}
	public set Coeff(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Coeff.value = value
	}

	public get R(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.R.value
	}
	public set R(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.R.value = value
	}

	public _fields: {
		Exp: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Coeff: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		R: $.VarRef<big.Int | $.VarRef<big.Int> | null>
	}

	constructor(init?: Partial<{Exp?: big.Int | $.VarRef<big.Int> | null, Coeff?: big.Int | $.VarRef<big.Int> | null, R?: big.Int | $.VarRef<big.Int> | null}>) {
		this._fields = {
			Exp: $.varRef(init?.Exp ?? (null! as big.Int | $.VarRef<big.Int> | null)),
			Coeff: $.varRef(init?.Coeff ?? (null! as big.Int | $.VarRef<big.Int> | null)),
			R: $.varRef(init?.R ?? (null! as big.Int | $.VarRef<big.Int> | null))
		}
	}

	public clone(): CRTValue {
		const cloned = new CRTValue()
		cloned._fields = {
			Exp: $.varRef(this._fields.Exp.value),
			Coeff: $.varRef(this._fields.Coeff.value),
			R: $.varRef(this._fields.R.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"rsa.CRTValue",
		() => new CRTValue(),
		[],
		CRTValue,
		[{ name: "Exp", key: "Exp", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [0], offset: 0, exported: true }, { name: "Coeff", key: "Coeff", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [1], offset: 8, exported: true }, { name: "R", key: "R", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [2], offset: 16, exported: true }]
	)
}

export let bigOne: big.Int | $.VarRef<big.Int> | null = await big.NewInt(1n)

export function __goscript_set_bigOne(__goscriptValue: big.Int | $.VarRef<big.Int> | null): void {
	bigOne = __goscriptValue
}

export function bigIntEqual(a: big.Int | $.VarRef<big.Int> | null, b: big.Int | $.VarRef<big.Int> | null): boolean {
	return subtle.ConstantTimeCompare(big.Int.prototype.Bytes.call(a), big.Int.prototype.Bytes.call(b)) == 1
}

export function bigIntEqualToBytes(a: big.Int | $.VarRef<big.Int> | null, b: $.Slice<number>): boolean {
	if ((a == null) || (big.Int.prototype.BitLen.call(a) > ($.len(b) * 8))) {
		return false
	}
	let buf: $.Slice<number> = big.Int.prototype.FillBytes.call(a, $.makeSlice<number>($.len(b), undefined, "byte"))
	return subtle.ConstantTimeCompare(buf, b) == 1
}

export let rsa1024min: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("rsa1024min")

export function __goscript_set_rsa1024min(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	rsa1024min = __goscriptValue
}

export function checkKeySize(size: number): $.GoError {
	if (size >= 1024) {
		return null
	}
	if ($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(rsa1024min)), "0")) {
		godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(rsa1024min))
		return null
	}
	return fmt.Errorf("crypto/rsa: %d-bit keys are insecure (see https://go.dev/pkg/crypto/rsa#hdr-Minimum_key_size)", $.basicInterfaceValue(size, "int"))
}

export function checkPublicKeySize(k: PublicKey | $.VarRef<PublicKey> | null): $.GoError {
	if ($.pointerValue<PublicKey>(k).N == null) {
		return errors.New("crypto/rsa: missing public modulus")
	}
	return checkKeySize(big.Int.prototype.BitLen.call($.pointerValue<PublicKey>(k).N))
}

export async function GenerateKey(random: io.Reader | null, bits: number): globalThis.Promise<[PrivateKey | $.VarRef<PrivateKey> | null, $.GoError]> {
	{
		let err = checkKeySize(bits)
		if (err != null) {
			return [null, err]
		}
	}

	if ((boring.Enabled && rand2.IsDefaultReader(random)) && (((bits == 2048) || (bits == 3072)) || (bits == 4096))) {
		let __goscriptTuple8: any = boring.GenerateKeyRSA(bits)
		let bN: boring.BigInt = (__goscriptTuple8[0] as boring.BigInt)
		let bE: boring.BigInt = (__goscriptTuple8[1] as boring.BigInt)
		let bD: boring.BigInt = (__goscriptTuple8[2] as boring.BigInt)
		let bP: boring.BigInt = (__goscriptTuple8[3] as boring.BigInt)
		let bQ: boring.BigInt = (__goscriptTuple8[4] as boring.BigInt)
		let bDp: boring.BigInt = (__goscriptTuple8[5] as boring.BigInt)
		let bDq: boring.BigInt = (__goscriptTuple8[6] as boring.BigInt)
		let bQinv: boring.BigInt = (__goscriptTuple8[7] as boring.BigInt)
		let err = __goscriptTuple8[8]
		if (err != null) {
			return [null, err]
		}
		let N: big.Int | $.VarRef<big.Int> | null = bbig.Dec((bN as boring.BigInt))
		let E: big.Int | $.VarRef<big.Int> | null = bbig.Dec((bE as boring.BigInt))
		let D: big.Int | $.VarRef<big.Int> | null = bbig.Dec((bD as boring.BigInt))
		let P: big.Int | $.VarRef<big.Int> | null = bbig.Dec((bP as boring.BigInt))
		let Q: big.Int | $.VarRef<big.Int> | null = bbig.Dec((bQ as boring.BigInt))
		let Dp: big.Int | $.VarRef<big.Int> | null = bbig.Dec((bDp as boring.BigInt))
		let Dq: big.Int | $.VarRef<big.Int> | null = bbig.Dec((bDq as boring.BigInt))
		let Qinv: big.Int | $.VarRef<big.Int> | null = bbig.Dec((bQinv as boring.BigInt))
		let e64 = big.Int.prototype.Int64.call(E)
		if (!big.Int.prototype.IsInt64.call(E) || ($.int64($.int(e64)) != e64)) {
			return [null, errors.New("crypto/rsa: generated key exponent too large")]
		}

		let key: PrivateKey | $.VarRef<PrivateKey> | null = new PrivateKey({PublicKey: $.markAsStructValue(new PublicKey({N: N, E: $.int(e64)})), D: D, Primes: $.arrayToSlice<big.Int | $.VarRef<big.Int> | null>([P, Q]), Precomputed: $.markAsStructValue(new PrecomputedValues({Dp: Dp, Dq: Dq, Qinv: Qinv, CRTValues: $.makeSlice<CRTValue>(0, undefined, undefined, () => $.markAsStructValue(new CRTValue()))}))})
		return [key, null]
	}

	random = await rand2.CustomReader(random)

	if (fips140only.Enforced() && (bits < 2048)) {
		return [null, errors.New("crypto/rsa: use of keys smaller than 2048 bits is not allowed in FIPS 140-only mode")]
	}
	if (fips140only.Enforced() && ((bits % 2) == 1)) {
		return [null, errors.New("crypto/rsa: use of keys with odd size is not allowed in FIPS 140-only mode")]
	}
	if (fips140only.Enforced() && !fips140only.ApprovedRandomReader(random)) {
		return [null, errors.New("crypto/rsa: only crypto/rand.Reader is allowed in FIPS 140-only mode")]
	}

	let __goscriptTuple9: any = await rsa.GenerateKey(random, bits)
	let k: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null = __goscriptTuple9[0]
	let err = __goscriptTuple9[1]
	if ((bits < 256) && (err != null)) {
		// Toy-sized keys have a non-negligible chance of hitting two hard
		// failure cases: p == q and d <= 2^(nlen / 2).
		//
		// Since these are impossible to hit for real keys, we don't want to
		// make the production code path more complex and harder to think about
		// to handle them.
		//
		// Instead, just rerun the whole process a total of 8 times, which
		// brings the chance of failure for 32-bit keys down to the same as for
		// 256-bit keys.
		for (let i = 1; (i < 8) && (err != null); i++) {
			let __goscriptTuple10: any = await rsa.GenerateKey(random, bits)
			k = __goscriptTuple10[0]
			err = __goscriptTuple10[1]
		}
	}
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple11: any = rsa.PrivateKey.prototype.Export.call(k)
	let N: $.Slice<number> = __goscriptTuple11[0]
	let e = __goscriptTuple11[1]
	let d: $.Slice<number> = __goscriptTuple11[2]
	let p: $.Slice<number> = __goscriptTuple11[3]
	let q: $.Slice<number> = __goscriptTuple11[4]
	let dP: $.Slice<number> = __goscriptTuple11[5]
	let dQ: $.Slice<number> = __goscriptTuple11[6]
	let qInv: $.Slice<number> = __goscriptTuple11[7]
	let key: PrivateKey | $.VarRef<PrivateKey> | null = (() => { const __goscriptLiteralField1 = big.Int.prototype.SetBytes.call(new big.Int(), d); return new PrivateKey({PublicKey: (() => { const __goscriptLiteralField0 = big.Int.prototype.SetBytes.call(new big.Int(), N); return $.markAsStructValue(new PublicKey({N: __goscriptLiteralField0, E: e})) })(), D: __goscriptLiteralField1, Primes: $.arrayToSlice<big.Int | $.VarRef<big.Int> | null>([big.Int.prototype.SetBytes.call(new big.Int(), p), big.Int.prototype.SetBytes.call(new big.Int(), q)]), Precomputed: (() => { const __goscriptLiteralField2 = big.Int.prototype.SetBytes.call(new big.Int(), dP); const __goscriptLiteralField3 = big.Int.prototype.SetBytes.call(new big.Int(), dQ); const __goscriptLiteralField4 = big.Int.prototype.SetBytes.call(new big.Int(), qInv); return $.markAsStructValue(new PrecomputedValues({fips: k, Dp: __goscriptLiteralField2, Dq: __goscriptLiteralField3, Qinv: __goscriptLiteralField4, CRTValues: $.makeSlice<CRTValue>(0, undefined, undefined, () => $.markAsStructValue(new CRTValue()))})) })()}) })()
	return [key, null]
}

export async function GenerateMultiPrimeKey(random: io.Reader | null, nprimes: number, bits: number): globalThis.Promise<[PrivateKey | $.VarRef<PrivateKey> | null, $.GoError]> {
	if (nprimes == 2) {
		return GenerateKey(random, bits)
	}
	if (fips140only.Enforced()) {
		return [null, errors.New("crypto/rsa: multi-prime RSA is not allowed in FIPS 140-only mode")]
	}

	random = await rand2.CustomReader(random)

	let priv: PrivateKey | $.VarRef<PrivateKey> | null = new PrivateKey()
	$.pointerValue<PrivateKey>(priv).PublicKey.E = 65537

	if (nprimes < 2) {
		return [null, errors.New("crypto/rsa: GenerateMultiPrimeKey: nprimes must be >= 2")]
	}

	if (bits < 64) {
		let primeLimit = Number($.uint64Shl(1n, $.uint(Math.trunc(bits / nprimes), 64)))
		// pi approximates the number of primes less than primeLimit
		let pi = primeLimit / (math.Log(primeLimit) - 1)
		// Generated primes start with 11 (in binary) so we can only
		// use a quarter of them.
		pi = pi / (4)
		// Use a factor of two to ensure that key generation terminates
		// in a reasonable amount of time.
		pi = pi / (2)
		if (pi <= nprimes) {
			return [null, errors.New("crypto/rsa: too few primes of given length to generate an RSA key")]
		}
	}

	let primes: $.Slice<big.Int | $.VarRef<big.Int> | null> = $.makeSlice<big.Int | $.VarRef<big.Int> | null>(nprimes)

	NextSetOfPrimes: while (true) {
		let todo = bits
		// crypto/rand should set the top two bits in each prime.
		// Thus each prime has the form
		//   p_i = 2^bitlen(p_i) × 0.11... (in base 2).
		// And the product is:
		//   P = 2^todo × α
		// where α is the product of nprimes numbers of the form 0.11...
		//
		// If α < 1/2 (which can happen for nprimes > 2), we need to
		// shift todo to compensate for lost bits: the mean value of 0.11...
		// is 7/8, so todo + shift - nprimes * log2(7/8) ~= bits - 1/2
		// will give good results.
		if (nprimes >= 7) {
			todo = todo + (Math.trunc((nprimes - 2) / 5))
		}
		for (let i = 0; i < nprimes; i++) {
			let err: $.GoError = null! as $.GoError
			let __goscriptTuple12: any = await cryptorand.Prime($.pointerValueOrNil(random)!, Math.trunc(todo / (nprimes - i)))
			primes![i] = __goscriptTuple12[0]
			err = __goscriptTuple12[1]
			if (err != null) {
				return [null, err]
			}
			todo = todo - (big.Int.prototype.BitLen.call($.arrayIndex(primes!, i)))
		}

		// Make sure that primes is pairwise unequal.
		for (let __goscriptRangeTarget2 = primes, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
			let prime = __goscriptRangeTarget2![i]
			for (let j = 0; j < i; j++) {
				if (big.Int.prototype.Cmp.call(prime, $.arrayIndex(primes!, j)) == 0) {
					continue NextSetOfPrimes
				}
			}
		}

		let n: big.Int | $.VarRef<big.Int> | null = big.Int.prototype.Set.call(new big.Int(), bigOne)
		let totient: big.Int | $.VarRef<big.Int> | null = big.Int.prototype.Set.call(new big.Int(), bigOne)
		let pminus1: big.Int | $.VarRef<big.Int> | null = new big.Int()
		for (let __goscriptRangeTarget3 = primes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
			let prime = __goscriptRangeTarget3![__rangeIndex]
			await big.Int.prototype.Mul.call(n, n, prime)
			big.Int.prototype.Sub.call(pminus1, prime, bigOne)
			await big.Int.prototype.Mul.call(totient, totient, pminus1)
		}
		if (big.Int.prototype.BitLen.call(n) != bits) {
			// This should never happen for nprimes == 2 because
			// crypto/rand should set the top two bits in each prime.
			// For nprimes > 2 we hope it does not happen often.
			continue NextSetOfPrimes
		}

		$.pointerValue<PrivateKey>(priv).D = new big.Int()
		let e: big.Int | $.VarRef<big.Int> | null = big.NewInt($.int64($.pointerValue<PrivateKey>(priv).PublicKey.E))
		let ok: big.Int | $.VarRef<big.Int> | null = await big.Int.prototype.ModInverse.call($.pointerValue<PrivateKey>(priv).D, e, totient)

		if (ok != null) {
			$.pointerValue<PrivateKey>(priv).Primes = primes
			$.pointerValue<PrivateKey>(priv).PublicKey.N = n
			break
		}
	}

	await PrivateKey.prototype.Precompute.call(priv)
	{
		let err = await PrivateKey.prototype.Validate.call(priv)
		if (err != null) {
			return [null, err]
		}
	}

	return [priv, null]
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

export function fipsPublicKey(pub: PublicKey | $.VarRef<PublicKey> | null): [rsa.PublicKey | $.VarRef<rsa.PublicKey> | null, $.GoError] {
	let __goscriptTuple13: any = bigmod.NewModulus(big.Int.prototype.Bytes.call($.pointerValue<PublicKey>(pub).N))
	let N: bigmod.Modulus | $.VarRef<bigmod.Modulus> | null = __goscriptTuple13[0]
	let err = __goscriptTuple13[1]
	if (err != null) {
		return [null, err]
	}
	return [new rsa.PublicKey({N: N, E: $.pointerValue<PublicKey>(pub).E}), null]
}

export async function fipsPrivateKey(priv: PrivateKey | $.VarRef<PrivateKey> | null): globalThis.Promise<[rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null, $.GoError]> {
	if ($.pointerValue<PrivateKey>(priv).Precomputed.fips != null) {
		return [$.pointerValue<PrivateKey>(priv).Precomputed.fips, null]
	}
	let [precomputed, err] = await PrivateKey.prototype.precompute.call(priv)
	if (err != null) {
		return [null, err]
	}
	return [precomputed.fips, null]
}

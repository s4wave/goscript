// Generated file based on pkcs1v15.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as boring from "@goscript/crypto/internal/boring/index.js"

import * as rsa from "@goscript/crypto/internal/fips140/rsa/index.js"

import * as fips140only from "@goscript/crypto/internal/fips140only/index.js"

import * as rand from "@goscript/crypto/internal/rand/index.js"

import * as subtle from "@goscript/crypto/subtle/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import type * as crypto from "@goscript/crypto/index.js"

import * as big from "@goscript/math/big/index.js"

import * as __goscript_notboring from "./notboring.gs.ts"

import * as __goscript_rsa from "./rsa.gs.ts"
import "@goscript/crypto/internal/boring/index.js"
import "@goscript/crypto/internal/fips140/rsa/index.js"
import "@goscript/crypto/internal/fips140only/index.js"
import "@goscript/crypto/internal/rand/index.js"
import "@goscript/crypto/subtle/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/math/big/index.js"
import "./notboring.gs.ts"
import "./rsa.gs.ts"

export class PKCS1v15DecryptOptions {
	// SessionKeyLen is the length of the session key that is being
	// decrypted. If not zero, then a padding error during decryption will
	// cause a random plaintext of this length to be returned rather than
	// an error. These alternatives happen in constant time.
	public get SessionKeyLen(): number {
		return this._fields.SessionKeyLen.value
	}
	public set SessionKeyLen(value: number) {
		this._fields.SessionKeyLen.value = value
	}

	public _fields: {
		SessionKeyLen: $.VarRef<number>
	}

	constructor(init?: Partial<{SessionKeyLen?: number}>) {
		this._fields = {
			SessionKeyLen: $.varRef(init?.SessionKeyLen ?? (0 as number))
		}
	}

	public clone(): PKCS1v15DecryptOptions {
		const cloned = new PKCS1v15DecryptOptions()
		cloned._fields = {
			SessionKeyLen: $.varRef(this._fields.SessionKeyLen.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"rsa.PKCS1v15DecryptOptions",
		() => new PKCS1v15DecryptOptions(),
		[],
		PKCS1v15DecryptOptions,
		[{ name: "SessionKeyLen", key: "SessionKeyLen", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }]
	)
}

export async function EncryptPKCS1v15(random: io.Reader | null, pub: __goscript_rsa.PublicKey | $.VarRef<__goscript_rsa.PublicKey> | null, msg: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	if (fips140only.Enforced()) {
		return [null, errors.New("crypto/rsa: use of PKCS#1 v1.5 encryption is not allowed in FIPS 140-only mode")]
	}

	{
		let err = __goscript_rsa.checkPublicKeySize(pub)
		if (err != null) {
			return [null, err]
		}
	}

	let k = __goscript_rsa.PublicKey.prototype.Size.call(pub)
	if ($.len(msg) > (k - 11)) {
		return [null, __goscript_rsa.ErrMessageTooLong]
	}

	if (boring.Enabled && rand.IsDefaultReader(random)) {
		let __goscriptTuple0: any = __goscript_notboring.boringPublicKey(pub)
		let bkey: boring.PublicKeyRSA | $.VarRef<boring.PublicKeyRSA> | null = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}
		return boring.EncryptRSAPKCS1(bkey, msg)
	}
	boring.UnreachableExceptTests()

	random = await rand.CustomReader(random)

	// EM = 0x00 || 0x02 || PS || 0x00 || M
	let em: $.Slice<number> = $.makeSlice<number>(k, undefined, "byte")
	em![1] = $.uint(2, 8)
	let ps: $.Slice<number> = $.goSlice(em, 2, ($.len(em) - $.len(msg)) - 1)
	let mm: $.Slice<number> = $.goSlice(em, $.len(em) - $.len(msg), undefined)
	let err = await nonZeroRandomBytes(ps, random)
	if (err != null) {
		return [null, err]
	}
	em![($.len(em) - $.len(msg)) - 1] = $.uint(0, 8)
	$.copy(mm, msg)

	if (boring.Enabled) {
		let bkey: boring.PublicKeyRSA | $.VarRef<boring.PublicKeyRSA> | null = null! as boring.PublicKeyRSA | $.VarRef<boring.PublicKeyRSA> | null
		let __goscriptTuple1: any = __goscript_notboring.boringPublicKey(pub)
		bkey = __goscriptTuple1[0]
		err = __goscriptTuple1[1]
		if (err != null) {
			return [null, err]
		}
		return boring.EncryptRSANoPadding(bkey, em)
	}

	let __goscriptTuple2: any = __goscript_rsa.fipsPublicKey(pub)
	let fk: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if (err != null) {
		return [null, err]
	}
	return rsa.Encrypt(fk, em)
}

export async function DecryptPKCS1v15(random: io.Reader | null, priv: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null, ciphertext: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	{
		let err = __goscript_rsa.checkPublicKeySize($.pointerValue<__goscript_rsa.PrivateKey>(priv)._fields.PublicKey)
		if (err != null) {
			return [null, err]
		}
	}

	if (boring.Enabled) {
		let __goscriptTuple3: any = __goscript_notboring.boringPrivateKey(priv)
		let bkey: boring.PrivateKeyRSA | $.VarRef<boring.PrivateKeyRSA> | null = __goscriptTuple3[0]
		let err = __goscriptTuple3[1]
		if (err != null) {
			return [null, err]
		}
		let __goscriptTuple4: any = boring.DecryptRSAPKCS1(bkey, ciphertext)
		let out: $.Slice<number> = __goscriptTuple4[0]
		err = __goscriptTuple4[1]
		if (err != null) {
			return [null, __goscript_rsa.ErrDecryption]
		}
		return [out, null]
	}

	let __goscriptTuple5: any = await decryptPKCS1v15(priv, ciphertext)
	let valid = __goscriptTuple5[0]
	let out: $.Slice<number> = __goscriptTuple5[1]
	let index = __goscriptTuple5[2]
	let err = __goscriptTuple5[3]
	if (err != null) {
		return [null, err]
	}
	if (valid == 0) {
		return [null, __goscript_rsa.ErrDecryption]
	}
	return [$.goSlice(out, index, undefined), null]
}

export async function DecryptPKCS1v15SessionKey(random: io.Reader | null, priv: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null, ciphertext: $.Slice<number>, key: $.Slice<number>): globalThis.Promise<$.GoError> {
	{
		let err = __goscript_rsa.checkPublicKeySize($.pointerValue<__goscript_rsa.PrivateKey>(priv)._fields.PublicKey)
		if (err != null) {
			return err
		}
	}

	let k = $.pointerValue<__goscript_rsa.PrivateKey>(priv).PublicKey.Size()
	if ((k - (($.len(key) + 3) + 8)) < 0) {
		return __goscript_rsa.ErrDecryption
	}

	let __goscriptTuple6: any = await decryptPKCS1v15(priv, ciphertext)
	let valid = __goscriptTuple6[0]
	let em: $.Slice<number> = __goscriptTuple6[1]
	let index = __goscriptTuple6[2]
	let err = __goscriptTuple6[3]
	if (err != null) {
		return err
	}

	if ($.len(em) != k) {
		// This should be impossible because decryptPKCS1v15 always
		// returns the full slice.
		return __goscript_rsa.ErrDecryption
	}

	valid = valid & (subtle.ConstantTimeEq($.int($.int($.len(em) - index, 32), 32), $.int($.int($.len(key), 32), 32)))
	subtle.ConstantTimeCopy(valid, key, $.goSlice(em, $.len(em) - $.len(key), undefined))
	return null
}

export async function decryptPKCS1v15(priv: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null, ciphertext: $.Slice<number>): globalThis.Promise<[number, $.Slice<number>, number, $.GoError]> {
	let valid: number = 0
	let em: $.Slice<number> = null! as $.Slice<number>
	let index: number = 0
	let err: $.GoError = null! as $.GoError
	if (fips140only.Enforced()) {
		return [0, null, 0, errors.New("crypto/rsa: use of PKCS#1 v1.5 encryption is not allowed in FIPS 140-only mode")]
	}

	let k = $.pointerValue<__goscript_rsa.PrivateKey>(priv).PublicKey.Size()
	if (k < 11) {
		err = __goscript_rsa.ErrDecryption
		return [0, null, 0, err]
	}

	if (boring.Enabled) {
		let bkey: boring.PrivateKeyRSA | $.VarRef<boring.PrivateKeyRSA> | null = null! as boring.PrivateKeyRSA | $.VarRef<boring.PrivateKeyRSA> | null
		let __goscriptTuple7: any = __goscript_notboring.boringPrivateKey(priv)
		bkey = __goscriptTuple7[0]
		err = __goscriptTuple7[1]
		if (err != null) {
			return [0, null, 0, err]
		}
		let __goscriptTuple8: any = boring.DecryptRSANoPadding(bkey, ciphertext)
		em = __goscriptTuple8[0]
		err = __goscriptTuple8[1]
		if (err != null) {
			return [0, null, 0, __goscript_rsa.ErrDecryption]
		}
	} else {
		let __goscriptTuple9: any = await __goscript_rsa.fipsPrivateKey(priv)
		let fk: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null = __goscriptTuple9[0]
		let __goscriptShadow0 = __goscriptTuple9[1]
		if (__goscriptShadow0 != null) {
			return [0, null, 0, __goscriptShadow0]
		}
		let __goscriptTuple10: any = rsa.DecryptWithoutCheck(fk, ciphertext)
		em = __goscriptTuple10[0]
		__goscriptShadow0 = __goscriptTuple10[1]
		if (__goscriptShadow0 != null) {
			return [0, null, 0, __goscript_rsa.ErrDecryption]
		}
	}

	let firstByteIsZero = subtle.ConstantTimeByteEq($.uint($.arrayIndex(em!, 0), 8), $.uint(0, 8))
	let secondByteIsTwo = subtle.ConstantTimeByteEq($.uint($.arrayIndex(em!, 1), 8), $.uint(2, 8))

	// The remainder of the plaintext must be a string of non-zero random
	// octets, followed by a 0, followed by the message.
	//   lookingForIndex: 1 iff we are still looking for the zero.
	//   index: the offset of the first zero byte.
	let lookingForIndex = 1

	for (let i = 2; i < $.len(em); i++) {
		let equals0 = subtle.ConstantTimeByteEq($.uint($.arrayIndex(em!, i), 8), $.uint(0, 8))
		index = subtle.ConstantTimeSelect(lookingForIndex & equals0, i, index)
		lookingForIndex = subtle.ConstantTimeSelect(equals0, 0, lookingForIndex)
	}

	// The PS padding must be at least 8 bytes long, and it starts two
	// bytes into em.
	let validPS = subtle.ConstantTimeLessOrEq(2 + 8, index)

	valid = ((firstByteIsZero & secondByteIsTwo) & (Number($.int64Xor(lookingForIndex, -1n)) & 1)) & validPS
	index = subtle.ConstantTimeSelect(valid, index + 1, 0)
	return [valid, em, index, null]
}

export async function nonZeroRandomBytes(s: $.Slice<number>, random: io.Reader | null): globalThis.Promise<$.GoError> {
	let err: $.GoError = null! as $.GoError
	let __goscriptTuple11: any = await io.ReadFull($.pointerValueOrNil(random)!, s)
	err = __goscriptTuple11[1]
	if (err != null) {
		return err
	}

	for (let i = 0; i < $.len(s); i++) {
		while ($.uint($.arrayIndex(s!, i), 8) == $.uint(0, 8)) {
			let __goscriptTuple12: any = await io.ReadFull($.pointerValueOrNil(random)!, $.goSlice(s, i, i + 1))
			err = __goscriptTuple12[1]
			if (err != null) {
				return err
			}
			// In tests, the PRNG may return all zeros so we do
			// this to break the loop.
			s![i] = s![i] ^ ($.uint(0x42, 8))
		}
	}

	return err
}

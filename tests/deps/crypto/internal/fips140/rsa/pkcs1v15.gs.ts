// Generated file based on pkcs1v15.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as errors from "@goscript/errors/index.js"

import * as bigmod from "@goscript/crypto/internal/fips140/bigmod/index.js"

import * as __goscript_cast from "./cast.gs.ts"

import * as __goscript_rsa from "./rsa.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/errors/index.js"
import "@goscript/crypto/internal/fips140/bigmod/index.js"
import "./cast.gs.ts"
import "./rsa.gs.ts"

export var hashPrefixes: globalThis.Map<string, $.Slice<number>> | null

export function __goscript_init_hashPrefixes(): void {
	if (((hashPrefixes) as any) === undefined) {
		hashPrefixes = new globalThis.Map<string, $.Slice<number>>([["MD5", new Uint8Array([48, 32, 48, 12, 6, 8, 42, 134, 72, 134, 247, 13, 2, 5, 5, 0, 4, 16]) as $.Slice<number>], ["SHA-1", new Uint8Array([48, 33, 48, 9, 6, 5, 43, 14, 3, 2, 26, 5, 0, 4, 20]) as $.Slice<number>], ["SHA-224", new Uint8Array([48, 45, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 4, 5, 0, 4, 28]) as $.Slice<number>], ["SHA-256", new Uint8Array([48, 49, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 1, 5, 0, 4, 32]) as $.Slice<number>], ["SHA-384", new Uint8Array([48, 65, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 2, 5, 0, 4, 48]) as $.Slice<number>], ["SHA-512", new Uint8Array([48, 81, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 3, 5, 0, 4, 64]) as $.Slice<number>], ["SHA-512/224", new Uint8Array([48, 45, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 5, 5, 0, 4, 28]) as $.Slice<number>], ["SHA-512/256", new Uint8Array([48, 49, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 6, 5, 0, 4, 32]) as $.Slice<number>], ["SHA3-224", new Uint8Array([48, 45, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 7, 5, 0, 4, 28]) as $.Slice<number>], ["SHA3-256", new Uint8Array([48, 49, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 8, 5, 0, 4, 32]) as $.Slice<number>], ["SHA3-384", new Uint8Array([48, 65, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 9, 5, 0, 4, 48]) as $.Slice<number>], ["SHA3-512", new Uint8Array([48, 81, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 10, 5, 0, 4, 64]) as $.Slice<number>], ["MD5+SHA1", new Uint8Array([]) as $.Slice<number>], ["RIPEMD-160", new Uint8Array([48, 32, 48, 8, 6, 6, 40, 207, 6, 3, 0, 49, 4, 20]) as $.Slice<number>]])
	}
}

export function __goscript_get_hashPrefixes(): globalThis.Map<string, $.Slice<number>> | null {
	if (((hashPrefixes) as any) === undefined) {
		__goscript_init_hashPrefixes()
	}
	return hashPrefixes
}

export function __goscript_set_hashPrefixes(__goscriptValue: globalThis.Map<string, $.Slice<number>> | null): void {
	hashPrefixes = __goscriptValue
}

export async function SignPKCS1v15(priv: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null, hash: string, hashed: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	await __goscript_cast.__goscript_get_fipsSelfTest()!()
	fips140.RecordApproved()
	checkApprovedHashName(hash)

	return signPKCS1v15(priv, hash, hashed)
}

export function signPKCS1v15(priv: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null, hash: string, hashed: $.Slice<number>): [$.Slice<number>, $.GoError] {
	let __goscriptTuple0: any = pkcs1v15ConstructEM($.pointerValue<__goscript_rsa.PrivateKey>(priv)._fields.pub, hash, hashed)
	let em: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		return [null, err]
	}

	return __goscript_rsa.decrypt(priv, em, true)
}

export function pkcs1v15ConstructEM(pub: __goscript_rsa.PublicKey | $.VarRef<__goscript_rsa.PublicKey> | null, hash: string, hashed: $.Slice<number>): [$.Slice<number>, $.GoError] {
	// Special case: "" is used to indicate that the data is signed directly.
	let prefix: $.Slice<number> = null as $.Slice<number>
	if (!$.stringEqual(hash, "")) {
		let ok: boolean = false
		let __goscriptTuple1: any = $.mapGet<string, $.Slice<number>, $.Slice<number>>(__goscript_get_hashPrefixes(), hash, null)
		prefix = __goscriptTuple1[0]
		ok = __goscriptTuple1[1]
		if (!ok) {
			return [null, errors.New("crypto/rsa: unsupported hash function")]
		}
	}

	// EM = 0x00 || 0x01 || PS || 0x00 || T
	let k = __goscript_rsa.PublicKey.prototype.Size.call(pub)
	if (k < (((($.len(prefix) + $.len(hashed)) + 2) + 8) + 1)) {
		return [null, __goscript_rsa.ErrMessageTooLong]
	}
	let em: $.Slice<number> = $.makeSlice<number>(k, undefined, "byte")
	em![1] = $.uint(1, 8)
	for (let i = 2; i < (((k - $.len(prefix)) - $.len(hashed)) - 1); i++) {
		em![i] = $.uint(0xff, 8)
	}
	$.copy($.goSlice(em, (k - $.len(prefix)) - $.len(hashed), undefined), prefix)
	$.copy($.goSlice(em, k - $.len(hashed), undefined), hashed)
	return [em, null]
}

export async function VerifyPKCS1v15(pub: __goscript_rsa.PublicKey | $.VarRef<__goscript_rsa.PublicKey> | null, hash: string, hashed: $.Slice<number>, sig: $.Slice<number>): globalThis.Promise<$.GoError> {
	await __goscript_cast.__goscript_get_fipsSelfTest()!()
	fips140.RecordApproved()
	checkApprovedHashName(hash)

	return verifyPKCS1v15(pub, hash, hashed, sig)
}

export function verifyPKCS1v15(pub: __goscript_rsa.PublicKey | $.VarRef<__goscript_rsa.PublicKey> | null, hash: string, hashed: $.Slice<number>, sig: $.Slice<number>): $.GoError {
	{
		let [fipsApproved, err] = __goscript_rsa.checkPublicKey(pub)
		if (err != null) {
			return err
		} else {
			if (!fipsApproved) {
				fips140.RecordNonApproved()
			}
		}
	}

	// RFC 8017 Section 8.2.2: If the length of the signature S is not k
	// octets (where k is the length in octets of the RSA modulus n), output
	// "invalid signature" and stop.
	if (__goscript_rsa.PublicKey.prototype.Size.call(pub) != $.len(sig)) {
		return __goscript_rsa.ErrVerification
	}

	let __goscriptTuple2: any = __goscript_rsa.encrypt(pub, sig)
	let em: $.Slice<number> = __goscriptTuple2[0]
	let err = __goscriptTuple2[1]
	if (err != null) {
		return __goscript_rsa.ErrVerification
	}

	let __goscriptTuple3: any = pkcs1v15ConstructEM(pub, hash, hashed)
	let expected: $.Slice<number> = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	if (err != null) {
		return __goscript_rsa.ErrVerification
	}
	if (!bytes.Equal(em, expected)) {
		return __goscript_rsa.ErrVerification
	}

	return null
}

export function checkApprovedHashName(hash: string): void {
	switch (hash) {
		case "SHA-224":
		case "SHA-256":
		case "SHA-384":
		case "SHA-512":
		case "SHA-512/224":
		case "SHA-512/256":
		case "SHA3-224":
		case "SHA3-256":
		case "SHA3-384":
		case "SHA3-512":
		{
			break
		}
		default:
		{
			fips140.RecordNonApproved()
			break
		}
	}
}

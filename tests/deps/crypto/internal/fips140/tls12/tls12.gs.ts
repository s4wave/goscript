// Generated file based on tls12.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as hmac from "@goscript/crypto/internal/fips140/hmac/index.js"

import * as sha256 from "@goscript/crypto/internal/fips140/sha256/index.js"

import * as sha512 from "@goscript/crypto/internal/fips140/sha512/index.js"

import * as hash2 from "@goscript/hash/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/hmac/index.js"
import "@goscript/crypto/internal/fips140/sha256/index.js"
import "@goscript/crypto/internal/fips140/sha512/index.js"
import "@goscript/hash/index.js"

export const masterSecretLength: number = 48

export const extendedMasterSecretLabel: string = "extended master secret"

export async function PRF(__typeArgs: $.GenericTypeArgs | undefined, hash: (() => any | globalThis.Promise<any>) | null, secret: $.Slice<number>, label: string, seed: $.Slice<number>, keyLen: number): globalThis.Promise<$.Slice<number>> {
	let labelAndSeed: $.Slice<number> = $.makeSlice<number>($.len(label) + $.len(seed), undefined, "byte")
	$.copy(labelAndSeed, label)
	$.copy($.goSlice(labelAndSeed, $.len(label), undefined), seed)

	let result: $.Slice<number> = $.makeSlice<number>(keyLen, undefined, "byte")
	await pHash(undefined, hash, result, secret, labelAndSeed)
	return result
}

export async function pHash(__typeArgs: $.GenericTypeArgs | undefined, hash: (() => any | globalThis.Promise<any>) | null, result: $.Slice<number>, secret: $.Slice<number>, seed: $.Slice<number>): globalThis.Promise<void> {
	let h: hmac.HMAC | $.VarRef<hmac.HMAC> | null = await hmac.New(undefined, hash, secret)
	await hmac.HMAC.prototype.Write.call(h, seed)
	let a: $.Slice<number> = await hmac.HMAC.prototype.Sum.call(h, null)

	while ($.len(result) > 0) {
		await hmac.HMAC.prototype.Reset.call(h)
		await hmac.HMAC.prototype.Write.call(h, a)
		await hmac.HMAC.prototype.Write.call(h, seed)
		let b: $.Slice<number> = await hmac.HMAC.prototype.Sum.call(h, null)
		let n = $.copy(result, b)
		result = $.goSlice(result, n, undefined)

		await hmac.HMAC.prototype.Reset.call(h)
		await hmac.HMAC.prototype.Write.call(h, a)
		a = await hmac.HMAC.prototype.Sum.call(h, null)
	}
}

export async function MasterSecret(__typeArgs: $.GenericTypeArgs | undefined, hash: (() => any | globalThis.Promise<any>) | null, preMasterSecret: $.Slice<number>, transcript: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
	// "The TLS 1.2 KDF is an approved KDF when the following conditions are
	// satisfied: [...] (3) P_HASH uses either SHA-256, SHA-384 or SHA-512."
	let h = await hash!()
	{
		const __goscriptTypeSwitchValue = (h as any)
		switch (true) {
			case $.typeAssert<sha256.Digest | $.VarRef<sha256.Digest> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "sha256.Digest" }).ok:
				{
					if (await $.callGenericMethod(__typeArgs, "H", "Size", h) != 32) {
						fips140.RecordNonApproved()
					}
				}
				break
			case $.typeAssert<sha512.Digest | $.VarRef<sha512.Digest> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "sha512.Digest" }).ok:
				{
					if ((await $.callGenericMethod(__typeArgs, "H", "Size", h) != 46) && (await $.callGenericMethod(__typeArgs, "H", "Size", h) != 64)) {
						fips140.RecordNonApproved()
					}
				}
				break
			default:
				{
					fips140.RecordNonApproved()
				}
				break
		}
	}

	return PRF(undefined, hash, preMasterSecret, "extended master secret", transcript, 48)
}

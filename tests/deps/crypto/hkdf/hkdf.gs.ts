// Generated file based on hkdf.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as hkdf from "@goscript/crypto/internal/fips140/hkdf/index.js"

import * as fips140hash from "@goscript/crypto/internal/fips140hash/index.js"

import * as fips140only from "@goscript/crypto/internal/fips140only/index.js"

import * as errors from "@goscript/errors/index.js"

import * as hash from "@goscript/hash/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/crypto/internal/fips140/hkdf/index.js"
import "@goscript/crypto/internal/fips140hash/index.js"
import "@goscript/crypto/internal/fips140only/index.js"
import "@goscript/errors/index.js"
import "@goscript/hash/index.js"

export async function Extract(__typeArgs: $.GenericTypeArgs | undefined, h: (() => any | globalThis.Promise<any>) | null, secret: $.Slice<number>, salt: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let fh: (() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null = await fips140hash.UnwrapNew(undefined, h)
	{
		let err = await checkFIPS140Only(undefined, fh, secret)
		if (err != null) {
			return [null, err]
		}
	}
	return [await hkdf.Extract(undefined, fh, secret, salt), null]
}

export async function Expand(__typeArgs: $.GenericTypeArgs | undefined, h: (() => any | globalThis.Promise<any>) | null, pseudorandomKey: $.Slice<number>, info: string, keyLength: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let fh: (() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null = await fips140hash.UnwrapNew(undefined, h)
	{
		let err = await checkFIPS140Only(undefined, fh, pseudorandomKey)
		if (err != null) {
			return [null, err]
		}
	}

	let limit = await $.pointerValue<Exclude<hash.Hash, null>>((await fh!())).Size() * 255
	if (keyLength > limit) {
		return [null, errors.New("hkdf: requested key length too large")]
	}

	return [await hkdf.Expand(undefined, fh, pseudorandomKey, info, keyLength), null]
}

export async function Key(__typeArgs: $.GenericTypeArgs | undefined, h: (() => any | globalThis.Promise<any>) | null, secret: $.Slice<number>, salt: $.Slice<number>, info: string, keyLength: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let fh: (() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null = await fips140hash.UnwrapNew(undefined, h)
	{
		let err = await checkFIPS140Only(undefined, fh, secret)
		if (err != null) {
			return [null, err]
		}
	}

	let limit = await $.pointerValue<Exclude<hash.Hash, null>>((await fh!())).Size() * 255
	if (keyLength > limit) {
		return [null, errors.New("hkdf: requested key length too large")]
	}

	return [await hkdf.Key(undefined, fh, secret, salt, info, keyLength), null]
}

export async function checkFIPS140Only(__typeArgs: $.GenericTypeArgs | undefined, h: (() => any | globalThis.Promise<any>) | null, key: $.Slice<number>): globalThis.Promise<$.GoError> {
	if (!fips140only.Enforced()) {
		return null
	}
	if ($.len(key) < (Math.trunc(112 / 8))) {
		return errors.New("crypto/hkdf: use of keys shorter than 112 bits is not allowed in FIPS 140-only mode")
	}
	if (!fips140only.ApprovedHash((await h!() as hash.Hash | null))) {
		return errors.New("crypto/hkdf: use of hash functions other than SHA-2 or SHA-3 is not allowed in FIPS 140-only mode")
	}
	return null
}

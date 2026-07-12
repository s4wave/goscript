// Generated file based on hkdf.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as hmac from "@goscript/crypto/internal/fips140/hmac/index.js"

import * as hash from "@goscript/hash/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/hmac/index.js"
import "@goscript/hash/index.js"

export async function Extract(__typeArgs: $.GenericTypeArgs | undefined, h: (() => any | globalThis.Promise<any>) | null, secret: $.Slice<number>, salt: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
	if ($.len(secret) < (Math.trunc(112 / 8))) {
		fips140.RecordNonApproved()
	}
	if (salt == null) {
		salt = $.makeSlice<number>(await $.callGenericMethod(__typeArgs, "H", "Size", await h!()), undefined, "byte")
	}
	let extractor: hmac.HMAC | $.VarRef<hmac.HMAC> | null = await hmac.New(undefined, h, salt)
	hmac.MarkAsUsedInKDF(extractor)
	await hmac.HMAC.prototype.Write.call(extractor, secret)

	return hmac.HMAC.prototype.Sum.call(extractor, null)
}

export async function Expand(__typeArgs: $.GenericTypeArgs | undefined, h: (() => any | globalThis.Promise<any>) | null, pseudorandomKey: $.Slice<number>, info: string, keyLen: number): globalThis.Promise<$.Slice<number>> {
	let out: $.Slice<number> = $.makeSlice<number>(0, keyLen, "byte")
	let expander: hmac.HMAC | $.VarRef<hmac.HMAC> | null = await hmac.New(undefined, h, pseudorandomKey)
	hmac.MarkAsUsedInKDF(expander)
	let counter: number = 0
	let buf: $.Slice<number> = null as $.Slice<number>

	while ($.len(out) < keyLen) {
		counter++
		if ($.uint(counter, 8) == $.uint(0, 8)) {
			$.panic("hkdf: counter overflow")
		}
		if ($.uint(counter, 8) > $.uint(1, 8)) {
			await hmac.HMAC.prototype.Reset.call(expander)
		}
		await hmac.HMAC.prototype.Write.call(expander, buf)
		await hmac.HMAC.prototype.Write.call(expander, $.stringToBytes(info))
		await hmac.HMAC.prototype.Write.call(expander, new Uint8Array([counter]) as $.Slice<number>)
		buf = await hmac.HMAC.prototype.Sum.call(expander, $.goSlice(buf, undefined, 0))
		let remain = keyLen - $.len(out)
		remain = $.min(remain, $.len(buf))
		out = $.appendSlice(out, $.goSlice(buf, undefined, remain), $.byteSliceHint)
	}

	return out
}

export async function Key(__typeArgs: $.GenericTypeArgs | undefined, h: (() => any | globalThis.Promise<any>) | null, secret: $.Slice<number>, salt: $.Slice<number>, info: string, keyLen: number): globalThis.Promise<$.Slice<number>> {
	let prk: $.Slice<number> = await Extract(undefined, h, secret, salt)
	return Expand(undefined, h, prk, info, keyLen)
}

// Generated file based on hmac.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as boring from "@goscript/crypto/internal/boring/index.js"

import * as hmac from "@goscript/crypto/internal/fips140/hmac/index.js"

import * as fips140hash from "@goscript/crypto/internal/fips140hash/index.js"

import * as fips140only from "@goscript/crypto/internal/fips140only/index.js"

import * as subtle from "@goscript/crypto/subtle/index.js"

import * as hash from "@goscript/hash/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/crypto/internal/boring/index.js"
import "@goscript/crypto/internal/fips140/hmac/index.js"
import "@goscript/crypto/internal/fips140hash/index.js"
import "@goscript/crypto/internal/fips140only/index.js"
import "@goscript/crypto/subtle/index.js"
import "@goscript/hash/index.js"

export async function New(h: (() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null, key: $.Slice<number>): globalThis.Promise<hash.Hash | null> {
	if (boring.Enabled) {
		let hm = boring.NewHMAC(h, key)
		if (hm != null) {
			return hm
		}
	}
	h = await fips140hash.UnwrapNew(undefined, h)
	if (fips140only.Enforced()) {
		if ($.len(key) < (Math.trunc(112 / 8))) {
			$.panic("crypto/hmac: use of keys shorter than 112 bits is not allowed in FIPS 140-only mode")
		}
		if (!fips140only.ApprovedHash(await h!())) {
			$.panic("crypto/hmac: use of hash functions other than SHA-2 or SHA-3 is not allowed in FIPS 140-only mode")
		}
	}
	return $.interfaceValue<hash.Hash | null>(await hmac.New(undefined, h, key), "*hmac.HMAC", { kind: $.TypeKind.Pointer, elemType: "hmac.HMAC" })
}

export function Equal(mac1: $.Slice<number>, mac2: $.Slice<number>): boolean {
	// We don't have to be constant time if the lengths of the MACs are
	// different as that suggests that a completely different hash function
	// was used.
	return subtle.ConstantTimeCompare(mac1, mac2) == 1
}

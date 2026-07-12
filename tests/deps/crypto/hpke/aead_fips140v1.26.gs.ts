// Generated file based on aead_fips140v1.26.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as cipher from "@goscript/crypto/cipher/index.js"

import * as aes from "@goscript/crypto/internal/fips140/aes/index.js"

import * as gcm from "@goscript/crypto/internal/fips140/aes/gcm/index.js"
import "@goscript/crypto/cipher/index.js"
import "@goscript/crypto/internal/fips140/aes/index.js"
import "@goscript/crypto/internal/fips140/aes/gcm/index.js"

export function newAESGCM(key: $.Slice<number>): [cipher.AEAD | null, $.GoError] {
	let __goscriptTuple0: any = aes.New(key)
	let b: aes.Block | $.VarRef<aes.Block> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		return [null, err]
	}
	const __goscriptReturn0 = gcm.NewGCMForHPKE(b)
	return [$.interfaceValue<cipher.AEAD | null>(__goscriptReturn0[0], "*gcm.GCMWithXORCounterNonce", { kind: $.TypeKind.Pointer, elemType: "gcm.GCMWithXORCounterNonce" }), __goscriptReturn0[1]]
	throw new globalThis.Error("goscript: unreachable return")
}

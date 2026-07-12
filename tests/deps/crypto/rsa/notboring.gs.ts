// Generated file based on notboring.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as boring from "@goscript/crypto/internal/boring/index.js"

import type * as crypto from "@goscript/crypto/index.js"

import * as rsa from "@goscript/crypto/internal/fips140/rsa/index.js"

import type * as io from "@goscript/io/index.js"

import * as big from "@goscript/math/big/index.js"

import * as __goscript_rsa from "./rsa.gs.ts"
import "@goscript/crypto/internal/boring/index.js"
import "@goscript/crypto/internal/fips140/rsa/index.js"
import "@goscript/math/big/index.js"
import "./rsa.gs.ts"

export function boringPublicKey(_p0: __goscript_rsa.PublicKey | $.VarRef<__goscript_rsa.PublicKey> | null): [boring.PublicKeyRSA | $.VarRef<boring.PublicKeyRSA> | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function boringPrivateKey(_p0: __goscript_rsa.PrivateKey | $.VarRef<__goscript_rsa.PrivateKey> | null): [boring.PrivateKeyRSA | $.VarRef<boring.PrivateKeyRSA> | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

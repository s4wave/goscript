// Generated file based on notboring.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as boring from "@goscript/crypto/internal/boring/index.js"

import type * as crypto from "@goscript/crypto/index.js"

import type * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as elliptic from "@goscript/crypto/elliptic/index.js"

import type * as io from "@goscript/io/index.js"

import * as big from "@goscript/math/big/index.js"

import * as __goscript_ecdsa from "./ecdsa.gs.ts"
import "@goscript/crypto/internal/boring/index.js"
import "@goscript/crypto/elliptic/index.js"
import "@goscript/math/big/index.js"
import "./ecdsa.gs.ts"

export function boringPublicKey(_p0: __goscript_ecdsa.PublicKey | $.VarRef<__goscript_ecdsa.PublicKey> | null): [boring.PublicKeyECDSA | $.VarRef<boring.PublicKeyECDSA> | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function boringPrivateKey(_p0: __goscript_ecdsa.PrivateKey | $.VarRef<__goscript_ecdsa.PrivateKey> | null): [boring.PrivateKeyECDSA | $.VarRef<boring.PrivateKeyECDSA> | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

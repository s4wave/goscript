// Generated file based on ecdsa_noasm.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bigmod from "@goscript/crypto/internal/fips140/bigmod/index.js"

import * as hmac from "@goscript/crypto/internal/fips140/hmac/index.js"

import * as __goscript_ecdsa from "./ecdsa.gs.ts"

import type * as __goscript_hmacdrbg from "./hmacdrbg.gs.ts"
import "@goscript/crypto/internal/fips140/bigmod/index.js"
import "@goscript/crypto/internal/fips140/hmac/index.js"
import "./ecdsa.gs.ts"

export async function sign(__typeArgs: $.GenericTypeArgs | undefined, c: __goscript_ecdsa.Curve | $.VarRef<__goscript_ecdsa.Curve> | null, priv: __goscript_ecdsa.PrivateKey | $.VarRef<__goscript_ecdsa.PrivateKey> | null, drbg: __goscript_hmacdrbg.hmacDRBG | $.VarRef<__goscript_hmacdrbg.hmacDRBG> | null, hash: $.Slice<number>): globalThis.Promise<[__goscript_ecdsa.Signature | $.VarRef<__goscript_ecdsa.Signature> | null, $.GoError]> {
	return __goscript_ecdsa.signGeneric({P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, priv, drbg, hash)
}

export async function verify(__typeArgs: $.GenericTypeArgs | undefined, c: __goscript_ecdsa.Curve | $.VarRef<__goscript_ecdsa.Curve> | null, pub: __goscript_ecdsa.PublicKey | $.VarRef<__goscript_ecdsa.PublicKey> | null, hash: $.Slice<number>, sig: __goscript_ecdsa.Signature | $.VarRef<__goscript_ecdsa.Signature> | null): globalThis.Promise<$.GoError> {
	return __goscript_ecdsa.verifyGeneric({P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, pub, hash, sig)
}

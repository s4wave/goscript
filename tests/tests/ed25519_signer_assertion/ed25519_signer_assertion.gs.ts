// Generated file based on ed25519_signer_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ed25519/index.js"

export async function main(): globalThis.Promise<void> {
	let value: any = $.namedValueInterfaceValue<any>(($.makeSlice<number>(ed25519.PrivateKeySize, undefined, "byte") as ed25519.PrivateKey), "ed25519.PrivateKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Public: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Public as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Seed: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Seed as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Sign: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Sign as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "ed25519.PrivateKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Equal", args: [{ name: "x", type: "crypto.PrivateKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Public", args: [], returns: [{ name: "_r0", type: "crypto.PublicKey" }] }, { name: "Seed", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Sign", args: [{ name: "rand", type: "io.Reader" }, { name: "message", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "opts", type: "crypto.SignerOpts" }], returns: [{ name: "signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }])
	let [, ok] = $.typeAssertTuple<crypto.Signer | null>(value, "crypto.Signer")
	$.println(ok)
}

if ($.isMainScript(import.meta)) {
	await main()
}

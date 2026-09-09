// Generated file based on ed25519_signer_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ed25519/index.js"

export async function main(): globalThis.Promise<void> {
	let value: any = $.namedValueInterfaceValue<any>(($.makeSlice<number>(ed25519.PrivateKeySize, undefined, "byte") as ed25519.PrivateKey), "ed25519.PrivateKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Public: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Public as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Seed: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Seed as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Sign: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Sign as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "ed25519.PrivateKey"), [$.methodSignature("Equal", [["x", "crypto.PrivateKey"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Public", [], ["crypto.PublicKey"]), $.methodSignature("Seed", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("Sign", [["rand", "io.Reader"], ["message", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["opts", "crypto.SignerOpts"]], [["signature", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["err", "error"]])])
	let [, ok] = $.typeAssertTuple<crypto.Signer | null>(value, "crypto.Signer")
	await $.println(ok)
}

if ($.isMainScript(import.meta)) {
	await main()
}

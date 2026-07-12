// Generated file based on package_import_x509_create_certificate.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as rand from "@goscript/crypto/rand/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as pkix from "@goscript/crypto/x509/pkix/index.js"

import * as big from "@goscript/math/big/index.js"

import * as time from "@goscript/time/index.js"

import type * as crypto from "@goscript/crypto/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/rand/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "@goscript/math/big/index.js"
import "@goscript/time/index.js"
import "@goscript/io/index.js"

export async function main(): globalThis.Promise<void> {
	let __goscriptTuple0: any = await ed25519.GenerateKey($.pointerValueOrNil(rand.Reader)!)
	let pub: ed25519.PublicKey = (__goscriptTuple0[0] as ed25519.PublicKey)
	let priv: ed25519.PrivateKey = (__goscriptTuple0[1] as ed25519.PrivateKey)
	let err = __goscriptTuple0[2]
	$.println("keygen err nil", err == null)

	let template: x509.Certificate | $.VarRef<x509.Certificate> | null = (() => { const __goscriptLiteralField0 = big.NewInt(42n); const __goscriptLiteralField1 = $.markAsStructValue($.cloneStructValue(time.Unix(1700000000n, 0n))); const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue(time.Unix(1700003600n, 0n))); return new x509.Certificate({SerialNumber: __goscriptLiteralField0, Subject: $.markAsStructValue(new pkix.Name({CommonName: "goscript.test", Organization: $.arrayToSlice<string>(["GoScript"])})), NotBefore: __goscriptLiteralField1, NotAfter: __goscriptLiteralField2, KeyUsage: x509.KeyUsageDigitalSignature, ExtKeyUsage: $.arrayToSlice<x509.ExtKeyUsage>([x509.ExtKeyUsageServerAuth]), BasicConstraintsValid: true}) })()
	let __goscriptTuple1: any = await x509.CreateCertificate(rand.Reader, template, template, $.namedValueInterfaceValue<any>(pub, "ed25519.PublicKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PublicKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Equal", args: [{ name: "x", type: "crypto.PublicKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]), $.namedValueInterfaceValue<any>(priv, "ed25519.PrivateKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Public: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Public as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Seed: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Seed as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Sign: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Sign as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Slice, typeName: "ed25519.PrivateKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Equal", args: [{ name: "x", type: "crypto.PrivateKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Public", args: [], returns: [{ name: "_r0", type: "crypto.PublicKey" }] }, { name: "Seed", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Sign", args: [{ name: "rand", type: "io.Reader" }, { name: "message", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "opts", type: "crypto.SignerOpts" }], returns: [{ name: "signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }]))
	let der: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	$.println("create err nil", err == null)
	$.println("der nonempty", $.len(der) != 0)
	if (err != null) {
		$.println("create error", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}

	let __goscriptTuple2: any = await x509.ParseCertificate(der)
	let cert: x509.Certificate | $.VarRef<x509.Certificate> | null = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	$.println("parse err nil", err == null)
	if (err != null) {
		$.println("parse error", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("serial", await big.Int.prototype.String.call($.pointerValue<x509.Certificate>(cert).SerialNumber))
	$.println("common name", $.pointerValue<x509.Certificate>(cert).Subject.CommonName)
	$.println("organization", $.arrayIndex($.pointerValue<x509.Certificate>(cert).Subject.Organization!, 0))
	$.println("signature algorithm", x509.SignatureAlgorithm_String($.pointerValue<x509.Certificate>(cert).SignatureAlgorithm))
	$.println("public key algorithm", x509.PublicKeyAlgorithm_String($.pointerValue<x509.Certificate>(cert).PublicKeyAlgorithm))
	$.println("public key equal", ed25519.PublicKey_Equal($.mustTypeAssert<ed25519.PublicKey>($.pointerValue<x509.Certificate>(cert).PublicKey, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }), $.namedValueInterfaceValue<crypto.PublicKey | null>(pub, "ed25519.PublicKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PublicKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Equal", args: [{ name: "x", type: "crypto.PublicKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }])))
}

if ($.isMainScript(import.meta)) {
	await main()
}

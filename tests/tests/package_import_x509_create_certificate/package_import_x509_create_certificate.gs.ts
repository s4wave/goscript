// Generated file based on package_import_x509_create_certificate.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as rand from "@goscript/crypto/rand/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as pkix from "@goscript/crypto/x509/pkix/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"

import * as big from "@goscript/math/big/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as slices from "@goscript/slices/index.js"

import * as time from "@goscript/time/index.js"

import type * as crypto from "@goscript/crypto/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/rand/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/math/big/index.js"
import "@goscript/reflect/index.js"
import "@goscript/slices/index.js"
import "@goscript/time/index.js"
import "@goscript/io/index.js"

export class signedKey {
	public declare PubKey: $.Slice<number>

	public declare Signature: $.Slice<number>

	public _fields: {
		PubKey: $.Slice<number>
		Signature: $.Slice<number>
	}

	constructor(init?: Partial<{PubKey?: $.Slice<number>, Signature?: $.Slice<number>}>) {
		this._fields = {
			PubKey: init?.PubKey ?? (null! as $.Slice<number>),
			Signature: init?.Signature ?? (null! as $.Slice<number>)
		}
	}

	public clone(): signedKey {
		return $.markAsStructValue(new signedKey(this))
	}

	static {
		$.bindStructFields(this.prototype, ["PubKey", "Signature"])
	}

	static __typeInfo = $.registerStructType(
		"main.signedKey",
		() => new signedKey(),
		() => [],
		signedKey,
		() => [/* @__PURE__ */ $.structField("PubKey", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), [0], 0, true), /* @__PURE__ */ $.structField("Signature", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), [1], 24, true)]
	)
}

export let extensionID: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 4, 1, 53594, 1, 1]) as asn1.ObjectIdentifier)

export function __goscript_set_extensionID(__goscriptValue: asn1.ObjectIdentifier): void {
	extensionID = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	let __goscriptTuple0: any = await ed25519.GenerateKey($.pointerValueOrNil(rand.Reader)!)
	let pub: ed25519.PublicKey = (__goscriptTuple0[0] as ed25519.PublicKey)
	let priv: ed25519.PrivateKey = (__goscriptTuple0[1] as ed25519.PrivateKey)
	let err = __goscriptTuple0[2]
	await $.println("keygen err nil", err == null)
	let __goscriptTuple1: any = await asn1.Marshal($.interfaceValue($.markAsStructValue(new signedKey({PubKey: new Uint8Array([8, 1, 18, 2, 3, 4]) as $.Slice<number>, Signature: new Uint8Array([5, 6]) as $.Slice<number>})), "main.signedKey", "main.signedKey"))
	let extensionDER: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	await $.println("extension marshal err nil", err == null)

	let template: x509.Certificate | $.VarRef<x509.Certificate> | null = (() => { const __goscriptLiteralField0 = big.NewInt(42n); const __goscriptLiteralField1 = $.markAsStructValue($.cloneStructValue(time.Unix(1700000000n, 0n))); const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue(time.Unix(4900000000n, 0n))); return new x509.Certificate({SerialNumber: __goscriptLiteralField0, Subject: $.markAsStructValue(new pkix.Name({CommonName: "goscript.test", Organization: $.arrayToSlice<string>(["GoScript"])})), NotBefore: __goscriptLiteralField1, NotAfter: __goscriptLiteralField2, KeyUsage: x509.KeyUsageDigitalSignature, ExtKeyUsage: $.arrayToSlice<x509.ExtKeyUsage>([x509.ExtKeyUsageServerAuth]), BasicConstraintsValid: true, ExtraExtensions: $.arrayToSlice<pkix.Extension>([$.markAsStructValue(new pkix.Extension({Id: (extensionID as asn1.ObjectIdentifier), Critical: true, Value: extensionDER}))])}) })()
	let __goscriptTuple2: any = await x509.CreateCertificate(rand.Reader, template, template, $.namedValueInterfaceValue<any>(pub, "ed25519.PublicKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PublicKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "ed25519.PublicKey"), [$.methodSignature("Equal", [["x", "crypto.PublicKey"]], [/* @__PURE__ */ $.basicType("bool")])]), $.namedValueInterfaceValue<any>(priv, "ed25519.PrivateKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Public: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Public as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Seed: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Seed as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Sign: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Sign as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "ed25519.PrivateKey"), [$.methodSignature("Equal", [["x", "crypto.PrivateKey"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Public", [], ["crypto.PublicKey"]), $.methodSignature("Seed", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("Sign", [["rand", "io.Reader"], ["message", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["opts", "crypto.SignerOpts"]], [["signature", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["err", "error"]])]))
	let der: $.Slice<number> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	await $.println("create err nil", err == null)
	await $.println("der nonempty", $.len(der) != 0)
	if (err != null) {
		await $.println("create error", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}

	let __goscriptTuple3: any = await x509.ParseCertificate(der)
	let cert: x509.Certificate | $.VarRef<x509.Certificate> | null = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	await $.println("parse err nil", err == null)
	if (err != null) {
		await $.println("parse error", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	let keyExt: pkix.Extension = $.markAsStructValue(new pkix.Extension())
	for (let __goscriptRangeTarget1 = $.pointerValue<x509.Certificate>(cert).Extensions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let ext = __goscriptRangeTarget1![__rangeIndex]
		if (asn1.ObjectIdentifier_Equal(ext.Id, (extensionID as asn1.ObjectIdentifier))) {
			$.assignStruct(keyExt, $.markAsStructValue($.cloneStructValue(ext)))
			for (let __goscriptRangeTarget0 = $.pointerValue<x509.Certificate>(cert).UnhandledCriticalExtensions, idx = 0; idx < $.len(__goscriptRangeTarget0); idx++) {
				let unhandled = __goscriptRangeTarget0![idx]
				if (asn1.ObjectIdentifier_Equal(unhandled, (extensionID as asn1.ObjectIdentifier))) {
					$.pointerValue<x509.Certificate>(cert).UnhandledCriticalExtensions = (slices.Delete($.pointerValue<x509.Certificate>(cert).UnhandledCriticalExtensions, idx, idx + 1) as $.Slice<asn1.ObjectIdentifier>)
					break
				}
			}
			break
		}
	}
	let decoded: $.VarRef<signedKey> = $.varRef($.markAsStructValue(new signedKey()))
	let __goscriptTuple4: any = await asn1.Unmarshal(keyExt.Value, $.interfaceValue(decoded, "*main.signedKey", /* @__PURE__ */ $.pointerType("main.signedKey")))
	err = __goscriptTuple4[1]
	await $.println("extension unmarshal", err == null, $.len(decoded.value.PubKey), $.uint($.arrayIndex(decoded.value.PubKey!, 0), 8), $.uint($.arrayIndex(decoded.value.PubKey!, 5), 8), $.len(decoded.value.Signature))
	let pool: x509.CertPool | $.VarRef<x509.CertPool> | null = x509.NewCertPool()
	await x509.CertPool.prototype.AddCert.call(pool, cert)
	let __goscriptTuple5: any = await x509.Certificate.prototype.Verify.call(cert, $.markAsStructValue(new x509.VerifyOptions({Roots: pool})))
	err = __goscriptTuple5[1]
	await $.println("verify err nil", err == null)
	if (err != null) {
		await $.println("verify error", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		await $.println("verify error type", await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf((err as any))).String())
		{
			const __goscriptTypeSwitchValue = err
			switch (true) {
				case $.typeAssert<x509.CertificateInvalidError>(__goscriptTypeSwitchValue, "x509.CertificateInvalidError").ok:
					{
						let typed: x509.CertificateInvalidError = $.typeAssert<x509.CertificateInvalidError>(__goscriptTypeSwitchValue, "x509.CertificateInvalidError").value
						await $.println("certificate invalid", $.int(typed.Reason), typed.Detail)
					}
					break
				case $.typeAssert<x509.UnknownAuthorityError>(__goscriptTypeSwitchValue, "x509.UnknownAuthorityError").ok:
					{
						let typed: x509.UnknownAuthorityError = $.typeAssert<x509.UnknownAuthorityError>(__goscriptTypeSwitchValue, "x509.UnknownAuthorityError").value
						await $.println("unknown authority")
					}
					break
				default:
					{
						let typed: any = __goscriptTypeSwitchValue
						await $.println("other error")
					}
					break
			}
		}
		return
	}

	await $.println("serial", await big.Int.prototype.String.call($.pointerValue<x509.Certificate>(cert).SerialNumber))
	await $.println("common name", $.pointerValue<x509.Certificate>(cert).Subject.CommonName)
	await $.println("organization", $.arrayIndex($.pointerValue<x509.Certificate>(cert).Subject.Organization!, 0))
	await $.println("signature algorithm", x509.SignatureAlgorithm_String($.pointerValue<x509.Certificate>(cert).SignatureAlgorithm))
	await $.println("public key algorithm", x509.PublicKeyAlgorithm_String($.pointerValue<x509.Certificate>(cert).PublicKeyAlgorithm))
	await $.println("public key equal", ed25519.PublicKey_Equal($.mustTypeAssert<ed25519.PublicKey>($.pointerValue<x509.Certificate>(cert).PublicKey, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "ed25519.PublicKey")), $.namedValueInterfaceValue<crypto.PublicKey | null>(pub, "ed25519.PublicKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PublicKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "ed25519.PublicKey"), [$.methodSignature("Equal", [["x", "crypto.PublicKey"]], [/* @__PURE__ */ $.basicType("bool")])])))
}

if ($.isMainScript(import.meta)) {
	await main()
}

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
	public get PubKey(): $.Slice<number> {
		return this._fields.PubKey.value
	}
	public set PubKey(value: $.Slice<number>) {
		this._fields.PubKey.value = value
	}

	public get Signature(): $.Slice<number> {
		return this._fields.Signature.value
	}
	public set Signature(value: $.Slice<number>) {
		this._fields.Signature.value = value
	}

	public _fields: {
		PubKey: $.VarRef<$.Slice<number>>
		Signature: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{PubKey?: $.Slice<number>, Signature?: $.Slice<number>}>) {
		this._fields = {
			PubKey: $.varRef(init?.PubKey ?? (null! as $.Slice<number>)),
			Signature: $.varRef(init?.Signature ?? (null! as $.Slice<number>))
		}
	}

	public clone(): signedKey {
		const cloned = new signedKey()
		cloned._fields = {
			PubKey: $.varRef(this._fields.PubKey.value),
			Signature: $.varRef(this._fields.Signature.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.signedKey",
		() => new signedKey(),
		[],
		signedKey,
		[{ name: "PubKey", key: "PubKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "Signature", key: "Signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [1], offset: 24, exported: true }]
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
	$.println("keygen err nil", err == null)
	let __goscriptTuple1: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue(new signedKey({PubKey: new Uint8Array([8, 1, 18, 2, 3, 4]) as $.Slice<number>, Signature: new Uint8Array([5, 6]) as $.Slice<number>})), "main.signedKey", "main.signedKey"))
	let extensionDER: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	$.println("extension marshal err nil", err == null)

	let template: x509.Certificate | $.VarRef<x509.Certificate> | null = (() => { const __goscriptLiteralField0 = big.NewInt(42n); const __goscriptLiteralField1 = $.markAsStructValue($.cloneStructValue(time.Unix(1700000000n, 0n))); const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue(time.Unix(4900000000n, 0n))); return new x509.Certificate({SerialNumber: __goscriptLiteralField0, Subject: $.markAsStructValue(new pkix.Name({CommonName: "goscript.test", Organization: $.arrayToSlice<string>(["GoScript"])})), NotBefore: __goscriptLiteralField1, NotAfter: __goscriptLiteralField2, KeyUsage: x509.KeyUsageDigitalSignature, ExtKeyUsage: $.arrayToSlice<x509.ExtKeyUsage>([x509.ExtKeyUsageServerAuth]), BasicConstraintsValid: true, ExtraExtensions: $.arrayToSlice<pkix.Extension>([$.markAsStructValue(new pkix.Extension({Id: (extensionID as asn1.ObjectIdentifier), Critical: true, Value: extensionDER}))])}) })()
	let __goscriptTuple2: any = await x509.CreateCertificate(rand.Reader, template, template, $.namedValueInterfaceValue<any>(pub, "ed25519.PublicKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PublicKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Equal", args: [{ name: "x", type: "crypto.PublicKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]), $.namedValueInterfaceValue<any>(priv, "ed25519.PrivateKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Public: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Public as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Seed: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Seed as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Sign: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Sign as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "ed25519.PrivateKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Equal", args: [{ name: "x", type: "crypto.PrivateKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Public", args: [], returns: [{ name: "_r0", type: "crypto.PublicKey" }] }, { name: "Seed", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Sign", args: [{ name: "rand", type: "io.Reader" }, { name: "message", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "opts", type: "crypto.SignerOpts" }], returns: [{ name: "signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }]))
	let der: $.Slice<number> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	$.println("create err nil", err == null)
	$.println("der nonempty", $.len(der) != 0)
	if (err != null) {
		$.println("create error", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}

	let __goscriptTuple3: any = await x509.ParseCertificate(der)
	let cert: x509.Certificate | $.VarRef<x509.Certificate> | null = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	$.println("parse err nil", err == null)
	if (err != null) {
		$.println("parse error", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	let keyExt: pkix.Extension = $.markAsStructValue(new pkix.Extension())
	for (let __goscriptRangeTarget1 = $.pointerValue<x509.Certificate>(cert).Extensions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let ext = __goscriptRangeTarget1![__rangeIndex]
		if (asn1.ObjectIdentifier_Equal(ext.Id, (extensionID as asn1.ObjectIdentifier))) {
			keyExt = $.markAsStructValue($.cloneStructValue(ext))
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
	let __goscriptTuple4: any = await asn1.Unmarshal(keyExt.Value, $.interfaceValue<any>(decoded, "*main.signedKey", { kind: $.TypeKind.Pointer, elemType: "main.signedKey" }))
	err = __goscriptTuple4[1]
	$.println("extension unmarshal", err == null, $.len(decoded.value.PubKey), $.uint($.arrayIndex(decoded.value.PubKey!, 0), 8), $.uint($.arrayIndex(decoded.value.PubKey!, 5), 8), $.len(decoded.value.Signature))
	let pool: x509.CertPool | $.VarRef<x509.CertPool> | null = x509.NewCertPool()
	await x509.CertPool.prototype.AddCert.call(pool, cert)
	let __goscriptTuple5: any = await x509.Certificate.prototype.Verify.call(cert, $.markAsStructValue(new x509.VerifyOptions({Roots: pool})))
	err = __goscriptTuple5[1]
	$.println("verify err nil", err == null)
	if (err != null) {
		$.println("verify error", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		$.println("verify error type", await $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf((err as any))).String())
		{
			const __goscriptTypeSwitchValue = err
			switch (true) {
				case $.typeAssert<x509.CertificateInvalidError>(__goscriptTypeSwitchValue, "x509.CertificateInvalidError").ok:
					{
						let typed: x509.CertificateInvalidError = $.typeAssert<x509.CertificateInvalidError>(__goscriptTypeSwitchValue, "x509.CertificateInvalidError").value
						$.println("certificate invalid", $.int(typed.Reason), typed.Detail)
					}
					break
				case $.typeAssert<x509.UnknownAuthorityError>(__goscriptTypeSwitchValue, "x509.UnknownAuthorityError").ok:
					{
						let typed: x509.UnknownAuthorityError = $.typeAssert<x509.UnknownAuthorityError>(__goscriptTypeSwitchValue, "x509.UnknownAuthorityError").value
						$.println("unknown authority")
					}
					break
				default:
					{
						let typed: any = __goscriptTypeSwitchValue
						$.println("other error")
					}
					break
			}
		}
		return
	}

	$.println("serial", await big.Int.prototype.String.call($.pointerValue<x509.Certificate>(cert).SerialNumber))
	$.println("common name", $.pointerValue<x509.Certificate>(cert).Subject.CommonName)
	$.println("organization", $.arrayIndex($.pointerValue<x509.Certificate>(cert).Subject.Organization!, 0))
	$.println("signature algorithm", x509.SignatureAlgorithm_String($.pointerValue<x509.Certificate>(cert).SignatureAlgorithm))
	$.println("public key algorithm", x509.PublicKeyAlgorithm_String($.pointerValue<x509.Certificate>(cert).PublicKeyAlgorithm))
	$.println("public key equal", ed25519.PublicKey_Equal($.mustTypeAssert<ed25519.PublicKey>($.pointerValue<x509.Certificate>(cert).PublicKey, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }), $.namedValueInterfaceValue<crypto.PublicKey | null>(pub, "ed25519.PublicKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PublicKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Equal", args: [{ name: "x", type: "crypto.PublicKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }])))
}

if ($.isMainScript(import.meta)) {
	await main()
}

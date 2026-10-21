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
import "@goscript/crypto/rand/index.js"
import "@goscript/io/index.js"

export class signedKey {
	public declare PubKey: $.Slice<number>

	public declare Signature: $.Slice<number>

	constructor(__goscriptValue?: boolean, PubKey$?: $.Slice<number>, Signature$?: $.Slice<number>) {
		this.PubKey = PubKey$ ?? (null! as $.Slice<number>)
		this.Signature = Signature$ ?? (null! as $.Slice<number>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): signedKey {
		return new signedKey(true, this.PubKey, this.Signature)
	}

	public __goscriptAssign(source: signedKey): this {
		this.PubKey = source.PubKey
		this.Signature = source.Signature
		return this
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
	let err: $.GoError = __goscriptTuple0[2]
	await $.println("keygen err nil", err == null)
	let __goscriptTuple1: any = asn1.Marshal($.structInterfaceValue(new signedKey(true, new Uint8Array([8, 1, 18, 2, 3, 4]) as $.Slice<number>, new Uint8Array([5, 6]) as $.Slice<number>), "main.signedKey", "main.signedKey"))
	let extensionDER: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	await $.println("extension marshal err nil", err == null)

	let template = (() => { const __goscriptLiteralField0 = big.NewInt(42n); const __goscriptLiteralField1 = $.markAsStructValue($.cloneStructValue(time.Unix(1700000000n, 0n))); const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue(time.Unix(4900000000n, 0n))); return new x509.Certificate(false, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, __goscriptLiteralField0, undefined, new pkix.Name(true, undefined, $.arrayToSlice<string>(["GoScript"]), undefined, undefined, undefined, undefined, undefined, undefined, "goscript.test"), __goscriptLiteralField1, __goscriptLiteralField2, 1, undefined, $.arrayToSlice<pkix.Extension>([new pkix.Extension(true, (extensionID as asn1.ObjectIdentifier), true, extensionDER)]), undefined, $.arrayToSlice<x509.ExtKeyUsage>([1]), undefined, true) })()
	let __goscriptTuple2: any = await x509.CreateCertificate(rand.Reader, template, template, $.namedValueInterfaceValue<any>(pub, "ed25519.PublicKey", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()), $.namedValueInterfaceValue<any>(priv, "ed25519.PrivateKey", __goscriptStatic3(), __goscriptStatic4(), __goscriptStatic5()))
	let der: $.Slice<number> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	await $.println("create err nil", err == null)
	await $.println("der nonempty", $.sliceLen(der) != 0)
	if (err != null) {
		await $.println("create error", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		return
	}

	let __goscriptTuple3: any = await x509.ParseCertificate(der)
	let cert: x509.Certificate | $.VarRef<x509.Certificate> | null = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	let cert$: x509.Certificate = cert == null ? $.pointerTarget<x509.Certificate>(cert) : (cert as any).__isVarRef === true ? (cert as any).value : (cert as any).__goValue === undefined ? (cert as any) : $.pointerTarget<x509.Certificate>(cert)
	await $.println("parse err nil", err == null)
	if (err != null) {
		await $.println("parse error", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		return
	}
	let keyExt: pkix.Extension = new pkix.Extension(true)
	for (let __goscriptRangeTarget1 = (cert$ as x509.Certificate).Extensions, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let ext = ((__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as pkix.Extension)).clone()
		if (asn1.ObjectIdentifier_Equal(ext.Id, (extensionID as asn1.ObjectIdentifier))) {
			keyExt = keyExt.__goscriptAssign(ext)
			for (let __goscriptRangeTarget0 = (cert$ as x509.Certificate).UnhandledCriticalExtensions, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget0), idx = 0; idx < __goscriptRangeWindow1.length; idx++) {
				let unhandled = ((__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + idx] as asn1.ObjectIdentifier) as asn1.ObjectIdentifier)
				if (asn1.ObjectIdentifier_Equal(unhandled, (extensionID as asn1.ObjectIdentifier))) {
					;(cert$ as x509.Certificate).UnhandledCriticalExtensions = (slices.Delete((cert$ as x509.Certificate).UnhandledCriticalExtensions, idx, idx + 1, () => (null! as asn1.ObjectIdentifier as asn1.ObjectIdentifier)) as $.Slice<asn1.ObjectIdentifier>)
					break
				}
			}
			break
		}
	}
	let decoded: $.VarRef<signedKey> = $.varRef(new signedKey(true))
	let __goscriptTuple4: any = asn1.Unmarshal(keyExt.Value, $.interfaceValue(decoded, "*main.signedKey", /* @__PURE__ */ $.pointerType("main.signedKey")))
	err = __goscriptTuple4[1]
	await $.println("extension unmarshal", err == null, $.sliceLen(decoded.value.PubKey), $.arrayIndex(decoded.value.PubKey!, 0), $.arrayIndex(decoded.value.PubKey!, 5), $.sliceLen(decoded.value.Signature))
	let pool = x509.NewCertPool()
	await (pool !== null && (pool as any).__isVarRef !== true && (pool as any).__goValue === undefined ? ((pool as any) as x509.CertPool).AddCert(cert) : x509.CertPool.prototype.AddCert.call(pool, cert))
	let __goscriptTuple5: any = await (cert !== null && (cert as any).__isVarRef !== true && (cert as any).__goValue === undefined ? ((cert as any) as x509.Certificate).Verify(new x509.VerifyOptions(true, undefined, undefined, pool)) : x509.Certificate.prototype.Verify.call(cert, new x509.VerifyOptions(true, undefined, undefined, pool)))
	err = __goscriptTuple5[1]
	await $.println("verify err nil", err == null)
	if (err != null) {
		await $.println("verify error", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		await $.println("verify error type", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf((err as any))).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		{
			const __goscriptTypeSwitchValue = err
			switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic6())) {
				case 0:
					{
						let typed: x509.CertificateInvalidError = $.markAsStructValue($.cloneStructValue($.typeAssert<x509.CertificateInvalidError>(__goscriptTypeSwitchValue, "x509.CertificateInvalidError").value))
						await $.println("certificate invalid", typed.Reason, typed.Detail)
					}
					break
				case 1:
					{
						let typed: x509.UnknownAuthorityError = $.markAsStructValue($.cloneStructValue($.typeAssert<x509.UnknownAuthorityError>(__goscriptTypeSwitchValue, "x509.UnknownAuthorityError").value))
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

	await $.println("serial", big.Int.prototype.String.call($.pointerValue<big.Int>((cert$ as x509.Certificate).SerialNumber)))
	await $.println("common name", (cert$ as x509.Certificate).Subject.CommonName)
	await $.println("organization", $.arrayIndex((cert$ as x509.Certificate).Subject.Organization!, 0))
	await $.println("signature algorithm", x509.SignatureAlgorithm_String((cert$ as x509.Certificate).SignatureAlgorithm))
	await $.println("public key algorithm", x509.PublicKeyAlgorithm_String((cert$ as x509.Certificate).PublicKeyAlgorithm))
	await $.println("public key equal", ed25519.PublicKey_Equal($.mustTypeAssert<ed25519.PublicKey>((cert$ as x509.Certificate).PublicKey, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "ed25519.PublicKey")), $.namedValueInterfaceValue<crypto.PublicKey | null>(pub, "ed25519.PublicKey", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2())))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({Equal: (receiver: any, ...args: any[]) => (ed25519.PublicKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "ed25519.PublicKey"))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ([$.methodSignature("Equal", [["x", "crypto.PublicKey"]], [/* @__PURE__ */ $.basicType("bool")])])
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ({Equal: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Public: (receiver: any) => (ed25519.PrivateKey_Public as any)(($.isVarRef(receiver) ? receiver.value : receiver)), Seed: (receiver: any) => (ed25519.PrivateKey_Seed as any)(($.isVarRef(receiver) ? receiver.value : receiver)), Sign: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Sign as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))})
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= (/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "ed25519.PrivateKey"))
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ([$.methodSignature("Equal", [["x", "crypto.PrivateKey"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Public", [], ["crypto.PublicKey"]), $.methodSignature("Seed", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("Sign", [["rand", "io.Reader"], ["message", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["opts", "crypto.SignerOpts"]], [["signature", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["err", "error"]])])
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ($.typeSwitchSite(["x509.CertificateInvalidError", "x509.UnknownAuthorityError"]))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

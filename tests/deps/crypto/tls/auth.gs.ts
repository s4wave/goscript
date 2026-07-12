// Generated file based on auth.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ecdsa from "@goscript/crypto/ecdsa/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as elliptic from "@goscript/crypto/elliptic/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as hash2 from "@goscript/hash/index.js"

import * as io from "@goscript/io/index.js"

import * as slices from "@goscript/slices/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdsa/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/elliptic/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"
import "@goscript/slices/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/internal/godebug/index.js"
import "./common.gs.ts"
import "./common_string.gs.ts"

export const serverSignatureContext: string = "TLS 1.3, server CertificateVerify\x00"

export const clientSignatureContext: string = "TLS 1.3, client CertificateVerify\x00"

export async function verifyHandshakeSignature(sigType: number, pubkey: crypto.PublicKey | null, hashFunc: crypto.Hash, signed: $.Slice<number>, sig: $.Slice<number>): globalThis.Promise<$.GoError> {
	if (hashFunc != __goscript_common.directSigning) {
		let h = await crypto.Hash_New(hashFunc)
		await $.pointerValue<Exclude<hash2.Hash, null>>(h).Write(signed)
		signed = await $.pointerValue<Exclude<hash2.Hash, null>>(h).Sum(null)
	}
	switch (sigType) {
		case 227:
		{
			let __goscriptTuple0: any = $.typeAssertTuple<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(pubkey, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" })
			let pubKey: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = __goscriptTuple0[0]
			let ok = __goscriptTuple0[1]
			if (!ok) {
				return fmt.Errorf("expected an ECDSA public key, got %T", (pubkey as any))
			}
			if (!await ecdsa.VerifyASN1(pubKey, signed, sig)) {
				return errors.New("ECDSA verification failure")
			}
			break
		}
		case 228:
		{
			let __goscriptTuple1: any = $.typeAssertTuple<ed25519.PublicKey>(pubkey, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } })
			let pubKey: ed25519.PublicKey = (__goscriptTuple1[0] as ed25519.PublicKey)
			let ok = __goscriptTuple1[1]
			if (!ok) {
				return fmt.Errorf("expected an Ed25519 public key, got %T", (pubkey as any))
			}
			if (!await ed25519.Verify((pubKey as ed25519.PublicKey), signed, sig)) {
				return errors.New("Ed25519 verification failure")
			}
			break
		}
		case 225:
		{
			let __goscriptTuple2: any = $.typeAssertTuple<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(pubkey, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" })
			let pubKey: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = __goscriptTuple2[0]
			let ok = __goscriptTuple2[1]
			if (!ok) {
				return fmt.Errorf("expected an RSA public key, got %T", (pubkey as any))
			}
			{
				let err = await rsa.VerifyPKCS1v15(pubKey, hashFunc, signed, sig)
				if (err != null) {
					return err
				}
			}
			break
		}
		case 226:
		{
			let __goscriptTuple3: any = $.typeAssertTuple<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(pubkey, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" })
			let pubKey: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = __goscriptTuple3[0]
			let ok = __goscriptTuple3[1]
			if (!ok) {
				return fmt.Errorf("expected an RSA public key, got %T", (pubkey as any))
			}
			let signOpts: rsa.PSSOptions | $.VarRef<rsa.PSSOptions> | null = new rsa.PSSOptions({SaltLength: rsa.PSSSaltLengthEqualsHash})
			{
				let err = await rsa.VerifyPSS(pubKey, hashFunc, signed, sig, signOpts)
				if (err != null) {
					return err
				}
			}
			break
		}
		default:
		{
			return errors.New("internal error: unknown signature type")
			break
		}
	}
	return null
}

export async function verifyLegacyHandshakeSignature(sigType: number, pubkey: crypto.PublicKey | null, hashFunc: crypto.Hash, hashed: $.Slice<number>, sig: $.Slice<number>): globalThis.Promise<$.GoError> {
	switch (sigType) {
		case 227:
		{
			let __goscriptTuple4: any = $.typeAssertTuple<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(pubkey, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" })
			let pubKey: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = __goscriptTuple4[0]
			let ok = __goscriptTuple4[1]
			if (!ok) {
				return fmt.Errorf("expected an ECDSA public key, got %T", (pubkey as any))
			}
			if (!await ecdsa.VerifyASN1(pubKey, hashed, sig)) {
				return errors.New("ECDSA verification failure")
			}
			break
		}
		case 225:
		{
			let __goscriptTuple5: any = $.typeAssertTuple<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(pubkey, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" })
			let pubKey: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = __goscriptTuple5[0]
			let ok = __goscriptTuple5[1]
			if (!ok) {
				return fmt.Errorf("expected an RSA public key, got %T", (pubkey as any))
			}
			{
				let err = await rsa.VerifyPKCS1v15(pubKey, hashFunc, hashed, sig)
				if (err != null) {
					return err
				}
			}
			break
		}
		default:
		{
			return errors.New("internal error: unknown signature type")
			break
		}
	}
	return null
}

export let signaturePadding: $.Slice<number> = new Uint8Array([32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32]) as $.Slice<number>

export function __goscript_set_signaturePadding(__goscriptValue: $.Slice<number>): void {
	signaturePadding = __goscriptValue
}

export async function signedMessage(context: string, transcript: hash2.Hash | null): globalThis.Promise<$.Slice<number>> {
	const maxSize: number = 162
	let b: bytes.Buffer | $.VarRef<bytes.Buffer> | null = bytes.NewBuffer($.makeSlice<number>(0, 162, "byte"))
	bytes.Buffer.prototype.Write.call($.pointerValue<bytes.Buffer>(b), signaturePadding)
	await io.WriteString($.pointerValueOrNil($.interfaceValue<io.Writer | null>(b, "*bytes.Buffer", { kind: $.TypeKind.Pointer, elemType: "bytes.Buffer" }))!, context)
	bytes.Buffer.prototype.Write.call($.pointerValue<bytes.Buffer>(b), await $.pointerValue<Exclude<hash2.Hash, null>>(transcript).Sum(null))
	return bytes.Buffer.prototype.Bytes.call($.pointerValue<bytes.Buffer>(b))
}

export function typeAndHashFromSignatureScheme(signatureAlgorithm: __goscript_common.SignatureScheme): [number, crypto.Hash, $.GoError] {
	let sigType: number = 0
	let hash: crypto.Hash = 0
	let err: $.GoError = null as $.GoError
	switch (signatureAlgorithm) {
		case 513:
		case 1025:
		case 1281:
		case 1537:
		{
			sigType = $.uint(225, 8)
			break
		}
		case 2052:
		case 2053:
		case 2054:
		{
			sigType = $.uint(226, 8)
			break
		}
		case 515:
		case 1027:
		case 1283:
		case 1539:
		{
			sigType = $.uint(227, 8)
			break
		}
		case 2055:
		{
			sigType = $.uint(228, 8)
			break
		}
		default:
		{
			return [$.uint(0, 8), 0, fmt.Errorf("unsupported signature algorithm: %v", $.namedValueInterfaceValue<any>(signatureAlgorithm, "tls.SignatureScheme", {String: (receiver: any, ...args: any[]) => (__goscript_common_string.SignatureScheme_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" }, [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))]
			break
		}
	}
	switch (signatureAlgorithm) {
		case 513:
		case 515:
		{
			hash = crypto.SHA1
			break
		}
		case 1025:
		case 2052:
		case 1027:
		{
			hash = crypto.SHA256
			break
		}
		case 1281:
		case 2053:
		case 1283:
		{
			hash = crypto.SHA384
			break
		}
		case 1537:
		case 2054:
		case 1539:
		{
			hash = crypto.SHA512
			break
		}
		case 2055:
		{
			hash = __goscript_common.directSigning
			break
		}
		default:
		{
			return [$.uint(0, 8), 0, fmt.Errorf("unsupported signature algorithm: %v", $.namedValueInterfaceValue<any>(signatureAlgorithm, "tls.SignatureScheme", {String: (receiver: any, ...args: any[]) => (__goscript_common_string.SignatureScheme_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" }, [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))]
			break
		}
	}
	return [$.uint(sigType, 8), hash, null]
}

export function legacyTypeAndHashFromPublicKey(pub: crypto.PublicKey | null): [number, crypto.Hash, $.GoError] {
	let sigType: number = 0
	let hash: crypto.Hash = 0
	let err: $.GoError = null as $.GoError
	{
		const __goscriptTypeSwitchValue = pub
		switch (true) {
			case $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).ok:
				{
					return [$.uint(225, 8), crypto.MD5SHA1, null]
				}
				break
			case $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).ok:
				{
					return [$.uint(227, 8), crypto.SHA1, null]
				}
				break
			case $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					return [$.uint(0, 8), 0, fmt.Errorf("tls: Ed25519 public keys are not supported before TLS 1.2")]
				}
				break
			default:
				{
					return [$.uint(0, 8), 0, fmt.Errorf("tls: unsupported public key: %T", (pub as any))]
				}
				break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export var rsaSignatureSchemes: $.Slice<{"scheme": __goscript_common.SignatureScheme, "minModulusBytes": number}>

export async function __goscript_init_rsaSignatureSchemes(): globalThis.Promise<void> {
	if (((rsaSignatureSchemes) as any) === undefined) {
		rsaSignatureSchemes = await $.arrayToSlice<{"scheme": __goscript_common.SignatureScheme, "minModulusBytes": number}>([{scheme: $.uint(2052, 16), minModulusBytes: (crypto.Hash_Size(crypto.SHA256) * 2) + 2}, {scheme: $.uint(2053, 16), minModulusBytes: (crypto.Hash_Size(crypto.SHA384) * 2) + 2}, {scheme: $.uint(2054, 16), minModulusBytes: (crypto.Hash_Size(crypto.SHA512) * 2) + 2}, {scheme: $.uint(1025, 16), minModulusBytes: (19 + crypto.Hash_Size(crypto.SHA256)) + 11}, {scheme: $.uint(1281, 16), minModulusBytes: (19 + crypto.Hash_Size(crypto.SHA384)) + 11}, {scheme: $.uint(1537, 16), minModulusBytes: (19 + crypto.Hash_Size(crypto.SHA512)) + 11}, {scheme: $.uint(513, 16), minModulusBytes: (15 + crypto.Hash_Size(crypto.SHA1)) + 11}])
	}
}

export function __goscript_get_rsaSignatureSchemes(): $.Slice<{"scheme": __goscript_common.SignatureScheme, "minModulusBytes": number}> {
	if (((rsaSignatureSchemes) as any) === undefined) {
		throw new Error("goscript package variable rsaSignatureSchemes read before initialization")
	}
	return rsaSignatureSchemes
}

export function __goscript_set_rsaSignatureSchemes(__goscriptValue: $.Slice<{"scheme": __goscript_common.SignatureScheme, "minModulusBytes": number}>): void {
	rsaSignatureSchemes = __goscriptValue
}

export async function signatureSchemesForPublicKey(version: number, pub: crypto.PublicKey | null): globalThis.Promise<$.Slice<__goscript_common.SignatureScheme>> {
	{
		const __goscriptTypeSwitchValue = pub
		switch (true) {
			case $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).ok:
				{
					let pub: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).value
					if ($.uint(version, 16) < $.uint(772, 16)) {
						// In TLS 1.2 and earlier, ECDSA algorithms are not
						// constrained to a single curve.
						return $.arrayToSlice<__goscript_common.SignatureScheme>([$.uint(1027, 16), $.uint(1283, 16), $.uint(1539, 16), $.uint(515, 16)])
					}
					{
						let __goscriptSwitch0 = $.pointerValue<ecdsa.PublicKey>(pub).Curve
						switch (true) {
							case $.comparableEqual(__goscriptSwitch0, await elliptic.P256()):
							{
								return $.arrayToSlice<__goscript_common.SignatureScheme>([$.uint(1027, 16)])
								break
							}
							case $.comparableEqual(__goscriptSwitch0, await elliptic.P384()):
							{
								return $.arrayToSlice<__goscript_common.SignatureScheme>([$.uint(1283, 16)])
								break
							}
							case $.comparableEqual(__goscriptSwitch0, await elliptic.P521()):
							{
								return $.arrayToSlice<__goscript_common.SignatureScheme>([$.uint(1539, 16)])
								break
							}
							default:
							{
								return null
								break
							}
						}
					}
				}
				break
			case $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).ok:
				{
					let pub: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).value
					let size = rsa.PublicKey.prototype.Size.call(pub)
					let sigAlgs: $.Slice<__goscript_common.SignatureScheme> = $.makeSlice<__goscript_common.SignatureScheme>(0, $.len((await __goscript_init_rsaSignatureSchemes(), __goscript_get_rsaSignatureSchemes())), "number")
					for (let __goscriptRangeTarget0 = (await __goscript_init_rsaSignatureSchemes(), __goscript_get_rsaSignatureSchemes()), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
						let candidate = __goscriptRangeTarget0![__rangeIndex]
						if (size >= candidate.minModulusBytes) {
							sigAlgs = $.append(sigAlgs, $.uint(candidate.scheme, 16))
						}
					}
					return sigAlgs
				}
				break
			case $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let pub: ed25519.PublicKey = $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					return $.arrayToSlice<__goscript_common.SignatureScheme>([$.uint(2055, 16)])
				}
				break
			default:
				{
					let pub: any = __goscriptTypeSwitchValue
					return null
				}
				break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function selectSignatureScheme(vers: number, c: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null, peerAlgs: $.Slice<__goscript_common.SignatureScheme>): globalThis.Promise<[__goscript_common.SignatureScheme, $.GoError]> {
	let [priv, ok] = $.typeAssertTuple<crypto.Signer | null>($.pointerValue<__goscript_common.Certificate>(c).PrivateKey, "crypto.Signer")
	if (!ok) {
		return [$.uint(0, 16), await unsupportedCertificateError(c)]
	}
	let supportedAlgs: $.Slice<__goscript_common.SignatureScheme> = await signatureSchemesForPublicKey($.uint(vers, 16), await $.pointerValue<Exclude<crypto.Signer, null>>(priv).Public())
	if ($.pointerValue<__goscript_common.Certificate>(c).SupportedSignatureAlgorithms != null) {
		supportedAlgs = (slices.DeleteFunc(supportedAlgs, $.functionValue((sigAlg: __goscript_common.SignatureScheme): boolean => {
			return !__goscript_common.isSupportedSignatureAlgorithm($.uint(sigAlg, 16), $.pointerValue<__goscript_common.Certificate>(c).SupportedSignatureAlgorithms)
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<__goscript_common.SignatureScheme>)
	}
	// Filter out any unsupported signature algorithms, for example due to
	// FIPS 140-3 policy, tlssha1=0, or protocol version.
	supportedAlgs = (slices.DeleteFunc(supportedAlgs, $.functionValue((sigAlg: __goscript_common.SignatureScheme): boolean => {
		return __goscript_common.isDisabledSignatureAlgorithm($.uint(vers, 16), $.uint(sigAlg, 16), false)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.SignatureScheme" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<__goscript_common.SignatureScheme>)
	if ($.len(supportedAlgs) == 0) {
		return [$.uint(0, 16), await unsupportedCertificateError(c)]
	}
	if (($.len(peerAlgs) == 0) && ($.uint(vers, 16) == $.uint(771, 16))) {
		// For TLS 1.2, if the client didn't send signature_algorithms then we
		// can assume that it supports SHA1. See RFC 5246, Section 7.4.1.4.1.
		// RFC 9155 made signature_algorithms mandatory in TLS 1.2, and we gated
		// it behind the tlssha1 GODEBUG setting.
		if (!$.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(__goscript_common.tlssha1)), "1")) {
			return [$.uint(0, 16), errors.New("tls: missing signature_algorithms from TLS 1.2 peer")]
		}
		peerAlgs = $.arrayToSlice<__goscript_common.SignatureScheme>([$.uint(513, 16), $.uint(515, 16)])
	}
	// Pick signature scheme in the peer's preference order, as our
	// preference order is not configurable.
	for (let __goscriptRangeTarget1 = peerAlgs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let preferredAlg = __goscriptRangeTarget1![__rangeIndex]
		if (__goscript_common.isSupportedSignatureAlgorithm($.uint(preferredAlg, 16), supportedAlgs)) {
			return [$.uint(preferredAlg, 16), null]
		}
	}
	return [$.uint(0, 16), errors.New("tls: peer doesn't support any of the certificate's signature algorithms")]
}

export async function unsupportedCertificateError(cert: __goscript_common.Certificate | $.VarRef<__goscript_common.Certificate> | null): globalThis.Promise<$.GoError> {
	{
		const __goscriptTypeSwitchValue = $.pointerValue<__goscript_common.Certificate>(cert).PrivateKey
		switch (true) {
			case $.is(__goscriptTypeSwitchValue, "rsa.PrivateKey") || $.is(__goscriptTypeSwitchValue, "ecdsa.PrivateKey"):
				{
					return fmt.Errorf("tls: unsupported certificate: private key is %T, expected *%T", ($.pointerValue<__goscript_common.Certificate>(cert).PrivateKey as any), ($.pointerValue<__goscript_common.Certificate>(cert).PrivateKey as any))
				}
				break
			case $.typeAssert<$.VarRef<ed25519.PrivateKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, typeName: "ed25519.PrivateKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }).ok:
				{
					return fmt.Errorf("tls: unsupported certificate: private key is *ed25519.PrivateKey, expected ed25519.PrivateKey")
				}
				break
		}
	}

	let [signer, ok] = $.typeAssertTuple<crypto.Signer | null>($.pointerValue<__goscript_common.Certificate>(cert).PrivateKey, "crypto.Signer")
	if (!ok) {
		return fmt.Errorf("tls: certificate private key (%T) does not implement crypto.Signer", ($.pointerValue<__goscript_common.Certificate>(cert).PrivateKey as any))
	}

	{
		const __goscriptTypeSwitchValue = await $.pointerValue<Exclude<crypto.Signer, null>>(signer).Public()
		switch (true) {
			case $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).ok:
				{
					let pub: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).value
					{
						let __goscriptSwitch1 = $.pointerValue<ecdsa.PublicKey>(pub).Curve
						switch (true) {
							case $.comparableEqual(__goscriptSwitch1, await elliptic.P256()):
							{
								break
							}
							case $.comparableEqual(__goscriptSwitch1, await elliptic.P384()):
							{
								break
							}
							case $.comparableEqual(__goscriptSwitch1, await elliptic.P521()):
							{
								break
							}
							default:
							{
								return fmt.Errorf("tls: unsupported certificate curve (%s)", $.pointerValue<elliptic.CurveParams>(await $.pointerValue<Exclude<elliptic.Curve, null>>($.pointerValue<ecdsa.PublicKey>(pub).Curve).Params()).Name)
								break
							}
						}
					}
				}
				break
			case $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).ok:
				{
					let pub: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).value
					return fmt.Errorf("tls: certificate RSA key size too small for supported signature algorithms")
				}
				break
			case $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let pub: ed25519.PublicKey = $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
				}
				break
			default:
				{
					let pub: any = __goscriptTypeSwitchValue
					return fmt.Errorf("tls: unsupported certificate key (%T)", (pub as any))
				}
				break
		}
	}

	if ($.pointerValue<__goscript_common.Certificate>(cert).SupportedSignatureAlgorithms != null) {
		return fmt.Errorf("tls: peer doesn't support the certificate custom signature algorithms")
	}

	return fmt.Errorf("tls: internal error: unsupported key (%T)", ($.pointerValue<__goscript_common.Certificate>(cert).PrivateKey as any))
}

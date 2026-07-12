// Generated file based on defaults_fips140.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as ecdsa from "@goscript/crypto/ecdsa/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as elliptic from "@goscript/crypto/elliptic/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as big from "@goscript/math/big/index.js"

import * as __goscript_cipher_suites from "./cipher_suites.gs.ts"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"
import "@goscript/crypto/ecdsa/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/elliptic/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/math/big/index.js"
import "./cipher_suites.gs.ts"
import "./common.gs.ts"
import "./common_string.gs.ts"

export var allowedSupportedVersionsFIPS: $.Slice<number>

export function __goscript_init_allowedSupportedVersionsFIPS(): void {
	if (((allowedSupportedVersionsFIPS) as any) === undefined) {
		allowedSupportedVersionsFIPS = $.arrayToSlice<number>([$.uint(771, 16), $.uint(772, 16)])
	}
}

export function __goscript_get_allowedSupportedVersionsFIPS(): $.Slice<number> {
	if (((allowedSupportedVersionsFIPS) as any) === undefined) {
		__goscript_init_allowedSupportedVersionsFIPS()
	}
	return allowedSupportedVersionsFIPS
}

export function __goscript_set_allowedSupportedVersionsFIPS(__goscriptValue: $.Slice<number>): void {
	allowedSupportedVersionsFIPS = __goscriptValue
}

export var allowedCurvePreferencesFIPS: $.Slice<__goscript_common.CurveID>

export function __goscript_init_allowedCurvePreferencesFIPS(): void {
	if (((allowedCurvePreferencesFIPS) as any) === undefined) {
		allowedCurvePreferencesFIPS = $.arrayToSlice<__goscript_common.CurveID>([$.uint(4588, 16), $.uint(4587, 16), $.uint(4589, 16), $.uint(23, 16), $.uint(24, 16), $.uint(25, 16)])
	}
}

export function __goscript_get_allowedCurvePreferencesFIPS(): $.Slice<__goscript_common.CurveID> {
	if (((allowedCurvePreferencesFIPS) as any) === undefined) {
		__goscript_init_allowedCurvePreferencesFIPS()
	}
	return allowedCurvePreferencesFIPS
}

export function __goscript_set_allowedCurvePreferencesFIPS(__goscriptValue: $.Slice<__goscript_common.CurveID>): void {
	allowedCurvePreferencesFIPS = __goscriptValue
}

export var allowedSignatureAlgorithmsFIPS: $.Slice<__goscript_common.SignatureScheme>

export function __goscript_init_allowedSignatureAlgorithmsFIPS(): void {
	if (((allowedSignatureAlgorithmsFIPS) as any) === undefined) {
		allowedSignatureAlgorithmsFIPS = $.arrayToSlice<__goscript_common.SignatureScheme>([$.uint(2052, 16), $.uint(1027, 16), $.uint(2055, 16), $.uint(2053, 16), $.uint(2054, 16), $.uint(1025, 16), $.uint(1281, 16), $.uint(1537, 16), $.uint(1283, 16), $.uint(1539, 16)])
	}
}

export function __goscript_get_allowedSignatureAlgorithmsFIPS(): $.Slice<__goscript_common.SignatureScheme> {
	if (((allowedSignatureAlgorithmsFIPS) as any) === undefined) {
		__goscript_init_allowedSignatureAlgorithmsFIPS()
	}
	return allowedSignatureAlgorithmsFIPS
}

export function __goscript_set_allowedSignatureAlgorithmsFIPS(__goscriptValue: $.Slice<__goscript_common.SignatureScheme>): void {
	allowedSignatureAlgorithmsFIPS = __goscriptValue
}

export var allowedCipherSuitesFIPS: $.Slice<number>

export function __goscript_init_allowedCipherSuitesFIPS(): void {
	if (((allowedCipherSuitesFIPS) as any) === undefined) {
		allowedCipherSuitesFIPS = $.arrayToSlice<number>([$.uint(49199, 16), $.uint(49200, 16), $.uint(49195, 16), $.uint(49196, 16), $.uint(49187, 16), $.uint(49191, 16)])
	}
}

export function __goscript_get_allowedCipherSuitesFIPS(): $.Slice<number> {
	if (((allowedCipherSuitesFIPS) as any) === undefined) {
		__goscript_init_allowedCipherSuitesFIPS()
	}
	return allowedCipherSuitesFIPS
}

export function __goscript_set_allowedCipherSuitesFIPS(__goscriptValue: $.Slice<number>): void {
	allowedCipherSuitesFIPS = __goscriptValue
}

export var allowedCipherSuitesTLS13FIPS: $.Slice<number>

export function __goscript_init_allowedCipherSuitesTLS13FIPS(): void {
	if (((allowedCipherSuitesTLS13FIPS) as any) === undefined) {
		allowedCipherSuitesTLS13FIPS = $.arrayToSlice<number>([$.uint(4865, 16), $.uint(4866, 16)])
	}
}

export function __goscript_get_allowedCipherSuitesTLS13FIPS(): $.Slice<number> {
	if (((allowedCipherSuitesTLS13FIPS) as any) === undefined) {
		__goscript_init_allowedCipherSuitesTLS13FIPS()
	}
	return allowedCipherSuitesTLS13FIPS
}

export function __goscript_set_allowedCipherSuitesTLS13FIPS(__goscriptValue: $.Slice<number>): void {
	allowedCipherSuitesTLS13FIPS = __goscriptValue
}

export async function isCertificateAllowedFIPS(c: x509.Certificate | $.VarRef<x509.Certificate> | null): globalThis.Promise<boolean> {
	{
		const __goscriptTypeSwitchValue = $.pointerValue<x509.Certificate>(c).PublicKey
		switch (true) {
			case $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).ok:
				{
					let k: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).value
					return big.Int.prototype.BitLen.call($.pointerValue<rsa.PublicKey>(k).N) >= 2048
				}
				break
			case $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).ok:
				{
					let k: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).value
					return (($.comparableEqual($.pointerValue<ecdsa.PublicKey>(k).Curve, await elliptic.P256())) || ($.comparableEqual($.pointerValue<ecdsa.PublicKey>(k).Curve, await elliptic.P384()))) || ($.comparableEqual($.pointerValue<ecdsa.PublicKey>(k).Curve, await elliptic.P521()))
				}
				break
			case $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let k: ed25519.PublicKey = $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					return true
				}
				break
			default:
				{
					let k: any = __goscriptTypeSwitchValue
					return false
				}
				break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

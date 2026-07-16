// Generated file based on parser.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as dsa from "@goscript/crypto/dsa/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as ecdsa from "@goscript/crypto/ecdsa/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as pkix from "@goscript/crypto/x509/pkix/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as math from "@goscript/math/index.js"

import * as big from "@goscript/math/big/index.js"

import * as net from "@goscript/net/index.js"

import * as url from "@goscript/net/url/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import * as time from "@goscript/time/index.js"

import * as utf16 from "@goscript/unicode/utf16/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

import * as cryptobyte from "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"

import * as cryptobyte_asn1 from "@goscript/vendor/golang.org/x/crypto/cryptobyte/asn1/index.js"

import type * as crypto from "@goscript/crypto/index.js"

import * as elliptic from "@goscript/crypto/elliptic/index.js"

import type * as io from "@goscript/io/index.js"

import * as __goscript_cert_pool from "./cert_pool.gs.ts"

import * as __goscript_oid from "./oid.gs.ts"

import * as __goscript_pkcs1 from "./pkcs1.gs.ts"

import * as __goscript_root_unix from "./root_unix.gs.ts"

import * as __goscript_verify from "./verify.gs.ts"

import * as __goscript_x509 from "./x509.gs.ts"

import * as __goscript_x509_string from "./x509_string.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/dsa/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/ecdsa/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/math/index.js"
import "@goscript/math/big/index.js"
import "@goscript/net/index.js"
import "@goscript/net/url/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"
import "@goscript/time/index.js"
import "@goscript/unicode/utf16/index.js"
import "@goscript/unicode/utf8/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/asn1/index.js"
import "@goscript/crypto/elliptic/index.js"
import "./cert_pool.gs.ts"
import "./oid.gs.ts"
import "./pkcs1.gs.ts"
import "./root_unix.gs.ts"
import "./verify.gs.ts"
import "./x509.gs.ts"
import "./x509_string.gs.ts"

export const x509v2Version: number = 1

export function isPrintable(b: number): boolean {
	return ((((((((((($.uint(97, 8) <= $.uint(b, 8)) && ($.uint(b, 8) <= $.uint(122, 8))) || (($.uint(65, 8) <= $.uint(b, 8)) && ($.uint(b, 8) <= $.uint(90, 8)))) || (($.uint(48, 8) <= $.uint(b, 8)) && ($.uint(b, 8) <= $.uint(57, 8)))) || (($.uint(39, 8) <= $.uint(b, 8)) && ($.uint(b, 8) <= $.uint(41, 8)))) || (($.uint(43, 8) <= $.uint(b, 8)) && ($.uint(b, 8) <= $.uint(47, 8)))) || ($.uint(b, 8) == $.uint(32, 8))) || ($.uint(b, 8) == $.uint(58, 8))) || ($.uint(b, 8) == $.uint(61, 8))) || ($.uint(b, 8) == $.uint(63, 8))) || ($.uint(b, 8) == $.uint(42, 8))) || ($.uint(b, 8) == $.uint(38, 8))
}

export function parseASN1String(tag: cryptobyte_asn1.Tag, value: $.Slice<number>): [string, $.GoError] {
	switch (tag) {
		case cryptobyte_asn1.T61String:
		{
			let buf: $.Slice<number> = $.makeSlice<number>(0, $.len(value), "byte")
			for (let __goscriptRangeTarget0 = value, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
				let v = __goscriptRangeTarget0![__rangeIndex]
				// All the 1-byte UTF-8 runes map 1-1 with Latin-1.
				buf = utf8.AppendRune(buf, $.int($.int(v, 32), 32))
			}
			return [$.bytesToString(buf), null]
			break
		}
		case cryptobyte_asn1.PrintableString:
		{
			for (let __goscriptRangeTarget1 = value, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
				let b = __goscriptRangeTarget1![__rangeIndex]
				if (!isPrintable($.uint(b, 8))) {
					return ["", errors.New("invalid PrintableString")]
				}
			}
			return [$.bytesToString(value), null]
			break
		}
		case cryptobyte_asn1.UTF8String:
		{
			if (!utf8.Valid(value)) {
				return ["", errors.New("invalid UTF-8 string")]
			}
			return [$.bytesToString(value), null]
			break
		}
		case $.uint(asn1.TagBMPString, 8):
		{
			if (($.len(value) % 2) != 0) {
				return ["", errors.New("invalid BMPString")]
			}

			// Strip terminator if present.
			{
				let l = $.len(value)
				if (((l >= 2) && ($.uint($.arrayIndex(value!, l - 1), 8) == $.uint(0, 8))) && ($.uint($.arrayIndex(value!, l - 2), 8) == $.uint(0, 8))) {
					value = $.goSlice(value, undefined, l - 2)
				}
			}

			let s: $.Slice<number> = $.makeSlice<number>(0, Math.trunc($.len(value) / 2), "number")
			while ($.len(value) > 0) {
				let point = $.uint(($.uint($.arrayIndex(value!, 0), 16) << 8) + $.uint($.arrayIndex(value!, 1), 16), 16)
				// Reject UTF-16 code points that are permanently reserved
				// noncharacters (0xfffe, 0xffff, and 0xfdd0-0xfdef) and surrogates
				// (0xd800-0xdfff).
				if (((($.uint(point, 16) == $.uint(0xfffe, 16)) || ($.uint(point, 16) == $.uint(0xffff, 16))) || (($.uint(point, 16) >= $.uint(0xfdd0, 16)) && ($.uint(point, 16) <= $.uint(0xfdef, 16)))) || (($.uint(point, 16) >= $.uint(0xd800, 16)) && ($.uint(point, 16) <= $.uint(0xdfff, 16)))) {
					return ["", errors.New("invalid BMPString")]
				}
				s = $.append(s, $.uint(point, 16))
				value = $.goSlice(value, 2, undefined)
			}

			return [$.runesToString(utf16.Decode(s)), null]
			break
		}
		case cryptobyte_asn1.IA5String:
		{
			let s = $.bytesToString(value)
			if (__goscript_x509.isIA5String(s) != null) {
				return ["", errors.New("invalid IA5String")]
			}
			return [s, null]
			break
		}
		case $.uint(asn1.TagNumericString, 8):
		{
			for (let __goscriptRangeTarget2 = value, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
				let b = __goscriptRangeTarget2![__rangeIndex]
				if (!((($.uint(48, 8) <= $.uint(b, 8)) && ($.uint(b, 8) <= $.uint(57, 8))) || ($.uint(b, 8) == $.uint(32, 8)))) {
					return ["", errors.New("invalid NumericString")]
				}
			}
			return [$.bytesToString(value), null]
			break
		}
	}
	return ["", fmt.Errorf("unsupported string type: %v", $.namedValueInterfaceValue<any>(tag, "asn1.Tag", {Constructed: (receiver: any, ...args: any[]) => (cryptobyte_asn1.Tag_Constructed as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), ContextSpecific: (receiver: any, ...args: any[]) => (cryptobyte_asn1.Tag_ContextSpecific as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "asn1.Tag" }, [{ name: "Constructed", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "asn1.Tag" } }] }, { name: "ContextSpecific", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint8", typeName: "asn1.Tag" } }] }]))]
}

export function parseName(__goscriptParam0: cryptobyte.String): [$.VarRef<pkix.RDNSequence> | null, $.GoError] {
	let raw: $.VarRef<cryptobyte.String> = $.varRef(__goscriptParam0)
	if (!cryptobyte.String_ReadASN1(raw, raw, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: invalid RDNSequence")]
	}

	let rdnSeq: $.VarRef<pkix.RDNSequence> = $.varRef(null as pkix.RDNSequence)
	while (!cryptobyte.String_Empty(raw.value)) {
		let rdnSet: pkix.RelativeDistinguishedNameSET = null as pkix.RelativeDistinguishedNameSET
		let _set: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if (!cryptobyte.String_ReadASN1(raw, _set, $.uint(cryptobyte_asn1.SET, 8))) {
			return [null, errors.New("x509: invalid RDNSequence")]
		}
		while (!cryptobyte.String_Empty(_set.value)) {
			let atav: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			if (!cryptobyte.String_ReadASN1(_set, atav, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
				return [null, errors.New("x509: invalid RDNSequence: invalid attribute")]
			}
			let attr: pkix.AttributeTypeAndValue = $.markAsStructValue(new pkix.AttributeTypeAndValue())
			if (!cryptobyte.String_ReadASN1ObjectIdentifier(atav, attr._fields.Type)) {
				return [null, errors.New("x509: invalid RDNSequence: invalid attribute type")]
			}
			let rawValue: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			let valueTag: $.VarRef<cryptobyte_asn1.Tag> = $.varRef(0)
			if (!cryptobyte.String_ReadAnyASN1(atav, rawValue, valueTag)) {
				return [null, errors.New("x509: invalid RDNSequence: invalid attribute value")]
			}
			let err: $.GoError = null as $.GoError
			let __goscriptTuple0: any = parseASN1String($.uint(valueTag.value, 8), rawValue.value)
			attr.Value = __goscriptTuple0[0]
			err = __goscriptTuple0[1]
			if (err != null) {
				return [null, fmt.Errorf("x509: invalid RDNSequence: invalid attribute value: %s", (err as any))]
			}
			rdnSet = ($.append((rdnSet as pkix.RelativeDistinguishedNameSET), attr) as pkix.RelativeDistinguishedNameSET)
		}

		rdnSeq.value = ($.append((rdnSeq.value as pkix.RDNSequence), (rdnSet as pkix.RelativeDistinguishedNameSET), $.appendZeros.nil) as pkix.RDNSequence)
	}

	return [rdnSeq, null]
}

export function parseAI(__goscriptParam1: cryptobyte.String): [pkix.AlgorithmIdentifier, $.GoError] {
	let der: $.VarRef<cryptobyte.String> = $.varRef(__goscriptParam1)
	let ai = $.markAsStructValue(new pkix.AlgorithmIdentifier())
	if (!cryptobyte.String_ReadASN1ObjectIdentifier(der, ai._fields.Algorithm)) {
		return [$.markAsStructValue($.cloneStructValue(ai)), errors.New("x509: malformed OID")]
	}
	if (cryptobyte.String_Empty(der.value)) {
		return [$.markAsStructValue($.cloneStructValue(ai)), null]
	}
	let params: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	let tag: $.VarRef<cryptobyte_asn1.Tag> = $.varRef(0)
	if (!cryptobyte.String_ReadAnyASN1Element(der, params, tag)) {
		return [$.markAsStructValue($.cloneStructValue(ai)), errors.New("x509: malformed parameters")]
	}
	ai.Parameters.Tag = $.int(tag.value)
	ai.Parameters.FullBytes = params.value
	return [$.markAsStructValue($.cloneStructValue(ai)), null]
}

export function parseTime(der: $.VarRef<cryptobyte.String> | null): [time.Time, $.GoError] {
	let t: $.VarRef<time.Time> = $.varRef($.markAsStructValue(new time.Time()))
	switch (true) {
		case cryptobyte.String_PeekASN1Tag($.pointerValue<cryptobyte.String>(der), $.uint(cryptobyte_asn1.UTCTime, 8)):
		{
			if (!cryptobyte.String_ReadASN1UTCTime(der, t)) {
				return [$.markAsStructValue($.cloneStructValue(t.value)), errors.New("x509: malformed UTCTime")]
			}
			break
		}
		case cryptobyte.String_PeekASN1Tag($.pointerValue<cryptobyte.String>(der), $.uint(cryptobyte_asn1.GeneralizedTime, 8)):
		{
			if (!cryptobyte.String_ReadASN1GeneralizedTime(der, t)) {
				return [$.markAsStructValue($.cloneStructValue(t.value)), errors.New("x509: malformed GeneralizedTime")]
			}
			break
		}
		default:
		{
			return [$.markAsStructValue($.cloneStructValue(t.value)), errors.New("x509: unsupported time format")]
			break
		}
	}
	return [$.markAsStructValue($.cloneStructValue(t.value)), null]
}

export function parseValidity(__goscriptParam2: cryptobyte.String): [time.Time, time.Time, $.GoError] {
	let der: $.VarRef<cryptobyte.String> = $.varRef(__goscriptParam2)
	let [notBefore, err] = parseTime(der)
	if (err != null) {
		return [$.markAsStructValue(new time.Time()), $.markAsStructValue(new time.Time()), err]
	}
	let __goscriptTuple1: any = parseTime(der)
	let notAfter = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		return [$.markAsStructValue(new time.Time()), $.markAsStructValue(new time.Time()), err]
	}

	return [$.markAsStructValue($.cloneStructValue(notBefore)), $.markAsStructValue($.cloneStructValue(notAfter)), null]
}

export function parseExtension(__goscriptParam3: cryptobyte.String): [pkix.Extension, $.GoError] {
	let der: $.VarRef<cryptobyte.String> = $.varRef(__goscriptParam3)
	let ext: pkix.Extension = $.markAsStructValue(new pkix.Extension())
	if (!cryptobyte.String_ReadASN1ObjectIdentifier(der, ext._fields.Id)) {
		return [$.markAsStructValue($.cloneStructValue(ext)), errors.New("x509: malformed extension OID field")]
	}
	if (cryptobyte.String_PeekASN1Tag(der.value, $.uint(cryptobyte_asn1.BOOLEAN, 8))) {
		if (!cryptobyte.String_ReadASN1Boolean(der, ext._fields.Critical)) {
			return [$.markAsStructValue($.cloneStructValue(ext)), errors.New("x509: malformed extension critical field")]
		}
	}
	let val: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadASN1(der, val, $.uint(cryptobyte_asn1.OCTET_STRING, 8))) {
		return [$.markAsStructValue($.cloneStructValue(ext)), errors.New("x509: malformed extension value field")]
	}
	ext.Value = val.value
	return [$.markAsStructValue($.cloneStructValue(ext)), null]
}

export async function parsePublicKey(keyData: __goscript_x509.publicKeyInfo | $.VarRef<__goscript_x509.publicKeyInfo> | null): globalThis.Promise<[any, $.GoError]> {
	let oid: asn1.ObjectIdentifier = ($.pointerValue<__goscript_x509.publicKeyInfo>(keyData).Algorithm.Algorithm as asn1.ObjectIdentifier)
	let params = $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_x509.publicKeyInfo>(keyData).Algorithm.Parameters))
	let data: $.Slice<number> = $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_x509.publicKeyInfo>(keyData).PublicKey)).RightAlign()
	switch (true) {
		case asn1.ObjectIdentifier_Equal(oid, (__goscript_x509.oidPublicKeyRSA as asn1.ObjectIdentifier)):
		{
			if (!bytes.Equal(params.FullBytes, asn1.__goscript_get_NullBytes())) {
				return [null, errors.New("x509: RSA key missing NULL parameters")]
			}

			let der: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))
			let p: __goscript_pkcs1.pkcs1PublicKey | $.VarRef<__goscript_pkcs1.pkcs1PublicKey> | null = new __goscript_pkcs1.pkcs1PublicKey({N: new big.Int()})
			if (!cryptobyte.String_ReadASN1(der, der, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
				return [null, errors.New("x509: invalid RSA public key")]
			}
			if (!cryptobyte.String_ReadASN1Integer(der, $.interfaceValue<any>($.pointerValue<__goscript_pkcs1.pkcs1PublicKey>(p).N, "*big.Int", { kind: $.TypeKind.Pointer, elemType: "big.Int" }))) {
				return [null, errors.New("x509: invalid RSA modulus")]
			}
			if (!cryptobyte.String_ReadASN1Integer(der, $.interfaceValue<any>($.pointerValue<__goscript_pkcs1.pkcs1PublicKey>(p)._fields.E, "*int", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } }))) {
				return [null, errors.New("x509: invalid RSA public exponent")]
			}

			if (big.Int.prototype.Sign.call($.pointerValue<__goscript_pkcs1.pkcs1PublicKey>(p).N) <= 0) {
				return [null, errors.New("x509: RSA modulus is not a positive number")]
			}
			if ($.pointerValue<__goscript_pkcs1.pkcs1PublicKey>(p).E <= 0) {
				return [null, errors.New("x509: RSA public exponent is not a positive number")]
			}

			let pub: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = new rsa.PublicKey({E: $.pointerValue<__goscript_pkcs1.pkcs1PublicKey>(p).E, N: $.pointerValue<__goscript_pkcs1.pkcs1PublicKey>(p).N})
			return [$.interfaceValue<any>(pub, "*rsa.PublicKey", { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }), null]
			break
		}
		case asn1.ObjectIdentifier_Equal(oid, (__goscript_x509.oidPublicKeyECDSA as asn1.ObjectIdentifier)):
		{
			let paramsDer: $.VarRef<cryptobyte.String> = $.varRef(((params.FullBytes as cryptobyte.String) as cryptobyte.String))
			let namedCurveOID: $.VarRef<asn1.ObjectIdentifier> | null = $.varRef<asn1.ObjectIdentifier>(null as asn1.ObjectIdentifier)
			if (!cryptobyte.String_ReadASN1ObjectIdentifier(paramsDer, namedCurveOID)) {
				return [null, errors.New("x509: invalid ECDSA parameters")]
			}
			let namedCurve = await __goscript_x509.namedCurveFromOID(($.pointerValue<asn1.ObjectIdentifier>(namedCurveOID) as asn1.ObjectIdentifier))
			if (namedCurve == null) {
				return [null, errors.New("x509: unsupported elliptic curve")]
			}
			const __goscriptReturn0 = await ecdsa.ParseUncompressedPublicKey(namedCurve, data)
			return [$.interfaceValue<any>(__goscriptReturn0[0], "*ecdsa.PublicKey", { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }), __goscriptReturn0[1]]
			break
		}
		case asn1.ObjectIdentifier_Equal(oid, (__goscript_x509.oidPublicKeyEd25519 as asn1.ObjectIdentifier)):
		{
			if ($.len(params.FullBytes) != 0) {
				return [null, errors.New("x509: Ed25519 key encoded with illegal parameters")]
			}
			if ($.len(data) != ed25519.PublicKeySize) {
				return [null, errors.New("x509: wrong Ed25519 public key size")]
			}
			return [$.namedValueInterfaceValue<any>((data as ed25519.PublicKey), "ed25519.PublicKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PublicKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Equal", args: [{ name: "x", type: "crypto.PublicKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]), null]
			break
		}
		case asn1.ObjectIdentifier_Equal(oid, (__goscript_x509.oidPublicKeyX25519 as asn1.ObjectIdentifier)):
		{
			if ($.len(params.FullBytes) != 0) {
				return [null, errors.New("x509: X25519 key encoded with illegal parameters")]
			}
			const __goscriptReturn1 = await $.pointerValue<Exclude<ecdh.Curve, null>>(ecdh.X25519()).NewPublicKey(data)
			return [$.interfaceValue<any>(__goscriptReturn1[0], "*ecdh.PublicKey", { kind: $.TypeKind.Pointer, elemType: "ecdh.PublicKey" }), __goscriptReturn1[1]]
			break
		}
		case asn1.ObjectIdentifier_Equal(oid, (__goscript_x509.oidPublicKeyDSA as asn1.ObjectIdentifier)):
		{
			let der: $.VarRef<cryptobyte.String> = $.varRef(((data as cryptobyte.String) as cryptobyte.String))
			let y: big.Int | $.VarRef<big.Int> | null = new big.Int()
			if (!cryptobyte.String_ReadASN1Integer(der, $.interfaceValue<any>(y, "*big.Int", { kind: $.TypeKind.Pointer, elemType: "big.Int" }))) {
				return [null, errors.New("x509: invalid DSA public key")]
			}
			let pub: dsa.PublicKey | $.VarRef<dsa.PublicKey> | null = new dsa.PublicKey({Y: y, Parameters: $.markAsStructValue(new dsa.Parameters({P: new big.Int(), Q: new big.Int(), G: new big.Int()}))})
			let paramsDer: $.VarRef<cryptobyte.String> = $.varRef(((params.FullBytes as cryptobyte.String) as cryptobyte.String))
			if (((!cryptobyte.String_ReadASN1(paramsDer, paramsDer, $.uint(cryptobyte_asn1.SEQUENCE, 8)) || !cryptobyte.String_ReadASN1Integer(paramsDer, $.interfaceValue<any>($.pointerValue<dsa.PublicKey>(pub).Parameters.P, "*big.Int", { kind: $.TypeKind.Pointer, elemType: "big.Int" }))) || !cryptobyte.String_ReadASN1Integer(paramsDer, $.interfaceValue<any>($.pointerValue<dsa.PublicKey>(pub).Parameters.Q, "*big.Int", { kind: $.TypeKind.Pointer, elemType: "big.Int" }))) || !cryptobyte.String_ReadASN1Integer(paramsDer, $.interfaceValue<any>($.pointerValue<dsa.PublicKey>(pub).Parameters.G, "*big.Int", { kind: $.TypeKind.Pointer, elemType: "big.Int" }))) {
				return [null, errors.New("x509: invalid DSA parameters")]
			}
			if ((((big.Int.prototype.Sign.call($.pointerValue<dsa.PublicKey>(pub).Y) <= 0) || (big.Int.prototype.Sign.call($.pointerValue<dsa.PublicKey>(pub).Parameters.P) <= 0)) || (big.Int.prototype.Sign.call($.pointerValue<dsa.PublicKey>(pub).Parameters.Q) <= 0)) || (big.Int.prototype.Sign.call($.pointerValue<dsa.PublicKey>(pub).Parameters.G) <= 0)) {
				return [null, errors.New("x509: zero or negative DSA parameter")]
			}
			return [$.interfaceValue<any>(pub, "*dsa.PublicKey", { kind: $.TypeKind.Pointer, elemType: "dsa.PublicKey" }), null]
			break
		}
		default:
		{
			return [null, errors.New("x509: unknown public key algorithm")]
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function parseKeyUsageExtension(__goscriptParam4: cryptobyte.String): [__goscript_x509.KeyUsage, $.GoError] {
	let der: $.VarRef<cryptobyte.String> = $.varRef(__goscriptParam4)
	let usageBits: $.VarRef<asn1.BitString> = $.varRef($.markAsStructValue(new asn1.BitString()))
	if (!cryptobyte.String_ReadASN1BitString(der, usageBits)) {
		return [0, errors.New("x509: invalid key usage")]
	}

	let usage: number = 0
	for (let i = 0; i < 9; i++) {
		if ($.markAsStructValue($.cloneStructValue(usageBits.value)).At(i) != 0) {
			usage = usage | (1 << $.uint(i, 64))
		}
	}
	return [$.int(usage), null]
}

export function parseBasicConstraintsExtension(__goscriptParam5: cryptobyte.String): [boolean, number, $.GoError] {
	let der: $.VarRef<cryptobyte.String> = $.varRef(__goscriptParam5)
	let isCA: $.VarRef<boolean> = $.varRef(false)
	if (!cryptobyte.String_ReadASN1(der, der, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [false, 0, errors.New("x509: invalid basic constraints")]
	}
	if (cryptobyte.String_PeekASN1Tag(der.value, $.uint(cryptobyte_asn1.BOOLEAN, 8))) {
		if (!cryptobyte.String_ReadASN1Boolean(der, isCA)) {
			return [false, 0, errors.New("x509: invalid basic constraints")]
		}
	}

	let maxPathLen = -1
	if (cryptobyte.String_PeekASN1Tag(der.value, $.uint(cryptobyte_asn1.INTEGER, 8))) {
		let mpl: $.VarRef<number> = $.varRef(0)
		if (!cryptobyte.String_ReadASN1Integer(der, $.interfaceValue<any>(mpl, "*uint", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "uint" } })) || (mpl.value > $.uint("9223372036854775807", 64))) {
			return [false, 0, errors.New("x509: invalid basic constraints")]
		}
		maxPathLen = $.int(mpl.value)
	}

	return [isCA.value, maxPathLen, null]
}

export async function forEachSAN(__goscriptParam6: cryptobyte.String, callback: ((tag: number, data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
	let der: $.VarRef<cryptobyte.String> = $.varRef(__goscriptParam6)
	if (!cryptobyte.String_ReadASN1(der, der, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return errors.New("x509: invalid subject alternative names")
	}
	while (!cryptobyte.String_Empty(der.value)) {
		let san: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		let tag: $.VarRef<cryptobyte_asn1.Tag> = $.varRef(0)
		if (!cryptobyte.String_ReadAnyASN1(der, san, tag)) {
			return errors.New("x509: invalid subject alternative name")
		}
		{
			let err = await callback!($.int(tag.value ^ 0x80), san.value)
			if (err != null) {
				return err
			}
		}
	}

	return null
}

export async function parseSANExtension(der: cryptobyte.String): globalThis.Promise<[$.Slice<string>, $.Slice<string>, $.Slice<net.IP>, $.Slice<url.URL | $.VarRef<url.URL> | null>, $.GoError]> {
	let dnsNames: $.Slice<string> = null as $.Slice<string>
	let emailAddresses: $.Slice<string> = null as $.Slice<string>
	let ipAddresses: $.Slice<net.IP> = null as $.Slice<net.IP>
	let uris: $.Slice<url.URL | $.VarRef<url.URL> | null> = null as $.Slice<url.URL | $.VarRef<url.URL> | null>
	let err: $.GoError = null as $.GoError
	err = await forEachSAN((der as cryptobyte.String), $.functionValue((tag: number, data: $.Slice<number>): $.GoError => {
		switch (tag) {
			case 1:
			{
				let email = $.bytesToString(data)
				{
					let __goscriptShadow0 = __goscript_x509.isIA5String(email)
					if (__goscriptShadow0 != null) {
						return errors.New("x509: SAN rfc822Name is malformed")
					}
				}
				emailAddresses = $.append(emailAddresses, email)
				break
			}
			case 2:
			{
				let name = $.bytesToString(data)
				{
					let __goscriptShadow1 = __goscript_x509.isIA5String(name)
					if (__goscriptShadow1 != null) {
						return errors.New("x509: SAN dNSName is malformed")
					}
				}
				dnsNames = $.append(dnsNames, name)
				break
			}
			case 6:
			{
				let uriStr = $.bytesToString(data)
				{
					let __goscriptShadow2 = __goscript_x509.isIA5String(uriStr)
					if (__goscriptShadow2 != null) {
						return errors.New("x509: SAN uniformResourceIdentifier is malformed")
					}
				}
				let __goscriptTuple2: any = url.Parse(uriStr)
				let uri: url.URL | $.VarRef<url.URL> | null = __goscriptTuple2[0]
				let __goscriptShadow3 = __goscriptTuple2[1]
				if (__goscriptShadow3 != null) {
					return fmt.Errorf("x509: cannot parse URI %q: %s", uriStr, (__goscriptShadow3 as any))
				}
				if (($.len($.pointerValue<url.URL>(uri).Host) > 0) && !domainNameValid($.pointerValue<url.URL>(uri).Host, false)) {
					return fmt.Errorf("x509: cannot parse URI %q: invalid domain", uriStr)
				}
				uris = $.append(uris, uri, $.appendZeros.nil)
				break
			}
			case 7:
			{
				switch ($.len(data)) {
					case net.IPv4len:
					case net.IPv6len:
					{
						ipAddresses = $.append(ipAddresses, (data as net.IP), $.appendZeros.nil)
						break
					}
					default:
					{
						return errors.New("x509: cannot parse IP address of length " + strconv.Itoa($.len(data)))
						break
					}
				}
				break
			}
		}

		return null
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["error"] } as $.FunctionTypeInfo)))

	return [dnsNames, emailAddresses, ipAddresses, uris, err]
}

export function parseAuthorityKeyIdentifier(e: pkix.Extension): [$.Slice<number>, $.GoError] {
	// RFC 5280, Section 4.2.1.1
	if (e.Critical) {
		// Conforming CAs MUST mark this extension as non-critical
		return [null, errors.New("x509: authority key identifier incorrectly marked critical")]
	}
	let val: $.VarRef<cryptobyte.String> = $.varRef(((e.Value as cryptobyte.String) as cryptobyte.String))
	let akid: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadASN1(val, akid, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: invalid authority key identifier")]
	}
	if (cryptobyte.String_PeekASN1Tag(akid.value, $.uint(cryptobyte_asn1.Tag_ContextSpecific(0), 8))) {
		if (!cryptobyte.String_ReadASN1(akid, akid, $.uint(cryptobyte_asn1.Tag_ContextSpecific(0), 8))) {
			return [null, errors.New("x509: invalid authority key identifier")]
		}
		return [akid.value, null]
	}
	return [null, null]
}

export function parseExtKeyUsageExtension(__goscriptParam7: cryptobyte.String): [$.Slice<__goscript_x509.ExtKeyUsage>, $.Slice<asn1.ObjectIdentifier>, $.GoError] {
	let der: $.VarRef<cryptobyte.String> = $.varRef(__goscriptParam7)
	let extKeyUsages: $.Slice<__goscript_x509.ExtKeyUsage> = null as $.Slice<__goscript_x509.ExtKeyUsage>
	let unknownUsages: $.Slice<asn1.ObjectIdentifier> = null as $.Slice<asn1.ObjectIdentifier>
	if (!cryptobyte.String_ReadASN1(der, der, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, null, errors.New("x509: invalid extended key usages")]
	}
	while (!cryptobyte.String_Empty(der.value)) {
		let eku: $.VarRef<asn1.ObjectIdentifier> = $.varRef(null as asn1.ObjectIdentifier)
		if (!cryptobyte.String_ReadASN1ObjectIdentifier(der, eku)) {
			return [null, null, errors.New("x509: invalid extended key usages")]
		}
		{
			let [extKeyUsage, ok] = __goscript_x509.extKeyUsageFromOID((eku.value as asn1.ObjectIdentifier))
			if (ok) {
				extKeyUsages = $.append(extKeyUsages, extKeyUsage)
			} else {
				unknownUsages = $.append(unknownUsages, (eku.value as asn1.ObjectIdentifier), $.appendZeros.nil)
			}
		}
	}
	return [extKeyUsages, unknownUsages, null]
}

export function parseCertificatePoliciesExtension(__goscriptParam8: cryptobyte.String): [$.Slice<__goscript_oid.OID>, $.GoError] {
	let der: $.VarRef<cryptobyte.String> = $.varRef(__goscriptParam8)
	let oids: $.Slice<__goscript_oid.OID> = null as $.Slice<__goscript_oid.OID>
	let seenOIDs: globalThis.Map<string, boolean> | null = new globalThis.Map<string, boolean>([])
	if (!cryptobyte.String_ReadASN1(der, der, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: invalid certificate policies")]
	}
	while (!cryptobyte.String_Empty(der.value)) {
		let cp: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		let OIDBytes: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if (!cryptobyte.String_ReadASN1(der, cp, $.uint(cryptobyte_asn1.SEQUENCE, 8)) || !cryptobyte.String_ReadASN1(cp, OIDBytes, $.uint(cryptobyte_asn1.OBJECT_IDENTIFIER, 8))) {
			return [null, errors.New("x509: invalid certificate policies")]
		}
		if ($.mapGet<string, boolean, boolean>(seenOIDs, $.bytesToString(OIDBytes.value), false)[0]) {
			return [null, errors.New("x509: invalid certificate policies")]
		}
		$.mapSet(seenOIDs, $.bytesToString(OIDBytes.value), true)
		let [oid, ok] = __goscript_oid.newOIDFromDER(OIDBytes.value)
		if (!ok) {
			return [null, errors.New("x509: invalid certificate policies")]
		}
		oids = $.append(oids, oid)
	}
	return [oids, null]
}

export function isValidIPMask(mask: $.Slice<number>): boolean {
	let seenZero = false

	for (let __goscriptRangeTarget3 = mask, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
		let b = __goscriptRangeTarget3![__rangeIndex]
		if (seenZero) {
			if ($.uint(b, 8) != $.uint(0, 8)) {
				return false
			}

			continue
		}

		switch (b) {
			case 0x00:
			case 0x80:
			case 0xc0:
			case 0xe0:
			case 0xf0:
			case 0xf8:
			case 0xfc:
			case 0xfe:
			{
				seenZero = true
				break
			}
			case 0xff:
			{
				break
			}
			default:
			{
				return false
				break
			}
		}
	}

	return true
}

export async function parseNameConstraintsExtension(out: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, e: pkix.Extension): globalThis.Promise<[boolean, $.GoError]> {
	let unhandled: boolean = false
	let err: $.GoError = null as $.GoError
	// RFC 5280, 4.2.1.10

	// NameConstraints ::= SEQUENCE {
	//      permittedSubtrees       [0]     GeneralSubtrees OPTIONAL,
	//      excludedSubtrees        [1]     GeneralSubtrees OPTIONAL }
	//
	// GeneralSubtrees ::= SEQUENCE SIZE (1..MAX) OF GeneralSubtree
	//
	// GeneralSubtree ::= SEQUENCE {
	//      base                    GeneralName,
	//      minimum         [0]     BaseDistance DEFAULT 0,
	//      maximum         [1]     BaseDistance OPTIONAL }
	//
	// BaseDistance ::= INTEGER (0..MAX)

	let outer: $.VarRef<cryptobyte.String> = $.varRef(((e.Value as cryptobyte.String) as cryptobyte.String))
	let toplevel: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	let permitted: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	let excluded: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	let havePermitted: $.VarRef<boolean> = $.varRef(false)
	let haveExcluded: $.VarRef<boolean> = $.varRef(false)
	if ((((!cryptobyte.String_ReadASN1(outer, toplevel, $.uint(cryptobyte_asn1.SEQUENCE, 8)) || !cryptobyte.String_Empty(outer.value)) || !cryptobyte.String_ReadOptionalASN1(toplevel, permitted, havePermitted, $.uint(cryptobyte_asn1.Tag_Constructed(cryptobyte_asn1.Tag_ContextSpecific(0)), 8))) || !cryptobyte.String_ReadOptionalASN1(toplevel, excluded, haveExcluded, $.uint(cryptobyte_asn1.Tag_Constructed(cryptobyte_asn1.Tag_ContextSpecific(1)), 8))) || !cryptobyte.String_Empty(toplevel.value)) {
		return [false, errors.New("x509: invalid NameConstraints extension")]
	}

	if ((!havePermitted.value && !haveExcluded.value) || (($.len((permitted.value as cryptobyte.String)) == 0) && ($.len((excluded.value as cryptobyte.String)) == 0))) {
		// From RFC 5280, Section 4.2.1.10:
		//   “either the permittedSubtrees field
		//   or the excludedSubtrees MUST be
		//   present”
		return [false, errors.New("x509: empty name constraints extension")]
	}

	let getValues: ((subtrees: cryptobyte.String) => [$.Slice<string>, $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>, $.Slice<string>, $.Slice<string>, $.GoError] | globalThis.Promise<[$.Slice<string>, $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>, $.Slice<string>, $.Slice<string>, $.GoError]>) | null = $.functionValue((__goscriptParam9: cryptobyte.String): [$.Slice<string>, $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>, $.Slice<string>, $.Slice<string>, $.GoError] => {
		let subtrees: $.VarRef<cryptobyte.String> = $.varRef(__goscriptParam9)
		let dnsNames: $.Slice<string> = null as $.Slice<string>
		let ips: $.Slice<net.IPNet | $.VarRef<net.IPNet> | null> = null as $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>
		let emails: $.Slice<string> = null as $.Slice<string>
		let uriDomains: $.Slice<string> = null as $.Slice<string>
		let err: $.GoError = null as $.GoError
		while (!cryptobyte.String_Empty(subtrees.value)) {
			let seq: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			let value: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			let tag: $.VarRef<cryptobyte_asn1.Tag> = $.varRef(0)
			if (!cryptobyte.String_ReadASN1(subtrees, seq, $.uint(cryptobyte_asn1.SEQUENCE, 8)) || !cryptobyte.String_ReadAnyASN1(seq, value, tag)) {
				return [null, null, null, null, fmt.Errorf("x509: invalid NameConstraints extension")]
			}

			let dnsTag: cryptobyte_asn1.Tag = $.uint(cryptobyte_asn1.Tag_ContextSpecific(2), 8)
			let emailTag: cryptobyte_asn1.Tag = $.uint(cryptobyte_asn1.Tag_ContextSpecific(1), 8)
			let ipTag: cryptobyte_asn1.Tag = $.uint(cryptobyte_asn1.Tag_ContextSpecific(7), 8)
			let uriTag: cryptobyte_asn1.Tag = $.uint(cryptobyte_asn1.Tag_ContextSpecific(6), 8)

			switch (tag.value) {
				case dnsTag:
				{
					let domain = $.bytesToString(value.value)
					{
						let __goscriptShadow4 = __goscript_x509.isIA5String(domain)
						if (__goscriptShadow4 != null) {
							return [null, null, null, null, errors.New("x509: invalid constraint value: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow4).Error())]
						}
					}

					if (!domainNameValid(domain, true)) {
						return [null, null, null, null, fmt.Errorf("x509: failed to parse dnsName constraint %q", domain)]
					}
					dnsNames = $.append(dnsNames, domain)
					break
				}
				case ipTag:
				{
					let l = $.len((value.value as cryptobyte.String))
					let ip: $.Slice<number> = null as $.Slice<number>
					let mask: $.Slice<number> = null as $.Slice<number>

					switch (l) {
						case 8:
						{
							ip = $.goSlice(value.value, undefined, 4)
							mask = $.goSlice(value.value, 4, undefined)
							break
						}
						case 32:
						{
							ip = $.goSlice(value.value, undefined, 16)
							mask = $.goSlice(value.value, 16, undefined)
							break
						}
						default:
						{
							return [null, null, null, null, fmt.Errorf("x509: IP constraint contained value of length %d", $.namedValueInterfaceValue<any>(l, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))]
							break
						}
					}

					if (!isValidIPMask(mask)) {
						return [null, null, null, null, fmt.Errorf("x509: IP constraint contained invalid mask %x", $.interfaceValue<any>(mask, "[]byte", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }))]
					}

					ips = $.append(ips, new net.IPNet({IP: ((ip as net.IP) as net.IP), Mask: ((mask as net.IPMask) as net.IPMask)}), $.appendZeros.nil)
					break
				}
				case emailTag:
				{
					let constraint = $.bytesToString(value.value)
					{
						let __goscriptShadow5 = __goscript_x509.isIA5String(constraint)
						if (__goscriptShadow5 != null) {
							return [null, null, null, null, errors.New("x509: invalid constraint value: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow5).Error())]
						}
					}

					// If the constraint contains an @ then
					// it specifies an exact mailbox name.
					if (strings.Contains(constraint, "@")) {
						{
							let [, ok] = __goscript_verify.parseRFC2821Mailbox(constraint)
							if (!ok) {
								return [null, null, null, null, fmt.Errorf("x509: failed to parse rfc822Name constraint %q", constraint)]
							}
						}
					} else {
						if (!domainNameValid(constraint, true)) {
							return [null, null, null, null, fmt.Errorf("x509: failed to parse rfc822Name constraint %q", constraint)]
						}
					}
					emails = $.append(emails, constraint)
					break
				}
				case uriTag:
				{
					let domain = $.bytesToString(value.value)
					{
						let __goscriptShadow6 = __goscript_x509.isIA5String(domain)
						if (__goscriptShadow6 != null) {
							return [null, null, null, null, errors.New("x509: invalid constraint value: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow6).Error())]
						}
					}

					if (net.ParseIP(domain) != null) {
						return [null, null, null, null, fmt.Errorf("x509: failed to parse URI constraint %q: cannot be IP address", domain)]
					}

					if (!domainNameValid(domain, true)) {
						return [null, null, null, null, fmt.Errorf("x509: failed to parse URI constraint %q", domain)]
					}
					uriDomains = $.append(uriDomains, domain)
					break
				}
				default:
				{
					unhandled = true
					break
				}
			}
		}

		return [dnsNames, ips, emails, uriDomains, null]
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, typeName: "cryptobyte.String", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.IPNet" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, "error"] } as $.FunctionTypeInfo))

	{
		let __goscriptTuple3: any = await getValues!((permitted.value as cryptobyte.String))
		$.pointerValue<__goscript_x509.Certificate>(out).PermittedDNSDomains = __goscriptTuple3[0]
		$.pointerValue<__goscript_x509.Certificate>(out).PermittedIPRanges = __goscriptTuple3[1]
		$.pointerValue<__goscript_x509.Certificate>(out).PermittedEmailAddresses = __goscriptTuple3[2]
		$.pointerValue<__goscript_x509.Certificate>(out).PermittedURIDomains = __goscriptTuple3[3]
		err = __goscriptTuple3[4]
		if (err != null) {
			return [false, err]
		}
	}
	{
		let __goscriptTuple4: any = await getValues!((excluded.value as cryptobyte.String))
		$.pointerValue<__goscript_x509.Certificate>(out).ExcludedDNSDomains = __goscriptTuple4[0]
		$.pointerValue<__goscript_x509.Certificate>(out).ExcludedIPRanges = __goscriptTuple4[1]
		$.pointerValue<__goscript_x509.Certificate>(out).ExcludedEmailAddresses = __goscriptTuple4[2]
		$.pointerValue<__goscript_x509.Certificate>(out).ExcludedURIDomains = __goscriptTuple4[3]
		err = __goscriptTuple4[4]
		if (err != null) {
			return [false, err]
		}
	}
	$.pointerValue<__goscript_x509.Certificate>(out).PermittedDNSDomainsCritical = e.Critical

	return [unhandled, null]
}

export async function processExtensions(out: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null): globalThis.Promise<$.GoError> {
	let err: $.GoError = null as $.GoError
	for (let __goscriptRangeTarget5 = $.pointerValue<__goscript_x509.Certificate>(out).Extensions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
		let e = __goscriptRangeTarget5![__rangeIndex]
		let unhandled = false

		if (((($.len((e.Id as asn1.ObjectIdentifier)) == 4) && ($.arrayIndex(e.Id!, 0) == 2)) && ($.arrayIndex(e.Id!, 1) == 5)) && ($.arrayIndex(e.Id!, 2) == 29)) {
			switch ($.arrayIndex(e.Id!, 3)) {
				case 15:
				{
					let __goscriptTuple5: any = parseKeyUsageExtension((e.Value as cryptobyte.String))
					$.pointerValue<__goscript_x509.Certificate>(out).KeyUsage = __goscriptTuple5[0]
					err = __goscriptTuple5[1]
					if (err != null) {
						return err
					}
					break
				}
				case 19:
				{
					let __goscriptTuple6: any = parseBasicConstraintsExtension((e.Value as cryptobyte.String))
					$.pointerValue<__goscript_x509.Certificate>(out).IsCA = __goscriptTuple6[0]
					$.pointerValue<__goscript_x509.Certificate>(out).MaxPathLen = __goscriptTuple6[1]
					err = __goscriptTuple6[2]
					if (err != null) {
						return err
					}
					$.pointerValue<__goscript_x509.Certificate>(out).BasicConstraintsValid = true
					$.pointerValue<__goscript_x509.Certificate>(out).MaxPathLenZero = $.pointerValue<__goscript_x509.Certificate>(out).MaxPathLen == 0
					break
				}
				case 17:
				{
					let __goscriptTuple7: any = await parseSANExtension((e.Value as cryptobyte.String))
					$.pointerValue<__goscript_x509.Certificate>(out).DNSNames = __goscriptTuple7[0]
					$.pointerValue<__goscript_x509.Certificate>(out).EmailAddresses = __goscriptTuple7[1]
					$.pointerValue<__goscript_x509.Certificate>(out).IPAddresses = __goscriptTuple7[2]
					$.pointerValue<__goscript_x509.Certificate>(out).URIs = __goscriptTuple7[3]
					err = __goscriptTuple7[4]
					if (err != null) {
						return err
					}

					if (((($.len($.pointerValue<__goscript_x509.Certificate>(out).DNSNames) == 0) && ($.len($.pointerValue<__goscript_x509.Certificate>(out).EmailAddresses) == 0)) && ($.len($.pointerValue<__goscript_x509.Certificate>(out).IPAddresses) == 0)) && ($.len($.pointerValue<__goscript_x509.Certificate>(out).URIs) == 0)) {
						// If we didn't parse anything then we do the critical check, below.
						unhandled = true
					}
					break
				}
				case 30:
				{
					let __goscriptTuple8: any = await parseNameConstraintsExtension(out, $.markAsStructValue($.cloneStructValue(e)))
					unhandled = __goscriptTuple8[0]
					err = __goscriptTuple8[1]
					if (err != null) {
						return err
					}
					break
				}
				case 31:
				{
					let val: $.VarRef<cryptobyte.String> = $.varRef(((e.Value as cryptobyte.String) as cryptobyte.String))
					if (!cryptobyte.String_ReadASN1(val, val, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
						return errors.New("x509: invalid CRL distribution points")
					}
					while (!cryptobyte.String_Empty(val.value)) {
						let dpDER: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
						if (!cryptobyte.String_ReadASN1(val, dpDER, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
							return errors.New("x509: invalid CRL distribution point")
						}
						let dpNameDER: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
						let dpNamePresent: $.VarRef<boolean> = $.varRef(false)
						if (!cryptobyte.String_ReadOptionalASN1(dpDER, dpNameDER, dpNamePresent, $.uint(cryptobyte_asn1.Tag_ContextSpecific(cryptobyte_asn1.Tag_Constructed(0)), 8))) {
							return errors.New("x509: invalid CRL distribution point")
						}
						if (!dpNamePresent.value) {
							continue
						}
						if (!cryptobyte.String_ReadASN1(dpNameDER, dpNameDER, $.uint(cryptobyte_asn1.Tag_ContextSpecific(cryptobyte_asn1.Tag_Constructed(0)), 8))) {
							return errors.New("x509: invalid CRL distribution point")
						}
						while (!cryptobyte.String_Empty(dpNameDER.value)) {
							if (!cryptobyte.String_PeekASN1Tag(dpNameDER.value, $.uint(cryptobyte_asn1.Tag_ContextSpecific(6), 8))) {
								break
							}
							let uri: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
							if (!cryptobyte.String_ReadASN1(dpNameDER, uri, $.uint(cryptobyte_asn1.Tag_ContextSpecific(6), 8))) {
								return errors.New("x509: invalid CRL distribution point")
							}
							$.pointerValue<__goscript_x509.Certificate>(out).CRLDistributionPoints = $.append($.pointerValue<__goscript_x509.Certificate>(out).CRLDistributionPoints, $.bytesToString(uri.value))
						}
					}
					break
				}
				case 35:
				{
					let __goscriptTuple9: any = parseAuthorityKeyIdentifier($.markAsStructValue($.cloneStructValue(e)))
					$.pointerValue<__goscript_x509.Certificate>(out).AuthorityKeyId = __goscriptTuple9[0]
					err = __goscriptTuple9[1]
					if (err != null) {
						return err
					}
					break
				}
				case 36:
				{
					let val: $.VarRef<cryptobyte.String> = $.varRef(((e.Value as cryptobyte.String) as cryptobyte.String))
					if (!cryptobyte.String_ReadASN1(val, val, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
						return errors.New("x509: invalid policy constraints extension")
					}
					if (cryptobyte.String_PeekASN1Tag(val.value, $.uint(cryptobyte_asn1.Tag_ContextSpecific(0), 8))) {
						let v: $.VarRef<bigint> = $.varRef(0n)
						if (!cryptobyte.String_ReadASN1Int64WithTag(val, v, $.uint(cryptobyte_asn1.Tag_ContextSpecific(0), 8))) {
							return errors.New("x509: invalid policy constraints extension")
						}
						$.pointerValue<__goscript_x509.Certificate>(out).RequireExplicitPolicy = $.int(v.value)
						// Check for overflow.
						if ($.int64($.pointerValue<__goscript_x509.Certificate>(out).RequireExplicitPolicy) != v.value) {
							return errors.New("x509: policy constraints requireExplicitPolicy field overflows int")
						}
						$.pointerValue<__goscript_x509.Certificate>(out).RequireExplicitPolicyZero = $.pointerValue<__goscript_x509.Certificate>(out).RequireExplicitPolicy == 0
					}
					if (cryptobyte.String_PeekASN1Tag(val.value, $.uint(cryptobyte_asn1.Tag_ContextSpecific(1), 8))) {
						let v: $.VarRef<bigint> = $.varRef(0n)
						if (!cryptobyte.String_ReadASN1Int64WithTag(val, v, $.uint(cryptobyte_asn1.Tag_ContextSpecific(1), 8))) {
							return errors.New("x509: invalid policy constraints extension")
						}
						$.pointerValue<__goscript_x509.Certificate>(out).InhibitPolicyMapping = $.int(v.value)
						// Check for overflow.
						if ($.int64($.pointerValue<__goscript_x509.Certificate>(out).InhibitPolicyMapping) != v.value) {
							return errors.New("x509: policy constraints inhibitPolicyMapping field overflows int")
						}
						$.pointerValue<__goscript_x509.Certificate>(out).InhibitPolicyMappingZero = $.pointerValue<__goscript_x509.Certificate>(out).InhibitPolicyMapping == 0
					}
					break
				}
				case 37:
				{
					let __goscriptTuple10: any = parseExtKeyUsageExtension((e.Value as cryptobyte.String))
					$.pointerValue<__goscript_x509.Certificate>(out).ExtKeyUsage = __goscriptTuple10[0]
					$.pointerValue<__goscript_x509.Certificate>(out).UnknownExtKeyUsage = __goscriptTuple10[1]
					err = __goscriptTuple10[2]
					if (err != null) {
						return err
					}
					break
				}
				case 14:
				{
					if (e.Critical) {
						// Conforming CAs MUST mark this extension as non-critical
						return errors.New("x509: subject key identifier incorrectly marked critical")
					}
					let val: $.VarRef<cryptobyte.String> = $.varRef(((e.Value as cryptobyte.String) as cryptobyte.String))
					let skid: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadASN1(val, skid, $.uint(cryptobyte_asn1.OCTET_STRING, 8))) {
						return errors.New("x509: invalid subject key identifier")
					}
					$.pointerValue<__goscript_x509.Certificate>(out).SubjectKeyId = skid.value
					break
				}
				case 32:
				{
					let __goscriptTuple11: any = parseCertificatePoliciesExtension((e.Value as cryptobyte.String))
					$.pointerValue<__goscript_x509.Certificate>(out).Policies = __goscriptTuple11[0]
					err = __goscriptTuple11[1]
					if (err != null) {
						return err
					}
					$.pointerValue<__goscript_x509.Certificate>(out).PolicyIdentifiers = $.makeSlice<asn1.ObjectIdentifier>(0, $.len($.pointerValue<__goscript_x509.Certificate>(out).Policies))
					for (let __goscriptRangeTarget4 = $.pointerValue<__goscript_x509.Certificate>(out).Policies, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
						let oid = __goscriptRangeTarget4![__rangeIndex]
						let __goscriptShadow7 = oid
						{
							let __goscriptTuple12: any = $.markAsStructValue($.cloneStructValue(__goscriptShadow7)).toASN1OID()
							let __goscriptShadow8: asn1.ObjectIdentifier = (__goscriptTuple12[0] as asn1.ObjectIdentifier)
							let ok = __goscriptTuple12[1]
							if (ok) {
								$.pointerValue<__goscript_x509.Certificate>(out).PolicyIdentifiers = $.append($.pointerValue<__goscript_x509.Certificate>(out).PolicyIdentifiers, (__goscriptShadow8 as asn1.ObjectIdentifier), $.appendZeros.nil)
							}
						}
					}
					break
				}
				case 33:
				{
					let val: $.VarRef<cryptobyte.String> = $.varRef(((e.Value as cryptobyte.String) as cryptobyte.String))
					if (!cryptobyte.String_ReadASN1(val, val, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
						return errors.New("x509: invalid policy mappings extension")
					}
					while (!cryptobyte.String_Empty(val.value)) {
						let s: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
						let issuer: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
						let subject: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
						if ((!cryptobyte.String_ReadASN1(val, s, $.uint(cryptobyte_asn1.SEQUENCE, 8)) || !cryptobyte.String_ReadASN1(s, issuer, $.uint(cryptobyte_asn1.OBJECT_IDENTIFIER, 8))) || !cryptobyte.String_ReadASN1(s, subject, $.uint(cryptobyte_asn1.OBJECT_IDENTIFIER, 8))) {
							return errors.New("x509: invalid policy mappings extension")
						}
						$.pointerValue<__goscript_x509.Certificate>(out).PolicyMappings = $.append($.pointerValue<__goscript_x509.Certificate>(out).PolicyMappings, $.markAsStructValue(new __goscript_x509.PolicyMapping({IssuerDomainPolicy: $.markAsStructValue(new __goscript_oid.OID({der: issuer.value})), SubjectDomainPolicy: $.markAsStructValue(new __goscript_oid.OID({der: subject.value}))})))
					}
					break
				}
				case 54:
				{
					let val: $.VarRef<cryptobyte.String> = $.varRef(((e.Value as cryptobyte.String) as cryptobyte.String))
					if (!cryptobyte.String_ReadASN1Integer(val, $.interfaceValue<any>($.pointerValue<__goscript_x509.Certificate>(out)._fields.InhibitAnyPolicy, "*int", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } }))) {
						return errors.New("x509: invalid inhibit any policy extension")
					}
					$.pointerValue<__goscript_x509.Certificate>(out).InhibitAnyPolicyZero = $.pointerValue<__goscript_x509.Certificate>(out).InhibitAnyPolicy == 0
					break
				}
				default:
				{
					unhandled = true
					break
				}
			}
		} else {
			if (asn1.ObjectIdentifier_Equal(e.Id, (__goscript_x509.oidExtensionAuthorityInfoAccess as asn1.ObjectIdentifier))) {
				// RFC 5280 4.2.2.1: Authority Information Access
				if (e.Critical) {
					// Conforming CAs MUST mark this extension as non-critical
					return errors.New("x509: authority info access incorrectly marked critical")
				}
				let val: $.VarRef<cryptobyte.String> = $.varRef(((e.Value as cryptobyte.String) as cryptobyte.String))
				if (!cryptobyte.String_ReadASN1(val, val, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
					return errors.New("x509: invalid authority info access")
				}
				while (!cryptobyte.String_Empty(val.value)) {
					let aiaDER: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadASN1(val, aiaDER, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
						return errors.New("x509: invalid authority info access")
					}
					let method: $.VarRef<asn1.ObjectIdentifier> = $.varRef(null as asn1.ObjectIdentifier)
					if (!cryptobyte.String_ReadASN1ObjectIdentifier(aiaDER, method)) {
						return errors.New("x509: invalid authority info access")
					}
					if (!cryptobyte.String_PeekASN1Tag(aiaDER.value, $.uint(cryptobyte_asn1.Tag_ContextSpecific(6), 8))) {
						continue
					}
					if (!cryptobyte.String_ReadASN1(aiaDER, aiaDER, $.uint(cryptobyte_asn1.Tag_ContextSpecific(6), 8))) {
						return errors.New("x509: invalid authority info access")
					}
					switch (true) {
						case asn1.ObjectIdentifier_Equal(method.value, (__goscript_x509.oidAuthorityInfoAccessOcsp as asn1.ObjectIdentifier)):
						{
							$.pointerValue<__goscript_x509.Certificate>(out).OCSPServer = $.append($.pointerValue<__goscript_x509.Certificate>(out).OCSPServer, $.bytesToString(aiaDER.value))
							break
						}
						case asn1.ObjectIdentifier_Equal(method.value, (__goscript_x509.oidAuthorityInfoAccessIssuers as asn1.ObjectIdentifier)):
						{
							$.pointerValue<__goscript_x509.Certificate>(out).IssuingCertificateURL = $.append($.pointerValue<__goscript_x509.Certificate>(out).IssuingCertificateURL, $.bytesToString(aiaDER.value))
							break
						}
					}
				}
			} else {
				// Unknown extensions are recorded if critical.
				unhandled = true
			}
		}

		if (e.Critical && unhandled) {
			$.pointerValue<__goscript_x509.Certificate>(out).UnhandledCriticalExtensions = $.append($.pointerValue<__goscript_x509.Certificate>(out).UnhandledCriticalExtensions, (e.Id as asn1.ObjectIdentifier), $.appendZeros.nil)
		}
	}

	return null
}

export let x509negativeserial: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("x509negativeserial")

export function __goscript_set_x509negativeserial(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	x509negativeserial = __goscriptValue
}

export async function parseCertificate(der: $.Slice<number>): globalThis.Promise<[__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError]> {
	let cert: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null = new __goscript_x509.Certificate()

	let input: $.VarRef<cryptobyte.String> = $.varRef(((der as cryptobyte.String) as cryptobyte.String))
	// we read the SEQUENCE including length and tag bytes so that
	// we can populate Certificate.Raw, before unwrapping the
	// SEQUENCE so it can be operated on
	if (!cryptobyte.String_ReadASN1Element(input, input, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed certificate")]
	}
	$.pointerValue<__goscript_x509.Certificate>(cert).Raw = input.value
	if (!cryptobyte.String_ReadASN1(input, input, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed certificate")]
	}

	let tbs: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	// do the same trick again as above to extract the raw
	// bytes for Certificate.RawTBSCertificate
	if (!cryptobyte.String_ReadASN1Element(input, tbs, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed tbs certificate")]
	}
	$.pointerValue<__goscript_x509.Certificate>(cert).RawTBSCertificate = tbs.value
	if (!cryptobyte.String_ReadASN1(tbs, tbs, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed tbs certificate")]
	}

	if (!cryptobyte.String_ReadOptionalASN1Integer(tbs, $.interfaceValue<any>($.pointerValue<__goscript_x509.Certificate>(cert)._fields.Version, "*int", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } }), $.uint(cryptobyte_asn1.Tag_ContextSpecific(cryptobyte_asn1.Tag_Constructed(0)), 8), $.namedValueInterfaceValue<any>(0, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))) {
		return [null, errors.New("x509: malformed version")]
	}
	if ($.pointerValue<__goscript_x509.Certificate>(cert).Version < 0) {
		return [null, errors.New("x509: malformed version")]
	}
	// for backwards compat reasons Version is one-indexed,
	// rather than zero-indexed as defined in 5280
	$.pointerValue<__goscript_x509.Certificate>(cert).Version++
	if ($.pointerValue<__goscript_x509.Certificate>(cert).Version > 3) {
		return [null, errors.New("x509: invalid version")]
	}

	let serial: big.Int | $.VarRef<big.Int> | null = new big.Int()
	if (!cryptobyte.String_ReadASN1Integer(tbs, $.interfaceValue<any>(serial, "*big.Int", { kind: $.TypeKind.Pointer, elemType: "big.Int" }))) {
		return [null, errors.New("x509: malformed serial number")]
	}
	if (big.Int.prototype.Sign.call(serial) == -1) {
		if (!$.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(x509negativeserial)), "1")) {
			return [null, errors.New("x509: negative serial number")]
		} else {
			godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(x509negativeserial))
		}
	}
	$.pointerValue<__goscript_x509.Certificate>(cert).SerialNumber = serial

	let sigAISeq: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadASN1(tbs, sigAISeq, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed signature algorithm identifier")]
	}
	// Before parsing the inner algorithm identifier, extract
	// the outer algorithm identifier and make sure that they
	// match.
	let outerSigAISeq: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadASN1(input, outerSigAISeq, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed algorithm identifier")]
	}
	if (!bytes.Equal(outerSigAISeq.value, sigAISeq.value)) {
		return [null, errors.New("x509: inner and outer signature algorithm identifiers don't match")]
	}
	let [sigAI, err] = parseAI((sigAISeq.value as cryptobyte.String))
	if (err != null) {
		return [null, err]
	}
	$.pointerValue<__goscript_x509.Certificate>(cert).SignatureAlgorithm = await __goscript_x509.getSignatureAlgorithmFromAI($.markAsStructValue($.cloneStructValue(sigAI)))

	let issuerSeq: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadASN1Element(tbs, issuerSeq, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed issuer")]
	}
	$.pointerValue<__goscript_x509.Certificate>(cert).RawIssuer = issuerSeq.value
	let __goscriptTuple13: any = parseName((issuerSeq.value as cryptobyte.String))
	let issuerRDNs: $.VarRef<pkix.RDNSequence> | null = __goscriptTuple13[0]
	err = __goscriptTuple13[1]
	if (err != null) {
		return [null, err]
	}
	$.pointerValue<__goscript_x509.Certificate>(cert).Issuer.FillFromRDNSequence(issuerRDNs)

	let __goscriptShadow9: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadASN1(tbs, __goscriptShadow9, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed validity")]
	}
	let __goscriptTuple14: any = parseValidity((__goscriptShadow9.value as cryptobyte.String))
	$.pointerValue<__goscript_x509.Certificate>(cert).NotBefore = __goscriptTuple14[0]
	$.pointerValue<__goscript_x509.Certificate>(cert).NotAfter = __goscriptTuple14[1]
	err = __goscriptTuple14[2]
	if (err != null) {
		return [null, err]
	}

	let subjectSeq: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadASN1Element(tbs, subjectSeq, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed issuer")]
	}
	$.pointerValue<__goscript_x509.Certificate>(cert).RawSubject = subjectSeq.value
	let __goscriptTuple15: any = parseName((subjectSeq.value as cryptobyte.String))
	let subjectRDNs: $.VarRef<pkix.RDNSequence> | null = __goscriptTuple15[0]
	err = __goscriptTuple15[1]
	if (err != null) {
		return [null, err]
	}
	$.pointerValue<__goscript_x509.Certificate>(cert).Subject.FillFromRDNSequence(subjectRDNs)

	let spki: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadASN1Element(tbs, spki, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed spki")]
	}
	$.pointerValue<__goscript_x509.Certificate>(cert).RawSubjectPublicKeyInfo = spki.value
	if (!cryptobyte.String_ReadASN1(spki, spki, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed spki")]
	}
	let pkAISeq: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadASN1(spki, pkAISeq, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed public key algorithm identifier")]
	}
	let __goscriptTuple16: any = parseAI((pkAISeq.value as cryptobyte.String))
	let pkAI = __goscriptTuple16[0]
	err = __goscriptTuple16[1]
	if (err != null) {
		return [null, err]
	}
	$.pointerValue<__goscript_x509.Certificate>(cert).PublicKeyAlgorithm = __goscript_x509.getPublicKeyAlgorithmFromOID((pkAI.Algorithm as asn1.ObjectIdentifier))
	let spk: $.VarRef<asn1.BitString> = $.varRef($.markAsStructValue(new asn1.BitString()))
	if (!cryptobyte.String_ReadASN1BitString(spki, spk)) {
		return [null, errors.New("x509: malformed subjectPublicKey")]
	}
	if ($.pointerValue<__goscript_x509.Certificate>(cert).PublicKeyAlgorithm != 0) {
		let __goscriptTuple17: any = await parsePublicKey(new __goscript_x509.publicKeyInfo({Algorithm: $.markAsStructValue($.cloneStructValue(pkAI)), PublicKey: $.markAsStructValue($.cloneStructValue(spk.value))}))
		$.pointerValue<__goscript_x509.Certificate>(cert).PublicKey = __goscriptTuple17[0]
		err = __goscriptTuple17[1]
		if (err != null) {
			return [null, err]
		}
	}

	if ($.pointerValue<__goscript_x509.Certificate>(cert).Version > 1) {
		if (!cryptobyte.String_SkipOptionalASN1(tbs, $.uint(cryptobyte_asn1.Tag_ContextSpecific(1), 8))) {
			return [null, errors.New("x509: malformed issuerUniqueID")]
		}
		if (!cryptobyte.String_SkipOptionalASN1(tbs, $.uint(cryptobyte_asn1.Tag_ContextSpecific(2), 8))) {
			return [null, errors.New("x509: malformed subjectUniqueID")]
		}
		if ($.pointerValue<__goscript_x509.Certificate>(cert).Version == 3) {
			let extensions: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			let present: $.VarRef<boolean> = $.varRef(false)
			if (!cryptobyte.String_ReadOptionalASN1(tbs, extensions, present, $.uint(cryptobyte_asn1.Tag_ContextSpecific(cryptobyte_asn1.Tag_Constructed(3)), 8))) {
				return [null, errors.New("x509: malformed extensions")]
			}
			if (present.value) {
				let seenExts: globalThis.Map<string, boolean> | null = $.makeMap<string, boolean>()
				if (!cryptobyte.String_ReadASN1(extensions, extensions, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
					return [null, errors.New("x509: malformed extensions")]
				}
				while (!cryptobyte.String_Empty(extensions.value)) {
					let extension: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadASN1(extensions, extension, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
						return [null, errors.New("x509: malformed extension")]
					}
					let [ext, __goscriptShadow10] = parseExtension((extension.value as cryptobyte.String))
					if (__goscriptShadow10 != null) {
						return [null, __goscriptShadow10]
					}
					let oidStr = asn1.ObjectIdentifier_String(ext.Id)
					if ($.mapGet<string, boolean, boolean>(seenExts, oidStr, false)[0]) {
						return [null, fmt.Errorf("x509: certificate contains duplicate extension with OID %q", oidStr)]
					}
					$.mapSet(seenExts, oidStr, true)
					$.pointerValue<__goscript_x509.Certificate>(cert).Extensions = $.append($.pointerValue<__goscript_x509.Certificate>(cert).Extensions, ext)
				}
				err = await processExtensions(cert)
				if (err != null) {
					return [null, err]
				}
			}
		}
	}

	let signature: $.VarRef<asn1.BitString> = $.varRef($.markAsStructValue(new asn1.BitString()))
	if (!cryptobyte.String_ReadASN1BitString(input, signature)) {
		return [null, errors.New("x509: malformed signature")]
	}
	$.pointerValue<__goscript_x509.Certificate>(cert).Signature = $.markAsStructValue($.cloneStructValue(signature.value)).RightAlign()

	return [cert, null]
}

export async function ParseCertificate(der: $.Slice<number>): globalThis.Promise<[__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, $.GoError]> {
	let __goscriptTuple18: any = await parseCertificate(der)
	let cert: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null = __goscriptTuple18[0]
	let err = __goscriptTuple18[1]
	if (err != null) {
		return [null, err]
	}
	if ($.len(der) != $.len($.pointerValue<__goscript_x509.Certificate>(cert).Raw)) {
		return [null, errors.New("x509: trailing data")]
	}
	return [cert, null]
}

export async function ParseCertificates(der: $.Slice<number>): globalThis.Promise<[$.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>, $.GoError]> {
	let certs: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null> = null as $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>
	while ($.len(der) > 0) {
		let __goscriptTuple19: any = await parseCertificate(der)
		let cert: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null = __goscriptTuple19[0]
		let err = __goscriptTuple19[1]
		if (err != null) {
			return [null, err]
		}
		certs = $.append(certs, cert, $.appendZeros.nil)
		der = $.goSlice(der, $.len($.pointerValue<__goscript_x509.Certificate>(cert).Raw), undefined)
	}
	return [certs, null]
}

export async function ParseRevocationList(der: $.Slice<number>): globalThis.Promise<[__goscript_x509.RevocationList | $.VarRef<__goscript_x509.RevocationList> | null, $.GoError]> {
	let rl: __goscript_x509.RevocationList | $.VarRef<__goscript_x509.RevocationList> | null = new __goscript_x509.RevocationList()

	let input: $.VarRef<cryptobyte.String> = $.varRef(((der as cryptobyte.String) as cryptobyte.String))
	// we read the SEQUENCE including length and tag bytes so that
	// we can populate RevocationList.Raw, before unwrapping the
	// SEQUENCE so it can be operated on
	if (!cryptobyte.String_ReadASN1Element(input, input, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed crl")]
	}
	$.pointerValue<__goscript_x509.RevocationList>(rl).Raw = input.value
	if (!cryptobyte.String_ReadASN1(input, input, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed crl")]
	}

	let tbs: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	// do the same trick again as above to extract the raw
	// bytes for Certificate.RawTBSCertificate
	if (!cryptobyte.String_ReadASN1Element(input, tbs, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed tbs crl")]
	}
	$.pointerValue<__goscript_x509.RevocationList>(rl).RawTBSRevocationList = tbs.value
	if (!cryptobyte.String_ReadASN1(tbs, tbs, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed tbs crl")]
	}

	let version: $.VarRef<number> = $.varRef(0)
	if (!cryptobyte.String_PeekASN1Tag(tbs.value, $.uint(cryptobyte_asn1.INTEGER, 8))) {
		return [null, errors.New("x509: unsupported crl version")]
	}
	if (!cryptobyte.String_ReadASN1Integer(tbs, $.interfaceValue<any>(version, "*int", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } }))) {
		return [null, errors.New("x509: malformed crl")]
	}
	if (version.value != 1) {
		return [null, fmt.Errorf("x509: unsupported crl version: %d", $.namedValueInterfaceValue<any>(version.value, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))]
	}

	let sigAISeq: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadASN1(tbs, sigAISeq, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed signature algorithm identifier")]
	}
	// Before parsing the inner algorithm identifier, extract
	// the outer algorithm identifier and make sure that they
	// match.
	let outerSigAISeq: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadASN1(input, outerSigAISeq, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed algorithm identifier")]
	}
	if (!bytes.Equal(outerSigAISeq.value, sigAISeq.value)) {
		return [null, errors.New("x509: inner and outer signature algorithm identifiers don't match")]
	}
	let [sigAI, err] = parseAI((sigAISeq.value as cryptobyte.String))
	if (err != null) {
		return [null, err]
	}
	$.pointerValue<__goscript_x509.RevocationList>(rl).SignatureAlgorithm = await __goscript_x509.getSignatureAlgorithmFromAI($.markAsStructValue($.cloneStructValue(sigAI)))

	let signature: $.VarRef<asn1.BitString> = $.varRef($.markAsStructValue(new asn1.BitString()))
	if (!cryptobyte.String_ReadASN1BitString(input, signature)) {
		return [null, errors.New("x509: malformed signature")]
	}
	$.pointerValue<__goscript_x509.RevocationList>(rl).Signature = $.markAsStructValue($.cloneStructValue(signature.value)).RightAlign()

	let issuerSeq: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	if (!cryptobyte.String_ReadASN1Element(tbs, issuerSeq, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		return [null, errors.New("x509: malformed issuer")]
	}
	$.pointerValue<__goscript_x509.RevocationList>(rl).RawIssuer = issuerSeq.value
	let __goscriptTuple20: any = parseName((issuerSeq.value as cryptobyte.String))
	let issuerRDNs: $.VarRef<pkix.RDNSequence> | null = __goscriptTuple20[0]
	err = __goscriptTuple20[1]
	if (err != null) {
		return [null, err]
	}
	$.pointerValue<__goscript_x509.RevocationList>(rl).Issuer.FillFromRDNSequence(issuerRDNs)

	let __goscriptTuple21: any = parseTime(tbs)
	$.pointerValue<__goscript_x509.RevocationList>(rl).ThisUpdate = __goscriptTuple21[0]
	err = __goscriptTuple21[1]
	if (err != null) {
		return [null, err]
	}
	if (cryptobyte.String_PeekASN1Tag(tbs.value, $.uint(cryptobyte_asn1.GeneralizedTime, 8)) || cryptobyte.String_PeekASN1Tag(tbs.value, $.uint(cryptobyte_asn1.UTCTime, 8))) {
		let __goscriptTuple22: any = parseTime(tbs)
		$.pointerValue<__goscript_x509.RevocationList>(rl).NextUpdate = __goscriptTuple22[0]
		err = __goscriptTuple22[1]
		if (err != null) {
			return [null, err]
		}
	}

	if (cryptobyte.String_PeekASN1Tag(tbs.value, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
		let revokedSeq: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
		if (!cryptobyte.String_ReadASN1(tbs, revokedSeq, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
			return [null, errors.New("x509: malformed crl")]
		}
		while (!cryptobyte.String_Empty(revokedSeq.value)) {
			let rce = $.markAsStructValue(new __goscript_x509.RevocationListEntry())

			let certSeq: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			if (!cryptobyte.String_ReadASN1Element(revokedSeq, certSeq, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
				return [null, errors.New("x509: malformed crl")]
			}
			rce.Raw = certSeq.value
			if (!cryptobyte.String_ReadASN1(certSeq, certSeq, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
				return [null, errors.New("x509: malformed crl")]
			}

			rce.SerialNumber = new big.Int()
			if (!cryptobyte.String_ReadASN1Integer(certSeq, $.interfaceValue<any>(rce.SerialNumber, "*big.Int", { kind: $.TypeKind.Pointer, elemType: "big.Int" }))) {
				return [null, errors.New("x509: malformed serial number")]
			}
			let __goscriptTuple23: any = parseTime(certSeq)
			rce.RevocationTime = __goscriptTuple23[0]
			err = __goscriptTuple23[1]
			if (err != null) {
				return [null, err]
			}
			let extensions: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			let present: $.VarRef<boolean> = $.varRef(false)
			if (!cryptobyte.String_ReadOptionalASN1(certSeq, extensions, present, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
				return [null, errors.New("x509: malformed extensions")]
			}
			if (present.value) {
				while (!cryptobyte.String_Empty(extensions.value)) {
					let extension: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
					if (!cryptobyte.String_ReadASN1(extensions, extension, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
						return [null, errors.New("x509: malformed extension")]
					}
					let [ext, __goscriptShadow11] = parseExtension((extension.value as cryptobyte.String))
					if (__goscriptShadow11 != null) {
						return [null, __goscriptShadow11]
					}
					if (asn1.ObjectIdentifier_Equal(ext.Id, (__goscript_x509.oidExtensionReasonCode as asn1.ObjectIdentifier))) {
						let val: $.VarRef<cryptobyte.String> = $.varRef(((ext.Value as cryptobyte.String) as cryptobyte.String))
						if (!cryptobyte.String_ReadASN1Enum(val, rce._fields.ReasonCode)) {
							return [null, fmt.Errorf("x509: malformed reasonCode extension")]
						}
					}
					rce.Extensions = $.append(rce.Extensions, ext)
				}
			}

			$.pointerValue<__goscript_x509.RevocationList>(rl).RevokedCertificateEntries = $.append($.pointerValue<__goscript_x509.RevocationList>(rl).RevokedCertificateEntries, rce)
			let rcDeprecated = $.markAsStructValue(new pkix.RevokedCertificate({SerialNumber: rce.SerialNumber, RevocationTime: $.markAsStructValue($.cloneStructValue(rce.RevocationTime)), Extensions: rce.Extensions}))
			$.pointerValue<__goscript_x509.RevocationList>(rl).RevokedCertificates = $.append($.pointerValue<__goscript_x509.RevocationList>(rl).RevokedCertificates, rcDeprecated)
		}
	}

	let extensions: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	let present: $.VarRef<boolean> = $.varRef(false)
	if (!cryptobyte.String_ReadOptionalASN1(tbs, extensions, present, $.uint(cryptobyte_asn1.Tag_ContextSpecific(cryptobyte_asn1.Tag_Constructed(0)), 8))) {
		return [null, errors.New("x509: malformed extensions")]
	}
	if (present.value) {
		if (!cryptobyte.String_ReadASN1(extensions, extensions, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
			return [null, errors.New("x509: malformed extensions")]
		}
		while (!cryptobyte.String_Empty(extensions.value)) {
			let extension: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
			if (!cryptobyte.String_ReadASN1(extensions, extension, $.uint(cryptobyte_asn1.SEQUENCE, 8))) {
				return [null, errors.New("x509: malformed extension")]
			}
			let [ext, __goscriptShadow12] = parseExtension((extension.value as cryptobyte.String))
			if (__goscriptShadow12 != null) {
				return [null, __goscriptShadow12]
			}
			if (asn1.ObjectIdentifier_Equal(ext.Id, (__goscript_x509.oidExtensionAuthorityKeyId as asn1.ObjectIdentifier))) {
				let __goscriptTuple24: any = parseAuthorityKeyIdentifier($.markAsStructValue($.cloneStructValue(ext)))
				$.pointerValue<__goscript_x509.RevocationList>(rl).AuthorityKeyId = __goscriptTuple24[0]
				__goscriptShadow12 = __goscriptTuple24[1]
				if (__goscriptShadow12 != null) {
					return [null, __goscriptShadow12]
				}
			} else {
				if (asn1.ObjectIdentifier_Equal(ext.Id, (__goscript_x509.oidExtensionCRLNumber as asn1.ObjectIdentifier))) {
					let value: $.VarRef<cryptobyte.String> = $.varRef(((ext.Value as cryptobyte.String) as cryptobyte.String))
					$.pointerValue<__goscript_x509.RevocationList>(rl).Number = new big.Int()
					if (!cryptobyte.String_ReadASN1Integer(value, $.interfaceValue<any>($.pointerValue<__goscript_x509.RevocationList>(rl).Number, "*big.Int", { kind: $.TypeKind.Pointer, elemType: "big.Int" }))) {
						return [null, errors.New("x509: malformed crl number")]
					}
				}
			}
			$.pointerValue<__goscript_x509.RevocationList>(rl).Extensions = $.append($.pointerValue<__goscript_x509.RevocationList>(rl).Extensions, ext)
		}
	}

	return [rl, null]
}

export function domainNameValid(s: string, constraint: boolean): boolean {
	// TODO(#75835): This function omits a number of checks which we
	// really should be doing to enforce that domain names are valid names per
	// RFC 1034. We previously enabled these checks, but this broke a
	// significant number of certificates we previously considered valid, and we
	// happily create via CreateCertificate (et al). We should enable these
	// checks, but will need to gate them behind a GODEBUG.
	//
	// I have left the checks we previously enabled, noted with "TODO(#75835)" so
	// that we can easily re-enable them once we unbreak everyone.

	// TODO(#75835): this should only be true for constraints.
	if ($.len(s) == 0) {
		return true
	}

	// Do not allow trailing period (FQDN format is not allowed in SANs or
	// constraints).
	if ($.uint($.indexStringOrBytes(s, $.len(s) - 1), 8) == $.uint(46, 8)) {
		return false
	}

	// TODO(#75835): domains must have at least one label, cannot have
	// a leading empty label, and cannot be longer than 253 characters.
	// if len(s) == 0 || (!constraint && s[0] == '.') || len(s) > 253 {
	// 	return false
	// }

	let lastDot = -1
	if (constraint && ($.uint($.indexStringOrBytes(s, 0), 8) == $.uint(46, 8))) {
		s = $.sliceStringOrBytes(s, 1, undefined)
	}

	for (let i = 0; i <= $.len(s); i++) {
		if ((i < $.len(s)) && (($.uint($.indexStringOrBytes(s, i), 8) < $.uint(33, 8)) || ($.uint($.indexStringOrBytes(s, i), 8) > $.uint(126, 8)))) {
			// Invalid character.
			return false
		}
		if ((i == $.len(s)) || ($.uint($.indexStringOrBytes(s, i), 8) == $.uint(46, 8))) {
			let labelLen = i
			if (lastDot >= 0) {
				labelLen = labelLen - (lastDot + 1)
			}
			if (labelLen == 0) {
				return false
			}
			// TODO(#75835): labels cannot be longer than 63 characters.
			// if labelLen > 63 {
			// 	return false
			// }
			lastDot = i
		}
	}

	return true
}

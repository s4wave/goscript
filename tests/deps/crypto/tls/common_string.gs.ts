// Generated file based on common_string.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as __goscript_common from "./common.gs.ts"
import "@goscript/strconv/index.js"
import "./common.gs.ts"

export const _SignatureScheme_name_0: string = "PKCS1WithSHA1"

export const _SignatureScheme_name_1: string = "ECDSAWithSHA1"

export const _SignatureScheme_name_2: string = "PKCS1WithSHA256"

export const _SignatureScheme_name_3: string = "ECDSAWithP256AndSHA256"

export const _SignatureScheme_name_4: string = "PKCS1WithSHA384"

export const _SignatureScheme_name_5: string = "ECDSAWithP384AndSHA384"

export const _SignatureScheme_name_6: string = "PKCS1WithSHA512"

export const _SignatureScheme_name_7: string = "ECDSAWithP521AndSHA512"

export const _SignatureScheme_name_8: string = "PSSWithSHA256PSSWithSHA384PSSWithSHA512Ed25519"

export const _CurveID_name_0: string = "CurveP256CurveP384CurveP521"

export const _CurveID_name_1: string = "X25519"

export const _CurveID_name_2: string = "SecP256r1MLKEM768X25519MLKEM768SecP384r1MLKEM1024"

export const _ClientAuthType_name: string = "NoClientCertRequestClientCertRequireAnyClientCertVerifyClientCertIfGivenRequireAndVerifyClientCert"

function __goscriptBlankFunc0(): void {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	$.arrayIndex(x, 1025 - 1025)
	$.arrayIndex(x, 1281 - 1281)
	$.arrayIndex(x, 1537 - 1537)
	$.arrayIndex(x, 2052 - 2052)
	$.arrayIndex(x, 2053 - 2053)
	$.arrayIndex(x, 2054 - 2054)
	$.arrayIndex(x, 1027 - 1027)
	$.arrayIndex(x, 1283 - 1283)
	$.arrayIndex(x, 1539 - 1539)
	$.arrayIndex(x, 2055 - 2055)
	$.arrayIndex(x, 513 - 513)
	$.arrayIndex(x, 515 - 515)
}

export let _SignatureScheme_index_8: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(13, 8), $.uint(26, 8), $.uint(39, 8), $.uint(46, 8)])

export function __goscript_set__SignatureScheme_index_8(__goscriptValue: Uint8Array): void {
	_SignatureScheme_index_8 = __goscriptValue
}

export function SignatureScheme_String(i: __goscript_common.SignatureScheme): string {
	switch (true) {
		case $.uint(i, 16) == $.uint(513, 16):
		{
			return "PKCS1WithSHA1"
			break
		}
		case $.uint(i, 16) == $.uint(515, 16):
		{
			return "ECDSAWithSHA1"
			break
		}
		case $.uint(i, 16) == $.uint(1025, 16):
		{
			return "PKCS1WithSHA256"
			break
		}
		case $.uint(i, 16) == $.uint(1027, 16):
		{
			return "ECDSAWithP256AndSHA256"
			break
		}
		case $.uint(i, 16) == $.uint(1281, 16):
		{
			return "PKCS1WithSHA384"
			break
		}
		case $.uint(i, 16) == $.uint(1283, 16):
		{
			return "ECDSAWithP384AndSHA384"
			break
		}
		case $.uint(i, 16) == $.uint(1537, 16):
		{
			return "PKCS1WithSHA512"
			break
		}
		case $.uint(i, 16) == $.uint(1539, 16):
		{
			return "ECDSAWithP521AndSHA512"
			break
		}
		case ($.uint(2052, 16) <= $.uint(i, 16)) && ($.uint(i, 16) <= $.uint(2055, 16)):
		{
			i = i - ($.uint(2052, 16))
			return $.sliceStringOrBytes("PSSWithSHA256PSSWithSHA384PSSWithSHA512Ed25519", $.arrayIndex(_SignatureScheme_index_8, i), $.arrayIndex(_SignatureScheme_index_8, i + 1))
			break
		}
		default:
		{
			return ("SignatureScheme(" + strconv.FormatInt($.int64(i), 10)) + ")"
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

function __goscriptBlankFunc1(): void {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	$.arrayIndex(x, 23 - 23)
	$.arrayIndex(x, 24 - 24)
	$.arrayIndex(x, 25 - 25)
	$.arrayIndex(x, 29 - 29)
	$.arrayIndex(x, 4588 - 4588)
	$.arrayIndex(x, 4587 - 4587)
	$.arrayIndex(x, 4589 - 4589)
}

export let _CurveID_index_0: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(9, 8), $.uint(18, 8), $.uint(27, 8)])

export function __goscript_set__CurveID_index_0(__goscriptValue: Uint8Array): void {
	_CurveID_index_0 = __goscriptValue
}

export let _CurveID_index_2: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(17, 8), $.uint(31, 8), $.uint(49, 8)])

export function __goscript_set__CurveID_index_2(__goscriptValue: Uint8Array): void {
	_CurveID_index_2 = __goscriptValue
}

export function CurveID_String(i: __goscript_common.CurveID): string {
	switch (true) {
		case ($.uint(23, 16) <= $.uint(i, 16)) && ($.uint(i, 16) <= $.uint(25, 16)):
		{
			i = i - ($.uint(23, 16))
			return $.sliceStringOrBytes("CurveP256CurveP384CurveP521", $.arrayIndex(_CurveID_index_0, i), $.arrayIndex(_CurveID_index_0, i + 1))
			break
		}
		case $.uint(i, 16) == $.uint(29, 16):
		{
			return "X25519"
			break
		}
		case ($.uint(4587, 16) <= $.uint(i, 16)) && ($.uint(i, 16) <= $.uint(4589, 16)):
		{
			i = i - ($.uint(4587, 16))
			return $.sliceStringOrBytes("SecP256r1MLKEM768X25519MLKEM768SecP384r1MLKEM1024", $.arrayIndex(_CurveID_index_2, i), $.arrayIndex(_CurveID_index_2, i + 1))
			break
		}
		default:
		{
			return ("CurveID(" + strconv.FormatInt($.int64(i), 10)) + ")"
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

function __goscriptBlankFunc2(): void {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	$.arrayIndex(x, 0 - 0)
	$.arrayIndex(x, 1 - 1)
	$.arrayIndex(x, 2 - 2)
	$.arrayIndex(x, 3 - 3)
	$.arrayIndex(x, 4 - 4)
}

export let _ClientAuthType_index: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(12, 8), $.uint(29, 8), $.uint(49, 8), $.uint(72, 8), $.uint(98, 8)])

export function __goscript_set__ClientAuthType_index(__goscriptValue: Uint8Array): void {
	_ClientAuthType_index = __goscriptValue
}

export function ClientAuthType_String(i: __goscript_common.ClientAuthType): string {
	if ((i < 0) || (i >= $.len(_ClientAuthType_index) - 1)) {
		return ("ClientAuthType(" + strconv.FormatInt($.int64(i), 10)) + ")"
	}
	return $.sliceStringOrBytes("NoClientCertRequestClientCertRequireAnyClientCertVerifyClientCertIfGivenRequireAndVerifyClientCert", $.arrayIndex(_ClientAuthType_index, i), $.arrayIndex(_ClientAuthType_index, i + 1))
}

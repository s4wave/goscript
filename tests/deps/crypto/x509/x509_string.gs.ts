// Generated file based on x509_string.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"

import type * as asn1 from "@goscript/encoding/asn1/index.js"

import type * as __goscript_oid from "./oid.gs.ts"

import * as __goscript_x509 from "./x509.gs.ts"
import "@goscript/strconv/index.js"
import "./x509.gs.ts"

export const _KeyUsage_name_0: string = "digitalSignaturecontentCommitment"

export const _KeyUsage_name_1: string = "keyEncipherment"

export const _KeyUsage_name_2: string = "dataEncipherment"

export const _KeyUsage_name_3: string = "keyAgreement"

export const _KeyUsage_name_4: string = "keyCertSign"

export const _KeyUsage_name_5: string = "cRLSign"

export const _KeyUsage_name_6: string = "encipherOnly"

export const _KeyUsage_name_7: string = "decipherOnly"

export const _ExtKeyUsage_name: string = "anyExtendedKeyUsageserverAuthclientAuthcodeSigningemailProtectionipsecEndSystemipsecTunnelipsecUsertimeStampingOCSPSigningmsSGCnsSGCmsCodeCommsKernelCode"

function __goscriptBlankFunc0(): void {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	$.arrayIndex(x, 1 - 1)
	$.arrayIndex(x, 2 - 2)
	$.arrayIndex(x, 4 - 4)
	$.arrayIndex(x, 8 - 8)
	$.arrayIndex(x, 16 - 16)
	$.arrayIndex(x, 32 - 32)
	$.arrayIndex(x, 64 - 64)
	$.arrayIndex(x, 128 - 128)
	$.arrayIndex(x, 256 - 256)
}

export let _KeyUsage_index_0: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(16, 8), $.uint(33, 8)])

export function __goscript_set__KeyUsage_index_0(__goscriptValue: Uint8Array): void {
	_KeyUsage_index_0 = __goscriptValue
}

export function KeyUsage_String(i: __goscript_x509.KeyUsage): string {
	switch (true) {
		case (1 <= i) && (i <= 2):
		{
			i = i - (1)
			return $.sliceStringOrBytes("digitalSignaturecontentCommitment", $.arrayIndex(_KeyUsage_index_0, i), $.arrayIndex(_KeyUsage_index_0, i + 1))
			break
		}
		case i == 4:
		{
			return "keyEncipherment"
			break
		}
		case i == 8:
		{
			return "dataEncipherment"
			break
		}
		case i == 16:
		{
			return "keyAgreement"
			break
		}
		case i == 32:
		{
			return "keyCertSign"
			break
		}
		case i == 64:
		{
			return "cRLSign"
			break
		}
		case i == 128:
		{
			return "encipherOnly"
			break
		}
		case i == 256:
		{
			return "decipherOnly"
			break
		}
		default:
		{
			return ("KeyUsage(" + strconv.FormatInt($.int64(i), 10)) + ")"
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

function __goscriptBlankFunc1(): void {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	let x: {}[] = Array.from({ length: 1 }, () => ({}))
	$.arrayIndex(x, 0 - 0)
	$.arrayIndex(x, 1 - 1)
	$.arrayIndex(x, 2 - 2)
	$.arrayIndex(x, 3 - 3)
	$.arrayIndex(x, 4 - 4)
	$.arrayIndex(x, 5 - 5)
	$.arrayIndex(x, 6 - 6)
	$.arrayIndex(x, 7 - 7)
	$.arrayIndex(x, 8 - 8)
	$.arrayIndex(x, 9 - 9)
	$.arrayIndex(x, 10 - 10)
	$.arrayIndex(x, 11 - 11)
	$.arrayIndex(x, 12 - 12)
	$.arrayIndex(x, 13 - 13)
}

export let _ExtKeyUsage_index: Uint8Array = new Uint8Array([$.uint(0, 8), $.uint(19, 8), $.uint(29, 8), $.uint(39, 8), $.uint(50, 8), $.uint(65, 8), $.uint(79, 8), $.uint(90, 8), $.uint(99, 8), $.uint(111, 8), $.uint(122, 8), $.uint(127, 8), $.uint(132, 8), $.uint(141, 8), $.uint(153, 8)])

export function __goscript_set__ExtKeyUsage_index(__goscriptValue: Uint8Array): void {
	_ExtKeyUsage_index = __goscriptValue
}

export function ExtKeyUsage_String(i: __goscript_x509.ExtKeyUsage): string {
	let idx = $.int(i) - 0
	if ((i < 0) || (idx >= ($.len(_ExtKeyUsage_index) - 1))) {
		return ("ExtKeyUsage(" + strconv.FormatInt($.int64(i), 10)) + ")"
	}
	return $.sliceStringOrBytes("anyExtendedKeyUsageserverAuthclientAuthcodeSigningemailProtectionipsecEndSystemipsecTunnelipsecUsertimeStampingOCSPSigningmsSGCnsSGCmsCodeCommsKernelCode", $.arrayIndex(_ExtKeyUsage_index, idx), $.arrayIndex(_ExtKeyUsage_index, idx + 1))
}

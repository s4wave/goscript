// Generated file based on alert.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"
import "@goscript/strconv/index.js"

export type AlertError = number

export type alert = number

export const alertLevelWarning: number = 1

export const alertLevelError: number = 2

export const alertCloseNotify: alert = 0

export const alertUnexpectedMessage: alert = 10

export const alertBadRecordMAC: alert = 20

export const alertDecryptionFailed: alert = 21

export const alertRecordOverflow: alert = 22

export const alertDecompressionFailure: alert = 30

export const alertHandshakeFailure: alert = 40

export const alertBadCertificate: alert = 42

export const alertUnsupportedCertificate: alert = 43

export const alertCertificateRevoked: alert = 44

export const alertCertificateExpired: alert = 45

export const alertCertificateUnknown: alert = 46

export const alertIllegalParameter: alert = 47

export const alertUnknownCA: alert = 48

export const alertAccessDenied: alert = 49

export const alertDecodeError: alert = 50

export const alertDecryptError: alert = 51

export const alertExportRestriction: alert = 60

export const alertProtocolVersion: alert = 70

export const alertInsufficientSecurity: alert = 71

export const alertInternalError: alert = 80

export const alertInappropriateFallback: alert = 86

export const alertUserCanceled: alert = 90

export const alertNoRenegotiation: alert = 100

export const alertMissingExtension: alert = 109

export const alertUnsupportedExtension: alert = 110

export const alertCertificateUnobtainable: alert = 111

export const alertUnrecognizedName: alert = 112

export const alertBadCertificateStatusResponse: alert = 113

export const alertBadCertificateHashValue: alert = 114

export const alertUnknownPSKIdentity: alert = 115

export const alertCertificateRequired: alert = 116

export const alertNoApplicationProtocol: alert = 120

export const alertECHRequired: alert = 121

export function AlertError_Error(e: AlertError): string {
	return alert_String($.uint(e, 8))
}

export let alertText: globalThis.Map<alert, string> | null = new globalThis.Map<alert, string>([[$.uint(0, 8), "close notify"], [$.uint(10, 8), "unexpected message"], [$.uint(20, 8), "bad record MAC"], [$.uint(21, 8), "decryption failed"], [$.uint(22, 8), "record overflow"], [$.uint(30, 8), "decompression failure"], [$.uint(40, 8), "handshake failure"], [$.uint(42, 8), "bad certificate"], [$.uint(43, 8), "unsupported certificate"], [$.uint(44, 8), "revoked certificate"], [$.uint(45, 8), "expired certificate"], [$.uint(46, 8), "unknown certificate"], [$.uint(47, 8), "illegal parameter"], [$.uint(48, 8), "unknown certificate authority"], [$.uint(49, 8), "access denied"], [$.uint(50, 8), "error decoding message"], [$.uint(51, 8), "error decrypting message"], [$.uint(60, 8), "export restriction"], [$.uint(70, 8), "protocol version not supported"], [$.uint(71, 8), "insufficient security level"], [$.uint(80, 8), "internal error"], [$.uint(86, 8), "inappropriate fallback"], [$.uint(90, 8), "user canceled"], [$.uint(100, 8), "no renegotiation"], [$.uint(109, 8), "missing extension"], [$.uint(110, 8), "unsupported extension"], [$.uint(111, 8), "certificate unobtainable"], [$.uint(112, 8), "unrecognized name"], [$.uint(113, 8), "bad certificate status response"], [$.uint(114, 8), "bad certificate hash value"], [$.uint(115, 8), "unknown PSK identity"], [$.uint(116, 8), "certificate required"], [$.uint(120, 8), "no application protocol"], [$.uint(121, 8), "encrypted client hello required"]])

export function __goscript_set_alertText(__goscriptValue: globalThis.Map<alert, string> | null): void {
	alertText = __goscriptValue
}

export function alert_String(e: alert): string {
	let [s, ok] = $.mapGet<alert, string, string>(alertText, $.uint(e, 8), "")
	if (ok) {
		return "tls: " + s
	}
	return ("tls: alert(" + strconv.Itoa($.int(e))) + ")"
}

export function alert_Error(e: alert): string {
	return alert_String(e)
}

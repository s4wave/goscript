// Generated file based on package_import_x509_verify_async.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as big from "@goscript/math/big/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/math/big/index.js"
import "@goscript/time/index.js"

export async function verifyCertificate(cert: x509.Certificate | $.VarRef<x509.Certificate> | null, now: time.Time): globalThis.Promise<$.GoError> {
	let pool: x509.CertPool | $.VarRef<x509.CertPool> | null = x509.NewCertPool()
	await x509.CertPool.prototype.AddCert.call(pool, cert)
	let [, err] = await x509.Certificate.prototype.Verify.call(cert, $.markAsStructValue(new x509.VerifyOptions({Roots: pool, CurrentTime: $.markAsStructValue($.cloneStructValue(now)), KeyUsages: $.arrayToSlice<x509.ExtKeyUsage>([x509.ExtKeyUsageAny])})))
	return err
}

export async function main(): globalThis.Promise<void> {
	let now = $.markAsStructValue($.cloneStructValue(time.Unix(1700000000n, 0n)))
	let cert: x509.Certificate | $.VarRef<x509.Certificate> | null = (() => { const __goscriptLiteralField0 = big.NewInt(1n); const __goscriptLiteralField1 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Add(-3600000000000n))); const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).Add(3600000000000n))); return new x509.Certificate({Raw: new Uint8Array([99, 101, 114, 116, 105, 102, 105, 99, 97, 116, 101]), RawSubject: new Uint8Array([115, 117, 98, 106, 101, 99, 116]), RawIssuer: new Uint8Array([115, 117, 98, 106, 101, 99, 116]), SerialNumber: __goscriptLiteralField0, NotBefore: __goscriptLiteralField1, NotAfter: __goscriptLiteralField2, KeyUsage: x509.KeyUsageCertSign, BasicConstraintsValid: true, IsCA: true}) })()
	let err = await verifyCertificate(cert, $.markAsStructValue($.cloneStructValue(now)))
	$.println("verify err nil", err == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}

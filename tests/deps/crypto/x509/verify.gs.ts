// Generated file based on verify.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as pkix from "@goscript/crypto/x509/pkix/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as iter from "@goscript/iter/index.js"

import * as maps from "@goscript/maps/index.js"

import * as net from "@goscript/net/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

import * as time from "@goscript/time/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"

import type * as io from "@goscript/io/index.js"

import * as big from "@goscript/math/big/index.js"

import * as url from "@goscript/net/url/index.js"

import * as __goscript_cert_pool from "./cert_pool.gs.ts"

import * as __goscript_constraints from "./constraints.gs.ts"

import * as __goscript_oid from "./oid.gs.ts"

import * as __goscript_root from "./root.gs.ts"

import * as __goscript_root_unix from "./root_unix.gs.ts"

import * as __goscript_x509 from "./x509.gs.ts"

import * as __goscript_x509_string from "./x509_string.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/iter/index.js"
import "@goscript/maps/index.js"
import "@goscript/net/index.js"
import "@goscript/runtime/index.js"
import "@goscript/slices/index.js"
import "@goscript/strings/index.js"
import "@goscript/time/index.js"
import "@goscript/unicode/utf8/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/math/big/index.js"
import "@goscript/net/url/index.js"
import "./cert_pool.gs.ts"
import "./constraints.gs.ts"
import "./oid.gs.ts"
import "./root.gs.ts"
import "./root_unix.gs.ts"
import "./x509.gs.ts"
import "./x509_string.gs.ts"

export type InvalidReason = number

export class CertificateInvalidError {
	public get Cert(): __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null {
		return this._fields.Cert.value
	}
	public set Cert(value: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null) {
		this._fields.Cert.value = value
	}

	public get Reason(): InvalidReason {
		return this._fields.Reason.value
	}
	public set Reason(value: InvalidReason) {
		this._fields.Reason.value = value
	}

	public get Detail(): string {
		return this._fields.Detail.value
	}
	public set Detail(value: string) {
		this._fields.Detail.value = value
	}

	public _fields: {
		Cert: $.VarRef<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>
		Reason: $.VarRef<InvalidReason>
		Detail: $.VarRef<string>
	}

	constructor(init?: Partial<{Cert?: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, Reason?: InvalidReason, Detail?: string}>) {
		this._fields = {
			Cert: $.varRef(init?.Cert ?? (null as __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null)),
			Reason: $.varRef(init?.Reason ?? (0 as InvalidReason)),
			Detail: $.varRef(init?.Detail ?? ("" as string))
		}
	}

	public clone(): CertificateInvalidError {
		const cloned = new CertificateInvalidError()
		cloned._fields = {
			Cert: $.varRef(this._fields.Cert.value),
			Reason: $.varRef(this._fields.Reason.value),
			Detail: $.varRef(this._fields.Detail.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Error(): globalThis.Promise<string> {
		const e = this
		switch (e.Reason) {
			case 0:
			{
				return "x509: certificate is not authorized to sign other certificates"
				break
			}
			case 1:
			{
				return "x509: certificate has expired or is not yet valid: " + e.Detail
				break
			}
			case 2:
			{
				return "x509: a root or intermediate certificate is not authorized to sign for this name: " + e.Detail
				break
			}
			case 9:
			{
				return "x509: a root or intermediate certificate is not authorized for an extended key usage: " + e.Detail
				break
			}
			case 3:
			{
				return "x509: too many intermediates for path length constraint"
				break
			}
			case 4:
			{
				return "x509: certificate specifies an incompatible key usage"
				break
			}
			case 5:
			{
				return "x509: issuer name does not match subject from issuing certificate"
				break
			}
			case 6:
			{
				return "x509: issuer has name constraints but leaf doesn't have a SAN extension"
				break
			}
			case 7:
			{
				return "x509: issuer has name constraints but leaf contains unknown or unconstrained name: " + e.Detail
				break
			}
			case 10:
			{
				let s = "x509: no valid chains built"
				if (!$.stringEqual(e.Detail, "")) {
					s = await fmt.Sprintf("%s: %s", s, e.Detail)
				}
				return s
				break
			}
		}
		return "x509: unknown error"
	}

	static __typeInfo = $.registerStructType(
		"x509.CertificateInvalidError",
		() => new CertificateInvalidError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		CertificateInvalidError,
		[{ name: "Cert", key: "Cert", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" }, index: [0], offset: 0, exported: true }, { name: "Reason", key: "Reason", type: { kind: $.TypeKind.Basic, name: "int", typeName: "x509.InvalidReason" }, index: [1], offset: 8, exported: true }, { name: "Detail", key: "Detail", type: { kind: $.TypeKind.Basic, name: "string" }, index: [2], offset: 16, exported: true }]
	)
}

export class HostnameError {
	public get Certificate(): __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null {
		return this._fields.Certificate.value
	}
	public set Certificate(value: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null) {
		this._fields.Certificate.value = value
	}

	public get Host(): string {
		return this._fields.Host.value
	}
	public set Host(value: string) {
		this._fields.Host.value = value
	}

	public _fields: {
		Certificate: $.VarRef<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>
		Host: $.VarRef<string>
	}

	constructor(init?: Partial<{Certificate?: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, Host?: string}>) {
		this._fields = {
			Certificate: $.varRef(init?.Certificate ?? (null as __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null)),
			Host: $.varRef(init?.Host ?? ("" as string))
		}
	}

	public clone(): HostnameError {
		const cloned = new HostnameError()
		cloned._fields = {
			Certificate: $.varRef(this._fields.Certificate.value),
			Host: $.varRef(this._fields.Host.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Error(): globalThis.Promise<string> {
		const h = this
		let c: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null = h.Certificate
		let maxNamesIncluded = 100

		if (!__goscript_x509.Certificate.prototype.hasSANExtension.call(c) && matchHostnames($.pointerValue<__goscript_x509.Certificate>(c).Subject.CommonName, splitHostname(h.Host))) {
			return "x509: certificate relies on legacy Common Name field, use SANs instead"
		}

		let valid: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		{
			let ip: net.IP = (net.ParseIP(h.Host) as net.IP)
			if (ip != null) {
				// Trying to validate an IP
				if ($.len($.pointerValue<__goscript_x509.Certificate>(c).IPAddresses) == 0) {
					return ("x509: cannot validate certificate for " + h.Host) + " because it doesn't contain any IP SANs"
				}
				if ($.len($.pointerValue<__goscript_x509.Certificate>(c).IPAddresses) >= maxNamesIncluded) {
					return fmt.Sprintf("x509: certificate is valid for %d IP SANs, but none matched %s", $.namedValueInterfaceValue<any>($.len($.pointerValue<__goscript_x509.Certificate>(c).IPAddresses), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), h.Host)
				}
				for (let __goscriptRangeTarget0 = $.pointerValue<__goscript_x509.Certificate>(c).IPAddresses, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
					let san = __goscriptRangeTarget0![__rangeIndex]
					if (valid.value.Len() > 0) {
						valid.value.WriteString(", ")
					}
					valid.value.WriteString(net.IP_String(san))
				}
			} else {
				if ($.len($.pointerValue<__goscript_x509.Certificate>(c).DNSNames) >= maxNamesIncluded) {
					return fmt.Sprintf("x509: certificate is valid for %d names, but none matched %s", $.namedValueInterfaceValue<any>($.len($.pointerValue<__goscript_x509.Certificate>(c).DNSNames), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), h.Host)
				}
				valid.value.WriteString(strings.Join($.pointerValue<__goscript_x509.Certificate>(c).DNSNames, ", "))
			}
		}

		if (valid.value.Len() == 0) {
			return "x509: certificate is not valid for any names, but wanted to match " + h.Host
		}
		return (("x509: certificate is valid for " + valid.value.String()) + ", not ") + h.Host
	}

	static __typeInfo = $.registerStructType(
		"x509.HostnameError",
		() => new HostnameError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		HostnameError,
		[{ name: "Certificate", key: "Certificate", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" }, index: [0], offset: 0, exported: true }, { name: "Host", key: "Host", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 8, exported: true }]
	)
}

export class UnknownAuthorityError {
	public get Cert(): __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null {
		return this._fields.Cert.value
	}
	public set Cert(value: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null) {
		this._fields.Cert.value = value
	}

	// hintErr contains an error that may be helpful in determining why an
	// authority wasn't found.
	public get hintErr(): $.GoError {
		return this._fields.hintErr.value
	}
	public set hintErr(value: $.GoError) {
		this._fields.hintErr.value = value
	}

	// hintCert contains a possible authority certificate that was rejected
	// because of the error in hintErr.
	public get hintCert(): __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null {
		return this._fields.hintCert.value
	}
	public set hintCert(value: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null) {
		this._fields.hintCert.value = value
	}

	public _fields: {
		Cert: $.VarRef<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>
		hintErr: $.VarRef<$.GoError>
		hintCert: $.VarRef<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>
	}

	constructor(init?: Partial<{Cert?: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, hintErr?: $.GoError, hintCert?: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null}>) {
		this._fields = {
			Cert: $.varRef(init?.Cert ?? (null as __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null)),
			hintErr: $.varRef(init?.hintErr ?? (null as $.GoError)),
			hintCert: $.varRef(init?.hintCert ?? (null as __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null))
		}
	}

	public clone(): UnknownAuthorityError {
		const cloned = new UnknownAuthorityError()
		cloned._fields = {
			Cert: $.varRef(this._fields.Cert.value),
			hintErr: $.varRef(this._fields.hintErr.value),
			hintCert: $.varRef(this._fields.hintCert.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Error(): globalThis.Promise<string> {
		const e = this
		let s = "x509: certificate signed by unknown authority"
		if (e.hintErr != null) {
			let certName = $.pointerValue<__goscript_x509.Certificate>(e.hintCert).Subject.CommonName
			if ($.len(certName) == 0) {
				if ($.len($.pointerValue<__goscript_x509.Certificate>(e.hintCert).Subject.Organization) > 0) {
					certName = $.arrayIndex($.pointerValue<__goscript_x509.Certificate>(e.hintCert).Subject.Organization!, 0)
				} else {
					certName = "serial:" + await big.Int.prototype.String.call($.pointerValue<__goscript_x509.Certificate>(e.hintCert).SerialNumber)
				}
			}
			s = s + (await fmt.Sprintf(" (possibly because of %q while trying to verify candidate authority certificate %q)", (e.hintErr as any), certName))
		}
		return s
	}

	static __typeInfo = $.registerStructType(
		"x509.UnknownAuthorityError",
		() => new UnknownAuthorityError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		UnknownAuthorityError,
		[{ name: "Cert", key: "Cert", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" }, index: [0], offset: 0, exported: true }, { name: "hintErr", key: "hintErr", type: "error", pkgPath: "crypto/x509", index: [1], offset: 8, exported: false }, { name: "hintCert", key: "hintCert", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" }, pkgPath: "crypto/x509", index: [2], offset: 24, exported: false }]
	)
}

export class SystemRootsError {
	public get Err(): $.GoError {
		return this._fields.Err.value
	}
	public set Err(value: $.GoError) {
		this._fields.Err.value = value
	}

	public _fields: {
		Err: $.VarRef<$.GoError>
	}

	constructor(init?: Partial<{Err?: $.GoError}>) {
		this._fields = {
			Err: $.varRef(init?.Err ?? (null as $.GoError))
		}
	}

	public clone(): SystemRootsError {
		const cloned = new SystemRootsError()
		cloned._fields = {
			Err: $.varRef(this._fields.Err.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const se = this
		let msg = "x509: failed to load system roots and no roots provided"
		if (se.Err != null) {
			return (msg + "; ") + $.pointerValue<Exclude<$.GoError, null>>(se.Err).Error()
		}
		return msg
	}

	public Unwrap(): $.GoError {
		const se = this
		return se.Err
	}

	static __typeInfo = $.registerStructType(
		"x509.SystemRootsError",
		() => new SystemRootsError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Unwrap", args: [], returns: [{ name: "_r0", type: "error" }] }],
		SystemRootsError,
		[{ name: "Err", key: "Err", type: "error", index: [0], offset: 0, exported: true }]
	)
}

export class VerifyOptions {
	// DNSName, if set, is checked against the leaf certificate with
	// Certificate.VerifyHostname or the platform verifier.
	public get DNSName(): string {
		return this._fields.DNSName.value
	}
	public set DNSName(value: string) {
		this._fields.DNSName.value = value
	}

	// Intermediates is an optional pool of certificates that are not trust
	// anchors, but can be used to form a chain from the leaf certificate to a
	// root certificate.
	public get Intermediates(): __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null {
		return this._fields.Intermediates.value
	}
	public set Intermediates(value: __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null) {
		this._fields.Intermediates.value = value
	}

	// Roots is the set of trusted root certificates the leaf certificate needs
	// to chain up to. If nil, the system roots or the platform verifier are used.
	public get Roots(): __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null {
		return this._fields.Roots.value
	}
	public set Roots(value: __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null) {
		this._fields.Roots.value = value
	}

	// CurrentTime is used to check the validity of all certificates in the
	// chain. If zero, the current time is used.
	public get CurrentTime(): time.Time {
		return this._fields.CurrentTime.value
	}
	public set CurrentTime(value: time.Time) {
		this._fields.CurrentTime.value = value
	}

	// KeyUsages specifies which Extended Key Usage values are acceptable. A
	// chain is accepted if it allows any of the listed values. An empty list
	// means ExtKeyUsageServerAuth. To accept any key usage, include ExtKeyUsageAny.
	public get KeyUsages(): $.Slice<__goscript_x509.ExtKeyUsage> {
		return this._fields.KeyUsages.value
	}
	public set KeyUsages(value: $.Slice<__goscript_x509.ExtKeyUsage>) {
		this._fields.KeyUsages.value = value
	}

	// MaxConstraintComparisions is the maximum number of comparisons to
	// perform when checking a given certificate's name constraints. If
	// zero, a sensible default is used. This limit prevents pathological
	// certificates from consuming excessive amounts of CPU time when
	// validating. It does not apply to the platform verifier.
	public get MaxConstraintComparisions(): number {
		return this._fields.MaxConstraintComparisions.value
	}
	public set MaxConstraintComparisions(value: number) {
		this._fields.MaxConstraintComparisions.value = value
	}

	// CertificatePolicies specifies which certificate policy OIDs are
	// acceptable during policy validation. An empty CertificatePolices
	// field implies any valid policy is acceptable.
	public get CertificatePolicies(): $.Slice<__goscript_oid.OID> {
		return this._fields.CertificatePolicies.value
	}
	public set CertificatePolicies(value: $.Slice<__goscript_oid.OID>) {
		this._fields.CertificatePolicies.value = value
	}

	// inhibitPolicyMapping indicates if policy mapping should be allowed
	// during path validation.
	public get inhibitPolicyMapping(): boolean {
		return this._fields.inhibitPolicyMapping.value
	}
	public set inhibitPolicyMapping(value: boolean) {
		this._fields.inhibitPolicyMapping.value = value
	}

	// requireExplicitPolicy indidicates if explicit policies must be present
	// for each certificate being validated.
	public get requireExplicitPolicy(): boolean {
		return this._fields.requireExplicitPolicy.value
	}
	public set requireExplicitPolicy(value: boolean) {
		this._fields.requireExplicitPolicy.value = value
	}

	// inhibitAnyPolicy indicates if the anyPolicy policy should be
	// processed if present in a certificate being validated.
	public get inhibitAnyPolicy(): boolean {
		return this._fields.inhibitAnyPolicy.value
	}
	public set inhibitAnyPolicy(value: boolean) {
		this._fields.inhibitAnyPolicy.value = value
	}

	public _fields: {
		DNSName: $.VarRef<string>
		Intermediates: $.VarRef<__goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null>
		Roots: $.VarRef<__goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null>
		CurrentTime: $.VarRef<time.Time>
		KeyUsages: $.VarRef<$.Slice<__goscript_x509.ExtKeyUsage>>
		MaxConstraintComparisions: $.VarRef<number>
		CertificatePolicies: $.VarRef<$.Slice<__goscript_oid.OID>>
		inhibitPolicyMapping: $.VarRef<boolean>
		requireExplicitPolicy: $.VarRef<boolean>
		inhibitAnyPolicy: $.VarRef<boolean>
	}

	constructor(init?: Partial<{DNSName?: string, Intermediates?: __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null, Roots?: __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null, CurrentTime?: time.Time, KeyUsages?: $.Slice<__goscript_x509.ExtKeyUsage>, MaxConstraintComparisions?: number, CertificatePolicies?: $.Slice<__goscript_oid.OID>, inhibitPolicyMapping?: boolean, requireExplicitPolicy?: boolean, inhibitAnyPolicy?: boolean}>) {
		this._fields = {
			DNSName: $.varRef(init?.DNSName ?? ("" as string)),
			Intermediates: $.varRef(init?.Intermediates ?? (null as __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null)),
			Roots: $.varRef(init?.Roots ?? (null as __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null)),
			CurrentTime: $.varRef(init?.CurrentTime ? $.markAsStructValue($.cloneStructValue(init.CurrentTime)) : $.markAsStructValue(new time.Time())),
			KeyUsages: $.varRef(init?.KeyUsages ?? (null as $.Slice<__goscript_x509.ExtKeyUsage>)),
			MaxConstraintComparisions: $.varRef(init?.MaxConstraintComparisions ?? (0 as number)),
			CertificatePolicies: $.varRef(init?.CertificatePolicies ?? (null as $.Slice<__goscript_oid.OID>)),
			inhibitPolicyMapping: $.varRef(init?.inhibitPolicyMapping ?? (false as boolean)),
			requireExplicitPolicy: $.varRef(init?.requireExplicitPolicy ?? (false as boolean)),
			inhibitAnyPolicy: $.varRef(init?.inhibitAnyPolicy ?? (false as boolean))
		}
	}

	public clone(): VerifyOptions {
		const cloned = new VerifyOptions()
		cloned._fields = {
			DNSName: $.varRef(this._fields.DNSName.value),
			Intermediates: $.varRef(this._fields.Intermediates.value),
			Roots: $.varRef(this._fields.Roots.value),
			CurrentTime: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.CurrentTime.value))),
			KeyUsages: $.varRef(this._fields.KeyUsages.value),
			MaxConstraintComparisions: $.varRef(this._fields.MaxConstraintComparisions.value),
			CertificatePolicies: $.varRef(this._fields.CertificatePolicies.value),
			inhibitPolicyMapping: $.varRef(this._fields.inhibitPolicyMapping.value),
			requireExplicitPolicy: $.varRef(this._fields.requireExplicitPolicy.value),
			inhibitAnyPolicy: $.varRef(this._fields.inhibitAnyPolicy.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.VerifyOptions",
		() => new VerifyOptions(),
		[],
		VerifyOptions,
		[{ name: "DNSName", key: "DNSName", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }, { name: "Intermediates", key: "Intermediates", type: { kind: $.TypeKind.Pointer, elemType: "x509.CertPool" }, index: [1], offset: 16, exported: true }, { name: "Roots", key: "Roots", type: { kind: $.TypeKind.Pointer, elemType: "x509.CertPool" }, index: [2], offset: 24, exported: true }, { name: "CurrentTime", key: "CurrentTime", type: "time.Time", index: [3], offset: 32, exported: true }, { name: "KeyUsages", key: "KeyUsages", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int", typeName: "x509.ExtKeyUsage" } }, index: [4], offset: 56, exported: true }, { name: "MaxConstraintComparisions", key: "MaxConstraintComparisions", type: { kind: $.TypeKind.Basic, name: "int" }, index: [5], offset: 80, exported: true }, { name: "CertificatePolicies", key: "CertificatePolicies", type: { kind: $.TypeKind.Slice, elemType: "x509.OID" }, index: [6], offset: 88, exported: true }, { name: "inhibitPolicyMapping", key: "inhibitPolicyMapping", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/x509", index: [7], offset: 112, exported: false }, { name: "requireExplicitPolicy", key: "requireExplicitPolicy", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/x509", index: [8], offset: 113, exported: false }, { name: "inhibitAnyPolicy", key: "inhibitAnyPolicy", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/x509", index: [9], offset: 114, exported: false }]
	)
}

export class rfc2821Mailbox {
	public get local(): string {
		return this._fields.local.value
	}
	public set local(value: string) {
		this._fields.local.value = value
	}

	public get domain(): string {
		return this._fields.domain.value
	}
	public set domain(value: string) {
		this._fields.domain.value = value
	}

	public _fields: {
		local: $.VarRef<string>
		domain: $.VarRef<string>
	}

	constructor(init?: Partial<{local?: string, domain?: string}>) {
		this._fields = {
			local: $.varRef(init?.local ?? ("" as string)),
			domain: $.varRef(init?.domain ?? ("" as string))
		}
	}

	public clone(): rfc2821Mailbox {
		const cloned = new rfc2821Mailbox()
		cloned._fields = {
			local: $.varRef(this._fields.local.value),
			domain: $.varRef(this._fields.domain.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async String(): globalThis.Promise<string> {
		const s = this
		return fmt.Sprintf("%s@%s", s.local, s.domain)
	}

	static __typeInfo = $.registerStructType(
		"x509.rfc2821Mailbox",
		() => new rfc2821Mailbox(),
		[{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		rfc2821Mailbox,
		[{ name: "local", key: "local", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "domain", key: "domain", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/x509", index: [1], offset: 16, exported: false }]
	)
}

export class policyGraphNode {
	public get validPolicy(): __goscript_oid.OID {
		return this._fields.validPolicy.value
	}
	public set validPolicy(value: __goscript_oid.OID) {
		this._fields.validPolicy.value = value
	}

	public get expectedPolicySet(): $.Slice<__goscript_oid.OID> {
		return this._fields.expectedPolicySet.value
	}
	public set expectedPolicySet(value: $.Slice<__goscript_oid.OID>) {
		this._fields.expectedPolicySet.value = value
	}

	public get parents(): globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean> | null {
		return this._fields.parents.value
	}
	public set parents(value: globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean> | null) {
		this._fields.parents.value = value
	}

	public get children(): globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean> | null {
		return this._fields.children.value
	}
	public set children(value: globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean> | null) {
		this._fields.children.value = value
	}

	public _fields: {
		validPolicy: $.VarRef<__goscript_oid.OID>
		expectedPolicySet: $.VarRef<$.Slice<__goscript_oid.OID>>
		parents: $.VarRef<globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean> | null>
		children: $.VarRef<globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean> | null>
	}

	constructor(init?: Partial<{validPolicy?: __goscript_oid.OID, expectedPolicySet?: $.Slice<__goscript_oid.OID>, parents?: globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean> | null, children?: globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean> | null}>) {
		this._fields = {
			validPolicy: $.varRef(init?.validPolicy ? $.markAsStructValue($.cloneStructValue(init.validPolicy)) : $.markAsStructValue(new __goscript_oid.OID())),
			expectedPolicySet: $.varRef(init?.expectedPolicySet ?? (null as $.Slice<__goscript_oid.OID>)),
			parents: $.varRef(init?.parents ?? (null as globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean> | null)),
			children: $.varRef(init?.children ?? (null as globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean> | null))
		}
	}

	public clone(): policyGraphNode {
		const cloned = new policyGraphNode()
		cloned._fields = {
			validPolicy: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.validPolicy.value))),
			expectedPolicySet: $.varRef(this._fields.expectedPolicySet.value),
			parents: $.varRef(this._fields.parents.value),
			children: $.varRef(this._fields.children.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.policyGraphNode",
		() => new policyGraphNode(),
		[],
		policyGraphNode,
		[{ name: "validPolicy", key: "validPolicy", type: "x509.OID", pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "expectedPolicySet", key: "expectedPolicySet", type: { kind: $.TypeKind.Slice, elemType: "x509.OID" }, pkgPath: "crypto/x509", index: [1], offset: 24, exported: false }, { name: "parents", key: "parents", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Pointer, elemType: "x509.policyGraphNode" }, elemType: { kind: $.TypeKind.Basic, name: "bool" } }, pkgPath: "crypto/x509", index: [2], offset: 48, exported: false }, { name: "children", key: "children", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Pointer, elemType: "x509.policyGraphNode" }, elemType: { kind: $.TypeKind.Basic, name: "bool" } }, pkgPath: "crypto/x509", index: [3], offset: 56, exported: false }]
	)
}

export class policyGraph {
	public get strata(): $.Slice<globalThis.Map<string, policyGraphNode | $.VarRef<policyGraphNode> | null> | null> {
		return this._fields.strata.value
	}
	public set strata(value: $.Slice<globalThis.Map<string, policyGraphNode | $.VarRef<policyGraphNode> | null> | null>) {
		this._fields.strata.value = value
	}

	// map of OID -> nodes at strata[depth-1] with OID in their expectedPolicySet
	public get parentIndex(): globalThis.Map<string, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>> | null {
		return this._fields.parentIndex.value
	}
	public set parentIndex(value: globalThis.Map<string, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>> | null) {
		this._fields.parentIndex.value = value
	}

	public get depth(): number {
		return this._fields.depth.value
	}
	public set depth(value: number) {
		this._fields.depth.value = value
	}

	public _fields: {
		strata: $.VarRef<$.Slice<globalThis.Map<string, policyGraphNode | $.VarRef<policyGraphNode> | null> | null>>
		parentIndex: $.VarRef<globalThis.Map<string, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>> | null>
		depth: $.VarRef<number>
	}

	constructor(init?: Partial<{strata?: $.Slice<globalThis.Map<string, policyGraphNode | $.VarRef<policyGraphNode> | null> | null>, parentIndex?: globalThis.Map<string, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>> | null, depth?: number}>) {
		this._fields = {
			strata: $.varRef(init?.strata ?? (null as $.Slice<globalThis.Map<string, policyGraphNode | $.VarRef<policyGraphNode> | null> | null>)),
			parentIndex: $.varRef(init?.parentIndex ?? (null as globalThis.Map<string, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>> | null)),
			depth: $.varRef(init?.depth ?? (0 as number))
		}
	}

	public clone(): policyGraph {
		const cloned = new policyGraph()
		cloned._fields = {
			strata: $.varRef(this._fields.strata.value),
			parentIndex: $.varRef(this._fields.parentIndex.value),
			depth: $.varRef(this._fields.depth.value)
		}
		return $.markAsStructValue(cloned)
	}

	public deleteLeaf(policy: __goscript_oid.OID): void {
		const pg: policyGraph | $.VarRef<policyGraph> | null = this
		let n: policyGraphNode | $.VarRef<policyGraphNode> | null = $.mapGet<string, policyGraphNode | $.VarRef<policyGraphNode> | null, policyGraphNode | $.VarRef<policyGraphNode> | null>($.arrayIndex($.pointerValue<policyGraph>(pg).strata!, $.pointerValue<policyGraph>(pg).depth), $.bytesToString(policy.der), null)[0]
		if (n == null) {
			return
		}
		for (const [p, __rangeValue] of $.pointerValue<policyGraphNode>(n).parents?.entries() ?? []) {
			$.deleteMapEntry($.pointerValue<policyGraphNode>(p).children, n)
		}
		for (const [c, __rangeValue] of $.pointerValue<policyGraphNode>(n).children?.entries() ?? []) {
			$.deleteMapEntry($.pointerValue<policyGraphNode>(c).parents, n)
		}
		$.deleteMapEntry($.arrayIndex($.pointerValue<policyGraph>(pg).strata!, $.pointerValue<policyGraph>(pg).depth), $.bytesToString(policy.der))
	}

	public incrDepth(): void {
		let pg: policyGraph | $.VarRef<policyGraph> | null = this
		$.pointerValue<policyGraph>(pg).parentIndex = new globalThis.Map<string, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>>([])
		for (const [__rangeKey, n] of $.arrayIndex($.pointerValue<policyGraph>(pg).strata!, $.pointerValue<policyGraph>(pg).depth)?.entries() ?? []) {
			for (let __goscriptRangeTarget12 = $.pointerValue<policyGraphNode>(n).expectedPolicySet, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget12); __rangeIndex++) {
				let e = __goscriptRangeTarget12![__rangeIndex]
				$.mapSet($.pointerValue<policyGraph>(pg).parentIndex, $.bytesToString(e.der), $.append($.mapGet<string, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>>($.pointerValue<policyGraph>(pg).parentIndex, $.bytesToString(e.der), null)[0], n, $.appendZeros.nil))
			}
		}

		$.pointerValue<policyGraph>(pg).depth++
		$.pointerValue<policyGraph>(pg).strata = $.append($.pointerValue<policyGraph>(pg).strata, new globalThis.Map<string, policyGraphNode | $.VarRef<policyGraphNode> | null>([]), $.appendZeros.nil)
	}

	public insert(n: policyGraphNode | $.VarRef<policyGraphNode> | null): void {
		let pg: policyGraph | $.VarRef<policyGraph> | null = this
		$.mapSet($.arrayIndex($.pointerValue<policyGraph>(pg).strata!, $.pointerValue<policyGraph>(pg).depth), $.bytesToString($.pointerValue<policyGraphNode>(n).validPolicy.der), n)
	}

	public leafWithPolicy(policy: __goscript_oid.OID): policyGraphNode | $.VarRef<policyGraphNode> | null {
		const pg: policyGraph | $.VarRef<policyGraph> | null = this
		return $.mapGet<string, policyGraphNode | $.VarRef<policyGraphNode> | null, policyGraphNode | $.VarRef<policyGraphNode> | null>($.arrayIndex($.pointerValue<policyGraph>(pg).strata!, $.pointerValue<policyGraph>(pg).depth), $.bytesToString(policy.der), null)[0]
	}

	public leaves(): globalThis.Map<string, policyGraphNode | $.VarRef<policyGraphNode> | null> | null {
		const pg: policyGraph | $.VarRef<policyGraph> | null = this
		return $.arrayIndex($.pointerValue<policyGraph>(pg).strata!, $.pointerValue<policyGraph>(pg).depth)
	}

	public async parentWithAnyPolicy(): globalThis.Promise<policyGraphNode | $.VarRef<policyGraphNode> | null> {
		const pg: policyGraph | $.VarRef<policyGraph> | null = this
		if ($.pointerValue<policyGraph>(pg).depth == 0) {
			return null
		}
		return $.mapGet<string, policyGraphNode | $.VarRef<policyGraphNode> | null, policyGraphNode | $.VarRef<policyGraphNode> | null>($.arrayIndex($.pointerValue<policyGraph>(pg).strata!, $.pointerValue<policyGraph>(pg).depth - 1), $.bytesToString((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()).der), null)[0]
	}

	public parents(): iter.Seq<policyGraphNode | $.VarRef<policyGraphNode> | null> | null {
		const pg: policyGraph | $.VarRef<policyGraph> | null = this
		if ($.pointerValue<policyGraph>(pg).depth == 0) {
			return (null as iter.Seq<policyGraphNode | $.VarRef<policyGraphNode> | null> | null)
		}
		return (maps.Values($.arrayIndex($.pointerValue<policyGraph>(pg).strata!, $.pointerValue<policyGraph>(pg).depth - 1)) as iter.Seq<policyGraphNode | $.VarRef<policyGraphNode> | null> | null)
	}

	public parentsWithExpected(expected: __goscript_oid.OID): $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null> {
		const pg: policyGraph | $.VarRef<policyGraph> | null = this
		if ($.pointerValue<policyGraph>(pg).depth == 0) {
			return null
		}
		return $.mapGet<string, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>>($.pointerValue<policyGraph>(pg).parentIndex, $.bytesToString(expected.der), null)[0]
	}

	public prune(): void {
		const pg: policyGraph | $.VarRef<policyGraph> | null = this
		for (let i = $.pointerValue<policyGraph>(pg).depth - 1; i > 0; i--) {
			for (const [__rangeKey, n] of $.arrayIndex($.pointerValue<policyGraph>(pg).strata!, i)?.entries() ?? []) {
				if ($.len($.pointerValue<policyGraphNode>(n).children) == 0) {
					for (const [p, __rangeValue] of $.pointerValue<policyGraphNode>(n).parents?.entries() ?? []) {
						$.deleteMapEntry($.pointerValue<policyGraphNode>(p).children, n)
					}
					$.deleteMapEntry($.arrayIndex($.pointerValue<policyGraph>(pg).strata!, i), $.bytesToString($.pointerValue<policyGraphNode>(n).validPolicy.der))
				}
			}
		}
	}

	public async validPolicyNodes(): globalThis.Promise<$.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>> {
		const pg: policyGraph | $.VarRef<policyGraph> | null = this
		let validNodes: $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null> = null as $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>
		for (let i = $.pointerValue<policyGraph>(pg).depth; i >= 0; i--) {
			for (const [__rangeKey, n] of $.arrayIndex($.pointerValue<policyGraph>(pg).strata!, i)?.entries() ?? []) {
				if ($.markAsStructValue($.cloneStructValue($.pointerValue<policyGraphNode>(n).validPolicy)).Equal($.markAsStructValue($.cloneStructValue((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()))))) {
					continue
				}

				if ($.len($.pointerValue<policyGraphNode>(n).parents) == 1) {
					for (const [p, __rangeValue] of $.pointerValue<policyGraphNode>(n).parents?.entries() ?? []) {
						if ($.markAsStructValue($.cloneStructValue($.pointerValue<policyGraphNode>(p).validPolicy)).Equal($.markAsStructValue($.cloneStructValue((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()))))) {
							validNodes = $.append(validNodes, n, $.appendZeros.nil)
						}
					}
				}
			}
		}
		return validNodes
	}

	static __typeInfo = $.registerStructType(
		"x509.policyGraph",
		() => new policyGraph(),
		[{ name: "deleteLeaf", args: [{ name: "policy", type: "x509.OID" }], returns: [] }, { name: "incrDepth", args: [], returns: [] }, { name: "insert", args: [{ name: "n", type: { kind: $.TypeKind.Pointer, elemType: "x509.policyGraphNode" } }], returns: [] }, { name: "leafWithPolicy", args: [{ name: "policy", type: "x509.OID" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "x509.policyGraphNode" } }] }, { name: "leaves", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.policyGraphNode" } } }] }, { name: "parentWithAnyPolicy", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "x509.policyGraphNode" } }] }, { name: "parents", args: [], returns: [{ name: "_r0", type: ({ kind: $.TypeKind.Function, name: "iter.Seq", params: [({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "x509.policyGraphNode" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo) }] }, { name: "parentsWithExpected", args: [{ name: "expected", type: "x509.OID" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.policyGraphNode" } } }] }, { name: "prune", args: [], returns: [] }, { name: "validPolicyNodes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.policyGraphNode" } } }] }],
		policyGraph,
		[{ name: "strata", key: "strata", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.policyGraphNode" } } }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "parentIndex", key: "parentIndex", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.policyGraphNode" } } }, pkgPath: "crypto/x509", index: [1], offset: 24, exported: false }, { name: "depth", key: "depth", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/x509", index: [2], offset: 32, exported: false }]
	)
}

export const NotAuthorizedToSign: InvalidReason = 0

export const Expired: InvalidReason = 1

export const CANotAuthorizedForThisName: InvalidReason = 2

export const TooManyIntermediates: InvalidReason = 3

export const IncompatibleUsage: InvalidReason = 4

export const NameMismatch: InvalidReason = 5

export const NameConstraintsWithoutSANs: InvalidReason = 6

export const UnconstrainedName: InvalidReason = 7

export const TooManyConstraints: InvalidReason = 8

export const CANotAuthorizedForExtKeyUsage: InvalidReason = 9

export const NoValidChains: InvalidReason = 10

export const leafCertificate: number = 0

export const intermediateCertificate: number = 1

export const rootCertificate: number = 2

export const maxChainSignatureChecks: number = 100

export let errNotParsed: $.GoError = errors.New("x509: missing ASN.1 contents; use ParseCertificate")

export function __goscript_set_errNotParsed(__goscriptValue: $.GoError): void {
	errNotParsed = __goscriptValue
}

export function parseRFC2821Mailbox(_in: string): [rfc2821Mailbox, boolean] {
	let mailbox: rfc2821Mailbox = $.markAsStructValue(new rfc2821Mailbox())
	let ok: boolean = false
	if ($.len(_in) == 0) {
		return [$.markAsStructValue($.cloneStructValue(mailbox)), false]
	}

	let localPartBytes: $.Slice<number> = $.makeSlice<number>(0, Math.trunc($.len(_in) / 2), "byte")

	if ($.uint($.indexStringOrBytes(_in, 0), 8) == $.uint(34, 8)) {
		// Quoted-string = DQUOTE *qcontent DQUOTE
		// non-whitespace-control = %d1-8 / %d11 / %d12 / %d14-31 / %d127
		// qcontent = qtext / quoted-pair
		// qtext = non-whitespace-control /
		//         %d33 / %d35-91 / %d93-126
		// quoted-pair = ("\" text) / obs-qp
		// text = %d1-9 / %d11 / %d12 / %d14-127 / obs-text
		//
		// (Names beginning with “obs-” are the obsolete syntax from RFC 2822,
		// Section 4. Since it has been 16 years, we no longer accept that.)
		_in = $.sliceStringOrBytes(_in, 1, undefined)
		QuotedString: while (true) {
			if ($.len(_in) == 0) {
				return [$.markAsStructValue($.cloneStructValue(mailbox)), false]
			}
			let c = $.uint($.indexStringOrBytes(_in, 0), 8)
			_in = $.sliceStringOrBytes(_in, 1, undefined)

			switch (true) {
				case $.uint(c, 8) == $.uint(34, 8):
				{
					break QuotedString
					break
				}
				case $.uint(c, 8) == $.uint(92, 8):
				{
					if ($.len(_in) == 0) {
						return [$.markAsStructValue($.cloneStructValue(mailbox)), false]
					}
					if (((($.uint($.indexStringOrBytes(_in, 0), 8) == $.uint(11, 8)) || ($.uint($.indexStringOrBytes(_in, 0), 8) == $.uint(12, 8))) || (($.uint(1, 8) <= $.uint($.indexStringOrBytes(_in, 0), 8)) && ($.uint($.indexStringOrBytes(_in, 0), 8) <= $.uint(9, 8)))) || (($.uint(14, 8) <= $.uint($.indexStringOrBytes(_in, 0), 8)) && ($.uint($.indexStringOrBytes(_in, 0), 8) <= $.uint(127, 8)))) {
						localPartBytes = $.append(localPartBytes, $.uint($.indexStringOrBytes(_in, 0), 8), $.byteSliceHint)
						_in = $.sliceStringOrBytes(_in, 1, undefined)
					} else {
						return [$.markAsStructValue($.cloneStructValue(mailbox)), false]
					}
					break
				}
				case (((((((($.uint(c, 8) == $.uint(11, 8)) || ($.uint(c, 8) == $.uint(12, 8))) || ($.uint(c, 8) == $.uint(32, 8))) || ($.uint(c, 8) == $.uint(33, 8))) || ($.uint(c, 8) == $.uint(127, 8))) || (($.uint(1, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(8, 8)))) || (($.uint(14, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(31, 8)))) || (($.uint(35, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(91, 8)))) || (($.uint(93, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(126, 8))):
				{
					localPartBytes = $.append(localPartBytes, $.uint(c, 8), $.byteSliceHint)
					break
				}
				default:
				{
					return [$.markAsStructValue($.cloneStructValue(mailbox)), false]
					break
				}
			}
		}
	} else {
		// Atom ("." Atom)*
		NextChar: while ($.len(_in) > 0) {
			// atext from RFC 2822, Section 3.2.4
			let c = $.uint($.indexStringOrBytes(_in, 0), 8)

			switch (true) {
				case $.uint(c, 8) == $.uint(92, 8):
				{
					_in = $.sliceStringOrBytes(_in, 1, undefined)
					if ($.len(_in) == 0) {
						return [$.markAsStructValue($.cloneStructValue(mailbox)), false]
					}
				}
				case ((((((((((((((((((((((($.uint(48, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(57, 8))) || (($.uint(97, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(122, 8)))) || (($.uint(65, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(90, 8)))) || ($.uint(c, 8) == $.uint(33, 8))) || ($.uint(c, 8) == $.uint(35, 8))) || ($.uint(c, 8) == $.uint(36, 8))) || ($.uint(c, 8) == $.uint(37, 8))) || ($.uint(c, 8) == $.uint(38, 8))) || ($.uint(c, 8) == $.uint(39, 8))) || ($.uint(c, 8) == $.uint(42, 8))) || ($.uint(c, 8) == $.uint(43, 8))) || ($.uint(c, 8) == $.uint(45, 8))) || ($.uint(c, 8) == $.uint(47, 8))) || ($.uint(c, 8) == $.uint(61, 8))) || ($.uint(c, 8) == $.uint(63, 8))) || ($.uint(c, 8) == $.uint(94, 8))) || ($.uint(c, 8) == $.uint(95, 8))) || ($.uint(c, 8) == $.uint(96, 8))) || ($.uint(c, 8) == $.uint(123, 8))) || ($.uint(c, 8) == $.uint(124, 8))) || ($.uint(c, 8) == $.uint(125, 8))) || ($.uint(c, 8) == $.uint(126, 8))) || ($.uint(c, 8) == $.uint(46, 8)):
				{
					localPartBytes = $.append(localPartBytes, $.uint($.indexStringOrBytes(_in, 0), 8), $.byteSliceHint)
					_in = $.sliceStringOrBytes(_in, 1, undefined)
					break
				}
				default:
				{
					break NextChar
					break
				}
			}
		}

		if ($.len(localPartBytes) == 0) {
			return [$.markAsStructValue($.cloneStructValue(mailbox)), false]
		}

		// From RFC 3696, Section 3:
		// “period (".") may also appear, but may not be used to start
		// or end the local part, nor may two or more consecutive
		// periods appear.”
		let twoDots: $.Slice<number> = new Uint8Array([46, 46]) as $.Slice<number>
		if ((($.uint($.arrayIndex(localPartBytes!, 0), 8) == $.uint(46, 8)) || ($.uint($.arrayIndex(localPartBytes!, $.len(localPartBytes) - 1), 8) == $.uint(46, 8))) || bytes.Contains(localPartBytes, twoDots)) {
			return [$.markAsStructValue($.cloneStructValue(mailbox)), false]
		}
	}

	if (($.len(_in) == 0) || ($.uint($.indexStringOrBytes(_in, 0), 8) != $.uint(64, 8))) {
		return [$.markAsStructValue($.cloneStructValue(mailbox)), false]
	}
	_in = $.sliceStringOrBytes(_in, 1, undefined)

	// The RFC species a format for domains, but that's known to be
	// violated in practice so we accept that anything after an '@' is the
	// domain part.
	{
		let [, __goscriptShadow0] = domainToReverseLabels(_in)
		if (!__goscriptShadow0) {
			return [$.markAsStructValue($.cloneStructValue(mailbox)), false]
		}
	}

	mailbox.local = $.bytesToString(localPartBytes)
	mailbox.domain = _in
	return [$.markAsStructValue($.cloneStructValue(mailbox)), true]
}

export function domainToReverseLabels(domain: string): [$.Slice<string>, boolean] {
	let reverseLabels: $.Slice<string> = null as $.Slice<string>
	let ok: boolean = false
	reverseLabels = $.makeSlice<string>(0, strings.Count(domain, ".") + 1, "string")
	while ($.len(domain) > 0) {
		{
			let i = strings.LastIndexByte(domain, $.uint(46, 8))
			if (i == -1) {
				reverseLabels = $.append(reverseLabels, domain)
				domain = ""
			} else {
				reverseLabels = $.append(reverseLabels, $.sliceStringOrBytes(domain, i + 1, undefined))
				domain = $.sliceStringOrBytes(domain, undefined, i)
				if (i == 0) {
					// domain is prefixed with an empty label, append an empty
					// string to reverseLabels to indicate this.
					reverseLabels = $.append(reverseLabels, "")
				}
			}
		}
	}

	if (($.len(reverseLabels) > 0) && ($.len($.arrayIndex(reverseLabels!, 0)) == 0)) {
		// An empty label at the end indicates an absolute value.
		return [null, false]
	}

	for (let __goscriptRangeTarget1 = reverseLabels, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let label = __goscriptRangeTarget1![__rangeIndex]
		if ($.len(label) == 0) {
			// Empty labels are otherwise invalid.
			return [null, false]
		}

		for (const [__rangeIndex, c] of $.rangeString(label)) {
			if (($.int(c, 32) < $.int(33, 32)) || ($.int(c, 32) > $.int(126, 32))) {
				// Invalid character.
				return [null, false]
			}
		}
	}

	return [reverseLabels, true]
}

export function appendToFreshChain(chain: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>, cert: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null): $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null> {
	let n: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null> = $.makeSlice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>($.len(chain) + 1)
	$.copy(n, chain)
	n![$.len(chain)] = cert
	return n
}

export function alreadyInChain(candidate: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null, chain: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>): boolean {
	type pubKeyEqual = {
		Equal(_p0: crypto.PublicKey | null): boolean
	}

	$.registerInterfaceType(
		"x509.pubKeyEqual",
		null,
		[{ name: "Equal", args: [{ name: "_p0", type: "crypto.PublicKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]
	);

	let candidateSAN: pkix.Extension | $.VarRef<pkix.Extension> | null = null as pkix.Extension | $.VarRef<pkix.Extension> | null
	for (let __goscriptRangeTarget2 = $.pointerValue<__goscript_x509.Certificate>(candidate).Extensions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let ext = $.varRef(__goscriptRangeTarget2![__rangeIndex])
		if (asn1.ObjectIdentifier_Equal(ext.value.Id, (__goscript_x509.oidExtensionSubjectAltName as asn1.ObjectIdentifier))) {
			candidateSAN = ext
			break
		}
	}

	for (let __goscriptRangeTarget4 = chain, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let cert = __goscriptRangeTarget4![__rangeIndex]
		if (!bytes.Equal($.pointerValue<__goscript_x509.Certificate>(candidate).RawSubject, $.pointerValue<__goscript_x509.Certificate>(cert).RawSubject)) {
			continue
		}
		// We enforce the canonical encoding of SPKI (by only allowing the
		// correct AI paremeter encodings in parseCertificate), so it's safe to
		// directly compare the raw bytes.
		if (!bytes.Equal($.pointerValue<__goscript_x509.Certificate>(candidate).RawSubjectPublicKeyInfo, $.pointerValue<__goscript_x509.Certificate>(cert).RawSubjectPublicKeyInfo)) {
			continue
		}
		let certSAN: pkix.Extension | $.VarRef<pkix.Extension> | null = null as pkix.Extension | $.VarRef<pkix.Extension> | null
		for (let __goscriptRangeTarget3 = $.pointerValue<__goscript_x509.Certificate>(cert).Extensions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
			let ext = $.varRef(__goscriptRangeTarget3![__rangeIndex])
			if (asn1.ObjectIdentifier_Equal(ext.value.Id, (__goscript_x509.oidExtensionSubjectAltName as asn1.ObjectIdentifier))) {
				certSAN = ext
				break
			}
		}
		if ((candidateSAN == null) && (certSAN == null)) {
			return true
		} else {
			if ((candidateSAN == null) || (certSAN == null)) {
				return false
			}
		}
		if (bytes.Equal($.pointerValue<pkix.Extension>(candidateSAN).Value, $.pointerValue<pkix.Extension>(certSAN).Value)) {
			return true
		}
	}
	return false
}

export let errSignatureLimit: $.GoError = errors.New("x509: signature check attempts limit reached while verifying certificate chain")

export function __goscript_set_errSignatureLimit(__goscriptValue: $.GoError): void {
	errSignatureLimit = __goscriptValue
}

export function validHostnamePattern(host: string): boolean {
	return validHostname(host, true)
}

export function validHostnameInput(host: string): boolean {
	return validHostname(host, false)
}

export function validHostname(host: string, isPattern: boolean): boolean {
	if (!isPattern) {
		host = strings.TrimSuffix(host, ".")
	}
	if ($.len(host) == 0) {
		return false
	}
	if ($.stringEqual(host, "*")) {
		// Bare wildcards are not allowed, they are not valid DNS names,
		// nor are they allowed per RFC 6125.
		return false
	}

	for (let __goscriptRangeTarget5 = strings.Split(host, "."), i = 0; i < $.len(__goscriptRangeTarget5); i++) {
		let part = __goscriptRangeTarget5![i]
		if ($.stringEqual(part, "")) {
			// Empty label.
			return false
		}
		if ((isPattern && (i == 0)) && ($.stringEqual(part, "*"))) {
			// Only allow full left-most wildcards, as those are the only ones
			// we match, and matching literal '*' characters is probably never
			// the expected behavior.
			continue
		}
		for (const [j, c] of $.rangeString(part)) {
			if (($.int(97, 32) <= $.int(c, 32)) && ($.int(c, 32) <= $.int(122, 32))) {
				continue
			}
			if (($.int(48, 32) <= $.int(c, 32)) && ($.int(c, 32) <= $.int(57, 32))) {
				continue
			}
			if (($.int(65, 32) <= $.int(c, 32)) && ($.int(c, 32) <= $.int(90, 32))) {
				continue
			}
			if (($.int(c, 32) == $.int(45, 32)) && (j != 0)) {
				continue
			}
			if ($.int(c, 32) == $.int(95, 32)) {
				// Not a valid character in hostnames, but commonly
				// found in deployments outside the WebPKI.
				continue
			}
			return false
		}
	}

	return true
}

export function matchExactly(hostA: string, hostB: string): boolean {
	if (((($.stringEqual(hostA, "")) || ($.stringEqual(hostA, "."))) || ($.stringEqual(hostB, ""))) || ($.stringEqual(hostB, "."))) {
		return false
	}
	return $.stringEqual(toLowerCaseASCII(hostA), toLowerCaseASCII(hostB))
}

export function matchHostnames(pattern: string, hostParts: $.Slice<string>): boolean {
	pattern = toLowerCaseASCII(pattern)

	if (($.len(pattern) == 0) || ($.len(hostParts) == 0)) {
		return false
	}

	let patternParts: $.Slice<string> = strings.Split(pattern, ".")

	if ($.len(patternParts) != $.len(hostParts)) {
		return false
	}

	for (let __goscriptRangeTarget6 = patternParts, i = 0; i < $.len(__goscriptRangeTarget6); i++) {
		let patternPart = __goscriptRangeTarget6![i]
		if ((i == 0) && ($.stringEqual(patternPart, "*"))) {
			continue
		}
		if (!$.stringEqual(patternPart, $.arrayIndex(hostParts!, i))) {
			return false
		}
	}

	return true
}

export function toLowerCaseASCII(_in: string): string {
	// If the string is already lower-case then there's nothing to do.
	let isAlreadyLowerCase = true
	for (const [__rangeIndex, c] of $.rangeString(_in)) {
		if ($.int(c, 32) == $.int(utf8.RuneError, 32)) {
			// If we get a UTF-8 error then there might be
			// upper-case ASCII bytes in the invalid sequence.
			isAlreadyLowerCase = false
			break
		}
		if (($.int(65, 32) <= $.int(c, 32)) && ($.int(c, 32) <= $.int(90, 32))) {
			isAlreadyLowerCase = false
			break
		}
	}

	if (isAlreadyLowerCase) {
		return _in
	}

	let out: $.Slice<number> = $.stringToBytes(_in)
	for (let __goscriptRangeTarget7 = out, i = 0; i < $.len(__goscriptRangeTarget7); i++) {
		let c = __goscriptRangeTarget7![i]
		if (($.uint(65, 8) <= $.uint(c, 8)) && ($.uint(c, 8) <= $.uint(90, 8))) {
			out![i] = out![i] + ($.uint(97 - 65, 8))
		}
	}
	return $.bytesToString(out)
}

export function splitHostname(host: string): $.Slice<string> {
	return strings.Split(toLowerCaseASCII(strings.TrimSuffix(host, ".")), ".")
}

export function checkChainForKeyUsage(chain: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>, keyUsages: $.Slice<__goscript_x509.ExtKeyUsage>): boolean {
	let usages: $.Slice<__goscript_x509.ExtKeyUsage> = $.makeSlice<__goscript_x509.ExtKeyUsage>($.len(keyUsages), undefined, "number")
	$.copy(usages, keyUsages)

	if ($.len(chain) == 0) {
		return false
	}

	let usagesRemaining = $.len(usages)

	// We walk down the list and cross out any usages that aren't supported
	// by each certificate. If we cross out all the usages, then the chain
	// is unacceptable.

	NextCert: for (let i = $.len(chain) - 1; i >= 0; i--) {
		let cert: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null = $.arrayIndex(chain!, i)
		if (($.len($.pointerValue<__goscript_x509.Certificate>(cert).ExtKeyUsage) == 0) && ($.len($.pointerValue<__goscript_x509.Certificate>(cert).UnknownExtKeyUsage) == 0)) {
			// The certificate doesn't have any extended key usage specified.
			continue
		}

		for (let __goscriptRangeTarget8 = $.pointerValue<__goscript_x509.Certificate>(cert).ExtKeyUsage, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget8); __rangeIndex++) {
			let usage = __goscriptRangeTarget8![__rangeIndex]
			if (usage == 0) {
				// The certificate is explicitly good for any usage.
				continue NextCert
			}
		}

		const invalidUsage: number = -1

		NextRequestedUsage: for (let __goscriptRangeTarget10 = usages, i = 0; i < $.len(__goscriptRangeTarget10); i++) {
			let requestedUsage = __goscriptRangeTarget10![i]
			if (requestedUsage == -1) {
				continue
			}

			for (let __goscriptRangeTarget9 = $.pointerValue<__goscript_x509.Certificate>(cert).ExtKeyUsage, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget9); __rangeIndex++) {
				let usage = __goscriptRangeTarget9![__rangeIndex]
				if (requestedUsage == usage) {
					continue NextRequestedUsage
				}
			}

			usages![i] = -1
			usagesRemaining--
			if (usagesRemaining == 0) {
				return false
			}
		}
	}

	return true
}

export async function mustNewOIDFromInts(ints: $.Slice<bigint>): globalThis.Promise<__goscript_oid.OID> {
	let [oid, err] = __goscript_oid.OIDFromInts(ints)
	if (err != null) {
		$.panic(await fmt.Sprintf("OIDFromInts(%v) unexpected error: %v", $.interfaceValue<any>(ints, "[]uint64", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint64" } }), (err as any)))
	}
	return $.markAsStructValue($.cloneStructValue(oid))
}

export function newPolicyGraphNode(valid: __goscript_oid.OID, parents: $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>): policyGraphNode | $.VarRef<policyGraphNode> | null {
	let n: policyGraphNode | $.VarRef<policyGraphNode> | null = new policyGraphNode({validPolicy: $.markAsStructValue($.cloneStructValue(valid)), expectedPolicySet: $.arrayToSlice<__goscript_oid.OID>([$.markAsStructValue($.cloneStructValue(valid))]), children: new globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean>([]), parents: new globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean>([])})
	for (let __goscriptRangeTarget11 = parents, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget11); __rangeIndex++) {
		let p = __goscriptRangeTarget11![__rangeIndex]
		$.mapSet($.pointerValue<policyGraphNode>(p).children, n, true)
		$.mapSet($.pointerValue<policyGraphNode>(n).parents, p, true)
	}
	return n
}

export var anyPolicyOID: __goscript_oid.OID

export async function __goscript_init_anyPolicyOID(): globalThis.Promise<void> {
	if (((anyPolicyOID) as any) === undefined) {
		anyPolicyOID = await $.markAsStructValue($.cloneStructValue(await mustNewOIDFromInts($.arrayToSlice<bigint>([2n, 5n, 29n, 32n, 0n]))))
	}
}

export function __goscript_get_anyPolicyOID(): __goscript_oid.OID {
	if (((anyPolicyOID) as any) === undefined) {
		throw new Error("goscript package variable anyPolicyOID read before initialization")
	}
	return anyPolicyOID
}

export function __goscript_set_anyPolicyOID(__goscriptValue: __goscript_oid.OID): void {
	anyPolicyOID = __goscriptValue
}

export async function newPolicyGraph(): globalThis.Promise<policyGraph | $.VarRef<policyGraph> | null> {
	let root = $.varRef($.markAsStructValue(new policyGraphNode({validPolicy: $.markAsStructValue($.cloneStructValue((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()))), expectedPolicySet: $.arrayToSlice<__goscript_oid.OID>([$.markAsStructValue($.cloneStructValue((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID())))]), children: new globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean>([]), parents: new globalThis.Map<policyGraphNode | $.VarRef<policyGraphNode> | null, boolean>([])})))
	return new policyGraph({depth: 0, strata: $.arrayToSlice<globalThis.Map<string, policyGraphNode | $.VarRef<policyGraphNode> | null> | null>([new globalThis.Map<string, policyGraphNode | $.VarRef<policyGraphNode> | null>([[$.bytesToString((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()).der), root]])])})
}

export async function policiesValid(chain: $.Slice<__goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null>, opts: VerifyOptions): globalThis.Promise<boolean> {
	// The following code implements the policy verification algorithm as
	// specified in RFC 5280 and updated by RFC 9618. In particular the
	// following sections are replaced by RFC 9618:
	//	* 6.1.2 (a)
	//	* 6.1.3 (d)
	//	* 6.1.3 (e)
	//	* 6.1.3 (f)
	//	* 6.1.4 (b)
	//	* 6.1.5 (g)

	if ($.len(chain) == 1) {
		return true
	}

	// n is the length of the chain minus the trust anchor
	let n = $.len(chain) - 1

	let pg: policyGraph | $.VarRef<policyGraph> | null = await newPolicyGraph()
	let inhibitAnyPolicy: number = 0
	let explicitPolicy: number = 0
	let policyMapping: number = 0
	if (!opts.inhibitAnyPolicy) {
		inhibitAnyPolicy = n + 1
	}
	if (!opts.requireExplicitPolicy) {
		explicitPolicy = n + 1
	}
	if (!opts.inhibitPolicyMapping) {
		policyMapping = n + 1
	}

	let initialUserPolicySet: globalThis.Map<string, boolean> | null = new globalThis.Map<string, boolean>([])
	for (let __goscriptRangeTarget13 = opts.CertificatePolicies, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget13); __rangeIndex++) {
		let p = __goscriptRangeTarget13![__rangeIndex]
		$.mapSet(initialUserPolicySet, $.bytesToString(p.der), true)
	}
	// If the user does not pass any policies, we consider
	// that equivalent to passing anyPolicyOID.
	if ($.len(initialUserPolicySet) == 0) {
		$.mapSet(initialUserPolicySet, $.bytesToString((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()).der), true)
	}

	for (let i = n - 1; i >= 0; i--) {
		let cert: __goscript_x509.Certificate | $.VarRef<__goscript_x509.Certificate> | null = $.arrayIndex(chain!, i)

		let isSelfSigned = bytes.Equal($.pointerValue<__goscript_x509.Certificate>(cert).RawIssuer, $.pointerValue<__goscript_x509.Certificate>(cert).RawSubject)

		// 6.1.3 (e) -- as updated by RFC 9618
		if ($.len($.pointerValue<__goscript_x509.Certificate>(cert).Policies) == 0) {
			pg = null
		}

		// 6.1.3 (f) -- as updated by RFC 9618
		if ((explicitPolicy == 0) && (pg == null)) {
			return false
		}

		if (pg != null) {
			policyGraph.prototype.incrDepth.call(pg)

			let policies: globalThis.Map<string, boolean> | null = new globalThis.Map<string, boolean>([])

			// 6.1.3 (d) (1) -- as updated by RFC 9618
			for (let __goscriptRangeTarget14 = $.pointerValue<__goscript_x509.Certificate>(cert).Policies, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget14); __rangeIndex++) {
				let policy = __goscriptRangeTarget14![__rangeIndex]
				$.mapSet(policies, $.bytesToString(policy.der), true)

				if ($.markAsStructValue($.cloneStructValue(policy)).Equal($.markAsStructValue($.cloneStructValue((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()))))) {
					continue
				}

				// 6.1.3 (d) (1) (i) -- as updated by RFC 9618
				let parents: $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null> = policyGraph.prototype.parentsWithExpected.call(pg, $.markAsStructValue($.cloneStructValue(policy)))
				if ($.len(parents) == 0) {
					// 6.1.3 (d) (1) (ii) -- as updated by RFC 9618
					{
						let anyParent: policyGraphNode | $.VarRef<policyGraphNode> | null = await policyGraph.prototype.parentWithAnyPolicy.call(pg)
						if (anyParent != null) {
							parents = $.arrayToSlice<policyGraphNode | $.VarRef<policyGraphNode> | null>([anyParent])
						}
					}
				}
				if ($.len(parents) > 0) {
					policyGraph.prototype.insert.call(pg, newPolicyGraphNode($.markAsStructValue($.cloneStructValue(policy)), parents))
				}
			}

			// 6.1.3 (d) (2) -- as updated by RFC 9618
			// NOTE: in the check "n-i < n" our i is different from the i in the specification.
			// In the specification chains go from the trust anchor to the leaf, whereas our
			// chains go from the leaf to the trust anchor, so our i's our inverted. Our
			// check here matches the check "i < n" in the specification.
			if ($.mapGet<string, boolean, boolean>(policies, $.bytesToString((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()).der), false)[0] && ((inhibitAnyPolicy > 0) || (((n - i) < n) && isSelfSigned))) {
				let missing: globalThis.Map<string, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>> | null = new globalThis.Map<string, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>>([])
				let leaves: globalThis.Map<string, policyGraphNode | $.VarRef<policyGraphNode> | null> | null = policyGraph.prototype.leaves.call(pg)
				let __goscriptRangeReturn0 = false
				let __goscriptRangeReturnValue0: boolean | undefined
				;await (async () => {
					await policyGraph.prototype.parents.call(pg)!(async (p) => {
						for (let __goscriptRangeTarget15 = $.pointerValue<policyGraphNode>(p).expectedPolicySet, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget15); __rangeIndex++) {
							let expected = __goscriptRangeTarget15![__rangeIndex]
							if ($.mapGet<string, policyGraphNode | $.VarRef<policyGraphNode> | null, policyGraphNode | $.VarRef<policyGraphNode> | null>(leaves, $.bytesToString(expected.der), null)[0] == null) {
								$.mapSet(missing, $.bytesToString(expected.der), $.append($.mapGet<string, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>, $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>>(missing, $.bytesToString(expected.der), null)[0], p, $.appendZeros.nil))
							}
						}
						return true
					})
				})()
				if (__goscriptRangeReturn0) {
					return __goscriptRangeReturnValue0!
				}

				for (const [oidStr, parents] of missing?.entries() ?? []) {
					policyGraph.prototype.insert.call(pg, newPolicyGraphNode($.markAsStructValue(new __goscript_oid.OID({der: $.stringToBytes(oidStr)})), parents))
				}
			}

			// 6.1.3 (d) (3) -- as updated by RFC 9618
			policyGraph.prototype.prune.call(pg)

			if (i != 0) {
				// 6.1.4 (b) -- as updated by RFC 9618
				if ($.len($.pointerValue<__goscript_x509.Certificate>(cert).PolicyMappings) > 0) {
					// collect map of issuer -> []subject
					let mappings: globalThis.Map<string, $.Slice<__goscript_oid.OID>> | null = new globalThis.Map<string, $.Slice<__goscript_oid.OID>>([])

					for (let __goscriptRangeTarget16 = $.pointerValue<__goscript_x509.Certificate>(cert).PolicyMappings, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget16); __rangeIndex++) {
						let mapping = __goscriptRangeTarget16![__rangeIndex]
						if (policyMapping > 0) {
							if ($.markAsStructValue($.cloneStructValue(mapping.IssuerDomainPolicy)).Equal($.markAsStructValue($.cloneStructValue((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID())))) || $.markAsStructValue($.cloneStructValue(mapping.SubjectDomainPolicy)).Equal($.markAsStructValue($.cloneStructValue((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()))))) {
								// Invalid mapping
								return false
							}
							$.mapSet(mappings, $.bytesToString(mapping.IssuerDomainPolicy.der), $.append($.mapGet<string, $.Slice<__goscript_oid.OID>, $.Slice<__goscript_oid.OID>>(mappings, $.bytesToString(mapping.IssuerDomainPolicy.der), null)[0], mapping.SubjectDomainPolicy))
						} else {
							// 6.1.4 (b) (3) (i) -- as updated by RFC 9618
							policyGraph.prototype.deleteLeaf.call(pg, $.markAsStructValue($.cloneStructValue(mapping.IssuerDomainPolicy)))
						}
					}

					// 6.1.4 (b) (3) (ii) -- as updated by RFC 9618
					policyGraph.prototype.prune.call(pg)

					for (const [issuerStr, subjectPolicies] of mappings?.entries() ?? []) {
						// 6.1.4 (b) (1) -- as updated by RFC 9618
						{
							let matching: policyGraphNode | $.VarRef<policyGraphNode> | null = policyGraph.prototype.leafWithPolicy.call(pg, $.markAsStructValue(new __goscript_oid.OID({der: $.stringToBytes(issuerStr)})))
							if (matching != null) {
								$.pointerValue<policyGraphNode>(matching).expectedPolicySet = subjectPolicies
							} else {
								{
									let __goscriptShadow1: policyGraphNode | $.VarRef<policyGraphNode> | null = policyGraph.prototype.leafWithPolicy.call(pg, $.markAsStructValue($.cloneStructValue((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()))))
									if (__goscriptShadow1 != null) {
										// 6.1.4 (b) (2) -- as updated by RFC 9618
										let __goscriptShadow2: policyGraphNode | $.VarRef<policyGraphNode> | null = newPolicyGraphNode($.markAsStructValue(new __goscript_oid.OID({der: $.stringToBytes(issuerStr)})), $.arrayToSlice<policyGraphNode | $.VarRef<policyGraphNode> | null>([__goscriptShadow1]))
										$.pointerValue<policyGraphNode>(__goscriptShadow2).expectedPolicySet = subjectPolicies
										policyGraph.prototype.insert.call(pg, __goscriptShadow2)
									}
								}
							}
						}
					}
				}
			}
		}

		if (i != 0) {
			// 6.1.4 (h)
			if (!isSelfSigned) {
				if (explicitPolicy > 0) {
					explicitPolicy--
				}
				if (policyMapping > 0) {
					policyMapping--
				}
				if (inhibitAnyPolicy > 0) {
					inhibitAnyPolicy--
				}
			}

			// 6.1.4 (i)
			if ((($.pointerValue<__goscript_x509.Certificate>(cert).RequireExplicitPolicy > 0) || $.pointerValue<__goscript_x509.Certificate>(cert).RequireExplicitPolicyZero) && ($.pointerValue<__goscript_x509.Certificate>(cert).RequireExplicitPolicy < explicitPolicy)) {
				explicitPolicy = $.pointerValue<__goscript_x509.Certificate>(cert).RequireExplicitPolicy
			}
			if ((($.pointerValue<__goscript_x509.Certificate>(cert).InhibitPolicyMapping > 0) || $.pointerValue<__goscript_x509.Certificate>(cert).InhibitPolicyMappingZero) && ($.pointerValue<__goscript_x509.Certificate>(cert).InhibitPolicyMapping < policyMapping)) {
				policyMapping = $.pointerValue<__goscript_x509.Certificate>(cert).InhibitPolicyMapping
			}
			// 6.1.4 (j)
			if ((($.pointerValue<__goscript_x509.Certificate>(cert).InhibitAnyPolicy > 0) || $.pointerValue<__goscript_x509.Certificate>(cert).InhibitAnyPolicyZero) && ($.pointerValue<__goscript_x509.Certificate>(cert).InhibitAnyPolicy < inhibitAnyPolicy)) {
				inhibitAnyPolicy = $.pointerValue<__goscript_x509.Certificate>(cert).InhibitAnyPolicy
			}
		}
	}

	// 6.1.5 (a)
	if (explicitPolicy > 0) {
		explicitPolicy--
	}

	// 6.1.5 (b)
	if ($.pointerValue<__goscript_x509.Certificate>($.arrayIndex(chain!, 0)).RequireExplicitPolicyZero) {
		explicitPolicy = 0
	}

	// 6.1.5 (g) (1) -- as updated by RFC 9618
	let validPolicyNodeSet: $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null> = null as $.Slice<policyGraphNode | $.VarRef<policyGraphNode> | null>
	// 6.1.5 (g) (2) -- as updated by RFC 9618
	if (pg != null) {
		validPolicyNodeSet = await policyGraph.prototype.validPolicyNodes.call(pg)
		// 6.1.5 (g) (3) -- as updated by RFC 9618
		{
			let currentAny: policyGraphNode | $.VarRef<policyGraphNode> | null = policyGraph.prototype.leafWithPolicy.call(pg, $.markAsStructValue($.cloneStructValue((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()))))
			if (currentAny != null) {
				validPolicyNodeSet = $.append(validPolicyNodeSet, currentAny, $.appendZeros.nil)
			}
		}
	}

	// 6.1.5 (g) (4) -- as updated by RFC 9618
	let authorityConstrainedPolicySet: globalThis.Map<string, boolean> | null = new globalThis.Map<string, boolean>([])
	for (let __goscriptRangeTarget17 = validPolicyNodeSet, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget17); __rangeIndex++) {
		let n = __goscriptRangeTarget17![__rangeIndex]
		$.mapSet(authorityConstrainedPolicySet, $.bytesToString($.pointerValue<policyGraphNode>(n).validPolicy.der), true)
	}
	// 6.1.5 (g) (5) -- as updated by RFC 9618
	let userConstrainedPolicySet: globalThis.Map<string, boolean> | null = (maps.Clone(authorityConstrainedPolicySet) as globalThis.Map<string, boolean> | null)
	// 6.1.5 (g) (6) -- as updated by RFC 9618
	if (($.len(initialUserPolicySet) != 1) || !$.mapGet<string, boolean, boolean>(initialUserPolicySet, $.bytesToString((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()).der), false)[0]) {
		// 6.1.5 (g) (6) (i) -- as updated by RFC 9618
		for (const [p, __rangeValue] of userConstrainedPolicySet?.entries() ?? []) {
			if (!$.mapGet<string, boolean, boolean>(initialUserPolicySet, p, false)[0]) {
				$.deleteMapEntry(userConstrainedPolicySet, p)
			}
		}
		// 6.1.5 (g) (6) (ii) -- as updated by RFC 9618
		if ($.mapGet<string, boolean, boolean>(authorityConstrainedPolicySet, $.bytesToString((await __goscript_init_anyPolicyOID(), __goscript_get_anyPolicyOID()).der), false)[0]) {
			for (let [policy, __rangeValue] of initialUserPolicySet?.entries() ?? []) {
				$.mapSet(userConstrainedPolicySet, policy, true)
			}
		}
	}

	if ((explicitPolicy == 0) && ($.len(userConstrainedPolicySet) == 0)) {
		return false
	}

	return true
}

await __goscript_init_anyPolicyOID()

// Generated file based on x509.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as os from "@goscript/os/index.js"

import * as filepath from "@goscript/path/filepath/index.js"

import * as strings from "@goscript/strings/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as pkix2 from "@goscript/crypto/x509/pkix/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as iter from "@goscript/iter/index.js"

import * as maps from "@goscript/maps/index.js"

import * as net from "@goscript/net/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as slices from "@goscript/slices/index.js"

import * as time from "@goscript/time/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as ecdsa from "@goscript/crypto/ecdsa/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as elliptic from "@goscript/crypto/elliptic/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as sha1 from "@goscript/crypto/sha1/index.js"

import * as sha256 from "@goscript/crypto/sha256/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"

import * as pem from "@goscript/encoding/pem/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as io from "@goscript/io/index.js"

import * as big from "@goscript/math/big/index.js"

import * as url from "@goscript/net/url/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as unicode from "@goscript/unicode/index.js"

import "@goscript/crypto/sha512/index.js"

import * as cryptobyte from "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"

import * as cryptobyte_asn1 from "@goscript/vendor/golang.org/x/crypto/cryptobyte/asn1/index.js"

import * as hash2 from "@goscript/hash/index.js"

import * as __goscript_cert_pool from "./cert_pool.gs.ts"

import * as __goscript_constraints from "./constraints.gs.ts"

import * as __goscript_oid from "./oid.gs.ts"

import * as __goscript_parser from "./parser.gs.ts"

import * as __goscript_pkcs1 from "./pkcs1.gs.ts"

import * as __goscript_root from "./root.gs.ts"

import * as __goscript_root_unix from "./root_unix.gs.ts"

import * as __goscript_verify from "./verify.gs.ts"

import * as __goscript_x509_string from "./x509_string.gs.ts"
import "@goscript/io/fs/index.js"
import "@goscript/os/index.js"
import "@goscript/path/filepath/index.js"
import "@goscript/strings/index.js"
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
import "@goscript/time/index.js"
import "@goscript/unicode/utf8/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/ecdsa/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/elliptic/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/crypto/sha1/index.js"
import "@goscript/crypto/sha256/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/encoding/pem/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/io/index.js"
import "@goscript/math/big/index.js"
import "@goscript/net/url/index.js"
import "@goscript/strconv/index.js"
import "@goscript/unicode/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/asn1/index.js"
import "@goscript/hash/index.js"
import "./cert_pool.gs.ts"
import "./constraints.gs.ts"
import "./oid.gs.ts"
import "./parser.gs.ts"
import "./pkcs1.gs.ts"
import "./root.gs.ts"
import "./root_unix.gs.ts"
import "./verify.gs.ts"
import "./x509_string.gs.ts"

export type SignatureAlgorithm = number

export type PublicKeyAlgorithm = number

export type KeyUsage = number

export type ExtKeyUsage = number

export type InsecureAlgorithmError = number

export class pkixPublicKey {
	public get Algo(): pkix2.AlgorithmIdentifier {
		return this._fields.Algo.value
	}
	public set Algo(value: pkix2.AlgorithmIdentifier) {
		this._fields.Algo.value = value
	}

	public get BitString(): asn1.BitString {
		return this._fields.BitString.value
	}
	public set BitString(value: asn1.BitString) {
		this._fields.BitString.value = value
	}

	public _fields: {
		Algo: $.VarRef<pkix2.AlgorithmIdentifier>
		BitString: $.VarRef<asn1.BitString>
	}

	constructor(init?: Partial<{Algo?: pkix2.AlgorithmIdentifier, BitString?: asn1.BitString}>) {
		this._fields = {
			Algo: $.varRef(init?.Algo ? $.markAsStructValue($.cloneStructValue(init.Algo)) : $.markAsStructValue(new pkix2.AlgorithmIdentifier())),
			BitString: $.varRef(init?.BitString ? $.markAsStructValue($.cloneStructValue(init.BitString)) : $.markAsStructValue(new asn1.BitString()))
		}
	}

	public clone(): pkixPublicKey {
		const cloned = new pkixPublicKey()
		cloned._fields = {
			Algo: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Algo.value))),
			BitString: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.BitString.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.pkixPublicKey",
		() => new pkixPublicKey(),
		[],
		pkixPublicKey,
		[{ name: "Algo", key: "Algo", type: "pkix.AlgorithmIdentifier", index: [0], offset: 0, exported: true }, { name: "BitString", key: "BitString", type: "asn1.BitString", index: [1], offset: 96, exported: true }]
	)
}

export class validity {
	public get NotBefore(): time.Time {
		return this._fields.NotBefore.value
	}
	public set NotBefore(value: time.Time) {
		this._fields.NotBefore.value = value
	}

	public get NotAfter(): time.Time {
		return this._fields.NotAfter.value
	}
	public set NotAfter(value: time.Time) {
		this._fields.NotAfter.value = value
	}

	public _fields: {
		NotBefore: $.VarRef<time.Time>
		NotAfter: $.VarRef<time.Time>
	}

	constructor(init?: Partial<{NotBefore?: time.Time, NotAfter?: time.Time}>) {
		this._fields = {
			NotBefore: $.varRef(init?.NotBefore ? $.markAsStructValue($.cloneStructValue(init.NotBefore)) : $.markAsStructValue(new time.Time())),
			NotAfter: $.varRef(init?.NotAfter ? $.markAsStructValue($.cloneStructValue(init.NotAfter)) : $.markAsStructValue(new time.Time()))
		}
	}

	public clone(): validity {
		const cloned = new validity()
		cloned._fields = {
			NotBefore: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.NotBefore.value))),
			NotAfter: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.NotAfter.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.validity",
		() => new validity(),
		[],
		validity,
		[{ name: "NotBefore", key: "NotBefore", type: "time.Time", index: [0], offset: 0, exported: true }, { name: "NotAfter", key: "NotAfter", type: "time.Time", index: [1], offset: 24, exported: true }]
	)
}

export class publicKeyInfo {
	public get Raw(): asn1.RawContent {
		return this._fields.Raw.value
	}
	public set Raw(value: asn1.RawContent) {
		this._fields.Raw.value = value
	}

	public get Algorithm(): pkix2.AlgorithmIdentifier {
		return this._fields.Algorithm.value
	}
	public set Algorithm(value: pkix2.AlgorithmIdentifier) {
		this._fields.Algorithm.value = value
	}

	public get PublicKey(): asn1.BitString {
		return this._fields.PublicKey.value
	}
	public set PublicKey(value: asn1.BitString) {
		this._fields.PublicKey.value = value
	}

	public _fields: {
		Raw: $.VarRef<asn1.RawContent>
		Algorithm: $.VarRef<pkix2.AlgorithmIdentifier>
		PublicKey: $.VarRef<asn1.BitString>
	}

	constructor(init?: Partial<{Raw?: asn1.RawContent, Algorithm?: pkix2.AlgorithmIdentifier, PublicKey?: asn1.BitString}>) {
		this._fields = {
			Raw: $.varRef(init?.Raw ?? (null as asn1.RawContent)),
			Algorithm: $.varRef(init?.Algorithm ? $.markAsStructValue($.cloneStructValue(init.Algorithm)) : $.markAsStructValue(new pkix2.AlgorithmIdentifier())),
			PublicKey: $.varRef(init?.PublicKey ? $.markAsStructValue($.cloneStructValue(init.PublicKey)) : $.markAsStructValue(new asn1.BitString()))
		}
	}

	public clone(): publicKeyInfo {
		const cloned = new publicKeyInfo()
		cloned._fields = {
			Raw: $.varRef(this._fields.Raw.value),
			Algorithm: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Algorithm.value))),
			PublicKey: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.PublicKey.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.publicKeyInfo",
		() => new publicKeyInfo(),
		[],
		publicKeyInfo,
		[{ name: "Raw", key: "Raw", type: { kind: $.TypeKind.Slice, typeName: "asn1.RawContent", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "Algorithm", key: "Algorithm", type: "pkix.AlgorithmIdentifier", index: [1], offset: 24, exported: true }, { name: "PublicKey", key: "PublicKey", type: "asn1.BitString", index: [2], offset: 120, exported: true }]
	)
}

export class tbsCertificate {
	public get Raw(): asn1.RawContent {
		return this._fields.Raw.value
	}
	public set Raw(value: asn1.RawContent) {
		this._fields.Raw.value = value
	}

	public get Version(): number {
		return this._fields.Version.value
	}
	public set Version(value: number) {
		this._fields.Version.value = value
	}

	public get SerialNumber(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.SerialNumber.value
	}
	public set SerialNumber(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.SerialNumber.value = value
	}

	public get SignatureAlgorithm(): pkix2.AlgorithmIdentifier {
		return this._fields.SignatureAlgorithm.value
	}
	public set SignatureAlgorithm(value: pkix2.AlgorithmIdentifier) {
		this._fields.SignatureAlgorithm.value = value
	}

	public get Issuer(): asn1.RawValue {
		return this._fields.Issuer.value
	}
	public set Issuer(value: asn1.RawValue) {
		this._fields.Issuer.value = value
	}

	public get Validity(): validity {
		return this._fields.Validity.value
	}
	public set Validity(value: validity) {
		this._fields.Validity.value = value
	}

	public get Subject(): asn1.RawValue {
		return this._fields.Subject.value
	}
	public set Subject(value: asn1.RawValue) {
		this._fields.Subject.value = value
	}

	public get PublicKey(): publicKeyInfo {
		return this._fields.PublicKey.value
	}
	public set PublicKey(value: publicKeyInfo) {
		this._fields.PublicKey.value = value
	}

	public get UniqueId(): asn1.BitString {
		return this._fields.UniqueId.value
	}
	public set UniqueId(value: asn1.BitString) {
		this._fields.UniqueId.value = value
	}

	public get SubjectUniqueId(): asn1.BitString {
		return this._fields.SubjectUniqueId.value
	}
	public set SubjectUniqueId(value: asn1.BitString) {
		this._fields.SubjectUniqueId.value = value
	}

	public get Extensions(): $.Slice<pkix2.Extension> {
		return this._fields.Extensions.value
	}
	public set Extensions(value: $.Slice<pkix2.Extension>) {
		this._fields.Extensions.value = value
	}

	public _fields: {
		Raw: $.VarRef<asn1.RawContent>
		Version: $.VarRef<number>
		SerialNumber: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		SignatureAlgorithm: $.VarRef<pkix2.AlgorithmIdentifier>
		Issuer: $.VarRef<asn1.RawValue>
		Validity: $.VarRef<validity>
		Subject: $.VarRef<asn1.RawValue>
		PublicKey: $.VarRef<publicKeyInfo>
		UniqueId: $.VarRef<asn1.BitString>
		SubjectUniqueId: $.VarRef<asn1.BitString>
		Extensions: $.VarRef<$.Slice<pkix2.Extension>>
	}

	constructor(init?: Partial<{Raw?: asn1.RawContent, Version?: number, SerialNumber?: big.Int | $.VarRef<big.Int> | null, SignatureAlgorithm?: pkix2.AlgorithmIdentifier, Issuer?: asn1.RawValue, Validity?: validity, Subject?: asn1.RawValue, PublicKey?: publicKeyInfo, UniqueId?: asn1.BitString, SubjectUniqueId?: asn1.BitString, Extensions?: $.Slice<pkix2.Extension>}>) {
		this._fields = {
			Raw: $.varRef(init?.Raw ?? (null as asn1.RawContent)),
			Version: $.varRef(init?.Version ?? (0 as number)),
			SerialNumber: $.varRef(init?.SerialNumber ?? (null as big.Int | $.VarRef<big.Int> | null)),
			SignatureAlgorithm: $.varRef(init?.SignatureAlgorithm ? $.markAsStructValue($.cloneStructValue(init.SignatureAlgorithm)) : $.markAsStructValue(new pkix2.AlgorithmIdentifier())),
			Issuer: $.varRef(init?.Issuer ? $.markAsStructValue($.cloneStructValue(init.Issuer)) : $.markAsStructValue(new asn1.RawValue())),
			Validity: $.varRef(init?.Validity ? $.markAsStructValue($.cloneStructValue(init.Validity)) : $.markAsStructValue(new validity())),
			Subject: $.varRef(init?.Subject ? $.markAsStructValue($.cloneStructValue(init.Subject)) : $.markAsStructValue(new asn1.RawValue())),
			PublicKey: $.varRef(init?.PublicKey ? $.markAsStructValue($.cloneStructValue(init.PublicKey)) : $.markAsStructValue(new publicKeyInfo())),
			UniqueId: $.varRef(init?.UniqueId ? $.markAsStructValue($.cloneStructValue(init.UniqueId)) : $.markAsStructValue(new asn1.BitString())),
			SubjectUniqueId: $.varRef(init?.SubjectUniqueId ? $.markAsStructValue($.cloneStructValue(init.SubjectUniqueId)) : $.markAsStructValue(new asn1.BitString())),
			Extensions: $.varRef(init?.Extensions ?? (null as $.Slice<pkix2.Extension>))
		}
	}

	public clone(): tbsCertificate {
		const cloned = new tbsCertificate()
		cloned._fields = {
			Raw: $.varRef(this._fields.Raw.value),
			Version: $.varRef(this._fields.Version.value),
			SerialNumber: $.varRef(this._fields.SerialNumber.value),
			SignatureAlgorithm: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.SignatureAlgorithm.value))),
			Issuer: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Issuer.value))),
			Validity: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Validity.value))),
			Subject: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Subject.value))),
			PublicKey: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.PublicKey.value))),
			UniqueId: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.UniqueId.value))),
			SubjectUniqueId: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.SubjectUniqueId.value))),
			Extensions: $.varRef(this._fields.Extensions.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.tbsCertificate",
		() => new tbsCertificate(),
		[],
		tbsCertificate,
		[{ name: "Raw", key: "Raw", type: { kind: $.TypeKind.Slice, typeName: "asn1.RawContent", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "Version", key: "Version", type: { kind: $.TypeKind.Basic, name: "int" }, tag: "asn1:\"optional,explicit,default:0,tag:0\"", index: [1], offset: 24, exported: true }, { name: "SerialNumber", key: "SerialNumber", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [2], offset: 32, exported: true }, { name: "SignatureAlgorithm", key: "SignatureAlgorithm", type: "pkix.AlgorithmIdentifier", index: [3], offset: 40, exported: true }, { name: "Issuer", key: "Issuer", type: "asn1.RawValue", index: [4], offset: 136, exported: true }, { name: "Validity", key: "Validity", type: "x509.validity", index: [5], offset: 208, exported: true }, { name: "Subject", key: "Subject", type: "asn1.RawValue", index: [6], offset: 256, exported: true }, { name: "PublicKey", key: "PublicKey", type: "x509.publicKeyInfo", index: [7], offset: 328, exported: true }, { name: "UniqueId", key: "UniqueId", type: "asn1.BitString", tag: "asn1:\"optional,tag:1\"", index: [8], offset: 480, exported: true }, { name: "SubjectUniqueId", key: "SubjectUniqueId", type: "asn1.BitString", tag: "asn1:\"optional,tag:2\"", index: [9], offset: 512, exported: true }, { name: "Extensions", key: "Extensions", type: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" }, tag: "asn1:\"omitempty,optional,explicit,tag:3\"", index: [10], offset: 544, exported: true }]
	)
}

export class certificate {
	public get TBSCertificate(): tbsCertificate {
		return this._fields.TBSCertificate.value
	}
	public set TBSCertificate(value: tbsCertificate) {
		this._fields.TBSCertificate.value = value
	}

	public get SignatureAlgorithm(): pkix2.AlgorithmIdentifier {
		return this._fields.SignatureAlgorithm.value
	}
	public set SignatureAlgorithm(value: pkix2.AlgorithmIdentifier) {
		this._fields.SignatureAlgorithm.value = value
	}

	public get SignatureValue(): asn1.BitString {
		return this._fields.SignatureValue.value
	}
	public set SignatureValue(value: asn1.BitString) {
		this._fields.SignatureValue.value = value
	}

	public _fields: {
		TBSCertificate: $.VarRef<tbsCertificate>
		SignatureAlgorithm: $.VarRef<pkix2.AlgorithmIdentifier>
		SignatureValue: $.VarRef<asn1.BitString>
	}

	constructor(init?: Partial<{TBSCertificate?: tbsCertificate, SignatureAlgorithm?: pkix2.AlgorithmIdentifier, SignatureValue?: asn1.BitString}>) {
		this._fields = {
			TBSCertificate: $.varRef(init?.TBSCertificate ? $.markAsStructValue($.cloneStructValue(init.TBSCertificate)) : $.markAsStructValue(new tbsCertificate())),
			SignatureAlgorithm: $.varRef(init?.SignatureAlgorithm ? $.markAsStructValue($.cloneStructValue(init.SignatureAlgorithm)) : $.markAsStructValue(new pkix2.AlgorithmIdentifier())),
			SignatureValue: $.varRef(init?.SignatureValue ? $.markAsStructValue($.cloneStructValue(init.SignatureValue)) : $.markAsStructValue(new asn1.BitString()))
		}
	}

	public clone(): certificate {
		const cloned = new certificate()
		cloned._fields = {
			TBSCertificate: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.TBSCertificate.value))),
			SignatureAlgorithm: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.SignatureAlgorithm.value))),
			SignatureValue: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.SignatureValue.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.certificate",
		() => new certificate(),
		[],
		certificate,
		[{ name: "TBSCertificate", key: "TBSCertificate", type: "x509.tbsCertificate", index: [0], offset: 0, exported: true }, { name: "SignatureAlgorithm", key: "SignatureAlgorithm", type: "pkix.AlgorithmIdentifier", index: [1], offset: 568, exported: true }, { name: "SignatureValue", key: "SignatureValue", type: "asn1.BitString", index: [2], offset: 664, exported: true }]
	)
}

export class dsaAlgorithmParameters {
	public get P(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.P.value
	}
	public set P(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.P.value = value
	}

	public get Q(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Q.value
	}
	public set Q(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Q.value = value
	}

	public get G(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.G.value
	}
	public set G(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.G.value = value
	}

	public _fields: {
		P: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Q: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		G: $.VarRef<big.Int | $.VarRef<big.Int> | null>
	}

	constructor(init?: Partial<{P?: big.Int | $.VarRef<big.Int> | null, Q?: big.Int | $.VarRef<big.Int> | null, G?: big.Int | $.VarRef<big.Int> | null}>) {
		this._fields = {
			P: $.varRef(init?.P ?? (null as big.Int | $.VarRef<big.Int> | null)),
			Q: $.varRef(init?.Q ?? (null as big.Int | $.VarRef<big.Int> | null)),
			G: $.varRef(init?.G ?? (null as big.Int | $.VarRef<big.Int> | null))
		}
	}

	public clone(): dsaAlgorithmParameters {
		const cloned = new dsaAlgorithmParameters()
		cloned._fields = {
			P: $.varRef(this._fields.P.value),
			Q: $.varRef(this._fields.Q.value),
			G: $.varRef(this._fields.G.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.dsaAlgorithmParameters",
		() => new dsaAlgorithmParameters(),
		[],
		dsaAlgorithmParameters,
		[{ name: "P", key: "P", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [0], offset: 0, exported: true }, { name: "Q", key: "Q", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [1], offset: 8, exported: true }, { name: "G", key: "G", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [2], offset: 16, exported: true }]
	)
}

export class authKeyId {
	public get Id(): $.Slice<number> {
		return this._fields.Id.value
	}
	public set Id(value: $.Slice<number>) {
		this._fields.Id.value = value
	}

	public _fields: {
		Id: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{Id?: $.Slice<number>}>) {
		this._fields = {
			Id: $.varRef(init?.Id ?? (null as $.Slice<number>))
		}
	}

	public clone(): authKeyId {
		const cloned = new authKeyId()
		cloned._fields = {
			Id: $.varRef(this._fields.Id.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.authKeyId",
		() => new authKeyId(),
		[],
		authKeyId,
		[{ name: "Id", key: "Id", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, tag: "asn1:\"optional,tag:0\"", index: [0], offset: 0, exported: true }]
	)
}

export class pssParameters {
	// The following three fields are not marked as
	// optional because the default values specify SHA-1,
	// which is no longer suitable for use in signatures.
	public get Hash(): pkix2.AlgorithmIdentifier {
		return this._fields.Hash.value
	}
	public set Hash(value: pkix2.AlgorithmIdentifier) {
		this._fields.Hash.value = value
	}

	public get MGF(): pkix2.AlgorithmIdentifier {
		return this._fields.MGF.value
	}
	public set MGF(value: pkix2.AlgorithmIdentifier) {
		this._fields.MGF.value = value
	}

	public get SaltLength(): number {
		return this._fields.SaltLength.value
	}
	public set SaltLength(value: number) {
		this._fields.SaltLength.value = value
	}

	public get TrailerField(): number {
		return this._fields.TrailerField.value
	}
	public set TrailerField(value: number) {
		this._fields.TrailerField.value = value
	}

	public _fields: {
		Hash: $.VarRef<pkix2.AlgorithmIdentifier>
		MGF: $.VarRef<pkix2.AlgorithmIdentifier>
		SaltLength: $.VarRef<number>
		TrailerField: $.VarRef<number>
	}

	constructor(init?: Partial<{Hash?: pkix2.AlgorithmIdentifier, MGF?: pkix2.AlgorithmIdentifier, SaltLength?: number, TrailerField?: number}>) {
		this._fields = {
			Hash: $.varRef(init?.Hash ? $.markAsStructValue($.cloneStructValue(init.Hash)) : $.markAsStructValue(new pkix2.AlgorithmIdentifier())),
			MGF: $.varRef(init?.MGF ? $.markAsStructValue($.cloneStructValue(init.MGF)) : $.markAsStructValue(new pkix2.AlgorithmIdentifier())),
			SaltLength: $.varRef(init?.SaltLength ?? (0 as number)),
			TrailerField: $.varRef(init?.TrailerField ?? (0 as number))
		}
	}

	public clone(): pssParameters {
		const cloned = new pssParameters()
		cloned._fields = {
			Hash: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Hash.value))),
			MGF: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.MGF.value))),
			SaltLength: $.varRef(this._fields.SaltLength.value),
			TrailerField: $.varRef(this._fields.TrailerField.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.pssParameters",
		() => new pssParameters(),
		[],
		pssParameters,
		[{ name: "Hash", key: "Hash", type: "pkix.AlgorithmIdentifier", tag: "asn1:\"explicit,tag:0\"", index: [0], offset: 0, exported: true }, { name: "MGF", key: "MGF", type: "pkix.AlgorithmIdentifier", tag: "asn1:\"explicit,tag:1\"", index: [1], offset: 96, exported: true }, { name: "SaltLength", key: "SaltLength", type: { kind: $.TypeKind.Basic, name: "int" }, tag: "asn1:\"explicit,tag:2\"", index: [2], offset: 192, exported: true }, { name: "TrailerField", key: "TrailerField", type: { kind: $.TypeKind.Basic, name: "int" }, tag: "asn1:\"optional,explicit,tag:3,default:1\"", index: [3], offset: 200, exported: true }]
	)
}

export class Certificate {
	public get Raw(): $.Slice<number> {
		return this._fields.Raw.value
	}
	public set Raw(value: $.Slice<number>) {
		this._fields.Raw.value = value
	}

	public get RawTBSCertificate(): $.Slice<number> {
		return this._fields.RawTBSCertificate.value
	}
	public set RawTBSCertificate(value: $.Slice<number>) {
		this._fields.RawTBSCertificate.value = value
	}

	public get RawSubjectPublicKeyInfo(): $.Slice<number> {
		return this._fields.RawSubjectPublicKeyInfo.value
	}
	public set RawSubjectPublicKeyInfo(value: $.Slice<number>) {
		this._fields.RawSubjectPublicKeyInfo.value = value
	}

	public get RawSubject(): $.Slice<number> {
		return this._fields.RawSubject.value
	}
	public set RawSubject(value: $.Slice<number>) {
		this._fields.RawSubject.value = value
	}

	public get RawIssuer(): $.Slice<number> {
		return this._fields.RawIssuer.value
	}
	public set RawIssuer(value: $.Slice<number>) {
		this._fields.RawIssuer.value = value
	}

	public get Signature(): $.Slice<number> {
		return this._fields.Signature.value
	}
	public set Signature(value: $.Slice<number>) {
		this._fields.Signature.value = value
	}

	public get SignatureAlgorithm(): SignatureAlgorithm {
		return this._fields.SignatureAlgorithm.value
	}
	public set SignatureAlgorithm(value: SignatureAlgorithm) {
		this._fields.SignatureAlgorithm.value = value
	}

	public get PublicKeyAlgorithm(): PublicKeyAlgorithm {
		return this._fields.PublicKeyAlgorithm.value
	}
	public set PublicKeyAlgorithm(value: PublicKeyAlgorithm) {
		this._fields.PublicKeyAlgorithm.value = value
	}

	public get PublicKey(): any {
		return this._fields.PublicKey.value
	}
	public set PublicKey(value: any) {
		this._fields.PublicKey.value = value
	}

	public get Version(): number {
		return this._fields.Version.value
	}
	public set Version(value: number) {
		this._fields.Version.value = value
	}

	public get SerialNumber(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.SerialNumber.value
	}
	public set SerialNumber(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.SerialNumber.value = value
	}

	public get Issuer(): pkix2.Name {
		return this._fields.Issuer.value
	}
	public set Issuer(value: pkix2.Name) {
		this._fields.Issuer.value = value
	}

	public get Subject(): pkix2.Name {
		return this._fields.Subject.value
	}
	public set Subject(value: pkix2.Name) {
		this._fields.Subject.value = value
	}

	public get NotBefore(): time.Time {
		return this._fields.NotBefore.value
	}
	public set NotBefore(value: time.Time) {
		this._fields.NotBefore.value = value
	}

	public get NotAfter(): time.Time {
		return this._fields.NotAfter.value
	}
	public set NotAfter(value: time.Time) {
		this._fields.NotAfter.value = value
	}

	public get KeyUsage(): KeyUsage {
		return this._fields.KeyUsage.value
	}
	public set KeyUsage(value: KeyUsage) {
		this._fields.KeyUsage.value = value
	}

	// Extensions contains raw X.509 extensions. When parsing certificates,
	// this can be used to extract non-critical extensions that are not
	// parsed by this package. When marshaling certificates, the Extensions
	// field is ignored, see ExtraExtensions.
	public get Extensions(): $.Slice<pkix2.Extension> {
		return this._fields.Extensions.value
	}
	public set Extensions(value: $.Slice<pkix2.Extension>) {
		this._fields.Extensions.value = value
	}

	// ExtraExtensions contains extensions to be copied, raw, into any
	// marshaled certificates. Values override any extensions that would
	// otherwise be produced based on the other fields. The ExtraExtensions
	// field is not populated when parsing certificates, see Extensions.
	public get ExtraExtensions(): $.Slice<pkix2.Extension> {
		return this._fields.ExtraExtensions.value
	}
	public set ExtraExtensions(value: $.Slice<pkix2.Extension>) {
		this._fields.ExtraExtensions.value = value
	}

	// UnhandledCriticalExtensions contains a list of extension IDs that
	// were not (fully) processed when parsing. Verify will fail if this
	// slice is non-empty, unless verification is delegated to an OS
	// library which understands all the critical extensions.
	//
	// Users can access these extensions using Extensions and can remove
	// elements from this slice if they believe that they have been
	// handled.
	public get UnhandledCriticalExtensions(): $.Slice<asn1.ObjectIdentifier> {
		return this._fields.UnhandledCriticalExtensions.value
	}
	public set UnhandledCriticalExtensions(value: $.Slice<asn1.ObjectIdentifier>) {
		this._fields.UnhandledCriticalExtensions.value = value
	}

	public get ExtKeyUsage(): $.Slice<ExtKeyUsage> {
		return this._fields.ExtKeyUsage.value
	}
	public set ExtKeyUsage(value: $.Slice<ExtKeyUsage>) {
		this._fields.ExtKeyUsage.value = value
	}

	public get UnknownExtKeyUsage(): $.Slice<asn1.ObjectIdentifier> {
		return this._fields.UnknownExtKeyUsage.value
	}
	public set UnknownExtKeyUsage(value: $.Slice<asn1.ObjectIdentifier>) {
		this._fields.UnknownExtKeyUsage.value = value
	}

	// BasicConstraintsValid indicates whether IsCA, MaxPathLen,
	// and MaxPathLenZero are valid.
	public get BasicConstraintsValid(): boolean {
		return this._fields.BasicConstraintsValid.value
	}
	public set BasicConstraintsValid(value: boolean) {
		this._fields.BasicConstraintsValid.value = value
	}

	public get IsCA(): boolean {
		return this._fields.IsCA.value
	}
	public set IsCA(value: boolean) {
		this._fields.IsCA.value = value
	}

	// MaxPathLen and MaxPathLenZero indicate the presence and
	// value of the BasicConstraints' "pathLenConstraint".
	//
	// When parsing a certificate, a positive non-zero MaxPathLen
	// means that the field was specified, -1 means it was unset,
	// and MaxPathLenZero being true mean that the field was
	// explicitly set to zero. The case of MaxPathLen==0 with MaxPathLenZero==false
	// should be treated equivalent to -1 (unset).
	//
	// When generating a certificate, an unset pathLenConstraint
	// can be requested with either MaxPathLen == -1 or using the
	// zero value for both MaxPathLen and MaxPathLenZero.
	public get MaxPathLen(): number {
		return this._fields.MaxPathLen.value
	}
	public set MaxPathLen(value: number) {
		this._fields.MaxPathLen.value = value
	}

	// MaxPathLenZero indicates that BasicConstraintsValid==true
	// and MaxPathLen==0 should be interpreted as an actual
	// maximum path length of zero. Otherwise, that combination is
	// interpreted as MaxPathLen not being set.
	public get MaxPathLenZero(): boolean {
		return this._fields.MaxPathLenZero.value
	}
	public set MaxPathLenZero(value: boolean) {
		this._fields.MaxPathLenZero.value = value
	}

	public get SubjectKeyId(): $.Slice<number> {
		return this._fields.SubjectKeyId.value
	}
	public set SubjectKeyId(value: $.Slice<number>) {
		this._fields.SubjectKeyId.value = value
	}

	public get AuthorityKeyId(): $.Slice<number> {
		return this._fields.AuthorityKeyId.value
	}
	public set AuthorityKeyId(value: $.Slice<number>) {
		this._fields.AuthorityKeyId.value = value
	}

	// RFC 5280, 4.2.2.1 (Authority Information Access)
	public get OCSPServer(): $.Slice<string> {
		return this._fields.OCSPServer.value
	}
	public set OCSPServer(value: $.Slice<string>) {
		this._fields.OCSPServer.value = value
	}

	public get IssuingCertificateURL(): $.Slice<string> {
		return this._fields.IssuingCertificateURL.value
	}
	public set IssuingCertificateURL(value: $.Slice<string>) {
		this._fields.IssuingCertificateURL.value = value
	}

	// Subject Alternate Name values. (Note that these values may not be valid
	// if invalid values were contained within a parsed certificate. For
	// example, an element of DNSNames may not be a valid DNS domain name.)
	public get DNSNames(): $.Slice<string> {
		return this._fields.DNSNames.value
	}
	public set DNSNames(value: $.Slice<string>) {
		this._fields.DNSNames.value = value
	}

	public get EmailAddresses(): $.Slice<string> {
		return this._fields.EmailAddresses.value
	}
	public set EmailAddresses(value: $.Slice<string>) {
		this._fields.EmailAddresses.value = value
	}

	public get IPAddresses(): $.Slice<net.IP> {
		return this._fields.IPAddresses.value
	}
	public set IPAddresses(value: $.Slice<net.IP>) {
		this._fields.IPAddresses.value = value
	}

	public get URIs(): $.Slice<url.URL | $.VarRef<url.URL> | null> {
		return this._fields.URIs.value
	}
	public set URIs(value: $.Slice<url.URL | $.VarRef<url.URL> | null>) {
		this._fields.URIs.value = value
	}

	// Name constraints
	public get PermittedDNSDomainsCritical(): boolean {
		return this._fields.PermittedDNSDomainsCritical.value
	}
	public set PermittedDNSDomainsCritical(value: boolean) {
		this._fields.PermittedDNSDomainsCritical.value = value
	}

	public get PermittedDNSDomains(): $.Slice<string> {
		return this._fields.PermittedDNSDomains.value
	}
	public set PermittedDNSDomains(value: $.Slice<string>) {
		this._fields.PermittedDNSDomains.value = value
	}

	public get ExcludedDNSDomains(): $.Slice<string> {
		return this._fields.ExcludedDNSDomains.value
	}
	public set ExcludedDNSDomains(value: $.Slice<string>) {
		this._fields.ExcludedDNSDomains.value = value
	}

	public get PermittedIPRanges(): $.Slice<net.IPNet | $.VarRef<net.IPNet> | null> {
		return this._fields.PermittedIPRanges.value
	}
	public set PermittedIPRanges(value: $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>) {
		this._fields.PermittedIPRanges.value = value
	}

	public get ExcludedIPRanges(): $.Slice<net.IPNet | $.VarRef<net.IPNet> | null> {
		return this._fields.ExcludedIPRanges.value
	}
	public set ExcludedIPRanges(value: $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>) {
		this._fields.ExcludedIPRanges.value = value
	}

	public get PermittedEmailAddresses(): $.Slice<string> {
		return this._fields.PermittedEmailAddresses.value
	}
	public set PermittedEmailAddresses(value: $.Slice<string>) {
		this._fields.PermittedEmailAddresses.value = value
	}

	public get ExcludedEmailAddresses(): $.Slice<string> {
		return this._fields.ExcludedEmailAddresses.value
	}
	public set ExcludedEmailAddresses(value: $.Slice<string>) {
		this._fields.ExcludedEmailAddresses.value = value
	}

	public get PermittedURIDomains(): $.Slice<string> {
		return this._fields.PermittedURIDomains.value
	}
	public set PermittedURIDomains(value: $.Slice<string>) {
		this._fields.PermittedURIDomains.value = value
	}

	public get ExcludedURIDomains(): $.Slice<string> {
		return this._fields.ExcludedURIDomains.value
	}
	public set ExcludedURIDomains(value: $.Slice<string>) {
		this._fields.ExcludedURIDomains.value = value
	}

	// CRL Distribution Points
	public get CRLDistributionPoints(): $.Slice<string> {
		return this._fields.CRLDistributionPoints.value
	}
	public set CRLDistributionPoints(value: $.Slice<string>) {
		this._fields.CRLDistributionPoints.value = value
	}

	// PolicyIdentifiers contains asn1.ObjectIdentifiers, the components
	// of which are limited to int32. If a certificate contains a policy which
	// cannot be represented by asn1.ObjectIdentifier, it will not be included in
	// PolicyIdentifiers, but will be present in Policies, which contains all parsed
	// policy OIDs.
	// See CreateCertificate for context about how this field and the Policies field
	// interact.
	public get PolicyIdentifiers(): $.Slice<asn1.ObjectIdentifier> {
		return this._fields.PolicyIdentifiers.value
	}
	public set PolicyIdentifiers(value: $.Slice<asn1.ObjectIdentifier>) {
		this._fields.PolicyIdentifiers.value = value
	}

	// Policies contains all policy identifiers included in the certificate.
	// See CreateCertificate for context about how this field and the PolicyIdentifiers field
	// interact.
	// In Go 1.22, encoding/gob cannot handle and ignores this field.
	public get Policies(): $.Slice<__goscript_oid.OID> {
		return this._fields.Policies.value
	}
	public set Policies(value: $.Slice<__goscript_oid.OID>) {
		this._fields.Policies.value = value
	}

	// InhibitAnyPolicy and InhibitAnyPolicyZero indicate the presence and value
	// of the inhibitAnyPolicy extension.
	//
	// The value of InhibitAnyPolicy indicates the number of additional
	// certificates in the path after this certificate that may use the
	// anyPolicy policy OID to indicate a match with any other policy.
	//
	// When parsing a certificate, a positive non-zero InhibitAnyPolicy means
	// that the field was specified, -1 means it was unset, and
	// InhibitAnyPolicyZero being true mean that the field was explicitly set to
	// zero. The case of InhibitAnyPolicy==0 with InhibitAnyPolicyZero==false
	// should be treated equivalent to -1 (unset).
	public get InhibitAnyPolicy(): number {
		return this._fields.InhibitAnyPolicy.value
	}
	public set InhibitAnyPolicy(value: number) {
		this._fields.InhibitAnyPolicy.value = value
	}

	// InhibitAnyPolicyZero indicates that InhibitAnyPolicy==0 should be
	// interpreted as an actual maximum path length of zero. Otherwise, that
	// combination is interpreted as InhibitAnyPolicy not being set.
	public get InhibitAnyPolicyZero(): boolean {
		return this._fields.InhibitAnyPolicyZero.value
	}
	public set InhibitAnyPolicyZero(value: boolean) {
		this._fields.InhibitAnyPolicyZero.value = value
	}

	// InhibitPolicyMapping and InhibitPolicyMappingZero indicate the presence
	// and value of the inhibitPolicyMapping field of the policyConstraints
	// extension.
	//
	// The value of InhibitPolicyMapping indicates the number of additional
	// certificates in the path after this certificate that may use policy
	// mapping.
	//
	// When parsing a certificate, a positive non-zero InhibitPolicyMapping
	// means that the field was specified, -1 means it was unset, and
	// InhibitPolicyMappingZero being true mean that the field was explicitly
	// set to zero. The case of InhibitPolicyMapping==0 with
	// InhibitPolicyMappingZero==false should be treated equivalent to -1
	// (unset).
	public get InhibitPolicyMapping(): number {
		return this._fields.InhibitPolicyMapping.value
	}
	public set InhibitPolicyMapping(value: number) {
		this._fields.InhibitPolicyMapping.value = value
	}

	// InhibitPolicyMappingZero indicates that InhibitPolicyMapping==0 should be
	// interpreted as an actual maximum path length of zero. Otherwise, that
	// combination is interpreted as InhibitAnyPolicy not being set.
	public get InhibitPolicyMappingZero(): boolean {
		return this._fields.InhibitPolicyMappingZero.value
	}
	public set InhibitPolicyMappingZero(value: boolean) {
		this._fields.InhibitPolicyMappingZero.value = value
	}

	// RequireExplicitPolicy and RequireExplicitPolicyZero indicate the presence
	// and value of the requireExplicitPolicy field of the policyConstraints
	// extension.
	//
	// The value of RequireExplicitPolicy indicates the number of additional
	// certificates in the path after this certificate before an explicit policy
	// is required for the rest of the path. When an explicit policy is required,
	// each subsequent certificate in the path must contain a required policy OID,
	// or a policy OID which has been declared as equivalent through the policy
	// mapping extension.
	//
	// When parsing a certificate, a positive non-zero RequireExplicitPolicy
	// means that the field was specified, -1 means it was unset, and
	// RequireExplicitPolicyZero being true mean that the field was explicitly
	// set to zero. The case of RequireExplicitPolicy==0 with
	// RequireExplicitPolicyZero==false should be treated equivalent to -1
	// (unset).
	public get RequireExplicitPolicy(): number {
		return this._fields.RequireExplicitPolicy.value
	}
	public set RequireExplicitPolicy(value: number) {
		this._fields.RequireExplicitPolicy.value = value
	}

	// RequireExplicitPolicyZero indicates that RequireExplicitPolicy==0 should be
	// interpreted as an actual maximum path length of zero. Otherwise, that
	// combination is interpreted as InhibitAnyPolicy not being set.
	public get RequireExplicitPolicyZero(): boolean {
		return this._fields.RequireExplicitPolicyZero.value
	}
	public set RequireExplicitPolicyZero(value: boolean) {
		this._fields.RequireExplicitPolicyZero.value = value
	}

	// PolicyMappings contains a list of policy mappings included in the certificate.
	public get PolicyMappings(): $.Slice<PolicyMapping> {
		return this._fields.PolicyMappings.value
	}
	public set PolicyMappings(value: $.Slice<PolicyMapping>) {
		this._fields.PolicyMappings.value = value
	}

	public _fields: {
		Raw: $.VarRef<$.Slice<number>>
		RawTBSCertificate: $.VarRef<$.Slice<number>>
		RawSubjectPublicKeyInfo: $.VarRef<$.Slice<number>>
		RawSubject: $.VarRef<$.Slice<number>>
		RawIssuer: $.VarRef<$.Slice<number>>
		Signature: $.VarRef<$.Slice<number>>
		SignatureAlgorithm: $.VarRef<SignatureAlgorithm>
		PublicKeyAlgorithm: $.VarRef<PublicKeyAlgorithm>
		PublicKey: $.VarRef<any>
		Version: $.VarRef<number>
		SerialNumber: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Issuer: $.VarRef<pkix2.Name>
		Subject: $.VarRef<pkix2.Name>
		NotBefore: $.VarRef<time.Time>
		NotAfter: $.VarRef<time.Time>
		KeyUsage: $.VarRef<KeyUsage>
		Extensions: $.VarRef<$.Slice<pkix2.Extension>>
		ExtraExtensions: $.VarRef<$.Slice<pkix2.Extension>>
		UnhandledCriticalExtensions: $.VarRef<$.Slice<asn1.ObjectIdentifier>>
		ExtKeyUsage: $.VarRef<$.Slice<ExtKeyUsage>>
		UnknownExtKeyUsage: $.VarRef<$.Slice<asn1.ObjectIdentifier>>
		BasicConstraintsValid: $.VarRef<boolean>
		IsCA: $.VarRef<boolean>
		MaxPathLen: $.VarRef<number>
		MaxPathLenZero: $.VarRef<boolean>
		SubjectKeyId: $.VarRef<$.Slice<number>>
		AuthorityKeyId: $.VarRef<$.Slice<number>>
		OCSPServer: $.VarRef<$.Slice<string>>
		IssuingCertificateURL: $.VarRef<$.Slice<string>>
		DNSNames: $.VarRef<$.Slice<string>>
		EmailAddresses: $.VarRef<$.Slice<string>>
		IPAddresses: $.VarRef<$.Slice<net.IP>>
		URIs: $.VarRef<$.Slice<url.URL | $.VarRef<url.URL> | null>>
		PermittedDNSDomainsCritical: $.VarRef<boolean>
		PermittedDNSDomains: $.VarRef<$.Slice<string>>
		ExcludedDNSDomains: $.VarRef<$.Slice<string>>
		PermittedIPRanges: $.VarRef<$.Slice<net.IPNet | $.VarRef<net.IPNet> | null>>
		ExcludedIPRanges: $.VarRef<$.Slice<net.IPNet | $.VarRef<net.IPNet> | null>>
		PermittedEmailAddresses: $.VarRef<$.Slice<string>>
		ExcludedEmailAddresses: $.VarRef<$.Slice<string>>
		PermittedURIDomains: $.VarRef<$.Slice<string>>
		ExcludedURIDomains: $.VarRef<$.Slice<string>>
		CRLDistributionPoints: $.VarRef<$.Slice<string>>
		PolicyIdentifiers: $.VarRef<$.Slice<asn1.ObjectIdentifier>>
		Policies: $.VarRef<$.Slice<__goscript_oid.OID>>
		InhibitAnyPolicy: $.VarRef<number>
		InhibitAnyPolicyZero: $.VarRef<boolean>
		InhibitPolicyMapping: $.VarRef<number>
		InhibitPolicyMappingZero: $.VarRef<boolean>
		RequireExplicitPolicy: $.VarRef<number>
		RequireExplicitPolicyZero: $.VarRef<boolean>
		PolicyMappings: $.VarRef<$.Slice<PolicyMapping>>
	}

	constructor(init?: Partial<{Raw?: $.Slice<number>, RawTBSCertificate?: $.Slice<number>, RawSubjectPublicKeyInfo?: $.Slice<number>, RawSubject?: $.Slice<number>, RawIssuer?: $.Slice<number>, Signature?: $.Slice<number>, SignatureAlgorithm?: SignatureAlgorithm, PublicKeyAlgorithm?: PublicKeyAlgorithm, PublicKey?: any, Version?: number, SerialNumber?: big.Int | $.VarRef<big.Int> | null, Issuer?: pkix2.Name, Subject?: pkix2.Name, NotBefore?: time.Time, NotAfter?: time.Time, KeyUsage?: KeyUsage, Extensions?: $.Slice<pkix2.Extension>, ExtraExtensions?: $.Slice<pkix2.Extension>, UnhandledCriticalExtensions?: $.Slice<asn1.ObjectIdentifier>, ExtKeyUsage?: $.Slice<ExtKeyUsage>, UnknownExtKeyUsage?: $.Slice<asn1.ObjectIdentifier>, BasicConstraintsValid?: boolean, IsCA?: boolean, MaxPathLen?: number, MaxPathLenZero?: boolean, SubjectKeyId?: $.Slice<number>, AuthorityKeyId?: $.Slice<number>, OCSPServer?: $.Slice<string>, IssuingCertificateURL?: $.Slice<string>, DNSNames?: $.Slice<string>, EmailAddresses?: $.Slice<string>, IPAddresses?: $.Slice<net.IP>, URIs?: $.Slice<url.URL | $.VarRef<url.URL> | null>, PermittedDNSDomainsCritical?: boolean, PermittedDNSDomains?: $.Slice<string>, ExcludedDNSDomains?: $.Slice<string>, PermittedIPRanges?: $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>, ExcludedIPRanges?: $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>, PermittedEmailAddresses?: $.Slice<string>, ExcludedEmailAddresses?: $.Slice<string>, PermittedURIDomains?: $.Slice<string>, ExcludedURIDomains?: $.Slice<string>, CRLDistributionPoints?: $.Slice<string>, PolicyIdentifiers?: $.Slice<asn1.ObjectIdentifier>, Policies?: $.Slice<__goscript_oid.OID>, InhibitAnyPolicy?: number, InhibitAnyPolicyZero?: boolean, InhibitPolicyMapping?: number, InhibitPolicyMappingZero?: boolean, RequireExplicitPolicy?: number, RequireExplicitPolicyZero?: boolean, PolicyMappings?: $.Slice<PolicyMapping>}>) {
		this._fields = {
			Raw: $.varRef(init?.Raw ?? (null as $.Slice<number>)),
			RawTBSCertificate: $.varRef(init?.RawTBSCertificate ?? (null as $.Slice<number>)),
			RawSubjectPublicKeyInfo: $.varRef(init?.RawSubjectPublicKeyInfo ?? (null as $.Slice<number>)),
			RawSubject: $.varRef(init?.RawSubject ?? (null as $.Slice<number>)),
			RawIssuer: $.varRef(init?.RawIssuer ?? (null as $.Slice<number>)),
			Signature: $.varRef(init?.Signature ?? (null as $.Slice<number>)),
			SignatureAlgorithm: $.varRef(init?.SignatureAlgorithm ?? (0 as SignatureAlgorithm)),
			PublicKeyAlgorithm: $.varRef(init?.PublicKeyAlgorithm ?? (0 as PublicKeyAlgorithm)),
			PublicKey: $.varRef(init?.PublicKey ?? (null as any)),
			Version: $.varRef(init?.Version ?? (0 as number)),
			SerialNumber: $.varRef(init?.SerialNumber ?? (null as big.Int | $.VarRef<big.Int> | null)),
			Issuer: $.varRef(init?.Issuer ? $.markAsStructValue($.cloneStructValue(init.Issuer)) : $.markAsStructValue(new pkix2.Name())),
			Subject: $.varRef(init?.Subject ? $.markAsStructValue($.cloneStructValue(init.Subject)) : $.markAsStructValue(new pkix2.Name())),
			NotBefore: $.varRef(init?.NotBefore ? $.markAsStructValue($.cloneStructValue(init.NotBefore)) : $.markAsStructValue(new time.Time())),
			NotAfter: $.varRef(init?.NotAfter ? $.markAsStructValue($.cloneStructValue(init.NotAfter)) : $.markAsStructValue(new time.Time())),
			KeyUsage: $.varRef(init?.KeyUsage ?? (0 as KeyUsage)),
			Extensions: $.varRef(init?.Extensions ?? (null as $.Slice<pkix2.Extension>)),
			ExtraExtensions: $.varRef(init?.ExtraExtensions ?? (null as $.Slice<pkix2.Extension>)),
			UnhandledCriticalExtensions: $.varRef(init?.UnhandledCriticalExtensions ?? (null as $.Slice<asn1.ObjectIdentifier>)),
			ExtKeyUsage: $.varRef(init?.ExtKeyUsage ?? (null as $.Slice<ExtKeyUsage>)),
			UnknownExtKeyUsage: $.varRef(init?.UnknownExtKeyUsage ?? (null as $.Slice<asn1.ObjectIdentifier>)),
			BasicConstraintsValid: $.varRef(init?.BasicConstraintsValid ?? (false as boolean)),
			IsCA: $.varRef(init?.IsCA ?? (false as boolean)),
			MaxPathLen: $.varRef(init?.MaxPathLen ?? (0 as number)),
			MaxPathLenZero: $.varRef(init?.MaxPathLenZero ?? (false as boolean)),
			SubjectKeyId: $.varRef(init?.SubjectKeyId ?? (null as $.Slice<number>)),
			AuthorityKeyId: $.varRef(init?.AuthorityKeyId ?? (null as $.Slice<number>)),
			OCSPServer: $.varRef(init?.OCSPServer ?? (null as $.Slice<string>)),
			IssuingCertificateURL: $.varRef(init?.IssuingCertificateURL ?? (null as $.Slice<string>)),
			DNSNames: $.varRef(init?.DNSNames ?? (null as $.Slice<string>)),
			EmailAddresses: $.varRef(init?.EmailAddresses ?? (null as $.Slice<string>)),
			IPAddresses: $.varRef(init?.IPAddresses ?? (null as $.Slice<net.IP>)),
			URIs: $.varRef(init?.URIs ?? (null as $.Slice<url.URL | $.VarRef<url.URL> | null>)),
			PermittedDNSDomainsCritical: $.varRef(init?.PermittedDNSDomainsCritical ?? (false as boolean)),
			PermittedDNSDomains: $.varRef(init?.PermittedDNSDomains ?? (null as $.Slice<string>)),
			ExcludedDNSDomains: $.varRef(init?.ExcludedDNSDomains ?? (null as $.Slice<string>)),
			PermittedIPRanges: $.varRef(init?.PermittedIPRanges ?? (null as $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>)),
			ExcludedIPRanges: $.varRef(init?.ExcludedIPRanges ?? (null as $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>)),
			PermittedEmailAddresses: $.varRef(init?.PermittedEmailAddresses ?? (null as $.Slice<string>)),
			ExcludedEmailAddresses: $.varRef(init?.ExcludedEmailAddresses ?? (null as $.Slice<string>)),
			PermittedURIDomains: $.varRef(init?.PermittedURIDomains ?? (null as $.Slice<string>)),
			ExcludedURIDomains: $.varRef(init?.ExcludedURIDomains ?? (null as $.Slice<string>)),
			CRLDistributionPoints: $.varRef(init?.CRLDistributionPoints ?? (null as $.Slice<string>)),
			PolicyIdentifiers: $.varRef(init?.PolicyIdentifiers ?? (null as $.Slice<asn1.ObjectIdentifier>)),
			Policies: $.varRef(init?.Policies ?? (null as $.Slice<__goscript_oid.OID>)),
			InhibitAnyPolicy: $.varRef(init?.InhibitAnyPolicy ?? (0 as number)),
			InhibitAnyPolicyZero: $.varRef(init?.InhibitAnyPolicyZero ?? (false as boolean)),
			InhibitPolicyMapping: $.varRef(init?.InhibitPolicyMapping ?? (0 as number)),
			InhibitPolicyMappingZero: $.varRef(init?.InhibitPolicyMappingZero ?? (false as boolean)),
			RequireExplicitPolicy: $.varRef(init?.RequireExplicitPolicy ?? (0 as number)),
			RequireExplicitPolicyZero: $.varRef(init?.RequireExplicitPolicyZero ?? (false as boolean)),
			PolicyMappings: $.varRef(init?.PolicyMappings ?? (null as $.Slice<PolicyMapping>))
		}
	}

	public clone(): Certificate {
		const cloned = new Certificate()
		cloned._fields = {
			Raw: $.varRef(this._fields.Raw.value),
			RawTBSCertificate: $.varRef(this._fields.RawTBSCertificate.value),
			RawSubjectPublicKeyInfo: $.varRef(this._fields.RawSubjectPublicKeyInfo.value),
			RawSubject: $.varRef(this._fields.RawSubject.value),
			RawIssuer: $.varRef(this._fields.RawIssuer.value),
			Signature: $.varRef(this._fields.Signature.value),
			SignatureAlgorithm: $.varRef(this._fields.SignatureAlgorithm.value),
			PublicKeyAlgorithm: $.varRef(this._fields.PublicKeyAlgorithm.value),
			PublicKey: $.varRef(this._fields.PublicKey.value),
			Version: $.varRef(this._fields.Version.value),
			SerialNumber: $.varRef(this._fields.SerialNumber.value),
			Issuer: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Issuer.value))),
			Subject: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Subject.value))),
			NotBefore: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.NotBefore.value))),
			NotAfter: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.NotAfter.value))),
			KeyUsage: $.varRef(this._fields.KeyUsage.value),
			Extensions: $.varRef(this._fields.Extensions.value),
			ExtraExtensions: $.varRef(this._fields.ExtraExtensions.value),
			UnhandledCriticalExtensions: $.varRef(this._fields.UnhandledCriticalExtensions.value),
			ExtKeyUsage: $.varRef(this._fields.ExtKeyUsage.value),
			UnknownExtKeyUsage: $.varRef(this._fields.UnknownExtKeyUsage.value),
			BasicConstraintsValid: $.varRef(this._fields.BasicConstraintsValid.value),
			IsCA: $.varRef(this._fields.IsCA.value),
			MaxPathLen: $.varRef(this._fields.MaxPathLen.value),
			MaxPathLenZero: $.varRef(this._fields.MaxPathLenZero.value),
			SubjectKeyId: $.varRef(this._fields.SubjectKeyId.value),
			AuthorityKeyId: $.varRef(this._fields.AuthorityKeyId.value),
			OCSPServer: $.varRef(this._fields.OCSPServer.value),
			IssuingCertificateURL: $.varRef(this._fields.IssuingCertificateURL.value),
			DNSNames: $.varRef(this._fields.DNSNames.value),
			EmailAddresses: $.varRef(this._fields.EmailAddresses.value),
			IPAddresses: $.varRef(this._fields.IPAddresses.value),
			URIs: $.varRef(this._fields.URIs.value),
			PermittedDNSDomainsCritical: $.varRef(this._fields.PermittedDNSDomainsCritical.value),
			PermittedDNSDomains: $.varRef(this._fields.PermittedDNSDomains.value),
			ExcludedDNSDomains: $.varRef(this._fields.ExcludedDNSDomains.value),
			PermittedIPRanges: $.varRef(this._fields.PermittedIPRanges.value),
			ExcludedIPRanges: $.varRef(this._fields.ExcludedIPRanges.value),
			PermittedEmailAddresses: $.varRef(this._fields.PermittedEmailAddresses.value),
			ExcludedEmailAddresses: $.varRef(this._fields.ExcludedEmailAddresses.value),
			PermittedURIDomains: $.varRef(this._fields.PermittedURIDomains.value),
			ExcludedURIDomains: $.varRef(this._fields.ExcludedURIDomains.value),
			CRLDistributionPoints: $.varRef(this._fields.CRLDistributionPoints.value),
			PolicyIdentifiers: $.varRef(this._fields.PolicyIdentifiers.value),
			Policies: $.varRef(this._fields.Policies.value),
			InhibitAnyPolicy: $.varRef(this._fields.InhibitAnyPolicy.value),
			InhibitAnyPolicyZero: $.varRef(this._fields.InhibitAnyPolicyZero.value),
			InhibitPolicyMapping: $.varRef(this._fields.InhibitPolicyMapping.value),
			InhibitPolicyMappingZero: $.varRef(this._fields.InhibitPolicyMappingZero.value),
			RequireExplicitPolicy: $.varRef(this._fields.RequireExplicitPolicy.value),
			RequireExplicitPolicyZero: $.varRef(this._fields.RequireExplicitPolicyZero.value),
			PolicyMappings: $.varRef(this._fields.PolicyMappings.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async CheckCRLSignature(crl: pkix2.CertificateList | $.VarRef<pkix2.CertificateList> | null): globalThis.Promise<$.GoError> {
		const c: Certificate | $.VarRef<Certificate> | null = this
		let algo = await getSignatureAlgorithmFromAI($.markAsStructValue($.cloneStructValue($.pointerValue<pkix2.CertificateList>(crl).SignatureAlgorithm)))
		return Certificate.prototype.CheckSignature.call(c, algo, $.pointerValue<pkix2.CertificateList>(crl).TBSCertList.Raw, $.markAsStructValue($.cloneStructValue($.pointerValue<pkix2.CertificateList>(crl).SignatureValue)).RightAlign())
	}

	public async CheckSignature(algo: SignatureAlgorithm, signed: $.Slice<number>, signature: $.Slice<number>): globalThis.Promise<$.GoError> {
		const c: Certificate | $.VarRef<Certificate> | null = this
		return checkSignature(algo, signed, signature, ($.pointerValue<Certificate>(c).PublicKey as crypto.PublicKey | null), true)
	}

	public async CheckSignatureFrom(parent: Certificate | $.VarRef<Certificate> | null): globalThis.Promise<$.GoError> {
		const c: Certificate | $.VarRef<Certificate> | null = this
		// RFC 5280, 4.2.1.9:
		// "If the basic constraints extension is not present in a version 3
		// certificate, or the extension is present but the cA boolean is not
		// asserted, then the certified public key MUST NOT be used to verify
		// certificate signatures."
		if ((($.pointerValue<Certificate>(parent).Version == 3) && !$.pointerValue<Certificate>(parent).BasicConstraintsValid) || ($.pointerValue<Certificate>(parent).BasicConstraintsValid && !$.pointerValue<Certificate>(parent).IsCA)) {
			return $.interfaceValue<$.GoError>($.markAsStructValue(new ConstraintViolationError()), "x509.ConstraintViolationError", "x509.ConstraintViolationError")
		}

		if (($.pointerValue<Certificate>(parent).KeyUsage != 0) && (($.pointerValue<Certificate>(parent).KeyUsage & 32) == 0)) {
			return $.interfaceValue<$.GoError>($.markAsStructValue(new ConstraintViolationError()), "x509.ConstraintViolationError", "x509.ConstraintViolationError")
		}

		if ($.pointerValue<Certificate>(parent).PublicKeyAlgorithm == 0) {
			return ErrUnsupportedAlgorithm
		}

		return checkSignature($.pointerValue<Certificate>(c).SignatureAlgorithm, $.pointerValue<Certificate>(c).RawTBSCertificate, $.pointerValue<Certificate>(c).Signature, ($.pointerValue<Certificate>(parent).PublicKey as crypto.PublicKey | null), false)
	}

	public async CreateCRL(rand: io.Reader | null, priv: any, revokedCerts: $.Slice<pkix2.RevokedCertificate>, now: time.Time, expiry: time.Time): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const c: Certificate | $.VarRef<Certificate> | null = this
		let crlBytes: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		let [key, ok] = $.typeAssertTuple<crypto.Signer | null>(priv, "crypto.Signer")
		if (!ok) {
			return [null, errors.New("x509: certificate private key does not implement crypto.Signer")]
		}

		let __goscriptTuple10: any = await signingParamsForKey(key, 0)
		let signatureAlgorithm = __goscriptTuple10[0]
		let algorithmIdentifier = __goscriptTuple10[1]
		err = __goscriptTuple10[2]
		if (err != null) {
			return [null, err]
		}

		// Force revocation times to UTC per RFC 5280.
		let revokedCertsUTC: $.Slice<pkix2.RevokedCertificate> = $.makeSlice<pkix2.RevokedCertificate>($.len(revokedCerts), undefined, undefined, () => $.markAsStructValue(new pkix2.RevokedCertificate()))
		for (let __goscriptRangeTarget6 = revokedCerts, i = 0; i < $.len(__goscriptRangeTarget6); i++) {
			let rc = __goscriptRangeTarget6![i]
			rc.RevocationTime = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(rc.RevocationTime)).UTC()))
			revokedCertsUTC![i] = $.markAsStructValue($.cloneStructValue(rc))
		}

		let tbsCertList = (() => { const __goscriptLiteralField0 = ($.markAsStructValue($.cloneStructValue($.pointerValue<Certificate>(c).Subject)).ToRDNSequence() as pkix2.RDNSequence); const __goscriptLiteralField1 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(now)).UTC())); const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(expiry)).UTC())); return $.markAsStructValue(new pkix2.TBSCertificateList({Version: 1, Signature: $.markAsStructValue($.cloneStructValue(algorithmIdentifier)), Issuer: __goscriptLiteralField0, ThisUpdate: __goscriptLiteralField1, NextUpdate: __goscriptLiteralField2, RevokedCertificates: revokedCertsUTC})) })()

		// Authority Key Id
		if ($.len($.pointerValue<Certificate>(c).SubjectKeyId) > 0) {
			let aki: pkix2.Extension = $.markAsStructValue(new pkix2.Extension())
			aki.Id = (oidExtensionAuthorityKeyId as asn1.ObjectIdentifier)
			let __goscriptTuple11: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue(new authKeyId({Id: $.pointerValue<Certificate>(c).SubjectKeyId})), "x509.authKeyId", "x509.authKeyId"))
			aki.Value = __goscriptTuple11[0]
			err = __goscriptTuple11[1]
			if (err != null) {
				return [null, err]
			}
			tbsCertList.Extensions = $.append(tbsCertList.Extensions, aki)
		}

		let __goscriptTuple12: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(tbsCertList)), "pkix.TBSCertificateList", "pkix.TBSCertificateList"))
		let tbsCertListContents: $.Slice<number> = __goscriptTuple12[0]
		err = __goscriptTuple12[1]
		if (err != null) {
			return [null, err]
		}
		tbsCertList.Raw = (tbsCertListContents as asn1.RawContent)

		let __goscriptTuple13: any = await signTBS(tbsCertListContents, key, signatureAlgorithm, rand)
		let signature: $.Slice<number> = __goscriptTuple13[0]
		err = __goscriptTuple13[1]
		if (err != null) {
			return [null, err]
		}

		return asn1.Marshal($.interfaceValue<any>($.markAsStructValue(new pkix2.CertificateList({TBSCertList: $.markAsStructValue($.cloneStructValue(tbsCertList)), SignatureAlgorithm: $.markAsStructValue($.cloneStructValue(algorithmIdentifier)), SignatureValue: $.markAsStructValue(new asn1.BitString({Bytes: signature, BitLength: $.len(signature) * 8}))})), "pkix.CertificateList", "pkix.CertificateList"))
	}

	public Equal(other: Certificate | $.VarRef<Certificate> | null): boolean {
		const c: Certificate | $.VarRef<Certificate> | null = this
		if ((c == null) || (other == null)) {
			return $.pointerEqual(c, other)
		}
		return bytes.Equal($.pointerValue<Certificate>(c).Raw, $.pointerValue<Certificate>(other).Raw)
	}

	public async Verify(__goscriptParam0: __goscript_verify.VerifyOptions): globalThis.Promise<[$.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>>, $.GoError]> {
		const c: Certificate | $.VarRef<Certificate> | null = this
		let opts: $.VarRef<__goscript_verify.VerifyOptions> = $.varRef(__goscriptParam0)

		if ($.len($.pointerValue<Certificate>(c).Raw) == 0) {
			return [null, __goscript_verify.errNotParsed]
		}
		for (let i = 0; i < __goscript_cert_pool.CertPool.prototype.len.call(opts.value.Intermediates); i++) {
			let __goscriptTuple14: any = await __goscript_cert_pool.CertPool.prototype.cert.call(opts.value.Intermediates, i)
			let __goscriptShadow3: Certificate | $.VarRef<Certificate> | null = __goscriptTuple14[0]
			let err = __goscriptTuple14[2]
			if (err != null) {
				return [null, fmt.Errorf("crypto/x509: error fetching intermediate: %w", (err as any))]
			}
			if ($.len($.pointerValue<Certificate>(__goscriptShadow3).Raw) == 0) {
				return [null, __goscript_verify.errNotParsed]
			}
		}

		if ((($.stringEqual(runtime.GOOS, "windows")) || ($.stringEqual(runtime.GOOS, "darwin"))) || ($.stringEqual(runtime.GOOS, "ios"))) {

			let systemPool: __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null = await __goscript_root.systemRootsPool()
			if ((opts.value.Roots == null) && ((systemPool == null) || $.pointerValue<__goscript_cert_pool.CertPool>(systemPool).systemPool)) {
				return Certificate.prototype.systemVerify.call(c, opts)
			}
			if ((opts.value.Roots != null) && $.pointerValue<__goscript_cert_pool.CertPool>(opts.value.Roots).systemPool) {
				let __goscriptTuple15: any = Certificate.prototype.systemVerify.call(c, opts)
				let platformChains: $.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>> = __goscriptTuple15[0]
				let err = __goscriptTuple15[1]

				if ((err == null) || (__goscript_cert_pool.CertPool.prototype.len.call(opts.value.Roots) == 0)) {
					return [platformChains, err]
				}
			}
		}

		if (opts.value.Roots == null) {
			opts.value.Roots = await __goscript_root.systemRootsPool()
			if (opts.value.Roots == null) {
				return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_verify.SystemRootsError({Err: __goscript_root.systemRootsErr})), "x509.SystemRootsError", "x509.SystemRootsError")]
			}
		}

		let err = await Certificate.prototype.isValid.call(c, 0, null, opts)
		if (err != null) {
			return [null, err]
		}
		// digitalSignature
		if ($.len(opts.value.DNSName) > 0) {
			err = Certificate.prototype.VerifyHostname.call(c, opts.value.DNSName)
			if (err != null) {
				return [null, err]
			}
		}
		// encipherOnly
		let candidateChains: $.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>> = null as $.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>>
		if (await __goscript_cert_pool.CertPool.prototype.contains.call(opts.value.Roots, c)) {
			candidateChains = $.arrayToSlice<$.Slice<Certificate | $.VarRef<Certificate> | null>>([$.arrayToSlice<Certificate | $.VarRef<Certificate> | null>([c])])
		} else {
			let __goscriptTuple16: any = await Certificate.prototype.buildChains.call(c, $.arrayToSlice<Certificate | $.VarRef<Certificate> | null>([c]), null, opts)
			candidateChains = __goscriptTuple16[0]
			err = __goscriptTuple16[1]
			if (err != null) {
				return [null, err]
			}
		}

		let anyKeyUsage = false
		for (let __goscriptRangeTarget7 = opts.value.KeyUsages, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget7); __rangeIndex++) {
			let eku = __goscriptRangeTarget7![__rangeIndex]
			if (eku == 0) {

				anyKeyUsage = true
				break
			}
		}

		if ($.len(opts.value.KeyUsages) == 0) {
			opts.value.KeyUsages = $.arrayToSlice<ExtKeyUsage>([1])
		}

		let invalidPoliciesChains: number = 0
		let incompatibleKeyUsageChains: number = 0
		let constraintsHintErr: $.GoError = null as $.GoError
		candidateChains = (await slices.DeleteFunc(candidateChains, $.functionValue(async (chain: $.Slice<Certificate | $.VarRef<Certificate> | null>): globalThis.Promise<boolean> => {
			if (!await __goscript_verify.policiesValid(chain, $.markAsStructValue($.cloneStructValue(opts.value)))) {
				invalidPoliciesChains++
				return true
			}

			if (!anyKeyUsage && !__goscript_verify.checkChainForKeyUsage(chain, opts.value.KeyUsages)) {
				incompatibleKeyUsageChains++
				return true
			}
			{
				let __goscriptShadow4 = await __goscript_constraints.checkChainConstraints(chain)
				if (__goscriptShadow4 != null) {
					if (constraintsHintErr == null) {
						constraintsHintErr = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField3 = $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow4).Error(); return $.markAsStructValue(new __goscript_verify.CertificateInvalidError({Cert: c, Reason: 2, Detail: __goscriptLiteralField3})) })(), "x509.CertificateInvalidError", "x509.CertificateInvalidError")
					}
					return true
				}
			}
			return false
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>>)
		// ipsecTunnel
		if ($.len(candidateChains) == 0) {
			if (constraintsHintErr != null) {
				return [null, constraintsHintErr]
			}
			let details: $.Slice<string> = null as $.Slice<string>
			if (incompatibleKeyUsageChains > 0) {
				if (invalidPoliciesChains == 0) {
					return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_verify.CertificateInvalidError({Cert: c, Reason: 4, Detail: ""})), "x509.CertificateInvalidError", "x509.CertificateInvalidError")]
				}
				details = $.append(details, await fmt.Sprintf("%d candidate chains with incompatible key usage", $.namedValueInterfaceValue<any>(incompatibleKeyUsageChains, "int", {}, { kind: $.TypeKind.Basic, name: "int" })))
			}
			if (invalidPoliciesChains > 0) {
				details = $.append(details, await fmt.Sprintf("%d candidate chains with invalid policies", $.namedValueInterfaceValue<any>(invalidPoliciesChains, "int", {}, { kind: $.TypeKind.Basic, name: "int" })))
			}
			err = $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField4 = strings.Join(details, ", "); return $.markAsStructValue(new __goscript_verify.CertificateInvalidError({Cert: c, Reason: 10, Detail: __goscriptLiteralField4})) })(), "x509.CertificateInvalidError", "x509.CertificateInvalidError")
			return [null, err]
		}

		return [candidateChains, null]
	}

	public VerifyHostname(h: string): $.GoError {
		const c: Certificate | $.VarRef<Certificate> | null = this

		let candidateIP = h
		if ((($.len(h) >= 3) && ($.uint($.indexStringOrBytes(h, 0), 8) == $.uint(91, 8))) && ($.uint($.indexStringOrBytes(h, $.len(h) - 1), 8) == $.uint(93, 8))) {
			candidateIP = $.sliceStringOrBytes(h, 1, $.len(h) - 1)
		}
		{
			let ip: net.IP = (net.ParseIP(candidateIP) as net.IP)
			if (ip != null) {

				for (let __goscriptRangeTarget8 = $.pointerValue<Certificate>(c).IPAddresses, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget8); __rangeIndex++) {
					let candidate = __goscriptRangeTarget8![__rangeIndex]
					if (net.IP_Equal(ip, (candidate as net.IP))) {
						return null
					}
				}
				return $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_verify.HostnameError({Certificate: c, Host: candidateIP})), "x509.HostnameError", "x509.HostnameError")
			}
		}

		let candidateName = __goscript_verify.toLowerCaseASCII(h)
		let validCandidateName = __goscript_verify.validHostnameInput(candidateName)
		let hostParts: $.Slice<string> = __goscript_verify.splitHostname(candidateName)

		for (let __goscriptRangeTarget9 = $.pointerValue<Certificate>(c).DNSNames, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget9); __rangeIndex++) {
			let match = __goscriptRangeTarget9![__rangeIndex]

			if (validCandidateName && __goscript_verify.validHostnamePattern(match)) {
				if (__goscript_verify.matchHostnames(match, hostParts)) {
					return null
				}
			} else {
				if (__goscript_verify.matchExactly(match, candidateName)) {
					return null
				}
			}
		}

		return $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_verify.HostnameError({Certificate: c, Host: h})), "x509.HostnameError", "x509.HostnameError")
	}

	public async buildChains(currentChain: $.Slice<Certificate | $.VarRef<Certificate> | null>, sigChecks: $.VarRef<number> | null, opts: __goscript_verify.VerifyOptions | $.VarRef<__goscript_verify.VerifyOptions> | null): globalThis.Promise<[$.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>>, $.GoError]> {
		const c: Certificate | $.VarRef<Certificate> | null = this
		let chains: $.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>> = null as $.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>>
		let err: $.GoError = null as $.GoError
		let hintErr: $.GoError = null as $.GoError
		let hintCert: Certificate | $.VarRef<Certificate> | null = null as Certificate | $.VarRef<Certificate> | null

		let considerCandidate: ((certType: number, candidate: __goscript_cert_pool.potentialParent) => void) | null = $.functionValue(async (certType: number, candidate: __goscript_cert_pool.potentialParent): globalThis.Promise<void> => {
			if (sigChecks == null) {
				sigChecks = $.varRef<number>(0)
			}
			sigChecks!.value++
			if ($.pointerValue<number>(sigChecks) > 100) {
				err = __goscript_verify.errSignatureLimit
				return
			}

			if (($.pointerValue<Certificate>(candidate.cert).PublicKey == null) || __goscript_verify.alreadyInChain(candidate.cert, currentChain)) {
				return
			}

			{
				let __goscriptShadow5 = await Certificate.prototype.CheckSignatureFrom.call(c, candidate.cert)
				if (__goscriptShadow5 != null) {
					if (hintErr == null) {
						hintErr = __goscriptShadow5
						hintCert = candidate.cert
					}
					return
				}
			}

			err = await Certificate.prototype.isValid.call(candidate.cert, certType, currentChain, opts)
			if (err != null) {
				if (hintErr == null) {
					hintErr = err
					hintCert = candidate.cert
				}
				return
			}

			if (candidate.constraint != null) {
				{
					let __goscriptShadow6 = await candidate.constraint!(currentChain)
					if (__goscriptShadow6 != null) {
						if (hintErr == null) {
							hintErr = __goscriptShadow6
							hintCert = candidate.cert
						}
						return
					}
				}
			}

			switch (certType) {
				case 2:
				{
					chains = $.append(chains, __goscript_verify.appendToFreshChain(currentChain, candidate.cert))
					break
				}
				case 1:
				{
					let childChains: $.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>> = null as $.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>>
					let __goscriptTuple17: any = await Certificate.prototype.buildChains.call(candidate.cert, __goscript_verify.appendToFreshChain(currentChain, candidate.cert), sigChecks, opts)
					childChains = __goscriptTuple17[0]
					err = __goscriptTuple17[1]
					chains = $.appendSlice(chains, childChains)
					break
				}
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, "x509.potentialParent"], results: [] } as $.FunctionTypeInfo))

		candidateLoop: for (let __goscriptRangeTarget11 = $.arrayToSlice<{"certType": number, "potentials": $.Slice<__goscript_cert_pool.potentialParent>}>([{certType: 2, potentials: await __goscript_cert_pool.CertPool.prototype.findPotentialParents.call($.pointerValue<__goscript_verify.VerifyOptions>(opts).Roots, c)}, {certType: 1, potentials: await __goscript_cert_pool.CertPool.prototype.findPotentialParents.call($.pointerValue<__goscript_verify.VerifyOptions>(opts).Intermediates, c)}]), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget11); __rangeIndex++) {
			let parents = __goscriptRangeTarget11![__rangeIndex]
			for (let __goscriptRangeTarget10 = parents.potentials, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget10); __rangeIndex++) {
				let parent = __goscriptRangeTarget10![__rangeIndex]
				await considerCandidate!(parents.certType, $.markAsStructValue($.cloneStructValue(parent)))
				if ($.comparableEqual(err, __goscript_verify.errSignatureLimit)) {
					break candidateLoop
				}
			}
		}

		if ($.len(chains) > 0) {
			err = null
		}
		if (($.len(chains) == 0) && (err == null)) {
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_verify.UnknownAuthorityError({Cert: c, hintErr: hintErr, hintCert: hintCert})), "x509.UnknownAuthorityError", "x509.UnknownAuthorityError")
		}

		return [chains, err]
	}

	public getSANExtension(): $.Slice<number> {
		const c: Certificate | $.VarRef<Certificate> | null = this
		for (let __goscriptRangeTarget12 = $.pointerValue<Certificate>(c).Extensions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget12); __rangeIndex++) {
			let e = __goscriptRangeTarget12![__rangeIndex]
			if (asn1.ObjectIdentifier_Equal(e.Id, (oidExtensionSubjectAltName as asn1.ObjectIdentifier))) {
				return e.Value
			}
		}
		return null
	}

	public hasNameConstraints(): boolean {
		const c: Certificate | $.VarRef<Certificate> | null = this
		return oidInExtensions((oidExtensionNameConstraints as asn1.ObjectIdentifier), $.pointerValue<Certificate>(c).Extensions)
	}

	public hasSANExtension(): boolean {
		const c: Certificate | $.VarRef<Certificate> | null = this
		return oidInExtensions((oidExtensionSubjectAltName as asn1.ObjectIdentifier), $.pointerValue<Certificate>(c).Extensions)
	}

	public async isValid(certType: number, currentChain: $.Slice<Certificate | $.VarRef<Certificate> | null>, opts: __goscript_verify.VerifyOptions | $.VarRef<__goscript_verify.VerifyOptions> | null): globalThis.Promise<$.GoError> {
		const c: Certificate | $.VarRef<Certificate> | null = this
		if ($.len($.pointerValue<Certificate>(c).UnhandledCriticalExtensions) > 0) {
			return $.interfaceValue<$.GoError>($.markAsStructValue(new UnhandledCriticalExtension()), "x509.UnhandledCriticalExtension", "x509.UnhandledCriticalExtension")
		}

		if ($.len(currentChain) > 0) {
			let child: Certificate | $.VarRef<Certificate> | null = $.arrayIndex(currentChain!, $.len(currentChain) - 1)
			if (!bytes.Equal($.pointerValue<Certificate>(child).RawIssuer, $.pointerValue<Certificate>(c).RawSubject)) {
				return $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_verify.CertificateInvalidError({Cert: c, Reason: 5, Detail: ""})), "x509.CertificateInvalidError", "x509.CertificateInvalidError")
			}
		}

		let now = $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_verify.VerifyOptions>(opts).CurrentTime))
		if ($.markAsStructValue($.cloneStructValue(now)).IsZero()) {
			now = $.markAsStructValue($.cloneStructValue(time.Now()))
		}
		if ($.markAsStructValue($.cloneStructValue(now)).Before($.markAsStructValue($.cloneStructValue($.pointerValue<Certificate>(c).NotBefore)))) {
			return $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField5 = await fmt.Sprintf("current time %s is before %s", $.markAsStructValue($.cloneStructValue(now)).Format(time.RFC3339), $.markAsStructValue($.cloneStructValue($.pointerValue<Certificate>(c).NotBefore)).Format(time.RFC3339)); return $.markAsStructValue(new __goscript_verify.CertificateInvalidError({Cert: c, Reason: 1, Detail: __goscriptLiteralField5})) })()), "x509.CertificateInvalidError", "x509.CertificateInvalidError")
		} else {
			if ($.markAsStructValue($.cloneStructValue(now)).After($.markAsStructValue($.cloneStructValue($.pointerValue<Certificate>(c).NotAfter)))) {
				return $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField6 = await fmt.Sprintf("current time %s is after %s", $.markAsStructValue($.cloneStructValue(now)).Format(time.RFC3339), $.markAsStructValue($.cloneStructValue($.pointerValue<Certificate>(c).NotAfter)).Format(time.RFC3339)); return $.markAsStructValue(new __goscript_verify.CertificateInvalidError({Cert: c, Reason: 1, Detail: __goscriptLiteralField6})) })()), "x509.CertificateInvalidError", "x509.CertificateInvalidError")
			}
		}

		if ((certType == 1) || (certType == 2)) {
			if ($.len(currentChain) == 0) {
				return errors.New("x509: internal error: empty chain when appending CA cert")
			}
		}

		// RFC 5480, 2.1.1 Unrestricted Algorithm Identifier and Parameters
		//
		//	id-ecPublicKey OBJECT IDENTIFIER ::= {
		//		iso(1) member-body(2) us(840) ansi-X9-62(10045) keyType(2) 1 }

		// RFC 8410, Section 3
		//
		//	id-X25519    OBJECT IDENTIFIER ::= { 1 3 101 110 }
		//	id-Ed25519   OBJECT IDENTIFIER ::= { 1 3 101 112 }

		if ((certType == 1) && (!$.pointerValue<Certificate>(c).BasicConstraintsValid || !$.pointerValue<Certificate>(c).IsCA)) {
			return $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_verify.CertificateInvalidError({Cert: c, Reason: 0, Detail: ""})), "x509.CertificateInvalidError", "x509.CertificateInvalidError")
		}

		if ($.pointerValue<Certificate>(c).BasicConstraintsValid && ($.pointerValue<Certificate>(c).MaxPathLen >= 0)) {
			let numIntermediates = $.len(currentChain) - 1
			if (numIntermediates > $.pointerValue<Certificate>(c).MaxPathLen) {
				return $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_verify.CertificateInvalidError({Cert: c, Reason: 3, Detail: ""})), "x509.CertificateInvalidError", "x509.CertificateInvalidError")
			}
		}

		return null
	}

	public systemVerify(opts: __goscript_verify.VerifyOptions | $.VarRef<__goscript_verify.VerifyOptions> | null): [$.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>>, $.GoError] {
		const c: Certificate | $.VarRef<Certificate> | null = this
		let chains: $.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>> = null as $.Slice<$.Slice<Certificate | $.VarRef<Certificate> | null>>
		let err: $.GoError = null as $.GoError
		return [null, null]
	}

	static __typeInfo = $.registerStructType(
		"x509.Certificate",
		() => new Certificate(),
		[{ name: "CheckCRLSignature", args: [{ name: "crl", type: { kind: $.TypeKind.Pointer, elemType: "pkix.CertificateList" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "CheckSignature", args: [{ name: "algo", type: { kind: $.TypeKind.Basic, name: "int", typeName: "x509.SignatureAlgorithm" } }, { name: "signed", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "CheckSignatureFrom", args: [{ name: "parent", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "CreateCRL", args: [{ name: "rand", type: "io.Reader" }, { name: "priv", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "revokedCerts", type: { kind: $.TypeKind.Slice, elemType: "pkix.RevokedCertificate" } }, { name: "now", type: "time.Time" }, { name: "expiry", type: "time.Time" }], returns: [{ name: "crlBytes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "Equal", args: [{ name: "other", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Verify", args: [{ name: "opts", type: "x509.VerifyOptions" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } } } }, { name: "_r1", type: "error" }] }, { name: "VerifyHostname", args: [{ name: "h", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "buildChains", args: [{ name: "currentChain", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } } }, { name: "sigChecks", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } } }, { name: "opts", type: { kind: $.TypeKind.Pointer, elemType: "x509.VerifyOptions" } }], returns: [{ name: "chains", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } } } }, { name: "err", type: "error" }] }, { name: "getSANExtension", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "hasNameConstraints", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "hasSANExtension", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "isValid", args: [{ name: "certType", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "currentChain", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } } }, { name: "opts", type: { kind: $.TypeKind.Pointer, elemType: "x509.VerifyOptions" } }], returns: [{ name: "_r0", type: "error" }] }, { name: "systemVerify", args: [{ name: "opts", type: { kind: $.TypeKind.Pointer, elemType: "x509.VerifyOptions" } }], returns: [{ name: "chains", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } } } }, { name: "err", type: "error" }] }],
		Certificate,
		[{ name: "Raw", key: "Raw", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "RawTBSCertificate", key: "RawTBSCertificate", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [1], offset: 24, exported: true }, { name: "RawSubjectPublicKeyInfo", key: "RawSubjectPublicKeyInfo", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [2], offset: 48, exported: true }, { name: "RawSubject", key: "RawSubject", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [3], offset: 72, exported: true }, { name: "RawIssuer", key: "RawIssuer", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [4], offset: 96, exported: true }, { name: "Signature", key: "Signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [5], offset: 120, exported: true }, { name: "SignatureAlgorithm", key: "SignatureAlgorithm", type: { kind: $.TypeKind.Basic, name: "int", typeName: "x509.SignatureAlgorithm" }, index: [6], offset: 144, exported: true }, { name: "PublicKeyAlgorithm", key: "PublicKeyAlgorithm", type: { kind: $.TypeKind.Basic, name: "int", typeName: "x509.PublicKeyAlgorithm" }, index: [7], offset: 152, exported: true }, { name: "PublicKey", key: "PublicKey", type: { kind: $.TypeKind.Interface, methods: [] }, index: [8], offset: 160, exported: true }, { name: "Version", key: "Version", type: { kind: $.TypeKind.Basic, name: "int" }, index: [9], offset: 176, exported: true }, { name: "SerialNumber", key: "SerialNumber", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [10], offset: 184, exported: true }, { name: "Issuer", key: "Issuer", type: "pkix.Name", index: [11], offset: 192, exported: true }, { name: "Subject", key: "Subject", type: "pkix.Name", index: [12], offset: 440, exported: true }, { name: "NotBefore", key: "NotBefore", type: "time.Time", index: [13], offset: 688, exported: true }, { name: "NotAfter", key: "NotAfter", type: "time.Time", index: [14], offset: 712, exported: true }, { name: "KeyUsage", key: "KeyUsage", type: { kind: $.TypeKind.Basic, name: "int", typeName: "x509.KeyUsage" }, index: [15], offset: 736, exported: true }, { name: "Extensions", key: "Extensions", type: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" }, index: [16], offset: 744, exported: true }, { name: "ExtraExtensions", key: "ExtraExtensions", type: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" }, index: [17], offset: 768, exported: true }, { name: "UnhandledCriticalExtensions", key: "UnhandledCriticalExtensions", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }, index: [18], offset: 792, exported: true }, { name: "ExtKeyUsage", key: "ExtKeyUsage", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int", typeName: "x509.ExtKeyUsage" } }, index: [19], offset: 816, exported: true }, { name: "UnknownExtKeyUsage", key: "UnknownExtKeyUsage", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }, index: [20], offset: 840, exported: true }, { name: "BasicConstraintsValid", key: "BasicConstraintsValid", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [21], offset: 864, exported: true }, { name: "IsCA", key: "IsCA", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [22], offset: 865, exported: true }, { name: "MaxPathLen", key: "MaxPathLen", type: { kind: $.TypeKind.Basic, name: "int" }, index: [23], offset: 872, exported: true }, { name: "MaxPathLenZero", key: "MaxPathLenZero", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [24], offset: 880, exported: true }, { name: "SubjectKeyId", key: "SubjectKeyId", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [25], offset: 888, exported: true }, { name: "AuthorityKeyId", key: "AuthorityKeyId", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [26], offset: 912, exported: true }, { name: "OCSPServer", key: "OCSPServer", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [27], offset: 936, exported: true }, { name: "IssuingCertificateURL", key: "IssuingCertificateURL", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [28], offset: 960, exported: true }, { name: "DNSNames", key: "DNSNames", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [29], offset: 984, exported: true }, { name: "EmailAddresses", key: "EmailAddresses", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [30], offset: 1008, exported: true }, { name: "IPAddresses", key: "IPAddresses", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, index: [31], offset: 1032, exported: true }, { name: "URIs", key: "URIs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "url.URL" } }, index: [32], offset: 1056, exported: true }, { name: "PermittedDNSDomainsCritical", key: "PermittedDNSDomainsCritical", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [33], offset: 1080, exported: true }, { name: "PermittedDNSDomains", key: "PermittedDNSDomains", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [34], offset: 1088, exported: true }, { name: "ExcludedDNSDomains", key: "ExcludedDNSDomains", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [35], offset: 1112, exported: true }, { name: "PermittedIPRanges", key: "PermittedIPRanges", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.IPNet" } }, index: [36], offset: 1136, exported: true }, { name: "ExcludedIPRanges", key: "ExcludedIPRanges", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.IPNet" } }, index: [37], offset: 1160, exported: true }, { name: "PermittedEmailAddresses", key: "PermittedEmailAddresses", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [38], offset: 1184, exported: true }, { name: "ExcludedEmailAddresses", key: "ExcludedEmailAddresses", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [39], offset: 1208, exported: true }, { name: "PermittedURIDomains", key: "PermittedURIDomains", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [40], offset: 1232, exported: true }, { name: "ExcludedURIDomains", key: "ExcludedURIDomains", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [41], offset: 1256, exported: true }, { name: "CRLDistributionPoints", key: "CRLDistributionPoints", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [42], offset: 1280, exported: true }, { name: "PolicyIdentifiers", key: "PolicyIdentifiers", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }, index: [43], offset: 1304, exported: true }, { name: "Policies", key: "Policies", type: { kind: $.TypeKind.Slice, elemType: "x509.OID" }, index: [44], offset: 1328, exported: true }, { name: "InhibitAnyPolicy", key: "InhibitAnyPolicy", type: { kind: $.TypeKind.Basic, name: "int" }, index: [45], offset: 1352, exported: true }, { name: "InhibitAnyPolicyZero", key: "InhibitAnyPolicyZero", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [46], offset: 1360, exported: true }, { name: "InhibitPolicyMapping", key: "InhibitPolicyMapping", type: { kind: $.TypeKind.Basic, name: "int" }, index: [47], offset: 1368, exported: true }, { name: "InhibitPolicyMappingZero", key: "InhibitPolicyMappingZero", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [48], offset: 1376, exported: true }, { name: "RequireExplicitPolicy", key: "RequireExplicitPolicy", type: { kind: $.TypeKind.Basic, name: "int" }, index: [49], offset: 1384, exported: true }, { name: "RequireExplicitPolicyZero", key: "RequireExplicitPolicyZero", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [50], offset: 1392, exported: true }, { name: "PolicyMappings", key: "PolicyMappings", type: { kind: $.TypeKind.Slice, elemType: "x509.PolicyMapping" }, index: [51], offset: 1400, exported: true }]
	)
}

export class PolicyMapping {
	// IssuerDomainPolicy contains a policy OID the issuing certificate considers
	// equivalent to SubjectDomainPolicy in the subject certificate.
	public get IssuerDomainPolicy(): __goscript_oid.OID {
		return this._fields.IssuerDomainPolicy.value
	}
	public set IssuerDomainPolicy(value: __goscript_oid.OID) {
		this._fields.IssuerDomainPolicy.value = value
	}

	// SubjectDomainPolicy contains a OID the issuing certificate considers
	// equivalent to IssuerDomainPolicy in the subject certificate.
	public get SubjectDomainPolicy(): __goscript_oid.OID {
		return this._fields.SubjectDomainPolicy.value
	}
	public set SubjectDomainPolicy(value: __goscript_oid.OID) {
		this._fields.SubjectDomainPolicy.value = value
	}

	public _fields: {
		IssuerDomainPolicy: $.VarRef<__goscript_oid.OID>
		SubjectDomainPolicy: $.VarRef<__goscript_oid.OID>
	}

	constructor(init?: Partial<{IssuerDomainPolicy?: __goscript_oid.OID, SubjectDomainPolicy?: __goscript_oid.OID}>) {
		this._fields = {
			IssuerDomainPolicy: $.varRef(init?.IssuerDomainPolicy ? $.markAsStructValue($.cloneStructValue(init.IssuerDomainPolicy)) : $.markAsStructValue(new __goscript_oid.OID())),
			SubjectDomainPolicy: $.varRef(init?.SubjectDomainPolicy ? $.markAsStructValue($.cloneStructValue(init.SubjectDomainPolicy)) : $.markAsStructValue(new __goscript_oid.OID()))
		}
	}

	public clone(): PolicyMapping {
		const cloned = new PolicyMapping()
		cloned._fields = {
			IssuerDomainPolicy: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.IssuerDomainPolicy.value))),
			SubjectDomainPolicy: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.SubjectDomainPolicy.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.PolicyMapping",
		() => new PolicyMapping(),
		[],
		PolicyMapping,
		[{ name: "IssuerDomainPolicy", key: "IssuerDomainPolicy", type: "x509.OID", index: [0], offset: 0, exported: true }, { name: "SubjectDomainPolicy", key: "SubjectDomainPolicy", type: "x509.OID", index: [1], offset: 24, exported: true }]
	)
}

export class ConstraintViolationError {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): ConstraintViolationError {
		const cloned = new ConstraintViolationError()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		return "x509: invalid signature: parent certificate cannot sign this kind of certificate"
	}

	static __typeInfo = $.registerStructType(
		"x509.ConstraintViolationError",
		() => new ConstraintViolationError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		ConstraintViolationError,
		[]
	)
}

export class UnhandledCriticalExtension {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): UnhandledCriticalExtension {
		const cloned = new UnhandledCriticalExtension()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const h = this
		return "x509: unhandled critical extension"
	}

	static __typeInfo = $.registerStructType(
		"x509.UnhandledCriticalExtension",
		() => new UnhandledCriticalExtension(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		UnhandledCriticalExtension,
		[]
	)
}

export class basicConstraints {
	public get IsCA(): boolean {
		return this._fields.IsCA.value
	}
	public set IsCA(value: boolean) {
		this._fields.IsCA.value = value
	}

	public get MaxPathLen(): number {
		return this._fields.MaxPathLen.value
	}
	public set MaxPathLen(value: number) {
		this._fields.MaxPathLen.value = value
	}

	public _fields: {
		IsCA: $.VarRef<boolean>
		MaxPathLen: $.VarRef<number>
	}

	constructor(init?: Partial<{IsCA?: boolean, MaxPathLen?: number}>) {
		this._fields = {
			IsCA: $.varRef(init?.IsCA ?? (false as boolean)),
			MaxPathLen: $.varRef(init?.MaxPathLen ?? (0 as number))
		}
	}

	public clone(): basicConstraints {
		const cloned = new basicConstraints()
		cloned._fields = {
			IsCA: $.varRef(this._fields.IsCA.value),
			MaxPathLen: $.varRef(this._fields.MaxPathLen.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.basicConstraints",
		() => new basicConstraints(),
		[],
		basicConstraints,
		[{ name: "IsCA", key: "IsCA", type: { kind: $.TypeKind.Basic, name: "bool" }, tag: "asn1:\"optional\"", index: [0], offset: 0, exported: true }, { name: "MaxPathLen", key: "MaxPathLen", type: { kind: $.TypeKind.Basic, name: "int" }, tag: "asn1:\"optional,default:-1\"", index: [1], offset: 8, exported: true }]
	)
}

export class policyInformation {
	public get Policy(): asn1.ObjectIdentifier {
		return this._fields.Policy.value
	}
	public set Policy(value: asn1.ObjectIdentifier) {
		this._fields.Policy.value = value
	}

	public _fields: {
		Policy: $.VarRef<asn1.ObjectIdentifier>
	}

	constructor(init?: Partial<{Policy?: asn1.ObjectIdentifier}>) {
		this._fields = {
			Policy: $.varRef(init?.Policy ?? (null as asn1.ObjectIdentifier))
		}
	}

	public clone(): policyInformation {
		const cloned = new policyInformation()
		cloned._fields = {
			Policy: $.varRef(this._fields.Policy.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.policyInformation",
		() => new policyInformation(),
		[],
		policyInformation,
		[{ name: "Policy", key: "Policy", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, index: [0], offset: 0, exported: true }]
	)
}

export class authorityInfoAccess {
	public get Method(): asn1.ObjectIdentifier {
		return this._fields.Method.value
	}
	public set Method(value: asn1.ObjectIdentifier) {
		this._fields.Method.value = value
	}

	public get Location(): asn1.RawValue {
		return this._fields.Location.value
	}
	public set Location(value: asn1.RawValue) {
		this._fields.Location.value = value
	}

	public _fields: {
		Method: $.VarRef<asn1.ObjectIdentifier>
		Location: $.VarRef<asn1.RawValue>
	}

	constructor(init?: Partial<{Method?: asn1.ObjectIdentifier, Location?: asn1.RawValue}>) {
		this._fields = {
			Method: $.varRef(init?.Method ?? (null as asn1.ObjectIdentifier)),
			Location: $.varRef(init?.Location ? $.markAsStructValue($.cloneStructValue(init.Location)) : $.markAsStructValue(new asn1.RawValue()))
		}
	}

	public clone(): authorityInfoAccess {
		const cloned = new authorityInfoAccess()
		cloned._fields = {
			Method: $.varRef(this._fields.Method.value),
			Location: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Location.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.authorityInfoAccess",
		() => new authorityInfoAccess(),
		[],
		authorityInfoAccess,
		[{ name: "Method", key: "Method", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, index: [0], offset: 0, exported: true }, { name: "Location", key: "Location", type: "asn1.RawValue", index: [1], offset: 24, exported: true }]
	)
}

export class distributionPointName {
	public get FullName(): $.Slice<asn1.RawValue> {
		return this._fields.FullName.value
	}
	public set FullName(value: $.Slice<asn1.RawValue>) {
		this._fields.FullName.value = value
	}

	public get RelativeName(): pkix2.RDNSequence {
		return this._fields.RelativeName.value
	}
	public set RelativeName(value: pkix2.RDNSequence) {
		this._fields.RelativeName.value = value
	}

	public _fields: {
		FullName: $.VarRef<$.Slice<asn1.RawValue>>
		RelativeName: $.VarRef<pkix2.RDNSequence>
	}

	constructor(init?: Partial<{FullName?: $.Slice<asn1.RawValue>, RelativeName?: pkix2.RDNSequence}>) {
		this._fields = {
			FullName: $.varRef(init?.FullName ?? (null as $.Slice<asn1.RawValue>)),
			RelativeName: $.varRef(init?.RelativeName ?? (null as pkix2.RDNSequence))
		}
	}

	public clone(): distributionPointName {
		const cloned = new distributionPointName()
		cloned._fields = {
			FullName: $.varRef(this._fields.FullName.value),
			RelativeName: $.varRef(this._fields.RelativeName.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.distributionPointName",
		() => new distributionPointName(),
		[],
		distributionPointName,
		[{ name: "FullName", key: "FullName", type: { kind: $.TypeKind.Slice, elemType: "asn1.RawValue" }, tag: "asn1:\"optional,tag:0\"", index: [0], offset: 0, exported: true }, { name: "RelativeName", key: "RelativeName", type: { kind: $.TypeKind.Slice, typeName: "pkix.RDNSequence", elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RelativeDistinguishedNameSET", elemType: "pkix.AttributeTypeAndValue" } }, tag: "asn1:\"optional,tag:1\"", index: [1], offset: 24, exported: true }]
	)
}

export class distributionPoint {
	public get DistributionPoint(): distributionPointName {
		return this._fields.DistributionPoint.value
	}
	public set DistributionPoint(value: distributionPointName) {
		this._fields.DistributionPoint.value = value
	}

	public get Reason(): asn1.BitString {
		return this._fields.Reason.value
	}
	public set Reason(value: asn1.BitString) {
		this._fields.Reason.value = value
	}

	public get CRLIssuer(): asn1.RawValue {
		return this._fields.CRLIssuer.value
	}
	public set CRLIssuer(value: asn1.RawValue) {
		this._fields.CRLIssuer.value = value
	}

	public _fields: {
		DistributionPoint: $.VarRef<distributionPointName>
		Reason: $.VarRef<asn1.BitString>
		CRLIssuer: $.VarRef<asn1.RawValue>
	}

	constructor(init?: Partial<{DistributionPoint?: distributionPointName, Reason?: asn1.BitString, CRLIssuer?: asn1.RawValue}>) {
		this._fields = {
			DistributionPoint: $.varRef(init?.DistributionPoint ? $.markAsStructValue($.cloneStructValue(init.DistributionPoint)) : $.markAsStructValue(new distributionPointName())),
			Reason: $.varRef(init?.Reason ? $.markAsStructValue($.cloneStructValue(init.Reason)) : $.markAsStructValue(new asn1.BitString())),
			CRLIssuer: $.varRef(init?.CRLIssuer ? $.markAsStructValue($.cloneStructValue(init.CRLIssuer)) : $.markAsStructValue(new asn1.RawValue()))
		}
	}

	public clone(): distributionPoint {
		const cloned = new distributionPoint()
		cloned._fields = {
			DistributionPoint: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.DistributionPoint.value))),
			Reason: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Reason.value))),
			CRLIssuer: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.CRLIssuer.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.distributionPoint",
		() => new distributionPoint(),
		[],
		distributionPoint,
		[{ name: "DistributionPoint", key: "DistributionPoint", type: "x509.distributionPointName", tag: "asn1:\"optional,tag:0\"", index: [0], offset: 0, exported: true }, { name: "Reason", key: "Reason", type: "asn1.BitString", tag: "asn1:\"optional,tag:1\"", index: [1], offset: 48, exported: true }, { name: "CRLIssuer", key: "CRLIssuer", type: "asn1.RawValue", tag: "asn1:\"optional,tag:2\"", index: [2], offset: 80, exported: true }]
	)
}

export class CertificateRequest {
	public get Raw(): $.Slice<number> {
		return this._fields.Raw.value
	}
	public set Raw(value: $.Slice<number>) {
		this._fields.Raw.value = value
	}

	public get RawTBSCertificateRequest(): $.Slice<number> {
		return this._fields.RawTBSCertificateRequest.value
	}
	public set RawTBSCertificateRequest(value: $.Slice<number>) {
		this._fields.RawTBSCertificateRequest.value = value
	}

	public get RawSubjectPublicKeyInfo(): $.Slice<number> {
		return this._fields.RawSubjectPublicKeyInfo.value
	}
	public set RawSubjectPublicKeyInfo(value: $.Slice<number>) {
		this._fields.RawSubjectPublicKeyInfo.value = value
	}

	public get RawSubject(): $.Slice<number> {
		return this._fields.RawSubject.value
	}
	public set RawSubject(value: $.Slice<number>) {
		this._fields.RawSubject.value = value
	}

	public get Version(): number {
		return this._fields.Version.value
	}
	public set Version(value: number) {
		this._fields.Version.value = value
	}

	public get Signature(): $.Slice<number> {
		return this._fields.Signature.value
	}
	public set Signature(value: $.Slice<number>) {
		this._fields.Signature.value = value
	}

	public get SignatureAlgorithm(): SignatureAlgorithm {
		return this._fields.SignatureAlgorithm.value
	}
	public set SignatureAlgorithm(value: SignatureAlgorithm) {
		this._fields.SignatureAlgorithm.value = value
	}

	public get PublicKeyAlgorithm(): PublicKeyAlgorithm {
		return this._fields.PublicKeyAlgorithm.value
	}
	public set PublicKeyAlgorithm(value: PublicKeyAlgorithm) {
		this._fields.PublicKeyAlgorithm.value = value
	}

	public get PublicKey(): any {
		return this._fields.PublicKey.value
	}
	public set PublicKey(value: any) {
		this._fields.PublicKey.value = value
	}

	public get Subject(): pkix2.Name {
		return this._fields.Subject.value
	}
	public set Subject(value: pkix2.Name) {
		this._fields.Subject.value = value
	}

	// Attributes contains the CSR attributes that can parse as
	// pkix.AttributeTypeAndValueSET.
	//
	// Deprecated: Use Extensions and ExtraExtensions instead for parsing and
	// generating the requestedExtensions attribute.
	public get Attributes(): $.Slice<pkix2.AttributeTypeAndValueSET> {
		return this._fields.Attributes.value
	}
	public set Attributes(value: $.Slice<pkix2.AttributeTypeAndValueSET>) {
		this._fields.Attributes.value = value
	}

	// Extensions contains all requested extensions, in raw form. When parsing
	// CSRs, this can be used to extract extensions that are not parsed by this
	// package.
	public get Extensions(): $.Slice<pkix2.Extension> {
		return this._fields.Extensions.value
	}
	public set Extensions(value: $.Slice<pkix2.Extension>) {
		this._fields.Extensions.value = value
	}

	// ExtraExtensions contains extensions to be copied, raw, into any CSR
	// marshaled by CreateCertificateRequest. Values override any extensions
	// that would otherwise be produced based on the other fields but are
	// overridden by any extensions specified in Attributes.
	//
	// The ExtraExtensions field is not populated by ParseCertificateRequest,
	// see Extensions instead.
	public get ExtraExtensions(): $.Slice<pkix2.Extension> {
		return this._fields.ExtraExtensions.value
	}
	public set ExtraExtensions(value: $.Slice<pkix2.Extension>) {
		this._fields.ExtraExtensions.value = value
	}

	// Subject Alternate Name values.
	public get DNSNames(): $.Slice<string> {
		return this._fields.DNSNames.value
	}
	public set DNSNames(value: $.Slice<string>) {
		this._fields.DNSNames.value = value
	}

	public get EmailAddresses(): $.Slice<string> {
		return this._fields.EmailAddresses.value
	}
	public set EmailAddresses(value: $.Slice<string>) {
		this._fields.EmailAddresses.value = value
	}

	public get IPAddresses(): $.Slice<net.IP> {
		return this._fields.IPAddresses.value
	}
	public set IPAddresses(value: $.Slice<net.IP>) {
		this._fields.IPAddresses.value = value
	}

	public get URIs(): $.Slice<url.URL | $.VarRef<url.URL> | null> {
		return this._fields.URIs.value
	}
	public set URIs(value: $.Slice<url.URL | $.VarRef<url.URL> | null>) {
		this._fields.URIs.value = value
	}

	public _fields: {
		Raw: $.VarRef<$.Slice<number>>
		RawTBSCertificateRequest: $.VarRef<$.Slice<number>>
		RawSubjectPublicKeyInfo: $.VarRef<$.Slice<number>>
		RawSubject: $.VarRef<$.Slice<number>>
		Version: $.VarRef<number>
		Signature: $.VarRef<$.Slice<number>>
		SignatureAlgorithm: $.VarRef<SignatureAlgorithm>
		PublicKeyAlgorithm: $.VarRef<PublicKeyAlgorithm>
		PublicKey: $.VarRef<any>
		Subject: $.VarRef<pkix2.Name>
		Attributes: $.VarRef<$.Slice<pkix2.AttributeTypeAndValueSET>>
		Extensions: $.VarRef<$.Slice<pkix2.Extension>>
		ExtraExtensions: $.VarRef<$.Slice<pkix2.Extension>>
		DNSNames: $.VarRef<$.Slice<string>>
		EmailAddresses: $.VarRef<$.Slice<string>>
		IPAddresses: $.VarRef<$.Slice<net.IP>>
		URIs: $.VarRef<$.Slice<url.URL | $.VarRef<url.URL> | null>>
	}

	constructor(init?: Partial<{Raw?: $.Slice<number>, RawTBSCertificateRequest?: $.Slice<number>, RawSubjectPublicKeyInfo?: $.Slice<number>, RawSubject?: $.Slice<number>, Version?: number, Signature?: $.Slice<number>, SignatureAlgorithm?: SignatureAlgorithm, PublicKeyAlgorithm?: PublicKeyAlgorithm, PublicKey?: any, Subject?: pkix2.Name, Attributes?: $.Slice<pkix2.AttributeTypeAndValueSET>, Extensions?: $.Slice<pkix2.Extension>, ExtraExtensions?: $.Slice<pkix2.Extension>, DNSNames?: $.Slice<string>, EmailAddresses?: $.Slice<string>, IPAddresses?: $.Slice<net.IP>, URIs?: $.Slice<url.URL | $.VarRef<url.URL> | null>}>) {
		this._fields = {
			Raw: $.varRef(init?.Raw ?? (null as $.Slice<number>)),
			RawTBSCertificateRequest: $.varRef(init?.RawTBSCertificateRequest ?? (null as $.Slice<number>)),
			RawSubjectPublicKeyInfo: $.varRef(init?.RawSubjectPublicKeyInfo ?? (null as $.Slice<number>)),
			RawSubject: $.varRef(init?.RawSubject ?? (null as $.Slice<number>)),
			Version: $.varRef(init?.Version ?? (0 as number)),
			Signature: $.varRef(init?.Signature ?? (null as $.Slice<number>)),
			SignatureAlgorithm: $.varRef(init?.SignatureAlgorithm ?? (0 as SignatureAlgorithm)),
			PublicKeyAlgorithm: $.varRef(init?.PublicKeyAlgorithm ?? (0 as PublicKeyAlgorithm)),
			PublicKey: $.varRef(init?.PublicKey ?? (null as any)),
			Subject: $.varRef(init?.Subject ? $.markAsStructValue($.cloneStructValue(init.Subject)) : $.markAsStructValue(new pkix2.Name())),
			Attributes: $.varRef(init?.Attributes ?? (null as $.Slice<pkix2.AttributeTypeAndValueSET>)),
			Extensions: $.varRef(init?.Extensions ?? (null as $.Slice<pkix2.Extension>)),
			ExtraExtensions: $.varRef(init?.ExtraExtensions ?? (null as $.Slice<pkix2.Extension>)),
			DNSNames: $.varRef(init?.DNSNames ?? (null as $.Slice<string>)),
			EmailAddresses: $.varRef(init?.EmailAddresses ?? (null as $.Slice<string>)),
			IPAddresses: $.varRef(init?.IPAddresses ?? (null as $.Slice<net.IP>)),
			URIs: $.varRef(init?.URIs ?? (null as $.Slice<url.URL | $.VarRef<url.URL> | null>))
		}
	}

	public clone(): CertificateRequest {
		const cloned = new CertificateRequest()
		cloned._fields = {
			Raw: $.varRef(this._fields.Raw.value),
			RawTBSCertificateRequest: $.varRef(this._fields.RawTBSCertificateRequest.value),
			RawSubjectPublicKeyInfo: $.varRef(this._fields.RawSubjectPublicKeyInfo.value),
			RawSubject: $.varRef(this._fields.RawSubject.value),
			Version: $.varRef(this._fields.Version.value),
			Signature: $.varRef(this._fields.Signature.value),
			SignatureAlgorithm: $.varRef(this._fields.SignatureAlgorithm.value),
			PublicKeyAlgorithm: $.varRef(this._fields.PublicKeyAlgorithm.value),
			PublicKey: $.varRef(this._fields.PublicKey.value),
			Subject: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Subject.value))),
			Attributes: $.varRef(this._fields.Attributes.value),
			Extensions: $.varRef(this._fields.Extensions.value),
			ExtraExtensions: $.varRef(this._fields.ExtraExtensions.value),
			DNSNames: $.varRef(this._fields.DNSNames.value),
			EmailAddresses: $.varRef(this._fields.EmailAddresses.value),
			IPAddresses: $.varRef(this._fields.IPAddresses.value),
			URIs: $.varRef(this._fields.URIs.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async CheckSignature(): globalThis.Promise<$.GoError> {
		const c: CertificateRequest | $.VarRef<CertificateRequest> | null = this
		return checkSignature($.pointerValue<CertificateRequest>(c).SignatureAlgorithm, $.pointerValue<CertificateRequest>(c).RawTBSCertificateRequest, $.pointerValue<CertificateRequest>(c).Signature, ($.pointerValue<CertificateRequest>(c).PublicKey as crypto.PublicKey | null), true)
	}

	static __typeInfo = $.registerStructType(
		"x509.CertificateRequest",
		() => new CertificateRequest(),
		[{ name: "CheckSignature", args: [], returns: [{ name: "_r0", type: "error" }] }],
		CertificateRequest,
		[{ name: "Raw", key: "Raw", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "RawTBSCertificateRequest", key: "RawTBSCertificateRequest", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [1], offset: 24, exported: true }, { name: "RawSubjectPublicKeyInfo", key: "RawSubjectPublicKeyInfo", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [2], offset: 48, exported: true }, { name: "RawSubject", key: "RawSubject", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [3], offset: 72, exported: true }, { name: "Version", key: "Version", type: { kind: $.TypeKind.Basic, name: "int" }, index: [4], offset: 96, exported: true }, { name: "Signature", key: "Signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [5], offset: 104, exported: true }, { name: "SignatureAlgorithm", key: "SignatureAlgorithm", type: { kind: $.TypeKind.Basic, name: "int", typeName: "x509.SignatureAlgorithm" }, index: [6], offset: 128, exported: true }, { name: "PublicKeyAlgorithm", key: "PublicKeyAlgorithm", type: { kind: $.TypeKind.Basic, name: "int", typeName: "x509.PublicKeyAlgorithm" }, index: [7], offset: 136, exported: true }, { name: "PublicKey", key: "PublicKey", type: { kind: $.TypeKind.Interface, methods: [] }, index: [8], offset: 144, exported: true }, { name: "Subject", key: "Subject", type: "pkix.Name", index: [9], offset: 160, exported: true }, { name: "Attributes", key: "Attributes", type: { kind: $.TypeKind.Slice, elemType: "pkix.AttributeTypeAndValueSET" }, index: [10], offset: 408, exported: true }, { name: "Extensions", key: "Extensions", type: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" }, index: [11], offset: 432, exported: true }, { name: "ExtraExtensions", key: "ExtraExtensions", type: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" }, index: [12], offset: 456, exported: true }, { name: "DNSNames", key: "DNSNames", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [13], offset: 480, exported: true }, { name: "EmailAddresses", key: "EmailAddresses", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, index: [14], offset: 504, exported: true }, { name: "IPAddresses", key: "IPAddresses", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, typeName: "net.IP", elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, index: [15], offset: 528, exported: true }, { name: "URIs", key: "URIs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "url.URL" } }, index: [16], offset: 552, exported: true }]
	)
}

export class tbsCertificateRequest {
	public get Raw(): asn1.RawContent {
		return this._fields.Raw.value
	}
	public set Raw(value: asn1.RawContent) {
		this._fields.Raw.value = value
	}

	public get Version(): number {
		return this._fields.Version.value
	}
	public set Version(value: number) {
		this._fields.Version.value = value
	}

	public get Subject(): asn1.RawValue {
		return this._fields.Subject.value
	}
	public set Subject(value: asn1.RawValue) {
		this._fields.Subject.value = value
	}

	public get PublicKey(): publicKeyInfo {
		return this._fields.PublicKey.value
	}
	public set PublicKey(value: publicKeyInfo) {
		this._fields.PublicKey.value = value
	}

	public get RawAttributes(): $.Slice<asn1.RawValue> {
		return this._fields.RawAttributes.value
	}
	public set RawAttributes(value: $.Slice<asn1.RawValue>) {
		this._fields.RawAttributes.value = value
	}

	public _fields: {
		Raw: $.VarRef<asn1.RawContent>
		Version: $.VarRef<number>
		Subject: $.VarRef<asn1.RawValue>
		PublicKey: $.VarRef<publicKeyInfo>
		RawAttributes: $.VarRef<$.Slice<asn1.RawValue>>
	}

	constructor(init?: Partial<{Raw?: asn1.RawContent, Version?: number, Subject?: asn1.RawValue, PublicKey?: publicKeyInfo, RawAttributes?: $.Slice<asn1.RawValue>}>) {
		this._fields = {
			Raw: $.varRef(init?.Raw ?? (null as asn1.RawContent)),
			Version: $.varRef(init?.Version ?? (0 as number)),
			Subject: $.varRef(init?.Subject ? $.markAsStructValue($.cloneStructValue(init.Subject)) : $.markAsStructValue(new asn1.RawValue())),
			PublicKey: $.varRef(init?.PublicKey ? $.markAsStructValue($.cloneStructValue(init.PublicKey)) : $.markAsStructValue(new publicKeyInfo())),
			RawAttributes: $.varRef(init?.RawAttributes ?? (null as $.Slice<asn1.RawValue>))
		}
	}

	public clone(): tbsCertificateRequest {
		const cloned = new tbsCertificateRequest()
		cloned._fields = {
			Raw: $.varRef(this._fields.Raw.value),
			Version: $.varRef(this._fields.Version.value),
			Subject: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Subject.value))),
			PublicKey: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.PublicKey.value))),
			RawAttributes: $.varRef(this._fields.RawAttributes.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.tbsCertificateRequest",
		() => new tbsCertificateRequest(),
		[],
		tbsCertificateRequest,
		[{ name: "Raw", key: "Raw", type: { kind: $.TypeKind.Slice, typeName: "asn1.RawContent", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "Version", key: "Version", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 24, exported: true }, { name: "Subject", key: "Subject", type: "asn1.RawValue", index: [2], offset: 32, exported: true }, { name: "PublicKey", key: "PublicKey", type: "x509.publicKeyInfo", index: [3], offset: 104, exported: true }, { name: "RawAttributes", key: "RawAttributes", type: { kind: $.TypeKind.Slice, elemType: "asn1.RawValue" }, tag: "asn1:\"tag:0\"", index: [4], offset: 256, exported: true }]
	)
}

export class certificateRequest {
	public get Raw(): asn1.RawContent {
		return this._fields.Raw.value
	}
	public set Raw(value: asn1.RawContent) {
		this._fields.Raw.value = value
	}

	public get TBSCSR(): tbsCertificateRequest {
		return this._fields.TBSCSR.value
	}
	public set TBSCSR(value: tbsCertificateRequest) {
		this._fields.TBSCSR.value = value
	}

	public get SignatureAlgorithm(): pkix2.AlgorithmIdentifier {
		return this._fields.SignatureAlgorithm.value
	}
	public set SignatureAlgorithm(value: pkix2.AlgorithmIdentifier) {
		this._fields.SignatureAlgorithm.value = value
	}

	public get SignatureValue(): asn1.BitString {
		return this._fields.SignatureValue.value
	}
	public set SignatureValue(value: asn1.BitString) {
		this._fields.SignatureValue.value = value
	}

	public _fields: {
		Raw: $.VarRef<asn1.RawContent>
		TBSCSR: $.VarRef<tbsCertificateRequest>
		SignatureAlgorithm: $.VarRef<pkix2.AlgorithmIdentifier>
		SignatureValue: $.VarRef<asn1.BitString>
	}

	constructor(init?: Partial<{Raw?: asn1.RawContent, TBSCSR?: tbsCertificateRequest, SignatureAlgorithm?: pkix2.AlgorithmIdentifier, SignatureValue?: asn1.BitString}>) {
		this._fields = {
			Raw: $.varRef(init?.Raw ?? (null as asn1.RawContent)),
			TBSCSR: $.varRef(init?.TBSCSR ? $.markAsStructValue($.cloneStructValue(init.TBSCSR)) : $.markAsStructValue(new tbsCertificateRequest())),
			SignatureAlgorithm: $.varRef(init?.SignatureAlgorithm ? $.markAsStructValue($.cloneStructValue(init.SignatureAlgorithm)) : $.markAsStructValue(new pkix2.AlgorithmIdentifier())),
			SignatureValue: $.varRef(init?.SignatureValue ? $.markAsStructValue($.cloneStructValue(init.SignatureValue)) : $.markAsStructValue(new asn1.BitString()))
		}
	}

	public clone(): certificateRequest {
		const cloned = new certificateRequest()
		cloned._fields = {
			Raw: $.varRef(this._fields.Raw.value),
			TBSCSR: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.TBSCSR.value))),
			SignatureAlgorithm: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.SignatureAlgorithm.value))),
			SignatureValue: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.SignatureValue.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.certificateRequest",
		() => new certificateRequest(),
		[],
		certificateRequest,
		[{ name: "Raw", key: "Raw", type: { kind: $.TypeKind.Slice, typeName: "asn1.RawContent", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "TBSCSR", key: "TBSCSR", type: "x509.tbsCertificateRequest", index: [1], offset: 24, exported: true }, { name: "SignatureAlgorithm", key: "SignatureAlgorithm", type: "pkix.AlgorithmIdentifier", index: [2], offset: 304, exported: true }, { name: "SignatureValue", key: "SignatureValue", type: "asn1.BitString", index: [3], offset: 400, exported: true }]
	)
}

export class RevocationListEntry {
	// Raw contains the raw bytes of the revokedCertificates entry. It is set when
	// parsing a CRL; it is ignored when generating a CRL.
	public get Raw(): $.Slice<number> {
		return this._fields.Raw.value
	}
	public set Raw(value: $.Slice<number>) {
		this._fields.Raw.value = value
	}

	// SerialNumber represents the serial number of a revoked certificate. It is
	// both used when creating a CRL and populated when parsing a CRL. It must not
	// be nil.
	public get SerialNumber(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.SerialNumber.value
	}
	public set SerialNumber(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.SerialNumber.value = value
	}

	// RevocationTime represents the time at which the certificate was revoked. It
	// is both used when creating a CRL and populated when parsing a CRL. It must
	// not be the zero time.
	public get RevocationTime(): time.Time {
		return this._fields.RevocationTime.value
	}
	public set RevocationTime(value: time.Time) {
		this._fields.RevocationTime.value = value
	}

	// ReasonCode represents the reason for revocation, using the integer enum
	// values specified in RFC 5280 Section 5.3.1. When creating a CRL, the zero
	// value will result in the reasonCode extension being omitted. When parsing a
	// CRL, the zero value may represent either the reasonCode extension being
	// absent (which implies the default revocation reason of 0/Unspecified), or
	// it may represent the reasonCode extension being present and explicitly
	// containing a value of 0/Unspecified (which should not happen according to
	// the DER encoding rules, but can and does happen anyway).
	public get ReasonCode(): number {
		return this._fields.ReasonCode.value
	}
	public set ReasonCode(value: number) {
		this._fields.ReasonCode.value = value
	}

	// Extensions contains raw X.509 extensions. When parsing CRL entries,
	// this can be used to extract non-critical extensions that are not
	// parsed by this package. When marshaling CRL entries, the Extensions
	// field is ignored, see ExtraExtensions.
	public get Extensions(): $.Slice<pkix2.Extension> {
		return this._fields.Extensions.value
	}
	public set Extensions(value: $.Slice<pkix2.Extension>) {
		this._fields.Extensions.value = value
	}

	// ExtraExtensions contains extensions to be copied, raw, into any
	// marshaled CRL entries. Values override any extensions that would
	// otherwise be produced based on the other fields. The ExtraExtensions
	// field is not populated when parsing CRL entries, see Extensions.
	public get ExtraExtensions(): $.Slice<pkix2.Extension> {
		return this._fields.ExtraExtensions.value
	}
	public set ExtraExtensions(value: $.Slice<pkix2.Extension>) {
		this._fields.ExtraExtensions.value = value
	}

	public _fields: {
		Raw: $.VarRef<$.Slice<number>>
		SerialNumber: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		RevocationTime: $.VarRef<time.Time>
		ReasonCode: $.VarRef<number>
		Extensions: $.VarRef<$.Slice<pkix2.Extension>>
		ExtraExtensions: $.VarRef<$.Slice<pkix2.Extension>>
	}

	constructor(init?: Partial<{Raw?: $.Slice<number>, SerialNumber?: big.Int | $.VarRef<big.Int> | null, RevocationTime?: time.Time, ReasonCode?: number, Extensions?: $.Slice<pkix2.Extension>, ExtraExtensions?: $.Slice<pkix2.Extension>}>) {
		this._fields = {
			Raw: $.varRef(init?.Raw ?? (null as $.Slice<number>)),
			SerialNumber: $.varRef(init?.SerialNumber ?? (null as big.Int | $.VarRef<big.Int> | null)),
			RevocationTime: $.varRef(init?.RevocationTime ? $.markAsStructValue($.cloneStructValue(init.RevocationTime)) : $.markAsStructValue(new time.Time())),
			ReasonCode: $.varRef(init?.ReasonCode ?? (0 as number)),
			Extensions: $.varRef(init?.Extensions ?? (null as $.Slice<pkix2.Extension>)),
			ExtraExtensions: $.varRef(init?.ExtraExtensions ?? (null as $.Slice<pkix2.Extension>))
		}
	}

	public clone(): RevocationListEntry {
		const cloned = new RevocationListEntry()
		cloned._fields = {
			Raw: $.varRef(this._fields.Raw.value),
			SerialNumber: $.varRef(this._fields.SerialNumber.value),
			RevocationTime: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.RevocationTime.value))),
			ReasonCode: $.varRef(this._fields.ReasonCode.value),
			Extensions: $.varRef(this._fields.Extensions.value),
			ExtraExtensions: $.varRef(this._fields.ExtraExtensions.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.RevocationListEntry",
		() => new RevocationListEntry(),
		[],
		RevocationListEntry,
		[{ name: "Raw", key: "Raw", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "SerialNumber", key: "SerialNumber", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [1], offset: 24, exported: true }, { name: "RevocationTime", key: "RevocationTime", type: "time.Time", index: [2], offset: 32, exported: true }, { name: "ReasonCode", key: "ReasonCode", type: { kind: $.TypeKind.Basic, name: "int" }, index: [3], offset: 56, exported: true }, { name: "Extensions", key: "Extensions", type: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" }, index: [4], offset: 64, exported: true }, { name: "ExtraExtensions", key: "ExtraExtensions", type: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" }, index: [5], offset: 88, exported: true }]
	)
}

export class RevocationList {
	// Raw contains the complete ASN.1 DER content of the CRL (tbsCertList,
	// signatureAlgorithm, and signatureValue.)
	public get Raw(): $.Slice<number> {
		return this._fields.Raw.value
	}
	public set Raw(value: $.Slice<number>) {
		this._fields.Raw.value = value
	}

	// RawTBSRevocationList contains just the tbsCertList portion of the ASN.1
	// DER.
	public get RawTBSRevocationList(): $.Slice<number> {
		return this._fields.RawTBSRevocationList.value
	}
	public set RawTBSRevocationList(value: $.Slice<number>) {
		this._fields.RawTBSRevocationList.value = value
	}

	// RawIssuer contains the DER encoded Issuer.
	public get RawIssuer(): $.Slice<number> {
		return this._fields.RawIssuer.value
	}
	public set RawIssuer(value: $.Slice<number>) {
		this._fields.RawIssuer.value = value
	}

	// Issuer contains the DN of the issuing certificate.
	public get Issuer(): pkix2.Name {
		return this._fields.Issuer.value
	}
	public set Issuer(value: pkix2.Name) {
		this._fields.Issuer.value = value
	}

	// AuthorityKeyId is used to identify the public key associated with the
	// issuing certificate. It is populated from the authorityKeyIdentifier
	// extension when parsing a CRL. It is ignored when creating a CRL; the
	// extension is populated from the issuing certificate itself.
	public get AuthorityKeyId(): $.Slice<number> {
		return this._fields.AuthorityKeyId.value
	}
	public set AuthorityKeyId(value: $.Slice<number>) {
		this._fields.AuthorityKeyId.value = value
	}

	public get Signature(): $.Slice<number> {
		return this._fields.Signature.value
	}
	public set Signature(value: $.Slice<number>) {
		this._fields.Signature.value = value
	}

	// SignatureAlgorithm is used to determine the signature algorithm to be
	// used when signing the CRL. If 0 the default algorithm for the signing
	// key will be used.
	public get SignatureAlgorithm(): SignatureAlgorithm {
		return this._fields.SignatureAlgorithm.value
	}
	public set SignatureAlgorithm(value: SignatureAlgorithm) {
		this._fields.SignatureAlgorithm.value = value
	}

	// RevokedCertificateEntries represents the revokedCertificates sequence in
	// the CRL. It is used when creating a CRL and also populated when parsing a
	// CRL. When creating a CRL, it may be empty or nil, in which case the
	// revokedCertificates ASN.1 sequence will be omitted from the CRL entirely.
	public get RevokedCertificateEntries(): $.Slice<RevocationListEntry> {
		return this._fields.RevokedCertificateEntries.value
	}
	public set RevokedCertificateEntries(value: $.Slice<RevocationListEntry>) {
		this._fields.RevokedCertificateEntries.value = value
	}

	// RevokedCertificates is used to populate the revokedCertificates
	// sequence in the CRL if RevokedCertificateEntries is empty. It may be empty
	// or nil, in which case an empty CRL will be created.
	//
	// Deprecated: Use RevokedCertificateEntries instead.
	public get RevokedCertificates(): $.Slice<pkix2.RevokedCertificate> {
		return this._fields.RevokedCertificates.value
	}
	public set RevokedCertificates(value: $.Slice<pkix2.RevokedCertificate>) {
		this._fields.RevokedCertificates.value = value
	}

	// Number is used to populate the X.509 v2 cRLNumber extension in the CRL,
	// which should be a monotonically increasing sequence number for a given
	// CRL scope and CRL issuer. It is also populated from the cRLNumber
	// extension when parsing a CRL.
	public get Number(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Number.value
	}
	public set Number(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Number.value = value
	}

	// ThisUpdate is used to populate the thisUpdate field in the CRL, which
	// indicates the issuance date of the CRL.
	public get ThisUpdate(): time.Time {
		return this._fields.ThisUpdate.value
	}
	public set ThisUpdate(value: time.Time) {
		this._fields.ThisUpdate.value = value
	}

	// NextUpdate is used to populate the nextUpdate field in the CRL, which
	// indicates the date by which the next CRL will be issued. NextUpdate
	// must be greater than ThisUpdate.
	public get NextUpdate(): time.Time {
		return this._fields.NextUpdate.value
	}
	public set NextUpdate(value: time.Time) {
		this._fields.NextUpdate.value = value
	}

	// Extensions contains raw X.509 extensions. When creating a CRL,
	// the Extensions field is ignored, see ExtraExtensions.
	public get Extensions(): $.Slice<pkix2.Extension> {
		return this._fields.Extensions.value
	}
	public set Extensions(value: $.Slice<pkix2.Extension>) {
		this._fields.Extensions.value = value
	}

	// ExtraExtensions contains any additional extensions to add directly to
	// the CRL.
	public get ExtraExtensions(): $.Slice<pkix2.Extension> {
		return this._fields.ExtraExtensions.value
	}
	public set ExtraExtensions(value: $.Slice<pkix2.Extension>) {
		this._fields.ExtraExtensions.value = value
	}

	public _fields: {
		Raw: $.VarRef<$.Slice<number>>
		RawTBSRevocationList: $.VarRef<$.Slice<number>>
		RawIssuer: $.VarRef<$.Slice<number>>
		Issuer: $.VarRef<pkix2.Name>
		AuthorityKeyId: $.VarRef<$.Slice<number>>
		Signature: $.VarRef<$.Slice<number>>
		SignatureAlgorithm: $.VarRef<SignatureAlgorithm>
		RevokedCertificateEntries: $.VarRef<$.Slice<RevocationListEntry>>
		RevokedCertificates: $.VarRef<$.Slice<pkix2.RevokedCertificate>>
		Number: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		ThisUpdate: $.VarRef<time.Time>
		NextUpdate: $.VarRef<time.Time>
		Extensions: $.VarRef<$.Slice<pkix2.Extension>>
		ExtraExtensions: $.VarRef<$.Slice<pkix2.Extension>>
	}

	constructor(init?: Partial<{Raw?: $.Slice<number>, RawTBSRevocationList?: $.Slice<number>, RawIssuer?: $.Slice<number>, Issuer?: pkix2.Name, AuthorityKeyId?: $.Slice<number>, Signature?: $.Slice<number>, SignatureAlgorithm?: SignatureAlgorithm, RevokedCertificateEntries?: $.Slice<RevocationListEntry>, RevokedCertificates?: $.Slice<pkix2.RevokedCertificate>, Number?: big.Int | $.VarRef<big.Int> | null, ThisUpdate?: time.Time, NextUpdate?: time.Time, Extensions?: $.Slice<pkix2.Extension>, ExtraExtensions?: $.Slice<pkix2.Extension>}>) {
		this._fields = {
			Raw: $.varRef(init?.Raw ?? (null as $.Slice<number>)),
			RawTBSRevocationList: $.varRef(init?.RawTBSRevocationList ?? (null as $.Slice<number>)),
			RawIssuer: $.varRef(init?.RawIssuer ?? (null as $.Slice<number>)),
			Issuer: $.varRef(init?.Issuer ? $.markAsStructValue($.cloneStructValue(init.Issuer)) : $.markAsStructValue(new pkix2.Name())),
			AuthorityKeyId: $.varRef(init?.AuthorityKeyId ?? (null as $.Slice<number>)),
			Signature: $.varRef(init?.Signature ?? (null as $.Slice<number>)),
			SignatureAlgorithm: $.varRef(init?.SignatureAlgorithm ?? (0 as SignatureAlgorithm)),
			RevokedCertificateEntries: $.varRef(init?.RevokedCertificateEntries ?? (null as $.Slice<RevocationListEntry>)),
			RevokedCertificates: $.varRef(init?.RevokedCertificates ?? (null as $.Slice<pkix2.RevokedCertificate>)),
			Number: $.varRef(init?.Number ?? (null as big.Int | $.VarRef<big.Int> | null)),
			ThisUpdate: $.varRef(init?.ThisUpdate ? $.markAsStructValue($.cloneStructValue(init.ThisUpdate)) : $.markAsStructValue(new time.Time())),
			NextUpdate: $.varRef(init?.NextUpdate ? $.markAsStructValue($.cloneStructValue(init.NextUpdate)) : $.markAsStructValue(new time.Time())),
			Extensions: $.varRef(init?.Extensions ?? (null as $.Slice<pkix2.Extension>)),
			ExtraExtensions: $.varRef(init?.ExtraExtensions ?? (null as $.Slice<pkix2.Extension>))
		}
	}

	public clone(): RevocationList {
		const cloned = new RevocationList()
		cloned._fields = {
			Raw: $.varRef(this._fields.Raw.value),
			RawTBSRevocationList: $.varRef(this._fields.RawTBSRevocationList.value),
			RawIssuer: $.varRef(this._fields.RawIssuer.value),
			Issuer: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Issuer.value))),
			AuthorityKeyId: $.varRef(this._fields.AuthorityKeyId.value),
			Signature: $.varRef(this._fields.Signature.value),
			SignatureAlgorithm: $.varRef(this._fields.SignatureAlgorithm.value),
			RevokedCertificateEntries: $.varRef(this._fields.RevokedCertificateEntries.value),
			RevokedCertificates: $.varRef(this._fields.RevokedCertificates.value),
			Number: $.varRef(this._fields.Number.value),
			ThisUpdate: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ThisUpdate.value))),
			NextUpdate: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.NextUpdate.value))),
			Extensions: $.varRef(this._fields.Extensions.value),
			ExtraExtensions: $.varRef(this._fields.ExtraExtensions.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async CheckSignatureFrom(parent: Certificate | $.VarRef<Certificate> | null): globalThis.Promise<$.GoError> {
		const rl: RevocationList | $.VarRef<RevocationList> | null = this
		if ((($.pointerValue<Certificate>(parent).Version == 3) && !$.pointerValue<Certificate>(parent).BasicConstraintsValid) || ($.pointerValue<Certificate>(parent).BasicConstraintsValid && !$.pointerValue<Certificate>(parent).IsCA)) {
			return $.interfaceValue<$.GoError>($.markAsStructValue(new ConstraintViolationError()), "x509.ConstraintViolationError", "x509.ConstraintViolationError")
		}

		if (($.pointerValue<Certificate>(parent).KeyUsage != 0) && (($.pointerValue<Certificate>(parent).KeyUsage & 64) == 0)) {
			return $.interfaceValue<$.GoError>($.markAsStructValue(new ConstraintViolationError()), "x509.ConstraintViolationError", "x509.ConstraintViolationError")
		}

		if ($.pointerValue<Certificate>(parent).PublicKeyAlgorithm == 0) {
			return ErrUnsupportedAlgorithm
		}

		return Certificate.prototype.CheckSignature.call(parent, $.pointerValue<RevocationList>(rl).SignatureAlgorithm, $.pointerValue<RevocationList>(rl).RawTBSRevocationList, $.pointerValue<RevocationList>(rl).Signature)
	}

	static __typeInfo = $.registerStructType(
		"x509.RevocationList",
		() => new RevocationList(),
		[{ name: "CheckSignatureFrom", args: [{ name: "parent", type: { kind: $.TypeKind.Pointer, elemType: "x509.Certificate" } }], returns: [{ name: "_r0", type: "error" }] }],
		RevocationList,
		[{ name: "Raw", key: "Raw", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "RawTBSRevocationList", key: "RawTBSRevocationList", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [1], offset: 24, exported: true }, { name: "RawIssuer", key: "RawIssuer", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [2], offset: 48, exported: true }, { name: "Issuer", key: "Issuer", type: "pkix.Name", index: [3], offset: 72, exported: true }, { name: "AuthorityKeyId", key: "AuthorityKeyId", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [4], offset: 320, exported: true }, { name: "Signature", key: "Signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [5], offset: 344, exported: true }, { name: "SignatureAlgorithm", key: "SignatureAlgorithm", type: { kind: $.TypeKind.Basic, name: "int", typeName: "x509.SignatureAlgorithm" }, index: [6], offset: 368, exported: true }, { name: "RevokedCertificateEntries", key: "RevokedCertificateEntries", type: { kind: $.TypeKind.Slice, elemType: "x509.RevocationListEntry" }, index: [7], offset: 376, exported: true }, { name: "RevokedCertificates", key: "RevokedCertificates", type: { kind: $.TypeKind.Slice, elemType: "pkix.RevokedCertificate" }, index: [8], offset: 400, exported: true }, { name: "Number", key: "Number", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [9], offset: 424, exported: true }, { name: "ThisUpdate", key: "ThisUpdate", type: "time.Time", index: [10], offset: 432, exported: true }, { name: "NextUpdate", key: "NextUpdate", type: "time.Time", index: [11], offset: 456, exported: true }, { name: "Extensions", key: "Extensions", type: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" }, index: [12], offset: 480, exported: true }, { name: "ExtraExtensions", key: "ExtraExtensions", type: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" }, index: [13], offset: 504, exported: true }]
	)
}

export class tbsCertificateList {
	public get Raw(): asn1.RawContent {
		return this._fields.Raw.value
	}
	public set Raw(value: asn1.RawContent) {
		this._fields.Raw.value = value
	}

	public get Version(): number {
		return this._fields.Version.value
	}
	public set Version(value: number) {
		this._fields.Version.value = value
	}

	public get Signature(): pkix2.AlgorithmIdentifier {
		return this._fields.Signature.value
	}
	public set Signature(value: pkix2.AlgorithmIdentifier) {
		this._fields.Signature.value = value
	}

	public get Issuer(): asn1.RawValue {
		return this._fields.Issuer.value
	}
	public set Issuer(value: asn1.RawValue) {
		this._fields.Issuer.value = value
	}

	public get ThisUpdate(): time.Time {
		return this._fields.ThisUpdate.value
	}
	public set ThisUpdate(value: time.Time) {
		this._fields.ThisUpdate.value = value
	}

	public get NextUpdate(): time.Time {
		return this._fields.NextUpdate.value
	}
	public set NextUpdate(value: time.Time) {
		this._fields.NextUpdate.value = value
	}

	public get RevokedCertificates(): $.Slice<pkix2.RevokedCertificate> {
		return this._fields.RevokedCertificates.value
	}
	public set RevokedCertificates(value: $.Slice<pkix2.RevokedCertificate>) {
		this._fields.RevokedCertificates.value = value
	}

	public get Extensions(): $.Slice<pkix2.Extension> {
		return this._fields.Extensions.value
	}
	public set Extensions(value: $.Slice<pkix2.Extension>) {
		this._fields.Extensions.value = value
	}

	public _fields: {
		Raw: $.VarRef<asn1.RawContent>
		Version: $.VarRef<number>
		Signature: $.VarRef<pkix2.AlgorithmIdentifier>
		Issuer: $.VarRef<asn1.RawValue>
		ThisUpdate: $.VarRef<time.Time>
		NextUpdate: $.VarRef<time.Time>
		RevokedCertificates: $.VarRef<$.Slice<pkix2.RevokedCertificate>>
		Extensions: $.VarRef<$.Slice<pkix2.Extension>>
	}

	constructor(init?: Partial<{Raw?: asn1.RawContent, Version?: number, Signature?: pkix2.AlgorithmIdentifier, Issuer?: asn1.RawValue, ThisUpdate?: time.Time, NextUpdate?: time.Time, RevokedCertificates?: $.Slice<pkix2.RevokedCertificate>, Extensions?: $.Slice<pkix2.Extension>}>) {
		this._fields = {
			Raw: $.varRef(init?.Raw ?? (null as asn1.RawContent)),
			Version: $.varRef(init?.Version ?? (0 as number)),
			Signature: $.varRef(init?.Signature ? $.markAsStructValue($.cloneStructValue(init.Signature)) : $.markAsStructValue(new pkix2.AlgorithmIdentifier())),
			Issuer: $.varRef(init?.Issuer ? $.markAsStructValue($.cloneStructValue(init.Issuer)) : $.markAsStructValue(new asn1.RawValue())),
			ThisUpdate: $.varRef(init?.ThisUpdate ? $.markAsStructValue($.cloneStructValue(init.ThisUpdate)) : $.markAsStructValue(new time.Time())),
			NextUpdate: $.varRef(init?.NextUpdate ? $.markAsStructValue($.cloneStructValue(init.NextUpdate)) : $.markAsStructValue(new time.Time())),
			RevokedCertificates: $.varRef(init?.RevokedCertificates ?? (null as $.Slice<pkix2.RevokedCertificate>)),
			Extensions: $.varRef(init?.Extensions ?? (null as $.Slice<pkix2.Extension>))
		}
	}

	public clone(): tbsCertificateList {
		const cloned = new tbsCertificateList()
		cloned._fields = {
			Raw: $.varRef(this._fields.Raw.value),
			Version: $.varRef(this._fields.Version.value),
			Signature: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Signature.value))),
			Issuer: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Issuer.value))),
			ThisUpdate: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ThisUpdate.value))),
			NextUpdate: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.NextUpdate.value))),
			RevokedCertificates: $.varRef(this._fields.RevokedCertificates.value),
			Extensions: $.varRef(this._fields.Extensions.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.tbsCertificateList",
		() => new tbsCertificateList(),
		[],
		tbsCertificateList,
		[{ name: "Raw", key: "Raw", type: { kind: $.TypeKind.Slice, typeName: "asn1.RawContent", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "Version", key: "Version", type: { kind: $.TypeKind.Basic, name: "int" }, tag: "asn1:\"optional,default:0\"", index: [1], offset: 24, exported: true }, { name: "Signature", key: "Signature", type: "pkix.AlgorithmIdentifier", index: [2], offset: 32, exported: true }, { name: "Issuer", key: "Issuer", type: "asn1.RawValue", index: [3], offset: 128, exported: true }, { name: "ThisUpdate", key: "ThisUpdate", type: "time.Time", index: [4], offset: 200, exported: true }, { name: "NextUpdate", key: "NextUpdate", type: "time.Time", tag: "asn1:\"optional\"", index: [5], offset: 224, exported: true }, { name: "RevokedCertificates", key: "RevokedCertificates", type: { kind: $.TypeKind.Slice, elemType: "pkix.RevokedCertificate" }, tag: "asn1:\"optional\"", index: [6], offset: 248, exported: true }, { name: "Extensions", key: "Extensions", type: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" }, tag: "asn1:\"tag:0,optional,explicit\"", index: [7], offset: 272, exported: true }]
	)
}

export class certificateList {
	public get TBSCertList(): tbsCertificateList {
		return this._fields.TBSCertList.value
	}
	public set TBSCertList(value: tbsCertificateList) {
		this._fields.TBSCertList.value = value
	}

	public get SignatureAlgorithm(): pkix2.AlgorithmIdentifier {
		return this._fields.SignatureAlgorithm.value
	}
	public set SignatureAlgorithm(value: pkix2.AlgorithmIdentifier) {
		this._fields.SignatureAlgorithm.value = value
	}

	public get SignatureValue(): asn1.BitString {
		return this._fields.SignatureValue.value
	}
	public set SignatureValue(value: asn1.BitString) {
		this._fields.SignatureValue.value = value
	}

	public _fields: {
		TBSCertList: $.VarRef<tbsCertificateList>
		SignatureAlgorithm: $.VarRef<pkix2.AlgorithmIdentifier>
		SignatureValue: $.VarRef<asn1.BitString>
	}

	constructor(init?: Partial<{TBSCertList?: tbsCertificateList, SignatureAlgorithm?: pkix2.AlgorithmIdentifier, SignatureValue?: asn1.BitString}>) {
		this._fields = {
			TBSCertList: $.varRef(init?.TBSCertList ? $.markAsStructValue($.cloneStructValue(init.TBSCertList)) : $.markAsStructValue(new tbsCertificateList())),
			SignatureAlgorithm: $.varRef(init?.SignatureAlgorithm ? $.markAsStructValue($.cloneStructValue(init.SignatureAlgorithm)) : $.markAsStructValue(new pkix2.AlgorithmIdentifier())),
			SignatureValue: $.varRef(init?.SignatureValue ? $.markAsStructValue($.cloneStructValue(init.SignatureValue)) : $.markAsStructValue(new asn1.BitString()))
		}
	}

	public clone(): certificateList {
		const cloned = new certificateList()
		cloned._fields = {
			TBSCertList: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.TBSCertList.value))),
			SignatureAlgorithm: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.SignatureAlgorithm.value))),
			SignatureValue: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.SignatureValue.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.certificateList",
		() => new certificateList(),
		[],
		certificateList,
		[{ name: "TBSCertList", key: "TBSCertList", type: "x509.tbsCertificateList", index: [0], offset: 0, exported: true }, { name: "SignatureAlgorithm", key: "SignatureAlgorithm", type: "pkix.AlgorithmIdentifier", index: [1], offset: 296, exported: true }, { name: "SignatureValue", key: "SignatureValue", type: "asn1.BitString", index: [2], offset: 392, exported: true }]
	)
}

export const UnknownSignatureAlgorithm: SignatureAlgorithm = 0

export const MD2WithRSA: SignatureAlgorithm = 1

export const MD5WithRSA: SignatureAlgorithm = 2

export const SHA1WithRSA: SignatureAlgorithm = 3

export const SHA256WithRSA: SignatureAlgorithm = 4

export const SHA384WithRSA: SignatureAlgorithm = 5

export const SHA512WithRSA: SignatureAlgorithm = 6

export const DSAWithSHA1: SignatureAlgorithm = 7

export const DSAWithSHA256: SignatureAlgorithm = 8

export const ECDSAWithSHA1: SignatureAlgorithm = 9

export const ECDSAWithSHA256: SignatureAlgorithm = 10

export const ECDSAWithSHA384: SignatureAlgorithm = 11

export const ECDSAWithSHA512: SignatureAlgorithm = 12

export const SHA256WithRSAPSS: SignatureAlgorithm = 13

export const SHA384WithRSAPSS: SignatureAlgorithm = 14

export const SHA512WithRSAPSS: SignatureAlgorithm = 15

export const PureEd25519: SignatureAlgorithm = 16

export const UnknownPublicKeyAlgorithm: PublicKeyAlgorithm = 0

export const RSA: PublicKeyAlgorithm = 1

export const DSA: PublicKeyAlgorithm = 2

export const ECDSA: PublicKeyAlgorithm = 3

export const Ed25519: PublicKeyAlgorithm = 4

export const KeyUsageDigitalSignature: KeyUsage = 1

export const KeyUsageContentCommitment: KeyUsage = 2

export const KeyUsageKeyEncipherment: KeyUsage = 4

export const KeyUsageDataEncipherment: KeyUsage = 8

export const KeyUsageKeyAgreement: KeyUsage = 16

export const KeyUsageCertSign: KeyUsage = 32

export const KeyUsageCRLSign: KeyUsage = 64

export const KeyUsageEncipherOnly: KeyUsage = 128

export const KeyUsageDecipherOnly: KeyUsage = 256

export const ExtKeyUsageAny: ExtKeyUsage = 0

export const ExtKeyUsageServerAuth: ExtKeyUsage = 1

export const ExtKeyUsageClientAuth: ExtKeyUsage = 2

export const ExtKeyUsageCodeSigning: ExtKeyUsage = 3

export const ExtKeyUsageEmailProtection: ExtKeyUsage = 4

export const ExtKeyUsageIPSECEndSystem: ExtKeyUsage = 5

export const ExtKeyUsageIPSECTunnel: ExtKeyUsage = 6

export const ExtKeyUsageIPSECUser: ExtKeyUsage = 7

export const ExtKeyUsageTimeStamping: ExtKeyUsage = 8

export const ExtKeyUsageOCSPSigning: ExtKeyUsage = 9

export const ExtKeyUsageMicrosoftServerGatedCrypto: ExtKeyUsage = 10

export const ExtKeyUsageNetscapeServerGatedCrypto: ExtKeyUsage = 11

export const ExtKeyUsageMicrosoftCommercialCodeSigning: ExtKeyUsage = 12

export const ExtKeyUsageMicrosoftKernelCodeSigning: ExtKeyUsage = 13

export const nameTypeEmail: number = 1

export const nameTypeDNS: number = 2

export const nameTypeURI: number = 6

export const nameTypeIP: number = 7

export async function ParsePKIXPublicKey(derBytes: $.Slice<number>): globalThis.Promise<[any, $.GoError]> {
	let pub: any = null as any
	let err: $.GoError = null as $.GoError
	let pki: $.VarRef<publicKeyInfo> = $.varRef($.markAsStructValue(new publicKeyInfo()))
	{
		let __goscriptTuple0: any = await asn1.Unmarshal(derBytes, $.interfaceValue<any>(pki, "*x509.publicKeyInfo", { kind: $.TypeKind.Pointer, elemType: "x509.publicKeyInfo" }))
		let rest: $.Slice<number> = __goscriptTuple0[0]
		let __goscriptShadow0 = __goscriptTuple0[1]
		if (__goscriptShadow0 != null) {
			{
				let [, __goscriptShadow1] = await asn1.Unmarshal(derBytes, $.interfaceValue<any>(new __goscript_pkcs1.pkcs1PublicKey(), "*x509.pkcs1PublicKey", { kind: $.TypeKind.Pointer, elemType: "x509.pkcs1PublicKey" }))
				if (__goscriptShadow1 == null) {
					return [null, errors.New("x509: failed to parse public key (use ParsePKCS1PublicKey instead for this key format)")]
				}
			}
			return [null, __goscriptShadow0]
		} else {
			if ($.len(rest) != 0) {
				return [null, errors.New("x509: trailing data after ASN.1 of public-key")]
			}
		}
	}
	return __goscript_parser.parsePublicKey(pki)
}

export async function marshalPublicKey(pub: any): globalThis.Promise<[$.Slice<number>, pkix2.AlgorithmIdentifier, $.GoError]> {
	let publicKeyBytes: $.Slice<number> = null as $.Slice<number>
	let publicKeyAlgorithm: pkix2.AlgorithmIdentifier = $.markAsStructValue(new pkix2.AlgorithmIdentifier())
	let err: $.GoError = null as $.GoError
	{
		const __goscriptTypeSwitchValue = pub
		switch (true) {
			case $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).ok:
				{
					let pub: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).value
					let __goscriptTuple1: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue(new __goscript_pkcs1.pkcs1PublicKey({N: $.pointerValue<rsa.PublicKey>(pub).N, E: $.pointerValue<rsa.PublicKey>(pub).E})), "x509.pkcs1PublicKey", "x509.pkcs1PublicKey"))
					publicKeyBytes = __goscriptTuple1[0]
					err = __goscriptTuple1[1]
					if (err != null) {
						return [null, $.markAsStructValue(new pkix2.AlgorithmIdentifier()), err]
					}
					publicKeyAlgorithm.Algorithm = (oidPublicKeyRSA as asn1.ObjectIdentifier)
					// This is a NULL parameters value which is required by
					// RFC 3279, Section 2.3.1.
					publicKeyAlgorithm.Parameters = $.markAsStructValue($.cloneStructValue($.pointerValue<asn1.RawValue>(asn1.__goscript_get_NullRawValue())))
				}
				break
			case $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).ok:
				{
					let pub: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).value
					let __goscriptTuple2: any = await oidFromNamedCurve($.pointerValue<ecdsa.PublicKey>(pub).Curve)
					let oid: asn1.ObjectIdentifier = (__goscriptTuple2[0] as asn1.ObjectIdentifier)
					let ok = __goscriptTuple2[1]
					if (!ok) {
						return [null, $.markAsStructValue(new pkix2.AlgorithmIdentifier()), errors.New("x509: unsupported elliptic curve")]
					}
					let __goscriptTuple3: any = await ecdsa.PublicKey.prototype.Bytes.call(pub)
					publicKeyBytes = __goscriptTuple3[0]
					err = __goscriptTuple3[1]
					if (err != null) {
						return [null, $.markAsStructValue(new pkix2.AlgorithmIdentifier()), err]
					}
					publicKeyAlgorithm.Algorithm = (oidPublicKeyECDSA as asn1.ObjectIdentifier)
					let paramBytes: $.Slice<number> = null as $.Slice<number>
					let __goscriptTuple4: any = await asn1.Marshal($.namedValueInterfaceValue<any>(oid, "asn1.ObjectIdentifier", {Equal: (receiver: any, ...args: any[]) => (asn1.ObjectIdentifier_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (asn1.ObjectIdentifier_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, [{ name: "Equal", args: [{ name: "other", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
					paramBytes = __goscriptTuple4[0]
					err = __goscriptTuple4[1]
					if (err != null) {
						return [publicKeyBytes, publicKeyAlgorithm, err]
					}
					publicKeyAlgorithm.Parameters.FullBytes = paramBytes
				}
				break
			case $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let pub: ed25519.PublicKey = $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					publicKeyBytes = pub
					publicKeyAlgorithm.Algorithm = (oidPublicKeyEd25519 as asn1.ObjectIdentifier)
				}
				break
			case $.typeAssert<ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdh.PublicKey" }).ok:
				{
					let pub: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null = $.typeAssert<ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdh.PublicKey" }).value
					publicKeyBytes = ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>(pub))
					if ($.comparableEqual(ecdh.PublicKey.prototype.Curve.call($.pointerValue<ecdh.PublicKey>(pub)), ecdh.X25519())) {
						publicKeyAlgorithm.Algorithm = (oidPublicKeyX25519 as asn1.ObjectIdentifier)
					} else {
						let __goscriptTuple5: any = oidFromECDHCurve(ecdh.PublicKey.prototype.Curve.call($.pointerValue<ecdh.PublicKey>(pub)))
						let oid: asn1.ObjectIdentifier = (__goscriptTuple5[0] as asn1.ObjectIdentifier)
						let ok = __goscriptTuple5[1]
						if (!ok) {
							return [null, $.markAsStructValue(new pkix2.AlgorithmIdentifier()), errors.New("x509: unsupported elliptic curve")]
						}
						publicKeyAlgorithm.Algorithm = (oidPublicKeyECDSA as asn1.ObjectIdentifier)
						let paramBytes: $.Slice<number> = null as $.Slice<number>
						let __goscriptTuple6: any = await asn1.Marshal($.namedValueInterfaceValue<any>(oid, "asn1.ObjectIdentifier", {Equal: (receiver: any, ...args: any[]) => (asn1.ObjectIdentifier_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (asn1.ObjectIdentifier_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, [{ name: "Equal", args: [{ name: "other", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
						paramBytes = __goscriptTuple6[0]
						err = __goscriptTuple6[1]
						if (err != null) {
							return [publicKeyBytes, publicKeyAlgorithm, err]
						}
						publicKeyAlgorithm.Parameters.FullBytes = paramBytes
					}
				}
				break
			default:
				{
					let pub: any = __goscriptTypeSwitchValue
					return [null, $.markAsStructValue(new pkix2.AlgorithmIdentifier()), fmt.Errorf("x509: unsupported public key type: %T", pub)]
				}
				break
		}
	}

	return [publicKeyBytes, $.markAsStructValue($.cloneStructValue(publicKeyAlgorithm)), null]
}

export async function MarshalPKIXPublicKey(pub: any): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let publicKeyBytes: $.Slice<number> = null as $.Slice<number>
	let publicKeyAlgorithm: pkix2.AlgorithmIdentifier = $.markAsStructValue(new pkix2.AlgorithmIdentifier())
	let err: $.GoError = null as $.GoError

	{
		let __goscriptTuple7: any = await marshalPublicKey(pub)
		publicKeyBytes = __goscriptTuple7[0]
		publicKeyAlgorithm = __goscriptTuple7[1]
		err = __goscriptTuple7[2]
		if (err != null) {
			return [null, err]
		}
	}

	let __goscriptShadow2 = $.markAsStructValue(new pkixPublicKey({Algo: $.markAsStructValue($.cloneStructValue(publicKeyAlgorithm)), BitString: $.markAsStructValue(new asn1.BitString({Bytes: publicKeyBytes, BitLength: 8 * $.len(publicKeyBytes)}))}))

	let __goscriptTuple8: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(__goscriptShadow2)), "x509.pkixPublicKey", "x509.pkixPublicKey"))
	let ret: $.Slice<number> = __goscriptTuple8[0]
	return [ret, null]
}

export function SignatureAlgorithm_isRSAPSS(algo: SignatureAlgorithm): boolean {
	for (let __goscriptRangeTarget0 = __goscript_get_signatureAlgorithmDetails(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let details = __goscriptRangeTarget0![__rangeIndex]
		if (details.algo == algo) {
			return details.isRSAPSS
		}
	}
	return false
}

export function SignatureAlgorithm_hashFunc(algo: SignatureAlgorithm): crypto.Hash {
	for (let __goscriptRangeTarget1 = __goscript_get_signatureAlgorithmDetails(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let details = __goscriptRangeTarget1![__rangeIndex]
		if (details.algo == algo) {
			return details.hash
		}
	}
	return 0
}

export function SignatureAlgorithm_String(algo: SignatureAlgorithm): string {
	for (let __goscriptRangeTarget2 = __goscript_get_signatureAlgorithmDetails(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let details = __goscriptRangeTarget2![__rangeIndex]
		if (details.algo == algo) {
			return details.name
		}
	}
	return strconv.Itoa($.int(algo))
}

export let publicKeyAlgoName: string[] = ["", "RSA", "DSA", "ECDSA", "Ed25519"]

export function __goscript_set_publicKeyAlgoName(__goscriptValue: string[]): void {
	publicKeyAlgoName = __goscriptValue
}

export function PublicKeyAlgorithm_String(algo: PublicKeyAlgorithm): string {
	if ((0 < algo) && ($.int(algo) < $.len(publicKeyAlgoName))) {
		return $.arrayIndex(publicKeyAlgoName, algo)
	}
	return strconv.Itoa($.int(algo))
}

export let oidSignatureMD5WithRSA: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 113549, 1, 1, 4]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureMD5WithRSA(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureMD5WithRSA = __goscriptValue
}

export let oidSignatureSHA1WithRSA: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 113549, 1, 1, 5]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureSHA1WithRSA(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureSHA1WithRSA = __goscriptValue
}

export let oidSignatureSHA256WithRSA: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 113549, 1, 1, 11]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureSHA256WithRSA(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureSHA256WithRSA = __goscriptValue
}

export let oidSignatureSHA384WithRSA: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 113549, 1, 1, 12]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureSHA384WithRSA(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureSHA384WithRSA = __goscriptValue
}

export let oidSignatureSHA512WithRSA: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 113549, 1, 1, 13]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureSHA512WithRSA(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureSHA512WithRSA = __goscriptValue
}

export let oidSignatureRSAPSS: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 113549, 1, 1, 10]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureRSAPSS(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureRSAPSS = __goscriptValue
}

export let oidSignatureDSAWithSHA1: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 10040, 4, 3]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureDSAWithSHA1(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureDSAWithSHA1 = __goscriptValue
}

export let oidSignatureDSAWithSHA256: asn1.ObjectIdentifier = ($.arrayToSlice<number>([2, 16, 840, 1, 101, 3, 4, 3, 2]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureDSAWithSHA256(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureDSAWithSHA256 = __goscriptValue
}

export let oidSignatureECDSAWithSHA1: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 10045, 4, 1]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureECDSAWithSHA1(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureECDSAWithSHA1 = __goscriptValue
}

export let oidSignatureECDSAWithSHA256: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 10045, 4, 3, 2]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureECDSAWithSHA256(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureECDSAWithSHA256 = __goscriptValue
}

export let oidSignatureECDSAWithSHA384: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 10045, 4, 3, 3]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureECDSAWithSHA384(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureECDSAWithSHA384 = __goscriptValue
}

export let oidSignatureECDSAWithSHA512: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 10045, 4, 3, 4]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureECDSAWithSHA512(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureECDSAWithSHA512 = __goscriptValue
}

export let oidSignatureEd25519: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 101, 112]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSignatureEd25519(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSignatureEd25519 = __goscriptValue
}

export let oidSHA256: asn1.ObjectIdentifier = ($.arrayToSlice<number>([2, 16, 840, 1, 101, 3, 4, 2, 1]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSHA256(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSHA256 = __goscriptValue
}

export let oidSHA384: asn1.ObjectIdentifier = ($.arrayToSlice<number>([2, 16, 840, 1, 101, 3, 4, 2, 2]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSHA384(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSHA384 = __goscriptValue
}

export let oidSHA512: asn1.ObjectIdentifier = ($.arrayToSlice<number>([2, 16, 840, 1, 101, 3, 4, 2, 3]) as asn1.ObjectIdentifier)

export function __goscript_set_oidSHA512(__goscriptValue: asn1.ObjectIdentifier): void {
	oidSHA512 = __goscriptValue
}

export let oidMGF1: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 113549, 1, 1, 8]) as asn1.ObjectIdentifier)

export function __goscript_set_oidMGF1(__goscriptValue: asn1.ObjectIdentifier): void {
	oidMGF1 = __goscriptValue
}

export let oidISOSignatureSHA1WithRSA: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 14, 3, 2, 29]) as asn1.ObjectIdentifier)

export function __goscript_set_oidISOSignatureSHA1WithRSA(__goscriptValue: asn1.ObjectIdentifier): void {
	oidISOSignatureSHA1WithRSA = __goscriptValue
}

export var signatureAlgorithmDetails: $.Slice<{"algo": SignatureAlgorithm, "name": string, "oid": asn1.ObjectIdentifier, "params": asn1.RawValue, "pubKeyAlgo": PublicKeyAlgorithm, "hash": crypto.Hash, "isRSAPSS": boolean}>

export function __goscript_init_signatureAlgorithmDetails(): void {
	if (((signatureAlgorithmDetails) as any) === undefined) {
		signatureAlgorithmDetails = $.arrayToSlice<{"algo": SignatureAlgorithm, "name": string, "oid": asn1.ObjectIdentifier, "params": asn1.RawValue, "pubKeyAlgo": PublicKeyAlgorithm, "hash": crypto.Hash, "isRSAPSS": boolean}>([{algo: 2, name: "MD5-RSA", oid: (oidSignatureMD5WithRSA as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue($.pointerValue<asn1.RawValue>(asn1.__goscript_get_NullRawValue()))), pubKeyAlgo: 1, hash: crypto.MD5, isRSAPSS: false}, {algo: 3, name: "SHA1-RSA", oid: (oidSignatureSHA1WithRSA as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue($.pointerValue<asn1.RawValue>(asn1.__goscript_get_NullRawValue()))), pubKeyAlgo: 1, hash: crypto.SHA1, isRSAPSS: false}, {algo: 3, name: "SHA1-RSA", oid: (oidISOSignatureSHA1WithRSA as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue($.pointerValue<asn1.RawValue>(asn1.__goscript_get_NullRawValue()))), pubKeyAlgo: 1, hash: crypto.SHA1, isRSAPSS: false}, {algo: 4, name: "SHA256-RSA", oid: (oidSignatureSHA256WithRSA as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue($.pointerValue<asn1.RawValue>(asn1.__goscript_get_NullRawValue()))), pubKeyAlgo: 1, hash: crypto.SHA256, isRSAPSS: false}, {algo: 5, name: "SHA384-RSA", oid: (oidSignatureSHA384WithRSA as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue($.pointerValue<asn1.RawValue>(asn1.__goscript_get_NullRawValue()))), pubKeyAlgo: 1, hash: crypto.SHA384, isRSAPSS: false}, {algo: 6, name: "SHA512-RSA", oid: (oidSignatureSHA512WithRSA as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue($.pointerValue<asn1.RawValue>(asn1.__goscript_get_NullRawValue()))), pubKeyAlgo: 1, hash: crypto.SHA512, isRSAPSS: false}, {algo: 13, name: "SHA256-RSAPSS", oid: (oidSignatureRSAPSS as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue(pssParametersSHA256)), pubKeyAlgo: 1, hash: crypto.SHA256, isRSAPSS: true}, {algo: 14, name: "SHA384-RSAPSS", oid: (oidSignatureRSAPSS as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue(pssParametersSHA384)), pubKeyAlgo: 1, hash: crypto.SHA384, isRSAPSS: true}, {algo: 15, name: "SHA512-RSAPSS", oid: (oidSignatureRSAPSS as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue(pssParametersSHA512)), pubKeyAlgo: 1, hash: crypto.SHA512, isRSAPSS: true}, {algo: 7, name: "DSA-SHA1", oid: (oidSignatureDSAWithSHA1 as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue(emptyRawValue)), pubKeyAlgo: 2, hash: crypto.SHA1, isRSAPSS: false}, {algo: 8, name: "DSA-SHA256", oid: (oidSignatureDSAWithSHA256 as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue(emptyRawValue)), pubKeyAlgo: 2, hash: crypto.SHA256, isRSAPSS: false}, {algo: 9, name: "ECDSA-SHA1", oid: (oidSignatureECDSAWithSHA1 as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue(emptyRawValue)), pubKeyAlgo: 3, hash: crypto.SHA1, isRSAPSS: false}, {algo: 10, name: "ECDSA-SHA256", oid: (oidSignatureECDSAWithSHA256 as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue(emptyRawValue)), pubKeyAlgo: 3, hash: crypto.SHA256, isRSAPSS: false}, {algo: 11, name: "ECDSA-SHA384", oid: (oidSignatureECDSAWithSHA384 as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue(emptyRawValue)), pubKeyAlgo: 3, hash: crypto.SHA384, isRSAPSS: false}, {algo: 12, name: "ECDSA-SHA512", oid: (oidSignatureECDSAWithSHA512 as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue(emptyRawValue)), pubKeyAlgo: 3, hash: crypto.SHA512, isRSAPSS: false}, {algo: 16, name: "Ed25519", oid: (oidSignatureEd25519 as asn1.ObjectIdentifier), params: $.markAsStructValue($.cloneStructValue(emptyRawValue)), pubKeyAlgo: 4, hash: 0, isRSAPSS: false}])
	}
}

export function __goscript_get_signatureAlgorithmDetails(): $.Slice<{"algo": SignatureAlgorithm, "name": string, "oid": asn1.ObjectIdentifier, "params": asn1.RawValue, "pubKeyAlgo": PublicKeyAlgorithm, "hash": crypto.Hash, "isRSAPSS": boolean}> {
	if (((signatureAlgorithmDetails) as any) === undefined) {
		__goscript_init_signatureAlgorithmDetails()
	}
	return signatureAlgorithmDetails
}

export function __goscript_set_signatureAlgorithmDetails(__goscriptValue: $.Slice<{"algo": SignatureAlgorithm, "name": string, "oid": asn1.ObjectIdentifier, "params": asn1.RawValue, "pubKeyAlgo": PublicKeyAlgorithm, "hash": crypto.Hash, "isRSAPSS": boolean}>): void {
	signatureAlgorithmDetails = __goscriptValue
}

export let emptyRawValue: asn1.RawValue = $.markAsStructValue(new asn1.RawValue())

export function __goscript_set_emptyRawValue(__goscriptValue: asn1.RawValue): void {
	emptyRawValue = __goscriptValue
}

export let pssParametersSHA256: asn1.RawValue = $.markAsStructValue(new asn1.RawValue({FullBytes: new Uint8Array([48, 52, 160, 15, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 1, 5, 0, 161, 28, 48, 26, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 8, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 1, 5, 0, 162, 3, 2, 1, 32]) as $.Slice<number>}))

export function __goscript_set_pssParametersSHA256(__goscriptValue: asn1.RawValue): void {
	pssParametersSHA256 = __goscriptValue
}

export let pssParametersSHA384: asn1.RawValue = $.markAsStructValue(new asn1.RawValue({FullBytes: new Uint8Array([48, 52, 160, 15, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 2, 5, 0, 161, 28, 48, 26, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 8, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 2, 5, 0, 162, 3, 2, 1, 48]) as $.Slice<number>}))

export function __goscript_set_pssParametersSHA384(__goscriptValue: asn1.RawValue): void {
	pssParametersSHA384 = __goscriptValue
}

export let pssParametersSHA512: asn1.RawValue = $.markAsStructValue(new asn1.RawValue({FullBytes: new Uint8Array([48, 52, 160, 15, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 3, 5, 0, 161, 28, 48, 26, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 8, 48, 13, 6, 9, 96, 134, 72, 1, 101, 3, 4, 2, 3, 5, 0, 162, 3, 2, 1, 64]) as $.Slice<number>}))

export function __goscript_set_pssParametersSHA512(__goscriptValue: asn1.RawValue): void {
	pssParametersSHA512 = __goscriptValue
}

export async function getSignatureAlgorithmFromAI(ai: pkix2.AlgorithmIdentifier): globalThis.Promise<SignatureAlgorithm> {
	if (asn1.ObjectIdentifier_Equal(ai.Algorithm, (oidSignatureEd25519 as asn1.ObjectIdentifier))) {
		// RFC 8410, Section 3
		// > For all of the OIDs, the parameters MUST be absent.
		if ($.len(ai.Parameters.FullBytes) != 0) {
			return 0
		}
	}

	if (!asn1.ObjectIdentifier_Equal(ai.Algorithm, (oidSignatureRSAPSS as asn1.ObjectIdentifier))) {
		for (let __goscriptRangeTarget3 = __goscript_get_signatureAlgorithmDetails(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
			let details = __goscriptRangeTarget3![__rangeIndex]
			if (asn1.ObjectIdentifier_Equal(ai.Algorithm, (details.oid as asn1.ObjectIdentifier))) {
				return details.algo
			}
		}
		return 0
	}

	// RSA PSS is special because it encodes important parameters
	// in the Parameters.

	let params: $.VarRef<pssParameters> = $.varRef($.markAsStructValue(new pssParameters()))
	{
		let [, err] = await asn1.Unmarshal(ai.Parameters.FullBytes, $.interfaceValue<any>(params, "*x509.pssParameters", { kind: $.TypeKind.Pointer, elemType: "x509.pssParameters" }))
		if (err != null) {
			return 0
		}
	}

	let mgf1HashFunc: $.VarRef<pkix2.AlgorithmIdentifier> = $.varRef($.markAsStructValue(new pkix2.AlgorithmIdentifier()))
	{
		let [, err] = await asn1.Unmarshal(params.value.MGF.Parameters.FullBytes, $.interfaceValue<any>(mgf1HashFunc, "*pkix.AlgorithmIdentifier", { kind: $.TypeKind.Pointer, elemType: "pkix.AlgorithmIdentifier" }))
		if (err != null) {
			return 0
		}
	}

	// PSS is greatly overburdened with options. This code forces them into
	// three buckets by requiring that the MGF1 hash function always match the
	// message hash function (as recommended in RFC 3447, Section 8.1), that the
	// salt length matches the hash length, and that the trailer field has the
	// default value.
	if (((((($.len(params.value.Hash.Parameters.FullBytes) != 0) && !bytes.Equal(params.value.Hash.Parameters.FullBytes, asn1.__goscript_get_NullBytes())) || !asn1.ObjectIdentifier_Equal(params.value.MGF.Algorithm, (oidMGF1 as asn1.ObjectIdentifier))) || !asn1.ObjectIdentifier_Equal(mgf1HashFunc.value.Algorithm, (params.value.Hash.Algorithm as asn1.ObjectIdentifier))) || (($.len(mgf1HashFunc.value.Parameters.FullBytes) != 0) && !bytes.Equal(mgf1HashFunc.value.Parameters.FullBytes, asn1.__goscript_get_NullBytes()))) || (params.value.TrailerField != 1)) {
		return 0
	}

	switch (true) {
		case asn1.ObjectIdentifier_Equal(params.value.Hash.Algorithm, (oidSHA256 as asn1.ObjectIdentifier)) && (params.value.SaltLength == 32):
		{
			return 13
			break
		}
		case asn1.ObjectIdentifier_Equal(params.value.Hash.Algorithm, (oidSHA384 as asn1.ObjectIdentifier)) && (params.value.SaltLength == 48):
		{
			return 14
			break
		}
		case asn1.ObjectIdentifier_Equal(params.value.Hash.Algorithm, (oidSHA512 as asn1.ObjectIdentifier)) && (params.value.SaltLength == 64):
		{
			return 15
			break
		}
	}

	return 0
}

export let oidPublicKeyRSA: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 113549, 1, 1, 1]) as asn1.ObjectIdentifier)

export function __goscript_set_oidPublicKeyRSA(__goscriptValue: asn1.ObjectIdentifier): void {
	oidPublicKeyRSA = __goscriptValue
}

export let oidPublicKeyDSA: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 10040, 4, 1]) as asn1.ObjectIdentifier)

export function __goscript_set_oidPublicKeyDSA(__goscriptValue: asn1.ObjectIdentifier): void {
	oidPublicKeyDSA = __goscriptValue
}

export let oidPublicKeyECDSA: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 10045, 2, 1]) as asn1.ObjectIdentifier)

export function __goscript_set_oidPublicKeyECDSA(__goscriptValue: asn1.ObjectIdentifier): void {
	oidPublicKeyECDSA = __goscriptValue
}

export let oidPublicKeyX25519: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 101, 110]) as asn1.ObjectIdentifier)

export function __goscript_set_oidPublicKeyX25519(__goscriptValue: asn1.ObjectIdentifier): void {
	oidPublicKeyX25519 = __goscriptValue
}

export let oidPublicKeyEd25519: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 101, 112]) as asn1.ObjectIdentifier)

export function __goscript_set_oidPublicKeyEd25519(__goscriptValue: asn1.ObjectIdentifier): void {
	oidPublicKeyEd25519 = __goscriptValue
}

export function getPublicKeyAlgorithmFromOID(oid: asn1.ObjectIdentifier): PublicKeyAlgorithm {
	switch (true) {
		case asn1.ObjectIdentifier_Equal(oid, (oidPublicKeyRSA as asn1.ObjectIdentifier)):
		{
			return 1
			break
		}
		case asn1.ObjectIdentifier_Equal(oid, (oidPublicKeyDSA as asn1.ObjectIdentifier)):
		{
			return 2
			break
		}
		case asn1.ObjectIdentifier_Equal(oid, (oidPublicKeyECDSA as asn1.ObjectIdentifier)):
		{
			return 3
			break
		}
		case asn1.ObjectIdentifier_Equal(oid, (oidPublicKeyEd25519 as asn1.ObjectIdentifier)):
		{
			return 4
			break
		}
	}
	return 0
}

export let oidNamedCurveP224: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 132, 0, 33]) as asn1.ObjectIdentifier)

export function __goscript_set_oidNamedCurveP224(__goscriptValue: asn1.ObjectIdentifier): void {
	oidNamedCurveP224 = __goscriptValue
}

export let oidNamedCurveP256: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 10045, 3, 1, 7]) as asn1.ObjectIdentifier)

export function __goscript_set_oidNamedCurveP256(__goscriptValue: asn1.ObjectIdentifier): void {
	oidNamedCurveP256 = __goscriptValue
}

export let oidNamedCurveP384: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 132, 0, 34]) as asn1.ObjectIdentifier)

export function __goscript_set_oidNamedCurveP384(__goscriptValue: asn1.ObjectIdentifier): void {
	oidNamedCurveP384 = __goscriptValue
}

export let oidNamedCurveP521: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 132, 0, 35]) as asn1.ObjectIdentifier)

export function __goscript_set_oidNamedCurveP521(__goscriptValue: asn1.ObjectIdentifier): void {
	oidNamedCurveP521 = __goscriptValue
}

export async function namedCurveFromOID(oid: asn1.ObjectIdentifier): globalThis.Promise<elliptic.Curve | null> {
	switch (true) {
		case asn1.ObjectIdentifier_Equal(oid, (oidNamedCurveP224 as asn1.ObjectIdentifier)):
		{
			return elliptic.P224()
			break
		}
		case asn1.ObjectIdentifier_Equal(oid, (oidNamedCurveP256 as asn1.ObjectIdentifier)):
		{
			return elliptic.P256()
			break
		}
		case asn1.ObjectIdentifier_Equal(oid, (oidNamedCurveP384 as asn1.ObjectIdentifier)):
		{
			return elliptic.P384()
			break
		}
		case asn1.ObjectIdentifier_Equal(oid, (oidNamedCurveP521 as asn1.ObjectIdentifier)):
		{
			return elliptic.P521()
			break
		}
	}
	return null
}

export async function oidFromNamedCurve(curve: elliptic.Curve | null): globalThis.Promise<[asn1.ObjectIdentifier, boolean]> {
	{
		let __goscriptSwitch0 = curve
		switch (true) {
			case $.comparableEqual(__goscriptSwitch0, await elliptic.P224()):
			{
				return [(oidNamedCurveP224 as asn1.ObjectIdentifier), true]
				break
			}
			case $.comparableEqual(__goscriptSwitch0, await elliptic.P256()):
			{
				return [(oidNamedCurveP256 as asn1.ObjectIdentifier), true]
				break
			}
			case $.comparableEqual(__goscriptSwitch0, await elliptic.P384()):
			{
				return [(oidNamedCurveP384 as asn1.ObjectIdentifier), true]
				break
			}
			case $.comparableEqual(__goscriptSwitch0, await elliptic.P521()):
			{
				return [(oidNamedCurveP521 as asn1.ObjectIdentifier), true]
				break
			}
		}
	}

	return [(null as asn1.ObjectIdentifier), false]
}

export function oidFromECDHCurve(curve: ecdh.Curve | null): [asn1.ObjectIdentifier, boolean] {
	{
		let __goscriptSwitch1 = curve
		switch (true) {
			case $.comparableEqual(__goscriptSwitch1, ecdh.X25519()):
			{
				return [(oidPublicKeyX25519 as asn1.ObjectIdentifier), true]
				break
			}
			case $.comparableEqual(__goscriptSwitch1, ecdh.P256()):
			{
				return [(oidNamedCurveP256 as asn1.ObjectIdentifier), true]
				break
			}
			case $.comparableEqual(__goscriptSwitch1, ecdh.P384()):
			{
				return [(oidNamedCurveP384 as asn1.ObjectIdentifier), true]
				break
			}
			case $.comparableEqual(__goscriptSwitch1, ecdh.P521()):
			{
				return [(oidNamedCurveP521 as asn1.ObjectIdentifier), true]
				break
			}
		}
	}

	return [(null as asn1.ObjectIdentifier), false]
}

export let oidExtKeyUsageAny: asn1.ObjectIdentifier = ($.arrayToSlice<number>([2, 5, 29, 37, 0]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageAny(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageAny = __goscriptValue
}

export let oidExtKeyUsageServerAuth: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 5, 5, 7, 3, 1]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageServerAuth(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageServerAuth = __goscriptValue
}

export let oidExtKeyUsageClientAuth: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 5, 5, 7, 3, 2]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageClientAuth(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageClientAuth = __goscriptValue
}

export let oidExtKeyUsageCodeSigning: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 5, 5, 7, 3, 3]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageCodeSigning(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageCodeSigning = __goscriptValue
}

export let oidExtKeyUsageEmailProtection: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 5, 5, 7, 3, 4]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageEmailProtection(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageEmailProtection = __goscriptValue
}

export let oidExtKeyUsageIPSECEndSystem: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 5, 5, 7, 3, 5]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageIPSECEndSystem(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageIPSECEndSystem = __goscriptValue
}

export let oidExtKeyUsageIPSECTunnel: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 5, 5, 7, 3, 6]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageIPSECTunnel(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageIPSECTunnel = __goscriptValue
}

export let oidExtKeyUsageIPSECUser: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 5, 5, 7, 3, 7]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageIPSECUser(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageIPSECUser = __goscriptValue
}

export let oidExtKeyUsageTimeStamping: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 5, 5, 7, 3, 8]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageTimeStamping(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageTimeStamping = __goscriptValue
}

export let oidExtKeyUsageOCSPSigning: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 5, 5, 7, 3, 9]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageOCSPSigning(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageOCSPSigning = __goscriptValue
}

export let oidExtKeyUsageMicrosoftServerGatedCrypto: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 4, 1, 311, 10, 3, 3]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageMicrosoftServerGatedCrypto(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageMicrosoftServerGatedCrypto = __goscriptValue
}

export let oidExtKeyUsageNetscapeServerGatedCrypto: asn1.ObjectIdentifier = ($.arrayToSlice<number>([2, 16, 840, 1, 113730, 4, 1]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageNetscapeServerGatedCrypto(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageNetscapeServerGatedCrypto = __goscriptValue
}

export let oidExtKeyUsageMicrosoftCommercialCodeSigning: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 4, 1, 311, 2, 1, 22]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageMicrosoftCommercialCodeSigning(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageMicrosoftCommercialCodeSigning = __goscriptValue
}

export let oidExtKeyUsageMicrosoftKernelCodeSigning: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 4, 1, 311, 61, 1, 1]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtKeyUsageMicrosoftKernelCodeSigning(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtKeyUsageMicrosoftKernelCodeSigning = __goscriptValue
}

export let extKeyUsageOIDs: $.Slice<{"extKeyUsage": ExtKeyUsage, "oid": asn1.ObjectIdentifier}> = $.arrayToSlice<{"extKeyUsage": ExtKeyUsage, "oid": asn1.ObjectIdentifier}>([{extKeyUsage: 0, oid: (oidExtKeyUsageAny as asn1.ObjectIdentifier)}, {extKeyUsage: 1, oid: (oidExtKeyUsageServerAuth as asn1.ObjectIdentifier)}, {extKeyUsage: 2, oid: (oidExtKeyUsageClientAuth as asn1.ObjectIdentifier)}, {extKeyUsage: 3, oid: (oidExtKeyUsageCodeSigning as asn1.ObjectIdentifier)}, {extKeyUsage: 4, oid: (oidExtKeyUsageEmailProtection as asn1.ObjectIdentifier)}, {extKeyUsage: 5, oid: (oidExtKeyUsageIPSECEndSystem as asn1.ObjectIdentifier)}, {extKeyUsage: 6, oid: (oidExtKeyUsageIPSECTunnel as asn1.ObjectIdentifier)}, {extKeyUsage: 7, oid: (oidExtKeyUsageIPSECUser as asn1.ObjectIdentifier)}, {extKeyUsage: 8, oid: (oidExtKeyUsageTimeStamping as asn1.ObjectIdentifier)}, {extKeyUsage: 9, oid: (oidExtKeyUsageOCSPSigning as asn1.ObjectIdentifier)}, {extKeyUsage: 10, oid: (oidExtKeyUsageMicrosoftServerGatedCrypto as asn1.ObjectIdentifier)}, {extKeyUsage: 11, oid: (oidExtKeyUsageNetscapeServerGatedCrypto as asn1.ObjectIdentifier)}, {extKeyUsage: 12, oid: (oidExtKeyUsageMicrosoftCommercialCodeSigning as asn1.ObjectIdentifier)}, {extKeyUsage: 13, oid: (oidExtKeyUsageMicrosoftKernelCodeSigning as asn1.ObjectIdentifier)}])

export function __goscript_set_extKeyUsageOIDs(__goscriptValue: $.Slice<{"extKeyUsage": ExtKeyUsage, "oid": asn1.ObjectIdentifier}>): void {
	extKeyUsageOIDs = __goscriptValue
}

export function extKeyUsageFromOID(oid: asn1.ObjectIdentifier): [ExtKeyUsage, boolean] {
	let eku: ExtKeyUsage = 0
	let ok: boolean = false
	for (let __goscriptRangeTarget4 = extKeyUsageOIDs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let pair = __goscriptRangeTarget4![__rangeIndex]
		if (asn1.ObjectIdentifier_Equal(oid, (pair.oid as asn1.ObjectIdentifier))) {
			return [pair.extKeyUsage, true]
		}
	}
	return [eku, ok]
}

export function oidFromExtKeyUsage(eku: ExtKeyUsage): [asn1.ObjectIdentifier, boolean] {
	let oid: asn1.ObjectIdentifier = null as asn1.ObjectIdentifier
	let ok: boolean = false
	for (let __goscriptRangeTarget5 = extKeyUsageOIDs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
		let pair = __goscriptRangeTarget5![__rangeIndex]
		if (eku == pair.extKeyUsage) {
			return [(pair.oid as asn1.ObjectIdentifier), true]
		}
	}
	return [oid, ok]
}

export function ExtKeyUsage_OID(eku: ExtKeyUsage): __goscript_oid.OID {
	let __goscriptTuple9: any = oidFromExtKeyUsage(eku)
	let asn1OID: asn1.ObjectIdentifier = (__goscriptTuple9[0] as asn1.ObjectIdentifier)
	let ok = __goscriptTuple9[1]
	if (!ok) {
		$.panic("x509: internal error: known ExtKeyUsage has no OID")
	}
	let [oid, err] = __goscript_oid.OIDFromASN1OID((asn1OID as asn1.ObjectIdentifier))
	if (err != null) {
		$.panic("x509: internal error: known ExtKeyUsage has invalid OID")
	}
	return $.markAsStructValue($.cloneStructValue(oid))
}

export let ErrUnsupportedAlgorithm: $.GoError = errors.New("x509: cannot verify signature: algorithm unimplemented")

export function __goscript_set_ErrUnsupportedAlgorithm(__goscriptValue: $.GoError): void {
	ErrUnsupportedAlgorithm = __goscriptValue
}

export async function InsecureAlgorithmError_Error(e: InsecureAlgorithmError): globalThis.Promise<string> {
	return fmt.Sprintf("x509: cannot verify signature: insecure algorithm %v", $.namedValueInterfaceValue<any>($.int(e), "x509.SignatureAlgorithm", {String: (receiver: any, ...args: any[]) => (SignatureAlgorithm_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), hashFunc: (receiver: any, ...args: any[]) => (SignatureAlgorithm_hashFunc as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), isRSAPSS: (receiver: any, ...args: any[]) => (SignatureAlgorithm_isRSAPSS as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "int", typeName: "x509.SignatureAlgorithm" }, [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "hashFunc", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" } }] }, { name: "isRSAPSS", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]))
}

export function signaturePublicKeyAlgoMismatchError(expectedPubKeyAlgo: PublicKeyAlgorithm, pubKey: any): $.GoError {
	return fmt.Errorf("x509: signature algorithm specifies an %s public key, but have public key of type %T", PublicKeyAlgorithm_String(expectedPubKeyAlgo), pubKey)
}

export async function checkSignature(algo: SignatureAlgorithm, signed: $.Slice<number>, signature: $.Slice<number>, publicKey: crypto.PublicKey | null, allowSHA1: boolean): globalThis.Promise<$.GoError> {
	let err: $.GoError = null as $.GoError
	let hashType: crypto.Hash = 0
	let pubKeyAlgo: PublicKeyAlgorithm = 0

	for (let __goscriptRangeTarget13 = __goscript_get_signatureAlgorithmDetails(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget13); __rangeIndex++) {
		let details = __goscriptRangeTarget13![__rangeIndex]
		if (details.algo == algo) {
			hashType = details.hash
			pubKeyAlgo = details.pubKeyAlgo
			break
		}
	}

	switch (hashType) {
		case 0:
		{
			if (pubKeyAlgo != 4) {
				return ErrUnsupportedAlgorithm
			}
			break
		}
		case crypto.MD5:
		{
			return $.namedValueInterfaceValue<$.GoError>($.int(algo), "x509.InsecureAlgorithmError", {"Error": InsecureAlgorithmError_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "x509.InsecureAlgorithmError" })
			break
		}
		case crypto.SHA1:
		{
			if (!allowSHA1) {
				return $.namedValueInterfaceValue<$.GoError>($.int(algo), "x509.InsecureAlgorithmError", {"Error": InsecureAlgorithmError_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "x509.InsecureAlgorithmError" })
			}
		}
		default:
		{
			if (!crypto.Hash_Available(hashType)) {
				return ErrUnsupportedAlgorithm
			}
			let h = await crypto.Hash_New(hashType)
			await $.pointerValue<Exclude<hash2.Hash, null>>(h).Write(signed)
			signed = await $.pointerValue<Exclude<hash2.Hash, null>>(h).Sum(null)
			break
		}
	}

	{
		const __goscriptTypeSwitchValue = publicKey
		switch (true) {
			case $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).ok:
				{
					let pub: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).value
					if (pubKeyAlgo != 1) {
						return signaturePublicKeyAlgoMismatchError(pubKeyAlgo, $.interfaceValue<any>(pub, "*rsa.PublicKey", { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }))
					}
					if (SignatureAlgorithm_isRSAPSS(algo)) {
						return rsa.VerifyPSS(pub, hashType, signed, signature, new rsa.PSSOptions({SaltLength: rsa.PSSSaltLengthEqualsHash}))
					} else {
						return rsa.VerifyPKCS1v15(pub, hashType, signed, signature)
					}
				}
				break
			case $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).ok:
				{
					let pub: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).value
					if (pubKeyAlgo != 3) {
						return signaturePublicKeyAlgoMismatchError(pubKeyAlgo, $.interfaceValue<any>(pub, "*ecdsa.PublicKey", { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }))
					}
					if (!await ecdsa.VerifyASN1(pub, signed, signature)) {
						return errors.New("x509: ECDSA verification failure")
					}
					return err
				}
				break
			case $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let pub: ed25519.PublicKey = $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					if (pubKeyAlgo != 4) {
						return signaturePublicKeyAlgoMismatchError(pubKeyAlgo, $.namedValueInterfaceValue<any>(pub, "ed25519.PublicKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PublicKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Equal", args: [{ name: "x", type: "crypto.PublicKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]))
					}
					if (!await ed25519.Verify((pub as ed25519.PublicKey), signed, signature)) {
						return errors.New("x509: Ed25519 verification failure")
					}
					return err
				}
				break
		}
	}
	return ErrUnsupportedAlgorithm
}

export function reverseBitsInAByte(_in: number): number {
	let b1 = $.uint(($.uintShr(_in, 4, 8)) | (_in << 4), 8)
	let b2 = $.uint((($.uintShr(b1, 2, 8)) & 0x33) | ((b1 << 2) & 0xcc), 8)
	let b3 = $.uint((($.uintShr(b2, 1, 8)) & 0x55) | ((b2 << 1) & 0xaa), 8)
	return $.uint(b3, 8)
}

export function asn1BitLength(bitString: $.Slice<number>): number {
	let bitLen = $.len(bitString) * 8

	for (let __goscriptRangeTarget14 = bitString, i = 0; i < $.len(__goscriptRangeTarget14); i++) {
		let b = $.uint($.arrayIndex(bitString!, ($.len(bitString) - i) - 1), 8)

		for (let bit = $.uint(0, 64); bit < 8; bit++) {
			if ($.uint((($.uintShr(b, bit, 8)) & 1), 8) == $.uint(1, 8)) {
				return bitLen
			}
			bitLen--
		}
	}

	return 0
}

export let oidExtensionSubjectKeyId: $.Slice<number> = $.arrayToSlice<number>([2, 5, 29, 14])

export function __goscript_set_oidExtensionSubjectKeyId(__goscriptValue: $.Slice<number>): void {
	oidExtensionSubjectKeyId = __goscriptValue
}

export let oidExtensionKeyUsage: $.Slice<number> = $.arrayToSlice<number>([2, 5, 29, 15])

export function __goscript_set_oidExtensionKeyUsage(__goscriptValue: $.Slice<number>): void {
	oidExtensionKeyUsage = __goscriptValue
}

export let oidExtensionExtendedKeyUsage: $.Slice<number> = $.arrayToSlice<number>([2, 5, 29, 37])

export function __goscript_set_oidExtensionExtendedKeyUsage(__goscriptValue: $.Slice<number>): void {
	oidExtensionExtendedKeyUsage = __goscriptValue
}

export let oidExtensionAuthorityKeyId: $.Slice<number> = $.arrayToSlice<number>([2, 5, 29, 35])

export function __goscript_set_oidExtensionAuthorityKeyId(__goscriptValue: $.Slice<number>): void {
	oidExtensionAuthorityKeyId = __goscriptValue
}

export let oidExtensionBasicConstraints: $.Slice<number> = $.arrayToSlice<number>([2, 5, 29, 19])

export function __goscript_set_oidExtensionBasicConstraints(__goscriptValue: $.Slice<number>): void {
	oidExtensionBasicConstraints = __goscriptValue
}

export let oidExtensionSubjectAltName: $.Slice<number> = $.arrayToSlice<number>([2, 5, 29, 17])

export function __goscript_set_oidExtensionSubjectAltName(__goscriptValue: $.Slice<number>): void {
	oidExtensionSubjectAltName = __goscriptValue
}

export let oidExtensionCertificatePolicies: $.Slice<number> = $.arrayToSlice<number>([2, 5, 29, 32])

export function __goscript_set_oidExtensionCertificatePolicies(__goscriptValue: $.Slice<number>): void {
	oidExtensionCertificatePolicies = __goscriptValue
}

export let oidExtensionNameConstraints: $.Slice<number> = $.arrayToSlice<number>([2, 5, 29, 30])

export function __goscript_set_oidExtensionNameConstraints(__goscriptValue: $.Slice<number>): void {
	oidExtensionNameConstraints = __goscriptValue
}

export let oidExtensionCRLDistributionPoints: $.Slice<number> = $.arrayToSlice<number>([2, 5, 29, 31])

export function __goscript_set_oidExtensionCRLDistributionPoints(__goscriptValue: $.Slice<number>): void {
	oidExtensionCRLDistributionPoints = __goscriptValue
}

export let oidExtensionAuthorityInfoAccess: $.Slice<number> = $.arrayToSlice<number>([1, 3, 6, 1, 5, 5, 7, 1, 1])

export function __goscript_set_oidExtensionAuthorityInfoAccess(__goscriptValue: $.Slice<number>): void {
	oidExtensionAuthorityInfoAccess = __goscriptValue
}

export let oidExtensionCRLNumber: $.Slice<number> = $.arrayToSlice<number>([2, 5, 29, 20])

export function __goscript_set_oidExtensionCRLNumber(__goscriptValue: $.Slice<number>): void {
	oidExtensionCRLNumber = __goscriptValue
}

export let oidExtensionReasonCode: $.Slice<number> = $.arrayToSlice<number>([2, 5, 29, 21])

export function __goscript_set_oidExtensionReasonCode(__goscriptValue: $.Slice<number>): void {
	oidExtensionReasonCode = __goscriptValue
}

export let oidAuthorityInfoAccessOcsp: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 5, 5, 7, 48, 1]) as asn1.ObjectIdentifier)

export function __goscript_set_oidAuthorityInfoAccessOcsp(__goscriptValue: asn1.ObjectIdentifier): void {
	oidAuthorityInfoAccessOcsp = __goscriptValue
}

export let oidAuthorityInfoAccessIssuers: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 3, 6, 1, 5, 5, 7, 48, 2]) as asn1.ObjectIdentifier)

export function __goscript_set_oidAuthorityInfoAccessIssuers(__goscriptValue: asn1.ObjectIdentifier): void {
	oidAuthorityInfoAccessIssuers = __goscriptValue
}

export function oidInExtensions(oid: asn1.ObjectIdentifier, extensions: $.Slice<pkix2.Extension>): boolean {
	for (let __goscriptRangeTarget15 = extensions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget15); __rangeIndex++) {
		let e = __goscriptRangeTarget15![__rangeIndex]
		if (asn1.ObjectIdentifier_Equal(e.Id, (oid as asn1.ObjectIdentifier))) {
			return true
		}
	}
	return false
}

export async function marshalSANs(dnsNames: $.Slice<string>, emailAddresses: $.Slice<string>, ipAddresses: $.Slice<net.IP>, uris: $.Slice<url.URL | $.VarRef<url.URL> | null>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let derBytes: $.Slice<number> = null as $.Slice<number>
	let err: $.GoError = null as $.GoError
	let rawValues: $.Slice<asn1.RawValue> = null as $.Slice<asn1.RawValue>
	for (let __goscriptRangeTarget16 = dnsNames, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget16); __rangeIndex++) {
		let name = __goscriptRangeTarget16![__rangeIndex]
		{
			let __goscriptShadow7 = isIA5String(name)
			if (__goscriptShadow7 != null) {
				return [null, __goscriptShadow7]
			}
		}
		rawValues = $.append(rawValues, $.markAsStructValue(new asn1.RawValue({Tag: 2, Class: 2, Bytes: $.stringToBytes(name)})))
	}
	for (let __goscriptRangeTarget17 = emailAddresses, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget17); __rangeIndex++) {
		let email = __goscriptRangeTarget17![__rangeIndex]
		{
			let __goscriptShadow8 = isIA5String(email)
			if (__goscriptShadow8 != null) {
				return [null, __goscriptShadow8]
			}
		}
		rawValues = $.append(rawValues, $.markAsStructValue(new asn1.RawValue({Tag: 1, Class: 2, Bytes: $.stringToBytes(email)})))
	}
	for (let __goscriptRangeTarget18 = ipAddresses, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget18); __rangeIndex++) {
		let rawIP = __goscriptRangeTarget18![__rangeIndex]
		// If possible, we always want to encode IPv4 addresses in 4 bytes.
		let ip: net.IP = (net.IP_To4(rawIP) as net.IP)
		if (ip == null) {
			ip = (rawIP as net.IP)
		}
		rawValues = $.append(rawValues, $.markAsStructValue(new asn1.RawValue({Tag: 7, Class: 2, Bytes: ip})))
	}
	for (let __goscriptRangeTarget19 = uris, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget19); __rangeIndex++) {
		let uri = __goscriptRangeTarget19![__rangeIndex]
		let uriStr = url.URL.prototype.String.call(uri)
		{
			let __goscriptShadow9 = isIA5String(uriStr)
			if (__goscriptShadow9 != null) {
				return [null, __goscriptShadow9]
			}
		}
		rawValues = $.append(rawValues, $.markAsStructValue(new asn1.RawValue({Tag: 6, Class: 2, Bytes: $.stringToBytes(uriStr)})))
	}
	return asn1.Marshal($.interfaceValue<any>(rawValues, "[]asn1.RawValue", { kind: $.TypeKind.Slice, elemType: "asn1.RawValue" }))
}

export function isIA5String(s: string): $.GoError {
	for (const [__rangeIndex, r] of $.rangeString(s)) {
		// Per RFC5280 "IA5String is limited to the set of ASCII characters"
		if ($.int(r, 32) > $.int(unicode.MaxASCII, 32)) {
			return fmt.Errorf("x509: %q cannot be encoded as an IA5String", s)
		}
	}

	return null
}

export let x509usepolicies: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("x509usepolicies")

export function __goscript_set_x509usepolicies(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	x509usepolicies = __goscriptValue
}

export async function buildCertExtensions(template: Certificate | $.VarRef<Certificate> | null, subjectIsEmpty: boolean, authorityKeyId: $.Slice<number>, subjectKeyId: $.Slice<number>): globalThis.Promise<[$.Slice<pkix2.Extension>, $.GoError]> {
	let ret: $.Slice<pkix2.Extension> = null as $.Slice<pkix2.Extension>
	let err: $.GoError = null as $.GoError
	ret = $.makeSlice<pkix2.Extension>(10, undefined, undefined, () => $.markAsStructValue(new pkix2.Extension()))
	let n = 0

	if (($.pointerValue<Certificate>(template).KeyUsage != 0) && !oidInExtensions((oidExtensionKeyUsage as asn1.ObjectIdentifier), $.pointerValue<Certificate>(template).ExtraExtensions)) {
		let __goscriptTuple18: any = await marshalKeyUsage($.pointerValue<Certificate>(template).KeyUsage)
		ret![n] = __goscriptTuple18[0]
		err = __goscriptTuple18[1]
		if (err != null) {
			return [null, err]
		}
		n++
	}

	if ((($.len($.pointerValue<Certificate>(template).ExtKeyUsage) > 0) || ($.len($.pointerValue<Certificate>(template).UnknownExtKeyUsage) > 0)) && !oidInExtensions((oidExtensionExtendedKeyUsage as asn1.ObjectIdentifier), $.pointerValue<Certificate>(template).ExtraExtensions)) {
		let __goscriptTuple19: any = await marshalExtKeyUsage($.pointerValue<Certificate>(template).ExtKeyUsage, $.pointerValue<Certificate>(template).UnknownExtKeyUsage)
		ret![n] = __goscriptTuple19[0]
		err = __goscriptTuple19[1]
		if (err != null) {
			return [null, err]
		}
		n++
	}

	if ($.pointerValue<Certificate>(template).BasicConstraintsValid && !oidInExtensions((oidExtensionBasicConstraints as asn1.ObjectIdentifier), $.pointerValue<Certificate>(template).ExtraExtensions)) {
		let __goscriptTuple20: any = await marshalBasicConstraints($.pointerValue<Certificate>(template).IsCA, $.pointerValue<Certificate>(template).MaxPathLen, $.pointerValue<Certificate>(template).MaxPathLenZero)
		ret![n] = __goscriptTuple20[0]
		err = __goscriptTuple20[1]
		if (err != null) {
			return [null, err]
		}
		n++
	}

	if (($.len(subjectKeyId) > 0) && !oidInExtensions((oidExtensionSubjectKeyId as asn1.ObjectIdentifier), $.pointerValue<Certificate>(template).ExtraExtensions)) {
		$.arrayIndex(ret!, n).Id = (oidExtensionSubjectKeyId as asn1.ObjectIdentifier)
		let __goscriptTuple21: any = await asn1.Marshal($.interfaceValue<any>(subjectKeyId, "[]byte", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }))
		$.arrayIndex(ret!, n).Value = __goscriptTuple21[0]
		err = __goscriptTuple21[1]
		if (err != null) {
			return [ret, err]
		}
		n++
	}

	if (($.len(authorityKeyId) > 0) && !oidInExtensions((oidExtensionAuthorityKeyId as asn1.ObjectIdentifier), $.pointerValue<Certificate>(template).ExtraExtensions)) {
		$.arrayIndex(ret!, n).Id = (oidExtensionAuthorityKeyId as asn1.ObjectIdentifier)
		let __goscriptTuple22: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue(new authKeyId({Id: authorityKeyId})), "x509.authKeyId", "x509.authKeyId"))
		$.arrayIndex(ret!, n).Value = __goscriptTuple22[0]
		err = __goscriptTuple22[1]
		if (err != null) {
			return [ret, err]
		}
		n++
	}

	if ((($.len($.pointerValue<Certificate>(template).OCSPServer) > 0) || ($.len($.pointerValue<Certificate>(template).IssuingCertificateURL) > 0)) && !oidInExtensions((oidExtensionAuthorityInfoAccess as asn1.ObjectIdentifier), $.pointerValue<Certificate>(template).ExtraExtensions)) {
		$.arrayIndex(ret!, n).Id = (oidExtensionAuthorityInfoAccess as asn1.ObjectIdentifier)
		let aiaValues: $.Slice<authorityInfoAccess> = null as $.Slice<authorityInfoAccess>
		for (let __goscriptRangeTarget20 = $.pointerValue<Certificate>(template).OCSPServer, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget20); __rangeIndex++) {
			let name = __goscriptRangeTarget20![__rangeIndex]
			aiaValues = $.append(aiaValues, $.markAsStructValue(new authorityInfoAccess({Method: (oidAuthorityInfoAccessOcsp as asn1.ObjectIdentifier), Location: $.markAsStructValue(new asn1.RawValue({Tag: 6, Class: 2, Bytes: $.stringToBytes(name)}))})))
		}
		for (let __goscriptRangeTarget21 = $.pointerValue<Certificate>(template).IssuingCertificateURL, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget21); __rangeIndex++) {
			let name = __goscriptRangeTarget21![__rangeIndex]
			aiaValues = $.append(aiaValues, $.markAsStructValue(new authorityInfoAccess({Method: (oidAuthorityInfoAccessIssuers as asn1.ObjectIdentifier), Location: $.markAsStructValue(new asn1.RawValue({Tag: 6, Class: 2, Bytes: $.stringToBytes(name)}))})))
		}
		let __goscriptTuple23: any = await asn1.Marshal($.interfaceValue<any>(aiaValues, "[]x509.authorityInfoAccess", { kind: $.TypeKind.Slice, elemType: "x509.authorityInfoAccess" }))
		$.arrayIndex(ret!, n).Value = __goscriptTuple23[0]
		err = __goscriptTuple23[1]
		if (err != null) {
			return [ret, err]
		}
		n++
	}

	if ((((($.len($.pointerValue<Certificate>(template).DNSNames) > 0) || ($.len($.pointerValue<Certificate>(template).EmailAddresses) > 0)) || ($.len($.pointerValue<Certificate>(template).IPAddresses) > 0)) || ($.len($.pointerValue<Certificate>(template).URIs) > 0)) && !oidInExtensions((oidExtensionSubjectAltName as asn1.ObjectIdentifier), $.pointerValue<Certificate>(template).ExtraExtensions)) {
		$.arrayIndex(ret!, n).Id = (oidExtensionSubjectAltName as asn1.ObjectIdentifier)
		// From RFC 5280, Section 4.2.1.6:
		// “If the subject field contains an empty sequence ... then
		// subjectAltName extension ... is marked as critical”
		$.arrayIndex(ret!, n).Critical = subjectIsEmpty
		let __goscriptTuple24: any = await marshalSANs($.pointerValue<Certificate>(template).DNSNames, $.pointerValue<Certificate>(template).EmailAddresses, $.pointerValue<Certificate>(template).IPAddresses, $.pointerValue<Certificate>(template).URIs)
		$.arrayIndex(ret!, n).Value = __goscriptTuple24[0]
		err = __goscriptTuple24[1]
		if (err != null) {
			return [ret, err]
		}
		n++
	}

	let usePolicies = !$.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(x509usepolicies)), "0")
	if (((!usePolicies && ($.len($.pointerValue<Certificate>(template).PolicyIdentifiers) > 0)) || (usePolicies && ($.len($.pointerValue<Certificate>(template).Policies) > 0))) && !oidInExtensions((oidExtensionCertificatePolicies as asn1.ObjectIdentifier), $.pointerValue<Certificate>(template).ExtraExtensions)) {
		let __goscriptTuple25: any = await marshalCertificatePolicies($.pointerValue<Certificate>(template).Policies, $.pointerValue<Certificate>(template).PolicyIdentifiers)
		ret![n] = __goscriptTuple25[0]
		err = __goscriptTuple25[1]
		if (err != null) {
			return [null, err]
		}
		n++
	}

	if ((((((((($.len($.pointerValue<Certificate>(template).PermittedDNSDomains) > 0) || ($.len($.pointerValue<Certificate>(template).ExcludedDNSDomains) > 0)) || ($.len($.pointerValue<Certificate>(template).PermittedIPRanges) > 0)) || ($.len($.pointerValue<Certificate>(template).ExcludedIPRanges) > 0)) || ($.len($.pointerValue<Certificate>(template).PermittedEmailAddresses) > 0)) || ($.len($.pointerValue<Certificate>(template).ExcludedEmailAddresses) > 0)) || ($.len($.pointerValue<Certificate>(template).PermittedURIDomains) > 0)) || ($.len($.pointerValue<Certificate>(template).ExcludedURIDomains) > 0)) && !oidInExtensions((oidExtensionNameConstraints as asn1.ObjectIdentifier), $.pointerValue<Certificate>(template).ExtraExtensions)) {
		$.arrayIndex(ret!, n).Id = (oidExtensionNameConstraints as asn1.ObjectIdentifier)
		$.arrayIndex(ret!, n).Critical = $.pointerValue<Certificate>(template).PermittedDNSDomainsCritical

		let ipAndMask: ((ipNet: net.IPNet | $.VarRef<net.IPNet> | null) => $.Slice<number> | globalThis.Promise<$.Slice<number>>) | null = $.functionValue((ipNet: net.IPNet | $.VarRef<net.IPNet> | null): $.Slice<number> => {
			let maskedIP: net.IP = (net.IP_Mask($.pointerValue<net.IPNet>(ipNet).IP, ($.pointerValue<net.IPNet>(ipNet).Mask as net.IPMask)) as net.IP)
			let __goscriptShadow10: $.Slice<number> = $.makeSlice<number>(0, $.len((maskedIP as net.IP)) + $.len(($.pointerValue<net.IPNet>(ipNet).Mask as net.IPMask)), "byte")
			__goscriptShadow10 = $.appendSlice(__goscriptShadow10, maskedIP, $.byteSliceHint)
			__goscriptShadow10 = $.appendSlice(__goscriptShadow10, $.pointerValue<net.IPNet>(ipNet).Mask, $.byteSliceHint)
			return __goscriptShadow10
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "net.IPNet" }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }] } as $.FunctionTypeInfo))

		let serialiseConstraints: ((dns: $.Slice<string>, ips: $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>, emails: $.Slice<string>, uriDomains: $.Slice<string>) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null = $.functionValue(async (dns: $.Slice<string>, ips: $.Slice<net.IPNet | $.VarRef<net.IPNet> | null>, emails: $.Slice<string>, uriDomains: $.Slice<string>): globalThis.Promise<[$.Slice<number>, $.GoError]> => {
			let der: $.Slice<number> = null as $.Slice<number>
			let err: $.GoError = null as $.GoError
			let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))

			for (let __goscriptRangeTarget22 = dns, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget22); __rangeIndex++) {
				let name = __goscriptRangeTarget22![__rangeIndex]
				{
					err = isIA5String(name)
					if (err != null) {
						return [null, err]
					}
				}

				await b.value.AddASN1($.uint(cryptobyte_asn1.SEQUENCE, 8), $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddASN1.call(b, $.uint(cryptobyte_asn1.Tag_ContextSpecific(2), 8), $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						cryptobyte.Builder.prototype.AddBytes.call(b, $.stringToBytes(name))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}

			for (let __goscriptRangeTarget23 = ips, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget23); __rangeIndex++) {
				let ipNet = __goscriptRangeTarget23![__rangeIndex]
				await b.value.AddASN1($.uint(cryptobyte_asn1.SEQUENCE, 8), $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddASN1.call(b, $.uint(cryptobyte_asn1.Tag_ContextSpecific(7), 8), $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
						cryptobyte.Builder.prototype.AddBytes.call(b, await ipAndMask!(ipNet))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}

			for (let __goscriptRangeTarget24 = emails, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget24); __rangeIndex++) {
				let email = __goscriptRangeTarget24![__rangeIndex]
				{
					err = isIA5String(email)
					if (err != null) {
						return [null, err]
					}
				}

				await b.value.AddASN1($.uint(cryptobyte_asn1.SEQUENCE, 8), $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddASN1.call(b, $.uint(cryptobyte_asn1.Tag_ContextSpecific(1), 8), $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						cryptobyte.Builder.prototype.AddBytes.call(b, $.stringToBytes(email))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}

			for (let __goscriptRangeTarget25 = uriDomains, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget25); __rangeIndex++) {
				let uriDomain = __goscriptRangeTarget25![__rangeIndex]
				{
					err = isIA5String(uriDomain)
					if (err != null) {
						return [null, err]
					}
				}

				await b.value.AddASN1($.uint(cryptobyte_asn1.SEQUENCE, 8), $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddASN1.call(b, $.uint(cryptobyte_asn1.Tag_ContextSpecific(6), 8), $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						cryptobyte.Builder.prototype.AddBytes.call(b, $.stringToBytes(uriDomain))
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}

			return b.value.Bytes()
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "net.IPNet" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo))

		let __goscriptTuple26: any = await serialiseConstraints!($.pointerValue<Certificate>(template).PermittedDNSDomains, $.pointerValue<Certificate>(template).PermittedIPRanges, $.pointerValue<Certificate>(template).PermittedEmailAddresses, $.pointerValue<Certificate>(template).PermittedURIDomains)
		let permitted: $.Slice<number> = __goscriptTuple26[0]
		let __goscriptShadow11 = __goscriptTuple26[1]
		if (__goscriptShadow11 != null) {
			return [null, __goscriptShadow11]
		}

		let __goscriptTuple27: any = await serialiseConstraints!($.pointerValue<Certificate>(template).ExcludedDNSDomains, $.pointerValue<Certificate>(template).ExcludedIPRanges, $.pointerValue<Certificate>(template).ExcludedEmailAddresses, $.pointerValue<Certificate>(template).ExcludedURIDomains)
		let excluded: $.Slice<number> = __goscriptTuple27[0]
		__goscriptShadow11 = __goscriptTuple27[1]
		if (__goscriptShadow11 != null) {
			return [null, __goscriptShadow11]
		}

		let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
		await b.value.AddASN1($.uint(cryptobyte_asn1.SEQUENCE, 8), $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
			if ($.len(permitted) > 0) {
				await cryptobyte.Builder.prototype.AddASN1.call(b, $.uint(cryptobyte_asn1.Tag_Constructed(cryptobyte_asn1.Tag_ContextSpecific(0)), 8), $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					cryptobyte.Builder.prototype.AddBytes.call(b, permitted)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}

			if ($.len(excluded) > 0) {
				await cryptobyte.Builder.prototype.AddASN1.call(b, $.uint(cryptobyte_asn1.Tag_Constructed(cryptobyte_asn1.Tag_ContextSpecific(1)), 8), $.functionValue((b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
					cryptobyte.Builder.prototype.AddBytes.call(b, excluded)
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

		let __goscriptTuple28: any = b.value.Bytes()
		$.arrayIndex(ret!, n).Value = __goscriptTuple28[0]
		__goscriptShadow11 = __goscriptTuple28[1]
		if (__goscriptShadow11 != null) {
			return [null, __goscriptShadow11]
		}
		n++
	}

	if (($.len($.pointerValue<Certificate>(template).CRLDistributionPoints) > 0) && !oidInExtensions((oidExtensionCRLDistributionPoints as asn1.ObjectIdentifier), $.pointerValue<Certificate>(template).ExtraExtensions)) {
		$.arrayIndex(ret!, n).Id = (oidExtensionCRLDistributionPoints as asn1.ObjectIdentifier)

		let crlDp: $.Slice<distributionPoint> = null as $.Slice<distributionPoint>
		for (let __goscriptRangeTarget26 = $.pointerValue<Certificate>(template).CRLDistributionPoints, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget26); __rangeIndex++) {
			let name = __goscriptRangeTarget26![__rangeIndex]
			let dp = $.markAsStructValue(new distributionPoint({DistributionPoint: $.markAsStructValue(new distributionPointName({FullName: $.arrayToSlice<asn1.RawValue>([$.markAsStructValue(new asn1.RawValue({Tag: 6, Class: 2, Bytes: $.stringToBytes(name)}))])}))}))
			crlDp = $.append(crlDp, dp)
		}

		let __goscriptTuple29: any = await asn1.Marshal($.interfaceValue<any>(crlDp, "[]x509.distributionPoint", { kind: $.TypeKind.Slice, elemType: "x509.distributionPoint" }))
		$.arrayIndex(ret!, n).Value = __goscriptTuple29[0]
		err = __goscriptTuple29[1]
		if (err != null) {
			return [ret, err]
		}
		n++
	}

	// Adding another extension here? Remember to update the maximum number
	// of elements in the make() at the top of the function and the list of
	// template fields used in CreateCertificate documentation.

	return [$.appendSlice($.goSlice(ret, undefined, n), $.pointerValue<Certificate>(template).ExtraExtensions), null]
}

export async function marshalKeyUsage(ku: KeyUsage): globalThis.Promise<[pkix2.Extension, $.GoError]> {
	let ext = $.markAsStructValue(new pkix2.Extension({Id: (oidExtensionKeyUsage as asn1.ObjectIdentifier), Critical: true}))

	let a: Uint8Array = new Uint8Array(2)
	a[0] = $.uint(reverseBitsInAByte($.uint($.uint(ku, 8), 8)), 8)
	a[1] = $.uint(reverseBitsInAByte($.uint($.uint(ku >> 8, 8), 8)), 8)

	let l = 1
	if ($.uint($.arrayIndex(a, 1), 8) != $.uint(0, 8)) {
		l = 2
	}

	let bitString: $.Slice<number> = $.goSlice(a, undefined, l)
	let err: $.GoError = null as $.GoError
	let __goscriptTuple30: any = await asn1.Marshal($.interfaceValue<any>((() => { const __goscriptLiteralField7 = asn1BitLength(bitString); return $.markAsStructValue(new asn1.BitString({Bytes: bitString, BitLength: __goscriptLiteralField7})) })(), "asn1.BitString", "asn1.BitString"))
	ext.Value = __goscriptTuple30[0]
	err = __goscriptTuple30[1]
	return [$.markAsStructValue($.cloneStructValue(ext)), err]
}

export async function marshalExtKeyUsage(extUsages: $.Slice<ExtKeyUsage>, unknownUsages: $.Slice<asn1.ObjectIdentifier>): globalThis.Promise<[pkix2.Extension, $.GoError]> {
	let ext = $.markAsStructValue(new pkix2.Extension({Id: (oidExtensionExtendedKeyUsage as asn1.ObjectIdentifier)}))

	let oids: $.Slice<asn1.ObjectIdentifier> = $.makeSlice<asn1.ObjectIdentifier>($.len(extUsages) + $.len(unknownUsages))
	for (let __goscriptRangeTarget27 = extUsages, i = 0; i < $.len(__goscriptRangeTarget27); i++) {
		let u = __goscriptRangeTarget27![i]
		{
			let __goscriptTuple31: any = oidFromExtKeyUsage(u)
			let oid: asn1.ObjectIdentifier = (__goscriptTuple31[0] as asn1.ObjectIdentifier)
			let ok = __goscriptTuple31[1]
			if (ok) {
				oids![i] = (oid as asn1.ObjectIdentifier)
			} else {
				return [$.markAsStructValue($.cloneStructValue(ext)), errors.New("x509: unknown extended key usage")]
			}
		}
	}

	$.copy($.goSlice(oids, $.len(extUsages), undefined), unknownUsages)

	let err: $.GoError = null as $.GoError
	let __goscriptTuple32: any = await asn1.Marshal($.interfaceValue<any>(oids, "[]asn1.ObjectIdentifier", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }))
	ext.Value = __goscriptTuple32[0]
	err = __goscriptTuple32[1]
	return [$.markAsStructValue($.cloneStructValue(ext)), err]
}

export async function marshalBasicConstraints(isCA: boolean, maxPathLen: number, maxPathLenZero: boolean): globalThis.Promise<[pkix2.Extension, $.GoError]> {
	let ext = $.markAsStructValue(new pkix2.Extension({Id: (oidExtensionBasicConstraints as asn1.ObjectIdentifier), Critical: true}))
	// Leaving MaxPathLen as zero indicates that no maximum path
	// length is desired, unless MaxPathLenZero is set. A value of
	// -1 causes encoding/asn1 to omit the value as desired.
	if ((maxPathLen == 0) && !maxPathLenZero) {
		maxPathLen = -1
	}
	let err: $.GoError = null as $.GoError
	let __goscriptTuple33: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue(new basicConstraints({IsCA: isCA, MaxPathLen: maxPathLen})), "x509.basicConstraints", "x509.basicConstraints"))
	ext.Value = __goscriptTuple33[0]
	err = __goscriptTuple33[1]
	return [$.markAsStructValue($.cloneStructValue(ext)), err]
}

export async function marshalCertificatePolicies(policies: $.Slice<__goscript_oid.OID>, policyIdentifiers: $.Slice<asn1.ObjectIdentifier>): globalThis.Promise<[pkix2.Extension, $.GoError]> {
	let ext = $.markAsStructValue(new pkix2.Extension({Id: (oidExtensionCertificatePolicies as asn1.ObjectIdentifier)}))

	let b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null = cryptobyte.NewBuilder($.makeSlice<number>(0, 128, "byte"))
	await cryptobyte.Builder.prototype.AddASN1.call(b, $.uint(cryptobyte_asn1.SEQUENCE, 8), $.functionValue(async (child: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
		if (!$.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(x509usepolicies)), "0")) {
			godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(x509usepolicies))
			for (let __goscriptRangeTarget28 = policies, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget28); __rangeIndex++) {
				let v = __goscriptRangeTarget28![__rangeIndex]
				await cryptobyte.Builder.prototype.AddASN1.call(child, $.uint(cryptobyte_asn1.SEQUENCE, 8), $.functionValue(async (child: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddASN1.call(child, $.uint(cryptobyte_asn1.OBJECT_IDENTIFIER, 8), $.functionValue((child: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
						if ($.len(v.der) == 0) {
							cryptobyte.Builder.prototype.SetError.call(child, errors.New("invalid policy object identifier"))
							return
						}
						cryptobyte.Builder.prototype.AddBytes.call(child, v.der)
					}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		} else {
			for (let __goscriptRangeTarget29 = policyIdentifiers, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget29); __rangeIndex++) {
				let v = __goscriptRangeTarget29![__rangeIndex]
				await cryptobyte.Builder.prototype.AddASN1.call(child, $.uint(cryptobyte_asn1.SEQUENCE, 8), $.functionValue(async (child: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
					await cryptobyte.Builder.prototype.AddASN1ObjectIdentifier.call(child, (v as asn1.ObjectIdentifier))
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
			}
		}
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))

	let err: $.GoError = null as $.GoError
	let __goscriptTuple34: any = cryptobyte.Builder.prototype.Bytes.call(b)
	ext.Value = __goscriptTuple34[0]
	err = __goscriptTuple34[1]
	return [$.markAsStructValue($.cloneStructValue(ext)), err]
}

export async function buildCSRExtensions(template: CertificateRequest | $.VarRef<CertificateRequest> | null): globalThis.Promise<[$.Slice<pkix2.Extension>, $.GoError]> {
	let ret: $.Slice<pkix2.Extension> = null as $.Slice<pkix2.Extension>

	if ((((($.len($.pointerValue<CertificateRequest>(template).DNSNames) > 0) || ($.len($.pointerValue<CertificateRequest>(template).EmailAddresses) > 0)) || ($.len($.pointerValue<CertificateRequest>(template).IPAddresses) > 0)) || ($.len($.pointerValue<CertificateRequest>(template).URIs) > 0)) && !oidInExtensions((oidExtensionSubjectAltName as asn1.ObjectIdentifier), $.pointerValue<CertificateRequest>(template).ExtraExtensions)) {
		let __goscriptTuple35: any = await marshalSANs($.pointerValue<CertificateRequest>(template).DNSNames, $.pointerValue<CertificateRequest>(template).EmailAddresses, $.pointerValue<CertificateRequest>(template).IPAddresses, $.pointerValue<CertificateRequest>(template).URIs)
		let sanBytes: $.Slice<number> = __goscriptTuple35[0]
		let err = __goscriptTuple35[1]
		if (err != null) {
			return [null, err]
		}

		ret = $.append(ret, $.markAsStructValue(new pkix2.Extension({Id: (oidExtensionSubjectAltName as asn1.ObjectIdentifier), Value: sanBytes})))
	}

	return [$.appendSlice(ret, $.pointerValue<CertificateRequest>(template).ExtraExtensions), null]
}

export async function subjectBytes(cert: Certificate | $.VarRef<Certificate> | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	if ($.len($.pointerValue<Certificate>(cert).RawSubject) > 0) {
		return [$.pointerValue<Certificate>(cert).RawSubject, null]
	}

	return asn1.Marshal($.namedValueInterfaceValue<any>($.markAsStructValue($.cloneStructValue($.pointerValue<Certificate>(cert).Subject)).ToRDNSequence(), "pkix.RDNSequence", {String: (receiver: any, ...args: any[]) => (pkix2.RDNSequence_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Slice, typeName: "pkix.RDNSequence", elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RelativeDistinguishedNameSET", elemType: "pkix.AttributeTypeAndValue" } }, [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
}

export async function signingParamsForKey(key: crypto.Signer | null, sigAlgo: SignatureAlgorithm): globalThis.Promise<[SignatureAlgorithm, pkix2.AlgorithmIdentifier, $.GoError]> {
	let ai: pkix2.AlgorithmIdentifier = $.markAsStructValue(new pkix2.AlgorithmIdentifier())
	let pubType: PublicKeyAlgorithm = 0
	let defaultAlgo: SignatureAlgorithm = 0

	{
		const __goscriptTypeSwitchValue = await $.pointerValue<Exclude<crypto.Signer, null>>(key).Public()
		switch (true) {
			case $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).ok:
				{
					let pub: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null = $.typeAssert<rsa.PublicKey | $.VarRef<rsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PublicKey" }).value
					pubType = 1
					defaultAlgo = 4
				}
				break
			case $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).ok:
				{
					let pub: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = $.typeAssert<ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" }).value
					pubType = 3
					{
						let __goscriptSwitch2 = $.pointerValue<ecdsa.PublicKey>(pub).Curve
						switch (true) {
							case $.comparableEqual(__goscriptSwitch2, await elliptic.P224()):
							case $.comparableEqual(__goscriptSwitch2, await elliptic.P256()):
							{
								defaultAlgo = 10
								break
							}
							case $.comparableEqual(__goscriptSwitch2, await elliptic.P384()):
							{
								defaultAlgo = 11
								break
							}
							case $.comparableEqual(__goscriptSwitch2, await elliptic.P521()):
							{
								defaultAlgo = 12
								break
							}
							default:
							{
								return [0, $.markAsStructValue($.cloneStructValue(ai)), errors.New("x509: unsupported elliptic curve")]
								break
							}
						}
					}
				}
				break
			case $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let pub: ed25519.PublicKey = $.typeAssert<ed25519.PublicKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PublicKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					pubType = 4
					defaultAlgo = 16
				}
				break
			default:
				{
					let pub: any = __goscriptTypeSwitchValue
					return [0, $.markAsStructValue($.cloneStructValue(ai)), errors.New("x509: only RSA, ECDSA and Ed25519 keys supported")]
				}
				break
		}
	}

	if (sigAlgo == 0) {
		sigAlgo = defaultAlgo
	}

	for (let __goscriptRangeTarget30 = __goscript_get_signatureAlgorithmDetails(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget30); __rangeIndex++) {
		let details = __goscriptRangeTarget30![__rangeIndex]
		if (details.algo == sigAlgo) {
			if (details.pubKeyAlgo != pubType) {
				return [0, $.markAsStructValue($.cloneStructValue(ai)), errors.New("x509: requested SignatureAlgorithm does not match private key type")]
			}
			if (details.hash == crypto.MD5) {
				return [0, $.markAsStructValue($.cloneStructValue(ai)), errors.New("x509: signing with MD5 is not supported")]
			}

			return [sigAlgo, $.markAsStructValue(new pkix2.AlgorithmIdentifier({Algorithm: (details.oid as asn1.ObjectIdentifier), Parameters: $.markAsStructValue($.cloneStructValue(details.params))})), null]
		}
	}

	return [0, $.markAsStructValue($.cloneStructValue(ai)), errors.New("x509: unknown SignatureAlgorithm")]
}

export async function signTBS(tbs: $.Slice<number>, key: crypto.Signer | null, sigAlg: SignatureAlgorithm, rand: io.Reader | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let hashFunc = SignatureAlgorithm_hashFunc(sigAlg)

	let signerOpts: crypto.SignerOpts | null = $.namedValueInterfaceValue<crypto.SignerOpts | null>(hashFunc, "crypto.Hash", {Available: (receiver: any, ...args: any[]) => (crypto.Hash_Available as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), HashFunc: (receiver: any, ...args: any[]) => (crypto.Hash_HashFunc as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), New: (receiver: any, ...args: any[]) => (crypto.Hash_New as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Size: (receiver: any, ...args: any[]) => (crypto.Hash_Size as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (crypto.Hash_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" }, [{ name: "Available", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "HashFunc", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" } }] }, { name: "New", args: [], returns: [{ name: "_r0", type: "hash.Hash" }] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }])
	if (SignatureAlgorithm_isRSAPSS(sigAlg)) {
		signerOpts = $.interfaceValue<crypto.SignerOpts | null>(new rsa.PSSOptions({SaltLength: rsa.PSSSaltLengthEqualsHash, Hash: hashFunc}), "*rsa.PSSOptions", { kind: $.TypeKind.Pointer, elemType: "rsa.PSSOptions" })
	}

	let __goscriptTuple36: any = await crypto.SignMessage(key, rand, tbs, signerOpts)
	let signature: $.Slice<number> = __goscriptTuple36[0]
	let err = __goscriptTuple36[1]
	if (err != null) {
		return [null, err]
	}

	// Check the signature to ensure the crypto.Signer behaved correctly.
	{
		let __goscriptShadow12 = await checkSignature(sigAlg, tbs, signature, await $.pointerValue<Exclude<crypto.Signer, null>>(key).Public(), true)
		if (__goscriptShadow12 != null) {
			return [null, fmt.Errorf("x509: signature returned by signer is invalid: %w", (__goscriptShadow12 as any))]
		}
	}

	return [signature, null]
}

export let emptyASN1Subject: $.Slice<number> = new Uint8Array([48, 0]) as $.Slice<number>

export function __goscript_set_emptyASN1Subject(__goscriptValue: $.Slice<number>): void {
	emptyASN1Subject = __goscriptValue
}

export async function CreateCertificate(rand: io.Reader | null, template: Certificate | $.VarRef<Certificate> | null, parent: Certificate | $.VarRef<Certificate> | null, pub: any, priv: any): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let [key, ok] = $.typeAssertTuple<crypto.Signer | null>(priv, "crypto.Signer")
	if (!ok) {
		return [null, errors.New("x509: certificate private key does not implement crypto.Signer")]
	}

	let serialNumber: big.Int | $.VarRef<big.Int> | null = $.pointerValue<Certificate>(template).SerialNumber
	if (serialNumber == null) {
		// Generate a serial number following RFC 5280, Section 4.1.2.2 if one
		// is not provided. The serial number must be positive and at most 20
		// octets *when encoded*.
		let serialBytes: $.Slice<number> = $.makeSlice<number>(20, undefined, "byte")
		{
			let [, err] = await io.ReadFull($.pointerValueOrNil(rand)!, serialBytes)
			if (err != null) {
				return [null, err]
			}
		}
		// If the top bit is set, the serial will be padded with a leading zero
		// byte during encoding, so that it's not interpreted as a negative
		// integer. This padding would make the serial 21 octets so we clear the
		// top bit to ensure the correct length in all cases.
		serialBytes![0] = serialBytes![0] & ($.uint(0b0111_1111, 8))
		serialNumber = big.Int.prototype.SetBytes.call(new big.Int(), serialBytes)
	}

	// RFC 5280 Section 4.1.2.2: serial number must be positive
	//
	// We _should_ also restrict serials to <= 20 octets, but it turns out a lot of people
	// get this wrong, in part because the encoding can itself alter the length of the
	// serial. For now we accept these non-conformant serials.
	if (big.Int.prototype.Sign.call(serialNumber) == -1) {
		return [null, errors.New("x509: serial number must be positive")]
	}

	if ($.pointerValue<Certificate>(template).BasicConstraintsValid && ($.pointerValue<Certificate>(template).MaxPathLen < -1)) {
		return [null, errors.New("x509: invalid MaxPathLen, must be greater or equal to -1")]
	}

	if ((($.pointerValue<Certificate>(template).BasicConstraintsValid && !$.pointerValue<Certificate>(template).IsCA) && ($.pointerValue<Certificate>(template).MaxPathLen != -1)) && (($.pointerValue<Certificate>(template).MaxPathLen != 0) || $.pointerValue<Certificate>(template).MaxPathLenZero)) {
		return [null, errors.New("x509: only CAs are allowed to specify MaxPathLen")]
	}

	let [signatureAlgorithm, algorithmIdentifier, err] = await signingParamsForKey(key, $.pointerValue<Certificate>(template).SignatureAlgorithm)
	if (err != null) {
		return [null, err]
	}

	let __goscriptTuple37: any = await marshalPublicKey(pub)
	let publicKeyBytes: $.Slice<number> = __goscriptTuple37[0]
	let publicKeyAlgorithm = __goscriptTuple37[1]
	err = __goscriptTuple37[2]
	if (err != null) {
		return [null, err]
	}
	if (getPublicKeyAlgorithmFromOID((publicKeyAlgorithm.Algorithm as asn1.ObjectIdentifier)) == 0) {
		return [null, fmt.Errorf("x509: unsupported public key type: %T", pub)]
	}

	let __goscriptTuple38: any = await subjectBytes(parent)
	let asn1Issuer: $.Slice<number> = __goscriptTuple38[0]
	err = __goscriptTuple38[1]
	if (err != null) {
		return [null, err]
	}

	let __goscriptTuple39: any = await subjectBytes(template)
	let asn1Subject: $.Slice<number> = __goscriptTuple39[0]
	err = __goscriptTuple39[1]
	if (err != null) {
		return [null, err]
	}

	let authorityKeyId: $.Slice<number> = $.pointerValue<Certificate>(template).AuthorityKeyId
	if (!bytes.Equal(asn1Issuer, asn1Subject) && ($.len($.pointerValue<Certificate>(parent).SubjectKeyId) > 0)) {
		authorityKeyId = $.pointerValue<Certificate>(parent).SubjectKeyId
	}

	let subjectKeyId: $.Slice<number> = $.pointerValue<Certificate>(template).SubjectKeyId
	if (($.len(subjectKeyId) == 0) && $.pointerValue<Certificate>(template).IsCA) {
		if ($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(x509sha256skid)), "0")) {
			godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(x509sha256skid))
			// SubjectKeyId generated using method 1 in RFC 5280, Section 4.2.1.2:
			//   (1) The keyIdentifier is composed of the 160-bit SHA-1 hash of the
			//   value of the BIT STRING subjectPublicKey (excluding the tag,
			//   length, and number of unused bits).
			let h = await sha1.Sum(publicKeyBytes)
			subjectKeyId = $.goSlice(h, undefined, undefined)
		} else {
			// SubjectKeyId generated using method 1 in RFC 7093, Section 2:
			//    1) The keyIdentifier is composed of the leftmost 160-bits of the
			//    SHA-256 hash of the value of the BIT STRING subjectPublicKey
			//    (excluding the tag, length, and number of unused bits).
			let h = await sha256.Sum256(publicKeyBytes)
			subjectKeyId = $.goSlice(h, undefined, 20)
		}
	}

	// Check that the signer's public key matches the private key, if available.
	type privateKey = {
		Equal(_p0: crypto.PublicKey | null): boolean | globalThis.Promise<boolean>
	}

	$.registerInterfaceType(
		"x509.privateKey",
		null,
		[{ name: "Equal", args: [{ name: "_p0", type: "crypto.PublicKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }]
	);
	{
		let [privPub, __goscriptShadow13] = $.typeAssertTuple<privateKey | null>(await $.pointerValue<Exclude<crypto.Signer, null>>(key).Public(), "x509.privateKey")
		if (!__goscriptShadow13) {
			return [null, errors.New("x509: internal error: supported public key does not implement Equal")]
		} else {
			if (($.pointerValue<Certificate>(parent).PublicKey != null) && !await $.pointerValue<Exclude<privateKey, null>>(privPub).Equal(($.pointerValue<Certificate>(parent).PublicKey as crypto.PublicKey | null))) {
				return [null, errors.New("x509: provided PrivateKey doesn't match parent's PublicKey")]
			}
		}
	}

	let __goscriptTuple40: any = await buildCertExtensions(template, bytes.Equal(asn1Subject, emptyASN1Subject), authorityKeyId, subjectKeyId)
	let extensions: $.Slice<pkix2.Extension> = __goscriptTuple40[0]
	err = __goscriptTuple40[1]
	if (err != null) {
		return [null, err]
	}

	let encodedPublicKey = $.markAsStructValue(new asn1.BitString({BitLength: $.len(publicKeyBytes) * 8, Bytes: publicKeyBytes}))
	let c = $.markAsStructValue(new tbsCertificate({Version: 2, SerialNumber: serialNumber, SignatureAlgorithm: $.markAsStructValue($.cloneStructValue(algorithmIdentifier)), Issuer: $.markAsStructValue(new asn1.RawValue({FullBytes: asn1Issuer})), Validity: (() => { const __goscriptLiteralField8 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.pointerValue<Certificate>(template).NotBefore)).UTC())); const __goscriptLiteralField9 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.pointerValue<Certificate>(template).NotAfter)).UTC())); return $.markAsStructValue(new validity({NotBefore: __goscriptLiteralField8, NotAfter: __goscriptLiteralField9})) })(), Subject: $.markAsStructValue(new asn1.RawValue({FullBytes: asn1Subject})), PublicKey: $.markAsStructValue(new publicKeyInfo({Raw: (null as asn1.RawContent), Algorithm: $.markAsStructValue($.cloneStructValue(publicKeyAlgorithm)), PublicKey: $.markAsStructValue($.cloneStructValue(encodedPublicKey))})), Extensions: extensions}))

	let __goscriptTuple41: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(c)), "x509.tbsCertificate", "x509.tbsCertificate"))
	let tbsCertContents: $.Slice<number> = __goscriptTuple41[0]
	err = __goscriptTuple41[1]
	if (err != null) {
		return [null, err]
	}
	c.Raw = (tbsCertContents as asn1.RawContent)

	let __goscriptTuple42: any = await signTBS(tbsCertContents, key, signatureAlgorithm, rand)
	let signature: $.Slice<number> = __goscriptTuple42[0]
	err = __goscriptTuple42[1]
	if (err != null) {
		return [null, err]
	}

	return asn1.Marshal($.interfaceValue<any>($.markAsStructValue(new certificate({TBSCertificate: $.markAsStructValue($.cloneStructValue(c)), SignatureAlgorithm: $.markAsStructValue($.cloneStructValue(algorithmIdentifier)), SignatureValue: $.markAsStructValue(new asn1.BitString({Bytes: signature, BitLength: $.len(signature) * 8}))})), "x509.certificate", "x509.certificate"))
}

export let x509sha256skid: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("x509sha256skid")

export function __goscript_set_x509sha256skid(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	x509sha256skid = __goscriptValue
}

export let pemCRLPrefix: $.Slice<number> = new Uint8Array([45, 45, 45, 45, 45, 66, 69, 71, 73, 78, 32, 88, 53, 48, 57, 32, 67, 82, 76])

export function __goscript_set_pemCRLPrefix(__goscriptValue: $.Slice<number>): void {
	pemCRLPrefix = __goscriptValue
}

export let pemType: string = "X509 CRL"

export function __goscript_set_pemType(__goscriptValue: string): void {
	pemType = __goscriptValue
}

export async function ParseCRL(crlBytes: $.Slice<number>): globalThis.Promise<[pkix2.CertificateList | $.VarRef<pkix2.CertificateList> | null, $.GoError]> {
	if (bytes.HasPrefix(crlBytes, pemCRLPrefix)) {
		let __goscriptTuple43: any = pem.Decode(crlBytes)
		let block: pem.Block | $.VarRef<pem.Block> | null = __goscriptTuple43[0]
		if ((block != null) && ($.stringEqual($.pointerValue<pem.Block>(block).Type, pemType))) {
			crlBytes = $.pointerValue<pem.Block>(block).Bytes
		}
	}
	return ParseDERCRL(crlBytes)
}

export async function ParseDERCRL(derBytes: $.Slice<number>): globalThis.Promise<[pkix2.CertificateList | $.VarRef<pkix2.CertificateList> | null, $.GoError]> {
	let certList: pkix2.CertificateList | $.VarRef<pkix2.CertificateList> | null = new pkix2.CertificateList()
	{
		let __goscriptTuple44: any = await asn1.Unmarshal(derBytes, $.interfaceValue<any>(certList, "*pkix.CertificateList", { kind: $.TypeKind.Pointer, elemType: "pkix.CertificateList" }))
		let rest: $.Slice<number> = __goscriptTuple44[0]
		let err = __goscriptTuple44[1]
		if (err != null) {
			return [null, err]
		} else {
			if ($.len(rest) != 0) {
				return [null, errors.New("x509: trailing data after CRL")]
			}
		}
	}
	return [certList, null]
}

export let oidExtensionRequest: asn1.ObjectIdentifier = ($.arrayToSlice<number>([1, 2, 840, 113549, 1, 9, 14]) as asn1.ObjectIdentifier)

export function __goscript_set_oidExtensionRequest(__goscriptValue: asn1.ObjectIdentifier): void {
	oidExtensionRequest = __goscriptValue
}

export async function newRawAttributes(attributes: $.Slice<pkix2.AttributeTypeAndValueSET>): globalThis.Promise<[$.Slice<asn1.RawValue>, $.GoError]> {
	let rawAttributes: $.VarRef<$.Slice<asn1.RawValue>> = $.varRef(null as $.Slice<asn1.RawValue>)
	let __goscriptTuple45: any = await asn1.Marshal($.interfaceValue<any>(attributes, "[]pkix.AttributeTypeAndValueSET", { kind: $.TypeKind.Slice, elemType: "pkix.AttributeTypeAndValueSET" }))
	let b: $.Slice<number> = __goscriptTuple45[0]
	let err = __goscriptTuple45[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple46: any = await asn1.Unmarshal(b, $.interfaceValue<any>(rawAttributes, "*[]asn1.RawValue", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: "asn1.RawValue" } }))
	let rest: $.Slice<number> = __goscriptTuple46[0]
	err = __goscriptTuple46[1]
	if (err != null) {
		return [null, err]
	}
	if ($.len(rest) != 0) {
		return [null, errors.New("x509: failed to unmarshal raw CSR Attributes")]
	}
	return [rawAttributes.value, null]
}

export async function parseRawAttributes(rawAttributes: $.Slice<asn1.RawValue>): globalThis.Promise<$.Slice<pkix2.AttributeTypeAndValueSET>> {
	let attributes: $.Slice<pkix2.AttributeTypeAndValueSET> = null as $.Slice<pkix2.AttributeTypeAndValueSET>
	for (let __goscriptRangeTarget31 = rawAttributes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget31); __rangeIndex++) {
		let rawAttr = __goscriptRangeTarget31![__rangeIndex]
		let attr: $.VarRef<pkix2.AttributeTypeAndValueSET> = $.varRef($.markAsStructValue(new pkix2.AttributeTypeAndValueSET()))
		let __goscriptTuple47: any = await asn1.Unmarshal(rawAttr.FullBytes, $.interfaceValue<any>(attr, "*pkix.AttributeTypeAndValueSET", { kind: $.TypeKind.Pointer, elemType: "pkix.AttributeTypeAndValueSET" }))
		let rest: $.Slice<number> = __goscriptTuple47[0]
		let err = __goscriptTuple47[1]
		// Ignore attributes that don't parse into pkix.AttributeTypeAndValueSET
		// (i.e.: challengePassword or unstructuredName).
		if ((err == null) && ($.len(rest) == 0)) {
			attributes = $.append(attributes, attr.value)
		}
	}
	return attributes
}

export async function parseCSRExtensions(rawAttributes: $.Slice<asn1.RawValue>): globalThis.Promise<[$.Slice<pkix2.Extension>, $.GoError]> {
	// pkcs10Attribute reflects the Attribute structure from RFC 2986, Section 4.1.
	class pkcs10Attribute {
		public get Id(): asn1.ObjectIdentifier {
			return this._fields.Id.value
		}
		public set Id(value: asn1.ObjectIdentifier) {
			this._fields.Id.value = value
		}

		public get Values(): $.Slice<asn1.RawValue> {
			return this._fields.Values.value
		}
		public set Values(value: $.Slice<asn1.RawValue>) {
			this._fields.Values.value = value
		}

		public _fields: {
			Id: $.VarRef<asn1.ObjectIdentifier>
			Values: $.VarRef<$.Slice<asn1.RawValue>>
		}

		constructor(init?: Partial<{Id?: asn1.ObjectIdentifier, Values?: $.Slice<asn1.RawValue>}>) {
			this._fields = {
				Id: $.varRef(init?.Id ?? (null as asn1.ObjectIdentifier)),
				Values: $.varRef(init?.Values ?? (null as $.Slice<asn1.RawValue>))
			}
		}

		public clone(): pkcs10Attribute {
			const cloned = new pkcs10Attribute()
			cloned._fields = {
				Id: $.varRef(this._fields.Id.value),
				Values: $.varRef(this._fields.Values.value)
			}
			return $.markAsStructValue(cloned)
		}

		static __typeInfo = $.registerStructType(
			"x509.pkcs10Attribute",
			() => new pkcs10Attribute(),
			[],
			pkcs10Attribute,
			[{ name: "Id", key: "Id", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, index: [0], offset: 0, exported: true }, { name: "Values", key: "Values", type: { kind: $.TypeKind.Slice, elemType: "asn1.RawValue" }, tag: "asn1:\"set\"", index: [1], offset: 24, exported: true }]
		)
	}

	let ret: $.Slice<pkix2.Extension> = null as $.Slice<pkix2.Extension>
	let requestedExts: globalThis.Map<string, boolean> | null = $.makeMap<string, boolean>()
	for (let __goscriptRangeTarget33 = rawAttributes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget33); __rangeIndex++) {
		let rawAttr = __goscriptRangeTarget33![__rangeIndex]
		let attr: $.VarRef<pkcs10Attribute> = $.varRef($.markAsStructValue(new pkcs10Attribute()))
		{
			let __goscriptTuple48: any = await asn1.Unmarshal(rawAttr.FullBytes, $.interfaceValue<any>(attr, "*x509.pkcs10Attribute", { kind: $.TypeKind.Pointer, elemType: "x509.pkcs10Attribute" }))
			let rest: $.Slice<number> = __goscriptTuple48[0]
			let err = __goscriptTuple48[1]
			if (((err != null) || ($.len(rest) != 0)) || ($.len(attr.value.Values) == 0)) {
				// Ignore attributes that don't parse.
				continue
			}
		}

		if (!asn1.ObjectIdentifier_Equal(attr.value.Id, (oidExtensionRequest as asn1.ObjectIdentifier))) {
			continue
		}

		let extensions: $.VarRef<$.Slice<pkix2.Extension>> = $.varRef(null as $.Slice<pkix2.Extension>)
		{
			let [, err] = await asn1.Unmarshal($.arrayIndex(attr.value.Values!, 0).FullBytes, $.interfaceValue<any>(extensions, "*[]pkix.Extension", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: "pkix.Extension" } }))
			if (err != null) {
				return [null, err]
			}
		}
		for (let __goscriptRangeTarget32 = extensions.value, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget32); __rangeIndex++) {
			let ext = __goscriptRangeTarget32![__rangeIndex]
			let oidStr = asn1.ObjectIdentifier_String(ext.Id)
			if ($.mapGet<string, boolean, boolean>(requestedExts, oidStr, false)[0]) {
				return [null, errors.New("x509: certificate request contains duplicate requested extensions")]
			}
			$.mapSet(requestedExts, oidStr, true)
		}
		ret = $.appendSlice(ret, extensions.value)
	}

	return [ret, null]
}

export async function CreateCertificateRequest(rand: io.Reader | null, template: CertificateRequest | $.VarRef<CertificateRequest> | null, priv: any): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let csr: $.Slice<number> = null as $.Slice<number>
	let err: $.GoError = null as $.GoError
	let [key, ok] = $.typeAssertTuple<crypto.Signer | null>(priv, "crypto.Signer")
	if (!ok) {
		return [null, errors.New("x509: certificate private key does not implement crypto.Signer")]
	}

	let __goscriptTuple49: any = await signingParamsForKey(key, $.pointerValue<CertificateRequest>(template).SignatureAlgorithm)
	let signatureAlgorithm = __goscriptTuple49[0]
	let algorithmIdentifier = __goscriptTuple49[1]
	err = __goscriptTuple49[2]
	if (err != null) {
		return [null, err]
	}

	let publicKeyBytes: $.Slice<number> = null as $.Slice<number>
	let publicKeyAlgorithm: pkix2.AlgorithmIdentifier = $.markAsStructValue(new pkix2.AlgorithmIdentifier())
	let __goscriptTuple50: any = await marshalPublicKey((await $.pointerValue<Exclude<crypto.Signer, null>>(key).Public() as any))
	publicKeyBytes = __goscriptTuple50[0]
	publicKeyAlgorithm = __goscriptTuple50[1]
	err = __goscriptTuple50[2]
	if (err != null) {
		return [null, err]
	}

	let __goscriptTuple51: any = await buildCSRExtensions(template)
	let extensions: $.Slice<pkix2.Extension> = __goscriptTuple51[0]
	err = __goscriptTuple51[1]
	if (err != null) {
		return [null, err]
	}

	// Make a copy of template.Attributes because we may alter it below.
	let attributes: $.Slice<pkix2.AttributeTypeAndValueSET> = $.makeSlice<pkix2.AttributeTypeAndValueSET>(0, $.len($.pointerValue<CertificateRequest>(template).Attributes), undefined, () => $.markAsStructValue(new pkix2.AttributeTypeAndValueSET()))
	for (let __goscriptRangeTarget34 = $.pointerValue<CertificateRequest>(template).Attributes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget34); __rangeIndex++) {
		let attr = __goscriptRangeTarget34![__rangeIndex]
		let values: $.Slice<$.Slice<pkix2.AttributeTypeAndValue>> = $.makeSlice<$.Slice<pkix2.AttributeTypeAndValue>>($.len(attr.Value))
		$.copy(values, attr.Value)
		attributes = $.append(attributes, $.markAsStructValue(new pkix2.AttributeTypeAndValueSET({Type: (attr.Type as asn1.ObjectIdentifier), Value: values})))
	}

	let extensionsAppended = false
	if ($.len(extensions) > 0) {
		// Append the extensions to an existing attribute if possible.
		for (let __goscriptRangeTarget38 = attributes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget38); __rangeIndex++) {
			let atvSet = __goscriptRangeTarget38![__rangeIndex]
			if (!asn1.ObjectIdentifier_Equal(atvSet.Type, (oidExtensionRequest as asn1.ObjectIdentifier)) || ($.len(atvSet.Value) == 0)) {
				continue
			}

			// specifiedExtensions contains all the extensions that we
			// found specified via template.Attributes.
			let specifiedExtensions: globalThis.Map<string, boolean> | null = $.makeMap<string, boolean>()

			for (let __goscriptRangeTarget36 = atvSet.Value, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget36); __rangeIndex++) {
				let atvs = __goscriptRangeTarget36![__rangeIndex]
				for (let __goscriptRangeTarget35 = atvs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget35); __rangeIndex++) {
					let atv = __goscriptRangeTarget35![__rangeIndex]
					$.mapSet(specifiedExtensions, asn1.ObjectIdentifier_String(atv.Type), true)
				}
			}

			let newValue: $.Slice<pkix2.AttributeTypeAndValue> = $.makeSlice<pkix2.AttributeTypeAndValue>(0, $.len($.arrayIndex(atvSet.Value!, 0)) + $.len(extensions), undefined, () => $.markAsStructValue(new pkix2.AttributeTypeAndValue()))
			newValue = $.appendSlice(newValue, $.arrayIndex(atvSet.Value!, 0))

			for (let __goscriptRangeTarget37 = extensions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget37); __rangeIndex++) {
				let e = __goscriptRangeTarget37![__rangeIndex]
				if ($.mapGet<string, boolean, boolean>(specifiedExtensions, asn1.ObjectIdentifier_String(e.Id), false)[0]) {
					// Attributes already contained a value for
					// this extension and it takes priority.
					continue
				}

				newValue = $.append(newValue, $.markAsStructValue(new pkix2.AttributeTypeAndValue({Type: (e.Id as asn1.ObjectIdentifier), Value: $.interfaceValue<any>(e.Value, "[]byte", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } })})))
			}

			atvSet.Value![0] = newValue
			extensionsAppended = true
			break
		}
	}

	let __goscriptTuple52: any = await newRawAttributes(attributes)
	let rawAttributes: $.Slice<asn1.RawValue> = __goscriptTuple52[0]
	err = __goscriptTuple52[1]
	if (err != null) {
		return [null, err]
	}

	// If not included in attributes, add a new attribute for the
	// extensions.
	if (($.len(extensions) > 0) && !extensionsAppended) {
		let attr = {Type: (oidExtensionRequest as asn1.ObjectIdentifier), Value: $.arrayToSlice<$.Slice<pkix2.Extension>>([extensions])}

		let __goscriptTuple53: any = await asn1.Marshal(attr)
		let b: $.Slice<number> = __goscriptTuple53[0]
		let __goscriptShadow14 = __goscriptTuple53[1]
		if (__goscriptShadow14 != null) {
			return [null, errors.New("x509: failed to serialise extensions attribute: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow14).Error())]
		}

		let rawValue: $.VarRef<asn1.RawValue> = $.varRef($.markAsStructValue(new asn1.RawValue()))
		{
			let [, __goscriptShadow15] = await asn1.Unmarshal(b, $.interfaceValue<any>(rawValue, "*asn1.RawValue", { kind: $.TypeKind.Pointer, elemType: "asn1.RawValue" }))
			if (__goscriptShadow15 != null) {
				return [null, __goscriptShadow15]
			}
		}

		rawAttributes = $.append(rawAttributes, rawValue.value)
	}

	let asn1Subject: $.Slice<number> = $.pointerValue<CertificateRequest>(template).RawSubject
	if ($.len(asn1Subject) == 0) {
		let __goscriptTuple54: any = await asn1.Marshal($.namedValueInterfaceValue<any>($.markAsStructValue($.cloneStructValue($.pointerValue<CertificateRequest>(template).Subject)).ToRDNSequence(), "pkix.RDNSequence", {String: (receiver: any, ...args: any[]) => (pkix2.RDNSequence_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Slice, typeName: "pkix.RDNSequence", elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RelativeDistinguishedNameSET", elemType: "pkix.AttributeTypeAndValue" } }, [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
		asn1Subject = __goscriptTuple54[0]
		err = __goscriptTuple54[1]
		if (err != null) {
			return [null, err]
		}
	}

	let tbsCSR = $.markAsStructValue(new tbsCertificateRequest({Version: 0, Subject: $.markAsStructValue(new asn1.RawValue({FullBytes: asn1Subject})), PublicKey: $.markAsStructValue(new publicKeyInfo({Algorithm: $.markAsStructValue($.cloneStructValue(publicKeyAlgorithm)), PublicKey: $.markAsStructValue(new asn1.BitString({Bytes: publicKeyBytes, BitLength: $.len(publicKeyBytes) * 8}))})), RawAttributes: rawAttributes}))

	let __goscriptTuple55: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(tbsCSR)), "x509.tbsCertificateRequest", "x509.tbsCertificateRequest"))
	let tbsCSRContents: $.Slice<number> = __goscriptTuple55[0]
	err = __goscriptTuple55[1]
	if (err != null) {
		return [null, err]
	}
	tbsCSR.Raw = (tbsCSRContents as asn1.RawContent)

	let __goscriptTuple56: any = await signTBS(tbsCSRContents, key, signatureAlgorithm, rand)
	let signature: $.Slice<number> = __goscriptTuple56[0]
	err = __goscriptTuple56[1]
	if (err != null) {
		return [null, err]
	}

	return asn1.Marshal($.interfaceValue<any>($.markAsStructValue(new certificateRequest({TBSCSR: $.markAsStructValue($.cloneStructValue(tbsCSR)), SignatureAlgorithm: $.markAsStructValue($.cloneStructValue(algorithmIdentifier)), SignatureValue: $.markAsStructValue(new asn1.BitString({Bytes: signature, BitLength: $.len(signature) * 8}))})), "x509.certificateRequest", "x509.certificateRequest"))
}

export async function ParseCertificateRequest(asn1Data: $.Slice<number>): globalThis.Promise<[CertificateRequest | $.VarRef<CertificateRequest> | null, $.GoError]> {
	let csr: $.VarRef<certificateRequest> = $.varRef($.markAsStructValue(new certificateRequest()))

	let __goscriptTuple57: any = await asn1.Unmarshal(asn1Data, $.interfaceValue<any>(csr, "*x509.certificateRequest", { kind: $.TypeKind.Pointer, elemType: "x509.certificateRequest" }))
	let rest: $.Slice<number> = __goscriptTuple57[0]
	let err = __goscriptTuple57[1]
	if (err != null) {
		return [null, err]
	} else {
		if ($.len(rest) != 0) {
			return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new asn1.SyntaxError({Msg: "trailing data"})), "asn1.SyntaxError", "asn1.SyntaxError")]
		}
	}

	return parseCertificateRequest(csr)
}

export async function parseCertificateRequest(_in: certificateRequest | $.VarRef<certificateRequest> | null): globalThis.Promise<[CertificateRequest | $.VarRef<CertificateRequest> | null, $.GoError]> {
	let out: CertificateRequest | $.VarRef<CertificateRequest> | null = (await (async () => { const __goscriptLiteralField10 = $.markAsStructValue($.cloneStructValue($.pointerValue<certificateRequest>(_in).SignatureValue)).RightAlign(); const __goscriptLiteralField11 = await getSignatureAlgorithmFromAI($.markAsStructValue($.cloneStructValue($.pointerValue<certificateRequest>(_in).SignatureAlgorithm))); const __goscriptLiteralField12 = getPublicKeyAlgorithmFromOID(($.pointerValue<certificateRequest>(_in).TBSCSR.PublicKey.Algorithm.Algorithm as asn1.ObjectIdentifier)); const __goscriptLiteralField13 = await parseRawAttributes($.pointerValue<certificateRequest>(_in).TBSCSR.RawAttributes); return new CertificateRequest({Raw: $.pointerValue<certificateRequest>(_in).Raw, RawTBSCertificateRequest: $.pointerValue<certificateRequest>(_in).TBSCSR.Raw, RawSubjectPublicKeyInfo: $.pointerValue<certificateRequest>(_in).TBSCSR.PublicKey.Raw, RawSubject: $.pointerValue<certificateRequest>(_in).TBSCSR.Subject.FullBytes, Signature: __goscriptLiteralField10, SignatureAlgorithm: __goscriptLiteralField11, PublicKeyAlgorithm: __goscriptLiteralField12, Version: $.pointerValue<certificateRequest>(_in).TBSCSR.Version, Attributes: __goscriptLiteralField13}) })())

	let err: $.GoError = null as $.GoError
	if ($.pointerValue<CertificateRequest>(out).PublicKeyAlgorithm != 0) {
		let __goscriptTuple58: any = await __goscript_parser.parsePublicKey($.pointerValue<certificateRequest>(_in).TBSCSR._fields.PublicKey)
		$.pointerValue<CertificateRequest>(out).PublicKey = __goscriptTuple58[0]
		err = __goscriptTuple58[1]
		if (err != null) {
			return [null, err]
		}
	}

	let subject: $.VarRef<pkix2.RDNSequence> = $.varRef(null as pkix2.RDNSequence)
	{
		let __goscriptTuple59: any = await asn1.Unmarshal($.pointerValue<certificateRequest>(_in).TBSCSR.Subject.FullBytes, $.namedValueInterfaceValue<any>(subject, "*pkix.RDNSequence", {String: (receiver: any, ...args: any[]) => (pkix2.RDNSequence_String as any)($.pointerValue(receiver), ...args)}, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RDNSequence", elemType: { kind: $.TypeKind.Slice, typeName: "pkix.RelativeDistinguishedNameSET", elemType: "pkix.AttributeTypeAndValue" } } }, [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
		let rest: $.Slice<number> = __goscriptTuple59[0]
		let __goscriptShadow16 = __goscriptTuple59[1]
		if (__goscriptShadow16 != null) {
			return [null, __goscriptShadow16]
		} else {
			if ($.len(rest) != 0) {
				return [null, errors.New("x509: trailing data after X.509 Subject")]
			}
		}
	}

	$.pointerValue<CertificateRequest>(out).Subject.FillFromRDNSequence(subject)

	{
		let __goscriptTuple60: any = await parseCSRExtensions($.pointerValue<certificateRequest>(_in).TBSCSR.RawAttributes)
		$.pointerValue<CertificateRequest>(out).Extensions = __goscriptTuple60[0]
		err = __goscriptTuple60[1]
		if (err != null) {
			return [null, err]
		}
	}

	for (let __goscriptRangeTarget39 = $.pointerValue<CertificateRequest>(out).Extensions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget39); __rangeIndex++) {
		let extension = __goscriptRangeTarget39![__rangeIndex]
		switch (true) {
			case asn1.ObjectIdentifier_Equal(extension.Id, (oidExtensionSubjectAltName as asn1.ObjectIdentifier)):
			{
				let __goscriptTuple61: any = await __goscript_parser.parseSANExtension((extension.Value as cryptobyte.String))
				$.pointerValue<CertificateRequest>(out).DNSNames = __goscriptTuple61[0]
				$.pointerValue<CertificateRequest>(out).EmailAddresses = __goscriptTuple61[1]
				$.pointerValue<CertificateRequest>(out).IPAddresses = __goscriptTuple61[2]
				$.pointerValue<CertificateRequest>(out).URIs = __goscriptTuple61[3]
				err = __goscriptTuple61[4]
				if (err != null) {
					return [null, err]
				}
				break
			}
		}
	}

	return [out, null]
}

export async function CreateRevocationList(rand: io.Reader | null, template: RevocationList | $.VarRef<RevocationList> | null, issuer: Certificate | $.VarRef<Certificate> | null, priv: crypto.Signer | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	if (template == null) {
		return [null, errors.New("x509: template can not be nil")]
	}
	if (issuer == null) {
		return [null, errors.New("x509: issuer can not be nil")]
	}
	if (($.pointerValue<Certificate>(issuer).KeyUsage & 64) == 0) {
		return [null, errors.New("x509: issuer must have the crlSign key usage bit set")]
	}
	if ($.len($.pointerValue<Certificate>(issuer).SubjectKeyId) == 0) {
		return [null, errors.New("x509: issuer certificate doesn't contain a subject key identifier")]
	}
	if ($.markAsStructValue($.cloneStructValue($.pointerValue<RevocationList>(template).NextUpdate)).Before($.markAsStructValue($.cloneStructValue($.pointerValue<RevocationList>(template).ThisUpdate)))) {
		return [null, errors.New("x509: template.ThisUpdate is after template.NextUpdate")]
	}
	if ($.pointerValue<RevocationList>(template).Number == null) {
		return [null, errors.New("x509: template contains nil Number field")]
	}

	let [signatureAlgorithm, algorithmIdentifier, err] = await signingParamsForKey(priv, $.pointerValue<RevocationList>(template).SignatureAlgorithm)
	if (err != null) {
		return [null, err]
	}

	let revokedCerts: $.Slice<pkix2.RevokedCertificate> = null as $.Slice<pkix2.RevokedCertificate>
	// Only process the deprecated RevokedCertificates field if it is populated
	// and the new RevokedCertificateEntries field is not populated.
	if (($.len($.pointerValue<RevocationList>(template).RevokedCertificates) > 0) && ($.len($.pointerValue<RevocationList>(template).RevokedCertificateEntries) == 0)) {
		// Force revocation times to UTC per RFC 5280.
		revokedCerts = $.makeSlice<pkix2.RevokedCertificate>($.len($.pointerValue<RevocationList>(template).RevokedCertificates), undefined, undefined, () => $.markAsStructValue(new pkix2.RevokedCertificate()))
		for (let __goscriptRangeTarget40 = $.pointerValue<RevocationList>(template).RevokedCertificates, i = 0; i < $.len(__goscriptRangeTarget40); i++) {
			let rc = __goscriptRangeTarget40![i]
			rc.RevocationTime = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(rc.RevocationTime)).UTC()))
			revokedCerts![i] = $.markAsStructValue($.cloneStructValue(rc))
		}
	} else {
		// Convert the ReasonCode field to a proper extension, and force revocation
		// times to UTC per RFC 5280.
		revokedCerts = $.makeSlice<pkix2.RevokedCertificate>($.len($.pointerValue<RevocationList>(template).RevokedCertificateEntries), undefined, undefined, () => $.markAsStructValue(new pkix2.RevokedCertificate()))
		for (let __goscriptRangeTarget42 = $.pointerValue<RevocationList>(template).RevokedCertificateEntries, i = 0; i < $.len(__goscriptRangeTarget42); i++) {
			let rce = __goscriptRangeTarget42![i]
			if (rce.SerialNumber == null) {
				return [null, errors.New("x509: template contains entry with nil SerialNumber field")]
			}
			if ($.markAsStructValue($.cloneStructValue(rce.RevocationTime)).IsZero()) {
				return [null, errors.New("x509: template contains entry with zero RevocationTime field")]
			}

			let rc = (() => { const __goscriptLiteralField14 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(rce.RevocationTime)).UTC())); return $.markAsStructValue(new pkix2.RevokedCertificate({SerialNumber: rce.SerialNumber, RevocationTime: __goscriptLiteralField14})) })()

			// Copy over any extra extensions, except for a Reason Code extension,
			// because we'll synthesize that ourselves to ensure it is correct.
			let exts: $.Slice<pkix2.Extension> = $.makeSlice<pkix2.Extension>(0, $.len(rce.ExtraExtensions), undefined, () => $.markAsStructValue(new pkix2.Extension()))
			for (let __goscriptRangeTarget41 = rce.ExtraExtensions, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget41); __rangeIndex++) {
				let ext = __goscriptRangeTarget41![__rangeIndex]
				if (asn1.ObjectIdentifier_Equal(ext.Id, (oidExtensionReasonCode as asn1.ObjectIdentifier))) {
					return [null, errors.New("x509: template contains entry with ReasonCode ExtraExtension; use ReasonCode field instead")]
				}
				exts = $.append(exts, ext)
			}

			// Only add a reasonCode extension if the reason is non-zero, as per
			// RFC 5280 Section 5.3.1.
			if (rce.ReasonCode != 0) {
				let __goscriptTuple62: any = await asn1.Marshal($.int(rce.ReasonCode))
				let reasonBytes: $.Slice<number> = __goscriptTuple62[0]
				let __goscriptShadow17 = __goscriptTuple62[1]
				if (__goscriptShadow17 != null) {
					return [null, __goscriptShadow17]
				}

				exts = $.append(exts, $.markAsStructValue(new pkix2.Extension({Id: (oidExtensionReasonCode as asn1.ObjectIdentifier), Value: reasonBytes})))
			}

			if ($.len(exts) > 0) {
				rc.Extensions = exts
			}
			revokedCerts![i] = $.markAsStructValue($.cloneStructValue(rc))
		}
	}

	let __goscriptTuple63: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue(new authKeyId({Id: $.pointerValue<Certificate>(issuer).SubjectKeyId})), "x509.authKeyId", "x509.authKeyId"))
	let aki: $.Slice<number> = __goscriptTuple63[0]
	err = __goscriptTuple63[1]
	if (err != null) {
		return [null, err]
	}

	{
		let numBytes: $.Slice<number> = big.Int.prototype.Bytes.call($.pointerValue<RevocationList>(template).Number)
		if (($.len(numBytes) > 20) || (($.len(numBytes) == 20) && ($.uint(($.arrayIndex(numBytes!, 0) & 0x80), 8) != $.uint(0, 8)))) {
			return [null, errors.New("x509: CRL number exceeds 20 octets")]
		}
	}
	let __goscriptTuple64: any = await asn1.Marshal($.interfaceValue<any>($.pointerValue<RevocationList>(template).Number, "*big.Int", { kind: $.TypeKind.Pointer, elemType: "big.Int" }))
	let crlNum: $.Slice<number> = __goscriptTuple64[0]
	err = __goscriptTuple64[1]
	if (err != null) {
		return [null, err]
	}

	// Correctly use the issuer's subject sequence if one is specified.
	let __goscriptTuple65: any = await subjectBytes(issuer)
	let issuerSubject: $.Slice<number> = __goscriptTuple65[0]
	err = __goscriptTuple65[1]
	if (err != null) {
		return [null, err]
	}

	let tbsCertList = (() => { const __goscriptLiteralField15 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.pointerValue<RevocationList>(template).ThisUpdate)).UTC())); const __goscriptLiteralField16 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.pointerValue<RevocationList>(template).NextUpdate)).UTC())); return $.markAsStructValue(new tbsCertificateList({Version: 1, Signature: $.markAsStructValue($.cloneStructValue(algorithmIdentifier)), Issuer: $.markAsStructValue(new asn1.RawValue({FullBytes: issuerSubject})), ThisUpdate: __goscriptLiteralField15, NextUpdate: __goscriptLiteralField16, Extensions: $.arrayToSlice<pkix2.Extension>([$.markAsStructValue(new pkix2.Extension({Id: (oidExtensionAuthorityKeyId as asn1.ObjectIdentifier), Value: aki})), $.markAsStructValue(new pkix2.Extension({Id: (oidExtensionCRLNumber as asn1.ObjectIdentifier), Value: crlNum}))])})) })()
	if ($.len(revokedCerts) > 0) {
		tbsCertList.RevokedCertificates = revokedCerts
	}

	if ($.len($.pointerValue<RevocationList>(template).ExtraExtensions) > 0) {
		tbsCertList.Extensions = $.appendSlice(tbsCertList.Extensions, $.pointerValue<RevocationList>(template).ExtraExtensions)
	}

	let __goscriptTuple66: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(tbsCertList)), "x509.tbsCertificateList", "x509.tbsCertificateList"))
	let tbsCertListContents: $.Slice<number> = __goscriptTuple66[0]
	err = __goscriptTuple66[1]
	if (err != null) {
		return [null, err]
	}

	// Optimization to only marshal this struct once, when signing and
	// then embedding in certificateList below.
	tbsCertList.Raw = (tbsCertListContents as asn1.RawContent)

	let __goscriptTuple67: any = await signTBS(tbsCertListContents, priv, signatureAlgorithm, rand)
	let signature: $.Slice<number> = __goscriptTuple67[0]
	err = __goscriptTuple67[1]
	if (err != null) {
		return [null, err]
	}

	return asn1.Marshal($.interfaceValue<any>($.markAsStructValue(new certificateList({TBSCertList: $.markAsStructValue($.cloneStructValue(tbsCertList)), SignatureAlgorithm: $.markAsStructValue($.cloneStructValue(algorithmIdentifier)), SignatureValue: $.markAsStructValue(new asn1.BitString({Bytes: signature, BitLength: $.len(signature) * 8}))})), "x509.certificateList", "x509.certificateList"))
}

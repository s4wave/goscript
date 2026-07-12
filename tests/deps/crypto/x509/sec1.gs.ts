// Generated file based on sec1.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as ecdsa from "@goscript/crypto/ecdsa/index.js"

import * as elliptic from "@goscript/crypto/elliptic/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as pkix from "@goscript/crypto/x509/pkix/index.js"

import * as big from "@goscript/math/big/index.js"

import * as __goscript_pkcs1 from "./pkcs1.gs.ts"

import * as __goscript_pkcs8 from "./pkcs8.gs.ts"

import * as __goscript_x509 from "./x509.gs.ts"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/ecdsa/index.js"
import "@goscript/crypto/elliptic/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "@goscript/math/big/index.js"
import "./pkcs1.gs.ts"
import "./pkcs8.gs.ts"
import "./x509.gs.ts"

export class ecPrivateKey {
	public get Version(): number {
		return this._fields.Version.value
	}
	public set Version(value: number) {
		this._fields.Version.value = value
	}

	public get PrivateKey(): $.Slice<number> {
		return this._fields.PrivateKey.value
	}
	public set PrivateKey(value: $.Slice<number>) {
		this._fields.PrivateKey.value = value
	}

	public get NamedCurveOID(): asn1.ObjectIdentifier {
		return this._fields.NamedCurveOID.value
	}
	public set NamedCurveOID(value: asn1.ObjectIdentifier) {
		this._fields.NamedCurveOID.value = value
	}

	public get PublicKey(): asn1.BitString {
		return this._fields.PublicKey.value
	}
	public set PublicKey(value: asn1.BitString) {
		this._fields.PublicKey.value = value
	}

	public _fields: {
		Version: $.VarRef<number>
		PrivateKey: $.VarRef<$.Slice<number>>
		NamedCurveOID: $.VarRef<asn1.ObjectIdentifier>
		PublicKey: $.VarRef<asn1.BitString>
	}

	constructor(init?: Partial<{Version?: number, PrivateKey?: $.Slice<number>, NamedCurveOID?: asn1.ObjectIdentifier, PublicKey?: asn1.BitString}>) {
		this._fields = {
			Version: $.varRef(init?.Version ?? (0 as number)),
			PrivateKey: $.varRef(init?.PrivateKey ?? (null as $.Slice<number>)),
			NamedCurveOID: $.varRef(init?.NamedCurveOID ?? (null as asn1.ObjectIdentifier)),
			PublicKey: $.varRef(init?.PublicKey ? $.markAsStructValue($.cloneStructValue(init.PublicKey)) : $.markAsStructValue(new asn1.BitString()))
		}
	}

	public clone(): ecPrivateKey {
		const cloned = new ecPrivateKey()
		cloned._fields = {
			Version: $.varRef(this._fields.Version.value),
			PrivateKey: $.varRef(this._fields.PrivateKey.value),
			NamedCurveOID: $.varRef(this._fields.NamedCurveOID.value),
			PublicKey: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.PublicKey.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.ecPrivateKey",
		() => new ecPrivateKey(),
		[],
		ecPrivateKey,
		[{ name: "Version", key: "Version", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }, { name: "PrivateKey", key: "PrivateKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [1], offset: 8, exported: true }, { name: "NamedCurveOID", key: "NamedCurveOID", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, tag: "asn1:\"optional,explicit,tag:0\"", index: [2], offset: 32, exported: true }, { name: "PublicKey", key: "PublicKey", type: "asn1.BitString", tag: "asn1:\"optional,explicit,tag:1\"", index: [3], offset: 56, exported: true }]
	)
}

export const ecPrivKeyVersion: number = 1

export async function ParseECPrivateKey(der: $.Slice<number>): globalThis.Promise<[ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null, $.GoError]> {
	return parseECPrivateKey(null, der)
}

export async function MarshalECPrivateKey(key: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let __goscriptTuple0: any = await __goscript_x509.oidFromNamedCurve($.pointerValue<ecdsa.PrivateKey>(key).PublicKey.Curve)
	let oid: asn1.ObjectIdentifier = (__goscriptTuple0[0] as asn1.ObjectIdentifier)
	let ok = __goscriptTuple0[1]
	if (!ok) {
		return [null, errors.New("x509: unknown elliptic curve")]
	}

	return marshalECPrivateKeyWithOID(key, (oid as asn1.ObjectIdentifier))
}

export async function marshalECPrivateKeyWithOID(key: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null, oid: asn1.ObjectIdentifier): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let __goscriptTuple1: any = await ecdsa.PrivateKey.prototype.Bytes.call(key)
	let privateKey: $.Slice<number> = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple2: any = await $.pointerValue<ecdsa.PrivateKey>(key).PublicKey.Bytes()
	let publicKey: $.Slice<number> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if (err != null) {
		return [null, err]
	}
	return asn1.Marshal($.interfaceValue<any>($.markAsStructValue(new ecPrivateKey({Version: 1, PrivateKey: privateKey, NamedCurveOID: (oid as asn1.ObjectIdentifier), PublicKey: $.markAsStructValue(new asn1.BitString({Bytes: publicKey}))})), "x509.ecPrivateKey", "x509.ecPrivateKey"))
}

export async function marshalECDHPrivateKey(key: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	return asn1.Marshal($.interfaceValue<any>((() => { const __goscriptLiteralField0 = ecdh.PrivateKey.prototype.Bytes.call($.pointerValue<ecdh.PrivateKey>(key)); return $.markAsStructValue(new ecPrivateKey({Version: 1, PrivateKey: __goscriptLiteralField0, PublicKey: (() => { const __goscriptLiteralField1 = ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>(ecdh.PrivateKey.prototype.PublicKey.call($.pointerValue<ecdh.PrivateKey>(key)))); return $.markAsStructValue(new asn1.BitString({Bytes: __goscriptLiteralField1})) })()})) })(), "x509.ecPrivateKey", "x509.ecPrivateKey"))
}

export async function parseECPrivateKey(namedCurveOID: $.VarRef<asn1.ObjectIdentifier> | null, der: $.Slice<number>): globalThis.Promise<[ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null, $.GoError]> {
	let key: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null = null as ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null
	let err: $.GoError = null as $.GoError
	let privKey: $.VarRef<ecPrivateKey> = $.varRef($.markAsStructValue(new ecPrivateKey()))
	{
		let [, __goscriptShadow0] = await asn1.Unmarshal(der, $.interfaceValue<any>(privKey, "*x509.ecPrivateKey", { kind: $.TypeKind.Pointer, elemType: "x509.ecPrivateKey" }))
		if (__goscriptShadow0 != null) {
			{
				let [, __goscriptShadow1] = await asn1.Unmarshal(der, $.interfaceValue<any>(new __goscript_pkcs8.pkcs8(), "*x509.pkcs8", { kind: $.TypeKind.Pointer, elemType: "x509.pkcs8" }))
				if (__goscriptShadow1 == null) {
					return [null, errors.New("x509: failed to parse private key (use ParsePKCS8PrivateKey instead for this key format)")]
				}
			}
			{
				let [, __goscriptShadow2] = await asn1.Unmarshal(der, $.interfaceValue<any>(new __goscript_pkcs1.pkcs1PrivateKey(), "*x509.pkcs1PrivateKey", { kind: $.TypeKind.Pointer, elemType: "x509.pkcs1PrivateKey" }))
				if (__goscriptShadow2 == null) {
					return [null, errors.New("x509: failed to parse private key (use ParsePKCS1PrivateKey instead for this key format)")]
				}
			}
			return [null, errors.New("x509: failed to parse EC private key: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0).Error())]
		}
	}
	if (privKey.value.Version != 1) {
		return [null, fmt.Errorf("x509: unknown EC private key version %d", $.namedValueInterfaceValue<any>(privKey.value.Version, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))]
	}

	let curve: elliptic.Curve | null = null as elliptic.Curve | null
	if (namedCurveOID != null) {
		curve = await __goscript_x509.namedCurveFromOID(($.pointerValue<asn1.ObjectIdentifier>(namedCurveOID) as asn1.ObjectIdentifier))
	} else {
		curve = await __goscript_x509.namedCurveFromOID((privKey.value.NamedCurveOID as asn1.ObjectIdentifier))
	}
	if (curve == null) {
		return [null, errors.New("x509: unknown elliptic curve")]
	}

	let size = Math.trunc((big.Int.prototype.BitLen.call($.pointerValue<elliptic.CurveParams>(await $.pointerValue<Exclude<elliptic.Curve, null>>(curve).Params()).N) + 7) / 8)
	let privateKey: $.Slice<number> = $.makeSlice<number>(size, undefined, "byte")

	// Some private keys have leading zero padding. This is invalid
	// according to [SEC1], but this code will ignore it.
	while ($.len(privKey.value.PrivateKey) > $.len(privateKey)) {
		if ($.uint($.arrayIndex(privKey.value.PrivateKey!, 0), 8) != $.uint(0, 8)) {
			return [null, errors.New("x509: invalid private key length")]
		}
		privKey.value.PrivateKey = $.goSlice(privKey.value.PrivateKey, 1, undefined)
	}

	// Some private keys remove all leading zeros, this is also invalid
	// according to [SEC1] but since OpenSSL used to do this, we ignore
	// this too.
	$.copy($.goSlice(privateKey, $.len(privateKey) - $.len(privKey.value.PrivateKey), undefined), privKey.value.PrivateKey)

	return ecdsa.ParseRawPrivateKey(curve, privateKey)
}

// Generated file based on pkcs8.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as ecdsa from "@goscript/crypto/ecdsa/index.js"

import * as ed25519 from "@goscript/crypto/ed25519/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as pkix from "@goscript/crypto/x509/pkix/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as elliptic from "@goscript/crypto/elliptic/index.js"

import * as big from "@goscript/math/big/index.js"

import * as __goscript_pkcs1 from "./pkcs1.gs.ts"

import * as __goscript_sec1 from "./sec1.gs.ts"

import * as __goscript_x509 from "./x509.gs.ts"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/ecdsa/index.js"
import "@goscript/crypto/ed25519/index.js"
import "@goscript/crypto/rsa/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/crypto/elliptic/index.js"
import "@goscript/math/big/index.js"
import "./pkcs1.gs.ts"
import "./sec1.gs.ts"
import "./x509.gs.ts"

export class pkcs8 {
	public get Version(): number {
		return this._fields.Version.value
	}
	public set Version(value: number) {
		this._fields.Version.value = value
	}

	public get Algo(): pkix.AlgorithmIdentifier {
		return this._fields.Algo.value
	}
	public set Algo(value: pkix.AlgorithmIdentifier) {
		this._fields.Algo.value = value
	}

	public get PrivateKey(): $.Slice<number> {
		return this._fields.PrivateKey.value
	}
	public set PrivateKey(value: $.Slice<number>) {
		this._fields.PrivateKey.value = value
	}

	public _fields: {
		Version: $.VarRef<number>
		Algo: $.VarRef<pkix.AlgorithmIdentifier>
		PrivateKey: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{Version?: number, Algo?: pkix.AlgorithmIdentifier, PrivateKey?: $.Slice<number>}>) {
		this._fields = {
			Version: $.varRef(init?.Version ?? (0 as number)),
			Algo: $.varRef(init?.Algo ? $.markAsStructValue($.cloneStructValue(init.Algo)) : $.markAsStructValue(new pkix.AlgorithmIdentifier())),
			PrivateKey: $.varRef(init?.PrivateKey ?? (null! as $.Slice<number>))
		}
	}

	public clone(): pkcs8 {
		const cloned = new pkcs8()
		cloned._fields = {
			Version: $.varRef(this._fields.Version.value),
			Algo: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.Algo.value))),
			PrivateKey: $.varRef(this._fields.PrivateKey.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.pkcs8",
		() => new pkcs8(),
		[],
		pkcs8,
		[{ name: "Version", key: "Version", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }, { name: "Algo", key: "Algo", type: "pkix.AlgorithmIdentifier", index: [1], offset: 8, exported: true }, { name: "PrivateKey", key: "PrivateKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [2], offset: 104, exported: true }]
	)
}

export async function ParsePKCS8PrivateKey(der: $.Slice<number>): globalThis.Promise<[any, $.GoError]> {
	let key: any = null! as any
	let err: $.GoError = null! as $.GoError
	let privKey: $.VarRef<pkcs8> = $.varRef($.markAsStructValue(new pkcs8()))
	{
		let [, __goscriptShadow0] = await asn1.Unmarshal(der, $.interfaceValue<any>(privKey, "*x509.pkcs8", { kind: $.TypeKind.Pointer, elemType: "x509.pkcs8" }))
		if (__goscriptShadow0 != null) {
			{
				let [, __goscriptShadow1] = await asn1.Unmarshal(der, $.interfaceValue<any>(new __goscript_sec1.ecPrivateKey(), "*x509.ecPrivateKey", { kind: $.TypeKind.Pointer, elemType: "x509.ecPrivateKey" }))
				if (__goscriptShadow1 == null) {
					return [null, errors.New("x509: failed to parse private key (use ParseECPrivateKey instead for this key format)")]
				}
			}
			{
				let [, __goscriptShadow2] = await asn1.Unmarshal(der, $.interfaceValue<any>(new __goscript_pkcs1.pkcs1PrivateKey(), "*x509.pkcs1PrivateKey", { kind: $.TypeKind.Pointer, elemType: "x509.pkcs1PrivateKey" }))
				if (__goscriptShadow2 == null) {
					return [null, errors.New("x509: failed to parse private key (use ParsePKCS1PrivateKey instead for this key format)")]
				}
			}
			return [null, __goscriptShadow0]
		}
	}
	switch (true) {
		case asn1.ObjectIdentifier_Equal(privKey.value.Algo.Algorithm, (__goscript_x509.oidPublicKeyRSA as asn1.ObjectIdentifier)):
		{
			let __goscriptTuple0: any = await __goscript_pkcs1.ParsePKCS1PrivateKey(privKey.value.PrivateKey)
			key = $.interfaceValue<any>(__goscriptTuple0[0], "*rsa.PrivateKey", { kind: $.TypeKind.Pointer, elemType: "rsa.PrivateKey" })
			err = __goscriptTuple0[1]
			if (err != null) {
				return [null, errors.New("x509: failed to parse RSA private key embedded in PKCS#8: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())]
			}
			return [key, null]
			break
		}
		case asn1.ObjectIdentifier_Equal(privKey.value.Algo.Algorithm, (__goscript_x509.oidPublicKeyECDSA as asn1.ObjectIdentifier)):
		{
			let bytes: $.Slice<number> = privKey.value.Algo.Parameters.FullBytes
			let namedCurveOID: $.VarRef<asn1.ObjectIdentifier> | null = $.varRef<asn1.ObjectIdentifier>(null! as asn1.ObjectIdentifier)
			{
				let [, __goscriptShadow3] = await asn1.Unmarshal(bytes, $.namedValueInterfaceValue<any>(namedCurveOID, "*asn1.ObjectIdentifier", {Equal: (receiver: any, ...args: any[]) => (asn1.ObjectIdentifier_Equal as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => (asn1.ObjectIdentifier_String as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }, [{ name: "Equal", args: [{ name: "other", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
				if (__goscriptShadow3 != null) {
					namedCurveOID = null
				}
			}
			let __goscriptTuple1: any = await __goscript_sec1.parseECPrivateKey(namedCurveOID, privKey.value.PrivateKey)
			key = $.interfaceValue<any>(__goscriptTuple1[0], "*ecdsa.PrivateKey", { kind: $.TypeKind.Pointer, elemType: "ecdsa.PrivateKey" })
			err = __goscriptTuple1[1]
			if (err != null) {
				return [null, errors.New("x509: failed to parse EC private key embedded in PKCS#8: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())]
			}
			return [key, null]
			break
		}
		case asn1.ObjectIdentifier_Equal(privKey.value.Algo.Algorithm, (__goscript_x509.oidPublicKeyEd25519 as asn1.ObjectIdentifier)):
		{
			{
				let l = $.len(privKey.value.Algo.Parameters.FullBytes)
				if (l != 0) {
					return [null, errors.New("x509: invalid Ed25519 private key parameters")]
				}
			}
			let curvePrivateKey: $.VarRef<$.Slice<number>> = $.varRef(null! as $.Slice<number>)
			{
				let [, __goscriptShadow4] = await asn1.Unmarshal(privKey.value.PrivateKey, $.interfaceValue<any>(curvePrivateKey, "*[]byte", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }))
				if (__goscriptShadow4 != null) {
					return [null, fmt.Errorf("x509: invalid Ed25519 private key: %v", (__goscriptShadow4 as any))]
				}
			}
			{
				let l = $.len(curvePrivateKey.value)
				if (l != ed25519.SeedSize) {
					return [null, fmt.Errorf("x509: invalid Ed25519 private key length: %d", $.basicInterfaceValue(l, "int"))]
				}
			}
			return [$.namedValueInterfaceValue<any>(await ed25519.NewKeyFromSeed(curvePrivateKey.value), "ed25519.PrivateKey", {Equal: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Public: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Public as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Seed: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Seed as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Sign: (receiver: any, ...args: any[]) => (ed25519.PrivateKey_Sign as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "ed25519.PrivateKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Equal", args: [{ name: "x", type: "crypto.PrivateKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Public", args: [], returns: [{ name: "_r0", type: "crypto.PublicKey" }] }, { name: "Seed", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Sign", args: [{ name: "rand", type: "io.Reader" }, { name: "message", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "opts", type: "crypto.SignerOpts" }], returns: [{ name: "signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }]), null]
			break
		}
		case asn1.ObjectIdentifier_Equal(privKey.value.Algo.Algorithm, (__goscript_x509.oidPublicKeyX25519 as asn1.ObjectIdentifier)):
		{
			{
				let l = $.len(privKey.value.Algo.Parameters.FullBytes)
				if (l != 0) {
					return [null, errors.New("x509: invalid X25519 private key parameters")]
				}
			}
			let curvePrivateKey: $.VarRef<$.Slice<number>> = $.varRef(null! as $.Slice<number>)
			{
				let [, __goscriptShadow5] = await asn1.Unmarshal(privKey.value.PrivateKey, $.interfaceValue<any>(curvePrivateKey, "*[]byte", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }))
				if (__goscriptShadow5 != null) {
					return [null, fmt.Errorf("x509: invalid X25519 private key: %v", (__goscriptShadow5 as any))]
				}
			}
			const __goscriptReturn0 = await $.pointerValue<Exclude<ecdh.Curve, null>>(ecdh.X25519()).NewPrivateKey(curvePrivateKey.value)
			return [$.interfaceValue<any>(__goscriptReturn0[0], "*ecdh.PrivateKey", { kind: $.TypeKind.Pointer, elemType: "ecdh.PrivateKey" }), __goscriptReturn0[1]]
			break
		}
		default:
		{
			return [null, fmt.Errorf("x509: PKCS#8 wrapping contained private key with unknown algorithm: %v", $.namedValueInterfaceValue<any>(privKey.value.Algo.Algorithm, "asn1.ObjectIdentifier", {Equal: (receiver: any, ...args: any[]) => (asn1.ObjectIdentifier_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => (asn1.ObjectIdentifier_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, [{ name: "Equal", args: [{ name: "other", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))]
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function MarshalPKCS8PrivateKey(key: any): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let privKey: pkcs8 = $.markAsStructValue(new pkcs8())

	{
		const __goscriptTypeSwitchValue = key
		switch (true) {
			case $.typeAssert<rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PrivateKey" }).ok:
				{
					let k: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null = $.typeAssert<rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rsa.PrivateKey" }).value
					privKey.Algo = $.markAsStructValue(new pkix.AlgorithmIdentifier({Algorithm: (__goscript_x509.oidPublicKeyRSA as asn1.ObjectIdentifier), Parameters: $.markAsStructValue($.cloneStructValue($.pointerValue<asn1.RawValue>(asn1.__goscript_get_NullRawValue())))}))
					await rsa.PrivateKey.prototype.Precompute.call(k)
					{
						let err = await rsa.PrivateKey.prototype.Validate.call(k)
						if (err != null) {
							return [null, err]
						}
					}
					privKey.PrivateKey = await __goscript_pkcs1.MarshalPKCS1PrivateKey(k)
				}
				break
			case $.typeAssert<ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PrivateKey" }).ok:
				{
					let k: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null = $.typeAssert<ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PrivateKey" }).value
					let __goscriptTuple2: any = await __goscript_x509.oidFromNamedCurve($.pointerValue<ecdsa.PrivateKey>(k).PublicKey.Curve)
					let oid: asn1.ObjectIdentifier = (__goscriptTuple2[0] as asn1.ObjectIdentifier)
					let ok = __goscriptTuple2[1]
					if (!ok) {
						return [null, errors.New("x509: unknown curve while marshaling to PKCS#8")]
					}
					let __goscriptTuple3: any = await asn1.Marshal($.namedValueInterfaceValue<any>(oid, "asn1.ObjectIdentifier", {Equal: (receiver: any, ...args: any[]) => (asn1.ObjectIdentifier_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => (asn1.ObjectIdentifier_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, [{ name: "Equal", args: [{ name: "other", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
					let oidBytes: $.Slice<number> = __goscriptTuple3[0]
					let err = __goscriptTuple3[1]
					if (err != null) {
						return [null, errors.New("x509: failed to marshal curve OID: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())]
					}
					privKey.Algo = $.markAsStructValue(new pkix.AlgorithmIdentifier({Algorithm: (__goscript_x509.oidPublicKeyECDSA as asn1.ObjectIdentifier), Parameters: $.markAsStructValue(new asn1.RawValue({FullBytes: oidBytes}))}))
					{
						let __goscriptTuple4: any = await __goscript_sec1.marshalECPrivateKeyWithOID(k, (null as asn1.ObjectIdentifier))
						privKey.PrivateKey = __goscriptTuple4[0]
						err = __goscriptTuple4[1]
						if (err != null) {
							return [null, errors.New("x509: failed to marshal EC private key while building PKCS#8: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())]
						}
					}
				}
				break
			case $.typeAssert<ed25519.PrivateKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PrivateKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let k: ed25519.PrivateKey = $.typeAssert<ed25519.PrivateKey>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ed25519.PrivateKey", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					privKey.Algo = $.markAsStructValue(new pkix.AlgorithmIdentifier({Algorithm: (__goscript_x509.oidPublicKeyEd25519 as asn1.ObjectIdentifier)}))
					let __goscriptTuple5: any = await asn1.Marshal($.interfaceValue<any>(ed25519.PrivateKey_Seed(k), "[]byte", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }))
					let curvePrivateKey: $.Slice<number> = __goscriptTuple5[0]
					let err = __goscriptTuple5[1]
					if (err != null) {
						return [null, fmt.Errorf("x509: failed to marshal private key: %v", (err as any))]
					}
					privKey.PrivateKey = curvePrivateKey
				}
				break
			case $.typeAssert<ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdh.PrivateKey" }).ok:
				{
					let k: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null = $.typeAssert<ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "ecdh.PrivateKey" }).value
					if ($.comparableEqual(ecdh.PrivateKey.prototype.Curve.call($.pointerValue<ecdh.PrivateKey>(k)), ecdh.X25519())) {
						privKey.Algo = $.markAsStructValue(new pkix.AlgorithmIdentifier({Algorithm: (__goscript_x509.oidPublicKeyX25519 as asn1.ObjectIdentifier)}))
						let err: $.GoError = null! as $.GoError
						{
							let __goscriptTuple6: any = await asn1.Marshal($.interfaceValue<any>(ecdh.PrivateKey.prototype.Bytes.call($.pointerValue<ecdh.PrivateKey>(k)), "[]byte", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }))
							privKey.PrivateKey = __goscriptTuple6[0]
							err = __goscriptTuple6[1]
							if (err != null) {
								return [null, fmt.Errorf("x509: failed to marshal private key: %v", (err as any))]
							}
						}
					} else {
						let __goscriptTuple7: any = __goscript_x509.oidFromECDHCurve(ecdh.PrivateKey.prototype.Curve.call($.pointerValue<ecdh.PrivateKey>(k)))
						let oid: asn1.ObjectIdentifier = (__goscriptTuple7[0] as asn1.ObjectIdentifier)
						let ok = __goscriptTuple7[1]
						if (!ok) {
							return [null, errors.New("x509: unknown curve while marshaling to PKCS#8")]
						}
						let __goscriptTuple8: any = await asn1.Marshal($.namedValueInterfaceValue<any>(oid, "asn1.ObjectIdentifier", {Equal: (receiver: any, ...args: any[]) => (asn1.ObjectIdentifier_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => (asn1.ObjectIdentifier_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, [{ name: "Equal", args: [{ name: "other", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]))
						let oidBytes: $.Slice<number> = __goscriptTuple8[0]
						let err = __goscriptTuple8[1]
						if (err != null) {
							return [null, errors.New("x509: failed to marshal curve OID: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())]
						}
						privKey.Algo = $.markAsStructValue(new pkix.AlgorithmIdentifier({Algorithm: (__goscript_x509.oidPublicKeyECDSA as asn1.ObjectIdentifier), Parameters: $.markAsStructValue(new asn1.RawValue({FullBytes: oidBytes}))}))
						{
							let __goscriptTuple9: any = await __goscript_sec1.marshalECDHPrivateKey(k)
							privKey.PrivateKey = __goscriptTuple9[0]
							err = __goscriptTuple9[1]
							if (err != null) {
								return [null, errors.New("x509: failed to marshal EC private key while building PKCS#8: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())]
							}
						}
					}
				}
				break
			default:
				{
					let k: any = __goscriptTypeSwitchValue
					return [null, fmt.Errorf("x509: unknown key type while marshaling PKCS#8: %T", key)]
				}
				break
		}
	}

	return asn1.Marshal($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(privKey)), "x509.pkcs8", "x509.pkcs8"))
}

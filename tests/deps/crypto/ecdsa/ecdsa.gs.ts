// Generated file based on ecdsa.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as elliptic from "@goscript/crypto/elliptic/index.js"

import * as boring from "@goscript/crypto/internal/boring/index.js"

import * as bbig from "@goscript/crypto/internal/boring/bbig/index.js"

import * as ecdsa from "@goscript/crypto/internal/fips140/ecdsa/index.js"

import * as nistec from "@goscript/crypto/internal/fips140/nistec/index.js"

import * as fips140cache from "@goscript/crypto/internal/fips140cache/index.js"

import * as fips140hash from "@goscript/crypto/internal/fips140hash/index.js"

import * as fips140only from "@goscript/crypto/internal/fips140only/index.js"

import * as rand2 from "@goscript/crypto/internal/rand/index.js"

import * as sha512 from "@goscript/crypto/sha512/index.js"

import * as subtle from "@goscript/crypto/subtle/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as big from "@goscript/math/big/index.js"

import * as cryptobyte from "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"

import * as asn1 from "@goscript/vendor/golang.org/x/crypto/cryptobyte/asn1/index.js"

import * as hash2 from "@goscript/hash/index.js"

import * as __goscript_ecdsa_legacy from "./ecdsa_legacy.gs.ts"

import * as __goscript_notboring from "./notboring.gs.ts"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/elliptic/index.js"
import "@goscript/crypto/internal/boring/index.js"
import "@goscript/crypto/internal/boring/bbig/index.js"
import "@goscript/crypto/internal/fips140/ecdsa/index.js"
import "@goscript/crypto/internal/fips140/nistec/index.js"
import "@goscript/crypto/internal/fips140cache/index.js"
import "@goscript/crypto/internal/fips140hash/index.js"
import "@goscript/crypto/internal/fips140only/index.js"
import "@goscript/crypto/internal/rand/index.js"
import "@goscript/crypto/sha512/index.js"
import "@goscript/crypto/subtle/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/math/big/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/asn1/index.js"
import "@goscript/hash/index.js"
import "./ecdsa_legacy.gs.ts"
import "./notboring.gs.ts"

export class PublicKey {
	public get Curve(): elliptic.Curve | null {
		return this._fields.Curve.value
	}
	public set Curve(value: elliptic.Curve | null) {
		this._fields.Curve.value = value
	}

	// X, Y are the coordinates of the public key point.
	//
	// Deprecated: modifying the raw coordinates can produce invalid keys, and may
	// invalidate internal optimizations; moreover, [big.Int] methods are not
	// suitable for operating on cryptographic values. To encode and decode
	// PublicKey values, use [PublicKey.Bytes] and [ParseUncompressedPublicKey]
	// or [crypto/x509.MarshalPKIXPublicKey] and [crypto/x509.ParsePKIXPublicKey].
	// For ECDH, use [crypto/ecdh]. For lower-level elliptic curve operations,
	// use a third-party module like filippo.io/nistec.
	public get X(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.X.value
	}
	public set X(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.X.value = value
	}

	// X, Y are the coordinates of the public key point.
	//
	// Deprecated: modifying the raw coordinates can produce invalid keys, and may
	// invalidate internal optimizations; moreover, [big.Int] methods are not
	// suitable for operating on cryptographic values. To encode and decode
	// PublicKey values, use [PublicKey.Bytes] and [ParseUncompressedPublicKey]
	// or [crypto/x509.MarshalPKIXPublicKey] and [crypto/x509.ParsePKIXPublicKey].
	// For ECDH, use [crypto/ecdh]. For lower-level elliptic curve operations,
	// use a third-party module like filippo.io/nistec.
	public get Y(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Y.value
	}
	public set Y(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Y.value = value
	}

	public _fields: {
		Curve: $.VarRef<elliptic.Curve | null>
		X: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Y: $.VarRef<big.Int | $.VarRef<big.Int> | null>
	}

	constructor(init?: Partial<{Curve?: elliptic.Curve | null, X?: big.Int | $.VarRef<big.Int> | null, Y?: big.Int | $.VarRef<big.Int> | null}>) {
		this._fields = {
			Curve: $.varRef(init?.Curve ?? (null as elliptic.Curve | null)),
			X: $.varRef(init?.X ?? (null as big.Int | $.VarRef<big.Int> | null)),
			Y: $.varRef(init?.Y ?? (null as big.Int | $.VarRef<big.Int> | null))
		}
	}

	public clone(): PublicKey {
		const cloned = new PublicKey()
		cloned._fields = {
			Curve: $.varRef(this._fields.Curve.value),
			X: $.varRef(this._fields.X.value),
			Y: $.varRef(this._fields.Y.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Bytes(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const pub: PublicKey | $.VarRef<PublicKey> | null = this
		{
			let __goscriptSwitch0 = $.pointerValue<PublicKey>(pub).Curve
			switch (true) {
				case $.comparableEqual(__goscriptSwitch0, await elliptic.P224()):
				{
					return publicKeyBytes({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P224(), pub)
					break
				}
				case $.comparableEqual(__goscriptSwitch0, await elliptic.P256()):
				{
					return publicKeyBytes({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), AddAffine: (receiver: any, ...args: any[]) => receiver.AddAffine(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), Negate: (receiver: any, ...args: any[]) => receiver.Negate(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P256(), pub)
					break
				}
				case $.comparableEqual(__goscriptSwitch0, await elliptic.P384()):
				{
					return publicKeyBytes({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P384Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P384(), pub)
					break
				}
				case $.comparableEqual(__goscriptSwitch0, await elliptic.P521()):
				{
					return publicKeyBytes({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P521(), pub)
					break
				}
				default:
				{
					return [null, errors.New("ecdsa: curve not supported by PublicKey.Bytes")]
					break
				}
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async ECDH(): globalThis.Promise<[ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null, $.GoError]> {
		const pub: PublicKey | $.VarRef<PublicKey> | null = this
		let c = await curveToECDH($.pointerValue<PublicKey>(pub).Curve)
		if (c == null) {
			return [null, errors.New("ecdsa: unsupported curve by crypto/ecdh")]
		}
		let __goscriptTuple0: any = await PublicKey.prototype.Bytes.call(pub)
		let k: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}
		return $.pointerValue<Exclude<ecdh.Curve, null>>(c).NewPublicKey(k)
	}

	public Equal(x: crypto.PublicKey | null): boolean {
		const pub: PublicKey | $.VarRef<PublicKey> | null = this
		let __goscriptTuple1: any = $.typeAssertTuple<PublicKey | $.VarRef<PublicKey> | null>(x, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" })
		let xx: PublicKey | $.VarRef<PublicKey> | null = __goscriptTuple1[0]
		let ok = __goscriptTuple1[1]
		if (!ok) {
			return false
		}
		return (bigIntEqual($.pointerValue<PublicKey>(pub).X, $.pointerValue<PublicKey>(xx).X) && bigIntEqual($.pointerValue<PublicKey>(pub).Y, $.pointerValue<PublicKey>(xx).Y)) && ($.comparableEqual($.pointerValue<PublicKey>(pub).Curve, $.pointerValue<PublicKey>(xx).Curve))
	}

	public async Add(x1: any, y1: any, x2: any, y2: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<elliptic.Curve | null, null>>(this.Curve).Add(x1, y1, x2, y2)
	}

	public async Double(x1: any, y1: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<elliptic.Curve | null, null>>(this.Curve).Double(x1, y1)
	}

	public async IsOnCurve(x: any, y: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<elliptic.Curve | null, null>>(this.Curve).IsOnCurve(x, y)
	}

	public async Params(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<elliptic.Curve | null, null>>(this.Curve).Params()
	}

	public async ScalarBaseMult(k: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<elliptic.Curve | null, null>>(this.Curve).ScalarBaseMult(k)
	}

	public async ScalarMult(x1: any, y1: any, k: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<elliptic.Curve | null, null>>(this.Curve).ScalarMult(x1, y1, k)
	}

	static __typeInfo = $.registerStructType(
		"ecdsa.PublicKey",
		() => new PublicKey(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ECDH", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "ecdh.PublicKey" } }, { name: "_r1", type: "error" }] }, { name: "Equal", args: [{ name: "x", type: "crypto.PublicKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Add", args: [{ name: "x1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "x2", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y2", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Double", args: [{ name: "x1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "IsOnCurve", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Params", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "elliptic.CurveParams" } }] }, { name: "ScalarBaseMult", args: [{ name: "k", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "ScalarMult", args: [{ name: "x1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "k", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }],
		PublicKey,
		[{ name: "Curve", key: "Curve", type: "elliptic.Curve", anonymous: true, index: [0], offset: 0, exported: true }, { name: "X", key: "X", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [1], offset: 16, exported: true }, { name: "Y", key: "Y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [2], offset: 24, exported: true }]
	)
}

export class PrivateKey {
	public get PublicKey(): PublicKey {
		return this._fields.PublicKey.value
	}
	public set PublicKey(value: PublicKey) {
		this._fields.PublicKey.value = value
	}

	// D is the private scalar value.
	//
	// Deprecated: modifying the raw value can produce invalid keys, and may
	// invalidate internal optimizations; moreover, [big.Int] methods are not
	// suitable for operating on cryptographic values. To encode and decode
	// PrivateKey values, use [PrivateKey.Bytes] and [ParseRawPrivateKey] or
	// [crypto/x509.MarshalPKCS8PrivateKey] and [crypto/x509.ParsePKCS8PrivateKey].
	// For ECDH, use [crypto/ecdh].
	public get D(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.D.value
	}
	public set D(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.D.value = value
	}

	public _fields: {
		PublicKey: $.VarRef<PublicKey>
		D: $.VarRef<big.Int | $.VarRef<big.Int> | null>
	}

	constructor(init?: Partial<{PublicKey?: PublicKey, D?: big.Int | $.VarRef<big.Int> | null}>) {
		this._fields = {
			PublicKey: $.varRef(init?.PublicKey ? $.markAsStructValue($.cloneStructValue(init.PublicKey)) : $.markAsStructValue(new PublicKey())),
			D: $.varRef(init?.D ?? (null as big.Int | $.VarRef<big.Int> | null))
		}
	}

	public clone(): PrivateKey {
		const cloned = new PrivateKey()
		cloned._fields = {
			PublicKey: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.PublicKey.value))),
			D: $.varRef(this._fields.D.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Bytes(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		{
			let __goscriptSwitch2 = $.pointerValue<PrivateKey>(priv).PublicKey.Curve
			switch (true) {
				case $.comparableEqual(__goscriptSwitch2, await elliptic.P224()):
				{
					return privateKeyBytes({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P224(), priv)
					break
				}
				case $.comparableEqual(__goscriptSwitch2, await elliptic.P256()):
				{
					return privateKeyBytes({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), AddAffine: (receiver: any, ...args: any[]) => receiver.AddAffine(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), Negate: (receiver: any, ...args: any[]) => receiver.Negate(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P256(), priv)
					break
				}
				case $.comparableEqual(__goscriptSwitch2, await elliptic.P384()):
				{
					return privateKeyBytes({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P384Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P384(), priv)
					break
				}
				case $.comparableEqual(__goscriptSwitch2, await elliptic.P521()):
				{
					return privateKeyBytes({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P521(), priv)
					break
				}
				default:
				{
					return [null, errors.New("ecdsa: curve not supported by PrivateKey.Bytes")]
					break
				}
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async ECDH(): globalThis.Promise<[ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null, $.GoError]> {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		let c = await curveToECDH($.pointerValue<PrivateKey>(priv).PublicKey.Curve)
		if (c == null) {
			return [null, errors.New("ecdsa: unsupported curve by crypto/ecdh")]
		}
		let __goscriptTuple4: any = await PrivateKey.prototype.Bytes.call(priv)
		let k: $.Slice<number> = __goscriptTuple4[0]
		let err = __goscriptTuple4[1]
		if (err != null) {
			return [null, err]
		}
		return $.pointerValue<Exclude<ecdh.Curve, null>>(c).NewPrivateKey(k)
	}

	public Equal(x: crypto.PrivateKey | null): boolean {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		let __goscriptTuple5: any = $.typeAssertTuple<PrivateKey | $.VarRef<PrivateKey> | null>(x, { kind: $.TypeKind.Pointer, elemType: "ecdsa.PrivateKey" })
		let xx: PrivateKey | $.VarRef<PrivateKey> | null = __goscriptTuple5[0]
		let ok = __goscriptTuple5[1]
		if (!ok) {
			return false
		}
		return $.pointerValue<PrivateKey>(priv).PublicKey.Equal($.interfaceValue<crypto.PublicKey | null>($.pointerValue<PrivateKey>(xx)._fields.PublicKey, "*ecdsa.PublicKey", { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" })) && bigIntEqual($.pointerValue<PrivateKey>(priv).D, $.pointerValue<PrivateKey>(xx).D)
	}

	public Public(): crypto.PublicKey | null {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		return $.interfaceValue<crypto.PublicKey | null>($.pointerValue<PrivateKey>(priv)._fields.PublicKey, "*ecdsa.PublicKey", { kind: $.TypeKind.Pointer, elemType: "ecdsa.PublicKey" })
	}

	public async Sign(random: io.Reader | null, digest: $.Slice<number>, opts: crypto.SignerOpts | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const priv: PrivateKey | $.VarRef<PrivateKey> | null = this
		if (random == null) {
			return signRFC6979(priv, digest, opts)
		}
		random = await rand2.CustomReader(random)
		return SignASN1(random, priv, digest)
	}

	public async Add(x1: any, y1: any, x2: any, y2: any): globalThis.Promise<any> {
		return await $.pointerValue<any>($.pointerValue<PublicKey>(this.PublicKey).Curve).Add(x1, y1, x2, y2)
	}

	public async Double(x1: any, y1: any): globalThis.Promise<any> {
		return await $.pointerValue<any>($.pointerValue<PublicKey>(this.PublicKey).Curve).Double(x1, y1)
	}

	public async IsOnCurve(x: any, y: any): globalThis.Promise<any> {
		return await $.pointerValue<any>($.pointerValue<PublicKey>(this.PublicKey).Curve).IsOnCurve(x, y)
	}

	public async Params(): globalThis.Promise<any> {
		return await $.pointerValue<any>($.pointerValue<PublicKey>(this.PublicKey).Curve).Params()
	}

	public async ScalarBaseMult(k: any): globalThis.Promise<any> {
		return await $.pointerValue<any>($.pointerValue<PublicKey>(this.PublicKey).Curve).ScalarBaseMult(k)
	}

	public async ScalarMult(x1: any, y1: any, k: any): globalThis.Promise<any> {
		return await $.pointerValue<any>($.pointerValue<PublicKey>(this.PublicKey).Curve).ScalarMult(x1, y1, k)
	}

	static __typeInfo = $.registerStructType(
		"ecdsa.PrivateKey",
		() => new PrivateKey(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ECDH", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "ecdh.PrivateKey" } }, { name: "_r1", type: "error" }] }, { name: "Equal", args: [{ name: "x", type: "crypto.PrivateKey" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Public", args: [], returns: [{ name: "_r0", type: "crypto.PublicKey" }] }, { name: "Sign", args: [{ name: "random", type: "io.Reader" }, { name: "digest", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "opts", type: "crypto.SignerOpts" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Add", args: [{ name: "x1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "x2", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y2", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "Double", args: [{ name: "x1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "IsOnCurve", args: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Params", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "elliptic.CurveParams" } }] }, { name: "ScalarBaseMult", args: [{ name: "k", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }, { name: "ScalarMult", args: [{ name: "x1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y1", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "k", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "x", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }, { name: "y", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }] }],
		PrivateKey,
		[{ name: "PublicKey", key: "PublicKey", type: "ecdsa.PublicKey", anonymous: true, index: [0], offset: 0, exported: true }, { name: "D", key: "D", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [1], offset: 32, exported: true }]
	)
}

export async function ParseUncompressedPublicKey(curve: elliptic.Curve | null, data: $.Slice<number>): globalThis.Promise<[PublicKey | $.VarRef<PublicKey> | null, $.GoError]> {
	if (($.len(data) < 1) || ($.uint($.arrayIndex(data!, 0), 8) != $.uint(4, 8))) {
		return [null, errors.New("ecdsa: invalid uncompressed public key")]
	}
	{
		let __goscriptSwitch1 = curve
		switch (true) {
			case $.comparableEqual(__goscriptSwitch1, await elliptic.P224()):
			{
				return parseUncompressedPublicKey({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P224(), curve, data)
				break
			}
			case $.comparableEqual(__goscriptSwitch1, await elliptic.P256()):
			{
				return parseUncompressedPublicKey({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), AddAffine: (receiver: any, ...args: any[]) => receiver.AddAffine(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), Negate: (receiver: any, ...args: any[]) => receiver.Negate(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P256(), curve, data)
				break
			}
			case $.comparableEqual(__goscriptSwitch1, await elliptic.P384()):
			{
				return parseUncompressedPublicKey({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P384Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P384(), curve, data)
				break
			}
			case $.comparableEqual(__goscriptSwitch1, await elliptic.P521()):
			{
				return parseUncompressedPublicKey({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P521(), curve, data)
				break
			}
			default:
			{
				return [null, errors.New("ecdsa: curve not supported by ParseUncompressedPublicKey")]
				break
			}
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function parseUncompressedPublicKey(__typeArgs: $.GenericTypeArgs | undefined, c: ecdsa.Curve | $.VarRef<ecdsa.Curve> | null, curve: elliptic.Curve | null, data: $.Slice<number>): globalThis.Promise<[PublicKey | $.VarRef<PublicKey> | null, $.GoError]> {
	let __goscriptTuple2: any = await ecdsa.NewPublicKey({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, data)
	let k: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = __goscriptTuple2[0]
	let err = __goscriptTuple2[1]
	if (err != null) {
		return [null, err]
	}
	return publicKeyFromFIPS(curve, k)
}

export async function publicKeyBytes(__typeArgs: $.GenericTypeArgs | undefined, c: ecdsa.Curve | $.VarRef<ecdsa.Curve> | null, pub: PublicKey | $.VarRef<PublicKey> | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let __goscriptTuple3: any = await publicKeyToFIPS({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, pub)
	let k: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = __goscriptTuple3[0]
	let err = __goscriptTuple3[1]
	if (err != null) {
		return [null, err]
	}
	return [ecdsa.PublicKey.prototype.Bytes.call(k), null]
}

export async function curveToECDH(c: elliptic.Curve | null): globalThis.Promise<ecdh.Curve | null> {
	{
		let __goscriptSwitch3 = c
		switch (true) {
			case $.comparableEqual(__goscriptSwitch3, await elliptic.P256()):
			{
				return ecdh.P256()
				break
			}
			case $.comparableEqual(__goscriptSwitch3, await elliptic.P384()):
			{
				return ecdh.P384()
				break
			}
			case $.comparableEqual(__goscriptSwitch3, await elliptic.P521()):
			{
				return ecdh.P521()
				break
			}
			default:
			{
				return null
				break
			}
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function bigIntEqual(a: big.Int | $.VarRef<big.Int> | null, b: big.Int | $.VarRef<big.Int> | null): boolean {
	return subtle.ConstantTimeCompare(big.Int.prototype.Bytes.call(a), big.Int.prototype.Bytes.call(b)) == 1
}

export async function ParseRawPrivateKey(curve: elliptic.Curve | null, data: $.Slice<number>): globalThis.Promise<[PrivateKey | $.VarRef<PrivateKey> | null, $.GoError]> {
	{
		let __goscriptSwitch4 = curve
		switch (true) {
			case $.comparableEqual(__goscriptSwitch4, await elliptic.P224()):
			{
				return parseRawPrivateKey({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P224(), nistec.NewP224Point, curve, data)
				break
			}
			case $.comparableEqual(__goscriptSwitch4, await elliptic.P256()):
			{
				return parseRawPrivateKey({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), AddAffine: (receiver: any, ...args: any[]) => receiver.AddAffine(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), Negate: (receiver: any, ...args: any[]) => receiver.Negate(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P256(), nistec.NewP256Point, curve, data)
				break
			}
			case $.comparableEqual(__goscriptSwitch4, await elliptic.P384()):
			{
				return parseRawPrivateKey({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P384Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P384(), nistec.NewP384Point, curve, data)
				break
			}
			case $.comparableEqual(__goscriptSwitch4, await elliptic.P521()):
			{
				return parseRawPrivateKey({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P521(), nistec.NewP521Point, curve, data)
				break
			}
			default:
			{
				return [null, errors.New("ecdsa: curve not supported by ParseRawPrivateKey")]
				break
			}
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function parseRawPrivateKey(__typeArgs: $.GenericTypeArgs | undefined, c: ecdsa.Curve | $.VarRef<ecdsa.Curve> | null, newPoint: (() => any | globalThis.Promise<any>) | null, curve: elliptic.Curve | null, data: $.Slice<number>): globalThis.Promise<[PrivateKey | $.VarRef<PrivateKey> | null, $.GoError]> {
	let __goscriptTuple6: any = await $.callGenericMethod(__typeArgs, "P", "ScalarBaseMult", await newPoint!(), data)
	let q = (__goscriptTuple6[0] as any)
	let err = __goscriptTuple6[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple7: any = await ecdsa.NewPrivateKey({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, data, await $.callGenericMethod(__typeArgs, "P", "Bytes", q))
	let k: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null = __goscriptTuple7[0]
	err = __goscriptTuple7[1]
	if (err != null) {
		return [null, err]
	}
	return privateKeyFromFIPS(curve, k)
}

export async function privateKeyBytes(__typeArgs: $.GenericTypeArgs | undefined, c: ecdsa.Curve | $.VarRef<ecdsa.Curve> | null, priv: PrivateKey | $.VarRef<PrivateKey> | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let __goscriptTuple8: any = await privateKeyToFIPS({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, priv)
	let k: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null = __goscriptTuple8[0]
	let err = __goscriptTuple8[1]
	if (err != null) {
		return [null, err]
	}
	return [ecdsa.PrivateKey.prototype.Bytes.call(k), null]
}

export async function GenerateKey(c: elliptic.Curve | null, r: io.Reader | null): globalThis.Promise<[PrivateKey | $.VarRef<PrivateKey> | null, $.GoError]> {
	if (boring.Enabled && rand2.IsDefaultReader(r)) {
		let __goscriptTuple9: any = boring.GenerateKeyECDSA($.pointerValue<elliptic.CurveParams>(await $.pointerValue<Exclude<elliptic.Curve, null>>(c).Params()).Name)
		let x: boring.BigInt = (__goscriptTuple9[0] as boring.BigInt)
		let y: boring.BigInt = (__goscriptTuple9[1] as boring.BigInt)
		let d: boring.BigInt = (__goscriptTuple9[2] as boring.BigInt)
		let err = __goscriptTuple9[3]
		if (err != null) {
			return [null, err]
		}
		return [(() => { const __goscriptLiteralField2 = bbig.Dec((d as boring.BigInt)); return new PrivateKey({PublicKey: (() => { const __goscriptLiteralField0 = bbig.Dec((x as boring.BigInt)); const __goscriptLiteralField1 = bbig.Dec((y as boring.BigInt)); return $.markAsStructValue(new PublicKey({Curve: c, X: __goscriptLiteralField0, Y: __goscriptLiteralField1})) })(), D: __goscriptLiteralField2}) })(), null]
	}
	boring.UnreachableExceptTests()

	r = await rand2.CustomReader(r)

	switch (await $.pointerValue<Exclude<elliptic.Curve, null>>(c).Params()) {
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P224())).Params():
		{
			return generateFIPS({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, c, await ecdsa.P224(), r)
			break
		}
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P256())).Params():
		{
			return generateFIPS({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), AddAffine: (receiver: any, ...args: any[]) => receiver.AddAffine(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), Negate: (receiver: any, ...args: any[]) => receiver.Negate(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args))} }}, c, await ecdsa.P256(), r)
			break
		}
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P384())).Params():
		{
			return generateFIPS({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P384Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, c, await ecdsa.P384(), r)
			break
		}
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P521())).Params():
		{
			return generateFIPS({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, c, await ecdsa.P521(), r)
			break
		}
		default:
		{
			return __goscript_ecdsa_legacy.generateLegacy(c, r)
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function generateFIPS(__typeArgs: $.GenericTypeArgs | undefined, curve: elliptic.Curve | null, c: ecdsa.Curve | $.VarRef<ecdsa.Curve> | null, rand: io.Reader | null): globalThis.Promise<[PrivateKey | $.VarRef<PrivateKey> | null, $.GoError]> {
	if (fips140only.Enforced() && !fips140only.ApprovedRandomReader(rand)) {
		return [null, errors.New("crypto/ecdsa: only crypto/rand.Reader is allowed in FIPS 140-only mode")]
	}
	let __goscriptTuple10: any = await ecdsa.GenerateKey({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, rand)
	let privateKey: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null = __goscriptTuple10[0]
	let err = __goscriptTuple10[1]
	if (err != null) {
		return [null, err]
	}
	return privateKeyFromFIPS(curve, privateKey)
}

export async function SignASN1(r: io.Reader | null, priv: PrivateKey | $.VarRef<PrivateKey> | null, hash: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	if (boring.Enabled && rand2.IsDefaultReader(r)) {
		let __goscriptTuple11: any = __goscript_notboring.boringPrivateKey(priv)
		let b: boring.PrivateKeyECDSA | $.VarRef<boring.PrivateKeyECDSA> | null = __goscriptTuple11[0]
		let err = __goscriptTuple11[1]
		if (err != null) {
			return [null, err]
		}
		return boring.SignMarshalECDSA(b, hash)
	}
	boring.UnreachableExceptTests()

	r = await rand2.CustomReader(r)

	switch (await $.pointerValue<Exclude<elliptic.Curve, null>>($.pointerValue<PrivateKey>(priv).PublicKey.Curve).Params()) {
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P224())).Params():
		{
			return signFIPS({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P224(), priv, r, hash)
			break
		}
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P256())).Params():
		{
			return signFIPS({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), AddAffine: (receiver: any, ...args: any[]) => receiver.AddAffine(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), Negate: (receiver: any, ...args: any[]) => receiver.Negate(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P256(), priv, r, hash)
			break
		}
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P384())).Params():
		{
			return signFIPS({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P384Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P384(), priv, r, hash)
			break
		}
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P521())).Params():
		{
			return signFIPS({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P521(), priv, r, hash)
			break
		}
		default:
		{
			return __goscript_ecdsa_legacy.signLegacy(priv, r, hash)
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function signFIPS(__typeArgs: $.GenericTypeArgs | undefined, c: ecdsa.Curve | $.VarRef<ecdsa.Curve> | null, priv: PrivateKey | $.VarRef<PrivateKey> | null, rand: io.Reader | null, hash: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	if (fips140only.Enforced() && !fips140only.ApprovedRandomReader(rand)) {
		return [null, errors.New("crypto/ecdsa: only crypto/rand.Reader is allowed in FIPS 140-only mode")]
	}
	let __goscriptTuple12: any = await privateKeyToFIPS({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, priv)
	let k: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null = __goscriptTuple12[0]
	let err = __goscriptTuple12[1]
	if (err != null) {
		return [null, err]
	}
	// Always using SHA-512 instead of the hash that computed hash is
	// technically a violation of draft-irtf-cfrg-det-sigs-with-noise-04 but in
	// our API we don't get to know what it was, and this has no security impact.
	let __goscriptTuple13: any = await ecdsa.Sign({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, sha512.New, k, rand, hash)
	let sig: ecdsa.Signature | $.VarRef<ecdsa.Signature> | null = __goscriptTuple13[0]
	err = __goscriptTuple13[1]
	if (err != null) {
		return [null, err]
	}
	return encodeSignature($.pointerValue<ecdsa.Signature>(sig).R, $.pointerValue<ecdsa.Signature>(sig).S)
}

export async function signRFC6979(priv: PrivateKey | $.VarRef<PrivateKey> | null, hash: $.Slice<number>, opts: crypto.SignerOpts | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	if (opts == null) {
		return [null, errors.New("ecdsa: Sign called with nil opts")]
	}
	let h = await $.pointerValue<Exclude<crypto.SignerOpts, null>>(opts).HashFunc()
	if (crypto.Hash_Size(h) != $.len(hash)) {
		return [null, errors.New("ecdsa: hash length does not match hash function")]
	}
	switch (await $.pointerValue<Exclude<elliptic.Curve, null>>($.pointerValue<PrivateKey>(priv).PublicKey.Curve).Params()) {
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P224())).Params():
		{
			return signFIPSDeterministic({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P224(), h, priv, hash)
			break
		}
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P256())).Params():
		{
			return signFIPSDeterministic({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), AddAffine: (receiver: any, ...args: any[]) => receiver.AddAffine(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), Negate: (receiver: any, ...args: any[]) => receiver.Negate(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P256(), h, priv, hash)
			break
		}
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P384())).Params():
		{
			return signFIPSDeterministic({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P384Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P384(), h, priv, hash)
			break
		}
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P521())).Params():
		{
			return signFIPSDeterministic({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P521(), h, priv, hash)
			break
		}
		default:
		{
			return [null, errors.New("ecdsa: curve not supported by deterministic signatures")]
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function signFIPSDeterministic(__typeArgs: $.GenericTypeArgs | undefined, c: ecdsa.Curve | $.VarRef<ecdsa.Curve> | null, hashFunc: crypto.Hash, priv: PrivateKey | $.VarRef<PrivateKey> | null, hash: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let __goscriptTuple14: any = await privateKeyToFIPS({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, priv)
	let k: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null = __goscriptTuple14[0]
	let err = __goscriptTuple14[1]
	if (err != null) {
		return [null, err]
	}
	let h: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null = await fips140hash.UnwrapNew(undefined, $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))(hashFunc), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)))
	if (fips140only.Enforced() && !fips140only.ApprovedHash(await h!())) {
		return [null, errors.New("crypto/ecdsa: use of hash functions other than SHA-2 or SHA-3 is not allowed in FIPS 140-only mode")]
	}
	let __goscriptTuple15: any = await ecdsa.SignDeterministic({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, h, k, hash)
	let sig: ecdsa.Signature | $.VarRef<ecdsa.Signature> | null = __goscriptTuple15[0]
	err = __goscriptTuple15[1]
	if (err != null) {
		return [null, err]
	}
	return encodeSignature($.pointerValue<ecdsa.Signature>(sig).R, $.pointerValue<ecdsa.Signature>(sig).S)
}

export async function encodeSignature(r: $.Slice<number>, s: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let b: $.VarRef<cryptobyte.Builder> = $.varRef($.markAsStructValue(new cryptobyte.Builder()))
	await b.value.AddASN1($.uint(asn1.SEQUENCE, 8), $.functionValue(async (b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): globalThis.Promise<void> => {
		await addASN1IntBytes(b, r)
		await addASN1IntBytes(b, s)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
	return b.value.Bytes()
}

export async function addASN1IntBytes(b: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null, bytes: $.Slice<number>): globalThis.Promise<void> {
	while (($.len(bytes) > 0) && ($.uint($.arrayIndex(bytes!, 0), 8) == $.uint(0, 8))) {
		bytes = $.goSlice(bytes, 1, undefined)
	}
	if ($.len(bytes) == 0) {
		cryptobyte.Builder.prototype.SetError.call(b, errors.New("invalid integer"))
		return
	}
	await cryptobyte.Builder.prototype.AddASN1.call(b, $.uint(asn1.INTEGER, 8), $.functionValue((c: cryptobyte.Builder | $.VarRef<cryptobyte.Builder> | null): void => {
		if ($.uint(($.arrayIndex(bytes!, 0) & 0x80), 8) != $.uint(0, 8)) {
			cryptobyte.Builder.prototype.AddUint8.call(c, $.uint(0, 8))
		}
		cryptobyte.Builder.prototype.AddBytes.call(c, bytes)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "cryptobyte.Builder" }], results: [] } as $.FunctionTypeInfo)))
}

export async function VerifyASN1(pub: PublicKey | $.VarRef<PublicKey> | null, hash: $.Slice<number>, sig: $.Slice<number>): globalThis.Promise<boolean> {
	if (boring.Enabled) {
		let __goscriptTuple16: any = __goscript_notboring.boringPublicKey(pub)
		let key: boring.PublicKeyECDSA | $.VarRef<boring.PublicKeyECDSA> | null = __goscriptTuple16[0]
		let err = __goscriptTuple16[1]
		if (err != null) {
			return false
		}
		return boring.VerifyECDSA(key, hash, sig)
	}
	boring.UnreachableExceptTests()

	switch (await $.pointerValue<Exclude<elliptic.Curve, null>>($.pointerValue<PublicKey>(pub).Curve).Params()) {
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P224())).Params():
		{
			return verifyFIPS({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P224Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P224(), pub, hash, sig)
			break
		}
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P256())).Params():
		{
			return verifyFIPS({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P256Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), AddAffine: (receiver: any, ...args: any[]) => receiver.AddAffine(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), Negate: (receiver: any, ...args: any[]) => receiver.Negate(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P256(), pub, hash, sig)
			break
		}
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P384())).Params():
		{
			return verifyFIPS({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P384Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P384(), pub, hash, sig)
			break
		}
		case await $.pointerValue<Exclude<elliptic.Curve, null>>((await elliptic.P521())).Params():
		{
			return verifyFIPS({[$.genericTypeArgsMarker]: true, P: { type: { kind: $.TypeKind.Pointer, elemType: "nistec.P521Point" }, zero: () => null, methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), BytesCompressed: (receiver: any, ...args: any[]) => receiver.BytesCompressed(...$.stripGenericTypeArgs(args)), BytesX: (receiver: any, ...args: any[]) => receiver.BytesX(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args)), Select: (receiver: any, ...args: any[]) => receiver.Select(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetGenerator: (receiver: any, ...args: any[]) => receiver.SetGenerator(...$.stripGenericTypeArgs(args)), bytes: (receiver: any, ...args: any[]) => receiver.bytes(...$.stripGenericTypeArgs(args)), bytesCompressed: (receiver: any, ...args: any[]) => receiver.bytesCompressed(...$.stripGenericTypeArgs(args)), bytesX: (receiver: any, ...args: any[]) => receiver.bytesX(...$.stripGenericTypeArgs(args)), generatorTable: (receiver: any, ...args: any[]) => receiver.generatorTable(...$.stripGenericTypeArgs(args))} }}, await ecdsa.P521(), pub, hash, sig)
			break
		}
		default:
		{
			return __goscript_ecdsa_legacy.verifyLegacy(pub, hash, sig)
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function verifyFIPS(__typeArgs: $.GenericTypeArgs | undefined, c: ecdsa.Curve | $.VarRef<ecdsa.Curve> | null, pub: PublicKey | $.VarRef<PublicKey> | null, hash: $.Slice<number>, sig: $.Slice<number>): globalThis.Promise<boolean> {
	let __goscriptTuple17: any = parseSignature(sig)
	let r: $.Slice<number> = __goscriptTuple17[0]
	let s: $.Slice<number> = __goscriptTuple17[1]
	let err = __goscriptTuple17[2]
	if (err != null) {
		return false
	}
	let __goscriptTuple18: any = await publicKeyToFIPS({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, pub)
	let k: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null = __goscriptTuple18[0]
	err = __goscriptTuple18[1]
	if (err != null) {
		return false
	}
	{
		let __goscriptShadow0 = await ecdsa.Verify({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, k, hash, new ecdsa.Signature({R: r, S: s}))
		if (__goscriptShadow0 != null) {
			return false
		}
	}
	return true
}

export function parseSignature(sig: $.Slice<number>): [$.Slice<number>, $.Slice<number>, $.GoError] {
	let r: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
	let s: $.VarRef<$.Slice<number>> = $.varRef(null as $.Slice<number>)
	let err: $.GoError = null as $.GoError
	let inner: $.VarRef<cryptobyte.String> = $.varRef(null as cryptobyte.String)
	let input: $.VarRef<cryptobyte.String> = $.varRef(((sig as cryptobyte.String) as cryptobyte.String))
	if ((((!cryptobyte.String_ReadASN1(input, inner, $.uint(asn1.SEQUENCE, 8)) || !cryptobyte.String_Empty(input.value)) || !cryptobyte.String_ReadASN1Integer(inner, $.interfaceValue<any>(r, "*[]byte", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }))) || !cryptobyte.String_ReadASN1Integer(inner, $.interfaceValue<any>(s, "*[]byte", { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }))) || !cryptobyte.String_Empty(inner.value)) {
		return [null, null, errors.New("invalid ASN.1")]
	}
	return [r.value, s.value, null]
}

export async function publicKeyFromFIPS(curve: elliptic.Curve | null, pub: ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null): globalThis.Promise<[PublicKey | $.VarRef<PublicKey> | null, $.GoError]> {
	let __goscriptTuple19: any = await pointToAffine(curve, ecdsa.PublicKey.prototype.Bytes.call(pub))
	let x: big.Int | $.VarRef<big.Int> | null = __goscriptTuple19[0]
	let y: big.Int | $.VarRef<big.Int> | null = __goscriptTuple19[1]
	let err = __goscriptTuple19[2]
	if (err != null) {
		return [null, err]
	}
	return [new PublicKey({Curve: curve, X: x, Y: y}), null]
}

export async function privateKeyFromFIPS(curve: elliptic.Curve | null, priv: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null): globalThis.Promise<[PrivateKey | $.VarRef<PrivateKey> | null, $.GoError]> {
	let __goscriptTuple20: any = await publicKeyFromFIPS(curve, ecdsa.PrivateKey.prototype.PublicKey.call(priv))
	let pub: PublicKey | $.VarRef<PublicKey> | null = __goscriptTuple20[0]
	let err = __goscriptTuple20[1]
	if (err != null) {
		return [null, err]
	}
	return [(() => { const __goscriptLiteralField3 = big.Int.prototype.SetBytes.call(new big.Int(), ecdsa.PrivateKey.prototype.Bytes.call(priv)); return new PrivateKey({PublicKey: $.markAsStructValue($.cloneStructValue($.pointerValue<PublicKey>(pub))), D: __goscriptLiteralField3}) })(), null]
}

export async function publicKeyToFIPS(__typeArgs: $.GenericTypeArgs | undefined, c: ecdsa.Curve | $.VarRef<ecdsa.Curve> | null, pub: PublicKey | $.VarRef<PublicKey> | null): globalThis.Promise<[ecdsa.PublicKey | $.VarRef<ecdsa.PublicKey> | null, $.GoError]> {
	let __goscriptTuple21: any = await pointFromAffine($.pointerValue<PublicKey>(pub).Curve, $.pointerValue<PublicKey>(pub).X, $.pointerValue<PublicKey>(pub).Y)
	let Q: $.Slice<number> = __goscriptTuple21[0]
	let err = __goscriptTuple21[1]
	if (err != null) {
		return [null, err]
	}
	return ecdsa.NewPublicKey({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, Q)
}

export let privateKeyCache: $.VarRef<fips140cache.Cache> = $.varRef($.markAsStructValue(new fips140cache.Cache()))

export function __goscript_set_privateKeyCache(__goscriptValue: fips140cache.Cache): void {
	privateKeyCache.value = __goscriptValue
}

export async function privateKeyToFIPS(__typeArgs: $.GenericTypeArgs | undefined, c: ecdsa.Curve | $.VarRef<ecdsa.Curve> | null, priv: PrivateKey | $.VarRef<PrivateKey> | null): globalThis.Promise<[ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null, $.GoError]> {
	let __goscriptTuple22: any = await pointFromAffine($.pointerValue<PrivateKey>(priv).PublicKey.Curve, $.pointerValue<PrivateKey>(priv).PublicKey.X, $.pointerValue<PrivateKey>(priv).PublicKey.Y)
	let Q: $.Slice<number> = __goscriptTuple22[0]
	let err = __goscriptTuple22[1]
	if (err != null) {
		return [null, err]
	}

	// Reject values that would not get correctly encoded.
	if (big.Int.prototype.BitLen.call($.pointerValue<PrivateKey>(priv).D) > big.Int.prototype.BitLen.call($.pointerValue<elliptic.CurveParams>(await $.pointerValue<Exclude<elliptic.Curve, null>>($.pointerValue<PrivateKey>(priv).PublicKey.Curve).Params()).N)) {
		return [null, errors.New("ecdsa: private key scalar too large")]
	}
	if (big.Int.prototype.Sign.call($.pointerValue<PrivateKey>(priv).D) <= 0) {
		return [null, errors.New("ecdsa: private key scalar is zero or negative")]
	}

	let size = Math.trunc((big.Int.prototype.BitLen.call($.pointerValue<elliptic.CurveParams>(await $.pointerValue<Exclude<elliptic.Curve, null>>($.pointerValue<PrivateKey>(priv).PublicKey.Curve).Params()).N) + 7) / 8)
	const maxScalarSize: number = 66
	if (size > 66) {
		return [null, errors.New("ecdsa: internal error: curve size too large")]
	}
	let D: $.Slice<number> = big.Int.prototype.FillBytes.call($.pointerValue<PrivateKey>(priv).D, $.makeSlice<number>(size, 66, "byte"))

	const __goscriptReturn43 = await privateKeyCache.value.Get({[$.genericTypeArgsMarker]: true, K: { type: "ecdsa.PrivateKey", zero: () => $.markAsStructValue(new PrivateKey()), methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), Double: (receiver: any, ...args: any[]) => receiver.Double(...$.stripGenericTypeArgs(args)), IsOnCurve: (receiver: any, ...args: any[]) => receiver.IsOnCurve(...$.stripGenericTypeArgs(args)), Params: (receiver: any, ...args: any[]) => receiver.Params(...$.stripGenericTypeArgs(args)), ScalarBaseMult: (receiver: any, ...args: any[]) => receiver.ScalarBaseMult(...$.stripGenericTypeArgs(args)), ScalarMult: (receiver: any, ...args: any[]) => receiver.ScalarMult(...$.stripGenericTypeArgs(args))} }, V: { type: "ecdsa.PrivateKey", zero: () => $.markAsStructValue(new ecdsa.PrivateKey()) }}, priv, $.functionValue(async (): globalThis.Promise<[ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null, $.GoError]> => {
		return await ecdsa.NewPrivateKey({[$.genericTypeArgsMarker]: true, P: __typeArgs?.["P"] ?? { type: { kind: $.TypeKind.Interface, methods: [{ name: "Add", args: [{ name: "p1", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "p2", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "BytesX", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "ScalarBaseMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "ScalarMult", args: [{ name: "_p0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_p1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }, { name: "SetBytes", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_r1", type: "error" }] }] }, zero: () => null }}, c, D, Q)
	}, ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "ecdsa.PrivateKey" }, "error"] } as $.FunctionTypeInfo)), $.functionValue((k: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null): boolean => {
		return (subtle.ConstantTimeCompare(ecdsa.PublicKey.prototype.Bytes.call(ecdsa.PrivateKey.prototype.PublicKey.call(k)), Q) == 1) && (subtle.ConstantTimeCompare(ecdsa.PrivateKey.prototype.Bytes.call(k), D) == 1)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "ecdsa.PrivateKey" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo)))
	return [(__goscriptReturn43[0] as ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null), __goscriptReturn43[1]]
	throw new globalThis.Error("goscript: unreachable return")
}

export async function pointFromAffine(curve: elliptic.Curve | null, x: big.Int | $.VarRef<big.Int> | null, y: big.Int | $.VarRef<big.Int> | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let bitSize = $.pointerValue<elliptic.CurveParams>(await $.pointerValue<Exclude<elliptic.Curve, null>>(curve).Params()).BitSize
	// Reject values that would not get correctly encoded.
	if ((big.Int.prototype.Sign.call(x) < 0) || (big.Int.prototype.Sign.call(y) < 0)) {
		return [null, errors.New("negative coordinate")]
	}
	if ((big.Int.prototype.BitLen.call(x) > bitSize) || (big.Int.prototype.BitLen.call(y) > bitSize)) {
		return [null, errors.New("overflowing coordinate")]
	}
	// Encode the coordinates and let [ecdsa.NewPublicKey] reject invalid points.
	let byteLen = Math.trunc((bitSize + 7) / 8)
	let buf: $.Slice<number> = $.makeSlice<number>(1 + (2 * byteLen), undefined, "byte")
	buf![0] = $.uint(4, 8)
	big.Int.prototype.FillBytes.call(x, $.goSlice(buf, 1, 1 + byteLen))
	big.Int.prototype.FillBytes.call(y, $.goSlice(buf, 1 + byteLen, 1 + (2 * byteLen)))
	return [buf, null]
}

export async function pointToAffine(curve: elliptic.Curve | null, p: $.Slice<number>): globalThis.Promise<[big.Int | $.VarRef<big.Int> | null, big.Int | $.VarRef<big.Int> | null, $.GoError]> {
	let x: big.Int | $.VarRef<big.Int> | null = null as big.Int | $.VarRef<big.Int> | null
	let y: big.Int | $.VarRef<big.Int> | null = null as big.Int | $.VarRef<big.Int> | null
	let err: $.GoError = null as $.GoError
	if (($.len(p) == 1) && ($.uint($.arrayIndex(p!, 0), 8) == $.uint(0, 8))) {
		// This is the encoding of the point at infinity.
		return [null, null, errors.New("ecdsa: public key point is the infinity")]
	}
	let byteLen = Math.trunc(($.pointerValue<elliptic.CurveParams>(await $.pointerValue<Exclude<elliptic.Curve, null>>(curve).Params()).BitSize + 7) / 8)
	x = big.Int.prototype.SetBytes.call(new big.Int(), $.goSlice(p, 1, 1 + byteLen))
	y = big.Int.prototype.SetBytes.call(new big.Int(), $.goSlice(p, 1 + byteLen, undefined))
	return [x, y, null]
}

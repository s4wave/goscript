// Generated file based on key_schedule.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ecdh2 from "@goscript/crypto/ecdh/index.js"

import * as fips140 from "@goscript/crypto/fips140/index.js"

import * as hmac from "@goscript/crypto/hmac/index.js"

import * as tls13 from "@goscript/crypto/internal/fips140/tls13/index.js"

import * as mlkem2 from "@goscript/crypto/mlkem/index.js"

import * as errors from "@goscript/errors/index.js"

import * as hash from "@goscript/hash/index.js"

import * as io from "@goscript/io/index.js"

import type * as cipher from "@goscript/crypto/cipher/index.js"

import * as __goscript_cipher_suites from "./cipher_suites.gs.ts"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/fips140/index.js"
import "@goscript/crypto/hmac/index.js"
import "@goscript/crypto/internal/fips140/tls13/index.js"
import "@goscript/crypto/mlkem/index.js"
import "@goscript/errors/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"
import "./cipher_suites.gs.ts"
import "./common.gs.ts"
import "./common_string.gs.ts"

export type keyExchange = {
	clientSharedSecret(priv: keySharePrivateKeys | $.VarRef<keySharePrivateKeys> | null, serverKeyShare: $.Slice<number>): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	keyShares(rand: io.Reader | null): [keySharePrivateKeys | $.VarRef<keySharePrivateKeys> | null, $.Slice<__goscript_common.keyShare>, $.GoError] | globalThis.Promise<[keySharePrivateKeys | $.VarRef<keySharePrivateKeys> | null, $.Slice<__goscript_common.keyShare>, $.GoError]>
	serverSharedSecret(rand: io.Reader | null, clientKeyShare: $.Slice<number>): [$.Slice<number>, __goscript_common.keyShare, $.GoError] | globalThis.Promise<[$.Slice<number>, __goscript_common.keyShare, $.GoError]>
}

$.registerInterfaceType(
	"tls.keyExchange",
	null,
	[{ name: "clientSharedSecret", args: [{ name: "priv", type: { kind: $.TypeKind.Pointer, elemType: "tls.keySharePrivateKeys" } }, { name: "serverKeyShare", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "keyShares", args: [{ name: "rand", type: "io.Reader" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.keySharePrivateKeys" } }, { name: "_r1", type: { kind: $.TypeKind.Slice, elemType: "tls.keyShare" } }, { name: "_r2", type: "error" }] }, { name: "serverSharedSecret", args: [{ name: "rand", type: "io.Reader" }, { name: "clientKeyShare", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "tls.keyShare" }, { name: "_r2", type: "error" }] }]
);

export class keySharePrivateKeys {
	public get ecdhe(): ecdh2.PrivateKey | $.VarRef<ecdh2.PrivateKey> | null {
		return this._fields.ecdhe.value
	}
	public set ecdhe(value: ecdh2.PrivateKey | $.VarRef<ecdh2.PrivateKey> | null) {
		this._fields.ecdhe.value = value
	}

	public get mlkem(): crypto.Decapsulator | null {
		return this._fields.mlkem.value
	}
	public set mlkem(value: crypto.Decapsulator | null) {
		this._fields.mlkem.value = value
	}

	public _fields: {
		ecdhe: $.VarRef<ecdh2.PrivateKey | $.VarRef<ecdh2.PrivateKey> | null>
		mlkem: $.VarRef<crypto.Decapsulator | null>
	}

	constructor(init?: Partial<{ecdhe?: ecdh2.PrivateKey | $.VarRef<ecdh2.PrivateKey> | null, mlkem?: crypto.Decapsulator | null}>) {
		this._fields = {
			ecdhe: $.varRef(init?.ecdhe ?? (null as ecdh2.PrivateKey | $.VarRef<ecdh2.PrivateKey> | null)),
			mlkem: $.varRef(init?.mlkem ?? (null as crypto.Decapsulator | null))
		}
	}

	public clone(): keySharePrivateKeys {
		const cloned = new keySharePrivateKeys()
		cloned._fields = {
			ecdhe: $.varRef(this._fields.ecdhe.value),
			mlkem: $.varRef(this._fields.mlkem.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.keySharePrivateKeys",
		() => new keySharePrivateKeys(),
		[],
		keySharePrivateKeys,
		[{ name: "ecdhe", key: "ecdhe", type: { kind: $.TypeKind.Pointer, elemType: "ecdh.PrivateKey" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "mlkem", key: "mlkem", type: "crypto.Decapsulator", pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }]
	)
}

export class ecdhKeyExchange {
	public get id(): __goscript_common.CurveID {
		return this._fields.id.value
	}
	public set id(value: __goscript_common.CurveID) {
		this._fields.id.value = value
	}

	public get curve(): ecdh2.Curve | null {
		return this._fields.curve.value
	}
	public set curve(value: ecdh2.Curve | null) {
		this._fields.curve.value = value
	}

	public _fields: {
		id: $.VarRef<__goscript_common.CurveID>
		curve: $.VarRef<ecdh2.Curve | null>
	}

	constructor(init?: Partial<{id?: __goscript_common.CurveID, curve?: ecdh2.Curve | null}>) {
		this._fields = {
			id: $.varRef(init?.id ?? (0 as __goscript_common.CurveID)),
			curve: $.varRef(init?.curve ?? (null as ecdh2.Curve | null))
		}
	}

	public clone(): ecdhKeyExchange {
		const cloned = new ecdhKeyExchange()
		cloned._fields = {
			id: $.varRef(this._fields.id.value),
			curve: $.varRef(this._fields.curve.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async clientSharedSecret(priv: keySharePrivateKeys | $.VarRef<keySharePrivateKeys> | null, serverKeyShare: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const ke: ecdhKeyExchange | $.VarRef<ecdhKeyExchange> | null = this
		let __goscriptTuple0: any = await $.pointerValue<Exclude<ecdh2.Curve, null>>($.pointerValue<ecdhKeyExchange>(ke).curve).NewPublicKey(serverKeyShare)
		let peerKey: ecdh2.PublicKey | $.VarRef<ecdh2.PublicKey> | null = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}
		let __goscriptTuple1: any = ecdh2.PrivateKey.prototype.ECDH.call($.pointerValue<ecdh2.PrivateKey>($.pointerValue<keySharePrivateKeys>(priv).ecdhe), peerKey)
		let sharedKey: $.Slice<number> = __goscriptTuple1[0]
		err = __goscriptTuple1[1]
		if (err != null) {
			return [null, err]
		}
		return [sharedKey, null]
	}

	public async keyShares(rand: io.Reader | null): globalThis.Promise<[keySharePrivateKeys | $.VarRef<keySharePrivateKeys> | null, $.Slice<__goscript_common.keyShare>, $.GoError]> {
		const ke: ecdhKeyExchange | $.VarRef<ecdhKeyExchange> | null = this
		let __goscriptTuple2: any = await $.pointerValue<Exclude<ecdh2.Curve, null>>($.pointerValue<ecdhKeyExchange>(ke).curve).GenerateKey($.pointerValueOrNil(rand)!)
		let priv: ecdh2.PrivateKey | $.VarRef<ecdh2.PrivateKey> | null = __goscriptTuple2[0]
		let err = __goscriptTuple2[1]
		if (err != null) {
			return [null, null, err]
		}
		return [new keySharePrivateKeys({ecdhe: priv}), $.arrayToSlice<__goscript_common.keyShare>([(() => { const __goscriptLiteralField7 = ecdh2.PublicKey.prototype.Bytes.call($.pointerValue<ecdh2.PublicKey>(ecdh2.PrivateKey.prototype.PublicKey.call($.pointerValue<ecdh2.PrivateKey>(priv)))); return $.markAsStructValue(new __goscript_common.keyShare({group: $.uint($.pointerValue<ecdhKeyExchange>(ke).id, 16), data: __goscriptLiteralField7})) })()]), null]
	}

	public async serverSharedSecret(rand: io.Reader | null, clientKeyShare: $.Slice<number>): globalThis.Promise<[$.Slice<number>, __goscript_common.keyShare, $.GoError]> {
		const ke: ecdhKeyExchange | $.VarRef<ecdhKeyExchange> | null = this
		let __goscriptTuple3: any = await $.pointerValue<Exclude<ecdh2.Curve, null>>($.pointerValue<ecdhKeyExchange>(ke).curve).GenerateKey($.pointerValueOrNil(rand)!)
		let key: ecdh2.PrivateKey | $.VarRef<ecdh2.PrivateKey> | null = __goscriptTuple3[0]
		let err = __goscriptTuple3[1]
		if (err != null) {
			return [null, $.markAsStructValue(new __goscript_common.keyShare()), err]
		}
		let __goscriptTuple4: any = await $.pointerValue<Exclude<ecdh2.Curve, null>>($.pointerValue<ecdhKeyExchange>(ke).curve).NewPublicKey(clientKeyShare)
		let peerKey: ecdh2.PublicKey | $.VarRef<ecdh2.PublicKey> | null = __goscriptTuple4[0]
		err = __goscriptTuple4[1]
		if (err != null) {
			return [null, $.markAsStructValue(new __goscript_common.keyShare()), err]
		}
		let __goscriptTuple5: any = ecdh2.PrivateKey.prototype.ECDH.call($.pointerValue<ecdh2.PrivateKey>(key), peerKey)
		let sharedKey: $.Slice<number> = __goscriptTuple5[0]
		err = __goscriptTuple5[1]
		if (err != null) {
			return [null, $.markAsStructValue(new __goscript_common.keyShare()), err]
		}
		return [sharedKey, (() => { const __goscriptLiteralField8 = ecdh2.PublicKey.prototype.Bytes.call($.pointerValue<ecdh2.PublicKey>(ecdh2.PrivateKey.prototype.PublicKey.call($.pointerValue<ecdh2.PrivateKey>(key)))); return $.markAsStructValue(new __goscript_common.keyShare({group: $.uint($.pointerValue<ecdhKeyExchange>(ke).id, 16), data: __goscriptLiteralField8})) })(), null]
	}

	static __typeInfo = $.registerStructType(
		"tls.ecdhKeyExchange",
		() => new ecdhKeyExchange(),
		[{ name: "clientSharedSecret", args: [{ name: "priv", type: { kind: $.TypeKind.Pointer, elemType: "tls.keySharePrivateKeys" } }, { name: "serverKeyShare", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "keyShares", args: [{ name: "rand", type: "io.Reader" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.keySharePrivateKeys" } }, { name: "_r1", type: { kind: $.TypeKind.Slice, elemType: "tls.keyShare" } }, { name: "_r2", type: "error" }] }, { name: "serverSharedSecret", args: [{ name: "rand", type: "io.Reader" }, { name: "clientKeyShare", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "tls.keyShare" }, { name: "_r2", type: "error" }] }],
		ecdhKeyExchange,
		[{ name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "curve", key: "curve", type: "ecdh.Curve", pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }]
	)
}

export class hybridKeyExchange {
	public get id(): __goscript_common.CurveID {
		return this._fields.id.value
	}
	public set id(value: __goscript_common.CurveID) {
		this._fields.id.value = value
	}

	public get ecdh(): ecdhKeyExchange {
		return this._fields.ecdh.value
	}
	public set ecdh(value: ecdhKeyExchange) {
		this._fields.ecdh.value = value
	}

	public get ecdhElementSize(): number {
		return this._fields.ecdhElementSize.value
	}
	public set ecdhElementSize(value: number) {
		this._fields.ecdhElementSize.value = value
	}

	public get mlkemPublicKeySize(): number {
		return this._fields.mlkemPublicKeySize.value
	}
	public set mlkemPublicKeySize(value: number) {
		this._fields.mlkemPublicKeySize.value = value
	}

	public get mlkemCiphertextSize(): number {
		return this._fields.mlkemCiphertextSize.value
	}
	public set mlkemCiphertextSize(value: number) {
		this._fields.mlkemCiphertextSize.value = value
	}

	public get newMLKEMPrivateKey(): ((_p0: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null {
		return this._fields.newMLKEMPrivateKey.value
	}
	public set newMLKEMPrivateKey(value: ((_p0: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null) {
		this._fields.newMLKEMPrivateKey.value = value
	}

	public get newMLKEMPublicKey(): ((_p0: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null {
		return this._fields.newMLKEMPublicKey.value
	}
	public set newMLKEMPublicKey(value: ((_p0: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null) {
		this._fields.newMLKEMPublicKey.value = value
	}

	public _fields: {
		id: $.VarRef<__goscript_common.CurveID>
		ecdh: $.VarRef<ecdhKeyExchange>
		ecdhElementSize: $.VarRef<number>
		mlkemPublicKeySize: $.VarRef<number>
		mlkemCiphertextSize: $.VarRef<number>
		newMLKEMPrivateKey: $.VarRef<((_p0: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null>
		newMLKEMPublicKey: $.VarRef<((_p0: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null>
	}

	constructor(init?: Partial<{id?: __goscript_common.CurveID, ecdh?: ecdhKeyExchange, ecdhElementSize?: number, mlkemPublicKeySize?: number, mlkemCiphertextSize?: number, newMLKEMPrivateKey?: ((_p0: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null, newMLKEMPublicKey?: ((_p0: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null}>) {
		this._fields = {
			id: $.varRef(init?.id ?? (0 as __goscript_common.CurveID)),
			ecdh: $.varRef(init?.ecdh ? $.markAsStructValue($.cloneStructValue(init.ecdh)) : $.markAsStructValue(new ecdhKeyExchange())),
			ecdhElementSize: $.varRef(init?.ecdhElementSize ?? (0 as number)),
			mlkemPublicKeySize: $.varRef(init?.mlkemPublicKeySize ?? (0 as number)),
			mlkemCiphertextSize: $.varRef(init?.mlkemCiphertextSize ?? (0 as number)),
			newMLKEMPrivateKey: $.varRef(init?.newMLKEMPrivateKey ?? (null as ((_p0: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null)),
			newMLKEMPublicKey: $.varRef(init?.newMLKEMPublicKey ?? (null as ((_p0: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null))
		}
	}

	public clone(): hybridKeyExchange {
		const cloned = new hybridKeyExchange()
		cloned._fields = {
			id: $.varRef(this._fields.id.value),
			ecdh: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.ecdh.value))),
			ecdhElementSize: $.varRef(this._fields.ecdhElementSize.value),
			mlkemPublicKeySize: $.varRef(this._fields.mlkemPublicKeySize.value),
			mlkemCiphertextSize: $.varRef(this._fields.mlkemCiphertextSize.value),
			newMLKEMPrivateKey: $.varRef(this._fields.newMLKEMPrivateKey.value),
			newMLKEMPublicKey: $.varRef(this._fields.newMLKEMPublicKey.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async clientSharedSecret(priv: keySharePrivateKeys | $.VarRef<keySharePrivateKeys> | null, serverKeyShare: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const ke: hybridKeyExchange | $.VarRef<hybridKeyExchange> | null = this
		if ($.len(serverKeyShare) != ($.pointerValue<hybridKeyExchange>(ke).ecdhElementSize + $.pointerValue<hybridKeyExchange>(ke).mlkemCiphertextSize)) {
			return [null, errors.New("tls: invalid server key share length for hybrid key exchange")]
		}
		let ecdhShareData: $.Slice<number> = null as $.Slice<number>
		let mlkemShareData: $.Slice<number> = null as $.Slice<number>
		if ($.uint($.pointerValue<hybridKeyExchange>(ke).id, 16) == $.uint(4588, 16)) {
			mlkemShareData = $.goSlice(serverKeyShare, undefined, $.pointerValue<hybridKeyExchange>(ke).mlkemCiphertextSize)
			ecdhShareData = $.goSlice(serverKeyShare, $.pointerValue<hybridKeyExchange>(ke).mlkemCiphertextSize, undefined)
		} else {
			ecdhShareData = $.goSlice(serverKeyShare, undefined, $.pointerValue<hybridKeyExchange>(ke).ecdhElementSize)
			mlkemShareData = $.goSlice(serverKeyShare, $.pointerValue<hybridKeyExchange>(ke).ecdhElementSize, undefined)
		}
		let ecdhSharedSecret: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		await fips140.WithoutEnforcement($.functionValue(async (): globalThis.Promise<void> => {
			let __goscriptTuple6: any = await $.pointerValue<hybridKeyExchange>(ke).ecdh.clientSharedSecret(priv, ecdhShareData)
			ecdhSharedSecret = __goscriptTuple6[0]
			err = __goscriptTuple6[1]
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		if (err != null) {
			return [null, err]
		}
		let __goscriptTuple7: any = await $.pointerValue<Exclude<crypto.Decapsulator, null>>($.pointerValue<keySharePrivateKeys>(priv).mlkem).Decapsulate(mlkemShareData)
		let mlkemSharedSecret: $.Slice<number> = __goscriptTuple7[0]
		err = __goscriptTuple7[1]
		if (err != null) {
			return [null, err]
		}
		let sharedKey: $.Slice<number> = null as $.Slice<number>
		if ($.uint($.pointerValue<hybridKeyExchange>(ke).id, 16) == $.uint(4588, 16)) {
			sharedKey = $.appendSlice(mlkemSharedSecret, ecdhSharedSecret, $.byteSliceHint)
		} else {
			sharedKey = $.appendSlice(ecdhSharedSecret, mlkemSharedSecret, $.byteSliceHint)
		}
		return [sharedKey, null]
	}

	public async keyShares(rand: io.Reader | null): globalThis.Promise<[keySharePrivateKeys | $.VarRef<keySharePrivateKeys> | null, $.Slice<__goscript_common.keyShare>, $.GoError]> {
		const ke: hybridKeyExchange | $.VarRef<hybridKeyExchange> | null = this
		let priv: keySharePrivateKeys | $.VarRef<keySharePrivateKeys> | null = null as keySharePrivateKeys | $.VarRef<keySharePrivateKeys> | null
		let ecdhShares: $.Slice<__goscript_common.keyShare> = null as $.Slice<__goscript_common.keyShare>
		let err: $.GoError = null as $.GoError
		await fips140.WithoutEnforcement($.functionValue(async (): globalThis.Promise<void> => {
			let __goscriptTuple8: any = await $.pointerValue<hybridKeyExchange>(ke).ecdh.keyShares(rand)
			priv = __goscriptTuple8[0]
			ecdhShares = __goscriptTuple8[1]
			err = __goscriptTuple8[2]
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		if (err != null) {
			return [null, null, err]
		}
		let seed: $.Slice<number> = $.makeSlice<number>(mlkem2.SeedSize, undefined, "byte")
		{
			let [, __goscriptShadow0] = await io.ReadFull($.pointerValueOrNil(rand)!, seed)
			if (__goscriptShadow0 != null) {
				return [null, null, __goscriptShadow0]
			}
		}
		let __goscriptTuple9: any = await $.pointerValue<hybridKeyExchange>(ke).newMLKEMPrivateKey!(seed)
		$.pointerValue<keySharePrivateKeys>(priv).mlkem = __goscriptTuple9[0]
		err = __goscriptTuple9[1]
		if (err != null) {
			return [null, null, err]
		}
		let shareData: $.Slice<number> = null as $.Slice<number>
		// For X25519MLKEM768, the ML-KEM-768 encapsulation key comes first.
		// For SecP256r1MLKEM768 and SecP384r1MLKEM1024, the ECDH share comes first.
		// See draft-ietf-tls-ecdhe-mlkem-02, Section 4.1.
		if ($.uint($.pointerValue<hybridKeyExchange>(ke).id, 16) == $.uint(4588, 16)) {
			shareData = $.appendSlice(await $.pointerValue<Exclude<crypto.Encapsulator, null>>((await $.pointerValue<Exclude<crypto.Decapsulator, null>>($.pointerValue<keySharePrivateKeys>(priv).mlkem).Encapsulator())).Bytes(), $.arrayIndex(ecdhShares!, 0).data, $.byteSliceHint)
		} else {
			shareData = $.appendSlice($.arrayIndex(ecdhShares!, 0).data, await $.pointerValue<Exclude<crypto.Encapsulator, null>>((await $.pointerValue<Exclude<crypto.Decapsulator, null>>($.pointerValue<keySharePrivateKeys>(priv).mlkem).Encapsulator())).Bytes(), $.byteSliceHint)
		}
		return [priv, $.arrayToSlice<__goscript_common.keyShare>([$.markAsStructValue(new __goscript_common.keyShare({group: $.uint($.pointerValue<hybridKeyExchange>(ke).id, 16), data: shareData})), $.markAsStructValue($.cloneStructValue($.arrayIndex(ecdhShares!, 0)))]), null]
	}

	public async serverSharedSecret(rand: io.Reader | null, clientKeyShare: $.Slice<number>): globalThis.Promise<[$.Slice<number>, __goscript_common.keyShare, $.GoError]> {
		const ke: hybridKeyExchange | $.VarRef<hybridKeyExchange> | null = this
		if ($.len(clientKeyShare) != ($.pointerValue<hybridKeyExchange>(ke).ecdhElementSize + $.pointerValue<hybridKeyExchange>(ke).mlkemPublicKeySize)) {
			return [null, $.markAsStructValue(new __goscript_common.keyShare()), errors.New("tls: invalid client key share length for hybrid key exchange")]
		}
		let ecdhShareData: $.Slice<number> = null as $.Slice<number>
		let mlkemShareData: $.Slice<number> = null as $.Slice<number>
		if ($.uint($.pointerValue<hybridKeyExchange>(ke).id, 16) == $.uint(4588, 16)) {
			mlkemShareData = $.goSlice(clientKeyShare, undefined, $.pointerValue<hybridKeyExchange>(ke).mlkemPublicKeySize)
			ecdhShareData = $.goSlice(clientKeyShare, $.pointerValue<hybridKeyExchange>(ke).mlkemPublicKeySize, undefined)
		} else {
			ecdhShareData = $.goSlice(clientKeyShare, undefined, $.pointerValue<hybridKeyExchange>(ke).ecdhElementSize)
			mlkemShareData = $.goSlice(clientKeyShare, $.pointerValue<hybridKeyExchange>(ke).ecdhElementSize, undefined)
		}
		let ecdhSharedSecret: $.Slice<number> = null as $.Slice<number>
		let ks: __goscript_common.keyShare = $.markAsStructValue(new __goscript_common.keyShare())
		let err: $.GoError = null as $.GoError
		await fips140.WithoutEnforcement($.functionValue(async (): globalThis.Promise<void> => {
			let __goscriptTuple10: any = await $.pointerValue<hybridKeyExchange>(ke).ecdh.serverSharedSecret(rand, ecdhShareData)
			ecdhSharedSecret = __goscriptTuple10[0]
			ks = __goscriptTuple10[1]
			err = __goscriptTuple10[2]
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		if (err != null) {
			return [null, $.markAsStructValue(new __goscript_common.keyShare()), err]
		}
		let __goscriptTuple11: any = await $.pointerValue<hybridKeyExchange>(ke).newMLKEMPublicKey!(mlkemShareData)
		let mlkemPeerKey = __goscriptTuple11[0]
		err = __goscriptTuple11[1]
		if (err != null) {
			return [null, $.markAsStructValue(new __goscript_common.keyShare()), err]
		}
		let __goscriptTuple12: any = await $.pointerValue<Exclude<crypto.Encapsulator, null>>(mlkemPeerKey).Encapsulate()
		let mlkemSharedSecret: $.Slice<number> = __goscriptTuple12[0]
		let mlkemKeyShare: $.Slice<number> = __goscriptTuple12[1]
		let sharedKey: $.Slice<number> = null as $.Slice<number>
		if ($.uint($.pointerValue<hybridKeyExchange>(ke).id, 16) == $.uint(4588, 16)) {
			sharedKey = $.appendSlice(mlkemSharedSecret, ecdhSharedSecret, $.byteSliceHint)
			ks.data = $.appendSlice(mlkemKeyShare, ks.data, $.byteSliceHint)
		} else {
			sharedKey = $.appendSlice(ecdhSharedSecret, mlkemSharedSecret, $.byteSliceHint)
			ks.data = $.appendSlice(ks.data, mlkemKeyShare, $.byteSliceHint)
		}
		ks.group = $.uint($.pointerValue<hybridKeyExchange>(ke).id, 16)
		return [sharedKey, $.markAsStructValue($.cloneStructValue(ks)), null]
	}

	static __typeInfo = $.registerStructType(
		"tls.hybridKeyExchange",
		() => new hybridKeyExchange(),
		[{ name: "clientSharedSecret", args: [{ name: "priv", type: { kind: $.TypeKind.Pointer, elemType: "tls.keySharePrivateKeys" } }, { name: "serverKeyShare", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "keyShares", args: [{ name: "rand", type: "io.Reader" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "tls.keySharePrivateKeys" } }, { name: "_r1", type: { kind: $.TypeKind.Slice, elemType: "tls.keyShare" } }, { name: "_r2", type: "error" }] }, { name: "serverSharedSecret", args: [{ name: "rand", type: "io.Reader" }, { name: "clientKeyShare", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "tls.keyShare" }, { name: "_r2", type: "error" }] }],
		hybridKeyExchange,
		[{ name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint16", typeName: "tls.CurveID" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "ecdh", key: "ecdh", type: "tls.ecdhKeyExchange", pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }, { name: "ecdhElementSize", key: "ecdhElementSize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/tls", index: [2], offset: 32, exported: false }, { name: "mlkemPublicKeySize", key: "mlkemPublicKeySize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/tls", index: [3], offset: 40, exported: false }, { name: "mlkemCiphertextSize", key: "mlkemCiphertextSize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/tls", index: [4], offset: 48, exported: false }, { name: "newMLKEMPrivateKey", key: "newMLKEMPrivateKey", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/tls", index: [5], offset: 56, exported: false }, { name: "newMLKEMPublicKey", key: "newMLKEMPublicKey", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Encapsulator", "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/tls", index: [6], offset: 64, exported: false }]
	)
}

export function keyExchangeForCurveID(id: __goscript_common.CurveID): [keyExchange | null, $.GoError] {
	let newMLKEMPrivateKey768: ((b: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null = $.functionValue((b: $.Slice<number>): [crypto.Decapsulator | null, $.GoError] => {
		const __goscriptReturn0 = mlkem2.NewDecapsulationKey768(b)
		return [$.interfaceValue<crypto.Decapsulator | null>(__goscriptReturn0[0], "*mlkem.DecapsulationKey768", { kind: $.TypeKind.Pointer, elemType: "mlkem.DecapsulationKey768" }), __goscriptReturn0[1]]
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo))
	let newMLKEMPrivateKey1024: ((b: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null = $.functionValue((b: $.Slice<number>): [crypto.Decapsulator | null, $.GoError] => {
		const __goscriptReturn1 = mlkem2.NewDecapsulationKey1024(b)
		return [$.interfaceValue<crypto.Decapsulator | null>(__goscriptReturn1[0], "*mlkem.DecapsulationKey1024", { kind: $.TypeKind.Pointer, elemType: "mlkem.DecapsulationKey1024" }), __goscriptReturn1[1]]
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo))
	let newMLKEMPublicKey768: ((b: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null = $.functionValue((b: $.Slice<number>): [crypto.Encapsulator | null, $.GoError] => {
		const __goscriptReturn2 = mlkem2.NewEncapsulationKey768(b)
		return [$.interfaceValue<crypto.Encapsulator | null>(__goscriptReturn2[0], "*mlkem.EncapsulationKey768", { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey768" }), __goscriptReturn2[1]]
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Encapsulator", "error"] } as $.FunctionTypeInfo))
	let newMLKEMPublicKey1024: ((b: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null = $.functionValue((b: $.Slice<number>): [crypto.Encapsulator | null, $.GoError] => {
		const __goscriptReturn3 = mlkem2.NewEncapsulationKey1024(b)
		return [$.interfaceValue<crypto.Encapsulator | null>(__goscriptReturn3[0], "*mlkem.EncapsulationKey1024", { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey1024" }), __goscriptReturn3[1]]
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Encapsulator", "error"] } as $.FunctionTypeInfo))
	switch (id) {
		case 29:
		{
			return [$.interfaceValue<keyExchange | null>((() => { const __goscriptLiteralField0 = ecdh2.X25519(); return new ecdhKeyExchange({id: $.uint(id, 16), curve: __goscriptLiteralField0}) })(), "*tls.ecdhKeyExchange", { kind: $.TypeKind.Pointer, elemType: "tls.ecdhKeyExchange" }), null]
			break
		}
		case 23:
		{
			return [$.interfaceValue<keyExchange | null>((() => { const __goscriptLiteralField1 = ecdh2.P256(); return new ecdhKeyExchange({id: $.uint(id, 16), curve: __goscriptLiteralField1}) })(), "*tls.ecdhKeyExchange", { kind: $.TypeKind.Pointer, elemType: "tls.ecdhKeyExchange" }), null]
			break
		}
		case 24:
		{
			return [$.interfaceValue<keyExchange | null>((() => { const __goscriptLiteralField2 = ecdh2.P384(); return new ecdhKeyExchange({id: $.uint(id, 16), curve: __goscriptLiteralField2}) })(), "*tls.ecdhKeyExchange", { kind: $.TypeKind.Pointer, elemType: "tls.ecdhKeyExchange" }), null]
			break
		}
		case 25:
		{
			return [$.interfaceValue<keyExchange | null>((() => { const __goscriptLiteralField3 = ecdh2.P521(); return new ecdhKeyExchange({id: $.uint(id, 16), curve: __goscriptLiteralField3}) })(), "*tls.ecdhKeyExchange", { kind: $.TypeKind.Pointer, elemType: "tls.ecdhKeyExchange" }), null]
			break
		}
		case 4588:
		{
			return [$.interfaceValue<keyExchange | null>(new hybridKeyExchange({id: $.uint(id, 16), ecdh: (() => { const __goscriptLiteralField4 = ecdh2.X25519(); return $.markAsStructValue(new ecdhKeyExchange({id: $.uint(29, 16), curve: __goscriptLiteralField4})) })(), ecdhElementSize: 32, mlkemPublicKeySize: mlkem2.EncapsulationKeySize768, mlkemCiphertextSize: mlkem2.CiphertextSize768, newMLKEMPrivateKey: newMLKEMPrivateKey768, newMLKEMPublicKey: newMLKEMPublicKey768}), "*tls.hybridKeyExchange", { kind: $.TypeKind.Pointer, elemType: "tls.hybridKeyExchange" }), null]
			break
		}
		case 4587:
		{
			return [$.interfaceValue<keyExchange | null>(new hybridKeyExchange({id: $.uint(id, 16), ecdh: (() => { const __goscriptLiteralField5 = ecdh2.P256(); return $.markAsStructValue(new ecdhKeyExchange({id: $.uint(23, 16), curve: __goscriptLiteralField5})) })(), ecdhElementSize: 65, mlkemPublicKeySize: mlkem2.EncapsulationKeySize768, mlkemCiphertextSize: mlkem2.CiphertextSize768, newMLKEMPrivateKey: newMLKEMPrivateKey768, newMLKEMPublicKey: newMLKEMPublicKey768}), "*tls.hybridKeyExchange", { kind: $.TypeKind.Pointer, elemType: "tls.hybridKeyExchange" }), null]
			break
		}
		case 4589:
		{
			return [$.interfaceValue<keyExchange | null>(new hybridKeyExchange({id: $.uint(id, 16), ecdh: (() => { const __goscriptLiteralField6 = ecdh2.P384(); return $.markAsStructValue(new ecdhKeyExchange({id: $.uint(24, 16), curve: __goscriptLiteralField6})) })(), ecdhElementSize: 97, mlkemPublicKeySize: mlkem2.EncapsulationKeySize1024, mlkemCiphertextSize: mlkem2.CiphertextSize1024, newMLKEMPrivateKey: newMLKEMPrivateKey1024, newMLKEMPublicKey: newMLKEMPublicKey1024}), "*tls.hybridKeyExchange", { kind: $.TypeKind.Pointer, elemType: "tls.hybridKeyExchange" }), null]
			break
		}
		default:
		{
			return [null, errors.New("tls: unsupported key exchange")]
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

// Generated file based on kem.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as rand from "@goscript/crypto/internal/rand/index.js"

import * as errors from "@goscript/errors/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as slices from "@goscript/slices/index.js"

import * as io from "@goscript/io/index.js"

import * as __goscript_kdf from "./kdf.gs.ts"

import * as __goscript_pq from "./pq.gs.ts"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/internal/rand/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/byteorder/index.js"
import "@goscript/slices/index.js"
import "@goscript/io/index.js"
import "./kdf.gs.ts"
import "./pq.gs.ts"

export type KEM = {
	DeriveKeyPair(ikm: $.Slice<number>): [PrivateKey | null, $.GoError] | globalThis.Promise<[PrivateKey | null, $.GoError]>
	GenerateKey(): [PrivateKey | null, $.GoError] | globalThis.Promise<[PrivateKey | null, $.GoError]>
	ID(): number
	NewPrivateKey(_p0: $.Slice<number>): [PrivateKey | null, $.GoError] | globalThis.Promise<[PrivateKey | null, $.GoError]>
	NewPublicKey(_p0: $.Slice<number>): [PublicKey | null, $.GoError] | globalThis.Promise<[PublicKey | null, $.GoError]>
	encSize(): number
}

$.registerInterfaceType(
	"hpke.KEM",
	null,
	[{ name: "DeriveKeyPair", args: [{ name: "ikm", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "GenerateKey", args: [], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "ID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "NewPrivateKey", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "NewPublicKey", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PublicKey" }, { name: "_r1", type: "error" }] }, { name: "encSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export type PublicKey = {
	Bytes(): $.Slice<number> | globalThis.Promise<$.Slice<number>>
	KEM(): KEM | null
	encap(): [$.Slice<number>, $.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.Slice<number>, $.GoError]>
}

$.registerInterfaceType(
	"hpke.PublicKey",
	null,
	[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "KEM", args: [], returns: [{ name: "_r0", type: "hpke.KEM" }] }, { name: "encap", args: [], returns: [{ name: "sharedSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "enc", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }]
);

export type PrivateKey = {
	Bytes(): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	KEM(): KEM | null
	PublicKey(): PublicKey | null | globalThis.Promise<PublicKey | null>
	decap(enc: $.Slice<number>): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
}

$.registerInterfaceType(
	"hpke.PrivateKey",
	null,
	[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "KEM", args: [], returns: [{ name: "_r0", type: "hpke.KEM" }] }, { name: "PublicKey", args: [], returns: [{ name: "_r0", type: "hpke.PublicKey" }] }, { name: "decap", args: [{ name: "enc", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "sharedSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }]
);

export class dhKEM {
	public get kdf(): __goscript_kdf.KDF | null {
		return this._fields.kdf.value
	}
	public set kdf(value: __goscript_kdf.KDF | null) {
		this._fields.kdf.value = value
	}

	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	public get curve(): ecdh.Curve | null {
		return this._fields.curve.value
	}
	public set curve(value: ecdh.Curve | null) {
		this._fields.curve.value = value
	}

	public get Nsecret(): number {
		return this._fields.Nsecret.value
	}
	public set Nsecret(value: number) {
		this._fields.Nsecret.value = value
	}

	public get Nsk(): number {
		return this._fields.Nsk.value
	}
	public set Nsk(value: number) {
		this._fields.Nsk.value = value
	}

	public get Nenc(): number {
		return this._fields.Nenc.value
	}
	public set Nenc(value: number) {
		this._fields.Nenc.value = value
	}

	public _fields: {
		kdf: $.VarRef<__goscript_kdf.KDF | null>
		id: $.VarRef<number>
		curve: $.VarRef<ecdh.Curve | null>
		Nsecret: $.VarRef<number>
		Nsk: $.VarRef<number>
		Nenc: $.VarRef<number>
	}

	constructor(init?: Partial<{kdf?: __goscript_kdf.KDF | null, id?: number, curve?: ecdh.Curve | null, Nsecret?: number, Nsk?: number, Nenc?: number}>) {
		this._fields = {
			kdf: $.varRef(init?.kdf ?? (null as __goscript_kdf.KDF | null)),
			id: $.varRef(init?.id ?? (0 as number)),
			curve: $.varRef(init?.curve ?? (null as ecdh.Curve | null)),
			Nsecret: $.varRef(init?.Nsecret ?? (0 as number)),
			Nsk: $.varRef(init?.Nsk ?? (0 as number)),
			Nenc: $.varRef(init?.Nenc ?? (0 as number))
		}
	}

	public clone(): dhKEM {
		const cloned = new dhKEM()
		cloned._fields = {
			kdf: $.varRef(this._fields.kdf.value),
			id: $.varRef(this._fields.id.value),
			curve: $.varRef(this._fields.curve.value),
			Nsecret: $.varRef(this._fields.Nsecret.value),
			Nsk: $.varRef(this._fields.Nsk.value),
			Nenc: $.varRef(this._fields.Nenc.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async DeriveKeyPair(ikm: $.Slice<number>): globalThis.Promise<[PrivateKey | null, $.GoError]> {
		const kem: dhKEM | $.VarRef<dhKEM> | null = this
		// DeriveKeyPair from RFC 9180 Section 7.1.3.
		let suiteID: $.Slice<number> = byteorder.BEAppendUint16(new Uint8Array([75, 69, 77]), $.uint($.pointerValue<dhKEM>(kem).id, 16))
		let __goscriptTuple0: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>($.pointerValue<dhKEM>(kem).kdf).labeledExtract(suiteID, null, "dkp_prk", ikm)
		let prk: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}
		if ($.pointerEqual(kem, __goscript_get_dhKEMX25519())) {
			let __goscriptTuple1: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>($.pointerValue<dhKEM>(kem).kdf).labeledExpand(suiteID, prk, "sk", null, $.uint($.pointerValue<dhKEM>(kem).Nsk, 16))
			let s: $.Slice<number> = __goscriptTuple1[0]
			let __goscriptShadow0 = __goscriptTuple1[1]
			if (__goscriptShadow0 != null) {
				return [null, __goscriptShadow0]
			}
			return dhKEM.prototype.NewPrivateKey.call(kem, s)
		}
		let counter: number = 0
		while ($.uint(counter, 8) < $.uint(4, 8)) {
			let __goscriptTuple2: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>($.pointerValue<dhKEM>(kem).kdf).labeledExpand(suiteID, prk, "candidate", new Uint8Array([counter]) as $.Slice<number>, $.uint($.pointerValue<dhKEM>(kem).Nsk, 16))
			let s: $.Slice<number> = __goscriptTuple2[0]
			let __goscriptShadow1 = __goscriptTuple2[1]
			if (__goscriptShadow1 != null) {
				return [null, __goscriptShadow1]
			}
			if ($.pointerEqual(kem, __goscript_get_dhKEMP521())) {
				s![0] = s![0] & ($.uint(0x01, 8))
			}
			let __goscriptTuple3: any = await dhKEM.prototype.NewPrivateKey.call(kem, s)
			let r = __goscriptTuple3[0]
			__goscriptShadow1 = __goscriptTuple3[1]
			if (__goscriptShadow1 != null) {
				counter++
				continue
			}
			return [r, null]
		}
		$.panic("chance of four rejections is < 2^-128")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async GenerateKey(): globalThis.Promise<[PrivateKey | null, $.GoError]> {
		const kem: dhKEM | $.VarRef<dhKEM> | null = this
		let __goscriptTuple4: any = await $.pointerValue<Exclude<ecdh.Curve, null>>($.pointerValue<dhKEM>(kem).curve).GenerateKey($.pointerValueOrNil(rand.Reader)!)
		let priv: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null = __goscriptTuple4[0]
		let err = __goscriptTuple4[1]
		if (err != null) {
			return [null, err]
		}
		return NewDHKEMPrivateKey($.interfaceValue<ecdh.KeyExchanger | null>(priv, "*ecdh.PrivateKey", { kind: $.TypeKind.Pointer, elemType: "ecdh.PrivateKey" }))
	}

	public ID(): number {
		const kem: dhKEM | $.VarRef<dhKEM> | null = this
		return $.uint($.pointerValue<dhKEM>(kem).id, 16)
	}

	public async NewPrivateKey(ikm: $.Slice<number>): globalThis.Promise<[PrivateKey | null, $.GoError]> {
		const kem: dhKEM | $.VarRef<dhKEM> | null = this
		let __goscriptTuple5: any = await $.pointerValue<Exclude<ecdh.Curve, null>>($.pointerValue<dhKEM>(kem).curve).NewPrivateKey(ikm)
		let priv: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null = __goscriptTuple5[0]
		let err = __goscriptTuple5[1]
		if (err != null) {
			return [null, err]
		}
		return NewDHKEMPrivateKey($.interfaceValue<ecdh.KeyExchanger | null>(priv, "*ecdh.PrivateKey", { kind: $.TypeKind.Pointer, elemType: "ecdh.PrivateKey" }))
	}

	public async NewPublicKey(data: $.Slice<number>): globalThis.Promise<[PublicKey | null, $.GoError]> {
		const kem: dhKEM | $.VarRef<dhKEM> | null = this
		let __goscriptTuple6: any = await $.pointerValue<Exclude<ecdh.Curve, null>>($.pointerValue<dhKEM>(kem).curve).NewPublicKey(data)
		let pub: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null = __goscriptTuple6[0]
		let err = __goscriptTuple6[1]
		if (err != null) {
			return [null, err]
		}
		return NewDHKEMPublicKey(pub)
	}

	public encSize(): number {
		const kem: dhKEM | $.VarRef<dhKEM> | null = this
		return $.pointerValue<dhKEM>(kem).Nenc
	}

	public async extractAndExpand(dhKey: $.Slice<number>, kemContext: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const kem: dhKEM | $.VarRef<dhKEM> | null = this
		let suiteID: $.Slice<number> = byteorder.BEAppendUint16(new Uint8Array([75, 69, 77]), $.uint($.pointerValue<dhKEM>(kem).id, 16))
		let __goscriptTuple7: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>($.pointerValue<dhKEM>(kem).kdf).labeledExtract(suiteID, null, "eae_prk", dhKey)
		let eaePRK: $.Slice<number> = __goscriptTuple7[0]
		let err = __goscriptTuple7[1]
		if (err != null) {
			return [null, err]
		}
		return $.pointerValue<Exclude<__goscript_kdf.KDF, null>>($.pointerValue<dhKEM>(kem).kdf).labeledExpand(suiteID, eaePRK, "shared_secret", kemContext, $.uint($.pointerValue<dhKEM>(kem).Nsecret, 16))
	}

	static __typeInfo = $.registerStructType(
		"hpke.dhKEM",
		() => new dhKEM(),
		[{ name: "DeriveKeyPair", args: [{ name: "ikm", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "GenerateKey", args: [], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "ID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "NewPrivateKey", args: [{ name: "ikm", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "NewPublicKey", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PublicKey" }, { name: "_r1", type: "error" }] }, { name: "encSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "extractAndExpand", args: [{ name: "dhKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "kemContext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }],
		dhKEM,
		[{ name: "kdf", key: "kdf", type: "hpke.KDF", pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/hpke", index: [1], offset: 16, exported: false }, { name: "curve", key: "curve", type: "ecdh.Curve", pkgPath: "crypto/hpke", index: [2], offset: 24, exported: false }, { name: "Nsecret", key: "Nsecret", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [3], offset: 40, exported: true }, { name: "Nsk", key: "Nsk", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [4], offset: 42, exported: true }, { name: "Nenc", key: "Nenc", type: { kind: $.TypeKind.Basic, name: "int" }, index: [5], offset: 48, exported: true }]
	)
}

export class unsupportedCurveKEM {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): unsupportedCurveKEM {
		const cloned = new unsupportedCurveKEM()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public DeriveKeyPair(_p0: $.Slice<number>): [PrivateKey | null, $.GoError] {
		return [null, errors.New("unsupported curve")]
	}

	public GenerateKey(): [PrivateKey | null, $.GoError] {
		return [null, errors.New("unsupported curve")]
	}

	public ID(): number {
		return $.uint(0, 16)
	}

	public NewPrivateKey(_p0: $.Slice<number>): [PrivateKey | null, $.GoError] {
		return [null, errors.New("unsupported curve")]
	}

	public NewPublicKey(_p0: $.Slice<number>): [PublicKey | null, $.GoError] {
		return [null, errors.New("unsupported curve")]
	}

	public encSize(): number {
		return 0
	}

	static __typeInfo = $.registerStructType(
		"hpke.unsupportedCurveKEM",
		() => new unsupportedCurveKEM(),
		[{ name: "DeriveKeyPair", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "GenerateKey", args: [], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "ID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "NewPrivateKey", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "NewPublicKey", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PublicKey" }, { name: "_r1", type: "error" }] }, { name: "encSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		unsupportedCurveKEM,
		[]
	)
}

export class dhKEMPublicKey {
	public get kem(): dhKEM | $.VarRef<dhKEM> | null {
		return this._fields.kem.value
	}
	public set kem(value: dhKEM | $.VarRef<dhKEM> | null) {
		this._fields.kem.value = value
	}

	public get pub(): ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null {
		return this._fields.pub.value
	}
	public set pub(value: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null) {
		this._fields.pub.value = value
	}

	public _fields: {
		kem: $.VarRef<dhKEM | $.VarRef<dhKEM> | null>
		pub: $.VarRef<ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null>
	}

	constructor(init?: Partial<{kem?: dhKEM | $.VarRef<dhKEM> | null, pub?: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null}>) {
		this._fields = {
			kem: $.varRef(init?.kem ?? (null as dhKEM | $.VarRef<dhKEM> | null)),
			pub: $.varRef(init?.pub ?? (null as ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null))
		}
	}

	public clone(): dhKEMPublicKey {
		const cloned = new dhKEMPublicKey()
		cloned._fields = {
			kem: $.varRef(this._fields.kem.value),
			pub: $.varRef(this._fields.pub.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Bytes(): $.Slice<number> {
		const pk: dhKEMPublicKey | $.VarRef<dhKEMPublicKey> | null = this
		return ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>($.pointerValue<dhKEMPublicKey>(pk).pub))
	}

	public KEM(): KEM | null {
		const pk: dhKEMPublicKey | $.VarRef<dhKEMPublicKey> | null = this
		return $.interfaceValue<KEM | null>($.pointerValue<dhKEMPublicKey>(pk).kem, "*hpke.dhKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEM" })
	}

	public async encap(): globalThis.Promise<[$.Slice<number>, $.Slice<number>, $.GoError]> {
		const pk: dhKEMPublicKey | $.VarRef<dhKEMPublicKey> | null = this
		let sharedSecret: $.Slice<number> = null as $.Slice<number>
		let encapPub: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		let __goscriptTuple8: any = await $.pointerValue<Exclude<ecdh.Curve, null>>(ecdh.PublicKey.prototype.Curve.call($.pointerValue<ecdh.PublicKey>($.pointerValue<dhKEMPublicKey>(pk).pub))).GenerateKey($.pointerValueOrNil(rand.Reader)!)
		let privEph: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null = __goscriptTuple8[0]
		err = __goscriptTuple8[1]
		if (err != null) {
			return [null, null, err]
		}
		if (testingOnlyGenerateKey != null) {
			privEph = await testingOnlyGenerateKey!()
		}
		let __goscriptTuple9: any = ecdh.PrivateKey.prototype.ECDH.call($.pointerValue<ecdh.PrivateKey>(privEph), $.pointerValue<dhKEMPublicKey>(pk).pub)
		let dhVal: $.Slice<number> = __goscriptTuple9[0]
		err = __goscriptTuple9[1]
		if (err != null) {
			return [null, null, err]
		}
		let encPubEph: $.Slice<number> = ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>(ecdh.PrivateKey.prototype.PublicKey.call($.pointerValue<ecdh.PrivateKey>(privEph))))

		let encPubRecip: $.Slice<number> = ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>($.pointerValue<dhKEMPublicKey>(pk).pub))
		let kemContext: $.Slice<number> = $.appendSlice(encPubEph, encPubRecip, $.byteSliceHint)
		let __goscriptTuple10: any = await dhKEM.prototype.extractAndExpand.call($.pointerValue<dhKEMPublicKey>(pk).kem, dhVal, kemContext)
		sharedSecret = __goscriptTuple10[0]
		err = __goscriptTuple10[1]
		if (err != null) {
			return [null, null, err]
		}
		return [sharedSecret, encPubEph, null]
	}

	static __typeInfo = $.registerStructType(
		"hpke.dhKEMPublicKey",
		() => new dhKEMPublicKey(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "KEM", args: [], returns: [{ name: "_r0", type: "hpke.KEM" }] }, { name: "encap", args: [], returns: [{ name: "sharedSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "encapPub", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }],
		dhKEMPublicKey,
		[{ name: "kem", key: "kem", type: { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEM" }, pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "pub", key: "pub", type: { kind: $.TypeKind.Pointer, elemType: "ecdh.PublicKey" }, pkgPath: "crypto/hpke", index: [1], offset: 8, exported: false }]
	)
}

export class dhKEMPrivateKey {
	public get kem(): dhKEM | $.VarRef<dhKEM> | null {
		return this._fields.kem.value
	}
	public set kem(value: dhKEM | $.VarRef<dhKEM> | null) {
		this._fields.kem.value = value
	}

	public get priv(): ecdh.KeyExchanger | null {
		return this._fields.priv.value
	}
	public set priv(value: ecdh.KeyExchanger | null) {
		this._fields.priv.value = value
	}

	public _fields: {
		kem: $.VarRef<dhKEM | $.VarRef<dhKEM> | null>
		priv: $.VarRef<ecdh.KeyExchanger | null>
	}

	constructor(init?: Partial<{kem?: dhKEM | $.VarRef<dhKEM> | null, priv?: ecdh.KeyExchanger | null}>) {
		this._fields = {
			kem: $.varRef(init?.kem ?? (null as dhKEM | $.VarRef<dhKEM> | null)),
			priv: $.varRef(init?.priv ?? (null as ecdh.KeyExchanger | null))
		}
	}

	public clone(): dhKEMPrivateKey {
		const cloned = new dhKEMPrivateKey()
		cloned._fields = {
			kem: $.varRef(this._fields.kem.value),
			priv: $.varRef(this._fields.priv.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Bytes(): [$.Slice<number>, $.GoError] {
		const k: dhKEMPrivateKey | $.VarRef<dhKEMPrivateKey> | null = this
		// Bizarrely, RFC 9180, Section 7.1.2 says SerializePrivateKey MUST clamp
		// the output, which I thought we all agreed to instead do as part of the DH
		// function, letting private keys be random bytes.
		//
		// At the same time, it says DeserializePrivateKey MUST also clamp, implying
		// that the input doesn't have to be clamped, so Bytes by spec doesn't
		// necessarily match the NewPrivateKey input.
		//
		// I'm sure this will not lead to any unexpected behavior or interop issue.
		let __goscriptTuple12: any = $.typeAssertTuple<ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null>($.pointerValue<dhKEMPrivateKey>(k).priv, { kind: $.TypeKind.Pointer, elemType: "ecdh.PrivateKey" })
		let priv: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null = __goscriptTuple12[0]
		let ok = __goscriptTuple12[1]
		if (!ok) {
			return [null, errors.New("ecdh: private key does not support Bytes")]
		}
		if ($.pointerEqual($.pointerValue<dhKEMPrivateKey>(k).kem, __goscript_get_dhKEMX25519())) {
			let b: $.Slice<number> = ecdh.PrivateKey.prototype.Bytes.call($.pointerValue<ecdh.PrivateKey>(priv))
			b![0] = b![0] & ($.uint(248, 8))
			b![31] = b![31] & ($.uint(127, 8))
			b![31] = b![31] | ($.uint(64, 8))
			return [b, null]
		}
		return [ecdh.PrivateKey.prototype.Bytes.call($.pointerValue<ecdh.PrivateKey>(priv)), null]
	}

	public KEM(): KEM | null {
		const k: dhKEMPrivateKey | $.VarRef<dhKEMPrivateKey> | null = this
		return $.interfaceValue<KEM | null>($.pointerValue<dhKEMPrivateKey>(k).kem, "*hpke.dhKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEM" })
	}

	public async PublicKey(): globalThis.Promise<PublicKey | null> {
		const k: dhKEMPrivateKey | $.VarRef<dhKEMPrivateKey> | null = this
		return $.interfaceValue<PublicKey | null>((await (async () => { const __goscriptLiteralField8 = await $.pointerValue<Exclude<ecdh.KeyExchanger, null>>($.pointerValue<dhKEMPrivateKey>(k).priv).PublicKey(); return new dhKEMPublicKey({kem: $.pointerValue<dhKEMPrivateKey>(k).kem, pub: __goscriptLiteralField8}) })()), "*hpke.dhKEMPublicKey", { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEMPublicKey" })
	}

	public async decap(encPubEph: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const k: dhKEMPrivateKey | $.VarRef<dhKEMPrivateKey> | null = this
		let __goscriptTuple13: any = await $.pointerValue<Exclude<ecdh.Curve, null>>((await $.pointerValue<Exclude<ecdh.KeyExchanger, null>>($.pointerValue<dhKEMPrivateKey>(k).priv).Curve())).NewPublicKey(encPubEph)
		let pubEph: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null = __goscriptTuple13[0]
		let err = __goscriptTuple13[1]
		if (err != null) {
			return [null, err]
		}
		let __goscriptTuple14: any = await $.pointerValue<Exclude<ecdh.KeyExchanger, null>>($.pointerValue<dhKEMPrivateKey>(k).priv).ECDH(pubEph)
		let dhVal: $.Slice<number> = __goscriptTuple14[0]
		err = __goscriptTuple14[1]
		if (err != null) {
			return [null, err]
		}
		let kemContext: $.Slice<number> = $.appendSlice(slices.Clip(encPubEph), ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>(await $.pointerValue<Exclude<ecdh.KeyExchanger, null>>($.pointerValue<dhKEMPrivateKey>(k).priv).PublicKey())), $.byteSliceHint)
		return dhKEM.prototype.extractAndExpand.call($.pointerValue<dhKEMPrivateKey>(k).kem, dhVal, kemContext)
	}

	static __typeInfo = $.registerStructType(
		"hpke.dhKEMPrivateKey",
		() => new dhKEMPrivateKey(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "KEM", args: [], returns: [{ name: "_r0", type: "hpke.KEM" }] }, { name: "PublicKey", args: [], returns: [{ name: "_r0", type: "hpke.PublicKey" }] }, { name: "decap", args: [{ name: "encPubEph", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }],
		dhKEMPrivateKey,
		[{ name: "kem", key: "kem", type: { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEM" }, pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "priv", key: "priv", type: "ecdh.KeyExchanger", pkgPath: "crypto/hpke", index: [1], offset: 8, exported: false }]
	)
}

export function NewKEM(id: number): [KEM | null, $.GoError] {
	switch (id) {
		case 0x0010:
		{
			return [DHKEM(ecdh.P256()), null]
			break
		}
		case 0x0011:
		{
			return [DHKEM(ecdh.P384()), null]
			break
		}
		case 0x0012:
		{
			return [DHKEM(ecdh.P521()), null]
			break
		}
		case 0x0020:
		{
			return [DHKEM(ecdh.X25519()), null]
			break
		}
		case 0x0041:
		{
			return [__goscript_pq.MLKEM768(), null]
			break
		}
		case 0x0042:
		{
			return [__goscript_pq.MLKEM1024(), null]
			break
		}
		case 0x647a:
		{
			return [__goscript_pq.MLKEM768X25519(), null]
			break
		}
		case 0x0050:
		{
			return [__goscript_pq.MLKEM768P256(), null]
			break
		}
		case 0x0051:
		{
			return [__goscript_pq.MLKEM1024P384(), null]
			break
		}
		default:
		{
			return [null, errors.New("unsupported KEM")]
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export var dhKEMP256: dhKEM | $.VarRef<dhKEM> | null

export function __goscript_init_dhKEMP256(): void {
	if (((dhKEMP256) as any) === undefined) {
		dhKEMP256 = (() => { const __goscriptLiteralField0 = __goscript_kdf.HKDFSHA256(); const __goscriptLiteralField1 = ecdh.P256(); return new dhKEM({kdf: __goscriptLiteralField0, id: $.uint(0x0010, 16), curve: __goscriptLiteralField1, Nsecret: $.uint(32, 16), Nsk: $.uint(32, 16), Nenc: 65}) })()
	}
}

export function __goscript_get_dhKEMP256(): dhKEM | $.VarRef<dhKEM> | null {
	if (((dhKEMP256) as any) === undefined) {
		__goscript_init_dhKEMP256()
	}
	return dhKEMP256
}

export function __goscript_set_dhKEMP256(__goscriptValue: dhKEM | $.VarRef<dhKEM> | null): void {
	dhKEMP256 = __goscriptValue
}

export var dhKEMP384: dhKEM | $.VarRef<dhKEM> | null

export function __goscript_init_dhKEMP384(): void {
	if (((dhKEMP384) as any) === undefined) {
		dhKEMP384 = (() => { const __goscriptLiteralField2 = __goscript_kdf.HKDFSHA384(); const __goscriptLiteralField3 = ecdh.P384(); return new dhKEM({kdf: __goscriptLiteralField2, id: $.uint(0x0011, 16), curve: __goscriptLiteralField3, Nsecret: $.uint(48, 16), Nsk: $.uint(48, 16), Nenc: 97}) })()
	}
}

export function __goscript_get_dhKEMP384(): dhKEM | $.VarRef<dhKEM> | null {
	if (((dhKEMP384) as any) === undefined) {
		__goscript_init_dhKEMP384()
	}
	return dhKEMP384
}

export function __goscript_set_dhKEMP384(__goscriptValue: dhKEM | $.VarRef<dhKEM> | null): void {
	dhKEMP384 = __goscriptValue
}

export var dhKEMP521: dhKEM | $.VarRef<dhKEM> | null

export function __goscript_init_dhKEMP521(): void {
	if (((dhKEMP521) as any) === undefined) {
		dhKEMP521 = (() => { const __goscriptLiteralField4 = __goscript_kdf.HKDFSHA512(); const __goscriptLiteralField5 = ecdh.P521(); return new dhKEM({kdf: __goscriptLiteralField4, id: $.uint(0x0012, 16), curve: __goscriptLiteralField5, Nsecret: $.uint(64, 16), Nsk: $.uint(66, 16), Nenc: 133}) })()
	}
}

export function __goscript_get_dhKEMP521(): dhKEM | $.VarRef<dhKEM> | null {
	if (((dhKEMP521) as any) === undefined) {
		__goscript_init_dhKEMP521()
	}
	return dhKEMP521
}

export function __goscript_set_dhKEMP521(__goscriptValue: dhKEM | $.VarRef<dhKEM> | null): void {
	dhKEMP521 = __goscriptValue
}

export var dhKEMX25519: dhKEM | $.VarRef<dhKEM> | null

export function __goscript_init_dhKEMX25519(): void {
	if (((dhKEMX25519) as any) === undefined) {
		dhKEMX25519 = (() => { const __goscriptLiteralField6 = __goscript_kdf.HKDFSHA256(); const __goscriptLiteralField7 = ecdh.X25519(); return new dhKEM({kdf: __goscriptLiteralField6, id: $.uint(0x0020, 16), curve: __goscriptLiteralField7, Nsecret: $.uint(32, 16), Nsk: $.uint(32, 16), Nenc: 32}) })()
	}
}

export function __goscript_get_dhKEMX25519(): dhKEM | $.VarRef<dhKEM> | null {
	if (((dhKEMX25519) as any) === undefined) {
		__goscript_init_dhKEMX25519()
	}
	return dhKEMX25519
}

export function __goscript_set_dhKEMX25519(__goscriptValue: dhKEM | $.VarRef<dhKEM> | null): void {
	dhKEMX25519 = __goscriptValue
}

export function DHKEM(curve: ecdh.Curve | null): KEM | null {
	{
		let __goscriptSwitch0 = curve
		switch (true) {
			case $.comparableEqual(__goscriptSwitch0, ecdh.P256()):
			{
				return $.interfaceValue<KEM | null>(__goscript_get_dhKEMP256(), "*hpke.dhKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEM" })
				break
			}
			case $.comparableEqual(__goscriptSwitch0, ecdh.P384()):
			{
				return $.interfaceValue<KEM | null>(__goscript_get_dhKEMP384(), "*hpke.dhKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEM" })
				break
			}
			case $.comparableEqual(__goscriptSwitch0, ecdh.P521()):
			{
				return $.interfaceValue<KEM | null>(__goscript_get_dhKEMP521(), "*hpke.dhKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEM" })
				break
			}
			case $.comparableEqual(__goscriptSwitch0, ecdh.X25519()):
			{
				return $.interfaceValue<KEM | null>(__goscript_get_dhKEMX25519(), "*hpke.dhKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEM" })
				break
			}
			default:
			{
				return $.interfaceValue<KEM | null>($.markAsStructValue(new unsupportedCurveKEM()), "hpke.unsupportedCurveKEM", "hpke.unsupportedCurveKEM")
				break
			}
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewDHKEMPublicKey(pub: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null): [PublicKey | null, $.GoError] {
	let __goscriptTuple11: any = $.typeAssertTuple<dhKEM | $.VarRef<dhKEM> | null>(DHKEM(ecdh.PublicKey.prototype.Curve.call($.pointerValue<ecdh.PublicKey>(pub))), { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEM" })
	let kem: dhKEM | $.VarRef<dhKEM> | null = __goscriptTuple11[0]
	let ok = __goscriptTuple11[1]
	if (!ok) {
		return [null, errors.New("unsupported curve")]
	}
	return [$.interfaceValue<PublicKey | null>(new dhKEMPublicKey({kem: kem, pub: pub}), "*hpke.dhKEMPublicKey", { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEMPublicKey" }), null]
}

export let testingOnlyGenerateKey: (() => ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null | globalThis.Promise<ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null>) | null = null as (() => ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null | globalThis.Promise<ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null>) | null

export function __goscript_set_testingOnlyGenerateKey(__goscriptValue: (() => ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null | globalThis.Promise<ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null>) | null): void {
	testingOnlyGenerateKey = __goscriptValue
}

export async function NewDHKEMPrivateKey(priv: ecdh.KeyExchanger | null): globalThis.Promise<[PrivateKey | null, $.GoError]> {
	let __goscriptTuple15: any = $.typeAssertTuple<dhKEM | $.VarRef<dhKEM> | null>(DHKEM(await $.pointerValue<Exclude<ecdh.KeyExchanger, null>>(priv).Curve()), { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEM" })
	let kem: dhKEM | $.VarRef<dhKEM> | null = __goscriptTuple15[0]
	let ok = __goscriptTuple15[1]
	if (!ok) {
		return [null, errors.New("unsupported curve")]
	}
	return [$.interfaceValue<PrivateKey | null>(new dhKEMPrivateKey({kem: kem, priv: priv}), "*hpke.dhKEMPrivateKey", { kind: $.TypeKind.Pointer, elemType: "hpke.dhKEMPrivateKey" }), null]
}

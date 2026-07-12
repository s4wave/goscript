// Generated file based on hpke.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as cipher from "@goscript/crypto/cipher/index.js"

import * as errors from "@goscript/errors/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as __goscript_aead from "./aead.gs.ts"

import * as __goscript_kdf from "./kdf.gs.ts"

import * as __goscript_kem from "./kem.gs.ts"
import "@goscript/crypto/cipher/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/byteorder/index.js"
import "./aead.gs.ts"
import "./kdf.gs.ts"
import "./kem.gs.ts"

export class context {
	public get suiteID(): $.Slice<number> {
		return this._fields.suiteID.value
	}
	public set suiteID(value: $.Slice<number>) {
		this._fields.suiteID.value = value
	}

	public get _export(): ((_p0: string, _p1: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null {
		return this._fields._export.value
	}
	public set _export(value: ((_p0: string, _p1: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null) {
		this._fields._export.value = value
	}

	public get aead(): cipher.AEAD | null {
		return this._fields.aead.value
	}
	public set aead(value: cipher.AEAD | null) {
		this._fields.aead.value = value
	}

	public get baseNonce(): $.Slice<number> {
		return this._fields.baseNonce.value
	}
	public set baseNonce(value: $.Slice<number>) {
		this._fields.baseNonce.value = value
	}

	// seqNum starts at zero and is incremented for each Seal/Open call.
	// 64 bits are enough not to overflow for 500 years at 1ns per operation.
	public get seqNum(): bigint {
		return this._fields.seqNum.value
	}
	public set seqNum(value: bigint) {
		this._fields.seqNum.value = value
	}

	public _fields: {
		suiteID: $.VarRef<$.Slice<number>>
		_export: $.VarRef<((_p0: string, _p1: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null>
		aead: $.VarRef<cipher.AEAD | null>
		baseNonce: $.VarRef<$.Slice<number>>
		seqNum: $.VarRef<bigint>
	}

	constructor(init?: Partial<{suiteID?: $.Slice<number>, _export?: ((_p0: string, _p1: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null, aead?: cipher.AEAD | null, baseNonce?: $.Slice<number>, seqNum?: bigint}>) {
		this._fields = {
			suiteID: $.varRef(init?.suiteID ?? (null as $.Slice<number>)),
			_export: $.varRef(init?._export ?? (null as ((_p0: string, _p1: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null)),
			aead: $.varRef(init?.aead ?? (null as cipher.AEAD | null)),
			baseNonce: $.varRef(init?.baseNonce ?? (null as $.Slice<number>)),
			seqNum: $.varRef(init?.seqNum ?? (0n as bigint))
		}
	}

	public clone(): context {
		const cloned = new context()
		cloned._fields = {
			suiteID: $.varRef(this._fields.suiteID.value),
			_export: $.varRef(this._fields._export.value),
			aead: $.varRef(this._fields.aead.value),
			baseNonce: $.varRef(this._fields.baseNonce.value),
			seqNum: $.varRef(this._fields.seqNum.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async nextNonce(): globalThis.Promise<$.Slice<number>> {
		const ctx: context | $.VarRef<context> | null = this
		let nonce: $.Slice<number> = $.makeSlice<number>(await $.pointerValue<Exclude<cipher.AEAD, null>>($.pointerValue<context>(ctx).aead).NonceSize(), undefined, "byte")
		byteorder.BEPutUint64($.goSlice(nonce, $.len(nonce) - 8, undefined), $.pointerValue<context>(ctx).seqNum)
		for (let __goscriptRangeTarget0 = $.pointerValue<context>(ctx).baseNonce, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			nonce![i] = nonce![i] ^ ($.uint($.arrayIndex($.pointerValue<context>(ctx).baseNonce!, i), 8))
		}
		return nonce
	}

	static __typeInfo = $.registerStructType(
		"hpke.context",
		() => new context(),
		[{ name: "nextNonce", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		context,
		[{ name: "suiteID", key: "suiteID", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "export", key: "_export", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "uint16" }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/hpke", index: [1], offset: 24, exported: false }, { name: "aead", key: "aead", type: "cipher.AEAD", pkgPath: "crypto/hpke", index: [2], offset: 32, exported: false }, { name: "baseNonce", key: "baseNonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/hpke", index: [3], offset: 48, exported: false }, { name: "seqNum", key: "seqNum", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/hpke", index: [4], offset: 72, exported: false }]
	)
}

export class Sender {
	public get context(): context | $.VarRef<context> | null {
		return this._fields.context.value
	}
	public set context(value: context | $.VarRef<context> | null) {
		this._fields.context.value = value
	}

	public _fields: {
		context: $.VarRef<context | $.VarRef<context> | null>
	}

	constructor(init?: Partial<{context?: context | $.VarRef<context> | null}>) {
		this._fields = {
			context: $.varRef(init?.context ?? (null as context | $.VarRef<context> | null))
		}
	}

	public clone(): Sender {
		const cloned = new Sender()
		cloned._fields = {
			context: $.varRef(this._fields.context.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Export(exporterContext: string, length: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const s: Sender | $.VarRef<Sender> | null = this
		if ((length < 0) || (length > 0xFFFF)) {
			return [null, errors.New("invalid length")]
		}
		return $.pointerValue<context>($.pointerValue<Sender>(s).context)._export!(exporterContext, $.uint($.uint(length, 16), 16))
	}

	public async Seal(aad: $.Slice<number>, plaintext: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		let s: Sender | $.VarRef<Sender> | null = this
		if ($.pointerValue<context>($.pointerValue<Sender>(s).context).aead == null) {
			return [null, errors.New("export-only instantiation")]
		}
		let ciphertext: $.Slice<number> = await $.pointerValue<Exclude<cipher.AEAD, null>>($.pointerValue<context>($.pointerValue<Sender>(s).context).aead).Seal(null, await $.pointerValue<context>($.pointerValue<Sender>(s).context).nextNonce(), plaintext, aad)
		$.pointerValue<context>($.pointerValue<Sender>(s).context).seqNum++
		return [ciphertext, null]
	}

	public async nextNonce(): globalThis.Promise<any> {
		return await $.pointerValue<context>(this.context).nextNonce()
	}

	static __typeInfo = $.registerStructType(
		"hpke.Sender",
		() => new Sender(),
		[{ name: "Export", args: [{ name: "exporterContext", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "length", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Seal", args: [{ name: "aad", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "plaintext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "nextNonce", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		Sender,
		[{ name: "context", key: "context", type: { kind: $.TypeKind.Pointer, elemType: "hpke.context" }, pkgPath: "crypto/hpke", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export class Recipient {
	public get context(): context | $.VarRef<context> | null {
		return this._fields.context.value
	}
	public set context(value: context | $.VarRef<context> | null) {
		this._fields.context.value = value
	}

	public _fields: {
		context: $.VarRef<context | $.VarRef<context> | null>
	}

	constructor(init?: Partial<{context?: context | $.VarRef<context> | null}>) {
		this._fields = {
			context: $.varRef(init?.context ?? (null as context | $.VarRef<context> | null))
		}
	}

	public clone(): Recipient {
		const cloned = new Recipient()
		cloned._fields = {
			context: $.varRef(this._fields.context.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Export(exporterContext: string, length: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const r: Recipient | $.VarRef<Recipient> | null = this
		if ((length < 0) || (length > 0xFFFF)) {
			return [null, errors.New("invalid length")]
		}
		return $.pointerValue<context>($.pointerValue<Recipient>(r).context)._export!(exporterContext, $.uint($.uint(length, 16), 16))
	}

	public async Open(aad: $.Slice<number>, ciphertext: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		let r: Recipient | $.VarRef<Recipient> | null = this
		if ($.pointerValue<context>($.pointerValue<Recipient>(r).context).aead == null) {
			return [null, errors.New("export-only instantiation")]
		}
		let __goscriptTuple0: any = await $.pointerValue<Exclude<cipher.AEAD, null>>($.pointerValue<context>($.pointerValue<Recipient>(r).context).aead).Open(null, await $.pointerValue<context>($.pointerValue<Recipient>(r).context).nextNonce(), ciphertext, aad)
		let plaintext: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}
		$.pointerValue<context>($.pointerValue<Recipient>(r).context).seqNum++
		return [plaintext, null]
	}

	public async nextNonce(): globalThis.Promise<any> {
		return await $.pointerValue<context>(this.context).nextNonce()
	}

	static __typeInfo = $.registerStructType(
		"hpke.Recipient",
		() => new Recipient(),
		[{ name: "Export", args: [{ name: "exporterContext", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "length", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Open", args: [{ name: "aad", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "nextNonce", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		Recipient,
		[{ name: "context", key: "context", type: { kind: $.TypeKind.Pointer, elemType: "hpke.context" }, pkgPath: "crypto/hpke", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export async function newContext(sharedSecret: $.Slice<number>, kemID: number, kdf: __goscript_kdf.KDF | null, aead: __goscript_aead.AEAD | null, info: $.Slice<number>): globalThis.Promise<[context | $.VarRef<context> | null, $.GoError]> {
	let sid: $.Slice<number> = suiteID($.uint(kemID, 16), $.uint(await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).ID(), 16), $.uint(await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).ID(), 16))

	if (await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).oneStage()) {
		let secrets: $.Slice<number> = $.makeSlice<number>(0, (2 + 2) + $.len(sharedSecret), "byte")
		secrets = byteorder.BEAppendUint16(secrets, $.uint(0, 16))
		secrets = byteorder.BEAppendUint16(secrets, $.uint($.uint($.len(sharedSecret), 16), 16))
		secrets = $.appendSlice(secrets, sharedSecret, $.byteSliceHint)

		let ksContext: $.Slice<number> = $.makeSlice<number>(0, ((1 + 2) + 2) + $.len(info), "byte")
		ksContext = $.append(ksContext, $.uint(0, 8), $.byteSliceHint)
		ksContext = byteorder.BEAppendUint16(ksContext, $.uint(0, 16))
		ksContext = byteorder.BEAppendUint16(ksContext, $.uint($.uint($.len(info), 16), 16))
		ksContext = $.appendSlice(ksContext, info, $.byteSliceHint)

		let __goscriptTuple1: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).labeledDerive(sid, secrets, "secret", ksContext, $.uint($.uint((await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).keySize() + await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).nonceSize()) + await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).size(), 16), 16))
		let secret: $.Slice<number> = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			return [null, err]
		}
		let key: $.Slice<number> = $.goSlice(secret, undefined, await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).keySize())
		let baseNonce: $.Slice<number> = $.goSlice(secret, await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).keySize(), await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).keySize() + await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).nonceSize())
		let expSecret: $.Slice<number> = $.goSlice(secret, await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).keySize() + await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).nonceSize(), undefined)

		let __goscriptTuple2: any = await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).aead(key)
		let a = __goscriptTuple2[0]
		err = __goscriptTuple2[1]
		if (err != null) {
			return [null, err]
		}
		let _export: ((exporterContext: string, length: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null = $.functionValue(async (exporterContext: string, length: number): globalThis.Promise<[$.Slice<number>, $.GoError]> => {
			return $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).labeledDerive(sid, expSecret, "sec", $.stringToBytes(exporterContext), $.uint(length, 16))
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "uint16" }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo))

		return [new context({aead: a, suiteID: sid, _export: _export, baseNonce: baseNonce}), null]
	}

	let __goscriptTuple3: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).labeledExtract(sid, null, "psk_id_hash", null)
	let pskIDHash: $.Slice<number> = __goscriptTuple3[0]
	let err = __goscriptTuple3[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple4: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).labeledExtract(sid, null, "info_hash", info)
	let infoHash: $.Slice<number> = __goscriptTuple4[0]
	err = __goscriptTuple4[1]
	if (err != null) {
		return [null, err]
	}
	let ksContext: $.Slice<number> = $.appendSlice(new Uint8Array([0]) as $.Slice<number>, pskIDHash, $.byteSliceHint)
	ksContext = $.appendSlice(ksContext, infoHash, $.byteSliceHint)

	let __goscriptTuple5: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).labeledExtract(sid, sharedSecret, "secret", null)
	let secret: $.Slice<number> = __goscriptTuple5[0]
	err = __goscriptTuple5[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple6: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).labeledExpand(sid, secret, "key", ksContext, $.uint($.uint(await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).keySize(), 16), 16))
	let key: $.Slice<number> = __goscriptTuple6[0]
	err = __goscriptTuple6[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple7: any = await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).aead(key)
	let a = __goscriptTuple7[0]
	err = __goscriptTuple7[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple8: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).labeledExpand(sid, secret, "base_nonce", ksContext, $.uint($.uint(await $.pointerValue<Exclude<__goscript_aead.AEAD, null>>(aead).nonceSize(), 16), 16))
	let baseNonce: $.Slice<number> = __goscriptTuple8[0]
	err = __goscriptTuple8[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple9: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).labeledExpand(sid, secret, "exp", ksContext, $.uint($.uint(await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).size(), 16), 16))
	let expSecret: $.Slice<number> = __goscriptTuple9[0]
	err = __goscriptTuple9[1]
	if (err != null) {
		return [null, err]
	}
	let _export: ((exporterContext: string, length: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null = $.functionValue(async (exporterContext: string, length: number): globalThis.Promise<[$.Slice<number>, $.GoError]> => {
		return $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(kdf).labeledExpand(sid, expSecret, "sec", $.stringToBytes(exporterContext), $.uint(length, 16))
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "uint16" }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo))

	return [new context({aead: a, suiteID: sid, _export: _export, baseNonce: baseNonce}), null]
}

export async function NewSender(pk: __goscript_kem.PublicKey | null, kdf: __goscript_kdf.KDF | null, aead: __goscript_aead.AEAD | null, info: $.Slice<number>): globalThis.Promise<[$.Slice<number>, Sender | $.VarRef<Sender> | null, $.GoError]> {
	let enc: $.Slice<number> = null as $.Slice<number>
	let s: Sender | $.VarRef<Sender> | null = null as Sender | $.VarRef<Sender> | null
	let err: $.GoError = null as $.GoError
	let __goscriptTuple10: any = await $.pointerValue<Exclude<__goscript_kem.PublicKey, null>>(pk).encap()
	let sharedSecret: $.Slice<number> = __goscriptTuple10[0]
	let encapsulatedKey: $.Slice<number> = __goscriptTuple10[1]
	err = __goscriptTuple10[2]
	if (err != null) {
		return [null, null, err]
	}
	let __goscriptTuple11: any = await newContext(sharedSecret, $.uint(await $.pointerValue<Exclude<__goscript_kem.KEM, null>>((await $.pointerValue<Exclude<__goscript_kem.PublicKey, null>>(pk).KEM())).ID(), 16), kdf, aead, info)
	let __goscriptShadow0: context | $.VarRef<context> | null = __goscriptTuple11[0]
	err = __goscriptTuple11[1]
	if (err != null) {
		return [null, null, err]
	}
	return [encapsulatedKey, new Sender({context: __goscriptShadow0}), null]
}

export async function NewRecipient(enc: $.Slice<number>, k: __goscript_kem.PrivateKey | null, kdf: __goscript_kdf.KDF | null, aead: __goscript_aead.AEAD | null, info: $.Slice<number>): globalThis.Promise<[Recipient | $.VarRef<Recipient> | null, $.GoError]> {
	let __goscriptTuple12: any = await $.pointerValue<Exclude<__goscript_kem.PrivateKey, null>>(k).decap(enc)
	let sharedSecret: $.Slice<number> = __goscriptTuple12[0]
	let err = __goscriptTuple12[1]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple13: any = await newContext(sharedSecret, $.uint(await $.pointerValue<Exclude<__goscript_kem.KEM, null>>((await $.pointerValue<Exclude<__goscript_kem.PrivateKey, null>>(k).KEM())).ID(), 16), kdf, aead, info)
	let __goscriptShadow1: context | $.VarRef<context> | null = __goscriptTuple13[0]
	err = __goscriptTuple13[1]
	if (err != null) {
		return [null, err]
	}
	return [new Recipient({context: __goscriptShadow1}), null]
}

export async function Seal(pk: __goscript_kem.PublicKey | null, kdf: __goscript_kdf.KDF | null, aead: __goscript_aead.AEAD | null, info: $.Slice<number>, plaintext: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let __goscriptTuple14: any = await NewSender(pk, kdf, aead, info)
	let enc: $.Slice<number> = __goscriptTuple14[0]
	let s: Sender | $.VarRef<Sender> | null = __goscriptTuple14[1]
	let err = __goscriptTuple14[2]
	if (err != null) {
		return [null, err]
	}
	let __goscriptTuple15: any = await Sender.prototype.Seal.call(s, null, plaintext)
	let ct: $.Slice<number> = __goscriptTuple15[0]
	err = __goscriptTuple15[1]
	if (err != null) {
		return [null, err]
	}
	return [$.appendSlice(enc, ct, $.byteSliceHint), null]
}

export async function Open(k: __goscript_kem.PrivateKey | null, kdf: __goscript_kdf.KDF | null, aead: __goscript_aead.AEAD | null, info: $.Slice<number>, ciphertext: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let encSize = await $.pointerValue<Exclude<__goscript_kem.KEM, null>>((await $.pointerValue<Exclude<__goscript_kem.PrivateKey, null>>(k).KEM())).encSize()
	if ($.len(ciphertext) < encSize) {
		return [null, errors.New("ciphertext too short")]
	}
	let enc: $.Slice<number> = $.goSlice(ciphertext, undefined, encSize)
	ciphertext = $.goSlice(ciphertext, encSize, undefined)
	let __goscriptTuple16: any = await NewRecipient(enc, k, kdf, aead, info)
	let r: Recipient | $.VarRef<Recipient> | null = __goscriptTuple16[0]
	let err = __goscriptTuple16[1]
	if (err != null) {
		return [null, err]
	}
	return Recipient.prototype.Open.call(r, null, ciphertext)
}

export function suiteID(kemID: number, kdfID: number, aeadID: number): $.Slice<number> {
	let __goscriptShadow2: $.Slice<number> = $.makeSlice<number>(0, ((4 + 2) + 2) + 2, "byte")
	__goscriptShadow2 = $.appendSlice(__goscriptShadow2, new Uint8Array([72, 80, 75, 69]), $.byteSliceHint)
	__goscriptShadow2 = byteorder.BEAppendUint16(__goscriptShadow2, $.uint(kemID, 16))
	__goscriptShadow2 = byteorder.BEAppendUint16(__goscriptShadow2, $.uint(kdfID, 16))
	__goscriptShadow2 = byteorder.BEAppendUint16(__goscriptShadow2, $.uint(aeadID, 16))
	return __goscriptShadow2
}

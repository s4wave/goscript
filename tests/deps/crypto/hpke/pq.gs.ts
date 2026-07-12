// Generated file based on pq.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as fips140 from "@goscript/crypto/fips140/index.js"

import * as drbg from "@goscript/crypto/internal/fips140/drbg/index.js"

import * as rand from "@goscript/crypto/internal/rand/index.js"

import * as mlkem from "@goscript/crypto/mlkem/index.js"

import * as sha3 from "@goscript/crypto/sha3/index.js"

import * as errors from "@goscript/errors/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as io from "@goscript/io/index.js"

import * as __goscript_kdf from "./kdf.gs.ts"

import * as __goscript_kem from "./kem.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/fips140/index.js"
import "@goscript/crypto/internal/fips140/drbg/index.js"
import "@goscript/crypto/internal/rand/index.js"
import "@goscript/crypto/mlkem/index.js"
import "@goscript/crypto/sha3/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/byteorder/index.js"
import "@goscript/io/index.js"
import "./kdf.gs.ts"
import "./kem.gs.ts"

export class hybridKEM {
	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	public get label(): string {
		return this._fields.label.value
	}
	public set label(value: string) {
		this._fields.label.value = value
	}

	public get curve(): ecdh.Curve | null {
		return this._fields.curve.value
	}
	public set curve(value: ecdh.Curve | null) {
		this._fields.curve.value = value
	}

	public get curveSeedSize(): number {
		return this._fields.curveSeedSize.value
	}
	public set curveSeedSize(value: number) {
		this._fields.curveSeedSize.value = value
	}

	public get curvePointSize(): number {
		return this._fields.curvePointSize.value
	}
	public set curvePointSize(value: number) {
		this._fields.curvePointSize.value = value
	}

	public get pqEncapsKeySize(): number {
		return this._fields.pqEncapsKeySize.value
	}
	public set pqEncapsKeySize(value: number) {
		this._fields.pqEncapsKeySize.value = value
	}

	public get pqCiphertextSize(): number {
		return this._fields.pqCiphertextSize.value
	}
	public set pqCiphertextSize(value: number) {
		this._fields.pqCiphertextSize.value = value
	}

	public get pqNewPublicKey(): ((data: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null {
		return this._fields.pqNewPublicKey.value
	}
	public set pqNewPublicKey(value: ((data: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null) {
		this._fields.pqNewPublicKey.value = value
	}

	public get pqNewPrivateKey(): ((data: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null {
		return this._fields.pqNewPrivateKey.value
	}
	public set pqNewPrivateKey(value: ((data: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null) {
		this._fields.pqNewPrivateKey.value = value
	}

	public _fields: {
		id: $.VarRef<number>
		label: $.VarRef<string>
		curve: $.VarRef<ecdh.Curve | null>
		curveSeedSize: $.VarRef<number>
		curvePointSize: $.VarRef<number>
		pqEncapsKeySize: $.VarRef<number>
		pqCiphertextSize: $.VarRef<number>
		pqNewPublicKey: $.VarRef<((data: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null>
		pqNewPrivateKey: $.VarRef<((data: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null>
	}

	constructor(init?: Partial<{id?: number, label?: string, curve?: ecdh.Curve | null, curveSeedSize?: number, curvePointSize?: number, pqEncapsKeySize?: number, pqCiphertextSize?: number, pqNewPublicKey?: ((data: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null, pqNewPrivateKey?: ((data: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null}>) {
		this._fields = {
			id: $.varRef(init?.id ?? (0 as number)),
			label: $.varRef(init?.label ?? ("" as string)),
			curve: $.varRef(init?.curve ?? (null as ecdh.Curve | null)),
			curveSeedSize: $.varRef(init?.curveSeedSize ?? (0 as number)),
			curvePointSize: $.varRef(init?.curvePointSize ?? (0 as number)),
			pqEncapsKeySize: $.varRef(init?.pqEncapsKeySize ?? (0 as number)),
			pqCiphertextSize: $.varRef(init?.pqCiphertextSize ?? (0 as number)),
			pqNewPublicKey: $.varRef(init?.pqNewPublicKey ?? (null as ((data: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null)),
			pqNewPrivateKey: $.varRef(init?.pqNewPrivateKey ?? (null as ((data: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null))
		}
	}

	public clone(): hybridKEM {
		const cloned = new hybridKEM()
		cloned._fields = {
			id: $.varRef(this._fields.id.value),
			label: $.varRef(this._fields.label.value),
			curve: $.varRef(this._fields.curve.value),
			curveSeedSize: $.varRef(this._fields.curveSeedSize.value),
			curvePointSize: $.varRef(this._fields.curvePointSize.value),
			pqEncapsKeySize: $.varRef(this._fields.pqEncapsKeySize.value),
			pqCiphertextSize: $.varRef(this._fields.pqCiphertextSize.value),
			pqNewPublicKey: $.varRef(this._fields.pqNewPublicKey.value),
			pqNewPrivateKey: $.varRef(this._fields.pqNewPrivateKey.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async DeriveKeyPair(ikm: $.Slice<number>): globalThis.Promise<[__goscript_kem.PrivateKey | null, $.GoError]> {
		const kem: hybridKEM | $.VarRef<hybridKEM> | null = this
		let suiteID: $.Slice<number> = byteorder.BEAppendUint16(new Uint8Array([75, 69, 77]), $.uint($.pointerValue<hybridKEM>(kem).id, 16))
		let __goscriptTuple0: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(__goscript_kdf.SHAKE256()).labeledDerive(suiteID, ikm, "DeriveKeyPair", null, $.uint(32, 16))
		let dk: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}
		return hybridKEM.prototype.NewPrivateKey.call(kem, dk)
	}

	public async GenerateKey(): globalThis.Promise<[__goscript_kem.PrivateKey | null, $.GoError]> {
		const kem: hybridKEM | $.VarRef<hybridKEM> | null = this
		let seed: $.Slice<number> = $.makeSlice<number>(32, undefined, "byte")
		await drbg.Read(seed)
		return hybridKEM.prototype.NewPrivateKey.call(kem, seed)
	}

	public ID(): number {
		const kem: hybridKEM | $.VarRef<hybridKEM> | null = this
		return $.uint($.pointerValue<hybridKEM>(kem).id, 16)
	}

	public async NewPrivateKey(priv: $.Slice<number>): globalThis.Promise<[__goscript_kem.PrivateKey | null, $.GoError]> {
		const kem: hybridKEM | $.VarRef<hybridKEM> | null = this
		if ($.len(priv) != 32) {
			return [null, errors.New("hpke: invalid hybrid KEM secret length")]
		}

		let s: sha3.SHAKE | $.VarRef<sha3.SHAKE> | null = sha3.NewSHAKE256()
		sha3.SHAKE.prototype.Write.call(s, priv)

		let seedPQ: $.Slice<number> = $.makeSlice<number>(mlkem.SeedSize, undefined, "byte")
		sha3.SHAKE.prototype.Read.call(s, seedPQ)
		let [pq, err] = await $.pointerValue<hybridKEM>(kem).pqNewPrivateKey!(seedPQ)
		if (err != null) {
			return [null, err]
		}

		let seedT: $.Slice<number> = $.makeSlice<number>($.pointerValue<hybridKEM>(kem).curveSeedSize, undefined, "byte")
		while (true) {
			sha3.SHAKE.prototype.Read.call(s, seedT)
			let k: ecdh.KeyExchanger | null = null as ecdh.KeyExchanger | null
			await fips140.WithoutEnforcement($.functionValue(async (): globalThis.Promise<void> => {
				let __goscriptTuple1: any = await $.pointerValue<Exclude<ecdh.Curve, null>>($.pointerValue<hybridKEM>(kem).curve).NewPrivateKey(seedT)
				k = $.interfaceValue<ecdh.KeyExchanger | null>(__goscriptTuple1[0], "*ecdh.PrivateKey", { kind: $.TypeKind.Pointer, elemType: "ecdh.PrivateKey" })
				err = __goscriptTuple1[1]
			}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
			if (err != null) {
				continue
			}
			return newHybridPrivateKey(pq, k, priv)
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async NewPublicKey(data: $.Slice<number>): globalThis.Promise<[__goscript_kem.PublicKey | null, $.GoError]> {
		const kem: hybridKEM | $.VarRef<hybridKEM> | null = this
		if ($.len(data) != ($.pointerValue<hybridKEM>(kem).pqEncapsKeySize + $.pointerValue<hybridKEM>(kem).curvePointSize)) {
			return [null, errors.New("invalid public key size")]
		}
		let [pq, err] = await $.pointerValue<hybridKEM>(kem).pqNewPublicKey!($.goSlice(data, undefined, $.pointerValue<hybridKEM>(kem).pqEncapsKeySize))
		if (err != null) {
			return [null, err]
		}
		let k: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null = null as ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null
		await fips140.WithoutEnforcement($.functionValue(async (): globalThis.Promise<void> => {
			let __goscriptTuple2: any = await $.pointerValue<Exclude<ecdh.Curve, null>>($.pointerValue<hybridKEM>(kem).curve).NewPublicKey($.goSlice(data, $.pointerValue<hybridKEM>(kem).pqEncapsKeySize, undefined))
			k = __goscriptTuple2[0]
			err = __goscriptTuple2[1]
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		if (err != null) {
			return [null, err]
		}
		return NewHybridPublicKey(pq, k)
	}

	public encSize(): number {
		const kem: hybridKEM | $.VarRef<hybridKEM> | null = this
		return $.pointerValue<hybridKEM>(kem).pqCiphertextSize + $.pointerValue<hybridKEM>(kem).curvePointSize
	}

	public sharedSecret(ssPQ: $.Slice<number>, ssT: $.Slice<number>, ctT: $.Slice<number>, ekT: $.Slice<number>): $.Slice<number> {
		const kem: hybridKEM | $.VarRef<hybridKEM> | null = this
		let h: sha3.SHA3 | $.VarRef<sha3.SHA3> | null = sha3.New256()
		sha3.SHA3.prototype.Write.call(h, ssPQ)
		sha3.SHA3.prototype.Write.call(h, ssT)
		sha3.SHA3.prototype.Write.call(h, ctT)
		sha3.SHA3.prototype.Write.call(h, ekT)
		sha3.SHA3.prototype.Write.call(h, $.stringToBytes($.pointerValue<hybridKEM>(kem).label))
		return sha3.SHA3.prototype.Sum.call(h, null)
	}

	static __typeInfo = $.registerStructType(
		"hpke.hybridKEM",
		() => new hybridKEM(),
		[{ name: "DeriveKeyPair", args: [{ name: "ikm", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "GenerateKey", args: [], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "ID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "NewPrivateKey", args: [{ name: "priv", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "NewPublicKey", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PublicKey" }, { name: "_r1", type: "error" }] }, { name: "encSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "sharedSecret", args: [{ name: "ssPQ", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ssT", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ctT", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ekT", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		hybridKEM,
		[{ name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "label", key: "label", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/hpke", index: [1], offset: 8, exported: false }, { name: "curve", key: "curve", type: "ecdh.Curve", pkgPath: "crypto/hpke", index: [2], offset: 24, exported: false }, { name: "curveSeedSize", key: "curveSeedSize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/hpke", index: [3], offset: 40, exported: false }, { name: "curvePointSize", key: "curvePointSize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/hpke", index: [4], offset: 48, exported: false }, { name: "pqEncapsKeySize", key: "pqEncapsKeySize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/hpke", index: [5], offset: 56, exported: false }, { name: "pqCiphertextSize", key: "pqCiphertextSize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/hpke", index: [6], offset: 64, exported: false }, { name: "pqNewPublicKey", key: "pqNewPublicKey", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Encapsulator", "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/hpke", index: [7], offset: 72, exported: false }, { name: "pqNewPrivateKey", key: "pqNewPrivateKey", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/hpke", index: [8], offset: 80, exported: false }]
	)
}

export class hybridPublicKey {
	public get kem(): hybridKEM | $.VarRef<hybridKEM> | null {
		return this._fields.kem.value
	}
	public set kem(value: hybridKEM | $.VarRef<hybridKEM> | null) {
		this._fields.kem.value = value
	}

	public get t(): ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null {
		return this._fields.t.value
	}
	public set t(value: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null) {
		this._fields.t.value = value
	}

	public get pq(): crypto.Encapsulator | null {
		return this._fields.pq.value
	}
	public set pq(value: crypto.Encapsulator | null) {
		this._fields.pq.value = value
	}

	public _fields: {
		kem: $.VarRef<hybridKEM | $.VarRef<hybridKEM> | null>
		t: $.VarRef<ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null>
		pq: $.VarRef<crypto.Encapsulator | null>
	}

	constructor(init?: Partial<{kem?: hybridKEM | $.VarRef<hybridKEM> | null, t?: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null, pq?: crypto.Encapsulator | null}>) {
		this._fields = {
			kem: $.varRef(init?.kem ?? (null as hybridKEM | $.VarRef<hybridKEM> | null)),
			t: $.varRef(init?.t ?? (null as ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null)),
			pq: $.varRef(init?.pq ?? (null as crypto.Encapsulator | null))
		}
	}

	public clone(): hybridPublicKey {
		const cloned = new hybridPublicKey()
		cloned._fields = {
			kem: $.varRef(this._fields.kem.value),
			t: $.varRef(this._fields.t.value),
			pq: $.varRef(this._fields.pq.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Bytes(): globalThis.Promise<$.Slice<number>> {
		const pk: hybridPublicKey | $.VarRef<hybridPublicKey> | null = this
		return $.appendSlice(await $.pointerValue<Exclude<crypto.Encapsulator, null>>($.pointerValue<hybridPublicKey>(pk).pq).Bytes(), ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>($.pointerValue<hybridPublicKey>(pk).t)), $.byteSliceHint)
	}

	public KEM(): __goscript_kem.KEM | null {
		const pk: hybridPublicKey | $.VarRef<hybridPublicKey> | null = this
		return $.interfaceValue<__goscript_kem.KEM | null>($.pointerValue<hybridPublicKey>(pk).kem, "*hpke.hybridKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.hybridKEM" })
	}

	public async encap(): globalThis.Promise<[$.Slice<number>, $.Slice<number>, $.GoError]> {
		const pk: hybridPublicKey | $.VarRef<hybridPublicKey> | null = this
		let sharedSecret: $.Slice<number> = null as $.Slice<number>
		let encapPub: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		let skE: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null = null as ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null
		await fips140.WithoutEnforcement($.functionValue(async (): globalThis.Promise<void> => {
			let __goscriptTuple3: any = await $.pointerValue<Exclude<ecdh.Curve, null>>(ecdh.PublicKey.prototype.Curve.call($.pointerValue<ecdh.PublicKey>($.pointerValue<hybridPublicKey>(pk).t))).GenerateKey($.pointerValueOrNil(rand.Reader)!)
			skE = __goscriptTuple3[0]
			err = __goscriptTuple3[1]
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		if (err != null) {
			return [null, null, err]
		}
		if (__goscript_kem.testingOnlyGenerateKey != null) {
			skE = await __goscript_kem.testingOnlyGenerateKey!()
		}
		let ssT: $.Slice<number> = null as $.Slice<number>
		await fips140.WithoutEnforcement($.functionValue((): void => {
			let __goscriptTuple4: any = ecdh.PrivateKey.prototype.ECDH.call($.pointerValue<ecdh.PrivateKey>(skE), $.pointerValue<hybridPublicKey>(pk).t)
			ssT = __goscriptTuple4[0]
			err = __goscriptTuple4[1]
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		if (err != null) {
			return [null, null, err]
		}
		let ctT: $.Slice<number> = ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>(ecdh.PrivateKey.prototype.PublicKey.call($.pointerValue<ecdh.PrivateKey>(skE))))

		let __goscriptTuple5: any = await $.pointerValue<Exclude<crypto.Encapsulator, null>>($.pointerValue<hybridPublicKey>(pk).pq).Encapsulate()
		let ssPQ: $.Slice<number> = __goscriptTuple5[0]
		let ctPQ: $.Slice<number> = __goscriptTuple5[1]
		if (testingOnlyEncapsulate != null) {
			let __goscriptTuple6: any = await testingOnlyEncapsulate!()
			ssPQ = __goscriptTuple6[0]
			ctPQ = __goscriptTuple6[1]
		}

		let ss: $.Slice<number> = hybridKEM.prototype.sharedSecret.call($.pointerValue<hybridPublicKey>(pk).kem, ssPQ, ssT, ctT, ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>($.pointerValue<hybridPublicKey>(pk).t)))
		let ct: $.Slice<number> = $.appendSlice(ctPQ, ctT, $.byteSliceHint)
		return [ss, ct, null]
	}

	static __typeInfo = $.registerStructType(
		"hpke.hybridPublicKey",
		() => new hybridPublicKey(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "KEM", args: [], returns: [{ name: "_r0", type: "hpke.KEM" }] }, { name: "encap", args: [], returns: [{ name: "sharedSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "encapPub", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }],
		hybridPublicKey,
		[{ name: "kem", key: "kem", type: { kind: $.TypeKind.Pointer, elemType: "hpke.hybridKEM" }, pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "t", key: "t", type: { kind: $.TypeKind.Pointer, elemType: "ecdh.PublicKey" }, pkgPath: "crypto/hpke", index: [1], offset: 8, exported: false }, { name: "pq", key: "pq", type: "crypto.Encapsulator", pkgPath: "crypto/hpke", index: [2], offset: 16, exported: false }]
	)
}

export class hybridPrivateKey {
	public get kem(): hybridKEM | $.VarRef<hybridKEM> | null {
		return this._fields.kem.value
	}
	public set kem(value: hybridKEM | $.VarRef<hybridKEM> | null) {
		this._fields.kem.value = value
	}

	public get seed(): $.Slice<number> {
		return this._fields.seed.value
	}
	public set seed(value: $.Slice<number>) {
		this._fields.seed.value = value
	}

	public get t(): ecdh.KeyExchanger | null {
		return this._fields.t.value
	}
	public set t(value: ecdh.KeyExchanger | null) {
		this._fields.t.value = value
	}

	public get pq(): crypto.Decapsulator | null {
		return this._fields.pq.value
	}
	public set pq(value: crypto.Decapsulator | null) {
		this._fields.pq.value = value
	}

	public _fields: {
		kem: $.VarRef<hybridKEM | $.VarRef<hybridKEM> | null>
		seed: $.VarRef<$.Slice<number>>
		t: $.VarRef<ecdh.KeyExchanger | null>
		pq: $.VarRef<crypto.Decapsulator | null>
	}

	constructor(init?: Partial<{kem?: hybridKEM | $.VarRef<hybridKEM> | null, seed?: $.Slice<number>, t?: ecdh.KeyExchanger | null, pq?: crypto.Decapsulator | null}>) {
		this._fields = {
			kem: $.varRef(init?.kem ?? (null as hybridKEM | $.VarRef<hybridKEM> | null)),
			seed: $.varRef(init?.seed ?? (null as $.Slice<number>)),
			t: $.varRef(init?.t ?? (null as ecdh.KeyExchanger | null)),
			pq: $.varRef(init?.pq ?? (null as crypto.Decapsulator | null))
		}
	}

	public clone(): hybridPrivateKey {
		const cloned = new hybridPrivateKey()
		cloned._fields = {
			kem: $.varRef(this._fields.kem.value),
			seed: $.varRef(this._fields.seed.value),
			t: $.varRef(this._fields.t.value),
			pq: $.varRef(this._fields.pq.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Bytes(): [$.Slice<number>, $.GoError] {
		const k: hybridPrivateKey | $.VarRef<hybridPrivateKey> | null = this
		if ($.pointerValue<hybridPrivateKey>(k).seed == null) {
			return [null, errors.New("private key seed not available")]
		}
		return [$.pointerValue<hybridPrivateKey>(k).seed, null]
	}

	public KEM(): __goscript_kem.KEM | null {
		const k: hybridPrivateKey | $.VarRef<hybridPrivateKey> | null = this
		return $.interfaceValue<__goscript_kem.KEM | null>($.pointerValue<hybridPrivateKey>(k).kem, "*hpke.hybridKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.hybridKEM" })
	}

	public async PublicKey(): globalThis.Promise<__goscript_kem.PublicKey | null> {
		const k: hybridPrivateKey | $.VarRef<hybridPrivateKey> | null = this
		return $.interfaceValue<__goscript_kem.PublicKey | null>((await (async () => { const __goscriptLiteralField3 = await $.pointerValue<Exclude<ecdh.KeyExchanger, null>>($.pointerValue<hybridPrivateKey>(k).t).PublicKey(); const __goscriptLiteralField4 = await $.pointerValue<Exclude<crypto.Decapsulator, null>>($.pointerValue<hybridPrivateKey>(k).pq).Encapsulator(); return new hybridPublicKey({kem: $.pointerValue<hybridPrivateKey>(k).kem, t: __goscriptLiteralField3, pq: __goscriptLiteralField4}) })()), "*hpke.hybridPublicKey", { kind: $.TypeKind.Pointer, elemType: "hpke.hybridPublicKey" })
	}

	public async decap(enc: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const k: hybridPrivateKey | $.VarRef<hybridPrivateKey> | null = this
		if ($.len(enc) != ($.pointerValue<hybridKEM>($.pointerValue<hybridPrivateKey>(k).kem).pqCiphertextSize + $.pointerValue<hybridKEM>($.pointerValue<hybridPrivateKey>(k).kem).curvePointSize)) {
			return [null, errors.New("invalid encapsulated key size")]
		}
		let ctPQ: $.Slice<number> = $.goSlice(enc, undefined, $.pointerValue<hybridKEM>($.pointerValue<hybridPrivateKey>(k).kem).pqCiphertextSize)
		let ctT: $.Slice<number> = $.goSlice(enc, $.pointerValue<hybridKEM>($.pointerValue<hybridPrivateKey>(k).kem).pqCiphertextSize, undefined)
		let __goscriptTuple7: any = await $.pointerValue<Exclude<crypto.Decapsulator, null>>($.pointerValue<hybridPrivateKey>(k).pq).Decapsulate(ctPQ)
		let ssPQ: $.Slice<number> = __goscriptTuple7[0]
		let err = __goscriptTuple7[1]
		if (err != null) {
			return [null, err]
		}
		let pub: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null = null as ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null
		await fips140.WithoutEnforcement($.functionValue(async (): globalThis.Promise<void> => {
			let __goscriptTuple8: any = await $.pointerValue<Exclude<ecdh.Curve, null>>((await $.pointerValue<Exclude<ecdh.KeyExchanger, null>>($.pointerValue<hybridPrivateKey>(k).t).Curve())).NewPublicKey(ctT)
			pub = __goscriptTuple8[0]
			err = __goscriptTuple8[1]
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		if (err != null) {
			return [null, err]
		}
		let ssT: $.Slice<number> = null as $.Slice<number>
		await fips140.WithoutEnforcement($.functionValue(async (): globalThis.Promise<void> => {
			let __goscriptTuple9: any = await $.pointerValue<Exclude<ecdh.KeyExchanger, null>>($.pointerValue<hybridPrivateKey>(k).t).ECDH(pub)
			ssT = __goscriptTuple9[0]
			err = __goscriptTuple9[1]
		}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
		if (err != null) {
			return [null, err]
		}
		let ss: $.Slice<number> = hybridKEM.prototype.sharedSecret.call($.pointerValue<hybridPrivateKey>(k).kem, ssPQ, ssT, ctT, ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>(await $.pointerValue<Exclude<ecdh.KeyExchanger, null>>($.pointerValue<hybridPrivateKey>(k).t).PublicKey())))
		return [ss, null]
	}

	static __typeInfo = $.registerStructType(
		"hpke.hybridPrivateKey",
		() => new hybridPrivateKey(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "KEM", args: [], returns: [{ name: "_r0", type: "hpke.KEM" }] }, { name: "PublicKey", args: [], returns: [{ name: "_r0", type: "hpke.PublicKey" }] }, { name: "decap", args: [{ name: "enc", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }],
		hybridPrivateKey,
		[{ name: "kem", key: "kem", type: { kind: $.TypeKind.Pointer, elemType: "hpke.hybridKEM" }, pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "seed", key: "seed", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/hpke", index: [1], offset: 8, exported: false }, { name: "t", key: "t", type: "ecdh.KeyExchanger", pkgPath: "crypto/hpke", index: [2], offset: 32, exported: false }, { name: "pq", key: "pq", type: "crypto.Decapsulator", pkgPath: "crypto/hpke", index: [3], offset: 48, exported: false }]
	)
}

export class mlkemKEM {
	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	public get ciphertextSize(): number {
		return this._fields.ciphertextSize.value
	}
	public set ciphertextSize(value: number) {
		this._fields.ciphertextSize.value = value
	}

	public get newPublicKey(): ((data: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null {
		return this._fields.newPublicKey.value
	}
	public set newPublicKey(value: ((data: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null) {
		this._fields.newPublicKey.value = value
	}

	public get newPrivateKey(): ((data: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null {
		return this._fields.newPrivateKey.value
	}
	public set newPrivateKey(value: ((data: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null) {
		this._fields.newPrivateKey.value = value
	}

	public get generateKey(): (() => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null {
		return this._fields.generateKey.value
	}
	public set generateKey(value: (() => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null) {
		this._fields.generateKey.value = value
	}

	public _fields: {
		id: $.VarRef<number>
		ciphertextSize: $.VarRef<number>
		newPublicKey: $.VarRef<((data: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null>
		newPrivateKey: $.VarRef<((data: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null>
		generateKey: $.VarRef<(() => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null>
	}

	constructor(init?: Partial<{id?: number, ciphertextSize?: number, newPublicKey?: ((data: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null, newPrivateKey?: ((data: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null, generateKey?: (() => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null}>) {
		this._fields = {
			id: $.varRef(init?.id ?? (0 as number)),
			ciphertextSize: $.varRef(init?.ciphertextSize ?? (0 as number)),
			newPublicKey: $.varRef(init?.newPublicKey ?? (null as ((data: $.Slice<number>) => [crypto.Encapsulator | null, $.GoError] | globalThis.Promise<[crypto.Encapsulator | null, $.GoError]>) | null)),
			newPrivateKey: $.varRef(init?.newPrivateKey ?? (null as ((data: $.Slice<number>) => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null)),
			generateKey: $.varRef(init?.generateKey ?? (null as (() => [crypto.Decapsulator | null, $.GoError] | globalThis.Promise<[crypto.Decapsulator | null, $.GoError]>) | null))
		}
	}

	public clone(): mlkemKEM {
		const cloned = new mlkemKEM()
		cloned._fields = {
			id: $.varRef(this._fields.id.value),
			ciphertextSize: $.varRef(this._fields.ciphertextSize.value),
			newPublicKey: $.varRef(this._fields.newPublicKey.value),
			newPrivateKey: $.varRef(this._fields.newPrivateKey.value),
			generateKey: $.varRef(this._fields.generateKey.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async DeriveKeyPair(ikm: $.Slice<number>): globalThis.Promise<[__goscript_kem.PrivateKey | null, $.GoError]> {
		const kem: mlkemKEM | $.VarRef<mlkemKEM> | null = this
		let suiteID: $.Slice<number> = byteorder.BEAppendUint16(new Uint8Array([75, 69, 77]), $.uint($.pointerValue<mlkemKEM>(kem).id, 16))
		let __goscriptTuple10: any = await $.pointerValue<Exclude<__goscript_kdf.KDF, null>>(__goscript_kdf.SHAKE256()).labeledDerive(suiteID, ikm, "DeriveKeyPair", null, $.uint(64, 16))
		let dk: $.Slice<number> = __goscriptTuple10[0]
		let err = __goscriptTuple10[1]
		if (err != null) {
			return [null, err]
		}
		return mlkemKEM.prototype.NewPrivateKey.call(kem, dk)
	}

	public async GenerateKey(): globalThis.Promise<[__goscript_kem.PrivateKey | null, $.GoError]> {
		const kem: mlkemKEM | $.VarRef<mlkemKEM> | null = this
		let [pq, err] = await $.pointerValue<mlkemKEM>(kem).generateKey!()
		if (err != null) {
			return [null, err]
		}
		return NewMLKEMPrivateKey(pq)
	}

	public ID(): number {
		const kem: mlkemKEM | $.VarRef<mlkemKEM> | null = this
		return $.uint($.pointerValue<mlkemKEM>(kem).id, 16)
	}

	public async NewPrivateKey(priv: $.Slice<number>): globalThis.Promise<[__goscript_kem.PrivateKey | null, $.GoError]> {
		const kem: mlkemKEM | $.VarRef<mlkemKEM> | null = this
		let [pq, err] = await $.pointerValue<mlkemKEM>(kem).newPrivateKey!(priv)
		if (err != null) {
			return [null, err]
		}
		return NewMLKEMPrivateKey(pq)
	}

	public async NewPublicKey(data: $.Slice<number>): globalThis.Promise<[__goscript_kem.PublicKey | null, $.GoError]> {
		const kem: mlkemKEM | $.VarRef<mlkemKEM> | null = this
		let [pq, err] = await $.pointerValue<mlkemKEM>(kem).newPublicKey!(data)
		if (err != null) {
			return [null, err]
		}
		return NewMLKEMPublicKey(pq)
	}

	public encSize(): number {
		const kem: mlkemKEM | $.VarRef<mlkemKEM> | null = this
		return $.pointerValue<mlkemKEM>(kem).ciphertextSize
	}

	static __typeInfo = $.registerStructType(
		"hpke.mlkemKEM",
		() => new mlkemKEM(),
		[{ name: "DeriveKeyPair", args: [{ name: "ikm", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "GenerateKey", args: [], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "ID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "NewPrivateKey", args: [{ name: "priv", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PrivateKey" }, { name: "_r1", type: "error" }] }, { name: "NewPublicKey", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "hpke.PublicKey" }, { name: "_r1", type: "error" }] }, { name: "encSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		mlkemKEM,
		[{ name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "ciphertextSize", key: "ciphertextSize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/hpke", index: [1], offset: 8, exported: false }, { name: "newPublicKey", key: "newPublicKey", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Encapsulator", "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/hpke", index: [2], offset: 16, exported: false }, { name: "newPrivateKey", key: "newPrivateKey", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/hpke", index: [3], offset: 24, exported: false }, { name: "generateKey", key: "generateKey", type: ({ kind: $.TypeKind.Function, params: [], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/hpke", index: [4], offset: 32, exported: false }]
	)
}

export class mlkemPublicKey {
	public get kem(): mlkemKEM | $.VarRef<mlkemKEM> | null {
		return this._fields.kem.value
	}
	public set kem(value: mlkemKEM | $.VarRef<mlkemKEM> | null) {
		this._fields.kem.value = value
	}

	public get pq(): crypto.Encapsulator | null {
		return this._fields.pq.value
	}
	public set pq(value: crypto.Encapsulator | null) {
		this._fields.pq.value = value
	}

	public _fields: {
		kem: $.VarRef<mlkemKEM | $.VarRef<mlkemKEM> | null>
		pq: $.VarRef<crypto.Encapsulator | null>
	}

	constructor(init?: Partial<{kem?: mlkemKEM | $.VarRef<mlkemKEM> | null, pq?: crypto.Encapsulator | null}>) {
		this._fields = {
			kem: $.varRef(init?.kem ?? (null as mlkemKEM | $.VarRef<mlkemKEM> | null)),
			pq: $.varRef(init?.pq ?? (null as crypto.Encapsulator | null))
		}
	}

	public clone(): mlkemPublicKey {
		const cloned = new mlkemPublicKey()
		cloned._fields = {
			kem: $.varRef(this._fields.kem.value),
			pq: $.varRef(this._fields.pq.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Bytes(): globalThis.Promise<$.Slice<number>> {
		const pk: mlkemPublicKey | $.VarRef<mlkemPublicKey> | null = this
		return $.pointerValue<Exclude<crypto.Encapsulator, null>>($.pointerValue<mlkemPublicKey>(pk).pq).Bytes()
	}

	public KEM(): __goscript_kem.KEM | null {
		const pk: mlkemPublicKey | $.VarRef<mlkemPublicKey> | null = this
		return $.interfaceValue<__goscript_kem.KEM | null>($.pointerValue<mlkemPublicKey>(pk).kem, "*hpke.mlkemKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.mlkemKEM" })
	}

	public async encap(): globalThis.Promise<[$.Slice<number>, $.Slice<number>, $.GoError]> {
		const pk: mlkemPublicKey | $.VarRef<mlkemPublicKey> | null = this
		let sharedSecret: $.Slice<number> = null as $.Slice<number>
		let encapPub: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		let __goscriptTuple11: any = await $.pointerValue<Exclude<crypto.Encapsulator, null>>($.pointerValue<mlkemPublicKey>(pk).pq).Encapsulate()
		let ss: $.Slice<number> = __goscriptTuple11[0]
		let ct: $.Slice<number> = __goscriptTuple11[1]
		if (testingOnlyEncapsulate != null) {
			let __goscriptTuple12: any = await testingOnlyEncapsulate!()
			ss = __goscriptTuple12[0]
			ct = __goscriptTuple12[1]
		}
		return [ss, ct, null]
	}

	static __typeInfo = $.registerStructType(
		"hpke.mlkemPublicKey",
		() => new mlkemPublicKey(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "KEM", args: [], returns: [{ name: "_r0", type: "hpke.KEM" }] }, { name: "encap", args: [], returns: [{ name: "sharedSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "encapPub", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }],
		mlkemPublicKey,
		[{ name: "kem", key: "kem", type: { kind: $.TypeKind.Pointer, elemType: "hpke.mlkemKEM" }, pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "pq", key: "pq", type: "crypto.Encapsulator", pkgPath: "crypto/hpke", index: [1], offset: 8, exported: false }]
	)
}

export class mlkemPrivateKey {
	public get kem(): mlkemKEM | $.VarRef<mlkemKEM> | null {
		return this._fields.kem.value
	}
	public set kem(value: mlkemKEM | $.VarRef<mlkemKEM> | null) {
		this._fields.kem.value = value
	}

	public get pq(): crypto.Decapsulator | null {
		return this._fields.pq.value
	}
	public set pq(value: crypto.Decapsulator | null) {
		this._fields.pq.value = value
	}

	public _fields: {
		kem: $.VarRef<mlkemKEM | $.VarRef<mlkemKEM> | null>
		pq: $.VarRef<crypto.Decapsulator | null>
	}

	constructor(init?: Partial<{kem?: mlkemKEM | $.VarRef<mlkemKEM> | null, pq?: crypto.Decapsulator | null}>) {
		this._fields = {
			kem: $.varRef(init?.kem ?? (null as mlkemKEM | $.VarRef<mlkemKEM> | null)),
			pq: $.varRef(init?.pq ?? (null as crypto.Decapsulator | null))
		}
	}

	public clone(): mlkemPrivateKey {
		const cloned = new mlkemPrivateKey()
		cloned._fields = {
			kem: $.varRef(this._fields.kem.value),
			pq: $.varRef(this._fields.pq.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Bytes(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const k: mlkemPrivateKey | $.VarRef<mlkemPrivateKey> | null = this
		let __goscriptTuple13: any = $.typeAssertTuple<any>($.pointerValue<mlkemPrivateKey>(k).pq, { kind: $.TypeKind.Interface, methods: [{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }] })
		let pq = __goscriptTuple13[0]
		let ok = __goscriptTuple13[1]
		if (!ok) {
			return [null, errors.New("private key seed not available")]
		}
		return [await $.pointerValue<any>(pq).Bytes(), null]
	}

	public KEM(): __goscript_kem.KEM | null {
		const k: mlkemPrivateKey | $.VarRef<mlkemPrivateKey> | null = this
		return $.interfaceValue<__goscript_kem.KEM | null>($.pointerValue<mlkemPrivateKey>(k).kem, "*hpke.mlkemKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.mlkemKEM" })
	}

	public async PublicKey(): globalThis.Promise<__goscript_kem.PublicKey | null> {
		const k: mlkemPrivateKey | $.VarRef<mlkemPrivateKey> | null = this
		return $.interfaceValue<__goscript_kem.PublicKey | null>((await (async () => { const __goscriptLiteralField8 = await $.pointerValue<Exclude<crypto.Decapsulator, null>>($.pointerValue<mlkemPrivateKey>(k).pq).Encapsulator(); return new mlkemPublicKey({kem: $.pointerValue<mlkemPrivateKey>(k).kem, pq: __goscriptLiteralField8}) })()), "*hpke.mlkemPublicKey", { kind: $.TypeKind.Pointer, elemType: "hpke.mlkemPublicKey" })
	}

	public async decap(enc: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const k: mlkemPrivateKey | $.VarRef<mlkemPrivateKey> | null = this
		return $.pointerValue<Exclude<crypto.Decapsulator, null>>($.pointerValue<mlkemPrivateKey>(k).pq).Decapsulate(enc)
	}

	static __typeInfo = $.registerStructType(
		"hpke.mlkemPrivateKey",
		() => new mlkemPrivateKey(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "KEM", args: [], returns: [{ name: "_r0", type: "hpke.KEM" }] }, { name: "PublicKey", args: [], returns: [{ name: "_r0", type: "hpke.PublicKey" }] }, { name: "decap", args: [{ name: "enc", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }],
		mlkemPrivateKey,
		[{ name: "kem", key: "kem", type: { kind: $.TypeKind.Pointer, elemType: "hpke.mlkemKEM" }, pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "pq", key: "pq", type: "crypto.Decapsulator", pkgPath: "crypto/hpke", index: [1], offset: 8, exported: false }]
	)
}

export let mlkem768X25519: hybridKEM | $.VarRef<hybridKEM> | null = (() => { const __goscriptLiteralField0 = ecdh.X25519(); return new hybridKEM({id: $.uint(0x647a, 16), label: "\\./" + "/^\\", curve: __goscriptLiteralField0, curveSeedSize: 32, curvePointSize: 32, pqEncapsKeySize: mlkem.EncapsulationKeySize768, pqCiphertextSize: mlkem.CiphertextSize768, pqNewPublicKey: $.functionValue((data: $.Slice<number>): [crypto.Encapsulator | null, $.GoError] => {
	const __goscriptReturn0 = mlkem.NewEncapsulationKey768(data)
	return [$.interfaceValue<crypto.Encapsulator | null>(__goscriptReturn0[0], "*mlkem.EncapsulationKey768", { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey768" }), __goscriptReturn0[1]]
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Encapsulator", "error"] } as $.FunctionTypeInfo)), pqNewPrivateKey: $.functionValue((data: $.Slice<number>): [crypto.Decapsulator | null, $.GoError] => {
	const __goscriptReturn1 = mlkem.NewDecapsulationKey768(data)
	return [$.interfaceValue<crypto.Decapsulator | null>(__goscriptReturn1[0], "*mlkem.DecapsulationKey768", { kind: $.TypeKind.Pointer, elemType: "mlkem.DecapsulationKey768" }), __goscriptReturn1[1]]
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo))}) })()

export function __goscript_set_mlkem768X25519(__goscriptValue: hybridKEM | $.VarRef<hybridKEM> | null): void {
	mlkem768X25519 = __goscriptValue
}

export function MLKEM768X25519(): __goscript_kem.KEM | null {
	return $.interfaceValue<__goscript_kem.KEM | null>(mlkem768X25519, "*hpke.hybridKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.hybridKEM" })
}

export let mlkem768P256: hybridKEM | $.VarRef<hybridKEM> | null = (() => { const __goscriptLiteralField1 = ecdh.P256(); return new hybridKEM({id: $.uint(0x0050, 16), label: "MLKEM768-P256", curve: __goscriptLiteralField1, curveSeedSize: 32, curvePointSize: 65, pqEncapsKeySize: mlkem.EncapsulationKeySize768, pqCiphertextSize: mlkem.CiphertextSize768, pqNewPublicKey: $.functionValue((data: $.Slice<number>): [crypto.Encapsulator | null, $.GoError] => {
	const __goscriptReturn2 = mlkem.NewEncapsulationKey768(data)
	return [$.interfaceValue<crypto.Encapsulator | null>(__goscriptReturn2[0], "*mlkem.EncapsulationKey768", { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey768" }), __goscriptReturn2[1]]
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Encapsulator", "error"] } as $.FunctionTypeInfo)), pqNewPrivateKey: $.functionValue((data: $.Slice<number>): [crypto.Decapsulator | null, $.GoError] => {
	const __goscriptReturn3 = mlkem.NewDecapsulationKey768(data)
	return [$.interfaceValue<crypto.Decapsulator | null>(__goscriptReturn3[0], "*mlkem.DecapsulationKey768", { kind: $.TypeKind.Pointer, elemType: "mlkem.DecapsulationKey768" }), __goscriptReturn3[1]]
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo))}) })()

export function __goscript_set_mlkem768P256(__goscriptValue: hybridKEM | $.VarRef<hybridKEM> | null): void {
	mlkem768P256 = __goscriptValue
}

export function MLKEM768P256(): __goscript_kem.KEM | null {
	return $.interfaceValue<__goscript_kem.KEM | null>(mlkem768P256, "*hpke.hybridKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.hybridKEM" })
}

export let mlkem1024P384: hybridKEM | $.VarRef<hybridKEM> | null = (() => { const __goscriptLiteralField2 = ecdh.P384(); return new hybridKEM({id: $.uint(0x0051, 16), label: "MLKEM1024-P384", curve: __goscriptLiteralField2, curveSeedSize: 48, curvePointSize: 97, pqEncapsKeySize: mlkem.EncapsulationKeySize1024, pqCiphertextSize: mlkem.CiphertextSize1024, pqNewPublicKey: $.functionValue((data: $.Slice<number>): [crypto.Encapsulator | null, $.GoError] => {
	const __goscriptReturn4 = mlkem.NewEncapsulationKey1024(data)
	return [$.interfaceValue<crypto.Encapsulator | null>(__goscriptReturn4[0], "*mlkem.EncapsulationKey1024", { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey1024" }), __goscriptReturn4[1]]
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Encapsulator", "error"] } as $.FunctionTypeInfo)), pqNewPrivateKey: $.functionValue((data: $.Slice<number>): [crypto.Decapsulator | null, $.GoError] => {
	const __goscriptReturn5 = mlkem.NewDecapsulationKey1024(data)
	return [$.interfaceValue<crypto.Decapsulator | null>(__goscriptReturn5[0], "*mlkem.DecapsulationKey1024", { kind: $.TypeKind.Pointer, elemType: "mlkem.DecapsulationKey1024" }), __goscriptReturn5[1]]
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo))}) })()

export function __goscript_set_mlkem1024P384(__goscriptValue: hybridKEM | $.VarRef<hybridKEM> | null): void {
	mlkem1024P384 = __goscriptValue
}

export function MLKEM1024P384(): __goscript_kem.KEM | null {
	return $.interfaceValue<__goscript_kem.KEM | null>(mlkem1024P384, "*hpke.hybridKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.hybridKEM" })
}

export function NewHybridPublicKey(pq: crypto.Encapsulator | null, t: ecdh.PublicKey | $.VarRef<ecdh.PublicKey> | null): [__goscript_kem.PublicKey | null, $.GoError] {
	{
		let __goscriptSwitch0 = ecdh.PublicKey.prototype.Curve.call($.pointerValue<ecdh.PublicKey>(t))
		switch (true) {
			case $.comparableEqual(__goscriptSwitch0, ecdh.X25519()):
			{
				{
					let [, ok] = $.typeAssertTuple<mlkem.EncapsulationKey768 | $.VarRef<mlkem.EncapsulationKey768> | null>(pq, { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey768" })
					if (!ok) {
						return [null, errors.New("invalid PQ KEM for X25519 hybrid")]
					}
				}
				return [$.interfaceValue<__goscript_kem.PublicKey | null>(new hybridPublicKey({kem: mlkem768X25519, t: t, pq: pq}), "*hpke.hybridPublicKey", { kind: $.TypeKind.Pointer, elemType: "hpke.hybridPublicKey" }), null]
				break
			}
			case $.comparableEqual(__goscriptSwitch0, ecdh.P256()):
			{
				{
					let [, ok] = $.typeAssertTuple<mlkem.EncapsulationKey768 | $.VarRef<mlkem.EncapsulationKey768> | null>(pq, { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey768" })
					if (!ok) {
						return [null, errors.New("invalid PQ KEM for P-256 hybrid")]
					}
				}
				return [$.interfaceValue<__goscript_kem.PublicKey | null>(new hybridPublicKey({kem: mlkem768P256, t: t, pq: pq}), "*hpke.hybridPublicKey", { kind: $.TypeKind.Pointer, elemType: "hpke.hybridPublicKey" }), null]
				break
			}
			case $.comparableEqual(__goscriptSwitch0, ecdh.P384()):
			{
				{
					let [, ok] = $.typeAssertTuple<mlkem.EncapsulationKey1024 | $.VarRef<mlkem.EncapsulationKey1024> | null>(pq, { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey1024" })
					if (!ok) {
						return [null, errors.New("invalid PQ KEM for P-384 hybrid")]
					}
				}
				return [$.interfaceValue<__goscript_kem.PublicKey | null>(new hybridPublicKey({kem: mlkem1024P384, t: t, pq: pq}), "*hpke.hybridPublicKey", { kind: $.TypeKind.Pointer, elemType: "hpke.hybridPublicKey" }), null]
				break
			}
			default:
			{
				return [null, errors.New("unsupported curve")]
				break
			}
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export let testingOnlyEncapsulate: (() => [$.Slice<number>, $.Slice<number>] | globalThis.Promise<[$.Slice<number>, $.Slice<number>]>) | null = null as (() => [$.Slice<number>, $.Slice<number>] | globalThis.Promise<[$.Slice<number>, $.Slice<number>]>) | null

export function __goscript_set_testingOnlyEncapsulate(__goscriptValue: (() => [$.Slice<number>, $.Slice<number>] | globalThis.Promise<[$.Slice<number>, $.Slice<number>]>) | null): void {
	testingOnlyEncapsulate = __goscriptValue
}

export async function NewHybridPrivateKey(pq: crypto.Decapsulator | null, t: ecdh.KeyExchanger | null): globalThis.Promise<[__goscript_kem.PrivateKey | null, $.GoError]> {
	return newHybridPrivateKey(pq, t, null)
}

export async function newHybridPrivateKey(pq: crypto.Decapsulator | null, t: ecdh.KeyExchanger | null, seed: $.Slice<number>): globalThis.Promise<[__goscript_kem.PrivateKey | null, $.GoError]> {
	{
		let __goscriptSwitch1 = await $.pointerValue<Exclude<ecdh.KeyExchanger, null>>(t).Curve()
		switch (true) {
			case $.comparableEqual(__goscriptSwitch1, ecdh.X25519()):
			{
				{
					let [, ok] = $.typeAssertTuple<mlkem.EncapsulationKey768 | $.VarRef<mlkem.EncapsulationKey768> | null>(await $.pointerValue<Exclude<crypto.Decapsulator, null>>(pq).Encapsulator(), { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey768" })
					if (!ok) {
						return [null, errors.New("invalid PQ KEM for X25519 hybrid")]
					}
				}
				return [$.interfaceValue<__goscript_kem.PrivateKey | null>((() => { const __goscriptLiteralField5 = bytes.Clone(seed); return new hybridPrivateKey({kem: mlkem768X25519, seed: __goscriptLiteralField5, t: t, pq: pq}) })(), "*hpke.hybridPrivateKey", { kind: $.TypeKind.Pointer, elemType: "hpke.hybridPrivateKey" }), null]
				break
			}
			case $.comparableEqual(__goscriptSwitch1, ecdh.P256()):
			{
				{
					let [, ok] = $.typeAssertTuple<mlkem.EncapsulationKey768 | $.VarRef<mlkem.EncapsulationKey768> | null>(await $.pointerValue<Exclude<crypto.Decapsulator, null>>(pq).Encapsulator(), { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey768" })
					if (!ok) {
						return [null, errors.New("invalid PQ KEM for P-256 hybrid")]
					}
				}
				return [$.interfaceValue<__goscript_kem.PrivateKey | null>((() => { const __goscriptLiteralField6 = bytes.Clone(seed); return new hybridPrivateKey({kem: mlkem768P256, seed: __goscriptLiteralField6, t: t, pq: pq}) })(), "*hpke.hybridPrivateKey", { kind: $.TypeKind.Pointer, elemType: "hpke.hybridPrivateKey" }), null]
				break
			}
			case $.comparableEqual(__goscriptSwitch1, ecdh.P384()):
			{
				{
					let [, ok] = $.typeAssertTuple<mlkem.EncapsulationKey1024 | $.VarRef<mlkem.EncapsulationKey1024> | null>(await $.pointerValue<Exclude<crypto.Decapsulator, null>>(pq).Encapsulator(), { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey1024" })
					if (!ok) {
						return [null, errors.New("invalid PQ KEM for P-384 hybrid")]
					}
				}
				return [$.interfaceValue<__goscript_kem.PrivateKey | null>((() => { const __goscriptLiteralField7 = bytes.Clone(seed); return new hybridPrivateKey({kem: mlkem1024P384, seed: __goscriptLiteralField7, t: t, pq: pq}) })(), "*hpke.hybridPrivateKey", { kind: $.TypeKind.Pointer, elemType: "hpke.hybridPrivateKey" }), null]
				break
			}
			default:
			{
				return [null, errors.New("unsupported curve")]
				break
			}
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export let mlkem768: mlkemKEM | $.VarRef<mlkemKEM> | null = new mlkemKEM({id: $.uint(0x0041, 16), ciphertextSize: mlkem.CiphertextSize768, newPublicKey: $.functionValue((data: $.Slice<number>): [crypto.Encapsulator | null, $.GoError] => {
	const __goscriptReturn11 = mlkem.NewEncapsulationKey768(data)
	return [$.interfaceValue<crypto.Encapsulator | null>(__goscriptReturn11[0], "*mlkem.EncapsulationKey768", { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey768" }), __goscriptReturn11[1]]
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Encapsulator", "error"] } as $.FunctionTypeInfo)), newPrivateKey: $.functionValue((data: $.Slice<number>): [crypto.Decapsulator | null, $.GoError] => {
	const __goscriptReturn12 = mlkem.NewDecapsulationKey768(data)
	return [$.interfaceValue<crypto.Decapsulator | null>(__goscriptReturn12[0], "*mlkem.DecapsulationKey768", { kind: $.TypeKind.Pointer, elemType: "mlkem.DecapsulationKey768" }), __goscriptReturn12[1]]
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo)), generateKey: $.functionValue(async (): globalThis.Promise<[crypto.Decapsulator | null, $.GoError]> => {
	const __goscriptReturn13 = await mlkem.GenerateKey768()
	return [$.interfaceValue<crypto.Decapsulator | null>(__goscriptReturn13[0], "*mlkem.DecapsulationKey768", { kind: $.TypeKind.Pointer, elemType: "mlkem.DecapsulationKey768" }), __goscriptReturn13[1]]
}, ({ kind: $.TypeKind.Function, params: [], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo))})

export function __goscript_set_mlkem768(__goscriptValue: mlkemKEM | $.VarRef<mlkemKEM> | null): void {
	mlkem768 = __goscriptValue
}

export function MLKEM768(): __goscript_kem.KEM | null {
	return $.interfaceValue<__goscript_kem.KEM | null>(mlkem768, "*hpke.mlkemKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.mlkemKEM" })
}

export let mlkem1024: mlkemKEM | $.VarRef<mlkemKEM> | null = new mlkemKEM({id: $.uint(0x0042, 16), ciphertextSize: mlkem.CiphertextSize1024, newPublicKey: $.functionValue((data: $.Slice<number>): [crypto.Encapsulator | null, $.GoError] => {
	const __goscriptReturn14 = mlkem.NewEncapsulationKey1024(data)
	return [$.interfaceValue<crypto.Encapsulator | null>(__goscriptReturn14[0], "*mlkem.EncapsulationKey1024", { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey1024" }), __goscriptReturn14[1]]
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Encapsulator", "error"] } as $.FunctionTypeInfo)), newPrivateKey: $.functionValue((data: $.Slice<number>): [crypto.Decapsulator | null, $.GoError] => {
	const __goscriptReturn15 = mlkem.NewDecapsulationKey1024(data)
	return [$.interfaceValue<crypto.Decapsulator | null>(__goscriptReturn15[0], "*mlkem.DecapsulationKey1024", { kind: $.TypeKind.Pointer, elemType: "mlkem.DecapsulationKey1024" }), __goscriptReturn15[1]]
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo)), generateKey: $.functionValue(async (): globalThis.Promise<[crypto.Decapsulator | null, $.GoError]> => {
	const __goscriptReturn16 = await mlkem.GenerateKey1024()
	return [$.interfaceValue<crypto.Decapsulator | null>(__goscriptReturn16[0], "*mlkem.DecapsulationKey1024", { kind: $.TypeKind.Pointer, elemType: "mlkem.DecapsulationKey1024" }), __goscriptReturn16[1]]
}, ({ kind: $.TypeKind.Function, params: [], results: ["crypto.Decapsulator", "error"] } as $.FunctionTypeInfo))})

export function __goscript_set_mlkem1024(__goscriptValue: mlkemKEM | $.VarRef<mlkemKEM> | null): void {
	mlkem1024 = __goscriptValue
}

export function MLKEM1024(): __goscript_kem.KEM | null {
	return $.interfaceValue<__goscript_kem.KEM | null>(mlkem1024, "*hpke.mlkemKEM", { kind: $.TypeKind.Pointer, elemType: "hpke.mlkemKEM" })
}

export function NewMLKEMPublicKey(pub: crypto.Encapsulator | null): [__goscript_kem.PublicKey | null, $.GoError] {
	{
		const __goscriptTypeSwitchValue = pub
		switch (true) {
			case $.typeAssert<mlkem.EncapsulationKey768 | $.VarRef<mlkem.EncapsulationKey768> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey768" }).ok:
				{
					return [$.interfaceValue<__goscript_kem.PublicKey | null>(new mlkemPublicKey({kem: mlkem768, pq: pub}), "*hpke.mlkemPublicKey", { kind: $.TypeKind.Pointer, elemType: "hpke.mlkemPublicKey" }), null]
				}
				break
			case $.typeAssert<mlkem.EncapsulationKey1024 | $.VarRef<mlkem.EncapsulationKey1024> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey1024" }).ok:
				{
					return [$.interfaceValue<__goscript_kem.PublicKey | null>(new mlkemPublicKey({kem: mlkem1024, pq: pub}), "*hpke.mlkemPublicKey", { kind: $.TypeKind.Pointer, elemType: "hpke.mlkemPublicKey" }), null]
				}
				break
			default:
				{
					return [null, errors.New("unsupported public key type")]
				}
				break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function NewMLKEMPrivateKey(priv: crypto.Decapsulator | null): globalThis.Promise<[__goscript_kem.PrivateKey | null, $.GoError]> {
	{
		const __goscriptTypeSwitchValue = await $.pointerValue<Exclude<crypto.Decapsulator, null>>(priv).Encapsulator()
		switch (true) {
			case $.typeAssert<mlkem.EncapsulationKey768 | $.VarRef<mlkem.EncapsulationKey768> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey768" }).ok:
				{
					return [$.interfaceValue<__goscript_kem.PrivateKey | null>(new mlkemPrivateKey({kem: mlkem768, pq: priv}), "*hpke.mlkemPrivateKey", { kind: $.TypeKind.Pointer, elemType: "hpke.mlkemPrivateKey" }), null]
				}
				break
			case $.typeAssert<mlkem.EncapsulationKey1024 | $.VarRef<mlkem.EncapsulationKey1024> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey1024" }).ok:
				{
					return [$.interfaceValue<__goscript_kem.PrivateKey | null>(new mlkemPrivateKey({kem: mlkem1024, pq: priv}), "*hpke.mlkemPrivateKey", { kind: $.TypeKind.Pointer, elemType: "hpke.mlkemPrivateKey" }), null]
				}
				break
			default:
				{
					return [null, errors.New("unsupported public key type")]
				}
				break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

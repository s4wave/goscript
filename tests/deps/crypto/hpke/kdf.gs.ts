// Generated file based on kdf.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as hkdf from "@goscript/crypto/hkdf/index.js"

import * as sha256 from "@goscript/crypto/sha256/index.js"

import * as sha3 from "@goscript/crypto/sha3/index.js"

import * as sha512 from "@goscript/crypto/sha512/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as hash2 from "@goscript/hash/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/crypto/hkdf/index.js"
import "@goscript/crypto/sha256/index.js"
import "@goscript/crypto/sha3/index.js"
import "@goscript/crypto/sha512/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/hash/index.js"
import "@goscript/internal/byteorder/index.js"

export type KDF = {
	ID(): number
	labeledDerive(suiteID: $.Slice<number>, inputKey: $.Slice<number>, label: string, context: $.Slice<number>, length: number): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	labeledExpand(suiteID: $.Slice<number>, randomKey: $.Slice<number>, label: string, info: $.Slice<number>, length: number): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	labeledExtract(suiteID: $.Slice<number>, salt: $.Slice<number>, label: string, inputKey: $.Slice<number>): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	oneStage(): boolean
	size(): number
}

$.registerInterfaceType(
	"hpke.KDF",
	null,
	[{ name: "ID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "labeledDerive", args: [{ name: "suiteID", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "inputKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "label", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "context", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "length", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "labeledExpand", args: [{ name: "suiteID", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "randomKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "label", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "info", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "length", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "labeledExtract", args: [{ name: "suiteID", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "salt", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "label", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "inputKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "oneStage", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export class hkdfKDF {
	public get hash(): (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null {
		return this._fields.hash.value
	}
	public set hash(value: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null) {
		this._fields.hash.value = value
	}

	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	public get nH(): number {
		return this._fields.nH.value
	}
	public set nH(value: number) {
		this._fields.nH.value = value
	}

	public _fields: {
		hash: $.VarRef<(() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null>
		id: $.VarRef<number>
		nH: $.VarRef<number>
	}

	constructor(init?: Partial<{hash?: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null, id?: number, nH?: number}>) {
		this._fields = {
			hash: $.varRef(init?.hash ?? (null as (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null)),
			id: $.varRef(init?.id ?? (0 as number)),
			nH: $.varRef(init?.nH ?? (0 as number))
		}
	}

	public clone(): hkdfKDF {
		const cloned = new hkdfKDF()
		cloned._fields = {
			hash: $.varRef(this._fields.hash.value),
			id: $.varRef(this._fields.id.value),
			nH: $.varRef(this._fields.nH.value)
		}
		return $.markAsStructValue(cloned)
	}

	public ID(): number {
		const kdf: hkdfKDF | $.VarRef<hkdfKDF> | null = this
		return $.uint($.pointerValue<hkdfKDF>(kdf).id, 16)
	}

	public labeledDerive(_p0: $.Slice<number>, _p1: $.Slice<number>, _p2: string, _p3: $.Slice<number>, _p4: number): [$.Slice<number>, $.GoError] {
		const kdf: hkdfKDF | $.VarRef<hkdfKDF> | null = this
		return [null, errors.New("hpke: internal error: labeledDerive called on two-stage KDF")]
	}

	public async labeledExpand(suiteID: $.Slice<number>, randomKey: $.Slice<number>, label: string, info: $.Slice<number>, length: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const kdf: hkdfKDF | $.VarRef<hkdfKDF> | null = this
		let labeledInfo: $.Slice<number> = $.makeSlice<number>(0, (((2 + 7) + $.len(suiteID)) + $.len(label)) + $.len(info), "byte")
		labeledInfo = byteorder.BEAppendUint16(labeledInfo, $.uint(length, 16))
		labeledInfo = $.appendSlice(labeledInfo, new Uint8Array([72, 80, 75, 69, 45, 118, 49]), $.byteSliceHint)
		labeledInfo = $.appendSlice(labeledInfo, suiteID, $.byteSliceHint)
		labeledInfo = $.appendSlice(labeledInfo, $.stringToBytes(label), $.byteSliceHint)
		labeledInfo = $.appendSlice(labeledInfo, info, $.byteSliceHint)
		return hkdf.Expand(undefined, $.pointerValue<hkdfKDF>(kdf).hash, randomKey, $.bytesToString(labeledInfo), $.int(length))
	}

	public async labeledExtract(suiteID: $.Slice<number>, salt: $.Slice<number>, label: string, inputKey: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const kdf: hkdfKDF | $.VarRef<hkdfKDF> | null = this
		let labeledIKM: $.Slice<number> = $.makeSlice<number>(0, ((7 + $.len(suiteID)) + $.len(label)) + $.len(inputKey), "byte")
		labeledIKM = $.appendSlice(labeledIKM, new Uint8Array([72, 80, 75, 69, 45, 118, 49]), $.byteSliceHint)
		labeledIKM = $.appendSlice(labeledIKM, suiteID, $.byteSliceHint)
		labeledIKM = $.appendSlice(labeledIKM, $.stringToBytes(label), $.byteSliceHint)
		labeledIKM = $.appendSlice(labeledIKM, inputKey, $.byteSliceHint)
		return hkdf.Extract(undefined, $.pointerValue<hkdfKDF>(kdf).hash, labeledIKM, salt)
	}

	public oneStage(): boolean {
		const kdf: hkdfKDF | $.VarRef<hkdfKDF> | null = this
		return false
	}

	public size(): number {
		const kdf: hkdfKDF | $.VarRef<hkdfKDF> | null = this
		return $.pointerValue<hkdfKDF>(kdf).nH
	}

	static __typeInfo = $.registerStructType(
		"hpke.hkdfKDF",
		() => new hkdfKDF(),
		[{ name: "ID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "labeledDerive", args: [{ name: "_", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "labeledExpand", args: [{ name: "suiteID", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "randomKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "label", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "info", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "length", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "labeledExtract", args: [{ name: "suiteID", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "salt", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "label", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "inputKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "oneStage", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		hkdfKDF,
		[{ name: "hash", key: "hash", type: ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo), pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/hpke", index: [1], offset: 8, exported: false }, { name: "nH", key: "nH", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/hpke", index: [2], offset: 16, exported: false }]
	)
}

export class shakeKDF {
	public get hash(): (() => sha3.SHAKE | $.VarRef<sha3.SHAKE> | null | globalThis.Promise<sha3.SHAKE | $.VarRef<sha3.SHAKE> | null>) | null {
		return this._fields.hash.value
	}
	public set hash(value: (() => sha3.SHAKE | $.VarRef<sha3.SHAKE> | null | globalThis.Promise<sha3.SHAKE | $.VarRef<sha3.SHAKE> | null>) | null) {
		this._fields.hash.value = value
	}

	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	public get nH(): number {
		return this._fields.nH.value
	}
	public set nH(value: number) {
		this._fields.nH.value = value
	}

	public _fields: {
		hash: $.VarRef<(() => sha3.SHAKE | $.VarRef<sha3.SHAKE> | null | globalThis.Promise<sha3.SHAKE | $.VarRef<sha3.SHAKE> | null>) | null>
		id: $.VarRef<number>
		nH: $.VarRef<number>
	}

	constructor(init?: Partial<{hash?: (() => sha3.SHAKE | $.VarRef<sha3.SHAKE> | null | globalThis.Promise<sha3.SHAKE | $.VarRef<sha3.SHAKE> | null>) | null, id?: number, nH?: number}>) {
		this._fields = {
			hash: $.varRef(init?.hash ?? (null as (() => sha3.SHAKE | $.VarRef<sha3.SHAKE> | null | globalThis.Promise<sha3.SHAKE | $.VarRef<sha3.SHAKE> | null>) | null)),
			id: $.varRef(init?.id ?? (0 as number)),
			nH: $.varRef(init?.nH ?? (0 as number))
		}
	}

	public clone(): shakeKDF {
		const cloned = new shakeKDF()
		cloned._fields = {
			hash: $.varRef(this._fields.hash.value),
			id: $.varRef(this._fields.id.value),
			nH: $.varRef(this._fields.nH.value)
		}
		return $.markAsStructValue(cloned)
	}

	public ID(): number {
		const kdf: shakeKDF | $.VarRef<shakeKDF> | null = this
		return $.uint($.pointerValue<shakeKDF>(kdf).id, 16)
	}

	public async labeledDerive(suiteID: $.Slice<number>, inputKey: $.Slice<number>, label: string, context: $.Slice<number>, length: number): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const kdf: shakeKDF | $.VarRef<shakeKDF> | null = this
		let H: sha3.SHAKE | $.VarRef<sha3.SHAKE> | null = await $.pointerValue<shakeKDF>(kdf).hash!()
		sha3.SHAKE.prototype.Write.call(H, inputKey)
		sha3.SHAKE.prototype.Write.call(H, new Uint8Array([72, 80, 75, 69, 45, 118, 49]))
		sha3.SHAKE.prototype.Write.call(H, suiteID)
		sha3.SHAKE.prototype.Write.call(H, new Uint8Array([$.uint($.len(label) >> 8, 8), $.uint($.len(label), 8)]) as $.Slice<number>)
		sha3.SHAKE.prototype.Write.call(H, $.stringToBytes(label))
		sha3.SHAKE.prototype.Write.call(H, new Uint8Array([$.uint($.uintShr(length, 8, 16), 8), $.uint(length, 8)]) as $.Slice<number>)
		sha3.SHAKE.prototype.Write.call(H, context)
		let out: $.Slice<number> = $.makeSlice<number>(length, undefined, "byte")
		sha3.SHAKE.prototype.Read.call(H, out)
		return [out, null]
	}

	public labeledExpand(_p0: $.Slice<number>, _p1: $.Slice<number>, _p2: string, _p3: $.Slice<number>, _p4: number): [$.Slice<number>, $.GoError] {
		const kdf: shakeKDF | $.VarRef<shakeKDF> | null = this
		return [null, errors.New("hpke: internal error: labeledExpand called on one-stage KDF")]
	}

	public labeledExtract(_p0: $.Slice<number>, _p1: $.Slice<number>, _p2: string, _p3: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const kdf: shakeKDF | $.VarRef<shakeKDF> | null = this
		return [null, errors.New("hpke: internal error: labeledExtract called on one-stage KDF")]
	}

	public oneStage(): boolean {
		const kdf: shakeKDF | $.VarRef<shakeKDF> | null = this
		return true
	}

	public size(): number {
		const kdf: shakeKDF | $.VarRef<shakeKDF> | null = this
		return $.pointerValue<shakeKDF>(kdf).nH
	}

	static __typeInfo = $.registerStructType(
		"hpke.shakeKDF",
		() => new shakeKDF(),
		[{ name: "ID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "labeledDerive", args: [{ name: "suiteID", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "inputKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "label", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "context", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "length", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "labeledExpand", args: [{ name: "_", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_", type: { kind: $.TypeKind.Basic, name: "uint16" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "labeledExtract", args: [{ name: "_", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "_", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "oneStage", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		shakeKDF,
		[{ name: "hash", key: "hash", type: ({ kind: $.TypeKind.Function, params: [], results: [{ kind: $.TypeKind.Pointer, elemType: "sha3.SHAKE" }] } as $.FunctionTypeInfo), pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/hpke", index: [1], offset: 8, exported: false }, { name: "nH", key: "nH", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/hpke", index: [2], offset: 16, exported: false }]
	)
}

export function NewKDF(id: number): [KDF | null, $.GoError] {
	switch (id) {
		case 0x0001:
		{
			return [HKDFSHA256(), null]
			break
		}
		case 0x0002:
		{
			return [HKDFSHA384(), null]
			break
		}
		case 0x0003:
		{
			return [HKDFSHA512(), null]
			break
		}
		case 0x0010:
		{
			return [SHAKE128(), null]
			break
		}
		case 0x0011:
		{
			return [SHAKE256(), null]
			break
		}
		default:
		{
			return [null, fmt.Errorf("unsupported KDF %04x", $.namedValueInterfaceValue<any>(id, "uint16", {}, { kind: $.TypeKind.Basic, name: "uint16" }))]
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function HKDFSHA256(): KDF | null {
	return $.interfaceValue<KDF | null>(__goscript_get_hkdfSHA256(), "*hpke.hkdfKDF", { kind: $.TypeKind.Pointer, elemType: "hpke.hkdfKDF" })
}

export function HKDFSHA384(): KDF | null {
	return $.interfaceValue<KDF | null>(__goscript_get_hkdfSHA384(), "*hpke.hkdfKDF", { kind: $.TypeKind.Pointer, elemType: "hpke.hkdfKDF" })
}

export function HKDFSHA512(): KDF | null {
	return $.interfaceValue<KDF | null>(__goscript_get_hkdfSHA512(), "*hpke.hkdfKDF", { kind: $.TypeKind.Pointer, elemType: "hpke.hkdfKDF" })
}

export var hkdfSHA256: hkdfKDF | $.VarRef<hkdfKDF> | null

export function __goscript_init_hkdfSHA256(): void {
	if (((hkdfSHA256) as any) === undefined) {
		hkdfSHA256 = new hkdfKDF({hash: sha256.New, id: $.uint(0x0001, 16), nH: sha256.Size})
	}
}

export function __goscript_get_hkdfSHA256(): hkdfKDF | $.VarRef<hkdfKDF> | null {
	if (((hkdfSHA256) as any) === undefined) {
		__goscript_init_hkdfSHA256()
	}
	return hkdfSHA256
}

export function __goscript_set_hkdfSHA256(__goscriptValue: hkdfKDF | $.VarRef<hkdfKDF> | null): void {
	hkdfSHA256 = __goscriptValue
}

export var hkdfSHA384: hkdfKDF | $.VarRef<hkdfKDF> | null

export function __goscript_init_hkdfSHA384(): void {
	if (((hkdfSHA384) as any) === undefined) {
		hkdfSHA384 = new hkdfKDF({hash: sha512.New384, id: $.uint(0x0002, 16), nH: sha512.Size384})
	}
}

export function __goscript_get_hkdfSHA384(): hkdfKDF | $.VarRef<hkdfKDF> | null {
	if (((hkdfSHA384) as any) === undefined) {
		__goscript_init_hkdfSHA384()
	}
	return hkdfSHA384
}

export function __goscript_set_hkdfSHA384(__goscriptValue: hkdfKDF | $.VarRef<hkdfKDF> | null): void {
	hkdfSHA384 = __goscriptValue
}

export var hkdfSHA512: hkdfKDF | $.VarRef<hkdfKDF> | null

export function __goscript_init_hkdfSHA512(): void {
	if (((hkdfSHA512) as any) === undefined) {
		hkdfSHA512 = new hkdfKDF({hash: sha512.New, id: $.uint(0x0003, 16), nH: sha512.Size})
	}
}

export function __goscript_get_hkdfSHA512(): hkdfKDF | $.VarRef<hkdfKDF> | null {
	if (((hkdfSHA512) as any) === undefined) {
		__goscript_init_hkdfSHA512()
	}
	return hkdfSHA512
}

export function __goscript_set_hkdfSHA512(__goscriptValue: hkdfKDF | $.VarRef<hkdfKDF> | null): void {
	hkdfSHA512 = __goscriptValue
}

export function SHAKE128(): KDF | null {
	return $.interfaceValue<KDF | null>(shake128KDF, "*hpke.shakeKDF", { kind: $.TypeKind.Pointer, elemType: "hpke.shakeKDF" })
}

export function SHAKE256(): KDF | null {
	return $.interfaceValue<KDF | null>(shake256KDF, "*hpke.shakeKDF", { kind: $.TypeKind.Pointer, elemType: "hpke.shakeKDF" })
}

export let shake128KDF: shakeKDF | $.VarRef<shakeKDF> | null = new shakeKDF({hash: sha3.NewSHAKE128, id: $.uint(0x0010, 16), nH: 32})

export function __goscript_set_shake128KDF(__goscriptValue: shakeKDF | $.VarRef<shakeKDF> | null): void {
	shake128KDF = __goscriptValue
}

export let shake256KDF: shakeKDF | $.VarRef<shakeKDF> | null = new shakeKDF({hash: sha3.NewSHAKE256, id: $.uint(0x0011, 16), nH: 64})

export function __goscript_set_shake256KDF(__goscriptValue: shakeKDF | $.VarRef<shakeKDF> | null): void {
	shake256KDF = __goscriptValue
}

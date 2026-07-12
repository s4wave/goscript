// Generated file based on aead.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as cipher from "@goscript/crypto/cipher/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as chacha20poly1305 from "@goscript/vendor/golang.org/x/crypto/chacha20poly1305/index.js"

import * as __goscript_aead_fips140v1_26 from "./aead_fips140v1.26.gs.ts"
import "@goscript/crypto/cipher/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/vendor/golang.org/x/crypto/chacha20poly1305/index.js"
import "./aead_fips140v1.26.gs.ts"

export type AEAD = {
	ID(): number
	aead(key: $.Slice<number>): [cipher.AEAD | null, $.GoError] | globalThis.Promise<[cipher.AEAD | null, $.GoError]>
	keySize(): number
	nonceSize(): number
}

$.registerInterfaceType(
	"hpke.AEAD",
	null,
	[{ name: "ID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "aead", args: [{ name: "key", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "cipher.AEAD" }, { name: "_r1", type: "error" }] }, { name: "keySize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "nonceSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export class aead {
	public get nK(): number {
		return this._fields.nK.value
	}
	public set nK(value: number) {
		this._fields.nK.value = value
	}

	public get nN(): number {
		return this._fields.nN.value
	}
	public set nN(value: number) {
		this._fields.nN.value = value
	}

	public get _new(): ((_p0: $.Slice<number>) => [cipher.AEAD | null, $.GoError] | globalThis.Promise<[cipher.AEAD | null, $.GoError]>) | null {
		return this._fields._new.value
	}
	public set _new(value: ((_p0: $.Slice<number>) => [cipher.AEAD | null, $.GoError] | globalThis.Promise<[cipher.AEAD | null, $.GoError]>) | null) {
		this._fields._new.value = value
	}

	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	public _fields: {
		nK: $.VarRef<number>
		nN: $.VarRef<number>
		_new: $.VarRef<((_p0: $.Slice<number>) => [cipher.AEAD | null, $.GoError] | globalThis.Promise<[cipher.AEAD | null, $.GoError]>) | null>
		id: $.VarRef<number>
	}

	constructor(init?: Partial<{nK?: number, nN?: number, _new?: ((_p0: $.Slice<number>) => [cipher.AEAD | null, $.GoError] | globalThis.Promise<[cipher.AEAD | null, $.GoError]>) | null, id?: number}>) {
		this._fields = {
			nK: $.varRef(init?.nK ?? (0 as number)),
			nN: $.varRef(init?.nN ?? (0 as number)),
			_new: $.varRef(init?._new ?? (null as ((_p0: $.Slice<number>) => [cipher.AEAD | null, $.GoError] | globalThis.Promise<[cipher.AEAD | null, $.GoError]>) | null)),
			id: $.varRef(init?.id ?? (0 as number))
		}
	}

	public clone(): aead {
		const cloned = new aead()
		cloned._fields = {
			nK: $.varRef(this._fields.nK.value),
			nN: $.varRef(this._fields.nN.value),
			_new: $.varRef(this._fields._new.value),
			id: $.varRef(this._fields.id.value)
		}
		return $.markAsStructValue(cloned)
	}

	public ID(): number {
		const a: aead | $.VarRef<aead> | null = this
		return $.uint($.pointerValue<aead>(a).id, 16)
	}

	public async aead(key: $.Slice<number>): globalThis.Promise<[cipher.AEAD | null, $.GoError]> {
		const a: aead | $.VarRef<aead> | null = this
		if ($.len(key) != $.pointerValue<aead>(a).nK) {
			return [null, errors.New("invalid key size")]
		}
		return $.pointerValue<aead>(a)._new!(key)
	}

	public keySize(): number {
		const a: aead | $.VarRef<aead> | null = this
		return $.pointerValue<aead>(a).nK
	}

	public nonceSize(): number {
		const a: aead | $.VarRef<aead> | null = this
		return $.pointerValue<aead>(a).nN
	}

	static __typeInfo = $.registerStructType(
		"hpke.aead",
		() => new aead(),
		[{ name: "ID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "aead", args: [{ name: "key", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "cipher.AEAD" }, { name: "_r1", type: "error" }] }, { name: "keySize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "nonceSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		aead,
		[{ name: "nK", key: "nK", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/hpke", index: [0], offset: 0, exported: false }, { name: "nN", key: "nN", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/hpke", index: [1], offset: 8, exported: false }, { name: "new", key: "_new", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["cipher.AEAD", "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/hpke", index: [2], offset: 16, exported: false }, { name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/hpke", index: [3], offset: 24, exported: false }]
	)
}

export class exportOnlyAEAD {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): exportOnlyAEAD {
		const cloned = new exportOnlyAEAD()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public ID(): number {
		return $.uint(0xFFFF, 16)
	}

	public aead(key: $.Slice<number>): [cipher.AEAD | null, $.GoError] {
		return [null, null]
	}

	public keySize(): number {
		return 0
	}

	public nonceSize(): number {
		return 0
	}

	static __typeInfo = $.registerStructType(
		"hpke.exportOnlyAEAD",
		() => new exportOnlyAEAD(),
		[{ name: "ID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint16" } }] }, { name: "aead", args: [{ name: "key", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "cipher.AEAD" }, { name: "_r1", type: "error" }] }, { name: "keySize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "nonceSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		exportOnlyAEAD,
		[]
	)
}

export function NewAEAD(id: number): [AEAD | null, $.GoError] {
	switch (id) {
		case 0x0001:
		{
			return [AES128GCM(), null]
			break
		}
		case 0x0002:
		{
			return [AES256GCM(), null]
			break
		}
		case 0x0003:
		{
			return [ChaCha20Poly1305(), null]
			break
		}
		case 0xFFFF:
		{
			return [ExportOnly(), null]
			break
		}
		default:
		{
			return [null, fmt.Errorf("unsupported AEAD %04x", $.namedValueInterfaceValue<any>(id, "uint16", {}, { kind: $.TypeKind.Basic, name: "uint16" }))]
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function AES128GCM(): AEAD | null {
	return $.interfaceValue<AEAD | null>(__goscript_get_aes128GCM(), "*hpke.aead", { kind: $.TypeKind.Pointer, elemType: "hpke.aead" })
}

export function AES256GCM(): AEAD | null {
	return $.interfaceValue<AEAD | null>(__goscript_get_aes256GCM(), "*hpke.aead", { kind: $.TypeKind.Pointer, elemType: "hpke.aead" })
}

export function ChaCha20Poly1305(): AEAD | null {
	return $.interfaceValue<AEAD | null>(chacha20poly1305AEAD, "*hpke.aead", { kind: $.TypeKind.Pointer, elemType: "hpke.aead" })
}

export function ExportOnly(): AEAD | null {
	return $.interfaceValue<AEAD | null>($.markAsStructValue(new exportOnlyAEAD()), "hpke.exportOnlyAEAD", "hpke.exportOnlyAEAD")
}

export var aes128GCM: aead | $.VarRef<aead> | null

export function __goscript_init_aes128GCM(): void {
	if (((aes128GCM) as any) === undefined) {
		aes128GCM = new aead({nK: Math.trunc(128 / 8), nN: Math.trunc(96 / 8), _new: __goscript_aead_fips140v1_26.newAESGCM, id: $.uint(0x0001, 16)})
	}
}

export function __goscript_get_aes128GCM(): aead | $.VarRef<aead> | null {
	if (((aes128GCM) as any) === undefined) {
		__goscript_init_aes128GCM()
	}
	return aes128GCM
}

export function __goscript_set_aes128GCM(__goscriptValue: aead | $.VarRef<aead> | null): void {
	aes128GCM = __goscriptValue
}

export var aes256GCM: aead | $.VarRef<aead> | null

export function __goscript_init_aes256GCM(): void {
	if (((aes256GCM) as any) === undefined) {
		aes256GCM = new aead({nK: Math.trunc(256 / 8), nN: Math.trunc(96 / 8), _new: __goscript_aead_fips140v1_26.newAESGCM, id: $.uint(0x0002, 16)})
	}
}

export function __goscript_get_aes256GCM(): aead | $.VarRef<aead> | null {
	if (((aes256GCM) as any) === undefined) {
		__goscript_init_aes256GCM()
	}
	return aes256GCM
}

export function __goscript_set_aes256GCM(__goscriptValue: aead | $.VarRef<aead> | null): void {
	aes256GCM = __goscriptValue
}

export let chacha20poly1305AEAD: aead | $.VarRef<aead> | null = new aead({nK: chacha20poly1305.KeySize, nN: chacha20poly1305.NonceSize, _new: chacha20poly1305.New, id: $.uint(0x0003, 16)})

export function __goscript_set_chacha20poly1305AEAD(__goscriptValue: aead | $.VarRef<aead> | null): void {
	chacha20poly1305AEAD = __goscriptValue
}

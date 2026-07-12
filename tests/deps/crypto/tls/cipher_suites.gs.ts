// Generated file based on cipher_suites.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as aes2 from "@goscript/crypto/aes/index.js"

import * as cipher2 from "@goscript/crypto/cipher/index.js"

import * as des from "@goscript/crypto/des/index.js"

import * as hmac from "@goscript/crypto/hmac/index.js"

import * as boring from "@goscript/crypto/internal/boring/index.js"

import * as fipsaes from "@goscript/crypto/internal/fips140/aes/index.js"

import * as gcm from "@goscript/crypto/internal/fips140/aes/gcm/index.js"

import * as rc4 from "@goscript/crypto/rc4/index.js"

import * as sha1 from "@goscript/crypto/sha1/index.js"

import * as sha256 from "@goscript/crypto/sha256/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as hash2 from "@goscript/hash/index.js"

import * as cpu from "@goscript/internal/cpu/index.js"

import * as runtime from "@goscript/runtime/index.js"

import "@goscript/unsafe/index.js"

import * as chacha20poly1305 from "@goscript/vendor/golang.org/x/crypto/chacha20poly1305/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as fips140 from "@goscript/crypto/fips140/index.js"

import * as tls13 from "@goscript/crypto/internal/fips140/tls13/index.js"

import * as mlkem from "@goscript/crypto/mlkem/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as context2 from "@goscript/context/index.js"

import * as x509 from "@goscript/crypto/x509/index.js"

import * as net from "@goscript/net/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"

import * as __goscript_handshake_messages from "./handshake_messages.gs.ts"

import * as __goscript_key_agreement from "./key_agreement.gs.ts"

import * as __goscript_key_schedule from "./key_schedule.gs.ts"

import * as __goscript_ticket from "./ticket.gs.ts"
import "@goscript/crypto/index.js"
import "@goscript/crypto/aes/index.js"
import "@goscript/crypto/cipher/index.js"
import "@goscript/crypto/des/index.js"
import "@goscript/crypto/hmac/index.js"
import "@goscript/crypto/internal/boring/index.js"
import "@goscript/crypto/internal/fips140/aes/index.js"
import "@goscript/crypto/internal/fips140/aes/gcm/index.js"
import "@goscript/crypto/rc4/index.js"
import "@goscript/crypto/sha1/index.js"
import "@goscript/crypto/sha256/index.js"
import "@goscript/fmt/index.js"
import "@goscript/hash/index.js"
import "@goscript/internal/cpu/index.js"
import "@goscript/runtime/index.js"
import "@goscript/vendor/golang.org/x/crypto/chacha20poly1305/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/crypto/fips140/index.js"
import "@goscript/crypto/internal/fips140/tls13/index.js"
import "@goscript/crypto/mlkem/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/context/index.js"
import "@goscript/crypto/x509/index.js"
import "@goscript/net/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./common.gs.ts"
import "./common_string.gs.ts"
import "./handshake_messages.gs.ts"
import "./key_agreement.gs.ts"
import "./key_schedule.gs.ts"
import "./ticket.gs.ts"

export type aead = {
	NonceSize(): number | globalThis.Promise<number>
	Open(dst: $.Slice<number>, nonce: $.Slice<number>, ciphertext: $.Slice<number>, additionalData: $.Slice<number>): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	Overhead(): number | globalThis.Promise<number>
	Seal(dst: $.Slice<number>, nonce: $.Slice<number>, plaintext: $.Slice<number>, additionalData: $.Slice<number>): $.Slice<number> | globalThis.Promise<$.Slice<number>>
	explicitNonceLen(): number
}

$.registerInterfaceType(
	"tls.aead",
	null,
	[{ name: "NonceSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Open", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "additionalData", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Overhead", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Seal", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "plaintext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "additionalData", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "explicitNonceLen", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export type constantTimeHash = {
	BlockSize(): number | globalThis.Promise<number>
	ConstantTimeSum(b: $.Slice<number>): $.Slice<number> | globalThis.Promise<$.Slice<number>>
	Reset(): void
	Size(): number | globalThis.Promise<number>
	Sum(b: $.Slice<number>): $.Slice<number> | globalThis.Promise<$.Slice<number>>
	Write(p: $.Slice<number>): [number, $.GoError] | globalThis.Promise<[number, $.GoError]>
}

$.registerInterfaceType(
	"tls.constantTimeHash",
	null,
	[{ name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "ConstantTimeSum", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Reset", args: [], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Sum", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }]
);

export class CipherSuite {
	public get ID(): number {
		return this._fields.ID.value
	}
	public set ID(value: number) {
		this._fields.ID.value = value
	}

	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	// Supported versions is the list of TLS protocol versions that can
	// negotiate this cipher suite.
	public get SupportedVersions(): $.Slice<number> {
		return this._fields.SupportedVersions.value
	}
	public set SupportedVersions(value: $.Slice<number>) {
		this._fields.SupportedVersions.value = value
	}

	// Insecure is true if the cipher suite has known security issues
	// due to its primitives, design, or implementation.
	public get Insecure(): boolean {
		return this._fields.Insecure.value
	}
	public set Insecure(value: boolean) {
		this._fields.Insecure.value = value
	}

	public _fields: {
		ID: $.VarRef<number>
		Name: $.VarRef<string>
		SupportedVersions: $.VarRef<$.Slice<number>>
		Insecure: $.VarRef<boolean>
	}

	constructor(init?: Partial<{ID?: number, Name?: string, SupportedVersions?: $.Slice<number>, Insecure?: boolean}>) {
		this._fields = {
			ID: $.varRef(init?.ID ?? (0 as number)),
			Name: $.varRef(init?.Name ?? ("" as string)),
			SupportedVersions: $.varRef(init?.SupportedVersions ?? (null as $.Slice<number>)),
			Insecure: $.varRef(init?.Insecure ?? (false as boolean))
		}
	}

	public clone(): CipherSuite {
		const cloned = new CipherSuite()
		cloned._fields = {
			ID: $.varRef(this._fields.ID.value),
			Name: $.varRef(this._fields.Name.value),
			SupportedVersions: $.varRef(this._fields.SupportedVersions.value),
			Insecure: $.varRef(this._fields.Insecure.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.CipherSuite",
		() => new CipherSuite(),
		[],
		CipherSuite,
		[{ name: "ID", key: "ID", type: { kind: $.TypeKind.Basic, name: "uint16" }, index: [0], offset: 0, exported: true }, { name: "Name", key: "Name", type: { kind: $.TypeKind.Basic, name: "string" }, index: [1], offset: 8, exported: true }, { name: "SupportedVersions", key: "SupportedVersions", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint16" } }, index: [2], offset: 24, exported: true }, { name: "Insecure", key: "Insecure", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [3], offset: 48, exported: true }]
	)
}

export class cipherSuite {
	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	// the lengths, in bytes, of the key material needed for each component.
	public get keyLen(): number {
		return this._fields.keyLen.value
	}
	public set keyLen(value: number) {
		this._fields.keyLen.value = value
	}

	public get macLen(): number {
		return this._fields.macLen.value
	}
	public set macLen(value: number) {
		this._fields.macLen.value = value
	}

	public get ivLen(): number {
		return this._fields.ivLen.value
	}
	public set ivLen(value: number) {
		this._fields.ivLen.value = value
	}

	public get ka(): ((version: number) => __goscript_key_agreement.keyAgreement | null | globalThis.Promise<__goscript_key_agreement.keyAgreement | null>) | null {
		return this._fields.ka.value
	}
	public set ka(value: ((version: number) => __goscript_key_agreement.keyAgreement | null | globalThis.Promise<__goscript_key_agreement.keyAgreement | null>) | null) {
		this._fields.ka.value = value
	}

	// flags is a bitmask of the suite* values, above.
	public get flags(): number {
		return this._fields.flags.value
	}
	public set flags(value: number) {
		this._fields.flags.value = value
	}

	public get cipher(): ((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null {
		return this._fields.cipher.value
	}
	public set cipher(value: ((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null) {
		this._fields.cipher.value = value
	}

	public get mac(): ((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null {
		return this._fields.mac.value
	}
	public set mac(value: ((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null) {
		this._fields.mac.value = value
	}

	public get aead(): ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null {
		return this._fields.aead.value
	}
	public set aead(value: ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null) {
		this._fields.aead.value = value
	}

	public _fields: {
		id: $.VarRef<number>
		keyLen: $.VarRef<number>
		macLen: $.VarRef<number>
		ivLen: $.VarRef<number>
		ka: $.VarRef<((version: number) => __goscript_key_agreement.keyAgreement | null | globalThis.Promise<__goscript_key_agreement.keyAgreement | null>) | null>
		flags: $.VarRef<number>
		cipher: $.VarRef<((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null>
		mac: $.VarRef<((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null>
		aead: $.VarRef<((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null>
	}

	constructor(init?: Partial<{id?: number, keyLen?: number, macLen?: number, ivLen?: number, ka?: ((version: number) => __goscript_key_agreement.keyAgreement | null | globalThis.Promise<__goscript_key_agreement.keyAgreement | null>) | null, flags?: number, cipher?: ((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null, mac?: ((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null, aead?: ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null}>) {
		this._fields = {
			id: $.varRef(init?.id ?? (0 as number)),
			keyLen: $.varRef(init?.keyLen ?? (0 as number)),
			macLen: $.varRef(init?.macLen ?? (0 as number)),
			ivLen: $.varRef(init?.ivLen ?? (0 as number)),
			ka: $.varRef(init?.ka ?? (null as ((version: number) => __goscript_key_agreement.keyAgreement | null | globalThis.Promise<__goscript_key_agreement.keyAgreement | null>) | null)),
			flags: $.varRef(init?.flags ?? (0 as number)),
			cipher: $.varRef(init?.cipher ?? (null as ((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null)),
			mac: $.varRef(init?.mac ?? (null as ((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null)),
			aead: $.varRef(init?.aead ?? (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null))
		}
	}

	public clone(): cipherSuite {
		const cloned = new cipherSuite()
		cloned._fields = {
			id: $.varRef(this._fields.id.value),
			keyLen: $.varRef(this._fields.keyLen.value),
			macLen: $.varRef(this._fields.macLen.value),
			ivLen: $.varRef(this._fields.ivLen.value),
			ka: $.varRef(this._fields.ka.value),
			flags: $.varRef(this._fields.flags.value),
			cipher: $.varRef(this._fields.cipher.value),
			mac: $.varRef(this._fields.mac.value),
			aead: $.varRef(this._fields.aead.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"tls.cipherSuite",
		() => new cipherSuite(),
		[],
		cipherSuite,
		[{ name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "keyLen", key: "keyLen", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }, { name: "macLen", key: "macLen", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/tls", index: [2], offset: 16, exported: false }, { name: "ivLen", key: "ivLen", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/tls", index: [3], offset: 24, exported: false }, { name: "ka", key: "ka", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16" }], results: ["tls.keyAgreement"] } as $.FunctionTypeInfo), pkgPath: "crypto/tls", index: [4], offset: 32, exported: false }, { name: "flags", key: "flags", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/tls", index: [5], offset: 40, exported: false }, { name: "cipher", key: "cipher", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Basic, name: "bool" }], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo), pkgPath: "crypto/tls", index: [6], offset: 48, exported: false }, { name: "mac", key: "mac", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["hash.Hash"] } as $.FunctionTypeInfo), pkgPath: "crypto/tls", index: [7], offset: 56, exported: false }, { name: "aead", key: "aead", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["tls.aead"] } as $.FunctionTypeInfo), pkgPath: "crypto/tls", index: [8], offset: 64, exported: false }]
	)
}

export class cipherSuiteTLS13 {
	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	public get keyLen(): number {
		return this._fields.keyLen.value
	}
	public set keyLen(value: number) {
		this._fields.keyLen.value = value
	}

	public get aead(): ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null {
		return this._fields.aead.value
	}
	public set aead(value: ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null) {
		this._fields.aead.value = value
	}

	public get hash(): crypto.Hash {
		return this._fields.hash.value
	}
	public set hash(value: crypto.Hash) {
		this._fields.hash.value = value
	}

	public _fields: {
		id: $.VarRef<number>
		keyLen: $.VarRef<number>
		aead: $.VarRef<((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null>
		hash: $.VarRef<crypto.Hash>
	}

	constructor(init?: Partial<{id?: number, keyLen?: number, aead?: ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null, hash?: crypto.Hash}>) {
		this._fields = {
			id: $.varRef(init?.id ?? (0 as number)),
			keyLen: $.varRef(init?.keyLen ?? (0 as number)),
			aead: $.varRef(init?.aead ?? (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)),
			hash: $.varRef(init?.hash ?? (0 as crypto.Hash))
		}
	}

	public clone(): cipherSuiteTLS13 {
		const cloned = new cipherSuiteTLS13()
		cloned._fields = {
			id: $.varRef(this._fields.id.value),
			keyLen: $.varRef(this._fields.keyLen.value),
			aead: $.varRef(this._fields.aead.value),
			hash: $.varRef(this._fields.hash.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async exportKeyingMaterial(s: tls13.MasterSecret | $.VarRef<tls13.MasterSecret> | null, transcript: hash2.Hash | null): globalThis.Promise<((_p0: string, _p1: $.Slice<number>, _p2: number) => [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>) | null> {
		const c: cipherSuiteTLS13 | $.VarRef<cipherSuiteTLS13> | null = this
		let expMasterSecret: tls13.ExporterMasterSecret | $.VarRef<tls13.ExporterMasterSecret> | null = await tls13.MasterSecret.prototype.ExporterMasterSecret.call(s, transcript)
		return $.functionValue(async (label: string, context: $.Slice<number>, length: number): globalThis.Promise<[$.Slice<number>, $.GoError]> => {
			return [await tls13.ExporterMasterSecret.prototype.Exporter.call(expMasterSecret, label, context, length), null]
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo))
	}

	public async finishedHash(baseKey: $.Slice<number>, transcript: hash2.Hash | null): globalThis.Promise<$.Slice<number>> {
		const c: cipherSuiteTLS13 | $.VarRef<cipherSuiteTLS13> | null = this
		let finishedKey: $.Slice<number> = await tls13.ExpandLabel(undefined, $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<cipherSuiteTLS13>(c).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)), baseKey, "finished", null, crypto.Hash_Size($.pointerValue<cipherSuiteTLS13>(c).hash))
		let verifyData = await hmac.New($.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<cipherSuiteTLS13>(c).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)), finishedKey)
		await $.pointerValue<Exclude<hash2.Hash, null>>(verifyData).Write(await $.pointerValue<Exclude<hash2.Hash, null>>(transcript).Sum(null))
		return $.pointerValue<Exclude<hash2.Hash, null>>(verifyData).Sum(null)
	}

	public async nextTrafficSecret(trafficSecret: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const c: cipherSuiteTLS13 | $.VarRef<cipherSuiteTLS13> | null = this
		return tls13.ExpandLabel(undefined, $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<cipherSuiteTLS13>(c).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)), trafficSecret, "traffic upd", null, crypto.Hash_Size($.pointerValue<cipherSuiteTLS13>(c).hash))
	}

	public async trafficKey(trafficSecret: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.Slice<number>]> {
		const c: cipherSuiteTLS13 | $.VarRef<cipherSuiteTLS13> | null = this
		let key: $.Slice<number> = null as $.Slice<number>
		let iv: $.Slice<number> = null as $.Slice<number>
		key = await tls13.ExpandLabel(undefined, $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<cipherSuiteTLS13>(c).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)), trafficSecret, "key", null, $.pointerValue<cipherSuiteTLS13>(c).keyLen)
		iv = await tls13.ExpandLabel(undefined, $.functionValue(((__receiver) => () => crypto.Hash_New(__receiver))($.pointerValue<cipherSuiteTLS13>(c).hash), ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)), trafficSecret, "iv", null, 12)
		return [key, iv]
	}

	static __typeInfo = $.registerStructType(
		"tls.cipherSuiteTLS13",
		() => new cipherSuiteTLS13(),
		[{ name: "exportKeyingMaterial", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "tls13.MasterSecret" } }, { name: "transcript", type: "hash.Hash" }], returns: [{ name: "_r0", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Basic, name: "int" }], results: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, "error"] } as $.FunctionTypeInfo) }] }, { name: "finishedHash", args: [{ name: "baseKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "transcript", type: "hash.Hash" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "nextTrafficSecret", args: [{ name: "trafficSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "trafficKey", args: [{ name: "trafficSecret", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "key", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "iv", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		cipherSuiteTLS13,
		[{ name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint16" }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "keyLen", key: "keyLen", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/tls", index: [1], offset: 8, exported: false }, { name: "aead", key: "aead", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["tls.aead"] } as $.FunctionTypeInfo), pkgPath: "crypto/tls", index: [2], offset: 16, exported: false }, { name: "hash", key: "hash", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" }, pkgPath: "crypto/tls", index: [3], offset: 24, exported: false }]
	)
}

export class prefixNonceAEAD {
	// nonce contains the fixed part of the nonce in the first four bytes.
	public get nonce(): Uint8Array {
		return this._fields.nonce.value
	}
	public set nonce(value: Uint8Array) {
		this._fields.nonce.value = value
	}

	public get aead(): cipher2.AEAD | null {
		return this._fields.aead.value
	}
	public set aead(value: cipher2.AEAD | null) {
		this._fields.aead.value = value
	}

	public _fields: {
		nonce: $.VarRef<Uint8Array>
		aead: $.VarRef<cipher2.AEAD | null>
	}

	constructor(init?: Partial<{nonce?: Uint8Array, aead?: cipher2.AEAD | null}>) {
		this._fields = {
			nonce: $.varRef(init?.nonce !== undefined ? $.cloneArrayValue(init.nonce) : new Uint8Array(12)),
			aead: $.varRef(init?.aead ?? (null as cipher2.AEAD | null))
		}
	}

	public clone(): prefixNonceAEAD {
		const cloned = new prefixNonceAEAD()
		cloned._fields = {
			nonce: $.varRef($.cloneArrayValue(this._fields.nonce.value)),
			aead: $.varRef(this._fields.aead.value)
		}
		return $.markAsStructValue(cloned)
	}

	public NonceSize(): number {
		const f: prefixNonceAEAD | $.VarRef<prefixNonceAEAD> | null = this
		return 12 - 4
	}

	public async Open(out: $.Slice<number>, nonce: $.Slice<number>, ciphertext: $.Slice<number>, additionalData: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const f: prefixNonceAEAD | $.VarRef<prefixNonceAEAD> | null = this
		$.copy($.goSlice($.pointerValue<prefixNonceAEAD>(f).nonce, 4, undefined), nonce)
		return $.pointerValue<Exclude<cipher2.AEAD, null>>($.pointerValue<prefixNonceAEAD>(f).aead).Open(out, $.goSlice($.pointerValue<prefixNonceAEAD>(f).nonce, undefined, undefined), ciphertext, additionalData)
	}

	public async Overhead(): globalThis.Promise<number> {
		const f: prefixNonceAEAD | $.VarRef<prefixNonceAEAD> | null = this
		return $.pointerValue<Exclude<cipher2.AEAD, null>>($.pointerValue<prefixNonceAEAD>(f).aead).Overhead()
	}

	public async Seal(out: $.Slice<number>, nonce: $.Slice<number>, plaintext: $.Slice<number>, additionalData: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const f: prefixNonceAEAD | $.VarRef<prefixNonceAEAD> | null = this
		$.copy($.goSlice($.pointerValue<prefixNonceAEAD>(f).nonce, 4, undefined), nonce)
		return $.pointerValue<Exclude<cipher2.AEAD, null>>($.pointerValue<prefixNonceAEAD>(f).aead).Seal(out, $.goSlice($.pointerValue<prefixNonceAEAD>(f).nonce, undefined, undefined), plaintext, additionalData)
	}

	public explicitNonceLen(): number {
		const f: prefixNonceAEAD | $.VarRef<prefixNonceAEAD> | null = this
		return prefixNonceAEAD.prototype.NonceSize.call(f)
	}

	static __typeInfo = $.registerStructType(
		"tls.prefixNonceAEAD",
		() => new prefixNonceAEAD(),
		[{ name: "NonceSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Open", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "additionalData", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Overhead", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Seal", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "plaintext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "additionalData", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "explicitNonceLen", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		prefixNonceAEAD,
		[{ name: "nonce", key: "nonce", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 12 }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "aead", key: "aead", type: "cipher.AEAD", pkgPath: "crypto/tls", index: [1], offset: 16, exported: false }]
	)
}

export class xorNonceAEAD {
	public get nonceMask(): Uint8Array {
		return this._fields.nonceMask.value
	}
	public set nonceMask(value: Uint8Array) {
		this._fields.nonceMask.value = value
	}

	public get aead(): cipher2.AEAD | null {
		return this._fields.aead.value
	}
	public set aead(value: cipher2.AEAD | null) {
		this._fields.aead.value = value
	}

	public _fields: {
		nonceMask: $.VarRef<Uint8Array>
		aead: $.VarRef<cipher2.AEAD | null>
	}

	constructor(init?: Partial<{nonceMask?: Uint8Array, aead?: cipher2.AEAD | null}>) {
		this._fields = {
			nonceMask: $.varRef(init?.nonceMask !== undefined ? $.cloneArrayValue(init.nonceMask) : new Uint8Array(12)),
			aead: $.varRef(init?.aead ?? (null as cipher2.AEAD | null))
		}
	}

	public clone(): xorNonceAEAD {
		const cloned = new xorNonceAEAD()
		cloned._fields = {
			nonceMask: $.varRef($.cloneArrayValue(this._fields.nonceMask.value)),
			aead: $.varRef(this._fields.aead.value)
		}
		return $.markAsStructValue(cloned)
	}

	public NonceSize(): number {
		const f: xorNonceAEAD | $.VarRef<xorNonceAEAD> | null = this
		return 8
	}

	public async Open(out: $.Slice<number>, nonce: $.Slice<number>, ciphertext: $.Slice<number>, additionalData: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		let f: xorNonceAEAD | $.VarRef<xorNonceAEAD> | null = this
		for (let __goscriptRangeTarget5 = nonce, i = 0; i < $.len(__goscriptRangeTarget5); i++) {
			let b = __goscriptRangeTarget5![i]
			$.pointerValue<xorNonceAEAD>(f).nonceMask[4 + i] = $.pointerValue<xorNonceAEAD>(f).nonceMask[4 + i] ^ ($.uint(b, 8))
		}
		let __goscriptTuple1: any = await $.pointerValue<Exclude<cipher2.AEAD, null>>($.pointerValue<xorNonceAEAD>(f).aead).Open(out, $.goSlice($.pointerValue<xorNonceAEAD>(f).nonceMask, undefined, undefined), ciphertext, additionalData)
		let result: $.Slice<number> = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		for (let __goscriptRangeTarget6 = nonce, i = 0; i < $.len(__goscriptRangeTarget6); i++) {
			let b = __goscriptRangeTarget6![i]
			$.pointerValue<xorNonceAEAD>(f).nonceMask[4 + i] = $.pointerValue<xorNonceAEAD>(f).nonceMask[4 + i] ^ ($.uint(b, 8))
		}

		return [result, err]
	}

	public async Overhead(): globalThis.Promise<number> {
		const f: xorNonceAEAD | $.VarRef<xorNonceAEAD> | null = this
		return $.pointerValue<Exclude<cipher2.AEAD, null>>($.pointerValue<xorNonceAEAD>(f).aead).Overhead()
	}

	public async Seal(out: $.Slice<number>, nonce: $.Slice<number>, plaintext: $.Slice<number>, additionalData: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		let f: xorNonceAEAD | $.VarRef<xorNonceAEAD> | null = this
		for (let __goscriptRangeTarget7 = nonce, i = 0; i < $.len(__goscriptRangeTarget7); i++) {
			let b = __goscriptRangeTarget7![i]
			$.pointerValue<xorNonceAEAD>(f).nonceMask[4 + i] = $.pointerValue<xorNonceAEAD>(f).nonceMask[4 + i] ^ ($.uint(b, 8))
		}
		let result: $.Slice<number> = await $.pointerValue<Exclude<cipher2.AEAD, null>>($.pointerValue<xorNonceAEAD>(f).aead).Seal(out, $.goSlice($.pointerValue<xorNonceAEAD>(f).nonceMask, undefined, undefined), plaintext, additionalData)
		for (let __goscriptRangeTarget8 = nonce, i = 0; i < $.len(__goscriptRangeTarget8); i++) {
			let b = __goscriptRangeTarget8![i]
			$.pointerValue<xorNonceAEAD>(f).nonceMask[4 + i] = $.pointerValue<xorNonceAEAD>(f).nonceMask[4 + i] ^ ($.uint(b, 8))
		}

		return result
	}

	public explicitNonceLen(): number {
		const f: xorNonceAEAD | $.VarRef<xorNonceAEAD> | null = this
		return 0
	}

	static __typeInfo = $.registerStructType(
		"tls.xorNonceAEAD",
		() => new xorNonceAEAD(),
		[{ name: "NonceSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Open", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "additionalData", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Overhead", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Seal", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "plaintext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "additionalData", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "explicitNonceLen", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		xorNonceAEAD,
		[{ name: "nonceMask", key: "nonceMask", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 12 }, pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }, { name: "aead", key: "aead", type: "cipher.AEAD", pkgPath: "crypto/tls", index: [1], offset: 16, exported: false }]
	)
}

export class cthWrapper {
	public get h(): constantTimeHash | null {
		return this._fields.h.value
	}
	public set h(value: constantTimeHash | null) {
		this._fields.h.value = value
	}

	public _fields: {
		h: $.VarRef<constantTimeHash | null>
	}

	constructor(init?: Partial<{h?: constantTimeHash | null}>) {
		this._fields = {
			h: $.varRef(init?.h ?? (null as constantTimeHash | null))
		}
	}

	public clone(): cthWrapper {
		const cloned = new cthWrapper()
		cloned._fields = {
			h: $.varRef(this._fields.h.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async BlockSize(): globalThis.Promise<number> {
		const c: cthWrapper | $.VarRef<cthWrapper> | null = this
		return $.pointerValue<Exclude<constantTimeHash, null>>($.pointerValue<cthWrapper>(c).h).BlockSize()
	}

	public async Reset(): globalThis.Promise<void> {
		const c: cthWrapper | $.VarRef<cthWrapper> | null = this
		await $.pointerValue<Exclude<constantTimeHash, null>>($.pointerValue<cthWrapper>(c).h).Reset()
	}

	public async Size(): globalThis.Promise<number> {
		const c: cthWrapper | $.VarRef<cthWrapper> | null = this
		return $.pointerValue<Exclude<constantTimeHash, null>>($.pointerValue<cthWrapper>(c).h).Size()
	}

	public async Sum(b: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const c: cthWrapper | $.VarRef<cthWrapper> | null = this
		return $.pointerValue<Exclude<constantTimeHash, null>>($.pointerValue<cthWrapper>(c).h).ConstantTimeSum(b)
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const c: cthWrapper | $.VarRef<cthWrapper> | null = this
		return $.pointerValue<Exclude<constantTimeHash, null>>($.pointerValue<cthWrapper>(c).h).Write(p)
	}

	static __typeInfo = $.registerStructType(
		"tls.cthWrapper",
		() => new cthWrapper(),
		[{ name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Reset", args: [], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Sum", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		cthWrapper,
		[{ name: "h", key: "h", type: "tls.constantTimeHash", pkgPath: "crypto/tls", index: [0], offset: 0, exported: false }]
	)
}

export const suiteECDHE: number = 1

export const suiteECSign: number = 2

export const suiteTLS12: number = 4

export const suiteSHA384: number = 8

export const aeadNonceLength: number = 12

export const noncePrefixLength: number = 4

export const TLS_RSA_WITH_RC4_128_SHA: number = 5

export const TLS_RSA_WITH_3DES_EDE_CBC_SHA: number = 10

export const TLS_RSA_WITH_AES_128_CBC_SHA: number = 47

export const TLS_RSA_WITH_AES_256_CBC_SHA: number = 53

export const TLS_RSA_WITH_AES_128_CBC_SHA256: number = 60

export const TLS_RSA_WITH_AES_128_GCM_SHA256: number = 156

export const TLS_RSA_WITH_AES_256_GCM_SHA384: number = 157

export const TLS_ECDHE_ECDSA_WITH_RC4_128_SHA: number = 49159

export const TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA: number = 49161

export const TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA: number = 49162

export const TLS_ECDHE_RSA_WITH_RC4_128_SHA: number = 49169

export const TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA: number = 49170

export const TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA: number = 49171

export const TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA: number = 49172

export const TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256: number = 49187

export const TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256: number = 49191

export const TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256: number = 49199

export const TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256: number = 49195

export const TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384: number = 49200

export const TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384: number = 49196

export const TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256: number = 52392

export const TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256: number = 52393

export const TLS_AES_128_GCM_SHA256: number = 4865

export const TLS_AES_256_GCM_SHA384: number = 4866

export const TLS_CHACHA20_POLY1305_SHA256: number = 4867

export const TLS_FALLBACK_SCSV: number = 22016

export const TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305: number = 52392

export const TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305: number = 52393

export var supportedUpToTLS12: $.Slice<number>

export function __goscript_init_supportedUpToTLS12(): void {
	if (((supportedUpToTLS12) as any) === undefined) {
		supportedUpToTLS12 = $.arrayToSlice<number>([$.uint(769, 16), $.uint(770, 16), $.uint(771, 16)])
	}
}

export function __goscript_get_supportedUpToTLS12(): $.Slice<number> {
	if (((supportedUpToTLS12) as any) === undefined) {
		__goscript_init_supportedUpToTLS12()
	}
	return supportedUpToTLS12
}

export function __goscript_set_supportedUpToTLS12(__goscriptValue: $.Slice<number>): void {
	supportedUpToTLS12 = __goscriptValue
}

export var supportedOnlyTLS12: $.Slice<number>

export function __goscript_init_supportedOnlyTLS12(): void {
	if (((supportedOnlyTLS12) as any) === undefined) {
		supportedOnlyTLS12 = $.arrayToSlice<number>([$.uint(771, 16)])
	}
}

export function __goscript_get_supportedOnlyTLS12(): $.Slice<number> {
	if (((supportedOnlyTLS12) as any) === undefined) {
		__goscript_init_supportedOnlyTLS12()
	}
	return supportedOnlyTLS12
}

export function __goscript_set_supportedOnlyTLS12(__goscriptValue: $.Slice<number>): void {
	supportedOnlyTLS12 = __goscriptValue
}

export var supportedOnlyTLS13: $.Slice<number>

export function __goscript_init_supportedOnlyTLS13(): void {
	if (((supportedOnlyTLS13) as any) === undefined) {
		supportedOnlyTLS13 = $.arrayToSlice<number>([$.uint(772, 16)])
	}
}

export function __goscript_get_supportedOnlyTLS13(): $.Slice<number> {
	if (((supportedOnlyTLS13) as any) === undefined) {
		__goscript_init_supportedOnlyTLS13()
	}
	return supportedOnlyTLS13
}

export function __goscript_set_supportedOnlyTLS13(__goscriptValue: $.Slice<number>): void {
	supportedOnlyTLS13 = __goscriptValue
}

export function CipherSuites(): $.Slice<CipherSuite | $.VarRef<CipherSuite> | null> {
	return $.arrayToSlice<CipherSuite | $.VarRef<CipherSuite> | null>([new CipherSuite({ID: $.uint(4865, 16), Name: "TLS_AES_128_GCM_SHA256", SupportedVersions: __goscript_get_supportedOnlyTLS13(), Insecure: false}), new CipherSuite({ID: $.uint(4866, 16), Name: "TLS_AES_256_GCM_SHA384", SupportedVersions: __goscript_get_supportedOnlyTLS13(), Insecure: false}), new CipherSuite({ID: $.uint(4867, 16), Name: "TLS_CHACHA20_POLY1305_SHA256", SupportedVersions: __goscript_get_supportedOnlyTLS13(), Insecure: false}), new CipherSuite({ID: $.uint(49161, 16), Name: "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA", SupportedVersions: __goscript_get_supportedUpToTLS12(), Insecure: false}), new CipherSuite({ID: $.uint(49162, 16), Name: "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA", SupportedVersions: __goscript_get_supportedUpToTLS12(), Insecure: false}), new CipherSuite({ID: $.uint(49171, 16), Name: "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA", SupportedVersions: __goscript_get_supportedUpToTLS12(), Insecure: false}), new CipherSuite({ID: $.uint(49172, 16), Name: "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA", SupportedVersions: __goscript_get_supportedUpToTLS12(), Insecure: false}), new CipherSuite({ID: $.uint(49195, 16), Name: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256", SupportedVersions: __goscript_get_supportedOnlyTLS12(), Insecure: false}), new CipherSuite({ID: $.uint(49196, 16), Name: "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384", SupportedVersions: __goscript_get_supportedOnlyTLS12(), Insecure: false}), new CipherSuite({ID: $.uint(49199, 16), Name: "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256", SupportedVersions: __goscript_get_supportedOnlyTLS12(), Insecure: false}), new CipherSuite({ID: $.uint(49200, 16), Name: "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384", SupportedVersions: __goscript_get_supportedOnlyTLS12(), Insecure: false}), new CipherSuite({ID: $.uint(52392, 16), Name: "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256", SupportedVersions: __goscript_get_supportedOnlyTLS12(), Insecure: false}), new CipherSuite({ID: $.uint(52393, 16), Name: "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256", SupportedVersions: __goscript_get_supportedOnlyTLS12(), Insecure: false})])
}

export function InsecureCipherSuites(): $.Slice<CipherSuite | $.VarRef<CipherSuite> | null> {
	// This list includes legacy RSA kex, RC4, CBC_SHA256, and 3DES cipher
	// suites. See cipherSuitesPreferenceOrder for details.
	return $.arrayToSlice<CipherSuite | $.VarRef<CipherSuite> | null>([new CipherSuite({ID: $.uint(5, 16), Name: "TLS_RSA_WITH_RC4_128_SHA", SupportedVersions: __goscript_get_supportedUpToTLS12(), Insecure: true}), new CipherSuite({ID: $.uint(10, 16), Name: "TLS_RSA_WITH_3DES_EDE_CBC_SHA", SupportedVersions: __goscript_get_supportedUpToTLS12(), Insecure: true}), new CipherSuite({ID: $.uint(47, 16), Name: "TLS_RSA_WITH_AES_128_CBC_SHA", SupportedVersions: __goscript_get_supportedUpToTLS12(), Insecure: true}), new CipherSuite({ID: $.uint(53, 16), Name: "TLS_RSA_WITH_AES_256_CBC_SHA", SupportedVersions: __goscript_get_supportedUpToTLS12(), Insecure: true}), new CipherSuite({ID: $.uint(60, 16), Name: "TLS_RSA_WITH_AES_128_CBC_SHA256", SupportedVersions: __goscript_get_supportedOnlyTLS12(), Insecure: true}), new CipherSuite({ID: $.uint(156, 16), Name: "TLS_RSA_WITH_AES_128_GCM_SHA256", SupportedVersions: __goscript_get_supportedOnlyTLS12(), Insecure: true}), new CipherSuite({ID: $.uint(157, 16), Name: "TLS_RSA_WITH_AES_256_GCM_SHA384", SupportedVersions: __goscript_get_supportedOnlyTLS12(), Insecure: true}), new CipherSuite({ID: $.uint(49159, 16), Name: "TLS_ECDHE_ECDSA_WITH_RC4_128_SHA", SupportedVersions: __goscript_get_supportedUpToTLS12(), Insecure: true}), new CipherSuite({ID: $.uint(49169, 16), Name: "TLS_ECDHE_RSA_WITH_RC4_128_SHA", SupportedVersions: __goscript_get_supportedUpToTLS12(), Insecure: true}), new CipherSuite({ID: $.uint(49170, 16), Name: "TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA", SupportedVersions: __goscript_get_supportedUpToTLS12(), Insecure: true}), new CipherSuite({ID: $.uint(49187, 16), Name: "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256", SupportedVersions: __goscript_get_supportedOnlyTLS12(), Insecure: true}), new CipherSuite({ID: $.uint(49191, 16), Name: "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256", SupportedVersions: __goscript_get_supportedOnlyTLS12(), Insecure: true})])
}

export async function CipherSuiteName(id: number): globalThis.Promise<string> {
	for (let __goscriptRangeTarget0 = CipherSuites(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let c = __goscriptRangeTarget0![__rangeIndex]
		if ($.uint($.pointerValue<CipherSuite>(c).ID, 16) == $.uint(id, 16)) {
			return $.pointerValue<CipherSuite>(c).Name
		}
	}
	for (let __goscriptRangeTarget1 = InsecureCipherSuites(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let c = __goscriptRangeTarget1![__rangeIndex]
		if ($.uint($.pointerValue<CipherSuite>(c).ID, 16) == $.uint(id, 16)) {
			return $.pointerValue<CipherSuite>(c).Name
		}
	}
	return fmt.Sprintf("0x%04X", $.namedValueInterfaceValue<any>(id, "uint16", {}, { kind: $.TypeKind.Basic, name: "uint16" }))
}

export let cipherSuites: $.Slice<cipherSuite | $.VarRef<cipherSuite> | null> = $.arrayToSlice<cipherSuite | $.VarRef<cipherSuite> | null>([new cipherSuite({id: $.uint(52392, 16), keyLen: 32, macLen: 0, ivLen: 12, ka: ecdheRSAKA, flags: 1 | 4, cipher: (null as ((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null), mac: (null as ((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null), aead: aeadChaCha20Poly1305}), new cipherSuite({id: $.uint(52393, 16), keyLen: 32, macLen: 0, ivLen: 12, ka: ecdheECDSAKA, flags: (1 | 2) | 4, cipher: (null as ((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null), mac: (null as ((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null), aead: aeadChaCha20Poly1305}), new cipherSuite({id: $.uint(49199, 16), keyLen: 16, macLen: 0, ivLen: 4, ka: ecdheRSAKA, flags: 1 | 4, cipher: (null as ((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null), mac: (null as ((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null), aead: aeadAESGCM}), new cipherSuite({id: $.uint(49195, 16), keyLen: 16, macLen: 0, ivLen: 4, ka: ecdheECDSAKA, flags: (1 | 2) | 4, cipher: (null as ((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null), mac: (null as ((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null), aead: aeadAESGCM}), new cipherSuite({id: $.uint(49200, 16), keyLen: 32, macLen: 0, ivLen: 4, ka: ecdheRSAKA, flags: (1 | 4) | 8, cipher: (null as ((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null), mac: (null as ((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null), aead: aeadAESGCM}), new cipherSuite({id: $.uint(49196, 16), keyLen: 32, macLen: 0, ivLen: 4, ka: ecdheECDSAKA, flags: ((1 | 2) | 4) | 8, cipher: (null as ((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null), mac: (null as ((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null), aead: aeadAESGCM}), new cipherSuite({id: $.uint(49191, 16), keyLen: 16, macLen: 32, ivLen: 16, ka: ecdheRSAKA, flags: 1 | 4, cipher: cipherAES, mac: macSHA256, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(49171, 16), keyLen: 16, macLen: 20, ivLen: 16, ka: ecdheRSAKA, flags: 1, cipher: cipherAES, mac: macSHA1, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(49187, 16), keyLen: 16, macLen: 32, ivLen: 16, ka: ecdheECDSAKA, flags: (1 | 2) | 4, cipher: cipherAES, mac: macSHA256, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(49161, 16), keyLen: 16, macLen: 20, ivLen: 16, ka: ecdheECDSAKA, flags: 1 | 2, cipher: cipherAES, mac: macSHA1, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(49172, 16), keyLen: 32, macLen: 20, ivLen: 16, ka: ecdheRSAKA, flags: 1, cipher: cipherAES, mac: macSHA1, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(49162, 16), keyLen: 32, macLen: 20, ivLen: 16, ka: ecdheECDSAKA, flags: 1 | 2, cipher: cipherAES, mac: macSHA1, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(156, 16), keyLen: 16, macLen: 0, ivLen: 4, ka: rsaKA, flags: 4, cipher: (null as ((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null), mac: (null as ((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null), aead: aeadAESGCM}), new cipherSuite({id: $.uint(157, 16), keyLen: 32, macLen: 0, ivLen: 4, ka: rsaKA, flags: 4 | 8, cipher: (null as ((key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean) => any | globalThis.Promise<any>) | null), mac: (null as ((key: $.Slice<number>) => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null), aead: aeadAESGCM}), new cipherSuite({id: $.uint(60, 16), keyLen: 16, macLen: 32, ivLen: 16, ka: rsaKA, flags: 4, cipher: cipherAES, mac: macSHA256, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(47, 16), keyLen: 16, macLen: 20, ivLen: 16, ka: rsaKA, flags: 0, cipher: cipherAES, mac: macSHA1, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(53, 16), keyLen: 32, macLen: 20, ivLen: 16, ka: rsaKA, flags: 0, cipher: cipherAES, mac: macSHA1, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(49170, 16), keyLen: 24, macLen: 20, ivLen: 8, ka: ecdheRSAKA, flags: 1, cipher: cipher3DES, mac: macSHA1, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(10, 16), keyLen: 24, macLen: 20, ivLen: 8, ka: rsaKA, flags: 0, cipher: cipher3DES, mac: macSHA1, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(5, 16), keyLen: 16, macLen: 20, ivLen: 0, ka: rsaKA, flags: 0, cipher: cipherRC4, mac: macSHA1, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(49169, 16), keyLen: 16, macLen: 20, ivLen: 0, ka: ecdheRSAKA, flags: 1, cipher: cipherRC4, mac: macSHA1, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)}), new cipherSuite({id: $.uint(49159, 16), keyLen: 16, macLen: 20, ivLen: 0, ka: ecdheECDSAKA, flags: 1 | 2, cipher: cipherRC4, mac: macSHA1, aead: (null as ((key: $.Slice<number>, fixedNonce: $.Slice<number>) => aead | null | globalThis.Promise<aead | null>) | null)})])

export function __goscript_set_cipherSuites(__goscriptValue: $.Slice<cipherSuite | $.VarRef<cipherSuite> | null>): void {
	cipherSuites = __goscriptValue
}

export async function selectCipherSuite(ids: $.Slice<number>, supportedIDs: $.Slice<number>, ok: ((_p0: cipherSuite | $.VarRef<cipherSuite> | null) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<cipherSuite | $.VarRef<cipherSuite> | null> {
	for (let __goscriptRangeTarget3 = ids, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
		let id = __goscriptRangeTarget3![__rangeIndex]
		let candidate: cipherSuite | $.VarRef<cipherSuite> | null = cipherSuiteByID($.uint(id, 16))
		if ((candidate == null) || !await ok!(candidate)) {
			continue
		}

		for (let __goscriptRangeTarget2 = supportedIDs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
			let suppID = __goscriptRangeTarget2![__rangeIndex]
			if ($.uint(id, 16) == $.uint(suppID, 16)) {
				return candidate
			}
		}
	}
	return null
}

export let cipherSuitesTLS13: $.Slice<cipherSuiteTLS13 | $.VarRef<cipherSuiteTLS13> | null> = $.arrayToSlice<cipherSuiteTLS13 | $.VarRef<cipherSuiteTLS13> | null>([new cipherSuiteTLS13({id: $.uint(4865, 16), keyLen: 16, aead: aeadAESGCMTLS13, hash: crypto.SHA256}), new cipherSuiteTLS13({id: $.uint(4867, 16), keyLen: 32, aead: aeadChaCha20Poly1305, hash: crypto.SHA256}), new cipherSuiteTLS13({id: $.uint(4866, 16), keyLen: 32, aead: aeadAESGCMTLS13, hash: crypto.SHA384})])

export function __goscript_set_cipherSuitesTLS13(__goscriptValue: $.Slice<cipherSuiteTLS13 | $.VarRef<cipherSuiteTLS13> | null>): void {
	cipherSuitesTLS13 = __goscriptValue
}

export let cipherSuitesPreferenceOrder: $.Slice<number> = $.arrayToSlice<number>([$.uint(49195, 16), $.uint(49199, 16), $.uint(49196, 16), $.uint(49200, 16), $.uint(52393, 16), $.uint(52392, 16), $.uint(49161, 16), $.uint(49171, 16), $.uint(49162, 16), $.uint(49172, 16), $.uint(156, 16), $.uint(157, 16), $.uint(47, 16), $.uint(53, 16), $.uint(49170, 16), $.uint(10, 16), $.uint(49187, 16), $.uint(49191, 16), $.uint(60, 16), $.uint(49159, 16), $.uint(49169, 16), $.uint(5, 16)])

export function __goscript_set_cipherSuitesPreferenceOrder(__goscriptValue: $.Slice<number>): void {
	cipherSuitesPreferenceOrder = __goscriptValue
}

export let cipherSuitesPreferenceOrderNoAES: $.Slice<number> = $.arrayToSlice<number>([$.uint(52393, 16), $.uint(52392, 16), $.uint(49195, 16), $.uint(49199, 16), $.uint(49196, 16), $.uint(49200, 16), $.uint(49161, 16), $.uint(49171, 16), $.uint(49162, 16), $.uint(49172, 16), $.uint(156, 16), $.uint(157, 16), $.uint(47, 16), $.uint(53, 16), $.uint(49170, 16), $.uint(10, 16), $.uint(49187, 16), $.uint(49191, 16), $.uint(60, 16), $.uint(49159, 16), $.uint(49169, 16), $.uint(5, 16)])

export function __goscript_set_cipherSuitesPreferenceOrderNoAES(__goscriptValue: $.Slice<number>): void {
	cipherSuitesPreferenceOrderNoAES = __goscriptValue
}

export let disabledCipherSuites: globalThis.Map<number, boolean> | null = new globalThis.Map<number, boolean>([[$.uint(49187, 16), true], [$.uint(49191, 16), true], [$.uint(60, 16), true], [$.uint(49159, 16), true], [$.uint(49169, 16), true], [$.uint(5, 16), true]])

export function __goscript_set_disabledCipherSuites(__goscriptValue: globalThis.Map<number, boolean> | null): void {
	disabledCipherSuites = __goscriptValue
}

export let rsaKexCiphers: globalThis.Map<number, boolean> | null = new globalThis.Map<number, boolean>([[$.uint(5, 16), true], [$.uint(10, 16), true], [$.uint(47, 16), true], [$.uint(53, 16), true], [$.uint(60, 16), true], [$.uint(156, 16), true], [$.uint(157, 16), true]])

export function __goscript_set_rsaKexCiphers(__goscriptValue: globalThis.Map<number, boolean> | null): void {
	rsaKexCiphers = __goscriptValue
}

export let tdesCiphers: globalThis.Map<number, boolean> | null = new globalThis.Map<number, boolean>([[$.uint(49170, 16), true], [$.uint(10, 16), true]])

export function __goscript_set_tdesCiphers(__goscriptValue: globalThis.Map<number, boolean> | null): void {
	tdesCiphers = __goscriptValue
}

export let hasGCMAsmAMD64: boolean = ((cpu.X86.HasAES && cpu.X86.HasPCLMULQDQ) && cpu.X86.HasSSE41) && cpu.X86.HasSSSE3

export function __goscript_set_hasGCMAsmAMD64(__goscriptValue: boolean): void {
	hasGCMAsmAMD64 = __goscriptValue
}

export let hasGCMAsmARM64: boolean = cpu.ARM64.HasAES && cpu.ARM64.HasPMULL

export function __goscript_set_hasGCMAsmARM64(__goscriptValue: boolean): void {
	hasGCMAsmARM64 = __goscriptValue
}

export let hasGCMAsmS390X: boolean = (cpu.S390X.HasAES && cpu.S390X.HasAESCTR) && cpu.S390X.HasGHASH

export function __goscript_set_hasGCMAsmS390X(__goscriptValue: boolean): void {
	hasGCMAsmS390X = __goscriptValue
}

export let hasGCMAsmPPC64: boolean = ($.stringEqual(runtime.GOARCH, "ppc64")) || ($.stringEqual(runtime.GOARCH, "ppc64le"))

export function __goscript_set_hasGCMAsmPPC64(__goscriptValue: boolean): void {
	hasGCMAsmPPC64 = __goscriptValue
}

export let hasAESGCMHardwareSupport: boolean = ((hasGCMAsmAMD64 || hasGCMAsmARM64) || hasGCMAsmS390X) || hasGCMAsmPPC64

export function __goscript_set_hasAESGCMHardwareSupport(__goscriptValue: boolean): void {
	hasAESGCMHardwareSupport = __goscriptValue
}

export let aesgcmCiphers: globalThis.Map<number, boolean> | null = new globalThis.Map<number, boolean>([[$.uint(49199, 16), true], [$.uint(49200, 16), true], [$.uint(49195, 16), true], [$.uint(49196, 16), true], [$.uint(4865, 16), true], [$.uint(4866, 16), true]])

export function __goscript_set_aesgcmCiphers(__goscriptValue: globalThis.Map<number, boolean> | null): void {
	aesgcmCiphers = __goscriptValue
}

export function isAESGCMPreferred(ciphers: $.Slice<number>): boolean {
	if (!hasAESGCMHardwareSupport) {
		return false
	}
	for (let __goscriptRangeTarget4 = ciphers, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let cID = __goscriptRangeTarget4![__rangeIndex]
		{
			let c: cipherSuite | $.VarRef<cipherSuite> | null = cipherSuiteByID($.uint(cID, 16))
			if (c != null) {
				return $.mapGet<number, boolean, boolean>(aesgcmCiphers, $.uint(cID, 16), false)[0]
			}
		}
		{
			let c: cipherSuiteTLS13 | $.VarRef<cipherSuiteTLS13> | null = cipherSuiteTLS13ByID($.uint(cID, 16))
			if (c != null) {
				return $.mapGet<number, boolean, boolean>(aesgcmCiphers, $.uint(cID, 16), false)[0]
			}
		}
	}
	return false
}

export function cipherRC4(key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean): any {
	let __goscriptTuple0: any = rc4.NewCipher(key)
	let __goscriptShadow0: rc4.Cipher | $.VarRef<rc4.Cipher> | null = __goscriptTuple0[0]
	return $.interfaceValue<any>(__goscriptShadow0, "*rc4.Cipher", { kind: $.TypeKind.Pointer, elemType: "rc4.Cipher" })
}

export async function cipher3DES(key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean): globalThis.Promise<any> {
	let [block, ] = await des.NewTripleDESCipher(key)
	if (isRead) {
		return (cipher2.NewCBCDecrypter($.pointerValueOrNil(block)!, iv) as any)
	}
	return (cipher2.NewCBCEncrypter($.pointerValueOrNil(block)!, iv) as any)
}

export function cipherAES(key: $.Slice<number>, iv: $.Slice<number>, isRead: boolean): any {
	let [block, ] = aes2.NewCipher(key)
	if (isRead) {
		return (cipher2.NewCBCDecrypter($.pointerValueOrNil(block)!, iv) as any)
	}
	return (cipher2.NewCBCEncrypter($.pointerValueOrNil(block)!, iv) as any)
}

export async function macSHA1(key: $.Slice<number>): globalThis.Promise<hash2.Hash | null> {
	let h: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null = sha1.New
	// The BoringCrypto SHA1 does not have a constant-time
	// checksum function, so don't try to use it.
	if (!boring.Enabled) {
		h = newConstantTimeHash(h)
	}
	return hmac.New(h, key)
}

export async function macSHA256(key: $.Slice<number>): globalThis.Promise<hash2.Hash | null> {
	return hmac.New(sha256.New, key)
}

export function aeadAESGCM(key: $.Slice<number>, noncePrefix: $.Slice<number>): aead | null {
	if ($.len(noncePrefix) != 4) {
		$.panic("tls: internal error: wrong nonce length")
	}
	let __goscriptTuple2: any = aes2.NewCipher(key)
	let __goscriptShadow1 = __goscriptTuple2[0]
	let err = __goscriptTuple2[1]
	if (err != null) {
		$.panic((err as any))
	}
	let __goscriptShadow2: cipher2.AEAD | null = null as cipher2.AEAD | null
	if (boring.Enabled) {
		let __goscriptTuple3: any = boring.NewGCMTLS(__goscriptShadow1)
		__goscriptShadow2 = __goscriptTuple3[0]
		err = __goscriptTuple3[1]
	} else {
		boring.Unreachable()
		let __goscriptTuple4: any = gcm.NewGCMForTLS12($.mustTypeAssert<fipsaes.Block | $.VarRef<fipsaes.Block> | null>(__goscriptShadow1, { kind: $.TypeKind.Pointer, elemType: "aes.Block" }))
		__goscriptShadow2 = $.interfaceValue<cipher2.AEAD | null>(__goscriptTuple4[0], "*gcm.GCMWithCounterNonce", { kind: $.TypeKind.Pointer, elemType: "gcm.GCMWithCounterNonce" })
		err = __goscriptTuple4[1]
	}
	if (err != null) {
		$.panic((err as any))
	}

	let ret: prefixNonceAEAD | $.VarRef<prefixNonceAEAD> | null = new prefixNonceAEAD({aead: __goscriptShadow2})
	$.copy($.goSlice($.pointerValue<prefixNonceAEAD>(ret).nonce, undefined, undefined), noncePrefix)
	return $.interfaceValue<aead | null>(ret, "*tls.prefixNonceAEAD", { kind: $.TypeKind.Pointer, elemType: "tls.prefixNonceAEAD" })
}

export function aeadAESGCMTLS13(key: $.Slice<number>, nonceMask: $.Slice<number>): aead | null {
	if ($.len(nonceMask) != 12) {
		$.panic("tls: internal error: wrong nonce length")
	}
	let __goscriptTuple5: any = aes2.NewCipher(key)
	let __goscriptShadow3 = __goscriptTuple5[0]
	let err = __goscriptTuple5[1]
	if (err != null) {
		$.panic((err as any))
	}
	let __goscriptShadow4: cipher2.AEAD | null = null as cipher2.AEAD | null
	if (boring.Enabled) {
		let __goscriptTuple6: any = boring.NewGCMTLS13(__goscriptShadow3)
		__goscriptShadow4 = __goscriptTuple6[0]
		err = __goscriptTuple6[1]
	} else {
		boring.Unreachable()
		let __goscriptTuple7: any = gcm.NewGCMForTLS13($.mustTypeAssert<fipsaes.Block | $.VarRef<fipsaes.Block> | null>(__goscriptShadow3, { kind: $.TypeKind.Pointer, elemType: "aes.Block" }))
		__goscriptShadow4 = $.interfaceValue<cipher2.AEAD | null>(__goscriptTuple7[0], "*gcm.GCMWithXORCounterNonce", { kind: $.TypeKind.Pointer, elemType: "gcm.GCMWithXORCounterNonce" })
		err = __goscriptTuple7[1]
	}
	if (err != null) {
		$.panic((err as any))
	}

	let ret: xorNonceAEAD | $.VarRef<xorNonceAEAD> | null = new xorNonceAEAD({aead: __goscriptShadow4})
	$.copy($.goSlice($.pointerValue<xorNonceAEAD>(ret).nonceMask, undefined, undefined), nonceMask)
	return $.interfaceValue<aead | null>(ret, "*tls.xorNonceAEAD", { kind: $.TypeKind.Pointer, elemType: "tls.xorNonceAEAD" })
}

export function aeadChaCha20Poly1305(key: $.Slice<number>, nonceMask: $.Slice<number>): aead | null {
	if ($.len(nonceMask) != 12) {
		$.panic("tls: internal error: wrong nonce length")
	}
	let [__goscriptShadow5, err] = chacha20poly1305.New(key)
	if (err != null) {
		$.panic((err as any))
	}

	let ret: xorNonceAEAD | $.VarRef<xorNonceAEAD> | null = new xorNonceAEAD({aead: __goscriptShadow5})
	$.copy($.goSlice($.pointerValue<xorNonceAEAD>(ret).nonceMask, undefined, undefined), nonceMask)
	return $.interfaceValue<aead | null>(ret, "*tls.xorNonceAEAD", { kind: $.TypeKind.Pointer, elemType: "tls.xorNonceAEAD" })
}

export function newConstantTimeHash(h: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null): (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null {
	boring.Unreachable()
	return $.functionValue(async (): globalThis.Promise<hash2.Hash | null> => {
		return $.interfaceValue<hash2.Hash | null>(new cthWrapper({h: $.mustTypeAssert<constantTimeHash | null>(await h!(), "tls.constantTimeHash")}), "*tls.cthWrapper", { kind: $.TypeKind.Pointer, elemType: "tls.cthWrapper" })
	}, ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo))
}

export async function tls10MAC(h: hash2.Hash | null, out: $.Slice<number>, seq: $.Slice<number>, header: $.Slice<number>, data: $.Slice<number>, extra: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
	await $.pointerValue<Exclude<hash2.Hash, null>>(h).Reset()
	await $.pointerValue<Exclude<hash2.Hash, null>>(h).Write(seq)
	await $.pointerValue<Exclude<hash2.Hash, null>>(h).Write(header)
	await $.pointerValue<Exclude<hash2.Hash, null>>(h).Write(data)
	let res: $.Slice<number> = await $.pointerValue<Exclude<hash2.Hash, null>>(h).Sum(out)
	if (extra != null) {
		await $.pointerValue<Exclude<hash2.Hash, null>>(h).Write(extra)
	}
	return res
}

export function rsaKA(version: number): __goscript_key_agreement.keyAgreement | null {
	return $.interfaceValue<__goscript_key_agreement.keyAgreement | null>($.markAsStructValue(new __goscript_key_agreement.rsaKeyAgreement()), "tls.rsaKeyAgreement", "tls.rsaKeyAgreement")
}

export function ecdheECDSAKA(version: number): __goscript_key_agreement.keyAgreement | null {
	return $.interfaceValue<__goscript_key_agreement.keyAgreement | null>(new __goscript_key_agreement.ecdheKeyAgreement({isRSA: false, version: $.uint(version, 16)}), "*tls.ecdheKeyAgreement", { kind: $.TypeKind.Pointer, elemType: "tls.ecdheKeyAgreement" })
}

export function ecdheRSAKA(version: number): __goscript_key_agreement.keyAgreement | null {
	return $.interfaceValue<__goscript_key_agreement.keyAgreement | null>(new __goscript_key_agreement.ecdheKeyAgreement({isRSA: true, version: $.uint(version, 16)}), "*tls.ecdheKeyAgreement", { kind: $.TypeKind.Pointer, elemType: "tls.ecdheKeyAgreement" })
}

export function mutualCipherSuite(have: $.Slice<number>, want: number): cipherSuite | $.VarRef<cipherSuite> | null {
	for (let __goscriptRangeTarget9 = have, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget9); __rangeIndex++) {
		let id = __goscriptRangeTarget9![__rangeIndex]
		if ($.uint(id, 16) == $.uint(want, 16)) {
			return cipherSuiteByID($.uint(id, 16))
		}
	}
	return null
}

export function cipherSuiteByID(id: number): cipherSuite | $.VarRef<cipherSuite> | null {
	for (let __goscriptRangeTarget10 = cipherSuites, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget10); __rangeIndex++) {
		let cipherSuite = __goscriptRangeTarget10![__rangeIndex]
		if ($.uint($.pointerValue<cipherSuite>(cipherSuite).id, 16) == $.uint(id, 16)) {
			return cipherSuite
		}
	}
	return null
}

export function mutualCipherSuiteTLS13(have: $.Slice<number>, want: number): cipherSuiteTLS13 | $.VarRef<cipherSuiteTLS13> | null {
	for (let __goscriptRangeTarget11 = have, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget11); __rangeIndex++) {
		let id = __goscriptRangeTarget11![__rangeIndex]
		if ($.uint(id, 16) == $.uint(want, 16)) {
			return cipherSuiteTLS13ByID($.uint(id, 16))
		}
	}
	return null
}

export function cipherSuiteTLS13ByID(id: number): cipherSuiteTLS13 | $.VarRef<cipherSuiteTLS13> | null {
	for (let __goscriptRangeTarget12 = cipherSuitesTLS13, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget12); __rangeIndex++) {
		let cipherSuite = __goscriptRangeTarget12![__rangeIndex]
		if ($.uint($.pointerValue<cipherSuiteTLS13>(cipherSuite).id, 16) == $.uint(id, 16)) {
			return cipherSuite
		}
	}
	return null
}

// Generated file based on notboring.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as cipher from "@goscript/crypto/cipher/index.js"

import * as sig2 from "@goscript/crypto/internal/boring/sig/index.js"

import * as hash2 from "@goscript/hash/index.js"

import type * as __goscript_doc from "./doc.gs.ts"
import "@goscript/crypto/index.js"
import "@goscript/crypto/cipher/index.js"
import "@goscript/crypto/internal/boring/sig/index.js"
import "@goscript/hash/index.js"

export type randReader = number

export class PublicKeyECDSA {
	public get _blank0(): number {
		return this._fields._blank0.value
	}
	public set _blank0(value: number) {
		this._fields._blank0.value = value
	}

	public _fields: {
		_blank0: $.VarRef<number>
	}

	constructor(init?: Partial<{_blank0?: number}>) {
		this._fields = {
			_blank0: $.varRef(init?._blank0 ?? (0 as number))
		}
	}

	public clone(): PublicKeyECDSA {
		const cloned = new PublicKeyECDSA()
		cloned._fields = {
			_blank0: $.varRef(this._fields._blank0.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"boring.PublicKeyECDSA",
		() => new PublicKeyECDSA(),
		[],
		PublicKeyECDSA,
		[{ name: "_", key: "_blank0", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/boring", index: [0], offset: 0, exported: false }]
	)
}

export class PrivateKeyECDSA {
	public get _blank0(): number {
		return this._fields._blank0.value
	}
	public set _blank0(value: number) {
		this._fields._blank0.value = value
	}

	public _fields: {
		_blank0: $.VarRef<number>
	}

	constructor(init?: Partial<{_blank0?: number}>) {
		this._fields = {
			_blank0: $.varRef(init?._blank0 ?? (0 as number))
		}
	}

	public clone(): PrivateKeyECDSA {
		const cloned = new PrivateKeyECDSA()
		cloned._fields = {
			_blank0: $.varRef(this._fields._blank0.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"boring.PrivateKeyECDSA",
		() => new PrivateKeyECDSA(),
		[],
		PrivateKeyECDSA,
		[{ name: "_", key: "_blank0", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/boring", index: [0], offset: 0, exported: false }]
	)
}

export class PublicKeyRSA {
	public get _blank0(): number {
		return this._fields._blank0.value
	}
	public set _blank0(value: number) {
		this._fields._blank0.value = value
	}

	public _fields: {
		_blank0: $.VarRef<number>
	}

	constructor(init?: Partial<{_blank0?: number}>) {
		this._fields = {
			_blank0: $.varRef(init?._blank0 ?? (0 as number))
		}
	}

	public clone(): PublicKeyRSA {
		const cloned = new PublicKeyRSA()
		cloned._fields = {
			_blank0: $.varRef(this._fields._blank0.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"boring.PublicKeyRSA",
		() => new PublicKeyRSA(),
		[],
		PublicKeyRSA,
		[{ name: "_", key: "_blank0", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/boring", index: [0], offset: 0, exported: false }]
	)
}

export class PrivateKeyRSA {
	public get _blank0(): number {
		return this._fields._blank0.value
	}
	public set _blank0(value: number) {
		this._fields._blank0.value = value
	}

	public _fields: {
		_blank0: $.VarRef<number>
	}

	constructor(init?: Partial<{_blank0?: number}>) {
		this._fields = {
			_blank0: $.varRef(init?._blank0 ?? (0 as number))
		}
	}

	public clone(): PrivateKeyRSA {
		const cloned = new PrivateKeyRSA()
		cloned._fields = {
			_blank0: $.varRef(this._fields._blank0.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"boring.PrivateKeyRSA",
		() => new PrivateKeyRSA(),
		[],
		PrivateKeyRSA,
		[{ name: "_", key: "_blank0", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/boring", index: [0], offset: 0, exported: false }]
	)
}

export class PublicKeyECDH {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): PublicKeyECDH {
		const cloned = new PublicKeyECDH()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Bytes(): $.Slice<number> {
		$.panic("boringcrypto: not available")
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"boring.PublicKeyECDH",
		() => new PublicKeyECDH(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		PublicKeyECDH,
		[]
	)
}

export class PrivateKeyECDH {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): PrivateKeyECDH {
		const cloned = new PrivateKeyECDH()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public PublicKey(): [PublicKeyECDH | $.VarRef<PublicKeyECDH> | null, $.GoError] {
		$.panic("boringcrypto: not available")
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"boring.PrivateKeyECDH",
		() => new PrivateKeyECDH(),
		[{ name: "PublicKey", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "boring.PublicKeyECDH" } }, { name: "_r1", type: "error" }] }],
		PrivateKeyECDH,
		[]
	)
}

export const available: boolean = false

export const RandReader: randReader = 0

export function Unreachable(): void {
	// Code that's unreachable when using BoringCrypto
	// is exactly the code we want to detect for reporting
	// standard Go crypto.
	sig2.StandardCrypto()
}

export function UnreachableExceptTests(): void {
}

export function randReader_Read(recv: randReader, b: $.Slice<number>): [number, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewSHA1(): hash2.Hash | null {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewSHA224(): hash2.Hash | null {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewSHA256(): hash2.Hash | null {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewSHA384(): hash2.Hash | null {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewSHA512(): hash2.Hash | null {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function SHA1(_p0: $.Slice<number>): Uint8Array {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function SHA224(_p0: $.Slice<number>): Uint8Array {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function SHA256(_p0: $.Slice<number>): Uint8Array {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function SHA384(_p0: $.Slice<number>): Uint8Array {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function SHA512(_p0: $.Slice<number>): Uint8Array {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewHMAC(h: (() => hash2.Hash | null | globalThis.Promise<hash2.Hash | null>) | null, key: $.Slice<number>): hash2.Hash | null {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewAESCipher(key: $.Slice<number>): [cipher.Block | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewGCMTLS(_p0: cipher.Block | null): [cipher.AEAD | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewGCMTLS13(_p0: cipher.Block | null): [cipher.AEAD | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function GenerateKeyECDSA(curve: string): [__goscript_doc.BigInt, __goscript_doc.BigInt, __goscript_doc.BigInt, $.GoError] {
	let X: __goscript_doc.BigInt = null! as __goscript_doc.BigInt
	let Y: __goscript_doc.BigInt = null! as __goscript_doc.BigInt
	let D: __goscript_doc.BigInt = null! as __goscript_doc.BigInt
	let err: $.GoError = null! as $.GoError
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewPrivateKeyECDSA(curve: string, X: __goscript_doc.BigInt, Y: __goscript_doc.BigInt, D: __goscript_doc.BigInt): [PrivateKeyECDSA | $.VarRef<PrivateKeyECDSA> | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewPublicKeyECDSA(curve: string, X: __goscript_doc.BigInt, Y: __goscript_doc.BigInt): [PublicKeyECDSA | $.VarRef<PublicKeyECDSA> | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function SignMarshalECDSA(priv: PrivateKeyECDSA | $.VarRef<PrivateKeyECDSA> | null, hash: $.Slice<number>): [$.Slice<number>, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function VerifyECDSA(pub: PublicKeyECDSA | $.VarRef<PublicKeyECDSA> | null, hash: $.Slice<number>, sig: $.Slice<number>): boolean {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function DecryptRSAOAEP(h: hash2.Hash | null, mgfHash: hash2.Hash | null, priv: PrivateKeyRSA | $.VarRef<PrivateKeyRSA> | null, ciphertext: $.Slice<number>, label: $.Slice<number>): [$.Slice<number>, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function DecryptRSAPKCS1(priv: PrivateKeyRSA | $.VarRef<PrivateKeyRSA> | null, ciphertext: $.Slice<number>): [$.Slice<number>, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function DecryptRSANoPadding(priv: PrivateKeyRSA | $.VarRef<PrivateKeyRSA> | null, ciphertext: $.Slice<number>): [$.Slice<number>, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function EncryptRSAOAEP(h: hash2.Hash | null, mgfHash: hash2.Hash | null, pub: PublicKeyRSA | $.VarRef<PublicKeyRSA> | null, msg: $.Slice<number>, label: $.Slice<number>): [$.Slice<number>, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function EncryptRSAPKCS1(pub: PublicKeyRSA | $.VarRef<PublicKeyRSA> | null, msg: $.Slice<number>): [$.Slice<number>, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function EncryptRSANoPadding(pub: PublicKeyRSA | $.VarRef<PublicKeyRSA> | null, msg: $.Slice<number>): [$.Slice<number>, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function GenerateKeyRSA(bits: number): [__goscript_doc.BigInt, __goscript_doc.BigInt, __goscript_doc.BigInt, __goscript_doc.BigInt, __goscript_doc.BigInt, __goscript_doc.BigInt, __goscript_doc.BigInt, __goscript_doc.BigInt, $.GoError] {
	let N: __goscript_doc.BigInt = null! as __goscript_doc.BigInt
	let E: __goscript_doc.BigInt = null! as __goscript_doc.BigInt
	let D: __goscript_doc.BigInt = null! as __goscript_doc.BigInt
	let P: __goscript_doc.BigInt = null! as __goscript_doc.BigInt
	let Q: __goscript_doc.BigInt = null! as __goscript_doc.BigInt
	let Dp: __goscript_doc.BigInt = null! as __goscript_doc.BigInt
	let Dq: __goscript_doc.BigInt = null! as __goscript_doc.BigInt
	let Qinv: __goscript_doc.BigInt = null! as __goscript_doc.BigInt
	let err: $.GoError = null! as $.GoError
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewPrivateKeyRSA(N: __goscript_doc.BigInt, E: __goscript_doc.BigInt, D: __goscript_doc.BigInt, P: __goscript_doc.BigInt, Q: __goscript_doc.BigInt, Dp: __goscript_doc.BigInt, Dq: __goscript_doc.BigInt, Qinv: __goscript_doc.BigInt): [PrivateKeyRSA | $.VarRef<PrivateKeyRSA> | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewPublicKeyRSA(N: __goscript_doc.BigInt, E: __goscript_doc.BigInt): [PublicKeyRSA | $.VarRef<PublicKeyRSA> | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function SignRSAPKCS1v15(priv: PrivateKeyRSA | $.VarRef<PrivateKeyRSA> | null, h: crypto.Hash, hashed: $.Slice<number>): [$.Slice<number>, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function SignRSAPSS(priv: PrivateKeyRSA | $.VarRef<PrivateKeyRSA> | null, h: crypto.Hash, hashed: $.Slice<number>, saltLen: number): [$.Slice<number>, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function VerifyRSAPKCS1v15(pub: PublicKeyRSA | $.VarRef<PublicKeyRSA> | null, h: crypto.Hash, hashed: $.Slice<number>, sig: $.Slice<number>): $.GoError {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function VerifyRSAPSS(pub: PublicKeyRSA | $.VarRef<PublicKeyRSA> | null, h: crypto.Hash, hashed: $.Slice<number>, sig: $.Slice<number>, saltLen: number): $.GoError {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function ECDH(_p0: PrivateKeyECDH | $.VarRef<PrivateKeyECDH> | null, _p1: PublicKeyECDH | $.VarRef<PublicKeyECDH> | null): [$.Slice<number>, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function GenerateKeyECDH(_p0: string): [PrivateKeyECDH | $.VarRef<PrivateKeyECDH> | null, $.Slice<number>, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewPrivateKeyECDH(_p0: string, _p1: $.Slice<number>): [PrivateKeyECDH | $.VarRef<PrivateKeyECDH> | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

export function NewPublicKeyECDH(_p0: string, _p1: $.Slice<number>): [PublicKeyECDH | $.VarRef<PublicKeyECDH> | null, $.GoError] {
	$.panic("boringcrypto: not available")
	throw new globalThis.Error("goscript: unreachable return")
}

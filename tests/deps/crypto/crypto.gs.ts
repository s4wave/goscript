// Generated file based on crypto.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as hash from "@goscript/hash/index.js"

import * as io from "@goscript/io/index.js"

import * as strconv from "@goscript/strconv/index.js"
import "@goscript/hash/index.js"
import "@goscript/io/index.js"
import "@goscript/strconv/index.js"

export type Hash = number

export type PublicKey = any

$.registerInterfaceType(
	"crypto.PublicKey",
	null,
	[]
);

export type PrivateKey = any

$.registerInterfaceType(
	"crypto.PrivateKey",
	null,
	[]
);

export type Signer = {
	Public(): PublicKey | null | globalThis.Promise<PublicKey | null>
	Sign(rand: io.Reader | null, digest: $.Slice<number>, opts: SignerOpts | null): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
}

$.registerInterfaceType(
	"crypto.Signer",
	null,
	[{ name: "Public", args: [], returns: [{ name: "_r0", type: "crypto.PublicKey" }] }, { name: "Sign", args: [{ name: "rand", type: "io.Reader" }, { name: "digest", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "opts", type: "crypto.SignerOpts" }], returns: [{ name: "signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }]
);

export type MessageSigner = {
	Public(): PublicKey | null | globalThis.Promise<PublicKey | null>
	Sign(rand: io.Reader | null, digest: $.Slice<number>, opts: SignerOpts | null): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	SignMessage(rand: io.Reader | null, msg: $.Slice<number>, opts: SignerOpts | null): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
}

$.registerInterfaceType(
	"crypto.MessageSigner",
	null,
	[{ name: "Public", args: [], returns: [{ name: "_r0", type: "crypto.PublicKey" }] }, { name: "Sign", args: [{ name: "rand", type: "io.Reader" }, { name: "digest", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "opts", type: "crypto.SignerOpts" }], returns: [{ name: "signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "SignMessage", args: [{ name: "rand", type: "io.Reader" }, { name: "msg", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "opts", type: "crypto.SignerOpts" }], returns: [{ name: "signature", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }]
);

export type SignerOpts = {
	HashFunc(): Hash | globalThis.Promise<Hash>
}

$.registerInterfaceType(
	"crypto.SignerOpts",
	null,
	[{ name: "HashFunc", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint", typeName: "crypto.Hash" } }] }]
);

export type Decrypter = {
	Decrypt(rand: io.Reader | null, msg: $.Slice<number>, opts: DecrypterOpts | null): [$.Slice<number>, $.GoError] | globalThis.Promise<[$.Slice<number>, $.GoError]>
	Public(): PublicKey | null
}

$.registerInterfaceType(
	"crypto.Decrypter",
	null,
	[{ name: "Decrypt", args: [{ name: "rand", type: "io.Reader" }, { name: "msg", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "opts", type: "crypto.DecrypterOpts" }], returns: [{ name: "plaintext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "Public", args: [], returns: [{ name: "_r0", type: "crypto.PublicKey" }] }]
);

export type DecrypterOpts = any

$.registerInterfaceType(
	"crypto.DecrypterOpts",
	null,
	[]
);

export type Decapsulator = {
	Decapsulate(ciphertext: $.Slice<number>): [$.Slice<number>, $.GoError]
	Encapsulator(): Encapsulator | null
}

$.registerInterfaceType(
	"crypto.Decapsulator",
	null,
	[{ name: "Decapsulate", args: [{ name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "sharedKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "Encapsulator", args: [], returns: [{ name: "_r0", type: "crypto.Encapsulator" }] }]
);

export type Encapsulator = {
	Bytes(): $.Slice<number>
	Encapsulate(): [$.Slice<number>, $.Slice<number>]
}

$.registerInterfaceType(
	"crypto.Encapsulator",
	null,
	[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Encapsulate", args: [], returns: [{ name: "sharedKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }]
);

export const MD4: Hash = 1

export const MD5: Hash = 2

export const SHA1: Hash = 3

export const SHA224: Hash = 4

export const SHA256: Hash = 5

export const SHA384: Hash = 6

export const SHA512: Hash = 7

export const MD5SHA1: Hash = 8

export const RIPEMD160: Hash = 9

export const SHA3_224: Hash = 10

export const SHA3_256: Hash = 11

export const SHA3_384: Hash = 12

export const SHA3_512: Hash = 13

export const SHA512_224: Hash = 14

export const SHA512_256: Hash = 15

export const BLAKE2s_256: Hash = 16

export const BLAKE2b_256: Hash = 17

export const BLAKE2b_384: Hash = 18

export const BLAKE2b_512: Hash = 19

export const maxHash: Hash = 20

export function Hash_HashFunc(h: Hash): Hash {
	return h
}

export function Hash_String(h: Hash): string {
	switch (h) {
		case 1:
		{
			return "MD4"
			break
		}
		case 2:
		{
			return "MD5"
			break
		}
		case 3:
		{
			return "SHA-1"
			break
		}
		case 4:
		{
			return "SHA-224"
			break
		}
		case 5:
		{
			return "SHA-256"
			break
		}
		case 6:
		{
			return "SHA-384"
			break
		}
		case 7:
		{
			return "SHA-512"
			break
		}
		case 8:
		{
			return "MD5+SHA1"
			break
		}
		case 9:
		{
			return "RIPEMD-160"
			break
		}
		case 10:
		{
			return "SHA3-224"
			break
		}
		case 11:
		{
			return "SHA3-256"
			break
		}
		case 12:
		{
			return "SHA3-384"
			break
		}
		case 13:
		{
			return "SHA3-512"
			break
		}
		case 14:
		{
			return "SHA-512/224"
			break
		}
		case 15:
		{
			return "SHA-512/256"
			break
		}
		case 16:
		{
			return "BLAKE2s-256"
			break
		}
		case 17:
		{
			return "BLAKE2b-256"
			break
		}
		case 18:
		{
			return "BLAKE2b-384"
			break
		}
		case 19:
		{
			return "BLAKE2b-512"
			break
		}
		default:
		{
			return "unknown hash value " + strconv.Itoa($.int(h))
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export let digestSizes: $.Slice<number> = new Uint8Array([0, 16, 16, 20, 28, 32, 48, 64, 36, 20, 28, 32, 48, 64, 28, 32, 32, 32, 48, 64]) as $.Slice<number>

export function __goscript_set_digestSizes(__goscriptValue: $.Slice<number>): void {
	digestSizes = __goscriptValue
}

export function Hash_Size(h: Hash): number {
	if ((h > 0) && (h < 20)) {
		return $.int($.arrayIndex(digestSizes!, h))
	}
	$.panic("crypto: Size of unknown hash function")
	throw new globalThis.Error("goscript: unreachable return")
}

export let hashes: $.Slice<(() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null> = $.makeSlice<(() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null>(20)

export function __goscript_set_hashes(__goscriptValue: $.Slice<(() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null>): void {
	hashes = __goscriptValue
}

export async function Hash_New(h: Hash): globalThis.Promise<hash.Hash | null> {
	if ((h > 0) && (h < 20)) {
		let f: (() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null = $.arrayIndex(hashes!, h)
		if (f != null) {
			return f!()
		}
	}
	$.panic(("crypto: requested hash function #" + strconv.Itoa($.int(h))) + " is unavailable")
	throw new globalThis.Error("goscript: unreachable return")
}

export function Hash_Available(h: Hash): boolean {
	return (h < 20) && ($.arrayIndex(hashes!, h) != null)
}

export function RegisterHash(h: Hash, f: (() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null): void {
	if (h >= 20) {
		$.panic("crypto: RegisterHash of unknown hash function")
	}
	hashes![h] = f
}

export async function SignMessage(signer: Signer | null, rand: io.Reader | null, msg: $.Slice<number>, opts: SignerOpts | null): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let signature: $.Slice<number> = null as $.Slice<number>
	let err: $.GoError = null as $.GoError
	{
		let [ms, ok] = $.typeAssertTuple<MessageSigner | null>(signer, "crypto.MessageSigner")
		if (ok) {
			return $.pointerValue<Exclude<MessageSigner, null>>(ms).SignMessage(rand, msg, opts)
		}
	}
	if (await $.pointerValue<Exclude<SignerOpts, null>>(opts).HashFunc() != 0) {
		let h = await Hash_New((await $.pointerValue<Exclude<SignerOpts, null>>(opts).HashFunc()))
		await $.pointerValue<Exclude<hash.Hash, null>>(h).Write(msg)
		msg = await $.pointerValue<Exclude<hash.Hash, null>>(h).Sum(null)
	}
	return $.pointerValue<Exclude<Signer, null>>(signer).Sign(rand, msg, opts)
}

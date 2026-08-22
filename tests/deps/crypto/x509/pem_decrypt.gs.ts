// Generated file based on pem_decrypt.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as aes from "@goscript/crypto/aes/index.js"

import * as cipher2 from "@goscript/crypto/cipher/index.js"

import * as des from "@goscript/crypto/des/index.js"

import * as md5 from "@goscript/crypto/md5/index.js"

import * as hex from "@goscript/encoding/hex/index.js"

import * as pem from "@goscript/encoding/pem/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as strings from "@goscript/strings/index.js"

import * as hash2 from "@goscript/hash/index.js"
import "@goscript/crypto/aes/index.js"
import "@goscript/crypto/cipher/index.js"
import "@goscript/crypto/des/index.js"
import "@goscript/crypto/md5/index.js"
import "@goscript/encoding/hex/index.js"
import "@goscript/encoding/pem/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/strings/index.js"
import "@goscript/hash/index.js"

export type PEMCipher = number

export class rfc1423Algo {
	public get cipher(): PEMCipher {
		return this._fields.cipher.value
	}
	public set cipher(value: PEMCipher) {
		this._fields.cipher.value = value
	}

	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	public get cipherFunc(): ((key: $.Slice<number>) => [cipher2.Block | null, $.GoError] | globalThis.Promise<[cipher2.Block | null, $.GoError]>) | null {
		return this._fields.cipherFunc.value
	}
	public set cipherFunc(value: ((key: $.Slice<number>) => [cipher2.Block | null, $.GoError] | globalThis.Promise<[cipher2.Block | null, $.GoError]>) | null) {
		this._fields.cipherFunc.value = value
	}

	public get keySize(): number {
		return this._fields.keySize.value
	}
	public set keySize(value: number) {
		this._fields.keySize.value = value
	}

	public get blockSize(): number {
		return this._fields.blockSize.value
	}
	public set blockSize(value: number) {
		this._fields.blockSize.value = value
	}

	public _fields: {
		cipher: $.VarRef<PEMCipher>
		name: $.VarRef<string>
		cipherFunc: $.VarRef<((key: $.Slice<number>) => [cipher2.Block | null, $.GoError] | globalThis.Promise<[cipher2.Block | null, $.GoError]>) | null>
		keySize: $.VarRef<number>
		blockSize: $.VarRef<number>
	}

	constructor(init?: Partial<{cipher?: PEMCipher, name?: string, cipherFunc?: ((key: $.Slice<number>) => [cipher2.Block | null, $.GoError] | globalThis.Promise<[cipher2.Block | null, $.GoError]>) | null, keySize?: number, blockSize?: number}>) {
		this._fields = {
			cipher: $.varRef(init?.cipher ?? (0 as PEMCipher)),
			name: $.varRef(init?.name ?? ("" as string)),
			cipherFunc: $.varRef(init?.cipherFunc ?? (null! as ((key: $.Slice<number>) => [cipher2.Block | null, $.GoError] | globalThis.Promise<[cipher2.Block | null, $.GoError]>) | null)),
			keySize: $.varRef(init?.keySize ?? (0 as number)),
			blockSize: $.varRef(init?.blockSize ?? (0 as number))
		}
	}

	public clone(): rfc1423Algo {
		const cloned = new rfc1423Algo()
		cloned._fields = {
			cipher: $.varRef(this._fields.cipher.value),
			name: $.varRef(this._fields.name.value),
			cipherFunc: $.varRef(this._fields.cipherFunc.value),
			keySize: $.varRef(this._fields.keySize.value),
			blockSize: $.varRef(this._fields.blockSize.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async deriveKey(password: $.Slice<number>, salt: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const c = this
		let hash = md5.New()
		let out: $.Slice<number> = $.makeSlice<number>(c.keySize, undefined, "byte")
		let digest: $.Slice<number> = null! as $.Slice<number>

		for (let i = 0; i < $.len(out); i = i + ($.len(digest))) {
			await $.pointerValue<Exclude<hash2.Hash, null>>(hash).Reset()
			await $.pointerValue<Exclude<hash2.Hash, null>>(hash).Write(digest)
			await $.pointerValue<Exclude<hash2.Hash, null>>(hash).Write(password)
			await $.pointerValue<Exclude<hash2.Hash, null>>(hash).Write(salt)
			digest = await $.pointerValue<Exclude<hash2.Hash, null>>(hash).Sum($.goSlice(digest, undefined, 0))
			$.copy($.goSlice(out, i, undefined), digest)
		}
		return out
	}

	static __typeInfo = $.registerStructType(
		"x509.rfc1423Algo",
		() => new rfc1423Algo(),
		[{ name: "deriveKey", args: [{ name: "password", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "salt", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		rfc1423Algo,
		[{ name: "cipher", key: "cipher", type: { kind: $.TypeKind.Basic, name: "int", typeName: "x509.PEMCipher" }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }, { name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "crypto/x509", index: [1], offset: 8, exported: false }, { name: "cipherFunc", key: "cipherFunc", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: ["cipher.Block", "error"] } as $.FunctionTypeInfo), pkgPath: "crypto/x509", index: [2], offset: 24, exported: false }, { name: "keySize", key: "keySize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/x509", index: [3], offset: 32, exported: false }, { name: "blockSize", key: "blockSize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/x509", index: [4], offset: 40, exported: false }]
	)
}

export const PEMCipherDES: PEMCipher = 1

export const PEMCipher3DES: PEMCipher = 2

export const PEMCipherAES128: PEMCipher = 3

export const PEMCipherAES192: PEMCipher = 4

export const PEMCipherAES256: PEMCipher = 5

export let rfc1423Algos: $.Slice<rfc1423Algo> = $.arrayToSlice<rfc1423Algo>([$.markAsStructValue(new rfc1423Algo({cipher: 1, name: "DES-CBC", cipherFunc: des.NewCipher, keySize: 8, blockSize: des.BlockSize})), $.markAsStructValue(new rfc1423Algo({cipher: 2, name: "DES-EDE3-CBC", cipherFunc: des.NewTripleDESCipher, keySize: 24, blockSize: des.BlockSize})), $.markAsStructValue(new rfc1423Algo({cipher: 3, name: "AES-128-CBC", cipherFunc: aes.NewCipher, keySize: 16, blockSize: aes.BlockSize})), $.markAsStructValue(new rfc1423Algo({cipher: 4, name: "AES-192-CBC", cipherFunc: aes.NewCipher, keySize: 24, blockSize: aes.BlockSize})), $.markAsStructValue(new rfc1423Algo({cipher: 5, name: "AES-256-CBC", cipherFunc: aes.NewCipher, keySize: 32, blockSize: aes.BlockSize}))])

export function __goscript_set_rfc1423Algos(__goscriptValue: $.Slice<rfc1423Algo>): void {
	rfc1423Algos = __goscriptValue
}

export function IsEncryptedPEMBlock(b: pem.Block | $.VarRef<pem.Block> | null): boolean {
	let [, ok] = $.mapGet<string, string, string>($.pointerValue<pem.Block>(b).Headers, "DEK-Info", "")
	return ok
}

export let IncorrectPasswordError: $.GoError = errors.New("x509: decryption password incorrect")

export function __goscript_set_IncorrectPasswordError(__goscriptValue: $.GoError): void {
	IncorrectPasswordError = __goscriptValue
}

export async function DecryptPEMBlock(b: pem.Block | $.VarRef<pem.Block> | null, password: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let [dek, ok] = $.mapGet<string, string, string>($.pointerValue<pem.Block>(b).Headers, "DEK-Info", "")
	if (!ok) {
		return [null, errors.New("x509: no DEK-Info header in block")]
	}

	let __goscriptTuple0: any = strings.Cut(dek, ",")
	let mode = __goscriptTuple0[0]
	let hexIV = __goscriptTuple0[1]
	ok = __goscriptTuple0[2]
	if (!ok) {
		return [null, errors.New("x509: malformed DEK-Info header")]
	}

	let ciph: rfc1423Algo | $.VarRef<rfc1423Algo> | null = cipherByName(mode)
	if (ciph == null) {
		return [null, errors.New("x509: unknown encryption mode")]
	}
	let __goscriptTuple1: any = hex.DecodeString(hexIV)
	let iv: $.Slice<number> = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	if (err != null) {
		return [null, err]
	}
	if ($.len(iv) != $.pointerValue<rfc1423Algo>(ciph).blockSize) {
		return [null, errors.New("x509: incorrect IV size")]
	}

	// Based on the OpenSSL implementation. The salt is the first 8 bytes
	// of the initialization vector.
	let key: $.Slice<number> = await $.markAsStructValue($.cloneStructValue($.pointerValue<rfc1423Algo>(ciph))).deriveKey(password, $.goSlice(iv, undefined, 8))
	let __goscriptTuple2: any = await $.pointerValue<rfc1423Algo>(ciph).cipherFunc!(key)
	let block = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if (err != null) {
		return [null, err]
	}

	if (($.len($.pointerValue<pem.Block>(b).Bytes) % await $.pointerValue<Exclude<cipher2.Block, null>>(block).BlockSize()) != 0) {
		return [null, errors.New("x509: encrypted PEM data is not a multiple of the block size")]
	}

	let data: $.Slice<number> = $.makeSlice<number>($.len($.pointerValue<pem.Block>(b).Bytes), undefined, "byte")
	let dec = cipher2.NewCBCDecrypter($.pointerValueOrNil(block)!, iv)
	await $.pointerValue<Exclude<cipher2.BlockMode, null>>(dec).CryptBlocks(data, $.pointerValue<pem.Block>(b).Bytes)

	// Blocks are padded using a scheme where the last n bytes of padding are all
	// equal to n. It can pad from 1 to blocksize bytes inclusive. See RFC 1423.
	// For example:
	//	[x y z 2 2]
	//	[x y 7 7 7 7 7 7 7]
	// If we detect a bad padding, we assume it is an invalid password.
	let dlen = $.len(data)
	if ((dlen == 0) || ((dlen % $.pointerValue<rfc1423Algo>(ciph).blockSize) != 0)) {
		return [null, errors.New("x509: invalid padding")]
	}
	let last = $.int($.arrayIndex(data!, dlen - 1))
	if (dlen < last) {
		return [null, IncorrectPasswordError]
	}
	if ((last == 0) || (last > $.pointerValue<rfc1423Algo>(ciph).blockSize)) {
		return [null, IncorrectPasswordError]
	}
	for (let __goscriptRangeTarget0 = $.goSlice(data, dlen - last, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let val = __goscriptRangeTarget0![__rangeIndex]
		if ($.int(val) != last) {
			return [null, IncorrectPasswordError]
		}
	}
	return [$.goSlice(data, undefined, dlen - last), null]
}

export async function EncryptPEMBlock(rand: io.Reader | null, blockType: string, data: $.Slice<number>, password: $.Slice<number>, alg: PEMCipher): globalThis.Promise<[pem.Block | $.VarRef<pem.Block> | null, $.GoError]> {
	let ciph: rfc1423Algo | $.VarRef<rfc1423Algo> | null = cipherByKey(alg)
	if (ciph == null) {
		return [null, errors.New("x509: unknown encryption mode")]
	}
	let iv: $.Slice<number> = $.makeSlice<number>($.pointerValue<rfc1423Algo>(ciph).blockSize, undefined, "byte")
	{
		let [, err] = await io.ReadFull($.pointerValueOrNil(rand)!, iv)
		if (err != null) {
			return [null, errors.New("x509: cannot generate IV: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())]
		}
	}
	// The salt is the first 8 bytes of the initialization vector,
	// matching the key derivation in DecryptPEMBlock.
	let key: $.Slice<number> = await $.markAsStructValue($.cloneStructValue($.pointerValue<rfc1423Algo>(ciph))).deriveKey(password, $.goSlice(iv, undefined, 8))
	let [block, err] = await $.pointerValue<rfc1423Algo>(ciph).cipherFunc!(key)
	if (err != null) {
		return [null, err]
	}
	let enc = cipher2.NewCBCEncrypter($.pointerValueOrNil(block)!, iv)
	let pad = $.pointerValue<rfc1423Algo>(ciph).blockSize - ($.len(data) % $.pointerValue<rfc1423Algo>(ciph).blockSize)
	let encrypted: $.Slice<number> = $.makeSlice<number>($.len(data), $.len(data) + pad, "byte")
	// We could save this copy by encrypting all the whole blocks in
	// the data separately, but it doesn't seem worth the additional
	// code.
	$.copy(encrypted, data)
	// See RFC 1423, Section 1.1.
	for (let i = 0; i < pad; i++) {
		encrypted = $.append(encrypted, $.uint($.uint(pad, 8), 8), $.byteSliceHint)
	}
	await $.pointerValue<Exclude<cipher2.BlockMode, null>>(enc).CryptBlocks(encrypted, encrypted)

	return [new pem.Block({Type: blockType, Headers: new globalThis.Map<string, string>([["Proc-Type", "4,ENCRYPTED"], ["DEK-Info", ($.pointerValue<rfc1423Algo>(ciph).name + ",") + hex.EncodeToString(iv)]]), Bytes: encrypted}), null]
}

export function cipherByName(name: string): rfc1423Algo | $.VarRef<rfc1423Algo> | null {
	for (let __goscriptRangeTarget1 = rfc1423Algos, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		let alg: rfc1423Algo | $.VarRef<rfc1423Algo> | null = $.indexRef(rfc1423Algos!, i)
		if ($.stringEqual($.pointerValue<rfc1423Algo>(alg).name, name)) {
			return alg
		}
	}
	return null
}

export function cipherByKey(key: PEMCipher): rfc1423Algo | $.VarRef<rfc1423Algo> | null {
	for (let __goscriptRangeTarget2 = rfc1423Algos, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
		let alg: rfc1423Algo | $.VarRef<rfc1423Algo> | null = $.indexRef(rfc1423Algos!, i)
		if ($.pointerValue<rfc1423Algo>(alg).cipher == key) {
			return alg
		}
	}
	return null
}

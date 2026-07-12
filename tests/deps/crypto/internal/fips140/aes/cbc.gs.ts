// Generated file based on cbc.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as alias from "@goscript/crypto/internal/fips140/alias/index.js"

import * as subtle from "@goscript/crypto/internal/fips140/subtle/index.js"

import * as __goscript_aes from "./aes.gs.ts"

import * as __goscript_aes_noasm from "./aes_noasm.gs.ts"

import * as __goscript_cbc_noasm from "./cbc_noasm.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/alias/index.js"
import "@goscript/crypto/internal/fips140/subtle/index.js"
import "./aes.gs.ts"
import "./aes_noasm.gs.ts"
import "./cbc_noasm.gs.ts"

export class CBCEncrypter {
	public get b(): __goscript_aes.Block {
		return this._fields.b.value
	}
	public set b(value: __goscript_aes.Block) {
		this._fields.b.value = value
	}

	public get iv(): Uint8Array {
		return this._fields.iv.value
	}
	public set iv(value: Uint8Array) {
		this._fields.iv.value = value
	}

	public _fields: {
		b: $.VarRef<__goscript_aes.Block>
		iv: $.VarRef<Uint8Array>
	}

	constructor(init?: Partial<{b?: __goscript_aes.Block, iv?: Uint8Array}>) {
		this._fields = {
			b: $.varRef(init?.b ? $.markAsStructValue($.cloneStructValue(init.b)) : $.markAsStructValue(new __goscript_aes.Block())),
			iv: $.varRef(init?.iv !== undefined ? $.cloneArrayValue(init.iv) : new Uint8Array(16))
		}
	}

	public clone(): CBCEncrypter {
		const cloned = new CBCEncrypter()
		cloned._fields = {
			b: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.b.value))),
			iv: $.varRef($.cloneArrayValue(this._fields.iv.value))
		}
		return $.markAsStructValue(cloned)
	}

	public BlockSize(): number {
		const c: CBCEncrypter | $.VarRef<CBCEncrypter> | null = this
		return 16
	}

	public CryptBlocks(dst: $.Slice<number>, src: $.Slice<number>): void {
		const c: CBCEncrypter | $.VarRef<CBCEncrypter> | null = this
		if (($.len(src) % 16) != 0) {
			$.panic("crypto/cipher: input not full blocks")
		}
		if ($.len(dst) < $.len(src)) {
			$.panic("crypto/cipher: output smaller than input")
		}
		if (alias.InexactOverlap($.goSlice(dst, undefined, $.len(src)), src)) {
			$.panic("crypto/cipher: invalid buffer overlap")
		}
		fips140.RecordApproved()
		if ($.len(src) == 0) {
			return
		}
		__goscript_cbc_noasm.cryptBlocksEnc($.pointerValue<CBCEncrypter>(c)._fields.b, $.pointerValue<CBCEncrypter>(c)._fields.iv, dst, src)
	}

	public SetIV(iv: $.Slice<number>): void {
		const x: CBCEncrypter | $.VarRef<CBCEncrypter> | null = this
		if ($.len(iv) != $.len($.pointerValue<CBCEncrypter>(x).iv)) {
			$.panic("cipher: incorrect length IV")
		}
		$.copy($.goSlice($.pointerValue<CBCEncrypter>(x).iv, undefined, undefined), iv)
	}

	static __typeInfo = $.registerStructType(
		"aes.CBCEncrypter",
		() => new CBCEncrypter(),
		[{ name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "CryptBlocks", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "SetIV", args: [{ name: "iv", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }],
		CBCEncrypter,
		[{ name: "b", key: "b", type: "aes.Block", pkgPath: "crypto/internal/fips140/aes", index: [0], offset: 0, exported: false }, { name: "iv", key: "iv", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 16 }, pkgPath: "crypto/internal/fips140/aes", index: [1], offset: 488, exported: false }]
	)
}

export class CBCDecrypter {
	public get b(): __goscript_aes.Block {
		return this._fields.b.value
	}
	public set b(value: __goscript_aes.Block) {
		this._fields.b.value = value
	}

	public get iv(): Uint8Array {
		return this._fields.iv.value
	}
	public set iv(value: Uint8Array) {
		this._fields.iv.value = value
	}

	public _fields: {
		b: $.VarRef<__goscript_aes.Block>
		iv: $.VarRef<Uint8Array>
	}

	constructor(init?: Partial<{b?: __goscript_aes.Block, iv?: Uint8Array}>) {
		this._fields = {
			b: $.varRef(init?.b ? $.markAsStructValue($.cloneStructValue(init.b)) : $.markAsStructValue(new __goscript_aes.Block())),
			iv: $.varRef(init?.iv !== undefined ? $.cloneArrayValue(init.iv) : new Uint8Array(16))
		}
	}

	public clone(): CBCDecrypter {
		const cloned = new CBCDecrypter()
		cloned._fields = {
			b: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.b.value))),
			iv: $.varRef($.cloneArrayValue(this._fields.iv.value))
		}
		return $.markAsStructValue(cloned)
	}

	public BlockSize(): number {
		const c: CBCDecrypter | $.VarRef<CBCDecrypter> | null = this
		return 16
	}

	public CryptBlocks(dst: $.Slice<number>, src: $.Slice<number>): void {
		const c: CBCDecrypter | $.VarRef<CBCDecrypter> | null = this
		if (($.len(src) % 16) != 0) {
			$.panic("crypto/cipher: input not full blocks")
		}
		if ($.len(dst) < $.len(src)) {
			$.panic("crypto/cipher: output smaller than input")
		}
		if (alias.InexactOverlap($.goSlice(dst, undefined, $.len(src)), src)) {
			$.panic("crypto/cipher: invalid buffer overlap")
		}
		fips140.RecordApproved()
		if ($.len(src) == 0) {
			return
		}
		__goscript_cbc_noasm.cryptBlocksDec($.pointerValue<CBCDecrypter>(c)._fields.b, $.pointerValue<CBCDecrypter>(c)._fields.iv, dst, src)
	}

	public SetIV(iv: $.Slice<number>): void {
		const x: CBCDecrypter | $.VarRef<CBCDecrypter> | null = this
		if ($.len(iv) != $.len($.pointerValue<CBCDecrypter>(x).iv)) {
			$.panic("cipher: incorrect length IV")
		}
		$.copy($.goSlice($.pointerValue<CBCDecrypter>(x).iv, undefined, undefined), iv)
	}

	static __typeInfo = $.registerStructType(
		"aes.CBCDecrypter",
		() => new CBCDecrypter(),
		[{ name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "CryptBlocks", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "SetIV", args: [{ name: "iv", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }],
		CBCDecrypter,
		[{ name: "b", key: "b", type: "aes.Block", pkgPath: "crypto/internal/fips140/aes", index: [0], offset: 0, exported: false }, { name: "iv", key: "iv", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 16 }, pkgPath: "crypto/internal/fips140/aes", index: [1], offset: 488, exported: false }]
	)
}

export function NewCBCEncrypter(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, iv: Uint8Array): CBCEncrypter | $.VarRef<CBCEncrypter> | null {
	return new CBCEncrypter({b: $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_aes.Block>(b))), iv: iv})
}

export function cryptBlocksEncGeneric(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, civ: $.VarRef<Uint8Array> | null, dst: $.Slice<number>, src: $.Slice<number>): void {
	let iv: $.Slice<number> = $.goSlice($.pointerValue<Uint8Array>(civ), undefined, undefined)
	while ($.len(src) > 0) {
		// Write the xor to dst, then encrypt in place.
		subtle.XORBytes($.goSlice(dst, undefined, 16), $.goSlice(src, undefined, 16), iv)
		__goscript_aes_noasm.encryptBlock(b, $.goSlice(dst, undefined, 16), $.goSlice(dst, undefined, 16))

		// Move to the next block with this block as the next iv.
		iv = $.goSlice(dst, undefined, 16)
		src = $.goSlice(src, 16, undefined)
		dst = $.goSlice(dst, 16, undefined)
	}

	// Save the iv for the next CryptBlocks call.
	$.copy($.goSlice($.pointerValue<Uint8Array>(civ), undefined, undefined), iv)
}

export function NewCBCDecrypter(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, iv: Uint8Array): CBCDecrypter | $.VarRef<CBCDecrypter> | null {
	return new CBCDecrypter({b: $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_aes.Block>(b))), iv: iv})
}

export function cryptBlocksDecGeneric(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, civ: $.VarRef<Uint8Array> | null, dst: $.Slice<number>, src: $.Slice<number>): void {
	// For each block, we need to xor the decrypted data with the previous
	// block's ciphertext (the iv). To avoid making a copy each time, we loop
	// over the blocks backwards.
	let end = $.len(src)
	let start = end - 16
	let prev = start - 16

	// Copy the last block of ciphertext as the IV of the next call.
	let iv = $.pointerValue<Uint8Array>(civ)
	$.copy($.goSlice($.pointerValue<Uint8Array>(civ), undefined, undefined), $.goSlice(src, start, end))

	while (start >= 0) {
		__goscript_aes_noasm.decryptBlock(b, $.goSlice(dst, start, end), $.goSlice(src, start, end))

		if (start > 0) {
			subtle.XORBytes($.goSlice(dst, start, end), $.goSlice(dst, start, end), $.goSlice(src, prev, start))
		} else {
			// The first block is special because it uses the saved iv.
			subtle.XORBytes($.goSlice(dst, start, end), $.goSlice(dst, start, end), $.goSlice(iv, undefined, undefined))
		}

		end = end - (16)
		start = start - (16)
		prev = prev - (16)
	}
}

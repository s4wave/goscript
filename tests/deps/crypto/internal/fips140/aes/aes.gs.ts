// Generated file based on aes.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as alias from "@goscript/crypto/internal/fips140/alias/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as __goscript_aes_generic from "./aes_generic.gs.ts"

import * as __goscript_aes_noasm from "./aes_noasm.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/alias/index.js"
import "@goscript/strconv/index.js"
import "./aes_generic.gs.ts"
import "./aes_noasm.gs.ts"

export type KeySizeError = number

export class Block {
	public get block(): __goscript_aes_noasm.block {
		return this._fields.block.value
	}
	public set block(value: __goscript_aes_noasm.block) {
		this._fields.block.value = value
	}

	public _fields: {
		block: $.VarRef<__goscript_aes_noasm.block>
	}

	constructor(init?: Partial<{block?: __goscript_aes_noasm.block}>) {
		this._fields = {
			block: $.varRef(init?.block ? $.markAsStructValue($.cloneStructValue(init.block)) : $.markAsStructValue(new __goscript_aes_noasm.block()))
		}
	}

	public clone(): Block {
		const cloned = new Block()
		cloned._fields = {
			block: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.block.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public BlockSize(): number {
		const c: Block | $.VarRef<Block> | null = this
		return 16
	}

	public Decrypt(dst: $.Slice<number>, src: $.Slice<number>): void {
		const c: Block | $.VarRef<Block> | null = this
		// AES-ECB is not approved in FIPS 140-3 mode.
		fips140.RecordNonApproved()
		if ($.len(src) < 16) {
			$.panic("crypto/aes: input not full block")
		}
		if ($.len(dst) < 16) {
			$.panic("crypto/aes: output not full block")
		}
		if (alias.InexactOverlap($.goSlice(dst, undefined, 16), $.goSlice(src, undefined, 16))) {
			$.panic("crypto/aes: invalid buffer overlap")
		}
		__goscript_aes_noasm.decryptBlock(c, dst, src)
	}

	public Encrypt(dst: $.Slice<number>, src: $.Slice<number>): void {
		const c: Block | $.VarRef<Block> | null = this
		// AES-ECB is not approved in FIPS 140-3 mode.
		fips140.RecordNonApproved()
		if ($.len(src) < 16) {
			$.panic("crypto/aes: input not full block")
		}
		if ($.len(dst) < 16) {
			$.panic("crypto/aes: output not full block")
		}
		if (alias.InexactOverlap($.goSlice(dst, undefined, 16), $.goSlice(src, undefined, 16))) {
			$.panic("crypto/aes: invalid buffer overlap")
		}
		__goscript_aes_noasm.encryptBlock(c, dst, src)
	}

	public roundKeysSize(): any {
		return $.pointerValue<__goscript_aes_noasm.block>(this.block).blockExpanded.roundKeysSize()
	}

	static __typeInfo = $.registerStructType(
		"aes.Block",
		() => new Block(),
		[{ name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Decrypt", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Encrypt", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "roundKeysSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		Block,
		[{ name: "block", key: "block", type: "aes.block", pkgPath: "crypto/internal/fips140/aes", anonymous: true, index: [0], offset: 0, exported: false }]
	)
}

export class blockExpanded {
	public get rounds(): number {
		return this._fields.rounds.value
	}
	public set rounds(value: number) {
		this._fields.rounds.value = value
	}

	// Round keys, where only the first (rounds + 1) × (128 ÷ 32) words are used.
	public get enc(): number[] {
		return this._fields.enc.value
	}
	public set enc(value: number[]) {
		this._fields.enc.value = value
	}

	public get dec(): number[] {
		return this._fields.dec.value
	}
	public set dec(value: number[]) {
		this._fields.dec.value = value
	}

	public _fields: {
		rounds: $.VarRef<number>
		enc: $.VarRef<number[]>
		dec: $.VarRef<number[]>
	}

	constructor(init?: Partial<{rounds?: number, enc?: number[], dec?: number[]}>) {
		this._fields = {
			rounds: $.varRef(init?.rounds ?? (0 as number)),
			enc: $.varRef(init?.enc !== undefined ? $.cloneArrayValue(init.enc) : Array.from({ length: 60 }, () => 0)),
			dec: $.varRef(init?.dec !== undefined ? $.cloneArrayValue(init.dec) : Array.from({ length: 60 }, () => 0))
		}
	}

	public clone(): blockExpanded {
		const cloned = new blockExpanded()
		cloned._fields = {
			rounds: $.varRef(this._fields.rounds.value),
			enc: $.varRef($.cloneArrayValue(this._fields.enc.value)),
			dec: $.varRef($.cloneArrayValue(this._fields.dec.value))
		}
		return $.markAsStructValue(cloned)
	}

	public roundKeysSize(): number {
		const b: blockExpanded | $.VarRef<blockExpanded> | null = this
		return ($.pointerValue<blockExpanded>(b).rounds + 1) * (Math.trunc(128 / 32))
	}

	static __typeInfo = $.registerStructType(
		"aes.blockExpanded",
		() => new blockExpanded(),
		[{ name: "roundKeysSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		blockExpanded,
		[{ name: "rounds", key: "rounds", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/fips140/aes", index: [0], offset: 0, exported: false }, { name: "enc", key: "enc", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint32" }, length: 60 }, pkgPath: "crypto/internal/fips140/aes", index: [1], offset: 8, exported: false }, { name: "dec", key: "dec", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint32" }, length: 60 }, pkgPath: "crypto/internal/fips140/aes", index: [2], offset: 248, exported: false }]
	)
}

export const BlockSize: number = 16

export const aes128KeySize: number = 16

export const aes192KeySize: number = 24

export const aes256KeySize: number = 32

export const aes128Rounds: number = 10

export const aes192Rounds: number = 12

export const aes256Rounds: number = 14

export function KeySizeError_Error(k: KeySizeError): string {
	return "crypto/aes: invalid key size " + strconv.Itoa($.int(k))
}

export function New(key: $.Slice<number>): [Block | $.VarRef<Block> | null, $.GoError] {
	// This call is outline to let the allocation happen on the parent stack.
	return newOutlined(new Block(), key)
}

export function newOutlined(b: Block | $.VarRef<Block> | null, key: $.Slice<number>): [Block | $.VarRef<Block> | null, $.GoError] {
	switch ($.len(key)) {
		case 16:
		case 24:
		case 32:
		{
			break
		}
		default:
		{
			return [null, $.namedValueInterfaceValue<$.GoError>($.int($.len(key)), "aes.KeySizeError", {"Error": KeySizeError_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "aes.KeySizeError" })]
			break
		}
	}
	return [__goscript_aes_noasm.newBlock(b, key), null]
}

export function newBlockExpanded(c: blockExpanded | $.VarRef<blockExpanded> | null, key: $.Slice<number>): void {
	switch ($.len(key)) {
		case 16:
		{
			$.pointerValue<blockExpanded>(c).rounds = 10
			break
		}
		case 24:
		{
			$.pointerValue<blockExpanded>(c).rounds = 12
			break
		}
		case 32:
		{
			$.pointerValue<blockExpanded>(c).rounds = 14
			break
		}
	}
	__goscript_aes_generic.expandKeyGeneric(c, key)
}

export function EncryptBlockInternal(c: Block | $.VarRef<Block> | null, dst: $.Slice<number>, src: $.Slice<number>): void {
	__goscript_aes_noasm.encryptBlock(c, dst, src)
}

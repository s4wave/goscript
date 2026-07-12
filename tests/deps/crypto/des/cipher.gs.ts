// Generated file based on cipher.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as sync from "@goscript/sync/index.js"

import * as cipher from "@goscript/crypto/cipher/index.js"

import * as alias from "@goscript/crypto/internal/fips140/alias/index.js"

import * as fips140only from "@goscript/crypto/internal/fips140only/index.js"

import * as errors from "@goscript/errors/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as __goscript__const from "./const.gs.ts"

import * as __goscript_block from "./block.gs.ts"
import "@goscript/internal/byteorder/index.js"
import "@goscript/sync/index.js"
import "@goscript/crypto/cipher/index.js"
import "@goscript/crypto/internal/fips140/alias/index.js"
import "@goscript/crypto/internal/fips140only/index.js"
import "@goscript/errors/index.js"
import "@goscript/strconv/index.js"
import "./const.gs.ts"
import "./block.gs.ts"

export type KeySizeError = number

export class desCipher {
	public get subkeys(): bigint[] {
		return this._fields.subkeys.value
	}
	public set subkeys(value: bigint[]) {
		this._fields.subkeys.value = value
	}

	public _fields: {
		subkeys: $.VarRef<bigint[]>
	}

	constructor(init?: Partial<{subkeys?: bigint[]}>) {
		this._fields = {
			subkeys: $.varRef(init?.subkeys !== undefined ? $.cloneArrayValue(init.subkeys) : Array.from({ length: 16 }, () => 0n))
		}
	}

	public clone(): desCipher {
		const cloned = new desCipher()
		cloned._fields = {
			subkeys: $.varRef($.cloneArrayValue(this._fields.subkeys.value))
		}
		return $.markAsStructValue(cloned)
	}

	public BlockSize(): number {
		const c: desCipher | $.VarRef<desCipher> | null = this
		return 8
	}

	public Decrypt(dst: $.Slice<number>, src: $.Slice<number>): void {
		const c: desCipher | $.VarRef<desCipher> | null = this
		if ($.len(src) < 8) {
			$.panic("crypto/des: input not full block")
		}
		if ($.len(dst) < 8) {
			$.panic("crypto/des: output not full block")
		}
		if (alias.InexactOverlap($.goSlice(dst, undefined, 8), $.goSlice(src, undefined, 8))) {
			$.panic("crypto/des: invalid buffer overlap")
		}
		__goscript_block.cryptBlock($.goSlice($.pointerValue<desCipher>(c).subkeys, undefined, undefined), dst, src, true)
	}

	public Encrypt(dst: $.Slice<number>, src: $.Slice<number>): void {
		const c: desCipher | $.VarRef<desCipher> | null = this
		if ($.len(src) < 8) {
			$.panic("crypto/des: input not full block")
		}
		if ($.len(dst) < 8) {
			$.panic("crypto/des: output not full block")
		}
		if (alias.InexactOverlap($.goSlice(dst, undefined, 8), $.goSlice(src, undefined, 8))) {
			$.panic("crypto/des: invalid buffer overlap")
		}
		__goscript_block.cryptBlock($.goSlice($.pointerValue<desCipher>(c).subkeys, undefined, undefined), dst, src, false)
	}

	public async generateSubkeys(keyBytes: $.Slice<number>): globalThis.Promise<void> {
		let c: desCipher | $.VarRef<desCipher> | null = this
		await $.pointerValue<sync.Once>(__goscript_block.feistelBoxOnce).Do(__goscript_block.initFeistelBox)

		let key = byteorder.BEUint64(keyBytes)
		let permutedKey = __goscript_block.permuteBlock(key, $.goSlice(__goscript__const.permutedChoice1, undefined, undefined))

		let leftRotations: $.Slice<number> = __goscript_block.ksRotate($.uint($.uint($.uint64Shr(permutedKey, 28n), 32), 32))
		let rightRotations: $.Slice<number> = __goscript_block.ksRotate($.uint($.uintShr($.uint($.uint64Shl(permutedKey, 4n), 32), 4, 32), 32))

		for (let i = 0; i < 16; i++) {

			let pc2Input = $.uint64Or(($.uint64Shl($.uint64($.arrayIndex(leftRotations!, i)), 28n)), $.uint64($.arrayIndex(rightRotations!, i)))

			$.pointerValue<desCipher>(c).subkeys[i] = __goscript_block.unpack(__goscript_block.permuteBlock(pc2Input, $.goSlice(__goscript__const.permutedChoice2, undefined, undefined)))
		}
	}

	static __typeInfo = $.registerStructType(
		"des.desCipher",
		() => new desCipher(),
		[{ name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Decrypt", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Encrypt", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "generateSubkeys", args: [{ name: "keyBytes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }],
		desCipher,
		[{ name: "subkeys", key: "subkeys", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint64" }, length: 16 }, pkgPath: "crypto/des", index: [0], offset: 0, exported: false }]
	)
}

export class tripleDESCipher {
	public get cipher1(): desCipher {
		return this._fields.cipher1.value
	}
	public set cipher1(value: desCipher) {
		this._fields.cipher1.value = value
	}

	public get cipher2(): desCipher {
		return this._fields.cipher2.value
	}
	public set cipher2(value: desCipher) {
		this._fields.cipher2.value = value
	}

	public get cipher3(): desCipher {
		return this._fields.cipher3.value
	}
	public set cipher3(value: desCipher) {
		this._fields.cipher3.value = value
	}

	public _fields: {
		cipher1: $.VarRef<desCipher>
		cipher2: $.VarRef<desCipher>
		cipher3: $.VarRef<desCipher>
	}

	constructor(init?: Partial<{cipher1?: desCipher, cipher2?: desCipher, cipher3?: desCipher}>) {
		this._fields = {
			cipher1: $.varRef(init?.cipher1 ? $.markAsStructValue($.cloneStructValue(init.cipher1)) : $.markAsStructValue(new desCipher())),
			cipher2: $.varRef(init?.cipher2 ? $.markAsStructValue($.cloneStructValue(init.cipher2)) : $.markAsStructValue(new desCipher())),
			cipher3: $.varRef(init?.cipher3 ? $.markAsStructValue($.cloneStructValue(init.cipher3)) : $.markAsStructValue(new desCipher()))
		}
	}

	public clone(): tripleDESCipher {
		const cloned = new tripleDESCipher()
		cloned._fields = {
			cipher1: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.cipher1.value))),
			cipher2: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.cipher2.value))),
			cipher3: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.cipher3.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public BlockSize(): number {
		const c: tripleDESCipher | $.VarRef<tripleDESCipher> | null = this
		return 8
	}

	public Decrypt(dst: $.Slice<number>, src: $.Slice<number>): void {
		const c: tripleDESCipher | $.VarRef<tripleDESCipher> | null = this
		if ($.len(src) < 8) {
			$.panic("crypto/des: input not full block")
		}
		if ($.len(dst) < 8) {
			$.panic("crypto/des: output not full block")
		}
		if (alias.InexactOverlap($.goSlice(dst, undefined, 8), $.goSlice(src, undefined, 8))) {
			$.panic("crypto/des: invalid buffer overlap")
		}

		let b = byteorder.BEUint64(src)
		b = __goscript_block.permuteInitialBlock(b)
		let left = $.uint($.uint($.uint64Shr(b, 32n), 32), 32)
		let right = $.uint($.uint(b, 32), 32)

		left = $.uint((left << 1) | ($.uintShr(left, 31, 32)), 32)
		right = $.uint((right << 1) | ($.uintShr(right, 31, 32)), 32)

		for (let i = 0; i < 8; i++) {
			let __goscriptTuple0: any = __goscript_block.feistel($.uint(left, 32), $.uint(right, 32), $.arrayIndex($.pointerValue<tripleDESCipher>(c).cipher3.subkeys, 15 - (2 * i)), $.arrayIndex($.pointerValue<tripleDESCipher>(c).cipher3.subkeys, 15 - ((2 * i) + 1)))
			left = $.uint(__goscriptTuple0[0], 32)
			right = $.uint(__goscriptTuple0[1], 32)
		}
		for (let i = 0; i < 8; i++) {
			let __goscriptTuple1: any = __goscript_block.feistel($.uint(right, 32), $.uint(left, 32), $.arrayIndex($.pointerValue<tripleDESCipher>(c).cipher2.subkeys, 2 * i), $.arrayIndex($.pointerValue<tripleDESCipher>(c).cipher2.subkeys, (2 * i) + 1))
			right = $.uint(__goscriptTuple1[0], 32)
			left = $.uint(__goscriptTuple1[1], 32)
		}
		for (let i = 0; i < 8; i++) {
			let __goscriptTuple2: any = __goscript_block.feistel($.uint(left, 32), $.uint(right, 32), $.arrayIndex($.pointerValue<tripleDESCipher>(c).cipher1.subkeys, 15 - (2 * i)), $.arrayIndex($.pointerValue<tripleDESCipher>(c).cipher1.subkeys, 15 - ((2 * i) + 1)))
			left = $.uint(__goscriptTuple2[0], 32)
			right = $.uint(__goscriptTuple2[1], 32)
		}

		left = $.uint((left << 31) | ($.uintShr(left, 1, 32)), 32)
		right = $.uint((right << 31) | ($.uintShr(right, 1, 32)), 32)

		let preOutput = $.uint64Add(($.uint64Mul($.uint64(right), (2 ** 32))), $.uint64(left))
		byteorder.BEPutUint64(dst, __goscript_block.permuteFinalBlock(preOutput))
	}

	public Encrypt(dst: $.Slice<number>, src: $.Slice<number>): void {
		const c: tripleDESCipher | $.VarRef<tripleDESCipher> | null = this
		if ($.len(src) < 8) {
			$.panic("crypto/des: input not full block")
		}
		if ($.len(dst) < 8) {
			$.panic("crypto/des: output not full block")
		}
		if (alias.InexactOverlap($.goSlice(dst, undefined, 8), $.goSlice(src, undefined, 8))) {
			$.panic("crypto/des: invalid buffer overlap")
		}

		let b = byteorder.BEUint64(src)
		b = __goscript_block.permuteInitialBlock(b)
		let left = $.uint($.uint($.uint64Shr(b, 32n), 32), 32)
		let right = $.uint($.uint(b, 32), 32)

		left = $.uint((left << 1) | ($.uintShr(left, 31, 32)), 32)
		right = $.uint((right << 1) | ($.uintShr(right, 31, 32)), 32)

		for (let i = 0; i < 8; i++) {
			let __goscriptTuple3: any = __goscript_block.feistel($.uint(left, 32), $.uint(right, 32), $.arrayIndex($.pointerValue<tripleDESCipher>(c).cipher1.subkeys, 2 * i), $.arrayIndex($.pointerValue<tripleDESCipher>(c).cipher1.subkeys, (2 * i) + 1))
			left = $.uint(__goscriptTuple3[0], 32)
			right = $.uint(__goscriptTuple3[1], 32)
		}
		for (let i = 0; i < 8; i++) {
			let __goscriptTuple4: any = __goscript_block.feistel($.uint(right, 32), $.uint(left, 32), $.arrayIndex($.pointerValue<tripleDESCipher>(c).cipher2.subkeys, 15 - (2 * i)), $.arrayIndex($.pointerValue<tripleDESCipher>(c).cipher2.subkeys, 15 - ((2 * i) + 1)))
			right = $.uint(__goscriptTuple4[0], 32)
			left = $.uint(__goscriptTuple4[1], 32)
		}
		for (let i = 0; i < 8; i++) {
			let __goscriptTuple5: any = __goscript_block.feistel($.uint(left, 32), $.uint(right, 32), $.arrayIndex($.pointerValue<tripleDESCipher>(c).cipher3.subkeys, 2 * i), $.arrayIndex($.pointerValue<tripleDESCipher>(c).cipher3.subkeys, (2 * i) + 1))
			left = $.uint(__goscriptTuple5[0], 32)
			right = $.uint(__goscriptTuple5[1], 32)
		}

		left = $.uint((left << 31) | ($.uintShr(left, 1, 32)), 32)
		right = $.uint((right << 31) | ($.uintShr(right, 1, 32)), 32)

		let preOutput = $.uint64Add(($.uint64Mul($.uint64(right), (2 ** 32))), $.uint64(left))
		byteorder.BEPutUint64(dst, __goscript_block.permuteFinalBlock(preOutput))
	}

	static __typeInfo = $.registerStructType(
		"des.tripleDESCipher",
		() => new tripleDESCipher(),
		[{ name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Decrypt", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Encrypt", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }],
		tripleDESCipher,
		[{ name: "cipher1", key: "cipher1", type: "des.desCipher", pkgPath: "crypto/des", index: [0], offset: 0, exported: false }, { name: "cipher2", key: "cipher2", type: "des.desCipher", pkgPath: "crypto/des", index: [1], offset: 128, exported: false }, { name: "cipher3", key: "cipher3", type: "des.desCipher", pkgPath: "crypto/des", index: [2], offset: 256, exported: false }]
	)
}

export const BlockSize: number = 8

export function KeySizeError_Error(k: KeySizeError): string {
	return "crypto/des: invalid key size " + strconv.Itoa($.int(k))
}

export async function NewCipher(key: $.Slice<number>): globalThis.Promise<[cipher.Block | null, $.GoError]> {
	if (fips140only.Enforced()) {
		return [null, errors.New("crypto/des: use of DES is not allowed in FIPS 140-only mode")]
	}

	if ($.len(key) != 8) {
		return [null, $.namedValueInterfaceValue<$.GoError>($.int($.len(key)), "des.KeySizeError", {"Error": KeySizeError_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "des.KeySizeError" })]
	}

	let c: desCipher | $.VarRef<desCipher> | null = new desCipher()
	await desCipher.prototype.generateSubkeys.call(c, key)
	return [$.interfaceValue<cipher.Block | null>(c, "*des.desCipher", { kind: $.TypeKind.Pointer, elemType: "des.desCipher" }), null]
}

export async function NewTripleDESCipher(key: $.Slice<number>): globalThis.Promise<[cipher.Block | null, $.GoError]> {
	if (fips140only.Enforced()) {
		return [null, errors.New("crypto/des: use of TripleDES is not allowed in FIPS 140-only mode")]
	}

	if ($.len(key) != 24) {
		return [null, $.namedValueInterfaceValue<$.GoError>($.int($.len(key)), "des.KeySizeError", {"Error": KeySizeError_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "des.KeySizeError" })]
	}

	let c: tripleDESCipher | $.VarRef<tripleDESCipher> | null = new tripleDESCipher()
	await $.pointerValue<tripleDESCipher>(c).cipher1.generateSubkeys($.goSlice(key, undefined, 8))
	await $.pointerValue<tripleDESCipher>(c).cipher2.generateSubkeys($.goSlice(key, 8, 16))
	await $.pointerValue<tripleDESCipher>(c).cipher3.generateSubkeys($.goSlice(key, 16, undefined))
	return [$.interfaceValue<cipher.Block | null>(c, "*des.tripleDESCipher", { kind: $.TypeKind.Pointer, elemType: "des.tripleDESCipher" }), null]
}

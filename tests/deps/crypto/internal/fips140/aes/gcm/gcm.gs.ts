// Generated file based on gcm.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as aes from "@goscript/crypto/internal/fips140/aes/index.js"

import * as alias from "@goscript/crypto/internal/fips140/alias/index.js"

import * as errors from "@goscript/errors/index.js"

import * as __goscript_gcm_noasm from "./gcm_noasm.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/aes/index.js"
import "@goscript/crypto/internal/fips140/alias/index.js"
import "@goscript/errors/index.js"
import "./gcm_noasm.gs.ts"

export class GCM {
	public get cipher(): aes.Block {
		return this._fields.cipher.value
	}
	public set cipher(value: aes.Block) {
		this._fields.cipher.value = value
	}

	public get nonceSize(): number {
		return this._fields.nonceSize.value
	}
	public set nonceSize(value: number) {
		this._fields.nonceSize.value = value
	}

	public get tagSize(): number {
		return this._fields.tagSize.value
	}
	public set tagSize(value: number) {
		this._fields.tagSize.value = value
	}

	public get gcmPlatformData(): __goscript_gcm_noasm.gcmPlatformData {
		return this._fields.gcmPlatformData.value
	}
	public set gcmPlatformData(value: __goscript_gcm_noasm.gcmPlatformData) {
		this._fields.gcmPlatformData.value = value
	}

	public _fields: {
		cipher: $.VarRef<aes.Block>
		nonceSize: $.VarRef<number>
		tagSize: $.VarRef<number>
		gcmPlatformData: $.VarRef<__goscript_gcm_noasm.gcmPlatformData>
	}

	constructor(init?: Partial<{cipher?: aes.Block, nonceSize?: number, tagSize?: number, gcmPlatformData?: __goscript_gcm_noasm.gcmPlatformData}>) {
		this._fields = {
			cipher: $.varRef(init?.cipher ? $.markAsStructValue($.cloneStructValue(init.cipher)) : $.markAsStructValue(new aes.Block())),
			nonceSize: $.varRef(init?.nonceSize ?? (0 as number)),
			tagSize: $.varRef(init?.tagSize ?? (0 as number)),
			gcmPlatformData: $.varRef(init?.gcmPlatformData ? $.markAsStructValue($.cloneStructValue(init.gcmPlatformData)) : $.markAsStructValue(new __goscript_gcm_noasm.gcmPlatformData()))
		}
	}

	public clone(): GCM {
		const cloned = new GCM()
		cloned._fields = {
			cipher: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.cipher.value))),
			nonceSize: $.varRef(this._fields.nonceSize.value),
			tagSize: $.varRef(this._fields.tagSize.value),
			gcmPlatformData: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.gcmPlatformData.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public NonceSize(): number {
		const g: GCM | $.VarRef<GCM> | null = this
		return $.pointerValue<GCM>(g).nonceSize
	}

	public Open(dst: $.Slice<number>, nonce: $.Slice<number>, ciphertext: $.Slice<number>, data: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const g: GCM | $.VarRef<GCM> | null = this
		if ($.len(nonce) != $.pointerValue<GCM>(g).nonceSize) {
			$.panic("crypto/cipher: incorrect nonce length given to GCM")
		}
		// Sanity check to prevent the authentication from always succeeding if an
		// implementation leaves tagSize uninitialized, for example.
		if ($.pointerValue<GCM>(g).tagSize < 12) {
			$.panic("crypto/cipher: incorrect GCM tag size")
		}

		if ($.len(ciphertext) < $.pointerValue<GCM>(g).tagSize) {
			return [null, errOpen]
		}
		if ($.uint64($.len(ciphertext)) > ($.uint64Add(68719476704n, $.uint64($.pointerValue<GCM>(g).tagSize)))) {
			return [null, errOpen]
		}

		let __goscriptTuple0: any = sliceForAppend(dst, $.len(ciphertext) - $.pointerValue<GCM>(g).tagSize)
		let ret: $.Slice<number> = __goscriptTuple0[0]
		let out: $.Slice<number> = __goscriptTuple0[1]
		if (alias.InexactOverlap(out, ciphertext)) {
			$.panic("crypto/cipher: invalid buffer overlap of output and input")
		}
		if (alias.AnyOverlap(out, data)) {
			$.panic("crypto/cipher: invalid buffer overlap of output and additional data")
		}

		fips140.RecordApproved()
		{
			let err = __goscript_gcm_noasm.open(out, g, nonce, ciphertext, data)
			if (err != null) {
				// We sometimes decrypt and authenticate concurrently, so we overwrite
				// dst in the event of a tag mismatch. To be consistent across platforms
				// and to avoid releasing unauthenticated plaintext, we clear the buffer
				// in the event of an error.
				$.clear(out)
				return [null, err]
			}
		}
		return [ret, null]
	}

	public Overhead(): number {
		const g: GCM | $.VarRef<GCM> | null = this
		return $.pointerValue<GCM>(g).tagSize
	}

	public Seal(dst: $.Slice<number>, nonce: $.Slice<number>, plaintext: $.Slice<number>, data: $.Slice<number>): $.Slice<number> {
		const g: GCM | $.VarRef<GCM> | null = this
		fips140.RecordNonApproved()
		return GCM.prototype.sealAfterIndicator.call(g, dst, nonce, plaintext, data)
	}

	public sealAfterIndicator(dst: $.Slice<number>, nonce: $.Slice<number>, plaintext: $.Slice<number>, data: $.Slice<number>): $.Slice<number> {
		const g: GCM | $.VarRef<GCM> | null = this
		if ($.len(nonce) != $.pointerValue<GCM>(g).nonceSize) {
			$.panic("crypto/cipher: incorrect nonce length given to GCM")
		}
		if ($.pointerValue<GCM>(g).nonceSize == 0) {
			$.panic("crypto/cipher: incorrect GCM nonce size")
		}
		if ($.uint64($.len(plaintext)) > 68719476704n) {
			$.panic("crypto/cipher: message too large for GCM")
		}

		let __goscriptTuple1: any = sliceForAppend(dst, $.len(plaintext) + $.pointerValue<GCM>(g).tagSize)
		let ret: $.Slice<number> = __goscriptTuple1[0]
		let out: $.Slice<number> = __goscriptTuple1[1]
		if (alias.InexactOverlap(out, plaintext)) {
			$.panic("crypto/cipher: invalid buffer overlap of output and input")
		}
		if (alias.AnyOverlap(out, data)) {
			$.panic("crypto/cipher: invalid buffer overlap of output and additional data")
		}

		__goscript_gcm_noasm.seal(out, g, nonce, plaintext, data)
		return ret
	}

	static __typeInfo = $.registerStructType(
		"gcm.GCM",
		() => new GCM(),
		[{ name: "NonceSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Open", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Overhead", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Seal", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "plaintext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "sealAfterIndicator", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "plaintext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		GCM,
		[{ name: "cipher", key: "cipher", type: "aes.Block", pkgPath: "crypto/internal/fips140/aes/gcm", index: [0], offset: 0, exported: false }, { name: "nonceSize", key: "nonceSize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [1], offset: 488, exported: false }, { name: "tagSize", key: "tagSize", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [2], offset: 496, exported: false }, { name: "gcmPlatformData", key: "gcmPlatformData", type: "gcm.gcmPlatformData", pkgPath: "crypto/internal/fips140/aes/gcm", anonymous: true, index: [3], offset: 504, exported: false }]
	)
}

export const gcmBlockSize: number = 16

export const gcmTagSize: number = 16

export const gcmMinimumTagSize: number = 12

export const gcmStandardNonceSize: number = 12

export function New(cipher: aes.Block | $.VarRef<aes.Block> | null, nonceSize: number, tagSize: number): [GCM | $.VarRef<GCM> | null, $.GoError] {
	// This function is outlined to let the allocation happen on the parent stack.
	return newGCM(new GCM(), cipher, nonceSize, tagSize)
}

export function newGCM(g: GCM | $.VarRef<GCM> | null, cipher: aes.Block | $.VarRef<aes.Block> | null, nonceSize: number, tagSize: number): [GCM | $.VarRef<GCM> | null, $.GoError] {
	if ((tagSize < 12) || (tagSize > 16)) {
		return [null, errors.New("cipher: incorrect tag size given to GCM")]
	}
	if (nonceSize <= 0) {
		return [null, errors.New("cipher: the nonce can't have zero length")]
	}
	if (aes.Block.prototype.BlockSize.call(cipher) != 16) {
		return [null, errors.New("cipher: NewGCM requires 128-bit block cipher")]
	}
	$.pointerValue<GCM>(g).cipher = $.markAsStructValue($.cloneStructValue($.pointerValue<aes.Block>(cipher)))
	$.pointerValue<GCM>(g).nonceSize = nonceSize
	$.pointerValue<GCM>(g).tagSize = tagSize
	__goscript_gcm_noasm.initGCM(g)
	return [g, null]
}

export let errOpen: $.GoError = errors.New("cipher: message authentication failed")

export function __goscript_set_errOpen(__goscriptValue: $.GoError): void {
	errOpen = __goscriptValue
}

export function sliceForAppend(_in: $.Slice<number>, n: number): [$.Slice<number>, $.Slice<number>] {
	let head: $.Slice<number> = null as $.Slice<number>
	let tail: $.Slice<number> = null as $.Slice<number>
	{
		let total = $.len(_in) + n
		if ($.cap(_in) >= total) {
			head = $.goSlice(_in, undefined, total)
		} else {
			head = $.makeSlice<number>(total, undefined, "byte")
			$.copy(head, _in)
		}
	}
	tail = $.goSlice(head, $.len(_in), undefined)
	return [head, tail]
}

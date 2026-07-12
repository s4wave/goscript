// Generated file based on gcm_nonces.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as aes from "@goscript/crypto/internal/fips140/aes/index.js"

import * as alias from "@goscript/crypto/internal/fips140/alias/index.js"

import * as drbg from "@goscript/crypto/internal/fips140/drbg/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as errors from "@goscript/errors/index.js"

import * as math from "@goscript/math/index.js"

import * as __goscript_gcm from "./gcm.gs.ts"

import * as __goscript_gcm_noasm from "./gcm_noasm.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/aes/index.js"
import "@goscript/crypto/internal/fips140/alias/index.js"
import "@goscript/crypto/internal/fips140/drbg/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/errors/index.js"
import "@goscript/math/index.js"
import "./gcm.gs.ts"
import "./gcm_noasm.gs.ts"

export class GCMWithCounterNonce {
	public get g(): __goscript_gcm.GCM {
		return this._fields.g.value
	}
	public set g(value: __goscript_gcm.GCM) {
		this._fields.g.value = value
	}

	public get prefixReady(): boolean {
		return this._fields.prefixReady.value
	}
	public set prefixReady(value: boolean) {
		this._fields.prefixReady.value = value
	}

	public get prefix(): number {
		return this._fields.prefix.value
	}
	public set prefix(value: number) {
		this._fields.prefix.value = value
	}

	public get startReady(): boolean {
		return this._fields.startReady.value
	}
	public set startReady(value: boolean) {
		this._fields.startReady.value = value
	}

	public get start(): bigint {
		return this._fields.start.value
	}
	public set start(value: bigint) {
		this._fields.start.value = value
	}

	public get next(): bigint {
		return this._fields.next.value
	}
	public set next(value: bigint) {
		this._fields.next.value = value
	}

	public _fields: {
		g: $.VarRef<__goscript_gcm.GCM>
		prefixReady: $.VarRef<boolean>
		prefix: $.VarRef<number>
		startReady: $.VarRef<boolean>
		start: $.VarRef<bigint>
		next: $.VarRef<bigint>
	}

	constructor(init?: Partial<{g?: __goscript_gcm.GCM, prefixReady?: boolean, prefix?: number, startReady?: boolean, start?: bigint, next?: bigint}>) {
		this._fields = {
			g: $.varRef(init?.g ? $.markAsStructValue($.cloneStructValue(init.g)) : $.markAsStructValue(new __goscript_gcm.GCM())),
			prefixReady: $.varRef(init?.prefixReady ?? (false as boolean)),
			prefix: $.varRef(init?.prefix ?? (0 as number)),
			startReady: $.varRef(init?.startReady ?? (false as boolean)),
			start: $.varRef(init?.start ?? (0n as bigint)),
			next: $.varRef(init?.next ?? (0n as bigint))
		}
	}

	public clone(): GCMWithCounterNonce {
		const cloned = new GCMWithCounterNonce()
		cloned._fields = {
			g: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.g.value))),
			prefixReady: $.varRef(this._fields.prefixReady.value),
			prefix: $.varRef(this._fields.prefix.value),
			startReady: $.varRef(this._fields.startReady.value),
			start: $.varRef(this._fields.start.value),
			next: $.varRef(this._fields.next.value)
		}
		return $.markAsStructValue(cloned)
	}

	public NonceSize(): number {
		const g: GCMWithCounterNonce | $.VarRef<GCMWithCounterNonce> | null = this
		return 12
	}

	public Open(dst: $.Slice<number>, nonce: $.Slice<number>, ciphertext: $.Slice<number>, data: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const g: GCMWithCounterNonce | $.VarRef<GCMWithCounterNonce> | null = this
		fips140.RecordApproved()
		return $.pointerValue<GCMWithCounterNonce>(g).g.Open(dst, nonce, ciphertext, data)
	}

	public Overhead(): number {
		const g: GCMWithCounterNonce | $.VarRef<GCMWithCounterNonce> | null = this
		return 16
	}

	public Seal(dst: $.Slice<number>, nonce: $.Slice<number>, plaintext: $.Slice<number>, data: $.Slice<number>): $.Slice<number> {
		let g: GCMWithCounterNonce | $.VarRef<GCMWithCounterNonce> | null = this
		if ($.len(nonce) != 12) {
			$.panic("crypto/cipher: incorrect nonce length given to GCM")
		}

		if (fips140.Enabled) {
			if (!$.pointerValue<GCMWithCounterNonce>(g).prefixReady) {
				// The first invocation sets the fixed prefix.
				$.pointerValue<GCMWithCounterNonce>(g).prefixReady = true
				$.pointerValue<GCMWithCounterNonce>(g).prefix = $.uint(byteorder.BEUint32($.goSlice(nonce, undefined, 4)), 32)
			}
			if ($.uint($.pointerValue<GCMWithCounterNonce>(g).prefix, 32) != $.uint(byteorder.BEUint32($.goSlice(nonce, undefined, 4)), 32)) {
				$.panic("crypto/cipher: GCM nonce prefix changed")
			}

			let counter = byteorder.BEUint64($.goSlice(nonce, $.len(nonce) - 8, undefined))
			if (!$.pointerValue<GCMWithCounterNonce>(g).startReady) {
				// The first invocation sets the starting counter, if not fixed.
				$.pointerValue<GCMWithCounterNonce>(g).startReady = true
				$.pointerValue<GCMWithCounterNonce>(g).start = counter
			}
			counter = $.uint64Sub(counter, $.pointerValue<GCMWithCounterNonce>(g).start)

			// Ensure the counter is strictly increasing.
			if (counter == 18446744073709551615n) {
				$.panic("crypto/cipher: counter exhausted")
			}
			if (counter < $.pointerValue<GCMWithCounterNonce>(g).next) {
				$.panic("crypto/cipher: counter decreased or remained the same")
			}
			$.pointerValue<GCMWithCounterNonce>(g).next = $.uint64Add(counter, 1n)
		}

		fips140.RecordApproved()
		return $.pointerValue<GCMWithCounterNonce>(g).g.sealAfterIndicator(dst, nonce, plaintext, data)
	}

	static __typeInfo = $.registerStructType(
		"gcm.GCMWithCounterNonce",
		() => new GCMWithCounterNonce(),
		[{ name: "NonceSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Open", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Overhead", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Seal", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "plaintext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		GCMWithCounterNonce,
		[{ name: "g", key: "g", type: "gcm.GCM", pkgPath: "crypto/internal/fips140/aes/gcm", index: [0], offset: 0, exported: false }, { name: "prefixReady", key: "prefixReady", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [1], offset: 512, exported: false }, { name: "prefix", key: "prefix", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [2], offset: 516, exported: false }, { name: "startReady", key: "startReady", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [3], offset: 520, exported: false }, { name: "start", key: "start", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [4], offset: 528, exported: false }, { name: "next", key: "next", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [5], offset: 536, exported: false }]
	)
}

export class GCMWithXORCounterNonce {
	public get g(): __goscript_gcm.GCM {
		return this._fields.g.value
	}
	public set g(value: __goscript_gcm.GCM) {
		this._fields.g.value = value
	}

	public get ready(): boolean {
		return this._fields.ready.value
	}
	public set ready(value: boolean) {
		this._fields.ready.value = value
	}

	public get prefix(): number {
		return this._fields.prefix.value
	}
	public set prefix(value: number) {
		this._fields.prefix.value = value
	}

	public get mask(): bigint {
		return this._fields.mask.value
	}
	public set mask(value: bigint) {
		this._fields.mask.value = value
	}

	public get next(): bigint {
		return this._fields.next.value
	}
	public set next(value: bigint) {
		this._fields.next.value = value
	}

	public _fields: {
		g: $.VarRef<__goscript_gcm.GCM>
		ready: $.VarRef<boolean>
		prefix: $.VarRef<number>
		mask: $.VarRef<bigint>
		next: $.VarRef<bigint>
	}

	constructor(init?: Partial<{g?: __goscript_gcm.GCM, ready?: boolean, prefix?: number, mask?: bigint, next?: bigint}>) {
		this._fields = {
			g: $.varRef(init?.g ? $.markAsStructValue($.cloneStructValue(init.g)) : $.markAsStructValue(new __goscript_gcm.GCM())),
			ready: $.varRef(init?.ready ?? (false as boolean)),
			prefix: $.varRef(init?.prefix ?? (0 as number)),
			mask: $.varRef(init?.mask ?? (0n as bigint)),
			next: $.varRef(init?.next ?? (0n as bigint))
		}
	}

	public clone(): GCMWithXORCounterNonce {
		const cloned = new GCMWithXORCounterNonce()
		cloned._fields = {
			g: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.g.value))),
			ready: $.varRef(this._fields.ready.value),
			prefix: $.varRef(this._fields.prefix.value),
			mask: $.varRef(this._fields.mask.value),
			next: $.varRef(this._fields.next.value)
		}
		return $.markAsStructValue(cloned)
	}

	public NonceSize(): number {
		const g: GCMWithXORCounterNonce | $.VarRef<GCMWithXORCounterNonce> | null = this
		return 12
	}

	public Open(dst: $.Slice<number>, nonce: $.Slice<number>, ciphertext: $.Slice<number>, data: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const g: GCMWithXORCounterNonce | $.VarRef<GCMWithXORCounterNonce> | null = this
		fips140.RecordApproved()
		return $.pointerValue<GCMWithXORCounterNonce>(g).g.Open(dst, nonce, ciphertext, data)
	}

	public Overhead(): number {
		const g: GCMWithXORCounterNonce | $.VarRef<GCMWithXORCounterNonce> | null = this
		return 16
	}

	public Seal(dst: $.Slice<number>, nonce: $.Slice<number>, plaintext: $.Slice<number>, data: $.Slice<number>): $.Slice<number> {
		let g: GCMWithXORCounterNonce | $.VarRef<GCMWithXORCounterNonce> | null = this
		if ($.len(nonce) != 12) {
			$.panic("crypto/cipher: incorrect nonce length given to GCM")
		}

		if (fips140.Enabled) {
			let counter = byteorder.BEUint64($.goSlice(nonce, $.len(nonce) - 8, undefined))
			if (!$.pointerValue<GCMWithXORCounterNonce>(g).ready) {
				// In the first call, if [GCMWithXORCounterNonce.SetNoncePrefixAndMask]
				// wasn't used, we assume the counter is zero to learn the XOR mask and
				// fixed prefix.
				$.pointerValue<GCMWithXORCounterNonce>(g).ready = true
				$.pointerValue<GCMWithXORCounterNonce>(g).mask = counter
				$.pointerValue<GCMWithXORCounterNonce>(g).prefix = $.uint(byteorder.BEUint32($.goSlice(nonce, undefined, 4)), 32)
			}
			if ($.uint($.pointerValue<GCMWithXORCounterNonce>(g).prefix, 32) != $.uint(byteorder.BEUint32($.goSlice(nonce, undefined, 4)), 32)) {
				$.panic("crypto/cipher: GCM nonce prefix changed")
			}
			counter = $.uint64Xor(counter, $.pointerValue<GCMWithXORCounterNonce>(g).mask)

			// Ensure the counter is strictly increasing.
			if (counter == 18446744073709551615n) {
				$.panic("crypto/cipher: counter exhausted")
			}
			if (counter < $.pointerValue<GCMWithXORCounterNonce>(g).next) {
				$.panic("crypto/cipher: counter decreased or remained the same")
			}
			$.pointerValue<GCMWithXORCounterNonce>(g).next = $.uint64Add(counter, 1n)
		}

		fips140.RecordApproved()
		return $.pointerValue<GCMWithXORCounterNonce>(g).g.sealAfterIndicator(dst, nonce, plaintext, data)
	}

	public SetNoncePrefixAndMask(nonce: $.Slice<number>): $.GoError {
		let g: GCMWithXORCounterNonce | $.VarRef<GCMWithXORCounterNonce> | null = this
		if ($.len(nonce) != 12) {
			return errors.New("crypto/cipher: incorrect nonce length given to SetNoncePrefixAndMask")
		}
		if ($.pointerValue<GCMWithXORCounterNonce>(g).ready) {
			return errors.New("crypto/cipher: SetNoncePrefixAndMask called twice or after first Seal")
		}
		$.pointerValue<GCMWithXORCounterNonce>(g).prefix = $.uint(byteorder.BEUint32($.goSlice(nonce, undefined, 4)), 32)
		$.pointerValue<GCMWithXORCounterNonce>(g).mask = byteorder.BEUint64($.goSlice(nonce, 4, undefined))
		$.pointerValue<GCMWithXORCounterNonce>(g).ready = true
		return null
	}

	static __typeInfo = $.registerStructType(
		"gcm.GCMWithXORCounterNonce",
		() => new GCMWithXORCounterNonce(),
		[{ name: "NonceSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Open", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Overhead", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Seal", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "plaintext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "SetNoncePrefixAndMask", args: [{ name: "nonce", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }],
		GCMWithXORCounterNonce,
		[{ name: "g", key: "g", type: "gcm.GCM", pkgPath: "crypto/internal/fips140/aes/gcm", index: [0], offset: 0, exported: false }, { name: "ready", key: "ready", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [1], offset: 512, exported: false }, { name: "prefix", key: "prefix", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [2], offset: 516, exported: false }, { name: "mask", key: "mask", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [3], offset: 520, exported: false }, { name: "next", key: "next", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [4], offset: 528, exported: false }]
	)
}

export async function SealWithRandomNonce(g: __goscript_gcm.GCM | $.VarRef<__goscript_gcm.GCM> | null, nonce: $.Slice<number>, out: $.Slice<number>, plaintext: $.Slice<number>, additionalData: $.Slice<number>): globalThis.Promise<void> {
	if ($.uint64($.len(plaintext)) > 68719476704n) {
		$.panic("crypto/cipher: message too large for GCM")
	}
	if ($.len(nonce) != 12) {
		$.panic("crypto/cipher: incorrect nonce length given to GCMWithRandomNonce")
	}
	if ($.len(out) != ($.len(plaintext) + 16)) {
		$.panic("crypto/cipher: incorrect output length given to GCMWithRandomNonce")
	}
	if (alias.InexactOverlap(out, plaintext)) {
		$.panic("crypto/cipher: invalid buffer overlap of output and input")
	}
	if (alias.AnyOverlap(out, additionalData)) {
		$.panic("crypto/cipher: invalid buffer overlap of output and additional data")
	}
	fips140.RecordApproved()
	await drbg.Read(nonce)
	__goscript_gcm_noasm.seal(out, g, nonce, plaintext, additionalData)
}

export function NewGCMWithCounterNonce(cipher: aes.Block | $.VarRef<aes.Block> | null): [GCMWithCounterNonce | $.VarRef<GCMWithCounterNonce> | null, $.GoError] {
	let __goscriptTuple0: any = __goscript_gcm.newGCM(new __goscript_gcm.GCM(), cipher, 12, 16)
	let g: __goscript_gcm.GCM | $.VarRef<__goscript_gcm.GCM> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		return [null, err]
	}
	return [new GCMWithCounterNonce({g: $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_gcm.GCM>(g)))}), null]
}

export function NewGCMForTLS12(cipher: aes.Block | $.VarRef<aes.Block> | null): [GCMWithCounterNonce | $.VarRef<GCMWithCounterNonce> | null, $.GoError] {
	let __goscriptTuple1: any = __goscript_gcm.newGCM(new __goscript_gcm.GCM(), cipher, 12, 16)
	let g: __goscript_gcm.GCM | $.VarRef<__goscript_gcm.GCM> | null = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	if (err != null) {
		return [null, err]
	}
	// TLS 1.2 counters always start at zero.
	return [new GCMWithCounterNonce({g: $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_gcm.GCM>(g))), startReady: true}), null]
}

export function NewGCMForSSH(cipher: aes.Block | $.VarRef<aes.Block> | null): [GCMWithCounterNonce | $.VarRef<GCMWithCounterNonce> | null, $.GoError] {
	let __goscriptTuple2: any = __goscript_gcm.newGCM(new __goscript_gcm.GCM(), cipher, 12, 16)
	let g: __goscript_gcm.GCM | $.VarRef<__goscript_gcm.GCM> | null = __goscriptTuple2[0]
	let err = __goscriptTuple2[1]
	if (err != null) {
		return [null, err]
	}
	return [new GCMWithCounterNonce({g: $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_gcm.GCM>(g)))}), null]
}

export function NewGCMWithXORCounterNonce(cipher: aes.Block | $.VarRef<aes.Block> | null): [GCMWithXORCounterNonce | $.VarRef<GCMWithXORCounterNonce> | null, $.GoError] {
	let __goscriptTuple3: any = __goscript_gcm.newGCM(new __goscript_gcm.GCM(), cipher, 12, 16)
	let g: __goscript_gcm.GCM | $.VarRef<__goscript_gcm.GCM> | null = __goscriptTuple3[0]
	let err = __goscriptTuple3[1]
	if (err != null) {
		return [null, err]
	}
	return [new GCMWithXORCounterNonce({g: $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_gcm.GCM>(g)))}), null]
}

export function NewGCMForTLS13(cipher: aes.Block | $.VarRef<aes.Block> | null): [GCMWithXORCounterNonce | $.VarRef<GCMWithXORCounterNonce> | null, $.GoError] {
	let __goscriptTuple4: any = __goscript_gcm.newGCM(new __goscript_gcm.GCM(), cipher, 12, 16)
	let g: __goscript_gcm.GCM | $.VarRef<__goscript_gcm.GCM> | null = __goscriptTuple4[0]
	let err = __goscriptTuple4[1]
	if (err != null) {
		return [null, err]
	}
	return [new GCMWithXORCounterNonce({g: $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_gcm.GCM>(g)))}), null]
}

export function NewGCMForHPKE(cipher: aes.Block | $.VarRef<aes.Block> | null): [GCMWithXORCounterNonce | $.VarRef<GCMWithXORCounterNonce> | null, $.GoError] {
	let __goscriptTuple5: any = __goscript_gcm.newGCM(new __goscript_gcm.GCM(), cipher, 12, 16)
	let g: __goscript_gcm.GCM | $.VarRef<__goscript_gcm.GCM> | null = __goscriptTuple5[0]
	let err = __goscriptTuple5[1]
	if (err != null) {
		return [null, err]
	}
	return [new GCMWithXORCounterNonce({g: $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_gcm.GCM>(g)))}), null]
}

export function NewGCMForQUIC(cipher: aes.Block | $.VarRef<aes.Block> | null, iv: $.Slice<number>): [GCMWithXORCounterNonce | $.VarRef<GCMWithXORCounterNonce> | null, $.GoError] {
	let __goscriptTuple6: any = __goscript_gcm.newGCM(new __goscript_gcm.GCM(), cipher, 12, 16)
	let g: __goscript_gcm.GCM | $.VarRef<__goscript_gcm.GCM> | null = __goscriptTuple6[0]
	let err = __goscriptTuple6[1]
	if (err != null) {
		return [null, err]
	}
	let gcm: GCMWithXORCounterNonce | $.VarRef<GCMWithXORCounterNonce> | null = new GCMWithXORCounterNonce({g: $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_gcm.GCM>(g)))})
	{
		let __goscriptShadow0 = GCMWithXORCounterNonce.prototype.SetNoncePrefixAndMask.call(gcm, iv)
		if (__goscriptShadow0 != null) {
			return [null, __goscriptShadow0]
		}
	}
	return [gcm, null]
}

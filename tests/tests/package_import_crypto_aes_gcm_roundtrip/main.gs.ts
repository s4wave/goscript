// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as aes from "@goscript/crypto/aes/index.js"

import * as cipher from "@goscript/crypto/cipher/index.js"
import "@goscript/bytes/index.js"
import "@goscript/crypto/aes/index.js"
import "@goscript/crypto/cipher/index.js"

export type packetSealer = {
	Seal(dst: $.Slice<number>, plaintext: $.Slice<number>): $.Slice<number> | globalThis.Promise<$.Slice<number>>
}

$.registerInterfaceType(
	"main.packetSealer",
	null,
	[{ name: "Seal", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }] }]
);

export class wrappedAEAD {
	public declare inner: cipher.AEAD | null

	public _fields: {
		inner: cipher.AEAD | null
	}

	constructor(init?: Partial<{inner?: cipher.AEAD | null}>) {
		this._fields = {
			inner: init?.inner ?? (null! as cipher.AEAD | null)
		}
	}

	public clone(): wrappedAEAD {
		return $.markAsStructValue(new wrappedAEAD(this))
	}

	public async NonceSize(): globalThis.Promise<number> {
		const w: wrappedAEAD | $.VarRef<wrappedAEAD> | null = this
		return $.pointerValue<Exclude<cipher.AEAD, null>>($.pointerValue<wrappedAEAD>(w).inner).NonceSize()
	}

	public async Open(dst: $.Slice<number>, nonce: $.Slice<number>, ciphertext: $.Slice<number>, additionalData: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const w: wrappedAEAD | $.VarRef<wrappedAEAD> | null = this
		return $.pointerValue<Exclude<cipher.AEAD, null>>($.pointerValue<wrappedAEAD>(w).inner).Open(dst, nonce, ciphertext, additionalData)
	}

	public async Overhead(): globalThis.Promise<number> {
		const w: wrappedAEAD | $.VarRef<wrappedAEAD> | null = this
		return $.pointerValue<Exclude<cipher.AEAD, null>>($.pointerValue<wrappedAEAD>(w).inner).Overhead()
	}

	public async Seal(dst: $.Slice<number>, nonce: $.Slice<number>, plaintext: $.Slice<number>, additionalData: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const w: wrappedAEAD | $.VarRef<wrappedAEAD> | null = this
		return $.pointerValue<Exclude<cipher.AEAD, null>>($.pointerValue<wrappedAEAD>(w).inner).Seal(dst, nonce, plaintext, additionalData)
	}

	static {
		$.bindStructFields(this.prototype, ["inner"])
	}

	static __typeInfo = $.registerStructType(
		"main.wrappedAEAD",
		() => new wrappedAEAD(),
		() => [{ name: "NonceSize", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Open", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "Overhead", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Seal", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }] }],
		wrappedAEAD,
		() => [{ name: "inner", key: "inner", type: "cipher.AEAD" }]
	)
}

export class nestedSealer {
	public declare aead: cipher.AEAD | null

	public declare nonce: $.Slice<number>

	public declare aad: $.Slice<number>

	public _fields: {
		aead: cipher.AEAD | null
		nonce: $.Slice<number>
		aad: $.Slice<number>
	}

	constructor(init?: Partial<{aead?: cipher.AEAD | null, nonce?: $.Slice<number>, aad?: $.Slice<number>}>) {
		this._fields = {
			aead: init?.aead ?? (null! as cipher.AEAD | null),
			nonce: init?.nonce ?? (null! as $.Slice<number>),
			aad: init?.aad ?? (null! as $.Slice<number>)
		}
	}

	public clone(): nestedSealer {
		return $.markAsStructValue(new nestedSealer(this))
	}

	public async Seal(dst: $.Slice<number>, plaintext: $.Slice<number>): globalThis.Promise<$.Slice<number>> {
		const s: nestedSealer | $.VarRef<nestedSealer> | null = this
		return $.pointerValue<Exclude<cipher.AEAD, null>>($.pointerValue<nestedSealer>(s).aead).Seal(dst, $.pointerValue<nestedSealer>(s).nonce, plaintext, $.pointerValue<nestedSealer>(s).aad)
	}

	static {
		$.bindStructFields(this.prototype, ["aead", "nonce", "aad"])
	}

	static __typeInfo = $.registerStructType(
		"main.nestedSealer",
		() => new nestedSealer(),
		() => [{ name: "Seal", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }] }],
		nestedSealer,
		() => [{ name: "aead", key: "aead", type: "cipher.AEAD" }, { name: "nonce", key: "nonce", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { name: "aad", key: "aad", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }]
	)
}

export function encodeHex(data: $.Slice<number>): string {
	const digits: string = "0123456789abcdef"
	let encoded: $.Slice<number> = $.makeSlice<number>($.len(data) * 2, undefined, "byte")
	for (let __goscriptRangeTarget0 = data, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let value = __goscriptRangeTarget0![i]
		encoded![i * 2] = $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", $.uintShr(value, 4, 8)), 8)
		encoded![(i * 2) + 1] = $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", value & 0xf), 8)
	}
	return $.bytesToString(encoded)
}

export async function roundTrip(prefix: $.Slice<number>): globalThis.Promise<void> {
	let key: $.Slice<number> = new Uint8Array([48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102])
	let nonce: $.Slice<number> = new Uint8Array([49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 49, 50])
	let plaintext: $.Slice<number> = new Uint8Array([98, 114, 111, 119, 115, 101, 114, 32, 113, 117, 105, 99, 32, 104, 97, 110, 100, 115, 104, 97, 107, 101, 32, 112, 97, 121, 108, 111, 97, 100])
	let aad: $.Slice<number> = new Uint8Array([113, 117, 105, 99, 32, 112, 114, 111, 116, 101, 99, 116, 101, 100, 32, 104, 101, 97, 100, 101, 114])

	let [block, err] = aes.NewCipher(key)
	if (err != null) {
		$.panic((err as any))
	}
	let aead: cipher.AEAD | null = null! as cipher.AEAD | null
	let __goscriptTuple0: any = cipher.NewGCM($.pointerValueOrNil(block)!)
	aead = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	if (err != null) {
		$.panic((err as any))
	}

	let sealed: $.Slice<number> = await $.pointerValue<Exclude<cipher.AEAD, null>>(aead).Seal(prefix, nonce, plaintext, aad)
	let ciphertext: $.Slice<number> = $.goSlice(sealed, $.len(prefix), undefined)
	let __goscriptTuple1: any = await $.pointerValue<Exclude<cipher.AEAD, null>>(aead).Open(null, nonce, ciphertext, aad)
	let opened: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	await $.println("round trip:", err == null, bytes.Equal(opened, plaintext), $.len(sealed), $.len(ciphertext))
	if (prefix == null) {
		await $.println("ciphertext:", encodeHex(ciphertext))
	}
	if (($.len(prefix) == 0) && ($.cap(prefix) >= $.len(sealed))) {
		let backing: $.Slice<number> = $.goSlice(prefix, undefined, $.len(sealed))
		await $.println("shared backing:", bytes.Equal(backing, sealed), $.cap(prefix), $.len(sealed))
	}
}

export function makeGeneric<T>(__typeArgs: $.GenericTypeArgs | undefined, length: number, capacity: number): $.Slice<T> {
	return $.makeSlice<T>(length, capacity, undefined, () => ($.genericZero(__typeArgs, "T", null) as T))
}

export async function main(): globalThis.Promise<void> {
	await roundTrip(null)
	await roundTrip($.makeSlice<number>(15, undefined, "byte"))
	await roundTrip($.makeSlice<number>(0, 64, "byte"))
	let [block, ] = aes.NewCipher(new Uint8Array([48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102]))
	let [inner, ] = cipher.NewGCM($.pointerValueOrNil(block)!)
	let aead = $.interfaceValue<cipher.AEAD | null>(new wrappedAEAD({inner: inner}), "*main.wrappedAEAD", /* @__PURE__ */ $.pointerType("main.wrappedAEAD"))
	let plaintext: $.Slice<number> = $.makeSlice<number>(695, undefined, "byte")
	for (let __goscriptRangeTarget1 = plaintext, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		plaintext![i] = $.uint($.uint(i, 8), 8)
	}
	let packet: $.Slice<number> = (makeGeneric({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("uint8"), zero: () => 0 }}, 15 + $.len(plaintext), 1452) as $.Slice<number>)
	let nonce: $.Slice<number> = new Uint8Array([49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 49, 50])
	let aad: $.Slice<number> = new Uint8Array([113, 117, 105, 99, 32, 112, 114, 111, 116, 101, 99, 116, 101, 100, 32, 104, 101, 97, 100, 101, 114])
	let expected: $.Slice<number> = await $.pointerValue<Exclude<cipher.AEAD, null>>(aead).Seal(null, nonce, plaintext, aad)
	$.copy($.goSlice(packet, 15, undefined), plaintext)
	let sealer = $.interfaceValue<packetSealer | null>(new nestedSealer({aead: aead, nonce: nonce, aad: aad}), "*main.nestedSealer", /* @__PURE__ */ $.pointerType("main.nestedSealer"))
	await $.pointerValue<Exclude<packetSealer, null>>(sealer).Seal($.goSlice(packet, 15, 15), $.goSlice(packet, 15, 15 + $.len(plaintext)))
	packet = $.goSlice(packet, undefined, $.len(packet) + await $.pointerValue<Exclude<cipher.AEAD, null>>(aead).Overhead())
	await $.println("wrapped shared backing:", bytes.Equal($.goSlice(packet, 15, 15 + $.len(expected)), expected))

	let [randomAEAD, err] = cipher.NewGCMWithRandomNonce($.pointerValueOrNil(block)!)
	let randomSealed: $.Slice<number> = await $.pointerValue<Exclude<cipher.AEAD, null>>(randomAEAD).Seal(new Uint8Array([7]) as $.Slice<number>, null, new Uint8Array([114, 97, 110, 100, 111, 109, 32, 110, 111, 110, 99, 101]), aad)
	let __goscriptTuple2: any = await $.pointerValue<Exclude<cipher.AEAD, null>>(randomAEAD).Open(null, null, $.goSlice(randomSealed, 1, undefined), aad)
	let randomOpened: $.Slice<number> = __goscriptTuple2[0]
	let openErr = __goscriptTuple2[1]
	await $.println("random nonce:", err == null, openErr == null, await $.pointerValue<Exclude<cipher.AEAD, null>>(randomAEAD).NonceSize(), await $.pointerValue<Exclude<cipher.AEAD, null>>(randomAEAD).Overhead(), $.len(randomSealed), $.uint($.arrayIndex(randomSealed!, 0), 8) == $.uint(7, 8), bytes.Equal(randomOpened, new Uint8Array([114, 97, 110, 100, 111, 109, 32, 110, 111, 110, 99, 101])))
}

if ($.isMainScript(import.meta)) {
	await main()
}

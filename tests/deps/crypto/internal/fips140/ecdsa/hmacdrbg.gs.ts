// Generated file based on hmacdrbg.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as hmac from "@goscript/crypto/internal/fips140/hmac/index.js"

import * as hash2 from "@goscript/hash/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/hmac/index.js"
import "@goscript/hash/index.js"

export type plainPersonalizationString = $.Slice<number>

export type blockAlignedPersonalizationString = $.Slice<$.Slice<number>>

export type personalizationString = {
	isPersonalizationString(): void
}

$.registerInterfaceType(
	"ecdsa.personalizationString",
	null,
	[{ name: "isPersonalizationString", args: [], returns: [] }]
);

export class hmacDRBG {
	public get newHMAC(): ((key: $.Slice<number>) => hmac.HMAC | $.VarRef<hmac.HMAC> | null | globalThis.Promise<hmac.HMAC | $.VarRef<hmac.HMAC> | null>) | null {
		return this._fields.newHMAC.value
	}
	public set newHMAC(value: ((key: $.Slice<number>) => hmac.HMAC | $.VarRef<hmac.HMAC> | null | globalThis.Promise<hmac.HMAC | $.VarRef<hmac.HMAC> | null>) | null) {
		this._fields.newHMAC.value = value
	}

	public get hK(): hmac.HMAC | $.VarRef<hmac.HMAC> | null {
		return this._fields.hK.value
	}
	public set hK(value: hmac.HMAC | $.VarRef<hmac.HMAC> | null) {
		this._fields.hK.value = value
	}

	public get V(): $.Slice<number> {
		return this._fields.V.value
	}
	public set V(value: $.Slice<number>) {
		this._fields.V.value = value
	}

	public get reseedCounter(): bigint {
		return this._fields.reseedCounter.value
	}
	public set reseedCounter(value: bigint) {
		this._fields.reseedCounter.value = value
	}

	public _fields: {
		newHMAC: $.VarRef<((key: $.Slice<number>) => hmac.HMAC | $.VarRef<hmac.HMAC> | null | globalThis.Promise<hmac.HMAC | $.VarRef<hmac.HMAC> | null>) | null>
		hK: $.VarRef<hmac.HMAC | $.VarRef<hmac.HMAC> | null>
		V: $.VarRef<$.Slice<number>>
		reseedCounter: $.VarRef<bigint>
	}

	constructor(init?: Partial<{newHMAC?: ((key: $.Slice<number>) => hmac.HMAC | $.VarRef<hmac.HMAC> | null | globalThis.Promise<hmac.HMAC | $.VarRef<hmac.HMAC> | null>) | null, hK?: hmac.HMAC | $.VarRef<hmac.HMAC> | null, V?: $.Slice<number>, reseedCounter?: bigint}>) {
		this._fields = {
			newHMAC: $.varRef(init?.newHMAC ?? (null! as ((key: $.Slice<number>) => hmac.HMAC | $.VarRef<hmac.HMAC> | null | globalThis.Promise<hmac.HMAC | $.VarRef<hmac.HMAC> | null>) | null)),
			hK: $.varRef(init?.hK ?? (null! as hmac.HMAC | $.VarRef<hmac.HMAC> | null)),
			V: $.varRef(init?.V ?? (null! as $.Slice<number>)),
			reseedCounter: $.varRef(init?.reseedCounter ?? (0n as bigint))
		}
	}

	public clone(): hmacDRBG {
		const cloned = new hmacDRBG()
		cloned._fields = {
			newHMAC: $.varRef(this._fields.newHMAC.value),
			hK: $.varRef(this._fields.hK.value),
			V: $.varRef(this._fields.V.value),
			reseedCounter: $.varRef(this._fields.reseedCounter.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Generate(out: $.Slice<number>): globalThis.Promise<void> {
		let d: hmacDRBG | $.VarRef<hmacDRBG> | null = this
		// HMAC_DRBG_Generate_algorithm, per Section 10.1.2.5.
		fips140.RecordApproved()

		if ($.len(out) > 65536) {
			$.panic("ecdsa: internal error: request size exceeds maximum")
		}

		if ($.pointerValue<hmacDRBG>(d).reseedCounter > 281474976710656n) {
			$.panic("ecdsa: reseed interval exceeded")
		}

		let tlen = 0
		while (tlen < $.len(out)) {
			// V = HMAC_K(V)
			// T = T || V
			await hmac.HMAC.prototype.Reset.call($.pointerValue<hmacDRBG>(d).hK)
			await hmac.HMAC.prototype.Write.call($.pointerValue<hmacDRBG>(d).hK, $.pointerValue<hmacDRBG>(d).V)
			$.pointerValue<hmacDRBG>(d).V = await hmac.HMAC.prototype.Sum.call($.pointerValue<hmacDRBG>(d).hK, $.goSlice($.pointerValue<hmacDRBG>(d).V, undefined, 0))
			tlen = tlen + ($.copy($.goSlice(out, tlen, undefined), $.pointerValue<hmacDRBG>(d).V))
		}

		// Note that if this function shows up on ECDSA-level profiles, this can be
		// optimized in the common case by deferring the rest to the next Generate
		// call, which will never come in nearly all cases.

		// HMAC_DRBG_Update, per Section 10.1.2.2, without provided_data.
		// K = HMAC (K, V || 0x00)
		await hmac.HMAC.prototype.Reset.call($.pointerValue<hmacDRBG>(d).hK)
		await hmac.HMAC.prototype.Write.call($.pointerValue<hmacDRBG>(d).hK, $.pointerValue<hmacDRBG>(d).V)
		await hmac.HMAC.prototype.Write.call($.pointerValue<hmacDRBG>(d).hK, new Uint8Array([0]) as $.Slice<number>)
		let K: $.Slice<number> = await hmac.HMAC.prototype.Sum.call($.pointerValue<hmacDRBG>(d).hK, null)
		// V = HMAC (K, V)
		$.pointerValue<hmacDRBG>(d).hK = await $.pointerValue<hmacDRBG>(d).newHMAC!(K)
		await hmac.HMAC.prototype.Write.call($.pointerValue<hmacDRBG>(d).hK, $.pointerValue<hmacDRBG>(d).V)
		$.pointerValue<hmacDRBG>(d).V = await hmac.HMAC.prototype.Sum.call($.pointerValue<hmacDRBG>(d).hK, $.goSlice($.pointerValue<hmacDRBG>(d).V, undefined, 0))

		$.pointerValue<hmacDRBG>(d).reseedCounter++
	}

	static __typeInfo = $.registerStructType(
		"ecdsa.hmacDRBG",
		() => new hmacDRBG(),
		[{ name: "Generate", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }],
		hmacDRBG,
		[{ name: "newHMAC", key: "newHMAC", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: [{ kind: $.TypeKind.Pointer, elemType: "hmac.HMAC" }] } as $.FunctionTypeInfo), pkgPath: "crypto/internal/fips140/ecdsa", index: [0], offset: 0, exported: false }, { name: "hK", key: "hK", type: { kind: $.TypeKind.Pointer, elemType: "hmac.HMAC" }, pkgPath: "crypto/internal/fips140/ecdsa", index: [1], offset: 8, exported: false }, { name: "V", key: "V", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [2], offset: 16, exported: true }, { name: "reseedCounter", key: "reseedCounter", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/ecdsa", index: [3], offset: 40, exported: false }]
	)
}

export const reseedInterval: number = 281474976710656

export const maxRequestSize: number = 65536

export function plainPersonalizationString_isPersonalizationString(recv: plainPersonalizationString): void {
}

export function blockAlignedPersonalizationString_isPersonalizationString(recv: blockAlignedPersonalizationString): void {
}

export async function newDRBG(__typeArgs: $.GenericTypeArgs | undefined, hash: (() => any | globalThis.Promise<any>) | null, entropy: $.Slice<number>, nonce: $.Slice<number>, s: personalizationString | null): globalThis.Promise<hmacDRBG | $.VarRef<hmacDRBG> | null> {
	// HMAC_DRBG_Instantiate_algorithm, per Section 10.1.2.3.
	fips140.RecordApproved()

	let d: hmacDRBG | $.VarRef<hmacDRBG> | null = new hmacDRBG({newHMAC: $.functionValue(async (key: $.Slice<number>): globalThis.Promise<hmac.HMAC | $.VarRef<hmac.HMAC> | null> => {
		return await hmac.New(undefined, hash, key)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }], results: [{ kind: $.TypeKind.Pointer, elemType: "hmac.HMAC" }] } as $.FunctionTypeInfo))})
	let size = await $.callGenericMethod(__typeArgs, "H", "Size", await hash!())

	// K = 0x00 0x00 0x00 ... 0x00
	let K: $.Slice<number> = $.makeSlice<number>(size, undefined, "byte")

	// V = 0x01 0x01 0x01 ... 0x01
	$.pointerValue<hmacDRBG>(d).V = bytes.Repeat(new Uint8Array([1]) as $.Slice<number>, size)

	// HMAC_DRBG_Update, per Section 10.1.2.2.
	// K = HMAC (K, V || 0x00 || provided_data)
	let h: hmac.HMAC | $.VarRef<hmac.HMAC> | null = await hmac.New(undefined, hash, K)
	await hmac.HMAC.prototype.Write.call(h, $.pointerValue<hmacDRBG>(d).V)
	await hmac.HMAC.prototype.Write.call(h, new Uint8Array([0]) as $.Slice<number>)
	await hmac.HMAC.prototype.Write.call(h, entropy)
	await hmac.HMAC.prototype.Write.call(h, nonce)
	{
		const __goscriptTypeSwitchValue = s
		switch (true) {
			case $.typeAssert<plainPersonalizationString>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ecdsa.plainPersonalizationString", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let s: plainPersonalizationString = $.typeAssert<plainPersonalizationString>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ecdsa.plainPersonalizationString", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					await hmac.HMAC.prototype.Write.call(h, s)
				}
				break
			case $.typeAssert<blockAlignedPersonalizationString>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ecdsa.blockAlignedPersonalizationString", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }).ok:
				{
					let s: blockAlignedPersonalizationString = $.typeAssert<blockAlignedPersonalizationString>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ecdsa.blockAlignedPersonalizationString", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }).value
					let l = (($.len($.pointerValue<hmacDRBG>(d).V) + 1) + $.len(entropy)) + $.len(nonce)
					for (let __goscriptRangeTarget0 = s, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
						let b = __goscriptRangeTarget0![__rangeIndex]
						await pad000(h, l)
						await hmac.HMAC.prototype.Write.call(h, b)
						l = $.len(b)
					}
				}
				break
		}
	}
	K = await hmac.HMAC.prototype.Sum.call(h, $.goSlice(K, undefined, 0))
	// V = HMAC (K, V)
	h = await hmac.New(undefined, hash, K)
	await hmac.HMAC.prototype.Write.call(h, $.pointerValue<hmacDRBG>(d).V)
	$.pointerValue<hmacDRBG>(d).V = await hmac.HMAC.prototype.Sum.call(h, $.goSlice($.pointerValue<hmacDRBG>(d).V, undefined, 0))
	// K = HMAC (K, V || 0x01 || provided_data).
	await hmac.HMAC.prototype.Reset.call(h)
	await hmac.HMAC.prototype.Write.call(h, $.pointerValue<hmacDRBG>(d).V)
	await hmac.HMAC.prototype.Write.call(h, new Uint8Array([1]) as $.Slice<number>)
	await hmac.HMAC.prototype.Write.call(h, entropy)
	await hmac.HMAC.prototype.Write.call(h, nonce)
	{
		const __goscriptTypeSwitchValue = s
		switch (true) {
			case $.typeAssert<plainPersonalizationString>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ecdsa.plainPersonalizationString", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).ok:
				{
					let s: plainPersonalizationString = $.typeAssert<plainPersonalizationString>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ecdsa.plainPersonalizationString", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }).value
					await hmac.HMAC.prototype.Write.call(h, s)
				}
				break
			case $.typeAssert<blockAlignedPersonalizationString>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ecdsa.blockAlignedPersonalizationString", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }).ok:
				{
					let s: blockAlignedPersonalizationString = $.typeAssert<blockAlignedPersonalizationString>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Slice, typeName: "ecdsa.blockAlignedPersonalizationString", elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }).value
					let l = (($.len($.pointerValue<hmacDRBG>(d).V) + 1) + $.len(entropy)) + $.len(nonce)
					for (let __goscriptRangeTarget1 = s, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
						let b = __goscriptRangeTarget1![__rangeIndex]
						await pad000(h, l)
						await hmac.HMAC.prototype.Write.call(h, b)
						l = $.len(b)
					}
				}
				break
		}
	}
	K = await hmac.HMAC.prototype.Sum.call(h, $.goSlice(K, undefined, 0))
	// V = HMAC (K, V)
	h = await hmac.New(undefined, hash, K)
	await hmac.HMAC.prototype.Write.call(h, $.pointerValue<hmacDRBG>(d).V)
	$.pointerValue<hmacDRBG>(d).V = await hmac.HMAC.prototype.Sum.call(h, $.goSlice($.pointerValue<hmacDRBG>(d).V, undefined, 0))

	$.pointerValue<hmacDRBG>(d).hK = h
	$.pointerValue<hmacDRBG>(d).reseedCounter = 1n
	return d
}

export async function TestingOnlyNewDRBG(__typeArgs: $.GenericTypeArgs | undefined, hash: (() => any | globalThis.Promise<any>) | null, entropy: $.Slice<number>, nonce: $.Slice<number>, s: $.Slice<number>): globalThis.Promise<hmacDRBG | $.VarRef<hmacDRBG> | null> {
	return newDRBG(undefined, hash, entropy, nonce, $.namedValueInterfaceValue<personalizationString | null>((s as plainPersonalizationString), "ecdsa.plainPersonalizationString", {isPersonalizationString: (receiver: any, ...args: any[]) => (plainPersonalizationString_isPersonalizationString as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "ecdsa.plainPersonalizationString", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "isPersonalizationString", args: [], returns: [] }]))
}

export async function pad000(h: hmac.HMAC | $.VarRef<hmac.HMAC> | null, writtenSoFar: number): globalThis.Promise<void> {
	let blockSize = await hmac.HMAC.prototype.BlockSize.call(h)
	{
		let rem = writtenSoFar % blockSize
		if (rem != 0) {
			await hmac.HMAC.prototype.Write.call(h, $.makeSlice<number>(blockSize - rem, undefined, "byte"))
		}
	}
}

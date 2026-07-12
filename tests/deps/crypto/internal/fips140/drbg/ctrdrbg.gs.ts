// Generated file based on ctrdrbg.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as aes from "@goscript/crypto/internal/fips140/aes/index.js"

import * as subtle from "@goscript/crypto/internal/fips140/subtle/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as bits from "@goscript/math/bits/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/aes/index.js"
import "@goscript/crypto/internal/fips140/subtle/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/math/bits/index.js"

export class Counter {
	// c is instantiated with K as the key and V as the counter.
	public get c(): aes.CTR {
		return this._fields.c.value
	}
	public set c(value: aes.CTR) {
		this._fields.c.value = value
	}

	public get reseedCounter(): bigint {
		return this._fields.reseedCounter.value
	}
	public set reseedCounter(value: bigint) {
		this._fields.reseedCounter.value = value
	}

	public _fields: {
		c: $.VarRef<aes.CTR>
		reseedCounter: $.VarRef<bigint>
	}

	constructor(init?: Partial<{c?: aes.CTR, reseedCounter?: bigint}>) {
		this._fields = {
			c: $.varRef(init?.c ? $.markAsStructValue($.cloneStructValue(init.c)) : $.markAsStructValue(new aes.CTR())),
			reseedCounter: $.varRef(init?.reseedCounter ?? (0n as bigint))
		}
	}

	public clone(): Counter {
		const cloned = new Counter()
		cloned._fields = {
			c: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.c.value))),
			reseedCounter: $.varRef(this._fields.reseedCounter.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Generate(out: $.Slice<number>, additionalInput: $.VarRef<Uint8Array> | null): boolean {
		let c: Counter | $.VarRef<Counter> | null = this
		let reseedRequired: boolean = false
		// CTR_DRBG_Generate_algorithm, per Section 10.2.1.5.1.
		fips140.RecordApproved()

		if ($.len(out) > 65536) {
			$.panic("crypto/drbg: internal error: request size exceeds maximum")
		}

		// Step 1.
		if ($.pointerValue<Counter>(c).reseedCounter > 281474976710656n) {
			return true
		}

		// Step 2.
		if (additionalInput != null) {
			Counter.prototype.update.call(c, additionalInput)
		} else {
			// If the additional input is null, the first CTR_DRBG_Update is
			// skipped, but the additional input is replaced with an all-zero string
			// for the second CTR_DRBG_Update.
			additionalInput = $.varRef<Uint8Array>(new Uint8Array(48))
		}

		// Steps 3-5.
		$.clear(out)
		$.pointerValue<Counter>(c).c.XORKeyStream(out, out)
		aes.RoundToBlock($.pointerValue<Counter>(c)._fields.c)

		// Step 6.
		Counter.prototype.update.call(c, additionalInput)

		// Step 7.
		$.pointerValue<Counter>(c).reseedCounter++

		// Step 8.
		return false
	}

	public Reseed(entropy: $.VarRef<Uint8Array> | null, additionalInput: $.VarRef<Uint8Array> | null): void {
		let c: Counter | $.VarRef<Counter> | null = this
		// CTR_DRBG_Reseed_algorithm, per Section 10.2.1.4.1.
		fips140.RecordApproved()

		let seed: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(48))
		subtle.XORBytes($.goSlice(seed.value, undefined, undefined), $.goSlice($.pointerValue<Uint8Array>(entropy), undefined, undefined), $.goSlice($.pointerValue<Uint8Array>(additionalInput), undefined, undefined))
		Counter.prototype.update.call(c, seed)
		$.pointerValue<Counter>(c).reseedCounter = 1n
	}

	public update(seed: $.VarRef<Uint8Array> | null): void {
		let c: Counter | $.VarRef<Counter> | null = this
		// CTR_DRBG_Update, per Section 10.2.1.2.

		let temp: $.Slice<number> = $.makeSlice<number>(48, undefined, "byte")
		$.pointerValue<Counter>(c).c.XORKeyStream(temp, $.goSlice($.pointerValue<Uint8Array>(seed), undefined, undefined))
		let K: $.Slice<number> = $.goSlice(temp, undefined, 32)
		let V: $.Slice<number> = $.goSlice(temp, 32, undefined)

		// Again, we pre-increment V, like in NewCounter.
		increment(($.sliceToArrayPointer<number>(V, 16, "byte") as $.VarRef<Uint8Array> | null))

		let __goscriptTuple0: any = aes.New(K)
		let cipher: aes.Block | $.VarRef<aes.Block> | null = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			$.panic((err as any))
		}
		$.pointerValue<Counter>(c).c = $.markAsStructValue($.cloneStructValue($.pointerValue<aes.CTR>(aes.NewCTR(cipher, V))))
	}

	static __typeInfo = $.registerStructType(
		"drbg.Counter",
		() => new Counter(),
		[{ name: "Generate", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "additionalInput", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 48 } } }], returns: [{ name: "reseedRequired", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Reseed", args: [{ name: "entropy", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 48 } } }, { name: "additionalInput", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 48 } } }], returns: [] }, { name: "update", args: [{ name: "seed", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 48 } } }], returns: [] }],
		Counter,
		[{ name: "c", key: "c", type: "aes.CTR", pkgPath: "crypto/internal/fips140/drbg", index: [0], offset: 0, exported: false }, { name: "reseedCounter", key: "reseedCounter", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/drbg", index: [1], offset: 512, exported: false }]
	)
}

export const keySize: number = 32

export const SeedSize: number = 48

export const reseedInterval: number = 281474976710656

export const maxRequestSize: number = 65536

export function NewCounter(entropy: $.VarRef<Uint8Array> | null): Counter | $.VarRef<Counter> | null {
	// CTR_DRBG_Instantiate_algorithm, per Section 10.2.1.3.1.
	fips140.RecordApproved()

	let K: $.Slice<number> = $.makeSlice<number>(32, undefined, "byte")
	let V: $.Slice<number> = $.makeSlice<number>(aes.BlockSize, undefined, "byte")

	// V starts at 0, but is incremented in CTR_DRBG_Update before each use,
	// unlike AES-CTR where it is incremented after each use.
	V![$.len(V) - 1] = $.uint(1, 8)

	let __goscriptTuple1: any = aes.New(K)
	let cipher: aes.Block | $.VarRef<aes.Block> | null = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	if (err != null) {
		$.panic((err as any))
	}

	let c: Counter | $.VarRef<Counter> | null = new Counter()
	$.pointerValue<Counter>(c).c = $.markAsStructValue($.cloneStructValue($.pointerValue<aes.CTR>(aes.NewCTR(cipher, V))))
	Counter.prototype.update.call(c, entropy)
	$.pointerValue<Counter>(c).reseedCounter = 1n
	return c
}

export function increment(v: $.VarRef<Uint8Array> | null): void {
	let hi = byteorder.BEUint64($.goSlice($.pointerValue<Uint8Array>(v), undefined, 8))
	let lo = byteorder.BEUint64($.goSlice($.pointerValue<Uint8Array>(v), 8, undefined))
	let __goscriptTuple2: any = bits.Add64(lo, 1n, 0n)
	lo = __goscriptTuple2[0]
	let c = __goscriptTuple2[1]
	let __goscriptTuple3: any = bits.Add64(hi, 0n, c)
	hi = __goscriptTuple3[0]
	byteorder.BEPutUint64($.goSlice($.pointerValue<Uint8Array>(v), undefined, 8), hi)
	byteorder.BEPutUint64($.goSlice($.pointerValue<Uint8Array>(v), 8, undefined), lo)
}

// Generated file based on cmac.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as aes from "@goscript/crypto/internal/fips140/aes/index.js"

import * as subtle from "@goscript/crypto/internal/fips140/subtle/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/aes/index.js"
import "@goscript/crypto/internal/fips140/subtle/index.js"

export class CMAC {
	public get b(): aes.Block {
		return this._fields.b.value
	}
	public set b(value: aes.Block) {
		this._fields.b.value = value
	}

	public get k1(): Uint8Array {
		return this._fields.k1.value
	}
	public set k1(value: Uint8Array) {
		this._fields.k1.value = value
	}

	public get k2(): Uint8Array {
		return this._fields.k2.value
	}
	public set k2(value: Uint8Array) {
		this._fields.k2.value = value
	}

	public _fields: {
		b: $.VarRef<aes.Block>
		k1: $.VarRef<Uint8Array>
		k2: $.VarRef<Uint8Array>
	}

	constructor(init?: Partial<{b?: aes.Block, k1?: Uint8Array, k2?: Uint8Array}>) {
		this._fields = {
			b: $.varRef(init?.b ? $.markAsStructValue($.cloneStructValue(init.b)) : $.markAsStructValue(new aes.Block())),
			k1: $.varRef(init?.k1 !== undefined ? $.cloneArrayValue(init.k1) : new Uint8Array(16)),
			k2: $.varRef(init?.k2 !== undefined ? $.cloneArrayValue(init.k2) : new Uint8Array(16))
		}
	}

	public clone(): CMAC {
		const cloned = new CMAC()
		cloned._fields = {
			b: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.b.value))),
			k1: $.varRef($.cloneArrayValue(this._fields.k1.value)),
			k2: $.varRef($.cloneArrayValue(this._fields.k2.value))
		}
		return $.markAsStructValue(cloned)
	}

	public MAC(m: $.Slice<number>): Uint8Array {
		const c: CMAC | $.VarRef<CMAC> | null = this
		fips140.RecordApproved()
		$.pointerValue<CMAC>(c).b
		let x: Uint8Array = new Uint8Array(16)
		if ($.len(m) == 0) {
			// Special-cased as a single empty partial final block.
			x = $.pointerValue<CMAC>(c).k2
			x[$.len(m)] = x[$.len(m)] ^ ($.uint(0b10000000, 8))
			aes.EncryptBlockInternal($.pointerValue<CMAC>(c)._fields.b, $.goSlice(x, undefined, undefined), $.goSlice(x, undefined, undefined))
			return x
		}
		while ($.len(m) >= aes.BlockSize) {
			subtle.XORBytes($.goSlice(x, undefined, undefined), $.goSlice(m, undefined, aes.BlockSize), $.goSlice(x, undefined, undefined))
			if ($.len(m) == aes.BlockSize) {
				// Final complete block.
				subtle.XORBytes($.goSlice(x, undefined, undefined), $.goSlice($.pointerValue<CMAC>(c).k1, undefined, undefined), $.goSlice(x, undefined, undefined))
			}
			aes.EncryptBlockInternal($.pointerValue<CMAC>(c)._fields.b, $.goSlice(x, undefined, undefined), $.goSlice(x, undefined, undefined))
			m = $.goSlice(m, aes.BlockSize, undefined)
		}
		if ($.len(m) > 0) {
			// Final incomplete block.
			subtle.XORBytes($.goSlice(x, undefined, undefined), m, $.goSlice(x, undefined, undefined))
			subtle.XORBytes($.goSlice(x, undefined, undefined), $.goSlice($.pointerValue<CMAC>(c).k2, undefined, undefined), $.goSlice(x, undefined, undefined))
			x[$.len(m)] = x[$.len(m)] ^ ($.uint(0b10000000, 8))
			aes.EncryptBlockInternal($.pointerValue<CMAC>(c)._fields.b, $.goSlice(x, undefined, undefined), $.goSlice(x, undefined, undefined))
		}
		return x
	}

	public deriveSubkeys(): void {
		let c: CMAC | $.VarRef<CMAC> | null = this
		aes.EncryptBlockInternal($.pointerValue<CMAC>(c)._fields.b, $.goSlice($.pointerValue<CMAC>(c).k1, undefined, undefined), $.goSlice($.pointerValue<CMAC>(c).k1, undefined, undefined))
		let msb = $.uint(shiftLeft($.pointerValue<CMAC>(c)._fields.k1), 8)
		$.pointerValue<CMAC>(c).k1[$.len($.pointerValue<CMAC>(c).k1) - 1] = $.pointerValue<CMAC>(c).k1[$.len($.pointerValue<CMAC>(c).k1) - 1] ^ ($.uint(msb * 0b10000111, 8))

		$.pointerValue<CMAC>(c).k2 = $.pointerValue<CMAC>(c).k1
		msb = $.uint(shiftLeft($.pointerValue<CMAC>(c)._fields.k2), 8)
		$.pointerValue<CMAC>(c).k2[$.len($.pointerValue<CMAC>(c).k2) - 1] = $.pointerValue<CMAC>(c).k2[$.len($.pointerValue<CMAC>(c).k2) - 1] ^ ($.uint(msb * 0b10000111, 8))
	}

	static __typeInfo = $.registerStructType(
		"gcm.CMAC",
		() => new CMAC(),
		[{ name: "MAC", args: [{ name: "m", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 16 } }] }, { name: "deriveSubkeys", args: [], returns: [] }],
		CMAC,
		[{ name: "b", key: "b", type: "aes.Block", pkgPath: "crypto/internal/fips140/aes/gcm", index: [0], offset: 0, exported: false }, { name: "k1", key: "k1", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 16 }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [1], offset: 488, exported: false }, { name: "k2", key: "k2", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 16 }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [2], offset: 504, exported: false }]
	)
}

export function NewCMAC(b: aes.Block | $.VarRef<aes.Block> | null): CMAC | $.VarRef<CMAC> | null {
	let c: CMAC | $.VarRef<CMAC> | null = new CMAC({b: $.markAsStructValue($.cloneStructValue($.pointerValue<aes.Block>(b)))})
	CMAC.prototype.deriveSubkeys.call(c)
	return c
}

export function shiftLeft(x: $.VarRef<Uint8Array> | null): number {
	let msb: number = 0
	for (let i = $.len($.pointerValue<Uint8Array>(x)) - 1; i >= 0; i--) {
		let __goscriptAssign0_0: number = $.uint($.uintShr($.arrayIndex($.pointerValue<Uint8Array>(x), i), 7, 8), 8)
		let __goscriptAssign0_1: number = $.uint(($.arrayIndex($.pointerValue<Uint8Array>(x), i) << 1) | msb, 8)
		msb = __goscriptAssign0_0
		$.pointerValue<Uint8Array>(x)[i] = __goscriptAssign0_1
	}
	return $.uint(msb, 8)
}

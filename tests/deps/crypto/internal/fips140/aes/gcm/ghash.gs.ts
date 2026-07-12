// Generated file based on ghash.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as __goscript_gcm from "./gcm.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "./gcm.gs.ts"

export class gcmFieldElement {
	public get low(): bigint {
		return this._fields.low.value
	}
	public set low(value: bigint) {
		this._fields.low.value = value
	}

	public get high(): bigint {
		return this._fields.high.value
	}
	public set high(value: bigint) {
		this._fields.high.value = value
	}

	public _fields: {
		low: $.VarRef<bigint>
		high: $.VarRef<bigint>
	}

	constructor(init?: Partial<{low?: bigint, high?: bigint}>) {
		this._fields = {
			low: $.varRef(init?.low ?? (0n as bigint)),
			high: $.varRef(init?.high ?? (0n as bigint))
		}
	}

	public clone(): gcmFieldElement {
		const cloned = new gcmFieldElement()
		cloned._fields = {
			low: $.varRef(this._fields.low.value),
			high: $.varRef(this._fields.high.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"gcm.gcmFieldElement",
		() => new gcmFieldElement(),
		[],
		gcmFieldElement,
		[{ name: "low", key: "low", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [0], offset: 0, exported: false }, { name: "high", key: "high", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/aes/gcm", index: [1], offset: 8, exported: false }]
	)
}

export function GHASH(key: $.VarRef<Uint8Array> | null, inputs: $.Slice<$.Slice<number>>): $.Slice<number> {
	fips140.RecordNonApproved()
	let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(16))
	ghash(out, key, inputs)
	return $.goSlice(out.value, undefined, undefined)
}

export function ghash(out: $.VarRef<Uint8Array> | null, H: $.VarRef<Uint8Array> | null, inputs: $.Slice<$.Slice<number>>): void {
	// productTable contains the first sixteen powers of the key, H.
	// However, they are in bit reversed order.
	let productTable: $.VarRef<gcmFieldElement[]> = $.varRef(Array.from({ length: 16 }, () => $.markAsStructValue(new gcmFieldElement())))

	// We precompute 16 multiples of H. However, when we do lookups
	// into this table we'll be using bits from a field element and
	// therefore the bits will be in the reverse order. So normally one
	// would expect, say, 4*H to be in index 4 of the table but due to
	// this bit ordering it will actually be in index 0010 (base 2) = 2.
	let x = $.varRef((() => { const __goscriptLiteralField0 = byteorder.BEUint64($.goSlice($.pointerValue<Uint8Array>(H), undefined, 8)); const __goscriptLiteralField1 = byteorder.BEUint64($.goSlice($.pointerValue<Uint8Array>(H), 8, undefined)); return $.markAsStructValue(new gcmFieldElement({low: __goscriptLiteralField0, high: __goscriptLiteralField1})) })())
	productTable.value[reverseBits(1)] = $.markAsStructValue($.cloneStructValue(x.value))

	for (let i = 2; i < 16; i = i + (2)) {
		productTable.value[reverseBits(i)] = $.markAsStructValue($.cloneStructValue(ghashDouble($.indexRef(productTable.value, reverseBits(Math.trunc(i / 2))))))
		productTable.value[reverseBits(i + 1)] = $.markAsStructValue($.cloneStructValue(ghashAdd($.indexRef(productTable.value, reverseBits(i)), x)))
	}

	let y: $.VarRef<gcmFieldElement> = $.varRef($.markAsStructValue(new gcmFieldElement()))
	for (let __goscriptRangeTarget0 = inputs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let input = __goscriptRangeTarget0![__rangeIndex]
		ghashUpdate(productTable, y, input)
	}

	byteorder.BEPutUint64($.goSlice($.pointerValue<Uint8Array>(out), undefined, undefined), y.value.low)
	byteorder.BEPutUint64($.goSlice($.pointerValue<Uint8Array>(out), 8, undefined), y.value.high)
}

export function reverseBits(i: number): number {
	i = ((i << 2) & 0xc) | ((i >> 2) & 0x3)
	i = ((i << 1) & 0xa) | ((i >> 1) & 0x5)
	return i
}

export function ghashAdd(x: gcmFieldElement | $.VarRef<gcmFieldElement> | null, y: gcmFieldElement | $.VarRef<gcmFieldElement> | null): gcmFieldElement {
	// Addition in a characteristic 2 field is just XOR.
	return $.markAsStructValue(new gcmFieldElement({low: $.uint64Xor($.pointerValue<gcmFieldElement>(x).low, $.pointerValue<gcmFieldElement>(y).low), high: $.uint64Xor($.pointerValue<gcmFieldElement>(x).high, $.pointerValue<gcmFieldElement>(y).high)}))
}

export function ghashDouble(x: gcmFieldElement | $.VarRef<gcmFieldElement> | null): gcmFieldElement {
	let double: gcmFieldElement = $.markAsStructValue(new gcmFieldElement())
	let msbSet = ($.uint64And($.pointerValue<gcmFieldElement>(x).high, 1n)) == 1n

	// Because of the bit-ordering, doubling is actually a right shift.
	double.high = $.uint64Shr($.pointerValue<gcmFieldElement>(x).high, 1n)
	double.high = $.uint64Or(double.high, $.uint64Mul($.pointerValue<gcmFieldElement>(x).low, (2 ** 63)))
	double.low = $.uint64Shr($.pointerValue<gcmFieldElement>(x).low, 1n)

	// If the most-significant bit was set before shifting then it,
	// conceptually, becomes a term of x^128. This is greater than the
	// irreducible polynomial so the result has to be reduced. The
	// irreducible polynomial is 1+x+x^2+x^7+x^128. We can subtract that to
	// eliminate the term at x^128 which also means subtracting the other
	// four terms. In characteristic 2 fields, subtraction == addition ==
	// XOR.
	if (msbSet) {
		double.low = $.uint64Xor(double.low, 16212958658533785600n)
	}

	return double
}

export let ghashReductionTable: $.Slice<number> = $.arrayToSlice<number>([$.uint(0x0000, 16), $.uint(0x1c20, 16), $.uint(0x3840, 16), $.uint(0x2460, 16), $.uint(0x7080, 16), $.uint(0x6ca0, 16), $.uint(0x48c0, 16), $.uint(0x54e0, 16), $.uint(0xe100, 16), $.uint(0xfd20, 16), $.uint(0xd940, 16), $.uint(0xc560, 16), $.uint(0x9180, 16), $.uint(0x8da0, 16), $.uint(0xa9c0, 16), $.uint(0xb5e0, 16)])

export function __goscript_set_ghashReductionTable(__goscriptValue: $.Slice<number>): void {
	ghashReductionTable = __goscriptValue
}

export function ghashMul(productTable: $.VarRef<gcmFieldElement[]> | null, y: gcmFieldElement | $.VarRef<gcmFieldElement> | null): void {
	let z: gcmFieldElement = $.markAsStructValue(new gcmFieldElement())

	for (let i = 0; i < 2; i++) {
		let word = $.pointerValue<gcmFieldElement>(y).high
		if (i == 1) {
			word = $.pointerValue<gcmFieldElement>(y).low
		}

		// Multiplication works by multiplying z by 16 and adding in
		// one of the precomputed multiples of H.
		for (let j = 0; j < 64; j = j + (4)) {
			let msw = $.uint64And(z.high, 15n)
			z.high = $.uint64Shr(z.high, 4n)
			z.high = $.uint64Or(z.high, $.uint64Mul(z.low, (2 ** 60)))
			z.low = $.uint64Shr(z.low, 4n)
			z.low = $.uint64Xor(z.low, $.uint64Mul($.uint64($.arrayIndex(ghashReductionTable!, Number(msw))), (2 ** 48)))

			// the values in |table| are ordered for little-endian bit
			// positions. See the comment in New.
			let t = $.markAsStructValue($.cloneStructValue($.arrayIndex($.pointerValue<gcmFieldElement[]>(productTable), Number($.uint64And(word, 15n)))))

			z.low = $.uint64Xor(z.low, t.low)
			z.high = $.uint64Xor(z.high, t.high)
			word = $.uint64Shr(word, 4n)
		}
	}

	$.assignStruct($.pointerValue<gcmFieldElement>(y), $.markAsStructValue($.cloneStructValue(z)))
}

export function updateBlocks(productTable: $.VarRef<gcmFieldElement[]> | null, y: gcmFieldElement | $.VarRef<gcmFieldElement> | null, blocks: $.Slice<number>): void {
	while ($.len(blocks) > 0) {
		$.pointerValue<gcmFieldElement>(y).low = $.uint64Xor($.pointerValue<gcmFieldElement>(y).low, byteorder.BEUint64(blocks))
		$.pointerValue<gcmFieldElement>(y).high = $.uint64Xor($.pointerValue<gcmFieldElement>(y).high, byteorder.BEUint64($.goSlice(blocks, 8, undefined)))
		ghashMul(productTable, y)
		blocks = $.goSlice(blocks, 16, undefined)
	}
}

export function ghashUpdate(productTable: $.VarRef<gcmFieldElement[]> | null, y: gcmFieldElement | $.VarRef<gcmFieldElement> | null, data: $.Slice<number>): void {
	let fullBlocks = ($.len(data) >> 4) << 4
	updateBlocks(productTable, y, $.goSlice(data, undefined, fullBlocks))

	if ($.len(data) != fullBlocks) {
		let partialBlock: Uint8Array = new Uint8Array(16)
		$.copy($.goSlice(partialBlock, undefined, undefined), $.goSlice(data, fullBlocks, undefined))
		updateBlocks(productTable, y, $.goSlice(partialBlock, undefined, undefined))
	}
}

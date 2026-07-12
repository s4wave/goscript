// Generated file based on ctr.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as alias from "@goscript/crypto/internal/fips140/alias/index.js"

import * as subtle from "@goscript/crypto/internal/fips140/subtle/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as bits from "@goscript/math/bits/index.js"

import * as __goscript_aes from "./aes.gs.ts"

import * as __goscript_aes_noasm from "./aes_noasm.gs.ts"

import * as __goscript_ctr_noasm from "./ctr_noasm.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/alias/index.js"
import "@goscript/crypto/internal/fips140/subtle/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/math/bits/index.js"
import "./aes.gs.ts"
import "./aes_noasm.gs.ts"
import "./ctr_noasm.gs.ts"

export class CTR {
	public get b(): __goscript_aes.Block {
		return this._fields.b.value
	}
	public set b(value: __goscript_aes.Block) {
		this._fields.b.value = value
	}

	public get ivlo(): bigint {
		return this._fields.ivlo.value
	}
	public set ivlo(value: bigint) {
		this._fields.ivlo.value = value
	}

	public get ivhi(): bigint {
		return this._fields.ivhi.value
	}
	public set ivhi(value: bigint) {
		this._fields.ivhi.value = value
	}

	public get offset(): bigint {
		return this._fields.offset.value
	}
	public set offset(value: bigint) {
		this._fields.offset.value = value
	}

	public _fields: {
		b: $.VarRef<__goscript_aes.Block>
		ivlo: $.VarRef<bigint>
		ivhi: $.VarRef<bigint>
		offset: $.VarRef<bigint>
	}

	constructor(init?: Partial<{b?: __goscript_aes.Block, ivlo?: bigint, ivhi?: bigint, offset?: bigint}>) {
		this._fields = {
			b: $.varRef(init?.b ? $.markAsStructValue($.cloneStructValue(init.b)) : $.markAsStructValue(new __goscript_aes.Block())),
			ivlo: $.varRef(init?.ivlo ?? (0n as bigint)),
			ivhi: $.varRef(init?.ivhi ?? (0n as bigint)),
			offset: $.varRef(init?.offset ?? (0n as bigint))
		}
	}

	public clone(): CTR {
		const cloned = new CTR()
		cloned._fields = {
			b: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.b.value))),
			ivlo: $.varRef(this._fields.ivlo.value),
			ivhi: $.varRef(this._fields.ivhi.value),
			offset: $.varRef(this._fields.offset.value)
		}
		return $.markAsStructValue(cloned)
	}

	public XORKeyStream(dst: $.Slice<number>, src: $.Slice<number>): void {
		let c: CTR | $.VarRef<CTR> | null = this
		CTR.prototype.XORKeyStreamAt.call(c, dst, src, $.pointerValue<CTR>(c).offset)

		let carry: bigint = 0n
		let __goscriptTuple0: any = bits.Add64($.pointerValue<CTR>(c).offset, $.uint64($.len(src)), 0n)
		$.pointerValue<CTR>(c).offset = __goscriptTuple0[0]
		carry = __goscriptTuple0[1]
		if (carry != 0n) {
			$.panic("crypto/aes: counter overflow")
		}
	}

	public XORKeyStreamAt(dst: $.Slice<number>, src: $.Slice<number>, offset: bigint): void {
		const c: CTR | $.VarRef<CTR> | null = this
		if ($.len(dst) < $.len(src)) {
			$.panic("crypto/aes: len(dst) < len(src)")
		}
		dst = $.goSlice(dst, undefined, $.len(src))
		if (alias.InexactOverlap(dst, src)) {
			$.panic("crypto/aes: invalid buffer overlap")
		}
		fips140.RecordApproved()

		let __goscriptTuple1: any = add128($.pointerValue<CTR>(c).ivlo, $.pointerValue<CTR>(c).ivhi, $.uint64Div(offset, 16n))
		let ivlo = __goscriptTuple1[0]
		let ivhi = __goscriptTuple1[1]

		{
			let blockOffset = $.uint64Mod(offset, 16n)
			if (blockOffset != 0n) {
				// We have a partial block at the beginning.
				let _in: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(16))
				let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(16))
				$.copy($.goSlice(_in.value, Number(blockOffset), undefined), src)
				__goscript_ctr_noasm.ctrBlocks1($.pointerValue<CTR>(c)._fields.b, out, _in, ivlo, ivhi)
				let n = $.copy(dst, $.goSlice(out.value, Number(blockOffset), undefined))
				src = $.goSlice(src, n, undefined)
				dst = $.goSlice(dst, n, undefined)
				let __goscriptTuple2: any = add128(ivlo, ivhi, 1n)
				ivlo = __goscriptTuple2[0]
				ivhi = __goscriptTuple2[1]
			}
		}

		while ($.len(src) >= (8 * 16)) {
			__goscript_ctr_noasm.ctrBlocks8($.pointerValue<CTR>(c)._fields.b, ($.sliceToArrayPointer<number>(dst, 128, "byte") as $.VarRef<Uint8Array> | null), ($.sliceToArrayPointer<number>(src, 128, "byte") as $.VarRef<Uint8Array> | null), ivlo, ivhi)
			src = $.goSlice(src, 8 * 16, undefined)
			dst = $.goSlice(dst, 8 * 16, undefined)
			let __goscriptTuple3: any = add128(ivlo, ivhi, 8n)
			ivlo = __goscriptTuple3[0]
			ivhi = __goscriptTuple3[1]
		}

		// The tail can have at most 7 = 4 + 2 + 1 blocks.
		if ($.len(src) >= (4 * 16)) {
			__goscript_ctr_noasm.ctrBlocks4($.pointerValue<CTR>(c)._fields.b, ($.sliceToArrayPointer<number>(dst, 64, "byte") as $.VarRef<Uint8Array> | null), ($.sliceToArrayPointer<number>(src, 64, "byte") as $.VarRef<Uint8Array> | null), ivlo, ivhi)
			src = $.goSlice(src, 4 * 16, undefined)
			dst = $.goSlice(dst, 4 * 16, undefined)
			let __goscriptTuple4: any = add128(ivlo, ivhi, 4n)
			ivlo = __goscriptTuple4[0]
			ivhi = __goscriptTuple4[1]
		}
		if ($.len(src) >= (2 * 16)) {
			__goscript_ctr_noasm.ctrBlocks2($.pointerValue<CTR>(c)._fields.b, ($.sliceToArrayPointer<number>(dst, 32, "byte") as $.VarRef<Uint8Array> | null), ($.sliceToArrayPointer<number>(src, 32, "byte") as $.VarRef<Uint8Array> | null), ivlo, ivhi)
			src = $.goSlice(src, 2 * 16, undefined)
			dst = $.goSlice(dst, 2 * 16, undefined)
			let __goscriptTuple5: any = add128(ivlo, ivhi, 2n)
			ivlo = __goscriptTuple5[0]
			ivhi = __goscriptTuple5[1]
		}
		if ($.len(src) >= (1 * 16)) {
			__goscript_ctr_noasm.ctrBlocks1($.pointerValue<CTR>(c)._fields.b, ($.sliceToArrayPointer<number>(dst, 16, "byte") as $.VarRef<Uint8Array> | null), ($.sliceToArrayPointer<number>(src, 16, "byte") as $.VarRef<Uint8Array> | null), ivlo, ivhi)
			src = $.goSlice(src, 1 * 16, undefined)
			dst = $.goSlice(dst, 1 * 16, undefined)
			let __goscriptTuple6: any = add128(ivlo, ivhi, 1n)
			ivlo = __goscriptTuple6[0]
			ivhi = __goscriptTuple6[1]
		}

		if ($.len(src) != 0) {
			// We have a partial block at the end.
			let _in: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(16))
			let out: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(16))
			$.copy($.goSlice(_in.value, undefined, undefined), src)
			__goscript_ctr_noasm.ctrBlocks1($.pointerValue<CTR>(c)._fields.b, out, _in, ivlo, ivhi)
			$.copy(dst, $.goSlice(out.value, undefined, undefined))
		}
	}

	static __typeInfo = $.registerStructType(
		"aes.CTR",
		() => new CTR(),
		[{ name: "XORKeyStream", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "XORKeyStreamAt", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "offset", type: { kind: $.TypeKind.Basic, name: "uint64" } }], returns: [] }],
		CTR,
		[{ name: "b", key: "b", type: "aes.Block", pkgPath: "crypto/internal/fips140/aes", index: [0], offset: 0, exported: false }, { name: "ivlo", key: "ivlo", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/aes", index: [1], offset: 488, exported: false }, { name: "ivhi", key: "ivhi", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/aes", index: [2], offset: 496, exported: false }, { name: "offset", key: "offset", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/aes", index: [3], offset: 504, exported: false }]
	)
}

export function NewCTR(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, iv: $.Slice<number>): CTR | $.VarRef<CTR> | null {
	// Allocate the CTR here, in an easily inlineable function, so
	// the allocation can be done in the caller's stack frame
	// instead of the heap.  See issue 70499.
	let c = $.varRef($.markAsStructValue($.cloneStructValue(newCTR(b, iv))))
	return c
}

export function newCTR(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, iv: $.Slice<number>): CTR {
	if ($.len(iv) != 16) {
		$.panic("bad IV length")
	}

	return (() => { const __goscriptLiteralField0 = byteorder.BEUint64($.goSlice(iv, 8, 16)); const __goscriptLiteralField1 = byteorder.BEUint64($.goSlice(iv, 0, 8)); return $.markAsStructValue(new CTR({b: $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_aes.Block>(b))), ivlo: __goscriptLiteralField0, ivhi: __goscriptLiteralField1, offset: 0n})) })()
}

export function RoundToBlock(c: CTR | $.VarRef<CTR> | null): void {
	{
		let remainder = $.uint64Mod($.pointerValue<CTR>(c).offset, 16n)
		if (remainder != 0n) {
			let carry: bigint = 0n
			let __goscriptTuple7: any = bits.Add64($.pointerValue<CTR>(c).offset, $.uint64Sub(16n, remainder), 0n)
			$.pointerValue<CTR>(c).offset = __goscriptTuple7[0]
			carry = __goscriptTuple7[1]
			if (carry != 0n) {
				$.panic("crypto/aes: counter overflow")
			}
		}
	}
}

export function ctrBlocks(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, dst: $.Slice<number>, src: $.Slice<number>, ivlo: bigint, ivhi: bigint): void {
	let buf: $.Slice<number> = $.makeSlice<number>($.len(src), 8 * 16, "byte")
	for (let i = 0; i < $.len(buf); i = i + (16)) {
		byteorder.BEPutUint64($.goSlice(buf, i, undefined), ivhi)
		byteorder.BEPutUint64($.goSlice(buf, i + 8, undefined), ivlo)
		let __goscriptTuple8: any = add128(ivlo, ivhi, 1n)
		ivlo = __goscriptTuple8[0]
		ivhi = __goscriptTuple8[1]
		__goscript_aes_noasm.encryptBlock(b, $.goSlice(buf, i, undefined), $.goSlice(buf, i, undefined))
	}
	// XOR into buf first, in case src and dst overlap (see above).
	subtle.XORBytes(buf, src, buf)
	$.copy(dst, buf)
}

export function add128(lo: bigint, hi: bigint, x: bigint): [bigint, bigint] {
	let __goscriptTuple9: any = bits.Add64(lo, x, 0n)
	lo = __goscriptTuple9[0]
	let c = __goscriptTuple9[1]
	let __goscriptTuple10: any = bits.Add64(hi, 0n, c)
	hi = __goscriptTuple10[0]
	return [lo, hi]
}

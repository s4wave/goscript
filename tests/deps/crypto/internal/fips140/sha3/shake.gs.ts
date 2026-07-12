// Generated file based on shake.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as errors from "@goscript/errors/index.js"

import * as bits from "@goscript/math/bits/index.js"

import * as __goscript_hashes from "./hashes.gs.ts"

import * as __goscript_sha3 from "./sha3.gs.ts"

import * as __goscript_sha3_noasm from "./sha3_noasm.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/errors/index.js"
import "@goscript/math/bits/index.js"
import "./hashes.gs.ts"
import "./sha3.gs.ts"
import "./sha3_noasm.gs.ts"

export class SHAKE {
	public get d(): __goscript_sha3.Digest {
		return this._fields.d.value
	}
	public set d(value: __goscript_sha3.Digest) {
		this._fields.d.value = value
	}

	// initBlock is the cSHAKE specific initialization set of bytes. It is initialized
	// by newCShake function and stores concatenation of N followed by S, encoded
	// by the method specified in 3.3 of [1].
	// It is stored here in order for Reset() to be able to put context into
	// initial state.
	public get initBlock(): $.Slice<number> {
		return this._fields.initBlock.value
	}
	public set initBlock(value: $.Slice<number>) {
		this._fields.initBlock.value = value
	}

	public _fields: {
		d: $.VarRef<__goscript_sha3.Digest>
		initBlock: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{d?: __goscript_sha3.Digest, initBlock?: $.Slice<number>}>) {
		this._fields = {
			d: $.varRef(init?.d ? $.markAsStructValue($.cloneStructValue(init.d)) : $.markAsStructValue(new __goscript_sha3.Digest())),
			initBlock: $.varRef(init?.initBlock ?? (null as $.Slice<number>))
		}
	}

	public clone(): SHAKE {
		const cloned = new SHAKE()
		cloned._fields = {
			d: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.d.value))),
			initBlock: $.varRef(this._fields.initBlock.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		let __goscriptTuple0: any = $.pointerValue<SHAKE>(s).d.AppendBinary(b)
		b = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return [null, err]
		}
		b = $.appendSlice(b, $.pointerValue<SHAKE>(s).initBlock, $.byteSliceHint)
		return [b, null]
	}

	public BlockSize(): number {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		return $.pointerValue<SHAKE>(s).d.BlockSize()
	}

	public Clone(): SHAKE | $.VarRef<SHAKE> | null {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		let ret = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<SHAKE>(s))))
		return ret
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		return SHAKE.prototype.AppendBinary.call(s, $.makeSlice<number>(0, 207 + $.len($.pointerValue<SHAKE>(s).initBlock), "byte"))
	}

	public Read(out: $.Slice<number>): [number, $.GoError] {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		fips140.RecordApproved()
		// Note that read is not exposed on Digest since SHA-3 does not offer
		// variable output length. It is only used internally by Sum.
		return $.pointerValue<SHAKE>(s).d.read(out)
	}

	public Reset(): void {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		$.pointerValue<SHAKE>(s).d.Reset()
		if ($.len($.pointerValue<SHAKE>(s).initBlock) != 0) {
			bytepadWrite(s, $.pointerValue<SHAKE>(s).initBlock, $.pointerValue<SHAKE>(s).d.rate)
		}
	}

	public Size(): number {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		return $.pointerValue<SHAKE>(s).d.Size()
	}

	public Sum(_in: $.Slice<number>): $.Slice<number> {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		return $.pointerValue<SHAKE>(s).d.Sum(_in)
	}

	public UnmarshalBinary(b: $.Slice<number>): $.GoError {
		let s: SHAKE | $.VarRef<SHAKE> | null = this
		if ($.len(b) < 207) {
			return errors.New("sha3: invalid hash state")
		}
		{
			let err = $.pointerValue<SHAKE>(s).d.UnmarshalBinary($.goSlice(b, undefined, 207))
			if (err != null) {
				return err
			}
		}
		$.pointerValue<SHAKE>(s).initBlock = bytes.Clone($.goSlice(b, 207, undefined))
		return null
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		return $.pointerValue<SHAKE>(s).d.Write(p)
	}

	static __typeInfo = $.registerStructType(
		"sha3.SHAKE",
		() => new SHAKE(),
		[{ name: "AppendBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Clone", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "sha3.SHAKE" } }] }, { name: "MarshalBinary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Read", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "Reset", args: [], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Sum", args: [{ name: "in", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "UnmarshalBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		SHAKE,
		[{ name: "d", key: "d", type: "sha3.Digest", pkgPath: "crypto/internal/fips140/sha3", index: [0], offset: 0, exported: false }, { name: "initBlock", key: "initBlock", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/internal/fips140/sha3", index: [1], offset: 240, exported: false }]
	)
}

export function bytepadWrite(c: SHAKE | $.VarRef<SHAKE> | null, data: $.Slice<number>, rate: number): void {
	let rateEnc: $.Slice<number> = leftEncode($.uint64(rate))
	SHAKE.prototype.Write.call(c, rateEnc)
	SHAKE.prototype.Write.call(c, data)
	{
		let padlen = rate - (($.len(rateEnc) + $.len(data)) % rate)
		if (padlen < rate) {
			const maxRate: number = 168
			SHAKE.prototype.Write.call(c, $.makeSlice<number>(padlen, 168, "byte"))
		}
	}
}

export function leftEncode(x: bigint): $.Slice<number> {
	// Let n be the smallest positive integer for which 2^(8n) > x.
	let n = Math.trunc((bits.Len64(x) + 7) / 8)
	if (n == 0) {
		n = 1
	}
	// Return n || x with n as a byte and x an n bytes in big-endian order.
	let b: $.Slice<number> = $.makeSlice<number>(9, undefined, "byte")
	byteorder.BEPutUint64($.goSlice(b, 1, undefined), x)
	b = $.goSlice(b, (9 - n) - 1, undefined)
	b![0] = $.uint($.uint(n, 8), 8)
	return b
}

export function newCShake(c: SHAKE | $.VarRef<SHAKE> | null, N: $.Slice<number>, S: $.Slice<number>, rate: number, outputLen: number, dsbyte: number): SHAKE | $.VarRef<SHAKE> | null {
	$.pointerValue<SHAKE>(c).d = $.markAsStructValue(new __goscript_sha3.Digest({rate: rate, outputLen: outputLen, dsbyte: $.uint(dsbyte, 8)}))
	$.pointerValue<SHAKE>(c).initBlock = $.makeSlice<number>(0, ((9 + $.len(N)) + 9) + $.len(S), "byte")
	$.pointerValue<SHAKE>(c).initBlock = $.appendSlice($.pointerValue<SHAKE>(c).initBlock, leftEncode($.uint64Mul($.uint64($.len(N)), 8n)), $.byteSliceHint)
	$.pointerValue<SHAKE>(c).initBlock = $.appendSlice($.pointerValue<SHAKE>(c).initBlock, N, $.byteSliceHint)
	$.pointerValue<SHAKE>(c).initBlock = $.appendSlice($.pointerValue<SHAKE>(c).initBlock, leftEncode($.uint64Mul($.uint64($.len(S)), 8n)), $.byteSliceHint)
	$.pointerValue<SHAKE>(c).initBlock = $.appendSlice($.pointerValue<SHAKE>(c).initBlock, S, $.byteSliceHint)
	bytepadWrite(c, $.pointerValue<SHAKE>(c).initBlock, $.pointerValue<SHAKE>(c).d.rate)
	return c
}

export function NewShake128(): SHAKE | $.VarRef<SHAKE> | null {
	return new SHAKE({d: $.markAsStructValue(new __goscript_sha3.Digest({rate: 168, outputLen: 32, dsbyte: $.uint(31, 8)}))})
}

export function NewShake256(): SHAKE | $.VarRef<SHAKE> | null {
	return new SHAKE({d: $.markAsStructValue(new __goscript_sha3.Digest({rate: 136, outputLen: 64, dsbyte: $.uint(31, 8)}))})
}

export function NewCShake128(N: $.Slice<number>, S: $.Slice<number>): SHAKE | $.VarRef<SHAKE> | null {
	// The actual logic is in a separate function to outline this allocation.
	let c: SHAKE | $.VarRef<SHAKE> | null = new SHAKE()
	return newCShake128(c, N, S)
}

export function newCShake128(c: SHAKE | $.VarRef<SHAKE> | null, N: $.Slice<number>, S: $.Slice<number>): SHAKE | $.VarRef<SHAKE> | null {
	if (($.len(N) == 0) && ($.len(S) == 0)) {
		$.assignStruct($.pointerValue<SHAKE>(c), $.markAsStructValue($.cloneStructValue($.pointerValue<SHAKE>(NewShake128()))))
		return c
	}
	return newCShake(c, N, S, 168, 32, $.uint(4, 8))
}

export function NewCShake256(N: $.Slice<number>, S: $.Slice<number>): SHAKE | $.VarRef<SHAKE> | null {
	// The actual logic is in a separate function to outline this allocation.
	let c: SHAKE | $.VarRef<SHAKE> | null = new SHAKE()
	return newCShake256(c, N, S)
}

export function newCShake256(c: SHAKE | $.VarRef<SHAKE> | null, N: $.Slice<number>, S: $.Slice<number>): SHAKE | $.VarRef<SHAKE> | null {
	if (($.len(N) == 0) && ($.len(S) == 0)) {
		$.assignStruct($.pointerValue<SHAKE>(c), $.markAsStructValue($.cloneStructValue($.pointerValue<SHAKE>(NewShake256()))))
		return c
	}
	return newCShake(c, N, S, 136, 64, $.uint(4, 8))
}

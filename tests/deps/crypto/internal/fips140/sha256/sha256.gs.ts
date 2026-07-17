// Generated file based on sha256.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as errors from "@goscript/errors/index.js"

import * as hash2 from "@goscript/hash/index.js"

import * as __goscript_sha256block_noasm from "./sha256block_noasm.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/errors/index.js"
import "@goscript/hash/index.js"
import "./sha256block_noasm.gs.ts"

export class Digest {
	public get h(): number[] {
		return this._fields.h.value
	}
	public set h(value: number[]) {
		this._fields.h.value = value
	}

	public get x(): Uint8Array {
		return this._fields.x.value
	}
	public set x(value: Uint8Array) {
		this._fields.x.value = value
	}

	public get nx(): number {
		return this._fields.nx.value
	}
	public set nx(value: number) {
		this._fields.nx.value = value
	}

	public get len(): bigint {
		return this._fields.len.value
	}
	public set len(value: bigint) {
		this._fields.len.value = value
	}

	public get is224(): boolean {
		return this._fields.is224.value
	}
	public set is224(value: boolean) {
		this._fields.is224.value = value
	}

	public _fields: {
		h: $.VarRef<number[]>
		x: $.VarRef<Uint8Array>
		nx: $.VarRef<number>
		len: $.VarRef<bigint>
		is224: $.VarRef<boolean>
	}

	constructor(init?: Partial<{h?: number[], x?: Uint8Array, nx?: number, len?: bigint, is224?: boolean}>) {
		this._fields = {
			h: $.varRef(init?.h !== undefined ? $.cloneArrayValue(init.h) : Array.from({ length: 8 }, () => 0)),
			x: $.varRef(init?.x !== undefined ? $.cloneArrayValue(init.x) : new Uint8Array(64)),
			nx: $.varRef(init?.nx ?? (0 as number)),
			len: $.varRef(init?.len ?? (0n as bigint)),
			is224: $.varRef(init?.is224 ?? (false as boolean))
		}
	}

	public clone(): Digest {
		const cloned = new Digest()
		cloned._fields = {
			h: $.varRef($.cloneArrayValue(this._fields.h.value)),
			x: $.varRef($.cloneArrayValue(this._fields.x.value)),
			nx: $.varRef(this._fields.nx.value),
			len: $.varRef(this._fields.len.value),
			is224: $.varRef(this._fields.is224.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const d: Digest | $.VarRef<Digest> | null = this
		if ($.pointerValue<Digest>(d).is224) {
			b = $.appendSlice(b, $.stringToBytes("sha\x02"), $.byteSliceHint)
		} else {
			b = $.appendSlice(b, $.stringToBytes("sha\x03"), $.byteSliceHint)
		}
		b = byteorder.BEAppendUint32(b, $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 0), 32))
		b = byteorder.BEAppendUint32(b, $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 1), 32))
		b = byteorder.BEAppendUint32(b, $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 2), 32))
		b = byteorder.BEAppendUint32(b, $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 3), 32))
		b = byteorder.BEAppendUint32(b, $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 4), 32))
		b = byteorder.BEAppendUint32(b, $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 5), 32))
		b = byteorder.BEAppendUint32(b, $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 6), 32))
		b = byteorder.BEAppendUint32(b, $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 7), 32))
		b = $.appendSlice(b, $.goSlice($.pointerValue<Digest>(d).x, undefined, $.pointerValue<Digest>(d).nx), $.byteSliceHint)
		b = $.appendSlice(b, $.makeSlice<number>($.len($.pointerValue<Digest>(d).x) - $.pointerValue<Digest>(d).nx, undefined, "byte"), $.byteSliceHint)
		b = byteorder.BEAppendUint64(b, $.pointerValue<Digest>(d).len)
		return [b, null]
	}

	public BlockSize(): number {
		const d: Digest | $.VarRef<Digest> | null = this
		return 64
	}

	public Clone(): [hash2.Cloner | null, $.GoError] {
		const d: Digest | $.VarRef<Digest> | null = this
		let r = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<Digest>(d))))
		return [$.interfaceValue<hash2.Cloner | null>(r, "*sha256.Digest", { kind: $.TypeKind.Pointer, elemType: "sha256.Digest" }), null]
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const d: Digest | $.VarRef<Digest> | null = this
		return Digest.prototype.AppendBinary.call(d, $.makeSlice<number>(0, 108, "byte"))
	}

	public Reset(): void {
		let d: Digest | $.VarRef<Digest> | null = this
		if (!$.pointerValue<Digest>(d).is224) {
			$.pointerValue<Digest>(d).h[0] = $.uint(1779033703, 32)
			$.pointerValue<Digest>(d).h[1] = $.uint(3144134277, 32)
			$.pointerValue<Digest>(d).h[2] = $.uint(1013904242, 32)
			$.pointerValue<Digest>(d).h[3] = $.uint(2773480762, 32)
			$.pointerValue<Digest>(d).h[4] = $.uint(1359893119, 32)
			$.pointerValue<Digest>(d).h[5] = $.uint(2600822924, 32)
			$.pointerValue<Digest>(d).h[6] = $.uint(528734635, 32)
			$.pointerValue<Digest>(d).h[7] = $.uint(1541459225, 32)
		} else {
			$.pointerValue<Digest>(d).h[0] = $.uint(3238371032, 32)
			$.pointerValue<Digest>(d).h[1] = $.uint(914150663, 32)
			$.pointerValue<Digest>(d).h[2] = $.uint(812702999, 32)
			$.pointerValue<Digest>(d).h[3] = $.uint(4144912697, 32)
			$.pointerValue<Digest>(d).h[4] = $.uint(4290775857, 32)
			$.pointerValue<Digest>(d).h[5] = $.uint(1750603025, 32)
			$.pointerValue<Digest>(d).h[6] = $.uint(1694076839, 32)
			$.pointerValue<Digest>(d).h[7] = $.uint(3204075428, 32)
		}
		$.pointerValue<Digest>(d).nx = 0
		$.pointerValue<Digest>(d).len = 0n
	}

	public Size(): number {
		const d: Digest | $.VarRef<Digest> | null = this
		if (!$.pointerValue<Digest>(d).is224) {
			return 32
		}
		return 28
	}

	public Sum(_in: $.Slice<number>): $.Slice<number> {
		const d: Digest | $.VarRef<Digest> | null = this
		fips140.RecordApproved()
		// Make a copy of d so that caller can keep writing and summing.
		let d0 = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<Digest>(d))))
		let __goscriptShadow0 = d0.value.checkSum()
		if (d0.value.is224) {
			return $.appendSlice(_in, $.goSlice(__goscriptShadow0, undefined, 28), $.byteSliceHint)
		}
		return $.appendSlice(_in, $.goSlice(__goscriptShadow0, undefined, undefined), $.byteSliceHint)
	}

	public UnmarshalBinary(b: $.Slice<number>): $.GoError {
		let d: Digest | $.VarRef<Digest> | null = this
		if ((($.len(b) < 4) || ($.pointerValue<Digest>(d).is224 && (!$.stringEqual($.bytesToString($.goSlice(b, undefined, 4)), "sha\x02")))) || (!$.pointerValue<Digest>(d).is224 && (!$.stringEqual($.bytesToString($.goSlice(b, undefined, 4)), "sha\x03")))) {
			return errors.New("crypto/sha256: invalid hash state identifier")
		}
		if ($.len(b) != 108) {
			return errors.New("crypto/sha256: invalid hash state size")
		}
		b = $.goSlice(b, 4, undefined)
		let __goscriptTuple0: any = consumeUint32(b)
		b = __goscriptTuple0[0]
		$.pointerValue<Digest>(d).h[0] = $.uint(__goscriptTuple0[1], 32)
		let __goscriptTuple1: any = consumeUint32(b)
		b = __goscriptTuple1[0]
		$.pointerValue<Digest>(d).h[1] = $.uint(__goscriptTuple1[1], 32)
		let __goscriptTuple2: any = consumeUint32(b)
		b = __goscriptTuple2[0]
		$.pointerValue<Digest>(d).h[2] = $.uint(__goscriptTuple2[1], 32)
		let __goscriptTuple3: any = consumeUint32(b)
		b = __goscriptTuple3[0]
		$.pointerValue<Digest>(d).h[3] = $.uint(__goscriptTuple3[1], 32)
		let __goscriptTuple4: any = consumeUint32(b)
		b = __goscriptTuple4[0]
		$.pointerValue<Digest>(d).h[4] = $.uint(__goscriptTuple4[1], 32)
		let __goscriptTuple5: any = consumeUint32(b)
		b = __goscriptTuple5[0]
		$.pointerValue<Digest>(d).h[5] = $.uint(__goscriptTuple5[1], 32)
		let __goscriptTuple6: any = consumeUint32(b)
		b = __goscriptTuple6[0]
		$.pointerValue<Digest>(d).h[6] = $.uint(__goscriptTuple6[1], 32)
		let __goscriptTuple7: any = consumeUint32(b)
		b = __goscriptTuple7[0]
		$.pointerValue<Digest>(d).h[7] = $.uint(__goscriptTuple7[1], 32)
		b = $.goSlice(b, $.copy($.goSlice($.pointerValue<Digest>(d).x, undefined, undefined), b), undefined)
		let __goscriptTuple8: any = consumeUint64(b)
		b = __goscriptTuple8[0]
		$.pointerValue<Digest>(d).len = __goscriptTuple8[1]
		$.pointerValue<Digest>(d).nx = $.int($.uint64Mod($.pointerValue<Digest>(d).len, 64n))
		return null
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		let d: Digest | $.VarRef<Digest> | null = this
		let nn: number = 0
		let err: $.GoError = null! as $.GoError
		nn = $.len(p)
		$.pointerValue<Digest>(d).len = $.uint64Add($.pointerValue<Digest>(d).len, $.uint64(nn))
		if ($.pointerValue<Digest>(d).nx > 0) {
			let n = $.copy($.goSlice($.pointerValue<Digest>(d).x, $.pointerValue<Digest>(d).nx, undefined), p)
			$.pointerValue<Digest>(d).nx = $.pointerValue<Digest>(d).nx + (n)
			if ($.pointerValue<Digest>(d).nx == 64) {
				__goscript_sha256block_noasm.block(d, $.goSlice($.pointerValue<Digest>(d).x, undefined, undefined))
				$.pointerValue<Digest>(d).nx = 0
			}
			p = $.goSlice(p, n, undefined)
		}
		if ($.len(p) >= 64) {
			let n = $.len(p) & ~((64 - 1))
			while (n > 65536) {
				__goscript_sha256block_noasm.block(d, $.goSlice(p, undefined, 65536))
				p = $.goSlice(p, 65536, undefined)
				n = n - (65536)
			}
			__goscript_sha256block_noasm.block(d, $.goSlice(p, undefined, n))
			p = $.goSlice(p, n, undefined)
		}
		if ($.len(p) > 0) {
			$.pointerValue<Digest>(d).nx = $.copy($.goSlice($.pointerValue<Digest>(d).x, undefined, undefined), p)
		}
		return [nn, err]
	}

	public checkSum(): Uint8Array {
		const d: Digest | $.VarRef<Digest> | null = this
		let len = $.pointerValue<Digest>(d).len
		// Padding. Add a 1 bit and 0 bits until 56 bytes mod 64.
		let tmp: Uint8Array = new Uint8Array(72)
		tmp[0] = $.uint(0x80, 8)
		let t: bigint = 0n
		if (($.uint64Mod(len, 64n)) < 56n) {
			t = $.uint64Sub(56n, ($.uint64Mod(len, 64n)))
		} else {
			t = $.uint64Sub(120n, ($.uint64Mod(len, 64n)))
		}

		// Length in bits.
		len = $.uint64Shl(len, 3n)
		let padlen: $.Slice<number> = $.goSlice(tmp, undefined, Number($.uint64Add(t, 8n)))
		byteorder.BEPutUint64($.goSlice(padlen, Number($.uint64Add(t, 0n)), undefined), len)
		Digest.prototype.Write.call(d, padlen)

		if ($.pointerValue<Digest>(d).nx != 0) {
			$.panic("d.nx != 0")
		}

		let digest: Uint8Array = new Uint8Array(32)

		byteorder.BEPutUint32($.goSlice(digest, 0, undefined), $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 0), 32))
		byteorder.BEPutUint32($.goSlice(digest, 4, undefined), $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 1), 32))
		byteorder.BEPutUint32($.goSlice(digest, 8, undefined), $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 2), 32))
		byteorder.BEPutUint32($.goSlice(digest, 12, undefined), $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 3), 32))
		byteorder.BEPutUint32($.goSlice(digest, 16, undefined), $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 4), 32))
		byteorder.BEPutUint32($.goSlice(digest, 20, undefined), $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 5), 32))
		byteorder.BEPutUint32($.goSlice(digest, 24, undefined), $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 6), 32))
		if (!$.pointerValue<Digest>(d).is224) {
			byteorder.BEPutUint32($.goSlice(digest, 28, undefined), $.uint($.arrayIndex($.pointerValue<Digest>(d).h, 7), 32))
		}

		return digest
	}

	static __typeInfo = $.registerStructType(
		"sha256.Digest",
		() => new Digest(),
		[{ name: "AppendBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Clone", args: [], returns: [{ name: "_r0", type: "hash.Cloner" }, { name: "_r1", type: "error" }] }, { name: "MarshalBinary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Reset", args: [], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Sum", args: [{ name: "in", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "UnmarshalBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "nn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "checkSum", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 } }] }],
		Digest,
		[{ name: "h", key: "h", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint32" }, length: 8 }, pkgPath: "crypto/internal/fips140/sha256", index: [0], offset: 0, exported: false }, { name: "x", key: "x", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 64 }, pkgPath: "crypto/internal/fips140/sha256", index: [1], offset: 32, exported: false }, { name: "nx", key: "nx", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/fips140/sha256", index: [2], offset: 96, exported: false }, { name: "len", key: "len", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/sha256", index: [3], offset: 104, exported: false }, { name: "is224", key: "is224", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "crypto/internal/fips140/sha256", index: [4], offset: 112, exported: false }]
	)
}

export const size: number = 32

export const size224: number = 28

export const blockSize: number = 64

export const maxAsmIters: number = 1024

export const maxAsmSize: number = 65536

export const chunk: number = 64

export const init0: number = 1779033703

export const init1: number = 3144134277

export const init2: number = 1013904242

export const init3: number = 2773480762

export const init4: number = 1359893119

export const init5: number = 2600822924

export const init6: number = 528734635

export const init7: number = 1541459225

export const init0_224: number = 3238371032

export const init1_224: number = 914150663

export const init2_224: number = 812702999

export const init3_224: number = 4144912697

export const init4_224: number = 4290775857

export const init5_224: number = 1750603025

export const init6_224: number = 1694076839

export const init7_224: number = 3204075428

export const magic224: string = "sha\x02"

export const magic256: string = "sha\x03"

export const marshaledSize: number = 108

export function consumeUint64(b: $.Slice<number>): [$.Slice<number>, bigint] {
	return [$.goSlice(b, 8, undefined), byteorder.BEUint64(b)]
}

export function consumeUint32(b: $.Slice<number>): [$.Slice<number>, number] {
	return [$.goSlice(b, 4, undefined), $.uint(byteorder.BEUint32(b), 32)]
}

export function New(): Digest | $.VarRef<Digest> | null {
	let d: Digest | $.VarRef<Digest> | null = new Digest()
	Digest.prototype.Reset.call(d)
	return d
}

export function New224(): Digest | $.VarRef<Digest> | null {
	let d: Digest | $.VarRef<Digest> | null = new Digest()
	$.pointerValue<Digest>(d).is224 = true
	Digest.prototype.Reset.call(d)
	return d
}

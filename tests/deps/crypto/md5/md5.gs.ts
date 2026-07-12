// Generated file based on md5.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as fips140only from "@goscript/crypto/internal/fips140only/index.js"

import * as errors from "@goscript/errors/index.js"

import * as hash2 from "@goscript/hash/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as __goscript_md5block from "./md5block.gs.ts"

import * as __goscript_md5block_generic from "./md5block_generic.gs.ts"
import "@goscript/crypto/index.js"
import "@goscript/crypto/internal/fips140only/index.js"
import "@goscript/errors/index.js"
import "@goscript/hash/index.js"
import "@goscript/internal/byteorder/index.js"
import "./md5block.gs.ts"
import "./md5block_generic.gs.ts"

export class digest {
	public get s(): number[] {
		return this._fields.s.value
	}
	public set s(value: number[]) {
		this._fields.s.value = value
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

	public _fields: {
		s: $.VarRef<number[]>
		x: $.VarRef<Uint8Array>
		nx: $.VarRef<number>
		len: $.VarRef<bigint>
	}

	constructor(init?: Partial<{s?: number[], x?: Uint8Array, nx?: number, len?: bigint}>) {
		this._fields = {
			s: $.varRef(init?.s !== undefined ? $.cloneArrayValue(init.s) : Array.from({ length: 4 }, () => 0)),
			x: $.varRef(init?.x !== undefined ? $.cloneArrayValue(init.x) : new Uint8Array(64)),
			nx: $.varRef(init?.nx ?? (0 as number)),
			len: $.varRef(init?.len ?? (0n as bigint))
		}
	}

	public clone(): digest {
		const cloned = new digest()
		cloned._fields = {
			s: $.varRef($.cloneArrayValue(this._fields.s.value)),
			x: $.varRef($.cloneArrayValue(this._fields.x.value)),
			nx: $.varRef(this._fields.nx.value),
			len: $.varRef(this._fields.len.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const d: digest | $.VarRef<digest> | null = this
		b = $.appendSlice(b, $.stringToBytes("md5\x01"), $.byteSliceHint)
		b = byteorder.BEAppendUint32(b, $.uint($.arrayIndex($.pointerValue<digest>(d).s, 0), 32))
		b = byteorder.BEAppendUint32(b, $.uint($.arrayIndex($.pointerValue<digest>(d).s, 1), 32))
		b = byteorder.BEAppendUint32(b, $.uint($.arrayIndex($.pointerValue<digest>(d).s, 2), 32))
		b = byteorder.BEAppendUint32(b, $.uint($.arrayIndex($.pointerValue<digest>(d).s, 3), 32))
		b = $.appendSlice(b, $.goSlice($.pointerValue<digest>(d).x, undefined, $.pointerValue<digest>(d).nx), $.byteSliceHint)
		b = $.appendSlice(b, $.makeSlice<number>($.len($.pointerValue<digest>(d).x) - $.pointerValue<digest>(d).nx, undefined, "byte"), $.byteSliceHint)
		b = byteorder.BEAppendUint64(b, $.pointerValue<digest>(d).len)
		return [b, null]
	}

	public BlockSize(): number {
		const d: digest | $.VarRef<digest> | null = this
		return 64
	}

	public Clone(): [hash2.Cloner | null, $.GoError] {
		const d: digest | $.VarRef<digest> | null = this
		let r = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<digest>(d))))
		return [$.interfaceValue<hash2.Cloner | null>(r, "*md5.digest", { kind: $.TypeKind.Pointer, elemType: "md5.digest" }), null]
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const d: digest | $.VarRef<digest> | null = this
		return digest.prototype.AppendBinary.call(d, $.makeSlice<number>(0, 92, "byte"))
	}

	public Reset(): void {
		let d: digest | $.VarRef<digest> | null = this
		$.pointerValue<digest>(d).s[0] = $.uint(1732584193, 32)
		$.pointerValue<digest>(d).s[1] = $.uint(4023233417, 32)
		$.pointerValue<digest>(d).s[2] = $.uint(2562383102, 32)
		$.pointerValue<digest>(d).s[3] = $.uint(271733878, 32)
		$.pointerValue<digest>(d).nx = 0
		$.pointerValue<digest>(d).len = 0n
	}

	public Size(): number {
		const d: digest | $.VarRef<digest> | null = this
		return 16
	}

	public Sum(_in: $.Slice<number>): $.Slice<number> {
		const d: digest | $.VarRef<digest> | null = this
		// Make a copy of d so that caller can keep writing and summing.
		let d0 = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<digest>(d))))
		let __goscriptShadow0 = d0.value.checkSum()
		return $.appendSlice(_in, $.goSlice(__goscriptShadow0, undefined, undefined), $.byteSliceHint)
	}

	public UnmarshalBinary(b: $.Slice<number>): $.GoError {
		let d: digest | $.VarRef<digest> | null = this
		if (($.len(b) < 4) || (!$.stringEqual($.bytesToString($.goSlice(b, undefined, 4)), "md5\x01"))) {
			return errors.New("crypto/md5: invalid hash state identifier")
		}
		if ($.len(b) != 92) {
			return errors.New("crypto/md5: invalid hash state size")
		}
		b = $.goSlice(b, 4, undefined)
		let __goscriptTuple0: any = consumeUint32(b)
		b = __goscriptTuple0[0]
		$.pointerValue<digest>(d).s[0] = $.uint(__goscriptTuple0[1], 32)
		let __goscriptTuple1: any = consumeUint32(b)
		b = __goscriptTuple1[0]
		$.pointerValue<digest>(d).s[1] = $.uint(__goscriptTuple1[1], 32)
		let __goscriptTuple2: any = consumeUint32(b)
		b = __goscriptTuple2[0]
		$.pointerValue<digest>(d).s[2] = $.uint(__goscriptTuple2[1], 32)
		let __goscriptTuple3: any = consumeUint32(b)
		b = __goscriptTuple3[0]
		$.pointerValue<digest>(d).s[3] = $.uint(__goscriptTuple3[1], 32)
		b = $.goSlice(b, $.copy($.goSlice($.pointerValue<digest>(d).x, undefined, undefined), b), undefined)
		let __goscriptTuple4: any = consumeUint64(b)
		b = __goscriptTuple4[0]
		$.pointerValue<digest>(d).len = __goscriptTuple4[1]
		$.pointerValue<digest>(d).nx = $.int($.uint64Mod($.pointerValue<digest>(d).len, 64n))
		return null
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		let d: digest | $.VarRef<digest> | null = this
		let nn: number = 0
		let err: $.GoError = null as $.GoError
		if (fips140only.Enforced()) {
			return [0, errors.New("crypto/md5: use of MD5 is not allowed in FIPS 140-only mode")]
		}
		// Note that we currently call block or blockGeneric
		// directly (guarded using haveAsm) because this allows
		// escape analysis to see that p and d don't escape.
		nn = $.len(p)
		$.pointerValue<digest>(d).len = $.uint64Add($.pointerValue<digest>(d).len, $.uint64(nn))
		if ($.pointerValue<digest>(d).nx > 0) {
			let n = $.copy($.goSlice($.pointerValue<digest>(d).x, $.pointerValue<digest>(d).nx, undefined), p)
			$.pointerValue<digest>(d).nx = $.pointerValue<digest>(d).nx + (n)
			if ($.pointerValue<digest>(d).nx == 64) {
				if (false) {
					__goscript_md5block_generic.block(d, $.goSlice($.pointerValue<digest>(d).x, undefined, undefined))
				} else {
					__goscript_md5block.blockGeneric(d, $.goSlice($.pointerValue<digest>(d).x, undefined, undefined))
				}
				$.pointerValue<digest>(d).nx = 0
			}
			p = $.goSlice(p, n, undefined)
		}
		if ($.len(p) >= 64) {
			let n = $.len(p) & ~((64 - 1))
			if (false) {
				while (n > 65536) {
					__goscript_md5block_generic.block(d, $.goSlice(p, undefined, 65536))
					p = $.goSlice(p, 65536, undefined)
					n = n - (65536)
				}
				__goscript_md5block_generic.block(d, $.goSlice(p, undefined, n))
			} else {
				__goscript_md5block.blockGeneric(d, $.goSlice(p, undefined, n))
			}
			p = $.goSlice(p, n, undefined)
		}
		if ($.len(p) > 0) {
			$.pointerValue<digest>(d).nx = $.copy($.goSlice($.pointerValue<digest>(d).x, undefined, undefined), p)
		}
		return [nn, err]
	}

	public checkSum(): Uint8Array {
		const d: digest | $.VarRef<digest> | null = this
		if (fips140only.Enforced()) {
			$.panic("crypto/md5: use of MD5 is not allowed in FIPS 140-only mode")
		}

		// Append 0x80 to the end of the message and then append zeros
		// until the length is a multiple of 56 bytes. Finally append
		// 8 bytes representing the message length in bits.
		//
		// 1 byte end marker :: 0-63 padding bytes :: 8 byte length
		let tmp = new Uint8Array([$.uint(0x80, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
		let pad = $.uint64Mod(($.uint64Sub(55n, $.pointerValue<digest>(d).len)), 64n)
		byteorder.LEPutUint64($.goSlice(tmp, Number($.uint64Add(1n, pad)), undefined), $.uint64Shl($.pointerValue<digest>(d).len, 3n))
		digest.prototype.Write.call(d, $.goSlice(tmp, undefined, Number($.uint64Add(($.uint64Add(1n, pad)), 8n))))

		// The previous write ensures that a whole number of
		// blocks (i.e. a multiple of 64 bytes) have been hashed.
		if ($.pointerValue<digest>(d).nx != 0) {
			$.panic("d.nx != 0")
		}

		let __goscriptShadow1: Uint8Array = new Uint8Array(16)
		byteorder.LEPutUint32($.goSlice(__goscriptShadow1, 0, undefined), $.uint($.arrayIndex($.pointerValue<digest>(d).s, 0), 32))
		byteorder.LEPutUint32($.goSlice(__goscriptShadow1, 4, undefined), $.uint($.arrayIndex($.pointerValue<digest>(d).s, 1), 32))
		byteorder.LEPutUint32($.goSlice(__goscriptShadow1, 8, undefined), $.uint($.arrayIndex($.pointerValue<digest>(d).s, 2), 32))
		byteorder.LEPutUint32($.goSlice(__goscriptShadow1, 12, undefined), $.uint($.arrayIndex($.pointerValue<digest>(d).s, 3), 32))
		return __goscriptShadow1
	}

	static __typeInfo = $.registerStructType(
		"md5.digest",
		() => new digest(),
		[{ name: "AppendBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Clone", args: [], returns: [{ name: "_r0", type: "hash.Cloner" }, { name: "_r1", type: "error" }] }, { name: "MarshalBinary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Reset", args: [], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Sum", args: [{ name: "in", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "UnmarshalBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "nn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "checkSum", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 16 } }] }],
		digest,
		[{ name: "s", key: "s", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint32" }, length: 4 }, pkgPath: "crypto/md5", index: [0], offset: 0, exported: false }, { name: "x", key: "x", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 64 }, pkgPath: "crypto/md5", index: [1], offset: 16, exported: false }, { name: "nx", key: "nx", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/md5", index: [2], offset: 80, exported: false }, { name: "len", key: "len", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/md5", index: [3], offset: 88, exported: false }]
	)
}

export const Size: number = 16

export const BlockSize: number = 64

export const maxAsmIters: number = 1024

export const maxAsmSize: number = 65536

export const init0: number = 1732584193

export const init1: number = 4023233417

export const init2: number = 2562383102

export const init3: number = 271733878

export const magic: string = "md5\x01"

export const marshaledSize: number = 92

function __goscriptInit0(): void {
	crypto.RegisterHash(crypto.MD5, New)
}

export function consumeUint64(b: $.Slice<number>): [$.Slice<number>, bigint] {
	return [$.goSlice(b, 8, undefined), byteorder.BEUint64($.goSlice(b, 0, 8))]
}

export function consumeUint32(b: $.Slice<number>): [$.Slice<number>, number] {
	return [$.goSlice(b, 4, undefined), $.uint(byteorder.BEUint32($.goSlice(b, 0, 4)), 32)]
}

export function New(): hash2.Hash | null {
	let d: digest | $.VarRef<digest> | null = new digest()
	digest.prototype.Reset.call(d)
	return $.interfaceValue<hash2.Hash | null>(d, "*md5.digest", { kind: $.TypeKind.Pointer, elemType: "md5.digest" })
}

export function Sum(data: $.Slice<number>): Uint8Array {
	let d: $.VarRef<digest> = $.varRef($.markAsStructValue(new digest()))
	d.value.Reset()
	d.value.Write(data)
	return d.value.checkSum()
}

__goscriptInit0()

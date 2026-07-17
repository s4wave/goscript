// Generated file based on sha512.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as errors from "@goscript/errors/index.js"

import * as hash2 from "@goscript/hash/index.js"

import * as __goscript_sha512block_noasm from "./sha512block_noasm.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/errors/index.js"
import "@goscript/hash/index.js"
import "./sha512block_noasm.gs.ts"

export class Digest {
	public get h(): bigint[] {
		return this._fields.h.value
	}
	public set h(value: bigint[]) {
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

	public get size(): number {
		return this._fields.size.value
	}
	public set size(value: number) {
		this._fields.size.value = value
	}

	public _fields: {
		h: $.VarRef<bigint[]>
		x: $.VarRef<Uint8Array>
		nx: $.VarRef<number>
		len: $.VarRef<bigint>
		size: $.VarRef<number>
	}

	constructor(init?: Partial<{h?: bigint[], x?: Uint8Array, nx?: number, len?: bigint, size?: number}>) {
		this._fields = {
			h: $.varRef(init?.h !== undefined ? $.cloneArrayValue(init.h) : Array.from({ length: 8 }, () => 0n)),
			x: $.varRef(init?.x !== undefined ? $.cloneArrayValue(init.x) : new Uint8Array(128)),
			nx: $.varRef(init?.nx ?? (0 as number)),
			len: $.varRef(init?.len ?? (0n as bigint)),
			size: $.varRef(init?.size ?? (0 as number))
		}
	}

	public clone(): Digest {
		const cloned = new Digest()
		cloned._fields = {
			h: $.varRef($.cloneArrayValue(this._fields.h.value)),
			x: $.varRef($.cloneArrayValue(this._fields.x.value)),
			nx: $.varRef(this._fields.nx.value),
			len: $.varRef(this._fields.len.value),
			size: $.varRef(this._fields.size.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const d: Digest | $.VarRef<Digest> | null = this
		switch ($.pointerValue<Digest>(d).size) {
			case 48:
			{
				b = $.appendSlice(b, $.stringToBytes("sha\x04"), $.byteSliceHint)
				break
			}
			case 28:
			{
				b = $.appendSlice(b, $.stringToBytes("sha\x05"), $.byteSliceHint)
				break
			}
			case 32:
			{
				b = $.appendSlice(b, $.stringToBytes("sha\x06"), $.byteSliceHint)
				break
			}
			case 64:
			{
				b = $.appendSlice(b, $.stringToBytes("sha\a"), $.byteSliceHint)
				break
			}
			default:
			{
				$.panic("unknown size")
				break
			}
		}
		b = byteorder.BEAppendUint64(b, $.arrayIndex($.pointerValue<Digest>(d).h, 0))
		b = byteorder.BEAppendUint64(b, $.arrayIndex($.pointerValue<Digest>(d).h, 1))
		b = byteorder.BEAppendUint64(b, $.arrayIndex($.pointerValue<Digest>(d).h, 2))
		b = byteorder.BEAppendUint64(b, $.arrayIndex($.pointerValue<Digest>(d).h, 3))
		b = byteorder.BEAppendUint64(b, $.arrayIndex($.pointerValue<Digest>(d).h, 4))
		b = byteorder.BEAppendUint64(b, $.arrayIndex($.pointerValue<Digest>(d).h, 5))
		b = byteorder.BEAppendUint64(b, $.arrayIndex($.pointerValue<Digest>(d).h, 6))
		b = byteorder.BEAppendUint64(b, $.arrayIndex($.pointerValue<Digest>(d).h, 7))
		b = $.appendSlice(b, $.goSlice($.pointerValue<Digest>(d).x, undefined, $.pointerValue<Digest>(d).nx), $.byteSliceHint)
		b = $.appendSlice(b, $.makeSlice<number>($.len($.pointerValue<Digest>(d).x) - $.pointerValue<Digest>(d).nx, undefined, "byte"), $.byteSliceHint)
		b = byteorder.BEAppendUint64(b, $.pointerValue<Digest>(d).len)
		return [b, null]
	}

	public BlockSize(): number {
		const d: Digest | $.VarRef<Digest> | null = this
		return 128
	}

	public Clone(): [hash2.Cloner | null, $.GoError] {
		const d: Digest | $.VarRef<Digest> | null = this
		let r = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<Digest>(d))))
		return [$.interfaceValue<hash2.Cloner | null>(r, "*sha512.Digest", { kind: $.TypeKind.Pointer, elemType: "sha512.Digest" }), null]
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const d: Digest | $.VarRef<Digest> | null = this
		return Digest.prototype.AppendBinary.call(d, $.makeSlice<number>(0, 204, "byte"))
	}

	public Reset(): void {
		let d: Digest | $.VarRef<Digest> | null = this
		switch ($.pointerValue<Digest>(d).size) {
			case 48:
			{
				$.pointerValue<Digest>(d).h[0] = 14680500436340154072n
				$.pointerValue<Digest>(d).h[1] = 7105036623409894663n
				$.pointerValue<Digest>(d).h[2] = 10473403895298186519n
				$.pointerValue<Digest>(d).h[3] = 1526699215303891257n
				$.pointerValue<Digest>(d).h[4] = 7436329637833083697n
				$.pointerValue<Digest>(d).h[5] = 10282925794625328401n
				$.pointerValue<Digest>(d).h[6] = 15784041429090275239n
				$.pointerValue<Digest>(d).h[7] = 5167115440072839076n
				break
			}
			case 28:
			{
				$.pointerValue<Digest>(d).h[0] = 10105294471447203234n
				$.pointerValue<Digest>(d).h[1] = 8350123849800275158n
				$.pointerValue<Digest>(d).h[2] = 2160240930085379202n
				$.pointerValue<Digest>(d).h[3] = 7466358040605728719n
				$.pointerValue<Digest>(d).h[4] = 1111592415079452072n
				$.pointerValue<Digest>(d).h[5] = 8638871050018654530n
				$.pointerValue<Digest>(d).h[6] = 4583966954114332360n
				$.pointerValue<Digest>(d).h[7] = 1230299281376055969n
				break
			}
			case 32:
			{
				$.pointerValue<Digest>(d).h[0] = 2463787394917988140n
				$.pointerValue<Digest>(d).h[1] = 11481187982095705282n
				$.pointerValue<Digest>(d).h[2] = 2563595384472711505n
				$.pointerValue<Digest>(d).h[3] = 10824532655140301501n
				$.pointerValue<Digest>(d).h[4] = 10819967247969091555n
				$.pointerValue<Digest>(d).h[5] = 13717434660681038226n
				$.pointerValue<Digest>(d).h[6] = 3098927326965381290n
				$.pointerValue<Digest>(d).h[7] = 1060366662362279074n
				break
			}
			case 64:
			{
				$.pointerValue<Digest>(d).h[0] = 7640891576956012808n
				$.pointerValue<Digest>(d).h[1] = 13503953896175478587n
				$.pointerValue<Digest>(d).h[2] = 4354685564936845355n
				$.pointerValue<Digest>(d).h[3] = 11912009170470909681n
				$.pointerValue<Digest>(d).h[4] = 5840696475078001361n
				$.pointerValue<Digest>(d).h[5] = 11170449401992604703n
				$.pointerValue<Digest>(d).h[6] = 2270897969802886507n
				$.pointerValue<Digest>(d).h[7] = 6620516959819538809n
				break
			}
			default:
			{
				$.panic("unknown size")
				break
			}
		}
		$.pointerValue<Digest>(d).nx = 0
		$.pointerValue<Digest>(d).len = 0n
	}

	public Size(): number {
		const d: Digest | $.VarRef<Digest> | null = this
		return $.pointerValue<Digest>(d).size
	}

	public Sum(_in: $.Slice<number>): $.Slice<number> {
		const d: Digest | $.VarRef<Digest> | null = this
		fips140.RecordApproved()
		// Make a copy of d so that caller can keep writing and summing.
		let d0: Digest | $.VarRef<Digest> | null = new Digest()
		$.assignStruct($.pointerValue<Digest>(d0), $.markAsStructValue($.cloneStructValue($.pointerValue<Digest>(d))))
		let __goscriptShadow0 = Digest.prototype.checkSum.call(d0)
		return $.appendSlice(_in, $.goSlice(__goscriptShadow0, undefined, $.pointerValue<Digest>(d).size), $.byteSliceHint)
	}

	public UnmarshalBinary(b: $.Slice<number>): $.GoError {
		let d: Digest | $.VarRef<Digest> | null = this
		if ($.len(b) < 4) {
			return errors.New("crypto/sha512: invalid hash state identifier")
		}
		switch (true) {
			case ($.pointerValue<Digest>(d).size == 48) && ($.stringEqual($.bytesToString($.goSlice(b, undefined, 4)), "sha\x04")):
			{
				break
			}
			case ($.pointerValue<Digest>(d).size == 28) && ($.stringEqual($.bytesToString($.goSlice(b, undefined, 4)), "sha\x05")):
			{
				break
			}
			case ($.pointerValue<Digest>(d).size == 32) && ($.stringEqual($.bytesToString($.goSlice(b, undefined, 4)), "sha\x06")):
			{
				break
			}
			case ($.pointerValue<Digest>(d).size == 64) && ($.stringEqual($.bytesToString($.goSlice(b, undefined, 4)), "sha\a")):
			{
				break
			}
			default:
			{
				return errors.New("crypto/sha512: invalid hash state identifier")
				break
			}
		}
		if ($.len(b) != 204) {
			return errors.New("crypto/sha512: invalid hash state size")
		}
		b = $.goSlice(b, 4, undefined)
		let __goscriptTuple0: any = consumeUint64(b)
		b = __goscriptTuple0[0]
		$.pointerValue<Digest>(d).h[0] = __goscriptTuple0[1]
		let __goscriptTuple1: any = consumeUint64(b)
		b = __goscriptTuple1[0]
		$.pointerValue<Digest>(d).h[1] = __goscriptTuple1[1]
		let __goscriptTuple2: any = consumeUint64(b)
		b = __goscriptTuple2[0]
		$.pointerValue<Digest>(d).h[2] = __goscriptTuple2[1]
		let __goscriptTuple3: any = consumeUint64(b)
		b = __goscriptTuple3[0]
		$.pointerValue<Digest>(d).h[3] = __goscriptTuple3[1]
		let __goscriptTuple4: any = consumeUint64(b)
		b = __goscriptTuple4[0]
		$.pointerValue<Digest>(d).h[4] = __goscriptTuple4[1]
		let __goscriptTuple5: any = consumeUint64(b)
		b = __goscriptTuple5[0]
		$.pointerValue<Digest>(d).h[5] = __goscriptTuple5[1]
		let __goscriptTuple6: any = consumeUint64(b)
		b = __goscriptTuple6[0]
		$.pointerValue<Digest>(d).h[6] = __goscriptTuple6[1]
		let __goscriptTuple7: any = consumeUint64(b)
		b = __goscriptTuple7[0]
		$.pointerValue<Digest>(d).h[7] = __goscriptTuple7[1]
		b = $.goSlice(b, $.copy($.goSlice($.pointerValue<Digest>(d).x, undefined, undefined), b), undefined)
		let __goscriptTuple8: any = consumeUint64(b)
		b = __goscriptTuple8[0]
		$.pointerValue<Digest>(d).len = __goscriptTuple8[1]
		$.pointerValue<Digest>(d).nx = $.int($.uint64Mod($.pointerValue<Digest>(d).len, 128n))
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
			if ($.pointerValue<Digest>(d).nx == 128) {
				__goscript_sha512block_noasm.block(d, $.goSlice($.pointerValue<Digest>(d).x, undefined, undefined))
				$.pointerValue<Digest>(d).nx = 0
			}
			p = $.goSlice(p, n, undefined)
		}
		if ($.len(p) >= 128) {
			let n = $.len(p) & ~((128 - 1))
			__goscript_sha512block_noasm.block(d, $.goSlice(p, undefined, n))
			p = $.goSlice(p, n, undefined)
		}
		if ($.len(p) > 0) {
			$.pointerValue<Digest>(d).nx = $.copy($.goSlice($.pointerValue<Digest>(d).x, undefined, undefined), p)
		}
		return [nn, err]
	}

	public checkSum(): Uint8Array {
		const d: Digest | $.VarRef<Digest> | null = this
		// Padding. Add a 1 bit and 0 bits until 112 bytes mod 128.
		let len = $.pointerValue<Digest>(d).len
		let tmp: Uint8Array = new Uint8Array(144)
		tmp[0] = $.uint(0x80, 8)
		let t: bigint = 0n
		if (($.uint64Mod(len, 128n)) < 112n) {
			t = $.uint64Sub(112n, ($.uint64Mod(len, 128n)))
		} else {
			t = $.uint64Sub(240n, ($.uint64Mod(len, 128n)))
		}

		// Length in bits.
		len = $.uint64Shl(len, 3n)
		let padlen: $.Slice<number> = $.goSlice(tmp, undefined, Number($.uint64Add(t, 16n)))
		// Upper 64 bits are always zero, because len variable has type uint64,
		// and tmp is already zeroed at that index, so we can skip updating it.
		// byteorder.BEPutUint64(padlen[t+0:], 0)
		byteorder.BEPutUint64($.goSlice(padlen, Number($.uint64Add(t, 8n)), undefined), len)
		Digest.prototype.Write.call(d, padlen)

		if ($.pointerValue<Digest>(d).nx != 0) {
			$.panic("d.nx != 0")
		}

		let digest: Uint8Array = new Uint8Array(64)
		byteorder.BEPutUint64($.goSlice(digest, 0, undefined), $.arrayIndex($.pointerValue<Digest>(d).h, 0))
		byteorder.BEPutUint64($.goSlice(digest, 8, undefined), $.arrayIndex($.pointerValue<Digest>(d).h, 1))
		byteorder.BEPutUint64($.goSlice(digest, 16, undefined), $.arrayIndex($.pointerValue<Digest>(d).h, 2))
		byteorder.BEPutUint64($.goSlice(digest, 24, undefined), $.arrayIndex($.pointerValue<Digest>(d).h, 3))
		byteorder.BEPutUint64($.goSlice(digest, 32, undefined), $.arrayIndex($.pointerValue<Digest>(d).h, 4))
		byteorder.BEPutUint64($.goSlice(digest, 40, undefined), $.arrayIndex($.pointerValue<Digest>(d).h, 5))
		if ($.pointerValue<Digest>(d).size != 48) {
			byteorder.BEPutUint64($.goSlice(digest, 48, undefined), $.arrayIndex($.pointerValue<Digest>(d).h, 6))
			byteorder.BEPutUint64($.goSlice(digest, 56, undefined), $.arrayIndex($.pointerValue<Digest>(d).h, 7))
		}

		return digest
	}

	static __typeInfo = $.registerStructType(
		"sha512.Digest",
		() => new Digest(),
		[{ name: "AppendBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Clone", args: [], returns: [{ name: "_r0", type: "hash.Cloner" }, { name: "_r1", type: "error" }] }, { name: "MarshalBinary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Reset", args: [], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Sum", args: [{ name: "in", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "UnmarshalBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "nn", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "checkSum", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 64 } }] }],
		Digest,
		[{ name: "h", key: "h", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint64" }, length: 8 }, pkgPath: "crypto/internal/fips140/sha512", index: [0], offset: 0, exported: false }, { name: "x", key: "x", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 128 }, pkgPath: "crypto/internal/fips140/sha512", index: [1], offset: 64, exported: false }, { name: "nx", key: "nx", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/fips140/sha512", index: [2], offset: 192, exported: false }, { name: "len", key: "len", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "crypto/internal/fips140/sha512", index: [3], offset: 200, exported: false }, { name: "size", key: "size", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/fips140/sha512", index: [4], offset: 208, exported: false }]
	)
}

export const size512: number = 64

export const size224: number = 28

export const size256: number = 32

export const size384: number = 48

export const blockSize: number = 128

export const chunk: number = 128

export const init0: number = 7640891576956012808

export const init1: number = 13503953896175478587

export const init2: number = 4354685564936845355

export const init3: number = 11912009170470909681

export const init4: number = 5840696475078001361

export const init5: number = 11170449401992604703

export const init6: number = 2270897969802886507

export const init7: number = 6620516959819538809

export const init0_224: number = 10105294471447203234

export const init1_224: number = 8350123849800275158

export const init2_224: number = 2160240930085379202

export const init3_224: number = 7466358040605728719

export const init4_224: number = 1111592415079452072

export const init5_224: number = 8638871050018654530

export const init6_224: number = 4583966954114332360

export const init7_224: number = 1230299281376055969

export const init0_256: number = 2463787394917988140

export const init1_256: number = 11481187982095705282

export const init2_256: number = 2563595384472711505

export const init3_256: number = 10824532655140301501

export const init4_256: number = 10819967247969091555

export const init5_256: number = 13717434660681038226

export const init6_256: number = 3098927326965381290

export const init7_256: number = 1060366662362279074

export const init0_384: number = 14680500436340154072

export const init1_384: number = 7105036623409894663

export const init2_384: number = 10473403895298186519

export const init3_384: number = 1526699215303891257

export const init4_384: number = 7436329637833083697

export const init5_384: number = 10282925794625328401

export const init6_384: number = 15784041429090275239

export const init7_384: number = 5167115440072839076

export const magic384: string = "sha\x04"

export const magic512_224: string = "sha\x05"

export const magic512_256: string = "sha\x06"

export const magic512: string = "sha\a"

export const marshaledSize: number = 204

export function consumeUint64(b: $.Slice<number>): [$.Slice<number>, bigint] {
	return [$.goSlice(b, 8, undefined), byteorder.BEUint64(b)]
}

export function New(): Digest | $.VarRef<Digest> | null {
	let d: Digest | $.VarRef<Digest> | null = new Digest({size: 64})
	Digest.prototype.Reset.call(d)
	return d
}

export function New512_224(): Digest | $.VarRef<Digest> | null {
	let d: Digest | $.VarRef<Digest> | null = new Digest({size: 28})
	Digest.prototype.Reset.call(d)
	return d
}

export function New512_256(): Digest | $.VarRef<Digest> | null {
	let d: Digest | $.VarRef<Digest> | null = new Digest({size: 32})
	Digest.prototype.Reset.call(d)
	return d
}

export function New384(): Digest | $.VarRef<Digest> | null {
	let d: Digest | $.VarRef<Digest> | null = new Digest({size: 48})
	Digest.prototype.Reset.call(d)
	return d
}

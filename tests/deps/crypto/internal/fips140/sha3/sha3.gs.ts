// Generated file based on sha3.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as subtle from "@goscript/crypto/internal/fips140/subtle/index.js"

import * as errors from "@goscript/errors/index.js"

import * as __goscript_hashes from "./hashes.gs.ts"

import * as __goscript_sha3_noasm from "./sha3_noasm.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/subtle/index.js"
import "@goscript/errors/index.js"
import "./hashes.gs.ts"
import "./sha3_noasm.gs.ts"

export type spongeDirection = number

export class Digest {
	public get a(): Uint8Array {
		return this._fields.a.value
	}
	public set a(value: Uint8Array) {
		this._fields.a.value = value
	}

	// a[n:rate] is the buffer. If absorbing, it's the remaining space to XOR
	// into before running the permutation. If squeezing, it's the remaining
	// output to produce before running the permutation.
	public get n(): number {
		return this._fields.n.value
	}
	public set n(value: number) {
		this._fields.n.value = value
	}

	// a[n:rate] is the buffer. If absorbing, it's the remaining space to XOR
	// into before running the permutation. If squeezing, it's the remaining
	// output to produce before running the permutation.
	public get rate(): number {
		return this._fields.rate.value
	}
	public set rate(value: number) {
		this._fields.rate.value = value
	}

	// dsbyte contains the "domain separation" bits and the first bit of
	// the padding. Sections 6.1 and 6.2 of [1] separate the outputs of the
	// SHA-3 and SHAKE functions by appending bitstrings to the message.
	// Using a little-endian bit-ordering convention, these are "01" for SHA-3
	// and "1111" for SHAKE, or 00000010b and 00001111b, respectively. Then the
	// padding rule from section 5.1 is applied to pad the message to a multiple
	// of the rate, which involves adding a "1" bit, zero or more "0" bits, and
	// a final "1" bit. We merge the first "1" bit from the padding into dsbyte,
	// giving 00000110b (0x06) and 00011111b (0x1f).
	// [1] http://csrc.nist.gov/publications/drafts/fips-202/fips_202_draft.pdf
	//     "Draft FIPS 202: SHA-3 Standard: Permutation-Based Hash and
	//      Extendable-Output Functions (May 2014)"
	public get dsbyte(): number {
		return this._fields.dsbyte.value
	}
	public set dsbyte(value: number) {
		this._fields.dsbyte.value = value
	}

	public get outputLen(): number {
		return this._fields.outputLen.value
	}
	public set outputLen(value: number) {
		this._fields.outputLen.value = value
	}

	public get state(): spongeDirection {
		return this._fields.state.value
	}
	public set state(value: spongeDirection) {
		this._fields.state.value = value
	}

	public _fields: {
		a: $.VarRef<Uint8Array>
		n: $.VarRef<number>
		rate: $.VarRef<number>
		dsbyte: $.VarRef<number>
		outputLen: $.VarRef<number>
		state: $.VarRef<spongeDirection>
	}

	constructor(init?: Partial<{a?: Uint8Array, n?: number, rate?: number, dsbyte?: number, outputLen?: number, state?: spongeDirection}>) {
		this._fields = {
			a: $.varRef(init?.a !== undefined ? $.cloneArrayValue(init.a) : new Uint8Array(200)),
			n: $.varRef(init?.n ?? (0 as number)),
			rate: $.varRef(init?.rate ?? (0 as number)),
			dsbyte: $.varRef(init?.dsbyte ?? (0 as number)),
			outputLen: $.varRef(init?.outputLen ?? (0 as number)),
			state: $.varRef(init?.state ?? (0 as spongeDirection))
		}
	}

	public clone(): Digest {
		const cloned = new Digest()
		cloned._fields = {
			a: $.varRef($.cloneArrayValue(this._fields.a.value)),
			n: $.varRef(this._fields.n.value),
			rate: $.varRef(this._fields.rate.value),
			dsbyte: $.varRef(this._fields.dsbyte.value),
			outputLen: $.varRef(this._fields.outputLen.value),
			state: $.varRef(this._fields.state.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const d: Digest | $.VarRef<Digest> | null = this
		switch ($.pointerValue<Digest>(d).dsbyte) {
			case 6:
			{
				b = $.appendSlice(b, $.stringToBytes("sha\b"), $.byteSliceHint)
				break
			}
			case 31:
			{
				b = $.appendSlice(b, $.stringToBytes("sha\t"), $.byteSliceHint)
				break
			}
			case 4:
			{
				b = $.appendSlice(b, $.stringToBytes("sha\n"), $.byteSliceHint)
				break
			}
			case 1:
			{
				b = $.appendSlice(b, $.stringToBytes("sha\v"), $.byteSliceHint)
				break
			}
			default:
			{
				$.panic("unknown dsbyte")
				break
			}
		}
		// rate is at most 168, and n is at most rate.
		b = $.append(b, $.uint($.uint($.pointerValue<Digest>(d).rate, 8), 8), $.byteSliceHint)
		b = $.appendSlice(b, $.goSlice($.pointerValue<Digest>(d).a, undefined, undefined), $.byteSliceHint)
		b = $.append(b, $.uint($.uint($.pointerValue<Digest>(d).n, 8), 8), $.uint($.uint($.pointerValue<Digest>(d).state, 8), 8), $.byteSliceHint)
		return [b, null]
	}

	public BlockSize(): number {
		const d: Digest | $.VarRef<Digest> | null = this
		return $.pointerValue<Digest>(d).rate
	}

	public Clone(): Digest | $.VarRef<Digest> | null {
		const d: Digest | $.VarRef<Digest> | null = this
		let ret = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<Digest>(d))))
		return ret
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const d: Digest | $.VarRef<Digest> | null = this
		return Digest.prototype.AppendBinary.call(d, $.makeSlice<number>(0, 207, "byte"))
	}

	public Reset(): void {
		let d: Digest | $.VarRef<Digest> | null = this
		// Zero the permutation's state.
		$.clear($.goSlice($.pointerValue<Digest>(d).a, undefined, undefined))
		$.pointerValue<Digest>(d).state = 0
		$.pointerValue<Digest>(d).n = 0
	}

	public Size(): number {
		const d: Digest | $.VarRef<Digest> | null = this
		return $.pointerValue<Digest>(d).outputLen
	}

	public Sum(b: $.Slice<number>): $.Slice<number> {
		const d: Digest | $.VarRef<Digest> | null = this
		fips140.RecordApproved()
		return Digest.prototype.sum.call(d, b)
	}

	public UnmarshalBinary(b: $.Slice<number>): $.GoError {
		let d: Digest | $.VarRef<Digest> | null = this
		if ($.len(b) != 207) {
			return errors.New("sha3: invalid hash state")
		}

		let magic = $.bytesToString($.goSlice(b, undefined, 4))
		b = $.goSlice(b, 4, undefined)
		switch (true) {
			case ($.stringEqual(magic, "sha\b")) && ($.uint($.pointerValue<Digest>(d).dsbyte, 8) == $.uint(6, 8)):
			{
				break
			}
			case ($.stringEqual(magic, "sha\t")) && ($.uint($.pointerValue<Digest>(d).dsbyte, 8) == $.uint(31, 8)):
			{
				break
			}
			case ($.stringEqual(magic, "sha\n")) && ($.uint($.pointerValue<Digest>(d).dsbyte, 8) == $.uint(4, 8)):
			{
				break
			}
			case ($.stringEqual(magic, "sha\v")) && ($.uint($.pointerValue<Digest>(d).dsbyte, 8) == $.uint(1, 8)):
			{
				break
			}
			default:
			{
				return errors.New("sha3: invalid hash state identifier")
				break
			}
		}

		let rate = $.int($.arrayIndex(b!, 0))
		b = $.goSlice(b, 1, undefined)
		if (rate != $.pointerValue<Digest>(d).rate) {
			return errors.New("sha3: invalid hash state function")
		}

		$.copy($.goSlice($.pointerValue<Digest>(d).a, undefined, undefined), b)
		b = $.goSlice(b, $.len($.pointerValue<Digest>(d).a), undefined)

		let n = $.int($.arrayIndex(b!, 0))
		let state = $.int($.arrayIndex(b!, 1))
		if (n > $.pointerValue<Digest>(d).rate) {
			return errors.New("sha3: invalid hash state")
		}
		$.pointerValue<Digest>(d).n = n
		if ((state != 0) && (state != 1)) {
			return errors.New("sha3: invalid hash state")
		}
		$.pointerValue<Digest>(d).state = state

		return null
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		const d: Digest | $.VarRef<Digest> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		return Digest.prototype.write.call(d, p)
	}

	public padAndPermute(): void {
		let d: Digest | $.VarRef<Digest> | null = this
		// Pad with this instance's domain-separator bits. We know that there's
		// at least one byte of space in the sponge because, if it were full,
		// permute would have been called to empty it. dsbyte also contains the
		// first one bit for the padding. See the comment in the state struct.
		$.pointerValue<Digest>(d).a[$.pointerValue<Digest>(d).n] = $.pointerValue<Digest>(d).a[$.pointerValue<Digest>(d).n] ^ ($.uint($.pointerValue<Digest>(d).dsbyte, 8))
		// This adds the final one bit for the padding. Because of the way that
		// bits are numbered from the LSB upwards, the final bit is the MSB of
		// the last byte.
		$.pointerValue<Digest>(d).a[$.pointerValue<Digest>(d).rate - 1] = $.pointerValue<Digest>(d).a[$.pointerValue<Digest>(d).rate - 1] ^ ($.uint(0x80, 8))
		// Apply the permutation
		Digest.prototype.permute.call(d)
		$.pointerValue<Digest>(d).state = 1
	}

	public permute(): void {
		let d: Digest | $.VarRef<Digest> | null = this
		__goscript_sha3_noasm.keccakF1600($.pointerValue<Digest>(d)._fields.a)
		$.pointerValue<Digest>(d).n = 0
	}

	public read(out: $.Slice<number>): [number, $.GoError] {
		const d: Digest | $.VarRef<Digest> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		return Digest.prototype.readGeneric.call(d, out)
	}

	public readGeneric(out: $.Slice<number>): [number, $.GoError] {
		let d: Digest | $.VarRef<Digest> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		// If we're still absorbing, pad and apply the permutation.
		if ($.pointerValue<Digest>(d).state == 0) {
			Digest.prototype.padAndPermute.call(d)
		}

		n = $.len(out)

		// Now, do the squeezing.
		while ($.len(out) > 0) {
			// Apply the permutation if we've squeezed the sponge dry.
			if ($.pointerValue<Digest>(d).n == $.pointerValue<Digest>(d).rate) {
				Digest.prototype.permute.call(d)
			}

			let x = $.copy(out, $.goSlice($.pointerValue<Digest>(d).a, $.pointerValue<Digest>(d).n, $.pointerValue<Digest>(d).rate))
			$.pointerValue<Digest>(d).n = $.pointerValue<Digest>(d).n + (x)
			out = $.goSlice(out, x, undefined)
		}

		return [n, err]
	}

	public sum(b: $.Slice<number>): $.Slice<number> {
		const d: Digest | $.VarRef<Digest> | null = this
		return Digest.prototype.sumGeneric.call(d, b)
	}

	public sumGeneric(b: $.Slice<number>): $.Slice<number> {
		const d: Digest | $.VarRef<Digest> | null = this
		if ($.pointerValue<Digest>(d).state != 0) {
			$.panic("sha3: Sum after Read")
		}

		// Make a copy of the original hash so that caller can keep writing
		// and summing.
		let dup: Digest | $.VarRef<Digest> | null = Digest.prototype.Clone.call(d)
		let hash: $.Slice<number> = $.makeSlice<number>($.pointerValue<Digest>(dup).outputLen, 64, "byte")
		Digest.prototype.read.call(dup, hash)
		return $.appendSlice(b, hash, $.byteSliceHint)
	}

	public write(p: $.Slice<number>): [number, $.GoError] {
		const d: Digest | $.VarRef<Digest> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		return Digest.prototype.writeGeneric.call(d, p)
	}

	public writeGeneric(p: $.Slice<number>): [number, $.GoError] {
		let d: Digest | $.VarRef<Digest> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<Digest>(d).state != 0) {
			$.panic("sha3: Write after Read")
		}

		n = $.len(p)

		while ($.len(p) > 0) {
			let x = subtle.XORBytes($.goSlice($.pointerValue<Digest>(d).a, $.pointerValue<Digest>(d).n, $.pointerValue<Digest>(d).rate), $.goSlice($.pointerValue<Digest>(d).a, $.pointerValue<Digest>(d).n, $.pointerValue<Digest>(d).rate), p)
			$.pointerValue<Digest>(d).n = $.pointerValue<Digest>(d).n + (x)
			p = $.goSlice(p, x, undefined)

			// If the sponge is full, apply the permutation.
			if ($.pointerValue<Digest>(d).n == $.pointerValue<Digest>(d).rate) {
				Digest.prototype.permute.call(d)
			}
		}

		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"sha3.Digest",
		() => new Digest(),
		[{ name: "AppendBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Clone", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "sha3.Digest" } }] }, { name: "MarshalBinary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Reset", args: [], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Sum", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "UnmarshalBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "padAndPermute", args: [], returns: [] }, { name: "permute", args: [], returns: [] }, { name: "read", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "readGeneric", args: [{ name: "out", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "sum", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "sumGeneric", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "writeGeneric", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		Digest,
		[{ name: "a", key: "a", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 200 }, pkgPath: "crypto/internal/fips140/sha3", index: [0], offset: 0, exported: false }, { name: "n", key: "n", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/fips140/sha3", index: [1], offset: 200, exported: false }, { name: "rate", key: "rate", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/fips140/sha3", index: [2], offset: 208, exported: false }, { name: "dsbyte", key: "dsbyte", type: { kind: $.TypeKind.Basic, name: "uint8" }, pkgPath: "crypto/internal/fips140/sha3", index: [3], offset: 216, exported: false }, { name: "outputLen", key: "outputLen", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "crypto/internal/fips140/sha3", index: [4], offset: 224, exported: false }, { name: "state", key: "state", type: { kind: $.TypeKind.Basic, name: "int", typeName: "sha3.spongeDirection" }, pkgPath: "crypto/internal/fips140/sha3", index: [5], offset: 232, exported: false }]
	)
}

export const spongeAbsorbing: spongeDirection = 0

export const spongeSqueezing: spongeDirection = 1

export const magicSHA3: string = "sha\b"

export const magicShake: string = "sha\t"

export const magicCShake: string = "sha\n"

export const magicKeccak: string = "sha\v"

export const marshaledSize: number = 207

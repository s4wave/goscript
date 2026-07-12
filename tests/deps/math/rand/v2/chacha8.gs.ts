// Generated file based on chacha8.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as chacha8rand from "@goscript/internal/chacha8rand/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/byteorder/index.js"
import "@goscript/internal/chacha8rand/index.js"

export class ChaCha8 {
	public get state(): chacha8rand.State {
		return this._fields.state.value
	}
	public set state(value: chacha8rand.State) {
		this._fields.state.value = value
	}

	// The last readLen bytes of readBuf are still to be consumed by Read.
	public get readBuf(): Uint8Array {
		return this._fields.readBuf.value
	}
	public set readBuf(value: Uint8Array) {
		this._fields.readBuf.value = value
	}

	public get readLen(): number {
		return this._fields.readLen.value
	}
	public set readLen(value: number) {
		this._fields.readLen.value = value
	}

	public _fields: {
		state: $.VarRef<chacha8rand.State>
		readBuf: $.VarRef<Uint8Array>
		readLen: $.VarRef<number>
	}

	constructor(init?: Partial<{state?: chacha8rand.State, readBuf?: Uint8Array, readLen?: number}>) {
		this._fields = {
			state: $.varRef(init?.state ? $.markAsStructValue($.cloneStructValue(init.state)) : $.markAsStructValue(new chacha8rand.State())),
			readBuf: $.varRef(init?.readBuf !== undefined ? $.cloneArrayValue(init.readBuf) : new Uint8Array(8)),
			readLen: $.varRef(init?.readLen ?? (0 as number))
		}
	}

	public clone(): ChaCha8 {
		const cloned = new ChaCha8()
		cloned._fields = {
			state: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.state.value))),
			readBuf: $.varRef($.cloneArrayValue(this._fields.readBuf.value)),
			readLen: $.varRef(this._fields.readLen.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const c: ChaCha8 | $.VarRef<ChaCha8> | null = this
		if ($.pointerValue<ChaCha8>(c).readLen > 0) {
			b = $.appendSlice(b, $.stringToBytes("readbuf:"), $.byteSliceHint)
			b = $.append(b, $.uint($.uint($.pointerValue<ChaCha8>(c).readLen, 8), 8), $.byteSliceHint)
			b = $.appendSlice(b, $.goSlice($.pointerValue<ChaCha8>(c).readBuf, $.len($.pointerValue<ChaCha8>(c).readBuf) - $.pointerValue<ChaCha8>(c).readLen, undefined), $.byteSliceHint)
		}
		return [$.appendSlice(b, chacha8rand.Marshal($.pointerValue<ChaCha8>(c)._fields.state), $.byteSliceHint), null]
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const c: ChaCha8 | $.VarRef<ChaCha8> | null = this
		// the maximum length of (chacha8rand.Marshal + c.readBuf + "readbuf:") is 64
		return ChaCha8.prototype.AppendBinary.call(c, $.makeSlice<number>(0, 64, "byte"))
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		let c: ChaCha8 | $.VarRef<ChaCha8> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		if ($.pointerValue<ChaCha8>(c).readLen > 0) {
			n = $.copy(p, $.goSlice($.pointerValue<ChaCha8>(c).readBuf, $.len($.pointerValue<ChaCha8>(c).readBuf) - $.pointerValue<ChaCha8>(c).readLen, undefined))
			$.pointerValue<ChaCha8>(c).readLen = $.pointerValue<ChaCha8>(c).readLen - (n)
			p = $.goSlice(p, n, undefined)
		}
		while ($.len(p) >= 8) {
			byteorder.LEPutUint64(p, ChaCha8.prototype.Uint64.call(c))
			p = $.goSlice(p, 8, undefined)
			n = n + (8)
		}
		if ($.len(p) > 0) {
			byteorder.LEPutUint64($.goSlice($.pointerValue<ChaCha8>(c).readBuf, undefined, undefined), ChaCha8.prototype.Uint64.call(c))
			n = n + ($.copy(p, $.goSlice($.pointerValue<ChaCha8>(c).readBuf, undefined, undefined)))
			$.pointerValue<ChaCha8>(c).readLen = 8 - $.len(p)
		}
		return [n, err]
	}

	public Seed(seed: Uint8Array): void {
		let c: ChaCha8 | $.VarRef<ChaCha8> | null = this
		$.pointerValue<ChaCha8>(c).state.Init(seed)
		$.pointerValue<ChaCha8>(c).readLen = 0
		$.pointerValue<ChaCha8>(c).readBuf = new Uint8Array(8)
	}

	public Uint64(): bigint {
		const c: ChaCha8 | $.VarRef<ChaCha8> | null = this
		while (true) {
			let [x, ok] = $.pointerValue<ChaCha8>(c).state.Next()
			if (ok) {
				return x
			}
			$.pointerValue<ChaCha8>(c).state.Refill()
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public UnmarshalBinary(data: $.Slice<number>): $.GoError {
		let c: ChaCha8 | $.VarRef<ChaCha8> | null = this
		let __goscriptTuple0: any = cutPrefix(data, new Uint8Array([114, 101, 97, 100, 98, 117, 102, 58]))
		data = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (ok) {
			let buf: $.Slice<number> = null as $.Slice<number>
			let __goscriptTuple1: any = readUint8LengthPrefixed(data)
			buf = __goscriptTuple1[0]
			data = __goscriptTuple1[1]
			ok = __goscriptTuple1[2]
			if (!ok) {
				return errors.New("invalid ChaCha8 Read buffer encoding")
			}
			$.pointerValue<ChaCha8>(c).readLen = $.copy($.goSlice($.pointerValue<ChaCha8>(c).readBuf, $.len($.pointerValue<ChaCha8>(c).readBuf) - $.len(buf), undefined), buf)
		}
		return chacha8rand.Unmarshal($.pointerValue<ChaCha8>(c)._fields.state, data)
	}

	static __typeInfo = $.registerStructType(
		"rand.ChaCha8",
		() => new ChaCha8(),
		[{ name: "AppendBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "MarshalBinary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "Seed", args: [{ name: "seed", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 } }], returns: [] }, { name: "Uint64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }, { name: "UnmarshalBinary", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }],
		ChaCha8,
		[{ name: "state", key: "state", type: "chacha8rand.State", pkgPath: "math/rand/v2", index: [0], offset: 0, exported: false }, { name: "readBuf", key: "readBuf", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 8 }, pkgPath: "math/rand/v2", index: [1], offset: 304, exported: false }, { name: "readLen", key: "readLen", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "math/rand/v2", index: [2], offset: 312, exported: false }]
	)
}

export function NewChaCha8(seed: Uint8Array): ChaCha8 | $.VarRef<ChaCha8> | null {
	let c: ChaCha8 | $.VarRef<ChaCha8> | null = new ChaCha8()
	$.pointerValue<ChaCha8>(c).state.Init(seed)
	return c
}

export function cutPrefix(s: $.Slice<number>, prefix: $.Slice<number>): [$.Slice<number>, boolean] {
	let after: $.Slice<number> = null as $.Slice<number>
	let found: boolean = false
	if (($.len(s) < $.len(prefix)) || (!$.stringEqual($.bytesToString($.goSlice(s, undefined, $.len(prefix))), $.bytesToString(prefix)))) {
		return [s, false]
	}
	return [$.goSlice(s, $.len(prefix), undefined), true]
}

export function readUint8LengthPrefixed(b: $.Slice<number>): [$.Slice<number>, $.Slice<number>, boolean] {
	let buf: $.Slice<number> = null as $.Slice<number>
	let rest: $.Slice<number> = null as $.Slice<number>
	let ok: boolean = false
	if (($.len(b) == 0) || ($.len(b) < $.int(1 + $.arrayIndex(b!, 0)))) {
		return [null, null, false]
	}
	return [$.goSlice(b, 1, 1 + $.arrayIndex(b!, 0)), $.goSlice(b, 1 + $.arrayIndex(b!, 0), undefined), true]
}

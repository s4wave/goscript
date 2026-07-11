// Generated file based on chacha8.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as cpu from "@goscript/internal/cpu/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/internal/byteorder/index.js"
import "@goscript/internal/cpu/index.js"
import "@goscript/unsafe/index.js"

export class State {
	public get buf(): bigint[] {
		return this._fields.buf.value
	}
	public set buf(value: bigint[]) {
		this._fields.buf.value = value
	}

	public get seed(): bigint[] {
		return this._fields.seed.value
	}
	public set seed(value: bigint[]) {
		this._fields.seed.value = value
	}

	public get i(): number {
		return this._fields.i.value
	}
	public set i(value: number) {
		this._fields.i.value = value
	}

	public get n(): number {
		return this._fields.n.value
	}
	public set n(value: number) {
		this._fields.n.value = value
	}

	public get c(): number {
		return this._fields.c.value
	}
	public set c(value: number) {
		this._fields.c.value = value
	}

	public _fields: {
		buf: $.VarRef<bigint[]>
		seed: $.VarRef<bigint[]>
		i: $.VarRef<number>
		n: $.VarRef<number>
		c: $.VarRef<number>
	}

	constructor(init?: Partial<{buf?: bigint[], seed?: bigint[], i?: number, n?: number, c?: number}>) {
		this._fields = {
			buf: $.varRef(init?.buf !== undefined ? $.cloneArrayValue(init.buf) : Array.from({ length: 32 }, () => 0n)),
			seed: $.varRef(init?.seed !== undefined ? $.cloneArrayValue(init.seed) : Array.from({ length: 4 }, () => 0n)),
			i: $.varRef(init?.i ?? (0 as number)),
			n: $.varRef(init?.n ?? (0 as number)),
			c: $.varRef(init?.c ?? (0 as number))
		}
	}

	public clone(): State {
		const cloned = new State()
		cloned._fields = {
			buf: $.varRef($.cloneArrayValue(this._fields.buf.value)),
			seed: $.varRef($.cloneArrayValue(this._fields.seed.value)),
			i: $.varRef(this._fields.i.value),
			n: $.varRef(this._fields.n.value),
			c: $.varRef(this._fields.c.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Init(seed: Uint8Array): void {
		const s: State | $.VarRef<State> | null = this
		State.prototype.Init64.call(s, [byteorder.LEUint64($.goSlice(seed, 0 * 8, undefined)), byteorder.LEUint64($.goSlice(seed, 1 * 8, undefined)), byteorder.LEUint64($.goSlice(seed, 2 * 8, undefined)), byteorder.LEUint64($.goSlice(seed, 3 * 8, undefined))])
	}

	public Init64(seed: bigint[]): void {
		let s: State | $.VarRef<State> | null = this
		$.pointerValue<State>(s).seed = seed
		block($.pointerValue<State>(s)._fields.seed, $.pointerValue<State>(s)._fields.buf, $.uint(0, 32))
		$.pointerValue<State>(s).c = $.uint(0, 32)
		$.pointerValue<State>(s).i = $.uint(0, 32)
		$.pointerValue<State>(s).n = $.uint(32, 32)
	}

	public Next(): [bigint, boolean] {
		let s: State | $.VarRef<State> | null = this
		let i = $.uint($.pointerValue<State>(s).i, 32)
		if ($.uint(i, 32) >= $.uint($.pointerValue<State>(s).n, 32)) {
			return [0n, false]
		}
		$.pointerValue<State>(s).i = $.uint(i + 1, 32)
		return [$.arrayIndex($.pointerValue<State>(s).buf, i & 31), true]
	}

	public Refill(): void {
		let s: State | $.VarRef<State> | null = this
		$.pointerValue<State>(s).c = $.pointerValue<State>(s).c + ($.uint(4, 32))
		if ($.uint($.pointerValue<State>(s).c, 32) == $.uint(16, 32)) {
			// Reseed with generated uint64s for forward secrecy.
			// Normally this is done immediately after computing a block,
			// but we do it immediately before computing the next block,
			// to allow a much smaller serialized state (just the seed plus offset).
			// This gives a delayed benefit for the forward secrecy
			// (you can reconstruct the recent past given a memory dump),
			// which we deem acceptable in exchange for the reduced size.
			$.pointerValue<State>(s).seed[0] = $.arrayIndex($.pointerValue<State>(s).buf, ($.len($.pointerValue<State>(s).buf) - 4) + 0)
			$.pointerValue<State>(s).seed[1] = $.arrayIndex($.pointerValue<State>(s).buf, ($.len($.pointerValue<State>(s).buf) - 4) + 1)
			$.pointerValue<State>(s).seed[2] = $.arrayIndex($.pointerValue<State>(s).buf, ($.len($.pointerValue<State>(s).buf) - 4) + 2)
			$.pointerValue<State>(s).seed[3] = $.arrayIndex($.pointerValue<State>(s).buf, ($.len($.pointerValue<State>(s).buf) - 4) + 3)
			$.pointerValue<State>(s).c = $.uint(0, 32)
		}
		block($.pointerValue<State>(s)._fields.seed, $.pointerValue<State>(s)._fields.buf, $.uint($.pointerValue<State>(s).c, 32))
		$.pointerValue<State>(s).i = $.uint(0, 32)
		$.pointerValue<State>(s).n = $.uint($.uint($.len($.pointerValue<State>(s).buf), 32), 32)
		if ($.uint($.pointerValue<State>(s).c, 32) == $.uint((16 - 4), 32)) {
			$.pointerValue<State>(s).n = $.uint($.uint($.len($.pointerValue<State>(s).buf), 32) - 4, 32)
		}
	}

	public Reseed(): void {
		const s: State | $.VarRef<State> | null = this
		let seed: bigint[] = Array.from({ length: 4 }, () => 0n)
		for (let __goscriptRangeTarget0 = seed, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			while (true) {
				let [x, ok] = State.prototype.Next.call(s)
				if (ok) {
					seed[i] = x
					break
				}
				State.prototype.Refill.call(s)
			}
		}
		State.prototype.Init64.call(s, seed)
	}

	static __typeInfo = $.registerStructType(
		"chacha8rand.State",
		() => new State(),
		[{ name: "Init", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "Init64", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "Next", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "uint64" } }, { type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Refill", args: [], returns: [] }, { name: "Reseed", args: [], returns: [] }],
		State,
		[{ name: "buf", key: "buf", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint64" }, length: 32 } }, { name: "seed", key: "seed", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint64" }, length: 4 } }, { name: "i", key: "i", type: { kind: $.TypeKind.Basic, name: "uint32" } }, { name: "n", key: "n", type: { kind: $.TypeKind.Basic, name: "uint32" } }, { name: "c", key: "c", type: { kind: $.TypeKind.Basic, name: "uint32" } }]
	)
}

export class errUnmarshalChaCha8 {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): errUnmarshalChaCha8 {
		const cloned = new errUnmarshalChaCha8()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		return "invalid ChaCha8 encoding"
	}

	static __typeInfo = $.registerStructType(
		"chacha8rand.errUnmarshalChaCha8",
		() => new errUnmarshalChaCha8(),
		[{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		errUnmarshalChaCha8,
		[]
	)
}

export const offsetLOONG64HasLSX: number = 64

export const offsetRISCV64HasV: number = 65

export const ctrInc: number = 4

export const ctrMax: number = 16

export const chunk: number = 32

export const reseed: number = 4

export function block(seed: $.VarRef<bigint[]> | null, blocks: $.VarRef<bigint[]> | null, counter: number): void {
}

export function Marshal(s: State | $.VarRef<State> | null): $.Slice<number> {
	let data: $.Slice<number> = $.makeSlice<number>(6 * 8, undefined, "byte")
	$.copy(data, "chacha8:")
	let used = $.uint((Math.imul((Math.trunc($.pointerValue<State>(s).c / 4)), 32) >>> 0) + $.pointerValue<State>(s).i, 32)
	byteorder.BEPutUint64($.goSlice(data, 1 * 8, undefined), $.uint64(used))
	for (let __goscriptRangeTarget1 = $.pointerValue<State>(s).seed, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		let __goscriptRangeShadow0 = __goscriptRangeTarget1[i]
		byteorder.LEPutUint64($.goSlice(data, (2 + i) * 8, undefined), __goscriptRangeShadow0)
	}
	return data
}

export function Unmarshal(s: State | $.VarRef<State> | null, data: $.Slice<number>): $.GoError {
	if (($.len(data) != (6 * 8)) || (!$.stringEqual($.bytesToString($.goSlice(data, undefined, 8)), "chacha8:"))) {
		return $.interfaceValue<$.GoError>(new errUnmarshalChaCha8(), "*chacha8rand.errUnmarshalChaCha8")
	}
	let used = byteorder.BEUint64($.goSlice(data, 1 * 8, undefined))
	if (used > 124n) {
		return $.interfaceValue<$.GoError>(new errUnmarshalChaCha8(), "*chacha8rand.errUnmarshalChaCha8")
	}
	for (let __goscriptRangeTarget2 = $.pointerValue<State>(s).seed, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
		$.pointerValue<State>(s).seed[i] = byteorder.LEUint64($.goSlice(data, (2 + i) * 8, undefined))
	}
	$.pointerValue<State>(s).c = $.uint(Math.imul(4, (Math.trunc($.uint(used, 32) / 32))) >>> 0, 32)
	block($.pointerValue<State>(s)._fields.seed, $.pointerValue<State>(s)._fields.buf, $.uint($.pointerValue<State>(s).c, 32))
	$.pointerValue<State>(s).i = $.uint($.uint(used, 32) % 32, 32)
	$.pointerValue<State>(s).n = $.uint(32, 32)
	if ($.uint($.pointerValue<State>(s).c, 32) == $.uint((16 - 4), 32)) {
		$.pointerValue<State>(s).n = $.uint(32 - 4, 32)
	}
	return null
}

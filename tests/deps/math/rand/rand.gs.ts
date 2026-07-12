// Generated file based on rand.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import "@goscript/unsafe/index.js"

import * as __goscript_exp from "./exp.gs.ts"

import * as __goscript_normal from "./normal.gs.ts"

import * as __goscript_rng from "./rng.gs.ts"
import "@goscript/math/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "./exp.gs.ts"
import "./normal.gs.ts"
import "./rng.gs.ts"

export type Source = {
	Int63(): bigint | globalThis.Promise<bigint>
	Seed(seed: bigint): void
}

$.registerInterfaceType(
	"rand.Source",
	null,
	[{ name: "Int63", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "Seed", args: [{ name: "seed", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [] }]
);

export type Source64 = {
	Int63(): bigint | globalThis.Promise<bigint>
	Seed(seed: bigint): void
	Uint64(): bigint | globalThis.Promise<bigint>
}

$.registerInterfaceType(
	"rand.Source64",
	null,
	[{ name: "Int63", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "Seed", args: [{ name: "seed", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [] }, { name: "Uint64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }]
);

export class Rand {
	public get src(): Source | null {
		return this._fields.src.value
	}
	public set src(value: Source | null) {
		this._fields.src.value = value
	}

	public get s64(): Source64 | null {
		return this._fields.s64.value
	}
	public set s64(value: Source64 | null) {
		this._fields.s64.value = value
	}

	// readVal contains remainder of 63-bit integer used for bytes
	// generation during most recent Read call.
	// It is saved so next Read call can start where the previous
	// one finished.
	public get readVal(): bigint {
		return this._fields.readVal.value
	}
	public set readVal(value: bigint) {
		this._fields.readVal.value = value
	}

	// readPos indicates the number of low-order bytes of readVal
	// that are still valid.
	public get readPos(): number {
		return this._fields.readPos.value
	}
	public set readPos(value: number) {
		this._fields.readPos.value = value
	}

	public _fields: {
		src: $.VarRef<Source | null>
		s64: $.VarRef<Source64 | null>
		readVal: $.VarRef<bigint>
		readPos: $.VarRef<number>
	}

	constructor(init?: Partial<{src?: Source | null, s64?: Source64 | null, readVal?: bigint, readPos?: number}>) {
		this._fields = {
			src: $.varRef(init?.src ?? (null as Source | null)),
			s64: $.varRef(init?.s64 ?? (null as Source64 | null)),
			readVal: $.varRef(init?.readVal ?? (0n as bigint)),
			readPos: $.varRef(init?.readPos ?? (0 as number))
		}
	}

	public clone(): Rand {
		const cloned = new Rand()
		cloned._fields = {
			src: $.varRef(this._fields.src.value),
			s64: $.varRef(this._fields.s64.value),
			readVal: $.varRef(this._fields.readVal.value),
			readPos: $.varRef(this._fields.readPos.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ExpFloat64(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		while (true) {
			let j = $.uint(await Rand.prototype.Uint32.call(r), 32)
			let i = $.uint(j & 0xFF, 32)
			let x = j * $.arrayIndex(__goscript_exp.we, i)
			if ($.uint(j, 32) < $.uint($.arrayIndex(__goscript_exp.ke, i), 32)) {
				return x
			}
			if ($.uint(i, 32) == $.uint(0, 32)) {
				return 192427936753276243/25000000000000000 - math.Log(await Rand.prototype.Float64.call(r))
			}
			if (($.float32($.arrayIndex(__goscript_exp.fe, i) + ($.float32($.float32(await Rand.prototype.Float64.call(r)) * ($.float32($.arrayIndex(__goscript_exp.fe, i - 1) - $.arrayIndex(__goscript_exp.fe, i))))))) < $.float32(math.Exp(-x))) {
				return x
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Float32(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		// Same rationale as in Float64: we want to preserve the Go 1 value
		// stream except we want to fix it not to return 1.0
		// This only happens 1/2²⁴ of the time (plus the 1/2⁵³ of the time in Float64).
		again: while (true) {
			var f = $.float32(await Rand.prototype.Float64.call(r))

			if (f == 1) {
				continue again
			}
			return f
			break
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Float64(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		// A clearer, simpler implementation would be:
		//	return float64(r.Int63n(1<<53)) / (1<<53)
		// However, Go 1 shipped with
		//	return float64(r.Int63()) / (1 << 63)
		// and we want to preserve that value stream.
		//
		// There is one bug in the value stream: r.Int63() may be so close
		// to 1<<63 that the division rounds up to 1.0, and we've guaranteed
		// that the result is always less than 1.0.
		//
		// We tried to fix this by mapping 1.0 back to 0.0, but since float64
		// values near 0 are much denser than near 1, mapping 1 to 0 caused
		// a theoretically significant overshoot in the probability of returning 0.
		// Instead of that, if we round up to 1, just try again.
		// Getting 1 only happens 1/2⁵³ of the time, so most clients
		// will not observe it anyway.
		again: while (true) {
			var f = Number(await Rand.prototype.Int63.call(r)) / (9223372036854775808)

			if (f == 1) {
				continue again
			}
			return f
			break
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Int(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		let u = $.uint(await Rand.prototype.Int63.call(r), 64)
		return $.int($.uint($.uint64Shr(($.uint($.uint64Shl(u, 1n), 64)), 1n), 64))
	}

	public async Int31(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		return $.int($.int($.int64Shr(await Rand.prototype.Int63.call(r), 32n), 32), 32)
	}

	public async Int31n(n: number): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		if ($.int(n, 32) <= $.int(0, 32)) {
			$.panic("invalid argument to Int31n")
		}
		if ($.int((n & (n - 1)), 32) == $.int(0, 32)) {
			return $.int(await Rand.prototype.Int31.call(r) & (n - 1), 32)
		}
		let max = $.int($.int(((2147483648) - 1) - ((2147483648) % $.uint(n, 32)), 32), 32)
		let v = $.int(await Rand.prototype.Int31.call(r), 32)
		while ($.int(v, 32) > $.int(max, 32)) {
			v = $.int(await Rand.prototype.Int31.call(r), 32)
		}
		return $.int(v % n, 32)
	}

	public async Int63(): globalThis.Promise<bigint> {
		const r: Rand | $.VarRef<Rand> | null = this
		return $.pointerValue<Exclude<Source, null>>($.pointerValue<Rand>(r).src).Int63()
	}

	public async Int63n(n: bigint): globalThis.Promise<bigint> {
		const r: Rand | $.VarRef<Rand> | null = this
		if (n <= 0n) {
			$.panic("invalid argument to Int63n")
		}
		if (($.int64And(n, ($.int64Sub(n, 1n)))) == 0n) {
			return $.int64And(await Rand.prototype.Int63.call(r), ($.int64Sub(n, 1n)))
		}
		let max = $.int64($.uint64Sub(9223372036854775807n, ($.uint64Mod(9223372036854775808n, $.uint64(n)))))
		let v = await Rand.prototype.Int63.call(r)
		while (v > max) {
			v = await Rand.prototype.Int63.call(r)
		}
		return $.int64Mod(v, n)
	}

	public async Intn(n: number): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		if (n <= 0) {
			$.panic("invalid argument to Intn")
		}
		if (n <= ((2147483648) - 1)) {
			return $.int(await Rand.prototype.Int31n.call(r, $.int($.int(n, 32), 32)))
		}
		return $.int(await Rand.prototype.Int63n.call(r, $.int64(n)))
	}

	public async NormFloat64(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		while (true) {
			let j = $.int($.int(await Rand.prototype.Uint32.call(r), 32), 32)
			let i = $.int(j & 0x7F, 32)
			let x = j * $.arrayIndex(__goscript_normal.wn, i)
			if ($.uint(__goscript_normal.absInt32($.int(j, 32)), 32) < $.uint($.arrayIndex(__goscript_normal.kn, i), 32)) {

				return x
			}

			if ($.int(i, 32) == $.int(0, 32)) {

				while (true) {
					x = -math.Log(await Rand.prototype.Float64.call(r)) * (1.0 / 3442619855899/1000000000000)
					let y = -math.Log(await Rand.prototype.Float64.call(r))
					if ((y + y) >= (x * x)) {
						break
					}
				}
				if ($.int(j, 32) > $.int(0, 32)) {
					return 3442619855899/1000000000000 + x
				}
				return -3442619855899/1000000000000 - x
			}
			if (($.float32($.arrayIndex(__goscript_normal.fn, i) + ($.float32($.float32(await Rand.prototype.Float64.call(r)) * ($.float32($.arrayIndex(__goscript_normal.fn, i - 1) - $.arrayIndex(__goscript_normal.fn, i))))))) < $.float32(math.Exp((-.5 * x) * x))) {
				return x
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public async Perm(n: number): globalThis.Promise<$.Slice<number>> {
		const r: Rand | $.VarRef<Rand> | null = this
		let m: $.Slice<number> = $.makeSlice<number>(n, undefined, "number")
		// In the following loop, the iteration when i=0 always swaps m[0] with m[0].
		// A change to remove this useless iteration is to assign 1 to i in the init
		// statement. But Perm also effects r. Making this change will affect
		// the final state of r. So this change can't be made for compatibility
		// reasons for Go 1.
		for (let i = 0; i < n; i++) {
			let j = await Rand.prototype.Intn.call(r, i + 1)
			m![i] = $.arrayIndex(m!, j)
			m![j] = i
		}
		return m
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r: Rand | $.VarRef<Rand> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		{
			const __goscriptTypeSwitchValue = $.pointerValue<Rand>(r).src
			switch (true) {
				case $.typeAssert<lockedSource | $.VarRef<lockedSource> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rand.lockedSource" }).ok:
					{
						let src: lockedSource | $.VarRef<lockedSource> | null = $.typeAssert<lockedSource | $.VarRef<lockedSource> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rand.lockedSource" }).value
						return lockedSource.prototype.read.call(src, p, $.pointerValue<Rand>(r)._fields.readVal, $.pointerValue<Rand>(r)._fields.readPos)
					}
					break
				case $.typeAssert<runtimeSource | $.VarRef<runtimeSource> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rand.runtimeSource" }).ok:
					{
						let src: runtimeSource | $.VarRef<runtimeSource> | null = $.typeAssert<runtimeSource | $.VarRef<runtimeSource> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rand.runtimeSource" }).value
						return runtimeSource.prototype.read.call(src, p, $.pointerValue<Rand>(r)._fields.readVal, $.pointerValue<Rand>(r)._fields.readPos)
					}
					break
			}
		}
		return read(p, $.pointerValue<Rand>(r).src, $.pointerValue<Rand>(r)._fields.readVal, $.pointerValue<Rand>(r)._fields.readPos)
	}

	public async Seed(seed: bigint): globalThis.Promise<void> {
		let r: Rand | $.VarRef<Rand> | null = this
		{
			let __goscriptTuple0: any = $.typeAssertTuple<lockedSource | $.VarRef<lockedSource> | null>($.pointerValue<Rand>(r).src, { kind: $.TypeKind.Pointer, elemType: "rand.lockedSource" })
			let lk: lockedSource | $.VarRef<lockedSource> | null = __goscriptTuple0[0]
			let ok = __goscriptTuple0[1]
			if (ok) {
				await lockedSource.prototype.seedPos.call(lk, seed, $.pointerValue<Rand>(r)._fields.readPos)
				return
			}
		}

		await $.pointerValue<Exclude<Source, null>>($.pointerValue<Rand>(r).src).Seed(seed)
		$.pointerValue<Rand>(r).readPos = $.int(0, 8)
	}

	public async Shuffle(n: number, swap: ((i: number, j: number) => void) | null): globalThis.Promise<void> {
		const r: Rand | $.VarRef<Rand> | null = this
		if (n < 0) {
			$.panic("invalid argument to Shuffle")
		}

		// Fisher-Yates shuffle: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
		// Shuffle really ought not be called with n that doesn't fit in 32 bits.
		// Not only will it take a very long time, but with 2³¹! possible permutations,
		// there's no way that any PRNG can have a big enough internal state to
		// generate even a minuscule percentage of the possible permutations.
		// Nevertheless, the right API signature accepts an int n, so handle it as best we can.
		let i = n - 1
		for (; i > (((2147483648) - 1) - 1); i--) {
			let j = $.int(await Rand.prototype.Int63n.call(r, $.int64(i + 1)))
			await swap!(i, j)
		}
		for (; i > 0; i--) {
			let j = $.int(await Rand.prototype.int31n.call(r, $.int($.int(i + 1, 32), 32)))
			await swap!(i, j)
		}
	}

	public async Uint32(): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		return $.uint($.uint($.int64Shr(await Rand.prototype.Int63.call(r), 31n), 32), 32)
	}

	public async Uint64(): globalThis.Promise<bigint> {
		const r: Rand | $.VarRef<Rand> | null = this
		if ($.pointerValue<Rand>(r).s64 != null) {
			return $.pointerValue<Exclude<Source64, null>>($.pointerValue<Rand>(r).s64).Uint64()
		}
		return $.uint64Or(($.uint64Shr($.uint64(await Rand.prototype.Int63.call(r)), 31n)), ($.uint64Mul(await Rand.prototype.Int63.call(r), (2 ** 32))))
	}

	public async int31n(n: number): globalThis.Promise<number> {
		const r: Rand | $.VarRef<Rand> | null = this
		let v = $.uint(await Rand.prototype.Uint32.call(r), 32)
		let prod = $.uint64Mul($.uint64(v), $.uint64(n))
		let low = $.uint($.uint(prod, 32), 32)
		if ($.uint(low, 32) < $.uint($.uint(n, 32), 32)) {
			let thresh = $.uint($.uint(-n, 32) % $.uint(n, 32), 32)
			while ($.uint(low, 32) < $.uint(thresh, 32)) {
				v = $.uint(await Rand.prototype.Uint32.call(r), 32)
				prod = $.uint64Mul($.uint64(v), $.uint64(n))
				low = $.uint($.uint(prod, 32), 32)
			}
		}
		return $.int($.int($.uint64Shr(prod, 32n), 32), 32)
	}

	static __typeInfo = $.registerStructType(
		"rand.Rand",
		() => new Rand(),
		[{ name: "ExpFloat64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float64" } }] }, { name: "Float32", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float32" } }] }, { name: "Float64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float64" } }] }, { name: "Int", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Int31", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int32" } }] }, { name: "Int31n", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int32" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int32" } }] }, { name: "Int63", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "Int63n", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "Intn", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "NormFloat64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "float64" } }] }, { name: "Perm", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "Seed", args: [{ name: "seed", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [] }, { name: "Shuffle", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "swap", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }, { kind: $.TypeKind.Basic, name: "int" }], results: [] } as $.FunctionTypeInfo) }], returns: [] }, { name: "Uint32", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint32" } }] }, { name: "Uint64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }, { name: "int31n", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int32" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int32" } }] }],
		Rand,
		[{ name: "src", key: "src", type: "rand.Source", pkgPath: "math/rand", index: [0], offset: 0, exported: false }, { name: "s64", key: "s64", type: "rand.Source64", pkgPath: "math/rand", index: [1], offset: 16, exported: false }, { name: "readVal", key: "readVal", type: { kind: $.TypeKind.Basic, name: "int64" }, pkgPath: "math/rand", index: [2], offset: 32, exported: false }, { name: "readPos", key: "readPos", type: { kind: $.TypeKind.Basic, name: "int8" }, pkgPath: "math/rand", index: [3], offset: 40, exported: false }]
	)
}

export class runtimeSource {
	// The mutex is used to avoid race conditions in Read.
	public get mu(): sync.Mutex {
		return this._fields.mu.value
	}
	public set mu(value: sync.Mutex) {
		this._fields.mu.value = value
	}

	public _fields: {
		mu: $.VarRef<sync.Mutex>
	}

	constructor(init?: Partial<{mu?: sync.Mutex}>) {
		this._fields = {
			mu: $.varRef(init?.mu ? $.markAsStructValue($.cloneStructValue(init.mu)) : $.markAsStructValue(new sync.Mutex()))
		}
	}

	public clone(): runtimeSource {
		const cloned = new runtimeSource()
		cloned._fields = {
			mu: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mu.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Int63(): bigint {
		return $.int64($.uint64And(runtime_rand(), 9223372036854775807n))
	}

	public Seed(_p0: bigint): void {
		$.panic("internal error: call to runtimeSource.Seed")
	}

	public Uint64(): bigint {
		return runtime_rand()
	}

	public async read(p: $.Slice<number>, readVal: $.VarRef<bigint> | null, readPos: $.VarRef<number> | null): globalThis.Promise<[number, $.GoError]> {
		const fs: runtimeSource | $.VarRef<runtimeSource> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		await $.pointerValue<runtimeSource>(fs).mu.Lock()
		let __goscriptTuple2: any = await read(p, $.interfaceValue<Source | null>(fs, "*rand.runtimeSource", { kind: $.TypeKind.Pointer, elemType: "rand.runtimeSource" }), readVal, readPos)
		n = __goscriptTuple2[0]
		err = __goscriptTuple2[1]
		$.pointerValue<runtimeSource>(fs).mu.Unlock()
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"rand.runtimeSource",
		() => new runtimeSource(),
		[{ name: "Int63", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "Seed", args: [{ name: "_p0", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [] }, { name: "Uint64", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }, { name: "read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "readVal", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int64" } } }, { name: "readPos", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		runtimeSource,
		[{ name: "mu", key: "mu", type: "sync.Mutex", pkgPath: "math/rand", index: [0], offset: 0, exported: false }]
	)
}

export class lockedSource {
	public get lk(): sync.Mutex {
		return this._fields.lk.value
	}
	public set lk(value: sync.Mutex) {
		this._fields.lk.value = value
	}

	public get s(): __goscript_rng.rngSource | $.VarRef<__goscript_rng.rngSource> | null {
		return this._fields.s.value
	}
	public set s(value: __goscript_rng.rngSource | $.VarRef<__goscript_rng.rngSource> | null) {
		this._fields.s.value = value
	}

	public _fields: {
		lk: $.VarRef<sync.Mutex>
		s: $.VarRef<__goscript_rng.rngSource | $.VarRef<__goscript_rng.rngSource> | null>
	}

	constructor(init?: Partial<{lk?: sync.Mutex, s?: __goscript_rng.rngSource | $.VarRef<__goscript_rng.rngSource> | null}>) {
		this._fields = {
			lk: $.varRef(init?.lk ? $.markAsStructValue($.cloneStructValue(init.lk)) : $.markAsStructValue(new sync.Mutex())),
			s: $.varRef(init?.s ?? (null as __goscript_rng.rngSource | $.VarRef<__goscript_rng.rngSource> | null))
		}
	}

	public clone(): lockedSource {
		const cloned = new lockedSource()
		cloned._fields = {
			lk: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.lk.value))),
			s: $.varRef(this._fields.s.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Int63(): globalThis.Promise<bigint> {
		const r: lockedSource | $.VarRef<lockedSource> | null = this
		let n: bigint = 0n
		await $.pointerValue<lockedSource>(r).lk.Lock()
		n = __goscript_rng.rngSource.prototype.Int63.call($.pointerValue<lockedSource>(r).s)
		$.pointerValue<lockedSource>(r).lk.Unlock()
		return n
	}

	public async Seed(seed: bigint): globalThis.Promise<void> {
		const r: lockedSource | $.VarRef<lockedSource> | null = this
		await $.pointerValue<lockedSource>(r).lk.Lock()
		lockedSource.prototype.seed.call(r, seed)
		$.pointerValue<lockedSource>(r).lk.Unlock()
	}

	public async Uint64(): globalThis.Promise<bigint> {
		const r: lockedSource | $.VarRef<lockedSource> | null = this
		let n: bigint = 0n
		await $.pointerValue<lockedSource>(r).lk.Lock()
		n = __goscript_rng.rngSource.prototype.Uint64.call($.pointerValue<lockedSource>(r).s)
		$.pointerValue<lockedSource>(r).lk.Unlock()
		return n
	}

	public async read(p: $.Slice<number>, readVal: $.VarRef<bigint> | null, readPos: $.VarRef<number> | null): globalThis.Promise<[number, $.GoError]> {
		const r: lockedSource | $.VarRef<lockedSource> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		await $.pointerValue<lockedSource>(r).lk.Lock()
		let __goscriptTuple3: any = await read(p, $.interfaceValue<Source | null>($.pointerValue<lockedSource>(r).s, "*rand.rngSource", { kind: $.TypeKind.Pointer, elemType: "rand.rngSource" }), readVal, readPos)
		n = __goscriptTuple3[0]
		err = __goscriptTuple3[1]
		$.pointerValue<lockedSource>(r).lk.Unlock()
		return [n, err]
	}

	public seed(seed: bigint): void {
		let r: lockedSource | $.VarRef<lockedSource> | null = this
		if ($.pointerValue<lockedSource>(r).s == null) {
			$.pointerValue<lockedSource>(r).s = newSource(seed)
		} else {
			__goscript_rng.rngSource.prototype.Seed.call($.pointerValue<lockedSource>(r).s, seed)
		}
	}

	public async seedPos(seed: bigint, readPos: $.VarRef<number> | null): globalThis.Promise<void> {
		const r: lockedSource | $.VarRef<lockedSource> | null = this
		await $.pointerValue<lockedSource>(r).lk.Lock()
		lockedSource.prototype.seed.call(r, seed)
		readPos!.value = $.int(0, 8)
		$.pointerValue<lockedSource>(r).lk.Unlock()
	}

	static __typeInfo = $.registerStructType(
		"rand.lockedSource",
		() => new lockedSource(),
		[{ name: "Int63", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int64" } }] }, { name: "Seed", args: [{ name: "seed", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [] }, { name: "Uint64", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "uint64" } }] }, { name: "read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "readVal", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int64" } } }, { name: "readPos", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "seed", args: [{ name: "seed", type: { kind: $.TypeKind.Basic, name: "int64" } }], returns: [] }, { name: "seedPos", args: [{ name: "seed", type: { kind: $.TypeKind.Basic, name: "int64" } }, { name: "readPos", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int8" } } }], returns: [] }],
		lockedSource,
		[{ name: "lk", key: "lk", type: "sync.Mutex", pkgPath: "math/rand", index: [0], offset: 0, exported: false }, { name: "s", key: "s", type: { kind: $.TypeKind.Pointer, elemType: "rand.rngSource" }, pkgPath: "math/rand", index: [1], offset: 8, exported: false }]
	)
}

export function NewSource(seed: bigint): Source | null {
	return $.interfaceValue<Source | null>(newSource(seed), "*rand.rngSource", { kind: $.TypeKind.Pointer, elemType: "rand.rngSource" })
}

export function newSource(seed: bigint): __goscript_rng.rngSource | $.VarRef<__goscript_rng.rngSource> | null {
	let rng: $.VarRef<__goscript_rng.rngSource> = $.varRef($.markAsStructValue(new __goscript_rng.rngSource()))
	rng.value.Seed(seed)
	return rng
}

export function New(src: Source | null): Rand | $.VarRef<Rand> | null {
	let [s64, ] = $.typeAssertTuple<Source64 | null>(src, "rand.Source64")
	return new Rand({src: src, s64: s64})
}

export async function read(p: $.Slice<number>, src: Source | null, readVal: $.VarRef<bigint> | null, readPos: $.VarRef<number> | null): globalThis.Promise<[number, $.GoError]> {
	let n: number = 0
	let err: $.GoError = null as $.GoError
	let pos = $.int($.pointerValue<number>(readPos), 8)
	let val = $.pointerValue<bigint>(readVal)
	let __goscriptTuple1: any = $.typeAssertTuple<__goscript_rng.rngSource | $.VarRef<__goscript_rng.rngSource> | null>(src, { kind: $.TypeKind.Pointer, elemType: "rand.rngSource" })
	let rng: __goscript_rng.rngSource | $.VarRef<__goscript_rng.rngSource> | null = __goscriptTuple1[0]
	for (n = 0; n < $.len(p); n++) {
		if ($.int(pos, 8) == $.int(0, 8)) {
			if (rng != null) {
				val = __goscript_rng.rngSource.prototype.Int63.call(rng)
			} else {
				val = await $.pointerValue<Exclude<Source, null>>(src).Int63()
			}
			pos = $.int(7, 8)
		}
		p![n] = $.uint($.uint(val, 8), 8)
		val = $.int64Shr(val, 8n)
		pos--
	}
	readPos!.value = $.int(pos, 8)
	readVal!.value = val
	return [n, err]
}

export let globalRandGenerator: $.VarRef<atomic.Pointer<Rand>> = $.varRef($.markAsStructValue(new atomic.Pointer<Rand>()))

export function __goscript_set_globalRandGenerator(__goscriptValue: atomic.Pointer<Rand>): void {
	globalRandGenerator.value = __goscriptValue
}

export let randautoseed: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("randautoseed")

export function __goscript_set_randautoseed(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	randautoseed = __goscriptValue
}

export let randseednop: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("randseednop")

export function __goscript_set_randseednop(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	randseednop = __goscriptValue
}

export async function globalRand(): globalThis.Promise<Rand | $.VarRef<Rand> | null> {
	{
		let r: Rand | $.VarRef<Rand> | null = (globalRandGenerator.value.Load() as Rand | $.VarRef<Rand> | null)
		if (r != null) {
			return r
		}
	}

	// This is the first call. Initialize based on GODEBUG.
	let r: Rand | $.VarRef<Rand> | null = null as Rand | $.VarRef<Rand> | null
	if ($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(randautoseed)), "0")) {
		godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(randautoseed))
		r = New($.interfaceValue<Source | null>(new lockedSource(), "*rand.lockedSource", { kind: $.TypeKind.Pointer, elemType: "rand.lockedSource" }))
		await Rand.prototype.Seed.call(r, 1n)
	} else {
		r = new Rand({src: $.interfaceValue<Source | null>(new runtimeSource(), "*rand.runtimeSource", { kind: $.TypeKind.Pointer, elemType: "rand.runtimeSource" }), s64: $.interfaceValue<Source64 | null>(new runtimeSource(), "*rand.runtimeSource", { kind: $.TypeKind.Pointer, elemType: "rand.runtimeSource" })})
	}

	if (!globalRandGenerator.value.CompareAndSwap(null, r)) {
		// Two different goroutines called some top-level
		// function at the same time. While the results in
		// that case are unpredictable, if we just use r here,
		// and we are using a seed, we will most likely return
		// the same value for both calls. That doesn't seem ideal.
		// Just use the first one to get in.
		return (globalRandGenerator.value.Load() as Rand | $.VarRef<Rand> | null)
	}

	return r
}

export function runtime_rand(): bigint {
	return 0n
}

export async function Seed(seed: bigint): globalThis.Promise<void> {
	if (!$.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(randseednop)), "0")) {
		return
	}
	godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(randseednop))

	let orig: Rand | $.VarRef<Rand> | null = (globalRandGenerator.value.Load() as Rand | $.VarRef<Rand> | null)

	// If we are already using a lockedSource, we can just re-seed it.
	if (orig != null) {
		{
			let [, ok] = $.typeAssertTuple<lockedSource | $.VarRef<lockedSource> | null>($.pointerValue<Rand>(orig).src, { kind: $.TypeKind.Pointer, elemType: "rand.lockedSource" })
			if (ok) {
				await Rand.prototype.Seed.call(orig, seed)
				return
			}
		}
	}

	// Otherwise either
	// 1) orig == nil, which is the normal case when Seed is the first
	// top-level function to be called, or
	// 2) orig is already a runtimeSource, in which case we need to change
	// to a lockedSource.
	// Either way we do the same thing.

	let r: Rand | $.VarRef<Rand> | null = New($.interfaceValue<Source | null>(new lockedSource(), "*rand.lockedSource", { kind: $.TypeKind.Pointer, elemType: "rand.lockedSource" }))
	await Rand.prototype.Seed.call(r, seed)

	if (!globalRandGenerator.value.CompareAndSwap(orig, r)) {
		// Something changed underfoot. Retry to be safe.
		await Seed(seed)
	}
}

export async function Int63(): globalThis.Promise<bigint> {
	return Rand.prototype.Int63.call(await globalRand())
}

export async function Uint32(): globalThis.Promise<number> {
	return $.uint(await Rand.prototype.Uint32.call(await globalRand()), 32)
}

export async function Uint64(): globalThis.Promise<bigint> {
	return Rand.prototype.Uint64.call(await globalRand())
}

export async function Int31(): globalThis.Promise<number> {
	return $.int(await Rand.prototype.Int31.call(await globalRand()), 32)
}

export async function Int(): globalThis.Promise<number> {
	return Rand.prototype.Int.call(await globalRand())
}

export async function Int63n(n: bigint): globalThis.Promise<bigint> {
	return Rand.prototype.Int63n.call(await globalRand(), n)
}

export async function Int31n(n: number): globalThis.Promise<number> {
	return $.int(await Rand.prototype.Int31n.call(await globalRand(), $.int(n, 32)), 32)
}

export async function Intn(n: number): globalThis.Promise<number> {
	return Rand.prototype.Intn.call(await globalRand(), n)
}

export async function Float64(): globalThis.Promise<number> {
	return Rand.prototype.Float64.call(await globalRand())
}

export async function Float32(): globalThis.Promise<number> {
	return Rand.prototype.Float32.call(await globalRand())
}

export async function Perm(n: number): globalThis.Promise<$.Slice<number>> {
	return Rand.prototype.Perm.call(await globalRand(), n)
}

export async function Shuffle(n: number, swap: ((i: number, j: number) => void) | null): globalThis.Promise<void> {
	await Rand.prototype.Shuffle.call(await globalRand(), n, swap)
}

export async function Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
	let n: number = 0
	let err: $.GoError = null as $.GoError
	return Rand.prototype.Read.call(await globalRand(), p)
}

export async function NormFloat64(): globalThis.Promise<number> {
	return Rand.prototype.NormFloat64.call(await globalRand())
}

export async function ExpFloat64(): globalThis.Promise<number> {
	return Rand.prototype.ExpFloat64.call(await globalRand())
}

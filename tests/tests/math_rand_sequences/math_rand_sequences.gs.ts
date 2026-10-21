// Generated file based on math_rand_sequences.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as math from "@goscript/math/index.js"
import * as rand from "@goscript/math/rand/index.js"

export class lcg {
	public declare x: bigint

	constructor(__goscriptValue?: boolean, x$?: bigint) {
		this.x = x$ ?? 0n
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): lcg {
		return new lcg(true, this.x)
	}

	public __goscriptAssign(source: lcg): this {
		this.x = source.x
		return this
	}

	public Int63(): bigint {
		const l: lcg | $.VarRef<lcg> | null = this;
		const l$: lcg = l == null ? $.pointerTarget<lcg>(l) : (l as any).__isVarRef === true ? (l as any).value : (l as any).__goValue === undefined ? (l as any) : $.pointerTarget<lcg>(l);
		;(l$ as lcg).x = $.uint64Add(($.uint64Mul((l$ as lcg).x, 6364136223846793005n)), 1442695040888963407n)
		return $.int64($.uint64Shr((l$ as lcg).x, 1))
	}

	public Seed(seed: bigint): void {
		const l: lcg | $.VarRef<lcg> | null = this;
		$.pointerValue<lcg>(l).x = $.uint64(seed)
	}

	static __typeInfo = $.registerStructType(
		"main.lcg",
		() => new lcg(),
		() => [{ name: "Int63", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int64") }], pointerReceiver: true }, { name: "Seed", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		lcg,
		() => [{ name: "x", key: "x", type: /* @__PURE__ */ $.basicType("uint64") }]
	)
}

export function mix(h: bigint, v: bigint): bigint {
	return $.uint64Mul(($.uint64Xor(h, v)), 1099511628211n)
}

export function draws(r: rand.Rand | $.VarRef<rand.Rand> | null, n: number): bigint {
	let h = 0n
	for (let __goscriptRangeCount0 = n, __rangeIndex = 0; __rangeIndex < __goscriptRangeCount0; __rangeIndex++) {
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int63() : rand.Rand.prototype.Int63.call($.pointerValue<rand.Rand>(r)))))
		h = mix(h, math.Float64bits((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Float64() : rand.Rand.prototype.Float64.call($.pointerValue<rand.Rand>(r)))))
		h = mix(h, $.uint64(math.Float32bits((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Float32() : rand.Rand.prototype.Float32.call($.pointerValue<rand.Rand>(r))))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Intn(1000) : rand.Rand.prototype.Intn.call($.pointerValue<rand.Rand>(r), 1000))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int31n(7) : rand.Rand.prototype.Int31n.call($.pointerValue<rand.Rand>(r), 7))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int31n(1048576) : rand.Rand.prototype.Int31n.call($.pointerValue<rand.Rand>(r), 1048576))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int63n(1000000000000007n) : rand.Rand.prototype.Int63n.call($.pointerValue<rand.Rand>(r), 1000000000000007n))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int63n(1099511627776n) : rand.Rand.prototype.Int63n.call($.pointerValue<rand.Rand>(r), 1099511627776n))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Intn(3000000000) : rand.Rand.prototype.Intn.call($.pointerValue<rand.Rand>(r), 3000000000))))
		h = mix(h, math.Float64bits((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).NormFloat64() : rand.Rand.prototype.NormFloat64.call($.pointerValue<rand.Rand>(r)))))
		h = mix(h, math.Float64bits((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).ExpFloat64() : rand.Rand.prototype.ExpFloat64.call($.pointerValue<rand.Rand>(r)))))
		h = mix(h, (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Uint64() : rand.Rand.prototype.Uint64.call($.pointerValue<rand.Rand>(r))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Uint32() : rand.Rand.prototype.Uint32.call($.pointerValue<rand.Rand>(r)))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int31() : rand.Rand.prototype.Int31.call($.pointerValue<rand.Rand>(r)))))
	}
	return h
}

export function ints(s: $.Slice<number>): string {
	let out = ""
	for (let __goscriptRangeTarget0 = s, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let v = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as number)
		out += $.runeToString($.int(97 + v, 32))
	}
	return out
}

export function bytesHex(b: $.Slice<number>): string {
	const digits: string = "0123456789abcdef"
	let out = ""
	for (let __goscriptRangeTarget1 = b, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let v = $.uint((__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as number), 8)
		out += $.runeToString($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", $.uintShr(v, 4, 8))) + $.runeToString($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", v & 15))
	}
	return out
}

export async function show(r: rand.Rand | $.VarRef<rand.Rand> | null): globalThis.Promise<void> {
	await $.println("first:", (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int63() : rand.Rand.prototype.Int63.call($.pointerValue<rand.Rand>(r))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Uint32() : rand.Rand.prototype.Uint32.call($.pointerValue<rand.Rand>(r))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Uint64() : rand.Rand.prototype.Uint64.call($.pointerValue<rand.Rand>(r))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int31() : rand.Rand.prototype.Int31.call($.pointerValue<rand.Rand>(r))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Intn(10) : rand.Rand.prototype.Intn.call($.pointerValue<rand.Rand>(r), 10)), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int31n(100) : rand.Rand.prototype.Int31n.call($.pointerValue<rand.Rand>(r), 100)))
	await $.println("floats:", (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Float64() : rand.Rand.prototype.Float64.call($.pointerValue<rand.Rand>(r))), math.Float32bits((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Float32() : rand.Rand.prototype.Float32.call($.pointerValue<rand.Rand>(r)))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).NormFloat64() : rand.Rand.prototype.NormFloat64.call($.pointerValue<rand.Rand>(r))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).ExpFloat64() : rand.Rand.prototype.ExpFloat64.call($.pointerValue<rand.Rand>(r))))
	await $.println("hash:", draws(r, 1000))

	await $.println("perm:", ints((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Perm(12) : rand.Rand.prototype.Perm.call($.pointerValue<rand.Rand>(r), 12))))

	let s = $.arrayToSlice<number>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	rand.Rand.prototype.Shuffle.call($.pointerValue<rand.Rand>(r), $.sliceLen(s), $.functionValue((i: number, j: number) => {
		let __goscriptAssign0_0: number = $.arrayIndex(s!, j)
		let __goscriptAssign0_1: number = $.arrayIndex(s!, i)
		$.sliceElems(s!)[$.sliceSlot(s!, i)] = __goscriptAssign0_0
		$.sliceElems(s!)[$.sliceSlot(s!, j)] = __goscriptAssign0_1
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [] } as $.FunctionTypeInfo)))
	await $.println("shuffle:", ints(s))

	let b = $.makeSlice<number>(13, undefined, "byte")
	void (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Read(b) : rand.Rand.prototype.Read.call($.pointerValue<rand.Rand>(r), b))
	void (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Read($.goSlice(b, undefined, 5)) : rand.Rand.prototype.Read.call($.pointerValue<rand.Rand>(r), $.goSlice(b, undefined, 5)))
	await $.println("read:", bytesHex(b))

	let z = rand.NewZipf(r, 1.5, 2, 100n)
	await $.println("zipf:", (z !== null && (z as any).__isVarRef !== true && (z as any).__goValue === undefined ? ((z as any) as rand.Zipf).Uint64() : rand.Zipf.prototype.Uint64.call($.pointerValue<rand.Zipf>(z))), (z !== null && (z as any).__isVarRef !== true && (z as any).__goValue === undefined ? ((z as any) as rand.Zipf).Uint64() : rand.Zipf.prototype.Uint64.call($.pointerValue<rand.Zipf>(z))), (z !== null && (z as any).__isVarRef !== true && (z as any).__goValue === undefined ? ((z as any) as rand.Zipf).Uint64() : rand.Zipf.prototype.Uint64.call($.pointerValue<rand.Zipf>(z))), (z !== null && (z as any).__isVarRef !== true && (z as any).__goValue === undefined ? ((z as any) as rand.Zipf).Uint64() : rand.Zipf.prototype.Uint64.call($.pointerValue<rand.Zipf>(z))))
}

export async function main(): globalThis.Promise<void> {
	let seeds = $.arrayToSlice<bigint>([0n, 1n, 42n, -7n, 89482311n, 2147483646n, 2147483647n, 2147483648n, 1099511627776n, -9223372036854775808n, 9223372036854775807n])
	for (let __goscriptRangeTarget2 = seeds, __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow2.length; __rangeIndex++) {
		let seed = (__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + __rangeIndex] as bigint)
		await $.println("seed", seed)
		await show(rand.New($.pointerValueOrNil(rand.NewSource(seed))!))
	}

	// Reseeding restarts the sequence, also after a Read.
	let r = rand.New($.pointerValueOrNil(rand.NewSource(5n))!)
	let b = $.makeSlice<number>(3, undefined, "byte")
	void (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Read(b) : rand.Rand.prototype.Read.call($.pointerValue<rand.Rand>(r), b))
	void (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Seed(5n) : rand.Rand.prototype.Seed.call($.pointerValue<rand.Rand>(r), 5n))
	let r2 = rand.New($.pointerValueOrNil(rand.NewSource(5n))!)
	await $.println("reseed:", (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int63() : rand.Rand.prototype.Int63.call($.pointerValue<rand.Rand>(r))) == (r2 !== null && (r2 as any).__isVarRef !== true && (r2 as any).__goValue === undefined ? ((r2 as any) as rand.Rand).Int63() : rand.Rand.prototype.Int63.call($.pointerValue<rand.Rand>(r2))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Float64() : rand.Rand.prototype.Float64.call($.pointerValue<rand.Rand>(r))) == (r2 !== null && (r2 as any).__isVarRef !== true && (r2 as any).__goValue === undefined ? ((r2 as any) as rand.Rand).Float64() : rand.Rand.prototype.Float64.call($.pointerValue<rand.Rand>(r2))))

	// A Source of the program goes through the interfaces.
	await $.println("lcg")
	await show(rand.New($.pointerValueOrNil($.interfaceValue<rand.Source | null>(new lcg(false, 1n), "*main.lcg", /* @__PURE__ */ $.pointerType("main.lcg")))!))

	// A Source used directly, and as a Source64.
	let src = rand.NewSource(99n)
	await $.println("source:", (__goscriptAwait = (src !== null && (src as any).__isVarRef !== true && ((src as any).__goValue === undefined || (src as any).__goType?.charCodeAt(0) !== 42) ? (src as Exclude<rand.Source, null>) : $.pointerValue<Exclude<rand.Source, null>>(src)).Int63(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.pointerValue<Exclude<rand.Source64, null>>($.mustTypeAssert<rand.Source64 | null>(src, "rand.Source64")).Uint64(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

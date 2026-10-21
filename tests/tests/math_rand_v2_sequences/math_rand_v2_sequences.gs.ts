// Generated file based on math_rand_v2_sequences.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as math from "@goscript/math/index.js"
import * as rand from "@goscript/math/rand/v2/index.js"
import * as time from "@goscript/time/index.js"
import "@goscript/time/index.js"

export class splitmix {
	public declare x: bigint

	constructor(__goscriptValue?: boolean, x$?: bigint) {
		this.x = x$ ?? 0n
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): splitmix {
		return new splitmix(true, this.x)
	}

	public __goscriptAssign(source: splitmix): this {
		this.x = source.x
		return this
	}

	public Uint64(): bigint {
		const s: splitmix | $.VarRef<splitmix> | null = this;
		const s$: splitmix = s == null ? $.pointerTarget<splitmix>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<splitmix>(s);
		;(s$ as splitmix).x = $.uint64Add((s$ as splitmix).x, 11400714819323198485n)
		let z = (s$ as splitmix).x
		z = $.uint64Mul(($.uint64Xor(z, ($.uint64Shr(z, 30)))), 13787848793156543929n)
		z = $.uint64Mul(($.uint64Xor(z, ($.uint64Shr(z, 27)))), 10723151780598845931n)
		return $.uint64Xor(z, ($.uint64Shr(z, 31)))
	}

	static __typeInfo = $.registerStructType(
		"main.splitmix",
		() => new splitmix(),
		() => [{ name: "Uint64", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("uint64") }], pointerReceiver: true }],
		splitmix,
		() => [{ name: "x", key: "x", type: /* @__PURE__ */ $.basicType("uint64") }]
	)
}

export function mix(h: bigint, v: bigint): bigint {
	return $.uint64Mul(($.uint64Xor(h, v)), 1099511628211n)
}

export function draws(r: rand.Rand | $.VarRef<rand.Rand> | null, n: number): bigint {
	let h = 0n
	for (let __goscriptRangeCount0 = n, __rangeIndex = 0; __rangeIndex < __goscriptRangeCount0; __rangeIndex++) {
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int64() : rand.Rand.prototype.Int64.call($.pointerValue<rand.Rand>(r)))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Uint32() : rand.Rand.prototype.Uint32.call($.pointerValue<rand.Rand>(r)))))
		h = mix(h, (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Uint64() : rand.Rand.prototype.Uint64.call($.pointerValue<rand.Rand>(r))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int32() : rand.Rand.prototype.Int32.call($.pointerValue<rand.Rand>(r)))))
		h = mix(h, math.Float64bits((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Float64() : rand.Rand.prototype.Float64.call($.pointerValue<rand.Rand>(r)))))
		h = mix(h, $.uint64(math.Float32bits((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Float32() : rand.Rand.prototype.Float32.call($.pointerValue<rand.Rand>(r))))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).IntN(1000) : rand.Rand.prototype.IntN.call($.pointerValue<rand.Rand>(r), 1000))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).IntN(1048576) : rand.Rand.prototype.IntN.call($.pointerValue<rand.Rand>(r), 1048576))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).IntN(3000000000) : rand.Rand.prototype.IntN.call($.pointerValue<rand.Rand>(r), 3000000000))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).IntN(1099511627783) : rand.Rand.prototype.IntN.call($.pointerValue<rand.Rand>(r), 1099511627783))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int32N(7) : rand.Rand.prototype.Int32N.call($.pointerValue<rand.Rand>(r), 7))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Uint32N(4294967295) : rand.Rand.prototype.Uint32N.call($.pointerValue<rand.Rand>(r), 4294967295))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int64N(1000000000000007n) : rand.Rand.prototype.Int64N.call($.pointerValue<rand.Rand>(r), 1000000000000007n))))
		h = mix(h, (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Uint64N(9223372036854775813n) : rand.Rand.prototype.Uint64N.call($.pointerValue<rand.Rand>(r), 9223372036854775813n)))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).UintN(12345) : rand.Rand.prototype.UintN.call($.pointerValue<rand.Rand>(r), 12345))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).N(1000000000n) : rand.Rand.prototype.N.call($.pointerValue<rand.Rand>(r), 1000000000n))))
		h = mix(h, $.uint64((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).N(100) : rand.Rand.prototype.N.call($.pointerValue<rand.Rand>(r), 100))))
		h = mix(h, math.Float64bits((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).NormFloat64() : rand.Rand.prototype.NormFloat64.call($.pointerValue<rand.Rand>(r)))))
		h = mix(h, math.Float64bits((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).ExpFloat64() : rand.Rand.prototype.ExpFloat64.call($.pointerValue<rand.Rand>(r)))))
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

export async function show(r: rand.Rand | $.VarRef<rand.Rand> | null): globalThis.Promise<void> {
	await $.println("first:", (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int64() : rand.Rand.prototype.Int64.call($.pointerValue<rand.Rand>(r))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Uint32() : rand.Rand.prototype.Uint32.call($.pointerValue<rand.Rand>(r))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Uint64() : rand.Rand.prototype.Uint64.call($.pointerValue<rand.Rand>(r))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int32() : rand.Rand.prototype.Int32.call($.pointerValue<rand.Rand>(r))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).IntN(10) : rand.Rand.prototype.IntN.call($.pointerValue<rand.Rand>(r), 10)), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Int32N(100) : rand.Rand.prototype.Int32N.call($.pointerValue<rand.Rand>(r), 100)), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Uint64N(1099511627776n) : rand.Rand.prototype.Uint64N.call($.pointerValue<rand.Rand>(r), 1099511627776n)))
	await $.println("floats:", (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Float64() : rand.Rand.prototype.Float64.call($.pointerValue<rand.Rand>(r))), math.Float32bits((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Float32() : rand.Rand.prototype.Float32.call($.pointerValue<rand.Rand>(r)))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).NormFloat64() : rand.Rand.prototype.NormFloat64.call($.pointerValue<rand.Rand>(r))), (r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).ExpFloat64() : rand.Rand.prototype.ExpFloat64.call($.pointerValue<rand.Rand>(r))))
	await $.println("hash:", draws(r, 500))
	await $.println("perm:", ints((r !== null && (r as any).__isVarRef !== true && (r as any).__goValue === undefined ? ((r as any) as rand.Rand).Perm(12) : rand.Rand.prototype.Perm.call($.pointerValue<rand.Rand>(r), 12))))
	let s = $.arrayToSlice<number>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
	rand.Rand.prototype.Shuffle.call($.pointerValue<rand.Rand>(r), $.sliceLen(s), $.functionValue((i: number, j: number) => {
		let __goscriptAssign0_0: number = $.arrayIndex(s!, j)
		let __goscriptAssign0_1: number = $.arrayIndex(s!, i)
		$.sliceElems(s!)[$.sliceSlot(s!, i)] = __goscriptAssign0_0
		$.sliceElems(s!)[$.sliceSlot(s!, j)] = __goscriptAssign0_1
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [] } as $.FunctionTypeInfo)))
	await $.println("shuffle:", ints(s))
	let z = rand.NewZipf(r, 1.5, 2, 100n)
	await $.println("zipf:", (z !== null && (z as any).__isVarRef !== true && (z as any).__goValue === undefined ? ((z as any) as rand.Zipf).Uint64() : rand.Zipf.prototype.Uint64.call($.pointerValue<rand.Zipf>(z))), (z !== null && (z as any).__isVarRef !== true && (z as any).__goValue === undefined ? ((z as any) as rand.Zipf).Uint64() : rand.Zipf.prototype.Uint64.call($.pointerValue<rand.Zipf>(z))), (z !== null && (z as any).__isVarRef !== true && (z as any).__goValue === undefined ? ((z as any) as rand.Zipf).Uint64() : rand.Zipf.prototype.Uint64.call($.pointerValue<rand.Zipf>(z))), (z !== null && (z as any).__isVarRef !== true && (z as any).__goValue === undefined ? ((z as any) as rand.Zipf).Uint64() : rand.Zipf.prototype.Uint64.call($.pointerValue<rand.Zipf>(z))))
}

export function hex(b: $.Slice<number>): string {
	const digits: string = "0123456789abcdef"
	let out = ""
	for (let __goscriptRangeTarget1 = b, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let v = $.uint((__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as number), 8)
		out += $.runeToString($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", $.uintShr(v, 4, 8))) + $.runeToString($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", v & 15))
	}
	return out
}

export async function main(): globalThis.Promise<void> {
	let seeds = $.arrayToSlice<bigint>([0n, 1n, 42n, 9223372036854775811n, 18446744073709551615n, 81985529216486895n])
	for (let __goscriptRangeTarget2 = seeds, __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), i = 0; i < __goscriptRangeWindow2.length; i++) {
		let seed = (__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + i] as bigint)
		await $.println("pcg", seed)
		await show(rand.New($.pointerValueOrNil($.interfaceValue<rand.Source | null>(rand.NewPCG(seed, ((__goscriptRangeWindow2.backing as any[])[$.windowSlot(__goscriptRangeWindow2, (i + 1) % __goscriptRangeWindow2.length)] as bigint)), "*rand.PCG", __goscriptStatic0()))!))
	}

	for (let __goscriptRangeTarget4 = new Uint8Array([0, 1, 7, 255]) as $.Slice<number>, __goscriptRangeWindow3 = $.sliceRange(__goscriptRangeTarget4), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow3.length; __rangeIndex++) {
		let b = $.uint((__goscriptRangeWindow3.backing[__goscriptRangeWindow3.offset + __rangeIndex] as number), 8)
		let seed: Uint8Array = $.arrayValue(new Uint8Array(32))
		for (let __goscriptRangeTarget3 = seed, __goscriptRangeWindow4 = $.sliceRange(__goscriptRangeTarget3), i = 0; i < __goscriptRangeWindow4.length; i++) {
			seed[i] = $.uint(((b + ($.uint(i, 8) * b)) & 0xff), 8)
		}
		await $.println("chacha8", b)
		await show(rand.New($.pointerValueOrNil($.interfaceValue<rand.Source | null>(rand.NewChaCha8(seed), "*rand.ChaCha8", __goscriptStatic1()))!))
	}

	await $.println("splitmix")
	await show(rand.New($.pointerValueOrNil($.interfaceValue<rand.Source | null>(new splitmix(false, 7n), "*main.splitmix", /* @__PURE__ */ $.pointerType("main.splitmix")))!))

	// PCG and ChaCha8 state round trips.
	let p = rand.NewPCG(5n, 6n)
	void (p !== null && (p as any).__isVarRef !== true && (p as any).__goValue === undefined ? ((p as any) as rand.PCG).Uint64() : rand.PCG.prototype.Uint64.call($.pointerValue<rand.PCG>(p)))
	let __goscriptTuple0: any = (p !== null && (p as any).__isVarRef !== true && (p as any).__goValue === undefined ? ((p as any) as rand.PCG).MarshalBinary() : rand.PCG.prototype.MarshalBinary.call($.pointerValue<rand.PCG>(p)))
	let data: $.Slice<number> = __goscriptTuple0[0]
	await $.println("pcg state:", hex(data))
	let p2 = $.varRef($.markAsStructValue(new rand.PCG()))
	p2.value.UnmarshalBinary(data)
	await $.println("pcg restored:", (p !== null && (p as any).__isVarRef !== true && (p as any).__goValue === undefined ? ((p as any) as rand.PCG).Uint64() : rand.PCG.prototype.Uint64.call($.pointerValue<rand.PCG>(p))) == p2.value.Uint64())
	void (p !== null && (p as any).__isVarRef !== true && (p as any).__goValue === undefined ? ((p as any) as rand.PCG).Seed(9n, 10n) : rand.PCG.prototype.Seed.call($.pointerValue<rand.PCG>(p), 9n, 10n))
	await $.println("pcg seed:", (p !== null && (p as any).__isVarRef !== true && (p as any).__goValue === undefined ? ((p as any) as rand.PCG).Uint64() : rand.PCG.prototype.Uint64.call($.pointerValue<rand.PCG>(p))))

	let seed: Uint8Array = $.arrayValue(new Uint8Array(32))
	let c = rand.NewChaCha8(seed)
	let buf = $.makeSlice<number>(13, undefined, "byte")
	void (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as rand.ChaCha8).Read(buf) : rand.ChaCha8.prototype.Read.call($.pointerValue<rand.ChaCha8>(c), buf))
	await $.println("chacha8 read:", hex(buf))
	let __goscriptTuple1: any = (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as rand.ChaCha8).MarshalBinary() : rand.ChaCha8.prototype.MarshalBinary.call($.pointerValue<rand.ChaCha8>(c)))
	data = __goscriptTuple1[0]
	await $.println("chacha8 state:", hex(data))
	let c2 = rand.NewChaCha8($.arrayValue(new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])))
	await $.println("chacha8 unmarshal:", (c2 !== null && (c2 as any).__isVarRef !== true && (c2 as any).__goValue === undefined ? ((c2 as any) as rand.ChaCha8).UnmarshalBinary(data) : rand.ChaCha8.prototype.UnmarshalBinary.call($.pointerValue<rand.ChaCha8>(c2), data)) == null)
	void (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as rand.ChaCha8).Read($.goSlice(buf, undefined, 5)) : rand.ChaCha8.prototype.Read.call($.pointerValue<rand.ChaCha8>(c), $.goSlice(buf, undefined, 5)))
	void (c2 !== null && (c2 as any).__isVarRef !== true && (c2 as any).__goValue === undefined ? ((c2 as any) as rand.ChaCha8).Read($.goSlice(buf, 5, 10)) : rand.ChaCha8.prototype.Read.call($.pointerValue<rand.ChaCha8>(c2), $.goSlice(buf, 5, 10)))
	await $.println("chacha8 restored:", hex($.goSlice(buf, undefined, 10)), (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as rand.ChaCha8).Uint64() : rand.ChaCha8.prototype.Uint64.call($.pointerValue<rand.ChaCha8>(c))) == (c2 !== null && (c2 as any).__isVarRef !== true && (c2 as any).__goValue === undefined ? ((c2 as any) as rand.ChaCha8).Uint64() : rand.ChaCha8.prototype.Uint64.call($.pointerValue<rand.ChaCha8>(c2))))
	for (let __rangeIndex = 0; __rangeIndex < 300; __rangeIndex++) {
		void (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as rand.ChaCha8).Uint64() : rand.ChaCha8.prototype.Uint64.call($.pointerValue<rand.ChaCha8>(c)))
	}
	await $.println("chacha8 later:", (c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as rand.ChaCha8).Uint64() : rand.ChaCha8.prototype.Uint64.call($.pointerValue<rand.ChaCha8>(c))))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("rand.PCG"), "rand.PCG", () => [$.methodSignature("AppendBinary", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"], true), $.methodSignature("MarshalBinary", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"], true), $.methodSignature("Seed", [["seed1", /* @__PURE__ */ $.basicType("uint64")], ["seed2", /* @__PURE__ */ $.basicType("uint64")]], [], true), $.methodSignature("Uint64", [], [/* @__PURE__ */ $.basicType("uint64")], true), $.methodSignature("UnmarshalBinary", [["data", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], ["error"], true)]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("rand.ChaCha8"), "rand.ChaCha8", () => [$.methodSignature("AppendBinary", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"], true), $.methodSignature("MarshalBinary", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"], true), $.methodSignature("Read", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("Seed", [["seed", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 32)]], [], true), $.methodSignature("Uint64", [], [/* @__PURE__ */ $.basicType("uint64")], true), $.methodSignature("UnmarshalBinary", [["data", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], ["error"], true)]))
}

if ($.isMainScript(import.meta)) {
	await main()
}

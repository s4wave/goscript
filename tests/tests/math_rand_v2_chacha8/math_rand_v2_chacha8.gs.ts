// Generated file based on math_rand_v2_chacha8.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as rand from "@goscript/math/rand/v2/index.js"
import "@goscript/math/rand/v2/index.js"

export async function main(): globalThis.Promise<void> {
	let seed: Uint8Array = new Uint8Array(32)
	for (let __goscriptRangeTarget0 = seed, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		seed[i] = $.uint($.uint(i + 1, 8), 8)
	}
	let r: rand.ChaCha8 | $.VarRef<rand.ChaCha8> | null = rand.NewChaCha8($.cloneArrayValue(seed, { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 }))
	for (let i = 0; i < 8; i++) {
		await $.println(rand.ChaCha8.prototype.Uint64.call(r))
	}
	for (let i = 0; i < 124; i++) {
		rand.ChaCha8.prototype.Uint64.call(r)
	}
	for (let i = 0; i < 8; i++) {
		await $.println(rand.ChaCha8.prototype.Uint64.call(r))
	}
	let __goscriptTuple0: any = rand.ChaCha8.prototype.MarshalBinary.call(r)
	let b: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		$.panic((err as any))
	}
	await $.println($.len(b))
	for (let __goscriptRangeTarget1 = b, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let v = __goscriptRangeTarget1![__rangeIndex]
		await $.println($.uint(v, 8))
	}
	let r2: rand.ChaCha8 | $.VarRef<rand.ChaCha8> | null = rand.NewChaCha8($.cloneArrayValue(seed, { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 }))
	{
		let __goscriptShadow0 = rand.ChaCha8.prototype.UnmarshalBinary.call(r2, b)
		if (__goscriptShadow0 != null) {
			$.panic((__goscriptShadow0 as any))
		}
	}
	for (let i = 0; i < 8; i++) {
		await $.println(rand.ChaCha8.prototype.Uint64.call(r2))
	}
	let seed2 = $.cloneArrayValue(seed, { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 })
	seed2[0] = $.uint(0xff, 8)
	rand.ChaCha8.prototype.Seed.call(r, $.cloneArrayValue(seed2, { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 }))
	await $.println(rand.ChaCha8.prototype.Uint64.call(r))
}

if ($.isMainScript(import.meta)) {
	await main()
}

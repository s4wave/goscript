// Generated file based on for_range_int_wide.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function high(v: bigint): bigint {
	return $.uint64Mul(v, (2 ** 40))
}

export async function main(): globalThis.Promise<void> {
	// A 64-bit count gives a 64-bit counter.
	let wide: bigint = 0n
	for (let i = 0n; i < 4n; i++) {
		wide = $.uint64Add(wide, high(i))
	}
	await $.println("uint64 range sum:", wide)

	let signed: bigint = 0n
	for (let i = 0n; i < 3n; i++) {
		signed = $.int64Sub(signed, $.int64(high($.uint64(i))))
	}
	await $.println("int64 range sum:", signed)

	// A narrower count keeps an int counter.
	let n = 0
	for (let i = 0; i < $.uint(3, 8); i++) {
		n = n + ($.int(i))
	}
	await $.println("uint8 range sum:", n)

	// The count is evaluated once.
	let calls = 0
	let count: (() => bigint | globalThis.Promise<bigint>) | null = $.functionValue((): bigint => {
		calls++
		return 3n
	}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("uint64")] } as $.FunctionTypeInfo))
	for (let __goscriptRangeCount0 = await count!(), __rangeIndex = 0n; __rangeIndex < __goscriptRangeCount0; __rangeIndex++) {
	}
	await $.println("count calls:", calls)

	let m = 2
	for (let __goscriptRangeCount1 = m, i = 0; i < __goscriptRangeCount1; i++) {
		m++
		await $.println("iteration:", i, m)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

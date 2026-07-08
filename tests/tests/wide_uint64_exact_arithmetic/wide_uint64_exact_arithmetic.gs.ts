// Generated file based on wide_uint64_exact_arithmetic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let acc: bigint = 1n
	acc = BigInt.asUintN(64, (BigInt.asUintN(64, acc * 6364136223846793005n)) + 1442695040888963407n)
	acc = acc ^ (acc >> 33n)
	$.println("lcg-xor:", acc)

	let large: bigint = 9007199254740993n
	$.println("mul-over-2^53:", BigInt.asUintN(64, large * 3n))

	let max: bigint = 18446744073709551615n
	$.println("wrap-add:", BigInt.asUintN(64, max + 2n))

	let mixed = 6n
	$.println("mixed-add-shift-mod:", mixed)
}

if ($.isMainScript(import.meta)) {
	await main()
}

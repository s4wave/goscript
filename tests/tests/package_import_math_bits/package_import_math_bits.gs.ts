// Generated file based on package_import_math_bits.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bits from "@goscript/math/bits/index.js"
import "@goscript/math/bits/index.js"

export async function main(): globalThis.Promise<void> {
	$.println("UintSize", bits.UintSize)
	$.println("Len-all", bits.Len($.uint("18446744073709551615", 64)))
	$.println("LeadingZeros-uint-one", bits.LeadingZeros($.uint(1, 64)))
	let [lo, carry] = bits.Add($.uint("18446744073709551615", 64), 1, 0)
	$.println("Add-carry", lo == 0, carry)

	const bit31: bigint = 2147483648n
	const low32: bigint = 4294967295n
	const low63: bigint = 9223372036854775807n
	const highBit: bigint = 9223372036854775808n
	const highNibble: bigint = 17293822569102704640n
	const all64: bigint = 18446744073709551615n
	const all32: number = 4294967295

	$.println("LeadingZeros64", bits.LeadingZeros64(0n), bits.LeadingZeros64(1n), bits.LeadingZeros64(2147483648n), bits.LeadingZeros64(4294967295n), bits.LeadingZeros64(9223372036854775807n), bits.LeadingZeros64(9223372036854775808n), bits.LeadingZeros64(17293822569102704640n), bits.LeadingZeros64(18446744073709551615n))
	$.println("TrailingZeros64", bits.TrailingZeros64(0n), bits.TrailingZeros64(1n), bits.TrailingZeros64(2147483648n), bits.TrailingZeros64(4294967295n), bits.TrailingZeros64(9223372036854775807n), bits.TrailingZeros64(9223372036854775808n), bits.TrailingZeros64(17293822569102704640n), bits.TrailingZeros64(18446744073709551615n))
	$.println("OnesCount64", bits.OnesCount64(0n), bits.OnesCount64(1n), bits.OnesCount64(2147483648n), bits.OnesCount64(4294967295n), bits.OnesCount64(9223372036854775807n), bits.OnesCount64(9223372036854775808n), bits.OnesCount64(17293822569102704640n), bits.OnesCount64(18446744073709551615n))

	let __goscriptTuple0: any = bits.Mul32($.uint(0, 32), $.uint(4294967295, 32))
	let hi = $.uint(__goscriptTuple0[0], 32)
	let lo32 = $.uint(__goscriptTuple0[1], 32)
	$.println("Mul32-zero", $.uint(hi, 32), $.uint(lo32, 32))
	let __goscriptTuple1: any = bits.Mul32($.uint(1, 32), $.uint(4294967295, 32))
	hi = $.uint(__goscriptTuple1[0], 32)
	lo32 = $.uint(__goscriptTuple1[1], 32)
	$.println("Mul32-one-all", $.uint(hi, 32), $.uint(lo32, 32))
	let __goscriptTuple2: any = bits.Mul32($.uint(2147483648, 32), $.uint(2, 32))
	hi = $.uint(__goscriptTuple2[0], 32)
	lo32 = $.uint(__goscriptTuple2[1], 32)
	$.println("Mul32-bit31-double", $.uint(hi, 32), $.uint(lo32, 32))
	let __goscriptTuple3: any = bits.Mul32($.uint(4294967295, 32), $.uint(4294967295, 32))
	hi = $.uint(__goscriptTuple3[0], 32)
	lo32 = $.uint(__goscriptTuple3[1], 32)
	$.println("Mul32-all-all", $.uint(hi, 32), $.uint(lo32, 32))
	let __goscriptTuple4: any = bits.Mul32($.uint(2147483648, 32), $.uint(2147483648, 32))
	hi = $.uint(__goscriptTuple4[0], 32)
	lo32 = $.uint(__goscriptTuple4[1], 32)
	$.println("Mul32-high-high", $.uint(hi, 32), $.uint(lo32, 32))
}

if ($.isMainScript(import.meta)) {
	await main()
}

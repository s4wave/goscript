// Generated file based on builtin_minmax_strings.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as math from "@goscript/math/index.js"
import "@goscript/math/index.js"

export async function main(): globalThis.Promise<void> {
	let maxVal = ""
	let minVal = "~"
	for (const [__rangeIndex, c] of $.rangeString("3215A")) {
		maxVal = (() => { const __goscriptMinMax0 = String.fromCodePoint(c); const __goscriptMinMax1 = maxVal; let __goscriptMinMax2 = __goscriptMinMax0; __goscriptMinMax2 = $.stringCompare(__goscriptMinMax2, __goscriptMinMax1) >= 0 ? __goscriptMinMax2 : __goscriptMinMax1; return __goscriptMinMax2 })()
		minVal = (() => { const __goscriptMinMax3 = String.fromCodePoint(c); const __goscriptMinMax4 = minVal; let __goscriptMinMax5 = __goscriptMinMax3; __goscriptMinMax5 = $.stringCompare(__goscriptMinMax5, __goscriptMinMax4) <= 0 ? __goscriptMinMax5 : __goscriptMinMax4; return __goscriptMinMax5 })()
	}
	$.println("loop:", maxVal, minVal)

	$.println("two-arg:", (() => { const __goscriptMinMax6 = "beta"; const __goscriptMinMax7 = "alpha"; let __goscriptMinMax8 = __goscriptMinMax6; __goscriptMinMax8 = $.stringCompare(__goscriptMinMax8, __goscriptMinMax7) <= 0 ? __goscriptMinMax8 : __goscriptMinMax7; return __goscriptMinMax8 })(), (() => { const __goscriptMinMax9 = "alpha"; const __goscriptMinMax10 = "beta"; let __goscriptMinMax11 = __goscriptMinMax9; __goscriptMinMax11 = $.stringCompare(__goscriptMinMax11, __goscriptMinMax10) >= 0 ? __goscriptMinMax11 : __goscriptMinMax10; return __goscriptMinMax11 })())
	$.println("multi-arg:", (() => { const __goscriptMinMax12 = "delta"; const __goscriptMinMax13 = "alpha"; const __goscriptMinMax14 = "charlie"; const __goscriptMinMax15 = "bravo"; let __goscriptMinMax16 = __goscriptMinMax12; __goscriptMinMax16 = $.stringCompare(__goscriptMinMax16, __goscriptMinMax13) <= 0 ? __goscriptMinMax16 : __goscriptMinMax13; __goscriptMinMax16 = $.stringCompare(__goscriptMinMax16, __goscriptMinMax14) <= 0 ? __goscriptMinMax16 : __goscriptMinMax14; __goscriptMinMax16 = $.stringCompare(__goscriptMinMax16, __goscriptMinMax15) <= 0 ? __goscriptMinMax16 : __goscriptMinMax15; return __goscriptMinMax16 })(), (() => { const __goscriptMinMax17 = "alpha"; const __goscriptMinMax18 = "delta"; const __goscriptMinMax19 = "charlie"; const __goscriptMinMax20 = "bravo"; let __goscriptMinMax21 = __goscriptMinMax17; __goscriptMinMax21 = $.stringCompare(__goscriptMinMax21, __goscriptMinMax18) >= 0 ? __goscriptMinMax21 : __goscriptMinMax18; __goscriptMinMax21 = $.stringCompare(__goscriptMinMax21, __goscriptMinMax19) >= 0 ? __goscriptMinMax21 : __goscriptMinMax19; __goscriptMinMax21 = $.stringCompare(__goscriptMinMax21, __goscriptMinMax20) >= 0 ? __goscriptMinMax21 : __goscriptMinMax20; return __goscriptMinMax21 })())
	$.println("middle-wins:", (() => { const __goscriptMinMax22 = "moon"; const __goscriptMinMax23 = "aardvark"; const __goscriptMinMax24 = "zebra"; let __goscriptMinMax25 = __goscriptMinMax22; __goscriptMinMax25 = $.stringCompare(__goscriptMinMax25, __goscriptMinMax23) <= 0 ? __goscriptMinMax25 : __goscriptMinMax23; __goscriptMinMax25 = $.stringCompare(__goscriptMinMax25, __goscriptMinMax24) <= 0 ? __goscriptMinMax25 : __goscriptMinMax24; return __goscriptMinMax25 })(), (() => { const __goscriptMinMax26 = "ant"; const __goscriptMinMax27 = "zoo"; const __goscriptMinMax28 = "yak"; let __goscriptMinMax29 = __goscriptMinMax26; __goscriptMinMax29 = $.stringCompare(__goscriptMinMax29, __goscriptMinMax27) >= 0 ? __goscriptMinMax29 : __goscriptMinMax27; __goscriptMinMax29 = $.stringCompare(__goscriptMinMax29, __goscriptMinMax28) >= 0 ? __goscriptMinMax29 : __goscriptMinMax28; return __goscriptMinMax29 })())

	let nan = math.NaN()
	$.println("nan:", math.IsNaN($.min(nan, 1)), math.IsNaN($.max(1, nan)))

	let negZero = math.Copysign(0, -1)
	let posZero = 0.0
	$.println("zero:", math.Signbit($.min(posZero, negZero)), math.Signbit($.max(negZero, posZero)))
}

if ($.isMainScript(import.meta)) {
	await main()
}

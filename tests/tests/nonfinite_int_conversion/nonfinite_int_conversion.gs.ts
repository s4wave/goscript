// Generated file based on nonfinite_int_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as math from "@goscript/math/index.js"

export function channel(v: number): number {
	return $.uint(v * 255, 8)
}

export async function main(): globalThis.Promise<void> {
	let nan = math.NaN()

	// NaN converts to 0 at every narrow width, as with Go on arm64 and wasm.
	await $.println("uint8", $.uint(nan, 8), "uint16", $.uint(nan, 16), "uint32", $.uint(nan, 32))
	await $.println("int8", $.int(nan, 8), "int16", $.int(nan, 16), "int32", $.int(nan, 32))

	// A NaN result is not a valid integer that later code can compare.
	let c = channel(nan)
	await $.println("channel", c, "zero", c == 0)

	// Finite values still truncate toward zero as before.
	let a = 200.7
	let b = -12.9
	let d = 65000.5
	await $.println("finite", $.uint(a, 8), $.int(b, 8), $.uint(d, 16), $.int(b, 32))
}

if ($.isMainScript(import.meta)) {
	await main()
}

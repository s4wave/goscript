// Generated file based on binary_precedence.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as math from "@goscript/math/index.js"

export type celsius = number

export function valid(n1: number, n2: number, n3: number, n4: number): boolean {
	return ($.intOr(($.intOr(($.intOr(n1, n2)), n3)), n4)) == 7
}

export async function main(): globalThis.Promise<void> {
	if (valid(1, 2, 4, 0)) {
		await $.println("or equals")
	} else {
		await $.println("or differs")
	}

	await conversionOperands()
}

export async function conversionOperands(): globalThis.Promise<void> {
	let n = 4194368
	let ny = 2
	let threads = 64
	await $.println("divide:", $.int(math.Ceil(n / (ny * threads))))
	await $.println("subtract:", (n - (ny - threads)) == 4194430)
	await $.println("multiply:", (2 * (ny + threads)) == 132)
	await $.println("int:", globalThis.Math.trunc(100 / (globalThis.Math.trunc((ny * threads) / ny))))
	await $.println("named:", (n / (ny + threads)) > 63550)
	let f = 10
	await $.println("float:", $.int(f / (ny + 3)) == 2)
	await $.println("unary:", -(ny + threads) == -66)
}

if ($.isMainScript(import.meta)) {
	await main()
}

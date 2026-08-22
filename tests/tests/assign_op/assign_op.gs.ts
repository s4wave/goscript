// Generated file based on assign_op.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let a: number = 5
	a = a + (3)
	await $.println(a)

	let b: number = 10
	b = b - (2)
	await $.println(b)

	let c: number = 16
	c = Math.trunc(c / 4)
	await $.println(c)

	let quotient: number = 5
	quotient = Math.trunc(quotient / 2)
	await $.println(quotient)

	let unsignedQuotient: number = $.uint(5, 32)
	unsignedQuotient = (unsignedQuotient / $.uint(2, 32)) >>> 0
	await $.println($.uint(unsignedQuotient, 32))

	let d: number = 3
	d = d * (5)
	await $.println(d)

	let e: number = 10
	e = e % (3)
	await $.println(e)

	let f: number = 5
	f = f & (3)
	await $.println(f)

	let g: number = 5
	g = g | (3)
	await $.println(g)

	let h: number = 5
	h = h ^ (3)
	await $.println(h)

	// This operation is not yet supported.
	// var i int = 5
	// i &^= 3    // 101 &^ 011 = 101 & (~011) = 101 & 100 = 100
	// println(i) // Expected output: 4

	let j: number = 5
	j = j << (1)
	await $.println(j)

	let k: number = 5
	k = k >> (1)
	await $.println(k)

	let m: number = 10
	m = m - (1 + 2)
	await $.println(m)
}

if ($.isMainScript(import.meta)) {
	await main()
}

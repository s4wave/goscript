// Generated file based on assign_op.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let a = 5
	a += 3
	await $.println(a)

	let b = 10
	b -= 2
	await $.println(b)

	let c = 16
	c = globalThis.Math.trunc(c / 4)
	await $.println(c)

	let quotient = 5
	quotient = globalThis.Math.trunc(quotient / 2)
	await $.println(quotient)

	let unsignedQuotient = 5
	unsignedQuotient = (unsignedQuotient / 2) >>> 0
	await $.println(unsignedQuotient)

	let d = 3
	d *= 5
	await $.println(d)

	let e = 10
	e %= 3
	await $.println(e)

	let f = 5
	f &= 3
	await $.println(f)

	let g = 5
	g |= 3
	await $.println(g)

	let h = 5
	h ^= 3
	await $.println(h)

	// This operation is not yet supported.
	// var i int = 5
	// i &^= 3    // 101 &^ 011 = 101 & (~011) = 101 & 100 = 100
	// println(i) // Expected output: 4

	let j = 5
	j <<= 1
	await $.println(j)

	let k = 5
	k >>= 1
	await $.println(k)

	let m = 10
	m -= 3
	await $.println(m)

	// Bitwise assignments to a uint32 with its high bit set keep it unsigned.
	let n = 1
	n = (n ^ (0x80000000)) >>> 0
	await $.println(n)
	n = (n | (2)) >>> 0
	await $.println(n)
	n = (n & (0xfffffffe)) >>> 0
	await $.println(n)
	n = (n & ~((2))) >>> 0
	await $.println(n)
	let flags: {"bits": number} = $.anonymousStructValue({"bits": 0}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("bits", /* @__PURE__ */ $.basicType("uint32"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/assign_op" })] })
	flags.bits = 0xf0000000
	flags.bits = (flags.bits | (1)) >>> 0
	await $.println(flags.bits)
}

if ($.isMainScript(import.meta)) {
	await main()
}

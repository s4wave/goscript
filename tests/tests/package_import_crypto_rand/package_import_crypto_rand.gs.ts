// Generated file based on package_import_crypto_rand.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as rand from "@goscript/crypto/rand/index.js"
import * as io from "@goscript/io/index.js"
import "@goscript/io/index.js"

export async function main(): globalThis.Promise<void> {
	// Read from the public entropy adapter and its Reader interface.
	let buf = $.makeSlice<number>(32, undefined, "byte")
	let [n, err] = await rand.Read(buf)
	await $.println("read len", n)
	await $.println("read err nil", err == null)
	await $.println("read has data", hasData(buf))

	// The Reader fills a caller-owned Go byte slice.
	let r: io.Reader | null = rand.Reader
	let small = $.makeSlice<number>(4, undefined, "byte")
	let __goscriptTuple0: any = await (r !== null && (r as any).__isVarRef !== true && ((r as any).__goValue === undefined || (r as any).__goType?.charCodeAt(0) !== 42) ? (r as Exclude<io.Reader, null>) : $.pointerValue<Exclude<io.Reader, null>>(r)).Read(small)
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	await $.println("reader len", n)
	await $.println("reader err nil", err == null)
	await $.println("reader has data", hasData(small))

	// Text uses the same secure source for its token.
	let token = await rand.Text()
	await $.println("text len", $.stringLen(token))
	await $.println("text alphabet", isBase32(token))
}

export function hasData(buf: $.Slice<number>): boolean {
	for (let __goscriptRangeTarget0 = buf, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let b = $.uint((__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as number), 8)
		if (b != 0) {
			return true
		}
	}
	return false
}

export function isBase32(token: string): boolean {
	for (let i = 0; i < $.stringLen(token); i++) {
		let c = $.indexString(token, i)
		if (!(((c >= 65) && (c <= 90)) || ((c >= 50) && (c <= 55)))) {
			return false
		}
	}
	return true
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on array_equality.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Hash = Uint8Array

export function Hash_Valid(h: Hash): boolean {
	return !$.arrayEqual(h, $.arrayValue(new Uint8Array(4)))
}

export async function main(): globalThis.Promise<void> {
	let zero: Hash = $.arrayValue(new Uint8Array(4))
	let one = $.arrayValue(new Uint8Array([0, 7, 0, 0]))
	let other = $.arrayValue(new Uint8Array([0, 7, 0, 0]))
	let different = $.arrayValue(new Uint8Array([0, 0, 7, 0]))

	await $.println("zero valid:", Hash_Valid(zero))
	await $.println("one valid:", Hash_Valid(one))
	await $.println("same:", $.arrayEqual(one, other))
	await $.println("different:", $.arrayEqual(one, different))
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on multiple_return_values.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function multipleReturnValues(): [number, string, boolean] {
	return [42, "hello", true]
}

export async function main(): globalThis.Promise<void> {
	let [a, b, c] = multipleReturnValues()
	await $.println(a)
	await $.println(b)
	await $.println(c)

	let [x, , z] = multipleReturnValues()
	await $.println(x)
	await $.println(z)

	let [, y, ] = multipleReturnValues()
	await $.println(y)
}

if ($.isMainScript(import.meta)) {
	await main()
}

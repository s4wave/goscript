// Generated file based on float_literal_forms.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let eps = 2.220446049250313e-16
	await $.println(eps == 2.220446049250313e-16)
	await $.println((3 as number) == 3.0)
	await $.println((0.1249847412109375 as number) == 0.1249847412109375)
	await $.println((1.5 as number) == 1.5)
	await $.println((2.5 as number) == 2.5)
	let x = 2.0 * 0.25
	await $.println(x == 0.5)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on runtime_goexit_reference.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as runtime from "@goscript/runtime/index.js"
import "@goscript/runtime/index.js"

export async function main(): globalThis.Promise<void> {
	if (false) {
		runtime.Goexit()
	}
	$.println("ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on string_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let w: any = "test"
	await $.println("value is", $.mustTypeAssert<string>(w, /* @__PURE__ */ $.basicType("string")))
}

if ($.isMainScript(import.meta)) {
	await main()
}

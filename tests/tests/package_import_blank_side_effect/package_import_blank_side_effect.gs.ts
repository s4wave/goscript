// Generated file based on package_import_blank_side_effect.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import "@goscript/github.com/s4wave/goscript/tests/tests/package_import_blank_side_effect/registrar/index.js"

import * as registry from "@goscript/github.com/s4wave/goscript/tests/tests/package_import_blank_side_effect/registry/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/package_import_blank_side_effect/registry/index.js"

export async function main(): globalThis.Promise<void> {
	if (!registry.Registered("blank")) {
		$.panic("blank import init did not run")
	}
	$.println("registered:", registry.Registered("blank"))
}

if ($.isMainScript(import.meta)) {
	await main()
}

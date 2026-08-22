// Generated file based on selective_exports.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_utils from "./utils.gs.ts"
import "./utils.gs.ts"

export async function main(): globalThis.Promise<void> {
	await $.println("=== Selective Exports Test ===")

	// Call exported function
	await ExportedFunc()

	// Call unexported function from same file
	await unexportedFunc()

	// Call exported function from another file
	await __goscript_utils.ExportedFromUtils()

	// Call unexported function from another file (should work due to auto-imports)
	await __goscript_utils.unexportedFromUtils()

	await $.println("=== End Selective Exports Test ===")
}

export async function ExportedFunc(): globalThis.Promise<void> {
	await $.println("ExportedFunc called")
}

export async function unexportedFunc(): globalThis.Promise<void> {
	await $.println("unexportedFunc called")
}

if ($.isMainScript(import.meta)) {
	await main()
}

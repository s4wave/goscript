// Generated file based on utils.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function ExportedFromUtils(): globalThis.Promise<void> {
	await $.println("ExportedFromUtils called")
}

export async function unexportedFromUtils(): globalThis.Promise<void> {
	await $.println("unexportedFromUtils called")
}

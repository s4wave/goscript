// Generated file based on slice_nil.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let s: $.Slice<number> = null! as $.Slice<number>
	await $.println("s == nil:", s == null)

	// Slicing nil with valid bounds should work
	let s2: $.Slice<number> = $.goSlice(s, 0, 0)
	await $.println("s[0:0] == nil:", s2 == null)

	let s3: $.Slice<number> = $.goSlice(s, undefined, 0)
	await $.println("s[:0] == nil:", s3 == null)

	let s4: $.Slice<number> = $.goSlice(s, undefined, undefined)
	await $.println("s[:] == nil:", s4 == null)

	await $.println("slice_nil test passed")
}

if ($.isMainScript(import.meta)) {
	await main()
}

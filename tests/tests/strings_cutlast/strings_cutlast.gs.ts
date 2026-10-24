// Generated file based on strings_cutlast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as strings from "@goscript/strings/index.js"

export async function main(): globalThis.Promise<void> {
	// CutLast splits around the last separator, like Cut does around the first.
	let [before, after, found] = strings.CutLast("a/b/c", "/")
	await $.println("CutLast:", before, after, found)
	let __goscriptTuple0: any = strings.Cut("a/b/c", "/")
	before = __goscriptTuple0[0]
	after = __goscriptTuple0[1]
	found = __goscriptTuple0[2]
	await $.println("Cut:", before, after, found)

	// Without the separator, it returns s, "", false.
	let __goscriptTuple1: any = strings.CutLast("abc", "/")
	before = __goscriptTuple1[0]
	after = __goscriptTuple1[1]
	found = __goscriptTuple1[2]
	await $.println("missing:", before, $.stringEqual(after, ""), found)

	// A multi-byte separator and non-ASCII text cut at the last match.
	let __goscriptTuple2: any = strings.CutLast("h\xc3\xa9llo::w\xc3\xb6rld::end", "::")
	before = __goscriptTuple2[0]
	after = __goscriptTuple2[1]
	found = __goscriptTuple2[2]
	await $.println("multi:", before, after, found)
}

if ($.isMainScript(import.meta)) {
	await main()
}

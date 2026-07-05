// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subpkg from "@goscript/github.com/s4wave/goscript/tests/tests/variadic_imported_unexported_option/subpkg/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/variadic_imported_unexported_option/subpkg/index.js"

export async function main(): globalThis.Promise<void> {
	let thing: subpkg.Thing | $.VarRef<subpkg.Thing> | null = await subpkg.New($.arrayToSlice<subpkg.option | null>([subpkg.WithValue(7), subpkg.WithLabel("hi")]))
	$.println($.pointerValue<subpkg.Thing>(thing).Value)
	$.println($.pointerValue<subpkg.Thing>(thing).Label)
}

if ($.isMainScript(import.meta)) {
	await main()
}

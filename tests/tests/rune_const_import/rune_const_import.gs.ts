// Generated file based on rune_const_import.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as subpkg from "@goscript/github.com/s4wave/goscript/tests/tests/rune_const_import/subpkg/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/rune_const_import/subpkg/index.js"

export async function main(): globalThis.Promise<void> {
	// Test importing rune constants from another package
	const separator: number = 47
	const newline: number = 10
	const space: number = 32

	// Print the imported rune constants
	await $.println("separator:", 47)
	await $.println("newline:", 10)
	await $.println("space:", 32)

	// Use them in comparisons to ensure they're actually numbers
	if ((47 as number) == 47) {
		await $.println("separator matches '/'")
	}
	if ((10 as number) == 10) {
		await $.println("newline matches '\\n'")
	}
	if ((32 as number) == 32) {
		await $.println("space matches ' '")
	}

	// Test arithmetic operations (only works with numbers)
	await $.println("separator + 1:", 48)
	await $.println("space - 1:", 31)
}

if ($.isMainScript(import.meta)) {
	await main()
}

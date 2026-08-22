// Generated file based on package_import_path.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as path from "@goscript/path/index.js"
import "@goscript/path/index.js"

export async function main(): globalThis.Promise<void> {
	// Test Clean function
	let cleaned = path.Clean("/a/b/../c/./d")
	await $.println("Clean result:", cleaned)

	// Test Join function
	let joined = path.Join("a", "b", "c")
	await $.println("Join result:", joined)
	let joinedSpread = path.Join(...($.arrayToSlice<string>(["root", "leaf"]) ?? []))
	await $.println("Join spread result:", joinedSpread)

	// Test Base function
	let base = path.Base("/a/b/c.txt")
	await $.println("Base result:", base)

	// Test Dir function
	let dir = path.Dir("/a/b/c.txt")
	await $.println("Dir result:", dir)

	// Test Ext function
	let ext = path.Ext("/a/b/c.txt")
	await $.println("Ext result:", ext)

	// Test IsAbs function
	let isAbs = path.IsAbs("/a/b/c")
	await $.println("IsAbs result:", isAbs)

	// Test Split function
	let [dir2, file] = path.Split("/a/b/c.txt")
	await $.println("Split dir:", dir2)
	await $.println("Split file:", file)

	// Test Match function
	let [matched, err] = path.Match("*.txt", "file.txt")
	if (err != null) {
		await $.println("Match error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	} else {
		await $.println("Match result:", matched)
	}

	await $.println("test finished")
}

if ($.isMainScript(import.meta)) {
	await main()
}

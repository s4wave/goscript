// Generated file based on varref.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	await $.println("setting x to 10")
	let x: $.VarRef<number> = $.varRef(10)

	let p1: $.VarRef<$.VarRef<number> | null> = $.varRef(x)
	let p2: $.VarRef<$.VarRef<$.VarRef<number> | null> | null> = $.varRef(p1)
	let p3: $.VarRef<$.VarRef<$.VarRef<number> | null> | null> | null = p2

	await $.println("***p3 ==", $.pointerValue<number>($.pointerValue<$.VarRef<number> | null>($.pointerValue<$.VarRef<$.VarRef<number> | null> | null>(p3))))
	await $.println()

	await $.println("setting ***p3 to 12")
	$.pointerValue<$.VarRef<number> | null>($.pointerValue<$.VarRef<$.VarRef<number> | null> | null>(p3))!.value = 12
	await $.println("***p3 ==", $.pointerValue<number>($.pointerValue<$.VarRef<number> | null>($.pointerValue<$.VarRef<$.VarRef<number> | null> | null>(p3))))
	await $.println()

	await $.println("setting y to 15, p1 to &y")
	// should be: let y: $.VarRef<number> = $.varRef(15)
	let y: $.VarRef<number> = $.varRef(15)
	// should be: p1.value = y
	p1.value = y

	await $.println("***p3 ==", $.pointerValue<number>($.pointerValue<$.VarRef<number> | null>($.pointerValue<$.VarRef<$.VarRef<number> | null> | null>(p3))))
	await $.println()
}

if ($.isMainScript(import.meta)) {
	await main()
}

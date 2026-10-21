// Generated file based on vars.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/import_package_var_assign/dep/index.js"

export let userLevel: $.VarRef<number> = $.varRef(await defaultLevel())

export function __goscript_set_userLevel(__goscriptValue: number): void {
	userLevel.value = __goscriptValue
}

export async function defaultLevel(): globalThis.Promise<number> {
	let ch = $.makeChannel<number>(1, 0, "both")
	await $.chanSend(ch, 3)
	return await $.chanRecv(ch)
}

export var level: $.VarRef<number>

export function __goscript_init_level(): void {
	if (((level) as any) === undefined) {
		level = $.varRef(base + 1)
	}
}

export function __goscript_get_level(): $.VarRef<number> {
	if (((level) as any) === undefined) {
		__goscript_init_level()
	}
	return level
}

export function __goscript_set_level(__goscriptValue: number): void {
	__goscript_get_level().value = __goscriptValue
}

export let base = 10

export function __goscript_set_base(__goscriptValue: number): void {
	base = __goscriptValue
}

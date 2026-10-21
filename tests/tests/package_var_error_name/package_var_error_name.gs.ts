// Generated file based on package_var_error_name.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as __goscript_load from "./load.gs.ts"
import "@goscript/errors/index.js"
import * as __goscript_package_init from "./__goscript_package_init.gs.ts"

export let Error: $.GoError = null! as $.GoError

export function __goscript_set_Error(__goscriptValue: $.GoError): void {
	Error = __goscriptValue
}

export var ready: number

export async function __goscript_init_ready(): globalThis.Promise<void> {
	if (((ready) as any) === undefined) {
		ready = await __goscript_load.load()
	}
}

export function __goscript_get_ready(): number {
	if (((ready) as any) === undefined) {
		throw new globalThis.Error("goscript package variable ready read before initialization")
	}
	return ready
}

export function __goscript_set_ready(__goscriptValue: number): void {
	ready = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	await $.println((await __goscript_init_ready(), __goscript_get_ready()), (__goscriptAwait = (Error !== null && (Error as any).__isVarRef !== true && ((Error as any).__goValue === undefined || (Error as any).__goType?.charCodeAt(0) !== 42) ? (Error as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(Error)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	const [__goscriptSelect0HasReturn, __goscriptSelect0Value] = await $.selectStatement<any, void>([
		{
			id: 0,
			isSend: false,
			channel: $.makeChannel<number>(1, 0, "both"),
			onSelected: async (__goscriptSelect0Result) => {
				let v = __goscriptSelect0Result.value
				await $.println(v)
			}
		},
		{
			id: -1,
			isSend: false,
			channel: null,
			onSelected: async (__goscriptSelect0Result) => {
				await $.println("no value")
			}
		}
	], true)
	if (__goscriptSelect0HasReturn) {
		return __goscriptSelect0Value
	}
}

var __goscriptAwait: any

await __goscript_package_init.__goscript_package_init()

if ($.isMainScript(import.meta)) {
	await main()
}

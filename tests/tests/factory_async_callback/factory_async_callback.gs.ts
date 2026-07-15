// Generated file based on factory_async_callback.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/factory_async_callback/dep/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/factory_async_callback/dep/index.js"

export type AddFactoryFunc = ((b: dep.Bus) => $.Slice<dep.Factory | null> | globalThis.Promise<$.Slice<dep.Factory | null>>) | null

export let Factories: $.Slice<AddFactoryFunc | null> = $.arrayToSlice<AddFactoryFunc | null>([$.functionValue(async (b: dep.Bus): globalThis.Promise<$.Slice<dep.Factory | null>> => {
	return $.arrayToSlice<dep.Factory | null>([await dep.NewFactory($.markAsStructValue($.cloneStructValue(b)))])
}, ({ kind: $.TypeKind.Function, params: ["dep.Bus"], results: [{ kind: $.TypeKind.Slice, elemType: "dep.Factory" }] } as $.FunctionTypeInfo))])

export function __goscript_set_Factories(__goscriptValue: $.Slice<AddFactoryFunc | null>): void {
	Factories = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	let factories: $.Slice<dep.Factory | null> = await $.arrayIndex(Factories!, 0)!($.markAsStructValue(new dep.Bus()))
	$.println(await $.pointerValue<Exclude<dep.Factory, null>>($.arrayIndex(factories!, 0)).GetConfigID())
}

if ($.isMainScript(import.meta)) {
	await main()
}

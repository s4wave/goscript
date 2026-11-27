// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as subpkg from "@goscript/github.com/s4wave/goscript/tests/tests/type_alias_cross_file/subpkg/index.js"
import type * as __goscript_alias from "./alias.gs.ts"
import * as __goscript_iterator from "./iterator.gs.ts"

export class source {
	constructor(__goscriptValue?: boolean) {
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): source {
		return new source(true)
	}

	public __goscriptAssign(source: source): this {
		return this
	}

	public Val(): __goscript_alias.Value {
		return (new Uint8Array([111, 107]) as __goscript_alias.Value)
	}

	static __typeInfo = $.registerStructType(
		"main.source",
		() => new source(),
		() => [{ name: "Val", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "subpkg.Value") }] }],
		source,
		() => []
	)
}

export async function main(): globalThis.Promise<void> {
	await $.println($.bytesToString(__goscript_iterator.Read($.structInterfaceValue<__goscript_iterator.Reader | null>(new source(true), "main.source", "main.source"))))
	await $.println($.bytesToString(subpkg.Value_Clone(__goscript_iterator.Read($.structInterfaceValue<__goscript_iterator.Reader | null>(new source(true), "main.source", "main.source")))))
}

if ($.isMainScript(import.meta)) {
	await main()
}

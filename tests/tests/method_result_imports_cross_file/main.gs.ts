// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as dep1 from "@goscript/github.com/s4wave/goscript/tests/tests/method_result_imports_cross_file/dep1/index.js"
import * as dep2 from "@goscript/github.com/s4wave/goscript/tests/tests/method_result_imports_cross_file/dep2/index.js"
import type * as __goscript_method from "./method.gs.ts"
import "@goscript/github.com/s4wave/goscript/tests/tests/method_result_imports_cross_file/dep2/index.js"

export class Holder {
	constructor(__goscriptValue?: boolean) {
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Holder {
		return new Holder(true)
	}

	public __goscriptAssign(source: Holder): this {
		return this
	}

	public async Run(): globalThis.Promise<void> {
		let v = dep1.Make()
		await $.println((__goscriptAwait = (v !== null && (v as any).__isVarRef !== true && ((v as any).__goValue === undefined || (v as any).__goType?.charCodeAt(0) !== 42) ? (v as Exclude<dep2.Value, null>) : $.pointerValue<Exclude<dep2.Value, null>>(v)).Value(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	}

	static __typeInfo = $.registerStructType(
		"main.Holder",
		() => new Holder(),
		() => [{ name: "Run", args: [], returns: [] }],
		Holder,
		() => []
	)
}

export async function main(): globalThis.Promise<void> {
	await new Holder(true).Run()
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

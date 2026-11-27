// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/type_alias_interface_param_cross_file/dep/index.js"
import type * as __goscript_types from "./types.gs.ts"
import "@goscript/github.com/s4wave/goscript/tests/tests/type_alias_interface_param_cross_file/dep/index.js"

export class sink {
	public declare size: number

	constructor(__goscriptValue?: boolean, size$?: number) {
		this.size = size$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): sink {
		return new sink(true, this.size)
	}

	public __goscriptAssign(source: sink): this {
		this.size = source.size
		return this
	}

	public Put(v: __goscript_types.Value): void {
		const s: sink | $.VarRef<sink> | null = this;
		$.pointerValue<sink>(s).size = $.sliceLen((v as __goscript_types.Value))
	}

	static __typeInfo = $.registerStructType(
		"main.sink",
		() => new sink(),
		() => [{ name: "Put", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		sink,
		() => [{ name: "size", key: "size", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function write(tx: __goscript_types.Tx | null, v: dep.Value): void {
	void (tx !== null && (tx as any).__isVarRef !== true && ((tx as any).__goValue === undefined || (tx as any).__goType?.charCodeAt(0) !== 42) ? (tx as Exclude<__goscript_types.Tx, null>) : $.pointerValue<Exclude<__goscript_types.Tx, null>>(tx)).Put((v as __goscript_types.Value))
}

export async function main(): globalThis.Promise<void> {
	let s = new sink()
	write($.interfaceValue<__goscript_types.Tx | null>(s, "*main.sink", /* @__PURE__ */ $.pointerType("main.sink")), (new Uint8Array([1, 2, 3]) as $.Slice<number> as dep.Value))
	await $.println("size:", $.pointerValue<sink>(s).size)
}

if ($.isMainScript(import.meta)) {
	await main()
}

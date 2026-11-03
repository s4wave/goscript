// Generated file based on struct_method_expression.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class worker {
	public declare base: number

	constructor(__goscriptValue?: boolean, base$?: number) {
		this.base = base$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): worker {
		return new worker(true, this.base)
	}

	public __goscriptAssign(source: worker): this {
		this.base = source.base
		return this
	}

	public add(v: number): number {
		const w: worker | $.VarRef<worker> | null = this;
		return $.pointerValue<worker>(w).base + v
	}

	static __typeInfo = $.registerStructType(
		"main.worker",
		() => new worker(),
		() => [{ name: "add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		worker,
		() => [{ name: "base", key: "base", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let fn: ((w: worker | $.VarRef<worker> | null, v: number) => number | globalThis.Promise<number>) | null = $.functionValue((w: worker | $.VarRef<worker> | null, v: number): number => (w !== null && (w as any).__isVarRef !== true && (w as any).__goValue === undefined ? ((w as any) as worker).add(v) : worker.prototype.add.call(w, v)), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.worker"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	await $.println("method expr:", (fn!(new worker(false, 5), 7) as number))
}

if ($.isMainScript(import.meta)) {
	await main()
}

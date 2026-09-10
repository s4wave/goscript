// Generated file based on struct_method_expression.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class worker {
	public declare base: number

	public _fields: {
		base: number
	}

	constructor(init?: Partial<{base?: number}>) {
		this._fields = {
			base: init?.base ?? (0 as number)
		}
	}

	public clone(): worker {
		return $.markAsStructValue(new worker(this))
	}

	public add(v: number): number {
		const w: worker | $.VarRef<worker> | null = this;
		return $.pointerValue<worker>(w).base + v
	}

	static {
		$.bindStructFields(this.prototype, ["base"])
	}

	static __typeInfo = $.registerStructType(
		"main.worker",
		() => new worker(),
		() => [{ name: "add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		worker,
		() => [{ name: "base", key: "base", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let fn: ((w: worker | $.VarRef<worker> | null, v: number) => number | globalThis.Promise<number>) | null = $.functionValue((w: worker | $.VarRef<worker> | null, v: number): number => $.pointerValue<worker>(w).add(v), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.worker"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	await $.println("method expr:", await fn!(new worker({base: 5}), 7))
}

if ($.isMainScript(import.meta)) {
	await main()
}

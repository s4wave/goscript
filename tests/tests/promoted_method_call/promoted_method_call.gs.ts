// Generated file based on promoted_method_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class base {
	public declare value: number

	public _fields: {
		value: number
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: init?.value ?? (0 as number)
		}
	}

	public clone(): base {
		return $.markAsStructValue(new base(this))
	}

	public Add(n: number): number {
		const b: base | $.VarRef<base> | null = this
		return $.pointerValue<base>(b).value + n
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.base",
		() => new base(),
		() => [{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		base,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class wrapper {
	public declare base: base

	public _fields: {
		base: base
	}

	constructor(init?: Partial<{base?: base}>) {
		this._fields = {
			base: init?.base ? $.markAsStructValue($.cloneStructValue(init.base)) : $.markAsStructValue(new base())
		}
	}

	public clone(): wrapper {
		return $.markAsStructValue(new wrapper(this))
	}

	public Add(n: any): any {
		return $.pointerValue<base>(this.base).Add(n)
	}

	static {
		$.bindStructFields(this.prototype, ["base"])
	}

	static __typeInfo = $.registerStructType(
		"main.wrapper",
		() => new wrapper(),
		() => [{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		wrapper,
		() => [{ name: "base", key: "base", type: "main.base", anonymous: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	let w: wrapper | $.VarRef<wrapper> | null = new wrapper({base: $.markAsStructValue(new base({value: 3}))})
	await $.println($.pointerValue<wrapper>(w).base.Add(4))

	let add: ((n: number) => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => (n: number) => __receiver.Add(n))($.pointerValue<wrapper>(w).base), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	await $.println(await add!(5))
}

if ($.isMainScript(import.meta)) {
	await main()
}

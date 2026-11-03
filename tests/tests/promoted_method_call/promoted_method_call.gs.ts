// Generated file based on promoted_method_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class base {
	public declare value: number

	constructor(__goscriptValue?: boolean, value$?: number) {
		this.value = value$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): base {
		return new base(true, this.value)
	}

	public __goscriptAssign(source: base): this {
		this.value = source.value
		return this
	}

	public Add(n: number): number {
		const b: base | $.VarRef<base> | null = this;
		return $.pointerValue<base>(b).value + n
	}

	static __typeInfo = $.registerStructType(
		"main.base",
		() => new base(),
		() => [{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		base,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class wrapper {
	public declare base: base

	constructor(__goscriptValue?: boolean, base$?: base) {
		this.base = base$ ?? new base(true)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): wrapper {
		return new wrapper(true, this.base.clone())
	}

	public __goscriptAssign(source: wrapper): this {
		this.base.__goscriptAssign(source.base)
		return this
	}

	public Add(n: any): any {
		return $.pointerValue<base>(this.base).Add(n)
	}

	static __typeInfo = $.registerStructType(
		"main.wrapper",
		() => new wrapper(),
		() => [{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }],
		wrapper,
		() => [{ name: "base", key: "base", type: "main.base", anonymous: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	let w = new wrapper(false, new base(true, 3))
	await $.println($.pointerValue<wrapper>(w).base.Add(4))

	let add: ((n: number) => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => (n: number) => (__receiver !== null && (__receiver as any).__isVarRef !== true && (__receiver as any).__goValue === undefined ? ((__receiver as any) as base).Add(n) : base.prototype.Add.call(__receiver, n)))($.fieldRef($.pointerValue<wrapper>(w), "base")), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo), "main.(*base).Add-fm")
	await $.println((add!(5) as number))
}

if ($.isMainScript(import.meta)) {
	await main()
}

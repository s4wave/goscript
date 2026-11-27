// Generated file based on types.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Foo {
	public declare Value: string

	constructor(__goscriptValue?: boolean, Value$?: string) {
		this.Value = Value$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Foo {
		return new Foo(true, this.Value)
	}

	public __goscriptAssign(source: Foo): this {
		this.Value = source.Value
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Foo",
		() => new Foo(),
		() => [],
		Foo,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export let Storage: globalThis.Map<string, Foo> | null = $.makeMap<string, Foo>([["foo", new Foo(true, "bar")]])

export function __goscript_set_Storage(__goscriptValue: globalThis.Map<string, Foo> | null): void {
	Storage = __goscriptValue
}

// Generated file based on var_init_method_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class T {
	public declare val: number

	public _fields: {
		val: number
	}

	constructor(init?: Partial<{val?: number}>) {
		this._fields = {
			val: init?.val ?? (0 as number)
		}
	}

	public clone(): T {
		return $.markAsStructValue(new T(this))
	}

	public WithDelta(delta: number): T | $.VarRef<T> | null {
		const t: T | $.VarRef<T> | null = this;
		return new T({val: $.pointerValue<T>(t).val + delta})
	}

	static {
		$.bindStructFields(this.prototype, ["val"])
	}

	static __typeInfo = $.registerStructType(
		"main.T",
		() => new T(),
		() => [{ name: "WithDelta", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("main.T") }] }],
		T,
		() => [{ name: "val", key: "val", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function NewT(v: number): T | $.VarRef<T> | null {
	return new T({val: v})
}

export let Base: T | $.VarRef<T> | null = NewT(10)

export function __goscript_set_Base(__goscriptValue: T | $.VarRef<T> | null): void {
	Base = __goscriptValue
}

export let Derived: T | $.VarRef<T> | null = T.prototype.WithDelta.call(Base, 5)

export function __goscript_set_Derived(__goscriptValue: T | $.VarRef<T> | null): void {
	Derived = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	await $.println("Base:", $.pointerValue<T>(Base).val)
	await $.println("Derived:", $.pointerValue<T>(Derived).val)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on value_receiver_address.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Counter {
	public declare value: number

	public _fields: {
		value: number
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: init?.value ?? (0 as number)
		}
	}

	public clone(): Counter {
		return $.markAsStructValue(new Counter(this))
	}

	public PointerAfterIncrement(): Counter | $.VarRef<Counter> | null {
		let c = $.varRef(this)
		c.value.value++
		return c
	}

	public Value(): number {
		const c: Counter | $.VarRef<Counter> | null = this
		return $.pointerValue<Counter>(c).value
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.Counter",
		() => new Counter(),
		() => [{ name: "PointerAfterIncrement", args: [], returns: [{ type: /* @__PURE__ */ $.pointerType("main.Counter") }] }, { name: "Value", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		Counter,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let original = $.varRef($.markAsStructValue(new Counter({value: 10})))
	let pointerFromValue: Counter | $.VarRef<Counter> | null = $.markAsStructValue($.cloneStructValue(original.value)).PointerAfterIncrement()

	await $.println("Value receiver pointer value:", Counter.prototype.Value.call(pointerFromValue))
	await $.println("Original after PointerAfterIncrement:", original.value.Value())
}

if ($.isMainScript(import.meta)) {
	await main()
}

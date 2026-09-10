// Generated file based on shadowed_varref_pointer_receiver.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class locked {
	public declare value: number

	public _fields: {
		value: number
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: init?.value ?? (0 as number)
		}
	}

	public clone(): locked {
		return $.markAsStructValue(new locked(this))
	}

	public Inc(): void {
		let l: locked | $.VarRef<locked> | null = this;
		$.pointerValue<locked>(l).value++
	}

	public Value(): number {
		const l: locked | $.VarRef<locked> | null = this;
		return $.pointerValue<locked>(l).value
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.locked",
		() => new locked(),
		() => [{ name: "Inc", args: [], returns: [] }, { name: "Value", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		locked,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function newLocked(value: number): locked {
	return $.markAsStructValue(new locked({value: value}))
}

export async function main(): globalThis.Promise<void> {
	let __goscriptShadow0 = $.varRef($.markAsStructValue($.cloneStructValue(newLocked(1))))
	__goscriptShadow0.value.Inc()
	await $.println(__goscriptShadow0.value.Value())

	for (let __rangeIndex = 0; __rangeIndex < 1; __rangeIndex++) {
		let __goscriptShadow1 = $.varRef($.markAsStructValue($.cloneStructValue(newLocked(10))))
		__goscriptShadow1.value.Inc()
		await $.println(__goscriptShadow1.value.Value())
	}

	await $.println(__goscriptShadow0.value.Value())
}

if ($.isMainScript(import.meta)) {
	await main()
}

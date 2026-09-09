// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Box {
	public declare N: number

	public _fields: {
		N: number
	}

	constructor(init?: Partial<{N?: number}>) {
		this._fields = {
			N: init?.N ?? (0 as number)
		}
	}

	public clone(): Box {
		return $.markAsStructValue(new Box(this))
	}

	static {
		$.bindStructFields(this.prototype, ["N"])
	}

	static __typeInfo = $.registerStructType(
		"dep.Box",
		() => new Box(),
		() => [],
		Box,
		() => [{ name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export let Value: number = 5

export function __goscript_set_Value(__goscriptValue: number): void {
	Value = __goscriptValue
}

export function Double(v: number): number {
	return v * 2
}

export function NewBox(n: number): Box {
	return $.markAsStructValue(new Box({N: n}))
}

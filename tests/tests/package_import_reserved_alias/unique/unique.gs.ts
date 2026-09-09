// Generated file based on unique.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Box {
	public declare Value: number

	public _fields: {
		Value: number
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: init?.Value ?? (0 as number)
		}
	}

	public clone(): Box {
		return $.markAsStructValue(new Box(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Value"])
	}

	static __typeInfo = $.registerStructType(
		"unique.Box",
		() => new Box(),
		() => [],
		Box,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function NewBox(value: number): Box | $.VarRef<Box> | null {
	return new Box({Value: value})
}

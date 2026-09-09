// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class hidden {
	public declare label: string

	public _fields: {
		label: string
	}

	constructor(init?: Partial<{label?: string}>) {
		this._fields = {
			label: init?.label ?? ("" as string)
		}
	}

	public clone(): hidden {
		return $.markAsStructValue(new hidden(this))
	}

	static {
		$.bindStructFields(this.prototype, ["label"])
	}

	static __typeInfo = $.registerStructType(
		"dep.hidden",
		() => new hidden(),
		() => [],
		hidden,
		() => [{ name: "label", key: "label", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class Public {
	public declare Value: string

	public declare Hidden: hidden

	public _fields: {
		Value: string
		Hidden: hidden
	}

	constructor(init?: Partial<{Value?: string, Hidden?: hidden}>) {
		this._fields = {
			Value: init?.Value ?? ("" as string),
			Hidden: init?.Hidden ? $.markAsStructValue($.cloneStructValue(init.Hidden)) : $.markAsStructValue(new hidden())
		}
	}

	public clone(): Public {
		return $.markAsStructValue(new Public(this))
	}

	public Label(): string {
		const p: Public | $.VarRef<Public> | null = this
		return $.pointerValue<Public>(p).Value
	}

	static {
		$.bindStructFields(this.prototype, ["Value", "Hidden"])
	}

	static __typeInfo = $.registerStructType(
		"dep.Public",
		() => new Public(),
		() => [{ name: "Label", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		Public,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("string") }, { name: "Hidden", key: "Hidden", type: "dep.hidden" }]
	)
}

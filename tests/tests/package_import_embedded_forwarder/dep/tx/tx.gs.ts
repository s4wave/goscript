// Generated file based on tx.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Tx {
	public declare Name: string

	public _fields: {
		Name: string
	}

	constructor(init?: Partial<{Name?: string}>) {
		this._fields = {
			Name: init?.Name ?? ("" as string)
		}
	}

	public clone(): Tx {
		return $.markAsStructValue(new Tx(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Name"])
	}

	static __typeInfo = $.registerStructType(
		"tx.Tx",
		() => new Tx(),
		() => [],
		Tx,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

// Generated file based on other.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class OtherStruct {
	public declare Label: string

	public _fields: {
		Label: string
	}

	constructor(init?: Partial<{Label?: string}>) {
		this._fields = {
			Label: init?.Label ?? ("" as string)
		}
	}

	public clone(): OtherStruct {
		return $.markAsStructValue(new OtherStruct(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Label"])
	}

	static __typeInfo = $.registerStructType(
		"main.OtherStruct",
		() => new OtherStruct(),
		() => [],
		OtherStruct,
		() => [/* @__PURE__ */ $.structField("Label", /* @__PURE__ */ $.basicType("string"), [0], 0, true)]
	)
}

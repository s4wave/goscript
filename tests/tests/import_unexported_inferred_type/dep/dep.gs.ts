// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class hiddenError {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): hiddenError {
		return $.markAsStructValue(new hiddenError(this))
	}

	public Error(): string {
		return "closed"
	}

	static __typeInfo = $.registerStructType(
		"dep.hiddenError",
		() => new hiddenError(),
		() => [{ name: "Error", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		hiddenError,
		() => []
	)
}

export let ErrClosed: hiddenError = $.markAsStructValue(new hiddenError())

export function __goscript_set_ErrClosed(__goscriptValue: hiddenError): void {
	$.assignStruct(ErrClosed, __goscriptValue)
}

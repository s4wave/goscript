// Generated file based on generated.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class yySymType {
	public declare value: number

	public _fields: {
		value: number
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: init?.value ?? (0 as number)
		}
	}

	public clone(): yySymType {
		return $.markAsStructValue(new yySymType(this))
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.yySymType",
		() => new yySymType(),
		() => [],
		yySymType,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class yyParserImpl {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): yyParserImpl {
		return $.markAsStructValue(new yyParserImpl(this))
	}

	static __typeInfo = $.registerStructType(
		"main.yyParserImpl",
		() => new yyParserImpl(),
		() => [],
		yyParserImpl,
		() => []
	)
}

export function yyNewParser(): yyParserImpl | $.VarRef<yyParserImpl> | null {
	return new yyParserImpl()
}

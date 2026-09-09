// Generated file based on helper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class helperState {
	public declare text: string

	public _fields: {
		text: string
	}

	constructor(init?: Partial<{text?: string}>) {
		this._fields = {
			text: init?.text ?? ("" as string)
		}
	}

	public clone(): helperState {
		return $.markAsStructValue(new helperState(this))
	}

	static {
		$.bindStructFields(this.prototype, ["text"])
	}

	static __typeInfo = $.registerStructType(
		"main.helperState",
		() => new helperState(),
		() => [],
		helperState,
		() => [{ name: "text", key: "text", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export function newHelperState(): helperState | $.VarRef<helperState> | null {
	return (() => { const __goscriptLiteralField0 = suffix(); return new helperState({text: __goscriptLiteralField0}) })()
}

export function suffix(): string {
	return "SCRIPT"
}

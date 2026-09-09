// Generated file based on a.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_b from "./b.gs.ts"
import "./b.gs.ts"

export class aValue {
	public declare next: __goscript_b.bValue | $.VarRef<__goscript_b.bValue> | null

	public _fields: {
		next: __goscript_b.bValue | $.VarRef<__goscript_b.bValue> | null
	}

	constructor(init?: Partial<{next?: __goscript_b.bValue | $.VarRef<__goscript_b.bValue> | null}>) {
		this._fields = {
			next: init?.next ?? (null! as __goscript_b.bValue | $.VarRef<__goscript_b.bValue> | null)
		}
	}

	public clone(): aValue {
		return $.markAsStructValue(new aValue(this))
	}

	static {
		$.bindStructFields(this.prototype, ["next"])
	}

	static __typeInfo = $.registerStructType(
		"main.aValue",
		() => new aValue(),
		() => [],
		aValue,
		() => [{ name: "next", key: "next", type: /* @__PURE__ */ $.pointerType("main.bValue") }]
	)
}

export function makeA(): aValue {
	return $.markAsStructValue(new aValue())
}

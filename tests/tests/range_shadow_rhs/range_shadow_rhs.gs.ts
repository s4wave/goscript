// Generated file based on range_shadow_rhs.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class holder {
	public declare values: globalThis.Map<string, number> | null

	public _fields: {
		values: globalThis.Map<string, number> | null
	}

	constructor(init?: Partial<{values?: globalThis.Map<string, number> | null}>) {
		this._fields = {
			values: init?.values ?? (null! as globalThis.Map<string, number> | null)
		}
	}

	public clone(): holder {
		return $.markAsStructValue(new holder(this))
	}

	static {
		$.bindStructFields(this.prototype, ["values"])
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		() => [],
		holder,
		() => [{ name: "values", key: "values", type: /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")) }]
	)
}

export async function main(): globalThis.Promise<void> {
	let k = $.markAsStructValue(new holder({values: $.makeMap<string, number>([["a", 1], ["b", 2]])}))
	let sum = 0
	for (const [__goscriptRangeShadow0, v] of k.values?.entries() ?? []) {
		sum = sum + ($.len(__goscriptRangeShadow0) + v)
	}
	await $.println(sum)
}

if ($.isMainScript(import.meta)) {
	await main()
}

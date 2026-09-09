// Generated file based on map_builtin_name_collision.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Map {
	public declare values: globalThis.Map<string, number> | null

	public _fields: {
		values: globalThis.Map<string, number> | null
	}

	constructor(init?: Partial<{values?: globalThis.Map<string, number> | null}>) {
		this._fields = {
			values: init?.values ?? (null! as globalThis.Map<string, number> | null)
		}
	}

	public clone(): Map {
		return $.markAsStructValue(new Map(this))
	}

	static {
		$.bindStructFields(this.prototype, ["values"])
	}

	static __typeInfo = $.registerStructType(
		"main.Map",
		() => new Map(),
		() => [],
		Map,
		() => [{ name: "values", key: "values", type: /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")) }]
	)
}

export async function main(): globalThis.Promise<void> {
	let m = $.markAsStructValue(new Map({values: $.makeMap<string, number>([["one", 1]])}))
	let [got, ok] = $.mapGet<string, number, number>(m.values, "one", 0)
	await $.println(got, ok)
}

if ($.isMainScript(import.meta)) {
	await main()
}

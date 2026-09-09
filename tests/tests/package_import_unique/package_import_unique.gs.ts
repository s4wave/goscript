// Generated file based on package_import_unique.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as _unique from "@goscript/unique/index.js"
import "@goscript/unique/index.js"

export class zone {
	public declare name: string

	public _fields: {
		name: string
	}

	constructor(init?: Partial<{name?: string}>) {
		this._fields = {
			name: init?.name ?? ("" as string)
		}
	}

	public clone(): zone {
		return $.markAsStructValue(new zone(this))
	}

	static {
		$.bindStructFields(this.prototype, ["name"])
	}

	static __typeInfo = $.registerStructType(
		"main.zone",
		() => new zone(),
		() => [],
		zone,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let a = ($.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new zone({name: "eth0"}))))) as _unique.Handle<zone>)
	let b = ($.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new zone({name: "eth0"}))))) as _unique.Handle<zone>)
	let c = ($.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new zone({name: "eth1"}))))) as _unique.Handle<zone>)

	await $.println($.comparableEqual(a, b))
	await $.println($.comparableEqual(a, c))
	await $.println($.markAsStructValue($.cloneStructValue(a)).Value().name)
}

if ($.isMainScript(import.meta)) {
	await main()
}

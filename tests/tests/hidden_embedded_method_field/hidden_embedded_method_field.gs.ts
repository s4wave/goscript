// Generated file based on hidden_embedded_method_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class embedded {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): embedded {
		const cloned = new embedded()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Database(): string {
		return "method"
	}

	static __typeInfo = $.registerStructType(
		"main.embedded",
		() => new embedded(),
		() => [{ name: "Database", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		embedded,
		() => []
	)
}

export class holder {
	public declare Database: string

	public declare embedded: embedded

	public _fields: {
		Database: $.VarRef<string>
		embedded: $.VarRef<embedded>
	}

	constructor(init?: Partial<{Database?: string, embedded?: embedded}>) {
		this._fields = {
			Database: $.varRef(init?.Database ?? ("" as string)),
			embedded: $.varRef(init?.embedded ? $.markAsStructValue($.cloneStructValue(init.embedded)) : $.markAsStructValue(new embedded()))
		}
	}

	public clone(): holder {
		const cloned = new holder()
		cloned._fields = {
			Database: $.varRef(this._fields.Database.value),
			embedded: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.embedded.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static {
		$.bindStructFields(this.prototype, ["Database", "embedded"])
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		() => [],
		holder,
		() => [{ name: "Database", key: "Database", type: /* @__PURE__ */ $.basicType("string") }, { name: "embedded", key: "embedded", type: "main.embedded", anonymous: true }]
	)
}

export function value(h: holder): string {
	return h.Database
}

export async function main(): globalThis.Promise<void> {
	await $.println(value($.markAsStructValue(new holder({Database: "field"}))))
}

if ($.isMainScript(import.meta)) {
	await main()
}

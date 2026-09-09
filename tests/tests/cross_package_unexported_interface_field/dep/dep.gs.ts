// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type hidden = {
	Ping(): string
}

$.registerInterfaceType(
	"dep.hidden",
	null,
	[{ name: "Ping", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export class impl {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): impl {
		return $.markAsStructValue(new impl(this))
	}

	public Ping(): string {
		return "pong"
	}

	static __typeInfo = $.registerStructType(
		"dep.impl",
		() => new impl(),
		() => [{ name: "Ping", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		impl,
		() => []
	)
}

export class Holder {
	public declare Hidden: hidden | null

	public _fields: {
		Hidden: hidden | null
	}

	constructor(init?: Partial<{Hidden?: hidden | null}>) {
		this._fields = {
			Hidden: init?.Hidden ?? (null! as hidden | null)
		}
	}

	public clone(): Holder {
		return $.markAsStructValue(new Holder(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Hidden"])
	}

	static __typeInfo = $.registerStructType(
		"dep.Holder",
		() => new Holder(),
		() => [],
		Holder,
		() => [{ name: "Hidden", key: "Hidden", type: "dep.hidden" }]
	)
}

export function NewHolder(): Holder {
	return $.markAsStructValue(new Holder({Hidden: $.interfaceValue<hidden | null>($.markAsStructValue(new impl()), "dep.impl", "dep.impl")}))
}

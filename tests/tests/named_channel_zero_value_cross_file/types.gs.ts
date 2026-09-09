// Generated file based on types.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Jobs = $.Channel<Job> | null

export class Job {
	public declare Value: string

	public _fields: {
		Value: string
	}

	constructor(init?: Partial<{Value?: string}>) {
		this._fields = {
			Value: init?.Value ?? ("" as string)
		}
	}

	public clone(): Job {
		return $.markAsStructValue(new Job(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Value"])
	}

	static __typeInfo = $.registerStructType(
		"main.Job",
		() => new Job(),
		() => [],
		Job,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	class result {
		public declare value: number

		public _fields: {
			value: number
		}

		constructor(init?: Partial<{value?: number}>) {
			this._fields = {
				value: init?.value ?? (0 as number)
			}
		}

		public clone(): result {
			return $.markAsStructValue(new result(this))
		}

		static {
			$.bindStructFields(this.prototype, ["value"])
		}

		static __typeInfo = $.registerStructType(
			"main.result",
			() => new result(),
			() => [],
			result,
			() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
		)
	}

	let ch: $.Channel<result> | null = $.makeChannel<result>(1, $.markAsStructValue(new result()), "both")
	let fn: (() => result | globalThis.Promise<result>) | null = null! as (() => result | globalThis.Promise<result>) | null
	fn = $.functionValue(async (): globalThis.Promise<result> => {
		return $.markAsStructValue($.cloneStructValue(await $.chanRecv(ch)))
	}, ({ kind: $.TypeKind.Function, params: [], results: ["main.result"] } as $.FunctionTypeInfo))
	await $.chanSend(ch, $.markAsStructValue(new result({value: 8})))
	let got = $.markAsStructValue($.cloneStructValue(await fn!()))
	await $.println(got.value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

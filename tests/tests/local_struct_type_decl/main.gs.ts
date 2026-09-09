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
	await $.chanSend(ch, $.markAsStructValue(new result({value: 7})))
	let got = await $.chanRecv(ch)
	await $.println(got.value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

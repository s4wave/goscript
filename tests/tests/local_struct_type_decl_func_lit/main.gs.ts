// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let run: (() => void) | null = $.functionValue(async (): globalThis.Promise<void> => {
		class item {
			public declare name: string

			public declare count: number

			public _fields: {
				name: string
				count: number
			}

			constructor(init?: Partial<{name?: string, count?: number}>) {
				this._fields = {
					name: init?.name ?? ("" as string),
					count: init?.count ?? (0 as number)
				}
			}

			public clone(): item {
				return $.markAsStructValue(new item(this))
			}

			static {
				$.bindStructFields(this.prototype, ["name", "count"])
			}

			static __typeInfo = $.registerStructType(
				"main.item",
				() => new item(),
				() => [],
				item,
				() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }, { name: "count", key: "count", type: /* @__PURE__ */ $.basicType("int") }]
			)
		}

		let items: $.Slice<item> = $.arrayToSlice<item>([$.markAsStructValue(new item({name: "alpha", count: 1})), $.markAsStructValue(new item({name: "beta", count: 2}))])
		for (let __goscriptRangeTarget0 = items, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let item = __goscriptRangeTarget0![__rangeIndex]
			await $.println(item.name, item.count)
		}
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))

	await run!()
}

if ($.isMainScript(import.meta)) {
	await main()
}

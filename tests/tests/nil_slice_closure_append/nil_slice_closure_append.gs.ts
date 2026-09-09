// Generated file based on nil_slice_closure_append.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class item {
	public declare Value: number

	public _fields: {
		Value: number
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: init?.Value ?? (0 as number)
		}
	}

	public clone(): item {
		return $.markAsStructValue(new item(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Value"])
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		() => [],
		item,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function fill(fn: ((_p0: number) => void) | null): globalThis.Promise<void> {
	await fn!(3)
}

export async function main(): globalThis.Promise<void> {
	let values: $.Slice<item> = null! as $.Slice<item>
	await fill($.functionValue((value: number): void => {
		values = $.append(values, $.markAsStructValue(new item({Value: value})))
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [] } as $.FunctionTypeInfo)))
	if ($.len(values) != 0) {
		await $.println("first:", $.arrayIndex(values!, 0).Value)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

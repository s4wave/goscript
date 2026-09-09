// Generated file based on subpkg.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type option = ((_p0: Thing | $.VarRef<Thing> | null) => void) | null

export class Thing {
	public declare Value: number

	public declare Label: string

	public _fields: {
		Value: number
		Label: string
	}

	constructor(init?: Partial<{Value?: number, Label?: string}>) {
		this._fields = {
			Value: init?.Value ?? (0 as number),
			Label: init?.Label ?? ("" as string)
		}
	}

	public clone(): Thing {
		return $.markAsStructValue(new Thing(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Value", "Label"])
	}

	static __typeInfo = $.registerStructType(
		"subpkg.Thing",
		() => new Thing(),
		() => [],
		Thing,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("int") }, { name: "Label", key: "Label", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export function WithValue(v: number): option | null {
	return $.functionValue((t: Thing | $.VarRef<Thing> | null): void => {
		$.pointerValue<Thing>(t).Value = v
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("subpkg.Thing")], results: [] } as $.FunctionTypeInfo))
}

export function WithLabel(l: string): option | null {
	return $.functionValue((t: Thing | $.VarRef<Thing> | null): void => {
		$.pointerValue<Thing>(t).Label = l
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("subpkg.Thing")], results: [] } as $.FunctionTypeInfo))
}

export async function New(opts: $.Slice<option | null>): globalThis.Promise<Thing | $.VarRef<Thing> | null> {
	let t: Thing | $.VarRef<Thing> | null = new Thing()
	for (let __goscriptRangeTarget0 = opts, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let opt = __goscriptRangeTarget0![__rangeIndex]
		await opt!(t)
	}
	return t
}

// Generated file based on helper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Value = {
	GetValue(): number
}

$.registerInterfaceType(
	"helper.Value",
	null,
	[{ name: "GetValue", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export class Box {
	public declare Value: any

	public _fields: {
		Value: any
	}

	constructor(init?: Partial<{Value?: any}>) {
		this._fields = {
			Value: init?.Value ?? (null! as any)
		}
	}

	public clone(): Box {
		return $.markAsStructValue(new Box(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Value"])
	}

	static __typeInfo = $.registerStructType(
		"helper.Box",
		() => new Box(),
		() => [],
		Box,
		() => [{ name: "Value", key: "Value", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class IntValue {
	public declare N: number

	public _fields: {
		N: number
	}

	constructor(init?: Partial<{N?: number}>) {
		this._fields = {
			N: init?.N ?? (0 as number)
		}
	}

	public clone(): IntValue {
		return $.markAsStructValue(new IntValue(this))
	}

	public GetValue(): number {
		const v = this;
		return v.N
	}

	static {
		$.bindStructFields(this.prototype, ["N"])
	}

	static __typeInfo = $.registerStructType(
		"helper.IntValue",
		() => new IntValue(),
		() => [{ name: "GetValue", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		IntValue,
		() => [{ name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function Wrap(__typeArgs: $.GenericTypeArgs | undefined, value: any): Box {
	return $.markAsStructValue(new Box({Value: value}))
}

export function Collect<T>(__typeArgs: $.GenericTypeArgs | undefined, value: any): [$.Slice<T>, $.GoError] {
	return [$.arrayToSlice<T>([value]), null]
}

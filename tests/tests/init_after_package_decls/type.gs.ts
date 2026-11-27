// Generated file based on type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import type * as __goscript_field from "./field.gs.ts"

export class Type {
	public declare Name: string

	public declare Fields: $.Slice<__goscript_field.Field>

	constructor(__goscriptValue?: boolean, Name$?: string, Fields$?: $.Slice<__goscript_field.Field>) {
		this.Name = Name$ ?? ""
		this.Fields = Fields$ ?? (null! as $.Slice<__goscript_field.Field>)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Type {
		return new Type(true, this.Name, this.Fields)
	}

	public __goscriptAssign(source: Type): this {
		this.Name = source.Name
		this.Fields = source.Fields
		return this
	}

	public FieldNames(): $.Slice<string> {
		const t: Type | $.VarRef<Type> | null = this;
		let names: $.Slice<string> = $.arrayToSlice<string>([])
		for (let __goscriptRangeTarget0 = $.pointerValue<Type>(t).Fields, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
			let f = ((__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as __goscript_field.Field)).clone()
			names = $.appendOne(names, f.Name)
		}
		return names
	}

	static __typeInfo = $.registerStructType(
		"main.Type",
		() => new Type(),
		() => [{ name: "FieldNames", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string")) }], pointerReceiver: true }],
		Type,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }, { name: "Fields", key: "Fields", type: /* @__PURE__ */ $.sliceType("main.Field") }]
	)
}

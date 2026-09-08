// Generated file based on generic_constrained_slice_clone.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type clonable = {
	CloneVT(__typeArgs: $.GenericTypeArgs | undefined): any
}

$.registerInterfaceType(
	"main.clonable",
	null,
	[{ name: "CloneVT", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export class item {
	public declare value: string

	public _fields: {
		value: $.VarRef<string>
	}

	constructor(init?: Partial<{value?: string}>) {
		this._fields = {
			value: $.varRef(init?.value ?? ("" as string))
		}
	}

	public clone(): item {
		return $.markAsStructValue(new item(this))
	}

	public CloneVT(): item | $.VarRef<item> | null {
		const i: item | $.VarRef<item> | null = this
		if (i == null) {
			return null
		}
		return new item({value: $.pointerValue<item>(i).value})
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		() => [{ name: "CloneVT", args: [], returns: [{ type: /* @__PURE__ */ $.pointerType("main.item") }] }],
		item,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function cloneSlice<T>(__typeArgs: $.GenericTypeArgs | undefined, items: $.Slice<T>): globalThis.Promise<$.Slice<T>> {
	let cloned: $.Slice<T> = $.makeSlice<T>(0, $.len(items), undefined, () => ($.genericZero(__typeArgs, "T", null) as T))
	for (let __goscriptRangeTarget0 = items, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let item = __goscriptRangeTarget0![__rangeIndex]
		cloned = $.append(cloned, await $.callGenericMethod(__typeArgs, "T", "CloneVT", item), $.appendZero(() => ($.genericZero(__typeArgs, "T", null) as T)))
	}
	return cloned
}

export async function main(): globalThis.Promise<void> {
	let items: $.Slice<item | $.VarRef<item> | null> = $.arrayToSlice<item | $.VarRef<item> | null>([new item({value: "first"}), new item({value: "second"})])
	let cloned: $.Slice<item | $.VarRef<item> | null> = (await cloneSlice({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.pointerType("main.item"), zero: () => null, methods: {CloneVT: (receiver: any, ...args: any[]) => $.pointerValue(receiver).CloneVT(...$.stripGenericTypeArgs(args))} }}, items) as $.Slice<item | $.VarRef<item> | null>)
	await $.println($.len(cloned), $.pointerValue<item>($.arrayIndex(cloned!, 0)).value, $.pointerValue<item>($.arrayIndex(cloned!, 1)).value, $.pointerEqual($.arrayIndex(cloned!, 0), $.arrayIndex(items!, 0)))
}

if ($.isMainScript(import.meta)) {
	await main()
}

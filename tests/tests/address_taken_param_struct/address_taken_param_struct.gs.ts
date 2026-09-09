// Generated file based on address_taken_param_struct.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Format {
	public declare Name: string

	public declare Ext: $.Slice<string>

	public _fields: {
		Name: string
		Ext: $.Slice<string>
	}

	constructor(init?: Partial<{Name?: string, Ext?: $.Slice<string>}>) {
		this._fields = {
			Name: init?.Name ?? ("" as string),
			Ext: init?.Ext ?? (null! as $.Slice<string>)
		}
	}

	public clone(): Format {
		return $.markAsStructValue(new Format(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Name", "Ext"])
	}

	static __typeInfo = $.registerStructType(
		"main.Format",
		() => new Format(),
		() => [],
		Format,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }, { name: "Ext", key: "Ext", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string")) }]
	)
}

export let byName: globalThis.Map<string, Format | $.VarRef<Format> | null> | null = $.makeMap<string, Format | $.VarRef<Format> | null>()

export function __goscript_set_byName(__goscriptValue: globalThis.Map<string, Format | $.VarRef<Format> | null> | null): void {
	byName = __goscriptValue
}

export let byExt: globalThis.Map<string, Format | $.VarRef<Format> | null> | null = $.makeMap<string, Format | $.VarRef<Format> | null>()

export function __goscript_set_byExt(__goscriptValue: globalThis.Map<string, Format | $.VarRef<Format> | null> | null): void {
	byExt = __goscriptValue
}

export function registerFormat(__goscriptParam0: Format): void {
	let f: $.VarRef<Format> = $.varRef(__goscriptParam0)
	$.mapSet(byName, f.value.Name, f)
	for (let __goscriptRangeTarget0 = f.value.Ext, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let ext = __goscriptRangeTarget0![__rangeIndex]
		$.mapSet(byExt, ext, f)
	}
	f.value.Name = f.value.Name + "-updated"
}

export async function main(): globalThis.Promise<void> {
	registerFormat($.markAsStructValue(new Format({Name: "json", Ext: $.arrayToSlice<string>(["json"])})))
	await $.println($.pointerValue<Format>($.mapGet<string, Format | $.VarRef<Format> | null, Format | $.VarRef<Format> | null>(byName, "json", null)[0]).Name)
	await $.println($.pointerValue<Format>($.mapGet<string, Format | $.VarRef<Format> | null, Format | $.VarRef<Format> | null>(byExt, "json", null)[0]).Name)
	$.pointerValue<Format>($.mapGet<string, Format | $.VarRef<Format> | null, Format | $.VarRef<Format> | null>(byName, "json", null)[0]).Name = "mutated"
	await $.println($.pointerValue<Format>($.mapGet<string, Format | $.VarRef<Format> | null, Format | $.VarRef<Format> | null>(byExt, "json", null)[0]).Name)
}

if ($.isMainScript(import.meta)) {
	await main()
}

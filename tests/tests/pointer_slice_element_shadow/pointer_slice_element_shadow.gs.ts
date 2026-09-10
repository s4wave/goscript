// Generated file based on pointer_slice_element_shadow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class entry {
	public declare key: string

	public _fields: {
		key: string
	}

	constructor(init?: Partial<{key?: string}>) {
		this._fields = {
			key: init?.key ?? ("" as string)
		}
	}

	public clone(): entry {
		return $.markAsStructValue(new entry(this))
	}

	static {
		$.bindStructFields(this.prototype, ["key"])
	}

	static __typeInfo = $.registerStructType(
		"main.entry",
		() => new entry(),
		() => [],
		entry,
		() => [{ name: "key", key: "key", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class _object {
	public declare entries: $.Slice<entry>

	public _fields: {
		entries: $.Slice<entry>
	}

	constructor(init?: Partial<{entries?: $.Slice<entry>}>) {
		this._fields = {
			entries: init?.entries ?? (null! as $.Slice<entry>)
		}
	}

	public clone(): _object {
		return $.markAsStructValue(new _object(this))
	}

	public next(): entry | $.VarRef<entry> | null {
		let o: _object | $.VarRef<_object> | null = this;
		if ($.cap($.pointerValue<_object>(o).entries) > $.len($.pointerValue<_object>(o).entries)) {
			$.pointerValue<_object>(o).entries = $.goSlice($.pointerValue<_object>(o).entries, undefined, $.len($.pointerValue<_object>(o).entries) + 1)
		} else {
			$.pointerValue<_object>(o).entries = $.append($.pointerValue<_object>(o).entries, $.markAsStructValue(new entry()))
		}
		return $.indexRef($.pointerValue<_object>(o).entries!, $.len($.pointerValue<_object>(o).entries) - 1)
	}

	static {
		$.bindStructFields(this.prototype, ["entries"])
	}

	static __typeInfo = $.registerStructType(
		"main.object",
		() => new _object(),
		() => [{ name: "next", args: [], returns: [{ type: /* @__PURE__ */ $.pointerType("main.entry") }] }],
		_object,
		() => [{ name: "entries", key: "entries", type: /* @__PURE__ */ $.sliceType("main.entry") }]
	)
}

export function parseKey(): [string, $.GoError] {
	return ["parsed", null]
}

export async function printInterfaceSpareZero(): globalThis.Promise<void> {
	let values: $.Slice<any> = $.makeSlice<any>(0, 2)
	values = $.append(values, $.interfaceValue($.markAsStructValue(new entry({key: "value"})), "main.entry", "main.entry"), $.appendZeros.nil)
	values = $.goSlice(values, undefined, 2)
	await $.println($.arrayIndex(values!, 1) == null)
}

export async function printInterfaceAppendSliceSpareZero(): globalThis.Promise<void> {
	let values: $.Slice<any> = $.makeSlice<any>(0, 2)
	values = $.appendSlice(values, $.arrayToSlice<any>([$.interfaceValue($.markAsStructValue(new entry({key: "value"})), "main.entry", "main.entry")]), $.appendZeros.nil)
	values = $.goSlice(values, undefined, 2)
	await $.println($.arrayIndex(values!, 1) == null)
}

export async function main(): globalThis.Promise<void> {
	let o: _object | $.VarRef<_object> | null = new _object()
	for (let i = 0; i < 4; i++) {
		let __goscriptShadow0: entry | $.VarRef<entry> | null = _object.prototype.next.call(o)
		$.pointerValue<entry>(__goscriptShadow0).key = "set"
		await $.println(i, $.pointerValue<entry>(__goscriptShadow0).key)
	}

	let __goscriptShadow1: entry | $.VarRef<entry> | null = _object.prototype.next.call(o)
	let err: $.GoError = null! as $.GoError
	let __goscriptTuple0: any = parseKey()
	$.pointerValue<entry>(__goscriptShadow1).key = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	await $.println($.pointerValue<entry>(__goscriptShadow1).key, err == null)
	await printInterfaceSpareZero()
	await printInterfaceAppendSliceSpareZero()
}

if ($.isMainScript(import.meta)) {
	await main()
}

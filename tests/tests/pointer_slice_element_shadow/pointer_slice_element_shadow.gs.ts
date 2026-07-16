// Generated file based on pointer_slice_element_shadow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class entry {
	public get key(): string {
		return this._fields.key.value
	}
	public set key(value: string) {
		this._fields.key.value = value
	}

	public _fields: {
		key: $.VarRef<string>
	}

	constructor(init?: Partial<{key?: string}>) {
		this._fields = {
			key: $.varRef(init?.key ?? ("" as string))
		}
	}

	public clone(): entry {
		const cloned = new entry()
		cloned._fields = {
			key: $.varRef(this._fields.key.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.entry",
		() => new entry(),
		[],
		entry,
		[{ name: "key", key: "key", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export class _object {
	public get entries(): $.Slice<entry> {
		return this._fields.entries.value
	}
	public set entries(value: $.Slice<entry>) {
		this._fields.entries.value = value
	}

	public _fields: {
		entries: $.VarRef<$.Slice<entry>>
	}

	constructor(init?: Partial<{entries?: $.Slice<entry>}>) {
		this._fields = {
			entries: $.varRef(init?.entries ?? (null as $.Slice<entry>))
		}
	}

	public clone(): _object {
		const cloned = new _object()
		cloned._fields = {
			entries: $.varRef(this._fields.entries.value)
		}
		return $.markAsStructValue(cloned)
	}

	public next(): entry | $.VarRef<entry> | null {
		let o: _object | $.VarRef<_object> | null = this
		if ($.cap($.pointerValue<_object>(o).entries) > $.len($.pointerValue<_object>(o).entries)) {
			$.pointerValue<_object>(o).entries = $.goSlice($.pointerValue<_object>(o).entries, undefined, $.len($.pointerValue<_object>(o).entries) + 1)
		} else {
			$.pointerValue<_object>(o).entries = $.append($.pointerValue<_object>(o).entries, $.markAsStructValue(new entry()))
		}
		return $.indexRef($.pointerValue<_object>(o).entries!, $.len($.pointerValue<_object>(o).entries) - 1)
	}

	static __typeInfo = $.registerStructType(
		"main.object",
		() => new _object(),
		[{ name: "next", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "main.entry" } }] }],
		_object,
		[{ name: "entries", key: "entries", type: { kind: $.TypeKind.Slice, elemType: "main.entry" } }]
	)
}

export function parseKey(): [string, $.GoError] {
	return ["parsed", null]
}

export function printInterfaceSpareZero(): void {
	let values: $.Slice<any> = $.makeSlice<any>(0, 2)
	values = $.append(values, $.interfaceValue<any>($.markAsStructValue(new entry({key: "value"})), "main.entry", "main.entry"), $.appendZeros.nil)
	values = $.goSlice(values, undefined, 2)
	$.println($.arrayIndex(values!, 1) == null)
}

export function printInterfaceAppendSliceSpareZero(): void {
	let values: $.Slice<any> = $.makeSlice<any>(0, 2)
	values = $.appendSlice(values, $.arrayToSlice<any>([$.interfaceValue<any>($.markAsStructValue(new entry({key: "value"})), "main.entry", "main.entry")]), $.appendZeros.nil)
	values = $.goSlice(values, undefined, 2)
	$.println($.arrayIndex(values!, 1) == null)
}

export async function main(): globalThis.Promise<void> {
	let o: _object | $.VarRef<_object> | null = new _object()
	for (let i = 0; i < 4; i++) {
		let __goscriptShadow0: entry | $.VarRef<entry> | null = _object.prototype.next.call(o)
		$.pointerValue<entry>(__goscriptShadow0).key = "set"
		$.println(i, $.pointerValue<entry>(__goscriptShadow0).key)
	}

	let __goscriptShadow1: entry | $.VarRef<entry> | null = _object.prototype.next.call(o)
	let err: $.GoError = null as $.GoError
	let __goscriptTuple0: any = parseKey()
	$.pointerValue<entry>(__goscriptShadow1).key = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	$.println($.pointerValue<entry>(__goscriptShadow1).key, err == null)
	printInterfaceSpareZero()
	printInterfaceAppendSliceSpareZero()
}

if ($.isMainScript(import.meta)) {
	await main()
}

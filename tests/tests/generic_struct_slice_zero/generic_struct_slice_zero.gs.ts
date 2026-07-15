// Generated file based on generic_struct_slice_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"
import "@goscript/slices/index.js"

export class item {
	public get Text(): string {
		return this._fields.Text.value
	}
	public set Text(value: string) {
		this._fields.Text.value = value
	}

	public _fields: {
		Text: $.VarRef<string>
	}

	constructor(init?: Partial<{Text?: string}>) {
		this._fields = {
			Text: $.varRef(init?.Text ?? ("" as string))
		}
	}

	public clone(): item {
		const cloned = new item()
		cloned._fields = {
			Text: $.varRef(this._fields.Text.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		[],
		item,
		[{ name: "Text", key: "Text", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export class arena {
	public get data(): $.Slice<any> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<any>) {
		this._fields.data.value = value
	}

	public _fields: {
		data: $.VarRef<$.Slice<any>>
	}

	constructor(init?: Partial<{data?: $.Slice<any>}>) {
		this._fields = {
			data: $.varRef(init?.data ?? (null as $.Slice<any>))
		}
	}

	public clone(): arena {
		const cloned = new arena()
		cloned._fields = {
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	public New(__typeArgs: $.GenericTypeArgs | undefined): any {
		let a: arena | $.VarRef<arena> | null = this
		if ($.len($.pointerValue<arena>(a).data) == $.cap($.pointerValue<arena>(a).data)) {
			let nextSize = 1
			$.pointerValue<arena>(a).data = (slices.Grow(null, nextSize, () => ($.genericZero(__typeArgs, "T", null) as any)) as $.Slice<any>)
		}
		let index = $.len($.pointerValue<arena>(a).data)
		$.pointerValue<arena>(a).data = $.goSlice($.pointerValue<arena>(a).data, undefined, index + 1)
		return $.indexRef($.pointerValue<arena>(a).data!, index)
	}

	static __typeInfo = $.registerStructType(
		"main.arena",
		() => new arena(),
		[{ name: "New", args: [], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } } }] }],
		arena,
		[{ name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let a: $.VarRef<arena> = $.varRef($.markAsStructValue(new arena()))
	let value: item | $.VarRef<item> | null = (a.value.New({[$.genericTypeArgsMarker]: true, T: { type: "main.item", zero: () => $.markAsStructValue(new item()) }}) as item | $.VarRef<item> | null)
	$.pointerValue<item>(value).Text = "ok"
	$.println($.pointerValue<item>(value).Text)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on byte_slice_composite_literal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class holder {
	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public _fields: {
		data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{data?: $.Slice<number>}>) {
		this._fields = {
			data: $.varRef(init?.data ?? (null as $.Slice<number>))
		}
	}

	public clone(): holder {
		const cloned = new holder()
		cloned._fields = {
			data: $.varRef(this._fields.data.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		[],
		holder,
		[{ name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }]
	)
}

export async function main(): globalThis.Promise<void> {
	// A non-empty []byte composite literal must keep the Uint8Array
	// representation shared by the make, conversion, and array-literal
	// paths, rather than degrading to a generic Array<number> backing.
	let b: $.Slice<number> = $.byteSliceLiteral([$.uint(1, 8), $.uint(2, 8), $.uint(3, 8)])
	$.println("non-empty:", b)
	$.println("index:", $.uint($.arrayIndex(b!, 0), 8), $.uint($.arrayIndex(b!, 1), 8), $.uint($.arrayIndex(b!, 2), 8))
	$.println("len:", $.len(b))

	// Storing the literal in a struct field and reading it back must
	// preserve the Uint8Array backing without any append repairing it.
	let h = $.markAsStructValue(new holder({data: $.byteSliceLiteral([$.uint(9, 8), $.uint(8, 8), $.uint(7, 8)])}))
	$.println("stored:", h.data)
	$.println("stored index:", $.uint($.arrayIndex(h.data!, 1), 8))

	// An empty non-nil []byte literal stays a Uint8Array.
	let e: $.Slice<number> = $.byteSliceLiteral([])
	$.println("empty:", e)
	$.println("empty len:", $.len(e))

	// A keyed/sparse []byte literal is zero-filled and stays a Uint8Array.
	let k: $.Slice<number> = $.byteSliceLiteral([0, 0, 0, 0, 0, $.uint(1, 8)])
	$.println("keyed:", k)
	$.println("keyed len:", $.len(k))
}

if ($.isMainScript(import.meta)) {
	await main()
}

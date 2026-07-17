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
			data: $.varRef(init?.data ?? (null! as $.Slice<number>))
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
	let b: $.Slice<number> = new Uint8Array([1, 2, 3]) as $.Slice<number>
	$.println("non-empty:", b)
	$.println("index:", $.uint($.arrayIndex(b!, 0), 8), $.uint($.arrayIndex(b!, 1), 8), $.uint($.arrayIndex(b!, 2), 8))
	$.println("len:", $.len(b))

	// Storing the literal in a struct field and reading it back must
	// preserve the Uint8Array backing without any append repairing it.
	let h = $.markAsStructValue(new holder({data: new Uint8Array([9, 8, 7]) as $.Slice<number>}))
	$.println("stored:", h.data)
	$.println("stored index:", $.uint($.arrayIndex(h.data!, 1), 8))

	// An empty non-nil []byte literal stays a Uint8Array.
	let e: $.Slice<number> = new Uint8Array([]) as $.Slice<number>
	$.println("empty:", e)
	$.println("empty len:", $.len(e))

	// A keyed/sparse []byte literal is zero-filled and stays a Uint8Array.
	let k: $.Slice<number> = new Uint8Array([0, 0, 0, 0, 0, 1]) as $.Slice<number>
	$.println("keyed:", k)
	$.println("keyed len:", $.len(k))

	// A non-constant element is emitted bare: new Uint8Array truncates it to
	// uint8 on construction, so 300 folds to 44 without a runtime $.uint wrap,
	// while the constant element folds to a plain literal.
	let n = 300
	let m: $.Slice<number> = new Uint8Array([$.uint(n, 8), 2]) as $.Slice<number>
	$.println("mixed:", m)
	$.println("mixed index:", $.uint($.arrayIndex(m!, 0), 8), $.uint($.arrayIndex(m!, 1), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}

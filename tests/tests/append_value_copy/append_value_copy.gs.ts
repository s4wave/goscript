// Generated file based on append_value_copy.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class cell {
	// width is the number of buffered characters.
	public declare width: number

	public _fields: {
		width: number
	}

	constructor(init?: Partial<{width?: number}>) {
		this._fields = {
			width: init?.width ?? (0 as number)
		}
	}

	public clone(): cell {
		return $.markAsStructValue(new cell(this))
	}

	static {
		$.bindStructFields(this.prototype, ["width"])
	}

	static __typeInfo = $.registerStructType(
		"main.cell",
		() => new cell(),
		() => [],
		cell,
		() => [{ name: "width", key: "width", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Resetting a reusable cell must leave appended entries intact.
	let current = $.varRef($.markAsStructValue(new cell({width: 7})))
	let cells: $.Slice<cell> = $.append<cell>(null, $.markAsStructValue($.cloneStructValue(current.value)))
	$.assignStruct(current.value, $.markAsStructValue(new cell()))
	await $.println("cell:", $.arrayIndex(cells!, 0).width, current.value.width)

	// Arrays also copy at the argument boundary.
	let row = [3, 4]
	let rows: $.Slice<number[]> = $.append<number[]>(null, $.cloneArrayValue(row, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)))
	row[0] = 9
	await $.println("array:", $.arrayIndex($.arrayIndex(rows!, 0), 0), $.arrayIndex(row, 0))

	// Pointer elements retain their identity.
	let pointers: $.Slice<cell | $.VarRef<cell> | null> = $.append<cell | $.VarRef<cell> | null>(null, current, $.appendZeros.nil)
	current.value.width = 11
	await $.println("pointer:", $.pointerValue<cell>($.arrayIndex(pointers!, 0)).width)
}

if ($.isMainScript(import.meta)) {
	await main()
}

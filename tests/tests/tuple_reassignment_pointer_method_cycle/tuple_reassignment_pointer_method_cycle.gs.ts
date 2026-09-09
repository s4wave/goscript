// Generated file based on tuple_reassignment_pointer_method_cycle.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class box {
	public declare value: number

	public _fields: {
		value: number
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: init?.value ?? (0 as number)
		}
	}

	public clone(): box {
		return $.markAsStructValue(new box(this))
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.box",
		() => new box(),
		() => [],
		box,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class cursor {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): cursor {
		return $.markAsStructValue(new cursor(this))
	}

	public rotate(a: box | $.VarRef<box> | null, b: box | $.VarRef<box> | null, c: box | $.VarRef<box> | null): [box | $.VarRef<box> | null, box | $.VarRef<box> | null, box | $.VarRef<box> | null] {
		return [b, c, a]
	}

	static __typeInfo = $.registerStructType(
		"main.cursor",
		() => new cursor(),
		() => [{ name: "rotate", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.pointerType("main.box") }, { type: /* @__PURE__ */ $.pointerType("main.box") }, { type: /* @__PURE__ */ $.pointerType("main.box") }] }],
		cursor,
		() => []
	)
}

export async function main(): globalThis.Promise<void> {
	let __goscriptShadow0: cursor | $.VarRef<cursor> | null = new cursor()
	let x: box | $.VarRef<box> | null = new box({value: 1})
	let y: box | $.VarRef<box> | null = new box({value: 2})
	let z: box | $.VarRef<box> | null = new box({value: 3})

	for (let __rangeIndex = 0; __rangeIndex < 1; __rangeIndex++) {
		let __goscriptTuple0: any = cursor.prototype.rotate.call(__goscriptShadow0, x, y, z)
		x = __goscriptTuple0[0]
		y = __goscriptTuple0[1]
		z = __goscriptTuple0[2]
	}

	await $.println($.pointerValue<box>(x).value, $.pointerValue<box>(y).value, $.pointerValue<box>(z).value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

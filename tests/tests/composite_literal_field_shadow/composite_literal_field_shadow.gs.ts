// Generated file based on composite_literal_field_shadow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class buffer {
	public declare buf: $.Slice<number>

	public _fields: {
		buf: $.Slice<number>
	}

	constructor(init?: Partial<{buf?: $.Slice<number>}>) {
		this._fields = {
			buf: init?.buf ?? (null! as $.Slice<number>)
		}
	}

	public clone(): buffer {
		return $.markAsStructValue(new buffer(this))
	}

	static {
		$.bindStructFields(this.prototype, ["buf"])
	}

	static __typeInfo = $.registerStructType(
		"main.buffer",
		() => new buffer(),
		() => [],
		buffer,
		() => [{ name: "buf", key: "buf", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }]
	)
}

export function newBuffer(data: $.Slice<number>): buffer | $.VarRef<buffer> | null {
	let buf: buffer | $.VarRef<buffer> | null = new buffer({buf: data})
	return buf
}

export async function main(): globalThis.Promise<void> {
	let buf: buffer | $.VarRef<buffer> | null = newBuffer(new Uint8Array([7]) as $.Slice<number>)
	await $.println($.uint($.arrayIndex($.pointerValue<buffer>(buf).buf!, 0), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}

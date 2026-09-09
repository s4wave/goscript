// Generated file based on make_slice_struct_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class code {
	public declare len: number

	public _fields: {
		len: number
	}

	constructor(init?: Partial<{len?: number}>) {
		this._fields = {
			len: init?.len ?? (0 as number)
		}
	}

	public clone(): code {
		return $.markAsStructValue(new code(this))
	}

	static {
		$.bindStructFields(this.prototype, ["len"])
	}

	static __typeInfo = $.registerStructType(
		"main.code",
		() => new code(),
		() => [],
		code,
		() => [{ name: "len", key: "len", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let codes: $.Slice<code> = $.makeSlice<code>(2, undefined, undefined, () => $.markAsStructValue(new code()))
	$.arrayIndex(codes!, 0).len = 3
	await $.println("first:", $.arrayIndex(codes!, 0).len)
	await $.println("second:", $.arrayIndex(codes!, 1).len)
}

if ($.isMainScript(import.meta)) {
	await main()
}

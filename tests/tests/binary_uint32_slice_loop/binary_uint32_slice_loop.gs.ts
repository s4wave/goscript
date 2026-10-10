// Generated file based on binary_uint32_slice_loop.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as binary from "@goscript/encoding/binary/index.js"
import "@goscript/encoding/binary/index.js"

export class attrs {
	public declare packedData: string

	public _fields: {
		packedData: string
	}

	constructor(init?: Partial<{packedData?: string}>) {
		this._fields = {
			packedData: init?.packedData ?? ("" as string)
		}
	}

	public clone(): attrs {
		return $.markAsStructValue(new attrs(this))
	}

	public decode(): $.Slice<string> {
		const a = this;
		let result: $.Slice<string> = null! as $.Slice<string>
		if ($.stringEqual(a.packedData, "")) {
			return null
		}
		let bytes: $.Slice<number> = $.stringToBytes(a.packedData)
		while ($.len(bytes) > 0) {
			let kn: number = $.uint(4 + $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint32($.goSlice(bytes, undefined, 4)), 32)
			let k = $.bytesToString($.goSlice(bytes, 4, kn))
			bytes = $.goSlice(bytes, kn, undefined)
			let vn: number = $.uint(4 + $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint32($.goSlice(bytes, undefined, 4)), 32)
			let v = $.bytesToString($.goSlice(bytes, 4, vn))
			bytes = $.goSlice(bytes, vn, undefined)
			result = $.append(result, (k + "=") + v)
		}
		return result
	}

	static {
		$.bindStructFields(this.prototype, ["packedData"])
	}

	static __typeInfo = $.registerStructType(
		"main.attrs",
		() => new attrs(),
		() => [{ name: "decode", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string")) }] }],
		attrs,
		() => [{ name: "packedData", key: "packedData", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let a = $.markAsStructValue(new attrs({packedData: "\x01\x00\x00\x00a\x01\x00\x00\x00b"}))
	for (let __goscriptRangeTarget0 = $.markAsStructValue($.cloneStructValue(a)).decode(), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let s = __goscriptRangeTarget0![__rangeIndex]
		await $.println(s)
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on unsafe_string_slice_header.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/reflect/index.js"
import "@goscript/unsafe/index.js"

export class localSliceHeader {
	public declare s: string

	public declare cap: number

	public _fields: {
		s: string
		cap: number
	}

	constructor(init?: Partial<{s?: string, cap?: number}>) {
		this._fields = {
			s: init?.s ?? ("" as string),
			cap: init?.cap ?? (0 as number)
		}
	}

	public clone(): localSliceHeader {
		return $.markAsStructValue(new localSliceHeader(this))
	}

	static {
		$.bindStructFields(this.prototype, ["s", "cap"])
	}

	static __typeInfo = $.registerStructType(
		"main.localSliceHeader",
		() => new localSliceHeader(),
		() => [],
		localSliceHeader,
		() => [/* @__PURE__ */ $.structField("s", /* @__PURE__ */ $.basicType("string"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/unsafe_string_slice_header" }), /* @__PURE__ */ $.structField("cap", /* @__PURE__ */ $.basicType("int"), [1], 16, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/unsafe_string_slice_header" })]
	)
}

export function stringBytes(__goscriptParam0: string): $.Slice<number> {
	let s: $.VarRef<string> = $.varRef(__goscriptParam0)
	let b: $.VarRef<$.Slice<number>> = $.varRef(null! as $.Slice<number>)
	let strh: reflect.StringHeader | $.VarRef<reflect.StringHeader> | null = $.unsafePointerCast<reflect.StringHeader | $.VarRef<reflect.StringHeader> | null>($.stringHeaderRef(s))
	let sh: reflect.SliceHeader | $.VarRef<reflect.SliceHeader> | null = $.unsafePointerCast<reflect.SliceHeader | $.VarRef<reflect.SliceHeader> | null>($.sliceHeaderRef(b))
	$.pointerValue<reflect.SliceHeader>(sh).Data = $.uint($.pointerValue<reflect.StringHeader>(strh).Data, 64)
	$.pointerValue<reflect.SliceHeader>(sh).Len = $.pointerValue<reflect.StringHeader>(strh).Len
	$.pointerValue<reflect.SliceHeader>(sh).Cap = $.pointerValue<reflect.StringHeader>(strh).Len
	return b.value
}

export function localStringBytes(s: string): $.Slice<number> {
	return $.stringToBytes(s)
}

export async function main(): globalThis.Promise<void> {
	let b: $.Slice<number> = stringBytes("abc")
	await $.println($.len(b), $.cap(b), $.uint($.arrayIndex(b!, 0), 8), $.uint($.arrayIndex(b!, 1), 8), $.uint($.arrayIndex(b!, 2), 8))
	let local: $.Slice<number> = localStringBytes("wxyz")
	await $.println($.len(local), $.cap(local), $.uint($.arrayIndex(local!, 0), 8), $.uint($.arrayIndex(local!, 3), 8))
}

if ($.isMainScript(import.meta)) {
	await main()
}

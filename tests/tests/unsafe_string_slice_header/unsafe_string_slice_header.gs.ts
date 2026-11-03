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

	constructor(__goscriptValue?: boolean, s$?: string, cap$?: number) {
		this.s = s$ ?? ""
		this.cap = cap$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): localSliceHeader {
		return new localSliceHeader(true, this.s, this.cap)
	}

	public __goscriptAssign(source: localSliceHeader): this {
		this.s = source.s
		this.cap = source.cap
		return this
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
	let strh = $.unsafePointerCast<reflect.StringHeader | $.VarRef<reflect.StringHeader> | null>($.stringHeaderRef(s))
	let strh$: reflect.StringHeader = strh == null ? $.pointerTarget<reflect.StringHeader>(strh) : (strh as any).__isVarRef === true ? (strh as any).value : (strh as any).__goValue === undefined ? (strh as any) : $.pointerTarget<reflect.StringHeader>(strh)
	let sh = $.unsafePointerCast<reflect.SliceHeader | $.VarRef<reflect.SliceHeader> | null>($.sliceHeaderRef(b))
	let sh$: reflect.SliceHeader = sh == null ? $.pointerTarget<reflect.SliceHeader>(sh) : (sh as any).__isVarRef === true ? (sh as any).value : (sh as any).__goValue === undefined ? (sh as any) : $.pointerTarget<reflect.SliceHeader>(sh);
	;(sh$ as reflect.SliceHeader).Data = (strh$ as reflect.StringHeader).Data;
	;(sh$ as reflect.SliceHeader).Len = (strh$ as reflect.StringHeader).Len;
	;(sh$ as reflect.SliceHeader).Cap = (strh$ as reflect.StringHeader).Len
	return b.value
}

export function localStringBytes(s: string): $.Slice<number> {
	return $.stringToBytes(s)
}

export function arrayStringBytes(__goscriptParam1: string): $.Slice<number> {
	let s: $.VarRef<string> = $.varRef(__goscriptParam1)
	return $.goSlice($.stringToBytes(s.value).subarray(0, 2147418112), undefined, $.stringLen(s.value), $.stringLen(s.value))
}

export async function arrayStringBounds(__goscriptParam2: string): globalThis.Promise<void> {
	let s: $.VarRef<string> = $.varRef(__goscriptParam2)
	const __defer = new $.AsyncDisposableStack()
	try {
		__defer.defer(async () => { await (async () => {
			await $.println("array bounds:", $.recover() != null)
		})() })
		$.goSlice($.stringToBytes(s.value).subarray(0, 2), undefined, $.stringLen(s.value), $.stringLen(s.value))
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export function samePointers(s: $.VarRef<string> | null, b: $.VarRef<$.Slice<number>> | null): [$.VarRef<string> | null, $.VarRef<$.Slice<number>> | null] {
	return [s, b]
}

export async function main(): globalThis.Promise<void> {
	// Read byte views produced from both standard and local string headers.
	let b = stringBytes("abc")
	await $.println($.sliceLen(b), $.cap(b), $.typedSliceIndex(b!, 0), $.typedSliceIndex(b!, 1), $.typedSliceIndex(b!, 2))
	let local = localStringBytes("wxyz")
	await $.println($.sliceLen(local), $.cap(local), $.typedSliceIndex(local!, 0), $.typedSliceIndex(local!, 3))

	// Identity casts retain the original string and slice pointer storage.
	let str = $.varRef("pointer")
	let bytes: $.VarRef<$.Slice<number>> = $.varRef(new Uint8Array([103, 111]))
	let [sp, bp] = samePointers(str, bytes)
	await $.println($.pointerValue<string>(sp), $.sliceLen($.pointerValue<$.Slice<number>>(bp)))

	// The large array declaration does not enlarge the actual string slice.
	let array = arrayStringBytes("array")
	await $.println("array:", $.sliceLen(array), $.cap(array), $.typedSliceIndex(array!, 0), $.typedSliceIndex(array!, 4))
	await arrayStringBounds("array")
}

if ($.isMainScript(import.meta)) {
	await main()
}

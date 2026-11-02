// Generated file based on generic_string_bytes_index.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type text = string

export function first(__typeArgs: $.GenericTypeArgs | undefined, data: any): [number, any] {
	return [$.indexStringOrBytes(data, 0), $.sliceStringOrBytes(data, 1, undefined)]
}

export function sum(__typeArgs: $.GenericTypeArgs | undefined, data: any): number {
	let n = 0
	for (let i = 0; i < $.len(data); i++) {
		n += $.indexStringOrBytes(data, i)
	}
	return n
}

export async function main(): globalThis.Promise<void> {
	let __goscriptTuple0: any = first(__goscriptStatic0(), "abc")
	let b: number = __goscriptTuple0[0]
	let rest: string = (__goscriptTuple0[1] as string)
	await $.println(b, rest, $.stringLen(rest))
	let __goscriptTuple1: any = first(__goscriptStatic1(), new Uint8Array([120, 121, 122]))
	b = __goscriptTuple1[0]
	let bytes: $.Slice<number> = (__goscriptTuple1[1] as $.Slice<number>)
	await $.println(b, $.bytesToString(bytes), $.sliceLen(bytes))
	let __goscriptTuple2: any = first(__goscriptStatic2(), "h\xc3\xa9llo")
	b = __goscriptTuple2[0]
	let named: text = (__goscriptTuple2[1] as text)
	await $.println(b, named, $.stringLen(named))
	await $.println(sum(__goscriptStatic0(), "abc"), sum(__goscriptStatic1(), new Uint8Array([1, 2, 3]) as $.Slice<number>), sum(__goscriptStatic2(), "\xc3\xa9"))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), zero: () => null }})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string", "main.text"), zero: () => "" }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

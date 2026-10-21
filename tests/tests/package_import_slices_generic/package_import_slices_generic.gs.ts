// Generated file based on package_import_slices_generic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as slices from "@goscript/slices/index.js"

export function grow<T>(__typeArgs: $.GenericTypeArgs | undefined, n: number): $.Slice<T> {
	return (slices.Grow(null, n, () => ($.genericZero(__typeArgs, "T", null) as T)) as $.Slice<T>)
}

export function siblings<T>(__typeArgs: $.GenericTypeArgs | undefined, value: any): $.Slice<T> {
	let values: $.Slice<T> = (slices.Insert(null, 0, $.copyElement(value)) as $.Slice<T>)
	values = (slices.Delete(values, 0, 1, () => ($.genericZero(__typeArgs, "T", null) as T)) as $.Slice<T>)
	return (slices.Concat(values, $.arrayToSlice<T>([$.copyElement(value)])) as $.Slice<T>)
}

export async function main(): globalThis.Promise<void> {
	let grown = (grow(__goscriptStatic0(), 3) as $.Slice<number>)
	await $.println("grow:", $.sliceLen(grown), $.cap(grown))

	let values = (siblings(__goscriptStatic0(), 7) as $.Slice<number>)
	await $.println("siblings:", $.sliceLen(values), $.arrayIndex(values!, 0))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

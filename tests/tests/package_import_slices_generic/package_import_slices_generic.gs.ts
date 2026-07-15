// Generated file based on package_import_slices_generic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"
import "@goscript/slices/index.js"

export function grow<T>(__typeArgs: $.GenericTypeArgs | undefined, n: number): $.Slice<T> {
	return (slices.Grow(null, n, () => ($.genericZero(__typeArgs, "T", null) as T)) as $.Slice<T>)
}

export function siblings<T>(__typeArgs: $.GenericTypeArgs | undefined, value: any): $.Slice<T> {
	let values: $.Slice<T> = (slices.Insert(null, 0, value) as $.Slice<T>)
	values = (slices.Delete(values, 0, 1) as $.Slice<T>)
	return (slices.Concat(values, $.arrayToSlice<T>([value])) as $.Slice<T>)
}

export async function main(): globalThis.Promise<void> {
	let grown: $.Slice<number> = (grow({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, 3) as $.Slice<number>)
	$.println("grow:", $.len(grown), $.cap(grown))

	let values: $.Slice<number> = (siblings({T: { type: { kind: $.TypeKind.Basic, name: "int" }, zero: () => 0 }}, 7) as $.Slice<number>)
	$.println("siblings:", $.len(values), $.arrayIndex(values!, 0))
}

if ($.isMainScript(import.meta)) {
	await main()
}

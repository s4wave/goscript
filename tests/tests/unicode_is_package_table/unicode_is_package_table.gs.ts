// Generated file based on unicode_is_package_table.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unicode from "@goscript/unicode/index.js"
import "@goscript/unicode/index.js"

export let vowels: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = new unicode.RangeTable({R16: $.arrayToSlice<unicode.Range16>([$.markAsStructValue(new unicode.Range16({Lo: 97, Hi: 97, Stride: 1})), $.markAsStructValue(new unicode.Range16({Lo: 101, Hi: 101, Stride: 1})), $.markAsStructValue(new unicode.Range16({Lo: 105, Hi: 105, Stride: 1}))])})

export function __goscript_set_vowels(__goscriptValue: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null): void {
	vowels = __goscriptValue
}

export let digits: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = new unicode.RangeTable({R16: $.arrayToSlice<unicode.Range16>([$.markAsStructValue(new unicode.Range16({Lo: 48, Hi: 57, Stride: 1}))])})

export function __goscript_set_digits(__goscriptValue: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null): void {
	digits = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	let local: unicode.RangeTable | $.VarRef<unicode.RangeTable> | null = new unicode.RangeTable({R16: $.arrayToSlice<unicode.Range16>([$.markAsStructValue(new unicode.Range16({Lo: 120, Hi: 122, Stride: 1}))])})
	await $.println(unicode.Is(vowels, 101), unicode.Is(vowels, 122), unicode.Is(local, 121))
	await $.println(unicode.In(55, vowels, digits), unicode.In(113, vowels, digits))
	await $.println(unicode.IsOneOf($.arrayToSlice<unicode.RangeTable | $.VarRef<unicode.RangeTable> | null>([vowels, local]), 122))
}

if ($.isMainScript(import.meta)) {
	await main()
}

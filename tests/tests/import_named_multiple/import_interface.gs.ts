// Generated file based on import_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strings from "@goscript/strings/index.js"

import * as foo_bar from "@goscript/strings/index.js"

import * as baz from "@goscript/strings/index.js"
import "@goscript/strings/index.js"

export async function main(): globalThis.Promise<void> {
	// Test named imports with same package name
	let result1 = foo_bar.ToUpper("hello")
	let result2 = strings.ToLower("WORLD")
	let result3: $.Slice<string> = baz.Split("a,b,c", ",")

	await $.println("foo_bar.ToUpper:", result1)
	await $.println("strings.ToLower:", result2)
	await $.println("baz.Split length:", $.len(result3))
	await $.println("baz.Count:", baz.Count("a,b,c", ","))
	for (let __goscriptRangeTarget0 = result3, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let v = __goscriptRangeTarget0![i]
		await $.println("baz.Split[", i, "]:", v)
	}

	// Test the rest of the "strings" package
	await $.println("strings.Count:", strings.Count("a,b,c", ","))
	await $.println("strings.Split:", strings.Split("a,b,c", ","))
	await $.println("strings.Join:", strings.Join($.arrayToSlice<string>(["a", "b", "c"]), ","))
	await $.println("strings.Replace:", strings.Replace("a,b,c", "b", "d", 1))
	await $.println("strings.ReplaceAll:", strings.ReplaceAll("a,b,c", "b", "d"))
	await $.println("strings.ToLower:", strings.ToLower("HELLO"))
	await $.println("strings.ToUpper:", strings.ToUpper("hello"))
	await $.println("strings.Trim:", strings.Trim("  hello  ", " "))
	await $.println("strings.TrimSpace:", strings.TrimSpace("  hello  "))
	await $.println("strings.TrimPrefix:", strings.TrimPrefix("hello", "he"))
	await $.println("strings.TrimSuffix:", strings.TrimSuffix("hello", "lo"))
	await $.println("strings.TrimLeft:", strings.TrimLeft("hello", "he"))
	await $.println("strings.TrimRight:", strings.TrimRight("hello", "lo"))
	await $.println("strings.Contains:", strings.Contains("hello", "lo"))
	await $.println("strings.ContainsAny:", strings.ContainsAny("hello", "lo"))
	await $.println("strings.EqualFold:", strings.EqualFold("hello", "HELLO"))
	await $.println("strings.Fields:", strings.Fields("hello world"))
	await $.println("strings.FieldsFunc:", strings.FieldsFunc("hello world", $.functionValue((r: number): boolean => {
		return $.int(r, 32) == $.int(32, 32)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int32" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))))
	await $.println("strings.HasPrefix:", strings.HasPrefix("hello", "he"))
	await $.println("strings.HasSuffix:", strings.HasSuffix("hello", "lo"))
}

if ($.isMainScript(import.meta)) {
	await main()
}

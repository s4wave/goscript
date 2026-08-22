// Generated file based on variadic_interface_param.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function testVariadicInterface(name: string, values: $.Slice<any>): globalThis.Promise<void> {
	await $.println("Name:", name)
	await $.println("Values count:", $.len(values))
	for (let __goscriptRangeTarget0 = values, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let v = __goscriptRangeTarget0![i]
		// We can't do much with interface{} values in the compiled output
		// but we can at least check they're passed correctly
		if (v != null) {
			await $.println("Value", i, "is not nil")
		} else {
			await $.println("Value", i, "is nil")
		}
	}
}

export async function main(): globalThis.Promise<void> {
	// Test with various argument types
	await testVariadicInterface("test1", $.arrayToSlice<any>(["hello", $.basicInterfaceValue(42, "int"), true]))
	await testVariadicInterface("test2", $.arrayToSlice<any>([null, "world"]))
	await testVariadicInterface("test3", null)

	// Test with slice expansion
	let values: $.Slice<any> = $.arrayToSlice<any>(["a", "b", "c"])
	await testVariadicInterface("test4", values)
}

if ($.isMainScript(import.meta)) {
	await main()
}

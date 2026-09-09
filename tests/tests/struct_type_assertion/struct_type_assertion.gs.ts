// Generated file based on struct_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let i: any = {Name: "Alice", Number: 8005553424}

	let [s, ok] = $.typeAssertTuple<{"Name": string, "Number": number}>(i, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true), /* @__PURE__ */ $.structField("Number", /* @__PURE__ */ $.basicType("int"), [1], 16, true)] })
	if (ok) {
		await $.println("Name:", s.Name, "Number:", s.Number)
	} else {
		await $.println("Type assertion failed")
	}

	let [j, ok2] = $.typeAssertTuple<{"Age": number}>(i, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Age", /* @__PURE__ */ $.basicType("int"), [0], 0, true)] })
	if (ok2) {
		await $.println("Age:", j.Age)
	} else {
		await $.println("Second type assertion failed as expected")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

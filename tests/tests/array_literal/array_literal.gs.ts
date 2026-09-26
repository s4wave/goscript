// Generated file based on array_literal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// Test basic array literal
	let a: number[] = $.arrayValue([1, 2, 3])
	await $.println($.arrayIndex(a, 0), $.arrayIndex(a, 1), $.arrayIndex(a, 2))

	// Test array literal with inferred length
	let b = $.arrayValue(["hello", "world"])
	await $.println($.arrayIndex(b, 0), $.arrayIndex(b, 1))

	// Test array literal with specific element initialization
	let c = $.arrayValue([0, 10, 0, 30, 0])
	await $.println($.arrayIndex(c, 0), $.arrayIndex(c, 1), $.arrayIndex(c, 2), $.arrayIndex(c, 3), $.arrayIndex(c, 4))

	// Test empty byte array literal
	let d = $.arrayValue(new Uint8Array(4))
	await $.println(4, $.uint($.arrayIndex(d, 0), 8), $.uint($.arrayIndex(d, 3), 8))

	// Empty struct-array elements and repeated literals retain independent values.
	let e = $.arrayValue(Array.from({ length: 4096 }, () => $.anonymousStructValue({"value": 0}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/array_literal" })] })), /* @__PURE__ */ $.arrayType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/array_literal" })] }, 4096))
	let f = $.arrayValue(Array.from({ length: 4096 }, () => $.anonymousStructValue({"value": 0}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/array_literal" })] })), /* @__PURE__ */ $.arrayType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("value", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/array_literal" })] }, 4096))
	$.arrayIndex(e, 0).value = 7
	$.arrayIndex(e, 4095).value = 9
	await $.println(4096, $.arrayIndex(e, 0).value, $.arrayIndex(e, 1).value, $.arrayIndex(e, 4095).value, $.arrayIndex(f, 0).value)

	// Nested arrays allocate separate inner arrays for each element.
	let g = $.arrayValue(Array.from({ length: 2 }, () => $.arrayValue(Array.from({ length: 3 }, () => 0))), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3), 2))
	$.arrayIndex(g, 0)[1] = 11
	await $.println($.arrayIndex($.arrayIndex(g, 0), 1), $.arrayIndex($.arrayIndex(g, 1), 1))
}

if ($.isMainScript(import.meta)) {
	await main()
}

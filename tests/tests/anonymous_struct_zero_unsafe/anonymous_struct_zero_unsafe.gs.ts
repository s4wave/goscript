// Generated file based on anonymous_struct_zero_unsafe.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export let linkinfo: {"Magic": Uint8Array, "Self": number, "Sects": {"Start": any, "End": any}[]} = $.anonymousStructValue({"Magic": $.arrayValue(new Uint8Array(2)), "Self": 0, "Sects": $.arrayValue(Array.from({ length: 1 }, () => $.anonymousStructValue({"Start": null, "End": null}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Start", /* @__PURE__ */ $.basicType("unknown"), [0], 0, true), /* @__PURE__ */ $.structField("End", /* @__PURE__ */ $.basicType("unknown"), [1], 8, true)] })), /* @__PURE__ */ $.arrayType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Start", /* @__PURE__ */ $.basicType("unknown"), [0], 0, true), /* @__PURE__ */ $.structField("End", /* @__PURE__ */ $.basicType("unknown"), [1], 8, true)] }, 1))}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Magic", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2), [0], 0, true), /* @__PURE__ */ $.structField("Self", /* @__PURE__ */ $.basicType("uintptr"), [1], 8, true), /* @__PURE__ */ $.structField("Sects", /* @__PURE__ */ $.arrayType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Start", /* @__PURE__ */ $.basicType("unknown"), [0], 0, true), /* @__PURE__ */ $.structField("End", /* @__PURE__ */ $.basicType("unknown"), [1], 8, true)] }, 1), [2], 16, true)] })

export function __goscript_set_linkinfo(__goscriptValue: {"Magic": Uint8Array, "Self": number, "Sects": {"Start": any, "End": any}[]}): void {
	$.assignStruct(linkinfo, __goscriptValue)
}

export async function main(): globalThis.Promise<void> {
	await $.println("magic len:", 2)
	await $.println("magic zero:", $.uint($.arrayIndex(linkinfo.Magic, 0), 8))
	await $.println("sects len:", 1)
	await $.println("pointer diff:", $.uint($.uint($.uint64Sub(($.arrayIndex(linkinfo.Sects, 0).End as any), ($.arrayIndex(linkinfo.Sects, 0).Start as any)), 64), 64))
	await $.println("start nil:", $.arrayIndex(linkinfo.Sects, 0).Start == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}

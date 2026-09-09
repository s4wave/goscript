// Generated file based on net_http_header_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as http from "@goscript/net/http/index.js"
import "@goscript/fmt/index.js"
import "@goscript/net/http/index.js"

export async function main(): globalThis.Promise<void> {
	let header: http.Header = $.makeMap<string, $.Slice<string>>([["X-Test", $.arrayToSlice<string>(["ok"])]])
	if (!$.stringEqual(await http.Header_Get(header, "x-test"), "ok")) {
		$.panic("missing header")
	}
	await fmt.Sprint($.namedValueInterfaceValue<any>(header, "http.Header", {Add: (receiver: any, ...args: any[]) => (http.Header_Add as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Clone: (receiver: any, ...args: any[]) => (http.Header_Clone as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Del: (receiver: any, ...args: any[]) => (http.Header_Del as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Get: (receiver: any, ...args: any[]) => (http.Header_Get as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => (http.Header_Set as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Values: (receiver: any, ...args: any[]) => (http.Header_Values as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Write: (receiver: any, ...args: any[]) => (http.Header_Write as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), WriteSubset: (receiver: any, ...args: any[]) => (http.Header_WriteSubset as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), get: (receiver: any, ...args: any[]) => (http.Header__get as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), has: (receiver: any, ...args: any[]) => (http.Header_has as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), sortedKeyValues: (receiver: any, ...args: any[]) => (http.Header_sortedKeyValues as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), write: (receiver: any, ...args: any[]) => (http.Header_write as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), writeSubset: (receiver: any, ...args: any[]) => (http.Header_writeSubset as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, "http.Header", [$.methodSignature("Add", [["key", /* @__PURE__ */ $.basicType("string")], ["value", /* @__PURE__ */ $.basicType("string")]]), $.methodSignature("Clone", [], ["http.Header"]), $.methodSignature("Del", [["key", /* @__PURE__ */ $.basicType("string")]]), $.methodSignature("Get", [["key", /* @__PURE__ */ $.basicType("string")]], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Set", [["key", /* @__PURE__ */ $.basicType("string")], ["value", /* @__PURE__ */ $.basicType("string")]]), $.methodSignature("Values", [["key", /* @__PURE__ */ $.basicType("string")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))]), $.methodSignature("Write", [["w", "io.Writer"]], ["error"]), $.methodSignature("WriteSubset", [["w", "io.Writer"], ["exclude", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("bool"))]], ["error"]), $.methodSignature("get", [["key", /* @__PURE__ */ $.basicType("string")]], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("has", [["key", /* @__PURE__ */ $.basicType("string")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("sortedKeyValues", [["exclude", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("bool"))]], [["kvs", /* @__PURE__ */ $.sliceType("http.keyValues")], ["hs", /* @__PURE__ */ $.pointerType("http.headerSorter")]]), $.methodSignature("write", [["w", "io.Writer"], ["trace", /* @__PURE__ */ $.pointerType("httptrace.ClientTrace")]], ["error"]), $.methodSignature("writeSubset", [["w", "io.Writer"], ["exclude", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("bool"))], ["trace", /* @__PURE__ */ $.pointerType("httptrace.ClientTrace")]], ["error"])]))
	await $.println("ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}

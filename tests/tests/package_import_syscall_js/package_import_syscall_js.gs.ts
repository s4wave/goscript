// Generated file based on package_import_syscall_js.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as js from "@goscript/syscall/js/index.js"
import "@goscript/syscall/js/index.js"

export async function main(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	let global = $.markAsStructValue($.cloneStructValue(js.Global()))
	$.markAsStructValue($.cloneStructValue(global)).Set("__GOSCRIPT_JS_TEST__", $.interfaceValue($.markAsStructValue($.cloneStructValue(js.ValueOf($.interfaceValue(new globalThis.Map<string, any>([["name", "goscript"], ["nums", $.interfaceValue($.arrayToSlice<any>([$.basicInterfaceValue(1, "int"), $.basicInterfaceValue(2, "int"), $.basicInterfaceValue(3, "int")]), "[]any", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } })]]), "map[string]any", { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Interface, methods: [] } })))), "js.Value", "js.Value"))
	let obj = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(global)).Get("__GOSCRIPT_JS_TEST__")))
	$.println("type:", js.Type_String($.markAsStructValue($.cloneStructValue(obj)).Type()))
	$.println("name:", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(obj)).Get("name"))).String())
	$.println("length:", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(obj)).Get("nums"))).Length())

	let cb = $.markAsStructValue($.cloneStructValue(js.FuncOf($.functionValue((_this: js.Value, args: $.Slice<js.Value>): any => {
		return $.basicInterfaceValue($.markAsStructValue($.cloneStructValue($.arrayIndex(args!, 0))).Int() + 1, "int")
	}, ({ kind: $.TypeKind.Function, params: ["js.Value", { kind: $.TypeKind.Slice, elemType: "js.Value" }], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo)))))
	__defer.defer(() => { $.markAsStructValue($.cloneStructValue(cb)).Release() })
	$.println("callback:", $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(cb)).Invoke($.basicInterfaceValue(41, "int")))).Int())

	let bytes = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(global)).Get("Uint8Array"))).New($.basicInterfaceValue(3, "int"))))
	$.markAsStructValue($.cloneStructValue(bytes)).SetIndex(0, $.basicInterfaceValue(65, "int"))
	$.markAsStructValue($.cloneStructValue(bytes)).SetIndex(1, $.basicInterfaceValue(66, "int"))
	$.markAsStructValue($.cloneStructValue(bytes)).SetIndex(2, $.basicInterfaceValue(67, "int"))
	let dst: $.Slice<number> = $.makeSlice<number>(3, undefined, "byte")
	js.CopyBytesToGo(dst, $.markAsStructValue($.cloneStructValue(bytes)))
	$.println("bytes:", $.bytesToString(dst))
}

if ($.isMainScript(import.meta)) {
	await main()
}

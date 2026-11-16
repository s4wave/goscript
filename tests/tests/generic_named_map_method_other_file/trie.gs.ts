// Generated file based on trie.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type trie = globalThis.Map<number, any> | null

export type names = globalThis.Map<string, number> | null

$.registerNamedType("main.names", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")));

$.registerNamedValueType(
	"main.names",
	{add: (receiver: any, ...args: any[]) => (names_add as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))},
	[$.methodSignature("add", [["name", /* @__PURE__ */ $.basicType("string")]], [/* @__PURE__ */ $.basicType("int")])]
);

$.registerNamedValueType(
	"*main.names",
	{add: (receiver: any, ...args: any[]) => (names_add as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args))},
	[$.methodSignature("add", [["name", /* @__PURE__ */ $.basicType("string")]], [/* @__PURE__ */ $.basicType("int")])]
);

export function trie_insert(tr: trie, __typeArgs: $.GenericTypeArgs | undefined, key: number, val: any): [any, number] {
	{
		let [old, ok] = $.mapGet<number, any, any>(tr, key, null)
		if (ok) {
			return [$.copyElement(old), $.len(tr)]
		}
	}
	$.mapSet(tr, key, $.copyElement(val))
	let zero: any = $.genericZero(__typeArgs, "V", null)
	return [$.copyElement(zero), $.len(tr)]
}

export function names_add(n: names, name: string): number {
	const __goscriptMap0 = n
	const __goscriptMapKey0 = name
	$.mapSet(__goscriptMap0, __goscriptMapKey0, $.mapGet<string, number, number>(__goscriptMap0, __goscriptMapKey0, 0)[0] + 1)
	return $.mapGet<string, number, number>(n, name, 0)[0]
}

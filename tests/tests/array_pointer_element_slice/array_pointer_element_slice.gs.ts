// Generated file based on array_pointer_element_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class node {
	public declare sub: $.Slice<node | $.VarRef<node> | null>

	public declare sub0: (node | $.VarRef<node> | null)[]

	constructor(__goscriptValue?: boolean, sub$?: $.Slice<node | $.VarRef<node> | null>, sub0$?: (node | $.VarRef<node> | null)[]) {
		this.sub = sub$ ?? (null! as $.Slice<node | $.VarRef<node> | null>)
		this.sub0 = sub0$ ?? $.arrayValue(globalThis.Array.from({ length: 1 }, () => null))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): node {
		return new node(true, this.sub, $.cloneArrayValue(this.sub0, __goscriptStatic0()))
	}

	public __goscriptAssign(source: node): this {
		this.sub = source.sub
		this.sub0 = $.assignFieldValue(this.sub0, source.sub0, __goscriptStatic0())
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.node",
		() => new node(),
		() => [],
		node,
		() => [{ name: "sub", key: "sub", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.node")) }, { name: "sub0", key: "sub0", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.pointerType("main.node"), 1) }]
	)
}

export async function main(): globalThis.Promise<void> {
	let root = new node()
	let root$: node = root == null ? $.pointerTarget<node>(root) : (root as any).__isVarRef === true ? (root as any).value : (root as any).__goValue === undefined ? (root as any) : $.pointerTarget<node>(root)
	let child = new node();
	;(root$ as node).sub = $.appendOne($.goSlice((root$ as node).sub0, undefined, 0), child, $.appendZeros.nil)

	await $.println($.sliceLen((root$ as node).sub), ($.arrayIndex((root$ as node).sub!, 0) === child || ($.pointerAliasesMade || ($.arrayIndex((root$ as node).sub!, 0) as any)?.__goElementBacking !== undefined) && $.pointerEqual($.arrayIndex((root$ as node).sub!, 0), child)))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.pointerType("main.node"), 1))
}

if ($.isMainScript(import.meta)) {
	await main()
}

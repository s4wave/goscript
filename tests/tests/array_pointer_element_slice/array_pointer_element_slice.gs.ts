// Generated file based on array_pointer_element_slice.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class node {
	public declare sub: $.Slice<node | $.VarRef<node> | null>

	public declare sub0: (node | $.VarRef<node> | null)[]

	public _fields: {
		sub: $.Slice<node | $.VarRef<node> | null>
		sub0: (node | $.VarRef<node> | null)[]
	}

	constructor(init?: Partial<{sub?: $.Slice<node | $.VarRef<node> | null>, sub0?: (node | $.VarRef<node> | null)[]}>) {
		this._fields = {
			sub: init?.sub ?? (null! as $.Slice<node | $.VarRef<node> | null>),
			sub0: init?.sub0 !== undefined ? $.cloneArrayValue(init.sub0, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.pointerType("main.node"), 1)) : Array.from({ length: 1 }, () => null)
		}
	}

	public clone(): node {
		return $.markAsStructValue(new node(this))
	}

	static {
		$.bindStructFields(this.prototype, ["sub", "sub0"])
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
	let root: node | $.VarRef<node> | null = new node()
	let child: node | $.VarRef<node> | null = new node()
	$.pointerValue<node>(root).sub = $.append($.goSlice($.pointerValue<node>(root).sub0, undefined, 0), child, $.appendZeros.nil)

	await $.println($.len($.pointerValue<node>(root).sub), $.pointerEqual($.arrayIndex($.pointerValue<node>(root).sub!, 0), child))
}

if ($.isMainScript(import.meta)) {
	await main()
}

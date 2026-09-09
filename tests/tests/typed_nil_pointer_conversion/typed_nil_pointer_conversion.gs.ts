// Generated file based on typed_nil_pointer_conversion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class node {
	public declare next: node | $.VarRef<node> | null

	public _fields: {
		next: node | $.VarRef<node> | null
	}

	constructor(init?: Partial<{next?: node | $.VarRef<node> | null}>) {
		this._fields = {
			next: init?.next ?? (null! as node | $.VarRef<node> | null)
		}
	}

	public clone(): node {
		return $.markAsStructValue(new node(this))
	}

	static {
		$.bindStructFields(this.prototype, ["next"])
	}

	static __typeInfo = $.registerStructType(
		"main.node",
		() => new node(),
		() => [],
		node,
		() => [{ name: "next", key: "next", type: /* @__PURE__ */ $.pointerType("main.node") }]
	)
}

export function clone(n: node | $.VarRef<node> | null): node | $.VarRef<node> | null {
	if (n == null) {
		return null
	}
	return new node({next: $.pointerValue<node>(n).next})
}

export async function main(): globalThis.Promise<void> {
	let n: node | $.VarRef<node> | null = null! as node | $.VarRef<node> | null
	let cloned: node | $.VarRef<node> | null = clone(n)
	await $.println(cloned == null)

	let boxed: any = $.interfaceValue(null, "*main.node", /* @__PURE__ */ $.pointerType("main.node"))
	let [, ok] = $.typeAssertTuple<node | $.VarRef<node> | null>(boxed, /* @__PURE__ */ $.pointerType("main.node"))
	await $.println(boxed == null, ok)
}

if ($.isMainScript(import.meta)) {
	await main()
}

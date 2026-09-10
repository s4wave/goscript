// Generated file based on nil_pointer_receiver_field_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class child {
	public declare value: string

	public _fields: {
		value: string
	}

	constructor(init?: Partial<{value?: string}>) {
		this._fields = {
			value: init?.value ?? ("" as string)
		}
	}

	public clone(): child {
		return $.markAsStructValue(new child(this))
	}

	public Clone(): child | $.VarRef<child> | null {
		const c: child | $.VarRef<child> | null = this;
		if (c == null) {
			return null
		}
		return new child({value: $.pointerValue<child>(c).value})
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.child",
		() => new child(),
		() => [{ name: "Clone", args: [], returns: [{ type: /* @__PURE__ */ $.pointerType("main.child") }] }],
		child,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class parent {
	public declare child: child | $.VarRef<child> | null

	public _fields: {
		child: child | $.VarRef<child> | null
	}

	constructor(init?: Partial<{child?: child | $.VarRef<child> | null}>) {
		this._fields = {
			child: init?.child ?? (null! as child | $.VarRef<child> | null)
		}
	}

	public clone(): parent {
		return $.markAsStructValue(new parent(this))
	}

	static {
		$.bindStructFields(this.prototype, ["child"])
	}

	static __typeInfo = $.registerStructType(
		"main.parent",
		() => new parent(),
		() => [],
		parent,
		() => [{ name: "child", key: "child", type: /* @__PURE__ */ $.pointerType("main.child") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let p: parent = $.markAsStructValue(new parent())
	if (child.prototype.Clone.call(p.child) == null) {
		await $.println("nil clone")
	}
	p.child = new child({value: "ok"})
	await $.println($.pointerValue<child>(child.prototype.Clone.call(p.child)).value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

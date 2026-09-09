// Generated file based on defined_external_struct_wrapper.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/defined_external_struct_wrapper/dep/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/defined_external_struct_wrapper/dep/index.js"

export class Wrapped {
	public declare Value: string

	public declare Hidden: dep.hidden

	public _fields: {
		Value: string
		Hidden: dep.hidden
	}

	constructor(init?: Partial<{Value?: string, Hidden?: dep.hidden}>) {
		this._fields = {
			Value: init?.Value ?? ("" as string),
			Hidden: init?.Hidden ? $.markAsStructValue($.cloneStructValue(init.Hidden)) : $.markAsStructValue(new dep.hidden())
		}
	}

	public clone(): Wrapped {
		return $.markAsStructValue(new Wrapped(this))
	}

	public ["public"](): dep.Public | $.VarRef<dep.Public> | null {
		const w: Wrapped | $.VarRef<Wrapped> | null = this
		return $.unsafePointerCast<dep.Public | $.VarRef<dep.Public> | null>(w, dep.Public)
	}

	static {
		$.bindStructFields(this.prototype, ["Value", "Hidden"])
	}

	static __typeInfo = $.registerStructType(
		"main.Wrapped",
		() => new Wrapped(),
		() => [{ name: "public", args: [], returns: [{ type: /* @__PURE__ */ $.pointerType("dep.Public") }] }],
		Wrapped,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("string") }, { name: "Hidden", key: "Hidden", type: "dep.hidden" }]
	)
}

export function wrap(p: dep.Public | $.VarRef<dep.Public> | null): Wrapped | $.VarRef<Wrapped> | null {
	return $.unsafePointerCast<Wrapped | $.VarRef<Wrapped> | null>(p, Wrapped)
}

export async function main(): globalThis.Promise<void> {
	await $.println("ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}

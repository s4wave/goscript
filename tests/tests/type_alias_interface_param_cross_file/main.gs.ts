// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/type_alias_interface_param_cross_file/dep/index.js"

import * as __goscript_types from "./types.gs.ts"
import "@goscript/github.com/s4wave/goscript/tests/tests/type_alias_interface_param_cross_file/dep/index.js"
import "./types.gs.ts"

export class sink {
	public declare size: number

	public _fields: {
		size: number
	}

	constructor(init?: Partial<{size?: number}>) {
		this._fields = {
			size: init?.size ?? (0 as number)
		}
	}

	public clone(): sink {
		return $.markAsStructValue(new sink(this))
	}

	public Put(v: __goscript_types.Value): void {
		let s: sink | $.VarRef<sink> | null = this;
		$.pointerValue<sink>(s).size = $.len((v as __goscript_types.Value))
	}

	static {
		$.bindStructFields(this.prototype, ["size"])
	}

	static __typeInfo = $.registerStructType(
		"main.sink",
		() => new sink(),
		() => [{ name: "Put", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		sink,
		() => [{ name: "size", key: "size", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function write(tx: __goscript_types.Tx | null, v: dep.Value): globalThis.Promise<void> {
	await $.pointerValue<Exclude<__goscript_types.Tx, null>>(tx).Put((v as __goscript_types.Value))
}

export async function main(): globalThis.Promise<void> {
	let s: sink | $.VarRef<sink> | null = new sink()
	await write($.interfaceValue<__goscript_types.Tx | null>(s, "*main.sink", /* @__PURE__ */ $.pointerType("main.sink")), (new Uint8Array([1, 2, 3]) as $.Slice<number> as dep.Value))
	await $.println("size:", $.pointerValue<sink>(s).size)
}

if ($.isMainScript(import.meta)) {
	await main()
}

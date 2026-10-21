// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import type * as io from "@goscript/io/index.js"
import * as __goscript_server from "./server.gs.ts"
import "./handler.gs.ts"
import "./invoker.gs.ts"
import "./stream.gs.ts"

export class localReadWriteCloser {
	constructor(__goscriptValue?: boolean) {
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): localReadWriteCloser {
		return new localReadWriteCloser(true)
	}

	public __goscriptAssign(source: localReadWriteCloser): this {
		return this
	}

	public Close(): $.GoError {
		return null
	}

	public Read(_p0: $.Slice<number>): [number, $.GoError] {
		return [0, null]
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		return [$.sliceLen(p), null]
	}

	static __typeInfo = $.registerStructType(
		"main.localReadWriteCloser",
		() => new localReadWriteCloser(),
		() => [{ name: "Close", args: [], returns: [{ type: "error" }], pointerReceiver: true }, { name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }], pointerReceiver: true }, { name: "Write", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }], pointerReceiver: true }],
		localReadWriteCloser,
		() => []
	)
}

export async function main(): globalThis.Promise<void> {
	let server = new __goscript_server.Server()
	await __goscript_server.Server.prototype.Handle.call(server, $.interfaceValue<io.ReadWriteCloser | null>(new localReadWriteCloser(), "*main.localReadWriteCloser", /* @__PURE__ */ $.pointerType("main.localReadWriteCloser")))
	await $.println("ok")
}

if ($.isMainScript(import.meta)) {
	await main()
}

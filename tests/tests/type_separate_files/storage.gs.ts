// Generated file based on storage.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_memory from "./memory.gs.ts"
import "./memory.gs.ts"

export class storage {
	public declare files: globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null

	public declare children: globalThis.Map<string, globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null

	public _fields: {
		files: globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null
		children: globalThis.Map<string, globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null
	}

	constructor(init?: Partial<{files?: globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null, children?: globalThis.Map<string, globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null}>) {
		this._fields = {
			files: init?.files ?? (null! as globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null),
			children: init?.children ?? (null! as globalThis.Map<string, globalThis.Map<string, __goscript_memory.file | $.VarRef<__goscript_memory.file> | null> | null> | null)
		}
	}

	public clone(): storage {
		return $.markAsStructValue(new storage(this))
	}

	static {
		$.bindStructFields(this.prototype, ["files", "children"])
	}

	static __typeInfo = $.registerStructType(
		"main.storage",
		() => new storage(),
		() => [],
		storage,
		() => [{ name: "files", key: "files", type: /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.pointerType("main.file")) }, { name: "children", key: "children", type: /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.pointerType("main.file"))) }]
	)
}

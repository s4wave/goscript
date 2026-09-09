// Generated file based on type_missing_imports.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class file {
	public declare name: string

	public declare data: $.Slice<number>

	public _fields: {
		name: string
		data: $.Slice<number>
	}

	constructor(init?: Partial<{name?: string, data?: $.Slice<number>}>) {
		this._fields = {
			name: init?.name ?? ("" as string),
			data: init?.data ?? (null! as $.Slice<number>)
		}
	}

	public clone(): file {
		return $.markAsStructValue(new file(this))
	}

	static {
		$.bindStructFields(this.prototype, ["name", "data"])
	}

	static __typeInfo = $.registerStructType(
		"main.file",
		() => new file(),
		() => [],
		file,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }, { name: "data", key: "data", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }]
	)
}

export class storage {
	public declare files: globalThis.Map<string, file | $.VarRef<file> | null> | null

	public declare children: globalThis.Map<string, globalThis.Map<string, file | $.VarRef<file> | null> | null> | null

	public _fields: {
		files: globalThis.Map<string, file | $.VarRef<file> | null> | null
		children: globalThis.Map<string, globalThis.Map<string, file | $.VarRef<file> | null> | null> | null
	}

	constructor(init?: Partial<{files?: globalThis.Map<string, file | $.VarRef<file> | null> | null, children?: globalThis.Map<string, globalThis.Map<string, file | $.VarRef<file> | null> | null> | null}>) {
		this._fields = {
			files: init?.files ?? (null! as globalThis.Map<string, file | $.VarRef<file> | null> | null),
			children: init?.children ?? (null! as globalThis.Map<string, globalThis.Map<string, file | $.VarRef<file> | null> | null> | null)
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

export async function main(): globalThis.Promise<void> {
	let s = $.markAsStructValue(new storage({files: $.makeMap<string, file | $.VarRef<file> | null>(), children: $.makeMap<string, globalThis.Map<string, file | $.VarRef<file> | null> | null>()}))

	let f: file | $.VarRef<file> | null = new file({name: "test.txt", data: new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100])})

	$.mapSet(s.files, "test", f)

	await $.println("Created storage with file:", $.pointerValue<file>($.mapGet<string, file | $.VarRef<file> | null, file | $.VarRef<file> | null>(s.files, "test", null)[0]).name)
}

if ($.isMainScript(import.meta)) {
	await main()
}

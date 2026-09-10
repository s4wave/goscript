// Generated file based on package_import_io_fs_readdir_varref.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as fstest from "@goscript/testing/fstest/index.js"
import "@goscript/io/fs/index.js"
import "@goscript/testing/fstest/index.js"

export class openOnlyFS {
	public declare fsys: fstest.MapFS

	public _fields: {
		fsys: fstest.MapFS
	}

	constructor(init?: Partial<{fsys?: fstest.MapFS}>) {
		this._fields = {
			fsys: init?.fsys ?? (null! as fstest.MapFS)
		}
	}

	public clone(): openOnlyFS {
		return $.markAsStructValue(new openOnlyFS(this))
	}

	public async Open(name: string): globalThis.Promise<[fs.File | null, $.GoError]> {
		const o = this;
		return fstest.MapFS_Open(o.fsys, name)
	}

	static {
		$.bindStructFields(this.prototype, ["fsys"])
	}

	static __typeInfo = $.registerStructType(
		"main.openOnlyFS",
		() => new openOnlyFS(),
		() => [{ name: "Open", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "fs.File" }, { type: "error" }] }],
		openOnlyFS,
		() => [{ name: "fsys", key: "fsys", type: "fstest.MapFS" }]
	)
}

export async function main(): globalThis.Promise<void> {
	let fsys: fstest.MapFS = $.makeMap<string, fstest.MapFile | $.VarRef<fstest.MapFile> | null>([["b.txt", new fstest.MapFile({Data: new Uint8Array([98])})], ["a.txt", new fstest.MapFile({Data: new Uint8Array([97])})], ["dir/nested.txt", new fstest.MapFile({Data: new Uint8Array([110, 101, 115, 116, 101, 100])})]])

	let __goscriptTuple0: any = await fs.ReadDir($.interfaceValue<fs.FS | null>($.markAsStructValue(new openOnlyFS({fsys: fsys})), "main.openOnlyFS", "main.openOnlyFS"), ".")
	let entries: $.Slice<fs.DirEntry | null> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		await $.println("err:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	for (let __goscriptRangeTarget0 = entries, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let entry = __goscriptRangeTarget0![__rangeIndex]
		await $.println(await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).Name(), await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).IsDir())
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

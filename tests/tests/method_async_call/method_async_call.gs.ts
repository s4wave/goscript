// Generated file based on method_async_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/sync/index.js"

export class FileTracker {
	public declare mutex: sync.Mutex

	public declare lines: $.Slice<number>

	public _fields: {
		mutex: sync.Mutex
		lines: $.Slice<number>
	}

	constructor(init?: Partial<{mutex?: sync.Mutex, lines?: $.Slice<number>}>) {
		this._fields = {
			mutex: init?.mutex ? $.markAsStructValue($.cloneStructValue(init.mutex)) : $.markAsStructValue(new sync.Mutex()),
			lines: init?.lines ?? (null! as $.Slice<number>)
		}
	}

	public clone(): FileTracker {
		return $.markAsStructValue(new FileTracker(this))
	}

	public async AddLine(offset: number): globalThis.Promise<void> {
		let f: FileTracker | $.VarRef<FileTracker> | null = this
		await $.pointerValue<FileTracker>(f).mutex.Lock()
		$.pointerValue<FileTracker>(f).lines = $.append($.pointerValue<FileTracker>(f).lines, offset)
		$.pointerValue<FileTracker>(f).mutex.Unlock()
	}

	static {
		$.bindStructFields(this.prototype, ["mutex", "lines"])
	}

	static __typeInfo = $.registerStructType(
		"main.FileTracker",
		() => new FileTracker(),
		() => [{ name: "AddLine", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		FileTracker,
		() => [{ name: "mutex", key: "mutex", type: "sync.Mutex" }, { name: "lines", key: "lines", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")) }]
	)
}

export class Scanner {
	public declare file: FileTracker | $.VarRef<FileTracker> | null

	public _fields: {
		file: FileTracker | $.VarRef<FileTracker> | null
	}

	constructor(init?: Partial<{file?: FileTracker | $.VarRef<FileTracker> | null}>) {
		this._fields = {
			file: init?.file ?? (null! as FileTracker | $.VarRef<FileTracker> | null)
		}
	}

	public clone(): Scanner {
		return $.markAsStructValue(new Scanner(this))
	}

	public async next(): globalThis.Promise<void> {
		const s: Scanner | $.VarRef<Scanner> | null = this
		await FileTracker.prototype.AddLine.call($.pointerValue<Scanner>(s).file, 10)
	}

	static {
		$.bindStructFields(this.prototype, ["file"])
	}

	static __typeInfo = $.registerStructType(
		"main.Scanner",
		() => new Scanner(),
		() => [{ name: "next", args: [], returns: [] }],
		Scanner,
		() => [{ name: "file", key: "file", type: /* @__PURE__ */ $.pointerType("main.FileTracker") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let tracker: FileTracker | $.VarRef<FileTracker> | null = new FileTracker({lines: $.arrayToSlice<number>([])})
	let scanner: Scanner | $.VarRef<Scanner> | null = new Scanner({file: tracker})
	await Scanner.prototype.next.call(scanner)
	await $.println($.len($.pointerValue<FileTracker>(tracker).lines))
}

if ($.isMainScript(import.meta)) {
	await main()
}

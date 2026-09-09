// Generated file based on interface_override_async_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/io/index.js"

export class asyncReader {
	public declare ch: $.Channel<number> | null

	public _fields: {
		ch: $.Channel<number> | null
	}

	constructor(init?: Partial<{ch?: $.Channel<number> | null}>) {
		this._fields = {
			ch: init?.ch ?? (null! as $.Channel<number> | null)
		}
	}

	public clone(): asyncReader {
		return $.markAsStructValue(new asyncReader(this))
	}

	public async Read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r = this
		await $.chanSend(r.ch, $.len(b))
		return [await $.chanRecv(r.ch), null]
	}

	static {
		$.bindStructFields(this.prototype, ["ch"])
	}

	static __typeInfo = $.registerStructType(
		"main.asyncReader",
		() => new asyncReader(),
		() => [{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }],
		asyncReader,
		() => [{ name: "ch", key: "ch", type: /* @__PURE__ */ $.channelType(/* @__PURE__ */ $.basicType("int"), "both") }]
	)
}

export let Reader: io.Reader | null = $.interfaceValue<io.Reader | null>($.markAsStructValue(new asyncReader({ch: $.makeChannel<number>(1, 0, "both")})), "main.asyncReader", "main.asyncReader")

export function __goscript_set_Reader(__goscriptValue: io.Reader | null): void {
	Reader = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	if (Reader == null) {
		await $.println(0)
		return
	}
	await $.println(3)
}

if ($.isMainScript(import.meta)) {
	await main()
}

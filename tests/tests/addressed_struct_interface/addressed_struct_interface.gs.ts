// Generated file based on addressed_struct_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Writer = {
	Write(_p0: $.Slice<number>): [number, $.GoError]
}

$.registerInterfaceType(
	"main.Writer",
	null,
	[{ name: "Write", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }]
);

export class Buffer {
	public declare data: $.Slice<number>

	public _fields: {
		data: $.Slice<number>
	}

	constructor(init?: Partial<{data?: $.Slice<number>}>) {
		this._fields = {
			data: init?.data ?? (null! as $.Slice<number>)
		}
	}

	public clone(): Buffer {
		return $.markAsStructValue(new Buffer(this))
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		let b: Buffer | $.VarRef<Buffer> | null = this
		$.pointerValue<Buffer>(b).data = $.appendSlice($.pointerValue<Buffer>(b).data, p, $.byteSliceHint)
		return [$.len(p), null]
	}

	static {
		$.bindStructFields(this.prototype, ["data"])
	}

	static __typeInfo = $.registerStructType(
		"main.Buffer",
		() => new Buffer(),
		() => [{ name: "Write", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }],
		Buffer,
		() => [{ name: "data", key: "data", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }]
	)
}

export async function use(w: Writer | null): globalThis.Promise<void> {
	await $.pointerValue<Exclude<Writer, null>>(w).Write(new Uint8Array([120]))
}

export async function main(): globalThis.Promise<void> {
	let b: $.VarRef<Buffer> = $.varRef($.markAsStructValue(new Buffer()))
	await use($.interfaceValue<Writer | null>(b, "*main.Buffer", /* @__PURE__ */ $.pointerType("main.Buffer")))
	await $.println($.bytesToString(b.value.data))
}

if ($.isMainScript(import.meta)) {
	await main()
}

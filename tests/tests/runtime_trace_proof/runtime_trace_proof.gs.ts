// Generated file based on runtime_trace_proof.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as context from "@goscript/context/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as trace from "@goscript/runtime/trace/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/context/index.js"
import "@goscript/fmt/index.js"
import "@goscript/runtime/trace/index.js"

export class byteSink {
	public declare data: $.Slice<number>

	public _fields: {
		data: $.Slice<number>
	}

	constructor(init?: Partial<{data?: $.Slice<number>}>) {
		this._fields = {
			data: init?.data ?? (null! as $.Slice<number>)
		}
	}

	public clone(): byteSink {
		return $.markAsStructValue(new byteSink(this))
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		let s: byteSink | $.VarRef<byteSink> | null = this;
		$.pointerValue<byteSink>(s).data = $.appendSlice($.pointerValue<byteSink>(s).data, p, $.byteSliceHint)
		return [$.len(p), null]
	}

	static {
		$.bindStructFields(this.prototype, ["data"])
	}

	static __typeInfo = $.registerStructType(
		"main.byteSink",
		() => new byteSink(),
		() => [{ name: "Write", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }],
		byteSink,
		() => [{ name: "data", key: "data", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }]
	)
}

export const hexDigits: string = "0123456789abcdef"

export function toHex(b: $.Slice<number>): string {
	let out: $.Slice<number> = $.makeSlice<number>($.len(b) * 2, undefined, "byte")
	for (let __goscriptRangeTarget0 = b, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let c = __goscriptRangeTarget0![i]
		out![i * 2] = $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", $.uintShr(c, 4, 8)), 8)
		out![(i * 2) + 1] = $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", c & 0x0f), 8)
	}
	return $.bytesToString(out)
}

export async function main(): globalThis.Promise<void> {
	let sink: byteSink | $.VarRef<byteSink> | null = new byteSink()
	{
		let err = trace.Start($.pointerValueOrNil($.interfaceValue<io.Writer | null>(sink, "*main.byteSink", /* @__PURE__ */ $.pointerType("main.byteSink")))!)
		if (err != null) {
			await fmt.Println("ERROR:" + await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}

	let __goscriptTuple0: any = trace.NewTask($.pointerValueOrNil(context.Background())!, "proof-task")
	let ctx = __goscriptTuple0[0]
	let task: trace.Task | $.VarRef<trace.Task> | null = __goscriptTuple0[1]
	await trace.WithRegion($.pointerValueOrNil(ctx)!, "proof-region", $.functionValue((): void => {
		trace.Log($.pointerValueOrNil(ctx)!, "proof-key", "proof-value")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	trace.Task.prototype.End.call($.pointerValue<trace.Task>(task))

	trace.Stop()

	await fmt.Println(toHex($.pointerValue<byteSink>(sink).data))
}

if ($.isMainScript(import.meta)) {
	await main()
}

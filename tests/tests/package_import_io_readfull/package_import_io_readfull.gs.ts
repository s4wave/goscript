// Generated file based on package_import_io_readfull.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/io/index.js"

export class fixedReader {
	public declare data: $.Slice<number>

	public declare size: number

	public _fields: {
		data: $.Slice<number>
		size: number
	}

	constructor(init?: Partial<{data?: $.Slice<number>, size?: number}>) {
		this._fields = {
			data: init?.data ?? (null! as $.Slice<number>),
			size: init?.size ?? (0 as number)
		}
	}

	public clone(): fixedReader {
		return $.markAsStructValue(new fixedReader(this))
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		let r: fixedReader | $.VarRef<fixedReader> | null = this;
		if ($.len($.pointerValue<fixedReader>(r).data) == 0) {
			return [0, io.EOF]
		}
		if (($.pointerValue<fixedReader>(r).size > 0) && ($.len(p) > $.pointerValue<fixedReader>(r).size)) {
			p = $.goSlice(p, undefined, $.pointerValue<fixedReader>(r).size)
		}
		let n = $.copy(p, $.pointerValue<fixedReader>(r).data)
		$.pointerValue<fixedReader>(r).data = $.goSlice($.pointerValue<fixedReader>(r).data, n, undefined)
		return [n, null]
	}

	static {
		$.bindStructFields(this.prototype, ["data", "size"])
	}

	static __typeInfo = $.registerStructType(
		"main.fixedReader",
		() => new fixedReader(),
		() => [{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }],
		fixedReader,
		() => [{ name: "data", key: "data", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { name: "size", key: "size", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let buf: $.Slice<number> = $.makeSlice<number>(2, undefined, "byte")
	let [n, err] = await io.ReadFull($.pointerValueOrNil($.interfaceValue<io.Reader | null>(new fixedReader({data: new Uint8Array([97, 98, 99])}), "*main.fixedReader", /* @__PURE__ */ $.pointerType("main.fixedReader")))!, buf)
	await $.println("read:", n, $.bytesToString(buf), err == null)
	let __goscriptTuple0: any = await io.ReadFull($.pointerValueOrNil($.interfaceValue<io.Reader | null>(bytes.NewReader(null), "*bytes.Reader", /* @__PURE__ */ $.pointerType("bytes.Reader")))!, buf)
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	await $.println("empty:", n, $.comparableEqual(err, io.EOF))
	let __goscriptTuple1: any = await io.ReadFull($.pointerValueOrNil($.interfaceValue<io.Reader | null>(bytes.NewReader(new Uint8Array([120])), "*bytes.Reader", /* @__PURE__ */ $.pointerType("bytes.Reader")))!, buf)
	n = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	await $.println("short:", n, $.bytesToString($.goSlice(buf, undefined, 1)), $.comparableEqual(err, io.ErrUnexpectedEOF))
	let __goscriptTuple2: any = await io.ReadAll($.pointerValueOrNil($.interfaceValue<io.Reader | null>(new fixedReader({data: new Uint8Array([97, 98, 99, 68, 69, 70, 103, 104, 105]), size: 3}), "*main.fixedReader", /* @__PURE__ */ $.pointerType("main.fixedReader")))!)
	let all: $.Slice<number> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	await $.println("readall:", $.bytesToString(all), err == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}

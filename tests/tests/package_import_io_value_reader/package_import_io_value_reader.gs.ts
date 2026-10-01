// Generated file based on package_import_io_value_reader.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as strings from "@goscript/strings/index.js"
import "@goscript/io/index.js"
import "@goscript/strings/index.js"

export class zeroReader {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): zeroReader {
		return $.markAsStructValue(new zeroReader(this))
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		$.clear(p)
		return [$.len(p), null]
	}

	static __typeInfo = $.registerStructType(
		"main.zeroReader",
		() => new zeroReader(),
		() => [{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }, { type: "error" }] }],
		zeroReader,
		() => []
	)
}

export async function main(): globalThis.Promise<void> {
	// Bound the unbounded value reader directly.
	let __goscriptTuple0: any = await io.ReadAll($.pointerValueOrNil(io.LimitReader($.interfaceValue<io.Reader | null>($.markAsStructValue(new zeroReader()), "main.zeroReader", "main.zeroReader")!, 3n))!)
	let data: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	await $.println("limit:", $.len(data), $.uint($.arrayIndex(data!, 0), 8) == 0, err == null)

	// Join a bounded zero range with a trailing reader through a spread slice.
	let rdrs: $.Slice<io.Reader | null> = $.arrayToSlice<io.Reader | null>([io.LimitReader($.interfaceValue<io.Reader | null>($.markAsStructValue(new zeroReader()), "main.zeroReader", "main.zeroReader")!, 2n)])
	rdrs = $.append(rdrs, $.interfaceValue<io.Reader | null>(strings.NewReader("ab"), "*strings.Reader", /* @__PURE__ */ $.pointerType("strings.Reader")), $.appendZeros.nil)
	let __goscriptTuple1: any = await io.ReadAll($.pointerValueOrNil(io.MultiReader(...(rdrs ?? [])))!)
	data = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	await $.println("multi:", $.len(data), $.uint($.arrayIndex(data!, 1), 8) == 0, $.bytesToString($.goSlice(data, 2, undefined)), err == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}

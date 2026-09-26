// Generated file based on bulk_copy_array_values.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as slices from "@goscript/slices/index.js"

import type * as iter from "@goscript/iter/index.js"
import "@goscript/slices/index.js"

export class point {
	public declare x: number

	public _fields: {
		x: number
	}

	constructor(init?: Partial<{x?: number}>) {
		this._fields = {
			x: init?.x ?? (0 as number)
		}
	}

	public clone(): point {
		return $.markAsStructValue(new point(this))
	}

	static {
		$.bindStructFields(this.prototype, ["x"])
	}

	static __typeInfo = $.registerStructType(
		"main.point",
		() => new point(),
		() => [],
		point,
		() => [{ name: "x", key: "x", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let src: $.Slice<number[]> = $.arrayToSlice<number[]>([$.arrayValue([1])])

	let dst: $.Slice<number[]> = $.makeSlice<number[]>(1)
	$.copy(dst, src)
	$.arrayIndex(dst!, 0)[0] = 9
	await $.println("copy:", $.arrayIndex($.arrayIndex(src!, 0), 0))

	let appended: $.Slice<number[]> = $.appendSlice<number[]>(null, src)
	$.arrayIndex(appended!, 0)[0] = 9
	await $.println("append:", $.arrayIndex($.arrayIndex(src!, 0), 0))

	let cloned: $.Slice<number[]> = (slices.Clone(src) as $.Slice<number[]>)
	$.arrayIndex(cloned!, 0)[0] = 9
	await $.println("clone:", $.arrayIndex($.arrayIndex(src!, 0), 0))

	let concat: $.Slice<number[]> = (slices.Concat(src, src) as $.Slice<number[]>)
	$.arrayIndex(concat!, 1)[0] = 9
	await $.println("concat:", $.arrayIndex($.arrayIndex(src!, 0), 0))

	let __goscriptRangeReturn0 = false
	;await (async () => {
		await slices.Values(src)!(async (v) => {
			v[0] = 9
			return true
		})
	})()
	if (__goscriptRangeReturn0) {
		return
	}
	await $.println("values:", $.arrayIndex($.arrayIndex(src!, 0), 0))

	let points: $.Slice<point[]> = $.arrayToSlice<point[]>([$.arrayValue([$.markAsStructValue(new point({x: 1}))], /* @__PURE__ */ $.arrayType("main.point", 1))])
	let pointCopies: $.Slice<point[]> = $.makeSlice<point[]>(1)
	$.copy(pointCopies, points)
	$.arrayIndex($.arrayIndex(pointCopies!, 0), 0).x = 9
	await $.println("struct array:", $.arrayIndex($.arrayIndex(points!, 0), 0).x)

	let nested: $.Slice<number[][]> = $.arrayToSlice<number[][]>([$.arrayValue([$.arrayValue([1])], /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 1), 1))])
	let nestedCopies: $.Slice<number[][]> = (slices.Clone(nested) as $.Slice<number[][]>)
	$.arrayIndex($.arrayIndex(nestedCopies!, 0), 0)[0] = 9
	await $.println("nested:", $.arrayIndex($.arrayIndex($.arrayIndex(nested!, 0), 0), 0))

	let shared: $.Slice<$.Slice<number>> = $.arrayToSlice<$.Slice<number>>([$.arrayToSlice<number>([1])])
	let sharedCopies: $.Slice<$.Slice<number>> = (slices.Clone(shared) as $.Slice<$.Slice<number>>)
	$.arrayIndex(sharedCopies!, 0)![0] = 9
	await $.println("slice elements share:", $.arrayIndex($.arrayIndex(shared!, 0)!, 0))
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on bulk_copy_array_values.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as slices from "@goscript/slices/index.js"
import type * as iter from "@goscript/iter/index.js"

export class point {
	public declare x: number

	constructor(__goscriptValue?: boolean, x$?: number) {
		this.x = x$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): point {
		return new point(true, this.x)
	}

	public __goscriptAssign(source: point): this {
		this.x = source.x
		return this
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
	let src = $.arrayToSlice<number[]>([$.arrayValue([1])])

	let dst = $.makeSlice<number[]>(1, undefined, undefined, () => $.arrayValue(globalThis.Array.from({ length: 1 }, () => 0)))
	$.copy(dst, src)
	$.arrayIndex(dst!, 0)[0] = 9
	await $.println("copy:", ($.arrayIndex(src!, 0))[0])

	let appended = $.appendSlice<number[]>(null, src)
	$.arrayIndex(appended!, 0)[0] = 9
	await $.println("append:", ($.arrayIndex(src!, 0))[0])

	let cloned = (slices.Clone(src) as $.Slice<number[]>)
	$.arrayIndex(cloned!, 0)[0] = 9
	await $.println("clone:", ($.arrayIndex(src!, 0))[0])

	let concat = (slices.Concat(src, src) as $.Slice<number[]>)
	$.arrayIndex(concat!, 1)[0] = 9
	await $.println("concat:", ($.arrayIndex(src!, 0))[0])

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
	await $.println("values:", ($.arrayIndex(src!, 0))[0])

	let points = $.arrayToSlice<point[]>([$.arrayValue([new point(true, 1)], __goscriptStatic0())])
	let pointCopies = $.makeSlice<point[]>(1, undefined, undefined, () => $.arrayValue(globalThis.Array.from({ length: 1 }, () => new point(true)), /* @__PURE__ */ $.arrayType("main.point", 1)))
	$.copy(pointCopies, points);
	;($.arrayIndex(pointCopies!, 0))[0].x = 9
	await $.println("struct array:", ($.arrayIndex(points!, 0))[0].x)

	let nested = $.arrayToSlice<number[][]>([$.arrayValue([$.arrayValue([1])], __goscriptStatic1())])
	let nestedCopies = (slices.Clone(nested) as $.Slice<number[][]>);
	;($.arrayIndex(nestedCopies!, 0))[0][0] = 9
	await $.println("nested:", (($.arrayIndex(nested!, 0))[0])[0])

	let shared = $.arrayToSlice<$.Slice<number>>([$.arrayToSlice<number>([1])])
	let sharedCopies = (slices.Clone(shared) as $.Slice<$.Slice<number>>)
	$.sliceElems($.arrayIndex(sharedCopies!, 0)!)[$.sliceSlot($.arrayIndex(sharedCopies!, 0)!, 0)] = 9
	await $.println("slice elements share:", $.arrayIndex($.arrayIndex(shared!, 0)!, 0))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType("main.point", 1))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 1), 1))
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on reflect_slice_view.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export class item {
	public declare name: string

	constructor(__goscriptValue?: boolean, name$?: string) {
		this.name = name$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): item {
		return new item(true, this.name)
	}

	public __goscriptAssign(source: item): this {
		this.name = source.name
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		() => [],
		item,
		() => [/* @__PURE__ */ $.structField("name", /* @__PURE__ */ $.basicType("string"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/reflect_slice_view" })]
	)
}

export function names(s: $.Slice<item | $.VarRef<item> | null>): string {
	let r = ""
	for (let __goscriptRangeTarget0 = s, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let it = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as item | $.VarRef<item> | null)
		if (it == null) {
			r += "nil "
			continue
		}
		r += $.pointerValue<item>(it).name + " "
	}
	return r
}

export async function main(): globalThis.Promise<void> {
	let a = new item(false, "a")
	let b = new item(false, "b")
	let c = new item(false, "c")

	// a slice of a slice shares its elements: writes through it are seen
	let s: $.VarRef<$.Slice<item | $.VarRef<item> | null>> = $.varRef($.arrayToSlice<item | $.VarRef<item> | null>([a, b, c]))
	let sv = reflect.ValueOf($.interfaceValue(s, "*[]*main.item", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.item"))))).Elem()
	sv.Slice(0, 2).Index(0).Set(reflect.ValueOf($.interfaceValue(c, "*main.item", /* @__PURE__ */ $.pointerType("main.item"))))
	await $.println("set through slice:", names(s.value))

	// deleting with an overlapping copy, as slices.Delete does
	s.value = $.arrayToSlice<item | $.VarRef<item> | null>([a, b, c])
	sv = reflect.ValueOf($.interfaceValue(s, "*[]*main.item", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.item"))))).Elem()
	let n = reflect.Copy(sv.Slice(0, 2), sv.Slice(1, 3))
	sv.Index(2).SetZero()
	sv.Set(sv.Slice(0, 2))
	await $.println("delete first:", n, $.sliceLen(s.value), names(s.value))

	// inserting with an overlapping copy, toward the end
	s.value = $.arrayToSlice<item | $.VarRef<item> | null>([a, b, null])
	sv = reflect.ValueOf($.interfaceValue(s, "*[]*main.item", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.item"))))).Elem()
	reflect.Copy(sv.Slice(1, 3), sv.Slice(0, 2))
	sv.Index(0).Set(reflect.ValueOf($.interfaceValue(c, "*main.item", /* @__PURE__ */ $.pointerType("main.item"))))
	await $.println("insert first:", names(s.value))

	// strings and ints too
	let ss: $.VarRef<$.Slice<string>> = $.varRef($.arrayToSlice<string>(["x", "y", "z"]))
	let ssv = reflect.ValueOf($.interfaceValue(ss, "*[]string", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))))).Elem()
	reflect.Copy(ssv.Slice(0, 2), ssv.Slice(1, 3))
	await $.println("strings:", $.plainSliceIndex(ss.value!, 0), $.plainSliceIndex(ss.value!, 1), $.plainSliceIndex(ss.value!, 2))

	// a slice of an array shares the array
	let arr = $.varRef($.arrayValue(["p", "q", "r"]))
	let av = reflect.ValueOf($.interfaceValue(arr, "*[3]string", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("string"), 3)))).Elem()
	av.Slice(1, 3).Index(0).SetString("Q")
	await $.println("array:", arr.value[0], arr.value[1], arr.value[2], av.Slice(1, 3).Kind() == 23)
}

if ($.isMainScript(import.meta)) {
	await main()
}

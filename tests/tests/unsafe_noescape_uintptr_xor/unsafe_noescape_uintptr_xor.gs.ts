// Generated file based on unsafe_noescape_uintptr_xor.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export class sourceStruct {
	public declare flag: boolean

	public declare data: $.Slice<number>

	constructor(__goscriptValue?: boolean, flag$?: boolean, data$?: $.Slice<number>) {
		this.flag = flag$ ?? false
		this.data = data$ ?? (null! as $.Slice<number>)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): sourceStruct {
		return new sourceStruct(true, this.flag, this.data)
	}

	public __goscriptAssign(source: sourceStruct): this {
		this.flag = source.flag
		this.data = source.data
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.sourceStruct",
		() => new sourceStruct(),
		() => [],
		sourceStruct,
		() => [{ name: "flag", key: "flag", type: /* @__PURE__ */ $.basicType("bool") }, { name: "data", key: "data", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint")) }]
	)
}

export class viewStruct {
	public declare flag: boolean

	public declare data: $.Slice<number>

	constructor(__goscriptValue?: boolean, flag$?: boolean, data$?: $.Slice<number>) {
		this.flag = flag$ ?? false
		this.data = data$ ?? (null! as $.Slice<number>)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): viewStruct {
		return new viewStruct(true, this.flag, this.data)
	}

	public __goscriptAssign(source: viewStruct): this {
		this.flag = source.flag
		this.data = source.data
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.viewStruct",
		() => new viewStruct(),
		() => [],
		viewStruct,
		() => [{ name: "flag", key: "flag", type: /* @__PURE__ */ $.basicType("bool") }, { name: "data", key: "data", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint")) }]
	)
}

export function noescape(p: any): any {
	let x = (p as any)
	return (x as any)
}

export function inlineSlice(values: $.Slice<number>): $.Slice<number> {
	return $.goSlice($.pointerValue<number[]>($.unsafeByteView<$.VarRef<number[]> | null>(noescape(($.indexRef(values!, 0) as any)), __goscriptStatic0(), undefined, 8)), undefined, undefined)
}

export function markThroughView(src: sourceStruct | $.VarRef<sourceStruct> | null): boolean {
	$.pointerValue<sourceStruct>(src).flag = true
	return $.pointerValue<sourceStruct>(src).flag
}

export async function main(): globalThis.Promise<void> {
	// An identity round-trip preserves the indexed pointer token.
	let values = $.arrayToSlice<number>([1, 2])
	let p = ($.indexRef(values!, 1) as any)
	let q = noescape(p)

	await $.println("same:", (q === p || ($.pointerAliasesMade || (q as any)?.__goElementBacking !== undefined) && $.pointerEqual(q, p)))
	await $.println("nil:", q == null)

	// The array pointer keeps the original numeric backing and aliases.
	let inline = inlineSlice(values)
	await $.println("inline:", $.plainSliceIndex(inline!, 0), $.plainSliceIndex(inline!, 1))
	$.sliceElems(inline!)[$.sliceSlot(inline!, 0)] = 9
	await $.println("updated:", $.plainSliceIndex(values!, 0))

	// Target-sized words retain their number representation over byte storage.
	let bytes: Uint8Array = $.arrayValue(new Uint8Array(16))
	let words = $.unsafeByteView<$.VarRef<number[]> | null>(($.indexRef(bytes, 0) as any), __goscriptStatic0())
	$.pointerValue<number[]>(words)[0] = 7
	bytes[8] = 9
	await $.println("byte words:", $.arrayIndex($.pointerValue<number[]>(words), 0), $.arrayIndex($.pointerValue<number[]>(words), 1), bytes[0])
	let signed = $.unsafeByteView<$.VarRef<number> | null>(($.indexRef(bytes, 0) as any), __goscriptStatic1())
	signed!.value = -3
	await $.println("signed word:", $.pointerValue<number>(signed), bytes[0])
	let address = $.unsafeByteView<$.VarRef<number> | null>(($.indexRef(bytes, 8) as any), __goscriptStatic2())
	address!.value = 10
	await $.println("address word:", $.pointerValue<number>(address), $.arrayIndex($.pointerValue<number[]>(words), 1))

	// Ordinary reference-bearing struct casts keep their existing identity.
	let src: $.VarRef<sourceStruct> = $.varRef(new sourceStruct(true))
	await $.println("struct:", markThroughView(src), src.value.flag)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({ size: 16, align: 8, kind: "array", length: 2, element: { size: 8, align: 8, kind: "scalar", scalar: "uint" } })
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({ size: 8, align: 8, kind: "scalar", scalar: "int" })
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({ size: 8, align: 8, kind: "scalar", scalar: "uintptr" })
}

if ($.isMainScript(import.meta)) {
	await main()
}

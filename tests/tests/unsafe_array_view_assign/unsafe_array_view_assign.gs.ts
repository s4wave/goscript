// Generated file based on unsafe_array_view_assign.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export class digest {
	public declare chain: number[]

	public declare block: number[]

	constructor(__goscriptValue?: boolean, chain$?: number[], block$?: number[]) {
		this.chain = chain$ ?? $.arrayValue(globalThis.Array.from({ length: 8 }, () => 0))
		this.block = block$ ?? $.arrayValue(globalThis.Array.from({ length: 16 }, () => 0))
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): digest {
		return new digest(true, $.cloneArrayValue(this.chain, __goscriptStatic0()), $.cloneArrayValue(this.block, __goscriptStatic1()))
	}

	public __goscriptAssign(source: digest): this {
		this.chain = $.assignFieldValue(this.chain, source.chain, __goscriptStatic0())
		this.block = $.assignFieldValue(this.block, source.block, __goscriptStatic1())
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.digest",
		() => new digest(),
		() => [],
		digest,
		() => [{ name: "chain", key: "chain", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint32"), 8) }, { name: "block", key: "block", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint32"), 16) }]
	)
}

export function compress(chain: $.VarRef<number[]> | null, block: $.VarRef<number[]> | null, out: $.VarRef<number[]> | null): void {
	$.assignFieldValue($.pointerValue<number[]>(out), $.arrayValue([$.arrayIndex($.pointerValue<number[]>(chain), 0), $.arrayIndex($.pointerValue<number[]>(chain), 1), $.arrayIndex($.pointerValue<number[]>(chain), 2), $.arrayIndex($.pointerValue<number[]>(chain), 3), $.arrayIndex($.pointerValue<number[]>(chain), 4), $.arrayIndex($.pointerValue<number[]>(chain), 5), $.arrayIndex($.pointerValue<number[]>(chain), 6), $.arrayIndex($.pointerValue<number[]>(chain), 7), $.arrayIndex($.pointerValue<number[]>(block), 0), $.arrayIndex($.pointerValue<number[]>(block), 1), $.arrayIndex($.pointerValue<number[]>(block), 2), $.arrayIndex($.pointerValue<number[]>(block), 3), $.arrayIndex($.pointerValue<number[]>(block), 4), $.arrayIndex($.pointerValue<number[]>(block), 5), $.arrayIndex($.pointerValue<number[]>(block), 6), $.arrayIndex($.pointerValue<number[]>(block), 7)]), __goscriptStatic1())
	for (let __goscriptRangeTarget0 = $.pointerValue<number[]>(out), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
		$.pointerValue<number[]>(out)[i] = $.uint((((globalThis.Math.imul($.arrayIndex($.pointerValue<number[]>(out), i), 3) >>> 0) + $.uint(i, 32)) >>> 0), 32)
	}
}

export async function main(): globalThis.Promise<void> {
	// Assign an array read through an unsafe view of a larger array.
	let compressed: number[] = $.arrayValue(globalThis.Array.from({ length: 16 }, () => 0))
	for (let __goscriptRangeTarget1 = compressed, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), i = 0; i < __goscriptRangeWindow1.length; i++) {
		compressed[i] = $.uint(i + 1, 32)
	}
	let d: digest = new digest(true)
	$.assignFieldValue(d.chain, $.unsafePointerCast<$.VarRef<number[]> | null>($.arrayPointerFromIndexRef<number>($.indexRef(compressed, 0), 8, 4, 4))!.value, __goscriptStatic0())
	await $.println(d.chain[0], d.chain[7])
	compressed[0] = 99
	await $.println("after source write:", d.chain[0])

	// Take the message block as a view of a larger array.
	let words: number[] = $.arrayValue(globalThis.Array.from({ length: 32 }, () => 0))
	for (let __goscriptRangeTarget2 = words, __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), i = 0; i < __goscriptRangeWindow2.length; i++) {
		words[i] = $.uint(i * 7, 32)
	}
	let block = $.unsafeByteView<$.VarRef<number[]> | null>(($.indexRef(words, 16) as any), __goscriptStatic2(), undefined, 4)
	await $.println("word0:", $.arrayIndex($.pointerValue<number[]>(block), 0), "word15:", $.arrayIndex($.pointerValue<number[]>(block), 15))

	// Chain two compressions as a multi-block hash does.
	let out: $.VarRef<number[]> = $.varRef($.arrayValue(globalThis.Array.from({ length: 16 }, () => 0)))
	for (let round = 0; round < 2; round++) {
		compress($.fieldRef(d, "chain"), block, out)
		$.assignFieldValue(d.chain, $.unsafePointerCast<$.VarRef<number[]> | null>($.arrayPointerFromIndexRef<number>($.indexRef(out.value, 0), 8, 4, 4))!.value, __goscriptStatic0())
		await $.println("round", round, d.chain[0], d.chain[3], d.chain[7])
	}

	// Write a view of the block array from another array.
	$.assignFieldValue($.unsafePointerCast<$.VarRef<number[]> | null>($.arrayPointerFromIndexRef<number>($.indexRef(d.block, 8), 8, 4, 4))!.value, $.unsafePointerCast<$.VarRef<number[]> | null>($.arrayPointerFromIndexRef<number>($.indexRef(out.value, 0), 8, 4, 4))!.value, __goscriptStatic0())
	await $.println("block8:", d.block[8], "block15:", d.block[15], "block0:", d.block[0])
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint32"), 8))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint32"), 16))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({ size: 64, align: 4, kind: "array", length: 16, element: { size: 4, align: 4, kind: "scalar", scalar: "uint32" } })
}

if ($.isMainScript(import.meta)) {
	await main()
}

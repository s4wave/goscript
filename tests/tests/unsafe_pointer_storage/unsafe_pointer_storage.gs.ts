// Generated file based on unsafe_pointer_storage.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export class word {
	public declare data: Uint8Array

	constructor(__goscriptValue?: boolean, data$?: Uint8Array) {
		this.data = data$ ?? $.arrayValue(new Uint8Array(4))
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): word {
		return new word(true, $.cloneArrayValue(this.data, __goscriptStatic0()))
	}

	public __goscriptAssign(source: word): this {
		this.data = $.assignFieldValue(this.data, source.data, __goscriptStatic0())
		return this
	}

	public half(): $.VarRef<number> | null {
		const w: word | $.VarRef<word> | null = this;
		return $.unsafeByteView<$.VarRef<number> | null>(unsafe.Add!(($.fieldRef($.pointerValue<word>(w), "data") as any), 2), __goscriptStatic1())
	}

	public real(): $.VarRef<number> | null {
		const w: word | $.VarRef<word> | null = this;
		return $.unsafeByteView<$.VarRef<number> | null>(unsafe.Add!(($.fieldRef($.pointerValue<word>(w), "data") as any), 0), __goscriptStatic2())
	}

	static __typeInfo = $.registerStructType(
		"main.word",
		() => new word(),
		() => [{ name: "half", args: [], returns: [{ type: /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("uint16")) }], pointerReceiver: true }, { name: "real", args: [], returns: [{ type: /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("float32")) }], pointerReceiver: true }],
		word,
		() => [{ name: "data", key: "data", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4) }]
	)
}

export function writeBytes(words: $.Slice<bigint>, bytes: $.Slice<number>): void {
	for (let __goscriptRangeTarget0 = bytes, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __goscriptSliceWindow0 = $.sliceRange(words), i = 0; i < __goscriptRangeWindow0.length; i++) {
		let b = $.uint((__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + i] as number), 8)
		$.unsafePointerRef<number>(($.wideUintAdd($.indexByteAddress(words!, 0, 8), $.uint(i, 64)) as any)).value = b
	}
}

export async function main(): globalThis.Promise<void> {
	await $.println("unsafe pointer storage compiles")
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({ size: 2, align: 2, kind: "scalar", scalar: "uint16" })
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({ size: 4, align: 4, kind: "scalar", scalar: "float32" })
}

if ($.isMainScript(import.meta)) {
	await main()
}

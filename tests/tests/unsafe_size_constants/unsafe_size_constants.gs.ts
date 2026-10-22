// Generated file based on unsafe_size_constants.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export class Data {
	public declare A: number

	public declare B: number

	public declare C: number

	public declare D: number

	constructor(__goscriptValue?: boolean, A$?: number, B$?: number, C$?: number, D$?: number) {
		this.A = A$ ?? 0
		this.B = B$ ?? 0
		this.C = C$ ?? 0
		this.D = D$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Data {
		return new Data(true, this.A, this.B, this.C, this.D)
	}

	public __goscriptAssign(source: Data): this {
		this.A = source.A
		this.B = source.B
		this.C = source.C
		this.D = source.D
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Data",
		() => new Data(),
		() => [],
		Data,
		() => [{ name: "A", key: "A", type: /* @__PURE__ */ $.basicType("float32") }, { name: "B", key: "B", type: /* @__PURE__ */ $.basicType("float32") }, { name: "C", key: "C", type: /* @__PURE__ */ $.basicType("float32") }, { name: "D", key: "D", type: /* @__PURE__ */ $.basicType("float32") }]
	)
}

export class Mixed {
	public declare Flag: boolean

	public declare N: number

	public declare V: number[]

	constructor(__goscriptValue?: boolean, Flag$?: boolean, N$?: number, V$?: number[]) {
		this.Flag = Flag$ ?? false
		this.N = N$ ?? 0
		this.V = V$ ?? $.arrayValue(globalThis.Array.from({ length: 3 }, () => 0), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 3))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Mixed {
		return new Mixed(true, this.Flag, this.N, $.cloneArrayValue(this.V, __goscriptStatic0()))
	}

	public __goscriptAssign(source: Mixed): this {
		this.Flag = source.Flag
		this.N = source.N
		this.V = $.assignFieldValue(this.V, source.V, __goscriptStatic0())
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Mixed",
		() => new Mixed(),
		() => [],
		Mixed,
		() => [{ name: "Flag", key: "Flag", type: /* @__PURE__ */ $.basicType("bool") }, { name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int32") }, { name: "V", key: "V", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 3) }]
	)
}

export const dataSize: number = 16

export async function main(): globalThis.Promise<void> {
	let m: Mixed = new Mixed(true)
	let n = 10
	await $.println("data size:", 16, 16)
	await $.println("bytes for 10:", 160)
	await $.println("bytes for n:", n * $.int(16), $.uint($.wideUintMul($.uint(n, 64), 20), 64))
	await $.println("offset sum:", $.int(8) + n, $.uint($.wideUintAdd(4, $.uint(n, 64)), 64))
	await $.println("float32 size:", 4, 4)
	await $.println("mixed size:", 20, 4)
	await $.println("mixed offsets:", 4, 8)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 3))
}

if ($.isMainScript(import.meta)) {
	await main()
}

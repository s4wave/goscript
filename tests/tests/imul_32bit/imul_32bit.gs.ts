// Generated file based on imul_32bit.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class multiplyCase {
	public declare x: number

	public declare y: number

	public declare unsigned: number

	public declare signed: number

	constructor(__goscriptValue?: boolean, x$?: number, y$?: number, unsigned$?: number, signed$?: number) {
		this.x = x$ ?? 0
		this.y = y$ ?? 0
		this.unsigned = unsigned$ ?? 0
		this.signed = signed$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): multiplyCase {
		return new multiplyCase(true, this.x, this.y, this.unsigned, this.signed)
	}

	public __goscriptAssign(source: multiplyCase): this {
		this.x = source.x
		this.y = source.y
		this.unsigned = source.unsigned
		this.signed = source.signed
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.multiplyCase",
		() => new multiplyCase(),
		() => [],
		multiplyCase,
		() => [{ name: "x", key: "x", type: /* @__PURE__ */ $.basicType("uint32") }, { name: "y", key: "y", type: /* @__PURE__ */ $.basicType("uint32") }, { name: "unsigned", key: "unsigned", type: /* @__PURE__ */ $.basicType("uint32") }, { name: "signed", key: "signed", type: /* @__PURE__ */ $.basicType("int32") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let cases = $.arrayToSlice<multiplyCase>([new multiplyCase(true, 65535, 65535, 4294836225, -131071), new multiplyCase(true, 134217729, 134217729, 268435457, 268435457), new multiplyCase(true, 4294967295, 4294967295, 1, 1), new multiplyCase(true, 4294967295, 3221225473, 1073741823, 1073741823), new multiplyCase(true, 4294967295, 134217729, 4160749567, -134217729)])

	for (let __goscriptRangeTarget0 = cases, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let tc = ((__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as multiplyCase)).clone()
		await checkUint32(tc.x, tc.y, tc.unsigned)
		await checkInt32($.int(tc.x, 32), $.int(tc.y, 32), tc.signed)
	}

	await checkInt32(-2147483647, -2147483647, 1)
	await checkInt32(-2147483648, -1, -2147483648)

	await checkPlatformIntWidths()
	await $.println("ok")
}

export async function checkUint32(x: number, y: number, want: number): globalThis.Promise<void> {
	let got = $.uint(globalThis.Math.imul(x, y) >>> 0, 32)
	if (got != want) {
		await $.println("uint32", x, "*", y, "got", got, "want", want)
	}

	let compound = x
	compound = globalThis.Math.imul(compound, y) >>> 0
	if (compound != want) {
		await $.println("uint32 *=", x, "*", y, "got", compound, "want", want)
	}
}

export async function checkInt32(x: number, y: number, want: number): globalThis.Promise<void> {
	let got = $.int(globalThis.Math.imul(x, y), 32)
	if (got != want) {
		await $.println("int32", x, "*", y, "got", got, "want", want)
	}

	let compound = x
	compound = globalThis.Math.imul(compound, y)
	if (compound != want) {
		await $.println("int32 *=", x, "*", y, "got", compound, "want", want)
	}
}

export async function checkPlatformIntWidths(): globalThis.Promise<void> {
	let neg = -1n
	if ($.uint(neg, 64) == 4294967295) {
		await $.println("uint is 32-bit")
	}
	if ($.int64ToNumber(neg) == 4294967295) {
		await $.println("int is 32-bit")
	}
	if ($.uint(neg, 64) == 4294967295) {
		await $.println("uintptr is 32-bit")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

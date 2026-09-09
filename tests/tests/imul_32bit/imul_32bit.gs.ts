// Generated file based on imul_32bit.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class multiplyCase {
	public declare x: number

	public declare y: number

	public declare unsigned: number

	public declare signed: number

	public _fields: {
		x: number
		y: number
		unsigned: number
		signed: number
	}

	constructor(init?: Partial<{x?: number, y?: number, unsigned?: number, signed?: number}>) {
		this._fields = {
			x: init?.x ?? (0 as number),
			y: init?.y ?? (0 as number),
			unsigned: init?.unsigned ?? (0 as number),
			signed: init?.signed ?? (0 as number)
		}
	}

	public clone(): multiplyCase {
		return $.markAsStructValue(new multiplyCase(this))
	}

	static {
		$.bindStructFields(this.prototype, ["x", "y", "unsigned", "signed"])
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
	let cases: $.Slice<multiplyCase> = $.arrayToSlice<multiplyCase>([$.markAsStructValue(new multiplyCase({x: $.uint(65535, 32), y: $.uint(65535, 32), unsigned: $.uint(4294836225, 32), signed: $.int(-131071, 32)})), $.markAsStructValue(new multiplyCase({x: $.uint(134217729, 32), y: $.uint(134217729, 32), unsigned: $.uint(268435457, 32), signed: $.int(268435457, 32)})), $.markAsStructValue(new multiplyCase({x: $.uint(4294967295, 32), y: $.uint(4294967295, 32), unsigned: $.uint(1, 32), signed: $.int(1, 32)})), $.markAsStructValue(new multiplyCase({x: $.uint(4294967295, 32), y: $.uint(3221225473, 32), unsigned: $.uint(1073741823, 32), signed: $.int(1073741823, 32)})), $.markAsStructValue(new multiplyCase({x: $.uint(4294967295, 32), y: $.uint(134217729, 32), unsigned: $.uint(4160749567, 32), signed: $.int(-134217729, 32)}))])

	for (let __goscriptRangeTarget0 = cases, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let tc = __goscriptRangeTarget0![__rangeIndex]
		await checkUint32($.uint(tc.x, 32), $.uint(tc.y, 32), $.uint(tc.unsigned, 32))
		await checkInt32($.int($.int(tc.x, 32), 32), $.int($.int(tc.y, 32), 32), $.int(tc.signed, 32))
	}

	await checkInt32($.int(-2147483647, 32), $.int(-2147483647, 32), $.int(1, 32))
	await checkInt32($.int(-2147483648, 32), $.int(-1, 32), $.int(-2147483648, 32))

	await checkPlatformIntWidths()
	await $.println("ok")
}

export async function checkUint32(x: number, y: number, want: number): globalThis.Promise<void> {
	let got = $.uint(Math.imul(x, y) >>> 0, 32)
	if ($.uint(got, 32) != $.uint(want, 32)) {
		await $.println("uint32", $.uint(x, 32), "*", $.uint(y, 32), "got", $.uint(got, 32), "want", $.uint(want, 32))
	}

	let compound = $.uint(x, 32)
	compound = Math.imul(compound, $.uint(y, 32)) >>> 0
	if ($.uint(compound, 32) != $.uint(want, 32)) {
		await $.println("uint32 *=", $.uint(x, 32), "*", $.uint(y, 32), "got", $.uint(compound, 32), "want", $.uint(want, 32))
	}
}

export async function checkInt32(x: number, y: number, want: number): globalThis.Promise<void> {
	let got = $.int(Math.imul(x, y), 32)
	if ($.int(got, 32) != $.int(want, 32)) {
		await $.println("int32", $.int(x, 32), "*", $.int(y, 32), "got", $.int(got, 32), "want", $.int(want, 32))
	}

	let compound = $.int(x, 32)
	compound = Math.imul(compound, $.int(y, 32))
	if ($.int(compound, 32) != $.int(want, 32)) {
		await $.println("int32 *=", $.int(x, 32), "*", $.int(y, 32), "got", $.int(compound, 32), "want", $.int(want, 32))
	}
}

export async function checkPlatformIntWidths(): globalThis.Promise<void> {
	let neg: bigint = -1n
	if ($.uint(neg, 64) == $.uint(0xffffffff, 64)) {
		await $.println("uint is 32-bit")
	}
	if ($.int(neg) == $.int(0xffffffff)) {
		await $.println("int is 32-bit")
	}
	if ($.uint($.uint(neg, 64), 64) == $.uint($.uint(0xffffffff, 64), 64)) {
		await $.println("uintptr is 32-bit")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on imul_32bit.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class multiplyCase {
	public get x(): number {
		return this._fields.x.value
	}
	public set x(value: number) {
		this._fields.x.value = value
	}

	public get y(): number {
		return this._fields.y.value
	}
	public set y(value: number) {
		this._fields.y.value = value
	}

	public get unsigned(): number {
		return this._fields.unsigned.value
	}
	public set unsigned(value: number) {
		this._fields.unsigned.value = value
	}

	public get signed(): number {
		return this._fields.signed.value
	}
	public set signed(value: number) {
		this._fields.signed.value = value
	}

	public _fields: {
		x: $.VarRef<number>
		y: $.VarRef<number>
		unsigned: $.VarRef<number>
		signed: $.VarRef<number>
	}

	constructor(init?: Partial<{x?: number, y?: number, unsigned?: number, signed?: number}>) {
		this._fields = {
			x: $.varRef(init?.x ?? (0 as number)),
			y: $.varRef(init?.y ?? (0 as number)),
			unsigned: $.varRef(init?.unsigned ?? (0 as number)),
			signed: $.varRef(init?.signed ?? (0 as number))
		}
	}

	public clone(): multiplyCase {
		const cloned = new multiplyCase()
		cloned._fields = {
			x: $.varRef(this._fields.x.value),
			y: $.varRef(this._fields.y.value),
			unsigned: $.varRef(this._fields.unsigned.value),
			signed: $.varRef(this._fields.signed.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.multiplyCase",
		() => new multiplyCase(),
		[],
		multiplyCase,
		[{ name: "x", key: "x", type: { kind: $.TypeKind.Basic, name: "uint32" } }, { name: "y", key: "y", type: { kind: $.TypeKind.Basic, name: "uint32" } }, { name: "unsigned", key: "unsigned", type: { kind: $.TypeKind.Basic, name: "uint32" } }, { name: "signed", key: "signed", type: { kind: $.TypeKind.Basic, name: "int32" } }]
	)
}

export async function main(): globalThis.Promise<void> {
	let cases: $.Slice<multiplyCase> = $.arrayToSlice<multiplyCase>([$.markAsStructValue(new multiplyCase({x: $.uint(65535, 32), y: $.uint(65535, 32), unsigned: $.uint(4294836225, 32), signed: $.int(-131071, 32)})), $.markAsStructValue(new multiplyCase({x: $.uint(134217729, 32), y: $.uint(134217729, 32), unsigned: $.uint(268435457, 32), signed: $.int(268435457, 32)})), $.markAsStructValue(new multiplyCase({x: $.uint(4294967295, 32), y: $.uint(4294967295, 32), unsigned: $.uint(1, 32), signed: $.int(1, 32)})), $.markAsStructValue(new multiplyCase({x: $.uint(4294967295, 32), y: $.uint(3221225473, 32), unsigned: $.uint(1073741823, 32), signed: $.int(1073741823, 32)})), $.markAsStructValue(new multiplyCase({x: $.uint(4294967295, 32), y: $.uint(134217729, 32), unsigned: $.uint(4160749567, 32), signed: $.int(-134217729, 32)}))])

	for (let __goscriptRangeTarget0 = cases, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let tc = __goscriptRangeTarget0![__rangeIndex]
		checkUint32($.uint(tc.x, 32), $.uint(tc.y, 32), $.uint(tc.unsigned, 32))
		checkInt32($.int($.int(tc.x, 32), 32), $.int($.int(tc.y, 32), 32), $.int(tc.signed, 32))
	}

	checkInt32($.int(-2147483647, 32), $.int(-2147483647, 32), $.int(1, 32))
	checkInt32($.int(-2147483648, 32), $.int(-1, 32), $.int(-2147483648, 32))

	checkPlatformIntWidths()
	$.println("ok")
}

export function checkUint32(x: number, y: number, want: number): void {
	let got = $.uint(Math.imul(x, y) >>> 0, 32)
	if ($.uint(got, 32) != $.uint(want, 32)) {
		$.println("uint32", $.uint(x, 32), "*", $.uint(y, 32), "got", $.uint(got, 32), "want", $.uint(want, 32))
	}

	let compound = $.uint(x, 32)
	compound = Math.imul(compound, $.uint(y, 32)) >>> 0
	if ($.uint(compound, 32) != $.uint(want, 32)) {
		$.println("uint32 *=", $.uint(x, 32), "*", $.uint(y, 32), "got", $.uint(compound, 32), "want", $.uint(want, 32))
	}
}

export function checkInt32(x: number, y: number, want: number): void {
	let got = $.int(Math.imul(x, y), 32)
	if ($.int(got, 32) != $.int(want, 32)) {
		$.println("int32", $.int(x, 32), "*", $.int(y, 32), "got", $.int(got, 32), "want", $.int(want, 32))
	}

	let compound = $.int(x, 32)
	compound = Math.imul(compound, $.int(y, 32))
	if ($.int(compound, 32) != $.int(want, 32)) {
		$.println("int32 *=", $.int(x, 32), "*", $.int(y, 32), "got", $.int(compound, 32), "want", $.int(want, 32))
	}
}

export function checkPlatformIntWidths(): void {
	let neg: bigint = -1n
	if ($.uint(neg, 64) == $.uint(0xffffffff, 64)) {
		$.println("uint is 32-bit")
	}
	if ($.int(neg) == $.int(0xffffffff)) {
		$.println("int is 32-bit")
	}
	if ($.uint($.uint(neg, 64), 64) == $.uint($.uint(0xffffffff, 64), 64)) {
		$.println("uintptr is 32-bit")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

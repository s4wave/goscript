// Generated file based on js_global_name_shadow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Family = number

export type Number = number

export class Promise {
	public declare value: string

	constructor(__goscriptValue?: boolean, value$?: string) {
		this.value = value$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Promise {
		return new Promise(true, this.value)
	}

	public __goscriptAssign(source: Promise): this {
		this.value = source.value
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Promise",
		() => new Promise(),
		() => [],
		Promise,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class point {
	public declare x: number

	public declare y: number

	constructor(__goscriptValue?: boolean, x$?: number, y$?: number) {
		this.x = x$ ?? 0
		this.y = y$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): point {
		return new point(true, this.x, this.y)
	}

	public __goscriptAssign(source: point): this {
		this.x = source.x
		this.y = source.y
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.point",
		() => new point(),
		() => [],
		point,
		() => [{ name: "x", key: "x", type: /* @__PURE__ */ $.basicType("int") }, { name: "y", key: "y", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export const Serif: Family = 0

export const Math: Family = 1

export function String(v: number): string {
	return "String"
}

export let Array: $.Slice<string> = $.arrayToSlice<string>(["Array"])

export function __goscript_set_Array(__goscriptValue: $.Slice<string>): void {
	Array = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	let p = new Promise(true, "Promise")
	await $.println("names:", 1, 1.5, String(1), $.arrayIndex(Array!, 0), p.value)

	let a = 7
	let b = 2
	let w = $.int(a, 32)
	await $.println("multiply:", a * b, $.int(globalThis.Math.imul(w, $.int(b, 32)), 32))
	let u = 4000000000
	await $.println("unsigned multiply:", $.uint(globalThis.Math.imul(u, 3) >>> 0, 32))
	await $.println("divide:", globalThis.Math.trunc(a / b), globalThis.Math.trunc(-a / b))

	let r = 128512
	await $.println("rune string:", $.stringEqual($.runeToString(r), "\xf0\x9f\x98\x80"))

	let points: point[] = $.arrayValue(globalThis.Array.from({ length: 2 }, () => new point(true)), /* @__PURE__ */ $.arrayType("main.point", 2))
	points[1].x = 3
	await $.println("array:", points[1].x, points[0].y)

	let big = 1099511627776n
	let f: number = $.int64ToNumber(big)
	await $.println("int64 to float:", f == 1099511627776)
	let n: number = $.int64ToNumber($.int64Shr(big, 20))
	await $.println("int64 to int:", n)
}

if ($.isMainScript(import.meta)) {
	await main()
}

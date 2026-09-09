// Generated file based on tuple_call_forwarding.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class point {
	public declare x: number

	public declare y: number

	public _fields: {
		x: number
		y: number
	}

	constructor(init?: Partial<{x?: number, y?: number}>) {
		this._fields = {
			x: init?.x ?? (0 as number),
			y: init?.y ?? (0 as number)
		}
	}

	public clone(): point {
		return $.markAsStructValue(new point(this))
	}

	static {
		$.bindStructFields(this.prototype, ["x", "y"])
	}

	static __typeInfo = $.registerStructType(
		"main.point",
		() => new point(),
		() => [],
		point,
		() => [{ name: "x", key: "x", type: /* @__PURE__ */ $.basicType("int") }, { name: "y", key: "y", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function pair(a: number, b: number): [number, number] {
	return [a, b]
}

export function sum(a: number, b: number): number {
	return a + b
}

export function triple(a: number, b: number, c: number): [number, number, number] {
	return [a, b, c]
}

export function makePoint(x: number, y: number, z: number): point | $.VarRef<point> | null {
	return new point({x: x + z, y: y})
}

export function shift(p: point | $.VarRef<point> | null): [point | $.VarRef<point> | null, point | $.VarRef<point> | null, point | $.VarRef<point> | null] {
	return [new point({x: $.pointerValue<point>(p).x + 1, y: $.pointerValue<point>(p).y}), new point({x: $.pointerValue<point>(p).x + 2, y: $.pointerValue<point>(p).y}), new point({x: $.pointerValue<point>(p).x + 3, y: $.pointerValue<point>(p).y})]
}

export async function main(): globalThis.Promise<void> {
	await $.println("sum:", sum(...(pair(2, 3) as [number, number])))
	let p: point | $.VarRef<point> | null = makePoint(...(triple(4, 5, 6) as [number, number, number]))
	await $.println("point:", $.pointerValue<point>(p).x, $.pointerValue<point>(p).y)
	let x: point | $.VarRef<point> | null = new point()
	let y: point | $.VarRef<point> | null = new point()
	let z: point | $.VarRef<point> | null = new point()
	let __goscriptTuple0: any = shift(p)
	x = __goscriptTuple0[0]
	y = __goscriptTuple0[1]
	z = __goscriptTuple0[2]
	await $.println("shift:", $.pointerValue<point>(x).x, $.pointerValue<point>(y).x, $.pointerValue<point>(z).x)
}

if ($.isMainScript(import.meta)) {
	await main()
}

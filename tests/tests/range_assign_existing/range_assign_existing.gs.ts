// Generated file based on range_assign_existing.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Vec {
	public declare X: number

	public declare Y: number

	public declare Z: number

	constructor(__goscriptValue?: boolean, X$?: number, Y$?: number, Z$?: number) {
		this.X = X$ ?? 0
		this.Y = Y$ ?? 0
		this.Z = Z$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Vec {
		return new Vec(true, this.X, this.Y, this.Z)
	}

	public __goscriptAssign(source: Vec): this {
		this.X = source.X
		this.Y = source.Y
		this.Z = source.Z
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Vec",
		() => new Vec(),
		() => [],
		Vec,
		() => [{ name: "X", key: "X", type: /* @__PURE__ */ $.basicType("int32") }, { name: "Y", key: "Y", type: /* @__PURE__ */ $.basicType("int32") }, { name: "Z", key: "Z", type: /* @__PURE__ */ $.basicType("int32") }]
	)
}

export class Pos {
	public declare I: number

	public declare J: number

	constructor(__goscriptValue?: boolean, I$?: number, J$?: number) {
		this.I = I$ ?? 0
		this.J = J$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Pos {
		return new Pos(true, this.I, this.J)
	}

	public __goscriptAssign(source: Pos): this {
		this.I = source.I
		this.J = source.J
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Pos",
		() => new Pos(),
		() => [],
		Pos,
		() => [{ name: "I", key: "I", type: /* @__PURE__ */ $.basicType("int") }, { name: "J", key: "J", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export let global = 0

export function __goscript_set_global(__goscriptValue: number): void {
	global = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	// A range over an integer assigns each index to its key, which can be a
	// struct field, an element or a pointer target, not only a variable.
	let sz = new Vec(true, 3, 2, 2)
	let c: Vec = new Vec(true)
	let sum = 0
	for (let __goscriptRangeCount2 = sz.Z, __goscriptRangeKey0 = 0; __goscriptRangeKey0 < __goscriptRangeCount2; __goscriptRangeKey0++) {
		c.Z = __goscriptRangeKey0
		for (let __goscriptRangeCount1 = sz.Y, __goscriptRangeKey1 = 0; __goscriptRangeKey1 < __goscriptRangeCount1; __goscriptRangeKey1++) {
			c.Y = __goscriptRangeKey1
			for (let __goscriptRangeCount0 = sz.X, __goscriptRangeKey2 = 0; __goscriptRangeKey2 < __goscriptRangeCount0; __goscriptRangeKey2++) {
				c.X = __goscriptRangeKey2
				sum = $.int(sum + ($.int((((((c.X + (globalThis.Math.imul(10, c.Y))) | 0)) + (globalThis.Math.imul(100, c.Z))) | 0), 32)), 32)
			}
		}
	}
	await $.println("fields:", sum, c.X, c.Y, c.Z)
	let arr: number[] = $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0))
	for (let __goscriptRangeKey3 = 0; __goscriptRangeKey3 < 4; __goscriptRangeKey3++) {
		arr[1] = __goscriptRangeKey3
		arr[0] += arr[1]
	}
	await $.println("element:", arr[0], arr[1])
	let k = $.varRef<number>(0)
	for (let __goscriptRangeKey4 = 0; __goscriptRangeKey4 < 3; __goscriptRangeKey4++) {
		k!.value = __goscriptRangeKey4
		await $.println("pointer target:", $.pointerValue<number>(k))
	}

	// Variables keep the last key, also when a closure or the package has them.
	let i = 0
	let f = $.functionValue((): number => {
		return i
	}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	for (let __goscriptRangeKey5 = 0; __goscriptRangeKey5 < 5; __goscriptRangeKey5++) {
		i = __goscriptRangeKey5
	}
	for (let __goscriptRangeKey6 = 0; __goscriptRangeKey6 < 4; __goscriptRangeKey6++) {
		global = __goscriptRangeKey6
	}
	await $.println("variables:", i, f(), global)

	// Slices, strings and channels assign their keys and values the same way,
	// and a struct value assigned is a copy of the element.
	let p: Pos = new Pos(true)
	let vs = $.arrayToSlice<Vec>([new Vec(true, 1), new Vec(true, 2)])
	let v: Vec = new Vec(true)
	for (let __goscriptRangeTarget0 = vs, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __goscriptRangeKey7 = 0; __goscriptRangeKey7 < __goscriptRangeWindow0.length; __goscriptRangeKey7++) {
		let __goscriptRangeValue0 = ((__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __goscriptRangeKey7] as Vec)).clone()
		p.I = __goscriptRangeKey7
		v = v.__goscriptAssign((__goscriptRangeValue0).clone())
		v.Y = 9
	}
	await $.println("slice:", p.I, v.X, v.Y, $.arrayIndex(vs!, 1).Y)
	let r = 0
	for (let __goscriptRunes0 = $.stringRunes("h\xc3\xa9"); __goscriptRunes0.next(); ) {
		const __goscriptRangeKey8 = __goscriptRunes0.index
		const __goscriptRangeValue1 = __goscriptRunes0.rune
		p.J = __goscriptRangeKey8
		r = __goscriptRangeValue1
	}
	await $.println("string:", p.J, r)
	let ch = $.makeChannel<number>(2, 0, "both")
	await $.chanSend(ch, 5)
	await $.chanSend(ch, 6)
	ch.close()
	while (true) {
		let __goscriptRange0 = await $.chanRecvWithOk(ch)
		if (!__goscriptRange0.ok) {
			break
		}
		let __goscriptRangeKey9 = __goscriptRange0.value
		c.Z = __goscriptRangeKey9
	}
	await $.println("channel:", c.Z)
}

if ($.isMainScript(import.meta)) {
	await main()
}

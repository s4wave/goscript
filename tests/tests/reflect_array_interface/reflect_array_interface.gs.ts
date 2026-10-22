// Generated file based on reflect_array_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export type Pair = number[]

$.registerNamedType("main.Pair", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2));

export type Counts = globalThis.Map<string, number> | null

$.registerNamedType("main.Counts", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")));

export class Grid {
	public declare N: number[]

	public declare F: number[]

	public declare B: boolean[]

	constructor(__goscriptValue?: boolean, N$?: number[], F$?: number[], B$?: boolean[]) {
		this.N = N$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0))
		this.F = F$ ?? $.arrayValue(globalThis.Array.from({ length: 3 }, () => 0), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 3))
		this.B = B$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => false))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Grid {
		return new Grid(true, $.cloneArrayValue(this.N, __goscriptStatic0()), $.cloneArrayValue(this.F, __goscriptStatic1()), $.cloneArrayValue(this.B, __goscriptStatic2()))
	}

	public __goscriptAssign(source: Grid): this {
		this.N = $.assignFieldValue(this.N, source.N, __goscriptStatic0())
		this.F = $.assignFieldValue(this.F, source.F, __goscriptStatic1())
		this.B = $.assignFieldValue(this.B, source.B, __goscriptStatic2())
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Grid",
		() => new Grid(),
		() => [],
		Grid,
		() => [/* @__PURE__ */ $.structField("N", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2), [0], 0, true), /* @__PURE__ */ $.structField("F", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 3), [1], 16, true), /* @__PURE__ */ $.structField("B", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("bool"), 2), [2], 28, true)]
	)
}

export async function main(): globalThis.Promise<void> {
	// Set array fields from array values converted to interfaces.
	let g: $.VarRef<Grid> = $.varRef(new Grid(true))
	let v = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(g, "*main.Grid", /* @__PURE__ */ $.pointerType("main.Grid"))))).Elem()))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Field(0))).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.arrayValue([3, 4]), "[2]int", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))))))
	let f = $.arrayValue([1, 2, 3], __goscriptStatic1())
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Field(1))).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.cloneArrayValue(f, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 3)), "[3]float32", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 3))))))
	let b: any = $.interfaceValue($.arrayValue([true, false]), "[2]bool", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("bool"), 2))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Field(2))).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf(b))))
	await $.println("fields:", g.value.N[0], g.value.N[1], g.value.F[2], g.value.B[0], g.value.B[1])

	// Set a whole array through a pointer.
	let arr: $.VarRef<number[]> = $.varRef($.arrayValue(globalThis.Array.from({ length: 2 }, () => 0)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(arr, "*[2]int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)))))).Elem())).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.arrayValue([5, 6]), "[2]int", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))))))
	await $.println("array:", arr.value[0], arr.value[1])

	// Array types keep their length and element type, and named array and
	// map types their names.
	await $.println("types:", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.interfaceValue(f, "[3]float32", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 3)))).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.interfaceValue($.arrayValue(new Uint8Array(2)), "[2]uint8", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2)))).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("named:", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.interfaceValue($.arrayValue(globalThis.Array.from({ length: 2 }, () => 0)), "[2]int", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)))).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.interfaceValue($.arrayValue(globalThis.Array.from({ length: 2 }, () => 0)), "main.Pair", "main.Pair"))).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.interfaceValue($.arrayValue(globalThis.Array.from({ length: 2 }, () => 0)), "main.Pair", "main.Pair"))).Name(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("maps:", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.interfaceValue($.makeMap<string, number>([]), "map[string]int", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int"))))).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.interfaceValue($.makeMap<string, number>([]), "main.Counts", "main.Counts"))).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	// The interface holds a copy of the array.
	let a = $.arrayValue([1, 2])
	let x: any = $.interfaceValue($.cloneArrayValue(a, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)), "[2]int", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
	a[0] = 9
	await $.println("copy:", ($.mustTypeAssert<number[]>(x, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)))[0])

	// Type assertions and switches see the array type.
	{
		const __goscriptTypeSwitchValue = x
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic3())) {
			case 0:
				{
					let y: number[] = $.cloneArrayValue($.typeAssert<number[]>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3)).value, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3))
					await $.println("switch: [3]int", y[0])
				}
				break
			case 1:
				{
					let y: number[] = $.cloneArrayValue($.typeAssert<number[]>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)).value, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
					await $.println("switch: [2]int", y[0])
				}
				break
		}
	}
	let p: any = $.interfaceValue($.arrayValue([4, 5]), "main.Pair", "main.Pair")
	let [, isPair] = $.typeAssertTuple<Pair>(p, "main.Pair")
	let [, isPlain] = $.typeAssertTuple<number[]>(p, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
	await $.println("assert:", isPair, isPlain, $.comparableEqual(x, $.interfaceValue($.arrayValue([1, 2]), "[2]int", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))), $.comparableEqual(x, $.interfaceValue($.arrayValue([9, 2]), "[2]int", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 3))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("bool"), 2))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 3), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)]))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on type_switch_site_cache.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Shape = {
	Area(): number
}

$.registerInterfaceType(
	"main.Shape",
	null,
	[{ name: "Area", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export type Namer = {
	Name(): string
}

$.registerInterfaceType(
	"main.Namer",
	null,
	[{ name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export type Celsius = number

$.registerNamedValueType(
	"main.Celsius",
	{Name: (receiver: any) => (Celsius_Name as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("Name", [], [/* @__PURE__ */ $.basicType("string")])]
);

$.registerNamedValueType(
	"*main.Celsius",
	{Name: (receiver: any) => (Celsius_Name as any)($.pointerValue(receiver))},
	[$.methodSignature("Name", [], [/* @__PURE__ */ $.basicType("string")])]
);

export type Count = number

export class Square {
	public declare S: number

	constructor(__goscriptValue?: boolean, S$?: number) {
		this.S = S$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Square {
		return new Square(true, this.S)
	}

	public __goscriptAssign(source: Square): this {
		this.S = source.S
		return this
	}

	public Area(): number {
		const s = this;
		return s.S * s.S
	}

	public Name(): string {
		const s = this;
		return "square"
	}

	static __typeInfo = $.registerStructType(
		"main.Square",
		() => new Square(),
		() => [{ name: "Area", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		Square,
		() => [{ name: "S", key: "S", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function Celsius_Name(c: Celsius): string {
	return "celsius"
}

export function localA(): any {
	type T = number
	return $.namedValueInterfaceValue<any>(1, "main.T·mr81g", {}, /* @__PURE__ */ $.basicType("int", "main.T·mr81g"))
}

export function localB(): any {
	type T = string
	return $.namedValueInterfaceValue<any>("b", "main.T·vp3w4o", {}, /* @__PURE__ */ $.basicType("string", "main.T·vp3w4o"))
}

export function classify(v: any): string {
	{
		const __goscriptTypeSwitchValue = v
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic0())) {
			case 0:
				{
					let x: any = __goscriptTypeSwitchValue
					return "nil"
				}
				break
			case 1:
				{
					let x: number = $.typeAssert<number>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int")).value
					return "int"
				}
				break
			case 2:
				{
					let x: string = $.typeAssert<string>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("string")).value
					return "string " + x
				}
				break
			case 3:
				{
					let x: Celsius = $.typeAssert<Celsius>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.basicType("int", "main.Celsius")).value
					return "celsius " + Celsius_Name(x)
				}
				break
			case 4:
				{
					let x: Square | $.VarRef<Square> | null = $.typeAssert<Square | $.VarRef<Square> | null>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.pointerType("main.Square")).value
					if (x == null) {
						return "nil *Square"
					}
					return "*Square " + $.pointerValue<Square>(x).Name()
				}
				break
			case 5:
				{
					let x: Namer | null = $.typeAssert<Namer | null>(__goscriptTypeSwitchValue, "main.Namer").value
					return "namer " + (x !== null && (x as any).__isVarRef !== true && ((x as any).__goValue === undefined || (x as any).__goType?.charCodeAt(0) !== 42) ? (x as Exclude<Namer, null>) : $.pointerValue<Exclude<Namer, null>>(x)).Name()
				}
				break
			case 6:
				{
					let x: Shape | null = $.typeAssert<Shape | null>(__goscriptTypeSwitchValue, "main.Shape").value
					return "shape"
				}
				break
			case 7:
				{
					let x: $.Slice<number> = $.typeAssert<$.Slice<number>>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))).value
					return "[]int"
				}
				break
			case 8:
				{
					let x: (() => number | globalThis.Promise<number>) | null = $.typeAssert<(() => number | globalThis.Promise<number>) | null>(__goscriptTypeSwitchValue, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)).value
					return "func"
				}
				break
			default:
				{
					let x: any = __goscriptTypeSwitchValue
					return "other"
				}
				break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function main(): globalThis.Promise<void> {
	let nilSquare: Square | $.VarRef<Square> | null = null! as Square | $.VarRef<Square> | null
	let sq = new Square(false, 2)
	let values = $.arrayToSlice<any>([null, $.basicInterfaceValue(1, "int"), "a", __goscriptStatic4(), $.namedValueInterfaceValue<any>(4, "main.Count", {}, /* @__PURE__ */ $.basicType("int", "main.Count")), $.structInterfaceValue(new Square(true, 2), "main.Square", "main.Square"), $.interfaceValue(sq, "*main.Square", /* @__PURE__ */ $.pointerType("main.Square")), $.interfaceValue(nilSquare, "*main.Square", /* @__PURE__ */ $.pointerType("main.Square")), $.interfaceValue($.arrayToSlice<number>([1]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))), $.interfaceValue($.functionValue((): number => {
		return 1
	}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)), "func() int", ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)), $.basicInterfaceValue(2.5, "float64"), localA(), localB(), $.structInterfaceValue(new Square(true, 3), "main.Square", "main.Square"), $.interfaceValue(new Square(false, 5), "*main.Square", /* @__PURE__ */ $.pointerType("main.Square")), __goscriptStatic5(), $.namedValueInterfaceValue<any>(7, "main.Count", {}, /* @__PURE__ */ $.basicType("int", "main.Count")), "b", $.basicInterfaceValue(8, "int")])

	// Each value takes the same case the first time and again, when the
	// switch has seen its type.
	for (let pass = 0; pass < 3; pass++) {
		for (let __goscriptRangeTarget0 = values, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
			let v = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + i] as any)
			await $.println(pass, i, classify(v))
		}
	}
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.typeSwitchSite([null, /* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int", "main.Celsius"), /* @__PURE__ */ $.pointerType("main.Square"), "main.Namer", "main.Shape", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({Name: (receiver: any) => (Celsius_Name as any)(($.isVarRef(receiver) ? receiver.value : receiver))})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (/* @__PURE__ */ $.basicType("int", "main.Celsius"))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([$.methodSignature("Name", [], [/* @__PURE__ */ $.basicType("string")])])
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ($.namedValueInterfaceValue<any>(3, "main.Celsius", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3()))
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ($.namedValueInterfaceValue<any>(6, "main.Celsius", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3()))
}

if ($.isMainScript(import.meta)) {
	await main()
}

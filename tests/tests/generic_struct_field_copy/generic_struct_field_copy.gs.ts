// Generated file based on generic_struct_field_copy.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Value {
	public declare V: number

	public declare Unit: number

	constructor(__goscriptValue?: boolean, V$?: number, Unit$?: number) {
		this.V = V$ ?? 0
		this.Unit = Unit$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Value {
		return new Value(true, this.V, this.Unit)
	}

	public __goscriptAssign(source: Value): this {
		this.V = source.V
		this.Unit = source.Unit
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Value",
		() => new Value(),
		() => [],
		Value,
		() => [{ name: "V", key: "V", type: /* @__PURE__ */ $.basicType("int") }, { name: "Unit", key: "Unit", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Sides {
	public declare Top: any

	public declare Right: any

	public declare Bottom: any

	public declare Left: any

	constructor(__goscriptValue?: boolean, Top$?: any, Right$?: any, Bottom$?: any, Left$?: any) {
		this.Top = Top$ ?? (null! as any)
		this.Right = Right$ ?? (null! as any)
		this.Bottom = Bottom$ ?? (null! as any)
		this.Left = Left$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Sides {
		return $.copyGenericInstance(this, new Sides(true, $.copyElement(this.Top), $.copyElement(this.Right), $.copyElement(this.Bottom), $.copyElement(this.Left)))
	}

	public __goscriptAssign(source: Sides): this {
		this.Top = $.assignFieldValue(this.Top, source.Top)
		this.Right = $.assignFieldValue(this.Right, source.Right)
		this.Bottom = $.assignFieldValue(this.Bottom, source.Bottom)
		this.Left = $.assignFieldValue(this.Left, source.Left)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Sides",
		() => new Sides(),
		() => [],
		Sides,
		() => [{ name: "Top", key: "Top", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Right", key: "Right", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Bottom", key: "Bottom", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Left", key: "Left", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class Values {
	public declare Sides: Sides

	constructor(__goscriptValue?: boolean, Sides$?: Sides) {
		this.Sides = Sides$ ?? new Sides(true, new Value(true), new Value(true), new Value(true), new Value(true))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Values {
		return new Values(true, this.Sides.clone())
	}

	public __goscriptAssign(source: Values): this {
		this.Sides.__goscriptAssign(source.Sides)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Values",
		() => new Values(),
		() => [],
		Values,
		() => [{ name: "Sides", key: "Sides", type: /* @__PURE__ */ $.genericStructType("main.Sides", "main.Sides[main.Value]", () => [/* @__PURE__ */ $.structField("Top", "main.Value", [0], 0, true), /* @__PURE__ */ $.structField("Right", "main.Value", [1], 16, true), /* @__PURE__ */ $.structField("Bottom", "main.Value", [2], 32, true), /* @__PURE__ */ $.structField("Left", "main.Value", [3], 48, true)]), anonymous: true }]
	)
}

export class Pair {
	public declare Key: any

	public declare Val: any

	constructor(__goscriptValue?: boolean, Key$?: any, Val$?: any) {
		this.Key = Key$ ?? (null! as any)
		this.Val = Val$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Pair {
		return $.copyGenericInstance(this, new Pair(true, this.Key, $.copyElement(this.Val)))
	}

	public __goscriptAssign(source: Pair): this {
		this.Key = $.assignFieldValue(this.Key, source.Key)
		this.Val = $.assignFieldValue(this.Val, source.Val)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Pair",
		() => new Pair(),
		() => [],
		Pair,
		() => [{ name: "Key", key: "Key", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Val", key: "Val", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class withClone {
	public declare clone: (() => number | globalThis.Promise<number>) | null

	public declare n: number

	constructor(init?: Partial<{clone?: (() => number | globalThis.Promise<number>) | null, n?: number}>, __goscriptValue?: boolean) {
		this.clone = init?.clone ?? (null! as (() => number | globalThis.Promise<number>) | null)
		this.n = init?.n ?? (0 as number)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public __goscriptClone(): withClone {
		return new withClone(this, true)
	}

	public __goscriptAssign(source: withClone): this {
		this.clone = source.clone
		this.n = source.n
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.withClone",
		() => new withClone(),
		() => [],
		withClone,
		() => [{ name: "clone", key: "clone", type: ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo) }, { name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	// the zero value of an instance holds zero values of its type argument
	let v: Values = new Values(true)
	v.Sides.Top.V = 1
	let w = (v).clone()
	w.Sides.Top.V = 2
	w.Sides.Right.Unit = 3
	await $.println("zero copy:", v.Sides.Top.V, w.Sides.Top.V, v.Sides.Right.Unit, w.Sides.Right.Unit)

	// each zero value is its own
	let s: Sides = new Sides(true, new Value(true), new Value(true), new Value(true), new Value(true))
	s.Top.V = 4
	await $.println("own zero:", s.Top.V, s.Right.V, s.Bottom.V, s.Left.V)

	// copies of type argument fields of struct, array, pointer and unnamed
	// struct types
	let arr = new Sides(true, $.arrayValue([1, 2]), $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0)), $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0)), $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0)))
	let arr2 = (arr).clone()
	arr2.Top[0] = 9
	await $.println("array:", arr.Top[0], arr2.Top[0])
	let p = new Value(false, 5)
	let ptr = new Sides(true, p, null! as Value | $.VarRef<Value> | null, null! as Value | $.VarRef<Value> | null, null! as Value | $.VarRef<Value> | null)
	let ptr2 = (ptr).clone()
	$.pointerValue<Value>(ptr2.Top).V = 6
	await $.println("pointer:", $.pointerValue<Value>(p).V, (ptr.Top === ptr2.Top || ($.pointerAliasesMade || (ptr.Top as any)?.__goElementBacking !== undefined) && $.pointerEqual(ptr.Top, ptr2.Top)))
	let anon = new Sides(true, $.anonymousStructValue({A: 1, B: 2}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("A", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("B", /* @__PURE__ */ $.basicType("int"), [1], 8, true)] }), $.anonymousStructValue({"A": 0, "B": 0}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("A", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("B", /* @__PURE__ */ $.basicType("int"), [1], 8, true)] }), $.anonymousStructValue({"A": 0, "B": 0}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("A", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("B", /* @__PURE__ */ $.basicType("int"), [1], 8, true)] }), $.anonymousStructValue({"A": 0, "B": 0}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("A", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("B", /* @__PURE__ */ $.basicType("int"), [1], 8, true)] }))
	let anon2 = (anon).clone()
	anon2.Top.A = 7
	await $.println("unnamed:", anon.Top.A, anon2.Top.A)

	// a struct type argument with a field named clone
	let wc = new Sides(true, $.markAsStructValue(new withClone({clone: $.functionValue((): number => {
		return 8
	}, ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo)), n: 1})), $.markAsStructValue(new withClone()), $.markAsStructValue(new withClone()), $.markAsStructValue(new withClone()))
	let wc2 = (wc).clone()
	wc2.Top.n = 2
	await $.println("field named clone:", wc.Top.n, wc2.Top.n, (wc2.Top.clone!() as number))

	// nested generic instances
	let pr: Pair = new Pair(true, "", new Sides(true, new Value(true), new Value(true), new Value(true), new Value(true)))
	pr.Val.Left.V = 10
	let pr2 = (pr).clone()
	pr2.Val.Left.V = 11
	await $.println("nested:", pr.Val.Left.V, pr2.Val.Left.V, pr2.Val.Top.Unit)

	// slices of instances grow with zero values of their own
	let vals: $.Slice<Values> = $.makeSlice<Values>(2, undefined, undefined, () => new Values(true))
	vals = $.appendOne(vals, new Values(true))
	$.arrayIndex(vals!, 0).Sides.Top.V = 12
	await $.println("slice:", $.arrayIndex(vals!, 0).Sides.Top.V, $.arrayIndex(vals!, 1).Sides.Top.V, $.arrayIndex(vals!, 2).Sides.Top.V)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on struct_assign_interface_fields.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class point {
	public declare X: number

	public declare Y: number

	constructor(__goscriptValue?: boolean, X$?: number, Y$?: number) {
		this.X = X$ ?? 0
		this.Y = Y$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): point {
		return new point(true, this.X, this.Y)
	}

	public __goscriptAssign(source: point): this {
		this.X = source.X
		this.Y = source.Y
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.point",
		() => new point(),
		() => [],
		point,
		() => [{ name: "X", key: "X", type: /* @__PURE__ */ $.basicType("int") }, { name: "Y", key: "Y", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class holder {
	public declare Any: any

	public declare Name: string

	constructor(__goscriptValue?: boolean, Any$?: any, Name$?: string) {
		this.Any = Any$ ?? (null! as any)
		this.Name = Name$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): holder {
		return new holder(true, this.Any, this.Name)
	}

	public __goscriptAssign(source: holder): this {
		this.Any = $.assignFieldValue(this.Any, source.Any)
		this.Name = source.Name
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		() => [],
		holder,
		() => [{ name: "Any", key: "Any", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class pair {
	public declare A: any

	public declare B: any

	constructor(__goscriptValue?: boolean, A$?: any, B$?: any) {
		this.A = A$ ?? (null! as any)
		this.B = B$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): pair {
		return $.copyGenericInstance(this, new pair(true, $.copyElement(this.A), $.copyElement(this.B)))
	}

	public __goscriptAssign(source: pair): this {
		this.A = $.assignFieldValue(this.A, source.A)
		this.B = $.assignFieldValue(this.B, source.B)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.pair",
		() => new pair(),
		() => [],
		pair,
		() => [{ name: "A", key: "A", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "B", key: "B", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class outer {
	public declare P: pair

	constructor(__goscriptValue?: boolean, P$?: pair) {
		this.P = P$ ?? new pair(true, $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0)), $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0)))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): outer {
		return new outer(true, this.P.clone())
	}

	public __goscriptAssign(source: outer): this {
		this.P.__goscriptAssign(source.P)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.outer",
		() => new outer(),
		() => [],
		outer,
		() => [{ name: "P", key: "P", type: /* @__PURE__ */ $.genericStructType("main.pair", "main.pair[[2]int]", () => [/* @__PURE__ */ $.structField("A", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2), [0], 0, true), /* @__PURE__ */ $.structField("B", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2), [1], 16, true)]) }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Interface fields keep their values through an assignment through a pointer.
	let h = new holder(true, $.structInterfaceValue(new point(true, 1, 2), "main.point", "main.point"), "h")
	let g: $.VarRef<holder> = $.varRef(new holder(true))
	let pg = g
	let pg$: holder = pg == null ? $.pointerTarget<holder>(pg) : (pg as any).__isVarRef === true ? (pg as any).value : (pg as any).__goValue === undefined ? (pg as any) : $.pointerTarget<holder>(pg);
	;(pg$ as holder).__goscriptAssign(h)
	await $.println($.mustTypeAssert<point>((pg$ as holder).Any, "main.point").X, (pg$ as holder).Name)

	// Array values in type parameter fields are copied.
	let o = new outer(true, new pair(true, $.arrayValue([1, 2]), $.arrayValue([3, 4])))
	let c: $.VarRef<outer> = $.varRef(new outer(true))
	let pc = c
	let pc$: outer = pc == null ? $.pointerTarget<outer>(pc) : (pc as any).__isVarRef === true ? (pc as any).value : (pc as any).__goValue === undefined ? (pc as any) : $.pointerTarget<outer>(pc);
	;(pc$ as outer).__goscriptAssign((o).clone());
	;(pc$ as outer).P.A[0] = 10
	await $.println(o.P.A[0], ((pc$ as outer).P.A)[0], ((pc$ as outer).P.B)[1])

	// Struct values in type parameter fields are copied.
	let s = new pair(true, new point(true, 5, 6), new point(true))
	let t = new pair(false, new point(true), new point(true))
	let t$: pair = t == null ? $.pointerTarget<pair>(t) : (t as any).__isVarRef === true ? (t as any).value : (t as any).__goValue === undefined ? (t as any) : $.pointerTarget<pair>(t)
	$.assignStruct((t$ as pair), (s).clone());
	;(t$ as pair).A.X = 50
	await $.println(s.A.X, (t$ as pair).A.X)

	// An array held by an interface field is not shared.
	let a = new holder(true, $.interfaceValue($.arrayValue([7, 8]), "[2]int", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)))
	let b: $.VarRef<holder> = $.varRef(new holder(true))
	let pb = b
	$.pointerValue<holder>(pb).__goscriptAssign(a)
	await $.println(($.mustTypeAssert<number[]>($.pointerValue<holder>(pb).Any, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)))[1])
}

if ($.isMainScript(import.meta)) {
	await main()
}

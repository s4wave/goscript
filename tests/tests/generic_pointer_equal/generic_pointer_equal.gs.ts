// Generated file based on generic_pointer_equal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as slices from "@goscript/slices/index.js"

export class node {
	public declare name: string

	public declare parent: node | $.VarRef<node> | null

	public declare children: $.Slice<node | $.VarRef<node> | null>

	constructor(__goscriptValue?: boolean, name$?: string, parent$?: node | $.VarRef<node> | null, children$?: $.Slice<node | $.VarRef<node> | null>) {
		this.name = name$ ?? ""
		this.parent = parent$ ?? (null! as node | $.VarRef<node> | null)
		this.children = children$ ?? (null! as $.Slice<node | $.VarRef<node> | null>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): node {
		return new node(true, this.name, this.parent, this.children)
	}

	public __goscriptAssign(source: node): this {
		this.name = source.name
		this.parent = source.parent
		this.children = source.children
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.node",
		() => new node(),
		() => [],
		node,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }, { name: "parent", key: "parent", type: /* @__PURE__ */ $.pointerType("main.node") }, { name: "children", key: "children", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.node")) }]
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

export class pair {
	public declare a: point

	public declare b: point

	constructor(__goscriptValue?: boolean, a$?: point, b$?: point) {
		this.a = a$ ?? new point(true)
		this.b = b$ ?? new point(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): pair {
		return new pair(true, this.a.clone(), this.b.clone())
	}

	public __goscriptAssign(source: pair): this {
		this.a.__goscriptAssign(source.a)
		this.b.__goscriptAssign(source.b)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.pair",
		() => new pair(),
		() => [],
		pair,
		() => [{ name: "a", key: "a", type: "main.point" }, { name: "b", key: "b", type: "main.point" }]
	)
}

export function eq(__typeArgs: $.GenericTypeArgs | undefined, a: any, b: any): boolean {
	return $.comparableEqual(a, b)
}

export function newPoint(x: number, y: number): point {
	return new point(true, x, y)
}

export async function main(): globalThis.Promise<void> {
	// Distinct pointers to equal structs, linked in a cycle through their
	// parent, compare by identity.
	let root = new node(false, "root")
	let root$: node = root == null ? $.pointerTarget<node>(root) : (root as any).__isVarRef === true ? (root as any).value : (root as any).__goValue === undefined ? (root as any) : $.pointerTarget<node>(root)
	let a = new node(false, "leaf", root)
	let b = new node(false, "leaf", root);
	;(root$ as node).children = $.arrayToSlice<node | $.VarRef<node> | null>([a, b])
	await $.println("index a:", slices.Index((root$ as node).children, a))
	await $.println("index b:", slices.Index((root$ as node).children, b))
	await $.println("contains root:", slices.Contains((root$ as node).children, root))
	await $.println("eq a b:", eq(__goscriptStatic0(), a, b), "eq a a:", eq(__goscriptStatic0(), a, a))
	await $.println("any a b:", $.comparableEqual($.interfaceValue(a, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), $.interfaceValue(b, "*main.node", /* @__PURE__ */ $.pointerType("main.node"))), "any a a:", $.comparableEqual($.interfaceValue(a, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), $.interfaceValue(a, "*main.node", /* @__PURE__ */ $.pointerType("main.node"))))

	// Struct values compare by their fields wherever they come from.
	let zero: point = new point(true)
	let lit = new point(true, 1, 2)
	let ptr = new point(false, 1, 2)
	let made = $.makeSlice<point>(2, undefined, undefined, () => new point(true))
	$.sliceElems(made!)[$.sliceSlot(made!, 1)].__goscriptAssign(lit)
	let arr = $.arrayValue([new point(true, 1, 2), new point(true, 3, 4)], __goscriptStatic1())
	let m = $.makeMap<string, point>([["k", new point(true, 1, 2)]])
	let p = new pair(true, new point(true, 1, 2))
	await $.println("zero:", eq(__goscriptStatic2(), (zero).clone(), new point(true)), eq(__goscriptStatic2(), (zero).clone(), ($.arrayIndex(made!, 0)).clone()))
	await $.println("deref:", eq(__goscriptStatic2(), (lit).clone(), ($.pointerValue<point>(ptr)).clone()), "slice:", eq(__goscriptStatic2(), (lit).clone(), ($.arrayIndex(made!, 1)).clone()), "array:", eq(__goscriptStatic2(), (lit).clone(), (arr[0]).clone()))
	await $.println("map:", eq(__goscriptStatic2(), (lit).clone(), ($.mapGet<string, point, point>(m, "k", new point(true))[0]).clone()), "field:", eq(__goscriptStatic2(), (lit).clone(), (p.a).clone()), "return:", eq(__goscriptStatic2(), (lit).clone(), newPoint(1, 2)))
	await $.println("differ:", eq(__goscriptStatic2(), (lit).clone(), (arr[1]).clone()), "pair:", eq(__goscriptStatic3(), p, new pair(true, (lit).clone())))
	await $.println("index values:", slices.Index($.arrayToSlice<point>([new point(true, 3, 4), new point(true, 1, 2)]), ($.pointerValue<point>(ptr)).clone()))
	await $.println("any values:", $.comparableEqual($.structInterfaceValue((lit).clone(), "main.point", "main.point"), $.structInterfaceValue(($.pointerValue<point>(ptr)).clone(), "main.point", "main.point")), $.comparableEqual($.structInterfaceValue((lit).clone(), "main.point", "main.point"), $.structInterfaceValue((arr[1]).clone(), "main.point", "main.point")))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.pointerType("main.node"), zero: () => null }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.arrayType("main.point", 2))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.point", zero: () => new point(true) }})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.pair", zero: () => new pair(true) }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on map_interface_pointer_keys.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type namer = {
	name(): string
}

$.registerInterfaceType(
	"main.namer",
	null,
	[{ name: "name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export class node {
	public declare Name: string

	public declare N: number

	constructor(__goscriptValue?: boolean, Name$?: string, N$?: number) {
		this.Name = Name$ ?? ""
		this.N = N$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): node {
		return new node(true, this.Name, this.N)
	}

	public __goscriptAssign(source: node): this {
		this.Name = source.Name
		this.N = source.N
		return this
	}

	public name(): string {
		const n: node | $.VarRef<node> | null = this;
		return $.pointerValue<node>(n).Name
	}

	static __typeInfo = $.registerStructType(
		"main.node",
		() => new node(),
		() => [{ name: "name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }],
		node,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }, { name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class tree {
	public declare Kids: $.Slice<tree | $.VarRef<tree> | null>

	public declare Attrs: globalThis.Map<string, string> | null

	public declare Up: tree | $.VarRef<tree> | null

	constructor(__goscriptValue?: boolean, Kids$?: $.Slice<tree | $.VarRef<tree> | null>, Attrs$?: globalThis.Map<string, string> | null, Up$?: tree | $.VarRef<tree> | null) {
		this.Kids = Kids$ ?? (null! as $.Slice<tree | $.VarRef<tree> | null>)
		this.Attrs = Attrs$ ?? (null! as globalThis.Map<string, string> | null)
		this.Up = Up$ ?? (null! as tree | $.VarRef<tree> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): tree {
		return new tree(true, this.Kids, this.Attrs, this.Up)
	}

	public __goscriptAssign(source: tree): this {
		this.Kids = source.Kids
		this.Attrs = source.Attrs
		this.Up = source.Up
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.tree",
		() => new tree(),
		() => [],
		tree,
		() => [{ name: "Kids", key: "Kids", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.tree")) }, { name: "Attrs", key: "Attrs", type: /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string")) }, { name: "Up", key: "Up", type: /* @__PURE__ */ $.pointerType("main.tree") }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Distinct pointers with equal fields are distinct keys.
	let a = new node(false, "x", 1)
	let b = new node(false, "x", 1)
	let m = $.makeMap<any, number>([])
	$.mapSet(m, $.interfaceValue(a, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 1)
	$.mapSet(m, $.interfaceValue(b, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 2)
	await $.println("any keys:", $.len(m), $.mapGet<any, number, number>(m, $.interfaceValue(a, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 0)[0], $.mapGet<any, number, number>(m, $.interfaceValue(b, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 0)[0])

	// The same holds for keys of a non-empty interface type.
	let n = $.makeMap<namer | null, number>([])
	$.mapSet(n, $.interfaceValue<namer | null>(a, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 1)
	$.mapSet(n, $.interfaceValue<namer | null>(b, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 2)
	const __goscriptMap0 = n
	const __goscriptMapKey0 = $.interfaceValue<namer | null>(a, "*main.node", /* @__PURE__ */ $.pointerType("main.node"))
	$.mapSet(__goscriptMap0, __goscriptMapKey0, $.mapGet<namer | null, number, number>(__goscriptMap0, $.interfaceValue<namer | null>(__goscriptMapKey0, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 0)[0] + 1)
	await $.println("namer keys:", $.len(n), $.mapGet<namer | null, number, number>(n, $.interfaceValue<namer | null>(a, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 0)[0], $.mapGet<namer | null, number, number>(n, $.interfaceValue<namer | null>(b, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 0)[0])
	$.deleteMapEntry(n, $.interfaceValue<namer | null>(a, "*main.node", /* @__PURE__ */ $.pointerType("main.node")))
	let [, okA] = $.mapGet<namer | null, number, number>(n, $.interfaceValue<namer | null>(a, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 0)
	let [, okB] = $.mapGet<namer | null, number, number>(n, $.interfaceValue<namer | null>(b, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 0)
	await $.println("after delete:", $.len(n), okA, okB)

	// Pointers to structs with fields of every kind, as in a traversal map.
	let root = new tree()
	let root$: tree = root == null ? $.pointerTarget<tree>(root) : (root as any).__isVarRef === true ? (root as any).value : (root as any).__goValue === undefined ? (root as any) : $.pointerTarget<tree>(root)
	let visits = $.makeMap<any, number>([])
	for (let i = 0; i < 1000; i++) {
		let kid = new tree(false, undefined, undefined, root);
		;(root$ as tree).Kids = $.appendOne((root$ as tree).Kids, kid, $.appendZeros.nil)
		$.mapSet(visits, $.interfaceValue(kid, "*main.tree", /* @__PURE__ */ $.pointerType("main.tree")), i)
	}
	$.mapSet(visits, $.interfaceValue(root, "*main.tree", /* @__PURE__ */ $.pointerType("main.tree")), -1)
	let sum = 0
	for (let __goscriptRangeTarget0 = (root$ as tree).Kids, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let kid = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as tree | $.VarRef<tree> | null)
		sum += $.mapGet<any, number, number>(visits, $.interfaceValue(kid, "*main.tree", /* @__PURE__ */ $.pointerType("main.tree")), 0)[0]
	}
	await $.println("tree keys:", $.len(visits), $.mapGet<any, number, number>(visits, $.interfaceValue(root, "*main.tree", /* @__PURE__ */ $.pointerType("main.tree")), 0)[0], sum, $.mapGet<any, number, number>(visits, $.interfaceValue($.plainSliceIndex((root$ as tree).Kids!, 7), "*main.tree", /* @__PURE__ */ $.pointerType("main.tree")), 0)[0])

	// Typed nil pointers of the same type are equal keys.
	let n1: node | $.VarRef<node> | null = null! as node | $.VarRef<node> | null
	let n2: node | $.VarRef<node> | null = null! as node | $.VarRef<node> | null
	let nils = $.makeMap<any, number>([])
	$.mapSet(nils, $.interfaceValue(n1, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 1)
	$.mapSet(nils, $.interfaceValue(n2, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 2)
	await $.println("typed nils:", $.len(nils), $.mapGet<any, number, number>(nils, $.interfaceValue(n1, "*main.node", /* @__PURE__ */ $.pointerType("main.node")), 0)[0])

	// Struct values with equal fields are the same key.
	let v = $.makeMap<any, number>([])
	$.mapSet(v, $.structInterfaceValue(new node(true, "x", 1), "main.node", "main.node"), 1)
	$.mapSet(v, $.structInterfaceValue(new node(true, "x", 1), "main.node", "main.node"), 2)
	await $.println("value keys:", $.len(v), $.mapGet<any, number, number>(v, $.structInterfaceValue(new node(true, "x", 1), "main.node", "main.node"), 0)[0])
}

if ($.isMainScript(import.meta)) {
	await main()
}

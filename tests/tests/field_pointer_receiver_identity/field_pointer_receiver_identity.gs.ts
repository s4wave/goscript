// Generated file based on field_pointer_receiver_identity.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as slices from "@goscript/slices/index.js"

export type Namer = {
	Is(p: Node | $.VarRef<Node> | null): boolean
	Register(): void
}

$.registerInterfaceType(
	"main.Namer",
	null,
	[{ name: "Is", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Register", args: [], returns: [] }]
);

export class Node {
	public declare name: string

	public declare self: Node | $.VarRef<Node> | null

	constructor(__goscriptValue?: boolean, name$?: string, self$?: Node | $.VarRef<Node> | null) {
		this.name = name$ ?? ""
		this.self = self$ ?? (null! as Node | $.VarRef<Node> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Node {
		return new Node(true, this.name, this.self)
	}

	public __goscriptAssign(source: Node): this {
		this.name = source.name
		this.self = source.self
		return this
	}

	public Is(p: Node | $.VarRef<Node> | null): boolean {
		const n: Node | $.VarRef<Node> | null = this;
		return (n === p || ($.pointerAliasesMade || (n as any)?.__goElementBacking !== undefined) && $.pointerEqual(n, p))
	}

	public Register(): void {
		const n: Node | $.VarRef<Node> | null = this;
		$.pointerValue<Node>(n).self = n
		registry = $.appendOne(registry, n, $.appendZeros.nil)
		const __goscriptMap0 = counts
		const __goscriptMapKey0 = n
		$.mapSet(__goscriptMap0, __goscriptMapKey0, $.mapGet<Node | $.VarRef<Node> | null, number, number>(__goscriptMap0, __goscriptMapKey0, 0)[0] + (1))
	}

	public Rename(name: string): void {
		const n: Node | $.VarRef<Node> | null = this;
		$.pointerValue<Node>(n).name = name
	}

	static __typeInfo = $.registerStructType(
		"main.Node",
		() => new Node(),
		() => [{ name: "Is", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Register", args: [], returns: [], pointerReceiver: true }, { name: "Rename", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		Node,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }, { name: "self", key: "self", type: /* @__PURE__ */ $.pointerType("main.Node") }]
	)
}

export class Item {
	public declare Node: Node

	public declare Child: Node

	public declare Group: {"Leaf": Node}

	public declare List: $.Slice<Node>

	public declare Pair: Node[]

	constructor(__goscriptValue?: boolean, Node$?: Node, Child$?: Node, Group$?: {"Leaf": Node}, List$?: $.Slice<Node>, Pair$?: Node[]) {
		this.Node = Node$ ?? new Node(true)
		this.Child = Child$ ?? new Node(true)
		this.Group = Group$ ?? $.anonymousStructValue({"Leaf": new Node(true)}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Leaf", "main.Node", [0], 0, true)] })
		this.List = List$ ?? (null! as $.Slice<Node>)
		this.Pair = Pair$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => new Node(true)), /* @__PURE__ */ $.arrayType("main.Node", 2))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Item {
		return new Item(true, this.Node.clone(), this.Child.clone(), $.markAsStructValue($.cloneStructValue(this.Group)), this.List, $.cloneArrayValue(this.Pair, /* @__PURE__ */ $.arrayType("main.Node", 2)))
	}

	public __goscriptAssign(source: Item): this {
		this.Node.__goscriptAssign(source.Node)
		this.Child.__goscriptAssign(source.Child)
		$.assignStruct(this.Group, source.Group)
		this.List = source.List
		this.Pair = $.assignFieldValue(this.Pair, source.Pair, /* @__PURE__ */ $.arrayType("main.Node", 2))
		return this
	}

	public Is(p: any): any {
		const __receiver = $.fieldRef(this, "Node")
		return __receiver.value.Is.call(__receiver, p)
	}

	public Register(): any {
		const __receiver = $.fieldRef(this, "Node")
		return __receiver.value.Register.call(__receiver)
	}

	public Rename(name: any): any {
		return $.pointerValue<Node>(this.Node).Rename(name)
	}

	static __typeInfo = $.registerStructType(
		"main.Item",
		() => new Item(),
		() => [{ name: "Is", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Register", args: [], returns: [], pointerReceiver: true }, { name: "Rename", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		Item,
		() => [{ name: "Node", key: "Node", type: "main.Node", anonymous: true }, { name: "Child", key: "Child", type: "main.Node" }, { name: "Group", key: "Group", type: { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Leaf", "main.Node", [0], 0, true)] } }, { name: "List", key: "List", type: /* @__PURE__ */ $.sliceType("main.Node") }, { name: "Pair", key: "Pair", type: /* @__PURE__ */ $.arrayType("main.Node", 2) }]
	)
}

export class Box {
	public declare values: $.Slice<any>

	constructor(__goscriptValue?: boolean, values$?: $.Slice<any>) {
		this.values = values$ ?? (null! as $.Slice<any>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Box {
		return new Box(true, this.values)
	}

	public __goscriptAssign(source: Box): this {
		this.values = source.values
		return this
	}

	public Add(__typeArgs: $.GenericTypeArgs | undefined, value: any): void {
		const b: Box | $.VarRef<Box> | null = this;
		const b$: Box = b == null ? $.pointerTarget<Box>(b) : (b as any).__isVarRef === true ? (b as any).value : (b as any).__goValue === undefined ? (b as any) : $.pointerTarget<Box>(b);
		;(b$ as Box).values = $.append((b$ as Box).values, value, $.appendZero(() => ($.genericZero(__typeArgs, "T", null) as any)))
	}

	public Get(__typeArgs: $.GenericTypeArgs | undefined, i: number): any {
		const b: Box | $.VarRef<Box> | null = this;
		let value = $.copyElement($.arrayIndex($.pointerValue<Box>(b).values!, i))
		return $.copyElement(value)
	}

	static __typeInfo = $.registerStructType(
		"main.Box",
		() => new Box(),
		() => [{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }, { name: "Get", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }], pointerReceiver: true }],
		Box,
		() => [{ name: "values", key: "values", type: /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }) }]
	)
}

export let registry: $.Slice<Node | $.VarRef<Node> | null> = null! as $.Slice<Node | $.VarRef<Node> | null>

export function __goscript_set_registry(__goscriptValue: $.Slice<Node | $.VarRef<Node> | null>): void {
	registry = __goscriptValue
}

export let counts: globalThis.Map<Node | $.VarRef<Node> | null, number> | null = $.makeMap<Node | $.VarRef<Node> | null, number>([], /* @__PURE__ */ $.pointerType("main.Node"))

export function __goscript_set_counts(__goscriptValue: globalThis.Map<Node | $.VarRef<Node> | null, number> | null): void {
	counts = __goscriptValue
}

export let global: $.VarRef<Node> = $.varRef(new Node(true))

export function __goscript_set_global(__goscriptValue: Node): void {
	$.assignStruct(global.value, __goscriptValue)
}

export async function main(): globalThis.Promise<void> {
	let item: $.VarRef<Item> = $.varRef(new Item(true))
	item.value.List = $.makeSlice<Node>(2, undefined, undefined, () => new Node(true))

	// A field's receiver is the field's address.
	let child = $.fieldRef(item.value, "Child")
	$.callPointerMethod($.fieldRef(item.value, "Child"), "Register")
	await $.println("field:", (item.value.Child.self === child || ($.pointerAliasesMade || (item.value.Child.self as any)?.__goElementBacking !== undefined) && $.pointerEqual(item.value.Child.self, child)), $.callPointerMethod($.fieldRef(item.value, "Child"), "Is", child), (child !== null && (child as any).__isVarRef !== true && (child as any).__goValue === undefined ? ((child as any) as Node).Is($.fieldRef(item.value, "Child")) : Node.prototype.Is.call(child, $.fieldRef(item.value, "Child"))))

	// An embedded struct's receiver, called directly, promoted, and through
	// an interface.
	$.callPointerMethod($.fieldRef(item.value, "Node"), "Register")
	await $.println("embedded:", $.pointerEqual(item.value.Node.self, $.fieldRef(item.value, "Node")), $.callPointerMethod($.fieldRef(item.value, "Node"), "Is", $.fieldRef(item.value, "Node")))
	let namer: Namer | null = $.interfaceValue<Namer | null>(item, "*main.Item", /* @__PURE__ */ $.pointerType("main.Item"))
	await $.println("interface:", (__goscriptAwait = (namer !== null && (namer as any).__isVarRef !== true && ((namer as any).__goValue === undefined || (namer as any).__goType?.charCodeAt(0) !== 42) ? (namer as Exclude<Namer, null>) : $.pointerValue<Exclude<Namer, null>>(namer)).Is($.fieldRef(item.value, "Node")), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), $.pointerEqual($.arrayIndex(registry!, 1), $.fieldRef(item.value, "Node")))

	// Nested fields, fields reached through a pointer, slice and array
	// elements.
	$.callPointerMethod($.fieldRef(item.value.Group, "Leaf"), "Register")
	await $.println("nested:", $.pointerEqual(item.value.Group.Leaf.self, $.fieldRef(item.value.Group, "Leaf")))
	let ptr = item
	let ptr$: Item = ptr == null ? $.pointerTarget<Item>(ptr) : (ptr as any).__isVarRef === true ? (ptr as any).value : (ptr as any).__goValue === undefined ? (ptr as any) : $.pointerTarget<Item>(ptr)
	void (ptr$ as Item).Child.Rename("child")
	await $.println("through pointer:", $.callPointerMethod($.fieldRef((ptr$ as Item), "Child"), "Is", $.fieldRef(item.value, "Child")), item.value.Child.name)
	$.callPointerMethod($.indexRef(item.value.List!, 1), "Register")
	await $.println("slice element:", $.pointerEqual($.arrayIndex(item.value.List!, 1).self, $.indexRef(item.value.List!, 1)), $.callPointerMethod($.indexRef(item.value.List!, 1), "Is", $.indexRef(item.value.List!, 1)))
	$.callPointerMethod($.indexRef(item.value.Pair, 0), "Register")
	await $.println("array element:", $.pointerEqual(item.value.Pair[0].self, $.indexRef(item.value.Pair, 0)))

	// Variables, local and package level.
	let local: $.VarRef<Node> = $.varRef(new Node(true))
	$.callPointerMethod(local, "Register")
	await $.println("local:", (local.value.self === local || ($.pointerAliasesMade || (local.value.self as any)?.__goElementBacking !== undefined) && $.pointerEqual(local.value.self, local)), $.callPointerMethod(global, "Is", global))

	// The registry, a pointer-keyed map and interfaces hold the same pointers.
	await $.println("registry:", $.pointerEqual($.arrayIndex(registry!, 0), $.fieldRef(item.value, "Child")), $.mapGet<Node | $.VarRef<Node> | null, number, number>(counts, $.fieldRef(item.value, "Child"), 0)[0], $.mapGet<Node | $.VarRef<Node> | null, number, number>(counts, local, 0)[0], $.len(counts))
	let a: any = $.interfaceValue($.fieldRef(item.value, "Child"), "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))
	let b: any = $.interfaceValue(item.value.Child.self, "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))
	await $.println("any:", $.comparableEqual(a, b))

	// A method value is bound to the field's address.
	let _is: ((p: Node | $.VarRef<Node> | null) => boolean | globalThis.Promise<boolean>) | null = $.functionValue(((__receiver) => (p: Node | $.VarRef<Node> | null) => __receiver.value.Is.call(__receiver, p))($.fieldRef(item.value, "Child")), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo), "main.(*Node).Is-fm")
	await $.println("method value:", (_is!($.fieldRef(item.value, "Child")) as boolean))

	// Generic code and slices keep the pointers rather than copies.
	let box: $.VarRef<Box> = $.varRef(new Box(true))
	box.value.Add(__goscriptStatic0(), item.value.Child.self)
	$.pointerValue<Node>(box.value.Get(__goscriptStatic0(), 0)).name = "boxed"
	let clone = (slices.Clone(registry) as $.Slice<Node | $.VarRef<Node> | null>)
	$.pointerValue<Node>($.arrayIndex(clone!, 0)).name += "+cloned"
	await $.println("generic:", item.value.Child.name, $.pointerEqual(box.value.Get(__goscriptStatic0(), 0), $.fieldRef(item.value, "Child")))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.pointerType("main.Node"), zero: () => null, methods: {Is: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Is(...$.stripGenericTypeArgs(args)), Register: (receiver: any) => $.pointerValue(receiver).Register(), Rename: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Rename(...$.stripGenericTypeArgs(args))} }})
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

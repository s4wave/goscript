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

	public async Wait(ch: $.Channel<boolean> | null): globalThis.Promise<boolean> {
		const n: Node | $.VarRef<Node> | null = this;
		const n$: Node = n == null ? $.pointerTarget<Node>(n) : (n as any).__isVarRef === true ? (n as any).value : (n as any).__goValue === undefined ? (n as any) : $.pointerTarget<Node>(n)
		await $.chanRecv(ch);
		;(n$ as Node).self = n
		return ((n$ as Node).self === n || ($.pointerAliasesMade || ((n$ as Node).self as any)?.__goElementBacking !== undefined) && $.pointerEqual((n$ as Node).self, n))
	}

	static __typeInfo = $.registerStructType(
		"main.Node",
		() => new Node(),
		() => [{ name: "Is", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Register", args: [], returns: [], pointerReceiver: true }, { name: "Rename", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }],
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
		return Node.prototype.Is.call($.fieldRef(this, "Node"), p)
	}

	public Register(): any {
		return Node.prototype.Register.call($.fieldRef(this, "Node"))
	}

	public Rename(name: any): any {
		return $.pointerValue<Node>(this.Node).Rename(name)
	}

	public async Wait(ch: any): globalThis.Promise<any> {
		return await Node.prototype.Wait.call($.fieldRef(this, "Node"), ch)
	}

	static __typeInfo = $.registerStructType(
		"main.Item",
		() => new Item(),
		() => [{ name: "Is", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Register", args: [], returns: [], pointerReceiver: true }, { name: "Rename", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }],
		Item,
		() => [{ name: "Node", key: "Node", type: "main.Node", anonymous: true }, { name: "Child", key: "Child", type: "main.Node" }, { name: "Group", key: "Group", type: { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Leaf", "main.Node", [0], 0, true)] } }, { name: "List", key: "List", type: /* @__PURE__ */ $.sliceType("main.Node") }, { name: "Pair", key: "Pair", type: /* @__PURE__ */ $.arrayType("main.Node", 2) }]
	)
}

export class Outer {
	public declare Item: Item

	constructor(__goscriptValue?: boolean, Item$?: Item) {
		this.Item = Item$ ?? new Item(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Outer {
		return new Outer(true, this.Item.clone())
	}

	public __goscriptAssign(source: Outer): this {
		this.Item.__goscriptAssign(source.Item)
		return this
	}

	public Is(p: any): any {
		return Node.prototype.Is.call($.fieldRef(this.Item, "Node"), p)
	}

	public Register(): any {
		return Node.prototype.Register.call($.fieldRef(this.Item, "Node"))
	}

	public Rename(name: any): any {
		return $.pointerValue<Item>(this.Item).Node.Rename(name)
	}

	public async Wait(ch: any): globalThis.Promise<any> {
		return await Node.prototype.Wait.call($.fieldRef(this.Item, "Node"), ch)
	}

	static __typeInfo = $.registerStructType(
		"main.Outer",
		() => new Outer(),
		() => [{ name: "Is", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Register", args: [], returns: [], pointerReceiver: true }, { name: "Rename", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }, { name: "Wait", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }],
		Outer,
		() => [{ name: "Item", key: "Item", type: "main.Item", anonymous: true }]
	)
}

export class Self {
	public declare self: Self | $.VarRef<Self> | null

	public declare v: any

	constructor(__goscriptValue?: boolean, self$?: Self | $.VarRef<Self> | null, v$?: any) {
		this.self = self$ ?? (null! as Self | $.VarRef<Self> | null)
		this.v = v$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Self {
		return $.copyGenericInstance(this, new Self(true, this.self, $.copyElement(this.v)))
	}

	public __goscriptAssign(source: Self): this {
		this.self = source.self
		this.v = $.assignFieldValue(this.v, source.v)
		return this
	}

	public Keep(__typeArgs: $.GenericTypeArgs | undefined, v: any): void {
		const s: Self | $.VarRef<Self> | null = this;
		const s$: Self = s == null ? $.pointerTarget<Self>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<Self>(s);
		;(s$ as Self).self = s;
		;(s$ as Self).v = $.copyElement(v)
	}

	static __typeInfo = $.registerStructType(
		"main.Self",
		() => new Self(),
		() => [{ name: "Keep", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		Self,
		() => [{ name: "self", key: "self", type: /* @__PURE__ */ $.pointerType("main.Self") }, { name: "v", key: "v", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class Box {
	public declare values: $.Slice<any>

	constructor(__goscriptValue?: boolean, values$?: $.Slice<any>) {
		this.values = values$ ?? (null! as $.Slice<any>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Box {
		return $.copyGenericInstance(this, new Box(true, this.values))
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
	Node.prototype.Register.call($.fieldRef(item.value, "Child"))
	await $.println("field:", (item.value.Child.self === child || ($.pointerAliasesMade || (item.value.Child.self as any)?.__goElementBacking !== undefined) && $.pointerEqual(item.value.Child.self, child)), Node.prototype.Is.call($.fieldRef(item.value, "Child"), child), (child !== null && (child as any).__isVarRef !== true && (child as any).__goValue === undefined ? ((child as any) as Node).Is($.fieldRef(item.value, "Child")) : Node.prototype.Is.call(child, $.fieldRef(item.value, "Child"))))

	// An embedded struct's receiver, called directly, promoted, and through
	// an interface.
	Node.prototype.Register.call($.fieldRef(item.value, "Node"))
	await $.println("embedded:", $.pointerEqual(item.value.Node.self, $.fieldRef(item.value, "Node")), Node.prototype.Is.call($.fieldRef(item.value, "Node"), $.fieldRef(item.value, "Node")))
	let namer: Namer | null = $.interfaceValue<Namer | null>(item, "*main.Item", /* @__PURE__ */ $.pointerType("main.Item"))
	await $.println("interface:", (__goscriptAwait = (namer !== null && (namer as any).__isVarRef !== true && ((namer as any).__goValue === undefined || (namer as any).__goType?.charCodeAt(0) !== 42) ? (namer as Exclude<Namer, null>) : $.pointerValue<Exclude<Namer, null>>(namer)).Is($.fieldRef(item.value, "Node")), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), $.pointerEqual($.arrayIndex(registry!, 1), $.fieldRef(item.value, "Node")))

	// Nested fields, fields reached through a pointer, slice and array
	// elements.
	Node.prototype.Register.call($.fieldRef(item.value.Group, "Leaf"))
	await $.println("nested:", $.pointerEqual(item.value.Group.Leaf.self, $.fieldRef(item.value.Group, "Leaf")))
	let ptr = item
	let ptr$: Item = ptr == null ? $.pointerTarget<Item>(ptr) : (ptr as any).__isVarRef === true ? (ptr as any).value : (ptr as any).__goValue === undefined ? (ptr as any) : $.pointerTarget<Item>(ptr)
	void (ptr$ as Item).Child.Rename("child")
	await $.println("through pointer:", Node.prototype.Is.call($.fieldRef((ptr$ as Item), "Child"), $.fieldRef(item.value, "Child")), item.value.Child.name)
	Node.prototype.Register.call($.indexRef(item.value.List!, 1))
	await $.println("slice element:", $.pointerEqual($.arrayIndex(item.value.List!, 1).self, $.indexRef(item.value.List!, 1)), Node.prototype.Is.call($.indexRef(item.value.List!, 1), $.indexRef(item.value.List!, 1)))
	Node.prototype.Register.call($.indexRef(item.value.Pair, 0))
	await $.println("array element:", $.pointerEqual(item.value.Pair[0].self, $.indexRef(item.value.Pair, 0)))

	// Variables, local and package level.
	let local: $.VarRef<Node> = $.varRef(new Node(true))
	Node.prototype.Register.call(local)
	await $.println("local:", (local.value.self === local || ($.pointerAliasesMade || (local.value.self as any)?.__goElementBacking !== undefined) && $.pointerEqual(local.value.self, local)), Node.prototype.Is.call(global, global))

	// The registry, a pointer-keyed map and interfaces hold the same pointers.
	await $.println("registry:", $.pointerEqual($.arrayIndex(registry!, 0), $.fieldRef(item.value, "Child")), $.mapGet<Node | $.VarRef<Node> | null, number, number>(counts, $.fieldRef(item.value, "Child"), 0)[0], $.mapGet<Node | $.VarRef<Node> | null, number, number>(counts, local, 0)[0], $.len(counts))
	let a: any = $.interfaceValue($.fieldRef(item.value, "Child"), "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))
	let b: any = $.interfaceValue(item.value.Child.self, "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))
	await $.println("any:", $.comparableEqual(a, b))

	// A method value is bound to the field's address.
	let _is: ((p: Node | $.VarRef<Node> | null) => boolean | globalThis.Promise<boolean>) | null = $.functionValue(((__receiver) => (p: Node | $.VarRef<Node> | null) => Node.prototype.Is.call(__receiver, p))($.fieldRef(item.value, "Child")), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo), "main.(*Node).Is-fm")
	await $.println("method value:", (_is!($.fieldRef(item.value, "Child")) as boolean))

	// Generic code and slices keep the pointers rather than copies.
	let box: $.VarRef<Box> = $.varRef($.genericInstance(new Box(true), __goscriptStatic1))
	box.value.Add(__goscriptStatic0(), item.value.Child.self)
	$.pointerValue<Node>(box.value.Get(__goscriptStatic0(), 0)).name = "boxed"
	let clone = (slices.Clone(registry) as $.Slice<Node | $.VarRef<Node> | null>)
	$.pointerValue<Node>($.arrayIndex(clone!, 0)).name += "+cloned"
	await $.println("generic:", item.value.Child.name, $.pointerEqual(box.value.Get(__goscriptStatic0(), 0), $.fieldRef(item.value, "Child")))

	// Methods promoted from two levels down, called directly and as a value.
	let outer: $.VarRef<Outer> = $.varRef(new Outer(true))
	Node.prototype.Register.call($.fieldRef(outer.value.Item, "Node"))
	await $.println("two levels:", $.pointerEqual(outer.value.Item.Node.self, $.fieldRef(outer.value.Item, "Node")), $.pointerEqual($.arrayIndex(registry!, $.sliceLen(registry) - 1), $.fieldRef(outer.value.Item, "Node")))
	let register: (() => void) | null = $.functionValue(((__receiver) => () => Node.prototype.Register.call(__receiver))($.fieldRef(outer.value.Item, "Node")), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "main.(*Node).Register-fm")
	register!()
	await $.println("promoted method value:", $.pointerEqual($.arrayIndex(registry!, $.sliceLen(registry) - 1), $.fieldRef(outer.value.Item, "Node")), $.mapGet<Node | $.VarRef<Node> | null, number, number>(counts, $.fieldRef(outer.value.Item, "Node"), 0)[0])

	// A generic struct field and an async method keep the field's address.
	let holder: {"B": Self} = $.anonymousStructValue({"B": $.genericInstance(new Self(true, undefined, 0), __goscriptStatic3)}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("B", "main.Self", [0], 0, true)] })
	Self.prototype.Keep.call($.fieldRef(holder, "B"), __goscriptStatic2(), 5)
	await $.println("generic field:", $.pointerEqual(holder.B.self, $.fieldRef(holder, "B")), holder.B.v)
	let ch = $.makeChannel<boolean>(1, false, "both")
	await $.chanSend(ch, true)
	await $.println("async:", await Node.prototype.Wait.call($.fieldRef(item.value, "Child"), ch), $.pointerEqual(item.value.Child.self, $.fieldRef(item.value, "Child")))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.pointerType("main.Node"), zero: () => null, methods: {Is: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Is(...$.stripGenericTypeArgs(args)), Register: (receiver: any) => $.pointerValue(receiver).Register(), Rename: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Rename(...$.stripGenericTypeArgs(args)), Wait: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Wait(...$.stripGenericTypeArgs(args))} }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{Add: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Add(__goscriptStatic0(), ...$.stripGenericTypeArgs(args)), Get: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Get(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("Add", [/* @__PURE__ */ $.pointerType("main.Node")], [], true, false), $.methodSignature("Get", [/* @__PURE__ */ $.basicType("int")], [/* @__PURE__ */ $.pointerType("main.Node")], true, false)]])
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([{Keep: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Keep(__goscriptStatic2(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("Keep", [/* @__PURE__ */ $.basicType("int")], [], true, false)]])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

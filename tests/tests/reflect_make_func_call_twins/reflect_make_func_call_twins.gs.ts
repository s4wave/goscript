// Generated file based on reflect_make_func_call_twins.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"
import * as runtime from "@goscript/runtime/index.js"
import * as slices from "@goscript/slices/index.js"

export type Walker = {
	Walk(fun: ((n: Node | $.VarRef<Node> | null) => boolean | globalThis.Promise<boolean>) | null): void
}

$.registerInterfaceType(
	"main.Walker",
	null,
	[$.methodSignature("Walk", [["fun", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)]])]
);

export class Node {
	public declare Name: string

	public declare Kids: $.Slice<Node | $.VarRef<Node> | null>

	constructor(__goscriptValue?: boolean, Name$?: string, Kids$?: $.Slice<Node | $.VarRef<Node> | null>) {
		this.Name = Name$ ?? ""
		this.Kids = Kids$ ?? (null! as $.Slice<Node | $.VarRef<Node> | null>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Node {
		return new Node(true, this.Name, this.Kids)
	}

	public __goscriptAssign(source: Node): this {
		this.Name = source.Name
		this.Kids = source.Kids
		return this
	}

	public Walk(fun: ((n: Node | $.VarRef<Node> | null) => boolean | globalThis.Promise<boolean>) | null): void {
		const n: Node | $.VarRef<Node> | null = this;
		if (!(fun!(n) as boolean)) {
			return
		}
		for (let __goscriptRangeTarget0 = $.pointerValue<Node>(n).Kids, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
			let k = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as Node | $.VarRef<Node> | null)
			void (k !== null && (k as any).__isVarRef !== true && (k as any).__goValue === undefined ? ((k as any) as Node).Walk(fun) : Node.prototype.Walk.call(k, fun))
		}
	}

	public async Walk$reflect(fun: ((n: Node | $.VarRef<Node> | null) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<void> {
		const n: Node | $.VarRef<Node> | null = this;
		if (!(__goscriptAwait = fun!(n), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)) {
			return
		}
		for (let __goscriptRangeTarget1 = $.pointerValue<Node>(n).Kids, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
			let k = (__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as Node | $.VarRef<Node> | null)
			await (k !== null && (k as any).__isVarRef !== true && (k as any).__goValue === undefined ? ((k as any) as Node).Walk$reflect(fun) : Node.prototype.Walk$reflect.call(k, fun))
		}
	}

	static __typeInfo = $.registerStructType(
		"main.Node",
		() => new Node(),
		() => [$.methodSignature("Walk", [["fun", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)]], [], true)],
		Node,
		() => [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true), /* @__PURE__ */ $.structField("Kids", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.Node")), [1], 16, true)]
	)
}

export class Tree {
	public declare Node: Node | $.VarRef<Node> | null

	public declare Title: string

	constructor(__goscriptValue?: boolean, Node$?: Node | $.VarRef<Node> | null, Title$?: string) {
		this.Node = Node$ ?? (null! as Node | $.VarRef<Node> | null)
		this.Title = Title$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Tree {
		return new Tree(true, this.Node, this.Title)
	}

	public __goscriptAssign(source: Tree): this {
		this.Node = source.Node
		this.Title = source.Title
		return this
	}

	public Walk(fun: any): any {
		return $.pointerValue<Node>(this.Node).Walk(fun)
	}

	public async Walk$reflect(fun: any): globalThis.Promise<any> {
		return await $.pointerValue<Node>(this.Node).Walk$reflect(fun)
	}

	static __typeInfo = $.registerStructType(
		"main.Tree",
		() => new Tree(),
		() => [$.methodSignature("Walk", [["fun", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)]])],
		Tree,
		() => [/* @__PURE__ */ $.structField("Node", /* @__PURE__ */ $.pointerType("main.Node"), [0], 0, true, { anonymous: true }), /* @__PURE__ */ $.structField("Title", /* @__PURE__ */ $.basicType("string"), [1], 8, true)]
	)
}

export class Doc {
	public declare Walker: Walker | null

	constructor(__goscriptValue?: boolean, Walker$?: Walker | null) {
		this.Walker = Walker$ ?? (null! as Walker | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Doc {
		return new Doc(true, this.Walker)
	}

	public __goscriptAssign(source: Doc): this {
		this.Walker = $.assignFieldValue(this.Walker, source.Walker)
		return this
	}

	public Walk(fun: any): any {
		return $.pointerValue<Exclude<Walker | null, null>>(this.Walker).Walk(fun)
	}

	public async Walk$reflect(fun: any): globalThis.Promise<any> {
		return await $.callReflectTwin($.pointerValue<Exclude<Walker | null, null>>(this.Walker), "Walk", fun)
	}

	static __typeInfo = $.registerStructType(
		"main.Doc",
		() => new Doc(),
		() => [$.methodSignature("Walk", [["fun", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)]])],
		Doc,
		() => [/* @__PURE__ */ $.structField("Walker", "main.Walker", [0], 0, true, { anonymous: true })]
	)
}

export class Button {
	public declare onClick: ((n: number) => string | globalThis.Promise<string>) | null

	public declare clicks: number

	constructor(__goscriptValue?: boolean, onClick$?: ((n: number) => string | globalThis.Promise<string>) | null, clicks$?: number) {
		this.onClick = onClick$ ?? (null! as ((n: number) => string | globalThis.Promise<string>) | null)
		this.clicks = clicks$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Button {
		return new Button(true, this.onClick, this.clicks)
	}

	public __goscriptAssign(source: Button): this {
		this.onClick = source.onClick
		this.clicks = source.clicks
		return this
	}

	public async Click(): globalThis.Promise<string> {
		const b: Button | $.VarRef<Button> | null = this;
		const b$: Button = b == null ? $.pointerTarget<Button>(b) : (b as any).__isVarRef === true ? (b as any).value : (b as any).__goValue === undefined ? (b as any) : $.pointerTarget<Button>(b);
		;(b$ as Button).clicks++
		return (b$ as Button).onClick!((b$ as Button).clicks)
	}

	public OnClick(f: ((n: number) => string | globalThis.Promise<string>) | null): Button | $.VarRef<Button> | null {
		const b: Button | $.VarRef<Button> | null = this;
		$.pointerValue<Button>(b).onClick = f
		return b
	}

	static __typeInfo = $.registerStructType(
		"main.Button",
		() => new Button(),
		() => [$.methodSignature("Click", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("OnClick", [["f", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("string")] } as $.FunctionTypeInfo)]], [/* @__PURE__ */ $.pointerType("main.Button")], true)],
		Button,
		() => [/* @__PURE__ */ $.structField("onClick", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("string")] } as $.FunctionTypeInfo), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/reflect_make_func_call_twins" }), /* @__PURE__ */ $.structField("clicks", /* @__PURE__ */ $.basicType("int"), [1], 8, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/reflect_make_func_call_twins" })]
	)
}

export function Count(n: Node | $.VarRef<Node> | null, keep: ((n: Node | $.VarRef<Node> | null) => boolean | globalThis.Promise<boolean>) | null): number {
	if (keep == null) {
		return 0
	}
	return count(n, keep)
}

export async function Count$reflect(n: Node | $.VarRef<Node> | null, keep: ((n: Node | $.VarRef<Node> | null) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<number> {
	if (keep == null) {
		return 0
	}
	return count$reflect(n, keep)
}
$.setReflectTwin(Count, Count$reflect)

export function count(n: Node | $.VarRef<Node> | null, keep: ((n: Node | $.VarRef<Node> | null) => boolean | globalThis.Promise<boolean>) | null): number {
	let c = 0
	if ((keep!(n) as boolean)) {
		c++
	}
	for (let __goscriptRangeTarget2 = $.pointerValue<Node>(n).Kids, __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow2.length; __rangeIndex++) {
		let k = (__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + __rangeIndex] as Node | $.VarRef<Node> | null)
		c += count(k, keep)
	}
	return c
}

export async function count$reflect(n: Node | $.VarRef<Node> | null, keep: ((n: Node | $.VarRef<Node> | null) => boolean | globalThis.Promise<boolean>) | null): globalThis.Promise<number> {
	let c = 0
	if ((__goscriptAwait = keep!(n), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)) {
		c++
	}
	for (let __goscriptRangeTarget3 = $.pointerValue<Node>(n).Kids, __goscriptRangeWindow3 = $.sliceRange(__goscriptRangeTarget3), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow3.length; __rangeIndex++) {
		let k = (__goscriptRangeWindow3.backing[__goscriptRangeWindow3.offset + __rangeIndex] as Node | $.VarRef<Node> | null)
		c += await count$reflect(k, keep)
	}
	return c
}
$.setReflectTwin(count, count$reflect)

export function CountOf<T>(__typeArgs: $.GenericTypeArgs | undefined, vals: $.Slice<T>, keep: ((v: any) => boolean | globalThis.Promise<boolean>) | null): number {
	let c = 0
	for (let __goscriptRangeTarget4 = vals, __goscriptRangeWindow4 = $.sliceRange(__goscriptRangeTarget4), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow4.length; __rangeIndex++) {
		let v = $.copyElement((__goscriptRangeWindow4.backing[__goscriptRangeWindow4.offset + __rangeIndex] as any))
		if ((keep!($.copyElement(v)) as boolean)) {
			c++
		}
	}
	return c
}

export async function main(): globalThis.Promise<void> {
	// Functions that reflection made, as an interpreter such as yaegi makes
	// the function literals of its code.
	let names: $.Slice<string> = null! as $.Slice<string>
	let visit = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic0()))!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		let n = $.mustTypeAssert<Node | $.VarRef<Node> | null>($.markAsStructValue($.cloneStructValue($.arrayIndex(args!, 0))).Interface(), /* @__PURE__ */ $.pointerType("main.Node"))
		let n$: Node = n == null ? $.pointerTarget<Node>(n) : (n as any).__isVarRef === true ? (n as any).value : (n as any).__goValue === undefined ? (n as any) : $.pointerTarget<Node>(n)
		names = $.appendOne(names, (n$ as Node).Name)
		return $.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf(!$.stringEqual((n$ as Node).Name, "b"))))])
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType("reflect.Value")], results: [/* @__PURE__ */ $.sliceType("reflect.Value")] } as $.FunctionTypeInfo)))))
	let short = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic0()))!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		return $.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.stringLen($.pointerValue<Node>($.mustTypeAssert<Node | $.VarRef<Node> | null>($.markAsStructValue($.cloneStructValue($.arrayIndex(args!, 0))).Interface(), /* @__PURE__ */ $.pointerType("main.Node"))).Name) <= 2)))])
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType("reflect.Value")], results: [/* @__PURE__ */ $.sliceType("reflect.Value")] } as $.FunctionTypeInfo)))))
	let root = new Node(false, "root", $.arrayToSlice<Node | $.VarRef<Node> | null>([new Node(false, "a"), new Node(false, "b", $.arrayToSlice<Node | $.VarRef<Node> | null>([new Node(false, "bc")])), new Node(false, "c")]))
	let root$: Node = root == null ? $.pointerTarget<Node>(root) : (root as any).__isVarRef === true ? (root as any).value : (root as any).__goValue === undefined ? (root as any) : $.pointerTarget<Node>(root)

	// reflect.Value.Call passes them to an exported method and an exported
	// function, which passes it to a helper.
	await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(root, "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))))).MethodByName("Walk"))).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(visit))]))
	await $.println($.sliceLen(names), $.arrayIndex(names!, 0), $.arrayIndex(names!, $.sliceLen(names) - 1))
	await $.println($.markAsStructValue($.cloneStructValue($.arrayIndex((await $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.goFunc(Count, "main.Count"), "func(n *main.Node, keep func(n *main.Node) bool) int", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node"), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))))).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(root, "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))))), short])))!, 0))).Int())

	// The method reached through an interface, and promoted from an embedded
	// pointer and an embedded interface.
	let w: $.VarRef<Walker | null> = $.varRef($.interfaceValue<Walker | null>(root, "*main.Node", /* @__PURE__ */ $.pointerType("main.Node")))
	names = null
	await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(w, "*main.Walker", /* @__PURE__ */ $.pointerType("main.Walker"))))).Elem())).MethodByName("Walk"))).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(visit))]))
	await $.println($.sliceLen(names))
	names = null
	await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(new Tree(false, $.arrayIndex((root$ as Node).Kids!, 1), "t"), "*main.Tree", /* @__PURE__ */ $.pointerType("main.Tree"))))).MethodByName("Walk"))).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(visit))]))
	await $.println($.sliceLen(names), $.arrayIndex(names!, 0))
	names = null
	await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.structInterfaceValue(new Doc(true, $.interfaceValue<Walker | null>($.arrayIndex((root$ as Node).Kids!, 0), "*main.Node", /* @__PURE__ */ $.pointerType("main.Node"))), "main.Doc", "main.Doc")))).MethodByName("Walk"))).Call($.arrayToSlice<reflect.Value>([visit]))
	await $.println($.sliceLen(names), $.arrayIndex(names!, 0))

	// A function that reflection made, stored by a method that reflection
	// calls, is called later by compiled code.
	let label = $.markAsStructValue($.cloneStructValue(reflect.MakeFunc($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic1()))!, $.functionValue((args: $.Slice<reflect.Value>): $.Slice<reflect.Value> => {
		return $.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf("click " + $.runeToString($.intFromWide($.int64Add(48n, $.markAsStructValue($.cloneStructValue($.arrayIndex(args!, 0))).Int()), 32)))))])
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.sliceType("reflect.Value")], results: [/* @__PURE__ */ $.sliceType("reflect.Value")] } as $.FunctionTypeInfo)))))
	let b = new Button()
	await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(b, "*main.Button", /* @__PURE__ */ $.pointerType("main.Button"))))).MethodByName("OnClick"))).Call($.arrayToSlice<reflect.Value>([label]))
	await $.println(await (b !== null && (b as any).__isVarRef !== true && (b as any).__goValue === undefined ? ((b as any) as Button).Click() : Button.prototype.Click.call(b)), await (b !== null && (b as any).__isVarRef !== true && (b as any).__goValue === undefined ? ((b as any) as Button).Click() : Button.prototype.Click.call(b)))

	// Compiled calls are unchanged, and the function keeps its name.
	let n = 0
	Node.prototype.Walk.call(root, $.functionValue((k: Node | $.VarRef<Node> | null): boolean => {
		n++
		return true
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)))
	await $.println(n, Count(root, $.functionValue((k: Node | $.VarRef<Node> | null): boolean => {
		return !$.stringEqual($.pointerValue<Node>(k).Name, "root")
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))), Count(root, (null as ((n: Node | $.VarRef<Node> | null) => boolean | globalThis.Promise<boolean>) | null)))
	await $.println(CountOf(__goscriptStatic2(), (root$ as Node).Kids, $.functionValue((k: Node | $.VarRef<Node> | null): boolean => {
		return $.sliceLen($.pointerValue<Node>(k).Kids) == 0
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))), slices.IndexFunc((root$ as Node).Kids, $.functionValue((k: Node | $.VarRef<Node> | null): boolean => {
		return $.stringEqual($.pointerValue<Node>(k).Name, "c")
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))))
	await $.println(runtime.Func.prototype.Name.call($.pointerValueOrNil(runtime.FuncForPC($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.goFunc(Count, "main.Count"), "func(n *main.Node, keep func(n *main.Node) bool) int", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node"), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))))).Pointer()))))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Node")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo), zero: () => null }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("string")] } as $.FunctionTypeInfo), zero: () => null }})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.pointerType("main.Node"), zero: () => null, methods: {Walk: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Walk(...$.stripGenericTypeArgs(args))} }})
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

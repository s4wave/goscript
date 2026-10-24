// Generated file based on reflect_interface_type_names.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export type Node = {
	Name(): string
}

$.registerInterfaceType(
	"main.Node",
	null,
	[$.methodSignature("Name", [], [/* @__PURE__ */ $.basicType("string")])]
);

export type Props = globalThis.Map<string, number> | null

$.registerNamedType("main.Props", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")));

export type Grid = number[]

$.registerNamedType("main.Grid", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2));

export class Tree {
	public declare Children: $.Slice<Node | null>

	public declare Parent: $.VarRef<Node | null> | null

	public declare ByName: globalThis.Map<string, Node | null> | null

	public declare Props: $.Slice<Props>

	public declare Grids: $.Slice<Grid>

	constructor(__goscriptValue?: boolean, Children$?: $.Slice<Node | null>, Parent$?: $.VarRef<Node | null> | null, ByName$?: globalThis.Map<string, Node | null> | null, Props$?: $.Slice<Props>, Grids$?: $.Slice<Grid>) {
		this.Children = Children$ ?? (null! as $.Slice<Node | null>)
		this.Parent = Parent$ ?? (null! as $.VarRef<Node | null> | null)
		this.ByName = ByName$ ?? (null! as globalThis.Map<string, Node | null> | null)
		this.Props = Props$ ?? (null! as $.Slice<Props>)
		this.Grids = Grids$ ?? (null! as $.Slice<Grid>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Tree {
		return new Tree(true, this.Children, this.Parent, this.ByName, this.Props, this.Grids)
	}

	public __goscriptAssign(source: Tree): this {
		this.Children = source.Children
		this.Parent = source.Parent
		this.ByName = source.ByName
		this.Props = source.Props
		this.Grids = source.Grids
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Tree",
		() => new Tree(),
		() => [],
		Tree,
		() => [/* @__PURE__ */ $.structField("Children", /* @__PURE__ */ $.sliceType("main.Node"), [0], 0, true), /* @__PURE__ */ $.structField("Parent", /* @__PURE__ */ $.pointerType("main.Node"), [1], 24, true), /* @__PURE__ */ $.structField("ByName", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), "main.Node"), [2], 32, true), /* @__PURE__ */ $.structField("Props", /* @__PURE__ */ $.sliceType("main.Props"), [3], 40, true), /* @__PURE__ */ $.structField("Grids", /* @__PURE__ */ $.sliceType("main.Grid"), [4], 64, true)]
	)
}

export async function show(v: reflect.Value): globalThis.Promise<void> {
	let t = reflect.TypeOf($.markAsStructValue($.cloneStructValue(v)).Interface())
	await $.println((__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>((__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).Elem(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)).Name(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>((__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).Elem(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	let pt = reflect.TypeOf($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Addr())).Interface())
	await $.println((__goscriptAwait = (pt !== null && (pt as any).__isVarRef !== true && ((pt as any).__goValue === undefined || (pt as any).__goType?.charCodeAt(0) !== 42) ? (pt as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(pt)).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>((__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>((__goscriptAwait = (pt !== null && (pt as any).__isVarRef !== true && ((pt as any).__goValue === undefined || (pt as any).__goType?.charCodeAt(0) !== 42) ? (pt as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(pt)).Elem(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)).Elem(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)).Name(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
}

export async function main(): globalThis.Promise<void> {
	let v = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(new Tree(), "*main.Tree", /* @__PURE__ */ $.pointerType("main.Tree"))))).Elem()))
	for (let i = 0; i < $.markAsStructValue($.cloneStructValue(v)).NumField(); i++) {
		await show($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Field(i))))
	}
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

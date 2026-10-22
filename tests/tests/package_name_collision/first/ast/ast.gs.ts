// Generated file based on ast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

$.registerTypePackagePath("github.com/s4wave/goscript/tests/tests/package_name_collision/first/ast", ["ast·122t5xq.Node", "ast·122t5xq.Container", "ast·122t5xq.List", "ast·122t5xq.ListItem", "ast·122t5xq.Paragraph", "ast·122t5xq.Type"])

export type Node = {
	AsContainer(): Container | $.VarRef<Container> | null
}

$.registerInterfaceType(
	"ast·122t5xq.Node",
	null,
	[$.methodSignature("AsContainer", [], [/* @__PURE__ */ $.pointerType("ast·122t5xq.Container")])]
);

export class Container {
	public declare Parent: Node | null

	public declare Children: $.Slice<Node | null>

	constructor(__goscriptValue?: boolean, Parent$?: Node | null, Children$?: $.Slice<Node | null>) {
		this.Parent = Parent$ ?? (null! as Node | null)
		this.Children = Children$ ?? (null! as $.Slice<Node | null>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Container {
		return new Container(true, this.Parent, this.Children)
	}

	public __goscriptAssign(source: Container): this {
		this.Parent = $.assignFieldValue(this.Parent, source.Parent)
		this.Children = source.Children
		return this
	}

	public AsContainer(): Container | $.VarRef<Container> | null {
		const c: Container | $.VarRef<Container> | null = this;
		return c
	}

	static __typeInfo = $.registerStructType(
		"ast·122t5xq.Container",
		() => new Container(),
		() => [$.methodSignature("AsContainer", [], [/* @__PURE__ */ $.pointerType("ast·122t5xq.Container")], true)],
		Container,
		() => [/* @__PURE__ */ $.structField("Parent", "ast·122t5xq.Node", [0], 0, true), /* @__PURE__ */ $.structField("Children", /* @__PURE__ */ $.sliceType("ast·122t5xq.Node"), [1], 16, true)]
	)
}

export class List {
	public declare Container: Container

	public declare Tight: boolean

	constructor(__goscriptValue?: boolean, Container$?: Container, Tight$?: boolean) {
		this.Container = Container$ ?? new Container(true)
		this.Tight = Tight$ ?? false
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): List {
		return new List(true, this.Container.clone(), this.Tight)
	}

	public __goscriptAssign(source: List): this {
		this.Container.__goscriptAssign(source.Container)
		this.Tight = source.Tight
		return this
	}

	public AsContainer(): any {
		return Container.prototype.AsContainer.call($.fieldRef(this, "Container"))
	}

	static __typeInfo = $.registerStructType(
		"ast·122t5xq.List",
		() => new List(),
		() => [$.methodSignature("AsContainer", [], [/* @__PURE__ */ $.pointerType("ast·122t5xq.Container")], true)],
		List,
		() => [/* @__PURE__ */ $.structField("Container", "ast·122t5xq.Container", [0], 0, true, { anonymous: true }), /* @__PURE__ */ $.structField("Tight", /* @__PURE__ */ $.basicType("bool"), [1], 40, true)]
	)
}

export class ListItem {
	public declare Container: Container

	constructor(__goscriptValue?: boolean, Container$?: Container) {
		this.Container = Container$ ?? new Container(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): ListItem {
		return new ListItem(true, this.Container.clone())
	}

	public __goscriptAssign(source: ListItem): this {
		this.Container.__goscriptAssign(source.Container)
		return this
	}

	public AsContainer(): any {
		return Container.prototype.AsContainer.call($.fieldRef(this, "Container"))
	}

	static __typeInfo = $.registerStructType(
		"ast·122t5xq.ListItem",
		() => new ListItem(),
		() => [$.methodSignature("AsContainer", [], [/* @__PURE__ */ $.pointerType("ast·122t5xq.Container")], true)],
		ListItem,
		() => [/* @__PURE__ */ $.structField("Container", "ast·122t5xq.Container", [0], 0, true, { anonymous: true })]
	)
}

export class Paragraph {
	public declare Container: Container

	constructor(__goscriptValue?: boolean, Container$?: Container) {
		this.Container = Container$ ?? new Container(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Paragraph {
		return new Paragraph(true, this.Container.clone())
	}

	public __goscriptAssign(source: Paragraph): this {
		this.Container.__goscriptAssign(source.Container)
		return this
	}

	public AsContainer(): any {
		return Container.prototype.AsContainer.call($.fieldRef(this, "Container"))
	}

	static __typeInfo = $.registerStructType(
		"ast·122t5xq.Paragraph",
		() => new Paragraph(),
		() => [$.methodSignature("AsContainer", [], [/* @__PURE__ */ $.pointerType("ast·122t5xq.Container")], true)],
		Paragraph,
		() => [/* @__PURE__ */ $.structField("Container", "ast·122t5xq.Container", [0], 0, true, { anonymous: true })]
	)
}

export class Type {
	public declare IDName: string

	constructor(__goscriptValue?: boolean, IDName$?: string) {
		this.IDName = IDName$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Type {
		return new Type(true, this.IDName)
	}

	public __goscriptAssign(source: Type): this {
		this.IDName = source.IDName
		return this
	}

	static __typeInfo = $.registerStructType(
		"ast·122t5xq.Type",
		() => new Type(),
		() => [],
		Type,
		() => [/* @__PURE__ */ $.structField("IDName", /* @__PURE__ */ $.basicType("string"), [0], 0, true)]
	)
}

// Generated file based on generic_inferred_struct_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class entry {
	public declare key: $.Slice<number>

	public declare n: number

	constructor(__goscriptValue?: boolean, key$?: $.Slice<number>, n$?: number) {
		this.key = key$ ?? (null! as $.Slice<number>)
		this.n = n$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): entry {
		return new entry(true, this.key, this.n)
	}

	public __goscriptAssign(source: entry): this {
		this.key = source.key
		this.n = source.n
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.entry",
		() => new entry(),
		() => [],
		entry,
		() => [{ name: "key", key: "key", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class tree {
	public declare less: ((a: any, b: any) => boolean | globalThis.Promise<boolean>) | null

	public declare empty: any

	public declare count: number

	constructor(__goscriptValue?: boolean, less$?: ((a: any, b: any) => boolean | globalThis.Promise<boolean>) | null, empty$?: any, count$?: number) {
		this.less = less$ ?? (null! as ((a: any, b: any) => boolean | globalThis.Promise<boolean>) | null)
		this.empty = empty$ ?? (null! as any)
		this.count = count$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): tree {
		return $.copyGenericInstance(this, new tree(true, this.less, $.copyElement(this.empty), this.count))
	}

	public __goscriptAssign(source: tree): this {
		this.less = source.less
		this.empty = $.assignFieldValue(this.empty, source.empty)
		this.count = source.count
		return this
	}

	public ["get"](__typeArgs: $.GenericTypeArgs | undefined): any {
		const tr: tree | $.VarRef<tree> | null = this;
		return $.copyElement($.pointerValue<tree>(tr).empty)
	}

	static __typeInfo = $.registerStructType(
		"main.tree",
		() => new tree(),
		() => [{ name: "get", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }], pointerReceiver: true }],
		tree,
		() => [{ name: "less", key: "less", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo) }, { name: "empty", key: "empty", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "count", key: "count", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function newTree(__typeArgs: $.GenericTypeArgs | undefined, less: ((a: any, b: any) => boolean | globalThis.Promise<boolean>) | null): tree | $.VarRef<tree> | null {
	let tr = $.genericInstance(new tree(false, undefined, $.genericZero(__typeArgs, "T", null)), () => [{get: (receiver: any) => $.pointerValue(receiver).get({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})}, [$.methodSignature("get", [], [__typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }], true, false)]])
	$.pointerValue<tree>(tr).less = less
	return tr
}

export function literalTree(__typeArgs: $.GenericTypeArgs | undefined): tree {
	return $.genericInstance(new tree(true, undefined, $.genericZero(__typeArgs, "T", null), 1), () => [{get: (receiver: any) => $.pointerValue(receiver).get({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})}, [$.methodSignature("get", [], [__typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }], true, false)]])
}

export function varTree(__typeArgs: $.GenericTypeArgs | undefined): tree {
	let tr: tree = $.genericInstance(new tree(true, undefined, $.genericZero(__typeArgs, "T", null)), () => [{get: (receiver: any) => $.pointerValue(receiver).get({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})}, [$.methodSignature("get", [], [__typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }], true, false)]])
	return tr
}

export function zero(__typeArgs: $.GenericTypeArgs | undefined): any {
	let z: any = $.genericZero(__typeArgs, "T", null)
	return $.copyElement(z)
}

export function lessEntry(a: entry, b: entry): boolean {
	return a.n < b.n
}

export async function main(): globalThis.Promise<void> {
	// Inferred from a function-typed argument.
	let tr = (newTree(__goscriptStatic0(), lessEntry) as tree | $.VarRef<tree> | null)
	let e = (((tr !== null && (tr as any).__isVarRef !== true && (tr as any).__goValue === undefined ? ((tr as any) as tree)["get"](__goscriptStatic0()) : tree.prototype.get.call(tr, __goscriptStatic0()))).clone() as entry)
	await $.println("new", e.key == null, e.n)
	await $.println("less", ($.pointerValue<tree>(tr).less!(new entry(true, undefined, 1), new entry(true, undefined, 2)) as boolean))

	// Zero values of type-parameter fields in generic constructors.
	let lit = (literalTree(__goscriptStatic0()) as tree)
	await $.println("literal", lit.empty.key == null, lit.empty.n, lit.count)
	let v = (varTree(__goscriptStatic0()) as tree)
	await $.println("var", v.empty.key == null, v.empty.n)
	let z = ((zero(__goscriptStatic0())).clone() as entry)
	await $.println("zero", z.key == null, z.n)
	let ints = (newTree(__goscriptStatic1(), $.functionValue((a: number, b: number): boolean => {
		return a < b
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo))) as tree | $.VarRef<tree> | null)
	await $.println("int", (ints !== null && (ints as any).__isVarRef !== true && (ints as any).__goValue === undefined ? ((ints as any) as tree)["get"](__goscriptStatic1()) : tree.prototype.get.call(ints, __goscriptStatic1())))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.entry", zero: () => new entry(true) }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

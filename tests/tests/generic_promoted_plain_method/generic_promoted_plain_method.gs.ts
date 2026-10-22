// Generated file based on generic_promoted_plain_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type namer = {
	Name(p: string): string
}

$.registerInterfaceType(
	"main.namer",
	null,
	[{ name: "Name", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export type labeler = {
	Label(p: string): string
}

$.registerInterfaceType(
	"main.labeler",
	null,
	[{ name: "Label", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export class Meta {
	public declare name: string

	constructor(__goscriptValue?: boolean, name$?: string) {
		this.name = name$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Meta {
		return new Meta(true, this.name)
	}

	public __goscriptAssign(source: Meta): this {
		this.name = source.name
		return this
	}

	public Name(p: string): string {
		const m: Meta | $.VarRef<Meta> | null = this;
		return p + $.pointerValue<Meta>(m).name
	}

	static __typeInfo = $.registerStructType(
		"main.Meta",
		() => new Meta(),
		() => [{ name: "Name", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }],
		Meta,
		() => [{ name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class Inner {
	public declare v: any

	constructor(__goscriptValue?: boolean, v$?: any) {
		this.v = v$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Inner {
		return $.copyGenericInstance(this, new Inner(true, $.copyElement(this.v)))
	}

	public __goscriptAssign(source: Inner): this {
		this.v = $.assignFieldValue(this.v, source.v)
		return this
	}

	public Label(__typeArgs: $.GenericTypeArgs | undefined, p: string): string {
		const _in: Inner | $.VarRef<Inner> | null = this;
		return p + "inner"
	}

	static __typeInfo = $.registerStructType(
		"main.Inner",
		() => new Inner(),
		() => [{ name: "Label", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }],
		Inner,
		() => [{ name: "v", key: "v", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class Outer {
	public declare Meta: Meta

	public declare Inner: Inner | $.VarRef<Inner> | null

	public declare v: any

	constructor(__goscriptValue?: boolean, Meta$?: Meta, Inner$?: Inner | $.VarRef<Inner> | null, v$?: any) {
		this.Meta = Meta$ ?? new Meta(true)
		this.Inner = Inner$ ?? (null! as Inner | $.VarRef<Inner> | null)
		this.v = v$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Outer {
		return $.copyGenericInstance(this, new Outer(true, this.Meta.clone(), this.Inner, $.copyElement(this.v)))
	}

	public __goscriptAssign(source: Outer): this {
		this.Meta.__goscriptAssign(source.Meta)
		this.Inner = source.Inner
		this.v = $.assignFieldValue(this.v, source.v)
		return this
	}

	public Get(__typeArgs: $.GenericTypeArgs | undefined): any {
		const o: Outer | $.VarRef<Outer> | null = this;
		return $.copyElement($.pointerValue<Outer>(o).v)
	}

	public Name(p: any): any {
		return $.pointerValue<Meta>(this.Meta).Name(p)
	}

	public Label(p: any): any {
		return $.pointerValue<Inner>(this.Inner).Label(__goscriptStatic0(), p)
	}

	static __typeInfo = $.registerStructType(
		"main.Outer",
		() => new Outer(),
		() => [{ name: "Get", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }], pointerReceiver: true }, { name: "Name", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }, { name: "Label", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		Outer,
		() => [{ name: "Meta", key: "Meta", type: "main.Meta", anonymous: true }, { name: "Inner", key: "Inner", type: /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Inner", "main.Inner[int]", () => [/* @__PURE__ */ $.structField("v", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/generic_promoted_plain_method" })])), anonymous: true }, { name: "v", key: "v", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export function both(__typeArgs: $.GenericTypeArgs | undefined, p: any): string {
	return $.callGenericMethod(__typeArgs, "P", "Name", p, "c:") + " " + $.callGenericMethod(__typeArgs, "P", "Label", p, "c:")
}

export async function main(): globalThis.Promise<void> {
	let o = $.genericInstance(new Outer(false, new Meta(true, "a"), $.genericInstance(new Inner(false, 1), __goscriptStatic1), 2.5), __goscriptStatic3)

	// Direct calls.
	await $.println($.pointerValue<Outer>(o).Meta.Name("d:"), $.pointerValue<Inner>($.pointerValue<Outer>(o).Inner).Label(__goscriptStatic2(), "d:"))

	// Calls through interfaces of the promoted methods, which take their
	// own arguments and no type arguments.
	let n: namer | null = $.namedValueInterfaceValue<namer | null>(o, "*main.Outer", __goscriptStatic4(), __goscriptStatic5(), __goscriptStatic6())
	let l: labeler | null = $.namedValueInterfaceValue<labeler | null>(o, "*main.Outer", __goscriptStatic4(), __goscriptStatic5(), __goscriptStatic6())
	await $.println((__goscriptAwait = (n !== null && (n as any).__isVarRef !== true && ((n as any).__goValue === undefined || (n as any).__goType?.charCodeAt(0) !== 42) ? (n as Exclude<namer, null>) : $.pointerValue<Exclude<namer, null>>(n)).Name("i:"), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = (l !== null && (l as any).__isVarRef !== true && ((l as any).__goValue === undefined || (l as any).__goType?.charCodeAt(0) !== 42) ? (l as Exclude<labeler, null>) : $.pointerValue<Exclude<labeler, null>>(l)).Label("i:"), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	let x: any = $.namedValueInterfaceValue<any>(o, "*main.Outer", __goscriptStatic4(), __goscriptStatic5(), __goscriptStatic6())
	await $.println((__goscriptAwait = $.pointerValue<Exclude<namer, null>>($.mustTypeAssert<namer | null>(x, "main.namer")).Name("a:"), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.pointerValue<Exclude<labeler, null>>($.mustTypeAssert<labeler | null>(x, "main.labeler")).Label("a:"), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	// Calls through a type parameter's constraint.
	await $.println(both(__goscriptStatic7(), o))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{Label: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Label(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("Label", [/* @__PURE__ */ $.basicType("string")], [/* @__PURE__ */ $.basicType("string")], true, false)]])
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("float64"), zero: () => 0 }})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([{Get: (receiver: any) => $.pointerValue(receiver).Get(__goscriptStatic2()), Label: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Label(...$.stripGenericTypeArgs(args)), Name: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Name(...$.stripGenericTypeArgs(args))}, [$.methodSignature("Get", [], [/* @__PURE__ */ $.basicType("float64")], true, false), $.methodSignature("Label", [/* @__PURE__ */ $.basicType("string")], [/* @__PURE__ */ $.basicType("string")], false, false), $.methodSignature("Name", [/* @__PURE__ */ $.basicType("string")], [/* @__PURE__ */ $.basicType("string")], true, false)]])
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ({Get: (receiver: any) => $.pointerValue(receiver).Get(__goscriptStatic2()), Label: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Label(...$.stripGenericTypeArgs(args)), Name: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Name(...$.stripGenericTypeArgs(args))})
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= (/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Outer", "main.Outer[float64]", () => [/* @__PURE__ */ $.structField("Meta", "main.Meta", [0], 0, true, { anonymous: true }), /* @__PURE__ */ $.structField("Inner", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Inner", "main.Inner[int]", () => [/* @__PURE__ */ $.structField("v", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/generic_promoted_plain_method" })])), [1], 16, true, { anonymous: true }), /* @__PURE__ */ $.structField("v", /* @__PURE__ */ $.basicType("float64"), [2], 24, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/generic_promoted_plain_method" })])))
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ([$.methodSignature("Get", [], [/* @__PURE__ */ $.basicType("float64")]), $.methodSignature("Label", [["p", /* @__PURE__ */ $.basicType("string")]], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Name", [["p", /* @__PURE__ */ $.basicType("string")]], [/* @__PURE__ */ $.basicType("string")])])
}

var __goscriptStatic7$value: any
function __goscriptStatic7(): any {
	return __goscriptStatic7$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, P: { type: /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Outer", "main.Outer[float64]", () => [/* @__PURE__ */ $.structField("Meta", "main.Meta", [0], 0, true, { anonymous: true }), /* @__PURE__ */ $.structField("Inner", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Inner", "main.Inner[int]", () => [/* @__PURE__ */ $.structField("v", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/generic_promoted_plain_method" })])), [1], 16, true, { anonymous: true }), /* @__PURE__ */ $.structField("v", /* @__PURE__ */ $.basicType("float64"), [2], 24, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/generic_promoted_plain_method" })])), zero: () => null, methods: {Get: (receiver: any) => $.pointerValue(receiver).Get(__goscriptStatic2()), Label: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Label(...$.stripGenericTypeArgs(args)), Name: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Name(...$.stripGenericTypeArgs(args))} }})
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

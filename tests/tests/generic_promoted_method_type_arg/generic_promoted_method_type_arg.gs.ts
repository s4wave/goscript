// Generated file based on generic_promoted_method_type_arg.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Flags = bigint

export type Flagger = {
	Is(flag: Flags): boolean
	Set(flag: Flags): void
}

$.registerInterfaceType(
	"main.Flagger",
	null,
	[{ name: "Is", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Set", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }]
);

export class Base {
	public declare App: any

	public declare flags: Flags

	constructor(__goscriptValue?: boolean, App$?: any, flags$?: Flags) {
		this.App = App$ ?? (null! as any)
		this.flags = flags$ ?? 0n
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Base {
		return $.copyGenericInstance(this, new Base(true, $.copyElement(this.App), this.flags))
	}

	public __goscriptAssign(source: Base): this {
		this.App = $.assignFieldValue(this.App, source.App)
		this.flags = source.flags
		return this
	}

	public Is(__typeArgs: $.GenericTypeArgs | undefined, flag: Flags): boolean {
		const b: Base | $.VarRef<Base> | null = this;
		return ($.int64And($.pointerValue<Base>(b).flags, ($.int64Bit(flag)))) != 0n
	}

	public Set(__typeArgs: $.GenericTypeArgs | undefined, flag: Flags): void {
		const b: Base | $.VarRef<Base> | null = this;
		const b$: Base = b == null ? $.pointerTarget<Base>(b) : (b as any).__isVarRef === true ? (b as any).value : (b as any).__goValue === undefined ? (b as any) : $.pointerTarget<Base>(b);
		;(b$ as Base).flags = $.int64Or((b$ as Base).flags, $.int64Bit(flag))
	}

	static __typeInfo = $.registerStructType(
		"main.Base",
		() => new Base(),
		() => [{ name: "Is", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Set", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		Base,
		() => [{ name: "App", key: "App", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "flags", key: "flags", type: /* @__PURE__ */ $.basicType("int64", "main.Flags") }]
	)
}

export class App {
	public declare Name: string

	constructor(__goscriptValue?: boolean, Name$?: string) {
		this.Name = Name$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): App {
		return new App(true, this.Name)
	}

	public __goscriptAssign(source: App): this {
		this.Name = source.Name
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.App",
		() => new App(),
		() => [],
		App,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class Window {
	public declare Base: Base

	public declare Title: string

	constructor(__goscriptValue?: boolean, Base$?: Base, Title$?: string) {
		this.Base = Base$ ?? $.genericInstance(new Base(true, null! as App | $.VarRef<App> | null), __goscriptStatic1)
		this.Title = Title$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Window {
		return new Window(true, this.Base.clone(), this.Title)
	}

	public __goscriptAssign(source: Window): this {
		this.Base.__goscriptAssign(source.Base)
		this.Title = source.Title
		return this
	}

	public Is(flag: any): any {
		return $.pointerValue<Base>(this.Base).Is(__goscriptStatic0(), flag)
	}

	public Set(flag: any): any {
		return $.pointerValue<Base>(this.Base).Set(__goscriptStatic0(), flag)
	}

	static __typeInfo = $.registerStructType(
		"main.Window",
		() => new Window(),
		() => [{ name: "Is", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Set", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		Window,
		() => [{ name: "Base", key: "Base", type: "main.Base", anonymous: true }, { name: "Title", key: "Title", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class Single {
	public declare Base: Base

	public declare Count: number

	constructor(__goscriptValue?: boolean, Base$?: Base, Count$?: number) {
		this.Base = Base$ ?? $.genericInstance(new Base(true, null), () => [{Is: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Is({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, A: { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Set({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, A: { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ...$.stripGenericTypeArgs(args))}, [$.methodSignature("Is", [/* @__PURE__ */ $.basicType("int64", "main.Flags")], [/* @__PURE__ */ $.basicType("bool")], true, false), $.methodSignature("Set", [/* @__PURE__ */ $.basicType("int64", "main.Flags")], [], true, false)]])
		this.Count = Count$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Single {
		return $.copyGenericInstance(this, new Single(true, this.Base.clone(), this.Count))
	}

	public __goscriptAssign(source: Single): this {
		this.Base.__goscriptAssign(source.Base)
		this.Count = source.Count
		return this
	}

	public Is(__typeArgs: $.GenericTypeArgs | undefined, flag: any): any {
		return $.pointerValue<Base>(this.Base).Is({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, A: __typeArgs?.["A"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, flag)
	}

	public Set(__typeArgs: $.GenericTypeArgs | undefined, flag: any): any {
		return $.pointerValue<Base>(this.Base).Set({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, A: __typeArgs?.["A"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, flag)
	}

	static __typeInfo = $.registerStructType(
		"main.Single",
		() => new Single(),
		() => [{ name: "Is", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Set", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		Single,
		() => [{ name: "Base", key: "Base", type: "main.Base", anonymous: true }, { name: "Count", key: "Count", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function check(__typeArgs: $.GenericTypeArgs | undefined, w: any): boolean {
	$.callGenericMethod(__typeArgs, "W", "Set", w, 6n)
	return $.callGenericMethod(__typeArgs, "W", "Is", w, 6n) && !$.callGenericMethod(__typeArgs, "W", "Is", w, 2n)
}

export function asFlagger(__typeArgs: $.GenericTypeArgs | undefined, w: any): Flagger | null {
	return $.mustTypeAssert<Flagger | null>($.typeParamInterfaceValue<any>(w, __typeArgs?.["W"] ?? { type: { kind: $.TypeKind.Interface, methods: [$.methodSignature("Is", [["flag", /* @__PURE__ */ $.basicType("int64", "main.Flags")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Set", [["flag", /* @__PURE__ */ $.basicType("int64", "main.Flags")]])] }, zero: () => null }), "main.Flagger")
}

export async function main(): globalThis.Promise<void> {
	let w = new Window(false, undefined, "main")
	await $.println("check:", check(__goscriptStatic2(), w))
	let f = asFlagger(__goscriptStatic2(), new Window())
	void (__goscriptAwait = (f !== null && (f as any).__isVarRef !== true && ((f as any).__goValue === undefined || (f as any).__goType?.charCodeAt(0) !== 42) ? (f as Exclude<Flagger, null>) : $.pointerValue<Exclude<Flagger, null>>(f)).Set(3n), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
	await $.println("interface:", (__goscriptAwait = (f !== null && (f as any).__isVarRef !== true && ((f as any).__goValue === undefined || (f as any).__goType?.charCodeAt(0) !== 42) ? (f as Exclude<Flagger, null>) : $.pointerValue<Exclude<Flagger, null>>(f)).Is(3n), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = (f !== null && (f as any).__isVarRef !== true && ((f as any).__goValue === undefined || (f as any).__goType?.charCodeAt(0) !== 42) ? (f as Exclude<Flagger, null>) : $.pointerValue<Exclude<Flagger, null>>(f)).Is(6n), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	let s = $.genericInstance(new Single(), __goscriptStatic1)
	await $.println("generic outer:", check(__goscriptStatic3(), s))
	await $.println("generic outer string:", check(__goscriptStatic6(), $.genericInstance(new Single(), __goscriptStatic5)))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, A: { type: /* @__PURE__ */ $.pointerType("main.App"), zero: () => null }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{Is: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Is(__goscriptStatic0(), ...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Set(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("Is", [/* @__PURE__ */ $.basicType("int64", "main.Flags")], [/* @__PURE__ */ $.basicType("bool")], true, false), $.methodSignature("Set", [/* @__PURE__ */ $.basicType("int64", "main.Flags")], [], true, false)]])
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, W: { type: /* @__PURE__ */ $.pointerType("main.Window"), zero: () => null, methods: {Is: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Is(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Set(...$.stripGenericTypeArgs(args))} }})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, W: { type: /* @__PURE__ */ $.pointerType("main.Single"), zero: () => null, methods: {Is: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Is(__goscriptStatic0(), ...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Set(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))} }})
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, A: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }})
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ([{Is: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Is(__goscriptStatic4(), ...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Set(__goscriptStatic4(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("Is", [/* @__PURE__ */ $.basicType("int64", "main.Flags")], [/* @__PURE__ */ $.basicType("bool")], true, false), $.methodSignature("Set", [/* @__PURE__ */ $.basicType("int64", "main.Flags")], [], true, false)]])
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, W: { type: /* @__PURE__ */ $.pointerType("main.Single"), zero: () => null, methods: {Is: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Is(__goscriptStatic4(), ...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Set(__goscriptStatic4(), ...$.stripGenericTypeArgs(args))} }})
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on generic_embed_mutual_recursion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Window = {
	Name(): string
}

$.registerInterfaceType(
	"main.Window",
	null,
	[{ name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export type App = {
	FirstName(): string
	Window(): Window | null
}

$.registerInterfaceType(
	"main.App",
	null,
	[{ name: "FirstName", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "Window", args: [], returns: [{ type: "main.Window" }] }]
);

export class AppBase {
	public declare Windows: $.Slice<any>

	constructor(__goscriptValue?: boolean, Windows$?: $.Slice<any>) {
		this.Windows = Windows$ ?? (null! as $.Slice<any>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): AppBase {
		return $.copyGenericInstance(this, new AppBase(true, this.Windows))
	}

	public __goscriptAssign(source: AppBase): this {
		this.Windows = source.Windows
		return this
	}

	public FirstName(__typeArgs: $.GenericTypeArgs | undefined): string {
		const a: AppBase | $.VarRef<AppBase> | null = this;
		const a$: AppBase = a == null ? $.pointerTarget<AppBase>(a) : (a as any).__isVarRef === true ? (a as any).value : (a as any).__goValue === undefined ? (a as any) : $.pointerTarget<AppBase>(a)
		if ($.sliceLen((a$ as AppBase).Windows) == 0) {
			return ""
		}
		return $.callGenericMethod(__typeArgs, "W", "Name", $.arrayIndex((a$ as AppBase).Windows!, 0))
	}

	public Window(__typeArgs: $.GenericTypeArgs | undefined): Window | null {
		const a: AppBase | $.VarRef<AppBase> | null = this;
		const a$: AppBase = a == null ? $.pointerTarget<AppBase>(a) : (a as any).__isVarRef === true ? (a as any).value : (a as any).__goValue === undefined ? (a as any) : $.pointerTarget<AppBase>(a)
		if ($.sliceLen((a$ as AppBase).Windows) == 0) {
			return null
		}
		return $.typeParamInterfaceValue<Window | null>($.arrayIndex((a$ as AppBase).Windows!, 0), __typeArgs?.["W"] ?? { type: { kind: $.TypeKind.Interface, methods: [$.methodSignature("Name", [], [/* @__PURE__ */ $.basicType("string")])] }, zero: () => null })
	}

	static __typeInfo = $.registerStructType(
		"main.AppBase",
		() => new AppBase(),
		() => [{ name: "FirstName", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }, { name: "Window", args: [], returns: [{ type: "main.Window" }], pointerReceiver: true }],
		AppBase,
		() => [{ name: "Windows", key: "Windows", type: /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [$.methodSignature("Name", [], [/* @__PURE__ */ $.basicType("string")])] }) }]
	)
}

export class WindowBase {
	public declare App: any

	public declare name: string

	constructor(__goscriptValue?: boolean, App$?: any, name$?: string) {
		this.App = App$ ?? (null! as any)
		this.name = name$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): WindowBase {
		return $.copyGenericInstance(this, new WindowBase(true, $.copyElement(this.App), this.name))
	}

	public __goscriptAssign(source: WindowBase): this {
		this.App = $.assignFieldValue(this.App, source.App)
		this.name = source.name
		return this
	}

	public AppWindowName(__typeArgs: $.GenericTypeArgs | undefined): string {
		const w: WindowBase | $.VarRef<WindowBase> | null = this;
		const w$: WindowBase = w == null ? $.pointerTarget<WindowBase>(w) : (w as any).__isVarRef === true ? (w as any).value : (w as any).__goValue === undefined ? (w as any) : $.pointerTarget<WindowBase>(w)
		return $.pointerValue<Exclude<Window, null>>($.callGenericMethod(__typeArgs, "A", "Window", (w$ as WindowBase).App)).Name() + " via " + $.callGenericMethod(__typeArgs, "A", "FirstName", (w$ as WindowBase).App)
	}

	public Name(__typeArgs: $.GenericTypeArgs | undefined): string {
		const w: WindowBase | $.VarRef<WindowBase> | null = this;
		return $.pointerValue<WindowBase>(w).name
	}

	static __typeInfo = $.registerStructType(
		"main.WindowBase",
		() => new WindowBase(),
		() => [{ name: "AppWindowName", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }, { name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }],
		WindowBase,
		() => [{ name: "App", key: "App", type: { kind: $.TypeKind.Interface, methods: [$.methodSignature("FirstName", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Window", [], ["main.Window"])] } }, { name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class MyApp {
	public declare AppBase: AppBase

	constructor(__goscriptValue?: boolean, AppBase$?: AppBase) {
		this.AppBase = AppBase$ ?? $.genericInstance(new AppBase(true), __goscriptStatic1)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): MyApp {
		return new MyApp(true, this.AppBase.clone())
	}

	public __goscriptAssign(source: MyApp): this {
		this.AppBase.__goscriptAssign(source.AppBase)
		return this
	}

	public FirstName(): any {
		return $.pointerValue<AppBase>(this.AppBase).FirstName(__goscriptStatic0())
	}

	public Window(): any {
		return $.pointerValue<AppBase>(this.AppBase).Window(__goscriptStatic0())
	}

	static __typeInfo = $.registerStructType(
		"main.MyApp",
		() => new MyApp(),
		() => [{ name: "FirstName", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }, { name: "Window", args: [], returns: [{ type: "main.Window" }], pointerReceiver: true }],
		MyApp,
		() => [{ name: "AppBase", key: "AppBase", type: /* @__PURE__ */ $.genericStructType("main.AppBase", "main.AppBase[*main.MyWindow]", () => [/* @__PURE__ */ $.structField("Windows", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.MyWindow")), [0], 0, true)]), anonymous: true }]
	)
}

export class MyWindow {
	public declare WindowBase: WindowBase

	constructor(__goscriptValue?: boolean, WindowBase$?: WindowBase) {
		this.WindowBase = WindowBase$ ?? $.genericInstance(new WindowBase(true, null! as MyApp | $.VarRef<MyApp> | null), __goscriptStatic3)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): MyWindow {
		return new MyWindow(true, this.WindowBase.clone())
	}

	public __goscriptAssign(source: MyWindow): this {
		this.WindowBase.__goscriptAssign(source.WindowBase)
		return this
	}

	public AppWindowName(): any {
		return $.pointerValue<WindowBase>(this.WindowBase).AppWindowName(__goscriptStatic2())
	}

	public Name(): any {
		return $.pointerValue<WindowBase>(this.WindowBase).Name(__goscriptStatic2())
	}

	static __typeInfo = $.registerStructType(
		"main.MyWindow",
		() => new MyWindow(),
		() => [{ name: "AppWindowName", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }, { name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }],
		MyWindow,
		() => [{ name: "WindowBase", key: "WindowBase", type: /* @__PURE__ */ $.genericStructType("main.WindowBase", "main.WindowBase[*main.MyApp]", () => [/* @__PURE__ */ $.structField("App", /* @__PURE__ */ $.pointerType("main.MyApp"), [0], 0, true), /* @__PURE__ */ $.structField("name", /* @__PURE__ */ $.basicType("string"), [1], 8, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/generic_embed_mutual_recursion" })]), anonymous: true }]
	)
}

export async function main(): globalThis.Promise<void> {
	let a = new MyApp()
	let a$: MyApp = a == null ? $.pointerTarget<MyApp>(a) : (a as any).__isVarRef === true ? (a as any).value : (a as any).__goValue === undefined ? (a as any) : $.pointerTarget<MyApp>(a)
	let w = new MyWindow()
	let w$: MyWindow = w == null ? $.pointerTarget<MyWindow>(w) : (w as any).__isVarRef === true ? (w as any).value : (w as any).__goValue === undefined ? (w as any) : $.pointerTarget<MyWindow>(w);
	;(w$ as MyWindow).WindowBase.name = "main";
	;(w$ as MyWindow).WindowBase.App = a;
	;(a$ as MyApp).AppBase.Windows = $.appendOne((a$ as MyApp).AppBase.Windows, w, $.appendZeros.nil)
	let app: App | null = $.namedValueInterfaceValue<App | null>(a, "*main.MyApp", __goscriptStatic4(), __goscriptStatic5(), __goscriptStatic6())
	await $.println((__goscriptAwait = $.pointerValue<Exclude<Window, null>>((__goscriptAwait = (app !== null && (app as any).__isVarRef !== true && ((app as any).__goValue === undefined || (app as any).__goType?.charCodeAt(0) !== 42) ? (app as Exclude<App, null>) : $.pointerValue<Exclude<App, null>>(app)).Window(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)).Name(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println((__goscriptAwait = $.pointerValue<Exclude<Window, null>>($.pointerValue<MyApp>((w$ as MyWindow).WindowBase.App).AppBase.Window(__goscriptStatic0())).Name(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println((w$ as MyWindow).WindowBase.AppWindowName(__goscriptStatic2()))
	await $.println((a$ as MyApp).AppBase.FirstName(__goscriptStatic0()))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, W: { type: /* @__PURE__ */ $.pointerType("main.MyWindow"), zero: () => null, methods: {AppWindowName: (receiver: any) => $.pointerValue(receiver).AppWindowName(), Name: (receiver: any) => $.pointerValue(receiver).Name()} }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{FirstName: (receiver: any) => $.pointerValue(receiver).FirstName(__goscriptStatic0()), Window: (receiver: any) => $.pointerValue(receiver).Window(__goscriptStatic0())}, [$.methodSignature("FirstName", [], [/* @__PURE__ */ $.basicType("string")], true, false), $.methodSignature("Window", [], ["main.Window"], true, false)]])
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, A: { type: /* @__PURE__ */ $.pointerType("main.MyApp"), zero: () => null, methods: {FirstName: (receiver: any) => $.pointerValue(receiver).FirstName(), Window: (receiver: any) => $.pointerValue(receiver).Window()} }})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([{AppWindowName: (receiver: any) => $.pointerValue(receiver).AppWindowName(__goscriptStatic2()), Name: (receiver: any) => $.pointerValue(receiver).Name(__goscriptStatic2())}, [$.methodSignature("AppWindowName", [], [/* @__PURE__ */ $.basicType("string")], true, false), $.methodSignature("Name", [], [/* @__PURE__ */ $.basicType("string")], true, false)]])
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ({FirstName: (receiver: any) => $.pointerValue(receiver).FirstName(), Window: (receiver: any) => $.pointerValue(receiver).Window()})
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= (/* @__PURE__ */ $.pointerType("main.MyApp"))
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ([$.methodSignature("FirstName", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Window", [], ["main.Window"])])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

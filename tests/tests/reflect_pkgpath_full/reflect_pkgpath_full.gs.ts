// Generated file based on reflect_pkgpath_full.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"
import * as dep from "@goscript/github.com/s4wave/goscript/tests/tests/reflect_pkgpath_full/dep/index.js"

export class mainType {
	constructor(__goscriptValue?: boolean) {
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): mainType {
		return new mainType(true)
	}

	public __goscriptAssign(source: mainType): this {
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.mainType",
		() => new mainType(),
		() => [],
		mainType,
		() => []
	)
}

export async function show(label: string, t: reflect.Type | null): globalThis.Promise<void> {
	await $.println(label + ":", (__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).PkgPath(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).Name(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
}

export async function main(): globalThis.Promise<void> {
	await show("struct", reflect.TypeOf($.structInterfaceValue(new dep.Node(true), "dep.Node", "dep.Node")))
	await show("pointer elem", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.interfaceValue(new dep.Node(), "*dep.Node", /* @__PURE__ */ $.pointerType("dep.Node")))).Elem(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await show("basic", reflect.TypeOf($.namedValueInterfaceValue<any>(1, "dep.Level", {}, /* @__PURE__ */ $.basicType("int", "dep.Level"))))
	await show("interface", reflect.TypeFor(__goscriptStatic0()))
	await show("local", dep.LocalType())
	await show("main", reflect.TypeOf($.structInterfaceValue(new mainType(true), "main.mainType", "main.mainType")))
	await $.println("generic:", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.structInterfaceValue(new dep.Box(true, 0), "dep.Box", /* @__PURE__ */ $.genericStructType("dep.Box", "dep.Box[int]", () => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.basicType("int"), [0], 0, true)])))).PkgPath(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("unnamed:", $.stringEqual((__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.interfaceValue($.arrayToSlice<dep.Node>([]), "[]dep.Node", /* @__PURE__ */ $.sliceType("dep.Node")))).PkgPath(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), ""))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "dep.Namer", zero: () => null, methods: {Name: (receiver: any) => receiver.Name()} }})
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

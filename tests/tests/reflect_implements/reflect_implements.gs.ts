// Generated file based on reflect_implements.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"
import "@goscript/reflect/index.js"

export type Stringer = {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

export class MyType {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): MyType {
		return $.markAsStructValue(new MyType(this))
	}

	public String(): string {
		const m = this
		return "MyType"
	}

	static __typeInfo = $.registerStructType(
		"main.MyType",
		() => new MyType(),
		() => [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])],
		MyType,
		() => []
	)
}

export async function main(): globalThis.Promise<void> {
	let t = reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.MyType", zero: () => $.markAsStructValue(new MyType()), methods: {String: (receiver: any, ...args: any[]) => $.pointerValue(receiver).String(...$.stripGenericTypeArgs(args))} }})
	let ptr = reflect.PointerTo($.pointerValueOrNil(t)!)
	let iface = reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.Stringer", zero: () => null, methods: {String: (receiver: any, ...args: any[]) => receiver.String(...$.stripGenericTypeArgs(args))} }})

	await $.println("MyType implements Stringer:", await $.pointerValue<Exclude<reflect.Type, null>>(t).Implements($.pointerValueOrNil(iface)!))
	await $.println("*MyType implements Stringer:", await $.pointerValue<Exclude<reflect.Type, null>>(ptr).Implements($.pointerValueOrNil(iface)!))
}

if ($.isMainScript(import.meta)) {
	await main()
}

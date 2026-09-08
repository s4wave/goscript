// Generated file based on type_method_primitive.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type MyInt = number

export type Doubler = {
	Double(): number
}

$.registerInterfaceType(
	"main.Doubler",
	null,
	[{ name: "Double", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export type Stringer = {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export type MyBool = boolean

export function MyInt_Double(m: MyInt): number {
	return $.int(m) * 2
}

export function MyBool_String(b: $.VarRef<MyBool> | null): string {
	if ($.pointerValue<MyBool>(b)) {
		return "true"
	}
	return "false"
}

export function asDoubler(v: MyInt): Doubler | null {
	return $.namedValueInterfaceValue<Doubler | null>(v, "main.MyInt", {Double: (receiver: any, ...args: any[]) => (MyInt_Double as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.basicType("int", "main.MyInt"), [{ name: "Double", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("int") }] }])
}

export async function sumDoublers(vals: $.Slice<Doubler | null>): globalThis.Promise<number> {
	return await $.pointerValue<Exclude<Doubler, null>>($.arrayIndex(vals!, 0)).Double() + await $.pointerValue<Exclude<Doubler, null>>($.arrayIndex(vals!, 1)).Double()
}

export function assertDoubler(__typeArgs: $.GenericTypeArgs | undefined, v: Doubler | null): [any, boolean] {
	let [out, ok] = $.typeAssertTuple<any>(v, __typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [{ name: "Double", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("int") }] }] })
	return [out, ok]
}

export function assertStringer(__typeArgs: $.GenericTypeArgs | undefined, v: Stringer | null): [any, boolean] {
	let [out, ok] = $.typeAssertTuple<any>(v, __typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [{ name: "String", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("string") }] }] })
	return [out, ok]
}

export function newMyBool(value: boolean, target: $.VarRef<boolean> | null): $.VarRef<MyBool> | null {
	target!.value = value
	return target
}

export async function main(): globalThis.Promise<void> {
	// Test direct method call on type conversion
	let result = MyInt_Double(5)
	await $.println("Direct call:", result)

	// Test storing method reference (this is the failing case)
	let fn: (() => number | globalThis.Promise<number>) | null = $.functionValue(((__receiver) => () => MyInt_Double(__receiver))(10), ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))
	await $.println("Method ref call:", await fn!())

	let d: Doubler | null = $.namedValueInterfaceValue<Doubler | null>(12, "main.MyInt", {Double: (receiver: any, ...args: any[]) => (MyInt_Double as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.basicType("int", "main.MyInt"), [{ name: "Double", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("int") }] }])
	await $.println("Interface method call:", await $.pointerValue<Exclude<Doubler, null>>(d).Double())

	let ret = asDoubler(13)
	await $.println("Returned interface call:", await $.pointerValue<Exclude<Doubler, null>>(ret).Double())

	let [asserted, ok] = $.typeAssertTuple<MyInt>(ret, /* @__PURE__ */ $.basicType("int", "main.MyInt"))
	await $.println("Interface assertion:", $.int(asserted), ok)

	let vals: $.Slice<Doubler | null> = null! as $.Slice<Doubler | null>
	vals = $.append(vals, $.namedValueInterfaceValue<Doubler | null>(14, "main.MyInt", {Double: (receiver: any, ...args: any[]) => (MyInt_Double as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.basicType("int", "main.MyInt"), [{ name: "Double", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("int") }] }]), $.namedValueInterfaceValue<Doubler | null>(15, "main.MyInt", {Double: (receiver: any, ...args: any[]) => (MyInt_Double as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, /* @__PURE__ */ $.basicType("int", "main.MyInt"), [{ name: "Double", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("int") }] }]), $.appendZeros.nil)
	await $.println("Interface slice append:", await sumDoublers(vals))

	let __goscriptTuple0: any = assertDoubler({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int", "main.MyInt"), zero: () => 0, methods: {Double: (receiver: any, ...args: any[]) => (MyInt_Double as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [{ name: "Double", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("int") }] }] }}, ret)
	let genericAsserted = (__goscriptTuple0[0] as MyInt)
	let genericOK = __goscriptTuple0[1]
	await $.println("Generic interface assertion:", $.int(genericAsserted), genericOK)

	let flag: $.VarRef<boolean> = $.varRef(false)
	let stringer: Stringer | null = $.namedValueInterfaceValue<Stringer | null>(newMyBool(true, flag), "*main.MyBool", {String: (receiver: any, ...args: any[]) => (MyBool_String as any)(receiver, ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Pointer, elemType: /* @__PURE__ */ $.basicType("bool", "main.MyBool") }, [{ name: "String", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("string") }] }])
	await $.println("Pointer primitive interface:", await $.pointerValue<Exclude<Stringer, null>>(stringer).String(), flag.value)

	let __goscriptTuple1: any = assertStringer({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: { kind: $.TypeKind.Pointer, elemType: /* @__PURE__ */ $.basicType("bool", "main.MyBool") }, zero: () => null, methods: {String: (receiver: any, ...args: any[]) => (MyBool_String as any)(receiver, ...$.stripGenericTypeArgs(args))}, methodSignatures: [{ name: "String", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("string") }] }] }}, stringer)
	let genericPointer: $.VarRef<MyBool> | null = (__goscriptTuple1[0] as $.VarRef<MyBool> | null)
	let genericPointerOK = __goscriptTuple1[1]
	await $.println("Generic pointer interface assertion:", MyBool_String(genericPointer), genericPointerOK)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on issue_120_generic_zero_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strconv from "@goscript/strconv/index.js"
import "@goscript/strconv/index.js"

export type Stringer = {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export type IntVal = number

export type StringVal = string

export type Pair = number[]

export function IntVal_String(i: IntVal): string {
	return strconv.Itoa($.int(i))
}

export function StringVal_String(s: StringVal): string {
	return s
}

export function ZeroValue(__typeArgs: $.GenericTypeArgs | undefined): any {
	let zero: any = $.genericZero(__typeArgs, "T", null)
	return zero
}

export function ZeroArrayLiteral(__typeArgs: $.GenericTypeArgs | undefined): any {
	return $.genericZero(__typeArgs, "T", null)
}

export async function CallString(__typeArgs: $.GenericTypeArgs | undefined, v: any): globalThis.Promise<string> {
	return $.callGenericMethod(__typeArgs, "T", "String", v)
}

export function Sum<T>(__typeArgs: $.GenericTypeArgs | undefined, vals: $.Slice<T>): any {
	let sum: any = $.genericZero(__typeArgs, "T", null)
	// Note: We can't actually add T values in Go without more constraints
	// This just tests that sum has the right zero value and String() works
	return sum
}

export async function main(): globalThis.Promise<void> {
	// Test 1: Zero value of IntVal should be 0
	let zeroInt = (ZeroValue({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int", "main.IntVal"), zero: () => 0, methods: {String: (receiver: any, ...args: any[]) => (IntVal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }}) as IntVal)
	await $.println("ZeroValue[IntVal]:", IntVal_String(zeroInt))

	// Test 2: Zero value of StringVal should be ""
	let zeroStr = (ZeroValue({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string", "main.StringVal"), zero: () => "", methods: {String: (receiver: any, ...args: any[]) => (StringVal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }}) as StringVal)
	await $.println("ZeroValue[StringVal] len:", $.len(StringVal_String(zeroStr)))

	// Test 3: CallString on zero value
	await $.println("CallString on zero IntVal:", await CallString({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int", "main.IntVal"), zero: () => 0, methods: {String: (receiver: any, ...args: any[]) => (IntVal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }}, zeroInt))
	await $.println("CallString on zero StringVal len:", $.len(await CallString({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string", "main.StringVal"), zero: () => "", methods: {String: (receiver: any, ...args: any[]) => (StringVal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }}, zeroStr)))

	// Test 4: Sum returns zero value
	let sumInt = (Sum({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int", "main.IntVal"), zero: () => 0, methods: {String: (receiver: any, ...args: any[]) => (IntVal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }}, null) as IntVal)
	await $.println("Sum[IntVal]():", IntVal_String(sumInt))

	let sumStr = (Sum({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string", "main.StringVal"), zero: () => "", methods: {String: (receiver: any, ...args: any[]) => (StringVal_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])] }}, null) as StringVal)
	await $.println("Sum[StringVal]() len:", $.len(StringVal_String(sumStr)))

	// Test 5: Verify the actual values
	await $.println("zeroInt == 0:", zeroInt == 0)
	await $.println("zeroStr == \"\":", $.stringEqual(zeroStr, ""))

	// Test 6: T{} returns the instantiated array zero value.
	let zeroPair = ($.cloneArrayValue(ZeroArrayLiteral({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.Pair", zero: () => Array.from({ length: 2 }, () => 0) }}), "main.Pair") as Pair)
	await $.println("ZeroArrayLiteral[Pair] len:", $.len(zeroPair))
	await $.println("ZeroArrayLiteral[Pair] zero:", ($.arrayIndex(zeroPair, 0) == 0) && ($.arrayIndex(zeroPair, 1) == 0))
}

if ($.isMainScript(import.meta)) {
	await main()
}

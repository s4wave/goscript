// Generated file based on named_array_value_receiver_pointer_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type flags = number[]

$.registerNamedType("main.flags", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2));

$.registerNamedValueType(
	"main.flags",
	{values: (receiver: any) => (flags_values as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("values", [], [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")])]
);

$.registerNamedValueType(
	"*main.flags",
	{set: (receiver: any, ...args: any[]) => (flags__set as any)(receiver, ...$.stripGenericTypeArgs(args)), values: (receiver: any) => (flags_values as any)($.pointerValue(receiver))},
	[$.methodSignature("set", [["idx", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("values", [], [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")])]
);

export type Matrix = number[]

$.registerNamedType("main.Matrix", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 4));

$.registerNamedValueType(
	"main.Matrix",
	{Scaled: (receiver: any, ...args: any[]) => (Matrix_Scaled as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Sum: (receiver: any) => (Matrix_Sum as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("Scaled", [["s", /* @__PURE__ */ $.basicType("float32")]], ["main.Matrix"]), $.methodSignature("Sum", [], [/* @__PURE__ */ $.basicType("float32")])]
);

$.registerNamedValueType(
	"*main.Matrix",
	{Scale: (receiver: any, ...args: any[]) => (Matrix_Scale as any)(receiver, ...$.stripGenericTypeArgs(args)), Scaled: (receiver: any, ...args: any[]) => (Matrix_Scaled as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args)), Sum: (receiver: any) => (Matrix_Sum as any)($.pointerValue(receiver))},
	[$.methodSignature("Scale", [["s", /* @__PURE__ */ $.basicType("float32")]]), $.methodSignature("Scaled", [["s", /* @__PURE__ */ $.basicType("float32")]], ["main.Matrix"]), $.methodSignature("Sum", [], [/* @__PURE__ */ $.basicType("float32")])]
);

export function flags__set(f: $.VarRef<flags> | null, idx: number): void {
	$.pointerValue<number[]>(f)[idx] = idx + 1
}

export function flags_values(__goscriptReceiver0: flags): [number, number] {
	let f: $.VarRef<flags> = $.varRef($.cloneArrayValue(__goscriptReceiver0, "main.flags"))
	flags__set(f, 0)
	flags__set(f, 1)
	return [f.value[0], f.value[1] + 1]
}

export function Matrix_Scaled(__goscriptReceiver1: Matrix, s: number): Matrix {
	let m: $.VarRef<Matrix> = $.varRef($.cloneArrayValue(__goscriptReceiver1, "main.Matrix"))
	Matrix_Scale(m, s)
	return $.cloneArrayValue(m.value, "main.Matrix")
}

export function Matrix_Scale(m: $.VarRef<Matrix> | null, s: number): void {
	for (let __goscriptRangeTarget0 = $.pointerValue<number[]>(m), __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
		$.pointerValue<number[]>(m)[i] = globalThis.Math.fround($.pointerValue<number[]>(m)[i] * (s))
	}
}

export function Matrix_Sum(__goscriptReceiver2: Matrix): number {
	let m: Matrix = $.cloneArrayValue(__goscriptReceiver2, "main.Matrix")
	let t = 0
	for (let __goscriptRangeTarget1 = m, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), i = 0; i < __goscriptRangeWindow1.length; i++) {
		t = globalThis.Math.fround(t + (m[$.checkArrayIndex(i, 4)]))
		m[i] = 0
	}
	return t
}

export async function main(): globalThis.Promise<void> {
	let [left, right] = flags_values($.arrayValue(globalThis.Array.from({ length: 2 }, () => 0)))
	await $.println(left)
	await $.println(right)

	await receiverCopies()
}

export async function receiverCopies(): globalThis.Promise<void> {
	let m = $.varRef($.arrayValue([1, 2, 3, 4], __goscriptStatic0()))
	let original = $.cloneArrayValue(m.value, "main.Matrix")
	let r = Matrix_Scaled(m.value, 2)
	await $.println("m:", m.value[0], m.value[1], m.value[2], m.value[3])
	await $.println("r:", r[0], r[1], r[2], r[3])
	await $.println("original equal:", $.arrayEqual(original, m.value))
	await $.println("sum:", Matrix_Sum(m.value), m.value[0])
	let p = m
	await $.println("ptr sum:", Matrix_Sum($.pointerValue<Matrix>(p)), $.arrayIndex($.pointerValue<number[]>(p), 0))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 4))
}

if ($.isMainScript(import.meta)) {
	await main()
}

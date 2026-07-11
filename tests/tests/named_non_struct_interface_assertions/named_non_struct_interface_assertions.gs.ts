// Generated file based on named_non_struct_interface_assertions.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type adder = {
	Add(_p0: number): number | globalThis.Promise<number>
}

$.registerInterfaceType(
	"main.adder",
	null,
	[{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export type namedSlice = $.Slice<number>

export type namedMap = globalThis.Map<string, number> | null

export type namedArray = number[]

export type namedInt = number

export type pointerSlice = $.Slice<number>

export type pointerMap = globalThis.Map<string, number> | null

export function namedSlice_Add(v: namedSlice, n: number): number {
	return $.len((v as namedSlice)) + n
}

export function namedMap_Add(v: namedMap, n: number): number {
	return $.len(v) + n
}

export function namedArray_Add(v: namedArray, n: number): number {
	return $.len(v) + n
}

export function namedInt_Add(v: namedInt, n: number): number {
	return $.int(v) + n
}

export function pointerSlice_Add(v: $.VarRef<pointerSlice> | null, n: number): number {
	return $.len(($.pointerValue<pointerSlice>(v) as pointerSlice)) + n
}

export function pointerMap_Add(v: $.VarRef<pointerMap> | null, n: number): number {
	return $.len($.pointerValue<pointerMap>(v)) + n
}

export async function check(value: any): globalThis.Promise<void> {
	let __goscriptTuple0: any = $.typeAssertTuple<adder | null>(value, "main.adder")
	let __goscriptShadow0 = __goscriptTuple0[0]
	let ok = __goscriptTuple0[1]
	if (!ok) {
		$.println(false)
		return
	}
	$.println(ok, await $.pointerValue<Exclude<adder, null>>(__goscriptShadow0).Add(3))
}

export async function main(): globalThis.Promise<void> {
	await check($.namedValueInterfaceValue<any>($.arrayToSlice<number>([1, 2]), "main.namedSlice", {Add: (receiver: any, ...args: any[]) => (namedSlice_Add as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, "main.namedSlice", [{ name: "Add", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]))
	await check($.namedValueInterfaceValue<any>(new globalThis.Map<string, number>([["one", 1], ["two", 2]]), "main.namedMap", {Add: (receiver: any, ...args: any[]) => (namedMap_Add as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, "main.namedMap", [{ name: "Add", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]))
	await check($.namedValueInterfaceValue<any>([1, 2], "main.namedArray", {Add: (receiver: any, ...args: any[]) => (namedArray_Add as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, "main.namedArray", [{ name: "Add", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]))
	await check($.namedValueInterfaceValue<any>(4, "main.namedInt", {Add: (receiver: any, ...args: any[]) => (namedInt_Add as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "int", typeName: "main.namedInt" }, [{ name: "Add", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]))
	let value: $.VarRef<pointerSlice> = $.varRef(($.arrayToSlice<number>([1, 2]) as pointerSlice))
	await check($.namedValueInterfaceValue<any>(value, "*main.pointerSlice", {Add: (receiver: any, ...args: any[]) => (pointerSlice_Add as any)(receiver, ...args)}, { kind: $.TypeKind.Pointer, elemType: "main.pointerSlice" }, [{ name: "Add", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]))
	let mapped: $.VarRef<pointerMap> = $.varRef(new globalThis.Map<string, number>([["one", 1], ["two", 2]]))
	await check($.namedValueInterfaceValue<any>(mapped, "*main.pointerMap", {Add: (receiver: any, ...args: any[]) => (pointerMap_Add as any)(receiver, ...args)}, { kind: $.TypeKind.Pointer, elemType: "main.pointerMap" }, [{ name: "Add", args: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]))
}

if ($.isMainScript(import.meta)) {
	await main()
}

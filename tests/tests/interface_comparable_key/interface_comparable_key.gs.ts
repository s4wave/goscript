// Generated file based on interface_comparable_key.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type ref = {
	Key(): any
}

$.registerInterfaceType(
	"main.ref",
	null,
	[{ name: "Key", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export type valueHash = Uint8Array

$.registerNamedType("main.valueHash", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4));

$.registerNamedValueType(
	"main.valueHash",
	{Key: (receiver: any) => (valueHash_Key as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("Key", [], [{ kind: $.TypeKind.Interface, methods: [] }])]
);

$.registerNamedValueType(
	"*main.valueHash",
	{Key: (receiver: any) => (valueHash_Key as any)($.pointerValue(receiver))},
	[$.methodSignature("Key", [], [{ kind: $.TypeKind.Interface, methods: [] }])]
);

export function valueHash_Key(h: valueHash): any {
	return $.namedValueInterfaceValue<any>(h, "main.valueHash", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2())
}

export function sameKey(a: ref | null, b: ref | null): boolean {
	return $.comparableEqual((a !== null && (a as any).__isVarRef !== true && ((a as any).__goValue === undefined || (a as any).__goType?.charCodeAt(0) !== 42) ? (a as Exclude<ref, null>) : $.pointerValue<Exclude<ref, null>>(a)).Key(), (b !== null && (b as any).__isVarRef !== true && ((b as any).__goValue === undefined || (b as any).__goType?.charCodeAt(0) !== 42) ? (b as Exclude<ref, null>) : $.pointerValue<Exclude<ref, null>>(b)).Key())
}

export function differentKey(a: ref | null, b: ref | null): boolean {
	return !$.comparableEqual((a !== null && (a as any).__isVarRef !== true && ((a as any).__goValue === undefined || (a as any).__goType?.charCodeAt(0) !== 42) ? (a as Exclude<ref, null>) : $.pointerValue<Exclude<ref, null>>(a)).Key(), (b !== null && (b as any).__isVarRef !== true && ((b as any).__goValue === undefined || (b as any).__goType?.charCodeAt(0) !== 42) ? (b as Exclude<ref, null>) : $.pointerValue<Exclude<ref, null>>(b)).Key())
}

export async function _catch(fn: (() => void) | null): globalThis.Promise<string> {
	let msg = ""
	const __defer = new $.DisposableStack()
	try {
		msg = "none"
		__defer.defer(() => { (() => {
			{
				let r = $.recover()
				if (r != null) {
					msg = ($.pointerValue<Exclude<$.GoError, null>>($.mustTypeAssert<$.GoError>(r, "error")).Error() as string)
				}
			}
		})() })
		void (__goscriptAwait = fn!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		__defer.dispose()
		return msg
		__defer.dispose()
	} catch (e) {
		__defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
	return msg
}

export async function main(): globalThis.Promise<void> {
	let a = $.arrayValue(new Uint8Array([0, 7, 0, 0]))
	let b = $.arrayValue(new Uint8Array([0, 7, 0, 0]))
	let c = $.arrayValue(new Uint8Array([0, 0, 7, 0]))

	await $.println("same:", sameKey($.namedValueInterfaceValue<ref | null>(a, "main.valueHash", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()), $.namedValueInterfaceValue<ref | null>(b, "main.valueHash", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2())))
	await $.println("different:", differentKey($.namedValueInterfaceValue<ref | null>(a, "main.valueHash", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2()), $.namedValueInterfaceValue<ref | null>(c, "main.valueHash", __goscriptStatic0(), __goscriptStatic1(), __goscriptStatic2())))

	// Interfaces holding the same uncomparable dynamic type panic when
	// compared, even with themselves, and cannot be map keys.
	let x: any = $.interfaceValue($.arrayToSlice<number>([1]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")))
	let s: any = "s"
	await $.println("self:", await _catch($.functionValue(async () => {
		await $.println($.comparableEqual(x, x))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	await $.println("mixed:", await _catch($.functionValue(async () => {
		await $.println($.comparableEqual(x, s))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	let e1: any = $.interfaceValue($.arrayValue([$.interfaceValue($.arrayToSlice<number>([1]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")))]), "[1]interface{}", /* @__PURE__ */ $.arrayType({ kind: $.TypeKind.Interface, methods: [] }, 1))
	let e2: any = $.interfaceValue($.arrayValue([$.interfaceValue($.arrayToSlice<number>([1]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")))]), "[1]interface{}", /* @__PURE__ */ $.arrayType({ kind: $.TypeKind.Interface, methods: [] }, 1))
	await $.println("array:", await _catch($.functionValue(async () => {
		await $.println($.comparableEqual(e1, e2))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	let m = $.makeMap<any, number>([])
	await $.println("map set:", await _catch($.functionValue(() => {
		$.mapSet(m, x, 1)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	await $.println("map get:", await _catch($.functionValue(() => {
		$.mapGet<any, number, number>(m, x, 0)[0]
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	await $.println("map delete:", await _catch($.functionValue(() => {
		$.deleteMapEntry(m, x)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	let nilMap: globalThis.Map<any, number> | null = null! as globalThis.Map<any, number> | null
	await $.println("nil map get:", await _catch($.functionValue(() => {
		$.mapGet<any, number, number>(nilMap, x, 0)[0]
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	await $.println("map len:", $.len(m))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({Key: (receiver: any) => (valueHash_Key as any)(($.isVarRef(receiver) ? receiver.value : receiver))})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ("main.valueHash")
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ([$.methodSignature("Key", [], [{ kind: $.TypeKind.Interface, methods: [] }])])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

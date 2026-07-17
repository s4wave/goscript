// Generated file based on typed_nil_runtime_metadata.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as reflect from "@goscript/reflect/index.js"
import "@goscript/reflect/index.js"

export type reader = {
	Read(_p0: $.Slice<number>): [number, $.GoError] | globalThis.Promise<[number, $.GoError]>
}

$.registerInterfaceType(
	"main.reader",
	null,
	[{ name: "Read", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }]
);

export class source {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): source {
		const cloned = new source()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Read(value: $.Slice<number>): [number, $.GoError] {
		return [$.len(value), null]
	}

	static __typeInfo = $.registerStructType(
		"main.source",
		() => new source(),
		[{ name: "Read", args: [{ name: "value", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }],
		source,
		[]
	)
}

export function mapComparisonPanics(): boolean {
	let panicked: boolean = false
	const __defer = new $.DisposableStack()
	try {
		__defer.defer(() => { ((): void => {
			panicked = $.recover() != null
		})() })
		let mapped: globalThis.Map<string, number> | null = null! as globalThis.Map<string, number> | null
		let left: any = $.interfaceValue<any>(mapped, "map[string]int", { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "int" } })
		let right: any = $.interfaceValue<any>(mapped, "map[string]int", { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "int" } })
		$.comparableEqual(left, right)
		const __goscriptReturn0: boolean = false
		panicked = __goscriptReturn0
		__defer.dispose()
		return panicked
		__defer.dispose()
	} catch (e) {
		__defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
	return panicked
}

export async function main(): globalThis.Promise<void> {
	let mapped: globalThis.Map<string, number> | null = null! as globalThis.Map<string, number> | null
	let mappedAny: any = $.interfaceValue<any>(mapped, "map[string]int", { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "int" } })
	let __goscriptTuple0: any = $.typeAssertTuple<globalThis.Map<string, number> | null>(mappedAny, { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "int" } })
	let mappedValue: globalThis.Map<string, number> | null = __goscriptTuple0[0]
	let mappedOK = __goscriptTuple0[1]
	$.println("map", mappedOK, mappedValue == null)

	let channel: $.Channel<number> | null = null! as $.Channel<number> | null
	let channelAny: any = $.interfaceValue<any>(channel, "chan int", { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "int" } })
	let __goscriptTuple1: any = $.typeAssertTuple<$.Channel<number> | null>(channelAny, { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "int" } })
	let channelValue: $.Channel<number> | null = __goscriptTuple1[0]
	let channelOK = __goscriptTuple1[1]
	$.println("chan", channelOK, channelValue == null)

	let callback: (() => void) | null = null! as (() => void) | null
	let callbackAny: any = $.interfaceValue<any>(callback, "func()", ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
	let [callbackValue, callbackOK] = $.typeAssertTuple<(() => void) | null>(callbackAny, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))
	$.println("func", callbackOK, callbackValue == null)

	let pointer: source | $.VarRef<source> | null = null! as source | $.VarRef<source> | null
	let pointerAny: any = $.interfaceValue<any>(pointer, "*main.source", { kind: $.TypeKind.Pointer, elemType: "main.source" })
	let [readerValue, readerOK] = $.typeAssertTuple<reader | null>(pointerAny, "main.reader")
	let [count, err] = await $.pointerValue<Exclude<reader, null>>(readerValue).Read(new Uint8Array([1, 2]) as $.Slice<number>)
	if (err != null) {
		$.panic((err as any))
	}
	$.println("reader", readerOK, count)

	let mappedReflect = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>(mapped, "map[string]int", { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "int" } }))))
	$.println("reflect-map", $.markAsStructValue($.cloneStructValue(mappedReflect)).Kind() == reflect.Map, $.markAsStructValue($.cloneStructValue(mappedReflect)).IsNil())

	let pointerReflect = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>(pointer, "*main.source", { kind: $.TypeKind.Pointer, elemType: "main.source" }))))
	$.println("reflect-pointer", $.markAsStructValue($.cloneStructValue(pointerReflect)).Kind() == reflect.Pointer, $.markAsStructValue($.cloneStructValue(pointerReflect)).IsNil(), await $.pointerValue<Exclude<reflect.Type, null>>((await $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(pointerReflect)).Type()).Elem())).Kind() == reflect.Struct)

	$.println("map-comparison-panics", mapComparisonPanics())
}

if ($.isMainScript(import.meta)) {
	await main()
}

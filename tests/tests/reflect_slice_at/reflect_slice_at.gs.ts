// Generated file based on reflect_slice_at.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"
import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export class Sub {
	public declare X: number

	public declare Y: string

	constructor(__goscriptValue?: boolean, X$?: number, Y$?: string) {
		this.X = X$ ?? 0
		this.Y = Y$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Sub {
		return new Sub(true, this.X, this.Y)
	}

	public __goscriptAssign(source: Sub): this {
		this.X = source.X
		this.Y = source.Y
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Sub",
		() => new Sub(),
		() => [],
		Sub,
		() => [/* @__PURE__ */ $.structField("X", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("Y", /* @__PURE__ */ $.basicType("string"), [1], 8, true)]
	)
}

export class T {
	public declare Mbr1: string

	public declare Mbr2: number

	public declare S: Sub

	constructor(__goscriptValue?: boolean, Mbr1$?: string, Mbr2$?: number, S$?: Sub) {
		this.Mbr1 = Mbr1$ ?? ""
		this.Mbr2 = Mbr2$ ?? 0
		this.S = S$ ?? new Sub(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): T {
		return new T(true, this.Mbr1, this.Mbr2, this.S.clone())
	}

	public __goscriptAssign(source: T): this {
		this.Mbr1 = source.Mbr1
		this.Mbr2 = source.Mbr2
		this.S.__goscriptAssign(source.S)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.T",
		() => new T(),
		() => [],
		T,
		() => [/* @__PURE__ */ $.structField("Mbr1", /* @__PURE__ */ $.basicType("string"), [0], 0, true), /* @__PURE__ */ $.structField("Mbr2", /* @__PURE__ */ $.basicType("int"), [1], 16, true), /* @__PURE__ */ $.structField("S", "main.Sub", [2], 24, true)]
	)
}

export let pt: $.VarRef<T> = $.varRef(new T(true))

export function __goscript_set_pt(__goscriptValue: T): void {
	$.assignStruct(pt.value, __goscriptValue)
}

export function fieldValue(obj: any, fld: reflect.StructField): reflect.Value {
	let ov = $.markAsStructValue($.cloneStructValue(reflect.ValueOf(obj)))
	let f = ($.wideUintAdd($.markAsStructValue($.cloneStructValue(ov)).Pointer(), fld.Offset) as any)
	return $.markAsStructValue($.cloneStructValue(reflect.NewAt($.pointerValueOrNil(fld.Type)!, f)))
}

export async function newAtOffsets(): globalThis.Promise<void> {
	let typ = reflect.TypeOf($.structInterfaceValue((pt.value).clone(), "main.T", "main.T"))
	let [fld, ] = await (typ !== null && (typ as any).__isVarRef !== true && ((typ as any).__goValue === undefined || (typ as any).__goType?.charCodeAt(0) !== 42) ? (typ as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(typ)).FieldByName("Mbr2")
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(fieldValue($.interfaceValue(pt, "*main.T", /* @__PURE__ */ $.pointerType("main.T")), fld))).Elem())).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(10, "int")))))
	await $.println("newat-offset:", pt.value.Mbr2)

	let __goscriptTuple0: any = await (typ !== null && (typ as any).__isVarRef !== true && ((typ as any).__goValue === undefined || (typ as any).__goType?.charCodeAt(0) !== 42) ? (typ as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(typ)).FieldByName("Mbr1")
	fld = $.assignStruct(fld, __goscriptTuple0[0])
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(fieldValue($.interfaceValue(pt, "*main.T", /* @__PURE__ */ $.pointerType("main.T")), fld))).Elem())).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf("new"))))
	await $.println("newat-offset:", pt.value.Mbr1, pt.value.Mbr2)

	let [sf, ] = await (typ !== null && (typ as any).__isVarRef !== true && ((typ as any).__goValue === undefined || (typ as any).__goType?.charCodeAt(0) !== 42) ? (typ as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(typ)).FieldByName("S")
	let [yf, ] = await $.pointerValue<Exclude<reflect.Type, null>>(sf.Type).FieldByName("Y")
	let ov = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(pt, "*main.T", /* @__PURE__ */ $.pointerType("main.T")))))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.NewAt($.pointerValueOrNil(yf.Type)!, ($.wideUintAdd(($.wideUintAdd($.markAsStructValue($.cloneStructValue(ov)).Pointer(), sf.Offset)), yf.Offset) as any)))).Elem())).SetString("sub")
	await $.println("newat-offset:", pt.value.S.Y)

	let local = new T()
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(fieldValue($.interfaceValue(local, "*main.T", /* @__PURE__ */ $.pointerType("main.T")), fld))).Elem())).SetString("loc")
	await $.println("newat-offset:", $.pointerValue<T>(local).Mbr1)

	let v = $.varRef(3)
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.NewAt($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic0()))!, ($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(v, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))))).Pointer() as any)))).Elem())).SetInt(4n)
	await $.println("newat-offset:", v.value)
}

export async function main(): globalThis.Promise<void> {
	let local = $.varRef(41)
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.NewAt($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic0()))!, (local as any)))).Elem())).SetInt(42n)
	await $.println("newat-local:", local.value)

	class holder {
		public declare Count: number

		constructor(init?: Partial<{Count?: number}>, __goscriptValue?: boolean) {
			this.Count = init?.Count ?? (0 as number)
			;(this as any)[$.structValueMarker] = __goscriptValue === true
		}

		public clone(): holder {
			return new holder(this, true)
		}

		public __goscriptAssign(source: holder): this {
			this.Count = source.Count
			return this
		}

		static __typeInfo = $.registerStructType(
			"main.holder",
			() => new holder(),
			() => [],
			holder,
			() => [/* @__PURE__ */ $.structField("Count", /* @__PURE__ */ $.basicType("int"), [0], 0, true)]
		)
	}
	let h = $.markAsStructValue(new holder({Count: 5}))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.NewAt($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic0()))!, ($.fieldRef(h, "Count") as any)))).Elem())).SetInt(6n)
	await $.println("newat-field:", h.Count)

	let buf = new Uint8Array([1, 2, 3, 4]) as $.Slice<number>
	let bytes = $.markAsStructValue($.cloneStructValue(reflect.SliceAt($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic1()))!, ($.indexRef(buf!, 1) as any), 2)))
	await $.println("bytes:", $.markAsStructValue($.cloneStructValue(bytes)).Len(), $.markAsStructValue($.cloneStructValue(bytes)).Cap(), $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(bytes)).Index(0))).Uint(), $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(bytes)).Index(1))).Uint())
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(bytes)).Index(0))).SetUint(9n)
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(bytes)).Index(1))).SetUint(8n)
	await $.println("buf:", $.arrayIndex(buf!, 0), $.arrayIndex(buf!, 1), $.arrayIndex(buf!, 2), $.arrayIndex(buf!, 3))

	let ints = $.arrayToSlice<number>([10, 20, 30, 40])
	let intSlice = $.markAsStructValue($.cloneStructValue(reflect.SliceAt($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic0()))!, ($.indexRef(ints!, 1) as any), 2)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(intSlice)).Index(1))).SetInt(77n)
	await $.println("ints:", $.arrayIndex(ints!, 0), $.arrayIndex(ints!, 1), $.arrayIndex(ints!, 2), $.arrayIndex(ints!, 3), $.markAsStructValue($.cloneStructValue(intSlice)).Len(), $.markAsStructValue($.cloneStructValue(intSlice)).Cap())

	let empty = $.markAsStructValue($.cloneStructValue(reflect.SliceAt($.pointerValueOrNil(reflect.TypeFor(__goscriptStatic0()))!, (null as any), 0)))
	await $.println("empty:", $.markAsStructValue($.cloneStructValue(empty)).IsNil(), $.markAsStructValue($.cloneStructValue(empty)).Len(), $.markAsStructValue($.cloneStructValue(empty)).Cap())

	await newAtOffsets()

	await $.println("reflect_slice_at test finished")
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("uint8"), zero: () => 0 }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on reflect_generic_field_types.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export class Item {
	public declare Name: string

	public declare N: number

	constructor(__goscriptValue?: boolean, Name$?: string, N$?: number) {
		this.Name = Name$ ?? ""
		this.N = N$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Item {
		return new Item(true, this.Name, this.N)
	}

	public __goscriptAssign(source: Item): this {
		this.Name = source.Name
		this.N = source.N
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Item",
		() => new Item(),
		() => [],
		Item,
		() => [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true), /* @__PURE__ */ $.structField("N", /* @__PURE__ */ $.basicType("int"), [1], 16, true)]
	)
}

export class Option {
	public declare Value: any

	public declare Valid: boolean

	constructor(__goscriptValue?: boolean, Value$?: any, Valid$?: boolean) {
		this.Value = Value$ ?? (null! as any)
		this.Valid = Valid$ ?? false
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Option {
		return $.copyGenericInstance(this, new Option(true, $.copyElement(this.Value), this.Valid))
	}

	public __goscriptAssign(source: Option): this {
		this.Value = $.assignFieldValue(this.Value, source.Value)
		this.Valid = source.Valid
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Option",
		() => new Option(),
		() => [],
		Option,
		() => [/* @__PURE__ */ $.structField("Value", { kind: $.TypeKind.Interface, methods: [] }, [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 0, true)]
	)
}

export class List {
	public declare Values: $.Slice<any>

	public declare Keys: $.Slice<any>

	public declare index: globalThis.Map<any, number> | null

	constructor(__goscriptValue?: boolean, Values$?: $.Slice<any>, Keys$?: $.Slice<any>, index$?: globalThis.Map<any, number> | null) {
		this.Values = Values$ ?? (null! as $.Slice<any>)
		this.Keys = Keys$ ?? (null! as $.Slice<any>)
		this.index = index$ ?? (null! as globalThis.Map<any, number> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): List {
		return $.copyGenericInstance(this, new List(true, this.Values, this.Keys, this.index))
	}

	public __goscriptAssign(source: List): this {
		this.Values = source.Values
		this.Keys = source.Keys
		this.index = source.index
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.List",
		() => new List(),
		() => [],
		List,
		() => [/* @__PURE__ */ $.structField("Values", /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }), [0], 0, true), /* @__PURE__ */ $.structField("Keys", /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }), [1], 24, true), /* @__PURE__ */ $.structField("index", /* @__PURE__ */ $.mapType({ kind: $.TypeKind.Interface, methods: [] }, /* @__PURE__ */ $.basicType("int")), [2], 48, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/reflect_generic_field_types" })]
	)
}

export class Pair {
	public declare First: any

	public declare Second: any

	public declare Both: globalThis.Map<string, any> | null

	constructor(__goscriptValue?: boolean, First$?: any, Second$?: any, Both$?: globalThis.Map<string, any> | null) {
		this.First = First$ ?? (null! as any)
		this.Second = Second$ ?? (null! as any)
		this.Both = Both$ ?? (null! as globalThis.Map<string, any> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Pair {
		return $.copyGenericInstance(this, new Pair(true, $.copyElement(this.First), this.Second, this.Both))
	}

	public __goscriptAssign(source: Pair): this {
		this.First = $.assignFieldValue(this.First, source.First)
		this.Second = source.Second
		this.Both = source.Both
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Pair",
		() => new Pair(),
		() => [],
		Pair,
		() => [/* @__PURE__ */ $.structField("First", { kind: $.TypeKind.Interface, methods: [] }, [0], 0, true), /* @__PURE__ */ $.structField("Second", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Interface, methods: [] }), [1], 0, true), /* @__PURE__ */ $.structField("Both", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] }), [2], 0, true)]
	)
}

export class Data {
	public declare Opt: Option

	public declare List: List

	public declare Pair: Pair

	public declare OptP: Option | $.VarRef<Option> | null

	constructor(__goscriptValue?: boolean, Opt$?: Option, List$?: List, Pair$?: Pair, OptP$?: Option | $.VarRef<Option> | null) {
		this.Opt = Opt$ ?? new Option(true, null! as $.Slice<Item>)
		this.List = List$ ?? new List(true)
		this.Pair = Pair$ ?? new Pair(true, 0)
		this.OptP = OptP$ ?? (null! as Option | $.VarRef<Option> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Data {
		return new Data(true, this.Opt.clone(), this.List.clone(), this.Pair.clone(), this.OptP)
	}

	public __goscriptAssign(source: Data): this {
		this.Opt.__goscriptAssign(source.Opt)
		this.List.__goscriptAssign(source.List)
		this.Pair.__goscriptAssign(source.Pair)
		this.OptP = source.OptP
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Data",
		() => new Data(),
		() => [],
		Data,
		() => [/* @__PURE__ */ $.structField("Opt", /* @__PURE__ */ $.genericStructType("main.Option", "main.Option[[]main.Item]", () => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.sliceType("main.Item"), [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 24, true)]), [0], 0, true), /* @__PURE__ */ $.structField("List", /* @__PURE__ */ $.genericStructType("main.List", "main.List[string,*main.Item]", () => [/* @__PURE__ */ $.structField("Values", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.Item")), [0], 0, true), /* @__PURE__ */ $.structField("Keys", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string")), [1], 24, true), /* @__PURE__ */ $.structField("index", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")), [2], 48, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/reflect_generic_field_types" })]), [1], 32, true), /* @__PURE__ */ $.structField("Pair", /* @__PURE__ */ $.genericStructType("main.Pair", "main.Pair[int,main.Item]", () => [/* @__PURE__ */ $.structField("First", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("Second", /* @__PURE__ */ $.pointerType("main.Item"), [1], 8, true), /* @__PURE__ */ $.structField("Both", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")), [2], 16, true)]), [2], 88, true), /* @__PURE__ */ $.structField("OptP", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Option", "main.Option[float64]", () => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.basicType("float64"), [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 8, true)])), [3], 112, true)]
	)
}

export async function main(): globalThis.Promise<void> {
	let t = reflect.TypeOf($.structInterfaceValue(new Data(true), "main.Data", "main.Data"))
	for (let i = 0; i < (__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).NumField(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait); i++) {
		let f = $.markAsStructValue($.cloneStructValue(((__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).Field(i), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as reflect.StructField)))
		let ft = f.Type
		if ((__goscriptAwait = (ft !== null && (ft as any).__isVarRef !== true && ((ft as any).__goValue === undefined || (ft as any).__goType?.charCodeAt(0) !== 42) ? (ft as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(ft)).Kind(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) == 22) {
			ft = (__goscriptAwait = (ft !== null && (ft as any).__isVarRef !== true && ((ft as any).__goValue === undefined || (ft as any).__goType?.charCodeAt(0) !== 42) ? (ft as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(ft)).Elem(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
		}
		for (let j = 0; j < (__goscriptAwait = (ft !== null && (ft as any).__isVarRef !== true && ((ft as any).__goValue === undefined || (ft as any).__goType?.charCodeAt(0) !== 42) ? (ft as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(ft)).NumField(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait); j++) {
			let sf = $.markAsStructValue($.cloneStructValue(((__goscriptAwait = (ft !== null && (ft as any).__isVarRef !== true && ((ft as any).__goValue === undefined || (ft as any).__goType?.charCodeAt(0) !== 42) ? (ft as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(ft)).Field(j), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as reflect.StructField)))
			await $.println(f.Name + "." + sf.Name + ":", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(sf.Type).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), reflect.Kind_String((__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(sf.Type).Kind(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)))
		}
	}

	// Decode-like setting through reflect uses the field types.
	let d: $.VarRef<Data> = $.varRef(new Data(true))
	let ov = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(d, "*main.Data", /* @__PURE__ */ $.pointerType("main.Data"))))).Elem())).Field(0))).Field(0)))
	let sl = $.markAsStructValue($.cloneStructValue(reflect.MakeSlice($.pointerValueOrNil($.markAsStructValue($.cloneStructValue(ov)).Type())!, 1, 1)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(sl)).Index(0))).Field(0))).SetString("x")
	$.markAsStructValue($.cloneStructValue(ov)).Set(sl)
	await $.println("opt:", $.sliceLen(d.value.Opt.Value), $.arrayIndex(d.value.Opt.Value!, 0).Name)
	let lv = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(d, "*main.Data", /* @__PURE__ */ $.pointerType("main.Data"))))).Elem())).Field(1))).Field(0)))
	$.markAsStructValue($.cloneStructValue(lv)).Set($.markAsStructValue($.cloneStructValue(reflect.Append($.markAsStructValue($.cloneStructValue(lv)), $.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil((__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>((__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(lv)).Type()).Elem(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)).Elem(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))!)))))))
	$.pointerValue<Item>($.arrayIndex(d.value.List.Values!, 0)).N = 3
	await $.println("list:", $.pointerValue<Item>($.arrayIndex(d.value.List.Values!, 0)).N)

	// Values of the instantiated types report the same field types.
	let o = new Option(true, 4, true)
	await $.println("value:", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(((__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.structInterfaceValue((o).clone(), "main.Option", /* @__PURE__ */ $.genericStructType("main.Option", "main.Option[int]", () => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 8, true)])))).Field(0), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as reflect.StructField).Type).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.structInterfaceValue((o).clone(), "main.Option", /* @__PURE__ */ $.genericStructType("main.Option", "main.Option[int]", () => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 8, true)]))))).Field(0))).Int())

	// Instantiated types are named with their type arguments and are
	// identical wherever they are described.
	let ot = ((__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).Field(0), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as reflect.StructField).Type
	await $.println("name:", (__goscriptAwait = (ot !== null && (ot as any).__isVarRef !== true && ((ot as any).__goValue === undefined || (ot as any).__goType?.charCodeAt(0) !== 42) ? (ot as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(ot)).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = (ot !== null && (ot as any).__isVarRef !== true && ((ot as any).__goValue === undefined || (ot as any).__goType?.charCodeAt(0) !== 42) ? (ot as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(ot)).Name(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = (ot !== null && (ot as any).__isVarRef !== true && ((ot as any).__goValue === undefined || (ot as any).__goType?.charCodeAt(0) !== 42) ? (ot as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(ot)).PkgPath(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println("identical:", $.comparableEqual(reflect.TypeOf($.structInterfaceValue((d.value.Opt).clone(), "main.Option", /* @__PURE__ */ $.genericStructType("main.Option", "main.Option[[]main.Item]", () => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.sliceType("main.Item"), [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 24, true)]))), ot), $.comparableEqual((__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.interfaceValue($.fieldRef(d.value, "List"), "*main.List", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.List", "main.List[string,*main.Item]", () => [/* @__PURE__ */ $.structField("Values", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.Item")), [0], 0, true), /* @__PURE__ */ $.structField("Keys", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string")), [1], 24, true), /* @__PURE__ */ $.structField("index", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")), [2], 48, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/reflect_generic_field_types" })]))))).Elem(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), ((__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).Field(1), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as reflect.StructField).Type), $.comparableEqual(ot, reflect.TypeOf($.structInterfaceValue(o, "main.Option", /* @__PURE__ */ $.genericStructType("main.Option", "main.Option[int]", () => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 8, true)])))))

	// Values made by reflect are of the instantiated type.
	let np = $.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil((__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(((__goscriptAwait = (t !== null && (t as any).__isVarRef !== true && ((t as any).__goValue === undefined || (t as any).__goType?.charCodeAt(0) !== 42) ? (t as Exclude<reflect.Type, null>) : $.pointerValue<Exclude<reflect.Type, null>>(t)).Field(3), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as reflect.StructField).Type).Elem(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))!)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(np)).Elem())).Field(0))).SetFloat(1.5)
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(d, "*main.Data", /* @__PURE__ */ $.pointerType("main.Data"))))).Elem())).Field(3))).Set($.markAsStructValue($.cloneStructValue(np)))
	await $.println("new:", $.pointerValue<Option>(d.value.OptP).Value)
	let __goscriptTuple0: any = $.typeAssertTuple<Option | $.VarRef<Option> | null>($.markAsStructValue($.cloneStructValue(np)).Interface(), /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Option", "main.Option[float64]", () => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.basicType("float64"), [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 8, true)])))
	let op: Option | $.VarRef<Option> | null = __goscriptTuple0[0]
	let ok: boolean = __goscriptTuple0[1]
	await $.println("assert:", ok, $.pointerValue<Option>(op).Value)
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(d, "*main.Data", /* @__PURE__ */ $.pointerType("main.Data"))))).Elem())).Field(0))).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.structInterfaceValue(new Option(true, null! as $.Slice<Item>, true), "main.Option", /* @__PURE__ */ $.genericStructType("main.Option", "main.Option[[]main.Item]", () => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.sliceType("main.Item"), [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 24, true)]))))))
	await $.println("set:", d.value.Opt.Valid, $.sliceLen(d.value.Opt.Value))
	let x: any = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.structInterfaceValue((d.value.Pair).clone(), "main.Pair", /* @__PURE__ */ $.genericStructType("main.Pair", "main.Pair[int,main.Item]", () => [/* @__PURE__ */ $.structField("First", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("Second", /* @__PURE__ */ $.pointerType("main.Item"), [1], 8, true), /* @__PURE__ */ $.structField("Both", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")), [2], 16, true)]))))).Interface()
	{
		const __goscriptTypeSwitchValue = x
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic0())) {
			case 0:
				{
					let p: Pair = $.markAsStructValue($.cloneStructValue($.typeAssert<Pair>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.genericStructType("main.Pair", "main.Pair[string,main.Item]", () => [/* @__PURE__ */ $.structField("First", /* @__PURE__ */ $.basicType("string"), [0], 0, true), /* @__PURE__ */ $.structField("Second", /* @__PURE__ */ $.pointerType("main.Item"), [1], 16, true), /* @__PURE__ */ $.structField("Both", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string")), [2], 24, true)])).value))
					await $.println("switch: wrong")
				}
				break
			case 1:
				{
					let p: Pair = $.markAsStructValue($.cloneStructValue($.typeAssert<Pair>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.genericStructType("main.Pair", "main.Pair[int,main.Item]", () => [/* @__PURE__ */ $.structField("First", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("Second", /* @__PURE__ */ $.pointerType("main.Item"), [1], 8, true), /* @__PURE__ */ $.structField("Both", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")), [2], 16, true)])).value))
					await $.println("switch:", p.First)
				}
				break
		}
	}

	// Values made in generic code are also of the instantiated type.
	let g = (wrap(__goscriptStatic1(), 2.5) as Option)
	await $.println("generic:", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.structInterfaceValue((g).clone(), "main.Option", /* @__PURE__ */ $.genericStructType("main.Option", "main.Option[float64]", () => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.basicType("float64"), [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 8, true)])))).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(((__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf($.structInterfaceValue((g).clone(), "main.Option", /* @__PURE__ */ $.genericStructType("main.Option", "main.Option[float64]", () => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.basicType("float64"), [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 8, true)])))).Field(0), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait) as reflect.StructField).Type).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(d, "*main.Data", /* @__PURE__ */ $.pointerType("main.Data"))))).Elem())).Field(3))).Elem())).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.structInterfaceValue(g, "main.Option", /* @__PURE__ */ $.genericStructType("main.Option", "main.Option[float64]", () => [/* @__PURE__ */ $.structField("Value", /* @__PURE__ */ $.basicType("float64"), [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 8, true)]))))))
	await $.println("generic set:", $.pointerValue<Option>(d.value.OptP).Value)
	let b = boxed(__goscriptStatic1(), 3.5)
	await $.println("boxed:", (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeOf(b)).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(d, "*main.Data", /* @__PURE__ */ $.pointerType("main.Data"))))).Elem())).Field(3))).Elem())).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf(b))))
	await $.println("boxed set:", $.pointerValue<Option>(d.value.OptP).Value)
}

export function boxed(__typeArgs: $.GenericTypeArgs | undefined, v: any): any {
	return $.genericInterfaceValue(new Option(true, $.copyElement(v), true), "main.Option", $.genericStructType("main.Option", $.genericTypeName("main.Option", [__typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }]), () => [/* @__PURE__ */ $.structField("Value", __typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }, [0], 0, true), /* @__PURE__ */ $.structField("Valid", /* @__PURE__ */ $.basicType("bool"), [1], 0, true)]))
}

export function wrap(__typeArgs: $.GenericTypeArgs | undefined, v: any): Option {
	return new Option(true, $.copyElement(v), true)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.genericStructType("main.Pair", "main.Pair[string,main.Item]", () => [/* @__PURE__ */ $.structField("First", /* @__PURE__ */ $.basicType("string"), [0], 0, true), /* @__PURE__ */ $.structField("Second", /* @__PURE__ */ $.pointerType("main.Item"), [1], 16, true), /* @__PURE__ */ $.structField("Both", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("string")), [2], 24, true)]), /* @__PURE__ */ $.genericStructType("main.Pair", "main.Pair[int,main.Item]", () => [/* @__PURE__ */ $.structField("First", /* @__PURE__ */ $.basicType("int"), [0], 0, true), /* @__PURE__ */ $.structField("Second", /* @__PURE__ */ $.pointerType("main.Item"), [1], 8, true), /* @__PURE__ */ $.structField("Both", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")), [2], 16, true)])]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("float64"), zero: () => 0 }})
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

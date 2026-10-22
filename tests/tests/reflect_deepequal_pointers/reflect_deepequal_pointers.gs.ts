// Generated file based on reflect_deepequal_pointers.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export class Inner {
	public declare Name: string

	public declare N: number

	constructor(__goscriptValue?: boolean, Name$?: string, N$?: number) {
		this.Name = Name$ ?? ""
		this.N = N$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Inner {
		return new Inner(true, this.Name, this.N)
	}

	public __goscriptAssign(source: Inner): this {
		this.Name = source.Name
		this.N = source.N
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Inner",
		() => new Inner(),
		() => [],
		Inner,
		() => [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true), /* @__PURE__ */ $.structField("N", /* @__PURE__ */ $.basicType("int"), [1], 16, true)]
	)
}

export class Outer {
	public declare P: Inner | $.VarRef<Inner> | null

	public declare IP: $.VarRef<number> | null

	public declare SP: $.VarRef<string> | null

	public declare PS: $.Slice<Inner | $.VarRef<Inner> | null>

	public declare PM: globalThis.Map<string, Inner | $.VarRef<Inner> | null> | null

	public declare In: Inner

	public declare Ptrs: $.Slice<$.VarRef<number> | null>

	constructor(__goscriptValue?: boolean, P$?: Inner | $.VarRef<Inner> | null, IP$?: $.VarRef<number> | null, SP$?: $.VarRef<string> | null, PS$?: $.Slice<Inner | $.VarRef<Inner> | null>, PM$?: globalThis.Map<string, Inner | $.VarRef<Inner> | null> | null, In$?: Inner, Ptrs$?: $.Slice<$.VarRef<number> | null>) {
		this.P = P$ ?? (null! as Inner | $.VarRef<Inner> | null)
		this.IP = IP$ ?? (null! as $.VarRef<number> | null)
		this.SP = SP$ ?? (null! as $.VarRef<string> | null)
		this.PS = PS$ ?? (null! as $.Slice<Inner | $.VarRef<Inner> | null>)
		this.PM = PM$ ?? (null! as globalThis.Map<string, Inner | $.VarRef<Inner> | null> | null)
		this.In = In$ ?? new Inner(true)
		this.Ptrs = Ptrs$ ?? (null! as $.Slice<$.VarRef<number> | null>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Outer {
		return new Outer(true, this.P, this.IP, this.SP, this.PS, this.PM, this.In.clone(), this.Ptrs)
	}

	public __goscriptAssign(source: Outer): this {
		this.P = source.P
		this.IP = source.IP
		this.SP = source.SP
		this.PS = source.PS
		this.PM = source.PM
		this.In.__goscriptAssign(source.In)
		this.Ptrs = source.Ptrs
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Outer",
		() => new Outer(),
		() => [],
		Outer,
		() => [/* @__PURE__ */ $.structField("P", /* @__PURE__ */ $.pointerType("main.Inner"), [0], 0, true), /* @__PURE__ */ $.structField("IP", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")), [1], 8, true), /* @__PURE__ */ $.structField("SP", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("string")), [2], 16, true), /* @__PURE__ */ $.structField("PS", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.Inner")), [3], 24, true), /* @__PURE__ */ $.structField("PM", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.pointerType("main.Inner")), [4], 48, true), /* @__PURE__ */ $.structField("In", "main.Inner", [5], 56, true), /* @__PURE__ */ $.structField("Ptrs", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))), [6], 80, true)]
	)
}

export async function main(): globalThis.Promise<void> {
	// reflect.New of a struct versus &T{}.
	let n = $.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(reflect.TypeOf($.structInterfaceValue(new Inner(true), "main.Inner", "main.Inner")))!)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(n)).Elem())).Field(0))).SetString("a")
	await $.println("new struct:", reflect.DeepEqual($.markAsStructValue($.cloneStructValue(n)).Interface(), $.interfaceValue(new Inner(false, "a"), "*main.Inner", /* @__PURE__ */ $.pointerType("main.Inner"))))

	// reflect.New of a struct versus the address of a variable.
	let v = $.varRef(mk("a"))
	await $.println("new struct var:", reflect.DeepEqual($.markAsStructValue($.cloneStructValue(n)).Interface(), $.interfaceValue(v, "*main.Inner", /* @__PURE__ */ $.pointerType("main.Inner"))), reflect.DeepEqual($.interfaceValue(v, "*main.Inner", /* @__PURE__ */ $.pointerType("main.Inner")), $.markAsStructValue($.cloneStructValue(n)).Interface()))
	let _set = $.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(reflect.TypeOf($.structInterfaceValue(new Inner(true), "main.Inner", "main.Inner")))!)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(_set)).Elem())).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.structInterfaceValue((v.value).clone(), "main.Inner", "main.Inner")))))
	await $.println("set struct var:", reflect.DeepEqual($.markAsStructValue($.cloneStructValue(_set)).Interface(), $.interfaceValue(v, "*main.Inner", /* @__PURE__ */ $.pointerType("main.Inner"))))
	await $.println("var ptr elems:", reflect.DeepEqual($.interfaceValue($.arrayToSlice<Inner | $.VarRef<Inner> | null>([v]), "[]*main.Inner", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.Inner"))), $.interfaceValue($.arrayToSlice<Inner | $.VarRef<Inner> | null>([$.mustTypeAssert<Inner | $.VarRef<Inner> | null>($.markAsStructValue($.cloneStructValue(n)).Interface(), /* @__PURE__ */ $.pointerType("main.Inner"))]), "[]*main.Inner", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.Inner")))), reflect.DeepEqual($.interfaceValue($.makeMap<number, Inner | $.VarRef<Inner> | null>([[1, $.mustTypeAssert<Inner | $.VarRef<Inner> | null>($.markAsStructValue($.cloneStructValue(_set)).Interface(), /* @__PURE__ */ $.pointerType("main.Inner"))]]), "map[int]*main.Inner", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.pointerType("main.Inner"))), $.interfaceValue($.makeMap<number, Inner | $.VarRef<Inner> | null>([[1, v]]), "map[int]*main.Inner", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.pointerType("main.Inner")))))

	// reflect.New of an int versus a pointer to an int variable.
	let ni = $.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(reflect.TypeOf($.basicInterfaceValue(0, "int")))!)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ni)).Elem())).SetInt(3n)
	let three = $.varRef(3)
	await $.println("new int:", reflect.DeepEqual($.markAsStructValue($.cloneStructValue(ni)).Interface(), $.interfaceValue(three, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))))

	// Set pointer fields through reflect.
	let o: $.VarRef<Outer> = $.varRef(new Outer(true))
	let ov = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(o, "*main.Outer", /* @__PURE__ */ $.pointerType("main.Outer"))))).Elem()))
	let p = $.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(reflect.TypeOf($.structInterfaceValue(new Inner(true), "main.Inner", "main.Inner")))!)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Elem())).Field(0))).SetString("b")
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ov)).Field(0))).Set(p)
	let ip = $.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(reflect.TypeOf($.basicInterfaceValue(0, "int")))!)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Elem())).SetInt(5n)
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ov)).Field(1))).Set(ip)
	let sp = $.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(reflect.TypeOf(""))!)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(sp)).Elem())).SetString("s")
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ov)).Field(2))).Set(sp)
	let five = $.varRef(5)
	let s = $.varRef("s")
	let want = $.varRef(new Outer(true, new Inner(false, "b"), five, s))
	await $.println("fields:", reflect.DeepEqual($.structInterfaceValue((o.value).clone(), "main.Outer", "main.Outer"), $.structInterfaceValue((want.value).clone(), "main.Outer", "main.Outer")), reflect.DeepEqual($.interfaceValue(o, "*main.Outer", /* @__PURE__ */ $.pointerType("main.Outer")), $.interfaceValue(want, "*main.Outer", /* @__PURE__ */ $.pointerType("main.Outer"))))

	// Addr of a struct field, of a slice element.
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ov)).Field(5))).Field(0))).SetString("in")
	await $.println("addr field:", reflect.DeepEqual($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ov)).Field(5))).Addr())).Interface(), $.interfaceValue(new Inner(false, "in"), "*main.Inner", /* @__PURE__ */ $.pointerType("main.Inner"))))

	// Slices and maps of pointers made by reflect.
	let sl = $.markAsStructValue($.cloneStructValue(reflect.MakeSlice($.pointerValueOrNil(reflect.TypeOf($.interfaceValue($.arrayToSlice<Inner | $.VarRef<Inner> | null>([]), "[]*main.Inner", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.Inner")))))!, 1, 1)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(sl)).Index(0))).Set($.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(reflect.TypeOf($.structInterfaceValue(new Inner(true), "main.Inner", "main.Inner")))!))))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(sl)).Index(0))).Elem())).Field(1))).SetInt(7n)
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ov)).Field(3))).Set(sl)
	await $.println("slice:", reflect.DeepEqual($.interfaceValue(o.value.PS, "[]*main.Inner", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.Inner"))), $.interfaceValue($.arrayToSlice<Inner | $.VarRef<Inner> | null>([new Inner(false, undefined, 7)]), "[]*main.Inner", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.Inner")))))
	let mp = $.markAsStructValue($.cloneStructValue(reflect.MakeMap($.pointerValueOrNil(reflect.TypeOf($.interfaceValue($.makeMap<string, Inner | $.VarRef<Inner> | null>([]), "map[string]*main.Inner", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.pointerType("main.Inner")))))!)))
	$.markAsStructValue($.cloneStructValue(mp)).SetMapIndex($.markAsStructValue($.cloneStructValue(reflect.ValueOf("k"))), $.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(reflect.TypeOf($.structInterfaceValue(new Inner(true), "main.Inner", "main.Inner")))!))))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ov)).Field(4))).Set(mp)
	await $.println("map:", reflect.DeepEqual($.interfaceValue(o.value.PM, "map[string]*main.Inner", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.pointerType("main.Inner"))), $.interfaceValue($.makeMap<string, Inner | $.VarRef<Inner> | null>([["k", new Inner()]]), "map[string]*main.Inner", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.pointerType("main.Inner")))))
	let ips = $.markAsStructValue($.cloneStructValue(reflect.MakeSlice($.pointerValueOrNil(reflect.TypeOf($.interfaceValue($.arrayToSlice<$.VarRef<number> | null>([]), "[]*int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))))))!, 1, 1)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ips)).Index(0))).Set($.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil(reflect.TypeOf($.basicInterfaceValue(0, "int")))!))))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ov)).Field(6))).Set(ips)
	let zero = $.varRef(0)
	await $.println("int ptrs:", reflect.DeepEqual($.interfaceValue(o.value.Ptrs, "[]*int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))), $.interfaceValue($.arrayToSlice<$.VarRef<number> | null>([zero]), "[]*int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))))))

	// Unequal pointees are still unequal.
	await $.println("differ:", reflect.DeepEqual($.markAsStructValue($.cloneStructValue(n)).Interface(), $.interfaceValue(new Inner(false, "z"), "*main.Inner", /* @__PURE__ */ $.pointerType("main.Inner"))), reflect.DeepEqual($.markAsStructValue($.cloneStructValue(ni)).Interface(), $.interfaceValue(five, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))))
	await $.println("pointer vs value:", reflect.DeepEqual($.interfaceValue(v, "*main.Inner", /* @__PURE__ */ $.pointerType("main.Inner")), $.structInterfaceValue((v.value).clone(), "main.Inner", "main.Inner")), reflect.DeepEqual($.structInterfaceValue((v.value).clone(), "main.Inner", "main.Inner"), $.interfaceValue(v, "*main.Inner", /* @__PURE__ */ $.pointerType("main.Inner"))), reflect.DeepEqual($.markAsStructValue($.cloneStructValue(n)).Interface(), $.structInterfaceValue((v.value).clone(), "main.Inner", "main.Inner")), reflect.DeepEqual($.structInterfaceValue((v.value).clone(), "main.Inner", "main.Inner"), $.markAsStructValue($.cloneStructValue(n)).Interface()))
	class Holder {
		public declare A: any

		public declare B: any

		constructor(init?: Partial<{A?: any, B?: any}>, __goscriptValue?: boolean) {
			this.A = init?.A ?? (null! as any)
			this.B = init?.B ?? (null! as any)
			;(this as any)[$.structValueMarker] = __goscriptValue === true
		}

		public clone(): Holder {
			return new Holder(this, true)
		}

		public __goscriptAssign(source: Holder): this {
			this.A = $.assignFieldValue(this.A, source.A)
			this.B = $.assignFieldValue(this.B, source.B)
			return this
		}

		static __typeInfo = $.registerStructType(
			"main.Holder",
			() => new Holder(),
			() => [],
			Holder,
			() => [/* @__PURE__ */ $.structField("A", { kind: $.TypeKind.Interface, methods: [] }, [0], 0, true), /* @__PURE__ */ $.structField("B", { kind: $.TypeKind.Interface, methods: [] }, [1], 16, true)]
		)
	}
	await $.println("in interfaces:", reflect.DeepEqual($.structInterfaceValue($.markAsStructValue(new Holder({A: $.interfaceValue(v, "*main.Inner", /* @__PURE__ */ $.pointerType("main.Inner")), B: $.structInterfaceValue((v.value).clone(), "main.Inner", "main.Inner")})), "main.Holder", "main.Holder"), $.structInterfaceValue((() => { const __goscriptLiteralField0 = $.markAsStructValue($.cloneStructValue(n)).Interface(); return $.markAsStructValue(new Holder({A: __goscriptLiteralField0, B: $.structInterfaceValue((v.value).clone(), "main.Inner", "main.Inner")})) })(), "main.Holder", "main.Holder")), reflect.DeepEqual($.structInterfaceValue($.markAsStructValue(new Holder({A: $.interfaceValue(v, "*main.Inner", /* @__PURE__ */ $.pointerType("main.Inner")), B: $.structInterfaceValue((v.value).clone(), "main.Inner", "main.Inner")})), "main.Holder", "main.Holder"), $.structInterfaceValue($.markAsStructValue(new Holder({A: $.structInterfaceValue((v.value).clone(), "main.Inner", "main.Inner"), B: $.interfaceValue(v, "*main.Inner", /* @__PURE__ */ $.pointerType("main.Inner"))})), "main.Holder", "main.Holder")))
	// Values of the same type made by reflect and by the program are equal.
	let m = $.markAsStructValue($.cloneStructValue(reflect.MakeMap($.pointerValueOrNil(reflect.TypeOf($.interfaceValue($.makeMap<string, any>([]), "map[string]interface{}", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] }))))!)))
	$.markAsStructValue($.cloneStructValue(m)).SetMapIndex($.markAsStructValue($.cloneStructValue(reflect.ValueOf("A"))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(1, "int")))))
	await $.println("reflect map:", reflect.DeepEqual($.interfaceValue($.arrayToSlice<any>([$.interfaceValue($.makeMap<string, any>([["A", $.basicInterfaceValue(1, "int")]]), "map[string]interface{}", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] }))]), "[]interface{}", /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] })), $.interfaceValue($.arrayToSlice<any>([$.markAsStructValue($.cloneStructValue(m)).Interface()]), "[]interface{}", /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }))))
	let nilp: $.VarRef<number> | null = null! as $.VarRef<number> | null
	await $.println("nil:", reflect.DeepEqual($.interfaceValue(nilp, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int"))), $.markAsStructValue($.cloneStructValue(ni)).Interface()))
}

export function mk(name: string): Inner {
	return new Inner(true, name)
}

if ($.isMainScript(import.meta)) {
	await main()
}

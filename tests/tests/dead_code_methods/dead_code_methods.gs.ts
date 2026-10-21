// Generated file based on dead_code_methods.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as errors from "@goscript/errors/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as reflect from "@goscript/reflect/index.js"
import * as sort from "@goscript/sort/index.js"

export type Speaker = {
	Speak(): string
}

$.registerInterfaceType(
	"main.Speaker",
	null,
	[$.methodSignature("Speak", [], [/* @__PURE__ */ $.basicType("string")])]
);

export type checker = {
	Check(): void
}

$.registerInterfaceType(
	"main.checker",
	null,
	[$.methodSignature("Check")]
);

export type Labeler = {
	Label(): string
}

$.registerInterfaceType(
	"main.Labeler",
	null,
	[$.methodSignature("Label", [], [/* @__PURE__ */ $.basicType("string")])]
);

export type Celsius = number

$.registerNamedValueType(
	"main.Celsius",
	{Kelvin: (receiver: any) => (Celsius_Kelvin as any)(($.isVarRef(receiver) ? receiver.value : receiver)), String: (receiver: any) => (Celsius_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))},
	[$.methodSignature("Kelvin", [], [/* @__PURE__ */ $.basicType("float64")]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Unused", [], [/* @__PURE__ */ $.basicType("int")])]
);

$.registerNamedValueType(
	"*main.Celsius",
	{Kelvin: (receiver: any) => (Celsius_Kelvin as any)($.pointerValue(receiver)), String: (receiver: any) => (Celsius_String as any)($.pointerValue(receiver))},
	[$.methodSignature("Kelvin", [], [/* @__PURE__ */ $.basicType("float64")]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Unused", [], [/* @__PURE__ */ $.basicType("int")])]
);

export type Named = {
	Name(): string
}

$.registerInterfaceType(
	"main.Named",
	null,
	[$.methodSignature("Name", [], [/* @__PURE__ */ $.basicType("string")])]
);

export type byLen = $.Slice<string>

$.registerNamedType("main.byLen", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string")));

$.registerNamedValueType(
	"main.byLen",
	{Len: (receiver: any) => (byLen_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver)), Less: (receiver: any, ...args: any[]) => (byLen_Less as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Swap: (receiver: any, ...args: any[]) => (byLen_Swap as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))},
	[$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Less", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Swap", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]])]
);

$.registerNamedValueType(
	"*main.byLen",
	{Len: (receiver: any) => (byLen_Len as any)($.pointerValue(receiver)), Less: (receiver: any, ...args: any[]) => (byLen_Less as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args)), Swap: (receiver: any, ...args: any[]) => (byLen_Swap as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args))},
	[$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Less", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Swap", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]])]
);

export class Dog {
	public declare name: string

	constructor(__goscriptValue?: boolean, name$?: string) {
		this.name = name$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Dog {
		return new Dog(true, this.name)
	}

	public __goscriptAssign(source: Dog): this {
		this.name = source.name
		return this
	}

	public Check(): void {
		const d: Dog | $.VarRef<Dog> | null = this;
	}

	public Ping(): string {
		const d: Dog | $.VarRef<Dog> | null = this;
		return "pong"
	}

	public Speak(): string {
		const d: Dog | $.VarRef<Dog> | null = this;
		return $.pointerValue<Dog>(d).name + " says woof"
	}

	static __typeInfo = $.registerStructType(
		"main.Dog",
		() => new Dog(),
		() => [$.methodSignature("Check", [], [], true), $.methodSignature("Ping", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Speak", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Unreachable", [], [/* @__PURE__ */ $.basicType("string")], true)],
		Dog,
		() => [/* @__PURE__ */ $.structField("name", /* @__PURE__ */ $.basicType("string"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/dead_code_methods" })]
	)
}

export class Counter {
	public declare n: number

	constructor(__goscriptValue?: boolean, n$?: number) {
		this.n = n$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Counter {
		return new Counter(true, this.n)
	}

	public __goscriptAssign(source: Counter): this {
		this.n = source.n
		return this
	}

	public Dec(): void {
		const c: Counter | $.VarRef<Counter> | null = this;
		const c$: Counter = c == null ? $.pointerTarget<Counter>(c) : (c as any).__isVarRef === true ? (c as any).value : (c as any).__goValue === undefined ? (c as any) : $.pointerTarget<Counter>(c);
		;(c$ as Counter).n--
	}

	public Inc(): void {
		const c: Counter | $.VarRef<Counter> | null = this;
		const c$: Counter = c == null ? $.pointerTarget<Counter>(c) : (c as any).__isVarRef === true ? (c as any).value : (c as any).__goValue === undefined ? (c as any) : $.pointerTarget<Counter>(c);
		;(c$ as Counter).n++
	}

	public Value(): number {
		const c: Counter | $.VarRef<Counter> | null = this;
		return $.pointerValue<Counter>(c).n
	}

	static __typeInfo = $.registerStructType(
		"main.Counter",
		() => new Counter(),
		() => [$.methodSignature("Dec", [], [], true), $.methodSignature("Inc", [], [], true), $.methodSignature("Value", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("unused", [], [], true)],
		Counter,
		() => [/* @__PURE__ */ $.structField("n", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/dead_code_methods" })]
	)
}

export class Inner {
	public declare label: string

	constructor(__goscriptValue?: boolean, label$?: string) {
		this.label = label$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Inner {
		return new Inner(true, this.label)
	}

	public __goscriptAssign(source: Inner): this {
		this.label = source.label
		return this
	}

	public Label(): string {
		const i = this;
		return "label:" + i.label
	}

	public SetLabel(s: string): void {
		const i: Inner | $.VarRef<Inner> | null = this;
		$.pointerValue<Inner>(i).label = s
	}

	static __typeInfo = $.registerStructType(
		"main.Inner",
		() => new Inner(),
		() => [$.methodSignature("Hidden", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Label", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("SetLabel", [["s", /* @__PURE__ */ $.basicType("string")]], [], true)],
		Inner,
		() => [/* @__PURE__ */ $.structField("label", /* @__PURE__ */ $.basicType("string"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/dead_code_methods" })]
	)
}

export class Outer {
	public declare Inner: Inner | $.VarRef<Inner> | null

	public declare Speaker: Speaker | null

	constructor(__goscriptValue?: boolean, Inner$?: Inner | $.VarRef<Inner> | null, Speaker$?: Speaker | null) {
		this.Inner = Inner$ ?? (null! as Inner | $.VarRef<Inner> | null)
		this.Speaker = Speaker$ ?? (null! as Speaker | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Outer {
		return new Outer(true, this.Inner, this.Speaker)
	}

	public __goscriptAssign(source: Outer): this {
		this.Inner = source.Inner
		this.Speaker = $.assignFieldValue(this.Speaker, source.Speaker)
		return this
	}

	public Label(): any {
		return $.pointerValue<Inner>(this.Inner).Label()
	}

	public SetLabel(s: any): any {
		return $.pointerValue<Inner>(this.Inner).SetLabel(s)
	}

	public Speak(): any {
		return $.pointerValue<Exclude<Speaker | null, null>>(this.Speaker).Speak()
	}

	static __typeInfo = $.registerStructType(
		"main.Outer",
		() => new Outer(),
		() => [$.methodSignature("Hidden", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Label", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("SetLabel", [["s", /* @__PURE__ */ $.basicType("string")]]), $.methodSignature("Speak", [], [/* @__PURE__ */ $.basicType("string")])],
		Outer,
		() => [/* @__PURE__ */ $.structField("Inner", /* @__PURE__ */ $.pointerType("main.Inner"), [0], 0, true, { anonymous: true }), /* @__PURE__ */ $.structField("Speaker", "main.Speaker", [1], 8, true, { anonymous: true })]
	)
}

export class Cat {
	constructor(__goscriptValue?: boolean) {
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Cat {
		return new Cat(true)
	}

	public __goscriptAssign(source: Cat): this {
		return this
	}

	public Name(): string {
		return "cat"
	}

	public Other(): string {
		return "other"
	}

	static __typeInfo = $.registerStructType(
		"main.Cat",
		() => new Cat(),
		() => [$.methodSignature("Name", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Other", [], [/* @__PURE__ */ $.basicType("string")])],
		Cat,
		() => []
	)
}

export class Box {
	public declare v: any

	constructor(__goscriptValue?: boolean, v$?: any) {
		this.v = v$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Box {
		return $.copyGenericInstance(this, new Box(true, $.copyElement(this.v)))
	}

	public __goscriptAssign(source: Box): this {
		this.v = $.assignFieldValue(this.v, source.v)
		return this
	}

	public Get(__typeArgs: $.GenericTypeArgs | undefined): any {
		const b: Box | $.VarRef<Box> | null = this;
		return $.copyElement($.pointerValue<Box>(b).v)
	}

	static __typeInfo = $.registerStructType(
		"main.Box",
		() => new Box(),
		() => [$.methodSignature("Drop", [], [{ kind: $.TypeKind.Interface, methods: [] }], true), $.methodSignature("Get", [], [{ kind: $.TypeKind.Interface, methods: [] }], true)],
		Box,
		() => [/* @__PURE__ */ $.structField("v", { kind: $.TypeKind.Interface, methods: [] }, [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/dead_code_methods" })]
	)
}

export class myErr {
	public declare code: number

	constructor(__goscriptValue?: boolean, code$?: number) {
		this.code = code$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): myErr {
		return new myErr(true, this.code)
	}

	public __goscriptAssign(source: myErr): this {
		this.code = source.code
		return this
	}

	public Error(): string {
		const e: myErr | $.VarRef<myErr> | null = this;
		return (fmt.Sprintf("error %d", $.basicInterfaceValue($.pointerValue<myErr>(e).code, "int")) as string)
	}

	static __typeInfo = $.registerStructType(
		"main.myErr",
		() => new myErr(),
		() => [$.methodSignature("Error", [], [/* @__PURE__ */ $.basicType("string")], true)],
		myErr,
		() => [/* @__PURE__ */ $.structField("code", /* @__PURE__ */ $.basicType("int"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/dead_code_methods" })]
	)
}

export function Celsius_String(c: Celsius): string {
	return (fmt.Sprintf("%.1fC", $.basicInterfaceValue(c, "float64")) as string)
}

export function Celsius_Kelvin(c: Celsius): number {
	return c + 273.15
}

export function names<T>(__typeArgs: $.GenericTypeArgs | undefined, items: $.Slice<T>): $.Slice<string> {
	let out: $.Slice<string> = null! as $.Slice<string>
	for (let __goscriptRangeTarget0 = items, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let it = $.copyElement((__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as any))
		out = $.appendOne(out, $.callGenericMethod(__typeArgs, "T", "Name", it))
	}
	return out
}

export function byLen_Len(s: byLen): number {
	return $.sliceLen((s as byLen))
}

export function byLen_Less(s: byLen, i: number, j: number): boolean {
	return $.stringLen($.arrayIndex(s!, i)) < $.stringLen($.arrayIndex(s!, j))
}

export function byLen_Swap(s: byLen, i: number, j: number): void {
	let __goscriptAssign0_0: string = $.arrayIndex(s!, j)
	let __goscriptAssign0_1: string = $.arrayIndex(s!, i)
	$.sliceElems(s!)[$.sliceSlot(s!, i)] = __goscriptAssign0_0
	$.sliceElems(s!)[$.sliceSlot(s!, j)] = __goscriptAssign0_1
}

export async function main(): globalThis.Promise<void> {
	let d = new Dog(false, "rex")
	let s: Speaker | null = $.interfaceValue<Speaker | null>(d, "*main.Dog", /* @__PURE__ */ $.pointerType("main.Dog"))
	fmt.Println((__goscriptAwait = (s !== null && (s as any).__isVarRef !== true && ((s as any).__goValue === undefined || (s as any).__goType?.charCodeAt(0) !== 42) ? (s as Exclude<Speaker, null>) : $.pointerValue<Exclude<Speaker, null>>(s)).Speak(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	let v: any = $.interfaceValue(d, "*main.Dog", /* @__PURE__ */ $.pointerType("main.Dog"))
	let [, ok] = $.typeAssertTuple<checker | null>(v, "main.checker")
	fmt.Println("checker:", ok)

	fmt.Println($.structInterfaceValue($.markAsStructValue($.cloneStructValue($.arrayIndex((await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(d, "*main.Dog", /* @__PURE__ */ $.pointerType("main.Dog"))))).MethodByName("Ping"))).Call(null))!, 0))), "reflect.Value", __goscriptStatic0()))

	let c = new Counter()
	let inc: (() => void) | null = $.functionValue(((__receiver) => () => __receiver.Inc())($.pointerValue<Counter>(c)), ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo), "main.(*Counter).Inc-fm")
	inc!()
	inc!()
	$.functionValue((c: Counter | $.VarRef<Counter> | null): void => $.pointerValue<Counter>(c).Dec(), ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.pointerType("main.Counter")], results: [] } as $.FunctionTypeInfo))(c)
	fmt.Println("counter:", $.basicInterfaceValue((c !== null && (c as any).__isVarRef !== true && (c as any).__goValue === undefined ? ((c as any) as Counter).Value() : Counter.prototype.Value.call(c)), "int"))

	let o = $.varRef(new Outer(true, new Inner(), $.interfaceValue<Speaker | null>(new Dog(false, "max"), "*main.Dog", /* @__PURE__ */ $.pointerType("main.Dog"))))
	$.pointerValue<Inner>(o.value.Inner).SetLabel("x")
	let l: Labeler | null = $.structInterfaceValue<Labeler | null>((o.value).clone(), "main.Outer", "main.Outer")
	fmt.Println((__goscriptAwait = (l !== null && (l as any).__isVarRef !== true && ((l as any).__goValue === undefined || (l as any).__goType?.charCodeAt(0) !== 42) ? (l as Exclude<Labeler, null>) : $.pointerValue<Exclude<Labeler, null>>(l)).Label(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), $.pointerValue<Exclude<Speaker, null>>(o.value.Speaker).Speak())

	let t = 21.5
	fmt.Println($.namedValueInterfaceValue<any>(t, "main.Celsius", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3()), $.basicInterfaceValue(Celsius_Kelvin(t), "float64"))

	fmt.Println($.interfaceValue(names(__goscriptStatic4(), $.arrayToSlice<Cat>([new Cat(true), new Cat(true)])), "[]string", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"))))

	let b = $.genericInstance(new Box(false, 7), __goscriptStatic6)
	fmt.Println($.basicInterfaceValue((b !== null && (b as any).__isVarRef !== true && (b as any).__goValue === undefined ? ((b as any) as Box).Get(__goscriptStatic5()) : Box.prototype.Get.call(b, __goscriptStatic5())), "int"))

	let words = ($.arrayToSlice<string>(["ccc", "a", "bb"]) as byLen)
	sort.Sort($.pointerValueOrNil($.namedValueInterfaceValue<sort.Interface | null>(words, "main.byLen", __goscriptStatic7(), __goscriptStatic8(), __goscriptStatic9()))!)
	fmt.Println($.namedValueInterfaceValue<any>(words, "main.byLen", __goscriptStatic7(), __goscriptStatic8(), __goscriptStatic9()))

	let err: $.GoError = $.interfaceValue<$.GoError>(new myErr(false, 3), "*main.myErr", /* @__PURE__ */ $.pointerType("main.myErr"))
	fmt.Println((err as any))
	let target: $.VarRef<myErr | $.VarRef<myErr> | null> = $.varRef(null! as myErr | $.VarRef<myErr> | null)
	fmt.Println(errors.As($.pointerValueOrNil(err)!, $.interfaceValue(target, "**main.myErr", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.pointerType("main.myErr")))), $.basicInterfaceValue($.pointerValue<myErr>(target.value).code, "int"))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods("reflect.Value", "reflect.Value", () => [$.methodSignature("Addr", [], ["reflect.Value"]), $.methodSignature("Bool", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Bytes", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("Call", [["in", /* @__PURE__ */ $.sliceType("reflect.Value")]], [/* @__PURE__ */ $.sliceType("reflect.Value")]), $.methodSignature("CallSlice", [["in", /* @__PURE__ */ $.sliceType("reflect.Value")]], [/* @__PURE__ */ $.sliceType("reflect.Value")]), $.methodSignature("CanAddr", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanComplex", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanConvert", [["t", "reflect.Type"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanFloat", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanInt", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanInterface", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanSet", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("CanUint", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Cap", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Clear"), $.methodSignature("Close"), $.methodSignature("Comparable", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Complex", [], [/* @__PURE__ */ $.basicType("complex128")]), $.methodSignature("Convert", [["t", "reflect.Type"]], ["reflect.Value"]), $.methodSignature("Elem", [], ["reflect.Value"]), $.methodSignature("Equal", [["u", "reflect.Value"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Field", [["i", /* @__PURE__ */ $.basicType("int")]], ["reflect.Value"]), $.methodSignature("FieldByIndex", [["index", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))]], ["reflect.Value"]), $.methodSignature("FieldByIndexErr", [["index", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))]], ["reflect.Value", "error"]), $.methodSignature("FieldByName", [["name", /* @__PURE__ */ $.basicType("string")]], ["reflect.Value"]), $.methodSignature("FieldByNameFunc", [["match", ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("string")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)]], ["reflect.Value"]), $.methodSignature("Fields", [], [({ kind: $.TypeKind.Function, name: "iter.Seq2", params: [({ kind: $.TypeKind.Function, params: ["reflect.StructField", "reflect.Value"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)]), $.methodSignature("Float", [], [/* @__PURE__ */ $.basicType("float64")]), $.methodSignature("Grow", [["n", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("Index", [["i", /* @__PURE__ */ $.basicType("int")]], ["reflect.Value"]), $.methodSignature("Int", [], [/* @__PURE__ */ $.basicType("int64")]), $.methodSignature("Interface", [], [["i", { kind: $.TypeKind.Interface, methods: [] }]]), $.methodSignature("InterfaceData", [], [/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uintptr"), 2)]), $.methodSignature("IsNil", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("IsValid", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("IsZero", [], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("uint", "reflect.Kind")]), $.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("MapIndex", [["key", "reflect.Value"]], ["reflect.Value"]), $.methodSignature("MapKeys", [], [/* @__PURE__ */ $.sliceType("reflect.Value")]), $.methodSignature("MapRange", [], [/* @__PURE__ */ $.pointerType("reflect.MapIter")]), $.methodSignature("Method", [["i", /* @__PURE__ */ $.basicType("int")]], ["reflect.Value"]), $.methodSignature("MethodByName", [["name", /* @__PURE__ */ $.basicType("string")]], ["reflect.Value"]), $.methodSignature("Methods", [], [({ kind: $.TypeKind.Function, name: "iter.Seq2", params: [({ kind: $.TypeKind.Function, params: ["reflect.Method", "reflect.Value"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)]), $.methodSignature("NumField", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("NumMethod", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("OverflowComplex", [["x", /* @__PURE__ */ $.basicType("complex128")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("OverflowFloat", [["x", /* @__PURE__ */ $.basicType("float64")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("OverflowInt", [["x", /* @__PURE__ */ $.basicType("int64")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("OverflowUint", [["x", /* @__PURE__ */ $.basicType("uint64")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Pointer", [], [/* @__PURE__ */ $.basicType("uintptr")]), $.methodSignature("Recv", [], [["x", "reflect.Value"], ["ok", /* @__PURE__ */ $.basicType("bool")]]), $.methodSignature("Send", [["x", "reflect.Value"]]), $.methodSignature("Seq", [], [({ kind: $.TypeKind.Function, name: "iter.Seq", params: [({ kind: $.TypeKind.Function, params: ["reflect.Value"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)]), $.methodSignature("Seq2", [], [({ kind: $.TypeKind.Function, name: "iter.Seq2", params: [({ kind: $.TypeKind.Function, params: ["reflect.Value", "reflect.Value"], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)], results: [] } as $.FunctionTypeInfo)]), $.methodSignature("Set", [["x", "reflect.Value"]]), $.methodSignature("SetBool", [["x", /* @__PURE__ */ $.basicType("bool")]]), $.methodSignature("SetBytes", [["x", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]]), $.methodSignature("SetCap", [["n", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("SetComplex", [["x", /* @__PURE__ */ $.basicType("complex128")]]), $.methodSignature("SetFloat", [["x", /* @__PURE__ */ $.basicType("float64")]]), $.methodSignature("SetInt", [["x", /* @__PURE__ */ $.basicType("int64")]]), $.methodSignature("SetIterKey", [["iter", /* @__PURE__ */ $.pointerType("reflect.MapIter")]]), $.methodSignature("SetIterValue", [["iter", /* @__PURE__ */ $.pointerType("reflect.MapIter")]]), $.methodSignature("SetLen", [["n", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("SetMapIndex", [["key", "reflect.Value"], ["elem", "reflect.Value"]]), $.methodSignature("SetPointer", [["x", /* @__PURE__ */ $.basicType("unknown")]]), $.methodSignature("SetString", [["x", /* @__PURE__ */ $.basicType("string")]]), $.methodSignature("SetUint", [["x", /* @__PURE__ */ $.basicType("uint64")]]), $.methodSignature("SetZero"), $.methodSignature("Slice", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]], ["reflect.Value"]), $.methodSignature("Slice3", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")], ["k", /* @__PURE__ */ $.basicType("int")]], ["reflect.Value"]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("TryRecv", [], [["x", "reflect.Value"], ["ok", /* @__PURE__ */ $.basicType("bool")]]), $.methodSignature("TrySend", [["x", "reflect.Value"]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Type", [], ["reflect.Type"]), $.methodSignature("Uint", [], [/* @__PURE__ */ $.basicType("uint64")]), $.methodSignature("UnsafeAddr", [], [/* @__PURE__ */ $.basicType("uintptr")]), $.methodSignature("UnsafePointer", [], [/* @__PURE__ */ $.basicType("unknown")])]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({Kelvin: (receiver: any) => (Celsius_Kelvin as any)(($.isVarRef(receiver) ? receiver.value : receiver)), String: (receiver: any) => (Celsius_String as any)(($.isVarRef(receiver) ? receiver.value : receiver))})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (/* @__PURE__ */ $.basicType("float64", "main.Celsius"))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([$.methodSignature("Kelvin", [], [/* @__PURE__ */ $.basicType("float64")]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Unused", [], [/* @__PURE__ */ $.basicType("int")])])
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.Cat", zero: () => new Cat(true), methods: {Name: (receiver: any) => $.pointerValue(receiver).Name(), Other: (receiver: any) => $.pointerValue(receiver).Other()} }})
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ([{Get: (receiver: any) => $.pointerValue(receiver).Get(__goscriptStatic5())}, [$.methodSignature("Drop", [], [/* @__PURE__ */ $.basicType("int")], true, false), $.methodSignature("Get", [], [/* @__PURE__ */ $.basicType("int")], true, false)]])
}

var __goscriptStatic7$value: any
function __goscriptStatic7(): any {
	return __goscriptStatic7$value ??= ({Len: (receiver: any) => (byLen_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver)), Less: (receiver: any, ...args: any[]) => (byLen_Less as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Swap: (receiver: any, ...args: any[]) => (byLen_Swap as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))})
}

var __goscriptStatic8$value: any
function __goscriptStatic8(): any {
	return __goscriptStatic8$value ??= (/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"), "main.byLen"))
}

var __goscriptStatic9$value: any
function __goscriptStatic9(): any {
	return __goscriptStatic9$value ??= ([$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")]), $.methodSignature("Less", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("bool")]), $.methodSignature("Swap", [["i", /* @__PURE__ */ $.basicType("int")], ["j", /* @__PURE__ */ $.basicType("int")]])])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

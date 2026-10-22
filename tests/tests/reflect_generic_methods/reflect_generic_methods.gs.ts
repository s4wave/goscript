// Generated file based on reflect_generic_methods.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export type kinder = {
	Kind(): string
}

$.registerInterfaceType(
	"main.kinder",
	null,
	[$.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("string")])]
);

export type stringer = {
	String(): string
}

$.registerInterfaceType(
	"main.stringer",
	null,
	[$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")])]
);

export class Base {
	public declare Vals: $.Slice<any>

	constructor(__goscriptValue?: boolean, Vals$?: $.Slice<any>) {
		this.Vals = Vals$ ?? (null! as $.Slice<any>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Base {
		return $.copyGenericInstance(this, new Base(true, this.Vals))
	}

	public __goscriptAssign(source: Base): this {
		this.Vals = source.Vals
		return this
	}

	public Fill(__typeArgs: $.GenericTypeArgs | undefined, v: any): void {
		const b: Base | $.VarRef<Base> | null = this;
		const b$: Base = b == null ? $.pointerTarget<Base>(b) : (b as any).__isVarRef === true ? (b as any).value : (b as any).__goValue === undefined ? (b as any) : $.pointerTarget<Base>(b)
		for (let __goscriptRangeTarget0 = (b$ as Base).Vals, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
			$.sliceElems((b$ as Base).Vals!)[$.sliceSlot((b$ as Base).Vals!, i)] = v
		}
	}

	public First(__typeArgs: $.GenericTypeArgs | undefined): any {
		const b: Base | $.VarRef<Base> | null = this;
		return $.arrayIndex($.pointerValue<Base>(b).Vals!, 0)
	}

	public Kind(__typeArgs: $.GenericTypeArgs | undefined): string {
		const b: Base | $.VarRef<Base> | null = this;
		return reflect.Kind_String(($.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})).Kind() as reflect.Kind))
	}

	public Set(__typeArgs: $.GenericTypeArgs | undefined, f: number, n: number): void {
		const b: Base | $.VarRef<Base> | null = this;
		const b$: Base = b == null ? $.pointerTarget<Base>(b) : (b as any).__isVarRef === true ? (b as any).value : (b as any).__goValue === undefined ? (b as any) : $.pointerTarget<Base>(b);
		;(b$ as Base).Vals = $.makeSlice<any>(n, undefined, $.genericSliceTypeHint(__typeArgs, "T"), () => ($.genericZero(__typeArgs, "T", null) as any))
		for (let __goscriptRangeTarget1 = (b$ as Base).Vals, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), i = 0; i < __goscriptRangeWindow1.length; i++) {
			$.sliceElems((b$ as Base).Vals!)[$.sliceSlot((b$ as Base).Vals!, i)] = $.genericConvert<any>(__typeArgs, "T", f)
		}
	}

	public Sum(__typeArgs: $.GenericTypeArgs | undefined): number {
		const b: Base | $.VarRef<Base> | null = this;
		let s = 0.0
		for (let __goscriptRangeTarget2 = $.pointerValue<Base>(b).Vals, __goscriptRangeWindow2 = $.sliceRange(__goscriptRangeTarget2), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow2.length; __rangeIndex++) {
			let v = (__goscriptRangeWindow2.backing[__goscriptRangeWindow2.offset + __rangeIndex] as any)
			s += v
		}
		return s
	}

	static __typeInfo = $.registerStructType(
		"main.Base",
		() => new Base(),
		() => [$.methodSignature("Fill", [["v", { kind: $.TypeKind.Interface, methods: [] }]], [], true), $.methodSignature("First", [], [{ kind: $.TypeKind.Interface, methods: [] }], true), $.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Set", [["f", /* @__PURE__ */ $.basicType("float64")], ["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("Sum", [], [/* @__PURE__ */ $.basicType("float64")], true)],
		Base,
		() => [/* @__PURE__ */ $.structField("Vals", /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }), [0], 0, true)]
	)
}

export class Number {
	public declare Base: Base | $.VarRef<Base> | null

	constructor(__goscriptValue?: boolean, Base$?: Base | $.VarRef<Base> | null) {
		this.Base = Base$ ?? (null! as Base | $.VarRef<Base> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Number {
		return $.copyGenericInstance(this, new Number(true, this.Base))
	}

	public __goscriptAssign(source: Number): this {
		this.Base = source.Base
		return this
	}

	public String(__typeArgs: $.GenericTypeArgs | undefined): string {
		const n: Number | $.VarRef<Number> | null = this;
		return "number " + $.pointerValue<Base>($.pointerValue<Number>(n).Base).Kind({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
	}

	public Fill(__typeArgs: $.GenericTypeArgs | undefined, v: any): any {
		return $.pointerValue<Base>(this.Base).Fill({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, v)
	}

	public First(__typeArgs: $.GenericTypeArgs | undefined): any {
		return $.pointerValue<Base>(this.Base).First({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
	}

	public Kind(__typeArgs: $.GenericTypeArgs | undefined): any {
		return $.pointerValue<Base>(this.Base).Kind({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
	}

	public Set(__typeArgs: $.GenericTypeArgs | undefined, f: any, n: any): any {
		return $.pointerValue<Base>(this.Base).Set({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, f, n)
	}

	public Sum(__typeArgs: $.GenericTypeArgs | undefined): any {
		return $.pointerValue<Base>(this.Base).Sum({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})
	}

	static __typeInfo = $.registerStructType(
		"main.Number",
		() => new Number(),
		() => [$.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Fill", [["v", { kind: $.TypeKind.Interface, methods: [] }]]), $.methodSignature("First", [], [{ kind: $.TypeKind.Interface, methods: [] }]), $.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Set", [["f", /* @__PURE__ */ $.basicType("float64")], ["n", /* @__PURE__ */ $.basicType("int")]]), $.methodSignature("Sum", [], [/* @__PURE__ */ $.basicType("float64")])],
		Number,
		() => [/* @__PURE__ */ $.structField("Base", /* @__PURE__ */ $.pointerType("main.Base"), [0], 0, true, { anonymous: true })]
	)
}

export class Pair {
	public declare A: any

	public declare B: any

	constructor(__goscriptValue?: boolean, A$?: any, B$?: any) {
		this.A = A$ ?? (null! as any)
		this.B = B$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Pair {
		return $.copyGenericInstance(this, new Pair(true, $.copyElement(this.A), $.copyElement(this.B)))
	}

	public __goscriptAssign(source: Pair): this {
		this.A = $.assignFieldValue(this.A, source.A)
		this.B = $.assignFieldValue(this.B, source.B)
		return this
	}

	public Kind(__typeArgs: $.GenericTypeArgs | undefined): string {
		const p = this;
		return reflect.Kind_String(($.pointerValue<Exclude<reflect.Type, null>>(reflect.TypeFor({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})).Kind() as reflect.Kind))
	}

	static __typeInfo = $.registerStructType(
		"main.Pair",
		() => new Pair(),
		() => [$.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("string")])],
		Pair,
		() => [/* @__PURE__ */ $.structField("A", { kind: $.TypeKind.Interface, methods: [] }, [0], 0, true), /* @__PURE__ */ $.structField("B", { kind: $.TypeKind.Interface, methods: [] }, [1], 0, true)]
	)
}

export function NewNumber(__typeArgs: $.GenericTypeArgs | undefined): Number | $.VarRef<Number> | null {
	return $.genericInstance(new Number(false, $.genericInstance(new Base(), () => [{Fill: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Fill({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ...$.stripGenericTypeArgs(args)), First: (receiver: any) => $.pointerValue(receiver).First({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}), Kind: (receiver: any) => $.pointerValue(receiver).Kind({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}), Set: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Set({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ...$.stripGenericTypeArgs(args)), Sum: (receiver: any) => $.pointerValue(receiver).Sum({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})}, [$.methodSignature("Fill", [__typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }], [], true, false), $.methodSignature("First", [], [__typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }], true, false), $.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("string")], true, false), $.methodSignature("Set", [/* @__PURE__ */ $.basicType("float64"), /* @__PURE__ */ $.basicType("int")], [], true, false), $.methodSignature("Sum", [], [/* @__PURE__ */ $.basicType("float64")], true, false)]])), () => [{Fill: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Fill({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ...$.stripGenericTypeArgs(args)), First: (receiver: any) => $.pointerValue(receiver).First({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}), Kind: (receiver: any) => $.pointerValue(receiver).Kind({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}), Set: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Set({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ...$.stripGenericTypeArgs(args)), String: (receiver: any) => $.pointerValue(receiver).String({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}), Sum: (receiver: any) => $.pointerValue(receiver).Sum({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})}, [$.methodSignature("Fill", [__typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }], [], false, false), $.methodSignature("First", [], [__typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }], false, false), $.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("string")], false, false), $.methodSignature("Set", [/* @__PURE__ */ $.basicType("float64"), /* @__PURE__ */ $.basicType("int")], [], false, false), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")], true, false), $.methodSignature("Sum", [], [/* @__PURE__ */ $.basicType("float64")], false, false)]])
}

export function NewFloat32(): Number | $.VarRef<Number> | null {
	return (NewNumber(__goscriptStatic0()) as Number | $.VarRef<Number> | null)
}

export async function describe(n: kinder | null): globalThis.Promise<string> {
	{
		let [s, ok] = $.typeAssertTuple<stringer | null>(n, "main.stringer")
		if (ok) {
			return (s !== null && (s as any).__isVarRef !== true && ((s as any).__goValue === undefined || (s as any).__goType?.charCodeAt(0) !== 42) ? (s as Exclude<stringer, null>) : $.pointerValue<Exclude<stringer, null>>(s)).String()
		}
	}
	return (n !== null && (n as any).__isVarRef !== true && ((n as any).__goValue === undefined || (n as any).__goType?.charCodeAt(0) !== 42) ? (n as Exclude<kinder, null>) : $.pointerValue<Exclude<kinder, null>>(n)).Kind()
}

export function typeName(v: any): string {
	{
		const __goscriptTypeSwitchValue = v
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic1())) {
			case 0:
				{
					return "int"
				}
				break
			case 1:
				{
					return "float32"
				}
				break
		}
	}
	return "other"
}

export async function main(): globalThis.Promise<void> {
	// Values returned by functions called through reflect, as interpreters
	// such as yaegi call them, have the methods of their instantiated types.
	for (let __goscriptRangeTarget3 = $.arrayToSlice<any>([$.interfaceValue($.goFunc(NewFloat32, "main.NewFloat32"), "func() *main.Number[float32]", ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Number", "main.Number[float32]", () => [/* @__PURE__ */ $.structField("Base", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Base", "main.Base[float32]", () => [/* @__PURE__ */ $.structField("Vals", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32")), [0], 0, true)])), [0], 0, true, { anonymous: true })]))] } as $.FunctionTypeInfo)), $.interfaceValue($.functionValue((): Number | $.VarRef<Number> | null => NewNumber(__goscriptStatic2()), ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.pointerType("main.Number")] } as $.FunctionTypeInfo)), "func() *main.Number[int]", ({ kind: $.TypeKind.Function, params: [], results: [/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Number", "main.Number[int]", () => [/* @__PURE__ */ $.structField("Base", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Base", "main.Base[int]", () => [/* @__PURE__ */ $.structField("Vals", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int")), [0], 0, true)])), [0], 0, true, { anonymous: true })]))] } as $.FunctionTypeInfo))]), __goscriptRangeWindow3 = $.sliceRange(__goscriptRangeTarget3), i = 0; i < __goscriptRangeWindow3.length; i++) {
		let f = (__goscriptRangeWindow3.backing[__goscriptRangeWindow3.offset + i] as any)
		let r = $.markAsStructValue($.cloneStructValue($.arrayIndex((await $.markAsStructValue($.cloneStructValue(reflect.ValueOf(f))).Call(null))!, 0)))
		await $.println($.markAsStructValue($.cloneStructValue($.arrayIndex((await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(r)).MethodByName("Kind"))).Call(null))!, 0))).String())
		await $.println((__goscriptAwait = $.pointerValue<Exclude<kinder, null>>($.mustTypeAssert<kinder | null>($.markAsStructValue($.cloneStructValue(r)).Interface(), "main.kinder")).Kind(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), (__goscriptAwait = $.pointerValue<Exclude<stringer, null>>($.mustTypeAssert<stringer | null>($.markAsStructValue($.cloneStructValue(r)).Interface(), "main.stringer")).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		await $.println($.markAsStructValue($.cloneStructValue($.arrayIndex((await $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.goFunc(describe, "main.describe"), "func(n main.kinder) string", ({ kind: $.TypeKind.Function, params: ["main.kinder"], results: [/* @__PURE__ */ $.basicType("string")] } as $.FunctionTypeInfo))))).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(r))])))!, 0))).String())
		await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(r)).MethodByName("Set"))).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(2.5, "float64")))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(2, "int"))))]))
		let vals = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(r)).Elem())).Field(0))).Elem())).Field(0)))
		await $.println($.markAsStructValue($.cloneStructValue(vals)).Len(), typeName($.markAsStructValue($.cloneStructValue($.arrayIndex((await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(r)).MethodByName("First"))).Call(null))!, 0))).Interface()))
		let fill = $.arrayIndex($.arrayToSlice<any>([$.basicInterfaceValue(1.5, "float32"), $.basicInterfaceValue(3, "int")])!, i)
		await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(r)).MethodByName("Fill"))).Call($.arrayToSlice<reflect.Value>([$.markAsStructValue($.cloneStructValue(reflect.ValueOf(fill)))]))
		await $.println($.markAsStructValue($.cloneStructValue($.arrayIndex((await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(r)).MethodByName("Sum"))).Call(null))!, 0))).Float())
	}

	// The same for a value made in generic code and taken from a field.
	class holder {
		public declare N: Number | $.VarRef<Number> | null

		constructor(init?: Partial<{N?: Number | $.VarRef<Number> | null}>, __goscriptValue?: boolean) {
			this.N = init?.N ?? (null! as Number | $.VarRef<Number> | null)
			;(this as any)[$.structValueMarker] = __goscriptValue === true
		}

		public clone(): holder {
			return new holder(this, true)
		}

		public __goscriptAssign(source: holder): this {
			this.N = source.N
			return this
		}

		static __typeInfo = $.registerStructType(
			"main.holder",
			() => new holder(),
			() => [],
			holder,
			() => [/* @__PURE__ */ $.structField("N", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Number", "main.Number[float32]", () => [/* @__PURE__ */ $.structField("Base", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Base", "main.Base[float32]", () => [/* @__PURE__ */ $.structField("Vals", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32")), [0], 0, true)])), [0], 0, true, { anonymous: true })])), [0], 0, true)]
		)
	}
	let h = (() => { const __goscriptLiteralField0 = NewNumber(__goscriptStatic0()); return $.markAsStructValue(new holder({N: __goscriptLiteralField0})) })()
	await $.println((__goscriptAwait = $.pointerValue<Exclude<kinder, null>>($.mustTypeAssert<kinder | null>($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.structInterfaceValue(h, "main.holder", "main.holder")))).Field(0))).Interface(), "main.kinder")).Kind(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	// A generic value type keeps its methods when copied.
	let p = $.genericInstance(new Pair(true, 1, 2), __goscriptStatic3)
	let q = $.varRef(p)
	let pv = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.namedValueInterfaceValue<any>((q.value).clone(), "main.Pair", __goscriptStatic4(), __goscriptStatic5(), __goscriptStatic6()))))
	await $.println($.markAsStructValue($.cloneStructValue($.arrayIndex((await $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(pv)).MethodByName("Kind"))).Call(null))!, 0))).String(), (__goscriptAwait = $.pointerValue<Exclude<kinder, null>>($.mustTypeAssert<kinder | null>($.markAsStructValue($.cloneStructValue(pv)).Interface(), "main.kinder")).Kind(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	await $.println((__goscriptAwait = $.pointerValue<Exclude<kinder, null>>($.mustTypeAssert<kinder | null>($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.namedValueInterfaceValue<any>(q, "*main.Pair", __goscriptStatic4(), __goscriptStatic7(), __goscriptStatic6())))).Elem())).Interface(), "main.kinder")).Kind(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("float32"), zero: () => 0 }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("float32")]))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([{Kind: (receiver: any) => $.pointerValue(receiver).Kind(__goscriptStatic0())}, [$.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("string")], false, false)]])
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ({Kind: (receiver: any) => $.pointerValue(receiver).Kind(__goscriptStatic0())})
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= (/* @__PURE__ */ $.genericStructType("main.Pair", "main.Pair[float32]", () => [/* @__PURE__ */ $.structField("A", /* @__PURE__ */ $.basicType("float32"), [0], 0, true), /* @__PURE__ */ $.structField("B", /* @__PURE__ */ $.basicType("float32"), [1], 4, true)]))
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ([$.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("string")])])
}

var __goscriptStatic7$value: any
function __goscriptStatic7(): any {
	return __goscriptStatic7$value ??= (/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.genericStructType("main.Pair", "main.Pair[float32]", () => [/* @__PURE__ */ $.structField("A", /* @__PURE__ */ $.basicType("float32"), [0], 0, true), /* @__PURE__ */ $.structField("B", /* @__PURE__ */ $.basicType("float32"), [1], 4, true)])))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

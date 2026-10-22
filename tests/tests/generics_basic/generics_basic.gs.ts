// Generated file based on generics_basic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Ordered = any

$.registerInterfaceType(
	"main.Ordered",
	null,
	[]
);

export type Score = number

export type Set = globalThis.Map<any, {}> | null

export type Cloner = {
	Clone(__typeArgs: $.GenericTypeArgs | undefined): any
}

$.registerInterfaceType(
	"main.Cloner",
	null,
	[{ name: "Clone", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export class Stack {
	public declare items: $.Slice<any>

	constructor(__goscriptValue?: boolean, items$?: $.Slice<any>) {
		this.items = items$ ?? (null! as $.Slice<any>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Stack {
		return $.copyGenericInstance(this, new Stack(true, this.items))
	}

	public __goscriptAssign(source: Stack): this {
		this.items = source.items
		return this
	}

	public Len(__typeArgs: $.GenericTypeArgs | undefined): number {
		const s: Stack | $.VarRef<Stack> | null = this;
		return $.sliceLen($.pointerValue<Stack>(s).items)
	}

	public Pop(__typeArgs: $.GenericTypeArgs | undefined): [any, boolean] {
		const s: Stack | $.VarRef<Stack> | null = this;
		const s$: Stack = s == null ? $.pointerTarget<Stack>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<Stack>(s)
		if ($.sliceLen((s$ as Stack).items) == 0) {
			$.panic("pop from empty stack")
		}
		let last = $.sliceLen((s$ as Stack).items) - 1
		let value = $.copyElement($.arrayIndex((s$ as Stack).items!, last));
		;(s$ as Stack).items = $.goSlice((s$ as Stack).items, undefined, last)
		return [$.copyElement(value), true]
	}

	public Push(__typeArgs: $.GenericTypeArgs | undefined, value: any): void {
		const s: Stack | $.VarRef<Stack> | null = this;
		const s$: Stack = s == null ? $.pointerTarget<Stack>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<Stack>(s);
		;(s$ as Stack).items = $.append((s$ as Stack).items, value, $.appendZero(() => ($.genericZero(__typeArgs, "T", null) as any)))
	}

	static __typeInfo = $.registerStructType(
		"main.Stack",
		() => new Stack(),
		() => [{ name: "Len", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }, { name: "Pop", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }, { type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Push", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		Stack,
		() => [{ name: "items", key: "items", type: /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }) }]
	)
}

export class Item {
	public declare Name: string

	constructor(__goscriptValue?: boolean, Name$?: string) {
		this.Name = Name$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Item {
		return new Item(true, this.Name)
	}

	public __goscriptAssign(source: Item): this {
		this.Name = source.Name
		return this
	}

	public Clone(): Item | $.VarRef<Item> | null {
		const i: Item | $.VarRef<Item> | null = this;
		if (i == null) {
			return null
		}
		return new Item(false, $.pointerValue<Item>(i).Name + " copy")
	}

	static __typeInfo = $.registerStructType(
		"main.Item",
		() => new Item(),
		() => [{ name: "Clone", args: [], returns: [{ type: /* @__PURE__ */ $.pointerType("main.Item") }], pointerReceiver: true }],
		Item,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class Mapper {
	public declare values: globalThis.Map<any, any> | null

	constructor(__goscriptValue?: boolean, values$?: globalThis.Map<any, any> | null) {
		this.values = values$ ?? (null! as globalThis.Map<any, any> | null)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Mapper {
		return $.copyGenericInstance(this, new Mapper(true, this.values))
	}

	public __goscriptAssign(source: Mapper): this {
		this.values = source.values
		return this
	}

	public Get(__typeArgs: $.GenericTypeArgs | undefined, key: any): [any, boolean] {
		const m: Mapper | $.VarRef<Mapper> | null = this;
		let [value, ok] = $.mapGet<any, any, any>($.pointerValue<Mapper>(m).values, key, null)
		return [$.copyElement(value), ok]
	}

	public Put(__typeArgs: $.GenericTypeArgs | undefined, key: any, value: any): void {
		const m: Mapper | $.VarRef<Mapper> | null = this;
		$.mapSet($.pointerValue<Mapper>(m).values, key, $.copyElement(value))
	}

	static __typeInfo = $.registerStructType(
		"main.Mapper",
		() => new Mapper(),
		() => [{ name: "Get", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }, { type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Put", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		Mapper,
		() => [{ name: "values", key: "values", type: /* @__PURE__ */ $.mapType({ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }) }]
	)
}

export class Pair {
	public declare First: any

	public declare Second: any

	constructor(__goscriptValue?: boolean, First$?: any, Second$?: any) {
		this.First = First$ ?? (null! as any)
		this.Second = Second$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Pair {
		return $.copyGenericInstance(this, new Pair(true, $.copyElement(this.First), $.copyElement(this.Second)))
	}

	public __goscriptAssign(source: Pair): this {
		this.First = $.assignFieldValue(this.First, source.First)
		this.Second = $.assignFieldValue(this.Second, source.Second)
		return this
	}

	public Swap(__typeArgs: $.GenericTypeArgs | undefined): Pair {
		const p = this;
		return $.genericInstance(new Pair(true, $.copyElement(p.Second), $.copyElement(p.First)), () => [{Swap: (receiver: any) => $.pointerValue(receiver).Swap({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: __typeArgs?.["T"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }})}, [$.methodSignature("Swap", [], [$.genericStructType("main.Pair", $.genericTypeName("main.Pair", [__typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }]), () => [/* @__PURE__ */ $.structField("First", __typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }, [0], 0, true), /* @__PURE__ */ $.structField("Second", __typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }, [1], 0, true)])], false, false)]])
	}

	static __typeInfo = $.registerStructType(
		"main.Pair",
		() => new Pair(),
		() => [{ name: "Swap", args: [], returns: [{ type: "main.Pair" }] }],
		Pair,
		() => [{ name: "First", key: "First", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Second", key: "Second", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export function min(__typeArgs: $.GenericTypeArgs | undefined, a: any, b: any): any {
	if ((b as any) < (a as any)) {
		return b
	}
	return a
}

export function NewSet<T>(__typeArgs: $.GenericTypeArgs | undefined, values: $.Slice<T>): Set {
	let _set = $.makeMap<any, {}>(undefined, __typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] })
	for (let __goscriptRangeTarget0 = values, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let value = (__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as any)
		$.mapSet(_set, value, {})
	}
	return _set
}

export function Set_Add(s: Set, __typeArgs: $.GenericTypeArgs | undefined, value: any): void {
	$.mapSet(s, value, {})
}

export function Set_Has(s: Set, __typeArgs: $.GenericTypeArgs | undefined, value: any): boolean {
	let [, ok] = $.mapGet<any, {}, {}>(s, value, {})
	return ok
}

export async function CloneAll<T>(__typeArgs: $.GenericTypeArgs | undefined, items: $.Slice<T>): globalThis.Promise<$.Slice<T>> {
	let clones: $.Slice<T> = $.makeSlice<T>(0, $.sliceLen(items), $.genericSliceTypeHint(__typeArgs, "T"), () => ($.genericZero(__typeArgs, "T", null) as T))
	for (let __goscriptRangeTarget1 = items, __goscriptRangeWindow1 = $.sliceRange(__goscriptRangeTarget1), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow1.length; __rangeIndex++) {
		let item = $.copyElement((__goscriptRangeWindow1.backing[__goscriptRangeWindow1.offset + __rangeIndex] as any))
		clones = $.append(clones, (__goscriptAwait = $.callGenericMethod(__typeArgs, "T", "Clone", item), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait), $.appendZero(() => ($.genericZero(__typeArgs, "T", null) as T)))
	}
	return clones
}

export function NewMapper(__typeArgs: $.GenericTypeArgs | undefined): Mapper | $.VarRef<Mapper> | null {
	return $.genericInstance(new Mapper(false, $.makeMap<any, any>(undefined, __typeArgs?.["K"]?.type ?? { kind: $.TypeKind.Interface, methods: [] })), () => [{Get: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Get({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, K: __typeArgs?.["K"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }, V: __typeArgs?.["V"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ...$.stripGenericTypeArgs(args)), Put: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Put({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, K: __typeArgs?.["K"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }, V: __typeArgs?.["V"] ?? { type: { kind: $.TypeKind.Interface, methods: [] }, zero: () => null }}, ...$.stripGenericTypeArgs(args))}, [$.methodSignature("Get", [__typeArgs?.["K"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }], [__typeArgs?.["V"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }, /* @__PURE__ */ $.basicType("bool")], true, false), $.methodSignature("Put", [__typeArgs?.["K"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }, __typeArgs?.["V"]?.type ?? { kind: $.TypeKind.Interface, methods: [] }], [], true, false)]])
}

export function Apply(__typeArgs: $.GenericTypeArgs | undefined, value: any, fn: ((_p0: any) => any | globalThis.Promise<any>) | null): any {
	return (fn!($.copyElement(value)) as any)
}

export async function main(): globalThis.Promise<void> {
	await $.println("=== Generic constraints ===")
	await $.println("min:", min(__goscriptStatic0(), 8, 3), min(__goscriptStatic1(), 9, 4), min(__goscriptStatic2(), "go", "ts"))

	await $.println("=== Generic stack ===")
	let stack: $.VarRef<Stack> = $.varRef($.genericInstance(new Stack(true), __goscriptStatic3))
	stack.value.Push(__goscriptStatic0(), 10)
	stack.value.Push(__goscriptStatic0(), 20)
	let __goscriptTuple0: any = stack.value.Pop(__goscriptStatic0())
	let value: number = (__goscriptTuple0[0] as number)
	let ok: boolean = __goscriptTuple0[1]
	await $.println("pop:", value, ok, stack.value.Len(__goscriptStatic0()))
	let __goscriptTuple1: any = stack.value.Pop(__goscriptStatic0())
	value = (__goscriptTuple1[0] as number)
	ok = __goscriptTuple1[1]
	await $.println("pop:", value, ok, stack.value.Len(__goscriptStatic0()))

	await $.println("=== Generic map alias ===")
	let seen = (NewSet(__goscriptStatic2(), $.arrayToSlice<string>(["go", "ts"])) as Set)
	Set_Add(seen, __goscriptStatic2(), "wasm")
	await $.println("set:", Set_Has(seen, __goscriptStatic2(), "go"), Set_Has(seen, __goscriptStatic2(), "rust"), $.len(seen))

	await $.println("=== Interface constraint ===")
	let items = $.arrayToSlice<Item | $.VarRef<Item> | null>([new Item(false, "alpha"), new Item(false, "beta")])
	let clones = (await CloneAll(__goscriptStatic4(), items) as $.Slice<Item | $.VarRef<Item> | null>)
	await $.println("clone:", $.pointerValue<Item>($.arrayIndex(clones!, 0)).Name, $.pointerValue<Item>($.arrayIndex(clones!, 1)).Name, ($.arrayIndex(clones!, 0) === $.arrayIndex(items!, 0) || ($.pointerAliasesMade || ($.arrayIndex(clones!, 0) as any)?.__goElementBacking !== undefined) && $.pointerEqual($.arrayIndex(clones!, 0), $.arrayIndex(items!, 0))))

	await $.println("=== Generic struct with map field ===")
	let mapper = (NewMapper(__goscriptStatic5()) as Mapper | $.VarRef<Mapper> | null)
	void (mapper !== null && (mapper as any).__isVarRef !== true && (mapper as any).__goValue === undefined ? ((mapper as any) as Mapper).Put(__goscriptStatic5(), "answer", 42) : Mapper.prototype.Put.call(mapper, __goscriptStatic5(), "answer", 42))
	let __goscriptTuple2: any = (mapper !== null && (mapper as any).__isVarRef !== true && (mapper as any).__goValue === undefined ? ((mapper as any) as Mapper).Get(__goscriptStatic5(), "answer") : Mapper.prototype.Get.call(mapper, __goscriptStatic5(), "answer"))
	let answer: number = (__goscriptTuple2[0] as number)
	let found: boolean = __goscriptTuple2[1]
	await $.println("mapper:", answer, found)

	await $.println("=== Function instantiation ===")
	let applyInt: ((value: number, fn: ((_p0: number) => number | globalThis.Promise<number>) | null) => number | globalThis.Promise<number>) | null = $.functionValue((value: any, fn: ((_p0: any) => any | globalThis.Promise<any>) | null): any => Apply(__goscriptStatic0(), value, fn), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo)], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))
	await $.println("apply:", (applyInt!(21, $.functionValue((n: number): number => {
		return n * 2
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))) as number))

	await $.println("=== Generic pair method ===")
	let pair = $.genericInstance(new Pair(true, "left", "right"), __goscriptStatic6)
	let swapped = (pair.Swap(__goscriptStatic2()) as Pair)
	await $.println("pair:", swapped.First, swapped.Second)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int", "main.Score"), zero: () => 0 }})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([{Len: (receiver: any) => $.pointerValue(receiver).Len(__goscriptStatic0()), Pop: (receiver: any) => $.pointerValue(receiver).Pop(__goscriptStatic0()), Push: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Push(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true, false), $.methodSignature("Pop", [], [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("bool")], true, false), $.methodSignature("Push", [/* @__PURE__ */ $.basicType("int")], [], true, false)]])
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.pointerType("main.Item"), zero: () => null, methods: {Clone: (receiver: any) => $.pointerValue(receiver).Clone()} }})
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, K: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }, V: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ([{Swap: (receiver: any) => $.pointerValue(receiver).Swap(__goscriptStatic2())}, [$.methodSignature("Swap", [], [/* @__PURE__ */ $.genericStructType("main.Pair", "main.Pair[string]", () => [/* @__PURE__ */ $.structField("First", /* @__PURE__ */ $.basicType("string"), [0], 0, true), /* @__PURE__ */ $.structField("Second", /* @__PURE__ */ $.basicType("string"), [1], 16, true)])], false, false)]])
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

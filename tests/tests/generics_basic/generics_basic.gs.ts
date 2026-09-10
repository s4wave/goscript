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

	public _fields: {
		items: $.Slice<any>
	}

	constructor(init?: Partial<{items?: $.Slice<any>}>) {
		this._fields = {
			items: init?.items ?? (null! as $.Slice<any>)
		}
	}

	public clone(): Stack {
		return $.markAsStructValue(new Stack(this))
	}

	public Len(__typeArgs: $.GenericTypeArgs | undefined): number {
		const s: Stack | $.VarRef<Stack> | null = this
		return $.len($.pointerValue<Stack>(s).items)
	}

	public Pop(__typeArgs: $.GenericTypeArgs | undefined): [any, boolean] {
		let s: Stack | $.VarRef<Stack> | null = this
		if ($.len($.pointerValue<Stack>(s).items) == 0) {
			$.panic("pop from empty stack")
		}
		let last = $.len($.pointerValue<Stack>(s).items) - 1
		let value = $.arrayIndex($.pointerValue<Stack>(s).items!, last)
		$.pointerValue<Stack>(s).items = $.goSlice($.pointerValue<Stack>(s).items, undefined, last)
		return [value, true]
	}

	public Push(__typeArgs: $.GenericTypeArgs | undefined, value: any): void {
		let s: Stack | $.VarRef<Stack> | null = this
		$.pointerValue<Stack>(s).items = $.append($.pointerValue<Stack>(s).items, value, $.appendZero(() => ($.genericZero(__typeArgs, "T", null) as any)))
	}

	static {
		$.bindStructFields(this.prototype, ["items"])
	}

	static __typeInfo = $.registerStructType(
		"main.Stack",
		() => new Stack(),
		() => [{ name: "Len", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Pop", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }, { type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Push", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		Stack,
		() => [{ name: "items", key: "items", type: /* @__PURE__ */ $.sliceType({ kind: $.TypeKind.Interface, methods: [] }) }]
	)
}

export class Item {
	public declare Name: string

	public _fields: {
		Name: string
	}

	constructor(init?: Partial<{Name?: string}>) {
		this._fields = {
			Name: init?.Name ?? ("" as string)
		}
	}

	public clone(): Item {
		return $.markAsStructValue(new Item(this))
	}

	public Clone(): Item | $.VarRef<Item> | null {
		const i: Item | $.VarRef<Item> | null = this
		if (i == null) {
			return null
		}
		return new Item({Name: $.pointerValue<Item>(i).Name + " copy"})
	}

	static {
		$.bindStructFields(this.prototype, ["Name"])
	}

	static __typeInfo = $.registerStructType(
		"main.Item",
		() => new Item(),
		() => [{ name: "Clone", args: [], returns: [{ type: /* @__PURE__ */ $.pointerType("main.Item") }] }],
		Item,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class Mapper {
	public declare values: globalThis.Map<any, any> | null

	public _fields: {
		values: globalThis.Map<any, any> | null
	}

	constructor(init?: Partial<{values?: globalThis.Map<any, any> | null}>) {
		this._fields = {
			values: init?.values ?? (null! as globalThis.Map<any, any> | null)
		}
	}

	public clone(): Mapper {
		return $.markAsStructValue(new Mapper(this))
	}

	public Get(__typeArgs: $.GenericTypeArgs | undefined, key: any): [any, boolean] {
		const m: Mapper | $.VarRef<Mapper> | null = this
		let [value, ok] = $.mapGet<any, any, any>($.pointerValue<Mapper>(m).values, key, null)
		return [value, ok]
	}

	public Put(__typeArgs: $.GenericTypeArgs | undefined, key: any, value: any): void {
		let m: Mapper | $.VarRef<Mapper> | null = this
		$.mapSet($.pointerValue<Mapper>(m).values, key, value)
	}

	static {
		$.bindStructFields(this.prototype, ["values"])
	}

	static __typeInfo = $.registerStructType(
		"main.Mapper",
		() => new Mapper(),
		() => [{ name: "Get", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }, { type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Put", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }, { type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		Mapper,
		() => [{ name: "values", key: "values", type: /* @__PURE__ */ $.mapType({ kind: $.TypeKind.Interface, methods: [] }, { kind: $.TypeKind.Interface, methods: [] }) }]
	)
}

export class Pair {
	public declare First: any

	public declare Second: any

	public _fields: {
		First: any
		Second: any
	}

	constructor(init?: Partial<{First?: any, Second?: any}>) {
		this._fields = {
			First: init?.First ?? (null! as any),
			Second: init?.Second ?? (null! as any)
		}
	}

	public clone(): Pair {
		return $.markAsStructValue(new Pair(this))
	}

	public Swap(__typeArgs: $.GenericTypeArgs | undefined): Pair {
		const p = this
		return $.markAsStructValue(new Pair({First: p.Second, Second: p.First}))
	}

	static {
		$.bindStructFields(this.prototype, ["First", "Second"])
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
	let _set: Set = $.makeMap<any, {}>(undefined, __typeArgs?.["T"]?.type ?? { kind: $.TypeKind.Interface, methods: [] })
	for (let __goscriptRangeTarget0 = values, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let value = __goscriptRangeTarget0![__rangeIndex]
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
	let clones: $.Slice<T> = $.makeSlice<T>(0, $.len(items), undefined, () => ($.genericZero(__typeArgs, "T", null) as T))
	for (let __goscriptRangeTarget1 = items, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let item = __goscriptRangeTarget1![__rangeIndex]
		clones = $.append(clones, await $.callGenericMethod(__typeArgs, "T", "Clone", item), $.appendZero(() => ($.genericZero(__typeArgs, "T", null) as T)))
	}
	return clones
}

export function NewMapper(__typeArgs: $.GenericTypeArgs | undefined): Mapper | $.VarRef<Mapper> | null {
	return new Mapper({values: $.makeMap<any, any>(undefined, __typeArgs?.["K"]?.type ?? { kind: $.TypeKind.Interface, methods: [] })})
}

export async function Apply(__typeArgs: $.GenericTypeArgs | undefined, value: any, fn: ((_p0: any) => any | globalThis.Promise<any>) | null): globalThis.Promise<any> {
	return fn!(value)
}

export async function main(): globalThis.Promise<void> {
	await $.println("=== Generic constraints ===")
	await $.println("min:", min({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, 8, 3), min({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int", "main.Score"), zero: () => 0 }}, 9, 4), min({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }}, "go", "ts"))

	await $.println("=== Generic stack ===")
	let stack: $.VarRef<Stack> = $.varRef($.markAsStructValue(new Stack()))
	stack.value.Push({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, 10)
	stack.value.Push({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, 20)
	let __goscriptTuple0: any = stack.value.Pop({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
	let value = (__goscriptTuple0[0] as number)
	let ok = __goscriptTuple0[1]
	await $.println("pop:", value, ok, stack.value.Len({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}))
	let __goscriptTuple1: any = stack.value.Pop({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
	value = (__goscriptTuple1[0] as number)
	ok = __goscriptTuple1[1]
	await $.println("pop:", value, ok, stack.value.Len({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}))

	await $.println("=== Generic map alias ===")
	let seen: Set = (NewSet(undefined, $.arrayToSlice<string>(["go", "ts"])) as Set)
	Set_Add(seen, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }}, "wasm")
	await $.println("set:", Set_Has(seen, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }}, "go"), Set_Has(seen, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }}, "rust"), $.len(seen))

	await $.println("=== Interface constraint ===")
	let items: $.Slice<Item | $.VarRef<Item> | null> = $.arrayToSlice<Item | $.VarRef<Item> | null>([new Item({Name: "alpha"}), new Item({Name: "beta"})])
	let clones: $.Slice<Item | $.VarRef<Item> | null> = (await CloneAll({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.pointerType("main.Item"), zero: () => null, methods: {Clone: (receiver: any, ...args: any[]) => $.pointerValue(receiver).Clone(...$.stripGenericTypeArgs(args))} }}, items) as $.Slice<Item | $.VarRef<Item> | null>)
	await $.println("clone:", $.pointerValue<Item>($.arrayIndex(clones!, 0)).Name, $.pointerValue<Item>($.arrayIndex(clones!, 1)).Name, $.pointerEqual($.arrayIndex(clones!, 0), $.arrayIndex(items!, 0)))

	await $.println("=== Generic struct with map field ===")
	let mapper: Mapper | $.VarRef<Mapper> | null = (NewMapper({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, K: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }, V: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}) as Mapper | $.VarRef<Mapper> | null)
	Mapper.prototype.Put.call(mapper, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, K: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }, V: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, "answer", 42)
	let __goscriptTuple2: any = Mapper.prototype.Get.call(mapper, {[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, K: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }, V: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, "answer")
	let answer = (__goscriptTuple2[0] as number)
	let found = __goscriptTuple2[1]
	await $.println("mapper:", answer, found)

	await $.println("=== Function instantiation ===")
	let applyInt: ((value: number, fn: ((_p0: number) => number | globalThis.Promise<number>) | null) => number | globalThis.Promise<number>) | null = $.functionValue(async (value: any, fn: ((_p0: any) => any | globalThis.Promise<any>) | null): globalThis.Promise<any> => await Apply({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }}, value, fn), ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo)], results: [{ kind: $.TypeKind.Interface, methods: [] }] } as $.FunctionTypeInfo))
	await $.println("apply:", await applyInt!(21, $.functionValue((n: number): number => {
		return n * 2
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("int")] } as $.FunctionTypeInfo))))

	await $.println("=== Generic pair method ===")
	let pair = $.markAsStructValue(new Pair({First: "left", Second: "right"}))
	let swapped = ($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(pair)).Swap({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("string"), zero: () => "" }}))) as Pair)
	await $.println("pair:", swapped.First, swapped.Second)
}

if ($.isMainScript(import.meta)) {
	await main()
}

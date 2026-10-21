// Generated file based on generic_struct_value_copy.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Value {
	public declare V: number

	public declare U: number

	constructor(__goscriptValue?: boolean, V$?: number, U$?: number) {
		this.V = V$ ?? 0
		this.U = U$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Value {
		return new Value(true, this.V, this.U)
	}

	public __goscriptAssign(source: Value): this {
		this.V = source.V
		this.U = source.U
		return this
	}

	public Set(x: number): void {
		const v: Value | $.VarRef<Value> | null = this;
		$.pointerValue<Value>(v).V = x
	}

	static __typeInfo = $.registerStructType(
		"main.Value",
		() => new Value(),
		() => [{ name: "Set", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		Value,
		() => [{ name: "V", key: "V", type: /* @__PURE__ */ $.basicType("float32") }, { name: "U", key: "U", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class Sides {
	public declare Top: any

	public declare Right: any

	public declare Bottom: any

	public declare Left: any

	constructor(__goscriptValue?: boolean, Top$?: any, Right$?: any, Bottom$?: any, Left$?: any) {
		this.Top = Top$ ?? (null! as any)
		this.Right = Right$ ?? (null! as any)
		this.Bottom = Bottom$ ?? (null! as any)
		this.Left = Left$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Sides {
		return $.copyGenericInstance(this, new Sides(true, $.copyElement(this.Top), $.copyElement(this.Right), $.copyElement(this.Bottom), $.copyElement(this.Left)))
	}

	public __goscriptAssign(source: Sides): this {
		this.Top = $.assignFieldValue(this.Top, source.Top)
		this.Right = $.assignFieldValue(this.Right, source.Right)
		this.Bottom = $.assignFieldValue(this.Bottom, source.Bottom)
		this.Left = $.assignFieldValue(this.Left, source.Left)
		return this
	}

	public SetAll(__typeArgs: $.GenericTypeArgs | undefined, val: any): void {
		const s: Sides | $.VarRef<Sides> | null = this;
		const s$: Sides = s == null ? $.pointerTarget<Sides>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<Sides>(s);
		;(s$ as Sides).Top = $.copyElement(val);
		;(s$ as Sides).Right = $.copyElement(val);
		;(s$ as Sides).Bottom = $.copyElement(val);
		;(s$ as Sides).Left = $.copyElement(val)
	}

	public SetHorizontal(__typeArgs: $.GenericTypeArgs | undefined, val: any): void {
		const s: Sides | $.VarRef<Sides> | null = this;
		const s$: Sides = s == null ? $.pointerTarget<Sides>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<Sides>(s);
		;(s$ as Sides).Right = $.copyElement(val);
		;(s$ as Sides).Left = $.copyElement(val)
	}

	static __typeInfo = $.registerStructType(
		"main.Sides",
		() => new Sides(),
		() => [{ name: "SetAll", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }, { name: "SetHorizontal", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		Sides,
		() => [{ name: "Top", key: "Top", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Right", key: "Right", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Bottom", key: "Bottom", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Left", key: "Left", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class box {
	public declare A: any

	public declare B: any

	constructor(__goscriptValue?: boolean, A$?: any, B$?: any) {
		this.A = A$ ?? (null! as any)
		this.B = B$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): box {
		return $.copyGenericInstance(this, new box(true, $.copyElement(this.A), $.copyElement(this.B)))
	}

	public __goscriptAssign(source: box): this {
		this.A = $.assignFieldValue(this.A, source.A)
		this.B = $.assignFieldValue(this.B, source.B)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.box",
		() => new box(),
		() => [],
		box,
		() => [{ name: "A", key: "A", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "B", key: "B", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export function copyOf(__typeArgs: $.GenericTypeArgs | undefined, v: any): any {
	let c: any = $.copyElement(v)
	return $.copyElement(c)
}

export function twoCopies(__typeArgs: $.GenericTypeArgs | undefined, v: any): [any, any] {
	let a: any = $.copyElement(v)
	let b: any = $.copyElement(v)
	return [$.copyElement(a), $.copyElement(b)]
}

export function store(__typeArgs: $.GenericTypeArgs | undefined, dst: any, v: any): void {
	$.genericPointerRef(dst).value = $.copyElement(v)
}

export function fill<T>(__typeArgs: $.GenericTypeArgs | undefined, n: number, v: any): $.Slice<T> {
	let r = $.makeSlice<T>(n, undefined, $.genericSliceTypeHint(__typeArgs, "T"), () => ($.genericZero(__typeArgs, "T", null) as T))
	for (let __goscriptRangeTarget0 = r, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
		;(__goscriptRangeWindow0.backing as any[])[__goscriptRangeWindow0.offset + i] = $.copyElement(v)
	}
	return r
}

export function appendTwice<T>(__typeArgs: $.GenericTypeArgs | undefined, s: $.Slice<T>, v: any): $.Slice<T> {
	return $.append(s, v, v, $.appendZero(() => ($.genericZero(__typeArgs, "T", null) as T)))
}

export function setTwo(__typeArgs: $.GenericTypeArgs | undefined, m: globalThis.Map<string, any> | null, v: any): void {
	$.mapSet(m, "a", $.copyElement(v))
	$.mapSet(m, "b", $.copyElement(v))
}

export function pair(__typeArgs: $.GenericTypeArgs | undefined, v: any): any[] {
	return $.arrayValue([$.copyElement(v), $.copyElement(v)])
}

export function makeBox(__typeArgs: $.GenericTypeArgs | undefined, v: any): box {
	return new box(true, $.copyElement(v), $.copyElement(v))
}

export async function main(): globalThis.Promise<void> {
	let s: $.VarRef<Sides> = $.varRef($.genericInstance(new Sides(true, new Value(true), new Value(true), new Value(true), new Value(true)), __goscriptStatic1))
	s.value.SetHorizontal(__goscriptStatic0(), new Value(true, 24))
	s.value.Left.Set(16)
	await $.println("horizontal:", s.value.Left.V, s.value.Right.V)

	s.value.SetAll(__goscriptStatic0(), new Value(true, 10))
	s.value.Top.Set(1)
	s.value.Left.Set(2)
	await $.println("all:", s.value.Top.V, s.value.Right.V, s.value.Bottom.V, s.value.Left.V)

	let v = new Value(true, 1)
	let c = $.varRef(((copyOf(__goscriptStatic0(), (v).clone())).clone() as Value))
	c.value.Set(2)
	await $.println("copyOf:", v.V, c.value.V)

	let __goscriptTuple0: any = twoCopies(__goscriptStatic0(), new Value(true, 15))
	let a1: $.VarRef<Value> = $.varRef((__goscriptTuple0[0] as Value))
	let b1: Value = (__goscriptTuple0[1] as Value)
	a1.value.Set(16)
	await $.println("twoCopies:", a1.value.V, b1.V)

	let d: $.VarRef<Value> = $.varRef(new Value(true))
	store(__goscriptStatic0(), d, (v).clone())
	d.value.Set(3)
	await $.println("store:", v.V, d.value.V)

	let xs = (fill(__goscriptStatic0(), 2, new Value(true, 5)) as $.Slice<Value>)
	$.arrayIndex(xs!, 0).Set(6)
	await $.println("fill:", $.arrayIndex(xs!, 0).V, $.arrayIndex(xs!, 1).V)

	let ys = (appendTwice(__goscriptStatic0(), null, new Value(true, 7)) as $.Slice<Value>)
	$.arrayIndex(ys!, 0).Set(8)
	await $.println("append:", $.arrayIndex(ys!, 0).V, $.arrayIndex(ys!, 1).V)

	let m = $.makeMap<string, Value>([])
	setTwo(__goscriptStatic0(), m, new Value(true, 9))
	let a = $.varRef(($.mapGet<string, Value, Value>(m, "a", new Value(true))[0]).clone())
	a.value.Set(10)
	$.mapSet(m, "a", (a.value).clone())
	await $.println("map:", $.mapGet<string, Value, Value>(m, "a", new Value(true))[0].V, $.mapGet<string, Value, Value>(m, "b", new Value(true))[0].V)

	let p = (pair(__goscriptStatic0(), new Value(true, 11)) as Value[])
	p[0].Set(12)
	await $.println("pair:", p[0].V, p[1].V)

	let b = (makeBox(__goscriptStatic0(), new Value(true, 13)) as box)
	b.A.Set(14)
	await $.println("box:", b.A.V, b.B.V)

	// Copying a generic struct copies its struct-typed fields, so assigning
	// to a field of the original leaves the copy unchanged.
	let orig = $.genericInstance(new Sides(true, new Value(true), new Value(true), new Value(true, 1), new Value(true)), __goscriptStatic1)
	let cp = (orig).clone()
	cp.Bottom.__goscriptAssign(new Value(true, 2))
	orig.Bottom.__goscriptAssign(new Value(true, 3))
	await $.println("struct copy:", orig.Bottom.V, cp.Bottom.V)
	let orig2 = $.genericInstance(new Sides(true, new Value(true, 4), new Value(true), new Value(true), new Value(true)), __goscriptStatic1)
	let cp2 = (orig2).clone()
	orig2.Top.Set(5)
	await $.println("struct copy method:", orig2.Top.V, cp2.Top.V)

	let si: $.VarRef<Sides> = $.varRef($.genericInstance(new Sides(true, 0, 0, 0, 0), __goscriptStatic3))
	si.value.SetAll(__goscriptStatic2(), 4)
	si.value.Left = 5
	await $.println("ints:", si.value.Top, si.value.Left)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.Value", zero: () => new Value(true) }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{SetAll: (receiver: any, ...args: any[]) => $.pointerValue(receiver).SetAll(__goscriptStatic0(), ...$.stripGenericTypeArgs(args)), SetHorizontal: (receiver: any, ...args: any[]) => $.pointerValue(receiver).SetHorizontal(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("SetAll", ["main.Value"], [], true, false), $.methodSignature("SetHorizontal", ["main.Value"], [], true, false)]])
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([{SetAll: (receiver: any, ...args: any[]) => $.pointerValue(receiver).SetAll(__goscriptStatic2(), ...$.stripGenericTypeArgs(args)), SetHorizontal: (receiver: any, ...args: any[]) => $.pointerValue(receiver).SetHorizontal(__goscriptStatic2(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("SetAll", [/* @__PURE__ */ $.basicType("int")], [], true, false), $.methodSignature("SetHorizontal", [/* @__PURE__ */ $.basicType("int")], [], true, false)]])
}

if ($.isMainScript(import.meta)) {
	await main()
}

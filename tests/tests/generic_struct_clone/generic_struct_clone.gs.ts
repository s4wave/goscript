// Generated file based on generic_struct_clone.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class unit {
	public declare V: number

	public declare U: string

	constructor(__goscriptValue?: boolean, V$?: number, U$?: string) {
		this.V = V$ ?? 0
		this.U = U$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): unit {
		return new unit(true, this.V, this.U)
	}

	public __goscriptAssign(source: unit): this {
		this.V = source.V
		this.U = source.U
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.unit",
		() => new unit(),
		() => [],
		unit,
		() => [{ name: "V", key: "V", type: /* @__PURE__ */ $.basicType("float32") }, { name: "U", key: "U", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class sides {
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

	public clone(): sides {
		return $.copyGenericInstance(this, new sides(true, $.copyElement(this.Top), $.copyElement(this.Right), $.copyElement(this.Bottom), $.copyElement(this.Left)))
	}

	public __goscriptAssign(source: sides): this {
		this.Top = $.assignFieldValue(this.Top, source.Top)
		this.Right = $.assignFieldValue(this.Right, source.Right)
		this.Bottom = $.assignFieldValue(this.Bottom, source.Bottom)
		this.Left = $.assignFieldValue(this.Left, source.Left)
		return this
	}

	public setAll(__typeArgs: $.GenericTypeArgs | undefined, v: any): void {
		const s: sides | $.VarRef<sides> | null = this;
		const s$: sides = s == null ? $.pointerTarget<sides>(s) : (s as any).__isVarRef === true ? (s as any).value : (s as any).__goValue === undefined ? (s as any) : $.pointerTarget<sides>(s)
		let __goscriptAssign0_0: any = $.copyElement(v)
		let __goscriptAssign0_1: any = $.copyElement(v)
		let __goscriptAssign0_2: any = $.copyElement(v)
		let __goscriptAssign0_3: any = $.copyElement(v);
		;(s$ as sides).Top = __goscriptAssign0_0;
		;(s$ as sides).Right = __goscriptAssign0_1;
		;(s$ as sides).Bottom = __goscriptAssign0_2;
		;(s$ as sides).Left = __goscriptAssign0_3
	}

	static __typeInfo = $.registerStructType(
		"main.sides",
		() => new sides(),
		() => [{ name: "setAll", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		sides,
		() => [{ name: "Top", key: "Top", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Right", key: "Right", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Bottom", key: "Bottom", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Left", key: "Left", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export class values {
	public declare sides: sides

	public declare Name: string

	constructor(__goscriptValue?: boolean, sides$?: sides, Name$?: string) {
		this.sides = sides$ ?? $.genericInstance(new sides(true, new unit(true), new unit(true), new unit(true), new unit(true)), __goscriptStatic1)
		this.Name = Name$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): values {
		return new values(true, this.sides.clone(), this.Name)
	}

	public __goscriptAssign(source: values): this {
		this.sides.__goscriptAssign(source.sides)
		this.Name = source.Name
		return this
	}

	public setAll(v: any): any {
		return $.pointerValue<sides>(this.sides).setAll(__goscriptStatic0(), v)
	}

	static __typeInfo = $.registerStructType(
		"main.values",
		() => new values(),
		() => [{ name: "setAll", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }],
		values,
		() => [{ name: "sides", key: "sides", type: /* @__PURE__ */ $.genericStructType("main.sides", "main.sides[main.unit]", () => [/* @__PURE__ */ $.structField("Top", "main.unit", [0], 0, true), /* @__PURE__ */ $.structField("Right", "main.unit", [1], 24, true), /* @__PURE__ */ $.structField("Bottom", "main.unit", [2], 48, true), /* @__PURE__ */ $.structField("Left", "main.unit", [3], 72, true)]), anonymous: true }, { name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class pair {
	public declare Key: any

	public declare Val: any

	constructor(__goscriptValue?: boolean, Key$?: any, Val$?: any) {
		this.Key = Key$ ?? (null! as any)
		this.Val = Val$ ?? (null! as any)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): pair {
		return $.copyGenericInstance(this, new pair(true, this.Key, $.copyElement(this.Val)))
	}

	public __goscriptAssign(source: pair): this {
		this.Key = $.assignFieldValue(this.Key, source.Key)
		this.Val = $.assignFieldValue(this.Val, source.Val)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.pair",
		() => new pair(),
		() => [],
		pair,
		() => [{ name: "Key", key: "Key", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "Val", key: "Val", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export function copySides(__typeArgs: $.GenericTypeArgs | undefined, s: sides): sides {
	let c = (s).clone()
	return c
}

export async function main(): globalThis.Promise<void> {
	// A struct that embeds an instance of a generic struct copies it.
	let a = $.varRef(new values(true, undefined, "a"))
	a.value.sides.setAll(__goscriptStatic0(), new unit(true, 1, "px"))
	let b = (a.value).clone()
	b.sides.Top.V = 5
	b.sides.Left.U = "em"
	await $.println("copy:", a.value.sides.Top.V, a.value.sides.Left.U, b.sides.Top.V, b.sides.Left.U)

	// Instances are copied when assigned, passed and returned.
	let s = $.genericInstance(new sides(true, new unit(true, 2, "dp"), new unit(true), new unit(true), new unit(true)), __goscriptStatic1)
	let t = (copySides(__goscriptStatic0(), s) as sides)
	t.Top.V = 9
	let u = (s).clone()
	u.Right.__goscriptAssign(new unit(true, 3, "x"))
	await $.println("instance:", s.Top.V, t.Top.V, $.stringEqual(s.Right.U, ""), u.Right.U)

	// Instances with type arguments of other kinds.
	let p = new pair(true, "k", $.genericInstance(new sides(true, 1, 2, 3, 4), __goscriptStatic3))
	let q = (p).clone()
	q.Val.Left = 40
	let ps = $.arrayToSlice<pair>([(p).clone(), (q).clone()])
	$.arrayIndex(ps!, 0).Val.Top = 10
	await $.println("pair:", p.Val.Left, q.Val.Left, $.arrayIndex(ps!, 0).Val.Top, p.Val.Top, $.arrayIndex(ps!, 1).Val.Left)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: "main.unit", zero: () => new unit(true) }})
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ([{setAll: (receiver: any, ...args: any[]) => $.pointerValue(receiver).setAll(__goscriptStatic0(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("setAll", ["main.unit"], [], true, false)]])
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("int"), zero: () => 0 }})
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([{setAll: (receiver: any, ...args: any[]) => $.pointerValue(receiver).setAll(__goscriptStatic2(), ...$.stripGenericTypeArgs(args))}, [$.methodSignature("setAll", [/* @__PURE__ */ $.basicType("int")], [], true, false)]])
}

if ($.isMainScript(import.meta)) {
	await main()
}

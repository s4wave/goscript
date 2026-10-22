// Generated file based on struct_equality.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Hash = ObjectID

export class ObjectID {
	public declare hash: Uint8Array

	public declare format: number

	constructor(__goscriptValue?: boolean, hash$?: Uint8Array, format$?: number) {
		this.hash = hash$ ?? $.arrayValue(new Uint8Array(4))
		this.format = format$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): ObjectID {
		return new ObjectID(true, $.cloneArrayValue(this.hash, __goscriptStatic0()), this.format)
	}

	public __goscriptAssign(source: ObjectID): this {
		this.hash = $.assignFieldValue(this.hash, source.hash, __goscriptStatic0())
		this.format = source.format
		return this
	}

	public IsZero(): boolean {
		const s = this;
		return $.structEqual(s, new ObjectID(true))
	}

	public Valid(): boolean {
		const s = this;
		return !$.structEqual(s, new ObjectID(true))
	}

	static __typeInfo = $.registerStructType(
		"main.ObjectID",
		() => new ObjectID(),
		() => [{ name: "IsZero", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Valid", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }],
		ObjectID,
		() => [{ name: "hash", key: "hash", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4) }, { name: "format", key: "format", type: /* @__PURE__ */ $.basicType("uint8") }]
	)
}

export class S {
	public declare A: string

	public declare B: number

	constructor(__goscriptValue?: boolean, A$?: string, B$?: number) {
		this.A = A$ ?? ""
		this.B = B$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): S {
		return new S(true, this.A, this.B)
	}

	public __goscriptAssign(source: S): this {
		this.A = source.A
		this.B = source.B
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.S",
		() => new S(),
		() => [],
		S,
		() => [{ name: "A", key: "A", type: /* @__PURE__ */ $.basicType("string") }, { name: "B", key: "B", type: /* @__PURE__ */ $.basicType("float64") }]
	)
}

export class Outer {
	public declare In: S

	public declare N: number

	constructor(__goscriptValue?: boolean, In$?: S, N$?: number) {
		this.In = In$ ?? new S(true)
		this.N = N$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Outer {
		return new Outer(true, this.In.clone(), this.N)
	}

	public __goscriptAssign(source: Outer): this {
		this.In.__goscriptAssign(source.In)
		this.N = source.N
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Outer",
		() => new Outer(),
		() => [],
		Outer,
		() => [{ name: "In", key: "In", type: "main.S" }, { name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function take(x: any): void {
	{
		const __goscriptTypeSwitchValue = x
		switch ($.typeSwitchCase(__goscriptTypeSwitchValue, __goscriptStatic1())) {
			case 0:
				{
				}
				break
		}
	}
}

export function keep(x: any): any {
	return x
}

export async function main(): globalThis.Promise<void> {
	let zero: Hash = new ObjectID(true)
	let otherZero = new ObjectID(true)
	let one = new ObjectID(true, $.arrayValue(new Uint8Array([0, 7, 0, 0])))
	let otherOne = new ObjectID(true, $.arrayValue(new Uint8Array([0, 7, 0, 0])))
	let different = new ObjectID(true, $.arrayValue(new Uint8Array([0, 0, 7, 0])))

	await $.println("zero is zero:", zero.IsZero())
	await $.println("zero valid:", zero.Valid())
	await $.println("zero equals zero:", $.structEqual(zero, otherZero))
	await $.println("one valid:", one.Valid())
	await $.println("one equals other one:", $.structEqual(one, otherOne))
	await $.println("one differs:", !$.structEqual(one, different))

	// struct values compare by fields after passing a pointer as an interface
	let s = new S(true, "x", 1.5)
	let n = new S(false, "x", 1.5)
	take($.interfaceValue(n, "*main.S", /* @__PURE__ */ $.pointerType("main.S")))
	await $.println(($.pointerValue<S>(n).A === s.A && $.pointerValue<S>(n).B === s.B))
	let m = new S(false, "x", 1.5)
	keep($.interfaceValue(m, "*main.S", /* @__PURE__ */ $.pointerType("main.S")))
	await $.println(($.pointerValue<S>(m).A === s.A && $.pointerValue<S>(m).B === s.B), (s.A === $.pointerValue<S>(m).A && s.B === $.pointerValue<S>(m).B))
	let v: any = $.structInterfaceValue((s).clone(), "main.S", "main.S")
	await $.println($.structEqual($.mustTypeAssert<S>(v, "main.S"), s))

	// nested struct field passed as a pointer
	let o1 = new Outer(true, new S(true, "y"), 2)
	let o2 = new Outer(true, new S(true, "y"), 2)
	take($.interfaceValue($.fieldRef(o1, "In"), "*main.S", /* @__PURE__ */ $.pointerType("main.S")))
	await $.println((o1.In.A === o2.In.A && o1.In.B === o2.In.B && o1.N === o2.N), (o1.In.A === o2.In.A && o1.In.B === o2.In.B))
	o2.In.B = 3
	await $.println((o1.In.A === o2.In.A && o1.In.B === o2.In.B && o1.N === o2.N))

	// interface comparisons keep dynamic type and pointer identity
	let p1: any = $.interfaceValue(new S(false, "z"), "*main.S", /* @__PURE__ */ $.pointerType("main.S"))
	let p2: any = $.interfaceValue(new S(false, "z"), "*main.S", /* @__PURE__ */ $.pointerType("main.S"))
	await $.println($.comparableEqual(p1, p2), $.comparableEqual(p1, p1))
	let i1: any = $.structInterfaceValue(new S(true, "z"), "main.S", "main.S")
	let i2: any = $.interfaceValue(new S(false, "z"), "*main.S", /* @__PURE__ */ $.pointerType("main.S"))
	await $.println($.comparableEqual(i1, i2), $.comparableEqual(i1, $.structInterfaceValue(new S(true, "z"), "main.S", "main.S")))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ($.typeSwitchSite([/* @__PURE__ */ $.pointerType("main.S")]))
}

if ($.isMainScript(import.meta)) {
	await main()
}

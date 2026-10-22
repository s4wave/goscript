// Generated file based on struct_equal_method.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as math from "@goscript/math/index.js"

export class pos {
	public declare Line: number

	public declare Char: number

	constructor(__goscriptValue?: boolean, Line$?: number, Char$?: number) {
		this.Line = Line$ ?? 0
		this.Char = Char$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): pos {
		return new pos(true, this.Line, this.Char)
	}

	public __goscriptAssign(source: pos): this {
		this.Line = source.Line
		this.Char = source.Char
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.pos",
		() => new pos(),
		() => [],
		pos,
		() => [{ name: "Line", key: "Line", type: /* @__PURE__ */ $.basicType("int") }, { name: "Char", key: "Char", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class stamp {
	public declare Sec: bigint

	public declare NSec: number

	constructor(__goscriptValue?: boolean, Sec$?: bigint, NSec$?: number) {
		this.Sec = Sec$ ?? 0n
		this.NSec = NSec$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): stamp {
		return new stamp(true, this.Sec, this.NSec)
	}

	public __goscriptAssign(source: stamp): this {
		this.Sec = source.Sec
		this.NSec = source.NSec
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.stamp",
		() => new stamp(),
		() => [],
		stamp,
		() => [{ name: "Sec", key: "Sec", type: /* @__PURE__ */ $.basicType("int64") }, { name: "NSec", key: "NSec", type: /* @__PURE__ */ $.basicType("uint32") }]
	)
}

export class region {
	public declare Start: pos

	public declare End: pos

	public declare Time: stamp

	constructor(__goscriptValue?: boolean, Start$?: pos, End$?: pos, Time$?: stamp) {
		this.Start = Start$ ?? new pos(true)
		this.End = End$ ?? new pos(true)
		this.Time = Time$ ?? new stamp(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): region {
		return new region(true, this.Start.clone(), this.End.clone(), this.Time.clone())
	}

	public __goscriptAssign(source: region): this {
		this.Start.__goscriptAssign(source.Start)
		this.End.__goscriptAssign(source.End)
		this.Time.__goscriptAssign(source.Time)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.region",
		() => new region(),
		() => [],
		region,
		() => [{ name: "Start", key: "Start", type: "main.pos" }, { name: "End", key: "End", type: "main.pos" }, { name: "Time", key: "Time", type: "main.stamp" }]
	)
}

export class node {
	public declare Name: string

	constructor(__goscriptValue?: boolean, Name$?: string) {
		this.Name = Name$ ?? ""
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): node {
		return new node(true, this.Name)
	}

	public __goscriptAssign(source: node): this {
		this.Name = source.Name
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.node",
		() => new node(),
		() => [],
		node,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class mixed {
	public declare Name: string

	public declare F: number

	public declare OK: boolean

	public declare Ptr: node | $.VarRef<node> | null

	public declare Any: any

	public declare _blank5: number

	public declare Inner: pos

	constructor(__goscriptValue?: boolean, Name$?: string, F$?: number, OK$?: boolean, Ptr$?: node | $.VarRef<node> | null, Any$?: any, _blank5$?: number, Inner$?: pos) {
		this.Name = Name$ ?? ""
		this.F = F$ ?? 0
		this.OK = OK$ ?? false
		this.Ptr = Ptr$ ?? (null! as node | $.VarRef<node> | null)
		this.Any = Any$ ?? (null! as any)
		this._blank5 = _blank5$ ?? 0
		this.Inner = Inner$ ?? new pos(true)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): mixed {
		return new mixed(true, this.Name, this.F, this.OK, this.Ptr, this.Any, this._blank5, this.Inner.clone())
	}

	public __goscriptAssign(source: mixed): this {
		this.Name = source.Name
		this.F = source.F
		this.OK = source.OK
		this.Ptr = source.Ptr
		this.Any = $.assignFieldValue(this.Any, source.Any)
		this._blank5 = source._blank5
		this.Inner.__goscriptAssign(source.Inner)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.mixed",
		() => new mixed(),
		() => [],
		mixed,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }, { name: "F", key: "F", type: /* @__PURE__ */ $.basicType("float64") }, { name: "OK", key: "OK", type: /* @__PURE__ */ $.basicType("bool") }, { name: "Ptr", key: "Ptr", type: /* @__PURE__ */ $.pointerType("main.node") }, { name: "Any", key: "Any", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "_", key: "_blank5", type: /* @__PURE__ */ $.basicType("int") }, { name: "Inner", key: "Inner", type: "main.pos" }]
	)
}

export class withArray {
	public declare Vals: number[]

	constructor(__goscriptValue?: boolean, Vals$?: number[]) {
		this.Vals = Vals$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): withArray {
		return new withArray(true, $.cloneArrayValue(this.Vals, __goscriptStatic0()))
	}

	public __goscriptAssign(source: withArray): this {
		this.Vals = $.assignFieldValue(this.Vals, source.Vals, __goscriptStatic0())
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.withArray",
		() => new withArray(),
		() => [],
		withArray,
		() => [{ name: "Vals", key: "Vals", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2) }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Plain and nested fields.
	let a = new region(true, new pos(true, 1, 2), new pos(true, 3, 4), new stamp(true, 5n, 6))
	let b = (a).clone()
	await $.println("equal:", (a.Start.Line === b.Start.Line && a.Start.Char === b.Start.Char && a.End.Line === b.End.Line && a.End.Char === b.End.Char && a.Time.Sec === b.Time.Sec && a.Time.NSec === b.Time.NSec), !(a.Start.Line === b.Start.Line && a.Start.Char === b.Start.Char && a.End.Line === b.End.Line && a.End.Char === b.End.Char && a.Time.Sec === b.Time.Sec && a.Time.NSec === b.Time.NSec), (a.Start.Line === b.Start.Line && a.Start.Char === b.Start.Char))
	b.End.Char++
	await $.println("end differs:", (a.Start.Line === b.Start.Line && a.Start.Char === b.Start.Char && a.End.Line === b.End.Line && a.End.Char === b.End.Char && a.Time.Sec === b.Time.Sec && a.Time.NSec === b.Time.NSec), !(a.Start.Line === b.Start.Line && a.Start.Char === b.Start.Char && a.End.Line === b.End.Line && a.End.Char === b.End.Char && a.Time.Sec === b.Time.Sec && a.Time.NSec === b.Time.NSec), (a.End.Line === b.End.Line && a.End.Char === b.End.Char))
	b = b.__goscriptAssign(a)
	b.Time.Sec = 1099511627776n
	await $.println("time differs:", (a.Start.Line === b.Start.Line && a.Start.Char === b.Start.Char && a.End.Line === b.End.Line && a.End.Char === b.End.Char && a.Time.Sec === b.Time.Sec && a.Time.NSec === b.Time.NSec))

	// Pointers compare by identity, interfaces by their dynamic values.
	let n1 = new node(false, "x")
	let n2 = new node(false, "x")
	let m1 = new mixed(true, "m", 1.5, true, n1, $.structInterfaceValue(new pos(true, 1, 1), "main.pos", "main.pos"), undefined, new pos(true, 7, 8))
	let m2 = (m1).clone()
	await $.println("mixed:", (m1.Name === m2.Name && m1.F === m2.F && m1.OK === m2.OK && $.pointerEqual(m1.Ptr, m2.Ptr) && $.comparableEqual(m1.Any, m2.Any) && m1.Inner.Line === m2.Inner.Line && m1.Inner.Char === m2.Inner.Char))
	m2.Ptr = n2
	await $.println("other pointer:", (m1.Name === m2.Name && m1.F === m2.F && m1.OK === m2.OK && $.pointerEqual(m1.Ptr, m2.Ptr) && $.comparableEqual(m1.Any, m2.Any) && m1.Inner.Line === m2.Inner.Line && m1.Inner.Char === m2.Inner.Char))
	m2 = m2.__goscriptAssign(m1)
	m2.Any = $.structInterfaceValue(new pos(true, 1, 2), "main.pos", "main.pos")
	await $.println("other interface value:", (m1.Name === m2.Name && m1.F === m2.F && m1.OK === m2.OK && $.pointerEqual(m1.Ptr, m2.Ptr) && $.comparableEqual(m1.Any, m2.Any) && m1.Inner.Line === m2.Inner.Line && m1.Inner.Char === m2.Inner.Char))
	m2.Any = "text"
	await $.println("other interface type:", (m1.Name === m2.Name && m1.F === m2.F && m1.OK === m2.OK && $.pointerEqual(m1.Ptr, m2.Ptr) && $.comparableEqual(m1.Any, m2.Any) && m1.Inner.Line === m2.Inner.Line && m1.Inner.Char === m2.Inner.Char))
	m2 = m2.__goscriptAssign(m1)
	m2.F = math.NaN()
	let m3 = (m2).clone()
	await $.println("NaN:", (m2.Name === m3.Name && m2.F === m3.F && m2.OK === m3.OK && $.pointerEqual(m2.Ptr, m3.Ptr) && $.comparableEqual(m2.Any, m3.Any) && m2.Inner.Line === m3.Inner.Line && m2.Inner.Char === m3.Inner.Char), !(m2.Name === m3.Name && m2.F === m3.F && m2.OK === m3.OK && $.pointerEqual(m2.Ptr, m3.Ptr) && $.comparableEqual(m2.Any, m3.Any) && m2.Inner.Line === m3.Inner.Line && m2.Inner.Char === m3.Inner.Char))
	let __goscriptAssign0_0: number = math.Copysign(0, -1)
	let __goscriptAssign0_1: number = 0
	m2.F = __goscriptAssign0_0
	m3.F = __goscriptAssign0_1
	await $.println("zeros:", (m2.Name === m3.Name && m2.F === m3.F && m2.OK === m3.OK && $.pointerEqual(m2.Ptr, m3.Ptr) && $.comparableEqual(m2.Any, m3.Any) && m2.Inner.Line === m3.Inner.Line && m2.Inner.Char === m3.Inner.Char))

	// Comparisons of values in slices and maps.
	let regions = $.arrayToSlice<region>([(a).clone(), b])
	await $.println("slice:", $.structEqual($.arrayIndex(regions!, 0), a), $.structEqual($.arrayIndex(regions!, 1), a))
	let seen = $.makeMap<pos, boolean>([[new pos(true, 1, 2), true]])
	await $.println("map:", $.mapGet<pos, boolean, boolean>(seen, a.Start, false)[0], $.mapGet<pos, boolean, boolean>(seen, a.End, false)[0])

	// Arrays in structs.
	let w1 = new withArray(true, $.arrayValue([1, 2]))
	let w2 = new withArray(true, $.arrayValue([1, 2]))
	await $.println("array:", $.structEqual(w1, w2))
	w2.Vals[1] = 3
	await $.println("array differs:", $.structEqual(w1, w2))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
}

if ($.isMainScript(import.meta)) {
	await main()
}

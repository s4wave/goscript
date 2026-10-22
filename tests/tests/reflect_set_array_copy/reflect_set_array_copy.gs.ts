// Generated file based on reflect_set_array_copy.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export class Pose {
	public declare M: number[]

	public declare A: number[]

	public declare Inner: {"B": number[]}

	constructor(__goscriptValue?: boolean, M$?: number[], A$?: number[], Inner$?: {"B": number[]}) {
		this.M = M$ ?? $.arrayValue(globalThis.Array.from({ length: 4 }, () => 0), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 4))
		this.A = A$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0))
		this.Inner = Inner$ ?? $.anonymousStructValue({"B": $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0))}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("B", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2), [0], 0, true)] })
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Pose {
		return new Pose(true, $.cloneArrayValue(this.M, __goscriptStatic0()), $.cloneArrayValue(this.A, __goscriptStatic1()), $.markAsStructValue($.cloneStructValue(this.Inner)))
	}

	public __goscriptAssign(source: Pose): this {
		this.M = $.assignFieldValue(this.M, source.M, __goscriptStatic0())
		this.A = $.assignFieldValue(this.A, source.A, __goscriptStatic1())
		$.assignStruct(this.Inner, source.Inner)
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Pose",
		() => new Pose(),
		() => [],
		Pose,
		() => [/* @__PURE__ */ $.structField("M", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 4), [0], 0, true), /* @__PURE__ */ $.structField("A", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2), [1], 16, true), /* @__PURE__ */ $.structField("Inner", { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("B", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2), [0], 0, true)] }, [2], 32, true)]
	)
}

export async function main(): globalThis.Promise<void> {
	let a = $.varRef(new Pose(true, $.arrayValue([1, 2, 3, 4], __goscriptStatic0()), $.arrayValue([5, 6])))
	$.assignFieldValue(a.value.Inner.B, $.arrayValue([7, 8]), __goscriptStatic1())
	let b: $.VarRef<Pose> = $.varRef(new Pose(true))
	let c: $.VarRef<Pose> = $.varRef(new Pose(true))
	let d: $.VarRef<Pose> = $.varRef(new Pose(true))
	let av = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(a, "*main.Pose", /* @__PURE__ */ $.pointerType("main.Pose"))))).Elem()))

	// Set an array field from another array field.
	let bv = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(b, "*main.Pose", /* @__PURE__ */ $.pointerType("main.Pose"))))).Elem()))
	for (let i = 0; i < $.markAsStructValue($.cloneStructValue(av)).NumField(); i++) {
		$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(bv)).Field(i))).Set($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(av)).Field(i))))
	}

	// Set an array field from a converted array field.
	let cv = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(c, "*main.Pose", /* @__PURE__ */ $.pointerType("main.Pose"))))).Elem()))
	for (let i = 0; i < $.markAsStructValue($.cloneStructValue(av)).NumField(); i++) {
		$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(cv)).Field(i))).Set($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(av)).Field(i))).Convert($.pointerValueOrNil($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(cv)).Field(i))).Type())!))))
	}

	// Set a whole struct.
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(d, "*main.Pose", /* @__PURE__ */ $.pointerType("main.Pose"))))).Elem())).Set($.markAsStructValue($.cloneStructValue(av)))

	a.value.M[0] = 100
	a.value.A[0] = 200
	a.value.Inner.B[0] = 300
	await $.println("b:", b.value.M[0], b.value.A[0], b.value.Inner.B[0])
	await $.println("c:", c.value.M[0], c.value.A[0], c.value.Inner.B[0])
	await $.println("d:", d.value.M[0], d.value.A[0], d.value.Inner.B[0])

	b.value.M[1] = 9
	await $.println("c after b:", c.value.M[1], d.value.M[1], a.value.M[1])

	// Index of an array element set from an array.
	let arrs = $.varRef($.arrayValue(globalThis.Array.from({ length: 2 }, () => $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0))), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2), 2)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(arrs, "*[2][2]int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2), 2)))))).Elem())).Index(0))).Set($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(av)).Field(1))))
	a.value.A[1] = 400
	await $.println("arrs:", (arrs.value[0])[1])

	// Interface returns a copy of an array.
	let x = $.cloneArrayValue($.mustTypeAssert<number[]>($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(av)).Field(1))).Interface(), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2)), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
	a.value.A[1] = 500
	await $.println("interface:", x[1])
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 4))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("int"), 2))
}

if ($.isMainScript(import.meta)) {
	await main()
}

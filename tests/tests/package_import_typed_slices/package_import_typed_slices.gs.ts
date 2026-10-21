// Generated file based on package_import_typed_slices.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as binary from "@goscript/encoding/binary/index.js"
import * as json from "@goscript/encoding/json/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as math from "@goscript/math/index.js"
import * as reflect from "@goscript/reflect/index.js"
import * as slices from "@goscript/slices/index.js"
import * as sort from "@goscript/sort/index.js"
import type * as io from "@goscript/io/index.js"

export class mesh {
	public declare Pos: $.Slice<number>

	public declare Index: $.Slice<number>

	constructor(__goscriptValue?: boolean, Pos$?: $.Slice<number>, Index$?: $.Slice<number>) {
		this.Pos = Pos$ ?? (null! as $.Slice<number>)
		this.Index = Index$ ?? (null! as $.Slice<number>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): mesh {
		return new mesh(true, this.Pos, this.Index)
	}

	public __goscriptAssign(source: mesh): this {
		this.Pos = source.Pos
		this.Index = source.Index
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.mesh",
		() => new mesh(),
		() => [],
		mesh,
		() => [/* @__PURE__ */ $.structField("Pos", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32")), [0], 0, true), /* @__PURE__ */ $.structField("Index", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint32")), [1], 24, true)]
	)
}

export async function main(): globalThis.Promise<void> {
	// reflect reads and writes elements and grows typed slices.
	let f = $.typedSliceOf(Float32Array, [1.5, 2.5, 3.5]) as $.Slice<number>
	let v = $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(f, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32"))))))
	await $.println("reflect len:", $.markAsStructValue($.cloneStructValue(v)).Len(), $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Index(1))).Float(), (__goscriptAwait = $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(v)).Type()).String(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Index(0))).SetFloat(0.1)
	await $.println("reflect set:", $.arrayIndex(f!, 0) == 0.10000000149011612)
	let sv = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Slice(1, 3)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(sv)).Index(0))).SetFloat(9)
	await $.println("reflect slice:", $.arrayIndex(f!, 1), $.markAsStructValue($.cloneStructValue(sv)).Len())
	let made = $.markAsStructValue($.cloneStructValue(reflect.MakeSlice($.pointerValueOrNil(reflect.TypeOf($.interfaceValue(null, "[]int32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32")))))!, 2, 4)))
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(made)).Index(1))).SetInt(2147483648n)
	made = $.assignStruct(made, reflect.Append($.markAsStructValue($.cloneStructValue(made)), $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.basicInterfaceValue(-7, "int32"))))))
	made = $.assignStruct(made, reflect.AppendSlice($.markAsStructValue($.cloneStructValue(made)), $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.typedSliceOf(Int32Array, [8, 9]) as $.Slice<number>, "[]int32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32"))))))))
	let ints = $.mustTypeAssert<$.Slice<number>>($.markAsStructValue($.cloneStructValue(made)).Interface(), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32")))
	await $.println("reflect make:", $.sliceLen(ints), $.arrayIndex(ints!, 1), $.arrayIndex(ints!, 2), $.arrayIndex(ints!, 4))
	reflect.Copy($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(ints, "[]int32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32")))))), $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue($.typedSliceOf(Int32Array, [5]) as $.Slice<number>, "[]int32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32")))))))
	await $.println("reflect copy:", $.arrayIndex(ints!, 0))
	await $.println("deep equal:", reflect.DeepEqual($.interfaceValue(f, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32"))), $.interfaceValue($.typedSliceOf(Float32Array, [0.10000000149011612, 9, 3.5]) as $.Slice<number>, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32")))), reflect.DeepEqual($.interfaceValue($.typedSliceOf(Uint16Array, [1, 2]) as $.Slice<number>, "[]uint16", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint16"))), $.interfaceValue($.typedSliceOf(Uint16Array, [1, 3]) as $.Slice<number>, "[]uint16", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint16")))))
	let swap: ((i: number, j: number) => void) | null = reflect.Swapper($.interfaceValue(ints, "[]int32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32"))))
	swap!(0, 4)
	await $.println("swapper:", $.arrayIndex(ints!, 0), $.arrayIndex(ints!, 4))

	// encoding/binary round trips typed slices in both byte orders.
	let buf = $.varRef($.markAsStructValue(new bytes.Buffer()))
	{
		let err = await binary.Write($.pointerValueOrNil($.interfaceValue<io.Writer | null>(buf, "*bytes.Buffer", __goscriptStatic0()))!, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))), "binary.littleEndian", __goscriptStatic1())!, $.interfaceValue($.typedSliceOf(Float32Array, [1, -2.5, globalThis.Math.fround(math.Inf(1))]) as $.Slice<number>, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32"))))
		if (err != null) {
			await $.println("write error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		}
	}
	{
		let err = await binary.Write($.pointerValueOrNil($.interfaceValue<io.Writer | null>(buf, "*bytes.Buffer", __goscriptStatic0()))!, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.BigEndian))), "binary.bigEndian", __goscriptStatic2())!, $.interfaceValue($.typedSliceOf(Uint16Array, [0x1234, 0xffff]) as $.Slice<number>, "[]uint16", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint16"))))
		if (err != null) {
			await $.println("write error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		}
	}
	await $.println("binary bytes:", buf.value.Len(), (fmt.Sprintf("% x", $.interfaceValue($.goSlice(buf.value.Bytes(), 4, 8), "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")))) as string), (fmt.Sprintf("% x", $.interfaceValue($.goSlice(buf.value.Bytes(), 12, undefined), "[]byte", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")))) as string))
	let back = $.makeSlice<number>(3, undefined, "float32")
	let backU = $.makeSlice<number>(2, undefined, "uint16")
	{
		let err = await binary.Read($.pointerValueOrNil($.interfaceValue<io.Reader | null>(buf, "*bytes.Buffer", __goscriptStatic0()))!, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))), "binary.littleEndian", __goscriptStatic1())!, $.interfaceValue(back, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32"))))
		if (err != null) {
			await $.println("read error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		}
	}
	{
		let err = await binary.Read($.pointerValueOrNil($.interfaceValue<io.Reader | null>(buf, "*bytes.Buffer", __goscriptStatic0()))!, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.BigEndian))), "binary.bigEndian", __goscriptStatic2())!, $.interfaceValue(backU, "[]uint16", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint16"))))
		if (err != null) {
			await $.println("read error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
		}
	}
	await $.println("binary read:", $.arrayIndex(back!, 0), $.arrayIndex(back!, 1), math.IsInf($.arrayIndex(back!, 2), 1), $.arrayIndex(backU!, 0), $.arrayIndex(backU!, 1))
	let window = $.makeSlice<number>(4, undefined, "int32")
	let __goscriptTuple0: any = binary.Append(null, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))), "binary.littleEndian", __goscriptStatic1())!, $.interfaceValue($.typedSliceOf(Int32Array, [-1, 2]) as $.Slice<number>, "[]int32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32"))))
	let enc: $.Slice<number> = __goscriptTuple0[0]
	await binary.Read($.pointerValueOrNil($.interfaceValue<io.Reader | null>(bytes.NewReader(enc), "*bytes.Reader", __goscriptStatic3()))!, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))), "binary.littleEndian", __goscriptStatic1())!, $.interfaceValue($.goSlice(window, 1, 3), "[]int32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int32"))))
	await $.println("binary window:", $.arrayIndex(window!, 0), $.arrayIndex(window!, 1), $.arrayIndex(window!, 2), $.arrayIndex(window!, 3), $.sliceLen(enc))

	// sort and slices sort typed slices in place, also through windows.
	let fs = $.typedSliceOf(Float64Array, [3, math.NaN(), -1, 2]) as $.Slice<number>
	sort.Float64s(fs)
	await $.println("sort float64s:", math.IsNaN($.arrayIndex(fs!, 0)), $.arrayIndex(fs!, 1), $.arrayIndex(fs!, 2), $.arrayIndex(fs!, 3))
	let us = $.typedSliceOf(Uint32Array, [5, 1, 4, 2, 3]) as $.Slice<number>
	slices.Sort($.goSlice(us, 1, 4))
	await $.println("slices sort window:", $.arrayIndex(us!, 0), $.arrayIndex(us!, 1), $.arrayIndex(us!, 2), $.arrayIndex(us!, 3), $.arrayIndex(us!, 4))
	let _is = $.typedSliceOf(Int16Array, [3, -1, 2]) as $.Slice<number>
	sort.Slice($.interfaceValue(_is, "[]int16", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int16"))), $.functionValue((i: number, j: number): boolean => {
		return $.arrayIndex(_is!, i) < $.arrayIndex(_is!, j)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)))
	await $.println("sort slice:", $.arrayIndex(_is!, 0), $.arrayIndex(_is!, 1), $.arrayIndex(_is!, 2))
	let cl: $.Slice<number> = (slices.Clone(us) as $.Slice<number>)
	$.sliceElems(cl!)[$.sliceSlot(cl!, 0)] = 50
	await $.println("clone:", $.arrayIndex(us!, 0), $.arrayIndex(cl!, 0), $.sliceLen(cl), slices.Index(cl, 4), slices.Contains(cl, 3), slices.Max(cl))
	cl = (slices.Insert(cl, 1, 7, 8) as $.Slice<number>)
	cl = (slices.Delete(cl, 0, 1, () => (0 as number)) as $.Slice<number>)
	await $.println("insert delete:", $.sliceLen(cl), $.arrayIndex(cl!, 0), $.arrayIndex(cl!, 1), $.arrayIndex(cl!, 2))
	slices.Reverse(cl)
	await $.println("reverse:", $.arrayIndex(cl!, 0), slices.Equal(cl, $.typedSliceOf(Uint32Array, [3, 4, 2, 8, 7]) as $.Slice<number>))

	// fmt formats typed slices element by element.
	await $.println("fmt:", (fmt.Sprint($.interfaceValue(f, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32"))), $.interfaceValue($.typedSliceOf(Int8Array, [-1, 2]) as $.Slice<number>, "[]int8", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int8"))), $.interfaceValue($.typedSliceOf(Uint32Array, [7]) as $.Slice<number>, "[]uint32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint32"))), $.interfaceValue($.typedSliceOf(Float64Array, [0.5, 2]) as $.Slice<number>, "[]float64", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float64")))) as string))
	await $.println("fmt verbs:", (fmt.Sprintf("%v %.2f %d %x", $.interfaceValue($.typedSliceOf(Float32Array, [0.10000000149011612, 1.25]) as $.Slice<number>, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32"))), $.interfaceValue($.typedSliceOf(Float64Array, [1, 2.5]) as $.Slice<number>, "[]float64", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float64"))), $.interfaceValue($.typedSliceOf(Int16Array, [-3, 4]) as $.Slice<number>, "[]int16", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int16"))), $.interfaceValue($.typedSliceOf(Uint16Array, [255, 16]) as $.Slice<number>, "[]uint16", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint16")))) as string))

	// encoding/json marshals and unmarshals typed slices.
	let m = new mesh(true, $.typedSliceOf(Float32Array, [0.5, 1, -2.5]) as $.Slice<number>, $.typedSliceOf(Uint32Array, [0, 1, 4294967295]) as $.Slice<number>)
	let __goscriptTuple1: any = (json.Marshal($.structInterfaceValue((m).clone(), "main.mesh", "main.mesh")) as [$.Slice<number>, $.GoError])
	let data: $.Slice<number> = __goscriptTuple1[0]
	let err: $.GoError = __goscriptTuple1[1]
	await $.println("json:", $.bytesToString(data), err == null)
	let m2: $.VarRef<mesh> = $.varRef(new mesh(true))
	err = (json.Unmarshal(data, $.interfaceValue(m2, "*main.mesh", /* @__PURE__ */ $.pointerType("main.mesh"))) as $.GoError)
	await $.println("json back:", err == null, $.sliceLen(m2.value.Pos), $.arrayIndex(m2.value.Pos!, 0), $.arrayIndex(m2.value.Index!, 2))
	let fs32: $.VarRef<$.Slice<number>> = $.varRef(null! as $.Slice<number>)
	err = (json.Unmarshal(new Uint8Array([91, 48, 46, 49, 44, 32, 51, 93]), $.interfaceValue(fs32, "*[]float32", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32"))))) as $.GoError)
	await $.println("json float32:", err == null, $.arrayIndex(fs32.value!, 0) == 0.10000000149011612, $.arrayIndex(fs32.value!, 1))
	m2.value.Pos = $.appendOne(m2.value.Pos, 4, $.typedSliceHints.float32)
	await $.println("json append:", $.sliceLen(m2.value.Pos), $.arrayIndex(m2.value.Pos!, 3), reflect.DeepEqual($.interfaceValue(m.Index, "[]uint32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint32"))), $.interfaceValue(m2.value.Index, "[]uint32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint32")))))

	// A slice grown by appends has spare capacity, which leaves it a window
	// on its backing array, and is used as any other.
	let grown: $.Slice<number> = null! as $.Slice<number>
	for (let i = 0; i < 5; i++) {
		grown = $.appendOne(grown, globalThis.Math.fround(globalThis.Math.fround(i) + 0.5), $.typedSliceHints.float32)
	}
	let __goscriptTuple2: any = (json.Marshal($.interfaceValue(grown, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32")))) as [$.Slice<number>, $.GoError])
	let gdata: $.Slice<number> = __goscriptTuple2[0]
	let gbuf = $.varRef($.markAsStructValue(new bytes.Buffer()))
	await binary.Write($.pointerValueOrNil($.interfaceValue<io.Writer | null>(gbuf, "*bytes.Buffer", __goscriptStatic0()))!, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))), "binary.littleEndian", __goscriptStatic1())!, $.interfaceValue(grown, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32"))))
	await $.println("grown:", $.sliceLen(grown), $.cap(grown) > $.sliceLen(grown), (fmt.Sprint($.interfaceValue(grown, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32")))) as string), $.bytesToString(gdata), gbuf.value.Len())
	await $.println("grown reflect:", reflect.DeepEqual($.interfaceValue(grown, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32"))), $.interfaceValue($.typedSliceOf(Float32Array, [0.5, 1.5, 2.5, 3.5, 4.5]) as $.Slice<number>, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32")))), $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(grown, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32")))))).Index(4))).Float())
	sort.Slice($.interfaceValue(grown, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32"))), $.functionValue((i: number, j: number): boolean => {
		return $.arrayIndex(grown!, i) > $.arrayIndex(grown!, j)
	}, ({ kind: $.TypeKind.Function, params: [/* @__PURE__ */ $.basicType("int"), /* @__PURE__ */ $.basicType("int")], results: [/* @__PURE__ */ $.basicType("bool")] } as $.FunctionTypeInfo)))
	let gc = (slices.Clone(grown) as $.Slice<number>)
	await $.println("grown sort:", $.arrayIndex(grown!, 0), $.arrayIndex(grown!, 4), $.arrayIndex(gc!, 0), $.sliceLen(gc))
	let anyGrown: any = $.interfaceValue($.goSlice(grown, 1, undefined), "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32")))
	let [, isF] = $.typeAssertTuple<$.Slice<number>>(anyGrown, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32")))
	let [, isU] = $.typeAssertTuple<$.Slice<number>>(anyGrown, /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint32")))
	await $.println("grown assert:", isF, isU)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("bytes.Buffer"), "bytes.Buffer", () => [$.methodSignature("Available", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("AvailableBuffer", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Bytes", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Cap", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Grow", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Next", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Peek", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"], true), $.methodSignature("Read", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadBytes", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["err", "error"]], true), $.methodSignature("ReadFrom", [["r", "io.Reader"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true), $.methodSignature("ReadRune", [], [["r", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadString", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.basicType("string")], ["err", "error"]], true), $.methodSignature("Reset", [], [], true), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Truncate", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("Write", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteByte", [["c", /* @__PURE__ */ $.basicType("uint8")]], ["error"], true), $.methodSignature("WriteRune", [["r", /* @__PURE__ */ $.basicType("int32")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteString", [["s", /* @__PURE__ */ $.basicType("string")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ($.overrideTypeMethods("binary.littleEndian", "binary.littleEndian", () => [$.methodSignature("AppendUint16", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint16")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("AppendUint32", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint32")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("AppendUint64", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint64")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("GoString", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("PutUint16", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint16")]]), $.methodSignature("PutUint32", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint32")]]), $.methodSignature("PutUint64", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint64")]]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Uint16", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("uint16")]), $.methodSignature("Uint32", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("uint32")]), $.methodSignature("Uint64", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("uint64")])]))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ($.overrideTypeMethods("binary.bigEndian", "binary.bigEndian", () => [$.methodSignature("AppendUint16", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint16")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("AppendUint32", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint32")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("AppendUint64", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint64")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("GoString", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("PutUint16", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint16")]]), $.methodSignature("PutUint32", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint32")]]), $.methodSignature("PutUint64", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint64")]]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Uint16", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("uint16")]), $.methodSignature("Uint32", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("uint32")]), $.methodSignature("Uint64", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("uint64")])]))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("bytes.Reader"), "bytes.Reader", () => [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Read", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadAt", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["off", /* @__PURE__ */ $.basicType("int64")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadRune", [], [["ch", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("Reset", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [], true), $.methodSignature("Seek", [["offset", /* @__PURE__ */ $.basicType("int64")], ["whence", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int64"), "error"], true), $.methodSignature("Size", [], [/* @__PURE__ */ $.basicType("int64")], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

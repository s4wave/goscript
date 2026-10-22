// Generated file based on binary_struct_pointer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as binary from "@goscript/encoding/binary/index.js"
import type * as io from "@goscript/io/index.js"

export class inner {
	public declare A: number

	public declare B: Uint8Array

	constructor(__goscriptValue?: boolean, A$?: number, B$?: Uint8Array) {
		this.A = A$ ?? 0
		this.B = B$ ?? $.arrayValue(new Uint8Array(2))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): inner {
		return new inner(true, this.A, $.cloneArrayValue(this.B, __goscriptStatic0()))
	}

	public __goscriptAssign(source: inner): this {
		this.A = source.A
		this.B = $.assignFieldValue(this.B, source.B, __goscriptStatic0())
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.inner",
		() => new inner(),
		() => [],
		inner,
		() => [{ name: "A", key: "A", type: /* @__PURE__ */ $.basicType("uint16") }, { name: "B", key: "B", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2) }]
	)
}

export class vec4 {
	public declare X: number

	public declare Y: number

	public declare Z: number

	public declare W: number

	constructor(__goscriptValue?: boolean, X$?: number, Y$?: number, Z$?: number, W$?: number) {
		this.X = X$ ?? 0
		this.Y = Y$ ?? 0
		this.Z = Z$ ?? 0
		this.W = W$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): vec4 {
		return new vec4(true, this.X, this.Y, this.Z, this.W)
	}

	public __goscriptAssign(source: vec4): this {
		this.X = source.X
		this.Y = source.Y
		this.Z = source.Z
		this.W = source.W
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.vec4",
		() => new vec4(),
		() => [],
		vec4,
		() => [{ name: "X", key: "X", type: /* @__PURE__ */ $.basicType("float32") }, { name: "Y", key: "Y", type: /* @__PURE__ */ $.basicType("float32") }, { name: "Z", key: "Z", type: /* @__PURE__ */ $.basicType("float32") }, { name: "W", key: "W", type: /* @__PURE__ */ $.basicType("float32") }]
	)
}

export class item {
	public declare Matrix: number[]

	public declare Colors: vec4[]

	public declare Index: number

	public declare Flags: number

	public declare _blank4: number[]

	constructor(__goscriptValue?: boolean, Matrix$?: number[], Colors$?: vec4[], Index$?: number, Flags$?: number, _blank4$?: number[]) {
		this.Matrix = Matrix$ ?? $.arrayValue(globalThis.Array.from({ length: 4 }, () => 0), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 4))
		this.Colors = Colors$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => new vec4(true)), /* @__PURE__ */ $.arrayType("main.vec4", 2))
		this.Index = Index$ ?? 0
		this.Flags = Flags$ ?? 0
		this._blank4 = _blank4$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 2))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): item {
		return new item(true, $.cloneArrayValue(this.Matrix, __goscriptStatic1()), $.cloneArrayValue(this.Colors, __goscriptStatic2()), this.Index, this.Flags, $.cloneArrayValue(this._blank4, __goscriptStatic3()))
	}

	public __goscriptAssign(source: item): this {
		this.Matrix = $.assignFieldValue(this.Matrix, source.Matrix, __goscriptStatic1())
		this.Colors = $.assignFieldValue(this.Colors, source.Colors, __goscriptStatic2())
		this.Index = source.Index
		this.Flags = source.Flags
		this._blank4 = $.assignFieldValue(this._blank4, source._blank4, __goscriptStatic3())
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.item",
		() => new item(),
		() => [],
		item,
		() => [{ name: "Matrix", key: "Matrix", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 4) }, { name: "Colors", key: "Colors", type: /* @__PURE__ */ $.arrayType("main.vec4", 2) }, { name: "Index", key: "Index", type: /* @__PURE__ */ $.basicType("int32") }, { name: "Flags", key: "Flags", type: /* @__PURE__ */ $.basicType("uint32") }, { name: "_", key: "_blank4", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 2) }]
	)
}

export class header {
	public declare Sig: Uint8Array

	public declare Size: number

	public declare Res: number[]

	public declare In: inner

	public declare Width: number

	constructor(__goscriptValue?: boolean, Sig$?: Uint8Array, Size$?: number, Res$?: number[], In$?: inner, Width$?: number) {
		this.Sig = Sig$ ?? $.arrayValue(new Uint8Array(2))
		this.Size = Size$ ?? 0
		this.Res = Res$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0))
		this.In = In$ ?? new inner(true)
		this.Width = Width$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): header {
		return new header(true, $.cloneArrayValue(this.Sig, __goscriptStatic0()), this.Size, $.cloneArrayValue(this.Res, __goscriptStatic4()), this.In.clone(), this.Width)
	}

	public __goscriptAssign(source: header): this {
		this.Sig = $.assignFieldValue(this.Sig, source.Sig, __goscriptStatic0())
		this.Size = source.Size
		this.Res = $.assignFieldValue(this.Res, source.Res, __goscriptStatic4())
		this.In.__goscriptAssign(source.In)
		this.Width = source.Width
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.header",
		() => new header(),
		() => [],
		header,
		() => [{ name: "Sig", key: "Sig", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2) }, { name: "Size", key: "Size", type: /* @__PURE__ */ $.basicType("uint32") }, { name: "Res", key: "Res", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint16"), 2) }, { name: "In", key: "In", type: "main.inner" }, { name: "Width", key: "Width", type: /* @__PURE__ */ $.basicType("int32") }]
	)
}

export async function main(): globalThis.Promise<void> {
	// A pointer to a struct is written field by field, as image/bmp does.
	let h = new header(false, $.arrayValue(new Uint8Array([66, 77])), 70, $.arrayValue([1, 2]), new inner(true, 0x0102, $.arrayValue(new Uint8Array([3, 4]))), -5)
	let buf = $.varRef($.markAsStructValue(new bytes.Buffer()))
	{
		let err = await binary.Write($.pointerValueOrNil($.interfaceValue<io.Writer | null>(buf, "*bytes.Buffer", __goscriptStatic5()))!, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))), "binary.littleEndian", __goscriptStatic6())!, $.interfaceValue(h, "*main.header", /* @__PURE__ */ $.pointerType("main.header")))
		if (err != null) {
			await $.println("write error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			return
		}
	}
	await $.println("size:", binary.Size($.interfaceValue(h, "*main.header", /* @__PURE__ */ $.pointerType("main.header"))), "written:", buf.value.Len())
	await $.println("bytes:", $.uint($.arrayIndex(buf.value.Bytes()!, 0), 8), $.uint($.arrayIndex(buf.value.Bytes()!, 1), 8), $.uint($.arrayIndex(buf.value.Bytes()!, 2), 8), $.uint($.arrayIndex(buf.value.Bytes()!, 10), 8), $.uint($.arrayIndex(buf.value.Bytes()!, 12), 8))

	// Reading into a pointer to a struct fills its fields.
	let r: $.VarRef<header> = $.varRef(new header(true))
	{
		let err = await binary.Read($.pointerValueOrNil($.interfaceValue<io.Reader | null>(bytes.NewReader(buf.value.Bytes()), "*bytes.Reader", __goscriptStatic7()))!, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))), "binary.littleEndian", __goscriptStatic6())!, $.interfaceValue(r, "*main.header", /* @__PURE__ */ $.pointerType("main.header")))
		if (err != null) {
			await $.println("read error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
			return
		}
	}
	await $.println("read:", $.bytesToString($.goSlice(r.value.Sig, undefined, undefined)), r.value.Size, r.value.Res[1], r.value.In.A, r.value.In.B[1], r.value.Width)

	// A slice of structs is written and read as its elements, a blank field
	// as zeros.
	let objs = $.makeSlice<item>(3, undefined, undefined, () => new item(true))
	for (let __goscriptRangeTarget0 = objs, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), i = 0; i < __goscriptRangeWindow0.length; i++) {
		;((__goscriptRangeWindow0.backing as any[])[__goscriptRangeWindow0.offset + i] as item).Matrix[3] = globalThis.Math.fround(globalThis.Math.fround(i) + 0.5);
		;(((__goscriptRangeWindow0.backing as any[])[__goscriptRangeWindow0.offset + i] as item).Colors)[1].Y = globalThis.Math.fround(-i);
		;((__goscriptRangeWindow0.backing as any[])[__goscriptRangeWindow0.offset + i] as item).Index = $.int(-i, 32);
		;((__goscriptRangeWindow0.backing as any[])[__goscriptRangeWindow0.offset + i] as item).Flags = $.uint(7 * i, 32)
	}
	let ob = $.makeSlice<number>(binary.Size($.interfaceValue(objs, "[]main.item", /* @__PURE__ */ $.sliceType("main.item"))) + 1, undefined, "byte")
	$.sliceElems(ob!)[$.sliceSlot(ob!, $.sliceLen(ob) - 1)] = 9
	let [n, err] = binary.Encode(ob, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))), "binary.littleEndian", __goscriptStatic6())!, $.interfaceValue($.goSlice(objs, 1, undefined), "[]main.item", /* @__PURE__ */ $.sliceType("main.item")))
	await $.println("objects:", binary.Size($.interfaceValue(objs, "[]main.item", /* @__PURE__ */ $.sliceType("main.item"))), n, err == null, $.arrayIndex(ob!, 12), $.arrayIndex(ob!, 13), $.arrayIndex(ob!, 14), $.arrayIndex(ob!, 15), $.arrayIndex(ob!, 48), $.arrayIndex(ob!, 52), $.arrayIndex(ob!, 64), $.arrayIndex(ob!, $.sliceLen(ob) - 1))
	let back = $.makeSlice<item>(2, undefined, undefined, () => new item(true))
	let __goscriptTuple0: any = binary.Decode(ob, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))), "binary.littleEndian", __goscriptStatic6())!, $.interfaceValue(back, "[]main.item", /* @__PURE__ */ $.sliceType("main.item")))
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	await $.println("decoded:", n, err == null, $.structEqual($.arrayIndex(back!, 0), $.arrayIndex(objs!, 1)), $.structEqual($.arrayIndex(back!, 1), $.arrayIndex(objs!, 2)), ($.arrayIndex(back!, 1).Colors)[1].Y, $.arrayIndex(back!, 1).Index)

	// Big-endian order and arrays of structs work the same way.
	let __goscriptTuple1: any = binary.Append(null, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.BigEndian))), "binary.bigEndian", __goscriptStatic8())!, $.interfaceValue($.goSlice(objs, 2, undefined), "[]main.item", /* @__PURE__ */ $.sliceType("main.item")))
	let be: $.Slice<number> = __goscriptTuple1[0]
	let arr: vec4[] = $.arrayValue(globalThis.Array.from({ length: 2 }, () => new vec4(true)), /* @__PURE__ */ $.arrayType("main.vec4", 2))
	arr[1].W = 3
	let __goscriptTuple2: any = binary.Append(null, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))), "binary.littleEndian", __goscriptStatic6())!, $.interfaceValue(arr, "[2]main.vec4", /* @__PURE__ */ $.arrayType("main.vec4", 2)))
	let ab: $.Slice<number> = __goscriptTuple2[0]
	let arr2: $.VarRef<vec4[]> = $.varRef($.arrayValue(globalThis.Array.from({ length: 2 }, () => new vec4(true)), /* @__PURE__ */ $.arrayType("main.vec4", 2)))
	let __goscriptTuple3: any = binary.Decode(ab, $.structInterfaceValue<binary.ByteOrder | null>($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))), "binary.littleEndian", __goscriptStatic6())!, $.interfaceValue(arr2, "*[2]main.vec4", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.arrayType("main.vec4", 2))))
	err = __goscriptTuple3[1]
	await $.println("big-endian:", $.sliceLen(be), $.arrayIndex(be!, 12), $.arrayIndex(be!, 13), "array:", $.sliceLen(ab), err == null, arr2.value[1].W)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 4))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (/* @__PURE__ */ $.arrayType("main.vec4", 2))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 2))
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint16"), 2))
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("bytes.Buffer"), "bytes.Buffer", () => [$.methodSignature("Available", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("AvailableBuffer", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Bytes", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Cap", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Grow", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Next", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Peek", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"], true), $.methodSignature("Read", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadBytes", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["err", "error"]], true), $.methodSignature("ReadFrom", [["r", "io.Reader"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true), $.methodSignature("ReadRune", [], [["r", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadString", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.basicType("string")], ["err", "error"]], true), $.methodSignature("Reset", [], [], true), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Truncate", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("Write", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteByte", [["c", /* @__PURE__ */ $.basicType("uint8")]], ["error"], true), $.methodSignature("WriteRune", [["r", /* @__PURE__ */ $.basicType("int32")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteString", [["s", /* @__PURE__ */ $.basicType("string")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ($.overrideTypeMethods("binary.littleEndian", "binary.littleEndian", () => [$.methodSignature("AppendUint16", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint16")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("AppendUint32", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint32")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("AppendUint64", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint64")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("GoString", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("PutUint16", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint16")]]), $.methodSignature("PutUint32", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint32")]]), $.methodSignature("PutUint64", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint64")]]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Uint16", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("uint16")]), $.methodSignature("Uint32", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("uint32")]), $.methodSignature("Uint64", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("uint64")])]))
}

var __goscriptStatic7$value: any
function __goscriptStatic7(): any {
	return __goscriptStatic7$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("bytes.Reader"), "bytes.Reader", () => [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Read", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadAt", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["off", /* @__PURE__ */ $.basicType("int64")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadRune", [], [["ch", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("Reset", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [], true), $.methodSignature("Seek", [["offset", /* @__PURE__ */ $.basicType("int64")], ["whence", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int64"), "error"], true), $.methodSignature("Size", [], [/* @__PURE__ */ $.basicType("int64")], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

var __goscriptStatic8$value: any
function __goscriptStatic8(): any {
	return __goscriptStatic8$value ??= ($.overrideTypeMethods("binary.bigEndian", "binary.bigEndian", () => [$.methodSignature("AppendUint16", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint16")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("AppendUint32", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint32")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("AppendUint64", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint64")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]), $.methodSignature("GoString", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("PutUint16", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint16")]]), $.methodSignature("PutUint32", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint32")]]), $.methodSignature("PutUint64", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["v", /* @__PURE__ */ $.basicType("uint64")]]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("Uint16", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("uint16")]), $.methodSignature("Uint32", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("uint32")]), $.methodSignature("Uint64", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [/* @__PURE__ */ $.basicType("uint64")])]))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

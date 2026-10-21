// Generated file based on float32_rounding.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as json from "@goscript/encoding/json/index.js"
import * as fmt from "@goscript/fmt/index.js"
import * as strconv from "@goscript/strconv/index.js"
import type * as io from "@goscript/io/index.js"

export class T {
	public declare A: string

	public declare B: number

	constructor(__goscriptValue?: boolean, A$?: string, B$?: number) {
		this.A = A$ ?? ""
		this.B = B$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): T {
		return new T(true, this.A, this.B)
	}

	public __goscriptAssign(source: T): this {
		this.A = source.A
		this.B = source.B
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.T",
		() => new T(),
		() => [],
		T,
		() => [{ name: "A", key: "A", type: /* @__PURE__ */ $.basicType("string") }, { name: "B", key: "B", type: /* @__PURE__ */ $.basicType("float32") }]
	)
}

export const c32: number = 0.10000000149011612

export async function main(): globalThis.Promise<void> {
	let sum32 = 0
	let sum64 = 0
	for (let __rangeIndex = 0; __rangeIndex < 10; __rangeIndex++) {
		sum32 = globalThis.Math.fround(sum32 + (0.10000000149011612))
		sum64 += 0.1
	}
	fmt.Println("sum32:", $.basicInterfaceValue(sum32, "float64"))
	fmt.Println("sum64:", $.basicInterfaceValue(sum64, "float64"))

	let onePointOne32 = 1.100000023841858
	fmt.Println("widened32:", $.basicInterfaceValue(onePointOne32, "float64"))

	let max32 = 3.4028234663852886e+38
	let overflow32 = globalThis.Math.fround(max32 * 2)
	let finite64 = max32 * 2
	fmt.Println("overflow32:", $.basicInterfaceValue(overflow32, "float64"))
	fmt.Println("finite64:", $.basicInterfaceValue(finite64, "float64"))

	// constants are rounded to float32 like computed values
	let f = 3.140000104904175
	let [g, ] = strconv.ParseFloat("3.14", 32)
	let h = globalThis.Math.fround(g)
	fmt.Println(f == h, 0.10000000149011612 == globalThis.Math.fround((g / 31.4)), $.basicInterfaceValue(0.10000000149011612, "float32"))
	let s = $.varRef(new T(true, "aaa", 3.140000104904175))
	let t = new T(true, "aaa", h)
	fmt.Println((s.value.A === t.A && s.value.B === t.B), $.structInterfaceValue((s.value).clone(), "main.T", "main.T"), $.structInterfaceValue((t).clone(), "main.T", "main.T"))

	// float32 values format with the digits needed at 32 bits
	fmt.Println($.basicInterfaceValue(f, "float32"), $.basicInterfaceValue(h, "float32"), $.basicInterfaceValue(f, "float64"))
	fmt.Printf("%v %g %.3f %f %e %G\n", $.basicInterfaceValue(f, "float32"), $.basicInterfaceValue(f, "float32"), $.basicInterfaceValue(f, "float32"), $.basicInterfaceValue(f, "float32"), $.basicInterfaceValue(f, "float32"), $.basicInterfaceValue(f, "float32"))
	fmt.Println(strconv.FormatFloat(f, 103, -1, 32), strconv.FormatFloat(f, 103, -1, 64))
	fmt.Println(strconv.FormatFloat(f, 98, -1, 32), strconv.FormatFloat(2.5, 98, -1, 64))
	let x = 0.10000000149011612
	let y = 0.20000000298023224
	let z = globalThis.Math.fround(x + y)
	fmt.Println($.basicInterfaceValue(z, "float32"), z == 0.30000001192092896, $.basicInterfaceValue(z, "float64"))
	let d = 0.1
	let e = globalThis.Math.fround(d)
	fmt.Println($.basicInterfaceValue(e, "float32"), $.basicInterfaceValue(e, "float64"))
	let m = globalThis.Math.fround(f * 3)
	fmt.Println($.basicInterfaceValue(m, "float32"), $.basicInterfaceValue(globalThis.Math.fround(m / 7), "float32"))
	fmt.Printf("%v %v\n", $.interfaceValue($.typedSliceOf(Float32Array, [1.100000023841858, 2.200000047683716]) as $.Slice<number>, "[]float32", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("float32"))), $.interfaceValue($.arrayValue([3.299999952316284, 4.400000095367432], /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 2)), "[2]float32", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("float32"), 2)))

	// float64 values use Go's %v format
	fmt.Println($.basicInterfaceValue(1e6, "float64"), $.basicInterfaceValue(123456.0, "float64"), $.basicInterfaceValue(0.00001, "float64"), $.basicInterfaceValue(2.5, "float64"))
	fmt.Printf("%v %f %.2e %g\n", $.basicInterfaceValue(1e21, "float64"), $.basicInterfaceValue(1.5, "float64"), $.basicInterfaceValue(1234.5678, "float64"), $.basicInterfaceValue(100.0, "float64"))
	fmt.Printf("%.2f %.0f %.0g %.1e\n", $.basicInterfaceValue(1.125, "float64"), $.basicInterfaceValue(2.5, "float64"), $.basicInterfaceValue(1.0, "float64"), $.basicInterfaceValue(2.25, "float64"))

	// float32 fields decoded from JSON are rounded to float32
	let __goscriptTuple0: any = (json.Marshal($.structInterfaceValue((s.value).clone(), "main.T", "main.T")) as [$.Slice<number>, $.GoError])
	let b: $.Slice<number> = __goscriptTuple0[0]
	let j: $.VarRef<T> = $.varRef(new T(true))
	let err: $.GoError = (json.Unmarshal(b, $.interfaceValue(j, "*main.T", /* @__PURE__ */ $.pointerType("main.T"))) as $.GoError)
	fmt.Println($.bytesToString(b), (j.value.A === s.value.A && j.value.B === s.value.B), $.structInterfaceValue((j.value).clone(), "main.T", "main.T"), (err as any))
	let buf = $.varRef($.markAsStructValue(new bytes.Buffer()))
	let enc = json.NewEncoder($.pointerValueOrNil($.interfaceValue<io.Writer | null>(buf, "*bytes.Buffer", __goscriptStatic0()))!)
	void (enc !== null && (enc as any).__isVarRef !== true && (enc as any).__goValue === undefined ? ((enc as any) as json.Encoder).SetIndent("", "\t") : json.Encoder.prototype.SetIndent.call($.pointerValue<json.Encoder>(enc), "", "\t"))
	err = await (enc !== null && (enc as any).__isVarRef !== true && (enc as any).__goValue === undefined ? ((enc as any) as json.Encoder).Encode($.interfaceValue(s, "*main.T", /* @__PURE__ */ $.pointerType("main.T"))) : json.Encoder.prototype.Encode.call($.pointerValue<json.Encoder>(enc), $.interfaceValue(s, "*main.T", /* @__PURE__ */ $.pointerType("main.T"))))
	let k: $.VarRef<T> = $.varRef(new T(true))
	let err2 = await json.Decoder.prototype.Decode.call($.pointerValue<json.Decoder>(json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(bytes.NewReader(buf.value.Bytes()), "*bytes.Reader", __goscriptStatic1()))!)), $.interfaceValue(k, "*main.T", /* @__PURE__ */ $.pointerType("main.T")))
	fmt.Println(buf.value.Len() > 0, (k.value.A === s.value.A && k.value.B === s.value.B), $.structInterfaceValue((k.value).clone(), "main.T", "main.T"), (err as any), (err2 as any))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("bytes.Buffer"), "bytes.Buffer", () => [$.methodSignature("Available", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("AvailableBuffer", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Bytes", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Cap", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Grow", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Next", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Peek", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"], true), $.methodSignature("Read", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadBytes", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["err", "error"]], true), $.methodSignature("ReadFrom", [["r", "io.Reader"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true), $.methodSignature("ReadRune", [], [["r", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadString", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.basicType("string")], ["err", "error"]], true), $.methodSignature("Reset", [], [], true), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Truncate", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("Write", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteByte", [["c", /* @__PURE__ */ $.basicType("uint8")]], ["error"], true), $.methodSignature("WriteRune", [["r", /* @__PURE__ */ $.basicType("int32")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteString", [["s", /* @__PURE__ */ $.basicType("string")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("bytes.Reader"), "bytes.Reader", () => [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Read", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadAt", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["off", /* @__PURE__ */ $.basicType("int64")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadRune", [], [["ch", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("Reset", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [], true), $.methodSignature("Seek", [["offset", /* @__PURE__ */ $.basicType("int64")], ["whence", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int64"), "error"], true), $.methodSignature("Size", [], [/* @__PURE__ */ $.basicType("int64")], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

if ($.isMainScript(import.meta)) {
	await main()
}

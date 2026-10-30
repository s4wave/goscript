// Generated file based on package_import_encoding_json_go127.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as bytes from "@goscript/bytes/index.js"
import * as json from "@goscript/encoding/json/index.js"
import * as jsontext from "@goscript/encoding/json/jsontext/index.js"
import * as jsonv2 from "@goscript/encoding/json/v2/index.js"
import * as io from "@goscript/io/index.js"
import * as slices from "@goscript/slices/index.js"
import * as strings from "@goscript/strings/index.js"
import * as jsonopts from "@goscript/encoding/json/internal/jsonopts/index.js"
import "@goscript/io/index.js"
import "@goscript/encoding/json/internal/jsonopts/index.js"

export class point {
	public declare x: bigint

	public declare y: bigint

	constructor(__goscriptValue?: boolean, x$?: bigint, y$?: bigint) {
		this.x = x$ ?? 0n
		this.y = y$ ?? 0n
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): point {
		return new point(true, this.x, this.y)
	}

	public __goscriptAssign(source: point): this {
		this.x = source.x
		this.y = source.y
		return this
	}

	public async MarshalJSONTo(enc: jsontext.Encoder | $.VarRef<jsontext.Encoder> | null): globalThis.Promise<$.GoError> {
		const p = this;
		{
			let err = await (enc !== null && (enc as any).__isVarRef !== true && (enc as any).__goValue === undefined ? ((enc as any) as jsontext.Encoder).WriteToken(($.pointerValue<jsontext.Token>(jsontext.__goscript_get_BeginArray())).clone()) : jsontext.Encoder.prototype.WriteToken.call(enc, ($.pointerValue<jsontext.Token>(jsontext.__goscript_get_BeginArray())).clone()))
			if (err != null) {
				return err
			}
		}
		{
			let err = await (enc !== null && (enc as any).__isVarRef !== true && (enc as any).__goValue === undefined ? ((enc as any) as jsontext.Encoder).WriteToken(jsontext.Int(p.x)) : jsontext.Encoder.prototype.WriteToken.call(enc, jsontext.Int(p.x)))
			if (err != null) {
				return err
			}
		}
		{
			let err = await (enc !== null && (enc as any).__isVarRef !== true && (enc as any).__goValue === undefined ? ((enc as any) as jsontext.Encoder).WriteToken(jsontext.Int(p.y)) : jsontext.Encoder.prototype.WriteToken.call(enc, jsontext.Int(p.y)))
			if (err != null) {
				return err
			}
		}
		return (enc !== null && (enc as any).__isVarRef !== true && (enc as any).__goValue === undefined ? ((enc as any) as jsontext.Encoder).WriteToken(($.pointerValue<jsontext.Token>(jsontext.__goscript_get_EndArray())).clone()) : jsontext.Encoder.prototype.WriteToken.call(enc, ($.pointerValue<jsontext.Token>(jsontext.__goscript_get_EndArray())).clone()))
	}

	public async UnmarshalJSONFrom(dec: jsontext.Decoder | $.VarRef<jsontext.Decoder> | null): globalThis.Promise<$.GoError> {
		const p: point | $.VarRef<point> | null = this;
		const p$: point = p == null ? $.pointerTarget<point>(p) : (p as any).__isVarRef === true ? (p as any).value : (p as any).__goValue === undefined ? (p as any) : $.pointerTarget<point>(p)
		let xy: $.VarRef<$.Slice<bigint>> = $.varRef(null! as $.Slice<bigint>)
		{
			let err = await jsonv2.UnmarshalDecode(dec, $.interfaceValue(xy, "*[]int64", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int64")))), null)
			if (err != null) {
				return err
			}
		}
		if ($.sliceLen(xy.value) != 2) {
			return io.ErrUnexpectedEOF
		}
		let __goscriptAssign0_0: bigint = $.plainSliceIndex(xy.value!, 0)
		let __goscriptAssign0_1: bigint = $.plainSliceIndex(xy.value!, 1);
		;(p$ as point).x = __goscriptAssign0_0;
		;(p$ as point).y = __goscriptAssign0_1
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.point",
		() => new point(),
		() => [$.methodSignature("MarshalJSONTo", [["enc", /* @__PURE__ */ $.pointerType("jsontext.Encoder")]], ["error"]), $.methodSignature("UnmarshalJSONFrom", [["dec", /* @__PURE__ */ $.pointerType("jsontext.Decoder")]], ["error"], true)],
		point,
		() => [/* @__PURE__ */ $.structField("x", /* @__PURE__ */ $.basicType("int64"), [0], 0, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_encoding_json_go127" }), /* @__PURE__ */ $.structField("y", /* @__PURE__ */ $.basicType("int64"), [1], 8, false, { pkgPath: "github.com/s4wave/goscript/tests/tests/package_import_encoding_json_go127" })]
	)
}

export class shape {
	public declare Name: string

	public declare Points: $.Slice<point>

	public declare Tags: globalThis.Map<string, number> | null

	constructor(__goscriptValue?: boolean, Name$?: string, Points$?: $.Slice<point>, Tags$?: globalThis.Map<string, number> | null) {
		this.Name = Name$ ?? ""
		this.Points = Points$ ?? (null! as $.Slice<point>)
		this.Tags = Tags$ ?? (null! as globalThis.Map<string, number> | null)
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): shape {
		return new shape(true, this.Name, this.Points, this.Tags)
	}

	public __goscriptAssign(source: shape): this {
		this.Name = source.Name
		this.Points = source.Points
		this.Tags = source.Tags
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.shape",
		() => new shape(),
		() => [],
		shape,
		() => [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true, { tag: "json:\"name\"" }), /* @__PURE__ */ $.structField("Points", /* @__PURE__ */ $.sliceType("main.point"), [1], 16, true, { tag: "json:\"points\"" }), /* @__PURE__ */ $.structField("Tags", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int")), [2], 40, true, { tag: "json:\"tags,omitempty\"" })]
	)
}

export async function main(): globalThis.Promise<void> {
	let raw: $.VarRef<json.RawMessage> = $.varRef(null! as json.RawMessage)
	let dec = await json.NewDecoder($.interfaceValue<io.Reader | null>(strings.NewReader("{\"hello\": true}"), "*strings.Reader", __goscriptStatic0()))
	let err = await (dec !== null && (dec as any).__isVarRef !== true && (dec as any).__goValue === undefined ? ((dec as any) as json.Decoder).Decode($.namedValueInterfaceValue<any>(raw, "*jsontext.Value", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3())) : json.Decoder.prototype.Decode.call(dec, $.namedValueInterfaceValue<any>(raw, "*jsontext.Value", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3())))
	await $.println("RawMessage:", $.bytesToString(raw.value), err == null)
	await $.println("RawMessage EOF:", $.comparableEqual(await (dec !== null && (dec as any).__isVarRef !== true && (dec as any).__goValue === undefined ? ((dec as any) as json.Decoder).Decode($.namedValueInterfaceValue<any>(raw, "*jsontext.Value", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3())) : json.Decoder.prototype.Decode.call(dec, $.namedValueInterfaceValue<any>(raw, "*jsontext.Value", __goscriptStatic1(), __goscriptStatic2(), __goscriptStatic3()))), io.EOF))
	await $.println("RawMessage valid:", await jsontext.Value_IsValid(raw.value, null), jsontext.Value_Kind(raw.value))
	await $.println("RawMessage format:", await jsontext.Value_Format(raw, null) == null, $.bytesToString(raw.value))

	let formatted: $.VarRef<json.RawMessage> = $.varRef((new Uint8Array([123, 34, 120, 34, 58, 32, 34, 60, 34, 125]) as json.RawMessage))
	await $.println("RawMessage HTML:", await jsontext.Value_Format(formatted, $.arrayToSlice<jsontext.Options | null>([jsontext.EscapeForHTML(true)])) == null, $.bytesToString(formatted.value))
	let duplicates = (new Uint8Array([123, 34, 97, 34, 58, 49, 44, 34, 97, 34, 58, 50, 125]) as json.RawMessage)
	await $.println("RawMessage duplicates:", await jsontext.Value_IsValid(duplicates, null), await jsontext.Value_IsValid(duplicates, $.arrayToSlice<jsontext.Options | null>([jsontext.AllowDuplicateNames(true)])))

	let malformed = (new Uint8Array([91, 32, 34, 255, 34, 32, 93]) as $.Slice<number> as json.RawMessage)
	let compact: $.VarRef<jsontext.Value> = $.varRef((jsontext.Value_Clone(malformed) as jsontext.Value))
	await $.println("RawMessage compact bytes:", await jsontext.Value_Compact(compact, null) == null, slices.Equal((compact.value as jsontext.Value), (new Uint8Array([91, 34, 255, 34, 93]) as $.Slice<number> as jsontext.Value)))
	let indentedRaw: $.VarRef<jsontext.Value> = $.varRef((jsontext.Value_Clone(malformed) as jsontext.Value))
	await $.println("RawMessage indent bytes:", await jsontext.Value_Indent(indentedRaw, $.arrayToSlice<jsontext.Options | null>([jsontext.WithIndent("  ")])) == null, slices.Equal((indentedRaw.value as jsontext.Value), (new Uint8Array([91, 10, 32, 32, 34, 255, 34, 10, 93]) as $.Slice<number> as jsontext.Value)))
	let normalized: $.VarRef<jsontext.Value> = $.varRef((jsontext.Value_Clone(malformed) as jsontext.Value))
	await $.println("RawMessage invalid UTF8 replacement:", await jsontext.Value_Format(normalized, $.arrayToSlice<jsontext.Options | null>([jsontext.AllowInvalidUTF8(true)])) == null, $.bytesToString(normalized.value))
	let surrogate: $.VarRef<json.RawMessage> = $.varRef((new Uint8Array([34, 92, 117, 100, 56, 48, 48, 34]) as json.RawMessage))
	await $.println("RawMessage surrogate replacement:", await jsontext.Value_Format(surrogate, $.arrayToSlice<jsontext.Options | null>([jsontext.AllowInvalidUTF8(true)])) == null, $.bytesToString(surrogate.value))
	let ordered: $.VarRef<json.RawMessage> = $.varRef((new Uint8Array([123, 34, 97, 34, 58, 50, 44, 34, 97, 34, 58, 49, 44, 34, 98, 34, 58, 45, 48, 125]) as json.RawMessage))
	await $.println("RawMessage duplicate ordering:", await jsontext.Value_Canonicalize(ordered, $.arrayToSlice<jsontext.Options | null>([jsontext.AllowDuplicateNames(true), jsontext.CanonicalizeRawInts(false)])) == null, $.bytesToString(ordered.value))

	// encoding/json/v2 marshals with deterministic map order and calls the
	// jsontext methods of its values.
	let __goscriptTuple0: any = await jsonv2.Marshal($.structInterfaceValue(new shape(true, "tri", $.arrayToSlice<point>([new point(true, 1n, 2n), new point(true, 3n, -4n)]), $.makeMap<string, number>([["z", 1], ["a", 2]])), "main.shape", "main.shape"), $.arrayToSlice<jsonv2.Options | null>([jsonv2.Deterministic(true)]))
	let out: $.Slice<number> = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	await $.println("v2 Marshal:", $.bytesToString(out), err == null)
	let back: $.VarRef<shape> = $.varRef(new shape(true))
	err = await jsonv2.Unmarshal(out, $.interfaceValue(back, "*main.shape", /* @__PURE__ */ $.pointerType("main.shape")), null)
	await $.println("v2 Unmarshal:", back.value.Name, $.sliceLen(back.value.Points), $.plainSliceIndex(back.value.Points!, 1).y, $.mapGet<string, number, number>(back.value.Tags, "a", 0)[0], err == null)
	await $.println("v2 duplicate name:", await jsonv2.Unmarshal(new Uint8Array([123, 34, 110, 97, 109, 101, 34, 58, 34, 97, 34, 44, 34, 110, 97, 109, 101, 34, 58, 34, 98, 34, 125]), $.interfaceValue(back, "*main.shape", /* @__PURE__ */ $.pointerType("main.shape")), null) != null)

	// Options built from encoding/json reach encoding/json/v2, as
	// k8s.io/apimachinery decodes with them.
	let anyValue: $.VarRef<globalThis.Map<string, any> | null> = $.varRef(null! as globalThis.Map<string, any> | null)
	err = await jsonv2.Unmarshal(new Uint8Array([123, 34, 78, 97, 109, 101, 34, 58, 49, 46, 53, 125]), $.interfaceValue(anyValue, "*map[string]interface{}", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), { kind: $.TypeKind.Interface, methods: [] }))), $.arrayToSlice<jsonv2.Options | null>([json.DefaultOptionsV1(), jsonv2.MatchCaseInsensitiveNames(false)]))
	await $.println("v2 with v1 options:", $.mustTypeAssert<number>($.mapGet<string, any, any>(anyValue.value, "Name", null)[0], /* @__PURE__ */ $.basicType("float64")) == 1.5, err == null)

	// A jsontext Encoder writes tokens to a writer.
	let buf = $.varRef($.markAsStructValue(new bytes.Buffer()))
	let enc = await jsontext.NewEncoder($.interfaceValue<io.Writer | null>(buf, "*bytes.Buffer", __goscriptStatic4()), null)
	await (enc !== null && (enc as any).__isVarRef !== true && (enc as any).__goValue === undefined ? ((enc as any) as jsontext.Encoder).WriteToken(($.pointerValue<jsontext.Token>(jsontext.__goscript_get_BeginObject())).clone()) : jsontext.Encoder.prototype.WriteToken.call(enc, ($.pointerValue<jsontext.Token>(jsontext.__goscript_get_BeginObject())).clone()))
	await (enc !== null && (enc as any).__isVarRef !== true && (enc as any).__goValue === undefined ? ((enc as any) as jsontext.Encoder).WriteToken(jsontext.String("k")) : jsontext.Encoder.prototype.WriteToken.call(enc, jsontext.String("k")))
	await (enc !== null && (enc as any).__isVarRef !== true && (enc as any).__goValue === undefined ? ((enc as any) as jsontext.Encoder).WriteToken(jsontext.Float(0.5)) : jsontext.Encoder.prototype.WriteToken.call(enc, jsontext.Float(0.5)))
	await (enc !== null && (enc as any).__isVarRef !== true && (enc as any).__goValue === undefined ? ((enc as any) as jsontext.Encoder).WriteToken(($.pointerValue<jsontext.Token>(jsontext.__goscript_get_EndObject())).clone()) : jsontext.Encoder.prototype.WriteToken.call(enc, ($.pointerValue<jsontext.Token>(jsontext.__goscript_get_EndObject())).clone()))
	await $.println("jsontext Encoder:", strings.TrimSpace(buf.value.String()))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("strings.Reader"), "strings.Reader", () => [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Read", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadAt", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["off", /* @__PURE__ */ $.basicType("int64")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadRune", [], [["ch", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("Reset", [["s", /* @__PURE__ */ $.basicType("string")]], [], true), $.methodSignature("Seek", [["offset", /* @__PURE__ */ $.basicType("int64")], ["whence", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int64"), "error"], true), $.methodSignature("Size", [], [/* @__PURE__ */ $.basicType("int64")], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= ({Canonicalize: (receiver: any, ...args: any[]) => (jsontext.Value_Canonicalize as any)(receiver, ...$.stripGenericTypeArgs(args)), Clone: (receiver: any) => (jsontext.Value_Clone as any)($.pointerValue(receiver)), Compact: (receiver: any, ...args: any[]) => (jsontext.Value_Compact as any)(receiver, ...$.stripGenericTypeArgs(args)), Format: (receiver: any, ...args: any[]) => (jsontext.Value_Format as any)(receiver, ...$.stripGenericTypeArgs(args)), Indent: (receiver: any, ...args: any[]) => (jsontext.Value_Indent as any)(receiver, ...$.stripGenericTypeArgs(args)), IsValid: (receiver: any, ...args: any[]) => (jsontext.Value_IsValid as any)($.pointerValue(receiver), ...$.stripGenericTypeArgs(args)), Kind: (receiver: any) => (jsontext.Value_Kind as any)($.pointerValue(receiver)), MarshalJSON: (receiver: any) => (jsontext.Value_MarshalJSON as any)($.pointerValue(receiver)), String: (receiver: any) => (jsontext.Value_String as any)($.pointerValue(receiver)), UnmarshalJSON: (receiver: any, ...args: any[]) => (jsontext.Value_UnmarshalJSON as any)(receiver, ...$.stripGenericTypeArgs(args)), format: (receiver: any, ...args: any[]) => (jsontext.Value_format as any)(receiver, ...$.stripGenericTypeArgs(args))})
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= (/* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "jsontext.Value")))
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ([$.methodSignature("Canonicalize", [["opts", /* @__PURE__ */ $.sliceType("jsonopts.Options")]], ["error"], false, true), $.methodSignature("Clone", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "jsontext.Value")]), $.methodSignature("Compact", [["opts", /* @__PURE__ */ $.sliceType("jsonopts.Options")]], ["error"], false, true), $.methodSignature("Format", [["opts", /* @__PURE__ */ $.sliceType("jsonopts.Options")]], ["error"], false, true), $.methodSignature("Indent", [["opts", /* @__PURE__ */ $.sliceType("jsonopts.Options")]], ["error"], false, true), $.methodSignature("IsValid", [["opts", /* @__PURE__ */ $.sliceType("jsonopts.Options")]], [/* @__PURE__ */ $.basicType("bool")], false, true), $.methodSignature("Kind", [], [/* @__PURE__ */ $.basicType("uint8", "jsontext.Kind")]), $.methodSignature("MarshalJSON", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"]), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")]), $.methodSignature("UnmarshalJSON", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], ["error"]), $.methodSignature("format", [["opts1", /* @__PURE__ */ $.sliceType("jsonopts.Options")], ["opts2", /* @__PURE__ */ $.sliceType("jsonopts.Options")]], ["error"])])
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("bytes.Buffer"), "bytes.Buffer", () => [$.methodSignature("Available", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("AvailableBuffer", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Bytes", [], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Cap", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Grow", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Next", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], true), $.methodSignature("Peek", [["n", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), "error"], true), $.methodSignature("Read", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadBytes", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["err", "error"]], true), $.methodSignature("ReadFrom", [["r", "io.Reader"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true), $.methodSignature("ReadRune", [], [["r", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadString", [["delim", /* @__PURE__ */ $.basicType("uint8")]], [["line", /* @__PURE__ */ $.basicType("string")], ["err", "error"]], true), $.methodSignature("Reset", [], [], true), $.methodSignature("String", [], [/* @__PURE__ */ $.basicType("string")], true), $.methodSignature("Truncate", [["n", /* @__PURE__ */ $.basicType("int")]], [], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("Write", [["p", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteByte", [["c", /* @__PURE__ */ $.basicType("uint8")]], ["error"], true), $.methodSignature("WriteRune", [["r", /* @__PURE__ */ $.basicType("int32")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteString", [["s", /* @__PURE__ */ $.basicType("string")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

if ($.isMainScript(import.meta)) {
	await main()
}

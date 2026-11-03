// Generated file based on json_simple.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as json from "@goscript/encoding/json/index.js"
import * as strings from "@goscript/strings/index.js"
import type * as io from "@goscript/io/index.js"

export class Simple {
	public declare X: number

	constructor(__goscriptValue?: boolean, X$?: number) {
		this.X = X$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Simple {
		return new Simple(true, this.X)
	}

	public __goscriptAssign(source: Simple): this {
		this.X = source.X
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Simple",
		() => new Simple(),
		() => [],
		Simple,
		() => [{ name: "X", key: "X", type: /* @__PURE__ */ $.basicType("int"), tag: "json:\"x\"" }]
	)
}

export class Object {
	public declare SHA: string

	public declare Type: string

	constructor(__goscriptValue?: boolean, SHA$?: string, Type$?: string) {
		this.SHA = SHA$ ?? ""
		this.Type = Type$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Object {
		return new Object(true, this.SHA, this.Type)
	}

	public __goscriptAssign(source: Object): this {
		this.SHA = source.SHA
		this.Type = source.Type
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Object",
		() => new Object(),
		() => [],
		Object,
		() => [{ name: "SHA", key: "SHA", type: /* @__PURE__ */ $.basicType("string") }, { name: "Type", key: "Type", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class Ref {
	public declare Object: Object

	public declare Label: string

	constructor(__goscriptValue?: boolean, Object$?: Object, Label$?: string) {
		this.Object = Object$ ?? new Object(true)
		this.Label = Label$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Ref {
		return new Ref(true, this.Object.clone(), this.Label)
	}

	public __goscriptAssign(source: Ref): this {
		this.Object.__goscriptAssign(source.Object)
		this.Label = source.Label
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Ref",
		() => new Ref(),
		() => [],
		Ref,
		() => [{ name: "Object", key: "Object", type: "main.Object" }, { name: "Label", key: "Label", type: /* @__PURE__ */ $.basicType("string"), tag: "json:\"label\"" }]
	)
}

export async function main(): globalThis.Promise<void> {
	let s = new Simple(true, 42)
	let __goscriptTuple0: any = (json.Marshal($.structInterfaceValue(s, "main.Simple", "main.Simple")) as [$.Slice<number>, $.GoError])
	let b: $.Slice<number> = __goscriptTuple0[0]
	let err: $.GoError = __goscriptTuple0[1]
	if (err != null) {
		await $.println("Error:", (__goscriptAwait = (err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))
	} else {
		await $.println("Result:", $.bytesToString(b))
	}
	await unmarshalNames()
}

export async function unmarshalNames(): globalThis.Promise<void> {
	let r: $.VarRef<Ref> = $.varRef(new Ref(true))
	let err: $.GoError = (json.Unmarshal(new Uint8Array([123, 34, 111, 98, 106, 101, 99, 116, 34, 58, 123, 34, 115, 104, 97, 34, 58, 34, 97, 98, 99, 34, 44, 34, 84, 89, 80, 69, 34, 58, 34, 99, 111, 109, 109, 105, 116, 34, 125, 44, 34, 76, 65, 66, 69, 76, 34, 58, 34, 109, 97, 105, 110, 34, 125]), $.interfaceValue(r, "*main.Ref", /* @__PURE__ */ $.pointerType("main.Ref"))) as $.GoError)
	await $.println("named:", err == null, r.value.Object.SHA, r.value.Object.Type, r.value.Label)

	let a: $.VarRef<{"Object": {"SHA": string}}> = $.varRef($.anonymousStructValue({"Object": $.anonymousStructValue({"SHA": ""}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("SHA", /* @__PURE__ */ $.basicType("string"), [0], 0, true)] })}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Object", { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("SHA", /* @__PURE__ */ $.basicType("string"), [0], 0, true)] }, [0], 0, true)] }))
	err = (json.Unmarshal(new Uint8Array([123, 34, 111, 98, 106, 101, 99, 116, 34, 58, 123, 34, 115, 104, 97, 34, 58, 34, 100, 101, 102, 34, 125, 125]), $.interfaceValue(a, "*struct{Object struct{SHA string}}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Object", { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("SHA", /* @__PURE__ */ $.basicType("string"), [0], 0, true)] }, [0], 0, true)] }))) as $.GoError)
	await $.println("anonymous:", err == null, a.value.Object.SHA)

	let o: $.VarRef<Object> = $.varRef(new Object(true))
	err = (json.Unmarshal(new Uint8Array([123, 34, 115, 104, 97, 34, 58, 34, 120, 34, 44, 34, 83, 72, 65, 34, 58, 34, 121, 34, 44, 34, 116, 121, 112, 101, 34, 58, 34, 116, 34, 125]), $.interfaceValue(o, "*main.Object", /* @__PURE__ */ $.pointerType("main.Object"))) as $.GoError)
	await $.println("both cases:", err == null, o.value.SHA, o.value.Type)

	let d: json.Decoder | $.VarRef<json.Decoder> | null = json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(strings.NewReader("{\"sha\":\"z\",\"other\":1}"), "*strings.Reader", __goscriptStatic0()))!)
	void (d !== null && (d as any).__isVarRef !== true && (d as any).__goValue === undefined ? ((d as any) as json.Decoder).DisallowUnknownFields() : json.Decoder.prototype.DisallowUnknownFields.call($.pointerValue<json.Decoder>(d)))
	err = await (d !== null && (d as any).__isVarRef !== true && (d as any).__goValue === undefined ? ((d as any) as json.Decoder).Decode($.interfaceValue(o, "*main.Object", /* @__PURE__ */ $.pointerType("main.Object"))) : json.Decoder.prototype.Decode.call($.pointerValue<json.Decoder>(d), $.interfaceValue(o, "*main.Object", /* @__PURE__ */ $.pointerType("main.Object"))))
	await $.println("unknown:", err != null)
	d = json.NewDecoder($.pointerValueOrNil($.interfaceValue<io.Reader | null>(strings.NewReader("{\"sha\":\"w\"}"), "*strings.Reader", __goscriptStatic0()))!)
	void (d !== null && (d as any).__isVarRef !== true && (d as any).__goValue === undefined ? ((d as any) as json.Decoder).DisallowUnknownFields() : json.Decoder.prototype.DisallowUnknownFields.call($.pointerValue<json.Decoder>(d)))
	err = await (d !== null && (d as any).__isVarRef !== true && (d as any).__goValue === undefined ? ((d as any) as json.Decoder).Decode($.interfaceValue(o, "*main.Object", /* @__PURE__ */ $.pointerType("main.Object"))) : json.Decoder.prototype.Decode.call($.pointerValue<json.Decoder>(d), $.interfaceValue(o, "*main.Object", /* @__PURE__ */ $.pointerType("main.Object"))))
	await $.println("known:", err == null, o.value.SHA)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ($.overrideTypeMethods(/* @__PURE__ */ $.pointerType("strings.Reader"), "strings.Reader", () => [$.methodSignature("Len", [], [/* @__PURE__ */ $.basicType("int")], true), $.methodSignature("Read", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadAt", [["b", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))], ["off", /* @__PURE__ */ $.basicType("int64")]], [["n", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("ReadByte", [], [/* @__PURE__ */ $.basicType("uint8"), "error"], true), $.methodSignature("ReadRune", [], [["ch", /* @__PURE__ */ $.basicType("int32")], ["size", /* @__PURE__ */ $.basicType("int")], ["err", "error"]], true), $.methodSignature("Reset", [["s", /* @__PURE__ */ $.basicType("string")]], [], true), $.methodSignature("Seek", [["offset", /* @__PURE__ */ $.basicType("int64")], ["whence", /* @__PURE__ */ $.basicType("int")]], [/* @__PURE__ */ $.basicType("int64"), "error"], true), $.methodSignature("Size", [], [/* @__PURE__ */ $.basicType("int64")], true), $.methodSignature("UnreadByte", [], ["error"], true), $.methodSignature("UnreadRune", [], ["error"], true), $.methodSignature("WriteTo", [["w", "io.Writer"]], [["n", /* @__PURE__ */ $.basicType("int64")], ["err", "error"]], true)]))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

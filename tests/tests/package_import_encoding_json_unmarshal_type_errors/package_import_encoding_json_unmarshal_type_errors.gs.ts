// Generated file based on package_import_encoding_json_unmarshal_type_errors.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as json from "@goscript/encoding/json/index.js"
import * as reflect from "@goscript/reflect/index.js"

export class Item {
	public declare Name: string

	public declare Done: boolean

	public declare Count: number

	constructor(__goscriptValue?: boolean, Name$?: string, Done$?: boolean, Count$?: number) {
		this.Name = Name$ ?? ""
		this.Done = Done$ ?? false
		this.Count = Count$ ?? 0
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): Item {
		return new Item(true, this.Name, this.Done, this.Count)
	}

	public __goscriptAssign(source: Item): this {
		this.Name = source.Name
		this.Done = source.Done
		this.Count = source.Count
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Item",
		() => new Item(),
		() => [],
		Item,
		() => [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true), /* @__PURE__ */ $.structField("Done", /* @__PURE__ */ $.basicType("bool"), [1], 16, true), /* @__PURE__ */ $.structField("Count", /* @__PURE__ */ $.basicType("int"), [2], 24, true)]
	)
}

export async function main(): globalThis.Promise<void> {
	let b = $.varRef(true)
	let err: $.GoError = (json.Unmarshal(new Uint8Array([34, 120, 34]), $.interfaceValue(b, "*bool", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("bool")))) as $.GoError)
	let [, isType] = $.typeAssertTuple<json.UnmarshalTypeError | $.VarRef<json.UnmarshalTypeError> | null>(err, /* @__PURE__ */ $.pointerType("json.UnmarshalTypeError"))
	await $.println("bool from string:", err != null, isType, b.value)
	err = (json.Unmarshal(new Uint8Array([110, 117, 108, 108]), $.interfaceValue(b, "*bool", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("bool")))) as $.GoError)
	await $.println("bool from null:", err == null, b.value)

	let n = $.varRef(3)
	err = (json.Unmarshal(new Uint8Array([116, 114, 117, 101]), $.interfaceValue(n, "*int", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")))) as $.GoError)
	await $.println("int from bool:", err != null, n.value)
	let s = $.varRef("s")
	err = (json.Unmarshal(new Uint8Array([51]), $.interfaceValue(s, "*string", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("string")))) as $.GoError)
	await $.println("string from number:", err != null, s.value)
	err = (json.Unmarshal(new Uint8Array([110, 117, 108, 108]), $.interfaceValue(s, "*string", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("string")))) as $.GoError)
	await $.println("string from null:", err == null, s.value)

	let it = $.varRef(new Item(true, "a", true, 2))
	err = (json.Unmarshal(new Uint8Array([123, 34, 78, 97, 109, 101, 34, 58, 34, 98, 34, 44, 34, 68, 111, 110, 101, 34, 58, 34, 121, 101, 115, 34, 44, 34, 67, 111, 117, 110, 116, 34, 58, 52, 125]), $.interfaceValue(it, "*main.Item", /* @__PURE__ */ $.pointerType("main.Item"))) as $.GoError)
	await $.println("struct fields:", err != null, it.value.Name, it.value.Done, it.value.Count)
	err = (json.Unmarshal(new Uint8Array([123, 34, 78, 97, 109, 101, 34, 58, 110, 117, 108, 108, 44, 34, 68, 111, 110, 101, 34, 58, 110, 117, 108, 108, 44, 34, 67, 111, 117, 110, 116, 34, 58, 110, 117, 108, 108, 125]), $.interfaceValue(it, "*main.Item", /* @__PURE__ */ $.pointerType("main.Item"))) as $.GoError)
	await $.println("struct nulls:", err == null, it.value.Name, it.value.Done, it.value.Count)

	let flags: $.VarRef<$.Slice<boolean>> = $.varRef(null! as $.Slice<boolean>)
	err = (json.Unmarshal(new Uint8Array([91, 116, 114, 117, 101, 44, 34, 120, 34, 44, 102, 97, 108, 115, 101, 93]), $.interfaceValue(flags, "*[]bool", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("bool"))))) as $.GoError)
	await $.println("slice elements:", err != null, $.sliceLen(flags.value), $.plainSliceIndex(flags.value!, 0), $.plainSliceIndex(flags.value!, 1), $.plainSliceIndex(flags.value!, 2))

	// a field of a struct made with reflect, through its address
	let st = reflect.StructOf($.arrayToSlice<reflect.StructField>([(() => { const __goscriptLiteralField0 = reflect.TypeFor(__goscriptStatic0()); return $.markAsStructValue(new reflect.StructField({Name: "Done", Type: __goscriptLiteralField0})) })()]))
	let v = reflect.New($.pointerValueOrNil(st)!).Elem()
	err = (json.Unmarshal(new Uint8Array([34, 116, 114, 117, 101, 34]), v.Field(0).Addr().Interface()) as $.GoError)
	await $.println("reflect field:", err != null, v.Field(0).Bool())
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= ({[$.genericTypeArgsMarker]: $.genericTypeArgsBrand, T: { type: /* @__PURE__ */ $.basicType("bool"), zero: () => false }})
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on package_import_encoding_json_omitempty_pointer_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as strings from "@goscript/strings/index.js"
import "@goscript/encoding/json/index.js"
import "@goscript/fmt/index.js"
import "@goscript/strings/index.js"

export class Payload {
	public declare Ptr: $.VarRef<number> | null

	public declare IfaceZero: any

	public declare IfaceFalse: any

	public declare IfaceEmptyString: any

	public declare IfaceEmptySlice: any

	public declare IfaceEmptyMap: any

	public declare PtrNilIface: $.VarRef<any> | null

	public declare PtrBool: $.VarRef<boolean> | null

	public _fields: {
		Ptr: $.VarRef<number> | null
		IfaceZero: any
		IfaceFalse: any
		IfaceEmptyString: any
		IfaceEmptySlice: any
		IfaceEmptyMap: any
		PtrNilIface: $.VarRef<any> | null
		PtrBool: $.VarRef<boolean> | null
	}

	constructor(init?: Partial<{Ptr?: $.VarRef<number> | null, IfaceZero?: any, IfaceFalse?: any, IfaceEmptyString?: any, IfaceEmptySlice?: any, IfaceEmptyMap?: any, PtrNilIface?: $.VarRef<any> | null, PtrBool?: $.VarRef<boolean> | null}>) {
		this._fields = {
			Ptr: init?.Ptr ?? (null! as $.VarRef<number> | null),
			IfaceZero: init?.IfaceZero ?? (null! as any),
			IfaceFalse: init?.IfaceFalse ?? (null! as any),
			IfaceEmptyString: init?.IfaceEmptyString ?? (null! as any),
			IfaceEmptySlice: init?.IfaceEmptySlice ?? (null! as any),
			IfaceEmptyMap: init?.IfaceEmptyMap ?? (null! as any),
			PtrNilIface: init?.PtrNilIface ?? (null! as $.VarRef<any> | null),
			PtrBool: init?.PtrBool ?? (null! as $.VarRef<boolean> | null)
		}
	}

	public clone(): Payload {
		return $.markAsStructValue(new Payload(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Ptr", "IfaceZero", "IfaceFalse", "IfaceEmptyString", "IfaceEmptySlice", "IfaceEmptyMap", "PtrNilIface", "PtrBool"])
	}

	static __typeInfo = $.registerStructType(
		"main.Payload",
		() => new Payload(),
		() => [],
		Payload,
		() => [{ name: "Ptr", key: "Ptr", type: /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("int")), tag: "json:\"ptr,omitempty\"" }, { name: "IfaceZero", key: "IfaceZero", type: { kind: $.TypeKind.Interface, methods: [] }, tag: "json:\"ifaceZero,omitempty\"" }, { name: "IfaceFalse", key: "IfaceFalse", type: { kind: $.TypeKind.Interface, methods: [] }, tag: "json:\"ifaceFalse,omitempty\"" }, { name: "IfaceEmptyString", key: "IfaceEmptyString", type: { kind: $.TypeKind.Interface, methods: [] }, tag: "json:\"ifaceEmptyString,omitempty\"" }, { name: "IfaceEmptySlice", key: "IfaceEmptySlice", type: { kind: $.TypeKind.Interface, methods: [] }, tag: "json:\"ifaceEmptySlice,omitempty\"" }, { name: "IfaceEmptyMap", key: "IfaceEmptyMap", type: { kind: $.TypeKind.Interface, methods: [] }, tag: "json:\"ifaceEmptyMap,omitempty\"" }, { name: "PtrNilIface", key: "PtrNilIface", type: /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Interface, methods: [] }), tag: "json:\"ptrNilIface,omitempty\"" }, { name: "PtrBool", key: "PtrBool", type: /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("bool")), tag: "json:\"ptrBool,omitempty\"" }]
	)
}

export async function main(): globalThis.Promise<void> {
	let zero = $.varRef(0)
	let falseValue = $.varRef(false)
	let nilIface: $.VarRef<any> = $.varRef(null! as any)
	let __goscriptTuple0: any = json.Marshal($.interfaceValue($.markAsStructValue(new Payload({Ptr: zero, IfaceZero: $.basicInterfaceValue(0, "int"), IfaceFalse: false, IfaceEmptyString: "", IfaceEmptySlice: $.interfaceValue($.arrayToSlice<number>([]), "[]int", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("int"))), IfaceEmptyMap: $.interfaceValue($.makeMap<string, number>([]), "map[string]int", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.basicType("int"))), PtrNilIface: nilIface, PtrBool: falseValue})), "main.Payload", "main.Payload"))
	let out: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		await fmt.Println("marshal error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	let text = $.bytesToString(out)
	await fmt.Println("ptr emitted:", strings.Contains(text, "\"ptr\":"))
	await fmt.Println("ifaceZero emitted:", strings.Contains(text, "\"ifaceZero\":"))
	await fmt.Println("ifaceFalse emitted:", strings.Contains(text, "\"ifaceFalse\":"))
	await fmt.Println("ifaceEmptyString emitted:", strings.Contains(text, "\"ifaceEmptyString\":"))
	await fmt.Println("ifaceEmptySlice emitted:", strings.Contains(text, "\"ifaceEmptySlice\":"))
	await fmt.Println("ifaceEmptyMap emitted:", strings.Contains(text, "\"ifaceEmptyMap\":"))
	await fmt.Println("ptrNilIface emitted as null:", strings.Contains(text, "\"ptrNilIface\":null"))
	await fmt.Println("ptrBool emitted:", strings.Contains(text, "\"ptrBool\":"))
}

if ($.isMainScript(import.meta)) {
	await main()
}

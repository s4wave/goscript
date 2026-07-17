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
	public get Ptr(): $.VarRef<number> | null {
		return this._fields.Ptr.value
	}
	public set Ptr(value: $.VarRef<number> | null) {
		this._fields.Ptr.value = value
	}

	public get IfaceZero(): any {
		return this._fields.IfaceZero.value
	}
	public set IfaceZero(value: any) {
		this._fields.IfaceZero.value = value
	}

	public get IfaceFalse(): any {
		return this._fields.IfaceFalse.value
	}
	public set IfaceFalse(value: any) {
		this._fields.IfaceFalse.value = value
	}

	public get IfaceEmptyString(): any {
		return this._fields.IfaceEmptyString.value
	}
	public set IfaceEmptyString(value: any) {
		this._fields.IfaceEmptyString.value = value
	}

	public get IfaceEmptySlice(): any {
		return this._fields.IfaceEmptySlice.value
	}
	public set IfaceEmptySlice(value: any) {
		this._fields.IfaceEmptySlice.value = value
	}

	public get IfaceEmptyMap(): any {
		return this._fields.IfaceEmptyMap.value
	}
	public set IfaceEmptyMap(value: any) {
		this._fields.IfaceEmptyMap.value = value
	}

	public get PtrNilIface(): $.VarRef<any> | null {
		return this._fields.PtrNilIface.value
	}
	public set PtrNilIface(value: $.VarRef<any> | null) {
		this._fields.PtrNilIface.value = value
	}

	public get PtrBool(): $.VarRef<boolean> | null {
		return this._fields.PtrBool.value
	}
	public set PtrBool(value: $.VarRef<boolean> | null) {
		this._fields.PtrBool.value = value
	}

	public _fields: {
		Ptr: $.VarRef<$.VarRef<number> | null>
		IfaceZero: $.VarRef<any>
		IfaceFalse: $.VarRef<any>
		IfaceEmptyString: $.VarRef<any>
		IfaceEmptySlice: $.VarRef<any>
		IfaceEmptyMap: $.VarRef<any>
		PtrNilIface: $.VarRef<$.VarRef<any> | null>
		PtrBool: $.VarRef<$.VarRef<boolean> | null>
	}

	constructor(init?: Partial<{Ptr?: $.VarRef<number> | null, IfaceZero?: any, IfaceFalse?: any, IfaceEmptyString?: any, IfaceEmptySlice?: any, IfaceEmptyMap?: any, PtrNilIface?: $.VarRef<any> | null, PtrBool?: $.VarRef<boolean> | null}>) {
		this._fields = {
			Ptr: $.varRef(init?.Ptr ?? (null as $.VarRef<number> | null)),
			IfaceZero: $.varRef(init?.IfaceZero ?? (null as any)),
			IfaceFalse: $.varRef(init?.IfaceFalse ?? (null as any)),
			IfaceEmptyString: $.varRef(init?.IfaceEmptyString ?? (null as any)),
			IfaceEmptySlice: $.varRef(init?.IfaceEmptySlice ?? (null as any)),
			IfaceEmptyMap: $.varRef(init?.IfaceEmptyMap ?? (null as any)),
			PtrNilIface: $.varRef(init?.PtrNilIface ?? (null as $.VarRef<any> | null)),
			PtrBool: $.varRef(init?.PtrBool ?? (null as $.VarRef<boolean> | null))
		}
	}

	public clone(): Payload {
		const cloned = new Payload()
		cloned._fields = {
			Ptr: $.varRef(this._fields.Ptr.value),
			IfaceZero: $.varRef(this._fields.IfaceZero.value),
			IfaceFalse: $.varRef(this._fields.IfaceFalse.value),
			IfaceEmptyString: $.varRef(this._fields.IfaceEmptyString.value),
			IfaceEmptySlice: $.varRef(this._fields.IfaceEmptySlice.value),
			IfaceEmptyMap: $.varRef(this._fields.IfaceEmptyMap.value),
			PtrNilIface: $.varRef(this._fields.PtrNilIface.value),
			PtrBool: $.varRef(this._fields.PtrBool.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Payload",
		() => new Payload(),
		[],
		Payload,
		[{ name: "Ptr", key: "Ptr", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int" } }, tag: "json:\"ptr,omitempty\"" }, { name: "IfaceZero", key: "IfaceZero", type: { kind: $.TypeKind.Interface, methods: [] }, tag: "json:\"ifaceZero,omitempty\"" }, { name: "IfaceFalse", key: "IfaceFalse", type: { kind: $.TypeKind.Interface, methods: [] }, tag: "json:\"ifaceFalse,omitempty\"" }, { name: "IfaceEmptyString", key: "IfaceEmptyString", type: { kind: $.TypeKind.Interface, methods: [] }, tag: "json:\"ifaceEmptyString,omitempty\"" }, { name: "IfaceEmptySlice", key: "IfaceEmptySlice", type: { kind: $.TypeKind.Interface, methods: [] }, tag: "json:\"ifaceEmptySlice,omitempty\"" }, { name: "IfaceEmptyMap", key: "IfaceEmptyMap", type: { kind: $.TypeKind.Interface, methods: [] }, tag: "json:\"ifaceEmptyMap,omitempty\"" }, { name: "PtrNilIface", key: "PtrNilIface", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Interface, methods: [] } }, tag: "json:\"ptrNilIface,omitempty\"" }, { name: "PtrBool", key: "PtrBool", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool" } }, tag: "json:\"ptrBool,omitempty\"" }]
	)
}

export async function main(): globalThis.Promise<void> {
	let zero = $.varRef(0)
	let falseValue = $.varRef(false)
	let nilIface: $.VarRef<any> = $.varRef(null as any)
	let __goscriptTuple0: any = json.Marshal($.interfaceValue<any>($.markAsStructValue(new Payload({Ptr: zero, IfaceZero: $.basicInterfaceValue(0, "int"), IfaceFalse: false, IfaceEmptyString: "", IfaceEmptySlice: $.interfaceValue<any>($.arrayToSlice<number>([]), "[]int", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }), IfaceEmptyMap: $.interfaceValue<any>(new globalThis.Map<string, number>([]), "map[string]int", { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Basic, name: "int" } }), PtrNilIface: nilIface, PtrBool: falseValue})), "main.Payload", "main.Payload"))
	let out: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		fmt.Println("marshal error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	let text = $.bytesToString(out)
	fmt.Println("ptr emitted:", strings.Contains(text, "\"ptr\":"))
	fmt.Println("ifaceZero emitted:", strings.Contains(text, "\"ifaceZero\":"))
	fmt.Println("ifaceFalse emitted:", strings.Contains(text, "\"ifaceFalse\":"))
	fmt.Println("ifaceEmptyString emitted:", strings.Contains(text, "\"ifaceEmptyString\":"))
	fmt.Println("ifaceEmptySlice emitted:", strings.Contains(text, "\"ifaceEmptySlice\":"))
	fmt.Println("ifaceEmptyMap emitted:", strings.Contains(text, "\"ifaceEmptyMap\":"))
	fmt.Println("ptrNilIface emitted as null:", strings.Contains(text, "\"ptrNilIface\":null"))
	fmt.Println("ptrBool emitted:", strings.Contains(text, "\"ptrBool\":"))
}

if ($.isMainScript(import.meta)) {
	await main()
}

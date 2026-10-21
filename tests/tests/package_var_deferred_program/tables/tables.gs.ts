// Generated file based on tables.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

$.registerTypePackagePath("github.com/s4wave/goscript/tests/tests/package_var_deferred_program/tables", ["tables.Codec", "tables.Counter"])

export class Codec {
	public declare Name: string

	public declare Decode: Uint8Array

	constructor(__goscriptValue?: boolean, Name$?: string, Decode$?: Uint8Array) {
		this.Name = Name$ ?? ""
		this.Decode = Decode$ ?? $.arrayValue(new Uint8Array(256))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Codec {
		return new Codec(true, this.Name, $.cloneArrayValue(this.Decode, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 256)))
	}

	public __goscriptAssign(source: Codec): this {
		this.Name = source.Name
		this.Decode = $.assignFieldValue(this.Decode, source.Decode, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 256))
		return this
	}

	static __typeInfo = $.registerStructType(
		"tables.Codec",
		() => new Codec(),
		() => [],
		Codec,
		() => [{ name: "Name", key: "Name", type: /* @__PURE__ */ $.basicType("string") }, { name: "Decode", key: "Decode", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 256) }]
	)
}

export class Counter {
	public declare N: number

	constructor(__goscriptValue?: boolean, N$?: number) {
		this.N = N$ ?? 0
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Counter {
		return new Counter(true, this.N)
	}

	public __goscriptAssign(source: Counter): this {
		this.N = source.N
		return this
	}

	public Inc(): void {
		const c: Counter | $.VarRef<Counter> | null = this;
		const c$: Counter = c == null ? $.pointerTarget<Counter>(c) : (c as any).__isVarRef === true ? (c as any).value : (c as any).__goValue === undefined ? (c as any) : $.pointerTarget<Counter>(c);
		;(c$ as Counter).N++
	}

	static __typeInfo = $.registerStructType(
		"tables.Counter",
		() => new Counter(),
		() => [{ name: "Inc", args: [], returns: [], pointerReceiver: true }],
		Counter,
		() => [{ name: "N", key: "N", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export var CodecA: Codec | $.VarRef<Codec> | null

export function __goscript_init_CodecA(): void {
	if (((CodecA) as any) === undefined) {
		CodecA = __goscript_get_codecA()
	}
}

export function __goscript_get_CodecA(): Codec | $.VarRef<Codec> | null {
	if (((CodecA) as any) === undefined) {
		__goscript_init_CodecA()
	}
	return CodecA
}

export function __goscript_set_CodecA(__goscriptValue: Codec | $.VarRef<Codec> | null): void {
	CodecA = __goscriptValue
}

export var codecA: $.VarRef<Codec>

export function __goscript_init_codecA(): void {
	if (((codecA) as any) === undefined) {
		codecA = $.varRef(new Codec(true, "a", $.arrayValue(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 0, 1, 2, 3, 4]))))
	}
}

export function __goscript_get_codecA(): $.VarRef<Codec> {
	if (((codecA) as any) === undefined) {
		__goscript_init_codecA()
	}
	return codecA
}

export function __goscript_set_codecA(__goscriptValue: Codec): void {
	$.assignStruct(__goscript_get_codecA().value, __goscriptValue)
}

export var CodecB: Codec | $.VarRef<Codec> | null

export function __goscript_init_CodecB(): void {
	if (((CodecB) as any) === undefined) {
		CodecB = __goscript_get_codecB()
	}
}

export function __goscript_get_CodecB(): Codec | $.VarRef<Codec> | null {
	if (((CodecB) as any) === undefined) {
		__goscript_init_CodecB()
	}
	return CodecB
}

export function __goscript_set_CodecB(__goscriptValue: Codec | $.VarRef<Codec> | null): void {
	CodecB = __goscriptValue
}

export var codecB: $.VarRef<Codec>

export function __goscript_init_codecB(): void {
	if (((codecB) as any) === undefined) {
		codecB = $.varRef(new Codec(true, "b", $.arrayValue(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 0, 1, 2, 3, 4]))))
	}
}

export function __goscript_get_codecB(): $.VarRef<Codec> {
	if (((codecB) as any) === undefined) {
		__goscript_init_codecB()
	}
	return codecB
}

export function __goscript_set_codecB(__goscriptValue: Codec): void {
	$.assignStruct(__goscript_get_codecB().value, __goscriptValue)
}

export var CodecC: Codec | $.VarRef<Codec> | null

export function __goscript_init_CodecC(): void {
	if (((CodecC) as any) === undefined) {
		CodecC = __goscript_get_codecC()
	}
}

export function __goscript_get_CodecC(): Codec | $.VarRef<Codec> | null {
	if (((CodecC) as any) === undefined) {
		__goscript_init_CodecC()
	}
	return CodecC
}

export function __goscript_set_CodecC(__goscriptValue: Codec | $.VarRef<Codec> | null): void {
	CodecC = __goscriptValue
}

export var codecC: $.VarRef<Codec>

export function __goscript_init_codecC(): void {
	if (((codecC) as any) === undefined) {
		codecC = $.varRef(new Codec(true, "c", $.arrayValue(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 0, 1, 2, 3, 4]))))
	}
}

export function __goscript_get_codecC(): $.VarRef<Codec> {
	if (((codecC) as any) === undefined) {
		__goscript_init_codecC()
	}
	return codecC
}

export function __goscript_set_codecC(__goscriptValue: Codec): void {
	$.assignStruct(__goscript_get_codecC().value, __goscriptValue)
}

export let Count: $.VarRef<Counter> = $.varRef(new Counter(true, 1))

export function __goscript_set_Count(__goscriptValue: Counter): void {
	$.assignStruct(Count.value, __goscriptValue)
}

export var listAll: $.Slice<Codec | $.VarRef<Codec> | null>

export function __goscript_init_listAll(): void {
	if (((listAll) as any) === undefined) {
		listAll = $.arrayToSlice<Codec | $.VarRef<Codec> | null>([__goscript_get_CodecA(), __goscript_get_CodecB()])
	}
}

export function __goscript_get_listAll(): $.Slice<Codec | $.VarRef<Codec> | null> {
	if (((listAll) as any) === undefined) {
		__goscript_init_listAll()
	}
	return listAll
}

export function __goscript_set_listAll(__goscriptValue: $.Slice<Codec | $.VarRef<Codec> | null>): void {
	listAll = __goscriptValue
}

export var All: $.Slice<Codec | $.VarRef<Codec> | null>

export function __goscript_init_All(): void {
	if (((All) as any) === undefined) {
		All = __goscript_get_listAll()
	}
}

export function __goscript_get_All(): $.Slice<Codec | $.VarRef<Codec> | null> {
	if (((All) as any) === undefined) {
		__goscript_init_All()
	}
	return All
}

export function __goscript_set_All(__goscriptValue: $.Slice<Codec | $.VarRef<Codec> | null>): void {
	All = __goscriptValue
}

export var Named: $.Slice<any>

export function __goscript_init_Named(): void {
	if (((Named) as any) === undefined) {
		Named = $.arrayToSlice<any>([$.interfaceValue(__goscript_get_CodecA(), "*tables.Codec", /* @__PURE__ */ $.pointerType("tables.Codec")), name("x", 9)])
	}
}

export function __goscript_get_Named(): $.Slice<any> {
	if (((Named) as any) === undefined) {
		__goscript_init_Named()
	}
	return Named
}

export function __goscript_set_Named(__goscriptValue: $.Slice<any>): void {
	Named = __goscriptValue
}

export let WithC: $.Slice<Codec | $.VarRef<Codec> | null> = $.arrayToSlice<Codec | $.VarRef<Codec> | null>([__goscript_get_CodecA(), __goscript_get_CodecC()])

export function __goscript_set_WithC(__goscriptValue: $.Slice<Codec | $.VarRef<Codec> | null>): void {
	WithC = __goscriptValue
}

export let WithCount: $.Slice<any> = $.arrayToSlice<any>([$.interfaceValue(__goscript_get_CodecA(), "*tables.Codec", /* @__PURE__ */ $.pointerType("tables.Codec")), $.structInterfaceValue((Count.value).clone(), "tables.Counter", "tables.Counter")])

export function __goscript_set_WithCount(__goscriptValue: $.Slice<any>): void {
	WithCount = __goscriptValue
}

export let masks: string[][] = $.arrayValue([$.arrayValue(globalThis.Array.from({ length: 4 }, () => "")), $.arrayValue(["zero", "one", "two", "three"])], /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("string"), 4), 2))

export function __goscript_set_masks(__goscriptValue: string[][]): void {
	masks = $.assignFieldValue(masks, __goscriptValue, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("string"), 4), 2))
}

export function name(s: string, n: number): string {
	return s + (masks[1])[$.checkArrayIndex(n & 3, 4)]
}

export function Label(s: string, n: number): string {
	return s + (masks[1])[$.checkArrayIndex(n & 3, 4)]
}

export let kinds: globalThis.Map<number, string> | null = $.makeMap<number, string>([[1, "one"]])

export function __goscript_set_kinds(__goscriptValue: globalThis.Map<number, string> | null): void {
	kinds = __goscriptValue
}

export let Kind: string = kindName(1)

export function __goscript_set_Kind(__goscriptValue: string): void {
	Kind = __goscriptValue
}

function __goscriptInit0(): void {
	$.mapSet(kinds, 1, "uno")
}

export function kindName(n: number): string {
	return $.mapGet<number, string, string>(kinds, n, "")[0]
}

__goscriptInit0()

// Generated file based on unsafe_pointer_erased_var.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/unsafe/index.js"

export type wordsAlias = bigint[]

$.registerNamedType("main.wordsAlias", /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint64"), 2));

export class entry {
	// tag leaves padding before the fixed-width fields.
	public declare tag: number

	// delta checks signed integer encoding.
	public declare delta: number

	// __proto__ uses the compiler's escaped struct storage key.
	public declare ___proto__: number

	// words checks nested fixed-width array storage.
	public declare words: bigint[]

	// weight checks the floating-point representation.
	public declare weight: number

	// live checks one-byte boolean storage.
	public declare live: boolean

	constructor(__goscriptValue?: boolean, tag$?: number, delta$?: number, ___proto__$?: number, words$?: bigint[], weight$?: number, live$?: boolean) {
		this.tag = tag$ ?? 0
		this.delta = delta$ ?? 0
		this.___proto__ = ___proto__$ ?? 0
		this.words = words$ ?? $.arrayValue(globalThis.Array.from({ length: 2 }, () => 0n))
		this.weight = weight$ ?? 0
		this.live = live$ ?? false
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): entry {
		return new entry(true, this.tag, this.delta, this.___proto__, $.cloneArrayValue(this.words, __goscriptStatic1()), this.weight, this.live)
	}

	public __goscriptAssign(source: entry): this {
		this.tag = source.tag
		this.delta = source.delta
		this.___proto__ = source.___proto__
		this.words = $.assignFieldValue(this.words, source.words, __goscriptStatic1())
		this.weight = source.weight
		this.live = source.live
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.entry",
		() => new entry(),
		() => [],
		entry,
		() => [{ name: "tag", key: "tag", type: /* @__PURE__ */ $.basicType("uint8") }, { name: "delta", key: "delta", type: /* @__PURE__ */ $.basicType("int16") }, { name: "__proto__", key: "___proto__", type: /* @__PURE__ */ $.basicType("uint16") }, { name: "words", key: "words", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint64"), 2) }, { name: "weight", key: "weight", type: /* @__PURE__ */ $.basicType("float32") }, { name: "live", key: "live", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export let table: $.VarRef<Uint8Array> = $.varRef($.arrayValue(new Uint8Array([1, 2, 3, 4])))

export function __goscript_set_table(__goscriptValue: Uint8Array): void {
	table.value = $.assignFieldValue(table.value, __goscriptValue, __goscriptStatic0())
}

export function acceptMatrix(_p0: $.VarRef<Uint8Array[]> | null): void {
}

export async function main(): globalThis.Promise<void> {
	// Preserve the address of a byte array through an erased pointer.
	let ptr = (table as any)
	let bytes = $.unsafeByteView<$.VarRef<Uint8Array> | null>(ptr, __goscriptStatic2())
	await $.println((($.pointerValue<Uint8Array>(bytes)))[2])

	// View the same bytes as a nested array.
	ptr = (table as any)
	acceptMatrix($.unsafeByteView<$.VarRef<Uint8Array[]> | null>(ptr, __goscriptStatic3()))

	// An erased byte pointer exposes the target's padded layout and strides.
	const stride: number = 32
	let storage: $.VarRef<Uint8Array> = $.varRef($.arrayValue(new Uint8Array(64)))
	let erased = (storage as any)
	let entries = $.unsafeByteView<$.VarRef<entry[]> | null>(erased, __goscriptStatic4())

	// Store each numeric kind through the shared fields.
	$.arrayIndex($.pointerValue<entry[]>(entries), 1).tag = 9
	$.arrayIndex($.pointerValue<entry[]>(entries), 1).delta = -2
	$.arrayIndex($.pointerValue<entry[]>(entries), 1).___proto__ = 0x1234
	$.arrayIndex($.pointerValue<entry[]>(entries), 1).words[1] = 1234605616436508552n
	$.arrayIndex($.pointerValue<entry[]>(entries), 1).weight = 1.5
	$.arrayIndex($.pointerValue<entry[]>(entries), 1).live = true

	// Check the byte order, padding and root pointer identity.
	const words: number = 8
	const weight: number = 24
	await $.println("layout", storage.value[32], storage.value[$.wideUintAdd(40, 8)], storage.value[$.wideUintAdd(40, 15)], storage.value[$.wideUintAdd(56, 2)], storage.value[$.wideUintAdd(56, 3)])
	await $.println("values", ($.arrayIndex($.pointerValue<entry[]>(entries), 1).words)[1] == 1234605616436508552n, $.arrayIndex($.pointerValue<entry[]>(entries), 1).weight == 1.5, $.arrayIndex($.pointerValue<entry[]>(entries), 1).live)

	// Read signed and escaped fields through the same padded storage.
	const delta: number = 2
	await $.println("signed", storage.value[$.wideUintAdd(32, 2)], storage.value[$.wideUintAdd(34, 1)], $.arrayIndex($.pointerValue<entry[]>(entries), 1).delta)
	const escaped: number = 4
	await $.println("field", storage.value[$.wideUintAdd(32, 4)], $.arrayIndex($.pointerValue<entry[]>(entries), 1).___proto__)

	// The original pointer retains the root's byte address.
	await $.println("roots", ((entries as any) === erased || ($.pointerAliasesMade || ((entries as any) as any)?.__goElementBacking !== undefined) && $.pointerEqual((entries as any), erased)))

	// Aliased subviews share writes and addresses; copying a value stays separate.
	let second = $.unsafeByteView<entry | $.VarRef<entry> | null>(($.indexRef(storage.value, 32) as any), __goscriptStatic5())
	let nested = $.unsafeByteView<entry | $.VarRef<entry> | null>(($.indexRef($.pointerValue<entry[]>(entries), 1) as any), __goscriptStatic5())
	storage.value[32] = 11
	await $.println("alias", $.pointerValue<entry>(second).tag, $.pointerValue<entry>(nested).tag, $.pointerEqual(($.indexRef($.pointerValue<entry[]>(entries), 1) as any), (second as any)), $.pointerEqual(($.indexRef($.arrayIndex($.pointerValue<entry[]>(entries), 1).words, 1) as any), ($.indexRef(storage.value, $.wideUintAdd(40, 8)) as any)))
	let copy = ($.arrayIndex($.pointerValue<entry[]>(entries), 1)).clone()
	copy.words[1] = 7n
	await $.println("copy", ($.arrayIndex($.pointerValue<entry[]>(entries), 1).words)[1] == 1234605616436508552n, copy.words[1])

	// Ordinary pointer casts between named arrays keep their field reference.
	let wordsView = $.fieldRef($.arrayIndex($.pointerValue<entry[]>(entries), 1), "words")
	await $.println("named array", $.arrayIndex($.pointerValue<bigint[]>(wordsView), 1) == ($.arrayIndex($.pointerValue<entry[]>(entries), 1).words)[1])

	// Scalar pointers reload their bytes after writes through either alias.
	let scalar = $.unsafeByteView<$.VarRef<bigint> | null>(($.indexRef(storage.value, $.wideUintAdd(40, 8)) as any), __goscriptStatic6())
	await $.println("scalar", $.pointerValue<bigint>(scalar) == ($.arrayIndex($.pointerValue<entry[]>(entries), 1).words)[1])
	scalar!.value = 1234605616436508569n
	storage.value[$.wideUintAdd(40, 8)] = 0xaa
	await $.println("scalar write", $.pointerValue<bigint>(scalar) == 1234605616436508586n, ($.arrayIndex($.pointerValue<entry[]>(entries), 1).words)[1] == $.pointerValue<bigint>(scalar))

	// Recasts of scalar and field references retain the same byte origin.
	let unsigned = $.unsafeByteView<$.VarRef<number> | null>(($.fieldRef($.arrayIndex($.pointerValue<entry[]>(entries), 1), "delta") as any), __goscriptStatic7(), "int16")
	await $.println("field cast", $.pointerValue<number>(unsigned) == 65534)
	unsigned!.value = 65533
	await $.println("field write", $.arrayIndex($.pointerValue<entry[]>(entries), 1).delta == -3)
	let fieldBytes = $.unsafeByteView<$.VarRef<Uint8Array> | null>(($.fieldRef($.arrayIndex($.pointerValue<entry[]>(entries), 1), "delta") as any), __goscriptStatic8(), undefined, 2)
	$.pointerValue<Uint8Array>(fieldBytes)[0] = 0xfc
	await $.println("direct field bytes", $.arrayIndex($.pointerValue<entry[]>(entries), 1).delta == -4, $.arrayIndex($.pointerValue<Uint8Array>(fieldBytes), 1) == 0xff)
	let back = $.unsafeByteView<$.VarRef<Uint8Array> | null>((scalar as any), __goscriptStatic9())
	$.pointerValue<Uint8Array>(back)[0] = 0xbb
	await $.println("cast back", $.pointerValue<bigint>(scalar) == 1234605616436508603n, ($.arrayIndex($.pointerValue<entry[]>(entries), 1).words)[1] == $.pointerValue<bigint>(scalar))

	// A nonzero byte-slice window retains its backing capacity past its length.
	let window = $.goSlice(storage.value, 1, $.wideUintAdd(32, 1))
	let windowEntry = $.unsafeByteView<entry | $.VarRef<entry> | null>(($.indexRef(window!, $.wideUintSub(32, 1)) as any), __goscriptStatic5())
	let windowEntry$: entry = windowEntry == null ? $.pointerTarget<entry>(windowEntry) : (windowEntry as any).__isVarRef === true ? (windowEntry as any).value : (windowEntry as any).__goValue === undefined ? (windowEntry as any) : $.pointerTarget<entry>(windowEntry)
	await $.println("window", (windowEntry$ as entry).tag == $.arrayIndex($.pointerValue<entry[]>(entries), 1).tag, $.sliceLen(window) == 32, $.cap(window) == 63);
	;(windowEntry$ as entry).tag = 12
	let byteView = $.unsafeByteView<$.VarRef<Uint8Array> | null>(($.indexRef(window!, $.wideUintSub(32, 1)) as any), __goscriptStatic10())
	$.pointerValue<Uint8Array>(byteView)[0] = 13
	await $.println("window write", $.arrayIndex($.pointerValue<entry[]>(entries), 1).tag, $.arrayIndex($.pointerValue<Uint8Array>(byteView), 0))
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint64"), 2))
}

var __goscriptStatic2$value: any
function __goscriptStatic2(): any {
	return __goscriptStatic2$value ??= ({ size: 4, align: 1, kind: "array", length: 4, element: { size: 1, align: 1, kind: "scalar", scalar: "uint8" } })
}

var __goscriptStatic3$value: any
function __goscriptStatic3(): any {
	return __goscriptStatic3$value ??= ({ size: 4, align: 1, kind: "array", length: 2, element: { size: 2, align: 1, kind: "array", length: 2, element: { size: 1, align: 1, kind: "scalar", scalar: "uint8" } } })
}

var __goscriptStatic4$value: any
function __goscriptStatic4(): any {
	return __goscriptStatic4$value ??= ({ size: 64, align: 8, kind: "array", length: 2, element: { size: 32, align: 8, kind: "struct", create: () => new entry(), fields: [{ key: "tag", offset: 0, layout: { size: 1, align: 1, kind: "scalar", scalar: "uint8" } }, { key: "delta", offset: 2, layout: { size: 2, align: 2, kind: "scalar", scalar: "int16" } }, { key: "___proto__", offset: 4, layout: { size: 2, align: 2, kind: "scalar", scalar: "uint16" } }, { key: "words", offset: 8, layout: { size: 16, align: 8, kind: "array", length: 2, element: { size: 8, align: 8, kind: "scalar", scalar: "uint64" } } }, { key: "weight", offset: 24, layout: { size: 4, align: 4, kind: "scalar", scalar: "float32" } }, { key: "live", offset: 28, layout: { size: 1, align: 1, kind: "scalar", scalar: "bool" } }] } })
}

var __goscriptStatic5$value: any
function __goscriptStatic5(): any {
	return __goscriptStatic5$value ??= ({ size: 32, align: 8, kind: "struct", create: () => new entry(), fields: [{ key: "tag", offset: 0, layout: { size: 1, align: 1, kind: "scalar", scalar: "uint8" } }, { key: "delta", offset: 2, layout: { size: 2, align: 2, kind: "scalar", scalar: "int16" } }, { key: "___proto__", offset: 4, layout: { size: 2, align: 2, kind: "scalar", scalar: "uint16" } }, { key: "words", offset: 8, layout: { size: 16, align: 8, kind: "array", length: 2, element: { size: 8, align: 8, kind: "scalar", scalar: "uint64" } } }, { key: "weight", offset: 24, layout: { size: 4, align: 4, kind: "scalar", scalar: "float32" } }, { key: "live", offset: 28, layout: { size: 1, align: 1, kind: "scalar", scalar: "bool" } }] })
}

var __goscriptStatic6$value: any
function __goscriptStatic6(): any {
	return __goscriptStatic6$value ??= ({ size: 8, align: 8, kind: "scalar", scalar: "uint64" })
}

var __goscriptStatic7$value: any
function __goscriptStatic7(): any {
	return __goscriptStatic7$value ??= ({ size: 2, align: 2, kind: "scalar", scalar: "uint16" })
}

var __goscriptStatic8$value: any
function __goscriptStatic8(): any {
	return __goscriptStatic8$value ??= ({ size: 2, align: 1, kind: "array", length: 2, element: { size: 1, align: 1, kind: "scalar", scalar: "uint8" } })
}

var __goscriptStatic9$value: any
function __goscriptStatic9(): any {
	return __goscriptStatic9$value ??= ({ size: 8, align: 1, kind: "array", length: 8, element: { size: 1, align: 1, kind: "scalar", scalar: "uint8" } })
}

var __goscriptStatic10$value: any
function __goscriptStatic10(): any {
	return __goscriptStatic10$value ??= ({ size: 3, align: 1, kind: "array", length: 3, element: { size: 1, align: 1, kind: "scalar", scalar: "uint8" } })
}

if ($.isMainScript(import.meta)) {
	await main()
}

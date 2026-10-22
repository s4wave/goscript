// Generated file based on reflect_set_bytes.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as reflect from "@goscript/reflect/index.js"

export type Blob = $.Slice<number>

$.registerNamedType("main.Blob", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")));

export class Doc {
	public declare Data: $.Slice<number>

	public declare Named: Blob

	public declare Parts: $.Slice<$.Slice<number>>

	constructor(__goscriptValue?: boolean, Data$?: $.Slice<number>, Named$?: Blob, Parts$?: $.Slice<$.Slice<number>>) {
		this.Data = Data$ ?? (null! as $.Slice<number>)
		this.Named = Named$ ?? (null! as Blob)
		this.Parts = Parts$ ?? (null! as $.Slice<$.Slice<number>>)
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): Doc {
		return new Doc(true, this.Data, this.Named, this.Parts)
	}

	public __goscriptAssign(source: Doc): this {
		this.Data = source.Data
		this.Named = source.Named
		this.Parts = source.Parts
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.Doc",
		() => new Doc(),
		() => [],
		Doc,
		() => [/* @__PURE__ */ $.structField("Data", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")), [0], 0, true), /* @__PURE__ */ $.structField("Named", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "main.Blob"), [1], 24, true), /* @__PURE__ */ $.structField("Parts", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))), [2], 48, true)]
	)
}

export async function main(): globalThis.Promise<void> {
	let d: $.VarRef<Doc> = $.varRef(new Doc(true))
	let dv = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(d, "*main.Doc", /* @__PURE__ */ $.pointerType("main.Doc"))))).Elem()))

	// Set a byte slice field.
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(dv)).Field(0))).SetBytes(new Uint8Array([104, 101, 108, 108, 111]))
	await $.println("Data:", $.bytesToString(d.value.Data), $.sliceLen(d.value.Data))

	// Set a field of a named byte slice type.
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(dv)).Field(1))).SetBytes(new Uint8Array([110, 97, 109, 101, 100]))
	await $.println("Named:", $.bytesToString(d.value.Named))

	// Set an element of a slice of byte slices.
	d.value.Parts = $.makeSlice<$.Slice<number>>(2)
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(dv)).Field(2))).Index(1))).SetBytes(new Uint8Array([112, 97, 114, 116]))
	await $.println("Parts:", $.sliceLen($.arrayIndex(d.value.Parts!, 0)), $.bytesToString($.arrayIndex(d.value.Parts!, 1)))

	// Set a byte slice variable through a pointer.
	let b: $.VarRef<$.Slice<number>> = $.varRef(null! as $.Slice<number>)
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue(b, "*[]byte", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"))))))).Elem())).SetBytes(new Uint8Array([118, 97, 114]))
	await $.println("var:", $.bytesToString(b.value))

	// The value shares storage with the slice it was set from.
	let src = new Uint8Array([97, 98, 99])
	$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(dv)).Field(0))).SetBytes(src)
	$.sliceElems(src!)[$.sliceSlot(src!, 0)] = 88
	await $.println("shared:", $.bytesToString(d.value.Data))

	// Bytes reads back the value that was set.
	await $.println("Bytes:", $.bytesToString($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(dv)).Field(0))).Bytes()))
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on marshal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes2 from "@goscript/bytes/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as big from "@goscript/math/big/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as slices from "@goscript/slices/index.js"

import * as time from "@goscript/time/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

import * as __goscript_asn1 from "./asn1.gs.ts"

import * as __goscript_common from "./common.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/math/big/index.js"
import "@goscript/reflect/index.js"
import "@goscript/slices/index.js"
import "@goscript/time/index.js"
import "@goscript/unicode/utf8/index.js"
import "./asn1.gs.ts"
import "./common.gs.ts"

export type encoder = {
	Encode(dst: $.Slice<number>): void
	Len(): number | globalThis.Promise<number>
}

$.registerInterfaceType(
	"asn1.encoder",
	null,
	[{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]
);

export type byteEncoder = number

export type bytesEncoder = $.Slice<number>

export type stringEncoder = string

export type multiEncoder = $.Slice<encoder | null>

export type setEncoder = $.Slice<encoder | null>

export type int64Encoder = bigint

export type oidEncoder = $.Slice<number>

export class taggedEncoder {
	// scratch contains temporary space for encoding the tag and length of
	// an element in order to avoid extra allocations.
	public get scratch(): Uint8Array {
		return this._fields.scratch.value
	}
	public set scratch(value: Uint8Array) {
		this._fields.scratch.value = value
	}

	public get tag(): encoder | null {
		return this._fields.tag.value
	}
	public set tag(value: encoder | null) {
		this._fields.tag.value = value
	}

	public get body(): encoder | null {
		return this._fields.body.value
	}
	public set body(value: encoder | null) {
		this._fields.body.value = value
	}

	public _fields: {
		scratch: $.VarRef<Uint8Array>
		tag: $.VarRef<encoder | null>
		body: $.VarRef<encoder | null>
	}

	constructor(init?: Partial<{scratch?: Uint8Array, tag?: encoder | null, body?: encoder | null}>) {
		this._fields = {
			scratch: $.varRef(init?.scratch !== undefined ? $.cloneArrayValue(init.scratch) : new Uint8Array(8)),
			tag: $.varRef(init?.tag ?? (null as encoder | null)),
			body: $.varRef(init?.body ?? (null as encoder | null))
		}
	}

	public clone(): taggedEncoder {
		const cloned = new taggedEncoder()
		cloned._fields = {
			scratch: $.varRef($.cloneArrayValue(this._fields.scratch.value)),
			tag: $.varRef(this._fields.tag.value),
			body: $.varRef(this._fields.body.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Encode(dst: $.Slice<number>): globalThis.Promise<void> {
		const t: taggedEncoder | $.VarRef<taggedEncoder> | null = this
		await $.pointerValue<Exclude<encoder, null>>($.pointerValue<taggedEncoder>(t).tag).Encode(dst)
		await $.pointerValue<Exclude<encoder, null>>($.pointerValue<taggedEncoder>(t).body).Encode($.goSlice(dst, await $.pointerValue<Exclude<encoder, null>>($.pointerValue<taggedEncoder>(t).tag).Len(), undefined))
	}

	public async Len(): globalThis.Promise<number> {
		const t: taggedEncoder | $.VarRef<taggedEncoder> | null = this
		return await $.pointerValue<Exclude<encoder, null>>($.pointerValue<taggedEncoder>(t).tag).Len() + await $.pointerValue<Exclude<encoder, null>>($.pointerValue<taggedEncoder>(t).body).Len()
	}

	static __typeInfo = $.registerStructType(
		"asn1.taggedEncoder",
		() => new taggedEncoder(),
		[{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		taggedEncoder,
		[{ name: "scratch", key: "scratch", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 8 }, pkgPath: "encoding/asn1", index: [0], offset: 0, exported: false }, { name: "tag", key: "tag", type: "asn1.encoder", pkgPath: "encoding/asn1", index: [1], offset: 8, exported: false }, { name: "body", key: "body", type: "asn1.encoder", pkgPath: "encoding/asn1", index: [2], offset: 24, exported: false }]
	)
}

export class bitStringEncoder {
	public get Bytes(): $.Slice<number> {
		return this._fields.Bytes.value
	}
	public set Bytes(value: $.Slice<number>) {
		this._fields.Bytes.value = value
	}

	public get BitLength(): number {
		return this._fields.BitLength.value
	}
	public set BitLength(value: number) {
		this._fields.BitLength.value = value
	}

	public _fields: {
		Bytes: $.VarRef<$.Slice<number>>
		BitLength: $.VarRef<number>
	}

	constructor(init?: Partial<{Bytes?: $.Slice<number>, BitLength?: number}>) {
		this._fields = {
			Bytes: $.varRef(init?.Bytes ?? (null as $.Slice<number>)),
			BitLength: $.varRef(init?.BitLength ?? (0 as number))
		}
	}

	public clone(): bitStringEncoder {
		const cloned = new bitStringEncoder()
		cloned._fields = {
			Bytes: $.varRef(this._fields.Bytes.value),
			BitLength: $.varRef(this._fields.BitLength.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Encode(dst: $.Slice<number>): void {
		const b = this
		dst![0] = $.uint($.uint((8 - (b.BitLength % 8)) % 8, 8), 8)
		if ($.copy($.goSlice(dst, 1, undefined), b.Bytes) != $.len(b.Bytes)) {
			$.panic("internal error")
		}
	}

	public Len(): number {
		const b = this
		return $.len(b.Bytes) + 1
	}

	static __typeInfo = $.registerStructType(
		"asn1.bitStringEncoder",
		() => new bitStringEncoder(),
		[{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }],
		bitStringEncoder,
		[{ name: "Bytes", key: "Bytes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "BitLength", key: "BitLength", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 24, exported: true }]
	)
}

export let byte00Encoder: encoder | null = $.namedValueInterfaceValue<encoder | null>(0x00, "asn1.byteEncoder", {Encode: (receiver: any, ...args: any[]) => (byteEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (byteEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "asn1.byteEncoder" }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])

export function __goscript_set_byte00Encoder(__goscriptValue: encoder | null): void {
	byte00Encoder = __goscriptValue
}

export let byteFFEncoder: encoder | null = $.namedValueInterfaceValue<encoder | null>(0xff, "asn1.byteEncoder", {Encode: (receiver: any, ...args: any[]) => (byteEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (byteEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "asn1.byteEncoder" }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])

export function __goscript_set_byteFFEncoder(__goscriptValue: encoder | null): void {
	byteFFEncoder = __goscriptValue
}

export function byteEncoder_Len(c: byteEncoder): number {
	return 1
}

export function byteEncoder_Encode(c: byteEncoder, dst: $.Slice<number>): void {
	dst![0] = $.uint($.uint(c, 8), 8)
}

export function bytesEncoder_Len(b: bytesEncoder): number {
	return $.len((b as bytesEncoder))
}

export function bytesEncoder_Encode(b: bytesEncoder, dst: $.Slice<number>): void {
	if ($.copy(dst, (b as bytesEncoder)) != $.len((b as bytesEncoder))) {
		$.panic("internal error")
	}
}

export function stringEncoder_Len(s: stringEncoder): number {
	return $.len(s)
}

export function stringEncoder_Encode(s: stringEncoder, dst: $.Slice<number>): void {
	if ($.copy(dst, s) != $.len(s)) {
		$.panic("internal error")
	}
}

export async function multiEncoder_Len(m: multiEncoder): globalThis.Promise<number> {
	let size: number = 0
	for (let __goscriptRangeTarget0 = m, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let e = __goscriptRangeTarget0![__rangeIndex]
		size = size + (await $.pointerValue<Exclude<encoder, null>>(e).Len())
	}
	return size
}

export async function multiEncoder_Encode(m: multiEncoder, dst: $.Slice<number>): globalThis.Promise<void> {
	let off: number = 0
	for (let __goscriptRangeTarget1 = m, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let e = __goscriptRangeTarget1![__rangeIndex]
		await $.pointerValue<Exclude<encoder, null>>(e).Encode($.goSlice(dst, off, undefined))
		off = off + (await $.pointerValue<Exclude<encoder, null>>(e).Len())
	}
}

export async function setEncoder_Len(s: setEncoder): globalThis.Promise<number> {
	let size: number = 0
	for (let __goscriptRangeTarget2 = s, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let e = __goscriptRangeTarget2![__rangeIndex]
		size = size + (await $.pointerValue<Exclude<encoder, null>>(e).Len())
	}
	return size
}

export async function setEncoder_Encode(s: setEncoder, dst: $.Slice<number>): globalThis.Promise<void> {
	// Per X690 Section 11.6: The encodings of the component values of a
	// set-of value shall appear in ascending order, the encodings being
	// compared as octet strings with the shorter components being padded
	// at their trailing end with 0-octets.
	//
	// First we encode each element to its TLV encoding and then use
	// octetSort to get the ordering expected by X690 DER rules before
	// writing the sorted encodings out to dst.
	let l: $.Slice<$.Slice<number>> = $.makeSlice<$.Slice<number>>($.len((s as setEncoder)))
	for (let __goscriptRangeTarget3 = s, i = 0; i < $.len(__goscriptRangeTarget3); i++) {
		let e = __goscriptRangeTarget3![i]
		l![i] = $.makeSlice<number>(await $.pointerValue<Exclude<encoder, null>>(e).Len(), undefined, "byte")
		await $.pointerValue<Exclude<encoder, null>>(e).Encode($.arrayIndex(l!, i))
	}

	// Since we are using bytes.Compare to compare TLV encodings we
	// don't need to right pad s[i] and s[j] to the same length as
	// suggested in X690. If len(s[i]) < len(s[j]) the length octet of
	// s[i], which is the first determining byte, will inherently be
	// smaller than the length octet of s[j]. This lets us skip the
	// padding step.
	await slices.SortFunc(l, bytes2.Compare)

	let off: number = 0
	for (let __goscriptRangeTarget4 = l, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let b = __goscriptRangeTarget4![__rangeIndex]
		$.copy($.goSlice(dst, off, undefined), b)
		off = off + ($.len(b))
	}
}

export function int64Encoder_Len(i: int64Encoder): number {
	let n = 1

	while (i > 127n) {
		n++
		i = $.int64Shr(i, 8n)
	}

	while (i < -128n) {
		n++
		i = $.int64Shr(i, 8n)
	}

	return n
}

export function int64Encoder_Encode(i: int64Encoder, dst: $.Slice<number>): void {
	let n = int64Encoder_Len(i)

	for (let j = 0; j < n; j++) {
		dst![j] = $.uint($.uint($.int64Shr(i, $.uint(((n - 1) - j) * 8, 64)), 8), 8)
	}
}

export function base128IntLength(n: bigint): number {
	if (n == 0n) {
		return 1
	}

	let l = 0
	for (let i = n; i > 0n; i = $.int64Shr(i, 7n)) {
		l++
	}

	return l
}

export function appendBase128Int(dst: $.Slice<number>, n: bigint): $.Slice<number> {
	let l = base128IntLength(n)

	for (let i = l - 1; i >= 0; i--) {
		let o = $.uint($.uint($.int64Shr(n, $.uint(i * 7, 64)), 8), 8)
		o = o & ($.uint(0x7f, 8))
		if (i != 0) {
			o = o | ($.uint(0x80, 8))
		}

		dst = $.append(dst, $.uint(o, 8), $.byteSliceHint)
	}

	return dst
}

export function makeBigInt(n: big.Int | $.VarRef<big.Int> | null): [encoder | null, $.GoError] {
	if (n == null) {
		return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_asn1.StructuralError({Msg: "empty integer"})), "asn1.StructuralError", "asn1.StructuralError")]
	}

	if (big.Int.prototype.Sign.call(n) < 0) {
		// A negative number has to be converted to two's-complement
		// form. So we'll invert and subtract 1. If the
		// most-significant-bit isn't set then we'll need to pad the
		// beginning with 0xff in order to keep the number negative.
		let nMinus1: big.Int | $.VarRef<big.Int> | null = big.Int.prototype.Neg.call(new big.Int(), n)
		big.Int.prototype.Sub.call(nMinus1, nMinus1, __goscript_asn1.bigOne)
		let __goscriptShadow0: $.Slice<number> = big.Int.prototype.Bytes.call(nMinus1)
		for (let __goscriptRangeTarget5 = __goscriptShadow0, i = 0; i < $.len(__goscriptRangeTarget5); i++) {
			__goscriptShadow0![i] = __goscriptShadow0![i] ^ ($.uint(0xff, 8))
		}
		if (($.len(__goscriptShadow0) == 0) || ($.uint(($.arrayIndex(__goscriptShadow0!, 0) & 0x80), 8) == $.uint(0, 8))) {
			return [$.namedValueInterfaceValue<encoder | null>(($.arrayToSlice<encoder | null>([byteFFEncoder, $.namedValueInterfaceValue<encoder | null>((__goscriptShadow0 as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])]) as multiEncoder), "asn1.multiEncoder", {Encode: (receiver: any, ...args: any[]) => (multiEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (multiEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.multiEncoder", elemType: "asn1.encoder" }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
		}
		return [$.namedValueInterfaceValue<encoder | null>((__goscriptShadow0 as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
	} else {
		if (big.Int.prototype.Sign.call(n) == 0) {
			// Zero is written as a single 0 zero rather than no bytes.
			return [byte00Encoder, null]
		} else {
			let __goscriptShadow1: $.Slice<number> = big.Int.prototype.Bytes.call(n)
			if (($.len(__goscriptShadow1) > 0) && ($.uint(($.arrayIndex(__goscriptShadow1!, 0) & 0x80), 8) != $.uint(0, 8))) {
				// We'll have to pad this with 0x00 in order to stop it
				// looking like a negative number.
				return [$.namedValueInterfaceValue<encoder | null>(($.arrayToSlice<encoder | null>([byte00Encoder, $.namedValueInterfaceValue<encoder | null>((__goscriptShadow1 as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])]) as multiEncoder), "asn1.multiEncoder", {Encode: (receiver: any, ...args: any[]) => (multiEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (multiEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.multiEncoder", elemType: "asn1.encoder" }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
			}
			return [$.namedValueInterfaceValue<encoder | null>((__goscriptShadow1 as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function appendLength(dst: $.Slice<number>, i: number): $.Slice<number> {
	let n = lengthLength(i)

	for (; n > 0; n--) {
		dst = $.append(dst, $.uint($.uint(i >> $.uint((n - 1) * 8, 64), 8), 8), $.byteSliceHint)
	}

	return dst
}

export function lengthLength(i: number): number {
	let numBytes: number = 0
	numBytes = 1
	while (i > 255) {
		numBytes++
		i = i >> (8)
	}
	return numBytes
}

export function appendTagAndLength(dst: $.Slice<number>, t: __goscript_common.tagAndLength): $.Slice<number> {
	let b = $.uint($.uint(t._class, 8) << 6, 8)
	if (t.isCompound) {
		b = b | ($.uint(0x20, 8))
	}
	if (t.tag >= 31) {
		b = b | ($.uint(0x1f, 8))
		dst = $.append(dst, $.uint(b, 8), $.byteSliceHint)
		dst = appendBase128Int(dst, $.int64(t.tag))
	} else {
		b = b | ($.uint($.uint(t.tag, 8), 8))
		dst = $.append(dst, $.uint(b, 8), $.byteSliceHint)
	}

	if (t.length >= 128) {
		let l = lengthLength(t.length)
		dst = $.append(dst, $.uint(0x80 | $.uint(l, 8), 8), $.byteSliceHint)
		dst = appendLength(dst, t.length)
	} else {
		dst = $.append(dst, $.uint($.uint(t.length, 8), 8), $.byteSliceHint)
	}

	return dst
}

export function oidEncoder_Len(oid: oidEncoder): number {
	let l = base128IntLength($.int64(($.arrayIndex(oid!, 0) * 40) + $.arrayIndex(oid!, 1)))
	for (let i = 2; i < $.len((oid as oidEncoder)); i++) {
		l = l + (base128IntLength($.int64($.arrayIndex(oid!, i))))
	}
	return l
}

export function oidEncoder_Encode(oid: oidEncoder, dst: $.Slice<number>): void {
	dst = appendBase128Int($.goSlice(dst, undefined, 0), $.int64(($.arrayIndex(oid!, 0) * 40) + $.arrayIndex(oid!, 1)))
	for (let i = 2; i < $.len((oid as oidEncoder)); i++) {
		dst = appendBase128Int(dst, $.int64($.arrayIndex(oid!, i)))
	}
}

export function makeObjectIdentifier(oid: $.Slice<number>): [encoder | null, $.GoError] {
	let e: encoder | null = null as encoder | null
	let err: $.GoError = null as $.GoError
	if ((($.len(oid) < 2) || ($.arrayIndex(oid!, 0) > 2)) || (($.arrayIndex(oid!, 0) < 2) && ($.arrayIndex(oid!, 1) >= 40))) {
		return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_asn1.StructuralError({Msg: "invalid object identifier"})), "asn1.StructuralError", "asn1.StructuralError")]
	}

	return [$.namedValueInterfaceValue<encoder | null>((oid as oidEncoder), "asn1.oidEncoder", {Encode: (receiver: any, ...args: any[]) => (oidEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (oidEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.oidEncoder", elemType: { kind: $.TypeKind.Basic, name: "int" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
}

export function makePrintableString(s: string): [encoder | null, $.GoError] {
	let e: encoder | null = null as encoder | null
	let err: $.GoError = null as $.GoError
	for (let i = 0; i < $.len(s); i++) {
		// The asterisk is often used in PrintableString, even though
		// it is invalid. If a PrintableString was specifically
		// requested then the asterisk is permitted by this code.
		// Ampersand is allowed in parsing due a handful of CA
		// certificates, however when making new certificates
		// it is rejected.
		if (!__goscript_asn1.isPrintable($.uint($.indexStringOrBytes(s, i), 8), true, false)) {
			return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_asn1.StructuralError({Msg: "PrintableString contains invalid character"})), "asn1.StructuralError", "asn1.StructuralError")]
		}
	}

	return [$.namedValueInterfaceValue<encoder | null>(s, "asn1.stringEncoder", {Encode: (receiver: any, ...args: any[]) => (stringEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (stringEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Basic, name: "string", typeName: "asn1.stringEncoder" }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
}

export function makeIA5String(s: string): [encoder | null, $.GoError] {
	let e: encoder | null = null as encoder | null
	let err: $.GoError = null as $.GoError
	for (let i = 0; i < $.len(s); i++) {
		if ($.uint($.indexStringOrBytes(s, i), 8) > $.uint(127, 8)) {
			return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_asn1.StructuralError({Msg: "IA5String contains invalid character"})), "asn1.StructuralError", "asn1.StructuralError")]
		}
	}

	return [$.namedValueInterfaceValue<encoder | null>(s, "asn1.stringEncoder", {Encode: (receiver: any, ...args: any[]) => (stringEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (stringEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Basic, name: "string", typeName: "asn1.stringEncoder" }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
}

export function makeNumericString(s: string): [encoder | null, $.GoError] {
	let e: encoder | null = null as encoder | null
	let err: $.GoError = null as $.GoError
	for (let i = 0; i < $.len(s); i++) {
		if (!__goscript_asn1.isNumeric($.uint($.indexStringOrBytes(s, i), 8))) {
			return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_asn1.StructuralError({Msg: "NumericString contains invalid character"})), "asn1.StructuralError", "asn1.StructuralError")]
		}
	}

	return [$.namedValueInterfaceValue<encoder | null>(s, "asn1.stringEncoder", {Encode: (receiver: any, ...args: any[]) => (stringEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (stringEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Basic, name: "string", typeName: "asn1.stringEncoder" }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
}

export function makeUTF8String(s: string): encoder | null {
	return $.namedValueInterfaceValue<encoder | null>(s, "asn1.stringEncoder", {Encode: (receiver: any, ...args: any[]) => (stringEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (stringEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Basic, name: "string", typeName: "asn1.stringEncoder" }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])
}

export function appendTwoDigits(dst: $.Slice<number>, v: number): $.Slice<number> {
	return $.append(dst, $.uint($.uint(48 + ((Math.trunc(v / 10)) % 10), 8), 8), $.uint($.uint(48 + (v % 10), 8), 8), $.byteSliceHint)
}

export function appendFourDigits(dst: $.Slice<number>, v: number): $.Slice<number> {
	return $.append(dst, $.uint($.uint(48 + ((Math.trunc(v / 1000)) % 10), 8), 8), $.uint($.uint(48 + ((Math.trunc(v / 100)) % 10), 8), 8), $.uint($.uint(48 + ((Math.trunc(v / 10)) % 10), 8), 8), $.uint($.uint(48 + (v % 10), 8), 8), $.byteSliceHint)
}

export function outsideUTCRange(t: time.Time): boolean {
	let year = $.markAsStructValue($.cloneStructValue(t)).Year()
	return (year < 1950) || (year >= 2050)
}

export function makeUTCTime(t: time.Time): [encoder | null, $.GoError] {
	let e: encoder | null = null as encoder | null
	let err: $.GoError = null as $.GoError
	let dst: $.Slice<number> = $.makeSlice<number>(0, 18, "byte")

	let __goscriptTuple0: any = appendUTCTime(dst, $.markAsStructValue($.cloneStructValue(t)))
	dst = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	if (err != null) {
		return [null, err]
	}

	return [$.namedValueInterfaceValue<encoder | null>((dst as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
}

export function makeGeneralizedTime(t: time.Time): [encoder | null, $.GoError] {
	let e: encoder | null = null as encoder | null
	let err: $.GoError = null as $.GoError
	let dst: $.Slice<number> = $.makeSlice<number>(0, 20, "byte")

	let __goscriptTuple1: any = appendGeneralizedTime(dst, $.markAsStructValue($.cloneStructValue(t)))
	dst = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		return [null, err]
	}

	return [$.namedValueInterfaceValue<encoder | null>((dst as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
}

export function appendUTCTime(dst: $.Slice<number>, t: time.Time): [$.Slice<number>, $.GoError] {
	let ret: $.Slice<number> = null as $.Slice<number>
	let err: $.GoError = null as $.GoError
	let year = $.markAsStructValue($.cloneStructValue(t)).Year()

	switch (true) {
		case (1950 <= year) && (year < 2000):
		{
			dst = appendTwoDigits(dst, year - 1900)
			break
		}
		case (2000 <= year) && (year < 2050):
		{
			dst = appendTwoDigits(dst, year - 2000)
			break
		}
		default:
		{
			return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_asn1.StructuralError({Msg: "cannot represent time as UTCTime"})), "asn1.StructuralError", "asn1.StructuralError")]
			break
		}
	}

	return [appendTimeCommon(dst, $.markAsStructValue($.cloneStructValue(t))), null]
}

export function appendGeneralizedTime(dst: $.Slice<number>, t: time.Time): [$.Slice<number>, $.GoError] {
	let ret: $.Slice<number> = null as $.Slice<number>
	let err: $.GoError = null as $.GoError
	let year = $.markAsStructValue($.cloneStructValue(t)).Year()
	if ((year < 0) || (year > 9999)) {
		return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_asn1.StructuralError({Msg: "cannot represent time as GeneralizedTime"})), "asn1.StructuralError", "asn1.StructuralError")]
	}

	dst = appendFourDigits(dst, year)

	return [appendTimeCommon(dst, $.markAsStructValue($.cloneStructValue(t))), null]
}

export function appendTimeCommon(dst: $.Slice<number>, t: time.Time): $.Slice<number> {
	let [, month, day] = $.markAsStructValue($.cloneStructValue(t)).Date()

	dst = appendTwoDigits(dst, $.int(month))
	dst = appendTwoDigits(dst, day)

	let [hour, min, sec] = $.markAsStructValue($.cloneStructValue(t)).Clock()

	dst = appendTwoDigits(dst, hour)
	dst = appendTwoDigits(dst, min)
	dst = appendTwoDigits(dst, sec)

	let [, offset] = $.markAsStructValue($.cloneStructValue(t)).Zone()

	switch (true) {
		case (Math.trunc(offset / 60)) == 0:
		{
			return $.append(dst, $.uint(90, 8), $.byteSliceHint)
			break
		}
		case offset > 0:
		{
			dst = $.append(dst, $.uint(43, 8), $.byteSliceHint)
			break
		}
		case offset < 0:
		{
			dst = $.append(dst, $.uint(45, 8), $.byteSliceHint)
			break
		}
	}

	let offsetMinutes = Math.trunc(offset / 60)
	if (offsetMinutes < 0) {
		offsetMinutes = -offsetMinutes
	}

	dst = appendTwoDigits(dst, Math.trunc(offsetMinutes / 60))
	dst = appendTwoDigits(dst, offsetMinutes % 60)

	return dst
}

export function stripTagAndLength(_in: $.Slice<number>): $.Slice<number> {
	let [, offset, err] = __goscript_asn1.parseTagAndLength(_in, 0)
	if (err != null) {
		return _in
	}
	return $.goSlice(_in, offset, undefined)
}

export async function makeBody(value: reflect.Value, params: __goscript_common.fieldParameters): globalThis.Promise<[encoder | null, $.GoError]> {
	let e: encoder | null = null as encoder | null
	let err: $.GoError = null as $.GoError
	{
		let __goscriptSwitch0 = $.markAsStructValue($.cloneStructValue(value)).Type()
		switch (true) {
			case $.comparableEqual(__goscriptSwitch0, __goscript_asn1.flagType):
			{
				return [$.namedValueInterfaceValue<encoder | null>((null as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
				break
			}
			case $.comparableEqual(__goscriptSwitch0, __goscript_asn1.timeType):
			{
				let __goscriptTuple2: any = reflect.TypeAssert({[$.genericTypeArgsMarker]: true, T: { type: "time.Time", zero: () => $.markAsStructValue(new time.Time()), methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), AddDate: (receiver: any, ...args: any[]) => receiver.AddDate(...$.stripGenericTypeArgs(args)), After: (receiver: any, ...args: any[]) => receiver.After(...$.stripGenericTypeArgs(args)), AppendBinary: (receiver: any, ...args: any[]) => receiver.AppendBinary(...$.stripGenericTypeArgs(args)), AppendFormat: (receiver: any, ...args: any[]) => receiver.AppendFormat(...$.stripGenericTypeArgs(args)), AppendText: (receiver: any, ...args: any[]) => receiver.AppendText(...$.stripGenericTypeArgs(args)), Before: (receiver: any, ...args: any[]) => receiver.Before(...$.stripGenericTypeArgs(args)), Clock: (receiver: any, ...args: any[]) => receiver.Clock(...$.stripGenericTypeArgs(args)), Compare: (receiver: any, ...args: any[]) => receiver.Compare(...$.stripGenericTypeArgs(args)), Date: (receiver: any, ...args: any[]) => receiver.Date(...$.stripGenericTypeArgs(args)), Day: (receiver: any, ...args: any[]) => receiver.Day(...$.stripGenericTypeArgs(args)), Equal: (receiver: any, ...args: any[]) => receiver.Equal(...$.stripGenericTypeArgs(args)), Format: (receiver: any, ...args: any[]) => receiver.Format(...$.stripGenericTypeArgs(args)), GoString: (receiver: any, ...args: any[]) => receiver.GoString(...$.stripGenericTypeArgs(args)), GobEncode: (receiver: any, ...args: any[]) => receiver.GobEncode(...$.stripGenericTypeArgs(args)), Hour: (receiver: any, ...args: any[]) => receiver.Hour(...$.stripGenericTypeArgs(args)), ISOWeek: (receiver: any, ...args: any[]) => receiver.ISOWeek(...$.stripGenericTypeArgs(args)), In: (receiver: any, ...args: any[]) => receiver.In(...$.stripGenericTypeArgs(args)), IsDST: (receiver: any, ...args: any[]) => receiver.IsDST(...$.stripGenericTypeArgs(args)), IsZero: (receiver: any, ...args: any[]) => receiver.IsZero(...$.stripGenericTypeArgs(args)), Local: (receiver: any, ...args: any[]) => receiver.Local(...$.stripGenericTypeArgs(args)), Location: (receiver: any, ...args: any[]) => receiver.Location(...$.stripGenericTypeArgs(args)), MarshalBinary: (receiver: any, ...args: any[]) => receiver.MarshalBinary(...$.stripGenericTypeArgs(args)), MarshalJSON: (receiver: any, ...args: any[]) => receiver.MarshalJSON(...$.stripGenericTypeArgs(args)), MarshalText: (receiver: any, ...args: any[]) => receiver.MarshalText(...$.stripGenericTypeArgs(args)), Minute: (receiver: any, ...args: any[]) => receiver.Minute(...$.stripGenericTypeArgs(args)), Month: (receiver: any, ...args: any[]) => receiver.Month(...$.stripGenericTypeArgs(args)), Nanosecond: (receiver: any, ...args: any[]) => receiver.Nanosecond(...$.stripGenericTypeArgs(args)), Round: (receiver: any, ...args: any[]) => receiver.Round(...$.stripGenericTypeArgs(args)), Second: (receiver: any, ...args: any[]) => receiver.Second(...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => receiver.String(...$.stripGenericTypeArgs(args)), Sub: (receiver: any, ...args: any[]) => receiver.Sub(...$.stripGenericTypeArgs(args)), Truncate: (receiver: any, ...args: any[]) => receiver.Truncate(...$.stripGenericTypeArgs(args)), UTC: (receiver: any, ...args: any[]) => receiver.UTC(...$.stripGenericTypeArgs(args)), Unix: (receiver: any, ...args: any[]) => receiver.Unix(...$.stripGenericTypeArgs(args)), UnixMicro: (receiver: any, ...args: any[]) => receiver.UnixMicro(...$.stripGenericTypeArgs(args)), UnixMilli: (receiver: any, ...args: any[]) => receiver.UnixMilli(...$.stripGenericTypeArgs(args)), UnixNano: (receiver: any, ...args: any[]) => receiver.UnixNano(...$.stripGenericTypeArgs(args)), Weekday: (receiver: any, ...args: any[]) => receiver.Weekday(...$.stripGenericTypeArgs(args)), Year: (receiver: any, ...args: any[]) => receiver.Year(...$.stripGenericTypeArgs(args)), YearDay: (receiver: any, ...args: any[]) => receiver.YearDay(...$.stripGenericTypeArgs(args)), Zone: (receiver: any, ...args: any[]) => receiver.Zone(...$.stripGenericTypeArgs(args)), ZoneBounds: (receiver: any, ...args: any[]) => receiver.ZoneBounds(...$.stripGenericTypeArgs(args)), absSec: (receiver: any, ...args: any[]) => receiver.absSec(...$.stripGenericTypeArgs(args)), appendFormat: (receiver: any, ...args: any[]) => receiver.appendFormat(...$.stripGenericTypeArgs(args)), appendFormatRFC3339: (receiver: any, ...args: any[]) => receiver.appendFormatRFC3339(...$.stripGenericTypeArgs(args)), appendStrictRFC3339: (receiver: any, ...args: any[]) => receiver.appendStrictRFC3339(...$.stripGenericTypeArgs(args)), appendTo: (receiver: any, ...args: any[]) => receiver.appendTo(...$.stripGenericTypeArgs(args)), locabs: (receiver: any, ...args: any[]) => receiver.locabs(...$.stripGenericTypeArgs(args))} }}, $.markAsStructValue($.cloneStructValue(value)))
				let t = (__goscriptTuple2[0] as time.Time)
				if ((params.timeType == 24) || outsideUTCRange($.markAsStructValue($.cloneStructValue(t)))) {
					return makeGeneralizedTime($.markAsStructValue($.cloneStructValue(t)))
				}
				return makeUTCTime($.markAsStructValue($.cloneStructValue(t)))
				break
			}
			case $.comparableEqual(__goscriptSwitch0, __goscript_asn1.bitStringType):
			{
				let __goscriptTuple3: any = reflect.TypeAssert({[$.genericTypeArgsMarker]: true, T: { type: "asn1.BitString", zero: () => $.markAsStructValue(new __goscript_asn1.BitString()), methods: {At: (receiver: any, ...args: any[]) => receiver.At(...$.stripGenericTypeArgs(args)), RightAlign: (receiver: any, ...args: any[]) => receiver.RightAlign(...$.stripGenericTypeArgs(args))} }}, $.markAsStructValue($.cloneStructValue(value)))
				let v = (__goscriptTuple3[0] as __goscript_asn1.BitString)
				return [$.interfaceValue<encoder | null>($.markAsStructValue($.cloneStructValue((() => { const __goscriptConvert0 = v; return $.markAsStructValue(new bitStringEncoder({Bytes: __goscriptConvert0.Bytes, BitLength: __goscriptConvert0.BitLength})) })())), "asn1.bitStringEncoder", "asn1.bitStringEncoder"), null]
				break
			}
			case $.comparableEqual(__goscriptSwitch0, __goscript_asn1.objectIdentifierType):
			{
				let __goscriptTuple4: any = reflect.TypeAssert({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, zero: () => null, methods: {Equal: (receiver: any, ...args: any[]) => (__goscript_asn1.ObjectIdentifier_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => (__goscript_asn1.ObjectIdentifier_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, methodSignatures: [{ name: "Equal", args: [{ name: "other", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] }}, $.markAsStructValue($.cloneStructValue(value)))
				let v: __goscript_asn1.ObjectIdentifier = ((__goscriptTuple4[0] as __goscript_asn1.ObjectIdentifier) as __goscript_asn1.ObjectIdentifier)
				return makeObjectIdentifier(v)
				break
			}
			case $.comparableEqual(__goscriptSwitch0, __goscript_asn1.bigIntType):
			{
				let __goscriptTuple5: any = reflect.TypeAssert({[$.genericTypeArgsMarker]: true, T: { type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, zero: () => null, methods: {Abs: (receiver: any, ...args: any[]) => receiver.Abs(...$.stripGenericTypeArgs(args)), Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), And: (receiver: any, ...args: any[]) => receiver.And(...$.stripGenericTypeArgs(args)), AndNot: (receiver: any, ...args: any[]) => receiver.AndNot(...$.stripGenericTypeArgs(args)), Append: (receiver: any, ...args: any[]) => receiver.Append(...$.stripGenericTypeArgs(args)), AppendText: (receiver: any, ...args: any[]) => receiver.AppendText(...$.stripGenericTypeArgs(args)), Binomial: (receiver: any, ...args: any[]) => receiver.Binomial(...$.stripGenericTypeArgs(args)), Bit: (receiver: any, ...args: any[]) => receiver.Bit(...$.stripGenericTypeArgs(args)), BitLen: (receiver: any, ...args: any[]) => receiver.BitLen(...$.stripGenericTypeArgs(args)), Bits: (receiver: any, ...args: any[]) => receiver.Bits(...$.stripGenericTypeArgs(args)), Bytes: (receiver: any, ...args: any[]) => receiver.Bytes(...$.stripGenericTypeArgs(args)), Cmp: (receiver: any, ...args: any[]) => receiver.Cmp(...$.stripGenericTypeArgs(args)), CmpAbs: (receiver: any, ...args: any[]) => receiver.CmpAbs(...$.stripGenericTypeArgs(args)), Div: (receiver: any, ...args: any[]) => receiver.Div(...$.stripGenericTypeArgs(args)), DivMod: (receiver: any, ...args: any[]) => receiver.DivMod(...$.stripGenericTypeArgs(args)), Exp: (receiver: any, ...args: any[]) => receiver.Exp(...$.stripGenericTypeArgs(args)), FillBytes: (receiver: any, ...args: any[]) => receiver.FillBytes(...$.stripGenericTypeArgs(args)), Float64: (receiver: any, ...args: any[]) => receiver.Float64(...$.stripGenericTypeArgs(args)), Format: (receiver: any, ...args: any[]) => receiver.Format(...$.stripGenericTypeArgs(args)), GCD: (receiver: any, ...args: any[]) => receiver.GCD(...$.stripGenericTypeArgs(args)), GobDecode: (receiver: any, ...args: any[]) => receiver.GobDecode(...$.stripGenericTypeArgs(args)), GobEncode: (receiver: any, ...args: any[]) => receiver.GobEncode(...$.stripGenericTypeArgs(args)), Int64: (receiver: any, ...args: any[]) => receiver.Int64(...$.stripGenericTypeArgs(args)), IsInt64: (receiver: any, ...args: any[]) => receiver.IsInt64(...$.stripGenericTypeArgs(args)), IsUint64: (receiver: any, ...args: any[]) => receiver.IsUint64(...$.stripGenericTypeArgs(args)), Lsh: (receiver: any, ...args: any[]) => receiver.Lsh(...$.stripGenericTypeArgs(args)), MarshalJSON: (receiver: any, ...args: any[]) => receiver.MarshalJSON(...$.stripGenericTypeArgs(args)), MarshalText: (receiver: any, ...args: any[]) => receiver.MarshalText(...$.stripGenericTypeArgs(args)), Mod: (receiver: any, ...args: any[]) => receiver.Mod(...$.stripGenericTypeArgs(args)), ModInverse: (receiver: any, ...args: any[]) => receiver.ModInverse(...$.stripGenericTypeArgs(args)), ModSqrt: (receiver: any, ...args: any[]) => receiver.ModSqrt(...$.stripGenericTypeArgs(args)), Mul: (receiver: any, ...args: any[]) => receiver.Mul(...$.stripGenericTypeArgs(args)), MulRange: (receiver: any, ...args: any[]) => receiver.MulRange(...$.stripGenericTypeArgs(args)), Neg: (receiver: any, ...args: any[]) => receiver.Neg(...$.stripGenericTypeArgs(args)), Not: (receiver: any, ...args: any[]) => receiver.Not(...$.stripGenericTypeArgs(args)), Or: (receiver: any, ...args: any[]) => receiver.Or(...$.stripGenericTypeArgs(args)), ProbablyPrime: (receiver: any, ...args: any[]) => receiver.ProbablyPrime(...$.stripGenericTypeArgs(args)), Quo: (receiver: any, ...args: any[]) => receiver.Quo(...$.stripGenericTypeArgs(args)), QuoRem: (receiver: any, ...args: any[]) => receiver.QuoRem(...$.stripGenericTypeArgs(args)), Rand: (receiver: any, ...args: any[]) => receiver.Rand(...$.stripGenericTypeArgs(args)), Rem: (receiver: any, ...args: any[]) => receiver.Rem(...$.stripGenericTypeArgs(args)), Rsh: (receiver: any, ...args: any[]) => receiver.Rsh(...$.stripGenericTypeArgs(args)), Scan: (receiver: any, ...args: any[]) => receiver.Scan(...$.stripGenericTypeArgs(args)), Set: (receiver: any, ...args: any[]) => receiver.Set(...$.stripGenericTypeArgs(args)), SetBit: (receiver: any, ...args: any[]) => receiver.SetBit(...$.stripGenericTypeArgs(args)), SetBits: (receiver: any, ...args: any[]) => receiver.SetBits(...$.stripGenericTypeArgs(args)), SetBytes: (receiver: any, ...args: any[]) => receiver.SetBytes(...$.stripGenericTypeArgs(args)), SetInt64: (receiver: any, ...args: any[]) => receiver.SetInt64(...$.stripGenericTypeArgs(args)), SetString: (receiver: any, ...args: any[]) => receiver.SetString(...$.stripGenericTypeArgs(args)), SetUint64: (receiver: any, ...args: any[]) => receiver.SetUint64(...$.stripGenericTypeArgs(args)), Sign: (receiver: any, ...args: any[]) => receiver.Sign(...$.stripGenericTypeArgs(args)), Sqrt: (receiver: any, ...args: any[]) => receiver.Sqrt(...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => receiver.String(...$.stripGenericTypeArgs(args)), Sub: (receiver: any, ...args: any[]) => receiver.Sub(...$.stripGenericTypeArgs(args)), Text: (receiver: any, ...args: any[]) => receiver.Text(...$.stripGenericTypeArgs(args)), TrailingZeroBits: (receiver: any, ...args: any[]) => receiver.TrailingZeroBits(...$.stripGenericTypeArgs(args)), Uint64: (receiver: any, ...args: any[]) => receiver.Uint64(...$.stripGenericTypeArgs(args)), UnmarshalJSON: (receiver: any, ...args: any[]) => receiver.UnmarshalJSON(...$.stripGenericTypeArgs(args)), UnmarshalText: (receiver: any, ...args: any[]) => receiver.UnmarshalText(...$.stripGenericTypeArgs(args)), Xor: (receiver: any, ...args: any[]) => receiver.Xor(...$.stripGenericTypeArgs(args)), exp: (receiver: any, ...args: any[]) => receiver.exp(...$.stripGenericTypeArgs(args)), expSlow: (receiver: any, ...args: any[]) => receiver.expSlow(...$.stripGenericTypeArgs(args)), lehmerGCD: (receiver: any, ...args: any[]) => receiver.lehmerGCD(...$.stripGenericTypeArgs(args)), modSqrt3Mod4Prime: (receiver: any, ...args: any[]) => receiver.modSqrt3Mod4Prime(...$.stripGenericTypeArgs(args)), modSqrt5Mod8Prime: (receiver: any, ...args: any[]) => receiver.modSqrt5Mod8Prime(...$.stripGenericTypeArgs(args)), modSqrtTonelliShanks: (receiver: any, ...args: any[]) => receiver.modSqrtTonelliShanks(...$.stripGenericTypeArgs(args)), mul: (receiver: any, ...args: any[]) => receiver.mul(...$.stripGenericTypeArgs(args)), scaleDenom: (receiver: any, ...args: any[]) => receiver.scaleDenom(...$.stripGenericTypeArgs(args)), scan: (receiver: any, ...args: any[]) => receiver.scan(...$.stripGenericTypeArgs(args)), setFromScanner: (receiver: any, ...args: any[]) => receiver.setFromScanner(...$.stripGenericTypeArgs(args))} }}, $.markAsStructValue($.cloneStructValue(value)))
				let v: big.Int | $.VarRef<big.Int> | null = (__goscriptTuple5[0] as big.Int | $.VarRef<big.Int> | null)
				return makeBigInt(v)
				break
			}
		}
	}

	{
		let v = $.markAsStructValue($.cloneStructValue(value))
		switch ($.markAsStructValue($.cloneStructValue(v)).Kind()) {
			case reflect.Bool:
			{
				if ($.markAsStructValue($.cloneStructValue(v)).Bool()) {
					return [byteFFEncoder, null]
				}
				return [byte00Encoder, null]
				break
			}
			case reflect.Int:
			case reflect.Int8:
			case reflect.Int16:
			case reflect.Int32:
			case reflect.Int64:
			{
				return [$.namedValueInterfaceValue<encoder | null>($.int64($.markAsStructValue($.cloneStructValue(v)).Int()), "asn1.int64Encoder", {Encode: (receiver: any, ...args: any[]) => (int64Encoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (int64Encoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Basic, name: "int64", typeName: "asn1.int64Encoder" }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
				break
			}
			case reflect.Struct:
			{
				let t = $.markAsStructValue($.cloneStructValue(v)).Type()

				for (let i = 0; i < await $.pointerValue<Exclude<reflect.Type, null>>(t).NumField(); i++) {
					if (!$.markAsStructValue($.cloneStructValue((await $.pointerValue<Exclude<reflect.Type, null>>(t).Field(i)))).IsExported()) {
						return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_asn1.StructuralError({Msg: "struct contains unexported fields"})), "asn1.StructuralError", "asn1.StructuralError")]
					}
				}

				let startingField = 0

				let n = await $.pointerValue<Exclude<reflect.Type, null>>(t).NumField()
				if (n == 0) {
					return [$.namedValueInterfaceValue<encoder | null>((null as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
				}

				// If the first element of the structure is a non-empty
				// RawContents, then we don't bother serializing the rest.
				if ($.comparableEqual((await $.pointerValue<Exclude<reflect.Type, null>>(t).Field(0)).Type, __goscript_asn1.rawContentsType)) {
					let s = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Field(0)))
					if ($.markAsStructValue($.cloneStructValue(s)).Len() > 0) {
						let __goscriptShadow2: $.Slice<number> = $.markAsStructValue($.cloneStructValue(s)).Bytes()
						/* The RawContents will contain the tag and
										 * length fields but we'll also be writing
										 * those ourselves, so we strip them out of
										 * bytes */
						return [$.namedValueInterfaceValue<encoder | null>((stripTagAndLength(__goscriptShadow2) as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
					}

					startingField = 1
				}

				{
					let n1 = n - startingField
					switch (n1) {
						case 0:
						{
							return [$.namedValueInterfaceValue<encoder | null>((null as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
							break
						}
						case 1:
						{
							return makeField($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Field(startingField))), $.markAsStructValue($.cloneStructValue(__goscript_common.parseFieldParameters(reflect.StructTag_Get((await $.pointerValue<Exclude<reflect.Type, null>>(t).Field(startingField)).Tag, "asn1")))))
							break
						}
						default:
						{
							let m: $.Slice<encoder | null> = $.makeSlice<encoder | null>(n1)
							for (let i = 0; i < n1; i++) {
								let __goscriptTuple6: any = await makeField($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Field(i + startingField))), $.markAsStructValue($.cloneStructValue(__goscript_common.parseFieldParameters(reflect.StructTag_Get((await $.pointerValue<Exclude<reflect.Type, null>>(t).Field(i + startingField)).Tag, "asn1")))))
								m![i] = __goscriptTuple6[0]
								err = __goscriptTuple6[1]
								if (err != null) {
									return [null, err]
								}
							}

							return [$.namedValueInterfaceValue<encoder | null>((m as multiEncoder), "asn1.multiEncoder", {Encode: (receiver: any, ...args: any[]) => (multiEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (multiEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.multiEncoder", elemType: "asn1.encoder" }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
							break
						}
					}
				}
				break
			}
			case reflect.Slice:
			{
				let sliceType = $.markAsStructValue($.cloneStructValue(v)).Type()
				if (await $.pointerValue<Exclude<reflect.Type, null>>((await $.pointerValue<Exclude<reflect.Type, null>>(sliceType).Elem())).Kind() == reflect.Uint8) {
					return [$.namedValueInterfaceValue<encoder | null>(($.markAsStructValue($.cloneStructValue(v)).Bytes() as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
				}

				let fp: __goscript_common.fieldParameters = $.markAsStructValue(new __goscript_common.fieldParameters())

				{
					let l = $.markAsStructValue($.cloneStructValue(v)).Len()
					switch (l) {
						case 0:
						{
							return [$.namedValueInterfaceValue<encoder | null>((null as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
							break
						}
						case 1:
						{
							return makeField($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Index(0))), $.markAsStructValue($.cloneStructValue(fp)))
							break
						}
						default:
						{
							let m: $.Slice<encoder | null> = $.makeSlice<encoder | null>(l)

							for (let i = 0; i < l; i++) {
								let __goscriptTuple7: any = await makeField($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Index(i))), $.markAsStructValue($.cloneStructValue(fp)))
								m![i] = __goscriptTuple7[0]
								err = __goscriptTuple7[1]
								if (err != null) {
									return [null, err]
								}
							}

							if (params._set) {
								return [$.namedValueInterfaceValue<encoder | null>((m as setEncoder), "asn1.setEncoder", {Encode: (receiver: any, ...args: any[]) => (setEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (setEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.setEncoder", elemType: "asn1.encoder" }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
							}
							return [$.namedValueInterfaceValue<encoder | null>((m as multiEncoder), "asn1.multiEncoder", {Encode: (receiver: any, ...args: any[]) => (multiEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (multiEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.multiEncoder", elemType: "asn1.encoder" }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
							break
						}
					}
				}
				break
			}
			case reflect.String:
			{
				switch (params.stringType) {
					case 22:
					{
						return makeIA5String($.markAsStructValue($.cloneStructValue(v)).String())
						break
					}
					case 19:
					{
						return makePrintableString($.markAsStructValue($.cloneStructValue(v)).String())
						break
					}
					case 18:
					{
						return makeNumericString($.markAsStructValue($.cloneStructValue(v)).String())
						break
					}
					default:
					{
						return [makeUTF8String($.markAsStructValue($.cloneStructValue(v)).String()), null]
						break
					}
				}
				break
			}
		}
	}

	return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_asn1.StructuralError({Msg: "unknown Go type"})), "asn1.StructuralError", "asn1.StructuralError")]
}

export async function makeField(v: reflect.Value, params: __goscript_common.fieldParameters): globalThis.Promise<[encoder | null, $.GoError]> {
	let e: encoder | null = null as encoder | null
	let err: $.GoError = null as $.GoError
	if (!$.markAsStructValue($.cloneStructValue(v)).IsValid()) {
		return [null, fmt.Errorf("asn1: cannot marshal nil value")]
	}
	// If the field is an interface{} then recurse into it.
	if (($.markAsStructValue($.cloneStructValue(v)).Kind() == reflect.Interface) && (await $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(v)).Type()).NumMethod() == 0)) {
		return makeField($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Elem())), $.markAsStructValue($.cloneStructValue(params)))
	}

	if ((($.markAsStructValue($.cloneStructValue(v)).Kind() == reflect.Slice) && ($.markAsStructValue($.cloneStructValue(v)).Len() == 0)) && params.omitEmpty) {
		return [$.namedValueInterfaceValue<encoder | null>((null as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
	}

	if ((params.optional && (params.defaultValue != null)) && __goscript_asn1.canHaveDefaultValue($.markAsStructValue($.cloneStructValue(v)).Kind())) {
		let defaultValue = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(reflect.New($.pointerValueOrNil($.markAsStructValue($.cloneStructValue(v)).Type())!))).Elem()))
		$.markAsStructValue($.cloneStructValue(defaultValue)).SetInt($.pointerValue<bigint>(params.defaultValue))

		if (reflect.DeepEqual($.markAsStructValue($.cloneStructValue(v)).Interface(), $.markAsStructValue($.cloneStructValue(defaultValue)).Interface())) {
			return [$.namedValueInterfaceValue<encoder | null>((null as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
		}
	}

	// If no default value is given then the zero value for the type is
	// assumed to be the default value. This isn't obviously the correct
	// behavior, but it's what Go has traditionally done.
	if (params.optional && (params.defaultValue == null)) {
		if (reflect.DeepEqual($.markAsStructValue($.cloneStructValue(v)).Interface(), $.markAsStructValue($.cloneStructValue(reflect.Zero($.pointerValueOrNil($.markAsStructValue($.cloneStructValue(v)).Type())!))).Interface())) {
			return [$.namedValueInterfaceValue<encoder | null>((null as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
		}
	}

	if ($.comparableEqual($.markAsStructValue($.cloneStructValue(v)).Type(), __goscript_asn1.rawValueType)) {
		let __goscriptTuple8: any = reflect.TypeAssert({[$.genericTypeArgsMarker]: true, T: { type: "asn1.RawValue", zero: () => $.markAsStructValue(new __goscript_asn1.RawValue()) }}, $.markAsStructValue($.cloneStructValue(v)))
		let rv = (__goscriptTuple8[0] as __goscript_asn1.RawValue)
		if ($.len(rv.FullBytes) != 0) {
			return [$.namedValueInterfaceValue<encoder | null>((rv.FullBytes as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }]), null]
		}

		let t: taggedEncoder | $.VarRef<taggedEncoder> | null = new taggedEncoder()

		$.pointerValue<taggedEncoder>(t).tag = $.namedValueInterfaceValue<encoder | null>((appendTagAndLength($.goSlice($.pointerValue<taggedEncoder>(t).scratch, undefined, 0), $.markAsStructValue(new __goscript_common.tagAndLength({_class: rv.Class, tag: rv.Tag, length: $.len(rv.Bytes), isCompound: rv.IsCompound}))) as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])
		$.pointerValue<taggedEncoder>(t).body = $.namedValueInterfaceValue<encoder | null>((rv.Bytes as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])

		return [$.interfaceValue<encoder | null>(t, "*asn1.taggedEncoder", { kind: $.TypeKind.Pointer, elemType: "asn1.taggedEncoder" }), null]
	}

	let [matchAny, tag, isCompound, ok] = await __goscript_common.getUniversalType($.markAsStructValue($.cloneStructValue(v)).Type())
	if (!ok || matchAny) {
		return [null, $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField0 = await fmt.Sprintf("unknown Go type: %v", ($.markAsStructValue($.cloneStructValue(v)).Type() as any)); return $.markAsStructValue(new __goscript_asn1.StructuralError({Msg: __goscriptLiteralField0})) })()), "asn1.StructuralError", "asn1.StructuralError")]
	}

	if ((params.timeType != 0) && (tag != 23)) {
		return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_asn1.StructuralError({Msg: "explicit time type given to non-time member"})), "asn1.StructuralError", "asn1.StructuralError")]
	}

	if ((params.stringType != 0) && (tag != 19)) {
		return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_asn1.StructuralError({Msg: "explicit string type given to non-string member"})), "asn1.StructuralError", "asn1.StructuralError")]
	}

	switch (tag) {
		case 19:
		{
			if (params.stringType == 0) {
				// This is a string without an explicit string type. We'll use
				// a PrintableString if the character set in the string is
				// sufficiently limited, otherwise we'll use a UTF8String.
				for (const [__rangeIndex, r] of $.rangeString($.markAsStructValue($.cloneStructValue(v)).String())) {
					if (($.int(r, 32) >= $.int(utf8.RuneSelf, 32)) || !__goscript_asn1.isPrintable($.uint($.uint(r, 8), 8), false, false)) {
						if (!utf8.ValidString($.markAsStructValue($.cloneStructValue(v)).String())) {
							return [null, errors.New("asn1: string not valid UTF-8")]
						}
						tag = 12
						break
					}
				}
			} else {
				tag = params.stringType
			}
			break
		}
		case 23:
		{
			let __goscriptTuple9: any = reflect.TypeAssert({[$.genericTypeArgsMarker]: true, T: { type: "time.Time", zero: () => $.markAsStructValue(new time.Time()), methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...$.stripGenericTypeArgs(args)), AddDate: (receiver: any, ...args: any[]) => receiver.AddDate(...$.stripGenericTypeArgs(args)), After: (receiver: any, ...args: any[]) => receiver.After(...$.stripGenericTypeArgs(args)), AppendBinary: (receiver: any, ...args: any[]) => receiver.AppendBinary(...$.stripGenericTypeArgs(args)), AppendFormat: (receiver: any, ...args: any[]) => receiver.AppendFormat(...$.stripGenericTypeArgs(args)), AppendText: (receiver: any, ...args: any[]) => receiver.AppendText(...$.stripGenericTypeArgs(args)), Before: (receiver: any, ...args: any[]) => receiver.Before(...$.stripGenericTypeArgs(args)), Clock: (receiver: any, ...args: any[]) => receiver.Clock(...$.stripGenericTypeArgs(args)), Compare: (receiver: any, ...args: any[]) => receiver.Compare(...$.stripGenericTypeArgs(args)), Date: (receiver: any, ...args: any[]) => receiver.Date(...$.stripGenericTypeArgs(args)), Day: (receiver: any, ...args: any[]) => receiver.Day(...$.stripGenericTypeArgs(args)), Equal: (receiver: any, ...args: any[]) => receiver.Equal(...$.stripGenericTypeArgs(args)), Format: (receiver: any, ...args: any[]) => receiver.Format(...$.stripGenericTypeArgs(args)), GoString: (receiver: any, ...args: any[]) => receiver.GoString(...$.stripGenericTypeArgs(args)), GobEncode: (receiver: any, ...args: any[]) => receiver.GobEncode(...$.stripGenericTypeArgs(args)), Hour: (receiver: any, ...args: any[]) => receiver.Hour(...$.stripGenericTypeArgs(args)), ISOWeek: (receiver: any, ...args: any[]) => receiver.ISOWeek(...$.stripGenericTypeArgs(args)), In: (receiver: any, ...args: any[]) => receiver.In(...$.stripGenericTypeArgs(args)), IsDST: (receiver: any, ...args: any[]) => receiver.IsDST(...$.stripGenericTypeArgs(args)), IsZero: (receiver: any, ...args: any[]) => receiver.IsZero(...$.stripGenericTypeArgs(args)), Local: (receiver: any, ...args: any[]) => receiver.Local(...$.stripGenericTypeArgs(args)), Location: (receiver: any, ...args: any[]) => receiver.Location(...$.stripGenericTypeArgs(args)), MarshalBinary: (receiver: any, ...args: any[]) => receiver.MarshalBinary(...$.stripGenericTypeArgs(args)), MarshalJSON: (receiver: any, ...args: any[]) => receiver.MarshalJSON(...$.stripGenericTypeArgs(args)), MarshalText: (receiver: any, ...args: any[]) => receiver.MarshalText(...$.stripGenericTypeArgs(args)), Minute: (receiver: any, ...args: any[]) => receiver.Minute(...$.stripGenericTypeArgs(args)), Month: (receiver: any, ...args: any[]) => receiver.Month(...$.stripGenericTypeArgs(args)), Nanosecond: (receiver: any, ...args: any[]) => receiver.Nanosecond(...$.stripGenericTypeArgs(args)), Round: (receiver: any, ...args: any[]) => receiver.Round(...$.stripGenericTypeArgs(args)), Second: (receiver: any, ...args: any[]) => receiver.Second(...$.stripGenericTypeArgs(args)), String: (receiver: any, ...args: any[]) => receiver.String(...$.stripGenericTypeArgs(args)), Sub: (receiver: any, ...args: any[]) => receiver.Sub(...$.stripGenericTypeArgs(args)), Truncate: (receiver: any, ...args: any[]) => receiver.Truncate(...$.stripGenericTypeArgs(args)), UTC: (receiver: any, ...args: any[]) => receiver.UTC(...$.stripGenericTypeArgs(args)), Unix: (receiver: any, ...args: any[]) => receiver.Unix(...$.stripGenericTypeArgs(args)), UnixMicro: (receiver: any, ...args: any[]) => receiver.UnixMicro(...$.stripGenericTypeArgs(args)), UnixMilli: (receiver: any, ...args: any[]) => receiver.UnixMilli(...$.stripGenericTypeArgs(args)), UnixNano: (receiver: any, ...args: any[]) => receiver.UnixNano(...$.stripGenericTypeArgs(args)), Weekday: (receiver: any, ...args: any[]) => receiver.Weekday(...$.stripGenericTypeArgs(args)), Year: (receiver: any, ...args: any[]) => receiver.Year(...$.stripGenericTypeArgs(args)), YearDay: (receiver: any, ...args: any[]) => receiver.YearDay(...$.stripGenericTypeArgs(args)), Zone: (receiver: any, ...args: any[]) => receiver.Zone(...$.stripGenericTypeArgs(args)), ZoneBounds: (receiver: any, ...args: any[]) => receiver.ZoneBounds(...$.stripGenericTypeArgs(args)), absSec: (receiver: any, ...args: any[]) => receiver.absSec(...$.stripGenericTypeArgs(args)), appendFormat: (receiver: any, ...args: any[]) => receiver.appendFormat(...$.stripGenericTypeArgs(args)), appendFormatRFC3339: (receiver: any, ...args: any[]) => receiver.appendFormatRFC3339(...$.stripGenericTypeArgs(args)), appendStrictRFC3339: (receiver: any, ...args: any[]) => receiver.appendStrictRFC3339(...$.stripGenericTypeArgs(args)), appendTo: (receiver: any, ...args: any[]) => receiver.appendTo(...$.stripGenericTypeArgs(args)), locabs: (receiver: any, ...args: any[]) => receiver.locabs(...$.stripGenericTypeArgs(args))} }}, $.markAsStructValue($.cloneStructValue(v)))
			let t = (__goscriptTuple9[0] as time.Time)
			if ((params.timeType == 24) || outsideUTCRange($.markAsStructValue($.cloneStructValue(t)))) {
				tag = 24
			}
			break
		}
	}

	if (params._set) {
		if (tag != 16) {
			return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new __goscript_asn1.StructuralError({Msg: "non sequence tagged as set"})), "asn1.StructuralError", "asn1.StructuralError")]
		}
		tag = 17
	}

	// makeField can be called for a slice that should be treated as a SET
	// but doesn't have params.set set, for instance when using a slice
	// with the SET type name suffix. In this case getUniversalType returns
	// TagSet, but makeBody doesn't know about that so will treat the slice
	// as a sequence. To work around this we set params.set.
	if ((tag == 17) && !params._set) {
		params._set = true
	}

	let t: taggedEncoder | $.VarRef<taggedEncoder> | null = new taggedEncoder()

	let __goscriptTuple10: any = await makeBody($.markAsStructValue($.cloneStructValue(v)), $.markAsStructValue($.cloneStructValue(params)))
	$.pointerValue<taggedEncoder>(t).body = __goscriptTuple10[0]
	err = __goscriptTuple10[1]
	if (err != null) {
		return [null, err]
	}

	let bodyLen = await $.pointerValue<Exclude<encoder, null>>($.pointerValue<taggedEncoder>(t).body).Len()

	let _class = 0
	if (params.tag != null) {
		if (params.application) {
			_class = 1
		} else {
			if (params._private) {
				_class = 3
			} else {
				_class = 2
			}
		}

		if (params.explicit) {
			$.pointerValue<taggedEncoder>(t).tag = $.namedValueInterfaceValue<encoder | null>((appendTagAndLength($.goSlice($.pointerValue<taggedEncoder>(t).scratch, undefined, 0), $.markAsStructValue(new __goscript_common.tagAndLength({_class: 0, tag: tag, length: bodyLen, isCompound: isCompound}))) as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])

			let tt: taggedEncoder | $.VarRef<taggedEncoder> | null = new taggedEncoder()

			$.pointerValue<taggedEncoder>(tt).body = $.interfaceValue<encoder | null>(t, "*asn1.taggedEncoder", { kind: $.TypeKind.Pointer, elemType: "asn1.taggedEncoder" })

			$.pointerValue<taggedEncoder>(tt).tag = $.namedValueInterfaceValue<encoder | null>((appendTagAndLength($.goSlice($.pointerValue<taggedEncoder>(tt).scratch, undefined, 0), (await (async () => { const __goscriptLiteralField1 = bodyLen + await $.pointerValue<Exclude<encoder, null>>($.pointerValue<taggedEncoder>(t).tag).Len(); return $.markAsStructValue(new __goscript_common.tagAndLength({_class: _class, tag: $.pointerValue<number>(params.tag), length: __goscriptLiteralField1, isCompound: true})) })())) as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])

			return [$.interfaceValue<encoder | null>(tt, "*asn1.taggedEncoder", { kind: $.TypeKind.Pointer, elemType: "asn1.taggedEncoder" }), null]
		}

		// implicit tag.
		tag = $.pointerValue<number>(params.tag)
	}

	$.pointerValue<taggedEncoder>(t).tag = $.namedValueInterfaceValue<encoder | null>((appendTagAndLength($.goSlice($.pointerValue<taggedEncoder>(t).scratch, undefined, 0), $.markAsStructValue(new __goscript_common.tagAndLength({_class: _class, tag: tag, length: bodyLen, isCompound: isCompound}))) as bytesEncoder), "asn1.bytesEncoder", {Encode: (receiver: any, ...args: any[]) => (bytesEncoder_Encode as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args)), Len: (receiver: any, ...args: any[]) => (bytesEncoder_Len as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...$.stripGenericTypeArgs(args))}, { kind: $.TypeKind.Slice, typeName: "asn1.bytesEncoder", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, [{ name: "Encode", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "Len", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }])

	return [$.interfaceValue<encoder | null>(t, "*asn1.taggedEncoder", { kind: $.TypeKind.Pointer, elemType: "asn1.taggedEncoder" }), null]
}

export async function Marshal(val: any): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	return MarshalWithParams(val, "")
}

export async function MarshalWithParams(val: any, params: string): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let [e, err] = await makeField($.markAsStructValue($.cloneStructValue(reflect.ValueOf(val))), $.markAsStructValue($.cloneStructValue(__goscript_common.parseFieldParameters(params))))
	if (err != null) {
		return [null, err]
	}
	let b: $.Slice<number> = $.makeSlice<number>(await $.pointerValue<Exclude<encoder, null>>(e).Len(), undefined, "byte")
	await $.pointerValue<Exclude<encoder, null>>(e).Encode(b)
	return [b, null]
}

// Generated file based on asn1.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as saferio from "@goscript/internal/saferio/index.js"

import * as math from "@goscript/math/index.js"

import * as big from "@goscript/math/big/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import * as time from "@goscript/time/index.js"

import * as utf16 from "@goscript/unicode/utf16/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

import * as __goscript_common from "./common.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/internal/saferio/index.js"
import "@goscript/math/index.js"
import "@goscript/math/big/index.js"
import "@goscript/reflect/index.js"
import "@goscript/slices/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"
import "@goscript/time/index.js"
import "@goscript/unicode/utf16/index.js"
import "@goscript/unicode/utf8/index.js"
import "./common.gs.ts"

export type ObjectIdentifier = $.Slice<number>

export type Enumerated = number

export type Flag = boolean

export type asteriskFlag = boolean

export type ampersandFlag = boolean

export type RawContent = $.Slice<number>

export class StructuralError {
	public get Msg(): string {
		return this._fields.Msg.value
	}
	public set Msg(value: string) {
		this._fields.Msg.value = value
	}

	public _fields: {
		Msg: $.VarRef<string>
	}

	constructor(init?: Partial<{Msg?: string}>) {
		this._fields = {
			Msg: $.varRef(init?.Msg ?? ("" as string))
		}
	}

	public clone(): StructuralError {
		const cloned = new StructuralError()
		cloned._fields = {
			Msg: $.varRef(this._fields.Msg.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e = this
		return "asn1: structure error: " + e.Msg
	}

	static __typeInfo = $.registerStructType(
		"asn1.StructuralError",
		() => new StructuralError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		StructuralError,
		[{ name: "Msg", key: "Msg", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }]
	)
}

export class SyntaxError {
	public get Msg(): string {
		return this._fields.Msg.value
	}
	public set Msg(value: string) {
		this._fields.Msg.value = value
	}

	public _fields: {
		Msg: $.VarRef<string>
	}

	constructor(init?: Partial<{Msg?: string}>) {
		this._fields = {
			Msg: $.varRef(init?.Msg ?? ("" as string))
		}
	}

	public clone(): SyntaxError {
		const cloned = new SyntaxError()
		cloned._fields = {
			Msg: $.varRef(this._fields.Msg.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e = this
		return "asn1: syntax error: " + e.Msg
	}

	static __typeInfo = $.registerStructType(
		"asn1.SyntaxError",
		() => new SyntaxError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		SyntaxError,
		[{ name: "Msg", key: "Msg", type: { kind: $.TypeKind.Basic, name: "string" }, index: [0], offset: 0, exported: true }]
	)
}

export class BitString {
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

	public clone(): BitString {
		const cloned = new BitString()
		cloned._fields = {
			Bytes: $.varRef(this._fields.Bytes.value),
			BitLength: $.varRef(this._fields.BitLength.value)
		}
		return $.markAsStructValue(cloned)
	}

	public At(i: number): number {
		const b = this
		if ((i < 0) || (i >= b.BitLength)) {
			return 0
		}
		let x = Math.trunc(i / 8)
		let y = $.uint($.uint64Sub(7n, $.uint(i % 8, 64)), 64)
		return $.int($.uintShr($.arrayIndex(b.Bytes!, x), y, 8)) & 1
	}

	public RightAlign(): $.Slice<number> {
		const b = this
		let shift = $.uint(8 - (b.BitLength % 8), 64)
		if ((shift == 8) || ($.len(b.Bytes) == 0)) {
			return b.Bytes
		}

		let a: $.Slice<number> = $.makeSlice<number>($.len(b.Bytes), undefined, "byte")
		a![0] = $.uint($.uintShr($.arrayIndex(b.Bytes!, 0), shift, 8), 8)
		for (let i = 1; i < $.len(b.Bytes); i++) {
			a![i] = $.uint($.arrayIndex(b.Bytes!, i - 1) << ($.uint($.uint64Sub(8n, shift), 64)), 8)
			a![i] = a![i] | ($.uint($.uintShr($.arrayIndex(b.Bytes!, i), shift, 8), 8))
		}

		return a
	}

	static __typeInfo = $.registerStructType(
		"asn1.BitString",
		() => new BitString(),
		[{ name: "At", args: [{ name: "i", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "RightAlign", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		BitString,
		[{ name: "Bytes", key: "Bytes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [0], offset: 0, exported: true }, { name: "BitLength", key: "BitLength", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 24, exported: true }]
	)
}

export class RawValue {
	public get Class(): number {
		return this._fields.Class.value
	}
	public set Class(value: number) {
		this._fields.Class.value = value
	}

	public get Tag(): number {
		return this._fields.Tag.value
	}
	public set Tag(value: number) {
		this._fields.Tag.value = value
	}

	public get IsCompound(): boolean {
		return this._fields.IsCompound.value
	}
	public set IsCompound(value: boolean) {
		this._fields.IsCompound.value = value
	}

	public get Bytes(): $.Slice<number> {
		return this._fields.Bytes.value
	}
	public set Bytes(value: $.Slice<number>) {
		this._fields.Bytes.value = value
	}

	public get FullBytes(): $.Slice<number> {
		return this._fields.FullBytes.value
	}
	public set FullBytes(value: $.Slice<number>) {
		this._fields.FullBytes.value = value
	}

	public _fields: {
		Class: $.VarRef<number>
		Tag: $.VarRef<number>
		IsCompound: $.VarRef<boolean>
		Bytes: $.VarRef<$.Slice<number>>
		FullBytes: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{Class?: number, Tag?: number, IsCompound?: boolean, Bytes?: $.Slice<number>, FullBytes?: $.Slice<number>}>) {
		this._fields = {
			Class: $.varRef(init?.Class ?? (0 as number)),
			Tag: $.varRef(init?.Tag ?? (0 as number)),
			IsCompound: $.varRef(init?.IsCompound ?? (false as boolean)),
			Bytes: $.varRef(init?.Bytes ?? (null as $.Slice<number>)),
			FullBytes: $.varRef(init?.FullBytes ?? (null as $.Slice<number>))
		}
	}

	public clone(): RawValue {
		const cloned = new RawValue()
		cloned._fields = {
			Class: $.varRef(this._fields.Class.value),
			Tag: $.varRef(this._fields.Tag.value),
			IsCompound: $.varRef(this._fields.IsCompound.value),
			Bytes: $.varRef(this._fields.Bytes.value),
			FullBytes: $.varRef(this._fields.FullBytes.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"asn1.RawValue",
		() => new RawValue(),
		[],
		RawValue,
		[{ name: "Class", key: "Class", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }, { name: "Tag", key: "Tag", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 8, exported: true }, { name: "IsCompound", key: "IsCompound", type: { kind: $.TypeKind.Basic, name: "bool" }, index: [2], offset: 16, exported: true }, { name: "Bytes", key: "Bytes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [3], offset: 24, exported: true }, { name: "FullBytes", key: "FullBytes", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, index: [4], offset: 48, exported: true }]
	)
}

export class invalidUnmarshalError {
	public get Type(): reflect.Type | null {
		return this._fields.Type.value
	}
	public set Type(value: reflect.Type | null) {
		this._fields.Type.value = value
	}

	public _fields: {
		Type: $.VarRef<reflect.Type | null>
	}

	constructor(init?: Partial<{Type?: reflect.Type | null}>) {
		this._fields = {
			Type: $.varRef(init?.Type ?? (null as reflect.Type | null))
		}
	}

	public clone(): invalidUnmarshalError {
		const cloned = new invalidUnmarshalError()
		cloned._fields = {
			Type: $.varRef(this._fields.Type.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Error(): globalThis.Promise<string> {
		const e: invalidUnmarshalError | $.VarRef<invalidUnmarshalError> | null = this
		if ($.pointerValue<invalidUnmarshalError>(e).Type == null) {
			return "asn1: Unmarshal recipient value is nil"
		}

		if (await $.pointerValue<Exclude<reflect.Type, null>>($.pointerValue<invalidUnmarshalError>(e).Type).Kind() != reflect.Pointer) {
			return "asn1: Unmarshal recipient value is non-pointer " + await $.pointerValue<Exclude<reflect.Type, null>>($.pointerValue<invalidUnmarshalError>(e).Type).String()
		}
		return "asn1: Unmarshal recipient value is nil " + await $.pointerValue<Exclude<reflect.Type, null>>($.pointerValue<invalidUnmarshalError>(e).Type).String()
	}

	static __typeInfo = $.registerStructType(
		"asn1.invalidUnmarshalError",
		() => new invalidUnmarshalError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		invalidUnmarshalError,
		[{ name: "Type", key: "Type", type: "reflect.Type", index: [0], offset: 0, exported: true }]
	)
}

export const allowAsterisk: asteriskFlag = true

export const rejectAsterisk: asteriskFlag = false

export const allowAmpersand: ampersandFlag = true

export const rejectAmpersand: ampersandFlag = false

export function parseBool(bytes: $.Slice<number>): [boolean, $.GoError] {
	let ret: boolean = false
	let err: $.GoError = null as $.GoError
	if ($.len(bytes) != 1) {
		err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "invalid boolean"})), "asn1.SyntaxError", "asn1.SyntaxError")
		return [ret, err]
	}

	// DER demands that "If the encoding represents the boolean value TRUE,
	// its single contents octet shall have all eight bits set to one."
	// Thus only 0 and 255 are valid encoded values.
	switch ($.arrayIndex(bytes!, 0)) {
		case 0:
		{
			ret = false
			break
		}
		case 0xff:
		{
			ret = true
			break
		}
		default:
		{
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "invalid boolean"})), "asn1.SyntaxError", "asn1.SyntaxError")
			break
		}
	}

	return [ret, err]
}

export function checkInteger(bytes: $.Slice<number>): $.GoError {
	if ($.len(bytes) == 0) {
		return $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "empty integer"})), "asn1.StructuralError", "asn1.StructuralError")
	}
	if ($.len(bytes) == 1) {
		return null
	}
	if ((($.uint($.arrayIndex(bytes!, 0), 8) == $.uint(0, 8)) && ($.uint(($.arrayIndex(bytes!, 1) & 0x80), 8) == $.uint(0, 8))) || (($.uint($.arrayIndex(bytes!, 0), 8) == $.uint(0xff, 8)) && ($.uint(($.arrayIndex(bytes!, 1) & 0x80), 8) == $.uint(0x80, 8)))) {
		return $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "integer not minimally-encoded"})), "asn1.StructuralError", "asn1.StructuralError")
	}
	return null
}

export function parseInt64(bytes: $.Slice<number>): [bigint, $.GoError] {
	let ret: bigint = 0n
	let err: $.GoError = null as $.GoError
	err = checkInteger(bytes)
	if (err != null) {
		return [ret, err]
	}
	if ($.len(bytes) > 8) {
		// We'll overflow an int64 in this case.
		err = $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "integer too large"})), "asn1.StructuralError", "asn1.StructuralError")
		return [ret, err]
	}
	for (let bytesRead = 0; bytesRead < $.len(bytes); bytesRead++) {
		ret = $.int64Shl(ret, 8n)
		ret = $.int64Or(ret, $.int64($.arrayIndex(bytes!, bytesRead)))
	}

	// Shift up and down in order to sign extend the result.
	ret = $.int64Shl(ret, $.int64(64 - ($.uint($.len(bytes), 8) * 8)))
	ret = $.int64Shr(ret, $.int64(64 - ($.uint($.len(bytes), 8) * 8)))
	return [ret, err]
}

export function parseInt32(bytes: $.Slice<number>): [number, $.GoError] {
	{
		let err = checkInteger(bytes)
		if (err != null) {
			return [$.int(0, 32), err]
		}
	}
	let [ret64, err] = parseInt64(bytes)
	if (err != null) {
		return [$.int(0, 32), err]
	}
	if (ret64 != $.int64($.int(ret64, 32))) {
		return [$.int(0, 32), $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "integer too large"})), "asn1.StructuralError", "asn1.StructuralError")]
	}
	return [$.int($.int(ret64, 32), 32), null]
}

export let bigOne: big.Int | $.VarRef<big.Int> | null = await big.NewInt(1n)

export function __goscript_set_bigOne(__goscriptValue: big.Int | $.VarRef<big.Int> | null): void {
	bigOne = __goscriptValue
}

export function parseBigInt(bytes: $.Slice<number>): [big.Int | $.VarRef<big.Int> | null, $.GoError] {
	{
		let err = checkInteger(bytes)
		if (err != null) {
			return [null, err]
		}
	}
	let ret: big.Int | $.VarRef<big.Int> | null = new big.Int()
	if (($.len(bytes) > 0) && ($.uint(($.arrayIndex(bytes!, 0) & 0x80), 8) == $.uint(0x80, 8))) {
		// This is a negative number.
		let notBytes: $.Slice<number> = $.makeSlice<number>($.len(bytes), undefined, "byte")
		for (let __goscriptRangeTarget0 = notBytes, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			notBytes![i] = $.uint($.uint(~$.arrayIndex(bytes!, i), 8), 8)
		}
		big.Int.prototype.SetBytes.call(ret, notBytes)
		big.Int.prototype.Add.call(ret, ret, bigOne)
		big.Int.prototype.Neg.call(ret, ret)
		return [ret, null]
	}
	big.Int.prototype.SetBytes.call(ret, bytes)
	return [ret, null]
}

export function parseBitString(bytes: $.Slice<number>): [BitString, $.GoError] {
	let ret: BitString = $.markAsStructValue(new BitString())
	let err: $.GoError = null as $.GoError
	if ($.len(bytes) == 0) {
		err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "zero length BIT STRING"})), "asn1.SyntaxError", "asn1.SyntaxError")
		return [ret, err]
	}
	let paddingBits = $.int($.arrayIndex(bytes!, 0))
	if (((paddingBits > 7) || (($.len(bytes) == 1) && (paddingBits > 0))) || ($.uint(($.arrayIndex(bytes!, $.len(bytes) - 1) & ((1 << $.arrayIndex(bytes!, 0)) - 1)), 8) != $.uint(0, 8))) {
		err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "invalid padding bits in BIT STRING"})), "asn1.SyntaxError", "asn1.SyntaxError")
		return [ret, err]
	}
	ret.BitLength = (($.len(bytes) - 1) * 8) - paddingBits
	ret.Bytes = $.goSlice(bytes, 1, undefined)
	return [ret, err]
}

export var NullRawValue: RawValue

export function __goscript_init_NullRawValue(): void {
	if (((NullRawValue) as any) === undefined) {
		NullRawValue = $.markAsStructValue(new RawValue({Tag: 5}))
	}
}

export function __goscript_get_NullRawValue(): RawValue {
	if (((NullRawValue) as any) === undefined) {
		__goscript_init_NullRawValue()
	}
	return NullRawValue
}

export function __goscript_set_NullRawValue(__goscriptValue: RawValue): void {
	NullRawValue = __goscriptValue
}

export var NullBytes: $.Slice<number>

export function __goscript_init_NullBytes(): void {
	if (((NullBytes) as any) === undefined) {
		NullBytes = new Uint8Array([5, 0]) as $.Slice<number>
	}
}

export function __goscript_get_NullBytes(): $.Slice<number> {
	if (((NullBytes) as any) === undefined) {
		__goscript_init_NullBytes()
	}
	return NullBytes
}

export function __goscript_set_NullBytes(__goscriptValue: $.Slice<number>): void {
	NullBytes = __goscriptValue
}

export function ObjectIdentifier_Equal(oi: ObjectIdentifier, other: ObjectIdentifier): boolean {
	return slices.Equal((oi as ObjectIdentifier), (other as ObjectIdentifier))
}

export function ObjectIdentifier_String(oi: ObjectIdentifier): string {
	let s: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	s.value.Grow(32)

	let buf: $.Slice<number> = $.makeSlice<number>(0, 19, "byte")
	for (let __goscriptRangeTarget1 = oi, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		let v = __goscriptRangeTarget1![i]
		if (i > 0) {
			s.value.WriteByte($.uint(46, 8))
		}
		s.value.Write(strconv.AppendInt(buf, $.int64(v), 10))
	}

	return s.value.String()
}

export function parseObjectIdentifier(bytes: $.Slice<number>): [ObjectIdentifier, $.GoError] {
	let s: ObjectIdentifier = null as ObjectIdentifier
	let err: $.GoError = null as $.GoError
	if ($.len(bytes) == 0) {
		err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "zero length OBJECT IDENTIFIER"})), "asn1.SyntaxError", "asn1.SyntaxError")
		return [s, err]
	}

	// In the worst case, we get two elements from the first byte (which is
	// encoded differently) and then every varint is a single byte long.
	s = ($.makeSlice<number>($.len(bytes) + 1, undefined, "number") as ObjectIdentifier)

	// The first varint is 40*value1 + value2:
	// According to this packing, value1 can take the values 0, 1 and 2 only.
	// When value1 = 0 or value1 = 1, then value2 is <= 39. When value1 = 2,
	// then there are no restrictions on value2.
	let __goscriptTuple0: any = parseBase128Int(bytes, 0)
	let v = __goscriptTuple0[0]
	let offset = __goscriptTuple0[1]
	err = __goscriptTuple0[2]
	if (err != null) {
		return [s, err]
	}
	if (v < 80) {
		s![0] = Math.trunc(v / 40)
		s![1] = v % 40
	} else {
		s![0] = 2
		s![1] = v - 80
	}

	let i = 2
	for (; offset < $.len(bytes); i++) {
		let __goscriptTuple1: any = parseBase128Int(bytes, offset)
		v = __goscriptTuple1[0]
		offset = __goscriptTuple1[1]
		err = __goscriptTuple1[2]
		if (err != null) {
			return [s, err]
		}
		s![i] = v
	}
	s = ($.goSlice(s, 0, i) as ObjectIdentifier)
	return [s, err]
}

export function parseBase128Int(bytes: $.Slice<number>, initOffset: number): [number, number, $.GoError] {
	let ret: number = 0
	let offset: number = 0
	let err: $.GoError = null as $.GoError
	offset = initOffset
	let ret64: bigint = 0n
	for (let shifted = 0; offset < $.len(bytes); shifted++) {
		// 5 * 7 bits per byte == 35 bits of data
		// Thus the representation is either non-minimal or too large for an int32
		if (shifted == 5) {
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "base 128 integer too large"})), "asn1.StructuralError", "asn1.StructuralError")
			return [ret, offset, err]
		}
		ret64 = $.int64Shl(ret64, 7n)
		let b = $.uint($.arrayIndex(bytes!, offset), 8)
		// integers should be minimally encoded, so the leading octet should
		// never be 0x80
		if ((shifted == 0) && ($.uint(b, 8) == $.uint(0x80, 8))) {
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "integer is not minimally encoded"})), "asn1.SyntaxError", "asn1.SyntaxError")
			return [ret, offset, err]
		}
		ret64 = $.int64Or(ret64, $.int64(b & 0x7f))
		offset++
		if ($.uint((b & 0x80), 8) == $.uint(0, 8)) {
			ret = $.int(ret64)
			// Ensure that the returned value fits in an int on all platforms
			if (ret64 > 2147483647n) {
				err = $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "base 128 integer too large"})), "asn1.StructuralError", "asn1.StructuralError")
			}
			return [ret, offset, err]
		}
	}
	err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "truncated base 128 integer"})), "asn1.SyntaxError", "asn1.SyntaxError")
	return [ret, offset, err]
}

export function parseUTCTime(bytes: $.Slice<number>): [time.Time, $.GoError] {
	let ret: time.Time = $.markAsStructValue(new time.Time())
	let err: $.GoError = null as $.GoError
	let s = $.bytesToString(bytes)

	let formatStr = "0601021504Z0700"
	let __goscriptTuple2: any = time.Parse(formatStr, s)
	ret = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if (err != null) {
		formatStr = "060102150405Z0700"
		let __goscriptTuple3: any = time.Parse(formatStr, s)
		ret = __goscriptTuple3[0]
		err = __goscriptTuple3[1]
	}
	if (err != null) {
		return [ret, err]
	}

	{
		let serialized = $.markAsStructValue($.cloneStructValue(ret)).Format(formatStr)
		if (!$.stringEqual(serialized, s)) {
			err = fmt.Errorf("asn1: time did not serialize back to the original value and may be invalid: given %q, but serialized as %q", s, serialized)
			return [ret, err]
		}
	}

	if ($.markAsStructValue($.cloneStructValue(ret)).Year() >= 2050) {
		// UTCTime only encodes times prior to 2050. See https://tools.ietf.org/html/rfc5280#section-4.1.2.5.1
		ret = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ret)).AddDate(-100, 0, 0)))
	}

	return [ret, err]
}

export function parseGeneralizedTime(bytes: $.Slice<number>): [time.Time, $.GoError] {
	let ret: time.Time = $.markAsStructValue(new time.Time())
	let err: $.GoError = null as $.GoError
	const formatStr: string = "20060102150405.999999999Z0700"
	let s = $.bytesToString(bytes)

	{
		let __goscriptTuple4: any = time.Parse("20060102150405.999999999Z0700", s)
		ret = __goscriptTuple4[0]
		err = __goscriptTuple4[1]
		if (err != null) {
			return [ret, err]
		}
	}

	{
		let serialized = $.markAsStructValue($.cloneStructValue(ret)).Format("20060102150405.999999999Z0700")
		if (!$.stringEqual(serialized, s)) {
			err = fmt.Errorf("asn1: time did not serialize back to the original value and may be invalid: given %q, but serialized as %q", s, serialized)
		}
	}

	return [ret, err]
}

export function parseNumericString(bytes: $.Slice<number>): [string, $.GoError] {
	let ret: string = ""
	let err: $.GoError = null as $.GoError
	for (let __goscriptRangeTarget2 = bytes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let b = __goscriptRangeTarget2![__rangeIndex]
		if (!isNumeric($.uint(b, 8))) {
			return ["", $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "NumericString contains invalid character"})), "asn1.SyntaxError", "asn1.SyntaxError")]
		}
	}
	return [$.bytesToString(bytes), null]
}

export function isNumeric(b: number): boolean {
	return (($.uint(48, 8) <= $.uint(b, 8)) && ($.uint(b, 8) <= $.uint(57, 8))) || ($.uint(b, 8) == $.uint(32, 8))
}

export function parsePrintableString(bytes: $.Slice<number>): [string, $.GoError] {
	let ret: string = ""
	let err: $.GoError = null as $.GoError
	for (let __goscriptRangeTarget3 = bytes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
		let b = __goscriptRangeTarget3![__rangeIndex]
		if (!isPrintable($.uint(b, 8), true, true)) {
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "PrintableString contains invalid character"})), "asn1.SyntaxError", "asn1.SyntaxError")
			return [ret, err]
		}
	}
	ret = $.bytesToString(bytes)
	return [ret, err]
}

export function isPrintable(b: number, asterisk: asteriskFlag, ampersand: ampersandFlag): boolean {
	return ((((((((((($.uint(97, 8) <= $.uint(b, 8)) && ($.uint(b, 8) <= $.uint(122, 8))) || (($.uint(65, 8) <= $.uint(b, 8)) && ($.uint(b, 8) <= $.uint(90, 8)))) || (($.uint(48, 8) <= $.uint(b, 8)) && ($.uint(b, 8) <= $.uint(57, 8)))) || (($.uint(39, 8) <= $.uint(b, 8)) && ($.uint(b, 8) <= $.uint(41, 8)))) || (($.uint(43, 8) <= $.uint(b, 8)) && ($.uint(b, 8) <= $.uint(47, 8)))) || ($.uint(b, 8) == $.uint(32, 8))) || ($.uint(b, 8) == $.uint(58, 8))) || ($.uint(b, 8) == $.uint(61, 8))) || ($.uint(b, 8) == $.uint(63, 8))) || (asterisk && ($.uint(b, 8) == $.uint(42, 8)))) || (ampersand && ($.uint(b, 8) == $.uint(38, 8)))
}

export function parseIA5String(bytes: $.Slice<number>): [string, $.GoError] {
	let ret: string = ""
	let err: $.GoError = null as $.GoError
	for (let __goscriptRangeTarget4 = bytes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let b = __goscriptRangeTarget4![__rangeIndex]
		if ($.uint(b, 8) >= $.uint(utf8.RuneSelf, 8)) {
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "IA5String contains invalid character"})), "asn1.SyntaxError", "asn1.SyntaxError")
			return [ret, err]
		}
	}
	ret = $.bytesToString(bytes)
	return [ret, err]
}

export function parseT61String(bytes: $.Slice<number>): [string, $.GoError] {
	let ret: string = ""
	let err: $.GoError = null as $.GoError
	// T.61 is a defunct ITU 8-bit character encoding which preceded Unicode.
	// T.61 uses a code page layout that _almost_ exactly maps to the code
	// page layout of the ISO 8859-1 (Latin-1) character encoding, with the
	// exception that a number of characters in Latin-1 are not present
	// in T.61.
	//
	// Instead of mapping which characters are present in Latin-1 but not T.61,
	// we just treat these strings as being encoded using Latin-1. This matches
	// what most of the world does, including BoringSSL.
	let buf: $.Slice<number> = $.makeSlice<number>(0, $.len(bytes), "byte")
	for (let __goscriptRangeTarget5 = bytes, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
		let v = __goscriptRangeTarget5![__rangeIndex]
		// All the 1-byte UTF-8 runes map 1-1 with Latin-1.
		buf = utf8.AppendRune(buf, $.int($.int(v, 32), 32))
	}
	return [$.bytesToString(buf), null]
}

export function parseUTF8String(bytes: $.Slice<number>): [string, $.GoError] {
	let ret: string = ""
	let err: $.GoError = null as $.GoError
	if (!utf8.Valid(bytes)) {
		return ["", errors.New("asn1: invalid UTF-8 string")]
	}
	return [$.bytesToString(bytes), null]
}

export function parseBMPString(bmpString: $.Slice<number>): [string, $.GoError] {
	// BMPString uses the defunct UCS-2 16-bit character encoding, which
	// covers the Basic Multilingual Plane (BMP). UTF-16 was an extension of
	// UCS-2, containing all of the same code points, but also including
	// multi-code point characters (by using surrogate code points). We can
	// treat a UCS-2 encoded string as a UTF-16 encoded string, as long as
	// we reject out the UTF-16 specific code points. This matches the
	// BoringSSL behavior.

	if (($.len(bmpString) % 2) != 0) {
		return ["", errors.New("invalid BMPString")]
	}

	// Strip terminator if present.
	{
		let l = $.len(bmpString)
		if (((l >= 2) && ($.uint($.arrayIndex(bmpString!, l - 1), 8) == $.uint(0, 8))) && ($.uint($.arrayIndex(bmpString!, l - 2), 8) == $.uint(0, 8))) {
			bmpString = $.goSlice(bmpString, undefined, l - 2)
		}
	}

	let s: $.Slice<number> = $.makeSlice<number>(0, Math.trunc($.len(bmpString) / 2), "number")
	while ($.len(bmpString) > 0) {
		let point = $.uint(($.uint($.arrayIndex(bmpString!, 0), 16) << 8) + $.uint($.arrayIndex(bmpString!, 1), 16), 16)
		// Reject UTF-16 code points that are permanently reserved
		// noncharacters (0xfffe, 0xffff, and 0xfdd0-0xfdef) and surrogates
		// (0xd800-0xdfff).
		if (((($.uint(point, 16) == $.uint(0xfffe, 16)) || ($.uint(point, 16) == $.uint(0xffff, 16))) || (($.uint(point, 16) >= $.uint(0xfdd0, 16)) && ($.uint(point, 16) <= $.uint(0xfdef, 16)))) || (($.uint(point, 16) >= $.uint(0xd800, 16)) && ($.uint(point, 16) <= $.uint(0xdfff, 16)))) {
			return ["", errors.New("invalid BMPString")]
		}
		s = $.append(s, $.uint(point, 16))
		bmpString = $.goSlice(bmpString, 2, undefined)
	}

	return [$.runesToString(utf16.Decode(s)), null]
}

export function parseTagAndLength(bytes: $.Slice<number>, initOffset: number): [__goscript_common.tagAndLength, number, $.GoError] {
	let ret: __goscript_common.tagAndLength = $.markAsStructValue(new __goscript_common.tagAndLength())
	let offset: number = 0
	let err: $.GoError = null as $.GoError
	offset = initOffset
	// parseTagAndLength should not be called without at least a single
	// byte to read. Thus this check is for robustness:
	if (offset >= $.len(bytes)) {
		err = errors.New("asn1: internal error in parseTagAndLength")
		return [ret, offset, err]
	}
	let b = $.uint($.arrayIndex(bytes!, offset), 8)
	offset++
	ret._class = $.int($.uintShr(b, 6, 8))
	ret.isCompound = $.uint((b & 0x20), 8) == $.uint(0x20, 8)
	ret.tag = $.int(b & 0x1f)

	// If the bottom five bits are set, then the tag number is actually base 128
	// encoded afterwards
	if (ret.tag == 0x1f) {
		let __goscriptTuple5: any = parseBase128Int(bytes, offset)
		ret.tag = __goscriptTuple5[0]
		offset = __goscriptTuple5[1]
		err = __goscriptTuple5[2]
		if (err != null) {
			return [ret, offset, err]
		}
		// Tags should be encoded in minimal form.
		if (ret.tag < 0x1f) {
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "non-minimal tag"})), "asn1.SyntaxError", "asn1.SyntaxError")
			return [ret, offset, err]
		}
	}
	if (offset >= $.len(bytes)) {
		err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "truncated tag or length"})), "asn1.SyntaxError", "asn1.SyntaxError")
		return [ret, offset, err]
	}
	b = $.uint($.arrayIndex(bytes!, offset), 8)
	offset++
	if ($.uint((b & 0x80), 8) == $.uint(0, 8)) {
		// The length is encoded in the bottom 7 bits.
		ret.length = $.int(b & 0x7f)
	} else {
		// Bottom 7 bits give the number of length bytes to follow.
		let numBytes = $.int(b & 0x7f)
		if (numBytes == 0) {
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "indefinite length found (not DER)"})), "asn1.SyntaxError", "asn1.SyntaxError")
			return [ret, offset, err]
		}
		ret.length = 0
		for (let i = 0; i < numBytes; i++) {
			if (offset >= $.len(bytes)) {
				err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "truncated tag or length"})), "asn1.SyntaxError", "asn1.SyntaxError")
				return [ret, offset, err]
			}
			b = $.uint($.arrayIndex(bytes!, offset), 8)
			offset++
			if (ret.length >= (8388608)) {
				// We can't shift ret.length up without
				// overflowing.
				err = $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "length too large"})), "asn1.StructuralError", "asn1.StructuralError")
				return [ret, offset, err]
			}
			ret.length = ret.length << (8)
			ret.length = ret.length | ($.int(b))
			if (ret.length == 0) {
				// DER requires that lengths be minimal.
				err = $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "superfluous leading zeros in length"})), "asn1.StructuralError", "asn1.StructuralError")
				return [ret, offset, err]
			}
		}
		// Short lengths must be encoded in short form.
		if (ret.length < 0x80) {
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "non-minimal length"})), "asn1.StructuralError", "asn1.StructuralError")
			return [ret, offset, err]
		}
	}

	return [ret, offset, err]
}

export async function parseSequenceOf(bytes: $.Slice<number>, sliceType: reflect.Type | null, elemType: reflect.Type | null): globalThis.Promise<[reflect.Value, $.GoError]> {
	let ret: reflect.Value = $.markAsStructValue(new reflect.Value())
	let err: $.GoError = null as $.GoError
	let [matchAny, expectedTag, compoundType, ok] = await __goscript_common.getUniversalType(elemType)
	if (!ok) {
		err = $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "unknown Go type for slice"})), "asn1.StructuralError", "asn1.StructuralError")
		return [ret, err]
	}

	// First we iterate over the input and count the number of elements,
	// checking that the types are correct in each case.
	let numElements = 0
	for (let offset = 0; offset < $.len(bytes); ) {
		let t: __goscript_common.tagAndLength = $.markAsStructValue(new __goscript_common.tagAndLength())
		let __goscriptTuple6: any = parseTagAndLength(bytes, offset)
		t = __goscriptTuple6[0]
		offset = __goscriptTuple6[1]
		err = __goscriptTuple6[2]
		if (err != null) {
			return [ret, err]
		}
		switch (t.tag) {
			case 22:
			case 27:
			case 20:
			case 12:
			case 18:
			case 30:
			{
				t.tag = 19
				break
			}
			case 24:
			case 23:
			{
				t.tag = 23
				break
			}
		}

		if (!matchAny && (((t._class != 0) || (t.isCompound != compoundType)) || (t.tag != expectedTag))) {
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "sequence tag mismatch"})), "asn1.StructuralError", "asn1.StructuralError")
			return [ret, err]
		}
		if (invalidLength(offset, t.length, $.len(bytes))) {
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "truncated sequence"})), "asn1.SyntaxError", "asn1.SyntaxError")
			return [ret, err]
		}
		offset = offset + (t.length)
		numElements++
	}
	let elemSize = $.uint64(await $.pointerValue<Exclude<reflect.Type, null>>(elemType).Size())
	let safeCap = saferio.SliceCapWithSize(elemSize, $.uint64(numElements))
	if (safeCap < 0) {
		err = $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField0 = await fmt.Sprintf("%s slice too big: %d elements of %d bytes", $.namedValueInterfaceValue<any>(await $.pointerValue<Exclude<reflect.Type, null>>(elemType).Kind(), "reflect.Kind", {String: (receiver: any, ...args: any[]) => (reflect.Kind_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint", typeName: "reflect.Kind" }, [{ name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }]), $.namedValueInterfaceValue<any>(numElements, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>(elemSize, "uint64", {}, { kind: $.TypeKind.Basic, name: "uint64" })); return $.markAsStructValue(new SyntaxError({Msg: __goscriptLiteralField0})) })()), "asn1.SyntaxError", "asn1.SyntaxError")
		return [ret, err]
	}
	ret = $.markAsStructValue($.cloneStructValue(reflect.MakeSlice($.pointerValueOrNil(sliceType)!, 0, safeCap)))
	let params = $.markAsStructValue(new __goscript_common.fieldParameters())
	let offset = 0
	for (let i = 0; i < numElements; i++) {
		ret = $.markAsStructValue($.cloneStructValue(reflect.Append($.markAsStructValue($.cloneStructValue(ret)), $.markAsStructValue($.cloneStructValue(reflect.Zero($.pointerValueOrNil(elemType)!))))))
		let __goscriptTuple7: any = await parseField($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ret)).Index(i))), bytes, offset, $.markAsStructValue($.cloneStructValue(params)))
		offset = __goscriptTuple7[0]
		err = __goscriptTuple7[1]
		if (err != null) {
			return [ret, err]
		}
	}
	return [ret, err]
}

export let bitStringType: reflect.Type | null = reflect.TypeFor({T: { type: "asn1.BitString", zero: () => $.markAsStructValue(new BitString()), methods: {At: (receiver: any, ...args: any[]) => receiver.At(...args), RightAlign: (receiver: any, ...args: any[]) => receiver.RightAlign(...args)} }})

export function __goscript_set_bitStringType(__goscriptValue: reflect.Type | null): void {
	bitStringType = __goscriptValue
}

export let objectIdentifierType: reflect.Type | null = reflect.TypeFor({T: { type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, zero: () => null, methods: {Equal: (receiver: any, ...args: any[]) => (ObjectIdentifier_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (ObjectIdentifier_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, methodSignatures: [{ name: "Equal", args: [{ name: "other", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }] }})

export function __goscript_set_objectIdentifierType(__goscriptValue: reflect.Type | null): void {
	objectIdentifierType = __goscriptValue
}

export let enumeratedType: reflect.Type | null = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "int", typeName: "asn1.Enumerated" }, zero: () => 0 }})

export function __goscript_set_enumeratedType(__goscriptValue: reflect.Type | null): void {
	enumeratedType = __goscriptValue
}

export let flagType: reflect.Type | null = reflect.TypeFor({T: { type: { kind: $.TypeKind.Basic, name: "bool", typeName: "asn1.Flag" }, zero: () => false }})

export function __goscript_set_flagType(__goscriptValue: reflect.Type | null): void {
	flagType = __goscriptValue
}

export let timeType: reflect.Type | null = reflect.TypeFor({T: { type: "time.Time", zero: () => $.markAsStructValue(new time.Time()), methods: {Add: (receiver: any, ...args: any[]) => receiver.Add(...args), AddDate: (receiver: any, ...args: any[]) => receiver.AddDate(...args), After: (receiver: any, ...args: any[]) => receiver.After(...args), AppendBinary: (receiver: any, ...args: any[]) => receiver.AppendBinary(...args), AppendFormat: (receiver: any, ...args: any[]) => receiver.AppendFormat(...args), AppendText: (receiver: any, ...args: any[]) => receiver.AppendText(...args), Before: (receiver: any, ...args: any[]) => receiver.Before(...args), Clock: (receiver: any, ...args: any[]) => receiver.Clock(...args), Compare: (receiver: any, ...args: any[]) => receiver.Compare(...args), Date: (receiver: any, ...args: any[]) => receiver.Date(...args), Day: (receiver: any, ...args: any[]) => receiver.Day(...args), Equal: (receiver: any, ...args: any[]) => receiver.Equal(...args), Format: (receiver: any, ...args: any[]) => receiver.Format(...args), GoString: (receiver: any, ...args: any[]) => receiver.GoString(...args), GobEncode: (receiver: any, ...args: any[]) => receiver.GobEncode(...args), Hour: (receiver: any, ...args: any[]) => receiver.Hour(...args), ISOWeek: (receiver: any, ...args: any[]) => receiver.ISOWeek(...args), In: (receiver: any, ...args: any[]) => receiver.In(...args), IsDST: (receiver: any, ...args: any[]) => receiver.IsDST(...args), IsZero: (receiver: any, ...args: any[]) => receiver.IsZero(...args), Local: (receiver: any, ...args: any[]) => receiver.Local(...args), Location: (receiver: any, ...args: any[]) => receiver.Location(...args), MarshalBinary: (receiver: any, ...args: any[]) => receiver.MarshalBinary(...args), MarshalJSON: (receiver: any, ...args: any[]) => receiver.MarshalJSON(...args), MarshalText: (receiver: any, ...args: any[]) => receiver.MarshalText(...args), Minute: (receiver: any, ...args: any[]) => receiver.Minute(...args), Month: (receiver: any, ...args: any[]) => receiver.Month(...args), Nanosecond: (receiver: any, ...args: any[]) => receiver.Nanosecond(...args), Round: (receiver: any, ...args: any[]) => receiver.Round(...args), Second: (receiver: any, ...args: any[]) => receiver.Second(...args), String: (receiver: any, ...args: any[]) => receiver.String(...args), Sub: (receiver: any, ...args: any[]) => receiver.Sub(...args), Truncate: (receiver: any, ...args: any[]) => receiver.Truncate(...args), UTC: (receiver: any, ...args: any[]) => receiver.UTC(...args), Unix: (receiver: any, ...args: any[]) => receiver.Unix(...args), UnixMicro: (receiver: any, ...args: any[]) => receiver.UnixMicro(...args), UnixMilli: (receiver: any, ...args: any[]) => receiver.UnixMilli(...args), UnixNano: (receiver: any, ...args: any[]) => receiver.UnixNano(...args), Weekday: (receiver: any, ...args: any[]) => receiver.Weekday(...args), Year: (receiver: any, ...args: any[]) => receiver.Year(...args), YearDay: (receiver: any, ...args: any[]) => receiver.YearDay(...args), Zone: (receiver: any, ...args: any[]) => receiver.Zone(...args), ZoneBounds: (receiver: any, ...args: any[]) => receiver.ZoneBounds(...args), absSec: (receiver: any, ...args: any[]) => receiver.absSec(...args), appendFormat: (receiver: any, ...args: any[]) => receiver.appendFormat(...args), appendFormatRFC3339: (receiver: any, ...args: any[]) => receiver.appendFormatRFC3339(...args), appendStrictRFC3339: (receiver: any, ...args: any[]) => receiver.appendStrictRFC3339(...args), appendTo: (receiver: any, ...args: any[]) => receiver.appendTo(...args), locabs: (receiver: any, ...args: any[]) => receiver.locabs(...args)} }})

export function __goscript_set_timeType(__goscriptValue: reflect.Type | null): void {
	timeType = __goscriptValue
}

export let rawValueType: reflect.Type | null = reflect.TypeFor({T: { type: "asn1.RawValue", zero: () => $.markAsStructValue(new RawValue()) }})

export function __goscript_set_rawValueType(__goscriptValue: reflect.Type | null): void {
	rawValueType = __goscriptValue
}

export let rawContentsType: reflect.Type | null = reflect.TypeFor({T: { type: { kind: $.TypeKind.Slice, typeName: "asn1.RawContent", elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, zero: () => null }})

export function __goscript_set_rawContentsType(__goscriptValue: reflect.Type | null): void {
	rawContentsType = __goscriptValue
}

export let bigIntType: reflect.Type | null = reflect.TypeFor({T: { type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, zero: () => null }})

export function __goscript_set_bigIntType(__goscriptValue: reflect.Type | null): void {
	bigIntType = __goscriptValue
}

export function invalidLength(offset: number, length: number, sliceLength: number): boolean {
	return ((offset + length) < offset) || ((offset + length) > sliceLength)
}

export async function parseField(v: reflect.Value, bytes: $.Slice<number>, initOffset: number, params: __goscript_common.fieldParameters): globalThis.Promise<[number, $.GoError]> {
	let offset: number = 0
	let err: $.GoError = null as $.GoError
	offset = initOffset
	let fieldType = $.markAsStructValue($.cloneStructValue(v)).Type()

	// If we have run out of data, it may be that there are optional elements at the end.
	if (offset == $.len(bytes)) {
		if (!setDefaultValue($.markAsStructValue($.cloneStructValue(v)), $.markAsStructValue($.cloneStructValue(params)))) {
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "sequence truncated"})), "asn1.SyntaxError", "asn1.SyntaxError")
		}
		return [offset, err]
	}

	// Deal with the ANY type.
	{
		let ifaceType: reflect.Type | null = fieldType
		if ((await $.pointerValue<Exclude<reflect.Type, null>>(ifaceType).Kind() == reflect.Interface) && (await $.pointerValue<Exclude<reflect.Type, null>>(ifaceType).NumMethod() == 0)) {
			let t: __goscript_common.tagAndLength = $.markAsStructValue(new __goscript_common.tagAndLength())
			let __goscriptTuple8: any = parseTagAndLength(bytes, offset)
			t = __goscriptTuple8[0]
			offset = __goscriptTuple8[1]
			err = __goscriptTuple8[2]
			if (err != null) {
				return [offset, err]
			}
			if (invalidLength(offset, t.length, $.len(bytes))) {
				err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "data truncated"})), "asn1.SyntaxError", "asn1.SyntaxError")
				return [offset, err]
			}
			let result: any = null as any
			if (!t.isCompound && (t._class == 0)) {
				let innerBytes: $.Slice<number> = $.goSlice(bytes, offset, offset + t.length)
				switch (t.tag) {
					case 1:
					{
						let __goscriptTuple9: any = parseBool(innerBytes)
						result = __goscriptTuple9[0]
						err = __goscriptTuple9[1]
						break
					}
					case 19:
					{
						let __goscriptTuple10: any = parsePrintableString(innerBytes)
						result = __goscriptTuple10[0]
						err = __goscriptTuple10[1]
						break
					}
					case 18:
					{
						let __goscriptTuple11: any = parseNumericString(innerBytes)
						result = __goscriptTuple11[0]
						err = __goscriptTuple11[1]
						break
					}
					case 22:
					{
						let __goscriptTuple12: any = parseIA5String(innerBytes)
						result = __goscriptTuple12[0]
						err = __goscriptTuple12[1]
						break
					}
					case 20:
					{
						let __goscriptTuple13: any = parseT61String(innerBytes)
						result = __goscriptTuple13[0]
						err = __goscriptTuple13[1]
						break
					}
					case 12:
					{
						let __goscriptTuple14: any = parseUTF8String(innerBytes)
						result = __goscriptTuple14[0]
						err = __goscriptTuple14[1]
						break
					}
					case 2:
					{
						let __goscriptTuple15: any = parseInt64(innerBytes)
						result = $.namedValueInterfaceValue<any>(__goscriptTuple15[0], "int64", {}, { kind: $.TypeKind.Basic, name: "int64" })
						err = __goscriptTuple15[1]
						break
					}
					case 3:
					{
						let __goscriptTuple16: any = parseBitString(innerBytes)
						result = $.interfaceValue<any>(__goscriptTuple16[0], "asn1.BitString", "asn1.BitString")
						err = __goscriptTuple16[1]
						break
					}
					case 6:
					{
						let __goscriptTuple17: any = parseObjectIdentifier(innerBytes)
						result = $.namedValueInterfaceValue<any>(__goscriptTuple17[0], "asn1.ObjectIdentifier", {Equal: (receiver: any, ...args: any[]) => (ObjectIdentifier_Equal as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (ObjectIdentifier_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } }, [{ name: "Equal", args: [{ name: "other", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }])
						err = __goscriptTuple17[1]
						break
					}
					case 23:
					{
						let __goscriptTuple18: any = parseUTCTime(innerBytes)
						result = $.interfaceValue<any>(__goscriptTuple18[0], "time.Time", "time.Time")
						err = __goscriptTuple18[1]
						break
					}
					case 24:
					{
						let __goscriptTuple19: any = parseGeneralizedTime(innerBytes)
						result = $.interfaceValue<any>(__goscriptTuple19[0], "time.Time", "time.Time")
						err = __goscriptTuple19[1]
						break
					}
					case 4:
					{
						result = $.interfaceValue<any>(innerBytes, "[]byte", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } })
						break
					}
					case 30:
					{
						let __goscriptTuple20: any = parseBMPString(innerBytes)
						result = __goscriptTuple20[0]
						err = __goscriptTuple20[1]
						break
					}
					default:
					{
						break
					}
				}
			}
			offset = offset + (t.length)
			if (err != null) {
				return [offset, err]
			}
			if (result != null) {
				$.markAsStructValue($.cloneStructValue(v)).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf(result))))
			}
			return [offset, err]
		}
	}

	let __goscriptTuple21: any = parseTagAndLength(bytes, offset)
	let t = __goscriptTuple21[0]
	offset = __goscriptTuple21[1]
	err = __goscriptTuple21[2]
	if (err != null) {
		return [offset, err]
	}
	if (params.explicit) {
		let expectedClass = 2
		if (params.application) {
			expectedClass = 1
		}
		if (offset == $.len(bytes)) {
			err = $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "explicit tag has no child"})), "asn1.StructuralError", "asn1.StructuralError")
			return [offset, err]
		}
		if (((t._class == expectedClass) && (t.tag == $.pointerValue<number>(params.tag))) && ((t.length == 0) || t.isCompound)) {
			if ($.comparableEqual(fieldType, rawValueType)) {
			} else {
				if (t.length > 0) {
					let __goscriptTuple22: any = parseTagAndLength(bytes, offset)
					t = __goscriptTuple22[0]
					offset = __goscriptTuple22[1]
					err = __goscriptTuple22[2]
					if (err != null) {
						return [offset, err]
					}
				} else {
					if (!$.comparableEqual(fieldType, flagType)) {
						err = $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "zero length explicit tag was not an asn1.Flag"})), "asn1.StructuralError", "asn1.StructuralError")
						return [offset, err]
					}
					$.markAsStructValue($.cloneStructValue(v)).SetBool(true)
					return [offset, err]
				}
			}
		} else {
			// The tags didn't match, it might be an optional element.
			let ok = setDefaultValue($.markAsStructValue($.cloneStructValue(v)), $.markAsStructValue($.cloneStructValue(params)))
			if (ok) {
				offset = initOffset
			} else {
				err = $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "explicitly tagged member didn't match"})), "asn1.StructuralError", "asn1.StructuralError")
			}
			return [offset, err]
		}
	}

	let [matchAny, universalTag, compoundType, ok1] = await __goscript_common.getUniversalType(fieldType)
	if (!ok1) {
		err = $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField1 = await fmt.Sprintf("unknown Go type: %v", (fieldType as any)); return $.markAsStructValue(new StructuralError({Msg: __goscriptLiteralField1})) })()), "asn1.StructuralError", "asn1.StructuralError")
		return [offset, err]
	}

	// Special case for strings: all the ASN.1 string types map to the Go
	// type string. getUniversalType returns the tag for PrintableString
	// when it sees a string, so if we see a different string type on the
	// wire, we change the universal type to match.
	if (universalTag == 19) {
		if (t._class == 0) {
			switch (t.tag) {
				case 22:
				case 27:
				case 20:
				case 12:
				case 18:
				case 30:
				{
					universalTag = t.tag
					break
				}
			}
		} else {
			if (params.stringType != 0) {
				universalTag = params.stringType
			}
		}
	}

	// Special case for time: UTCTime and GeneralizedTime both map to the
	// Go type time.Time. getUniversalType returns the tag for UTCTime when
	// it sees a time.Time, so if we see a different time type on the wire,
	// or the field is tagged with a different type, we change the universal
	// type to match.
	if (universalTag == 23) {
		if (t._class == 0) {
			if (t.tag == 24) {
				universalTag = t.tag
			}
		} else {
			if (params.timeType != 0) {
				universalTag = params.timeType
			}
		}
	}

	if (params._set) {
		universalTag = 17
	}

	let matchAnyClassAndTag = matchAny
	let expectedClass = 0
	let expectedTag = universalTag

	if (!params.explicit && (params.tag != null)) {
		expectedClass = 2
		expectedTag = $.pointerValue<number>(params.tag)
		matchAnyClassAndTag = false
	}

	if ((!params.explicit && params.application) && (params.tag != null)) {
		expectedClass = 1
		expectedTag = $.pointerValue<number>(params.tag)
		matchAnyClassAndTag = false
	}

	if ((!params.explicit && params._private) && (params.tag != null)) {
		expectedClass = 3
		expectedTag = $.pointerValue<number>(params.tag)
		matchAnyClassAndTag = false
	}

	// We have unwrapped any explicit tagging at this point.
	if ((!matchAnyClassAndTag && ((t._class != expectedClass) || (t.tag != expectedTag))) || (!matchAny && (t.isCompound != compoundType))) {
		// Tags don't match. Again, it could be an optional element.
		let ok = setDefaultValue($.markAsStructValue($.cloneStructValue(v)), $.markAsStructValue($.cloneStructValue(params)))
		if (ok) {
			offset = initOffset
		} else {
			err = $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField2 = await fmt.Sprintf("tags don't match (%d vs %+v) %+v %s @%d", $.namedValueInterfaceValue<any>(expectedTag, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(t)), "asn1.tagAndLength", "asn1.tagAndLength"), $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(params)), "asn1.fieldParameters", "asn1.fieldParameters"), await $.pointerValue<Exclude<reflect.Type, null>>(fieldType).Name(), $.namedValueInterfaceValue<any>(offset, "int", {}, { kind: $.TypeKind.Basic, name: "int" })); return $.markAsStructValue(new StructuralError({Msg: __goscriptLiteralField2})) })()), "asn1.StructuralError", "asn1.StructuralError")
		}
		return [offset, err]
	}
	if (invalidLength(offset, t.length, $.len(bytes))) {
		err = $.interfaceValue<$.GoError>($.markAsStructValue(new SyntaxError({Msg: "data truncated"})), "asn1.SyntaxError", "asn1.SyntaxError")
		return [offset, err]
	}
	let innerBytes: $.Slice<number> = $.goSlice(bytes, offset, offset + t.length)
	offset = offset + (t.length)

	// We deal with the structures defined in this package first.
	{
		const __goscriptTypeSwitchValue = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Addr())).Interface()
		switch (true) {
			case $.typeAssert<RawValue | $.VarRef<RawValue> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "asn1.RawValue" }).ok:
				{
					let v: RawValue | $.VarRef<RawValue> | null = $.typeAssert<RawValue | $.VarRef<RawValue> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "asn1.RawValue" }).value
					$.assignStruct($.pointerValue<RawValue>(v), $.markAsStructValue(new RawValue({Class: t._class, Tag: t.tag, IsCompound: t.isCompound, Bytes: innerBytes, FullBytes: $.goSlice(bytes, initOffset, offset)})))
					return [offset, err]
				}
				break
			case $.typeAssert<$.VarRef<ObjectIdentifier> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }).ok:
				{
					let v: $.VarRef<ObjectIdentifier> | null = $.typeAssert<$.VarRef<ObjectIdentifier> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }).value
					let __goscriptTuple23: any = parseObjectIdentifier(innerBytes)
					v!.value = (__goscriptTuple23[0] as ObjectIdentifier)
					err = __goscriptTuple23[1]
					return [offset, err]
				}
				break
			case $.typeAssert<BitString | $.VarRef<BitString> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "asn1.BitString" }).ok:
				{
					let v: BitString | $.VarRef<BitString> | null = $.typeAssert<BitString | $.VarRef<BitString> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "asn1.BitString" }).value
					let __goscriptTuple24: any = parseBitString(innerBytes)
					$.assignStruct($.pointerValue<BitString>(v), __goscriptTuple24[0])
					err = __goscriptTuple24[1]
					return [offset, err]
				}
				break
			case $.typeAssert<time.Time | $.VarRef<time.Time> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "time.Time" }).ok:
				{
					let v: time.Time | $.VarRef<time.Time> | null = $.typeAssert<time.Time | $.VarRef<time.Time> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "time.Time" }).value
					if (universalTag == 23) {
						let __goscriptTuple25: any = parseUTCTime(innerBytes)
						$.assignStruct($.pointerValue<time.Time>(v), __goscriptTuple25[0])
						err = __goscriptTuple25[1]
						return [offset, err]
					}
					let __goscriptTuple26: any = parseGeneralizedTime(innerBytes)
					$.assignStruct($.pointerValue<time.Time>(v), __goscriptTuple26[0])
					err = __goscriptTuple26[1]
					return [offset, err]
				}
				break
			case $.typeAssert<$.VarRef<Enumerated> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int", typeName: "asn1.Enumerated" } }).ok:
				{
					let v: $.VarRef<Enumerated> | null = $.typeAssert<$.VarRef<Enumerated> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "int", typeName: "asn1.Enumerated" } }).value
					let __goscriptTuple27: any = parseInt32(innerBytes)
					let parsedInt = $.int(__goscriptTuple27[0], 32)
					let err1 = __goscriptTuple27[1]
					if (err1 == null) {
						v!.value = $.int(parsedInt)
					}
					err = err1
					return [offset, err]
				}
				break
			case $.typeAssert<$.VarRef<Flag> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool", typeName: "asn1.Flag" } }).ok:
				{
					let v: $.VarRef<Flag> | null = $.typeAssert<$.VarRef<Flag> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Basic, name: "bool", typeName: "asn1.Flag" } }).value
					v!.value = true
					return [offset, err]
				}
				break
			case $.typeAssert<$.VarRef<big.Int | $.VarRef<big.Int> | null> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }).ok:
				{
					let v: $.VarRef<big.Int | $.VarRef<big.Int> | null> | null = $.typeAssert<$.VarRef<big.Int | $.VarRef<big.Int> | null> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Pointer, elemType: "big.Int" } }).value
					let __goscriptTuple28: any = parseBigInt(innerBytes)
					let parsedInt: big.Int | $.VarRef<big.Int> | null = __goscriptTuple28[0]
					let err1 = __goscriptTuple28[1]
					if (err1 == null) {
						v!.value = parsedInt
					}
					err = err1
					return [offset, err]
				}
				break
		}
	}
	{
		let val = $.markAsStructValue($.cloneStructValue(v))
		switch ($.markAsStructValue($.cloneStructValue(val)).Kind()) {
			case reflect.Bool:
			{
				let [parsedBool, err1] = parseBool(innerBytes)
				if (err1 == null) {
					$.markAsStructValue($.cloneStructValue(val)).SetBool(parsedBool)
				}
				err = err1
				return [offset, err]
				break
			}
			case reflect.Int:
			case reflect.Int32:
			case reflect.Int64:
			{
				if ($.uint(await $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(val)).Type()).Size(), 64) == $.uint(4, 64)) {
					let __goscriptTuple29: any = parseInt32(innerBytes)
					let parsedInt = $.int(__goscriptTuple29[0], 32)
					let err1 = __goscriptTuple29[1]
					if (err1 == null) {
						$.markAsStructValue($.cloneStructValue(val)).SetInt($.int64(parsedInt))
					}
					err = err1
				} else {
					let [parsedInt, err1] = parseInt64(innerBytes)
					if (err1 == null) {
						$.markAsStructValue($.cloneStructValue(val)).SetInt(parsedInt)
					}
					err = err1
				}
				return [offset, err]
				break
			}
			case reflect.Struct:
			{
				let structType: reflect.Type | null = fieldType

				for (let i = 0; i < await $.pointerValue<Exclude<reflect.Type, null>>(structType).NumField(); i++) {
					if (!$.markAsStructValue($.cloneStructValue((await $.pointerValue<Exclude<reflect.Type, null>>(structType).Field(i)))).IsExported()) {
						err = $.interfaceValue<$.GoError>($.markAsStructValue(new StructuralError({Msg: "struct contains unexported fields"})), "asn1.StructuralError", "asn1.StructuralError")
						return [offset, err]
					}
				}

				if ((await $.pointerValue<Exclude<reflect.Type, null>>(structType).NumField() > 0) && ($.comparableEqual((await $.pointerValue<Exclude<reflect.Type, null>>(structType).Field(0)).Type, rawContentsType))) {
					let __goscriptShadow0 = bytes
					let __goscriptShadow1: $.Slice<number> = $.goSlice(__goscriptShadow0, initOffset, offset)
					$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(val)).Field(0))).Set($.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>((__goscriptShadow1 as RawContent), "asn1.RawContent", { kind: $.TypeKind.Slice, typeName: "asn1.RawContent", elemType: { kind: $.TypeKind.Basic, name: "uint8" } })))))
				}

				let innerOffset = 0
				for (let i = 0; i < await $.pointerValue<Exclude<reflect.Type, null>>(structType).NumField(); i++) {
					let field = $.markAsStructValue($.cloneStructValue(await $.pointerValue<Exclude<reflect.Type, null>>(structType).Field(i)))
					if ((i == 0) && ($.comparableEqual(field.Type, rawContentsType))) {
						continue
					}
					let __goscriptTuple30: any = await parseField($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(val)).Field(i))), innerBytes, innerOffset, $.markAsStructValue($.cloneStructValue(__goscript_common.parseFieldParameters(reflect.StructTag_Get(field.Tag, "asn1")))))
					innerOffset = __goscriptTuple30[0]
					err = __goscriptTuple30[1]
					if (err != null) {
						return [offset, err]
					}
				}
				// We allow extra bytes at the end of the SEQUENCE because
				// adding elements to the end has been used in X.509 as the
				// version numbers have increased.
				return [offset, err]
				break
			}
			case reflect.Slice:
			{
				let sliceType: reflect.Type | null = fieldType
				if (await $.pointerValue<Exclude<reflect.Type, null>>((await $.pointerValue<Exclude<reflect.Type, null>>(sliceType).Elem())).Kind() == reflect.Uint8) {
					$.markAsStructValue($.cloneStructValue(val)).Set($.markAsStructValue($.cloneStructValue(reflect.MakeSlice($.pointerValueOrNil(sliceType)!, $.len(innerBytes), $.len(innerBytes)))))
					reflect.Copy($.markAsStructValue($.cloneStructValue(val)), $.markAsStructValue($.cloneStructValue(reflect.ValueOf($.interfaceValue<any>(innerBytes, "[]byte", { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } })))))
					return [offset, err]
				}
				let [newSlice, err1] = await parseSequenceOf(innerBytes, sliceType, await $.pointerValue<Exclude<reflect.Type, null>>(sliceType).Elem())
				if (err1 == null) {
					$.markAsStructValue($.cloneStructValue(val)).Set($.markAsStructValue($.cloneStructValue(newSlice)))
				}
				err = err1
				return [offset, err]
				break
			}
			case reflect.String:
			{
				let __goscriptShadow2: string = ""
				switch (universalTag) {
					case 19:
					{
						let __goscriptTuple31: any = parsePrintableString(innerBytes)
						__goscriptShadow2 = __goscriptTuple31[0]
						err = __goscriptTuple31[1]
						break
					}
					case 18:
					{
						let __goscriptTuple32: any = parseNumericString(innerBytes)
						__goscriptShadow2 = __goscriptTuple32[0]
						err = __goscriptTuple32[1]
						break
					}
					case 22:
					{
						let __goscriptTuple33: any = parseIA5String(innerBytes)
						__goscriptShadow2 = __goscriptTuple33[0]
						err = __goscriptTuple33[1]
						break
					}
					case 20:
					{
						let __goscriptTuple34: any = parseT61String(innerBytes)
						__goscriptShadow2 = __goscriptTuple34[0]
						err = __goscriptTuple34[1]
						break
					}
					case 12:
					{
						let __goscriptTuple35: any = parseUTF8String(innerBytes)
						__goscriptShadow2 = __goscriptTuple35[0]
						err = __goscriptTuple35[1]
						break
					}
					case 27:
					{
						let __goscriptTuple36: any = parseT61String(innerBytes)
						__goscriptShadow2 = __goscriptTuple36[0]
						err = __goscriptTuple36[1]
						break
					}
					case 30:
					{
						let __goscriptTuple37: any = parseBMPString(innerBytes)
						__goscriptShadow2 = __goscriptTuple37[0]
						err = __goscriptTuple37[1]
						break
					}
					default:
					{
						err = $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField3 = await fmt.Sprintf("internal error: unknown string type %d", $.namedValueInterfaceValue<any>(universalTag, "int", {}, { kind: $.TypeKind.Basic, name: "int" })); return $.markAsStructValue(new SyntaxError({Msg: __goscriptLiteralField3})) })()), "asn1.SyntaxError", "asn1.SyntaxError")
						break
					}
				}
				if (err == null) {
					$.markAsStructValue($.cloneStructValue(val)).SetString(__goscriptShadow2)
				}
				return [offset, err]
				break
			}
		}
	}
	err = $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField4 = "unsupported: " + await $.pointerValue<Exclude<reflect.Type, null>>($.markAsStructValue($.cloneStructValue(v)).Type()).String(); return $.markAsStructValue(new StructuralError({Msg: __goscriptLiteralField4})) })()), "asn1.StructuralError", "asn1.StructuralError")
	return [offset, err]
}

export function canHaveDefaultValue(k: reflect.Kind): boolean {
	switch (k) {
		case reflect.Int:
		case reflect.Int8:
		case reflect.Int16:
		case reflect.Int32:
		case reflect.Int64:
		{
			return true
			break
		}
	}

	return false
}

export function setDefaultValue(v: reflect.Value, params: __goscript_common.fieldParameters): boolean {
	let ok: boolean = false
	if (!params.optional) {
		return ok
	}
	ok = true
	if (params.defaultValue == null) {
		return ok
	}
	if (canHaveDefaultValue($.markAsStructValue($.cloneStructValue(v)).Kind())) {
		$.markAsStructValue($.cloneStructValue(v)).SetInt($.pointerValue<bigint>(params.defaultValue))
	}
	return ok
}

export async function Unmarshal(b: $.Slice<number>, val: any): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let rest: $.Slice<number> = null as $.Slice<number>
	let err: $.GoError = null as $.GoError
	return UnmarshalWithParams(b, val, "")
}

export async function UnmarshalWithParams(b: $.Slice<number>, val: any, params: string): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let rest: $.Slice<number> = null as $.Slice<number>
	let err: $.GoError = null as $.GoError
	let v = $.markAsStructValue($.cloneStructValue(reflect.ValueOf(val)))
	if (($.markAsStructValue($.cloneStructValue(v)).Kind() != reflect.Pointer) || $.markAsStructValue($.cloneStructValue(v)).IsNil()) {
		return [null, $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField5 = reflect.TypeOf(val); return new invalidUnmarshalError({Type: __goscriptLiteralField5}) })(), "*asn1.invalidUnmarshalError", { kind: $.TypeKind.Pointer, elemType: "asn1.invalidUnmarshalError" })]
	}
	let __goscriptTuple38: any = await parseField($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(v)).Elem())), b, 0, $.markAsStructValue($.cloneStructValue(__goscript_common.parseFieldParameters(params))))
	let offset = __goscriptTuple38[0]
	err = __goscriptTuple38[1]
	if (err != null) {
		return [null, err]
	}
	return [$.goSlice(b, offset, undefined), null]
}

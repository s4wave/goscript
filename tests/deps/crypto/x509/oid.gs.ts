// Generated file based on oid.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes2 from "@goscript/bytes/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"

import * as errors from "@goscript/errors/index.js"

import * as math from "@goscript/math/index.js"

import * as big from "@goscript/math/big/index.js"

import * as bits from "@goscript/math/bits/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"
import "@goscript/bytes/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/errors/index.js"
import "@goscript/math/index.js"
import "@goscript/math/big/index.js"
import "@goscript/math/bits/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"

export class OID {
	public get der(): $.Slice<number> {
		return this._fields.der.value
	}
	public set der(value: $.Slice<number>) {
		this._fields.der.value = value
	}

	public _fields: {
		der: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{der?: $.Slice<number>}>) {
		this._fields = {
			der: $.varRef(init?.der ?? (null! as $.Slice<number>))
		}
	}

	public clone(): OID {
		const cloned = new OID()
		cloned._fields = {
			der: $.varRef(this._fields.der.value)
		}
		return $.markAsStructValue(cloned)
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const o = this
		return [$.appendSlice(b, o.der, $.byteSliceHint), null]
	}

	public async AppendText(b: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const o = this
		return [$.appendSlice(b, $.stringToBytes(await $.markAsStructValue($.cloneStructValue(o)).String()), $.byteSliceHint), null]
	}

	public Equal(other: OID): boolean {
		const oid = this
		// There is only one possible DER encoding of
		// each unique Object Identifier.
		return bytes2.Equal(oid.der, other.der)
	}

	public EqualASN1OID(other: asn1.ObjectIdentifier): boolean {
		const oid = this
		if ($.len((other as asn1.ObjectIdentifier)) < 2) {
			return false
		}
		let [v, offset, failed] = parseBase128Int(oid.der, 0)
		if (failed) {
			// This should never happen, since we've already parsed the OID,
			// but just in case.
			return false
		}
		if (v < 80) {
			let a = Math.trunc(v / 40)
			let b = v % 40
			if (($.arrayIndex(other!, 0) != a) || ($.arrayIndex(other!, 1) != b)) {
				return false
			}
		} else {
			let a = 2
			let b = v - 80
			if (($.arrayIndex(other!, 0) != a) || ($.arrayIndex(other!, 1) != b)) {
				return false
			}
		}

		let i = 2
		for (; offset < $.len(oid.der); i++) {
			let __goscriptTuple0: any = parseBase128Int(oid.der, offset)
			v = __goscriptTuple0[0]
			offset = __goscriptTuple0[1]
			failed = __goscriptTuple0[2]
			if (failed) {
				// Again, shouldn't happen, since we've already parsed
				// the OID, but better safe than sorry.
				return false
			}
			if ((i >= $.len((other as asn1.ObjectIdentifier))) || (v != $.arrayIndex(other!, i))) {
				return false
			}
		}

		return i == $.len((other as asn1.ObjectIdentifier))
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const o = this
		return $.markAsStructValue($.cloneStructValue(o)).AppendBinary(null)
	}

	public async MarshalText(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const o = this
		return $.markAsStructValue($.cloneStructValue(o)).AppendText(null)
	}

	public async String(): globalThis.Promise<string> {
		const oid = this
		let b: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		b.value.Grow(32)
		const valSize: number = 64
		const bitsPerByte: number = 7
		const maxValSafeShift: number = 144115188075855871
		let start: number = 0
		let val: bigint = 0n
		let numBuf: $.Slice<number> = $.makeSlice<number>(0, 21, "byte")
		let bigVal: big.Int | $.VarRef<big.Int> | null = null! as big.Int | $.VarRef<big.Int> | null
		let overflow: boolean = false
		for (let __goscriptRangeTarget0 = oid.der, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
			let v = __goscriptRangeTarget0![i]
			let curVal = $.uint(v & 0x7F, 8)
			let valEnd = $.uint((v & 0x80), 8) == $.uint(0, 8)
			if (valEnd) {
				if (start != 0) {
					b.value.WriteByte($.uint(46, 8))
				}
			}
			if (!overflow && (val > 144115188075855871n)) {
				if (bigVal == null) {
					bigVal = new big.Int()
				}
				bigVal = big.Int.prototype.SetUint64.call(bigVal, val)
				overflow = true
			}
			if (overflow) {
				bigVal = big.Int.prototype.Or.call(big.Int.prototype.Lsh.call(bigVal, bigVal, 7), bigVal, big.NewInt($.int64(curVal)))
				if (valEnd) {
					if (start == 0) {
						b.value.WriteString("2.")
						bigVal = big.Int.prototype.Sub.call(bigVal, bigVal, big.NewInt(80n))
					}
					numBuf = await big.Int.prototype.Append.call(bigVal, numBuf, 10)
					b.value.Write(numBuf)
					numBuf = $.goSlice(numBuf, undefined, 0)
					val = 0n
					start = i + 1
					overflow = false
				}
				continue
			}
			val = $.uint64Shl(val, 7n)
			val = $.uint64Or(val, $.uint64(curVal))
			if (valEnd) {
				if (start == 0) {
					if (val < 80n) {
						b.value.Write(strconv.AppendUint(numBuf, $.uint64Div(val, 40n), 10))
						b.value.WriteByte($.uint(46, 8))
						b.value.Write(strconv.AppendUint(numBuf, $.uint64Mod(val, 40n), 10))
					} else {
						b.value.WriteString("2.")
						b.value.Write(strconv.AppendUint(numBuf, $.uint64Sub(val, 80n), 10))
					}
				} else {
					b.value.Write(strconv.AppendUint(numBuf, val, 10))
				}
				val = 0n
				start = i + 1
			}
		}
		return b.value.String()
	}

	public UnmarshalBinary(b: $.Slice<number>): $.GoError {
		let o: OID | $.VarRef<OID> | null = this
		let [oid, ok] = newOIDFromDER(bytes2.Clone(b))
		if (!ok) {
			return errInvalidOID
		}
		$.assignStruct($.pointerValue<OID>(o), $.markAsStructValue($.cloneStructValue(oid)))
		return null
	}

	public async UnmarshalText(text: $.Slice<number>): globalThis.Promise<$.GoError> {
		const o: OID | $.VarRef<OID> | null = this
		return OID.prototype.unmarshalOIDText.call(o, $.bytesToString(text))
	}

	public toASN1OID(): [asn1.ObjectIdentifier, boolean] {
		const oid = this
		let out: $.Slice<number> = $.makeSlice<number>(0, $.len(oid.der) + 1, "number")

		const valSize: number = 31
		const bitsPerByte: number = 7
		const maxValSafeShift: number = 16777215

		let val = 0

		for (let __goscriptRangeTarget1 = oid.der, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let v = __goscriptRangeTarget1![__rangeIndex]
			if (val > 16777215) {
				return [(null as asn1.ObjectIdentifier), false]
			}

			val = val << (7)
			val = val | ($.int(v & 0x7F))

			if ($.uint((v & 0x80), 8) == $.uint(0, 8)) {
				if ($.len(out) == 0) {
					if (val < 80) {
						out = $.append(out, Math.trunc(val / 40))
						out = $.append(out, val % 40)
					} else {
						out = $.append(out, 2)
						out = $.append(out, val - 80)
					}
					val = 0
					continue
				}
				out = $.append(out, val)
				val = 0
			}
		}

		return [(out as asn1.ObjectIdentifier), true]
	}

	public async unmarshalOIDText(oid: string): globalThis.Promise<$.GoError> {
		let o: OID | $.VarRef<OID> | null = this
		// (*big.Int).SetString allows +/- signs, but we don't want
		// to allow them in the string representation of Object Identifier, so
		// reject such encodings.
		for (const [__rangeIndex, c] of $.rangeString(oid)) {
			let isDigit = ($.int(c, 32) >= $.int(48, 32)) && ($.int(c, 32) <= $.int(57, 32))
			if (!isDigit && ($.int(c, 32) != $.int(46, 32))) {
				return errInvalidOID
			}
		}

		let firstNum: string = ""
		let secondNum: string = ""

		let nextComponentExists: boolean = false
		let __goscriptTuple1: any = strings.Cut(oid, ".")
		firstNum = __goscriptTuple1[0]
		oid = __goscriptTuple1[1]
		nextComponentExists = __goscriptTuple1[2]
		if (!nextComponentExists) {
			return errInvalidOID
		}
		let __goscriptTuple2: any = strings.Cut(oid, ".")
		secondNum = __goscriptTuple2[0]
		oid = __goscriptTuple2[1]
		nextComponentExists = __goscriptTuple2[2]

		let first: big.Int | $.VarRef<big.Int> | null = big.NewInt(0n)
		let second: big.Int | $.VarRef<big.Int> | null = big.NewInt(0n)

		{
			let [, ok] = await big.Int.prototype.SetString.call(first, firstNum, 10)
			if (!ok) {
				return errInvalidOID
			}
		}
		{
			let [, ok] = await big.Int.prototype.SetString.call(second, secondNum, 10)
			if (!ok) {
				return errInvalidOID
			}
		}

		if ((big.Int.prototype.Cmp.call(first, big.NewInt(2n)) > 0) || ((big.Int.prototype.Cmp.call(first, big.NewInt(2n)) < 0) && (big.Int.prototype.Cmp.call(second, big.NewInt(40n)) >= 0))) {
			return errInvalidOID
		}

		let firstComponent: big.Int | $.VarRef<big.Int> | null = await big.Int.prototype.Mul.call(first, first, big.NewInt(40n))
		big.Int.prototype.Add.call(firstComponent, firstComponent, second)

		let der: $.Slice<number> = appendBase128BigInt($.makeSlice<number>(0, 32, "byte"), firstComponent)

		while (nextComponentExists) {
			let strNum: string = ""
			let __goscriptTuple3: any = strings.Cut(oid, ".")
			strNum = __goscriptTuple3[0]
			oid = __goscriptTuple3[1]
			nextComponentExists = __goscriptTuple3[2]
			let __goscriptTuple4: any = await big.Int.prototype.SetString.call(big.NewInt(0n), strNum, 10)
			let b: big.Int | $.VarRef<big.Int> | null = __goscriptTuple4[0]
			let ok = __goscriptTuple4[1]
			if (!ok) {
				return errInvalidOID
			}
			der = appendBase128BigInt(der, b)
		}

		$.pointerValue<OID>(o).der = der
		return null
	}

	static __typeInfo = $.registerStructType(
		"x509.OID",
		() => new OID(),
		[{ name: "AppendBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "AppendText", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Equal", args: [{ name: "other", type: "x509.OID" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "EqualASN1OID", args: [{ name: "other", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalBinary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "MarshalText", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "UnmarshalBinary", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "UnmarshalText", args: [{ name: "text", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "toASN1OID", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, typeName: "asn1.ObjectIdentifier", elemType: { kind: $.TypeKind.Basic, name: "int" } } }, { name: "_r1", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "unmarshalOIDText", args: [{ name: "oid", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "error" }] }],
		OID,
		[{ name: "der", key: "der", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "crypto/x509", index: [0], offset: 0, exported: false }]
	)
}

export let errInvalidOID: $.GoError = errors.New("invalid oid")

export function __goscript_set_errInvalidOID(__goscriptValue: $.GoError): void {
	errInvalidOID = __goscriptValue
}

export async function ParseOID(oid: string): globalThis.Promise<[OID, $.GoError]> {
	let o: $.VarRef<OID> = $.varRef($.markAsStructValue(new OID()))
	return [$.markAsStructValue($.cloneStructValue(o.value)), await o.value.unmarshalOIDText(oid)]
}

export function newOIDFromDER(der: $.Slice<number>): [OID, boolean] {
	if (($.len(der) == 0) || ($.uint(($.arrayIndex(der!, $.len(der) - 1) & 0x80), 8) != $.uint(0, 8))) {
		return [$.markAsStructValue(new OID()), false]
	}

	let start = 0
	for (let __goscriptRangeTarget2 = der, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
		let v = __goscriptRangeTarget2![i]
		// ITU-T X.690, section 8.19.2:
		// The subidentifier shall be encoded in the fewest possible octets,
		// that is, the leading octet of the subidentifier shall not have the value 0x80.
		if ((i == start) && ($.uint(v, 8) == $.uint(0x80, 8))) {
			return [$.markAsStructValue(new OID()), false]
		}
		if ($.uint((v & 0x80), 8) == $.uint(0, 8)) {
			start = i + 1
		}
	}

	return [$.markAsStructValue(new OID({der: der})), true]
}

export function OIDFromInts(oid: $.Slice<bigint>): [OID, $.GoError] {
	if ((($.len(oid) < 2) || ($.arrayIndex(oid!, 0) > 2n)) || (($.arrayIndex(oid!, 0) < 2n) && ($.arrayIndex(oid!, 1) >= 40n))) {
		return [$.markAsStructValue(new OID()), errInvalidOID]
	}

	let length = base128IntLength($.uint64Add(($.uint64Mul($.arrayIndex(oid!, 0), 40n)), $.arrayIndex(oid!, 1)))
	for (let __goscriptRangeTarget3 = $.goSlice(oid, 2, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
		let v = __goscriptRangeTarget3![__rangeIndex]
		length = length + (base128IntLength(v))
	}

	let der: $.Slice<number> = $.makeSlice<number>(0, length, "byte")
	der = appendBase128Int(der, $.uint64Add(($.uint64Mul($.arrayIndex(oid!, 0), 40n)), $.arrayIndex(oid!, 1)))
	for (let __goscriptRangeTarget4 = $.goSlice(oid, 2, undefined), __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let v = __goscriptRangeTarget4![__rangeIndex]
		der = appendBase128Int(der, v)
	}
	return [$.markAsStructValue(new OID({der: der})), null]
}

export function base128IntLength(n: bigint): number {
	if (n == 0n) {
		return 1
	}
	return Math.trunc((bits.Len64(n) + 6) / 7)
}

export function appendBase128Int(dst: $.Slice<number>, n: bigint): $.Slice<number> {
	for (let i = base128IntLength(n) - 1; i >= 0; i--) {
		let o = $.uint($.uint($.uint64Shr(n, $.uint(i * 7, 64)), 8), 8)
		o = o & ($.uint(0x7f, 8))
		if (i != 0) {
			o = o | ($.uint(0x80, 8))
		}
		dst = $.append(dst, $.uint(o, 8), $.byteSliceHint)
	}
	return dst
}

export function base128BigIntLength(n: big.Int | $.VarRef<big.Int> | null): number {
	if (big.Int.prototype.Cmp.call(n, big.NewInt(0n)) == 0) {
		return 1
	}
	return Math.trunc((big.Int.prototype.BitLen.call(n) + 6) / 7)
}

export function appendBase128BigInt(dst: $.Slice<number>, n: big.Int | $.VarRef<big.Int> | null): $.Slice<number> {
	if (big.Int.prototype.Cmp.call(n, big.NewInt(0n)) == 0) {
		return $.append(dst, $.uint(0, 8), $.byteSliceHint)
	}

	for (let i = base128BigIntLength(n) - 1; i >= 0; i--) {
		let o = $.uint($.uint($.arrayIndex(big.Int.prototype.Bits.call(big.Int.prototype.Rsh.call(big.NewInt(0n), n, $.uint($.uint64Mul($.uint(i, 64), 7n), 64)))!, 0), 8), 8)
		o = o & ($.uint(0x7f, 8))
		if (i != 0) {
			o = o | ($.uint(0x80, 8))
		}
		dst = $.append(dst, $.uint(o, 8), $.byteSliceHint)
	}
	return dst
}

export function parseBase128Int(bytes: $.Slice<number>, initOffset: number): [number, number, boolean] {
	let ret: number = 0
	let offset: number = 0
	let failed: boolean = false
	offset = initOffset
	let ret64: bigint = 0n
	for (let shifted = 0; offset < $.len(bytes); shifted++) {
		// 5 * 7 bits per byte == 35 bits of data
		// Thus the representation is either non-minimal or too large for an int32
		if (shifted == 5) {
			failed = true
			return [ret, offset, failed]
		}
		ret64 = $.int64Shl(ret64, 7n)
		let b = $.uint($.arrayIndex(bytes!, offset), 8)
		// integers should be minimally encoded, so the leading octet should
		// never be 0x80
		if ((shifted == 0) && ($.uint(b, 8) == $.uint(0x80, 8))) {
			failed = true
			return [ret, offset, failed]
		}
		ret64 = $.int64Or(ret64, $.int64(b & 0x7f))
		offset++
		if ($.uint((b & 0x80), 8) == $.uint(0, 8)) {
			ret = $.int(ret64)
			// Ensure that the returned value fits in an int on all platforms
			if (ret64 > 2147483647n) {
				failed = true
			}
			return [ret, offset, failed]
		}
	}
	failed = true
	return [ret, offset, failed]
}

export function OIDFromASN1OID(asn1OID: asn1.ObjectIdentifier): [OID, $.GoError] {
	let uint64OID: $.Slice<bigint> = $.makeSlice<bigint>(0, $.len((asn1OID as asn1.ObjectIdentifier)), "number")
	for (let __goscriptRangeTarget5 = asn1OID, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
		let component = __goscriptRangeTarget5![__rangeIndex]
		if (component < 0) {
			return [$.markAsStructValue(new OID()), errors.New("x509: OID components must be non-negative")]
		}
		uint64OID = $.append(uint64OID, $.uint64(component))
	}
	return OIDFromInts(uint64OID)
}

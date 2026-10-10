// Generated file based on netip.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as cmp from "@goscript/cmp/index.js"

import * as errors from "@goscript/errors/index.js"

import * as bytealg from "@goscript/internal/bytealg/index.js"

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as math from "@goscript/math/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as _unique from "@goscript/unique/index.js"

import * as __goscript_uint128 from "./uint128.gs.ts"
import "@goscript/cmp/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/bytealg/index.js"
import "@goscript/internal/byteorder/index.js"
import "@goscript/math/index.js"
import "@goscript/strconv/index.js"
import "@goscript/unique/index.js"
import "./uint128.gs.ts"

export class Addr {
	// addr is the hi and lo bits of an IPv6 address. If z==z4,
	// hi and lo contain the IPv4-mapped IPv6 address.
	//
	// hi and lo are constructed by interpreting a 16-byte IPv6
	// address as a big-endian 128-bit number. The most significant
	// bits of that number go into hi, the rest into lo.
	//
	// For example, 0011:2233:4455:6677:8899:aabb:ccdd:eeff is stored as:
	//  addr.hi = 0x0011223344556677
	//  addr.lo = 0x8899aabbccddeeff
	//
	// We store IPs like this, rather than as [16]byte, because it
	// turns most operations on IPs into arithmetic and bit-twiddling
	// operations on 64-bit registers, which is much faster than
	// bytewise processing.
	public declare addr: __goscript_uint128.uint128

	// Details about the address, wrapped up together and canonicalized.
	public declare z: _unique.Handle<addrDetail>

	public _fields: {
		addr: __goscript_uint128.uint128
		z: _unique.Handle<addrDetail>
	}

	constructor(init?: Partial<{addr?: __goscript_uint128.uint128, z?: _unique.Handle<addrDetail>}>) {
		this._fields = {
			addr: init?.addr ? $.markAsStructValue($.cloneStructValue(init.addr)) : $.markAsStructValue(new __goscript_uint128.uint128()),
			z: init?.z ? $.markAsStructValue($.cloneStructValue(init.z)) : $.markAsStructValue(new _unique.Handle<addrDetail>())
		}
	}

	public clone(): Addr {
		return $.markAsStructValue(new Addr(this))
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const ip = this;
		switch (ip.z) {
			case z0:
			{
				break
			}
			case z4:
			{
				b = byteorder.BEAppendUint32(b, $.uint($.uint(ip.addr.lo, 32), 32))
				break
			}
			default:
			{
				b = byteorder.BEAppendUint64(b, ip.addr.hi)
				b = byteorder.BEAppendUint64(b, ip.addr.lo)
				b = $.appendSlice(b, $.stringToBytes($.markAsStructValue($.cloneStructValue(ip)).Zone()), $.byteSliceHint)
				break
			}
		}
		return [b, null]
	}

	public AppendText(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const ip = this;
		return [$.markAsStructValue($.cloneStructValue(ip)).AppendTo(b), null]
	}

	public AppendTo(b: $.Slice<number>): $.Slice<number> {
		const ip = this;
		switch (ip.z) {
			case z0:
			{
				return b
				break
			}
			case z4:
			{
				return $.markAsStructValue($.cloneStructValue(ip)).appendTo4(b)
				break
			}
			default:
			{
				if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
					return $.markAsStructValue($.cloneStructValue(ip)).appendTo4In6(b)
				}
				return $.markAsStructValue($.cloneStructValue(ip)).appendTo6(b)
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public As16(): Uint8Array {
		const ip = this;
		let a16: Uint8Array = $.arrayValue(new Uint8Array(16))
		byteorder.BEPutUint64($.goSlice(a16, undefined, 8), ip.addr.hi)
		byteorder.BEPutUint64($.goSlice(a16, 8, undefined), ip.addr.lo)
		return $.cloneArrayValue(a16, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 16))
	}

	public As4(): Uint8Array {
		const ip = this;
		let a4: Uint8Array = $.arrayValue(new Uint8Array(4))
		if (($.comparableEqual(ip.z, z4)) || $.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			byteorder.BEPutUint32($.goSlice(a4, undefined, undefined), $.uint($.uint(ip.addr.lo, 32), 32))
			return $.cloneArrayValue(a4, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4))
		}
		if ($.comparableEqual(ip.z, z0)) {
			$.panic("As4 called on IP zero value")
		}
		$.panic("As4 called on IPv6 address")
		throw new globalThis.Error("goscript: unreachable return")
	}

	public AsSlice(): $.Slice<number> {
		const ip = this;
		switch (ip.z) {
			case z0:
			{
				return null
				break
			}
			case z4:
			{
				let ret: Uint8Array = $.arrayValue(new Uint8Array(4))
				byteorder.BEPutUint32($.goSlice(ret, undefined, undefined), $.uint($.uint(ip.addr.lo, 32), 32))
				return $.goSlice(ret, undefined, undefined)
				break
			}
			default:
			{
				let ret: Uint8Array = $.arrayValue(new Uint8Array(16))
				byteorder.BEPutUint64($.goSlice(ret, undefined, 8), ip.addr.hi)
				byteorder.BEPutUint64($.goSlice(ret, 8, undefined), ip.addr.lo)
				return $.goSlice(ret, undefined, undefined)
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public BitLen(): number {
		const ip = this;
		switch (ip.z) {
			case z0:
			{
				return 0
				break
			}
			case z4:
			{
				return 32
				break
			}
		}
		return 128
	}

	public Compare(ip2: Addr): number {
		const ip = this;
		let f1 = $.markAsStructValue($.cloneStructValue(ip)).BitLen()
		let f2 = $.markAsStructValue($.cloneStructValue(ip2)).BitLen()
		if (f1 < f2) {
			return -1
		}
		if (f1 > f2) {
			return 1
		}
		let hi1 = ip.addr.hi
		let hi2 = ip2.addr.hi
		if (hi1 < hi2) {
			return -1
		}
		if (hi1 > hi2) {
			return 1
		}
		let lo1 = ip.addr.lo
		let lo2 = ip2.addr.lo
		if (lo1 < lo2) {
			return -1
		}
		if (lo1 > lo2) {
			return 1
		}
		if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			let za = $.markAsStructValue($.cloneStructValue(ip)).Zone()
			let zb = $.markAsStructValue($.cloneStructValue(ip2)).Zone()
			if ($.stringCompare(za, zb) < 0) {
				return -1
			}
			if ($.stringCompare(za, zb) > 0) {
				return 1
			}
		}
		return 0
	}

	public Is4(): boolean {
		const ip = this;
		return $.comparableEqual(ip.z, z4)
	}

	public Is4In6(): boolean {
		const ip = this;
		return ($.markAsStructValue($.cloneStructValue(ip)).Is6() && (ip.addr.hi == 0n)) && (($.uint64Shr(ip.addr.lo, 32n)) == 65535n)
	}

	public Is6(): boolean {
		const ip = this;
		return (!$.comparableEqual(ip.z, z0)) && (!$.comparableEqual(ip.z, z4))
	}

	public IsGlobalUnicast(): boolean {
		let ip: Addr = this;
		if ($.comparableEqual(ip.z, z0)) {
			// Invalid or zero-value.
			return false
		}

		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			$.assignStruct(ip, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap())))
		}

		// Match package net's IsGlobalUnicast logic. Notably private IPv4 addresses
		// and ULA IPv6 addresses are still considered "global unicast".
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4() && (($.comparableEqual(ip, IPv4Unspecified())) || ($.comparableEqual(ip, AddrFrom4($.arrayValue(new Uint8Array([255, 255, 255, 255]))))))) {
			return false
		}

		return (((!$.comparableEqual(ip, IPv6Unspecified())) && !$.markAsStructValue($.cloneStructValue(ip)).IsLoopback()) && !$.markAsStructValue($.cloneStructValue(ip)).IsMulticast()) && !$.markAsStructValue($.cloneStructValue(ip)).IsLinkLocalUnicast()
	}

	public IsInterfaceLocalMulticast(): boolean {
		const ip = this;
		// IPv6 Addressing Architecture (2.7.1. Pre-Defined Multicast Addresses)
		// https://datatracker.ietf.org/doc/html/rfc4291#section-2.7.1
		if ($.markAsStructValue($.cloneStructValue(ip)).Is6() && !$.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			return $.uint(($.markAsStructValue($.cloneStructValue(ip)).v6u16(0) & 0xff0f), 16) == 0xff01
		}
		return false
	}

	public IsLinkLocalMulticast(): boolean {
		let ip: Addr = this;
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			$.assignStruct(ip, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap())))
		}

		// IPv4 Multicast Guidelines (4. Local Network Control Block (224.0.0/24))
		// https://datatracker.ietf.org/doc/html/rfc5771#section-4
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			return (($.uint($.markAsStructValue($.cloneStructValue(ip)).v4(0), 8) == 224) && ($.uint($.markAsStructValue($.cloneStructValue(ip)).v4(1), 8) == 0)) && ($.uint($.markAsStructValue($.cloneStructValue(ip)).v4(2), 8) == 0)
		}
		// IPv6 Addressing Architecture (2.7.1. Pre-Defined Multicast Addresses)
		// https://datatracker.ietf.org/doc/html/rfc4291#section-2.7.1
		if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			return $.uint(($.markAsStructValue($.cloneStructValue(ip)).v6u16(0) & 0xff0f), 16) == 0xff02
		}
		return false
	}

	public IsLinkLocalUnicast(): boolean {
		let ip: Addr = this;
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			$.assignStruct(ip, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap())))
		}

		// Dynamic Configuration of IPv4 Link-Local Addresses
		// https://datatracker.ietf.org/doc/html/rfc3927#section-2.1
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			return ($.uint($.markAsStructValue($.cloneStructValue(ip)).v4(0), 8) == 169) && ($.uint($.markAsStructValue($.cloneStructValue(ip)).v4(1), 8) == 254)
		}
		// IP Version 6 Addressing Architecture (2.4 Address Type Identification)
		// https://datatracker.ietf.org/doc/html/rfc4291#section-2.4
		if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			return $.uint(($.markAsStructValue($.cloneStructValue(ip)).v6u16(0) & 0xffc0), 16) == 0xfe80
		}
		return false
	}

	public IsLoopback(): boolean {
		let ip: Addr = this;
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			$.assignStruct(ip, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap())))
		}

		// Requirements for Internet Hosts -- Communication Layers (3.2.1.3 Addressing)
		// https://datatracker.ietf.org/doc/html/rfc1122#section-3.2.1.3
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			return $.uint($.markAsStructValue($.cloneStructValue(ip)).v4(0), 8) == 127
		}
		// IP Version 6 Addressing Architecture (2.4 Address Type Identification)
		// https://datatracker.ietf.org/doc/html/rfc4291#section-2.4
		if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			return (ip.addr.hi == 0n) && (ip.addr.lo == 1n)
		}
		return false
	}

	public IsMulticast(): boolean {
		let ip: Addr = this;
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			$.assignStruct(ip, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap())))
		}

		// Host Extensions for IP Multicasting (4. HOST GROUP ADDRESSES)
		// https://datatracker.ietf.org/doc/html/rfc1112#section-4
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			return $.uint(($.markAsStructValue($.cloneStructValue(ip)).v4(0) & 0xf0), 8) == 0xe0
		}
		// IP Version 6 Addressing Architecture (2.4 Address Type Identification)
		// https://datatracker.ietf.org/doc/html/rfc4291#section-2.4
		if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			return ($.uint64Shr(ip.addr.hi, 56n)) == 255n
		}
		return false
	}

	public IsPrivate(): boolean {
		let ip: Addr = this;
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			$.assignStruct(ip, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap())))
		}

		// Match the stdlib's IsPrivate logic.
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			// RFC 1918 allocates 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 as
			// private IPv4 address subnets.
			return (($.uint($.markAsStructValue($.cloneStructValue(ip)).v4(0), 8) == 10) || (($.uint($.markAsStructValue($.cloneStructValue(ip)).v4(0), 8) == 172) && ($.uint(($.markAsStructValue($.cloneStructValue(ip)).v4(1) & 0xf0), 8) == 16))) || (($.uint($.markAsStructValue($.cloneStructValue(ip)).v4(0), 8) == 192) && ($.uint($.markAsStructValue($.cloneStructValue(ip)).v4(1), 8) == 168))
		}

		if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			// RFC 4193 allocates fc00::/7 as the unique local unicast IPv6 address
			// subnet.
			return $.uint(($.markAsStructValue($.cloneStructValue(ip)).v6(0) & 0xfe), 8) == 0xfc
		}

		return false
	}

	public IsUnspecified(): boolean {
		const ip = this;
		return ($.comparableEqual(ip, IPv4Unspecified())) || ($.comparableEqual(ip, IPv6Unspecified()))
	}

	public IsValid(): boolean {
		const ip = this;
		return !$.comparableEqual(ip.z, z0)
	}

	public Less(ip2: Addr): boolean {
		const ip = this;
		return $.markAsStructValue($.cloneStructValue(ip)).Compare($.markAsStructValue($.cloneStructValue(ip2))) == -1
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const ip = this;
		return $.markAsStructValue($.cloneStructValue(ip)).AppendBinary($.makeSlice<number>(0, $.markAsStructValue($.cloneStructValue(ip)).marshalBinarySize(), "byte"))
	}

	public MarshalText(): [$.Slice<number>, $.GoError] {
		const ip = this;
		let buf: $.Slice<number> = new Uint8Array([]) as $.Slice<number>
		switch (ip.z) {
			case z0:
			{
				break
			}
			case z4:
			{
				const maxCap: number = 15
				buf = $.makeSlice<number>(0, 15, "byte")
				break
			}
			default:
			{
				if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
					const maxCap: number = 29
					buf = $.makeSlice<number>(0, 29, "byte")
					break
				}
				const maxCap: number = 46
				buf = $.makeSlice<number>(0, 46, "byte")
				break
			}
		}
		return $.markAsStructValue($.cloneStructValue(ip)).AppendText(buf)
	}

	public Next(): Addr {
		let ip: Addr = this;
		$.assignStruct(ip.addr, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip.addr)).addOne())))
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			if ($.uint($.uint(ip.addr.lo, 32), 32) == 0) {
				// Overflowed.
				return $.markAsStructValue(new Addr())
			}
		} else {
			if ($.markAsStructValue($.cloneStructValue(ip.addr)).isZero()) {
				// Overflowed
				return $.markAsStructValue(new Addr())
			}
		}
		return $.markAsStructValue($.cloneStructValue(ip))
	}

	public Prefix(b: number): [Prefix, $.GoError] {
		let ip: Addr = this;
		if (b < 0) {
			return [$.markAsStructValue(new Prefix()), errors.New("negative Prefix bits")]
		}
		let effectiveBits = b
		switch (ip.z) {
			case z0:
			{
				return [$.markAsStructValue(new Prefix()), null]
				break
			}
			case z4:
			{
				if (b > 32) {
					return [$.markAsStructValue(new Prefix()), errors.New(("prefix length " + strconv.Itoa(b)) + " too large for IPv4")]
				}
				effectiveBits = effectiveBits + (96)
				break
			}
			default:
			{
				if (b > 128) {
					return [$.markAsStructValue(new Prefix()), errors.New(("prefix length " + strconv.Itoa(b)) + " too large for IPv6")]
				}
				break
			}
		}
		$.assignStruct(ip.addr, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip.addr)).and($.markAsStructValue($.cloneStructValue(__goscript_uint128.mask6(effectiveBits)))))))
		return [$.markAsStructValue($.cloneStructValue(PrefixFrom($.markAsStructValue($.cloneStructValue(ip)), b))), null]
	}

	public Prev(): Addr {
		let ip: Addr = this;
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			if ($.uint($.uint(ip.addr.lo, 32), 32) == 0) {
				return $.markAsStructValue(new Addr())
			}
		} else {
			if ($.markAsStructValue($.cloneStructValue(ip.addr)).isZero()) {
				return $.markAsStructValue(new Addr())
			}
		}
		$.assignStruct(ip.addr, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip.addr)).subOne())))
		return $.markAsStructValue($.cloneStructValue(ip))
	}

	public String(): string {
		const ip = this;
		if (!$.markAsStructValue($.cloneStructValue(ip)).IsValid()) {
			return "invalid IP"
		}
		let b: $.Slice<number> = null! as $.Slice<number>
		switch ((true as boolean)) {
			case $.comparableEqual(ip.z, z4):
			{
				const max: number = 15
				b = $.makeSlice<number>(0, 15, "byte")
				b = $.markAsStructValue($.cloneStructValue(ip)).appendTo4(b)
				break
			}
			case $.markAsStructValue($.cloneStructValue(ip)).Is4In6():
			{
				const max: number = 29
				b = $.makeSlice<number>(0, 29, "byte")
				b = $.markAsStructValue($.cloneStructValue(ip)).appendTo4In6(b)
				break
			}
			default:
			{
				const max: number = 46
				b = $.makeSlice<number>(0, 46, "byte")
				b = $.markAsStructValue($.cloneStructValue(ip)).appendTo6(b)
				break
			}
		}
		return $.bytesToString(b)
	}

	public StringExpanded(): string {
		const ip = this;
		switch (ip.z) {
			case z0:
			case z4:
			{
				return $.markAsStructValue($.cloneStructValue(ip)).String()
				break
			}
		}

		const size: number = 39
		let ret: $.Slice<number> = $.makeSlice<number>(0, 39, "byte")
		for (let i = 0; $.uint(i, 8) < 8; i++) {
			if ($.uint(i, 8) > 0) {
				ret = $.append(ret, $.uint(58, 8), $.byteSliceHint)
			}

			ret = appendHexPad(ret, $.uint($.markAsStructValue($.cloneStructValue(ip)).v6u16($.uint(i, 8)), 16))
		}

		if (!$.comparableEqual(ip.z, z6noz)) {
			// The addition of a zone will cause a second allocation, but when there
			// is no zone the ret slice will be stack allocated.
			ret = $.append(ret, $.uint(37, 8), $.byteSliceHint)
			ret = $.appendSlice(ret, $.stringToBytes($.markAsStructValue($.cloneStructValue(ip)).Zone()), $.byteSliceHint)
		}
		return $.bytesToString(ret)
	}

	public Unmap(): Addr {
		let ip: Addr = this;
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4In6()) {
			$.assignStruct(ip.z, $.markAsStructValue($.cloneStructValue(z4)))
		}
		return $.markAsStructValue($.cloneStructValue(ip))
	}

	public UnmarshalBinary(b: $.Slice<number>): $.GoError {
		let ip: Addr | $.VarRef<Addr> | null = this;
		let n = $.len(b)
		switch ((true as boolean)) {
			case n == 0:
			{
				$.assignStruct($.pointerValue<Addr>(ip), $.markAsStructValue(new Addr()))
				return null
				break
			}
			case n == 4:
			{
				$.assignStruct($.pointerValue<Addr>(ip), $.markAsStructValue($.cloneStructValue(AddrFrom4($.cloneArrayValue(($.sliceToArray<number>(b, 4, "byte") as Uint8Array), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4))))))
				return null
				break
			}
			case n == 16:
			{
				$.assignStruct($.pointerValue<Addr>(ip), $.markAsStructValue($.cloneStructValue(AddrFrom16($.cloneArrayValue(($.sliceToArray<number>(b, 16, "byte") as Uint8Array), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 16))))))
				return null
				break
			}
			case n > 16:
			{
				$.assignStruct($.pointerValue<Addr>(ip), $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(AddrFrom16($.cloneArrayValue(($.sliceToArray<number>($.goSlice(b, undefined, 16), 16, "byte") as Uint8Array), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 16))))).WithZone($.bytesToString($.goSlice(b, 16, undefined))))))
				return null
				break
			}
		}
		return errors.New("unexpected slice size")
	}

	public UnmarshalText(text: $.Slice<number>): $.GoError {
		let ip: Addr | $.VarRef<Addr> | null = this;
		if ($.len(text) == 0) {
			$.assignStruct($.pointerValue<Addr>(ip), $.markAsStructValue(new Addr()))
			return null
		}
		let err: $.GoError = null! as $.GoError
		let __goscriptTuple0: any = ParseAddr($.bytesToString(text))
		$.assignStruct($.pointerValue<Addr>(ip), __goscriptTuple0[0])
		err = __goscriptTuple0[1]
		return err
	}

	public WithZone(zone: string): Addr {
		let ip: Addr = this;
		if (!$.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			return $.markAsStructValue($.cloneStructValue(ip))
		}
		if ($.stringEqual(zone, "")) {
			$.assignStruct(ip.z, $.markAsStructValue($.cloneStructValue(z6noz)))
			return $.markAsStructValue($.cloneStructValue(ip))
		}
		$.assignStruct(ip.z, ($.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new addrDetail({isV6: true, zoneV6: zone}))))) as _unique.Handle<addrDetail>))
		return $.markAsStructValue($.cloneStructValue(ip))
	}

	public Zone(): string {
		const ip = this;
		if ($.comparableEqual(ip.z, z0)) {
			return ""
		}
		return $.markAsStructValue($.cloneStructValue(ip.z)).Value().zoneV6
	}

	public appendTo4(ret: $.Slice<number>): $.Slice<number> {
		const ip = this;
		ret = appendDecimal(ret, $.uint($.markAsStructValue($.cloneStructValue(ip)).v4(0), 8))
		ret = $.append(ret, $.uint(46, 8), $.byteSliceHint)
		ret = appendDecimal(ret, $.uint($.markAsStructValue($.cloneStructValue(ip)).v4(1), 8))
		ret = $.append(ret, $.uint(46, 8), $.byteSliceHint)
		ret = appendDecimal(ret, $.uint($.markAsStructValue($.cloneStructValue(ip)).v4(2), 8))
		ret = $.append(ret, $.uint(46, 8), $.byteSliceHint)
		ret = appendDecimal(ret, $.uint($.markAsStructValue($.cloneStructValue(ip)).v4(3), 8))
		return ret
	}

	public appendTo4In6(ret: $.Slice<number>): $.Slice<number> {
		const ip = this;
		ret = $.appendSlice(ret, $.stringToBytes("::ffff:"), $.byteSliceHint)
		ret = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).Unmap())).appendTo4(ret)
		if (!$.comparableEqual(ip.z, z6noz)) {
			ret = $.append(ret, $.uint(37, 8), $.byteSliceHint)
			ret = $.appendSlice(ret, $.stringToBytes($.markAsStructValue($.cloneStructValue(ip)).Zone()), $.byteSliceHint)
		}
		return ret
	}

	public appendTo6(ret: $.Slice<number>): $.Slice<number> {
		const ip = this;
		let zeroStart = 255
		let zeroEnd = 255
		for (let i = 0; $.uint(i, 8) < 8; i++) {
			let j = $.uint(i, 8)
			while (($.uint(j, 8) < 8) && ($.uint($.markAsStructValue($.cloneStructValue(ip)).v6u16($.uint(j, 8)), 16) == 0)) {
				j++
			}
			{
				let l = $.uint(j - i, 8)
				if (($.uint(l, 8) >= 2) && ($.uint(l, 8) > $.uint((zeroEnd - zeroStart), 8))) {
					let __goscriptAssign0_0: number = $.uint(i, 8)
					let __goscriptAssign0_1: number = $.uint(j, 8)
					zeroStart = __goscriptAssign0_0
					zeroEnd = __goscriptAssign0_1
				}
			}
		}

		for (let i = 0; $.uint(i, 8) < 8; i++) {
			if ($.uint(i, 8) == $.uint(zeroStart, 8)) {
				ret = $.append(ret, $.uint(58, 8), $.uint(58, 8), $.byteSliceHint)
				i = $.uint(zeroEnd, 8)
				if ($.uint(i, 8) >= 8) {
					break
				}
			} else {
				if ($.uint(i, 8) > 0) {
					ret = $.append(ret, $.uint(58, 8), $.byteSliceHint)
				}
			}

			ret = appendHex(ret, $.uint($.markAsStructValue($.cloneStructValue(ip)).v6u16($.uint(i, 8)), 16))
		}

		if (!$.comparableEqual(ip.z, z6noz)) {
			ret = $.append(ret, $.uint(37, 8), $.byteSliceHint)
			ret = $.appendSlice(ret, $.stringToBytes($.markAsStructValue($.cloneStructValue(ip)).Zone()), $.byteSliceHint)
		}
		return ret
	}

	public hasZone(): boolean {
		const ip = this;
		return ((!$.comparableEqual(ip.z, z0)) && (!$.comparableEqual(ip.z, z4))) && (!$.comparableEqual(ip.z, z6noz))
	}

	public isZero(): boolean {
		const ip = this;
		// Faster than comparing ip == Addr{}, but effectively equivalent,
		// as there's no way to make an IP with a nil z from this package.
		return $.comparableEqual(ip.z, z0)
	}

	public marshalBinarySize(): number {
		const ip = this;
		switch (ip.z) {
			case z0:
			{
				return 0
				break
			}
			case z4:
			{
				return 4
				break
			}
			default:
			{
				return 16 + $.len($.markAsStructValue($.cloneStructValue(ip)).Zone())
				break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public v4(i: number): number {
		const ip = this;
		return $.uint($.uint($.uint64Shr(ip.addr.lo, ((3 - i) * 8)), 8), 8)
	}

	public v6(i: number): number {
		const ip = this;
		return $.uint($.uint($.uint64Shr($.pointerValue<bigint>(($.arrayIndex(ip.addr.halves(), (Math.trunc(i / 8)) % 2))), ((7 - (i % 8)) * 8)), 8), 8)
	}

	public v6u16(i: number): number {
		const ip = this;
		return $.uint($.uint($.uint64Shr($.pointerValue<bigint>(($.arrayIndex(ip.addr.halves(), (Math.trunc(i / 4)) % 2))), ((3 - (i % 4)) * 16)), 16), 16)
	}

	public withoutZone(): Addr {
		let ip: Addr = this;
		if (!$.markAsStructValue($.cloneStructValue(ip)).Is6()) {
			return $.markAsStructValue($.cloneStructValue(ip))
		}
		$.assignStruct(ip.z, $.markAsStructValue($.cloneStructValue(z6noz)))
		return $.markAsStructValue($.cloneStructValue(ip))
	}

	static {
		$.bindStructFields(this.prototype, ["addr", "z"])
	}

	static __typeInfo = $.registerStructType(
		"netip.Addr",
		() => new Addr(),
		() => [{ name: "AppendBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "AppendText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "AppendTo", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }] }, { name: "As16", args: [], returns: [{ type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 16) }] }, { name: "As4", args: [], returns: [{ type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4) }] }, { name: "AsSlice", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }] }, { name: "BitLen", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Compare", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Is4", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Is4In6", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Is6", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "IsGlobalUnicast", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "IsInterfaceLocalMulticast", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "IsLinkLocalMulticast", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "IsLinkLocalUnicast", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "IsLoopback", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "IsMulticast", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "IsPrivate", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "IsUnspecified", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "IsValid", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Less", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "MarshalBinary", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "MarshalText", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "Next", args: [], returns: [{ type: "netip.Addr" }] }, { name: "Prefix", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "netip.Prefix" }, { type: "error" }] }, { name: "Prev", args: [], returns: [{ type: "netip.Addr" }] }, { name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "StringExpanded", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "Unmap", args: [], returns: [{ type: "netip.Addr" }] }, { name: "UnmarshalBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "UnmarshalText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "WithZone", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "netip.Addr" }] }, { name: "Zone", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "appendTo4", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }] }, { name: "appendTo4In6", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }] }, { name: "appendTo6", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }] }, { name: "hasZone", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "isZero", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "marshalBinarySize", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "v4", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("uint8") }] }, { name: "v6", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("uint8") }] }, { name: "v6u16", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("uint16") }] }, { name: "withoutZone", args: [], returns: [{ type: "netip.Addr" }] }],
		Addr,
		() => [{ name: "addr", key: "addr", type: "netip.uint128" }, { name: "z", key: "z", type: "unique.Handle" }]
	)
}

export class addrDetail {
	public declare isV6: boolean

	public declare zoneV6: string

	public _fields: {
		isV6: boolean
		zoneV6: string
	}

	constructor(init?: Partial<{isV6?: boolean, zoneV6?: string}>) {
		this._fields = {
			isV6: init?.isV6 ?? (false as boolean),
			zoneV6: init?.zoneV6 ?? ("" as string)
		}
	}

	public clone(): addrDetail {
		return $.markAsStructValue(new addrDetail(this))
	}

	static {
		$.bindStructFields(this.prototype, ["isV6", "zoneV6"])
	}

	static __typeInfo = $.registerStructType(
		"netip.addrDetail",
		() => new addrDetail(),
		() => [],
		addrDetail,
		() => [{ name: "isV6", key: "isV6", type: /* @__PURE__ */ $.basicType("bool") }, { name: "zoneV6", key: "zoneV6", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class parseAddrError {
	public declare _in: string

	public declare msg: string

	public declare at: string

	public _fields: {
		_in: string
		msg: string
		at: string
	}

	constructor(init?: Partial<{_in?: string, msg?: string, at?: string}>) {
		this._fields = {
			_in: init?._in ?? ("" as string),
			msg: init?.msg ?? ("" as string),
			at: init?.at ?? ("" as string)
		}
	}

	public clone(): parseAddrError {
		return $.markAsStructValue(new parseAddrError(this))
	}

	public async Error(): globalThis.Promise<string> {
		const err = this;
		let q: ((s: string) => string | globalThis.Promise<string>) | null = strconv.Quote
		if (!$.stringEqual(err.at, "")) {
			return ((((("ParseAddr(" + await q!(err._in)) + "): ") + err.msg) + " (at ") + await q!(err.at)) + ")"
		}
		return (("ParseAddr(" + await q!(err._in)) + "): ") + err.msg
	}

	static {
		$.bindStructFields(this.prototype, ["_in", "msg", "at"])
	}

	static __typeInfo = $.registerStructType(
		"netip.parseAddrError",
		() => new parseAddrError(),
		() => [{ name: "Error", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		parseAddrError,
		() => [{ name: "in", key: "_in", type: /* @__PURE__ */ $.basicType("string") }, { name: "msg", key: "msg", type: /* @__PURE__ */ $.basicType("string") }, { name: "at", key: "at", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class AddrPort {
	public declare ip: Addr

	public declare port: number

	public _fields: {
		ip: Addr
		port: number
	}

	constructor(init?: Partial<{ip?: Addr, port?: number}>) {
		this._fields = {
			ip: init?.ip ? $.markAsStructValue($.cloneStructValue(init.ip)) : $.markAsStructValue(new Addr()),
			port: init?.port ?? (0 as number)
		}
	}

	public clone(): AddrPort {
		return $.markAsStructValue(new AddrPort(this))
	}

	public Addr(): Addr {
		const p = this;
		return $.markAsStructValue($.cloneStructValue(p.ip))
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const p = this;
		let __goscriptTuple1: any = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Addr())).AppendBinary(b)
		b = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			return [null, err]
		}
		return [byteorder.LEAppendUint16(b, $.uint($.markAsStructValue($.cloneStructValue(p)).Port(), 16)), null]
	}

	public AppendText(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const p = this;
		return [$.markAsStructValue($.cloneStructValue(p)).AppendTo(b), null]
	}

	public AppendTo(b: $.Slice<number>): $.Slice<number> {
		const p = this;
		switch (p.ip.z) {
			case z0:
			{
				return b
				break
			}
			case z4:
			{
				b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo4(b)
				break
			}
			default:
			{
				b = $.append(b, $.uint(91, 8), $.byteSliceHint)
				if ($.markAsStructValue($.cloneStructValue(p.ip)).Is4In6()) {
					b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo4In6(b)
				} else {
					b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo6(b)
				}
				b = $.append(b, $.uint(93, 8), $.byteSliceHint)
				break
			}
		}
		b = $.append(b, $.uint(58, 8), $.byteSliceHint)
		b = strconv.AppendUint(b, $.uint64(p.port), 10)
		return b
	}

	public Compare(p2: AddrPort): number {
		const p = this;
		{
			let c = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Addr())).Compare($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p2)).Addr())))
			if (c != 0) {
				return c
			}
		}
		return cmp.Compare($.uint($.markAsStructValue($.cloneStructValue(p)).Port(), 16), $.uint($.markAsStructValue($.cloneStructValue(p2)).Port(), 16))
	}

	public IsValid(): boolean {
		const p = this;
		return $.markAsStructValue($.cloneStructValue(p.ip)).IsValid()
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const p = this;
		return $.markAsStructValue($.cloneStructValue(p)).AppendBinary($.makeSlice<number>(0, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Addr())).marshalBinarySize() + 2, "byte"))
	}

	public MarshalText(): [$.Slice<number>, $.GoError] {
		const p = this;
		let buf: $.Slice<number> = new Uint8Array([]) as $.Slice<number>
		switch (p.ip.z) {
			case z0:
			{
				break
			}
			case z4:
			{
				const maxCap: number = 21
				buf = $.makeSlice<number>(0, 21, "byte")
				break
			}
			default:
			{
				const maxCap: number = 54
				buf = $.makeSlice<number>(0, 54, "byte")
				break
			}
		}
		return $.markAsStructValue($.cloneStructValue(p)).AppendText(buf)
	}

	public Port(): number {
		const p = this;
		return $.uint(p.port, 16)
	}

	public String(): string {
		const p = this;
		let b: $.Slice<number> = null! as $.Slice<number>
		switch (p.ip.z) {
			case z0:
			{
				return "invalid AddrPort"
				break
			}
			case z4:
			{
				const max: number = 21
				b = $.makeSlice<number>(0, 21, "byte")
				b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo4(b)
				break
			}
			default:
			{
				if ($.markAsStructValue($.cloneStructValue(p.ip)).Is4In6()) {
					const max: number = 37
					b = $.makeSlice<number>(0, 37, "byte")
					b = $.append(b, $.uint(91, 8), $.byteSliceHint)
					b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo4In6(b)
				} else {
					const max: number = 54
					b = $.makeSlice<number>(0, 54, "byte")
					b = $.append(b, $.uint(91, 8), $.byteSliceHint)
					b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo6(b)
				}
				b = $.append(b, $.uint(93, 8), $.byteSliceHint)
				break
			}
		}
		b = $.append(b, $.uint(58, 8), $.byteSliceHint)
		b = strconv.AppendUint(b, $.uint64(p.port), 10)
		return $.bytesToString(b)
	}

	public UnmarshalBinary(b: $.Slice<number>): $.GoError {
		let p: AddrPort | $.VarRef<AddrPort> | null = this;
		if ($.len(b) < 2) {
			return errors.New("unexpected slice size")
		}
		let addr: $.VarRef<Addr> = $.varRef($.markAsStructValue(new Addr()))
		let err = addr.value.UnmarshalBinary($.goSlice(b, undefined, $.len(b) - 2))
		if (err != null) {
			return err
		}
		$.assignStruct($.pointerValue<AddrPort>(p), $.markAsStructValue($.cloneStructValue(AddrPortFrom($.markAsStructValue($.cloneStructValue(addr.value)), $.uint(byteorder.LEUint16($.goSlice(b, $.len(b) - 2, undefined)), 16)))))
		return null
	}

	public UnmarshalText(text: $.Slice<number>): $.GoError {
		let p: AddrPort | $.VarRef<AddrPort> | null = this;
		if ($.len(text) == 0) {
			$.assignStruct($.pointerValue<AddrPort>(p), $.markAsStructValue(new AddrPort()))
			return null
		}
		let err: $.GoError = null! as $.GoError
		let __goscriptTuple2: any = ParseAddrPort($.bytesToString(text))
		$.assignStruct($.pointerValue<AddrPort>(p), __goscriptTuple2[0])
		err = __goscriptTuple2[1]
		return err
	}

	static {
		$.bindStructFields(this.prototype, ["ip", "port"])
	}

	static __typeInfo = $.registerStructType(
		"netip.AddrPort",
		() => new AddrPort(),
		() => [{ name: "Addr", args: [], returns: [{ type: "netip.Addr" }] }, { name: "AppendBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "AppendText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "AppendTo", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }] }, { name: "Compare", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "IsValid", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "MarshalBinary", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "MarshalText", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "Port", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("uint16") }] }, { name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "UnmarshalBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "UnmarshalText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }],
		AddrPort,
		() => [{ name: "ip", key: "ip", type: "netip.Addr" }, { name: "port", key: "port", type: /* @__PURE__ */ $.basicType("uint16") }]
	)
}

export class Prefix {
	public declare ip: Addr

	// bitsPlusOne stores the prefix bit length plus one.
	// A Prefix is valid if and only if bitsPlusOne is non-zero.
	public declare bitsPlusOne: number

	public _fields: {
		ip: Addr
		bitsPlusOne: number
	}

	constructor(init?: Partial<{ip?: Addr, bitsPlusOne?: number}>) {
		this._fields = {
			ip: init?.ip ? $.markAsStructValue($.cloneStructValue(init.ip)) : $.markAsStructValue(new Addr()),
			bitsPlusOne: init?.bitsPlusOne ?? (0 as number)
		}
	}

	public clone(): Prefix {
		return $.markAsStructValue(new Prefix(this))
	}

	public Addr(): Addr {
		const p = this;
		return $.markAsStructValue($.cloneStructValue(p.ip))
	}

	public AppendBinary(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const p = this;
		let __goscriptTuple5: any = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Addr())).withoutZone())).AppendBinary(b)
		b = __goscriptTuple5[0]
		let err = __goscriptTuple5[1]
		if (err != null) {
			return [null, err]
		}
		return [$.append(b, $.uint($.uint($.markAsStructValue($.cloneStructValue(p)).Bits(), 8), 8), $.byteSliceHint), null]
	}

	public AppendText(b: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const p = this;
		return [$.markAsStructValue($.cloneStructValue(p)).AppendTo(b), null]
	}

	public AppendTo(b: $.Slice<number>): $.Slice<number> {
		const p = this;
		if ($.markAsStructValue($.cloneStructValue(p)).isZero()) {
			return b
		}
		if (!$.markAsStructValue($.cloneStructValue(p)).IsValid()) {
			return $.appendSlice(b, $.stringToBytes("invalid Prefix"), $.byteSliceHint)
		}

		if ($.comparableEqual(p.ip.z, z4)) {
			b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo4(b)
		} else {
			if ($.markAsStructValue($.cloneStructValue(p.ip)).Is4In6()) {
				b = $.appendSlice(b, $.stringToBytes("::ffff:"), $.byteSliceHint)
				b = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p.ip)).Unmap())).appendTo4(b)
			} else {
				b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo6(b)
			}
		}

		b = $.append(b, $.uint(47, 8), $.byteSliceHint)
		b = appendDecimal(b, $.uint($.uint($.markAsStructValue($.cloneStructValue(p)).Bits(), 8), 8))
		return b
	}

	public Bits(): number {
		const p = this;
		return $.int(p.bitsPlusOne) - 1
	}

	public Compare(p2: Prefix): number {
		const p = this;
		// Aside from sorting based on the masked address, this use of
		// Addr.Compare also enforces the valid vs. invalid and address
		// family ordering for the prefix.
		{
			let c = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Masked())).Addr())).Compare($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p2)).Masked())).Addr())))
			if (c != 0) {
				return c
			}
		}

		{
			let c = cmp.Compare($.markAsStructValue($.cloneStructValue(p)).Bits(), $.markAsStructValue($.cloneStructValue(p2)).Bits())
			if (c != 0) {
				return c
			}
		}

		return $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Addr())).Compare($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p2)).Addr())))
	}

	public Contains(ip: Addr): boolean {
		const p = this;
		if (!$.markAsStructValue($.cloneStructValue(p)).IsValid() || $.markAsStructValue($.cloneStructValue(ip)).hasZone()) {
			return false
		}
		{
			let f1 = $.markAsStructValue($.cloneStructValue(p.ip)).BitLen()
			let f2 = $.markAsStructValue($.cloneStructValue(ip)).BitLen()
			if (((f1 == 0) || (f2 == 0)) || (f1 != f2)) {
				return false
			}
		}
		if ($.markAsStructValue($.cloneStructValue(ip)).Is4()) {
			// xor the IP addresses together; mismatched bits are now ones.
			// Shift away the number of bits we don't care about.
			// Shifts in Go are more efficient if the compiler can prove
			// that the shift amount is smaller than the width of the shifted type (64 here).
			// We know that p.bits is in the range 0..32 because p is Valid;
			// the compiler doesn't know that, so mask with 63 to help it.
			// Now truncate to 32 bits, because this is IPv4.
			// If all the bits we care about are equal, the result will be zero.
			return $.uint($.uint($.uint64Shr(($.uint64Xor(ip.addr.lo, p.ip.addr.lo)), ((32 - $.markAsStructValue($.cloneStructValue(p)).Bits()) & 63)), 32), 32) == 0
		} else {
			// xor the IP addresses together.
			// Mask away the bits we don't care about.
			// If all the bits we care about are equal, the result will be zero.
			return $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip.addr)).xor($.markAsStructValue($.cloneStructValue(p.ip.addr))))).and($.markAsStructValue($.cloneStructValue(__goscript_uint128.mask6($.markAsStructValue($.cloneStructValue(p)).Bits())))))).isZero()
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	public IsSingleIP(): boolean {
		const p = this;
		return $.markAsStructValue($.cloneStructValue(p)).IsValid() && ($.markAsStructValue($.cloneStructValue(p)).Bits() == $.markAsStructValue($.cloneStructValue(p.ip)).BitLen())
	}

	public IsValid(): boolean {
		const p = this;
		return $.uint(p.bitsPlusOne, 8) > 0
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const p = this;
		// without the zone the max length is 16, plus an additional byte is 17
		return $.markAsStructValue($.cloneStructValue(p)).AppendBinary($.makeSlice<number>(0, $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p)).Addr())).withoutZone())).marshalBinarySize() + 1, "byte"))
	}

	public MarshalText(): [$.Slice<number>, $.GoError] {
		const p = this;
		let buf: $.Slice<number> = new Uint8Array([]) as $.Slice<number>
		switch (p.ip.z) {
			case z0:
			{
				break
			}
			case z4:
			{
				const maxCap: number = 18
				buf = $.makeSlice<number>(0, 18, "byte")
				break
			}
			default:
			{
				const maxCap: number = 50
				buf = $.makeSlice<number>(0, 50, "byte")
				break
			}
		}
		return $.markAsStructValue($.cloneStructValue(p)).AppendText(buf)
	}

	public Masked(): Prefix {
		const p = this;
		let [m, ] = $.markAsStructValue($.cloneStructValue(p.ip)).Prefix($.markAsStructValue($.cloneStructValue(p)).Bits())
		return $.markAsStructValue($.cloneStructValue(m))
	}

	public Overlaps(o: Prefix): boolean {
		let p: Prefix = this;
		if (!$.markAsStructValue($.cloneStructValue(p)).IsValid() || !$.markAsStructValue($.cloneStructValue(o)).IsValid()) {
			return false
		}
		if ($.comparableEqual(p, o)) {
			return true
		}
		if ($.markAsStructValue($.cloneStructValue(p.ip)).Is4() != $.markAsStructValue($.cloneStructValue(o.ip)).Is4()) {
			return false
		}
		let minBits: number = 0
		{
			let pb = $.markAsStructValue($.cloneStructValue(p)).Bits()
			let ob = $.markAsStructValue($.cloneStructValue(o)).Bits()
			if (pb < ob) {
				minBits = pb
			} else {
				minBits = ob
			}
		}
		if (minBits == 0) {
			return true
		}
		// One of these Prefix calls might look redundant, but we don't require
		// that p and o values are normalized (via Prefix.Masked) first,
		// so the Prefix call on the one that's already minBits serves to zero
		// out any remaining bits in IP.
		let err: $.GoError = null! as $.GoError
		{
			let __goscriptTuple6: any = $.markAsStructValue($.cloneStructValue(p.ip)).Prefix(minBits)
			$.assignStruct(p, __goscriptTuple6[0])
			err = __goscriptTuple6[1]
			if (err != null) {
				return false
			}
		}
		{
			let __goscriptTuple7: any = $.markAsStructValue($.cloneStructValue(o.ip)).Prefix(minBits)
			$.assignStruct(o, __goscriptTuple7[0])
			err = __goscriptTuple7[1]
			if (err != null) {
				return false
			}
		}
		return $.comparableEqual(p.ip, o.ip)
	}

	public String(): string {
		const p = this;
		if (!$.markAsStructValue($.cloneStructValue(p)).IsValid()) {
			return "invalid Prefix"
		}
		let b: $.Slice<number> = null! as $.Slice<number>
		switch ((true as boolean)) {
			case $.comparableEqual(p.ip.z, z4):
			{
				const maxCap: number = 18
				b = $.makeSlice<number>(0, 18, "byte")
				b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo4(b)
				break
			}
			case $.markAsStructValue($.cloneStructValue(p.ip)).Is4In6():
			{
				const maxCap: number = 25
				b = $.makeSlice<number>(0, 25, "byte")
				b = $.appendSlice(b, $.stringToBytes("::ffff:"), $.byteSliceHint)
				b = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(p.ip)).Unmap())).appendTo4(b)
				break
			}
			default:
			{
				const maxCap: number = 43
				b = $.makeSlice<number>(0, 43, "byte")
				b = $.markAsStructValue($.cloneStructValue(p.ip)).appendTo6(b)
				break
			}
		}
		b = $.append(b, $.uint(47, 8), $.byteSliceHint)
		b = appendDecimal(b, $.uint($.uint($.markAsStructValue($.cloneStructValue(p)).Bits(), 8), 8))
		return $.bytesToString(b)
	}

	public UnmarshalBinary(b: $.Slice<number>): $.GoError {
		let p: Prefix | $.VarRef<Prefix> | null = this;
		if ($.len(b) < 1) {
			return errors.New("unexpected slice size")
		}
		let addr: $.VarRef<Addr> = $.varRef($.markAsStructValue(new Addr()))
		let err = addr.value.UnmarshalBinary($.goSlice(b, undefined, $.len(b) - 1))
		if (err != null) {
			return err
		}
		$.assignStruct($.pointerValue<Prefix>(p), $.markAsStructValue($.cloneStructValue(PrefixFrom($.markAsStructValue($.cloneStructValue(addr.value)), $.int($.arrayIndex(b!, $.len(b) - 1))))))
		return null
	}

	public async UnmarshalText(text: $.Slice<number>): globalThis.Promise<$.GoError> {
		let p: Prefix | $.VarRef<Prefix> | null = this;
		if ($.len(text) == 0) {
			$.assignStruct($.pointerValue<Prefix>(p), $.markAsStructValue(new Prefix()))
			return null
		}
		let err: $.GoError = null! as $.GoError
		let __goscriptTuple8: any = await ParsePrefix($.bytesToString(text))
		$.assignStruct($.pointerValue<Prefix>(p), __goscriptTuple8[0])
		err = __goscriptTuple8[1]
		return err
	}

	public isZero(): boolean {
		const p = this;
		return $.comparableEqual(p, $.markAsStructValue(new Prefix()))
	}

	static {
		$.bindStructFields(this.prototype, ["ip", "bitsPlusOne"])
	}

	static __typeInfo = $.registerStructType(
		"netip.Prefix",
		() => new Prefix(),
		() => [{ name: "Addr", args: [], returns: [{ type: "netip.Addr" }] }, { name: "AppendBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "AppendText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "AppendTo", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }] }, { name: "Bits", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Compare", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Contains", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "IsSingleIP", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "IsValid", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "MarshalBinary", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "MarshalText", args: [], returns: [{ type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { type: "error" }] }, { name: "Masked", args: [], returns: [{ type: "netip.Prefix" }] }, { name: "Overlaps", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "UnmarshalBinary", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "UnmarshalText", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }, { name: "isZero", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }],
		Prefix,
		() => [{ name: "ip", key: "ip", type: "netip.Addr" }, { name: "bitsPlusOne", key: "bitsPlusOne", type: /* @__PURE__ */ $.basicType("uint8") }]
	)
}

export class parsePrefixError {
	public declare _in: string

	public declare msg: string

	public _fields: {
		_in: string
		msg: string
	}

	constructor(init?: Partial<{_in?: string, msg?: string}>) {
		this._fields = {
			_in: init?._in ?? ("" as string),
			msg: init?.msg ?? ("" as string)
		}
	}

	public clone(): parsePrefixError {
		return $.markAsStructValue(new parsePrefixError(this))
	}

	public Error(): string {
		const err = this;
		return (("netip.ParsePrefix(" + strconv.Quote(err._in)) + "): ") + err.msg
	}

	static {
		$.bindStructFields(this.prototype, ["_in", "msg"])
	}

	static __typeInfo = $.registerStructType(
		"netip.parsePrefixError",
		() => new parsePrefixError(),
		() => [{ name: "Error", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		parsePrefixError,
		() => [{ name: "in", key: "_in", type: /* @__PURE__ */ $.basicType("string") }, { name: "msg", key: "msg", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export const digits: string = "0123456789abcdef"

export let z0: _unique.Handle<addrDetail> = $.markAsStructValue(new _unique.Handle<addrDetail>())

export function __goscript_set_z0(__goscriptValue: _unique.Handle<addrDetail>): void {
	$.assignStruct(z0, __goscriptValue)
}

export let z4: _unique.Handle<addrDetail> = $.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new addrDetail()))))

export function __goscript_set_z4(__goscriptValue: _unique.Handle<addrDetail>): void {
	$.assignStruct(z4, __goscriptValue)
}

export let z6noz: _unique.Handle<addrDetail> = $.markAsStructValue($.cloneStructValue(_unique.Make($.markAsStructValue(new addrDetail({isV6: true})))))

export function __goscript_set_z6noz(__goscriptValue: _unique.Handle<addrDetail>): void {
	$.assignStruct(z6noz, __goscriptValue)
}

export function IPv6LinkLocalAllNodes(): Addr {
	return $.markAsStructValue($.cloneStructValue(AddrFrom16($.arrayValue(new Uint8Array([255, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])))))
}

export function IPv6LinkLocalAllRouters(): Addr {
	return $.markAsStructValue($.cloneStructValue(AddrFrom16($.arrayValue(new Uint8Array([255, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2])))))
}

export function IPv6Loopback(): Addr {
	return $.markAsStructValue($.cloneStructValue(AddrFrom16($.arrayValue(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])))))
}

export function IPv6Unspecified(): Addr {
	return $.markAsStructValue(new Addr({z: $.markAsStructValue($.cloneStructValue(z6noz))}))
}

export function IPv4Unspecified(): Addr {
	return $.markAsStructValue($.cloneStructValue(AddrFrom4($.arrayValue(new Uint8Array(4)))))
}

export function AddrFrom4(addr: Uint8Array): Addr {
	return $.markAsStructValue(new Addr({addr: $.markAsStructValue(new __goscript_uint128.uint128({hi: 0n, lo: $.uint64Or(($.uint64Or(($.uint64Or(($.uint64Or(281470681743360n, ($.uint64Shl($.uint64($.arrayIndex(addr, 0)), 24n)))), ($.uint64Shl($.uint64($.arrayIndex(addr, 1)), 16n)))), ($.uint64Shl($.uint64($.arrayIndex(addr, 2)), 8n)))), $.uint64($.arrayIndex(addr, 3)))})), z: $.markAsStructValue($.cloneStructValue(z4))}))
}

export function AddrFrom16(addr: Uint8Array): Addr {
	return $.markAsStructValue(new Addr({addr: (() => { const __goscriptLiteralField0 = byteorder.BEUint64($.goSlice(addr, undefined, 8)); const __goscriptLiteralField1 = byteorder.BEUint64($.goSlice(addr, 8, undefined)); return $.markAsStructValue(new __goscript_uint128.uint128({hi: __goscriptLiteralField0, lo: __goscriptLiteralField1})) })(), z: $.markAsStructValue($.cloneStructValue(z6noz))}))
}

export function ParseAddr(s: string): [Addr, $.GoError] {
	for (let i = 0; i < $.len(s); i++) {
		switch ($.indexStringOrBytes(s, i)) {
			case 46:
			{
				return parseIPv4(s)
				break
			}
			case 58:
			{
				return parseIPv6(s)
				break
			}
			case 37:
			{
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: s, msg: "missing IPv6 address"})), "netip.parseAddrError", "netip.parseAddrError")]
				break
			}
		}
	}
	return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: s, msg: "unable to parse IP"})), "netip.parseAddrError", "netip.parseAddrError")]
}

export function MustParseAddr(s: string): Addr {
	let [ip, err] = ParseAddr(s)
	if (err != null) {
		$.panic((err as any))
	}
	return $.markAsStructValue($.cloneStructValue(ip))
}

export function parseIPv4Fields(_in: string, off: number, end: number, fields: $.Slice<number>): $.GoError {
	let val: number = 0
	let pos: number = 0
	let digLen: number = 0
	let s = $.sliceStringOrBytes(_in, off, end)
	for (let i = 0; i < $.len(s); i++) {
		if (($.uint($.indexStringOrBytes(s, i), 8) >= 48) && ($.uint($.indexStringOrBytes(s, i), 8) <= 57)) {
			if ((digLen == 1) && (val == 0)) {
				return $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "IPv4 field has octet with leading zero"})), "netip.parseAddrError", "netip.parseAddrError")
			}
			val = ((val * 10) + $.int($.indexStringOrBytes(s, i))) - 48
			digLen++
			if (val > 255) {
				return $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "IPv4 field has value >255"})), "netip.parseAddrError", "netip.parseAddrError")
			}
		} else {
			if ($.uint($.indexStringOrBytes(s, i), 8) == 46) {
				// .1.2.3
				// 1.2.3.
				// 1..2.3
				if (((i == 0) || (i == ($.len(s) - 1))) || ($.uint($.indexStringOrBytes(s, i - 1), 8) == 46)) {
					return $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "IPv4 field must have at least one digit", at: $.sliceStringOrBytes(s, i, undefined)})), "netip.parseAddrError", "netip.parseAddrError")
				}
				// 1.2.3.4.5
				if (pos == 3) {
					return $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "IPv4 address too long"})), "netip.parseAddrError", "netip.parseAddrError")
				}
				fields![pos] = $.uint($.uint(val, 8), 8)
				pos++
				val = 0
				digLen = 0
			} else {
				return $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "unexpected character", at: $.sliceStringOrBytes(s, i, undefined)})), "netip.parseAddrError", "netip.parseAddrError")
			}
		}
	}
	if (pos < 3) {
		return $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "IPv4 address too short"})), "netip.parseAddrError", "netip.parseAddrError")
	}
	fields![3] = $.uint($.uint(val, 8), 8)
	return null
}

export function parseIPv4(s: string): [Addr, $.GoError] {
	let ip: Addr = $.markAsStructValue(new Addr())
	let err: $.GoError = null! as $.GoError
	let fields: Uint8Array = $.arrayValue(new Uint8Array(4))
	err = parseIPv4Fields(s, 0, $.len(s), $.goSlice(fields, undefined, undefined))
	if (err != null) {
		return [$.markAsStructValue(new Addr()), err]
	}
	return [$.markAsStructValue($.cloneStructValue(AddrFrom4($.cloneArrayValue(fields, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4))))), null]
}

export function parseIPv6(_in: string): [Addr, $.GoError] {
	let s = _in

	// Split off the zone right from the start. Yes it's a second scan
	// of the string, but trying to handle it inline makes a bunch of
	// other inner loop conditionals more expensive, and it ends up
	// being slower.
	let zone = ""
	let i: number = bytealg.IndexByteString(s, 37)
	if (i != -1) {
		let __goscriptAssign1_0: string = $.sliceStringOrBytes(s, undefined, i)
		let __goscriptAssign1_1: string = $.sliceStringOrBytes(s, i + 1, undefined)
		s = __goscriptAssign1_0
		zone = __goscriptAssign1_1
		if ($.stringEqual(zone, "")) {
			// Not allowed to have an empty zone if explicitly specified.
			return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "zone must be a non-empty string"})), "netip.parseAddrError", "netip.parseAddrError")]
		}
	}

	let ip: Uint8Array = $.arrayValue(new Uint8Array(16))
	let ellipsis = -1

	// Might have leading ellipsis
	if ((($.len(s) >= 2) && ($.uint($.indexStringOrBytes(s, 0), 8) == 58)) && ($.uint($.indexStringOrBytes(s, 1), 8) == 58)) {
		ellipsis = 0
		s = $.sliceStringOrBytes(s, 2, undefined)
		// Might be only ellipsis
		if ($.len(s) == 0) {
			return [$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(IPv6Unspecified())).WithZone(zone))), null]
		}
	}

	// Loop, parsing hex numbers followed by colon.
	i = 0
	while (i < 16) {
		// Hex number. Similar to parseIPv4, inlining the hex number
		// parsing yields a significant performance increase.
		let off = 0
		let acc = 0
		for (; off < $.len(s); off++) {
			let c = $.uint($.indexStringOrBytes(s, off), 8)
			if (($.uint(c, 8) >= 48) && ($.uint(c, 8) <= 57)) {
				acc = $.uint((acc << 4) + $.uint(c - 48, 32), 32)
			} else {
				if (($.uint(c, 8) >= 97) && ($.uint(c, 8) <= 102)) {
					acc = $.uint((acc << 4) + $.uint((c - 97) + 10, 32), 32)
				} else {
					if (($.uint(c, 8) >= 65) && ($.uint(c, 8) <= 70)) {
						acc = $.uint((acc << 4) + $.uint((c - 65) + 10, 32), 32)
					} else {
						break
					}
				}
			}
			if (off > 3) {
				//more than 4 digits in group, fail.
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "each group must have 4 or less digits", at: s})), "netip.parseAddrError", "netip.parseAddrError")]
			}
			if ($.uint(acc, 32) > 65535) {
				// Overflow, fail.
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "IPv6 field has value >=2^16", at: s})), "netip.parseAddrError", "netip.parseAddrError")]
			}
		}
		if (off == 0) {
			// No digits found, fail.
			return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "each colon-separated field must have at least one digit", at: s})), "netip.parseAddrError", "netip.parseAddrError")]
		}

		// If followed by dot, might be in trailing IPv4.
		if ((off < $.len(s)) && ($.uint($.indexStringOrBytes(s, off), 8) == 46)) {
			if ((ellipsis < 0) && (i != 12)) {
				// Not the right place.
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "embedded IPv4 address must replace the final 2 fields of the address", at: s})), "netip.parseAddrError", "netip.parseAddrError")]
			}
			if ((i + 4) > 16) {
				// Not enough room.
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "too many hex fields to fit an embedded IPv4 at the end of the address", at: s})), "netip.parseAddrError", "netip.parseAddrError")]
			}

			let end = $.len(_in)
			if ($.len(zone) > 0) {
				end = end - ($.len(zone) + 1)
			}
			let err = parseIPv4Fields(_in, end - $.len(s), end, $.goSlice(ip, i, i + 4))
			if (err != null) {
				return [$.markAsStructValue(new Addr()), err]
			}
			s = ""
			i = i + (4)
			break
		}

		// Save this 16-bit chunk.
		ip[i] = $.uint($.uint($.uintShr(acc, 8, 32), 8), 8)
		ip[i + 1] = $.uint($.uint(acc, 8), 8)
		i = i + (2)

		// Stop at end of string.
		s = $.sliceStringOrBytes(s, off, undefined)
		if ($.len(s) == 0) {
			break
		}

		// Otherwise must be followed by colon and more.
		if ($.uint($.indexStringOrBytes(s, 0), 8) != 58) {
			return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "unexpected character, want colon", at: s})), "netip.parseAddrError", "netip.parseAddrError")]
		} else {
			if ($.len(s) == 1) {
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "colon must be followed by more characters", at: s})), "netip.parseAddrError", "netip.parseAddrError")]
			}
		}
		s = $.sliceStringOrBytes(s, 1, undefined)

		// Look for ellipsis.
		if ($.uint($.indexStringOrBytes(s, 0), 8) == 58) {
			if (ellipsis >= 0) {
				return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "multiple :: in address", at: s})), "netip.parseAddrError", "netip.parseAddrError")]
			}
			ellipsis = i
			s = $.sliceStringOrBytes(s, 1, undefined)
			if ($.len(s) == 0) {
				break
			}
		}
	}

	// Must have used entire string.
	if ($.len(s) != 0) {
		return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "trailing garbage after address", at: s})), "netip.parseAddrError", "netip.parseAddrError")]
	}

	// If didn't parse enough, expand ellipsis.
	if (i < 16) {
		if (ellipsis < 0) {
			return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "address string too short"})), "netip.parseAddrError", "netip.parseAddrError")]
		}
		let n = 16 - i
		for (let j = i - 1; j >= ellipsis; j--) {
			ip[j + n] = $.uint($.arrayIndex(ip, j), 8)
		}
		$.clear($.goSlice(ip, ellipsis, ellipsis + n))
	} else {
		if (ellipsis >= 0) {
			// Ellipsis must represent at least one 0 group.
			return [$.markAsStructValue(new Addr()), $.interfaceValue<$.GoError>($.markAsStructValue(new parseAddrError({_in: _in, msg: "the :: must expand to at least one field of zeros"})), "netip.parseAddrError", "netip.parseAddrError")]
		}
	}
	return [$.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(AddrFrom16($.cloneArrayValue(ip, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 16))))).WithZone(zone))), null]
}

export function AddrFromSlice(slice: $.Slice<number>): [Addr, boolean] {
	let ip: Addr = $.markAsStructValue(new Addr())
	let ok: boolean = false
	switch ($.len(slice)) {
		case 4:
		{
			return [$.markAsStructValue($.cloneStructValue(AddrFrom4($.cloneArrayValue(($.sliceToArray<number>(slice, 4, "byte") as Uint8Array), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 4))))), true]
			break
		}
		case 16:
		{
			return [$.markAsStructValue($.cloneStructValue(AddrFrom16($.cloneArrayValue(($.sliceToArray<number>(slice, 16, "byte") as Uint8Array), /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 16))))), true]
			break
		}
	}
	return [$.markAsStructValue(new Addr()), false]
}

export function appendDecimal(b: $.Slice<number>, x: number): $.Slice<number> {
	// Using this function rather than strconv.AppendUint makes IPv4
	// string building 2x faster.

	if ($.uint(x, 8) >= 100) {
		b = $.append(b, $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", Math.trunc(x / 100)), 8), $.byteSliceHint)
	}
	if ($.uint(x, 8) >= 10) {
		b = $.append(b, $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", (Math.trunc(x / 10)) % 10), 8), $.byteSliceHint)
	}
	return $.append(b, $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", x % 10), 8), $.byteSliceHint)
}

export function appendHex(b: $.Slice<number>, x: number): $.Slice<number> {
	// Using this function rather than strconv.AppendUint makes IPv6
	// string building 2x faster.

	if ($.uint(x, 16) >= 0x1000) {
		b = $.append(b, $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", $.uintShr(x, 12, 16)), 8), $.byteSliceHint)
	}
	if ($.uint(x, 16) >= 0x100) {
		b = $.append(b, $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", ($.uintShr(x, 8, 16)) & 0xf), 8), $.byteSliceHint)
	}
	if ($.uint(x, 16) >= 0x10) {
		b = $.append(b, $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", ($.uintShr(x, 4, 16)) & 0xf), 8), $.byteSliceHint)
	}
	return $.append(b, $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", x & 0xf), 8), $.byteSliceHint)
}

export function appendHexPad(b: $.Slice<number>, x: number): $.Slice<number> {
	return $.append(b, $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", $.uintShr(x, 12, 16)), 8), $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", ($.uintShr(x, 8, 16)) & 0xf), 8), $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", ($.uintShr(x, 4, 16)) & 0xf), 8), $.uint($.indexByteString("\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x61\x62\x63\x64\x65\x66", x & 0xf), 8), $.byteSliceHint)
}

export function AddrPortFrom(ip: Addr, port: number): AddrPort {
	return $.markAsStructValue(new AddrPort({ip: $.markAsStructValue($.cloneStructValue(ip)), port: $.uint(port, 16)}))
}

export function splitAddrPort(s: string): [string, string, boolean, $.GoError] {
	let ip: string = ""
	let port: string = ""
	let v6: boolean = false
	let err: $.GoError = null! as $.GoError
	let i = bytealg.LastIndexByteString(s, 58)
	if (i == -1) {
		return ["", "", false, errors.New("not an ip:port")]
	}

	let __goscriptAssign2_0: string = $.sliceStringOrBytes(s, undefined, i)
	let __goscriptAssign2_1: string = $.sliceStringOrBytes(s, i + 1, undefined)
	ip = __goscriptAssign2_0
	port = __goscriptAssign2_1
	if ($.len(ip) == 0) {
		return ["", "", false, errors.New("no IP")]
	}
	if ($.len(port) == 0) {
		return ["", "", false, errors.New("no port")]
	}
	if ($.uint($.indexStringOrBytes(ip, 0), 8) == 91) {
		if (($.len(ip) < 2) || ($.uint($.indexStringOrBytes(ip, $.len(ip) - 1), 8) != 93)) {
			return ["", "", false, errors.New("missing ]")]
		}
		ip = $.sliceStringOrBytes(ip, 1, $.len(ip) - 1)
		v6 = true
	}

	return [ip, port, v6, null]
}

export function ParseAddrPort(s: string): [AddrPort, $.GoError] {
	let ipp: AddrPort = $.markAsStructValue(new AddrPort())
	let [ip, port, v6, err] = splitAddrPort(s)
	if (err != null) {
		return [$.markAsStructValue($.cloneStructValue(ipp)), err]
	}
	let __goscriptTuple3: any = strconv.ParseUint(port, 10, 16)
	let port16 = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	if (err != null) {
		return [$.markAsStructValue($.cloneStructValue(ipp)), errors.New((("invalid port " + strconv.Quote(port)) + " parsing ") + strconv.Quote(s))]
	}
	ipp.port = $.uint($.uint(port16, 16), 16)
	let __goscriptTuple4: any = ParseAddr(ip)
	$.assignStruct(ipp.ip, __goscriptTuple4[0])
	err = __goscriptTuple4[1]
	if (err != null) {
		return [$.markAsStructValue(new AddrPort()), err]
	}
	if (v6 && $.markAsStructValue($.cloneStructValue(ipp.ip)).Is4()) {
		return [$.markAsStructValue(new AddrPort()), errors.New(("invalid ip:port " + strconv.Quote(s)) + ", square brackets can only be used with IPv6 addresses")]
	} else {
		if (!v6 && $.markAsStructValue($.cloneStructValue(ipp.ip)).Is6()) {
			return [$.markAsStructValue(new AddrPort()), errors.New(("invalid ip:port " + strconv.Quote(s)) + ", IPv6 addresses must be surrounded by square brackets")]
		}
	}
	return [$.markAsStructValue($.cloneStructValue(ipp)), null]
}

export function MustParseAddrPort(s: string): AddrPort {
	let [ip, err] = ParseAddrPort(s)
	if (err != null) {
		$.panic((err as any))
	}
	return $.markAsStructValue($.cloneStructValue(ip))
}

export function PrefixFrom(ip: Addr, bits: number): Prefix {
	let bitsPlusOne: number = 0
	if ((!$.markAsStructValue($.cloneStructValue(ip)).isZero() && (bits >= 0)) && (bits <= $.markAsStructValue($.cloneStructValue(ip)).BitLen())) {
		bitsPlusOne = $.uint($.uint(bits, 8) + 1, 8)
	}
	return (() => { const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue($.markAsStructValue($.cloneStructValue(ip)).withoutZone())); return $.markAsStructValue(new Prefix({ip: __goscriptLiteralField2, bitsPlusOne: $.uint(bitsPlusOne, 8)})) })()
}

export async function ParsePrefix(s: string): globalThis.Promise<[Prefix, $.GoError]> {
	let i = bytealg.LastIndexByteString(s, 47)
	if (i < 0) {
		return [$.markAsStructValue(new Prefix()), $.interfaceValue<$.GoError>($.markAsStructValue(new parsePrefixError({_in: s, msg: "no '/'"})), "netip.parsePrefixError", "netip.parsePrefixError")]
	}
	let [ip, err] = ParseAddr($.sliceStringOrBytes(s, undefined, i))
	if (err != null) {
		return [$.markAsStructValue(new Prefix()), $.interfaceValue<$.GoError>((await (async () => { const __goscriptLiteralField3 = await $.pointerValue<Exclude<$.GoError, null>>(err).Error(); return $.markAsStructValue(new parsePrefixError({_in: s, msg: __goscriptLiteralField3})) })()), "netip.parsePrefixError", "netip.parsePrefixError")]
	}
	// IPv6 zones are not allowed: https://go.dev/issue/51899
	if ($.markAsStructValue($.cloneStructValue(ip)).Is6() && (!$.comparableEqual(ip.z, z6noz))) {
		return [$.markAsStructValue(new Prefix()), $.interfaceValue<$.GoError>($.markAsStructValue(new parsePrefixError({_in: s, msg: "IPv6 zones cannot be present in a prefix"})), "netip.parsePrefixError", "netip.parsePrefixError")]
	}

	let bitsStr = $.sliceStringOrBytes(s, i + 1, undefined)

	// strconv.Atoi accepts a leading sign and leading zeroes, but we don't want that.
	if (($.len(bitsStr) > 1) && (($.uint($.indexStringOrBytes(bitsStr, 0), 8) < 49) || ($.uint($.indexStringOrBytes(bitsStr, 0), 8) > 57))) {
		return [$.markAsStructValue(new Prefix()), $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField4 = "bad bits after slash: " + strconv.Quote(bitsStr); return $.markAsStructValue(new parsePrefixError({_in: s, msg: __goscriptLiteralField4})) })(), "netip.parsePrefixError", "netip.parsePrefixError")]
	}

	let __goscriptTuple9: any = strconv.Atoi(bitsStr)
	let bits = __goscriptTuple9[0]
	err = __goscriptTuple9[1]
	if (err != null) {
		return [$.markAsStructValue(new Prefix()), $.interfaceValue<$.GoError>((() => { const __goscriptLiteralField5 = "bad bits after slash: " + strconv.Quote(bitsStr); return $.markAsStructValue(new parsePrefixError({_in: s, msg: __goscriptLiteralField5})) })(), "netip.parsePrefixError", "netip.parsePrefixError")]
	}
	let maxBits = 32
	if ($.markAsStructValue($.cloneStructValue(ip)).Is6()) {
		maxBits = 128
	}
	if ((bits < 0) || (bits > maxBits)) {
		return [$.markAsStructValue(new Prefix()), $.interfaceValue<$.GoError>($.markAsStructValue(new parsePrefixError({_in: s, msg: "prefix length out of range"})), "netip.parsePrefixError", "netip.parsePrefixError")]
	}
	return [$.markAsStructValue($.cloneStructValue(PrefixFrom($.markAsStructValue($.cloneStructValue(ip)), bits))), null]
}

export async function MustParsePrefix(s: string): globalThis.Promise<Prefix> {
	let [ip, err] = await ParsePrefix(s)
	if (err != null) {
		$.panic((err as any))
	}
	return $.markAsStructValue($.cloneStructValue(ip))
}

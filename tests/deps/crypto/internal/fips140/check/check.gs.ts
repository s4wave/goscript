// Generated file based on check.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as hmac from "@goscript/crypto/internal/fips140/hmac/index.js"

import * as sha256 from "@goscript/crypto/internal/fips140/sha256/index.js"

import * as byteorder from "@goscript/crypto/internal/fips140deps/byteorder/index.js"

import * as godebug from "@goscript/crypto/internal/fips140deps/godebug/index.js"

import * as io from "@goscript/io/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/hmac/index.js"
import "@goscript/crypto/internal/fips140/sha256/index.js"
import "@goscript/crypto/internal/fips140deps/byteorder/index.js"
import "@goscript/crypto/internal/fips140deps/godebug/index.js"
import "@goscript/io/index.js"
import "@goscript/unsafe/index.js"

export const fipsMagic: string = $.bytesToString(new Uint8Array([32, 71, 111, 32, 102, 105, 112, 115, 105, 110, 102, 111, 32, 255, 0]))

export let Verified: boolean = false

export function __goscript_set_Verified(__goscriptValue: boolean): void {
	Verified = __goscriptValue
}

export let Linkinfo: {"Magic": Uint8Array, "Sum": Uint8Array, "Self": number, "Sects": {"Start": any, "End": any}[]} = {"Magic": new Uint8Array(16), "Sum": new Uint8Array(32), "Self": 0, "Sects": Array.from({ length: 4 }, () => ({"Start": null, "End": null}))}

export function __goscript_set_Linkinfo(__goscriptValue: {"Magic": Uint8Array, "Sum": Uint8Array, "Self": number, "Sects": {"Start": any, "End": any}[]}): void {
	Linkinfo = __goscriptValue
}

export let zeroSum: Uint8Array = new Uint8Array(32)

export function __goscript_set_zeroSum(__goscriptValue: Uint8Array): void {
	zeroSum = __goscriptValue
}

async function __goscriptInit0(): globalThis.Promise<void> {
	if (!fips140.Enabled) {
		return
	}

	{
		let err = fips140.Supported()
		if (err != null) {
			$.panic("fips140: " + $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		}
	}

	if ((($.uint($.arrayIndex(Linkinfo.Magic, 0), 8) != $.uint(0xff, 8)) || (!$.stringEqual($.bytesToString($.goSlice(Linkinfo.Magic, 1, undefined)), $.bytesToString(new Uint8Array([32, 71, 111, 32, 102, 105, 112, 115, 105, 110, 102, 111, 32, 255, 0]))))) || ($.arrayEqual(Linkinfo.Sum, zeroSum))) {
		$.panic("fips140: no verification checksum found")
	}

	let h: hmac.HMAC | $.VarRef<hmac.HMAC> | null = await hmac.New(undefined, sha256.New, $.makeSlice<number>(32, undefined, "byte"))
	let w = $.interfaceValue<io.Writer | null>(h, "*hmac.HMAC", { kind: $.TypeKind.Pointer, elemType: "hmac.HMAC" })

	/*
			// Uncomment for debugging.
			// Commented (as opposed to a const bool flag)
			// to avoid import "os" in default builds.
			f, err := os.Create("fipscheck.o")
			if err != nil {
				panic(err)
			}
			w = io.MultiWriter(h, f)
		*/

	await $.pointerValue<Exclude<io.Writer, null>>(w).Write(new Uint8Array([103, 111, 32, 102, 105, 112, 115, 32, 111, 98, 106, 101, 99, 116, 32, 118, 49, 10]))

	let nbuf: Uint8Array = new Uint8Array(8)
	for (let __goscriptRangeTarget0 = Linkinfo.Sects, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let sect = __goscriptRangeTarget0[__rangeIndex]
		let n = $.uint($.uint($.uint64Sub((sect.End as any), (sect.Start as any)), 64), 64)
		byteorder.BEPutUint64($.goSlice(nbuf, undefined, undefined), $.uint64(n))
		await $.pointerValue<Exclude<io.Writer, null>>(w).Write($.goSlice(nbuf, undefined, undefined))
		await $.pointerValue<Exclude<io.Writer, null>>(w).Write((unsafe.Slice!(sect.Start, $.uint(n, 64)) as $.Slice<number>))
	}
	let sum: $.Slice<number> = await hmac.HMAC.prototype.Sum.call(h, null)

	if (!$.arrayEqual(($.sliceToArray<number>(sum, 32, "byte") as Uint8Array), Linkinfo.Sum)) {
		$.panic("fips140: verification mismatch")
	}

	// "The temporary value(s) generated during the integrity test of the
	// module’s software or firmware shall [05.10] be zeroised from the module
	// upon completion of the integrity test"
	$.clear(sum)
	$.clear($.goSlice(nbuf, undefined, undefined))
	await hmac.HMAC.prototype.Reset.call(h)

	if ($.stringEqual(godebug.Value("fips140"), "debug")) {
		$.println("fips140: verified code+data")
	}

	Verified = true
}

await __goscriptInit0()

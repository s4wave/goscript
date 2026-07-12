// Generated file based on cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import "@goscript/crypto/internal/fips140/check/index.js"

import * as errors from "@goscript/errors/index.js"

import * as aes from "@goscript/crypto/internal/fips140/aes/index.js"

import * as __goscript_ctrdrbg from "./ctrdrbg.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/errors/index.js"
import "@goscript/crypto/internal/fips140/aes/index.js"
import "./ctrdrbg.gs.ts"

async function __goscriptInit0(): globalThis.Promise<void> {
	// Per IG 10.3.A, Resolution 7: "A KAT of a DRBG may be performed by:
	// Instantiate with known data, Reseed with other known data, Generate and
	// then compare the result to a pre-computed value."
	await fips140.CAST("CTR_DRBG", $.functionValue((): $.GoError => {
		let entropy: $.VarRef<Uint8Array> | null = $.varRef(new Uint8Array([$.uint(0x01, 8), $.uint(0x02, 8), $.uint(0x03, 8), $.uint(0x04, 8), $.uint(0x05, 8), $.uint(0x06, 8), $.uint(0x07, 8), $.uint(0x08, 8), $.uint(0x09, 8), $.uint(0x0a, 8), $.uint(0x0b, 8), $.uint(0x0c, 8), $.uint(0x0d, 8), $.uint(0x0e, 8), $.uint(0x0f, 8), $.uint(0x10, 8), $.uint(0x11, 8), $.uint(0x12, 8), $.uint(0x13, 8), $.uint(0x14, 8), $.uint(0x15, 8), $.uint(0x16, 8), $.uint(0x17, 8), $.uint(0x18, 8), $.uint(0x19, 8), $.uint(0x1a, 8), $.uint(0x1b, 8), $.uint(0x1c, 8), $.uint(0x1d, 8), $.uint(0x1e, 8), $.uint(0x1f, 8), $.uint(0x20, 8), $.uint(0x21, 8), $.uint(0x22, 8), $.uint(0x23, 8), $.uint(0x24, 8), $.uint(0x25, 8), $.uint(0x26, 8), $.uint(0x27, 8), $.uint(0x28, 8), $.uint(0x29, 8), $.uint(0x2a, 8), $.uint(0x2b, 8), $.uint(0x2c, 8), $.uint(0x2d, 8), $.uint(0x2e, 8), $.uint(0x2f, 8), $.uint(0x30, 8)]))
		let reseedEntropy: $.VarRef<Uint8Array> | null = $.varRef(new Uint8Array([$.uint(0x31, 8), $.uint(0x32, 8), $.uint(0x33, 8), $.uint(0x34, 8), $.uint(0x35, 8), $.uint(0x36, 8), $.uint(0x37, 8), $.uint(0x38, 8), $.uint(0x39, 8), $.uint(0x3a, 8), $.uint(0x3b, 8), $.uint(0x3c, 8), $.uint(0x3d, 8), $.uint(0x3e, 8), $.uint(0x3f, 8), $.uint(0x40, 8), $.uint(0x41, 8), $.uint(0x42, 8), $.uint(0x43, 8), $.uint(0x44, 8), $.uint(0x45, 8), $.uint(0x46, 8), $.uint(0x47, 8), $.uint(0x48, 8), $.uint(0x49, 8), $.uint(0x4a, 8), $.uint(0x4b, 8), $.uint(0x4c, 8), $.uint(0x4d, 8), $.uint(0x4e, 8), $.uint(0x4f, 8), $.uint(0x50, 8), $.uint(0x51, 8), $.uint(0x52, 8), $.uint(0x53, 8), $.uint(0x54, 8), $.uint(0x55, 8), $.uint(0x56, 8), $.uint(0x57, 8), $.uint(0x58, 8), $.uint(0x59, 8), $.uint(0x5a, 8), $.uint(0x5b, 8), $.uint(0x5c, 8), $.uint(0x5d, 8), $.uint(0x5e, 8), $.uint(0x5f, 8), $.uint(0x60, 8)]))
		let additionalInput: $.VarRef<Uint8Array> | null = $.varRef(new Uint8Array([$.uint(0x61, 8), $.uint(0x62, 8), $.uint(0x63, 8), $.uint(0x64, 8), $.uint(0x65, 8), $.uint(0x66, 8), $.uint(0x67, 8), $.uint(0x68, 8), $.uint(0x69, 8), $.uint(0x6a, 8), $.uint(0x6b, 8), $.uint(0x6c, 8), $.uint(0x6d, 8), $.uint(0x6e, 8), $.uint(0x6f, 8), $.uint(0x70, 8), $.uint(0x71, 8), $.uint(0x72, 8), $.uint(0x73, 8), $.uint(0x74, 8), $.uint(0x75, 8), $.uint(0x76, 8), $.uint(0x77, 8), $.uint(0x78, 8), $.uint(0x79, 8), $.uint(0x7a, 8), $.uint(0x7b, 8), $.uint(0x7c, 8), $.uint(0x7d, 8), $.uint(0x7e, 8), $.uint(0x7f, 8), $.uint(0x80, 8), $.uint(0x81, 8), $.uint(0x82, 8), $.uint(0x83, 8), $.uint(0x84, 8), $.uint(0x85, 8), $.uint(0x86, 8), $.uint(0x87, 8), $.uint(0x88, 8), $.uint(0x89, 8), $.uint(0x8a, 8), $.uint(0x8b, 8), $.uint(0x8c, 8), $.uint(0x8d, 8), $.uint(0x8e, 8), $.uint(0x8f, 8), $.uint(0x90, 8)]))
		let want: $.Slice<number> = new Uint8Array([110, 110, 71, 157, 36, 248, 106, 59, 119, 135, 168, 248, 24, 109, 152, 90, 83, 190, 190, 237, 222, 171, 146, 40, 240, 244, 172, 110, 16, 191, 1, 147]) as $.Slice<number>
		let c: __goscript_ctrdrbg.Counter | $.VarRef<__goscript_ctrdrbg.Counter> | null = __goscript_ctrdrbg.NewCounter(entropy)
		__goscript_ctrdrbg.Counter.prototype.Reseed.call(c, reseedEntropy, additionalInput)
		let got: $.Slice<number> = $.makeSlice<number>($.len(want), undefined, "byte")
		__goscript_ctrdrbg.Counter.prototype.Generate.call(c, got, additionalInput)
		if (!bytes.Equal(got, want)) {
			return errors.New("unexpected result")
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
}

await __goscriptInit0()

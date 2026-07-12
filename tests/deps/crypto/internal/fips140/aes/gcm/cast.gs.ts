// Generated file based on cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as aes from "@goscript/crypto/internal/fips140/aes/index.js"

import "@goscript/crypto/internal/fips140/check/index.js"

import * as errors from "@goscript/errors/index.js"

import * as __goscript_cmac from "./cmac.gs.ts"

import * as __goscript_ctrkdf from "./ctrkdf.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/aes/index.js"
import "@goscript/errors/index.js"
import "./cmac.gs.ts"
import "./ctrkdf.gs.ts"

async function __goscriptInit0(): globalThis.Promise<void> {
	// Counter KDF covers CMAC per IG 10.3.B, and CMAC covers GCM per IG 10.3.A
	// Resolution 1.d(i). AES decryption is covered by the CBC CAST in package
	// crypto/internal/fips140/aes.
	await fips140.CAST("CounterKDF", $.functionValue((): $.GoError => {
		let key: $.Slice<number> = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) as $.Slice<number>
		let context = new Uint8Array([$.uint(0x21, 8), $.uint(0x22, 8), $.uint(0x23, 8), $.uint(0x24, 8), $.uint(0x25, 8), $.uint(0x26, 8), $.uint(0x27, 8), $.uint(0x28, 8), $.uint(0x29, 8), $.uint(0x2a, 8), $.uint(0x2b, 8), $.uint(0x2c, 8)])
		let want = new Uint8Array([$.uint(0xe6, 8), $.uint(0x86, 8), $.uint(0x96, 8), $.uint(0x97, 8), $.uint(0x08, 8), $.uint(0xfc, 8), $.uint(0x90, 8), $.uint(0x30, 8), $.uint(0x36, 8), $.uint(0x1c, 8), $.uint(0x65, 8), $.uint(0x94, 8), $.uint(0xb2, 8), $.uint(0x62, 8), $.uint(0xa5, 8), $.uint(0xf7, 8), $.uint(0xcb, 8), $.uint(0x9d, 8), $.uint(0x93, 8), $.uint(0x94, 8), $.uint(0xda, 8), $.uint(0xf1, 8), $.uint(0x94, 8), $.uint(0x09, 8), $.uint(0x6a, 8), $.uint(0x27, 8), $.uint(0x5e, 8), $.uint(0x85, 8), $.uint(0x22, 8), $.uint(0x5e, 8), $.uint(0x7a, 8), $.uint(0xee, 8)])
		let __goscriptTuple0: any = aes.New(key)
		let b: aes.Block | $.VarRef<aes.Block> | null = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			return err
		}
		let got = __goscript_ctrkdf.CounterKDF.prototype.DeriveKey.call(__goscript_ctrkdf.NewCounterKDF(b), $.uint(0xFF, 8), context)
		if (!$.arrayEqual(got, want)) {
			return errors.New("unexpected result")
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
}

await __goscriptInit0()

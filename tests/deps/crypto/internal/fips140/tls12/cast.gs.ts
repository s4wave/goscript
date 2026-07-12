// Generated file based on cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import "@goscript/crypto/internal/fips140/check/index.js"

import * as sha256 from "@goscript/crypto/internal/fips140/sha256/index.js"

import * as errors from "@goscript/errors/index.js"

import type * as io from "@goscript/io/index.js"

import * as __goscript_tls12 from "./tls12.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/sha256/index.js"
import "@goscript/errors/index.js"
import "./tls12.gs.ts"

async function __goscriptInit0(): globalThis.Promise<void> {
	await fips140.CAST("TLSv1.2-SHA2-256", $.functionValue(async (): globalThis.Promise<$.GoError> => {
		let input: $.Slice<number> = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) as $.Slice<number>
		let transcript: $.Slice<number> = new Uint8Array([17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]) as $.Slice<number>
		let want: $.Slice<number> = new Uint8Array([140, 62, 237, 167, 28, 27, 76, 192, 160, 68, 144, 117, 168, 142, 188, 124, 94, 28, 75, 30, 79, 227, 193, 6, 235, 220, 192, 93, 192, 200, 236, 243, 226, 185, 209, 3, 94, 178, 96, 93, 18, 104, 79, 73, 223, 169, 157, 204]) as $.Slice<number>
		{
			let got: $.Slice<number> = await __goscript_tls12.MasterSecret(undefined, sha256.New, input, transcript)
			if (!bytes.Equal(got, want)) {
				return errors.New("unexpected result")
			}
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
}

await __goscriptInit0()

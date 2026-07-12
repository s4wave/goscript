// Generated file based on cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as sha256 from "@goscript/crypto/internal/fips140/sha256/index.js"

import * as errors from "@goscript/errors/index.js"

import * as hash from "@goscript/hash/index.js"

import type * as io from "@goscript/io/index.js"

import * as __goscript_hmac from "./hmac.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/sha256/index.js"
import "@goscript/errors/index.js"
import "@goscript/hash/index.js"
import "./hmac.gs.ts"

async function __goscriptInit0(): globalThis.Promise<void> {
	await fips140.CAST("HMAC-SHA2-256", $.functionValue(async (): globalThis.Promise<$.GoError> => {
		let input: $.Slice<number> = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) as $.Slice<number>
		let want: $.Slice<number> = new Uint8Array([240, 141, 130, 141, 76, 158, 173, 61, 220, 18, 156, 78, 112, 196, 25, 42, 79, 18, 115, 35, 115, 119, 102, 5, 16, 238, 87, 107, 58, 199, 20, 65]) as $.Slice<number>
		let h: __goscript_hmac.HMAC | $.VarRef<__goscript_hmac.HMAC> | null = await __goscript_hmac.New(undefined, sha256.New, input)
		await __goscript_hmac.HMAC.prototype.Write.call(h, input)
		await __goscript_hmac.HMAC.prototype.Write.call(h, input)
		{
			let got: $.Slice<number> = await __goscript_hmac.HMAC.prototype.Sum.call(h, null)
			if (!bytes.Equal(got, want)) {
				return errors.New("unexpected result")
			}
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
}

await __goscriptInit0()

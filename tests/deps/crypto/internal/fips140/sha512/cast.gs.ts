// Generated file based on cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as errors from "@goscript/errors/index.js"

import type * as hash from "@goscript/hash/index.js"

import * as __goscript_sha512 from "./sha512.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/errors/index.js"
import "./sha512.gs.ts"

async function __goscriptInit0(): globalThis.Promise<void> {
	await fips140.CAST("SHA2-512", $.functionValue((): $.GoError => {
		let input: $.Slice<number> = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) as $.Slice<number>
		let want: $.Slice<number> = new Uint8Array([180, 196, 224, 70, 130, 107, 210, 97, 144, 208, 151, 21, 252, 49, 244, 230, 167, 40, 32, 78, 173, 209, 18, 144, 91, 8, 177, 75, 127, 21, 196, 243, 142, 41, 178, 252, 84, 38, 90, 18, 99, 38, 197, 189, 234, 102, 193, 176, 142, 158, 71, 114, 59, 45, 112, 6, 90, 193, 38, 46, 204, 55, 191, 177]) as $.Slice<number>
		let h: __goscript_sha512.Digest | $.VarRef<__goscript_sha512.Digest> | null = __goscript_sha512.New()
		__goscript_sha512.Digest.prototype.Write.call(h, input)
		{
			let got: $.Slice<number> = __goscript_sha512.Digest.prototype.Sum.call(h, null)
			if (!bytes.Equal(got, want)) {
				return errors.New("unexpected result")
			}
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
}

await __goscriptInit0()

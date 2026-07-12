// Generated file based on cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as errors from "@goscript/errors/index.js"

import type * as hash from "@goscript/hash/index.js"

import * as __goscript_sha256 from "./sha256.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/errors/index.js"
import "./sha256.gs.ts"

async function __goscriptInit0(): globalThis.Promise<void> {
	await fips140.CAST("SHA2-256", $.functionValue((): $.GoError => {
		let input: $.Slice<number> = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) as $.Slice<number>
		let want: $.Slice<number> = new Uint8Array([93, 251, 171, 238, 223, 49, 139, 243, 60, 9, 39, 196, 61, 118, 48, 245, 27, 130, 243, 81, 116, 3, 1, 53, 79, 163, 215, 252, 81, 240, 19, 46]) as $.Slice<number>
		let h: __goscript_sha256.Digest | $.VarRef<__goscript_sha256.Digest> | null = __goscript_sha256.New()
		__goscript_sha256.Digest.prototype.Write.call(h, input)
		{
			let got: $.Slice<number> = __goscript_sha256.Digest.prototype.Sum.call(h, null)
			if (!bytes.Equal(got, want)) {
				return errors.New("unexpected result")
			}
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
}

await __goscriptInit0()

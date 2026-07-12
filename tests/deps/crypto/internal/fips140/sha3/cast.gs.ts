// Generated file based on cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as errors from "@goscript/errors/index.js"

import * as __goscript_sha3 from "./sha3.gs.ts"

import * as __goscript_sha3_noasm from "./sha3_noasm.gs.ts"

import * as __goscript_shake from "./shake.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/errors/index.js"
import "./sha3.gs.ts"
import "./sha3_noasm.gs.ts"
import "./shake.gs.ts"

async function __goscriptInit0(): globalThis.Promise<void> {
	await fips140.CAST("cSHAKE128", $.functionValue((): $.GoError => {
		let input: $.Slice<number> = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) as $.Slice<number>
		let want: $.Slice<number> = new Uint8Array([210, 23, 55, 57, 246, 161, 228, 110, 129, 229, 112, 227, 27, 16, 76, 130, 197, 72, 238, 230, 9, 245, 137, 82, 82, 164, 105, 212, 208, 118, 104, 107]) as $.Slice<number>
		let h: __goscript_shake.SHAKE | $.VarRef<__goscript_shake.SHAKE> | null = __goscript_shake.NewCShake128(input, input)
		__goscript_shake.SHAKE.prototype.Write.call(h, input)
		{
			let got: $.Slice<number> = __goscript_shake.SHAKE.prototype.Sum.call(h, null)
			if (!bytes.Equal(got, want)) {
				return errors.New("unexpected result")
			}
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
}

await __goscriptInit0()

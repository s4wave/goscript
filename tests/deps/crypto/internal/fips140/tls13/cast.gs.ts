// Generated file based on cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import "@goscript/crypto/internal/fips140/check/index.js"

import * as sha256 from "@goscript/crypto/internal/fips140/sha256/index.js"

import * as errors from "@goscript/errors/index.js"

import type * as hash from "@goscript/hash/index.js"

import type * as io from "@goscript/io/index.js"

import * as __goscript_tls13 from "./tls13.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/sha256/index.js"
import "@goscript/errors/index.js"
import "./tls13.gs.ts"

async function __goscriptInit0(): globalThis.Promise<void> {
	await fips140.CAST("TLSv1.3-SHA2-256", $.functionValue(async (): globalThis.Promise<$.GoError> => {
		let input: $.Slice<number> = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) as $.Slice<number>
		let want: $.Slice<number> = new Uint8Array([120, 32, 113, 117, 82, 253, 71, 103, 225, 7, 92, 131, 116, 46, 73, 67, 247, 227, 8, 106, 42, 203, 150, 199, 163, 31, 227, 35, 86, 110, 20, 91]) as $.Slice<number>
		let es: __goscript_tls13.EarlySecret | $.VarRef<__goscript_tls13.EarlySecret> | null = await __goscript_tls13.NewEarlySecret(undefined, sha256.New, null)
		let hs: __goscript_tls13.HandshakeSecret | $.VarRef<__goscript_tls13.HandshakeSecret> | null = await __goscript_tls13.EarlySecret.prototype.HandshakeSecret.call(es, null)
		let ms: __goscript_tls13.MasterSecret | $.VarRef<__goscript_tls13.MasterSecret> | null = await __goscript_tls13.HandshakeSecret.prototype.MasterSecret.call(hs)
		let transcript: sha256.Digest | $.VarRef<sha256.Digest> | null = sha256.New()
		sha256.Digest.prototype.Write.call(transcript, input)
		{
			let got: $.Slice<number> = await __goscript_tls13.MasterSecret.prototype.ResumptionMasterSecret.call(ms, $.interfaceValue<hash.Hash | null>(transcript, "*sha256.Digest", { kind: $.TypeKind.Pointer, elemType: "sha256.Digest" }))
			if (!bytes.Equal(got, want)) {
				return errors.New("unexpected result")
			}
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
}

await __goscriptInit0()

// Generated file based on hash.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fsha3 from "@goscript/crypto/internal/fips140/sha3/index.js"

import * as sha32 from "@goscript/crypto/sha3/index.js"

import * as hash from "@goscript/hash/index.js"

import "@goscript/unsafe/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/crypto/internal/fips140/sha3/index.js"
import "@goscript/crypto/sha3/index.js"
import "@goscript/hash/index.js"

export function sha3Unwrap(_p0: sha32.SHA3 | $.VarRef<sha32.SHA3> | null): fsha3.Digest | $.VarRef<fsha3.Digest> | null {
	return null! as fsha3.Digest | $.VarRef<fsha3.Digest> | null
}

export function Unwrap(h: hash.Hash | null): hash.Hash | null {
	{
		let __goscriptTuple0: any = $.typeAssertTuple<sha32.SHA3 | $.VarRef<sha32.SHA3> | null>(h, { kind: $.TypeKind.Pointer, elemType: "sha3.SHA3" })
		let __goscriptShadow0: sha32.SHA3 | $.VarRef<sha32.SHA3> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (ok) {
			return $.interfaceValue<hash.Hash | null>(sha3Unwrap(__goscriptShadow0), "*sha3.Digest", { kind: $.TypeKind.Pointer, elemType: "sha3.Digest" })
		}
	}
	return h
}

export async function UnwrapNew(__typeArgs: $.GenericTypeArgs | undefined, newHash: (() => any | globalThis.Promise<any>) | null): globalThis.Promise<(() => hash.Hash | null | globalThis.Promise<hash.Hash | null>) | null> {
	return $.functionValue(async (): globalThis.Promise<hash.Hash | null> => {
		return Unwrap((await newHash!() as hash.Hash | null))
	}, ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo))
}

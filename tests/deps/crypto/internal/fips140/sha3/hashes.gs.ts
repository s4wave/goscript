// Generated file based on hashes.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_sha3 from "./sha3.gs.ts"

import * as __goscript_sha3_noasm from "./sha3_noasm.gs.ts"
import "./sha3.gs.ts"
import "./sha3_noasm.gs.ts"

export const dsbyteSHA3: number = 6

export const dsbyteKeccak: number = 1

export const dsbyteShake: number = 31

export const dsbyteCShake: number = 4

export const rateK256: number = 168

export const rateK448: number = 144

export const rateK512: number = 136

export const rateK768: number = 104

export const rateK1024: number = 72

export function New224(): __goscript_sha3.Digest | $.VarRef<__goscript_sha3.Digest> | null {
	return new __goscript_sha3.Digest({rate: 144, outputLen: 28, dsbyte: $.uint(6, 8)})
}

export function New256(): __goscript_sha3.Digest | $.VarRef<__goscript_sha3.Digest> | null {
	return new __goscript_sha3.Digest({rate: 136, outputLen: 32, dsbyte: $.uint(6, 8)})
}

export function New384(): __goscript_sha3.Digest | $.VarRef<__goscript_sha3.Digest> | null {
	return new __goscript_sha3.Digest({rate: 104, outputLen: 48, dsbyte: $.uint(6, 8)})
}

export function New512(): __goscript_sha3.Digest | $.VarRef<__goscript_sha3.Digest> | null {
	return new __goscript_sha3.Digest({rate: 72, outputLen: 64, dsbyte: $.uint(6, 8)})
}

export function NewLegacyKeccak256(): __goscript_sha3.Digest | $.VarRef<__goscript_sha3.Digest> | null {
	return new __goscript_sha3.Digest({rate: 136, outputLen: 32, dsbyte: $.uint(1, 8)})
}

export function NewLegacyKeccak512(): __goscript_sha3.Digest | $.VarRef<__goscript_sha3.Digest> | null {
	return new __goscript_sha3.Digest({rate: 72, outputLen: 64, dsbyte: $.uint(1, 8)})
}

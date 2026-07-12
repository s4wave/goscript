// Generated file based on sha3_noasm.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_keccakf from "./keccakf.gs.ts"

import * as __goscript_sha3 from "./sha3.gs.ts"
import "./keccakf.gs.ts"
import "./sha3.gs.ts"

export function keccakF1600(a: $.VarRef<Uint8Array> | null): void {
	__goscript_keccakf.keccakF1600Generic(a)
}

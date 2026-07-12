// Generated file based on sha256block_noasm.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as hash from "@goscript/hash/index.js"

import type * as __goscript_sha256 from "./sha256.gs.ts"

import * as __goscript_sha256block from "./sha256block.gs.ts"
import "./sha256block.gs.ts"

export function block(dig: __goscript_sha256.Digest | $.VarRef<__goscript_sha256.Digest> | null, p: $.Slice<number>): void {
	__goscript_sha256block.blockGeneric(dig, p)
}

// Generated file based on sha512block_noasm.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as hash from "@goscript/hash/index.js"

import type * as __goscript_sha512 from "./sha512.gs.ts"

import * as __goscript_sha512block from "./sha512block.gs.ts"
import "./sha512block.gs.ts"

export function block(dig: __goscript_sha512.Digest | $.VarRef<__goscript_sha512.Digest> | null, p: $.Slice<number>): void {
	__goscript_sha512block.blockGeneric(dig, p)
}

// Generated file based on md5block_generic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as hash from "@goscript/hash/index.js"

import type * as __goscript_md5 from "./md5.gs.ts"

import * as __goscript_md5block from "./md5block.gs.ts"
import "./md5block.gs.ts"

export const haveAsm: boolean = false

export function block(dig: __goscript_md5.digest | $.VarRef<__goscript_md5.digest> | null, p: $.Slice<number>): void {
	__goscript_md5block.blockGeneric(dig, p)
}

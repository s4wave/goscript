// Generated file based on cbc_noasm.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_aes from "./aes.gs.js"

import * as __goscript_aes_noasm from "./aes_noasm.gs.js"

import * as __goscript_cbc from "./cbc.gs.js"
import "./aes.gs.js"
import "./aes_noasm.gs.js"
import "./cbc.gs.js"

export function cryptBlocksEnc(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, civ: $.VarRef<Uint8Array> | null, dst: $.Slice<number>, src: $.Slice<number>): void {
	__goscript_cbc.cryptBlocksEncGeneric(b, civ, dst, src)
}

export function cryptBlocksDec(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, civ: $.VarRef<Uint8Array> | null, dst: $.Slice<number>, src: $.Slice<number>): void {
	__goscript_cbc.cryptBlocksDecGeneric(b, civ, dst, src)
}

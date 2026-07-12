// Generated file based on ctr_noasm.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_aes from "./aes.gs.ts"

import * as __goscript_aes_noasm from "./aes_noasm.gs.ts"

import * as __goscript_ctr from "./ctr.gs.ts"
import "./aes.gs.ts"
import "./aes_noasm.gs.ts"
import "./ctr.gs.ts"

export function ctrBlocks1(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, dst: $.VarRef<Uint8Array> | null, src: $.VarRef<Uint8Array> | null, ivlo: bigint, ivhi: bigint): void {
	__goscript_ctr.ctrBlocks(b, $.goSlice($.pointerValue<Uint8Array>(dst), undefined, undefined), $.goSlice($.pointerValue<Uint8Array>(src), undefined, undefined), ivlo, ivhi)
}

export function ctrBlocks2(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, dst: $.VarRef<Uint8Array> | null, src: $.VarRef<Uint8Array> | null, ivlo: bigint, ivhi: bigint): void {
	__goscript_ctr.ctrBlocks(b, $.goSlice($.pointerValue<Uint8Array>(dst), undefined, undefined), $.goSlice($.pointerValue<Uint8Array>(src), undefined, undefined), ivlo, ivhi)
}

export function ctrBlocks4(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, dst: $.VarRef<Uint8Array> | null, src: $.VarRef<Uint8Array> | null, ivlo: bigint, ivhi: bigint): void {
	__goscript_ctr.ctrBlocks(b, $.goSlice($.pointerValue<Uint8Array>(dst), undefined, undefined), $.goSlice($.pointerValue<Uint8Array>(src), undefined, undefined), ivlo, ivhi)
}

export function ctrBlocks8(b: __goscript_aes.Block | $.VarRef<__goscript_aes.Block> | null, dst: $.VarRef<Uint8Array> | null, src: $.VarRef<Uint8Array> | null, ivlo: bigint, ivhi: bigint): void {
	__goscript_ctr.ctrBlocks(b, $.goSlice($.pointerValue<Uint8Array>(dst), undefined, undefined), $.goSlice($.pointerValue<Uint8Array>(src), undefined, undefined), ivlo, ivhi)
}

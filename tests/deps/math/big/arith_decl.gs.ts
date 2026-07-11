// Generated file based on arith_decl.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import "@goscript/unsafe/index.js"

import type * as __goscript_arith from "./arith.gs.ts"

export function addVV(z: $.Slice<__goscript_arith.Word>, x: $.Slice<__goscript_arith.Word>, y: $.Slice<__goscript_arith.Word>): __goscript_arith.Word {
	let c: __goscript_arith.Word = 0
	return 0
}

export function subVV(z: $.Slice<__goscript_arith.Word>, x: $.Slice<__goscript_arith.Word>, y: $.Slice<__goscript_arith.Word>): __goscript_arith.Word {
	let c: __goscript_arith.Word = 0
	return 0
}

export function shlVU(z: $.Slice<__goscript_arith.Word>, x: $.Slice<__goscript_arith.Word>, s: number): __goscript_arith.Word {
	let c: __goscript_arith.Word = 0
	if (s == 0) {
		$.copy(z, x)
		return 0
	}
	return lshVU(z, x, s)
}

export function lshVU(z: $.Slice<__goscript_arith.Word>, x: $.Slice<__goscript_arith.Word>, s: number): __goscript_arith.Word {
	let c: __goscript_arith.Word = 0
	return 0
}

export function rshVU(z: $.Slice<__goscript_arith.Word>, x: $.Slice<__goscript_arith.Word>, s: number): __goscript_arith.Word {
	let c: __goscript_arith.Word = 0
	return 0
}

export function mulAddVWW(z: $.Slice<__goscript_arith.Word>, x: $.Slice<__goscript_arith.Word>, m: __goscript_arith.Word, a: __goscript_arith.Word): __goscript_arith.Word {
	let c: __goscript_arith.Word = 0
	return 0
}

export function addMulVVW(z: $.Slice<__goscript_arith.Word>, x: $.Slice<__goscript_arith.Word>, y: __goscript_arith.Word): __goscript_arith.Word {
	let c: __goscript_arith.Word = 0
	return addMulVVWW(z, z, x, y, 0)
}

export function addMulVVWW(z: $.Slice<__goscript_arith.Word>, x: $.Slice<__goscript_arith.Word>, y: $.Slice<__goscript_arith.Word>, m: __goscript_arith.Word, a: __goscript_arith.Word): __goscript_arith.Word {
	let c: __goscript_arith.Word = 0
	return 0
}

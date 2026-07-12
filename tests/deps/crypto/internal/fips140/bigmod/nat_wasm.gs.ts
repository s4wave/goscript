// Generated file based on nat_wasm.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as unsafe from "@goscript/unsafe/index.js"

import * as __goscript_nat from "./nat.gs.ts"
import "@goscript/unsafe/index.js"
import "./nat.gs.ts"

export function idx(x: $.VarRef<number> | null, i: number): $.VarRef<number> | null {
	return ($.uint($.uint64Add(((x as any) as any), ($.uint($.uint64Mul(i, 8n), 64))), 64) as any)
}

export function addMulVVWWasm(z: $.VarRef<number> | null, x: $.VarRef<number> | null, y: number, n: number): number {
	let carry: number = 0
	const mask32: number = 4294967295
	let y0 = $.uint($.uint64And(y, 4294967295n), 64)
	let y1 = $.uint($.uint64Shr(y, 32n), 64)
	for (let i = 0; i < n; i++) {
		let xi = $.pointerValue<number>(idx(x, $.uint(i, 64)))
		let x0 = $.uint($.uint64And(xi, 4294967295n), 64)
		let x1 = $.uint($.uint64Shr(xi, 32n), 64)
		let zi = $.pointerValue<number>(idx(z, $.uint(i, 64)))
		let z0 = $.uint($.uint64And(zi, 4294967295n), 64)
		let z1 = $.uint($.uint64Shr(zi, 32n), 64)
		let c0 = $.uint($.uint64And(carry, 4294967295n), 64)
		let c1 = $.uint($.uint64Shr(carry, 32n), 64)

		let w00 = $.uint($.uint64Add(($.uint($.uint64Add(($.uint($.uint64Mul(x0, y0), 64)), z0), 64)), c0), 64)
		let l00 = $.uint($.uint64And(w00, 4294967295n), 64)
		let h00 = $.uint($.uint64Shr(w00, 32n), 64)

		let w01 = $.uint($.uint64Add(($.uint($.uint64Add(($.uint($.uint64Mul(x0, y1), 64)), z1), 64)), h00), 64)
		let l01 = $.uint($.uint64And(w01, 4294967295n), 64)
		let h01 = $.uint($.uint64Shr(w01, 32n), 64)

		let w10 = $.uint($.uint64Add(($.uint($.uint64Add(($.uint($.uint64Mul(x1, y0), 64)), c1), 64)), l01), 64)
		let h10 = $.uint($.uint64Shr(w10, 32n), 64)

		carry = $.uint($.uint64Add(($.uint($.uint64Add(($.uint($.uint64Mul(x1, y1), 64)), h10), 64)), h01), 64)
		idx(z, $.uint(i, 64))!.value = $.uint($.uint64Add(($.uint($.uint64Mul(w10, (2 ** 32)), 64)), l00), 64)
	}
	return carry
}

export function addMulVVW1024(z: $.VarRef<number> | null, x: $.VarRef<number> | null, y: number): number {
	let c: number = 0
	return addMulVVWWasm(z, x, y, $.uint($.uint($.uint64Div(1024n, 64n), 64), 64))
}

export function addMulVVW1536(z: $.VarRef<number> | null, x: $.VarRef<number> | null, y: number): number {
	let c: number = 0
	return addMulVVWWasm(z, x, y, $.uint($.uint($.uint64Div(1536n, 64n), 64), 64))
}

export function addMulVVW2048(z: $.VarRef<number> | null, x: $.VarRef<number> | null, y: number): number {
	let c: number = 0
	return addMulVVWWasm(z, x, y, $.uint($.uint($.uint64Div(2048n, 64n), 64), 64))
}

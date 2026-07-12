// Generated file based on xor_generic.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/runtime/index.js"
import "@goscript/unsafe/index.js"

export const wordSize: number = 8

export const supportsUnaligned: boolean = false

export function xorBytes(dstb: $.VarRef<number> | null, xb: $.VarRef<number> | null, yb: $.VarRef<number> | null, n: number): void {
	// xorBytes assembly is written using pointers and n. Back to slices.
	let dst: $.Slice<number> = (unsafe.Slice!(dstb, n) as $.Slice<number>)
	let x: $.Slice<number> = (unsafe.Slice!(xb, n) as $.Slice<number>)
	let y: $.Slice<number> = (unsafe.Slice!(yb, n) as $.Slice<number>)

	if (false || aligned(dstb, xb, yb)) {
		xorLoop({T: { type: { kind: $.TypeKind.Basic, name: "uintptr" }, zero: () => 0 }}, words(dst), words(x), words(y))
		if ($.uint(($.uint($.uint64Mod($.uint(n, 64), 8n), 64)), 64) == $.uint(0, 64)) {
			return
		}
		let done = n & ~($.int($.uint($.uint64Sub(8n, 1n), 64)))
		dst = $.goSlice(dst, done, undefined)
		x = $.goSlice(x, done, undefined)
		y = $.goSlice(y, done, undefined)
	}
	xorLoop({T: { type: { kind: $.TypeKind.Basic, name: "uint8" }, zero: () => 0 }}, dst, x, y)
}

export function aligned(dst: $.VarRef<number> | null, x: $.VarRef<number> | null, y: $.VarRef<number> | null): boolean {
	return $.uint(($.uint($.uint64And(($.uint($.uint64Or(($.uint($.uint64Or(((dst as any) as any), ((x as any) as any)), 64)), ((y as any) as any)), 64)), 7n), 64)), 64) == $.uint(0, 64)
}

export function words(x: $.Slice<number>): $.Slice<number> {
	let n = $.uint($.uint($.uint64Div($.uint($.len(x), 64), 8n), 64), 64)
	if ($.uint(n, 64) == $.uint(0, 64)) {
		// Avoid creating a *uintptr that refers to data smaller than a uintptr;
		// see issue 59334.
		return null
	}
	return (unsafe.Slice!(($.indexRef(x!, 0) as any), $.uint(n, 64)) as $.Slice<number>)
}

export function xorLoop<T>(__typeArgs: $.GenericTypeArgs | undefined, dst: $.Slice<T>, x: $.Slice<T>, y: $.Slice<T>): void {
	x = $.goSlice(x, undefined, $.len(dst))
	y = $.goSlice(y, undefined, $.len(dst))
	for (let __goscriptRangeTarget0 = dst, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		dst![i] = ($.arrayIndex(x!, i) as any) ^ ($.arrayIndex(y!, i) as any)
	}
}

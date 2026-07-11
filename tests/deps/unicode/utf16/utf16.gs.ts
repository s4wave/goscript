// Generated file based on utf16.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export const replacementChar: number = 65533

export const maxRune: number = 1114111

export const surr1: number = 55296

export const surr2: number = 56320

export const surr3: number = 57344

export const surrSelf: number = 65536

export function IsSurrogate(r: number): boolean {
	return ($.int(55296, 32) <= $.int(r, 32)) && ($.int(r, 32) < $.int(57344, 32))
}

export function DecodeRune(r1: number, r2: number): number {
	if (((($.int(55296, 32) <= $.int(r1, 32)) && ($.int(r1, 32) < $.int(56320, 32))) && ($.int(56320, 32) <= $.int(r2, 32))) && ($.int(r2, 32) < $.int(57344, 32))) {
		return $.int((((r1 - 55296) << 10) | (r2 - 56320)) + 65536, 32)
	}
	return $.int(65533, 32)
}

export function EncodeRune(r: number): [number, number] {
	let r1: number = 0
	let r2: number = 0
	if (($.int(r, 32) < $.int(65536, 32)) || ($.int(r, 32) > $.int(1114111, 32))) {
		return [$.int(65533, 32), $.int(65533, 32)]
	}
	r = r - ($.int(65536, 32))
	return [$.int(55296 + ((r >> 10) & 0x3ff), 32), $.int(56320 + (r & 0x3ff), 32)]
}

export function RuneLen(r: number): number {
	switch (true) {
		case ($.int(0, 32) <= $.int(r, 32)) && ($.int(r, 32) < $.int(55296, 32)):
		case ($.int(57344, 32) <= $.int(r, 32)) && ($.int(r, 32) < $.int(65536, 32)):
		{
			return 1
			break
		}
		case ($.int(65536, 32) <= $.int(r, 32)) && ($.int(r, 32) <= $.int(1114111, 32)):
		{
			return 2
			break
		}
		default:
		{
			return -1
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function Encode(s: $.Slice<number>): $.Slice<number> {
	let n = $.len(s)
	for (let __goscriptRangeTarget0 = s, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let v = __goscriptRangeTarget0![__rangeIndex]
		if ($.int(v, 32) >= $.int(65536, 32)) {
			n++
		}
	}

	let a: $.Slice<number> = $.makeSlice<number>(n, undefined, "number")
	n = 0
	for (let __goscriptRangeTarget1 = s, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let v = __goscriptRangeTarget1![__rangeIndex]
		switch (RuneLen($.int(v, 32))) {
			case 1:
			{
				a![n] = $.uint($.uint(v, 16), 16)
				n++
				break
			}
			case 2:
			{
				let __goscriptTuple0: any = EncodeRune($.int(v, 32))
				let r1 = $.int(__goscriptTuple0[0], 32)
				let r2 = $.int(__goscriptTuple0[1], 32)
				a![n] = $.uint($.uint(r1, 16), 16)
				a![n + 1] = $.uint($.uint(r2, 16), 16)
				n = n + (2)
				break
			}
			default:
			{
				a![n] = $.uint($.uint(65533, 16), 16)
				n++
				break
			}
		}
	}
	return $.goSlice(a, undefined, n)
}

export function AppendRune(a: $.Slice<number>, r: number): $.Slice<number> {
	// This function is inlineable for fast handling of ASCII.
	switch (true) {
		case ($.int(0, 32) <= $.int(r, 32)) && ($.int(r, 32) < $.int(55296, 32)):
		case ($.int(57344, 32) <= $.int(r, 32)) && ($.int(r, 32) < $.int(65536, 32)):
		{
			return $.append(a, $.uint($.uint(r, 16), 16))
			break
		}
		case ($.int(65536, 32) <= $.int(r, 32)) && ($.int(r, 32) <= $.int(1114111, 32)):
		{
			let __goscriptTuple1: any = EncodeRune($.int(r, 32))
			let r1 = $.int(__goscriptTuple1[0], 32)
			let r2 = $.int(__goscriptTuple1[1], 32)
			return $.append(a, $.uint($.uint(r1, 16), 16), $.uint($.uint(r2, 16), 16))
			break
		}
	}
	return $.append(a, $.uint(65533, 16))
}

export function Decode(s: $.Slice<number>): $.Slice<number> {
	// Preallocate capacity to hold up to 64 runes.
	// Decode inlines, so the allocation can live on the stack.
	let buf: $.Slice<number> = $.makeSlice<number>(0, 64, "number")
	return decode(s, buf)
}

export function decode(s: $.Slice<number>, buf: $.Slice<number>): $.Slice<number> {
	for (let i = 0; i < $.len(s); i++) {
		let ar: number = 0
		{
			let r = $.uint($.arrayIndex(s!, i), 16)
			switch (true) {
				case $.uint(r, 16) < $.uint(55296, 16):
				case $.uint(57344, 16) <= $.uint(r, 16):
				{
					ar = $.int($.int(r, 32), 32)
					break
				}
				case (((($.uint(55296, 16) <= $.uint(r, 16)) && ($.uint(r, 16) < $.uint(56320, 16))) && ((i + 1) < $.len(s))) && ($.uint(56320, 16) <= $.uint($.arrayIndex(s!, i + 1), 16))) && ($.uint($.arrayIndex(s!, i + 1), 16) < $.uint(57344, 16)):
				{
					ar = $.int(DecodeRune($.int($.int(r, 32), 32), $.int($.int($.arrayIndex(s!, i + 1), 32), 32)), 32)
					i++
					break
				}
				default:
				{
					ar = $.int(65533, 32)
					break
				}
			}
		}
		buf = $.append(buf, $.int(ar, 32))
	}
	return buf
}

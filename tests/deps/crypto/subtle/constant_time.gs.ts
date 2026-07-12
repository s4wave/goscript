// Generated file based on constant_time.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as constanttime from "@goscript/crypto/internal/constanttime/index.js"

import * as subtle from "@goscript/crypto/internal/fips140/subtle/index.js"
import "@goscript/crypto/internal/constanttime/index.js"
import "@goscript/crypto/internal/fips140/subtle/index.js"

export function ConstantTimeCompare(x: $.Slice<number>, y: $.Slice<number>): number {
	return subtle.ConstantTimeCompare(x, y)
}

export function ConstantTimeSelect(v: number, x: number, y: number): number {
	return constanttime.Select(v, x, y)
}

export function ConstantTimeByteEq(x: number, y: number): number {
	return constanttime.ByteEq($.uint(x, 8), $.uint(y, 8))
}

export function ConstantTimeEq(x: number, y: number): number {
	return constanttime.Eq($.int(x, 32), $.int(y, 32))
}

export function ConstantTimeCopy(v: number, x: $.Slice<number>, y: $.Slice<number>): void {
	subtle.ConstantTimeCopy(v, x, y)
}

export function ConstantTimeLessOrEq(x: number, y: number): number {
	return constanttime.LessOrEq(x, y)
}

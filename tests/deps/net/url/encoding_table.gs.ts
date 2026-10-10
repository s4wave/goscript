// Generated file based on encoding_table.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type encoding = number

export const encodePath: encoding = 1

export const encodePathSegment: encoding = 2

export const encodeHost: encoding = 4

export const encodeZone: encoding = 8

export const encodeUserPassword: encoding = 16

export const encodeQueryComponent: encoding = 32

export const encodeFragment: encoding = 64

export const hexChar: encoding = 128

export let table: Uint8Array = $.arrayValue(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 76, 12, 0, 95, 0, 95, 12, 76, 76, 76, 95, 93, 127, 127, 65, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 79, 93, 12, 95, 12, 64, 67, 255, 255, 255, 255, 255, 255, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 12, 0, 12, 0, 127, 0, 255, 255, 255, 255, 255, 255, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 127, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))

export function __goscript_set_table(__goscriptValue: Uint8Array): void {
	table = __goscriptValue
}

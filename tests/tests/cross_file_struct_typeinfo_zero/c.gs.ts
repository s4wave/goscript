// Generated file based on c.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import type * as __goscript_a from "./a.gs.ts"
import * as __goscript_b from "./b.gs.ts"

export var cTable: $.Slice<__goscript_b.bValue>

export function __goscript_init_cTable(): void {
	if (((cTable) as any) === undefined) {
		cTable = $.arrayToSlice<__goscript_b.bValue>([new __goscript_b.bValue(true), new __goscript_b.bValue(true)])
	}
}

export function __goscript_get_cTable(): $.Slice<__goscript_b.bValue> {
	if (((cTable) as any) === undefined) {
		__goscript_init_cTable()
	}
	return cTable
}

export function __goscript_set_cTable(__goscriptValue: $.Slice<__goscript_b.bValue>): void {
	cTable = __goscriptValue
}

export var cCopy: $.Slice<__goscript_b.bValue>

export function __goscript_init_cCopy(): void {
	if (((cCopy) as any) === undefined) {
		cCopy = __goscript_get_cTable()
	}
}

export function __goscript_get_cCopy(): $.Slice<__goscript_b.bValue> {
	if (((cCopy) as any) === undefined) {
		__goscript_init_cCopy()
	}
	return cCopy
}

export function __goscript_set_cCopy(__goscriptValue: $.Slice<__goscript_b.bValue>): void {
	cCopy = __goscriptValue
}

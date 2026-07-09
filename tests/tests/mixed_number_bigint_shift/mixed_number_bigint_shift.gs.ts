// Generated file based on mixed_number_bigint_shift.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as binary from "@goscript/encoding/binary/index.js"
import "@goscript/encoding/binary/index.js"

export function nonZero(buf: Uint8Array): number {
	let ret = $.uint64Or(($.uint64Or(($.uint64Or($.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(buf, 0, 8)), $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(buf, 8, 16)))), $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(buf, 16, 24)))), $.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).Uint64($.goSlice(buf, 24, 32)))
	ret = $.uint64Or(ret, $.uint64Shr(ret, 32n))
	ret = $.uint64Or(ret, $.uint64Shr(ret, 16n))
	ret = $.uint64Or(ret, $.uint64Shr(ret, 8n))
	ret = $.uint64Or(ret, $.uint64Shr(ret, 4n))
	ret = $.uint64Or(ret, $.uint64Shr(ret, 2n))
	ret = $.uint64Or(ret, $.uint64Shr(ret, 1n))
	return $.int($.int($.uint64And(ret, 1n), 32), 32)
}

export async function main(): globalThis.Promise<void> {
	$.println($.int(nonZero(new Uint8Array(32)), 32))
	$.println($.int(nonZero(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, $.uint(1, 8)])), 32))
}

if ($.isMainScript(import.meta)) {
	await main()
}

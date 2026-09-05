// Generated file based on string_index_access.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export const lookup: string = $.bytesToString(new Uint8Array([0, 255, 7, 228, 189, 160]))

export async function main(): globalThis.Promise<void> {
	let myStr1 = "testing"
	await $.println("Byte from myStr1[0]:", $.uint($.indexStringOrBytes(myStr1, 0), 8))
	await $.println("Byte from myStr1[2]:", $.uint($.indexStringOrBytes(myStr1, 2), 8))
	await $.println("Byte from myStr1[6]:", $.uint($.indexStringOrBytes(myStr1, 6), 8))

	let myStr2 = "你好世界"
	// String indexing returns UTF-8 bytes, not Unicode code points.
	await $.println("Byte from myStr2[0]:", $.uint($.indexStringOrBytes(myStr2, 0), 8))
	await $.println("Byte from myStr2[1]:", $.uint($.indexStringOrBytes(myStr2, 1), 8))
	await $.println("Byte from myStr2[2]:", $.uint($.indexStringOrBytes(myStr2, 2), 8))
	await $.println("Byte from myStr2[3]:", $.uint($.indexStringOrBytes(myStr2, 3), 8))

	// Constant lookup tables preserve invalid UTF-8 and control bytes.
	for (let i = 0; i < 6; i++) {
		await $.println("constant byte", $.uint($.indexByteString("\x00\xff\x07\xe4\xbd\xa0", i), 8))
	}
	await checkBounds(-1)
	await checkBounds(6)
}

export async function checkBounds(index: number): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			await $.println("out of bounds", $.recover() != null)
		})() })
		await $.println($.uint($.indexByteString("\x00\xff\x07\xe4\xbd\xa0", index), 8))
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

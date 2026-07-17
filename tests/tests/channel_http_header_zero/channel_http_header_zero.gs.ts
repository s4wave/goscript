// Generated file based on channel_http_header_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as http from "@goscript/net/http/index.js"
import "@goscript/net/http/index.js"

export async function main(): globalThis.Promise<void> {
	let channel: $.Channel<http.Header> | null = $.makeChannel<http.Header>(1, null! as http.Header, "both")
	channel!.close()
	let __goscriptRecv0 = await $.chanRecvWithOk(channel)
	let header: http.Header = __goscriptRecv0.value
	let ok = __goscriptRecv0.ok
	$.println(header == null, ok)
}

if ($.isMainScript(import.meta)) {
	await main()
}

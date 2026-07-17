// Generated file based on net_http_header_struct_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as http from "@goscript/net/http/index.js"
import "@goscript/net/http/index.js"

export class responseWriter {
	public get header(): http.Header {
		return this._fields.header.value
	}
	public set header(value: http.Header) {
		this._fields.header.value = value
	}

	public _fields: {
		header: $.VarRef<http.Header>
	}

	constructor(init?: Partial<{header?: http.Header}>) {
		this._fields = {
			header: $.varRef(init?.header ?? (null! as http.Header))
		}
	}

	public clone(): responseWriter {
		const cloned = new responseWriter()
		cloned._fields = {
			header: $.varRef(this._fields.header.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Header(): http.Header {
		const w: responseWriter | $.VarRef<responseWriter> | null = this
		return $.pointerValue<responseWriter>(w).header
	}

	static __typeInfo = $.registerStructType(
		"main.responseWriter",
		() => new responseWriter(),
		[{ name: "Header", args: [], returns: [{ type: "http.Header" }] }],
		responseWriter,
		[{ name: "header", key: "header", type: "http.Header" }]
	)
}

export async function main(): globalThis.Promise<void> {
	let writer: responseWriter | $.VarRef<responseWriter> | null = new responseWriter({header: new globalThis.Map<string, $.Slice<string>>([])})
	http.Header_Set(responseWriter.prototype.Header.call(writer), "X-Test", "ok")
	$.println(await http.Header_Get(responseWriter.prototype.Header.call(writer), "x-test"))
}

if ($.isMainScript(import.meta)) {
	await main()
}

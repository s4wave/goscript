// Generated file based on net_http_header_struct_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as http from "@goscript/net/http/index.js"
import "@goscript/net/http/index.js"

export class responseWriter {
	public declare header: http.Header

	public _fields: {
		header: http.Header
	}

	constructor(init?: Partial<{header?: http.Header}>) {
		this._fields = {
			header: init?.header ?? (null! as http.Header)
		}
	}

	public clone(): responseWriter {
		return $.markAsStructValue(new responseWriter(this))
	}

	public Header(): http.Header {
		const w: responseWriter | $.VarRef<responseWriter> | null = this
		return $.pointerValue<responseWriter>(w).header
	}

	static {
		$.bindStructFields(this.prototype, ["header"])
	}

	static __typeInfo = $.registerStructType(
		"main.responseWriter",
		() => new responseWriter(),
		() => [{ name: "Header", args: [], returns: [{ type: "http.Header" }] }],
		responseWriter,
		() => [{ name: "header", key: "header", type: "http.Header" }]
	)
}

export async function main(): globalThis.Promise<void> {
	let writer: responseWriter | $.VarRef<responseWriter> | null = new responseWriter({header: $.makeMap<string, $.Slice<string>>([])})
	http.Header_Set(responseWriter.prototype.Header.call(writer), "X-Test", "ok")
	await $.println(await http.Header_Get(responseWriter.prototype.Header.call(writer), "x-test"))
}

if ($.isMainScript(import.meta)) {
	await main()
}

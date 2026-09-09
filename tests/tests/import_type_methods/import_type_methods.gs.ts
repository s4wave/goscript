// Generated file based on import_type_methods.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errlist from "@goscript/github.com/s4wave/goscript/tests/tests/import_type_methods/errlist/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/import_type_methods/errlist/index.js"

export class parser {
	public declare errors: errlist.ErrorList

	public _fields: {
		errors: errlist.ErrorList
	}

	constructor(init?: Partial<{errors?: errlist.ErrorList}>) {
		this._fields = {
			errors: init?.errors ?? (null! as errlist.ErrorList)
		}
	}

	public clone(): parser {
		return $.markAsStructValue(new parser(this))
	}

	static {
		$.bindStructFields(this.prototype, ["errors"])
	}

	static __typeInfo = $.registerStructType(
		"main.parser",
		() => new parser(),
		() => [],
		parser,
		() => [{ name: "errors", key: "errors", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"), "errlist.ErrorList") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let p: parser = $.markAsStructValue(new parser())
	p.errors = (errlist.ErrorList_Add(p.errors, "error") as errlist.ErrorList)
	await $.println($.arrayIndex(p.errors!, 0))
}

if ($.isMainScript(import.meta)) {
	await main()
}

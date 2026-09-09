// Generated file based on wrapper_slice_append.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errlist from "@goscript/github.com/s4wave/goscript/tests/tests/wrapper_slice_append/errlist/index.js"
import "@goscript/github.com/s4wave/goscript/tests/tests/wrapper_slice_append/errlist/index.js"

export class parser {
	public declare errors: errlist.ErrorList

	public declare astruct: errlist.AStruct

	public _fields: {
		errors: errlist.ErrorList
		astruct: errlist.AStruct
	}

	constructor(init?: Partial<{errors?: errlist.ErrorList, astruct?: errlist.AStruct}>) {
		this._fields = {
			errors: init?.errors ?? (null! as errlist.ErrorList),
			astruct: init?.astruct ? $.markAsStructValue($.cloneStructValue(init.astruct)) : $.markAsStructValue(new errlist.AStruct())
		}
	}

	public clone(): parser {
		return $.markAsStructValue(new parser(this))
	}

	static {
		$.bindStructFields(this.prototype, ["errors", "astruct"])
	}

	static __typeInfo = $.registerStructType(
		"main.parser",
		() => new parser(),
		() => [],
		parser,
		() => [{ name: "errors", key: "errors", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("string"), "errlist.ErrorList") }, { name: "astruct", key: "astruct", type: "errlist.AStruct" }]
	)
}

export async function main(): globalThis.Promise<void> {
	let p: parser = $.markAsStructValue(new parser())
	// this Add method does not work:
	errlist.ErrorList_Add($.fieldRef(p._fields, "errors"), "error")
	await $.println($.arrayIndex(p.errors!, 0))

	// but it does work for a struct type:
	p.astruct.Set("astruct")
	await $.println(p.astruct.Msg)
}

if ($.isMainScript(import.meta)) {
	await main()
}

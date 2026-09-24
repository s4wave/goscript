// Generated file based on package_import_text_tabwriter.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strings from "@goscript/strings/index.js"

import * as tabwriter from "@goscript/text/tabwriter/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/strings/index.js"
import "@goscript/text/tabwriter/index.js"

export async function main(): globalThis.Promise<void> {
	// Buffer multiple rows through the standard table formatter.
	let output: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	let writer: tabwriter.Writer | $.VarRef<tabwriter.Writer> | null = tabwriter.NewWriter($.interfaceValue<io.Writer | null>(output, "*strings.Builder", /* @__PURE__ */ $.pointerType("strings.Builder")), 0, 0, 2, 32, 0)
	{
		let [, err] = await tabwriter.Writer.prototype.Write.call(writer, new Uint8Array([73, 68, 9, 78, 65, 77, 69, 10, 49, 9, 67, 97, 110, 118, 97, 115, 10, 50, 50, 9, 83, 116, 111, 114, 101, 10]))
		if (err != null) {
			await $.println(await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}
	{
		let err = await tabwriter.Writer.prototype.Flush.call(writer)
		if (err != null) {
			await $.println(await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}

	// Print through the fixture's ordinary output boundary.
	await $.print(output.value.String())
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on package_import_asn1_unknown_type.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"
import "@goscript/encoding/asn1/index.js"

export async function main(): globalThis.Promise<void> {
	let [, err] = await asn1.Marshal($.interfaceValue($.makeChannel<number>(0, 0, "both"), "chan int", { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Basic, name: "int" } }))
	$.println("err nil", err == null)
	if (err != null) {
		$.println("err", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

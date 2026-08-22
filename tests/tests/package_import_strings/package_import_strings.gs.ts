// Generated file based on package_import_strings.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as strings from "@goscript/strings/index.js"
import "@goscript/strings/index.js"

export async function main(): globalThis.Promise<void> {
	// This should trigger the unhandled make call error
	// strings.Builder uses make internally for its buffer
	let builder: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	builder.value.WriteString("Hello")
	builder.value.WriteString(" ")
	builder.value.WriteString("World")
	let [n, err] = builder.value.Write(new Uint8Array([33]))
	await $.println("Write:", n, err == null)

	let result = builder.value.String()
	await $.println("Result:", result)
	await printBuilderPointer(builder)
	await $.println("After pointer:", builder.value.String())

	// Also test direct make with strings.Builder
	let builderPtr: strings.Builder | $.VarRef<strings.Builder> | null = new strings.Builder()
	strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(builderPtr), "Direct make test")
	await $.println("Direct:", strings.Builder.prototype.String.call($.pointerValue<strings.Builder>(builderPtr)))
	await $.println("LastIndexByte:", strings.LastIndexByte("hello", $.uint(108, 8)))
	await $.println("LastIndex:", strings.LastIndex("hello", "l"))
}

export async function printBuilderPointer(builder: strings.Builder | $.VarRef<strings.Builder> | null): globalThis.Promise<void> {
	await $.println("Pointer Len Before:", strings.Builder.prototype.Len.call($.pointerValue<strings.Builder>(builder)))
	strings.Builder.prototype.WriteString.call($.pointerValue<strings.Builder>(builder), " Pointer")
	await $.println("Pointer Len After:", strings.Builder.prototype.Len.call($.pointerValue<strings.Builder>(builder)))
}

if ($.isMainScript(import.meta)) {
	await main()
}

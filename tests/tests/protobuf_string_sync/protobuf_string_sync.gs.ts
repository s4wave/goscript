// Generated file based on protobuf_string_sync.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fmt from "@goscript/fmt/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as __goscript_protobuf_string_sync_pb_ts from "./protobuf_string_sync.pb.ts"
import "@goscript/fmt/index.js"
import "./protobuf_string_sync.pb.ts"

export async function main(): globalThis.Promise<void> {
	let msg: __goscript_protobuf_string_sync_pb_ts.ExampleMsg | $.VarRef<__goscript_protobuf_string_sync_pb_ts.ExampleMsg> | null = new __goscript_protobuf_string_sync_pb_ts.ExampleMsg({ExampleText: "world"})

	// String() must be synchronous and return a plain string, matching the Go
	// contract: func (x *M) String() string. A GoScript regression that makes
	// String() async (returning a Promise) breaks len() and all sync string use.
	let str = __goscript_protobuf_string_sync_pb_ts.ExampleMsg.prototype.String.call(msg)
	await $.println("len:", $.len(str))
	await $.println("empty:", $.len(str) == 0)
	await $.println("prefix ok:", ($.len(str) >= 10) && ($.stringEqual($.sliceStringOrBytes(str, undefined, 10), "ExampleMsg")))

	// MarshalProtoText must also be synchronous.
	let text = __goscript_protobuf_string_sync_pb_ts.ExampleMsg.prototype.MarshalProtoText.call(msg)
	await $.println("text len:", $.len(text))
	await $.println("text:", text)

	// fmt.Sprintf uses String() internally; a Promise would break formatting.
	let formatted = await fmt.Sprintf("msg=%v", $.interfaceValue(msg, "*main.ExampleMsg", /* @__PURE__ */ $.pointerType("main.ExampleMsg")))
	await $.println("formatted len:", $.len(formatted))
}

if ($.isMainScript(import.meta)) {
	await main()
}

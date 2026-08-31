// Generated file based on protobuf_cross_file_clone.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import type * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as __goscript_child_pb_ts from "./child.pb.ts"

import * as __goscript_parent_pb_ts from "./parent.pb.ts"
import "./child.pb.ts"
import "./parent.pb.ts"

export async function main(): globalThis.Promise<void> {
	let parent: __goscript_parent_pb_ts.Parent | $.VarRef<__goscript_parent_pb_ts.Parent> | null = new __goscript_parent_pb_ts.Parent({Child: new __goscript_child_pb_ts.Child({Name: "hello"}), Children: $.arrayToSlice<__goscript_child_pb_ts.Child | $.VarRef<__goscript_child_pb_ts.Child> | null>([new __goscript_child_pb_ts.Child({Name: "one"}), new __goscript_child_pb_ts.Child({Name: "two"})])})

	let clone: __goscript_parent_pb_ts.Parent | $.VarRef<__goscript_parent_pb_ts.Parent> | null = __goscript_parent_pb_ts.Parent.prototype.CloneVT.call(parent)
	await $.println("clone nil:", clone == null)
	await $.println("child name:", $.pointerValue<__goscript_child_pb_ts.Child>($.pointerValue<__goscript_parent_pb_ts.Parent>(clone).Child).Name)
	await $.println("child ptr same:", $.pointerEqual($.pointerValue<__goscript_parent_pb_ts.Parent>(clone).Child, $.pointerValue<__goscript_parent_pb_ts.Parent>(parent).Child))
	await $.println("children count:", $.len($.pointerValue<__goscript_parent_pb_ts.Parent>(clone).Children))
	await $.println("children[0]:", $.pointerValue<__goscript_child_pb_ts.Child>($.arrayIndex($.pointerValue<__goscript_parent_pb_ts.Parent>(clone).Children!, 0)).Name)
	await $.println("children[1]:", $.pointerValue<__goscript_child_pb_ts.Child>($.arrayIndex($.pointerValue<__goscript_parent_pb_ts.Parent>(clone).Children!, 1)).Name)
	await $.println("children ptr same:", $.pointerEqual($.arrayIndex($.pointerValue<__goscript_parent_pb_ts.Parent>(clone).Children!, 0), $.arrayIndex($.pointerValue<__goscript_parent_pb_ts.Parent>(parent).Children!, 0)))

	// Deep equality after clone.
	await $.println("equal:", __goscript_parent_pb_ts.Parent.prototype.EqualVT.call(parent, clone))

	// Mutating the clone must not touch the parent.
	$.pointerValue<__goscript_child_pb_ts.Child>($.pointerValue<__goscript_parent_pb_ts.Parent>(clone).Child).Name = "changed"
	await $.println("parent untouched:", $.stringEqual($.pointerValue<__goscript_child_pb_ts.Child>($.pointerValue<__goscript_parent_pb_ts.Parent>(parent).Child).Name, "hello"))
}

if ($.isMainScript(import.meta)) {
	await main()
}

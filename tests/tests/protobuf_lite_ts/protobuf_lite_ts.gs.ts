// Generated file based on protobuf_lite_ts.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import type * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

import * as __goscript_protobuf_lite_ts_pb_ts from "./protobuf_lite_ts.pb.ts"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "./protobuf_lite_ts.pb.ts"

export async function main(): globalThis.Promise<void> {
	let msg: __goscript_protobuf_lite_ts_pb_ts.ExampleMsg | $.VarRef<__goscript_protobuf_lite_ts_pb_ts.ExampleMsg> | null = new __goscript_protobuf_lite_ts_pb_ts.ExampleMsg({ExampleField: new Uint8Array([104, 101, 108, 108, 111]), ExampleText: "world"})

	let __goscriptTuple0: any = __goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.MarshalVT.call(msg)
	let data: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		$.println("error marshalling:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}

	$.println("data:", data)

	let out: __goscript_protobuf_lite_ts_pb_ts.ExampleMsg | $.VarRef<__goscript_protobuf_lite_ts_pb_ts.ExampleMsg> | null = new __goscript_protobuf_lite_ts_pb_ts.ExampleMsg()
	err = __goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.UnmarshalVT.call(out, data)
	if (err != null) {
		$.println("error unmarshalling:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}

	$.println("out:", out)

	let __goscriptTuple1: any = __goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.MarshalJSON.call(msg)
	let jdata: $.Slice<number> = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		$.println("error marshalling to json:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}

	$.println("json marshaled:", $.bytesToString(jdata))

	out = new __goscript_protobuf_lite_ts_pb_ts.ExampleMsg()
	let err2 = __goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.UnmarshalJSON.call(out, jdata)
	if (err2 != null) {
		$.println("error unmarshalling from json:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}

	$.println("json unmarshaled:", out)

	let oneofMsg: __goscript_protobuf_lite_ts_pb_ts.ExampleMsg | $.VarRef<__goscript_protobuf_lite_ts_pb_ts.ExampleMsg> | null = new __goscript_protobuf_lite_ts_pb_ts.ExampleMsg({ExampleText: "oneof", Choice: $.interfaceValue<__goscript_protobuf_lite_ts_pb_ts.isExampleMsg_Choice | null>(new __goscript_protobuf_lite_ts_pb_ts.ExampleMsg_ChoiceData({ChoiceData: new Uint8Array([1, 2, 3]) as $.Slice<number>}), "*main.ExampleMsg_ChoiceData")})
	let oneofClone: __goscript_protobuf_lite_ts_pb_ts.ExampleMsg | $.VarRef<__goscript_protobuf_lite_ts_pb_ts.ExampleMsg> | null = __goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.CloneVT.call(oneofMsg)
	$.println("oneof clone equal:", __goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.EqualVT.call(oneofMsg, oneofClone))
	__goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.GetChoiceData.call(oneofMsg)![0] = $.uint(9, 8)
	$.println("oneof clone independent:", $.uint($.arrayIndex(__goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.GetChoiceData.call(oneofClone)!, 0), 8) == $.uint(1, 8))

	let oneofSize = __goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.SizeVT.call(oneofClone)
	let __goscriptTuple2: any = __goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.MarshalVT.call(oneofClone)
	let oneofData: $.Slice<number> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if (err != null) {
		$.println("error marshalling oneof:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("oneof size matches:", oneofSize == $.len(oneofData))

	let oneofOut: __goscript_protobuf_lite_ts_pb_ts.ExampleMsg | $.VarRef<__goscript_protobuf_lite_ts_pb_ts.ExampleMsg> | null = new __goscript_protobuf_lite_ts_pb_ts.ExampleMsg()
	{
		let __goscriptShadow0 = __goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.UnmarshalVT.call(oneofOut, oneofData)
		if (__goscriptShadow0 != null) {
			$.println("error unmarshalling oneof:", $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0).Error())
			return
		}
	}
	$.println("oneof round trip equal:", __goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.EqualVT.call(oneofClone, oneofOut))
	$.println("oneof round trip value:", $.uint($.arrayIndex(__goscript_protobuf_lite_ts_pb_ts.ExampleMsg.prototype.GetChoiceData.call(oneofOut)!, 2), 8))

	let __goscriptTuple3: any = protobuf_go_lite.DecodeVarintUint32(new Uint8Array([172, 2]) as $.Slice<number>, 0)
	let u32 = $.uint(__goscriptTuple3[0], 32)
	let idx = __goscriptTuple3[1]
	err = __goscriptTuple3[2]
	if (err != null) {
		$.println("error decoding uint32:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("varint uint32:", $.uint(u32, 32), idx)

	let __goscriptTuple4: any = protobuf_go_lite.DecodeVarintInt32(new Uint8Array([255, 255, 255, 255, 15]) as $.Slice<number>, 0)
	let i32 = $.int(__goscriptTuple4[0], 32)
	idx = __goscriptTuple4[1]
	err = __goscriptTuple4[2]
	if (err != null) {
		$.println("error decoding int32:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("varint int32:", $.int(i32, 32), idx)

	let __goscriptTuple5: any = protobuf_go_lite.DecodeVarintInt64(new Uint8Array([172, 2]) as $.Slice<number>, 0)
	let i64 = __goscriptTuple5[0]
	idx = __goscriptTuple5[1]
	err = __goscriptTuple5[2]
	if (err != null) {
		$.println("error decoding int64:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("varint int64:", i64, idx)

	let __goscriptTuple6: any = protobuf_go_lite.DecodeFixed32(new Uint8Array([68, 51, 34, 17]) as $.Slice<number>, 0)
	let fixed32 = $.uint(__goscriptTuple6[0], 32)
	idx = __goscriptTuple6[1]
	err = __goscriptTuple6[2]
	if (err != null) {
		$.println("error decoding fixed32:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("fixed32:", $.uint(fixed32, 32), idx)

	let __goscriptTuple7: any = protobuf_go_lite.DecodeFixed64(new Uint8Array([136, 119, 102, 85, 68, 51, 34, 17]) as $.Slice<number>, 0)
	let fixed = __goscriptTuple7[0]
	idx = __goscriptTuple7[1]
	err = __goscriptTuple7[2]
	if (err != null) {
		$.println("error decoding fixed64:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("fixed64:", fixed, idx)
}

if ($.isMainScript(import.meta)) {
	await main()
}

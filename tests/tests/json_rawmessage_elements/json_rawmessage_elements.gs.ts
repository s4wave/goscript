// Generated file based on json_rawmessage_elements.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as json from "@goscript/encoding/json/index.js"
import * as jsontext from "@goscript/encoding/json/jsontext/index.js"
import "@goscript/encoding/json/jsontext/index.js"

export async function main(): globalThis.Promise<void> {
	let fields: $.VarRef<globalThis.Map<string, json.RawMessage> | null> = $.varRef(null! as globalThis.Map<string, json.RawMessage> | null)
	let err: $.GoError = (json.Unmarshal(new Uint8Array([123, 34, 110, 97, 109, 101, 34, 58, 34, 97, 34, 44, 34, 107, 105, 100, 115, 34, 58, 91, 123, 34, 120, 34, 58, 49, 125, 44, 34, 98, 34, 93, 44, 34, 110, 34, 58, 51, 125]), $.interfaceValue(fields, "*map[string]jsontext.Value", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "jsontext.Value"))))) as $.GoError)
	await $.println("map:", err == null, $.bytesToString($.mapGet<string, json.RawMessage, json.RawMessage>(fields.value, "name", null)[0]), $.bytesToString($.mapGet<string, json.RawMessage, json.RawMessage>(fields.value, "kids", null)[0]), $.bytesToString($.mapGet<string, json.RawMessage, json.RawMessage>(fields.value, "n", null)[0]))

	let kids: $.VarRef<$.Slice<json.RawMessage>> = $.varRef(null! as $.Slice<json.RawMessage>)
	err = (json.Unmarshal($.mapGet<string, json.RawMessage, json.RawMessage>(fields.value, "kids", null)[0], $.interfaceValue(kids, "*[]jsontext.Value", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "jsontext.Value"))))) as $.GoError)
	await $.println("slice:", err == null, $.sliceLen(kids.value), $.bytesToString($.plainSliceIndex(kids.value!, 0)), $.bytesToString($.plainSliceIndex(kids.value!, 1)))

	let name = $.varRef("")
	err = (json.Unmarshal($.mapGet<string, json.RawMessage, json.RawMessage>(fields.value, "name", null)[0], $.interfaceValue(name, "*string", /* @__PURE__ */ $.pointerType(/* @__PURE__ */ $.basicType("string")))) as $.GoError)
	await $.println("name:", err == null, name.value)

	await marshalElements()
}

export async function marshalElements(): globalThis.Promise<void> {
	let __goscriptTuple0: any = (json.Marshal($.interfaceValue($.makeMap<string, json.RawMessage>([["b", (new Uint8Array([34, 120, 34]) as json.RawMessage)], ["a", (new Uint8Array([91, 49, 44, 32, 50, 93]) as json.RawMessage)]]), "map[string]jsontext.Value", /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "jsontext.Value")))) as [$.Slice<number>, $.GoError])
	let out: $.Slice<number> = __goscriptTuple0[0]
	let err: $.GoError = __goscriptTuple0[1]
	await $.println("marshal map:", err == null, $.bytesToString(out))
	let __goscriptTuple1: any = (json.Marshal($.interfaceValue($.arrayToSlice<json.RawMessage>([(new Uint8Array([123, 34, 120, 34, 58, 32, 49, 125]) as json.RawMessage), (new Uint8Array([116, 114, 117, 101]) as json.RawMessage)]), "[]jsontext.Value", /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "jsontext.Value")))) as [$.Slice<number>, $.GoError])
	out = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	await $.println("marshal slice:", err == null, $.bytesToString(out))
	class item {
		public declare Values: globalThis.Map<string, json.RawMessage> | null

		public declare Items: $.Slice<item | $.VarRef<item> | null>

		constructor(init?: Partial<{Values?: globalThis.Map<string, json.RawMessage> | null, Items?: $.Slice<item | $.VarRef<item> | null>}>, __goscriptValue?: boolean) {
			this.Values = init?.Values ?? (null! as globalThis.Map<string, json.RawMessage> | null)
			this.Items = init?.Items ?? (null! as $.Slice<item | $.VarRef<item> | null>)
			;(this as any).__goStructValue = __goscriptValue === true
		}

		public clone(): item {
			return new item(this, true)
		}

		public __goscriptAssign(source: item): this {
			this.Values = source.Values
			this.Items = source.Items
			return this
		}

		static __typeInfo = $.registerStructType(
			"main.item",
			() => new item(),
			() => [],
			item,
			() => [{ name: "Values", key: "Values", type: /* @__PURE__ */ $.mapType(/* @__PURE__ */ $.basicType("string"), /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8"), "jsontext.Value")) }, { name: "Items", key: "Items", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.pointerType("main.item")), tag: "json:\",omitempty\"" }]
		)
	}
	let __goscriptTuple2: any = (json.MarshalIndent($.interfaceValue(new item({Values: $.makeMap<string, json.RawMessage>([["Name", (new Uint8Array([34, 97, 34]) as json.RawMessage)]]), Items: $.arrayToSlice<item | $.VarRef<item> | null>([new item({Values: $.makeMap<string, json.RawMessage>([["N", (new Uint8Array([51]) as json.RawMessage)]])})])}), "*main.item", /* @__PURE__ */ $.pointerType("main.item")), "", " ") as [$.Slice<number>, $.GoError])
	out = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	await $.println("marshal nested:", err == null, $.bytesToString(out))
}

if ($.isMainScript(import.meta)) {
	await main()
}

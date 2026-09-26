// Generated file based on blank_struct_fields.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class padded {
	public declare _blank0: Uint8Array

	public declare Value: number

	public declare _blank2: Uint8Array

	public _fields: {
		_blank0: Uint8Array
		Value: number
		_blank2: Uint8Array
	}

	constructor(init?: Partial<{_blank0?: Uint8Array, Value?: number, _blank2?: Uint8Array}>) {
		this._fields = {
			_blank0: init?._blank0 !== undefined ? $.cloneArrayValue(init._blank0, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2)) : $.arrayValue(new Uint8Array(2)),
			Value: init?.Value ?? (0 as number),
			_blank2: init?._blank2 !== undefined ? $.cloneArrayValue(init._blank2, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 3)) : $.arrayValue(new Uint8Array(3))
		}
	}

	public clone(): padded {
		return $.markAsStructValue(new padded(this))
	}

	static {
		$.bindStructFields(this.prototype, ["_blank0", "Value", "_blank2"])
	}

	static __typeInfo = $.registerStructType(
		"main.padded",
		() => new padded(),
		() => [],
		padded,
		() => [{ name: "_", key: "_blank0", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2) }, { name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("int") }, { name: "_", key: "_blank2", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 3) }]
	)
}

export let featureBlock: {"_blank0": padded, "Enabled": boolean, "_blank2": padded} = $.anonymousStructValue({"_blank0": $.markAsStructValue(new padded()), "Enabled": false, "_blank2": $.markAsStructValue(new padded())}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("_", "main.padded", [0], 0, false, { key: "_blank0", pkgPath: "github.com/s4wave/goscript/tests/tests/blank_struct_fields" }), /* @__PURE__ */ $.structField("Enabled", /* @__PURE__ */ $.basicType("bool"), [1], 24, true), /* @__PURE__ */ $.structField("_", "main.padded", [2], 32, false, { key: "_blank2", pkgPath: "github.com/s4wave/goscript/tests/tests/blank_struct_fields" })] })

export function __goscript_set_featureBlock(__goscriptValue: {"_blank0": padded, "Enabled": boolean, "_blank2": padded}): void {
	$.assignStruct(featureBlock, __goscriptValue)
}

export async function main(): globalThis.Promise<void> {
	featureBlock.Enabled = true
	await $.println(featureBlock.Enabled)

	let original = $.markAsStructValue(new padded({Value: 7}))
	let copy = $.markAsStructValue($.cloneStructValue(original))
	copy.Value = 8
	await $.println(original.Value, copy.Value)
}

if ($.isMainScript(import.meta)) {
	await main()
}

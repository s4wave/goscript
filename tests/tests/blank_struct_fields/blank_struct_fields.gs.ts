// Generated file based on blank_struct_fields.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class padded {
	public declare _blank0: Uint8Array

	public declare Value: number

	public declare _blank2: Uint8Array

	public _fields: {
		_blank0: $.VarRef<Uint8Array>
		Value: $.VarRef<number>
		_blank2: $.VarRef<Uint8Array>
	}

	constructor(init?: Partial<{_blank0?: Uint8Array, Value?: number, _blank2?: Uint8Array}>) {
		this._fields = {
			_blank0: $.varRef(init?._blank0 !== undefined ? $.cloneArrayValue(init._blank0, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2)) : new Uint8Array(2)),
			Value: $.varRef(init?.Value ?? (0 as number)),
			_blank2: $.varRef(init?._blank2 !== undefined ? $.cloneArrayValue(init._blank2, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 3)) : new Uint8Array(3))
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

export let featureBlock: {"_blank0": padded, "Enabled": boolean, "_blank2": padded} = {"_blank0": $.markAsStructValue(new padded()), "Enabled": false, "_blank2": $.markAsStructValue(new padded())}

export function __goscript_set_featureBlock(__goscriptValue: {"_blank0": padded, "Enabled": boolean, "_blank2": padded}): void {
	featureBlock = __goscriptValue
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

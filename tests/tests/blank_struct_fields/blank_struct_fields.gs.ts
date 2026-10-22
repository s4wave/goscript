// Generated file based on blank_struct_fields.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class padded {
	public declare _blank0: Uint8Array

	public declare Value: number

	public declare _blank2: Uint8Array

	constructor(__goscriptValue?: boolean, _blank0$?: Uint8Array, Value$?: number, _blank2$?: Uint8Array) {
		this._blank0 = _blank0$ ?? $.arrayValue(new Uint8Array(2))
		this.Value = Value$ ?? 0
		this._blank2 = _blank2$ ?? $.arrayValue(new Uint8Array(3))
		;(this as any)[$.structValueMarker] = __goscriptValue === true
	}

	public clone(): padded {
		return new padded(true, $.cloneArrayValue(this._blank0, __goscriptStatic0()), this.Value, $.cloneArrayValue(this._blank2, __goscriptStatic1()))
	}

	public __goscriptAssign(source: padded): this {
		this._blank0 = $.assignFieldValue(this._blank0, source._blank0, __goscriptStatic0())
		this.Value = source.Value
		this._blank2 = $.assignFieldValue(this._blank2, source._blank2, __goscriptStatic1())
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.padded",
		() => new padded(),
		() => [],
		padded,
		() => [{ name: "_", key: "_blank0", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2) }, { name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("int") }, { name: "_", key: "_blank2", type: /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 3) }]
	)
}

export let featureBlock: {"_blank0": padded, "Enabled": boolean, "_blank2": padded} = $.anonymousStructValue({"_blank0": new padded(true), "Enabled": false, "_blank2": new padded(true)}, { kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("_", "main.padded", [0], 0, false, { key: "_blank0", pkgPath: "github.com/s4wave/goscript/tests/tests/blank_struct_fields" }), /* @__PURE__ */ $.structField("Enabled", /* @__PURE__ */ $.basicType("bool"), [1], 24, true), /* @__PURE__ */ $.structField("_", "main.padded", [2], 32, false, { key: "_blank2", pkgPath: "github.com/s4wave/goscript/tests/tests/blank_struct_fields" })] })

export function __goscript_set_featureBlock(__goscriptValue: {"_blank0": padded, "Enabled": boolean, "_blank2": padded}): void {
	$.assignStruct(featureBlock, __goscriptValue)
}

export async function main(): globalThis.Promise<void> {
	featureBlock.Enabled = true
	await $.println(featureBlock.Enabled)

	let original = new padded(true, undefined, 7)
	let copy = (original).clone()
	copy.Value = 8
	await $.println(original.Value, copy.Value)
}

var __goscriptStatic0$value: any
function __goscriptStatic0(): any {
	return __goscriptStatic0$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 2))
}

var __goscriptStatic1$value: any
function __goscriptStatic1(): any {
	return __goscriptStatic1$value ??= (/* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint8"), 3))
}

if ($.isMainScript(import.meta)) {
	await main()
}

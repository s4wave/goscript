// Generated file based on package_import_encoding_json_unmarshal_pointer_hook.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"

import * as fmt from "@goscript/fmt/index.js"
import "@goscript/encoding/json/index.js"
import "@goscript/fmt/index.js"

export class Hooked {
	public declare Calls: number

	public declare Seen: string

	public _fields: {
		Calls: number
		Seen: string
	}

	constructor(init?: Partial<{Calls?: number, Seen?: string}>) {
		this._fields = {
			Calls: init?.Calls ?? (0 as number),
			Seen: init?.Seen ?? ("" as string)
		}
	}

	public clone(): Hooked {
		return $.markAsStructValue(new Hooked(this))
	}

	public UnmarshalJSON(data: $.Slice<number>): $.GoError {
		let h: Hooked | $.VarRef<Hooked> | null = this;
		$.pointerValue<Hooked>(h).Calls++
		$.pointerValue<Hooked>(h).Seen = $.bytesToString(data)
		return null
	}

	static {
		$.bindStructFields(this.prototype, ["Calls", "Seen"])
	}

	static __typeInfo = $.registerStructType(
		"main.Hooked",
		() => new Hooked(),
		() => [{ name: "UnmarshalJSON", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }],
		Hooked,
		() => [{ name: "Calls", key: "Calls", type: /* @__PURE__ */ $.basicType("int") }, { name: "Seen", key: "Seen", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class Box {
	public declare Value: Hooked | $.VarRef<Hooked> | null

	public _fields: {
		Value: Hooked | $.VarRef<Hooked> | null
	}

	constructor(init?: Partial<{Value?: Hooked | $.VarRef<Hooked> | null}>) {
		this._fields = {
			Value: init?.Value ?? (null! as Hooked | $.VarRef<Hooked> | null)
		}
	}

	public clone(): Box {
		return $.markAsStructValue(new Box(this))
	}

	static {
		$.bindStructFields(this.prototype, ["Value"])
	}

	static __typeInfo = $.registerStructType(
		"main.Box",
		() => new Box(),
		() => [],
		Box,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.pointerType("main.Hooked"), tag: "json:\"value\"" }]
	)
}

export async function main(): globalThis.Promise<void> {
	// A non-nil *T field with UnmarshalJSON must use the hook before any
	// pointer-to-struct population path can inspect fields.
	let box = $.varRef($.markAsStructValue(new Box({Value: new Hooked({Seen: "before"})})))
	{
		let err = json.Unmarshal(new Uint8Array([123, 34, 118, 97, 108, 117, 101, 34, 58, 123, 34, 105, 103, 110, 111, 114, 101, 100, 34, 58, 48, 125, 125]), $.interfaceValue(box, "*main.Box", /* @__PURE__ */ $.pointerType("main.Box")))
		if (err != null) {
			await fmt.Println("unmarshal error:", await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}
	await fmt.Printf("calls=%d seen=%s\n", $.basicInterfaceValue($.pointerValue<Hooked>(box.value.Value).Calls, "int"), $.pointerValue<Hooked>(box.value.Value).Seen)
}

if ($.isMainScript(import.meta)) {
	await main()
}

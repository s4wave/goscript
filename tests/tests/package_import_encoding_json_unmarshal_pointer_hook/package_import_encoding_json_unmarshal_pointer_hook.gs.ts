// Generated file based on package_import_encoding_json_unmarshal_pointer_hook.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as json from "@goscript/encoding/json/index.js"

import * as fmt from "@goscript/fmt/index.js"
import "@goscript/encoding/json/index.js"
import "@goscript/fmt/index.js"

export class Hooked {
	public get Calls(): number {
		return this._fields.Calls.value
	}
	public set Calls(value: number) {
		this._fields.Calls.value = value
	}

	public get Seen(): string {
		return this._fields.Seen.value
	}
	public set Seen(value: string) {
		this._fields.Seen.value = value
	}

	public _fields: {
		Calls: $.VarRef<number>
		Seen: $.VarRef<string>
	}

	constructor(init?: Partial<{Calls?: number, Seen?: string}>) {
		this._fields = {
			Calls: $.varRef(init?.Calls ?? (0 as number)),
			Seen: $.varRef(init?.Seen ?? ("" as string))
		}
	}

	public clone(): Hooked {
		const cloned = new Hooked()
		cloned._fields = {
			Calls: $.varRef(this._fields.Calls.value),
			Seen: $.varRef(this._fields.Seen.value)
		}
		return $.markAsStructValue(cloned)
	}

	public UnmarshalJSON(data: $.Slice<number>): $.GoError {
		let h: Hooked | $.VarRef<Hooked> | null = this
		$.pointerValue<Hooked>(h).Calls++
		$.pointerValue<Hooked>(h).Seen = $.bytesToString(data)
		return null
	}

	static __typeInfo = $.registerStructType(
		"main.Hooked",
		() => new Hooked(),
		[{ name: "UnmarshalJSON", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: "error" }] }],
		Hooked,
		[{ name: "Calls", key: "Calls", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "Seen", key: "Seen", type: { kind: $.TypeKind.Basic, name: "string" } }]
	)
}

export class Box {
	public get Value(): Hooked | $.VarRef<Hooked> | null {
		return this._fields.Value.value
	}
	public set Value(value: Hooked | $.VarRef<Hooked> | null) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<Hooked | $.VarRef<Hooked> | null>
	}

	constructor(init?: Partial<{Value?: Hooked | $.VarRef<Hooked> | null}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? (null as Hooked | $.VarRef<Hooked> | null))
		}
	}

	public clone(): Box {
		const cloned = new Box()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Box",
		() => new Box(),
		[],
		Box,
		[{ name: "Value", key: "Value", type: { kind: $.TypeKind.Pointer, elemType: "main.Hooked" }, tag: "json:\"value\"" }]
	)
}

export async function main(): globalThis.Promise<void> {
	// A non-nil *T field with UnmarshalJSON must use the hook before any
	// pointer-to-struct population path can inspect fields.
	let box = $.varRef($.markAsStructValue(new Box({Value: new Hooked({Seen: "before"})})))
	{
		let err = json.Unmarshal(new Uint8Array([123, 34, 118, 97, 108, 117, 101, 34, 58, 123, 34, 105, 103, 110, 111, 114, 101, 100, 34, 58, 48, 125, 125]), $.interfaceValue<any>(box, "*main.Box", { kind: $.TypeKind.Pointer, elemType: "main.Box" }))
		if (err != null) {
			fmt.Println("unmarshal error:", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
			return
		}
	}
	fmt.Printf("calls=%d seen=%s\n", $.basicInterfaceValue($.pointerValue<Hooked>(box.value.Value).Calls, "int"), $.pointerValue<Hooked>(box.value.Value).Seen)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on storage.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_methods from "./methods.gs.ts"
import "./methods.gs.ts"

export class storage {
	public declare bytes: $.Slice<number>

	public declare name: string

	public _fields: {
		bytes: $.Slice<number>
		name: string
	}

	constructor(init?: Partial<{bytes?: $.Slice<number>, name?: string}>) {
		this._fields = {
			bytes: init?.bytes ?? (null! as $.Slice<number>),
			name: init?.name ?? ("" as string)
		}
	}

	public clone(): storage {
		return $.markAsStructValue(new storage(this))
	}

	public IsEmpty(): boolean {
		const s: storage | $.VarRef<storage> | null = this
		return $.len($.pointerValue<storage>(s).bytes) == 0
	}

	public Len(): number {
		const s: storage | $.VarRef<storage> | null = this
		return $.len($.pointerValue<storage>(s).bytes)
	}

	public Name(): string {
		const s: storage | $.VarRef<storage> | null = this
		return $.pointerValue<storage>(s).name
	}

	public SetName(name: string): void {
		let s: storage | $.VarRef<storage> | null = this
		$.pointerValue<storage>(s).name = name
	}

	public Truncate(): void {
		let s: storage | $.VarRef<storage> | null = this
		$.pointerValue<storage>(s).bytes = $.makeSlice<number>(0, undefined, "byte")
	}

	static {
		$.bindStructFields(this.prototype, ["bytes", "name"])
	}

	static __typeInfo = $.registerStructType(
		"main.storage",
		() => new storage(),
		() => [{ name: "IsEmpty", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }] }, { name: "Len", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }, { name: "SetName", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "Truncate", args: [], returns: [] }],
		storage,
		() => [{ name: "bytes", key: "bytes", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let s: storage | $.VarRef<storage> | null = new storage({bytes: $.makeSlice<number>(5, undefined, "byte"), name: "test"})

	await $.println("Name:", storage.prototype.Name.call(s))
	await $.println("Length:", storage.prototype.Len.call(s))
	await $.println("Empty:", storage.prototype.IsEmpty.call(s))

	storage.prototype.Truncate.call(s)
	await $.println("Length after truncate:", storage.prototype.Len.call(s))

	storage.prototype.SetName.call(s, "new_name")
	await $.println("New name:", storage.prototype.Name.call(s))
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on storage.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import type * as __goscript_methods from "./methods.gs.ts"

export class storage {
	public declare bytes: $.Slice<number>

	public declare name: string

	constructor(__goscriptValue?: boolean, bytes$?: $.Slice<number>, name$?: string) {
		this.bytes = bytes$ ?? (null! as $.Slice<number>)
		this.name = name$ ?? ""
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): storage {
		return new storage(true, this.bytes, this.name)
	}

	public __goscriptAssign(source: storage): this {
		this.bytes = source.bytes
		this.name = source.name
		return this
	}

	public IsEmpty(): boolean {
		const s: storage | $.VarRef<storage> | null = this;
		return $.sliceLen($.pointerValue<storage>(s).bytes) == 0
	}

	public Len(): number {
		const s: storage | $.VarRef<storage> | null = this;
		return $.sliceLen($.pointerValue<storage>(s).bytes)
	}

	public Name(): string {
		const s: storage | $.VarRef<storage> | null = this;
		return $.pointerValue<storage>(s).name
	}

	public SetName(name: string): void {
		const s: storage | $.VarRef<storage> | null = this;
		$.pointerValue<storage>(s).name = name
	}

	public Truncate(): void {
		const s: storage | $.VarRef<storage> | null = this;
		$.pointerValue<storage>(s).bytes = $.makeSlice<number>(0, undefined, "byte")
	}

	static __typeInfo = $.registerStructType(
		"main.storage",
		() => new storage(),
		() => [{ name: "IsEmpty", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("bool") }], pointerReceiver: true }, { name: "Len", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }], pointerReceiver: true }, { name: "Name", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }], pointerReceiver: true }, { name: "SetName", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [], pointerReceiver: true }, { name: "Truncate", args: [], returns: [], pointerReceiver: true }],
		storage,
		() => [{ name: "bytes", key: "bytes", type: /* @__PURE__ */ $.sliceType(/* @__PURE__ */ $.basicType("uint8")) }, { name: "name", key: "name", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let s = new storage(false, $.makeSlice<number>(5, undefined, "byte"), "test")

	await $.println("Name:", (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as storage).Name() : storage.prototype.Name.call(s)))
	await $.println("Length:", (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as storage).Len() : storage.prototype.Len.call(s)))
	await $.println("Empty:", (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as storage).IsEmpty() : storage.prototype.IsEmpty.call(s)))

	void (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as storage).Truncate() : storage.prototype.Truncate.call(s))
	await $.println("Length after truncate:", (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as storage).Len() : storage.prototype.Len.call(s)))

	void (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as storage).SetName("new_name") : storage.prototype.SetName.call(s, "new_name"))
	await $.println("New name:", (s !== null && (s as any).__isVarRef !== true && (s as any).__goValue === undefined ? ((s as any) as storage).Name() : storage.prototype.Name.call(s)))
}

if ($.isMainScript(import.meta)) {
	await main()
}

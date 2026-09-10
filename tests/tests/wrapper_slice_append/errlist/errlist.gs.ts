// Generated file based on errlist.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type ErrorList = $.Slice<string>

export class AStruct {
	public declare Msg: string

	public _fields: {
		Msg: string
	}

	constructor(init?: Partial<{Msg?: string}>) {
		this._fields = {
			Msg: init?.Msg ?? ("" as string)
		}
	}

	public clone(): AStruct {
		return $.markAsStructValue(new AStruct(this))
	}

	public Set(msg: string): void {
		let a: AStruct | $.VarRef<AStruct> | null = this;
		$.pointerValue<AStruct>(a).Msg = msg
	}

	static {
		$.bindStructFields(this.prototype, ["Msg"])
	}

	static __typeInfo = $.registerStructType(
		"errlist.AStruct",
		() => new AStruct(),
		() => [{ name: "Set", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		AStruct,
		() => [{ name: "Msg", key: "Msg", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export function ErrorList_Add(p: $.VarRef<ErrorList> | null, msg: string): void {
	p!.value = ($.append(($.pointerValue<ErrorList>(p) as ErrorList), msg) as ErrorList)
}

// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public declare Value: number

	public _fields: {
		Value: number
	}

	constructor(init?: Partial<{Value?: number}>) {
		this._fields = {
			Value: init?.Value ?? (0 as number)
		}
	}

	public clone(): MyStruct {
		return $.markAsStructValue(new MyStruct(this))
	}

	public DoesNotUseReceiver(): number {
		const m: MyStruct | $.VarRef<MyStruct> | null = this
		return 42
	}

	public UsesReceiver(): number {
		const m: MyStruct | $.VarRef<MyStruct> | null = this
		return $.pointerValue<MyStruct>(m).Value
	}

	static {
		$.bindStructFields(this.prototype, ["Value"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		() => [{ name: "DoesNotUseReceiver", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "UsesReceiver", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		MyStruct,
		() => [{ name: "Value", key: "Value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let s: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({Value: 10})
	await $.println(MyStruct.prototype.UsesReceiver.call(s))
	await $.println(MyStruct.prototype.DoesNotUseReceiver.call(s))
}

if ($.isMainScript(import.meta)) {
	await main()
}

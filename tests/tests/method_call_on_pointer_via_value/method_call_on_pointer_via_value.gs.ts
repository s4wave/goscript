// Generated file based on method_call_on_pointer_via_value.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public declare MyInt: number

	public _fields: {
		MyInt: number
	}

	constructor(init?: Partial<{MyInt?: number}>) {
		this._fields = {
			MyInt: init?.MyInt ?? (0 as number)
		}
	}

	public clone(): MyStruct {
		return $.markAsStructValue(new MyStruct(this))
	}

	public GetValue(): number {
		const m = this
		return m.MyInt
	}

	public SetValue(v: number): void {
		let m: MyStruct | $.VarRef<MyStruct> | null = this
		$.pointerValue<MyStruct>(m).MyInt = v
	}

	static {
		$.bindStructFields(this.prototype, ["MyInt"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		() => [{ name: "GetValue", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "SetValue", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		MyStruct,
		() => [{ name: "MyInt", key: "MyInt", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	// Create a struct value
	let msValue = $.varRef($.markAsStructValue(new MyStruct({MyInt: 100})))

	// === Method Call on Pointer Receiver via Value ===
	// Call the pointer-receiver method using the value variable.
	// Go implicitly takes the address of msValue (&msValue) to call SetValue.
	msValue.value.SetValue(200)

	// Verify the value was modified through the method call.
	// Expected: 200
	await $.println("Value after pointer method call via value: Expected: 200, Actual:", $.markAsStructValue($.cloneStructValue(msValue.value)).GetValue())
}

if ($.isMainScript(import.meta)) {
	await main()
}

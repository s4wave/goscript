// Generated file based on method_call_on_pointer_receiver.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class MyStruct {
	public declare MyInt: number

	public declare MyString: string

	public _fields: {
		MyInt: number
		MyString: string
	}

	constructor(init?: Partial<{MyInt?: number, MyString?: string}>) {
		this._fields = {
			MyInt: init?.MyInt ?? (0 as number),
			MyString: init?.MyString ?? ("" as string)
		}
	}

	public clone(): MyStruct {
		return $.markAsStructValue(new MyStruct(this))
	}

	public GetMyString(): string {
		const m: MyStruct | $.VarRef<MyStruct> | null = this;
		return $.pointerValue<MyStruct>(m).MyString
	}

	static {
		$.bindStructFields(this.prototype, ["MyInt", "MyString"])
	}

	static __typeInfo = $.registerStructType(
		"main.MyStruct",
		() => new MyStruct(),
		() => [{ name: "GetMyString", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		MyStruct,
		() => [{ name: "MyInt", key: "MyInt", type: /* @__PURE__ */ $.basicType("int") }, { name: "MyString", key: "MyString", type: /* @__PURE__ */ $.basicType("string") }]
	)
}

export class setterStruct {
	public declare value: number

	public _fields: {
		value: number
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: init?.value ?? (0 as number)
		}
	}

	public clone(): setterStruct {
		return $.markAsStructValue(new setterStruct(this))
	}

	public ["get"](): number {
		const s: setterStruct | $.VarRef<setterStruct> | null = this;
		return $.pointerValue<setterStruct>(s).value
	}

	public ["set"](value: number): void {
		let s: setterStruct | $.VarRef<setterStruct> | null = this;
		$.pointerValue<setterStruct>(s).value = value
	}

	static {
		$.bindStructFields(this.prototype, ["value"])
	}

	static __typeInfo = $.registerStructType(
		"main.setterStruct",
		() => new setterStruct(),
		() => [{ name: "get", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }, { name: "set", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		setterStruct,
		() => [{ name: "value", key: "value", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export class digest {
	public declare writes: number

	public _fields: {
		writes: number
	}

	constructor(init?: Partial<{writes?: number}>) {
		this._fields = {
			writes: init?.writes ?? (0 as number)
		}
	}

	public clone(): digest {
		return $.markAsStructValue(new digest(this))
	}

	public Write(p: $.Slice<number>): void {
		let d: digest | $.VarRef<digest> | null = this;
		$.pointerValue<digest>(d).writes = $.pointerValue<digest>(d).writes + ($.len(p))
	}

	static {
		$.bindStructFields(this.prototype, ["writes"])
	}

	static __typeInfo = $.registerStructType(
		"main.digest",
		() => new digest(),
		() => [{ name: "Write", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		digest,
		() => [{ name: "writes", key: "writes", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let structPointer: MyStruct | $.VarRef<MyStruct> | null = new MyStruct({MyInt: 4, MyString: "hello world"})
	// === Method Call on Pointer Receiver ===
	// Calling a method with a pointer receiver (*MyStruct) using a pointer variable.
	await $.println("Method call on pointer (structPointer): Expected: hello world, Actual: " + MyStruct.prototype.GetMyString.call(structPointer))

	let setter: setterStruct | $.VarRef<setterStruct> | null = new setterStruct()
	setterStruct.prototype.set.call(setter, 9)
	await $.println("reserved pointer method:", setterStruct.prototype.get.call(setter))

	let d: digest | $.VarRef<digest> | null = new digest()
	let pad: $.Slice<number> = new Uint8Array([1, 2, 3]) as $.Slice<number>
	{
		digest.prototype.Write.call(d, pad)
		let __goscriptShadow0: $.Slice<number> = new Uint8Array([4]) as $.Slice<number>
		await $.println("shadowed type name after method call:", $.pointerValue<digest>(d).writes, $.len(__goscriptShadow0))
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

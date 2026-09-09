// Generated file based on inline_interface_type_assertion.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Stringer = {
	String(): string
}

$.registerInterfaceType(
	"main.Stringer",
	null,
	[{ name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export class Greeter {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Greeter {
		return $.markAsStructValue(new Greeter(this))
	}

	public Greet(): string {
		const g = this
		return "Hello from Greeter"
	}

	static __typeInfo = $.registerStructType(
		"main.Greeter",
		() => new Greeter(),
		() => [{ name: "Greet", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		Greeter,
		() => []
	)
}

export class MyStringer {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): MyStringer {
		return $.markAsStructValue(new MyStringer(this))
	}

	public String(): string {
		const ms = this
		return "MyStringer implementation"
	}

	static __typeInfo = $.registerStructType(
		"main.MyStringer",
		() => new MyStringer(),
		() => [{ name: "String", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		MyStringer,
		() => []
	)
}

export async function main(): globalThis.Promise<void> {
	let i: any = null! as any
	i = $.interfaceValue($.markAsStructValue(new Greeter()), "main.Greeter", "main.Greeter")

	// Successful type assertion to an inline interface
	let [g, ok] = $.typeAssertTuple<any>(i, { kind: $.TypeKind.Interface, methods: [{ name: "Greet", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("string") }] }] })
	if (ok) {
		await $.println("Greet assertion successful:", await $.pointerValue<any>(g).Greet())
	} else {
		await $.println("Greet assertion failed")
	}

	// Failing type assertion to a different inline interface
	let [s, ok2] = $.typeAssertTuple<any>(i, { kind: $.TypeKind.Interface, methods: [{ name: "NonExistentMethod", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("int") }] }] })
	if (ok2) {
		await $.println("NonExistentMethod assertion successful (unexpected):", await $.pointerValue<any>(s).NonExistentMethod())
	} else {
		await $.println("NonExistentMethod assertion failed as expected")
	}

	// Successful type assertion to a named interface, where the asserted value also implements an inline interface method
	let j: any = null! as any
	j = $.interfaceValue($.markAsStructValue(new MyStringer()), "main.MyStringer", "main.MyStringer")

	// Assert 'j' (which holds MyStringer) to an inline interface that MyStringer satisfies.
	let [inlineMs, ok4] = $.typeAssertTuple<any>(j, { kind: $.TypeKind.Interface, methods: [{ name: "String", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("string") }] }] })
	if (ok4) {
		await $.println("Inline String assertion successful:", await $.pointerValue<any>(inlineMs).String())
	} else {
		await $.println("Inline String assertion failed")
	}

	// Test case: variable of named interface type, asserted to inline interface
	let k: Stringer | null = null! as Stringer | null
	k = $.interfaceValue<Stringer | null>($.markAsStructValue(new MyStringer()), "main.MyStringer", "main.MyStringer")

	let [inlineK, ok5] = $.typeAssertTuple<any>(k, { kind: $.TypeKind.Interface, methods: [{ name: "String", args: [], returns: [{ name: "_r0", type: /* @__PURE__ */ $.basicType("string") }] }] })
	if (ok5) {
		await $.println("k.(interface{ String() string }) successful:", await $.pointerValue<any>(inlineK).String())
	} else {
		await $.println("k.(interface{ String() string }) failed")
	}

	// Test case: nil value of an inline interface type assigned to interface{}
	let l: any = $.interfaceValue(null, "*struct{Name string}", /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true)] }))

	let [ptr, ok6] = $.typeAssertTuple<$.VarRef<{"Name": string}> | null>(l, /* @__PURE__ */ $.pointerType({ kind: $.TypeKind.Struct, methods: [], fields: [/* @__PURE__ */ $.structField("Name", /* @__PURE__ */ $.basicType("string"), [0], 0, true)] }))
	if (ok6) {
		if (ptr == null) {
			await $.println("l.(*struct{ Name string }) successful, ptr is nil as expected")
		} else {
			await $.println("l.(*struct{ Name string }) successful, but ptr is not nil (unexpected)")
		}
	} else {
		await $.println("l.(*struct{ Name string }) failed (unexpected)")
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

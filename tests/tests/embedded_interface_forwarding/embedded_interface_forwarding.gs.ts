// Generated file based on embedded_interface_forwarding.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Adder = {
	Add(value: number): number
}

$.registerInterfaceType(
	"main.Adder",
	null,
	[{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export class Box {
	public declare Adder: Adder | null

	public _fields: {
		Adder: Adder | null
	}

	constructor(init?: Partial<{Adder?: Adder | null}>) {
		this._fields = {
			Adder: init?.Adder ?? (null! as Adder | null)
		}
	}

	public clone(): Box {
		return $.markAsStructValue(new Box(this))
	}

	public Add(value: any): any {
		return $.pointerValue<Exclude<Adder | null, null>>(this.Adder).Add(value)
	}

	static {
		$.bindStructFields(this.prototype, ["Adder"])
	}

	static __typeInfo = $.registerStructType(
		"main.Box",
		() => new Box(),
		() => [{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		Box,
		() => [{ name: "Adder", key: "Adder", type: "main.Adder", anonymous: true }]
	)
}

export class Counter {
	public declare base: number

	public _fields: {
		base: number
	}

	constructor(init?: Partial<{base?: number}>) {
		this._fields = {
			base: init?.base ?? (0 as number)
		}
	}

	public clone(): Counter {
		return $.markAsStructValue(new Counter(this))
	}

	public Add(value: number): number {
		const c: Counter | $.VarRef<Counter> | null = this;
		return $.pointerValue<Counter>(c).base + value
	}

	static {
		$.bindStructFields(this.prototype, ["base"])
	}

	static __typeInfo = $.registerStructType(
		"main.Counter",
		() => new Counter(),
		() => [{ name: "Add", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		Counter,
		() => [{ name: "base", key: "base", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export async function call(adder: Adder | null): globalThis.Promise<number> {
	return $.pointerValue<Exclude<Adder, null>>(adder).Add(4)
}

export async function main(): globalThis.Promise<void> {
	let box: Box | $.VarRef<Box> | null = new Box({Adder: $.interfaceValue<Adder | null>(new Counter({base: 3}), "*main.Counter", /* @__PURE__ */ $.pointerType("main.Counter"))})
	await $.println($.pointerValue<Exclude<Adder, null>>($.pointerValue<Box>(box).Adder).Add(5))
	await $.println(await call($.interfaceValue<Adder | null>(box, "*main.Box", /* @__PURE__ */ $.pointerType("main.Box"))))
}

if ($.isMainScript(import.meta)) {
	await main()
}

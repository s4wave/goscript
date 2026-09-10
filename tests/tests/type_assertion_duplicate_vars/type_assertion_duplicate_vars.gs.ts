// Generated file based on type_assertion_duplicate_vars.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Interface = {
	Method(): string
}

$.registerInterfaceType(
	"main.Interface",
	null,
	[{ name: "Method", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }]
);

export class ConcreteA {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): ConcreteA {
		return $.markAsStructValue(new ConcreteA(this))
	}

	public Method(): string {
		const c = this;
		return "A"
	}

	static __typeInfo = $.registerStructType(
		"main.ConcreteA",
		() => new ConcreteA(),
		() => [{ name: "Method", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		ConcreteA,
		() => []
	)
}

export class ConcreteB {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): ConcreteB {
		return $.markAsStructValue(new ConcreteB(this))
	}

	public Method(): string {
		const c = this;
		return "B"
	}

	static __typeInfo = $.registerStructType(
		"main.ConcreteB",
		() => new ConcreteB(),
		() => [{ name: "Method", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("string") }] }],
		ConcreteB,
		() => []
	)
}

export class Container {
	public declare hasA: boolean

	public declare hasB: boolean

	public _fields: {
		hasA: boolean
		hasB: boolean
	}

	constructor(init?: Partial<{hasA?: boolean, hasB?: boolean}>) {
		this._fields = {
			hasA: init?.hasA ?? (false as boolean),
			hasB: init?.hasB ?? (false as boolean)
		}
	}

	public clone(): Container {
		return $.markAsStructValue(new Container(this))
	}

	static {
		$.bindStructFields(this.prototype, ["hasA", "hasB"])
	}

	static __typeInfo = $.registerStructType(
		"main.Container",
		() => new Container(),
		() => [],
		Container,
		() => [{ name: "hasA", key: "hasA", type: /* @__PURE__ */ $.basicType("bool") }, { name: "hasB", key: "hasB", type: /* @__PURE__ */ $.basicType("bool") }]
	)
}

export async function main(): globalThis.Promise<void> {
	let iface: Interface | null = $.interfaceValue<Interface | null>($.markAsStructValue(new ConcreteA()), "main.ConcreteA", "main.ConcreteA")

	let c: Container | $.VarRef<Container> | null = new Container()

	// Multiple type assertions that should generate unique variable names
	let __goscriptTuple0: any = $.typeAssertTuple<ConcreteA>(iface, "main.ConcreteA")
	$.pointerValue<Container>(c).hasA = __goscriptTuple0[1]
	let __goscriptTuple1: any = $.typeAssertTuple<ConcreteB>(iface, "main.ConcreteB")
	$.pointerValue<Container>(c).hasB = __goscriptTuple1[1]

	await $.println("hasA:", $.pointerValue<Container>(c).hasA)
	await $.println("hasB:", $.pointerValue<Container>(c).hasB)
}

if ($.isMainScript(import.meta)) {
	await main()
}

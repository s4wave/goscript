// Generated file based on type_switch_varref_suffix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type node = {
	value(): number
}

$.registerInterfaceType(
	"main.node",
	null,
	[{ name: "value", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export class branch {
	public declare n: number

	public _fields: {
		n: number
	}

	constructor(init?: Partial<{n?: number}>) {
		this._fields = {
			n: init?.n ?? (0 as number)
		}
	}

	public clone(): branch {
		return $.markAsStructValue(new branch(this))
	}

	public value(): number {
		const b: branch | $.VarRef<branch> | null = this
		return $.pointerValue<branch>(b).n
	}

	static {
		$.bindStructFields(this.prototype, ["n"])
	}

	static __typeInfo = $.registerStructType(
		"main.branch",
		() => new branch(),
		() => [{ name: "value", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		branch,
		() => [{ name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function accept(b: branch | $.VarRef<branch> | null): number {
	return $.pointerValue<branch>(b).n
}

export async function main(): globalThis.Promise<void> {
	let v: node | null = $.interfaceValue<node | null>(new branch({n: 3}), "*main.branch", /* @__PURE__ */ $.pointerType("main.branch"))
	{
		const __goscriptTypeSwitchValue = v
		switch (true) {
			case $.typeAssert<branch | $.VarRef<branch> | null>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.pointerType("main.branch")).ok:
				{
					let e: branch | $.VarRef<branch> | null = $.typeAssert<branch | $.VarRef<branch> | null>(__goscriptTypeSwitchValue, /* @__PURE__ */ $.pointerType("main.branch")).value
					let imprecise = $.varRef(0)
					let ptr = imprecise
					ptr!.value = 4
					await $.println("branch", accept(e), imprecise.value)
				}
				break
			default:
				{
					let e: any = __goscriptTypeSwitchValue
					await $.println("other")
				}
				break
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on variadic_pointer_interface_param.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Expr = {
	Value(): number
}

$.registerInterfaceType(
	"main.Expr",
	null,
	[{ name: "Value", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export class lit {
	public declare n: number

	public _fields: {
		n: number
	}

	constructor(init?: Partial<{n?: number}>) {
		this._fields = {
			n: init?.n ?? (0 as number)
		}
	}

	public clone(): lit {
		return $.markAsStructValue(new lit(this))
	}

	public Value(): number {
		const l: lit | $.VarRef<lit> | null = this
		return $.pointerValue<lit>(l).n
	}

	static {
		$.bindStructFields(this.prototype, ["n"])
	}

	static __typeInfo = $.registerStructType(
		"main.lit",
		() => new lit(),
		() => [{ name: "Value", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		lit,
		() => [{ name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function replace(to: Expr | null, exprs: $.Slice<$.VarRef<Expr | null> | null>): boolean {
	for (let __goscriptRangeTarget0 = exprs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let expr = __goscriptRangeTarget0![__rangeIndex]
		if ($.pointerValue<Expr | null>(expr) == null) {
			continue
		}
		expr!.value = to
		return true
	}
	return false
}

export async function main(): globalThis.Promise<void> {
	let expr: $.VarRef<Expr | null> = $.varRef($.interfaceValue<Expr | null>(new lit({n: 1}), "*main.lit", /* @__PURE__ */ $.pointerType("main.lit")))
	let next: Expr | null = $.interfaceValue<Expr | null>(new lit({n: 7}), "*main.lit", /* @__PURE__ */ $.pointerType("main.lit"))
	await $.println(replace(next, $.arrayToSlice<$.VarRef<Expr | null> | null>([expr])), await $.pointerValue<Exclude<Expr, null>>(expr.value).Value())
}

if ($.isMainScript(import.meta)) {
	await main()
}

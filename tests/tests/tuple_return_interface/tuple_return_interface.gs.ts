// Generated file based on tuple_return_interface.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Block = {
	Size(): number
}

$.registerInterfaceType(
	"main.Block",
	null,
	[{ name: "Size", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }]
);

export class blockImpl {
	public declare size: number

	public _fields: {
		size: number
	}

	constructor(init?: Partial<{size?: number}>) {
		this._fields = {
			size: init?.size ?? (0 as number)
		}
	}

	public clone(): blockImpl {
		return $.markAsStructValue(new blockImpl(this))
	}

	public Size(): number {
		const b: blockImpl | $.VarRef<blockImpl> | null = this
		return $.pointerValue<blockImpl>(b).size
	}

	static {
		$.bindStructFields(this.prototype, ["size"])
	}

	static __typeInfo = $.registerStructType(
		"main.blockImpl",
		() => new blockImpl(),
		() => [{ name: "Size", args: [], returns: [{ type: /* @__PURE__ */ $.basicType("int") }] }],
		blockImpl,
		() => [{ name: "size", key: "size", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export function newBlock(size: number): [blockImpl | $.VarRef<blockImpl> | null, $.GoError] {
	return [new blockImpl({size: size}), null]
}

export function newInterface(size: number): [Block | null, $.GoError] {
	if (size == 0) {
		return [null, null]
	}
	const __goscriptReturn0 = newBlock(size)
	return [$.interfaceValue<Block | null>(__goscriptReturn0[0], "*main.blockImpl", /* @__PURE__ */ $.pointerType("main.blockImpl")), __goscriptReturn0[1]]
	throw new globalThis.Error("goscript: unreachable return")
}

export async function main(): globalThis.Promise<void> {
	let [block, err] = newInterface(16)
	await $.println("err nil:", err == null)
	await $.println("size:", await $.pointerValue<Exclude<Block, null>>(block).Size())
}

if ($.isMainScript(import.meta)) {
	await main()
}

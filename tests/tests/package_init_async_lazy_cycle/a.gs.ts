// Generated file based on a.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_b from "./b.gs.ts"
import "./b.gs.ts"

export class holder {
	public declare n: number

	public _fields: {
		n: number
	}

	constructor(init?: Partial<{n?: number}>) {
		this._fields = {
			n: init?.n ?? (0 as number)
		}
	}

	public clone(): holder {
		return $.markAsStructValue(new holder(this))
	}

	static {
		$.bindStructFields(this.prototype, ["n"])
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		() => [],
		holder,
		() => [{ name: "n", key: "n", type: /* @__PURE__ */ $.basicType("int") }]
	)
}

export var seed: number

export function __goscript_init_seed(): void {
	if (((seed) as any) === undefined) {
		seed = 7
	}
}

export function __goscript_get_seed(): number {
	if (((seed) as any) === undefined) {
		__goscript_init_seed()
	}
	return seed
}

export function __goscript_set_seed(__goscriptValue: number): void {
	seed = __goscriptValue
}

export async function useFirst(): globalThis.Promise<number> {
	return (await __goscript_b.__goscript_init_first(), __goscript_b.__goscript_get_first()).n
}

export async function main(): globalThis.Promise<void> {
	await $.println("main:", await useFirst())
}

if ($.isMainScript(import.meta)) {
	await main()
}

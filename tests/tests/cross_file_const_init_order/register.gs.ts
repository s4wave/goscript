// Generated file based on register.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import type * as __goscript_consts from "./consts.gs.ts"

export class thing {
	constructor(__goscriptValue?: boolean) {
		;(this as any).__goStructValue = __goscriptValue === true
	}

	public clone(): thing {
		return new thing(true)
	}

	public __goscriptAssign(source: thing): this {
		return this
	}

	static __typeInfo = $.registerStructType(
		"main.thing",
		() => new thing(),
		() => [],
		thing,
		() => []
	)
}

export let Seen = 0

export function __goscript_set_Seen(__goscriptValue: number): void {
	Seen = __goscriptValue
}

export function newThing(): thing {
	return new thing(true)
}

function __goscriptInit0(): void {
	Seen = 0
}

export { __goscriptInit0 }

// Generated file based on constants.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export const Pi: number = 3.14

export const Truth: boolean = false

export const Greeting: string = "Hello, Constants!"

export const IV0: number = 1

export const IV1: number = 2

export const IV2: number = 3

export let DigestIV: number[] = $.arrayValue([1, 2, 3])

export function __goscript_set_DigestIV(__goscriptValue: number[]): void {
	DigestIV = $.assignFieldValue(DigestIV, __goscriptValue, /* @__PURE__ */ $.arrayType(/* @__PURE__ */ $.basicType("uint32"), 3))
}

export let Nothing: any = null

export function __goscript_set_Nothing(__goscriptValue: any): void {
	Nothing = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	await $.println(3.14)
	await $.println(false)
	// println(Big) // Commented out until large integer handling is implemented
	// println(Small) // Commented out as it depends on Big
	await $.println("Hello, Constants!")
	await $.println(DigestIV[0], DigestIV[1], DigestIV[2])
	await $.println(4)
}

if ($.isMainScript(import.meta)) {
	await main()
}

// Generated file based on wide_uint64_switch.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function classifyU(v: bigint): string {
	switch (v) {
		case 0n:
		{
			return "zero"
		}
		case 5n:
		{
			return "five"
		}
		case 1152921504606846976n:
		{
			return "wide"
		}
		default:
		{
			return "other"
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function classifyI(v: bigint): string {
	switch (v) {
		case -5n:
		{
			return "neg"
		}
		case 7n:
		{
			return "seven"
		}
		default:
		{
			return "other"
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export async function main(): globalThis.Promise<void> {
	$.println(classifyU(0n))
	$.println(classifyU(5n))
	$.println(classifyU(1152921504606846976n))
	$.println(classifyU(9n))
	$.println(classifyI(-5n))
	$.println(classifyI(7n))
	$.println(classifyI(3n))
}

if ($.isMainScript(import.meta)) {
	await main()
}

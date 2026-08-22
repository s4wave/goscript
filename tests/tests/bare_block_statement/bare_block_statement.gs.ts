// Generated file based on bare_block_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function scopedTotal(seed: number): globalThis.Promise<number> {
	let total = seed
	{
		total = total + (1)
		let inner = total * 2
		await $.println("inner:", inner)
	}
	{
		total = total + (3)
	}
	return total
}

export async function shadowedValue(): globalThis.Promise<number> {
	let value = 7
	{
		let __goscriptShadow0 = 11
		await $.println("block value:", __goscriptShadow0)
	}
	return value
}

export function emptyBodies(limit: number): number {
	let count = 0
	if (limit > 0) {
	}
	for (; count < limit; count++) {
	}
	return count
}

export async function main(): globalThis.Promise<void> {
	await $.println("scoped total:", await scopedTotal(1))
	await $.println("outer value:", await shadowedValue())
	await $.println("empty bodies:", emptyBodies(3))
}

if ($.isMainScript(import.meta)) {
	await main()
}

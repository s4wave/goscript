// Generated file based on switch_statement.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	let i = 2
	await $.println("Integer switch:")
	switch (i) {
		case 1:
		{
			await $.println("one")
			break
		}
		case 2:
		{
			await $.println("two")
			break
		}
		case 3:
		{
			await $.println("three")
			break
		}
		default:
		{
			await $.println("other integer")
			break
		}
	}

	let s = "hello"
	await $.println("\nString switch:")
	switch (s) {
		case "world":
		{
			await $.println("world")
			break
		}
		case "hello":
		{
			await $.println("hello")
			break
		}
		default:
		{
			await $.println("other string")
			break
		}
	}
	let x = -5
	await $.println("\nSwitch without expression:")
	switch ((true as boolean)) {
		case x < 0:
		{
			await $.println("negative")
			break
		}
		case x == 0:
		{
			await $.println("zero")
			break
		}
		default:
		{
			await $.println("positive")
			break
		}
	}

	x = 0
	await $.println("\nSwitch without expression (zero):")
	switch ((true as boolean)) {
		case x < 0:
		{
			await $.println("negative")
			break
		}
		case x == 0:
		{
			await $.println("zero")
			break
		}
		default:
		{
			await $.println("positive")
			break
		}
	}

	x = 10
	await $.println("\nSwitch without expression (positive):")
	switch ((true as boolean)) {
		case x < 0:
		{
			await $.println("negative")
			break
		}
		case x == 0:
		{
			await $.println("zero")
			break
		}
		default:
		{
			await $.println("positive")
			break
		}
	}

	// Conditions set only inside a callback are still runtime values.
	let data: $.Slice<number> = null! as $.Slice<number>
	let rejected = false
	await hold($.functionValue((): void => {
		data = new Uint8Array([120])
		rejected = true
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await $.println("\nSwitch on conditions set in a callback:")
	switch ((true as boolean)) {
		case (data == null) && rejected:
		{
			await $.println("rejected")
			break
		}
		case data == null:
		{
			await $.println("missing")
			break
		}
		default:
		{
			await $.println("found")
			break
		}
	}
}

export async function hold(fn: (() => void) | null): globalThis.Promise<void> {
	await fn!()
}

if ($.isMainScript(import.meta)) {
	await main()
}

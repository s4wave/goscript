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
	switch (true) {
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
	switch (true) {
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
	switch (true) {
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
}

if ($.isMainScript(import.meta)) {
	await main()
}

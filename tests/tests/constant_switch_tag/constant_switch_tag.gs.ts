// Generated file based on constant_switch_tag.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_constants from "./constants.gs.ts"
import "./constants.gs.ts"

export async function main(): globalThis.Promise<void> {
	switch ((64 as number)) {
		case 32:
		{
			await $.println("word: 32")
			break
		}
		case 64:
		{
			await $.println("word: 64")
			break
		}
		default:
		{
			await $.println("word: other")
			break
		}
	}

	switch ((false as boolean)) {
		case true:
		{
			await $.println("cgo: on")
			break
		}
		case false:
		{
			await $.println("cgo: off")
			break
		}
	}

	if ((64 as number) == 32) {
		await $.println("compare: 32")
	} else {
		await $.println("compare: not 32")
	}

	switch ((true as boolean)) {
		case false || !false:
		{
			await $.println("resolver: go")
			break
		}
		case false:
		{
			await $.println("resolver: cgo")
			break
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

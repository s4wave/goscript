// Generated file based on switch_exit_keywords.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function returnValue(result: $.VarRef<string> | null): void {
	result!.value = result!.value + ("return")
}

export function throwError(result: $.VarRef<string> | null): void {
	result!.value = result!.value + ("throw")
}

export function continueWork(result: $.VarRef<string> | null): void {
	result!.value = result!.value + ("continue")
}

export function breakfast(result: $.VarRef<string> | null): void {
	result!.value = result!.value + ("break")
}

export function prefixCase(value: number): string {
	let result = $.varRef("")
	switch (value) {
		case 0:
		{
			returnValue(result)
			break
		}
		case 1:
		{
			throwError(result)
			break
		}
		case 2:
		{
			continueWork(result)
			break
		}
		case 3:
		{
			breakfast(result)
			break
		}
		case 4:
		{
			result.value = result.value + ("next")
			break
		}
	}
	return result.value
}

export function nestedReturn(value: number): string {
	switch (value) {
		case 0:
		{
			{
				return "returned"
			}
		}
		default:
		{
			return "default"
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function nestedBranches(): string {
	let result = ""
	for (let value = 0; value < 3; value++) {
		switch (value) {
			case 0:
			{
				{
					continue
				}
			}
			case 1:
			{
				{
					break
				}
			}
			default:
			{
				result = result + ("default")
				break
			}
		}
		result = result + ("after")
	}
	return result
}

export async function main(): globalThis.Promise<void> {
	for (let value = 0; value <= 4; value++) {
		$.println(prefixCase(value))
	}
	$.println(nestedReturn(0))
	$.println(nestedReturn(1))
	$.println(nestedBranches())
}

if ($.isMainScript(import.meta)) {
	await main()
}

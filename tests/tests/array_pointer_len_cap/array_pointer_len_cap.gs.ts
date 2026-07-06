// Generated file based on array_pointer_len_cap.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function sum(values: $.VarRef<number[]> | null): number {
	let out = $.len($.pointerValue<number[]>(values)) + $.cap($.pointerValue<number[]>(values))
	for (let i = 0; i < $.len($.pointerValue<number[]>(values)); i++) {
		out = out + ($.arrayIndex($.pointerValue<number[]>(values), i))
	}
	return out
}

export async function main(): globalThis.Promise<void> {
	let values: $.VarRef<number[]> | null = $.varRef([1, 2, 3, 4])
	$.println(sum(values))
}

if ($.isMainScript(import.meta)) {
	await main()
}

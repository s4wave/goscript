// Generated file based on assign_op_asi_barrier.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export function consume(v: $.VarRef<$.Slice<$.Slice<number>>> | null, n: bigint): void {
	while ($.len($.pointerValue<$.Slice<$.Slice<number>>>(v)) > 0) {
		let ln0 = $.int64($.len($.arrayIndex(($.pointerValue<$.Slice<$.Slice<number>>>(v))!, 0)))
		if (ln0 > n) {
			($.pointerValue<$.Slice<$.Slice<number>>>(v))![0] = $.goSlice($.arrayIndex(($.pointerValue<$.Slice<$.Slice<number>>>(v))!, 0), Number(n), undefined)
			return
		}
		n = BigInt.asIntN(64, n - (ln0));
		($.pointerValue<$.Slice<$.Slice<number>>>(v))![0] = null
		v!.value = $.goSlice(($.pointerValue<$.Slice<$.Slice<number>>>(v)), 1, undefined)
	}
}

export async function main(): globalThis.Promise<void> {
	let values: $.VarRef<$.Slice<$.Slice<number>>> = $.varRef($.arrayToSlice<$.Slice<number>>([new Uint8Array([1, 2]) as $.Slice<number>, new Uint8Array([3]) as $.Slice<number>]))
	consume(values, 2n)
	$.println($.len(values.value), $.arrayIndex(values.value!, 0) == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}

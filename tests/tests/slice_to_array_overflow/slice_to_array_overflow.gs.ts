// Generated file based on slice_to_array_overflow.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function recoverMsg(label: string, fn: (() => void) | null): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			{
				let r = $.recover()
				if (r != null) {
					{
						let [err, ok] = $.typeAssertTuple<$.GoError>(r, "error")
						if (ok) {
							await $.println(label, await $.pointerValue<Exclude<$.GoError, null>>(err).Error())
						} else {
							await $.println(label, "non-error panic")
						}
					}
				}
			}
		})() })
		await fn!()
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

export async function main(): globalThis.Promise<void> {
	await recoverMsg("array:", $.functionValue(async (): globalThis.Promise<void> => {
		let values: $.Slice<number> = new Uint8Array([1, 2]) as $.Slice<number>
		let arr = ($.sliceToArray<number>(values, 4, "byte") as Uint8Array)
		await $.println($.uint($.arrayIndex(arr, 0), 8))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("pointer:", $.functionValue(async (): globalThis.Promise<void> => {
		let values: $.Slice<number> = new Uint8Array([1, 2]) as $.Slice<number>
		let arr: $.VarRef<Uint8Array> | null = ($.sliceToArrayPointer<number>(values, 4, "byte") as $.VarRef<Uint8Array> | null)
		await $.println($.uint($.arrayIndex($.pointerValue<Uint8Array>(arr), 0), 8))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await $.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}

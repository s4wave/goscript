// Generated file based on index_out_of_range.go
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
	await recoverMsg("slice:", $.functionValue(async (): globalThis.Promise<void> => {
		let s: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3])
		let i = 5
		await $.println($.arrayIndex(s!, i))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("array:", $.functionValue(async (): globalThis.Promise<void> => {
		let a: number[] = Array.from({ length: 3 }, () => 0)
		let i = 7
		await $.println($.arrayIndex(a, i))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("negative:", $.functionValue(async (): globalThis.Promise<void> => {
		let s: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3])
		let i = -1
		await $.println($.arrayIndex(s!, i))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("string:", $.functionValue(async (): globalThis.Promise<void> => {
		let s = "abc"
		let i = 9
		await $.println($.uint($.indexStringOrBytes(s, i), 8))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("string-negative:", $.functionValue(async (): globalThis.Promise<void> => {
		let s = "abc"
		let i = -1
		await $.println($.uint($.indexStringOrBytes(s, i), 8))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await recoverMsg("bytes-negative:", $.functionValue(async (): globalThis.Promise<void> => {
		let b: $.Slice<number> = new Uint8Array([97, 98, 99])
		let i = -1
		await $.println($.uint($.arrayIndex(b!, i), 8))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	await $.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}

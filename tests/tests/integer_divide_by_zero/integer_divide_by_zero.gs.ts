// Generated file based on integer_divide_by_zero.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function _catch(fn: (() => void) | null): globalThis.Promise<string> {
	let msg = "none"
	await (async () => {
		const __defer = new $.DisposableStack()
		try {
			__defer.defer(() => { (() => {
				{
					let r = $.recover()
					if (r != null) {
						{
							let [err, ok] = $.typeAssertTuple<$.GoError>(r, "error")
							if (ok) {
								msg = ((err !== null && (err as any).__isVarRef !== true && ((err as any).__goValue === undefined || (err as any).__goType?.charCodeAt(0) !== 42) ? (err as Exclude<$.GoError, null>) : $.pointerValue<Exclude<$.GoError, null>>(err)).Error() as string)
							} else {
								msg = "non-error panic"
							}
						}
					}
				}
			})() })
			void (__goscriptAwait = fn!(), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait)
			__defer.dispose()
		} catch (e) {
			__defer.disposePanic(e)
			if (!$.recovered(e)) {
				throw e
			}
		}
	})()
	return msg
}

export async function main(): globalThis.Promise<void> {
	let z = 0
	let z8 = 0
	let z32 = 0
	let z64 = 0n
	let zu = 0
	await $.println("int /:", await _catch($.functionValue(async () => {
		await $.println($.intQuo(1, z))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	await $.println("int %:", await _catch($.functionValue(async () => {
		await $.println($.intRem(1, z))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	await $.println("uint8 /:", await _catch($.functionValue(async () => {
		let o = 1
		await $.println($.uint($.intQuo(o, z8), 8))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	await $.println("int32 %:", await _catch($.functionValue(async () => {
		let o = 1
		await $.println($.int($.intRem(o, z32), 32))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	await $.println("int64 /:", await _catch($.functionValue(async () => {
		let o = 1n
		await $.println($.int64Div(o, z64))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	await $.println("uint /:", await _catch($.functionValue(async () => {
		await $.println($.wideUintDiv(1, zu))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	await $.println("int /=:", await _catch($.functionValue(async () => {
		let q = 5
		q = $.intQuo(q, (z))
		await $.println(q)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	await $.println("int %=:", await _catch($.functionValue(async () => {
		let q = 5
		q = $.intRem(q, (z))
		await $.println(q)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))

	// Nonzero divisors truncate toward zero, and constant ones stay inline.
	let q = 17
	let r = -5
	q = $.intQuo(q, (r + 1))
	const k: number = -3
	await $.println(q, -3, 1, -3, 1, $.intQuo(-7, r), $.intRem(-7, r))
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

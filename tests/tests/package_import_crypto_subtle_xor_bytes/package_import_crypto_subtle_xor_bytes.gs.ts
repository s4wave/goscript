// Generated file based on package_import_crypto_subtle_xor_bytes.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as subtle from "@goscript/crypto/subtle/index.js"
import "@goscript/bytes/index.js"
import "@goscript/crypto/subtle/index.js"

export async function panics(f: (() => void) | null): globalThis.Promise<boolean> {
	let panicked: boolean = false
	const __defer = new $.DisposableStack()
	try {
		__defer.defer(() => { ((): void => {
			panicked = $.recover() != null
		})() })
		await f!()
		const __goscriptReturn0: boolean = false
		panicked = __goscriptReturn0
		__defer.dispose()
		return panicked
		__defer.dispose()
	} catch (e) {
		__defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
	return panicked
}

export async function main(): globalThis.Promise<void> {
	let dst: $.Slice<number> = $.makeSlice<number>(4, undefined, "byte")
	let n = subtle.XORBytes(dst, new Uint8Array([15, 240, 85, 170]) as $.Slice<number>, new Uint8Array([51, 15, 170, 85]) as $.Slice<number>)
	$.println("normal count", n)
	$.println("normal value", bytes.Equal(dst, new Uint8Array([60, 255, 255, 255]) as $.Slice<number>))

	let unequal: $.Slice<number> = new Uint8Array([99, 99, 99, 99]) as $.Slice<number>
	n = subtle.XORBytes(unequal, new Uint8Array([1, 2, 3, 4]) as $.Slice<number>, new Uint8Array([4, 6]) as $.Slice<number>)
	$.println("unequal count", n)
	$.println("unequal value", bytes.Equal(unequal, new Uint8Array([5, 4, 99, 99]) as $.Slice<number>))

	let short: $.Slice<number> = new Uint8Array([7]) as $.Slice<number>
	$.println("short panics", await panics($.functionValue((): void => {
		subtle.XORBytes(short, new Uint8Array([1, 2]) as $.Slice<number>, new Uint8Array([3, 4]) as $.Slice<number>)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	$.println("short unchanged", bytes.Equal(short, new Uint8Array([7]) as $.Slice<number>))

	let exact: $.Slice<number> = new Uint8Array([1, 2, 3, 4]) as $.Slice<number>
	n = subtle.XORBytes(exact, exact, new Uint8Array([4, 3, 2, 1]) as $.Slice<number>)
	$.println("exact count", n)
	$.println("exact value", bytes.Equal(exact, new Uint8Array([5, 1, 1, 5]) as $.Slice<number>))

	let inexact: $.Slice<number> = new Uint8Array([1, 2, 3, 4]) as $.Slice<number>
	$.println("inexact panics", await panics($.functionValue((): void => {
		subtle.XORBytes($.goSlice(inexact, 1, undefined), $.goSlice(inexact, undefined, 3), new Uint8Array([4, 5, 6]) as $.Slice<number>)
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo))))
	$.println("inexact unchanged", bytes.Equal(inexact, new Uint8Array([1, 2, 3, 4]) as $.Slice<number>))
}

if ($.isMainScript(import.meta)) {
	await main()
}

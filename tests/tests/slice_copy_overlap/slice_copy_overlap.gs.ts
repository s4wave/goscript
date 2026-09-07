// Generated file based on slice_copy_overlap.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): globalThis.Promise<void> {
	// Integer slices retain overlapping memmove behavior.
	let right: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	let n = $.copy($.goSlice(right, 2, undefined), $.goSlice(right, 1, 4))
	await $.println("right count:", n)
	await $.println("right:", $.arrayIndex(right!, 0), $.arrayIndex(right!, 1), $.arrayIndex(right!, 2), $.arrayIndex(right!, 3), $.arrayIndex(right!, 4))

	let left: $.Slice<number> = $.arrayToSlice<number>([1, 2, 3, 4, 5])
	n = $.copy($.goSlice(left, 1, undefined), $.goSlice(left, 2, undefined))
	await $.println("left count:", n)
	await $.println("left:", $.arrayIndex(left!, 0), $.arrayIndex(left!, 1), $.arrayIndex(left!, 2), $.arrayIndex(left!, 3), $.arrayIndex(left!, 4))

	// Byte ranges copy in both directions without exposing temporary views.
	let bytes: $.Slice<number> = new Uint8Array([1, 2, 3, 4, 5]) as $.Slice<number>
	let start = 1
	let stop = 4
	n = $.copyByteRanges(bytes, start + 1, undefined, bytes, start, stop)
	await $.println("byte right:", n, $.uint($.arrayIndex(bytes!, 0), 8), $.uint($.arrayIndex(bytes!, 1), 8), $.uint($.arrayIndex(bytes!, 2), 8), $.uint($.arrayIndex(bytes!, 3), 8), $.uint($.arrayIndex(bytes!, 4), 8))
	n = $.copyByteRanges(bytes, undefined, stop - 1, bytes, start + 1, undefined)
	await $.println("byte left:", n, $.uint($.arrayIndex(bytes!, 0), 8), $.uint($.arrayIndex(bytes!, 1), 8), $.uint($.arrayIndex(bytes!, 2), 8), $.uint($.arrayIndex(bytes!, 3), 8), $.uint($.arrayIndex(bytes!, 4), 8))

	// Explicit high bounds may extend into spare capacity; omitted highs may not.
	let backing: $.Slice<number> = new Uint8Array([10, 11, 12, 13, 14, 15]) as $.Slice<number>
	let dst: $.Slice<number> = $.goSlice(backing, 1, 2, 5)
	let src: $.Slice<number> = new Uint8Array([7, 8, 9]) as $.Slice<number>
	n = $.copyByteRanges(dst, 1, 4, src, undefined, undefined)
	await $.println("capacity:", n, $.uint($.arrayIndex(backing!, 0), 8), $.uint($.arrayIndex(backing!, 1), 8), $.uint($.arrayIndex(backing!, 2), 8), $.uint($.arrayIndex(backing!, 3), 8), $.uint($.arrayIndex(backing!, 4), 8), $.uint($.arrayIndex(backing!, 5), 8))
	n = $.copyByteRanges(dst, undefined, undefined, src, undefined, undefined)
	await $.println("length:", n, $.uint($.arrayIndex(backing!, 1), 8), $.uint($.arrayIndex(backing!, 2), 8))

	// Bounds with calls preserve their observable evaluation sequence.
	n = $.copy($.goSlice(dst, await bound(0), undefined), $.goSlice(src, await bound(1), undefined))
	await $.println("effect count:", n)

	// Nil ranges still validate the other operand before returning zero.
	let empty: $.Slice<number> = null! as $.Slice<number>
	await $.println("nil:", $.copyByteRanges(empty, undefined, undefined, src, undefined, undefined))
	await checkInvalidSource(empty, src)
}

export async function bound(value: number): globalThis.Promise<number> {
	await $.println("bound:", value)
	return value
}

export async function checkInvalidSource(dst: $.Slice<number>, src: $.Slice<number>): globalThis.Promise<void> {
	const __defer = new $.AsyncDisposableStack()
	try {
		__defer.defer(async () => { await (async (): globalThis.Promise<void> => {
			await $.println("invalid source:", $.recover() != null)
		})() })
		let high = $.len(src) + 1
		$.copyByteRanges(dst, undefined, undefined, src, undefined, high)
		await __defer.dispose()
	} catch (e) {
		await __defer.disposePanic(e)
		if (!$.recovered(e)) {
			throw e
		}
	}
}

if ($.isMainScript(import.meta)) {
	await main()
}

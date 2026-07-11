// Generated file based on io.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"

import * as unsafe from "@goscript/unsafe/index.js"
import "@goscript/io/index.js"
import "@goscript/unsafe/index.js"

export const chunk: number = 10485760

export async function ReadData(r: io.Reader | null, n: bigint): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	if (($.int64(n) < 0n) || (n != $.uint64($.int(n)))) {
		// n is too large to fit in int, so we can't allocate
		// a buffer large enough. Treat this as a read failure.
		return [null, io.ErrUnexpectedEOF]
	}

	if (n < 10485760n) {
		let buf: $.Slice<number> = $.makeSlice<number>(Number(n), undefined, "byte")
		let [, err] = await io.ReadFull($.pointerValueOrNil(r)!, buf)
		if (err != null) {
			return [null, err]
		}
		return [buf, null]
	}

	let buf: $.Slice<number> = null as $.Slice<number>
	let buf1: $.Slice<number> = $.makeSlice<number>(10485760, undefined, "byte")
	while (n > 0n) {
		let next = n
		if (next > 10485760n) {
			next = 10485760n
		}
		let [, err] = await io.ReadFull($.pointerValueOrNil(r)!, $.goSlice(buf1, undefined, Number(next)))
		if (err != null) {
			if (($.len(buf) > 0) && ($.comparableEqual(err, io.EOF))) {
				err = io.ErrUnexpectedEOF
			}
			return [null, err]
		}
		buf = $.appendSlice(buf, $.goSlice(buf1, undefined, Number(next)), $.byteSliceHint)
		n = $.uint64Sub(n, next)
	}
	return [buf, null]
}

export async function ReadDataAt(r: io.ReaderAt | null, n: bigint, off: bigint): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	if (($.int64(n) < 0n) || (n != $.uint64($.int(n)))) {
		// n is too large to fit in int, so we can't allocate
		// a buffer large enough. Treat this as a read failure.
		return [null, io.ErrUnexpectedEOF]
	}

	if (n < 10485760n) {
		let buf: $.Slice<number> = $.makeSlice<number>(Number(n), undefined, "byte")
		let [, err] = await $.pointerValue<Exclude<io.ReaderAt, null>>(r).ReadAt(buf, off)
		if (err != null) {
			// io.SectionReader can return EOF for n == 0,
			// but for our purposes that is a success.
			if ((!$.comparableEqual(err, io.EOF)) || (n > 0n)) {
				return [null, err]
			}
		}
		return [buf, null]
	}

	let buf: $.Slice<number> = null as $.Slice<number>
	let buf1: $.Slice<number> = $.makeSlice<number>(10485760, undefined, "byte")
	while (n > 0n) {
		let next = n
		if (next > 10485760n) {
			next = 10485760n
		}
		let [, err] = await $.pointerValue<Exclude<io.ReaderAt, null>>(r).ReadAt($.goSlice(buf1, undefined, Number(next)), off)
		if (err != null) {
			return [null, err]
		}
		buf = $.appendSlice(buf, $.goSlice(buf1, undefined, Number(next)), $.byteSliceHint)
		n = $.uint64Sub(n, next)
		off = $.int64Add(off, $.int64(next))
	}
	return [buf, null]
}

export function SliceCapWithSize(size: bigint, c: bigint): number {
	if (($.int64(c) < 0n) || (c != $.uint64($.int(c)))) {
		return -1
	}
	if ((size > 0n) && (c > ($.uint64Div(18446744073709551615n, size)))) {
		return -1
	}
	if (($.uint64Mul(c, size)) > 10485760n) {
		c = $.uint64Div(10485760n, size)
		if (c == 0n) {
			c = 1n
		}
	}
	return $.int(c)
}

export function SliceCap(__typeArgs: $.GenericTypeArgs | undefined, c: bigint): number {
	let v: any = $.genericZero(__typeArgs, "E", null)
	let size = $.uint64(unsafe.Sizeof!(v))
	return SliceCapWithSize(size, c)
}

// Generated file based on hex.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/slices/index.js"
import "@goscript/strings/index.js"

export type InvalidByteError = number

export class encoder {
	public get w(): io.Writer | null {
		return this._fields.w.value
	}
	public set w(value: io.Writer | null) {
		this._fields.w.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get out(): Uint8Array {
		return this._fields.out.value
	}
	public set out(value: Uint8Array) {
		this._fields.out.value = value
	}

	public _fields: {
		w: $.VarRef<io.Writer | null>
		err: $.VarRef<$.GoError>
		out: $.VarRef<Uint8Array>
	}

	constructor(init?: Partial<{w?: io.Writer | null, err?: $.GoError, out?: Uint8Array}>) {
		this._fields = {
			w: $.varRef(init?.w ?? (null! as io.Writer | null)),
			err: $.varRef(init?.err ?? (null! as $.GoError)),
			out: $.varRef(init?.out !== undefined ? $.cloneArrayValue(init.out) : new Uint8Array(1024))
		}
	}

	public clone(): encoder {
		const cloned = new encoder()
		cloned._fields = {
			w: $.varRef(this._fields.w.value),
			err: $.varRef(this._fields.err.value),
			out: $.varRef($.cloneArrayValue(this._fields.out.value))
		}
		return $.markAsStructValue(cloned)
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let e: encoder | $.VarRef<encoder> | null = this
		let n: number = 0
		let err: $.GoError = null! as $.GoError
		while (($.len(p) > 0) && ($.pointerValue<encoder>(e).err == null)) {
			let chunkSize = Math.trunc(1024 / 2)
			if ($.len(p) < chunkSize) {
				chunkSize = $.len(p)
			}

			let written: number = 0
			let encoded = Encode($.goSlice($.pointerValue<encoder>(e).out, undefined, undefined), $.goSlice(p, undefined, chunkSize))
			let __goscriptTuple1: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<encoder>(e).w).Write($.goSlice($.pointerValue<encoder>(e).out, undefined, encoded))
			written = __goscriptTuple1[0]
			$.pointerValue<encoder>(e).err = __goscriptTuple1[1]
			n = n + (Math.trunc(written / 2))
			p = $.goSlice(p, chunkSize, undefined)
		}
		return [n, $.pointerValue<encoder>(e).err]
	}

	static __typeInfo = $.registerStructType(
		"hex.encoder",
		() => new encoder(),
		[{ name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		encoder,
		[{ name: "w", key: "w", type: "io.Writer", pkgPath: "encoding/hex", index: [0], offset: 0, exported: false }, { name: "err", key: "err", type: "error", pkgPath: "encoding/hex", index: [1], offset: 16, exported: false }, { name: "out", key: "out", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 1024 }, pkgPath: "encoding/hex", index: [2], offset: 32, exported: false }]
	)
}

export class decoder {
	public get r(): io.Reader | null {
		return this._fields.r.value
	}
	public set r(value: io.Reader | null) {
		this._fields.r.value = value
	}

	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get _in(): $.Slice<number> {
		return this._fields._in.value
	}
	public set _in(value: $.Slice<number>) {
		this._fields._in.value = value
	}

	public get arr(): Uint8Array {
		return this._fields.arr.value
	}
	public set arr(value: Uint8Array) {
		this._fields.arr.value = value
	}

	public _fields: {
		r: $.VarRef<io.Reader | null>
		err: $.VarRef<$.GoError>
		_in: $.VarRef<$.Slice<number>>
		arr: $.VarRef<Uint8Array>
	}

	constructor(init?: Partial<{r?: io.Reader | null, err?: $.GoError, _in?: $.Slice<number>, arr?: Uint8Array}>) {
		this._fields = {
			r: $.varRef(init?.r ?? (null! as io.Reader | null)),
			err: $.varRef(init?.err ?? (null! as $.GoError)),
			_in: $.varRef(init?._in ?? (null! as $.Slice<number>)),
			arr: $.varRef(init?.arr !== undefined ? $.cloneArrayValue(init.arr) : new Uint8Array(1024))
		}
	}

	public clone(): decoder {
		const cloned = new decoder()
		cloned._fields = {
			r: $.varRef(this._fields.r.value),
			err: $.varRef(this._fields.err.value),
			_in: $.varRef(this._fields._in.value),
			arr: $.varRef($.cloneArrayValue(this._fields.arr.value))
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let d: decoder | $.VarRef<decoder> | null = this
		let n: number = 0
		let err: $.GoError = null! as $.GoError
		// Fill internal buffer with sufficient bytes to decode
		if (($.len($.pointerValue<decoder>(d)._in) < 2) && ($.pointerValue<decoder>(d).err == null)) {
			let numCopy: number = 0
			let numRead: number = 0
			numCopy = $.copy($.goSlice($.pointerValue<decoder>(d).arr, undefined, undefined), $.pointerValue<decoder>(d)._in)
			let __goscriptTuple2: any = await $.pointerValue<Exclude<io.Reader, null>>($.pointerValue<decoder>(d).r).Read($.goSlice($.pointerValue<decoder>(d).arr, numCopy, undefined))
			numRead = __goscriptTuple2[0]
			$.pointerValue<decoder>(d).err = __goscriptTuple2[1]
			$.pointerValue<decoder>(d)._in = $.goSlice($.pointerValue<decoder>(d).arr, undefined, numCopy + numRead)
			if (($.comparableEqual($.pointerValue<decoder>(d).err, io.EOF)) && (($.len($.pointerValue<decoder>(d)._in) % 2) != 0)) {

				{
					let a = $.uint($.indexStringOrBytes($.bytesToString(new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 255, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])), $.arrayIndex($.pointerValue<decoder>(d)._in!, $.len($.pointerValue<decoder>(d)._in) - 1)), 8)
					if ($.uint(a, 8) > $.uint(0x0f, 8)) {
						$.pointerValue<decoder>(d).err = $.namedValueInterfaceValue<$.GoError>($.uint($.arrayIndex($.pointerValue<decoder>(d)._in!, $.len($.pointerValue<decoder>(d)._in) - 1), 8), "hex.InvalidByteError", {"Error": InvalidByteError_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "hex.InvalidByteError" })
					} else {
						$.pointerValue<decoder>(d).err = io.ErrUnexpectedEOF
					}
				}
			}
		}

		// Decode internal buffer into output buffer
		{
			let numAvail = Math.trunc($.len($.pointerValue<decoder>(d)._in) / 2)
			if ($.len(p) > numAvail) {
				p = $.goSlice(p, undefined, numAvail)
			}
		}
		let __goscriptTuple3: any = Decode(p, $.goSlice($.pointerValue<decoder>(d)._in, undefined, $.len(p) * 2))
		let numDec = __goscriptTuple3[0]
		err = __goscriptTuple3[1]
		$.pointerValue<decoder>(d)._in = $.goSlice($.pointerValue<decoder>(d)._in, 2 * numDec, undefined)
		if (err != null) {
			let __goscriptAssign0_0: $.Slice<number> = null
			let __goscriptAssign0_1: $.GoError = err
			$.pointerValue<decoder>(d)._in = __goscriptAssign0_0
			$.pointerValue<decoder>(d).err = __goscriptAssign0_1
		}

		if ($.len($.pointerValue<decoder>(d)._in) < 2) {
			return [numDec, $.pointerValue<decoder>(d).err]
		}
		return [numDec, null]
	}

	static __typeInfo = $.registerStructType(
		"hex.decoder",
		() => new decoder(),
		[{ name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		decoder,
		[{ name: "r", key: "r", type: "io.Reader", pkgPath: "encoding/hex", index: [0], offset: 0, exported: false }, { name: "err", key: "err", type: "error", pkgPath: "encoding/hex", index: [1], offset: 16, exported: false }, { name: "in", key: "_in", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "encoding/hex", index: [2], offset: 32, exported: false }, { name: "arr", key: "arr", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 1024 }, pkgPath: "encoding/hex", index: [3], offset: 56, exported: false }]
	)
}

export class dumper {
	public get w(): io.Writer | null {
		return this._fields.w.value
	}
	public set w(value: io.Writer | null) {
		this._fields.w.value = value
	}

	public get rightChars(): Uint8Array {
		return this._fields.rightChars.value
	}
	public set rightChars(value: Uint8Array) {
		this._fields.rightChars.value = value
	}

	public get buf(): Uint8Array {
		return this._fields.buf.value
	}
	public set buf(value: Uint8Array) {
		this._fields.buf.value = value
	}

	public get used(): number {
		return this._fields.used.value
	}
	public set used(value: number) {
		this._fields.used.value = value
	}

	public get n(): number {
		return this._fields.n.value
	}
	public set n(value: number) {
		this._fields.n.value = value
	}

	public get closed(): boolean {
		return this._fields.closed.value
	}
	public set closed(value: boolean) {
		this._fields.closed.value = value
	}

	public _fields: {
		w: $.VarRef<io.Writer | null>
		rightChars: $.VarRef<Uint8Array>
		buf: $.VarRef<Uint8Array>
		used: $.VarRef<number>
		n: $.VarRef<number>
		closed: $.VarRef<boolean>
	}

	constructor(init?: Partial<{w?: io.Writer | null, rightChars?: Uint8Array, buf?: Uint8Array, used?: number, n?: number, closed?: boolean}>) {
		this._fields = {
			w: $.varRef(init?.w ?? (null! as io.Writer | null)),
			rightChars: $.varRef(init?.rightChars !== undefined ? $.cloneArrayValue(init.rightChars) : new Uint8Array(18)),
			buf: $.varRef(init?.buf !== undefined ? $.cloneArrayValue(init.buf) : new Uint8Array(14)),
			used: $.varRef(init?.used ?? (0 as number)),
			n: $.varRef(init?.n ?? (0 as number)),
			closed: $.varRef(init?.closed ?? (false as boolean))
		}
	}

	public clone(): dumper {
		const cloned = new dumper()
		cloned._fields = {
			w: $.varRef(this._fields.w.value),
			rightChars: $.varRef($.cloneArrayValue(this._fields.rightChars.value)),
			buf: $.varRef($.cloneArrayValue(this._fields.buf.value)),
			used: $.varRef(this._fields.used.value),
			n: $.varRef(this._fields.n.value),
			closed: $.varRef(this._fields.closed.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Close(): globalThis.Promise<$.GoError> {
		let h: dumper | $.VarRef<dumper> | null = this
		let err: $.GoError = null! as $.GoError
		// See the comments in Write() for the details of this format.
		if ($.pointerValue<dumper>(h).closed) {
			return err
		}
		$.pointerValue<dumper>(h).closed = true
		if ($.pointerValue<dumper>(h).used == 0) {
			return err
		}
		$.pointerValue<dumper>(h).buf[0] = $.uint(32, 8)
		$.pointerValue<dumper>(h).buf[1] = $.uint(32, 8)
		$.pointerValue<dumper>(h).buf[2] = $.uint(32, 8)
		$.pointerValue<dumper>(h).buf[3] = $.uint(32, 8)
		$.pointerValue<dumper>(h).buf[4] = $.uint(124, 8)
		let nBytes = $.pointerValue<dumper>(h).used
		while ($.pointerValue<dumper>(h).used < 16) {
			let l = 3
			if ($.pointerValue<dumper>(h).used == 7) {
				l = 4
			} else {
				if ($.pointerValue<dumper>(h).used == 15) {
					l = 5
				}
			}
			let __goscriptTuple4: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<dumper>(h).w).Write($.goSlice($.pointerValue<dumper>(h).buf, undefined, l))
			err = __goscriptTuple4[1]
			if (err != null) {
				return err
			}
			$.pointerValue<dumper>(h).used++
		}
		$.pointerValue<dumper>(h).rightChars[nBytes] = $.uint(124, 8)
		$.pointerValue<dumper>(h).rightChars[nBytes + 1] = $.uint(10, 8)
		let __goscriptTuple5: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<dumper>(h).w).Write($.goSlice($.pointerValue<dumper>(h).rightChars, undefined, nBytes + 2))
		err = __goscriptTuple5[1]
		return err
	}

	public async Write(data: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let h: dumper | $.VarRef<dumper> | null = this
		let n: number = 0
		let err: $.GoError = null! as $.GoError
		if ($.pointerValue<dumper>(h).closed) {
			return [0, errors.New("encoding/hex: dumper closed")]
		}

		// Output lines look like:
		// 00000010  2e 2f 30 31 32 33 34 35  36 37 38 39 3a 3b 3c 3d  |./0123456789:;<=|
		// ^ offset                          ^ extra space              ^ ASCII of line.
		for (let __goscriptRangeTarget1 = data, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
			if ($.pointerValue<dumper>(h).used == 0) {
				// At the beginning of a line we print the current
				// offset in hex.
				$.pointerValue<dumper>(h).buf[0] = $.uint($.uint($.uint($.uint64Shr($.pointerValue<dumper>(h).n, 24n), 64), 8), 8)
				$.pointerValue<dumper>(h).buf[1] = $.uint($.uint($.uint($.uint64Shr($.pointerValue<dumper>(h).n, 16n), 64), 8), 8)
				$.pointerValue<dumper>(h).buf[2] = $.uint($.uint($.uint($.uint64Shr($.pointerValue<dumper>(h).n, 8n), 64), 8), 8)
				$.pointerValue<dumper>(h).buf[3] = $.uint($.uint($.pointerValue<dumper>(h).n, 8), 8)
				Encode($.goSlice($.pointerValue<dumper>(h).buf, 4, undefined), $.goSlice($.pointerValue<dumper>(h).buf, undefined, 4))
				$.pointerValue<dumper>(h).buf[12] = $.uint(32, 8)
				$.pointerValue<dumper>(h).buf[13] = $.uint(32, 8)
				let __goscriptTuple6: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<dumper>(h).w).Write($.goSlice($.pointerValue<dumper>(h).buf, 4, undefined))
				err = __goscriptTuple6[1]
				if (err != null) {
					return [n, err]
				}
			}
			Encode($.goSlice($.pointerValue<dumper>(h).buf, undefined, undefined), $.goSlice(data, i, i + 1))
			$.pointerValue<dumper>(h).buf[2] = $.uint(32, 8)
			let l = 3
			if ($.pointerValue<dumper>(h).used == 7) {
				// There's an additional space after the 8th byte.
				$.pointerValue<dumper>(h).buf[3] = $.uint(32, 8)
				l = 4
			} else {
				if ($.pointerValue<dumper>(h).used == 15) {
					// At the end of the line there's an extra space and
					// the bar for the right column.
					$.pointerValue<dumper>(h).buf[3] = $.uint(32, 8)
					$.pointerValue<dumper>(h).buf[4] = $.uint(124, 8)
					l = 5
				}
			}
			let __goscriptTuple7: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<dumper>(h).w).Write($.goSlice($.pointerValue<dumper>(h).buf, undefined, l))
			err = __goscriptTuple7[1]
			if (err != null) {
				return [n, err]
			}
			n++
			$.pointerValue<dumper>(h).rightChars[$.pointerValue<dumper>(h).used] = $.uint(toChar($.uint($.arrayIndex(data!, i), 8)), 8)
			$.pointerValue<dumper>(h).used++
			$.pointerValue<dumper>(h).n++
			if ($.pointerValue<dumper>(h).used == 16) {
				$.pointerValue<dumper>(h).rightChars[16] = $.uint(124, 8)
				$.pointerValue<dumper>(h).rightChars[17] = $.uint(10, 8)
				let __goscriptTuple8: any = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<dumper>(h).w).Write($.goSlice($.pointerValue<dumper>(h).rightChars, undefined, undefined))
				err = __goscriptTuple8[1]
				if (err != null) {
					return [n, err]
				}
				$.pointerValue<dumper>(h).used = 0
			}
		}
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"hex.dumper",
		() => new dumper(),
		[{ name: "Close", args: [], returns: [{ name: "err", type: "error" }] }, { name: "Write", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		dumper,
		[{ name: "w", key: "w", type: "io.Writer", pkgPath: "encoding/hex", index: [0], offset: 0, exported: false }, { name: "rightChars", key: "rightChars", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 18 }, pkgPath: "encoding/hex", index: [1], offset: 16, exported: false }, { name: "buf", key: "buf", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 14 }, pkgPath: "encoding/hex", index: [2], offset: 34, exported: false }, { name: "used", key: "used", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "encoding/hex", index: [3], offset: 48, exported: false }, { name: "n", key: "n", type: { kind: $.TypeKind.Basic, name: "uint" }, pkgPath: "encoding/hex", index: [4], offset: 56, exported: false }, { name: "closed", key: "closed", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "encoding/hex", index: [5], offset: 64, exported: false }]
	)
}

export const hextable: string = "0123456789abcdef"

export const reverseHexTable: string = $.bytesToString(new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 255, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]))

export const bufferSize: number = 1024

export function EncodedLen(n: number): number {
	return n * 2
}

export function Encode(dst: $.Slice<number>, src: $.Slice<number>): number {
	let j = 0
	for (let __goscriptRangeTarget0 = src, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let v = __goscriptRangeTarget0![__rangeIndex]
		dst![j] = $.uint($.indexStringOrBytes("0123456789abcdef", $.uintShr(v, 4, 8)), 8)
		dst![j + 1] = $.uint($.indexStringOrBytes("0123456789abcdef", v & 0x0f), 8)
		j = j + (2)
	}
	return $.len(src) * 2
}

export function AppendEncode(dst: $.Slice<number>, src: $.Slice<number>): $.Slice<number> {
	let n = EncodedLen($.len(src))
	dst = (slices.Grow(dst, n) as $.Slice<number>)
	Encode($.goSlice($.goSlice(dst, $.len(dst), undefined), undefined, n), src)
	return $.goSlice(dst, undefined, $.len(dst) + n)
}

export let ErrLength: $.GoError = errors.New("encoding/hex: odd length hex string")

export function __goscript_set_ErrLength(__goscriptValue: $.GoError): void {
	ErrLength = __goscriptValue
}

export async function InvalidByteError_Error(e: InvalidByteError): globalThis.Promise<string> {
	return fmt.Sprintf("encoding/hex: invalid byte: %#U", $.basicInterfaceValue($.int(e, 32), "rune", "int32"))
}

export function DecodedLen(x: number): number {
	return Math.trunc(x / 2)
}

export function Decode(dst: $.Slice<number>, src: $.Slice<number>): [number, $.GoError] {
	let i = 0
	let j = 1
	for (; j < $.len(src); j = j + (2)) {
		let p = $.uint($.arrayIndex(src!, j - 1), 8)
		let q = $.uint($.arrayIndex(src!, j), 8)

		let a = $.uint($.indexStringOrBytes($.bytesToString(new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 255, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])), p), 8)
		let b = $.uint($.indexStringOrBytes($.bytesToString(new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 255, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])), q), 8)
		if ($.uint(a, 8) > $.uint(0x0f, 8)) {
			return [i, $.namedValueInterfaceValue<$.GoError>($.uint(p, 8), "hex.InvalidByteError", {"Error": InvalidByteError_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "hex.InvalidByteError" })]
		}
		if ($.uint(b, 8) > $.uint(0x0f, 8)) {
			return [i, $.namedValueInterfaceValue<$.GoError>($.uint(q, 8), "hex.InvalidByteError", {"Error": InvalidByteError_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "hex.InvalidByteError" })]
		}
		dst![i] = $.uint((a << 4) | b, 8)
		i++
	}
	if (($.len(src) % 2) == 1) {
		// Check for invalid char before reporting bad length,
		// since the invalid char (if present) is an earlier problem.
		if ($.uint($.indexStringOrBytes($.bytesToString(new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 255, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 10, 11, 12, 13, 14, 15, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])), $.arrayIndex(src!, j - 1)), 8) > $.uint(0x0f, 8)) {
			return [i, $.namedValueInterfaceValue<$.GoError>($.uint($.arrayIndex(src!, j - 1), 8), "hex.InvalidByteError", {"Error": InvalidByteError_Error}, { kind: $.TypeKind.Basic, name: "uint8", typeName: "hex.InvalidByteError" })]
		}
		return [i, ErrLength]
	}
	return [i, null]
}

export function AppendDecode(dst: $.Slice<number>, src: $.Slice<number>): [$.Slice<number>, $.GoError] {
	let n = DecodedLen($.len(src))
	dst = (slices.Grow(dst, n) as $.Slice<number>)
	let __goscriptTuple0: any = Decode($.goSlice($.goSlice(dst, $.len(dst), undefined), undefined, n), src)
	n = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	return [$.goSlice(dst, undefined, $.len(dst) + n), err]
}

export function EncodeToString(src: $.Slice<number>): string {
	let dst: $.Slice<number> = $.makeSlice<number>(EncodedLen($.len(src)), undefined, "byte")
	Encode(dst, src)
	return $.bytesToString(dst)
}

export function DecodeString(s: string): [$.Slice<number>, $.GoError] {
	let dst: $.Slice<number> = $.makeSlice<number>(DecodedLen($.len(s)), undefined, "byte")
	let [n, err] = Decode(dst, $.stringToBytes(s))
	return [$.goSlice(dst, undefined, n), err]
}

export async function Dump(data: $.Slice<number>): globalThis.Promise<string> {
	if ($.len(data) == 0) {
		return ""
	}

	let buf: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
	// Dumper will write 79 bytes per complete 16 byte chunk, and at least
	// 64 bytes for whatever remains. Round the allocation up, since only a
	// maximum of 15 bytes will be wasted.
	buf.value.Grow((1 + (Math.trunc(($.len(data) - 1) / 16))) * 79)

	let __goscriptShadow0 = Dumper($.interfaceValue<io.Writer | null>(buf, "*strings.Builder", { kind: $.TypeKind.Pointer, elemType: "strings.Builder" }))
	await $.pointerValue<Exclude<io.WriteCloser, null>>(__goscriptShadow0).Write(data)
	await $.pointerValue<Exclude<io.WriteCloser, null>>(__goscriptShadow0).Close()
	return buf.value.String()
}

export function NewEncoder(w: io.Writer | null): io.Writer | null {
	return $.interfaceValue<io.Writer | null>(new encoder({w: w}), "*hex.encoder", { kind: $.TypeKind.Pointer, elemType: "hex.encoder" })
}

export function NewDecoder(r: io.Reader | null): io.Reader | null {
	return $.interfaceValue<io.Reader | null>(new decoder({r: r}), "*hex.decoder", { kind: $.TypeKind.Pointer, elemType: "hex.decoder" })
}

export function Dumper(w: io.Writer | null): io.WriteCloser | null {
	return $.interfaceValue<io.WriteCloser | null>(new dumper({w: w}), "*hex.dumper", { kind: $.TypeKind.Pointer, elemType: "hex.dumper" })
}

export function toChar(b: number): number {
	if (($.uint(b, 8) < $.uint(32, 8)) || ($.uint(b, 8) > $.uint(126, 8))) {
		return $.uint(46, 8)
	}
	return $.uint(b, 8)
}

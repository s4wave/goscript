import * as $ from "@goscript/builtin/index.js";
import { direntIno, direntNamlen, direntReclen, direntType } from "./dirent_js.gs.js";
import { IsNotExist } from "./error.gs.js";
import { newUnixDirent } from "./file_unix_js.gs.js";

import * as byteorder from "@goscript/internal/byteorder/index.js"

import * as goarch from "@goscript/internal/goarch/index.js"

import * as io from "@goscript/io/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as sync from "@goscript/sync/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as unsafe from "@goscript/unsafe/index.js"

// Import uintptr type
type uintptr = syscall.uintptr

class dirInfo {
	public get mu(): sync.Mutex {
		return this._fields.mu
	}
	public set mu(value: sync.Mutex) {
		this._fields.mu = value
	}

	// buffer for directory I/O
	public get buf(): $.VarRef<$.Bytes> | null {
		return this._fields.buf
	}
	public set buf(value: $.VarRef<$.Bytes> | null) {
		this._fields.buf = value
	}

	// length of buf; return value from Getdirentries
	public get nbuf(): number {
		return this._fields.nbuf
	}
	public set nbuf(value: number) {
		this._fields.nbuf = value
	}

	// location of next record in buf.
	public get bufp(): number {
		return this._fields.bufp
	}
	public set bufp(value: number) {
		this._fields.bufp = value
	}

	public _fields: {
		mu: sync.Mutex;
		buf: $.VarRef<$.Bytes> | null;
		nbuf: number;
		bufp: number;
	}

	constructor(init?: Partial<{buf?: $.VarRef<$.Bytes> | null, bufp?: number, mu?: sync.Mutex, nbuf?: number}>) {
		this._fields = {
			mu: init?.mu?.clone() ?? new sync.Mutex(),
			buf: init?.buf ?? null,
			nbuf: init?.nbuf ?? 0,
			bufp: init?.bufp ?? 0
		}
	}

	public clone(): dirInfo {
		const cloned = new dirInfo()
		cloned._fields = {
			mu: this._fields.mu?.clone() ?? null,
			buf: this._fields.buf,
			nbuf: this._fields.nbuf,
			bufp: this._fields.bufp
		}
		return cloned
	}

	public close(): void {
		const d = this
		if (d.buf != null) {
			dirBufPool.Put(d.buf)
			d.buf = null
		}
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'dirInfo',
	  new dirInfo(),
	  [{ name: "close", args: [], returns: [] }],
	  dirInfo,
	  [{ name: "mu", key: "mu", type: "Mutex" }, { name: "buf", key: "buf", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } } }, { name: "nbuf", key: "nbuf", type: { kind: $.TypeKind.Basic, name: "number" } }, { name: "bufp", key: "bufp", type: { kind: $.TypeKind.Basic, name: "number" } }]
	);
}

// More than 5760 to work around https://golang.org/issue/24015.
let blockSize: number = 8192

let dirBufPool: sync.Pool = new sync.Pool({New: (): null | any => {
	// The buffer must be at least a block long.
	let buf = new Uint8Array(8192)
	return buf
}})

// readInt returns the size-bytes unsigned integer in native byte order at offset off.
export function readInt(b: $.Bytes, off: uintptr, size: uintptr): [number, boolean] {
	let u: number = 0
	let ok: boolean = false
	{
		if ($.len(b) < $.int(off + size)) {
			return [0, false]
		}
		if (goarch.BigEndian) {
			return [readIntBE($.goSlice(b, off, undefined), size), true]
		}
		return [readIntLE($.goSlice(b, off, undefined), size), true]
	}
}

export function readIntBE(b: $.Bytes, size: uintptr): number {
	switch (size) {
		case 1:
			return (b![0] as number)
		case 2:
			return (byteorder.BEUint16(b) as number)
		case 4:
			return (byteorder.BEUint32(b) as number)
		case 8:
			return Number(byteorder.BEUint64(b))
		default:
			$.panic("syscall: readInt with unsupported size")
			return 0 // This line will never be reached due to panic, but satisfies TypeScript
	}
}

export function readIntLE(b: $.Bytes, size: uintptr): number {
	switch (size) {
		case 1:
			return (b![0] as number)
		case 2:
			return (byteorder.LEUint16(b) as number)
		case 4:
			return (byteorder.LEUint32(b) as number)
		case 8:
			return Number(byteorder.LEUint64(b))
		default:
			$.panic("syscall: readInt with unsupported size")
			return 0 // This line will never be reached due to panic, but satisfies TypeScript
	}
}

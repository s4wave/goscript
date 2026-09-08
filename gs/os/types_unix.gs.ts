import * as $ from "@goscript/builtin/index.js";

import * as fs from "@goscript/io/fs/index.js"

import * as syscall from "@goscript/syscall/index.js"

import * as time from "@goscript/time/index.js"

class fileStat {
	public get name(): string {
		return this._fields.name
	}
	public set name(value: string) {
		this._fields.name = value
	}

	public get size(): number {
		return this._fields.size
	}
	public set size(value: number) {
		this._fields.size = value
	}

	public get mode(): fs.FileMode {
		return this._fields.mode
	}
	public set mode(value: fs.FileMode) {
		this._fields.mode = value
	}

	public get modTime(): time.Time {
		return this._fields.modTime
	}
	public set modTime(value: time.Time) {
		this._fields.modTime = value
	}

	public get sys(): syscall.Stat_t {
		return this._fields.sys
	}
	public set sys(value: syscall.Stat_t) {
		this._fields.sys = value
	}

	public _fields: {
		name: string;
		size: number;
		mode: fs.FileMode;
		modTime: time.Time;
		sys: syscall.Stat_t;
	}

	constructor(init?: Partial<{modTime?: time.Time, mode?: fs.FileMode, name?: string, size?: number, sys?: syscall.Stat_t}>) {
		this._fields = {
			name: init?.name ?? "",
			size: init?.size ?? 0,
			mode: init?.mode ?? 0,
			modTime: init?.modTime?.clone() ?? time.Now(),
			sys: init?.sys?.clone() ?? new syscall.Stat_t()
		}
	}

	public clone(): fileStat {
		const cloned = new fileStat()
		cloned._fields = {
			name: this._fields.name,
			size: this._fields.size,
			mode: this._fields.mode,
			modTime: this._fields.modTime?.clone() ?? null,
			sys: this._fields.sys?.clone() ?? null
		}
		return cloned
	}

	public Name(): string {
		const fs = this
		return fs!.name
	}

	public IsDir(): boolean {
		const fileStat = this
		return (fileStat!.Mode() & fs.ModeDir) !== 0
	}

	public Size(): bigint {
		const fs = this
		return BigInt(fs!.size)
	}

	public Mode(): fs.FileMode {
		const fileStat = this
		return fileStat!.mode
	}

	public ModTime(): time.Time {
		const fs = this
		return fs!.modTime
	}

	public Sys(): null | any {
		const fs = this
		return fs!.sys
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'fileStat',
	  new fileStat(),
	  [{ name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "IsDir", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }, { name: "Size", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }] }, { name: "Mode", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "number" } }] }, { name: "ModTime", args: [], returns: [{ type: "Time" }] }, { name: "Sys", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
	  fileStat,
	  [{ name: "name", key: "name", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "size", key: "size", type: { kind: $.TypeKind.Basic, name: "number" } }, { name: "mode", key: "mode", type: { kind: $.TypeKind.Basic, name: "number" } }, { name: "modTime", key: "modTime", type: "Time" }, { name: "sys", key: "sys", type: "Stat_t" }]
	);
}

export function sameFile(fs1: fileStat | null, fs2: fileStat | null): boolean {
	return fs1!.sys.Dev == fs2!.sys.Dev && fs1!.sys.Ino == fs2!.sys.Ino
}


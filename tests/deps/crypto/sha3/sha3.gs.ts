// Generated file based on sha3.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as crypto from "@goscript/crypto/index.js"

import * as sha32 from "@goscript/crypto/internal/fips140/sha3/index.js"

import * as hash from "@goscript/hash/index.js"

import "@goscript/unsafe/index.js"
import "@goscript/crypto/index.js"
import "@goscript/crypto/internal/fips140/sha3/index.js"
import "@goscript/hash/index.js"

export class SHA3 {
	public get s(): sha32.Digest {
		return this._fields.s.value
	}
	public set s(value: sha32.Digest) {
		this._fields.s.value = value
	}

	public _fields: {
		s: $.VarRef<sha32.Digest>
	}

	constructor(init?: Partial<{s?: sha32.Digest}>) {
		this._fields = {
			s: $.varRef(init?.s ? $.markAsStructValue($.cloneStructValue(init.s)) : $.markAsStructValue(new sha32.Digest()))
		}
	}

	public clone(): SHA3 {
		const cloned = new SHA3()
		cloned._fields = {
			s: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.s.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public AppendBinary(p: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const s: SHA3 | $.VarRef<SHA3> | null = this
		SHA3.prototype.init.call(s)
		return $.pointerValue<SHA3>(s).s.AppendBinary(p)
	}

	public BlockSize(): number {
		const s: SHA3 | $.VarRef<SHA3> | null = this
		SHA3.prototype.init.call(s)
		return $.pointerValue<SHA3>(s).s.BlockSize()
	}

	public Clone(): [hash.Cloner | null, $.GoError] {
		const d: SHA3 | $.VarRef<SHA3> | null = this
		let r = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<SHA3>(d))))
		return [$.interfaceValue<hash.Cloner | null>(r, "*sha3.SHA3", { kind: $.TypeKind.Pointer, elemType: "sha3.SHA3" }), null]
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const s: SHA3 | $.VarRef<SHA3> | null = this
		SHA3.prototype.init.call(s)
		return $.pointerValue<SHA3>(s).s.MarshalBinary()
	}

	public Reset(): void {
		const s: SHA3 | $.VarRef<SHA3> | null = this
		SHA3.prototype.init.call(s)
		$.pointerValue<SHA3>(s).s.Reset()
	}

	public Size(): number {
		const s: SHA3 | $.VarRef<SHA3> | null = this
		SHA3.prototype.init.call(s)
		return $.pointerValue<SHA3>(s).s.Size()
	}

	public Sum(b: $.Slice<number>): $.Slice<number> {
		const s: SHA3 | $.VarRef<SHA3> | null = this
		SHA3.prototype.init.call(s)
		return $.pointerValue<SHA3>(s).s.Sum(b)
	}

	public UnmarshalBinary(data: $.Slice<number>): $.GoError {
		const s: SHA3 | $.VarRef<SHA3> | null = this
		SHA3.prototype.init.call(s)
		return $.pointerValue<SHA3>(s).s.UnmarshalBinary(data)
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		const s: SHA3 | $.VarRef<SHA3> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		SHA3.prototype.init.call(s)
		return $.pointerValue<SHA3>(s).s.Write(p)
	}

	public init(): void {
		let s: SHA3 | $.VarRef<SHA3> | null = this
		if ($.pointerValue<SHA3>(s).s.Size() == 0) {
			$.assignStruct($.pointerValue<SHA3>(s), $.markAsStructValue($.cloneStructValue($.pointerValue<SHA3>(New256()))))
		}
	}

	static __typeInfo = $.registerStructType(
		"sha3.SHA3",
		() => new SHA3(),
		[{ name: "AppendBinary", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Clone", args: [], returns: [{ name: "_r0", type: "hash.Cloner" }, { name: "_r1", type: "error" }] }, { name: "MarshalBinary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Reset", args: [], returns: [] }, { name: "Size", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Sum", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "UnmarshalBinary", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "init", args: [], returns: [] }],
		SHA3,
		[{ name: "s", key: "s", type: "sha3.Digest", pkgPath: "crypto/sha3", index: [0], offset: 0, exported: false }]
	)
}

export class SHAKE {
	public get s(): sha32.SHAKE {
		return this._fields.s.value
	}
	public set s(value: sha32.SHAKE) {
		this._fields.s.value = value
	}

	public _fields: {
		s: $.VarRef<sha32.SHAKE>
	}

	constructor(init?: Partial<{s?: sha32.SHAKE}>) {
		this._fields = {
			s: $.varRef(init?.s ? $.markAsStructValue($.cloneStructValue(init.s)) : $.markAsStructValue(new sha32.SHAKE()))
		}
	}

	public clone(): SHAKE {
		const cloned = new SHAKE()
		cloned._fields = {
			s: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.s.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public AppendBinary(p: $.Slice<number>): [$.Slice<number>, $.GoError] {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		SHAKE.prototype.init.call(s)
		return $.pointerValue<SHAKE>(s).s.AppendBinary(p)
	}

	public BlockSize(): number {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		SHAKE.prototype.init.call(s)
		return $.pointerValue<SHAKE>(s).s.BlockSize()
	}

	public MarshalBinary(): [$.Slice<number>, $.GoError] {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		SHAKE.prototype.init.call(s)
		return $.pointerValue<SHAKE>(s).s.MarshalBinary()
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		SHAKE.prototype.init.call(s)
		return $.pointerValue<SHAKE>(s).s.Read(p)
	}

	public Reset(): void {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		SHAKE.prototype.init.call(s)
		$.pointerValue<SHAKE>(s).s.Reset()
	}

	public UnmarshalBinary(data: $.Slice<number>): $.GoError {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		SHAKE.prototype.init.call(s)
		return $.pointerValue<SHAKE>(s).s.UnmarshalBinary(data)
	}

	public Write(p: $.Slice<number>): [number, $.GoError] {
		const s: SHAKE | $.VarRef<SHAKE> | null = this
		let n: number = 0
		let err: $.GoError = null as $.GoError
		SHAKE.prototype.init.call(s)
		return $.pointerValue<SHAKE>(s).s.Write(p)
	}

	public init(): void {
		let s: SHAKE | $.VarRef<SHAKE> | null = this
		if ($.pointerValue<SHAKE>(s).s.Size() == 0) {
			$.assignStruct($.pointerValue<SHAKE>(s), $.markAsStructValue($.cloneStructValue($.pointerValue<SHAKE>(NewSHAKE256()))))
		}
	}

	static __typeInfo = $.registerStructType(
		"sha3.SHAKE",
		() => new SHAKE(),
		[{ name: "AppendBinary", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "BlockSize", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "MarshalBinary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "Read", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "Reset", args: [], returns: [] }, { name: "UnmarshalBinary", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Write", args: [{ name: "p", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "init", args: [], returns: [] }],
		SHAKE,
		[{ name: "s", key: "s", type: "sha3.SHAKE", pkgPath: "crypto/sha3", index: [0], offset: 0, exported: false }]
	)
}

function __goscriptInit0(): void {
	crypto.RegisterHash(crypto.SHA3_224, $.functionValue((): hash.Hash | null => {
		return $.interfaceValue<hash.Hash | null>(New224(), "*sha3.SHA3", { kind: $.TypeKind.Pointer, elemType: "sha3.SHA3" })
	}, ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)))
	crypto.RegisterHash(crypto.SHA3_256, $.functionValue((): hash.Hash | null => {
		return $.interfaceValue<hash.Hash | null>(New256(), "*sha3.SHA3", { kind: $.TypeKind.Pointer, elemType: "sha3.SHA3" })
	}, ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)))
	crypto.RegisterHash(crypto.SHA3_384, $.functionValue((): hash.Hash | null => {
		return $.interfaceValue<hash.Hash | null>(New384(), "*sha3.SHA3", { kind: $.TypeKind.Pointer, elemType: "sha3.SHA3" })
	}, ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)))
	crypto.RegisterHash(crypto.SHA3_512, $.functionValue((): hash.Hash | null => {
		return $.interfaceValue<hash.Hash | null>(New512(), "*sha3.SHA3", { kind: $.TypeKind.Pointer, elemType: "sha3.SHA3" })
	}, ({ kind: $.TypeKind.Function, params: [], results: ["hash.Hash"] } as $.FunctionTypeInfo)))
}

export function Sum224(data: $.Slice<number>): Uint8Array {
	let out: Uint8Array = new Uint8Array(28)
	let h: sha32.Digest | $.VarRef<sha32.Digest> | null = sha32.New224()
	sha32.Digest.prototype.Write.call(h, data)
	sha32.Digest.prototype.Sum.call(h, $.goSlice(out, undefined, 0))
	return out
}

export function Sum256(data: $.Slice<number>): Uint8Array {
	let out: Uint8Array = new Uint8Array(32)
	let h: sha32.Digest | $.VarRef<sha32.Digest> | null = sha32.New256()
	sha32.Digest.prototype.Write.call(h, data)
	sha32.Digest.prototype.Sum.call(h, $.goSlice(out, undefined, 0))
	return out
}

export function Sum384(data: $.Slice<number>): Uint8Array {
	let out: Uint8Array = new Uint8Array(48)
	let h: sha32.Digest | $.VarRef<sha32.Digest> | null = sha32.New384()
	sha32.Digest.prototype.Write.call(h, data)
	sha32.Digest.prototype.Sum.call(h, $.goSlice(out, undefined, 0))
	return out
}

export function Sum512(data: $.Slice<number>): Uint8Array {
	let out: Uint8Array = new Uint8Array(64)
	let h: sha32.Digest | $.VarRef<sha32.Digest> | null = sha32.New512()
	sha32.Digest.prototype.Write.call(h, data)
	sha32.Digest.prototype.Sum.call(h, $.goSlice(out, undefined, 0))
	return out
}

export function SumSHAKE128(data: $.Slice<number>, length: number): $.Slice<number> {
	// Outline the allocation for up to 256 bits of output to the caller's stack.
	let out: $.Slice<number> = $.makeSlice<number>(32, undefined, "byte")
	return sumSHAKE128(out, data, length)
}

export function sumSHAKE128(out: $.Slice<number>, data: $.Slice<number>, length: number): $.Slice<number> {
	if ($.len(out) < length) {
		out = $.makeSlice<number>(length, undefined, "byte")
	} else {
		out = $.goSlice(out, undefined, length)
	}
	let h: sha32.SHAKE | $.VarRef<sha32.SHAKE> | null = sha32.NewShake128()
	sha32.SHAKE.prototype.Write.call(h, data)
	sha32.SHAKE.prototype.Read.call(h, out)
	return out
}

export function SumSHAKE256(data: $.Slice<number>, length: number): $.Slice<number> {
	// Outline the allocation for up to 512 bits of output to the caller's stack.
	let out: $.Slice<number> = $.makeSlice<number>(64, undefined, "byte")
	return sumSHAKE256(out, data, length)
}

export function sumSHAKE256(out: $.Slice<number>, data: $.Slice<number>, length: number): $.Slice<number> {
	if ($.len(out) < length) {
		out = $.makeSlice<number>(length, undefined, "byte")
	} else {
		out = $.goSlice(out, undefined, length)
	}
	let h: sha32.SHAKE | $.VarRef<sha32.SHAKE> | null = sha32.NewShake256()
	sha32.SHAKE.prototype.Write.call(h, data)
	sha32.SHAKE.prototype.Read.call(h, out)
	return out
}

export function fips140hash_sha3Unwrap(sha3: SHA3 | $.VarRef<SHA3> | null): sha32.Digest | $.VarRef<sha32.Digest> | null {
	return $.pointerValue<SHA3>(sha3)._fields.s
}

export function New224(): SHA3 | $.VarRef<SHA3> | null {
	return (() => { const __goscriptLiteralField0 = $.markAsStructValue($.cloneStructValue($.pointerValue<sha32.Digest>(sha32.New224()))); return new SHA3({s: __goscriptLiteralField0}) })()
}

export function New256(): SHA3 | $.VarRef<SHA3> | null {
	return (() => { const __goscriptLiteralField1 = $.markAsStructValue($.cloneStructValue($.pointerValue<sha32.Digest>(sha32.New256()))); return new SHA3({s: __goscriptLiteralField1}) })()
}

export function New384(): SHA3 | $.VarRef<SHA3> | null {
	return (() => { const __goscriptLiteralField2 = $.markAsStructValue($.cloneStructValue($.pointerValue<sha32.Digest>(sha32.New384()))); return new SHA3({s: __goscriptLiteralField2}) })()
}

export function New512(): SHA3 | $.VarRef<SHA3> | null {
	return (() => { const __goscriptLiteralField3 = $.markAsStructValue($.cloneStructValue($.pointerValue<sha32.Digest>(sha32.New512()))); return new SHA3({s: __goscriptLiteralField3}) })()
}

export function NewSHAKE128(): SHAKE | $.VarRef<SHAKE> | null {
	return (() => { const __goscriptLiteralField4 = $.markAsStructValue($.cloneStructValue($.pointerValue<sha32.SHAKE>(sha32.NewShake128()))); return new SHAKE({s: __goscriptLiteralField4}) })()
}

export function NewSHAKE256(): SHAKE | $.VarRef<SHAKE> | null {
	return (() => { const __goscriptLiteralField5 = $.markAsStructValue($.cloneStructValue($.pointerValue<sha32.SHAKE>(sha32.NewShake256()))); return new SHAKE({s: __goscriptLiteralField5}) })()
}

export function NewCSHAKE128(N: $.Slice<number>, S: $.Slice<number>): SHAKE | $.VarRef<SHAKE> | null {
	return (() => { const __goscriptLiteralField6 = $.markAsStructValue($.cloneStructValue($.pointerValue<sha32.SHAKE>(sha32.NewCShake128(N, S)))); return new SHAKE({s: __goscriptLiteralField6}) })()
}

export function NewCSHAKE256(N: $.Slice<number>, S: $.Slice<number>): SHAKE | $.VarRef<SHAKE> | null {
	return (() => { const __goscriptLiteralField7 = $.markAsStructValue($.cloneStructValue($.pointerValue<sha32.SHAKE>(sha32.NewCShake256(N, S)))); return new SHAKE({s: __goscriptLiteralField7}) })()
}

__goscriptInit0()

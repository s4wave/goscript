// Generated file based on package_import_crypto_ecdh_custom_reader.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/crypto/ecdh/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"

export class segmentedReader {
	public get data(): $.Slice<number> {
		return this._fields.data.value
	}
	public set data(value: $.Slice<number>) {
		this._fields.data.value = value
	}

	public get offset(): number {
		return this._fields.offset.value
	}
	public set offset(value: number) {
		this._fields.offset.value = value
	}

	public get step(): number {
		return this._fields.step.value
	}
	public set step(value: number) {
		this._fields.step.value = value
	}

	public _fields: {
		data: $.VarRef<$.Slice<number>>
		offset: $.VarRef<number>
		step: $.VarRef<number>
	}

	constructor(init?: Partial<{data?: $.Slice<number>, offset?: number, step?: number}>) {
		this._fields = {
			data: $.varRef(init?.data ?? (null! as $.Slice<number>)),
			offset: $.varRef(init?.offset ?? (0 as number)),
			step: $.varRef(init?.step ?? (0 as number))
		}
	}

	public clone(): segmentedReader {
		const cloned = new segmentedReader()
		cloned._fields = {
			data: $.varRef(this._fields.data.value),
			offset: $.varRef(this._fields.offset.value),
			step: $.varRef(this._fields.step.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		let r: segmentedReader | $.VarRef<segmentedReader> | null = this
		if ($.pointerValue<segmentedReader>(r).offset >= $.len($.pointerValue<segmentedReader>(r).data)) {
			return [0, io.EOF]
		}
		let n = (() => { const __goscriptMinMax0 = $.pointerValue<segmentedReader>(r).step; const __goscriptMinMax1 = $.len(p); const __goscriptMinMax2 = $.len($.pointerValue<segmentedReader>(r).data) - $.pointerValue<segmentedReader>(r).offset; let __goscriptMinMax3 = __goscriptMinMax0; __goscriptMinMax3 = $.min(__goscriptMinMax3, __goscriptMinMax1); __goscriptMinMax3 = $.min(__goscriptMinMax3, __goscriptMinMax2); return __goscriptMinMax3 })()
		$.copy(p, $.goSlice($.pointerValue<segmentedReader>(r).data, $.pointerValue<segmentedReader>(r).offset, $.pointerValue<segmentedReader>(r).offset + n))
		$.pointerValue<segmentedReader>(r).offset = $.pointerValue<segmentedReader>(r).offset + (n)
		return [n, null]
	}

	static __typeInfo = $.registerStructType(
		"main.segmentedReader",
		() => new segmentedReader(),
		[{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		segmentedReader,
		[{ name: "data", key: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "offset", key: "offset", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "step", key: "step", type: { kind: $.TypeKind.Basic, name: "int" } }]
	)
}

export class failingReader {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): failingReader {
		const cloned = new failingReader()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Read(p: $.Slice<number>): [number, $.GoError] {
		let n = $.copy(p, new Uint8Array([1, 2, 3, 4, 5, 6, 7]) as $.Slice<number>)
		return [n, errReaderFailed]
	}

	static __typeInfo = $.registerStructType(
		"main.failingReader",
		() => new failingReader(),
		[{ name: "Read", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }, { type: "error" }] }],
		failingReader,
		[]
	)
}

export let errReaderFailed: $.GoError = errors.New("reader failed")

export function __goscript_set_errReaderFailed(__goscriptValue: $.GoError): void {
	errReaderFailed = __goscriptValue
}

export async function main(): globalThis.Promise<void> {
	let deterministicBytes: $.Slice<number> = bytes.Repeat(new Uint8Array([42]) as $.Slice<number>, 64)
	let __goscriptTuple0: any = await $.pointerValue<Exclude<ecdh.Curve, null>>(ecdh.X25519()).GenerateKey($.pointerValueOrNil($.interfaceValue<io.Reader | null>(bytes.NewReader(deterministicBytes), "*bytes.Reader", { kind: $.TypeKind.Pointer, elemType: "bytes.Reader" }))!)
	let deterministic: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	$.println("deterministic err nil", err == null)
	$.println("deterministic private matches", bytes.Equal(ecdh.PrivateKey.prototype.Bytes.call($.pointerValue<ecdh.PrivateKey>(deterministic)), $.goSlice(deterministicBytes, undefined, 32)))
	$.println("deterministic public len", $.len(ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>(ecdh.PrivateKey.prototype.PublicKey.call($.pointerValue<ecdh.PrivateKey>(deterministic))))))

	let segmentedBytes: $.Slice<number> = bytes.Repeat(new Uint8Array([43]) as $.Slice<number>, 64)
	let __goscriptTuple1: any = await $.pointerValue<Exclude<ecdh.Curve, null>>(ecdh.X25519()).GenerateKey($.pointerValueOrNil($.interfaceValue<io.Reader | null>(new segmentedReader({data: segmentedBytes, step: 5}), "*main.segmentedReader", { kind: $.TypeKind.Pointer, elemType: "main.segmentedReader" }))!)
	let segmented: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	$.println("segmented err nil", err == null)
	$.println("segmented private matches", bytes.Equal(ecdh.PrivateKey.prototype.Bytes.call($.pointerValue<ecdh.PrivateKey>(segmented)), $.goSlice(segmentedBytes, undefined, 32)))
	$.println("segmented public len", $.len(ecdh.PublicKey.prototype.Bytes.call($.pointerValue<ecdh.PublicKey>(ecdh.PrivateKey.prototype.PublicKey.call($.pointerValue<ecdh.PrivateKey>(segmented))))))

	let __goscriptTuple2: any = await $.pointerValue<Exclude<ecdh.Curve, null>>(ecdh.X25519()).GenerateKey($.pointerValueOrNil($.interfaceValue<io.Reader | null>(bytes.NewReader($.goSlice(deterministicBytes, undefined, 31)), "*bytes.Reader", { kind: $.TypeKind.Pointer, elemType: "bytes.Reader" }))!)
	let short: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	$.println("premature key nil", short == null)
	$.println("premature unexpected EOF", errors.Is($.pointerValueOrNil(err)!, $.pointerValueOrNil(io.ErrUnexpectedEOF)!))

	let __goscriptTuple3: any = await $.pointerValue<Exclude<ecdh.Curve, null>>(ecdh.X25519()).GenerateKey($.pointerValueOrNil($.interfaceValue<io.Reader | null>(new failingReader(), "*main.failingReader", { kind: $.TypeKind.Pointer, elemType: "main.failingReader" }))!)
	let failed: ecdh.PrivateKey | $.VarRef<ecdh.PrivateKey> | null = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	$.println("explicit key nil", failed == null)
	$.println("explicit error propagated", errors.Is($.pointerValueOrNil(err)!, $.pointerValueOrNil(errReaderFailed)!))
}

if ($.isMainScript(import.meta)) {
	await main()
}

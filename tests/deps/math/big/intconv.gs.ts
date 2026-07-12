// Generated file based on intconv.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import type * as rand from "@goscript/math/rand/index.js"

import type * as __goscript_accuracy_string from "./accuracy_string.gs.ts"

import * as __goscript_arith from "./arith.gs.ts"

import type * as __goscript_float from "./float.gs.ts"

import * as __goscript_int from "./int.gs.ts"

import type * as __goscript_intmarsh from "./intmarsh.gs.ts"

import * as __goscript_nat from "./nat.gs.ts"

import * as __goscript_natconv from "./natconv.gs.ts"

import * as __goscript_natdiv from "./natdiv.gs.ts"

import * as __goscript_natmul from "./natmul.gs.ts"

import * as __goscript_prime from "./prime.gs.ts"

import type * as __goscript_rat from "./rat.gs.ts"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "./arith.gs.ts"
import "./int.gs.ts"
import "./nat.gs.ts"
import "./natconv.gs.ts"
import "./natdiv.gs.ts"
import "./natmul.gs.ts"
import "./prime.gs.ts"

export class byteReader {
	public get ScanState(): fmt.ScanState | null {
		return this._fields.ScanState.value
	}
	public set ScanState(value: fmt.ScanState | null) {
		this._fields.ScanState.value = value
	}

	public _fields: {
		ScanState: $.VarRef<fmt.ScanState | null>
	}

	constructor(init?: Partial<{ScanState?: fmt.ScanState | null}>) {
		this._fields = {
			ScanState: $.varRef(init?.ScanState ?? (null as fmt.ScanState | null))
		}
	}

	public clone(): byteReader {
		const cloned = new byteReader()
		cloned._fields = {
			ScanState: $.varRef(this._fields.ScanState.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async ReadByte(): globalThis.Promise<[number, $.GoError]> {
		const r = this
		let __goscriptTuple1: any = await $.pointerValue<Exclude<fmt.ScanState, null>>(r.ScanState).ReadRune()
		let ch = $.int(__goscriptTuple1[0], 32)
		let size = __goscriptTuple1[1]
		let err = __goscriptTuple1[2]
		if ((size != 1) && (err == null)) {
			err = fmt.Errorf("invalid rune %#U", $.namedValueInterfaceValue<any>(ch, "rune", {}, { kind: $.TypeKind.Basic, name: "int32" }))
		}
		return [$.uint($.uint(ch, 8), 8), err]
	}

	public async UnreadByte(): globalThis.Promise<$.GoError> {
		const r = this
		return $.pointerValue<Exclude<fmt.ScanState, null>>(r.ScanState).UnreadRune()
	}

	public Read(buf: any): any {
		return $.pointerValue<Exclude<fmt.ScanState | null, null>>(this.ScanState).Read(buf)
	}

	public async ReadRune(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<fmt.ScanState | null, null>>(this.ScanState).ReadRune()
	}

	public async SkipSpace(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<fmt.ScanState | null, null>>(this.ScanState).SkipSpace()
	}

	public async Token(skipSpace: any, f: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<fmt.ScanState | null, null>>(this.ScanState).Token(skipSpace, f)
	}

	public async UnreadRune(): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<fmt.ScanState | null, null>>(this.ScanState).UnreadRune()
	}

	public Width(): any {
		return $.pointerValue<Exclude<fmt.ScanState | null, null>>(this.ScanState).Width()
	}

	static __typeInfo = $.registerStructType(
		"big.byteReader",
		() => new byteReader(),
		[{ name: "ReadByte", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "uint8" } }, { name: "_r1", type: "error" }] }, { name: "UnreadByte", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Read", args: [{ name: "buf", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "ReadRune", args: [], returns: [{ name: "r", type: { kind: $.TypeKind.Basic, name: "int32" } }, { name: "size", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }, { name: "SkipSpace", args: [], returns: [] }, { name: "Token", args: [{ name: "skipSpace", type: { kind: $.TypeKind.Basic, name: "bool" } }, { name: "f", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int32" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo) }], returns: [{ name: "token", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "UnreadRune", args: [], returns: [{ name: "_r0", type: "error" }] }, { name: "Width", args: [], returns: [{ name: "wid", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "ok", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		byteReader,
		[{ name: "ScanState", key: "ScanState", type: "fmt.ScanState", anonymous: true, index: [0], offset: 0, exported: true }]
	)
}

export async function writeMultiple(s: fmt.State | null, text: string, count: number): globalThis.Promise<void> {
	if ($.len(text) > 0) {
		let b: $.Slice<number> = $.stringToBytes(text)
		for (; count > 0; count--) {
			await $.pointerValue<Exclude<fmt.State, null>>(s).Write(b)
		}
	}
}

export async function scanSign(r: io.ByteScanner | null): globalThis.Promise<[boolean, $.GoError]> {
	let neg: boolean = false
	let err: $.GoError = null as $.GoError
	let ch: number = 0
	{
		let __goscriptTuple0: any = await $.pointerValue<Exclude<io.ByteScanner, null>>(r).ReadByte()
		ch = $.uint(__goscriptTuple0[0], 8)
		err = __goscriptTuple0[1]
		if (err != null) {
			return [false, err]
		}
	}
	switch (ch) {
		case 45:
		{
			neg = true
			break
		}
		case 43:
		{
			break
		}
		default:
		{
			await $.pointerValue<Exclude<io.ByteScanner, null>>(r).UnreadByte()
			break
		}
	}
	return [neg, err]
}

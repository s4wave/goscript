// Generated file based on rand.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as boring from "@goscript/crypto/internal/boring/index.js"

import * as drbg from "@goscript/crypto/internal/fips140/drbg/index.js"

import * as randutil from "@goscript/crypto/internal/randutil/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as io from "@goscript/io/index.js"

import "@goscript/unsafe/index.js"

import * as __goscript_rand_fips140v1_26 from "./rand_fips140v1.26.gs.ts"
import "@goscript/crypto/internal/boring/index.js"
import "@goscript/crypto/internal/fips140/drbg/index.js"
import "@goscript/crypto/internal/randutil/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/io/index.js"
import "./rand_fips140v1.26.gs.ts"

export class reader {
	public get DefaultReader(): drbg.DefaultReader | null {
		return this._fields.DefaultReader.value
	}
	public set DefaultReader(value: drbg.DefaultReader | null) {
		this._fields.DefaultReader.value = value
	}

	public _fields: {
		DefaultReader: $.VarRef<drbg.DefaultReader | null>
	}

	constructor(init?: Partial<{DefaultReader?: drbg.DefaultReader | null}>) {
		this._fields = {
			DefaultReader: $.varRef(init?.DefaultReader ?? (null! as drbg.DefaultReader | null))
		}
	}

	public clone(): reader {
		const cloned = new reader()
		cloned._fields = {
			DefaultReader: $.varRef(this._fields.DefaultReader.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Read(b: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const r = this
		let n: number = 0
		let err: $.GoError = null! as $.GoError
		if (boring.Enabled) {
			{
				let [, __goscriptShadow0] = boring.randReader_Read(boring.RandReader, b)
				if (__goscriptShadow0 != null) {
					$.panic("crypto/rand: boring RandReader failed: " + $.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow0).Error())
				}
			}
			return [$.len(b), null]
		}
		await drbg.Read(b)
		return [$.len(b), null]
	}

	static __typeInfo = $.registerStructType(
		"rand.reader",
		() => new reader(),
		[{ name: "Read", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "err", type: "error" }] }],
		reader,
		[{ name: "DefaultReader", key: "DefaultReader", type: "drbg.DefaultReader", anonymous: true, index: [0], offset: 0, exported: true }]
	)
}

export let Reader: io.Reader | null = $.interfaceValue<io.Reader | null>($.markAsStructValue(new reader()), "rand.reader", "rand.reader")

export function __goscript_set_Reader(__goscriptValue: io.Reader | null): void {
	Reader = __goscriptValue
}

export function SetTestingReader(r: io.Reader | null): void {
	__goscript_rand_fips140v1_26.fips140SetTestingReader(r)
}

export let cryptocustomrand: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("cryptocustomrand")

export function __goscript_set_cryptocustomrand(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	cryptocustomrand = __goscriptValue
}

export async function CustomReader(r: io.Reader | null): globalThis.Promise<io.Reader | null> {
	if ($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(cryptocustomrand)), "1")) {
		if (!IsDefaultReader(r)) {
			await randutil.MaybeReadByte(r)
			godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(cryptocustomrand))
		}
		return r
	}
	return Reader
}

export function IsDefaultReader(r: io.Reader | null): boolean {
	let [, ok] = $.typeAssertTuple<drbg.DefaultReader | null>(r, "drbg.DefaultReader")
	return ok
}

// Generated file based on cast.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import "@goscript/crypto/internal/fips140/check/index.js"

import * as errors from "@goscript/errors/index.js"

import * as sync from "@goscript/sync/index.js"

import * as __goscript_field from "./field.gs.ts"

import * as __goscript_mlkem768 from "./mlkem768.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/errors/index.js"
import "@goscript/sync/index.js"
import "./field.gs.ts"
import "./mlkem768.gs.ts"

export var fipsSelfTest: (() => void) | null

export async function __goscript_init_fipsSelfTest(): globalThis.Promise<void> {
	if (((fipsSelfTest) as any) === undefined) {
		fipsSelfTest = sync.OnceFunc($.functionValue(async (): globalThis.Promise<void> => {
	await fips140.CAST("ML-KEM-768", $.functionValue((): $.GoError => {
		let d: $.VarRef<Uint8Array> | null = $.varRef(new Uint8Array([$.uint(0x01, 8), $.uint(0x02, 8), $.uint(0x03, 8), $.uint(0x04, 8), $.uint(0x05, 8), $.uint(0x06, 8), $.uint(0x07, 8), $.uint(0x08, 8), $.uint(0x09, 8), $.uint(0x0a, 8), $.uint(0x0b, 8), $.uint(0x0c, 8), $.uint(0x0d, 8), $.uint(0x0e, 8), $.uint(0x0f, 8), $.uint(0x10, 8), $.uint(0x11, 8), $.uint(0x12, 8), $.uint(0x13, 8), $.uint(0x14, 8), $.uint(0x15, 8), $.uint(0x16, 8), $.uint(0x17, 8), $.uint(0x18, 8), $.uint(0x19, 8), $.uint(0x1a, 8), $.uint(0x1b, 8), $.uint(0x1c, 8), $.uint(0x1d, 8), $.uint(0x1e, 8), $.uint(0x1f, 8), $.uint(0x20, 8)]))
		let z: $.VarRef<Uint8Array> | null = $.varRef(new Uint8Array([$.uint(0x21, 8), $.uint(0x22, 8), $.uint(0x23, 8), $.uint(0x24, 8), $.uint(0x25, 8), $.uint(0x26, 8), $.uint(0x27, 8), $.uint(0x28, 8), $.uint(0x29, 8), $.uint(0x2a, 8), $.uint(0x2b, 8), $.uint(0x2c, 8), $.uint(0x2d, 8), $.uint(0x2e, 8), $.uint(0x2f, 8), $.uint(0x30, 8), $.uint(0x31, 8), $.uint(0x32, 8), $.uint(0x33, 8), $.uint(0x34, 8), $.uint(0x35, 8), $.uint(0x36, 8), $.uint(0x37, 8), $.uint(0x38, 8), $.uint(0x39, 8), $.uint(0x3a, 8), $.uint(0x3b, 8), $.uint(0x3c, 8), $.uint(0x3d, 8), $.uint(0x3e, 8), $.uint(0x3f, 8), $.uint(0x40, 8)]))
		let m: $.VarRef<Uint8Array> | null = $.varRef(new Uint8Array([$.uint(0x41, 8), $.uint(0x42, 8), $.uint(0x43, 8), $.uint(0x44, 8), $.uint(0x45, 8), $.uint(0x46, 8), $.uint(0x47, 8), $.uint(0x48, 8), $.uint(0x49, 8), $.uint(0x4a, 8), $.uint(0x4b, 8), $.uint(0x4c, 8), $.uint(0x4d, 8), $.uint(0x4e, 8), $.uint(0x4f, 8), $.uint(0x50, 8), $.uint(0x51, 8), $.uint(0x52, 8), $.uint(0x53, 8), $.uint(0x54, 8), $.uint(0x55, 8), $.uint(0x56, 8), $.uint(0x57, 8), $.uint(0x58, 8), $.uint(0x59, 8), $.uint(0x5a, 8), $.uint(0x5b, 8), $.uint(0x5c, 8), $.uint(0x5d, 8), $.uint(0x5e, 8), $.uint(0x5f, 8), $.uint(0x60, 8)]))
		let K: $.Slice<number> = new Uint8Array([85, 1, 252, 82, 59, 116, 95, 65, 118, 42, 24, 141, 228, 74, 89, 185, 32, 244, 48, 20, 98, 4, 238, 78, 121, 55, 50, 57, 109, 247, 170, 72]) as $.Slice<number>
		let dk: __goscript_mlkem768.DecapsulationKey768 | $.VarRef<__goscript_mlkem768.DecapsulationKey768> | null = new __goscript_mlkem768.DecapsulationKey768()
		__goscript_mlkem768.kemKeyGen(dk, d, z)
		let ek: __goscript_mlkem768.EncapsulationKey768 | $.VarRef<__goscript_mlkem768.EncapsulationKey768> | null = __goscript_mlkem768.DecapsulationKey768.prototype.EncapsulationKey.call(dk)
		let cc: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(1088))
		let __goscriptTuple0: any = __goscript_mlkem768.kemEncaps(cc, ek, m)
		let Ke: $.Slice<number> = __goscriptTuple0[0]
		let Kd: $.Slice<number> = __goscript_mlkem768.kemDecaps(dk, cc)
		if (!bytes.Equal(Ke, K) || !bytes.Equal(Kd, K)) {
			return errors.New("unexpected result")
		}
		return null
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	}
}

export function __goscript_get_fipsSelfTest(): (() => void) | null {
	if (((fipsSelfTest) as any) === undefined) {
		throw new Error("goscript package variable fipsSelfTest read before initialization")
	}
	return fipsSelfTest
}

export function __goscript_set_fipsSelfTest(__goscriptValue: (() => void) | null): void {
	fipsSelfTest = __goscriptValue
}

await __goscript_init_fipsSelfTest()

// Generated file based on ctrkdf.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as aes from "@goscript/crypto/internal/fips140/aes/index.js"

import * as __goscript_cmac from "./cmac.gs.ts"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/aes/index.js"
import "./cmac.gs.ts"

export class CounterKDF {
	public get mac(): __goscript_cmac.CMAC {
		return this._fields.mac.value
	}
	public set mac(value: __goscript_cmac.CMAC) {
		this._fields.mac.value = value
	}

	public _fields: {
		mac: $.VarRef<__goscript_cmac.CMAC>
	}

	constructor(init?: Partial<{mac?: __goscript_cmac.CMAC}>) {
		this._fields = {
			mac: $.varRef(init?.mac ? $.markAsStructValue($.cloneStructValue(init.mac)) : $.markAsStructValue(new __goscript_cmac.CMAC()))
		}
	}

	public clone(): CounterKDF {
		const cloned = new CounterKDF()
		cloned._fields = {
			mac: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mac.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public DeriveKey(label: number, context: Uint8Array): Uint8Array {
		const kdf: CounterKDF | $.VarRef<CounterKDF> | null = this
		fips140.RecordApproved()
		let output: Uint8Array = new Uint8Array(32)

		let input: Uint8Array = new Uint8Array(16)
		input[2] = $.uint(label, 8)
		$.copy($.goSlice(input, 4, undefined), $.goSlice(context, undefined, undefined))

		input[1] = $.uint(0x01, 8)
		let K1 = $.pointerValue<CounterKDF>(kdf).mac.MAC($.goSlice(input, undefined, undefined))

		input[1] = $.uint(0x02, 8)
		let K2 = $.pointerValue<CounterKDF>(kdf).mac.MAC($.goSlice(input, undefined, undefined))

		$.copy($.goSlice(output, undefined, undefined), $.goSlice(K1, undefined, undefined))
		$.copy($.goSlice(output, aes.BlockSize, undefined), $.goSlice(K2, undefined, undefined))
		return output
	}

	static __typeInfo = $.registerStructType(
		"gcm.CounterKDF",
		() => new CounterKDF(),
		[{ name: "DeriveKey", args: [{ name: "label", type: { kind: $.TypeKind.Basic, name: "uint8" } }, { name: "context", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 12 } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 } }] }],
		CounterKDF,
		[{ name: "mac", key: "mac", type: "gcm.CMAC", pkgPath: "crypto/internal/fips140/aes/gcm", index: [0], offset: 0, exported: false }]
	)
}

export function NewCounterKDF(b: aes.Block | $.VarRef<aes.Block> | null): CounterKDF | $.VarRef<CounterKDF> | null {
	return (() => { const __goscriptLiteralField0 = $.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_cmac.CMAC>(__goscript_cmac.NewCMAC(b)))); return new CounterKDF({mac: __goscriptLiteralField0}) })()
}

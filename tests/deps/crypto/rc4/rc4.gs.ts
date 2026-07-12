// Generated file based on rc4.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as alias from "@goscript/crypto/internal/fips140/alias/index.js"

import * as fips140only from "@goscript/crypto/internal/fips140only/index.js"

import * as errors from "@goscript/errors/index.js"

import * as strconv from "@goscript/strconv/index.js"
import "@goscript/crypto/internal/fips140/alias/index.js"
import "@goscript/crypto/internal/fips140only/index.js"
import "@goscript/errors/index.js"
import "@goscript/strconv/index.js"

export type KeySizeError = number

export class Cipher {
	public get s(): number[] {
		return this._fields.s.value
	}
	public set s(value: number[]) {
		this._fields.s.value = value
	}

	public get i(): number {
		return this._fields.i.value
	}
	public set i(value: number) {
		this._fields.i.value = value
	}

	public get j(): number {
		return this._fields.j.value
	}
	public set j(value: number) {
		this._fields.j.value = value
	}

	public _fields: {
		s: $.VarRef<number[]>
		i: $.VarRef<number>
		j: $.VarRef<number>
	}

	constructor(init?: Partial<{s?: number[], i?: number, j?: number}>) {
		this._fields = {
			s: $.varRef(init?.s !== undefined ? $.cloneArrayValue(init.s) : Array.from({ length: 256 }, () => 0)),
			i: $.varRef(init?.i ?? (0 as number)),
			j: $.varRef(init?.j ?? (0 as number))
		}
	}

	public clone(): Cipher {
		const cloned = new Cipher()
		cloned._fields = {
			s: $.varRef($.cloneArrayValue(this._fields.s.value)),
			i: $.varRef(this._fields.i.value),
			j: $.varRef(this._fields.j.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Reset(): void {
		let c: Cipher | $.VarRef<Cipher> | null = this
		$.clear($.goSlice($.pointerValue<Cipher>(c).s, undefined, undefined))
		let __goscriptAssign0_0: number = $.uint(0, 8)
		let __goscriptAssign0_1: number = $.uint(0, 8)
		$.pointerValue<Cipher>(c).i = __goscriptAssign0_0
		$.pointerValue<Cipher>(c).j = __goscriptAssign0_1
	}

	public XORKeyStream(dst: $.Slice<number>, src: $.Slice<number>): void {
		let c: Cipher | $.VarRef<Cipher> | null = this
		if ($.len(src) == 0) {
			return
		}
		if (alias.InexactOverlap($.goSlice(dst, undefined, $.len(src)), src)) {
			$.panic("crypto/rc4: invalid buffer overlap")
		}
		let i = $.uint($.pointerValue<Cipher>(c).i, 8)
		let j = $.uint($.pointerValue<Cipher>(c).j, 8)
		$.arrayIndex(dst!, $.len(src) - 1)
		dst = $.goSlice(dst, undefined, $.len(src))
		for (let __goscriptRangeTarget0 = src, k = 0; k < $.len(__goscriptRangeTarget0); k++) {
			let v = __goscriptRangeTarget0![k]
			i = i + ($.uint(1, 8))
			let x = $.uint($.arrayIndex($.pointerValue<Cipher>(c).s, i), 32)
			j = j + ($.uint($.uint(x, 8), 8))
			let y = $.uint($.arrayIndex($.pointerValue<Cipher>(c).s, j), 32)
			let __goscriptAssign1_0: number = $.uint(y, 32)
			let __goscriptAssign1_1: number = $.uint(x, 32)
			$.pointerValue<Cipher>(c).s[i] = __goscriptAssign1_0
			$.pointerValue<Cipher>(c).s[j] = __goscriptAssign1_1
			dst![k] = $.uint(v ^ $.uint($.arrayIndex($.pointerValue<Cipher>(c).s, $.uint(x + y, 8)), 8), 8)
		}
		let __goscriptAssign2_0: number = $.uint(i, 8)
		let __goscriptAssign2_1: number = $.uint(j, 8)
		$.pointerValue<Cipher>(c).i = __goscriptAssign2_0
		$.pointerValue<Cipher>(c).j = __goscriptAssign2_1
	}

	static __typeInfo = $.registerStructType(
		"rc4.Cipher",
		() => new Cipher(),
		[{ name: "Reset", args: [], returns: [] }, { name: "XORKeyStream", args: [{ name: "dst", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "src", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }],
		Cipher,
		[{ name: "s", key: "s", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint32" }, length: 256 }, pkgPath: "crypto/rc4", index: [0], offset: 0, exported: false }, { name: "i", key: "i", type: { kind: $.TypeKind.Basic, name: "uint8" }, pkgPath: "crypto/rc4", index: [1], offset: 1024, exported: false }, { name: "j", key: "j", type: { kind: $.TypeKind.Basic, name: "uint8" }, pkgPath: "crypto/rc4", index: [2], offset: 1025, exported: false }]
	)
}

export function KeySizeError_Error(k: KeySizeError): string {
	return "crypto/rc4: invalid key size " + strconv.Itoa($.int(k))
}

export function NewCipher(key: $.Slice<number>): [Cipher | $.VarRef<Cipher> | null, $.GoError] {
	if (fips140only.Enforced()) {
		return [null, errors.New("crypto/rc4: use of RC4 is not allowed in FIPS 140-only mode")]
	}
	let k = $.len(key)
	if ((k < 1) || (k > 256)) {
		return [null, $.namedValueInterfaceValue<$.GoError>($.int(k), "rc4.KeySizeError", {"Error": KeySizeError_Error}, { kind: $.TypeKind.Basic, name: "int", typeName: "rc4.KeySizeError" })]
	}
	let c: $.VarRef<Cipher> = $.varRef($.markAsStructValue(new Cipher()))
	for (let i = 0; i < 256; i++) {
		c.value.s[i] = $.uint($.uint(i, 32), 32)
	}
	let j: number = $.uint(0, 8)
	for (let i = 0; i < 256; i++) {
		j = j + ($.uint($.uint($.arrayIndex(c.value.s, i), 8) + $.arrayIndex(key!, i % k), 8))
		let __goscriptAssign3_0: number = $.uint($.arrayIndex(c.value.s, j), 32)
		let __goscriptAssign3_1: number = $.uint($.arrayIndex(c.value.s, i), 32)
		c.value.s[i] = __goscriptAssign3_0
		c.value.s[j] = __goscriptAssign3_1
	}
	return [c, null]
}

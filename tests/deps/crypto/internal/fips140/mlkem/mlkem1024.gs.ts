// Generated file based on mlkem1024.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes2 from "@goscript/bytes/index.js"

import * as fips140 from "@goscript/crypto/internal/fips140/index.js"

import * as drbg from "@goscript/crypto/internal/fips140/drbg/index.js"

import * as sha3 from "@goscript/crypto/internal/fips140/sha3/index.js"

import * as subtle from "@goscript/crypto/internal/fips140/subtle/index.js"

import * as errors from "@goscript/errors/index.js"

import * as __goscript_cast from "./cast.gs.ts"

import * as __goscript_field from "./field.gs.ts"

import * as __goscript_mlkem768 from "./mlkem768.gs.ts"
import "@goscript/bytes/index.js"
import "@goscript/crypto/internal/fips140/index.js"
import "@goscript/crypto/internal/fips140/drbg/index.js"
import "@goscript/crypto/internal/fips140/sha3/index.js"
import "@goscript/crypto/internal/fips140/subtle/index.js"
import "@goscript/errors/index.js"
import "./cast.gs.ts"
import "./field.gs.ts"
import "./mlkem768.gs.ts"

export class encryptionKey1024 {
	public get t(): __goscript_field.nttElement[] {
		return this._fields.t.value
	}
	public set t(value: __goscript_field.nttElement[]) {
		this._fields.t.value = value
	}

	public get a(): __goscript_field.nttElement[] {
		return this._fields.a.value
	}
	public set a(value: __goscript_field.nttElement[]) {
		this._fields.a.value = value
	}

	public _fields: {
		t: $.VarRef<__goscript_field.nttElement[]>
		a: $.VarRef<__goscript_field.nttElement[]>
	}

	constructor(init?: Partial<{t?: __goscript_field.nttElement[], a?: __goscript_field.nttElement[]}>) {
		this._fields = {
			t: $.varRef(init?.t !== undefined ? $.cloneArrayValue(init.t) : Array.from({ length: 4 }, () => Array.from({ length: 256 }, () => 0))),
			a: $.varRef(init?.a !== undefined ? $.cloneArrayValue(init.a) : Array.from({ length: 16 }, () => Array.from({ length: 256 }, () => 0)))
		}
	}

	public clone(): encryptionKey1024 {
		const cloned = new encryptionKey1024()
		cloned._fields = {
			t: $.varRef($.cloneArrayValue(this._fields.t.value)),
			a: $.varRef($.cloneArrayValue(this._fields.a.value))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"mlkem.encryptionKey1024",
		() => new encryptionKey1024(),
		[],
		encryptionKey1024,
		[{ name: "t", key: "t", type: { kind: $.TypeKind.Array, elemType: "mlkem.nttElement", length: 4 }, pkgPath: "crypto/internal/fips140/mlkem", index: [0], offset: 0, exported: false }, { name: "a", key: "a", type: { kind: $.TypeKind.Array, elemType: "mlkem.nttElement", length: 16 }, pkgPath: "crypto/internal/fips140/mlkem", index: [1], offset: 2048, exported: false }]
	)
}

export class decryptionKey1024 {
	public get s(): __goscript_field.nttElement[] {
		return this._fields.s.value
	}
	public set s(value: __goscript_field.nttElement[]) {
		this._fields.s.value = value
	}

	public _fields: {
		s: $.VarRef<__goscript_field.nttElement[]>
	}

	constructor(init?: Partial<{s?: __goscript_field.nttElement[]}>) {
		this._fields = {
			s: $.varRef(init?.s !== undefined ? $.cloneArrayValue(init.s) : Array.from({ length: 4 }, () => Array.from({ length: 256 }, () => 0)))
		}
	}

	public clone(): decryptionKey1024 {
		const cloned = new decryptionKey1024()
		cloned._fields = {
			s: $.varRef($.cloneArrayValue(this._fields.s.value))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"mlkem.decryptionKey1024",
		() => new decryptionKey1024(),
		[],
		decryptionKey1024,
		[{ name: "s", key: "s", type: { kind: $.TypeKind.Array, elemType: "mlkem.nttElement", length: 4 }, pkgPath: "crypto/internal/fips140/mlkem", index: [0], offset: 0, exported: false }]
	)
}

export class DecapsulationKey1024 {
	public get d(): Uint8Array {
		return this._fields.d.value
	}
	public set d(value: Uint8Array) {
		this._fields.d.value = value
	}

	public get z(): Uint8Array {
		return this._fields.z.value
	}
	public set z(value: Uint8Array) {
		this._fields.z.value = value
	}

	public get _u3c1(): Uint8Array {
		return this._fields._u3c1.value
	}
	public set _u3c1(value: Uint8Array) {
		this._fields._u3c1.value = value
	}

	public get h(): Uint8Array {
		return this._fields.h.value
	}
	public set h(value: Uint8Array) {
		this._fields.h.value = value
	}

	public get encryptionKey1024(): encryptionKey1024 {
		return this._fields.encryptionKey1024.value
	}
	public set encryptionKey1024(value: encryptionKey1024) {
		this._fields.encryptionKey1024.value = value
	}

	public get decryptionKey1024(): decryptionKey1024 {
		return this._fields.decryptionKey1024.value
	}
	public set decryptionKey1024(value: decryptionKey1024) {
		this._fields.decryptionKey1024.value = value
	}

	public _fields: {
		d: $.VarRef<Uint8Array>
		z: $.VarRef<Uint8Array>
		_u3c1: $.VarRef<Uint8Array>
		h: $.VarRef<Uint8Array>
		encryptionKey1024: $.VarRef<encryptionKey1024>
		decryptionKey1024: $.VarRef<decryptionKey1024>
	}

	constructor(init?: Partial<{d?: Uint8Array, z?: Uint8Array, _u3c1?: Uint8Array, h?: Uint8Array, encryptionKey1024?: encryptionKey1024, decryptionKey1024?: decryptionKey1024}>) {
		this._fields = {
			d: $.varRef(init?.d !== undefined ? $.cloneArrayValue(init.d) : new Uint8Array(32)),
			z: $.varRef(init?.z !== undefined ? $.cloneArrayValue(init.z) : new Uint8Array(32)),
			_u3c1: $.varRef(init?._u3c1 !== undefined ? $.cloneArrayValue(init._u3c1) : new Uint8Array(32)),
			h: $.varRef(init?.h !== undefined ? $.cloneArrayValue(init.h) : new Uint8Array(32)),
			encryptionKey1024: $.varRef(init?.encryptionKey1024 ? $.markAsStructValue($.cloneStructValue(init.encryptionKey1024)) : $.markAsStructValue(new encryptionKey1024())),
			decryptionKey1024: $.varRef(init?.decryptionKey1024 ? $.markAsStructValue($.cloneStructValue(init.decryptionKey1024)) : $.markAsStructValue(new decryptionKey1024()))
		}
	}

	public clone(): DecapsulationKey1024 {
		const cloned = new DecapsulationKey1024()
		cloned._fields = {
			d: $.varRef($.cloneArrayValue(this._fields.d.value)),
			z: $.varRef($.cloneArrayValue(this._fields.z.value)),
			_u3c1: $.varRef($.cloneArrayValue(this._fields._u3c1.value)),
			h: $.varRef($.cloneArrayValue(this._fields.h.value)),
			encryptionKey1024: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.encryptionKey1024.value))),
			decryptionKey1024: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.decryptionKey1024.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Bytes(): $.Slice<number> {
		const dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null = this
		let b: Uint8Array = new Uint8Array(64)
		$.copy($.goSlice(b, undefined, undefined), $.goSlice($.pointerValue<DecapsulationKey1024>(dk).d, undefined, undefined))
		$.copy($.goSlice(b, 32, undefined), $.goSlice($.pointerValue<DecapsulationKey1024>(dk).z, undefined, undefined))
		return $.goSlice(b, undefined, undefined)
	}

	public async Decapsulate(ciphertext: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null = this
		let sharedKey: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		await __goscript_cast.__goscript_get_fipsSelfTest()!()
		if ($.len(ciphertext) != 1568) {
			return [null, errors.New("mlkem: invalid ciphertext length")]
		}
		let c: $.VarRef<Uint8Array> | null = ($.sliceToArrayPointer<number>(ciphertext, 1568, "byte") as $.VarRef<Uint8Array> | null)
		// Note that the hash check (step 3 of the decapsulation input check from
		// FIPS 203, Section 7.3) is foregone as a DecapsulationKey is always
		// validly generated by ML-KEM.KeyGen_internal.
		return [kemDecaps1024(dk, c), null]
	}

	public EncapsulationKey(): EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null {
		const dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null = this
		return new EncapsulationKey1024({_u3c1: $.pointerValue<DecapsulationKey1024>(dk)._u3c1, h: $.pointerValue<DecapsulationKey1024>(dk).h, encryptionKey1024: $.markAsStructValue($.cloneStructValue($.pointerValue<DecapsulationKey1024>(dk).encryptionKey1024))})
	}

	static __typeInfo = $.registerStructType(
		"mlkem.DecapsulationKey1024",
		() => new DecapsulationKey1024(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Decapsulate", args: [{ name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "sharedKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "EncapsulationKey", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "mlkem.EncapsulationKey1024" } }] }],
		DecapsulationKey1024,
		[{ name: "d", key: "d", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 }, pkgPath: "crypto/internal/fips140/mlkem", index: [0], offset: 0, exported: false }, { name: "z", key: "z", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 }, pkgPath: "crypto/internal/fips140/mlkem", index: [1], offset: 32, exported: false }, { name: "ρ", key: "_u3c1", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 }, pkgPath: "crypto/internal/fips140/mlkem", index: [2], offset: 64, exported: false }, { name: "h", key: "h", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 }, pkgPath: "crypto/internal/fips140/mlkem", index: [3], offset: 96, exported: false }, { name: "encryptionKey1024", key: "encryptionKey1024", type: "mlkem.encryptionKey1024", pkgPath: "crypto/internal/fips140/mlkem", anonymous: true, index: [4], offset: 128, exported: false }, { name: "decryptionKey1024", key: "decryptionKey1024", type: "mlkem.decryptionKey1024", pkgPath: "crypto/internal/fips140/mlkem", anonymous: true, index: [5], offset: 10368, exported: false }]
	)
}

export class EncapsulationKey1024 {
	public get _u3c1(): Uint8Array {
		return this._fields._u3c1.value
	}
	public set _u3c1(value: Uint8Array) {
		this._fields._u3c1.value = value
	}

	public get h(): Uint8Array {
		return this._fields.h.value
	}
	public set h(value: Uint8Array) {
		this._fields.h.value = value
	}

	public get encryptionKey1024(): encryptionKey1024 {
		return this._fields.encryptionKey1024.value
	}
	public set encryptionKey1024(value: encryptionKey1024) {
		this._fields.encryptionKey1024.value = value
	}

	public _fields: {
		_u3c1: $.VarRef<Uint8Array>
		h: $.VarRef<Uint8Array>
		encryptionKey1024: $.VarRef<encryptionKey1024>
	}

	constructor(init?: Partial<{_u3c1?: Uint8Array, h?: Uint8Array, encryptionKey1024?: encryptionKey1024}>) {
		this._fields = {
			_u3c1: $.varRef(init?._u3c1 !== undefined ? $.cloneArrayValue(init._u3c1) : new Uint8Array(32)),
			h: $.varRef(init?.h !== undefined ? $.cloneArrayValue(init.h) : new Uint8Array(32)),
			encryptionKey1024: $.varRef(init?.encryptionKey1024 ? $.markAsStructValue($.cloneStructValue(init.encryptionKey1024)) : $.markAsStructValue(new encryptionKey1024()))
		}
	}

	public clone(): EncapsulationKey1024 {
		const cloned = new EncapsulationKey1024()
		cloned._fields = {
			_u3c1: $.varRef($.cloneArrayValue(this._fields._u3c1.value)),
			h: $.varRef($.cloneArrayValue(this._fields.h.value)),
			encryptionKey1024: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.encryptionKey1024.value)))
		}
		return $.markAsStructValue(cloned)
	}

	public Bytes(): $.Slice<number> {
		const ek: EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null = this
		// The actual logic is in a separate function to outline this allocation.
		let b: $.Slice<number> = $.makeSlice<number>(0, 1568, "byte")
		return EncapsulationKey1024.prototype.bytes.call(ek, b)
	}

	public async Encapsulate(): globalThis.Promise<[$.Slice<number>, $.Slice<number>]> {
		const ek: EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null = this
		let sharedKey: $.Slice<number> = null as $.Slice<number>
		let ciphertext: $.Slice<number> = null as $.Slice<number>
		// The actual logic is in a separate function to outline this allocation.
		let cc: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(1568))
		return EncapsulationKey1024.prototype.encapsulate.call(ek, cc)
	}

	public async EncapsulateInternal(m: $.VarRef<Uint8Array> | null): globalThis.Promise<[$.Slice<number>, $.Slice<number>]> {
		const ek: EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null = this
		let sharedKey: $.Slice<number> = null as $.Slice<number>
		let ciphertext: $.Slice<number> = null as $.Slice<number>
		await __goscript_cast.__goscript_get_fipsSelfTest()!()
		let cc: $.VarRef<Uint8Array> | null = $.varRef(new Uint8Array(1568))
		return kemEncaps1024(cc, ek, m)
	}

	public bytes(b: $.Slice<number>): $.Slice<number> {
		const ek: EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null = this
		for (let __goscriptRangeTarget2 = $.pointerValue<EncapsulationKey1024>(ek).encryptionKey1024.t, i = 0; i < $.len(__goscriptRangeTarget2); i++) {
			b = __goscript_field.polyByteEncode({T: { type: "mlkem.nttElement", zero: () => Array.from({ length: 256 }, () => 0) }}, b, $.arrayIndex($.pointerValue<EncapsulationKey1024>(ek).encryptionKey1024.t, i))
		}
		b = $.appendSlice(b, $.goSlice($.pointerValue<EncapsulationKey1024>(ek)._u3c1, undefined, undefined), $.byteSliceHint)
		return b
	}

	public async encapsulate(cc: $.VarRef<Uint8Array> | null): globalThis.Promise<[$.Slice<number>, $.Slice<number>]> {
		const ek: EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null = this
		let sharedKey: $.Slice<number> = null as $.Slice<number>
		let ciphertext: $.Slice<number> = null as $.Slice<number>
		await __goscript_cast.__goscript_get_fipsSelfTest()!()
		let m: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(32))
		await drbg.Read($.goSlice(m.value, undefined, undefined))
		// Note that the modulus check (step 2 of the encapsulation key check from
		// FIPS 203, Section 7.2) is performed by polyByteDecode in parseEK1024.
		fips140.RecordApproved()
		return kemEncaps1024(cc, ek, m)
	}

	static __typeInfo = $.registerStructType(
		"mlkem.EncapsulationKey1024",
		() => new EncapsulationKey1024(),
		[{ name: "Bytes", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "Encapsulate", args: [], returns: [{ name: "sharedKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "EncapsulateInternal", args: [{ name: "m", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 } } }], returns: [{ name: "sharedKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "bytes", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "encapsulate", args: [{ name: "cc", type: { kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 1568 } } }], returns: [{ name: "sharedKey", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "ciphertext", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }],
		EncapsulationKey1024,
		[{ name: "ρ", key: "_u3c1", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 }, pkgPath: "crypto/internal/fips140/mlkem", index: [0], offset: 0, exported: false }, { name: "h", key: "h", type: { kind: $.TypeKind.Array, elemType: { kind: $.TypeKind.Basic, name: "uint8" }, length: 32 }, pkgPath: "crypto/internal/fips140/mlkem", index: [1], offset: 32, exported: false }, { name: "encryptionKey1024", key: "encryptionKey1024", type: "mlkem.encryptionKey1024", pkgPath: "crypto/internal/fips140/mlkem", anonymous: true, index: [2], offset: 64, exported: false }]
	)
}

export function TestingOnlyExpandedBytes1024(dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null): $.Slice<number> {
	let b: $.Slice<number> = $.makeSlice<number>(0, 3168, "byte")

	// ByteEncode₁₂(s)
	for (let __goscriptRangeTarget0 = $.pointerValue<DecapsulationKey1024>(dk).decryptionKey1024.s, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		b = __goscript_field.polyByteEncode({T: { type: "mlkem.nttElement", zero: () => Array.from({ length: 256 }, () => 0) }}, b, $.arrayIndex($.pointerValue<DecapsulationKey1024>(dk).decryptionKey1024.s, i))
	}

	// ByteEncode₁₂(t) || ρ
	for (let __goscriptRangeTarget1 = $.pointerValue<DecapsulationKey1024>(dk).encryptionKey1024.t, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		b = __goscript_field.polyByteEncode({T: { type: "mlkem.nttElement", zero: () => Array.from({ length: 256 }, () => 0) }}, b, $.arrayIndex($.pointerValue<DecapsulationKey1024>(dk).encryptionKey1024.t, i))
	}
	b = $.appendSlice(b, $.goSlice($.pointerValue<DecapsulationKey1024>(dk)._u3c1, undefined, undefined), $.byteSliceHint)

	// H(ek) || z
	b = $.appendSlice(b, $.goSlice($.pointerValue<DecapsulationKey1024>(dk).h, undefined, undefined), $.byteSliceHint)
	b = $.appendSlice(b, $.goSlice($.pointerValue<DecapsulationKey1024>(dk).z, undefined, undefined), $.byteSliceHint)

	return b
}

export async function GenerateKey1024(): globalThis.Promise<[DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null, $.GoError]> {
	// The actual logic is in a separate function to outline this allocation.
	let dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null = new DecapsulationKey1024()
	return generateKey1024(dk)
}

export async function generateKey1024(dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null): globalThis.Promise<[DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null, $.GoError]> {
	await __goscript_cast.__goscript_get_fipsSelfTest()!()
	let d: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(32))
	await drbg.Read($.goSlice(d.value, undefined, undefined))
	let z: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(32))
	await drbg.Read($.goSlice(z.value, undefined, undefined))
	kemKeyGen1024(dk, d, z)
	await fips140.PCT("ML-KEM PCT", $.functionValue(async (): globalThis.Promise<$.GoError> => {
		return await kemPCT1024(dk)
	}, ({ kind: $.TypeKind.Function, params: [], results: ["error"] } as $.FunctionTypeInfo)))
	fips140.RecordApproved()
	return [dk, null]
}

export async function GenerateKeyInternal1024(d: $.VarRef<Uint8Array> | null, z: $.VarRef<Uint8Array> | null): globalThis.Promise<DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null> {
	await __goscript_cast.__goscript_get_fipsSelfTest()!()
	let dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null = new DecapsulationKey1024()
	kemKeyGen1024(dk, d, z)
	return dk
}

export function NewDecapsulationKey1024(seed: $.Slice<number>): [DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null, $.GoError] {
	// The actual logic is in a separate function to outline this allocation.
	let dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null = new DecapsulationKey1024()
	return newKeyFromSeed1024(dk, seed)
}

export function newKeyFromSeed1024(dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null, seed: $.Slice<number>): [DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null, $.GoError] {
	if ($.len(seed) != 64) {
		return [null, errors.New("mlkem: invalid seed length")]
	}
	let d: $.VarRef<Uint8Array> | null = ($.sliceToArrayPointer<number>($.goSlice(seed, undefined, 32), 32, "byte") as $.VarRef<Uint8Array> | null)
	let z: $.VarRef<Uint8Array> | null = ($.sliceToArrayPointer<number>($.goSlice(seed, 32, undefined), 32, "byte") as $.VarRef<Uint8Array> | null)
	kemKeyGen1024(dk, d, z)
	fips140.RecordApproved()
	return [dk, null]
}

export async function TestingOnlyNewDecapsulationKey1024(b: $.Slice<number>): globalThis.Promise<[DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null, $.GoError]> {
	if ($.len(b) != 3168) {
		return [null, errors.New("mlkem: invalid NIST decapsulation key length")]
	}

	let dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null = new DecapsulationKey1024()
	for (let __goscriptRangeTarget3 = $.pointerValue<DecapsulationKey1024>(dk).decryptionKey1024.s, i = 0; i < $.len(__goscriptRangeTarget3); i++) {
		let err: $.GoError = null as $.GoError
		let __goscriptTuple0: any = __goscript_field.polyByteDecode({T: { type: "mlkem.nttElement", zero: () => Array.from({ length: 256 }, () => 0) }}, $.goSlice(b, undefined, 384))
		$.pointerValue<DecapsulationKey1024>(dk).decryptionKey1024.s[i] = (__goscriptTuple0[0] as __goscript_field.nttElement)
		err = __goscriptTuple0[1]
		if (err != null) {
			return [null, errors.New("mlkem: invalid secret key encoding")]
		}
		b = $.goSlice(b, 384, undefined)
	}

	let __goscriptTuple1: any = NewEncapsulationKey1024($.goSlice(b, undefined, 1568))
	let ek: EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null = __goscriptTuple1[0]
	let err = __goscriptTuple1[1]
	if (err != null) {
		return [null, err]
	}
	$.pointerValue<DecapsulationKey1024>(dk)._u3c1 = $.pointerValue<EncapsulationKey1024>(ek)._u3c1
	$.pointerValue<DecapsulationKey1024>(dk).h = $.pointerValue<EncapsulationKey1024>(ek).h
	$.pointerValue<DecapsulationKey1024>(dk).encryptionKey1024 = $.markAsStructValue($.cloneStructValue($.pointerValue<EncapsulationKey1024>(ek).encryptionKey1024))
	b = $.goSlice(b, 1568, undefined)

	if (!bytes2.Equal($.goSlice($.pointerValue<DecapsulationKey1024>(dk).h, undefined, undefined), $.goSlice(b, undefined, 32))) {
		return [null, errors.New("mlkem: inconsistent H(ek) in encoded bytes")]
	}
	b = $.goSlice(b, 32, undefined)

	$.copy($.goSlice($.pointerValue<DecapsulationKey1024>(dk).z, undefined, undefined), b)

	// Generate a random d value for use in Bytes(). This is a safety mechanism
	// that avoids returning a broken key vs a random key if this function is
	// called in contravention of the TestingOnlyNewDecapsulationKey1024 function
	// comment advising against it.
	await drbg.Read($.goSlice($.pointerValue<DecapsulationKey1024>(dk).d, undefined, undefined))

	return [dk, null]
}

export function kemKeyGen1024(dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null, d: $.VarRef<Uint8Array> | null, z: $.VarRef<Uint8Array> | null): void {
	$.pointerValue<DecapsulationKey1024>(dk).d = $.pointerValue<Uint8Array>(d)
	$.pointerValue<DecapsulationKey1024>(dk).z = $.pointerValue<Uint8Array>(z)

	let g: sha3.Digest | $.VarRef<sha3.Digest> | null = sha3.New512()
	sha3.Digest.prototype.Write.call(g, $.goSlice($.pointerValue<Uint8Array>(d), undefined, undefined))
	sha3.Digest.prototype.Write.call(g, new Uint8Array([4]) as $.Slice<number>)
	let G: $.Slice<number> = sha3.Digest.prototype.Sum.call(g, $.makeSlice<number>(0, 64, "byte"))
	let _u3c1: $.Slice<number> = $.goSlice(G, undefined, 32)
	let _u3c3: $.Slice<number> = $.goSlice(G, 32, undefined)
	$.pointerValue<DecapsulationKey1024>(dk)._u3c1 = ($.sliceToArray<number>(_u3c1, 32, "byte") as Uint8Array)

	let A: $.VarRef<__goscript_field.nttElement[]> | null = $.pointerValue<DecapsulationKey1024>(dk).encryptionKey1024._fields.a
	for (let i = $.uint($.uint(0, 8), 8); $.uint(i, 8) < $.uint(4, 8); i++) {
		for (let j = $.uint($.uint(0, 8), 8); $.uint(j, 8) < $.uint(4, 8); j++) {
			$.pointerValue<__goscript_field.nttElement[]>(A)[(i * 4) + j] = __goscript_field.sampleNTT(_u3c1, $.uint(j, 8), $.uint(i, 8))
		}
	}

	let N: number = 0
	let s: $.VarRef<__goscript_field.nttElement[]> | null = $.pointerValue<DecapsulationKey1024>(dk).decryptionKey1024._fields.s
	for (let __goscriptRangeTarget4 = $.pointerValue<__goscript_field.nttElement[]>(s), i = 0; i < $.len(__goscriptRangeTarget4); i++) {
		$.pointerValue<__goscript_field.nttElement[]>(s)[i] = __goscript_field.ntt(__goscript_field.samplePolyCBD(_u3c3, $.uint(N, 8)))
		N++
	}
	let e: $.Slice<__goscript_field.nttElement> = $.makeSlice<__goscript_field.nttElement>(4)
	for (let __goscriptRangeTarget5 = e, i = 0; i < $.len(__goscriptRangeTarget5); i++) {
		e![i] = __goscript_field.ntt(__goscript_field.samplePolyCBD(_u3c3, $.uint(N, 8)))
		N++
	}

	let t: $.VarRef<__goscript_field.nttElement[]> | null = $.pointerValue<DecapsulationKey1024>(dk).encryptionKey1024._fields.t
	for (let __goscriptRangeTarget7 = $.pointerValue<__goscript_field.nttElement[]>(t), i = 0; i < $.len(__goscriptRangeTarget7); i++) {
		$.pointerValue<__goscript_field.nttElement[]>(t)[i] = $.arrayIndex(e!, i)
		for (let __goscriptRangeTarget6 = $.pointerValue<__goscript_field.nttElement[]>(s), j = 0; j < $.len(__goscriptRangeTarget6); j++) {
			$.pointerValue<__goscript_field.nttElement[]>(t)[i] = (__goscript_field.polyAdd({T: { type: "mlkem.nttElement", zero: () => Array.from({ length: 256 }, () => 0) }}, $.arrayIndex($.pointerValue<__goscript_field.nttElement[]>(t), i), __goscript_field.nttMul($.arrayIndex($.pointerValue<__goscript_field.nttElement[]>(A), (i * 4) + j), $.arrayIndex($.pointerValue<__goscript_field.nttElement[]>(s), j))) as __goscript_field.nttElement)
		}
	}

	let H: sha3.Digest | $.VarRef<sha3.Digest> | null = sha3.New256()
	let ek: $.Slice<number> = EncapsulationKey1024.prototype.Bytes.call(DecapsulationKey1024.prototype.EncapsulationKey.call(dk))
	sha3.Digest.prototype.Write.call(H, ek)
	sha3.Digest.prototype.Sum.call(H, $.goSlice($.pointerValue<DecapsulationKey1024>(dk).h, undefined, 0))
}

export async function kemPCT1024(dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null): globalThis.Promise<$.GoError> {
	let ek: EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null = DecapsulationKey1024.prototype.EncapsulationKey.call(dk)
	let __goscriptTuple2: any = await EncapsulationKey1024.prototype.Encapsulate.call(ek)
	let K: $.Slice<number> = __goscriptTuple2[0]
	let c: $.Slice<number> = __goscriptTuple2[1]
	let __goscriptTuple3: any = await DecapsulationKey1024.prototype.Decapsulate.call(dk, c)
	let K1: $.Slice<number> = __goscriptTuple3[0]
	let err = __goscriptTuple3[1]
	if (err != null) {
		return err
	}
	if (subtle.ConstantTimeCompare(K, K1) != 1) {
		return errors.New("mlkem: PCT failed")
	}
	return null
}

export function kemEncaps1024(cc: $.VarRef<Uint8Array> | null, ek: EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null, m: $.VarRef<Uint8Array> | null): [$.Slice<number>, $.Slice<number>] {
	let K: $.Slice<number> = null as $.Slice<number>
	let c: $.Slice<number> = null as $.Slice<number>
	let g: sha3.Digest | $.VarRef<sha3.Digest> | null = sha3.New512()
	sha3.Digest.prototype.Write.call(g, $.goSlice($.pointerValue<Uint8Array>(m), undefined, undefined))
	sha3.Digest.prototype.Write.call(g, $.goSlice($.pointerValue<EncapsulationKey1024>(ek).h, undefined, undefined))
	let G: $.Slice<number> = sha3.Digest.prototype.Sum.call(g, null)
	K = $.goSlice(G, undefined, 32)
	let r: $.Slice<number> = $.goSlice(G, 32, undefined)
	c = pkeEncrypt1024(cc, $.pointerValue<EncapsulationKey1024>(ek)._fields.encryptionKey1024, m, r)
	return [K, c]
}

export function NewEncapsulationKey1024(encapsulationKey: $.Slice<number>): [EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null, $.GoError] {
	// The actual logic is in a separate function to outline this allocation.
	let ek: EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null = new EncapsulationKey1024()
	return parseEK1024(ek, encapsulationKey)
}

export function parseEK1024(ek: EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null, ekPKE: $.Slice<number>): [EncapsulationKey1024 | $.VarRef<EncapsulationKey1024> | null, $.GoError] {
	if ($.len(ekPKE) != 1568) {
		return [null, errors.New("mlkem: invalid encapsulation key length")]
	}

	let h: sha3.Digest | $.VarRef<sha3.Digest> | null = sha3.New256()
	sha3.Digest.prototype.Write.call(h, ekPKE)
	sha3.Digest.prototype.Sum.call(h, $.goSlice($.pointerValue<EncapsulationKey1024>(ek).h, undefined, 0))

	for (let __goscriptRangeTarget8 = $.pointerValue<EncapsulationKey1024>(ek).encryptionKey1024.t, i = 0; i < $.len(__goscriptRangeTarget8); i++) {
		let err: $.GoError = null as $.GoError
		let __goscriptTuple4: any = __goscript_field.polyByteDecode({T: { type: "mlkem.nttElement", zero: () => Array.from({ length: 256 }, () => 0) }}, $.goSlice(ekPKE, undefined, 384))
		$.pointerValue<EncapsulationKey1024>(ek).encryptionKey1024.t[i] = (__goscriptTuple4[0] as __goscript_field.nttElement)
		err = __goscriptTuple4[1]
		if (err != null) {
			return [null, err]
		}
		ekPKE = $.goSlice(ekPKE, 384, undefined)
	}
	$.copy($.goSlice($.pointerValue<EncapsulationKey1024>(ek)._u3c1, undefined, undefined), ekPKE)

	for (let i = $.uint($.uint(0, 8), 8); $.uint(i, 8) < $.uint(4, 8); i++) {
		for (let j = $.uint($.uint(0, 8), 8); $.uint(j, 8) < $.uint(4, 8); j++) {
			$.pointerValue<EncapsulationKey1024>(ek).encryptionKey1024.a[(i * 4) + j] = __goscript_field.sampleNTT($.goSlice($.pointerValue<EncapsulationKey1024>(ek)._u3c1, undefined, undefined), $.uint(j, 8), $.uint(i, 8))
		}
	}

	return [ek, null]
}

export function pkeEncrypt1024(cc: $.VarRef<Uint8Array> | null, ex: encryptionKey1024 | $.VarRef<encryptionKey1024> | null, m: $.VarRef<Uint8Array> | null, rnd: $.Slice<number>): $.Slice<number> {
	let N: number = 0
	let r: $.Slice<__goscript_field.nttElement> = $.makeSlice<__goscript_field.nttElement>(4)
	let e1: $.Slice<__goscript_field.ringElement> = $.makeSlice<__goscript_field.ringElement>(4)
	for (let __goscriptRangeTarget9 = r, i = 0; i < $.len(__goscriptRangeTarget9); i++) {
		r![i] = __goscript_field.ntt(__goscript_field.samplePolyCBD(rnd, $.uint(N, 8)))
		N++
	}
	for (let __goscriptRangeTarget10 = e1, i = 0; i < $.len(__goscriptRangeTarget10); i++) {
		e1![i] = __goscript_field.samplePolyCBD(rnd, $.uint(N, 8))
		N++
	}
	let e2 = __goscript_field.samplePolyCBD(rnd, $.uint(N, 8))

	let u: $.Slice<__goscript_field.ringElement> = $.makeSlice<__goscript_field.ringElement>(4)
	for (let __goscriptRangeTarget12 = u, i = 0; i < $.len(__goscriptRangeTarget12); i++) {
		let uHat: __goscript_field.nttElement = Array.from({ length: 256 }, () => 0)
		for (let __goscriptRangeTarget11 = r, j = 0; j < $.len(__goscriptRangeTarget11); j++) {
			// Note that i and j are inverted, as we need the transposed of A.
			uHat = (__goscript_field.polyAdd({T: { type: "mlkem.nttElement", zero: () => Array.from({ length: 256 }, () => 0) }}, uHat, __goscript_field.nttMul($.arrayIndex($.pointerValue<encryptionKey1024>(ex).a, (j * 4) + i), $.arrayIndex(r!, j))) as __goscript_field.nttElement)
		}
		u![i] = (__goscript_field.polyAdd({T: { type: "mlkem.ringElement", zero: () => Array.from({ length: 256 }, () => 0) }}, $.arrayIndex(e1!, i), __goscript_field.inverseNTT(uHat)) as __goscript_field.ringElement)
	}

	let _u3bc = __goscript_field.ringDecodeAndDecompress1(m)

	let vNTT: __goscript_field.nttElement = Array.from({ length: 256 }, () => 0)
	for (let __goscriptRangeTarget13 = $.pointerValue<encryptionKey1024>(ex).t, i = 0; i < $.len(__goscriptRangeTarget13); i++) {
		vNTT = (__goscript_field.polyAdd({T: { type: "mlkem.nttElement", zero: () => Array.from({ length: 256 }, () => 0) }}, vNTT, __goscript_field.nttMul($.arrayIndex($.pointerValue<encryptionKey1024>(ex).t, i), $.arrayIndex(r!, i))) as __goscript_field.nttElement)
	}
	let v = (__goscript_field.polyAdd({T: { type: "mlkem.ringElement", zero: () => Array.from({ length: 256 }, () => 0) }}, __goscript_field.polyAdd({T: { type: "mlkem.ringElement", zero: () => Array.from({ length: 256 }, () => 0) }}, __goscript_field.inverseNTT(vNTT), e2), _u3bc) as __goscript_field.ringElement)

	let c: $.Slice<number> = $.goSlice($.pointerValue<Uint8Array>(cc), undefined, 0)
	for (let __goscriptRangeTarget14 = u, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget14); __rangeIndex++) {
		let f = __goscriptRangeTarget14![__rangeIndex]
		c = __goscript_field.ringCompressAndEncode11(c, f)
	}
	c = __goscript_field.ringCompressAndEncode5(c, v)

	return c
}

export function kemDecaps1024(dk: DecapsulationKey1024 | $.VarRef<DecapsulationKey1024> | null, c: $.VarRef<Uint8Array> | null): $.Slice<number> {
	let K: $.Slice<number> = null as $.Slice<number>
	fips140.RecordApproved()
	let m: $.Slice<number> = pkeDecrypt1024($.pointerValue<DecapsulationKey1024>(dk)._fields.decryptionKey1024, c)
	let g: sha3.Digest | $.VarRef<sha3.Digest> | null = sha3.New512()
	sha3.Digest.prototype.Write.call(g, $.goSlice(m, undefined, undefined))
	sha3.Digest.prototype.Write.call(g, $.goSlice($.pointerValue<DecapsulationKey1024>(dk).h, undefined, undefined))
	let G: $.Slice<number> = sha3.Digest.prototype.Sum.call(g, $.makeSlice<number>(0, 64, "byte"))
	let Kprime: $.Slice<number> = $.goSlice(G, undefined, 32)
	let r: $.Slice<number> = $.goSlice(G, 32, undefined)
	let J: sha3.SHAKE | $.VarRef<sha3.SHAKE> | null = sha3.NewShake256()
	sha3.SHAKE.prototype.Write.call(J, $.goSlice($.pointerValue<DecapsulationKey1024>(dk).z, undefined, undefined))
	sha3.SHAKE.prototype.Write.call(J, $.goSlice($.pointerValue<Uint8Array>(c), undefined, undefined))
	let Kout: $.Slice<number> = $.makeSlice<number>(32, undefined, "byte")
	sha3.SHAKE.prototype.Read.call(J, Kout)
	let cc: $.VarRef<Uint8Array> = $.varRef(new Uint8Array(1568))
	let c1: $.Slice<number> = pkeEncrypt1024(cc, $.pointerValue<DecapsulationKey1024>(dk)._fields.encryptionKey1024, ($.sliceToArrayPointer<number>(m, 32, "byte") as $.VarRef<Uint8Array> | null), r)

	subtle.ConstantTimeCopy(subtle.ConstantTimeCompare($.goSlice($.pointerValue<Uint8Array>(c), undefined, undefined), c1), Kout, Kprime)
	return Kout
}

export function pkeDecrypt1024(dx: decryptionKey1024 | $.VarRef<decryptionKey1024> | null, c: $.VarRef<Uint8Array> | null): $.Slice<number> {
	let u: $.Slice<__goscript_field.ringElement> = $.makeSlice<__goscript_field.ringElement>(4)
	for (let __goscriptRangeTarget15 = u, i = 0; i < $.len(__goscriptRangeTarget15); i++) {
		let b: $.VarRef<Uint8Array> | null = ($.sliceToArrayPointer<number>($.goSlice($.pointerValue<Uint8Array>(c), 352 * i, 352 * (i + 1)), 352, "byte") as $.VarRef<Uint8Array> | null)
		u![i] = __goscript_field.ringDecodeAndDecompress11(b)
	}

	let b: $.VarRef<Uint8Array> | null = ($.sliceToArrayPointer<number>($.goSlice($.pointerValue<Uint8Array>(c), 352 * 4, undefined), 160, "byte") as $.VarRef<Uint8Array> | null)
	let v = __goscript_field.ringDecodeAndDecompress5(b)

	let mask: __goscript_field.nttElement = Array.from({ length: 256 }, () => 0)
	for (let __goscriptRangeTarget16 = $.pointerValue<decryptionKey1024>(dx).s, i = 0; i < $.len(__goscriptRangeTarget16); i++) {
		mask = (__goscript_field.polyAdd({T: { type: "mlkem.nttElement", zero: () => Array.from({ length: 256 }, () => 0) }}, mask, __goscript_field.nttMul($.arrayIndex($.pointerValue<decryptionKey1024>(dx).s, i), __goscript_field.ntt($.arrayIndex(u!, i)))) as __goscript_field.nttElement)
	}
	let w = (__goscript_field.polySub({T: { type: "mlkem.ringElement", zero: () => Array.from({ length: 256 }, () => 0) }}, v, __goscript_field.inverseNTT(mask)) as __goscript_field.ringElement)

	return __goscript_field.ringCompressAndEncode1(null, w)
}

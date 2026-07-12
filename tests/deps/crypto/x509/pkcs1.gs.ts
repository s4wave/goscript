// Generated file based on pkcs1.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as rsa from "@goscript/crypto/rsa/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"

import * as errors from "@goscript/errors/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as big from "@goscript/math/big/index.js"

import * as pkix from "@goscript/crypto/x509/pkix/index.js"

import * as __goscript_pkcs8 from "./pkcs8.gs.ts"

import * as __goscript_sec1 from "./sec1.gs.ts"

import * as __goscript_x509 from "./x509.gs.ts"
import "@goscript/crypto/rsa/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/errors/index.js"
import "@goscript/internal/godebug/index.js"
import "@goscript/math/big/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "./pkcs8.gs.ts"
import "./sec1.gs.ts"
import "./x509.gs.ts"

export class pkcs1PrivateKey {
	public get Version(): number {
		return this._fields.Version.value
	}
	public set Version(value: number) {
		this._fields.Version.value = value
	}

	public get N(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.N.value
	}
	public set N(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.N.value = value
	}

	public get E(): number {
		return this._fields.E.value
	}
	public set E(value: number) {
		this._fields.E.value = value
	}

	public get D(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.D.value
	}
	public set D(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.D.value = value
	}

	public get P(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.P.value
	}
	public set P(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.P.value = value
	}

	public get Q(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Q.value
	}
	public set Q(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Q.value = value
	}

	public get Dp(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Dp.value
	}
	public set Dp(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Dp.value = value
	}

	public get Dq(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Dq.value
	}
	public set Dq(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Dq.value = value
	}

	public get Qinv(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Qinv.value
	}
	public set Qinv(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Qinv.value = value
	}

	public get AdditionalPrimes(): $.Slice<pkcs1AdditionalRSAPrime> {
		return this._fields.AdditionalPrimes.value
	}
	public set AdditionalPrimes(value: $.Slice<pkcs1AdditionalRSAPrime>) {
		this._fields.AdditionalPrimes.value = value
	}

	public _fields: {
		Version: $.VarRef<number>
		N: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		E: $.VarRef<number>
		D: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		P: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Q: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Dp: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Dq: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Qinv: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		AdditionalPrimes: $.VarRef<$.Slice<pkcs1AdditionalRSAPrime>>
	}

	constructor(init?: Partial<{Version?: number, N?: big.Int | $.VarRef<big.Int> | null, E?: number, D?: big.Int | $.VarRef<big.Int> | null, P?: big.Int | $.VarRef<big.Int> | null, Q?: big.Int | $.VarRef<big.Int> | null, Dp?: big.Int | $.VarRef<big.Int> | null, Dq?: big.Int | $.VarRef<big.Int> | null, Qinv?: big.Int | $.VarRef<big.Int> | null, AdditionalPrimes?: $.Slice<pkcs1AdditionalRSAPrime>}>) {
		this._fields = {
			Version: $.varRef(init?.Version ?? (0 as number)),
			N: $.varRef(init?.N ?? (null as big.Int | $.VarRef<big.Int> | null)),
			E: $.varRef(init?.E ?? (0 as number)),
			D: $.varRef(init?.D ?? (null as big.Int | $.VarRef<big.Int> | null)),
			P: $.varRef(init?.P ?? (null as big.Int | $.VarRef<big.Int> | null)),
			Q: $.varRef(init?.Q ?? (null as big.Int | $.VarRef<big.Int> | null)),
			Dp: $.varRef(init?.Dp ?? (null as big.Int | $.VarRef<big.Int> | null)),
			Dq: $.varRef(init?.Dq ?? (null as big.Int | $.VarRef<big.Int> | null)),
			Qinv: $.varRef(init?.Qinv ?? (null as big.Int | $.VarRef<big.Int> | null)),
			AdditionalPrimes: $.varRef(init?.AdditionalPrimes ?? (null as $.Slice<pkcs1AdditionalRSAPrime>))
		}
	}

	public clone(): pkcs1PrivateKey {
		const cloned = new pkcs1PrivateKey()
		cloned._fields = {
			Version: $.varRef(this._fields.Version.value),
			N: $.varRef(this._fields.N.value),
			E: $.varRef(this._fields.E.value),
			D: $.varRef(this._fields.D.value),
			P: $.varRef(this._fields.P.value),
			Q: $.varRef(this._fields.Q.value),
			Dp: $.varRef(this._fields.Dp.value),
			Dq: $.varRef(this._fields.Dq.value),
			Qinv: $.varRef(this._fields.Qinv.value),
			AdditionalPrimes: $.varRef(this._fields.AdditionalPrimes.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.pkcs1PrivateKey",
		() => new pkcs1PrivateKey(),
		[],
		pkcs1PrivateKey,
		[{ name: "Version", key: "Version", type: { kind: $.TypeKind.Basic, name: "int" }, index: [0], offset: 0, exported: true }, { name: "N", key: "N", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [1], offset: 8, exported: true }, { name: "E", key: "E", type: { kind: $.TypeKind.Basic, name: "int" }, index: [2], offset: 16, exported: true }, { name: "D", key: "D", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [3], offset: 24, exported: true }, { name: "P", key: "P", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [4], offset: 32, exported: true }, { name: "Q", key: "Q", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [5], offset: 40, exported: true }, { name: "Dp", key: "Dp", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, tag: "asn1:\"optional\"", index: [6], offset: 48, exported: true }, { name: "Dq", key: "Dq", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, tag: "asn1:\"optional\"", index: [7], offset: 56, exported: true }, { name: "Qinv", key: "Qinv", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, tag: "asn1:\"optional\"", index: [8], offset: 64, exported: true }, { name: "AdditionalPrimes", key: "AdditionalPrimes", type: { kind: $.TypeKind.Slice, elemType: "x509.pkcs1AdditionalRSAPrime" }, tag: "asn1:\"optional,omitempty\"", index: [9], offset: 72, exported: true }]
	)
}

export class pkcs1AdditionalRSAPrime {
	public get Prime(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Prime.value
	}
	public set Prime(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Prime.value = value
	}

	// We ignore these values because rsa will calculate them.
	public get Exp(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Exp.value
	}
	public set Exp(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Exp.value = value
	}

	public get Coeff(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.Coeff.value
	}
	public set Coeff(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.Coeff.value = value
	}

	public _fields: {
		Prime: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Exp: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		Coeff: $.VarRef<big.Int | $.VarRef<big.Int> | null>
	}

	constructor(init?: Partial<{Prime?: big.Int | $.VarRef<big.Int> | null, Exp?: big.Int | $.VarRef<big.Int> | null, Coeff?: big.Int | $.VarRef<big.Int> | null}>) {
		this._fields = {
			Prime: $.varRef(init?.Prime ?? (null as big.Int | $.VarRef<big.Int> | null)),
			Exp: $.varRef(init?.Exp ?? (null as big.Int | $.VarRef<big.Int> | null)),
			Coeff: $.varRef(init?.Coeff ?? (null as big.Int | $.VarRef<big.Int> | null))
		}
	}

	public clone(): pkcs1AdditionalRSAPrime {
		const cloned = new pkcs1AdditionalRSAPrime()
		cloned._fields = {
			Prime: $.varRef(this._fields.Prime.value),
			Exp: $.varRef(this._fields.Exp.value),
			Coeff: $.varRef(this._fields.Coeff.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.pkcs1AdditionalRSAPrime",
		() => new pkcs1AdditionalRSAPrime(),
		[],
		pkcs1AdditionalRSAPrime,
		[{ name: "Prime", key: "Prime", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [0], offset: 0, exported: true }, { name: "Exp", key: "Exp", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [1], offset: 8, exported: true }, { name: "Coeff", key: "Coeff", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [2], offset: 16, exported: true }]
	)
}

export class pkcs1PublicKey {
	public get N(): big.Int | $.VarRef<big.Int> | null {
		return this._fields.N.value
	}
	public set N(value: big.Int | $.VarRef<big.Int> | null) {
		this._fields.N.value = value
	}

	public get E(): number {
		return this._fields.E.value
	}
	public set E(value: number) {
		this._fields.E.value = value
	}

	public _fields: {
		N: $.VarRef<big.Int | $.VarRef<big.Int> | null>
		E: $.VarRef<number>
	}

	constructor(init?: Partial<{N?: big.Int | $.VarRef<big.Int> | null, E?: number}>) {
		this._fields = {
			N: $.varRef(init?.N ?? (null as big.Int | $.VarRef<big.Int> | null)),
			E: $.varRef(init?.E ?? (0 as number))
		}
	}

	public clone(): pkcs1PublicKey {
		const cloned = new pkcs1PublicKey()
		cloned._fields = {
			N: $.varRef(this._fields.N.value),
			E: $.varRef(this._fields.E.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"x509.pkcs1PublicKey",
		() => new pkcs1PublicKey(),
		[],
		pkcs1PublicKey,
		[{ name: "N", key: "N", type: { kind: $.TypeKind.Pointer, elemType: "big.Int" }, index: [0], offset: 0, exported: true }, { name: "E", key: "E", type: { kind: $.TypeKind.Basic, name: "int" }, index: [1], offset: 8, exported: true }]
	)
}

export let x509rsacrt: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("x509rsacrt")

export function __goscript_set_x509rsacrt(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	x509rsacrt = __goscriptValue
}

export async function ParsePKCS1PrivateKey(der: $.Slice<number>): globalThis.Promise<[rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null, $.GoError]> {
	let priv: $.VarRef<pkcs1PrivateKey> = $.varRef($.markAsStructValue(new pkcs1PrivateKey()))
	let __goscriptTuple0: any = await asn1.Unmarshal(der, $.interfaceValue<any>(priv, "*x509.pkcs1PrivateKey", { kind: $.TypeKind.Pointer, elemType: "x509.pkcs1PrivateKey" }))
	let rest: $.Slice<number> = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if ($.len(rest) > 0) {
		return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new asn1.SyntaxError({Msg: "trailing data"})), "asn1.SyntaxError", "asn1.SyntaxError")]
	}
	if (err != null) {
		{
			let [, __goscriptShadow0] = await asn1.Unmarshal(der, $.interfaceValue<any>(new __goscript_sec1.ecPrivateKey(), "*x509.ecPrivateKey", { kind: $.TypeKind.Pointer, elemType: "x509.ecPrivateKey" }))
			if (__goscriptShadow0 == null) {
				return [null, errors.New("x509: failed to parse private key (use ParseECPrivateKey instead for this key format)")]
			}
		}
		{
			let [, __goscriptShadow1] = await asn1.Unmarshal(der, $.interfaceValue<any>(new __goscript_pkcs8.pkcs8(), "*x509.pkcs8", { kind: $.TypeKind.Pointer, elemType: "x509.pkcs8" }))
			if (__goscriptShadow1 == null) {
				return [null, errors.New("x509: failed to parse private key (use ParsePKCS8PrivateKey instead for this key format)")]
			}
		}
		return [null, err]
	}

	if (priv.value.Version > 1) {
		return [null, errors.New("x509: unsupported private key version")]
	}

	if (((((((big.Int.prototype.Sign.call(priv.value.N) <= 0) || (big.Int.prototype.Sign.call(priv.value.D) <= 0)) || (big.Int.prototype.Sign.call(priv.value.P) <= 0)) || (big.Int.prototype.Sign.call(priv.value.Q) <= 0)) || ((priv.value.Dp != null) && (big.Int.prototype.Sign.call(priv.value.Dp) <= 0))) || ((priv.value.Dq != null) && (big.Int.prototype.Sign.call(priv.value.Dq) <= 0))) || ((priv.value.Qinv != null) && (big.Int.prototype.Sign.call(priv.value.Qinv) <= 0))) {
		return [null, errors.New("x509: private key contains zero or negative value")]
	}

	let key: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null = new rsa.PrivateKey()
	$.pointerValue<rsa.PrivateKey>(key).PublicKey = $.markAsStructValue(new rsa.PublicKey({E: priv.value.E, N: priv.value.N}))

	$.pointerValue<rsa.PrivateKey>(key).D = priv.value.D
	$.pointerValue<rsa.PrivateKey>(key).Primes = $.makeSlice<big.Int | $.VarRef<big.Int> | null>(2 + $.len(priv.value.AdditionalPrimes))
	$.pointerValue<rsa.PrivateKey>(key).Primes![0] = priv.value.P
	$.pointerValue<rsa.PrivateKey>(key).Primes![1] = priv.value.Q
	$.pointerValue<rsa.PrivateKey>(key).Precomputed.Dp = priv.value.Dp
	$.pointerValue<rsa.PrivateKey>(key).Precomputed.Dq = priv.value.Dq
	$.pointerValue<rsa.PrivateKey>(key).Precomputed.Qinv = priv.value.Qinv
	for (let __goscriptRangeTarget0 = priv.value.AdditionalPrimes, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let a = __goscriptRangeTarget0![i]
		if (big.Int.prototype.Sign.call(a.Prime) <= 0) {
			return [null, errors.New("x509: private key contains zero or negative prime")]
		}
		$.pointerValue<rsa.PrivateKey>(key).Primes![i + 2] = a.Prime
	}

	await rsa.PrivateKey.prototype.Precompute.call(key)
	{
		let __goscriptShadow2 = await rsa.PrivateKey.prototype.Validate.call(key)
		if (__goscriptShadow2 != null) {
			// If x509rsacrt=0 is set, try dropping the CRT values and
			// rerunning precomputation and key validation.
			if ($.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(x509rsacrt)), "0")) {
				$.pointerValue<rsa.PrivateKey>(key).Precomputed.Dp = null
				$.pointerValue<rsa.PrivateKey>(key).Precomputed.Dq = null
				$.pointerValue<rsa.PrivateKey>(key).Precomputed.Qinv = null
				await rsa.PrivateKey.prototype.Precompute.call(key)
				{
					let __goscriptShadow3 = await rsa.PrivateKey.prototype.Validate.call(key)
					if (__goscriptShadow3 == null) {
						godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(x509rsacrt))
						return [key, null]
					}
				}
			}

			return [null, __goscriptShadow2]
		}
	}

	return [key, null]
}

export async function MarshalPKCS1PrivateKey(key: rsa.PrivateKey | $.VarRef<rsa.PrivateKey> | null): globalThis.Promise<$.Slice<number>> {
	await rsa.PrivateKey.prototype.Precompute.call(key)

	let version = 0
	if ($.len($.pointerValue<rsa.PrivateKey>(key).Primes) > 2) {
		version = 1
	}

	let priv = $.markAsStructValue(new pkcs1PrivateKey({Version: version, N: $.pointerValue<rsa.PrivateKey>(key).PublicKey.N, E: $.pointerValue<rsa.PrivateKey>(key).PublicKey.E, D: $.pointerValue<rsa.PrivateKey>(key).D, P: $.arrayIndex($.pointerValue<rsa.PrivateKey>(key).Primes!, 0), Q: $.arrayIndex($.pointerValue<rsa.PrivateKey>(key).Primes!, 1), Dp: $.pointerValue<rsa.PrivateKey>(key).Precomputed.Dp, Dq: $.pointerValue<rsa.PrivateKey>(key).Precomputed.Dq, Qinv: $.pointerValue<rsa.PrivateKey>(key).Precomputed.Qinv}))

	priv.AdditionalPrimes = $.makeSlice<pkcs1AdditionalRSAPrime>($.len($.pointerValue<rsa.PrivateKey>(key).Precomputed.CRTValues), undefined, undefined, () => $.markAsStructValue(new pkcs1AdditionalRSAPrime()))
	for (let __goscriptRangeTarget1 = $.pointerValue<rsa.PrivateKey>(key).Precomputed.CRTValues, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		let values = __goscriptRangeTarget1![i]
		$.arrayIndex(priv.AdditionalPrimes!, i).Prime = $.arrayIndex($.pointerValue<rsa.PrivateKey>(key).Primes!, 2 + i)
		$.arrayIndex(priv.AdditionalPrimes!, i).Exp = values.Exp
		$.arrayIndex(priv.AdditionalPrimes!, i).Coeff = values.Coeff
	}

	let __goscriptTuple1: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue($.cloneStructValue(priv)), "x509.pkcs1PrivateKey", "x509.pkcs1PrivateKey"))
	let b: $.Slice<number> = __goscriptTuple1[0]
	return b
}

export async function ParsePKCS1PublicKey(der: $.Slice<number>): globalThis.Promise<[rsa.PublicKey | $.VarRef<rsa.PublicKey> | null, $.GoError]> {
	let pub: $.VarRef<pkcs1PublicKey> = $.varRef($.markAsStructValue(new pkcs1PublicKey()))
	let __goscriptTuple2: any = await asn1.Unmarshal(der, $.interfaceValue<any>(pub, "*x509.pkcs1PublicKey", { kind: $.TypeKind.Pointer, elemType: "x509.pkcs1PublicKey" }))
	let rest: $.Slice<number> = __goscriptTuple2[0]
	let err = __goscriptTuple2[1]
	if (err != null) {
		{
			let [, __goscriptShadow4] = await asn1.Unmarshal(der, $.interfaceValue<any>(new __goscript_x509.publicKeyInfo(), "*x509.publicKeyInfo", { kind: $.TypeKind.Pointer, elemType: "x509.publicKeyInfo" }))
			if (__goscriptShadow4 == null) {
				return [null, errors.New("x509: failed to parse public key (use ParsePKIXPublicKey instead for this key format)")]
			}
		}
		return [null, err]
	}
	if ($.len(rest) > 0) {
		return [null, $.interfaceValue<$.GoError>($.markAsStructValue(new asn1.SyntaxError({Msg: "trailing data"})), "asn1.SyntaxError", "asn1.SyntaxError")]
	}

	if ((big.Int.prototype.Sign.call(pub.value.N) <= 0) || (pub.value.E <= 0)) {
		return [null, errors.New("x509: public key contains zero or negative value")]
	}
	if (pub.value.E > ((2147483648) - 1)) {
		return [null, errors.New("x509: public key contains large public exponent")]
	}

	return [new rsa.PublicKey({E: pub.value.E, N: pub.value.N}), null]
}

export async function MarshalPKCS1PublicKey(key: rsa.PublicKey | $.VarRef<rsa.PublicKey> | null): globalThis.Promise<$.Slice<number>> {
	let __goscriptTuple3: any = await asn1.Marshal($.interfaceValue<any>($.markAsStructValue(new pkcs1PublicKey({N: $.pointerValue<rsa.PublicKey>(key).N, E: $.pointerValue<rsa.PublicKey>(key).E})), "x509.pkcs1PublicKey", "x509.pkcs1PublicKey"))
	let derBytes: $.Slice<number> = __goscriptTuple3[0]
	return derBytes
}

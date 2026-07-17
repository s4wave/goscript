// Generated file based on ecdsa_legacy.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as elliptic from "@goscript/crypto/elliptic/index.js"

import * as fips140only from "@goscript/crypto/internal/fips140only/index.js"

import * as errors from "@goscript/errors/index.js"

import * as io from "@goscript/io/index.js"

import * as big from "@goscript/math/big/index.js"

import * as rand2 from "@goscript/math/rand/v2/index.js"

import * as cryptobyte from "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"

import * as asn1 from "@goscript/vendor/golang.org/x/crypto/cryptobyte/asn1/index.js"

import type * as crypto from "@goscript/crypto/index.js"

import type * as ecdh from "@goscript/crypto/ecdh/index.js"

import * as __goscript_ecdsa from "./ecdsa.gs.ts"
import "@goscript/crypto/elliptic/index.js"
import "@goscript/crypto/internal/fips140only/index.js"
import "@goscript/errors/index.js"
import "@goscript/io/index.js"
import "@goscript/math/big/index.js"
import "@goscript/math/rand/v2/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/index.js"
import "@goscript/vendor/golang.org/x/crypto/cryptobyte/asn1/index.js"
import "./ecdsa.gs.ts"

export async function generateLegacy(c: elliptic.Curve | null, rand: io.Reader | null): globalThis.Promise<[__goscript_ecdsa.PrivateKey | $.VarRef<__goscript_ecdsa.PrivateKey> | null, $.GoError]> {
	if (fips140only.Enforced()) {
		return [null, errors.New("crypto/ecdsa: use of custom curves is not allowed in FIPS 140-only mode")]
	}

	let __goscriptTuple0: any = await randFieldElement(c, rand)
	let k: big.Int | $.VarRef<big.Int> | null = __goscriptTuple0[0]
	let err = __goscriptTuple0[1]
	if (err != null) {
		return [null, err]
	}

	let priv: __goscript_ecdsa.PrivateKey | $.VarRef<__goscript_ecdsa.PrivateKey> | null = new __goscript_ecdsa.PrivateKey()
	$.pointerValue<__goscript_ecdsa.PrivateKey>(priv).PublicKey.Curve = c
	$.pointerValue<__goscript_ecdsa.PrivateKey>(priv).D = k
	let __goscriptTuple1: any = await $.pointerValue<Exclude<elliptic.Curve, null>>(c).ScalarBaseMult(big.Int.prototype.Bytes.call(k))
	$.pointerValue<__goscript_ecdsa.PrivateKey>(priv).PublicKey.X = __goscriptTuple1[0]
	$.pointerValue<__goscript_ecdsa.PrivateKey>(priv).PublicKey.Y = __goscriptTuple1[1]
	return [priv, null]
}

export async function hashToInt(hash: $.Slice<number>, c: elliptic.Curve | null): globalThis.Promise<big.Int | $.VarRef<big.Int> | null> {
	let orderBits = big.Int.prototype.BitLen.call($.pointerValue<elliptic.CurveParams>(await $.pointerValue<Exclude<elliptic.Curve, null>>(c).Params()).N)
	let orderBytes = Math.trunc((orderBits + 7) / 8)
	if ($.len(hash) > orderBytes) {
		hash = $.goSlice(hash, undefined, orderBytes)
	}

	let ret: big.Int | $.VarRef<big.Int> | null = big.Int.prototype.SetBytes.call(new big.Int(), hash)
	let excess = ($.len(hash) * 8) - orderBits
	if (excess > 0) {
		big.Int.prototype.Rsh.call(ret, ret, $.uint(excess, 64))
	}
	return ret
}

export let errZeroParam: $.GoError = errors.New("zero parameter")

export function __goscript_set_errZeroParam(__goscriptValue: $.GoError): void {
	errZeroParam = __goscriptValue
}

export async function Sign(rand: io.Reader | null, priv: __goscript_ecdsa.PrivateKey | $.VarRef<__goscript_ecdsa.PrivateKey> | null, hash: $.Slice<number>): globalThis.Promise<[big.Int | $.VarRef<big.Int> | null, big.Int | $.VarRef<big.Int> | null, $.GoError]> {
	let r: big.Int | $.VarRef<big.Int> | null = null! as big.Int | $.VarRef<big.Int> | null
	let s: big.Int | $.VarRef<big.Int> | null = null! as big.Int | $.VarRef<big.Int> | null
	let err: $.GoError = null! as $.GoError
	let __goscriptTuple2: any = await __goscript_ecdsa.SignASN1(rand, priv, hash)
	let sig: $.Slice<number> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	if (err != null) {
		return [null, null, err]
	}

	let __goscriptAssign0_0: big.Int | $.VarRef<big.Int> | null = new big.Int()
	let __goscriptAssign0_1: big.Int | $.VarRef<big.Int> | null = new big.Int()
	r = __goscriptAssign0_0
	s = __goscriptAssign0_1
	let inner: $.VarRef<cryptobyte.String> = $.varRef(null! as cryptobyte.String)
	let input: $.VarRef<cryptobyte.String> = $.varRef(((sig as cryptobyte.String) as cryptobyte.String))
	if ((((!cryptobyte.String_ReadASN1(input, inner, $.uint(asn1.SEQUENCE, 8)) || !cryptobyte.String_Empty(input.value)) || !cryptobyte.String_ReadASN1Integer(inner, $.interfaceValue<any>(r, "*big.Int", { kind: $.TypeKind.Pointer, elemType: "big.Int" }))) || !cryptobyte.String_ReadASN1Integer(inner, $.interfaceValue<any>(s, "*big.Int", { kind: $.TypeKind.Pointer, elemType: "big.Int" }))) || !cryptobyte.String_Empty(inner.value)) {
		return [null, null, errors.New("invalid ASN.1 from SignASN1")]
	}
	return [r, s, null]
}

export async function signLegacy(priv: __goscript_ecdsa.PrivateKey | $.VarRef<__goscript_ecdsa.PrivateKey> | null, csprng: io.Reader | null, hash: $.Slice<number>): globalThis.Promise<[$.Slice<number>, $.GoError]> {
	let sig: $.Slice<number> = null! as $.Slice<number>
	let err: $.GoError = null! as $.GoError
	if (fips140only.Enforced()) {
		return [null, errors.New("crypto/ecdsa: use of custom curves is not allowed in FIPS 140-only mode")]
	}

	let c = $.pointerValue<__goscript_ecdsa.PrivateKey>(priv).PublicKey.Curve

	// A cheap version of hedged signatures, for the deprecated path.
	let seed: Uint8Array = new Uint8Array(32)
	{
		let [, __goscriptShadow0] = await io.ReadFull($.pointerValueOrNil(csprng)!, $.goSlice(seed, undefined, undefined))
		if (__goscriptShadow0 != null) {
			return [null, __goscriptShadow0]
		}
	}
	for (let __goscriptRangeTarget0 = big.Int.prototype.Bytes.call($.pointerValue<__goscript_ecdsa.PrivateKey>(priv).D), i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		let b = __goscriptRangeTarget0![i]
		seed[i % 32] = seed[i % 32] ^ ($.uint(b, 8))
	}
	for (let __goscriptRangeTarget1 = hash, i = 0; i < $.len(__goscriptRangeTarget1); i++) {
		let b = __goscriptRangeTarget1![i]
		seed[i % 32] = seed[i % 32] ^ ($.uint(b, 8))
	}
	csprng = $.interfaceValue<io.Reader | null>(rand2.NewChaCha8(seed), "*rand.ChaCha8", { kind: $.TypeKind.Pointer, elemType: "rand.ChaCha8" })

	// SEC 1, Version 2.0, Section 4.1.3
	let N: big.Int | $.VarRef<big.Int> | null = $.pointerValue<elliptic.CurveParams>(await $.pointerValue<Exclude<elliptic.Curve, null>>(c).Params()).N
	if (big.Int.prototype.Sign.call(N) == 0) {
		return [null, errZeroParam]
	}
	let k: big.Int | $.VarRef<big.Int> | null = null! as big.Int | $.VarRef<big.Int> | null
	let kInv: big.Int | $.VarRef<big.Int> | null = null! as big.Int | $.VarRef<big.Int> | null
	let r: big.Int | $.VarRef<big.Int> | null = null! as big.Int | $.VarRef<big.Int> | null
	let s: big.Int | $.VarRef<big.Int> | null = null! as big.Int | $.VarRef<big.Int> | null
	while (true) {
		while (true) {
			let __goscriptTuple3: any = await randFieldElement(c, csprng)
			k = __goscriptTuple3[0]
			err = __goscriptTuple3[1]
			if (err != null) {
				return [null, err]
			}

			kInv = await big.Int.prototype.ModInverse.call(new big.Int(), k, N)

			let __goscriptTuple4: any = await $.pointerValue<Exclude<elliptic.Curve, null>>(c).ScalarBaseMult(big.Int.prototype.Bytes.call(k))
			r = __goscriptTuple4[0]
			await big.Int.prototype.Mod.call(r, r, N)
			if (big.Int.prototype.Sign.call(r) != 0) {
				break
			}
		}

		let e: big.Int | $.VarRef<big.Int> | null = await hashToInt(hash, c)
		s = await big.Int.prototype.Mul.call(new big.Int(), $.pointerValue<__goscript_ecdsa.PrivateKey>(priv).D, r)
		big.Int.prototype.Add.call(s, s, e)
		await big.Int.prototype.Mul.call(s, s, kInv)
		await big.Int.prototype.Mod.call(s, s, N)
		if (big.Int.prototype.Sign.call(s) != 0) {
			break
		}
	}

	return __goscript_ecdsa.encodeSignature(big.Int.prototype.Bytes.call(r), big.Int.prototype.Bytes.call(s))
}

export async function Verify(pub: __goscript_ecdsa.PublicKey | $.VarRef<__goscript_ecdsa.PublicKey> | null, hash: $.Slice<number>, r: big.Int | $.VarRef<big.Int> | null, s: big.Int | $.VarRef<big.Int> | null): globalThis.Promise<boolean> {
	if ((big.Int.prototype.Sign.call(r) <= 0) || (big.Int.prototype.Sign.call(s) <= 0)) {
		return false
	}
	let __goscriptTuple5: any = await __goscript_ecdsa.encodeSignature(big.Int.prototype.Bytes.call(r), big.Int.prototype.Bytes.call(s))
	let sig: $.Slice<number> = __goscriptTuple5[0]
	let err = __goscriptTuple5[1]
	if (err != null) {
		return false
	}
	return __goscript_ecdsa.VerifyASN1(pub, hash, sig)
}

export async function verifyLegacy(pub: __goscript_ecdsa.PublicKey | $.VarRef<__goscript_ecdsa.PublicKey> | null, hash: $.Slice<number>, sig: $.Slice<number>): globalThis.Promise<boolean> {
	if (fips140only.Enforced()) {
		$.panic("crypto/ecdsa: use of custom curves is not allowed in FIPS 140-only mode")
	}

	let __goscriptTuple6: any = __goscript_ecdsa.parseSignature(sig)
	let rBytes: $.Slice<number> = __goscriptTuple6[0]
	let sBytes: $.Slice<number> = __goscriptTuple6[1]
	let err = __goscriptTuple6[2]
	if (err != null) {
		return false
	}
	let r: big.Int | $.VarRef<big.Int> | null = big.Int.prototype.SetBytes.call(new big.Int(), rBytes)
	let s: big.Int | $.VarRef<big.Int> | null = big.Int.prototype.SetBytes.call(new big.Int(), sBytes)

	let c = $.pointerValue<__goscript_ecdsa.PublicKey>(pub).Curve
	let N: big.Int | $.VarRef<big.Int> | null = $.pointerValue<elliptic.CurveParams>(await $.pointerValue<Exclude<elliptic.Curve, null>>(c).Params()).N

	if ((big.Int.prototype.Sign.call(r) <= 0) || (big.Int.prototype.Sign.call(s) <= 0)) {
		return false
	}
	if ((big.Int.prototype.Cmp.call(r, N) >= 0) || (big.Int.prototype.Cmp.call(s, N) >= 0)) {
		return false
	}

	// SEC 1, Version 2.0, Section 4.1.4
	let e: big.Int | $.VarRef<big.Int> | null = await hashToInt(hash, c)
	let w: big.Int | $.VarRef<big.Int> | null = await big.Int.prototype.ModInverse.call(new big.Int(), s, N)

	let u1: big.Int | $.VarRef<big.Int> | null = await big.Int.prototype.Mul.call(e, e, w)
	await big.Int.prototype.Mod.call(u1, u1, N)
	let u2: big.Int | $.VarRef<big.Int> | null = await big.Int.prototype.Mul.call(w, r, w)
	await big.Int.prototype.Mod.call(u2, u2, N)

	let __goscriptTuple7: any = await $.pointerValue<Exclude<elliptic.Curve, null>>(c).ScalarBaseMult(big.Int.prototype.Bytes.call(u1))
	let x1: big.Int | $.VarRef<big.Int> | null = __goscriptTuple7[0]
	let y1: big.Int | $.VarRef<big.Int> | null = __goscriptTuple7[1]
	let __goscriptTuple8: any = await $.pointerValue<Exclude<elliptic.Curve, null>>(c).ScalarMult($.pointerValue<__goscript_ecdsa.PublicKey>(pub).X, $.pointerValue<__goscript_ecdsa.PublicKey>(pub).Y, big.Int.prototype.Bytes.call(u2))
	let x2: big.Int | $.VarRef<big.Int> | null = __goscriptTuple8[0]
	let y2: big.Int | $.VarRef<big.Int> | null = __goscriptTuple8[1]
	let __goscriptTuple9: any = await $.pointerValue<Exclude<elliptic.Curve, null>>(c).Add(x1, y1, x2, y2)
	let x: big.Int | $.VarRef<big.Int> | null = __goscriptTuple9[0]
	let y: big.Int | $.VarRef<big.Int> | null = __goscriptTuple9[1]

	if ((big.Int.prototype.Sign.call(x) == 0) && (big.Int.prototype.Sign.call(y) == 0)) {
		return false
	}
	await big.Int.prototype.Mod.call(x, x, N)
	return big.Int.prototype.Cmp.call(x, r) == 0
}

export let one: big.Int | $.VarRef<big.Int> | null = await big.Int.prototype.SetInt64.call(new big.Int(), 1n)

export function __goscript_set_one(__goscriptValue: big.Int | $.VarRef<big.Int> | null): void {
	one = __goscriptValue
}

export async function randFieldElement(c: elliptic.Curve | null, rand: io.Reader | null): globalThis.Promise<[big.Int | $.VarRef<big.Int> | null, $.GoError]> {
	let k: big.Int | $.VarRef<big.Int> | null = null! as big.Int | $.VarRef<big.Int> | null
	let err: $.GoError = null! as $.GoError
	while (true) {
		let N: big.Int | $.VarRef<big.Int> | null = $.pointerValue<elliptic.CurveParams>(await $.pointerValue<Exclude<elliptic.Curve, null>>(c).Params()).N
		let b: $.Slice<number> = $.makeSlice<number>(Math.trunc((big.Int.prototype.BitLen.call(N) + 7) / 8), undefined, "byte")
		{
			let __goscriptTuple10: any = await io.ReadFull($.pointerValueOrNil(rand)!, b)
			err = __goscriptTuple10[1]
			if (err != null) {
				return [k, err]
			}
		}
		{
			let excess = ($.len(b) * 8) - big.Int.prototype.BitLen.call(N)
			if (excess > 0) {
				b![0] = (b![0] >>> ($.uint(excess, 8))) >>> 0
			}
		}
		k = big.Int.prototype.SetBytes.call(new big.Int(), b)
		if ((big.Int.prototype.Sign.call(k) != 0) && (big.Int.prototype.Cmp.call(k, N) < 0)) {
			return [k, err]
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

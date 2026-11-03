// Generated file based on package_import_crypto_rand.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as ecdsa from "@goscript/crypto/ecdsa/index.js"
import * as elliptic from "@goscript/crypto/elliptic/index.js"
import * as rand from "@goscript/crypto/rand/index.js"
import * as x509 from "@goscript/crypto/x509/index.js"
import * as io from "@goscript/io/index.js"
import * as big from "@goscript/math/big/index.js"
import "@goscript/io/index.js"
import "@goscript/math/big/index.js"

export async function main(): globalThis.Promise<void> {
	// Read from the public entropy adapter and its Reader interface.
	let buf = $.makeSlice<number>(32, undefined, "byte")
	let [n, err] = await rand.Read(buf)
	await $.println("read len", n)
	await $.println("read err nil", err == null)
	await $.println("read has data", hasData(buf))

	// The Reader fills a caller-owned Go byte slice.
	let r: io.Reader | null = rand.Reader
	let small = $.makeSlice<number>(4, undefined, "byte")
	let __goscriptTuple0: any = await (r !== null && (r as any).__isVarRef !== true && ((r as any).__goValue === undefined || (r as any).__goType?.charCodeAt(0) !== 42) ? (r as Exclude<io.Reader, null>) : $.pointerValue<Exclude<io.Reader, null>>(r)).Read(small)
	n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	await $.println("reader len", n)
	await $.println("reader err nil", err == null)
	await $.println("reader has data", hasData(small))

	// Text uses the same secure source for its token.
	let token = await rand.Text()
	await $.println("text len", $.stringLen(token))
	await $.println("text alphabet", isBase32(token))

	// P256 key generation reaches the standard library's internal sysrand path.
	let __goscriptTuple1: any = await ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	let key: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	let key$: ecdsa.PrivateKey = key == null ? $.pointerTarget<ecdsa.PrivateKey>(key) : (key as any).__isVarRef === true ? (key as any).value : (key as any).__goValue === undefined ? (key as any) : $.pointerTarget<ecdsa.PrivateKey>(key)
	await $.println("p256 key err nil", err == null)
	await $.println("p256 key has entropy", (key != null) && (big.Int.prototype.Sign.call($.pointerValue<big.Int>((key$ as ecdsa.PrivateKey).D)) != 0))
	await $.println("p256 point valid", (key != null) && (__goscriptAwait = $.pointerValue<Exclude<elliptic.Curve, null>>((key$ as ecdsa.PrivateKey).PublicKey.Curve).IsOnCurve((key$ as ecdsa.PrivateKey).PublicKey.X, (key$ as ecdsa.PrivateKey).PublicKey.Y), __goscriptAwait instanceof Promise ? await __goscriptAwait : __goscriptAwait))

	// Standard-library encoding recognizes the same curve through fresh interfaces.
	await $.println("p256 curve identity", $.comparableEqual((key$ as ecdsa.PrivateKey).PublicKey.Curve, elliptic.P256()))
	let __goscriptTuple2: any = await x509.MarshalECPrivateKey(key)
	let der: $.Slice<number> = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	await $.println("p256 marshal err nil", err == null)
	let __goscriptTuple3: any = await x509.ParseECPrivateKey(der)
	let restored: ecdsa.PrivateKey | $.VarRef<ecdsa.PrivateKey> | null = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	let restored$: ecdsa.PrivateKey = restored == null ? $.pointerTarget<ecdsa.PrivateKey>(restored) : (restored as any).__isVarRef === true ? (restored as any).value : (restored as any).__goValue === undefined ? (restored as any) : $.pointerTarget<ecdsa.PrivateKey>(restored)
	await $.println("p256 roundtrip", (((err == null) && (restored != null)) && ($.comparableEqual((restored$ as ecdsa.PrivateKey).PublicKey.Curve, elliptic.P256()))) && (big.Int.prototype.Cmp.call($.pointerValue<big.Int>((restored$ as ecdsa.PrivateKey).D), (key$ as ecdsa.PrivateKey).D) == 0))
}

export function hasData(buf: $.Slice<number>): boolean {
	for (let __goscriptRangeTarget0 = buf, __goscriptRangeWindow0 = $.sliceRange(__goscriptRangeTarget0), __rangeIndex = 0; __rangeIndex < __goscriptRangeWindow0.length; __rangeIndex++) {
		let b = $.uint((__goscriptRangeWindow0.backing[__goscriptRangeWindow0.offset + __rangeIndex] as number), 8)
		if (b != 0) {
			return true
		}
	}
	return false
}

export function isBase32(token: string): boolean {
	for (let i = 0; i < $.stringLen(token); i++) {
		let c = $.indexString(token, i)
		if (!(((c >= 65) && (c <= 90)) || ((c >= 50) && (c <= 55)))) {
			return false
		}
	}
	return true
}

var __goscriptAwait: any

if ($.isMainScript(import.meta)) {
	await main()
}

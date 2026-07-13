// Generated file based on main.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as chacha20poly1305 from "@goscript/golang.org/x/crypto/chacha20poly1305/index.js"

import * as cipher from "@goscript/crypto/cipher/index.js"
import "@goscript/bytes/index.js"
import "@goscript/golang.org/x/crypto/chacha20poly1305/index.js"
import "@goscript/crypto/cipher/index.js"

export async function main(): globalThis.Promise<void> {
	let key: $.Slice<number> = $.makeSlice<number>(chacha20poly1305.KeySize, undefined, "byte")
	let nonce: $.Slice<number> = $.makeSlice<number>(chacha20poly1305.NonceSize, undefined, "byte")
	let plaintext: $.Slice<number> = new Uint8Array([81, 85, 73, 67, 32, 112, 97, 121, 108, 111, 97, 100])

	let [aead, err] = chacha20poly1305.New(key)
	if (err != null) {
		$.panic((err as any))
	}

	let dst: $.Slice<number> = $.makeSlice<number>(2, 64, "byte")
	$.copy(dst, "hd")
	let alias: $.Slice<number> = $.goSlice(dst, undefined, $.cap(dst))
	let sealed: $.Slice<number> = await $.pointerValue<Exclude<cipher.AEAD, null>>(aead).Seal(dst, nonce, plaintext, null)

	$.println("alias sees ciphertext:", bytes.Equal($.goSlice(alias, $.len(dst), $.len(sealed)), $.goSlice(sealed, $.len(dst), undefined)))
}

if ($.isMainScript(import.meta)) {
	await main()
}

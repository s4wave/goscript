// Generated file based on root_unix.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as os from "@goscript/os/index.js"

import * as filepath from "@goscript/path/filepath/index.js"

import * as strings from "@goscript/strings/index.js"

import type * as crypto from "@goscript/crypto/index.js"

import * as pkix from "@goscript/crypto/x509/pkix/index.js"

import * as asn1 from "@goscript/encoding/asn1/index.js"

import type * as io from "@goscript/io/index.js"

import * as big from "@goscript/math/big/index.js"

import * as net from "@goscript/net/index.js"

import * as url from "@goscript/net/url/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_cert_pool from "./cert_pool.gs.ts"

import * as __goscript_oid from "./oid.gs.ts"

import * as __goscript_root_wasm from "./root_wasm.gs.ts"

import * as __goscript_verify from "./verify.gs.ts"

import * as __goscript_x509 from "./x509.gs.ts"

import * as __goscript_x509_string from "./x509_string.gs.ts"
import "@goscript/io/fs/index.js"
import "@goscript/os/index.js"
import "@goscript/path/filepath/index.js"
import "@goscript/strings/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/math/big/index.js"
import "@goscript/net/index.js"
import "@goscript/net/url/index.js"
import "@goscript/time/index.js"
import "./cert_pool.gs.ts"
import "./oid.gs.ts"
import "./root_wasm.gs.ts"
import "./verify.gs.ts"
import "./x509.gs.ts"
import "./x509_string.gs.ts"

export const certFileEnv: string = "SSL_CERT_FILE"

export const certDirEnv: string = "SSL_CERT_DIR"

export async function loadSystemRoots(): globalThis.Promise<[__goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null, $.GoError]> {
	let roots: __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null = __goscript_cert_pool.NewCertPool()

	let files: $.Slice<string> = __goscript_root_wasm.certFiles
	{
		let f = os.Getenv("SSL_CERT_FILE")
		if (!$.stringEqual(f, "")) {
			files = $.arrayToSlice<string>([f])
		}
	}

	let firstErr: $.GoError = null as $.GoError
	for (let __goscriptRangeTarget0 = files, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let file = __goscriptRangeTarget0![__rangeIndex]
		let __goscriptTuple0: any = os.ReadFile(file)
		let data: $.Slice<number> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err == null) {
			await __goscript_cert_pool.CertPool.prototype.AppendCertsFromPEM.call(roots, data)
			break
		}
		if ((firstErr == null) && !os.IsNotExist($.pointerValueOrNil(err)!)) {
			firstErr = err
		}
	}

	let dirs: $.Slice<string> = __goscript_root_wasm.certDirectories
	{
		let d = os.Getenv("SSL_CERT_DIR")
		if (!$.stringEqual(d, "")) {
			// OpenSSL and BoringSSL both use ":" as the SSL_CERT_DIR separator.
			// See:
			//  * https://golang.org/issue/35325
			//  * https://www.openssl.org/docs/man1.0.2/man1/c_rehash.html
			dirs = strings.Split(d, ":")
		}
	}

	for (let __goscriptRangeTarget2 = dirs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let directory = __goscriptRangeTarget2![__rangeIndex]
		let __goscriptTuple1: any = await readUniqueDirectoryEntries(directory)
		let fis: $.Slice<fs.DirEntry | null> = __goscriptTuple1[0]
		let err = __goscriptTuple1[1]
		if (err != null) {
			if ((firstErr == null) && !os.IsNotExist($.pointerValueOrNil(err)!)) {
				firstErr = err
			}
			continue
		}
		for (let __goscriptRangeTarget1 = fis, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
			let fi = __goscriptRangeTarget1![__rangeIndex]
			let __goscriptTuple2: any = os.ReadFile((directory + "/") + await $.pointerValue<Exclude<fs.DirEntry, null>>(fi).Name())
			let data: $.Slice<number> = __goscriptTuple2[0]
			let __goscriptShadow0 = __goscriptTuple2[1]
			if (__goscriptShadow0 == null) {
				await __goscript_cert_pool.CertPool.prototype.AppendCertsFromPEM.call(roots, data)
			}
		}
	}

	if ((__goscript_cert_pool.CertPool.prototype.len.call(roots) > 0) || (firstErr == null)) {
		return [roots, null]
	}

	return [null, firstErr]
}

export async function readUniqueDirectoryEntries(dir: string): globalThis.Promise<[$.Slice<fs.DirEntry | null>, $.GoError]> {
	let __goscriptTuple3: any = os.ReadDir(dir)
	let files: $.Slice<os.DirEntry> = __goscriptTuple3[0]
	let err = __goscriptTuple3[1]
	if (err != null) {
		return [null, err]
	}
	let uniq: $.Slice<os.DirEntry> = $.goSlice(files, undefined, 0)
	for (let __goscriptRangeTarget3 = files, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
		let f = __goscriptRangeTarget3![__rangeIndex]
		if (!await isSameDirSymlink(f, dir)) {
			uniq = $.append(uniq, f)
		}
	}
	return [uniq, null]
}

export async function isSameDirSymlink(f: fs.DirEntry | null, dir: string): globalThis.Promise<boolean> {
	if ($.uint((await $.pointerValue<Exclude<fs.DirEntry, null>>(f).Type() & fs.ModeSymlink), 32) == $.uint(0, 32)) {
		return false
	}
	let [target, err] = os.Readlink(filepath.Join(dir, await $.pointerValue<Exclude<fs.DirEntry, null>>(f).Name()))
	return (err == null) && !strings.Contains(target, "/")
}

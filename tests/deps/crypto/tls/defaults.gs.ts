// Generated file based on defaults.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as slices from "@goscript/slices/index.js"

import "@goscript/unsafe/index.js"

import * as __goscript_cipher_suites from "./cipher_suites.gs.ts"

import * as __goscript_common from "./common.gs.ts"

import * as __goscript_common_string from "./common_string.gs.ts"
import "@goscript/internal/godebug/index.js"
import "@goscript/slices/index.js"
import "./cipher_suites.gs.ts"
import "./common.gs.ts"
import "./common_string.gs.ts"

export let tlsmlkem: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("tlsmlkem")

export function __goscript_set_tlsmlkem(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	tlsmlkem = __goscriptValue
}

export let tlssecpmlkem: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("tlssecpmlkem")

export function __goscript_set_tlssecpmlkem(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	tlssecpmlkem = __goscriptValue
}

export function defaultCurvePreferences(): $.Slice<__goscript_common.CurveID> {
	switch (true) {
		case $.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(tlsmlkem)), "0"):
		{
			return $.arrayToSlice<__goscript_common.CurveID>([$.uint(29, 16), $.uint(23, 16), $.uint(24, 16), $.uint(25, 16)])
			break
		}
		case $.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(tlssecpmlkem)), "0"):
		{
			return $.arrayToSlice<__goscript_common.CurveID>([$.uint(4588, 16), $.uint(29, 16), $.uint(23, 16), $.uint(24, 16), $.uint(25, 16)])
			break
		}
		default:
		{
			return $.arrayToSlice<__goscript_common.CurveID>([$.uint(4588, 16), $.uint(4587, 16), $.uint(4589, 16), $.uint(29, 16), $.uint(23, 16), $.uint(24, 16), $.uint(25, 16)])
			break
		}
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function defaultSupportedSignatureAlgorithms(): $.Slice<__goscript_common.SignatureScheme> {
	return $.arrayToSlice<__goscript_common.SignatureScheme>([$.uint(2052, 16), $.uint(1027, 16), $.uint(2055, 16), $.uint(2053, 16), $.uint(2054, 16), $.uint(1025, 16), $.uint(1281, 16), $.uint(1537, 16), $.uint(1283, 16), $.uint(1539, 16), $.uint(513, 16), $.uint(515, 16)])
}

export let tlsrsakex: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("tlsrsakex")

export function __goscript_set_tlsrsakex(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	tlsrsakex = __goscriptValue
}

export let tls3des: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("tls3des")

export function __goscript_set_tls3des(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	tls3des = __goscriptValue
}

export function supportedCipherSuites(aesGCMPreferred: boolean): $.Slice<number> {
	if (aesGCMPreferred) {
		return (slices.Clone(__goscript_cipher_suites.cipherSuitesPreferenceOrder) as $.Slice<number>)
	} else {
		return (slices.Clone(__goscript_cipher_suites.cipherSuitesPreferenceOrderNoAES) as $.Slice<number>)
	}
	throw new globalThis.Error("goscript: unreachable return")
}

export function defaultCipherSuites(aesGCMPreferred: boolean): $.Slice<number> {
	let cipherSuites: $.Slice<number> = supportedCipherSuites(aesGCMPreferred)
	return (slices.DeleteFunc(cipherSuites, $.functionValue((c: number): boolean => {
		return ($.mapGet<number, boolean, boolean>(__goscript_cipher_suites.disabledCipherSuites, $.uint(c, 16), false)[0] || ((!$.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(tlsrsakex)), "1")) && $.mapGet<number, boolean, boolean>(__goscript_cipher_suites.rsaKexCiphers, $.uint(c, 16), false)[0])) || ((!$.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(tls3des)), "1")) && $.mapGet<number, boolean, boolean>(__goscript_cipher_suites.tdesCiphers, $.uint(c, 16), false)[0])
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint16" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } as $.FunctionTypeInfo))) as $.Slice<number>)
}

export var defaultCipherSuitesTLS13: $.Slice<number>

export function __goscript_init_defaultCipherSuitesTLS13(): void {
	if (((defaultCipherSuitesTLS13) as any) === undefined) {
		defaultCipherSuitesTLS13 = $.arrayToSlice<number>([$.uint(4865, 16), $.uint(4866, 16), $.uint(4867, 16)])
	}
}

export function __goscript_get_defaultCipherSuitesTLS13(): $.Slice<number> {
	if (((defaultCipherSuitesTLS13) as any) === undefined) {
		__goscript_init_defaultCipherSuitesTLS13()
	}
	return defaultCipherSuitesTLS13
}

export function __goscript_set_defaultCipherSuitesTLS13(__goscriptValue: $.Slice<number>): void {
	defaultCipherSuitesTLS13 = __goscriptValue
}

export var defaultCipherSuitesTLS13NoAES: $.Slice<number>

export function __goscript_init_defaultCipherSuitesTLS13NoAES(): void {
	if (((defaultCipherSuitesTLS13NoAES) as any) === undefined) {
		defaultCipherSuitesTLS13NoAES = $.arrayToSlice<number>([$.uint(4867, 16), $.uint(4865, 16), $.uint(4866, 16)])
	}
}

export function __goscript_get_defaultCipherSuitesTLS13NoAES(): $.Slice<number> {
	if (((defaultCipherSuitesTLS13NoAES) as any) === undefined) {
		__goscript_init_defaultCipherSuitesTLS13NoAES()
	}
	return defaultCipherSuitesTLS13NoAES
}

export function __goscript_set_defaultCipherSuitesTLS13NoAES(__goscriptValue: $.Slice<number>): void {
	defaultCipherSuitesTLS13NoAES = __goscriptValue
}

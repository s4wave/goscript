// Generated file based on root.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as godebug from "@goscript/internal/godebug/index.js"

import * as sync from "@goscript/sync/index.js"

import "@goscript/unsafe/index.js"

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

import * as __goscript_root_unix from "./root_unix.gs.ts"

import * as __goscript_verify from "./verify.gs.ts"

import * as __goscript_x509 from "./x509.gs.ts"

import * as __goscript_x509_string from "./x509_string.gs.ts"
import "@goscript/internal/godebug/index.js"
import "@goscript/sync/index.js"
import "@goscript/crypto/x509/pkix/index.js"
import "@goscript/encoding/asn1/index.js"
import "@goscript/math/big/index.js"
import "@goscript/net/index.js"
import "@goscript/net/url/index.js"
import "@goscript/time/index.js"
import "./cert_pool.gs.ts"
import "./oid.gs.ts"
import "./root_unix.gs.ts"
import "./verify.gs.ts"
import "./x509.gs.ts"
import "./x509_string.gs.ts"

export let once: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set_once(__goscriptValue: sync.Once): void {
	once.value = __goscriptValue
}

export let systemRootsMu: $.VarRef<sync.RWMutex> = $.varRef($.markAsStructValue(new sync.RWMutex()))

export function __goscript_set_systemRootsMu(__goscriptValue: sync.RWMutex): void {
	systemRootsMu.value = __goscriptValue
}

export let systemRoots: __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null = null as __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null

export function __goscript_set_systemRoots(__goscriptValue: __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null): void {
	systemRoots = __goscriptValue
}

export let systemRootsErr: $.GoError = null as $.GoError

export function __goscript_set_systemRootsErr(__goscriptValue: $.GoError): void {
	systemRootsErr = __goscriptValue
}

export let fallbacksSet: boolean = false

export function __goscript_set_fallbacksSet(__goscriptValue: boolean): void {
	fallbacksSet = __goscriptValue
}

export let useFallbackRoots: boolean = false

export function __goscript_set_useFallbackRoots(__goscriptValue: boolean): void {
	useFallbackRoots = __goscriptValue
}

export async function systemRootsPool(): globalThis.Promise<__goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null> {
	using __defer = new $.DisposableStack()
	await once.value.Do(initSystemRoots)
	await systemRootsMu.value.RLock()
	__defer.defer(() => { systemRootsMu.value.RUnlock() })
	return systemRoots
}

export async function initSystemRoots(): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	await systemRootsMu.value.Lock()
	__defer.defer(() => { systemRootsMu.value.Unlock() })

	let fallbackRoots: __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null = systemRoots
	let __goscriptTuple0: any = await __goscript_root_unix.loadSystemRoots()
	systemRoots = __goscriptTuple0[0]
	systemRootsErr = __goscriptTuple0[1]
	if (systemRootsErr != null) {
		systemRoots = null
	}

	if (fallbackRoots == null) {
		return
	}

	let systemCertsAvail = (systemRoots != null) && ((__goscript_cert_pool.CertPool.prototype.len.call(systemRoots) > 0) || $.pointerValue<__goscript_cert_pool.CertPool>(systemRoots).systemPool)

	if (!useFallbackRoots && systemCertsAvail) {
		return
	}

	if (useFallbackRoots && systemCertsAvail) {
		godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(x509usefallbackroots))
	}

	let __goscriptAssign0_0: __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null = fallbackRoots
	let __goscriptAssign0_1: $.GoError = null
	systemRoots = __goscriptAssign0_0
	systemRootsErr = __goscriptAssign0_1
}

export let x509usefallbackroots: godebug.Setting | $.VarRef<godebug.Setting> | null = godebug.New("x509usefallbackroots")

export function __goscript_set_x509usefallbackroots(__goscriptValue: godebug.Setting | $.VarRef<godebug.Setting> | null): void {
	x509usefallbackroots = __goscriptValue
}

export async function SetFallbackRoots(roots: __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null): globalThis.Promise<void> {
	using __defer = new $.DisposableStack()
	if (roots == null) {
		$.panic("roots must be non-nil")
	}

	await systemRootsMu.value.Lock()
	__defer.defer(() => { systemRootsMu.value.Unlock() })

	if (fallbacksSet) {
		$.panic("SetFallbackRoots has already been called")
	}
	fallbacksSet = true

	// Handle case when initSystemRoots was not yet executed.
	// We handle that specially instead of calling loadSystemRoots, to avoid
	// spending excessive amount of cpu here, since the SetFallbackRoots in most cases
	// is going to be called at program startup.
	if ((systemRoots == null) && (systemRootsErr == null)) {
		systemRoots = roots
		useFallbackRoots = $.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(x509usefallbackroots)), "1")
		return
	}

	await once.value.Do($.functionValue((): void => {
		$.panic("unreachable")
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))

	let forceFallbackRoots = $.stringEqual(godebug.Setting.prototype.Value.call($.pointerValue<godebug.Setting>(x509usefallbackroots)), "1")
	let systemCertsAvail = (systemRoots != null) && ((__goscript_cert_pool.CertPool.prototype.len.call(systemRoots) > 0) || $.pointerValue<__goscript_cert_pool.CertPool>(systemRoots).systemPool)

	if (!forceFallbackRoots && systemCertsAvail) {
		return
	}

	if (forceFallbackRoots && systemCertsAvail) {
		godebug.Setting.prototype.IncNonDefault.call($.pointerValue<godebug.Setting>(x509usefallbackroots))
	}

	let __goscriptAssign1_0: __goscript_cert_pool.CertPool | $.VarRef<__goscript_cert_pool.CertPool> | null = roots
	let __goscriptAssign1_1: $.GoError = null
	systemRoots = __goscriptAssign1_0
	systemRootsErr = __goscriptAssign1_1
}

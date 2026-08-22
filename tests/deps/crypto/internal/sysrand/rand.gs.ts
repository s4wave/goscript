// Generated file based on rand.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as os from "@goscript/os/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

import * as time from "@goscript/time/index.js"

import "@goscript/unsafe/index.js"

import * as __goscript_rand_js from "./rand_js.gs.ts"
import "@goscript/os/index.js"
import "@goscript/sync/index.js"
import "@goscript/sync/atomic/index.js"
import "@goscript/time/index.js"
import "./rand_js.gs.ts"

export let firstUse: $.VarRef<atomic.Bool> = $.varRef($.markAsStructValue(new atomic.Bool()))

export function __goscript_set_firstUse(__goscriptValue: atomic.Bool): void {
	firstUse.value = __goscriptValue
}

export function warnBlocked(): void {
	$.println("crypto/rand: blocked for 60 seconds waiting to read random data from the kernel")
}

export function fatal(_p0: string): void {
}

export let testingOnlyFailRead: boolean = false

export function __goscript_set_testingOnlyFailRead(__goscriptValue: boolean): void {
	testingOnlyFailRead = __goscriptValue
}

export function Read(b: $.Slice<number>): void {
	using __defer = new $.DisposableStack()
	if (firstUse.value.CompareAndSwap(false, true)) {
		// First use of randomness. Start timer to warn about
		// being blocked on entropy not being available.
		let t: time.Timer | $.VarRef<time.Timer> | null = time.AfterFunc(60000000000n, warnBlocked)
		__defer.defer(() => { time.Timer.prototype.Stop.call($.pointerValue<time.Timer>(t)) })
	}
	{
		let err = __goscript_rand_js.read(b)
		if ((err != null) || testingOnlyFailRead) {
			let errStr: string = ""
			if (!testingOnlyFailRead) {
				errStr = $.pointerValue<Exclude<$.GoError, null>>(err).Error()
			} else {
				errStr = "testing simulated failure"
			}
			fatal("crypto/rand: failed to read random data (see https://go.dev/issue/66821): " + errStr)
			$.panic("unreachable")
		}
	}
}

export let urandomOnce: $.VarRef<sync.Once> = $.varRef($.markAsStructValue(new sync.Once()))

export function __goscript_set_urandomOnce(__goscriptValue: sync.Once): void {
	urandomOnce.value = __goscriptValue
}

export let urandomFile: os.File | $.VarRef<os.File> | null = null! as os.File | $.VarRef<os.File> | null

export function __goscript_set_urandomFile(__goscriptValue: os.File | $.VarRef<os.File> | null): void {
	urandomFile = __goscriptValue
}

export let urandomErr: $.GoError = null! as $.GoError

export function __goscript_set_urandomErr(__goscriptValue: $.GoError): void {
	urandomErr = __goscriptValue
}

export async function urandomRead(b: $.Slice<number>): globalThis.Promise<$.GoError> {
	await urandomOnce.value.Do($.functionValue((): void => {
		let __goscriptTuple0: any = os.Open("/dev/urandom")
		urandomFile = __goscriptTuple0[0]
		urandomErr = __goscriptTuple0[1]
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))
	if (urandomErr != null) {
		return urandomErr
	}
	while ($.len(b) > 0) {
		let [n, err] = os.File.prototype.Read.call($.pointerValue<os.File>(urandomFile), b)
		// Note that we don't ignore EAGAIN because it should not be possible to
		// hit for a blocking read from urandom, although there were
		// unreproducible reports of it at https://go.dev/issue/9205.
		if (err != null) {
			return err
		}
		b = $.goSlice(b, n, undefined)
	}
	return null
}
